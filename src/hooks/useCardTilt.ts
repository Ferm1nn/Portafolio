import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { motionPresets } from '../motion/motionPresets';
import { useMotionSettings } from '../motion/MotionProvider';

type TiltOptions = {
  maxRotate?: number;
  hoverScale?: number;
  pressScale?: number;
};

export function useCardTilt(ref: RefObject<HTMLElement | null>, options: TiltOptions = {}) {
  const { allowTilt, prefersReducedMotion } = useMotionSettings();

  useLayoutEffect(() => {
    const card = ref.current;
    if (!card || prefersReducedMotion || !allowTilt) return;

    const maxRotate = options.maxRotate ?? motionPresets.tilt.maxRotate;
    const hoverScale = options.hoverScale ?? motionPresets.tilt.hoverScale;
    const pressScale = options.pressScale ?? motionPresets.tilt.pressScale;

    let bounds = card.getBoundingClientRect();
    let frame = 0;
    let latestEvent: PointerEvent | null = null;
    let isHovered = false;
    let isPressed = false;

    const setRotateX = gsap.quickSetter(card, 'rotateX', 'deg');
    const setRotateY = gsap.quickSetter(card, 'rotateY', 'deg');
    const setScale = gsap.quickSetter(card, 'scale');
    const setSheenX = gsap.quickSetter(card, '--sheen-x', '%');
    const setSheenY = gsap.quickSetter(card, '--sheen-y', '%');
    const setSheenOpacity = gsap.quickTo(card, '--sheen-opacity', { duration: 0.2, ease: 'power2.out' });

    gsap.set(card, { transformPerspective: 900 });

    const updateBounds = () => {
      bounds = card.getBoundingClientRect();
    };

    let resetTween: gsap.core.Tween | null = null;

    const animate = () => {
      frame = 0;
      if (!latestEvent) return;
      const x = latestEvent.clientX - bounds.left;
      const y = latestEvent.clientY - bounds.top;
      const dx = x / bounds.width - 0.5;
      const dy = y / bounds.height - 0.5;
      const rotateX = dy * -maxRotate;
      const rotateY = dx * maxRotate;

      resetTween?.kill();
      resetTween = null;
      setRotateX(rotateX);
      setRotateY(rotateY);
      setScale(isPressed ? pressScale : hoverScale);
      setSheenX((x / bounds.width) * 100);
      setSheenY((y / bounds.height) * 100);
    };

    const handlePointerMove = (event: PointerEvent) => {
      latestEvent = event;
      if (frame) return;
      frame = window.requestAnimationFrame(animate);
    };

    const handlePointerEnter = (event: PointerEvent) => {
      isHovered = true;
      updateBounds();
      latestEvent = event;
      resetTween?.kill();
      resetTween = null;
      card.style.willChange = 'transform';
      setSheenOpacity(0.65);
      if (!frame) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const resetTilt = () => {
      resetTween?.kill();
      resetTween = null;
      resetTween = gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
        onComplete: () => {
          resetTween = null;
        },
      });
      setSheenX(50);
      setSheenY(50);
      setSheenOpacity(0);
      card.style.willChange = '';
    };

    const handlePointerLeave = () => {
      isHovered = false;
      isPressed = false;
      resetTilt();
    };

    const handlePointerDown = () => {
      isPressed = true;
      resetTween?.kill();
      resetTween = null;
      setScale(pressScale);
    };

    const handlePointerUp = () => {
      isPressed = false;
      setScale(isHovered ? hoverScale : 1);
    };

    card.addEventListener('pointerenter', handlePointerEnter);
    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', handlePointerLeave);
    card.addEventListener('pointerdown', handlePointerDown);
    card.addEventListener('pointerup', handlePointerUp);
    card.addEventListener('pointercancel', handlePointerLeave);

    window.addEventListener('resize', updateBounds);

    return () => {
      card.removeEventListener('pointerenter', handlePointerEnter);
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerleave', handlePointerLeave);
      card.removeEventListener('pointerdown', handlePointerDown);
      card.removeEventListener('pointerup', handlePointerUp);
      card.removeEventListener('pointercancel', handlePointerLeave);
      window.removeEventListener('resize', updateBounds);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [allowTilt, options.maxRotate, options.hoverScale, options.pressScale, prefersReducedMotion, ref]);
}
