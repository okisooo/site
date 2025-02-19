"use client";

import ASCIIText from '@/TextAnimations/ASCIIText/ASCIIText';
import Dock from '@/Components/Dock/Dock';
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
    onClick: () => window.open("https://open.spotify.com/user/your-spotify-id", "_blank")
  },
  {
    icon: <FaInstagram size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Instagram',
    onClick: () => window.open("https://instagram.com/your-username", "_blank")
  },
  {
    icon: <FaGithub size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'GitHub',
    onClick: () => window.open("https://github.com/your-username", "_blank")
  },
  {
    icon: <FaTwitter size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'X',
    onClick: () => window.open("https://twitter.com/your-username", "_blank")
  },
  {
    icon: <FaYoutube size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'YouTube',
    onClick: () => window.open("https://www.youtube.com/channel/your-channel", "_blank")
  },
  {
    icon: <FaDiscord size={24} className="text-white hover:text-white/80 transition-colors" />,
    label: 'Discord',
    onClick: () => window.open("https://discord.com/invite/your-invite", "_blank")
  }
];

export default function Home() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <ASCIIText
          text="オキソ"
          enableWaves={true}
          asciiFontSize={7}
          textFontSize={200}
          textColor="#ffffff"
          planeBaseHeight={8}
        />
      </div>

      {/* Dock positioned at the bottom center with a glass effect background */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 pointer-events-auto">
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl">
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