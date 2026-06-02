"use client"

import React, { useState, useEffect } from 'react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { Play, Pause, X, Disc3, ExternalLink, SkipBack, SkipForward, Repeat, Volume2, VolumeX } from 'lucide-react'

export function MusicPlayer() {
  const { 
    currentTrackId, currentTrackTitle, currentTrackArtist, currentTrackCover, currentTrackLink, 
    isPlaying, volume, isLooping, currentTime, duration,
    togglePlayPause, closePlayer, playNext, playPrev, setVolume, toggleLoop, seekTo 
  } = useMusicPlayer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const progressPercent = duration ? (currentTime / duration) * 100 : 0
  const volumePercent = volume

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[51] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        currentTrackId ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[150%] opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Premium ambient glow that bleeds outside the player container */}
      {currentTrackCover && (
        <div 
          className="absolute inset-0 -m-6 opacity-35 dark:opacity-25 blur-3xl pointer-events-none transition-all duration-500 rounded-full"
          style={{ 
            backgroundImage: `url(${currentTrackCover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Main Player Container */}
      <div 
        className="relative rounded-full bg-zinc-950/95 dark:bg-black/95 border border-white/10 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col p-3 px-6 gap-2 w-[340px] md:w-[420px]"
        id="spotify-embed-container-data"
        data-premid-track-title={currentTrackTitle || ''}
        data-premid-track-artist={currentTrackArtist || ''}
        data-premid-cover-url={currentTrackCover || ''}
        data-premid-link={currentTrackLink || ''}
        data-premid-paused={!isPlaying ? 'true' : 'false'}
      >
        
        {/* Main Controls Row */}
        <div className="relative z-10 w-full flex items-center justify-between gap-3">
          
          {/* Album Cover & Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Album Art */}
            <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10">
              {currentTrackCover ? (
                <img 
                  src={currentTrackCover} 
                  alt="Cover" 
                  className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'animate-[spin_12s_linear_infinite] scale-110' : 'scale-100'}`} 
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <Disc3 className={`w-5 h-5 text-white ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate drop-shadow-md">
                {currentTrackTitle || 'Loading...'}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-pink-500 shadow-[0_0_6px_#ec4899] animate-pulse' : 'bg-white/40'}`} />
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest truncate">
                  {currentTrackArtist || 'OKISO'}
                </p>
              </div>
            </div>
          </div>

          {/* Center Playback Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={playPrev}
              className="flex items-center justify-center w-7 h-7 rounded-full text-white/50 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
              title="Previous Track"
            >
              <SkipBack size={15} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlayPause}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.35)] shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={playNext}
              className="flex items-center justify-center w-7 h-7 rounded-full text-white/50 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
              title="Next Track"
            >
              <SkipForward size={15} fill="currentColor" />
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-white/10">
            {/* Loop Toggle */}
            <button 
              onClick={toggleLoop}
              className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${isLooping ? 'text-pink-500 drop-shadow-[0_0_6px_#ec4899]' : 'text-white/45 hover:text-white hover:bg-white/10'}`}
              title="Toggle Loop"
            >
              <Repeat size={13} />
            </button>

            {/* Volume Inline Expand (Prevents clipping entirely) */}
            <div className="group/volume flex items-center gap-1 transition-all duration-300">
              <button 
                onClick={() => setVolume(volume === 0 ? 100 : 0)}
                className="flex items-center justify-center w-7 h-7 rounded-full text-white/45 hover:text-white hover:bg-white/10 transition-colors"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              
              <input 
                type="range" 
                min="0" max="100" 
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #ffffff ${volumePercent}%, rgba(255,255,255,0.15) ${volumePercent}%)`
                }}
                className="w-0 opacity-0 group-hover/volume:w-16 group-hover/volume:opacity-100 transition-all duration-300 h-[3px] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              />
            </div>

            {/* External Spotify link */}
            {currentTrackLink && (
              <a 
                href={currentTrackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 rounded-full text-white/45 hover:text-white hover:bg-white/10 transition-colors"
                title="Open Album"
              >
                <ExternalLink size={13} />
              </a>
            )}

            {/* Close Button */}
            <button 
              onClick={closePlayer}
              className="flex items-center justify-center w-7 h-7 rounded-full text-white/45 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Player"
            >
              <X size={13} />
            </button>
          </div>

        </div>

        {/* Dynamic Gradient Seek Bar */}
        <div className="w-full flex items-center gap-2.5 px-0.5 mt-1 relative z-10">
          <span className="text-[8px] text-white/40 font-mono w-6 text-right select-none">
            {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
          </span>
          <input 
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #ec4899 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
            }}
            className="flex-1 h-[3px] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all duration-150 [&::-webkit-slider-thumb]:shadow-[0_0_8px_#ec4899]"
          />
          <span className="text-[8px] text-white/40 font-mono w-6 select-none">
            {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
          </span>
        </div>

      </div>
    </div>
  )
}
