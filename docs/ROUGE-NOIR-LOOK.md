# Rouge & Noir — LOOKLOCK v1

Binding art direction for the game + its landing page. Locked 2026-07-26.
Deviations need an explicit decision entry, not a vibe.

Frame: **the roulette pit of a 1930s casino**, not a neon card game. Balatro's
*structure* (run, shop, escalating mult) with none of its look, layout,
terminology, or expressions. Vintage = real materials under warm tungsten, worn
by use. Never "retro-futurism", never neon, never synthwave.

## 1. Materials palette (LOCKED)

Every colour is a material, not a hue. Name them as materials in code.

| token | hex | material |
|---|---|---|
| `--rn-ink` | `#0B0A08` | pit shadow, deepest black-brown (never pure #000) |
| `--rn-walnut` | `#3B2417` | cabinet wood, wheel bowl |
| `--rn-walnut-hi` | `#5A3A24` | lit wood edge |
| `--rn-felt` | `#14452F` | table baize, single-zero pocket |
| `--rn-felt-hi` | `#1D5E3F` | felt under direct light |
| `--rn-oxblood` | `#5B1220` | ROUGE. Velvet rope, red pockets |
| `--rn-oxblood-hi` | `#8E1B2B` | lit velvet / hover |
| `--rn-brass` | `#C9A227` | fittings, rims, rules, engraving |
| `--rn-brass-hi` | `#E8D08A` | specular highlight on brass |
| `--rn-brass-dim` | `#7A6318` | brass in shadow |
| `--rn-ivory` | `#F2E8D5` | bone chips, printed card stock, primary text |
| `--rn-ivory-dim` | `#C4B79E` | secondary text |

Rules:
- Pure `#000` and pure `#FFF` are **banned**. Ink and ivory only.
- Crimson is **oxblood**, not fire-engine red. Desaturate anything hotter.
- Gold is **brass**, warm and slightly green-dirty. No yellow chrome gradients.
- Max 2 accents per viewport: brass + one of oxblood/felt.

## 2. Type (LOCKED)

DB proposed Poiret One + Didact Gothic (Art Deco pairing). **Overruled** —
Poiret One is a hairline decorative face; it collapses at poster scale and reads
boutique-wedding, not casino. Locked instead:

| role | face | why |
|---|---|---|
| display | **Playfair Display** (700/900) | Didone. High stroke contrast + sharp serifs = engraved brass signage. Holds at 12vw. |
| body | **Archivo** | Neutral grotesk, stays legible against ornate display. Already loaded on the route. |
| numerals / HUD | **Archivo tabular**, letterspaced, small caps feel | Vintage pits used engraved plates, not terminal mono. Retire Geist Mono here. |

- Display is **always** letterspaced tight (`-0.02em`) in caps.
- HUD labels: uppercase, `0.3em` tracking, brass, 10–11px.
- Ban: rounded faces (Nunito/Quicksand), ultra-condensed grotesks, mono for flavour text.

## 3. Surface + texture

Stack, bottom → top:
1. Ink base.
2. Warm tungsten pool — off-centre radial, brass-tinted, top-left biased. One light source only.
3. Material fill (felt or walnut) per panel.
4. **Grain** — film grain, `soft-light`, 0.10–0.14. Non-negotiable; kills digital flatness.
5. **Engraving** — brass hairlines at 1px, ~18% opacity. Deco corner rules, double-rule borders, guilloché arcs.
6. Vignette falloff at edges.

Panels are **plates**: 1px brass rule + inner ink shadow. Not glassmorphism, not
neumorphism, no `backdrop-blur` as decoration.

Radii: **2–4px only**. Vintage cabinetry is square-ish. Pills allowed for chips
and primary CTA only.

## 4. Motion

Heavy things with real mass. Slow starts, weighted stops.

- Wheel: continuous slow rotation, `power2.out` on settle. Never linear-forever.
- Ball: orbit decays, drops into a pocket, small bounce. No perpetual spin.
- Chips: arc in, land, settle-wobble (`back.out(1.4)` max overshoot).
- Reveals: 400–600ms, `power3.out`, 20–34px rise. No bounce on text.
- Ban: neon pulse, glitch/skew, CRT scanlines, hue-rotate, infinite blink.
- All entrances `gsap.from({immediateRender:false})` — see FRAMEWORK.md §2.
- `prefers-reduced-motion` → static, and the static frame must look finished.

## 5. Anti-Balatro (hard)

- No pixel/CRT UI, no jelly-bouncing cards, no chunky drop-shadow cartoon text.
  (Scoped by §8 — square *machined ornament* is permitted; pixel-art *UI* is not.)
- No "Jokers" — ours are **charms**. No "blinds/antes" copy lifted verbatim; ante
  is a real roulette term and stays, phrased our way.
- No neon-on-black card frames. Charms are **printed card stock**: ivory ground,
  brass border, oxblood/felt inks.
- No face-card mascots. Dealer is the only character.

## 6. Dealer

Locked identity unchanged: split crimson/black drill twintails, red eyes, pointed
ears, fang, black suit, white shirt, red bowtie. Vintage adjustment: her red reads
**oxblood** in the noir mood and **lit velvet** in rouge. Lighting is warm
tungsten from one side, hard falloff. She is lit like a person in a pit, not a
character select screen.

## 7. Acceptance

A frame passes only if all true:
- No pure black, no pure white, no neon anywhere.
- Grain visible without hunting for it.
- At least one brass engraved rule per section.
- One light source, consistent direction.
- Display type is Didone, body is grotesk.
- Static (reduced-motion) frame looks intentional.
- Nothing reads as pixel-art or jelly. (Test defined in §8.4 — square ornament is
  not automatically a failure; failing §8.4 is.)

---

## 8. Pixel treatment — DECISION 2026-07-26 (resolves §5 / user request)

`docs/HANDOFF.md` carries a standing user request for **more pixel treatment**,
partly shipped (grain is a pixelated upscaled tile; the wheel has 4px brass pips
at cardinal points and a stepped marker tip). Read literally, §5's "no pixel/CRT
UI" and §7's "nothing reads as pixel-art" forbid it. This entry resolves that —
both stand, scoped.

**The rule: milled, not rendered.**

Square, hard-stepped detail is allowed when it exists because *the metal was
milled square*, and banned when it exists because *the display is low-resolution*.
A 1930s pit is full of genuinely orthogonal machined detail — Deco stepped
setbacks, knurled terminals, square inlay pips, engine-turned registration marks.
None of that is pixel-art. Pixel-art is a **rendering-resolution** claim.

### 8.1 Where stepping is allowed

Only on the **brass / engraving layer** — the things that would be milled metal:
corner ornaments, rule terminals, dividers, tick marks, pips, the wheel marker,
print registration/crop marks on charm card stock.

### 8.2 Scale

- One step = **2px**, at 1×. The only legal step sizes are **2px and 4px**.
- Derived from the existing 1px brass hairline: a step is exactly two hairlines.
- No global `--pixel-size`, no scene-wide quantisation, no downscaled viewport.
- Ornament geometry is **vector on integer coordinates** (SVG `<rect>`, CSS
  borders). It is square because its geometry is square — *not* because
  anti-aliasing was disabled. AA stays on everywhere.

### 8.3 Where stepping is banned (hard)

- **Type.** Playfair / Archivo only, always anti-aliased. No pixel face, ever.
- **The dealer**, and any photographic or illustrative art.
- **Panel silhouettes.** Plates keep 2–4px radius; corners are not stepped.
- **Motion.** No frame-stepped sprite animation, no `steps()` easing, no instant
  transitions. Motion stays weighted (§4).
- **Fields.** Stepping terminates an edge; it never tiles across an area. If a
  square motif fills a region, it has become pixel-art.
- **Never**: scanlines, glitch, RGB-split, `image-rendering: pixelated` on any
  content image, limited "retro" palettes, `box-shadow: Npx 0 0` as a border system.
- Colour is unchanged: ornament is **brass**, plus oxblood/felt sparingly. The
  max-2-accents rule (§1) still binds.

### 8.4 Acceptance test (replaces the bare "nothing reads as pixel-art")

A stepped ornament passes only if **all** are true:

1. **2× test.** Rendered at 2×, edges stay hard and clean and the ornament reads
   as finer detail. Pixel-art fails this — its identity depends on the step
   matching display resolution, so at 2× it reads as a blown-up low-res sprite.
2. **Silhouette test.** Stripped of colour, it reads as *stamped/milled metal* or
   *Deco stepped setback*, not as arcade/8-bit.
3. **Marker test.** None of the pixel-art style markers are present: pixel font,
   `image-rendering: pixelated` on content imagery, NES-ish palette, pixel
   box-shadow borders, frame-stepped motion, instant transitions.
4. **Curve counterweight.** The same viewport contains real curved engraving
   (guilloché arc, wheel rim, radial rule). Square detail on a curved machined
   object reads as machining; square detail on square everything reads as pixels.

### 8.5 Sanctioned ornament treatments

- **Stepped Deco corner** — L-shaped corner in three 2px steps (ziggurat /
  setback motif, period-correct). Brass hairline at ~18%, plus one solid 2px
  terminal square. Replaces plain right-angle corners on plates.
- **Knurled rule terminal** — a brass rule whose final ~12px breaks into 2px
  dashes, instead of fading out. Reads as a milled knurl.
- **Milled pips** — 4px brass squares, only at *cardinal points and rule
  terminals*. Already shipped on the wheel; do not repeat them as a field.
- **Charm registration marks** — 2px brass crop/registration marks at the corners
  of the ivory card stock. Period-correct letterpress detail, inherently square.
  This is the sanctioned form of "pixelated charm pips".
- **Chunky rule** — 1px hairline + 2px solid, offset 3px, as the plate
  double-rule. An engraved double-rule, not a pixel border.
- **Required counterweight** — the wheel bowl gets real curved **walnut +
  guilloché** (already outstanding in HANDOFF item 3). Ship it alongside, per
  §8.4.4.

Grain is unaffected and already compliant: a 140px turbulence tile upscaled to
180px (1.29×) at 0.10 opacity is film grain, not a pixel field. Raising that
upscale ratio until individual cells are visible **would** break §8.3 "fields".
