import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useMotionSettings } from '../motion/MotionProvider';

gsap.registerPlugin(ScrollToPlugin);

export function ScrollToTop() {
  const { pathname } = useLocation();
  const { prefersReducedMotion } = useMotionSettings();
  const scrollTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    scrollTween.current?.kill();
    scrollTween.current = gsap.to(window, {
      scrollTo: { y: 0, autoKill: true },
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [pathname, prefersReducedMotion]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const anchor = document.querySelector<HTMLElement>(href);
      if (!anchor) return;

      event.preventDefault();
      const navHeight = document.querySelector<HTMLElement>('.navbar')?.offsetHeight ?? 0;
      const targetY = anchor.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      if (prefersReducedMotion) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
      } else {
        scrollTween.current?.kill();
        scrollTween.current = gsap.to(window, {
          scrollTo: { y: targetY, autoKill: true },
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      window.history.pushState(null, '', href);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [prefersReducedMotion]);

  return null;
}
