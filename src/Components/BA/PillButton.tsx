'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PillButtonProps {
    children: React.ReactNode;
    variant?: 'sky' | 'pink' | 'yellow';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    href?: string;
}

const variantMap = {
    sky: 'bg-gradient-to-r from-ba-sky to-ba-sky-deep hover:shadow-ba-glow-sky',
    pink: 'bg-gradient-to-r from-ba-pink to-ba-pink-deep hover:shadow-ba-glow-pink',
    yellow: 'bg-gradient-to-r from-ba-yellow to-ba-coral text-ba-dark hover:shadow-ba-glow-yellow',
};

const sizeMap = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export default function PillButton({
    children,
    variant = 'sky',
    size = 'md',
    className,
    onClick,
    href,
}: PillButtonProps) {
    const baseClasses = cn(
        'inline-flex items-center justify-center gap-2 rounded-ba-pill',
        'font-display font-bold text-white',
        'transition-all duration-300 ease-out',
        'hover:scale-105 active:scale-95',
        variantMap[variant],
        sizeMap[size],
        className
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
                {children}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={baseClasses}>
            {children}
        </button>
    );
}
