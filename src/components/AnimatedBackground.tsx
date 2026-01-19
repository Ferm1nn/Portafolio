import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMotionSettings } from '../motion/MotionProvider';

const BACKGROUNDS = {
  dark: 'https://portafolio-fermin.b-cdn.net/bg-night.png',
  light: 'https://portafolio-fermin.b-cdn.net/bg-light-4k.png',
};

const DRIFT = {
  base: { x: 26, y: -22, rotation: 0.35, duration: 22 },
  glow: { x: -32, y: 24, rotation: -0.5, duration: 26 },
  orbs: [
    { x: 22, y: -18, rotation: 1.4, duration: 20 },
    { x: -26, y: 18, rotation: -1.2, duration: 24 },
    { x: 20, y: -16, rotation: 1.1, duration: 22 },
  ],
};

const IMAGE_DRIFT = {
  night: { to: '54% 46%', duration: 18 },
  light: { to: '46% 54%', duration: 20 },
};

const POINTER_PARALLAX = {
  base: 28,
  glow: 40,
  orbs: 52,
};

const LINE_PATHS = [
  'M -5 30 C 20 10 60 10 110 30',
  'M 5 48 C 35 30 70 32 105 52',
  'M -8 62 C 25 44 65 46 112 64',
  'M 0 76 C 32 64 72 66 108 82',
  'M -6 18 C 28 8 68 6 112 18',
  'M 6 90 C 40 78 70 80 106 94',
  'M -4 40 C 22 26 62 26 108 40',
  'M 2 12 C 26 4 74 4 110 14',
];

const GLOWS = [
  { top: '14%', left: '18%', size: '32vw', baseOpacity: 0.03 },
  { top: '38%', left: '60%', size: '28vw', baseOpacity: 0.025 },
  { top: '62%', left: '32%', size: '30vw', baseOpacity: 0.028 },
  { top: '18%', left: '72%', size: '26vw', baseOpacity: 0.022 },
  { top: '70%', left: '70%', size: '24vw', baseOpacity: 0.024 },
];

