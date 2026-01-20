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
  const shineRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const element = buttonRef.current;
    if (!element || prefersReducedMotion || isTouch) return;

    const cleanupMagnetic = createMagnetic({ element, strength: 14, radius: 140 });
    const shine = shineRef.current;

    const handleEnter = () => {
      if (!shine) return;
      shine.style.willChange = 'transform, opacity';
      gsap.fromTo(
        shine,
        { xPercent: -120, opacity: 0 },
        { xPercent: 120, opacity: 1, duration: 0.6, ease: 'power2.out', onComplete: () => {
          shine.style.willChange = '';
        } },
      );
    };

    element.addEventListener('pointerenter', handleEnter);

    return () => {
      cleanupMagnetic();
      element.removeEventListener('pointerenter', handleEnter);
    };
  }, [isTouch, prefersReducedMotion]);

  const classes = ['btn', variant, className].filter(Boolean).join(' ');

  const content = (
    <>
      <span className="btn-label">{children}</span>
      <span className="btn-shine" aria-hidden ref={shineRef} />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} ref={buttonRef as Ref<HTMLAnchorElement>} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
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
    );
  }

  return (
    <button type="button" className={classes} ref={buttonRef as Ref<HTMLButtonElement>} onClick={onClick}>
      {content}
    </button>
  );
}
