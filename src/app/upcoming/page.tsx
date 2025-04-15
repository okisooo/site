"use client";
import Link from 'next/link';
import Image from 'next/image';
import ContentCard from '@/Components/ContentCard';
import Iridescence from '@/Backgrounds/Iridescence/Iridescence';

export default function UpcomingPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white p-3 sm:p-6">
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
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-shadow-lg mb-4">
            OKISO Upcoming Releases
          </h1>
          <p className="text-xl text-shadow-md text-gray-200 mb-6">
            Get a preview of what is coming next from OKISO. Pre-save upcoming tracks and be the first to listen.
          </p>
        </header>

        <ContentCard title="Latest Release: ETUDE">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="relative aspect-square">
                <Image 
                  src="https://i.scdn.co/image/ab67616d00001e02f5f30c6f3950a9e12c96287e"
                  alt="ETUDE album artwork"
                  className="rounded-md shadow-lg"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 mt-4 md:mt-0">
              <h3 className="text-xl font-semibold mb-2 text-shadow-md">ETUDE</h3>
              <p className="text-gray-200 mb-4 text-shadow-sm">
                Her voice is ETUDE
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="backdrop-blur-card bg-white/5 p-3 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-shadow-sm mb-1">Release Date</h4>
                  <p>April 25, 2025</p>
                </div>
                <div className="backdrop-blur-card bg-white/5 p-3 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-shadow-sm mb-1">Platforms</h4>
                  <p>Spotify, Apple Music + more</p>
                </div>
              </div>
            </div>
          </div>
        </ContentCard>
        
        <ContentCard title="Pre-save">
          <div className="backdrop-blur-card bg-white/5 p-5 rounded-lg border border-white/10 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image 
                  src="https://i.scdn.co/image/ab67616d00001e02f5f30c6f3950a9e12c96287e" 
                  alt="ETUDE artwork" 
                  fill 
                  className="object-cover rounded" 
                />
              </div>
              <div>
                <h3 className="font-bold text-shadow-md">ETUDE</h3>
                <p className="text-gray-300 text-shadow-sm">Release: April 25, 2025</p>
              </div>
            </div>
          </div>
          
          <a 
            href="https://open.spotify.com/album/4raTOoWiHkOwYH7CQFzAcC?si=0N7A2cOpRAe22hTkEVanCg"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#1DB954] hover:bg-[#1ed760] rounded-full text-black font-medium transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Listen on Spotify
          </a>
        </ContentCard>
        
        {/* Back to Home button with fixed position */}
        <div className="fixed bottom-6 left-6 z-20">
          <Link 
            href="/" 
            className="text-gray-300 hover:text-white transition-colors bg-black/40 backdrop-blur-card px-4 py-2 rounded-full inline-flex items-center text-base min-h-[44px] text-shadow-sm border border-white/10 shadow-lg"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}