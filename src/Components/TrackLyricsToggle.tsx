import { ChevronDown, FileText } from "lucide-react";

interface TrackLyricsToggleProps {
  title: string;
  durationStr?: string;
  lyrics?: string;
}

export function TrackLyricsToggle({ title, durationStr, lyrics }: TrackLyricsToggleProps) {
  if (!lyrics) {
    return (
      <div className="py-3 text-sm border-b border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 flex justify-between items-center text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">
        <span className="tac-display font-black uppercase text-xs tracking-wider">{title}</span>
        {durationStr && <span className="tac-mono text-xs text-[var(--tac-steel)]">{durationStr}</span>}
      </div>
    );
  }

  return (
    <details className="group border-b border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 py-1">
      <summary
        className="w-full min-h-12 cursor-pointer list-none text-left py-2.5 flex justify-between items-center gap-4 hover:text-[var(--tac-signal)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--tac-signal)]"
      >
        <span className="tac-display font-black text-xs uppercase tracking-wider flex items-center gap-2 text-[var(--tac-ink)] dark:text-[var(--tac-bone)] group-hover:text-[var(--tac-signal)]">
          <FileText size={14} className="text-[var(--tac-steel)] group-hover:text-[var(--tac-signal)]" />
          {title}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="text-xs">lyrics</span>
          {durationStr && <span className="tac-mono text-xs text-[var(--tac-steel)]">{durationStr}</span>}
          <ChevronDown size={16} aria-hidden="true" className="text-[var(--tac-steel)] transition-transform group-open:rotate-180" />
        </span>
      </summary>
        <div className="mt-2 mb-3 p-4 bg-black/5 dark:bg-white/5 text-sm leading-relaxed whitespace-pre-line text-[var(--tac-ink)] dark:text-[var(--tac-bone)] select-text border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18">
          {lyrics}
        </div>
    </details>
  );
}
