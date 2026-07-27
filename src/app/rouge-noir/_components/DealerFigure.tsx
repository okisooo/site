"use client";

import React from "react";

/**
 * Dealer showcase placeholder — Endfield-style "operator" figure.
 * Encodes the LOCKED identity so a real render can drop straight in:
 * split crimson/black drill twintails, red eyes, pointed ears, fang, black
 * suit, white shirt, red bowtie. Deliberately a stylized crest (not a full
 * illustration) so it reads as an intentional art slot, not final art.
 */
export default function DealerFigure({ mood }: { mood: "rouge" | "noir" }) {
  const key = mood === "rouge" ? "#8E1B2B" : "#C9A227";
  const glow = mood === "rouge" ? "#5B1220" : "#7A6318";
  return (
    <svg
      viewBox="0 0 420 620"
      /* no CSS drop-shadow: this SVG is opacity/transform-animated by the
         dealer pin, and a filter forces a full re-render each frame. The floor
         pool gradient below already reads as a cast shadow. */
      className="h-full w-full"
      role="img"
      aria-label={`Rouge & Noir dealer — ${mood} mood (procedural artwork, final illustration pending)`}
      data-art-slot={`dealer-${mood}`}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={`d-suit-${mood}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B2417" />
          <stop offset="0.5" stopColor="#1C140F" />
          <stop offset="1" stopColor="#0B0A08" />
        </linearGradient>
        <radialGradient id={`d-halo-${mood}`} cx="0.5" cy="0.32" r="0.55">
          <stop offset="0" stopColor={key} stopOpacity="0.45" />
          <stop offset="0.6" stopColor={glow} stopOpacity="0.15" />
          <stop offset="1" stopColor={key} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`d-floor-${mood}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={key} stopOpacity="0.4" />
          <stop offset="1" stopColor={key} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`d-hair-rouge-${mood}`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#8E1B2B" />
          <stop offset="0.4" stopColor="#5B1220" />
          <stop offset="1" stopColor="#3B2417" />
        </linearGradient>
        <linearGradient id={`d-hair-noir-${mood}`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#5A3A24" />
          <stop offset="0.5" stopColor="#3B2417" />
          <stop offset="1" stopColor="#0B0A08" />
        </linearGradient>
      </defs>

      {/* backlight halo + floor pool */}
      <rect x="20" y="10" width="380" height="380" fill={`url(#d-halo-${mood})`} />
      <ellipse cx="210" cy="595" rx="160" ry="24" fill={`url(#d-floor-${mood})`} />

      {/* TWINTAILS — LEFT OXBLOOD DRILLS */}
      <g id="left-drills">
        {/* Outer silhouette flare */}
        <path d="M 145 140 C 60 150 40 260 85 360 C 105 400 125 430 115 470 C 105 500 80 520 70 540 C 95 530 120 490 135 440 C 155 375 130 290 160 210 Z" fill={`url(#d-hair-rouge-${mood})`} />
        {/* Spiral drill segments */}
        {[
          { cx: 125, cy: 190, rx: 36, ry: 18, rot: -20 },
          { cx: 105, cy: 245, rx: 34, ry: 17, rot: -15 },
          { cx: 95, cy: 305, rx: 30, ry: 15, rot: -10 },
          { cx: 90, cy: 365, rx: 26, ry: 13, rot: -5 },
          { cx: 95, cy: 420, rx: 22, ry: 11, rot: 5 },
          { cx: 102, cy: 470, rx: 16, ry: 8, rot: 15 },
        ].map((s, i) => (
          <ellipse
            key={`ld${i}`}
            cx={s.cx}
            cy={s.cy}
            rx={s.rx}
            ry={s.ry}
            transform={`rotate(${s.rot} ${s.cx} ${s.cy})`}
            fill={`url(#d-hair-rouge-${mood})`}
            stroke="#8E1B2B"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        ))}
      </g>

      {/* TWINTAILS — RIGHT WALNUT/INK DRILLS */}
      <g id="right-drills">
        {/* Outer silhouette flare */}
        <path d="M 275 140 C 360 150 380 260 335 360 C 315 400 295 430 305 470 C 315 500 340 520 350 540 C 325 530 300 490 285 440 C 265 375 290 290 260 210 Z" fill={`url(#d-hair-noir-${mood})`} />
        {/* Spiral drill segments */}
        {[
          { cx: 295, cy: 190, rx: 36, ry: 18, rot: 20 },
          { cx: 315, cy: 245, rx: 34, ry: 17, rot: 15 },
          { cx: 325, cy: 305, rx: 30, ry: 15, rot: 10 },
          { cx: 330, cy: 365, rx: 26, ry: 13, rot: 5 },
          { cx: 325, cy: 420, rx: 22, ry: 11, rot: -5 },
          { cx: 318, cy: 470, rx: 16, ry: 8, rot: -15 },
        ].map((s, i) => (
          <ellipse
            key={`rd${i}`}
            cx={s.cx}
            cy={s.cy}
            rx={s.rx}
            ry={s.ry}
            transform={`rotate(${s.rot} ${s.cx} ${s.cy})`}
            fill={`url(#d-hair-noir-${mood})`}
            stroke="#5A3A24"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        ))}
      </g>

      {/* POINTED EARS */}
      <path d="M 134 195 L 90 162 L 142 178 Z" fill="#F2E8D5" stroke="#C4B79E" strokeWidth="1" />
      <path d="M 130 190 L 102 166 L 136 178 Z" fill="#C4B79E" opacity="0.6" />
      <path d="M 286 195 L 330 162 L 278 178 Z" fill="#F2E8D5" stroke="#C4B79E" strokeWidth="1" />
      <path d="M 290 190 L 318 166 L 284 178 Z" fill="#C4B79E" opacity="0.6" />

      {/* FACE */}
      <path d="M162 165 C 162 252 186 284 210 284 C 234 284 258 252 258 165 C 242 154 178 154 162 165 Z" fill="#F2E8D5" />

      {/* BLUSH ACCENTS */}
      <ellipse cx="178" cy="225" rx="14" ry="7" fill="#8E1B2B" opacity={mood === "rouge" ? "0.35" : "0.2"} />
      <ellipse cx="242" cy="225" rx="14" ry="7" fill="#8E1B2B" opacity={mood === "rouge" ? "0.35" : "0.2"} />

      {/* FRINGE SHADOW */}
      <path d="M162 165 C 186 150 234 150 258 165 L 250 188 C 232 175 188 175 170 188 Z" fill="#C4B79E" opacity="0.6" />

      {/* RED EYES WITH SHINE */}
      <g id="eyes">
        <ellipse cx="186" cy="204" rx="13" ry="17" fill="#5B1220" />
        <ellipse cx="234" cy="204" rx="13" ry="17" fill="#5B1220" />
        <ellipse cx="186" cy="206" rx="10" ry="14" fill={mood === "rouge" ? "#8E1B2B" : "#5B1220"} />
        <ellipse cx="234" cy="206" rx="10" ry="14" fill={mood === "rouge" ? "#8E1B2B" : "#5B1220"} />
        {/* pupils */}
        <ellipse cx="186" cy="208" rx="4" ry="7" fill="#0B0A08" />
        <ellipse cx="234" cy="208" rx="4" ry="7" fill="#0B0A08" />
        {/* highlights */}
        <circle cx="182" cy="198" r="3" fill="#F2E8D5" />
        <circle cx="230" cy="198" r="3" fill="#F2E8D5" />
        <circle cx="189" cy="213" r="1.5" fill="#F2E8D5" opacity="0.8" />
        <circle cx="237" cy="213" r="1.5" fill="#F2E8D5" opacity="0.8" />
      </g>

      {/* SPLIT BANGS — OXBLOOD LEFT / WALNUT RIGHT */}
      <g id="bangs">
        {/* Left Oxblood Bangs */}
        <path d="M 210 110 C 175 110 145 145 138 185 C 158 175 178 175 192 188 C 185 160 198 140 210 130 Z" fill={`url(#d-hair-rouge-${mood})`} />
        <path d="M 210 130 C 190 145 175 175 168 205 C 182 192 195 190 210 192 Z" fill={`url(#d-hair-rouge-${mood})`} />
        {/* Right Walnut Bangs */}
        <path d="M 210 110 C 245 110 275 145 282 185 C 262 175 242 175 228 188 C 235 160 222 140 210 130 Z" fill={`url(#d-hair-noir-${mood})`} />
        <path d="M 210 130 C 230 145 245 175 252 205 C 238 192 225 190 210 192 Z" fill={`url(#d-hair-noir-${mood})`} />
        {/* Center split line accent */}
        <line x1="210" y1="110" x2="210" y2="192" stroke="#8E1B2B" strokeWidth="1.5" strokeOpacity="0.6" />
      </g>

      {/* NOSE & FANG */}
      <path d="M208 222 L 210 225 L 212 222" stroke="#C4B79E" strokeWidth="1.2" fill="none" />
      {/* smirk line + fang */}
      <path d="M 200 242 Q 210 248 220 242" stroke="#5B1220" strokeWidth="1.8" fill="none" />
      <path d="M 203 243 L 206 251 L 209 244 Z" fill="#F2E8D5" stroke="#5B1220" strokeWidth="0.5" />

      {/* SUIT + SHIRT + BOWTIE */}
      <g id="body">
        {/* Shoulders / Suit */}
        <path d="M 90 620 C 95 440 145 330 210 330 C 275 330 325 440 330 620 Z" fill={`url(#d-suit-${mood})`} />
        {/* Ivory shirt insert */}
        <path d="M 210 330 L 172 400 L 210 620 L 248 400 Z" fill="#F2E8D5" />
        <path d="M 210 330 L 178 370 L 210 395 L 242 370 Z" fill="#C4B79E" />
        {/* Lapels with oxblood piping */}
        <path d="M 210 334 L 152 368 L 174 475 L 210 400 Z" fill="#0B0A08" stroke="#8E1B2B" strokeWidth="0.8" strokeOpacity="0.4" />
        <path d="M 210 334 L 268 368 L 246 475 L 210 400 Z" fill="#0B0A08" stroke="#8E1B2B" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* OXBLOOD BOWTIE */}
        <path d="M 210 348 L 170 326 L 172 370 Z" fill="#5B1220" stroke="#3B2417" strokeWidth="1" />
        <path d="M 210 348 L 250 326 L 248 370 Z" fill="#5B1220" stroke="#3B2417" strokeWidth="1" />
        <rect x="202" y="340" width="16" height="18" rx="2" fill="#8E1B2B" stroke="#5B1220" strokeWidth="1" />
      </g>

      {/* RESTRAINED HUD OVERLAY WITH CORNER ACCENTS */}
      <g stroke={key} strokeOpacity="0.6" strokeWidth="1" fill="none">
        {/* Smooth outer frame */}
        <rect x="35" y="35" width="350" height="550" rx="3" strokeDasharray="6 4" strokeOpacity="0.25" />
        {/* HUD corners */}
        <path d="M 30 30 h 16 v 4 h -12 v 12 h -4 Z" fill={key} stroke="none" />
        <path d="M 390 30 h -16 v 4 h 12 v 12 h 4 Z" fill={key} stroke="none" />
        <path d="M 30 590 h 16 v -4 h -12 v -12 h -4 Z" fill={key} stroke="none" />
        <path d="M 390 590 h -16 v -4 h 12 v -12 h 4 Z" fill={key} stroke="none" />
      </g>
    </svg>
  );
}

