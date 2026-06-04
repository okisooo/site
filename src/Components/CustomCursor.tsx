"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Hidden until mouse moves
  const [isTextHover, setIsTextHover] = useState(false);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    const updatePosition = (e: MouseEvent) => {
      // Show cursor on first mouse move
      if (isHidden) setIsHidden(false);
      
      // Hardware-accelerated 0-lag position updates
      cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
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
        setIsTextHover(true);
        setIsHovering(false);
      } else {
        setIsTextHover(false);
        // Detect clickables (links, buttons, styled clickables)
        if (
          target.tagName.toLowerCase() === "a" ||
          target.tagName.toLowerCase() === "button" ||
          target.closest("a") ||
          target.closest("button") ||
          target.classList.contains("clickable") ||
          target.classList.contains("cursor-pointer") ||
          target.style.cursor === "pointer"
        ) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
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
  }, [isHidden]);

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] w-8 h-8 transition-opacity duration-200"
      style={{
        transform: "translate3d(-100px, -100px, 0)", // offscreen initially
        opacity: isHidden || isTextHover ? 0 : 1,
        willChange: "transform",
      }}
    >
      <img
        src={isHovering ? "/cursors/link.gif" : "/cursors/pointer.gif"}
        alt=""
        className="w-full h-full object-contain"
        style={{
          imageRendering: "pixelated", // Keep the cursor pixel art crisp
        }}
      />
    </div>
  );
}
