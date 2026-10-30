#!/usr/bin/env python3
"""Build an OpenPencil design-system board from a sunnyside brand folder.

Frames, in reading order (a design system, not a token dump):

  01 Cover        name, idea, palette strip, counts
  02 Color        primitive / semantic light / semantic dark / component tiers
  03 Typography   families with weights, then the scale drawn at real px
  04 Logo         grounds, clearspace rule, minimum sizes, every asset
  05 Spacing      bars at real px
  06 Radius       squares at real radius
  07 Elevation    shadow and glass tokens on demo cards
  08 Motion       durations and easing
  09 Components   component tokens grouped by widget
  10 Accessibility contrast pairs with computed ratio + grade
  11 Imagery      photographs

A section with no tokens is skipped, so numbering adapts per brand.

  export MCP_TOKEN=<fresh token from OpenPencil mcp.json>
  python3 brand_to_pen.py \
    --brand-dir ~/Development/sunnyside/public/brand/clearing \
    --tokens    ~/Development/sunnyside/public/brand/clearing/clearing-tokens.json \
    --out       ~/openpencil-assets/clearing/clearing-brand.fig \
    --export    ~/openpencil-assets/clearing

Token schemas differ per brand (v1 `color` dict, v3 `primitives` list, v4
`semantic.light/dark`). `normalize()` is the only place that knows the shapes.
Semantic and component values are `var(--x)` refs, so `css_vars()` chases them
through the CSS to hex — that is what makes the colour section complete.

Text on the sheet: nothing below 14px, and every label sits at 4.5:1 or better on
its own ground — `on_fill()` picks ink or cream by measured ratio, never by guess.

WARNING: opens a NEW document in the running app. Save unsaved canvas work first.
"""
import argparse
import base64
import json
import pathlib
import re

from openpencil import OP

W, PAD = 1440, 96
CREAM, INK, SECOND, RULE = "#f7f4ec", "#14140f", "#4a4a42", "#d8d3c4"
EDGE, DARK, PLATE = "#b6b0a0", "#141110", "#efe9da"
HEX = re.compile(r"#(?:[0-9a-f]{6})", re.I)
VAR = re.compile(r"var\([^,()]+,\s*(#[0-9a-fA-F]{3,8})\)")
CSSVAR = re.compile(r"(--[\w-]+)\s*:\s*([^;]+);")
SKIP = ("brandkit", "favicon", "icon-192", "icon-512", "apple-icon")

# the sheet's own type scale — 14px floor, 22px for anything you must read
T_TITLE, T_SUB, T_TIER, T_NAME = 54, 19, 15, 22
T_HEX, T_ROLE, T_ROW, T_META = 15, 14, 16, 14

CHIP_W, CHIP_H, CHIP_GAP, CHIP_PER_ROW = 292, 136, 20, 4

MARK_ORDER = ["mark", "mark-compact", "mark-mono", "mark-reverse",
              "mark-compact-reverse", "glyph", "icon", "wordmark",
              "wordmark-reverse", "lockup", "lockup-mono", "lockup-on-drum",
              "lockup-horizontal", "lockup-horizontal-reverse", "lockup-reverse",
              "lockup-stacked", "lockup-stacked-reverse"]
MARK_SIZE = {"mark": 130, "mark-compact": 16, "mark-mono": 130,
             "mark-reverse": 130, "mark-compact-reverse": 16, "glyph": 64,
             "icon": 96, "wordmark": 300, "wordmark-reverse": 300, "lockup": 420,
             "lockup-mono": 420, "lockup-on-drum": 420,
             "lockup-horizontal": 420, "lockup-horizontal-reverse": 420,
             "lockup-reverse": 420, "lockup-stacked": 260,
             "lockup-stacked-reverse": 260}
COL_W, ROW_GAP, PER_ROW = 440, 120, 3


# ---------- colour maths ----------

