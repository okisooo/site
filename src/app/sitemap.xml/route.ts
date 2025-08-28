import { staticReleases } from '@/data/releases';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://okisooo.github.io';

  const urls = new Set<string>();
  urls.add(`${siteUrl}/`);
  urls.add(`${siteUrl}/releases`);
  urls.add(`${siteUrl}/upcoming`);

  const items = staticReleases.map(r => ({
    loc: `${siteUrl}/releases/${r.slug}`,
    lastmod: r.releaseDate,
    image: r.img
  }));

  const xmlItems = items.map(i => `
    <url>
      <loc>${i.loc}</loc>
      <lastmod>${i.lastmod}</lastmod>
      <image:image>
        <image:loc>${i.image}</image:loc>
      </image:image>
    </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
      <loc>${siteUrl}/</loc>
    </url>
    <url>
      <loc>${siteUrl}/releases</loc>
    </url>
    ${xmlItems}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=3600'
    }
  });
}
