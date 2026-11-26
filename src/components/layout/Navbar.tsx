import { navLinks } from '../../data/site';
import { Button } from '../ui/Button';
import { MenuIcon } from '../ui/icons';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-gutter pt-nav">
      <nav aria-label="Main" className="flex items-center justify-between gap-6">
        <a
          href="#home"
          className="font-display text-[clamp(1.25rem,1.25vw,1.5rem)] font-black tracking-[-0.03em] text-accent uppercase"
        >
          Nitro
        </a>

        <ul className="hidden w-[min(53rem,52vw)] items-center justify-between text-base leading-normal sm:flex">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="relative py-1 transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden sm:block">
          <Button href="#products" variant="accent">
            Buy Now
          </Button>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="mobile-menu"
          className="grid size-11 place-items-center text-white sm:hidden"
        >
          <MenuIcon />
        </button>
      </nav>
    </header>
  );
}
