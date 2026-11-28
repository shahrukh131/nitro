import type { CanHandle } from '../components/can/Can';
import { LABEL_SHIFT } from '../data/can';
import { featuredProduct } from '../data/products';
import { carouselOffset, slideCarouselHome } from './carousel';
import { labelShiftVars, spinRest } from './canSpin';
import { gsap, ScrollTrigger } from './gsap';
import * as media from './media';
import { isNavigating } from './scrollIntent';

export type Step = 'hero' | 'story' | 'products';
export const STEPS: readonly Step[] = ['hero', 'story', 'products'];

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
  /** Snap tween duration range (s) for settling on the nearest step in the scroll direction. */
  snap: { min: number; max: number };
  /**
   * Stage mode: the sections are stacked in one screen and `<main>` stays stuck (sticky)
   * while the steps cross-fade, so every scrubbed frame is a composed scene.
   * `false` = flow mode: the sections scroll past normally.
   */
  stage: boolean;
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
  snap: { min: 0.4, max: 1.1 },
  stage: false,
};

/*
 * Tablet + mobile: same choreography as desktop (Lenis + scrub + snap) on a sticky scene.
 * The page always follows the finger/wheel; a gesture-hijacking stepper was dropped: it
 * cancelled the scroll, then replayed a canned tween, and fought trackpad inertia and flings.
 */
export const TABLET: CanTimelineConfig = {
  ...DESKTOP,
  snap: { min: 0.35, max: 0.9 },
  stage: true,
};

export const MOBILE: CanTimelineConfig = { ...DESKTOP, snap: { min: 0.3, max: 0.8 }, stage: true };

/** One tuned timeline per breakpoint, for `gsap.matchMedia()`. */
export const TIMELINES: readonly { query: string; config: CanTimelineConfig }[] = [
  { query: `${media.MOTION} and ${media.DESKTOP}`, config: DESKTOP },
  { query: `${media.MOTION} and ${media.TABLET}`, config: TABLET },
  { query: `${media.MOTION} and ${media.MOBILE}`, config: MOBILE },
];

function required<T extends Element>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`canTimeline: missing ${selector}`);
  return el;
}

