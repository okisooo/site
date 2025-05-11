"use client";

import Link from 'next/link';
import Image from 'next/image';
import ContentCard from '@/Components/ContentCard';

export default function UpcomingPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">
      {/* Vignette effect overlay */}
      <div className="absolute inset-0 bg-vignette z-[1] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-shadow-lg mb-2 sm:mb-4 text-center sm:text-left">
            OKISO Upcoming Releases
          </h1>
          <p className="text-lg sm:text-xl text-shadow-md text-gray-200 mb-4 sm:mb-6 text-center sm:text-left">
            Get a preview of what is coming next from OKISO. Check back later for updates.          </p>
        </header>
        <ContentCard>
          <div className="flexflex-col lg:flex-row items-center gap-4 sm:gap-8 py-4 sm:py-8 px-2 sm:px-4">
            {/* Album Cover */}            <div className="w-full max-w-[250px] sm:max-w-[300px] aspect-square relative rounded-lg overflow-hidden shadow-2xl mx-auto sm:mx-0">
              <a href="https://open.spotify.com/prerelease/0MAU5F8CQeuBQ4bC9N3SDi?si=4dde829272c14f12" target="_blank" rel="noopener noreferrer" className="block w-full h-full">                <Image
                src="https://i.scdn.co/image/ab67616d00001e029899e44696d9069ad2953a4d"
                alt="RESURRECTION Album Cover"
                width={300}
                height={300}
                className="object-cover hover:scale-105 transition-transform"
                sizes="(max-width: 640px) 250px, 300px"
                priority
              />
              </a>
            </div>            {/* Album Info */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-shadow-lg mb-2 sm:mb-3">RESURRECTION</h2>
              <div className="mb-4 sm:mb-6">
                <span className="inline-block bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-2 sm:mb-3">Coming Soon</span>                <p className="text-lg sm:text-xl text-shadow-md mb-3 sm:mb-4">
                  The next evolution of OKISO&apos;s sound is approaching.
                </p>
                <p className="text-gray-200 text-shadow-sm mb-4 sm:mb-6">
                  Experience rebirth.
                </p>
              </div>              <a
                href="https://open.spotify.com/prerelease/0MAU5F8CQeuBQ4bC9N3SDi?si=4dde829272c14f12"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-flex items-center justify-center transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Pre-save on Spotify
              </a>
            </div>
          </div>
        </ContentCard>        {/* Back to Home button with fixed position */}
        <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-20">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors bg-black/40 backdrop-blur-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-flex items-center text-sm sm:text-base min-h-[36px] sm:min-h-[44px] text-shadow-sm border border-white/10 shadow-lg"
            aria-label="Back to home page"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}