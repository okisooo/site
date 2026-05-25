"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

interface MusicPlayerContextType {
  currentTrackId: string | null
  currentTrackTitle: string | null
  currentTrackArtist: string | null
  currentTrackCover: string | null
  currentTrackLink: string | null
  isPlaying: boolean
  playSpotifyTrack: (uri: string, title: string, artist: string, cover?: string, link?: string) => void
  togglePlayPause: () => void
  closePlayer: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

// Extend Window interface for Spotify API
declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void
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
  const controllerRef = useRef<any>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://open.spotify.com/embed/iframe-api/v1"
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const element = document.getElementById('spotify-embed-container')
      if (!element) return

      const options = {
        uri: 'spotify:track:3eCy6HPR031XDxDr910lrp', // default placeholder
        width: '100%',
        height: '80',
        theme: 'dark'
      }

      const callback = (EmbedController: any) => {
        controllerRef.current = EmbedController
        
        EmbedController.addListener('playback_update', (e: any) => {
          setIsPlaying(!e.data.isPaused)
        })
      }

      IFrameAPI.createController(element, options, callback)
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const playSpotifyTrack = useCallback((uri: string, title: string, artist: string = 'OKISO', cover?: string, link?: string) => {
    setCurrentTrackTitle(title)
    setCurrentTrackArtist(artist)
    setCurrentTrackCover(cover || null)
    setCurrentTrackLink(link || null)

    if (controllerRef.current) {
      if (currentTrackId !== uri) {
        controllerRef.current.loadUri(uri)
        setCurrentTrackId(uri)
        
        setTimeout(() => {
          controllerRef.current.play()
          setIsPlaying(true)
        }, 500)
      } else {
        controllerRef.current.togglePlay()
      }
    } else {
      setCurrentTrackId(uri) 
    }
  }, [currentTrackId])

  const togglePlayPause = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.togglePlay()
    }
  }, [])

  const closePlayer = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.pause()
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
        playSpotifyTrack,
        togglePlayPause,
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
