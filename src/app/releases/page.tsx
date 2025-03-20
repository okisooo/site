// src/app/releases/page.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ReleasesPage() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
<div className="min-h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">
<div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 pt-4 sm:pt-8 [text-shadow:rgb(0,0,0)_1px_0_10px] [-webkit-text-stroke:0.5px_rgba(0,0,0,0.3)]">
          OKISO Music Releases
        </h1>
        
        <p className="mb-6 sm:mb-8 text-gray-300 text-sm sm:text-base [text-shadow:rgb(0,0,0)_0_0_4px]">
          Explore all of OKISOs music releases, including the latest singles, albums, and collaborations.
          Listen directly on this page or visit Spotify for the full experience.
        </p>
        
        {/* Spotify Artist Embed - Responsive height */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 [text-shadow:rgb(0,0,0)_1px_0_5px] [-webkit-text-stroke:0.25px_rgba(0,0,0,0.2)]">
            Artist Discography
          </h2>
          <div className={`w-full ${isMobile ? 'h-[500px]' : 'h-[352px]'}`}>
            <iframe 
              src="https://open.spotify.com/embed/artist/2FSh9530hmphpeK3QmDSPm?utm_source=generator" 
              width="100%" 
              height="100%" 
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
        
        {/* Featured release with responsive height */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 [text-shadow:rgb(0,0,0)_1px_0_5px] [-webkit-text-stroke:0.25px_rgba(0,0,0,0.2)]">
            Featured Release
          </h2>
          <div className={`w-full ${isMobile ? 'h-[180px]' : 'h-[152px]'}`}>
            <iframe 
              src="https://open.spotify.com/embed/album/3tQfs4MH0zc8bVk9Inv2hT?utm_source=generator" 
              width="100%" 
              height="100%" 
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
        
        <Link 
          href="/" 
          className="text-gray-300 hover:text-white transition-colors inline-block py-3 text-base min-h-[44px] [text-shadow:rgb(0,0,0)_0_0_3px]"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}