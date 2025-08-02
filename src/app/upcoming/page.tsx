"use client";

import { useState, useEffect, useMemo } from "react";
import ContentCard from '@/Components/ContentCard';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';

export default function UpcomingPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.body.classList.add('upcoming-page');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.position = 'static';
    document.body.style.width = 'auto';
    document.body.style.top = 'auto';
    document.body.style.left = 'auto';
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

  const navItems = useMemo(() => [
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Home', href: '/' },
    { label: 'Releases', href: '/releases' }
  ], []);

  // Set to 0 since this is the upcoming page (first item in navItems array)
  const initialActiveIndex = 0;

  return (
    <div className="min-h-screen w-full relative text-white" style={!isMobile ? { paddingTop: '70px', padding: '70px 24px 24px 24px' } : { padding: '16px 12px 80px 12px' }}>
      {/* Vignette effect overlay - constrained to viewport */}
      <div className="fixed top-0 left-0 w-full h-screen bg-vignette z-[1] pointer-events-none"></div>

      <div className={`mx-auto relative z-10 flex flex-col ${isMobile ? 'max-w-4xl' : 'max-w-6xl pb-20'}`}>
        <header className={`${isMobile ? 'mb-4' : 'mb-8'}`}>
          <h1 className={`font-bold text-shadow-lg text-center ${isMobile ? 'text-2xl mb-2' : 'text-5xl mb-4'}`}>
            OKISO Upcoming Releases
          </h1>
          <p className={`text-shadow-md text-gray-200 text-center mx-auto ${isMobile ? 'text-base mb-4 max-w-2xl' : 'text-xl mb-6 max-w-4xl'}`}>
            Get a preview of what is coming next from OKISO. Check back later for updates.
          </p>
        </header>
        <ContentCard className="flex-grow">
          <div className={`flex flex-col items-center justify-center text-center h-full ${isMobile ? 'py-8 px-2' : 'py-16 px-4'}`}>
            <div className="mb-6">
              <svg className={`text-gray-400 mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-20 h-20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className={`font-bold text-shadow-lg mb-3 text-gray-300 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Nothing Yet
              </h2>
              <p className={`text-shadow-md text-gray-400 mb-4 ${isMobile ? 'text-sm' : 'text-xl'}`}>
                No upcoming releases at the moment.
              </p>
              <p className={`text-gray-500 text-shadow-sm max-w-md mx-auto ${isMobile ? 'text-xs' : 'text-base'}`}>
                Stay tuned for future announcements and new music from OKISO. Check back soon!
              </p>
            </div>
          </div>
        </ContentCard>
      </div>
      {/* GooeyNav - positioned differently for mobile vs desktop */}
      <div className={isMobile ? "fixed bottom-4 left-0 w-full z-50 flex justify-center" : "fixed top-0 left-0 w-full z-50 flex justify-center"} style={!isMobile ? { paddingTop: '18px' } : {}}>
        <div style={{ position: 'relative', width: isMobile ? 'auto' : 'auto', margin: '0 auto', fontFamily: 'Geist, sans-serif', zIndex: 50 }}>
          {/* Glass Surface behind GooeyNav */}
          <div className="absolute inset-0 z-[-1]" style={{
            width: isMobile ? '350px' : '400px',
            height: '60px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px) saturate(1.2) brightness(1.1)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.2) brightness(1.1)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
          }} />
          <GooeyNav items={navItems} initialActiveIndex={initialActiveIndex} />
        </div>
      </div>
    </div>
  );
}