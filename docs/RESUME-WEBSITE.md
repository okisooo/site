> read this entire file, then continue the work described below. you have no prior chat history.

# task

finish and deploy the existing website in `D:\GitHub\site`. the user authorized
today's launch on 2026-09-12: "lets continue, i wanna get it deployed today".
recover from a chat-history mismatch by grounding work in the current
files, not by restarting the design or reverting to old chat summaries. this is
the current resume checkpoint, created 2026-09-11 and recovery-checked on
2026-09-12; keep it current as work lands.

## continuity recovery / 2026-09-12

the user asked to recover the conversation, start a fresh continuation and keep
working on the website without losing progress. the existing local checkout is
the intended starting point, not a fresh checkout from the last commit.

- current branch/head and the sept 11 website files were rechecked: they remain
  `feat/home-tactical` / `9c7f516` with the uncommitted art, design and security
  work present. there was no newer website task among the recent tasks checked.
- a verified, user-facing transcript export is preserved outside the app and
  repository at `S:\CodexBackups\website\2026-09-12\conversation.md`: 111
  messages (17 user, 94 assistant), parsed without malformed lines. internal
  reasoning, tool results and system/developer instructions are excluded.
- the same backup directory preserves the original composition-reference,
  approval and sobu-credit screenshots, plus a dated copy of this checkpoint.
  keep it; this is a requested recovery artifact, not disposable scratch.
- only messages present in the saved session could be recovered. do not claim
  that an absent continuation was found or that the app's persistence bug is
  repaired. the original task and session file were not reset or deleted.
- use this checkpoint for orientation; read the transcript only for a specific
  disputed decision. keep completed work, current verification, blockers and
  the next concrete action updated here before every handoff. do not use old
  july/august handoffs to restart the design.

## current update / 2026-09-13

the user requested a fuller commission background on entry and no moving graphics
over the footer. deployed source `23a0e34` replaces the two-panel hero montage with eight
staggered prints from six credited artists, including the looping engawa animation.
`HeroCommissionWall.tsx` uses existing web assets and the ambient visibility hook.
the page graphics now live inside `ed-content-stage`, clipped and faded before
the footer; the footer keeps its own contained waves. the 1.9-second opening,
posed hero and existing content remain in place. obsolete collage CSS was removed.

desktop and 390px phone checks showed no horizontal overflow and zero background
overlap with the footer. all eight print images loaded, global pause froze them
and used the still animation frame, and resume restored running movement and the
animated WebP. dialog layering was verified after keeping the new content wrapper
out of its own stacking context. no captured browser errors/warnings. all 32 tests,
the type-checked production build and seo audit passed. deployment `34715291748`
and pages rollout `34715365494` passed; published asset commit `4ea05b7`. live
checks verified all eight loaded prints, running drift, the animated WebP, a ready
3d hero and zero footer overlap/viewport overflow, with no captured errors/warnings.
the local preview was stopped and the browser is on the live homepage. lint remains
skipped; no physical-device or operating-system reduced-motion test was performed.

the signed-in Skeb completed list was checked through its end again: six deliveries.
@ykhs9 work 16 is still the missing site addition (one 2000 x 1500 PSD, displayed 8 MB).
the user authorized Chrome's existing download folder for this one file, then moving
the verified original to `S:\Codex\outputs\2026-09-13\skeb\`. a normal Download(Raw)
click reached the signed file link, but Chrome returned ERR_BLOCKED_BY_CLIENT; no
new file appeared in the checked Downloads directory. the user has been asked to
download the raw delivery manually and provide its path. do not ask for the same
storage exception again, bypass the browser block, publish a SAMPLE preview, or
claim the new work was downloaded. the existing `skeb-download` skill was updated
with the scoped exception and observed failure; its package validation passed.
the helper still has no verified end-to-end Skeb transfer.

the user then reaffirmed `D:\FOLDERS\Commissions\Bought\OKISO` as the originals
archive. its existing artist folders were checked against the Skeb inventory;
the missing delivery was not present. use that confirmed archive for the original,
with web derivatives on s:. this destination is recorded in the skill; the storage
exception did not overcome the separate Chrome download block.

screenshots: `S:\Codex\outputs\2026-09-13\site-art-wall\`.
build/test logs: `S:\tmp\codex\site-art-wall-20260913\`.
automatic approval review rejected cleanup of this run's `uv-cache` (1,795,101
bytes) and download-inventory scratch files with "blocked by policy". they remain
at that scratch path; do not retry their deletion using another mechanism.

## deployed hero update / 2026-09-12

the latest user request adds automatic animated commissions, a sharper posed 3d
hero, and more visible background movement. the update is deployed at `https://okiso.net`
from source `76d1dcd`. it reuses `CharacterStudio` in a
hero mode, with a raised-hand pose, breathing, blinks, subtle head/pointer response,
and a lossless image fallback. it starts after the first idle opportunity without
extending the 1.9-second opening. the existing optimized vrm is 9,065,872 bytes;
network and device speed still determine when the live model replaces its fallback.

