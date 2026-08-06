# OKISO signal archive interaction framework

Status: **prototype gate**, 2026-08-07. This document extends
[`FRAMEWORK.md`](./FRAMEWORK.md); it does not replace its token, theme, scroll,
or accessibility layers.

Source lens: Emil Kowalski's
[Apple design skill](https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md).
We adopt its interaction principles, not Apple's visual language.

---

## 1. Decision

Keep the current runtime stack. The site does not need another motion library.

| owner | responsibility | hard boundary |
|---|---|---|
| Framer Motion | pointer/touch gestures, shared geometry, interruptible springs, sheets | no scroll choreography |
| GSAP + ScrollTrigger | authored scroll sequences and FLIP where route navigation requires it | no component hover/press state |
| Lenis | the single page-scroll owner | routes never write `body.style` |
| CSS | paint, focus, contrast/transparency fallbacks, simple hover/press state | no transition on gesture-owned transforms |
| R3F / Three | scene-frame motion | no Framer-driven Three objects |

The framework gap was not package selection. It was the absence of a shared
interaction model. The tactical branch made the pages visually consistent, but
most actions still behave like a conventional card site while most motion is
autonomous decoration.

---

## 2. Product model: signal archive

OKISO is a music and virtual-artist world, not a generic command dashboard.
Every scene therefore starts with a real artifact—cover, track, voice, video,
countdown, or access state—and makes that artifact directly operable.

### Invariant grammar

- Bone, ink, steel, and sparse signal red. No pink, glass, blur, soft shadow, or
  ornamental gradients.
- Archivo is the expressive voice. Mono is reserved for real dates, playback,
  access, track, and system state—not decorative telemetry.
- Hard depth comes from cropped media, solid fields, masks, rule-weight changes,
  offset layers, and foreground occlusion.
- Fake coordinates, arbitrary channel numbers, empty plates, and ornamental
  radar are removed unless they communicate real state.
- Music art is the primary visual material. Interface furniture supports it.

### Route scene contracts

| route | scene | first-viewport answer | primary action |
|---|---|---|---|
| `/` | broadcast arrival | who OKISO is and what is transmitting now | hear the newest work |
| `/releases` | release chronology | what exists and where it sits in time | inspect or play a release |
| `/releases/[slug]` | listening dossier | what this release is and how it sounds | play a chosen track |
| `/upcoming` | transmission queue | what is next, or what fills the silence | follow / notify / preview |
| `/vault` | restricted reel room | what is accessible and what is locked | inspect, seek, or unlock |
| `/rouge-noir` | separate locked world | explicit portal into another identity | enter its own experience |

Each route must answer four questions in its first viewport: where am I, what is
the primary artifact, what can I do next, and what should I feel when I leave?

---

## 3. Apple principles, translated for OKISO

| principle | OKISO contract |
|---|---|
| immediate response | pointer-down changes presentation in the same frame; completion never waits for a decorative animation |
| direct manipulation | dragged content follows the pointer 1:1; React state is not written per frame |
| interruptibility | a new press stops the running spring and continues from the current presented value |
| velocity handoff | release velocity is passed into the spring; projected position selects the destination |
| spatial consistency | covers, players, and sheets enter from their source and return there on dismissal |
| edge resistance | bounded gestures use restrained rubber-banding, then settle without ornamental bounce |
| purpose | movement explains selection, playback, hierarchy, or navigation; ambient motion receives the smallest budget |
| accessibility | reduced motion is a complete static/cross-fade composition, not a broken version of the full effect |

We explicitly reject Apple-style glass, heavy translucency, rounded system cards,
and system-font mimicry. Physics are portable; brand appearance is not.

---

## 4. Motion contract

### Causal motion budget

1. **Press** — immediate 0–60 ms response, typically 0.98 scale or a hard color
   inversion. No delayed easing.
2. **Settle** — critically damped spring, normally 320–460 stiffness and 32–46
   damping. Default bounce is zero.
