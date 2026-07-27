"use client";

import React, { useMemo } from "react";

/* Authentic European single-zero pocket order */
const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const r3 = (v: number) => Math.round(v * 1000) / 1000;

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

type Seg = { n: number; path: string; lx: number; ly: number; mid: number; fill: string };

/**
 * Premium roulette wheel. Static gold rim + tick ring, a CSS-spun pocket ring
 * (authentic single-zero layout), a machined inner cone, engraved hub
 * monogram, and an orbiting ball. Pure SVG — no raster assets, no 3D.
 */
export default function RouletteWheel({ className = "" }: { className?: string }) {
  const segments = useMemo<Seg[]>(() => {
    const cx = 200, cy = 200, rOuter = 176, rInner = 126;
    const seg = 360 / WHEEL_ORDER.length;
    return WHEEL_ORDER.map((n, i) => {
      const a0 = i * seg, a1 = (i + 1) * seg, mid = a0 + seg / 2;
      const o0 = polar(cx, cy, rOuter, a0), o1 = polar(cx, cy, rOuter, a1);
      const i1 = polar(cx, cy, rInner, a1), i0 = polar(cx, cy, rInner, a0);
      const path = `M ${o0.x.toFixed(2)} ${o0.y.toFixed(2)} A ${rOuter} ${rOuter} 0 0 1 ${o1.x.toFixed(2)} ${o1.y.toFixed(2)} L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)} A ${rInner} ${rInner} 0 0 0 ${i0.x.toFixed(2)} ${i0.y.toFixed(2)} Z`;
      const lbl = polar(cx, cy, (rOuter + rInner) / 2, mid);
      const fill = n === 0 ? "var(--rn-felt)" : RED.has(n) ? "var(--rn-oxblood)" : "var(--rn-ink)";
      return { n, path, lx: r3(lbl.x), ly: r3(lbl.y), mid: r3(mid), fill };
    });
  }, []);

  const ticks = useMemo(
    () => Array.from({ length: 72 }, (_, i) => r3((360 / 72) * i)),
    [],
  );

  const rosetteCentres = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => {
      const a = (i * 10 * Math.PI) / 180;
      return {
        cx: r3(200 + 58 * Math.cos(a)),
        cy: r3(200 + 58 * Math.sin(a)),
      };
    });
  }, []);

  return (
    <svg
      viewBox="0 0 400 400"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label="European single-zero roulette wheel"
    >
      <defs>
        <radialGradient id="rn-w-rim" cx="0.5" cy="0.42" r="0.6">
          <stop offset="0.7" stopColor="var(--rn-brass-dim)" />
          <stop offset="0.86" stopColor="var(--rn-brass-hi)" />
          <stop offset="0.93" stopColor="var(--rn-brass-dim)" />
          <stop offset="1" stopColor="var(--rn-walnut)" />
        </radialGradient>
        <radialGradient id="rn-w-cone" cx="0.5" cy="0.4" r="0.65">
          <stop offset="0" stopColor="var(--rn-walnut-hi)" />
          <stop offset="0.5" stopColor="var(--rn-walnut)" />
          <stop offset="1" stopColor="#24160E" />
        </radialGradient>
        <clipPath id="rn-w-bowl-clip">
          <circle cx="200" cy="200" r="118" />
        </clipPath>
        <radialGradient id="rn-w-hub" cx="0.5" cy="0.38" r="0.62">
          <stop offset="0" stopColor="var(--rn-brass-hi)" />
          <stop offset="0.7" stopColor="var(--rn-brass)" />
          <stop offset="1" stopColor="var(--rn-brass-dim)" />
        </radialGradient>
        {/* NOTE: deliberately no feDropShadow here. It used to wrap the group
            containing the spinning ring, cone and ball, so the filter re-rendered
            the entire wheel every animation frame — a major scroll-lag source.
            The cast shadow is now a static gradient ellipse painted beneath. */}
        <radialGradient id="rn-w-cast" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#0B0A08" stopOpacity="0.75" />
          <stop offset="1" stopColor="#0B0A08" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="214" rx="205" ry="200" fill="url(#rn-w-cast)" />
      <g>
        {/* brass rim */}
        <circle cx="200" cy="200" r="196" fill="url(#rn-w-rim)" />
        <circle cx="200" cy="200" r="182" fill="var(--rn-ink)" />

        {/* outer tick ring */}
        <g>
          {ticks.map((t, i) => {
            const a = polar(200, 200, 190, t);
            const b = polar(200, 200, i % 6 === 0 ? 183 : 186, t);
            return (
              <line
                key={i}
                x1={r3(a.x)}
                y1={r3(a.y)}
                x2={r3(b.x)}
                y2={r3(b.y)}
                stroke="var(--rn-brass-hi)"
                strokeOpacity={i % 6 === 0 ? 0.8 : 0.35}
                strokeWidth={i % 6 === 0 ? 1.4 : 0.7}
              />
            );
          })}
        </g>

        {/* spinning pocket ring */}
        <g className="rn-wheel-spin" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          {segments.map((s) => (
            <path key={s.n} d={s.path} fill={s.fill} stroke="var(--rn-brass-dim)" strokeWidth="0.5" strokeOpacity="0.7" />
          ))}
          {segments.map((s) => (
            <text
              key={`t${s.n}`}
              x={s.lx}
              y={s.ly}
              fill={s.n === 0 ? "var(--rn-ivory)" : "var(--rn-brass-hi)"}
              fontSize="7.5"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${s.mid} ${s.lx} ${s.ly})`}
            >
              {s.n}
            </text>
          ))}
          <circle cx="200" cy="200" r="126" fill="none" stroke="var(--rn-brass-dim)" strokeWidth="1.5" />
        </g>

        {/* machined inner cone */}
        <circle cx="200" cy="200" r="122" fill="url(#rn-w-cone)" />
        <g clipPath="url(#rn-w-bowl-clip)" pointerEvents="none">
          {rosetteCentres.map((c, i) => (
            <circle
              key={`rc-${i}`}
              cx={c.cx}
              cy={c.cy}
              r="46"
              fill="none"
              stroke="var(--rn-brass-hi)"
              strokeWidth="0.4"
              strokeOpacity="0.14"
            />
          ))}
          {[66, 76, 86, 96, 106, 116].map((r) => (
            <circle
              key={`rr-${r}`}
              cx="200"
              cy="200"
              r={r}
              fill="none"
              stroke="var(--rn-brass-hi)"
              strokeWidth="0.4"
              strokeOpacity="0.14"
            />
          ))}
        </g>
        <g className="rn-cone-spin" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = polar(200, 200, 118, (360 / 8) * i);
            return (
              <path
                key={i}
                d={`M 200 200 L ${r3(a.x)} ${r3(a.y)}`}
                stroke="var(--rn-walnut-hi)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* orbiting ball */}
        {/* transform-box MUST be view-box here, not fill-box. fill-box resolves
            `center` against the element's OWN bbox — for the ball that is a 13px
            circle, so rotation spun it in place and the orbit was invisible.
            The spinning ring and cone get away with fill-box only because their
            bounding boxes happen to be centred on the wheel centre already. */}
        <g className="rn-ball-ride" style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}>
          <g className="rn-ball-orbit" style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}>
            <g className="rn-ball-drop" style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}>
              <circle cx="200" cy="34" r="6.5" fill="var(--rn-ivory)" stroke="var(--rn-ivory-dim)" strokeWidth="1" />
              <circle cx="197.6" cy="31.6" r="2" fill="var(--rn-ivory)" />
            </g>
          </g>
        </g>

        {/* hub + engraved monogram */}
        <circle cx="200" cy="200" r="58" fill="url(#rn-w-hub)" />
        <circle cx="200" cy="200" r="58" fill="none" stroke="var(--rn-ink)" strokeWidth="2.5" />
        <circle cx="200" cy="200" r="44" fill="var(--rn-ink)" />
        <text
          x="200"
          y="202"
          fill="var(--rn-brass-hi)"
          fontSize="24"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="central"
          letterSpacing="-1"
        >
          R&amp;N
        </text>
      </g>

      {/* fixed marker with pixel tip */}
      <path d="M200 2 l 8 15 l -16 0 Z" fill="var(--rn-oxblood)" stroke="var(--rn-brass-hi)" strokeWidth="1" />
      {/* pixel accent pips at compass cardinal points */}
      <rect x="198" y="10" width="4" height="4" fill="var(--rn-brass-hi)" />
      <rect x="198" y="386" width="4" height="4" fill="var(--rn-brass-hi)" />
      <rect x="10" y="198" width="4" height="4" fill="var(--rn-brass-hi)" />
      <rect x="386" y="198" width="4" height="4" fill="var(--rn-brass-hi)" />
    </svg>
  );
}
