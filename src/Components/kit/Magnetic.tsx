"use client";

import React, { useCallback, useRef } from "react";

/**
 * Magnetic primitive for okiso.net
 * Generalized dimensional button/link element that pulls toward pointer on hover.
 * 
 * Motion/A11y contract:
 * - Pointer-fine + no-reduced-motion ONLY. Touch and reduced-motion users get static controls.
 * - Transform-only animations, throttled via requestAnimationFrame.
 * - Maintains accessible focus-visible ring for keyboard users.
 */
export interface MagneticProps extends React.HTMLAttributes<HTMLElement> {
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  title?: string;
  children: React.ReactNode;
  strength?: number;
  type?: "button" | "submit" | "reset";
}

export function Magnetic({
  as = "button",
  href,
  target,
  rel,
  onClick,
  className = "",
  title,
  children,
  strength = 0.35,
  type = "button",
  ...props
}: MagneticProps) {
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
    (e: React.MouseEvent<HTMLElement>) => {
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
    [canMagnet, strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transform = "translate3d(0,0,0) scale(1)";
  }, []);

  const focusRingClasses =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0";

  const sharedProps = {
    ref: ref as React.Ref<never>,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    title,
    className: `will-change-transform transition-transform duration-500 ease-out-expo ${focusRingClasses} ${className}`,
    ...props,
  };

  if (as === "a") {
    return (
      <a href={href} target={target} rel={rel} {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} {...sharedProps}>
      {children}
    </button>
  );
}

export default Magnetic;
