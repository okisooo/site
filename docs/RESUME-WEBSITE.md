> read this entire file, then continue the work described below. you have no prior chat history.

# task

## site-wide link previews — deployed / 2026-09-22

user expanded the gallery request to proper embeds for most pages. supersedes
the gallery-only scope below. seven authored 1200x630 JPEG cards now cover home,
about, releases, upcoming, gallery, vault and rouge noir. real commissioned art
retains artist credit; the archive card uses six real curated release covers.
vault uses an authored folder/record motif; rouge noir uses title art and a
roulette wheel in the game page's existing palette, not a gameplay screenshot.
upcoming promises no unannounced release or date. images are 37–217 KiB each.

`src/lib/socialImages.ts` maps routes to versioned images and a new home fallback.
the shared metadata helper supplies matching OG/Twitter images, alt text, type
and dimensions. page titles/descriptions are concise. all 35 release detail pages
retain their own cover art with matching Twitter alt text; structured artist/game
images no longer use the old business card. vault/labs remain noindex; callback
pages explicitly suppress inherited promotional metadata. `og_image.png` stays
available for old external references, but no current source metadata uses it.

regenerate using `npx tsx scripts/prepare-site-social.mts` with:
`OKISO_SOCIAL_OUTPUT_DIR=S:\Codex\outputs\2026-09-22\site-social-preview\assets`,
`OKISO_SOCIAL_CACHE_DIR=S:\tmp\codex\site-social-preview-20260922\covers`, and
optionally `OKISO_SOCIAL_REVIEW_DIR=S:\Codex\outputs\2026-09-22\site-social-preview`.
the existing `public/social` junction points to that asset directory. review sheet:
`S:\Codex\outputs\2026-09-22\site-social-preview\social-preview-sheet.jpg`.
bump affected image filenames and the route map when replacing published cards.

verified: all seven images visually reviewed at 400px wide, decoded JPEG dimensions,
production build/typecheck, 18 release/SEO unit tests and expanded exported SEO
audit (41 indexable pages, 35 release pages). audit checks route-specific metadata,
all release covers, main-page exported image presence/budgets, and callback opt-out.
log: `S:\tmp\codex\site-social-preview-20260922\build-sitewide.log`.
published source `1793efc9` after user approval. deployment `35635809626` and Pages
rollout `35636193065` succeeded; published assets `0b720e8b`. all 43 CI regressions,
production build/typecheck and exported SEO checks passed. live verification passed
45 pages (including all 35 releases), the seven main URLs without cache-busting,
and all seven JPEGs with exact SHA-256 matches to the reviewed assets. crawler
requests received correct per-page OG/Twitter fields and preserved noindex rules.
evidence: `S:\Codex\outputs\2026-09-22\site-social-preview\live-checks.json`.
no actual Discord message was sent or rendered; previously cached messages may
retain their older previews. working tree changes were scoped to this feature.
oki.so DNS/email/redirect setup remains outside this change.

## gallery link preview — local candidate / 2026-09-22

user bought oki.so and rejected the gallery's Discord embed screenshot. live
`/gallery` still advertises the old `og_image.png`; this is a metadata issue,
not merely a cached Discord card. no domain/redirect setup was requested here.

local candidate gives `/gallery` its own 1200x630 JPEG: three large commissioned
portraits by he_know_lee, sobu and ykhs9, visible credits and a white/red title strip.
existing originals are untouched; no generated illustration. title is now
`OKISO / gallery`, with brief first-person copy. `pageMetadata` accepts an optional
image; other pages and release-cover previews keep their existing behavior.
`scripts/prepare-gallery-social.mjs` reproduces the layout from shipped artwork;
set `OKISO_SOCIAL_OUTPUT_DIR` to the physical asset directory on S: to regenerate.
`public/social` is a new junction to
`S:\Codex\outputs\2026-09-22\site-social-preview\assets`.
new asset: `social/gallery-v1.jpg` (222,609 bytes). a separate 360px review image
is in the parent output directory. inspect that actual chat-size rendering.

production build/typecheck, 18 release/SEO tests, 4 asset tests and export SEO audit
pass (41 indexable pages / 35 releases). audit now checks gallery OG/Twitter image,
dimensions, format, attribution and exported JPEG. final image verified 1200x630.
build log: `S:\tmp\codex\site-social-preview-20260922\build.log`.
not committed, pushed or deployed; actual Discord rendering remains unverified.
next: show the finished preview and obtain visual/publishing approval. existing
shared previews on other routes still use the old default image. oki.so remains
outside this change; no DNS or email changes were made.

## he_know_lee commission gallery integration — 2026-09-22

request 4046163 / public work 11 is archived under
`D:\FOLDERS\Commissions\Bought\OKISO\he_know_lee@skeb` with all five original
2894x4093 PNG deliveries, descriptive verified copies and a 10-record manifest.
the site carries five 1273x1800 WebP versions: open mouth, frown, artist message,
background separation, and character & mascot. gallery now shows 8 commissions
and 25 versions; the homepage commission wall uses one piece from each artist
instead of repeating sobu. asset, design, release, deployment and SEO checks pass;
production build/typecheck passes. local and live Chrome checks cover the gallery,
every variant, the homepage wall, 1440x1000 desktop and 390x844 phone layouts;
images load, links point to the artist and public Skeb work, neither layout spills
horizontally, and site console warnings/errors are empty. committed 264cb1aa and
pushed to main. deployment 35616762636 and Pages 35617002260 succeeded; published
gh-pages asset commit 065a3837. private signed-link scratch remains at
`S:\tmp\codex\skeb-4046163-20260921\request.json` (3,886 bytes) because automatic
approval review rejected deletion as blocked by policy; do not retry a workaround.

## keep the name readable and soften finger bends — 2026-09-18

