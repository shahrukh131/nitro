import type { CanHandle } from '../components/can/Can';
import { LABEL_SHIFT } from '../data/can';
import { featuredProduct } from '../data/products';
import { labelShiftVars } from './canSpin';
import { gsap, ScrollTrigger } from './gsap';
import { isNavigating } from './scrollIntent';

type Step = 'hero' | 'story' | 'products';

/** Per-breakpoint tuning. Positions/sizes are NOT here — they're measured from the layout. */
export interface CanTimelineConfig {
  /** Can rotation (deg) at each step; 90 = lying on its side, top to the right. */
  rotation: Record<Step, number>;
  /** Label shift (% of label width) at each step — each shows Figma's panel for that frame. */
  labelShift: Record<Step, number>;
  /**
   * ScrollTrigger scrub. `true` = playhead locked to scroll (use when Lenis already
   * smooths); a number adds smoothing but makes the can trail the page.
   */
  scrub: boolean | number;
  /** Snap tween duration range (s). */
  snapDuration: { min: number; max: number };
}

export const DESKTOP: CanTimelineConfig = {
  rotation: { hero: 90, story: 90, products: 0 },
  labelShift: {
    hero: LABEL_SHIFT.hero,
    story: LABEL_SHIFT.story,
    // Figma's own values: like Smart Animate, the label slides back on 2 → 3.
    products: LABEL_SHIFT.products,
  },
  scrub: true,
  snapDuration: { min: 0.4, max: 1.1 },
};

function required<T extends Element>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`canTimeline: missing ${selector}`);
  return el;
}

function collect(root: HTMLElement) {
  const featured = `[data-product="${featuredProduct.id}"]`;
  return {
    layer: required<HTMLElement>(root, '[data-fixed-can]'),
    sections: {
      hero: required<HTMLElement>(root, '#home'),
      story: required<HTMLElement>(root, '#story'),
      products: required<HTMLElement>(root, '#products'),
    },
    targets: {
      hero: required<HTMLElement>(root, '[data-can-slot="hero"]'),
      story: required<HTMLElement>(root, '[data-can-slot="story"]'),
      products: required<HTMLElement>(root, `${featured} [data-can]`),
    },
    staticCans: root.querySelectorAll<HTMLElement>('[data-can-slot] [data-can]'),
    heroContent: root.querySelectorAll<HTMLElement>(
      '[data-anim="hero-title"], [data-anim="hero-bottom"]',
    ),
    storyTitle: required<HTMLElement>(root, '[data-anim="story-title"]'),
    sideCards: root.querySelectorAll<HTMLElement>(
      '[data-anim="product-card"]:not([data-featured])',
    ),
    featuredInfo: required<HTMLElement>(root, `${featured} [data-anim="product-info"]`),
    featuredGlow: required<HTMLElement>(root, `${featured} [data-glow]`),
  };
}

type Elements = ReturnType<typeof collect>;

interface Pose {
  x: number;
  y: number;
  scale: number;
}

/**
 * Where the fixed can must be (offset from viewport centre + scale) to cover
 * `step`'s target once that step's section is scrolled to the top.
 * Subtracting the section's rect makes the result independent of the current
 * scroll position, so it can be re-measured on any refresh.
 */
function measure(els: Elements, can: CanHandle, step: Step): Pose {
  const target = els.targets[step].getBoundingClientRect();
  const section = els.sections[step].getBoundingClientRect();
  const viewport = els.layer.getBoundingClientRect();
  return {
    x: target.left + target.width / 2 - (viewport.left + viewport.width / 2),
    y: target.top - section.top + target.height / 2 - viewport.height / 2,
    // offsetHeight ignores transforms (the slots' rotation, the can's own scale).
    scale: els.targets[step].offsetHeight / can.wrapper.offsetHeight,
  };
}

/**
 * The master scroll timeline: hero (0) → story (1) → products (2).
 * The fixed can flies between the measured slots; section content moves in
 * and out around it. At "products" the fixed can hands over to the real
 * featured-product can so the rest of the page scrolls normally.
 */
export function createCanTimeline(
  root: HTMLElement,
  can: CanHandle,
  config: CanTimelineConfig = DESKTOP,
): gsap.core.Timeline {
  const els = collect(root);
  const pose = (step: Step) => ({
    x: () => measure(els, can, step).x,
    y: () => measure(els, can, step).y,
    scale: () => measure(els, can, step).scale,
    rotation: config.rotation[step],
  });

  gsap.set(els.layer, { autoAlpha: 1 });
  gsap.set([...els.staticCans, els.targets.products], { autoAlpha: 0 });

  // Same as GSAP's 'labelsDirectional', but a no-op while an in-page link scrolls.
  const snapToLabel = (progress: number, self?: ScrollTrigger) => {
    if (isNavigating()) return progress;
    const stops = Object.values(tl.labels)
      .map((time) => time / tl.duration())
      .sort((a, b) => a - b);
    return ScrollTrigger.snapDirectional(stops)(progress, self?.direction ?? 0);
  };

  const tl = gsap.timeline({
    defaults: { duration: 1, ease: 'power1.inOut' },
    scrollTrigger: {
      trigger: els.sections.hero,
      start: 'top top',
      endTrigger: els.sections.products,
      end: 'top top',
      scrub: config.scrub,
      invalidateOnRefresh: true,
      snap: {
        snapTo: snapToLabel,
        duration: config.snapDuration,
        delay: 0.08,
        ease: 'power2.inOut',
      },
    },
  });

  // 1 → 2: hero out, can grows and spins onto the story photo, headline in.
  tl.addLabel('hero', 0)
    .fromTo(can.wrapper, pose('hero'), pose('story'), 0)
    .fromTo(
      can.label,
      labelShiftVars(config.labelShift.hero),
      labelShiftVars(config.labelShift.story),
      0,
    )
    .to(els.heroContent, { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 0)
    .from(els.storyTitle, { yPercent: 30, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0.5)

    // 2 → 3: story out, can tilts upright, shrinks into the centre slot and spins;
    // side cans rise in from the centre outwards, then the glow.
    .addLabel('story', 1)
    .to(can.wrapper, pose('products'), 1)
    .to(can.label, labelShiftVars(config.labelShift.products), 1)
    .to(els.storyTitle, { yPercent: -30, autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 1)
    .from(
      els.sideCards,
      {
        yPercent: 25,
        autoAlpha: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: { each: 0.06, from: 'center' },
      },
      1.3,
    )
    .from(els.featuredInfo, { yPercent: 40, autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 1.45)
    .from(els.featuredGlow, { autoAlpha: 0, duration: 0.3 }, 1.7)

    .addLabel('products', 2);

  // Handoff, driven by the real scroll position (not the playhead): the moment the
  // products section starts to scroll away, the fixed can must stop being fixed.
  // Pose + label are identical at "products", so the swap is invisible.
  const handOff = (atProducts: boolean) => {
    gsap.set(els.layer, { autoAlpha: atProducts ? 0 : 1 });
    gsap.set(els.targets.products, { autoAlpha: atProducts ? 1 : 0 });
  };
  // Only the start line matters (an `isActive` toggle would flip back at the page
  // bottom, where scroll === end). onRefresh covers loading mid-page and resizes.
  // +2px tolerance: smooth scroll can settle a sub-pixel short of the snap point.
  ScrollTrigger.create({
    trigger: els.sections.products,
    start: 'top top+=2',
    onEnter: () => handOff(true),
    onLeaveBack: () => handOff(false),
    onRefresh: (self) => handOff(self.scroll() >= self.start),
  });

  return tl;
}
