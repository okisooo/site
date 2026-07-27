# Handoff — okiso.net (2026-07-27)

Run dev: `npm run dev:webpack` (port 3000). **Do NOT use `npm run dev`** —
Turbopack + `next/font` fails here with
`Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'`.
Never run `npm run build` while a dev server is live; it clobbers `.next` and the
dev server then 500s (fix: stop dev, `rm -rf .next`, restart).

Screenshot loop without the Browser pane:
`chrome.exe --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --window-size=1440,900 --virtual-time-budget=14000 --screenshot=out.png http://localhost:3000/rouge-noir`
(rAF is starved in headless, so GSAP end-states won't show — that's why entrances
use `gsap.from({immediateRender:false})`.)

## Read first

- `docs/FRAMEWORK.md` — site framework: token layers L0-L7, motion runtime, 11-step migration, library verdicts.
- `docs/ROUGE-NOIR-LOOK.md` — LOOKLOCK v1, binding art direction + §7 acceptance checklist.

## Done

- Token layers `src/styles/{primitives,semantic,compat,scopes}.css` + additive Tailwind names. No call sites migrated yet.
- `src/Components/kit/` — 10 primitives built, **zero consumers**.
- Scroll runtime `src/motion/` — Lenis 1.3.25 bridged to ScrollTrigger, `useScrollLock`, `useScrollTo`.
- `/rouge-noir` reskinned to LOOKLOCK (Playfair Didone, oxblood/brass/felt/walnut).
- Bugfixes: `/vault` white-on-white in light theme; `font-mono` resolved (was undefined); dead `PageTransition`/`useSmootNavigation` deleted.

## Next, in order

1. **Finish `/rouge-noir`:** dealer figure is still the procedural placeholder
   and is lit flat — §6 wants warm tungsten from one side with hard falloff.
2. **Next perf item** (measured, not dominant — see the perf section): the three
   transform-animated SVG groups in `RouletteWheel.tsx`.
3. **Adopt the kit** — FRAMEWORK.md §5 step 10 order: `/releases/[slug]` → `/upcoming` → `/vault` → `/releases` → `/` → `/rouge-noir` last as acceptance test.
4. **Main site is untouched** — `/`, `/releases`, `/upcoming` still original design.
5. **Nothing here is committed.** The whole `/rouge-noir` route is still untracked
   (`git status` shows `?? src/app/rouge-noir/`), so `git diff` reports nothing for
   it — read the files, don't trust an empty diff.

## Done 2026-07-27

- **Cursor: verified, then deleted.** The leaf-sprite fix was confirmed by profile
  (below), then the user called it — the custom cursor is gone entirely.
  `src/Components/CustomCursor.tsx` deleted, its mount removed from `layout.tsx`,
  and the whole `--cursor-*` / `.okiso-cursor` / `okiso-cursor-armed` block in
  `globals.css` replaced by one static `cursor: pointer` rule for interactive
  elements. `public/cursors/frames/*.png` (24 files) are now **dead assets still
  shipping in the export** — delete them when convenient.
- **Pixel treatment shipped per ROUGE-NOIR-LOOK.md §8.5** (swarm, antigravity
  `gemini-3.6-flash-high`), all six items: stepped Deco corners on `.rn-frame` and
  a new `.rn-plate`, chunky double-rule, `.rn-rule-knurl{,-l}`, charm registration
  marks, walnut + guilloché wheel bowl, plus the `dataset.hidden`/`dataset.solid`
  change guard. All of it is **static paint** — nothing new is animated, no JS
  drives any ornament.
- Two follow-ups applied by hand after visual review:
  - Step alpha is substrate-dependent. 18% brass vanishes into the walnut plates,
    so the staircase is now `--rn-step`: 0.18 on `.rn-frame` (over ink), 0.34 on
    `.rn-plate` (over walnut). Static declaration — a custom property only costs
    anything when it is *rewritten at runtime on the root*.
  - `#loop` had square ornament and **no curved engraving**, failing §8.4.4. Added
    a static concentric-arc sweep (5 circles, brass, ≤10% alpha, `md:` only).
