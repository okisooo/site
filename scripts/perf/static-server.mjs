// Serves the Next static export in D:/GitHub/site/out on :3000 so the
// production bundle can be profiled the same way the dev server was.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

import { fileURLToPath } from "node:url";
const ROOT = join(fileURLToPath(new URL("../../", import.meta.url)), "out");
const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf",
  ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".ico": "image/x-icon",
  ".txt": "text/plain", ".xml": "application/xml", ".glb": "model/gltf-binary",
  ".vrm": "application/octet-stream", ".webmanifest": "application/manifest+json",
};

async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidates = [
    join(ROOT, clean),
    join(ROOT, clean + ".html"),
    join(ROOT, clean, "index.html"),
  ];
  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const file = (await resolve(req.url)) || join(ROOT, "404.html");
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(3000, () => console.log("prod export on http://localhost:3000"));
