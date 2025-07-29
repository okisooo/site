"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import ContentCard from '@/Components/ContentCard';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';

export default function ReleasesPage() {
  const router = useRouter();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const releasesContainerRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // Featured releases array for mobile
  const featuredReleases = [
    {
      title: 'FANTASIA & ETUDE',
      year: '2025',
      img: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b2/c7/35/b2c73583-ee06-57f8-0b9b-c08423293429/artwork.jpg/600x600bf-60.jpg',
      link: 'https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q'
    },
    {
      title: 'FANTASIA',
      year: '2025',
      img: 'https://i.scdn.co/image/ab67616d0000b273bcecbdb53ef1b1311a9923a8',
      link: 'https://open.spotify.com/album/0t28Vt3fN6awEEFcTR3AlN'
    },
    {
      title: 'ETUDE',
      year: '2025',
      img: 'https://i.scdn.co/image/ab67616d0000b2737029fe56be8fdd1093453b71',
      link: 'https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q'
    }
  ];

  // Navigation items for GooeyNav
  const navItems = [
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Home', href: '/' },
    { label: 'Releases', href: '/releases' }
  ];
  // Determine active index based on current path (client only)
  const [activeIndex, setActiveIndex] = useState(1);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const idx = navItems.findIndex(item => item.href === currentPath);
      setActiveIndex(idx >= 0 ? idx : 1);
    }
  }, [navItems]);
  const handleNavClick = (href: string) => {
    if (typeof window !== 'undefined' && href !== window.location.pathname) {
      router.push(href);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden text-white p-1 sm:p-3" style={!isMobile ? { paddingTop: '70px' } : {}}>
      <div className="absolute top-0 left-0 w-full h-screen bg-vignette z-[1] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto relative z-10 h-full flex flex-col">
        <header className="mb-2 text-center">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-shadow-lg mb-1 sm:mb-2">
            OKISO Music Releases
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-shadow-md text-gray-200 mb-2 sm:mb-4 max-w-2xl mx-auto">
            Explore OKISO&apos;s music catalog. Listen to the latest releases.
          </p>
        </header>
        <ContentCard title="Latest Release" className="mb-2 flex-grow">
          <div className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} gap-2 md:gap-4`}>
            <div className="w-full max-w-[140px] mx-auto">
              <a
                href="https://open.spotify.com/album/0MAU5F8CQeuBQ4bC9N3SDi"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square transition-transform hover:scale-[1.02]"
              >
                <Image
                  src="https://i.scdn.co/image/ab67616d00001e029899e44696d9069ad2953a4d"
                  alt="RESURRECTION album artwork"
                  className="rounded-md shadow"
                  fill
                  sizes="(max-width: 640px) 140px, 33vw"
                  priority
                />
              </a>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-shadow-md text-center">RESURRECTION</h3>
              <p className="text-gray-200 mb-1 text-xs sm:text-sm text-shadow-sm text-center">
                The next evolution of OKISO&apos;s sound.<br />Released May 25, 2025.
              </p>
              <div className="mt-1 flex flex-wrap gap-2 justify-center">
                <a
                  href="https://open.spotify.com/album/0MAU5F8CQeuBQ4bC9N3SDi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2 py-1 bg-[#1DB954] hover:bg-[#1ed760] rounded-full text-black text-xs font-medium transition-colors"
                >
                  Spotify
                </a>
                <a
                  href="https://music.apple.com/us/album/resurrection/1808732861"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs font-medium transition-colors backdrop-blur-sm"
                >
                  Apple Music
                </a>
              </div>
            </div>
          </div>
        </ContentCard>
        <ContentCard title="Featured Releases" className="mb-2">
          <div className="flex flex-nowrap overflow-x-auto pb-2 scrollbar-hide gap-2 -mx-1 px-1">
            {featuredReleases.map((release, idx) => (
              <div key={release.title} className="bg-white/5 p-1 rounded-lg border border-white/10 flex-shrink-0 w-[110px]">
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
                    sizes="(max-width: 640px) 110px, 180px"
                  />
                </a>
                <h4 className="font-semibold text-shadow-sm mt-1 text-xs text-center">{release.title}</h4>
                <p className="text-[10px] text-gray-300 text-shadow-sm mb-1 text-center">{release.year}</p>
                <a
                  href={release.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 text-[10px] flex items-center gap-1 justify-center"
                >
                  Listen
                </a>
              </div>
            ))}
          </div>
        </ContentCard>
        {/* GooeyNav at top for desktop, at bottom for mobile */}
        <div className={isMobile ? "fixed bottom-0 left-0 w-full z-50" : "fixed top-0 left-0 w-full z-50 flex justify-center"} style={!isMobile ? { marginTop: '18px' } : {}}>
          <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto', margin: '0 auto', fontFamily: 'Geist, sans-serif', zIndex: 50 }}>
            <GooeyNav
              items={navItems.map(item => ({ ...item, onClick: () => handleNavClick(item.href) }))}
              initialActiveIndex={activeIndex}
              animationTime={600}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        </div>
        {/* Back to Home button with smooth navigation, bottom left, all devices */}
        {!isMobile && (
          <div className="fixed bottom-2 left-2 z-20">
            <button
              onClick={() => router.push("/")}
              className="text-gray-300 hover:text-white transition-colors bg-black/40 backdrop-blur-card px-2 py-1 rounded-full inline-flex items-center text-xs min-h-[28px] text-shadow-sm border border-white/10 shadow touch-manipulation"
              aria-label="Back to home page"
            >
              ← Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}