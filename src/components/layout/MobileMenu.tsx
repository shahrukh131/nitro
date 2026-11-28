import type { MouseEventHandler, Ref } from 'react';
import { navLinks } from '../../data/site';
import { Button } from '../ui/Button';
import { SocialLinks } from '../ui/SocialLinks';

interface MobileMenuProps {
  ref?: Ref<HTMLDivElement>;
  onClickCapture?: MouseEventHandler<HTMLDivElement>;
}

/**
 * Full-screen phone menu. Lives inside the fixed header, behind the nav row
 * (-z-10 in the header's stacking context), so the logo and the toggle stay on top.
 * Hidden until its timeline (animations/mobileMenu.ts) fades it in.
 */
export function MobileMenu({ ref, onClickCapture }: MobileMenuProps) {
  return (
    <div
      ref={ref}
      id="mobile-menu"
      // Lenis would turn wheel input over the open menu into page scroll.
      data-lenis-prevent
      onClickCapture={onClickCapture}
      className="invisible fixed inset-0 -z-10 flex flex-col overflow-y-auto bg-ink px-gutter pt-[calc(var(--spacing-nav)+6rem)] pb-10 opacity-0 sm:hidden"
    >
      <nav aria-label="Mobile">
        <ul className="flex flex-col gap-3">
          {navLinks.map(({ label, href }) => (
            <li key={label} data-menu-item>
              <a
                href={href}
                className="font-display text-[clamp(2.5rem,13vw,4rem)] leading-tight tracking-[-0.03em] transition-colors duration-300 hover:text-accent focus-visible:text-accent"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div data-menu-item className="mt-auto flex flex-col gap-8 pt-10">
        <Button href="#products" variant="accent">
          Buy Now
        </Button>
        <SocialLinks />
      </div>
    </div>
  );
}
