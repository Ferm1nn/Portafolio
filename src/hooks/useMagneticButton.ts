import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { motionPresets } from '../motion/motionPresets';
import { useMotionSettings } from '../motion/MotionProvider';

type MagneticOptions = {
  maxOffset?: number;
};

export function useMagneticButton(ref: RefObject<HTMLElement | null>, options: MagneticOptions = {}) {
  const { prefersReducedMotion, isTouch } = useMotionSettings();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion || isTouch) return;

    const maxOffset = options.maxOffset ?? motionPresets.magnetic.maxOffset;
    let frame = 0;
    let latestEvent: PointerEvent | null = null;
    let bounds = element.getBoundingClientRect();

    const setX = gsap.quickTo(element, 'x', {
      duration: motionPresets.magnetic.duration,
      ease: motionPresets.magnetic.ease,
    });
    const setY = gsap.quickTo(element, 'y', {
      duration: motionPresets.magnetic.duration,
      ease: motionPresets.magnetic.ease,
    });

    const updateBounds = () => {
      bounds = element.getBoundingClientRect();
    };

    const animate = () => {
      frame = 0;
      if (!latestEvent) return;
      const x = latestEvent.clientX - bounds.left;
      const y = latestEvent.clientY - bounds.top;
      const dx = x - bounds.width / 2;
      const dy = y - bounds.height / 2;
      const distance = Math.min(1, Math.hypot(dx, dy) / (bounds.width / 2));
      const offsetX = (dx / bounds.width) * maxOffset * distance;
      const offsetY = (dy / bounds.height) * maxOffset * distance;

      setX(offsetX);
      setY(offsetY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      latestEvent = event;
      if (frame) return;
      frame = window.requestAnimationFrame(animate);
    };

    const handlePointerEnter = () => {
      updateBounds();
      element.style.willChange = 'transform';
    };

    const reset = () => {
      setX(0);
      setY(0);
      element.style.willChange = '';
    };

    element.addEventListener('pointerenter', handlePointerEnter);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointerdown', reset);

    window.addEventListener('resize', updateBounds);

    return () => {
      element.removeEventListener('pointerenter', handlePointerEnter);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointerdown', reset);
      window.removeEventListener('resize', updateBounds);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isTouch, options.maxOffset, prefersReducedMotion, ref]);
}
