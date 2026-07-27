"use client";

import { useEffect } from "react";
import { getLenis, useLenis } from "./SmoothScrollProvider";

/**
 * The app's single owner of scroll locking. Nothing else may write
 * document.body.style.overflow (see docs/FRAMEWORK.md §5 step 7).
 *
 * Locking has two paths — Lenis if the runtime is up, an inline overflow on
 * <html> otherwise (reduced-motion users, or a mount that happens before the
 * provider's effect has run). The unlock MUST undo whichever path was actually
 * taken, tracked per-effect. An earlier version chose the unlock branch by
 * re-checking for Lenis at cleanup time: a component that locked before Lenis
 * existed, then unmounted after it existed, took the Lenis branch and left the
 * inline `overflow: hidden` on <html> forever — scrolling stayed dead site-wide
 * after leaving /upcoming. Keep the two paths symmetric.
 */
export function useScrollLock(locked: boolean): void {
  const lenisFromContext = useLenis();

  useEffect(() => {
    if (!locked || typeof window === "undefined") return;

    const lenis = lenisFromContext || getLenis();
    const docEl = document.documentElement;

    // Remember exactly what we changed, so cleanup is unambiguous.
    let stoppedLenis = false;
    let prevInlineOverflow: string | null = null;

    if (lenis) {
      lenis.stop();
      stoppedLenis = true;
    } else {
      prevInlineOverflow = docEl.style.overflow;
      docEl.style.overflow = "hidden";
    }

    return () => {
      if (stoppedLenis) {
        // Prefer the same instance; fall back to whatever is current in case the
        // provider remounted underneath us (React 19 StrictMode).
        (lenis || getLenis())?.start();
      }
      if (prevInlineOverflow !== null) {
        docEl.style.overflow = prevInlineOverflow;
      }
      // Belt and braces: never leave <html> stuck in a non-scrollable state.
      if (docEl.style.overflow === "hidden" && !getLenis()?.isStopped) {
        docEl.style.overflow = "";
      }
    };
  }, [locked, lenisFromContext]);
}
