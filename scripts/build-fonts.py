#!/usr/bin/env python3
"""Subset Mukta and Tiro Devanagari Hindi to the characters the site uses.

Run again after editing journey.json if new characters appear:
  python3 -m venv build/.venv && build/.venv/bin/pip install fonttools brotli
  build/.venv/bin/python scripts/build-fonts.py

Source TTFs (OFL) come from https://github.com/google/fonts/tree/main/ofl and
are expected in build/ (see README). Output goes to site/fonts/.
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
build, out = root / 'build', root / 'site' / 'fonts'
out.mkdir(parents=True, exist_ok=True)

j = json.loads((root / 'content' / 'journey.json').read_text('utf8'))
app = (root / 'site' / 'app.js').read_text('utf8')
html = (root / 'site' / 'index.html').read_text('utf8')

def strings(v):
    if isinstance(v, str):
        yield v
    elif isinstance(v, dict):
        for x in v.values():
            yield from strings(x)
    elif isinstance(v, list):
        for x in v:
            yield from strings(x)

ascii_set = ''.join(chr(c) for c in range(0x20, 0x7f))
extra = '₹·’‘“”…– ‌‍।॥'
all_text = ''.join(strings(j)) + app + html + ascii_set + extra

# Title font: only strings shown in title styles (big title, scene, endings, better-route steps, section titles).
titles = [j['meta']['title']]
titles += [n['scene'] for n in j['nodes'].values()]
titles += [e['title'] for e in j['endings'].values()]
titles += [j['better_route']['label']] + [s['title'] for s in j['better_route']['steps']]
titles += [j['lessons']['title'], j['playbook']['title']]
title_text = ''.join(strings(titles)) + ''.join(re.findall(r"(?:sourcesTitle|compareTitle):\s*\{[^}]*\}", app)) + ascii_set + extra

def subset(src, dst, text):
    tf = build / 'subset.txt'
    tf.write_text(''.join(sorted(set(text))), 'utf8')
    cmd = [sys.executable, '-m', 'fontTools.subset', str(build / src), f'--text-file={tf}',
           '--layout-features=*', '--flavor=woff2', f'--output-file={out / dst}',
           '--no-hinting', '--desubroutinize', '--name-IDs=*', '--notdef-outline']
    subprocess.run(cmd, check=True)
    print(f'{dst}: {(out / dst).stat().st_size} bytes')

subset('mukta_Mukta-Regular.ttf', 'mukta-400.woff2', all_text)
subset('mukta_Mukta-SemiBold.ttf', 'mukta-600.woff2', all_text)
subset('mukta_Mukta-Bold.ttf', 'mukta-700.woff2', all_text)
subset('tirodevanagarihindi_TiroDevanagariHindi-Regular.ttf', 'tiro-400.woff2', title_text)
shutil.copy(build / 'mukta_OFL.txt', out / 'OFL-Mukta.txt')
shutil.copy(build / 'tirodevanagarihindi_OFL.txt', out / 'OFL-TiroDevanagariHindi.txt')