3. **Travel** — duration follows distance; preserve velocity when a gesture hands
   off to animation.
4. **Shared geometry** — cover and title remain visually continuous between
   archive and dossier.
5. **Ambient** — optional and tier-gated. It never competes with a causal event.

### Momentum projection

For a release velocity `v` in pixels per second and deceleration `d = 0.998`:

```ts
project(v, d = 0.998) = (v / 1000) * d / (1 - d)
```

Choose the nearest snap point from the projected destination, not the release
position. Cap pathological velocity before passing it to the spring.

### Implementation safety

- Gesture nodes exclusively own their animated `transform` values. Centering,
  layout, and opacity live on separate wrappers when necessary.
- Animate transforms and opacity only. Never write width, height, top, margin,
  `html`, `body`, inherited custom properties, or React state on every frame.
- Stop an active animation on pointer-down and continue from the current
  `MotionValue`.
- Use `touch-action: none` only on the actual drag handle/surface.
- `will-change` exists only while grabbed or settling.
- Replace `transition-all` with explicit properties; never CSS-transition a
  gesture-owned transform.

---

## 5. Shared interaction primitives

These are behavior contracts, not fixed visual components.

| primitive | responsibility |
|---|---|
| `Pressable` | same-frame press, visible focus, disabled/busy state |
| `MomentumRail` | 1:1 dragging, projected snap, velocity handoff, keyboard paging |
| `DossierTransition` | source-anchored cover/title geometry, focus restoration, reversible exit |
| `FluidSheet` | captured handle drag, resistance, velocity dismissal, escape/backdrop close |
| `NowPlayingRail` | persistent playback truth and entry into expanded player state |
| `MediaArtifact` | cover/video/audio identity with real metadata and action state |
| `SignalRail` | shared route location plus current playback, theme, and portal state |

The first lab intentionally proves `Pressable`, `MomentumRail`,
`DossierTransition`, and `FluidSheet` together. Components move into the shared
kit only after the prototype passes review.

---

## 6. Prototype gate

Route: `/lab/releases` (unlinked and non-indexed).

The lab is a real release chronology, not a visual mock. It uses live repository
release data and tests the signature journey:

1. press a cover and receive immediate feedback;
2. drag the chronology 1:1;
3. release with velocity and settle to the projected release;
4. open the active cover into a spatially continuous listening dossier;
5. play immediately or enter the full release route;
6. drag down, press escape, or use the close control to return to the source;
7. operate the complete flow with arrow, Home, End, Enter, and Escape keys.

### Acceptance

- No new runtime dependency.
- Pointer-down response is perceptibly immediate.
- A new gesture can interrupt settling without a jump.
- Slow release snaps nearby; a flick advances according to projected velocity.
- Dossier close restores focus to its source cover.
- Controls meet a 44 px touch target and show `:focus-visible`.
- Reduced motion disables inertial drag and uses short opacity changes/static
  composition.
- Forced colors, increased contrast, and reduced transparency retain boundaries
  and hierarchy.
- Mobile at 375 px and desktop at 1440 px expose a clear current artifact and
  next action without horizontal page overflow.

---

## 7. Site-wide rollout, only after approval

1. Remove the remaining pink, rounded, and blur-based legacy surfaces.
2. Establish `SignalRail` wayfinding and integrate now-playing state.
3. Replace the release grid/modal with chronology → listening dossier.
4. Make individual tracks playable and the global player physically expandable.
5. Recompose home below the hero around newest work, process, and channel choice.
6. Turn upcoming into a useful transmission queue and vault into a reel room.
7. Preserve `/rouge-noir` as a separate world connected by portal behavior.
8. Audit all reduced-motion, reduced-transparency, contrast, touch, keyboard, and
   static-export paths before deployment.

This is deliberately not a big-bang redesign. The prototype must prove that the
new system feels authored, musical, and interruptible before it becomes shared
infrastructure.
