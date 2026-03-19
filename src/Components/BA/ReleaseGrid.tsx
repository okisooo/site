'use client';

import React from 'react';
import Link from 'next/link';
import { staticReleases } from '@/data/releases';
import { Play } from 'lucide-react';

export default function ReleaseGrid() {
  // Let's grab the top 4 releases
  const recentReleases = staticReleases.slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-12 lg:gap-24">
      {/* Heavy Title Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-8 border-black pb-6 gap-8">
        <h2 className="text-[12vw] xl:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase">
          AUDIO <br/>
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
          <a
            key={release.id}
            href={release.link}
            target="_blank"
            rel="noreferrer"
            className="group relative block w-full aspect-square md:aspect-auto md:h-[600px] border-8 border-white bg-white shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-[32px] md:rounded-[48px] overflow-hidden"
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
          </a>
        ))}
      </div>

      <div className="flex justify-center w-full mt-4">
        <Link href="/releases" className="bg-white text-black border-4 border-black px-12 py-6 rounded-full text-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex gap-4 items-center group shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-none translate-y-0 hover:translate-y-2">
          VIEW FULL DISCOGRAPHY <span className="group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
