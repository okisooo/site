# soft orbit — saved candidate direction

status: **rejected and superseded by the shared editorial direction, 2026-09-06**

the user explicitly rejected the simple coral/black direction and supplied a dense
character-led collage reference. they then requested one language across the whole
core website, including vault. see [EDITORIAL-DIRECTION.md](./EDITORIAL-DIRECTION.md).
`/lab/soft-orbit` now uses the same homepage component as `/`. all notes below are
historical, not current instructions or a claim of visual acceptance.

## current constraint — 2026-09-05

The user explicitly requires no AI-generated art assets. Use existing original
character art, the original model, release covers, and authored media. All visual
improvement must come from composition, typography, crop, color, and interaction.
Do not generate substitute character artwork or use it in previews.

The current pass removes the masked third-party flame and its foreign mark. It
uses the existing character WebP, an editorial portrait crop, a coral color field,
and the latest verified release. Earlier flame/orbit notes below are historical.

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

## phoenix ignition pass — 2026-08-23

reference saved for this and future sites:
[`threeui / elemental flame`](https://threeui.com/backgrounds/elements/elemental-flame).
the user connected the flame directly to okiso's phoenix identity and asked for
a more spectacular entrance.

the stock effect is not safe to present unchanged as okiso branding: its authored
center is a fixed claude mark. the lab therefore uses the official MIT Community
renderer only as a masked character aura. the character covers the foreign mark;
the visible material is limited to escaping flame tongues and an ember field.
this is an experiment, not the final phoenix symbol. production art should use a
real okiso/phoenix silhouette or an authored signed-distance field.

implementation boundary:

- exact subpath import from `@designcodeio/threeui` 0.3.0; no package-wide CSS
- dynamic client-only renderer mounted after the main hero can paint
- one WebGL2 iframe, paused when offscreen by the renderer
- the flame is visual-only and never intercepts input on any viewport
- reduced motion keeps a static low-particle flame and cross-fade entrance
- forced-colors mode removes the flame entirely

the hero entrance is now one non-blocking sequence: immediate wayfinding,
character, identity and action, then phoenix ignition. it never uses a modal
loader or disables navigation. the current timing settles in roughly 1.5 seconds
on the tested desktop.

verified at 1440×900, 390×844, and 1440×900 reduced motion: one renderer, no
horizontal overflow, no feature console/page errors, and no hydration mismatch.
typecheck, all 12 release tests, and `git diff --check` pass. screenshots live in
`C:/Users/samue/.codex/visualizations/2026/08/22/01a02b7a-b7a9-7ee1-a4b6-58775120b339/phoenix-entrance/`.

status remains review-only. ask for a user score before refining shared chrome or
the release scene, and do not push, deploy, or migrate live routes without approval.

## human rejection and polish reset - 2026-08-23

the first phoenix screenshot failed review. the user described it as janky,
obviously ai-generated, and clear slop. that verdict supersedes the earlier
self-review: passing layout and runtime checks did not make the composition good.

the rejected tells were the oversized background wordmark, crossing orbit ribbon,
glass capsule navigation, decorative online and featured-signal labels, mixed
corner geometry, competing glows, two hero actions, and generic poetic copy. all
were removed from the hero rather than restyled.

current design read: redesign-overhaul of a virtual artist landing page for
first-time listeners, using a cinematic character-first language, native css,
one controlled webgl flame, and restrained motion. working dials are design
variance 7, motion intensity 5, and visual density 2.

the clean foundation now has one aligned navigation line, the real character art,
factual identity copy reused from the approved tactical direction, one play action,
and a tightly masked noninteractive ignition. the stock claude center remains
covered and must still be replaced by an authored okiso/phoenix field before any
production proposal.

verified at 1440x900, 768x1024, 390x844, 1920x1080, and reduced motion: exact
document width, one renderer, visible title and action, bounded navigation, no
feature runtime errors, and non-blocking flame input. current screenshots and
entrance frames live in
`C:/Users/samue/.codex/visualizations/2026/08/22/01a02b7a-b7a9-7ee1-a4b6-58775120b339/phoenix-polish-v3/`.

this is a cleaner foundation, not a ship candidate. keep the next iteration
hero-only until the user confirms the visual language feels authored rather than
generated.

## motion-first correction - 2026-08-23

the stripped still was also rejected: the user called it roughly ten times
blander than the current site and explicitly asked to see animation instead of
another frozen composition. cleanliness alone is not the goal. the hero still
needs a memorable authored event.

the lab now treats the entrance as one controlled phoenix ignition: navigation is
available immediately, the character rises from the lower frame, a single
vertical ignition flashes through the character axis, the masked flame blooms and
settles behind her, and the identity copy plus play action resolve in sequence.
there is still no modal loader, particle field, orbit choreography, or input lock.

the actual browser entrance was recorded at 1440x900 as a 3.4 second h.264 clip:
`C:/Users/samue/.codex/visualizations/2026/08/22/01a02b7a-b7a9-7ee1-a4b6-58775120b339/phoenix-motion-v1/phoenix-entrance.mp4`.
desktop, tablet, phone, wide, and reduced-motion checks still pass with one
noninteractive flame renderer, exact document width, visible title and action,
and no feature runtime errors. typecheck, all 12 release tests, and diff check
pass.

status remains review-only. the next decision must be based on the moving clip:
does the ignition carry enough energy to justify this direction? do not infer
approval from automated checks or continue into lower scenes before that verdict.
