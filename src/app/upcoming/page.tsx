"use client";

import { useState, useEffect, useMemo } from "react";
import AnimeCard from '@/Components/BA/AnimeCard';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';

export default function UpcomingPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

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
    <div className={`min-h-screen w-full relative text-ba-dark ${mobile ? 'pb-24 px-3' : 'pt-20 px-6'}`} style={{ overscrollBehaviorY: 'contain', overscrollBehaviorX: 'none', touchAction: 'pan-y' }}>
      <div className={`mx-auto relative z-10 flex flex-col ${mobile ? 'max-w-4xl' : 'max-w-6xl pb-20'}`}>
        <header className={`${mobile ? 'mb-4' : 'mb-8'}`}>
          <h1 className={`font-display font-black text-ba-dark text-center ${mobile ? 'text-2xl mb-2' : 'text-5xl mb-4'}`}>
            ✦ Upcoming Releases
          </h1>
          <p className={`text-ba-muted text-center mx-auto ${mobile ? 'text-sm mb-4 max-w-2xl' : 'text-lg mb-6 max-w-4xl'}`}>
            Get a preview of what&apos;s coming next from OKISO ♪
          </p>
        </header>

        <AnimeCard accentColor="yellow" className="flex-grow">
          <div className={`flex flex-col items-center justify-center text-center h-full ${mobile ? 'py-8 px-2' : 'py-16 px-4'}`}>
            <div className="text-5xl mb-4 animate-float">✦</div>
            <h2 className={`font-display font-bold mb-3 text-ba-dark ${mobile ? 'text-2xl' : 'text-3xl'}`}>
              Nothing Upcoming Right Now!
            </h2>
            <p className={`text-ba-muted mb-4 max-w-md mx-auto ${mobile ? 'text-sm' : 'text-base'}`}>
              All releases are now available! Check out the latest music on the Releases page.
            </p>
            <p className={`text-ba-muted/60 max-w-md mx-auto ${mobile ? 'text-xs' : 'text-sm'}`}>
              Stay tuned for future announcements and new music ♫
            </p>
          </div>
        </AnimeCard>
      </div>

      {/* Navigation */}
      <div className={mobile ? "fixed left-0 w-full z-50 flex justify-center bottom-4" : "fixed left-0 w-full z-50 flex justify-center top-4"}>
        <GooeyNav
          items={navItems}
          initialActiveIndex={initialActiveIndex}
          animationTime={600}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>
    </div>
  );
}
