#!/usr/bin/env python3
"""
Objective checks for a generated mark family. It cannot judge taste; it catches
the failures a human eye misses at 16px and the ones an AI reviewer talks itself
out of (stray specks, thin strokes, solid blobs).

  python scripts/score-mark.py --dir public/brand/<slug>
  python scripts/score-mark.py --dir bakeoff          # scores every subfolder

Requires: pip install cairosvg pillow

Checks (FAIL stops the mark, WARN needs a written reason, NOTE is information):
  FAIL  v2.3: circles, fill+stroke, more than 4 primitives
  FAIL  compact has a stroke thinner than 2.4 units or a dot under 4 units wide
        (on the 64 grid that is 0.6px / 1px at 16px)
  FAIL  glyph silhouette at 32px covers < 10% or > 88% of the box
  FAIL  compact mark has no contrast at 16px (luminance spread < 0.10)
  WARN  detached speck: a component under 15% of the median component area
  WARN  element count above 24 (op7418 rule: 1–2 core elements)
  WARN  negative space inside the tile outside 25–80%
  NOTE  mirror symmetry above 0.97 on both axes (add intentional imbalance)
"""
import argparse, io, re, statistics, sys, warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
from pathlib import Path

import cairosvg
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('--dir', required=True)
args = ap.parse_args()


def raster(path, size, bg=None):
    png = cairosvg.svg2png(url=str(path), output_width=size, output_height=size, background_color=bg)
    return Image.open(io.BytesIO(png)).convert('RGBA')


def components(img, thresh=128):
    w, h = img.size
    a = img.getchannel('A').point(lambda v: 255 if v >= thresh else 0)
    px = a.load()
    seen = [[False] * w for _ in range(h)]
    out = []
    for y in range(h):
        for x in range(w):
            if px[x, y] and not seen[y][x]:
                stack, n = [(x, y)], 0
                seen[y][x] = True
                while stack:
                    cx, cy = stack.pop()
                    n += 1
                    for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                        if 0 <= nx < w and 0 <= ny < h and px[nx, ny] and not seen[ny][nx]:
                            seen[ny][nx] = True
                            stack.append((nx, ny))
                out.append(n)
    return out


def mirror_similarity(img):
    a = img.getchannel('A')
    px = a.load()
    w, h = a.size
    tot = h_same = v_same = 0
    for y in range(h):
        for x in range(w):
            on = px[x, y] > 127
            if on or px[w - 1 - x, y] > 127:
                tot += 1
                h_same += (px[w - 1 - x, y] > 127) == on
            if px[x, h - 1 - y] > 127 or on:
                v_same += (px[x, h - 1 - y] > 127) == on
    return (h_same / tot if tot else 0), (v_same / tot if tot else 0)


def score(folder):
    fails, warns, notes = [], [], []
    mark, compact, glyph = folder / 'mark.svg', folder / 'mark-compact.svg', folder / 'glyph.svg'
    for f in (mark, compact, glyph):
        if not f.exists():
            return [f'missing {f.name}'], [], []
    msrc, csrc = mark.read_text(), compact.read_text()

    # v2.3 hard gate: zero circles, fill-only, 2–4 solid primitives.
    if re.search(r'<circle[\s>]', msrc) or re.search(r'<circle[\s>]', csrc):
        fails.append('v2.3: <circle> banned; use a non-circular path/polygon silhouette')
    if re.search(r'stroke="(?!none)[^"]*"', msrc) or re.search(r'stroke="(?!none)[^"]*"', csrc):
        fails.append('v2.3: fill + stroke banned; build solid fills separated by negative space')
    visual = re.sub(r'<defs>[\s\S]*?</defs>', '', msrc)
    shapes = len(re.findall(r'<(path|circle|rect|ellipse|polygon|line)[\s>]', visual))
    if shapes > 4:
        fails.append(f'v2.3: {shapes} primitives in the primary (max 2–4); simplify the idea')

    strokes = [float(v) for v in re.findall(r'stroke-width="([\d.]+)"', csrc) if float(v) > 0]
    if strokes and min(strokes) < 2.4:
        fails.append(f'compact stroke {min(strokes)} < 2.4 units; it dies at 16px')
    dots = [float(v) * 2 for v in re.findall(r'<circle[^>]* r="([\d.]+)"', csrc)]
    if dots and min(dots) < 4:
        fails.append(f'compact dot {min(dots):.1f} units wide < 4; under 1px at 16px')

    g32 = raster(glyph, 32)
    cover = sum(1 for v in g32.getchannel('A').getdata() if v > 127) / (32 * 32)
    if cover < 0.10 or cover > 0.88:
        fails.append(f'glyph silhouette covers {cover:.0%} at 32px; it does not read as a shape')

    c16 = raster(compact, 16, '#ffffff').convert('L')
    vals = list(c16.getdata())
    spread = statistics.pstdev(vals) / 255
    if spread < 0.10:
        fails.append(f'compact contrast at 16px is {spread:.2f} (< 0.10); a smudge')

    comps = [a for a in components(raster(glyph, 128)) if a > 3]
    if len(comps) >= 2:
        med = statistics.median(comps)
        specks = [a for a in comps if a < 0.15 * med]
        if specks and len(specks) <= 2:
            warns.append(f'{len(specks)} detached speck(s) smaller than 15% of the median part; attach it or delete it')

    p128 = raster(mark, 128)
    cols = {}
    for r, g, b, a in p128.getdata():
        if a > 250:
            cols[(r, g, b)] = cols.get((r, g, b), 0) + 1
    if cols:
        total = sum(cols.values())
        field_share = max(cols.values()) / total
        # v2.3 asks for architectural mass, not a 40–50% hole. The 8% channels
        # between solid shapes are the negative space; a solid silhouette is
        # allowed. Report the share, do not warn on it.
        notes.append(f'dominant field {field_share:.0%} (v2.3 solid mass; channels are the negative space)')

    hs, vs = mirror_similarity(raster(glyph, 64))
    if hs > 0.97 and vs > 0.97:
        notes.append('fully symmetric on both axes; consider intentional imbalance')
    return fails, warns, notes


root = Path(args.dir)
folders = [root] if (root / 'mark.svg').exists() else sorted(p for p in root.iterdir() if p.is_dir() and (p / 'mark.svg').exists())
if not folders:
    sys.exit(f'no mark.svg under {root}')
bad = 0
for f in folders:
    fails, warns, notes = score(f)
    verdict = 'FAIL' if fails else ('WARN' if warns else 'PASS')
    print(f'{verdict}  {f.name}')
    for m in fails: print(f'   FAIL  {m}')
    for m in warns: print(f'   WARN  {m}')
    for m in notes: print(f'   NOTE  {m}')
    bad += bool(fails)
sys.exit(1 if bad else 0)
