import { staticReleases, type Release } from "@/data/releases";

/** Only the card and first-track playback fields cross into client components. */
export function releaseCard(release: Release): Release {
  return {
    id: release.id, slug: release.slug, title: release.title, year: release.year,
    sourceIds: release.sourceIds, upc: release.upc,
    img: release.img, link: release.link, releaseDate: release.releaseDate, albumType: release.albumType,
    totalTracks: release.totalTracks ?? release.tracks?.length ?? 1,
    tracks: release.tracks?.slice(0, 1).map((track) => ({ title: track.title })),
  };
}

export function getEditorialHomeData() {
  return {
    releases: staticReleases.slice(0, 4).map(releaseCard),
    picks: ["PRODIGY", "VAC", "for a chance to look beyond the stars"]
      .map((title) => staticReleases.find((release) => release.title === title))
      .filter((release) => release !== undefined).map(releaseCard),
    releaseCount: staticReleases.length,
  };
}