the hero renders at up to 30 fps, uses bounded pixel density, and stops when hidden,
offscreen, behind its studio dialog, or when ambient motion is paused. the shared
studio retains its controls. gallery thumbnails and opened animated variants now
loop automatically while visible; pause and reduced-motion preferences still apply.
moving red print marks, fine groove lines, stripes and artwork drift extend the idle
motion across the site without moving reading text or controls.

all 32 tests, the type-checked 51-resource production build and seo audit passed.
browser checks covered the visible pose, phone layout, studio controls, automatic
gallery loops and alternate versions, and pause/resume. rendered-frame counts stayed
fixed offscreen and behind the studio; global pause held the hero at 3 frames, and
resume advanced it to 97 while the groove/montage animations switched back to running.
no captured warnings/errors; no physical-device or os-level reduced-motion test.
deployment `34686788955` and pages rollout `34686845733` both passed; published
asset commit `d5328c1`. live checks confirmed the model loaded and advanced from
4 to 1530 rendered frames, the groove animation was running, and the gallery used
the loaded animated WebP automatically. the hero canvas was removed on gallery
navigation. the temporary local preview was stopped, and the browser is left on
the live homepage. screenshots: `S:\Codex\outputs\2026-09-12\living-hero\`.
logs: `S:\tmp\codex\site-living-hero-20260912`.

the user's follow-up restores the discord widget as their profile, replacing the
generic "come hang out" headline and activity teaser. `334d6a0` presents the live
display name, handle, circular avatar, avatar decoration, public-flag badges and
custom profile text. availability is a small avatar indicator; listening/app
activity stays in the expanded profile. existing server and copy-handle actions
remain. animated avatar/decoration display follows the ambient-motion preference.

the production build, 11 design tests and seo audit passed locally. browser checks
verified avatar/decoration/badge loading, profile identity, phone layout without
overflow, dialog dismissal and focus restoration. motion pause/resume hides/restores
the decoration without removing profile identity. no captured warnings/errors.
deployment `34685075585` and pages rollout `34685146689` both passed; all four
regression suites and the production/seo checks passed remotely. the live card
was checked with the correct name, handle, avatar, decoration, both public badges
and custom text. the temporary preview process was stopped; the browser shows
`https://okiso.net/#watch`. screenshot: `S:\Codex\outputs\2026-09-12\discord-profile\profile-card.png`.

the website is deployed at `https://okiso.net` as of 2026-09-12. the launch request
is complete for the six ready gallery works. older statements below about missing
authorization or pending publishing describe earlier checks. preserve unrelated
local audio and utility changes; they were excluded from this release. the live
catalog retains all 34 upstream releases.

the skeb gallery and idle-motion request is implemented except for one delivery.
the user explicitly corrected
the source: **look on skeb, not the folders**. the signed-in completed-request
list was checked and contains six delivered commissions. the new `/gallery`
currently includes five of those plus the existing sobu work: six works with
sixteen versions. **@ykhs9 work 16 is still missing its converted delivery file.**
see `docs/GALLERY-AND-AMBIENT-MOTION.md` for verified work links and exact limits.

