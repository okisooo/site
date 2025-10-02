"use client";

import { useState, useEffect, useMemo } from "react";
import ContentCard from '@/Components/ContentCard';
import AdaptiveNavigation from '@/Components/AdaptiveNavigation/AdaptiveNavigation';
import { useAdaptivePerformance } from '@/hooks/usePerformanceDetection';

export default function UpcomingPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { shouldUseReducedEffects } = useAdaptivePerformance();

  useEffect(() => {
    document.body.classList.add('upcoming-page');
    return () => {
      document.body.classList.remove('upcoming-page');
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = useMemo(() => [
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Home', href: '/' },
    { label: 'Releases', href: '/releases' }
  ], []);

  const initialActiveIndex = 0;

  const mobile = isMobile === null ? false : isMobile;

  return (
    <div className={`min-h-screen w-full relative text-white ${mobile ? 'pb-bottom-nav px-3' : 'pt-top-nav px-6'}`} style={{ overscrollBehaviorY: 'contain', overscrollBehaviorX: 'none', touchAction: 'pan-y' }}>
      {/* Vignette effect overlay - use absolute so it doesn't create viewport bugs on iOS */}
      {!shouldUseReducedEffects && (
        <div className="absolute top-0 left-0 w-full h-full bg-vignette z-[1] pointer-events-none"></div>
      )}

      <div className={`mx-auto relative z-10 flex flex-col ${mobile ? 'max-w-4xl' : 'max-w-6xl pb-20'}`}>
        <header className={`${mobile ? 'mb-4' : 'mb-8'}`}>
          <h1 className={`h-display h-neon-strong font-bold text-center ${mobile ? 'text-2xl mb-2' : 'text-5xl mb-4'}`}>
            OKISO Upcoming Releases
          </h1>
          <p className={`text-shadow-md text-gray-200 text-center mx-auto ${mobile ? 'text-base mb-4 max-w-2xl' : 'text-xl mb-6 max-w-4xl'}`}>
            Get a preview of what is coming next from OKISO. Check back later for updates.
          </p>
        </header>
        <ContentCard className="flex-grow">
          <div className={`flex flex-col items-center justify-center text-center h-full ${mobile ? 'py-8 px-2' : 'py-16 px-4'}`}>
            <svg className={`text-gray-400 mx-auto mb-4 ${mobile ? 'w-16 h-16' : 'w-24 h-24'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className={`font-bold text-shadow-lg mb-3 text-gray-300 ${mobile ? 'text-2xl' : 'text-3xl'}`}>Nothing Upcoming Right Now</h2>
            <p className={`text-shadow-md text-gray-400 mb-4 max-w-md mx-auto ${mobile ? 'text-sm' : 'text-lg'}`}>
              All releases are now available! Check out the latest music on the Releases page.
            </p>
            <p className={`text-gray-500 text-shadow-sm max-w-md mx-auto ${mobile ? 'text-xs' : 'text-base'}`}>
              Stay tuned for future announcements and new music from OKISO.
            </p>
          </div>
        </ContentCard>
      </div>
      {/* AdaptiveNavigation - positioned differently for mobile vs desktop */}
      <div className={mobile ? "fixed left-0 w-full z-50 flex justify-center bottom-nav-safe" : "fixed left-0 w-full z-50 flex justify-center top-nav-safe"}>
        <AdaptiveNavigation items={navItems} initialActiveIndex={initialActiveIndex} />
      </div>
    </div>
  );
}