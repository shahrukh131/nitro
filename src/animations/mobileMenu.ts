import { gsap } from './gsap';

/**
 * Paused open/close timeline for the full-screen menu: play() opens, reverse() closes.
 * Reduced motion keeps only a short fade.
 */
export function createMenuTimeline(menu: HTMLElement, reduced: boolean): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(
    menu,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: reduced ? 0.15 : 0.35, ease: 'power2.out' },
  );
  if (reduced) return tl;

  return tl.from(
    menu.querySelectorAll('[data-menu-item]'),
    { yPercent: 60, autoAlpha: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 },
    0.1,
  );
}
