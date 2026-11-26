import { SocialLinks } from '../ui/SocialLinks';

export function Footer() {
  return (
    <footer
      id="contact"
      className="flex flex-col items-center gap-6 border-t border-white/10 px-gutter py-10 text-sm text-muted sm:flex-row sm:justify-between"
    >
      <p>
        <span className="font-display font-black text-accent uppercase">Nitro</span> — a fictional
        energy drink. © {new Date().getFullYear()}
      </p>
      <SocialLinks />
    </footer>
  );
}
