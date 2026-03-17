"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import PillButton from "@/Components/BA/PillButton";
import BentoBox from "@/Components/BA/BentoBox";
import FloatingBackground from "@/Components/BA/FloatingBackground";
import ScrollingMarquee from "@/Components/BA/ScrollingMarquee";
import SplitText from "@/Components/ReactBits/SplitText";
import {
  FaSpotify,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaDiscord,
  FaBandcamp,
  FaTwitch,
  FaReddit,
} from "react-icons/fa";

// Dynamically import VRM viewer
const VRMViewer = dynamic(() => import("@/Components/VRM/VRMViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="w-10 h-10 border-4 border-ba-red/30 border-t-ba-red rounded-full animate-spin" />
    </div>
  ),
});



type BentoColor = 'sky' | 'pink' | 'yellow' | 'lavender' | 'mint' | 'cream';

const socialLinks: { icon: React.ReactNode; label: string; href: string; color: BentoColor }[] = [
  { icon: <FaSpotify size={24} />, label: "Spotify", href: "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm", color: "mint" },
  { icon: <FaInstagram size={24} />, label: "Instagram", href: "https://www.instagram.com/okisooo_/", color: "pink" },
  { icon: <FaYoutube size={24} />, label: "YouTube", href: "https://www.youtube.com/@okiso7", color: "yellow" },
  { icon: <FaDiscord size={24} />, label: "Discord", href: "https://discord.gg/okiso", color: "lavender" },
  { icon: <FaTwitch size={24} />, label: "Twitch", href: "https://twitch.tv/okiso7", color: "cream" },
  { icon: <FaTwitter size={24} />, label: "X (Twitter)", href: "https://x.com/okisooo_", color: "sky" },
];

const extraSocials = [
  { icon: <FaGithub size={20} />, href: "https://github.com/okisooo" },
  { icon: <FaBandcamp size={20} />, href: "https://okiso.bandcamp.com/" },
  { icon: <FaReddit size={20} />, href: "https://www.reddit.com/user/okisooo/" },
];

