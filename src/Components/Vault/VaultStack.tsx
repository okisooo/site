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
  demo: { label: "DEMO", cls: "border border-[var(--tac-steel)]/40 text-[var(--tac-steel)]" },
  wip: { label: "WIP", cls: "border border-[var(--tac-ink)]/40 dark:border-[var(--tac-bone)]/40 text-[var(--tac-ink)] dark:text-[var(--tac-bone)]" },
  master: { label: "MASTER", cls: "border border-[var(--tac-signal)] text-[var(--tac-signal)]" },
  preview: { label: "PREVIEW", cls: "border border-[var(--tac-signal)]/60 text-[var(--tac-signal)]" },
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
      className={`inline-flex items-center gap-1 px-2 py-0.5 tac-mono text-[10px] uppercase tracking-wider border ${
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

function WaveBars({
  seed,
  progress,
  locked,
  onSeek,
}: {
  seed: string;
  progress: number;
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
            className={`flex-1 transition-colors duration-150 ${
              locked
                ? "bg-[var(--tac-steel)]/15"
                : played
                  ? "bg-[var(--tac-signal)]"
                  : "bg-[var(--tac-ink)]/20 dark:bg-[var(--tac-bone)]/20"
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
  const locked = v.locked !== undefined ? v.locked : !canAccess(session, v);
  const teasable = locked && v.hasSnippet;
  const kind = KIND_META[v.kind];
  return (
    <div
      className={`group relative flex items-center gap-3 md:gap-4 p-3 md:p-4 border transition-colors ${
        !locked
          ? "bg-black/5 dark:bg-white/5 border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 hover:border-[var(--tac-signal)]/40"
          : "bg-black/2 dark:bg-white/2 border-[var(--tac-ink)]/10 dark:border-[var(--tac-bone)]/10"
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
          <h4 className="tac-display font-black text-sm text-[var(--tac-ink)] dark:text-[var(--tac-bone)] uppercase truncate">{v.label}</h4>
          {v.kind === "preview" && (
            <span title={v.range ? `cut ${fmtRange(v.range)} from ${cutSource(project, v)}` : "preview cut"}>
              <Scissors size={12} className="text-[var(--tac-signal)] shrink-0" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`px-1.5 py-0.5 tac-mono text-[10px] uppercase ${kind.cls}`}>
            {kind.label}
          </span>
          <span className="tac-mono text-[10px] text-[var(--tac-steel)]">{fmt(v.date)}</span>
          {isPlaying && isSnippetPlay && (
            <span className="tac-mono text-[10px] text-[var(--tac-signal)] uppercase tracking-wider">TEASER · 30S</span>
          )}
        </div>
      </div>

      {/* Waveform */}
      <div className="hidden sm:block flex-1 min-w-0">
        <WaveBars
          seed={v.id}
          progress={isPlaying ? progress : 0}
          locked={locked && !isPlaying}
          onSeek={isPlaying ? onSeek : undefined}
        />
        {v.note && (
          <p className="tac-mono text-[11px] text-[var(--tac-steel)] mt-1 truncate uppercase">{v.note}</p>
        )}
      </div>

      {/* Share + access */}
      <div className="shrink-0 flex items-center gap-1.5">
        <button
          onClick={onShare}
          aria-label={`Copy share link for ${v.label}`}
          title="Copy share link"
          className="p-2 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 text-[var(--tac-steel)] hover:text-[var(--tac-signal)] hover:border-[var(--tac-signal)] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
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

  React.useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-full text-left"
        aria-expanded={open}
      >
        {!open &&
          Array.from({ length: Math.min(count - 1, 3) }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute inset-0 border border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 bg-black/5 dark:bg-white/5"
              style={{
                transform: reduce
                  ? undefined
                  : `translateY(${(i + 1) * 6}px) scale(${1 - (i + 1) * 0.02})`,
                zIndex: -i - 1,
              }}
            />
          ))}

        <div className="tac-plate relative flex items-center gap-4 p-4 md:p-5 hover:border-[var(--tac-signal)] transition-colors">
          <div className="w-12 h-12 overflow-hidden shrink-0 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 bg-black flex items-center justify-center">
            {project.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.cover} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <Disc3 className="text-[var(--tac-steel)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="tac-display font-black text-xl md:text-2xl text-[var(--tac-ink)] dark:text-[var(--tac-bone)] uppercase truncate leading-tight">
              {project.title}
            </h3>
            <p className="tac-mono text-[10px] text-[var(--tac-steel)] uppercase tracking-[0.2em] mt-1">
              {count} VERSION{count > 1 ? "S" : ""} · {openCount} OPEN{openCount < count ? ` · ${count - openCount} LOCKED` : ""}
            </p>
          </div>
          <ChevronDown
            size={20}
            className={`text-[var(--tac-steel)] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="relative pl-4 mt-3 space-y-2 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-[var(--tac-signal)]">
              {project.versions.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : i * 0.05 }}
                  className="relative"
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
