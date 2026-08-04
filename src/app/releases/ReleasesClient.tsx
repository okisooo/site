"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { OrbitGallery } from "@/Components/3D/OrbitGallery"
import { staticReleases, Release } from "@/data/releases"
import { Play, X } from "lucide-react"
import { PlayReleaseButton } from "@/Components/PlayReleaseButton"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { getReleaseListenTarget } from "@/lib/releaseLinks"
import { Archivo, JetBrains_Mono, Noto_Sans_JP } from "next/font/google"

const tacDisplay = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-tac-display" })
const tacMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-mono" })
const tacCjk = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-cjk" })

export default function ReleasesClient() {
  const [viewMode, setViewMode] = useState<"list" | "orbit">("list")
  const [hoveredRelease, setHoveredRelease] = useState<Release | null>(null)
  const [pinnedRelease, setPinnedRelease] = useState<Release | null>(null)

  const selectedRelease = pinnedRelease ?? hoveredRelease

  useEffect(() => {
    if (viewMode === "orbit" || pinnedRelease) {
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
        "data-premid-release-title": pinnedRelease.title,
        "data-premid-release-cover": pinnedRelease.img
      } : {})}
      className={`${tacDisplay.variable} ${tacMono.variable} ${tacCjk.variable} w-full min-h-screen bg-[var(--tac-bone)] text-[var(--tac-ink)] dark:bg-[#0c0c0e] dark:text-[#f0f0ed] relative transition-colors duration-500 ${viewMode === "orbit" ? "overflow-hidden" : ""}`}
    >
      {/* ─── NAVIGATION & TOGGLE HEADER ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Left: Back Button */}
          <Link
            href="/"
            className="pointer-events-auto tac-cta-ghost self-start md:self-auto bg-[var(--tac-bone)] dark:bg-[#0c0c0e]"
          >
            ← Back
          </Link>

          {/* Center: View Toggle */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 bg-[var(--tac-bone)] dark:bg-[#0c0c0e] border border-black/20 dark:border-white/20">
            <button
              onClick={() => setViewMode("list")}
              data-on={viewMode === "list"}
              className="tac-toggle"
            >
              LIST VIEW
            </button>
            <button
              onClick={() => setViewMode("orbit")}
              data-on={viewMode === "orbit"}
              className="tac-toggle"
            >
              3D ORBIT
            </button>
          </div>

          {/* Right: Upcoming Button */}
          <Link
            href="/upcoming"
            className="pointer-events-auto hidden md:inline-flex tac-cta self-end md:self-auto"
          >
            Upcoming →
          </Link>
        </div>
      </div>

      {/* ─── TITLE OVERLAY (Only in Orbit Mode) ─── */}
      {viewMode === "orbit" && (
        <div className="absolute top-24 left-0 right-0 z-40 pointer-events-none flex flex-col items-center">
          <div className="tac-sec-head">
            <span className="tac-sec-index">001</span>
            <span className="tac-rule" />
            <span className="tac-sec-label">3D ORBIT ARCHIVE</span>
          </div>
          <h1 className="tac-h2 text-white">DISCOGRAPHY</h1>
          <p className="tac-mono text-xs text-white/70 uppercase tracking-[0.25em] mt-2">
            Interactive Visualisation
          </p>
        </div>
      )}

      {/* ─── 3D ORBIT VIEW ─── */}
      {viewMode === "orbit" && (
        <div className="absolute inset-0 w-full h-full bg-[#0c0c0e]">
          <Canvas camera={{ position: [-8, 2, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <OrbitGallery
              onHoverRelease={setHoveredRelease}
              onClickRelease={setPinnedRelease}
            />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>

          {/* Selected Release Overlay (Bottom Left) */}
          <div
            className={`absolute bottom-6 md:bottom-10 left-4 md:left-10 z-40 tac-plate tac-plate-mark bg-[#0c0c0e]/90 p-6 transition-all duration-300 max-w-[calc(100%-2rem)] md:max-w-md ${selectedRelease ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
          >
            {selectedRelease && (
              <div className="flex flex-col gap-4 text-white">
                <span className="tac-mono text-xs uppercase tracking-[0.25em] text-[var(--tac-signal)]">
                  {selectedRelease.albumType} {"//"} {selectedRelease.year}
                </span>
                <h2 className="tac-display font-black text-2xl md:text-3xl uppercase tracking-tight leading-none text-white">
                  {selectedRelease.title}
                </h2>
                <p className="tac-mono text-xs text-[#74747e] uppercase tracking-[0.2em]">
                  {selectedRelease.tracks?.length || 1} Tracks
                </p>
                {pinnedRelease && (
                  <button
                    onClick={() => setPinnedRelease(null)}
                    className="self-start tac-mono text-xs uppercase tracking-[0.2em] text-[#74747e] hover:text-[var(--tac-signal)] transition-colors"
                  >
                    Close
                  </button>
                )}
                <div className="mt-2 flex gap-3 flex-wrap">
                  <PlayReleaseButton release={selectedRelease} />
                  <a
                    href={getReleaseListenTarget(selectedRelease).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tac-cta-ghost border-white/30 text-white hover:border-[var(--tac-signal)] hover:text-[var(--tac-signal)]"
                  >
                    {getReleaseListenTarget(selectedRelease).label}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── LIST VIEW ─── */}
      {viewMode === "list" && (
        <div className="w-full max-w-7xl mx-auto pt-32 md:pt-40 pb-24 px-4 md:px-8">
          <div className="flex flex-col mb-12">
            <div className="tac-sec-head">
              <span className="tac-sec-index">001</span>
              <span className="tac-rule" />
              <span className="tac-sec-label">DISCOGRAPHY / 盤</span>
            </div>
            <h1 className="tac-h2">
              DISCOGRAPHY
            </h1>
            <p className="tac-mono text-xs font-bold uppercase tracking-[0.25em] text-[var(--tac-steel)] mt-3 md:mt-4">
              {staticReleases.length} RELEASES // FULL ARCHIVE
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {staticReleases.map((release) => (
              <button
                key={release.id}
                onClick={() => setPinnedRelease(release)}
                className="tac-plate group flex flex-col items-start text-left p-4 md:p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-full aspect-square overflow-hidden mb-6 bg-black/10 border border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15">
                  <Image
                    src={release.img}
                    alt={release.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-[var(--tac-signal)] text-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 border border-white/30">
                      <Play fill="currentColor" size={20} className="ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <span className="tac-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--tac-signal)] mb-2">
                    {release.year} {"//"} {release.albumType}
                  </span>
                  <h3 className="tac-display font-black text-xl md:text-2xl uppercase tracking-tight text-[var(--tac-ink)] dark:text-[var(--tac-bone)] leading-tight mb-2 line-clamp-2">
                    {release.title}
                  </h3>
                  <p className="tac-mono text-xs font-bold text-[var(--tac-steel)] mt-auto">
                    {release.tracks?.length || 1} TRACKS
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Upcoming Button Fallback */}
          <div className="mt-16 flex justify-center md:hidden">
            <Link
              href="/upcoming"
              className="tac-cta"
            >
              UPCOMING RELEASES →
            </Link>
          </div>
        </div>
      )}

      {/* ─── UNIVERSAL MODAL ─── */}
      <AnimatePresence>
        {viewMode === "list" && pinnedRelease && (
          <div
            className="tac-modal-back"
            onClick={() => setPinnedRelease(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="tac-modal tac-plate tac-plate-mark"
            >
              <button
                onClick={() => setPinnedRelease(null)}
                className="absolute top-4 right-4 p-2 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 hover:bg-[var(--tac-signal)] hover:border-[var(--tac-signal)] hover:text-white transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="relative w-full aspect-square overflow-hidden mb-6 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20">
                <Image src={pinnedRelease.img} alt={pinnedRelease.title} fill sizes="(max-width: 640px) 90vw, 380px" className="object-cover" />
              </div>

              <div className="text-center mb-8">
                <h3 className="tac-display text-2xl md:text-3xl font-black tracking-tight uppercase mb-1 text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">{pinnedRelease.title}</h3>
                <p className="tac-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--tac-steel)]">
                  {pinnedRelease.year} {"//"} {pinnedRelease.albumType}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <PlayReleaseButton release={pinnedRelease} />
                <a
                  href={getReleaseListenTarget(pinnedRelease).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tac-cta justify-center"
                >
                  {getReleaseListenTarget(pinnedRelease).label}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
