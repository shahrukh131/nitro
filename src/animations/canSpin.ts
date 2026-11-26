import { LABEL_PERIOD } from '../data/can';
import { gsap } from './gsap';

/*
 * Spin = sliding the label strip horizontally inside the can's clip.
 * The strip repeats every LABEL_PERIOD %, so the rendered position is wrapped
 * into [-2·period, 0): the strip always covers the can, and a tween can run
 * through any number of turns without ever running out of label.
 */
const wrapShift = gsap.utils.wrap(-2 * LABEL_PERIOD, 0);
const wrapModifier = { xPercent: (value: number) => wrapShift(Number(value)) };

const SPIN_DEFAULTS: gsap.TweenVars = { duration: 1.2, ease: 'power2.inOut' };

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

/** Tween the label to an absolute shift (unwrapped values are fine — rendering wraps). */
export function spinTo(
  label: HTMLElement,
  shift: number,
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.to(label, {
    ...SPIN_DEFAULTS,
    xPercent: shift,
    modifiers: wrapModifier,
    overwrite: true,
    ...vars,
  });
}

/**
 * Spin by whole turns (negative = label moves left). Always lands on a
 * rest-equivalent position, even when interrupting a running spin.
 */
export function spinBy(label: HTMLElement, turns = 1, vars: gsap.TweenVars = {}): gsap.core.Tween {
  const rest = restShift(label);
  const current = Number(gsap.getProperty(label, 'xPercent'));
  const turnsFromRest = Math.round((current - rest) / LABEL_PERIOD);
  return spinTo(label, rest + (turnsFromRest - turns) * LABEL_PERIOD, vars);
}
