"use client";

import Waves from '../Backgrounds/Waves/Waves';
import { memo } from "react";

function WavesWrapperComponent() {
    return (
        <div className="fixed inset-0 w-[100vw] h-[100vh] overflow-hidden" style={{ zIndex: 0 }}>
            <Waves
                lineColor="#fff"
                backgroundColor="rgb(0, 0, 0)"
                waveSpeedX={0.02}
                waveSpeedY={0.01}
                waveAmpX={40}
                waveAmpY={20}
                friction={0.9}
                tension={0.01}
                maxCursorMove={120}
                xGap={12}
                yGap={36}
            />
        </div>
    );
}

export default memo(WavesWrapperComponent);
