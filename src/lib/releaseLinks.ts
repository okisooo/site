import type { Release } from '@/data/releases';
import { tooLostSmartLinks } from '@/data/tooLostSmartLinks';

type LinkableRelease = Pick<Release, 'id' | 'link' | 'sourceIds' | 'upc'>;

export interface ReleaseListenTarget {
  label: 'Listen everywhere' | 'Listen on Spotify';
  url: string;
}

export function isTooLostSmartLink(value: string | undefined): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'too.fm' && /^\/[a-z0-9]+\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}

export function getTooLostSmartLink(release: LinkableRelease): string | undefined {
  const spotifyMatch = release.id
    ? tooLostSmartLinks.find((entry) => entry.spotifyReleaseId === release.id)
    : undefined;
  const tooLostMatch = release.sourceIds?.toolost
    ? tooLostSmartLinks.find((entry) => entry.tooLostReleaseId === release.sourceIds?.toolost)
    : undefined;
  const upcMatch = release.upc
    ? tooLostSmartLinks.find((entry) => entry.upc === release.upc)
    : undefined;
  const smartLink = spotifyMatch?.url || tooLostMatch?.url || upcMatch?.url;

  return isTooLostSmartLink(smartLink) ? smartLink : undefined;
}

export function getReleaseListenTarget(release: LinkableRelease): ReleaseListenTarget {
  const smartLink = getTooLostSmartLink(release);
  if (smartLink) return { label: 'Listen everywhere', url: smartLink };

  return { label: 'Listen on Spotify', url: release.link };
}
