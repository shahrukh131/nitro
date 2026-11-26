/**
 * Can keyframe data measured from the Figma frames.
 * Label shift = horizontal label position as a % of the label's own width
 * (the "spin" angle of the fake-3D can).
 */
export const LABEL_SHIFT = { hero: -6.4, story: -68.3, products: -37.8 } as const;

/**
 * The label strip is one artwork panel tiled 3× (see scripts/tint-labels.ts),
 * so moving it by one panel looks like one full turn of the can.
 */
export const LABEL_PERIOD = 100 / 3;
