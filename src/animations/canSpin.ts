import { LABEL_PERIOD, LABEL_SHIFT_RANGE } from '../data/can';
import { gsap } from './gsap';

/*
 * Spin = sliding the label strip horizontally inside the can's clip.
 * The strip is Figma's original (3 similar, not identical, panels), so there is
 * no wrap-around: every target stays inside LABEL_SHIFT_RANGE, where the strip
 * still covers the whole can.
 */
const SPIN_DEFAULTS: gsap.TweenVars = { duration: 1.2, ease: 'power2.inOut' };

/** Tween vars for a label position inside a timeline. */
export function labelShiftVars(shift: number): gsap.TweenVars {
  return { xPercent: shift };
}

/** Resting label position the component was rendered with. */
function restShift(label: HTMLElement): number {
  return Number(label.dataset.labelShift ?? 0);
}

/** Hands every label's transform to GSAP (replacing the inline first-paint style). */
export function primeLabels(scope: ParentNode): void {
  scope.querySelectorAll<HTMLElement>('[data-can-label]').forEach((label) => {
    gsap.set(label, { x: 0, xPercent: restShift(label) });
  });
}

/** Tween the label to an absolute shift (% of the label width). */
export function spinTo(
  label: HTMLElement,
  shift: number,
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.to(label, { ...SPIN_DEFAULTS, xPercent: shift, overwrite: true, ...vars });
}

/**
 * One full turn away from the resting artwork (one panel), in whichever
 * direction stays on the strip.
 */
export function spinTurn(label: HTMLElement, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return spinTo(label, turnShift(label), vars);
}

function turnShift(label: HTMLElement): number {
  const rest = restShift(label);
  const forward = rest - LABEL_PERIOD;
  return forward >= LABEL_SHIFT_RANGE.min ? forward : rest + LABEL_PERIOD;
}

/** One turn out and back in a single tween, so the label always ends on its rest artwork. */
export function spinShowcase(label: HTMLElement): gsap.core.Tween {
  return gsap.to(label, {
    keyframes: [
      { xPercent: turnShift(label), duration: 0.8, ease: 'power2.inOut' },
      { xPercent: restShift(label), duration: 0.9, ease: 'power2.inOut' },
    ],
    overwrite: true,
  });
}

/** Back to the resting artwork (exactly what the design shows). */
export function spinRest(label: HTMLElement, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return spinTo(label, restShift(label), vars);
}
