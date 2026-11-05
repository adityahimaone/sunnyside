#!/usr/bin/env python3
"""
Outline the wordmark from the display instance, with fontTools.

    python3 vesper/scripts/outline-wordmark.py \
        --font vesper/assets/fonts/Fraunces-Regular-Display.ttf \
        --text VESPER --cap 26 --tracking 0.012 \
        --out vesper/public/brand/vesper/wordmark.json

opentype.js produced NaN control points on this instanced file, and a single NaN
makes a browser drop the rest of the path — which is why the first render showed
"VES" and nothing else. fontTools writes the glyph contours directly, so there is
no curve fitting to divide by zero.

The output is geometry, never live text: a font failure must not change the name.
"""
import argparse
import json
import sys

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

ap = argparse.ArgumentParser()
ap.add_argument('--font', required=True)
ap.add_argument('--text', default='VESPER')
ap.add_argument('--cap', type=float, default=26, help='cap height in output units')
ap.add_argument('--tracking', type=float, default=0.012, help='extra tracking, in em')
ap.add_argument('--out', required=True)
args = ap.parse_args()

font = TTFont(args.font)
upem = font['head'].unitsPerEm
cmap = font.getBestCmap()
glyphset = font.getGlyphSet()
cap_units = font['OS/2'].sCapHeight or (upem * 0.7)
scale = args.cap / cap_units
track = args.tracking * upem

# Lay the glyphs out in font units first, then scale the whole run once.
positions = []
x = 0.0
for ch in args.text:
    gname = cmap[ord(ch)]
    glyph = glyphset[gname]
    positions.append((gname, x))
    x += glyph.width + track

# Exact ink bounds of the run, so the SVG box is the drawing and not the advance.
bounds = BoundsPen(glyphset)
for gname, gx in positions:
    t = Transform(1, 0, 0, 1, gx, 0)
    glyphset[gname].draw(TransformPen(bounds, t))
x1, y1, x2, y2 = bounds.bounds

pen = SVGPathPen(glyphset, ntos=lambda v: f'{v:.2f}')
for gname, gx in positions:
    t = Transform(1, 0, 0, 1, gx, 0)
    glyphset[gname].draw(TransformPen(pen, t))

path = pen.getCommands()

# One transform for the whole run: scale to the cap height, move the ink to 0,0,
# and flip the baseline to the bottom of the box.
sx = scale
sy = -scale
tx = -x1 * sx
ty = -y2 * sy  # y2 is the top in font units (y up); after flip it becomes 0

out = {
    'text': args.text,
    'font': args.font.split('/')[-1],
    'capUnits': round(args.cap, 3),
    'tracking': args.tracking,
    'width': round((x2 - x1) * sx, 2),
    'height': round((y2 - y1) * -sy, 2),
    'path': path,
    'transform': f'translate({tx:.2f} {ty:.2f}) scale({sx:.6f} {sy:.6f})',
}

with open(args.out, 'w') as fh:
    json.dump(out, fh, indent=1)

print(f"  wordmark  {out['width']} × {out['height']}  ({len(path)} chars of path, 0 NaN)")
if 'NaN' in path or 'nan' in path.lower():
    sys.exit('FAIL: NaN in path data')
