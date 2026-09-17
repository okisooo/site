"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Box, Expand, ChevronLeft, ChevronRight } from "lucide-react";
import { commissionArt } from "@/data/commissionArt";
import { galleryWorks } from "@/data/gallery";
import { EditorialDialog } from "./EditorialDialog";

export default function ArtRoom({ onOpenModel }: { onOpenModel: () => void }) {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const art = commissionArt[selected];
  const change = (direction: number) => setSelected((index) => (index + direction + commissionArt.length) % commissionArt.length);

  return <section id="art-room" className="ed-section ed-art-room">
    <header className="ed-section-heading"><div><h2>art commissions</h2></div><span className="ed-art-count">{String(selected + 1).padStart(2, "0")}<small> / {String(commissionArt.length).padStart(2, "0")}</small></span></header>
    <div className="ed-art-room-layout">
      <figure className={`ed-art-sheet ed-art-sheet-${art.id}`}>
        <div className="ed-art-sheet-bar"><span className="ed-label">illustration by {art.artist}</span><Expand size={16} aria-hidden="true" /></div>
        <button className="ed-art-image-button" onClick={() => setExpanded(true)} aria-label={`View full illustration by ${art.artist}`}>
          <img key={art.id} src={art.src} srcSet={`${art.small} ${art.id === '7mmchan' ? 256 : 640}w, ${art.src} ${art.width}w`} sizes="(max-width: 700px) 90vw, 52vw" alt={art.description} width={art.width} height={art.height} loading="lazy" decoding="async" />
          <span className="ed-art-expand"><Expand size={16} /> view artwork</span>
        </button>
        <figcaption><span>{art.title}</span><span className="ed-label">art by {art.artist}</span></figcaption>
      </figure>
      <div className="ed-art-room-side">
        <div className="ed-art-intro"><span className="ed-label">artists</span></div>
        <div className="ed-art-artists" role="group" aria-label="Choose an illustrator">{commissionArt.map((item, index) => <button key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>
          <img src={item.small} alt="" width="52" height="52" loading="lazy" decoding="async" /><span><strong>{item.artist}</strong><small>{item.id === 'sobu' ? 'sketch combo' : 'skeb commission'}</small></span><ArrowUpRight size={18} />
        </button>)}</div>
        <div className="ed-art-pagination"><button className="ed-icon-button" aria-label="Previous illustration" onClick={() => change(-1)}><ChevronLeft size={18} /></button><span className="ed-label" role="status">viewing art by {art.artist}</span><button className="ed-icon-button" aria-label="Next illustration" onClick={() => change(1)}><ChevronRight size={18} /></button></div>
        <button className="ed-studio-invite" onClick={onOpenModel}>
          <span className="ed-label"><Box size={14} /> character</span><span className="ed-studio-invite-title">3d model</span>
          <span className="ed-studio-invite-bottom">open model <ArrowUpRight size={22} /></span>
        </button>
      </div>
    </div>
    <Link href="/gallery" className="ed-gallery-invite"><span><small className="ed-label">{galleryWorks.length} commissions</small><strong>gallery</strong></span><span className="ed-text-link">view all <ArrowUpRight size={19} /></span></Link>
    {expanded && <EditorialDialog title={`art by ${art.artist}`} onClose={() => setExpanded(false)} className="ed-art-dialog">
      <img className="ed-art-full" src={art.src} alt={art.description} width={art.width} height={art.height} /><p className="ed-label">{art.title} / original commission for okiso</p>
    </EditorialDialog>}
  </section>;
}
