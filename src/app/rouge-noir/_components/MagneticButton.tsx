"use client";

import React, { useCallback, useRef } from "react";

/**
 * Magnetic, dimensional button/link. Pulls toward the cursor and lifts on
 * hover. Pointer-fine + no-reduced-motion only — touch/reduced users get a
 * plain, fully-accessible control with no transform logic attached.
 */
type Props = {
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  title?: string;
  children: React.ReactNode;
  strength?: number;
};

export default function MagneticButton({
  as = "button",
  href,
  target,
  rel,
  onClick,
  className = "",
  title,
  children,
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);

  const canMagnet = useCallback(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el || !canMagnet()) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
      });
    },
    [canMagnet, strength],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transform = "translate3d(0,0,0) scale(1)";
  }, []);

  const shared = {
    ref: ref as React.Ref<never>,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    title,
    className: `rn-magnetic will-change-transform ${className}`,
    style: { transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" },
  };

  if (as === "a") {
    return (
      <a href={href} target={target} rel={rel} {...shared}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" {...shared}>
      {children}
    </button>
  );
}
