"use client";

import React, { useEffect, useRef } from "react";

/**
 * Parallax primitive for okiso.net
 * Scrub-driven y-axis translation via GSAP ScrollTrigger.
 * 
 * Motion/A11y contract:
 * - Content is VISIBLE by default.
 * - Respects prefers-reduced-motion (no parallax transform applied).
 * - Animates ONLY transform (yPercent).
 * - Cleans up cleanly on unmount with gsap.context revert.
 */
export interface ParallaxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  speed?: number; // Speed factor: e.g. -0.2 moves upward, 0.2 moves downward
  children: React.ReactNode;
  className?: string;
}

export function Parallax({
  as: Component = "div",
  speed = -0.15,
  children,
  className = "",
  ...props
}: ParallaxProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    async function initParallax() {
      try {
        const gsapModule = await import("gsap");
        const stModule = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default || gsapModule;
        const ScrollTrigger = stModule.ScrollTrigger || stModule.default;

        if (cancelled || !ref.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const el = ref.current;
        const yDist = speed * 100;

        ctx = gsap.context(() => {
          gsap.fromTo(
            el,
            { yPercent: -yDist / 2 },
            {
              yPercent: yDist / 2,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }, ref);
      } catch {
        // Leave element as normal if animation fails to initialize
      }
    }

    initParallax();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [speed]);

  return React.createElement(
    Component,
    {
      ref,
      className: `will-change-transform ${className}`,
      ...props,
    },
    children
  );
}

export default Parallax;
