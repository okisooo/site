"use client";

import React from "react";

export default function HalftoneWave() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern
                        id="halftone-pattern"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="10" cy="10" r="2" className="fill-urban-white" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#halftone-pattern)" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-urban-black via-transparent to-transparent" />
        </div>
    );
}
