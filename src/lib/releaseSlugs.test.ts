import assert from 'node:assert/strict';
import test from 'node:test';
import { staticReleases, type Release } from '../data/releases';
import { releaseRedirects } from '../data/releaseRedirects';
import { assignReleaseSlugs, releaseTitleSlug } from './releaseSlugs';

const fixture = (title: string, date = '2026-10-09', extra: Partial<Release> = {}): Release => ({
  title, releaseDate: date, year: date.slice(0, 4), albumType: 'single', img: '', link: '', ...extra,
});

test('readable title slugs retain words and never append provider IDs', () => {
  assert.equal(releaseTitleSlug('Love St.'), 'love-st');
  assert.equal(releaseTitleSlug('v0Id::PULSE'), 'v0id-pulse');
  assert.equal(releaseTitleSlug("TEARS IN HEAVEN '99"), 'tears-in-heaven-99');
  assert.equal(releaseTitleSlug('déjà vu!'), 'deja-vu');
  assert.throws(() => releaseTitleSlug('!!!'), /Add a readable/);
  assert.equal(assignReleaseSlugs([fixture('a song', undefined, { id: 'AbCdEf123', slug: 'a-song-AbCdEf' })])[0].slug, 'a-song');
});

test('all current releases have clean, stable, unique addresses and direct legacy aliases', () => {
  const migrated = assignReleaseSlugs(staticReleases, staticReleases);
  assert.deepEqual(migrated.map(item => item.slug), staticReleases.map(item => item.slug), 'sync must not rewrite published addresses');
  assert.equal(new Set(migrated.map(item => item.slug)).size, migrated.length);
  for (const release of migrated) {
    assert.equal(release.slug, releaseTitleSlug(release.title));
    assert.match(release.slug!, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert(!release.slug!.endsWith(`-${release.id!.slice(0, 6)}`));
    const legacy = Object.entries(releaseRedirects).find(([old, current]) =>
      old.endsWith(`-${release.id!.slice(0, 6)}`) && current === release.slug);
    assert(legacy, `${release.title}: retain its previously published address`);
  }
});

test('published routes survive title edits, reordered syncs and provider ID changes', () => {
  const original = fixture('first title', undefined, { id: 'original', slug: 'first-title' });
  assert.equal(assignReleaseSlugs([{ ...original, title: 'updated title', slug: undefined }], [original])[0].slug, 'first-title');
  assert.equal(assignReleaseSlugs([{ ...original, id: 'new-provider', slug: undefined }], [original])[0].slug, 'first-title');
  const duplicate = fixture('first title', '2027-01-01', { id: 'second' });
  const assigned = assignReleaseSlugs([duplicate, original], [original]);
  assert.deepEqual(assigned.map(item => item.slug), ['first-title-2027', 'first-title']);
  assert.deepEqual(assignReleaseSlugs([...assigned].reverse(), assigned), [...assigned].reverse());
});

test('genuine collisions use meaningful dates and reject indistinguishable entries', () => {
  const releases = [fixture('song'), fixture('song'), fixture('song'), fixture('song')];
  assert.deepEqual(assignReleaseSlugs(releases).map(item => item.slug),
    ['song', 'song-2026', 'song-2026-10-09', 'song-single-2026-10-09']);
  assert.throws(() => assignReleaseSlugs([...releases, fixture('song')]), /distinct readable/);
  assert.throws(() => assignReleaseSlugs([fixture('one', undefined, { slug: 'same' }), fixture('two', undefined, { slug: 'same' })]), /Duplicate published/);
});
