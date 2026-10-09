# canonical url routing

## production contract — 2026-10-09

`https://okiso.net` is the canonical public website. `oki.so` is the short branded
entry point, not a second copy of the site. Both apex and `www` links permanently
redirect to the same canonical page. Query strings are preserved, including
encoded values. No change of address is appropriate: the canonical site has not moved.

Hosting remains GitHub Pages behind Cloudflare. GitHub Pages does not execute
Cloudflare Pages `_redirects` files. The URL normalization is therefore deployed
as Cloudflare Single Redirects, independently of website rebuilds.

The normalization rules only match apex/`www` requests using GET or HEAD.
They do not change service subdomain routing, OAuth methods, cookies or DNS/email
records. Unknown pages still end at a real 404; never redirect unrelated missing
content to the homepage.

## normalization rules

Every rule uses 301 and enables Preserve query string. Apply this common scope,
substituting the zone's apex and `www` hostnames:

```text
(http.host in {"okiso.net" "www.okiso.net"}
 and http.request.method in {"GET" "HEAD"}
 and <condition>)
```

| rule | path condition | target |
| --- | --- | --- |
| canonical home index urls | path in `/index`, `/index/`, `/index.html`, `/index.html/` | static `https://okiso.net/` |
| canonical directory index slash | ends with `/index.html/`, except root `/index.html/` | strip final 12 characters |
| canonical directory index | ends with `/index.html`, except root `/index.html` | strip final 11 characters |
| canonical html slash urls | ends with `.html/`, but not `/index.html/` | strip final 6 characters |
| canonical html urls | ends with `.html`, but not `/index.html` | strip final 5 characters |
| canonical trailing slash urls | ends with `/`, except `/`, `/index/` and `.html/` endings | strip final character |

Dynamic targets use `concat("https://okiso.net", substring(http.request.uri.path,
0, -N))`. These conditions are disjoint. Keep them ahead of general host redirects.
They apply to new page paths automatically; no list of the current pages is baked
into Cloudflare.

Main zone: these six rules are followed by `canonical www urls`, matching
`http.host eq "www.okiso.net"` and GET/HEAD, with target
`concat("https://okiso.net", http.request.uri.path)`. Existing main-domain HTTP to
HTTPS handling remains enabled. This eliminates the previous two-hop HTTP/www path.

Short zone: the six rules precede the original `oki.so to okiso.net — preserve
paths` catchall, ID `2d45496164b74c11bd73f94b9cbc0eba`. Preserve this catchall.

### deployed identifiers

| rule | okiso.net | oki.so |
| --- | --- | --- |
| home index | `39e6b560f12f4019b92fee68dca48e7f` | `6129213928ef42ae8871ecd9feb24671` |
| directory index slash | `fb44a6bf3bda45b680e49f4781446869` | `8aa40b9db77c4753b3504d3d3fbf824c` |
| directory index | `ff1169c0ae734940988f7d332662e063` | `e2ca8ce8c8d9400cae26e979b3eb13e4` |
| html slash | `6567ea6cbac746c5bb3fba332a7b28c8` | `25333351c59544c4af10e08ba3e5b682` |
| html | `ef6d2d5e922a472cbc449e3bfded3ef8` | `783186a0d5fa4feea8358cfb2d42bdea` |
| trailing slash | `13ed2dd5f7c44c4e8cc4a32058a6e107` | `322a518c42af4f6983e4c038d203cafb` |

Main www rule: `86ecdce7702b46a7aab48657a5746762`.

## crawler-only exclusions

`noindex operational urls` sets the response header `X-Robots-Tag: noindex` on
`auth.okiso.net`, `api.okiso.net`, `auth.oki.so`, `api.oki.so`, and the main
website's `/manifest.webmanifest`. These are infrastructure, not artist pages.
No authentication, content or cache behavior is changed; all five still return 200.
Do not disallow their crawling in robots.txt: crawlers need to read the noindex header.

Main header rule: `7fa6a5cf79e34f8ca89c237a47adaac0`.
Short header rule: `9f1c2c29b3f946f599a7d85542b73c20`.

## readable release addresses — 2026-10-09

All 35 release pages use readable title slugs without Spotify/provider suffixes.
`src/lib/releaseSlugs.ts` assigns them after catalog merging, preserves published
addresses on subsequent syncs, and reserves them before naming new releases.
Authored title equivalents handle non-ASCII titles; genuinely colliding future
titles use readable year/date/type labels. Indistinguishable entries or titles
without a usable equivalent fail explicitly instead of inventing random URLs.
Only URL fields changed: titles, artwork, tracks, lyrics and provider links remain intact.

`src/data/releaseRedirects.ts` retains all 35 former URLs and the 17 already
verified older catalog URLs, flattened directly to their new canonical destinations.
The exporter writes 52 release aliases with canonical/fallback links, a JavaScript
replacement preserving queries/fragments, and a zero-second meta refresh for
non-JavaScript visitors. GitHub Pages serves these as HTML redirects, not HTTP 301s.
Existing edge host/path normalization remains unchanged and applies to clean URLs.
Only clean current addresses appear in internal links, metadata, structured data
and the sitemap. Removed releases without a verified equivalent remain 404.

## regression guard

`.github/workflows/verify-live-urls.yml` runs daily and when its audit source
changes. It saves the reports as a GitHub Actions artifact and fails on a regression.
`audit-live-urls.mjs` discovers pages from the live canonical sitemap, checks every
HTTP/HTTPS/apex/www/short-domain combination and the common slash/HTML/index variants,
tests encoded query preservation, verifies all 52 release aliases plus `/cursors`,
checks crawler exclusions and requires unknown routes to remain 404.
Requests are paced with two workers and one bounded retry for transport failures;
retries remain visible in the report.

The accompanying live SEO audit checks canonicals, titles, descriptions, headings,
structured data, noindex protection and linked resources. Future pages are included
when published to the sitemap. Keep verified renamed-release mappings in
`src/data/releaseRedirects.ts`; do not guess mappings for removed releases.

```powershell
npm run audit:urls -- --output S:/Codex/outputs/<date>/<task>/urls.json
node scripts/audit-live-seo.mjs --output S:/Codex/outputs/<date>/<task>/seo.json
```

Google controls whether and when an eligible page gets indexed. A successful crawl,
sitemap submission or priority indexing request is not a guarantee of indexing or rank.
Release-page content work is deferred under the user's current instruction.
