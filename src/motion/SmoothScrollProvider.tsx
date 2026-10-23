"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

let globalLenis: Lenis | null = null;
let globalWake: (() => void) | null = null;

export function getLenis(): Lenis | null {
  return globalLenis;
}

/** Starts the on-demand frame loop after a programmatic lenis.scrollTo(). */
export function wakeLenis(): void {
  globalWake?.();
}

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced motion and touch-first devices keep native scrolling. Lenis never
    // smooths touch here (syncTouch is off), but constructing it would still add
    // non-passive touch listeners that make every touch scroll wait on the main thread.
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)").matches) {
      return;
    }

    let raf = 0;
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.4,
      syncTouch: false,
      virtualScroll: () => { wake(); return true; },
    });

    // Frames run only while Lenis animates; an idle page schedules nothing.
    // Rouge noir's ScrollTrigger reads the native scroll events Lenis produces.
    let resumed = false;
    const tick = (time: number) => {
      // Lenis steps by the time since its previous tick. After an idle gap that clock
      // is stale and would finish the ease at once, so resume one frame back.
      if (resumed) {
        resumed = false;
        lenis.time = time - 1000 / 60;
      }
      lenis.raf(time);
      raf = lenis.isScrolling === "smooth" ? requestAnimationFrame(tick) : 0;
    };
    function wake() {
      if (raf) return;
      resumed = true;
      raf = requestAnimationFrame(tick);
    }

    globalLenis = lenis;
    globalWake = wake;
    window.__lenis = lenis;
    setLenisInstance(lenis);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      lenis.destroy();
      if (globalLenis === lenis) {
        globalLenis = null;
        globalWake = null;
      }
      if (window.__lenis === lenis) {
        window.__lenis = undefined;
      }
      setLenisInstance(null);
    };
  }, []);

  /* App Router client navigation does not reload the document, so Lenis keeps the
     old scroll offset. Reset hard on every route change. */
  useEffect(() => {
    const lenis = globalLenis;
    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
