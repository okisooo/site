"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { OrbitGallery } from "@/Components/3D/OrbitGallery"
import { Release } from "@/data/releases"

export default function ReleasesPage() {
  const [hoveredRelease, setHoveredRelease] = useState<Release | null>(null)
  const [pinnedRelease, setPinnedRelease] = useState<Release | null>(null)

  const selectedRelease = pinnedRelease ?? hoveredRelease

  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"
    return () => {
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas */}
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
        className={`absolute bottom-24 md:bottom-10 left-5 md:left-10 z-40 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl transition-all duration-500 max-w-[320px] md:max-w-md ${selectedRelease ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        {selectedRelease && (
          <div className="flex flex-col gap-4 text-white">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF7EB3]">{selectedRelease.albumType} {"//"} {selectedRelease.year}</span>
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
            <div className="mt-2">
              <a
                href={selectedRelease.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#FF7EB3] hover:text-white transition-colors"
              >
                LISTEN NOW
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Header Overlay */}
      <div className="absolute top-8 left-0 right-0 z-40 pointer-events-none flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black text-white/90 drop-shadow-2xl uppercase tracking-tighter">DISCOGRAPHY</h1>
        <p className="text-white/60 font-bold tracking-widest uppercase text-sm mt-2">Interactive Archive</p>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-black uppercase tracking-widest hover:bg-[#FF7EB3] hover:text-white transition-colors"
        >
          ← Back
        </Link>
      </div>
    </div>
  )
}
