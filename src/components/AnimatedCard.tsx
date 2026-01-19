import { useRef, type PropsWithChildren, type HTMLAttributes } from 'react';
import { useCardTilt } from '../hooks/useCardTilt';

type AnimatedCardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function AnimatedCard({ className, children, ...rest }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  useCardTilt(cardRef);

  return (
    <div
      ref={cardRef}
      className={`card animated-card ${className ?? ''}`.trim()}
      data-animate-card
      {...rest}
    >
      {children}
    </div>
  );
}
