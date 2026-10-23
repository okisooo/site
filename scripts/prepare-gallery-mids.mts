import { stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import sharp from 'sharp';
const { galleryWorks } = createRequire(import.meta.url)('../src/data/gallery.ts') as typeof import('../src/data/gallery');

// Run: npx tsx scripts/prepare-gallery-mids.mts
// 960px-wide derivatives of the shipped gallery webps, for the art room's sheet srcset.
// No new art: each one is a resize of the existing public file named by `src`.
const inventory = [];
for (const variant of galleryWorks.flatMap((work) => work.variants)) {
  if (!variant.mid) continue;
  const result = await sharp(`public${variant.src}`).resize({ width: 960 })
    .webp({ quality: 84, alphaQuality: 100, effort: 5 }).toFile(`public${variant.mid}`);
  inventory.push({ mid: variant.mid, width: result.width, height: result.height, bytes: result.size, full: (await stat(`public${variant.src}`)).size });
}
console.log(JSON.stringify(inventory, null, 1));
