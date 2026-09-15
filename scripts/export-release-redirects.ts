import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { releaseRedirects } from '../src/data/releaseRedirects';
import { staticReleases } from '../src/data/releases';
import { SITE_URL } from '../src/lib/seo';

const output = process.env.OKISO_EXPORT_DIR || 'out';
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const [previous, current] of Object.entries(releaseRedirects)) {
  const release = staticReleases.find((item) => item.slug === current);
  if (!release || !existsSync(path.join(output, 'releases', `${current}.html`))) throw new Error(`Missing redirect target: ${current}`);
  if (staticReleases.some((item) => item.slug === previous)) throw new Error(`Redirect would replace a current release: ${previous}`);
  const target = `${SITE_URL}/releases/${current}`;
  // GitHub Pages cannot emit per-path HTTP redirects. Google treats a zero-second
  // meta refresh as permanent; the canonical and ordinary link agree on the target.
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url=${escape(target)}"><link rel="canonical" href="${escape(target)}"><title>${escape(release.title)} — OKISO</title></head><body><p>this release has moved. <a href="${escape(target)}">listen to ${escape(release.title)} by OKISO</a>.</p></body></html>`;
  writeFileSync(path.join(output, 'releases', `${previous}.html`), html);
  // Old links with a trailing slash should reach the same destination as well.
  const directory = path.join(output, 'releases', previous);
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, 'index.html'), html);
}
console.log(`Exported ${Object.keys(releaseRedirects).length} verified release redirects.`);
