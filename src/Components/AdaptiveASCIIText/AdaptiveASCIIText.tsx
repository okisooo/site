"use client";

import { useAdaptivePerformance } from '@/hooks/usePerformanceDetection';
import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';

interface AdaptiveASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  className?: string;
}

// Fallback CSS-only text effect
const StaticStyledText = ({ 
  text, 
  textColor, 
  className 
}: { 
  text: string; 
  textColor: string; 
  className?: string;
}) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <div 
      className="font-mono font-bold select-none"
      style={{ 
        color: textColor,
        fontSize: 'clamp(2rem, 8vw, 6rem)',
        textShadow: `
          0 0 10px ${textColor}40,
          0 0 20px ${textColor}30,
          0 0 40px ${textColor}20
        `,
        letterSpacing: '0.1em'
      }}
    >
      {text}
    </div>
  </div>
);

// Reduced animation text effect
const LightAnimatedText = ({ 
  text, 
  textColor, 
  className 
}: { 
  text: string; 
  textColor: string; 
  className?: string;
}) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <div 
      className="font-mono font-bold select-none"
      style={{ 
        color: textColor,
        fontSize: 'clamp(2rem, 8vw, 6rem)',
        textShadow: `
          0 0 10px ${textColor}40,
          0 0 20px ${textColor}30,
          0 0 40px ${textColor}20
        `,
        letterSpacing: '0.1em',
        animation: 'pulse 4s ease-in-out infinite'
      }}
    >
      {text}
    </div>
    <style jsx>{`
      @keyframes pulse {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1);
          filter: brightness(1);
        }
        50% { 
          opacity: 0.8; 
          transform: scale(1.02);
          filter: brightness(1.1);
        }
      }
    `}</style>
  </div>
);

export default function AdaptiveASCIIText({
  text = "OKISO",
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = "#fdf9f3",
  planeBaseHeight = 8,
  enableWaves = true,
  className = ""
}: AdaptiveASCIITextProps) {
  const { 
    shouldUseStaticBackgrounds, 
    shouldUseReducedEffects, 
    shouldDisableAnimations,
    supportsWebGL,
    isLowEnd 
  } = useAdaptivePerformance();

  // No animation for reduced motion or very low-end devices
  if (shouldDisableAnimations || shouldUseStaticBackgrounds || !supportsWebGL) {
    return (
      <StaticStyledText 
        text={text} 
        textColor={textColor} 
        className={className}
      />
    );
  }

  // Light animation for reduced effects
  if (shouldUseReducedEffects || isLowEnd) {
    return (
      <LightAnimatedText 
        text={text} 
        textColor={textColor} 
        className={className}
      />
    );
  }

  // Full ASCII animation for capable devices
  return (
    <ASCIIText
      text={text}
      asciiFontSize={Math.max(6, asciiFontSize - (isLowEnd ? 2 : 0))} // Slightly smaller for performance
      textFontSize={textFontSize}
      textColor={textColor}
      planeBaseHeight={planeBaseHeight}
      enableWaves={enableWaves && !shouldUseReducedEffects}
    />
  );
}
