"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";
import { plush } from "@/data/plush";

const SHORT = `https://${plush.short}`;
const TEXT = "the okiso plushie only gets made if 100 people pre-order it ✦";

export default function PlushShare() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(SHORT); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked: the link stays visible */ }
  };
  return <aside className="ed-plush-share" aria-labelledby="plush-share">
    <div>
      <h2 id="plush-share" className="ed-label">help it reach 100</h2>
      <strong>every share counts</strong>
      <p>send it to someone who needs a tiny okiso on their desk.</p>
    </div>
    <div className="ed-plush-share-row" role="group" aria-label="Share the plushie">
      <button type="button" onClick={copy} aria-live="polite">{copied ? <Check size={15} aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}{copied ? "copied" : plush.short}</button>
      <a href={`https://x.com/intent/post?text=${encodeURIComponent(TEXT)}&url=${encodeURIComponent(plush.url)}`} target="_blank" rel="noopener noreferrer" aria-label="Post on X"><FaXTwitter size={15} aria-hidden="true" /></a>
      <a href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${TEXT} ${plush.url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Post on Bluesky"><FaBluesky size={15} aria-hidden="true" /></a>
    </div>
  </aside>;
}
