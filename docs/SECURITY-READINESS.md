# dependency readiness / 2026-09-11

local candidate only; no commit, push or deployment. current continuation is
[resume website](RESUME-WEBSITE.md). this security pass changes no design, artwork
or component behavior deliberately, and leaves user-owned audio files untouched.

## changes

- next and eslint-config-next: 15.1.7 to 15.5.25, staying on the existing major.
- react and react-dom: 19.1.0 to 19.1.9, constrained to the 19.1 patch line.
- postcss: direct and transitive copies use 8.5.28. a global npm override uses
  `$postcss`, keeping the framework's old pinned 8.4.31 copy out of the tree.
  the scoped override was recognized but npm retained that old nested copy;
  inspecting the installed/locked tree exposed it. the global override resolved
  the duplicate; there is now only one locked postcss version.
- compatible transitive dependency updates were applied without `--force` or a
  framework major migration. the remaining brace-expansion 1.x copy was updated
  to 1.1.18. the lock retains next platform packages for windows, linux and macos.
- next builds now validate types again; the previous `ignoreBuildErrors: true`
  bypass was removed. the existing lint bypass remains and is not a lint pass.

## verified

- installed next/eslint-config-next 15.5.25, react/react-dom 19.1.9 and postcss
  8.5.28 were checked directly.
- full `npm audit` reports **0 vulnerabilities**, including dev dependencies.
  this is a point-in-time package advisory result, not a security guarantee or
  an audit of the separate api server.
- all 25 design, release, oauth, asset/model preservation and deployment tests
  pass. the deployment checks first failed against the old workflows, then
  passed after the scoped fixes.
- production build passes with types checked, generating 50 pages/resources.
- seo audit passes: 38 indexable pages, 34 linked releases, 4 noindex routes,
  105 available local tracks. this does not establish improved search rankings.
- the static preview is served at `http://localhost:3000/`, loopback only; no
  next development or production server is needed to review the exported site.
- both workflows parse as valid yaml; `npm ci --dry-run` succeeds. deployment
  and catalog refresh now select the same node 22.19.0 used in local testing.
  publishing runs four test suites and the exported seo audit. the obsolete
  public sitemap generator/removal steps are gone, and asset/script/config
  changes now trigger publishing. the remote workflow has not been executed.
- desktop 1440px and phone 390px browser checks confirmed original artwork,
  commissioned-art selection/full-art viewer, model loading/expressions/poses,
  camera framing, pause, focus restoration and canvas cleanup. the phone model
  selected battery saver and rendered at its display dimensions (311 x 403).
- mobile navigation, the 34-release archive and a search narrowing it to one
  prodigy result passed. the public vault loaded three projects / nine tracks;
  its shell has one main landmark and no horizontal overflow. no browser
  warnings/errors were captured during these checks. private collection/login
  operations were not tested. the preview was returned to the homepage and the
  temporary viewport override was reset.

## temporary storage

cleanup of the task's npm download cache was attempted and rejected by tool
safety policy (not a detected file lock). no deletion was performed. the exact
remaining target is `S:\tmp\codex\site-finish-20260911\npm-cache`: 1,106 files,
407,057,528 bytes (388.2 mib). it is disposable cache, not source or artwork.
the verified export in the older s: build directory is retained for preview.

## references

- [next maintainer advisory](https://github.com/advisories/GHSA-p293-qw3h-jr36):
  windows-server remote code execution is patched in 15.5.24 and later 15.x.
- [postcss maintainer advisory](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp):
  the source-map file disclosure issue is patched in 8.5.23 and later.

## remaining release gate

user review and explicit deployment approval are still required. review/stage
only intended website changes, inspect the existing deployment workflow, and
perform a post-deployment smoke check when publishing is authorized. credentials,
private vault operations, api-server changes, okara subscriptions and analytics
connections were not changed by this pass.
