import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import sharp from 'sharp';
const { staticReleases } = createRequire(import.meta.url)('../src/data/releases.ts') as typeof import('../src/data/releases');

// Run: npx tsx scripts/prepare-site-social.mts
// Both destinations must be explicitly set to S: paths; original art is read-only.
const destination = process.env.OKISO_SOCIAL_OUTPUT_DIR;
const cache = process.env.OKISO_SOCIAL_CACHE_DIR;
if (!destination || !cache) throw new Error('Set OKISO_SOCIAL_OUTPUT_DIR and OKISO_SOCIAL_CACHE_DIR.');
await Promise.all([mkdir(destination, { recursive: true }), mkdir(cache, { recursive: true })]);
const svg = (body: string) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">${body}</svg>`);
const text = (x: number, y: number, value: string, size = 24, fill = '#28282c', weight = 400) =>
  `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${value}</text>`;
const image = async (src: string | Buffer, width: number, height: number, left: number, top: number, crop?: sharp.Region) => ({
  input: await (crop ? sharp(src).extract(crop) : sharp(src)).resize(width, height, { fit: 'cover', position: 'north' }).toBuffer(), left, top,
});
const save = async (name: string, background: string, layers: sharp.OverlayOptions[]) => {
  const file = resolve(destination, `${name}-v1.jpg`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background } })
    .composite(layers).jpeg({ quality: 93, mozjpeg: true }).toFile(file);
  console.log(file);
};

await save('home', '#ffffff', [
  await image('public/art/suyosuyo-1280.webp', 596, 630, 0, 0, { left: 0, top: 0, width: 1280, height: 1350 }),
  await image('public/art/gallery/ykhs9.webp', 596, 630, 604, 0, { left: 260, top: 0, width: 780, height: 825 }),
  { input: svg(`<defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="white" stop-opacity="0"/><stop offset=".62" stop-color="white" stop-opacity=".97"/><stop offset="1" stop-color="white"/></linearGradient></defs>
    <rect y="325" width="1200" height="305" fill="url(#fade)"/>
    ${text(38, 548, 'OKISO', 168, '#28282c', 900)}
    ${text(48, 595, 'music / art / more', 30, '#cc0000')}
    ${text(865, 595, 'art: suyosuyo / ykhs9', 20)}
    <rect y="622" width="1200" height="8" fill="#cc0000"/>`) },
]);

await save('about', '#ffffff', [
  await image('public/art/gallery/he-know-lee.webp', 560, 630, 640, 0, { left: 0, top: 0, width: 1273, height: 1432 }),
  { input: svg(`${text(52, 80, 'ABOUT ME', 23, '#cc0000', 700)}
    ${text(46, 239, 'hey, i’m', 72)}${text(42, 362, 'OKISO', 136, '#28282c', 900)}
    <rect x="52" y="394" width="72" height="6" fill="#cc0000"/>
    ${text(52, 459, 'VTuber / virtual artist', 31)}${text(52, 503, 'VOCALOID producer', 31)}
    ${text(52, 588, 'links / contact / a little about me', 23, '#59595e')}
    <rect x="664" y="576" width="205" height="32" fill="white"/>${text(674, 599, 'art: he_know_lee', 21)}`) },
]);

// Curated cover wall, not a claim that these are the current newest releases.
const coverTitles = ['onthelow', 'VESSEL FOR OBSESSION', 'DEADEND', 'PRODIGY', 'VAC', 'for a chance to look beyond the stars'];
const coverLayers: sharp.OverlayOptions[] = [];
for (const [index, title] of coverTitles.entries()) {
  const release = staticReleases.find(item => item.title === title);
  if (!release) throw new Error(`Missing curated release: ${title}`);
  const source = join(cache, new URL(release.img).pathname.split('/').pop()! + '.jpg');
  let bytes: Buffer;
  try { bytes = await readFile(source); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const response = await fetch(release.img, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`Cover download failed: ${title} (${response.status})`);
    bytes = Buffer.from(await response.arrayBuffer());
    await sharp(bytes).metadata();
    await writeFile(source, bytes);
  }
  coverLayers.push(await image(bytes, 234, 234, 470 + (index % 3) * 240, 78 + Math.floor(index / 3) * 240));
}
await save('releases', '#18181c', [
  ...coverLayers,
  { input: svg(`${text(40, 78, 'OKISO', 30, '#ff4d4d', 700)}
    ${text(32, 275, 'music', 108, '#ffffff', 900)}
    ${text(40, 340, 'albums / singles', 29, '#eeeeee')}
    <rect x="40" y="385" width="76" height="6" fill="#ff4d4d"/>
    ${text(40, 577, 'the release archive', 24, '#d0d0d5')}`) },
]);

await save('upcoming', '#ffffff', [
  await image('public/art/7mmchan-640.webp', 410, 410, 760, 108),
  { input: svg(`${text(46, 79, 'OKISO', 30, '#cc0000', 700)}
    ${text(38, 292, 'upcoming', 118, '#28282c', 900)}
    <rect x="48" y="340" width="76" height="6" fill="#cc0000"/>
    ${text(46, 416, 'new music &amp; announcements', 32)}
    ${text(46, 577, 'okiso.net/upcoming', 24, '#59595e')}
    ${text(942, 577, 'art: 7mmchan', 20, '#59595e')}`) },
]);

