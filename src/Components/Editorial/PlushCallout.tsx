"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { plush, plushPhase, type PlushPhase } from "@/data/plush";

const detail: Record<PlushPhase | "neutral", { card: string; inline: string }> = {
  neutral: { card: "pre-order on gimme swag", inline: "pre-order" },
  soon: { card: "pre-orders open wed nov 18 · 10:30 pm jst", inline: "opens nov 18" },
  open: { card: `pre-orders are open · ${plush.price} · until dec 18`, inline: "pre-order now" },
  closed: { card: "", inline: "" },
};

/** Points to /plush while the campaign runs. Phase-neutral in the export, then follows the visitor's clock. */
export default function PlushCallout({ variant }: { variant: "card" | "inline" }) {
  const [phase, setPhase] = useState<PlushPhase | "neutral">("neutral");
  useEffect(() => setPhase(plushPhase(Date.now())), []);
  if (phase === "closed") return null;
  if (variant === "inline") return <Link href="/plush" className="ed-plush-inline">okiso plushie · {detail[phase].inline} <ArrowUpRight size={14} aria-hidden="true" /></Link>;
  return <Link href="/plush" className="ed-plush-callout">
    <img src="/plush/plush-takoling-160.webp" alt="" width="80" height="80" />
    <span><strong>okiso plushie</strong><small>{detail[phase].card}</small></span>
    <ArrowUpRight size={18} aria-hidden="true" />
  </Link>;
}
