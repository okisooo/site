import { useEffect, useRef, useState } from 'react';

export interface FeaturedVideo {
  id: string;
  title: string;
  src: string;
  poster?: string;
  category?: string;
  hlsUrl?: string;
  streamUrl?: string;
  hasHlsPackage?: boolean;
  sourceUrl?: string;
}

interface UseFeaturedVideosResult {
  videos: FeaturedVideo[];
  isLoading: boolean;
  error: string | null;
}

const FEED_URL = 'https://api.okiso.net/api/media/website/videos/feed?limit=50';

export function useFeaturedVideos(): UseFeaturedVideosResult {
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnceRef = useRef(false);
  const refreshMs = 0; // Disabled polling to prevent playback reset

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const loadVideos = async () => {
      try {
        if (!hasLoadedOnceRef.current) {
          setIsLoading(true);
        }
        setError(null);

        const response = await fetch(FEED_URL, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        const rawItems: unknown[] = Array.isArray(payload?.videos) ? payload.videos : [];

        const mapped: Array<FeaturedVideo | null> = rawItems
          .map((item: unknown, index: number) => {
            const raw = item as {
              id?: string | number;
              title?: string;
              name?: string;
              hlsUrl?: string;
              hasHlsPackage?: boolean;
              streamUrl?: string;
              url?: string;
              sourceUrl?: string;
              poster?: string;
              thumbnail?: string;
              thumbnailUrl?: string;
              category?: string;
            };

            // Policy priority: hlsUrl -> streamUrl -> sourceUrl.
            const streamUrl = raw.streamUrl || raw.url;
            const src = raw.hlsUrl || streamUrl || raw.sourceUrl;
            if (!src) return null;

            return {
              id: String(raw.id ?? index + 1),
              title: raw.title || raw.name || `VIDEO_${index + 1}`,
              src,
              poster: raw.poster || raw.thumbnail || raw.thumbnailUrl || undefined,
              category: raw.category,
              hlsUrl: raw.hlsUrl,
              streamUrl,
              hasHlsPackage: raw.hasHlsPackage,
              sourceUrl: raw.sourceUrl,
            };
          });

        const items: FeaturedVideo[] = mapped.filter((video): video is FeaturedVideo => video !== null);

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
          hasLoadedOnceRef.current = true;
          setIsLoading(false);
        }
      }

      if (!cancelled && refreshMs > 0) {
        timer = setTimeout(loadVideos, refreshMs);
      }
    };

    loadVideos();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [refreshMs]);

  return { videos, isLoading, error };
}