await save('vault', '#202024', [{ input: svg(`
  <path d="M724 140h138l48 52h234v324H704V160a20 20 0 0 1 20-20Z" fill="#a60000"/>
  <rect x="742" y="184" width="346" height="280" rx="5" fill="#c6c6cb" transform="rotate(-8 915 324)"/>
  <rect x="737" y="198" width="346" height="280" rx="5" fill="#ededf1" transform="rotate(5 910 338)"/>
  <circle cx="920" cy="335" r="106" fill="#242428"/><circle cx="920" cy="335" r="88" fill="none" stroke="#48484e" stroke-width="2"/>
  <circle cx="920" cy="335" r="72" fill="none" stroke="#48484e" stroke-width="2"/>
  <circle cx="920" cy="335" r="33" fill="#cc0000"/><circle cx="920" cy="335" r="9" fill="#ededf1"/>
  <path d="M690 338h470l-25 190H715Z" fill="#e52732"/>
  ${text(740, 468, 'OKISO', 44, '#ffffff', 700)}
  ${text(48, 80, 'OKISO', 30, '#ff6464', 700)}
  ${text(40, 294, 'the vault', 116, '#ffffff', 900)}
  ${text(48, 380, 'demos / alternate versions', 30, '#e2e2e8')}
  ${text(48, 425, 'unfinished tracks', 30, '#e2e2e8')}
  ${text(48, 577, 'okiso.net/vault', 24, '#bdbdc5')}
`) }]);

// Title art matching the existing game page, not a fabricated gameplay capture.
const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const point = (r: number, a: number) => `${960 + r * Math.cos(a)},${310 + r * Math.sin(a)}`;
const wheel = numbers.map((n, i) => {
  const a = (i / 37) * Math.PI * 2 - Math.PI / 2;
  const b = ((i + 1) / 37) * Math.PI * 2 - Math.PI / 2;
  const middle = (a + b) / 2;
  return `<path d="M${point(175,a)} L${point(270,a)} A270 270 0 0 1 ${point(270,b)} L${point(175,b)} A175 175 0 0 0 ${point(175,a)}Z" fill="${i === 0 ? '#14452f' : i % 2 ? '#8e1b2b' : '#161310'}" stroke="#7a6318" stroke-width="1"/>
    <text x="${960 + 240 * Math.cos(middle)}" y="${317 + 240 * Math.sin(middle)}" text-anchor="middle" fill="#f2e8d5" font-family="Georgia, serif" font-size="21">${n}</text>`;
}).join('');
await save('rouge-noir', '#0b0a08', [{ input: svg(`
  <circle cx="960" cy="310" r="288" fill="#3b2417" stroke="#c9a227" stroke-width="4"/>
  ${wheel}<circle cx="960" cy="310" r="172" fill="#14452f" stroke="#c9a227" stroke-width="3"/>
  <circle cx="960" cy="310" r="105" fill="none" stroke="#7a6318" stroke-width="2"/>
  <path d="M960 260v100M910 310h100" stroke="#e8d08a" stroke-width="16"/><circle cx="960" cy="310" r="23" fill="#c9a227"/>
  <circle cx="826" cy="84" r="11" fill="#f2e8d5"/>
  ${text(52, 76, 'A GAME BY OKISO', 22, '#e8d08a')}
  <text x="46" y="268" fill="#c13948" font-family="Georgia, serif" font-size="108" font-weight="700">ROUGE</text>
  <text x="50" y="398" fill="#f2e8d5" font-family="Georgia, serif" font-size="102" font-weight="700">&amp; NOIR</text>
  <path d="M54 447h535" stroke="#7a6318"/>
  ${text(54, 501, 'roulette / roguelike / deckbuilder', 27, '#e8d08a')}
  ${text(54, 579, 'okiso.net/rouge-noir', 22, '#c4b79e')}
`) }]);

await import('./prepare-gallery-social.mjs');

const review = process.env.OKISO_SOCIAL_REVIEW_DIR;
if (review) {
  await mkdir(review, { recursive: true });
  const names = ['home', 'about', 'releases', 'upcoming', 'gallery', 'vault', 'rouge-noir'];
  const tiles: sharp.OverlayOptions[] = [];
  for (const [index, name] of names.entries()) {
    const left = 20 + (index % 2) * 420;
    const top = 20 + Math.floor(index / 2) * 250;
    tiles.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="24"><text x="0" y="17" font-family="Arial" font-size="16" fill="#28282c">${name === 'home' ? '/' : '/' + name}</text></svg>`), left, top });
    tiles.push(await image(resolve(destination, `${name}-v1.jpg`), 400, 210, left, top + 26));
  }
  await sharp({ create: { width: 860, height: 1020, channels: 3, background: '#ececf0' } }).composite(tiles)
    .jpeg({ quality: 94 }).toFile(join(review, 'social-preview-sheet.jpg'));
}
