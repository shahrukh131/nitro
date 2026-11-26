import { ProductCard } from '../components/ui/ProductCard';
import { products } from '../data/products';
import { cx } from '../lib/cx';

export function Products() {
  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="relative isolate flex h-svh min-h-[38rem] flex-col justify-end pb-[max(1rem,6.5svh)] short:min-h-0"
    >
      <h2 id="products-title" className="sr-only">
        Our flavours
      </h2>

      <ul className="no-scrollbar flex snap-x snap-mandatory items-end overflow-x-auto px-[16vw] pt-[6svh] sm:px-[33.333vw] lg:justify-between lg:overflow-visible lg:px-[6.25vw]">
        {products.map((product) => (
          <li
            key={product.id}
            data-anim="product-card"
            data-featured={product.featured || undefined}
            className={cx(
              'w-[68vw] shrink-0 snap-center sm:w-[33.333vw] lg:w-auto',
              !product.featured && 'lg:mb-[3.2svh]',
            )}
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
