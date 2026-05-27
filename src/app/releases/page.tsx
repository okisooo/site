"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { OrbitGallery } from "@/Components/3D/OrbitGallery"
import { staticReleases, Release } from "@/data/releases"
import { Play } from "lucide-react"
import { PlayReleaseButton } from "@/Components/PlayReleaseButton"
import { motion, AnimatePresence } from "framer-motion"

export default function ReleasesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'orbit'>('list')
  const [hoveredRelease, setHoveredRelease] = useState<Release | null>(null)
  const [pinnedRelease, setPinnedRelease] = useState<Release | null>(null)

  const selectedRelease = pinnedRelease ?? hoveredRelease

  useEffect(() => {
    // Only lock scrolling when in orbit mode or when a modal is open
    if (viewMode === 'orbit' || pinnedRelease) {
      document.body.style.overflow = "hidden"
      document.body.style.height = "100vh"
    } else {
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    }
  }, [viewMode, pinnedRelease])

  return (
    <div 
      data-premid-page="releases"
      data-premid-view={viewMode}
      {...(pinnedRelease ? { 
        'data-premid-release-title': pinnedRelease.title,
        'data-premid-release-cover': pinnedRelease.img
      } : {})}
      className={`w-full min-h-screen bg-ba-cream dark:bg-black relative transition-colors duration-500 ${viewMode === 'orbit' ? 'overflow-hidden' : ''}`}
    >
      {/* ─── NAVIGATION & TOGGLE HEADER ─── */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] z-50 flex flex-col md:flex-row justify-between items-center p-4 md:p-6 pointer-events-none gap-4 ${viewMode === 'orbit' ? 'dark' : ''}`}>
        
        {/* Left: Back Button */}
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-ba-pink dark:hover:bg-ba-pink dark:hover:text-white transition-colors shadow-lg self-start md:self-auto"
        >
          ← Back
        </Link>

        {/* Center: View Toggle */}
        <div className="pointer-events-auto flex items-center bg-black/10 dark:bg-white/10 backdrop-blur-md p-1 rounded-full border-2 border-black/10 dark:border-white/10 shadow-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm transition-all ${viewMode === 'list' ? 'bg-ba-pink text-white shadow-md' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
          >
            LIST VIEW
          </button>
          <button
            onClick={() => setViewMode('orbit')}
            className={`px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm transition-all ${viewMode === 'orbit' ? 'bg-ba-pink text-white shadow-md' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
          >
            3D ORBIT
          </button>
        </div>

        {/* Right: Upcoming Button (Hidden on very small screens to avoid cramping the header) */}
        <Link
          href="/upcoming"
          className="pointer-events-auto hidden md:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-ba-pink dark:hover:bg-ba-pink dark:hover:text-white transition-colors shadow-lg self-end md:self-auto"
        >
          Upcoming →
        </Link>
      </div>

      {/* ─── TITLE OVERLAY (Only in Orbit Mode) ─── */}
      {viewMode === 'orbit' && (
        <div className="absolute top-24 left-0 right-0 z-40 pointer-events-none flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-white/90 drop-shadow-2xl uppercase tracking-tighter">DISCOGRAPHY</h1>
          <p className="text-white/60 font-bold tracking-widest uppercase text-sm mt-2">Interactive Archive</p>
        </div>
      )}

      {/* ─── 3D ORBIT VIEW ─── */}
      {viewMode === 'orbit' && (
        <div className="absolute inset-0 w-full h-full bg-black">
          <Canvas camera={{ position: [-8, 2, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <OrbitGallery
              onHoverRelease={setHoveredRelease}
              onClickRelease={setPinnedRelease}
            />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          {/* Selected Release Overlay (Bottom Left) - ONLY FOR ORBIT VIEW */}
          <div
            className={`absolute bottom-6 md:bottom-10 left-4 md:left-10 z-40 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl transition-all duration-500 max-w-[calc(100%-2rem)] md:max-w-md ${selectedRelease ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
          >
            {selectedRelease && (
              <div className="flex flex-col gap-4 text-white">
                <span className="text-xs font-black uppercase tracking-widest text-ba-pink">{selectedRelease.albumType} {"//"} {selectedRelease.year}</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none shadow-black drop-shadow-lg">
                  {selectedRelease.title}
                </h2>
                <p className="text-sm font-bold text-white/70">
                  {selectedRelease.tracks?.length || 1} Tracks
                </p>
                {pinnedRelease && (
                  <button
                    onClick={() => setPinnedRelease(null)}
                    className="self-start text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                )}
                <div className="mt-2 flex gap-3 flex-wrap">
                  <PlayReleaseButton release={selectedRelease} />
                  <a
                    href={selectedRelease.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-black font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-ba-pink hover:text-white transition-colors"
                  >
                    LISTEN NOW
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── LIST VIEW ─── */}
      {viewMode === 'list' && (
        <div className="w-full max-w-7xl mx-auto pt-32 md:pt-40 pb-24 px-4 md:px-8">
          <div className="flex flex-col mb-12">
            <h1 className="text-[12vw] md:text-[6vw] leading-none font-black uppercase tracking-tighter text-black dark:text-white">
              DISCOGRAPHY
            </h1>
            <p className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest mt-2 md:mt-4">
              {staticReleases.length} RELEASES // FULL ARCHIVE
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {staticReleases.map((release) => (
              <button
                key={release.id}
                onClick={() => setPinnedRelease(release)}
                className="group flex flex-col items-start text-left bg-white dark:bg-white/5 border-4 border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-6 shadow-xl hover:border-ba-pink dark:hover:border-ba-pink hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-black/5">
                  <img 
                    src={release.img} 
                    alt={release.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-ba-pink text-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <span className="text-xs font-black uppercase tracking-widest text-ba-pink mb-2">
                    {release.year} {"//"} {release.albumType}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white leading-tight mb-2 line-clamp-2">
                    {release.title}
                  </h3>
                  <p className="text-sm font-bold text-black/50 dark:text-white/50 mt-auto">
                    {release.tracks?.length || 1} TRACKS
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Upcoming Button Fallback (since it's hidden in the header for space) */}
          <div className="mt-16 flex justify-center md:hidden">
            <Link
              href="/upcoming"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-ba-pink dark:hover:bg-ba-pink dark:hover:text-white transition-colors shadow-lg"
            >
              UPCOMING RELEASES →
            </Link>
          </div>
        </div>
      )}

      {/* ─── UNIVERSAL MODAL ─── */}
      <AnimatePresence>
        {viewMode === 'list' && pinnedRelease && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setPinnedRelease(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-black/10 dark:border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setPinnedRelease(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors z-10 text-black dark:text-white font-bold"
              >
                ✕
              </button>

              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 shadow-lg border-2 border-black/5 dark:border-white/5">
                <img src={pinnedRelease.img} alt={pinnedRelease.title} className="w-full h-full object-cover" />
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-1 text-black dark:text-white">{pinnedRelease.title}</h3>
                <p className="text-black/50 dark:text-white/50 font-bold tracking-widest text-sm uppercase">
                  {pinnedRelease.year} {'//'} {pinnedRelease.albumType}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <PlayReleaseButton release={pinnedRelease} />
                <a
                  href={pinnedRelease.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-md bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold uppercase tracking-widest text-center transition-colors shadow-md"
                >
                  Listen on Spotify
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
