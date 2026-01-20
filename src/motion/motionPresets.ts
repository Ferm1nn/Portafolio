export const motionPresets = {
  durations: {
    micro: 0.16,
    small: 0.28,
    medium: 0.45,
    hero: 0.8,
  },
  ease: {
    default: 'power3.out',
    settle: 'power2.out',
    emphasis: 'back.out(1.2)',
  },
  route: {
    exitDuration: 0.24,
    enterDuration: 0.45,
    exitY: -12,
    enterY: 16,
    ease: 'power3.out',
  },
  tilt: {
    maxRotate: 8,
    hoverScale: 1.01,
    pressScale: 0.98,
  },
  magnetic: {
    maxOffset: 12,
    duration: 0.25,
    ease: 'power3.out',
  },
  parallax: {
    distance: 120,
    scrub: 0.6,
  },
} as const;
