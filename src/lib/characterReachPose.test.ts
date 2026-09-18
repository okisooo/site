import assert from "node:assert/strict";
import test from "node:test";
import { VRMHumanBoneName } from "@pixiv/three-vrm";
import pose from "../data/characterReachPose.json";

test("the reference pose uses valid normalized bones and retains all finger joints", () => {
  for (const required of ["hips", "leftHand", "rightHand"]) assert(required in pose, `missing ${required}`);
  const bones = new Set<string>(Object.values(VRMHumanBoneName));
  for (const [name, { rotation }] of Object.entries(pose)) {
    assert(bones.has(name), `unknown humanoid bone: ${name}`);
    assert.equal(rotation.length, 4);
    assert(rotation.every(Number.isFinite));
    assert(Math.abs(Math.hypot(...rotation) - 1) < 1e-6, `${name}: unit quaternion`);
  }
  assert.equal(Object.keys(pose).filter(name => /Thumb|Index|Middle|Ring|Little/.test(name)).length, 30);
});
