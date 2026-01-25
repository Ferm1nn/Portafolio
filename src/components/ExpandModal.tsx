import { useEffect, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

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
    if (!isOpen || typeof document === 'undefined') return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

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

  const titleId = id ? `${id}-title` : undefined;
  const modalMarkup = (
    <div className="expand-modal" data-state={isOpen ? 'open' : 'closed'} aria-hidden={!isOpen}>
      <div className="expand-overlay" ref={overlayRef} />
      <div
        className="expand-panel"
        ref={modalRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={titleId ? undefined : title}
      >
        <div className="expand-header">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="btn ghost expand-close" ref={closeButtonRef}>
            Close
          </button>
        </div>
        <div className="expand-content">{children}</div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return modalMarkup;
  }

  return createPortal(modalMarkup, document.body);
}
