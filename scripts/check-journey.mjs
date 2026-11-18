#!/usr/bin/env node
// Validates content/journey.json (and site/journey.json if present).
// Usage: node scripts/check-journey.mjs
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'content', 'journey.json');
const sitePath = join(root, 'site', 'journey.json');
const raw = readFileSync(srcPath, 'utf8');
const j = JSON.parse(raw);

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

if (existsSync(sitePath) && readFileSync(sitePath, 'utf8') !== raw) {
  err('site/journey.json differs from content/journey.json. Copy it again.');
}

const nodes = j.nodes || {};
const endings = j.endings || {};
const sources = j.sources || {};
const actors = j.actors || {};
const PATHS = ['early_lysis', 'direct_pci', 'late', 'death'];

// 1. Bilingual text: every object with en must have hi and vice versa.
(function walk(v, p) {
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${p}[${i}]`));
  if (v && typeof v === 'object') {
    const hasEn = 'en' in v, hasHi = 'hi' in v;
    if (hasEn !== hasHi) err(`${p}: has ${hasEn ? 'en' : 'hi'} but not ${hasEn ? 'hi' : 'en'}`);
    if (hasEn && hasHi && typeof v.en === 'string' && (!v.en.trim() || !v.hi.trim())) err(`${p}: empty en/hi text`);
    for (const k of Object.keys(v)) walk(v[k], `${p}.${k}`);
  }
})(j, 'journey');

// 2. Refs: collect every refs array anywhere and check against sources.
const usedRefs = new Set();
(function walk(v, p) {
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${p}[${i}]`));
  if (v && typeof v === 'object') {
    if (Array.isArray(v.refs)) {
      for (const r of v.refs) {
        usedRefs.add(r);
        if (!sources[r]) err(`${p}.refs: unknown source "${r}"`);
      }
    }
    for (const k of Object.keys(v)) if (k !== 'sources') walk(v[k], `${p}.${k}`);
  }
})(j, 'journey');
if (j.meta?.wage_basis?.fact && !sources[j.meta.wage_basis.fact]) err(`meta.wage_basis.fact unknown: ${j.meta.wage_basis.fact}`);
if (j.meta?.wage_basis?.fact) usedRefs.add(j.meta.wage_basis.fact);
for (const id of Object.keys(sources)) {
  const s = sources[id];
  if (!s.cite) err(`sources.${id}: missing cite`);
  if (id !== 'ASSUMPTION' && !s.url) warn(`sources.${id}: no url`);
  if (!usedRefs.has(id)) warn(`sources.${id}: never referenced`);
}

// 3. Graph: every next resolves, start exists.
if (!nodes[j.start]) err(`start "${j.start}" is not a node`);
for (const [id, n] of Object.entries(nodes)) {
  if (!Array.isArray(n.choices) || !n.choices.length) err(`nodes.${id}: no choices`);
  if (n.clock_min !== null && typeof n.clock_min !== 'number') err(`nodes.${id}: clock_min must be number or null`);
  if (typeof n.clock_min === 'number' && !n.clock_label) err(`nodes.${id}: clock_min without clock_label`);
  for (const [i, c] of (n.choices || []).entries()) {
    if (c.next !== 'ending' && !nodes[c.next]) err(`nodes.${id}.choices[${i}].next "${c.next}" does not resolve`);
    if (c.set?.path && !PATHS.includes(c.set.path)) err(`nodes.${id}.choices[${i}].set.path "${c.set.path}" unknown`);
    if (c.set?.path && !endings[c.set.path]) err(`nodes.${id}: path ${c.set.path} has no ending`);
    if (c.set?.hospital && !['government', 'private'].includes(c.set.hospital)) err(`nodes.${id}: bad hospital ${c.set.hospital}`);
  }
}

// 4. Enumerate every route (DFS over state) to check reachability and endings.
const reached = new Set();
const routes = [];
function dfs(id, state, trail) {
  reached.add(id);
  for (const c of nodes[id].choices) {
    const s = { ...state, ...(c.set || {}) };
    const t = [...trail, id];
    if (c.next === 'ending') {
      if (!s.path) err(`route ${t.join('>')} ends without path`);
      routes.push({ trail: t, state: s });
    } else if (t.includes(c.next)) {
      err(`cycle at ${t.join('>')}>${c.next}`);
    } else dfs(c.next, s, t);
  }
}
if (nodes[j.start]) dfs(j.start, {}, []);
for (const id of Object.keys(nodes)) if (!reached.has(id)) err(`nodes.${id}: unreachable`);
const endReached = new Set(routes.map((r) => r.state.path));
for (const p of PATHS) if (!endReached.has(p)) err(`ending ${p}: unreachable`);
for (const p of Object.keys(endings)) if (!PATHS.includes(p)) warn(`endings.${p}: not a known path`);

