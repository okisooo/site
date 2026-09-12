import Link from 'next/link';
import { staticReleases } from '@/data/releases';
import { ArrowUpRight } from 'lucide-react';

export default function ReleaseGrid() {
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
          <Link
            key={release.id}
            href={`/releases/${release.slug}`}
            className="tac-plate group relative block w-full aspect-square md:aspect-auto md:h-[520px] border border-[var(--tac-ink)]/22 dark:border-[var(--tac-bone)]/18 bg-black overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1"
          >
            {/* The Image Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={release.img}
                alt=""
                loading="lazy"
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
                  <ArrowUpRight size={22} />
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
          </Link>
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

    </div>
  );
}
