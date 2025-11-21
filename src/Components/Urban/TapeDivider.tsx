"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TapeDividerProps {
    text?: string;
    direction?: "left" | "right";
    color?: "yellow" | "pink";
    className?: string;
}

export default function TapeDivider({
    text = "CAUTION // DO NOT CROSS // HOLLOW ZERO //",
    direction = "left",
    color = "yellow",
    className,
}: TapeDividerProps) {
    const bgClass = {
        yellow: "bg-zzz-warning-yellow",
        pink: "bg-zzz-ether-purple",
        blue: "bg-zzz-electric-blue",
        orange: "bg-zzz-impact-orange"
    }[color] || "bg-zzz-warning-yellow";

    const textClass = "text-zzz-black";

    return (
        <div className={cn("relative w-[120vw] left-[50%] -translate-x-[50%] overflow-hidden py-3 rotate-[-2deg] z-20 border-y-4 border-zzz-black shadow-[0_0_15px_rgba(0,0,0,0.5)] my-10", className)}>
            <div className={cn("whitespace-nowrap font-display font-black text-2xl uppercase tracking-tighter flex gap-8",
                direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
                textClass
            )}>
                {Array(20).fill(text).map((item, i) => (
                    <span key={i} className="flex items-center gap-4">
                        {item} <span className="text-zzz-black/20">{"///"}</span>
                    </span>
                ))}
            </div>
            <div className={cn("absolute inset-0 -z-10 opacity-90", bgClass)} />
            {/* Halftone Overlay */}
            <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none mix-blend-overlay" />
        </div>
    );
}
