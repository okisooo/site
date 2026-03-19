'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Maximize2, Minimize2 } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function CustomVideoPlayer({ src, poster, title = 'ARCHIVE.MP4', className = '', autoPlay = false }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousVolumeRef = useRef(1);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [streamReady, setStreamReady] = useState<boolean | null>(null);
  const [streamGenerating, setStreamGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!isCinemaMode) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCinemaMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCinemaMode]);

  useEffect(() => {
    let cancelled = false;

    const checkStreamHeaders = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' });
        if (!response.ok || cancelled) return;

        const readyHeader = response.headers.get('x-stream-ready');
        const generatingHeader = response.headers.get('x-stream-generating');

        if (!cancelled) {
          setStreamReady(readyHeader === 'true');
          setStreamGenerating(generatingHeader === 'true');
        }
      } catch {
        if (!cancelled) {
          setStreamReady(null);
          setStreamGenerating(false);
        }
      }
    };

    setStreamReady(null);
    setStreamGenerating(false);
    checkStreamHeaders();

    return () => {
      cancelled = true;
    };
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.volume = volume;
      if (autoPlay) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        const restoredVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 1;
        videoRef.current.muted = false;
        videoRef.current.volume = restoredVolume;
        setVolume(restoredVolume);
        setIsMuted(false);
      } else {
        previousVolumeRef.current = volume > 0 ? volume : 1;
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Math.max(0, Math.min(1, Number(event.target.value)));
    if (videoRef.current) {
      videoRef.current.volume = nextVolume;
      videoRef.current.muted = nextVolume === 0;
    }
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
    if (nextVolume > 0) {
      previousVolumeRef.current = nextVolume;
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const toggleCinemaMode = () => {
    setIsCinemaMode((prev) => !prev);
  };

  const playerContainerClass = isCinemaMode
    ? 'relative z-[1] group w-full max-w-6xl aspect-video overflow-hidden flex flex-col bg-black rounded-[24px] md:rounded-[32px] border border-white/20 shadow-[0_30px_120px_rgba(0,0,0,0.8)]'
    : `relative group w-full h-full overflow-hidden flex flex-col bg-black ${className}`;

  return (
    <div className={isCinemaMode ? 'fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8' : ''}>
      {isCinemaMode && (
        <button
          aria-label="Close cinema mode"
          onClick={() => setIsCinemaMode(false)}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />
      )}

      <div className={playerContainerClass}>
      {/* Top Bar - Clean System UI */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <span className="font-bold text-xs md:text-sm text-white tracking-widest uppercase drop-shadow-md">
            REC // {title}
          </span>
        </div>
        <div className="font-bold text-xs md:text-sm text-white/50 tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          {streamGenerating && streamReady === false ? 'OPTIMIZING VIDEO...' : 'SYS.VOD.01'}
        </div>
      </div>

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        loop
        playsInline
        preload="metadata"
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onVolumeChange={() => {
          if (videoRef.current) {
            setVolume(videoRef.current.volume);
            setIsMuted(videoRef.current.muted || videoRef.current.volume === 0);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay Centered */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/20 backdrop-blur-[2px]">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-110"
          >
            <Play size={32} className="ml-2" />
          </motion.div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className={`absolute bottom-0 left-0 w-full p-4 md:p-6 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300 ${isPlaying ? 'opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center gap-3 md:gap-5 text-white max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20">
          <button 
            onClick={togglePlay}
            className="p-3 hover:bg-white text-white hover:text-black rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          
          <button 
            onClick={toggleMute}
            className="p-3 hover:bg-white text-white hover:text-black rounded-full transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 md:w-28 h-2 appearance-none bg-white/20 rounded-full cursor-pointer accent-[#FF7EB3]"
            aria-label="Volume"
          />

          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-bold tracking-wider text-white/80 min-w-[42px]">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              className="flex-1 h-2 appearance-none bg-white/20 rounded-full cursor-pointer accent-[#FF7EB3]"
              aria-label="Playback progress"
            />
            <span className="text-xs font-bold tracking-wider text-white/80 min-w-[42px]">{formatTime(duration)}</span>
          </div>

          <button 
            onClick={toggleCinemaMode}
            className="p-3 hover:bg-white text-white hover:text-black rounded-full transition-colors"
            aria-label={isCinemaMode ? 'Exit cinema mode' : 'Enter cinema mode'}
          >
            {isCinemaMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <button 
            onClick={toggleFullScreen}
            className="p-3 hover:bg-white text-white hover:text-black rounded-full transition-colors"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
