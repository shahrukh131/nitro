import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsap';

/** Smooth scroll on tablet + desktop only; touch phones keep native scrolling. */
const LENIS_QUERY = '(min-width: 40rem) and (prefers-reduced-motion: no-preference)';

/**
 * Runs Lenis on GSAP's ticker (one RAF loop) and keeps ScrollTrigger in sync.
 * Starts/stops as the media query flips, e.g. when resizing across 640px.
 */
export function useLenis(query: string = LENIS_QUERY): void {
  useEffect(() => {
    const mql = window.matchMedia(query);
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    const stop = () => {
      if (!lenis) return;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenis = null;
    };
    const start = () => {
      lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };
    const sync = () => {
      stop();
      if (mql.matches) start();
    };

    sync();
    mql.addEventListener('change', sync);
    return () => {
      mql.removeEventListener('change', sync);
      stop();
    };
  }, [query]);
}
