"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

export const AmbientMotionContext = createContext(false);
const Waves = dynamic(() => import("@/Backgrounds/Waves/Waves"), { ssr: false });

export function useAmbientPreference(pathname: string) {
  const [paused, setPaused] = useState(false);
  // Unknown until mounted: motion stays off, but the server never renders a "reduced" state for everyone.
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion(); updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);
  const enabled = !paused && reduced === false && visible;
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => target.toggleAttribute("data-idle-active", isIntersecting));
    });
    const elements = document.querySelectorAll(".core-site .ed-idle");
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); elements.forEach((element) => element.removeAttribute("data-idle-active")); };
  }, [enabled, pathname]);
  return { enabled, paused, reduced: reduced === true, setPaused };
}

/** Save-Data and 2g/3g connections skip optional media: the art-room tour, animated thumbnails, the hero model. */
export function prefersLightData() {
  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
  return !!connection?.saveData || /(^|slow-)2g|3g/.test(connection?.effectiveType ?? "");
}

// Animated thumbnails swap in after the page has loaded and gone idle, never during first paint.
let motionAssetsReady = false;
export function useMotionAssetsReady() {
  const [ready, setReady] = useState(motionAssetsReady);
  useEffect(() => {
    if (ready || prefersLightData()) return;
    let cancel = () => {};
    const schedule = () => {
      const done = () => { motionAssetsReady = true; setReady(true); };
      if ("requestIdleCallback" in window) { const idle = window.requestIdleCallback(done, { timeout: 3000 }); cancel = () => window.cancelIdleCallback(idle); }
      else { const timeout = setTimeout(done, 200); cancel = () => clearTimeout(timeout); }
    };
    if (document.readyState === "complete") schedule(); else window.addEventListener("load", schedule, { once: true });
    return () => { window.removeEventListener("load", schedule); cancel(); };
  }, [ready]);
  return ready;
}

export function useAmbientVisibility() {
  const enabled = useContext(AmbientMotionContext);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, active: enabled && inView };
}

export function AmbientWaves() {
  const { ref, active } = useAmbientVisibility();
  return <div ref={ref} className="ed-ambient-band" aria-hidden="true">
    <div className="ed-ambient-band-still" />
    {active && <Waves className="ed-ambient-waves" lineColor="rgba(204,0,0,.24)" waveSpeedX={.004} waveSpeedY={.002}
      waveAmpX={12} waveAmpY={10} xGap={38} yGap={24} maxCursorMove={22} />}
  </div>;
}
