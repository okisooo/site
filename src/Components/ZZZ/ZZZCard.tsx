
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface ZZZCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    accentColor?: 'ether-purple' | 'electric-blue' | 'impact-orange' | 'volt-green';
    title?: string;
}

const ZZZCard: React.FC<ZZZCardProps> = ({
    children,
    className,
    accentColor = 'volt-green',
    title,
    ...props
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const borderColor = {
        'ether-purple': 'border-zzz-ether-purple',
        'electric-blue': 'border-zzz-electric-blue',
        'impact-orange': 'border-zzz-impact-orange',
        'volt-green': 'border-zzz-volt-green',
    }[accentColor];

    const textColor = {
        'ether-purple': 'text-zzz-ether-purple',
        'electric-blue': 'text-zzz-electric-blue',
        'impact-orange': 'text-zzz-impact-orange',
        'volt-green': 'text-zzz-volt-green',
    }[accentColor];

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        // Only enable hover animation on non-touch devices
        const isTouch = window.matchMedia('(hover: none)').matches;
        if (isTouch) return;

        const hoverAnim = gsap.to(card, {
            scale: 1.02,
            skewX: -2,
            duration: 0.3,
            paused: true,
            ease: "back.out(1.7)"
        });

        const enter = () => hoverAnim.play();
        const leave = () => hoverAnim.reverse();

        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);

        return () => {
            card.removeEventListener('mouseenter', enter);
            card.removeEventListener('mouseleave', leave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn(
                "relative bg-zzz-panel-bg p-4 lg:p-6 clip-zzz-card border-l-4 transition-colors duration-300 group",
                borderColor,
                className
            )}
            {...props}
        >
            {/* Halftone Overlay */}
            <div className="absolute inset-0 bg-halftone opacity-5 pointer-events-none" />

            {/* Header if title exists */}
            {title && (
                <div className="mb-4 flex items-center justify-between border-b border-zzz-dark-grey pb-2">
                    <h3 className={cn("font-display text-xl uppercase tracking-tighter", textColor)}>
                        {title}
                    </h3>
                    <div className={cn("h-2 w-2 rounded-full animate-pulse ml-4", `bg-zzz-${accentColor}`)} />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Corner Accents */}
            <div className={cn("absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 opacity-50 transition-all duration-300 group-hover:w-8 group-hover:h-8 group-hover:opacity-100", borderColor)} />
            <div className={cn("absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 opacity-50 transition-all duration-300 group-hover:w-8 group-hover:h-8 group-hover:opacity-100", borderColor)} />
        </div>
    );
};

export default ZZZCard;
