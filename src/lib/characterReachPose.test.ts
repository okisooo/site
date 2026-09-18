import assert from "node:assert/strict";
import test from "node:test";
import { VRMHumanBoneName, type VRM } from "@pixiv/three-vrm";
import { AnimationMixer, Object3D } from "three";
import { createCharacterGestureClip } from "./characterGesture";
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

test("the authored clip moves finger joints on both hands and holds a paused frame", () => {
  const scene = new Object3D();
  const bones = new Map(Object.keys(pose).map(name => {
    const bone = new Object3D(); bone.name = name; scene.add(bone);
    return [name, bone] as const;
  }));
  const vrm = { scene, humanoid: { getNormalizedBoneNode: (name: string) => bones.get(name) } } as unknown as VRM;
  const clip = createCharacterGestureClip(vrm);
  assert.equal(clip.tracks.length, 38);
  const mixer = new AnimationMixer(scene);
  const action = mixer.clipAction(clip).play();
  for (const side of ["left", "right"]) {
    for (const joint of ["IndexIntermediate", "MiddleProximal", "ThumbProximal"]) {
      const bone = bones.get(`${side}${joint}`)!;
      mixer.setTime(0); const start = bone.quaternion.clone();
      let excursion = 0;
      for (let time = 0; time < clip.duration; time += .1) {
        mixer.setTime(time); excursion = Math.max(excursion, start.angleTo(bone.quaternion));
      }
      assert(excursion > .15, `${side}${joint} must visibly articulate, not remain frozen`);
      mixer.setTime(8); const paused = bone.quaternion.clone();
      mixer.setTime(8); assert(bone.quaternion.angleTo(paused) < .003);
      mixer.setTime(clip.duration - .001); const end = bone.quaternion.clone();
      mixer.setTime(0); assert(bone.quaternion.angleTo(end) < .003, "continuous loop seam");
    }
  }
  action.stop(); mixer.uncacheRoot(scene);
});
