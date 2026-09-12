import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { commissionArt } from "../data/commissionArt";
import { galleryWorks } from "../data/gallery";

test("commission derivatives retain attribution, dimensions and small web payloads", async () => {
  assert.deepEqual(commissionArt.map((art) => art.artist), ["suyosuyo", "sobu · @sobsocks", "7mmchan"]);
  for (const art of commissionArt) {
    const source = `public${art.src}`;
    const image = await sharp(source).metadata();
    assert.equal(image.width, art.width, art.artist);
    assert.equal(image.height, art.height, art.artist);
    assert.equal(image.format, "webp");
    assert(statSync(source).size < 400 * 1024, `${art.artist}: large derivative under 400 KiB`);
    assert(statSync(`public${art.small}`).size < 150 * 1024, `${art.artist}: small derivative under 150 KiB`);
    assert(art.description.includes(art.artist.split(" ·")[0]));
  }
});

test("gallery groups credited works and ships every version within image budgets", async () => {
  assert.equal(new Set(galleryWorks.map(work => work.id)).size, galleryWorks.length);
  for (const work of galleryWorks) {
    assert(work.artist && work.description && work.variants.length);
    if (work.workUrl) assert.match(work.workUrl, /^https:\/\/skeb\.jp\/@[\w]+\/works\/\d+$/);
    assert(statSync(`public${work.small}`).size < 150 * 1024, work.id);
    for (const version of work.variants) {
      const info = await sharp(`public${version.src}`).metadata();
      assert.equal(info.width, version.width, version.src);
      assert.equal(info.height, version.height, version.src);
      assert(statSync(`public${version.src}`).size < 500 * 1024, version.src);
      if (version.motion) {
        const animation = await sharp(`public${version.motion}`, { animated: true }).metadata();
        assert.equal(animation.pages, 31, "all delivered animation frames are preserved");
        assert.equal(animation.delay?.reduce((a, b) => a + b, 0), 1400, "original timing is preserved");
        assert(statSync(`public${version.motion}`).size < 1_500_000, version.motion);
      }
    }
  }
});

function readModel(path: string) {
  const bytes = readFileSync(path);
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const length = bytes.readUInt32LE(12);
  return { bytes, json: JSON.parse(bytes.subarray(20, 20 + length).toString()), binary: bytes.subarray(28 + length) };
}

test("web VRM preserves original geometry, rig, expressions and metadata", () => {
  const original = readModel("public/model.vrm");
  const web = readModel("public/character/okiso-web.vrm");
  assert(web.bytes.length < original.bytes.length * .65, "at least 35% smaller");
  for (const field of ["extensions", "nodes", "skins", "meshes", "accessors", "materials", "textures", "images"]) {
    assert.deepEqual(web.json[field], original.json[field], field);
  }
  const imageViews = new Set<number>(web.json.images.map((image: { bufferView: number }) => image.bufferView));
  for (let index = 0; index < original.json.bufferViews.length; index++) {
    if (imageViews.has(index)) continue;
    const from = original.json.bufferViews[index], to = web.json.bufferViews[index];
    assert.deepEqual(web.binary.subarray(to.byteOffset, to.byteOffset + to.byteLength),
      original.binary.subarray(from.byteOffset || 0, (from.byteOffset || 0) + from.byteLength), `geometry view ${index}`);
  }
});

test("web VRM textures remain standard PNGs no larger than 1024px", async () => {
  const web = readModel("public/character/okiso-web.vrm");
  for (const image of web.json.images) {
    const view = web.json.bufferViews[image.bufferView];
    const metadata = await sharp(web.binary.subarray(view.byteOffset, view.byteOffset + view.byteLength)).metadata();
    assert.equal(metadata.format, "png");
    assert(metadata.width! <= 1024 && metadata.height! <= 1024);
  }
});