export function AnimatedBackground() {
  const { isTouch, prefersReducedMotion } = useMotionSettings();
  const allowPointerParallax = !isTouch && !prefersReducedMotion;
  const bgRootRef = useRef<HTMLDivElement | null>(null);
  const baseParallaxRef = useRef<HTMLDivElement | null>(null);
  const baseDriftRef = useRef<HTMLDivElement | null>(null);
  const bgNightRef = useRef<HTMLDivElement | null>(null);
  const bgLightRef = useRef<HTMLDivElement | null>(null);
  const glowParallaxRef = useRef<HTMLDivElement | null>(null);
  const glowDriftRef = useRef<HTMLDivElement | null>(null);
  const orbsParallaxRef = useRef<HTMLDivElement | null>(null);
  const noiseRef = useRef<HTMLDivElement | null>(null);
  const orbRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const lineRefs = useRef<Array<SVGPathElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const baseDrift = baseDriftRef.current;
    const glowDrift = glowDriftRef.current;
    const noise = noiseRef.current;
    const nightImage = bgNightRef.current;
    const lightImage = bgLightRef.current;

    if (!baseDrift || !glowDrift) return;

    baseDrift.style.willChange = 'transform';
    glowDrift.style.willChange = 'transform';
    if (noise) noise.style.willChange = 'background-position';
    if (nightImage) nightImage.style.willChange = 'background-position';
    if (lightImage) lightImage.style.willChange = 'background-position';

    const orbNodes = orbRefs.current.slice();

    orbNodes.forEach((orb) => {
      if (orb) orb.style.willChange = 'transform';
    });

    const ctx = gsap.context(() => {
      gsap.to(baseDrift, {
        x: DRIFT.base.x,
        y: DRIFT.base.y,
        rotation: DRIFT.base.rotation,
        duration: DRIFT.base.duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to(glowDrift, {
        x: DRIFT.glow.x,
        y: DRIFT.glow.y,
        rotation: DRIFT.glow.rotation,
        duration: DRIFT.glow.duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      orbNodes.forEach((orb, index) => {
        if (!orb) return;
        const config = DRIFT.orbs[index % DRIFT.orbs.length];
        gsap.to(orb, {
          x: config.x,
          y: config.y,
          rotation: config.rotation,
          duration: config.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      if (nightImage) {
        gsap.fromTo(
          nightImage,
          { backgroundPosition: '50% 50%' },
          {
            backgroundPosition: IMAGE_DRIFT.night.to,
            duration: IMAGE_DRIFT.night.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          },
        );
      }

      if (lightImage) {
        gsap.fromTo(
          lightImage,
          { backgroundPosition: '50% 50%' },
          {
            backgroundPosition: IMAGE_DRIFT.light.to,
            duration: IMAGE_DRIFT.light.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          },
        );
      }

      if (noise) {
        gsap.fromTo(
          noise,
          { backgroundPosition: '0px 0px' },
          {
            backgroundPosition: '180px -180px',
            duration: 34,
            ease: 'none',
            repeat: -1,
          },
        );
      }
    }, bgRootRef);

    return () => {
      ctx.revert();
      baseDrift.style.willChange = '';
      glowDrift.style.willChange = '';
      if (noise) noise.style.willChange = '';
      if (nightImage) nightImage.style.willChange = '';
      if (lightImage) lightImage.style.willChange = '';
      orbNodes.forEach((orb) => {
        if (orb) orb.style.willChange = '';
      });
    };
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    if (!allowPointerParallax) return;

    const baseParallax = baseParallaxRef.current;
    const glowParallax = glowParallaxRef.current;
    const orbsParallax = orbsParallaxRef.current;
    if (!baseParallax || !glowParallax || !orbsParallax) return;

    baseParallax.style.willChange = 'transform';
    glowParallax.style.willChange = 'transform';
    orbsParallax.style.willChange = 'transform';

    const baseX = gsap.quickTo(baseParallax, 'x', { duration: 0.55, ease: 'power3.out' });
    const baseY = gsap.quickTo(baseParallax, 'y', { duration: 0.55, ease: 'power3.out' });
    const glowX = gsap.quickTo(glowParallax, 'x', { duration: 0.7, ease: 'power3.out' });
    const glowY = gsap.quickTo(glowParallax, 'y', { duration: 0.7, ease: 'power3.out' });
    const orbsX = gsap.quickTo(orbsParallax, 'x', { duration: 0.85, ease: 'power3.out' });
    const orbsY = gsap.quickTo(orbsParallax, 'y', { duration: 0.85, ease: 'power3.out' });

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

        baseX(dx * POINTER_PARALLAX.base);
        baseY(dy * POINTER_PARALLAX.base);
        glowX(dx * POINTER_PARALLAX.glow);
        glowY(dy * POINTER_PARALLAX.glow);
        orbsX(dx * POINTER_PARALLAX.orbs);
        orbsY(dy * POINTER_PARALLAX.orbs);
      });
    };

    const handlePointerLeave = () => {
      baseX(0);
      baseY(0);
      glowX(0);
      glowY(0);
      orbsX(0);
      orbsY(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      baseParallax.style.willChange = '';
      glowParallax.style.willChange = '';
      orbsParallax.style.willChange = '';
      baseParallax.style.transform = '';
      glowParallax.style.transform = '';
      orbsParallax.style.transform = '';
      gsap.killTweensOf([baseParallax, glowParallax, orbsParallax]);
    };
  }, [allowPointerParallax]);

  useLayoutEffect(() => {
    const lines = lineRefs.current.filter(Boolean) as SVGPathElement[];
    if (!lines.length || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      lines.forEach((line, index) => {
        line.style.willChange = 'transform';
        const dashDistance = -(400 + index * 40);
        const dashDuration = gsap.utils.random(12, 24);
        const driftY = gsap.utils.random(-2, 2);
        const driftDuration = gsap.utils.random(12, 20);

        gsap.fromTo(
          line,
          { strokeDashoffset: 0 },
          {
            strokeDashoffset: dashDistance,
            duration: dashDuration,
            ease: 'none',
            repeat: -1,
          },
        );

        gsap.to(line, {
          y: driftY,
          duration: driftDuration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    }, bgRootRef);

    return () => {
      ctx.revert();
      lines.forEach((line) => {
        line.style.willChange = '';
      });
    };
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    const glows = glowRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!glows.length || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      glows.forEach((glow) => {
        const baseOpacity = parseFloat(glow.dataset.baseOpacity || '0.03');
        glow.style.willChange = 'opacity';

        const pulse = () => {
          const peak = gsap.utils.random(0.08, 0.14);
          const up = gsap.utils.random(0.25, 0.6);
          const down = gsap.utils.random(0.35, 0.8);
          const gap = gsap.utils.random(1.5, 4);

          gsap
            .timeline({ onComplete: pulse })
            .to(glow, { opacity: peak, duration: up, ease: 'sine.inOut' })
            .to(glow, { opacity: baseOpacity, duration: down, ease: 'sine.out' })
            .to({}, { duration: gap });
        };

        pulse();
      });
    }, bgRootRef);

    return () => {
      ctx.revert();
      glows.forEach((glow) => {
        glow.style.willChange = '';
      });
    };
  }, [isTouch, prefersReducedMotion]);

  return (
    <div ref={bgRootRef} className="bgRoot" aria-hidden="true">
      <div ref={baseParallaxRef} className="bgLayer bgParallax">
        <div ref={baseDriftRef} className="bgLayer bgBase">
          <div
            ref={bgNightRef}
            className="bgLayer bgImage bgImageNight"
            style={{ backgroundImage: `url(${BACKGROUNDS.dark})` }}
          />
          <div
            ref={bgLightRef}
            className="bgLayer bgImage bgImageLight"
            style={{ backgroundImage: `url(${BACKGROUNDS.light})` }}
          />
        </div>
      </div>
      <div ref={glowParallaxRef} className="bgLayer bgParallax">
        <div ref={glowDriftRef} className="bgLayer bgGlow" />
      </div>
      <div ref={orbsParallaxRef} className="bgLayer bgParallax">
        <div className="bgLayer bgOrbs">
          <span
            ref={(node) => {
              orbRefs.current[0] = node;
            }}
            className="bgOrb orb-1"
          />
          <span
            ref={(node) => {
              orbRefs.current[1] = node;
            }}
            className="bgOrb orb-2"
          />
          <span
            ref={(node) => {
              orbRefs.current[2] = node;
            }}
            className="bgOrb orb-3"
          />
        </div>
      </div>
      <svg className="bgLayer bgLines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LINE_PATHS.map((path, index) => (
          <path
            key={`bg-line-${index}`}
            ref={(node) => {
              lineRefs.current[index] = node;
            }}
            className="bgLine"
            d={path}
            strokeDasharray={`${18 + index} ${24 + index * 2}`}
            strokeDashoffset={0}
          />
        ))}
      </svg>
      <div className="bgLayer bgGlows">
        {GLOWS.map((glow, index) => (
          <div
            key={`glow-${index}`}
            ref={(node) => {
              glowRefs.current[index] = node;
            }}
            className="glow"
            data-base-opacity={glow.baseOpacity}
            style={{
              top: glow.top,
              left: glow.left,
              width: glow.size,
              height: glow.size,
              opacity: glow.baseOpacity,
            }}
          />
        ))}
      </div>
      <div className="bgLayer bgVignette" />
      <div ref={noiseRef} className="bgLayer bgNoise" />
    </div>
  );
}
