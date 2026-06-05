"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let isHidden = true;
    let isText = false;
    let isHovering = false;

    // Track mouse position and visibility directly in DOM
    const updatePosition = (e: MouseEvent) => {
      if (isHidden) {
        isHidden = false;
        cursorEl.style.opacity = isText ? "0" : "1";
      }
      cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
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

      // Check for text inputs
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

        // Check for clickables
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

    window.addEventListener("mousemove", updatePosition, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Exclude touch devices
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
