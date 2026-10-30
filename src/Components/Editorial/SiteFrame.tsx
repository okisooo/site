"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { MusicPlayer } from "@/Components/MusicPlayer";
import { ThemeToggle } from "@/Components/ThemeToggle";
import AnimatedGrid from "@/Components/Backgrounds/AnimatedGrid";
import { usesEditorialDesign } from "@/lib/siteDesign";
import { getLenis } from "@/motion/SmoothScrollProvider";
import { useScrollLock } from "@/motion/useScrollLock";
import { EditorialDialog } from "./EditorialDialog";
import EditorialMusicPlayer from "./EditorialMusicPlayer";
import EditorialOpening from "./EditorialOpening";
import { useEditorialMotion } from "./useEditorialMotion";
import { AmbientMotionContext, AmbientWaves, useAmbientPreference } from "./AmbientMotion";
import BrandField from "./BrandField";

const destinations = [
  { href: "/releases", label: "releases" },
  { href: "/vault", label: "vault" },
  { href: "/gallery", label: "gallery" },
  { href: "/downloads", label: "art previews" },
  { href: "/upcoming", label: "upcoming" },
  { href: "/about", label: "about" },
  { href: "/links", label: "links" },
];

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"contact" | "content terms" | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [opening, setOpening] = useState(() => pathname === "/");
  const [openingTake, setOpeningTake] = useState(0);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const editorial = usesEditorialDesign(pathname);
  const ambient = useAmbientPreference(pathname);
  useEditorialMotion(pathname, editorial);
  useScrollLock(menuOpen);

  useEffect(() => { setMenuOpen(false); if (pathname !== "/") setOpening(false); }, [pathname]);

  // The scroll provider resets to the top on every route, so a /#watch arrival lands on its section afterwards.
  useEffect(() => {
    const target = window.location.hash.length > 1 && document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const frame = requestAnimationFrame(() => { const lenis = getLenis(); if (!lenis) return target.scrollIntoView(); lenis.resize(); lenis.scrollTo(target, { immediate: true, force: true }); });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setMenuOpen(false); };
    // Rotating or widening past the phone layout hides the menu button, so the menu (and its scroll lock) closes.
    const phone = window.matchMedia("(max-width: 850px)");
    const leave = () => { if (!phone.matches) setMenuOpen(false); };
    window.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    phone.addEventListener("change", leave);
    return () => { window.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); phone.removeEventListener("change", leave); };
  }, [menuOpen]);

  function replayOpening() {
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpeningTake((take) => take + 1);
    setOpening(true);
  }

  async function copyDiscord() {
    try { await navigator.clipboard.writeText(".oxo"); setCopyMessage("discord handle copied"); }
    catch { setCopyMessage("couldn’t copy — the handle is .oxo"); }
  }

  if (!editorial) return <>
    <AnimatedGrid />
    <main id="main-content" className="relative z-[1] min-h-screen">{children}</main>
    <MusicPlayer /><ThemeToggle />
  </>;

  return <AmbientMotionContext.Provider value={ambient.enabled}><div className="core-site" data-opening={opening || undefined} data-ambient-motion={ambient.enabled}>
    <div className="ed-site-background" aria-hidden="true"><BrandField home={pathname === "/" || pathname === "/lab/soft-orbit"} /></div>
    {opening && <EditorialOpening key={openingTake} onFinish={() => setOpening(false)} />}
    <header ref={header} className="ed-nav" data-editorial-background onBlur={(event) => { if (menuOpen && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false); }}>
      <Link href="/" className="ed-logo" aria-label="OKISO home" onClick={() => setMenuOpen(false)}>okiso<span aria-hidden="true">↗</span></Link>
      <span className="ed-nav-caption">music & other things</span>
      <nav aria-label="Main navigation" className="ed-nav-links">
        {destinations.map(({ href, label }) => <Link key={href} href={href}
          aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</Link>)}
      </nav>
      <Link href="/#watch" className="ed-nav-watch">watch <ArrowUpRight size={14} /></Link>
      <span key={pathname} className="ed-route-line" aria-hidden="true" />
      <button ref={menuButton} className="ed-menu-button ed-icon-button" aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="ed-mobile-nav" data-lenis-prevent>
        {destinations.map(({ href, label }, index) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ "--i": index } as CSSProperties}
          aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}<ArrowUpRight size={18} /></Link>)}
        <Link href="/#watch" onClick={() => setMenuOpen(false)} style={{ "--i": destinations.length } as CSSProperties}>watch<ArrowUpRight size={18} /></Link>
      </nav>}
    </header>
    <div className="ed-content-stage">
      <main id="main-content" tabIndex={-1} data-editorial-background>{children}</main>
    </div>
    <footer className="ed-footer" data-editorial-background>
      <AmbientWaves />
      <div className="ed-footer-top"><Link href="/" className="ed-footer-logo">okiso<span>↗</span></Link>
        <a href="https://discord.gg/okiso" target="_blank" rel="noopener noreferrer" className="ed-button">join the discord <ArrowUpRight size={16} /></a></div>
      <div className="ed-footer-bottom"><span>© {new Date().getFullYear()} okiso</span><span>vocaloid / hyperpop / electronic</span>
        <div>{ambient.reduced ? <span className="ed-footer-note">motion reduced by your system</span> : <button onClick={() => ambient.setPaused(!ambient.paused)}>{ambient.paused ? "resume ambient motion" : "pause ambient motion"}</button>}{pathname === "/" && !ambient.reduced && <button onClick={replayOpening}>replay opening ↗</button>}<button onClick={() => setDialog("content terms")}>content terms</button><button onClick={() => { setCopyMessage(""); setDialog("contact"); }}>contact ↗</button></div></div>
    </footer>
    <EditorialMusicPlayer />
    {dialog && <EditorialDialog title={dialog} onClose={() => setDialog(null)}>
      {dialog === "contact" ? <div className="ed-dialog-copy">
        <p>business & collabs</p>
        <a className="ed-contact-row" href="mailto:oxo@okiso.net"><span><small>email</small>oxo@okiso.net</span><ArrowUpRight /></a>
        <button className="ed-contact-row" onClick={copyDiscord}><span><small>discord · copy handle</small>.oxo</span><span>copy</span></button>
        <p role="status">{copyMessage}</p>
        <Link href="/links" className="ed-text-link" onClick={() => setDialog(null)}>all my links <ArrowUpRight size={16} /></Link>
      </div> : <div className="ed-dialog-copy">
        {pathname === "/downloads" ? <p>commissioned artwork is shown as previews. original files and PSDs stay private. the artists retain their rights.</p> : <><p>you are free to repost, remix, and reuse my content for creative purposes!</p>
        <ul><li>include clear credit linking back to my official channels (okiso).</li>
          <li>feel free to clip, edit, and react to streams and releases.</li>
          <li>content must not be used for harm, denigration, hate speech, or malicious intent.</li></ul>
        <p>these reuse terms cover my streams and releases. commissioned artwork belongs to its artists; original files and PSDs stay private.</p>
        <p>by using my content, you agree to these rules. have fun creating!</p></>}
      </div>}
    </EditorialDialog>}
  </div></AmbientMotionContext.Provider>;
}
