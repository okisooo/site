"use client"

import React, { useState, useEffect } from "react"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import { Play, Pause, X, Disc3, ExternalLink, SkipBack, SkipForward, Repeat, Volume2, VolumeX } from "lucide-react"
import { Archivo, JetBrains_Mono } from "next/font/google"

const tacDisplay = Archivo({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-tac-display" })
const tacMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-mono" })

export function MusicPlayer() {
  const {
    currentTrackId, currentTrackTitle, currentTrackArtist, currentTrackCover, currentTrackLink,
    isPlaying, volume, isLooping, currentTime, duration,
    togglePlayPause, closePlayer, playNext, playPrev, setVolume, toggleLoop, seekTo
  } = useMusicPlayer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const progressPercent = duration ? (currentTime / duration) * 100 : 0
  const volumePercent = volume

  return (
    <div
      data-okiso-chrome="music-player"
      className={`${tacDisplay.variable} ${tacMono.variable} [--tac-bone:#eceae5] [--tac-ink:#101014] [--tac-steel:#74747e] [--tac-signal:#e6112b] dark:[--tac-bone:#0c0c0e] dark:[--tac-ink:#f0f0ed] dark:[--tac-steel:#6e6e78] fixed bottom-6 left-1/2 -translate-x-1/2 z-[51] transition-all duration-300 ${
        currentTrackId ? "translate-y-0 opacity-100 scale-100" : "translate-y-[150%] opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Main Player Container */}
      <div
        className="tac-plate relative bg-[var(--tac-bone)] dark:bg-[#0c0c0e] border border-[rgb(16_16_20_/_0.22)] dark:border-[rgb(240_240_237_/_0.18)] flex flex-col p-3 px-5 gap-2 w-[340px] md:w-[420px] text-[var(--tac-ink)] dark:text-[var(--tac-bone)]"
        id="spotify-embed-container-data"
        data-premid-track-title={currentTrackTitle || ""}
        data-premid-track-artist={currentTrackArtist || ""}
        data-premid-cover-url={currentTrackCover || ""}
        data-premid-link={currentTrackLink || ""}
        data-premid-paused={!isPlaying ? "true" : "false"}
      >

        {/* Main Controls Row */}
        <div className="relative z-10 w-full flex items-center justify-between gap-3">

          {/* Album Cover & Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Album Art */}
            <div className="relative w-10 h-10 shrink-0 overflow-hidden border border-[rgb(16_16_20_/_0.22)] dark:border-[rgb(240_240_237_/_0.18)] bg-black">
              {currentTrackCover ? (
                <img
                  src={currentTrackCover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <Disc3 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1">
              <h4 className="tac-display font-black text-xs uppercase truncate text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">
                {currentTrackTitle || "Loading..."}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 ${isPlaying ? "bg-[var(--tac-signal)] animate-pulse" : "bg-[var(--tac-steel)]"}`} />
                <p className="tac-mono text-[9px] text-[var(--tac-steel)] uppercase tracking-widest truncate">
                  {currentTrackArtist || "OKISO"}
                </p>
              </div>
            </div>
          </div>

          {/* Center Playback Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={playPrev}
              className="flex items-center justify-center w-7 h-7 border border-transparent hover:border-[rgb(16_16_20_/_0.22)] dark:hover:border-[rgb(240_240_237_/_0.18)] text-[var(--tac-steel)] hover:text-[var(--tac-ink)] dark:hover:text-[var(--tac-bone)] transition-all"
              title="Previous Track"
            >
              <SkipBack size={13} fill="currentColor" />
            </button>
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-8 h-8 bg-[var(--tac-ink)] text-[var(--tac-bone)] dark:bg-[var(--tac-bone)] dark:text-[var(--tac-ink)] hover:bg-[var(--tac-signal)] hover:text-white dark:hover:bg-[var(--tac-signal)] dark:hover:text-white transition-colors shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              onClick={playNext}
              className="flex items-center justify-center w-7 h-7 border border-transparent hover:border-[rgb(16_16_20_/_0.22)] dark:hover:border-[rgb(240_240_237_/_0.18)] text-[var(--tac-steel)] hover:text-[var(--tac-ink)] dark:hover:text-[var(--tac-bone)] transition-all"
              title="Next Track"
            >
              <SkipForward size={13} fill="currentColor" />
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-[rgb(16_16_20_/_0.15)] dark:border-[rgb(240_240_237_/_0.15)]">
            {/* Loop Toggle */}
            <button
              onClick={toggleLoop}
              className={`flex items-center justify-center w-7 h-7 border transition-all ${isLooping ? "border-[var(--tac-signal)] text-[var(--tac-signal)]" : "border-transparent text-[var(--tac-steel)] hover:text-[var(--tac-ink)] dark:hover:text-[var(--tac-bone)]"}`}
              title="Toggle Loop"
            >
              <Repeat size={12} />
            </button>

            {/* Volume Inline Expand */}
            <div className="group/volume flex items-center gap-1 transition-all duration-300">
              <button
                onClick={() => setVolume(volume === 0 ? 100 : 0)}
                className="flex items-center justify-center w-7 h-7 text-[var(--tac-steel)] hover:text-[var(--tac-ink)] dark:hover:text-[var(--tac-bone)] transition-colors"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>

              <input
                type="range"
                min="0" max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #e6112b ${volumePercent}%, rgba(120,120,120,0.2) ${volumePercent}%)`
                }}
                className="w-0 opacity-0 group-hover/volume:w-14 group-hover/volume:opacity-100 transition-all duration-300 h-[2px] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[var(--tac-signal)]"
              />
            </div>

            {/* External Spotify link */}
            {currentTrackLink && (
              <a
                href={currentTrackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 text-[var(--tac-steel)] hover:text-[var(--tac-signal)] transition-colors"
                title="Open Album"
              >
                <ExternalLink size={12} />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={closePlayer}
              className="flex items-center justify-center w-7 h-7 text-[var(--tac-steel)] hover:text-[var(--tac-signal)] transition-colors"
              title="Close Player"
            >
              <X size={12} />
            </button>
          </div>

        </div>

        {/* Dynamic Seek Bar */}
        <div className="w-full flex items-center gap-2 px-0.5 mt-0.5 relative z-10">
          <span className="tac-mono text-[8px] text-[var(--tac-steel)] w-6 text-right select-none">
            {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, "0")}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #e6112b ${progressPercent}%, rgba(120,120,120,0.2) ${progressPercent}%)`
            }}
            className="flex-1 h-[2px] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[var(--tac-signal)]"
          />
          <span className="tac-mono text-[8px] text-[var(--tac-steel)] w-6 select-none">
            {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, "0")}
          </span>
        </div>

      </div>
    </div>
  )
}
