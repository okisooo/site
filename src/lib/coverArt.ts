// Spotify serves every album cover at 64, 300 and 640 px; only the image id's prefix differs.
const SPOTIFY_COVER = /^(https:\/\/i\.scdn\.co\/image\/)ab67616d0000b273([0-9a-f]+)$/;
const PREFIX = { 64: "ab67616d00004851", 300: "ab67616d00001e02", 640: "ab67616d0000b273" } as const;
export type CoverSize = keyof typeof PREFIX;

/** The cover at the requested width. Anything that isn't a 640 px Spotify cover passes through unchanged. */
export function coverArt(url: string, size: CoverSize) {
  const match = SPOTIFY_COVER.exec(url);
  return match ? `${match[1]}${PREFIX[size]}${match[2]}` : url;
}

/** A srcSet across the given widths, or undefined when the cover has only one size. */
export function coverSrcSet(url: string, sizes: CoverSize[] = [300, 640]) {
  return SPOTIFY_COVER.test(url) ? sizes.map((size) => `${coverArt(url, size)} ${size}w`).join(", ") : undefined;
}
