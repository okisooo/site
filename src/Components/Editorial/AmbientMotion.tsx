"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

export const AmbientMotionContext = createContext(false);
const Waves = dynamic(() => import("@/Backgrounds/Waves/Waves"), { ssr: false });

export function useAmbientPreference(pathname: string) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
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
  const enabled = !paused && !reduced && visible;
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => target.toggleAttribute("data-idle-active", isIntersecting));
    });
    const elements = document.querySelectorAll(".core-site .ed-idle");
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); elements.forEach((element) => element.removeAttribute("data-idle-active")); };
  }, [enabled, pathname]);
  return { enabled, paused, reduced, setPaused };
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

export function AmbientArtwork({ hero = false }: { hero?: boolean }) {
  return <div className={`ed-ambient-artwork ed-idle ${hero ? "ed-hero-artwork" : "ed-page-artwork"}`} aria-hidden="true">
    <svg className="ed-kinetic-lines ed-kinetic-layer" viewBox="0 0 1200 800" fill="none" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 13 }, (_, index) => <path key={index} d={`M -100 ${170 + index * 25} C 260 ${-120 + index * 32}, 590 ${880 - index * 14}, 1300 ${270 + index * 26}`} />)}
    </svg>
    <svg className="ed-kinetic-mark ed-kinetic-layer" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="103" strokeWidth="1.5" strokeDasharray="255 35 50 25 95 55" />
      <circle cx="120" cy="120" r="82" strokeWidth="1" strokeDasharray="110 30 30 35" />
      <path d="M120 65v110M65 120h110M81 81l78 78M81 159l78-78" strokeWidth="8" />
      <circle cx="120" cy="120" r="12" fill="currentColor" stroke="none" />
    </svg>
    <span className="ed-kinetic-stripes ed-kinetic-layer" />
  </div>;
}
