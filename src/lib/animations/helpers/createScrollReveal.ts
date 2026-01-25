import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type ScrollRevealVariant = 'fade' | 'rise' | 'heading' | 'subheading' | 'card';

type ScrollRevealOptions = {
  targets: gsap.TweenTarget;
  variant?: ScrollRevealVariant;
  stagger?: number;
  trigger?: Element | gsap.TweenTarget;
  start?: string;
  once?: boolean;
};

const getVariant = (variant: ScrollRevealVariant) => {
  switch (variant) {
    case 'heading':
      return { opacity: 0, y: 20, scale: 0.98 };
    case 'subheading':
      return { opacity: 0, y: 14 };
    case 'card':
      return { opacity: 0, y: 18, scale: 0.98 };
    case 'fade':
      return { opacity: 0 };
    case 'rise':
    default:
      return { opacity: 0, y: 16 };
  }
};

export function createScrollReveal({
  targets,
  variant = 'rise',
  stagger = 0.08,
  trigger,
  start = 'top 85%',
  once = true,
}: ScrollRevealOptions) {
  const elements = gsap.utils.toArray<HTMLElement>(targets).filter((element) => {
    if (!element) return false;
    if (element.dataset.revealInit === 'true') return false;
    element.dataset.revealInit = 'true';
    return true;
  });

  if (!elements.length) {
    return () => undefined;
  }

  const fromVars = getVariant(variant);

  const tween = gsap.fromTo(
    elements,
    fromVars,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateZ: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: (trigger ?? elements[0]) as Element,
        start,
        once,
      },
      onStart: () => {
        elements.forEach((element) => {
          element.style.willChange = 'opacity, transform';
        });
      },
      onComplete: () => {
        elements.forEach((element) => {
          element.style.willChange = '';
        });
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    elements.forEach((element) => {
      element.style.willChange = '';
      delete element.dataset.revealInit;
    });
  };
}
