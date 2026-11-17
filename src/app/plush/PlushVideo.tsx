"use client";

import { useEffect, useState } from "react";
import { plushPhase } from "@/data/plush";

/** Before launch the trailer says "pre-orders open nov 18"; from launch on, the cut that says "open now" plays. */
export default function PlushVideo({ builtAt }: { builtAt: number }) {
  const [now, setNow] = useState(builtAt);
  useEffect(() => setNow(Date.now()), []);
  const live = plushPhase(now) !== "soon";
  const src = live ? "/plush/okiso-plushie-trailer-live.mp4" : "/plush/okiso-plushie-trailer.mp4";
  return <div className="ed-plush-video">
    <video key={src} controls playsInline preload="none" poster={live ? "/plush/trailer-poster-live.webp" : "/plush/trailer-poster.webp"} width={1280} height={720}
      aria-label="OKISO Plushie trailer, set to PRODIGY">
      <source src={src} type="video/mp4" />
    </video>
  </div>;
}
