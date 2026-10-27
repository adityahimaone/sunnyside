#!/usr/bin/env python3
"""
Extract the Riso Co. wordmark as outlines.

A wordmark that is live text changes shape when the font fails, and this system
has exactly one thing it cannot afford to lose. So the logotype is cut once from
Space Grotesk at 700 and committed as a path; nothing at runtime needs the font.

    python3 scripts/riso-wordmark.py

Writes design/brand/riso/assets/wordmark-path.json:
    { "d": "M…", "width": 000.0, "height": 000.0, "text": "riso co.", "source": … }

Requires fontTools (`pip install fonttools`).
"""
from __future__ import annotations

import json
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "design/brand/riso/assets/SpaceGrotesk.ttf"
OUT = ROOT / "design/brand/riso/assets/wordmark-path.json"

TEXT = "riso co."
WEIGHT = 700
TRACKING = 0.015  # em, applied after every glyph but the last


def main() -> None:
    font = TTFont(FONT)
    if "fvar" in font:
        font = instantiateVariableFont(font, {"wght": WEIGHT}, inplace=False, updateFontNames=False)

    upm = font["head"].unitsPerEm
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    parts: list[str] = []
    x = 0.0
    for i, ch in enumerate(TEXT):
        if ch == " ":
            x += hmtx[cmap[32]][0]
            continue
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}")
        # Flip the y axis so the SVG has y down and the baseline sits at y=0.
        flipped = TransformPen(pen, (1, 0, 0, -1, x, 0))
        glyphs[name].draw(flipped)
        d = pen.getCommands()
        if d:
            parts.append(d)
        x += hmtx[name][0]
        if i < len(TEXT) - 1:
            x += TRACKING * upm

    d = "".join(parts)

    # Bounds in the final coordinate space, so the viewBox hugs the drawing.
    # Each glyph is measured at its own advance offset; a single pen at the
    # origin would only measure the last one.
    xmin = ymin = float("inf")
    xmax = ymax = float("-inf")
    cursor = 0.0
    for i, ch in enumerate(TEXT):
        if ch == " ":
            cursor += hmtx[cmap[32]][0]
            continue
        name = cmap[ord(ch)]
        bp = BoundsPen(glyphs)
        glyphs[name].draw(TransformPen(bp, (1, 0, 0, -1, cursor, 0)))
        if bp.bounds:
            gx0, gy0, gx1, gy1 = bp.bounds
            xmin, ymin = min(xmin, gx0), min(ymin, gy0)
            xmax, ymax = max(xmax, gx1), max(ymax, gy1)
        cursor += hmtx[name][0]
        if i < len(TEXT) - 1:
            cursor += TRACKING * upm
    width = xmax - xmin
    height = ymax - ymin

    payload = {
        "text": TEXT,
        "source": f"Space Grotesk {WEIGHT} / SIL Open Font License",
        "upm": upm,
        "viewBox": f"{xmin:.1f} {ymin:.1f} {width:.1f} {height:.1f}",
        "width": round(width, 1),
        "height": round(height, 1),
        "d": d,
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wordmark: {width:.0f} × {height:.0f} units → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
