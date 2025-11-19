"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VerticalTextProps {
    text: string;
    className?: string;
    color?: "cyan" | "magenta" | "orange" | "white";
}

export default function VerticalText({ text, className, color = "white" }: VerticalTextProps) {
    const colorClasses = {
        cyan: "text-neon-cyan",
        magenta: "text-neon-magenta",
        orange: "text-neon-orange",
        white: "text-white",
    };

    return (
        <div
            className={cn(
                "writing-vertical-rl text-orientation-upright font-display font-bold tracking-widest uppercase select-none",
                colorClasses[color],
                className
            )}
            style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
        >
            {text}
        </div>
    );
}
