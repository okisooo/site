"use client";

import { useCallback } from "react";
import { getLenis, useLenis } from "./SmoothScrollProvider";

export interface ScrollToOptions {
  offset?: number;
}

export function useScrollTo() {
  const lenisFromContext = useLenis();

  return useCallback(
    (target: string | HTMLElement, opts?: ScrollToOptions) => {
      if (typeof window === "undefined") return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const lenis = lenisFromContext || getLenis();

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, {
          offset: opts?.offset ?? -80,
          duration: 1.1,
        });
      } else {
        let el: HTMLElement | null = null;
        if (typeof target === "string") {
          const id = target.startsWith("#") ? target.slice(1) : target;
          el = document.getElementById(id) || document.querySelector<HTMLElement>(target);
        } else {
          el = target;
        }

        if (el) {
          el.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      }
    },
    [lenisFromContext]
  );
}
