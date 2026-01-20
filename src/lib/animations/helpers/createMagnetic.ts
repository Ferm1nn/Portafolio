import gsap from 'gsap';

type MagneticOptions = {
  element: HTMLElement;
  strength?: number;
  radius?: number;
};

export function createMagnetic({ element, strength = 12, radius = 120 }: MagneticOptions) {
  if (element.dataset.magneticInit === 'true') {
    return () => undefined;
  }
  element.dataset.magneticInit = 'true';

  let frame = 0;
  let latestEvent: PointerEvent | null = null;
  let bounds = element.getBoundingClientRect();

  const setX = gsap.quickTo(element, 'x', { duration: 0.25, ease: 'power3.out' });
  const setY = gsap.quickTo(element, 'y', { duration: 0.25, ease: 'power3.out' });

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
    const distance = Math.hypot(dx, dy);
    if (distance > radius) {
      setX(0);
      setY(0);
      return;
    }
    const normalized = Math.min(1, distance / radius);
    setX((dx / bounds.width) * strength * normalized);
    setY((dy / bounds.height) * strength * normalized);
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
    element.style.willChange = '';
    delete element.dataset.magneticInit;
  };
}
