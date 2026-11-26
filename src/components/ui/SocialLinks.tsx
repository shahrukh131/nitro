import type { JSX } from 'react';
import { socialLinks, type SocialId } from '../../data/site';
import { cx } from '../../lib/cx';
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, type IconProps } from './icons';

const socialIcons: Record<SocialId, (props: IconProps) => JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
};

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={cx('flex items-center gap-[clamp(1rem,1.7vw,2rem)]', className)}>
      {socialLinks.map(({ id, label, href }) => {
        const Icon = socialIcons[id];
        return (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid size-[42px] place-items-center rounded-full border border-accent text-accent transition-colors duration-300 hover:bg-accent hover:text-ink"
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
