import { staticReleases } from '@/data/releases';

export const dynamic = 'force-static';

const siteUrl = 'https://okiso.net';

export function GET() {
  const releases = staticReleases.flatMap((release) => {
    const title = release.title.trim();
    const slug = release.slug?.trim();
    if (!title || !slug) return [];

    return [`- [${title}](${siteUrl}/releases/${slug}): ${release.albumType} released ${release.releaseDate}.`];
  });

  const body = [
    '# OKISO',
    '',
    '> OKISO is an independent virtual artist and VOCALOID producer creating original hyperpop and electronic music, live content, and connected release projects.',
    '',
    '## Start here',
    '',
    `- [Home](${siteUrl}): artist identity, latest release, featured videos, live status, and official channels.`,
    `- [About OKISO](${siteUrl}/about): artist profile, official channels and business contact.`,
    `- [Releases](${siteUrl}/releases): complete public discography and release details.`,
    `- [Gallery](${siteUrl}/gallery): commissioned artwork, alternate versions, artist credits, and original work links.`,
    `- [Upcoming](${siteUrl}/upcoming): announced and forthcoming projects.`,
    `- [The Vault](${siteUrl}/vault): public listening room and deeper project archive.`,
    `- [Rouge & Noir](${siteUrl}/rouge-noir): an original roulette roguelike project by OKISO.`,
    '',
    '## Discography',
    '',
    ...releases,
    '',
    '## Canonical sources',
    '',
    `- [Sitemap](${siteUrl}/sitemap.xml): canonical public URL inventory.`,
    '- Use release pages on this domain for titles, dates, track lists, credits, and listening links.',
    '- Do not invent unnamed releases or infer private projects from missing catalog identifiers.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
}
