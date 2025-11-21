'use client';

import React from 'react';

const HollowDistortion: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <svg className="absolute w-0 h-0">
                <filter id="hollow-distortion">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.005" numOctaves="5" seed="2">
                        <animate attributeName="baseFrequency" dur="20s" values="0.01 0.005;0.02 0.008;0.01 0.005" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="20" />
                </filter>
            </svg>
            <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,0,92,0.1), transparent 70%)',
                    filter: 'url(#hollow-distortion)'
                }}
            />
        </div>
    );
};

export default HollowDistortion;
