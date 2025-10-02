"use client";

import { useAdaptivePerformance } from '@/hooks/usePerformanceDetection';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';

interface NavigationItem {
  label: string;
  href: string;
}

interface AdaptiveNavigationProps {
  items: NavigationItem[];
  initialActiveIndex?: number;
  className?: string;
}

// Simple fallback navigation
const SimpleNavigation = ({
  items,
  initialActiveIndex = 0,
  className
}: AdaptiveNavigationProps) => {
  return (
    <nav className={`${className} flex items-center justify-center`}>
      <div className="flex items-center gap-1 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
        {items.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${index === initialActiveIndex
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

// Reduced particle navigation
const ReducedGooeyNav = ({
  items,
  initialActiveIndex,
  className
}: AdaptiveNavigationProps) => {
  return (
    <div className={className}>
      <GooeyNav
        items={items}
        initialActiveIndex={initialActiveIndex}
        animationTime={400} // Faster
        particleCount={8} // Fewer particles
        particleDistances={[60, 8]} // Smaller distances
        particleR={60} // Smaller radius
        timeVariance={150} // Less variance
        colors={[1, 2, 3, 1]} // Fewer colors
      />
    </div>
  );
};

export default function AdaptiveNavigation({
  items,
  initialActiveIndex = 0,
  className = ""
}: AdaptiveNavigationProps) {
  const {
    shouldUseReducedEffects,
    shouldDisableAnimations,
    shouldReduceParticles,
    isLowEnd
  } = useAdaptivePerformance();

  // Simple navigation for very low-end devices
  if (shouldDisableAnimations || isLowEnd) {
    return (
      <SimpleNavigation
        items={items}
        initialActiveIndex={initialActiveIndex}
        className={className}
      />
    );
  }

  // Reduced effects navigation
  if (shouldUseReducedEffects || shouldReduceParticles) {
    return (
      <ReducedGooeyNav
        items={items}
        initialActiveIndex={initialActiveIndex}
        className={className}
      />
    );
  }

  // Full navigation for capable devices
  return (
    <div className={className}>
      <GooeyNav
        items={items}
        initialActiveIndex={initialActiveIndex}
        animationTime={600}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />
    </div>
  );
}
