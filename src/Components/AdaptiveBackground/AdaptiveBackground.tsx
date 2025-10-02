"use client";

import { useAdaptivePerformance } from '@/hooks/usePerformanceDetection';
import DarkVeil from '@/Backgrounds/DarkVeil/DarkVeil';
import Waves from '@/Backgrounds/Waves/Waves';

interface AdaptiveBackgroundProps {
  children: React.ReactNode;
  backgroundType?: 'darkveil' | 'waves' | 'static';
  className?: string;
}

// Static fallback backgrounds
const StaticGradientBackground = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`${className} relative`}
    style={{
      background: `
        radial-gradient(circle at 20% 50%, rgba(255, 42, 166, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 214, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(255, 0, 122, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #0a0a0f 0%, #0f0a0e 50%, #1a0a14 100%)
      `
    }}
  >
    {children}
  </div>
);

const MinimalAnimatedBackground = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`${className} relative overflow-hidden`}>
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(255, 42, 166, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 107, 214, 0.15) 0%, transparent 50%)
        `,
        animation: 'float 20s ease-in-out infinite'
      }}
    />
    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(30px, -30px) rotate(1deg); }
        66% { transform: translate(-20px, 20px) rotate(-1deg); }
      }
    `}</style>
    {children}
  </div>
);

export default function AdaptiveBackground({ children, backgroundType = 'darkveil', className = '' }: AdaptiveBackgroundProps) {
  const {
    shouldUseStaticBackgrounds,
    shouldUseReducedEffects,
    supportsWebGL,
    isLowEnd
  } = useAdaptivePerformance();

  // Force static background for low-end devices
  if (shouldUseStaticBackgrounds || !supportsWebGL) {
    return <StaticGradientBackground className={className}>{children}</StaticGradientBackground>;
  }

  // Reduced effects but still some animation
  if (shouldUseReducedEffects || isLowEnd) {
    return <MinimalAnimatedBackground className={className}>{children}</MinimalAnimatedBackground>;
  }

  // Full effects for capable devices
  switch (backgroundType) {
    case 'darkveil':
      return (
        <div className={`${className} relative`}>
          <DarkVeil
            hueShift={0}
            noiseIntensity={0.02}
            scanlineIntensity={0.05}
            speed={0.3}
            scanlineFrequency={1.5}
            warpAmount={0.1}
            resolutionScale={0.75} // Slightly reduced for better performance
          />
          {children}
        </div>
      );

    case 'waves':
      return (
        <div className={`${className} relative`}>
          <Waves
            lineColor="rgba(255, 42, 166, 0.3)"
            waveSpeedX={0.008}
            waveSpeedY={0.003}
            waveAmpX={24}
            waveAmpY={12}
            friction={0.95}
            tension={0.003}
          />
          {children}
        </div>
      );

    default:
      return <StaticGradientBackground className={className}>{children}</StaticGradientBackground>;
  }
}
