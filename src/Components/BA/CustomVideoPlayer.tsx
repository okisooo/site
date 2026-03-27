'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Maximize2, Minimize2, Settings } from 'lucide-react';
import Hls from 'hls.js';

interface CustomVideoPlayerProps {
  src: string;
  hlsUrl?: string;
  streamUrl?: string;
  sourceUrl?: string;
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

export default function CustomVideoPlayer({ src, hlsUrl, streamUrl, sourceUrl, poster, title = 'ARCHIVE.MP4', className = '', autoPlay = false }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousVolumeRef = useRef(1);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState(src);
  const [hlsReady, setHlsReady] = useState<boolean | null>(null);
  const [hlsGenerating, setHlsGenerating] = useState(false);
  const [usedFallbackSource, setUsedFallbackSource] = useState(false);

  const hlsRef = useRef<Hls | null>(null);
  const [hlsLevels, setHlsLevels] = useState<{ id: number; height: number; name: string }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [hlsErrorToast, setHlsErrorToast] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Initialize saved quality from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('okiso_hls_quality');
      if (saved !== null) {
        setCurrentLevel(Number(saved));
      }
    } catch { }
  }, []);

  useEffect(() => {
    if (!isCinemaMode) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Boost z-index of the parent section to escape stacking context traps
    const parentSection = videoRef.current?.closest('section');
    let originalZIndex = '';
    if (parentSection) {
      originalZIndex = parentSection.style.zIndex;
      parentSection.style.zIndex = '99999';
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCinemaMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      if (parentSection) {
        parentSection.style.zIndex = originalZIndex;
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCinemaMode]);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;

    const preferredHlsUrl = hlsUrl || (src.toLowerCase().includes('.m3u8') ? src : undefined);
    const streamFallbackUrl = streamUrl || (!src.toLowerCase().includes('.m3u8') ? src : undefined);
    const sourceFallbackUrl = sourceUrl || streamFallbackUrl || src;

    const resolvePlaybackUrl = async () => {
      if (!preferredHlsUrl) {
        setResolvedSrc(streamFallbackUrl || sourceFallbackUrl);
        setHlsReady(null);
        setHlsGenerating(false);
        return;
      }

      try {
        const response = await fetch(preferredHlsUrl, { method: 'HEAD', cache: 'no-store' });
        if (cancelled) return;

        const readyHeader = response.headers.get('x-hls-ready');
        const generatingHeader = response.headers.get('x-hls-generating');
        const retryAfterHeader = response.headers.get('retry-after');

        const generating = generatingHeader === 'true';
        const ready = readyHeader === 'true';

        setHlsReady(readyHeader === null ? null : ready);
        setHlsGenerating(generating);

        if (response.ok || ready) {
          setResolvedSrc(preferredHlsUrl);
          setUsedFallbackSource(false);
          return;
        }

        if (response.status === 503 && generating) {
          const retryAfterSeconds = Number(retryAfterHeader || '2');
          retryCount += 1;
          if (retryCount <= 10) {
            retryTimer = setTimeout(resolvePlaybackUrl, Math.max(1, retryAfterSeconds) * 1000);
            return;
          }

          setResolvedSrc(streamFallbackUrl || sourceFallbackUrl);
          setUsedFallbackSource(Boolean(sourceUrl && !streamFallbackUrl));
          return;
        }

        setResolvedSrc(streamFallbackUrl || sourceFallbackUrl);
        setUsedFallbackSource(Boolean(sourceUrl && !streamFallbackUrl));
      } catch {
        if (cancelled) return;
        // If HEAD preflight fails, still attempt HLS first in player.
        setResolvedSrc(preferredHlsUrl);
        setHlsReady(null);
        setHlsGenerating(false);
      }
    };

    setResolvedSrc(streamFallbackUrl || sourceFallbackUrl);
    setUsedFallbackSource(false);
    setHlsReady(null);
    setHlsGenerating(false);
    resolvePlaybackUrl();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [src, hlsUrl, streamUrl, sourceUrl]);

  // Hls.js initialization
  useEffect(() => {
    if (!resolvedSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const isM3u8 = resolvedSrc.toLowerCase().includes('.m3u8');

    if (isM3u8 && Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        autoStartLoad: true,
        startFragPrefetch: true,
        enableWorker: true,
        lowLatencyMode: false,
        capLevelToPlayerSize: true,
        maxBufferLength: 90,
        maxMaxBufferLength: 180,
        maxBufferSize: 120 * 1000 * 1000,
        backBufferLength: 8,
        maxBufferHole: 1.5,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 8,
        debug: false
      });
      hlsRef.current = hls;

      hls.loadSource(resolvedSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const availableLevels = data.levels.map((level, index) => ({
          id: index,
          height: level.height,
          name: `${level.height}p`
        }));
        setHlsLevels(availableLevels);

        // Restore saved preference
        try {
          const savedIndex = Number(localStorage.getItem('okiso_hls_quality'));
          if (!isNaN(savedIndex)) {
            // Check if saved index exists in current levels
            if (savedIndex === -1 || savedIndex < availableLevels.length) {
              hls.currentLevel = savedIndex;
              setCurrentLevel(savedIndex);
            } else {
              hls.currentLevel = -1;
              setCurrentLevel(-1);
            }
          } else {
            hls.currentLevel = -1;
            setCurrentLevel(-1);
          }
        } catch {
          hls.currentLevel = -1;
          setCurrentLevel(-1);
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        // Just for syncing native state if it auto switches, though we mostly rely on our state.
        // If we want Auto to display something else we can do that here.
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setHlsErrorToast("Stream network error - buffering");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setHlsErrorToast("Media error - recovering");
              hls.recoverMediaError();
              break;
            default:
              setHlsErrorToast("Fatal player error");
              hls.destroy();
              break;
          }
          // Force auto level on fatal error
          hls.currentLevel = -1;
          setCurrentLevel(-1);
          try { localStorage.setItem('okiso_hls_quality', '-1'); } catch { }

          setTimeout(() => setHlsErrorToast(null), 4000);
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (isM3u8 && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = resolvedSrc;
    } else if (!isM3u8) {
      // Standard MP4
      video.src = resolvedSrc;
    }
  }, [resolvedSrc]);

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

  const handleSeeking = () => {
    setIsBuffering(true);
    if (hlsRef.current && videoRef.current) {
      const hls = hlsRef.current;
      // Temporarily drop quality to lowest available for fast seek recovery if we aren't already on Auto
      if (currentLevel !== -1 && hls.levels.length > 0) {
        const lowestLevel = 0; // usually 0 is lowest resolution
        hls.nextLevel = lowestLevel;
      }
      hls.startLoad(Math.max(0, videoRef.current.currentTime - 0.25));
    }
  };

  const handleSeeked = () => {
    setIsBuffering(false);
    if (hlsRef.current) {
      // Restore user-selected quality after ~2s of stable playback following a seek
      setTimeout(() => {
        if (hlsRef.current && currentLevel !== -1) {
          hlsRef.current.currentLevel = currentLevel;
        }
      }, 2000);
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
    : `relative z-[1] group w-full h-full overflow-hidden flex flex-col bg-black justify-center items-center rounded-[16px] md:rounded-[24px] ${className}`;

  return (
    <div className={isCinemaMode ? 'fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8' : 'w-full h-full'}>
      {isCinemaMode && (
        <button
          aria-label="Close cinema mode"
          onClick={() => setIsCinemaMode(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl z-0"
        />
      )}

      <div className={playerContainerClass}>
        {hlsErrorToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-in fade-in zoom-in duration-300">
            {hlsErrorToast}
          </div>
        )}
        {/* Top Bar - Clean System UI */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <span className="font-bold text-xs md:text-sm text-white tracking-widest uppercase drop-shadow-md">
              REC // {title}
            </span>
          </div>
          <div className="font-bold text-xs md:text-sm text-white/50 tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
            {hlsGenerating && hlsReady === false ? 'OPTIMIZING VIDEO...' : usedFallbackSource ? 'SOURCE FALLBACK' : 'SYS.VOD.01'}
          </div>
        </div>

        {/* Loading Spinner */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-12 h-12 border-4 border-white/20 border-t-[#FF7EB3] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          poster={poster}
          className="w-full aspect-video object-contain"
          loop
          autoPlay={autoPlay}
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          disablePictureInPicture
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onVolumeChange={() => {
            if (videoRef.current) {
              setVolume(videoRef.current.volume);
              setIsMuted(videoRef.current.muted || videoRef.current.volume === 0);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            const fallbackUrl = sourceUrl || streamUrl || src;
            if (!usedFallbackSource && fallbackUrl && resolvedSrc !== fallbackUrl) {
              setResolvedSrc(fallbackUrl);
              setUsedFallbackSource(true);
            }
          }}
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
              className="w-20 md:w-28 h-2 appearance-none rounded-full cursor-pointer accent-[#FF7EB3]"
              style={{
                background: `linear-gradient(to right, #FF7EB3 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`
              }}
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
                className="flex-1 h-2 appearance-none rounded-full cursor-pointer accent-[#FF7EB3]"
                style={{
                  background: `linear-gradient(to right, #FF7EB3 ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.2) ${duration ? (currentTime / duration) * 100 : 0}%)`
                }}
                aria-label="Playback progress"
              />
              <span className="text-xs font-bold tracking-wider text-white/80 min-w-[42px]">{formatTime(duration)}</span>
            </div>

            {hlsLevels.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-3 rounded-full transition-colors flex items-center gap-2 ${showSettings ? 'bg-white text-black' : 'hover:bg-white text-white hover:text-black'}`}
                  aria-label="Video Quality"
                >
                  <Settings size={20} />
                  <span className="text-xs font-bold w-10 hidden md:inline-block text-center mr-1">
                    {currentLevel === -1 ? 'AUTO' : hlsLevels.find(l => l.id === currentLevel)?.name || 'AUTO'}
                  </span>
                </button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2 min-w-[120px] flex flex-col gap-1 z-50 shadow-2xl">
                    <button
                      onClick={() => {
                        if (hlsRef.current) hlsRef.current.currentLevel = -1;
                        setCurrentLevel(-1);
                        setShowSettings(false);
                        try { localStorage.setItem('okiso_hls_quality', '-1'); } catch { }
                      }}
                      className={`px-4 py-2 text-sm font-bold rounded-xl text-left transition-colors ${currentLevel === -1 ? 'bg-[#FF7EB3] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                    >
                      Auto
                    </button>
                    {[...hlsLevels].reverse().map((level) => (
                      <button
                        key={level.id}
                        onClick={() => {
                          if (hlsRef.current) hlsRef.current.currentLevel = level.id;
                          setCurrentLevel(level.id);
                          setShowSettings(false);
                          try { localStorage.setItem('okiso_hls_quality', String(level.id)); } catch { }
                        }}
                        className={`px-4 py-2 text-sm font-bold rounded-xl text-left transition-colors ${currentLevel === level.id ? 'bg-[#FF7EB3] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

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
