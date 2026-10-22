import assert from "node:assert/strict";
import test from "node:test";
import { coverArt, coverSrcSet } from "./coverArt";

const cover = "https://i.scdn.co/image/ab67616d0000b2735bb05bf0637f105ffaf0d1c4";

test("cover art maps Spotify covers to their published sizes", () => {
  assert.equal(coverArt(cover, 64), "https://i.scdn.co/image/ab67616d000048515bb05bf0637f105ffaf0d1c4");
  assert.equal(coverArt(cover, 300), "https://i.scdn.co/image/ab67616d00001e025bb05bf0637f105ffaf0d1c4");
  assert.equal(coverArt(cover, 640), cover);
  assert.equal(coverSrcSet(cover), `${coverArt(cover, 300)} 300w, ${cover} 640w`);
  assert.equal(coverSrcSet(cover, [64, 300]), `${coverArt(cover, 64)} 64w, ${coverArt(cover, 300)} 300w`);
});

test("cover art leaves other images alone", () => {
  for (const url of ["/art/7mmchan-640.webp", "https://i.scdn.co/image/ab6761610000e5eb5bb05bf0637f105ffaf0d1c4"]) {
    assert.equal(coverArt(url, 64), url);
    assert.equal(coverSrcSet(url), undefined);
  }
});
