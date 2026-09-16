export type ModelQuality = "full" | "reduced" | "fallback";

// Bound total drawing work, including tall canvases on high-density phones.
export function heroPixelRatio(width: number, height: number, density: number, reduced: boolean) {
  return Math.min(density, 1.5, Math.sqrt(600_000 / Math.max(1, width * height))) * (reduced ? .65 : 1);
}

/** A decorative model must leave enough frame time for the rest of the page. */
export function createModelPerformanceBudget() {
  let quality: ModelQuality = "full";
  let start: number | undefined, callbacks = 0, renders = 0, renderTime = 0;
  const reset = () => { start = undefined; callbacks = renders = renderTime = 0; };
  return {
    reset,
    rendered(milliseconds: number) { renders++; renderTime += milliseconds; },
    sample(now: number): ModelQuality {
      if (quality === "fallback") return quality;
      // Exclude initial shader compilation and the first second after resuming.
      if (start === undefined) start = now + 1000;
      if (now < start) { callbacks = renders = renderTime = 0; return quality; }
      callbacks++;
      const duration = now - start;
      if (duration < 2000) return quality;
      const previousQuality = quality;
      if (callbacks * 1000 / duration < 45 || (renders > 0 && renderTime / renders > 12)) {
        quality = quality === "full" ? "reduced" : "fallback";
      }
      // Only a quality change needs another warm-up period.
      const changed = quality !== previousQuality;
      reset();
      start = changed ? undefined : now;
      return quality;
    },
  };
}
