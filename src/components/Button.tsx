import { useLayoutEffect, useRef, type ReactNode, type Ref } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { createMagnetic } from '../lib/animations/helpers/createMagnetic';
import { useMotionSettings } from '../motion/MotionProvider';

type ButtonProps = {
  to?: string;
  href?: string;
  variant?: 'primary' | 'ghost' | 'outline';
  children: ReactNode;
  external?: boolean;
  download?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Button({
  to,
  href,
  variant = 'primary',
  children,
  external,
  download,
  className,
  onClick,
}: ButtonProps) {
  const { prefersReducedMotion, isTouch } = useMotionSettings();
  const buttonRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const shineRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const element = buttonRef.current;
    const wrapper = wrapperRef.current;
    if (!element || !wrapper || prefersReducedMotion || isTouch) return;

    // Use wrapper as the trigger for the magnetic effect
    const cleanupMagnetic = createMagnetic({ element, trigger: wrapper, strength: 20, radius: 200 });
    const shine = shineRef.current;

    const handleEnter = () => {
      if (!shine) return;
      shine.style.willChange = 'transform, opacity';
      gsap.fromTo(
        shine,
        { xPercent: -120, opacity: 0 },
        {
          xPercent: 120, opacity: 1, duration: 0.6, ease: 'power2.out', onComplete: () => {
            shine.style.willChange = '';
          }
        },
      );
    };

    wrapper.addEventListener('pointerenter', handleEnter);

    return () => {
      cleanupMagnetic();
      wrapper.removeEventListener('pointerenter', handleEnter);
    };
  }, [isTouch, prefersReducedMotion]);

  const classes = [
    'btn',
    variant,
    'relative group overflow-visible transition-colors duration-300 block w-full h-full', // block w-full h-full for wrapper filling
    'py-3.5 px-6 md:py-[0.7rem] md:px-[1.1rem] min-h-[48px] md:min-h-[44px]',
    'flex items-center justify-center',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      <span className="btn-label relative z-10 group-hover:text-white transition-colors duration-300">
        {children}
      </span>

      {/* Magnetic/Glow Effects */}
      <div className="absolute inset-0 bg-cyan-500/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 origin-center pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }} />
      <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

      {/* Shine Effect */}
      <span className="btn-shine" aria-hidden ref={shineRef} />
    </>
  );

  const innerElement = to ? (
    <Link to={to} className={classes} ref={buttonRef as Ref<HTMLAnchorElement>} onClick={onClick}>
      {content}
    </Link>
  ) : href ? (
    <a
      className={classes}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      download={download}
      ref={buttonRef as Ref<HTMLAnchorElement>}
      onClick={onClick}
    >
      {content}
    </a>
  ) : (
    <button type="button" className={classes} ref={buttonRef as Ref<HTMLButtonElement>} onClick={onClick}>
      {content}
    </button>
  );

  return (
    <div
      ref={wrapperRef}
      className="magnetic-wrapper relative inline-block p-8 -m-8" // Increased padding for easier activation
      style={{ zIndex: 10 }}
    >
      {innerElement}
    </div>
  );
}
