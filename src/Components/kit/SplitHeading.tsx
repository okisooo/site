"use client";

import React, { useEffect, useRef } from "react";

/**
 * SplitHeading primitive for okiso.net
 * Splits text into individual character spans and cascades them in using GSAP.
 * 
 * Motion/A11y contract:
 * - Full heading text remains accessible to screen readers via aria-label on wrapper.
 * - Character spans have aria-hidden="true".
 * - Text is VISIBLE by default. Characters are only hidden by GSAP after loading.
 * - Animates ONLY transform and opacity.
 */
export interface SplitHeadingProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  as?: React.ElementType;
  trigger?: "mount" | "scroll";
  accentIndex?: number | number[];
  className?: string;
}

export function SplitHeading({
  text,
  as: Component = "h2",
  trigger = "scroll",
  accentIndex,
  className = "",
  ...props
}: SplitHeadingProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const accentIndices = Array.isArray(accentIndex)
    ? accentIndex
    : typeof accentIndex === "number"
    ? [accentIndex]
    : [];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    async function initSplit() {
      try {
        const gsapModule = await import("gsap");
        const stModule = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default || gsapModule;
        const ScrollTrigger = stModule.ScrollTrigger || stModule.default;

        if (cancelled || !containerRef.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const el = containerRef.current;
        const charSpans = el.querySelectorAll<HTMLElement>("[data-kit-char]");
        if (charSpans.length === 0) return;

        ctx = gsap.context(() => {
          // Armed rule: set initial state inside GSAP context only
          gsap.set(charSpans, { opacity: 0, y: "0.4em" });

          gsap.to(charSpans, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.025,
            ease: "power3.out",
            scrollTrigger:
              trigger === "scroll"
                ? {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                  }
                : undefined,
          });
        }, containerRef);
      } catch {
        // Fallback: stay visible if dynamic import/GSAP fails
      }
    }

    initSplit();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [trigger, text]);

  const characters = Array.from(text);

  return React.createElement(
    Component,
    {
      ref: containerRef,
      "aria-label": text,
      className: `inline-block ${className}`,
      ...props,
    },
    <span aria-hidden="true" className="inline-block">
      {characters.map((char, i) => {
        const isAccent = accentIndices.includes(i);
        return (
          <span
            key={`${char}-${i}`}
            data-kit-char
            className={`inline-block whitespace-pre ${
              isAccent ? "text-accent" : ""
            }`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}

export default SplitHeading;
