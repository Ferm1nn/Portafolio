import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/all';
import { profile } from '../data/portfolioData';
import avatar from '../assets/profile-header.jpeg';
import { useTheme } from '../hooks/useTheme';
import { motionPresets } from '../motion/motionPresets';
import { useMotionSettings } from '../motion/MotionProvider';
import { CTAButton } from './CTAButton';

// FLIP indicator motion inspired by GSAP Flip docs and community examples.
gsap.registerPlugin(ScrollTrigger, Flip);

const links = [
  { to: '/', label: 'Home' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { prefersReducedMotion } = useMotionSettings();
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const toggleIconRef = useRef<HTMLSpanElement | null>(null);
  const [indicatorPath, setIndicatorPath] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      setIndicatorPath(location.pathname);
      return;
    }

    if (location.pathname === indicatorPath) return;
    flipStateRef.current = Flip.getState('.nav-indicator');
    setIndicatorPath(location.pathname);
  }, [indicatorPath, location.pathname, prefersReducedMotion]);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !flipStateRef.current) return;
    Flip.from(flipStateRef.current, {
      duration: motionPresets.nav.duration,
      ease: motionPresets.nav.ease,
      absolute: true,
    });
    flipStateRef.current = null;
  }, [indicatorPath, prefersReducedMotion]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top -24',
      toggleClass: { targets: nav, className: 'is-scrolled' },
    });

    return () => trigger.kill();
  }, []);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const root = document.documentElement;
    const updateOffset = () => {
      root.style.setProperty('--header-offset', `${shell.getBoundingClientRect().height}px`);
    };

    updateOffset();

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateOffset) : null;
    resizeObserver?.observe(shell);
    window.addEventListener('resize', updateOffset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      if (window.innerWidth >= 1025) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (isMenuOpen) {
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    const icon = toggleIconRef.current;
    if (!icon || prefersReducedMotion) return;

    gsap.fromTo(
      icon,
      { rotate: -90, scale: 0.9 },
      { rotate: 0, scale: 1, duration: 0.4, ease: 'power2.out' },
    );
  }, [theme, prefersReducedMotion]);

  return (
    <header className={`navbar${isMenuOpen ? ' is-open' : ''}`} ref={navRef}>
      <div className="navbar-inner" ref={shellRef}>
        <div className="nav-brand">
          <Link to="/" className="nav-logo">
            <span className="logo-mark" aria-hidden>
              <img src={avatar} alt={`${profile.name} portrait`} className="logo-avatar" />
            </span>
            <div>
              <div className="brand-name">{profile.name}</div>
              <div className="brand-role">{profile.role}</div>
            </div>
          </Link>
        </div>
        <div className="nav-drawer" data-open={isMenuOpen} id="primary-navigation">
          <nav className="nav-links" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                end={link.to === '/'}
              >
                <span className="nav-link-label">{link.label}</span>
                {indicatorPath === link.to && (
                  <span className="nav-indicator" data-flip-id="nav-indicator" aria-hidden="true" />
                )}
              </NavLink>
            ))}
          </nav>
          <div className="nav-drawer-actions">
            <div className="nav-contact-mobile">
              <CTAButton to="/contact">Contact</CTAButton>
            </div>
          </div>
        </div>
        <div className="nav-actions">
          <button
            type="button"
            className="btn ghost theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden className="theme-toggle-icon" ref={toggleIconRef}>
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.5 14.5A8.5 8.5 0 1 1 12 3.5c0 .5 0 1.2.2 1.7a7 7 0 0 0 6.6 6.6c.5.1 1.2.1 1.7.2Z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
                  <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" />
                  <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" />
                </svg>
              )}
            </span>
            <span className="theme-toggle-label">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
          <div className="nav-contact-desktop">
            <CTAButton to="/contact">Contact</CTAButton>
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </div>
      <div
        className="nav-backdrop"
        data-open={isMenuOpen}
        aria-hidden
        onClick={() => setIsMenuOpen(false)}
      />
    </header>
  );
}
