import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ParallaxLayer = {
  element: HTMLElement;
  strength: number;
  axis?: 'x' | 'y';
};

type ParallaxOptions = {
  layers: ParallaxLayer[];
  mouse?: boolean;
  scroll?: boolean;
  root?: HTMLElement | null;
};

export function createParallax({
  layers,
  mouse = true,
  scroll = true,
  root = null,
}: ParallaxOptions) {
  const activeLayers = layers.filter((layer) => {
    if (!layer.element) return false;
    if (layer.element.dataset.parallaxInit === 'true') return false;
    layer.element.dataset.parallaxInit = 'true';
    return true;
  });
  if (!activeLayers.length) {
    return () => undefined;
  }

  const setters = activeLayers.map((layer) => ({
    x: gsap.quickTo(layer.element, 'x', { duration: 0.6, ease: 'power3.out' }),
    y: gsap.quickTo(layer.element, 'y', { duration: 0.6, ease: 'power3.out' }),
  }));
  activeLayers.forEach((layer) => {
    layer.element.style.willChange = 'transform';
  });

  let frame = 0;
  let latestEvent: PointerEvent | null = null;

  const handlePointerMove = (event: PointerEvent) => {
    latestEvent = event;
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      if (!latestEvent) return;
      const dx = latestEvent.clientX / window.innerWidth - 0.5;
      const dy = latestEvent.clientY / window.innerHeight - 0.5;

      activeLayers.forEach((layer, index) => {
        const intensity = layer.strength;
        setters[index].x(dx * intensity);
        setters[index].y(dy * intensity);
      });
    });
  };

  const handlePointerLeave = () => {
    setters.forEach((setter) => {
      setter.x(0);
      setter.y(0);
    });
  };

  if (mouse) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
  }

  const scrollTriggers: ScrollTrigger[] = [];
  if (scroll) {
    activeLayers.forEach((layer) => {
      const axis = layer.axis ?? 'y';
      const distance = layer.strength;
      const trigger = root ?? layer.element;
      const tween = gsap.fromTo(
        layer.element,
        { [axis]: -distance },
        {
          [axis]: distance,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
      if (tween.scrollTrigger) {
        scrollTriggers.push(tween.scrollTrigger);
      }
    });
  }

  return () => {
    if (mouse) {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    }
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
    scrollTriggers.forEach((trigger) => trigger.kill(true));
    gsap.killTweensOf(activeLayers.map((layer) => layer.element));
    activeLayers.forEach((layer) => {
      layer.element.style.willChange = '';
      layer.element.style.transform = '';
      delete layer.element.dataset.parallaxInit;
    });
  };
}
