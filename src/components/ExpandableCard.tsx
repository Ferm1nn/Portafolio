import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type HTMLAttributes } from 'react';
import { createExpandCardFLIP } from '../lib/animations/helpers/createExpandCardFLIP';
import { useMotionSettings } from '../motion/MotionProvider';
import { Card } from './Card';
import { ExpandModal } from './ExpandModal';

type ExpandableCardProps = HTMLAttributes<HTMLDivElement> & {
  modalTitle: string;
  modalContent: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ExpandableCard({
  modalTitle,
  modalContent,
  children,
  className,
  ...rest
}: ExpandableCardProps) {
  const { prefersReducedMotion } = useMotionSettings();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const modalId = useId();

  useLayoutEffect(() => {
    const card = cardRef.current;
    const modal = modalRef.current;
    const closeBtn = closeButtonRef.current;
    if (!card || !modal || !closeBtn) return;

    const { cleanup } = createExpandCardFLIP({
      card,
      modal,
      overlay: overlayRef.current,
      closeBtn,
      prefersReducedMotion,
      onOpen: () => {
        lastActiveRef.current = card;
        setIsOpen(true);
      },
      onClose: () => setIsOpen(false),
    });

    return () => cleanup();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isOpen) {
      lastActiveRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <Card
        ref={cardRef}
        className={className}
        interactive
        aria-expanded={isOpen}
        aria-controls={modalId}
        aria-haspopup="dialog"
        {...rest}
      >
        {children}
      </Card>
      <ExpandModal
        id={modalId}
        title={modalTitle}
        isOpen={isOpen}
        modalRef={modalRef}
        overlayRef={overlayRef}
        closeButtonRef={closeButtonRef}
      >
        {modalContent}
      </ExpandModal>
    </>
  );
}
