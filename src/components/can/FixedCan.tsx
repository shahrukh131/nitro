import type { Ref } from 'react';
import { LABEL_SHIFT } from '../../data/can';
import { featuredProduct } from '../../data/products';
import { Can, type CanHandle } from './Can';

interface FixedCanProps {
  ref?: Ref<CanHandle>;
}

/**
 * The one can that travels through the scroll story. It sits fixed in the
 * viewport centre at the products-step size (`--can-h`, upright); the scroll
 * timeline moves, scales and rotates it onto each step's CanSlot.
 * Hidden until the timeline shows it, so no-JS / reduced motion keep the static cans.
 */
export function FixedCan({ ref }: FixedCanProps) {
  return (
    <div
      data-fixed-can
      aria-hidden
      className="pointer-events-none invisible fixed inset-0 z-10 grid place-items-center"
    >
      <div className="h-(--can-h)">
        <Can ref={ref} label={featuredProduct.label} labelShift={LABEL_SHIFT.hero} />
      </div>
    </div>
  );
}
