import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionPresets } from '../motion/motionPresets';
import { useMotionSettings } from '../motion/MotionProvider';

// Section staging borrows rhythm ideas from GSAP ScrollTrigger demos shared on the GSAP forums.

gsap.registerPlugin(ScrollTrigger);

const setWillChange = (elements: HTMLElement[] | HTMLElement, value: string) => {
  const list = Array.isArray(elements) ? elements : [elements];
  list.forEach((element) => {
    element.style.willChange = value;
  });
};

const groupCardsByRow = (cards: HTMLElement[]) => {
  const rows = new Map<number, HTMLElement[]>();
  cards.forEach((card) => {
    const top = Math.round(card.offsetTop);
    const row = rows.get(top);
    if (row) {
      row.push(card);
    } else {
      rows.set(top, [card]);
    }
  });

  return Array.from(rows.entries())
    .sort(([a], [b]) => a - b)
    .map(([, rowCards]) => rowCards);
};

const getIsNarrow = () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false);

export function useMotion(containerRef: RefObject<HTMLElement | null>) {
  const { prefersReducedMotion, allowParallax, isTouch } = useMotionSettings();
  const [isNarrow, setIsNarrow] = useState(getIsNarrow);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => setIsNarrow(event.matches);
    setIsNarrow(media.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const motionScale = isTouch ? 0.6 : isNarrow ? 0.75 : 1;
    const staggerScale = isTouch || isNarrow ? 0.7 : 1;
    const parallaxScale = isTouch || isNarrow ? 0.55 : 1;
    const sectionY = motionPresets.section.distanceY * motionScale;
    const sectionX = motionPresets.section.distanceX * motionScale;
    const sectionRotate = motionPresets.section.rotate * motionScale;
    const cardY = motionPresets.card.distanceY * motionScale;
    const cardX = motionPresets.card.distanceX * motionScale;
    const cardRotate = motionPresets.card.rotate * motionScale;
    const cardStagger = motionPresets.card.stagger * staggerScale;
    const timelineX = motionPresets.timeline.distanceX * motionScale;
    const timelineRotate = motionPresets.timeline.rotate * motionScale;
    const parallaxDistance = motionPresets.parallax.distance * parallaxScale;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        const reducedTargets = Array.from(
          root.querySelectorAll<HTMLElement>('.reveal, [data-animate-card], [data-timeline-item]'),
        );
        reducedTargets.forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              ease: 'none',
              scrollTrigger: { trigger: element, start: 'top 90%', once: true },
            },
          );
        });
        return;
      }

      const sections = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));

      sections.forEach((section, index) => {
        const heading = section.querySelector<HTMLElement>('.section-heading');
        const introContent = section.querySelector<HTMLElement>('.page-intro-content');
        const contentNodes = introContent
          ? [introContent]
          : Array.from(section.children).filter((child) => child !== heading);

        const xOffset = (index % 2 === 0 ? 1 : -1) * sectionX;
        const rotate = (index % 2 === 0 ? 1 : -1) * sectionRotate;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        });

        if (heading) {
          tl.fromTo(
            heading,
            { opacity: 0, y: sectionY, x: xOffset, rotateZ: rotate },
            {
              opacity: 1,
              y: 0,
              x: 0,
              rotateZ: 0,
              duration: motionPresets.section.duration,
              ease: motionPresets.section.ease,
              onStart: () => setWillChange(heading, 'opacity, transform'),
              onComplete: () => setWillChange(heading, ''),
            },
          );
        }

        if (contentNodes.length) {
          tl.fromTo(
            contentNodes,
            {
              opacity: 0,
              y: sectionY * 0.6,
              rotateZ: rotate * 0.6,
            },
            {
              opacity: 1,
              y: 0,
              rotateZ: 0,
              duration: motionPresets.section.duration * 0.85,
              ease: motionPresets.section.ease,
              stagger: 0.08,
              onStart: () => setWillChange(contentNodes as HTMLElement[], 'opacity, transform'),
              onComplete: () => setWillChange(contentNodes as HTMLElement[], ''),
            },
            heading ? '-=0.45' : 0,
          );
        }
      });

      const cardGroups = Array.from(root.querySelectorAll<HTMLElement>('.grid, .timeline-grid, .cert-grid'));

      cardGroups.forEach((group) => {
        const cards = Array.from(group.querySelectorAll<HTMLElement>('[data-animate-card]')).filter(
          (card) => !card.dataset.timelineItem,
        );
        if (!cards.length) return;

        const rows = groupCardsByRow(cards);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });

        rows.forEach((row, rowIndex) => {
          const direction = rowIndex % 2 === 0 ? 1 : -1;
          tl.fromTo(
            row,
            {
              opacity: 0,
              y: cardY,
              x: cardX * direction,
              rotateZ: cardRotate * direction,
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              rotateZ: 0,
              duration: motionPresets.card.duration,
              ease: motionPresets.card.ease,
              stagger: 0.06,
              onStart: () => setWillChange(row, 'opacity, transform'),
              onComplete: () => setWillChange(row, ''),
            },
            rowIndex * cardStagger,
          );
        });
      });

      const standaloneCards = Array.from(root.querySelectorAll<HTMLElement>('[data-animate-card]')).filter((card) => {
        if (card.dataset.timelineItem) return false;
        return !card.closest('.grid, .timeline-grid, .cert-grid');
      });

      standaloneCards.forEach((card, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: cardY,
            x: cardX * direction,
            rotateZ: cardRotate * direction,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotateZ: 0,
            duration: motionPresets.card.duration,
            ease: motionPresets.card.ease,
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            onStart: () => setWillChange(card, 'opacity, transform'),
            onComplete: () => setWillChange(card, ''),
          },
        );
      });

      const timelineItems = Array.from(root.querySelectorAll<HTMLElement>('[data-timeline-item]'));
      timelineItems.forEach((item, index) => {
        const direction = item.dataset.direction === 'left' ? -1 : 1;
        const rotate = (index % 2 === 0 ? 1 : -1) * timelineRotate;
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: timelineX * direction,
            rotateZ: rotate,
          },
          {
            opacity: 1,
            x: 0,
            rotateZ: 0,
            duration: motionPresets.timeline.duration,
            ease: motionPresets.timeline.ease,
            scrollTrigger: { trigger: item, start: 'top 85%', once: true },
            onStart: () => setWillChange(item, 'opacity, transform'),
            onComplete: () => setWillChange(item, ''),
          },
        );
      });

      const progressLine = root.querySelector<HTMLElement>('[data-timeline-progress]');
      const progressSection = root.querySelector<HTMLElement>('[data-timeline-section]');

      if (progressLine && progressSection) {
        gsap.fromTo(
          progressLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top',
            ease: 'none',
            scrollTrigger: {
              trigger: progressSection,
              start: 'top 80%',
              end: 'bottom 30%',
              scrub: true,
            },
          },
        );
      }

      if (allowParallax) {
        const parallaxItems = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
        parallaxItems.forEach((item) => {
          const speed = parseFloat(item.dataset.parallaxSpeed ?? '0.2');
          const axis = item.dataset.parallaxAxis === 'x' ? 'x' : 'y';
          const distance = parallaxDistance * speed;
          const trigger = item.closest<HTMLElement>('[data-parallax-root]') ?? item;

          gsap.fromTo(
            item,
            { [axis]: -distance },
            {
              [axis]: distance,
              ease: 'none',
              scrollTrigger: {
                trigger,
                start: 'top bottom',
                end: 'bottom top',
                scrub: motionPresets.parallax.scrub,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [allowParallax, containerRef, isNarrow, isTouch, prefersReducedMotion]);
}
