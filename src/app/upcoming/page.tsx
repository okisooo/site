"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContentCard from '@/Components/ContentCard';

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
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden text-white p-3 sm:p-6"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Vignette effect overlay */}
      <div className="absolute inset-0 bg-vignette z-[1] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">        <header className="mb-4 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-shadow-lg mb-2 sm:mb-4 text-center sm:text-left">
          OKISO Upcoming Releases
        </h1>
        <p className="text-lg sm:text-xl text-shadow-md text-gray-200 mb-4 sm:mb-6 text-center sm:text-left">
          Get a preview of what is coming next from OKISO. Check back later for updates.
        </p>
      </header>

        <ContentCard>
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold text-shadow-lg mb-3 text-gray-300">
                Nothing Yet
              </h2>
              <p className="text-lg sm:text-xl text-shadow-md text-gray-400 mb-4">
                No upcoming releases at the moment.
              </p>
              <p className="text-gray-500 text-shadow-sm max-w-md mx-auto">
                Stay tuned for future announcements and new music from OKISO. Check back soon!
              </p>
            </div>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}