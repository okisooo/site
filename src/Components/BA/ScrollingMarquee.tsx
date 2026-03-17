import React from 'react';
import Marquee from 'react-fast-marquee';

interface ScrollingMarqueeProps {
    text: string;
    speed?: number;
    className?: string;
}

export default function ScrollingMarquee({ text, speed = 50, className = "" }: ScrollingMarqueeProps) {
    // Create an array to repeat the text multiple times to ensure the marquee is always full
    const repeatedText = Array(10).fill(text);

    return (
        <div className={`w-full overflow-hidden bg-ba-sky text-white font-display font-black tracking-widest uppercase py-3 shadow-md border-y-2 border-white/30 transform -rotate-1 origin-left z-20 ${className}`}>
            <Marquee speed={speed} gradient={false} autoFill>
                <div className="flex items-center">
                    {repeatedText.map((t, index) => (
                        <React.Fragment key={index}>
                            <span className="mx-4 drop-shadow-sm">{t}</span>
                            <span className="text-white/50 animate-pulse">✦</span>
                        </React.Fragment>
                    ))}
                </div>
            </Marquee>
        </div>
    );
}
