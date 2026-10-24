# commissioned artwork for the site

## kouchanthree / 2026-10-24

Request 4046160 / public work 18 completed October 24 at 17:34 JST. The delivery
contains two 2800 x 4977 opaque RGBA PNGs: `4046160-1.png` includes the artist's
thank-you message; `4046160-2.png` is the artist-supplied clean illustration.
Both original files are preserved unchanged, decoded and SHA-256 verified in
`D:/FOLDERS/Commissions/Bought/OKISO/kouchanthree@skeb/work-18.manifest.json`.
There is no PSD, animation, separate character layer or further delivered version.

The new credited gallery/home entry offers both versions, with the clean
illustration first. Four display WebPs are physically saved under
`S:/Codex/outputs/2026-10-24/skeb-import-2/gallery/`; main images are 1013 x 1800
and thumbnails are 360 x 640. No enlargement, cropping or embedded-message
removal is used. Reproduce with `scripts/prepare-gallery-assets.mjs`, setting
`OKISO_GALLERY_SOURCE_PREFIX=kouchanthree` and an S: `OKISO_GALLERY_OUTPUT_DIR`.
Originals stay private; only resized previews are published. Import receipts,
archive hashes and release verification are under
`S:/Codex/outputs/2026-10-24/skeb-import-2/`.

## pen / @pen_117 / 2026-10-24

Request 4119838 / public work 241 completed October 24. All three delivered
originals are decoded and hashed: two 1666 x 2500 RGBA PNGs (framed and
transparent) plus a matching layered PSD. Physical private archive:
`D:/FOLDERS/Commissions/Bought/OKISO/pen_117@skeb/work-241.manifest.json`.

The PSD has three root layers and 28 total layers, all visible. It supplies
one expression, a separate frame and complete character/line-art groups; no
dedication layer or hidden expression variants were found. `converted/` keeps
the native 1895 x 2758 transparent character, 1414 x 2455 transparent line art
and 1570 x 2385 transparent frame. All six archive files retain their profiles
and alpha. The supplied PNGs preserve the artist's intended canvas crop.
Reproduce with `scripts/export-pen117.py --output-dir <S: scratch>` and archive
the generated `exports.json` through the skeb-download completion helper.

The credited gallery/home entry offers framed, transparent and line-art views.
`prepare-gallery-assets.mjs` registers their archive sources; set
`OKISO_GALLERY_SOURCE_PREFIX=pen117` for a scoped regeneration. Main previews,
thumbnails and applicable 960px art-room images are physically saved in
`S:/Codex/outputs/2026-10-24/skeb-import/gallery/`. Main previews are 75-310 kB.
Originals and PSDs remain private; only resized display derivatives ship.
Import receipts, pixel/privacy checks and release evidence are under
`S:/Codex/outputs/2026-10-24/skeb-import/`.

## lina / @nanashinolina / 2026-10-09

Request 4070361 / public work 32 completed October 8. The signed-in delivery
reports five files, all downloaded and decoded: four 2894x4093 RGBA PNGs and
one 2894x4093 PSD. Originals, hashes and dimensions are in
`D:/FOLDERS/Commissions/Bought/OKISO/nanashinolina@skeb/work-32.manifest.json`.
The artist folder is physically on D:, as explicitly permitted for this skill.

All five PSD layers were visually inspected: blank paper, transparent portrait
with mascot, transparent full body, artist-message collage and clean collage.
There are no additional expression or outline layers. `converted/` retains four
lossless native-resolution artwork exports: both 2894x4093 collages, the
1609x3703 full body and the 2035x3739 portrait. Delivered PNGs retain their
original full-canvas transparency; layer exports retain their supplied bounds.
All nine archive files are decoded and hashed. Messages, alpha and embedded
color profiles are retained without repainting or embedded-text removal.

Reproduce with `scripts/export-nanashinolina.py --output-dir <S: scratch>` and
archive its `exports.json` through the skeb-download helper. The exporter resolves
the physical archive path before constructing helper destinations.
`scripts/prepare-nanashinolina.mjs` requires `OKISO_GALLERY_OUTPUT_DIR` and
`OKISO_GALLERY_INVENTORY` on S:. Four selectable gallery views use eight WebPs
through the existing gallery asset junction; originals stay outside public assets.
Artist and work links are verified against the delivery's visible links.

## OTORIxxx / 2026-10-05

Request 4043266 / public work 37 completed October 4, verified against the entire
signed-in completed list. All three delivered originals are preserved under
`D:/FOLDERS/Commissions/Bought/OKISO/OTORIxxx@skeb/`, physically on D: after the
October 9 storage clarification and verified removal of the former S: junction.
The GIF is 800x800, 100 frames at 40ms, looping every four seconds. The PSDs are
6668x6668 and 5667x9029. `work-37.manifest.json` verifies 22 files with hashes:
three originals plus 19 full-resolution lossless PNGs in `converted/`.

Exports include the complete diary collage, artist asset guide, transparent
asset sheet, portrait, holographic sticker, pixel character, two sheet keychains,
six mascot poses, name sticker, portrait card, and the square PSD's separate
keychain, ring and pencils. The artist's guide/message and all embedded credits
are retained. The guide's separate info group is omitted only from reusable
transparent exports. Individual sheet pieces follow empty gutters and preserve
the artist-supplied alpha; no backgrounds, signatures or painted text are erased.
No hidden alternate expression or outline layers were found.

`scripts/export-otori.py --output-dir <S: scratch>` reproduces the PNG exports;
archive its `exports.json` with the skeb-download helper. `scripts/prepare-otori.mjs`
requires `OKISO_GALLERY_OUTPUT_DIR` and `OKISO_GALLERY_INVENTORY` on S:.
Twenty gallery choices use 41 WebPs through the existing gallery junction.
The animated WebP preserves all 100 frames and 4000ms timing at 360px, 485160
bytes. Originals and lossless exports stay outside public website assets.

## ObakenoPerutan / 2026-09-30

Request 4070366 is complete with one 4559x3950 PSD (96,949,892 bytes), matched
to `https://skeb.jp/@ObakenoPerutan/works/14`. Original SHA-256:
`2f7e919f51ccce48a41f151f05fd53da4877384d4998890dc0e7c1c85aaf5e81`.
Archive: `D:/FOLDERS/Commissions/Bought/OKISO/ObakenoPerutan@skeb/`.
The original PSD and Skeb converted PNG are preserved. `converted/` holds both
full-resolution collages (with/without the artist message), five native-resolution
transparent character illustrations, and a verified copy of the Skeb composite.
All are decoded and hashed in `work-14.manifest.json`. The message is embedded
in one supplied collage; the other collage is the artist's message-free version.
No repainting, embedded-text removal or fabricated expressions were used.

Reproduce layer exports using `scripts/export-obakeno-perutan.py --output-dir`
with S: scratch and `psd-tools`/Pillow, then archive its `exports.json` through
the skeb-download helper. `scripts/prepare-obakeno-perutan.mjs` prepares seven
gallery versions and thumbnails with `OKISO_GALLERY_OUTPUT_DIR` set to the
existing S: gallery asset directory. Main images are 85–393 kB WebPs; originals
and lossless exports remain at their delivered dimensions. Artist/work links
and all seven choices are in `src/data/gallery.ts`.

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
