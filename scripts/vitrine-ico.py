#!/usr/bin/env python3
"""Pack the three favicon PNGs into one ICO, preserving each exact size."""
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = [16, 32, 48]
out = ROOT / "public/brand/vitrine/favicon.ico"


def png_size(path: Path):
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"not a PNG: {path}")
    width, height = struct.unpack(">II", data[16:24])
    return data, width, height


entries = []
payload = b""
offset = 6 + 16 * len(FILES)
for size in FILES:
    data, width, height = png_size(ROOT / f"public/brand/vitrine/favicon-{size}.png")
    if width != size or height != size:
        raise SystemExit(f"expected {size}x{size}, got {width}x{height}")
    entries.append(
        struct.pack(
            "<BBBBHHII",
            width if width < 256 else 0,
            height if height < 256 else 0,
            0,
            0,
            1,
            32,
            len(data),
            offset,
        )
    )
    payload += data
    offset += len(data)

ico = struct.pack("<HHH", 0, 1, len(FILES)) + b"".join(entries) + payload
out.write_bytes(ico)
print(f"{out} — {len(FILES)} sizes, {len(ico)} bytes")
