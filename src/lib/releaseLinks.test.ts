import assert from 'node:assert/strict';
import test from 'node:test';
import { staticReleases, type Release } from '@/data/releases';
import { tooLostSmartLinks } from '@/data/tooLostSmartLinks';
import { getReleaseListenTarget, getTooLostSmartLink, isTooLostSmartLink } from './releaseLinks';

function release(overrides: Partial<Release> = {}): Release {
  return {
    id: 'unknown',
    title: 'Unknown release',
    year: '2026',
    img: 'https://example.com/cover.jpg',
    link: 'https://open.spotify.com/album/fallback',
    releaseDate: '2026-01-01',
    albumType: 'single',
    ...overrides,
  };
}

test('uses Too Lost smart links for known releases', () => {
  const target = getReleaseListenTarget(release({ id: '7s1rccJu49nMstJfnwfTTH' }));

  assert.deepEqual(target, {
    label: 'Listen everywhere',
    url: 'https://too.fm/de90n0p',
  });
});

test('prefers Spotify identity over stale distributor metadata', () => {
  const smartLink = getTooLostSmartLink(release({
    id: '1uOe2jivJX1Z4ZEz1DHKdp',
    upc: '0609360670511',
    sourceIds: { toolost: '967652' },
  }));

  assert.equal(smartLink, 'https://too.fm/kkn5bpk');
});

test('falls back to Spotify for releases without a smart link', () => {
  const target = getReleaseListenTarget(release());

  assert.deepEqual(target, {
    label: 'Listen on Spotify',
    url: 'https://open.spotify.com/album/fallback',
  });
});

test('accepts only canonical HTTPS too.fm links', () => {
  assert.equal(isTooLostSmartLink('https://too.fm/de90n0p'), true);
  assert.equal(isTooLostSmartLink('http://too.fm/de90n0p'), false);
  assert.equal(isTooLostSmartLink('https://too.fm.example/de90n0p'), false);
  assert.equal(isTooLostSmartLink('not-a-url'), false);
});

test('maps every Too Lost website release to a unique smart link', () => {
  assert.equal(tooLostSmartLinks.length, 30);
  assert.equal(new Set(tooLostSmartLinks.map((entry) => entry.spotifyReleaseId)).size, 30);
  assert.equal(new Set(tooLostSmartLinks.map((entry) => entry.tooLostReleaseId)).size, 30);
  assert.equal(new Set(tooLostSmartLinks.map((entry) => entry.url)).size, 30);

  const releasesById = new Map(staticReleases.map((item) => [item.id, item]));
  for (const entry of tooLostSmartLinks) {
    assert.ok(releasesById.has(entry.spotifyReleaseId), `missing website release ${entry.spotifyReleaseId}`);
    assert.equal(isTooLostSmartLink(entry.url), true, `invalid smart link ${entry.url}`);
  }
});

test('uses Spotify only for releases outside Too Lost', () => {
  const spotifyFallbackTitles = staticReleases
    .filter((item) => getReleaseListenTarget(item).label === 'Listen on Spotify')
    .map((item) => item.title);

  assert.deepEqual(spotifyFallbackTitles, ['VAC', 'リ：プレイ']);
});
