# website release review / 2026-09-12

candidate prepared from `feat/home-tactical` at `9c7f516`, with intentional
uncommitted website work. preview: http://localhost:3000/. on 2026-09-12 the user
authorized launch: "lets continue, i wanna get it deployed today". commit the scoped
candidate, integrate the current main catalog, verify that clean release tree,
then publish through the existing github pages workflow.
updated after the user's motion revision request: the prior opening was rejected;
the new 1.9-second split sleeve and shared motion treatment need visual review.
the user subsequently praised the current website and reported intermittent
video picture loss after switching codex tasks/browser tabs. the latest candidate
includes bounded frame recovery and a same-video restore control. the original
blackout is not reproduced or claimed fixed; normal user task switching remains
the next check. the subsequent launch request above authorizes publishing.
the newest request adds a skeb-backed gallery and more idle motion. the gallery
and motion controls are implemented, but @ykhs9 work 16 still needs its converted
delivery file before the full collection is complete. see
`GALLERY-AND-AMBIENT-MOTION.md`. the launch timing preference for that one missing
file was requested while the six-work release is prepared. do not describe the
full skeb collection as complete before it is added.

## candidate

one white/red editorial design across the homepage, archive, release details,
upcoming, public vault, navigation, player and dialogs. real commissioned art
and the original rigged character are integrated. sobu is credited as
`sobu · @sobsocks`. rouge noir retains its separate design; its existing change
adds structured-data context only.

scope includes the existing release-data parsing and oauth expiry-normalization
source changes and their fixture tests, but no live oauth setup or credential
operation. the release-refresh workflow's local change is only its node version.
no backend, private vault data or analytics integration is part of this release.

## previous local verification

- all 32 local tests passed, including video recovery and gallery asset checks.
- existing static export seo audit passed: 39 indexable pages, 34 linked releases,
  4 noindex routes and 105 local tracks.
- fresh full dependency audit: zero known vulnerabilities.
- current browser checks passed for character controls and cleanup, sobu gallery
  selection/full-art credit, archive search/quick-listen, phone navigation,
  upcoming, public vault and unlock-dialog dismissal.
- phone character rendering selected battery saver, with a 311 x 403 canvas at
  a 390 x 844 viewport. checked views had no horizontal document overflow.
- prodigy playback advanced beyond 10 seconds; pause and player close worked.
- scoped tracked website diff whitespace check passed.

the later motion pass adds a 1.9-second art/title opening, hero settling,
scroll entrances, card/link feedback, page/menu motion and dialog exits.
its explicit typecheck, all 25 tests, production export and seo audit passed.
desktop/phone opening, immediate skip, replay, return navigation, archive search,
dialog focus/dismissal, public vault and model lifecycle were checked. no browser
warnings/errors were captured in the checked interaction sequence.
artwork and audio files are preserved. a 2.6-second recording (including the
settled homepage) is at `S:\tmp\codex\site-motion-20260912\opening-preview.mp4`.

## verification limits

production build and explicit typecheck were rerun and passed after the motion
changes on sept 12. lint is bypassed in the existing build config
and has not passed. no physical-device performance or os-level reduced-motion
check was run. remote ci and post-deployment checks have not run. this is not
an audit of the separate api server, nor evidence of improved search rankings.

video recovery was tested while paused/muted at 84 seconds and while playing at
about 92.5 seconds; the same video and playback state were preserved. the automatic
missing-frame branch is covered deterministically, not by reproduction of the
intermittent codex blackout. hosts that report healthy frames despite a blank
surface can use the manual restore control. reference: [video frame callbacks](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback).

## authorized publishing procedure

1. review and stage only the explicit candidate paths below; inspect the staged
   diff before committing. preserve unrelated user changes. do not mass-stage.
2. build and test the resulting release tree, with build/cache storage on s: and
   no simultaneous next dev server. the local preview currently reflects a dirty
   working tree, including pre-existing audio; it is not the publishing artifact.
3. publish through the existing deployment process under the launch request.
   use committed release content and its fresh export, not a copy of local out.
4. verify remote ci and the deployed home, archive, release detail, public vault,
   art/model loading, canonical/robots/sitemap and audio playback. record results.

excluded: all `public/audio` modifications, `scripts/authorize-toolost.ts`,
root utility/test files, `api_backup`, local skill directories, generated
`next-env.d.ts`, raw model/texture intermediates, local build junctions, and
recovery backups. preserve them. source commission originals remain untouched.
repo agent/historical handoff edits are not required deployment files.

