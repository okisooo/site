// src/app/upcoming/page.tsx
"use client";

import Link from 'next/link';

export default function UpcomingPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 pt-8">OKISO Upcoming Releases</h1>
        
        <p className="mb-8 text-gray-300">
          Get a preview of whats coming next from OKISO. Pre-save upcoming tracks and be the first to listen.
        </p>
        
        {/* Spotify Embed - Pre-release */}
        <div className="mb-10">
          <iframe 
            src="https://open.spotify.com/embed/prerelease/4r7bY4BqBNRkZZen7ZHArD?utm_source=generator" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowTransparency={true}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            title="OKISO Upcoming Release"
          ></iframe>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Release Schedule</h2>
          <p className="text-gray-300">
            Next release expected: <span className="font-semibold">June 2024</span>
          </p>
          <p className="text-gray-300 mt-2">
            Follow OKISO on social media for the latest announcements and release dates.
          </p>
        </div>
        
        <Link href="/" className="text-gray-300 hover:text-white transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}