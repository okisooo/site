"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import UrbanCard from "@/Components/Urban/UrbanCard";
import TapeDivider from "@/Components/Urban/TapeDivider";
import TechOverlay from "@/Components/Urban/TechOverlay";
import VerticalText from "@/Components/Urban/VerticalText";
import {
  FaSpotify,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaDiscord,
  FaBandcamp,
  FaTwitch,
} from "react-icons/fa";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);

  const socialLinks: { icon: React.ReactNode; label: string; href: string; color: "yellow" | "pink" | "cyan" | "orange" }[] = [
    { icon: <FaSpotify size={24} />, label: "Spotify", href: "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm", color: "yellow" },
    { icon: <FaYoutube size={24} />, label: "YouTube", href: "https://www.youtube.com/@okiso7", color: "pink" },
    { icon: <FaTwitter size={24} />, label: "Twitter", href: "https://x.com/okisooo_", color: "cyan" },
    { icon: <FaInstagram size={24} />, label: "Instagram", href: "https://www.instagram.com/okisooo_/", color: "orange" },
    { icon: <FaGithub size={24} />, label: "GitHub", href: "https://github.com/okisooo", color: "pink" },
    { icon: <FaDiscord size={24} />, label: "Discord", href: "https://discord.gg/okiso", color: "cyan" },
    { icon: <FaBandcamp size={24} />, label: "Bandcamp", href: "https://okiso.bandcamp.com/", color: "yellow" },
    { icon: <FaTwitch size={24} />, label: "Twitch", href: "https://twitch.tv/okiso7", color: "pink" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Hero Entrance
      tl.from(charRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          titleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        )
        .from(
          statsRef.current?.children || [],
          {
            x: -50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full pb-20 overflow-x-hidden bg-urban-black text-urban-white selection:bg-neon-cyan selection:text-black">
      <TechOverlay />

      {/* Hero Section - Character Select Style */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('https://i.imgur.com/pM8llz7.gif')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-urban-black via-transparent to-urban-black" />
        <div className="absolute inset-0 bg-halftone opacity-10" />

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">
          {/* Left: Stats & Info */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div ref={statsRef} className="space-y-4">
              <div className="bg-urban-dark/80 border-l-4 border-neon-cyan p-4 backdrop-blur-sm transform -skew-x-12">
                <h3 className="text-neon-cyan font-display text-xl transform skew-x-12">ROLE</h3>
                <p className="text-2xl font-bold transform skew-x-12">PRODUCER</p>
              </div>
              <div className="bg-urban-dark/80 border-l-4 border-neon-magenta p-4 backdrop-blur-sm transform -skew-x-12 ml-8">
                <h3 className="text-neon-magenta font-display text-xl transform skew-x-12">CLASS</h3>
                <p className="text-2xl font-bold transform skew-x-12">VTUBER</p>
              </div>
              <div className="bg-urban-dark/80 border-l-4 border-neon-orange p-4 backdrop-blur-sm transform -skew-x-12">
                <h3 className="text-neon-orange font-display text-xl transform skew-x-12">AFFILIATION</h3>
                <p className="text-2xl font-bold transform skew-x-12">OKISO.NET</p>
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
                  alt="OKISO Character - Vocaloid Producer Avatar"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Subtle Back Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-50 blur-3xl -z-10" />

              <h1 ref={titleRef} className="absolute bottom-10 text-[12vw] lg:text-[8vw] leading-none font-display font-black text-white tracking-tighter z-20 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Release */}
          <UrbanCard
            title="LATEST DROP"
            category="MUSIC"
            accentColor="pink"
            className="col-span-1 md:col-span-2 lg:col-span-2 min-h-[300px] flex flex-col justify-end bg-[url('https://i.imgur.com/pM8llz7.gif')] bg-cover bg-center"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-urban-black via-urban-black/50 to-transparent opacity-90" />
            <div className="relative z-10">
              <h2 className="text-5xl font-display font-bold text-white mb-2 drop-shadow-lg">CRYDIE</h2>
              <p className="text-urban-white/90 mb-6 max-w-md text-lg font-medium">
                New single out now. Experience the digital despair.
              </p>
              <button className="bg-neon-pink text-white font-bold py-3 px-8 clip-diagonal hover:bg-neon-pink/80 transition-colors border-2 border-white/20">
                LISTEN NOW
              </button>
            </div>
          </UrbanCard>

          {/* Social Grid */}
          <div className="grid grid-cols-2 gap-4">
            {socialLinks.slice(0, 4).map((link) => (
              <UrbanCard
                key={link.label}
                category="LINK"
                accentColor={link.color}
                className="aspect-square flex flex-col items-center justify-center gap-2"
                href={link.href}
              >
                <div className={`text-4xl text-${link.color === 'cyan' ? 'neon-cyan' : link.color === 'orange' ? 'neon-orange' : `urban-${link.color}`}`}>{link.icon}</div>
                <span className="font-bold text-sm uppercase tracking-wider">{link.label}</span>
              </UrbanCard>
            ))}
          </div>

          {/* About / Bio */}
          <UrbanCard title="PROFILE" category="Db" accentColor="cyan" className="col-span-1 md:col-span-1">
            <p className="text-urban-white/80 leading-relaxed font-ui">
              OKISO is a digital entity creating electronic soundscapes in the void.
              Specializing in Vocaloid production and virtual performance.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["EDM", "PRODUCER", "VTUBER", "CYBERPUNK"].map((tag) => (
                <span key={tag} className="text-xs font-mono border border-neon-cyan text-neon-cyan px-2 py-1 bg-neon-cyan/10">
                  {tag}
                </span>
              ))}
            </div>
          </UrbanCard>

          {/* More Socials */}
          <div className="grid grid-cols-2 gap-4">
            {socialLinks.slice(4).map((link) => (
              <UrbanCard
                key={link.label}
                category="LINK"
                accentColor={link.color}
                className="aspect-square flex flex-col items-center justify-center gap-2"
                href={link.href}
              >
                <div className={`text-4xl text-${link.color === 'cyan' ? 'neon-cyan' : link.color === 'orange' ? 'neon-orange' : `urban-${link.color}`}`}>{link.icon}</div>
                <span className="font-bold text-sm uppercase tracking-wider">{link.label}</span>
              </UrbanCard>
            ))}
          </div>

          {/* Placeholder for Upcoming */}
          <UrbanCard title="UPCOMING" category="EVT" accentColor="orange" className="col-span-1 md:col-span-2 flex items-center justify-center border-dashed border-neon-orange/30">
            <div className="text-center opacity-50">
              <p className="font-mono text-xl text-neon-orange">NO UPCOMING EVENTS DETECTED</p>
              <p className="text-sm mt-2">STAY TUNED FOR UPDATES</p>
            </div>
          </UrbanCard>

        </div>
      </section>

      <TapeDivider text="END OF TRANSMISSION // OKISO.NET //" direction="right" color="pink" />
    </div>
  );
}