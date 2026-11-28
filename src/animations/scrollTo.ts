import { gsap } from './gsap';

interface ScrollToOptions {
  duration?: number;
  onComplete?: () => void;
}

/**
 * Tweened window scroll used wherever Lenis isn't running (tablet + mobile steps,
 * in-page links). `autoKill: false`: a stray touch must not strand the can mid-step.
 */
export function scrollToY(y: number, { duration = 1, onComplete }: ScrollToOptions = {}) {
  return gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration,
    ease: 'power2.inOut',
    overwrite: true,
    onComplete,
  });
}
