"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ContentCard from '@/Components/ContentCard';
import Iridescence from '@/Backgrounds/Iridescence/Iridescence';

export default function ReleasesPage() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white p-2 sm:p-4 lg:px-8 xl:px-16">
      {/* Background with adjusted properties for better contrast */}
      <Iridescence 
        className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden z-[-1]" 
        color={[0.8, 0.8, 0.8]} 
        speed={0.7} 
        amplitude={0.08} 
      />
      
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
          
      {/* Vignette effect overlay */}
      <div className="absolute inset-0 bg-vignette z-[1] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-4 lg:space-y-6">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-shadow-lg mb-2 sm:mb-4">
            OKISO Music Releases
          </h1>
          <p className="text-lg sm:text-xl text-shadow-md text-gray-200 max-w-2xl mx-auto">
            Explore OKISO&apos;s music catalog. Listen to the latest releases.
          </p>
        </header>

        <ContentCard title="Latest Release" className="w-full">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
            <div className="w-full md:w-1/3 max-w-[300px] mx-auto">
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
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-shadow-md">FANTASIA</h3>
              <p className="text-gray-200 mb-3 text-shadow-sm">
                My first GUMI album, FANTASIA! 
              </p>
              
              {/* Spotify Embed - Updated with the latest album */}
              <iframe 
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/album/0t28Vt3fN6awEEFcTR3AlN?utm_source=generator"
                width="100%" 
                height={isMobile ? "152" : "132"} 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="mt-2"
              ></iframe>
            </div>
          </div>
        </ContentCard>
        
        <ContentCard title="Featured Releases" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Release Item 1 */}
            <div className="backdrop-blur-card bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
              <h4 className="font-semibold text-shadow-sm mt-2">Meet The Princess</h4>
              <p className="text-sm text-gray-300 text-shadow-sm mb-2">2025</p>
              <a 
                href="https://open.spotify.com/album/6JZQro8zNEHUfEFZuVFMrC?si=RUsbEW2uSX-OMO-999PFKQ" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
            </div>
            
            {/* Release Item 2 */}
            <div className="backdrop-blur-card bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
              <h4 className="font-semibold text-shadow-sm mt-2">SHUT OFF</h4>
              <p className="text-sm text-gray-300 text-shadow-sm mb-2">2025</p>
              <a 
                href="https://open.spotify.com/album/3tQfs4MH0zc8bVk9Inv2hT?si=B0unYMY5QJe55mBiR1mZCg" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
            </div>
            
            {/* Release Item 3 */}
            <div className="backdrop-blur-card bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </a>
              <h4 className="font-semibold text-shadow-sm mt-2">TEARS IN HEAVEN &apos;99</h4>
              <p className="text-sm text-gray-300 text-shadow-sm mb-2">2025</p>
              <a 
                href="https://open.spotify.com/album/0jLZeVoHNqheN7rYfCIO9A?si=Pvch5L8DTaODoaJLM2DsVg" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-.959 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
            </div>
          </div>
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