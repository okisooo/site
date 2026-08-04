"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Tactical hero — "techwear editorial" per the Endfield/ZZZ reference.
 *
 * Everything here is procedural: contour field, dot matrix, shard geometry and
 * the HUD annotation layer are drawn from code, not shipped as art. Keeps the
 * payload near zero and lets every layer animate.
 *
 * Composition rules taken from the reference:
 *  - near-monochrome base, ONE hot signal colour used on <5% of pixels
 *  - diagonal, asymmetric; nothing is centred
 *  - dense technical annotation that implies a system you are looking into
 *  - Latin + CJK pairing
 *  - massive ghosted display type behind everything
 *
 * Perf: only transform/opacity animate. The background layers are static paint.
 */

/* Deterministic pseudo-random so server and client markup match. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function ContourField() {
  // Topographic lines: stacked sine paths at varying amplitude/phase.
  const paths = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const amp = 18 + rand(i + 1) * 42;
      const phase = rand(i + 7) * Math.PI * 2;
      const yBase = 40 + i * 46;
      const pts: string[] = [];
      // Overdraw past the viewBox so the drift never exposes a path end.
      for (let x = -160; x <= 1760; x += 40) {
        const y = yBase + Math.sin(x / 220 + phase) * amp + Math.sin(x / 90 + phase * 2) * (amp * 0.25);
        pts.push(`${x},${y.toFixed(1)}`);
      }
      return { d: `M ${pts.join(" L ")}`, o: 0.16 + rand(i + 3) * 0.14 };
    });
  }, []);

  return (
    <svg className="tac-layer" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g className="tac-drift-slow">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke="var(--tac-ink)" strokeWidth="1" strokeOpacity={p.o} />
        ))}
      </g>
    </svg>
  );
}

function DotMatrix() {
  // Sparse dither blocks — reference uses these as texture, never as a full field.
  const blocks = useMemo(
    () =>
      [
        { x: 60, y: 300, c: 6, r: 5 },
        { x: 1180, y: 90, c: 5, r: 4 },
        { x: 1320, y: 470, c: 7, r: 3 },
        { x: 300, y: 560, c: 4, r: 4 },
      ].flatMap((b, bi) =>
        Array.from({ length: b.c * b.r }, (_, i) => {
          const cx = b.x + (i % b.c) * 9;
          const cy = b.y + Math.floor(i / b.c) * 9;
          return { cx, cy, on: rand(bi * 50 + i) > 0.42 };
        }).filter((d) => d.on),
      ),
    [],
  );

  return (
    <svg className="tac-layer" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {blocks.map((d, i) => (
        <rect
          key={i}
          className={i % 3 === 0 ? "tac-flicker" : i % 3 === 1 ? "tac-flicker-2" : undefined}
          x={d.cx}
          y={d.cy}
          width="4"
          height="4"
          fill="var(--tac-ink)"
          fillOpacity="0.72"
        />
      ))}
    </svg>
  );
}

function ShardField() {
  /* Hard-edged polygon geometry. Two families:
     graphite structural shards (large, low contrast) and a few signal-red
     slivers (small, high contrast) so the accent reads as deliberate. */
  return (
    <svg className="tac-layer" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* structural mass — dark enough to actually read as geometry */}
      <g fill="var(--tac-ink)" fillOpacity="0.14">
        <polygon points="980,-40 1420,120 1180,430 900,250" />
        <polygon points="1240,300 1600,180 1600,620 1120,560" />
        <polygon points="60,470 380,540 240,700 0,660" />
      </g>
      {/* Kept clear of y<150: the top HUD rail lives there, and steel-grey nav
          text vanished into this shard. Dark mass never sits under UI text. */}
      <g fill="var(--tac-ink)" fillOpacity="0.5">
        <polygon points="1310,168 1600,112 1600,232 1372,268" />
        <polygon points="0,180 210,120 250,210 0,265" />
      </g>
      <g fill="none" stroke="var(--tac-ink)" strokeOpacity="0.55" strokeWidth="1">
        <polygon points="980,-40 1420,120 1180,430 900,250" />
        <polygon points="1240,300 1600,180 1600,620 1120,560" />
        <polygon points="1050,140 1330,230 1200,380" />
        <polygon points="60,470 380,540 240,700 0,660" />
      </g>
      {/* diagonal rules — the reference is never orthogonal */}
      <g stroke="var(--tac-ink)" strokeOpacity="0.35" strokeWidth="1">
        <line x1="0" y1="250" x2="1600" y2="120" />
        <line x1="0" y1="262" x2="1600" y2="132" />
        <line x1="0" y1="600" x2="1600" y2="470" strokeDasharray="14 8" />
      </g>
      {/* signal red: slivers, bars and one solid block. Spent, not sprinkled. */}
      <g fill="var(--tac-signal)">
        <polygon className="tac-blink-a" points="1386,96 1478,124 1404,158" />
        <polygon points="120,486 236,512 180,540" opacity="0.85" />
        <rect x="1120" y="612" width="140" height="6" />
        <rect className="tac-blink-c" x="0" y="246" width="190" height="6" />
        <rect x="1470" y="300" width="6" height="120" />
        <rect className="tac-blink-b" x="286" y="120" width="56" height="56" opacity="0.9" />
      </g>
      <g fill="none" stroke="var(--tac-signal)" strokeWidth="1.5" strokeOpacity="0.9">
        <polyline points="1180,660 1240,660 1268,632" />
        <polyline points="420,60 470,60 496,86" />
      </g>
      {/* wireframe rings — "scan" motif, counter-rotating */}
      <g fill="none" stroke="var(--tac-ink)" strokeOpacity="0.4">
        <circle cx="1268" cy="252" r="86" />
        <circle className="tac-spin-ring" cx="1268" cy="252" r="52" strokeDasharray="3 5" />
        <circle className="tac-spin-small" cx="222" cy="196" r="38" strokeDasharray="2 6" />
        <circle className="tac-spin-ring-rev" cx="1268" cy="252" r="120" strokeDasharray="1 9" strokeOpacity="0.6" />
      </g>
      {/* tick ruler with a travelling index */}
      <g stroke="var(--tac-ink)" strokeOpacity="0.45" strokeWidth="1">
        {Array.from({ length: 32 }, (_, i) => (
          <line key={i} x1={40 + i * 22} y1={676} x2={40 + i * 22} y2={i % 5 === 0 ? 660 : 668} />
        ))}
      </g>
      <g className="tac-ruler-head">
        <rect x="36" y="654" width="2" height="26" fill="var(--tac-signal)" />
        <polygon points="30,648 44,648 37,656" fill="var(--tac-signal)" />
      </g>
    </svg>
  );
}

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <path d="M11 0v7M11 15v7M0 11h7M15 11h7" stroke="var(--tac-signal)" strokeWidth="1.4" />
      <rect x="8" y="8" width="6" height="6" fill="none" stroke="var(--tac-ink)" strokeOpacity="0.5" />
    </svg>
  );
}

