"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UrbanCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    category?: string;
    accentColor?: "yellow" | "pink" | "cyan" | "orange";
    onClick?: () => void;
    href?: string;
}

export default function UrbanCard({
    children,
    className,
    title,
    category = "01",
    accentColor = "yellow",
    onClick,
    href,
}: UrbanCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const borderRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const colors = {
        yellow: "border-urban-yellow bg-urban-yellow",
        pink: "border-urban-pink bg-urban-pink",
        cyan: "border-neon-cyan bg-neon-cyan",
        orange: "border-neon-orange bg-neon-orange",
    };

    useEffect(() => {
        const card = cardRef.current;
        const border = borderRef.current;
        const glow = glowRef.current;

        if (!card || !border || !glow) return;

        const tl = gsap.timeline({ paused: true });

        tl.to(card, {
            y: -5,
            x: -5,
            duration: 0.2,
            ease: "power2.out",
        })
            .to(
                border,
                {
                    x: 5,
                    y: 5,
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.out",
                },
                0
            )
            .to(
                glow,
                {
                    opacity: 0.5,
                    duration: 0.2,
                    ease: "power2.out",
                },
                0
            );

        const handleMouseEnter = () => tl.play();
        const handleMouseLeave = () => tl.reverse();

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mouseenter", handleMouseEnter);
            card.removeEventListener("mouseleave", handleMouseLeave);
            tl.kill();
        };
    }, []);

    const CardContent = (
        <>
            {/* Glow Effect */}
            <div
                ref={glowRef}
                className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300 blur-xl pointer-events-none",
                    colors[accentColor].split(" ")[1] // Get bg color
                )}
            />

            {/* Offset Border (Visual only) */}
            <div
                ref={borderRef}
                className={cn(
                    "absolute inset-0 -z-10 border-2 opacity-0 transition-all duration-300",
                    colors[accentColor].split(" ")[0]
                )}
                style={{
                    clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                }}
            />

            {/* Header / Sticker */}
            <div className="relative z-10 flex justify-between items-start p-4 border-b border-white/10 bg-white/5">
                {title && (
                    <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                        {title}
                    </h3>
                )}
                <span
                    className={cn(
                        "px-2 py-0.5 text-sm font-bold text-black transform rotate-3",
                        colors[accentColor].split(" ")[1]
                    )}
                >
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4">{children}</div>

            {/* Decorative Tech Lines */}
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/20 pointer-events-none" />
        </>
    );

    const commonClasses = cn(
        "relative group cursor-pointer bg-urban-dark border-2 transition-all duration-300 block",
        colors[accentColor].split(" ")[0], // Get border color
        className
    );

    const commonStyles = {
        clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
    };

    if (href) {
        const isExternal = href.startsWith('http');
        if (isExternal) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={cardRef as unknown as React.RefObject<HTMLAnchorElement>}
                    className={commonClasses}
                    style={commonStyles}
                    onClick={onClick}
                >
                    {CardContent}
                </a>
            );
        }
        return (
            <Link
                href={href}
                ref={cardRef as unknown as React.RefObject<HTMLAnchorElement>}
                className={commonClasses}
                style={commonStyles}
                onClick={onClick}
            >
                {CardContent}
            </Link>
        );
    }

    return (
        <div
            ref={cardRef}
            className={commonClasses}
            style={commonStyles}
            onClick={onClick}
        >
            {CardContent}
        </div>
    );
}

