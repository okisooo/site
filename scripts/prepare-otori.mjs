import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = 'D:/FOLDERS/Commissions/Bought/OKISO/OTORIxxx@skeb';
const destination = process.env.OKISO_GALLERY_OUTPUT_DIR;
const inventoryPath = process.env.OKISO_GALLERY_INVENTORY;
if (!destination || !inventoryPath) throw new Error('Set gallery output and inventory paths on S:.');
const versions = [
  ['otori-animated', 'animated collage', '4043266-1.gif'],
  ['otori', 'diary collage', 'converted/4043266-collage.png'],
  ['otori-guide', 'artist asset guide', 'converted/4043266-asset-guide.png'],
  ['otori-sheet', 'transparent asset sheet', 'converted/4043266-asset-sheet-transparent.png'],
  ['otori-portrait', 'portrait', 'converted/4043266-portrait-transparent.png'],
  ['otori-holographic', 'holographic sticker', 'converted/4043266-holographic-sticker-transparent.png'],
  ['otori-pixel', 'pixel character', 'converted/4043266-pixel-character-transparent.png'],
  ['otori-dark-keychain', 'dark keychain', 'converted/4043266-dark-keychain-transparent.png'],
  ['otori-silver-keychain', 'silver keychain', 'converted/4043266-silver-keychain-transparent.png'],
  ['otori-mascot-open', 'mascot · open arms', 'converted/4043266-mascot-open-transparent.png'],
  ['otori-mascot-raised', 'mascot · raised arms', 'converted/4043266-mascot-raised-transparent.png'],
  ['otori-mascot-left', 'mascot · looking left', 'converted/4043266-mascot-left-transparent.png'],
  ['otori-mascot-right', 'mascot · looking right', 'converted/4043266-mascot-right-transparent.png'],
  ['otori-mascot-front', 'mascot · front', 'converted/4043266-mascot-front-transparent.png'],
  ['otori-mascot-back', 'mascot · back', 'converted/4043266-mascot-back-transparent.png'],
  ['otori-name-sticker', 'name sticker', 'converted/4043266-name-sticker-transparent.png'],
  ['otori-portrait-card', 'portrait card', 'converted/4043266-portrait-card-transparent.png'],
  ['otori-keychain', 'collage keychain', 'converted/4043266-keychain-transparent.png'],
  ['otori-ring', 'keychain ring', 'converted/4043266-ring-transparent.png'],
  ['otori-pencils', 'colored pencils', 'converted/4043266-pencils-transparent.png'],
];
await mkdir(destination, { recursive: true });
const inventory = [];
for (const [id, label, source] of versions) {
  const input = resolve(root, source);
  // Preserve the delivered pixel character's square pixels when reducing it.
  const kernel = id === 'otori-pixel' ? 'nearest' : 'lanczos3';
  const main = await sharp(input).resize({ width: 1280, height: 1800, fit: 'inside', withoutEnlargement: true, kernel })
    .webp({ quality: 86, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}.webp`));
  await sharp(input).resize({ width: 480, height: 640, fit: 'inside', withoutEnlargement: true, kernel })
    .webp({ quality: 82, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}-thumb.webp`));
  if (id === 'otori-animated') {
    await sharp(input, { animated: true }).resize({ width: 360 }).webp({ quality: 76, effort: 5 })
      .toFile(resolve(destination, `${id}-motion.webp`));
  }
  inventory.push({ id, label, source, width: main.width, height: main.height, bytes: main.size });
}
await writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
console.log(JSON.stringify(inventory));
