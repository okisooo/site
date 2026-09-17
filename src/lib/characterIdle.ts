const BLINKS = [[2.3, .16], [2.58, .13], [6.8, .19], [11.2, .17]] as const;

// ponytail: use the existing animation clock, including its pause/visibility handling.
export function sampleCharacterIdle(seconds: number) {
  const phase = seconds % 14;
  let blink = 0;
  for (const [start, duration] of BLINKS) {
    const progress = (phase - start) / duration;
    if (progress > 0 && progress < 1) blink = Math.sin(progress * Math.PI) ** 2;
  }
  return { blink, smile: (1 - Math.cos(phase / 14 * Math.PI * 2)) / 2 };
}
