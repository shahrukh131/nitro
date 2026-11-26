/**
 * Whether a programmatic scroll (in-page link) is running. The can timeline's
 * snap stands down meanwhile — otherwise it fires on a pause in the scroll and
 * fights the link's own scroll, leaving the can between keyframes.
 */
let navigating = false;

export const isNavigating = (): boolean => navigating;

export function setNavigating(value: boolean): void {
  navigating = value;
}
