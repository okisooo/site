"use client"

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'

export function MusicPlayer() {
  const { currentTrack, closePlayer } = useMusicPlayer()

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 transition-all duration-500 ease-in-out ${
        currentTrack ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center pr-12 border border-white/10 dark:border-white/20">
        
        {/* The actual iframe mounts inside here */}
        <div id="spotify-embed" className="w-full h-[80px]"></div>
        
        {/* Close button layered on top/side */}
        <button 
          onClick={closePlayer} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
