# The Patient's Route · इलाज तक का सफ़र

A bilingual (Hindi and English) choose-your-path story about a heart attack at night in a fictional village in Bhind district, 80 km from Gwalior. Every number links to its source. A static site: no login, no server, no trackers, no cookies.

- `content/journey.json` is the single source of truth for all story text, numbers, choices, endings, costs and sources.
- `site/` is what GitHub Pages serves (`index.html`, `app.js`, `styles.css`, a copy of `journey.json`, self-hosted fonts).
- `scripts/` holds the checks and build helpers.
- `qa/REPORT.md` has the latest test and Lighthouse results.

## Update the story

1. Edit `content/journey.json`. Keep every text in both `en` and `hi`.
2. Copy it into the site and check it:
   ```bash
   cp content/journey.json site/journey.json
   node scripts/check-journey.mjs
   ```
   The check fails if a `next` or `refs` ID does not resolve, a node is unreachable, a cost scenario is missing, or the two copies differ.
3. If you added new Hindi or English characters (rare), rebuild the font subsets:
   ```bash
   python3 -m venv build/.venv && build/.venv/bin/pip install fonttools brotli
   build/.venv/bin/python scripts/build-fonts.py
   ```
   The source TTFs are Mukta and Tiro Devanagari Hindi from `google/fonts` (`ofl/`), saved in `build/` as `mukta_Mukta-Regular.ttf` and so on.
4. Optional full test (plays all 22 routes in both languages at 360x740):
   ```bash
   npm install && npx playwright install chromium
   node scripts/serve.mjs &
   node scripts/test-routes.mjs
   ```

## Redeploy

Commit and push to `main`. The workflow in `.github/workflows/pages.yml` runs the journey check and publishes `site/` to GitHub Pages. Nothing else to do.

## Licences

Fonts: Mukta and Tiro Devanagari Hindi, SIL Open Font License 1.1 (see `site/fonts/OFL-*.txt`).
