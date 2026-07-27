// Real CDP scroll profiler for okiso.net.
// Headed Chrome (headless starves rAF -> useless frame timings).
// Drives synthetic wheel events, records devtools.timeline, aggregates by event.
//
// usage: node profile-scroll.mjs <path> [durationMs]

import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROUTE = process.argv[2] || "/rouge-noir";
const SCROLL_MS = Number(process.argv[3] || 8000);
const INJECT = process.argv[4] && existsSync(process.argv[4]) ? readFileSync(process.argv[4], "utf8") : null;
const LABEL = process.argv[5] || "baseline";
const PORT = 9333;
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ORIGIN = "http://localhost:3000";

const profileDir = mkdtempSync(join(tmpdir(), "cdp-prof-"));

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profileDir}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--disable-background-timer-throttling",
  "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
  "--window-size=1440,900",
  "--window-position=0,0",
  "about:blank",
], { stdio: "ignore", detached: false });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("chrome devtools endpoint never came up");
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        (this.handlers.get(msg.method) || []).forEach((h) => h(msg.params));
      }
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  on(method, handler) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(handler);
  }
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
const cdp = new CDP(ws);

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Network.enable");

if (INJECT) await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: INJECT });

// --- load route, let it settle ---
await cdp.send("Page.navigate", { url: ORIGIN + ROUTE });
await new Promise((resolve) => {
  const t = setTimeout(resolve, 25000);
  cdp.on("Page.loadEventFired", () => { clearTimeout(t); resolve(); });
});
await sleep(6000); // dev compile + fonts + GSAP chunk + preloader

const pageHeight = await cdp.send("Runtime.evaluate", {
  expression: "document.documentElement.scrollHeight",
  returnByValue: true,
});

// --- trace ---
const events = [];
cdp.on("Tracing.dataCollected", (p) => events.push(...p.value));

await cdp.send("Tracing.start", {
  transferMode: "ReportEvents",
  traceConfig: {
    recordMode: "recordAsMuchAsPossible",
    includedCategories: [
      "devtools.timeline",
      "disabled-by-default-devtools.timeline",
      "disabled-by-default-devtools.timeline.frame",
      "blink.user_timing",
      "latencyInfo",
      "v8.execute",
    ],
  },
});

const started = Date.now();
let y = 0;
while (Date.now() - started < SCROLL_MS) {
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x: 720,
    y: 450,
    deltaX: 0,
    deltaY: 100,
    pointerType: "mouse",
  });
  y += 100;
  await sleep(32); // ~31 wheel ticks/sec, close to a real trackpad/mouse burst
}
await sleep(1200); // let lenis settle

await cdp.send("Tracing.end");
await new Promise((resolve) => cdp.on("Tracing.tracingComplete", resolve));

// --- aggregate ---
const byName = new Map();
const longTasks = [];
const drawFrames = [];
const styleRecalcs = [];
const layouts = [];

for (const e of events) {
  if (e.ph === "X" && typeof e.dur === "number") {
    const ms = e.dur / 1000;
    const cur = byName.get(e.name) || { count: 0, total: 0, max: 0 };
    cur.count++;
    cur.total += ms;
    cur.max = Math.max(cur.max, ms);
    byName.set(e.name, cur);
    if (e.name === "RunTask" && ms > 50) longTasks.push({ ms, ts: e.ts });
    if (e.name === "UpdateLayoutTree") {
      styleRecalcs.push({ ms, n: e.args?.beginData?.elementCount ?? e.args?.elementCount ?? null });
    }
    if (e.name === "Layout") {
      layouts.push({ ms, dirty: e.args?.beginData?.dirtyObjects ?? null, total: e.args?.beginData?.totalObjects ?? null });
    }
  }
  if (e.name === "DrawFrame" || e.name === "Commit") drawFrames.push(e.ts);
}

drawFrames.sort((a, b) => a - b);
const deltas = [];
for (let i = 1; i < drawFrames.length; i++) {
  const d = (drawFrames[i] - drawFrames[i - 1]) / 1000;
  if (d > 0 && d < 2000) deltas.push(d);
}
deltas.sort((a, b) => a - b);
const pct = (p) => (deltas.length ? deltas[Math.floor((deltas.length - 1) * p)] : null);

const top = [...byName.entries()]
  .sort((a, b) => b[1].total - a[1].total)
  .slice(0, 28)
  .map(([name, v]) => ({ name, count: v.count, totalMs: +v.total.toFixed(1), maxMs: +v.max.toFixed(2) }));

const report = {
  label: LABEL,
  route: ROUTE,
  scrollMs: SCROLL_MS,
  scrollHeight: pageHeight.result?.value,
  traceEvents: events.length,
  frames: {
    n: deltas.length,
    p50: pct(0.5),
    p75: pct(0.75),
    p95: pct(0.95),
    p99: pct(0.99),
    worst: deltas[deltas.length - 1] ?? null,
    over16_7: deltas.filter((d) => d > 16.7).length,
    over33: deltas.filter((d) => d > 33).length,
  },
  longTasks: { n: longTasks.length, worstMs: longTasks.reduce((m, t) => Math.max(m, t.ms), 0) },
  styleRecalc: {
    n: styleRecalcs.length,
    totalMs: +styleRecalcs.reduce((s, r) => s + r.ms, 0).toFixed(1),
    maxMs: +Math.max(0, ...styleRecalcs.map((r) => r.ms)).toFixed(2),
    maxElements: Math.max(0, ...styleRecalcs.map((r) => r.n || 0)),
    totalElements: styleRecalcs.reduce((s, r) => s + (r.n || 0), 0),
  },
  layout: {
    n: layouts.length,
    totalMs: +layouts.reduce((s, r) => s + r.ms, 0).toFixed(1),
    maxMs: +Math.max(0, ...layouts.map((r) => r.ms)).toFixed(2),
    maxDirty: Math.max(0, ...layouts.map((r) => r.dirty || 0)),
  },
  topEvents: top,
};

const out = join(process.env.PROF_OUT || profileDir, `trace-${ROUTE.replace(/\W+/g, "_")}-${LABEL}.json`);
writeFileSync(out, JSON.stringify({ report, rawCount: events.length }, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log("\nreport written:", out);

ws.close();
chrome.kill();
process.exit(0);
