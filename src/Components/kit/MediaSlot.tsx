"use client";

import React from "react";
import { CornerFrame } from "./Hud";

/**
 * MediaSlot primitive for okiso.net
 * Dashed art-slot placeholder with HUD corner frame and play glyph.
 * Accepts children to replace the placeholder when media is loaded.
 * 
 * Motion/A11y contract:
 * - Play control maintains visible focus-visible ring.
 * - Provides fallback labels for screen readers.
 */
export interface MediaSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: "16/9" | "4/3" | "1/1" | "21/9" | string;
  label?: string;
  note?: string;
  children?: React.ReactNode;
  className?: string;
  onPlay?: () => void;
}

const ratioClasses: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
};

export function MediaSlot({
  ratio = "16/9",
  label = "MEDIA SLOT",
  note = "CLICK TO INITIALIZE PLAYBACK",
  children,
  className = "",
  onPlay,
  ...props
}: MediaSlotProps) {
  const aspectClass = ratioClasses[ratio] || "";
  const customAspectStyle = !ratioClasses[ratio] ? { aspectRatio: ratio } : undefined;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-card border-2 border-dashed border-line-strong bg-surface-1/50 ${aspectClass} ${className}`}
      style={customAspectStyle}
      {...props}
    >
      <CornerFrame tone="accent" />
      {children ? (
        <div className="relative h-full w-full">{children}</div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
          {onPlay ? (
            <button
              type="button"
              onClick={onPlay}
              aria-label={`Play ${label}`}
              className="group mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-accent text-accent-ink transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
            >
              <svg
                className="h-6 w-6 translate-x-0.5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          ) : (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-pill border border-line-strong bg-surface-2 text-accent">
              <svg
                className="h-6 w-6 translate-x-0.5 fill-current opacity-80"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          <span className="font-mono text-step-0 uppercase tracking-wider text-ink-1 font-semibold">
            {label}
          </span>
          {note && (
            <span className="mt-1 font-mono text-step--1 uppercase tracking-widest text-ink-3">
              {note}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MediaSlot;
