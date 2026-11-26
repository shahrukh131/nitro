import { spinRest, spinTurn } from './canSpin';
import { gsap } from './gsap';

/**
 * Product cards: on hover / keyboard focus the can lifts and turns once; on
 * leave it turns back, so it always rests on the exact design artwork.
 * Returns a cleanup that removes every listener.
 */
export function bindHoverSpin(scope: ParentNode): () => void {
  const cleanups = Array.from(scope.querySelectorAll<HTMLElement>('[data-product]'), (card) => {
    const can = card.querySelector<HTMLElement>('[data-can]');
    const label = card.querySelector<HTMLElement>('[data-can-label]');
    if (!can || !label) return () => {};

    const enter = () => {
      spinTurn(label);
      gsap.to(can, { yPercent: -3, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    };
    const leave = () => {
      spinRest(label, { duration: 0.9 });
      gsap.to(can, { yPercent: 0, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' });
    };

    card.addEventListener('pointerenter', enter);
    card.addEventListener('pointerleave', leave);
    card.addEventListener('focusin', enter);
    card.addEventListener('focusout', leave);
    return () => {
      card.removeEventListener('pointerenter', enter);
      card.removeEventListener('pointerleave', leave);
      card.removeEventListener('focusin', enter);
      card.removeEventListener('focusout', leave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
