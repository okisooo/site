"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

// Deterministic pseudo-waveform from an id so it's stable across renders.
function useBars(seed: string, n = 56): number[] {
  return useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619;
    const out: number[] = [];
    let s = h >>> 0;
    for (let i = 0; i < n; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      out.push(0.18 + (s % 1000) / 1000 * 0.82);
    }
    return out;
  }, [seed, n]);
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const KIND_META: Record<VerKind, { label: string; cls: string }> = {
  demo: { label: "demo", cls: "bg-ba-lavender/20 text-ba-lavender border-ba-lavender/30" },
  wip: { label: "WIP", cls: "bg-ba-yellow/20 text-ba-yellow border-ba-yellow/30" },
  master: { label: "master", cls: "bg-ba-mint/20 text-ba-mint border-ba-mint/30" },
  preview: { label: "preview", cls: "bg-ba-pink/20 text-ba-pink border-ba-pink/30" },
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
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-ba-pill font-mono text-[10px] uppercase tracking-wider border ${
        locked
          ? "bg-white/5 text-white/50 border-white/15"
          : "bg-ba-pink/15 text-ba-pink border-ba-pink/30"
      }`}
    >
      {LEVEL_ICON[level]}
      <span className="hidden sm:inline">{LEVEL_LABEL[level]}</span>
    </span>
  );
}

function WaveBars({
  seed,
  progress,
  locked,
  onSeek,
}: {
  seed: string;
  progress: number; // 0..1
  locked: boolean;
  onSeek?: (fraction: number) => void;
}) {
  const bars = useBars(seed);
  return (
    <div
      className={`flex items-end gap-[2px] h-9 w-full overflow-hidden ${onSeek && !locked ? "cursor-pointer" : ""}`}
      aria-hidden
      onClick={(e) => {
        if (!onSeek || locked) return;
        const rect = e.currentTarget.getBoundingClientRect();
        onSeek(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
      }}
    >
      {bars.map((b, i) => {
        const played = i / bars.length <= progress;
        return (
          <span
            key={i}
            className={`flex-1 rounded-full transition-colors duration-150 ${
              locked
                ? "bg-white/10"
                : played
                  ? "bg-ba-pink shadow-[0_0_6px_rgba(255,126,179,0.6)]"
                  : "bg-white/20"
            }`}
            style={{ height: `${Math.round(b * 100)}%` }}
          />
        );
      })}
    </div>
  );
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
  // Server sends `locked`; fall back to a client-side check for mock data.
  const locked = v.locked !== undefined ? v.locked : !canAccess(session, v);
  const teasable = locked && v.hasSnippet;
  const kind = KIND_META[v.kind];
  return (
    <div
      className={`group relative flex items-center gap-3 md:gap-4 rounded-ba p-3 md:p-4 border transition-colors ${
        !locked
          ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
          : "bg-white/[0.015] border-white/5 hover:bg-white/[0.03]"
      }`}
    >
      {/* Play / teaser / lock */}
      <button
        onClick={onToggle}
        title={
          !locked
            ? (isPlaying ? "Pause" : "Play")
            : teasable
              ? (isPlaying ? "Pause teaser" : "Play the 30s teaser")
              : "Locked — sign in to play"
        }
        className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
          !locked
            ? "bg-ba-pink text-white hover:scale-105 active:scale-95 shadow-ba-glow-pink"
            : teasable
              ? "bg-transparent border-2 border-ba-pink/60 text-ba-pink hover:bg-ba-pink/10 hover:scale-105"
              : "bg-white/5 text-white/30 hover:text-white/60"
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

      {/* Label + meta — takes full remaining width on mobile (waveform hidden) */}
      <div className="min-w-0 flex-1 sm:flex-none sm:w-40 md:w-52 sm:shrink-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white truncate">{v.label}</h4>
          {v.kind === "preview" && (
            <span title={v.range ? `cut ${fmtRange(v.range)} from ${cutSource(project, v)}` : "preview cut"}>
              <Scissors size={12} className="text-ba-pink shrink-0" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`px-1.5 py-0.5 rounded-ba-pill font-mono text-[10px] uppercase border ${kind.cls}`}>
            {kind.label}
          </span>
          <span className="font-mono text-[10px] text-white/40">{fmt(v.date)}</span>
          {isPlaying && isSnippetPlay && (
            <span className="font-mono text-[10px] text-ba-pink uppercase tracking-wider">teaser · 30s</span>
          )}
        </div>
      </div>

      {/* Waveform — desktop only; click to seek while playing */}
      <div className="hidden sm:block flex-1 min-w-0">
        <WaveBars
          seed={v.id}
          progress={isPlaying ? progress : 0}
          locked={locked && !isPlaying}
          onSeek={isPlaying ? onSeek : undefined}
        />
        {v.note && (
          <p className="text-[11px] text-white/40 mt-1 truncate">{v.note}</p>
        )}
      </div>

      {/* Share + access */}
      <div className="shrink-0 flex items-center gap-1.5">
        <button
          onClick={onShare}
          aria-label={`Copy share link for ${v.label}`}
          title="Copy share link"
          className="p-2 rounded-full text-white/30 hover:text-ba-pink hover:bg-ba-pink/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
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
  const reduce = useReducedMotion();
  const count = project.versions.length;
  const openCount = project.versions.filter((v) => !v.locked).length;

  // Deep-linked project opens once the prop arrives after the manifest loads.
  React.useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);

  return (
    <div className="relative">
      {/* Collapsed: fanned deck header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-full text-left"
        aria-expanded={open}
      >
        {/* fanned cards behind */}
        {!open &&
          Array.from({ length: Math.min(count - 1, 3) }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-ba-lg border border-white/10 bg-white/[0.02]"
              style={{
                transform: reduce
                  ? undefined
                  : `translateY(${(i + 1) * 7}px) scale(${1 - (i + 1) * 0.025}) rotate(${(i % 2 ? 1 : -1) * (i + 1) * 0.6}deg)`,
                zIndex: -i - 1,
              }}
            />
          ))}

        <div className="relative flex items-center gap-4 rounded-ba-lg border border-white/10 bg-zinc-950/60 backdrop-blur-md p-4 md:p-5 hover:border-ba-pink/40 transition-colors">
          <div className="w-14 h-14 rounded-ba overflow-hidden shrink-0 ring-1 ring-white/10 bg-black flex items-center justify-center">
            {project.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.cover} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <Disc3 className="text-white/40" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="vault-serif text-2xl md:text-3xl text-white truncate leading-tight">
              {project.title}
            </h3>
            <p className="font-mono text-[10px] text-white/45 uppercase tracking-[0.2em] mt-0.5">
              {count} version{count > 1 ? "s" : ""} · {openCount} open{openCount < count ? ` · ${count - openCount} locked` : ""}
            </p>
          </div>
          <ChevronDown
            size={20}
            className={`text-white/50 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded: version timeline */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="relative pl-4 mt-3 space-y-2 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {project.versions.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : i * 0.05 }}
                  className="relative"
                >
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-ba-pink shadow-ba-glow-pink" />
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
