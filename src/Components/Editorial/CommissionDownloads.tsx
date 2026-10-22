"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "./commission-downloads.css";

import { groupDownloads, type DownloadAsset } from "@/lib/commissionDownloads";

const DEFAULT_API = process.env.NEXT_PUBLIC_COMMISSION_DOWNLOADS_API || "https://api.okiso.net/api/commission-downloads";
const artworks = (n: number) => `${n} ${n === 1 ? "artwork" : "artworks"}`;
// A plain lazy <img>: the browser fetches each full-size preview only as its card nears the screen.
function Thumbnail({ asset, api }: { asset: DownloadAsset; api: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  if (!asset.hasPreview || state === "failed") return <div className="cd-placeholder">{asset.hasPreview ? "preview unavailable" : "no thumbnail"}</div>;
  return <><img src={`${api}/assets/${asset.id}/preview`} alt={`artwork by ${asset.artist}`} width="480" height="480" loading="lazy" decoding="async" onLoad={() => setState("loaded")} onError={() => setState("failed")} />
    {state === "loading" && <span className="cd-loading ed-label" aria-hidden="true">loading preview…</span>}</>;
}
export default function CommissionDownloads({ apiBase = DEFAULT_API }: { apiBase?: string }) {
  const api = apiBase.replace(/\/$/, "");
  const [assets, setAssets] = useState<DownloadAsset[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(api, { credentials: "same-origin", cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error(String(response.status));
      const body = await response.json(); setAssets(body.assets); setStatus("ready");
    }).catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, [api, attempt]);
  const groups = groupDownloads(assets);
  const artists = [...new Set(assets.map(asset => asset.artist))].sort((a, b) => a.localeCompare(b));
  return <div className="ed-page commission-downloads">
    <header className="ed-page-heading ed-gallery-heading"><div><h1>commission previews</h1><p>commissioned artwork, organized by artist.</p><Link className="ed-text-link" href="/gallery">back to the gallery <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      {/* The count keeps its place while the list loads, so nothing below it moves; a failed load drops it. */}
      {status !== "error" && <div className="ed-gallery-count" style={{ visibility: groups.length ? "visible" : "hidden" }} aria-hidden={!groups.length}><strong>{groups.length || "00"}</strong><span className="ed-label">artworks</span></div>}</header>
    <p className="cd-rights">you can view the artwork here. original files and PSDs stay private.</p>
    {status === "loading" && <p className="ed-label cd-status" role="status">loading previews…</p>}
    {status === "error" && <div className="ed-empty cd-error" role="alert"><h2>couldn’t load the previews</h2><p>the preview server didn’t answer. check your connection, then try again.</p><button className="ed-button" onClick={() => { setStatus("loading"); setAttempt(attempt + 1); }}>try again</button></div>}
    {!!assets.length && <><nav aria-label="Artists" className="cd-artists">{artists.map((artist, index) => <a key={artist} href={`#artist-${index}`}>{artist}</a>)}<span className="ed-label">{artworks(groups.length)}</span></nav>
      {artists.map((artist, index) => <section key={artist} id={`artist-${index}`} className="cd-section"><h2>{artist}<span className="ed-label">{artworks(groups.filter(group => group.artist === artist).length)}</span></h2>
        <div className="cd-grid">{groups.filter(group => group.artist === artist).map(group => <article key={group.id} className="cd-asset"><div className="ed-gallery-mount"><Thumbnail asset={group.preview} api={api} /></div>
          <div className="cd-file"><span className="ed-label">{group.title}</span>
            {group.source && <a className="ed-text-link" href={group.source} target="_blank" rel="noopener noreferrer" aria-label={`source of ${group.title} by ${artist}`}>source <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div></article>)}</div>
      </section>)}</>}
  </div>;
}
