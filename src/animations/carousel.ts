import { spinShowcase } from './canSpin';

const SETTLE_MS = 140;

function isScrollable(carousel: HTMLElement): boolean {
  return carousel.scrollWidth > carousel.clientWidth + 1;
}

/** scrollLeft that centres the featured card (the side padding lets every card reach the centre). */
export function carouselHome(carousel: HTMLElement): number {
  const featured = carousel.querySelector<HTMLElement>('[data-featured]');
  if (!featured || !isScrollable(carousel)) return 0;
  const card = featured.getBoundingClientRect();
  const box = carousel.getBoundingClientRect();
  const home =
    carousel.scrollLeft + card.left + card.width / 2 - (box.left + carousel.clientWidth / 2);
  return Math.min(Math.max(home, 0), carousel.scrollWidth - carousel.clientWidth);
}

/** How far the carousel is swiped away from home (0 when it isn't a carousel, e.g. desktop). */
export function carouselOffset(carousel: HTMLElement | null): number {
  if (!carousel || !isScrollable(carousel)) return 0;
  return carousel.scrollLeft - carouselHome(carousel);
}

export function slideCarouselHome(carousel: HTMLElement | null): void {
  if (!carousel || Math.abs(carouselOffset(carousel)) < 1) return;
  carousel.scrollTo({ left: carouselHome(carousel), behavior: 'smooth' });
}

/** Opens the carousel on the featured card instead of the first one (layout, not motion). */
export function centreCarousel(root: ParentNode): void {
  const carousel = root.querySelector<HTMLElement>('[data-carousel]');
  if (carousel) carousel.scrollLeft = carouselHome(carousel);
}

function centredCard(carousel: HTMLElement): HTMLElement | null {
  const box = carousel.getBoundingClientRect();
  const centre = box.left + carousel.clientWidth / 2;
  let best: HTMLElement | null = null;
  let bestDistance = Infinity;
  for (const card of carousel.querySelectorAll<HTMLElement>('[data-product]')) {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - centre);
    if (distance < bestDistance) {
      best = card;
      bestDistance = distance;
    }
  }
  return best;
}

/**
 * Touch counterpart of the hover spin: when a swipe settles on a new card, its
 * can turns once and comes back to rest. Hidden cans (the featured one while the
 * fixed can stands in for it) are skipped so the handoff always sees the rest label.
 */
export function bindCarouselSpin(root: ParentNode): () => void {
  const carousel = root.querySelector<HTMLElement>('[data-carousel]');
  if (!carousel) return () => {};

  let active = centredCard(carousel);
  let timer = 0;

  const settle = () => {
    const card = centredCard(carousel);
    if (!card || card === active) return;
    active = card;
    const can = card.querySelector<HTMLElement>('[data-can]');
    const label = card.querySelector<HTMLElement>('[data-can-label]');
    if (can && label && getComputedStyle(can).visibility !== 'hidden') spinShowcase(label);
  };
  // Debounced `scroll` rather than `scrollend`, which older Safari lacks.
  const onScroll = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(settle, SETTLE_MS);
  };

  carousel.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.clearTimeout(timer);
    carousel.removeEventListener('scroll', onScroll);
  };
}
