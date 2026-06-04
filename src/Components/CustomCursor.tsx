"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Only show after initial mouse move

  // Smooth springs for the cursor
  const cursorX = useSpring(mousePosition.x, { stiffness: 150, damping: 15, mass: 0.1 });
  const cursorY = useSpring(mousePosition.y, { stiffness: 150, damping: 15, mass: 0.1 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16); // Center the 32x32 cursor (16px offset)
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Expand cursor when hovering over clickable elements
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("clickable") ||
        target.style.cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Hide entirely on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <>
      {/* The glowing trailing circle (following pointer) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border"
        style={{
          x: cursorX,
          y: cursorY,
          width: 32,
          height: 32,
        }}
        animate={{
          scale: isHovering ? 1.6 : 1,
          borderColor: isHovering ? "#FF7EB3" : "#7CC8F8",
          backgroundColor: isHovering ? "rgba(255, 126, 179, 0.15)" : "rgba(124, 200, 248, 0.05)",
          boxShadow: isHovering 
            ? "0 0 20px rgba(255, 126, 179, 0.5), inset 0 0 8px rgba(255, 126, 179, 0.2)" 
            : "0 0 12px rgba(124, 200, 248, 0.3), inset 0 0 6px rgba(124, 200, 248, 0.1)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.2 }}
      />
    </>
  );
}
