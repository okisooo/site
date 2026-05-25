"use client"

import React from 'react'
import { Play } from 'lucide-react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import type { Release } from '@/data/releases'

export function PlayReleaseButton({ release }: { release: Release }) {
  const { playSpotifyTrack, currentTrackId, isPlaying, togglePlayPause } = useMusicPlayer()

  const uri = release.albumType === 'single' || release.albumType === 'album' 
    ? `spotify:album:${release.id}`
    : `spotify:track:${release.id}`

  const handlePlay = () => {
    if (currentTrackId === uri) {
      togglePlayPause()
      return
    }

    if (release.id) {
      playSpotifyTrack(uri, release.title, 'OKISO')
    }
  }

  const isActive = currentTrackId === uri

  return (
    <button
      onClick={handlePlay}
      className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-md transition-colors shadow-lg"
    >
      <Play size={18} fill="currentColor" />
      {isActive && isPlaying ? 'Pause Audio' : 'Play Audio'}
    </button>
  )
}
