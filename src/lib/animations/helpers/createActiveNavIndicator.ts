import gsap from 'gsap';

type ActiveNavIndicatorOptions = {
  navItems: HTMLElement[];
  indicator: HTMLElement;
  container?: HTMLElement | null;
  prefersReducedMotion?: boolean;
};

export function createActiveNavIndicator({
  navItems,
  indicator,
  container = null,
  prefersReducedMotion = false,
}: ActiveNavIndicatorOptions) {
  if (!indicator) {
    return { cleanup: () => undefined, update: () => undefined };
  }
  const isInitialized = indicator.dataset.navInit === 'true';

  const getActiveItem = () =>
    navItems.find(
      (item) =>
        item.classList.contains('active') ||
        item.getAttribute('aria-current') === 'page' ||
        item.dataset.active === 'true',
    ) ?? navItems[0];

  const updateIndicator = (immediate = false) => {
    const active = getActiveItem();
    if (!active) return;
    const parent = container ?? active.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    const x = rect.left - parentRect.left;
    const y = rect.top - parentRect.top;
    const width = rect.width;
    const height = rect.height;

    if (prefersReducedMotion || immediate) {
      gsap.set(indicator, { x, y, width, height });
      return;
    }

    gsap.to(indicator, {
      x,
      y,
      width,
      height,
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const handleResize = () => updateIndicator(true);
  const handleClick = () => updateIndicator();

  updateIndicator(true);

  if (!isInitialized) {
    indicator.dataset.navInit = 'true';
    window.addEventListener('resize', handleResize);
    navItems.forEach((item) => item.addEventListener('click', handleClick));
  }

  return {
    update: updateIndicator,
    cleanup: () => {
      if (!isInitialized) {
        window.removeEventListener('resize', handleResize);
        navItems.forEach((item) => item.removeEventListener('click', handleClick));
        delete indicator.dataset.navInit;
      }
    },
  };
}
