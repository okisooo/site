import assert from 'node:assert/strict';
import test from 'node:test';
import type { Release } from '@/data/releases';
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
