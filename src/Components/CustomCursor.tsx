"use client";

import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    // Avoid running on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const TOTAL_FRAMES = 12;
    const FRAME_DURATION = 80; // 80ms frame rate (~12.5 FPS) matches original GIFs
    let frame = 0;

    // Preload PNG frames to prevent browser fetching flickers/blank states
    const preloadedImages: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const imgPointer = new Image();
      imgPointer.src = `/cursors/frames/pointer_${i}.png`;
      preloadedImages.push(imgPointer);

      const imgLink = new Image();
      imgLink.src = `/cursors/frames/link_${i}.png`;
      preloadedImages.push(imgLink);
    }

    // Interval to cycle frames by updating document-level CSS variables
    // This drives hardware-accelerated, native animated cursors at the browser-compositor level (0ms lag)
    const intervalId = setInterval(() => {
      frame = (frame + 1) % TOTAL_FRAMES;
      
      document.documentElement.style.setProperty(
        "--cursor-pointer",
        `url('/cursors/frames/pointer_${frame}.png') 0 0, auto`
      );
      document.documentElement.style.setProperty(
        "--cursor-link",
        `url('/cursors/frames/link_${frame}.png') 0 0, pointer`
      );
    }, FRAME_DURATION);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return null; // Zero DOM elements rendered, preventing any layout/reflow overhead
}
