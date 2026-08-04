# Handoff — tactical home page (branch `feat/home-tactical`)

Repo-local companion to the vault note
`D:/SecondBrain/vault/10-projects/site/sessions/2026-08-04--tactical-home-redesign.md`.
This file describes only the home-page redesign. `docs/HANDOFF.md` still governs
the rest of the site.

## Resume

```bash
cd D:/GitHub/site
git checkout feat/home-tactical    # 4 commits ahead of main, tree clean
npm run dev:webpack                # NEVER `npm run dev` — Turbopack breaks next/font here
```

Branch is **not pushed**. `main` is deployed and current.

## Direction (binding — chosen by the user from a reference set)

"Tactical abstract / futuristic editorial / techwear UI collage" — Arknights
Endfield / ZZZ family. Decisions given explicitly:

- **Artwork is procedural in code**, not generated plates. "Aim for that
  aesthetic, you don't have to do the same art."
- **The VRM avatar stays in the hero, restaged** inside the collage with HUD
  brackets and callouts. Not moved down, not cut.
- **Brand colours are red and white.** `ba-pink #FF7EB3` is legacy Blue-Archive
  theming, not identity. Red `#e6112b` is the single signal colour.
- Scope was the whole home page, on a branch, screenshots before deploy.

## Files

| File | Role |
|---|---|
| `src/styles/tactical.css` | The design system. Imported from `globals.css`. Read this first. |
| `src/Components/Tactical/TacticalHero.tsx` | Hero: procedural contour/shard/dot layers, HUD rails, callouts, subject frame, parallax. |
| `src/Components/Tactical/TacticalBoot.tsx` | ~1.5s boot sequence with diagonal wipe. |
| `src/app/page.tsx` | Composes the above; sections 003–006. |

Type stack: Archivo 700/900 display, JetBrains Mono for the whole annotation
layer, Noto Sans JP for CJK marks. Declared in `page.tsx`, exposed as
`--font-tac-display` / `--font-tac-mono` / `--font-tac-cjk`.

## Rules of the language

Breaking any of these is what makes it stop reading as a system:

- **No border radius. No soft shadows. No `backdrop-blur`. No pink.**
- **Red is signal, not decoration** — keep it under roughly 5% of pixels.
  `.tac-plate-mark` corner ticks are opt-in for exactly this reason; applying
  them to every card was tried and it cheapened the whole page.
- **Mono for all metadata** — labels, counts, timecodes, statuses. Steel colour,
  ~10px, `0.2em`–`0.3em` tracking, tabular numerals.
- **Animate `transform` and `opacity` only.** No `filter`, no `mix-blend-mode`,
  no animated `box-shadow`.
- **Dark geometry never sits under UI text.**

## Next step

Convert `/releases`, `/upcoming`, `/vault` using the existing primitives —
`.tac-section`, `.tac-sec-head`/`-index`/`-label`, `.tac-h2` (+ `.tac-h2-sub` in
narrow columns), `.tac-plate` (+ `.tac-plate-mark` sparingly), `.tac-toggle`,
`.tac-cta`/`.tac-cta-ghost`, `.tac-modal`. Do not invent parallel classes.

Then dark mode: `tactical.css` has `:is(.dark)` branches throughout and **none
have ever been rendered**.

## Traps specific to this work

- **JS `element.style.transform` overrides a CSS animation on the same element.**
  Ambient drift and pointer parallax must live on nested nodes (`.tac-plx` for
  the pointer, `.tac-amb` for ambient) or the page freezes whenever the mouse
  stops. Same reason the ghost wordmark's drift is on its inner span — the
  wrapper is a `motion.div` that writes an inline transform on entrance.
- **`AnimatePresence` exit can trap the page.** Overlay removal must be
  timer-driven (`up → leaving → gone`), never dependent on an exit animation
  completing — if rAF is starved it never finishes and the site sits behind a
  black screen.
- **Per-letter mask columns crop glyphs two ways**: negative `letter-spacing`
  shrinks each glyph's advance below its ink width, and inherited
  `flex-shrink: 1` inside a `max-width` parent squeezes the columns. "OKISO"
  rendered as "CKISC". Tracking goes on the column as negative margin; columns
  need `flex: 0 0 auto`.
- **SVG rotation needs `transform-box: view-box` + an explicit origin.**
  `fill-box` resolves `center` against the element's own bbox and silently puts
  the rotation in the wrong place.
- **Verification is unreliable here, in three separate ways.** Headless Chrome's
  virtual clock stalls behind the 15MB avatar fetch, so `--virtual-time-budget`
  freezes the boot mid-sequence. Two headless Chromes back-to-back both stream
  that model through the single-threaded static server and the second throws a
  client-side exception — screenshot one at a time. And the Browser pane does not
  composite when hidden, so rAF never runs: drive the Web Animations API
  (`anim.currentTime = ms`) to test motion, and CDP `Input.dispatchMouseEvent`
  to test pointer handlers.
- **`@gltf-transform/cli` destroys `public/model.vrm`** — it does not understand
  the VRM extension and a no-op `copy` strips it plus every binary buffer
  (15,698,600 → 127,588 bytes). Use a VRM-aware tool or leave the file alone.
