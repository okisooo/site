---
name: performance-engineering
description: Web performance guidelines including asset loading, 3D model (GLTF/VRM) compression, static image export optimization, and caching.
---

# Web Performance Engineering Guidelines

Use these rules when implementing features, loading assets, or designing deployment pipelines to ensure near-instant load times and high PageSpeed scores.

## 1. Asset & Media Preloading
*   **Media Preload Constraints**: Never set `preload="auto"` on background music or media players on page load. Use `preload="none"` or `preload="metadata"` until the user interacts with the element.
*   **DNS & Preconnect Links**: For critical external APIs or dynamic assets, register `<link rel="preconnect" ...>` and `<link rel="dns-prefetch" ...>` tags in the page header.
*   **Fonts**: Load web fonts using `next/font/google` (or local self-hosting) with `font-display: swap` to prevent render-blocking flash of unstyled text (FOUT).

## 2. 3D & WebGL (Three.js/Fiber) Optimization
*   **Deferred Rendering**: Defer loading of heavy 3D canvases, render loops, and large models (e.g., VRM/GLTF files) until after the main thread is idle and Largest Contentful Paint (LCP) has completed.
*   **Draco / Meshopt Compression**: Always request geometry compression on heavy 3D models. Standardize GLTFLoader configurations to include a `DRACOLoader` instance pointing to CDN or local web worker decoders:
    ```typescript
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);
    ```
*   **Polygon Budgets & Texture Scaling**: Limit scene polygon count. Keep textures compressed (WebP/KTX2) and capped at 1024x1024 unless high fidelity is required.

## 3. Static Image Export Rules
*   **Build-time Optimization**: When using static exports (`output: 'export'`), do not rely on standard Next.js dynamic image optimization. Instead:
    *   Pre-generate WebP or AVIF formats for all static assets in `/public`.
    *   Integrate build-time image optimization tools (e.g., `next-image-export-optimizer` or custom scripts using `sharp`).
*   **Layout Stability**: Always define explicit width and height properties (or aspect ratios) on visual components to prevent Cumulative Layout Shift (CLS).

## 4. Audio Compression Standards
*   **Bitrate Limits**: For background or streaming audio elements, compress MP3 files to a maximum of 128kbps variable bitrate (VBR) or transcode to WebM/Opus at 96kbps. Avoid uncompressed formats like WAV.
*   **HTTP Range Requests**: Ensure server configurations support HTTP Range Requests (206 Partial Content) to allow instant seeking and chunked streaming of audio files.

## 5. Hosting & Caching Rules
*   **Cache Headers**: Configure edge caching rules on your CDN (Vercel, Netlify, Cloudflare Pages) to set `Cache-Control: public, max-age=31536000, immutable` for all static media (`.mp3`, `.vrm`, `.webp`, `.png`, and hashed assets).
*   **Modern Formats**: Configure CDN routing to deliver Brotli-compressed static text assets (`.js`, `.css`, `.html`, `.json`) instead of Gzip.
