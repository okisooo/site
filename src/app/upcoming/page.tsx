"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContentCard from '@/Components/ContentCard';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';

export default function UpcomingPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const minSwipeDistance = 50;

  const smoothNavigate = (to: string, delay: number = 150) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    document.body.style.cursor = 'wait';

    setTimeout(() => {
      router.push(to);
      setTimeout(() => {
        setIsTransitioning(false);
        document.body.style.cursor = 'default';
      }, 100);
    }, delay);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && isMobile) {
      // Swipe left -> go to releases
      smoothNavigate("/releases");
    }
    if (isRightSwipe && isMobile) {
      // Swipe right -> go back to home
      smoothNavigate("/");
    }
  };

  useEffect(() => {
    document.body.classList.add('upcoming-page');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100vw';
    document.body.style.top = '0';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.bottom = '0';
    return () => {
      document.body.classList.remove('upcoming-page');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Releases', href: '/releases' }
  ];
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const activeIndex = navItems.findIndex(item => item.href === currentPath);
  const handleNavClick = (href: string) => {
    if (href !== currentPath) {
      router.push(href);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">
      {/* Vignette effect overlay - constrained to viewport */}
      <div className="absolute top-0 left-0 w-full h-screen bg-vignette z-[1] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 h-full flex flex-col">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-shadow-lg mb-2 sm:mb-4 text-center sm:text-left">
            OKISO Upcoming Releases
          </h1>
          <p className="text-base sm:text-xl text-shadow-md text-gray-200 mb-4 sm:mb-6 text-center sm:text-left">
            Get a preview of what is coming next from OKISO. Check back later for updates.
          </p>
        </header>
        <ContentCard>
          <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-2 text-center flex-grow">
            <div className="mb-6">
              <svg className="w-12 h-12 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl sm:text-3xl font-bold text-shadow-lg mb-3 text-gray-300">
                Nothing Yet
              </h2>
              <p className="text-sm sm:text-xl text-shadow-md text-gray-400 mb-4">
                No upcoming releases at the moment.
              </p>
              <p className="text-xs sm:text-base text-gray-500 text-shadow-sm max-w-md mx-auto">
                Stay tuned for future announcements and new music from OKISO. Check back soon!
              </p>
            </div>
          </div>
        </ContentCard>
        {/* Back to Home button with smooth navigation, bottom left, all devices */}
        <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-20">
          <button
            onClick={() => router.push("/")}
            className="text-gray-300 hover:text-white transition-colors bg-black/40 backdrop-blur-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-flex items-center text-xs sm:text-sm min-h-[36px] sm:min-h-[44px] text-shadow-sm border border-white/10 shadow-lg touch-manipulation"
            aria-label="Back to home page"
          >
            ← Back to home
          </button>
        </div>
      </div>
      {/* GooeyNav at top for desktop, at bottom for mobile */}
      <div className={isMobile ? "fixed bottom-0 left-0 w-full z-50" : "fixed top-0 left-0 w-full z-50 flex justify-center"} style={!isMobile ? { marginTop: '18px' } : {}}>
        <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto', margin: '0 auto', fontFamily: 'Geist, sans-serif', zIndex: 50 }}>
          <GooeyNav
            items={navItems.map(item => ({ ...item, onClick: () => handleNavClick(item.href) }))}
            initialActiveIndex={activeIndex >= 0 ? activeIndex : 1}
            animationTime={600}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      </div>
    </div>
  );
}