import assert from "node:assert/strict";
import test from "node:test";
import { sampleCharacterIdle } from "./characterIdle";

test("idle expressions stay bounded and continuous, with open-eye rests and a double blink", () => {
  let previous = sampleCharacterIdle(0);
  for (let frame = 1; frame <= 28 * 120; frame++) {
    const current = sampleCharacterIdle(frame / 120);
    for (const name of ["blink", "smile"] as const) {
      assert(current[name] >= 0 && current[name] <= 1);
      assert(Math.abs(current[name] - previous[name]) < .21, "no abrupt expression jumps");
    }
    previous = current;
  }
  for (const time of [0, 2.5, 5, 10, 14]) assert.equal(sampleCharacterIdle(time).blink, 0);
  for (const time of [2.38, 2.645]) assert(sampleCharacterIdle(time).blink > .99);
  assert(sampleCharacterIdle(7).smile > .99);
  assert.deepEqual(sampleCharacterIdle(0), sampleCharacterIdle(14));
});