user screenshot showed the peace sign covering "i’m OKISO" and curled fingers
folding over themselves. brought the desktop raised arm closer to the face;
reduced ring/little knuckle and fingertip bends, with slightly staggered fingers.
checked enlarged front and side views on the actual model. artist card now shares
the other hero cards' z-index 5, above the character at 4, so idle movement cannot
cover its text. desktop and intermediate-width previews show a clear hand beside
the face and an unobstructed name. 18 design tests and production build/typecheck
pass. 390x844 phone preview also checked; viewport reset. committed 12b636b and
pushed to main. deployment 35312255793 and Pages 35312343100 succeeded; all 43 CI
regressions, build/typecheck and SEO audit passed. live screenshot verified at
https://okiso.net/?v=12b636b-live: name clear, hand beside face, softer finger curl.
preview server PID 5828 stopped. existing scratch retained; no blocked deletion retry.

## deliberate homepage hero pose — 2026-09-18

user rejected the conversational clip as tapping the air. replace it with a held,
asymmetrical peace sign beside the face, the opposite hand resting at the waist,
and a slight body/head lean. left index/middle are separated and extended;
ring/little curl into the palm and thumb folds in. inspected front/side candidates
on the actual model before integrating. retain the adapted reference stance and
attribution. delete the 252 KB talking-track JSON; existing Three mixer now carries
four small original wrist/fingertip accents. no arm gesture loop. preserve facial
expressions, render quality, software-renderer guard and spring reset on pose change.
character-room control now labels this pose "peace sign". compact hero brings its
raised elbow inward to fit the phone crop. 18 design checks and final production
build/typecheck pass. actual homepage visually checked on desktop and 390x844;
both show the V clearly, with a clean model startup. viewport reset. committed
a753de4 and pushed to main. deployment 35309992817 and Pages 35310083548 succeeded;
all 43 CI regression checks, production build/typecheck and SEO audit passed.
live desktop screenshot at https://okiso.net/?v=a753de4-live confirms the held
peace-sign pose, natural idle smile and clean model startup.
temporary preview server PID 47840 stopped. scratch stays in the previously
policy-blocked folder; do not retry deletion.

## fingers must actually move — 2026-09-18

user rejected the frozen reference pose as awkward. previous implementation sampled
one frame, so fingers could not animate. replace it with the source gesture's 38
shoulder/arm/wrist/finger tracks, including all 30 finger-joint tracks. retain the
existing source/license, retargeted VRM 0 coordinates and render quality. remove the
forced chest-hand overrides; both hands now follow the authored gesture.
characterGesture.json samples 0–16.6 s at 10 Hz; Three interpolates quaternions at
render rate. a 1.2 s eased return closes the loop. createCharacterGestureClip builds
one native clip/mixer at model load, driven only by existing elapsed time. manual
pose switches stop/reactivate it; pause/reduced-motion freeze it; cleanup releases it.
reset spring-bone physics after applying a new pose to avoid the startup clothing
deformation caught in local visual review. startup rechecked clean. observed distinct
finger curls/hand shapes across frames on desktop and narrow layout; viewport reset.
18 design tests pass, including actual mixer finger movement on both hands, pause
stability and loop continuity. deployed 23ea68c: deployment 35308867891 and Pages
35308960687 succeeded; all 43 CI regressions, production build/typecheck and SEO
checks passed. live preview at https://okiso.net/?v=23ea68c-live confirmed new motion
and clean model startup. preview server PID 34748 stopped, viewport override reset.
scratch stays in the previously policy-blocked folder; do not retry its deletion.

## authored reference pose replaces guessed hands — 2026-09-18

user rejected the hands and requested a similar real pose adapted to his rig.
selected Overte's authored talk_lefthand gesture, via Hanami's Apache-2.0 VRMA
conversion. sampled 1.0 s, converted source-rest rotations to normalized VRM 0
bones, retained the chest-hand arm/wrist fit and used the source finger rotations.
the offered arm/palm now follows the source gesture. data lives in
src/data/characterReachPose.json; provenance, exact source hash and license ship in
public/character/reference-pose-notice.txt and reference-pose-license.txt.
replaces the old reach-angle block, retains the idle face/hand motion and sharpness.
camera backed off slightly to fit the more upright reference stance; checked actual
homepage at normal desktop and 390x844, plus reference front/side views in Chrome.
viewport override reset. imported pose can omit an unchanged chest track; handle
that as identity instead of dereferencing it. model now loads successfully.
17 design tests, production build/typecheck and SEO audit pass. latest scheduled
catalog commit 0244607 was fast-forwarded, preserving its new release. deployment
complete. original user dirt remains untouched; preview server PID 37728 stopped.
pose commit 7639462 passed local checks but CI exposed a stale exact-title assertion
in releaseLinks.test.ts after the scheduled catalog addition. follow-up 7f3ff6e
checks valid Spotify fallback behavior for new/unmapped releases without freezing
the catalog's title list; all 18 release/SEO unit tests pass locally.
deployment 35307302057 and Pages 35307389053 succeeded for 7f3ff6e; all 42 CI
regressions, build/typecheck and SEO audit pass. live desktop screenshot verified
at https://okiso.net/?v=7f3ff6e; local narrow-layout and front/side checks passed.
temporary viewport reset. cleanup of S:\tmp\codex\site-reference-pose-20260918
was rejected by automatic approval review as blocked by policy; no workaround
attempted. files remain, both preview servers (8004 and 37728) are stopped.

## subtle pose and facial animation — 2026-09-17

user asks to refine his pose and give him life through his facial expressions.
slightly soften the reach elbow/wrist, reduce the fixed head tilt and add a small
palm motion. hero smile gently varies with the existing animation clock using the
model's happy/relaxed, MouthSmileLeft/Right, CheekSquintLeft/Right and BrowInnerUp
controls. blink timing includes an occasional double blink. character-room manual
expression choices stay manual; its blink timing also uses the new shared sampler.
no new render loop or timers; pause, reduced motion and visibility still govern
the existing elapsed time. restored pixel density and software guard stay intact.
16 design tests and production build/typecheck pass, including a bounded continuous
expression-cycle test. no existing website tab in Chrome; requested the user open
one for visual review. visual appearance remains unverified in this turn.
deployed 7742f83: deployment 35197767688 and Pages 35197898652 succeeded, all 41
CI regression tests, build/typecheck and SEO audit passed. published model chunk
1696.98618b74f35b93d4.js returns 200 and includes the smile/cheek/brow controls.
do not claim live visual inspection; the existing Chrome website tab was unavailable.

