#!/usr/bin/env python3
"""
optimize_images.py — Convert pitch PNGs to compact WebP.

For these dense infographics, WebP at q=88 is typically 70-90% smaller than
the source PNG with no perceptible quality loss. Browser support is ~99%.

Usage:
    python tools/optimize_images.py            # convert and delete originals
    python tools/optimize_images.py --keep-png # convert and keep PNGs
"""

from __future__ import annotations
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install -r tools/requirements.txt",
          file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "img"
MAX_WIDTH = 1400      # lightbox max display width
WEBP_QUALITY = 88     # near-lossless for text + illustration
WEBP_METHOD = 6       # 0=fastest, 6=smallest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--keep-png", action="store_true",
                        help="Keep the original PNGs after writing WebP.")
    args = parser.parse_args()

    pngs = sorted(IMG_DIR.glob("*/*.png"))
    if not pngs:
        print("No PNGs found under assets/img/", file=sys.stderr)
        return

    total_before = 0
    total_after = 0
    print(f"Converting {len(pngs)} image(s)...\n", file=sys.stderr)

    for png in pngs:
        before = png.stat().st_size
        total_before += before

        img = Image.open(png)
        if img.mode == "P":
            img = img.convert("RGBA")
        if img.mode == "RGBA":
            # Drop alpha for these full-bleed infographics (no transparency)
            bg = Image.new("RGB", img.size, (248, 244, 238))  # bone background
            bg.paste(img, mask=img.split()[3])
            img = bg
        else:
            img = img.convert("RGB")

        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)

        webp_path = png.with_suffix(".webp")
        img.save(webp_path, "WebP", quality=WEBP_QUALITY, method=WEBP_METHOD)
        after = webp_path.stat().st_size
        total_after += after

        pct = 100 - (after / before * 100)
        rel = png.relative_to(ROOT).as_posix()
        print(f"  {rel}: {before/1024:>6.0f} KB -> {after/1024:>6.0f} KB  "
              f"({pct:.0f}% off)", file=sys.stderr)

        if not args.keep_png:
            png.unlink()

    print(f"\nTotal: {total_before/1024/1024:.1f} MB -> {total_after/1024/1024:.1f} MB"
          f"  ({100 - (total_after/total_before*100):.0f}% off)", file=sys.stderr)


if __name__ == "__main__":
    main()
