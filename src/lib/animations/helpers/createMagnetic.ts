import gsap from 'gsap';

type MagneticOptions = {
  element: HTMLElement;
  trigger?: HTMLElement;
  strength?: number;
  radius?: number;
};

export function createMagnetic({ element, trigger, radius = 120 }: MagneticOptions) {
  const targetListener = trigger || element;

  if (targetListener.dataset.magneticInit === 'true') {
    return () => undefined;
  }
  targetListener.dataset.magneticInit = 'true';

  let frame = 0;
  let latestEvent: PointerEvent | null = null;
  let bounds = targetListener.getBoundingClientRect();

  const setX = gsap.quickTo(element, 'x', { duration: 0.25, ease: 'power3.out' });
  const setY = gsap.quickTo(element, 'y', { duration: 0.25, ease: 'power3.out' });

  const updateBounds = () => {
    bounds = targetListener.getBoundingClientRect();
  };

  const animate = () => {
    frame = 0;
    if (!latestEvent) return;
    const x = latestEvent.clientX - bounds.left;
    const y = latestEvent.clientY - bounds.top;
    const dx = x - bounds.width / 2;
    const dy = y - bounds.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate intensity based on distance within radius
    if (distance > radius) {
      setX(0);
      setY(0);
      return;
    }

    // Prototype logic: consistent pull
    // const force = (radius - distance) / radius; // Stronger when closer 
    // Or just mapping 1:1 like prototype?
    // Prototype: x * 0.5. 
    // Let's stick closer to the prototype's feel:
    setX(dx * 0.5);
    setY(dy * 0.5);
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

  targetListener.addEventListener('pointerenter', handlePointerEnter);
  targetListener.addEventListener('pointermove', handlePointerMove);
  targetListener.addEventListener('pointerleave', reset);
  targetListener.addEventListener('pointerdown', reset);
  window.addEventListener('resize', updateBounds);

  return () => {
    targetListener.removeEventListener('pointerenter', handlePointerEnter);
    targetListener.removeEventListener('pointermove', handlePointerMove);
    targetListener.removeEventListener('pointerleave', reset);
    targetListener.removeEventListener('pointerdown', reset);
    window.removeEventListener('resize', updateBounds);
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
    element.style.willChange = '';
    delete targetListener.dataset.magneticInit;
  };
}
