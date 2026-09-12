import type { MetadataRoute } from 'next';
import { staticReleases } from '@/data/releases';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only indexable routes belong here. The Vault and labs intentionally use noindex.
  // Omit lastModified until a real page-edit timestamp is available.
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/releases`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/gallery`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/upcoming`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/rouge-noir`, changeFrequency: 'monthly', priority: 0.7 },
    ...staticReleases.filter(release => release.slug).map(release => ({
      url: `${SITE_URL}/releases/${release.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
