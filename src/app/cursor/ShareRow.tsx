"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";

const URL = "https://okiso.net/cursor";
const TEXT = "free animated okiso cursor set, drawn by @katekoteko ✦";

export default function ShareRow() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(URL); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked: the link stays visible */ }
  };
  return <div className="ed-cursors-share" role="group" aria-label="Share this cursor set">
    <span className="ed-label">share</span>
    <button type="button" onClick={copy} aria-live="polite">{copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}{copied ? "copied" : "okiso.net/cursor"}</button>
    <a href={`https://x.com/intent/post?text=${encodeURIComponent(TEXT)}&url=${encodeURIComponent(URL)}`} target="_blank" rel="noopener noreferrer" aria-label="Post on X"><FaXTwitter size={14} aria-hidden="true" /></a>
    <a href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${TEXT.replace("@katekoteko", "@katekoteko.bsky.social")} ${URL}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Post on Bluesky"><FaBluesky size={14} aria-hidden="true" /></a>
  </div>;
}
