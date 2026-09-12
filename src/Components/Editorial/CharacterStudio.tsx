"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Pause, Play } from "lucide-react";
import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, Mesh, MeshStandardMaterial, MeshBasicMaterial, CylinderGeometry, TorusGeometry, Quaternion, Euler, Vector3, SRGBColorSpace, LinearToneMapping } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRMLoaderPlugin, VRMUtils, type VRM } from "@pixiv/three-vrm";

type Expression = "neutral" | "happy" | "relaxed";
type StudioOptions = { expression: Expression; pose: "relaxed" | "wave"; framing: "full" | "portrait"; motion: boolean; turntable: boolean; saver: boolean };
const DEFAULTS: StudioOptions = { expression: "neutral", pose: "relaxed", framing: "full", motion: true, turntable: false, saver: true };

export default function CharacterStudio() {
  const canvasHost = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<StudioOptions>(DEFAULTS);
  const current = useRef(options);
  current.current = options;
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [reduced, setReduced] = useState(false);
  const commands = useRef<{ refresh: () => void; reset: () => void; rotate: (direction: number) => void } | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setReduced(media.matches); if (media.matches) setOptions((old) => ({ ...old, motion: false, turntable: false })); };
    sync();
    setOptions((old) => ({ ...old, saver: window.matchMedia("(max-width: 700px), (pointer: coarse)").matches || navigator.hardwareConcurrency <= 4 }));
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => { commands.current?.refresh(); }, [options]);

  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;
    // Own the canvas as well as the context. Strict-mode cleanup and retries
    // must never hand a deliberately lost context back to a new renderer.
    const element = document.createElement("canvas");
    element.setAttribute("aria-hidden", "true");
    host.appendChild(element);
    let disposed = false, failed = false, inView = true, frame = 0, last = 0, elapsed = 0;
    let renderer: WebGLRenderer | undefined, controls: OrbitControls | undefined, vrm: VRM | undefined;
    let previousFraming = "", previousPose = "", previousExpression = "";
    let dolly = false;
    const cameraDestination = new Vector3(), targetDestination = new Vector3();
    const controller = new AbortController();
    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, .1, 30);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const q = (x: number, y: number, z: number) => new Quaternion().setFromEuler(new Euler(x, y, z)).toArray();
    setState("loading"); setProgress(0);

    const render = (time: number) => {
      frame = 0;
      if (disposed || failed || !inView || document.hidden || !renderer || !controls) return;
      const settings = current.current;
      const moving = settings.motion && !prefersReduced.matches && !!vrm;
      const interval = 1000 / (settings.saver ? 30 : 60);
      if (moving && last && time - last < interval - 1) { frame = requestAnimationFrame(render); return; }
      const delta = Math.min((time - (last || time)) / 1000, .05);
      last = time;
      if (moving) elapsed += delta;
      controls.autoRotate = moving && settings.turntable && !dolly;
      controls.enableDamping = moving;
      if (settings.framing !== previousFraming) {
        const portrait = settings.framing === "portrait";
        cameraDestination.set(0, portrait ? 1.42 : .95, portrait ? 1.6 : Math.min(4.4, Math.max(3.6, 2.15 / camera.aspect)));
        targetDestination.set(0, portrait ? 1.35 : .8, 0);
        dolly = moving && previousFraming !== "";
        if (!dolly) { camera.position.copy(cameraDestination); controls.target.copy(targetDestination); }
        previousFraming = settings.framing;
      }
      if (dolly) {
        const blend = moving ? 1 - Math.exp(-delta * 12) : 1;
        camera.position.lerp(cameraDestination, blend);
        controls.target.lerp(targetDestination, blend);
        if (camera.position.distanceTo(cameraDestination) < .002) dolly = false;
      }
      if (vrm) {
        if (previousPose !== settings.pose) {
          vrm.humanoid.resetNormalizedPose();
          vrm.humanoid.setNormalizedPose({
            leftUpperArm: { rotation: q(0, 0, 1.15) },
            rightUpperArm: { rotation: q(0, 0, settings.pose === "wave" ? .65 : -1.15) },
            leftLowerArm: { rotation: q(0, -.1, .12) },
            rightLowerArm: { rotation: q(settings.pose === "wave" ? -.6 : 0, .1, settings.pose === "wave" ? .65 : -.12) },
          });
          previousPose = settings.pose;
        }
        if (previousExpression !== settings.expression) {
          for (const name of ["happy", "relaxed"]) vrm.expressionManager?.setValue(name, name === settings.expression ? .8 : 0);
          previousExpression = settings.expression;
        }
        const head = vrm.humanoid.getNormalizedBoneNode("head");
        const chest = vrm.humanoid.getNormalizedBoneNode("chest");
        const hand = vrm.humanoid.getNormalizedBoneNode("rightHand");
        if (head) head.rotation.y = moving ? Math.sin(elapsed * .6) * .035 : 0;
        if (chest) chest.rotation.x = moving ? Math.sin(elapsed * 1.6) * .008 : 0;
        if (hand) hand.rotation.z = moving && settings.pose === "wave" ? Math.sin(elapsed * 5) * .18 : 0;
        const blinkTime = elapsed % 4.4;
        vrm.expressionManager?.setValue("blink", moving && blinkTime > 4.15 ? Math.sin((blinkTime - 4.15) / .25 * Math.PI) : 0);
        vrm.update(moving ? delta : 0);
      }
      controls.update();
      renderer.render(scene, camera);
      if (moving && !frame) frame = requestAnimationFrame(render);
    };
    const invalidate = () => { if (!disposed && !failed && inView && !document.hidden && !frame) frame = requestAnimationFrame(render); };
    const resize = () => {
      if (!renderer) return;
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, current.current.saver ? 1 : 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      invalidate();
    };
    const visibility = () => { cancelAnimationFrame(frame); frame = 0; last = 0; invalidate(); };
    const lost = (event: Event) => { event.preventDefault(); failed = true; setState("error"); cancelAnimationFrame(frame); frame = 0; };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); }, { threshold: .01 });
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      renderer = new WebGLRenderer({ canvas: element, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.toneMapping = LinearToneMapping;
      renderer.toneMappingExposure = 1;
      controls = new OrbitControls(camera, element);
      controls.enablePan = false;
      controls.minDistance = 1.1; controls.maxDistance = 4.5;
      controls.minPolarAngle = .85; controls.maxPolarAngle = 1.7;
      controls.autoRotateSpeed = .7;
      controls.addEventListener("change", invalidate);
      controls.addEventListener("start", () => { dolly = false; });
      scene.add(new AmbientLight(0xffffff, .6));
      const key = new DirectionalLight(0xffffff, 1.1); key.position.set(2, 4, 4); scene.add(key);
      const fill = new DirectionalLight(0xffffff, .45); fill.position.set(-3, 2, 1); scene.add(fill);
      const plinth = new Mesh(new CylinderGeometry(.48, .5, .045, 64), new MeshStandardMaterial({ color: 0xe4e4e8, roughness: .7 }));
      plinth.position.y = -.035; scene.add(plinth);
      const rim = new Mesh(new TorusGeometry(.49, .004, 8, 64), new MeshBasicMaterial({ color: 0xcc0000 }));
      rim.rotation.x = Math.PI / 2; rim.position.y = -.01; scene.add(rim);
      commands.current = {
        refresh: () => { resize(); invalidate(); },
        reset: () => { previousFraming = ""; elapsed = 0; invalidate(); },
        rotate: (direction) => {
          if (!controls) return;
          dolly = false;
          const relative = camera.position.clone().sub(controls.target).applyAxisAngle(new Vector3(0, 1, 0), direction * .25);
          camera.position.copy(controls.target).add(relative); controls.update(); invalidate();
        },
      };
      observer.observe(element);
      intersection.observe(host);
      document.addEventListener("visibilitychange", visibility);
      element.addEventListener("webglcontextlost", lost);
      resize();

      void (async () => {
        try {
          timeout = setTimeout(() => controller.abort(), 45000);
          const response = await fetch("/character/okiso-web.vrm", { signal: controller.signal });
          if (!response.ok) throw new Error("Model download failed");
          const total = Number(response.headers.get("content-length"));
          const reader = response.body?.getReader();
          const chunks: Uint8Array[] = [];
          let received = 0;
          if (!reader) throw new Error("Model response unavailable");
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value); received += value.length;
            if (!disposed && total) setProgress(Math.min(95, Math.round(received / total * 95)));
          }
          const bytes = new Uint8Array(received);
          let offset = 0;
          for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
          const loader = new GLTFLoader();
          loader.register((parser) => new VRMLoaderPlugin(parser));
          const gltf = await loader.parseAsync(bytes.buffer, "/character/");
          const model = gltf.userData.vrm as VRM | undefined;
          if (!model) { VRMUtils.deepDispose(gltf.scene); throw new Error("Invalid VRM"); }
          if (disposed) { VRMUtils.deepDispose(model.scene); return; }
          VRMUtils.removeUnnecessaryVertices(model.scene);
          VRMUtils.combineSkeletons(model.scene);
          VRMUtils.combineMorphs(model);
          VRMUtils.rotateVRM0(model);
          vrm = model; scene.add(model.scene);
          clearTimeout(timeout);
          setProgress(100); setState("ready"); invalidate();
        } catch (error) {
          if (!disposed) { console.error("Character model load failed", error); setState("error"); }
        } finally { clearTimeout(timeout); }
      })();
    } catch (error) { console.error("Character renderer setup failed", error); setState("error"); }

    return () => {
      disposed = true; controller.abort(); clearTimeout(timeout); cancelAnimationFrame(frame);
      observer.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", visibility);
      element.removeEventListener("webglcontextlost", lost);
      commands.current = null; controls?.dispose();
      VRMUtils.deepDispose(scene); renderer?.dispose(); renderer?.forceContextLoss(); element.remove();
    };
  }, [attempt]);

  const update = <K extends keyof StudioOptions>(key: K, value: StudioOptions[K]) => setOptions((old) => ({ ...old, [key]: value }));
  return <div className="ed-character-studio">
    <div className="ed-studio-stage">
      <div className="ed-studio-stage-label"><span>okiso / character room</span><span>{options.saver ? "battery saver" : "high detail"}</span></div>
      <div ref={canvasHost} className="ed-studio-canvas" role="group" tabIndex={state === "ready" ? 0 : -1} aria-label="Interactive OKISO model. Drag to turn, scroll to zoom, or use the left and right arrow keys."
        onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); commands.current?.rotate(event.key === "ArrowLeft" ? -1 : 1); } }} />
      {state !== "ready" && <div className="ed-studio-loading"><img src="/art/7mmchan-256.webp" alt="OKISO by 7mmchan" width="128" height="128" /><p role="status">{state === "error" ? "the 3d model couldn’t load on this device." : progress >= 95 ? "preparing the character…" : `loading the character · ${progress}%`}</p>{state === "error" ? <button className="ed-button" onClick={() => setAttempt((value) => value + 1)}>try again</button> : <progress value={progress} max="100" aria-label="Character loading progress" />}<small>illustration by 7mmchan</small></div>}
      <span className="ed-studio-stage-hint">drag to turn · scroll to zoom</span>
    </div>
    <div className="ed-studio-console">
      <div className="ed-studio-control-row"><span className="ed-label">framing</span><div role="group" aria-label="Character framing">{(["full", "portrait"] as const).map((value) => <button key={value} className="ed-button" aria-pressed={options.framing === value} onClick={() => update("framing", value)}>{value === "full" ? "full figure" : value}</button>)}</div></div>
      <div className="ed-studio-control-row"><span className="ed-label">expression</span><div role="group" aria-label="Character expression">{(["neutral", "happy", "relaxed"] as const).map((value) => <button key={value} className="ed-button" disabled={state !== "ready"} aria-pressed={options.expression === value} onClick={() => update("expression", value)}>{value}</button>)}</div></div>
      <div className="ed-studio-control-row"><span className="ed-label">pose</span><div role="group" aria-label="Character pose">{(["relaxed", "wave"] as const).map((value) => <button key={value} className="ed-button" disabled={state !== "ready"} aria-pressed={options.pose === value} onClick={() => update("pose", value)}>{value === "relaxed" ? "at ease" : "wave"}</button>)}</div></div>
      <div className="ed-studio-transport"><button className="ed-icon-button" aria-label="Turn character left" onClick={() => commands.current?.rotate(-1)}><ArrowLeft size={17} /></button><button className="ed-button" disabled={reduced} aria-pressed={options.turntable} onClick={() => setOptions((old) => ({ ...old, turntable: !old.turntable, motion: true }))}>turntable</button><button className="ed-icon-button" aria-label="Turn character right" onClick={() => commands.current?.rotate(1)}><ArrowRight size={17} /></button></div>
      <div className="ed-studio-settings"><button className="ed-button" disabled={reduced} onClick={() => update("motion", !options.motion)}>{options.motion && !reduced ? <Pause size={14} /> : <Play size={14} />}{reduced ? "reduced motion" : options.motion ? "pause motion" : "resume motion"}</button><button className="ed-button" aria-pressed={options.saver} onClick={() => update("saver", !options.saver)}>battery saver</button><button className="ed-icon-button" aria-label="Reset character view" onClick={() => { setOptions((old) => ({ ...DEFAULTS, motion: !reduced, saver: old.saver })); commands.current?.reset(); }}><RotateCcw size={16} /></button></div>
      <p className="ed-studio-note">your original vrm. rig and expressions preserved.<br />3d loads only when this room is opened.</p>
    </div>
  </div>;
}
