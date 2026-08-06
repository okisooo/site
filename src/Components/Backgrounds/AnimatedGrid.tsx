"use client";

import { useId } from "react";

/**
 * Tactical Abstract Animated Background (Site-wide)
 * Inspired by Arknights Endfield / ZZZ HUD UI collage.
 *
 * Features:
 * - Multi-scale 96px/24px drafting grid with major intersection crosshairs (+)
 * - Slow-spinning concentric SVG sonar/radar measurement rings on opposite corners
 * - Sliding telemetry ruler indices & coordinate annotations
 * - Hardware-accelerated (transform & opacity only, 0 repaint overhead)
 * - Seamless light & dark mode adaptation via CSS custom properties
 */
export default function AnimatedGrid() {
  const patternId = useId();
  const dotsId = useId();

  return (
    <div
      data-okiso-chrome="background"
      className="fixed inset-0 z-0 pointer-events-none contain-strict overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Substrate Drafting Paper Grid ── */}
      <div className="absolute inset-[-40px] okiso-grid-drift opacity-70 dark:opacity-40">
        <svg className="w-full h-full">
          <defs>
            {/* Major 96px Drafting Grid */}
            <pattern id={patternId} width={96} height={96} patternUnits="userSpaceOnUse">
              <path
                d="M 96 0 L 0 0 0 96"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-black/10 dark:text-white/10"
              />
              {/* Corner crosshair at (0,0) */}
              <path
                d="M -4 0 L 4 0 M 0 -4 L 0 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-black/25 dark:text-white/25"
              />
              {/* Midpoint crosshair at (48,48) */}
              <path
                d="M 44 48 L 52 48 M 48 44 L 48 52"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                className="text-black/15 dark:text-white/15"
              />
            </pattern>

            {/* Minor 24px Dot Sub-Grid */}
            <pattern id={dotsId} width={24} height={24} patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.75" className="fill-black/15 dark:fill-white/15" />
            </pattern>
          </defs>

          {/* Base Grid Layer */}
          <rect width="100%" height="100%" fill={`url(#${dotsId})`} />
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>

      {/* ── Rotating Sonar Radar Rings (Top Right & Bottom Left) ── */}
      <div className="tac-amb tac-amb-1 opacity-25 dark:opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
          {/* Top-Right Radar Ring Group */}
          <g className="tac-spin-ring" style={{ transformOrigin: "1280px 200px" }}>
            <circle cx="1280" cy="200" r="320" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="text-black/20 dark:text-white/20" />
            <circle cx="1280" cy="200" r="240" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="160 40 80 40" className="text-black/30 dark:text-white/30" />
            <circle cx="1280" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" className="text-[#e6112b]" />
            <line x1="1280" y1="-120" x2="1280" y2="520" stroke="currentColor" strokeWidth="0.75" className="text-black/15 dark:text-white/15" />
            <line x1="960" y1="200" x2="1600" y2="200" stroke="currentColor" strokeWidth="0.75" className="text-black/15 dark:text-white/15" />
          </g>

          {/* Bottom-Left Radar Ring Group */}
          <g className="tac-spin-ring-rev" style={{ transformOrigin: "160px 800px" }}>
            <circle cx="160" cy="800" r="280" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 12" className="text-black/20 dark:text-white/20" />
            <circle cx="160" cy="800" r="190" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="120 30 40 30" className="text-black/30 dark:text-white/30" />
            <circle cx="160" cy="800" r="100" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#e6112b]" />
            <line x1="160" y1="520" x2="160" y2="1080" stroke="currentColor" strokeWidth="0.75" className="text-black/15 dark:text-white/15" />
            <line x1="-120" y1="800" x2="440" y2="800" stroke="currentColor" strokeWidth="0.75" className="text-black/15 dark:text-white/15" />
          </g>
        </svg>
      </div>

      {/* ── Telemetry & Axis Measurements ── */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-30 dark:opacity-40 tac-mono text-[9px] tracking-[0.25em] text-[#74747e] dark:text-[#6e6e78] uppercase">
        {/* Top Telemetry Rail */}
        <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-2">
          <span>LOC // 35.6895°N 139.6917°E</span>
          <span className="hidden sm:inline">SYS.RADAR_GRID // ACTIVE</span>
          <span className="text-[#e6112b] font-bold">● ONLINE</span>
        </div>

        {/* Center Lateral Measurement Bar */}
        <div className="relative w-full h-[1px] bg-black/10 dark:bg-white/10 my-auto">
          <div className="tac-ruler-head absolute -top-[3px] left-0 w-3 h-2 bg-[#e6112b]" />
        </div>

        {/* Bottom Telemetry Rail */}
        <div className="flex justify-between items-center border-t border-black/10 dark:border-white/10 pt-2">
          <span>CH.01 // OKISO_STATION</span>
          <span className="hidden sm:inline">FREQ: 5.8GHZ // SUBSTRATE</span>
          <span>BANDWIDTH: 100%</span>
        </div>
      </div>
    </div>
  );
}
