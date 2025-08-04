"use client";

import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import ContentCard from '@/Components/ContentCard';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';
import { staticReleases, type Release } from '@/data/releases';

export default function ReleasesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showAllReleases, setShowAllReleases] = useState(false);

  // Use static data (always available, fast loading)
  const releases = staticReleases;
  const featuredReleases = releases.slice(0, 3);
  const initialDisplayCount = isMobile ? 12 : 16; // Show more on desktop
  const catalogReleases = showAllReleases ? releases : releases.slice(0, initialDisplayCount);
  const latestRelease = releases[0] || null;
  const hasMoreReleases = releases.length > initialDisplayCount;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.add('releases-page');

    if (isMobile) {
      // Allow scrolling on mobile to see all releases
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      document.body.style.top = 'auto';
      document.body.style.left = 'auto';
      document.body.style.right = 'auto';
      document.body.style.bottom = 'auto';
    } else {
      // Ensure desktop can scroll
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }

    return () => {
      document.body.classList.remove('releases-page');
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
  }, [isMobile]);

  // Navigation items for GooeyNav
  const navItems = useMemo(() => [
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Home', href: '/' },
    { label: 'Releases', href: '/releases' }
  ], []);

  // Set to 2 since this is the releases page (third item in navItems array)
  const initialActiveIndex = 2;

  return (
    <>
      <style>{`
        html, body {
          height: auto !important;
          overflow-y: auto !important;
        }
      `}</style>
      <div className={`w-full relative text-white ${isMobile ? 'min-h-screen bg-vignette' : 'min-h-screen'}`} style={!isMobile ? { paddingTop: '70px', padding: '70px 24px 24px 24px' } : { padding: '16px 12px 80px 12px' }}>
        <div className={`mx-auto relative z-10 flex flex-col ${isMobile ? 'max-w-4xl' : 'max-w-6xl pb-20'}`}>
          <header className={`text-center ${isMobile ? 'mb-2' : 'mb-6'}`}>
            <h1 className={`font-bold text-shadow-lg ${isMobile ? 'text-xl mb-1' : 'text-5xl mb-4'}`}>
              OKISO Music Releases
            </h1>
            <p className={`text-shadow-md text-gray-200 mx-auto ${isMobile ? 'text-xs mb-2 max-w-2xl' : 'text-xl mb-6 max-w-4xl'}`}>
              Explore OKISO&apos;s music catalog. Listen to the latest releases.
            </p>
          </header>
          <ContentCard title="Latest Release" className={`${isMobile ? 'mb-2' : 'mb-6'}`}>
            {latestRelease ? (
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-6'}`}>
                <div className={`${isMobile ? 'w-full max-w-[140px] mx-auto' : 'w-full max-w-[220px]'}`}>
                  <a
                    href={latestRelease.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-square transition-transform hover:scale-[1.02]"
                  >
                    <Image
                      src={latestRelease.img}
                      alt={`${latestRelease.title} album artwork`}
                      className="rounded-md shadow"
                      fill
                      sizes={isMobile ? "140px" : "220px"}
                      priority
                    />
                  </a>
                </div>
                <div className={`w-full flex flex-col justify-center ${isMobile ? 'items-center' : 'items-start'}`}>
                  <h3 className={`font-semibold text-shadow-md ${isMobile ? 'text-base mb-1 text-center' : 'text-2xl mb-2 text-left'}`}>
                    {latestRelease.title}
                  </h3>
                  <p className={`text-gray-200 text-shadow-sm ${isMobile ? 'text-xs mb-1 text-center' : 'text-base mb-3 text-left'}`}>
                    Released {latestRelease.year}.
                  </p>
                  <div className={`flex flex-wrap gap-2 ${isMobile ? 'mt-1 justify-center' : 'mt-2 justify-start'}`}>
                    <a
                      href={latestRelease.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 bg-[#1DB954] hover:bg-[#1ed760] rounded-full text-black font-medium transition-colors ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}
                    >
                      Listen on Spotify
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No releases found</p>
              </div>
            )}
          </ContentCard>
          <ContentCard title="Featured Releases" className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
            <div className={`flex flex-nowrap overflow-x-auto pb-2 scrollbar-hide ${isMobile ? 'gap-2 -mx-1 px-1' : 'gap-4 -mx-2 px-2'}`}>
              {featuredReleases.map((release: Release) => (
                <div key={release.title} className={`bg-white/5 p-1 rounded-lg border border-white/10 flex-shrink-0 ${isMobile ? 'w-[110px]' : 'w-[160px]'}`}>
                  <a
                    href={release.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-square transition-transform hover:scale-[1.02]"
                  >
                    <Image
                      src={release.img}
                      alt={release.title + ' album artwork'}
                      className="rounded-md shadow"
                      fill
                      sizes={isMobile ? "110px" : "160px"}
                    />
                  </a>
                  <div className="mt-1 px-1">
                    <p className={`font-medium truncate text-shadow-sm ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {release.title}
                    </p>
                    <p className={`text-gray-300 text-shadow-sm ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {release.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
          <ContentCard title="Full Catalog" className={`${isMobile ? 'flex-1 min-h-0' : ''}`}>
            <div className={`${isMobile ? 'h-full flex flex-col' : ''}`}>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-3 flex-1 overflow-y-auto pb-4' : 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'}`}>
                {catalogReleases.map((release: Release) => (
                  <div key={release.title} className={`bg-white/5 p-1 rounded-lg border border-white/10 ${isMobile ? 'flex-shrink-0' : ''}`}>
                    <a
                      href={release.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-square transition-transform hover:scale-[1.02]"
                    >
                      <Image
                        src={release.img}
                        alt={release.title + ' album artwork'}
                        className="rounded-md shadow"
                        fill
                        sizes={isMobile ? "100px" : "150px"}
                      />
                    </a>
                    <div className="mt-1 px-1">
                      <p className={`font-medium truncate text-shadow-sm ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {release.title}
                      </p>
                      <p className={`text-gray-300 text-shadow-sm ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {release.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Show More Button */}
              {hasMoreReleases && !showAllReleases && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowAllReleases(true)}
                    className={`bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors backdrop-blur-sm border border-white/20 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'}`}
                  >
                    Show More ({releases.length - initialDisplayCount} more releases)
                  </button>
                </div>
              )}
              {/* Show Less Button */}
              {showAllReleases && hasMoreReleases && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowAllReleases(false)}
                    className={`bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors backdrop-blur-sm border border-white/20 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'}`}
                  >
                    Show Less
                  </button>
                </div>
              )}
            </div>
          </ContentCard>
        </div>
        {/* GooeyNav at top for desktop, at bottom for mobile */}
        <div className={isMobile ? "fixed bottom-4 left-0 w-full z-50 flex justify-center" : "fixed top-0 left-0 w-full z-50 flex justify-center"} style={!isMobile ? { marginTop: '18px' } : {}}>
          <div style={{ position: 'relative', width: isMobile ? 'auto' : 'auto', margin: '0 auto', fontFamily: 'Geist, sans-serif', zIndex: 50 }}>
            {/* Simple glass backdrop behind GooeyNav */}
            <div
              className="absolute inset-0 z-[-1]"
              style={{
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
              }}
            />
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
      </div>
    </>
  );
}