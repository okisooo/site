"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import ContentCard from '@/Components/ContentCard';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';

interface Release {
  title: string;
  year: string;
  img: string;
  link: string;
  releaseDate: string;
  albumType: string;
}

// Static fallback data (will be displayed immediately)
const staticReleases: Release[] = [
  {
    title: 'Ochame Kinou (GUMI COVER)',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273335a9f91d4294cb9a3de7af6',
    link: 'https://open.spotify.com/album/1iQHinMs6TsTGr0QYq2TGD',
    releaseDate: '2025-07-18',
    albumType: 'single'
  },
  {
    title: 'MIKU MIKU HATSUNE',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b2735aebb8c70854419cedef0ed7',
    link: 'https://open.spotify.com/album/5g9YnaSj8JgyxgnfgG3Yz5',
    releaseDate: '2025-06-01',
    albumType: 'single'
  },
  {
    title: 'RESURRECTION',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273778a4f44c3e5b63f663f87da',
    link: 'https://open.spotify.com/album/15AGWT0YohTDzF5gPCzgw3',
    releaseDate: '2025-05-25',
    albumType: 'album'
  },
  {
    title: 'My Dearest',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273478a688a5711326af2e76340',
    link: 'https://open.spotify.com/album/3gZf6iZobBpU0qk0Ynf9sR',
    releaseDate: '2025-05-01',
    albumType: 'single'
  },
  {
    title: 'FANTASIA & ETUDE',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273f9828b8b052d94e53344ee27',
    link: 'https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q',
    releaseDate: '2025-04-25',
    albumType: 'album'
  },
  {
    title: 'voidroid',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273236c5e927ae8bac15ed1eaa9',
    link: 'https://open.spotify.com/album/4NEgkpLoPck8FGujMpa4na',
    releaseDate: '2025-04-15',
    albumType: 'single'
  },
  {
    title: 'ETUDE',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273d801af2d510e722d0444a16f',
    link: 'https://open.spotify.com/album/4raTOoWiHkOwYH7CQFzAcC',
    releaseDate: '2025-04-07',
    albumType: 'album'
  },
  {
    title: 'HELLO, WORLD.',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273b1a3e2b49011da734655b332',
    link: 'https://open.spotify.com/album/3WBZF8QXXRebLD0cud4KTQ',
    releaseDate: '2025-03-25',
    albumType: 'single'
  },
  {
    title: 'Meet The Princess',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b27359b538de2a62ef053fa5b1d9',
    link: 'https://open.spotify.com/album/3tQfs4MH0zc8bVk9Inv2hT',
    releaseDate: '2025-03-18',
    albumType: 'single'
  },
  {
    title: 'SHUT OFF',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273dc00169cce2210cf91300f23',
    link: 'https://open.spotify.com/album/6JZQro8zNEHUfEFZuVFMrC',
    releaseDate: '2025-03-15',
    albumType: 'single'
  },
  {
    title: 'FANTASIA',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b2734bcdda5555ac77a5b56c91b2',
    link: 'https://open.spotify.com/album/0t28Vt3fN6awEEFcTR3AlN',
    releaseDate: '2025-03-10',
    albumType: 'album'
  },
  {
    title: 'ANOTHER LIFE (Remix)',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b2735b92ae95eadfbefaf385ea77',
    link: 'https://open.spotify.com/album/7uIGVdqJrhTWRyVJfB8bo6',
    releaseDate: '2025-03-03',
    albumType: 'single'
  },
  {
    title: 'PRECIOUS YOU',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b2731156adf59d5b284d12c56528',
    link: 'https://open.spotify.com/album/74Gn18pzYvHn1ZWIjEs1mI',
    releaseDate: '2025-02-25',
    albumType: 'single'
  },
  {
    title: 'TEARS IN HEAVEN \'99',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b2731f8adc60c1973e5802981328',
    link: 'https://open.spotify.com/album/0jLZeVoHNqheN7rYfCIO9A',
    releaseDate: '2025-02-17',
    albumType: 'single'
  },
  {
    title: 'MANGO BOBA',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273e152bb5d2bac32afccf48a15',
    link: 'https://open.spotify.com/album/6vU5gaWqNZKNl3V9pkjsEI',
    releaseDate: '2025-02-13',
    albumType: 'single'
  },
  {
    title: 'FEAR',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b2739f8274c0b455534d9cec18e8',
    link: 'https://open.spotify.com/album/20BzwSTaHHb6CDKhGzWHiQ',
    releaseDate: '2025-02-13',
    albumType: 'single'
  },
  {
    title: 'DESTINY',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b27349289071e915ad4461fcc64f',
    link: 'https://open.spotify.com/album/2pttuX0SUW3BC8JHjVn2S0',
    releaseDate: '2025-02-07',
    albumType: 'single'
  },
  {
    title: 'REVOLUTION',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b27311579e9278b6f267402f2fbb',
    link: 'https://open.spotify.com/album/1nQYgQ3t6OvbI61a72h9bX',
    releaseDate: '2025-01-25',
    albumType: 'album'
  },
  {
    title: 'IN YOUR PRESENCE',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273995e8c74b3d6fba40e778fea',
    link: 'https://open.spotify.com/album/72PR4fh7pB0VDoUenr26uK',
    releaseDate: '2025-01-24',
    albumType: 'single'
  },
  {
    title: 'MACHINE GUN',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273088ad60eaf2a9a2ade1a0d0e',
    link: 'https://open.spotify.com/album/74fSXSvQZlYItgFeWBOWIE',
    releaseDate: '2025-01-17',
    albumType: 'single'
  },
  {
    title: 'REVENGE',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273e0933b795ce1b3b560d9030f',
    link: 'https://open.spotify.com/album/3dhdyjSH3EG8YMFaHdmBw0',
    releaseDate: '2025-01-07',
    albumType: 'single'
  },
  {
    title: 'FLY',
    year: '2025',
    img: 'https://i.scdn.co/image/ab67616d0000b273b7f60acc50ae9a73f7c9866d',
    link: 'https://open.spotify.com/album/3sMC9TVo5SHEpGV0WuyYJm',
    releaseDate: '2025-01-03',
    albumType: 'single'
  },
  {
    title: 'THUNDER',
    year: '2024',
    img: 'https://i.scdn.co/image/ab67616d0000b2739a062382d005e2c2ab7c8eca',
    link: 'https://open.spotify.com/album/5Debz7V0TMizIqlRCnQtad',
    releaseDate: '2024-12-26',
    albumType: 'single'
  },
  {
    title: 'PRIDE',
    year: '2024',
    img: 'https://i.scdn.co/image/ab67616d0000b2730f1ea24dde1d5e0309e89320',
    link: 'https://open.spotify.com/album/1K4cNRy6VPwaVV6VgE6Cbx',
    releaseDate: '2024-12-15',
    albumType: 'single'
  },
  {
    title: 'Watashi Wa Dare',
    year: '2024',
    img: 'https://i.scdn.co/image/ab67616d0000b273a4211bf75310a57151b03a11',
    link: 'https://open.spotify.com/album/4ZnFA6BezUO6Sd3EBRrten',
    releaseDate: '2024-03-26',
    albumType: 'single'
  },
  {
    title: 'Star Trail',
    year: '2024',
    img: 'https://i.scdn.co/image/ab67616d0000b27348e563a92f362bad3e12b062',
    link: 'https://open.spotify.com/album/13zLY9ytK7dqXJTPH3bvSv',
    releaseDate: '2024-03-18',
    albumType: 'single'
  }
];

export default function ReleasesPage() {
  const router = useRouter();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialActiveIndex, setInitialActiveIndex] = useState(2);
  const [showAllReleases, setShowAllReleases] = useState(false);
  const releasesContainerRef = useRef<HTMLDivElement>(null);

  // Use static data (always available, fast loading)
  const releases = staticReleases;
  const featuredReleases = releases.slice(0, 3);
  const initialDisplayCount = isMobile ? 12 : 16; // Show more on desktop
  const catalogReleases = showAllReleases ? releases : releases.slice(0, initialDisplayCount);
  const latestRelease = releases[0] || null;
  const hasMoreReleases = releases.length > initialDisplayCount;

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
              {featuredReleases.map((release: Release, idx: number) => (
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
                {catalogReleases.map((release: Release, idx: number) => (
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
              items={navItems.map(item => ({ ...item, onClick: () => handleNavClick(item.href) }))}
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