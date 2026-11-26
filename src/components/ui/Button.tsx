import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '../../lib/cx';

type Variant = 'accent' | 'light' | 'outline';

interface ButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  accent: 'bg-accent text-ink hover:bg-white',
  light: 'bg-white text-ink hover:bg-accent',
  outline: 'border border-white text-white hover:bg-white hover:text-ink',
};

/** Call-to-action link styled as a button (all CTAs navigate). */
export function Button({ variant = 'accent', className, ...props }: ButtonProps) {
  return (
    <a
      className={cx(
        'inline-flex items-center justify-center px-[2.8em] py-2.5 text-base leading-normal font-medium whitespace-nowrap transition-colors duration-300',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
