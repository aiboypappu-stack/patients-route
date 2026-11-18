#!/usr/bin/env node
// Page weight on first load and first text under DevTools "Slow 3G" (2,000 ms latency, 50 KB/s).
// Usage: node scripts/perf.mjs [--base=URL]
import { chromium } from 'playwright';
const arg = process.argv.find((a) => a.startsWith('--base='));
const BASE = arg ? arg.slice(7) : 'http://localhost:8770/patients-route/';

const b = await chromium.launch();
async function run(lang, throttle) {
  const ctx = await b.newContext({ viewport: { width: 360, height: 740 }, locale: lang === 'hi' ? 'hi-IN' : 'en-IN' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (throttle) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 2000, downloadThroughput: 50 * 1024, uploadThroughput: 50 * 1024 });
  const sizes = {};
  cdp.on('Network.loadingFinished', (e) => { sizes[e.requestId] = e.encodedDataLength; });
  const urls = {};
  cdp.on('Network.responseReceived', (e) => { urls[e.requestId] = e.response.url; });
  const t0 = Date.now();
  await page.goto(BASE + '?lang=' + lang, { waitUntil: 'commit' });
  await page.waitForFunction(() => document.querySelector('.bigtitle') && document.querySelector('.bigtitle').getBoundingClientRect().height > 0, null, { timeout: 60000 });
  const fcp = await page.evaluate(() => new Promise((res) => {
    new PerformanceObserver((l) => { const e = l.getEntries().find((x) => x.name === 'first-contentful-paint'); if (e) res(e.startTime); }).observe({ type: 'paint', buffered: true });
    setTimeout(() => res(null), 5000);
  }));
  await page.waitForSelector('[data-act="begin"]', { timeout: 60000 });
  const story = Date.now() - t0;
  await page.waitForLoadState('networkidle');
  let total = 0, fonts = 0;
  const rows = [];
  for (const [id, n] of Object.entries(sizes)) { total += n; if (/woff2/.test(urls[id] || '')) fonts += n; rows.push(`${(urls[id] || id).replace(BASE, '')}: ${(n / 1024).toFixed(1)} KB`); }
  await ctx.close();
  return { fcp: fcp && Math.round(fcp), story, total, fonts, rows };
}
for (const lang of ['hi', 'en']) {
  const w = await run(lang, false);
  const s = await run(lang, true);
  console.log(`[${lang}] transfer: ${(w.total / 1024).toFixed(1)} KB total, ${((w.total - w.fonts) / 1024).toFixed(1)} KB without fonts`);
  console.log('   ' + w.rows.join('\n   '));
  console.log(`[${lang}] Slow 3G: first contentful paint (title text) ${s.fcp} ms; full start screen ${s.story} ms`);
}
await b.close();
