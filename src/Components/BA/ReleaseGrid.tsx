'use client';

import React from 'react';
import Link from 'next/link';
import { staticReleases, type Release } from '@/data/releases';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayReleaseButton } from '@/Components/PlayReleaseButton';
import { createPortal } from 'react-dom';
import { getReleaseListenTarget } from '@/lib/releaseLinks';

export default function ReleaseGrid() {
  const [selectedRelease, setSelectedRelease] = React.useState<Release | null>(null);

  // Let's grab the top 4 releases
  const recentReleases = staticReleases.slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-12 lg:gap-24">
      {/* Heavy Title Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 pb-6 gap-8">
        <h2 className="tac-h2">
          AUDIO <br />
          <span className="tac-h2-dim">ARCHIVE</span>
        </h2>
        <div className="flex flex-col md:text-right">
          <span className="tac-mono text-xs font-bold tracking-[0.25em] text-[var(--tac-steel)] uppercase">
            SONGS // {staticReleases.length}
          </span>
          <span className="tac-mono text-[10px] tracking-[0.3em] text-[var(--tac-signal)] uppercase">
            VOCALOID_RECORDS
          </span>
        </div>
      </div>

      {/* Grid of Huge Albums */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {recentReleases.map((release) => (
          <button
            key={release.id}
            onClick={() => setSelectedRelease(release)}
            className="tac-plate group relative block w-full aspect-square md:aspect-auto md:h-[520px] border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 bg-black overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1"
          >
            {/* The Image Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={release.img}
                alt={release.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out opacity-80 group-hover:opacity-90"
              />
              {/* Heavy Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
            </div>

            {/* Giant Title on Hover */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10 text-white">
              <div className="flex justify-between items-start">
                <div className="tac-mono text-[10px] font-bold tracking-[0.25em] uppercase text-white bg-black/60 border border-white/25 px-3 py-1">
                  {release.year}
                </div>
                <div className="w-12 h-12 bg-[var(--tac-signal)] text-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 border border-white/30">
                  <Play fill="currentColor" size={20} className="ml-0.5" />
                </div>
              </div>

              <div>
                <p className="tac-mono text-xs font-bold uppercase tracking-[0.25em] text-[var(--tac-bone)]/80 mb-2 truncate">
                  {release.year} {'//'} {release.albumType} {'//'} {release.tracks?.length || 1} TRACKS
                </p>
                <h3 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none text-white">
                  {release.title}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center w-full mt-4 gap-6">
        <Link href="/releases" className="tac-mono text-xs md:text-sm font-bold uppercase tracking-[0.25em] px-6 py-4 border border-[var(--tac-ink)]/30 dark:border-[var(--tac-bone)]/30 bg-[var(--tac-ink)] text-[var(--tac-bone)] dark:bg-[var(--tac-bone)] dark:text-[var(--tac-ink)] hover:bg-[var(--tac-signal)] hover:text-white dark:hover:bg-[var(--tac-signal)] dark:hover:text-white transition-colors flex gap-3 items-center group">
          VIEW FULL DISCOGRAPHY <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link href="/upcoming" className="tac-mono text-xs md:text-sm font-bold uppercase tracking-[0.25em] px-6 py-4 border border-[var(--tac-signal)] bg-[var(--tac-signal)] text-white hover:bg-[#c40e24] transition-colors flex gap-3 items-center group">
          UPCOMING RELEASES <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link href="/vault" className="tac-mono text-xs md:text-sm font-bold uppercase tracking-[0.25em] px-6 py-4 border border-[var(--tac-ink)]/30 dark:border-[var(--tac-bone)]/30 bg-transparent text-[var(--tac-ink)] dark:text-[var(--tac-bone)] hover:border-[var(--tac-signal)] hover:text-[var(--tac-signal)] transition-colors flex gap-3 items-center group">
          THE VAULT <span aria-hidden className="text-[var(--tac-signal)]">✦</span> <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Super Cute Popup Modal using Portal to escape stacking contexts */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedRelease && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
              onClick={() => setSelectedRelease(null)}
            >
              <motion.div
                data-premid-release-title={selectedRelease.title}
                data-premid-release-cover={selectedRelease.img}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="tac-plate relative w-full max-w-md bg-[var(--tac-bone)] dark:bg-[#0c0c0e] text-[var(--tac-ink)] p-6 md:p-8 border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedRelease(null)}
                  className="absolute top-4 right-4 p-2 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20 hover:bg-[var(--tac-signal)] hover:border-[var(--tac-signal)] hover:text-white transition-colors z-10"
                >
                  <X size={18} />
                </button>

                <div className="relative w-full aspect-square overflow-hidden mb-6 border border-[var(--tac-ink)]/20 dark:border-[var(--tac-bone)]/20">
                  <img src={selectedRelease.img} alt={selectedRelease.title} className="w-full h-full object-cover" />
                </div>

                <div className="text-center mb-8">
                  <h3 className="font-display text-2xl md:text-3xl font-black tracking-tight uppercase mb-1 text-[var(--tac-ink)]">{selectedRelease.title}</h3>
                  <p className="tac-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--tac-steel)]">
                    {selectedRelease.year} {'//'} {selectedRelease.albumType}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <PlayReleaseButton release={selectedRelease} onClose={() => setSelectedRelease(null)} />
                  <a
                    href={getReleaseListenTarget(selectedRelease).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-[var(--tac-ink)] text-[var(--tac-bone)] dark:bg-[var(--tac-bone)] dark:text-[var(--tac-ink)] hover:bg-[var(--tac-signal)] hover:text-white dark:hover:bg-[var(--tac-signal)] dark:hover:text-white tac-mono text-xs font-bold uppercase tracking-[0.2em] text-center transition-colors flex items-center justify-center gap-2 border border-current"
                  >
                    {getReleaseListenTarget(selectedRelease).label}
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
