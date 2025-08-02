"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';
import Dock from '@/Components/Dock/Dock';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';
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

  // Navigation items for GooeyNav
  const navItems = useMemo(() => [
    { label: 'Upcoming', href: '/upcoming' },
    { label: 'Home', href: '/' },
    { label: 'Releases', href: '/releases' }
  ], []);

  // Set to 1 since this is the home page (second item in navItems array)
  const initialActiveIndex = 1;

  return (
    <div className="w-full h-screen min-h-0 relative overflow-hidden bg-transparent">
      <style>{`
        body.home-page {
          overflow: hidden !important;
          overscroll-behavior-y: none;
          touch-action: pan-x;
        }
        html, body {
          height: 100vh !important;
          min-height: 0 !important;
        }
      `}</style>
      {/* GooeyNav at top for desktop, at bottom for mobile */}
      <div className={isMobile ? "fixed bottom-4 left-0 w-full z-50 flex justify-center" : "fixed top-0 left-0 w-full z-50 flex justify-center"} style={!isMobile ? { marginTop: '18px' } : {}}>
        <div style={{ position: 'relative', width: isMobile ? 'auto' : 'auto', margin: '0 auto', fontFamily: 'Geist, sans-serif', zIndex: 50 }}>
          {/* Glass Surface behind GooeyNav */}
          <div className="absolute inset-0 z-[-1]" style={{
            width: isMobile ? '350px' : '400px',
            height: '60px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px) saturate(1.2) brightness(1.1)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.2) brightness(1.1)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
          }} />
          <GooeyNav
            items={navItems}
            initialActiveIndex={initialActiveIndex}
            animationTime={600}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      </div>
      {/* Prevent scroll bleed from scaled background */}
      {isMobile ? (
        <div className="flex flex-col h-full min-h-0 px-4 pb-24 overflow-hidden">
          {/* ASCIIText logo centered vertically for mobile */}
          <div className="w-full flex justify-center mt-8 mb-4" style={{ position: 'relative', top: 0 }}>
            <div style={{ width: 420, height: 300 }}>
              <ASCIIText
                text="オキソ"
                enableWaves={true}
                asciiFontSize={6}
                textFontSize={90}
                textColor="#fff"
                planeBaseHeight={5}
              />
            </div>
          </div>

          {/* Spacer to push content to bottom */}
          <div className="flex-grow min-h-4" />

          {/* Social icons as grid - positioned higher to avoid GooeyNav overlap */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto mb-8">
            {allDockItems.map((item) => (
              <button
                key={item.label}
                aria-label={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center bg-gray-800/70 rounded-lg p-3 hover:bg-gray-700/90 transition"
              >
                {item.icon}
                <span className="text-[11px] text-white mt-1 opacity-70">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Centered ASCII Text element */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative" style={{ width: '1000px', height: '700px' }}>
              <ASCIIText
                text="オキソ"
                enableWaves={true}
                asciiFontSize={8}
                textFontSize={250}
                textColor="#ffffff"
                planeBaseHeight={8}
              />
            </div>
          </div>

          {/* Dock container - scrollable on mobile to fit all icons */}
          <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-auto">
            <div className="flex justify-center w-full pb-3 sm:pb-4 pt-2">
              <div className="px-1 sm:px-6 py-2 sm:py-3 relative overflow-visible">
                <Dock
                  items={allDockItems}
                  panelHeight={68}
                  baseItemSize={50}
                  magnification={70}
                  spring={{ mass: 0.2, stiffness: 200, damping: 18 }}
                  distance={200}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}