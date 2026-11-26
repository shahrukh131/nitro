import type { CSSProperties } from 'react';
import canBody from '../../assets/images/can-body.png?format=webp';
import { LABEL_SHIFT } from '../../data/can';
import { cx } from '../../lib/cx';

interface CanProps {
  /** Wide label strip (≈ 4.32 × can width). */
  label: string;
  /** Accessible name; omit for a decorative can. */
  alt?: string;
  /** Horizontal label position as a % of the label width — the "spin" angle. */
  labelShift?: number;
  className?: string;
}

/**
 * An upright can sized by its parent's height (fixed aspect ratio).
 * Layers: aluminium body → label strip (colour-burned onto the body and
 * masked to its silhouette).
 */
export function Can({ label, alt, labelShift = LABEL_SHIFT.products, className }: CanProps) {
  const style = { '--can-body': `url(${canBody})` } as CSSProperties;

  return (
    <div
      className={cx('relative aspect-(--can-aspect) h-full select-none', className)}
      style={style}
      role={alt ? 'img' : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      <img src={canBody} alt="" draggable={false} className="absolute inset-0 size-full" />
      <div className="absolute inset-0 overflow-hidden mix-blend-color-burn [mask-image:var(--can-body)] [mask-size:100%_100%]">
        <img
          src={label}
          alt=""
          draggable={false}
          className="absolute top-[1.73%] left-0 h-[98.27%] w-auto max-w-none"
          style={{ transform: `translateX(${labelShift}%)` }}
        />
      </div>
    </div>
  );
}
