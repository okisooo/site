"use client";
/*
  Installed from https://reactbits.dev/ts/tailwind/
*/

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlassSurface from "@/Components/GlassSurface/GlassSurface";

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  // Dynamically set CSS variables for top/bottom bar height based on actual size
  useEffect(() => {
    const updateBarVars = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const h = Math.ceil(rect.height + 20);
      const root = document.documentElement;
      root.style.setProperty("--top-bar-height", `${h}px`);
      root.style.setProperty("--bottom-bar-height", `${Math.max(h, 72)}px`);
    };
    updateBarVars();
    const ro = new ResizeObserver(updateBarVars);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateBarVars);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateBarVars);
    };
  }, []);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number,
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  const createParticle = (
    i: number,
    t: number,
    d: [number, number],
    r: number,
  ) => {
    const rotate = noise(r / 10);
    const rotateValue = rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10;
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotateValue,
    };
  };
  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add("active");
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch { }
        }, t);
      }, 30);
    }
  };
  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    } as Partial<CSSStyleDeclaration>;
    Object.assign(filterRef.current.style, styles);
  };
  const navigateTo = (href: string) => {
    router.push(href);
  };
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    e.preventDefault();
    const anchorEl = e.currentTarget;
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(anchorEl);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle");
      particles.forEach((p) => filterRef.current!.removeChild(p));
      makeParticles(filterRef.current);
    }
    const href = items[index].href;
    setTimeout(() => navigateTo(href), Math.min(250, animationTime / 2));
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(
        {
          currentTarget: e.currentTarget,
          preventDefault: () => { },
        } as unknown as React.MouseEvent<HTMLAnchorElement>,
        index,
      );
    }
  };
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const anchors = navRef.current.querySelectorAll("a");
    const activeA = anchors[activeIndex] as HTMLElement;
    if (activeA) {
      updateEffectPosition(activeA);
    }
    const resizeObserver = new ResizeObserver(() => {
      const anchorsNow = navRef.current?.querySelectorAll("a");
      const curr = anchorsNow?.[activeIndex] as HTMLElement | undefined;
      if (curr) updateEffectPosition(curr);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);
  useEffect(() => {
    items.forEach((it) => {
      try { router.prefetch(it.href); } catch { }
    });
  }, [items, router]);

  return (
    <>
      <style>
        {`
          :root {
            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
          }
          .nav-list {
            display: flex; gap: 12px; list-style: none; margin: 0; padding: 2px 6px; position: relative; z-index: 3;
            font-family: var(--font-ui, system-ui, sans-serif);
            text-transform: uppercase; letter-spacing: 0.6px; font-weight: 700; font-size: 13px;
            color: rgba(255,255,255,0.95);
          }
          .nav-list li { position: relative; border-radius: 9999px; }
          .nav-list a {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 10px 14px; border-radius: 9999px; outline: none; text-align: center;
            line-height: 1; text-decoration: none; color: inherit;
          }
          .nav-list a:focus-visible { box-shadow: 0 0 0 2px rgba(255,0,122,0.4); }

          /* Active pill: extra transparent frosted glass */
          li.active { color: #fff; text-shadow: none; }
          li.active::after { opacity: 1; transform: scale(1); }
          li::after {
            content: ""; position: absolute; inset: 0; border-radius: 9999px;
            background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04));
            border: 1px solid rgba(255,255,255,.14);
            box-shadow: inset 0 1px 0 rgba(255,255,255,.28),
                        0 6px 16px -14px rgba(255,0,122,.3),
                        0 2px 6px -8px rgba(0,0,0,.45);
            opacity: 0; transform: scale(0.97); transition: all 0.3s ease; z-index: -1;
          }

          /* Gooey bubbles */
          .effect { position: absolute; opacity: 1; pointer-events: none; display: grid; place-items: center; z-index: 1; }
          .effect.filter { filter: blur(7px) contrast(100) blur(0); mix-blend-mode: screen; }
          .effect.filter::before { content: ""; position: absolute; inset: -60px; z-index: -2; background: transparent; }
          .effect.filter::after { content: ""; position: absolute; inset: 0; background: rgba(255,255,255,0.75); transform: scale(0); opacity: 0; z-index: -1; border-radius: 9999px; }
          .effect.active::after { animation: pill 0.3s ease both; }
          @keyframes pill { to { transform: scale(1); opacity: 1; } }

          .particle, .point { display: block; opacity: 0; width: 20px; height: 20px; border-radius: 9999px; transform-origin: center; }
          .particle { --time: 5s; position: absolute; top: calc(50% - 8px); left: calc(50% - 8px); animation: particle calc(var(--time)) ease 1 -350ms; }
          .point { background: var(--color); opacity: 1; animation: point calc(var(--time)) ease 1 -350ms; }
          @keyframes particle {
            0% { transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y))); opacity: 1; animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
            70% { transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2)); opacity: 1; animation-timing-function: ease; }
            85% { transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y))); opacity: 1; }
            100% { transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5)); opacity: 1; }
          }
          @keyframes point {
            0% { transform: scale(0); opacity: 0; animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
            25% { transform: scale(calc(var(--scale) * 0.25)); }
            38% { opacity: 1; }
            65% { transform: scale(var(--scale)); opacity: 1; animation-timing-function: ease; }
            85% { transform: scale(var(--scale)); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
          }
        `}
      </style>
      <div className="relative" ref={containerRef}>
        <GlassSurface
          className="relative inline-block"
          width="auto"
          height="auto"
          borderRadius={20}
          backgroundOpacity={0.01}
          saturation={1.6}
          brightness={70}
          blur={10}
          displace={1.2}
          distortionScale={-120}
          mixBlendMode="screen"
          style={{ padding: '6px 8px' }}
        >
          <nav className="relative" style={{ transform: "translate3d(0,0,0.01px)" }}>
            <ul ref={navRef} className="nav-list">
              {items.map((item, index) => (
                <li
                  key={index}
                  className={`relative cursor-pointer transition-[background-color,color,box-shadow] duration-300 ease text-white ${activeIndex === index ? "active" : ""}`}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="inline-flex items-center justify-center py-[0.6em] px-[1.1em] leading-none text-center"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span className="effect filter" ref={filterRef} />
        </GlassSurface>
      </div>
    </>
  );
};

export default GooeyNav;
