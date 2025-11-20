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

export const homepageHighlights: Highlight[] = [];
export const releasePageHighlights: Highlight[] = [];
