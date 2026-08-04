"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

interface TrackLyricsToggleProps {
  title: string;
  durationStr?: string;
  lyrics?: string;
}

export function TrackLyricsToggle({ title, durationStr, lyrics }: TrackLyricsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!lyrics) {
    return (
      <div className="py-3 text-sm border-b border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 flex justify-between items-center text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">
        <span className="tac-display font-black uppercase text-xs tracking-wider">{title}</span>
        {durationStr && <span className="tac-mono text-xs text-[var(--tac-steel)]">{durationStr}</span>}
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 py-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-2.5 flex justify-between items-center hover:text-[var(--tac-signal)] transition-colors group"
      >
        <span className="tac-display font-black text-xs uppercase tracking-wider flex items-center gap-2 text-[var(--tac-ink)] dark:text-[var(--tac-bone)] group-hover:text-[var(--tac-signal)]">
          <FileText size={14} className="text-[var(--tac-steel)] group-hover:text-[var(--tac-signal)]" />
          {title}
        </span>
        <div className="flex items-center gap-3">
          {durationStr && <span className="tac-mono text-xs text-[var(--tac-steel)]">{durationStr}</span>}
          {isOpen ? (
            <ChevronUp size={16} className="text-[var(--tac-signal)]" />
          ) : (
            <ChevronDown size={16} className="text-[var(--tac-steel)] group-hover:text-[var(--tac-signal)]" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div data-lenis-prevent className="mt-2 mb-3 p-4 bg-black/5 dark:bg-white/5 text-xs tac-mono leading-relaxed whitespace-pre-line text-[var(--tac-ink)] dark:text-[var(--tac-bone)] max-h-[300px] overflow-y-auto select-text border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18">
          {lyrics}
        </div>
      )}
    </div>
  );
}
