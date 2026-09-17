# Chrome graphics incident — resolved in the reported session

On 2026-09-17 the user confirmed that restarting Chrome restored smooth website
performance. Treat the incident as resolved; do not continue speculative website
performance changes unless the problem recurs.

The supplied GPU report from 2026-09-16 showed software-only WebGL, canvas,
rasterization and page compositing through Microsoft Basic Render Driver / ANGLE
D3D11 WARP, despite the acceleration setting being enabled. It recorded a GPU
process crash, but the initial trigger for the software fallback was not established.

The lag persisted with the still illustration and zero canvases on the live page.
The 3d model was therefore not established as the root cause. The user-reported
restart recovery supports a browser-session graphics problem; it does not prove
which driver, extension or browser event originally triggered it.

## Final website behavior

- Keep the native `failIfMajorPerformanceCaveat` context check. If the browser
  rejects the graphics context, retain the illustration without fetching the model.
- Restore the original hero pixel ratio: at least 1.5 on desktop, capped at 2;
  keep the existing mobile/battery-saver and character-room limits.
- Remove the debugging-era 600,000-pixel cap, automatic resolution reduction and
  callback-rate-based fallback. These lowered quality without resolving the incident.
- Keep the corrected frame cadence and existing visibility/motion controls.

If the same symptom returns, check the actual browser graphics state and restart
recovery before changing model quality or page design again.
