"use client";

import React from "react";

export default function TechOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-overlay opacity-30">
            {/* Clean Frame Corners - Less "Sci-Fi", more "Camera Viewfinder" */}
            <div className="absolute left-8 top-8 h-8 w-8 border-l border-t border-white/40" />
            <div className="absolute right-8 top-8 h-8 w-8 border-r border-t border-white/40" />
            <div className="absolute left-8 bottom-8 h-8 w-8 border-l border-b border-white/40" />
            <div className="absolute right-8 bottom-8 h-8 w-8 border-r border-b border-white/40" />

            {/* Simple Grid Lines - Very subtle */}
            <div className="absolute left-12 top-1/2 h-12 w-[1px] -translate-y-1/2 bg-white/10" />
            <div className="absolute right-12 top-1/2 h-12 w-[1px] -translate-y-1/2 bg-white/10" />

            {/* Recording / Status Dot */}
            <div className="absolute top-10 right-12 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white/60 tracking-widest">REC</span>
            </div>
        </div>
    );
}
