# okiso: design and search workplan

## current seo pass — 2026-09-15

the user authorized independent SEO work. Chrome already has access to the
verified `sc-domain:okiso.net` Search Console property; no new account or access
grant is needed. the older Okara access limitations below are historical.

- live baseline: all 39 sitemap pages and 81 linked pages/assets pass the public
  crawl. Google read the sitemap successfully on September 15 and discovered 39 URLs.
- Search Console Web, June 13–September 12: 64 clicks, 1,763 impressions, 3.6% CTR,
  average position 6.6. the first ten query rows were saved, not a complete export.
  `okiso`: 33 clicks / 575 impressions / 5.7% CTR / position 1.8. do not interpret
  the aggregate position as a non-brand ranking or keyword-volume estimate.
- indexing report last updated September 4: 10 indexed, 56 excluded (22 not found,
  3 redirect, 27 discovered-not-indexed, 3 crawled-not-indexed, 1 duplicate).
  this predates the editorial launch; these are not current post-launch totals.
- latest release URL Inspection: discovered-not-indexed, no recorded crawl.
  September 15 live test: available to Google, indexing allowed, one valid breadcrumb.
- recovered 17 release aliases from `ac59cff^:src/data/releases.ts`. every pair
  has the same title, date and full track list. all 17 old paths still returned
  404 before this change. GitHub Pages gets immediate HTML redirects and canonical
  targets, including trailing-slash aliases; no JavaScript redirect dependency.
  unrelated deleted music remains 404 rather than pointing to a different work.
- `/about` adds a factual artist profile, official channels, business contact,
  shared artist identity markup and sitewide navigation. the sitemap now has 40 URLs.
- related releases now prioritize shared songs (single/album), then nearby dates.
  FEAR now links first to ETUDE. existing canonical addresses remain unchanged.
- reusable public crawl: `node scripts/audit-live-seo.mjs --output <absolute-path>`.
  `npm run build` now exports aliases; `npm run audit:seo` checks them. all 36
  regression tests, production build/types and local 40-page/83-resource crawl pass.
  phone 390px and tablet 768px have no horizontal overflow; mobile navigation works.
- public PageSpeed API returned quota exceeded (429); its web report remained
  pending. no new Lighthouse score or field Core Web Vitals measurement is claimed.

evidence: `S:\Codex\outputs\2026-09-15\site-seo`. build logs and disposable
helpers: `S:\tmp\codex\site-seo-20260915`. no tracking installed or private
search data sent to Okara. see the dated report in that output folder for final
deployment and Search Console submission results.

next priorities: verify indexing after recrawl; capture full query/page/country
exports and comparable 28-day windows; reproduce mobile loading in a completed
performance test before changing the commissioned art or automatic 3d hero.
expand release copy only with verified credits or artist-provided context.

---

Updated 2026-09-06. Local candidate work, **not deployed**. The user requested
the shared editorial redesign across the entire core site, including vault.
Local route migration is authorized; deployment and visual acceptance are not
implied. See [EDITORIAL-DIRECTION.md](./EDITORIAL-DIRECTION.md).

## evidence and collaboration

