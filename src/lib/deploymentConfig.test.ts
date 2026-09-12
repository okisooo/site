import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const deploy = readFileSync(new URL("../../.github/workflows/deploy.yml", import.meta.url), "utf8");
const refresh = readFileSync(new URL("../../.github/workflows/update-releases.yml", import.meta.url), "utf8");

test("release workflows use the verified node runtime", () => {
  for (const workflow of [deploy, refresh]) {
    assert.match(workflow, /node-version:\s*'22\.19\.0'/);
  }
});

test("publishing checks the current static export without the legacy sitemap generator", () => {
  const tests = deploy.indexOf("npm run test:deployment");
  const build = deploy.indexOf("npm run build");
  const seo = deploy.indexOf("npm run audit:seo");
  const publish = deploy.indexOf("uses: peaceiris/actions-gh-pages");
  assert(tests >= 0 && tests < build && build < seo && seo < publish);
  for (const suite of ["design", "releases", "assets"]) assert(deploy.includes(`npm run test:${suite}`));
  assert.doesNotMatch(deploy, /npm run generate-sitemap|rm -f src\/app\/sitemap/);
  assert.match(deploy, /'public\/\*\*'/);
  assert.match(deploy, /'next\.config\.ts'/);
});

test("production builds do not bypass type errors", () => {
  const config = readFileSync(new URL("../../next.config.ts", import.meta.url), "utf8");
  assert.doesNotMatch(config, /ignoreBuildErrors:\s*true/);
});
