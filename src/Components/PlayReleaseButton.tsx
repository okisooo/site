"use client"

import React from "react"
import { Play, Pause } from "lucide-react"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import type { Release } from "@/data/releases"

export function PlayReleaseButton({ release, onClose }: { release: Release, onClose?: () => void }) {
  const { playTrack, currentTrackId, isPlaying, togglePlayPause, canPlayTrack } = useMusicPlayer()
  
  const trackTitle = release.tracks?.[0]?.title || release.title
  const trackLink = release.link

  const handlePlay = (event: React.MouseEvent<HTMLButtonElement>) => {
    const el = event.currentTarget
    if (currentTrackId === trackTitle) {
      togglePlayPause()
      return
    }

    playTrack(trackTitle, "OKISO", release.img, trackLink)
    if (onClose) onClose()
    // The player bar opens over the page's bottom band; keep the pressed button above it (not inside dialogs).
    else if (!el.closest('[role="dialog"]')) requestAnimationFrame(() => requestAnimationFrame(() => el.scrollIntoView({ block: "nearest" })))
  }

  const isActive = currentTrackId === trackTitle
  const action = isActive && isPlaying ? "pause" : "play"

  // Each release surface keeps its verified streaming link alongside this button.
  if (!canPlayTrack(trackTitle)) return null

  return (
    <button
      onClick={handlePlay}
      className={`tac-cta justify-center ${isActive && isPlaying ? "bg-[var(--tac-signal)] border-[var(--tac-signal)] text-white" : ""}`}
      aria-label={`${action} ${trackTitle}`}
    >
      {isActive && isPlaying ? <Pause size={14} fill="currentColor" aria-hidden="true" /> : <Play size={14} fill="currentColor" aria-hidden="true" />}
      {action}
    </button>
  )
}
