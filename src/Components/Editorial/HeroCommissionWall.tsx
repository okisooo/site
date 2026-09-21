"use client";

import { galleryWorks } from "@/data/gallery";
import { useAmbientVisibility } from "./AmbientMotion";

// Curated positions keep the portraits visible around the character and sleeves.
const editions = [
  ["7mmchan", 0], ["sobu", 0], ["amaxa", 0], ["suyosuyo", 0],
  ["engawa110", 0], ["kou768", 0], ["ykhs9", 0], ["he-know-lee", 0],
] as const;

export default function HeroCommissionWall() {
  const { ref, active } = useAmbientVisibility();
  return <div ref={ref} className="ed-commission-wall ed-idle" aria-hidden="true">
    <div className="ed-commission-wall-grid">
      {editions.map(([id, version], index) => {
        const work = galleryWorks.find((entry) => entry.id === id)!;
        const art = work.variants[version];
        return <div className="ed-wall-print ed-kinetic-layer" key={`${id}-${version}`}>
          <img src={active && art.motion ? art.motion : id === "7mmchan" ? art.src : art.small ?? work.small}
            alt="" width={art.width} height={art.height} decoding="async" />
          <span><span>{work.artist}</span><span>{String(index + 1).padStart(2, "0")} / collection</span></span>
        </div>;
      })}
    </div>
  </div>;
}