def lum(hex_color):
    h = hex_color.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

    def f(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(fg, bg):
    a, b = sorted((lum(fg), lum(bg)), reverse=True)
    return round((a + 0.05) / (b + 0.05), 2)


def grade(r, size=16):
    if r >= 7:
        return "AAA"
    if r >= 4.5:
        return "AA"
    if r >= 3:
        return "AA large" if size >= 24 else "large only"
    return "fail"


def on_fill(fill):
    """The ink that measures best on this fill. Never assume, never eyeball.

    INK and CREAM are the house pair, but a mid-tone swatch can leave both under
    AA (huginn's bark: 4.20:1, riso's ink: 4.46:1), so pure black and white are
    also candidates — a chip label has to clear 4.5:1 on its own fill or the
    sheet ships a contrast bug it was built to catch.
    """
    return max((INK, CREAM, "#000000", "#ffffff"), key=lambda c: ratio(c, fill))


# ---------- token normalisation ----------

def _decls(text):
    return dict(CSSVAR.findall(text))


def _chase(raw, out=None, depth=6):
    """Follow var() refs down to hex. Two hops is normal: semantic -> primitive."""
    out = dict(out or {})
    for _ in range(depth):
        changed = False
        for name, value in raw.items():
            if name in out:
                continue
            m = HEX.search(value)
            if m:
                out[name] = m.group(0).lower()
                changed = True
                continue
            ref = re.search(r"var\((--[\w-]+)", value)
            if ref and ref.group(1) in out:
                out[name] = out[ref.group(1)]
                changed = True
        if not changed:
            break
    return out


def css_vars(brand_dir):
    """-> {"light": {...}, "dark": {...}} of var name to hex.

    Two traps here. The token file's semantic layer says `var(--surface-page)`
    while the CSS calls it `--cl-surface-page`, so the namespace is aliased off.
    And the dark scope redeclares the same names, so the sheet is split at the
    night selector instead of letting the later declaration win.
    """
    light_raw, dark_raw = {}, {}
    for css in brand_dir.glob("*-tokens.css"):
        text = css.read_text()
        # last match, not first: the header comment also names the night scope
        cuts = list(re.finditer(r"\[data-[\w-]+=([\"']?)(?:night|dark)\1\]\s*\{", text))
        cut = cuts[-1].start() if cuts else None
        light_raw.update(_decls(text[:cut] if cut else text))
        dark_raw.update(_decls(text[cut:] if cut else ""))

    out = {}
    for key, raw in (("light", light_raw), ("dark", {**light_raw, **dark_raw})):
        resolved = _chase(raw)
        for name, value in list(resolved.items()):
            bare = name.replace("--cl-", "--")
            resolved.setdefault(bare, value)
        out[key] = resolved
    return out


def is_hex(v):
    return isinstance(v, str) and bool(HEX.fullmatch(v))


def resolve(value, variables):
    if not isinstance(value, str):
        return None
    m = HEX.search(value)
    if m:
        return m.group(0).lower()
    m = re.search(r"var\((--[\w-]+)", value)
    if m:
        return variables.get(m.group(1))
    return None


def entries(raw, variables):
    """-> [(name, hex|number|str, role)] from dict / [{name,value,role}] / [hex]."""
    out = []
    if isinstance(raw, dict):
        for k, v in raw.items():
            if isinstance(v, dict):
                raw_v = v.get("value") or v.get("hex")
                out.append((k, resolve(raw_v, variables) or raw_v, v.get("role", "")))
            else:
                out.append((k, resolve(v, variables) or v, ""))
    elif isinstance(raw, list):
        for i, item in enumerate(raw):
            if isinstance(item, dict):
                raw_v = item.get("value")
                out.append((item.get("name", f"item{i}"),
                            resolve(raw_v, variables) or raw_v,
                            item.get("role") or item.get("use") or ""))
            else:
                out.append((f"item{i}", resolve(item, variables) or item, ""))
    return out


def to_px(value):
    """clamp(2.5rem, .., 4.25rem) -> 68 · 1.0625rem -> 17 · 16px -> 16."""
    if isinstance(value, (int, float)):
        return float(value)
    if not isinstance(value, str):
        return None
    m = re.search(r"clamp\(([^)]*)\)", value)
    if m:
        nums = [to_px(p.strip()) for p in m.group(1).split(",")]
        nums = [n for n in nums if n]
        return max(nums) if nums else None
    if "(" in value:
        return None          # cubic-bezier and friends are not lengths
    m = re.search(r"([\d.]+)\s*(rem|em|px|ms)?", value)
    if not m:
        return None
    n = float(m.group(1))
    unit = m.group(2) or "px"
    return round(n * 16 if unit in ("rem", "em") else n, 2)


def normalize(tokens, varsets):
    light, dark = varsets["light"], varsets["dark"]

    prim = entries(tokens.get("primitives"), light)
    if not prim:
        prim = entries(tokens.get("color") or tokens.get("colors"), light)

    sem = tokens.get("semantic") or {}
    if isinstance(sem, dict):
        sem_light = entries(sem.get("light") or sem, light)
        sem_dark = entries(sem.get("dark"), dark)
        if not sem_dark:
            # one flat semantic layer + a night scope in the CSS: re-resolve dark
            sem_dark = entries(sem, dark)
    else:
        sem_light, sem_dark = entries(sem, light), []

    comp = tokens.get("components") or tokens.get("component") or {}
    if isinstance(comp, dict):
        comp_light = entries(comp.get("light") or comp, light)
        comp_dark = entries(comp.get("dark"), dark)
    else:
        comp_light, comp_dark = entries(comp, light), []

    if not comp_light:
        pat = re.compile(r"^--(?:cl-)?(button|focus|card|glass|field|input|"
                         r"tab|badge|panel|chip|link|row|spark)[\w-]*$")

        def pick(vars_):
            seen, out = set(), []
            for k, v in vars_.items():
                if not pat.match(k):
                    continue
                canon = k.lstrip("-")
                if canon.startswith("cl-"):
                    canon = canon[3:]
                if canon in seen:
                    continue
                seen.add(canon)
                out.append((canon, v, ""))
            return out
        comp_light, comp_dark = pick(light), pick(dark)

    contrast = []
    for c in tokens.get("contrast") or []:
        if not isinstance(c, dict):
            continue
        fg = resolve(c.get("fg") or c.get("a"), light)
        bg = resolve(c.get("bg") or c.get("b"), light)
        if fg and bg:
            r = ratio(fg, bg)
            contrast.append((c.get("pair") or c.get("label") or "pair", fg, bg,
                             c.get("ratio") or r, c.get("level") or grade(r)))

    t = tokens.get("type")
    if isinstance(t, list) and t and "size" in t[0]:
        # hachure-style: [{role, face, weight, size, use}] — role is the specimen
        types = [(i.get("role", "font"),
                  " ".join(str(i.get(k)) for k in ("face", "weight") if i.get(k)),
                  i.get("use", "")) for i in t if isinstance(i, dict)]
        scale = {i["role"]: i["size"] for i in t
                 if isinstance(i, dict) and i.get("size")}
    elif isinstance(t, list):
        types = [(i.get("name", "font"), str(i.get("value", "")), i.get("role", ""))
                 for i in t if isinstance(i, dict)]
        scale = {}
    else:
        t = t or {}
        scale = t.get("scale") if isinstance(t.get("scale"), dict) else {}
        types = [(k, v, "") for k, v in t.items()
                 if isinstance(v, str) and k != "scale"]

    return dict(
        prim=prim, sem_light=sem_light, sem_dark=sem_dark,
        comp_light=comp_light, comp_dark=comp_dark, contrast=contrast,
        types=types, scale=scale,
        radius=entries(tokens.get("radius"), light),
        space=entries(tokens.get("space") or tokens.get("spacing"), light),
        motion=entries(tokens.get("motion"), light),
        shadow=entries(tokens.get("shadow") or tokens.get("elevation"), light),
        glass=entries(tokens.get("glass"), light),
        meta=tokens.get("$meta") or tokens.get("meta") or tokens,
    )


# ---------- jsx helpers ----------

def text(name, content, size, color, x, y, font="Geist", w=None, lh=None, ls=None):
    content = str(content).replace('"', "'")
    s = (f'<Text name="{name}" content="{content}" fontFamily="{font}" '
         f'fontSize={{{size}}} fill="{color}" x={{{x}}} y={{{y}}}')
    if w:
        s += f" width={{{w}}}"
    if lh:
        s += f" lineHeight={{{lh}}}"
    if ls is not None:
        s += f" letterSpacing={{{ls}}}"
    return s + "/>"


def rect(name, x, y, w, h, fill, r=0):
    cr = f" cornerRadius={{{r}}}" if r else ""
    return (f'<Rectangle name="{name}" x={{{x}}} y={{{y}}} width={{{w}}} '
            f'height={{{h}}} fill="{fill}"{cr}/>')


def panel(name, x, y, w, h, fill, r=0, children=""):
    """A filled frame that owns its children.

    Chip labels must live INSIDE the chip, not sit next to it: a sibling text is
    measured against the section ground, so a cream label on a dark chip reads as
    1.00:1 in lint while looking fine — the node tree has to say what the eye sees.
    """
    cr = f" cornerRadius={{{r}}}" if r else ""
    return (f'<Frame name="{name}" x={{{x}}} y={{{y}}} width={{{w}}} '
            f'height={{{h}}} fill="{fill}"{cr}>{children}</Frame>')


def frame(name, h, ground=None):
    return (f'<Frame name="{name}" width={{{W}}} height={{{h}}} '
            f'fill="{ground or CREAM}">')


def head(jsx, title, sub, tag):
    jsx.append(text("Title", title, T_TITLE, INK, PAD, 78, "Iowan Old Style",
                    lh=60, ls=-1.4))
    jsx.append(text("Sub", sub, T_SUB, SECOND, PAD, 152, w=1060, lh=28))
    jsx.append(text("Tag", tag, T_TIER, SECOND, W - PAD - 60, 84, "Menlo", ls=2, w=60))


def tier(jsx, label, y, count=None, note=""):
    jsx.append(rect(f"Rule{label}", PAD, y, W - PAD * 2, 1, RULE))
    jsx.append(text(f"Tier{label}", label.upper(), T_TIER, INK, PAD, y + 18,
                    "Menlo", ls=2))
    if note:
        jsx.append(text(f"TierNote{label}", note, T_TIER, SECOND, PAD + 270,
                        y + 17, w=800))
    if count is not None:
        jsx.append(text(f"TierCount{label}", str(count), T_TIER, SECOND,
                        W - PAD - 30, y + 18, "Menlo", w=40))
    return y + 54


def chips(jsx, items, y, tag):
    """Colour chips: name, hex, role. Returns the next free y.

    Columns stay at 4 across every tier — a ragged 3-up tier breaks the vertical
    alignment between tiers, which matters more than a lone chip on the last row.
    """
    per_row = CHIP_PER_ROW
    for i, (name, hexv, role) in enumerate(items):
        x = PAD + (i % per_row) * (CHIP_W + CHIP_GAP)
        yy = y + (i // per_row) * (CHIP_H + CHIP_GAP)
        fill = hexv if is_hex(hexv) else PLATE
        fg = on_fill(fill)
        jsx.append(rect(f"{tag}Edge{i}", x, yy, CHIP_W, CHIP_H, EDGE, 12))
        inner = [text(f"{tag}Name{i}", name, T_NAME, fg, 16, 18,
                      "Iowan Old Style", w=CHIP_W - 36),
                 text(f"{tag}Hex{i}",
                      (hexv if is_hex(hexv) else "unresolved").upper(),
                      T_HEX, fg, 16, 56, "Menlo", ls=0.6)]
        if role:
            inner.append(text(f"{tag}Role{i}", role[:54], T_ROLE, fg, 16, 84,
                              w=CHIP_W - 36, lh=19))
        jsx.append(panel(f"{tag}Chip{i}", x + 2, yy + 2, CHIP_W - 4, CHIP_H - 4,
                         fill, 10, "".join(inner)))
    rows = max(1, (len(items) + per_row - 1) // per_row)
    return y + rows * (CHIP_H + CHIP_GAP)


# ---------- sections ----------

def cover(slug, n, meta):
    jsx = [frame(f"01 Cover — {slug}", 760)]
    kicker = " · ".join(str(v) for v in (meta.get("track") or meta.get("family"),
                                         meta.get("material")) if v)
    jsx.append(text("CoverKicker", (kicker or "design system").upper(), T_TIER,
                    SECOND, PAD, 96, "Menlo", ls=2.4))
    jsx.append(text("CoverName", meta.get("name") or slug.title(), 100, INK, PAD,
                    132, "Iowan Old Style", lh=106, ls=-2.2))
    idea = meta.get("idea") or meta.get("note") or ""
    if idea:
        jsx.append(text("CoverIdea", idea, 22, SECOND, PAD, 272, w=880, lh=34))

    strip = [c for c in n["prim"] if is_hex(c[1])][:8]
    for i, (name, hexv, _r) in enumerate(strip):
        x = PAD + i * 150
        jsx.append(rect(f"Strip{i}", x, 396, 138, 92, hexv, 8))
        jsx.append(text(f"StripLabel{i}", name, T_ROLE, INK, x, 502, "Menlo", w=138))

    jsx.append(rect("CoverRule", PAD, 556, W - PAD * 2, 1, RULE))
    counts = (f"{len([c for c in n['prim'] if is_hex(c[1])])} color primitives · "
              f"{len([c for c in n['sem_light'] if is_hex(c[1])])} semantic · "
              f"{len([c for c in n['comp_light'] if is_hex(c[1])])} component · "
              f"{len(n['contrast'])} contrast pairs · "
              f"{len([c for c in n['space'] if to_px(c[1])])} space steps · "
              f"{len([c for c in n['radius'] if to_px(c[1])])} radii · "
              f"{len([c for c in n['motion'] if to_px(c[1])])} durations")
    jsx.append(text("CoverCounts", counts, T_ROW, INK, PAD, 586, w=1200, lh=26))
    prov = " · ".join(str(v) for v in (meta.get("version"), meta.get("date")) if v)
    jsx.append(text("CoverProv", f"source public/brand/{slug}/"
                    + (f" · {prov}" if prov else ""), T_META, SECOND, PAD, 650,
                    "Menlo", w=1200))
    jsx.append("</Frame>")
    return "".join(jsx)


def color_section(slug, n):
    prim = [c for c in n["prim"] if is_hex(c[1])]
    tiers = [("Primitive", prim, "raw inks, named by material")]
    if n["sem_light"]:
        tiers.append(("Semantic · light", [c for c in n["sem_light"] if is_hex(c[1])],
                      "the role layer every surface and text token points at"))
    if n["sem_dark"]:
        tiers.append(("Semantic · dark", [c for c in n["sem_dark"] if is_hex(c[1])],
                      "the same roles under the night scope"))
    if n["comp_light"]:
        tiers.append(("Component · light", [c for c in n["comp_light"] if is_hex(c[1])],
                      "button, field, focus, card"))
    if n["comp_dark"]:
        tiers.append(("Component · dark", [c for c in n["comp_dark"] if is_hex(c[1])],
                      "inverse component scope"))

    def nrows(items):
        return max(1, (len(items) + CHIP_PER_ROW - 1) // CHIP_PER_ROW)

    h = 240 + sum(54 + nrows(t[1]) * (CHIP_H + CHIP_GAP) + 24 for t in tiers)
    jsx = [frame(f"02 Color — {slug}", h)]
    head(jsx, "Color", "Primitive inks, the semantic roles that alias them, and the "
         "component layer. Values resolved from the token file and its CSS.", "02")
    y = 230
    for label, items, note in tiers:
        y = tier(jsx, label, y, len(items), note)
        y = chips(jsx, items, y + 10, label.replace(" ", "").replace("·", ""))
        y += 16
    jsx.append("</Frame>")
    return "".join(jsx)


def typography_section(slug, n):
    fam = [t for t in n["types"] if t[1]]
    scale = [(k, to_px(v)) for k, v in (n["scale"] or {}).items()]
    scale = [(k, v) for k, v in scale if v]
    h = 240 + len(fam) * 100 + (60 if scale else 0) + sum(
        max(min(px, 76) * 1.5, 64) for _k, px in scale) + 90
    jsx = [frame(f"03 Typography — {slug}", h)]
    head(jsx, "Typography", "Families and weights first, then the scale drawn at its "
         "real size — a 68px display is 68px on this canvas.", "03")

    y = 230
    y = tier(jsx, "Families", y, len(fam), "what to set, and where")
    for i, (name, value, role) in enumerate(fam):
        yy = y + i * 100
        jsx.append(rect(f"FamRule{i}", PAD, yy, W - PAD * 2, 1, RULE))
        jsx.append(text(f"FamRole{i}", name, T_NAME, INK, PAD, yy + 18,
                        "Iowan Old Style", w=280))
        jsx.append(text(f"FamValue{i}", value, T_ROW, INK, PAD + 300, yy + 22,
                        "Menlo", w=560))
        if role:
            jsx.append(text(f"FamNote{i}", role[:78], T_ROLE, SECOND, PAD + 300,
                            yy + 52, w=800, lh=20))
    y += len(fam) * 100 + 20

    if scale:
        y = tier(jsx, "Scale", y, len(scale), "role · px · specimen")
        for i, (role, px) in enumerate(scale):
            draw = min(px, 76)
            jsx.append(text(f"ScRole{i}", role, T_TIER, SECOND, PAD, y + 16,
                            "Menlo", w=110))
            jsx.append(text(f"ScPx{i}", f"{px:g}px", T_TIER, SECOND, PAD + 130,
                            y + 16, "Menlo", w=90))
            jsx.append(text(f"ScSample{i}", "Three hinds, eleven seconds", draw, INK,
                            PAD + 250, y - 6, "Iowan Old Style", w=1040,
                            lh=draw * 1.2))
            y += max(draw * 1.5, 64)
    jsx.append("</Frame>")
    return "".join(jsx)


def logo_section(slug, specs, tops, marks_h):
    jsx = [frame(f"04 Logo — {slug}", marks_h + 60)]
    head(jsx, "Logo", "The mark and the wordmark at their review sizes, with the "
         "clearspace rule and the minimum sizes that keep them legible.", "04")

    # clearspace diagram — measured on all four sides, not just one
    x0, y0, box, gap = PAD, 214, 128, 34
    jsx.append(rect("ClearOuter", x0, y0, box + gap * 2, box + gap * 2, EDGE, 0))
    jsx.append(rect("ClearInner", x0 + gap, y0 + gap, box, box, PLATE, 0))
    jsx.append(text("ClearX1", "x", T_ROLE, SECOND, x0 + gap // 2 - 4, y0 + gap // 2 + 4,
                    "Menlo"))
    jsx.append(text("ClearX2", "x", T_ROLE, SECOND, x0 + gap + box + gap // 2 - 4,
                    y0 + gap // 2 + 4, "Menlo"))
    jsx.append(text("ClearX3", "x", T_ROLE, SECOND, x0 + gap // 2 - 4,
                    y0 + gap + box + gap // 2 + 4, "Menlo"))
    jsx.append(text("ClearTag", "CLEARSPACE", T_TIER, INK, x0 + box + gap * 2 + 40,
                    y0 + 6, "Menlo", ls=2))
    jsx.append(text("ClearNote", "x = 0.5 × mark height, all four sides. Nothing "
                    "enters the box.", T_ROLE, SECOND, x0 + box + gap * 2 + 40,
                    y0 + 32, w=460, lh=20))

    # minimum sizes
    mx = x0 + 720
    jsx.append(text("MinTag", "MINIMUM SIZE", T_TIER, INK, mx, y0 + 6, "Menlo", ls=2))
    for i, (label, px) in enumerate((("mark", 16), ("wordmark", 120),
                                    ("lockup", 240))):
        yy = y0 + 34 + i * 30
        jsx.append(text(f"MinName{i}", label, T_ROLE, INK, mx, yy, w=140))
        jsx.append(text(f"MinPx{i}", f"{px}px", T_HEX, SECOND, mx + 160, yy,
                        "Menlo", w=120))

    for i, (stem, size, label, col, row, _p, pale, w, h) in enumerate(specs):
        x = PAD + col * COL_W
        if pale and size >= 48:
            # a pale cut on cream is invisible; give it the ground it ships on
            jsx.append(rect(f"Plate{i}", x - 14, tops[row] - 14, w + 28, h + 28,
                            DARK, 10))
        if size < 48:
            bw, bh = max(w, 140), max(h, 88)
            plate = DARK if pale else PLATE
            jsx.append(rect(f"MarkBox{i}", x, tops[row], bw, bh, EDGE, 8))
            jsx.append(rect(f"MarkBoxInner{i}", x + 2, tops[row] + 2, bw - 4,
                            bh - 4, plate, 7))
        jsx.append(text(f"MarkLabel{i}", label, T_TIER, SECOND, x, tops[row] - 34,
                        "Menlo", ls=0.8))
    jsx.append("</Frame>")
    return "".join(jsx)


def spacing_section(slug, n):
    space = [(c[0], to_px(c[1])) for c in n["space"] if to_px(c[1])]
    h = 250 + len(space) * 50 + 70
    jsx = [frame(f"05 Spacing — {slug}", h)]
    head(jsx, "Spacing", "Padding and gaps at their real values. A bar that measures "
         "96px is 96px on this canvas.", "05")
    y = tier(jsx, "Space", 230, len(space), "step · px · bar")
    for i, (name, px) in enumerate(space):
        yy = y + i * 50
        jsx.append(text(f"SpName{i}", name, T_ROW, INK, PAD, yy, "Menlo", w=170))
        jsx.append(text(f"SpPx{i}", f"{px:g}px", T_HEX, INK, PAD + 190, yy + 2,
                        "Menlo", w=100))
        jsx.append(rect(f"SpBar{i}", PAD + 320, yy + 2, max(px * 2.2, 3), 20,
                        "#0f4a3c", 4))
    jsx.append("</Frame>")
    return "".join(jsx)


def radius_section(slug, n):
    radius = [(c[0], to_px(c[1])) for c in n["radius"] if to_px(c[1])]
    h = 250 + 210 + 70
    jsx = [frame(f"06 Radius — {slug}", h)]
    head(jsx, "Radius", "Corners drawn at their real radius on a 120px square. Pill "
         "is clamped to half the box so it reads as a pill.", "06")
    y = tier(jsx, "Radius", 230, len(radius), "square drawn at the token value")
    for i, (name, px) in enumerate(radius):
        x = PAD + i * 196
        jsx.append(rect(f"RaEdge{i}", x, y, 120, 120, EDGE, min(px, 60)))
        jsx.append(rect(f"RaBox{i}", x + 2, y + 2, 116, 116, "#e8e0cc", min(px, 58)))
        jsx.append(text(f"RaName{i}", name, T_ROW, INK, x, y + 144, "Menlo", w=160))
        jsx.append(text(f"RaPx{i}", f"{px:g}px", T_HEX, SECOND, x, y + 172,
                        "Menlo", w=160))
    jsx.append("</Frame>")
    return "".join(jsx)


def elevation_section(slug, n):
    items = [(c[0], c[1]) for c in n["shadow"] + n["glass"]
             if isinstance(c[1], str)]
    h = 250 + len(items) * 82 + 70
    jsx = [frame(f"07 Elevation — {slug}", h)]
    head(jsx, "Elevation", "Shadow and glass tokens. Blur is not drawable here, so "
         "each row carries the exact value next to a card at the base radius.", "07")
    y = tier(jsx, "Shadow / glass", 230, len(items), "token · value")
    for i, (name, value) in enumerate(items):
        yy = y + i * 82
        jsx.append(rect(f"ElCard{i}", PAD, yy, 210, 60, PLATE, 10))
        jsx.append(text(f"ElName{i}", name, T_ROW, INK, PAD + 240, yy + 4, w=300))
        jsx.append(text(f"ElVal{i}", value[:90], T_HEX, SECOND, PAD + 240, yy + 32,
                        "Menlo", w=900))
    jsx.append("</Frame>")
    return "".join(jsx)


def motion_section(slug, n):
    motion = [(c[0], c[1]) for c in n["motion"]]
    durs = [(k, to_px(v)) for k, v in motion if to_px(v)]
    eases = [(k, v) for k, v in motion if isinstance(v, str) and "(" in v]
    h = 250 + len(durs) * 50 + (60 + len(eases) * 50 if eases else 0) + 70
    jsx = [frame(f"08 Motion — {slug}", h)]
    head(jsx, "Motion", "Durations drawn to scale, then the easing curves as values. "
         "Longer bar means slower.", "08")
    y = tier(jsx, "Duration", 230, len(durs), "ms · bar")
    for i, (name, ms) in enumerate(durs):
        yy = y + i * 50
        jsx.append(text(f"MoName{i}", name, T_ROW, INK, PAD, yy, "Menlo", w=170))
        jsx.append(text(f"MoMs{i}", f"{ms:g}ms", T_HEX, INK, PAD + 190, yy + 2,
                        "Menlo", w=110))
        jsx.append(rect(f"MoBar{i}", PAD + 320, yy + 2, max(ms * 2.4, 3), 20,
                        "#a9713f", 4))
    y += len(durs) * 50 + 20
    if eases:
        y = tier(jsx, "Easing", y, len(eases), "cubic-bezier")
        for i, (name, value) in enumerate(eases):
            yy = y + i * 50
            jsx.append(text(f"EaName{i}", name, T_ROW, INK, PAD, yy, "Menlo", w=170))
            jsx.append(text(f"EaVal{i}", value, T_HEX, INK, PAD + 190, yy + 2,
                            "Menlo", w=700))
    jsx.append("</Frame>")
    return "".join(jsx)


def components_section(slug, n):
    comp = [(c[0], c[1]) for c in n["comp_light"] if is_hex(c[1])]
    groups = {}
    for name, hexv in comp:
        groups.setdefault(re.split(r"[-_]", name)[0] or "misc", []).append((name, hexv))
    h = 250 + sum(60 + 100 for _g in groups) + 70
    jsx = [frame(f"09 Components — {slug}", h)]
    head(jsx, "Components", "Component tokens grouped by widget: fill and ink pairs "
         "you can hand straight to a button, field or card.", "09")
    y = 230
    for gname, items in groups.items():
        y = tier(jsx, gname, y, len(items), "component tokens")
        for i, (name, hexv) in enumerate(items):
            x = PAD + i * 292
            fg = on_fill(hexv)
            jsx.append(rect(f"CpEdge{gname}{i}", x, y + 6, 272, 80, EDGE, 10))
            jsx.append(panel(f"CpChip{gname}{i}", x + 2, y + 8, 268, 76, hexv, 9,
                             text(f"CpName{gname}{i}", name[:26], T_ROLE, fg, 14, 12,
                                  w=240) +
                             text(f"CpHex{gname}{i}", hexv.upper(), T_HEX, fg, 14, 40,
                                  "Menlo", w=240)))
        y += 100
    jsx.append("</Frame>")
    return "".join(jsx)


def accessibility_section(slug, n):
    pairs = n["contrast"]
    h = 250 + max(1, len(pairs)) * 80 + 80
    jsx = [frame(f"10 Accessibility — {slug}", h)]
    head(jsx, "Accessibility", "Ratio computed from the hex values and graded against "
         "WCAG 2.1 — AA is 4.5:1 for body text, 3:1 for large type and UI edges.", "10")
    y = tier(jsx, "Contrast pairs", 230, len(pairs), "sample · ratio · grade")
    for i, (label, fg, bg, r, g) in enumerate(pairs):
        yy = y + i * 80
        # A pair the brand itself grades "large / graphic only" is drawn at large
        # text size, so the sample shows the use it is approved for — and lint
        # grades it against the 3:1 large-text bar instead of the 4.5:1 body bar.
        big = "large" in str(g).lower()
        jsx.append(panel(f"AyBg{i}", PAD, yy, 300, 62, bg, 8,
                         text(f"AySample{i}", "Aa reading sample", 26 if big else 22,
                              fg, 18, 16, "Iowan Old Style", w=270)))
        jsx.append(text(f"AyLabel{i}", label, T_ROW, INK, PAD + 330, yy + 8, w=520))
        jsx.append(text(f"AyRatio{i}", f"{r}:1", T_ROW, INK, PAD + 330, yy + 34,
                        "Menlo", w=200))
        bad = str(g).lower().startswith(("fail", "large only"))
        jsx.append(text(f"AyGrade{i}", str(g), T_ROW, "#a03b2a" if bad else INK,
                        PAD + 900, yy + 22, "Menlo", w=200))
    jsx.append("</Frame>")
    return "".join(jsx)


def imagery_section(slug, brand_dir, extra_skip=()):
    files = [p for p in sorted(brand_dir.iterdir())
             if p.suffix.lower() in (".webp", ".png", ".jpg")
             and not any(s in p.name for s in SKIP + tuple(extra_skip))]
    if not files:
        files = sorted(brand_dir.glob("*-brandkit.png"))[:1]
    nrows = max(1, (len(files) + 2) // 3)
    jsx = [frame(f"11 Imagery — {slug}", 250 + nrows * 350)]
    head(jsx, "Imagery", f"{len(files)} photographs at review size. Source files "
         f"stay in public/brand/{slug}/.", "11")
    for i, p in enumerate(files):
        x = PAD + (i % 3) * 424
        y = 240 + (i // 3) * 350
        jsx.append(rect(f"ImgEdge{i}", x, y, 400, 252, EDGE, 8))
        jsx.append(rect(f"Img{i}", x + 2, y + 2, 396, 248, PLATE, 7))
        jsx.append(text(f"ImgName{i}", p.name, T_ROLE, SECOND, x, y + 274,
                        "Menlo", w=400))
    jsx.append("</Frame>")
    return "".join(jsx), files


# ---------- svg prep ----------

def art_box(path, size):
    """Width, height at the requested width — lockups are not square, and forcing
    a square root crops the wordmark off the bottom of the frame."""
    m = re.search(r'viewBox="\s*([\d.-]+)[ ,]+([\d.-]+)[ ,]+([\d.-]+)[ ,]+([\d.-]+)',
                  path.read_text())
    if not m:
        return size, size
    vw, vh = float(m.group(3)), float(m.group(4))
    if vw <= 0:
        return size, size
    return size, round(size * vh / vw, 1)


def art_is_light(path):
    """True when a mark is drawn in pale inks (a reverse cut meant for dark ground)."""
    t = path.read_text()
    cols = [c.lower() for c in HEX.findall(t)] + \
           ["#ffffff" for _ in re.findall(r'fill="white"', t)]
    cols = [c for c in cols if c != "#000000"]
    if not cols:
        return False
    return sum(lum(c) for c in cols) / len(cols) > 0.62


def prep_svg(path, size, color=None, height=None):
    """Size the root <svg> and unwrap var() fallbacks.

    A root that already has width/height fails import_svg with "No supported SVG
    elements found in the markup" once a second pair is injected, and the renderer
    drops shapes whose fill is var(--x, #hex). Both are fixed here.
    """
    svg = VAR.sub(r"\1", path.read_text())
    if color:
        svg = HEX.sub(color, svg)

    def root(m):
        attrs = re.sub(r'\s(?:width|height)="[^"]*"', "", m.group(1))
        return f'<svg width="{size}" height="{height or size}"{attrs}>'
    return re.sub(r"<svg\b([^>]*)>", root, svg, 1)


def mark_specs(brand_dir, sizes=None, extra_skip=(), top=430):
    sizes = {**MARK_SIZE, **(sizes or {})}
    found = {p.stem: p for p in brand_dir.glob("*.svg")
             if not any(k in p.stem for k in extra_skip)}
    stems = [s for s in MARK_ORDER if s in found]
    stems += [s for s in sorted(found) if s not in MARK_ORDER]
    specs, row_h = [], {}
    for i, stem in enumerate(stems):
        col, row = i % PER_ROW, i // PER_ROW
        size = sizes.get(stem, 260)
        w, h = art_box(found[stem], size)
        row_h[row] = max(row_h.get(row, 0), h)
        specs.append((stem, size, f"{stem} · {size}px", col, row, found[stem],
                      art_is_light(found[stem]), w, h))
    tops, y = {}, top
    for row in sorted(row_h):
        tops[row] = y
        y += row_h[row] + ROW_GAP
    return specs, tops, max(780, y + 90)


def load_manifest(brand_dir):
    """Optional per-brand overrides: mark_size, skip, ground, ink, mono_marks."""
    path = brand_dir / "openpencil.json"
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError as exc:
        print("openpencil.json ignored:", exc)
        return {}


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brand-dir", required=True, type=pathlib.Path)
    ap.add_argument("--tokens", required=True, type=pathlib.Path)
    ap.add_argument("--out", required=True)
    ap.add_argument("--slug")
    ap.add_argument("--export", metavar="DIR",
                    help="also write one SVG per frame into DIR (must live under $HOME)")
    a = ap.parse_args()

    brand = a.brand_dir.expanduser()
    slug = a.slug or brand.name
    tokens = json.loads(a.tokens.expanduser().read_text())
    cfg = load_manifest(brand)

    global CREAM, INK
    CREAM = cfg.get("ground", CREAM)
    INK = cfg.get("ink", INK)
    skip = cfg.get("skip", [])
    mono = cfg.get("mono_marks", False)

    n = normalize(tokens, css_vars(brand))
    meta = n["meta"] if isinstance(n["meta"], dict) else {}
    specs, tops, marks_h = mark_specs(brand, cfg.get("mark_size"), skip)

    with OP() as op:
        op.call("new_document", {"path": a.out})
        op.render(cover(slug, n, meta))
        op.render(color_section(slug, n))
        if n["types"] or n["scale"]:
            op.render(typography_section(slug, n))
        op.render(logo_section(slug, specs, tops, marks_h))
        if any(to_px(c[1]) for c in n["space"]):
            op.render(spacing_section(slug, n))
        if any(to_px(c[1]) for c in n["radius"]):
            op.render(radius_section(slug, n))
        if any(isinstance(c[1], str) for c in n["shadow"] + n["glass"]):
            op.render(elevation_section(slug, n))
        if any(to_px(c[1]) or (isinstance(c[1], str) and "(" in c[1])
               for c in n["motion"]):
            op.render(motion_section(slug, n))
        if any(is_hex(c[1]) for c in n["comp_light"]):
            op.render(components_section(slug, n))
        if n["contrast"]:
            op.render(accessibility_section(slug, n))

        logo_id = op.first("04 Logo — " + slug)
        for i, (stem, size, label, col, row, path, _pale, w, h) in enumerate(specs):
            if not logo_id:
                break
            # brand SVGs are tight-bbox: inset the art 6% so it never kisses the frame
            aw, ah = round(w * 0.94), round(h * 0.94)
            res = op.call("import_svg", {
                "svg": prep_svg(path, aw, INK if mono else None, ah),
                "name": f"Art{i}-{stem}", "parent_id": logo_id,
                "x": PAD + col * COL_W + (max(w, 140) - aw) // 2,
                "y": tops[row] + (max(h, 88) - ah) // 2})
            if res.get("id"):
                # import_svg wraps the art in a white tile; match the sheet
                op.call("set_fill", {"id": res["id"], "color": CREAM})
            else:
                print("import failed", stem, str(res)[:110])

        jsx, files = imagery_section(slug, brand, skip)
        op.render(jsx)
        for i, p in enumerate(files):
            nid = op.first(f"Img{i}")
            if not nid:
                continue
            data = p.read_bytes()
            if len(data) > 3_800_000:
                print("skip large", p.name)
                continue
            op.call("set_image_fill", {"id": nid,
                                       "image_data": base64.b64encode(data).decode(),
                                       "scale_mode": "FILL"})

        if a.export:
            outdir = pathlib.Path(a.export).expanduser()
            outdir.mkdir(parents=True, exist_ok=True)
            # stale numbered proofs from an earlier run outlive a skipped export
            for old in outdir.glob(f"{slug}-[0-9][0-9].svg"):
                old.unlink()
            for child in (op.call("get_page_tree", {}).get("children") or []):
                tag = child["name"].split()[0]
                res = op.call("export_svg", {"ids": [child["id"]],
                                             "path": str(outdir / f"{slug}-{tag}.svg")})
                if not res.get("written"):
                    print("export failed", child["name"], str(res)[:100])

        # save_file writes a project bundle (zip: canvas.fig + images/ + meta.json)
        print(op.save(a.out))
        print(f"board · {len(specs)} marks · {len(files)} images · {slug}")


if __name__ == "__main__":
    main()
