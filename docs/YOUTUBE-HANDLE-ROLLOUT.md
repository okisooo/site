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

GitHub's public YouTube social account already points to `@okiso` on October 13.
Other profile fields are being inspected live; do not treat inaccessible/private
fields or historical posts as verified. The earlier domain-bio edit queue remains
separate; do not replace `oxo@okiso.net` or unrelated service usernames.

Evidence: `S:/Codex/outputs/2026-10-13/youtube-handle-audit/`.
Publication and live social-field verification are pending.
