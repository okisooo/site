import { AnimationClip, QuaternionKeyframeTrack } from "three";
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";
import gesture from "../data/characterGesture.json";

// ponytail: use Three's existing mixer for the authored joints, not another animation loop.
export function createCharacterGestureClip(vrm: VRM) {
  const tracks = Object.entries(gesture.rotations).flatMap(([name, rotations]) => {
    const bone = vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
    return bone ? [new QuaternionKeyframeTrack(`${bone.name}.quaternion`, gesture.times, rotations)] : [];
  });
  return new AnimationClip("authored-hand-gesture", gesture.duration, tracks);
}
