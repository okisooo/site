import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import pack from '@/data/okisoCursors.json';

export const metadata = pageMetadata(
  'OKISO / free cursors',
  'A free animated pixel cursor set of OKISO for Windows, drawn by kateko. Download, install in a minute, use it anywhere.',
  '/cursors',
);

const BASE = '/cursors/okiso';
const ZIP = `${BASE}/okiso-cursors-by-katekoteko.zip`;
const ARTIST = { name: 'kateko', vgen: 'https://vgen.co/katekoteko', bluesky: 'https://bsky.app/profile/katekoteko.bsky.social', x: 'https://x.com/katekoteko' };

// Windows pointer roles, in the order the mouse settings dialog lists them.
const roles: [slug: string, label: string][] = [
  ['normal', 'normal select'], ['help', 'help select'], ['working', 'working in background'], ['busy', 'busy'],
  ['precision', 'precision select'], ['text', 'text select'], ['handwriting', 'handwriting'], ['unavailable', 'unavailable'],
  ['vertical', 'vertical resize'], ['horizontal', 'horizontal resize'], ['diagonal1', 'diagonal resize 1'], ['diagonal2', 'diagonal resize 2'],
  ['move', 'move'], ['alternate', 'alternate select'], ['link', 'link select'], ['pin', 'location select'], ['person', 'person select'],
];
const bySlug = new Map(pack.cursors.map((cursor) => [cursor.slug, cursor]));
const pointer = (slug: string, fallback = 'auto') => {
  const [x, y] = bySlug.get(slug)!.hotspot;
  return `url(${BASE}/pointer/${slug}.png) ${x} ${y}, ${fallback}`;
};
// The page itself wears the set, so visitors try it before downloading.
const wearing = { '--okiso-cursor': pointer('normal'), '--okiso-link': pointer('link', 'pointer'), '--okiso-text': pointer('text', 'text') } as CSSProperties;

export default function CursorsPage() {
  const size = `${Math.round(pack.zipBytes / 1024)} KB`;
  return <article className="ed-page ed-cursors" style={wearing}>
    <header className="ed-page-heading ed-cursors-heading">
      <div>
        <span className="ed-label">free download · windows</span>
        <h1>cursors</h1>
        <p>an animated pixel cursor set of me, drawn by <a href={ARTIST.vgen} target="_blank" rel="noopener noreferrer">{ARTIST.name}</a>. {pack.cursors.length} pointers, every one animated. grab it, it’s free.</p>
        <div className="ed-cursors-actions">
          <a className="ed-button ed-cursors-download" href={ZIP} download><Download size={18} aria-hidden="true" /> download the set <small>.zip · {size}</small></a>
          <a className="ed-text-link" href="#install">how to install <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
      <figure className="ed-cursors-hero">
        <img src={`${BASE}/animation.webp`} alt="Pixel-art chibi OKISO bobbing in place, the animation the cursors are built from" width="640" height="640" />
        <figcaption className="ed-label">art & animation by {ARTIST.name}</figcaption>
      </figure>
    </header>

    <section className="ed-cursors-set" aria-labelledby="cursors-set">
      <div className="ed-cursors-set-heading"><h2 id="cursors-set">the set</h2><span className="ed-label">hover a tile to try that pointer</span></div>
      <ul className="ed-cursors-grid">
        {roles.map(([slug, label]) => <li key={slug} style={{ cursor: pointer(slug) }}>
          <img src={`${BASE}/preview/${slug}.webp`} alt="" width="128" height="128" loading="lazy" decoding="async" />
          <span>{label}</span>
        </li>)}
      </ul>
    </section>

    <section id="install" className="ed-cursors-install" aria-labelledby="cursors-install">
      <h2 id="cursors-install">install</h2>
      <ol>
        <li><strong>extract the zip</strong> anywhere you like.</li>
        <li><strong>open the “Cursor” folder</strong> inside it.</li>
        <li><strong>right-click “install.inf” → install.</strong> on windows 11 it’s under “show more options”.</li>
        <li><strong>pick “Okiso” in the scheme list</strong> of the pointers window that opens, then press ok.</li>
      </ol>
      <details>
        <summary className="ed-label">cursor not animating in obs?</summary>
        <p>window capture: use the “Windows 10 (1903 and up)” method with capture cursor on. display capture: with “DXGI desktop duplication” turn capture cursor off; with “Windows 10 (1903 and up)” turn it on.</p>
      </details>
      <p className="ed-cursors-note">the .ani cursors are made for windows. on mac or linux you can still keep the animation as a sticker.</p>
    </section>

    <aside className="ed-cursors-credit" aria-labelledby="cursors-credit">
      <div>
        <h2 id="cursors-credit" className="ed-label">made by</h2>
        <strong>{ARTIST.name}</strong>
        <p>commissioned for okiso. free for personal use and your own content. please don’t sell it or reupload it as yours.</p>
      </div>
      <nav aria-label={`${ARTIST.name}’s profiles`}>
        <a href={ARTIST.vgen} target="_blank" rel="noopener noreferrer">vgen <ArrowUpRight size={15} aria-hidden="true" /></a>
        <a href={ARTIST.bluesky} target="_blank" rel="noopener noreferrer">bluesky <ArrowUpRight size={15} aria-hidden="true" /></a>
        <a href={ARTIST.x} target="_blank" rel="noopener noreferrer">x <ArrowUpRight size={15} aria-hidden="true" /></a>
      </nav>
    </aside>
    <div className="ed-links-footnote"><Link href="/gallery">more commissioned art <ArrowUpRight size={13} aria-hidden="true" /></Link></div>
  </article>;
}
