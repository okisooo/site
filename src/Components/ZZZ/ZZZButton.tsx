'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface ZZZButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    accentColor?: 'ether-purple' | 'electric-blue' | 'impact-orange' | 'volt-green';
}

const ZZZButton: React.FC<ZZZButtonProps> = ({
    children,
    className,
    variant = 'primary',
    accentColor = 'volt-green',
    ...props
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const baseStyles = "relative px-8 py-3 font-display font-bold uppercase tracking-wider clip-zzz-card transition-colors duration-200";

    const variants = {
        primary: `bg-zzz-${accentColor} text-zzz-black hover:bg-white`,
        secondary: "bg-zzz-dark-grey text-white hover:bg-zzz-black border border-zzz-dark-grey",
        outline: `bg-transparent border-2 border-zzz-${accentColor} text-zzz-${accentColor} hover:bg-zzz-${accentColor} hover:text-zzz-black`
    };

    useEffect(() => {
        const btn = buttonRef.current;
        if (!btn) return;

        const hoverAnim = gsap.to(btn, {
            scale: 1.05,
            duration: 0.1,
            paused: true,
            ease: "back.out(1.7)"
        });

        const enter = () => hoverAnim.play();
        const leave = () => hoverAnim.reverse();

        btn.addEventListener('mouseenter', enter);
        btn.addEventListener('mouseleave', leave);

        return () => {
            btn.removeEventListener('mouseenter', enter);
            btn.removeEventListener('mouseleave', leave);
        };
    }, []);

    return (
        <button
            ref={buttonRef}
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            <span ref={textRef} className="relative z-10">
                {children}
            </span>
        </button>
    );
};

export default ZZZButton;
