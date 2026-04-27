#!/usr/bin/env python3
"""
generate_all.py — Run generate_pitch.py against every spec in tools/specs/.

Usage:
    python tools/generate_all.py
    python tools/generate_all.py --provider openai
    python tools/generate_all.py --skip jose,ianjay   # comma-separated slugs
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPECS_DIR = ROOT / "tools" / "specs"
GENERATOR = ROOT / "tools" / "generate_pitch.py"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--provider", default=None, choices=["gemini", "openai"])
    parser.add_argument("--skip", default="", help="Comma-separated slugs to skip.")
    parser.add_argument("--only", default="", help="Comma-separated slugs to ONLY run.")
    args = parser.parse_args()

    skip = {s.strip() for s in args.skip.split(",") if s.strip()}
    only = {s.strip() for s in args.only.split(",") if s.strip()}

    specs = sorted(p for p in SPECS_DIR.glob("*.json") if not p.name.startswith("_"))
    if only:
        specs = [s for s in specs if s.stem in only]
    if skip:
        specs = [s for s in specs if s.stem not in skip]

    if not specs:
        print("No specs to process.", file=sys.stderr)
        return

    print(f"\n[batch] {len(specs)} submitter(s) queued: "
          f"{', '.join(s.stem for s in specs)}\n", file=sys.stderr)

    failures = []
    for i, spec in enumerate(specs, 1):
        print(f"\n========== [{i}/{len(specs)}] {spec.stem.upper()} ==========",
              file=sys.stderr)
        cmd = [sys.executable, str(GENERATOR), "--spec", str(spec)]
        if args.provider:
            cmd.extend(["--provider", args.provider])
        t0 = time.time()
        result = subprocess.run(cmd, cwd=str(ROOT))
        dt = time.time() - t0
        if result.returncode != 0:
            failures.append(spec.stem)
            print(f"[batch] FAILED: {spec.stem} ({dt:.1f}s)", file=sys.stderr)
        else:
            print(f"[batch] OK: {spec.stem} ({dt:.1f}s)", file=sys.stderr)

    print("\n========== BATCH COMPLETE ==========", file=sys.stderr)
    print(f"  succeeded: {len(specs) - len(failures)}", file=sys.stderr)
    print(f"  failed:    {len(failures)}", file=sys.stderr)
    if failures:
        print(f"  failed slugs: {', '.join(failures)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
