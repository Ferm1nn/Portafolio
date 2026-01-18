import type { PropsWithChildren } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function RouteTransition({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [location, prefersReducedMotion]);

  return (
    <div key={location.pathname} ref={containerRef} className="route-transition">
      {children}
    </div>
  );
}
