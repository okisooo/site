import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

// An authored layout using existing commissions; never alters the originals.
// Set this to public/social's physical destination on S: when regenerating.
const destination = process.env.OKISO_SOCIAL_OUTPUT_DIR;
if (!destination) throw new Error('Set OKISO_SOCIAL_OUTPUT_DIR to the social asset directory on S:.');
await mkdir(destination, { recursive: true });

const panels = [
  { src: 'public/art/gallery/he-know-lee.webp', credit: 'he_know_lee', left: 0, width: 394,
    crop: { left: 0, top: 0, width: 1273, height: 1560 } },
  { src: 'public/art/sobu-1280.webp', credit: 'sobu', left: 402, width: 394,
    crop: { left: 0, top: 0, width: 1280, height: 1578 } },
  { src: 'public/art/gallery/ykhs9.webp', credit: 'ykhs9', left: 804, width: 396,
    crop: { left: 260, top: 0, width: 780, height: 960 } },
];
const layers = await Promise.all(panels.map(async panel => ({
  input: await sharp(panel.src).extract(panel.crop).resize(panel.width, 486).toBuffer(),
  left: panel.left, top: 0,
})));
const labels = panels.map(panel => `
  <rect x="${panel.left + 18}" y="442" width="${panel.credit.length * 11 + 26}" height="28" fill="white"/>
  <text x="${panel.left + 31}" y="462" font-family="Arial, sans-serif" font-size="18" fill="#28282c">${panel.credit}</text>`).join('');
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  ${labels}
  <rect y="486" width="1200" height="144" fill="white"/>
  <rect y="486" width="1200" height="6" fill="#cc0000"/>
  <text x="32" y="578" font-family="Arial, sans-serif" font-size="82" font-weight="900" letter-spacing="-4" fill="#28282c">OKISO</text>
  <text x="327" y="578" font-family="Arial, sans-serif" font-size="78" fill="#cc0000">/</text>
  <text x="375" y="578" font-family="Arial, sans-serif" font-size="82" font-weight="700" letter-spacing="-3" fill="#28282c">gallery</text>
  <text x="36" y="610" font-family="Arial, sans-serif" font-size="20" fill="#59595e">commissioned artwork</text>
  <text x="1164" y="610" text-anchor="end" font-family="Arial, sans-serif" font-size="20" fill="#59595e">okiso.net/gallery</text>
</svg>`);

const output = resolve(destination, 'gallery-v1.jpg');
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
  .composite([...layers, { input: overlay }]).jpeg({ quality: 93, mozjpeg: true }).toFile(output);
console.log(output);
