"use client";

import React, { useEffect, useRef } from "react";

/**
 * CountUp primitive for okiso.net
 * Counts up from a starting value to a target number on scroll enter.
 * 
 * Motion/A11y contract:
 * - Renders the final target value in static HTML so non-JS & reduced-motion readers see the actual number.
 * - Respects prefers-reduced-motion by skipping numeric animation.
 * - Cleans up GSAP scroll triggers on unmount.
 */
export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  ...props
}: CountUpProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const format = (num: number) => {
    return `${prefix}${num.toFixed(decimals)}${suffix}`;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    async function initCount() {
      try {
        const gsapModule = await import("gsap");
        const stModule = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default || gsapModule;
        const ScrollTrigger = stModule.ScrollTrigger || stModule.default;

        if (cancelled || !spanRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const el = spanRef.current;
        const obj = { value: from };

        ctx = gsap.context(() => {
          gsap.to(obj, {
            value: to,
            duration,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              if (el) {
                el.textContent = format(obj.value);
              }
            },
          });
        }, spanRef);
      } catch {
        // On error, the rendered static text already shows the target value
      }
    }

    initCount();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [to, from, duration, decimals, prefix, suffix]);

  return (
    <span ref={spanRef} className={`font-mono ${className}`} {...props}>
      {format(to)}
    </span>
  );
}

export default CountUp;
