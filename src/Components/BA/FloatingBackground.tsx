'use client';

import React from 'react';
import { motion } from 'framer-motion';

const shapes = [
    { size: 60, color: 'bg-ba-pink/20', delay: 0, duration: 8, x: '10%', y: '20%' },
    { size: 40, color: 'bg-ba-red/20', delay: 1, duration: 10, x: '80%', y: '15%' },
    { size: 80, color: 'bg-ba-yellow/15', delay: 2, duration: 12, x: '60%', y: '70%' },
    { size: 30, color: 'bg-ba-lavender/25', delay: 0.5, duration: 9, x: '25%', y: '80%' },
    { size: 50, color: 'bg-ba-mint/20', delay: 1.5, duration: 11, x: '90%', y: '50%' },
    { size: 35, color: 'bg-ba-pink/15', delay: 3, duration: 7, x: '45%', y: '10%' },
    { size: 25, color: 'bg-ba-red/25', delay: 2.5, duration: 13, x: '15%', y: '55%' },
    { size: 45, color: 'bg-ba-yellow/20', delay: 0.8, duration: 9, x: '70%', y: '35%' },
];

export default function FloatingBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${shape.color} blur-xl`}
                    style={{
                        width: shape.size,
                        height: shape.size,
                        left: shape.x,
                        top: shape.y,
                    }}
                    animate={{
                        y: [0, -30, 0, 20, 0],
                        x: [0, 15, -10, 5, 0],
                        scale: [1, 1.2, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: shape.duration,
                        delay: shape.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}
