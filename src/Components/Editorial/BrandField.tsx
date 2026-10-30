"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AmbientMotionContext } from "./AmbientMotion";
import { crimsonCurrent } from "./brandShader";

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const fragment = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 iResolution;
uniform float iTime;
out vec4 color;
${crimsonCurrent}
void main() { mainImage(color, gl_FragCoord.xy); }`;

/** Native Kaleidos coordinates; CSS crops both the still and canvas identically. */
export default function BrandField({ home }: { home: boolean }) {
  const enabled = useContext(AmbientMotionContext);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const activate = useRef<(run: boolean) => void>(() => {});
  const [compact, setCompact] = useState(true);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const active = enabled && !dialogOpen && (home || !compact);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => setCompact(window.innerWidth <= 700 || coarse.matches);
    update();
    window.addEventListener("resize", update);
    coarse.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      coarse.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    const shell = root.current?.closest(".core-site");
    if (!shell) return;
    // Editorial dialogs portal directly beside main. Observe only those root changes.
    const update = () => setDialogOpen(!!shell.querySelector('[role="dialog"]'));
    const observer = new MutationObserver(update);
    observer.observe(shell, { childList: true });
    update();
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (active) setStarted(true); }, [active]);
  useEffect(() => { activate.current(active); }, [active, ready]);

  useEffect(() => {
    const surface = canvas.current;
    if (!surface || !started) return;
    let accepted: WebGL2RenderingContext | null;
    try {
      accepted = surface.getContext("webgl2", {
        alpha: false, antialias: false, depth: false, stencil: false,
        powerPreference: "low-power", failIfMajorPerformanceCaveat: true,
      });
    } catch { return; }
    if (!accepted) return;
    const gl = accepted;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    let request = 0, last = 0;
    let running = false;
    const dispose = () => {
      running = false;
      cancelAnimationFrame(request);
      activate.current = () => {};
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
      delete surface.dataset.frame;
    };
    const lost = (event: Event) => { event.preventDefault(); dispose(); setReady(false); };
    const restored = () => setGeneration((value) => value + 1);
    surface.addEventListener("webglcontextlost", lost);
    surface.addEventListener("webglcontextrestored", restored);
    try {
      if (!program || !buffer) throw new Error("Graphics resources unavailable");
      for (const [kind, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
        const shader = gl.createShader(kind);
        if (!shader) throw new Error("Shader unavailable");
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader compilation failed");
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader linking failed");
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.viewport(0, 0, 640, 360);
      gl.uniform2f(gl.getUniformLocation(program, "iResolution"), 640, 360);
      const time = gl.getUniformLocation(program, "iTime");
      const draw = () => {
        gl.uniform1f(time, elapsed.current);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        surface.dataset.frame = String(Math.round(elapsed.current * 1000));
      };
      const frame = (now: number) => {
        if (!running) return;
        if (now - last >= 1000 / 30) {
          if (last) elapsed.current += Math.min((now - last) / 1000, .1);
          last = now;
          draw();
        }
        request = requestAnimationFrame(frame);
      };
      activate.current = (run) => {
        running = run;
        cancelAnimationFrame(request);
        last = 0;
        if (run) request = requestAnimationFrame(frame);
      };
      draw();
      setReady(true);
      activate.current(activeRef.current);
    } catch { dispose(); setReady(false); }
    return () => {
      dispose();
      setReady(false);
      surface.removeEventListener("webglcontextlost", lost);
      surface.removeEventListener("webglcontextrestored", restored);
    };
  }, [started, generation]);

  return <div ref={root} className="ed-brand-field" aria-hidden="true" data-live={ready || undefined} data-running={ready && active}>
    <img src="/art/brand/crimson-current.png" alt="" width="2560" height="1440" fetchPriority="high" />
    <canvas ref={canvas} width="640" height="360" />
  </div>;
}
