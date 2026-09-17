import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { staticReleases } from "@/data/releases";
import { PlayReleaseButton } from "@/Components/PlayReleaseButton";
import { TrackLyricsToggle } from "@/Components/TrackLyricsToggle";
import { getReleaseListenTarget } from "@/lib/releaseLinks";
import { jsonLd, releaseMetadata, releaseStructuredData } from "@/lib/seo";
import { relatedReleases, releaseCard } from "@/lib/releasePresentation";

export async function generateStaticParams() {
  return staticReleases.filter((release) => release.slug).map((release) => ({ slug: release.slug as string }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const release = staticReleases.find((item) => item.slug === slug);
  if (!release) return { title: "Release not found", robots: { index: false } };
  return releaseMetadata(release);
}
function formatDuration(iso?: string) {
  if (!iso) return "";
  return `${iso.match(/(\d+)M/)?.[1] || "0"}:${(iso.match(/(\d+)S/)?.[1] || "0").padStart(2, "0")}`;
}
export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = staticReleases.find((item) => item.slug === slug);
  if (!release) return notFound();
  const target = getReleaseListenTarget(release);
  const related = relatedReleases(release);
  return <article className="ed-page ed-release-detail" data-premid-page="release" data-premid-release-title={release.title} data-premid-release-cover={release.img}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(releaseStructuredData(release)) }} />
    <Link href="/releases" className="ed-text-link">← all releases</Link>
    <header className="ed-page-heading"><div><span className="ed-label">okiso / {release.albumType} / {release.year}</span><h1>{release.title}</h1></div></header>
    <div className="ed-release-body">
      <div className="ed-detail-art"><a href={target.url} target="_blank" rel="noopener noreferrer"><img src={release.img} alt={`${release.title} artwork`} width="600" height="600" fetchPriority="high" /></a>
        <div className="ed-panel-label"><span>{release.albumType} / {(release.tracks?.length || 1)} {(release.tracks?.length || 1) === 1 ? "track" : "tracks"}</span><time dateTime={release.releaseDate}>{release.releaseDate}</time></div></div>
      <div>
        <Link href="/about" className="ed-text-link">about okiso <ArrowUpRight size={14} /></Link>
        {release.label && <p className="ed-release-credits">released by {release.label}{release.primaryGenre ? ` · ${release.primaryGenre}` : ""}</p>}
        <div className="ed-quick-actions"><PlayReleaseButton release={releaseCard(release)} /><a href={target.url} target="_blank" rel="noopener noreferrer" className="ed-button">{target.label}<ArrowUpRight size={16} /></a></div>
        {release.tracks && release.tracks.length > 0 && <section className="ed-tracklist" aria-labelledby="tracks"><h2 id="tracks">tracks{release.tracks.some((track) => track.lyrics) ? " & lyrics" : ""} / {release.tracks.length}</h2>
          {release.tracks.map((track) => <TrackLyricsToggle key={track.id || `${track.title}-${track.trackNumber}`} title={track.title} durationStr={track.duration ? formatDuration(String(track.duration)) : undefined} lyrics={track.lyrics} />)}
        </section>}
      </div>
    </div>
    <nav className="ed-related" aria-label="More releases by OKISO"><header className="ed-section-heading"><h2>more music</h2><Link className="ed-text-link" href="/releases">all releases <ArrowUpRight size={16} /></Link></header>
      <div className="ed-release-grid">{related.map((item) => <div key={item.slug} className="ed-release-card"><Link href={`/releases/${item.slug}`}><div className="ed-release-image"><img src={item.img} alt={`${item.title} cover`} width="320" height="320" loading="lazy" /></div><div className="ed-release-meta"><span>{item.albumType}</span><span>{item.year}</span></div><h3>{item.title}</h3></Link></div>)}</div>
    </nav>
  </article>;
}
