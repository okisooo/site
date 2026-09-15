import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { staticReleases } from '../src/data/releases';
import { releaseRedirects } from '../src/data/releaseRedirects';
import { releaseDescription, SITE_URL } from '../src/lib/seo';
import { getLocalPlaylist } from '../src/lib/localPlaylist';

// Regression checks for this project's generated HTML, not a general HTML parser
// or a ranking score. Run after `npm run build` (never against the dev cache).
const output = path.resolve(process.env.OKISO_EXPORT_DIR || 'out');
const decode = (value: string) => value.replace(/&(?:amp|lt|gt|quot|apos|#x27|#39);/g,
  entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#x27;': "'", '&#39;': "'" }[entity]!));
const readPage = (route: string) => readFileSync(path.join(output, route === '/' ? 'index.html' : `${route.slice(1)}.html`), 'utf8');
const attributes = (tag: string) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
const meta = (html: string, name: string) => [...html.matchAll(/<meta\b[^>]*>/g)].map(match => attributes(match[0])).filter(a => a.name === name || a.property === name).map(a => a.content);
const canonical = (html: string) => [...html.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0])).filter(a => a.rel === 'canonical').map(a => a.href);
const links = (html: string) => [...html.matchAll(/<a\b[^>]*>/g)].map(match => attributes(match[0]).href);
const routes = ['/', '/about', '/releases', '/gallery', '/upcoming', '/rouge-noir', ...staticReleases.map(release => `/releases/${release.slug}`)];
// Core UI must stay unified; standalone work must not inherit that shell.
for (const route of ['/', '/about', '/releases', '/gallery', '/upcoming', '/vault', '/lab/releases', '/lab/soft-orbit', '/api/auth/callback', ...staticReleases.map(release => `/releases/${release.slug}`)]) {
  const markup = readPage(route).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert(markup.includes('class="core-site"'), `${route}: shared editorial shell`);
  assert(markup.includes('class="ed-nav"'), `${route}: shared navigation`);
  assert(markup.includes('class="ed-footer"'), `${route}: shared footer`);
  assert.equal((markup.match(/<main\b/g) ?? []).length, 1, `${route}: one main landmark`);
}
assert(!readPage('/rouge-noir').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').includes('class="core-site"'), 'rouge noir stays outside the editorial system');
const titles = new Set<string>();
const descriptions = new Set<string>();

for (const route of routes) {
  const html = readPage(route);
  const title = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map(match => decode(match[1]));
  assert.equal(title.length, 1, `${route}: exactly one title`);
  assert(!titles.has(title[0]), `${route}: unique title`);
  titles.add(title[0]);
  const description = meta(html, 'description');
  assert.equal(description.length, 1, `${route}: exactly one description`);
  assert(description[0]?.trim() && !descriptions.has(description[0]), `${route}: unique nonempty description`);
  descriptions.add(description[0]);
  assert.deepEqual(canonical(html), [route === '/' ? SITE_URL : SITE_URL + route], `${route}: self canonical`);
  assert(!meta(html, 'robots').some(value => value.includes('noindex')), `${route}: indexable`);
  assert.deepEqual(meta(html, 'og:title'), title, `${route}: own social title`);
  assert.deepEqual(meta(html, 'twitter:title'), title, `${route}: own Twitter title`);
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1, `${route}: one primary heading`);
  assert.equal((markup.match(/<main\b/g) ?? []).length, 1, `${route}: one main landmark`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(match[1]);
    assert.equal(data['@context'], 'https://schema.org', `${route}: JSON-LD root context`);
  }
  const release = staticReleases.find(item => `/releases/${item.slug}` === route);
  if (release) {
    assert.equal(description[0], releaseDescription(release), `${route}: factual release description`);
    const lyricTracks = release.tracks?.filter(track => track.lyrics?.trim()) ?? [];
    assert.equal((markup.match(/<details\b/g) ?? []).length, lyricTracks.length, `${route}: native lyrics controls`);
    for (const track of lyricTracks) {
      assert(decode(markup).includes(track.lyrics!), `${route}: lyrics in initial HTML`);
    }
  }
}

const archiveLinks = links(readPage('/releases'));
for (const release of staticReleases) {
  assert(release.slug, `${release.title}: explicit canonical slug`);
  assert(archiveLinks.includes(`/releases/${release.slug}`), `${release.title}: crawlable archive link`);
}
const homeLinks = links(readPage('/'));
assert(homeLinks.includes('/about'), 'artist profile is linked from the homepage');
for (const release of staticReleases.slice(0, 4)) assert(homeLinks.includes(`/releases/${release.slug}`), `${release.title}: crawlable home link`);

const sitemap = readFileSync(path.join(output, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
assert.deepEqual(sitemapUrls.sort(), routes.map(route => route === '/' ? SITE_URL : SITE_URL + route).sort(), 'sitemap matches only indexable routes');
assert(!sitemap.includes('<lastmod>'), 'do not fabricate page modification dates');
for (const [previous, current] of Object.entries(releaseRedirects)) {
  const html = readPage(`/releases/${previous}`);
  const target = `${SITE_URL}/releases/${current}`;
  assert.deepEqual(canonical(html), [target], `${previous}: redirect canonical`);
  assert(html.includes(`http-equiv="refresh" content="0; url=${target}"`), `${previous}: immediate redirect without JavaScript`);
  assert(links(html).includes(target), `${previous}: accessible fallback link`);
  assert(!sitemapUrls.includes(`${SITE_URL}/releases/${previous}`), `${previous}: alias excluded from sitemap`);
  assert.equal(readFileSync(path.join(output, 'releases', previous, 'index.html'), 'utf8'), html, `${previous}: trailing slash alias`);
}
for (const route of ['/vault', '/lab/releases', '/lab/soft-orbit', '/api/auth/callback']) {
  assert(meta(readPage(route), 'robots').some(value => value.includes('noindex')), `${route}: private/experimental route stays noindex`);
}

const playlist = getLocalPlaylist();
assert(playlist.length > 0, 'local playlist has verified files');
assert.equal(new Set(playlist.map(track => track.title)).size, playlist.length, 'player identities are unique');
assert(playlist.every(track => !('lyrics' in track)), 'global playlist does not ship lyrics');
console.log(`SEO checks passed: ${routes.length} indexable pages, ${staticReleases.length} linked releases, 4 noindex routes, ${playlist.length} available local tracks.`);
