"use client";

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
  return (
    <div className="w-full h-screen relative">
      {/* Render background behind your content */}
      <Iridescence />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <ASCIIText
          text="オキソ"
          enableWaves={true}
          asciiFontSize={7}
          textFontSize={200}
          textColor="#ffffff"
          planeBaseHeight={8}
        />
      </div>
      {/* Render dock */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 pointer-events-auto z-20">
  <div className="px-6 py-3 relative">
    <Dock
      items={dockItems}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      spring={{ mass: 0.2, stiffness: 200, damping: 18 }}
      distance={200}
    />
  </div>
      </div>
    </div>
  );
}