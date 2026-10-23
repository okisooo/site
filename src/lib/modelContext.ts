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

/** Ask for the same guarded context, then release it, so refusing devices never download three.js. */
export function canCreateModelContext(canvas: HTMLCanvasElement = document.createElement("canvas")) {
  const context = createModelContext(canvas);
  context?.getExtension("WEBGL_lose_context")?.loseContext();
  return context !== null;
}
