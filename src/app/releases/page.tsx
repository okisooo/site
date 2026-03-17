"use client";

import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import AnimeCard from '@/Components/BA/AnimeCard';
import PillButton from '@/Components/BA/PillButton';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';
import { staticReleases, type Release } from '@/data/releases';

export default function ReleasesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showAllReleases, setShowAllReleases] = useState(false);

  const releases = staticReleases;
  const featuredReleases = releases.slice(0, 3);
  const initialDisplayCount = isMobile ? 12 : 16;
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
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.position = 'static';
    document.body.style.width = 'auto';

    return () => {
      document.body.classList.remove('releases-page');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobile]);

  const navItems = useMemo(() => [
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Home', href: '/' },
    { label: 'Releases', href: '/releases' }
  ], []);

  const initialActiveIndex = 2;

  return (
    <>
      <style>{`
        html, body {
          height: auto !important;
          overflow-y: auto !important;
        }
      `}</style>
      <div className={`w-full relative text-ba-dark ${isMobile ? 'min-h-screen pb-24 px-3' : 'min-h-screen pt-20 px-6'}`} style={{ overscrollBehaviorY: 'contain', overscrollBehaviorX: 'none', touchAction: 'pan-y' }}>
        <div className={`mx-auto relative z-10 flex flex-col ${isMobile ? 'max-w-4xl' : 'max-w-6xl pb-20'}`}>
          <header className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <h1 className={`font-display font-black text-ba-dark ${isMobile ? 'text-2xl mb-1' : 'text-5xl mb-4'}`}>
              ✦ Music Releases
            </h1>
            <p className={`text-ba-muted mx-auto ${isMobile ? 'text-sm mb-2 max-w-2xl' : 'text-lg mb-6 max-w-4xl'}`}>
              Explore OKISO&apos;s music catalog. Listen to the latest releases ♪
            </p>
          </header>

          {/* Latest Release */}
          <AnimeCard title="Latest Release" accentColor="pink" className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
            {latestRelease ? (
              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row gap-6'}`}>
                <div className={`${isMobile ? 'w-full max-w-[160px] mx-auto' : 'w-full max-w-[220px]'}`}>
                  <a
                    href={latestRelease.slug ? `/releases/${latestRelease.slug}` : latestRelease.link}
                    className="block relative aspect-square transition-transform hover:scale-[1.03] hover:shadow-ba-card rounded-ba overflow-hidden"
                  >
                    <Image
                      src={latestRelease.img}
                      alt={`${latestRelease.title} album artwork`}
                      className="rounded-ba"
                      fill
                      sizes={isMobile ? "160px" : "220px"}
                      priority
                    />
                  </a>
                </div>
                <div className={`w-full flex flex-col justify-center ${isMobile ? 'items-center' : 'items-start'}`}>
                  <h3 className={`font-display font-bold text-ba-dark ${isMobile ? 'text-lg mb-1 text-center' : 'text-2xl mb-2 text-left'}`}>
                    {latestRelease.title}
                  </h3>
                  <p className={`text-ba-muted ${isMobile ? 'text-sm mb-2 text-center' : 'text-base mb-4 text-left'}`}>
                    Released {latestRelease.year}
                  </p>
                  <PillButton variant="sky" size="sm" href={latestRelease.link}>
                    ♫ Listen on Spotify
                  </PillButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-ba-muted">No releases found</p>
              </div>
            )}
          </AnimeCard>

          {/* Featured Releases */}
          <AnimeCard title="Featured Releases" accentColor="yellow" className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div className={`flex flex-nowrap overflow-x-auto pb-2 scrollbar-hide ${isMobile ? 'gap-3 -mx-1 px-1' : 'gap-4 -mx-2 px-2'}`}>
              {featuredReleases.map((release: Release) => (
                <div key={release.title} className={`bg-ba-red/5 p-2 rounded-ba border border-ba-red/10 flex-shrink-0 transition-all hover:shadow-ba-soft hover:-translate-y-1 ${isMobile ? 'w-[120px]' : 'w-[170px]'}`}>
                  <a
                    href={release.slug ? `/releases/${release.slug}` : release.link}
                    className="block relative aspect-square transition-transform rounded-ba overflow-hidden"
                  >
                    <Image
                      src={release.img}
                      alt={release.title + ' album artwork'}
                      className="rounded-ba"
                      fill
                      sizes={isMobile ? "120px" : "170px"}
                    />
                  </a>
                  <div className="mt-2 px-1">
                    <p className={`font-display font-bold truncate text-ba-dark ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {release.title}
                    </p>
                    <p className={`text-ba-muted ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {release.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimeCard>

          {/* Full Catalog */}
          <AnimeCard title="Full Catalog" accentColor="lavender">
            <div>
              <div className={`grid gap-3 ${isMobile ? 'grid-cols-3' : 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'}`}>
                {catalogReleases.map((release: Release) => (
                  <div key={release.title} className="bg-ba-lavender/5 p-1.5 rounded-ba border border-ba-lavender/10 transition-all hover:shadow-ba-soft hover:-translate-y-1">
                    <a
                      href={release.slug ? `/releases/${release.slug}` : release.link}
                      className="block relative aspect-square rounded-ba overflow-hidden"
                    >
                      <Image
                        src={release.img}
                        alt={release.title + ' album artwork'}
                        className="rounded-[12px]"
                        fill
                        sizes={isMobile ? "100px" : "150px"}
                      />
                    </a>
                    <div className="mt-1.5 px-0.5">
                      <p className={`font-display font-bold truncate text-ba-dark ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {release.title}
                      </p>
                      <p className={`text-ba-muted ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                        {release.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Show More/Less */}
              {hasMoreReleases && !showAllReleases && (
                <div className="flex justify-center mt-6">
                  <PillButton variant="sky" size="sm" onClick={() => setShowAllReleases(true)}>
                    Show More ({releases.length - initialDisplayCount} more releases)
                  </PillButton>
                </div>
              )}
              {showAllReleases && hasMoreReleases && (
                <div className="flex justify-center mt-6">
                  <PillButton variant="sky" size="sm" onClick={() => setShowAllReleases(false)}>
                    Show Less
                  </PillButton>
                </div>
              )}
            </div>
          </AnimeCard>
        </div>

        {/* Navigation */}
        <div className={isMobile ? "fixed left-0 w-full z-50 flex justify-center bottom-4" : "fixed left-0 w-full z-50 flex justify-center top-4"}>
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
    </>
  );
}
