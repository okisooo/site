// src/app/releases/page.tsx
"use client";

import Link from 'next/link';


export default function ReleasesPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 pt-8">OKISO Music Releases</h1>
        
        <p className="mb-8 text-gray-300">
          Explore all of OKISOs music releases, including the latest singles, albums, and collaborations.
          Listen directly on this page or visit Spotify for the full experience.
        </p>
        
        {/* Spotify Embed - Artist Profile */}
        <div className="mb-10">
          <iframe 
            src="https://open.spotify.com/embed/artist/2FSh9530hmphpeK3QmDSPm?utm_source=generator" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            title="OKISO Spotify Profile"
          ></iframe>
        </div>
        
        {/* Featured release - specific track */}
        <h2 className="text-2xl font-bold mb-4">Featured Release</h2>
        <div className="mb-12">
          <iframe 
            src="https://open.spotify.com/embed/track/6f4eNccxDULuNatvBUSDyF?utm_source=generator" 
            width="100%" 
            height="152" 
            frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            title="OKISO Featured Track"
          ></iframe>
        </div>
        
        <Link href="/" className="text-gray-300 hover:text-white transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

