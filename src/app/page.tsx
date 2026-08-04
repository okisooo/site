"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Archivo, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import TacticalHero from "@/Components/Tactical/TacticalHero";
import TacticalBoot from "@/Components/Tactical/TacticalBoot";
import CustomVideoPlayer from "@/Components/BA/CustomVideoPlayer";
import SocialGrid from "@/Components/BA/SocialGrid";
import ReleaseGrid from "@/Components/BA/ReleaseGrid";
import { FaPlay } from "react-icons/fa";

import GridPattern from "@/Components/MagicUI/GridPattern";

const VRMViewer = dynamic(() => import("@/Components/VRM/VRMViewer"), {
  ssr: false,
  // Nothing here: the hero already shows the static character plate underneath,
  // so a spinner would just flash a competing loading state on top of it.
  loading: () => null,
});

import { useTwitchLive } from '@/hooks/useTwitchLive';
import { FeaturedVideo, useFeaturedVideos } from '@/hooks/useFeaturedVideos';

/* Tactical type stack. Archivo 900 is the display face — a heavy grotesk holds
   the reference's weight where a condensed one would read as sport, not system.
   JetBrains Mono carries the entire annotation layer; Noto Sans JP the CJK marks. */
const tacDisplay = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-tac-display" });
const tacMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-mono" });
const tacCjk = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-cjk" });

const siteUrl = 'https://okiso.net';

const musicGroupLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "OKISO",
  "alternateName": "オキソ",
  "url": siteUrl,
  "image": "https://okiso.net/og_image.png",
  "description": "OKISO, at your command! A VTuber, VOCALOID producer, and virtual artist making original hyperpop, electronic, and Japanese-styled VOCALOID music.",
  "sameAs": [
    "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm",
    "https://www.instagram.com/okisooo_/",
    "https://github.com/okisooo",
    "https://x.com/okisooo_",
    "https://www.youtube.com/@okiso7",
    "https://discord.gg/okiso",
    "https://okiso.bandcamp.com/"
  ]
};