## prominent OKISO and both artist descriptions — 2026-09-17

user wants the homepage introduction to read “i’m OKISO” prominently, and wants
both VTuber and virtual artist used. b50d510 capitalizes OKISO and makes it 20%
larger/bolder within the existing responsive card. bbaa576 adds VTuber alongside
virtual artist in the hero, opening, about bio, metadata and structured description.
keep the concise copy direction; preserve the requested casing of OKISO and VTuber.
release/SEO unit checks pass. deployment 35169004442 and Pages 35169089868 succeeded
for bbaa576; all 40 CI checks, build/typecheck and SEO audit passed. live homepage
verified in Chrome at https://okiso.net/?v=bbaa576 with the enlarged uppercase name
and both VTuber / virtual artist in the kicker. prior size-only build also completed;
the deployed gh-pages head points to bbaa576. user work remains untouched.

## plain-language copy cleanup — 2026-09-17

user dislikes the overwhelming AI-feeling slogans and periods on headings/labels.
prefer fewer words, direct labels and grounded first-person copy; do not invent
personality, artwork titles or dramatic taglines. removed repeated promotional
copy across the gallery, home, about, releases, upcoming, vault, opening and footer.
gallery now uses artist names as card headings, short descriptive artwork labels,
and no repeated artist ticker or redundant descriptive paragraphs. accessible image
descriptions, artist/work links, music titles/lyrics, content terms and SEO metadata
remain. about is a brief first-person intro with real links/contact. model rendering
behavior unchanged. removed CSS made unused by deleted copy.
local build, design tests and export SEO audit pass; gallery/home visual inspection,
gallery search, artwork viewer and about copy verified in Chrome. published 860f78f:
deployment 35168603140 and Pages 35168684172 succeeded, all 40 CI regressions and
SEO checks passed. live gallery screenshot confirms simplified copy. current Chrome
tab left on https://okiso.net/gallery?v=860f78f. local preview PID 19188 stopped.
unrelated source/audio/assets/docs user work preserved.

## Chrome restart resolved lag; restore 3d quality — 2026-09-17

user confirms the website runs fine after restarting Chrome. consider the lag
incident resolved in that session and stop investigating unless it recurs.
canonical incident note: docs/CHROME-GRAPHICS-INCIDENT.md. earlier unresolved
checkpoints below are historical and superseded by this confirmation.
user requests original 3d sharpness. remove the debugging-era 600k pixel budget
and automatic quality reduction; restore the pre-debug desktop supersampling
(1.5 minimum, 2 maximum; original saver/mobile limits). keep the native software
context rejection guard and corrected frame cadence.

deployed a34136b: deployment 35166779920 and Pages 35166866690 succeeded;
40 remaining regression tests, production build/typecheck and export SEO audit pass.
verified in restarted Chrome tab 1492674288 at https://okiso.net/?v=a34136b:
hero ready, canvas 1270 x 1560 at CSS 847 x 1040, no reduced-quality state.
before: 454 x 557 with data-model-quality=reduced at the same CSS dimensions.
live screenshot checked: model visible and sharp. no additional lag investigation.
incident note committed; this continuation checkpoint retains earlier local edits.

## lag persists with 2d fallback — user confirmed 2026-09-17

do not call the software-context guard a lag fix. user reports the same top-section
lag with the illustration. verified current live Chrome tab 1492673886:
data-model-performance=fallback and ZERO canvases anywhere in the document.
ambient motion still runs (13 hero CSS animations and engawa110-motion.webp).
tested the existing pause toggle: swaps animated WebP to thumbnail and sets ambient
motion false. a short whole-Chrome CPU comparison was inconclusive (~0.5 CPU cores
both paused and enabled), not evidence that background motion causes the lag.
restored ambient enabled and homepage top. no production/source changes this turn.
report establishes software page compositing as well as software WebGL, but the
remaining bottleneck and reason graphics changed are still unconfirmed.

## software-rendering guard — 2026-09-17

user explicitly requested a smart CPU/software fallback, superseding the earlier
debug-only restriction. shared CharacterStudio now requests WebGL2 with
failIfMajorPerformanceCaveat before appending a canvas, constructing Three,
downloading the VRM, or scheduling model work. passes the accepted context directly
to Three to prevent its unrestricted context-creation retry. rejected/throwing
creation keeps the hero illustration and unmounts the hero model; the character
room shows its illustration and explanation without loading/retry/3d controls.
the native browser decision is a major-performance-caveat gate, not an infallible
GPU vendor detector. the supplied Chrome report confirms software contexts were
being rejected with this flag. hardware paths retain the existing renderer options.

21 design tests pass including rejected/accepted/throwing contexts and no retries;
25 other regression tests and export SEO audit pass. final production build,
typecheck, all 46 regressions and export SEO audit also passed in deployment CI.
browser verification unavailable: original tab 1492673754 was closed and current
Chrome tab list has no website tab. preserve unrelated tabs; no replacement created.
source commit 2dd08fb is live: deployment 35121640581 and Pages 35121806159 both
succeeded, published gh-pages f58f54e00b7c146b8ccdf343f8811a51b4f81fd2.
live homepage and new chunk 9234.0aa4313a51ecb546.js return 200; published chunk
contains failIfMajorPerformanceCaveat:true, the explicit context, and fallback copy.
no claim of visually confirmed lag resolution; original Chrome tab was closed.
temporary preview server 48496 stopped. preserve all unrelated user dirt.

## confirmed Chrome software-rendering fallback — 2026-09-17

