interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: { spotify: string };
  release_date: string;
  album_type: string;
}

interface SpotifyArtistAlbumsResponse {
  items: SpotifyAlbum[];
  total: number;
  next?: string;
}

interface SpotifyAlbumDetails {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: { spotify: string };
  release_date: string;
  album_type: string;
  tracks: {
    items: Array<{
      id: string;
      name: string;
      duration_ms: number;
      track_number: number;
      external_urls?: { spotify?: string };
    }>;
    total: number;
  };
  popularity?: number;
  total_tracks?: number;
}

interface ReleaseTrack {
  id?: string;
  title: string;
  durationMs?: number;
  duration?: string; // ISO 8601 duration like PT3M22S
  trackNumber?: number;
  link?: string;
}

interface Release {
  id?: string;
  title: string;
  year: string;
  img: string;
  link: string;
  releaseDate: string;
  albumType: string;
  slug?: string; // URL-friendly slug for per-release pages
  description?: string; // short description used for metadata
  tracks?: ReleaseTrack[];
  popularity?: number;
  totalTracks?: number;
  genres?: string[];
}

function slugify(title: string, id?: string) {
  // Basic slug: lowercase, remove non-alnum (except spaces), replace spaces with dashes
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  // Append a short suffix from the Spotify id to avoid collisions
  if (id) {
    return `${base}-${id.slice(0, 6)}`;
  }
  return base;
}

function msToIsoDuration(ms?: number) {
  if (!ms && ms !== 0) return undefined;
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `PT${minutes}M${seconds}S`;
}

async function getSpotifyAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not found in environment variables');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function fetchSpotifyReleases(artistId: string = '2FSh9530hmphpeK3QmDSPm'): Promise<Release[]> {
  try {
    const accessToken = await getSpotifyAccessToken();
    let allAlbums: SpotifyAlbum[] = [];
    let nextUrl: string | null = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`;

    // Fetch all albums (handle pagination)
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Spotify data: ${response.statusText}`);
      }

      const data: SpotifyArtistAlbumsResponse = await response.json();
      allAlbums = [...allAlbums, ...data.items];
      nextUrl = data.next || null;
    }

    // Fetch artist info for genres/popularity (single call)
    let artistGenres: string[] = [];
    try {
      const artistResp = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (artistResp.ok) {
        const artistData = await artistResp.json();
        artistGenres = artistData.genres || [];
      }
    } catch (e) {
      // non-fatal
    }

    // For each album get full details (tracks, popularity)
    // Limit concurrency to avoid hammering API
    const concurrency = 6;
    const albumDetails: SpotifyAlbumDetails[] = [];

    for (let i = 0; i < allAlbums.length; i += concurrency) {
      const batch = allAlbums.slice(i, i + concurrency);
      const batchPromises = batch.map(a => fetch(`https://api.spotify.com/v1/albums/${a.id}?market=US`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(res => {
        if (!res.ok) return null;
        return res.json();
      }).catch(() => null));

      const batchResults = await Promise.all(batchPromises);
      for (const r of batchResults) {
        if (r) albumDetails.push(r as SpotifyAlbumDetails);
      }
    }

    // Map albumDetails to Release format
    const releases: Release[] = albumDetails.map((album) => ({
      id: album.id,
      title: album.name,
      year: new Date(album.release_date).getFullYear().toString(),
      img: album.images[0]?.url || '',
      link: album.external_urls.spotify,
      releaseDate: album.release_date,
      albumType: album.album_type,
      slug: slugify(album.name, album.id),
      description: `${album.name} — ${album.album_type} by OKISO.`,
      tracks: album.tracks.items.map(t => ({
        id: t.id,
        title: t.name,
        durationMs: t.duration_ms,
        duration: msToIsoDuration(t.duration_ms),
        trackNumber: t.track_number,
        link: t.external_urls?.spotify
      })),
      popularity: album.popularity,
      totalTracks: album.tracks.total,
      genres: artistGenres
    }));

    // Sort by release date (newest first)
    releases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

    return releases;
  } catch (error) {
    console.error('Error fetching Spotify releases:', error);
    throw error;
  }
}

export async function updateReleasesData(): Promise<void> {
  try {
    const releases = await fetchSpotifyReleases();
    
    // Generate the updated static data
    const releasesDataContent = `// This file is auto-generated by the Spotify API update process
// Last updated: ${new Date().toISOString()}

export interface Release {
  id?: string;
  title: string;
  year: string;
  img: string;
  link: string; // Spotify or external link
  releaseDate: string;
  albumType: string;
  slug?: string; // URL-friendly slug for per-release pages
  description?: string; // short description used for metadata
  tracks?: Array<{
    id?: string;
    title: string;
    durationMs?: number;
    duration?: string;
    trackNumber?: number;
    link?: string;
  }>;
  popularity?: number;
  totalTracks?: number;
  genres?: string[];
}

export const staticReleases: Release[] = ${JSON.stringify(releases, null, 2)};
`;

    // Write to a data file
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'releases.ts');
    
    // Ensure the data directory exists
    const dataDir = path.dirname(dataFilePath);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(dataFilePath, releasesDataContent, 'utf-8');
    
    console.log(`Successfully updated releases data with ${releases.length} releases`);
  } catch (error) {
    console.error('Error updating releases data:', error);
    throw error;
  }
}

/*
Notes - extra metadata you might want to fetch (requires extra API calls):

- Tracklist / individual track durations: GET /albums/{id}/tracks (paginated). We now include full album object which contains track items; for very large albums pagination may be needed.
- Genres or artist popularity: GET /artists/{id} already called to populate genres for each release.
- Release popularity / album popularity: GET /albums/{id} used to retrieve popularity and total_tracks.
- External links (Apple Music, YouTube): Spotify API doesn't provide Apple Music links. You may need to fetch from other services or maintain a mapping.

If you want additional fields (ISRCs, explicit flags, available_markets), I can add them too.
*/
