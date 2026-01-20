type SplitTarget = HTMLElement | null;

export function splitTextToSpans(element: SplitTarget) {
  if (!element) return [];
  if (element.dataset.splitInit === 'true') {
    return Array.from(element.querySelectorAll<HTMLElement>('span[data-word]'));
  }

  const text = element.textContent?.trim();
  if (!text) return [];

  element.dataset.splitInit = 'true';
  element.setAttribute('aria-label', text);
  element.textContent = '';

  const words = text.split(' ');
  const spans: HTMLElement[] = [];

  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.dataset.word = 'true';
    span.className = 'split-word';
    element.appendChild(span);
    spans.push(span);
    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });

  return spans;
}
