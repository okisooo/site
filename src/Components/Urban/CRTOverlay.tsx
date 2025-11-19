"use client";

import React from "react";

export default function CRTOverlay() {
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {/* Scanlines */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background:
                        "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                    backgroundSize: "100% 2px, 3px 100%",
                }}
            />
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
}
