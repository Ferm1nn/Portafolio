import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSettings } from '../motion/MotionProvider';
import { ParallaxHUDOverlay } from './ParallaxHUDOverlay';

gsap.registerPlugin(ScrollTrigger);

type ParallaxLayer = {
  background?: string;
  opacity?: number;
  speed?: number;
};

interface AdvancedParallaxBackgroundProps {
  parallaxStrength?: number;
  enableMouseParallax?: boolean;
  layers?: ParallaxLayer[];
  className?: string;
  children?: ReactNode;
}

const defaultLayers: ParallaxLayer[] = [
  {
    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(56, 189, 248, 0.04) 100%)',
    opacity: 1,
    speed: 0.2,
  },
  {
    background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
    opacity: 0.75,
    speed: 0.45,
  },
  {
    background: 'linear-gradient(35deg, rgba(14, 165, 233, 0.08) 0%, rgba(249, 115, 22, 0.05) 100%)',
    opacity: 0.6,
    speed: 0.7,
  },
];

const videoSources = [
  { src: '/background-loop.webm', type: 'video/webm' },
  { src: '/background-loop.mp4', type: 'video/mp4' },
];

export function AdvancedParallaxBackground({
  parallaxStrength = 1,
  enableMouseParallax = true,
  layers,
  className,
  children,
}: AdvancedParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { prefersReducedMotion, allowParallax } = useMotionSettings();
  const resolvedLayers = useMemo(
    () => (layers && layers.length ? layers : defaultLayers),
    [layers],
  );

  useLayoutEffect(() => {
    if (!allowParallax || prefersReducedMotion) return;
    const container = containerRef.current;
    const layerElements = layerRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!container || !layerElements.length) return;

    const setters = layerElements.map((layer) => ({
      x: gsap.quickTo(layer, 'x', { duration: 0.5, ease: 'power2.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 0.5, ease: 'power2.out' }),
    }));

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

        layerElements.forEach((_, index) => {
          const layerConfig = resolvedLayers[index];
          if (!layerConfig) return;
          const intensity = (index + 1) * 25 * parallaxStrength;
          setters[index].x(dx * intensity);
          setters[index].y(dy * intensity);
        });
      });
    };

    const handlePointerLeave = () => {
      setters.forEach((setter) => {
        setter.x(0);
        setter.y(0);
      });
    };

    if (enableMouseParallax) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave);
    }

    return () => {
      if (enableMouseParallax) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
      }
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [allowParallax, enableMouseParallax, parallaxStrength, prefersReducedMotion, resolvedLayers]);

  useLayoutEffect(() => {
    if (!allowParallax || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      layerRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const layer = resolvedLayers[index];
        if (!layer) return;

        const speed = (layer.speed ?? 0.2) * parallaxStrength;
        const fromY = 0;
        const toY = -80 * speed;

        gsap.fromTo(
          ref,
          { yPercent: fromY, willChange: 'transform' },
          {
            yPercent: toY,
            ease: 'none',
            scrollTrigger: {
              start: 0,
              end: () => ScrollTrigger.maxScroll(window),
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [allowParallax, parallaxStrength, prefersReducedMotion, resolvedLayers]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let panX = 0; // Current pan X
    let panY = 0; // Current pan Y

    const onPointerDown = (e: PointerEvent) => {
      // Button 1 is usually Middle Mouse (Scroll Wheel)
      // Check e.buttons simply to be sure? e.button is the one that changed.
      console.log('PointerDown', e.button, e.pointerType);

      if (e.button === 1) {
        e.preventDefault();
        e.stopImmediatePropagation(); // Stop anything else from happening
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        document.body.style.cursor = 'grabbing';
        container.setPointerCapture(e.pointerId); // Retain focus
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPanning) return;
      e.preventDefault();

      // Calculate new position
      panX = e.clientX - startX;
      panY = e.clientY - startY;

      console.log('Panning to', panX, panY);
      gsap.set(container, { x: panX, y: panY });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isPanning) {
        console.log('PointerUp');
        isPanning = false;
        document.body.style.cursor = '';
        container.releasePointerCapture(e.pointerId);
      }
    };

    // Use capture: true on window to intercept the event before it hits anything else
    window.addEventListener('pointerdown', onPointerDown, { capture: true });
    window.addEventListener('pointermove', onPointerMove); // Move/Up generally bubble or are captured
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={['relative', 'animated-background', 'parallax-background', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {!prefersReducedMotion && (
        <div className="background-video-wrap" aria-hidden="true">
          <video
            className="background-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            {videoSources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        </div>
      )}
      {resolvedLayers.map((layer, index) => (
        <div
          key={`parallax-layer-${index}`}
          ref={(node) => {
            layerRefs.current[index] = node;
          }}
          className={`parallax-bg-layer parallax-bg-layer-${index + 1}`}
          style={{
            background: layer.background,
            opacity: layer.opacity ?? 1,
          }}
        />
      ))}
      <ParallaxHUDOverlay />
      {children && <div className="parallax-bg-content">{children}</div>}
    </div>
  );
}
