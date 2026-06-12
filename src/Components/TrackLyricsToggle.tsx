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
      <div className="py-2.5 text-sm md:text-base border-b border-black/5 dark:border-white/5 flex justify-between items-center text-black/80 dark:text-white/80">
        <span className="font-medium">{title}</span>
        {durationStr && <span className="text-xs text-black/40 dark:text-white/40">{durationStr}</span>}
      </div>
    );
  }

  return (
    <div className="border-b border-black/5 dark:border-white/5 py-1.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-1.5 text-sm md:text-base flex justify-between items-center hover:text-ba-pink transition-colors group"
      >
        <span className="font-bold flex items-center gap-2 text-black/80 dark:text-white/80 group-hover:text-ba-pink">
          <FileText size={16} className="text-black/40 dark:text-white/40 group-hover:text-ba-pink" />
          {title}
        </span>
        <div className="flex items-center gap-2.5">
          {durationStr && <span className="text-xs text-black/40 dark:text-white/40">{durationStr}</span>}
          {isOpen ? (
            <ChevronUp size={16} className="text-ba-pink" />
          ) : (
            <ChevronDown size={16} className="text-black/40 dark:text-white/40 group-hover:text-ba-pink" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="mt-2 mb-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-xs md:text-sm font-medium leading-relaxed whitespace-pre-line text-black/70 dark:text-white/70 max-h-[300px] overflow-y-auto select-text border border-black/5 dark:border-white/5">
          {lyrics}
        </div>
      )}
    </div>
  );
}
