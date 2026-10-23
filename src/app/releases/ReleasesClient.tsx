"use client";

import { useRef, useState } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, Play, Search, X } from "lucide-react";
import type { Release } from "@/data/releases";
import { coverArt, coverSrcSet } from "@/lib/coverArt";
import { getReleaseListenTarget } from "@/lib/releaseLinks";
import { PlayReleaseButton } from "@/Components/PlayReleaseButton";
import { EditorialDialog } from "@/Components/Editorial/EditorialDialog";

const ReleaseOrbit = dynamic(() => import("@/Components/3D/ReleaseOrbit"), {
  ssr: false, loading: () => <p role="status" className="ed-loading text-white">opening the 3d archive…</p>,
});

export default function ReleasesClient({ catalog }: { catalog: Release[] }) {
  // Covers come from Spotify's image host; open that connection while the page is still parsing.
  preconnect("https://i.scdn.co");
  const [view, setView] = useState<"grid" | "orbit">("grid");
  const [query, setQuery] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const [pinned, setPinned] = useState<Release | null>(null);
  const [hovered, setHovered] = useState<Release | null>(null);
  const selected = pinned ?? hovered;
  const releases = catalog.filter((release) => `${release.title} ${release.year} ${release.albumType}`.toLowerCase().includes(query.toLowerCase().trim()));

  return <div className="ed-page" data-premid-page="releases" data-premid-view={view}
    {...(pinned ? { "data-premid-release-title": pinned.title, "data-premid-release-cover": pinned.img } : {})}>
    <header className="ed-page-heading"><div><span className="ed-label">discography</span><h1>releases</h1></div><div className="ed-gallery-count"><strong>{catalog.length}</strong><span className="ed-label">releases</span></div></header>
    <div className="ed-toolbar">
      {view === "grid" && <label className="ed-gallery-search"><Search size={17} /><input ref={search} type="search" aria-label="Search releases" placeholder="search title, year or release type" value={query} onChange={(event) => setQuery(event.target.value)} />
        {query && <button type="button" aria-label="Clear release search" onClick={() => { setQuery(""); search.current?.focus(); }}><X size={16} /></button>}</label>}
      <span className="ed-label" role="status">{view === "grid" ? `${releases.length} ${releases.length === 1 ? "release" : "releases"} / newest first` : "drag to explore · select a cover"}</span>
      <button className="ed-button" aria-pressed={view === "grid"} onClick={() => { setView("grid"); setPinned(null); }}>cover grid</button>
      <button className="ed-button" aria-pressed={view === "orbit"} onClick={() => { setView("orbit"); setPinned(null); }}>3d archive</button>
    </div>
    {view === "grid" ? <div className="ed-release-grid">
      {releases.map((release, index) => <article key={release.id} className="ed-release-card">
        <Link href={`/releases/${release.slug}`}><div className="ed-release-image"><img src={coverArt(release.img, 300)} srcSet={coverSrcSet(release.img)} sizes="(max-width: 700px) calc(50vw - 40px), (max-width: 1380px) 21vw, 290px" alt="" width="360" height="360" loading={index < 4 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} /><ArrowUpRight className="ed-art-arrow" /></div>
          <div className="ed-release-meta"><span>{release.albumType} / {release.year}</span><span>{release.totalTracks || 1} {(release.totalTracks || 1) === 1 ? "track" : "tracks"}</span></div>
          <h2>{release.title}</h2></Link>
        <button className="ed-quick-listen" onClick={() => setPinned(release)} aria-label={`Quick listen to ${release.title}`}><Play size={12} />quick listen</button>
      </article>)}
    </div> : <div className="ed-orbit" data-lenis-prevent><ReleaseOrbit onHoverRelease={setHovered} onClickRelease={setPinned} />
      {selected && <div className="ed-orbit-selection"><span className="ed-label">{selected.albumType} / {selected.year}</span><h2>{selected.title}</h2><ReleaseActions release={selected} />{pinned && <button className="ed-quick-listen" onClick={() => setPinned(null)}>clear selection</button>}</div>}
    </div>}
    {view === "grid" && releases.length === 0 && <div className="ed-empty"><h2>no matches</h2><button className="ed-button" onClick={() => setQuery("")}>clear search</button></div>}
    {view === "grid" && pinned && <EditorialDialog title={pinned.title} onClose={() => setPinned(null)}><div className="ed-release-image ed-quick-art"><img src={pinned.img} alt={`${pinned.title} cover`} width="320" height="320" /></div><span className="ed-label">{pinned.albumType} / {pinned.year}</span><ReleaseActions release={pinned} /></EditorialDialog>}
  </div>;
}
function ReleaseActions({ release }: { release: Release }) {
  const target = getReleaseListenTarget(release);
  return <div className="ed-quick-actions"><PlayReleaseButton release={release} /><a className="ed-button" href={target.url} target="_blank" rel="noopener noreferrer">{target.label}<ArrowUpRight size={14} /></a><Link className="ed-text-link" href={`/releases/${release.slug}`}>release details <ArrowUpRight size={14} /></Link></div>;
}
