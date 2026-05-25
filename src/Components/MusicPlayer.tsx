"use client"

import React from 'react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { X } from 'lucide-react'

export function MusicPlayer() {
  const { currentTrackId, currentTrackTitle, currentTrackArtist, isPlaying, closePlayer } = useMusicPlayer()

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] z-[51] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-2xl shadow-2xl ${
        currentTrackId ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none'
      }`}
    >
      {/* Container for the Spotify Iframe */}
      <div 
        className="relative w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl"
        id="spotify-embed-container-data"
        data-premid-track-title={currentTrackTitle || ''}
        data-premid-track-artist={currentTrackArtist || ''}
        data-premid-paused={!isPlaying ? 'true' : 'false'}
      >
        <button 
          onClick={closePlayer} 
          className="absolute -top-1 -right-1 z-50 text-white/70 hover:text-white bg-black/80 hover:bg-red-500 rounded-bl-xl rounded-tr-xl p-1.5 transition-all shadow-md"
        >
          <X size={16} />
        </button>
        <div id="spotify-embed-container" className="w-full"></div>
      </div>
    </div>
  )
}
