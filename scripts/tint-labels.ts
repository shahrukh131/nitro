/**
 * Pre-renders one label per flavour by applying the W3C "hue" blend mode
 * (hue of the flavour colour, saturation + luminosity of the base label) —
 * the same effect Figma uses — so the browser never has to blend at runtime.
 *
 * The Figma label is three near-identical panels. To make the spin loop
 * seamlessly we cut out the middle panel and tile it PANELS times, so shifting
 * the label by exactly one panel width is invisible.
 *
 * Run: npm run tint-labels
 */
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { flavours } from '../src/data/flavours.ts';

const SOURCE = 'src/assets/images/label.png';
const OUT_DIR = 'src/assets/labels';
const PANELS = 3;

type RGB = [number, number, number];

const lum = ([r, g, b]: RGB) => 0.3 * r + 0.59 * g + 0.11 * b;
const sat = (c: RGB) => Math.max(...c) - Math.min(...c);

function clipColor(c: RGB): RGB {
  const l = lum(c);
  const n = Math.min(...c);
  const x = Math.max(...c);
  let out = c;
  if (n < 0) out = out.map((v) => l + ((v - l) * l) / (l - n)) as RGB;
  if (x > 1) out = out.map((v) => l + ((v - l) * (1 - l)) / (x - l)) as RGB;
  return out;
}

function setLum(c: RGB, l: number): RGB {
  const d = l - lum(c);
  return clipColor([c[0] + d, c[1] + d, c[2] + d]);
}

function setSat(c: RGB, s: number): RGB {
  const max = Math.max(...c);
  const min = Math.min(...c);
  if (max === min) return [0, 0, 0];
  return c.map((v) => ((v - min) * s) / (max - min)) as RGB;
}

function hexToRgb(hex: string): RGB {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const meta = await sharp(SOURCE).metadata();
  const panelWidth = Math.floor(meta.width / PANELS);
  const panel = await sharp(SOURCE)
    .removeAlpha()
    .extract({ left: panelWidth, top: 0, width: panelWidth, height: meta.height })
    .toBuffer();
  // `composite` always runs last in a sharp pipeline and adds alpha, so tile first,
  // then strip alpha in a second pass to get packed RGB.
  const strip = await sharp({
    create: { width: panelWidth * PANELS, height: meta.height, channels: 3, background: '#000' },
  })
    .composite(
      Array.from({ length: PANELS }, (_, i) => ({ input: panel, left: i * panelWidth, top: 0 })),
    )
    .png()
    .toBuffer();
  const { data, info } = await sharp(strip)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (const flavour of Object.values(flavours)) {
    const out = Buffer.alloc(data.length);
    if (flavour.tint === null) {
      data.copy(out);
    } else {
      const source = hexToRgb(flavour.tint);
      for (let i = 0; i < data.length; i += 3) {
        const backdrop: RGB = [data[i]! / 255, data[i + 1]! / 255, data[i + 2]! / 255];
        const [r, g, b] = setLum(setSat(source, sat(backdrop)), lum(backdrop));
        out[i] = Math.round(r * 255);
        out[i + 1] = Math.round(g * 255);
        out[i + 2] = Math.round(b * 255);
      }
    }
    const file = `${OUT_DIR}/label-${flavour.id}.webp`;
    await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
      .webp({ quality: 90 })
      .toFile(file);
    console.log(`wrote ${file}`);
  }
}

await main();
