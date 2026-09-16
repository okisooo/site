export function createModelContext(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  // ponytail: let the browser reject slow software graphics; never retry without the guard.
  try {
    return canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return null;
  }
}