function collect(root: HTMLElement) {
  const featured = `[data-product="${featuredProduct.id}"]`;
  return {
    scene: required<HTMLElement>(root, '[data-scene]'),
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
    carousel: root.querySelector<HTMLElement>('[data-carousel]'),
    staticCans: root.querySelectorAll<HTMLElement>('[data-can-slot] [data-can]'),
    heroContent: root.querySelectorAll<HTMLElement>(
      '[data-anim="hero-title"], [data-anim="hero-bottom"]',
    ),
    storyTitle: required<HTMLElement>(root, '[data-anim="story-title"]'),
    storyLines: root.querySelectorAll<HTMLElement>('[data-anim="story-line"]'),
    storyPhoto: required<HTMLElement>(root, '[data-anim="story-photo"]'),
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
 * scroll position, so it can be re-measured on any refresh (and in stage mode,
 * where every section shares the top of `<main>`).
 */
function measure(els: Elements, can: CanHandle, step: Step): Pose {
  const target = els.targets[step].getBoundingClientRect();
  const section = els.sections[step].getBoundingClientRect();
  const viewport = els.layer.getBoundingClientRect();
  // Below desktop the featured card sits in a swipeable carousel: always aim for
  // its home position (centred), whatever the carousel is currently swiped to.
  const swipe = step === 'products' ? carouselOffset(els.carousel) : 0;
  return {
    x: target.left + target.width / 2 + swipe - (viewport.left + viewport.width / 2),
    y: target.top - section.top + target.height / 2 - viewport.height / 2,
    // offsetHeight ignores transforms (the slots' rotation, the can's own scale).
    scale: els.targets[step].offsetHeight / can.wrapper.offsetHeight,
  };
}

export interface CanTimeline {
  timeline: gsap.core.Timeline;
  /** Undo what GSAP's context can't (the stage attribute). Call from the matchMedia cleanup. */
  revert: () => void;
}

/**
 * The master scroll timeline: hero (0) → story (1) → products (2).
 * The fixed can flies between the measured slots; section content moves in
 * and out around it. At "products" the fixed can hands over to the real
 * featured-product can so the rest of the page scrolls normally.
 *
 * Every segment is a `fromTo`: a `.to` re-reads its start values on refresh,
 * which after a resize mid-page made the hero step render at the story pose.
 */
export function createCanTimeline(
  root: HTMLElement,
  can: CanHandle,
  config: CanTimelineConfig = DESKTOP,
): CanTimeline {
  const els = collect(root);
  // Before anything is measured: the stacked layout is what the poses are taken from.
  if (config.stage) els.scene.dataset.stage = '';

  const pose = (step: Step) => ({
    x: () => measure(els, can, step).x,
    y: () => measure(els, can, step).y,
    scale: () => measure(els, can, step).scale,
    rotation: config.rotation[step],
  });
  const label = (step: Step) => labelShiftVars(config.labelShift[step]);
  const later = { immediateRender: false };

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

  const range: ScrollTrigger.Vars = config.stage
    ? {
        trigger: els.scene,
        start: 'top top',
        // <main> is `position: sticky` inside the scene track (CSS); the track's ::after
        // spacer is the scroll distance it stays stuck for — two steps of one screen.
        // Sticky, not `pin`: the pin-spacer reparents <main>, which resets the
        // carousel's scrollLeft, and fixed-position pinning jitters on iOS.
        end: () => `+=${parseFloat(getComputedStyle(els.scene, '::after').height)}`,
      }
    : {
        trigger: els.sections.hero,
        start: 'top top',
        endTrigger: els.sections.products,
        end: 'top top',
      };

  const tl = gsap.timeline({
    defaults: { duration: 1, ease: 'power1.inOut' },
    scrollTrigger: {
      ...range,
      scrub: config.scrub,
      invalidateOnRefresh: true,
      snap: {
        snapTo: snapToLabel,
        duration: config.snap,
        delay: 0.08,
        ease: 'power2.inOut',
        // Snap from where the scroll actually rests, not a velocity-predicted point:
        // a hard touch fling otherwise skipped a step (page end → hero, past story).
        inertia: false,
      },
    },
  });

  // 1 → 2: hero out, can grows and spins onto the story photo; photo rises, lines rise.
  tl.addLabel('hero', 0)
    .fromTo(can.wrapper, pose('hero'), pose('story'), 0)
    .fromTo(can.label, label('hero'), label('story'), 0)
    .fromTo(
      els.heroContent,
      { yPercent: 0, autoAlpha: 1 },
      { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power1.in' },
      0,
    )
    .fromTo(
      els.storyPhoto,
      { y: () => window.innerHeight * 0.2, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
      0.35,
    )
    .fromTo(
      els.storyLines,
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out', stagger: 0.06 },
      0.45,
    )

    // 2 → 3: story out, can tilts upright, shrinks into the centre slot and spins;
    // side cans rise in from the centre outwards, then the glow.
    .addLabel('story', 1)
    .fromTo(can.wrapper, pose('story'), { ...pose('products'), ...later }, 1)
    .fromTo(can.label, label('story'), { ...label('products'), ...later }, 1)
    .fromTo(
      els.storyTitle,
      { yPercent: 0, autoAlpha: 1 },
      { yPercent: -30, autoAlpha: 0, duration: 0.5, ease: 'power1.in', ...later },
      1,
    )
    .fromTo(
      els.sideCards,
      { yPercent: 25, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.45,
        ease: 'power2.out',
        stagger: { each: 0.06, from: 'center' },
      },
      1.3,
    )
    .fromTo(
      els.featuredInfo,
      { yPercent: 40, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' },
      1.45,
    )
    .fromTo(els.featuredGlow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.7)
    .addLabel('products', 2);

  if (config.stage) {
    // The sections overlap, so each one is hidden (and unclickable) outside its step.
    // Story is switched, not faded: an opacity < 1 would make it a stacking context and
    // drop its headline below the can mid-fade; its children fade on their own.
    const instant = { duration: 0.01, ease: 'none' };
    tl.fromTo(
      els.sections.hero,
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: 0.25, ease: 'none' },
      0.35,
    )
      .fromTo(els.sections.story, { autoAlpha: 0 }, { autoAlpha: 1, ...instant }, 0.3)
      .fromTo(
        els.storyPhoto,
        { y: 0, autoAlpha: 1 },
        { y: () => window.innerHeight * -0.1, autoAlpha: 0, duration: 0.4, ...later },
        1.05,
      )
      .fromTo(els.sections.story, { autoAlpha: 1 }, { autoAlpha: 0, ...instant, ...later }, 1.5)
      .fromTo(
        els.sections.products,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2, ease: 'none' },
        1.25,
      );
  }

  // Handoff, driven by the real scroll position (not the playhead): the moment the
  // page scrolls past the timeline's end, the fixed can must stop being fixed.
  // Pose + label are identical at "products", so the swap is invisible.
  const handOff = (atProducts: boolean) => {
    gsap.set(els.layer, { autoAlpha: atProducts ? 0 : 1 });
    gsap.set(els.targets.products, { autoAlpha: atProducts ? 1 : 0 });
  };
  // Only the start line matters (an `isActive` toggle would flip back at the page
  // bottom, where scroll === end). onRefresh covers loading mid-page and resizes.
  // −2px tolerance: smooth scroll can settle a sub-pixel short of the end.
  // The timeline end, not the products top: in stage mode #products sits at the top of <main>.
  ScrollTrigger.create({
    start: () => (tl.scrollTrigger?.end ?? 0) - 2,
    end: 'max',
    onEnter: () => handOff(true),
    onLeaveBack: () => {
      handOff(false);
      // The fixed can flies back from the home slot: bring the carousel (and the
      // featured label, possibly mid-spin) back to match it for the next handoff.
      slideCarouselHome(els.carousel);
      const featuredLabel = els.targets.products.querySelector<HTMLElement>('[data-can-label]');
      if (featuredLabel) spinRest(featuredLabel, { duration: 0 });
    },
    onRefresh: (self) => handOff(self.scroll() >= self.start),
  });

  return {
    timeline: tl,
    revert: () => {
      delete els.scene.dataset.stage;
    },
  };
}