the user was asked to save that delivery to
`S:\Codex\outputs\2026-09-12\site-gallery\`. browser security blocked access to
chrome download settings; do not circumvent the block or use a SAMPLE preview
as the delivered image. once the file arrives, inspect/prepare its derivatives,
add the seventh gallery work, then repeat asset/build/seo checks and review.
do not call the full skeb collection complete before that addition. the user was
asked whether to launch with the six ready works or wait for the new delivery.
with no revised timing supplied during release preparation, the assistant stated
the launch assumption: publish the six ready works today and add the newest
delivery when its file is available. this is not a claim of a complete collection.
the existing white/red design, 1.9-second opening and video recovery
remain intact; the user's intermittent codex video blackout is not confirmed fixed.

## clean release verification / 2026-09-12

the 117-file candidate was committed as `a7f9182` and integrated with main in
`604939b` on `codex/deploy-editorial-20260912`. the isolated release checkout is
`S:\tmp\codex\site-launch-20260912\release`; it includes no changed audio files,
unrelated utilities, raw art intermediates or local environment credentials.
the catalog is byte-identical to the current upstream version.

fresh `npm ci`, all 32 tests, production build (51 resources, types checked), seo
(39 indexable pages, 34 releases, 4 noindex routes, 105 tracks) and dependency audit
(zero known vulnerabilities) passed. the clean browser preview loaded the model,
played PRODIGY to 6 seconds, opened credited gallery variants and filtered the
archive on a 390px phone viewport without horizontal overflow. viewport reset;
no warnings/errors were captured. the original intermittent video blackout is
still not reproduced. lint remains skipped; no physical-device check was run.

source release: `c1e46bb3a9d6d0f7f3748f975358f0798afab0bf`. deployment workflow
`34683894229` and pages rollout `34683962097` both passed; published asset commit
`af77b57a447b3081241ab40f646ff159c44abd2d`. live checks passed for 43 pages and 64
resources, including every shipped gallery image, the web model, scripts/styles,
robots/sitemap and correct canonicals. audio byte ranges returned 206. the live
editorial home and gallery are present; GODISH played past 6 seconds and TENSEI
RINGO past 12 seconds at 1920 x 1080 with visible frames. the public vault feed
loaded its visible collections. playback was stopped after testing.

report: `S:\Codex\outputs\2026-09-12\site-launch\live-checks.json`. action logs
remain under `S:\tmp\codex\site-launch-20260912`. after verification, the temporary
preview process was stopped and its isolated checkout, install and build outputs
were removed. the browser is left on the live gallery. the working source in
`D:\GitHub\site` has been fast-forwarded to the published release while preserving
all 110 unrelated audio modifications and the other dirty files. the @ykhs9
delivery is the outstanding gallery addition.

## gallery and idle motion / 2026-09-12

- added `/gallery`, search/filter/reset, scalable twelve-item display, credited
  full-art viewer, keyboard navigation and grouped original variants. current
  collection: 6 works / 16 versions, with one more skeb delivery pending above.
- added subtle hero/sticker/sleeve idle motion, a moving credit strip, and the
  saved react bits waves as a contained footer detail. pause/resume, visibility
  and reduced-motion controls govern idle work; no new animation dependencies.
- source/reference/verification details live in `GALLERY-AND-AMBIENT-MOTION.md`.
  `public/art/gallery` is a new junction into
  `S:\Codex\outputs\2026-09-12\site-gallery\assets`; keep generated asset bytes
  on s: and stage exact files only after release authorization.
- typecheck, all 32 tests, production export (51 resources, types checked) and seo
  (39 indexable pages, 34 releases, 4 noindex routes, 105 local tracks) passed.
  desktop/phone gallery interactions, focus/escape, animated art controls and
  ambient pause/resume were checked. physical-device and os preference tests,
  remote ci and final publishing remain undone. no commit, push or deployment.

the 1.9-second motion candidate remains implemented at localhost:3000.
a screen-captured recording is saved at
`S:\tmp\codex\site-motion-20260912\opening-preview.mp4`; the footer has a
`replay opening` button. the homepage opens with a 1.9-second split sleeve using
real commissioned artwork, then settles into the existing composition.
see `docs/WEBSITE-RELEASE-REVIEW.md` for scope and verification limits.

## video return recovery / 2026-09-12

- user clarified that switching browser tabs/codex tasks, not website routes,
  triggers the intermittent picture loss while sound continues. selecting another
  video restores it. this points toward rendering, but the root cause is unproven.
- inspected the existing running player without reloading first: original mov
  source, readyState 4, 1920 x 1080 video, advancing time and visible frames; no
  captured player warnings/errors. hiding the in-app browser through its tools
  still reported `document.hidden === false`, so that was not a valid simulation
  of a normal hidden browser tab. a temporary tab in the same browser was closed.
- added `src/lib/videoRecovery.ts` and six deterministic regression tests. a
  focus/visibility/pageshow probe waits for continuing video-frame callbacks. it
  rebuilds the media element once only if playback advances with future data but
  frames do not arrive. paused, seeking, hidden, offscreen and buffering media are
  excluded; timers/callbacks are cleaned up on source changes and unmount.
- `restore video picture` (circular-arrow control) performs the same replacement
  on demand, keeping position, play/pause intent, volume, mute and playback rate.
  the same source is reattached through the existing hls/native setup. no video
  switch is required. actual media events drive play state, and rejected play
  requests provide an actionable message instead of an unhandled promise.
- tests cover settings preservation, paused/playing restoration, valid seek
  bounds, missing frames, healthy frames, duplicate return events, excluded states
  and cleanup. `npm run test:design` includes these tests for existing ci coverage.
- newly passed explicit typecheck, all 31 tests, production export (50 generated
  resources, build types checked), seo (38 indexable pages, 34 release links,
  4 noindex routes, 105 local tracks) and scoped diff whitespace check.
- browser recovery checks: paused/muted at 84 seconds stayed paused/muted at 84
  with the actual picture visible; playing recovery continued from about 92.5 to
  93.5 seconds, preserving the selected video. these verify recovery behavior,
  not reproduction or elimination of the original codex rendering failure.
- automatic recovery cannot detect a host displaying a blank surface while still
  reporting healthy frame callbacks, or a host emitting no return events. the
  manual control remains available. no browser/profile switch, backend, asset,
  credential or deployment changes. logs: `S:\tmp\codex\site-video-recovery-20260912`.

## motion refinement / 2026-09-12

- replaced the previous fade/rise with a split sleeve opening: suyosuyo and sobu
  art enter with the okiso lettering, a red seam crosses, and two halves part to
  reveal the homepage. original assets are reused without changes or generation.
- first-paint css owns the 1.9-second deadline; slow images and hydration do not
  extend it. css hides the overlay even without javascript. keyboard, pointer,
  wheel and touch input dismiss it; reduced motion and anchor entry bypass it.
  it plays on a fresh homepage load, not on client-side return navigation.
- coordinated hero settling, one-time scroll entrances, release sleeve lifts,
  directional link feedback, menu stagger, page headings, gallery/deck changes,
  player arrival and short dialog exits share the same easing. existing vault
  expansion animation and standalone visual identities are retained.
- added `EditorialOpening.tsx`, `useEditorialMotion.ts` and
  `src/styles/editorial-motion.css`; changed the shared frame/dialog, homepage
  deck image key, css import and removed the old hero arrival rules.
- freshly passed explicit typecheck, all 25 tests, production build (50 generated
  pages/resources, types checked) and exported seo (38 indexable pages, 34 release
  links, 4 noindex routes, 105 tracks). lint remains skipped by existing config.
- browser checks covered the opening on desktop and 390px phone, no document
  overflow, immediate escape skip, replay, and no replay on return navigation.
  sampled opening frames at 283 through 1960ms; overlay was removed by the final
  sample. the 2.6-second recording includes the settled page after the opening.
- archive search, quick-listen focus containment/dismissal, mobile menu, public
  vault loading, and character-room close during loading and after canvas creation
  passed. canvas count returned to zero and focus returned to the opener.
- reduced-motion behavior is implemented in css and the observer/intro logic;
  os-level preference emulation and physical-device performance remain untested.
  no new dependencies, audio edits, original-art edits, backend changes, private
  vault actions, commits, pushes or deployment. preserve unrelated dirty files.
- preview retains the existing static server. only the export was rebuilt;
  no parallel next development server was started. build/test/typecheck logs and
  the motion recording are in `S:\tmp\codex\site-motion-20260912`.

## fresh continuation verification / 2026-09-12

- reread the current design, art, security and commission notes. old second-brain
  handoffs remain historical; no redesign or chat-bug investigation was done.
- verified branch/head `feat/home-tactical` / `9c7f516`. reused the existing
  loopback static server, pid 25544, listening on 127.0.0.1:3000. the preview is
  open in this task and returned to the homepage with playback stopped.
- newly ran all 25 tests: 25 passed. newly audited the existing export: 38
  indexable pages, 34 release links, 4 noindex routes and 105 local tracks passed.
  a fresh full npm audit reports zero known vulnerabilities; its json is in
  `S:\tmp\codex\site-preview-20260912\audit.json`.
- browser review: character loading, portrait, happy expression, wave, pause,
  escape, focus restoration and canvas removal; sobu selection and full-art
  attribution; archive search and quick-listen; phone menu, upcoming empty state,
  public vault counts (3 projects / 9 tracks / 3 open) and unlock-dialog dismissal.
  no private login or vault operation was exercised.
- at a 390 x 844 phone viewport, the model selected battery saver and its canvas
  matched its 311 x 403 display dimensions. checked views had no document
  overflow. temporary viewport override was reset. captured browser warnings and
  errors were empty at the end of those model/public-page checks.
- prodigy release-detail playback progressed past 10 seconds; pause and player
  close worked. playback was stopped before leaving the preview for the user.
- no application defect was reproduced in this pass; no application source,
  assets, packages, audio or workflows were changed. only release-review docs
  and this checkpoint were updated. scoped tracked website diff check passed.
- production build/typecheck still refer to sept 11, not a new run. no rebuild
  was needed for documentation-only progress. lint, physical-device profiling,
  os-level reduced-motion testing and remote ci are still unverified. no commit,
  push, deployment, credential, backend or analytics changes were made.

## environment

windows / powershell, npm, next.js 15, react 19, typescript. static export, with
a separate public api at `https://api.okiso.net`. local preview should use
`http://localhost:3000` because the api permits that origin. keep large temporary
files, builds, package caches and browser profiles under `S:\tmp\codex`.