// 5. Costs: scenarios and lines.
const W = j.meta?.wage_basis?.daily_wage_inr;
if (typeof W !== 'number') err('meta.wage_basis.daily_wage_inr missing');
const scenarioTotals = {};
for (const [k, lines] of Object.entries(j.costs?.scenarios || {})) {
  let min = 0, max = 0;
  for (const l of lines) {
    const line = j.costs.lines[l];
    if (!line) { err(`costs.scenarios.${k}: unknown line ${l}`); continue; }
    if (!(line.min <= line.max)) err(`costs.lines.${l}: min > max`);
    min += line.min; max += line.max;
  }
  scenarioTotals[k] = { min, max, days: Math.ceil(max / W) };
}
for (const r of routes) {
  if (r.state.path === 'death') continue;
  if (typeof r.state.card !== 'boolean' || !r.state.hospital) { err(`route ${r.trail.join('>')}: missing card/hospital for costs`); continue; }
  const key = `${r.state.card ? 'card' : 'nocard'}_${r.state.hospital}`;
  if (!j.costs.scenarios[key]) err(`route ${r.trail.join('>')}: no cost scenario ${key}`);
}

// 6. Endings.
for (const [k, e] of Object.entries(endings)) {
  if (!e.title || !e.text || !e.stat) err(`endings.${k}: needs title, text, stat`);
  const n = e.stat?.survivors_per_100;
  if (n !== null && !(Number.isInteger(n) && n >= 0 && n <= 100)) err(`endings.${k}.stat.survivors_per_100 invalid`);
  if (n === null && !e.turning_points) warn(`endings.${k}: no grid and no turning_points`);
}

// 7. System fixes, actors.
for (const [k, v] of Object.entries(j.system_fixes || {})) {
  if (!nodes[k]) err(`system_fixes.${k}: not a node id`);
  if (typeof v === 'string') {
    if (!nodes[v]) err(`system_fixes.${k} -> "${v}" is not a node id`);
    else if (!Array.isArray(j.system_fixes[v])) err(`system_fixes.${k} -> "${v}" has no cards of its own`);
  } else if (Array.isArray(v)) {
    v.forEach((c, i) => {
      if (!c.title || !c.text) err(`system_fixes.${k}[${i}]: needs title and text`);
      for (const a of c.actors || []) if (!actors[a]) err(`system_fixes.${k}[${i}]: unknown actor ${a}`);
      if (!c.actors?.length) warn(`system_fixes.${k}[${i}]: no actors`);
    });
  } else err(`system_fixes.${k}: must be array or node id string`);
}
for (const g of j.playbook?.groups || []) {
  if (!actors[g.actor]) err(`playbook group: unknown actor ${g.actor}`);
  if (!g.items?.length) err(`playbook group ${g.actor}: no items`);
}

// 8. Better route.
const br = j.better_route;
if (!br?.label || !br?.intro || !br?.outcome || !br?.steps?.length) err('better_route incomplete');
let prev = -1;
for (const [i, s] of (br?.steps || []).entries()) {
  if (typeof s.clock_min !== 'number' || !s.clock_label) err(`better_route.steps[${i}]: clock missing`);
  if (s.clock_min < prev) err(`better_route.steps[${i}]: clock goes backwards`);
  prev = s.clock_min;
}

// 9. Other sections.
if (j.lessons?.items?.length !== 5) warn(`lessons.items has ${j.lessons?.items?.length} items (expected 5)`);
if (!j.share?.en || !j.share?.hi) err('share text missing');

// Report.
console.log(`journey.json v${j.meta?.version}: ${Object.keys(nodes).length} nodes, ${Object.keys(endings).length} endings, ${Object.keys(sources).length} sources, ${routes.length} distinct routes`);
const byEnding = {};
for (const r of routes) {
  const key = `${r.state.path}${r.state.path === 'death' ? '' : ` / ${r.state.card ? 'card' : 'nocard'}_${r.state.hospital}`}`;
  byEnding[key] = (byEnding[key] || 0) + 1;
}
for (const [k, n] of Object.entries(byEnding)) console.log(`  ${k}: ${n} route(s)`);
for (const [k, t] of Object.entries(scenarioTotals)) console.log(`  cost ${k}: ₹${t.min} to ₹${t.max}, up to ${t.days} days of wages`);
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `FAILED with ${errors.length} error(s)` : 'OK');
process.exit(errors.length ? 1 : 0);
