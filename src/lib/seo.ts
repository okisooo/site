import type { Metadata } from 'next';
import type { Release } from '@/data/releases';

export const SITE_URL = 'https://okiso.net';
export const ARTIST_ID = `${SITE_URL}/#artist`;
export const ARTIST_DESCRIPTION = 'OKISO is a VTuber, virtual artist and VOCALOID producer making hyperpop and electronic music.';
export const artistStructuredData = {
  '@type': 'MusicGroup', '@id': ARTIST_ID, name: 'OKISO',
  url: SITE_URL, image: `${SITE_URL}/og_image.png`, description: ARTIST_DESCRIPTION,
  sameAs: ['https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm', 'https://www.instagram.com/okisooo_/', 'https://github.com/okisooo', 'https://x.com/okisooo_', 'https://www.youtube.com/@okiso7', 'https://okiso.bandcamp.com/'],
};

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  const url = `${SITE_URL}${pathname}`;
  const images = [{ url: `${SITE_URL}/og_image.png`, alt: 'OKISO' }];
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'OKISO', type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export function releaseDescription(release: Release): string {
  const count = release.tracks?.length || release.totalTracks || 1;
  const date = new Intl.DateTimeFormat('en', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(release.releaseDate));
  const lyrics = release.tracks?.some(track => track.lyrics?.trim());
  return `${release.title} is a ${release.albumType} by OKISO, released ${date}. Explore ${count === 1 ? 'the track' : `${count} tracks`}${lyrics ? ', lyrics, and' : ' and'} listening links.`;
}

export function releaseMetadata(release: Release): Metadata {
  const title = `${release.title} — OKISO | Official release`;
  const description = releaseDescription(release);
  const url = `${SITE_URL}/releases/${release.slug}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: 'OKISO', type: 'music.album',
      images: [{ url: release.img, alt: `${release.title} cover artwork` }],
    },
    twitter: {
      card: 'summary_large_image', title, description, images: [release.img],
    },
  };
}

export function releaseStructuredData(release: Release) {
  const url = `${SITE_URL}/releases/${release.slug}`;
  const artist = { '@type': 'MusicGroup', '@id': ARTIST_ID, name: 'OKISO', url: SITE_URL };
  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'MusicAlbum', '@id': `${url}#release`, name: release.title,
      url, image: release.img, byArtist: artist,
      datePublished: release.releaseDate, description: releaseDescription(release),
      numTracks: release.tracks?.length || release.totalTracks,
      genre: release.genres,
      albumReleaseType: release.albumType === 'single' ? 'https://schema.org/SingleRelease' : undefined,
      track: release.tracks?.map(track => ({
        '@type': 'MusicRecording',
        '@id': `${url}#track-${track.trackNumber ?? track.id}`,
        name: track.title, duration: track.duration, url: track.link,
        isrcCode: track.isrc, byArtist: artist,
        inAlbum: { '@id': `${url}#release` },
      })),
    }, {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Releases', item: `${SITE_URL}/releases` },
        { '@type': 'ListItem', position: 3, name: release.title, item: url },
      ],
    }],
  };
}
