import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { staticReleases, type Release } from '@/data/releases';

// Pre-render all release pages at build time
export async function generateStaticParams() {
  return staticReleases
    .filter(r => r.slug)
    .map(r => ({ slug: r.slug as string }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  // Accept both plain params and Promise-wrapped params to satisfy Next.js typings across versions
  const maybeParams = props?.params as (Promise<{ slug: string }> | { slug: string } | undefined);

  // Helper to detect Promise/thenable without using `any` (satisfies ESLint)
  function isThenable<T>(v: unknown): v is Promise<T> {
    return !!v && typeof v === 'object' && typeof (v as { then?: unknown }).then === 'function';
  }

  const resolvedParams = isThenable<{ slug: string }>(maybeParams)
    ? await maybeParams
    : (maybeParams as { slug?: string } | undefined) || {};

  const slug = (resolvedParams as { slug?: string }).slug;
  const release = staticReleases.find(r => r.slug === slug) as Release | undefined;
  if (!release) return { title: 'Release' } as Metadata;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://okisooo.github.io';
  const url = `${siteUrl}/releases/${release.slug}`;

  return {
    title: `OKISO — ${release.title}`,
    description: release.description || `Official release page for ${release.title} by OKISO.`,
    openGraph: {
      title: `OKISO — ${release.title}`,
      description: release.description || `Official release page for ${release.title} by OKISO.`,
      url,
      images: [release.img]
    },
    alternates: {
      canonical: url
    }
  } as Metadata;
}

export default function ReleasePage({ params }: { params: { slug: string } }) {
  const release = staticReleases.find(r => r.slug === params.slug) as Release | undefined;
  if (!release) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://okisooo.github.io';
  const url = `${siteUrl}/releases/${release.slug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "name": release.title,
    "byArtist": {
      "@type": "MusicGroup",
      "name": "OKISO",
      "sameAs": [
        // Add official external links if available
        "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm",
      ]
    },
    "datePublished": release.releaseDate,
    "image": release.img,
    "url": url,
    "description": release.description || ''
  };

  if (release.tracks && release.tracks.length > 0) {
    // safe to assert tracks exist because of the guard above
    Object.assign(jsonLd, { track: release.tracks.map(t => ({
      "@type": "MusicRecording",
      "name": t.title,
      "duration": t.duration,
      "position": t.trackNumber,
      "url": t.link
    })) });
  }

  return (
    <main className="p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-bold mb-4">{release.title}</h1>
      <div className="flex gap-6 items-start">
        <div className="w-[220px] relative">
          <a href={release.link} target="_blank" rel="noopener noreferrer">
            <Image src={release.img} alt={`${release.title} artwork`} width={440} height={440} className="rounded-md shadow" />
          </a>
        </div>
        <div>
          <p className="text-gray-400 mb-2">Released: {release.releaseDate} ({release.year})</p>
          <p className="mb-4">{release.description}</p>
          <a href={release.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#1DB954] text-black font-medium px-3 py-2 rounded">Listen on Spotify</a>
          {release.tracks && release.tracks.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Tracklist</h2>
              <ol className="list-decimal list-inside">
                {release.tracks.map(t => (
                  <li key={t.id || `${t.title}-${t.trackNumber}`}>{t.trackNumber}. {t.title} {t.duration ? `— ${String(t.duration).replace('PT','')}` : ''}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
