'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume] = useState(0.3);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ZZZ Soundtrack Loop (Placeholder URL - replace with actual asset if available)
    // Using a generic upbeat electronic loop for now as placeholder
    const TRACK_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-city-110288.mp3";

    useEffect(() => {
        audioRef.current = new Audio(TRACK_URL);
        audioRef.current.loop = true;
        // Volume is handled by the separate effect below

        // Auto-play attempt
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Auto-play prevented:", error);
                setIsPlaying(false);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Play failed:", e));
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
            {/* Visualizer Bars (CSS Animation) */}
            {isPlaying && (
                <div className="flex items-end gap-1 h-8">
                    <div className="w-1 bg-zzz-volt-green animate-[bounce_0.5s_infinite] h-full" style={{ animationDelay: '0s' }} />
                    <div className="w-1 bg-zzz-electric-blue animate-[bounce_0.7s_infinite] h-2/3" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 bg-zzz-impact-orange animate-[bounce_0.6s_infinite] h-1/2" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 bg-zzz-ether-purple animate-[bounce_0.8s_infinite] h-3/4" style={{ animationDelay: '0.3s' }} />
                </div>
            )}

            {/* Player Control */}
            <div className="bg-zzz-panel-bg border-2 border-zzz-dark-grey p-1 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <button
                    onClick={togglePlay}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                        isPlaying ? "bg-zzz-volt-green text-black" : "bg-zzz-dark-grey text-zzz-text-muted hover:bg-zzz-text-primary hover:text-black"
                    )}
                >
                    {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-1" />}
                </button>

                <div className="pr-4 pl-1 flex flex-col">
                    <span className="text-[10px] font-bold text-zzz-text-muted uppercase tracking-wider">BGM // SYSTEM</span>
                    <span className="text-xs font-display text-zzz-text-primary">ZENLESS ZONE</span>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
