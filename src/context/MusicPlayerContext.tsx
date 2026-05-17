"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

export interface Track {
  id: string
  title: string
  artist: string
  audioUrl: string
  coverUrl: string
}

interface MusicPlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number // 0 to 1
  volume: number // 0 to 1
  duration: number // in seconds
  playTrack: (track: Track) => void
  togglePlayPause: () => void
  setVolume: (vol: number) => void
  seek: (progress: number) => void
  closePlayer: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    const updateProgress = () => {
      if (audioRef.current && audioRef.current.duration) {
        setProgress(audioRef.current.currentTime / audioRef.current.duration)
        setDuration(audioRef.current.duration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audioRef.current.addEventListener('timeupdate', updateProgress)
    audioRef.current.addEventListener('ended', handleEnded)
    audioRef.current.addEventListener('loadedmetadata', updateProgress)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('timeupdate', updateProgress)
        audioRef.current.removeEventListener('ended', handleEnded)
        audioRef.current.removeEventListener('loadedmetadata', updateProgress)
        audioRef.current = null
      }
    }
  }, []) // Empty deps so audio element is persistent

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (audioRef.current.src !== currentTrack.audioUrl) {
        audioRef.current.src = currentTrack.audioUrl
        if (isPlaying) {
          audioRef.current.play().catch(console.error)
        }
      }
    }
  }, [currentTrack])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playTrack = (track: Track) => {
    // If playing the same track, just toggle
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying(true)
      return
    }
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying)
    }
  }

  const setVolumeLevel = (vol: number) => {
    setVolume(Math.max(0, Math.min(1, vol)))
  }

  const seek = (newProgress: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = newProgress * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setProgress(newProgress)
    }
  }

  const closePlayer = () => {
    setIsPlaying(false)
    setCurrentTrack(null)
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        duration,
        playTrack,
        togglePlayPause,
        setVolume: setVolumeLevel,
        seek,
        closePlayer,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
}
