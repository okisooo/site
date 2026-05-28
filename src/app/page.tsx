"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import CustomVideoPlayer from "@/Components/BA/CustomVideoPlayer";
import SocialGrid from "@/Components/BA/SocialGrid";
import ReleaseGrid from "@/Components/BA/ReleaseGrid";
import { FaPlay } from "react-icons/fa";

import GridPattern from "@/Components/MagicUI/GridPattern";

const VRMViewer = dynamic(() => import("@/Components/VRM/VRMViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[600px]">
      <div className="w-16 h-16 border-4 border-black/10 dark:border-white/10 dark:border-t-white border-t-black rounded-full animate-spin" />
    </div>
  ),
});

import { useTwitchLive } from '@/hooks/useTwitchLive';
import { FeaturedVideo, useFeaturedVideos } from '@/hooks/useFeaturedVideos';

export default function Home() {
  const { isLive } = useTwitchLive('okiso');
  const [showFeaturedWhileLive, setShowFeaturedWhileLive] = useState(false);
  const { videos, isLoading: videosLoading, error: videosError } = useFeaturedVideos();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

  const twitchParent = useMemo(() => {
    if (typeof window === 'undefined') return 'localhost';
    return window.location.hostname || 'localhost';
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white overflow-x-hidden font-display selection:bg-ba-pink selection:text-white transition-colors duration-500 relative">

      {/* ─── MASSIVE HERO ─── */}
      <section className="relative w-full h-[100svh] min-h-[800px] flex flex-col justify-between overflow-hidden bg-white/20 dark:bg-black/10 shadow-2xl z-20 backdrop-blur-3xl transition-colors duration-500">

        {/* Kinetic Background Typography */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center overflow-hidden z-0 opacity-[0.08] dark:opacity-[0.06]">
          <GridPattern
            width={40}
            height={40}
            className="absolute inset-0 h-full w-full mix-blend-overlay dark:mix-blend-color-dodge opacity-50 [mask-image:linear-gradient(to_bottom,white,transparent)]"
          />
          <Marquee speed={40} gradient={false} autoFill>
            <h1 className="text-[25vw] leading-none font-black uppercase whitespace-nowrap px-8 text-black dark:text-white">
              PRODUCER VTUBER
            </h1>
          </Marquee>
          <div className="-mt-[10vh]">
            <Marquee speed={40} direction="right" gradient={false} autoFill>
              <h1 className="text-[25vw] leading-none font-black uppercase whitespace-nowrap px-8 text-transparent stroke-black dark:stroke-white" style={{ WebkitTextStroke: '4px currentColor' }}>
                CREATIVE ARCHIVE
              </h1>
            </Marquee>
          </div>
        </div>

        {/* Top Header Row */}
        <header className="relative z-30 w-full max-w-[2200px] mx-auto p-6 md:p-8 flex justify-between items-center text-sm md:text-xl font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4 bg-white/50 dark:bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
            <span className="w-3 h-3 bg-ba-pink rounded-full animate-pulse shadow-[0_0_10px_rgba(255,126,179,0.8)]" />
            LIVE_SYSTEM // 2026
          </div>

          {/* Slide-out Navigation Menu */}
          <div className="group relative z-40 flex justify-end">
            <div className="flex items-center bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-full border border-black/5 dark:border-white/5 shadow-sm transition-all duration-[800ms] ease-in-out overflow-hidden pr-1 hover:bg-white/80 dark:hover:bg-black/40">
              <div className="flex items-center gap-6 md:gap-8 overflow-hidden max-w-0 opacity-0 px-0 group-hover:max-w-[500px] group-hover:opacity-100 group-hover:pl-8 group-hover:pr-4 transition-all duration-[800ms] ease-in-out whitespace-nowrap">
                <a href="#archive" className="hover:text-ba-pink transition-colors">ARCHIVE</a>
                <a href="#social" className="hover:text-ba-pink transition-colors">SOCIAL</a>
                <button onClick={() => setIsContactOpen(true)} className="hover:text-ba-pink transition-colors">CONTACT</button>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 flex flex-col justify-center items-center gap-[5px] cursor-pointer bg-black/5 dark:bg-white/5 rounded-full my-1 ml-1 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-[800ms]">
                <div className="w-5 h-[2px] rounded-full bg-black dark:bg-white transition-all duration-[800ms] ease-in-out group-hover:-translate-x-1.5 group-hover:w-3 group-hover:bg-ba-pink" />
                <div className="w-5 h-[2px] rounded-full bg-black dark:bg-white transition-all duration-[800ms] ease-in-out group-hover:bg-ba-pink" />
                <div className="w-5 h-[2px] rounded-full bg-black dark:bg-white transition-all duration-[800ms] ease-in-out group-hover:translate-x-1.5 group-hover:w-3 group-hover:bg-ba-pink" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="relative z-20 flex-1 w-full flex flex-col lg:flex-row">

          {/* Left: Bounded Typography */}
          <div className="w-full max-w-[2200px] mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center lg:justify-end pb-0 lg:pb-32 z-30 pointer-events-none">
            <div className="w-full lg:w-[50%]">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto"
              >
                <h1 className="text-[20vw] lg:text-[15vw] leading-[0.75] font-black uppercase tracking-tighter mix-blend-multiply dark:mix-blend-normal">
                  OKISO
                </h1>
                <p className="mt-8 text-lg md:text-2xl lg:text-3xl font-medium max-w-2xl text-black/70 dark:text-white/70 leading-snug">
                  at your command!
                </p>

                <div className="mt-12 flex items-center gap-4 md:gap-6">
                  <a href="#archive" className="bg-black dark:bg-white text-white dark:text-black px-8 md:px-10 py-5 rounded-full text-sm md:text-xl font-bold uppercase tracking-widest hover:bg-ba-pink dark:hover:bg-ba-pink dark:hover:text-white transition-all transform hover:scale-105 flex items-center gap-4 group shadow-xl">
                    <FaPlay className="group-hover:animate-pulse" /> Latest Release
                  </a>
                  <div className="hidden md:block w-16 h-[2px] bg-black/20 dark:bg-white/20" />
                  <span className="hidden md:block text-sm font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40">Scroll Down</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right: VRM Viewer (Anchored to right half) */}
          <div className="w-full h-[50vh] lg:absolute lg:inset-y-0 lg:right-0 lg:w-[50vw] lg:h-full flex items-center justify-center z-10 pointer-events-none">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full flex flex-col justify-center items-center"
            >
              {/* Massive ambient glow behind model */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-ba-pink/20 blur-[120px] rounded-full pointer-events-none mix-blend-overlay dark:mix-blend-lighten" />

              <div className="w-full h-full relative z-10 pointer-events-auto cursor-grab active:cursor-grabbing">
                <VRMViewer modelUrl="/model.vrm" className="w-full h-full" />
              </div>
              {/* Tag removed by user request for cleaner layout */}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Scroll Edge */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-ba-dark/50 to-transparent pointer-events-none z-30" />
      </section>

      {/* ─── KINETIC DIVIDER ─── */}
      <div className="w-full bg-ba-pink py-4 md:py-8 overflow-hidden flex origin-left transform -skew-y-2 relative z-30 shadow-[0_20px_50px_rgba(255,126,179,0.3)] -mt-16 md:-mt-24 border-y-8 border-black dark:border-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Marquee speed={60} gradient={false} autoFill className="overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center whitespace-nowrap gap-4 md:gap-8 px-4 md:px-8 text-black font-black text-2xl md:text-4xl tracking-widest uppercase overflow-hidden py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <span>SYSTEM.ARCHIVE.ONLINE</span>
            <span className="w-3 h-3 md:w-5 md:h-5 bg-black rounded-full shadow-sm flex-shrink-0" />
          </div>
        </Marquee>
      </div>

      {/* ─── MEDIA & SOCIAL SHOWCASE ─── */}
      <section id="social" className="pt-24 md:pt-40 pb-12 md:pb-20 px-4 md:px-12 max-w-[2200px] mx-auto z-20 relative transition-colors duration-500">
        <div className="flex flex-col xl:flex-row gap-12 md:gap-24">

          {/* Main Video Feature */}
          <div className="w-full xl:w-7/12 flex flex-col gap-6 md:gap-12">
            <div className="flex items-center justify-between">
              <h2 className="text-[12vw] xl:text-[6vw] font-black leading-[0.9] uppercase tracking-tighter text-black dark:text-white">
                {showingLive ? "Live" : "Featured"} <br /> <span className="text-black/20 dark:text-white/20">{showingLive ? "Broadcast" : "Videos"}</span>
              </h2>
            </div>
            {isLive && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFeaturedWhileLive(false)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${!showFeaturedWhileLive ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white/70 dark:bg-white/5 border-black/10 dark:border-white/15 hover:bg-white dark:hover:bg-white/10'}`}
                >
                  Live Broadcast
                </button>
                <button
                  onClick={() => setShowFeaturedWhileLive(true)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${showFeaturedWhileLive ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white/70 dark:bg-white/5 border-black/10 dark:border-white/15 hover:bg-white dark:hover:bg-white/10'}`}
                >
                  Featured Videos
                </button>
              </div>
            )}
            {(isLive || videosLoading || activeVideo) && (
              <div className={`w-full aspect-video rounded-[24px] md:rounded-[40px] bg-black shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[8px] md:border-[16px] border-white dark:border-ba-dark-soft relative group`}>
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
                <p className="font-black uppercase tracking-widest text-black/60 dark:text-white/60">No website videos published yet.</p>
                {videosError && <p className="mt-2 text-xs font-bold text-black/40 dark:text-white/40">Feed error: {videosError}</p>}
              </div>
            )}

            {!showingLive && videos.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videos.slice(0, 6).map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`text-left px-4 py-3 rounded-2xl border transition-colors ${activeVideo?.id === video.id ? 'bg-ba-pink text-white border-ba-pink' : 'bg-white/70 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-white/10'}`}
                  >
                    <p className="font-bold text-sm uppercase tracking-wide truncate">{video.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Social Ecosystem */}
          <div className="w-full xl:w-5/12 flex flex-col gap-6 md:gap-12">
            <div className="flex items-end justify-between border-b-8 border-black dark:border-white pb-4 md:pb-6 mt-8 xl:mt-0">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Network</h2>
              <span className="font-bold text-lg md:text-xl tracking-widest text-black/50 dark:text-white/50">LINKS // 06</span>
            </div>

            {/* Soft UI grid container */}
            <div className="bg-white dark:bg-[#111] rounded-[24px] md:rounded-[40px] p-4 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-black/5 dark:border-white/5 h-full flex flex-col justify-center transition-colors">
              <SocialGrid />
            </div>
          </div>

        </div>
      </section>

      {/* ─── AUDIO ARCHIVE SHOWCASE ─── */}
      <section id="archive" className="pb-24 md:pb-40 pt-12 md:pt-20 px-4 md:px-12 max-w-[2200px] mx-auto z-20 relative">
        <ReleaseGrid />
      </section>

      {/* ─── MASSIVE FOOTER ─── */}
      <footer id="contact" className="bg-black dark:bg-[#050505] text-white w-full py-32 md:py-48 px-8 flex flex-col items-center justify-center relative overflow-hidden mt-20 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,var(--tw-gradient-stops))] from-ba-pink/30 via-transparent to-transparent opacity-50 mix-blend-screen pointer-events-none" />
        <h1 className="text-[25vw] font-black uppercase leading-[0.75] tracking-tighter z-10 text-center text-white/90 drop-shadow-[0_0_50px_rgba(255,126,179,0.3)]">
          OKISO
        </h1>
        <div className="relative z-10 mt-12 md:mt-24 flex flex-wrap justify-center gap-6 md:gap-12 text-sm md:text-xl font-bold tracking-[0.2em] uppercase text-white/50">
          <button onClick={() => setIsTermsOpen(true)} className="hover:text-white hover:drop-shadow-[0_0_10px_white] transition-all uppercase">Terms</button>
          <button onClick={() => setIsContactOpen(true)} className="hover:text-white hover:drop-shadow-[0_0_10px_white] transition-all uppercase">Contact</button>
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
            data-premid-modal="terms"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-[#111] text-black dark:text-white w-full max-w-2xl rounded-[24px] md:rounded-[40px] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10"
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
              <p className="text-lg md:text-xl font-medium leading-relaxed text-black/80 dark:text-white/80">
                You are free to repost, remix, and reuse my content for creative purposes!
              </p>

              <ul className="space-y-4 font-bold text-black/70 dark:text-white/70">
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
                <p className="text-sm md:text-base font-bold text-black/60 dark:text-white/60">
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
            data-premid-modal="contact"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-[#111] text-black dark:text-white w-full max-w-xl rounded-[24px] md:rounded-[40px] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10"
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
              <p className="text-sm font-bold text-black/60 dark:text-white/60">
                Business inquiries and collaborations welcome! Feel free to copy my handles and reach out directly.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}



