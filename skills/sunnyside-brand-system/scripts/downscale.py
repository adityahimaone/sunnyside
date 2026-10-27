#!/usr/bin/env python3
"""Downscale a PNG with Lanczos and save an optimised copy."""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('source')
parser.add_argument('out')
parser.add_argument('width', type=int)
parser.add_argument('height', type=int)
args = parser.parse_args()

image = Image.open(args.source).convert('RGB')
image = image.resize((args.width, args.height), Image.LANCZOS)
Path(args.out).parent.mkdir(parents=True, exist_ok=True)
image.save(args.out, optimize=True)
print(f'{args.out} — {args.width} × {args.height}')
