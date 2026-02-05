import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../data/portfolioData';
import avatar from '../assets/profile-header.jpeg';
// import { useTheme } from '../hooks/useTheme'; // Removed unused import
import { useMotionSettings } from '../motion/MotionProvider';
// import { createActiveNavIndicator } from '../lib/animations/helpers/createActiveNavIndicator'; // Removed unused import
import { CTAButton } from './CTAButton';
import { ProfileAvatar } from './ProfileAvatar';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { to: '/', label: 'Home' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  // const { theme, toggleTheme } = useTheme(); // Removed for dark mode enforcement
  const { prefersReducedMotion } = useMotionSettings();
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const toggleIconRef = useRef<HTMLSpanElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Computed styles based on theme to maintain Light mode functionality/design while keeping Dark mode "Fancy"
  const isDark = true; // Forced dark mode

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

  // Animations removed to support pure CSS/Tailwind Pill design
  useLayoutEffect(() => {
    // Optional: Add simple hover/click animations here if needed in future
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const root = document.documentElement;
    const updateOffset = () => {
      const height = shell.getBoundingClientRect().height;
      root.style.setProperty('--header-offset', `${height + 16}px`);
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
  }, [prefersReducedMotion]);

  // Dynamic classes based on theme
  // FORCED DARK BACKGROUND for both modes as per user request
  const headerClasses = `bg-slate-900/60 backdrop-blur-md border-b border-white/5 ${isDark ? 'shadow-lg shadow-cyan-900/20' : 'shadow-sm'}`;

  const brandTextClasses = isDark
    ? `text-slate-100 group-hover:text-cyan-100`
    : `text-slate-100 group-hover:text-indigo-200`;

  const brandRoleClasses = isDark
    ? `text-cyan-400`
    : `text-indigo-600`;

  // Removed unused navLink classes since they were for the old top-bar desktop nav

  // : `bg-slate-800/50 text-slate-400 hover:text-indigo-400 hover:bg-slate-800`;

  // Indicator classes removed
  /*
  const indicatorClasses = isDark
    ? `bg-cyan-500/10 border-cyan-500/20`
    : `bg-cyan-500/10 border-cyan-200`;
  */



  const mobileMenuClasses = `bg-slate-900 border-white/5`;

  const mobileLinkActive = isDark
    ? `bg-cyan-500/10 text-cyan-400`
    : `bg-indigo-500/10 text-indigo-400`;

  const mobileLinkInactive = `text-slate-400 hover:text-slate-100 hover:bg-white/5`;

  return (
    <header
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b py-2 ${headerClasses} ${isMenuOpen ? 'bg-slate-900' : ''}`}
    >
      <div
        ref={shellRef}
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6"
      >
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-3 focus:outline-none"
          onClick={() => setIsMenuOpen(false)}
        >
          <ProfileAvatar
            src={avatar}
            alt={`${profile.name} portrait`}
            isDark={isDark}
          />
          <div className="flex flex-col justify-center">
            <span className={`font-bold leading-none transition-colors ${brandTextClasses}`}>
              {profile.name}
            </span>
            <span className={`mt-0.5 text-[10px] font-medium tracking-wider uppercase ${brandRoleClasses}`}>
              {profile.role}
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Horizontal Pill Design */}
        <div className="hidden lg:flex items-center gap-2">
          <nav
            className={`
               relative flex items-center gap-1 p-1.5 rounded-full border transition-all duration-300
               ${isDark
                ? 'bg-slate-900/50 border-white/5 shadow-inner'
                : 'bg-white/50 border-slate-200/60 shadow-inner'
              }
             `}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  relative z-10 block px-5 py-2 text-sm font-bold tracking-wide transition-all duration-300 rounded-full
                  ${isActive
                    ? (isDark
                      ? 'text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                      : 'text-white shadow-md shadow-indigo-500/20')
                    : (isDark ? 'text-slate-400 hover:text-cyan-200 hover:bg-white/5' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50')
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Background Pill */}
                    {isActive && (
                      <span
                        className={`
                          absolute inset-0 rounded-full -z-10
                          ${isDark
                            ? 'bg-cyan-500/10 border border-cyan-400/20'
                            : 'bg-indigo-600'
                          }
                        `}
                      />
                    )}
                    {link.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle Removed */}

          {/* Contact CTA */}
          <div className="hidden sm:block">
            <CTAButton to="/contact">Contact</CTAButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={`lg:hidden relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition-colors ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-400 hover:text-indigo-400'}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation"
          >
            <span className={`h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <div
        className={`fixed inset-0 top-[calc(var(--header-offset,60px))] z-40 lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}
        id="mobile-menu"
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'} bg-slate-900/80`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Content */}
        <nav className={`relative z-50 border-b p-4 shadow-xl transition-all duration-300 origin-top ${mobileMenuClasses} ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex flex-col space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-medium rounded-lg transition-colors ${isActive ? mobileLinkActive : mobileLinkInactive}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className={`mt-4 pt-4 border-t border-white/5`}>
            <CTAButton to="/contact" className="w-full justify-center">Contact</CTAButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
