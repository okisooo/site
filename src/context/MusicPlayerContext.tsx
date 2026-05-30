"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

interface MusicPlayerContextType {
  currentTrackId: string | null
  currentTrackTitle: string | null
  currentTrackArtist: string | null
  currentTrackCover: string | null
  currentTrackLink: string | null
  isPlaying: boolean
  playTrack: (videoId: string, title: string, artist: string, cover?: string, link?: string) => void
  togglePlayPause: () => void
  closePlayer: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: any
  }
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string | null>(null)
  const [currentTrackArtist, setCurrentTrackArtist] = useState<string | null>(null)
  const [currentTrackCover, setCurrentTrackCover] = useState<string | null>(null)
  const [currentTrackLink, setCurrentTrackLink] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const isReadyRef = useRef<boolean>(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.async = true
    document.body.appendChild(script)

    window.onYouTubeIframeAPIReady = () => {
      const element = document.getElementById('youtube-embed-container')
      if (!element) return

      playerRef.current = new window.YT.Player('youtube-embed-container', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: () => {
            isReadyRef.current = true
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING is 1, PAUSED is 2, ENDED is 0
            if (event.data === 1) {
              setIsPlaying(true)
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false)
            }
          }
        }
      })
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const playTrack = useCallback((videoId: string, title: string, artist: string = 'OKISO', cover?: string, link?: string) => {
    setCurrentTrackTitle(title)
    setCurrentTrackArtist(artist)
    setCurrentTrackCover(cover || null)
    setCurrentTrackLink(link || null)

    if (playerRef.current && isReadyRef.current) {
      if (currentTrackId !== videoId) {
        playerRef.current.loadVideoById(videoId)
        setCurrentTrackId(videoId)
        setIsPlaying(true)
      } else {
        // Toggle play pause
        const state = playerRef.current.getPlayerState()
        if (state === 1) {
          playerRef.current.pauseVideo()
        } else {
          playerRef.current.playVideo()
        }
      }
    } else {
      setCurrentTrackId(videoId) 
      // If player isn't ready yet but they clicked play, we could queue it, 
      // but typically the API loads very fast.
    }
  }, [currentTrackId])

  const togglePlayPause = useCallback(() => {
    if (playerRef.current && isReadyRef.current) {
      const state = playerRef.current.getPlayerState()
      if (state === 1) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    }
  }, [])

  const closePlayer = useCallback(() => {
    if (playerRef.current && isReadyRef.current) {
      playerRef.current.stopVideo()
    }
    setIsPlaying(false)
    setCurrentTrackId(null)
  }, [])

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrackId,
        currentTrackTitle,
        currentTrackArtist,
        currentTrackCover,
        currentTrackLink,
        isPlaying,
        playTrack,
        togglePlayPause,
        closePlayer,
      }}
    >
      {children}
      {/* Invisible YouTube Player Container */}
      <div id="youtube-embed-container" className="hidden pointer-events-none opacity-0 absolute"></div>
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
