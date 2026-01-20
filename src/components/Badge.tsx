import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'glass' | 'solid';
  className?: string;
};

export function Badge({ children, variant = 'glass', className }: BadgeProps) {
  return (
    <span className={['badge', `badge-${variant}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
