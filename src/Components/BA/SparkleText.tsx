'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SparkleTextProps {
    children: React.ReactNode;
    className?: string;
    sparkleColor?: string;
}

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
}

export default function SparkleText({
    children,
    className,
    sparkleColor = '#FFD166',
}: SparkleTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sparklesRef = useRef<Sparkle[]>([]);
    const [sparkles, setSparkles] = React.useState<Sparkle[]>([]);

    useEffect(() => {
        const generateSparkles = () => {
            const newSparkles: Sparkle[] = Array.from({ length: 6 }, (_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 8 + 4,
                delay: Math.random() * 2,
            }));
            sparklesRef.current = newSparkles;
            setSparkles(newSparkles);
        };

        generateSparkles();
        const interval = setInterval(generateSparkles, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span ref={containerRef} className={cn('relative inline-block', className)}>
            {sparkles.map((sparkle) => (
                <svg
                    key={sparkle.id}
                    className="absolute pointer-events-none animate-sparkle"
                    style={{
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        width: sparkle.size,
                        height: sparkle.size,
                        animationDelay: `${sparkle.delay}s`,
                    }}
                    viewBox="0 0 24 24"
                    fill={sparkleColor}
                >
                    <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
                </svg>
            ))}
            {children}
        </span>
    );
}
