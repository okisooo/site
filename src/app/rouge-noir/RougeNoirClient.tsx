"use client";

/**
 * Rouge & Noir — premium landing page (LOOKLOCK v1).
 *
 * Art direction: 1930s roulette pit, real materials under warm tungsten.
 * Palette: --rn-ink (#0B0A08), --rn-walnut (#3B2417), --rn-walnut-hi (#5A3A24),
 * --rn-felt (#14452F), --rn-felt-hi (#1D5E3F), --rn-oxblood (#5B1220),
 * --rn-oxblood-hi (#8E1B2B), --rn-brass (#C9A227), --rn-brass-hi (#E8D08A),
 * --rn-brass-dim (#7A6318), --rn-ivory (#F2E8D5), --rn-ivory-dim (#C4B79E).
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import Preloader from "./_components/Preloader";
import RouletteWheel from "./_components/RouletteWheel";
import DealerFigure from "./_components/DealerFigure";
import MagneticButton from "./_components/MagneticButton";
import { CornerFrame, IndexLabel, Meta, Ticker } from "./_components/hud";
import { useScrollTo } from "@/motion/useScrollTo";

const NAV = [
  { id: "loop", n: "01", label: "The Loop" },
  { id: "charms", n: "02", label: "Charms" },
  { id: "dealer", n: "03", label: "The Dealer" },
  { id: "gameplay", n: "04", label: "In Motion" },
  { id: "wishlist", n: "05", label: "Play" },
];

const CHARMS = [
  { name: "Red Ink", tag: "Weight", suit: "crimson", pip: "▲", d: "Red pockets are 25% more likely." },
  { name: "Black Ink", tag: "Weight", suit: "noir", pip: "◆", d: "Black pockets are 25% more likely." },
  { name: "Even Steven", tag: "Payout", suit: "gold", pip: "✦", d: "Even-money bets (Red, Black, Odd, Even, High, Low) win 50% more." },
  { name: "Inside Man", tag: "Payout", suit: "gold", pip: "◎", d: "Inside bets (Straight, Split, Street, Corner, Six Line) win 50% more." },
  { name: "Green Thumb", tag: "Refund", suit: "green", pip: "0", d: "When the ball lands on green, each losing bet returns 3x its stake." },
  { name: "Insurance", tag: "Refund", suit: "crimson", pip: "⇈", d: "Losing bets refund 20% of their stake." },
  { name: "Rouge Favor", tag: "Mult", suit: "crimson", pip: "🔥", d: "Her warmth compounds — each red in a row adds x0.5 to your mult." },
  { name: "Noir Favor", tag: "Mult", suit: "noir", pip: "⚡", d: "Shadows compound — each black in a row adds x0.5 to your mult." },
];

function suitColor(suit: string) {
  return suit === "crimson"
    ? "var(--rn-oxblood)"
    : suit === "green"
      ? "var(--rn-felt)"
      : suit === "gold"
        ? "var(--rn-brass)"
        : "var(--rn-ink)";
}

export default function RougeNoirClient() {
  const rm = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false); // preloader finished

  const smoothTo = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" });
    },
    [rm],
  );

  /* Sticky nav: hide on scroll-down, reveal on scroll-up */
  useEffect(() => {
    let last = window.scrollY;
    let lastHidden: string | null = null;
    let lastSolid: string | null = null;
    const onScroll = () => {
      const el = navRef.current;
      if (!el) return;
      const y = window.scrollY;
      const nextHidden = y > 140 && y > last ? "true" : "false";
      const nextSolid = y > 60 ? "true" : "false";
      if (nextHidden !== lastHidden) {
        el.dataset.hidden = nextHidden;
        lastHidden = nextHidden;
      }
      if (nextSolid !== lastSolid) {
        el.dataset.solid = nextSolid;
        lastSolid = nextSolid;
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* GSAP scroll narratives — desktop + motion-allowed only */
  useEffect(() => {
    if (rm || !ready) return;
    const root = rootRef.current;
    if (!root) return;

    let ctx: { revert: () => void } | null = null;
    let killed = false;
    let ro: ResizeObserver | null = null;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    (async () => {
      let gsap, ScrollTrigger;
      try {
        const gsapMod = await import("gsap");
        const stMod = await import("gsap/ScrollTrigger");
        gsap = gsapMod.default;
        ScrollTrigger = stMod.ScrollTrigger;
      } catch {
        return; // import failed → leave content visible (no .rn-js armed)
      }
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from(".rn-hero-line .rn-char", {
          immediateRender: false,
          yPercent: 90,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.04,
        });
        gsap.from(".rn-hero-fade", { immediateRender: false, opacity: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.25 });

        // parallax layers in hero
        gsap.to(".rn-hero-ghost", {
          yPercent: 22,
          ease: "none",
          scrollTrigger: { trigger: ".rn-hero", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".rn-hero-wheel", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: ".rn-hero", start: "top top", end: "bottom top", scrub: true },
        });

        // generic reveals
        gsap.utils.toArray<HTMLElement>(".rn-reveal").forEach((el) => {
          gsap.from(el, {
            immediateRender: false,
            y: 34,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          });
        });

        // count-up stats
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count || "0");
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });

        const mm = gsap.matchMedia();

        // horizontal charm gallery (desktop)
        mm.add("(min-width: 900px)", () => {
          const track = root.querySelector<HTMLElement>(".rn-charm-track");
          const wrap = root.querySelector<HTMLElement>(".rn-charm-pin");
          if (!track || !wrap) return;
          const dist = track.scrollWidth - wrap.clientWidth + 80;
          if (dist <= 0) return;
          gsap.to(track, {
            x: -dist,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => `+=${dist}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        });

        // pinned dealer mood crossfade (desktop)
        mm.add("(min-width: 900px)", () => {
          const sec = root.querySelector<HTMLElement>(".rn-dealer-pin");
          if (!sec) return;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sec,
              start: "top top",
              end: "+=1200",
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(".rn-mood-rouge", { opacity: 0, xPercent: -6, duration: 1 }, 0.35)
            .to(".rn-mood-noir", { opacity: 1, xPercent: 0, duration: 1 }, 0.35)
            .fromTo(".rn-mood-noir-copy", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6)
            .to(".rn-mood-rouge-copy", { opacity: 0, y: -20, duration: 0.6 }, 0.35)
            .to(".rn-dealer-bg", { background: "linear-gradient(135deg,#3B2417,#0B0A08)", duration: 1 }, 0.3);
        });

        ScrollTrigger.refresh();

        if (typeof ResizeObserver !== "undefined") {
          ro = new ResizeObserver(() => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
              ScrollTrigger.refresh();
            }, 150);
          });
          ro.observe(root);
        }
      }, root);
    })();

    return () => {
      killed = true;
      if (resizeTimeout) clearTimeout(resizeTimeout);
      ro?.disconnect();
      ctx?.revert();
    };
  }, [rm, ready]);

  const heroChars = (word: string, accent = false) =>
    word.split("").map((c, i) => (
      <span key={i} className="rn-char inline-block" style={{ color: accent ? "var(--rn-oxblood)" : undefined }}>
        {c}
      </span>
    ));

  return (
    <div
      ref={rootRef}
      data-premid-page="rouge-noir"
      className="rn-root relative w-full overflow-x-hidden selection:bg-[var(--rn-oxblood)] selection:text-[var(--rn-ivory)]"
    >
      <ScopedStyle />
      {!rm && <Preloader onDone={() => setReady(true)} />}
      <div className="rn-grain" aria-hidden />
      {/* Fixed viewport frame: brass double-rule */}
      <div className="rn-frame" aria-hidden />

      {/* ── sticky nav ── */}
      <nav
        ref={navRef}
        data-hidden="false"
        data-solid="false"
        className="rn-nav fixed inset-x-0 top-0 z-[120] transition-[transform,background,border] duration-500"
      >
        <div className="mx-auto flex max-w-[2200px] items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="rn-focus group flex items-center gap-3" aria-label="Back to OKISO home">
            <span className="rn-display text-xl font-bold uppercase tracking-tight text-[var(--rn-ivory)] transition-colors group-hover:text-[var(--rn-brass)]">
              R<span className="text-[var(--rn-oxblood)]">&amp;</span>N
            </span>
            <span className="rn-mono hidden text-[9px] uppercase tracking-[0.3em] text-[var(--rn-ivory-dim)] sm:inline">
              ← OKISO
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={smoothTo(item.id)}
                className="rn-focus group flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--rn-ivory-dim)] transition-colors hover:text-[var(--rn-ivory)]"
              >
                <span className="rn-mono text-[9px] text-[var(--rn-brass)]">{item.n}</span>
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#wishlist"
            onClick={smoothTo("wishlist")}
            className="rn-focus rounded-full bg-[var(--rn-oxblood)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--rn-ivory)] shadow-[0_4px_20px_rgba(91,18,32,0.6)] transition-transform hover:scale-105"
          >
            Play Demo
          </a>
        </div>
      </nav>

      {/* ════ 1 · HERO ════ */}
      <section className="rn-hero relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden px-6 pt-20 pb-24 md:pt-16">
        {/* ghost wordmark parallax */}
        <div
          className="rn-hero-ghost rn-display pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center"
          aria-hidden
        >
          <span className="text-[24vw] uppercase leading-[0.78] text-transparent" style={{ WebkitTextStroke: "1px rgba(201,162,39,0.20)" }}>ROUGE</span>
          <span className="text-[24vw] uppercase leading-[0.78] text-transparent" style={{ WebkitTextStroke: "1px rgba(242,232,213,0.12)" }}>NOIR</span>
        </div>
        {/* tungsten & felt light beams */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(201,162,39,0.1)] blur-[120px]" />
          <div className="absolute right-1/3 top-[38%] h-[520px] w-[520px] max-w-[80vw] rounded-full bg-[rgba(91,18,32,0.12)] blur-[100px]" />
        </div>

        <CornerFrame />

        <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-0">
          {/* copy */}
          <div className="relative z-20 order-2 text-center lg:order-1 lg:text-left">
            <div
              className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 hidden lg:block"
              style={{ background: "linear-gradient(90deg, rgba(11,10,8,0.95) 55%, rgba(11,10,8,0.6) 80%, transparent 100%)" }}
              aria-hidden
            />
            <div className="rn-hero-fade flex items-center justify-center gap-3 lg:justify-start">
              <Meta className="text-[var(--rn-brass)]">EU-01 · Single Zero</Meta>
              <span className="h-1 w-1 rounded-full bg-[var(--rn-oxblood)]" />
              <Meta>Roguelike Deckbuilder</Meta>
            </div>

            <h1 className="rn-display mt-6 font-bold uppercase leading-[0.8] tracking-tight">
              <span className="rn-hero-line block text-[clamp(3.8rem,12vw,11rem)] text-[var(--rn-oxblood-hi)] [text-shadow:0_2px_24px_rgba(91,18,32,0.5)]">
                {heroChars("ROUGE")}
              </span>
              <span className="rn-hero-line -mt-2 block text-[clamp(3.8rem,12vw,11rem)] text-[var(--rn-ivory)] md:-mt-4">
                {heroChars("NOIR")}
              </span>
            </h1>

            <p className="rn-hero-fade mx-auto mt-8 max-w-xl text-base font-normal leading-relaxed text-[var(--rn-ivory-dim)] md:text-xl lg:mx-0">
              Place your bets. Spin the single-zero wheel. Hit the score target across{" "}
              <span className="font-bold text-[var(--rn-ivory)]">8 antes</span> — then buy charms, rig
              the wheel, and stack multipliers until the house never stood a chance.
            </p>

            <div className="rn-hero-fade mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <MagneticButton
                as="a"
                href="#wishlist"
                onClick={smoothTo("wishlist")}
                className="rn-focus group inline-flex items-center gap-3 rounded-full bg-[var(--rn-oxblood)] px-9 py-5 text-sm font-bold uppercase tracking-widest text-[var(--rn-ivory)] shadow-[0_8px_32px_rgba(91,18,32,0.55)] md:text-base"
              >
                Play the Demo
                <span aria-hidden className="transition-transform group-hover:translate-x-1">⟶</span>
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#loop"
                onClick={smoothTo("loop")}
                strength={0.2}
                className="rn-focus inline-flex items-center gap-2 rounded-sm border border-[rgba(201,162,39,0.25)] bg-[rgba(59,36,23,0.4)] px-8 py-5 text-sm font-bold uppercase tracking-widest text-[var(--rn-ivory)] shadow-[inset_0_1px_6px_rgba(11,10,8,0.7)] transition-colors hover:border-[var(--rn-brass)] hover:text-[var(--rn-brass)] md:text-base"
              >
                See How It Plays
              </MagneticButton>
            </div>
          </div>

          {/* wheel */}
          <div className="rn-hero-wheel relative order-1 mx-auto flex aspect-square w-full max-w-[min(80vw,560px)] items-center justify-center lg:order-2 lg:-ml-10 lg:max-w-[600px] xl:-ml-16 xl:max-w-[640px]">
            <div className="rn-float relative h-full w-full">
              <RouletteWheel />
            </div>
            <Meta className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
              37 POCKETS · 8 ANTES · 4 SPINS
            </Meta>
          </div>
        </div>

        {/* scroll cue */}
        <div className="rn-hero-fade absolute bottom-8 left-6 flex items-center gap-3 md:left-12">
          <span className="rn-rule-knurl h-px w-14 inline-block" />
          <span className="rn-mono text-[10px] uppercase tracking-[0.3em] text-[rgba(196,183,158,0.6)]">Scroll</span>
        </div>
      </section>

      <Ticker
        items={["Bet", "Spin", "Build", "Rig the Wheel", "Read the Dealer", "Take the House"]}
        tone="crimson"
      />

      {/* ════ 2 · THE LOOP ════ */}
      <section id="loop" className="relative mx-auto w-full max-w-[1500px] overflow-hidden px-6 py-24 md:py-36">
        {/* LOOKLOCK §8.4.4 — curve counterweight. The stepped Deco corners on the
            plates below are only legible as *machining* if real curved engraving
            shares the viewport; square detail on square everything reads as
            pixel-art instead. Static paint, never animated, never a field. */}
        <svg
          className="pointer-events-none absolute -bottom-64 -right-40 hidden h-[760px] w-[760px] md:block"
          viewBox="0 0 760 760"
          fill="none"
          aria-hidden
        >
          {[248, 286, 324, 362, 400].map((r, i) => (
            <circle
              key={r}
              cx="380"
              cy="380"
              r={r}
              stroke="var(--rn-brass-hi)"
              strokeWidth="1"
              strokeOpacity={i % 2 === 0 ? 0.1 : 0.055}
            />
          ))}
        </svg>
        <div className="rn-reveal mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <IndexLabel index="01" label="The Loop" />
            <h2 className="rn-display mt-5 text-[clamp(2.4rem,6.5vw,5rem)] font-bold uppercase leading-[0.85] tracking-tight">
              Bet <span className="text-[var(--rn-ivory-dim)]">·</span> Spin{" "}
              <span className="text-[var(--rn-ivory-dim)]">·</span> <span className="rn-gold-text">Build</span>
            </h2>
          </div>
          <div className="flex gap-8">
            {[
              { c: 8, l: "Antes" },
              { c: 37, l: "Pockets" },
              { c: 4, l: "Spins / Ante" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="rn-display text-4xl font-bold tabular-nums text-[var(--rn-ivory)] md:text-5xl">
                  <span data-count={s.c}>{rm ? s.c : 0}</span>
                </div>
                <Meta className="mt-1 block">{s.l}</Meta>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { k: "01", t: "Bet", accent: "var(--rn-oxblood)", d: "Spread your round stake across red, black, columns, and single numbers. Every layout is a different risk curve — and a different way to rig the math." },
            { k: "02", t: "Spin", accent: "var(--rn-brass)", d: "The single-zero wheel decides. Up to four spins per ante to reach the score target. Payouts feed your score; misses burn a spin." },
            { k: "03", t: "Build", accent: "var(--rn-felt)", d: "Clear the ante, hit the shop. Spend winnings on charms that bend wheel weights, refund losses, and stack global multipliers." },
          ].map((step) => (
            <article
              key={step.k}
              className="rn-reveal rn-plate group relative overflow-hidden rounded-sm border border-[rgba(201,162,39,0.22)] bg-[rgba(59,36,23,0.8)] p-8 shadow-[inset_0_2px_12px_rgba(11,10,8,0.75)] transition-colors hover:border-[rgba(201,162,39,0.45)]"
            >
              <CornerFrame />
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40" style={{ background: step.accent }} />
              <div className="rn-mono text-5xl font-bold" style={{ color: step.accent }}>{step.k}</div>
              <h3 className="rn-display mt-4 text-2xl font-bold uppercase tracking-tight text-[var(--rn-ivory)]">{step.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--rn-ivory-dim)] md:text-base">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ════ 3 · CHARMS (horizontal on desktop) ════ */}
      <section id="charms" className="relative w-full border-y border-[rgba(201,162,39,0.2)] bg-[rgba(59,36,23,0.4)]">
        <div className="rn-charm-pin relative w-full overflow-hidden py-20 md:min-h-[100svh] md:py-0">
          <div className="mx-auto flex h-full max-w-[2200px] flex-col justify-center px-6">
            <div className="rn-reveal mb-10 max-w-2xl md:mb-14">
              <IndexLabel index="02" label="Charms" />
              <h2 className="rn-display mt-5 text-[clamp(2.2rem,6vw,4.5rem)] font-bold uppercase leading-[0.85] tracking-tight">
                Rig the Wheel.<br />Stack the Mult.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--rn-ivory-dim)] md:text-base">
                Charms are your deck. Chain them into engines that reweight pockets, refund busts,
                and turn a modest spin into a screen-filling score flare.
              </p>
            </div>

            <div className="rn-charm-track flex gap-5 md:flex-nowrap md:pr-20">
              <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:hidden">
                {CHARMS.slice(0, 4).map((charm) => (
                  <CharmCard key={charm.name} charm={charm} />
                ))}
              </div>
              <div className="hidden md:flex md:gap-5">
                {CHARMS.map((charm) => (
                  <div key={charm.name} className="w-[300px] shrink-0">
                    <CharmCard charm={charm} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 4 · DEALER ════ */}
      <section id="dealer" className="relative w-full">
        <div className="rn-dealer-pin rn-dealer-bg relative flex w-full flex-col overflow-hidden md:min-h-[100svh]" style={{ background: "linear-gradient(135deg, var(--rn-walnut), var(--rn-ink))" }}>
          <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-6 py-24 md:py-0">
            <div className="rn-reveal mb-10">
              <IndexLabel index="03" label="The Dealer" />
            </div>

            <div className="grid items-center gap-10 md:grid-cols-2">
              {/* copy stack */}
              <div className="relative order-2 min-h-[220px] md:order-1">
                <div className="rn-mood-rouge-copy">
                  <span className="rn-mono text-xs uppercase tracking-[0.3em] text-[var(--rn-ivory-dim)]">Hot streak</span>
                  <h2 className="rn-display mt-2 text-[clamp(3rem,9vw,7rem)] font-bold uppercase leading-[0.8] tracking-tight text-[var(--rn-ivory)]">Rouge</h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--rn-ivory-dim)] md:text-base">
                    Crimson runs light her up. Red bets swing bigger, the wheel leans warm, and the
                    mult climbs fast — as long as your luck holds.
                  </p>
                </div>
                <div className="rn-mood-noir-copy md:absolute md:inset-0" style={rm ? undefined : { opacity: 1 }}>
                  <span className="rn-mono text-xs uppercase tracking-[0.3em] text-[var(--rn-ivory-dim)]">Cold calculation</span>
                  <h2 className="rn-display mt-2 text-[clamp(3rem,9vw,7rem)] font-bold uppercase leading-[0.8] tracking-tight text-[var(--rn-ivory)]">Noir</h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--rn-ivory-dim)] md:text-base">
                    Black runs turn her clinical. Payouts steady, refunds tighten, and every spin
                    feels like the house doing the math on you.
                  </p>
                </div>
                <div className="mt-8 inline-flex items-center gap-3 rounded-sm border border-[rgba(201,162,39,0.3)] bg-[rgba(11,10,8,0.6)] px-5 py-3 shadow-[inset_0_1px_4px_rgba(11,10,8,0.7)]">
                  <span className="rn-display text-2xl font-bold text-[var(--rn-brass)]">+10%</span>
                  <span className="text-xs font-medium text-[var(--rn-ivory-dim)]">on wins that match her mood — three of a color shifts it.</span>
                </div>
              </div>

              {/* figure */}
              <div className="relative order-1 mx-auto h-[380px] w-full max-w-[420px] md:order-2 md:h-[560px]">
                <div className="rn-mood-noir absolute inset-0" style={rm ? undefined : { opacity: 0 }}>
                  <DealerFigure mood="noir" />
                </div>
                <div className="rn-mood-rouge absolute inset-0">
                  <DealerFigure mood="rouge" />
                </div>
              </div>
            </div>
            <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-widest text-[rgba(196,183,158,0.5)] md:text-left">
              Dealer figures are procedural placeholders — final character art pending.
            </p>
          </div>
        </div>
      </section>

      <Ticker items={["Rouge", "Noir", "Read the Mood", "+10% Matched"]} tone="ghost" reverse />

      {/* ════ 5 · GAMEPLAY ════ */}
      <section id="gameplay" className="relative w-full bg-[rgba(11,10,8,0.6)] py-24 md:py-36">
        <div className="mx-auto w-full max-w-[1400px] px-6">
          <div className="rn-reveal mb-12 text-center">
            <IndexLabel index="04" label="In Motion" className="justify-center" />
            <h2 className="rn-display mt-5 text-[clamp(2.2rem,6vw,4.5rem)] font-bold uppercase tracking-tight text-[var(--rn-ivory)]">See It Spin</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--rn-ivory-dim)] md:text-base">
              Interactive prototype table proof — test layout, chips, and single-zero wheel mechanics directly in browser.
            </p>
          </div>
          <div
            className="rn-reveal rn-plate group relative mx-auto overflow-hidden rounded-sm border border-[rgba(201,162,39,0.22)] bg-[var(--rn-walnut)] p-6 shadow-[inset_0_2px_12px_rgba(11,10,8,0.85)] md:p-10"
            data-art-slot="gameplay-table-proof"
          >
            <CornerFrame />
            {/* Table HUD header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(201,162,39,0.15)] pb-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[var(--rn-oxblood)] border border-[rgba(201,162,39,0.5)]" />
                <span className="rn-mono text-xs uppercase tracking-widest text-[var(--rn-ivory)]">Interactive Felt Prototype</span>
              </div>
              <div className="flex items-center gap-6">
                <Meta>Ante Target: <span className="text-[var(--rn-brass)] font-bold">350 PTS</span></Meta>
                <Meta>Spins Left: <span className="text-[var(--rn-ivory)] font-bold">4 / 4</span></Meta>
                <Meta>Stake: <span className="text-[var(--rn-felt-hi)] font-bold">$100</span></Meta>
              </div>
            </div>

            {/* Interactive Grid & Wheel Showcase */}
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_360px]">
              {/* Felt layout */}
              <div className="space-y-3">
                <div className="rn-mono text-[10px] uppercase tracking-widest text-[var(--rn-ivory-dim)]">Outside &amp; Inside Bet Layout</div>
                <div className="grid grid-cols-12 gap-1.5 text-center text-xs font-bold">
                  {/* Zero */}
                  <div className="col-span-12 flex h-10 items-center justify-center rounded-sm border border-[rgba(29,94,63,0.4)] bg-[var(--rn-felt)] text-[var(--rn-ivory)]">
                    0 (GREEN)
                  </div>
                  {/* Quick sample grid 1-12 */}
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => {
                    const isRed = [1,3,5,7,9,12].includes(num);
                    return (
                      <div
                        key={num}
                        className={`col-span-3 flex h-12 items-center justify-center rounded-sm border transition-transform hover:scale-[1.02] ${
                          isRed
                            ? "border-[rgba(142,27,43,0.5)] bg-[var(--rn-oxblood)] text-[var(--rn-ivory)]"
                            : "border-[rgba(201,162,39,0.2)] bg-[var(--rn-ink)] text-[var(--rn-ivory-dim)]"
                        }`}
                      >
                        <span className="relative z-10">{num}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Outside bets row */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px] font-bold uppercase">
                  <div className="rounded-sm border border-[var(--rn-oxblood)] bg-[rgba(91,18,32,0.3)] py-2.5 text-[var(--rn-ivory)]">1ST 12 (2:1)</div>
                  <div className="rounded-sm border border-[var(--rn-oxblood)] bg-[var(--rn-oxblood)] py-2.5 text-[var(--rn-ivory)]">RED (1:1)</div>
                  <div className="rounded-sm border border-[rgba(201,162,39,0.2)] bg-[var(--rn-ink)] py-2.5 text-[var(--rn-ivory-dim)]">BLACK (1:1)</div>
                  <div className="rounded-sm border border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.1)] py-2.5 text-[var(--rn-brass)]">EVEN (1:1)</div>
                </div>
              </div>

              {/* Mini roulette wheel preview */}
              <div className="relative mx-auto aspect-square w-full max-w-[280px]">
                <RouletteWheel className="h-full w-full" />
              </div>
            </div>

            {/* Micro chip stack accent */}
            <div className="rn-rule-knurl-l mt-8 flex items-center justify-between pt-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="rn-mono text-[10px] text-[var(--rn-ivory-dim)] uppercase tracking-wider">Select Chip:</span>
                {[1, 5, 10, 25, 50].map((val) => (
                  <span
                    key={val}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.15)] text-[10px] font-bold text-[var(--rn-ivory)] shadow-sm"
                  >
                    {val}
                  </span>
                ))}
              </div>
              <span className="rn-mono text-[10px] text-[var(--rn-ivory-dim)] uppercase tracking-widest">
                Godot 4.7 Engine Core
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 6 · WISHLIST ════ */}
      <section id="wishlist" className="relative mx-auto w-full max-w-[1400px] overflow-hidden px-6 py-28 text-center md:py-40">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[640px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(91,18,32,0.15)] blur-[110px]" />
        <div className="rn-reveal relative z-10">
          <IndexLabel index="05" label="Play" className="justify-center" />
          <h2 className="rn-display mt-5 text-[clamp(2.6rem,9vw,6.5rem)] font-bold uppercase leading-[0.82] tracking-tight text-[var(--rn-ivory)]">
            Take the <span className="text-[var(--rn-oxblood)]">House</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base font-normal text-[var(--rn-ivory-dim)] md:text-lg">
            Rouge &amp; Noir is in development. Wishlist it, try the demo, or follow OKISO for the drop.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              title="Store link slot — wire up on launch"
              className="rn-focus inline-flex items-center gap-2 rounded-full bg-[var(--rn-oxblood)] px-9 py-5 text-sm font-bold uppercase tracking-widest text-[var(--rn-ivory)] shadow-[0_8px_32px_rgba(91,18,32,0.55)] md:text-base"
            >
              Wishlist <span className="rounded-full bg-[rgba(11,10,8,0.5)] px-2 py-0.5 text-[9px] tracking-wider text-[var(--rn-ivory-dim)]">Soon</span>
            </MagneticButton>
            <MagneticButton
              title="Demo link slot — wire up on launch"
              className="rn-focus inline-flex items-center gap-2 rounded-full border border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.1)] px-9 py-5 text-sm font-bold uppercase tracking-widest text-[var(--rn-brass)] md:text-base"
            >
              Play Demo <span className="rounded-full bg-[rgba(201,162,39,0.2)] px-2 py-0.5 text-[9px] tracking-wider">Soon</span>
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://discord.gg/okiso"
              target="_blank"
              rel="noopener noreferrer"
              strength={0.2}
              className="rn-focus inline-flex items-center gap-2 rounded-sm border border-[rgba(201,162,39,0.25)] bg-[rgba(59,36,23,0.4)] px-9 py-5 text-sm font-bold uppercase tracking-widest text-[var(--rn-ivory)] md:text-base"
            >
              Follow OKISO
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="relative w-full overflow-hidden border-t border-[rgba(201,162,39,0.2)] bg-[var(--rn-ink)] px-8 py-24 text-center md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(91,18,32,0.25),transparent_60%)]" />
        <h2 className="rn-display relative z-10 text-[clamp(2.4rem,14vw,11rem)] font-bold uppercase leading-[0.72] tracking-tight text-[var(--rn-ivory)]">
          Rouge<span className="text-[var(--rn-oxblood)]">&amp;</span>Noir
        </h2>
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-[0.25em] text-[var(--rn-ivory-dim)] md:gap-10 md:text-sm">
          <Link href="/" className="rn-focus transition-colors hover:text-[var(--rn-ivory)]">OKISO Home</Link>
          <Link href="/#archive" className="rn-focus transition-colors hover:text-[var(--rn-ivory)]">Music</Link>
          <a href="https://discord.gg/okiso" target="_blank" rel="noopener noreferrer" className="rn-focus transition-colors hover:text-[var(--rn-ivory)]">Discord</a>
        </div>
        <p className="relative z-10 mt-8 rn-mono text-[10px] uppercase tracking-[0.3em] text-[rgba(196,183,158,0.5)]">
          © {new Date().getFullYear()} OKISO · A game by OKISO
        </p>
      </footer>
    </div>
  );
}

/* ── charm card: printed card stock (ivory ground, brass border, oxblood/felt/ink styling, tiny corner ornaments) ── */
function CharmCard({ charm }: { charm: (typeof CHARMS)[number] }) {
  return (
    <div
      className="rn-reveal rn-charm-card group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[3px] border border-[rgba(201,162,39,0.4)] bg-[var(--rn-ivory)] p-5 shadow-[inset_0_1px_4px_rgba(11,10,8,0.15),0_6px_20px_rgba(11,10,8,0.4)] transition-transform duration-500 hover:-translate-y-2"
      data-art-slot={`charm-${charm.name}`}
    >
      <CornerFrame />
      <div className="flex items-center justify-between relative z-10">
        <span className="rn-mono rounded-[2px] border border-[rgba(201,162,39,0.4)] bg-[rgba(196,183,158,0.3)] px-3 py-1 text-[9px] uppercase tracking-widest text-[var(--rn-walnut)] font-bold">
          {charm.tag}
        </span>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold shadow-sm"
          style={{
            background: suitColor(charm.suit),
            color: charm.suit === "gold" ? "var(--rn-ink)" : "var(--rn-ivory)",
            border: "1px solid rgba(201,162,39,0.4)",
          }}
          aria-hidden
        >
          {charm.pip}
        </span>
      </div>
      <div className="relative z-10 mt-auto pt-6">
        <h3 className="rn-display text-xl font-bold uppercase leading-tight tracking-tight text-[var(--rn-ink)]">{charm.name}</h3>
        <p className="mt-2 text-xs leading-relaxed text-[var(--rn-walnut)] font-medium">{charm.d}</p>
      </div>
    </div>
  );
}

function ScopedStyle() {
  return (
    <style>{`
      .rn-root {
        --rn-ink: #0B0A08;
        --rn-walnut: #3B2417;
        --rn-walnut-hi: #5A3A24;
        --rn-felt: #14452F;
        --rn-felt-hi: #1D5E3F;
        --rn-oxblood: #5B1220;
        --rn-oxblood-hi: #8E1B2B;
        --rn-brass: #C9A227;
        --rn-brass-hi: #E8D08A;
        --rn-brass-dim: #7A6318;
        --rn-ivory: #F2E8D5;
        --rn-ivory-dim: #C4B79E;

        /* Aliases to preserve backward compatibility */
        --rn-crimson: var(--rn-oxblood);
        --rn-crimson-bright: var(--rn-oxblood-hi);
        --rn-crimson-deep: var(--rn-oxblood);
        --rn-gold: var(--rn-brass);
        --rn-gold-bright: var(--rn-brass-hi);
        --rn-gold-deep: var(--rn-brass-dim);
        --rn-green: var(--rn-felt);
        --rn-obsidian: var(--rn-ink);
        --rn-panel: var(--rn-walnut);
        --rn-panel-2: var(--rn-walnut-hi);
        --rn-muted: var(--rn-ivory-dim);

        background:
          radial-gradient(100% 80% at 25% 15%, rgba(201,162,39,0.12) 0%, transparent 60%),
          radial-gradient(80% 60% at 75% 85%, rgba(20,69,47,0.15) 0%, transparent 65%),
          var(--rn-ink);
        color: var(--rn-ivory);
      }

      /* TYPE: Playfair Display for headings/display; Archivo for body & HUD plates */
      .rn-root { font-family: var(--font-rn-body), system-ui, sans-serif; }
      .rn-root h1, .rn-root h2, .rn-root h3, .rn-root .rn-display {
        font-family: var(--font-rn-display), Georgia, serif;
        font-weight: 700;
        letter-spacing: -0.02em;
        text-transform: uppercase;
      }
      .rn-mono {
        font-family: var(--font-rn-body), system-ui, sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-variant-numeric: tabular-nums;
      }

      /* SURFACE: Warm tungsten light source (top-left biased, brass-tinted) */
      .rn-root::before {
        content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 2;
        transform: translateZ(0); will-change: transform; contain: strict;
        background:
          /* tungsten bulb: tight warm core, amber not brass — brass over ink
             goes olive/sickly. Kept low so it lights, never tints. */
          radial-gradient(46% 38% at 22% 10%, rgba(255,196,120,0.11), rgba(255,170,90,0.05) 45%, transparent 78%),
          /* room falloff */
          radial-gradient(115% 105% at 50% 45%, transparent 38%, rgba(11,10,8,0.72) 100%);
      }

      body:has(.rn-root) [data-okiso-chrome] { display: none !important; }
      .rn-gold-text {
        background: linear-gradient(100deg, var(--rn-brass-dim), var(--rn-brass-hi) 45%, var(--rn-brass) 60%, var(--rn-brass-dim));
        background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
        animation: rn-shimmer 6s linear infinite;
      }
      .rn-nav[data-solid="true"] {
        background: rgba(11,10,8,0.92);
        border-bottom: 1px solid rgba(201,162,39,0.22);
        box-shadow: 0 4px 20px rgba(11,10,8,0.8);
      }
      .rn-nav[data-hidden="true"] { transform: translateY(-100%); }

      /* MOTION: Decaying ball orbit & controlled wheel rotation */
      .rn-wheel-spin { animation: rn-spin 45s cubic-bezier(0.4,0,0.2,1) infinite; }
      .rn-cone-spin { animation: rn-spin-rev 30s linear infinite; }
      .rn-ball-ride { animation: rn-spin 45s cubic-bezier(0.4,0,0.2,1) infinite; }
      .rn-ball-orbit { animation: rn-ball-decay 8s cubic-bezier(0.1,0.6,0.2,1) forwards; }
      .rn-ball-drop { animation: rn-ball-drop 8s cubic-bezier(0.1,0.6,0.2,1) forwards; }
      .rn-float { animation: rn-float 7s ease-in-out infinite; }
      .rn-ticker { animation: rn-track 26s linear infinite; }
      .rn-ticker-rev { animation-direction: reverse; }

      /* GRAIN: 0.12 soft-light */
      .rn-grain {
        position: fixed; inset: 0; pointer-events: none; z-index: 90; opacity: 0.10;
        /* No mix-blend-mode: blending a full-viewport fixed layer re-composites
           the whole screen every frame and was the main scroll-lag source.
           Pixelated upscale of a tiny tile = chunky vintage grain, ~free. */
        image-rendering: pixelated;
        background-size: 180px 180px;
        transform: translateZ(0);
        will-change: transform;
        contain: strict;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }

      /* VIEWPORT FRAME: Engraved brass double-rule */
      .rn-frame {
        position: fixed; inset: 10px; pointer-events: none; z-index: 80;
        transform: translateZ(0); contain: strict;
        border: 1px solid rgba(201,162,39,0.25);
        outline: 1px solid rgba(201,162,39,0.15);
        outline-offset: -4px;
      }
      .rn-plate { position: relative; }
      /* Step contrast is substrate-dependent: 18% brass reads over ink, but the
         plates sit on walnut and the staircase disappears into it. Static
         declarations only — a custom property is only expensive when it is
         REWRITTEN at runtime on an inherited root (see docs/HANDOFF.md). */
      .rn-frame::before { --rn-step: rgba(201,162,39,0.18); }
      .rn-plate::before { --rn-step: rgba(201,162,39,0.34); }
      .rn-frame::before, .rn-plate::before {
        content: ""; position: absolute; inset: 0; pointer-events: none;
        background-image:
          /* TL */
          linear-gradient(rgba(201,162,39,0.65), rgba(201,162,39,0.65)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          /* TR */
          linear-gradient(rgba(201,162,39,0.65), rgba(201,162,39,0.65)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          /* BL */
          linear-gradient(rgba(201,162,39,0.65), rgba(201,162,39,0.65)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          /* BR */
          linear-gradient(rgba(201,162,39,0.65), rgba(201,162,39,0.65)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step)),
          linear-gradient(var(--rn-step), var(--rn-step));
        background-position:
          /* TL */
          left 0 top 0, left 0 top 0, left 2px top 2px, left 4px top 4px, left 0 top 0, left 2px top 2px, left 4px top 4px,
          /* TR */
          right 0 top 0, right 0 top 0, right 2px top 2px, right 4px top 4px, right 0 top 0, right 2px top 2px, right 4px top 4px,
          /* BL */
          left 0 bottom 0, left 0 bottom 0, left 2px bottom 2px, left 4px bottom 4px, left 0 bottom 0, left 2px bottom 2px, left 4px bottom 4px,
          /* BR */
          right 0 bottom 0, right 0 bottom 0, right 2px bottom 2px, right 4px bottom 4px, right 0 bottom 0, right 2px bottom 2px, right 4px bottom 4px;
        background-size:
          /* TL */
          2px 2px, 12px 2px, 8px 2px, 4px 2px, 2px 12px, 2px 8px, 2px 4px,
          /* TR */
          2px 2px, 12px 2px, 8px 2px, 4px 2px, 2px 12px, 2px 8px, 2px 4px,
          /* BL */
          2px 2px, 12px 2px, 8px 2px, 4px 2px, 2px 12px, 2px 8px, 2px 4px,
          /* BR */
          2px 2px, 12px 2px, 8px 2px, 4px 2px, 2px 12px, 2px 8px, 2px 4px;
        background-repeat: no-repeat;
      }
      .rn-frame::before { inset: -1px; }
      .rn-frame::after { display: none; }
      .rn-plate::after {
        content: ""; position: absolute; inset: 3px; pointer-events: none;
        border: 2px solid rgba(201,162,39,0.14); border-radius: inherit;
      }
      .rn-rule-knurl {
        background-image:
          repeating-linear-gradient(90deg, rgba(201,162,39,0.6) 0 2px, transparent 2px 4px),
          linear-gradient(rgba(201,162,39,0.35), rgba(201,162,39,0.35));
        background-position: right 0 top 0, left 0 top 0;
        background-size: 12px 1px, calc(100% - 12px) 1px;
        background-repeat: no-repeat;
      }
      .rn-rule-knurl-l {
        background-image:
          repeating-linear-gradient(90deg, rgba(201,162,39,0.6) 0 2px, transparent 2px 4px),
          linear-gradient(rgba(201,162,39,0.35), rgba(201,162,39,0.35));
        background-position: left 0 top 0, right 0 top 0;
        background-size: 12px 1px, calc(100% - 12px) 1px;
        background-repeat: no-repeat;
      }
      .rn-charm-card::after {
        content: ""; position: absolute; inset: 0; pointer-events: none;
        background-image:
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55)),
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55)),
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55)),
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55)),
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55)),
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55)),
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55)),
          linear-gradient(rgba(201,162,39,0.55), rgba(201,162,39,0.55));
        background-position:
          left 4px top 4px, left 4px top 4px,
          right 4px top 4px, right 4px top 4px,
          left 4px bottom 4px, left 4px bottom 4px,
          right 4px bottom 4px, right 4px bottom 4px;
        background-size:
          6px 2px, 2px 6px,
          6px 2px, 2px 6px,
          6px 2px, 2px 6px,
          6px 2px, 2px 6px;
        background-repeat: no-repeat;
      }
      @media (max-width: 640px) { .rn-frame { display: none; } }

      .rn-focus:focus-visible { outline: 2px solid var(--rn-brass); outline-offset: 3px; border-radius: 2px; }
      .rn-char { will-change: transform; }

      @keyframes rn-spin {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(190deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes rn-spin-rev { to { transform: rotate(-360deg); } }
      @keyframes rn-ball-decay {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(1260deg); }
      }
      @keyframes rn-ball-drop {
        0%, 60% { transform: translateY(0); }
        75% { transform: translateY(18px); }
        85% { transform: translateY(15px); }
        92%, 100% { transform: translateY(16px); }
      }
      @keyframes rn-float { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-8px);} }
      @keyframes rn-shimmer { to { background-position: 220% 0; } }
      @keyframes rn-track { to { transform: translateX(-25%); } }

      @media (prefers-reduced-motion: reduce) {
        .rn-root .rn-wheel-spin, .rn-root .rn-cone-spin, .rn-root .rn-ball-ride, .rn-root .rn-ball-orbit, .rn-root .rn-ball-drop,
        .rn-root .rn-float, .rn-root .rn-ticker, .rn-root .rn-gold-text { animation: none !important; }
        .rn-root .rn-grain { display: none; }
        .rn-root .rn-ball-orbit { transform: rotate(1260deg); }
        .rn-root .rn-ball-drop { transform: translateY(16px); }
      }
    `}</style>
  );
}
