"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import Link from "next/link";
import { ArrowUpRight, Box, Expand, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { galleryWorks, type GalleryVariant, type GalleryWork } from "@/data/gallery";
import { EditorialDialog } from "./EditorialDialog";
import { useAmbientVisibility } from "./AmbientMotion";

// Newest first, straight from the gallery catalog, so every new commission lands here too.
const works = galleryWorks;
const pieces = works.flatMap((work) => work.variants.map((variant, version) => ({ work, variant, version })));
// Deal the reel round-robin so one artist's versions don't run back to back.
const reel = [...pieces].sort((a, b) => a.version - b.version);
const pad = (value: number) => String(value).padStart(2, "0");
// Auto-tour every version, then the next commission; a manual pick holds its view longer.
const AUTO_MS = 3000, HOLD_MS = 10000;
const SHEET_SIZES = "(max-width: 700px) 90vw, 52vw";
const sheetSrcSet = (art: GalleryVariant) => art.small && !art.motion ? `${art.small} 480w, ${art.src} ${art.width}w` : undefined;
// Load and decode with the sheet's own srcset choice, so the swap is instant.
function decodeArt(art: GalleryVariant) {
  const image = new Image();
  const srcSet = sheetSrcSet(art);
  if (srcSet) { image.sizes = SHEET_SIZES; image.srcset = srcSet; }
  image.src = art.src;
  return image.decode().catch(() => undefined);
}

function Reel({ onOpen }: { onOpen: (work: GalleryWork, version: number) => void }) {
  const { ref, active } = useAmbientVisibility();
  // The second pass makes the loop seamless; only the first is reachable by keyboard and screen readers.
  return <div ref={ref} className="ed-art-reel" data-active={active} role="group" aria-label={`All ${pieces.length} commissioned pieces`}>
    <div className="ed-art-reel-track">
      {[0, 1].map((pass) => reel.map(({ work, variant, version }) => <button key={`${pass}-${variant.src}`} className="ed-art-reel-print" onClick={() => onOpen(work, version)}
        aria-hidden={pass === 1 || undefined} tabIndex={pass === 1 ? -1 : undefined} aria-label={pass === 1 ? undefined : `${work.title}, ${variant.label}, by ${work.artist}`}>
        <img src={variant.small ?? variant.src} alt="" width={variant.width} height={variant.height} loading="lazy" decoding="async" />
        <span><span>{work.artist}</span><span>{variant.label}</span></span>
      </button>))}
    </div>
  </div>;
}

function SheetImage({ work, art, onExpand }: { work: GalleryWork; art: GalleryVariant; onExpand: () => void }) {
  const { ref, active } = useAmbientVisibility();
  return <button ref={ref as unknown as Ref<HTMLButtonElement>} className="ed-art-image-button" onClick={onExpand} aria-label={`View ${art.label} by ${work.artist}`}>
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
  const { ref: roomRef, active } = useAmbientVisibility();
  const versionsRef = useRef<HTMLDivElement>(null);
  const work = works[selected];
  const art = work.variants[version] ?? work.variants[0];
  const choose = (index: number) => { setSelected(index); setVersion(0); };
  const hold = () => setHoldUntil(Date.now() + HOLD_MS);
  const pick = (index: number) => { hold(); choose(index); };
  const change = (direction: number) => pick((selected + direction + works.length) % works.length);
  const touring = active && !expanded && !hovering;
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
    // Keep the current version chip in view without scrolling the page.
    const row = versionsRef.current, chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [selected, version]);
  const open = expanded && (expanded.work.variants[expanded.version] ?? expanded.work.variants[0]);

  return <section id="art-room" className="ed-section ed-art-room">
    <header className="ed-section-heading"><div><h2>art commissions</h2></div><span className="ed-art-count">{pad(works.length)}<small> commissions / {pad(pieces.length)} pieces</small></span></header>
    <Reel onOpen={(item, index) => setExpanded({ work: item, version: index })} />
    <div ref={roomRef} className="ed-art-room-layout">
      <figure className={`ed-art-sheet ed-art-sheet-${work.id}`} onPointerEnter={(event) => event.pointerType === "mouse" && setHovering(true)} onPointerLeave={() => setHovering(false)}>
        <div className="ed-art-sheet-bar"><span className="ed-label">{work.medium} by {work.artist}</span>{work.workUrl ? <a className="ed-text-link ed-art-source" href={work.workUrl} target="_blank" rel="noopener noreferrer">skeb <ArrowUpRight size={14} /></a> : <Expand size={16} aria-hidden="true" />}
          {touring && <span key={`${selected}-${version}-${holdUntil}`} className="ed-art-timer" style={{ animationDuration: `${wait}ms` }} aria-hidden="true" />}</div>
        <SheetImage work={work} art={art} onExpand={() => { hold(); setExpanded({ work, version }); }} />
        {work.variants.length > 1 && <div ref={versionsRef} className="ed-art-versions" role="group" aria-label={`Versions of ${work.title}`}>
          {work.variants.map((item, index) => <button key={item.src} aria-pressed={index === version} onClick={() => { hold(); setVersion(index); }}>
            <img src={item.small ?? item.src} alt="" width="44" height="44" loading="lazy" decoding="async" /><span>{item.label}</span>
          </button>)}
        </div>}
        <figcaption><span>{work.title}</span><span className="ed-label">{work.variants.length > 1 ? `${work.variants.length} versions · ` : ""}art by {work.artist}</span></figcaption>
      </figure>
      <div className="ed-art-room-side">
        <div className="ed-art-intro"><span className="ed-label">every commission</span><span className="ed-label">{pad(selected + 1)} / {pad(works.length)}</span></div>
        <div className="ed-art-artists" role="group" aria-label="Choose a commission">{works.map((item, index) => <button key={item.id} aria-pressed={selected === index} onClick={() => pick(index)}>
          <img src={item.small} alt="" width="96" height="96" loading="lazy" decoding="async" />
          <span><strong>{item.artist}</strong><small>{item.variants.some((variant) => variant.motion) ? <><Play size={9} /> animated</> : item.variants.length > 1 ? `${item.variants.length} versions` : item.title}</small></span>
        </button>)}</div>
        <div className="ed-art-pagination"><button className="ed-icon-button" aria-label="Previous commission" onClick={() => change(-1)}><ChevronLeft size={18} /></button><span className="ed-label">viewing art by {work.artist}</span><button className="ed-icon-button" aria-label="Next commission" onClick={() => change(1)}><ChevronRight size={18} /></button></div>
        <button className="ed-studio-invite" onClick={onOpenModel}>
          <span className="ed-label"><Box size={14} /> character</span><span className="ed-studio-invite-title">3d model</span>
          <span className="ed-studio-invite-bottom">open model <ArrowUpRight size={22} /></span>
        </button>
      </div>
    </div>
    <Link href="/gallery" className="ed-gallery-invite"><span><small className="ed-label">{works.length} commissions · {pieces.length} pieces</small><strong>gallery</strong></span><span className="ed-text-link">view all <ArrowUpRight size={19} /></span></Link>
    {expanded && open && <EditorialDialog title={`art by ${expanded.work.artist}`} onClose={() => { hold(); setExpanded(null); }} className="ed-art-dialog">
      <img className="ed-art-full" src={open.motion ?? open.src} alt={`${expanded.work.description} (${open.label})`} width={open.width} height={open.height} />
      <p className="ed-label">{expanded.work.title} / {open.label} / original commission for okiso</p>
    </EditorialDialog>}
  </section>;
}
