# one website, one editorial language

updated 2026-09-11. local implementation; not deployed. the user liked the preview
and authorized further commissioned-art, animation, and vrm work; final deployment
approval is still separate.

## authority and reference

the user rejected soft orbit as too simple and supplied the dense yellow/graphite,
character-led editorial collage reference. the next instruction explicitly made
this the shared language for the **whole core website, including the vault**.
the reference guides composition and component detail, not palette, copied
characters, branding, foreign-language labels, fake comments, or invented data.
the user explicitly reaffirmed **white and red** as the brand palette after
rejecting the yellow interpretation. no ai-generated art is permitted.

this supersedes the old tactical and soft-orbit visual proposals. rouge noir and
future standalone okiso grain pages remain outside the core system.

## visual contract

- white `#ffffff` and near-white `#fafafa` lead the core site. reuse the existing
  brand red primitives: `--c-red` (`#ff4d4d`) for large display accents and
  `--c-red-deep` (`#cc0000`) for actions and readable red text on white. buttons
  on deep red use white text. neutral graphite `#28282c`, grey, and silver provide
  depth; a near-white red tint identifies selected/hover states. yellow, lavender,
  and pink are not alternative core brand accents.
- archivo for display and body; geist mono for short dates, counts, and labels.
  large tight-set mastheads, compact metadata, and readable body copy.
- white global navigation with red identity and active states; white page body;
  translucent sleeve-style artwork
  mounts; fine dividers; inset graphite listening controls. the vault is not a
  separate dark/serif theme.
- the homepage is a layered cover: original character crossing the masthead and
  release-art montage, a framed latest release, listening deck, and vault feature.
- archive, release detail, upcoming, vault, dialogs, and the player share these
  surfaces and controls. layouts adapt to the content without changing identity.
- counts, dates, track information, listening destinations, and public presence
  must be real. no decorative system statuses or invented waveforms.

## component refinement / 2026-09-06

the user found the first editorial implementation tacky, raw, and too simple.
the requested `design` skill routed this refinement through design-system and
ui-styling guidance. the composition reference remains authoritative; this is
not a new theme or a declaration of visual approval.

- music packaging is the material reference: narrow case spines, translucent
  artwork mounts, inset displays, and lightly raised transport keys. finishes
  are CSS around existing artwork, never generated or replacement art.
- keep borders subordinate to content. restrained edge highlights and soft
  contact shadows replace the previous hard offset shadows and black boxes.
- display weights are lighter; title spacing allows words to breathe. mono is
  reserved for actual dates, types, counts, and brief navigation labels.
- the red vault folder tab repeats on its white homepage entry and page heading.
  archive cards, media controls, search, dialogs, and vault rows share the same
  material and control tokens in `editorial.css`.
- the homepage listening deck and vault entry share a normal-flow grid rail.
  the cover grows with that rail; longer track titles cannot collide with the
  folder. mobile uses the same components, with artwork layered above the rail.
- slider styling preserves native inputs and keyboard operation; hover/press
  changes never hide content and respect reduced motion.

## implementation ownership

### gallery and idle motion / 2026-09-12

the user praised the current website and asked for a growing commission gallery
and more idle motion using saved elements. `/gallery` now shares the editorial
system, grouping alternate versions under each credited work. selection is based
on the signed-in skeb completed-request list. see `GALLERY-AND-AMBIENT-MOTION.md`
for the one outstanding delivery; do not substitute folder discovery for skeb.

the homepage stays curated. restrained character/sticker movement and sleeve
reflections provide idle motion, with an artist-credit strip on the gallery and
the existing react bits waves contained in the footer. the footer pause control,
reduced-motion preference and visibility checks govern ambient work. original
animated commissions have their own explicit play/pause controls. keep artwork,
text readability, immediate input and the established composition intact.

### motion refinement / 2026-09-12

the user rejected the fade/rise opening and asked for a distinctive opening of
two seconds maximum, with professional motion throughout the existing design.
the current local candidate uses a 1.9-second split sleeve: original suyosuyo and
sobu art, okiso lettering, a red seam, then the existing homepage. real art and
the white/red identity remain intact. no generated assets or loading percentage.

`EditorialOpening.tsx` and `editorial-motion.css` own the first-paint opening and
shared movement. `useEditorialMotion.ts` adds one-time scroll entrances without
making document content depend on javascript for visibility. interaction is
immediate, returning home does not replay, and the footer offers explicit replay.
reduced motion bypasses the opening and movement. this is a new visual candidate,
not user approval or permission to deploy.

`src/Components/Editorial/SiteFrame.tsx` owns shared navigation/footer/dialog access.
`src/styles/editorial.css` owns the scoped core tokens and component treatments.
`src/lib/siteDesign.ts` is the single route-exclusion contract used by the shell
and theme provider. the core is consistently light/paper; standalone theme choices
remain independent. do not add another per-route palette or font stack.

`/lab/soft-orbit` is kept as a noindex review URL but now renders the exact same
homepage component. `/lab/releases` likewise uses the shared release archive.
neither is a second theme or an alternate product direction. the authorization
callback and not-found page also use the same shell and surfaces.
the retired stylesheet remains unused historical source, not an active dependency.

## behavior and search constraints

- preserve the verified release catalog, canonical URLs, one main/h1, structured
  music data, source-backed descriptions, and server-rendered expandable lyrics.
- keep vault noindex and backend-enforced access. upload, manager, session, teaser,
  playback, and share operations keep their existing API contracts.
- one music context, native seek/volume inputs, no autoplay or initial audio fetch.
  3d character and archive code load only after an explicit request.
- modals use the shared keyboard/focus/scroll-lock behavior. reduced motion must
  retain the complete composition; no hidden-then-reveal dependency.
- client card payloads include only the first playback title and required release
  fields. full lyrics remain on the relevant release page, not every UI control.
- the current hero uses the original standing character. the user subsequently
  supplied the existing commission collection for further artwork choices; see
  [COMMISSION-ASSETS.md](./COMMISSION-ASSETS.md) for the reviewed shortlist. do not
  generate a pose or infer a transparent cutout to imitate the reference.

## local review

the commissioned-art and character-room implementation, verification scope, and
pre-deployment dependency security gate are recorded in
[ART-AND-CHARACTER-REVIEW.md](./ART-AND-CHARACTER-REVIEW.md).

the API allows `http://localhost:3000`, but not `http://127.0.0.1:30116` or `:30117`.
those other ports reproduce the network-error UI and cannot demonstrate the public
vault/video feed. use the supported origin for functional review; do not widen the
live API's origin allowlist for a temporary preview.

type, release, design-contract, export, SEO, and visual checks are recorded in
[SEO-WORKPLAN.md](./SEO-WORKPLAN.md). locked vault management is not exercised
without an authorized session; no uploads, edits, or deletes are test actions.

the white/red component refinement passed `tsc --noEmit`, all 5 design-contract
tests, all 14 release tests, production export (50 generated pages/resources),
and the SEO audit (38 indexable pages, 34 release links, 4 noindex routes,
105 available local tracks). browser checks covered desktop/tablet/phone layouts,
long listening titles, archive search and quick-listen, public vault loading,
unlock-dialog keyboard focus and escape, native music seeking, and expanded
lyrics. no private vault operations were exercised; visual approval is pending.
