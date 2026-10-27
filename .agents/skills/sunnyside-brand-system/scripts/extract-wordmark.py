#!/usr/bin/env python3
"""
Shape a text run with real kerning and write a filled SVG wordmark.

  python scripts/extract-wordmark.py \
    --font Syne.woff2 --text sunnyside --out wordmark.svg \
    --weight 800 --tracking -0.045

Requires:
  pip install fonttools brotli uharfbuzz

The script instances the variable font at --weight when the font supports it,
shapes with HarfBuzz, and emits one <path> per glyph with `fill="currentColor"`.
It does not embed the font. Use the outlines as the logo, not live text.
"""
import argparse
import io
import math
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

parser = argparse.ArgumentParser()
parser.add_argument('--font', required=True)
parser.add_argument('--text', required=True)
parser.add_argument('--out', default='wordmark.svg')
parser.add_argument('--weight', type=float, default=800)
parser.add_argument('--tracking', type=float, default=-0.045,
                    help='Tracking in em, added between shaped advances.')
parser.add_argument('--padding', type=float, default=0.015,
                    help='Padding in em around the ink box.')
parser.add_argument('--label', default=None)
args = parser.parse_args()

font = TTFont(args.font)
if 'fvar' in font:
    axes = {axis.axisTag for axis in font['fvar'].axes}
    if 'wght' in axes:
        font = instantiateVariableFont(
            font, {'wght': args.weight}, inplace=False, updateFontNames=False
        )
font.flavor = None

buffer = io.BytesIO()
font.save(buffer)
data = buffer.getvalue()

face = hb.Face(data)
hb_font = hb.Font(face)
buf = hb.Buffer()
buf.add_str(args.text)
buf.guess_segment_properties()
hb.shape(hb_font, buf, {'kern': True, 'liga': True})

upem = font['head'].unitsPerEm
glyph_set = font.getGlyphSet()
glyph_order = font.getGlyphOrder()
tracking = args.tracking * upem

x = 0.0
glyphs = []
min_y = math.inf
max_y = -math.inf
max_x = 0.0

for info, position in zip(buf.glyph_infos, buf.glyph_positions):
    name = glyph_order[info.codepoint]
    pen = SVGPathPen(glyph_set)
    glyph_set[name].draw(pen)
    bounds_pen = BoundsPen(glyph_set)
    glyph_set[name].draw(bounds_pen)
    bounds = bounds_pen.bounds

    if bounds:
        x_min, y_min, x_max, y_max = bounds
        min_y = min(min_y, y_min)
        max_y = max(max_y, y_max)
        max_x = max(max_x, x + position.x_offset + x_max)

    glyphs.append({
        'd': pen.getCommands(),
        'x': x + position.x_offset,
        'y': position.y_offset,
    })
    x += position.x_advance + tracking

if not glyphs or max_y < min_y:
    raise SystemExit('No outlines were produced. Check the font and the text.')

pad = args.padding * upem
width = max_x + pad * 2
height = (max_y - min_y) + pad * 2
baseline = pad + max_y
label = args.label or args.text

parts = []
for glyph in glyphs:
    if not glyph['d']:
        continue
    px = glyph['x'] + pad
    py = baseline - glyph['y']
    parts.append(
        f'    <path transform="translate({px:.2f} {py:.2f}) scale(1 -1)" '
        f'd="{glyph["d"]}"/>'
    )

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" '
    f'viewBox="0 0 {width:.2f} {height:.2f}" role="img" aria-label="{label}">\n'
    f'  <g fill="currentColor">\n' + '\n'.join(parts) + '\n  </g>\n</svg>\n'
)

Path(args.out).write_text(svg)
print(f'{args.out} — {width / upem:.2f} × {height / upem:.2f} em, '
      f'{len(parts)} glyphs, {len(svg)} bytes')
