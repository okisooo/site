"use client";

import { useEffect } from "react";

export function useEditorialMotion(pathname: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        // Keep content visible by default, including without JS or on fast scroll.
        const animation = entry.target.animate([
          { opacity: .55, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 620, delay: Math.min(order++ * 55, 165), easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
      }
    }, { threshold: .08 });

    document.querySelectorAll<HTMLElement>(".core-site :is(.ed-section-heading, .ed-release-card, .ed-art-sheet, .ed-art-intro, .ed-studio-invite, .ed-channels, .ed-footer-top)").forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
    });
    const stop = () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); };
    preference.addEventListener("change", stop);
    return () => { stop(); preference.removeEventListener("change", stop); };
  }, [pathname, enabled]);
}
