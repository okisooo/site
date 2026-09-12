"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Disc3, FolderOpen } from "lucide-react";
import type { Release } from "@/data/releases";
import { getReleaseListenTarget } from "@/lib/releaseLinks";
import { PlayReleaseButton } from "@/Components/PlayReleaseButton";
import { useFeaturedVideos } from "@/hooks/useFeaturedVideos";
import { useTwitchLive } from "@/hooks/useTwitchLive";
import { EditorialDialog } from "./EditorialDialog";
import DiscordPresence from "./DiscordPresence";
import ArtRoom from "./ArtRoom";

const CustomVideoPlayer = dynamic(() => import("@/Components/BA/CustomVideoPlayer"), {
  ssr: false, loading: () => <p className="ed-loading" role="status">preparing video…</p>,
});
const CharacterStudio = dynamic(() => import("./CharacterStudio"), {
  ssr: false, loading: () => <p className="ed-loading" role="status">loading the interactive model…</p>,
});

function releaseDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export default function EditorialHome({ releases, picks, releaseCount }: { releases: Release[]; picks: Release[]; releaseCount: number }) {
  const [pickIndex, setPickIndex] = useState(0);
  const [modelOpen, setModelOpen] = useState(false);
  const pick = picks[pickIndex];
  const latest = releases[0];
  const target = getReleaseListenTarget(latest);

  return <div className="ed-home">
    <section className="ed-cover" aria-label="Meet OKISO">
      <div className="ed-cover-kicker"><span>virtual artist & vocaloid producer</span><span>official website / {latest.year}</span></div>
      <div className="ed-masthead"><h1>OKISO</h1><div><span>hyperpop.<br />electronic.<br />and everything<br />in between.</span><ArrowDown size={26} /></div></div>
      <div className="ed-collage-strip ed-commission-montage" aria-hidden="true"><img src="/art/sobu-640.webp" alt="" width="640" height="830" decoding="async" /><img src="/art/suyosuyo-640.webp" alt="" width="640" height="1002" decoding="async" /></div>
      <div className="ed-character"><img className="ed-idle ed-idle-character" src="/hero_character.webp" alt="OKISO’s white-haired character in an oversized white tracksuit" width="667" height="1024" fetchPriority="high" /></div>
      <article className="ed-latest-card">
        <div className="ed-panel-label"><span><Disc3 size={12} /> new release</span><span>{releaseDate(latest.releaseDate)}</span></div>
        <Link href={`/releases/${latest.slug}`} className="ed-latest-art ed-idle"><img src={latest.img} alt={`${latest.title} cover`} width="320" height="320" fetchPriority="high" /><ArrowUpRight className="ed-art-arrow" /></Link>
        <div className="ed-latest-caption"><span className="ed-label ed-sleeve-credit">okiso <span>{latest.albumType}</span></span><h2><Link href={`/releases/${latest.slug}`}>{latest.title}</Link></h2><a href={target.url} target="_blank" rel="noopener noreferrer">{target.label} <ArrowUpRight size={15} /></a></div>
      </article>
      <div className="ed-artist-note"><span className="ed-label">meet the artist <span aria-hidden="true">↗</span></span><p>at your<br /><em>command.</em></p><button onClick={() => setModelOpen(true)}>explore the 3d model <ArrowUpRight size={15} /></button></div>
      <a href="#art-room" className="ed-commission-sticker" aria-label="Explore commissioned artwork, featuring 7mmchan"><img className="ed-idle ed-idle-sticker" src="/art/7mmchan-256.webp" alt="Chibi OKISO with the red mascot, by 7mmchan" width="256" height="256" /><span>art by 7mmchan <ArrowUpRight size={12} /></span></a>
      <div className="ed-cover-rail">
      {pick && <div className="ed-listening-deck">
        <div className="ed-panel-label"><span><Disc3 size={13} /> listening room</span><span className="ed-deck-position" aria-label={`Pick ${pickIndex + 1} of ${picks.length}`}>{String(pickIndex + 1).padStart(2, "0")} <span>/ {String(picks.length).padStart(2, "0")}</span></span></div>
        <div className="ed-deck-main"><Link href={`/releases/${pick.slug}`} className="ed-deck-art"><img key={pick.id} src={pick.img} alt={`${pick.title} cover`} width="100" height="100" /></Link>
          <div className="ed-deck-info"><span className="ed-label">from the archive / {pick.year}</span><h2><Link href={`/releases/${pick.slug}`}>{pick.title}</Link></h2><PlayReleaseButton release={pick} /></div>
        </div>
        <div className="ed-deck-bottom"><button aria-label="Previous listening pick" className="ed-icon-button" onClick={() => setPickIndex((index) => (index - 1 + picks.length) % picks.length)}><ChevronLeft size={18} /></button>
          <div className="ed-deck-picks">{picks.map((release, index) => <button key={release.id} onClick={() => setPickIndex(index)} aria-label={`Select ${release.title}`} aria-pressed={index === pickIndex}><img src={release.img} alt="" width="48" height="48" /></button>)}</div>
          <button aria-label="Next listening pick" className="ed-icon-button" onClick={() => setPickIndex((index) => (index + 1) % picks.length)}><ChevronRight size={18} /></button></div>
      </div>}
      <Link href="/vault" className="ed-vault-teaser"><span className="ed-label">behind the releases</span><span className="ed-vault-teaser-title">the vault.<FolderOpen strokeWidth={1.25} /></span><span className="ed-vault-teaser-footer">demos, versions & cuts <span className="ed-folder-open"><ArrowUpRight size={17} /></span></span></Link>
      </div>
      <div className="ed-cover-bottom"><span>original music. a world of its own.</span><Link href="/releases">{releaseCount} releases in the archive <ArrowUpRight size={14} /></Link></div>
    </section>
    <section id="archive" className="ed-section">
      <header className="ed-section-heading"><div><span className="ed-label">discography / newest first</span><h2>fresh from<br /><span>the archive.</span></h2></div><Link href="/releases" className="ed-text-link">all {releaseCount} releases <ArrowUpRight size={18} /></Link></header>
      <div className="ed-release-grid ed-home-releases">{releases.map((release) => <article className="ed-release-card" key={release.id}>
        <Link href={`/releases/${release.slug}`}><div className="ed-release-image"><img src={release.img} alt={`${release.title} cover`} width="360" height="360" loading="lazy" /><ArrowUpRight className="ed-art-arrow" /></div>
          <div className="ed-release-meta"><span>{release.albumType}</span><time dateTime={release.releaseDate}>{releaseDate(release.releaseDate)}</time></div><h3>{release.title}</h3></Link>
      </article>)}</div>
    </section>
    <ArtRoom onOpenModel={() => setModelOpen(true)} />
    <WatchSection />
    {modelOpen && <EditorialDialog title="the character room." className="ed-studio-dialog" onClose={() => setModelOpen(false)}><CharacterStudio /></EditorialDialog>}
  </div>;
}

