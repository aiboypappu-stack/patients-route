# QA report

Date: 18 Nov 2026. Build: journey.json v1.1-draft, Hindi title इलाज तक का सफ़र, crayon drawings added.

## Journey check (`node scripts/check-journey.mjs`)

OK. 13 nodes, 4 endings, 53 sources, 22 distinct routes. Every `next` resolves, every `refs` ID exists, every node and ending is reachable, every `system_fixes` key and pointer is a real node, every actor exists.

| Cost scenario | Total range | Wage days (ceil(max / 478)) |
|---|---|---|
| card, government | ₹14,788 to ₹42,365 | 89 |
| card, private | ₹14,788 to ₹74,503 | 156 |
| no card, government | ₹25,934 to ₹70,538 | 148 |
| no card, private | ₹1.35 lakh to ₹2.21 lakh (₹1,34,788 to ₹2,20,538) | 462 |

## Route tests (`node scripts/test-routes.mjs`, headless Chromium, 360x740)

All 22 routes played in Hindi and English (44 playthroughs), covering all 4 endings and all 4 cost scenarios on every ending that shows costs. 0 failures.

Checked on every screen: no console errors, no failed or external requests, no element past the right edge, no horizontal scroll, tap targets at least 44 px (reference superscripts 28 px with a 48 px hit area). At each ending: ending matches the path, 100-figure grid has the right count, cost lines match `journey.json`, total equals the sum of lines, wage days = ceil(max / 478), no costs on the death ending, `road_late` fixes open on the death ending. Also: better route opens from every ending and the comparison says "Never" on the death route; browser Back steps through screens; `#playbook` opens the playbook directly; language buttons put `?lang=` in the URL; the language toggle keeps your place; source sheet opens, closes on Escape and returns focus; a failed `journey.json` load shows the bilingual error and Retry works.

Screenshots of every screen in both languages are in `qa/screenshots/` (not committed). Reviewed by eye: fixed clock tick labels wrapping ("8 घं") and OG timeline labels clipping. No clipped matras or conjuncts found.

## Weight (first load, gzip, measured by `scripts/perf.mjs`)

| | Transfer |
|---|---|
| HTML, CSS, JS (incl. crayon drawings), journey.json | 47.9 KB (limit 350 KB) |
| With fonts | 301.2 KB (limit 600 KB) |

## Slow 3G (2,000 ms latency, 50 KB/s)

First text (title) painted at about 2.1 s in both languages. Full start screen with the story loaded at about 5.4 s.

## Lighthouse (mobile, local server)

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Hindi | 95 | 100 | 100 | 100 |
| English | 94 | 100 | 100 | 100 |

## Live site

To be filled after deploy.
