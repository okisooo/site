// src/app/upcoming/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function UpcomingPage() {
    return (
<div className="min-h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">
<div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 pt-4 sm:pt-8 [text-shadow:rgb(0,0,0)_1px_0_10px] [-webkit-text-stroke:0.5px_rgba(0,0,0,0.3)]">
            OKISO Upcoming Releases
          </h1>
          <p className="mb-6 sm:mb-8 text-gray-300 text-sm sm:text-base [text-shadow:rgb(0,0,0)_0_0_4px]">
            Get a preview of whats coming next from OKISO. Pre-save upcoming tracks and be the first to listen.
          </p>
          
          {/* Spotify Embed - Pre-release */}
          <div className="mb-8 sm:mb-10 bg-gray-900 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 [text-shadow:rgb(0,0,0)_1px_0_5px] [-webkit-text-stroke:0.25px_rgba(0,0,0,0.2)]">
              Pre-save Next Release
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              <div className="w-full md:w-1/3">
                <div className="relative aspect-square">
                  <Image 
                    src="https://i.scdn.co/image/ab67616d00001e02bcecbdb53ef1b1311a9923a8" 
                    alt="Upcoming release artwork" 
                    className="rounded-md shadow-lg"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 mt-4 md:mt-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 [text-shadow:rgb(0,0,0)_0_0_3px] [-webkit-text-stroke:0.25px_rgba(0,0,0,0.2)]">
                  FANTASIA
                </h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base [text-shadow:rgb(0,0,0)_0_0_3px]">Available March 10th</p>
                <a 
                  href="https://open.spotify.com/prerelease/4r7bY4BqBNRkZZen7ZHArD?si=2267ae6eda844a56" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors min-h-[44px] touch-action-manipulation [text-shadow:rgb(0,0,0)_0_0_2px]"
                >
                  <span>Pre-save on Spotify</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 [text-shadow:rgb(0,0,0)_1px_0_5px] [-webkit-text-stroke:0.25px_rgba(0,0,0,0.2)]">Release Schedule</h2>
            <p className="text-gray-300 text-sm sm:text-base [text-shadow:rgb(0,0,0)_0_0_3px]">
              Next release expected: <span className="font-semibold [text-shadow:rgb(0,0,0)_0_0_3px]">March 10 2025</span>
            </p>
            <p className="text-gray-300 mt-2 text-sm sm:text-base [text-shadow:rgb(0,0,0)_0_0_3px]">
              Follow OKISO on social media for the latest announcements and release dates.
            </p>
          </div>
          
          <Link 
            href="/" 
            className="text-gray-300 hover:text-white transition-colors inline-block py-3 text-base sm:text-base min-h-[44px] [text-shadow:rgb(0,0,0)_0_0_3px]"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
}