user supplied GPU export `D:\Downloads\about-gpu-2026-09-16T15-56-09-315Z.txt`.
THIS supersedes the earlier speculative website/CSS explanations. report explicitly
says Compositing/Rasterization/WebGL/Canvas software-only, hardware unavailable;
active GL renderer is Microsoft Basic Render Driver through ANGLE_D3D11_WARP.
the Chrome acceleration switch is ON per user, but actual graphics path is software.
one GPU-process crash and 935 `fail_if_major_perf_caveat + software gl` errors are
recorded. initial cause/timing of fallback is not established; do not blame a
specific driver, Meta, Chrome update, website code, or extension without evidence.

fresh read-only Windows inventory: NVIDIA GeForce RTX 3070 status OK/error 0,
driver 32.0.16.1692 dated 2026-09-04; Meta Virtual Monitor also OK. Chrome's export
does not use/list NVIDIA among its three Basic Render Driver entries. this is a
concrete browser graphics-path issue. stop speculative site changes. suggested
next check: user fully restarts Chrome, then verifies hardware-accelerated
Compositing/WebGL and an NVIDIA renderer in a fresh report. no restart, settings
changes, driver changes, or source/deploy changes performed automatically.

report updated: S:\Codex\outputs\2026-09-17\site-top-debug\findings.md.
ponytail full remains active. diagnostic servers stopped, live website restored.
browser tool still cannot access internal Chrome pages; use legitimate user-provided
reports, not profiles/registry/raw CDP/alternate-browser workarounds. Windows device
inventory is a separate read-only OS health check, not a replacement browser setting.

## isolated top-section profiling — 2026-09-17 / source untouched

user confirms graphics acceleration ON and requests DEBUG ONLY: preserve working
site code, no speculative fixes/deployments. ponytail skill is now active (full),
read from C:\Users\samue\.agents\skills\ponytail\SKILL.md. user rejects scrolling
as the symptom and asks why this regressed / whether it is specific to Chrome.

all today's diagnostics live on S:, using a response-transforming local server,
not source edits. main source/config diff is empty; old user dirt/docs/audio remain.
no commits/deployments. restored tab 1492673754 (lagTab) to https://okiso.net/ and
stopped verified debug server PID 57160. other intermediate server PIDs were stopped.

MEASURED RESULT: same current model + same 699 x 858 canvas in full homepage:
median 24.5 page callbacks/sec; minimal isolated renderer: 125.4; actual homepage
with ALL neighboring painted content hidden: 160.5 (159.5–162.5 stable window).
both collage and ambient artwork hidden: 70.0; only foreground cards hidden: 27.7.
earlier camera at current buffer: 30.1, so close-up change alone is NOT established
as cause. smaller buffer 174 x 214: 82.3; high-performance preference: 48.2.
empty drawing surface / frozen draw submission were substantially faster too.

callbacks/sec are not model-animation FPS; the model separately caps at 30.
exclude near-1-Hz throttled samples. isolated/probe comparisons are sequential
single-session measurements, not portable benchmarks. inexpensive JS/observer
callbacks and low script blocking in continuing long frames point toward repeated
drawing/presentation together with surrounding page paint. precise offending CSS
or compositor behavior, the onset of the regression, and Chrome-only status remain
UNCONFIRMED. do not claim root cause fully solved. CSS layer promotion, clipping,
containment, background-only animation pause and antialiasing removal did not
consistently resolve it. do not ship these experiments or further degrade quality.

old 4bc214e renderer was built separately with existing esbuild; its original
1270 x 1560 drawing buffer differs from current, so do not compare raw timing as
proof of a code regression. Three/VRM/MToon/React/Next lockfile versions identical.

report + raw JSON: S:\Codex\outputs\2026-09-17\site-top-debug\findings.md.
replay scripts/minimal controls: S:\tmp\codex\site-top-debug-20260917\ (kept as
debug evidence, no new packages installed). server expects the earlier static
export's hashed chunks and asserts specific transforms; regenerate before reuse
if export changes. it disables the automatic fallback locally to keep the model
present throughout each isolation case. production remains 4717784.

PENDING USER INPUT: asked to paste Compositing, WebGL, WebGL2 lines under Graphics
Feature Status from chrome://gpu. the toggle alone is not the actual feature status.
internal Chrome settings/GPU pages remain blocked by Browser Use policy. do not
read profiles/registry/raw CDP/alternate surfaces to recover blocked diagnostics.
request legitimate user-provided text. no browser settings changed or restart.

## hardware acceleration check requested — user input pending / 2026-09-16

user says real 3d with background removed STILL lags and explicitly asks to check
Chrome hardware acceleration/caching. attempted the supported browser navigation
to chrome://settings/system. Browser Use rejected it under URL security policy
and explicitly forbade workarounds, indirect execution, raw CDP, alternate browser
surfaces or policy circumvention. earlier chrome://gpu denial remains in force.
do not read profile files/registry/other surfaces to recover these blocked settings.
asked the user to read Settings > System > Use graphics acceleration when available
and report on/off. no answer yet. no graphics settings changed or browser restart.

fresh HTTPS fetch verifies live model and local source are byte-identical:
9,065,872 bytes, SHA256 9405f10c8958410ec9b356165dd6cedd09c5953fad0b1ca059c33228263fdec8.
asset last changed in source at a7f9182 on September 12. no evidence for an old
cached model. low-power/antialias renderer options were already present in 76d1dcd;
b7dba40 changed the camera/pose. do not claim caching or acceleration is proven cause.

all local snapshot/native-scroll/plain-background experimental source edits have
now been removed; the three involved source files match HEAD 4717784. original
user docs/audio/utility dirt remains. restored Chrome tab 1492673754 (lagTab) to
plain https://okiso.net/ and stopped verified preview process 40924. no new deploy.
local export still contains diagnostic build artifacts; rebuild before reuse or
publishing. diagnosis remains unresolved. next useful evidence is user's on/off
answer, not more subjective scrolling comparisons. explain browser policy block
when requesting this manual check; never imply the tool inspected the setting.

## isolate the top composition — current real-3d/no-background test / 2026-09-16

latest user correction: this is NOT about scrolling; the TOP SECTION specifically
looks laggy, and they suspect the 3d model or something behind it. do not ask more
scrolling questions. reverted the native-scroll experiment completely and removed
the snapshot experiment from source. live production remains `4717784` unchanged.

