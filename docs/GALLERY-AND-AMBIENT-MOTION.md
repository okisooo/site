# gallery and ambient motion / 2026-09-12

deployed at `https://okiso.net/gallery` on 2026-09-12 with six works and sixteen
versions. @ykhs9 work 16 remains pending its converted delivery. the user requested
all their skeb commissions in
a gallery that can grow, plus more idle motion using saved references. they
explicitly corrected the initial folder-based lookup: **skeb is the collection
authority**. loose files outside skeb are not additions for this pass.

## verified skeb collection

used the existing signed-in chrome session and the complete sent-request list.
six completed requests are listed, ending with the site's end-of-list message.
no pending requests, briefs, purchase amounts or private delivery URLs are exposed
on the website. existing source files were reused only after matching the delivery
and creator to skeb.

| artist handle | verified work | gallery state |
| --- | --- | --- |
| @ykhs9 | https://skeb.jp/@ykhs9/works/16 | pending converted delivery file; 2000 x 1500 psd shown on skeb |
| @suyosuyo | https://skeb.jp/@suyosuyo/works/65 | included with expression/message variants |
| @7mmchan | https://skeb.jp/@7mmchan/works/25 | included with delivered variants |
| @engawa110 | https://skeb.jp/@engawa110/works/2026 | included; original spinning animation and message version |
| @kou768 | https://skeb.jp/@kou768/works/22 | included with framed/message variants |
| @amaxa58700 | https://skeb.jp/@amaxa58700/works/14 | included with clean/message versions; displayed credit amaxa |

the previously approved sobu (@sobsocks) commission remains included with its
line-art version. it is not claimed to be a skeb commission; no invented profile
or work URL was added. current gallery: **six works / sixteen versions** (five
skeb works plus sobu). the missing @ykhs9 delivery will make seven works.

## exact outstanding action

the user was asked to save @ykhs9 work 16's converted delivery under
`S:\Codex\outputs\2026-09-12\site-gallery\` and report when ready. browser security
policy blocked `chrome://settings/downloads`, preventing selection of the required
download destination. do not bypass that blocked settings action with another
browser-control mechanism. no stock SAMPLE preview was stripped or substituted,
and no file was sent to photopea or another external editor.

when the delivery arrives: inspect it, create right-sized derivatives in the
existing gallery assets directory, add its record and verified skeb links to
`src/data/gallery.ts`, rerun asset tests/build/seo, and review the new card/viewer.
do not call the whole skeb collection complete before this work is added.

## implemented

- `/gallery` shares the white/red editorial shell. search and artist filtering,
  empty/reset state, twelve-work incremental display, full-art dialogs, keyboard
  previous/next, variant selection and artist/work links support a larger catalog.
- the homepage keeps its curated art room and links to the full collection. the
  shared navigation now links directly to the gallery. sitemap and llms.txt include
  it; gallery metadata is indexable with its own canonical URL.
- animations use original delivered frames. following the user's sept 12 correction,
  visible gallery thumbnails and full-art variants animate automatically. the viewer
  retains play/pause; reduced motion and the ambient pause preference keep artwork
  still. originals, embedded artist messages and colors remain
  intact. no generated or replacement artwork.
- the hero now uses the original 3d character with a pose, blinking and breathing.
  sticker movement, sleeve reflections and printed background graphics use local
  transforms. an artist-credit strip moves on the gallery. a contained footer
  wave panel reuses the existing react bits `Waves.tsx` from the saved toolkit.
- the footer pause control freezes idle motion and removes the wave renderer;
  resume restores it. intersection/visibility checks stop work offscreen or when
  standard browser visibility events report the page hidden. reduced motion skips
  ambient rendering. the waves' touch listener is now passive.

saved reference used: `D:\SecondBrain\vault\20-shared\premium-frontend-toolkit.md`.
its old package/version/design status was treated as historical; current source
and the approved editorial direction remain authoritative. the compiled codex
memory index contained only zero bytes, so it supplied no usable design facts.

## storage and future additions

`public/art/gallery` is a new directory junction to
`S:\Codex\outputs\2026-09-12\site-gallery\assets`. git enumerates the actual image
files beneath it; stage selected assets as normal files if publishing is later
authorized. no existing asset directory was relocated or replaced.

`scripts/prepare-gallery-assets.mjs` takes `OKISO_GALLERY_OUTPUT_DIR` and writes
separate web derivatives. it retains the source animation's 31 frames / 1400ms
timing. artwork files are under the image budgets checked by `test:assets`.
the source/derivative inventory stays outside public assets at
`S:\Codex\outputs\2026-09-12\site-gallery\asset-inventory.json`.
the current collection's 34 image resources total 4,480,610 bytes across all
versions and animation files; this is not the initial-page download size.
the checked full-page preview is saved as `gallery-preview.png` in that output
folder. the signed-in chrome requests tab is left available for the missing file.

future additions use skeb to verify the creator and work, then add one catalog
record per commission and group its versions. raw psd files and private request
data do not belong in public assets.

## verification

- explicit typecheck and all 32 tests passed; production export generated 51
  routes/resources, with build-time types checked. seo passed for 39 indexable
  pages, 34 linked releases, 4 noindex routes and 105 local tracks.
- browser checks covered desktop and 390px phone gallery layouts, no document
  overflow, search, artist filtering, empty/reset, full-art variants, original
  animation play/pause, keyboard next artwork, escape and focus restoration.
- ambient pause removed the footer canvas; resume restored one. measured hero
  bounds changed during idle animation. no browser errors/warnings were captured
  in these checks. viewport overrides were reset.
- no physical-device performance profiling or os-level reduced-motion emulation.
  the future twelve-work pagination threshold is not exercised by this six-work
  catalog. lint remains skipped in the existing build configuration. no remote
  ci, commit, push or deployment occurred in that initial gallery check. the
  subsequent launch passed both remote workflows and live checks for all 43
  pages and 64 resources, including all gallery files. the @ykhs9 addition is
  still outstanding.

scratch/check logs: `S:\tmp\codex\site-gallery-20260912`.