const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": siteUrl,
  "name": "OKISO",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  const { isLive } = useTwitchLive('okiso');
  const [showFeaturedWhileLive, setShowFeaturedWhileLive] = useState(false);
  const { videos, isLoading: videosLoading, error: videosError } = useFeaturedVideos();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [loadVRM, setLoadVRM] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };
  const [activeVideo, setActiveVideo] = useState<FeaturedVideo | null>(null);

  const showingLive = isLive && !showFeaturedWhileLive;

  useEffect(() => {
    if (!isLive) {
      setShowFeaturedWhileLive(false);
    }
  }, [isLive]);

  useEffect(() => {
    if (videos.length === 0) {
      setActiveVideo(null);
      return;
    }

    const activeStillExists = activeVideo ? videos.some((video) => video.id === activeVideo.id) : false;
    if (!activeStillExists) {
      setActiveVideo(videos[0]);
    }
  }, [videos, activeVideo]);

  useEffect(() => {
    if (loadVRM) return;

    // 1. Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // 2. Never auto-load on a constrained connection
    if (typeof navigator !== "undefined") {
      const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      if (conn) {
        if (conn.saveData) return;
        if (["slow-2g", "2g", "3g"].includes(conn.effectiveType || "")) return;
      }
    }

    // 3. Defer until the page is done painting.
    //
    // NOT an IntersectionObserver: this container lives in the hero, above the
    // fold, so a visibility gate fires immediately on load and would pull 15MB
    // *earlier* than the old timer did. Visibility is the wrong signal for an
    // above-fold asset.
    //
    // Wait for the load event (LCP and critical resources settled), then for an
    // idle callback, so the avatar never competes with first paint. Constrained
    // and reduced-motion visitors fell out above and get the click affordance.
    let idleId: number | undefined;
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return;
      const ric = (window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback;
      if (ric) {
        idleId = ric(() => { if (!cancelled) setLoadVRM(true); }, { timeout: 3000 });
      } else {
        idleId = window.setTimeout(() => { if (!cancelled) setLoadVRM(true); }, 1200);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) {
        const cic = (window as unknown as {
          cancelIdleCallback?: (id: number) => void;
        }).cancelIdleCallback;
        if (cic) cic(idleId);
        else window.clearTimeout(idleId);
      }
    };
  }, [loadVRM]);

  const twitchParent = useMemo(() => {
    if (typeof window === 'undefined') return 'localhost';
    return window.location.hostname || 'localhost';
  }, []);

  return (
    <div
      className={`${tacDisplay.variable} ${tacMono.variable} ${tacCjk.variable} min-h-screen bg-transparent text-black dark:text-white overflow-x-hidden font-display selection:bg-[#e6112b] selection:text-white transition-colors duration-500 relative`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@graph": [musicGroupLd, webSiteLd] }) }}
      />

      <TacticalBoot />

      {/* ─── TACTICAL HERO ─── */}
      <TacticalHero
        className={`${tacDisplay.variable} ${tacMono.variable} ${tacCjk.variable}`}
        nav={
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 md:gap-x-6">
            <a href="#archive" className="tac-navlink">Archive</a>
            <a href="#social" className="tac-navlink">Social</a>
            <button onClick={() => setIsContactOpen(true)} className="tac-navlink">Contact</button>
          </nav>
        }
        subject={
          loadVRM ? (
            <VRMViewer modelUrl="/model.vrm" className="w-full h-full" />
          ) : (
            <div
              role="button"
              tabIndex={0}
              aria-label="Load interactive 3D model"
              onClick={() => setLoadVRM(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLoadVRM(true);
                }
              }}
              className="group relative flex h-full w-full cursor-pointer items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tac-signal)]"
            >
              <img
                src="/hero_character.webp"
                alt="OKISO Character Preview"
                className="pointer-events-none max-h-full w-auto select-none object-contain opacity-95 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="tac-mono absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-2 border border-[var(--tac-ink)]/25 bg-[var(--tac-bone)]/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--tac-ink)] backdrop-blur-sm transition-colors group-hover:border-[var(--tac-signal)] group-hover:text-[var(--tac-signal)]">
                <span className="h-1.5 w-1.5 bg-[var(--tac-signal)]" />
                Load 3D Model
              </span>
            </div>
          )
        }
      >
        <a href="#archive" className="tac-cta">
          <FaPlay className="text-[10px]" /> Latest Release
        </a>
        <a href="#social" className="tac-cta-ghost">
          Channels
        </a>
      </TacticalHero>

      {/* ─── KINETIC DIVIDER ─── */}
      {/* Ink band, not the old pink one. A saturated pink slab directly under a
          near-monochrome hero broke the palette discipline the whole look
          depends on — red stays the only signal colour, spent sparingly. */}
      <div className={`tac-band ${tacMono.variable}`}>
        <Marquee speed={38} gradient={false} autoFill className="overflow-hidden">
          <div className="tac-band-row">
            <span>SYSTEM.ARCHIVE.ONLINE</span>
            <span className="tac-band-dot" />
            <span className="tac-band-dim">音 CH.01</span>
            <span className="tac-band-dot" />
            <span>OKISO // オキソ</span>
            <span className="tac-band-dot" />
            <span className="tac-band-sig">● REC</span>
            <span className="tac-band-dot" />
          </div>
        </Marquee>
      </div>

      {/* ─── MEDIA & SOCIAL SHOWCASE ─── */}
      <section id="social" className="tac-section">
        <div className="flex flex-col xl:flex-row gap-12 md:gap-24">

          {/* Main Video Feature */}
          <div className="w-full xl:w-7/12 flex flex-col gap-6 md:gap-10">
            <div>
              <div className="tac-sec-head">
                <span className="tac-sec-index">003</span>
                <span className="tac-rule" />
                <span className="tac-sec-label">{showingLive ? "Broadcast / 配信" : "Feed / 映像"}</span>
              </div>
              <h2 className="tac-h2">
                {showingLive ? "Live" : "Featured"}
                <br />
                <span className="tac-h2-dim">{showingLive ? "Broadcast" : "Videos"}</span>
              </h2>
            </div>
            {isLive && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFeaturedWhileLive(false)}
                  data-on={!showFeaturedWhileLive}
                  className="tac-toggle"
                >
                  Live Broadcast
                </button>
                <button
                  onClick={() => setShowFeaturedWhileLive(true)}
                  data-on={showFeaturedWhileLive}
                  className="tac-toggle"
                >
                  Featured Videos
                </button>
              </div>
            )}
            {(isLive || videosLoading || activeVideo) && (
              <div className="tac-plate tac-plate-mark group relative w-full aspect-video bg-black p-1.5 md:p-2">
                {showingLive ? (
                  <iframe
                    src={`https://player.twitch.tv/?channel=okiso&parent=${twitchParent}`}
                    height="100%"
                    width="100%"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : activeVideo ? (
                  <CustomVideoPlayer
                    key={activeVideo.id}
                    src={activeVideo.src}
                    hlsUrl={activeVideo.hlsUrl}
                    streamUrl={activeVideo.streamUrl}
                    sourceUrl={activeVideo.sourceUrl}
                    poster={activeVideo.poster}
                    title={activeVideo.title}
                    className="w-full h-full"
                  />
                ) : videosLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-white/70 font-bold tracking-widest uppercase">
                    Loading videos...
                  </div>
                ) : null}
              </div>
            )}

            {!showingLive && !videosLoading && !activeVideo && (
              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 md:p-8">
                <p className="font-black uppercase tracking-widest text-black/60 dark:text-white/75">No website videos published yet.</p>
                {videosError && <p className="mt-2 text-xs font-bold text-black/40 dark:text-white/70">Feed error: {videosError}</p>}
              </div>
            )}

            {!showingLive && videos.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videos.slice(0, 6).map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    data-on={activeVideo?.id === video.id}
                    className="tac-toggle truncate text-left"
                  >
                    <p className="truncate">{video.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Social Ecosystem */}
          <div className="w-full xl:w-5/12 flex flex-col gap-6 md:gap-12">
            <div className="mt-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-[rgb(16_16_20_/_0.22)] pb-4 dark:border-[rgb(240_240_237_/_0.18)] md:pb-6 xl:mt-0">
              <h2 className="tac-h2 tac-h2-sub">Network</h2>
              <span className="tac-sec-label">Links // 06</span>
            </div>

            {/* Soft UI grid container */}
            <div className="tac-plate tac-plate-mark flex h-full flex-col justify-center p-4 md:p-10">
              <div className="tac-sec-head">
                <span className="tac-sec-index">004</span>
                <span className="tac-rule" />
                <span className="tac-sec-label">Channels / 経路</span>
              </div>
              <SocialGrid />
            </div>
          </div>

        </div>
      </section>

      {/* ─── AUDIO ARCHIVE SHOWCASE ─── */}
      <section id="archive" className="tac-section">
        <div className="tac-sec-head">
          <span className="tac-sec-index">005</span>
          <span className="tac-rule" />
          <span className="tac-sec-label">Archive / 記録</span>
        </div>
        <ReleaseGrid />
      </section>

      {/* ─── MASSIVE FOOTER ─── */}
      {/* No pink glow and no drop-shadow: this language has one signal colour and
          no soft light. The wordmark is set flush-left and cropped by the edge
          rather than centred, matching the hero's ghost. */}
      <footer id="contact" className="tac-footer">
        <div className="tac-sec-head">
          <span className="tac-sec-index">006</span>
          <span className="tac-rule" />
          <span className="tac-sec-label">End of transmission</span>
        </div>
        <h2 className="tac-footer-mark">OKISO</h2>
        <div className="tac-footer-rule" />
        <div className="tac-footer-row">
          <span>© {new Date().getFullYear()} OKISO · オキソ</span>
          <span className="flex flex-wrap items-center gap-5">
            <button onClick={() => setIsTermsOpen(true)} className="tac-footer-link">Terms</button>
            <button onClick={() => setIsContactOpen(true)} className="tac-footer-link">Contact</button>
            <span>SYSTEM.ARCHIVE.ONLINE</span>
          </span>
        </div>
      </footer>

      {/* TERMS MODAL */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTermsOpen(false)}
          />
          {/* Modal Content */}
          <motion.div
            data-lenis-prevent
            data-premid-modal="terms"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="tac-modal tac-plate tac-plate-mark"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Content Terms</h2>
                <div className="w-16 h-2 bg-ba-pink mt-2"></div>
              </div>
              <button
                onClick={() => setIsTermsOpen(false)}
                className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-ba-pink hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="prose dark:prose-invert max-w-none space-y-6">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-black/80 dark:text-white/90">
                You are free to repost, remix, and reuse my content for creative purposes!
              </p>

              <ul className="space-y-4 font-bold text-black/70 dark:text-white/85">
                <li className="flex items-start gap-4">
                  <span className="text-ba-pink text-2xl leading-none">✓</span>
                  <span><strong>Must include clear credit</strong> linking back to my official channels (OKISO)</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-ba-pink text-2xl leading-none">✓</span>
                  <span><strong>Feel free to clip, edit, and react</strong> to streams and releases</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-ba-red text-2xl leading-none">✗</span>
                  <span><strong>Content must NOT be used</strong> in scopes of harm, denigration, hate speech, or malicious intent</span>
                </li>
              </ul>

              <div className="mt-8 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border-l-4 border-ba-pink">
                <p className="text-sm md:text-base font-bold text-black/60 dark:text-white/75">
                  By using my content, you agree to abide by these simple rules. Have fun creating!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── CONTACT MODAL ─── */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsContactOpen(false)}
          />
          <motion.div
            data-lenis-prevent
            data-premid-modal="contact"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="tac-modal tac-plate tac-plate-mark"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Contact</h2>
                <div className="w-16 h-2 bg-ba-pink mt-2"></div>
              </div>
              <button
                onClick={() => setIsContactOpen(false)}
                className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-ba-pink hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleCopy("oxo@okiso.net", "email")}
                className="w-full flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 hover:bg-ba-pink dark:hover:bg-ba-pink hover:text-white rounded-2xl md:rounded-[32px] transition-all group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Email</span>
                  <span className="text-lg md:text-2xl font-black mt-1">oxo@okiso.net</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {copiedText === "email" ? <span className="font-bold">✓</span> : <span className="font-bold text-xs md:text-sm tracking-widest">COPY</span>}
                </div>
              </button>

              <button
                onClick={() => handleCopy(".oxo", "discord")}
                className="w-full flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 hover:bg-ba-pink dark:hover:bg-ba-pink hover:text-white rounded-2xl md:rounded-[32px] transition-all group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Discord</span>
                  <span className="text-lg md:text-2xl font-black mt-1">.oxo</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {copiedText === "discord" ? <span className="font-bold">✓</span> : <span className="font-bold text-xs md:text-sm tracking-widest">COPY</span>}
                </div>
              </button>
            </div>
            
            <div className="mt-8 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border-l-4 border-ba-pink">
              <p className="text-sm font-bold text-black/60 dark:text-white/75">
                Business inquiries and collaborations welcome! Feel free to copy my handles and reach out directly.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}



