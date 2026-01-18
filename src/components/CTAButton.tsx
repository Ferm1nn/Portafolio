import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

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

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={className} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} download={download}>
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
}
