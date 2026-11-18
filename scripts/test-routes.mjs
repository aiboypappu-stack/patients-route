#!/usr/bin/env node
// Plays every route in both languages with Playwright (360x740) and checks the result.
// Usage:
//   node scripts/test-routes.mjs                      (local server on :8770, all routes, screenshots)
//   node scripts/test-routes.mjs --base=https://x.github.io/patients-route/ --one --no-shots
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const BASE = args.base || 'http://localhost:8770/patients-route/';
const ONE = !!args.one;
const SHOTS = !args['no-shots'];
const shotDir = join(root, 'qa', 'screenshots');
mkdirSync(shotDir, { recursive: true });

const J = JSON.parse(readFileSync(join(root, 'content', 'journey.json'), 'utf8'));
const W = J.meta.wage_basis.daily_wage_inr;

// Enumerate routes as lists of choice indices.
const routes = [];
(function dfs(id, state, picks, trail) {
  J.nodes[id].choices.forEach((c, i) => {
    const s = { ...state, ...(c.set || {}) };
    if (c.next === 'ending') routes.push({ picks: [...picks, i], state: s, trail: [...trail, id] });
    else dfs(c.next, s, [...picks, i], [...trail, id]);
  });
})(J.start, {}, [], []);

const failures = [];
const log = (m) => console.log(m);
const fail = (m) => { failures.push(m); console.log('FAIL ' + m); };
const shotsTaken = new Set();

async function shot(page, name) {
  if (!SHOTS || shotsTaken.has(name)) return;
  shotsTaken.add(name);
  await page.waitForTimeout(260);
  await page.screenshot({ path: join(shotDir, name + '.png'), fullPage: true });
}

async function checkLayout(page, label) {
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    if (document.documentElement.scrollWidth > vw + 1) bad.push(`page scrollWidth ${document.documentElement.scrollWidth} > ${vw}`);
    for (const el of document.querySelectorAll('#screen *, .topbar *, .foot *')) {
      const b = el.getBoundingClientRect();
      if (!b.width || getComputedStyle(el).visibility === 'hidden') continue;
      if (b.right > vw + 1 || b.left < -1) bad.push(`${el.tagName.toLowerCase()}.${el.className} right=${Math.round(b.right)}`);
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'hidden' && !el.classList.contains('brand') && !el.classList.contains('clock-bar') && !el.classList.contains('langtoggle')) bad.push(`clipped ${el.tagName}.${el.className}`);
    }
    // Tap targets
    for (const el of document.querySelectorAll('#screen button, #screen a, .foot a, .topbar button')) {
      const b = el.getBoundingClientRect();
      if (!b.width) continue;
      const big = el.classList.contains('ref') ? 28 : 44;
      if (b.height < big - 0.5) bad.push(`small target ${el.tagName}.${el.className} h=${Math.round(b.height)} "${el.textContent.slice(0, 20)}"`);
    }
    return bad.slice(0, 5);
  });
  if (r.length) fail(`${label}: layout: ${r.join('; ')}`);
}

async function newPage(browser, lang) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, locale: lang === 'hi' ? 'hi-IN' : 'en-IN', hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push('request failed ' + r.url()));
  page.on('request', (r) => { const u = new URL(r.url()); if (u.origin !== new URL(BASE).origin) errors.push('external request ' + r.url()); });
  return { ctx, page, errors };
}

