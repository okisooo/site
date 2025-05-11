"use client";

import Waves from '../Backgrounds/Waves/Waves';
import { memo } from "react";

function WavesWrapperComponent() {
    return (
        <div className="fixed inset-0 w-[100vw] h-[100vh] overflow-hidden" style={{ zIndex: -10 }}>
            <Waves
                lineColor="rgba(255, 255, 255, 0.3)"
                backgroundColor="rgb(0, 0, 0)"
                waveSpeedX={0.015}
                waveSpeedY={0.01}
                waveAmpX={40}
                waveAmpY={30}
                friction={0.95}
                tension={0.01}
                maxCursorMove={80}
                xGap={32}
                yGap={32}
            />
        </div>
    );
}

export default memo(WavesWrapperComponent);
