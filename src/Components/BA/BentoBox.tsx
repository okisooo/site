'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BentoBoxProps {
    children: ReactNode;
    className?: string;
    color?: 'sky' | 'pink' | 'yellow' | 'lavender' | 'mint' | 'cream';
    delay?: number;
}

const colorMap = {
    sky: 'bg-ba-sky/10 border-ba-sky/20 hover:border-ba-sky/50 shadow-[0_8px_32px_-12px_rgba(124,200,248,0.2)]',
    pink: 'bg-ba-pink/10 border-ba-pink/20 hover:border-ba-pink/50 shadow-[0_8px_32px_-12px_rgba(255,126,179,0.2)]',
    yellow: 'bg-ba-yellow/10 border-ba-yellow/20 hover:border-ba-yellow/50 shadow-[0_8px_32px_-12px_rgba(255,209,102,0.2)]',
    lavender: 'bg-ba-lavender/10 border-ba-lavender/20 hover:border-ba-lavender/50 shadow-[0_8px_32px_-12px_rgba(196,181,253,0.2)]',
    mint: 'bg-ba-mint/10 border-ba-mint/20 hover:border-ba-mint/50 shadow-[0_8px_32px_-12px_rgba(110,231,183,0.2)]',
    cream: 'bg-white/60 border-white/80 hover:border-ba-pink/30 shadow-ba-soft',
};

export default function BentoBox({ children, className = '', color = 'cream', delay = 0 }: BentoBoxProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                delay,
                type: "spring",
                stiffness: 100,
                damping: 20
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`relative overflow-hidden rounded-ba-lg border backdrop-blur-md transition-all duration-300 ${colorMap[color]} ${className}`}
        >
            {/* Glossy top highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent opacity-50 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </motion.div>
    );
}
