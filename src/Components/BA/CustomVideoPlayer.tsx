'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

export default function CustomVideoPlayer({ src, poster, title = 'ARCHIVE.MP4', className = '' }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className={`relative group w-full h-full overflow-hidden flex flex-col bg-black ${className}`}>
      {/* Top Bar - Clean System UI */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <span className="font-bold text-xs md:text-sm text-white tracking-widest uppercase drop-shadow-md">
            REC // {title}
          </span>
        </div>
        <div className="font-bold text-xs md:text-sm text-white/50 tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          SYS.VOD.01
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
        muted={isMuted}
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
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="flex items-center gap-4 md:gap-6 text-white max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20">
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

          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1/3 h-full bg-ba-pink shadow-[0_0_10px_var(--ba-pink)]" />
          </div>

          <button 
            onClick={toggleFullScreen}
            className="p-3 hover:bg-white text-white hover:text-black rounded-full transition-colors"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
