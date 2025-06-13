"use client";

import { useState, useEffect } from "react";
import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';
import Dock from '@/Components/Dock/Dock';
import Link from 'next/link';
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

const dockItems = [{
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
}
];


export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Navigation buttons - left side */}
        <div className="absolute left-4 sm:left-8 md:left-12 z-20 transform -translate-y-1/2 top-1/2">          <Link
          href="/upcoming"
          prefetch={true}
          className="flex flex-col items-center justify-center group touch-manipulation nav-link-mobile" onClick={(e) => {
            // Use this to track if we have a navigation in progress
            if (window._navInProgress) {
              e.preventDefault();
              return false;
            }

            // For mobile devices, add a small delay to prevent double navigation
            if (window.isMobileDevice?.()) {
              e.preventDefault();
              window._navInProgress = true;

              // Navigate programmatically after a small delay
              setTimeout(() => {
                window.location.href = "/upcoming";
              }, 50);

              // Reset navigation state after a longer period
              setTimeout(() => {
                window._navInProgress = false;
              }, 300);

              return false;
            }

            // For non-mobile, set the flag but allow normal navigation
            window._navInProgress = true;
            setTimeout(() => {
              window._navInProgress = false;
            }, 300);
          }}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/60 transition-all duration-300 group-hover:scale-110 border border-gray-700/30">
            <MdUpcoming className="h-6 w-6 text-white" />
          </div>
          <span className="mt-2 text-xs font-medium text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 [text-shadow:rgb(0,0,0)_0_0_3px]">Upcoming</span>
        </Link>
        </div>
        {/* Existing ASCII Text element */}
        <ASCIIText
          text="オキソ"
          enableWaves={true}
          asciiFontSize={isMobile ? 4 : 7}
          textFontSize={isMobile ? 100 : 200}
          textColor="#ffffff"
          planeBaseHeight={isMobile ? 4 : 8}
        />        {/* Navigation buttons - right side */}
        <div className="absolute right-4 sm:right-8 md:right-12 z-20 transform -translate-y-1/2 top-1/2">
          <Link
            href="/releases"
            prefetch={true}
            className="flex flex-col items-center justify-center group touch-manipulation nav-link-mobile" onClick={(e) => {
              // Use this to track if we have a navigation in progress
              if (window._navInProgress) {
                e.preventDefault();
                return false;
              }

              // For mobile devices, add a small delay to prevent double navigation
              if (window.isMobileDevice?.()) {
                e.preventDefault();
                window._navInProgress = true;

                // Navigate programmatically after a small delay
                setTimeout(() => {
                  window.location.href = "/releases";
                }, 50);

                // Reset navigation state after a longer period
                setTimeout(() => {
                  window._navInProgress = false;
                }, 300);

                return false;
              }

              // For non-mobile, set the flag but allow normal navigation
              window._navInProgress = true;
              setTimeout(() => {
                window._navInProgress = false;
              }, 300);
            }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/60 transition-all duration-300 group-hover:scale-110 border border-gray-700/30">
              <MdLibraryMusic className="h-6 w-6 text-white" />
            </div>
            <span className="mt-2 text-xs font-medium text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 [text-shadow:rgb(0,0,0)_0_0_3px]">Releases</span>        </Link>
        </div>

        <div className="sr-only">
          <h1>OKISO - Official Website</h1>
          <p>Welcome to the official website of OKISO (オキソ), a Vocaloid artist and music producer. OKISO creates original electronic music and Japanese vocaloid compositions.</p>
          <p>Explore OKISO&apos;s latest music releases, connect on social media platforms including Spotify, Instagram, Twitter, YouTube, and join the Discord community.</p>
        </div>
      </div>

      {/* Dock container - improved for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-auto">
        <div className="flex justify-center w-full pb-4 sm:pb-4 pt-2">
          <div className="px-2 sm:px-6 py-2 sm:py-3 relative overflow-visible">
            <Dock
              items={dockItems}
              panelHeight={isMobile ? 52 : 68}
              baseItemSize={isMobile ? 38 : 50}
              magnification={isMobile ? 55 : 70}
              spring={{ mass: 0.2, stiffness: 200, damping: 18 }}
              distance={isMobile ? 100 : 200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}