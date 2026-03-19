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
    sky: 'bg-ba-sky/30 border-ba-sky/50 backdrop-blur-xl shadow-[8px_8px_0px_#75baff] hover:shadow-[12px_12px_0px_#75baff] hover:bg-ba-sky/40',
    pink: 'bg-ba-pink/30 border-ba-pink/50 backdrop-blur-xl shadow-[8px_8px_0px_#ff99c8] hover:shadow-[12px_12px_0px_#ff99c8] hover:bg-ba-pink/40',
    yellow: 'bg-ba-yellow/30 border-ba-yellow/50 backdrop-blur-xl shadow-[8px_8px_0px_#ffe499] hover:shadow-[12px_12px_0px_#ffe499] hover:bg-ba-yellow/40',
    lavender: 'bg-ba-lavender/30 border-ba-lavender/50 backdrop-blur-xl shadow-[8px_8px_0px_#b3a6ff] hover:shadow-[12px_12px_0px_#b3a6ff] hover:bg-ba-lavender/40',
    mint: 'bg-ba-mint/30 border-ba-mint/50 backdrop-blur-xl shadow-[8px_8px_0px_#8fcca9] hover:shadow-[12px_12px_0px_#8fcca9] hover:bg-ba-mint/40',
    cream: 'bg-white/40 border-white/60 backdrop-blur-xl shadow-[8px_8px_0px_#ffffff] hover:shadow-[12px_12px_0px_#ffffff] hover:bg-white/50',
};

export default function BentoBox({ children, className = '', color = 'cream', delay = 0 }: BentoBoxProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.1,
                delay,
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
            whileHover={{ y: -6, scale: 1.02, skewX: -2 }}
            className={`relative overflow-hidden brutalist-border border-2 transition-all duration-[50ms] ${colorMap[color]} ${className}`}
        >
            {/* Glossy top highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-ba-white/40 to-transparent opacity-50 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </motion.div>
    );
}
