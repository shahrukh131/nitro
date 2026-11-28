export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: readonly NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#products' },
  { label: 'About', href: '#story' },
  { label: 'Gallery', href: '#products' },
];

export type SocialId = 'facebook' | 'instagram' | 'x' | 'linkedin';

export interface SocialLink {
  id: SocialId;
  label: string;
  href: string;
}

export const socialLinks: readonly SocialLink[] = [
  { id: 'facebook', label: 'NITRO on Facebook', href: 'https://facebook.com' },
  { id: 'instagram', label: 'NITRO on Instagram', href: 'https://instagram.com' },
  { id: 'x', label: 'NITRO on X', href: 'https://x.com' },
  { id: 'linkedin', label: 'NITRO on LinkedIn', href: 'https://linkedin.com' },
];

export const heroCopy =
  'Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac.';
