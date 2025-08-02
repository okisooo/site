import { useState, useEffect } from 'react';

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

export const useSpotifyReleases = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call your external Vercel API instead of local API route
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.okiso.net';
        const response = await fetch(`${API_BASE_URL}/api/spotify/releases`, {
          // Cache for 1 hour to avoid hitting rate limits
          next: { revalidate: 3600 }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SpotifyApiResponse = await response.json();

        if (data.success) {
          setReleases(data.releases);
          setLastUpdated(data.lastUpdated);
        } else {
          throw new Error(data.error || 'Failed to fetch releases');
        }
      } catch (err) {
        console.error('Error fetching Spotify releases:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback to static data if API fails
        setReleases([
          {
            title: 'FANTASIA & ETUDE',
            year: '2025',
            img: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b2/c7/35/b2c73583-ee06-57f8-0b9b-c08423293429/artwork.jpg/600x600bf-60.jpg',
            link: 'https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q',
            releaseDate: '2025-01-01',
            albumType: 'album'
          },
          {
            title: 'FANTASIA',
            year: '2025',
            img: 'https://i.scdn.co/image/ab67616d0000b273bcecbdb53ef1b1311a9923a8',
            link: 'https://open.spotify.com/album/0t28Vt3fN6awEEFcTR3AlN',
            releaseDate: '2025-01-01',
            albumType: 'album'
          },
          {
            title: 'ETUDE',
            year: '2025',
            img: 'https://i.scdn.co/image/ab67616d0000b2737029fe56be8fdd1093453b71',
            link: 'https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q',
            releaseDate: '2025-01-01',
            albumType: 'album'
          },
          {
            title: 'RESURRECTION',
            year: '2025',
            img: 'https://i.scdn.co/image/ab67616d00001e029899e44696d9069ad2953a4d',
            link: 'https://open.spotify.com/album/0MAU5F8CQeuBQ4bC9N3SDi',
            releaseDate: '2025-01-01',
            albumType: 'single'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  // Helper functions to get specific data
  const getFeaturedReleases = (count: number = 3) => {
    return releases.slice(0, count);
  };

  const getLatestRelease = () => {
    return releases[0] || null;
  };

  const getCatalogReleases = () => {
    return releases;
  };

  return {
    releases,
    loading,
    error,
    lastUpdated,
    getFeaturedReleases,
    getLatestRelease,
    getCatalogReleases,
    refetch: () => window.location.reload() // Simple refetch method
  };
};
