/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { staticReleases, type Release } from "@/data/releases";
import { PlayReleaseButton } from "@/Components/PlayReleaseButton";
import { TrackLyricsToggle } from "@/Components/TrackLyricsToggle";
import { getReleaseListenTarget } from "@/lib/releaseLinks";
import { Archivo, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";

const tacDisplay = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-tac-display" });
const tacMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-mono" });
const tacCjk = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-cjk" });

export async function generateStaticParams() {
    return staticReleases
        .filter(r => r.slug)
        .map(r => ({ slug: r.slug as string }));
}

export async function generateMetadata(props: any) {
    const maybeParams = props?.params;
    function isPromise(v: any) {
        return !!v && typeof v === "object" && typeof v.then === "function";
    }
    let slug;
    if (isPromise(maybeParams)) {
        const awaited = await maybeParams;
        slug = awaited.slug;
    } else {
        slug = maybeParams?.slug;
    }

    const release = staticReleases.find(r => r.slug === slug) as Release | undefined;
    if (!release) return { title: "Release" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://okiso.net";
    const url = `${siteUrl}/releases/${release.slug}`;

    const seoTitle = `OKISO — ${release.title} | VOCALOID Producer & VTuber`;
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
            type: release.albumType === "album" ? "music.album" : "music.song",
            other: {
                "music:musician": "https://okiso.net",
                "music:release_date": release.releaseDate,
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://okiso.net";
    const url = `${siteUrl}/releases/${release.slug}`;
    const listenTarget = getReleaseListenTarget(release);

    const albumLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": release.title,
        "byArtist": {
            "@type": "MusicGroup",
            "name": "OKISO",
            "sameAs": [
                "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm",
            ]
        },
        "datePublished": release.releaseDate,
        "image": release.img,
        "url": url,
        "description": release.description || ""
    };

    if (release.tracks && release.tracks.length > 0) {
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

    function formatDuration(iso?: string) {
        if (!iso) return "";
        const m = iso.match(/(\d+)M/);
        const s = iso.match(/(\d+)S/);
        const mins = m ? m[1] : "0";
        const secs = s ? s[1].padStart(2, "0") : "00";
        return `${mins}:${secs}`;
    }

    return (
        <div
            data-premid-page="release"
            data-premid-release-title={release.title}
            data-premid-release-cover={release.img}
            className={`${tacDisplay.variable} ${tacMono.variable} ${tacCjk.variable} w-full min-h-screen bg-[var(--tac-bone)] text-[var(--tac-ink)] dark:bg-[#0c0c0e] dark:text-[#f0f0ed] transition-colors duration-500 py-16 px-6 md:px-12`}
        >
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/releases" className="tac-cta-ghost">
                        ← Back to Discography
                    </Link>
                </div>

                <div className="tac-sec-head mb-2">
                    <span className="tac-sec-index">001</span>
                    <span className="tac-rule" />
                    <span className="tac-sec-label">{release.year} {"//"} {release.albumType}</span>
                </div>

                <h1 className="tac-h2 mb-8">{release.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
                    <div className="tac-plate relative aspect-square overflow-hidden border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18">
                        <a href={listenTarget.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            <Image src={release.img} alt={`${release.title} artwork`} fill className="object-cover" />
                        </a>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p className="tac-mono text-xs text-[var(--tac-steel)] uppercase tracking-[0.2em]">
                            RELEASED: {release.releaseDate} ({release.year})
                        </p>

                        {release.description && (
                            <p className="tac-mono text-xs md:text-sm text-[var(--tac-ink)] dark:text-[var(--tac-bone)] leading-relaxed uppercase tracking-wider">
                                {release.description}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4">
                            <PlayReleaseButton release={release} />
                            <a
                                href={listenTarget.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tac-cta-ghost"
                            >
                                {listenTarget.label}
                            </a>
                        </div>

                        {release.tracks && release.tracks.length > 0 && (
                            <div className="mt-6 w-full">
                                <div className="tac-sec-head mb-3">
                                    <span className="tac-sec-label">Tracklist ({release.tracks.length})</span>
                                </div>
                                <div className="flex flex-col border-t border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15">
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
        </div>
    );
}
