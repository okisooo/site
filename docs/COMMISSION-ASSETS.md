# commissioned artwork for the site

reviewed 2026-09-11. the user supplied this local collection for website art,
preferring the skeb folders; the sketch combo is also acceptable.

updated 2026-09-12: the user explicitly asked to look on **skeb itself**, not use
the folder inventory as the collection authority. the signed-in complete-request
list has six deliveries. verified work/creator links, the gallery and outstanding
@ykhs9 delivery are recorded in `GALLERY-AND-AMBIENT-MOTION.md`. existing local
files are only pixel sources after matching them to those skeb deliveries.

source root: `D:/FOLDERS/Commissions/Bought/OKISO/`

## selected candidates

| artist / collection | original relative path | intended fit | observed details |
| --- | --- | --- | --- |
| suyosuyo | `suyosuyo@skeb/4046159-4.png` | featured portrait / framed artist panel | 2300 x 3600; artist-supplied text-free smiling variant, white outfit and red mascot; keep its painted background |
| 7mmchan | `7mmchan@skeb/4043264-3.png` | small character sticker / portrait-stamp replacement | 2048 x 2048; transparent, text-free chibi with the red mascot |
| sobu (@sobsocks) | `OKISO Commission Sketch Combo/OKISO/sketch_combo.png` | framed collage insert | 2436 x 3160; the matching jpg was visually reviewed; expressive two-portrait composition with red ribbons; artist confirmed by the user |
| kou768 | `kou768@skeb/3836091-3.output.png` | alternate framed portrait | 2123 x 3086; text-free, opaque white background; dark suit rather than the primary white outfit |
| amaxa | `amaxa@skeb/3836124-1.output.png` | alternate editorial portrait | 4299 x 6071; reviewed output contains the artist's message; keep it intact or inspect the other original variant before selecting |

the user confirmed the sketch-combo artist with an artist card showing sobu and
the handle `@sobsocks`. profile urls were not supplied; do not invent platform links.

`engawa110@skeb` contains two gif files, now matched to skeb work 2026 and included
in the gallery. their 31 frames and 1400ms timing are preserved. the full-art
viewer offers explicit play/pause; the gallery cards default to still images.

## use constraints

- implemented in the local preview on 2026-09-11: suyosuyo and sobu in the hero
  montage; 7mmchan as the linked sticker; all three in the interactive art room
  with a full-art dialog and visible credits. release covers remain unchanged.
- preserve original png, jpg, gif, psd, and zip files in the commission folder.
  use separately named web derivatives if implementation proceeds; do not copy
  high-resolution originals or layered source files wholesale into public assets.
- no ai-generated replacements, extensions, retouching, or inferred cutouts.
  an alpha channel alone does not prove that a painted background is transparent.
- prefer the artist-supplied clean variant where one exists. do not erase artist
  signatures or messages. retain source filenames and artist identity with any
  derivative. credit the sketch combo to sobu (@sobsocks).
- white/red remains the website's ui palette. preserve commissioned art colors;
  do not recolor the artwork to force palette compliance.
- do not substitute commission art for an actual release's cover or fabricate an
  association between a commission and a release.
- this source selection is not deployment approval. the user is reviewing the
  preview and will separately authorize deployment.

## web derivatives

`scripts/prepare-commission-assets.mjs` produces six webp files in `public/art/`
without cropping, recoloring, or modifying originals. large gallery derivatives
are 256 kib (suyosuyo), 360 kib (sobu), and 45 kib (7mmchan); the small sticker is
14 kib. responsive variants and lazy loading avoid sending full originals.
`src/data/commissionArt.ts` keeps the displayed artist credits and image metadata.

`npm run test:assets` verifies attribution, dimensions, payload budgets, and the
separate web vrm's rig/geometry preservation. source files and layered documents
remain outside the website's public directory.

the gallery preparation script writes its new derivatives through
`public/art/gallery` into `S:\Codex\outputs\2026-09-12\site-gallery\assets`.
the source inventory is outside public assets. artist messages are preserved in
separate selectable versions, and loose non-skeb files are excluded from this pass.
