import type { ReactNode } from 'react';
import { Button } from './Button';

type CTAButtonProps = {
  to?: string;
  href?: string;
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  external?: boolean;
  download?: boolean;
};

export function CTAButton({ to, href, variant = 'primary', children, external, download }: CTAButtonProps) {
  return (
    <Button to={to} href={href} variant={variant} external={external} download={download}>
      {children}
    </Button>
  );
}
