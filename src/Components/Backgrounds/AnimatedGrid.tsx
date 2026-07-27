import { useId } from "react";

/**
 * Site-wide animated grid background.
 *
 * The static `GridPattern` look (40x40 cells, hairline stroke), but drifting
 * diagonally with density fading in and out in waves.
 *
 * Deliberately a server component with no props and no state: the entire
 * animation is CSS keyframes over static markup. There is no rAF loop, no
 * scroll listener, and nothing for React to re-render.
 *
 * The "waves" are NOT hundreds of individually animated cells — that would be
 * ruinous. Three copies of one pattern, offset by half a tile and pulsing
 * `opacity` out of phase, read as shifting density while costing only
 * compositor work. See docs/HANDOFF.md for why this page animates transform
 * and opacity exclusively.
 */
export default function AnimatedGrid() {
  const id = useId();

  return (
    <div className="okiso-grid-bg" aria-hidden="true">
      <div className="okiso-grid-drift">
        <svg className="okiso-grid-svg">
          <defs>
            <pattern id={id} width={40} height={40} patternUnits="userSpaceOnUse">
              <path d="M.5 40V.5H40" fill="none" />
            </pattern>
          </defs>

          {/* Base — never animates, so the grid still reads as intentional
              when motion is reduced or a pulse is at its trough. */}
          <rect className="okiso-grid-base" width="100%" height="100%" fill={`url(#${id})`} />

          {/* Two half-tile-offset copies pulsing out of phase. */}
          <g transform="translate(20 20)">
            <rect className="okiso-grid-pulse-a" width="100%" height="100%" fill={`url(#${id})`} />
          </g>
          <g transform="translate(20 0)">
            <rect className="okiso-grid-pulse-b" width="100%" height="100%" fill={`url(#${id})`} />
          </g>
        </svg>
      </div>
    </div>
  );
}
