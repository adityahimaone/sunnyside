#!/usr/bin/env python3
"""
Build the favicon family from one transparent mark PNG.

  python scripts/favicons.py --source mark-1024.png --out public/brand

Creates:
  favicon-16.png, favicon-32.png, favicon-48.png  (transparent)
  icon-192.png, icon-512.png                     (on --background)
  apple-icon.png 180                             (on --background)
  favicon.ico                                    (16/32/48)

Requires Pillow. Render the source PNG from the SVG first, at 1024px with a
transparent background. The mark should already include its own tile.
"""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
parser.add_argument('--out', required=True)
parser.add_argument('--background', default='#f3ecdf')
parser.add_argument('--inset', type=float, default=0.14,
                    help='Margin around the mark on opaque icons (0–0.4).')
args = parser.parse_args()

out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
source = Image.open(args.source).convert('RGBA')
background = Image.new('RGBA', source.size, args.background)
background.alpha_composite(source)
opaque = background.convert('RGB')


def fit(image: Image.Image, size: int, inset: float) -> Image.Image:
    inner = max(1, round(size * (1 - inset * 2)))
    copy = image.copy()
    copy.thumbnail((inner, inner), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    x = (size - copy.width) // 2
    y = (size - copy.height) // 2
    canvas.alpha_composite(copy, (x, y))
    return canvas


for size in (16, 32, 48):
    image = source.copy()
    image.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(image, ((size - image.width) // 2, (size - image.height) // 2))
    canvas.save(out / f'favicon-{size}.png', optimize=True)

for size in (192, 512):
    icon = fit(source, size, args.inset)
    base = Image.new('RGBA', (size, size), args.background)
    base.alpha_composite(icon)
    base.convert('RGB').save(out / f'icon-{size}.png', optimize=True)

apple = fit(source, 180, args.inset)
apple_base = Image.new('RGBA', (180, 180), args.background)
apple_base.alpha_composite(apple)
apple_base.convert('RGB').save(out / 'apple-icon.png', optimize=True)

ico_source = Image.open(out / 'favicon-48.png').convert('RGBA')
ico_source.save(out / 'favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

for path in sorted(out.glob('favicon*')) + sorted(out.glob('icon-*')) + [out / 'apple-icon.png']:
    print(path)
