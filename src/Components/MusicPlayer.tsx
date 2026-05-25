"use client"

import React from 'react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { X } from 'lucide-react'

export function MusicPlayer() {
  const { currentTrackId, currentTrackTitle, currentTrackArtist, currentTrackCover, currentTrackLink, isPlaying, closePlayer } = useMusicPlayer()

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] z-[51] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        currentTrackId ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none'
      }`}
    >
      {/* Brutalist Boombox Container */}
      <div 
        className="relative w-full rounded-2xl md:rounded-[32px] overflow-hidden bg-white dark:bg-black border-4 border-black dark:border-white shadow-[0_20px_0px_rgba(0,0,0,1)] dark:shadow-[0_20px_0px_rgba(255,255,255,0.2)] flex flex-col"
        id="spotify-embed-container-data"
        data-premid-track-title={currentTrackTitle || ''}
        data-premid-track-artist={currentTrackArtist || ''}
        data-premid-cover-url={currentTrackCover || ''}
        data-premid-link={currentTrackLink || ''}
        data-premid-paused={!isPlaying ? 'true' : 'false'}
      >
        {/* Cute Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 md:py-3 bg-ba-pink border-b-4 border-black dark:border-white">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse border-2 border-black" />
            <span className="font-black text-xs md:text-sm tracking-widest text-black uppercase">
              AUDIO_SYSTEM // ONLINE
            </span>
          </div>
          <button 
            onClick={closePlayer} 
            className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-black hover:bg-white text-white hover:text-black border-2 border-transparent hover:border-black rounded-full transition-colors"
          >
            <X size={16} className="font-black" />
          </button>
        </div>

        {/* The actual Spotify Iframe Container */}
        <div className="w-full bg-black">
          <div id="spotify-embed-container" className="w-full"></div>
        </div>
      </div>
    </div>
  )
}
