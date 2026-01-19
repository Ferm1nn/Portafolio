import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import gsap from 'gsap';
import { motionPresets } from '../motion/motionPresets';
import { useMotionSettings } from '../motion/MotionProvider';

type RouteTransitionProps = {
  children: (location: Location) => ReactNode;
};

export function RouteTransition({ children }: RouteTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { prefersReducedMotion } = useMotionSettings();
  const [displayLocation, setDisplayLocation] = useState(location);
  const nextLocationRef = useRef(location);
  const isTransitioningRef = useRef(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      setDisplayLocation(location);
      return;
    }

    if (location === displayLocation) return;
    nextLocationRef.current = location;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: motionPresets.route.exitY,
        duration: motionPresets.route.exitDuration,
        ease: motionPresets.route.ease,
        onStart: () => {
          if (containerRef.current) {
            containerRef.current.style.willChange = 'opacity, transform';
          }
        },
        onComplete: () => {
          isTransitioningRef.current = false;
          if (containerRef.current) {
            containerRef.current.style.willChange = '';
          }
          setDisplayLocation(nextLocationRef.current);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [displayLocation, location, prefersReducedMotion]);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: motionPresets.route.enterY },
        {
          opacity: 1,
          y: 0,
          duration: motionPresets.route.enterDuration,
          ease: motionPresets.route.ease,
          onStart: () => {
            if (containerRef.current) {
              containerRef.current.style.willChange = 'opacity, transform';
            }
          },
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.willChange = '';
            }
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [displayLocation, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="route-transition">
      {children(displayLocation)}
    </div>
  );
}
