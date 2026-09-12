import { existsSync } from 'node:fs';
import path from 'node:path';
import { staticReleases } from '@/data/releases';

export interface PlaylistTrack {
  title: string;
  artist: string;
  cover: string;
  link: string;
  audioSrc: string;
}

// Build-time only: never offer local playback for a missing file, or send lyrics
// to every route just to populate the global player's next/previous controls.
export function getLocalPlaylist(): PlaylistTrack[] {
  const seen = new Set<string>();
  return staticReleases.flatMap(release => (release.tracks ?? []).flatMap(track => {
    const filename = `${track.title.replace(/[\/\\?%*:|"<>]/g, '-').trim()}.mp3`;
    if (!existsSync(path.join(process.cwd(), 'public', 'audio', filename))) return [];
    // A song can occur on both a single and an album. The player uses its title
    // as identity, so include it once to keep next/previous from cycling backward.
    if (seen.has(track.title)) return [];
    seen.add(track.title);
    return [{
      title: track.title, artist: 'OKISO', cover: release.img, link: release.link,
      audioSrc: `/audio/${encodeURIComponent(filename)}`,
    }];
  }));
}
