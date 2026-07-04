'use client';

import React from 'react';
import Link from 'next/link';
import { staticReleases, type Release } from '@/data/releases';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayReleaseButton } from '@/Components/PlayReleaseButton';
import { createPortal } from 'react-dom';

export default function ReleaseGrid() {
  const [selectedRelease, setSelectedRelease] = React.useState<Release | null>(null);

  // Let's grab the top 4 releases
  const recentReleases = staticReleases.slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-12 lg:gap-24">
      {/* Heavy Title Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-8 border-black pb-6 gap-8">
        <h2 className="text-[12vw] xl:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase">
          AUDIO <br />
          <span className="text-black/20">ARCHIVE</span>
        </h2>
        <div className="flex flex-col text-right">
          <span className="font-bold text-xl tracking-widest text-black/50">SONGS // {staticReleases.length}</span>
          <span className="font-bold text-sm tracking-[0.2em] text-ba-pink">VOCALOID_RECORDS</span>
        </div>
      </div>

      {/* Grid of Huge Albums */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {recentReleases.map((release) => (
          <button
            key={release.id}
            onClick={() => setSelectedRelease(release)}
            className="group relative block w-full aspect-square md:aspect-auto md:h-[600px] border-8 border-white bg-white shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-[32px] md:rounded-[48px] overflow-hidden text-left"
          >
            {/* The Image Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={release.img}
                alt={release.title}
                className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-[1s] ease-out"
              />
              {/* Heavy Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            </div>

            {/* Giant Title on Hover */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10 text-white translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-xl px-6 py-2 rounded-full border border-white/30 text-white font-bold tracking-widest uppercase text-sm shadow-xl">
                  {release.year}
                </div>
                <div className="w-16 h-16 bg-ba-pink rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-[0_0_30px_rgba(255,126,179,0.8)]">
                  <Play fill="currentColor" size={24} className="ml-1" />
                </div>
              </div>

              <div>
                <p className="text-xl font-bold uppercase tracking-widest text-white/70 mb-2 truncate">
                  {release.albumType} {'//'} {release.tracks?.length || 1} TRACKS
                </p>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">
                  {release.title}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center w-full mt-4 gap-6">
        <Link href="/releases" className="bg-white text-black border-4 border-black px-8 py-5 md:px-12 md:py-6 rounded-full text-lg md:text-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex gap-4 items-center group shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-none translate-y-0 hover:translate-y-2">
          VIEW FULL DISCOGRAPHY <span className="group-hover:translate-x-2 transition-transform">→</span>
        </Link>
        <Link href="/upcoming" className="bg-ba-pink text-white border-4 border-ba-pink px-8 py-5 md:px-12 md:py-6 rounded-full text-lg md:text-2xl font-black uppercase tracking-widest hover:bg-ba-pink-deep hover:border-ba-pink-deep transition-colors flex gap-4 items-center group shadow-[0_20px_40px_rgba(255,126,179,0.3)] hover:shadow-none translate-y-0 hover:translate-y-2">
          UPCOMING RELEASES <span className="group-hover:translate-x-2 transition-transform">→</span>
        </Link>
        <Link href="/vault" className="bg-black text-white border-4 border-black px-8 py-5 md:px-12 md:py-6 rounded-full text-lg md:text-2xl font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors flex gap-4 items-center group shadow-[0_20px_40px_rgba(0,0,0,0.25)] hover:shadow-none translate-y-0 hover:translate-y-2">
          THE VAULT <span aria-hidden className="text-ba-pink">✦</span> <span className="group-hover:translate-x-2 transition-transform">→</span>
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
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelectedRelease(null)}
            >
              <motion.div
                data-premid-release-title={selectedRelease.title}
                data-premid-release-cover={selectedRelease.img}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-black/10 dark:border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedRelease(null)}
                  className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors z-10"
                >
                  <X size={20} />
                </button>

                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 shadow-lg border-2 border-black/5 dark:border-white/5">
                  <img src={selectedRelease.img} alt={selectedRelease.title} className="w-full h-full object-cover" />
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-1">{selectedRelease.title}</h3>
                  <p className="text-black/50 dark:text-white/50 font-bold tracking-widest text-sm uppercase">
                    {selectedRelease.year} {'//'} {selectedRelease.albumType}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <PlayReleaseButton release={selectedRelease} onClose={() => setSelectedRelease(null)} />
                  <a
                    href={selectedRelease.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:shadow-[0_0_20px_rgba(29,185,84,0.4)] hover:scale-[1.02] active:scale-[0.98] text-black font-black uppercase tracking-[0.2em] text-center transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Listen on Spotify
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
