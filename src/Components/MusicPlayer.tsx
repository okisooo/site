"use client"

import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, X, Volume2, VolumeX } from 'lucide-react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import Image from 'next/image'

export function MusicPlayer() {
  const { currentTrack, isPlaying, progress, volume, togglePlayPause, setVolume, seek, closePlayer } = useMusicPlayer()
  const progressBarRef = useRef<HTMLDivElement>(null)

  if (!currentTrack) return null

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      seek(percentage)
    }
  }

  const toggleMute = () => {
    if (volume === 0) setVolume(0.5)
    else setVolume(0)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
      >
        <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/20 dark:border-white/10 p-3 pr-4 rounded-2xl shadow-2xl flex items-center gap-4">
          
          {/* Album Art */}
          <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Track Info & Progress */}
          <div className="flex-grow min-w-0 flex flex-col justify-center">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="text-sm font-bold truncate text-black dark:text-white">
                {currentTrack.title}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate ml-2">
                {currentTrack.artist}
              </span>
            </div>

            {/* Progress Bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full cursor-pointer overflow-hidden relative"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-shrink-0 text-black dark:text-white">
            <button 
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            
            <button onClick={toggleMute} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <button onClick={closePlayer} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
              <X size={20} />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
