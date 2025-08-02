"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import ContentCard from '@/Components/ContentCard';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';
import { useSpotifyReleases } from '@/hooks/useSpotifyReleases';

export default function ReleasesPage() {
  const router = useRouter();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialActiveIndex, setInitialActiveIndex] = useState(2);
  const releasesContainerRef = useRef<HTMLDivElement>(null);

  // Use Spotify API hook
  const {
    releases,
    loading,
    error,
    getFeaturedReleases,
    getLatestRelease,
    getCatalogReleases
  } = useSpotifyReleases();

  const updateArrowVisibility = () => {
    if (!releasesContainerRef.current) return;

    const container = releasesContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    if (scrollWidth <= clientWidth) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    const atLeftEdge = scrollLeft <= 1;
    const atRightEdge = Math.abs(scrollWidth - clientWidth - scrollLeft) <= 1;

    setShowLeftArrow(!atLeftEdge);
    setShowRightArrow(!atRightEdge);
  };

  useEffect(() => {
    const handleResize = () => {
      updateArrowVisibility();
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => updateArrowVisibility();

    const initialCheck = () => updateArrowVisibility();

    const timers = [
      setTimeout(initialCheck, 0),
      setTimeout(initialCheck, 100),
      setTimeout(initialCheck, 500),
      setTimeout(initialCheck, 1000)
    ];

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", updateArrowVisibility);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", updateArrowVisibility);
    };
  }, []);

  const scrollReleasesLeft = () => {
    if (releasesContainerRef.current) {
      releasesContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(updateArrowVisibility, 800);
    }
  };

  const scrollReleasesRight = () => {
    if (releasesContainerRef.current) {
      releasesContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(updateArrowVisibility, 800);
    }
  };

  useEffect(() => {
    document.body.classList.add('releases-page');

    if (isMobile) {
      // Only apply fixed positioning and overflow hidden on mobile
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

  // Get dynamic data from Spotify API
  const featuredReleases = getFeaturedReleases(3);
  const catalogReleases = getCatalogReleases();
  const latestRelease = getLatestRelease();

  // Navigation items for GooeyNav
  const navItems = [
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Home', href: '/' },
    { label: 'Releases', href: '/releases' }
  ];

  // Determine active index based on current path
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const activeIndex = navItems.findIndex(item => item.href === currentPath);

  useEffect(() => {
    const calculatedIndex = navItems.findIndex(item => item.href === window.location.pathname);
    setInitialActiveIndex(calculatedIndex >= 0 ? calculatedIndex : 2); // Default to 'Releases' if not found
  }, [navItems]);

  const handleNavClick = (href: string) => {
    if (typeof window !== 'undefined' && href !== window.location.pathname) {
      router.push(href);
    }
  };

  return (
    <>
      {!isMobile && (
        <style>{`
          html, body {
            height: auto !important;
            overflow-y: auto !important;
          }
        `}</style>
      )}
      <div className={`w-full relative text-white ${isMobile ? 'h-screen overflow-hidden bg-vignette' : 'min-h-screen'}`} style={!isMobile ? { paddingTop: '70px', padding: '70px 24px 24px 24px' } : { padding: '16px 12px 12px 12px' }}>
        <div className={`mx-auto relative z-10 flex flex-col ${isMobile ? 'max-w-4xl h-full' : 'max-w-6xl pb-20'}`}>
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
                {loading ? (
                  <p className="text-gray-400">Loading latest release...</p>
                ) : (
                  <p className="text-gray-400">No releases found</p>
                )}
              </div>
            )}
          </ContentCard>
          <ContentCard title="Featured Releases" className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
            <div className={`flex flex-nowrap overflow-x-auto pb-2 scrollbar-hide ${isMobile ? 'gap-2 -mx-1 px-1' : 'gap-4 -mx-2 px-2'}`}>
              {featuredReleases.map((release, idx) => (
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
                  <h4 className={`font-semibold text-shadow-sm mt-1 text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>{release.title}</h4>
                  <p className={`text-gray-300 text-shadow-sm mb-1 text-center ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{release.year}</p>
                  <a
                    href={release.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-green-400 hover:text-green-300 flex items-center gap-1 justify-center ${isMobile ? 'text-[10px]' : 'text-xs'}`}
                  >
                    Listen
                  </a>
                </div>
              ))}
            </div>
          </ContentCard>
          <ContentCard title="Catalog" className={`${isMobile ? 'flex-1 min-h-0' : 'mb-6'}`}>
            <div className={`${isMobile ? 'h-full overflow-y-auto scrollbar-hide' : ''}`}>
              <div className={`grid gap-2 pb-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-4 md:grid-cols-5 gap-3 pb-4'}`}>
                {catalogReleases.map((release, idx) => (
                  <div key={idx} className={`bg-white/5 p-1 rounded-lg border border-white/10 ${isMobile ? '' : 'p-2'}`}>
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
                    <h4 className={`font-semibold text-shadow-sm mt-1 text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>{release.title}</h4>
                    <p className={`text-gray-300 text-shadow-sm mb-1 text-center ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{release.year}</p>
                    <a
                      href={release.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-green-400 hover:text-green-300 flex items-center gap-1 justify-center ${isMobile ? 'text-[10px]' : 'text-xs'}`}
                    >
                      Listen
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </ContentCard>
        </div>
        {/* GooeyNav - positioned differently for mobile vs desktop */}
        <div className={isMobile ? "fixed bottom-0 left-0 w-full z-50" : "fixed top-0 left-0 w-full z-50 flex justify-center"} style={!isMobile ? { paddingTop: '18px' } : {}}>
          <GooeyNav items={navItems} initialActiveIndex={initialActiveIndex} />
        </div>
      </div>
    </>
  );
}