/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { staticReleases, type Release } from '@/data/releases';
import { PlayReleaseButton } from '@/Components/PlayReleaseButton';
import { TrackLyricsToggle } from '@/Components/TrackLyricsToggle';

// Pre-render all release pages at build time
export async function generateStaticParams() {
    return staticReleases
        .filter(r => r.slug)
        .map(r => ({ slug: r.slug as string }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata(props: any) {
    const maybeParams = props?.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isPromise(v: any) {
        return !!v && typeof v === 'object' && typeof v.then === 'function';
    }
    let slug;
    if (isPromise(maybeParams)) {
        const awaited = await maybeParams;
        slug = awaited.slug;
    } else {
        slug = maybeParams?.slug;
    }

    const release = staticReleases.find(r => r.slug === slug) as Release | undefined;
    if (!release) return { title: 'Release' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://okisooo.github.io';
    const url = `${siteUrl}/releases/${release.slug}`;

    // Hyper-optimized SEO title (around 50-60 characters for SERP space)
    const seoTitle = `OKISO — ${release.title} | VOCALOID Producer & VTuber`;
    
    // Hyper-optimized SEO description (around 120-160 characters for high CTR)
    const baseDesc = release.description || `Official release page for ${release.title} by OKISO.`;
    const seoDescription = baseDesc.length > 50 
        ? baseDesc 
        : `Listen to "${release.title}" (${release.year}) by virtual artist & VOCALOID producer OKISO. Stream on Spotify, watch the MV, and explore tracklists.`;

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url,
            siteName: "OKISO",
            images: [release.img],
            type: release.albumType === 'album' ? 'music.album' : 'music.song',
            other: {
                'music:musician': 'https://okiso.net',
                'music:release_date': release.releaseDate,
            }
        },
        twitter: {
            card: "summary_large_image",
            title: seoTitle,
            description: seoDescription,
            images: [release.img],
        },
        alternates: {
            canonical: url
        }
    };
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
    const awaitedParams = await params;
    const release = staticReleases.find(r => r.slug === awaitedParams.slug) as Release | undefined;
    if (!release) return notFound();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://okisooo.github.io';
    const url = `${siteUrl}/releases/${release.slug}`;

    const albumLd: Record<string, unknown> = {
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
        Object.assign(albumLd, {
            track: release.tracks.map(t => ({
                "@type": "MusicRecording",
                "name": t.title,
                "duration": t.duration,
                "position": t.trackNumber,
                "url": t.link
            }))
        });
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Releases",
                "item": `${siteUrl}/releases`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": release.title,
                "item": url
            }
        ]
    };

    const jsonLd = {
        "@graph": [albumLd, breadcrumbLd]
    };

    // Helper to format ISO8601 durations like PT2M25S -> 2:25
    function formatDuration(iso?: string) {
        if (!iso) return '';
        const m = iso.match(/(\d+)M/);
        const s = iso.match(/(\d+)S/);
        const mins = m ? m[1] : '0';
        const secs = s ? s[1].padStart(2, '0') : '00';
        return `${mins}:${secs}`;
    }

    return (
        <div 
            data-premid-page="release"
            data-premid-release-title={release.title}
            data-premid-release-cover={release.img}
            className="w-full max-w-4xl mx-auto p-6 md:p-12"
        >
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
                    <div className="flex items-center gap-3">
                        <PlayReleaseButton release={release} />
                        <a href={release.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#1DB954] text-black font-medium px-3 py-2 rounded-md hover:bg-[#1ed760] transition-colors">Listen on Spotify</a>
                    </div>
                    {release.tracks && release.tracks.length > 0 && (
                        <div className="mt-8 w-full max-w-xl">
                            <h2 className="text-xl font-bold mb-3">Tracks</h2>
                            <div className="flex flex-col border-t border-black/5 dark:border-white/5">
                                {release.tracks.map(t => (
                                    <TrackLyricsToggle
                                        key={t.id || `${t.title}-${t.trackNumber}`}
                                        title={t.title}
                                        durationStr={t.duration ? formatDuration(String(t.duration)) : undefined}
                                        lyrics={t.lyrics}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