export default function Home() {
  const [eggCount, setEggCount] = React.useState(0);
  const isEasterEgg = eggCount >= 5;

  return (
    <div className="flex-grow flex flex-col w-full overflow-x-hidden selection:bg-ba-pink-light selection:text-ba-dark bg-ba-white">
      <FloatingBackground />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[80vh] bg-ba-gradient-hero opacity-80" />
        <div className="absolute inset-0 dots-bg opacity-[0.03]" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">

          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            <SplitText
              text="OKISO"
              className="text-7xl md:text-8xl lg:text-[140px] font-display font-black text-ba-dark tracking-tighter leading-none mb-4"
              delay={200}
            />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="px-4 py-1.5 bg-ba-red text-white text-sm font-bold rounded-full shadow-ba-soft">vtuber and producer! ♡</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-lg text-ba-dark-soft font-ui max-w-md mb-8 tracking-wide"
            >
              {isEasterEgg ? "its never lupus." : "just making some noise on the internet. writing songs, coding things, and making content. welcome my takolings! 🐙"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex gap-4"
            >
              <PillButton variant="sky" size="lg" href="https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm">
                ♫ Spotify
              </PillButton>
              <PillButton variant="pink" size="lg" href="https://www.youtube.com/@okiso7">
                ▶ YouTube
              </PillButton>
            </motion.div>
          </div>

          {/* Character Art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.4 }}
            className="relative w-[300px] h-[450px] md:w-[400px] md:h-[600px] cursor-pointer"
            onClick={() => setEggCount(c => c + 1)}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-ba-red via-ba-pink to-ba-yellow opacity-20 blur-3xl animate-pulse" />
            <Image
              src={isEasterEgg ? "/easter_egg.jpg" : "/hero_character.png"}
              alt="OKISO — Virtual Artist Avatar"
              fill
              className={`object-contain ${isEasterEgg ? 'rounded-3xl shadow-2xl scale-95 transition-all duration-500' : 'drop-shadow-[0_20px_40px_rgba(255,77,77,0.4)]'}`}
              priority
              sizes="(max-width: 768px) 300px, 400px"
              unoptimized={isEasterEgg}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── Lower Section (Classroom Vibe) ─── */}
      <div className="relative w-full flex-grow pb-24 z-10 bg-ba-white">
        {/* Full-width classroom grid background */}
        <div className="absolute inset-0 bg-classroom-grid opacity-50 pointer-events-none" />

        {/* Soft fade transition at the top */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-ba-white to-transparent pointer-events-none z-10" />

        {/* ─── Scrolling Marquee Divider ─── */}
        <div className="relative z-30 pt-4 pb-12">
          <ScrollingMarquee text="OKISO オキソ" />
        </div>

        {/* ─── Bento Grid Section (Anime UI) ─── */}
        <section className="max-w-6xl mx-auto px-4 pb-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]">

            {/* Main Social Blocks */}
            {socialLinks.map((link, i) => (
              <BentoBox key={link.label} color={link.color} delay={i * 0.1} className="col-span-1 row-span-1 group cursor-pointer ba-corner-cross">
                <a href={link.href} target="_blank" rel="noreferrer" className="w-full h-full flex flex-col items-center justify-center p-6 text-ba-dark group-hover:text-white transition-colors duration-300">
                  <div className={`p-4 rounded-full bg-black/5 dark:bg-white/10 group-hover:bg-black/10 dark:group-hover:bg-white/20 mb-3 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                    {link.icon}
                  </div>
                  <span className="font-display font-bold text-lg">{link.label}</span>
                </a>
              </BentoBox>
            ))}

            {/* About Bio Block */}
            <BentoBox color="cream" delay={0.4} className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-8 flex flex-col justify-center ba-corner-cross relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-ba-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-sm font-jp transform rotate-3">プロフィール</div>

              <h3 className="text-2xl font-display font-bold text-ba-dark mb-3">who am i? ₍ ᐢ. ̫ .ᐢ ₎</h3>
              <p className="text-ba-dark-soft font-ui text-lg leading-relaxed relative z-10">
                im okiso! i make vocaloid music, stream sometimes, and do a lot of coding. this site is basically just a place for me to put all my stuff. thanks for stopping by!
              </p>
            </BentoBox>

            {/* VRM Viewer Block */}
            <BentoBox color="lavender" delay={0.5} className="col-span-1 md:col-span-3 lg:col-span-2 row-span-3 p-0 overflow-hidden group ba-corner-cross">
              <div className="absolute inset-x-0 top-0 p-4 z-20 pointer-events-none bg-gradient-to-b from-ba-lavender/80 to-transparent flex justify-between items-start">
                <h3 className="font-display font-black text-ba-dark text-shadow-sm flex items-center gap-2">
                  <span className="animate-spin-slow">✦</span> 3D Model
                </h3>
                <div className="bg-ba-dark text-white text-[9px] font-mono px-1.5 py-0.5 rounded opacity-50">SYS.OKISO.VRM</div>
              </div>
              <div className="w-full h-full bg-gradient-to-b from-ba-white to-ba-lavender/10">
                <VRMViewer modelUrl="/model.vrm" className="w-full h-full min-h-[480px]" />
              </div>
            </BentoBox>

            {/* Mini Links Block */}
            <BentoBox color="cream" delay={0.6} className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 p-6 flex flex-col justify-center ba-corner-cross">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-display font-bold text-ba-muted text-sm tracking-wider uppercase m-0">More Links</h4>
                <span className="text-ba-red text-xs font-jp opacity-60">サブリンク</span>
              </div>
              <div className="flex items-center gap-3">
                {extraSocials.map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-ba-dark/5 flex items-center justify-center text-ba-dark-soft hover:bg-ba-red hover:text-white transition-all hover:scale-110 hover:-translate-y-1">
                    {social.icon}
                  </a>
                ))}
              </div>
            </BentoBox>

          </div>
        </section>
      </div>
    </div>
  );
}
