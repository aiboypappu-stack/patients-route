// Renders scripts/og.html to site/og-image.png (1200x630). Usage: node scripts/make-og.mjs
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(pathToFileURL(join(root, 'scripts', 'og.html')).href);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: join(root, 'site', 'og-image.png') });
await b.close();
console.log('site/og-image.png written');