## state

- current design: one shared white/red editorial language across home, releases,
  upcoming, vault, navigation, listening controls and dialogs. the user liked the
  latest preview and asked for more commissioned art, animation and vrm work.
- the old soft-orbit/tactical next steps in july/august handoffs are superseded
  by `docs/EDITORIAL-DIRECTION.md` and the actual implementation. do not restart
  the rejected sparse design. rouge noir and future standalone okiso grain are
  exceptions to the core visual system.
- commissioned artwork is integrated in the hero and art room, with selection,
  full-art dialogs and artist credits. sketch combo is by sobu (@sobsocks).
  other selected art is by suyosuyo and 7mmchan. no ai-generated art is allowed.
  originals under `D:\FOLDERS\Commissions\Bought\OKISO` are untouched.
- the character room is lazy-loaded and includes the user's real vrm, wave/idle
  poses, expressions, camera framing, turntable, pause, low-power rendering,
  loading/error/retry states, and graphics cleanup. the optimized model is
  9,065,872 bytes versus 15,698,600 original, with rig and geometry preserved.
- earlier sept 11 verification: 22 tests and typecheck passed; production export
  generated 50 pages/resources; seo audit passed for 38 indexable pages, 34 linked
  releases, 4 noindex routes and 105 local tracks. browser checks covered desktop,
  phone and tablet, galleries, model lifecycle, focus restoration and overflow.
  physical-device profiling and an os-level reduced-motion test remain undone.
