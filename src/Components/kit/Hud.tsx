"use client";

import React from "react";

/**
 * Hud primitives for okiso.net
 * Endfield-style technical annotation components generalized from rouge-noir/hud.tsx.
 * Uses shared semantic design tokens (accent/line/ink/surface) to work across any theme scope.
 * 
 * Motion/A11y contract:
 * - CornerFrame, IndexLabel, Meta are decorative HUD annotations (aria-hidden or semantic text).
 * - Ticker continuous marquee automatically pauses under prefers-reduced-motion.
 */

export interface CornerFrameProps {
  className?: string;
  tone?: "accent" | "line";
}

/** Technical corner crosshairs framing a panel. */
export function CornerFrame({ className = "", tone = "accent" }: CornerFrameProps) {
  const borderColor = tone === "accent" ? "border-accent/40" : "border-line-strong/60";
  const pipColor = tone === "accent" ? "bg-accent/60" : "bg-line-strong";

  const c = `absolute h-4 w-4 ${borderColor} pointer-events-none`;
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {/* Outer corner lines */}
      <span className={`${c} left-2 top-2 border-l border-t`} />
      <span className={`${c} right-2 top-2 border-r border-t`} />
      <span className={`${c} bottom-2 left-2 border-b border-l`} />
      <span className={`${c} bottom-2 right-2 border-b border-r`} />
      {/* 2px corner pips */}
      <span className={`absolute left-1 top-1 h-1 w-1 ${pipColor}`} />
      <span className={`absolute right-1 top-1 h-1 w-1 ${pipColor}`} />
      <span className={`absolute bottom-1 left-1 h-1 w-1 ${pipColor}`} />
      <span className={`absolute bottom-1 right-1 h-1 w-1 ${pipColor}`} />
    </div>
  );
}

export interface IndexLabelProps {
  index: string;
  label: string;
  className?: string;
}

/** Section index marker, e.g. "01 — THE LOOP" */
export function IndexLabel({ index, label, className = "" }: IndexLabelProps) {
  return (
    <div
      className={`font-mono flex items-center gap-3 text-step--1 uppercase tracking-[0.35em] ${className}`}
    >
      <span className="text-accent font-semibold">{index}</span>
      <span className="h-px w-8 bg-accent/40" />
      <span className="text-ink-2">{label}</span>
    </div>
  );
}

export interface MetaProps {
  children: React.ReactNode;
  className?: string;
}

/** Monospace technical metadata line (coordinates/specs). */
export function Meta({ children, className = "" }: MetaProps) {
  return (
    <span
      className={`font-mono text-step--1 uppercase tracking-[0.3em] text-ink-2 ${className}`}
    >
      {children}
    </span>
  );
}

export interface TickerProps {
  items: string[];
  reverse?: boolean;
  tone?: "accent" | "accent-2" | "ghost" | "crimson" | "gold";
  className?: string;
}

/** Continuous marquee ticker strip. Pauses under reduced motion via CSS. */
export function Ticker({
  items,
  reverse = false,
  tone = "accent",
  className = "",
}: TickerProps) {
  const isAccent2 = tone === "accent-2" || tone === "gold";
  const isGhost = tone === "ghost";

  const bgClasses = isGhost
    ? "bg-transparent text-ink-2 border-y border-line"
    : isAccent2
    ? "bg-accent-2 text-surface-0 font-bold"
    : "bg-accent text-accent-ink font-bold";

  const animationClass = reverse
    ? "animate-marquee-reverse motion-reduce:animate-none"
    : "animate-marquee motion-reduce:animate-none";

  const loop = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative flex w-full overflow-hidden py-3 ${bgClasses} ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex shrink-0 items-center gap-8 whitespace-nowrap pl-8 ${animationClass}`}
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 text-step-0 font-mono uppercase tracking-[0.25em]"
          >
            {item}
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-current opacity-70" />
          </span>
        ))}
      </div>
    </div>
  );
}
