# OKISO

[![OKISO — music, art, and more; official site preview with artwork by suyosuyo and ykhs9](https://okiso.net/social/home-v1.jpg)](https://okiso.net/)

original hyperpop and electronic music, commissioned art, and the world of a virtual artist and VTuber. [okiso.net](https://okiso.net/) brings it all together; this repository contains the website's frontend source.

[visit the site](https://okiso.net/) · [listen to releases](https://okiso.net/releases) · [explore the gallery](https://okiso.net/gallery) · [links & contact](https://okiso.net/links)

*official site preview above: artwork by suyosuyo and ykhs9. artist rights and the site's individual usage terms still apply.*

## start exploring

| looking for | start here |
| --- | --- |
| music | [releases](https://okiso.net/releases) — browse the catalog, play music, and follow official listening links. |
| illustrations & animation | [art gallery](https://okiso.net/gallery) — explore credited commissions and alternate artwork versions. |
| the character | [homepage](https://okiso.net/) — try the interactive 3D studio's pose, expression, and camera controls. |
| demos & alternate versions | [the vault](https://okiso.net/vault) — hear unfinished tracks and more. public tracks need no login; restricted access depends on the separate backend. |
| a desktop extra | [free animated Windows cursors](https://okiso.net/cursor) — art and animation by [kateko](https://vgen.co/katekoteko), with personal-use and own-content permissions explained on the page. |

[oki.so](https://oki.so/) is the short entry link; [okiso.net](https://okiso.net/) is the canonical website.

## work on the source

the public site runs in your browser. for local frontend development, use Node.js 22, matching the deployment workflow, and the committed npm lockfile. from the repository folder:

```sh
npm ci
npm run dev:webpack
```

open the local address printed by the development server. the stack is Next.js 15, React 19, TypeScript, Tailwind CSS, and Three.js/VRM.

`npm run build` creates the static export published through GitHub Pages behind Cloudflare. regular builds use the committed release catalog; credentials are for optional catalog refresh scripts. see [release sync](docs/release-sync.md) and [URL routing](docs/CANONICAL-URL-ROUTING.md).

routes live in [src/app](src/app), shared UI in [src/Components](src/Components), and catalog/credit data in [src/data](src/data). live media and vault features use services outside this frontend.

## credits, permissions & data

art stays credited to its artists in the [gallery](https://okiso.net/gallery), [gallery data](src/data/gallery.ts), and [homepage commission data](src/data/commissionArt.ts). featured homepage illustrations include suyosuyo, sobu (@sobsocks), and 7mmchan; the social preview above credits suyosuyo and ykhs9. cursor art and animation are by kateko.

no project-wide source-code license is declared. commissioned artwork retains its artists' rights; public source and display previews do not grant permission to reuse it. the site's footer explains the separate creator reuse rules for streams and releases, and the cursor page has its own usage terms.

theme preferences and vault sessions use browser storage. vault sign-in contacts the separate API, and media/status features contact external services.

## more from OKISO

- [Backdrop](https://github.com/okisooo/backdrop) — custom images and animated wallpapers for Claude Desktop, Codex Desktop and T3 Code.
- [Fleet](https://github.com/okisooo/fleet) — AI usage, quotas and reset times in the Windows tray.

- [japanese practice app](https://nihongo.okiso.net/) · [NihongoRevisionSuite source](https://github.com/okisooo/NihongoRevisionSuite) — another browser app to explore.
- [OKICRAFT](https://github.com/okisooo/OKICRAFT) — a minecraft modpack for exploration, building, and automation.
- [more projects by okisooo](https://github.com/okisooo).
