"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';
import Dock from '@/Components/Dock/Dock';
import {
  FaSpotify,
  FaInstagram,
  FaFacebook,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaDiscord,
  FaBandcamp,
  FaApple,
  FaTwitch
} from 'react-icons/fa';
import { MdLibraryMusic, MdUpcoming } from 'react-icons/md';

// Type declaration for window extensions
declare global {
  interface Window {
    _linkClicked?: boolean;
    _navInProgress?: boolean;
    isMobileDevice?: () => boolean;
  }
}

// Helper function to prevent multiple rapid clicks on external links
const safeExternalLink = (url: string) => {
  return () => {
    // Prevent multiple clicks
    if (window._linkClicked) return;
    window._linkClicked = true;

    // Open the link
    window.open(url, "_blank");

    // Reset after a delay
    setTimeout(() => {
      window._linkClicked = false;
    }, 500);
  };
};

// Full social links for desktop
const allDockItems = [{
  icon: <FaSpotify size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Spotify',
  onClick: safeExternalLink("https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm?si=54f1d8b0d5784d97")
}, {
  icon: <FaInstagram size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Instagram',
  onClick: safeExternalLink("https://www.instagram.com/okisooo_/")
}, {
  icon: <FaFacebook size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Facebook',
  onClick: safeExternalLink("https://www.facebook.com/people/OKISO-%E3%82%AA%E3%82%AD%E3%82%BD/61577364628178/")
}, {
  icon: <FaGithub size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'GitHub',
  onClick: safeExternalLink("https://github.com/okisooo")
}, {
  icon: <FaTwitter size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'X',
  onClick: safeExternalLink("https://x.com/okisooo_")
}, {
  icon: <FaYoutube size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'YouTube',
  onClick: safeExternalLink("https://www.youtube.com/@okiso7")
}, {
  icon: <FaTwitch size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Twitch',
  onClick: safeExternalLink("https://twitch.tv/okiso7")
}, {
  icon: <FaBandcamp size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Bandcamp',
  onClick: safeExternalLink("https://okiso.bandcamp.com/")
}, {
  icon: <FaApple size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Apple Music',
  onClick: safeExternalLink("https://music.apple.com/us/artist/okiso/1735330883")
}, {
  icon: <FaDiscord size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Discord',
  onClick: safeExternalLink("https://discord.gg/okiso")
}, {
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" className="text-white hover:text-white/80 transition-colors" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  label: 'VGen',
  onClick: safeExternalLink("https://vgen.co/okiso")
}];

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Add body class to prevent scrolling on home page
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Navigation buttons - left side with better mobile spacing */}
      <div className="absolute left-2 sm:left-8 md:left-12 z-20 top-1/2 transform -translate-y-1/2">
        <button
          onClick={() => router.push("/upcoming")}
          className="flex flex-col items-center justify-center group touch-manipulation nav-link-mobile"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/60 transition-all duration-300 group-hover:scale-110 border border-gray-700/30">
            <MdUpcoming className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="mt-1 sm:mt-2 text-xs font-medium text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 [text-shadow:rgb(0,0,0)_0_0_3px]">
            Upcoming
            {isMobile && <div className="text-[10px] opacity-60 mt-0.5">← swipe</div>}
          </span>
        </button>
      </div>

      {/* Centered ASCII Text element */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative" style={{ width: isMobile ? '400px' : '1000px', height: isMobile ? '350px' : '700px' }}>
          <ASCIIText
            text="オキソ"
            enableWaves={true}
            asciiFontSize={isMobile ? 4.5 : 8}
            textFontSize={isMobile ? 120 : 250}
            textColor="#ffffff"
            planeBaseHeight={isMobile ? 4 : 8}
          />
        </div>
      </div>

      {/* Navigation buttons - right side with better mobile spacing */}
      <div className="absolute right-2 sm:right-8 md:right-12 z-20 top-1/2 transform -translate-y-1/2">
        <button
          onClick={() => router.push("/releases")}
          className="flex flex-col items-center justify-center group touch-manipulation nav-link-mobile"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/60 transition-all duration-300 group-hover:scale-110 border border-gray-700/30">
            <MdLibraryMusic className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="mt-1 sm:mt-2 text-xs font-medium text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 [text-shadow:rgb(0,0,0)_0_0_3px]">
            Releases
            {isMobile && <div className="text-[10px] opacity-60 mt-0.5">swipe →</div>}
          </span>
        </button>
      </div>

      <div className="sr-only">
        <h1>OKISO - Official Website</h1>
        <p>Welcome to the official website of OKISO (オキソ), a Vocaloid artist and music producer. OKISO creates original electronic music and Japanese vocaloid compositions.</p>
        <p>Explore OKISO&apos;s latest music releases, connect on social media platforms including Spotify, Instagram, Twitter, YouTube, and join the Discord community.</p>
      </div>

      {/* Dock container - scrollable on mobile to fit all icons */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-auto">
        <div className="flex justify-center w-full pb-3 sm:pb-4 pt-2">
          <div className="px-1 sm:px-6 py-2 sm:py-3 relative overflow-visible">
            {isMobile ? (
              // Mobile: Scrollable dock with all items
              <div className="overflow-x-auto scrollbar-hide touch-scroll px-4">
                <div className="flex justify-center" style={{ minWidth: '100vw' }}>
                  <Dock
                    items={allDockItems}
                    panelHeight={44}
                    baseItemSize={28}
                    magnification={38}
                    spring={{ mass: 0.2, stiffness: 200, damping: 18 }}
                    distance={60}
                  />
                </div>
              </div>
            ) : (
              // Desktop: Normal dock with all items
              <Dock
                items={allDockItems}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
                spring={{ mass: 0.2, stiffness: 200, damping: 18 }}
                distance={200}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}