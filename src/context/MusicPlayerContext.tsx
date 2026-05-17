"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

export interface Track {
  id: string // Spotify ID is required now
  title: string
  artist: string
  audioUrl?: string
  coverUrl?: string
  uri?: string
}

interface MusicPlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  playTrack: (track: Track) => void
  closePlayer: () => void
  spotifyController: any
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

// Adding type declaration for Spotify API to avoid TS errors if necessary
declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
  }
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [spotifyController, setSpotifyController] = useState<any>(null)

  // Initialize Spotify API
  useEffect(() => {
    const script = document.createElement('script')
    script.src = "https://open.spotify.com/embed/iframe-api/v1"
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const element = document.getElementById('spotify-embed')
      if (!element) return

      const options = {
        width: '100%',
        height: '80',
        uri: '', 
        theme: '0' // 0 for dark theme
      }

      const callback = (EmbedController: any) => {
        setSpotifyController(EmbedController)
        EmbedController.addListener('playback_update', (e: any) => {
          setIsPlaying(!e.data.isPaused)
          
          // Emit events for PreMiD to pick up!
          const container = document.getElementById('spotify-embed-container-data')
          if (container) {
            container.setAttribute('data-premid-paused', e.data.isPaused ? 'true' : 'false')
          }
        })
      }
      IFrameAPI.createController(element, options, callback)
    }

    return () => {
      document.body.removeChild(script)
    }
  }, []) // Empty deps so it only loads once

  // Handle PreMiD DOM attributes
  useEffect(() => {
    const container = document.getElementById('spotify-embed-container-data')
    if (currentTrack && container) {
       container.setAttribute('data-premid-track-id', currentTrack.id)
       container.setAttribute('data-premid-track-title', currentTrack.title)
       container.setAttribute('data-premid-track-artist', currentTrack.artist)
    } else if (container) {
       container.removeAttribute('data-premid-track-id')
       container.removeAttribute('data-premid-track-title')
       container.removeAttribute('data-premid-track-artist')
       container.removeAttribute('data-premid-paused')
    }
  }, [currentTrack])

  const playTrack = (track: Track) => {
    // If playing the same track, just toggle
    if (currentTrack && currentTrack.id === track.id) {
      if (spotifyController) spotifyController.togglePlay()
      return
    }
    
    setCurrentTrack(track)
    if (spotifyController) {
      // Use the provided URI, default to track if missing
      spotifyController.loadUri(track.uri || `spotify:track:${track.id}`)
      spotifyController.play()
    }
  }

  const closePlayer = () => {
    if (spotifyController) {
      spotifyController.pause()
    }
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        closePlayer,
        spotifyController
      }}
    >
      <div id="spotify-embed-container-data" style={{ display: 'none' }} />
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
