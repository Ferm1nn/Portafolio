export const motionPresets = {
  reveal: {
    duration: 0.6,
    distanceY: 12,
    ease: 'power2.out',
  },
  section: {
    duration: 0.8,
    distanceY: 26,
    distanceX: 12,
    rotate: 1.2,
    ease: 'power2.out',
  },
  card: {
    duration: 0.6,
    distanceY: 14,
    distanceX: 8,
    rotate: 1.1,
    ease: 'power2.out',
    stagger: 0.08,
  },
  timeline: {
    duration: 0.6,
    distanceX: 20,
    rotate: 1.4,
    ease: 'power2.out',
  },
  nav: {
    duration: 0.35,
    ease: 'power3.out',
  },
  route: {
    exitDuration: 0.28,
    enterDuration: 0.5,
    exitY: -14,
    enterY: 18,
    ease: 'power2.out',
  },
  tilt: {
    maxRotate: 8,
    hoverScale: 1.02,
    pressScale: 0.98,
  },
  magnetic: {
    maxOffset: 12,
    duration: 0.25,
    ease: 'power3.out',
  },
  background: {
    driftDuration: 46,
    driftDistance: 32,
    parallaxStrength: 16,
    driftRotation: 6,
  },
  parallax: {
    distance: 140,
    scrub: 0.6,
  },
} as const;
