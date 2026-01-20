import gsap from 'gsap';

type BackgroundLoopOptions = {
  root: SVGSVGElement;
  prefersReducedMotion?: boolean;
};

export function createBackgroundLoop({ root, prefersReducedMotion = false }: BackgroundLoopOptions) {
  if (!root || prefersReducedMotion) {
    return () => undefined;
  }

  if (root.dataset.bgInit === 'true') {
    return () => undefined;
  }
  root.dataset.bgInit = 'true';

  const baseLayer = root.querySelector<SVGGElement>('#bg-base');
  const flowLayer = root.querySelector<SVGGElement>('#bg-flow');
  const pulseLayer = root.querySelector<SVGGElement>('#bg-pulses');
  const flowPaths = Array.from(root.querySelectorAll<SVGPathElement>('[data-flow-path]'));
  const pulses = Array.from(root.querySelectorAll<SVGCircleElement>('[data-pulse]'));

  const tweens: gsap.core.Tween[] = [];
  const pulseTimelines: gsap.core.Timeline[] = [];

  if (baseLayer) {
    baseLayer.style.willChange = 'transform';
    tweens.push(
      gsap.to(baseLayer, {
        x: 18,
        y: -14,
        duration: 48,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    );
  }

  if (flowLayer) {
    flowLayer.style.willChange = 'transform';
    tweens.push(
      gsap.to(flowLayer, {
        x: -12,
        y: 16,
        duration: 56,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    );
  }

  flowPaths.forEach((path, index) => {
    path.style.willChange = 'stroke-dashoffset, transform';
    const dashDistance = -(280 + index * 40);
    const dashDuration = gsap.utils.random(20, 34);
    const driftY = gsap.utils.random(-2, 2);
    tweens.push(
      gsap.fromTo(
        path,
        { strokeDashoffset: 0 },
        { strokeDashoffset: dashDistance, duration: dashDuration, ease: 'none', repeat: -1 },
      ),
    );
    tweens.push(
      gsap.to(path, { y: driftY, duration: gsap.utils.random(16, 28), ease: 'sine.inOut', repeat: -1, yoyo: true }),
    );
  });

  if (pulseLayer) {
    pulseLayer.style.willChange = 'transform, opacity';
  }

  pulses.forEach((pulse) => {
    pulse.style.willChange = 'transform, opacity';
    const peak = gsap.utils.random(0.12, 0.2);
    const duration = gsap.utils.random(1.8, 3);
    const delay = gsap.utils.random(0, 3);
    const repeatDelay = gsap.utils.random(2, 5);
    const tl = gsap
      .timeline({ repeat: -1, repeatDelay, delay })
      .fromTo(pulse, { opacity: 0, scale: 0.6 }, { opacity: peak, scale: 1, duration: duration * 0.45, ease: 'sine.out' })
      .to(pulse, { opacity: 0, scale: 1.05, duration: duration * 0.55, ease: 'sine.inOut' });
    pulseTimelines.push(tl);
  });

  return () => {
    tweens.forEach((tween) => tween.kill());
    pulseTimelines.forEach((tl) => tl.kill());
    flowPaths.forEach((path) => {
      path.style.willChange = '';
    });
    pulses.forEach((pulse) => {
      pulse.style.willChange = '';
    });
    if (baseLayer) baseLayer.style.willChange = '';
    if (flowLayer) flowLayer.style.willChange = '';
    if (pulseLayer) pulseLayer.style.willChange = '';
    delete root.dataset.bgInit;
  };
}
