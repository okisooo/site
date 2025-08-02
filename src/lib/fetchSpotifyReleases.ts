// Build-time data fetching for Spotify releases
interface Release {
  title: string;
  year: string;
  img: string;
  link: string;
  releaseDate: string;
  albumType: string;
}

interface SpotifyApiResponse {
  success: boolean;
  releases: Release[];
  lastUpdated: string;
  error?: string;
}

export async function fetchSpotifyReleases(): Promise<Release[]> {
  try {
    console.log('Fetching Spotify releases at build time...');
    
    const API_URL = 'https://api.okiso.net/api/spotify/releases';
    const response = await fetch(API_URL, {
      // Standard fetch options for static builds
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SpotifyApiResponse = await response.json();

    if (data.success && data.releases) {
      console.log(`✅ Fetched ${data.releases.length} releases from Spotify API`);
      return data.releases;
    } else {
      throw new Error(data.error || 'Failed to fetch releases');
    }
  } catch (error) {
    console.error('❌ Error fetching Spotify releases at build time:', error);
    
    // Fallback to static data if API fails during build
    console.log('🔄 Using fallback static data');
    return [
      {
        title: 'FANTASIA & ETUDE',
        year: '2025',
        img: 'https://i.scdn.co/image/ab67616d0000b273f9828b8b052d94e53344ee27',
        link: 'https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q',
        releaseDate: '2025-04-25',
        albumType: 'album'
      },
      {
        title: 'RESURRECTION',
        year: '2025',
        img: 'https://i.scdn.co/image/ab67616d0000b273778a4f44c3e5b63f663f87da',
        link: 'https://open.spotify.com/album/15AGWT0YohTDzF5gPCzgw3',
        releaseDate: '2025-05-25',
        albumType: 'album'
      },
      {
        title: 'FANTASIA',
        year: '2025',
        img: 'https://i.scdn.co/image/ab67616d0000b2734bcdda5555ac77a5b56c91b2',
        link: 'https://open.spotify.com/album/0t28Vt3fN6awEEFcTR3AlN',
        releaseDate: '2025-03-10',
        albumType: 'album'
      },
      {
        title: 'ETUDE',
        year: '2025',
        img: 'https://i.scdn.co/image/ab67616d0000b273d801af2d510e722d0444a16f',
        link: 'https://open.spotify.com/album/4raTOoWiHkOwYH7CQFzAcC',
        releaseDate: '2025-04-07',
        albumType: 'album'
      }
    ];
  }
}
