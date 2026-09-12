import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { usesEditorialDesign } from "./siteDesign";
import { staticReleases } from "../data/releases";
import { getEditorialHomeData, releaseCard } from "./releasePresentation";
import { getReleaseListenTarget } from "./releaseLinks";

test("all core pages and release details use one editorial system", () => {
  for (const route of ["/", "/releases", "/gallery", "/vault", "/upcoming", "/lab/soft-orbit", ...staticReleases.map((release) => `/releases/${release.slug}`)]) {
    assert.equal(usesEditorialDesign(route), true, route);
  }
});

test("core styling keeps the user-confirmed white and red identity", () => {
  const css = readFileSync(new URL("../styles/editorial.css", import.meta.url), "utf8");
  assert.match(css, /--ed-red:\s*rgb\(var\(--c-red\)\)/);
  assert.match(css, /--ed-accent:\s*var\(--ed-red-deep\)/);
  assert.match(css, /--ed-on-accent:\s*var\(--ed-white\)/);
  assert.doesNotMatch(css, /--ed-(?:yellow|lilac|lemon|iris)\b/);
});
test("standalone project exclusions do not swallow similarly named core paths", () => {
  for (const route of ["/rouge-noir", "/rouge-noir/credits", "/okiso-grain", "/grain"]) assert.equal(usesEditorialDesign(route), false);
  assert.equal(usesEditorialDesign("/releases/rouge-noir"), true);
  assert.equal(usesEditorialDesign("/grain-news"), true);
});
test("compact release cards retain listening destinations and accurate counts", () => {
  for (const release of staticReleases) {
    const card = releaseCard(release);
    assert.deepEqual(getReleaseListenTarget(card), getReleaseListenTarget(release), release.title);
    assert.equal(card.totalTracks, release.totalTracks ?? release.tracks?.length ?? 1);
    assert.equal(card.tracks?.[0]?.title, release.tracks?.[0]?.title);
    assert(card.tracks?.every((track) => !("lyrics" in track)) ?? true);
  }
});
test("homepage keeps the four latest releases and real curated listening picks", () => {
  const data = getEditorialHomeData();
  assert.deepEqual(data.releases.map((release) => release.id), staticReleases.slice(0, 4).map((release) => release.id));
  assert.equal(data.releaseCount, staticReleases.length);
  assert.deepEqual(data.picks.map((release) => release.title), ["PRODIGY", "VAC", "for a chance to look beyond the stars"]);
});
