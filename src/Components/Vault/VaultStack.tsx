"use client";

import React, { useState, type CSSProperties } from "react";
import {
  Play,
  Pause,
  Lock,
  Scissors,
  ChevronDown,
  Disc3,
  Eye,
  Users,
  Crown,
  Sparkles,
  Link2,
} from "lucide-react";
import type { Level, VaultProject, VerKind, Version } from "@/data/vault";
import { LEVEL_LABEL } from "@/data/vault";
import type { Session } from "@/lib/vault";
import { canAccess } from "@/lib/vault";

/** The release-date format used across the core pages, e.g. "02 Mar 2026", whatever the visitor's locale. */
function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const KIND_META: Record<VerKind, { label: string; cls: string }> = {
  demo: { label: "demo", cls: "border border-[var(--tac-steel)]/40 text-[var(--tac-steel)]" },
  wip: { label: "wip", cls: "border border-[var(--tac-ink)]/40 dark:border-[var(--tac-bone)]/40 text-[var(--tac-ink)] dark:text-[var(--tac-bone)]" },
  master: { label: "master", cls: "border border-[var(--tac-signal)] text-[var(--tac-signal)]" },
  preview: { label: "preview", cls: "border border-[var(--tac-signal)]/60 text-[var(--tac-signal)]" },
};

const LEVEL_ICON: Record<Level, React.ReactNode> = {
  public: <Eye size={11} />,
  friend: <Users size={11} />,
  collab: <Sparkles size={11} />,
  owner: <Crown size={11} />,
};

