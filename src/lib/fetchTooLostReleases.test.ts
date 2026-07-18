import assert from 'node:assert/strict';
import test from 'node:test';
import type { Release } from '@/data/releases';
import { fetchTooLostReleases, mergeTooLostReleases, type TooLostRelease } from './fetchTooLostReleases';

const spotifyRelease: Release = {
  id: 'spotify-album-1',
  title: 'Example Album',
  year: '2025',
  img: 'https://i.scdn.co/example.jpg',
  link: 'https://open.spotify.com/album/example',
  releaseDate: '2025-04-03',
  albumType: 'album',
  slug: 'example-album-stable',
  tracks: [
    {
      id: 'spotify-track-1',
      title: 'Example Track',
      durationMs: 120_000,
      link: 'https://open.spotify.com/track/example',
    },
  ],
  genres: ['electronic'],
};

const toolostRelease: TooLostRelease = {
  id: 73518,
  type: 'Album',
  status: 'live',
  title: 'Example Album',
  upc: '123456789012',
  catalogNumber: 'OKISO-001',
  label: 'OKISO',
  primaryGenre: 'Electronic',
  secondaryGenre: null,
  releaseDate: '2025-04-03',
  tracks: [
    {
      id: 98341,
      title: 'Example Track',
      isrc: 'USABC1234567',
      lyrics: { content: 'example lyrics' },
    },
  ],
};

test('merges Too Lost catalog metadata without replacing public Spotify fields', () => {
  const result = mergeTooLostReleases([spotifyRelease], [toolostRelease]);
  const release = result.releases[0];

  assert.equal(result.matched, 1);
  assert.deepEqual(result.unmatched, []);
  assert.equal(release.id, spotifyRelease.id);
  assert.equal(release.slug, spotifyRelease.slug);
  assert.equal(release.link, spotifyRelease.link);
  assert.equal(release.img, spotifyRelease.img);
  assert.equal(release.sourceIds?.toolost, '73518');
  assert.equal(release.sourceIds?.spotify, spotifyRelease.id);
  assert.equal(release.tracks?.[0].isrc, 'USABC1234567');
  assert.equal(release.tracks?.[0].toolostId, '98341');
  assert.equal(release.tracks?.[0].durationMs, 120_000);
});

test('does not publish unmatched distributor releases', () => {
  const result = mergeTooLostReleases([], [toolostRelease]);

  assert.equal(result.matched, 0);
  assert.equal(result.releases.length, 0);
  assert.deepEqual(result.unmatched, [
    { id: 73518, title: 'Example Album', releaseDate: '2025-04-03' },
  ]);
});

test('requests every live release page with bearer authentication', async () => {
  const originalFetch = globalThis.fetch;
  const requestedPages: string[] = [];

  globalThis.fetch = (async (input, init) => {
    const url = new URL(input.toString());
    requestedPages.push(url.searchParams.get('page') || '');
    assert.equal(url.searchParams.get('status'), 'live');
    assert.equal(url.searchParams.get('perPage'), '100');
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer test-access-token');

    const currentPage = Number(url.searchParams.get('page'));
    return new Response(
      JSON.stringify({
        data: [{ ...toolostRelease, id: toolostRelease.id + currentPage }],
        currentPage,
        perPage: 100,
        totalItems: 2,
        totalPages: 2,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  }) as typeof fetch;

  try {
    const releases = await fetchTooLostReleases('test-access-token');
    assert.deepEqual(requestedPages, ['1', '2']);
    assert.equal(releases.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