- **Charm and dealer sections rendered and inspected for the first time.** Charm
  registration marks read as letterpress crop marks. Dealer matches §6 identity.
- **Ball now obeys §4** — decays, drops into a pocket, bounces once, settles, then
  rides with the pocket ring. Three nested groups: `.rn-ball-ride` (phase-locked
  to `.rn-wheel-spin`, infinite) → `.rn-ball-orbit` (decay, one-shot `forwards`)
  → `.rn-ball-drop` (radial fall + bounce, one-shot). Reduced-motion places it
  statically in a pocket. No JS.
- **24+4 dead cursor assets deleted** (`git rm public/cursors`, 28 tracked files).

### ⚠️ `transform-box: fill-box` was silently breaking the ball orbit

The ball **never orbited**, before or after the §4 rewrite — the previous handoff's
"still orbits" was wrong. `.rn-ball-orbit` carried
`transform-box: fill-box; transform-origin: center`, and `fill-box` resolves
`center` against the element's **own** bounding box. For the ball that box is a
13 px circle, so `rotate()` spun it in place. Computed style proved it:
`transform-origin: 6.5px 6.5px` (the ball radius). Fixed with
`transform-box: view-box; transform-origin: 200px 200px`.

`.rn-wheel-spin` and `.rn-cone-spin` get away with `fill-box` **only by
coincidence** — their bounding boxes are already centred on the wheel centre.
Any new *off-centre* SVG group that rotates must use `view-box`.

**How to test motion without a compositing browser.** The Browser pane does not
composite when hidden, so `getBoundingClientRect` over time reads frozen and will
fool you into thinking nothing animates. Drive the Web Animations API instead —
set `currentTime` and force a flush; layout updates without compositing:

```js
document.getAnimations()
  .filter(a => a.effect?.target?.classList?.contains('rn-ball-orbit'))
  .forEach(a => a.currentTime = 5000);
void document.body.offsetHeight;   // then measure
```

Also: in headless, GSAP-pinned sections paint at wrong offsets (rAF starvation),
so a ticker band can *appear* overlapping the hero. Verify with real layout
positions before believing a headless screenshot — in this case the tickers were
at y=751 and y=5517 with the hero ending at 738, i.e. no overlap.

### Screenshot regions without the Browser pane

`shot.mjs` (CDP, `Page.captureScreenshot` with `clip` + `captureBeyondViewport`)
beats `--screenshot`: it clips to a **selector's** box anywhere down the page, so
pinned/below-the-fold sections are reachable without scrolling. Two traps: the
first `.rn-charm-card` in DOM order is inside the `md:hidden` grid and measures
0×0 at desktop width, and `#dealer` is a pinned section so its capture has a huge
empty spacer below the content. Both are expected, not bugs.

## Traps

- `border-[var(--x)]/40` **silently fails** — Tailwind can't alpha an arbitrary hex var, so it drops to `border` = gray-200. 49 of these were fixed; use real `rgba()`.
- Never edit repo files while a swarm worker runs: exit-4 revert restores its own pre-run shadow and destroys host edits.
- Swarm exit 5 is a false alarm when the deliverable is a `-Report` outside the workdir.
- **Git Bash rewrites leading-slash arguments into Windows paths.** Any script
  taking a route (`profile-scroll.mjs /rouge-noir`) must be run from PowerShell,
  or with `MSYS_NO_PATHCONV=1`. This silently cost a whole profiling run.
- `next.config.ts` disables ESLint **and** TS build errors — no compile safety net. Verify against a real build.
- `layout.tsx` still has `maximum-scale=1, user-scalable=no` (WCAG fail, untouched).

## Perf — PROFILED FOR REAL 2026-07-26, root cause found and fixed

Harness + raw traces committed at **`scripts/perf/`** (see its README). Headed
Chrome over raw CDP — headless starves rAF, so its frame timings are worthless.
Full write-up: `SecondBrain/vault/10-projects/site/evidence/2026-07-26-scroll-profile.md`.

