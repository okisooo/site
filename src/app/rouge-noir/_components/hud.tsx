"use client";

import React from "react";

/** Endfield-style corner crosshairs framing a panel. */
export function CornerFrame({ className = "" }: { className?: string }) {
  const c =
    "absolute h-3.5 w-3.5 border-[rgba(201,162,39,0.4)] pointer-events-none";
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {/* Engraved brass corner hairlines */}
      <span className={`${c} left-1.5 top-1.5 border-l border-t`} />
      <span className={`${c} right-1.5 top-1.5 border-r border-t`} />
      <span className={`${c} bottom-1.5 left-1.5 border-b border-l`} />
      <span className={`${c} bottom-1.5 right-1.5 border-b border-r`} />
      {/* Brass corner pips */}
      <span className="absolute left-1 top-1 h-1 w-1 bg-[rgba(201,162,39,0.7)]" />
      <span className="absolute right-1 top-1 h-1 w-1 bg-[rgba(201,162,39,0.7)]" />
      <span className="absolute bottom-1 left-1 h-1 w-1 bg-[rgba(201,162,39,0.7)]" />
      <span className="absolute bottom-1 right-1 h-1 w-1 bg-[rgba(201,162,39,0.7)]" />
    </div>
  );
}

/** Section index marker, e.g. 01 — THE LOOP */
export function IndexLabel({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`rn-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] ${className}`}
    >
      <span className="text-[var(--rn-brass)] font-bold">{index}</span>
      <span className="h-px w-8 bg-[rgba(201,162,39,0.35)]" />
      <span className="text-[var(--rn-ivory-dim)]">{label}</span>
    </div>
  );
}

/** Thin engraved plate metadata line (coordinates / specs). */
export function Meta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rn-mono text-[10px] uppercase tracking-[0.3em] text-[var(--rn-ivory-dim)] ${className}`}>
      {children}
    </span>
  );
}

/** Continuous marquee ticker strip. Pauses under reduced motion (CSS). */
export function Ticker({
  items,
  reverse = false,
  tone = "crimson",
}: {
  items: string[];
  reverse?: boolean;
  tone?: "crimson" | "gold" | "ghost";
}) {
  const bg =
    tone === "crimson"
      ? "bg-[var(--rn-oxblood)] text-[var(--rn-ivory)] border-y border-[rgba(142,27,43,0.3)]"
      : tone === "gold"
        ? "bg-[var(--rn-brass)] text-[var(--rn-ink)] border-y border-[rgba(232,208,138,0.4)]"
        : "bg-transparent text-[var(--rn-ivory-dim)] border-y border-[rgba(201,162,39,0.15)]";
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className={`relative flex w-full overflow-hidden py-3 ${bg}`} aria-hidden>
      <div className={`rn-ticker flex shrink-0 items-center gap-8 whitespace-nowrap pl-8 ${reverse ? "rn-ticker-rev" : ""}`}>
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.3em]">
            {t}
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-current opacity-70" />
          </span>
        ))}
      </div>
    </div>
  );
}
