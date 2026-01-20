import { useLayoutEffect } from 'react';
import gsap from 'gsap';

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
  useLayoutEffect(() => {
    const baseParallax = document.getElementById('baseParallax');
    const baseDrift = document.getElementById('baseDrift');
    const glowParallax = document.getElementById('glowParallax');
    const glowDrift = document.getElementById('glowDrift');
    const orbsParallax = document.getElementById('orbsParallax');
    const orbs = document.querySelectorAll<HTMLElement>('.orb');
    const noise = document.getElementById('noise');
    const bgNight = document.getElementById('bgNight');
    const bgLight = document.getElementById('bgLight');
    const linesSvg = document.getElementById('linesSvg') as SVGSVGElement | null;
    const glowContainer = document.getElementById('glowContainer');

    if (!baseParallax || !baseDrift || !glowParallax || !glowDrift || !orbsParallax) {
      return undefined;
    }

    const tweens: gsap.core.Tween[] = [];
    const glowTimelines = new Map<HTMLElement, gsap.core.Timeline>();
    let isActive = true;
    let frame = 0;
    let latestEvent: PointerEvent | null = null;

    const initLines = () => {
      if (!linesSvg) return;
      while (linesSvg.firstChild) {
        linesSvg.removeChild(linesSvg.firstChild);
      }
      LINE_PATHS.forEach((path, index) => {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', path);
        el.setAttribute('class', 'bg-line');
        const dash = 18 + index;
        const gap = 24 + index * 2;
        el.setAttribute('stroke-dasharray', `${dash} ${gap}`);
        el.setAttribute('stroke-dashoffset', '0');
        linesSvg.appendChild(el);
      });
    };

    const initGlows = () => {
      if (!glowContainer) return;
      glowContainer.innerHTML = '';
      GLOWS.forEach((g) => {
        const div = document.createElement('div');
        div.className = 'glow';
        div.style.top = g.top;
        div.style.left = g.left;
        div.style.width = g.size;
        div.style.height = g.size;
        div.style.opacity = String(g.baseOpacity);
        div.dataset.baseOpacity = String(g.baseOpacity);
        glowContainer.appendChild(div);
      });
    };

    const initAnimations = () => {
      tweens.push(
        gsap.to(baseDrift, {
          x: DRIFT.base.x,
          y: DRIFT.base.y,
          rotation: DRIFT.base.rotation,
          duration: DRIFT.base.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }),
      );

      tweens.push(
        gsap.to(glowDrift, {
          x: DRIFT.glow.x,
          y: DRIFT.glow.y,
          rotation: DRIFT.glow.rotation,
          duration: DRIFT.glow.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }),
      );

      orbs.forEach((orb, index) => {
        const cfg = DRIFT.orbs[index % DRIFT.orbs.length];
        tweens.push(
          gsap.to(orb, {
            x: cfg.x,
            y: cfg.y,
            rotation: cfg.rotation,
            duration: cfg.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }),
        );
      });

      if (bgNight) {
        tweens.push(
          gsap.fromTo(
            bgNight,
            { backgroundPosition: '50% 50%' },
            {
              backgroundPosition: IMAGE_DRIFT.night.to,
              duration: IMAGE_DRIFT.night.duration,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            },
          ),
        );
      }
      if (bgLight) {
        tweens.push(
          gsap.fromTo(
            bgLight,
            { backgroundPosition: '50% 50%' },
            {
              backgroundPosition: IMAGE_DRIFT.light.to,
              duration: IMAGE_DRIFT.light.duration,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            },
          ),
        );
      }

      if (noise) {
        tweens.push(
          gsap.fromTo(
            noise,
            { backgroundPosition: '0px 0px' },
            {
              backgroundPosition: '180px -180px',
              duration: 34,
              ease: 'none',
              repeat: -1,
            },
          ),
        );
      }

      const lines = linesSvg?.querySelectorAll<SVGPathElement>('path') ?? [];
      lines.forEach((line, index) => {
        const dashDistance = -(400 + index * 40);
        const dashDuration = gsap.utils.random(12, 24);
        const driftY = gsap.utils.random(-2, 2);
        const driftDuration = gsap.utils.random(12, 20);

        tweens.push(
          gsap.fromTo(
            line,
            { strokeDashoffset: 0 },
            {
              strokeDashoffset: dashDistance,
              duration: dashDuration,
              ease: 'none',
              repeat: -1,
            },
          ),
        );
        tweens.push(
          gsap.to(line, {
            y: driftY,
            duration: driftDuration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }),
        );
      });

      const glows = glowContainer?.querySelectorAll<HTMLElement>('.glow') ?? [];
      glows.forEach((glow) => {
        const baseOpacity = parseFloat(glow.dataset.baseOpacity || '0.03');
        const pulse = () => {
          if (!isActive) return;
          const peak = gsap.utils.random(0.08, 0.14);
          const up = gsap.utils.random(0.25, 0.6);
          const down = gsap.utils.random(0.35, 0.8);
          const gap = gsap.utils.random(1.5, 4);
          const tl = gsap
            .timeline({ onComplete: pulse })
            .to(glow, { opacity: peak, duration: up, ease: 'sine.inOut' })
            .to(glow, { opacity: baseOpacity, duration: down, ease: 'sine.out' })
            .to({}, { duration: gap });
          glowTimelines.set(glow, tl);
        };
        pulse();
      });
    };

    const initParallax = () => {
      const baseX = gsap.quickTo(baseParallax, 'x', { duration: 0.55, ease: 'power3.out' });
      const baseY = gsap.quickTo(baseParallax, 'y', { duration: 0.55, ease: 'power3.out' });
      const glowX = gsap.quickTo(glowParallax, 'x', { duration: 0.7, ease: 'power3.out' });
      const glowY = gsap.quickTo(glowParallax, 'y', { duration: 0.7, ease: 'power3.out' });
      const orbsX = gsap.quickTo(orbsParallax, 'x', { duration: 0.85, ease: 'power3.out' });
      const orbsY = gsap.quickTo(orbsParallax, 'y', { duration: 0.85, ease: 'power3.out' });

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
      };
    };

    const init = () => {
      initLines();
      initGlows();
      initAnimations();
      return initParallax();
    };

    let cleanupParallax: (() => void) | undefined;
    if (document.readyState === 'complete') {
      cleanupParallax = init();
    } else {
      const handleLoad = () => {
        cleanupParallax = init();
      };
      window.addEventListener('load', handleLoad, { once: true });
    }

    return () => {
      isActive = false;
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      cleanupParallax?.();
      tweens.forEach((tween) => tween.kill());
      glowTimelines.forEach((timeline) => timeline.kill());
    };
  }, []);

  return (
    <div className="bg-root" aria-hidden="true">
      <div className="bg-layer base-parallax" id="baseParallax">
        <div className="base-drift" id="baseDrift">
          <div className="bg-img bg-img-night" id="bgNight" />
          <div className="bg-img bg-img-light" id="bgLight" />
        </div>
      </div>

      <div className="bg-layer glow-parallax" id="glowParallax">
        <div className="bg-layer bg-glow" id="glowDrift" />
      </div>

      <div className="bg-layer orbs-parallax" id="orbsParallax">
        <div className="bg-layer orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
      </div>

      <div className="bg-layer bg-lines">
        <svg id="linesSvg" viewBox="0 0 120 100" preserveAspectRatio="none" />
      </div>

      <div className="bg-layer glows" id="glowContainer" />

      <div className="bg-layer vignette" />
      <div className="bg-layer noise" id="noise" />
    </div>
  );
}
