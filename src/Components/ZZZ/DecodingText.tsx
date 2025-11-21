'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DecodingTextProps {
    text: string;
    className?: string;
    revealDuration?: number;
    trigger?: boolean; // Prop to manually trigger animation
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

const DecodingText: React.FC<DecodingTextProps> = ({
    text,
    className,
    revealDuration = 1.5,
    trigger = true,
}) => {
    const [displayText, setDisplayText] = useState(text);
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!trigger) return;

        let startTime: number;
        let animationFrameId: number;
        const totalDuration = revealDuration * 1000;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);

            // Calculate how many characters should be revealed based on progress
            const revealIndex = Math.floor(progress * text.length);

            let newText = '';
            for (let i = 0; i < text.length; i++) {
                if (i < revealIndex) {
                    newText += text[i];
                } else {
                    // Random character for unrevealed part
                    newText += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplayText(newText);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setDisplayText(text); // Ensure final text is correct
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [text, revealDuration, trigger]);

    return (
        <span ref={elementRef} className={cn("inline-block font-mono", className)}>
            {displayText}
        </span>
    );
};

export default DecodingText;
