import { useEffect, useState } from 'react';

export interface FeaturedVideo {
  id: string;
  title: string;
  src: string;
  poster?: string;
  category?: string;
  sourceUrl?: string;
}

interface UseFeaturedVideosResult {
  videos: FeaturedVideo[];
  isLoading: boolean;
  error: string | null;
}

type MatchMode = 'any' | 'all';

interface UseFeaturedVideosOptions {
  category?: string;
  categories?: string[];
  match?: MatchMode;
  limit?: number;
  refreshMs?: number;
}

const FEED_BASE_URL = 'https://api.okiso.net/api/media/website/videos/feed';

function buildFeedUrl(options: UseFeaturedVideosOptions) {
  const params = new URLSearchParams();
  params.set('usecase', 'website');

  const limit = Math.max(1, Math.min(200, options.limit ?? 50));
  params.set('limit', String(limit));

  if (options.category) {
    params.set('category', options.category);
  } else if (options.categories && options.categories.length > 0) {
    params.set('categories', options.categories.join(','));
    params.set('match', options.match ?? 'any');
  } else {
    params.set('match', options.match ?? 'any');
  }

  return `${FEED_BASE_URL}?${params.toString()}`;
}

export function useFeaturedVideos(options: UseFeaturedVideosOptions = {}): UseFeaturedVideosResult {
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    category,
    categories,
    match = 'any',
    limit = 50,
    refreshMs = 60000,
  } = options;

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const endpoint = buildFeedUrl({ category, categories, match, limit });

    const loadVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(endpoint, { cache: 'no-store' });
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
              streamUrl?: string;
              url?: string;
              sourceUrl?: string;
              poster?: string;
              thumbnail?: string;
              thumbnailUrl?: string;
              category?: string;
            };

            // Playback priority: streamUrl -> url. sourceUrl is retained for original-download access only.
            const src = raw.streamUrl || raw.url;
            if (!src) return null;

            return {
              id: String(raw.id ?? index + 1),
              title: raw.title || raw.name || `VIDEO_${index + 1}`,
              src,
              poster: raw.poster || raw.thumbnail || raw.thumbnailUrl || undefined,
              category: raw.category,
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
  }, [category, categories, match, limit, refreshMs]);

  return { videos, isLoading, error };
}
