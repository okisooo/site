"use client";

import Waves from '../Backgrounds/Waves/Waves';
import { memo, useEffect, useState } from "react";
import { useTheme } from "next-themes";

function WavesWrapperComponent() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <div className="fixed inset-0 w-[100vw] h-[100vh] overflow-hidden pointer-events-none opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ zIndex: 0 }}>
            <Waves
                lineColor={isDark ? "rgba(255, 126, 179, 0.5)" : "rgba(255, 77, 77, 0.4)"}
                backgroundColor="transparent"
                waveSpeedX={0.02}
                waveSpeedY={0.01}
                waveAmpX={50}
                waveAmpY={25}
                friction={0.9}
                tension={0.01}
                maxCursorMove={120}
                xGap={16}
                yGap={36}
            />
        </div>
    );
}

export default memo(WavesWrapperComponent);
