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

export function getLenis(): Lenis | null {
  return globalLenis;
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

    // Bail out entirely when prefers-reduced-motion is requested
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let fallbackRaf = 0;
    let gsapTickerRaf: ((time: number) => void) | null = null;
    let loadedGsap: typeof import("gsap").default | null = null;
    let loadedScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;
    let scrollTriggerUpdateHandler: ((...args: unknown[]) => void) | null = null;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.4,
      syncTouch: false,
    });

    globalLenis = lenis;
    window.__lenis = lenis;
    setLenisInstance(lenis);

    const setupBridge = async () => {
      try {
        const gsapModule = await import("gsap");
        const stModule = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default || gsapModule;
        const ScrollTrigger = stModule.ScrollTrigger || stModule.default;

        gsap.registerPlugin(ScrollTrigger);

        if (cancelled) return;

        loadedGsap = gsap;
        loadedScrollTrigger = ScrollTrigger;

        // Lenis smooths native window scroll which ScrollTrigger already observes.
        // ScrollTrigger.scrollerProxy is intentionally NOT called.
        scrollTriggerUpdateHandler = ScrollTrigger.update;
        lenis.on("scroll", scrollTriggerUpdateHandler);

        gsapTickerRaf = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(gsapTickerRaf);
        gsap.ticker.lagSmoothing(0);

        if (typeof document !== "undefined" && document.fonts?.ready) {
          document.fonts.ready
            .then(() => {
              if (!cancelled && ScrollTrigger) {
                ScrollTrigger.refresh();
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        // CRITICAL: we constructed Lenis with autoRaf:false because GSAP's ticker
        // was supposed to drive it. If the import failed there is no driver at
        // all — Lenis would swallow wheel events and never animate, leaving the
        // page UNSCROLLABLE. Fall back to our own RAF loop so scrolling always
        // works; only the ScrollTrigger sync is lost.
        console.warn("GSAP bridge unavailable; driving Lenis with a local RAF loop:", err);
        const loop = (time: number) => {
          if (cancelled) return;
          lenis.raf(time);
          fallbackRaf = requestAnimationFrame(loop);
        };
        fallbackRaf = requestAnimationFrame(loop);
      }
    };

    setupBridge();

    return () => {
      cancelled = true;
      if (fallbackRaf) cancelAnimationFrame(fallbackRaf);
      if (loadedGsap && gsapTickerRaf) {
        loadedGsap.ticker.remove(gsapTickerRaf);
      }
      if (loadedScrollTrigger && scrollTriggerUpdateHandler) {
        lenis.off("scroll", scrollTriggerUpdateHandler);
      }
      lenis.destroy();
      if (globalLenis === lenis) {
        globalLenis = null;
      }
      if (window.__lenis === lenis) {
        window.__lenis = undefined;
      }
      setLenisInstance(null);
    };
  }, []);

  /* App Router client navigation does not reload the document, so Lenis keeps the
     old scroll offset and every ScrollTrigger keeps start/end values measured
     against the PREVIOUS route's layout — which is what makes pinned sections
     fire at the wrong place after navigating. Reset hard, then re-measure once
     the new route has painted. */
  useEffect(() => {
    const lenis = globalLenis;
    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }
    lenis.scrollTo(0, { immediate: true, force: true });
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        (window as unknown as { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger?.refresh();
        import("gsap/ScrollTrigger")
          .then((m) => m.ScrollTrigger?.refresh())
          .catch(() => {});
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
