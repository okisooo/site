"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let isHidden = true;
    let isText = false;
    let isHovering = false;
    let rafId: number;

    // Track mouse coordinates passively (no layout thrashing)
    const updatePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (isHidden) {
        isHidden = false;
        cursorEl.style.opacity = isText ? "0" : "1";
      }
    };

    // Update position precisely matched to monitor refresh rate via RequestAnimationFrame
    // This protects performance on high-polling gaming mice (1000Hz+) and low-end devices
    const tick = () => {
      cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    const handleMouseLeave = () => {
      isHidden = true;
      cursorEl.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isHidden = false;
      cursorEl.style.opacity = isText ? "0" : "1";
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Detect if user is hovering over text fields/inputs
      const isTextInput =
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "textarea" ||
        target.closest("[contenteditable='true']");

      if (isTextInput) {
        isText = true;
        cursorEl.style.opacity = "0";
      } else {
        isText = false;
        if (!isHidden) cursorEl.style.opacity = "1";

        // Detect clickables
        const isClickable =
          target.tagName.toLowerCase() === "a" ||
          target.tagName.toLowerCase() === "button" ||
          target.closest("a") ||
          target.closest("button") ||
          target.classList.contains("clickable") ||
          target.classList.contains("cursor-pointer") ||
          target.style.cursor === "pointer";

        if (isClickable) {
          if (!isHovering) {
            isHovering = true;
            cursorEl.classList.add("hovering");
          }
        } else {
          if (isHovering) {
            isHovering = false;
            cursorEl.classList.remove("hovering");
          }
        }
      }
    };

    // Use passive event listeners for scrolling and movement performance
    window.addEventListener("mousemove", updatePosition, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Start the animation frame update loop
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Exclude touch devices entirely
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] w-8 h-8 transition-opacity duration-150"
      style={{
        transform: "translate3d(-100px, -100px, 0)", // offscreen initially
        opacity: 0,
        willChange: "transform",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Standard cursor */}
      <img
        src="/cursors/pointer.gif"
        alt=""
        className="absolute inset-0 w-full h-full object-contain block [.hovering_&]:hidden"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Link hover cursor */}
      <img
        src="/cursors/link.gif"
        alt=""
        className="absolute inset-0 w-full h-full object-contain hidden [.hovering_&]:block"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
