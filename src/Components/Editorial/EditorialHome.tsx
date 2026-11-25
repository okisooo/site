"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Disc3, FolderOpen } from "lucide-react";
import type { Release } from "@/data/releases";
import { getReleaseListenTarget } from "@/lib/releaseLinks";
import { coverArt, coverSrcSet } from "@/lib/coverArt";
import { canCreateModelContext } from "@/lib/modelContext";
import { PlayReleaseButton } from "@/Components/PlayReleaseButton";
import { useFeaturedVideos } from "@/hooks/useFeaturedVideos";
import { useTwitchLive } from "@/hooks/useTwitchLive";
import { EditorialDialog } from "./EditorialDialog";
import DiscordPresence from "./DiscordPresence";
import ArtRoom from "./ArtRoom";
import { prefersLightData } from "./AmbientMotion";

const CustomVideoPlayer = dynamic(() => import("@/Components/BA/CustomVideoPlayer"), {
  ssr: false, loading: () => <p className="ed-loading" role="status">preparing video…</p>,
});
const CharacterStudio = dynamic(() => import("./CharacterStudio"), {
  ssr: false, loading: () => <p className="ed-loading" role="status">loading the interactive model…</p>,
});
const HeroModel = dynamic(() => import("./CharacterStudio"), { ssr: false });

/** Save-Data, slow connections and low-memory devices keep the still instead of a 3 MB model. */
function heroModelAllowed() {
  const { deviceMemory } = navigator as Navigator & { deviceMemory?: number };
  return !prefersLightData() && (deviceMemory ?? 8) >= 4;
}

function releaseDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export default function EditorialHome({ releases, picks, releaseCount }: { releases: Release[]; picks: Release[]; releaseCount: number }) {
  const [pickIndex, setPickIndex] = useState(0);
  const [modelOpen, setModelOpen] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);
  const [heroLimited, setHeroLimited] = useState(false);
  useEffect(() => {
    // Preserve production's data/GPU guards and opening deferral, plus the approved phone still.
    const site = document.querySelector(".core-site");
    const coarse = window.matchMedia("(pointer: coarse)");
    const allowed = () => window.innerWidth > 700 && !coarse.matches && heroModelAllowed();
    let scheduled = false, mounted = false, cancel = () => {};
    const mount = () => { scheduled = false; if (allowed() && canCreateModelContext()) { mounted = true; setHeroMounted(true); } };
    const schedule = () => {
      if (!allowed()) { cancel(); scheduled = false; mounted = false; setHeroMounted(false); return; }
      if (mounted) return;
      if (scheduled || document.readyState !== "complete" || site?.hasAttribute("data-opening")) return;
      scheduled = true;
      if ("requestIdleCallback" in window) { const idle = window.requestIdleCallback(mount, { timeout: 2000 }); cancel = () => window.cancelIdleCallback(idle); }
      else { const timeout = setTimeout(mount, 200); cancel = () => clearTimeout(timeout); }
    };
    const observer = new MutationObserver(schedule);
    if (site) observer.observe(site, { attributeFilter: ["data-opening"] });
    window.addEventListener("load", schedule);
    window.addEventListener("resize", schedule);
    coarse.addEventListener("change", schedule);
    schedule();
    return () => { observer.disconnect(); window.removeEventListener("load", schedule); window.removeEventListener("resize", schedule); coarse.removeEventListener("change", schedule); cancel(); };
  }, []);
  const pick = picks[pickIndex];
  const latest = releases[0];
  const target = getReleaseListenTarget(latest);
  const step = (offset: number) => setPickIndex((index) => (index + offset + picks.length) % picks.length);

  return <div className="ed-home">
    <section className="ed-cover" aria-label="Meet OKISO">
      <div className="ed-cover-kicker"><span>VTuber / virtual artist / vocaloid producer</span><Link href="/releases">{releaseCount} releases <ArrowUpRight size={14} /></Link></div>
      <h1 className="ed-masthead">OKISO</h1>
      <div className="ed-cover-field">
        <div className="ed-character" data-model-performance={heroLimited ? "fallback" : undefined}><picture className="ed-hero-fallback"><source media="(max-width: 700px)" srcSet="/hero-smirk-phone.webp" width="490" height="1042" /><img src="/hero-smirk.webp" alt="OKISO resting his chin on his hand, looking down at you with a smirk" width="1335" height="1040" fetchPriority="high" /></picture>{heroMounted && !heroLimited && <HeroModel hero active={!modelOpen} onPerformanceFallback={setHeroLimited} />}</div>
        <button className="ed-model-button" onClick={() => setModelOpen(true)}>open 3d model <ArrowUpRight size={15} /></button>
      </div>
      <div className="ed-cover-intro">
        <p className="ed-cover-lede">original <em>hyperpop</em>, electronic and vocaloid music from a virtual artist.</p>
        <article className="ed-latest">
          <Link href={`/releases/${latest.slug}`} className="ed-latest-art ed-idle"><img src={latest.img} alt={`${latest.title} cover`} width="320" height="320" fetchPriority="high" /></Link>
          <div className="ed-latest-copy">
            <span className="ed-label ed-latest-label">latest {latest.albumType} <time dateTime={latest.releaseDate}>{releaseDate(latest.releaseDate)}</time></span>
            <h2><Link href={`/releases/${latest.slug}`}>{latest.title}</Link></h2>
            <div className="ed-latest-actions"><PlayReleaseButton release={latest} /><a className="ed-text-link" href={target.url} target="_blank" rel="noopener noreferrer">{target.label} <ArrowUpRight size={15} /></a></div>
          </div>
        </article>
      </div>
    </section>
    <section className="ed-listen" aria-label="Listening room and vault">
      {pick && <div className="ed-listening-deck">
        <div className="ed-panel-label"><span><Disc3 size={14} /> listening room</span><span className="ed-deck-position" aria-hidden="true">{String(pickIndex + 1).padStart(2, "0")} <span>/ {String(picks.length).padStart(2, "0")}</span></span><span className="sr-only">pick {pickIndex + 1} of {picks.length}</span></div>
        <div className="ed-deck-main"><Link href={`/releases/${pick.slug}`} className="ed-deck-art"><img key={pick.id} src={coverArt(pick.img, 300)} decoding="async" alt={`${pick.title} cover`} width="140" height="140" /></Link>
          <div className="ed-deck-info"><span className="ed-label">{pick.albumType} / {pick.year}</span><h2><Link href={`/releases/${pick.slug}`}>{pick.title}</Link></h2><PlayReleaseButton release={pick} /></div>
        </div>
        <div className="ed-deck-bottom"><button aria-label="Previous listening pick" className="ed-icon-button" onClick={() => step(-1)}><ChevronLeft size={18} /></button>
          <div className="ed-deck-picks">{picks.map((release, index) => <button key={release.id} onClick={() => setPickIndex(index)} aria-label={`Select ${release.title}`} aria-pressed={index === pickIndex}><img src={coverArt(release.img, 64)} alt="" width="56" height="56" loading="lazy" decoding="async" /></button>)}</div>
          <button aria-label="Next listening pick" className="ed-icon-button" onClick={() => step(1)}><ChevronRight size={18} /></button></div>
      </div>}
      <Link href="/vault" className="ed-vault-teaser"><span className="ed-label">demos & versions</span><span className="ed-vault-teaser-title">the vault<FolderOpen strokeWidth={1.25} /></span><span className="ed-vault-teaser-footer"><span>open the vault</span><span className="ed-folder-open"><ArrowUpRight size={17} /></span></span></Link>
    </section>
    <section id="archive" className="ed-section">
      <header className="ed-section-heading"><div><h2>latest releases</h2></div><Link href="/releases" className="ed-text-link">all {releaseCount} releases <ArrowUpRight size={18} /></Link></header>
      <div className="ed-release-grid ed-home-releases">{releases.map((release) => <article className="ed-release-card" key={release.id}>
        <Link href={`/releases/${release.slug}`}><div className="ed-release-image"><img src={coverArt(release.img, 300)} srcSet={coverSrcSet(release.img)} sizes="(max-width: 700px) calc(50vw - 40px), (max-width: 1380px) 21vw, 290px" alt="" width="360" height="360" loading="lazy" /><ArrowUpRight className="ed-art-arrow" /></div>
          <div className="ed-release-meta"><span>{release.albumType}</span><time dateTime={release.releaseDate}>{releaseDate(release.releaseDate)}</time></div><h3>{release.title}</h3></Link>
      </article>)}</div>
    </section>
    <div className="ed-brand-interlude" aria-hidden="true" />
    <ArtRoom onOpenModel={() => setModelOpen(true)} />
    <WatchSection />
    {modelOpen && <EditorialDialog title="3d model" className="ed-studio-dialog" onClose={() => setModelOpen(false)}><CharacterStudio /></EditorialDialog>}
  </div>;
}

