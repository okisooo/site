import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

// Preserve every VRM extension, node, skin, morph and bufferView index. Generic
// glTF rewrite tools can discard VRM 0 extensions; this only repacks raw views.
const source = await readFile('public/model.vrm');
assert.equal(source.readUInt32LE(0), 0x46546c67);
assert.equal(source.readUInt32LE(4), 2);
const jsonLength = source.readUInt32LE(12);
const original = JSON.parse(source.subarray(20, 20 + jsonLength).toString());
const document = structuredClone(original);
assert.equal(document.buffers.length, 1);
const binaryStart = 28 + jsonLength;
assert.equal(source.readUInt32LE(binaryStart - 4), 0x004e4942);
const images = new Map(document.images.map((image) => [image.bufferView, image]));
const blocks = [], hashes = new Map();
let size = 0, reused = 0;
const originalView = (view) => source.subarray(binaryStart + (view.byteOffset || 0), binaryStart + (view.byteOffset || 0) + view.byteLength);

for (let index = 0; index < document.bufferViews.length; index++) {
  const view = document.bufferViews[index];
  assert.equal(view.buffer, 0);
  let data = originalView(original.bufferViews[index]);
  if (images.has(index)) {
    assert.equal(images.get(index).mimeType, 'image/png');
    data = await sharp(data).resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 }).toBuffer();
  }
  const hash = createHash('sha256').update(data).digest('hex');
  let offset = hashes.get(hash);
  if (offset === undefined) {
    offset = size;
    blocks.push(data);
    const padding = (4 - data.length % 4) % 4;
    if (padding) blocks.push(Buffer.alloc(padding));
    size += data.length + padding;
    hashes.set(hash, offset);
  } else reused++;
  view.byteOffset = offset;
  view.byteLength = data.length;
}
document.buffers[0].byteLength = size;
const binary = Buffer.concat(blocks);
// Fail closed if geometry, rig metadata or expressions changed.
assert.deepEqual(document.extensions, original.extensions);
for (const key of ['nodes', 'skins', 'meshes', 'accessors', 'materials', 'textures']) assert.deepEqual(document[key], original[key]);
for (let i = 0; i < document.bufferViews.length; i++) {
  if (images.has(i)) continue;
  const view = document.bufferViews[i];
  assert.deepEqual(binary.subarray(view.byteOffset, view.byteOffset + view.byteLength), originalView(original.bufferViews[i]));
}
const json = Buffer.from(JSON.stringify(document));
const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + jsonPadded.length + binary.length, 8);
header.writeUInt32LE(jsonPadded.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(binary.length, 0);
binaryHeader.writeUInt32LE(0x004e4942, 4);
const output = Buffer.concat([header, jsonPadded, binaryHeader, binary]);
assert(output.length < source.length, 'The web model must be smaller than the original');
await mkdir('public/character', { recursive: true });
await writeFile('public/character/okiso-web.vrm', output);
console.log(JSON.stringify({ originalBytes: source.length, webBytes: output.length, reductionPercent: Math.round(100 * (1 - output.length / source.length)), identicalViewsReused: reused, geometryAndRigPreserved: true }));
