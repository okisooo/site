# Scroll perf harness

Real Chrome-DevTools-Protocol profiling for okiso.net. Written 2026-07-26 to find
the scroll lag that two rounds of guessing had missed. Findings:
`docs/HANDOFF.md` → "Perf — PROFILED FOR REAL".

## Why it exists

Chrome **headless starves rAF**, so headless frame timings and GSAP end-states are
meaningless here. These scripts drive a **headed** Chrome with its own
`--user-data-dir` over raw CDP (Node 22 global `WebSocket`, no deps), dispatch real
`mouseWheel` events, and aggregate `devtools.timeline`.

## Scripts

| file | what it does |
|---|---|
| `profile-scroll.mjs` | aggregate trace: style recalc / layout / paint totals, frame deltas, long tasks, top events |
| `profile-invalidation.mjs` | *why* style recalc fires: invalidation reasons, changed attrs/classes, invalidated nodes, and JS stack traces for forced recalcs |
| `static-server.mjs` | serves the `out/` static export on :3000 so the **production** bundle can be profiled |
| `inject-*.js` | A/B variants injected before page load to isolate one suspect |

## Usage

```bash
node scripts/perf/profile-scroll.mjs /rouge-noir 8000 [injectFile] [label]
node scripts/perf/profile-invalidation.mjs /rouge-noir 6000 [injectFile] [label]
```

Set `PROF_OUT` to choose where the JSON report lands.

Profile the **production** build, not dev — dev and prod came out within noise of
each other here, and that equivalence is itself evidence when it holds:

```bash
npm run build          # NEVER while a dev server is live; it clobbers .next
```

then start the `site-prod` config from `.claude/launch.json` (serves `out/` on :3000).

## Method note that matters

A/B by injecting a variant and comparing, rather than reasoning about which
suspect "looks expensive". All three initial suspects were wrong; the winning
suspect was found by `inject-no-cursor.js` collapsing style recalc 72%.

Cheap in-page probe for the same class of bug — time a mutation, then force a
flush, and compare a root mutation against a leaf one:

```js
const t = performance.now();
document.documentElement.style.setProperty('--x', Math.random());
void document.body.offsetHeight;      // force the flush
performance.now() - t;                // ~30ms here = whole-document recalc
```

If a root mutation costs tens of ms and the same change on a leaf costs ~0, the
property is **inherited** and the fix is to move the animation onto a leaf.

## Committed results (2026-07-26, production build, /rouge-noir, 8s wheel scroll)

| file | run |
|---|---|
| `trace-_rouge_noir.json` | baseline |
| `trace-_rouge_noir-no-cursor.json` | `--cursor-*` writes suppressed → recalc 4168 → 1156 ms |
| `inv-baseline.json` | invalidation reasons, baseline |
| `inv-freeze-wheel.json` | wheel SVG animation frozen (removed 29 277 SVG invalidations, ~1 % of time) |
| `inv-no-css-anim.json` | all CSS animations frozen (~5 % of time) |

**Not yet captured:** a post-fix baseline. The fix landed and builds, but the
confirming re-profile did not complete — rerun `profile-scroll.mjs /rouge-noir 8000`
against a fresh production build and expect it to land near the `no-cursor` column.
