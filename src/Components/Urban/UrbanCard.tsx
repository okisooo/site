"use client";

import React from "react";
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
    const colors = {
        yellow: "border-urban-yellow bg-urban-yellow",
        pink: "border-urban-pink bg-urban-pink",
        cyan: "border-neon-cyan bg-neon-cyan",
        orange: "border-neon-orange bg-neon-orange",
    };

    const CardContent = (
        <>
            {/* Glow Effect */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300 blur-xl pointer-events-none group-hover:opacity-50",
                    colors[accentColor].split(" ")[1] // Get bg color
                )}
            />

            {/* Offset Border (Visual only) */}
            <div
                className={cn(
                    "absolute inset-0 -z-10 border-2 opacity-0 transition-all duration-300 ease-out translate-x-0 translate-y-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:translate-y-2",
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
        "relative group cursor-pointer bg-urban-dark border-2 transition-transform duration-300 ease-out block group-hover:-translate-x-1 group-hover:-translate-y-1",
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
            className={commonClasses}
            style={commonStyles}
            onClick={onClick}
        >
            {CardContent}
        </div>
    );
}

