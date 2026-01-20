import { forwardRef, useLayoutEffect, type HTMLAttributes } from 'react';
import { createTiltCard } from '../lib/animations/helpers/createTiltCard';
import { useMotionSettings } from '../motion/MotionProvider';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  tilt?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, interactive, tilt = true, onClick, ...rest },
  ref,
) {
  const { allowTilt, prefersReducedMotion, isTouch } = useMotionSettings();

  useLayoutEffect(() => {
    if (prefersReducedMotion || !allowTilt || !tilt || !ref || typeof ref === 'function') return;
    const card = ref.current;
    if (!card) return;

    const glare = card.querySelector<HTMLElement>('.card-glare');
    const cleanup = createTiltCard({ card, glare });
    return () => cleanup();
  }, [allowTilt, prefersReducedMotion, ref]);

  useLayoutEffect(() => {
    if (isTouch) return;
    if (!ref || typeof ref === 'function') return;
    const card = ref.current;
    if (!card) return;
    const grid = card.closest<HTMLElement>('.grid, .timeline-grid, .cert-grid, .project-grid');
    if (!grid) return;

    const handleEnter = () => {
      card.classList.add('is-hovered');
      grid.dataset.gridFocus = 'true';
    };
    const handleLeave = () => {
      card.classList.remove('is-hovered');
      if (!grid.querySelector('.is-hovered')) {
        delete grid.dataset.gridFocus;
      }
    };

    card.addEventListener('pointerenter', handleEnter);
    card.addEventListener('pointerleave', handleLeave);
    card.addEventListener('focusin', handleEnter);
    card.addEventListener('focusout', handleLeave);

    return () => {
      card.removeEventListener('pointerenter', handleEnter);
      card.removeEventListener('pointerleave', handleLeave);
      card.removeEventListener('focusin', handleEnter);
      card.removeEventListener('focusout', handleLeave);
    };
  }, [isTouch, ref]);

  const isInteractive = interactive || typeof onClick === 'function';

  return (
    <div
      ref={ref}
      className={['card', 'premium-card', className].filter(Boolean).join(' ')}
      data-card
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      {...rest}
    >
      <span className="card-border" aria-hidden="true" />
      <span className="card-glare" aria-hidden="true" />
      <div className="card-content">{children}</div>
    </div>
  );
});