- history diagnosis found the app history reader returning a sept 5 segment while
  the saved transcript contains the art/vrm completion at sept 11 08:28 jst. no
  intervening continuation before the user's history complaint was found. the
  underlying app fault is not fixed; no session history was reset or deleted.
- this checkpoint and the entry pointers in `AGENTS.md` / `docs/HANDOFF.md` are
  the practical recovery mechanism for fresh chats. older second-brain notes
  are useful history, not current instructions. no external memory was edited.

## next steps

1. the compatible security update is implemented: next/eslint-config-next
   15.5.25, react/react-dom 19.1.9, postcss 8.5.28, and compatible transitive
   security updates. the postcss override references the direct dependency to
   prevent next's old nested copy from being installed. full `npm audit`,
   including development dependencies, reports zero known vulnerabilities.
2. all 25 tests pass after the update (including three new deployment checks).
   production export passes with type
   checking restored (removed `ignoreBuildErrors: true`); the seo audit again
   passes for 38 indexable pages, 34 releases, 4 noindex routes, 105 local tracks.
   lint is still skipped by the existing config; do not claim a lint pass.
3. review the rebuilt static preview at `http://localhost:3000/` with the user.
   no website visual/component/art changes were made in the recovery pass.
4. the deployment and release-refresh workflows now use the verified node
   22.19.0 runtime. deployment runs all four test suites, builds, then audits the
   exported seo before publishing. the old sitemap generation/removal steps
   were removed; `src/app/sitemap.ts` remains the single export source. changes
   to public assets, scripts and next.config.ts now trigger deployment. yaml
   parsing and the new workflow regression tests pass locally; remote ci has
   not run. scope the exact release changes before publishing; no deployment
   approval has been given for this candidate.
