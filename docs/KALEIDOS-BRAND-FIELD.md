# kaleidos brand field provenance

The website uses the original **OKISO crimson current** shader created in Kaleidos on 2026-10-15.

- Original GLSL: `S:/Codex/outputs/2026-10-15/okiso-kaleidos/native-exports/OKISO_crimson_current/OKISO_crimson_current.glsl`.
- `src/Components/Editorial/brandShader.ts` embeds that complete source with line endings and trailing whitespace normalized. The WebGL 2 host adds only the required version, precision, uniforms, output and main entry point.
- The field, 110-color palette, time coefficients and image orientation are preserved. There is no replacement shader, palette remapping or simulated audio input.
- `/art/brand/crimson-current.png` is the original native `OKISO_crimson_current_shader_2560x1440_scale5_t0.png`, unchanged (28,466 bytes; SHA-256 `4838030d260a30c32a47da9c96412b43fa97a7f285872f40c675d312db5cadf1`).
- The public asset directory is a Windows junction to physical `S:/Codex/outputs/2026-10-31/site-redesign/brand-assets/`, matching this checkout's existing gallery asset arrangement.

`BrandField.tsx` owns the small WebGL renderer. It uses a fullscreen triangle with no extra rendering dependency. It refuses major software-rendering fallbacks and retains the native still if WebGL is unavailable or compilation/context creation fails. A lost context also reveals the still; context restoration rebuilds the program.

The field now belongs to `SiteFrame.tsx` as one fixed viewport background across the core site. It remains visible behind the cover, between paper sections, and in a broad open band before the art room. There is no separate hero renderer. Standalone designs remain excluded.

The existing ambient-motion preference controls animation. The field stops when the page is hidden, when ambient motion is paused, for reduced motion, and while any editorial dialog is open. The component observes only direct shell-child changes because dialogs portal beside main. Its program stays compiled across these pauses and client-side route changes. On narrow or coarse-pointer devices, inner routes keep a still/frozen field; the homepage remains animated. A fixed viewport field has no offscreen state, so the former intersection observer was removed.

Drawing is capped at 30 fps in the original 640 x 360 coordinate system (230,400 buffer pixels at every display size). Canvas and native still share the same aspect ratio and CSS cover crop, with normal browser interpolation rather than forced nearest-neighbor scaling. The source's motion rate is unchanged. These are rendering limits, not a guarantee of a particular frame rate on a physical device.
