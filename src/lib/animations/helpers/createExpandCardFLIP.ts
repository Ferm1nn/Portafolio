import gsap from 'gsap';

type ExpandCardOptions = {
  card: HTMLElement;
  modal: HTMLElement;
  overlay?: HTMLElement | null;
  closeBtn: HTMLElement;
  prefersReducedMotion?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
};

export function createExpandCardFLIP({
  card,
  modal,
  overlay,
  closeBtn,
  prefersReducedMotion = false,
  onClose,
  onOpen,
}: ExpandCardOptions) {
  if (card.dataset.flipInit === 'true') {
    return { cleanup: () => undefined, open: () => undefined, close: () => undefined };
  }
  card.dataset.flipInit = 'true';

  let isOpen = false;
  let lastRect: DOMRect | null = null;

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    lastRect = card.getBoundingClientRect();
    modal.dataset.state = 'open';
    modal.style.pointerEvents = 'auto';
    onOpen?.();

    if (prefersReducedMotion) {
      gsap.set(modal, { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 });
      if (overlay) gsap.set(overlay, { autoAlpha: 1 });
      return;
    }

    const modalRect = modal.getBoundingClientRect();
    const dx = lastRect.left - modalRect.left;
    const dy = lastRect.top - modalRect.top;
    const sx = lastRect.width / modalRect.width;
    const sy = lastRect.height / modalRect.height;

    gsap.set(modal, {
      transformOrigin: 'top left',
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
      opacity: 0,
    });

    gsap.to(modal, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
    });

    if (overlay) {
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
    }
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    const targetRect = lastRect ?? card.getBoundingClientRect();

    if (prefersReducedMotion) {
      gsap.set(modal, { opacity: 0 });
      if (overlay) gsap.set(overlay, { autoAlpha: 0 });
      modal.dataset.state = 'closed';
      modal.style.pointerEvents = 'none';
      onClose?.();
      return;
    }

    const modalRect = modal.getBoundingClientRect();
    const dx = targetRect.left - modalRect.left;
    const dy = targetRect.top - modalRect.top;
    const sx = targetRect.width / modalRect.width;
    const sy = targetRect.height / modalRect.height;

    gsap.to(modal, {
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => {
        modal.dataset.state = 'closed';
        modal.style.pointerEvents = 'none';
        onClose?.();
      },
    });

    if (overlay) {
      gsap.to(overlay, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  const handleCardKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  card.addEventListener('click', open);
  card.addEventListener('keydown', handleCardKey);
  closeBtn.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  window.addEventListener('keydown', handleKeyDown);

  const cleanup = () => {
    card.removeEventListener('click', open);
    card.removeEventListener('keydown', handleCardKey);
    closeBtn.removeEventListener('click', close);
    overlay?.removeEventListener('click', close);
    window.removeEventListener('keydown', handleKeyDown);
    gsap.killTweensOf(modal);
    if (overlay) gsap.killTweensOf(overlay);
    delete card.dataset.flipInit;
  };

  return { open, close, cleanup };
}
