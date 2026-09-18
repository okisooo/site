import { AnimationClip, Euler, Quaternion, QuaternionKeyframeTrack } from "three";
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";
import pose from "../data/characterReachPose.json";

// ponytail: use Three's existing mixer for idle accents, not another animation loop.
export function createCharacterGestureClip(vrm: VRM) {
  // Hold the silhouette. Only the wrist and fingertips gently settle within it.
  const accents = {
    leftHand: [.025, .02, .055],
    leftIndexProximal: [0, -.025, .015],
    leftMiddleProximal: [0, .025, .02],
    rightThumbProximal: [0, 0, -.035],
  };
  const tracks = Object.entries(accents).flatMap(([name, [x, y, z]]) => {
    const bone = vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
    const rest = new Quaternion().fromArray(pose[name as keyof typeof pose].rotation);
    const rotations = [0, 1, 0, -1, 0].flatMap(amount => rest.clone()
      .multiply(new Quaternion().setFromEuler(new Euler(x * amount, y * amount, z * amount))).toArray());
    return bone ? [new QuaternionKeyframeTrack(`${bone.name}.quaternion`, [0, 3, 6, 9, 12], rotations)] : [];
  });
  return new AnimationClip("peace-sign-idle", 12, tracks);
}
