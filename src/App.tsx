import { useRef } from 'react';
import { bindCarouselSpin, centreCarousel } from './animations/carousel';
import { primeLabels } from './animations/canSpin';
import { createCanTimeline, TIMELINES } from './animations/canTimeline';
import { gsap, ScrollTrigger, useGSAP } from './animations/gsap';
import { bindHoverSpin } from './animations/hoverSpin';
import { BELOW_DESKTOP, MOTION } from './animations/media';
import { bindStepNav } from './animations/stepNav';
import type { CanHandle } from './components/can/Can';
import { FixedCan } from './components/can/FixedCan';
import { Navbar } from './components/layout/Navbar';
import { getLenis, useLenis } from './hooks/useLenis';
import { Hero } from './sections/Hero';
import { Products } from './sections/Products';
import { Story } from './sections/Story';

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<CanHandle>(null);

  useLenis();

  useGSAP(
    () => {
      const root = rootRef.current;
      const can = canRef.current;
      if (!root || !can) return;

      primeLabels(root);

      // The active can timeline's trigger, so in-page links can land on its labels.
      let canTrigger: ScrollTrigger | undefined;

      const mm = gsap.matchMedia();
      mm.add(`${MOTION} and (hover: hover)`, () => bindHoverSpin(root));
      // Before the timelines so they measure the carousel at home.
      mm.add(BELOW_DESKTOP, () => centreCarousel(root));
      mm.add(`${MOTION} and ${BELOW_DESKTOP}`, () => bindCarouselSpin(root));
      for (const { query, config } of TIMELINES) {
        mm.add(query, () => {
          const { timeline, revert } = createCanTimeline(root, can, config);
          canTrigger = timeline.scrollTrigger;
          return () => {
            revert();
            canTrigger = undefined;
          };
        });
      }

      const unbindNav = bindStepNav(root, () => canTrigger, getLenis);

      // Web fonts change text metrics → re-measure every trigger once they're in.
      void document.fonts.ready.then(() => ScrollTrigger.refresh());

      return unbindNav;
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[100] -translate-y-[200%] bg-accent px-4 py-2 font-medium text-ink focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      {/* Scroll track for the tablet/mobile sticky scene (see canTimeline stage mode).
          FixedCan lives inside <main>: the sticky <main> is a stacking context, and the
          can must stay between the story photo and its headline. */}
      <div data-scene>
        <main id="main">
          <FixedCan ref={canRef} />
          <Hero />
          <Story />
          <Products />
        </main>
      </div>
    </div>
  );
}
