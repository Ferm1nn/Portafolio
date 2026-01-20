import { useEffect, type ReactNode, type RefObject } from 'react';

type ExpandModalProps = {
  id?: string;
  title: string;
  isOpen: boolean;
  modalRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ExpandModal({
  id,
  title,
  isOpen,
  modalRef,
  overlayRef,
  closeButtonRef,
  children,
}: ExpandModalProps) {
  useEffect(() => {
    const panel = modalRef.current;
    if (!panel || !isOpen) return;
    const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = closeButtonRef.current ?? focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', handleKeyDown);
    window.setTimeout(() => first?.focus(), 10);

    return () => panel.removeEventListener('keydown', handleKeyDown);
  }, [closeButtonRef, isOpen, modalRef]);

  return (
    <div className="expand-modal" data-state={isOpen ? 'open' : 'closed'} aria-hidden={!isOpen}>
      <div className="expand-overlay" ref={overlayRef} />
      <div
        className="expand-panel"
        ref={modalRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="expand-header">
          <h3>{title}</h3>
          <button type="button" className="btn ghost expand-close" ref={closeButtonRef}>
            Close
          </button>
        </div>
        <div className="expand-content">{children}</div>
      </div>
    </div>
  );
}