**Cause: `CustomCursor` rewrote two inherited custom properties on `documentElement`
every 80 ms.** Each write costs **30–36 ms of forced full-document style recalc**;
at 12.5 Hz that is **375–450 ms per wall-clock second, on every route, always** —
~40 % of the main thread. Suppressing only those writes, same prod build:

| | before | after |
|---|---|---|
| style recalc | 4168 ms | 1156 ms (−72 %) |
| elements restyled | 260 446 | 12 935 (−95 %) |
| long tasks | 34 | 9 |
| frames > 33 ms | 42 | 7 |

**The earlier `*` → `html` fix was the right suspect with the wrong mechanism, so it
changed nothing.** The cost is not `*` selector matching — `cursor` and custom
properties are *inherited*, so mutating them **on the root** recomputes every
element's style no matter which selector delivers it. Proof: doing the identical
animation as a **class swap** on `<html>` measured **33.4 ms** — no cheaper.
Measured: root custom prop 30–35 ms · root class swap 33.4 ms · leaf attribute
0.1 ms · `background-image` on one fixed leaf **0 ms** · `transform` on one fixed
leaf **0 ms**.

**Fix landed** as one fixed leaf sprite moved by `transform` and re-framed by
`background-image`, root touched once. **Then the custom cursor was removed
entirely** (2026-07-27, user's call) — native cursors only. The measurement below
is of the sprite version, i.e. it is the honest cost of *the fix*, not of the
deletion; the deletion can only be cheaper.

✅ **Verified 2026-07-27**, fresh prod build, same 8 s wheel-scroll. The fix beat
its own prediction:

| | baseline | predicted (A/B) | measured | after ornament (2 runs) |
|---|---|---|---|---|
| style recalc | 4168 ms | 1156 ms | **846 ms** | 1002 / 909 ms |
| max elements in one recalc | 2187 | 36 | **42** | 71 / 73 |
| long tasks | 34 | 9 | **0** | 4 / 3 |
| frames > 33 ms | 42 | 7 | **0** | 6 / 4 |
| p99 frame | 41.2 ms | 23.0 ms | **5.9 ms** | 9.3 / 7.0 ms |

The §8 ornament costs a small, real tail regression (a few long tasks, worst
frame ~60–70 ms vs 26 ms) while the dominant metric stays in the ~850–1000 ms
band. Two runs each, so treat the tail delta as observed, not characterised.

⚠️ **Why the earlier run "stalled":** `profile-scroll.mjs` takes the route as
`argv[2]`, and **Git Bash mangles a leading-slash argument into a Windows path**
(`/rouge-noir` → `C:/Program Files/Git/rouge-noir`), so CDP answers
`{"code":-32000,"message":"Cannot navigate to invalid URL"}`. Run the profiler
from **PowerShell**, or set `MSYS_NO_PATHCONV=1`.

Rule going forward: **never animate an inherited or custom property on `html`/`body`.**

Still true from the earlier pass (kept, all verified no-ops or wins):
- Removed `mix-blend-mode: soft-light` from the full-viewport grain layer.
- Promoted fixed overlays with `translateZ(0)` + `contain: strict`.
- Deleted `feDropShadow` around the spinning wheel groups → static gradient cast shadow.
- Deleted the `drop-shadow` filter on the opacity-animated dealer SVG.

### Next perf item (measured, not dominant)

The three transform-animated SVG groups in `RouletteWheel.tsx` (`.rn-wheel-spin`
= 37 `<path>` + 37 `<text>`, `.rn-cone-spin`, `.rn-ball-orbit`) emit **29 277**
`LayoutInvalidation::SVG changed` events in 6 s. Freezing them removed *all* of it
and moved total recalc ~1 % — so it dominates invalidation **counts**, not **time**.
Now unblocked: the cursor fix is confirmed.
The static guilloché rosette added to that same SVG sits **outside** all three
animated groups, so it is painted once and never re-invalidated — keep it that
way. The `dataset.hidden`/`dataset.solid` unguarded writes are **fixed**.
