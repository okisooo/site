"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import ZZZCard from "@/Components/ZZZ/ZZZCard";
import ZZZButton from "@/Components/ZZZ/ZZZButton";
import ZZZGrid from "@/Components/ZZZ/ZZZGrid";
import TapeDivider from "@/Components/Urban/TapeDivider";
import TechOverlay from "@/Components/Urban/TechOverlay";
import VerticalText from "@/Components/Urban/VerticalText";
import DecodingText from "@/Components/ZZZ/DecodingText";
import HollowDistortion from "@/Components/ZZZ/HollowDistortion";
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

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);

  // Map social links to ZZZ accent colors
  const socialLinks: { icon: React.ReactNode; label: string; href: string; color: "ether-purple" | "electric-blue" | "impact-orange" | "volt-green" }[] = [
    { icon: <FaSpotify size={24} />, label: "Spotify", href: "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm", color: "volt-green" },
    { icon: <FaYoutube size={24} />, label: "YouTube", href: "https://www.youtube.com/@okiso7", color: "ether-purple" },
    { icon: <FaTwitter size={24} />, label: "Twitter", href: "https://x.com/okisooo_", color: "electric-blue" },
    { icon: <FaInstagram size={24} />, label: "Instagram", href: "https://www.instagram.com/okisooo_/", color: "impact-orange" },
    { icon: <FaGithub size={24} />, label: "GitHub", href: "https://github.com/okisooo", color: "ether-purple" },
    { icon: <FaDiscord size={24} />, label: "Discord", href: "https://discord.gg/okiso", color: "electric-blue" },
    { icon: <FaBandcamp size={24} />, label: "Bandcamp", href: "https://okiso.bandcamp.com/", color: "volt-green" },
    { icon: <FaTwitch size={24} />, label: "Twitch", href: "https://twitch.tv/okiso7", color: "ether-purple" },
    { icon: <FaReddit size={24} />, label: "Reddit", href: "https://www.reddit.com/user/okisooo/", color: "impact-orange" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Hero Entrance - Slam and Bounce
      tl.from(charRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
      })
        .from(
          titleRef.current,
          {
            scale: 2,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .from(
          statsRef.current?.children || [],
          {
            x: -100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "back.out(1.7)", // ZZZ style bounce
          },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full pb-20 overflow-x-hidden bg-zzz-black text-zzz-text-primary selection:bg-zzz-electric-blue selection:text-black">
      <TechOverlay />
      <HollowDistortion />

      {/* Hero Section - Character Select Style */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('https://upload-os-bbs.hoyolab.com/upload/2025/10/12/412978508/d76b17a7ca9c5906a1186b6ae09b8247_785297769067386992.gif')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-zzz-black via-transparent to-zzz-black" />
        <div className="absolute inset-0 bg-halftone opacity-10" />

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">
          {/* Left: Stats & Info */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div ref={statsRef} className="space-y-6">
              <div className="bg-zzz-panel-bg border-l-4 border-zzz-electric-blue p-6 clip-zzz-card transform -skew-x-6 hover:skew-x-0 transition-transform duration-300">
                <h3 className="text-zzz-electric-blue font-display text-xl mb-1">ROLE //</h3>
                <p className="text-4xl font-black uppercase tracking-tighter">
                  <DecodingText text="PRODUCER" revealDuration={1} />
                </p>
              </div>
              <div className="bg-zzz-panel-bg border-l-4 border-zzz-ether-purple p-6 clip-zzz-card transform -skew-x-6 ml-8 hover:skew-x-0 transition-transform duration-300">
                <h3 className="text-zzz-ether-purple font-display text-xl mb-1">CLASS //</h3>
                <p className="text-4xl font-black uppercase tracking-tighter">
                  <DecodingText text="VTUBER" revealDuration={1.2} />
                </p>
              </div>
              <div className="bg-zzz-panel-bg border-l-4 border-zzz-impact-orange p-6 clip-zzz-card transform -skew-x-6 hover:skew-x-0 transition-transform duration-300">
                <h3 className="text-zzz-impact-orange font-display text-xl mb-1">AFFILIATION //</h3>
                <p className="text-4xl font-black uppercase tracking-tighter">
                  <DecodingText text="OKISO.NET" revealDuration={1.4} />
                </p>
              </div>
            </div>
          </div>

          {/* Center: Character / Title */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 relative">
            <div ref={charRef} className="relative w-full aspect-[3/4] max-h-[80vh] flex items-center justify-center">
              {/* Character Art */}
              <div className="absolute inset-0 z-10 drop-shadow-2xl" style={{ filter: "contrast(1.1) brightness(1.05)" }}>
                <Image
                  src="/hero_character.png"
                  alt="OKISO Character - Virtual Avatar"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Subtle Back Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-50 blur-3xl -z-10" />

              <h1 ref={titleRef} className="absolute bottom-10 text-[12vw] lg:text-[8vw] leading-none font-display font-black text-white tracking-tighter z-20 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] mix-blend-overlay">
                OKISO
              </h1>
              <h1 className="absolute bottom-10 text-[12vw] lg:text-[8vw] leading-none font-display font-black text-transparent text-stroke tracking-tighter z-20 pointer-events-none">
                OKISO
              </h1>
            </div>
          </div>

          {/* Right: Vertical Text */}
          <div className="lg:col-span-4 hidden lg:flex justify-end items-center order-3 h-full py-20">
            <div className="flex gap-8 h-full">
              <VerticalText text="VIRTUAL REALITY" color="cyan" className="opacity-50" />
              <VerticalText text="AUDIO PRODUCTION" color="magenta" className="opacity-80" />
              <VerticalText text="SYSTEM ONLINE" color="white" />
            </div>
          </div>
        </div>
      </section>

      <TapeDivider text="INITIATING SYSTEM LINK // WELCOME PROXY //" direction="left" color="yellow" />

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <ZZZGrid>
          {/* Social Grid */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-2 gap-4">
            {socialLinks.slice(0, 4).map((link) => (
              <ZZZCard
                key={link.label}
                accentColor={link.color}
                className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-zzz-dark-grey/50 cursor-pointer"
                onClick={() => window.open(link.href, '_blank')}
              >
                <div className={`text-4xl text-zzz-${link.color}`}>{link.icon}</div>
                <span className="font-bold text-sm uppercase tracking-wider">{link.label}</span>
              </ZZZCard>
            ))}
          </div>

          {/* About / Bio */}
          <ZZZCard title="PROFILE_DATA" accentColor="electric-blue" className="col-span-1 md:col-span-2 lg:col-span-1">
            <p className="text-zzz-text-primary/80 leading-relaxed font-mono text-sm mb-6">
              &gt; SYSTEM SCAN COMPLETE<br />
              &gt; ENTITY: OKISO<br />
              &gt; TYPE: VIRTUAL PRODUCER<br /><br />
              Just a virtual entity making noise on the internet. I produce hyperpop, write code, and stream games. Welcome to my world.
            </p>
            <div className="flex flex-wrap gap-2">
              {["HYPERPOP", "GAMER", "DEVELOPER", "ARTIST", "STREAMER"].map((tag) => (
                <span key={tag} className="text-xs font-bold font-display border border-zzz-electric-blue text-zzz-electric-blue px-2 py-1 bg-zzz-electric-blue/10">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <ZZZButton className="w-full" accentColor="electric-blue" onClick={() => window.location.href = 'mailto:oxo@okiso.net'}>INITIATE CONTACT</ZZZButton>
            </div>
          </ZZZCard>

          {/* More Socials & Links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-2 gap-4">
            {socialLinks.slice(4, 8).map((link) => (
              <ZZZCard
                key={link.label}
                accentColor={link.color}
                className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-zzz-dark-grey/50 cursor-pointer"
                onClick={() => window.open(link.href, '_blank')}
              >
                <div className={`text-4xl text-zzz-${link.color}`}>{link.icon}</div>
                <span className="font-bold text-sm uppercase tracking-wider">{link.label}</span>
              </ZZZCard>
            ))}
          </div>

          {/* Upcoming Events */}
          <ZZZCard title="UPCOMING_EVENTS" accentColor="impact-orange" className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center min-h-[200px] border-dashed border-zzz-impact-orange/30">
            <div className="text-center opacity-50 mt-4">
              <p className="font-display text-2xl text-zzz-impact-orange animate-pulse">NO UPCOMING EVENTS DETECTED</p>
              <p className="font-mono text-sm mt-2 text-zzz-text-muted">SCANNING FOR NEW SIGNALS...</p>
            </div>
          </ZZZCard>

        </ZZZGrid>
      </section>

      <TapeDivider text="END OF TRANSMISSION // OKISO.NET //" direction="right" color="pink" />
    </div>
  );
}