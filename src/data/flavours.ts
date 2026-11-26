/**
 * Flavour colours — the single source for both the runtime (glow, name colour)
 * and `scripts/tint-labels.ts` (pre-rendered label tints). Kept free of imports
 * so Node can run the script against it directly.
 */
export type FlavourId = 'eng' | 'red' | 'green' | 'sky' | 'blue';

export interface Flavour {
  id: FlavourId;
  /** Hue applied to the base label (Figma "hue" blend). `null` = untinted base label. */
  tint: string | null;
  /** Glow / accent colour for the product card. */
  glow: string;
  /** Text colour; lightened where the raw colour fails WCAG AA on black. */
  text: string;
}

export const flavours: Record<FlavourId, Flavour> = {
  eng: { id: 'eng', tint: '#ff8000', glow: '#ff8000', text: '#ff9a3d' },
  red: { id: 'red', tint: '#ff0000', glow: '#ff2a2a', text: '#ff5c5c' },
  green: { id: 'green', tint: null, glow: '#e0e600', text: '#e0e600' },
  sky: { id: 'sky', tint: '#00b2ff', glow: '#00b2ff', text: '#3dc4ff' },
  blue: { id: 'blue', tint: '#0004ff', glow: '#2b3bff', text: '#8c90ff' },
};
