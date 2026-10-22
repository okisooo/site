"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { ExternalLink, Pause, Play, Repeat, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

function time(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export default function EditorialMusicPlayer() {
  const player = useMusicPlayer();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !player.currentTrackId) return null;
  const known = Number.isFinite(player.duration) && player.duration > 0;
  const silent = player.muted || player.volume === 0;

  // Arrows move 5 s and page keys 30 s; the native 1 s step stays for dragging and assistive increments.
  function seekByKey(event: KeyboardEvent<HTMLInputElement>) {
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 30, PageDown: -30 }[event.key];
    if (!step || !known) return;
    event.preventDefault();
    player.seekTo(Math.min(player.duration, Math.max(0, player.currentTime + step)));
  }

  function close() {
    // The bar unmounts with its focused key; keep keyboard users in the page.
    document.getElementById("main-content")?.focus({ preventScroll: true });
    player.closePlayer();
  }

  return <section className="ed-player" aria-label="Music player" data-okiso-chrome="music-player" data-editorial-background
    data-premid-track-title={player.currentTrackTitle || ""} data-premid-track-artist={player.currentTrackArtist || "OKISO"}
    data-premid-cover-url={player.currentTrackCover || ""} data-premid-link={player.currentTrackLink || ""} data-premid-paused={!player.isPlaying}>
    <div className="ed-player-main">
      {player.currentTrackCover && <img className="ed-player-art" src={player.currentTrackCover} alt="" width="44" height="44" />}
      <div className="ed-player-info"><strong>{player.currentTrackTitle}</strong><small>{player.currentTrackArtist || "OKISO"}</small></div>
      <div className="ed-player-controls">
        <button className="ed-icon-button" aria-label="Previous track" onClick={player.playPrev}><SkipBack size={16} /></button>
        <button className="ed-icon-button ed-play" aria-label={player.isPlaying ? "Pause music" : "Play music"} onClick={player.togglePlayPause}>{player.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button>
        <button className="ed-icon-button" aria-label="Next track" onClick={player.playNext}><SkipForward size={16} /></button>
        <button className="ed-icon-button" aria-label="Loop track" aria-pressed={player.isLooping} onClick={player.toggleLoop}><Repeat size={16} /></button>
        <button className="ed-icon-button" aria-label="Mute music" aria-pressed={silent} onClick={player.toggleMute}>{silent ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        <input className="ed-player-volume" type="range" aria-label="Music volume" min="0" max="100" step="5" value={player.volume} aria-valuetext={silent ? "muted" : `${player.volume}%`} onChange={(event) => player.setVolume(Number(event.target.value))} />
        {player.currentTrackLink && <a className="ed-icon-button ed-player-external" href={player.currentTrackLink} target="_blank" rel="noopener noreferrer" aria-label="Open release on streaming service"><ExternalLink size={16} /></a>}
        <button className="ed-icon-button" aria-label="Close music player" onClick={close}><X size={16} /></button>
      </div>
    </div>
    <div className="ed-player-progress"><span>{time(player.currentTime)}</span><input type="range" aria-label="Seek music" min="0" max={known ? player.duration : 1} step="1" disabled={!known} value={Math.min(player.currentTime, known ? player.duration : 1)}
      aria-valuetext={known ? `${time(player.currentTime)} of ${time(player.duration)}` : undefined} onKeyDown={seekByKey} onChange={(event) => player.seekTo(Number(event.target.value))} /><span>{time(player.duration)}</span></div>
  </section>;
}
