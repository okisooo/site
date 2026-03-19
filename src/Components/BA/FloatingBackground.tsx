'use client';

import React from 'react';
import { motion } from 'framer-motion';

const shapes = [
    { size: 160, color: 'border-ba-red/30', delay: 0, duration: 2, x: '10%', y: '20%', skew: -20 },
    { size: 140, color: 'border-ba-white/10', delay: 0.5, duration: 1.5, x: '80%', y: '15%', skew: 15 },
    { size: 200, color: 'border-ba-mint/20', delay: 1, duration: 2.5, x: '60%', y: '70%', skew: -30 },
    { size: 130, color: 'border-ba-yellow/20', delay: 0.2, duration: 2, x: '25%', y: '80%', skew: 25 },
    { size: 150, color: 'border-ba-pink/20', delay: 0.8, duration: 1.8, x: '90%', y: '50%', skew: -10 },
];

export default function FloatingBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-difference">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className={`absolute border-4 ${shape.color} bg-transparent backdrop-blur-sm`}
                    style={{
                        width: shape.size,
                        height: shape.size / 2,
                        left: shape.x,
                        top: shape.y,
                        transform: `skewX(${shape.skew}deg)`
                    }}
                    animate={{
                        x: [0, 40, -40, 0],
                        y: [0, -40, 40, 0],
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                        delay: shape.delay,
                    }}
                />
            ))}
        </div>
    );
}
