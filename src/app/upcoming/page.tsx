"use client";

import { useEffect } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import GridPattern from "@/Components/MagicUI/GridPattern";

export default function UpcomingPage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, []);

  return (
    <div 
      data-premid-page="upcoming"
      className="w-full h-screen bg-ba-cream dark:bg-black relative overflow-hidden flex flex-col items-center justify-center selection:bg-ba-pink selection:text-white"
    >
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-ba-pink dark:hover:bg-ba-pink dark:hover:text-white transition-colors shadow-lg"
        >
          ← Back
        </Link>
      </div>

      {/* Releases Button */}
      <div className="absolute top-6 right-6 z-50">
        <Link
          href="/releases"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-ba-pink dark:hover:bg-ba-pink dark:hover:text-white transition-colors shadow-lg"
        >
          Releases →
        </Link>
      </div>

      {/* Kinetic Background Typography */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center overflow-hidden z-0 opacity-[0.05] dark:opacity-[0.08]">
        <GridPattern
          width={40}
          height={40}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:mix-blend-color-dodge opacity-50 [mask-image:linear-gradient(to_bottom,white,transparent)]"
        />
        <Marquee speed={30} gradient={false} autoFill>
          <h1 className="text-[20vw] leading-none font-black uppercase whitespace-nowrap px-8 text-black dark:text-white">
            COMING SOON
          </h1>
        </Marquee>
        <div className="-mt-[5vh]">
          <Marquee speed={30} direction="right" gradient={false} autoFill>
            <h1 className="text-[20vw] leading-none font-black uppercase whitespace-nowrap px-8 text-transparent stroke-black dark:stroke-white" style={{ WebkitTextStroke: '4px currentColor' }}>
              PRE RELEASE
            </h1>
          </Marquee>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-2xl border-4 border-black dark:border-white/20 p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(255,126,179,0.2)] text-center transform transition-transform hover:scale-[1.02]">
          
          <div className="inline-block bg-ba-pink text-white font-black uppercase tracking-widest px-4 py-1 rounded-full text-xs md:text-sm mb-6 animate-pulse shadow-[0_0_15px_rgba(255,126,179,0.5)]">
            STATUS: STANDBY
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 leading-none">
            Nothing Upcoming<br/><span className="text-black/30 dark:text-white/30">Right Now!</span>
          </h2>
          
          <p className="text-ba-muted dark:text-white/60 font-medium text-sm md:text-base max-w-md mx-auto mb-8">
            All releases are currently available. Stay tuned for future announcements, hidden teasers, and brand new music.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/releases" className="bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest px-8 py-4 rounded-full text-sm hover:bg-ba-pink dark:hover:bg-ba-pink dark:hover:text-white transition-colors">
              VIEW ARCHIVE
            </Link>
          </div>

        </div>
      </div>
      
    </div>
  );
}
