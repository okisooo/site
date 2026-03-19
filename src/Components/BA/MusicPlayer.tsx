'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume] = useState(0.3);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isAttemptingPlay = useRef(false);

    const TRACK_URL = "/audio/bgm.mp3";

    useEffect(() => {
        audioRef.current = new Audio(TRACK_URL);
        audioRef.current.loop = true;
        audioRef.current.preload = 'auto';

        audioRef.current.addEventListener('error', (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
        });

        const interactionEvents = ['click', 'touchstart', 'scroll'];

        const handleUserInteraction = () => {
            if (audioRef.current && !isAttemptingPlay.current) {
                isAttemptingPlay.current = true;
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    interactionEvents.forEach(event => {
                        document.removeEventListener(event, handleUserInteraction);
                    });
                }).catch(() => {
                    isAttemptingPlay.current = false;
                });
            }
        };

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(() => {
                setIsPlaying(false);
                interactionEvents.forEach(event => {
                    document.addEventListener(event, handleUserInteraction, { passive: true });
                });
            });
        }

        return () => {
            interactionEvents.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => { });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-4 group">
            {/* Visualizer & Info - Expands on hover */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/80 backdrop-blur-xl border border-black/5 shadow-2xl rounded-full pr-6 pl-4 py-2 flex items-center gap-4"
                    >
                        <div className="flex items-end gap-[3px] h-6 flex-shrink-0">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 rounded-t-sm bg-ba-pink"
                                    style={{ 
                                        animation: `bounce ${0.4 + (i * 0.1)}s infinite alternate`,
                                        height: `${100 - (i * 15)}%` 
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col min-w-[120px]">
                            <span className="text-[10px] font-black tracking-[0.2em] text-black/50 uppercase">Global_BGM</span>
                            <span className="text-sm font-black tracking-widest text-black uppercase truncate">OKISO_V1.mp3</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Huge Play Button */}
            <button
                onClick={togglePlay}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/20 transform hover:scale-110",
                    isPlaying
                        ? "bg-ba-pink text-white shadow-[0_0_40px_rgba(255,126,179,0.6)] border-none"
                        : "bg-white/90 backdrop-blur-xl text-black hover:bg-black hover:text-white"
                )}
            >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
            </button>
        </div>
    );
};

export default MusicPlayer;