the previous snapshot test initialized WebGL once to capture the PNG, then disposed
it. thus user feedback that the image-only page still lagged does not fully exclude
a problem caused during 3d initialization. no confirmed rendering cause yet.

prepared pure static local HTML controls with no app scripts/WebGL and the captured
character image: full background, background removed, effects removed, blank page.
checked all ten top-section paused WebP assets: zero ANMF frames, genuinely static.
identical tiny frame probes showed ~1 callback/sec on full static art, background
removed AND a blank page; zero long tasks, document visible/focused in all. these
automated timings are unsuitable to attribute the slowdown to site code. do not
claim those readings prove a GPU/browser problem; connection/occlusion can distort
them. evidence: `S:\Codex\outputs\2026-09-16\site-model-composition\frame-comparison.json`.

CURRENT CHROME TAB `1492673754` (binding lagTab):
`http://localhost:3000/?topTest=plain-3d`. actual moving 3d hero ready at 699 x 858,
ambient=true; zero HeroCommissionWall and zero hero AmbientArtwork elements.
Lenis is restored (html class contains lenis). no substitute image is used here.
the model's automatic performance fallback is disabled ONLY for this localhost
test, so it cannot silently disappear while the user compares. production guard
is unchanged. user is being asked whether THIS top section still lags or is smooth.
preserve the current tab until their answer. no new production fix is claimed.

two owned source edits remain: localhost query flag in CharacterStudio to bypass
the fallback for the test, and localhost-only plainTopPreview flag in EditorialHome
to omit the collage/hero background. production build/types pass. do not deploy
these diagnostic changes. preview PID `40924` remains running and is required for
the comparison; verify process command before stopping later. log:
`S:\tmp\codex\site-model-budget-20260916\build-plain-top.log`.
all prior user dirt and denied-operation constraints remain in force.

## image-only page also lags — native scrolling comparison pending / 2026-09-16

user answered "it still lags" for the snapshot comparison (no 3d canvas, ambient
motion paused). DOM confirmed no canvases anywhere and the one video paused.
do NOT keep attributing the problem specifically to WebGL/model animation.

found an independently active whole-page input dependency: SmoothScrollProvider
still initializes Lenis and a GSAP animation ticker on the editorial routes.
the snapshot comparison's html retained class `lenis`. editorial components use
IntersectionObserver/native reveals, not ScrollTrigger effects. local candidate
now skips Lenis initialization when usesEditorialDesign(pathname) is true, and
the initialization effect depends on that boolean so legacy-route transitions
clean up correctly. standalone worlds keep their original scrolling path.

CURRENT TAB `1492673754`: localhost snapshot URL as below, same character image,
ambient=false, zero canvases, HTML class no longer contains `lenis`. production
build/types pass. user is being asked whether NATIVE scrolling is smoother or
the same lag remains. preserve this comparison until the response. do not call
this the confirmed cause or deploy until evidence supports the candidate.

third owned dirty source file: `src/motion/SmoothScrollProvider.tsx` (seven lines
changed). snapshot experiment remains in the two components described below.
preview PID `40924` is still needed for user comparison. build log:
`S:\tmp\codex\site-model-budget-20260916\build-native-scroll.log`.
no new commits/deployments; live remains `4717784`. after resolving the test,
remove temporary snapshot code and rebuild before publication. preserve user
docs/audio/utility changes and all previously denied-operation constraints.

## frozen canvas also lags — snapshot comparison pending / 2026-09-16

latest user feedback: "lags while frozen too". this invalidates animation-only
explanations. Chrome tab `1492673754` initially confirmed ambient=false, one ready
hero canvas, no fallback. a localhost-only comparison now renders the same model
once, copies its frame to a PNG, unmounts the CharacterStudio and disposes WebGL.
the live site is still unchanged at `4717784`; do not call this a deployed fix.

CURRENT TAB: `http://localhost:3000/?modelTest=snapshot`, ambient motion paused,
zero hero canvases, `data-model-performance=snapshot`, image loaded at 699 px
natural width. PNG visually checked; the same reach pose is retained. user is
being asked whether this image-only comparison still lags. preserve it for their
answer instead of returning to the live page prematurely.

preview PID `40924` runs `node scripts/perf/static-server.mjs`; leave it running
while the user compares, and verify its command line before eventually stopping.
two uncommitted owned source changes: CharacterStudio gains optional onSnapshot
callback after a complete model render; EditorialHome enables it ONLY for the
localhost modelTest=snapshot query and replaces the canvas with the captured PNG.
production build/types pass. no new tests or commits for this temporary experiment.
resolve the experiment after feedback; do not accidentally deploy test-only code.

saved frame: `S:\Codex\outputs\2026-09-16\site-model-composition\hero-snapshot.png`.
logs: `S:\tmp\codex\site-model-budget-20260916\build-snapshot-comparison.log` and
snapshot-preview logs. all earlier dirty docs/audio/user utilities remain intact.
prior browser-internal access and cache deletion denials still apply.

## live model lag remains unresolved — current comparison / 2026-09-16

the user reopened the lagging live homepage in Chrome tab `1492673754`. inspect
this tab instead of the now-closed `1492673690`. without reloading, the actual
tab showed a 699 x 858 hero canvas, no old per-frame counter, no studio canvas,
and the new webpack runtime. this confirms the current deployed code is running
in the reported lagging tab; this is not merely an unpublished/cached update.
the safeguard later did remove the hero, but the user has not yet confirmed
whether the perceived lag stops in that state. an asynchronous comparison
question is pending; no new production fix has been claimed or deployed.

temporary localhost-only draw instrumentation compiled and ran, then was removed
from source. Chrome did not expose EXT_disjoint_timer_query_webgl2, so actual
graphics execution time remains unavailable. one sample: exactly 1 callback/sec,
3.4 ms synchronous CPU work per frame, all three callbacks reported document focus.
as earlier idle sampling was also near 1 Hz, this does not isolate the model as
the cause or establish a real-world FPS result. do not make a third speculative
fix from these timings or work around the earlier chrome://gpu access denial.

