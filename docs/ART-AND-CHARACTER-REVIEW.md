# art and character room / 2026-09-11

local candidate, not deployed. white/red identity and standalone-route exclusions
remain unchanged. no generated art and no modified commission originals.

## implemented

- commissioned art replaces the decorative release-cover montage; the real
  release cards still use their own covers. 7mmchan's chibi links to the new art
  room. the navigation also exposes the art room across core routes.
- the art room has three credited illustrator selections, previous/next controls,
  responsive webp derivatives, and a keyboard-accessible full-art dialog.
- the original vrm now has a dedicated character room: relaxed and wave poses,
  neutral/happy/relaxed expressions, blinking and breathing, portrait/full framing,
  an interruptible camera dolly, drag/keyboard turn controls, turntable, reset,
  pause, and a battery-saver profile. mobile dialogs retain a sticky close control.
- the character room is imported and the model fetched only after opening it.
  video playback code/metadata is deferred until the watch section is near the
viewport, with a reserved placeholder and a manual load control.
- finite cover/art transitions respect reduced motion. the model observes the
  operating-system preference and disables automatic motion when requested.
- the renderer caps device-pixel ratio at 1 for narrow/coarse-pointer/low-core
  devices, 1.5 in high detail; render cadence is capped at 30/60 fps respectively.
  these are budgets, not measured device frame rates. rendering stops when the
  document is hidden, the canvas leaves view, or motion is paused and controls idle.
- archivo uses its variable font; unrelated standalone font families no longer
  preload on core pages. no claim of measured lighthouse improvement is made.

## model preparation and lifecycle

the original `public/model.vrm` is untouched. `scripts/prepare-vrm.mjs` writes
`public/character/okiso-web.vrm`: 15,698,600 → 9,065,872 bytes (42% smaller).
82 byte-identical buffer views reuse offsets; textures remain standard png with
a maximum side of 1024px. buffer-view indices, geometry bytes, nodes, skins,
materials, expressions, and all vrm metadata/extensions are preserved and tested.
this is lossless geometry deduplication plus texture resizing, not draco geometry
compression or a generic gltf conversion that could strip vrm extensions.

runtime optimization uses the installed three-vrm utilities for vertex trimming,
skeleton sharing, and expression morph combination. references:
[official vrm utilities](https://pixiv.github.io/three-vrm/docs/classes/three-vrm.VRMUtils.html).

each effect setup owns a new canvas. cleanup aborts downloads, disconnects
observers, stops animation frames, disposes graphics resources, and removes that
canvas. this avoids reusing a deliberately lost context during strict-mode
remounts or retries. loading progress and failure states reflect real work.

## verification and limits

type checking and all 22 tests (5 design, 14 release, 3 asset/model) pass.
the static production build generates 50 pages/resources; reported initial
homepage javascript is 138 kb, versus 137 kb at the previous checkpoint. the 3d
module is deferred. desktop and 320px phone checks covered the original model,
poses/expressions, framing, pause, gallery selections, full-art dialog, artist
credits, and no horizontal overflow. mobile low-resolution rendering was checked
against the actual canvas dimensions. reduced-motion code is present, but an
os-level reduced-motion simulation and physical-device profiling were not run.

no login, private vault management, upload, delete, publishing, or analytics
permission changes were performed.

temporary-cache cleanup was attempted after verification but rejected by the
tool safety policy (not a file-lock error). `S:/tmp/codex/site-art-room-20260911`
retains 625 disposable cache files totaling 2,954,023 bytes (2.82 mib). no process
restart is known to be necessary; manual cleanup of that exact task directory is
still pending. the separate active export under `site-seo-design-20260905` is
intentionally retained for the running localhost preview.

the final exported-site SEO audit passed for 38 indexable pages, 34 linked
releases, 4 noindex routes, and 105 local tracks. production browser checks found
zero character canvases before opening, one while open, and zero after closing;
focus returns to the opener. no new console warnings/errors appeared during that
production interaction check. a 712px breakpoint check caught and corrected an
internal listening-deck overflow; phone navigation exposes the new art-room link
through the same shared menu.

## pre-deployment security gate

update: this initial audit was remediated later on 2026-09-11. see
[security readiness](SECURITY-READINESS.md) and [current resume](RESUME-WEBSITE.md)
for the updated versions and checks. the original finding below is retained as
history, not an outstanding critical finding.

a fresh `npm audit --omit=dev` reported 1 critical, 22 high, 22 moderate, and 9 low
dependency findings. counts include installed tooling and are not proof that all
findings are exploitable in the exported website. the existing next version is
15.1.7; no automatic mass dependency upgrade was performed in this design pass.

in particular, the maintainer lists a windows-hosted next server rce affecting
versions before 15.5.24 / 16.3.3:
[maintainer advisory](https://github.com/advisories/GHSA-p293-qw3h-jr36).
the next development server was stopped; the review preview uses the existing
loopback-only static export server, not `next start`. the new artwork and 3d work
do not resolve dependency advisories. apply and verify the compatible framework
security update, assess remaining shipped-vs-tooling findings, then repeat the
export and interaction checks before deployment. do not treat visual approval
alone as a passed security gate.
