"use client";

import React, { useEffect, useRef } from "react";

/**
 * Reveal primitive for okiso.net
 * Scroll-triggered fade & rise animation using GSAP.
 * 
 * Motion/A11y contract:
 * - ARMED RULE: Content is VISIBLE by default. It is only hidden by GSAP AFTER GSAP loads.
 * - If JS fails, GSAP load fails, or prefers-reduced-motion is enabled, content remains 100% visible.
 * - Animates ONLY transform (y) and opacity.
 * - Cleans up properly on unmount via gsap.context revert.
 */
export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  y?: number;
  delay?: number;
  stagger?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export function Reveal({
  as: Component = "div",
  y = 34,
  delay = 0,
  stagger = 0,
  duration = 0.8,
  children,
  className = "",
  ...props
}: RevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    async function initAnimation() {
      try {
        const gsapModule = await import("gsap");
        const stModule = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default || gsapModule;
        const ScrollTrigger = stModule.ScrollTrigger || stModule.default;

        if (cancelled || !containerRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const el = containerRef.current;
        const targets =
          stagger > 0 && el.children.length > 0
            ? Array.from(el.children)
            : [el];

        ctx = gsap.context(() => {
          // Hide targets only AFTER GSAP is ready (ARMED RULE)
          gsap.set(targets, { opacity: 0, y });

          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration,
            delay,
            stagger: stagger > 0 ? stagger : undefined,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        }, containerRef);
      } catch {
        // If GSAP fails to load, content stays in its original visible state.
      }
    }

    initAnimation();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [y, delay, stagger, duration]);

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className,
      ...props,
    },
    children
  );
}

export default Reveal;