The [Okara CMO workspace](https://okara.ai/agent/cmo/c37930b3-12a4-4088-bfc1-95ea44131cff)
was reviewed and asked for a source-backed intent map, five implementation
priorities, and a 30-day measurement plan in the **Okiso SEO design** conversation.
Its priorities were crawlable release links, release-specific metadata, accurate
music structured data, mobile performance, and artist-led design. These were
checked against current source rather than implemented as unquestioned audit advice.

Okara explicitly could not provide measured keyword volumes or query performance:
Search Console and Analytics were not connected, and the SEO-report/recommendation
tools were subscription-locked. The competitor analysis, design guide, and content
strategy remain unreviewed behind that lock. No plan upgrade, campaign, or content
publication was performed. Its query suggestions below are hypotheses, not proven demand.

The visible technical audit is dated **2026-09-02**, for the live site, not this
candidate build. It reports mobile performance 37, desktop 51, accessibility 84,
best practices 77, and SEO 100. Reported mobile LCP is 7.1 seconds. Its extraordinarily
large blocking-time values need reproduction before prioritization. None of these
numbers is a current post-change measurement or evidence of a ranking improvement.

The public catalog had advanced to 34 releases while this local branch had 32.
The two newer records, VESSEL FOR OBSESSION and DEADEND, were reconciled against
`origin/main` at `9dd2b0d`. Their Spotify metadata is preserved; unverified Too Lost
links, lyrics, and local playback are not fabricated.

## implemented in the local candidate

- Real release-page links from the homepage cards and all archive cards. Quick
  listening remains a separate action, not the only way to reach release content.
- Unique factual release titles/descriptions, self-canonicals, and social cards
  using each release's actual cover. Removed the title animation that overwrote
  release titles with the homepage title after hydration/focus.
- Native expandable lyrics in initial HTML when lyrics actually exist. Release
  dates, tracks, available label information, and related-release links are visible.
- MusicAlbum/MusicRecording data with a consistent artist identifier and a valid
  graph context. This describes the music; it does not promise a Google rich result.
- A sitemap for the four indexable core pages and all 34 release pages. No synthetic
  page-modification dates. Vault, labs, and OAuth callback remain noindex. Vault's
  robots.txt block is removed so a crawler can read its noindex directive.
- Initial homepage model loading is opt-in. The archive's 3D scene is split out
  until selected. Local audio is verified at build time; the global player receives
  a compact available-track list without lyrics and excludes missing audio files.
- A character-led prototype using only existing original artwork, original release
  covers, typography, CSS color fields, and interaction. No AI-generated art.
- The four requested design feeds are in [FRAMEWORK.md](./FRAMEWORK.md). The saved
  art direction and its approval status are in [SOFT-ORBIT-DIRECTION.md](./SOFT-ORBIT-DIRECTION.md).

## search intent and page ownership

| Listener need | Candidate queries (unmeasured) | Owner and useful content |
|---|---|---|
| Identify the artist | okiso vocaloid; who is okiso vtuber | `/`: clear identity, actual music, official channels |
| Find a named release | okiso vessel for obsession; okiso deadend | Canonical `/releases/[slug]`: artwork, date, track list, listening options |
| Read existing lyrics | okiso [song title] lyrics | The same release page and its lyrics section; no thin duplicate lyrics pages |
| Start listening | okiso music; okiso spotify | `/` latest release and `/releases` complete catalog |
| Check future work | okiso upcoming | `/upcoming`: confirmed announcements only |
| Explore archive resources | okiso vault | `/vault` is deliberately noindex today; decide whether it should be public-search content before changing that |

Do not manufacture biography, release stories, streaming counts, or generic
Vocaloid articles. Add artist commentary, credits, and production context when
OKISO provides them. Do not pad pages to an arbitrary word count.

## 30-day workflow with okara

1. **Baseline / week 1 — owner access required.** Connect the verified okiso.net
   Search Console property in Okara if desired. Any access grant is a user step.
   Export date range, query, page, clicks, impressions, CTR, and average position;
   separate artist/brand queries from song-title and non-brand queries. Record
   indexed canonical pages and exclusions. Save the report date and filters.
2. **Candidate review / deployment — user decision.** Review the prototype on
   desktop and phone. Run the gates below. Approve a design migration and deployment
   separately; this local pass does not publish either. Record deployed commit/date.
3. **Week 2.** Inspect homepage, archive, the two newest releases, and a lyrics page
   with Search Console URL Inspection. Submit the corrected sitemap after deployment.
   Remeasure mobile/desktop performance using the same URL and test settings.
4. **Week 3.** Ask Okara to compare actual query/page exports. Identify discovered
   song-title/lyrics queries, indexing gaps, and pages earning impressions with weak
   snippets. Improve those specific pages with verified information.
5. **Week 4.** Compare equivalent date windows, showing absolute counts alongside
   percentages. Annotate release dates, campaigns, and deployment changes. Treat
   small samples and average-position movements cautiously; do not infer causation.

Search Console measures search visibility, not streams or fan conversion. A separate
privacy-reviewed analytics decision is needed for events such as `release_open`,
successful `audio_play`, `listen_outbound`, `video_play`, and `contact_open`.
Do not add analytics credentials or silently install tracking. An outbound click is
not a confirmed stream; an audio-button click is not a successful playback event.

## verification gates

- `npm run test:releases`: catalog matching, Too Lost response variants, smart-link
  safety, and OAuth behavior. Uses fixtures, not a production account mutation.
- `npm run test:design`: shared route scope, standalone exclusions, compact card
  data, accurate track counts and preserved listening destinations.
- `npx tsc --noEmit`: explicit type check; the existing Next build skips this gate.
- `npm run build`, followed by `npm run audit:seo`: exported-page regression checks
  for metadata, canonical links, headings, structured-data syntax, lyrics HTML,
  crawlable catalog links, sitemap scope, and noindex routes.
- Browser: inspect desktop, tablet, and phone layouts; latest-release navigation;
  rail paging; release sheets; Tab/Shift-Tab and Escape; actual audio play/pause;
  lyrics disclosure. Respect reduced-motion CSS and preserve visible static content.
- Test live performance only after a production build/deployment, not a development
  server. The export preview script supports local-only serving and audio ranges.

## policy decisions and primary guidance

- Useful, original, people-first information outranks word-count or content-ratio
  padding. [Google's helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- Real `<a href>` links are crawlable. [Google's link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
- `/llms.txt` is an optional factual directory, not a ranking lever or a requirement
  for Google AI features. [Google's AI-feature guidance](https://developers.google.com/search/docs/appearance/ai-features).
- The supplied Too Lost approval screenshot confirms **sandbox approval only**.
  Keep sandbox credentials/endpoints separate; it does not establish production
  API authorization or a successful live sync. See the release-sync documentation.

Next research handoff to Okara should include only public-page changes and the
user-authorized search exports, never repository secrets or OAuth credentials.

## local verification record — 2026-09-05

- Release/OAuth fixture suite: 14 passed. Explicit TypeScript check passed.
- Production export: 50 generated routes/resources. SEO regression checks: 38
  indexable pages, 34 release links, 4 deliberately noindex routes. Playlist:
  105 distinct playable songs (112 catalog occurrences before deduplication).
- Browser checks: 320px, 390px, 768px, and 1440px layouts; release-sheet focus loop,
  Escape and restored focus; rail next/previous; streaming-only latest release;
  archive quick-listen dismissal; actual PRODIGY playback and pause; native lyrics
  expansion with a release-specific title remaining intact. No live speed score claimed.
- Local preview: `http://127.0.0.1:30116/lab/soft-orbit`. Current preview uses the
  production export, not the development server. Audio range requests return 206.

## shared editorial verification — 2026-09-06

- One shared shell, navigation, footer, typography, palette, panels and controls
  now cover the core homepage, archive, all release details, upcoming and vault.
  Review aliases, callback and not-found page use the same system. Rouge Noir is
  explicitly excluded; no standalone artwork or styling was migrated.
- Final production export: 50 routes/resources. Explicit type check passed.
  Release/OAuth fixtures: 14 passed. New design-contract tests: 4 passed.
  Final SEO and shell audit: 38 indexable pages, 34 linked releases, 4 noindex
  routes, 105 available local tracks. No ranking or Lighthouse improvement claimed.
- Browser review covered desktop 1440px, tablet 768px and phones at 390px/320px.
  Verified release search, quick-listen dialog, native lyrics, contact/vault dialog
  focus loops and Escape restoration, actual PRODIGY play/pause, and the narrow
  global player. Long-title deck-to-vault spacing verified at 768px and 320px.
- On the supported localhost origin the public vault returned 3 projects, 9 tracks,
  3 open tracks. Verified expansion, locked rows, actual public playback, and the
  enabled seek control. No private login, uploads, edits, deletes or teaser changes.
- Existing 3D character loaded on request and the dialog closed normally. The
  video feed returned GODISH, LOVE ATTRIBUTE and TENSEI RINGO. Cinema controls
  remain visible at 320px and Escape restores the page. These are functional
  checks, not approval of the existing model's pose or a full 3D quality audit.
- Current review: `http://localhost:3000/` and `/vault`. Served from the production
  export with `HOST=localhost`, `PORT=3000`. Unlike the temporary numeric-host
  preview ports, this origin is already allowed by the live API. No live API
  permissions or origin settings were changed.
- No generated artwork, analytics installation, deployment, commit or push.
  The old experimental source files remain historical; active review routes share
  the core components. The design still needs the user's visual judgment.

### storage on this machine

`.next`, `build`, and `out` are local junctions into
`S:\tmp\codex\site-seo-design-20260905`. Next's exporter deletes the destination
directory, so pointing only `out` at S is insufficient: the exporter replaces
that junction. Set process-local `OKISO_EXPORT_DIR=build/site` for subsequent
local builds; the **parent** `build` junction keeps the new export on S. The
default remains unchanged for CI. Set TEMP and TMP to the task folder on S as well.
The final export and compilation cache are retained for preview and reuse.

Cleanup of two obsolete, reproducible build copies was blocked by the command
policy. They were not deleted and are not used by the preview:

- `S:\tmp\codex\site-seo-design-20260905\out`: 331,291,733 bytes.
- `S:\tmp\codex\site-seo-design-20260905\verified-out`: 334,012,281 bytes.

The active export is `S:\tmp\codex\site-seo-design-20260905\export-root\site`.