## explicit candidate application paths

this inventory is a review/staging proposal, not a staging operation. it records
the current modified and new application files; review again if the tree changes.

- `src/Components/Editorial/EditorialOpening.tsx`
- `src/Components/Editorial/useEditorialMotion.ts`
- `src/styles/editorial-motion.css`
- `src/lib/videoRecovery.ts`
- `src/lib/videoRecovery.test.ts`
- `src/Components/Editorial/AmbientMotion.tsx`
- `src/Components/Editorial/CommissionGallery.tsx`
- `src/app/gallery/page.tsx`
- `src/data/gallery.ts`
- `src/styles/gallery.css`
- `src/Backgrounds/Waves/Waves.tsx`
- `scripts/prepare-gallery-assets.mjs`
- `public/art/gallery/` — 28 current webp derivatives; enumerate exact files before staging, including the pending new work only after it is verified

- `.github/workflows/deploy.yml`
- `.github/workflows/update-releases.yml`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `public/art/7mmchan-256.webp`
- `public/art/7mmchan-640.webp`
- `public/art/sobu-1280.webp`
- `public/art/sobu-640.webp`
- `public/art/suyosuyo-1280.webp`
- `public/art/suyosuyo-640.webp`
- `public/character/okiso-web.vrm`
- `scripts/audit-seo.ts`
- `scripts/perf/static-server.mjs`
- `scripts/prepare-commission-assets.mjs`
- `scripts/prepare-vrm.mjs`
- `src/app/api/auth/callback/layout.tsx`
- `src/app/api/auth/callback/page.tsx`
- `src/app/globals.css`
- `src/app/lab/releases/page.tsx`
- `src/app/lab/soft-orbit/page.tsx`
- `src/app/lab/soft-orbit/soft-orbit.module.css`
- `src/app/lab/soft-orbit/SoftOrbitLab.tsx`
- `src/app/layout.tsx`
- `src/app/llms.txt/route.ts`
- `src/app/not-found.tsx`
- `src/app/page.tsx`
- `src/app/releases/[slug]/page.tsx`
- `src/app/releases/metadata.ts`
- `src/app/releases/page.tsx`
- `src/app/releases/ReleasesClient.tsx`
- `src/app/robots.ts`
- `src/app/rouge-noir/page.tsx`
- `src/app/sitemap.ts`
- `src/app/upcoming/metadata.ts`
- `src/app/upcoming/UpcomingClient.tsx`
- `src/app/vault/page.tsx`
- `src/Components/3D/ReleaseOrbit.tsx`
- `src/Components/BA/CustomVideoPlayer.tsx`
- `src/Components/BA/ReleaseGrid.tsx`
- `src/Components/Editorial/ArtRoom.tsx`
- `src/Components/Editorial/CharacterStudio.tsx`
- `src/Components/Editorial/DiscordPresence.tsx`
- `src/Components/Editorial/EditorialDialog.tsx`
- `src/Components/Editorial/EditorialHome.tsx`
- `src/Components/Editorial/EditorialMusicPlayer.tsx`
- `src/Components/Editorial/SiteFrame.tsx`
- `src/Components/PlayReleaseButton.tsx`
- `src/Components/ThemeProvider.tsx`
- `src/Components/TrackLyricsToggle.tsx`
- `src/Components/Vault/VaultClient.tsx`
- `src/Components/Vault/VaultStack.tsx`
- `src/context/MusicPlayerContext.tsx`
- `src/data/commissionArt.ts`
- `src/data/releases.ts`
- `src/lib/artAssets.test.ts`
- `src/lib/deploymentConfig.test.ts`
- `src/lib/dialogKeyboard.ts`
- `src/lib/fetchTooLostReleases.test.ts`
- `src/lib/fetchTooLostReleases.ts`
- `src/lib/localPlaylist.ts`
- `src/lib/releaseLinks.test.ts`
- `src/lib/releasePresentation.ts`
- `src/lib/seo.ts`
- `src/lib/siteDesign.test.ts`
- `src/lib/siteDesign.ts`
- `src/lib/tooLostOAuth.test.ts`
- `src/lib/tooLostOAuth.ts`
- `src/styles/editorial.css`

include the current design, art, commission, security, seo and release-review
notes with the selected documentation commit, including RESUME-WEBSITE.md.
