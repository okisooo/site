// Second pass: WHY is style recalc firing? Captures invalidation-tracking events
// (reason + changed attribute/class) and JS stack traces attached to recalcs.
//
// usage: node profile-invalidation.mjs <path> [durationMs] [injectFile]

import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROUTE = process.argv[2] || "/rouge-noir";
const SCROLL_MS = Number(process.argv[3] || 6000);
const INJECT = process.argv[4] && existsSync(process.argv[4]) ? readFileSync(process.argv[4], "utf8") : null;
const LABEL = process.argv[5] || "baseline";
const PORT = 9334;
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ORIGIN = "http://localhost:3000";

const profileDir = mkdtempSync(join(tmpdir(), "cdp-inv-"));
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profileDir}`,
  "--no-first-run", "--no-default-browser-check", "--disable-extensions",
  "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
  "--window-size=1440,900", "--window-position=0,0", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const t = (await r.json()).find((x) => x.type === "page");
      if (t?.webSocketDebuggerUrl) return t.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("no devtools endpoint");
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map();
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
      } else if (m.method) (this.handlers.get(m.method) || []).forEach((h) => h(m.params));
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => this.pending.set(id, { resolve: res, reject: rej }));
  }
  on(m, h) { if (!this.handlers.has(m)) this.handlers.set(m, []); this.handlers.get(m).push(h); }
}

const ws = new WebSocket(await getWsUrl());
await new Promise((r) => (ws.onopen = r));
const cdp = new CDP(ws);
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");

if (INJECT) await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: INJECT });

await cdp.send("Page.navigate", { url: ORIGIN + ROUTE });
await new Promise((resolve) => {
  const t = setTimeout(resolve, 25000);
  cdp.on("Page.loadEventFired", () => { clearTimeout(t); resolve(); });
});
await sleep(6000);

const events = [];
cdp.on("Tracing.dataCollected", (p) => events.push(...p.value));

await cdp.send("Tracing.start", {
  transferMode: "ReportEvents",
  traceConfig: {
    recordMode: "recordAsMuchAsPossible",
    includedCategories: [
      "devtools.timeline",
      "disabled-by-default-devtools.timeline",
      "disabled-by-default-devtools.timeline.invalidationTracking",
      "disabled-by-default-devtools.timeline.stack",
    ],
  },
});

const t0 = Date.now();
while (Date.now() - t0 < SCROLL_MS) {
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseWheel", x: 720, y: 450, deltaX: 0, deltaY: 100, pointerType: "mouse",
  });
  await sleep(32);
}
await sleep(1000);
await cdp.send("Tracing.end");
await new Promise((r) => cdp.on("Tracing.tracingComplete", r));

// ---- aggregate invalidation reasons ----
const reasons = new Map();      // reason -> count
const changed = new Map();      // "attr:foo" / "class:bar" / "id:x" -> count
const nodes = new Map();        // nodeName -> count
const stacks = new Map();       // top JS frame -> {count, ms}
let recalcMs = 0, recalcN = 0, recalcEls = 0;

const bump = (map, key, by = 1) => map.set(key, (map.get(key) || 0) + by);

for (const e of events) {
  const d = e.args?.data;
  if (/InvalidationTracking/.test(e.name) && d) {
    bump(reasons, `${e.name.replace("Tracking", "")}::${d.reason || "?"}`);
    if (d.changedAttribute) bump(changed, `attr:${d.changedAttribute}`);
    if (d.changedClass) bump(changed, `class:${d.changedClass}`);
    if (d.changedId) bump(changed, `id:${d.changedId}`);
    if (d.nodeName) bump(nodes, String(d.nodeName).slice(0, 60));
  }
  if (e.name === "UpdateLayoutTree" && e.ph === "X") {
    recalcN++; recalcMs += e.dur / 1000;
    recalcEls += e.args?.beginData?.elementCount ?? e.args?.elementCount ?? 0;
    const st = e.args?.beginData?.stackTrace;
    if (st?.length) {
      const f = st[0];
      const key = `${f.functionName || "(anon)"} @ ${String(f.url || "").split("/").slice(-1)[0]}:${f.lineNumber}`;
      const cur = stacks.get(key) || { count: 0, ms: 0 };
      cur.count++; cur.ms += e.dur / 1000;
      stacks.set(key, cur);
    }
  }
}

const topN = (m, n = 12, mapper = (v) => v) =>
  [...m.entries()].sort((a, b) => (mapper(b[1]) - mapper(a[1]))).slice(0, n);

const out = {
  label: LABEL,
  route: ROUTE,
  scrollMs: SCROLL_MS,
  recalc: { n: recalcN, totalMs: +recalcMs.toFixed(1), elements: recalcEls },
  invalidationReasons: topN(reasons),
  changedThings: topN(changed),
  invalidatedNodes: topN(nodes),
  forcedRecalcStacks: topN(stacks, 12, (v) => v.ms).map(([k, v]) => [k, v.count, +v.ms.toFixed(1)]),
};

writeFileSync(join(process.env.PROF_OUT || profileDir, `inv-${LABEL}.json`), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
ws.close(); chrome.kill(); process.exit(0);
