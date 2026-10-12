# youtube handle update — 2026-10-13

The current official artist handle is `@okiso`, not `@okiso7`; the channel ID
remains `UCNO2N-pl14P4MdrRZp2UCuA`. The retired handle returned 404 in the
October 12 audit, while the channel ID and current handle loaded the same artist.

The website now uses `https://www.youtube.com/@okiso` across homepage social
links, the video-section link and empty-feed fallback, artist/about directory,
links-page URL/display label, legacy social grid and artist JSON-LD `sameAs`.
Twitch remains `https://www.twitch.tv/okiso7/`; its username was not renamed.

The focused design regression prevents old YouTube handles from returning and
asserts the Twitch directory link stays unchanged. The export audit rejects
the retired YouTube handle in every indexable page's links or metadata.
Local checks: all 51 website regressions, production build/typecheck and exported
SEO audit pass. The build includes existing unpublished private-page work locally;
that work is not staged or included in the scoped rollout.

Publication is verified: source commit `6bf314dbb148ca8ad401ac67cc4f5a0b0bfacc7b`,
successful deployment run `38274957599`, and successful Pages run `38275225334`
for assets commit `bfa4af457c1debeb03a131300bec8e9e6dfaea99`.
Fresh live home, about and links pages return 200, contain the exact new channel
URL and contain no retired YouTube handle. The full live SEO audit checked 43
pages and 164 resources with zero issues. Unpublished private gallery and
commission-download routes still return 404 publicly.

The official channel was re-opened at `@okiso` and exposes the unchanged channel
ID. GitHub's public YouTube social account already points to `@okiso`; its public
profile README has no YouTube or `okiso7` references. Twitch's YouTube panel uses
the correct stable channel-ID URL, so it needs no handle replacement.
No retired YouTube URL was found in the inspected profile fields on Instagram
(all four links expanded), Facebook's artist-page Links section, X, Threads,
TikTok, Spotify (About expanded), Bandcamp, VGen, Pinterest, Last.fm or Genius
(Social menu expanded). Pinterest's check was limited to the rendered owner
profile; hidden edit fields were not verified. Archived posts, video descriptions,
Discord personal connections and undisclosed accounts were not exhaustively
audited. No external profile edits were needed or made for this handle fix.

The earlier domain-bio edit queue remains separate, including Instagram's
additional old-domain website link. Do not replace `oxo@okiso.net` or unrelated
service usernames. The clean-code guidance kept this rollout limited to the
YouTube destination, its visible label and regression protection.

Evidence: `S:/Codex/outputs/2026-10-13/youtube-handle-audit/`.
Detailed profile evidence and remaining limits are recorded in `AUDIT.md` there.
