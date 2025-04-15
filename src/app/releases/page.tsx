"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ContentCard from '@/Components/ContentCard';
import Iridescence from '@/Backgrounds/Iridescence/Iridescence';

export default function ReleasesPage() {
  const [isMobile, setIsMobile] = useState(false);
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      updateArrowVisibility(); // Update arrows on resize
    };
    
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
  };

  return (
    <div className="min-h-screen w-full relative overflow-auto text-white p-2 sm:p-3">
      {/* Background with adjusted properties for better contrast */}
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden z-[-1]">
        <Iridescence
          color={[0.8, 0.8, 0.8]} 
          speed={0.7} 
          amplitude={0.08} 
        />
      </div>
      
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
          
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
                href="https://open.spotify.com/album/4raTOoWiHkOwYH7CQFzAcC?si=0N7A2cOpRAe22hTkEVanCg" 
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square transition-transform hover:scale-[1.02]"
              >
                <Image 
                  src="https://i.scdn.co/image/ab67616d00001e02f5f30c6f3950a9e12c96287e"
                  alt="ETUDE album artwork"
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
              <h3 className="text-lg md:text-xl font-semibold mb-1 text-shadow-md">ETUDE</h3>
              <p className="text-gray-200 mb-2 text-shadow-sm text-sm">
                Her voice is ETUDE
              </p>
              
              {/* Spotify Embed - Updated with the latest album */}
              <iframe 
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/album/4raTOoWiHkOwYH7CQFzAcC?utm_source=generator"
                width="100%" 
                height={isMobile ? "120" : "100"} 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="mt-1"
              ></iframe>
            </div>
          </div>
        </ContentCard>
        
        <ContentCard title="Featured Releases" className="mb-3">
          <div className="relative">
            {/* Update arrow visibility conditions */}
            {showLeftArrow && (
              <button 
                onClick={scrollReleasesLeft} 
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 shadow-lg w-8 h-8 flex items-center justify-center transition-colors"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
            )}
            {showRightArrow && (
              <button 
                onClick={scrollReleasesRight} 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 shadow-lg w-8 h-8 flex items-center justify-center transition-colors"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            )}
            
            {/* Add onScroll handler to the container */}
            <div 
              className="flex flex-nowrap overflow-x-auto pb-4 scrollbar-hide gap-3" 
              ref={releasesContainerRef}
              onScroll={updateArrowVisibility}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Release Item - FANTASIA */}
              <div className="backdrop-blur-card bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10 flex-shrink-0 w-[180px] sm:w-[220px]">
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
          </div>
        </ContentCard>
        
        {/* Back to Home button with improved positioning */}
        <div className="fixed bottom-4 left-4 z-20">
          <Link 
            href="/" 
            className="text-gray-300 hover:text-white transition-colors bg-black/40 backdrop-blur-card px-3 py-1.5 rounded-full inline-flex items-center text-sm min-h-[36px] text-shadow-sm border border-white/10 shadow-lg"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}