async function playRoute(browser, lang, route, ri) {
  const { ctx, page, errors } = await newPage(browser, lang);
  const label = `[${lang}] route ${ri} ${route.trail.join('>')} (${route.state.path}${route.state.path !== 'death' ? ' ' + (route.state.card ? 'card' : 'nocard') + '_' + route.state.hospital : ''})`;
  await page.goto(BASE + '?lang=' + lang);
  await page.waitForSelector('[data-act="begin"]');
  if ((await page.getAttribute('html', 'lang')) !== lang) fail(`${label}: html lang not ${lang}`);
  await checkLayout(page, label + ' start');
  await shot(page, `${lang}-01-start`);
  await page.click('[data-act="begin"]');
  let id = J.start;
  for (const [k, i] of route.picks.entries()) {
    await page.waitForSelector('[data-act="choose"]');
    const scene = (await page.textContent('h2.scene')).trim();
    if (scene !== J.nodes[id].scene[lang]) fail(`${label}: expected scene ${J.nodes[id].scene[lang]} got ${scene}`);
    const hasClock = await page.$('.clock');
    if (!!hasClock !== (J.nodes[id].clock_min != null)) fail(`${label}: clock visibility wrong at ${id}`);
    await checkLayout(page, `${label} @${id}`);
    await shot(page, `${lang}-node-${id}`);
    if (J.system_fixes[id] && !shotsTaken.has(`${lang}-fixes-${id}`)) {
      const d = await page.$('details.fixes');
      if (!d) fail(`${label}: no fixes panel at ${id}`);
      else if (SHOTS && ['symptoms', 'chc', 'gwalior_hospital'].includes(id)) {
        await page.click('details.fixes > summary');
        await shot(page, `${lang}-fixes-${id}`);
        await page.click('details.fixes > summary');
      }
    }
    const c = J.nodes[id].choices[i];
    await page.click(`[data-act="choose"][data-i="${i}"]`);
    id = c.next;
  }
  await page.waitForSelector('[data-ending]');
  const ending = await page.getAttribute('[data-ending]', 'data-ending');
  if (ending !== route.state.path) fail(`${label}: ending ${ending} != ${route.state.path}`);
  const title = (await page.textContent('.ending-title')).trim();
  if (title !== J.endings[route.state.path].title[lang]) fail(`${label}: wrong ending title`);
  const n = J.endings[ending].stat.survivors_per_100;
  if (typeof n === 'number') {
    const filled = await page.$$eval('.grid100 use[fill="#D4502A"]', (x) => x.length);
    const all = await page.$$eval('.grid100 use', (x) => x.length);
    if (filled !== n || all !== 100) fail(`${label}: grid ${filled}/${all}, expected ${n}/100`);
  } else if (await page.$('.grid100')) fail(`${label}: grid shown for death`);
  if (ending === 'death') {
    if (await page.$('#costs')) fail(`${label}: costs shown on death ending`);
    const open = await page.$eval('details.fixes', (d) => d.open).catch(() => false);
    if (!open) fail(`${label}: road_late fixes not open on death ending`);
  } else {
    const key = `${route.state.card ? 'card' : 'nocard'}_${route.state.hospital}`;
    const c = await page.$eval('#costs', (el) => ({
      key: el.dataset.scenario, min: +el.dataset.totalMin, max: +el.dataset.totalMax, days: +el.dataset.days,
      rows: [...el.querySelectorAll('.cost-row')].map((r) => ({ line: r.dataset.line, min: +r.dataset.min, max: +r.dataset.max })),
      wageText: el.querySelector('.wage').textContent
    }));
    if (c.key !== key) fail(`${label}: cost scenario ${c.key} != ${key}`);
    const want = J.costs.scenarios[key];
    if (c.rows.map((r) => r.line).join() !== want.join()) fail(`${label}: cost lines mismatch`);
    const sMin = c.rows.reduce((a, r) => a + r.min, 0), sMax = c.rows.reduce((a, r) => a + r.max, 0);
    if (sMin !== c.min || sMax !== c.max) fail(`${label}: total ${c.min}-${c.max} != sum ${sMin}-${sMax}`);
    for (const r of c.rows) { const l = J.costs.lines[r.line]; if (l.min !== r.min || l.max !== r.max) fail(`${label}: line ${r.line} value changed`); }
    if (c.days !== Math.ceil(sMax / W) || !c.wageText.includes(String(c.days))) fail(`${label}: wage days ${c.days} != ceil(${sMax}/${W})`);
  }
  // Route recap length = number of choices made.
  const recap = await page.$$eval('.route li', (x) => x.length);
  if (recap !== route.picks.length) fail(`${label}: recap ${recap} != ${route.picks.length}`);
  await checkLayout(page, label + ' ending');
  const endShot = `${lang}-ending-${ending}${ending === 'death' ? '' : '-' + (route.state.card ? 'card' : 'nocard') + '_' + route.state.hospital}`;
  await shot(page, endShot);

  // Better route opens from every ending.
  await page.click('[data-act="better"]');
  await page.waitForSelector('.illus');
  const brTitle = (await page.textContent('h2.scene')).trim();
  if (brTitle !== J.better_route.label[lang]) fail(`${label}: better route did not open`);
  if (!shotsTaken.has(`${lang}-better-0-intro`) || ri === 0) {
    await shot(page, `${lang}-better-0-intro`);
    for (let s = 1; s <= J.better_route.steps.length + 2; s++) {
      await page.click('[data-act="bnext"]');
      await page.waitForTimeout(30);
      await checkLayout(page, `${label} better ${s}`);
      await shot(page, `${lang}-better-${s}-${s <= J.better_route.steps.length ? 'step' : s === J.better_route.steps.length + 1 ? 'outcome' : 'compare-' + ending}`);
    }
  } else {
    for (let s = 1; s <= J.better_route.steps.length + 2; s++) await page.click('[data-act="bnext"]');
    await checkLayout(page, `${label} compare`);
    await shot(page, `${lang}-better-7-compare-${ending}`);
  }
  const yours = (await page.textContent('[data-yours-treat]')).trim();
  if (ending === 'death' && yours !== (lang === 'hi' ? 'कभी नहीं' : 'Never')) fail(`${label}: compare should say never, got ${yours}`);
  // Browser Back goes back through screens, not out of the site.
  await page.goBack();
  await page.waitForTimeout(50);
  if (!(await page.$('.illus'))) fail(`${label}: Back did not return to previous better-route screen`);
  if (ri === 0) {
    for (let s = 0; s < J.better_route.steps.length + 2; s++) await page.goBack();
    await page.waitForSelector('[data-ending]');
    // Lessons, playbook.
    await page.click('[data-act="lessons"]');
    await page.waitForSelector('.lesson');
    if ((await page.$$('.lesson')).length !== 5) fail(`${label}: lessons count`);
    await checkLayout(page, label + ' lessons');
    await shot(page, `${lang}-lessons`);
    await page.click('[data-act="playbook"]');
    await page.waitForSelector('.pb-group');
    if (!page.url().endsWith('#playbook')) fail(`${label}: playbook URL has no #playbook`);
    await checkLayout(page, label + ' playbook');
    await shot(page, `${lang}-playbook`);
    // Source sheet: open, Escape closes, focus returns.
    const ref = await page.$('.ref');
    await ref.click();
    await page.waitForSelector('dialog#sheet[open]');
    await shot(page, `${lang}-source-sheet`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(50);
    if (await page.$('dialog#sheet[open]')) fail(`${label}: Escape did not close sheet`);
    const focusedRef = await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('ref'));
    if (!focusedRef) fail(`${label}: focus did not return to ref after closing sheet`);
    await page.click('.foot [data-go="sources"]');
    await page.waitForSelector('.src');
    const nSrc = await page.$$eval('.src', (x) => x.length);
    if (nSrc !== Object.keys(J.sources).length) fail(`${label}: sources ${nSrc} != ${Object.keys(J.sources).length}`);
    await checkLayout(page, label + ' sources');
    await shot(page, `${lang}-sources`);
    // Language toggle keeps your place.
    await page.goBack();
    await page.waitForSelector('.pb-group');
    const other = lang === 'hi' ? 'en' : 'hi';
    await page.click(`#langtoggle [data-lang="${other}"]`);
    if ((await page.getAttribute('html', 'lang')) !== other || !(await page.$('.pb-group'))) fail(`${label}: toggle lost place`);
    if (!page.url().includes('lang=' + other)) fail(`${label}: toggle did not update URL`);
  }
  if (errors.length) fail(`${label}: console/network errors: ${errors.join(' | ')}`);
  await ctx.close();
}

