import labelBlue from '../assets/labels/label-blue.webp';
import labelEng from '../assets/labels/label-eng.webp';
import labelGreen from '../assets/labels/label-green.webp';
import labelRed from '../assets/labels/label-red.webp';
import labelSky from '../assets/labels/label-sky.webp';
import { flavours, type Flavour } from './flavours';

/** Visual size of a can in the desktop line-up (multiplier of `--can-h`). */
export type CanSize = 'lg' | 'md' | 'sm';

export interface Product {
  id: Flavour['id'];
  name: string;
  tagline: string;
  /** Price in USD. */
  price: number;
  flavour: Flavour;
  /** Wide label strip wrapped around the can. */
  label: string;
  size: CanSize;
  /** The hero can — it becomes this product at the end of the scroll story. */
  featured: boolean;
}

/** Ordered left → right as displayed. */
export const products: readonly Product[] = [
  {
    id: 'eng',
    name: 'Nitro ENG',
    tagline: 'High intensity',
    price: 10.58,
    flavour: flavours.eng,
    label: labelEng,
    size: 'sm',
    featured: false,
  },
  {
    id: 'red',
    name: 'Nitro Red',
    tagline: 'High intensity',
    price: 11,
    flavour: flavours.red,
    label: labelRed,
    size: 'md',
    featured: false,
  },
  {
    id: 'green',
    name: 'Nitro Green',
    tagline: 'High intensity',
    price: 12,
    flavour: flavours.green,
    label: labelGreen,
    size: 'lg',
    featured: true,
  },
  {
    id: 'sky',
    name: 'Nitro Sky',
    tagline: 'High intensity',
    price: 11,
    flavour: flavours.sky,
    label: labelSky,
    size: 'md',
    featured: false,
  },
  {
    id: 'blue',
    name: 'Nitro Blue',
    tagline: 'High intensity',
    price: 10.58,
    flavour: flavours.blue,
    label: labelBlue,
    size: 'sm',
    featured: false,
  },
];

const featured = products.find((p) => p.featured);
if (!featured) throw new Error('products: exactly one product must be featured');
export const featuredProduct: Product = featured;
