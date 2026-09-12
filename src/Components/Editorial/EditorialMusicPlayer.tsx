"use client";

import { useEffect, useState } from "react";
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
        <button className="ed-icon-button" aria-label={player.volume === 0 ? "Unmute music" : "Mute music"} onClick={() => player.setVolume(player.volume === 0 ? 100 : 0)}>{player.volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        <input className="ed-player-volume" type="range" aria-label="Music volume" min="0" max="100" value={player.volume} onChange={(event) => player.setVolume(Number(event.target.value))} />
        {player.currentTrackLink && <a className="ed-icon-button ed-player-external" href={player.currentTrackLink} target="_blank" rel="noopener noreferrer" aria-label="Open release on streaming service"><ExternalLink size={16} /></a>}
        <button className="ed-icon-button" aria-label="Close music player" onClick={player.closePlayer}><X size={16} /></button>
      </div>
    </div>
    <div className="ed-player-progress"><span>{time(player.currentTime)}</span><input type="range" aria-label="Seek music" min="0" max={player.duration || 1} step="0.1" disabled={!player.duration} value={Math.min(player.currentTime, player.duration || 1)} onChange={(event) => player.seekTo(Number(event.target.value))} /><span>{time(player.duration)}</span></div>
  </section>;
}
