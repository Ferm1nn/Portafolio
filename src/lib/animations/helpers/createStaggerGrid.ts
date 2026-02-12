import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type StaggerGridOptions = {
  cards: HTMLElement[];
  enterVariant?: 'card' | 'fade';
  start?: string;
  once?: boolean;
  stagger?: number;
};

export function createStaggerGrid({
  cards,
  enterVariant = 'card',
  start = 'top 85%',
  once = true,
  stagger = 0.08,
}: StaggerGridOptions) {
  const elements = cards.filter((card) => {
    if (card.dataset.gridInit === 'true') return false;
    card.dataset.gridInit = 'true';
    return true;
  });

  if (!elements.length) {
    return () => undefined;
  }

  const fromVars =
    enterVariant === 'fade'
      ? { opacity: 0 }
      : {
        opacity: 0,
        y: 18,
        scale: 0.98,
        rotateZ: (index: number) => (index % 2 === 0 ? -3 : 3),
      };

  gsap.set(elements, fromVars);

  const trigger = ScrollTrigger.batch(elements, {
    start,
    once,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger,
        overwrite: 'auto',
      });
    },
    // Add reverse/replay logic if 'once' is false
    onLeave: (batch) => {
      if (once) return;
      gsap.to(batch, {
        opacity: 0,
        y: -18, // Slide UP when leaving top
        overwrite: 'auto',
        duration: 0.5,
        stagger,
      });
    },
    onEnterBack: (batch) => {
      if (once) return;
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger,
        overwrite: 'auto',
      });
    },
    onLeaveBack: (batch) => {
      if (once) return;
      gsap.to(batch, {
        opacity: 0,
        y: 18, // Slide DOWN when leaving bottom
        overwrite: 'auto',
        duration: 0.5,
        stagger,
      });
    },
  });

  return () => {
    const t = trigger as ScrollTrigger | ScrollTrigger[];
    if (Array.isArray(t)) {
      t.forEach((item) => item.kill());
    } else if (t && typeof t.kill === 'function') {
      t.kill();
    }
    elements.forEach((element) => {
      element.style.willChange = '';
      delete element.dataset.gridInit;
    });
  };
}
