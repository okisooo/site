'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
    children: React.ReactNode;
    title?: string;
    accentColor?: 'sky' | 'pink' | 'yellow' | 'lavender' | 'mint';
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

const accentMap = {
    sky: 'border-ba-sky/30 hover:border-ba-sky/60',
    pink: 'border-ba-pink/30 hover:border-ba-pink/60',
    yellow: 'border-ba-yellow/30 hover:border-ba-yellow/60',
    lavender: 'border-ba-lavender/30 hover:border-ba-lavender/60',
    mint: 'border-ba-mint/30 hover:border-ba-mint/60',
};

const titleColorMap = {
    sky: 'text-ba-sky-deep',
    pink: 'text-ba-pink-deep',
    yellow: 'text-ba-coral',
    lavender: 'text-purple-600',
    mint: 'text-emerald-600',
};

export default function AnimeCard({
    children,
    title,
    accentColor = 'sky',
    className,
    onClick,
    hoverable = true,
}: AnimeCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                'relative bg-white/80 backdrop-blur-md rounded-ba p-5',
                'border-2 transition-all duration-300',
                accentMap[accentColor],
                hoverable && 'hover:shadow-ba-card hover:-translate-y-1',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {title && (
                <h3 className={cn(
                    'text-sm font-display font-bold uppercase tracking-wide mb-3',
                    titleColorMap[accentColor]
                )}>
                    ✦ {title}
                </h3>
            )}
            {children}
        </div>
    );
}
