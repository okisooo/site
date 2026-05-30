"use client"

import React from 'react'
import { Play } from 'lucide-react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import type { Release } from '@/data/releases'

export function PlayReleaseButton({ release }: { release: Release }) {
  const { playTrack, currentTrackId, isPlaying, togglePlayPause } = useMusicPlayer()

  // Extract video ID from youtube link (e.g., https://www.youtube.com/watch?v=GNd16uxzUlk)
  const trackLink = release.tracks?.[0]?.link || release.link
  const isYouTube = trackLink?.includes('youtube.com/watch?v=') || trackLink?.includes('youtu.be/')
  
  let videoId = ""
  if (isYouTube) {
    if (trackLink.includes('youtube.com')) {
      videoId = trackLink.split('v=')[1]?.split('&')[0] || ""
    } else {
      videoId = trackLink.split('youtu.be/')[1]?.split('?')[0] || ""
    }
  }

  const handlePlay = () => {
    if (!videoId) return // Can't play if we don't have a video ID

    if (currentTrackId === videoId) {
      togglePlayPause()
      return
    }

    playTrack(videoId, release.title, 'OKISO', release.img, trackLink)
  }

  const isActive = currentTrackId === videoId

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
