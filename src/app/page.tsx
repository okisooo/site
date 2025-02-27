"use client";

import { useState, useEffect } from "react";
import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';
import Dock from '@/Components/Dock/Dock';
import Iridescence from '@/Backgrounds/Iridescence/Iridescence';
import {
  FaSpotify,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaDiscord
} from 'react-icons/fa';
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
    icon: <FaDiscord size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Discord',
    onClick: () => window.open("https://discord.gg/chill", "_blank")
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
        <ASCIIText
          text="オキソ"
          enableWaves={true}
          asciiFontSize={isMobile ? 4 : 7}
          textFontSize={isMobile ? 100 : 200}
          textColor="#ffffff"
          planeBaseHeight={isMobile ? 4 : 8}
        />
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