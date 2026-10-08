import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = 'D:/FOLDERS/Commissions/Bought/OKISO/nanashinolina@skeb/converted';
const destination = process.env.OKISO_GALLERY_OUTPUT_DIR;
const inventoryPath = process.env.OKISO_GALLERY_INVENTORY;
if (!destination || !inventoryPath) throw new Error('Set gallery output and inventory paths on S:.');
const versions = [
  ['nanashinolina', 'character collage', 'collage-no-message'],
  ['nanashinolina-message', 'artist message', 'collage-artist-message'],
  ['nanashinolina-full-body', 'full body', 'full-body-transparent'],
  ['nanashinolina-portrait', 'portrait & mascot', 'portrait-mascot-transparent'],
];
await mkdir(destination, { recursive: true });
const inventory = [];
for (const [id, label, version] of versions) {
  const input = resolve(root, `4070361-${version}.png`);
  const main = await sharp(input).resize({ width: 1280, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}.webp`));
  await sharp(input).resize({ width: 480, height: 640, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}-thumb.webp`));
  inventory.push({ id, label, source: `4070361-${version}.png`, width: main.width, height: main.height, bytes: main.size });
}
await writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
console.log(JSON.stringify(inventory));
