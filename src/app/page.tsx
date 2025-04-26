"use client";

import { useState, useEffect } from "react";
import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';
import Dock from '@/Components/Dock/Dock';
import Iridescence from '@/Backgrounds/Iridescence/Iridescence';
import Link from 'next/link';
import {
  FaSpotify,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaDiscord,
  FaBandcamp,
  FaApple
} from 'react-icons/fa';
import { MdLibraryMusic, MdUpcoming } from 'react-icons/md';

const dockItems = [
  {
    icon: <FaSpotify size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Spotify',
    onClick: () => window.open("https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm?si=54f1d8b0d5784d97", "_blank")
  },
  {
    icon: <FaInstagram size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Instagram',
    onClick: () => window.open("https://www.instagram.com/okisooo_/", "_blank")
  },
  {
    icon: <FaGithub size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'GitHub',
    onClick: () => window.open("https://github.com/okisooo", "_blank")
  },
  {
    icon: <FaTwitter size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'X',
    onClick: () => window.open("https://x.com/okisooo_", "_blank")
  },
  {
    icon: <FaYoutube size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'YouTube',
    onClick: () => window.open("https://www.youtube.com/@okiso7", "_blank")
  },
  {
    icon: <FaBandcamp size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Bandcamp',
    onClick: () => window.open("https://okiso.bandcamp.com/", "_blank")
  },
  {
    icon: <FaApple size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Apple Music',
    onClick: () => window.open("https://music.apple.com/us/artist/okiso/1542837884", "_blank") // Assuming this is the correct artist link
  },
  {
    icon: <FaDiscord size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Discord',
    onClick: () => window.open("https://discord.gg/okiso", "_blank")
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
      <Iridescence />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Navigation buttons - left side */}
        <div className="absolute left-8 md:left-12 z-20 transform -translate-y-1/2 top-1/2">
          <Link 
            href="/upcoming" 
            className="flex flex-col items-center justify-center group"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/60 transition-all duration-300 group-hover:scale-110 border border-gray-700/30">
              <MdUpcoming className="h-6 w-6 text-white" />
            </div>
            <span className="mt-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 [text-shadow:rgb(0,0,0)_0_0_3px]">Upcoming</span>
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
        />
        
        {/* Navigation buttons - right side */}
        <div className="absolute right-8 md:right-12 z-20 transform -translate-y-1/2 top-1/2">
          <Link 
            href="/releases" 
            className="flex flex-col items-center justify-center group"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/60 transition-all duration-300 group-hover:scale-110 border border-gray-700/30">
              <MdLibraryMusic className="h-6 w-6 text-white" />
            </div>
            <span className="mt-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 [text-shadow:rgb(0,0,0)_0_0_3px]">Releases</span>
          </Link>
        </div>
        
        <div className="sr-only">
          <h1>OKISO - Official Website</h1>
          <p>Welcome to the official website of OKISO (オキソ), a Vocaloid artist and music producer. OKISO creates original electronic music and Japanese vocaloid compositions.</p>
          <p>Explore OKISOs latest music releases, connect on social media platforms including Spotify, Instagram, Twitter, YouTube, and join the Discord community.</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 pointer-events-auto z-20">
        <div className="px-6 py-3 relative">
          <Dock
            items={dockItems}
            panelHeight={isMobile ? 58 : 68}
            baseItemSize={isMobile ? 40 : 50}
            magnification={isMobile ? 50 : 70}
            spring={{ mass: 0.2, stiffness: 200, damping: 18 }}
            distance={isMobile ? 150 : 200}
          />
        </div>
      </div>
    </div>
  );
}