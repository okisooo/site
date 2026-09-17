"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, Play } from "lucide-react";
import type { Release } from "@/data/releases";
import { getReleaseListenTarget } from "@/lib/releaseLinks";
import { PlayReleaseButton } from "@/Components/PlayReleaseButton";
import { EditorialDialog } from "@/Components/Editorial/EditorialDialog";

const ReleaseOrbit = dynamic(() => import("@/Components/3D/ReleaseOrbit"), {
  ssr: false, loading: () => <p role="status" className="ed-loading text-white">opening the 3d archive…</p>,
});

export default function ReleasesClient({ catalog }: { catalog: Release[] }) {
  const [view, setView] = useState<"grid" | "orbit">("grid");
  const [query, setQuery] = useState("");
  const [pinned, setPinned] = useState<Release | null>(null);
  const [hovered, setHovered] = useState<Release | null>(null);
  const selected = pinned ?? hovered;
  const releases = catalog.filter((release) => `${release.title} ${release.year} ${release.albumType}`.toLowerCase().includes(query.toLowerCase().trim()));

  return <div className="ed-page" data-premid-page="releases" data-premid-view={view}
    {...(pinned ? { "data-premid-release-title": pinned.title, "data-premid-release-cover": pinned.img } : {})}>
    <header className="ed-page-heading"><div><h1>releases</h1></div><span className="ed-heading-number" aria-label={`${catalog.length} releases`}>{catalog.length}</span></header>
    <div className="ed-toolbar">
      {view === "grid" && <input type="search" aria-label="Search releases" placeholder="search title, year or release type" value={query} onChange={(event) => setQuery(event.target.value)} />}
      <span className="ed-label" role="status">{view === "grid" ? `${releases.length} ${releases.length === 1 ? "release" : "releases"} / newest first` : "drag to explore · select a cover"}</span>
      <button className="ed-button" aria-pressed={view === "grid"} onClick={() => { setView("grid"); setPinned(null); }}>cover grid</button>
      <button className="ed-button" aria-pressed={view === "orbit"} onClick={() => { setView("orbit"); setPinned(null); }}>3d archive</button>
    </div>
    {view === "grid" ? <div className="ed-release-grid">
      {releases.map((release) => <article key={release.id} className="ed-release-card">
        <Link href={`/releases/${release.slug}`}><div className="ed-release-image"><img src={release.img} alt={`${release.title} cover`} width="360" height="360" loading="lazy" /><ArrowUpRight className="ed-art-arrow" /></div>
          <div className="ed-release-meta"><span>{release.albumType} / {release.year}</span><span>{release.totalTracks || 1} {(release.totalTracks || 1) === 1 ? "track" : "tracks"}</span></div>
          <h2>{release.title}</h2></Link>
        <button className="ed-quick-listen" onClick={() => setPinned(release)} aria-label={`Quick listen to ${release.title}`}><Play size={12} />quick listen</button>
      </article>)}
    </div> : <div className="ed-orbit" data-lenis-prevent><ReleaseOrbit onHoverRelease={setHovered} onClickRelease={setPinned} />
      {selected && <div className="ed-orbit-selection"><span className="ed-label">{selected.albumType} / {selected.year}</span><h2>{selected.title}</h2><ReleaseActions release={selected} />{pinned && <button className="ed-quick-listen" onClick={() => setPinned(null)}>clear selection</button>}</div>}
    </div>}
    {view === "grid" && releases.length === 0 && <div className="ed-empty"><h2>no matches</h2><button className="ed-button" onClick={() => setQuery("")}>clear search</button></div>}
    {view === "grid" && pinned && <EditorialDialog title={pinned.title} onClose={() => setPinned(null)}><img src={pinned.img} alt={`${pinned.title} cover`} width="320" height="320" className="ed-quick-art" /><span className="ed-label">{pinned.albumType} / {pinned.year}</span><ReleaseActions release={pinned} /></EditorialDialog>}
  </div>;
}
function ReleaseActions({ release }: { release: Release }) {
  const target = getReleaseListenTarget(release);
  return <div className="ed-quick-actions"><PlayReleaseButton release={release} /><a className="ed-button" href={target.url} target="_blank" rel="noopener noreferrer">{target.label}<ArrowUpRight size={14} /></a><Link className="ed-text-link" href={`/releases/${release.slug}`}>release details <ArrowUpRight size={14} /></Link></div>;
}
