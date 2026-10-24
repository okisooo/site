# OKISO

the source for [OKISO's official website](https://okiso.net/) — original hyperpop and electronic music, commissioned art, and the world of a virtual artist and VTuber.

[visit the site](https://okiso.net/) · [music](https://okiso.net/releases) · [art gallery](https://okiso.net/gallery) · [links & contact](https://okiso.net/links)

## explore

- browse releases, play music, and follow official listening links.
- explore credited illustrations, animations, and alternate artwork versions in the gallery.
- meet the character in the homepage's interactive 3D studio, with pose, expression, and camera controls.
- hear demos, alternate versions, and unfinished tracks in [the vault](https://okiso.net/vault). public tracks need no login; restricted access depends on the separate backend.
- download the [free animated Windows cursor set](https://okiso.net/cursor), with art and animation by [kateko](https://vgen.co/katekoteko). its page explains the personal-use and own-content permissions.

[oki.so](https://oki.so/) is the short entry link; [okiso.net](https://okiso.net/) is the canonical website.

## source & development

Next.js 15, React 19, TypeScript, Tailwind CSS, and Three.js/VRM. use Node.js 22, matching the deployment workflow, and the committed npm lockfile:

```sh
npm ci
npm run dev:webpack
```

`npm run build` creates the static export published through GitHub Pages behind Cloudflare. regular builds use the committed release catalog; credentials are for optional catalog refresh scripts. see [release sync](docs/release-sync.md) and [URL routing](docs/CANONICAL-URL-ROUTING.md).

routes live in [src/app](src/app), shared UI in [src/Components](src/Components), and catalog/credit data in [src/data](src/data). live media and vault features use services outside this frontend.

## credits, permissions & data

art stays credited to its artists in the [gallery](https://okiso.net/gallery), [gallery data](src/data/gallery.ts), and [homepage commission data](src/data/commissionArt.ts). featured homepage illustrations include suyosuyo, sobu (@sobsocks), and 7mmchan; cursor art and animation are by kateko.

no project-wide source-code license is declared. commissioned artwork retains its artists' rights; public source and display previews do not grant permission to reuse it. the site's footer explains the separate creator reuse rules for streams and releases, and the cursor page has its own usage terms.

theme preferences and vault sessions use browser storage. vault sign-in contacts the separate API, and media/status features contact external services.

## related

[Japanese practice app](https://nihongo.okiso.net/) · [practice source](https://github.com/okisooo/NihongoRevisionSuite) · [more projects by okisooo](https://github.com/okisooo)