CURRENT LIVE TAB STATE: restored to plain `https://okiso.net/`, ambient motion
paused through the normal footer button, scrolled back to the heading. confirmed
`data-ambient-motion=false`, one ready hero canvas, no fallback. thus the actual
3d model is visible but still; ask whether scrolling/pointer lag persists in this
state. this supersedes the earlier illustration-only paused comparison. preserve
this state until feedback. no graphics settings or unrelated tabs were changed.
diagnostic preview PID `41208` was verified and stopped. diagnostic build logs
remain in `S:\tmp\codex\site-model-budget-20260916`; the local static export was
built with temporary localhost diagnostics, but source is restored to `4717784`.
rebuild before any further local testing or deployment. prior dirty docs/audio
and utilities remain untouched. existing cache-deletion blocks still apply.

## continued model lag — protective budget / 2026-09-16

the user reports that the previous pacing repair did NOT resolve the severe lag.
source `4717784` now adds a bounded hero resolution and automatic backoff. pushed
to main; deployment `35082547987` and Pages `35082686694` passed (assets `050e25f`).
preserve the older dirty docs,
audio and utilities. only five scoped source/package files were committed.

hero rendering is limited to 600k pixels. after startup, sustained poor callback
delivery or expensive synchronous frames reduces resolution; continued trouble
unmounts/disposes the hero and shows the existing illustration. it does not retry
until the homepage remounts. the explicitly opened character room is unchanged.
per-frame DOM counter writes were removed. visibility/option changes reset samples.

45 tests, production build/types, export SEO and local 40-page/83-resource crawl
pass. Chrome verifies natural fallback, zero hero canvases, a loaded illustration,
working studio pose/framing/pause controls and clean closure. a pick click timed
out at transport level, but the subsequent read confirmed pick 2 of 3.

the original slowdown's root cause remains unconfirmed: temporary local timing
showed 24.65 fps with 0.92 ms updates / 1.76 ms synchronous draw submission; later
idle and update-only windows both ran around 1 callback/sec. this does not prove
GPU speed or establish a valid rendering-vs-idle responsiveness comparison.
diagnostic source was removed before build. do not claim universal smoothness or
an established real-world FPS gain. the verified result is protective shutdown.

report: `S:\Codex\outputs\2026-09-16\site-model-budget\findings.md`.
scratch: `S:\tmp\codex\site-model-budget-20260916`. Chrome tab `1492673690` is left
on `https://okiso.net/?v=4717784`; the ordinary URL initially reused older browser
HTML (max-age=600). live new-code verification observed reduced quality (454 x 557),
then zero hero canvases and the loaded illustration. live crawl passes 40/83.
preview PID `35128` was verified and stopped. automatic approval review rejected
temporary-cache deletion as "blocked by policy"; 1.35 MiB of scratch/logs remains.
do not retry deleting those caches through another mechanism. prior chrome://gpu
denial still applies; no alternate diagnostics or browser setting changes.

## model performance repair — deployed / 2026-09-16

the user requested fixing new model lag through their existing Chrome session.
source `7313bcf` on `codex/model-frame-timing-20260916` is deployed to main, with
only the four scoped performance files committed. deployment `35054037018` and
Pages rollout `35054123391` passed; asset commit `8f067ce`. preserve the existing
SEO work, dirty docs/audio and other utilities.

confirmed app bug: the frame limiter reset its deadline from each late callback.
a deterministic 60 Hz schedule with 4 ms periodic lateness produces 24 fps in the
old code, 30 with the new fixed-deadline helper. both 30/60 fps caps now pass tests
at 60–320 Hz, plus jitter and long-suspension recovery. actual animation delta is
still based on the actual render time. visibility and option changes reset pacing.
removed forced 1.5x rendering on 1x screens (~56% fewer hero pixels); canvas sizing
now ignores the opening animation's temporary transform. model/art/pose untouched.

39 tests, production build/types, exported SEO and the local 40-page/83-resource
crawl pass. earlier quiet Chrome samples were 23–26 fps. pixel-density-only A/B
did not establish a speed improvement. later ~1 fps samples during concurrent
commission work persisted in one sample after the browser lane was freed; their
cause is unconfirmed, and they are excluded from performance conclusions.
final functional checks pass: pose/framing controls, hero stops behind studio,
global pause holds the frame count exactly and resume advances it. live model
is ready at 847 x 1040 on the same 1x display (previously 1270 x 1560), with no
captured site errors. final live crawl passes: 40 pages / 83 resources. no measured
real-world FPS gain or resolution of the unverified browser graphics condition
is claimed. original voice task: `01a0a7f6-c0a1-70e2-87bf-82d10967ad0e`.

Chrome renderer processes show `--disable-gpu-compositing`, but global acceleration
and active WebGL renderer are unverified. `chrome://gpu` was blocked by browser
policy, which forbids alternate access/workarounds. no setting changes, Chrome
restart, profile creation or tab grouping. claimed website tab `1492673625`.
the local preview was stopped; the claimed Chrome website tab is restored to the
live homepage. compilation/export continue using the existing s: junctions.
report/evidence: `S:\Codex\outputs\2026-09-16\site-model-performance\findings.md`.
logs/cache: `S:\tmp\codex\site-model-performance-20260916`. automatic approval
review rejected deletion of this run's temporary caches with “blocked by policy”.
they remain; do not retry deletion through another mechanism. the final report
records the repair and the residual need for a manual acceleration check if lag
persists. unrelated commission tabs were not changed or grouped.

---

## seo continuation — completed first pass / 2026-09-15

the user authorized serious SEO work independently. source `e520897` and the
contact follow-up `00e3a1e` are deployed from local `codex/seo-20260915` to main.
deployment `34919445619` and Pages rollout `34919553390` passed; asset commit
`90a2f603`. all 36 regression tests, production build/types and exported SEO
pass. final live crawl: 40 indexable pages and 83 linked pages/assets, zero issues.

