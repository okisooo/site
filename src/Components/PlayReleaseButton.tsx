"use client"

import React from "react"
import { Play, Pause } from "lucide-react"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import type { Release } from "@/data/releases"

export function PlayReleaseButton({ release, onClose }: { release: Release, onClose?: () => void }) {
  const { playTrack, currentTrackId, isPlaying, togglePlayPause } = useMusicPlayer()
  
  const trackTitle = release.tracks?.[0]?.title || release.title
  const trackLink = release.link

  const handlePlay = () => {
    if (currentTrackId === trackTitle) {
      togglePlayPause()
      return
    }

    playTrack(trackTitle, "OKISO", release.img, trackLink)
    if (onClose) onClose()
  }

  const isActive = currentTrackId === trackTitle

  return (
    <button
      onClick={handlePlay}
      className={`tac-cta justify-center ${isActive && isPlaying ? "bg-[var(--tac-signal)] border-[var(--tac-signal)] text-white" : ""}`}
      title={isActive && isPlaying ? "Pause" : "Play"}
    >
      {isActive && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      {isActive && isPlaying ? "PAUSE" : "PLAY"}
    </button>
  )
}
