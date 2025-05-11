"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ContentCard from '@/Components/ContentCard';

export default function ReleasesPage() {
  // Replace showScrollButtons with separate left and right arrow visibility
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const releasesContainerRef = useRef<HTMLDivElement>(null);

  // Function to check scroll position and update arrow visibility
  const updateArrowVisibility = () => {
    if (!releasesContainerRef.current) return;

    const container = releasesContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    // First check if scrolling is even possible
    if (scrollWidth <= clientWidth) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    // Calculate if we're at the left or right edge
    // Add small buffer (1px) to account for rounding errors
    const atLeftEdge = scrollLeft <= 1;
    const atRightEdge = Math.abs(scrollWidth - clientWidth - scrollLeft) <= 1;

    // Update arrow visibility
    setShowLeftArrow(!atLeftEdge);
    setShowRightArrow(!atRightEdge);
  };

  useEffect(() => {
    const handleResize = () => updateArrowVisibility();

    // Run initial check after component mounts
    const initialCheck = () => updateArrowVisibility();

    // Check multiple times to ensure accurate measurement after layout/images load
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
      // Reduce speed by using smaller scroll amount and longer duration
      releasesContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      // Update arrows after animation completes
      setTimeout(updateArrowVisibility, 800);
    }
  };

  const scrollReleasesRight = () => {
    if (releasesContainerRef.current) {
      // Reduce speed by using smaller scroll amount and longer duration
      releasesContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      // Update arrows after animation completes
      setTimeout(updateArrowVisibility, 800);
    }
  }; return (<div className="min-h-screen w-full relative overflow-hidden text-white p-2 sm:p-3">
    {/* Vignette effect overlay */}
    <div className="absolute inset-0 bg-vignette z-[1] pointer-events-none"></div>

    <div className="max-w-4xl mx-auto relative z-10 mb-20">
      <header className="mb-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-shadow-lg mb-1 sm:mb-2">
          OKISO Music Releases
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-shadow-md text-gray-200 mb-4 max-w-2xl mx-auto">
          Explore OKISO&apos;s music catalog. Listen to the latest releases.
        </p>
      </header>

      <ContentCard title="Latest Release" className="mb-3">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="w-full md:w-1/3 max-w-[250px] mx-auto">
            <a
              href="https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative aspect-square transition-transform hover:scale-[1.02]"
            >
              <Image
                src="https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b2/c7/35/b2c73583-ee06-57f8-0b9b-c08423293429/artwork.jpg/600x600bf-60.jpg"
                alt="FANTASIA & ETUDE album artwork"
                className="rounded-md shadow-lg"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
            </a>
          </div>
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h3 className="text-lg md:text-xl font-semibold mb-1 text-shadow-md">FANTASIA & ETUDE</h3>
            <p className="text-gray-200 mb-2 text-shadow-sm text-sm">
              A collaboration with Miku and GUMI. Released April 25, 2025.
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="https://open.spotify.com/album/2lmc5y1ZnzgSyKzyZOux6q"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] rounded-full text-black text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
              </a>
              <a
                href="https://music.apple.com/us/album/fantasia-etude/1808732861"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-colors backdrop-blur-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.997 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.204.4-1.066.4-1.9 1.05-2.54 1.973a5.046 5.046 0 00-.883 2.176c-.084.418-.133.85-.153 1.28-.01.257-.01.507-.01.763v14.75c0 .255 0 .51.01.76.023.43.07.856.16 1.28.308 1.478 1.055 2.597 2.306 3.34.7.404 1.464.634 2.26.75.645.082 1.298.1 1.95.114.17.003.34.01.51.01h12.342c.157 0 .31-.006.468-.01.717-.022 1.43-.082 2.118-.27.966-.282 1.784-.77 2.463-1.496.55-.59.933-1.27 1.179-2.04.136-.457.21-.93.24-1.405.007-.133.013-.266.013-.4V6.123zm-11.414 3.934a20.95 20.95 0 011.188-.143c.027-.002.055-.01.082-.01.976-.05 1.948.022 2.907.225a7.75 7.75 0 11.079.338c.29.111.57.24.835.4.52.323.953.727 1.26 1.252.15.261.258.535.324.825.047.203.07.412.07.622 0 .203-.022.407-.063.61a2.513 2.513 0 01-.736 1.285c-.35.337-.748.6-1.18.79-.304.134-.62.237-.946.312-.16.036-.32.063-.48.086a14.67 14.67 0 01-1.115.137c-.366.033-.73.055-1.096.063-.92.02-.9.023-1.347.016-.116-.002-.232-.006-.348-.011a13.523 13.523 0 01-2.143-.233 8.176 8.176 0 01-.968-.278 4.26 4.26 0 01-1.786-1.21 2.592 2.592 0 01-.603-1.315 2.788 2.788 0 01-.036-.473c0-.187.022-.37.066-.553.13-.55.476-1.003.934-1.343.384-.282.81-.487 1.254-.642.38-.137.77-.237 1.17-.316a10.662 10.662 0 011.213-.181zm.198 7.74a9.45 9.45 0 00-.654-.073c-.225-.015-.452-.015-.681-.015-.57-.002-1.14.024-1.706.09-.325.038-.648.094-.968.165-.16.038-.32.08-.476.127a4.37 4.37 0 00-1.715.903c-.365.318-.63.708-.75 1.16-.06.213-.09.433-.09.653 0 .137.01.27.034.4a2.383 2.383 0 00.847 1.42c.318.265.678.466 1.063.603.474.168.967.276 1.467.335.247.03.494.047.741.055.072.002.145.007.217.007.62 0 1.21-.062 1.79-.174a6.283 6.283 0 001.392-.484c.45-.228.838-.517 1.132-.894.138-.175.248-.365.32-.57.054-.145.08-.296.08-.452 0-.152-.024-.3-.08-.45a1.64 1.64 0 00-.336-.65 2.378 2.378 0 00-.665-.518 4.3 4.3 0 00-.903-.34 9.33 9.33 0 00-1.059-.223zM16.6 6.9c-.23-.062-.463-.11-.7-.146a10.153 10.153 0 00-1.135-.1 16.012 16.012 0 00-2.47.166 8.202 8.202 0 00-.776.166 7.8 7.8 0 00-.58.187c-.33.135-.64.294-.918.48-.13.088-.248.187-.35.295-.145.14-.24.313-.276.5a.578.578 0 00-.016.128c0 .073.008.144.03.213.05.147.142.274.266.377.126.112.275.188.44.238.1.03.2.05.304.055.066.002.133-.008.197-.022.148-.034.295-.083.435-.15.273-.124.52-.277.755-.452.317-.234.61-.5.877-.79.3-.327.57-.673.792-1.047.013-.019.024-.04.035-.06z" />
                </svg>
                Apple Music
              </a>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard title="Featured Releases" className="mb-3">
        <div className="relative">
          {/* Update arrow visibility conditions and add vignette effect */}
          {showLeftArrow && (
            <>
              {/* Left side vignette gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/40 to-transparent z-[5] pointer-events-none rounded-l-lg"></div>              <button
                onClick={scrollReleasesLeft}
                className="absolute left-1 top-[calc(50%-22px)] transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 shadow-lg w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center transition-colors backdrop-blur-sm touch-manipulation"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
            </>
          )}
          {showRightArrow && (
            <>
              {/* Right side vignette gradient */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/40 to-transparent z-[5] pointer-events-none rounded-r-lg"></div>
              <button
                onClick={scrollReleasesRight}
                className="absolute right-1 top-[calc(50%-22px)] transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 shadow-lg w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center transition-colors backdrop-blur-sm touch-manipulation"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </>
          )}

          {/* Add onScroll handler to the container */}          <div
            className="flex flex-nowrap overflow-x-auto pb-4 scrollbar-hide gap-2 sm:gap-3 -mx-2 px-2"
            ref={releasesContainerRef}
            onScroll={updateArrowVisibility}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Release Item - FANTASIA */}
            <div className="backdrop-blur-card bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10 flex-shrink-0 w-[160px] sm:w-[180px] md:w-[220px]">
              <a
                href="https://open.spotify.com/album/0t28Vt3fN6awEEFcTR3AlN"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square transition-transform hover:scale-[1.02]"
              >
                <Image
                  src="https://i.scdn.co/image/ab67616d0000b273bcecbdb53ef1b1311a9923a8"
                  alt="FANTASIA album artwork"
                  className="rounded-md shadow-lg"
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
              <h4 className="font-semibold text-shadow-sm mt-1 text-sm">FANTASIA</h4>
              <p className="text-xs text-gray-300 text-shadow-sm mb-1">2025</p>
              <a
                href="https://open.spotify.com/album/0t28Vt3fN6awEEFcTR3AlN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
            </div>

            {/* Meet The Princess */}
            <div className="backdrop-blur-card bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10 flex-shrink-0 w-[180px] sm:w-[220px]">
              <a
                href="https://open.spotify.com/album/6JZQro8zNEHUfEFZuVFMrC?si=RUsbEW2uSX-OMO-999PFKQ"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square transition-transform hover:scale-[1.02]"
              >
                <Image
                  src="https://i.scdn.co/image/ab67616d0000b273c57d3a982f75a7b9f10a010a"
                  alt="Meet The Princess artwork"
                  className="rounded-md shadow-lg"
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
              <h4 className="font-semibold text-shadow-sm mt-1 text-sm">Meet The Princess</h4>
              <p className="text-xs text-gray-300 text-shadow-sm mb-1">2025</p>
              <a
                href="https://open.spotify.com/album/6JZQro8zNEHUfEFZuVFMrC?si=RUsbEW2uSX-OMO-999PFKQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
            </div>

            {/* SHUT OFF */}
            <div className="backdrop-blur-card bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10 flex-shrink-0 w-[180px] sm:w-[220px]">
              <a
                href="https://open.spotify.com/album/3tQfs4MH0zc8bVk9Inv2hT?si=B0unYMY5QJe55mBiR1mZCg"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square transition-transform hover:scale-[1.02]"
              >
                <Image
                  src="https://i.scdn.co/image/ab67616d0000b273dc00169cce2210cf91300f23"
                  alt="SHUT OFF artwork"
                  className="rounded-md shadow-lg"
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
              <h4 className="font-semibold text-shadow-sm mt-1 text-sm">SHUT OFF</h4>
              <p className="text-xs text-gray-300 text-shadow-sm mb-1">2025</p>
              <a
                href="https://open.spotify.com/album/3tQfs4MH0zc8bVk9Inv2hT?si=B0unYMY5QJe55mBiR1mZCg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
            </div>

            {/* TEARS IN HEAVEN '99 */}
            <div className="backdrop-blur-card bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10 flex-shrink-0 w-[180px] sm:w-[220px]">
              <a
                href="https://open.spotify.com/album/0jLZeVoHNqheN7rYfCIO9A?si=Pvch5L8DTaODoaJLM2DsVg"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square transition-transform hover:scale-[1.02]"
              >
                <Image
                  src="https://i.scdn.co/image/ab67616d0000b27354026378bb902db4497abeca"
                  alt="TEARS IN HEAVEN &apos;99 artwork"
                  className="rounded-md shadow-lg"
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
              <h4 className="font-semibold text-shadow-sm mt-1 text-sm">TEARS IN HEAVEN &apos;99</h4>
              <p className="text-xs text-gray-300 text-shadow-sm mb-1">2025</p>
              <a
                href="https://open.spotify.com/album/0jLZeVoHNqheN7rYfCIO9A?si=Pvch5L8DTaODoaJLM2DsVg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
            </div>
          </div>
        </div>      </ContentCard>

      {/* Back to Home button with improved positioning */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-20">
        <Link
          href="/"
          className="text-gray-300 hover:text-white transition-colors bg-black/40 backdrop-blur-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-flex items-center text-xs sm:text-sm min-h-[36px] sm:min-h-[44px] text-shadow-sm border border-white/10 shadow-lg touch-manipulation"
          aria-label="Back to home page"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  </div>
  );
}