5. seo foundations exist, but real okara/search-console measurement and the
   approved too lost sandbox oauth setup must be verified separately; do not
   claim those integrations complete or fabricate credentials/metrics.

## constraints / gotchas

- white/red, neutral graphite/silver; no yellow or lavender brand substitution.
  use the dense character-led editorial reference for composition, not its art.
- one visual system for the whole core site, including vault. no unnecessary
  redesign while completing hardening and review.
- no commits, push, deployment, private vault edits, api-server changes or
  credential changes were authorized by this recovery request.
- never run a build while a next development server is running. prefer the
  loopback-only static preview while reviewing the production output.
- use `npm run dev:webpack` if development is needed; turbopack previously broke
  next/font. build-time type checking was restored in the sept 11 security pass.
- `.next` points to `S:\tmp\codex\site-seo-design-20260905\.next`; `build` points
  to `S:\tmp\codex\site-seo-design-20260905\export-root`; `out` points to its
  `site` child. do not recursively delete these junctions or build during dev.
- build with process-local `OKISO_EXPORT_DIR=build/site`; use process-local
  `TEMP`, `TMP`, and `npm_config_cache` under `S:\tmp\codex\site-finish-20260911`.
  the default npm cache hit an existing-file error; the s: task cache works.
- never use generic gltf conversion on the vrm; it can strip avatar extensions.
  use the existing preparation scripts and preservation tests.
- old scratch cleanup under `S:\tmp\codex\site-art-room-20260911` was rejected
  by tool safety policy; about 2.82 mib remains. do not evade that restriction.
- recovery install-cache cleanup was also rejected by tool safety policy, not
  a detected file lock. `S:\tmp\codex\site-finish-20260911\npm-cache` retains
  1,106 files / 407,057,528 bytes (388.2 mib). no deletion was performed; do not
  retry through a different shell or filesystem mechanism.

## relevant files

- `docs/EDITORIAL-DIRECTION.md` — current visual contract and site-wide scope.
- `docs/ART-AND-CHARACTER-REVIEW.md` — feature details, prior verification, limits.
- `docs/SECURITY-READINESS.md` — current dependency remediation and validation.
- `docs/COMMISSION-ASSETS.md` — source/artist/derivative inventory.
- `docs/SEO-WORKPLAN.md` — seo work and integration boundaries.
- `src/Components/Editorial/EditorialHome.tsx`, `ArtRoom.tsx`,
  `CharacterStudio.tsx`, `SiteFrame.tsx`, `EditorialDialog.tsx` — current ui.
- `src/styles/editorial.css`, `src/lib/siteDesign.ts` — shared design language.
- `scripts/prepare-commission-assets.mjs`, `scripts/prepare-vrm.mjs` — existing
  asset preparation; original art/model files must remain untouched.
- `scripts/perf/static-server.mjs` — preview the existing export on localhost.
- `src/lib/artAssets.test.ts`, `siteDesign.test.ts` and release tests — guards.
- `src/lib/deploymentConfig.test.ts` — runtime, export and publishing guards.

## git state

verified on recovery: branch `feat/home-tactical`, head `9c7f516`. many uncommitted
website changes and untracked feature/art files are intentional. roughly 100+
audio binary modifications and unrelated utility files predate this work. keep
them untouched and do not stage the entire tree. a fresh checkout from the last
commit will not contain the current website: continue from this working directory.