/** Corner brackets that frame the subject — the "scanned target" motif. */
function TargetFrame() {
  const corner = "absolute w-7 h-7 border-[var(--tac-ink)]";
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
      <Crosshair className="absolute -left-3 top-1/2 -translate-y-1/2" />
      <Crosshair className="absolute -right-3 top-1/2 -translate-y-1/2" />
    </div>
  );
}

/** One annotation callout: a leader line + a mono label. */
function Callout({
  label,
  value,
  className = "",
  align = "left",
}: {
  label: string;
  value: string;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`tac-callout ${className}`} data-align={align}>
      <span className="tac-callout-line" />
      <span className="tac-mono text-[10px] leading-none tracking-[0.18em]">
        <span className="text-[var(--tac-steel)]">{label}</span>
        <span className="mx-1.5 text-[var(--tac-ink)]/30">/</span>
        <span className="text-[var(--tac-ink)]">{value}</span>
      </span>
    </div>
  );
}

const RISE = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

export default function TacticalHero({
  children,
  subject,
  nav,
  className = "",
}: {
  children?: React.ReactNode;
  subject?: React.ReactNode;
  nav?: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  /* Hero assembles as the boot overlay wipes away. Zero delay when the boot is
     skipped, so reduced-motion users never wait on an animation they can't see. */
  const D = reduced ? 0 : 1.5;

  const plx1 = useRef<HTMLDivElement>(null);
  const plx2 = useRef<HTMLDivElement>(null);
  const plx3 = useRef<HTMLDivElement>(null);

  /* Pointer parallax. Writes `transform` directly on three leaf layers inside a
     single rAF — leaf transform writes measured at 0ms, versus ~30ms for any
     inherited/custom property written on the root (docs/HANDOFF.md).
     Skipped entirely for coarse pointers and reduced motion: there is no cursor
     to follow on touch, and it would just be a wasted listener. */
  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const layers: Array<[React.RefObject<HTMLDivElement | null>, number]> = [
      [plx1, 14],
      [plx2, 26],
      [plx3, 38],
    ];

    const apply = () => {
      raf = 0;
      for (const [ref, depth] of layers) {
        const el = ref.current;
        if (el) el.style.transform = `translate3d(${tx * depth}px, ${ty * depth}px, 0)`;
      }
    };

    const onMove = (e: PointerEvent) => {
      // -0.5..0.5 from centre
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section className={`tac-hero ${className}`} aria-label="OKISO">
      {/* ── background stack ── */}
      <motion.div
        className="tac-bg"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: D + 0.08, ease: "easeOut" }}
      >
        {/* .tac-plx carries the pointer transform (JS), .tac-amb the ambient
            drift (CSS). Separate nodes so they compose instead of overwriting. */}
        <div ref={plx1} className="tac-plx">
          <div className="tac-amb tac-amb-1">
            <ContourField />
          </div>
        </div>
        <div ref={plx2} className="tac-plx">
          <div className="tac-amb tac-amb-2">
            <ShardField />
          </div>
        </div>
        <div ref={plx3} className="tac-plx">
          <div className="tac-amb tac-amb-3">
            <DotMatrix />
          </div>
        </div>
        <div className="tac-scanlines" />
      </motion.div>

      {/* ghosted display type, behind everything readable */}
      <motion.div
        className="tac-ghost"
        aria-hidden
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 0.075, scale: 1 }}
        transition={{ duration: 1.1, delay: D, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>OKISO</span>
      </motion.div>

      {/* ── top HUD rail ── */}
      <div className="tac-rail tac-rail-top">
        <div className="flex items-center gap-3">
          <span className="tac-chip">
            <span className="tac-dot" />
            LIVE_SYSTEM
          </span>
          <span className="tac-mono text-[10px] tracking-[0.28em] text-[var(--tac-steel)]">CH.01 / 2026</span>
        </div>
        <div className="flex min-w-0 flex-shrink items-center justify-end gap-4">
          <span className="tac-mono hidden text-[10px] tracking-[0.28em] text-[var(--tac-steel)] 2xl:inline">音 SIGNAL</span>
          <span className="tac-mono hidden text-[10px] tracking-[0.28em] text-[var(--tac-steel)] 2xl:inline">
            LAT <span className="text-[var(--tac-ink)]">0.012</span>
          </span>
          {nav}
        </div>
      </div>

      {/* ── main composition ── */}
      <div className="tac-grid">
        {/* left: type block */}
        <motion.div
          className="tac-col-left"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.07, delayChildren: D + 0.1 }}
        >
          <motion.div variants={RISE} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-3">
            <span className="tac-index">002</span>
            <span className="tac-rule" />
            <span className="tac-mono text-[10px] tracking-[0.3em] text-[var(--tac-steel)]">ARCHIVE / オキソ</span>
          </motion.div>

          {/* Split per character so the wordmark stamps in letter by letter.
              Each letter is its own overflow-clipped column, so they rise from
              behind a mask instead of sliding over the layout. */}
          <h1 className="tac-display" aria-label="OKISO">
            {"OKISO".split("").map((ch, i) => (
              <span key={i} className="tac-char" aria-hidden>
                <motion.span
                  initial={{ y: "108%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.72, delay: D + 0.12 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={RISE}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="tac-lede"
          >
            VOCALOID producer &amp; virtual artist.
            <span className="text-[var(--tac-steel)]"> Hyperpop, electronic, and everything louder than the last.</span>
          </motion.p>

          <motion.div
            variants={RISE}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            {children}
          </motion.div>

          <motion.div
            variants={RISE}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="tac-readout"
          >
            <span>REL <b>32</b></span>
            <span className="tac-sep" />
            <span>CH <b>01</b></span>
            <span className="tac-sep" />
            <span>STATUS <b className="text-[var(--tac-signal)]">ONLINE</b></span>
          </motion.div>
        </motion.div>

        {/* right: the subject, framed like a scanned target */}
        <div className="tac-col-right">
          <div className="tac-subject">
            <div className="tac-subject-plate" aria-hidden>
              <span className="tac-scan-sweep" />
            </div>
            <TargetFrame />
            <Callout label="MODEL" value="OKISO" className="tac-c1" />
            <Callout label="BUILD" value="v2.6" className="tac-c2" align="right" />
            <Callout label="MODE" value="IDLE" className="tac-c3" />
            <span className="tac-mono tac-vlabel">思 / SUBJECT-01</span>
            <div className="tac-subject-inner">{subject}</div>
          </div>
        </div>
      </div>

      {/* ── bottom HUD rail ── */}
      <div className="tac-rail tac-rail-bottom">
        <span className="tac-mono text-[10px] tracking-[0.3em] text-[var(--tac-steel)]">SCROLL ↓</span>
        <span className="tac-mono hidden text-[10px] tracking-[0.3em] text-[var(--tac-steel)] md:inline">
          SYSTEM.ARCHIVE.ONLINE
        </span>
      </div>
    </section>
  );
}
