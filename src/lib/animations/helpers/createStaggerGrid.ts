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
        onStart: () => {
          (batch as HTMLElement[]).forEach((element) => {
            element.style.willChange = 'opacity, transform';
          });
        },
        onComplete: () => {
          (batch as HTMLElement[]).forEach((element) => {
            element.style.willChange = '';
          });
        },
      });
    },
  });

  return () => {
    if (Array.isArray(trigger)) {
      trigger.forEach((item) => item.kill(true));
    } else if (trigger && typeof trigger.kill === 'function') {
      trigger.kill(true);
    }
    elements.forEach((element) => {
      element.style.willChange = '';
      delete element.dataset.gridInit;
    });
  };
}
