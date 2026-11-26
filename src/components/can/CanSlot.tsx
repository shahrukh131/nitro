import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export type CanStep = 'hero' | 'story';

interface CanSlotProps {
  step: CanStep;
  className?: string;
  children?: ReactNode;
}

const scale: Record<CanStep, string> = {
  hero: 'h-[calc(var(--can-h)*var(--can-scale-hero))]',
  story: 'h-[calc(var(--can-h)*var(--can-scale-story))]',
};

/**
 * Marks where the can sits (and how big it is) at a scroll step. It holds a
 * static can for the no-motion layout; the scroll timeline measures it to
 * know where to fly the fixed can. Slots are upright boxes rotated 90° so the
 * can lies on its side, top to the right.
 */
export function CanSlot({ step, className, children }: CanSlotProps) {
  return (
    <div
      data-can-slot={step}
      className={cx(
        'pointer-events-none absolute left-1/2 aspect-(--can-aspect) -translate-1/2 rotate-90',
        scale[step],
        className,
      )}
    >
      {children}
    </div>
  );
}
