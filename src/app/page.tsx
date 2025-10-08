"use client";

import React, { useState, useEffect, useMemo } from "react";
import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';
import Dock from '@/Components/Dock/Dock';
import GooeyNav from '@/Components/GooeyNav/GooeyNav';
import PromoBanner from '@/Components/PromoBanner';
import { crydieVideoHighlight } from '@/data/highlights';
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
  FaTwitch,
  FaReddit
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
  icon: <FaReddit size={24} className="text-white hover:text-white/80 transition-colors" />,
  label: 'Reddit',
  onClick: safeExternalLink("https://www.reddit.com/r/okisooo")
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
  const [isMobile, setIsMobile] = useState(false);
  const videoHighlight = crydieVideoHighlight;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Add body class to prevent scrolling on home page
    document.body.classList.add('home-page');

    // Hard-lock scroll on iOS and others
    const prevent = (e: Event) => {
      e.preventDefault();
      return false;
    };
    window.addEventListener('touchmove', prevent as EventListener, { passive: false });
    window.addEventListener('wheel', prevent as EventListener, { passive: false });
    const onScroll = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.body.classList.remove('home-page');
      window.removeEventListener('touchmove', prevent as EventListener);
      window.removeEventListener('wheel', prevent as EventListener);
      window.removeEventListener('scroll', onScroll as EventListener);
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
    <div className={`fixed inset-0 w-full h-full overflow-hidden bg-transparent`}>
      <style>{`
         body.home-page {
           overflow: hidden !important;
           position: fixed !important;
           inset: 0 !important;
           width: 100% !important;
           overscroll-behavior: none !important;
           touch-action: none !important;
         }
         html, body {
           height: 100% !important;
           min-height: 100% !important;
           overscroll-behavior: none !important;
           touch-action: none !important;
         }
       `}</style>
      {/* GooeyNav at top for desktop, at bottom for mobile */}
      <div className={isMobile ? "fixed left-0 w-full z-50 flex justify-center bottom-nav-safe" : "fixed left-0 w-full z-50 flex justify-center top-nav-safe"}>
        <div style={{ position: 'relative', width: isMobile ? 'auto' : 'auto', margin: '0 auto', zIndex: 50 }}>
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
      {/* Prevent scroll bleed */}
      {isMobile ? (
        <div className="absolute inset-0 px-4 overflow-hidden">
          {/* ASCIIText near top and centered on mobile */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '3.5vh', pointerEvents: 'none' }}>
            <div style={{ width: 'min(96vw, 440px)', height: 'min(48vh, 300px)' }}>
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

          {/* Promo banner + social icons above nav */}
          <div
            className="fixed left-0 right-0 flex flex-col items-center gap-2"
            style={{ bottom: 'calc(var(--bottom-bar-height) + 20px)' }}
          >
            <div className="w-full px-1 flex justify-center">
              <PromoBanner
                eyebrow={videoHighlight.eyebrow}
                title={videoHighlight.title}
                description={videoHighlight.description}
                href={videoHighlight.href}
                ctaLabel={videoHighlight.ctaLabel}
                accentColor={videoHighlight.accentColor}
                accentGlow={videoHighlight.accentGlow}
                ctaTextColor={videoHighlight.ctaTextColor}
                releaseDate={videoHighlight.releaseDate}
                releaseDateLabel={videoHighlight.releaseDateLabel}
                image={videoHighlight.image}
                imageAlt={videoHighlight.imageAlt}
                compact
                align="center"
                className="w-full max-w-xs pointer-events-auto"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
              {allDockItems.map((item) => (
                <button
                  key={item.label}
                  aria-label={item.label}
                  onClick={item.onClick}
                  className="btn-social"
                >
                  <span className="btn-social-icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Centered ASCII Text element */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
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
          <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
            <div className="flex flex-col items-center gap-4 w-full pb-4 pt-2 pointer-events-none">
              <div className="w-full flex justify-center px-4 pointer-events-auto">
                <div className="w-full max-w-2xl">
                  <PromoBanner
                    eyebrow={videoHighlight.eyebrow}
                    title={videoHighlight.title}
                    description={videoHighlight.description}
                    href={videoHighlight.href}
                    ctaLabel={videoHighlight.ctaLabel}
                    accentColor={videoHighlight.accentColor}
                    accentGlow={videoHighlight.accentGlow}
                    ctaTextColor={videoHighlight.ctaTextColor}
                    releaseDate={videoHighlight.releaseDate}
                    releaseDateLabel={videoHighlight.releaseDateLabel}
                    image={videoHighlight.image}
                    imageAlt={videoHighlight.imageAlt}
                  />
                </div>
              </div>
              <div className="flex justify-center w-full pb-1 sm:pb-2 pointer-events-auto">
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
          </div>
        </>
      )}
    </div>
  );
}