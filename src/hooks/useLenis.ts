import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsap';
import { MOTION } from '../animations/media';

/**
 * Smooth wheel/trackpad scroll on every breakpoint. Touch keeps native scrolling
 * (Lenis' syncTouch is off), so phones keep their own momentum.
 */
const LENIS_QUERY = MOTION;

/** The running instance (null when Lenis is off), for code that needs to scroll programmatically. */
let current: Lenis | null = null;
export const getLenis = (): Lenis | null => current;

/**
 * Runs Lenis on GSAP's ticker (one RAF loop) and keeps ScrollTrigger in sync.
 * Starts/stops as the media query flips (reduced-motion setting).
 * In-page links are handled by `animations/stepNav.ts`, so Lenis `anchors` is off.
 */
export function useLenis(query: string = LENIS_QUERY): void {
  useEffect(() => {
    const mql = window.matchMedia(query);
    const tick = (time: number) => current?.raf(time * 1000);

    const stop = () => {
      if (!current) return;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      current.destroy();
      current = null;
    };
    const start = () => {
      current = new Lenis({ autoRaf: false, anchors: false, lerp: 0.1 });
      current.on('scroll', ScrollTrigger.update);
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