function WatchSection() {
  const watchRef = useRef<HTMLElement>(null);
  // The feed, the twitch status and the discord presence are small reads: they wait for the page to load and
  // an idle moment (or the section coming within two screens), so a jump to #watch lands on a complete section.
  // The player and the twitch embed mount only within 400px of the section, or on request.
  const [dataReady, setDataReady] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [playerNear, setPlayerNear] = useState(false);
  const wantData = dataReady || nearViewport || playerNear;
  const { videos, isLoading, error } = useFeaturedVideos(wantData);
  const { isLive } = useTwitchLive("okiso7", wantData);
  const [showFeatured, setShowFeatured] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [twitchParent, setTwitchParent] = useState("localhost");
  useEffect(() => {
    const section = watchRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: "200% 0px" });
    const player = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setPlayerNear(true); player.disconnect(); }
    }, { rootMargin: "400px" });
    player.observe(section);
    let cancel = () => {};
    const watch = () => {
      observer.observe(section);
      if ("requestIdleCallback" in window) { const idle = window.requestIdleCallback(() => setDataReady(true), { timeout: 3000 }); cancel = () => window.cancelIdleCallback(idle); }
      else { const timeout = setTimeout(() => setDataReady(true), 1500); cancel = () => clearTimeout(timeout); }
    };
    if (document.readyState === "complete") watch(); else window.addEventListener("load", watch, { once: true });
    return () => { observer.disconnect(); player.disconnect(); window.removeEventListener("load", watch); cancel(); };
  }, []);
  useEffect(() => { setTwitchParent(window.location.hostname); }, []);
  useEffect(() => { if (!isLive) setShowFeatured(false); }, [isLive]);
  const video = videos.find((item) => item.id === activeId) ?? videos[0];
  const showingLive = isLive && !showFeatured;
  const channels = [
    ["youtube", "music videos & more", "https://www.youtube.com/@okiso"],
    ["twitch", "come hang out", "https://www.twitch.tv/okiso7/"],
    ["spotify", "the full discography", "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm"],
    ["bandcamp", "support the music", "https://okiso.bandcamp.com/"],
    ["instagram", "@okisooo_", "https://www.instagram.com/okisooo_/"],
    ["x", "@okisooo_", "https://x.com/okisooo_"],
  ];
  return <section ref={watchRef} id="watch" className="ed-section ed-watch-section">
    <header className="ed-section-heading"><div><h2>{showingLive ? "live now" : "videos"}</h2></div><a className="ed-text-link" href="https://www.youtube.com/@okiso" target="_blank" rel="noopener noreferrer">on youtube <ArrowUpRight size={18} /></a></header>
    <div className="ed-watch-grid"><div data-pending={!wantData || isLoading || undefined}>
      {isLive && <div className="ed-toolbar"><button className="ed-button" aria-pressed={showingLive} onClick={() => setShowFeatured(false)}>live stream</button><button className="ed-button" aria-pressed={!showingLive} onClick={() => setShowFeatured(true)}>featured videos</button></div>}
      <div className="ed-video-frame">{!playerNear ? <div className="ed-video-empty"><span className="ed-label">videos</span><button className="ed-button" onClick={() => setPlayerNear(true)}>load the video player</button></div> : showingLive ? <iframe title="OKISO live on Twitch" src={`https://player.twitch.tv/?channel=okiso7&parent=${twitchParent}`} allowFullScreen /> : video ? <CustomVideoPlayer key={video.id} src={video.src} hlsUrl={video.hlsUrl} streamUrl={video.streamUrl} sourceUrl={video.sourceUrl} poster={video.poster} title={video.title} className="w-full h-full" /> : <div className="ed-video-empty"><span className="ed-label">{isLoading ? "loading videos…" : error ? "the video feed couldn’t load" : "no website videos published yet"}</span><a href="https://www.youtube.com/@okiso" target="_blank" rel="noopener noreferrer" className="ed-button">watch on youtube <ArrowUpRight size={16} /></a></div>}</div>
      {!showingLive && video && <p className="ed-video-title">{video.title}</p>}
      {!showingLive && videos.length > 1 && <div className="ed-video-selector">{videos.slice(0, 6).map((item) => <button key={item.id} onClick={() => setActiveId(item.id)} aria-pressed={item.id === video?.id}>{item.poster && <img src={item.poster} alt="" width="100" height="56" loading="lazy" />}<span>{item.title}</span></button>)}</div>}
    </div><aside><DiscordPresence live={wantData} /><div className="ed-channels"><div className="ed-panel-label"><span>links</span><ArrowUpRight size={16} /></div>{channels.map(([name, description, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer"><span><strong>{name}</strong><small>{description}</small></span><ArrowUpRight size={20} /></a>)}</div></aside></div>
  </section>;
}
