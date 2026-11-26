import { useRef } from 'react';
import { primeLabels } from './animations/canSpin';
import { createCanTimeline, DESKTOP } from './animations/canTimeline';
import { gsap, ScrollTrigger, useGSAP } from './animations/gsap';
import { bindHoverSpin } from './animations/hoverSpin';
import { bindStepNav } from './animations/stepNav';
import type { CanHandle } from './components/can/Can';
import { FixedCan } from './components/can/FixedCan';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { getLenis, useLenis } from './hooks/useLenis';
import { Hero } from './sections/Hero';
import { Products } from './sections/Products';
import { Story } from './sections/Story';

const MOTION = '(prefers-reduced-motion: no-preference)';

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
      mm.add(`${MOTION} and (min-width: 64rem)`, () => {
        canTrigger = createCanTimeline(root, can, DESKTOP).scrollTrigger;
        return () => {
          canTrigger = undefined;
        };
      });

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
      <FixedCan ref={canRef} />
      <main id="main">
        <Hero />
        <Story />
        <Products />
      </main>
      <Footer />
    </div>
  );
}
