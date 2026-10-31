import { commissionArt } from './commissionArt';

export interface GalleryVariant {
  label: string;
  src: string;
  small?: string;
  width: number;
  height: number;
  motion?: string;
  /** 960px-wide resize of `src` for still variants wider than 1100px (scripts/prepare-gallery-mids.mts). */
  mid?: string;
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
  ...(animated ? { motion: `/art/gallery/${id}-motion.webp` } : width > 1100 ? { mid: `/art/gallery/${id}-mid.webp` } : {}),
});
const original = (art: typeof commissionArt[number]): GalleryVariant => ({
  label: 'illustration', src: art.src, small: art.small, width: art.width, height: art.height,
  ...(art.width > 1100 ? { mid: art.src.replace('-1280.webp', '-960.webp') } : {}),
});

// Skeb work/creator identities verified in signed-in deliveries through October 31, 2026.
// Keep private request text, delivery URLs and purchase details out of this catalog.
export const galleryWorks: GalleryWork[] = [
  { id: 'midori-annte23', artist: '@Midori_annte23', title: 'red glasses & flowing color', medium: 'illustration',
    description: 'A portrait of OKISO with red glasses and flowing red and violet patterns, illustrated by @Midori_annte23.',
    artistUrl: 'https://skeb.jp/@Midori_annte23', workUrl: 'https://skeb.jp/@Midori_annte23/works/1538',
    small: '/art/gallery/midori-annte23-thumb.webp', width: 1280, height: 1280,
    variants: [variant('midori-annte23', 'illustration', 1280, 1280),
      variant('midori-annte23-message', 'artist message', 1280, 1280),
      variant('midori-annte23-transparent', 'transparent illustration', 1280, 1280),
      variant('midori-annte23-character', 'transparent character', 1280, 1280)] },
  { id: 'tsumugi0832', artist: '@Tsumugi0832', title: 'a little mascot hug', medium: 'illustration',
    description: 'A pixel-style chibi of OKISO holding a red mascot, illustrated by @Tsumugi0832.',
    artistUrl: 'https://skeb.jp/@Tsumugi0832', workUrl: 'https://skeb.jp/@Tsumugi0832/works/244',
    small: '/art/gallery/tsumugi0832-thumb.webp', width: 1280, height: 1406,
    variants: [variant('tsumugi0832', 'illustration', 1280, 1406), variant('tsumugi0832-transparent', 'transparent illustration', 1280, 1406)] },
  { id: '3kumini', artist: '3punkyou · @3kumini', title: 'chibis, donuts & little keepsakes', medium: 'illustration',
    description: 'An OKISO chibi collection with donuts, a flip phone and a snow globe, illustrated by 3punkyou (@3kumini).',
    artistUrl: 'https://skeb.jp/@3kumini', workUrl: 'https://skeb.jp/@3kumini/works/1011',
    small: '/art/gallery/3kumini-thumb.webp', width: 1280, height: 1280,
    variants: [
      variant('3kumini', 'chibi collage', 1280, 1280),
      variant('3kumini-message', 'artist message', 1280, 1280),
      variant('3kumini-guide', 'artist asset guide', 1280, 720),
      variant('3kumini-sheet', 'asset sheet', 1280, 720),
      variant('3kumini-chibi-donut', 'chibi with donut', 759, 719),
      variant('3kumini-chibi-quiet', 'quiet chibi', 759, 719),
      variant('3kumini-chibi-wink', 'winking chibi', 759, 719),
      variant('3kumini-chibi-smile', 'smiling chibi', 759, 719),
      variant('3kumini-phone', 'flip phone', 1038, 1359),
      variant('3kumini-globe', 'snow globe', 851, 1004),
      variant('3kumini-donuts', 'donut sticker', 1235, 1068),
    ] },
  { id: 'kouchanthree', artist: 'kouchanthree', title: 'portrait among autumn leaves', medium: 'illustration',
    description: 'A painterly portrait of OKISO among glowing autumn leaves, illustrated by kouchanthree.',
    artistUrl: 'https://skeb.jp/@kouchanthree', workUrl: 'https://skeb.jp/@kouchanthree/works/18',
    small: '/art/gallery/kouchanthree-thumb.webp', width: 1013, height: 1800,
    variants: [variant('kouchanthree', 'illustration', 1013, 1800), variant('kouchanthree-message', 'artist message', 1013, 1800)] },
  { id: 'pen117', artist: 'pen · @pen_117', title: 'quiet portrait', medium: 'illustration',
    description: 'A softly colored portrait of OKISO with a finger to the lips and an orange-to-pink frame, illustrated by pen (@pen_117).',
    artistUrl: 'https://skeb.jp/@pen_117', workUrl: 'https://skeb.jp/@pen_117/works/241',
    small: '/art/gallery/pen117-thumb.webp', width: 1200, height: 1800,
    variants: [variant('pen117', 'framed portrait', 1200, 1800), variant('pen117-transparent', 'transparent portrait', 1200, 1800), variant('pen117-line-art', 'line art', 1037, 1800)] },
  { id: 'yoshi-ras888', artist: 'yoshiRAS888', title: 'painterly portrait & mascot', medium: 'illustration',
    description: 'A softly painted portrait of OKISO holding the red takoling mascot, illustrated by yoshiRAS888.',
    artistUrl: 'https://skeb.jp/@yoshiRAS888',
    small: '/art/gallery/yoshi-ras888-thumb.webp', width: 1280, height: 889,
    variants: [variant('yoshi-ras888', 'illustration', 1280, 889)] },
  { id: 'nanashinolina', artist: 'lina · @nanashinolina', title: 'white outfit & mascot', medium: 'illustration',
    description: 'An OKISO character collage with a redesigned white outfit and a portrait holding the takoling mascot, illustrated by lina (@nanashinolina).',
    artistUrl: 'https://skeb.jp/@nanashinolina', workUrl: 'https://skeb.jp/@nanashinolina/works/32',
    small: '/art/gallery/nanashinolina-thumb.webp', width: 1273, height: 1800,
    variants: [variant('nanashinolina', 'character collage', 1273, 1800), variant('nanashinolina-message', 'artist message', 1273, 1800), variant('nanashinolina-full-body', 'full body', 782, 1800), variant('nanashinolina-portrait', 'portrait & mascot', 980, 1800)] },
  { id: 'otori', artist: 'OTORIxxx', title: 'your one-of-a-kind diary', medium: 'animation',
    description: 'An animated OKISO diary collage with portraits, pixel art, stickers and takoling keychains, illustrated by OTORIxxx.',
    artistUrl: 'https://skeb.jp/@OTORIxxx', workUrl: 'https://skeb.jp/@OTORIxxx/works/37',
    small: '/art/gallery/otori-animated-thumb.webp', width: 800, height: 800,
    variants: [
      variant('otori-animated', 'animated collage', 800, 800, true),
      variant('otori', 'diary collage', 1280, 1280),
      variant('otori-guide', 'artist asset guide', 1130, 1800),
      variant('otori-sheet', 'transparent asset sheet', 1130, 1800),
      variant('otori-portrait', 'portrait', 1280, 1512),
      variant('otori-holographic', 'holographic sticker', 1270, 1270),
      variant('otori-pixel', 'pixel character', 1280, 1126),
      variant('otori-dark-keychain', 'dark keychain', 994, 1800),
      variant('otori-silver-keychain', 'silver keychain', 940, 1800),
      variant('otori-mascot-open', 'mascot · open arms', 1182, 1012),
      variant('otori-mascot-raised', 'mascot · raised arms', 1134, 1010),
      variant('otori-mascot-left', 'mascot · looking left', 782, 712),
      variant('otori-mascot-right', 'mascot · looking right', 802, 707),
      variant('otori-mascot-front', 'mascot · front', 805, 693),
      variant('otori-mascot-back', 'mascot · back', 797, 683),
      variant('otori-name-sticker', 'name sticker', 1280, 649),
      variant('otori-portrait-card', 'portrait card', 1280, 1280),
      variant('otori-keychain', 'collage keychain', 905, 1800),
      variant('otori-ring', 'keychain ring', 737, 165),
      variant('otori-pencils', 'colored pencils', 840, 1800),
    ] },
  { id: 'obakeno-perutan', artist: 'ObakenoPerutan', title: 'character assortment', medium: 'illustration',
    description: 'A red-and-white OKISO collage with portraits, chibis and takoling mascots, illustrated by ObakenoPerutan.',
    artistUrl: 'https://skeb.jp/@ObakenoPerutan', workUrl: 'https://skeb.jp/@ObakenoPerutan/works/14',
    small: '/art/gallery/obakeno-perutan-thumb.webp', width: 1280, height: 1109,
    variants: [variant('obakeno-perutan', 'character assortment', 1280, 1109), variant('obakeno-perutan-message', 'artist message', 1280, 1109), variant('obakeno-perutan-portrait', 'portrait', 1280, 1357), variant('obakeno-perutan-profile', 'side profile', 1280, 1758), variant('obakeno-perutan-tiny', 'tiny mascot', 878, 956), variant('obakeno-perutan-full-body', 'full body', 936, 1800), variant('obakeno-perutan-chibi', 'chibi & mascot', 1142, 1281)] },
  { id: 'he-know-lee', artist: 'he_know_lee', title: 'portrait with mascot', medium: 'illustration',
    description: 'OKISO and a takoling mascot, illustrated by he_know_lee.',
    artistUrl: 'https://skeb.jp/@he_know_lee', workUrl: 'https://skeb.jp/@he_know_lee/works/11',
    small: '/art/gallery/he-know-lee-thumb.webp', width: 1273, height: 1800,
    variants: [variant('he-know-lee', 'open mouth', 1273, 1800), variant('he-know-lee-frown', 'frown', 1273, 1800), variant('he-know-lee-message', 'artist message', 1273, 1800), variant('he-know-lee-background', 'background separation', 1273, 1800), variant('he-know-lee-character', 'character & mascot', 1273, 1800)] },
  { id: 'ykhs9', artist: 'ykhs9', title: 'music illustration', medium: 'illustration',
    description: 'OKISO in a graphic red-and-mint music illustration by ykhs9.',
    artistUrl: 'https://skeb.jp/@ykhs9', workUrl: 'https://skeb.jp/@ykhs9/works/16',
    small: '/art/gallery/ykhs9-thumb.webp', width: 1280, height: 960,
    variants: [variant('ykhs9', 'open smile', 1280, 960), variant('ykhs9-expression-2', 'eyes closed', 1280, 960), variant('ykhs9-expression-3', 'soft smile', 1280, 960), variant('ykhs9-expression-4', 'quiet smile', 1280, 960)] },
  { ...commissionArt[0], medium: 'illustration', artistUrl: 'https://skeb.jp/@suyosuyo', workUrl: 'https://skeb.jp/@suyosuyo/works/65',
    variants: [original(commissionArt[0]), variant('suyosuyo-portrait', 'alternate expression', 1150, 1800), variant('suyosuyo-message', 'artist message', 1150, 1800), variant('suyosuyo-thanks', 'thank-you portrait', 1280, 1280)] },
  { id: 'kou768', artist: 'kou768', title: 'suit portrait', medium: 'illustration',
    description: 'OKISO in a dark suit, illustrated by kou768.',
    artistUrl: 'https://skeb.jp/@kou768', workUrl: 'https://skeb.jp/@kou768/works/22',
    small: '/art/gallery/kou768-thumb.webp', width: 1238, height: 1800,
    variants: [variant('kou768', 'illustration', 1238, 1800), variant('kou768-framed', 'framed version', 1238, 1800), variant('kou768-message', 'artist message', 1238, 1800)] },
  { ...commissionArt[1], medium: 'illustration',
    variants: [original(commissionArt[1]), variant('sobu-lineart', 'line art', 1280, 1660)] },
  { id: 'amaxa', artist: 'amaxa', title: 'tracksuit portrait', medium: 'illustration',
    description: 'A softly lit portrait of OKISO in the white tracksuit, illustrated by amaxa.',
    artistUrl: 'https://skeb.jp/@amaxa58700', workUrl: 'https://skeb.jp/@amaxa58700/works/14',
    small: '/art/gallery/amaxa-thumb.webp', width: 1275, height: 1800,
    variants: [variant('amaxa', 'illustration', 1275, 1800), variant('amaxa-message', 'artist message', 1275, 1800)] },
  { ...commissionArt[2], medium: 'illustration', artistUrl: 'https://skeb.jp/@7mmchan', workUrl: 'https://skeb.jp/@7mmchan/works/25',
    variants: [original(commissionArt[2]), variant('7mmchan-alternate', 'alternate version', 1280, 1280), variant('7mmchan-message', 'artist message', 1280, 1280)] },
  { id: 'engawa110', artist: 'engawa110', title: 'spinning animation', medium: 'animation',
    description: 'A tiny, red-eyed OKISO in a hand-drawn spinning loop by engawa110.',
    artistUrl: 'https://skeb.jp/@engawa110', workUrl: 'https://skeb.jp/@engawa110/works/2026',
    small: '/art/gallery/engawa110-thumb.webp', width: 966, height: 966,
    variants: [variant('engawa110', 'animated commission', 966, 966, true), variant('engawa110-message', 'artist message', 900, 900, true)] },
];
