"use client"

import React, { useState, useEffect } from 'react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { Play, Pause, X, Disc3, ExternalLink } from 'lucide-react'

export function MusicPlayer() {
  const { currentTrackId, currentTrackTitle, currentTrackArtist, currentTrackCover, currentTrackLink, isPlaying, togglePlayPause, closePlayer } = useMusicPlayer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-[51] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        currentTrackId ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[150%] opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Dynamic Player Container */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col p-4"
        id="spotify-embed-container-data"
        data-premid-track-title={currentTrackTitle || ''}
        data-premid-track-artist={currentTrackArtist || ''}
        data-premid-cover-url={currentTrackCover || ''}
        data-premid-link={currentTrackLink || ''}
        data-premid-paused={!isPlaying ? 'true' : 'false'}
      >
        
        {/* Glow effect matching album art */}
        {currentTrackCover && (
          <div 
            className="absolute inset-0 opacity-20 dark:opacity-30 blur-3xl pointer-events-none"
            style={{ 
              backgroundImage: `url(${currentTrackCover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div className="relative z-10 flex items-center gap-4">
          
          {/* Album Art (Spinning Vinyl or Image) */}
          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/20 shadow-lg">
            {currentTrackCover ? (
              <img 
                src={currentTrackCover} 
                alt="Cover" 
                className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${isPlaying ? 'scale-110' : 'scale-100'}`} 
              />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <Disc3 className={`w-8 h-8 text-white ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-black dark:text-white truncate">
              {currentTrackTitle || 'Loading...'}
            </h4>
            <p className="text-xs text-black/60 dark:text-white/60 truncate mt-1">
              {currentTrackArtist || 'OKISO'}
            </p>
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold tracking-widest text-black/50 dark:text-white/50 uppercase">
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={togglePlayPause}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white transition-all hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={closePlayer}
              className="flex items-center justify-center w-8 h-8 rounded-full text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* External Link */}
        {currentTrackLink && (
          <a 
            href={currentTrackLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  )
}
