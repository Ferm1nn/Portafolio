import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMotionSettings } from '../motion/MotionProvider';

type PendingLink = {
  href: string;
  target?: string;
  download?: string;
};

const shouldConfirm = (href: string) =>
  href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

export function LinkConfirm() {
  const { prefersReducedMotion } = useMotionSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [href, setHref] = useState('');
  const pendingRef = useRef<PendingLink | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isOpen) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      if (link.dataset.noConfirm === 'true') return;

      const hrefValue = link.getAttribute('href');
      if (!hrefValue || hrefValue.startsWith('#') || hrefValue.startsWith('/')) return;
      if (!shouldConfirm(hrefValue)) return;

      event.preventDefault();
      event.stopPropagation();

      pendingRef.current = {
        href: hrefValue,
        target: link.getAttribute('target') ?? undefined,
        download: link.getAttribute('download') ?? undefined,
      };
      setHref(hrefValue);
      lastActiveRef.current = document.activeElement as HTMLElement;
      setIsOpen(true);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (prefersReducedMotion) {
      gsap.set(overlay, { autoAlpha: isOpen ? 1 : 0 });
      gsap.set(panel, { autoAlpha: isOpen ? 1 : 0, y: isOpen ? 0 : 12 });
      return;
    }

    if (isOpen) {
      gsap.set(overlay, { autoAlpha: 0 });
      gsap.set(panel, { autoAlpha: 0, y: 12, scale: 0.98 });
      gsap.to(overlay, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' });
      gsap.to(panel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' });
    } else {
      gsap.to(panel, { autoAlpha: 0, y: 8, duration: 0.2, ease: 'power1.out' });
      gsap.to(overlay, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' });
    }
  }, [isOpen, prefersReducedMotion]);

  useEffect(() => {
    if (!isOpen) {
      lastActiveRef.current?.focus?.();
      return;
    }

    const focusTimer = window.setTimeout(() => {
      confirmRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(focusTimer);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    pendingRef.current = null;
  };

  const handleConfirm = () => {
    const pending = pendingRef.current;
    setIsOpen(false);
    pendingRef.current = null;
    if (!pending) return;

    if (pending.download !== undefined) {
      const tempLink = document.createElement('a');
      tempLink.href = pending.href;
      tempLink.download = pending.download;
      if (pending.target) tempLink.target = pending.target;
      tempLink.rel = 'noreferrer noopener';
      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();
      return;
    }

    if (pending.target === '_blank') {
      window.open(pending.href, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.href = pending.href;
  };

  return (
    <div
      ref={overlayRef}
      className="link-confirm"
      data-open={isOpen ? 'true' : 'false'}
      role="dialog"
      aria-modal="true"
      aria-hidden={isOpen ? 'false' : 'true'}
      aria-label="Confirm navigation"
    >
      <div className="link-confirm-backdrop" onClick={handleClose} />
      <div ref={panelRef} className="link-confirm-panel">
        <p className="eyebrow">Confirmation</p>
        <h3>Are you sure you want to follow the link:</h3>
        <p className="link-confirm-url">{href}</p>
        <div className="link-confirm-actions">
          <button type="button" className="btn ghost" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="btn primary" onClick={handleConfirm} ref={confirmRef}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
