"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

interface MusicPlayerContextType {
  currentTrackId: string | null
  currentTrackTitle: string | null
  currentTrackArtist: string | null
  currentTrackCover: string | null
  currentTrackLink: string | null
  isPlaying: boolean
  volume: number
  isLooping: boolean
  currentTime: number
  duration: number
  playTrack: (title: string, artist: string, cover?: string, link?: string) => void
  togglePlayPause: () => void
  closePlayer: () => void
  setVolume: (v: number) => void
  toggleLoop: () => void
  playNext: () => void
  playPrev: () => void
  seekTo: (time: number) => void
}

import { staticReleases } from '@/data/releases'

// Build a global playlist from all available releases
const sanitizeFileName = (name: string) => name.replace(/[\/\\?%*:|"<>]/g, '-').trim()

const globalPlaylist = staticReleases.flatMap(r => 
  (r.tracks || []).map(t => {
    return {
      title: t.title,
      artist: 'OKISO',
      cover: r.img,
      link: r.link,
      audioSrc: `/audio/${sanitizeFileName(t.title)}.mp3`
    }
  })
)

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string | null>(null)
  const [currentTrackArtist, setCurrentTrackArtist] = useState<string | null>(null)
  const [currentTrackCover, setCurrentTrackCover] = useState<string | null>(null)
  const [currentTrackLink, setCurrentTrackLink] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(100)
  const [isLooping, setIsLooping] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume / 100
    }
  }, [])

  const handleTrackEnd = useCallback(() => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
      return
    }
    
    // Play Next
    const currentIndex = globalPlaylist.findIndex(t => t.title === currentTrackTitle)
    if (currentIndex >= 0 && currentIndex < globalPlaylist.length - 1) {
      const next = globalPlaylist[currentIndex + 1]
      playTrack(next.title, next.artist, next.cover, next.link)
    } else {
      setIsPlaying(false)
    }
  }, [currentTrackTitle, isLooping, playTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => handleTrackEnd()
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => {
      console.error("Audio playback error. The local file might be missing.");
      setIsPlaying(false);
      // Auto-skip on error could go here, but avoiding loops if everything fails.
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [handleTrackEnd])

  const playTrack = useCallback((title: string, artist: string = 'OKISO', cover?: string, link?: string) => {
    setCurrentTrackTitle(title)
    setCurrentTrackArtist(artist)
    setCurrentTrackCover(cover || null)
    setCurrentTrackLink(link || null)

    if (audioRef.current) {
      if (currentTrackTitle !== title) {
        audioRef.current.src = `/audio/${sanitizeFileName(title)}.mp3`
        audioRef.current.play().catch(console.error)
        setIsPlaying(true)
      } else {
        // Toggle play pause
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play().catch(console.error)
        }
      }
    }
  }, [currentTrackTitle, isPlaying])

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [isPlaying])

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setCurrentTrackTitle(null)
  }, [])

  const playNext = useCallback(() => {
    const currentIndex = globalPlaylist.findIndex(t => t.title === currentTrackTitle)
    if (currentIndex >= 0 && currentIndex < globalPlaylist.length - 1) {
      const next = globalPlaylist[currentIndex + 1]
      playTrack(next.title, next.artist, next.cover, next.link)
    }
  }, [currentTrackTitle, playTrack])

  const playPrev = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }
    const currentIndex = globalPlaylist.findIndex(t => t.title === currentTrackTitle)
    if (currentIndex > 0) {
      const prev = globalPlaylist[currentIndex - 1]
      playTrack(prev.title, prev.artist, prev.cover, prev.link)
    }
  }, [currentTrackTitle, playTrack])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    if (audioRef.current) {
      audioRef.current.volume = v / 100
    }
  }, [])

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev)
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  // Alias currentTrackId to title to avoid breaking existing components
  const currentTrackId = currentTrackTitle;

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrackId,
        currentTrackTitle,
        currentTrackArtist,
        currentTrackCover,
        currentTrackLink,
        isPlaying,
        volume,
        isLooping,
        currentTime,
        duration,
        playTrack,
        togglePlayPause,
        closePlayer,
        setVolume,
        toggleLoop,
        playNext,
        playPrev,
        seekTo
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
