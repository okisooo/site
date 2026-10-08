// Read-only regression crawl of canonical URL variants, including future sitemap pages.
import { writeFile } from 'node:fs/promises';
import { isAbsolute } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { releaseRedirects } from '../src/data/releaseRedirects.ts';

const args = process.argv.slice(2);
const outputIndex = args.indexOf('--output');
const output = args[outputIndex + 1];
if (outputIndex < 0 || !output || !isAbsolute(output)) throw new Error('Provide --output with an absolute report path.');
const origin = 'https://okiso.net';
const hosts = ['okiso.net', 'www.okiso.net', 'oki.so', 'www.oki.so']
  .flatMap(host => [`https://${host}`, `http://${host}`]);
const query = '?url_check=1%2F2&keep=yes';
const sitemap = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(30000) });
if (!sitemap.ok) throw new Error(`Sitemap HTTP ${sitemap.status}`);
const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1].replace(/&amp;/g, '&'));
if (!urls.length || urls.some(url => new URL(url).origin !== origin)) throw new Error('Sitemap has missing or noncanonical URLs.');
const checks = [];
for (const canonical of urls) {
  const pathname = new URL(canonical).pathname;
  const clean = pathname === '/' ? origin + '/' : origin + pathname;
  const variants = pathname === '/' ? ['/index', '/index/', '/index.html', '/index.html/'] :
    [pathname + '/', pathname + '.html', pathname + '.html/', pathname + '/index.html', pathname + '/index.html/'];
  for (const host of hosts) {
    for (const variant of [pathname, ...variants]) {
      if (host === origin && variant === pathname) continue;
      checks.push({ url: host + variant + query, target: clean + query, kind: 'redirect' });
    }
  }
}
checks.push({ url: origin + '/url-regression-missing-20261009/', status: 404, kind: 'missing' });
const aliases = { '/cursors': '/cursor', ...Object.fromEntries(Object.entries(releaseRedirects)
  .map(([previous, current]) => [`/releases/${previous}`, `/releases/${current}`])) };
for (const [previous, current] of Object.entries(aliases)) {
  const target = origin + current;
  if (!urls.includes(target)) throw new Error(`Legacy URL points outside the sitemap: ${target}`);
  for (const host of [origin, 'https://oki.so']) {
    for (const pathname of [previous, previous + '/']) checks.push({ url: host + pathname, target, kind: 'legacy' });
  }
}
for (const url of ['https://auth.okiso.net/', 'https://api.okiso.net/', 'https://auth.oki.so/',
  'https://api.oki.so/', origin + '/manifest.webmanifest']) checks.push({ url, kind: 'excluded' });
const results = new Array(checks.length);
let index = 0;
await Promise.all(Array.from({ length: 2 }, async () => {
  while (index < checks.length) {
    const position = index++;
    const check = checks[position];
    await delay(75);
    try {
      let response;
      let retries = 0;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await fetch(check.url, { method: check.kind === 'legacy' ? 'GET' : 'HEAD',
            redirect: check.kind === 'redirect' ? 'manual' : 'follow', signal: AbortSignal.timeout(20000) });
          break;
        } catch (error) {
          if (attempt === 1) throw error;
          retries++;
          await delay(500);
        }
      }
      const location = response.headers.get('location');
      const robots = response.headers.get('x-robots-tag');
      const body = check.kind === 'legacy' ? await response.text() : '';
      const passed = check.kind === 'excluded' ? response.status === 200 && /\bnoindex\b/i.test(robots ?? '') :
        check.kind === 'legacy' ? response.status === 200 &&
        body.includes(`<link rel="canonical" href="${check.target}">`) &&
        body.includes(`<meta http-equiv="refresh" content="0; url=${check.target}">`) :
        check.kind === 'missing' ? response.status === check.status :
        [301, 308].includes(response.status) && location === check.target;
      results[position] = { ...check, actualStatus: response.status, location, robots, retries, passed };
    } catch (error) { results[position] = { ...check, error: String(error),
      cause: error.cause?.errors?.map(cause => ({ code: cause.code, message: cause.message })) ?? String(error.cause ?? ''), passed: false }; }
  }
}));
const failures = results.filter(result => !result.passed);
const report = { checkedAt: new Date().toISOString(), sitemapPages: urls.length, checks: results.length, failures: failures.length, results };
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: urls.length, checks: results.length, failures: failures.length, examples: failures.slice(0, 8), output }, null, 2));
if (failures.length) process.exitCode = 1;
