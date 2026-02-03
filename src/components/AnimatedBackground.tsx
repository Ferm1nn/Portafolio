import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ParallaxHUDOverlay } from './ParallaxHUDOverlay';

const DRIFT = {
  base: { x: 26, y: -22, rotation: 0.35, duration: 22 },
};

const IMAGE_DRIFT = {
  night: { to: '54% 46%', duration: 18 },
  light: { to: '46% 54%', duration: 20 },
};

const POINTER_PARALLAX = {
  base: 28,
};

export function AnimatedBackground() {
  useLayoutEffect(() => {
    const baseParallax = document.getElementById('baseParallax');
    const baseDrift = document.getElementById('baseDrift');
    const bgNight = document.getElementById('bgNight');
    const bgLight = document.getElementById('bgLight');

    if (!baseParallax || !baseDrift) {
      return undefined;
    }

    const tweens: gsap.core.Tween[] = [];
    let frame = 0;
    let latestEvent: PointerEvent | null = null;

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
    };

    const initParallax = () => {
      const baseX = gsap.quickTo(baseParallax, 'x', { duration: 0.55, ease: 'power3.out' });
      const baseY = gsap.quickTo(baseParallax, 'y', { duration: 0.55, ease: 'power3.out' });

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
        });
      };

      const handlePointerLeave = () => {
        baseX(0);
        baseY(0);
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
      };
    };

    const init = () => {
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
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      cleanupParallax?.();
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <div className="bg-root" aria-hidden="true">
      <div className="bg-layer base-parallax" id="baseParallax">
        <div className="base-drift" id="baseDrift">
          {/* Background images removed */}
        </div>
      </div>
      <ParallaxHUDOverlay />
    </div>
  );
}
