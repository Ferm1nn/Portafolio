import gsap from 'gsap';

type TiltLayer = {
  element: HTMLElement;
  depth: number;
};

type TiltCardOptions = {
  card: HTMLElement;
  layers?: TiltLayer[];
  glare?: HTMLElement | null;
  maxRotateX?: number;
  maxRotateY?: number;
  hoverScale?: number;
  pressScale?: number;
};

const LAYER_DEPTHS: Record<string, number> = {
  title: 18,
  badges: 26,
  bullets: 34,
  meta: 18,
};

const lerp = (current: number, target: number, ease: number) =>
  current + (target - current) * ease;

export function createTiltCard({
  card,
  layers,
  glare,
  maxRotateX = 8,
  maxRotateY = 10,
  hoverScale = 1.01,
  pressScale = 0.98,
}: TiltCardOptions) {
  if (card.dataset.tiltInit === 'true') {
    return () => undefined;
  }
  card.dataset.tiltInit = 'true';

  const resolvedLayers: TiltLayer[] =
    layers ??
    Array.from(card.querySelectorAll<HTMLElement>('[data-tilt-layer]')).map((element) => {
      const key = element.dataset.tiltLayer ?? 'meta';
      return { element, depth: LAYER_DEPTHS[key] ?? 18 };
    });

  const setRotateX = gsap.quickSetter(card, 'rotateX', 'deg');
  const setRotateY = gsap.quickSetter(card, 'rotateY', 'deg');
  const setScale = gsap.quickSetter(card, 'scale');
  const setGlareX = gsap.quickSetter(card, '--glare-x', '%');
  const setGlareY = gsap.quickSetter(card, '--glare-y', '%');
  const setGlareOpacity = gsap.quickTo(card, '--glare-opacity', {
    duration: 0.2,
    ease: 'power2.out',
  });

  card.style.transformStyle = 'preserve-3d';
  card.style.transformPerspective = '900px';

  let bounds = card.getBoundingClientRect();
  let frame = 0;
  let isActive = false;
  let isPressed = false;
  let borderTween: gsap.core.Tween | null = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;

  const updateBounds = () => {
    bounds = card.getBoundingClientRect();
  };

  const tick = () => {
    if (!isActive) return;
    currentX = lerp(currentX, targetX, 0.14);
    currentY = lerp(currentY, targetY, 0.14);
    currentRotateX = lerp(currentRotateX, targetY * -maxRotateX, 0.14);
    currentRotateY = lerp(currentRotateY, targetX * maxRotateY, 0.14);

    setRotateX(currentRotateX);
    setRotateY(currentRotateY);
    setScale(isPressed ? pressScale : hoverScale);

    resolvedLayers.forEach((layer) => {
      const offsetX = currentX * layer.depth;
      const offsetY = currentY * layer.depth;
      gsap.set(layer.element, { x: offsetX, y: offsetY, force3D: true });
    });

    frame = window.requestAnimationFrame(tick);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const normalizedX = (x / bounds.width) * 2 - 1;
    const normalizedY = (y / bounds.height) * 2 - 1;

    targetX = gsap.utils.clamp(-1, 1, normalizedX);
    targetY = gsap.utils.clamp(-1, 1, normalizedY);
    setGlareX((targetX + 1) * 50);
    setGlareY((targetY + 1) * 50);
  };

  const handlePointerEnter = (event: PointerEvent) => {
    isActive = true;
    updateBounds();
    handlePointerMove(event);
    card.style.willChange = 'transform';
    resolvedLayers.forEach((layer) => {
      layer.element.style.willChange = 'transform';
    });
    if (glare) {
      glare.style.willChange = 'opacity, transform';
    }
    setGlareOpacity(0.7);
    if (!borderTween) {
      borderTween = gsap.to(card, {
        '--border-rotate': 360,
        duration: 10,
        ease: 'none',
        repeat: -1,
      });
    }
    if (!frame) {
      frame = window.requestAnimationFrame(tick);
    }
  };

  const resetTilt = () => {
    isActive = false;
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    targetX = 0;
    targetY = 0;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out',
    });
    resolvedLayers.forEach((layer) => {
      gsap.to(layer.element, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
      layer.element.style.willChange = '';
    });
    setGlareOpacity(0);
    if (glare) {
      glare.style.willChange = '';
    }
    card.style.willChange = '';
    borderTween?.kill();
    borderTween = null;
    gsap.set(card, { '--border-rotate': 0 });
  };

  const handlePointerLeave = () => {
    isPressed = false;
    resetTilt();
  };

  const handlePointerDown = () => {
    isPressed = true;
    setScale(pressScale);
  };

  const handlePointerUp = () => {
    isPressed = false;
    setScale(hoverScale);
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
    borderTween?.kill();
    card.style.willChange = '';
    resolvedLayers.forEach((layer) => {
      layer.element.style.willChange = '';
      gsap.set(layer.element, { x: 0, y: 0 });
    });
    setGlareOpacity(0);
    if (glare) {
      glare.style.willChange = '';
    }
    gsap.set(card, { '--border-rotate': 0 });
    delete card.dataset.tiltInit;
  };
}