17 old release URLs from before the May 31 catalog migration now redirect to
verified equivalents (matching title/date/full track list), including trailing
slash links. all 17 were 404 before, and all 34 alias variants now pass live.
GitHub Pages uses immediate HTML redirects with matching canonicals; no guessed
redirects for removed music. `/about` adds the factual artist profile, official
channels, contact and navigation. related releases prioritize shared tracks, then
nearby dates; FEAR links first to ETUDE. original art/audio work is untouched.

Chrome already has verified domain Search Console access. June 13–September 12:
64 clicks / 1,763 impressions / 3.6% CTR / 6.6 average position. first ten query
rows saved, not a full export. September 4 indexing totals (10 indexed/56 excluded)
predate launch. latest release was discovered-not-indexed; Google's live test
passed. Google accepted indexing requests for latest release and `/about` and
the sitemap submission (Success, 40 discovered pages). do not call them indexed.

the live audit caught Cloudflare rewriting the public contact into broken links.
the follow-up uses its documented per-address HTML comment; final raw HTML and
browser contact interaction pass. a one-off in-app Webpack error did not recur
on reload; its cause remains unconfirmed. phone/tablet layouts and lyrics passed.
PageSpeed API was quota-blocked and the web report stalled; no new speed score.

full report/evidence: `S:\Codex\outputs\2026-09-15\site-seo\seo-report.md`.
next work: recheck indexing after recrawl, collect full query/page/country exports,
complete reproducible mobile performance measurement, and enrich content using
verified credits or artist commentary. do not repeat the older Okara access ask.
no analytics installed, no outreach sent. local preview stopped. automatic review
blocked deletion of this run's caches at `S:\tmp\codex\site-seo-20260915` with
“blocked by policy”; they remain, and the deletion must not be retried by another
mechanism. older dirty docs/audio/utilities remain outside the released commits.

---

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

## separate commission elements / 2026-09-13

the user asked to use the smaller delivered assets, including the chibi. all ten
PSD layers were exported at their native bounds, plus a ready-to-use outlined
chibi composite. the artist's `chibi line` layer already contains the complete
outlined illustration. all eleven exports are saved alongside the four expression
PNGs in `D:\FOLDERS\Commissions\Bought\OKISO\ykhs9@skeb\converted`; the original
PSD remains intact. the manifest verifies twenty-four files in total. layer-to-file
mapping: `S:\Codex\outputs\2026-09-13\skeb-ykhs9\elements\elements.json`.
the Skeb skill now includes separately supplied elements in local saves.

the user then requested reusable versions without the thank-you heart. all four
expressions now also have clearly named `-no-message.png` full illustrations and
`-transparent.png` character cutouts in the same converted folder, all 2000 x 1500.
these eight extra exports omit the separate `Sign` dedication layer. pixel checks
confirm each complete illustration differs only within that layer's bounds; the
original PSD hash is unchanged. the skill now requires these reusable versions too.

the hero's existing credited sticker slot now uses ykhs9's outlined chibi and
links to the gallery. the winking octopus perches on the listening deck. both
reuse the existing idle animation/visibility system with different sway timing;
no new animation dependency. the two transparent, lossless WebPs total 89,100
bytes, at their original 340 x 365 and 370 x 361 sizes. all full commissions and
their original credits remain in the gallery. asset tests, build/types and SEO
pass. desktop/390px checks confirm both images load and animate, with no overflow;
the phone mascot has zero overlap with the artist credit. ambient pause freezes
both accents. the sticker opens the seven-work gallery, and the listening card's
next control still selects VAC. no captured warnings/errors. source `f2fda80`
is live: deployment `34725180978` and Pages rollout `34725238791` both passed
(asset commit `f0f1803`). all 32 website tests passed remotely. the live homepage
shows both loaded, animated cutouts and the correct gallery link, with no overflow
or captured warnings/errors. live evidence: `elements/live-checks.json` in the
output folder. the local preview is stopped; the browser shows the live homepage
with its viewport reset.
screenshots are in the elements output folder; logs in
`S:\tmp\codex\site-cutouts-20260913`. existing blocked cleanup paths are untouched.

## illustration-inspired hero pose / 2026-09-13

the user requested the PSD's alternate expressions, an illustration-inspired 3d
pose with stronger camera perspective, and redeployment. the four PSD expressions
were already exported and live in the gallery in `3d240ad`; no duplicates were added.

`CharacterStudio.tsx` now has a reach pose: one open hand toward the lens, the other
across the chest, turned hips/spine, a counter-tilted head and asymmetric legs.
forearm twist distributes the palm rotation so the wrists remain relaxed. the hero
uses a closer 64-degree perspective, a slight camera roll, soft pointer parallax
and slow camera drift with its existing breathing/blinking. the phone camera is
composed separately to keep the face clear of the artist card. the shared character
room exposes reach alongside wave and at ease; its drag/framing controls remain.
the original model, four art variants and existing collage files are unchanged.

four visual pose/camera iterations corrected the first limp wrist and an overly
vertical stop gesture, then refined the phone framing. screenshots and supporting
rig calculations: `S:\Codex\outputs\2026-09-13\site-reach-pose` and
`S:\tmp\codex\site-reach-pose-20260913`. all 32 tests, the production build/types
(51 resources) and SEO audit pass. desktop and phone checks verified the pose,
clear face/hand framing and no horizontal overflow. the character-room reach,
wave/at-ease switching and portrait framing work. the background hero held at
2567 frames while the studio was open; settled ambient pause held at 2571 frames,
then resume restored movement. no production warnings/errors were captured.
the development server's existing icon.png conflict did not recur in production.
the final desktop camera-centering adjustment was rebuilt and passed SEO again.
source `b7dba40` is live: deployment `34724171301` and Pages rollout `34724224004`
both passed; asset commit `e49ad94`. live checks confirm the new reach/camera pose,
an animated ready model, all eight loaded art prints, zero horizontal overflow and
no captured warnings/errors. the browser is left on the live homepage with its
viewport reset; the local preview has been stopped. tablet 768 x 1024 also passed
the local composition/overflow check. verification records:
`S:\Codex\outputs\2026-09-13\site-reach-pose\checks.json`. lint remains skipped;
no physical-device or operating-system reduced-motion test was performed.
existing blocked cleanup paths remain untouched; process caches reuse the existing
s: pose scratch location. no new dependencies or original-model edits.

