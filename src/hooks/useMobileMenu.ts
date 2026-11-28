import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap, useGSAP } from '../animations/gsap';
import { MOTION, REDUCED_MOTION, TABLET_UP } from '../animations/media';
import { createMenuTimeline } from '../animations/mobileMenu';

const FOCUSABLE = 'a[href], button:not([disabled])';

/** The page behind the menu, made inert while the menu covers it. */
function setPageInert(inert: boolean): void {
  document.querySelectorAll<HTMLElement>('#main').forEach((el) => {
    el.inert = inert;
  });
}

/**
 * Disclosure-style full-screen menu (phones). React state only feeds ARIA and the
 * icon; the animation is played imperatively from the handlers. While open: page
 * scroll is locked, the rest of the page is inert, Tab cycles through toggle + menu,
 * Esc closes and focus returns to the toggle.
 */
export function useMobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);

  useGSAP(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const mm = gsap.matchMedia();
    // Both conditions listed: a conditions object only runs when one of them matches.
    mm.add({ reduced: REDUCED_MOTION, motion: MOTION }, (ctx) => {
      const tl = createMenuTimeline(menu, Boolean(ctx.conditions?.reduced));
      tl.progress(openRef.current ? 1 : 0);
      tlRef.current = tl;
      return () => {
        tlRef.current = null;
      };
    });
  });

  const setMenu = useCallback((next: boolean, returnFocus = false) => {
    if (openRef.current === next) return;
    openRef.current = next;
    setOpen(next);
    // Synchronous (not in an effect) so a menu link's scroll starts unlocked.
    document.documentElement.style.overflow = next ? 'hidden' : '';
    setPageInert(next);

    // Disclosure pattern: focus stays on the toggle when opening (Tab enters the menu).
    const tl = tlRef.current;
    if (next) {
      tl?.timeScale(1).play();
    } else {
      tl?.timeScale(1.6).reverse();
      if (returnFocus) toggleRef.current?.focus();
    }
  }, []);

  const toggle = useCallback(() => setMenu(!openRef.current, true), [setMenu]);

  // Capture phase: closes before the in-page link handler (stepNav) starts scrolling.
  const onMenuClickCapture = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if ((event.target as Element).closest('a')) setMenu(false);
    },
    [setMenu],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false, true);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [
        toggleRef.current,
        ...(menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter((el): el is HTMLElement => el !== null);
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !items.includes(current as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !items.includes(current as HTMLElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    // The menu is phone-only: growing past the breakpoint closes it.
    const wide = window.matchMedia(TABLET_UP);
    const onWide = () => wide.matches && setMenu(false);

    document.addEventListener('keydown', onKeyDown);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      wide.removeEventListener('change', onWide);
    };
  }, [open, setMenu]);

  // Never leave the page locked if the navbar unmounts while open.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = '';
      setPageInert(false);
    },
    [],
  );

  return { open, toggle, menuRef, toggleRef, onMenuClickCapture };
}
