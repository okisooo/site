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
