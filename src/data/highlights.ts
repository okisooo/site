const CRYDIE_VIDEO_URL =
  process.env.NEXT_PUBLIC_CRYDIE_VIDEO_URL ?? "https://www.youtube.com/watch?v=ekOQ28FZPK0";
const CRYDIE_VIDEO_THUMBNAIL =
  process.env.NEXT_PUBLIC_CRYDIE_VIDEO_THUMBNAIL ?? "https://img.youtube.com/vi/ekOQ28FZPK0/hqdefault.jpg";

export interface Highlight {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  releaseDate?: string;
  releaseDateLabel?: string;
  href: string;
  ctaLabel: string;
  accentColor?: string;
  accentGlow?: string;
  ctaTextColor?: string;
  image?: string;
  imageAlt?: string;
}

export const crydieVideoHighlight: Highlight = {
  id: "crydie-video",
  eyebrow: "Video Spotlight",
  title: "CryDie music video out now!",
  releaseDate: "2025-10-07",
  releaseDateLabel: "Oct 7, 2025",
  href: CRYDIE_VIDEO_URL,
  ctaLabel: "Watch on YouTube",
  accentColor: "linear-gradient(135deg, #ff2d55 0%, #ff3341 50%, #ff0062 100%)",
  accentGlow: "rgba(255, 29, 85, 0.45)",
  ctaTextColor: "#fff",
  image: CRYDIE_VIDEO_THUMBNAIL,
  imageAlt: "CryDie music video thumbnail",
};

export const homepageHighlights: Highlight[] = [crydieVideoHighlight];
export const releasePageHighlights: Highlight[] = [crydieVideoHighlight];
