import assert from 'node:assert/strict';
import test from 'node:test';
import { staticReleases, type Release } from '../data/releases';
import { releaseRedirects } from '../data/releaseRedirects';
import { relatedReleases } from './releasePresentation';
import { jsonLd } from './seo';

test('legacy release redirects resolve directly to current catalog pages', () => {
  const current = new Set(staticReleases.map((release) => release.slug));
  for (const [previous, target] of Object.entries(releaseRedirects)) {
    assert.match(previous, /^[a-zA-Z0-9-]+$/);
    assert(current.has(target), target);
    assert(!current.has(previous), previous);
    assert(!(target in releaseRedirects), 'no chains or cycles');
  }
});

test('related releases connect a single to its album without mutating the catalog', () => {
  const single = staticReleases.find((release) => release.title === 'FEAR')!;
  const order = staticReleases.map((release) => release.slug);
  const related = relatedReleases(single);
  assert.equal(related[0].title, 'ETUDE');
  assert(!related.some((release) => release.slug === single.slug));
  assert.equal(new Set(related.map((release) => release.slug)).size, related.length);
  assert.deepEqual(staticReleases.map((release) => release.slug), order);
});

test('related releases fall back to nearby dates and cope with a small catalog', () => {
  const item = (slug: string, releaseDate: string): Release => ({ slug, releaseDate, title: slug, year: '2026', img: '', link: '', albumType: 'single' });
  const target = item('target', '2026-06-10');
  assert.deepEqual(relatedReleases(target, [item('distant', '2026-01-01'), target, item('near', '2026-06-09')]).map((r) => r.slug), ['near', 'distant']);
  assert.deepEqual(relatedReleases(target, [target]), []);
});

test('structured data escapes HTML without changing the decoded values', () => {
  const value = { name: '</script><script>alert(1)</script>' };
  assert(!jsonLd(value).includes('<'));
  assert.deepEqual(JSON.parse(jsonLd(value)), value);
});
