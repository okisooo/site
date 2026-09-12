import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

// Web derivatives only. The commissioned originals are never modified.
const root = 'D:/FOLDERS/Commissions/Bought/OKISO';
const destination = resolve('public/art');
const sources = [
  ['suyosuyo', 'suyosuyo@skeb/4046159-4.png', [640, 1280]],
  ['sobu', 'OKISO Commission Sketch Combo/OKISO/sketch_combo.png', [640, 1280]],
  ['7mmchan', '7mmchan@skeb/4043264-3.png', [256, 640]],
];
await mkdir(destination, { recursive: true });
for (const [name, source, widths] of sources) {
  for (const width of widths) {
    const result = await sharp(resolve(root, source))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 100, effort: 5 })
      .toFile(resolve(destination, `${name}-${width}.webp`));
    console.log(`${name}-${width}.webp: ${result.width} x ${result.height}, ${Math.round(result.size / 1024)} KiB`);
  }
}
