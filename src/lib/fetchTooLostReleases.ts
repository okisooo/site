import type { Release } from '@/data/releases';

const TOOLOST_API_BASE_URL = 'https://api.toolost.com/v1';

export interface TooLostTrack {
  id: number;
  title: string | null;
  isrc: string | null;
  lyrics: {
    content: string | null;
  };
}

export interface TooLostRelease {
  id: number;
  type: string;
  status: 'live';
  title: string | null;
  upc: string | null;
  catalogNumber: string | null;
  label: string | null;
  primaryGenre: string | null;
  secondaryGenre: string | null;
  releaseDate: string | null;
  tracks: TooLostTrack[];
}

interface TooLostReleasePage {
  data: TooLostRelease[];
  currentPage: number;
  totalPages: number;
}

export interface TooLostMergeResult {
  releases: Release[];
  matched: number;
  unmatched: Array<{ id: number; title: string | null; releaseDate: string | null }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function parseTrack(value: unknown): TooLostTrack | null {
  if (!isRecord(value) || typeof value.id !== 'number') return null;

  const lyrics = isRecord(value.lyrics) ? value.lyrics : {};
  return {
    id: value.id,
    title: nullableString(value.title),
    isrc: nullableString(value.isrc),
    lyrics: { content: nullableString(lyrics.content) },
  };
}

function parseRelease(value: unknown): TooLostRelease | null {
  if (!isRecord(value) || typeof value.id !== 'number' || value.status !== 'live') return null;

  return {
    id: value.id,
    type: typeof value.type === 'string' ? value.type : 'release',
    status: 'live',
    title: nullableString(value.title),
    upc: nullableString(value.upc),
    catalogNumber: nullableString(value.catalogNumber),
    label: nullableString(value.label),
    primaryGenre: nullableString(value.primaryGenre),
    secondaryGenre: nullableString(value.secondaryGenre),
    releaseDate: nullableString(value.releaseDate),
    tracks: Array.isArray(value.tracks)
      ? value.tracks.map(parseTrack).filter((track): track is TooLostTrack => track !== null)
      : [],
  };
}

function parseReleasePage(value: unknown): TooLostReleasePage {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    throw new Error('Too Lost returned an invalid releases response.');
  }

  const currentPage = typeof value.currentPage === 'number' ? value.currentPage : 1;
  const totalPages = typeof value.totalPages === 'number' ? value.totalPages : currentPage;

  return {
    data: value.data.map(parseRelease).filter((release): release is TooLostRelease => release !== null),
    currentPage,
    totalPages,
  };
}

export async function fetchTooLostReleases(accessToken = process.env.TOOLOST_ACCESS_TOKEN): Promise<TooLostRelease[]> {
  if (!accessToken) throw new Error('TOOLOST_ACCESS_TOKEN is not configured.');

  const releases: TooLostRelease[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = new URL(`${TOOLOST_API_BASE_URL}/releases`);
    url.searchParams.set('status', 'live');
    url.searchParams.set('page', page.toString());
    url.searchParams.set('perPage', '100');

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Too Lost rejected TOOLOST_ACCESS_TOKEN. Reauthorize the read:releases scope.');
      }
      if (response.status === 429) {
        throw new Error(`Too Lost rate limit reached. Retry after ${response.headers.get('retry-after') || 'the provider window'}.`);
      }
      throw new Error(`Too Lost releases request failed with HTTP ${response.status}.`);
    }

    const result = parseReleasePage(await response.json());
    releases.push(...result.data);
    page = result.currentPage + 1;
    totalPages = result.totalPages;

    const quotaRemaining = response.headers.get('x-api-quota-remaining');
    if (quotaRemaining) console.log(`Too Lost quota remaining: ${quotaRemaining}`);
  } while (page <= totalPages);

  return releases;
}

function normalize(value?: string | null): string {
  return (value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]/g, '');
}

function findMatch(releases: Release[], candidate: TooLostRelease): Release | undefined {
  const sourceMatch = releases.find((release) => release.sourceIds?.toolost === candidate.id.toString());
  if (sourceMatch) return sourceMatch;

  const upc = normalize(candidate.upc);
  if (upc) {
    const upcMatch = releases.find((release) => normalize(release.upc) === upc);
    if (upcMatch) return upcMatch;
  }

  const titleDateMatch = releases.find(
    (release) =>
      normalize(release.title) === normalize(candidate.title)
      && release.releaseDate === candidate.releaseDate
      && normalize(release.albumType) === normalize(candidate.type),
  );
  if (titleDateMatch) return titleDateMatch;

  const candidateIsrcs = new Set(candidate.tracks.map((track) => normalize(track.isrc)).filter(Boolean));
  if (candidateIsrcs.size > 0) {
    const isrcMatch = releases.find((release) => release.tracks?.some((track) => candidateIsrcs.has(normalize(track.isrc))));
    if (isrcMatch) return isrcMatch;
  }

  return undefined;
}

function mergeTracks(existing: Release['tracks'], incoming: TooLostTrack[]): Release['tracks'] {
  if (!existing?.length) return existing;

  return existing.map((track, index) => {
    const match = incoming.find((candidate) => {
      const isrcMatch = candidate.isrc && track.isrc && normalize(candidate.isrc) === normalize(track.isrc);
      const titleMatch = normalize(candidate.title) === normalize(track.title);
      return Boolean(isrcMatch || titleMatch);
    }) || incoming[index];

    if (!match) return track;

    return {
      ...track,
      isrc: match.isrc || track.isrc,
      toolostId: match.id.toString(),
      lyrics: track.lyrics || match.lyrics.content || undefined,
    };
  });
}

export function mergeTooLostReleases(releases: Release[], catalog: TooLostRelease[]): TooLostMergeResult {
  const merged = [...releases];
  const unmatched: TooLostMergeResult['unmatched'] = [];
  let matched = 0;

  for (const candidate of catalog) {
    const existing = findMatch(merged, candidate);
    if (!existing) {
      unmatched.push({ id: candidate.id, title: candidate.title, releaseDate: candidate.releaseDate });
      continue;
    }

    const index = merged.indexOf(existing);
    const genres = [candidate.primaryGenre, candidate.secondaryGenre, ...(existing.genres || [])].filter(
      (genre): genre is string => Boolean(genre),
    );

    merged[index] = {
      ...existing,
      title: candidate.title || existing.title,
      year: candidate.releaseDate?.slice(0, 4) || existing.year,
      releaseDate: candidate.releaseDate || existing.releaseDate,
      albumType: candidate.type.toLocaleLowerCase('en'),
      tracks: mergeTracks(existing.tracks, candidate.tracks),
      genres: [...new Set(genres)],
      upc: candidate.upc || existing.upc,
      catalogNumber: candidate.catalogNumber || existing.catalogNumber,
      label: candidate.label || existing.label,
      primaryGenre: candidate.primaryGenre || existing.primaryGenre,
      secondaryGenre: candidate.secondaryGenre || existing.secondaryGenre,
      releaseStatus: candidate.status,
      sourceIds: {
        ...existing.sourceIds,
        spotify: existing.sourceIds?.spotify || existing.id,
        toolost: candidate.id.toString(),
      },
    };
    matched += 1;
  }

  merged.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  return { releases: merged, matched, unmatched };
}
