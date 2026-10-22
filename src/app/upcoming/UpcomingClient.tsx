import Link from "next/link";
import { ArrowUpRight, Disc3, FolderOpen } from "lucide-react";
import { staticReleases } from "@/data/releases";
import { coverArt, coverSrcSet } from "@/lib/coverArt";
import { getReleaseListenTarget } from "@/lib/releaseLinks";
import { formatReleaseDate, releaseCard } from "@/lib/releasePresentation";
import { PlayReleaseButton } from "@/Components/PlayReleaseButton";

export default function UpcomingClient() {
  const latest = staticReleases[0];
  const tracks = latest.tracks?.length || latest.totalTracks || 1;
  const target = getReleaseListenTarget(latest);
  return <div className="ed-page" data-premid-page="upcoming">
    <header className="ed-page-heading"><div><span className="ed-label">release schedule</span><h1>upcoming</h1></div></header>
    <div className="ed-upcoming">
      <div className="ed-empty"><span className="ed-label">next release</span><h2>nothing announced yet</h2><p>no release dates are announced right now.</p>
        <Link href="/vault" className="ed-vault-teaser"><span className="ed-label">demos & versions</span><span className="ed-vault-teaser-title">vault<FolderOpen strokeWidth={1.25} /></span><span className="ed-vault-teaser-footer">open vault <span className="ed-folder-open"><ArrowUpRight size={17} /></span></span></Link></div>
      <div className="ed-upcoming-art">
        <div className="ed-panel-label"><span><Disc3 size={12} /> out now</span><time dateTime={latest.releaseDate}>{formatReleaseDate(latest.releaseDate)}</time></div>
        <Link href={`/releases/${latest.slug}`} className="ed-release-image" tabIndex={-1} aria-hidden="true"><img src={coverArt(latest.img, 640)} srcSet={coverSrcSet(latest.img)} sizes="(max-width: 700px) calc(100vw - 100px), 500px" alt="" width="560" height="560" /></Link>
        <div className="ed-release-meta"><span>{latest.albumType}</span><span>{tracks} {tracks === 1 ? "track" : "tracks"}</span></div>
        <h2><Link href={`/releases/${latest.slug}`}>{latest.title}</Link></h2>
        <div className="ed-quick-actions"><PlayReleaseButton release={releaseCard(latest)} /><a className="ed-button" href={target.url} target="_blank" rel="noopener noreferrer">{target.label}<ArrowUpRight size={14} /></a></div>
      </div>
    </div>
  </div>;
}
