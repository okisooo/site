# OKISO site framework

Shared UI + motion framework for every route on okiso.net. Written 2026-07-25 from
a 5-area codebase audit and three independently-designed, adversarially-judged
architecture proposals. **The current visual contract is
[EDITORIAL-DIRECTION.md](./EDITORIAL-DIRECTION.md), updated 2026-09-06.** The user
rejected soft orbit and requested one dense, character-led editorial language
across the homepage, releases, release details, upcoming, and vault. Rouge Noir
and future OKISO Grain are deliberate standalone exceptions.

The user explicitly reaffirmed white and red as the core brand palette. The
supplied collage reference governs composition and detail, not its yellow/lavender
colors. Older pink/tactical palette notes below must not override that correction.

The historical audit and architecture proposals below remain engineering context,
not authority to restore tactical HUDs, a separate vault theme, or the rejected
soft-orbit palette. Current source and the editorial contract supersede those
older visual recommendations.

Tool reference (skill install, library links, constraints):
`D:\SecondBrain\vault\20-shared\premium-frontend-toolkit.md`.

The visual/token spine in this document is now paired with
[`INTERACTION-FRAMEWORK.md`](./INTERACTION-FRAMEWORK.md). That companion turns
the Apple interaction audit into an OKISO-specific behavior contract and is the
gate for any whole-site redesign.

The rejected candidate is preserved in
[`SOFT-ORBIT-DIRECTION.md`](./SOFT-ORBIT-DIRECTION.md) as history. Local migration
to the shared editorial system is requested; deployment still requires approval.

### External reference feeds

Use these as current-input libraries during art direction, not as component catalogs
to copy. Every borrowed idea must be translated through OKISO's identity, the token
layers below, and the interaction contract; source popularity never outranks those
constraints.

