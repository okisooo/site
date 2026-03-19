import { useEffect, useState } from 'react';

export interface FeaturedVideo {
  id: string;
  title: string;
  src: string;
  poster?: string;
}

interface UseFeaturedVideosResult {
  videos: FeaturedVideo[];
  isLoading: boolean;
  error: string | null;
}

export function useFeaturedVideos(): UseFeaturedVideosResult {
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const endpoint = process.env.NEXT_PUBLIC_VIDEOS_API_URL;
        if (!endpoint) {
          setVideos([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(endpoint, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        const rawItems = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.videos)
            ? payload.videos
            : Array.isArray(payload?.items)
              ? payload.items
              : Array.isArray(payload?.data)
                ? payload.data
                : [];

        const items: FeaturedVideo[] = rawItems
          .map((item: unknown, index: number) => {
            const raw = item as {
              id?: string | number;
              title?: string;
              name?: string;
              src?: string;
              url?: string;
              videoUrl?: string;
              streamUrl?: string;
              poster?: string;
              thumbnail?: string;
              thumbnailUrl?: string;
            };

            const src = raw.src || raw.videoUrl || raw.streamUrl || raw.url;
            if (!src) return null;

            return {
              id: String(raw.id ?? index + 1),
              title: raw.title || raw.name || `VIDEO_${index + 1}`,
              src,
              poster: raw.poster || raw.thumbnail || raw.thumbnailUrl || undefined,
            };
          })
          .filter((video: FeaturedVideo | null): video is FeaturedVideo => Boolean(video));

        if (!cancelled) {
          setVideos(items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load videos');
          setVideos([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  return { videos, isLoading, error };
}
