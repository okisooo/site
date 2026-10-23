"use client";

import { useEffect, useRef, useState, type FocusEvent, type Ref } from "react";
import Link from "next/link";
import { ArrowUpRight, Box, Expand, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { galleryWorks, type GalleryVariant, type GalleryWork } from "@/data/gallery";
import { EditorialDialog } from "./EditorialDialog";
import { prefersLightData, useAmbientVisibility } from "./AmbientMotion";

// Newest first, straight from the gallery catalog, so every new commission lands here too.
const works = galleryWorks;
const pieces = works.flatMap((work) => work.variants.map((variant, version) => ({ work, variant, version })));
// Deal the reel round-robin so one artist's versions don't run back to back.
const reel = [...pieces].sort((a, b) => a.version - b.version);
const pad = (value: number) => String(value).padStart(2, "0");
// Narrow chooser tiles may wrap a handle at its camel-case join ("Obakeno|Perutan") before breaking mid-word.
const credit = (artist: string) => artist.replace(/([a-z])([A-Z])/g, "$1|$2").split("|").flatMap((part, index) => index ? [<wbr key={index} />, part] : [part]);
// A chip reached by keyboard scrolls fully into its strip; mouse and touch picks leave the strip where it is.
const reveal = (event: FocusEvent<HTMLElement>) => { if (event.currentTarget.matches(":focus-visible")) event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" }); };
// Auto-tour every version, then the next commission; a manual pick holds its view longer.
const AUTO_MS = 3000, HOLD_MS = 10000;
// The sheet never grows past ~740px wide (1320px column at 1.2fr), so wide screens take the 960w mid.
const SHEET_SIZES = "(max-width: 700px) 90vw, (min-width: 1380px) 740px, 52vw";
const sheetSrcSet = (art: GalleryVariant) => art.small && !art.motion ? [`${art.small} 480w`, art.mid && `${art.mid} 960w`, `${art.src} ${art.width}w`].filter(Boolean).join(", ") : undefined;
// Load and decode with the sheet's own srcset choice, so the swap is instant.
function decodeArt(art: GalleryVariant) {
  const image = new Image();
  const srcSet = sheetSrcSet(art);
  if (srcSet) { image.sizes = SHEET_SIZES; image.srcset = srcSet; }
  image.src = art.src;
  return image.decode().catch(() => undefined);
}

// Decorative: every piece is also reachable through the chooser, its version chips and /gallery,
// so the moving reel stays out of the tab order and the accessibility tree.
function Reel({ onOpen }: { onOpen: (work: GalleryWork, version: number) => void }) {
  const { ref, active } = useAmbientVisibility();
  // The loop's second pass mounts the first time the reel moves (still at 0%), then stays.
  const [looped, setLooped] = useState(false);
  if (active && !looped) setLooped(true);
  return <div ref={ref} className="ed-art-reel" data-active={active} aria-hidden="true">
    <div className="ed-art-reel-track">
      {(looped ? [0, 1] : [0]).map((pass) => reel.map(({ work, variant, version }) => <button key={`${pass}-${variant.src}`} className="ed-art-reel-print" tabIndex={-1} onClick={() => onOpen(work, version)}>
        <img src={variant.small ?? variant.src} alt="" width={variant.width} height={variant.height} loading="lazy" decoding="async" />
        <span><span>{work.artist}</span><span>{variant.label}</span></span>
      </button>))}
    </div>
  </div>;
}

function SheetImage({ work, art, onExpand }: { work: GalleryWork; art: GalleryVariant; onExpand: () => void }) {
  const { ref, active } = useAmbientVisibility();
  return <button ref={ref as unknown as Ref<HTMLButtonElement>} className="ed-art-image-button" onClick={onExpand} aria-label={`view artwork: ${art.label} by ${work.artist}`}>
    <img key={art.src} src={active && art.motion ? art.motion : art.src} srcSet={sheetSrcSet(art)}
      sizes={SHEET_SIZES} alt={`${work.description} (${art.label})`} width={art.width} height={art.height} loading="lazy" decoding="async" />
    <span className="ed-art-expand"><Expand size={16} /> view artwork</span>
  </button>;
}

export default function ArtRoom({ onOpenModel }: { onOpenModel: () => void }) {
  const [selected, setSelected] = useState(0);
  const [version, setVersion] = useState(0);
  const [expanded, setExpanded] = useState<{ work: GalleryWork; version: number } | null>(null);
  const [holdUntil, setHoldUntil] = useState(0);
  const [hovering, setHovering] = useState(false);
  // Keyboard focus inside the room holds the tour, so names and chips never change under it.
  const [keyFocus, setKeyFocus] = useState(false);
  const [lightData, setLightData] = useState(false);
  const { ref: roomRef, active } = useAmbientVisibility();
  const versionsRef = useRef<HTMLDivElement>(null), artistsRef = useRef<HTMLDivElement>(null);
  const work = works[selected];
  const art = work.variants[version] ?? work.variants[0];
  const choose = (index: number) => { setSelected(index); setVersion(0); };
  const hold = () => setHoldUntil(Date.now() + HOLD_MS);
  const pick = (index: number) => { hold(); choose(index); };
  const change = (direction: number) => pick((selected + direction + works.length) % works.length);
  useEffect(() => setLightData(prefersLightData()), []);
  const touring = active && !expanded && !hovering && !keyFocus && !lightData;
  const wait = Math.max(AUTO_MS, holdUntil - Date.now());
  useEffect(() => {
    if (!touring) return;
    let cancelled = false;
    const last = version + 1 >= work.variants.length;
    const nextWork = last ? (selected + 1) % works.length : selected;
    const next = last ? works[nextWork].variants[0] : work.variants[version + 1];
    const ready = decodeArt(next);
    const timer = setTimeout(() => void ready.then(() => {
      if (cancelled) return;
      if (last) choose(nextWork); else setVersion(version + 1);
    }), wait);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [touring, wait, selected, version, work]);
  useEffect(() => {
    // Keep the current chips in view without scrolling the page. A row with keyboard focus already keeps it in view.
    for (const row of [versionsRef.current, artistsRef.current]) {
      const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!row || !chip || row.scrollWidth <= row.clientWidth || row.querySelector(":focus-visible")) continue;
      const offset = chip.getBoundingClientRect().left - row.getBoundingClientRect().left;
      row.scrollTo({ left: row.scrollLeft + offset - row.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
    }
  }, [selected, version]);
  const open = expanded && (expanded.work.variants[expanded.version] ?? expanded.work.variants[0]);

  return <section id="art-room" className="ed-section ed-art-room">
    <header className="ed-section-heading"><div><h2>art commissions</h2></div><div className="ed-art-heading-meta"><span className="ed-art-count">{pad(works.length)}<small> commissions / {pad(pieces.length)} pieces</small></span><Link href="/gallery" className="ed-text-link">open the gallery <ArrowUpRight size={18} /></Link></div></header>
    <Reel onOpen={(item, index) => setExpanded({ work: item, version: index })} />
    {/* A touch inside the room (a swipe along the chips included) holds the tour like a pick. */}
    <div ref={roomRef} className="ed-art-room-layout" onPointerDown={(event) => event.pointerType === "touch" && hold()}
      onFocus={(event) => setKeyFocus(event.target.matches(":focus-visible"))} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyFocus(false); }}>
      <figure className={`ed-art-sheet ed-art-sheet-${work.id}`} onPointerEnter={(event) => event.pointerType === "mouse" && setHovering(true)} onPointerLeave={() => setHovering(false)}>
        <div className="ed-art-sheet-bar"><span className="ed-label">{work.medium} by {work.artist}</span>{work.workUrl ? <a className="ed-text-link ed-art-source" href={work.workUrl} target="_blank" rel="noopener noreferrer">skeb <ArrowUpRight size={14} /></a> : <Expand size={16} aria-hidden="true" />}
          {touring && <span key={`${selected}-${version}-${holdUntil}`} className="ed-art-timer" style={{ animationDuration: `${wait}ms` }} aria-hidden="true" />}</div>
        <SheetImage work={work} art={art} onExpand={() => { hold(); setExpanded({ work, version }); }} />
        {work.variants.length > 1 && <div ref={versionsRef} className="ed-art-versions" role="group" aria-label={`Versions of ${work.title}`}>
          {work.variants.map((item, index) => <button key={item.src} aria-pressed={index === version} onFocus={reveal} onClick={() => { hold(); setVersion(index); }}>
            <img src={item.small ?? item.src} alt="" width="44" height="44" loading="lazy" decoding="async" /><span>{item.label}</span>
          </button>)}
        </div>}
        <figcaption><span>{work.title}</span><span className="ed-label">{work.variants.length > 1 ? `${work.variants.length} versions · ` : ""}art by {work.artist}</span></figcaption>
      </figure>
      <div className="ed-art-room-side">
        <div className="ed-art-intro"><span className="ed-label">every commission</span><span className="ed-label">{pad(selected + 1)} / {pad(works.length)}</span></div>
        <div ref={artistsRef} className="ed-art-artists" role="group" aria-label="Choose a commission">{works.map((item, index) => <button key={item.id} aria-pressed={selected === index} onFocus={reveal} onClick={() => pick(index)}>
          <img src={item.small} alt="" width="96" height="96" loading="lazy" decoding="async" />
          <span><strong>{credit(item.artist.split(" · ")[0])}</strong><small>{item.variants.some((variant) => variant.motion) ? <><Play size={9} /> animated</> : item.variants.length > 1 ? `${item.variants.length} versions` : item.title}</small></span>
        </button>)}</div>
        <div className="ed-art-pagination"><button className="ed-icon-button" aria-label="Previous commission" onClick={() => change(-1)}><ChevronLeft size={18} /></button><span className="ed-label">viewing art by {work.artist}</span><button className="ed-icon-button" aria-label="Next commission" onClick={() => change(1)}><ChevronRight size={18} /></button></div>
      </div>
      <button className="ed-studio-invite" onClick={onOpenModel}>
        <span className="ed-label"><Box size={14} /> character</span><span className="ed-studio-invite-title">3d model</span>
        <span className="ed-studio-invite-bottom">open model <ArrowUpRight size={22} /></span>
      </button>
    </div>
    {expanded && open && <EditorialDialog title={`art by ${expanded.work.artist}`} onClose={() => { hold(); setExpanded(null); }} className="ed-art-dialog">
      <img className="ed-art-full" src={open.motion ?? open.src} alt={`${expanded.work.description} (${open.label})`} width={open.width} height={open.height} />
      <p className="ed-label">{expanded.work.title} / {open.label} / original commission for okiso</p>
    </EditorialDialog>}
  </section>;
}
