import assert from "node:assert/strict";
import test from "node:test";
import { VRMHumanBoneName } from "@pixiv/three-vrm";
import pose from "../data/characterSmirkPose.json";

test("the smirk pose uses valid normalized bones with unit rotations", () => {
  const bones = new Set<string>(Object.values(VRMHumanBoneName));
  for (const [name, { rotation }] of Object.entries(pose)) {
    assert(bones.has(name), `unknown humanoid bone: ${name}`);
    assert.equal(rotation.length, 4);
    assert(rotation.every(Number.isFinite));
    assert(Math.abs(Math.hypot(...rotation) - 1) < 1e-6, `${name}: unit quaternion`);
  }
});

test("the smirk pose holds the chin-rest: raised arm, curled fingers and a turned head", () => {
  for (const required of ["hips", "head", "leftUpperArm", "leftLowerArm", "leftHand"]) assert(required in pose, `missing ${required}`);
  const left = Object.keys(pose).filter(name => /^left(Thumb|Index|Middle|Ring|Little)/.test(name));
  assert.equal(left.length, 15, "every joint of the jaw hand is posed");
});
