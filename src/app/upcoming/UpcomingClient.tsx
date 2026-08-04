"use client";

import Link from "next/link";
import Marquee from "react-fast-marquee";
import { useScrollLock } from "@/motion/useScrollLock";
import { Archivo, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";

const tacDisplay = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-tac-display" });
const tacMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-mono" });
const tacCjk = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-tac-cjk" });

export default function UpcomingClient() {
  useScrollLock(true);

  return (
    <div 
      data-premid-page="upcoming"
      className={`${tacDisplay.variable} ${tacMono.variable} ${tacCjk.variable} w-full h-screen bg-[var(--tac-bone)] text-[var(--tac-ink)] dark:bg-[#0c0c0e] dark:text-[#f0f0ed] relative overflow-hidden flex flex-col items-center justify-center selection:bg-[var(--tac-signal)] selection:text-white transition-colors duration-500`}
    >
      {/* Drafting Scanlines */}
      <div className="tac-scanlines pointer-events-none z-0" />

      {/* Top Header Buttons */}
      <div className="absolute top-6 left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="pointer-events-auto">
            <Link
              href="/"
              className="tac-cta-ghost bg-[var(--tac-bone)] dark:bg-[#0c0c0e]"
            >
              ← Back
            </Link>
          </div>
          <div className="pointer-events-auto">
            <Link
              href="/releases"
              className="tac-cta"
            >
              Releases →
            </Link>
          </div>
        </div>
      </div>

      {/* Kinetic Background Typography */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center overflow-hidden z-0 opacity-10 dark:opacity-15">
        <Marquee speed={30} gradient={false} autoFill>
          <h1 className="text-[18vw] leading-none tac-display font-black uppercase whitespace-nowrap px-8 text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">
            COMING SOON //
          </h1>
        </Marquee>
        <div className="-mt-[4vh]">
          <Marquee speed={25} direction="right" gradient={false} autoFill>
            <h1 className="text-[18vw] leading-none tac-display font-black uppercase whitespace-nowrap px-8 text-transparent stroke-[var(--tac-ink)] dark:stroke-[var(--tac-bone)]" style={{ WebkitTextStroke: "2px currentColor" }}>
              PRE RELEASE QUEUE //
            </h1>
          </Marquee>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
        <div className="tac-plate tac-plate-mark bg-[var(--tac-bone)]/95 dark:bg-[#0c0c0e]/95 p-8 md:p-12 text-center w-full">
          
          <div className="flex justify-center mb-6">
            <div className="tac-chip">
              <span className="tac-dot" />
              STATUS: STANDBY // NO_ACTIVE_DROPS
            </div>
          </div>
          
          <div className="tac-sec-head justify-center mb-3">
            <span className="tac-sec-index">002</span>
            <span className="tac-rule" />
            <span className="tac-sec-label">Queue / 待機</span>
          </div>

          <h2 className="tac-h2 mb-4">
            Nothing Upcoming<br/>
            <span className="tac-h2-dim">Right Now!</span>
          </h2>
          
          <p className="tac-mono text-xs md:text-sm text-[var(--tac-steel)] max-w-md mx-auto mb-8 uppercase tracking-[0.15em] leading-relaxed">
            All releases are currently available in the archive. Stay tuned for future announcements, hidden teasers, and brand new music.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/releases" className="tac-cta">
              VIEW ARCHIVE →
            </Link>
          </div>

        </div>
      </div>
      
    </div>
  );
}
