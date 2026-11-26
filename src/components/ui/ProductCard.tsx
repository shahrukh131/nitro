import type { CSSProperties } from 'react';
import type { CanSize, Product } from '../../data/products';
import { cx } from '../../lib/cx';
import { formatPrice } from '../../lib/format';
import { Can } from '../can/Can';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const canHeight: Record<CanSize, string> = {
  lg: 'h-(--can-h)',
  md: 'h-[calc(var(--can-h)*var(--can-scale-md))]',
  sm: 'h-[calc(var(--can-h)*var(--can-scale-sm))]',
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { name, tagline, price, label, flavour, size, featured } = product;
  const style = {
    '--flavour-glow': flavour.glow,
    '--flavour-text': flavour.text,
  } as CSSProperties;

  return (
    <article
      data-product={product.id}
      className={cx('group flex flex-col items-center text-center', className)}
      style={style}
    >
      <div className={cx('relative isolate', canHeight[size])}>
        {/* Floor ellipse + flavour glow (glow fades in on hover / when featured). */}
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 -z-10 aspect-[6.6] w-[108%] -translate-x-1/2 translate-y-[45%] rounded-[50%] bg-floor"
        />
        <div
          aria-hidden
          data-glow
          className={cx(
            'absolute bottom-0 left-1/2 -z-10 aspect-[6.6] w-[108%] -translate-x-1/2 translate-y-[45%] rounded-[50%] border-[3px] border-floor-rim bg-floor-lit shadow-[0_4px_30px_color-mix(in_srgb,var(--flavour-glow)_45%,transparent)]',
            // The featured glow is driven by the scroll timeline, so no CSS transition on it.
            featured
              ? 'opacity-100'
              : 'opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          )}
        />
        <Can label={label} alt={`${name} can`} />
      </div>

      <div
        data-anim="product-info"
        className="mt-[clamp(1.5rem,4.2svh,3rem)] flex flex-col gap-0.5 leading-normal"
      >
        <h3 className="font-display text-[clamp(1.125rem,1.25vw,1.5rem)] font-extrabold text-(--flavour-text) uppercase">
          {name}
        </h3>
        <p className="text-[clamp(0.9375rem,0.9vw,1.0625rem)] text-muted">{tagline}</p>
        <p className="text-[clamp(1.125rem,1.25vw,1.5rem)] font-extrabold">{formatPrice(price)}</p>
      </div>
    </article>
  );
}
