import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = 'D:/FOLDERS/Commissions/Bought/OKISO/ObakenoPerutan@skeb/converted';
const destination = process.env.OKISO_GALLERY_OUTPUT_DIR;
if (!destination) throw new Error('Set OKISO_GALLERY_OUTPUT_DIR to the gallery asset directory on S:.');
const versions = [
  ['obakeno-perutan', 'collage-no-message'],
  ['obakeno-perutan-message', 'collage-artist-message'],
  ['obakeno-perutan-portrait', 'portrait-transparent'],
  ['obakeno-perutan-profile', 'side-profile-transparent'],
  ['obakeno-perutan-tiny', 'tiny-mascot-transparent'],
  ['obakeno-perutan-full-body', 'full-body-transparent'],
  ['obakeno-perutan-chibi', 'chibi-mascot-transparent'],
];
await mkdir(destination, { recursive: true });
for (const [id, version] of versions) {
  const input = resolve(root, `4070366-${version}.png`);
  const main = await sharp(input).resize({ width: 1280, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}.webp`));
  await sharp(input).resize({ width: 480, height: 640, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 100, effort: 5 }).toFile(resolve(destination, `${id}-thumb.webp`));
  console.log(JSON.stringify({ id, width: main.width, height: main.height, bytes: main.size }));
}
