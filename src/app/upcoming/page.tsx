"use client";

import Link from 'next/link';
import ContentCard from '@/Components/ContentCard';

export default function UpcomingPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">
      {/* Vignette effect overlay */}
      <div className="absolute inset-0 bg-vignette z-[1] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">        <header className="mb-4 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-shadow-lg mb-2 sm:mb-4 text-center sm:text-left">
          OKISO Upcoming Releases
        </h1>
        <p className="text-lg sm:text-xl text-shadow-md text-gray-200 mb-4 sm:mb-6 text-center sm:text-left">
          Get a preview of what is coming next from OKISO. Check back later for updates.
        </p>
      </header>

        <ContentCard>
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold text-shadow-lg mb-3 text-gray-300">
                Nothing Yet
              </h2>
              <p className="text-lg sm:text-xl text-shadow-md text-gray-400 mb-4">
                No upcoming releases at the moment.
              </p>
              <p className="text-gray-500 text-shadow-sm max-w-md mx-auto">
                Stay tuned for future announcements and new music from OKISO. Check back soon!
              </p>
            </div>
          </div>
        </ContentCard>{/* Back to Home button with fixed position */}
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