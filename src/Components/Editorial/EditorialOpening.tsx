"use client";

import { useEffect, useRef } from "react";

function SleeveArtwork() {
  return <div className="ed-opening-composition">
    <div className="ed-opening-caption"><span>okiso / original music</span><span>VTuber & virtual artist</span></div>
    <div className="ed-opening-sketch"><img src="/art/sobu-640.webp" alt="" width="640" height="830" /></div>
    <div className="ed-opening-portrait"><img src="/art/suyosuyo-640.webp" alt="" width="640" height="1002" /></div>
    <div className="ed-opening-title">{"OKISO".split("").map((letter, index) => <span key={index} style={{ "--letter": index } as React.CSSProperties}>{letter}</span>)}<span className="ed-opening-arrow">↗</span></div>
    <div className="ed-opening-colophon"><span>art by suyosuyo & sobu · @sobsocks</span></div>
  </div>;
}

/** CSS owns the first-paint timeline, so hydration or slow artwork cannot extend it. */
export default function EditorialOpening({ onFinish }: { onFinish: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const finish = useRef(onFinish);
  finish.current = onFinish;

  useEffect(() => {
    const dismiss = () => finish.current();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || window.location.hash || window.scrollY > 20) {
      dismiss();
      return;
    }
    // If hydration arrives after the CSS finish, remove the already-hidden layer.
    const timeline = root.current?.getAnimations()[0];
    const elapsed = Number(timeline?.currentTime ?? 1900);
    const timeout = window.setTimeout(dismiss, Math.max(0, 1900 - elapsed));
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchmove", dismiss, { once: true, passive: true });
    preference.addEventListener("change", dismiss, { once: true });
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
      preference.removeEventListener("change", dismiss);
    };
  }, []);

  return <div ref={root} className="ed-opening" aria-hidden="true" onAnimationEnd={(event) => {
    if (event.target === event.currentTarget) finish.current();
  }}>
    <div className="ed-opening-half ed-opening-top"><SleeveArtwork /></div>
    <div className="ed-opening-half ed-opening-bottom"><SleeveArtwork /></div>
    <div className="ed-opening-seam" />
  </div>;
}