## current skeb follow-through / 2026-09-13

the original is downloaded and verified at
`D:\FOLDERS\Commissions\Bought\OKISO\ykhs9@skeb\4029552-1.psd`.
8,492,720 bytes, PSD 2000 x 1500 with embedded ICC; SHA-256
`86357a11fd8bcaeb5df81eafb56aa1eb1d79f6c1267b607af2252ab317edbbc1`.
the artist-folder manifest records verification without private links.

following the user's local-save correction, all four full-resolution 2000 x 1500
PNG expressions are also archived in `ykhs9@skeb\converted\`, with filenames
identifying Chara1/open-smile, Chara2/eyes-closed, Chara3/soft-smile and
Chara4/quiet-smile. the manifest records their verified dimensions and hashes
alongside the original PSD. the Skeb skill now requires every delivered/layered variant in the
local artist archive, not only the original PSD or website-sized derivatives.

the user was correct that this had worked before. recovered the September 10
successful task `01a0887d-3d3f-7d23-ad9d-ac55abb6b0ab`: click Download(Raw),
capture the visible signed attachment URL, then download it directly outside the
browser's file-handling path. the exact fresh URL worked through `save_delivery.py`
in about 1.4 seconds, including validation. no popup, settings change, cookies or
framework internals were needed. the private request JSON was removed and the
browser returned to the request page. the skill now leads with this verified route;
its package validation passes. earlier manual-save/blocker claims below are historical
and superseded by this completed transfer; do not repeat those detours.

four character-expression layers were individually composited with the common
background, mascot, frame and artist message/signature preserved. the raw PSD is
untouched. eight new web assets live in the existing s: gallery junction; the
catalog now has seven works / twenty versions (all six verified Skeb works plus
sobu). the new piece also occupies one of the hero's existing eight print positions.
all four asset checks, production build/types (51 resources), SEO audit and the
download helper's 16 offline tests pass. all four expressions load in the viewer;
desktop and 390px phone checks show a clean composition, correct credits/links,
and no horizontal overflow or captured browser warnings/errors. all eight hero
prints load, including the new work. screenshots: `S:\Codex\outputs\2026-09-13\skeb-ykhs9`.
source `3d240ad` passed deployment build `34718963685`, including all 32 tests;
Pages rollout `34719039421` passed (asset commit `9ab043c`). the live gallery shows
the new work, all four expressions and the verified artist/work links; the live
homepage includes the new print. the completed-list collection is now fully included.
lint remains skipped in the existing build;
no physical-device or operating-system reduced-motion test was performed this pass.
verified method: `S:\SymLinks\CodexHome\skills\skeb-download\references\browser-downloads.md`.

the temporary preview was stopped. automatic approval review rejected cleanup of
this run's `uv-cache`, `node-jiti`, `tsx-samue` and `skill-tests` directories with
"blocked by policy". they remain at `S:\tmp\codex\skeb-direct-20260913`, totaling
125,807,694 bytes. do not retry that deletion through another mechanism; older
blocked cleanup targets remain unchanged. verification logs and scripts are retained.

## deployed pose refinement / 2026-09-13

the user said the 3d wave looked sideways and asked for repeated visual refinement.
`CharacterStudio.tsx` now lowers the greeting elbow and turns the palm toward the
camera, distributing the turn between forearm and wrist. softly separated, slightly
curled fingers replace the flat hand. wrist movement uses the palm-normal axis and
a smooth 2.4-second two-beat greeting followed by rest in a 7.5-second cycle; the
shoulder follows slightly. selecting wave starts a new greeting. hero and studio
share the pose. the phone hero mirrors it to the open side, because the artist
card otherwise obscured the raised hand. layout and original model remain intact.

iterations checked the whole hero, a close portrait, both sides of the arm, finger
spacing, and the phone composition. a local skeleton check confirmed the normalized
finger-spread direction before the final spacing adjustment. the shared MCP hub
was checked in lean mode; no Blender backend or session changes were needed.
reference: the VRM humanoid/finger hierarchy at
`https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_vrm-1.0/humanoid.md`.
visual greeting reference (not downloaded or published):
`https://icons8.kr/photos/photo/front-view-of-a-happy-man-waving--5f9fa2fa8b6588000145e500`.

all 32 tests, the type-checked production build and seo audit passed. production
browser checks covered both wave beats, studio pose switching, responsive handedness
and the unobscured phone greeting. global pause held the hero at 877 rendered
frames; resume advanced it to 888. no new production warnings/errors were captured.
the dev server had reported the existing `/icon.png` public/app-file conflict;
that did not recur in the static production preview. source `4bc214e` is deployed:
deployment `34716233139` and pages rollout `34716303177` both passed; published
asset commit `d9c74b8`. live desktop and phone checks confirmed the forward-facing
palm and unobscured phone hand, a loaded animated model (723 frames at capture),
no horizontal overflow, and no captured warnings/errors. the temporary preview
was stopped and the browser remains on the live homepage with its viewport reset.
lint remains skipped; no physical-device or operating-system reduced-motion test.
screenshots: `S:\Codex\outputs\2026-09-13\site-natural-pose\`.
logs and skeleton inspection: `S:\tmp\codex\site-natural-pose-20260913\`.
automatic approval review blocked removal of this run's `node-compile-cache`,
`node-jiti`, and `tsx-samue` temporary directories with "blocked by policy".
their combined 466,255 bytes remain under the scratch path above. do not retry
that deletion through another mechanism; earlier blocked cleanup targets remain
unchanged too. verification logs and screenshots are retained.
the @ykhs9 delivery was pending during pose work; the successful download above
supersedes that earlier blocker.

## deployed art-wall update / 2026-09-13

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
