import type Lenis from 'lenis';
import { ScrollTrigger } from './gsap';
import { setNavigating } from './scrollIntent';

/** Sections that are steps of the can timeline → their timeline label. */
const STEP_BY_ID: Record<string, string> = { home: 'hero', story: 'story', products: 'products' };

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

function focusSection(target: HTMLElement): void {
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/**
 * Single owner of in-page `#hash` links. Step sections scroll to the exact
 * timeline label (not merely the element top), so the can always lands on a
 * keyframe; the scroll is locked so a stray wheel tick can't strand it halfway.
 * Focus then moves to the section for keyboard / screen-reader users.
 */
export function bindStepNav(
  root: HTMLElement,
  getTrigger: () => ScrollTrigger | undefined,
  getLenis: () => Lenis | null,
): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || !root.contains(link)) return;
    const id = link.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    event.preventDefault();

    const trigger = getTrigger();
    const step = STEP_BY_ID[id];
    const top =
      trigger && step
        ? trigger.labelToScroll(step)
        : target.getBoundingClientRect().top + window.scrollY;
    const land = () => {
      setNavigating(false);
      // Make sure the timeline reflects the final scroll position.
      ScrollTrigger.update();
      focusSection(target);
      history.replaceState(null, '', `#${id}`);
    };

    setNavigating(true);
    const lenis = getLenis();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (Math.abs(window.scrollY - top) < 1) {
      land(); // already there (Lenis wouldn't report completion)
    } else if (lenis && !reduced) {
      lenis.scrollTo(top, {
        duration: 1.2,
        easing: easeInOutCubic,
        lock: true,
        force: true,
        onComplete: land,
      });
    } else if (reduced) {
      window.scrollTo({ top, behavior: 'auto' });
      land();
    } else {
      window.addEventListener('scrollend', land, { once: true });
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
