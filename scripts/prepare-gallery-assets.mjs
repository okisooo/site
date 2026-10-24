import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

// These deliveries were matched to the signed-in Skeb completed-request list.
// Work links and public credits live in commissionArt.ts; originals stay untouched.
const root = process.env.OKISO_COMMISSION_ROOT || 'D:/FOLDERS/Commissions/Bought/OKISO';
const destination = process.env.OKISO_GALLERY_OUTPUT_DIR;
if (!destination) throw new Error('Set OKISO_GALLERY_OUTPUT_DIR to the gallery asset directory on S:.');
const sources = [
  ['kouchanthree', 'kouchanthree@skeb/4046160-2.png'],
  ['kouchanthree-message', 'kouchanthree@skeb/4046160-1.png'],
  ['pen117', 'pen_117@skeb/4119838-1.png'],
  ['pen117-transparent', 'pen_117@skeb/4119838-2.png'],
  ['pen117-line-art', 'pen_117@skeb/converted/4119838-line-art-transparent.png'],
  ['yoshi-ras888', 'yoshiRAS888@skeb/4068819-1.jpg'],
  ['kou768', 'kou768@skeb/3836091-3.output.png'],
  ['kou768-framed', 'kou768@skeb/3836091-2.output.png'],
  ['kou768-message', 'kou768@skeb/3836091-1.output.png'],
  ['amaxa', 'amaxa@skeb/3836124-1.png'],
  ['amaxa-message', 'amaxa@skeb/3836124-1.output.png'],
  ['engawa110', 'engawa110@skeb/4029962-2.gif'],
  ['engawa110-message', 'engawa110@skeb/4029962-1.gif'],
  ['suyosuyo-message', 'suyosuyo@skeb/4046159-2.png'],
  ['suyosuyo-portrait', 'suyosuyo@skeb/4046159-3.png'],
  ['suyosuyo-thanks', 'suyosuyo@skeb/4046159-1.png'],
  ['7mmchan-message', '7mmchan@skeb/4043264-1.png'],
  ['7mmchan-alternate', '7mmchan@skeb/4043264-2.png'],
  ['sobu-lineart', 'OKISO Commission Sketch Combo/OKISO/Lineart.png'],
];
await mkdir(destination, { recursive: true });
const inventory = [];
for (const [id, file] of sources) {
  if (process.env.OKISO_GALLERY_SOURCE_PREFIX && !id.startsWith(process.env.OKISO_GALLERY_SOURCE_PREFIX)) continue;
  const input = resolve(root, file);
  const meta = await sharp(input).metadata();
  const main = await sharp(input).resize({ width: 1280, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}.webp`));
  await sharp(input).resize({ width: 480, height: 640, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 }).toFile(resolve(destination, `${id}-thumb.webp`));
  if (main.width > 1100 && (meta.pages || 1) === 1) {
    await sharp(resolve(destination, `${id}.webp`)).resize({ width: 960 })
      .webp({ quality: 84, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}-mid.webp`));
  }
  if ((meta.pages || 1) > 1) {
    await sharp(input, { animated: true }).resize({ width: 480 }).webp({ quality: 82, effort: 5 })
      .toFile(resolve(destination, `${id}-motion.webp`));
  }
  inventory.push({ id, source: file, width: main.width, height: main.height, animated: (meta.pages || 1) > 1, bytes: main.size });
}
await writeFile(resolve(destination, '..', 'asset-inventory.json'), JSON.stringify(inventory, null, 2));
console.log(JSON.stringify(inventory));
