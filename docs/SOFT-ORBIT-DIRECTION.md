# soft orbit — saved candidate direction

status: **saved for iteration, not approved for rollout**

prototype: `/lab/soft-orbit`

decision date: 2026-08-07

## verdict

the user does not reject this direction, but it still needs substantial work.
that is enough to preserve the visual thesis and prototype mechanics. it is not
approval to replace a live route, push the branch, or deploy the site.

## problem this direction addresses

the tactical branch translated the desired arknights endfield influence too
literally as hard fui: stacked rectangles, scan lines, target brackets, heavy
uppercase type, and equal visual frequency everywhere. that precision made the
site feel blocky and rough, while okiso still needs to read immediately as a
vtuber and music artist.

soft orbit changes the hierarchy instead of merely rounding the tactical cards:

> precise at the edges; luminous, character-led, and human at the center.

## visual thesis

- working name: **soft orbit**; broader motif: **signal bloom**
- emotional target: futuristic, elegant, intimate, alive; never militaristic
- visual budget: roughly 70% character/art/negative space, 20% atmosphere and
  material, 10% technical annotation
- shape budget: roughly 80% arcs, superellipses, soft asymmetric crops, and
  flowing paths; 20% sharp notches or disciplined cuts
- palette: void plum `#0f0d17`, pearl `#f6f4f8`, ice `#dcecf5`, haze violet
  `#aaa5c8`, graphite `#34313e`, and coral signal `#f2677a`
- typography: mixed case, moderate weights, tight optical display tracking;
  mono only for real dates, counts, playback, or status
- signature device: one coral-to-ice ribbon orbit that can connect character,
  navigation, release art, player state, and route transitions
- materials: selective smoked pearl glass for floating chrome and sheets;
  opaque cinematic scenes remain the dominant surfaces

## interaction contract retained

the behavior contract in [`INTERACTION-FRAMEWORK.md`](./INTERACTION-FRAMEWORK.md)
still governs this candidate:

- feedback begins on pointer-down
- drags track 1:1 and settle with projected velocity
- springs remain interruptible and inherit current presentation state
- sheets originate from their artwork and return focus on close
- lenis remains the sole scroll owner
- transform and opacity are the only per-frame animated properties
- reduced motion uses short cross-fades; reduced transparency uses solid surfaces

## what the prototype preserves

`src/app/lab/soft-orbit/` is intentionally unlinked and `noindex`. it contains:

- a full-height character-led hero with no targeting frame
- a scroll-aware floating navigation capsule
- one ribbon-orbit motif instead of a field of hud decoration
- three real, locally playable releases in a direct-manipulation rail
- a source-anchored release sheet with keyboard and drag dismissal
- a route-local soft player using the existing global audio provider
- desktop, phone, reduced-motion, reduced-transparency, high-contrast, and
  forced-colors paths

the route suppresses the tactical grid, theme control, and tactical player only
while the lab is mounted. live routes are unchanged.

## known weaknesses — do not paper over these

1. the current static character source is neutral and limits expression; the
   hero needs stronger pose, crop, gaze, and art direction before it can carry a
   production homepage.
2. the hero is a promising composition, not a complete identity system. copy,
   lighting, ribbon behavior, navigation, and breakpoint art direction need
   more iteration.
3. the release scene proves softness and spatial continuity, but cover curation,
   ambient color extraction, typography, and the transition into deeper content
   are still early.
4. the prototype has only two meaningful scenes. video, social presence,
   upcoming releases, live state, vault, and footer behavior have not been
   reconciled with the direction.
5. the shared soft player is a prototype skin, not a finished replacement for
   the production player.
6. browser checks passed, but real-device touch feel, image quality, network
   failure states, and performance budgets still need testing.
7. no user score or rollout approval has been given.

## avoid

- rounding every tactical rectangle
- glassmorphism on every surface
- pastel stickers, sparkles, or generic cute decoration
- fake coordinates, radar, terminal labels, or arbitrary system numbers
- yellow endfield imitation
- custom cursor or magnetic motion on every control
- decorative infinite animation
- adding another layer of shards, grids, borders, or scanning effects

## next step

iterate only the hero, shared chrome, and three-release scene until the still
composition and touch behavior feel production-worthy. request a new user score.
an 8/10 or better approval is the gate for any rollout plan. if approved, convert
in this order: shared chrome → home → releases → upcoming → public vault →
authenticated vault.

until then: do not deploy, do not convert live routes, and do not delete the
tactical branch.
