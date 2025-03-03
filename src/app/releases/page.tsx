// src/app/releases/page.tsx
"use client";

import Link from 'next/link';
import Iridescence from '@/Backgrounds/Iridescence/Iridescence';
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
    <div className="min-h-screen w-full relative overflow-hidden bg-black text-white p-3 sm:p-6">
      {/* Position the Iridescence to fill the entire viewport */}
      <div className="absolute inset-0 w-full h-full">
        <Iridescence />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 pt-4 sm:pt-8">OKISO Music Releases</h1>
        <p className="mb-6 sm:mb-8 text-gray-300 text-sm sm:text-base">
          Explore all of OKISOs music releases, including the latest singles, albums, and collaborations.
          Listen directly on this page or visit Spotify for the full experience.
        </p>
        
        {/* Spotify Artist Embed - Responsive height */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Artist Discography</h2>
          <div className={`w-full ${isMobile ? 'h-[500px]' : 'h-[352px]'}`}>
            <iframe 
              src="https://open.spotify.com/embed/artist/2FSh9530hmphpeK3QmDSPm?utm_source=generator" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="OKISO Spotify Profile"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
        
        {/* Featured release with responsive height */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Featured Release</h2>
          <div className={`w-full ${isMobile ? 'h-[180px]' : 'h-[152px]'}`}>
            <iframe 
              src="https://open.spotify.com/embed/track/6f4eNccxDULuNatvBUSDyF?utm_source=generator" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="OKISO Featured Track"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
        
        <Link 
          href="/" 
          className="text-gray-300 hover:text-white transition-colors inline-block py-3 text-base min-h-[44px]"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}