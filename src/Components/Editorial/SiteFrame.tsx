"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { MusicPlayer } from "@/Components/MusicPlayer";
import { ThemeToggle } from "@/Components/ThemeToggle";
import AnimatedGrid from "@/Components/Backgrounds/AnimatedGrid";
import { usesEditorialDesign } from "@/lib/siteDesign";
import { EditorialDialog } from "./EditorialDialog";
import EditorialMusicPlayer from "./EditorialMusicPlayer";
import EditorialOpening from "./EditorialOpening";
import { useEditorialMotion } from "./useEditorialMotion";
import { AmbientArtwork, AmbientMotionContext, AmbientWaves, useAmbientPreference } from "./AmbientMotion";

const destinations = [
  { href: "/releases", label: "releases" },
  { href: "/vault", label: "vault" },
  { href: "/gallery", label: "gallery" },
  { href: "/upcoming", label: "upcoming" },
  { href: "/about", label: "about" },
];

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"contact" | "content terms" | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [opening, setOpening] = useState(() => pathname === "/");
  const [openingTake, setOpeningTake] = useState(0);
  const editorial = usesEditorialDesign(pathname);
  const ambient = useAmbientPreference(pathname);
  useEditorialMotion(pathname, editorial);

  useEffect(() => { setMenuOpen(false); if (pathname !== "/") setOpening(false); }, [pathname]);

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
    {opening && <EditorialOpening key={openingTake} onFinish={() => setOpening(false)} />}
    <header className="ed-nav" data-editorial-background onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
      <Link href="/" className="ed-logo" aria-label="OKISO home" onClick={() => setMenuOpen(false)}>okiso<span aria-hidden="true">↗</span></Link>
      <span className="ed-nav-caption">music & other things</span>
      <nav aria-label="Main navigation" className="ed-nav-links">
        {destinations.map(({ href, label }) => <Link key={href} href={href}
          aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</Link>)}
      </nav>
      <a href="/#watch" className="ed-nav-watch">watch <ArrowUpRight size={14} /></a>
      <span key={pathname} className="ed-route-line" aria-hidden="true" />
      <button className="ed-menu-button ed-icon-button" aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="ed-mobile-nav">
        {destinations.map(({ href, label }) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}
          aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}<ArrowUpRight size={18} /></Link>)}
        <a href="/#watch" onClick={() => setMenuOpen(false)}>watch<ArrowUpRight size={18} /></a>
      </nav>}
    </header>
    <div className="ed-content-stage">
      <AmbientArtwork />
      <main id="main-content" data-editorial-background>{children}</main>
    </div>
    <footer className="ed-footer" data-editorial-background>
      <AmbientWaves />
      <div className="ed-footer-top"><Link href="/" className="ed-footer-logo">okiso<span>↗</span></Link>
        <a href="https://discord.gg/okiso" target="_blank" rel="noopener noreferrer" className="ed-button">join the discord <ArrowUpRight size={16} /></a></div>
      <div className="ed-footer-bottom"><span>© {new Date().getFullYear()} okiso</span><span>vocaloid / hyperpop / electronic</span>
        <div><button disabled={ambient.reduced} aria-pressed={ambient.paused} onClick={() => ambient.setPaused(!ambient.paused)}>{ambient.reduced ? "reduced motion" : ambient.paused ? "resume ambient motion" : "pause ambient motion"}</button>{pathname === "/" && <button onClick={replayOpening}>replay opening ↗</button>}<button onClick={() => setDialog("content terms")}>content terms</button><button onClick={() => { setCopyMessage(""); setDialog("contact"); }}>contact ↗</button></div></div>
    </footer>
    <EditorialMusicPlayer />
    {dialog && <EditorialDialog title={dialog} onClose={() => setDialog(null)}>
      {dialog === "contact" ? <div className="ed-dialog-copy">
        <p>business & collabs</p>
        <a className="ed-contact-row" href="mailto:oxo@okiso.net"><span><small>email</small>oxo@okiso.net</span><ArrowUpRight /></a>
        <button className="ed-contact-row" onClick={copyDiscord}><span><small>discord · copy handle</small>.oxo</span><span>copy</span></button>
        <p role="status">{copyMessage}</p>
      </div> : <div className="ed-dialog-copy">
        <p>you are free to repost, remix, and reuse my content for creative purposes!</p>
        <ul><li>include clear credit linking back to my official channels (okiso).</li>
          <li>feel free to clip, edit, and react to streams and releases.</li>
          <li>content must not be used for harm, denigration, hate speech, or malicious intent.</li></ul>
        <p>by using my content, you agree to these rules. have fun creating!</p>
      </div>}
    </EditorialDialog>}
  </div></AmbientMotionContext.Provider>;
}
