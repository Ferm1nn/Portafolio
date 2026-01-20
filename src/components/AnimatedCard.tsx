import type { PropsWithChildren, HTMLAttributes } from 'react';
import { Card } from './Card';

type AnimatedCardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function AnimatedCard({ className, children, ...rest }: AnimatedCardProps) {
  return (
    <Card className={`animated-card ${className ?? ''}`.trim()} data-animate-card="true" {...rest}>
      {children}
    </Card>
  );
}