const browser = await chromium.launch();
const t0 = Date.now();
const list = ONE ? [routes[0], routes.find((r) => r.state.path === 'death')] : routes;
for (const lang of ['hi', 'en']) {
  // Language screen and #playbook deep link.
  {
    const { ctx, page, errors } = await newPage(browser, lang);
    await page.goto(BASE);
    await page.waitForSelector('[data-act="lang"]');
    const sugg = await page.getAttribute('.btn-lang.suggested', 'data-lang');
    if (sugg !== lang) fail(`[${lang}] language screen suggested ${sugg}`);
    await shot(page, `${lang}-00-language`);
    await page.click(`[data-act="lang"][data-lang="${lang}"]`);
    await page.waitForSelector('[data-act="begin"]');
    if (!page.url().includes('lang=' + lang)) fail(`[${lang}] lang not in URL`);
    await page.goBack();
    await page.waitForSelector('[data-act="lang"]');
    await page.goto(BASE + '?lang=' + lang + '#playbook');
    await page.waitForSelector('.pb-group');
    const t = (await page.textContent('h2.scene')).trim();
    if (t !== J.playbook.title[lang]) fail(`[${lang}] #playbook did not open playbook`);
    if (errors.length) fail(`[${lang}] errors: ${errors.join(' | ')}`);
    await ctx.close();
  }
  for (const [ri, r] of list.entries()) await playRoute(browser, lang, r, ri);
}
// Failed journey.json load shows the bilingual error with Retry.
{
  const { ctx, page } = await newPage(browser, 'hi');
  let block = true;
  await page.route('**/journey.json', (route) => (block ? route.abort() : route.continue()));
  await page.goto(BASE + '?lang=hi');
  await page.waitForSelector('#retry-load');
  await shot(page, 'error-load');
  block = false;
  await page.click('#retry-load');
  await page.waitForSelector('[data-act="begin"]');
  log('load-error + retry: ok');
  await ctx.close();
}
await browser.close();
const summary = `${list.length} routes x 2 languages in ${((Date.now() - t0) / 1000).toFixed(1)} s against ${BASE}; ${shotsTaken.size} screenshots; ${failures.length} failure(s)`;
log(summary);
writeFileSync(join(root, 'qa', ONE ? 'test-live.txt' : 'test-local.txt'), summary + '\n' + failures.join('\n') + '\n');
process.exit(failures.length ? 1 : 0);
