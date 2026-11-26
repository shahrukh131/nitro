import { useImperativeHandle, useRef, type CSSProperties, type Ref } from 'react';
import canBody from '../../assets/images/can-body.png?format=webp';
import { LABEL_SHIFT } from '../../data/can';
import { cx } from '../../lib/cx';

/** Elements the animation layer drives. */
export interface CanHandle {
  wrapper: HTMLDivElement;
  label: HTMLImageElement;
  shine: HTMLDivElement;
}

interface CanProps {
  /** Wide label strip (≈ 4.32 × can width, one panel tiled 3×). */
  label: string;
  /** Accessible name; omit for a decorative can. */
  alt?: string;
  /** Resting label position as a % of the label width — the "spin" angle. */
  labelShift?: number;
  className?: string;
  ref?: Ref<CanHandle>;
}

/**
 * An upright can sized by its parent's height (fixed aspect ratio).
 * Layers, bottom → top: aluminium body → label strip (colour-burned onto the
 * body, masked to its silhouette, slides to fake the spin) → fixed shine.
 */
export function Can({ label, alt, labelShift = LABEL_SHIFT.products, className, ref }: CanProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLImageElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    const wrapper = wrapperRef.current;
    const labelEl = labelRef.current;
    const shine = shineRef.current;
    if (!wrapper || !labelEl || !shine) throw new Error('Can: elements not mounted');
    return { wrapper, label: labelEl, shine };
  }, []);

  const style = { '--can-body': `url(${canBody})` } as CSSProperties;

  return (
    <div
      ref={wrapperRef}
      data-can
      className={cx('relative aspect-(--can-aspect) h-full select-none', className)}
      style={style}
      role={alt ? 'img' : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      <img src={canBody} alt="" draggable={false} className="absolute inset-0 size-full" />
      <div className="can-mask absolute inset-0 overflow-hidden mix-blend-color-burn">
        <img
          ref={labelRef}
          src={label}
          alt=""
          draggable={false}
          data-can-label
          data-label-shift={labelShift}
          className="absolute top-[1.73%] left-0 h-[98.27%] w-auto max-w-none will-change-transform"
          // First paint only; GSAP takes over the transform (see primeLabels).
          style={{ transform: `translateX(${labelShift}%)` }}
        />
      </div>
      <div ref={shineRef} data-can-shine className="can-mask can-shine absolute inset-0" />
    </div>
  );
}
