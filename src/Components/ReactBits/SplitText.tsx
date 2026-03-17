'use client';

import { useSprings, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function SplitText({ text, className = '', delay = 200 }: SplitTextProps) {
    const letters = text.split('');
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '-10% 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const springs = useSprings(
        letters.length,
        letters.map((_, i) => ({
            from: { opacity: 0, transform: 'translate3d(0,40px,0) rotate(-8deg)' },
            to: inView
                ? { opacity: 1, transform: 'translate3d(0,0px,0) rotate(0deg)' }
                : { opacity: 0, transform: 'translate3d(0,40px,0) rotate(-8deg)' },
            delay: delay + i * 50,
            config: { mass: 2, tension: 350, friction: 30 },
        }))
    );

    return (
        <span ref={ref} className={`inline-block ${className}`}>
            {springs.map((props, index) => (
                <animated.span
                    key={index}
                    style={props}
                    className="inline-block whitespace-pre"
                >
                    {letters[index] === ' ' ? '\u00A0' : letters[index]}
                </animated.span>
            ))}
        </span>
    );
}