| Source | Best used for | Do not copy |
|---|---|---|
| [Recent](https://recent.design/) | broad visual research across web, typography, motion, 3D, editorial, and branding | its feed layout or trend mix as a substitute for a route concept |
| [Best Designs on X](https://bestdesignsonx.com/) | very recent UI and motion fragments, creator discovery, and interaction references | isolated social-media shots without checking the complete product flow |
| [The Internet Designs](https://www.theinternetdesigns.com/) | targeted interface, landing-page, dashboard, mobile, typography, 3D, and interaction references | category-page composition or generic gallery chrome |
| [Inspora](https://www.inspora.design/) | curated web, branding, product, motion, illustration, 3D, and print references with original-source links | styling detached from the original creator and context |

For a redesign proposal, record one concrete reference per decision—layout, type,
motion, surface, or interaction—and state what is being adapted. A moodboard of
unrelated screenshots is not a design direction.

### Strategic input: audience, positioning, and growth

The [OKISO CMO workspace](https://okara.ai/agent/cmo/c37930b3-12a4-4088-bfc1-95ea44131cff)
is a dated research input, not brand authority. Its accessible product brief,
marketing strategy, crawler draft, and 2026-09-02 technical audit must be checked
against current source before use. The competitor analysis, design guide, and
content strategy are subscription-locked and must not be cited as reviewed.

- **Audience:** online-native VOCALOID, hyperpop, electronic-music, and VTuber
  listeners who discover through YouTube, Spotify, X, and fan communities, then
  deepen through Discord, live streams, and the archive.
- **Positioning:** present OKISO as an independent virtual artist with a connected
  creative universe. The site must not collapse into either a generic link hub or
  a discography grid.
- **Primary path:** latest release first. Supporting paths are featured video/live
  content, the full release archive, upcoming work, and official community channels.
- **Proof before claims:** use real release count, current releases, live state,
  public archive material, and official links. Do not invent scale, coordinates,
  lore, engagement, or campaign results.
- **Channel handoff:** YouTube and Spotify carry discovery; X carries release and
  creator conversation; Discord and Twitch carry retention and participation. The
  site should make those transitions legible without turning the hero into a link farm.
- **Technical gate:** one meaningful `h1` per public route, unique metadata,
  accurate structured data, canonical crawlable URLs,
  and a complete mobile experience before cinematic extras load. Heavy 3D and
  adaptive video code must remain user-initiated or route-split.

The implementation and measurement handoff is [SEO-WORKPLAN.md](./SEO-WORKPLAN.md).
`/llms.txt` is an optional factual directory, not a Google ranking requirement.
No AI-generated art assets are permitted in the site or its design prototypes;
use OKISO's existing original artwork and authored media.

The workspace's numeric audit is a production snapshot, not a permanent score.
Reproduce any performance or SEO defect on the candidate branch before treating it
as current; human visual judgment and real browser behavior still decide whether a
direction ships.

---

## 0. Why — verified defects this framework exists to fix

Every item below was confirmed by reading the files, not inferred.

| # | Defect | Evidence |
|---|---|---|
| 1 | **Three contradictory token systems.** Hand-written `--ba-*` CSS vars, literal `ba-*` hexes in Tailwind, and a shadcn oklch block. Nothing bridges them. | `globals.css:5-27`, `tailwind.config.ts:19-37`, `globals.css:48-115` |
| 2 | **Ten token pairs hold opposite values.** `ba-white` = `#FAFBFF` in Tailwind but `--ba-white` = `#0A0D14` in CSS. `ba-dark` = `#2D3047` vs `--ba-dark` = `#FAFBFF`. Same name, inverted meaning. | `tailwind.config.ts:32` vs `globals.css:20`; `:35` vs `:24` |
| 3 | **`/vault` is broken in the default theme.** Default theme is `light`; `/vault` forces `bg-black text-white` on a div but `.vault-*` classes gate their dark styling behind `dark:`. First-time visitors get `.vault-panel` = `bg-white/90` with inherited `text-white` → white text on a white panel, and `.vault-secondary` = `text-black` on a black page. | `layout.tsx:91`, `vault/page.tsx:22`, `globals.css:366,369,375`, `VaultClient.tsx:202,291` |
| 4 | **`vault-theme` class is applied but defined nowhere.** An abandoned theme-scope hook — and the natural insertion point for a real one. | `vault/page.tsx:22` (only occurrence repo-wide) |
| 5 | **All 28 `font-mono` usages fall back to system monospace.** Tailwind maps mono to `var(--font-geist-mono)`, which is defined nowhere in the repo. This directly undercuts the HUD-label look the visual target depends on. | `tailwind.config.ts:42` |
| 6 | **A webfont is downloaded on every page and never rendered.** Geist is loaded as `--font-sans`, but `fontFamily.sans` is never extended, so `font-sans` resolves to the system stack and `body` then applies `font-ui` (Quicksand). | `layout.tsx:11,73`, `globals.css:31,122` |
| 7 | **`.theme { --font-sans: var(--font-sans) }`** is a circular self-reference and a no-op. | `globals.css:117-119` |
| 8 | **The shadcn oklch block is dead weight** — only 4 of ~30 vars are mapped into Tailwind, so `bg-card` / `text-muted-foreground` / `bg-primary` do not exist in this project. But those are exactly what any pasted shadcn / 21st.dev / reactbits component assumes. | `tailwind.config.ts:14-17`, `globals.css:48-115` |
| 9 | **`body` hard-codes its own theme and defeats the token layer.** `bg-white text-black dark:bg-black dark:text-white` (class, 0-1-0) beats `body { @apply bg-background }` (element, 0-0-1) regardless of layer order. | `layout.tsx:88` vs `globals.css:31` |
| 10 | **`hls.js` is a static top-level import**, so it ships eagerly on the home route. | `CustomVideoPlayer.tsx:6` |
| 11 | **Dead code with zero importers repo-wide.** | `src/Components/PageTransition/PageTransition.tsx`, `src/hooks/useSmootNavigation.ts` |
| 12 | **Zoom is disabled** — `maximum-scale=1, user-scalable=no` is a WCAG failure. | `layout.tsx:79` |
| 13 | **No shared chrome.** The shell's only header/footer are `sr-only`, so all 6 routes hand-roll nav and footer; the `← Back` pill is copy-pasted verbatim. | `layout.tsx:100-112`; `releases/ReleasesClient.tsx:52`, `upcoming/UpcomingClient.tsx:26`, `rouge-noir/RougeNoirClient.tsx` |
| 14 | **Pages fight over scroll.** Three routes write `document.body.style.overflow` directly — which is exactly what breaks once a smooth-scroll runtime exists. | `ReleasesClient.tsx:21-34`, `UpcomingClient.tsx:10-15` |

**Honest finding from the judging round:** all three proposals scored 3–4/10 on
*motion quality*. Each was an excellent token-migration plan wearing a framework
costume. So this document commits fully to the token/theming/chrome spine (which
is verified, high-leverage, and low-risk) and treats **cinematic motion as a
separate design problem** that the runtime enables but does not solve. Shipping
the runtime is not the same as the site feeling like Endfield; that needs
per-page art direction.

---

## 1. Layers

```
L0  asset      basePath-safe URL helper                     src/lib/asset.ts
L1  primitive  raw scales: color ramps, space, type, z      src/styles/primitives.css
L2  semantic   role tokens: surface/ink/line/accent          src/styles/semantic.css
L3  bridge     shadcn var names -> L2 (for pasted parts)     src/styles/compat.css
L4  scope      per-route palettes via [data-theme-scope]     src/styles/scopes.css
L5  motion     tier resolver, Lenis+GSAP runtime, hooks      src/motion/*
L6  primitives declarative components every page composes    src/Components/kit/*
L7  chrome     nav/footer/toggle contract per route          src/Components/chrome/*
```

### Colors are stored as channel triplets

```css
--surface-0: 255 255 255;          /* not #fff */
```

Tailwind consumes them as `rgb(var(--surface-0) / <alpha-value>)`. This is what
preserves the ~131 existing `/alpha` usages (`bg-white/70`) without editing a
single call site. **Cost:** hand-written CSS must use `rgb(var(--x))`; writing
`color: var(--ink-1)` is a silent no-op. Keep a paired `--x-c` (`color`) form for
raw CSS and treat only `-c` forms as legal there.

### Theme scoping

`darkMode: ["variant", ["&:is(.dark *)", "&:is([data-scheme='dark'] *)"]]` in
`tailwind.config.ts` (array-form `variant` is supported in Tailwind 3.4). Then a
`<ThemeScope name="vault">` wrapper sets `data-theme-scope` + `data-scheme="dark"`,
and every existing `dark:` variant inside it resolves correctly — **fixing defect
#3 without editing any `.vault-*` class**. `.dark .x` keeps working because
`&:is(.dark *)` is a superset of it.

Current scopes: `.core-site` (shared white/red editorial system,
including the vault) and standalone `rouge-noir` (existing crimson/gold world).
The old separate dark/serif vault recommendation is superseded.

Moving `/rouge-noir`'s inline `<style>` tokens into `scopes.css` has a second
payoff: the tokens become visible to Tailwind's content scanner, so `bg-accent`
works instead of every colour being an arbitrary `bg-[var(--rn-crimson)]`.

---

## 2. Motion runtime (L5)

One provider owns scroll. It resolves a **tier** and publishes it on `<html>` as
`data-motion-tier` + `data-motion-armed`.

| tier | when | what runs |
|---|---|---|
| `cinematic` | desktop, fine pointer, capable GPU, motion allowed | pin, scrub, horizontal scroll, split text, magnetic, WebGL bg |
| `standard` | most mobile / mid-tier | fades, staggers, parallax; no pin, no WebGL |
| `minimal` | `prefers-reduced-motion`, save-data, low memory, no JS, GSAP failed to load | nothing; static composition only |

Tier comes from the existing `src/hooks/usePerformanceDetection.ts` — extend it,
do not write a second detector.

### The armed rule (non-negotiable)

Hidden-then-reveal states are armed **only after** the motion library has
actually loaded, via `data-motion-armed` on `<html>`. Content must never be
permanently invisible because a chunk failed, JS was off, or a crawler visited.
`/rouge-noir` already does this correctly (`.rn-js` added only inside the
resolved dynamic import) — that pattern is hoisted, not reinvented.

### Lenis ↔ GSAP bridge

Verified working shape (`lenis` on npm; `@studio-freight/lenis` is deprecated):

```ts
const lenis = new Lenis({ autoRaf: false });          // GSAP owns the RAF loop
lenis.on("scroll", ScrollTrigger.update);              // scroll -> triggers
gsap.ticker.add((t) => lenis.raf(t * 1000));           // ticker -> lenis (s -> ms)
gsap.ticker.lagSmoothing(0);                           // no post-tab-switch jump
```

`ScrollTrigger.scrollerProxy` is **not** needed and must not be used: Lenis in
default `wrapper: window` mode smooths native window scroll, which ScrollTrigger
already observes. `scrollerProxy` is only for a scrolling *container*.

Route changes must `lenis.scrollTo(0, { immediate: true })` then
`ScrollTrigger.refresh()` on the next frame. Nested scrollables (modals, the
vault manager, r3f `OrbitControls`, the VRM grab region) need `data-lenis-prevent`.

**Prerequisite:** `overflow-x: hidden` must be removed from `body`
(`layout.tsx:88` and `globals.css:31`) and replaced with `overflow-x: clip` on a
shell wrapper. `hidden` creates a scroll container that breaks sticky and pinning;
`clip` does not. And the three `document.body.style.overflow` writers must be
replaced by one `useScrollLock` owned by the framework.

**Deliberate rejection:** GSAP's own `ScrollSmoother` is already licensed and free
and needs no bridge, but its transformed `#smooth-content` reparents the
containing block of every `position: fixed` descendant — and this site has 7+ of
those plus 4 modals. Lenis is chosen for that reason alone. If the chrome is ever
restructured so no fixed element lives inside the content wrapper, ScrollSmoother
becomes the better answer, and `src/motion/lenis.ts` is the only file that changes.

---

## 3. Primitives (L6)

```tsx
<Section index="02" label="Charms" width="wide" rhythm="lg">
<SectionHeader kicker title sub />
<Reveal as="div" y={34} delay={0}>            // tier-gated fade/rise
<Parallax speed={-0.15}>                       // scrub, transform only
<Pin length="+=1200" timeline={fn}>            // cinematic + >=900px only
<HorizontalScroller minWidth={900}>            // pinned sideways gallery
<SplitHeading trigger="mount" | "scroll">      // char/word cascade
<CountUp to={37} />
<Magnetic strength={0.35}>                     // pointer:fine only
<FxBackground kind="grain"|"grid"|"veil"|"waves" allowWebGL />
<MediaSlot ratio="16/9" label>                 // the art-slot placeholder
<Ticker items tone />                          // HUD marquee
<HudFrame /> <IndexLabel /> <Meta />           // Endfield annotation set
<BackPill href> / <PageNav routes>             // kills defect #13
```

Promote from `/rouge-noir/_components/` (already built and reviewed): magnetic
button, HUD set, ticker, preloader.

**Acceptance test for the whole framework:** `/rouge-noir` must be reproducible
1:1 by composing these primitives with **zero bespoke GSAP** in the page file — a
net deletion of ~250 lines. If it can't, the primitives are wrong.

---

## 4. Per-route treatment

| route | treatment |
|---|---|
| `/` | Layered editorial cover with the existing original character, latest artwork, listening deck, actual media and channels. |
| `/releases` | Shared mounted cover grid, real search, quick listening, optional deferred 3D archive. |
| `/releases/[slug]` | Shared masthead, large artwork mount, factual credits, listening controls and native lyrics. |
| `/upcoming` | Same shell and panels, truthful announcement state, no full-page scroll lock. |
| `/vault` | Same shell, typography, colors and controls; preserve all backend-enforced access and management contracts. |
| `/rouge-noir` | Standalone exception. Do not migrate it into the core editorial system. |
| `/lab/soft-orbit` | Noindex review alias using the same homepage component; not a second design language. |

---

## 5. Migration order (each step independently shippable)

The site must never be broken mid-migration. Steps 1–7 are near-invisible
plumbing; that is the price of not big-banging a live site whose
`next.config.ts:20-26` disables **both** ESLint and TypeScript build errors —
there is no compile-time safety net, so every commit must be verifiable against a
built `/out`.

1. **Additive, provable no-op.** Add `asset.ts` + `primitives.css` + `semantic.css` + `compat.css`, `@import` them, add the new Tailwind names *alongside* the existing `ba-*`, add `zIndex`/`fontSize`/`borderRadius` scales. Nothing consumes them yet → byte-identical output. Same commit: delete the two dead files and the circular `.theme` rule.
2. **Typography + tooling.** Drop the never-rendered Geist sans; add `Geist_Mono` as `--font-mono` and point `fontFamily.mono` at it → all 28 `font-mono` sites become real mono (defect #5, the highest-leverage visual fix at a flat font budget). Fix `components.json` aliases to capital-`C` `@/Components`; add an `AssetStyle` so cursor/noise URLs respect `basePath`.
3. **Flip `body` to tokens, pixel-identical.** Seed `--surface-0`/`--ink-1` with today's literal values, then replace the hard-coded body classes. Same commit: `overflow-x: hidden` → `clip` on a shell wrapper (the Lenis prerequisite).
4. **Retire the palette drift.** Delete the `--ba-*` block; re-point every `ba-*` Tailwind name at a semantic var, seeded from the *Tailwind* hexes because those are what actually renders. Only two visible deltas — `::selection` and `.bg-classroom-grid` — both currently dark-in-light-mode, i.e. both are bug fixes.
5. **Theme scoping.** `darkMode` variant array + `ThemeScope`; wrap `/vault`. Fixes defect #3.
6. **Chrome contract.** `routes.ts` + `<Chrome />`; hide the theme toggle on dark-only routes; move z-indices onto the scale.
7. **Kill scroll-hostile code.** `useScrollLock` replaces all direct `body.style` writes; `CustomCursor` → `gsap.quickTo`. One scroll owner; Lenis-ready.
8. **Motion runtime, dark.** `npm i lenis`; land provider/tier/hooks behind `MOTION_ENABLED=false` — in the tree, costs nothing.
9. **Turn Lenis on** behind that one constant, against an explicit test matrix: all 4 modals, orbit-mode lock, `/upcoming` full lock, keyboard paging, `OrbitControls`, VRM grab region, all 6 routes' client navigation, iOS momentum. Regressions get `data-lenis-prevent` or a route opt-out — never a body-style hack.
10. **Primitives, then one page per PR**, ascending risk: `/releases/[slug]` → `/upcoming` → `/vault` → `/releases` → `/` → `/rouge-noir` last.
11. **External components, each revertable.** Hand-port **one** 21st.dev chrome component — do **not** run `npx shadcn add`: the pinned `shadcn ^4.0.8` emits Tailwind-v4 `@theme inline` / `size-*` syntax that will not compile against this v3 JS config. TextPressure only if the variable-font hero is actually wanted, via `npx jsrepo add TextAnimations/TextPressure` (`jsrepo.json` already targets reactbits.dev ts/tailwind), on exactly one wordmark, `cinematic` only, never inside a pinned section. Finally re-enable ESLint + TypeScript build errors.

---

## 6. Library verdicts

- **GSAP + ScrollTrigger** — already installed; the spine of scroll motion. Load dynamically so `minimal` tier never pays for it (~57 KB gz for core + ScrollTrigger + SplitText + Flip + Observer).
- **Lenis** — adopt, ~10 KB gz, whole-app, wired as above. Real risk surface (scroll anchoring, find-in-page, keyboard paging, iOS momentum, every nested scrollable) — hence the dedicated step 9 matrix behind one constant.
- **framer-motion** — keep for discrete enter/exit and the 4 modals + preloader. ~34 KB gz resident is the one genuinely unpleasant number; porting those modals to GSAP/Flip later removes it.
- **Vanta.js — do not adopt.** Verified: latest is `0.5.24`, last published **2022**, unmaintained. It needs a global `window.THREE`, spins up a *second* WebGL context alongside the four canvases this site already runs (r3f OrbitGallery, VRM, ogl DarkVeil, Waves), and duplicates capability already paid for. (Correction to one research pass: npm declares *no* three.js peer range — the "pinned to r121–r134" claim is inferred from internal API use, not a manifest constraint, and several effects broke after `THREE.Geometry` was removed in r125.) If it is still wanted, the only defensible placement is `/upcoming` — the one route with no competing WebGL context — behind `dynamic(ssr:false)`, `cinematic` only. Everywhere else `DarkVeil`/`Waves` behind `<FxBackground>` is strictly better and already free.
- **reactbits TextPressure** — belongs narrowly. Needs a real variable font with `wght`/`wdth` axes in `/public`, which is exactly the `basePath` trap that already broke the cursor frames, so `AssetStyle` lands first. It rewrites `font-variation-settings` on every character every frame → one wordmark only, `cinematic` only. For everything else `<SplitHeading>` on GSAP SplitText is cheaper and integrates with ScrollTrigger natively.
- **21st.dev** — chrome only (nav shells, docks, dialogs, badges, marquees), never hero motion, and always hand-ported. The L3 bridge is what makes their `bg-card` / `text-muted-foreground` classes resolve at all.
- **`ui-ux-pro-max` skill** — advisory. Its palette output does **not** outrank OKISO's user-confirmed white/red identity (existing red primitives `#FF4D4D` / `#CC0000`; rouge-noir crimson/gold remains standalone). Many of its style/motion rows are React-Native-flavoured (Reanimated, haptics) — take the principles, not the APIs.

---

## 7. Standing rules

1. No raw hex in components. Tokens or Tailwind names only.
2. Animate `transform` and `opacity` only. Never `width`/`height`/`top`/`margin`.
3. Nothing is hidden unless the runtime is armed and can reveal it.
4. Every interactive element has a visible `:focus-visible` ring.
5. Motion effects are tier-gated; `minimal` must be a complete, good-looking page.
6. One scroll owner. No page writes `document.body.style` directly.
7. `pin` at most 1–2 sections per route.
8. Static export must keep working: no server actions, no middleware, no runtime routes.
