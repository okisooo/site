"use client"

import React from 'react'
import { Play, Pause } from 'lucide-react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import type { Release } from '@/data/releases'

export function PlayReleaseButton({ release, onClose }: { release: Release, onClose?: () => void }) {
  const { playTrack, currentTrackId, isPlaying, togglePlayPause } = useMusicPlayer()
  
  // The global player uses the first track's title by default for album-level playback
  const trackTitle = release.tracks?.[0]?.title || release.title
  const trackLink = release.link // Always link back to the Spotify album

  const handlePlay = () => {
    if (currentTrackId === trackTitle) {
      togglePlayPause()
      return
    }

    playTrack(trackTitle, 'OKISO', release.img, trackLink)
    if (onClose) onClose()
  }

  const isActive = currentTrackId === trackTitle

  return (
    <button
      onClick={handlePlay}
      className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-md transition-colors shadow-lg ${isActive ? 'bg-pink-600 text-white' : 'bg-pink-500/80 text-white hover:bg-pink-500'}`}
      title={isActive ? "Pause" : "Play"}
    >
      {isActive && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      {isActive && isPlaying ? "Pause" : "Play"}
    </button>
  )
}
