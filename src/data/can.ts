/**
 * Can keyframe data measured from the Figma frames.
 * Label shift = horizontal label position as a % of the label's own width
 * (the "spin" angle of the fake-3D can). Hero/story/products each show a
 * different panel of Figma's 3-panel strip, exactly as the design does.
 */
export const LABEL_SHIFT = { hero: -6.4, story: -68.3, products: -37.8 } as const;

/** One panel of the strip ≈ one full turn of the can. */
export const LABEL_PERIOD = 100 / 3;

/**
 * Shifts for which the strip still covers the whole can: the visible window is
 * 1 / 4.32 of the label width (the label is 4.32× the can's width).
 */
export const LABEL_SHIFT_RANGE = { min: -(100 - 100 / 4.32), max: 0 } as const;
