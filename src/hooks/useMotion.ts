import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createParallax } from '../lib/animations/helpers/createParallax';
import { createScrollReveal } from '../lib/animations/helpers/createScrollReveal';
import { createStaggerGrid } from '../lib/animations/helpers/createStaggerGrid';
import { createBidirectionalReveal } from '../lib/animations/helpers/createBidirectionalReveal';
import { splitTextToSpans } from '../lib/animations/helpers/splitText';
import { useMotionSettings } from '../motion/MotionProvider';

gsap.registerPlugin(ScrollTrigger);

export function useMotion(containerRef: RefObject<HTMLElement | null>) {
  const { prefersReducedMotion, allowParallax, isTouch } = useMotionSettings();

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    const sections = Array.from(root.querySelectorAll<HTMLElement>('.section'));
    const headingVariant = prefersReducedMotion ? 'fade' : 'heading';
    const subheadingVariant = prefersReducedMotion ? 'fade' : 'subheading';
    const headingStagger = prefersReducedMotion ? 0 : 0.06;
    sections.forEach((section) => {
      const heading = section.querySelector<HTMLElement>('.section-heading h2');
      const eyebrow = section.querySelector<HTMLElement>('.section-heading .eyebrow');
      const description = section.querySelector<HTMLElement>('.section-heading .section-description');

      if (heading) {
        const words = splitTextToSpans(heading);
        cleanups.push(
          createScrollReveal({
            targets: words.length ? words : heading,
            variant: headingVariant,
            trigger: section,
            stagger: headingStagger,
          }),
        );
      }

      if (eyebrow) {
        cleanups.push(
          createScrollReveal({
            targets: eyebrow,
            variant: subheadingVariant,
            trigger: section,
            stagger: prefersReducedMotion ? 0 : 0.04,
          }),
        );
      }

      if (description) {
        cleanups.push(
          createScrollReveal({
            targets: description,
            variant: subheadingVariant,
            trigger: section,
            stagger: prefersReducedMotion ? 0 : 0.04,
          }),
        );
      }
    });

    const intro = root.querySelector<HTMLElement>('.page-intro');
    if (intro) {
      const title = intro.querySelector<HTMLElement>('h1');
      const words = splitTextToSpans(title);
      const lead = intro.querySelector<HTMLElement>('.lead');

      if (title) {
        cleanups.push(
          createScrollReveal({
            targets: words.length ? words : title,
            variant: headingVariant,
            trigger: intro,
            stagger: headingStagger,
          }),
        );
      }
      if (lead) {
        cleanups.push(
          createScrollReveal({
            targets: lead,
            variant: subheadingVariant,
            trigger: intro,
            stagger: prefersReducedMotion ? 0 : 0.04,
          }),
        );
      }
    }

    const grids = Array.from(root.querySelectorAll<HTMLElement>('.grid, .timeline-grid, .cert-grid, .project-grid'));
    grids.forEach((grid) => {
      // Standard stagger cards (Exclude the special parallax cards)
      const staggerCards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]:not([data-parallax-card])'));
      if (staggerCards.length) {
        cleanups.push(
          createStaggerGrid({
            cards: staggerCards,
            enterVariant: prefersReducedMotion ? 'fade' : 'card',
            stagger: prefersReducedMotion ? 0 : 0.08,
            once: false, // Enable persistent/replayable animations for all grids
          }),
        );
      }

      // Special bidirectional cards (Experience timeline items)
      // These need to enter AND leave symmetrically
      const bidirCards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card][data-parallax-card="true"]'));
      if (bidirCards.length) {
        bidirCards.forEach((card) => {
          // If reduced motion, we skip the animation (GSAP helper can handle it or we skip calling it)
          // The helper normally sets initial opacity: 0. 
          // So for reduced motion, we just ensure they are visible.
          if (prefersReducedMotion) {
            card.style.opacity = '1';
            card.style.transform = 'none';
            return;
          }

          cleanups.push(
            createBidirectionalReveal({
              element: card,
              start: 'top 85%',
              end: 'bottom 15%',
              yOffset: 50, // 50px as requested in the "bullet" prompt (though user said 50px for bullet, applying here for card)
              duration: 0.6,
            })
          );
        });
      }
    });

    const timelineProgress = root.querySelector<HTMLElement>('[data-timeline-progress]');
    const timelineSection = root.querySelector<HTMLElement>('[data-timeline-section]');
    if (timelineProgress && timelineSection && !prefersReducedMotion) {
      const tween = gsap.fromTo(
        timelineProgress,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: timelineSection,
            start: 'top 80%',
            end: 'bottom 30%',
            scrub: true,
          },
        },
      );
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    }

    if (allowParallax && !prefersReducedMotion) {
      const parallaxItems = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
      parallaxItems.forEach((item) => {
        const speed = parseFloat(item.dataset.parallaxSpeed ?? '0.2');
        const axis = item.dataset.parallaxAxis === 'x' ? 'x' : 'y';
        cleanups.push(
          createParallax({
            layers: [{ element: item, strength: 120 * speed, axis }],
            mouse: false,
            scroll: true,
            root: item.closest<HTMLElement>('[data-parallax-root]') ?? item,
          }),
        );
      });
    }

    if (!prefersReducedMotion && !isTouch) {
      const badges = Array.from(root.querySelectorAll<HTMLElement>('.badge, .pill'));
      badges.slice(0, 24).forEach((badge) => {
        const tween = gsap.to(badge, {
          opacity: gsap.utils.random(0.85, 1),
          scale: gsap.utils.random(0.98, 1),
          duration: gsap.utils.random(3, 6),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: gsap.utils.random(0, 1.5),
        });
        cleanups.push(() => tween.kill());
      });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ScrollTrigger.refresh();
    };
  }, [allowParallax, containerRef, isTouch, prefersReducedMotion]);
}
