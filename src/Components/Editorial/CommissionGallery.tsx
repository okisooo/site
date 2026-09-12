"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Search, X } from "lucide-react";
import { galleryWorks, type GalleryVariant, type GalleryWork } from "@/data/gallery";
import { EditorialDialog } from "./EditorialDialog";
import { AmbientMotionContext, useAmbientVisibility } from "./AmbientMotion";

const PAGE_SIZE = 12;

function Artwork({ work, variant, animate = false }: { work: GalleryWork; variant: GalleryVariant; animate?: boolean }) {
  const { ref, active } = useAmbientVisibility();
  return <div ref={ref} className="ed-gallery-artwork">
    <img src={animate && active && variant.motion ? variant.motion : variant.src} alt={`${work.title} — ${variant.label}, by ${work.artist}`}
      width={variant.width} height={variant.height} decoding="async" />
  </div>;
}

function ArtworkViewer({ work, onClose, previous, next, position, total }: {
  work: GalleryWork; onClose: () => void; previous: () => void; next: () => void; position: number; total: number;
}) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ambient = useContext(AmbientMotionContext);
  const variant = work.variants[variantIndex];
  useEffect(() => { setVariantIndex(0); setPlaying(false); }, [work.id]);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|SELECT|TEXTAREA/.test((event.target as HTMLElement)?.tagName)) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [previous, next]);
  // Work changes can briefly retain a previous work's variant index.
  const selected = variant || work.variants[0];
  return <EditorialDialog title={work.title} className="ed-gallery-dialog" onClose={onClose}>
    <div className="ed-gallery-viewer">
      <Artwork work={work} variant={selected} animate={playing} />
      <aside className="ed-gallery-details">
        <span className="ed-label">commissioned for okiso</span>
        <h3>{work.artist}</h3><p>{work.description}</p>
        {work.artistUrl && <a className="ed-text-link" href={work.artistUrl} target="_blank" rel="noopener noreferrer">meet the artist <ArrowUpRight size={16} /></a>}
        {work.workUrl && <a className="ed-text-link" href={work.workUrl} target="_blank" rel="noopener noreferrer">original on skeb <ArrowUpRight size={16} /></a>}
        {work.variants.length > 1 && <div className="ed-gallery-variants" role="group" aria-label="Artwork versions">
          <span className="ed-label">from this commission</span>
          {work.variants.map((item, index) => <button key={item.src} aria-pressed={index === variantIndex} onClick={() => { setVariantIndex(index); setPlaying(false); }}>
            <img src={item.small || item.src} alt="" width="48" height="48" loading="lazy" /><span>{item.label}</span>
          </button>)}
        </div>}
        {selected.motion && <button className="ed-button" disabled={!ambient} onClick={() => setPlaying(!playing)}>
          {playing && ambient ? <Pause size={15} /> : <Play size={15} />}{!ambient ? "animation paused" : playing ? "pause animation" : "play animation"}
        </button>}
        <div className="ed-gallery-paging"><button className="ed-icon-button" onClick={previous} aria-label="Previous artwork" disabled={total < 2}><ChevronLeft size={18} /></button>
          <span className="ed-label" role="status">{position + 1} / {total}</span><button className="ed-icon-button" onClick={next} aria-label="Next artwork" disabled={total < 2}><ChevronRight size={18} /></button></div>
      </aside>
    </div>
  </EditorialDialog>;
}

export default function CommissionGallery() {
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const artists = useMemo(() => [...new Set(galleryWorks.map((work) => work.artist))], []);
  const filtered = galleryWorks.filter((work) => (artist === "all" || work.artist === artist)
    && `${work.title} ${work.artist} ${work.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selectedIndex = filtered.findIndex((work) => work.id === selectedId);
  const selected = filtered[selectedIndex];
  const navigate = (delta: number) => setSelectedId(filtered[(selectedIndex + delta + filtered.length) % filtered.length].id);

  return <div className="ed-page ed-gallery">
    <header className="ed-page-heading ed-gallery-heading"><div><span className="ed-label">original commissions / the growing collection</span><h1>the gallery.</h1>
      <p>one character, through different eyes. explore the illustrations and meet the artists behind them.</p></div>
      <div className="ed-gallery-count"><strong>{String(galleryWorks.length).padStart(2, "0")}</strong><span className="ed-label">works & their variations</span></div>
    </header>
    <div className="ed-gallery-ticker ed-idle" aria-hidden="true"><div className="ed-gallery-ticker-track">{[0, 1].map((copy) => <span key={copy}>{artists.map((name) => <span key={name}>{name}<i>↗</i></span>)}</span>)}</div></div>
    <div className="ed-gallery-tools">
      <label className="ed-gallery-search"><Search size={17} /><input type="search" aria-label="Search commissioned artwork" placeholder="find an artist or artwork" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} />
        {query && <button aria-label="Clear artwork search" onClick={() => setQuery("")}><X size={16} /></button>}</label>
      <label className="ed-gallery-filter"><span className="ed-label">artist</span><select aria-label="Filter by artist" value={artist} onChange={(event) => { setArtist(event.target.value); setLimit(PAGE_SIZE); }}>
        <option value="all">all artists</option>{artists.map((name) => <option key={name}>{name}</option>)}</select></label>
      <span className="ed-label" role="status">{filtered.length} {filtered.length === 1 ? "work" : "works"}</span>
    </div>
    {filtered.length ? <div className="ed-gallery-grid">{filtered.slice(0, limit).map((work, index) => <article key={work.id} className="ed-gallery-card">
      <button className="ed-gallery-open" aria-label={`View ${work.title} by ${work.artist}`} onClick={() => setSelectedId(work.id)}>
        <div className={`ed-gallery-mount ${work.medium === 'animation' ? 'ed-gallery-mount-animation' : ''}`}>
          <img src={work.small} alt={work.description} width={work.width} height={work.height} loading={index < 3 ? "eager" : "lazy"} decoding="async" />
          <span className="ed-gallery-expand"><ArrowUpRight size={20} /></span>
          {work.medium === 'animation' && <span className="ed-gallery-badge"><Play size={11} /> animated</span>}
        </div>
        <div className="ed-gallery-card-caption"><span className="ed-label">{work.artist}</span><h2>{work.title}</h2><span className="ed-gallery-version-count">{work.variants.length} {work.variants.length === 1 ? 'version' : 'versions'}</span></div>
      </button>
    </article>)}</div> : <div className="ed-gallery-empty"><h2>nothing in this frame.</h2><p>try another artist or a different search.</p><button className="ed-button" onClick={() => { setArtist("all"); setQuery(""); }}>show the collection</button></div>}
    {limit < filtered.length && <div className="ed-gallery-more"><button className="ed-button" onClick={() => setLimit(limit + PAGE_SIZE)}>more from the collection <ArrowUpRight size={16} /></button></div>}
    <p className="ed-gallery-credit-note">each work belongs to its artist. please visit the original work for their profile and commission information.</p>
    {selected && <ArtworkViewer work={selected} onClose={() => setSelectedId(null)} previous={() => navigate(-1)} next={() => navigate(1)} position={selectedIndex} total={filtered.length} />}
  </div>;
}
