/** Preserve cadence after a slightly late frame; drop whole missed frames. */
export function nextModelFrame(previousDeadline: number, now: number, interval: number) {
  return !previousDeadline || now - previousDeadline >= interval
    ? now + interval
    : previousDeadline + interval;
}
