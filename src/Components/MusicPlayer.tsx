"use client"

import React, { useState, useEffect } from 'react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { Play, Pause, X, Disc3, ExternalLink, SkipBack, SkipForward, Repeat, Volume2, VolumeX } from 'lucide-react'

export function MusicPlayer() {
  const { 
    currentTrackId, currentTrackTitle, currentTrackArtist, currentTrackCover, currentTrackLink, 
    isPlaying, volume, isLooping,
    togglePlayPause, closePlayer, playNext, playPrev, setVolume, toggleLoop 
  } = useMusicPlayer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[max-content] z-[51] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        currentTrackId ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[150%] opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Dynamic Player Container */}
      <div 
        className="relative rounded-full overflow-hidden bg-black/90 dark:bg-[#111]/90 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center p-2 pr-6 gap-4"
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
            className="absolute inset-0 opacity-30 dark:opacity-20 blur-2xl pointer-events-none"
            style={{ 
              backgroundImage: `url(${currentTrackCover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div className="relative z-10 flex items-center gap-4">
          
          {/* Album Art (Spinning Vinyl) */}
          <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {currentTrackCover ? (
              <img 
                src={currentTrackCover} 
                alt="Cover" 
                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'animate-[spin_10s_linear_infinite] scale-110' : 'scale-100'}`} 
              />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <Disc3 className={`w-6 h-6 text-white ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
              </div>
            )}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border border-white/20 z-10" />
          </div>

          {/* Track Info */}
          <div className="min-w-[120px] max-w-[200px] flex flex-col justify-center">
            <h4 className="text-sm font-bold text-white truncate drop-shadow-md">
              {currentTrackTitle || 'Loading...'}
            </h4>
            
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-white/50'}`} />
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest truncate">
                {currentTrackArtist || 'OKISO'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <button 
              onClick={playPrev}
              className="flex items-center justify-center w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlayPause}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={playNext}
              className="flex items-center justify-center w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>

          {/* Extra Controls (Volume & Loop & Close) */}
          <div className="flex items-center gap-1 pl-2 border-l border-white/10">
            <button 
              onClick={toggleLoop}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isLooping ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              title="Toggle Loop"
            >
              <Repeat size={14} />
            </button>

            {/* Volume Slider (Hover expanding) */}
            <div className="group/volume relative flex items-center justify-center w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-8 h-24 bg-black/90 backdrop-blur-xl border border-white/10 rounded-full flex flex-col items-center justify-end py-3 opacity-0 pointer-events-none group-hover/volume:opacity-100 group-hover/volume:pointer-events-auto transition-all shadow-xl">
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-16 h-1 -rotate-90 origin-center bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_white]"
                />
              </div>
            </div>

            <button 
              onClick={closePlayer}
              className="flex items-center justify-center w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Close Player"
            >
              <X size={16} />
            </button>
            {currentTrackLink && (
              <a 
                href={currentTrackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full text-white/40 hover:text-white transition-colors ml-1"
                title="Open in Spotify"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
