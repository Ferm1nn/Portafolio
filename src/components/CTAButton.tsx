import { useRef, type ReactNode, type Ref } from 'react';
import { Link } from 'react-router-dom';
import { useMagneticButton } from '../hooks/useMagneticButton';

type CTAButtonProps = {
  to?: string;
  href?: string;
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  external?: boolean;
  download?: boolean;
};

export function CTAButton({ to, href, variant = 'primary', children, external, download }: CTAButtonProps) {
  const className = `btn ${variant}`;
  const magneticRef = useRef<HTMLElement | null>(null);
  useMagneticButton(magneticRef);

  if (to) {
    return (
      <Link to={to} className={className} ref={magneticRef as Ref<HTMLAnchorElement>} data-magnetic="true">
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={className}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        download={download}
        ref={magneticRef as Ref<HTMLAnchorElement>}
        data-magnetic="true"
      >
        {children}
      </a>
    );
  }

  return (
    <span className={className} ref={magneticRef as Ref<HTMLSpanElement>} data-magnetic="true">
      {children}
    </span>
  );
}
