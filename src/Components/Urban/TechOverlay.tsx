"use client";

import React from "react";

export default function TechOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-50">
                {/* Moving Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[length:100%_4px] animate-scanline" />
                {/* RGB Subpixels */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:3px_100%]" />
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] z-40 pointer-events-none" />

            {/* HUD Elements */}
            <div className="absolute inset-4 border border-white/10 rounded-3xl z-30 mix-blend-screen opacity-60 pointer-events-none">
                {/* Top Left Corner */}
                <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-zzz-volt-green rounded-tl-3xl" />
                <div className="absolute top-4 left-4 font-mono text-xs text-zzz-volt-green">
                    SYS.ONLINE<br />
                    PROXY.ID: OKISO
                </div>

                {/* Top Right Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-zzz-volt-green rounded-tr-3xl" />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zzz-ether-purple animate-pulse" />
                    <span className="font-mono text-xs text-zzz-ether-purple tracking-widest">REC</span>
                </div>

                {/* Bottom Left Corner */}
                <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-zzz-volt-green rounded-bl-3xl" />

                {/* Bottom Right Corner */}
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-zzz-volt-green rounded-br-3xl" />
                <div className="absolute bottom-4 right-4 font-mono text-xs text-zzz-volt-green text-right">
                    BATTERY: 99%<br />
                    ETHER: STABLE
                </div>
            </div>
        </div>
    );
}
