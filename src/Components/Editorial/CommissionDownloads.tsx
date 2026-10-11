"use client";
import { useEffect, useState } from "react";
import "./commission-downloads.css";

export interface DownloadAsset { id: string; filename: string; format: string; bytes: number; artist: string; source: string; hasPreview: boolean; permissions: Record<string, string>; requestedUses?: string; requestEvidence?: string }
const DEFAULT_API = process.env.NEXT_PUBLIC_COMMISSION_DOWNLOADS_API || "https://api.okiso.net/api/commission-downloads";
function size(bytes: number) { return bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KiB` : `${(bytes / 1048576).toFixed(2)} MiB`; }
function Thumbnail({ asset, api, headers }: { asset: DownloadAsset; api: string; headers: Record<string, string> }) {
  const [url, setUrl] = useState(""), [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!asset.hasPreview) return;
    setFailed(false); let object = ""; const controller = new AbortController();
    void fetch(`${api}/assets/${asset.id}/preview`, { headers, credentials: "same-origin", cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error(); const blob = await response.blob();
      if (controller.signal.aborted) return; object = URL.createObjectURL(blob); setUrl(object);
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => { controller.abort(); if (object) URL.revokeObjectURL(object); };
  }, [asset.id, asset.hasPreview, api, headers]);
  return url ? <img src={url} alt={asset.filename} loading="lazy" /> : <div className="cd-placeholder">{failed ? "Preview unavailable" : asset.hasPreview ? "Loading preview…" : "No thumbnail"}</div>;
}
export default function CommissionDownloads({ apiBase = DEFAULT_API }: { apiBase?: string }) {
  const api = apiBase.replace(/\/$/, "");
  const [assets, setAssets] = useState<DownloadAsset[]>([]), [headers, setHeaders] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("Loading downloads…");
  useEffect(() => {
    const auth: Record<string, string> = {};
    const controller = new AbortController(); setHeaders(auth);
    void fetch(api, { headers: auth, credentials: "same-origin", cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Downloads unavailable. Try again.");
      const body = await response.json(); setAssets(body.assets); setStatus("");
    }).catch(error => { if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : "Downloads unavailable."); });
    return () => controller.abort();
  }, [api]);
  const artists = [...new Set(assets.map(asset => asset.artist))].sort((a, b) => a.localeCompare(b));
  return <div className="ed-page commission-downloads">
    <header className="ed-page-heading ed-gallery-heading"><div><h1>downloads</h1><p>Original commission files, previews and PSDs, organized by artist.</p><a className="ed-text-link" href="/gallery">back to the gallery ↗</a></div><div className="ed-gallery-count"><strong>{assets.length || "—"}</strong><span className="ed-label">original files</span></div></header>
    <p className="cd-rights">For reference. Access does not grant merchandise or redistribution rights; unknown permissions remain unknown.</p>
    {status && <p role="status">{status}</p>}
    {!!assets.length && <><nav aria-label="Artists" className="cd-artists">{artists.map((artist, index) => <a key={artist} href={`#artist-${index}`}>{artist}</a>)}<span>{assets.length} files</span></nav>
      {artists.map((artist, index) => <section key={artist} id={`artist-${index}`} className="cd-section"><h2>{artist}<span>{assets.filter(asset => asset.artist === artist).length} files</span></h2>
        <div className="cd-grid">{assets.filter(asset => asset.artist === artist).map(asset => <article key={asset.id} className="cd-asset"><Thumbnail asset={asset} api={api} headers={headers} />
          <div className="cd-file"><h3>{asset.filename}</h3><p>{asset.format} · {size(asset.bytes)}</p><a className="ed-button" href={`${api}/assets/${asset.id}/original`}>Download {asset.format}</a>
            {asset.source && <a href={asset.source} target="_blank" rel="noopener noreferrer">Artist / source</a>}
            <details><summary>Usage notes</summary><p>Merchandise: {asset.permissions.merchandise || "unknown"}. Sharing originals with a manufacturer: {asset.permissions.manufacturerSharing || "unknown"}.</p><p>{asset.permissions.note || "No confirmed usage rights recorded."}</p>{asset.requestedUses && <p>Requested use: {asset.requestedUses}</p>}{asset.requestEvidence && <p>Evidence to review: {asset.requestEvidence}</p>}</details>
          </div></article>)}</div>
      </section>)}</>}
  </div>;
}