function LevelChip({ level, locked }: { level: Level; locked: boolean }) {
  return (
    <span
      title={locked ? `${LEVEL_LABEL[level]} access needed` : LEVEL_LABEL[level]}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] tac-mono text-[10px] lowercase border ${
        locked
          ? "border-[var(--tac-steel)]/30 text-[var(--tac-steel)]"
          : "border-[var(--tac-signal)]/50 text-[var(--tac-signal)]"
      }`}
    >
      {LEVEL_ICON[level]}
      <span className="hidden sm:inline">{LEVEL_LABEL[level]}</span>
    </span>
  );
}

function PlaybackProgress({ label, progress, locked, onSeek }: {
  label: string;
  progress: number;
  locked: boolean;
  onSeek?: (fraction: number) => void;
}) {
  return <input className="ed-vault-seek" type="range" aria-label={`Seek ${label}`}
    min="0" max="1" step="0.01" value={progress} aria-valuetext={`${Math.round(progress * 100)}% played`} disabled={locked || !onSeek}
    onChange={(event) => onSeek?.(Number(event.target.value))} />;
}

function VersionRow({
  v,
  project,
  session,
  isPlaying,
  isSnippetPlay,
  progress,
  onToggle,
  onSeek,
  onShare,
}: {
  v: Version;
  project: VaultProject;
  session: Session | null;
  isPlaying: boolean;
  isSnippetPlay: boolean;
  progress: number;
  onToggle: () => void;
  onSeek: (fraction: number) => void;
  onShare: () => void;
}) {
  const locked = v.locked !== undefined ? v.locked : !canAccess(session, v);
  const teasable = locked && v.hasSnippet;
  const kind = KIND_META[v.kind];
  return (
    <div
      className={`ed-vault-version group relative flex items-center gap-3 md:gap-4 p-3 md:p-4 border transition-colors ${
        !locked
          ? "bg-black/5 dark:bg-white/5 border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 hover:border-[var(--tac-signal)]/40"
          : "bg-black/2 dark:bg-white/2 border-[var(--tac-ink)]/10 dark:border-[var(--tac-bone)]/10"
      }`}
    >
      {/* Play / teaser / lock */}
      <button
        onClick={onToggle}
        aria-label={`${isPlaying ? (locked ? "pause teaser of" : "pause") : !locked ? "play" : teasable ? "play 30s teaser of" : "locked, sign in to play"} ${project.title}, ${v.label}`}
        title={
          !locked
            ? (isPlaying ? "Pause" : "Play")
            : teasable
              ? (isPlaying ? "Pause teaser" : "Play the 30s teaser")
              : "Locked — sign in to play"
        }
        className={`shrink-0 w-10 h-10 flex items-center justify-center transition-colors ${
          isPlaying || (locked && teasable && isPlaying)
            ? "bg-[var(--tac-signal)] text-white border border-[var(--tac-signal)]"
            : !locked
              ? "bg-[var(--tac-ink)] text-[var(--tac-bone)] dark:bg-[var(--tac-bone)] dark:text-[var(--tac-ink)] hover:bg-[var(--tac-signal)] hover:text-white border border-transparent"
              : teasable
                ? "border border-[var(--tac-signal)] text-[var(--tac-signal)] hover:bg-[var(--tac-signal)] hover:text-white"
                : "border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 text-[var(--tac-steel)]"
        }`}
      >
        {locked && !teasable ? (
          <Lock size={15} />
        ) : isPlaying ? (
          <Pause size={15} fill="currentColor" />
        ) : locked ? (
          <Scissors size={14} />
        ) : (
          <Play size={15} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      {/* Label + meta */}
      <div className="min-w-0 flex-1 sm:flex-none sm:w-40 md:w-52 sm:shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-[var(--tac-ink)] truncate">{v.label}</h3>
          {v.kind === "preview" && (
            <span title={v.range ? `cut ${fmtRange(v.range)} from ${cutSource(project, v)}` : "preview cut"}>
              <Scissors size={12} className="text-[var(--tac-signal)] shrink-0" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`px-1.5 py-0.5 rounded-[2px] tac-mono text-[10px] ${kind.cls}`}>
            {kind.label}
          </span>
          <span className="tac-mono text-[10px] text-[var(--tac-steel)]">{fmt(v.date)}</span>
          {isPlaying && isSnippetPlay && (
            <span className="tac-mono text-[10px] text-[var(--tac-signal)]">teaser · 30s</span>
          )}
        </div>
      </div>

      {/* Waveform */}
      <div className="ed-vault-progress flex-1 min-w-0">
        <PlaybackProgress
          label={v.label}
          progress={isPlaying ? progress : 0}
          locked={locked && !isPlaying}
          onSeek={isPlaying ? onSeek : undefined}
        />
        {v.note && (
          <p className="tac-mono text-[11px] text-[var(--tac-steel)] mt-1 truncate">{v.note}</p>
        )}
      </div>

      {/* Share + access */}
      <div className="shrink-0 flex items-center gap-1.5">
        <button
          onClick={onShare}
          aria-label={`Copy share link for ${v.label}`}
          title="Copy share link"
          className="p-2 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 text-[var(--tac-steel)] hover:text-[var(--tac-signal)] hover:border-[var(--tac-signal)] opacity-100 transition-colors"
        >
          <Link2 size={14} />
        </button>
        <LevelChip level={v.minLevel} locked={locked} />
      </div>
    </div>
  );
}

function fmtRange([a, b]: [number, number]) {
  const t = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return `${t(a)}–${t(b)}`;
}
function cutSource(project: VaultProject, v: Version) {
  const src = project.versions.find((x) => x.id === v.previewOf);
  return src ? src.label : "master";
}

export function VaultStack({
  project,
  session,
  playingId,
  playingSnippet,
  progress,
  defaultOpen = false,
  onToggle,
  onSeek,
  onShare,
}: {
  project: VaultProject;
  session: Session | null;
  playingId: string | null;
  playingSnippet: boolean;
  progress: number;
  defaultOpen?: boolean;
  onToggle: (v: Version) => void;
  onSeek: (v: Version, fraction: number) => void;
  onShare: (v: Version) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const count = project.versions.length;
  const openCount = project.versions.filter((v) => !v.locked).length;

  React.useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);

  return (
    <div className="relative ed-vault-stack">
      <h2><button
        onClick={() => setOpen((o) => !o)}
        className="relative w-full text-left"
        aria-expanded={open}
      >
        {!open &&
          Array.from({ length: Math.min(count - 1, 3) }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute inset-0 border border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 bg-black/5 dark:bg-white/5"
              style={{
                transform: `translateY(${(i + 1) * 6}px) scale(${1 - (i + 1) * 0.02})`,
                zIndex: -i - 1,
              }}
            />
          ))}

        <span className="tac-plate relative flex items-center gap-4 p-4 md:p-5 hover:border-[var(--tac-signal)] transition-colors">
          <span className="w-12 h-12 overflow-hidden shrink-0 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 bg-black flex items-center justify-center">
            {project.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <Disc3 className="text-[var(--tac-steel)]" />
            )}
          </span>
          <span className="flex-1 min-w-0">
            <span className="ed-vault-project-title block font-semibold text-xl md:text-2xl text-[var(--tac-ink)] truncate leading-tight">
              {project.title}
            </span>
            <span className="block tac-mono text-[10px] text-[var(--tac-steel)] mt-1">
              <span className="whitespace-nowrap">{count} version{count > 1 ? "s" : ""}</span> <span className="whitespace-nowrap">· {openCount} open</span>{openCount < count && <> <span className="whitespace-nowrap">· {count - openCount} locked</span></>}
            </span>
          </span>
          <ChevronDown
            size={20}
            className={`text-[var(--tac-steel)] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button></h2>

      {open && (
        <div className="ed-vault-disclosure">
          <div>
            <div className="relative pl-4 mt-3 space-y-2 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-[var(--tac-signal)]">
              {project.versions.map((v, i) => (
                <div key={v.id} className="ed-vault-row relative" style={{ "--i": i } as CSSProperties}>
                  <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--tac-signal)]" />
                  <VersionRow
                    v={v}
                    project={project}
                    session={session}
                    isPlaying={playingId === v.id}
                    isSnippetPlay={playingId === v.id && playingSnippet}
                    progress={progress}
                    onToggle={() => onToggle(v)}
                    onSeek={(fraction) => onSeek(v, fraction)}
                    onShare={() => onShare(v)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
