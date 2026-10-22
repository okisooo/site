import { ChevronDown, FileText } from "lucide-react";

interface TrackLyricsToggleProps {
  title: string;
  trackNumber?: number;
  durationStr?: string;
  lyrics?: string;
}

export function TrackLyricsToggle({ title, trackNumber, durationStr, lyrics }: TrackLyricsToggleProps) {
  const number = trackNumber ? <span className="ed-track-no">{String(trackNumber).padStart(2, "0")}</span> : null;

  if (!lyrics) {
    return (
      <div className="py-3 text-sm border-b border-[var(--tac-ink)]/15 dark:border-[var(--tac-bone)]/15 flex justify-between items-center gap-4 text-[var(--tac-ink)] dark:text-[var(--tac-bone)]">
        <span className="tac-display font-black uppercase text-xs tracking-wider flex items-center gap-2 min-w-0">{number}{title}</span>
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
          {number}
          <FileText size={14} className="text-[var(--tac-steel)] group-hover:text-[var(--tac-signal)]" />
          {title}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="text-xs">lyrics</span>
          {durationStr && <span className="tac-mono text-xs text-[var(--tac-steel)]">{durationStr}</span>}
          <ChevronDown size={16} aria-hidden="true" className="text-[var(--tac-steel)] transition-transform group-open:rotate-180" />
        </span>
      </summary>
        {/* One element per lyric line keeps line breaks distinct from wrapping; the text stays server-rendered. */}
        <div className="select-text">
          {lyrics.split(/\r?\n/).map((line, index) => line.trim()
            ? <span key={index} className="ed-lyric-line">{line}{"\n"}</span>
            : <span key={index} className="ed-lyric-gap" aria-hidden="true">{"\n"}</span>)}
        </div>
    </details>
  );
}
