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
    text = "CAUTION // DO NOT CROSS // OKISO TERRITORY //",
    direction = "left",
    color = "yellow",
    className,
}: TapeDividerProps) {
    const bgClass = color === "yellow" ? "bg-urban-yellow" : "bg-urban-pink";
    const textClass = "text-urban-black";

    return (
        <div className={cn("relative w-[120vw] left-[50%] -translate-x-[50%] overflow-hidden py-4 rotate-[-2deg] z-20 border-y-4 border-black shadow-lg my-10", className)}>
            <div className={cn("whitespace-nowrap font-display font-bold text-xl uppercase tracking-widest flex gap-8",
                direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
                textClass
            )}>
                {Array(20).fill(text).map((item, i) => (
                    <span key={i} className="flex items-center gap-4">
                        {item} <span className="text-black/20">{"///"}</span>
                    </span>
                ))}
            </div>
            <div className={cn("absolute inset-0 -z-10 opacity-50", bgClass)} />
        </div>
    );
}
