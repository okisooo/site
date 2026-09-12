import { commissionArt } from './commissionArt';

export interface GalleryVariant {
  label: string;
  src: string;
  small?: string;
  width: number;
  height: number;
  motion?: string;
}
export interface GalleryWork {
  id: string;
  artist: string;
  title: string;
  description: string;
  small: string;
  width: number;
  height: number;
  artistUrl?: string;
  workUrl?: string;
  medium: 'illustration' | 'animation';
  variants: GalleryVariant[];
}
const variant = (id: string, label: string, width: number, height: number, animated = false): GalleryVariant => ({
  label, src: `/art/gallery/${id}.webp`, small: `/art/gallery/${id}-thumb.webp`, width, height,
  ...(animated ? { motion: `/art/gallery/${id}-motion.webp` } : {}),
});
const original = (art: typeof commissionArt[number]): GalleryVariant => ({
  label: 'illustration', src: art.src, small: art.small, width: art.width, height: art.height,
});

// Skeb work/creator identities verified in the signed-in completed list, September 12–13, 2026.
// Keep private request text, delivery URLs and purchase details out of this catalog.
export const galleryWorks: GalleryWork[] = [
  { id: 'ykhs9', artist: 'ykhs9', title: 'on repeat.', medium: 'illustration',
    description: 'OKISO in a graphic red-and-mint music illustration by ykhs9.',
    artistUrl: 'https://skeb.jp/@ykhs9', workUrl: 'https://skeb.jp/@ykhs9/works/16',
    small: '/art/gallery/ykhs9-thumb.webp', width: 1280, height: 960,
    variants: [variant('ykhs9', 'open smile', 1280, 960), variant('ykhs9-expression-2', 'eyes closed', 1280, 960), variant('ykhs9-expression-3', 'soft smile', 1280, 960), variant('ykhs9-expression-4', 'quiet smile', 1280, 960)] },
  { ...commissionArt[0], medium: 'illustration', artistUrl: 'https://skeb.jp/@suyosuyo', workUrl: 'https://skeb.jp/@suyosuyo/works/65',
    variants: [original(commissionArt[0]), variant('suyosuyo-portrait', 'alternate expression', 1150, 1800), variant('suyosuyo-message', 'artist message', 1150, 1800), variant('suyosuyo-thanks', 'thank-you portrait', 1280, 1280)] },
  { id: 'kou768', artist: 'kou768', title: 'suited up.', medium: 'illustration',
    description: 'OKISO in a dark suit, illustrated by kou768.',
    artistUrl: 'https://skeb.jp/@kou768', workUrl: 'https://skeb.jp/@kou768/works/22',
    small: '/art/gallery/kou768-thumb.webp', width: 1238, height: 1800,
    variants: [variant('kou768', 'illustration', 1238, 1800), variant('kou768-framed', 'framed version', 1238, 1800), variant('kou768-message', 'artist message', 1238, 1800)] },
  { ...commissionArt[1], medium: 'illustration',
    variants: [original(commissionArt[1]), variant('sobu-lineart', 'line art', 1280, 1660)] },
  { id: 'amaxa', artist: 'amaxa', title: 'a quiet look.', medium: 'illustration',
    description: 'A softly lit portrait of OKISO in the white tracksuit, illustrated by amaxa.',
    artistUrl: 'https://skeb.jp/@amaxa58700', workUrl: 'https://skeb.jp/@amaxa58700/works/14',
    small: '/art/gallery/amaxa-thumb.webp', width: 1275, height: 1800,
    variants: [variant('amaxa', 'illustration', 1275, 1800), variant('amaxa-message', 'artist message', 1275, 1800)] },
  { ...commissionArt[2], medium: 'illustration', artistUrl: 'https://skeb.jp/@7mmchan', workUrl: 'https://skeb.jp/@7mmchan/works/25',
    variants: [original(commissionArt[2]), variant('7mmchan-alternate', 'alternate version', 1280, 1280), variant('7mmchan-message', 'artist message', 1280, 1280)] },
  { id: 'engawa110', artist: 'engawa110', title: 'a little spin.', medium: 'animation',
    description: 'A tiny, red-eyed OKISO in a hand-drawn spinning loop by engawa110.',
    artistUrl: 'https://skeb.jp/@engawa110', workUrl: 'https://skeb.jp/@engawa110/works/2026',
    small: '/art/gallery/engawa110-thumb.webp', width: 966, height: 966,
    variants: [variant('engawa110', 'animated commission', 966, 966, true), variant('engawa110-message', 'artist message', 900, 900, true)] },
];
