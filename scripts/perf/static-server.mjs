// Serves the Next static export in D:/GitHub/site/out on :3000 so the
// production bundle can be profiled the same way the dev server was.
import { createServer } from "node:http";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join, extname, resolve as resolvePath, sep } from "node:path";

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
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    join(ROOT, clean),
    join(ROOT, clean + ".html"),
    join(ROOT, clean, "index.html"),
  ];
  for (const c of candidates) {
    const target = resolvePath(c);
    if (target !== resolvePath(ROOT) && !target.startsWith(resolvePath(ROOT) + sep)) continue;
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') return res.writeHead(405).end();
    const found = await resolve(req.url || '/');
    const file = found || join(ROOT, "404.html");
    const { size } = await stat(file);
    const headers = {
      "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
      "Accept-Ranges": "bytes",
    };
    let start = 0, end = size - 1, status = found ? 200 : 404;
    if (found && req.headers.range) {
      const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!range || Number(range[1]) >= size || (range[2] && Number(range[2]) < Number(range[1]))) {
        return res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end();
      }
      start = Number(range[1]);
      end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
    }
    headers['Content-Length'] = end - start + 1;
    res.writeHead(status, headers);
    if (req.method === 'HEAD' || size === 0) return res.end();
    createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
  } catch {
    res.writeHead(400).end("invalid request");
  }
}).listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => console.log(`prod export on http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`));
