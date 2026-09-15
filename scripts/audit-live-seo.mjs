// Read-only crawl of the public static site. Reports are written only to --output.
import { writeFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const option = (name) => args[args.indexOf(name) + 1];
const origin = args.includes('--origin') ? option('--origin').replace(/\/$/, '') : 'https://okiso.net';
const output = args.includes('--output') ? option('--output') : undefined;
if (!output) throw new Error('Provide --output with an absolute report path.');
const canonicalOrigin = 'https://okiso.net';
const decode = (s = '') => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attributes(m[0]));
async function request(url, method = 'GET') {
  try {
    const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    return { url, finalUrl: res.url, status: res.status, headers: Object.fromEntries(res.headers), body: method === 'GET' ? await res.text() : '' };
  } catch (error) { return { url, error: String(error), status: 0, body: '', headers: {} }; }
}
async function pool(items, fn) {
  const result = new Array(items.length);
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (index < items.length) { const i = index++; result[i] = await fn(items[i]); }
  }));
  return result;
}
const sitemap = await request(`${origin}/sitemap.xml`);
const robots = await request(`${origin}/robots.txt`);
const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1]));
if (!urls.length) throw new Error(`No sitemap URLs: HTTP ${sitemap.status}`);
const pages = await pool(urls, async (canonical) => {
  const path = new URL(canonical).pathname;
  const res = await request(origin + path);
  const html = res.body;
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const metas = tags(html, 'meta');
  const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return { invalid: true }; } });
  const nodes = ld.flatMap((data) => data['@graph'] ?? [data]);
  return {
    path, status: res.status, finalUrl: res.finalUrl, error: res.error,
    bytes: Buffer.byteLength(html), canonical: tags(html, 'link').filter((a) => a.rel === 'canonical').map((a) => a.href),
    titles: [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((m) => decode(m[1])),
    descriptions: metas.filter((a) => a.name === 'description').map((a) => a.content),
    robots: metas.filter((a) => a.name === 'robots').map((a) => a.content),
    h1: [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]*>/g, ' ').trim()),
    types: nodes.map((n) => n['@type']), structuredData: ld,
    links: [...new Set(tags(markup, 'a').map((a) => a.href).filter(Boolean))],
    images: tags(markup, 'img').map(({ src, alt, width, height, loading, fetchPriority, fetchpriority }) => ({ src, alt, width, height, loading, priority: fetchPriority || fetchpriority })),
    socialImages: metas.filter((a) => a.property === 'og:image').map((a) => a.content),
    scripts: tags(html, 'script').map((a) => a.src).filter(Boolean),
    styles: tags(html, 'link').filter((a) => a.rel === 'stylesheet').map((a) => a.href),
  };
});
const issues = [];
const check = (ok, path, message) => { if (!ok) issues.push({ path, message }); };
for (const page of pages) {
  const expected = canonicalOrigin + (page.path === '/' ? '' : page.path);
  check(page.status === 200, page.path, `HTTP ${page.status}`);
  check(page.canonical.length === 1 && page.canonical[0] === expected, page.path, 'Unexpected canonical');
  check(page.titles.length === 1 && page.titles[0], page.path, 'Missing/duplicate title');
  check(page.descriptions.length === 1 && page.descriptions[0], page.path, 'Missing/duplicate description');
  check(page.h1.length === 1, page.path, 'Missing/duplicate primary heading');
  check(!page.robots.some((r) => /noindex/i.test(r)), page.path, 'Sitemap URL is noindex');
  check(!page.structuredData.some((d) => d.invalid), page.path, 'Invalid JSON-LD');
  check(page.images.every((img) => img.alt !== undefined), page.path, 'Image missing alt attribute');
}
for (const field of ['titles', 'descriptions']) {
  const groups = new Map();
  for (const page of pages) { const value = page[field][0]; groups.set(value, [...(groups.get(value) ?? []), page.path]); }
  for (const [value, paths] of groups) if (paths.length > 1) issues.push({ paths, message: `Duplicate ${field}`, value });
}
const assets = new Set();
const linkedPages = new Set();
for (const page of pages) {
  for (const href of page.links) {
    const url = new URL(href, canonicalOrigin + page.path);
    if (url.origin === canonicalOrigin) { url.hash = ''; url.search = ''; linkedPages.add(url.pathname); }
  }
  for (const src of [...page.images.map((i) => i.src), ...page.socialImages, ...page.scripts, ...page.styles]) {
    if (!src || src.startsWith('data:')) continue;
    const url = new URL(src, canonicalOrigin + page.path);
    if (url.origin === canonicalOrigin) assets.add(url.pathname);
  }
}
const resources = await pool([...new Set([...assets, ...linkedPages])], async (path) => {
  const res = await request(origin + path, 'HEAD');
  check(res.status === 200, path, `Linked resource HTTP ${res.status}`);
  return { path, status: res.status, bytes: Number(res.headers['content-length']) || null, type: res.headers['content-type'], cache: res.headers['cache-control'], error: res.error };
});
const excluded = await pool(['/vault', '/lab/releases', '/lab/soft-orbit', '/api/auth/callback', '/seo-audit-missing-20260915'], async (path) => {
  const res = await request(origin + path);
  const noindex = tags(res.body, 'meta').some((a) => a.name === 'robots' && /noindex/i.test(a.content));
  check(path.startsWith('/seo-audit-missing') ? res.status === 404 : noindex, path, 'Missing 404/noindex protection');
  return { path, status: res.status, noindex };
});
const report = { checkedAt: new Date().toISOString(), origin, summary: { pages: pages.length, resources: resources.length, issues: issues.length }, issues, robots: { status: robots.status, body: robots.body }, sitemap: { status: sitemap.status, urls }, pages, resources, excluded };
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report.summary, issues, largestAssets: resources.filter((r) => assets.has(r.path)).sort((a, b) => b.bytes - a.bytes).slice(0, 8), report: output }, null, 2));
if (issues.length) process.exitCode = 1;
