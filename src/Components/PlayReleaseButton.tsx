"use client"

import React from 'react'
import { Play } from 'lucide-react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import type { Release } from '@/data/releases'

export function PlayReleaseButton({ release }: { release: Release }) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useMusicPlayer()

  const handlePlay = () => {
    // If playing the current release's first track (or placeholder)
    if (currentTrack?.id === release.id) {
      togglePlayPause()
      return
    }

    playTrack({
      id: release.id || release.title,
      title: release.title,
      artist: 'OKISO',
      // Using placeholder MP3, normally this would be release.audioUrl
      audioUrl: '/audio/placeholder.mp3',
      coverUrl: release.img,
    })
  }

  const isActive = currentTrack?.id === release.id

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
