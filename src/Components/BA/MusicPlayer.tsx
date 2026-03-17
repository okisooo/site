'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { cn } from '@/lib/utils';

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

        const interactionEvents = ['click', 'keydown', 'touchstart', 'mousedown', 'pointerdown', 'scroll', 'wheel'];

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

    const barColors = ['bg-ba-pink', 'bg-ba-sky', 'bg-ba-yellow', 'bg-ba-lavender'];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            {/* Visualizer Bars */}
            {isPlaying && (
                <div className="flex items-end gap-[3px] h-8">
                    {barColors.map((color, i) => (
                        <div
                            key={i}
                            className={cn(
                                'w-1 rounded-full transition-all',
                                color,
                                i === 0 && 'animate-[bounce_0.5s_infinite] h-full',
                                i === 1 && 'animate-[bounce_0.7s_infinite] h-2/3',
                                i === 2 && 'animate-[bounce_0.6s_infinite] h-1/2',
                                i === 3 && 'animate-[bounce_0.8s_infinite] h-3/4',
                            )}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            )}

            {/* Player Control */}
            <div className="bg-white/80 backdrop-blur-md border-2 border-ba-sky/20 p-1 rounded-ba-pill flex items-center gap-2 shadow-ba-soft">
                <button
                    onClick={togglePlay}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                        isPlaying
                            ? "bg-gradient-to-r from-ba-pink to-ba-pink-deep text-white shadow-ba-glow-pink"
                            : "bg-ba-sky/10 text-ba-sky-deep hover:bg-ba-sky hover:text-white"
                    )}
                >
                    {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
                </button>

                <div className="pr-4 pl-1 flex flex-col">
                    <span className="text-[10px] font-bold text-ba-muted uppercase tracking-wider">♫ NOW PLAYING</span>
                    <span className="text-xs font-display font-bold text-ba-dark">BGM</span>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