function WatchSection() {
  const watchRef = useRef<HTMLElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const { videos, isLoading, error } = useFeaturedVideos();
  const { isLive } = useTwitchLive("okiso");
  const [showFeatured, setShowFeatured] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [twitchParent, setTwitchParent] = useState("localhost");
  useEffect(() => {
    const section = watchRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: "400px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { setTwitchParent(window.location.hostname); }, []);
  useEffect(() => { if (!isLive) setShowFeatured(false); }, [isLive]);
  const video = videos.find((item) => item.id === activeId) ?? videos[0];
  const showingLive = isLive && !showFeatured;
  const channels = [
    ["youtube", "music videos & more", "https://www.youtube.com/@okiso7"],
    ["twitch", "come hang out", "https://www.twitch.tv/okiso7/"],
    ["spotify", "the full discography", "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm"],
    ["bandcamp", "support the music", "https://okiso.bandcamp.com/"],
    ["instagram", "@okisooo_", "https://www.instagram.com/okisooo_/"],
    ["x", "@okisooo_", "https://x.com/okisooo_"],
  ];
  return <section ref={watchRef} id="watch" className="ed-section ed-watch-section">
    <header className="ed-section-heading"><div><span className="ed-label">music in motion</span><h2>{showingLive ? "live right now." : "press play."}</h2></div><a className="ed-text-link" href="https://www.youtube.com/@okiso7" target="_blank" rel="noopener noreferrer">on youtube <ArrowUpRight size={18} /></a></header>
    <div className="ed-watch-grid"><div>
      {isLive && <div className="ed-toolbar"><button className="ed-button" aria-pressed={showingLive} onClick={() => setShowFeatured(false)}>live stream</button><button className="ed-button" aria-pressed={!showingLive} onClick={() => setShowFeatured(true)}>featured videos</button></div>}
      <div className="ed-video-frame">{!nearViewport ? <div className="ed-video-empty"><span className="ed-label">music in motion</span><button className="ed-button" onClick={() => setNearViewport(true)}>load the video player</button></div> : showingLive ? <iframe title="OKISO live on Twitch" src={`https://player.twitch.tv/?channel=okiso&parent=${twitchParent}`} allowFullScreen /> : video ? <CustomVideoPlayer key={video.id} src={video.src} hlsUrl={video.hlsUrl} streamUrl={video.streamUrl} sourceUrl={video.sourceUrl} poster={video.poster} title={video.title} className="w-full h-full" /> : <div className="ed-video-empty"><span className="ed-label">{isLoading ? "loading videos…" : error ? "the video feed couldn’t load" : "no website videos published yet"}</span><a href="https://www.youtube.com/@okiso7" target="_blank" rel="noopener noreferrer" className="ed-button">watch on youtube <ArrowUpRight size={16} /></a></div>}</div>
      {!showingLive && video && <p className="ed-video-title">{video.title}</p>}
      {!showingLive && videos.length > 1 && <div className="ed-video-selector">{videos.slice(0, 6).map((item) => <button key={item.id} onClick={() => setActiveId(item.id)} aria-pressed={item.id === video?.id}>{item.poster && <img src={item.poster} alt="" width="100" height="56" loading="lazy" />}<span>{item.title}</span></button>)}</div>}
    </div><aside><DiscordPresence /><div className="ed-channels"><div className="ed-panel-label"><span>elsewhere on the internet</span><ArrowUpRight size={16} /></div>{channels.map(([name, description, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer"><span><strong>{name}</strong><small>{description}</small></span><ArrowUpRight size={20} /></a>)}</div></aside></div>
  </section>;
}
