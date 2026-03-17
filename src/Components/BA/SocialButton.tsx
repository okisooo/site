'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SocialButtonProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    color?: 'sky' | 'pink' | 'yellow' | 'lavender' | 'mint' | 'coral';
}

const colorMap = {
    sky: 'bg-ba-red/10 text-ba-red-deep hover:bg-ba-red hover:text-white hover:shadow-ba-glow-sky',
    pink: 'bg-ba-pink/10 text-ba-pink-deep hover:bg-ba-pink hover:text-white hover:shadow-ba-glow-pink',
    yellow: 'bg-ba-yellow/10 text-ba-coral hover:bg-ba-yellow hover:text-ba-dark hover:shadow-ba-glow-yellow',
    lavender: 'bg-ba-lavender/10 text-purple-600 hover:bg-ba-lavender hover:text-white hover:shadow-[0_0_20px_rgba(196,181,253,0.4)]',
    mint: 'bg-ba-mint/10 text-emerald-600 hover:bg-ba-mint hover:text-white hover:shadow-[0_0_20px_rgba(110,231,183,0.4)]',
    coral: 'bg-ba-coral/10 text-ba-coral hover:bg-ba-coral hover:text-white hover:shadow-[0_0_20px_rgba(251,146,60,0.4)]',
};

export default function SocialButton({ icon, label, href, color = 'sky' }: SocialButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                'group flex flex-col items-center justify-center gap-2 p-4',
                'rounded-ba border-2 border-transparent',
                'transition-all duration-300 ease-out',
                'hover:scale-110 hover:-translate-y-1 active:scale-95',
                colorMap[color]
            )}
            aria-label={label}
        >
            <div className="text-2xl transition-transform duration-300 group-hover:animate-wiggle">
                {icon}
            </div>
            <span className="text-xs font-bold font-display uppercase tracking-wider opacity-70 group-hover:opacity-100">
                {label}
            </span>
        </a>
    );
}
