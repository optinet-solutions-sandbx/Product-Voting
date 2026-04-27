#!/usr/bin/env python3
"""
build_combined_doc.py — Stitch every spec in tools/specs/*.json into one
clean Markdown document for human reading + LLM ingestion.

Usage:
    python tools/build_combined_doc.py
    python tools/build_combined_doc.py --output docs/IDEAS.md
"""

from __future__ import annotations
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPECS_DIR = ROOT / "tools" / "specs"
DEFAULT_OUTPUT = ROOT / "WEEKEND_CHALLENGE_IDEAS.md"

# Order to print submitters — matches data.js / Apps Script SUBMITTER_ORDER
SUBMITTER_ORDER = [
    "jose", "ianjay", "revo", "jas", "cathy",
    "ralph", "ciri", "leo", "ivan", "john"
]


def load_specs() -> list[dict]:
    specs = []
    for slug in SUBMITTER_ORDER:
        path = SPECS_DIR / f"{slug}.json"
        if not path.exists():
            print(f"[warn] missing spec: {path.name}")
            continue
        specs.append(json.loads(path.read_text(encoding="utf-8")))
    return specs


def render(specs: list[dict]) -> str:
    out: list[str] = []

    # Header
    out.append("# AI Engineering — Weekend Challenge")
    out.append("## All Submitted Ideas")
    out.append("")
    out.append("Internal team brainstorm. 10 teammates × 3 product ideas each = "
               "**30 candidate products**.")
    out.append("")
    out.append("- The team votes for **one idea per teammate**.")
    out.append("- The **top 10** (one winner per teammate) go straight to build.")
    out.append("- **€1,000 cash** to whoever's idea lands the first paying customer.")
    out.append("")

    # Index
    out.append("---")
    out.append("")
    out.append("## Index")
    out.append("")
    for i, s in enumerate(specs, 1):
        person = s["person"]
        titles = ", ".join(p["title"] for p in s["products"])
        out.append(f"{i:02d}. **{person['name']}** — {titles}")
    out.append("")

    # Per-submitter sections
    for i, s in enumerate(specs, 1):
        person = s["person"]
        role = person.get("role", "")
        out.append("---")
        out.append("")
        out.append(f"## {i:02d}. {person['name']}")
        if role:
            out.append(f"*{role}*")
        out.append("")

        for j, p in enumerate(s["products"], 1):
            out.append(f"### Idea {i:02d}.{j} — {p['title']}")
            if p.get("tagline"):
                out.append(f"*{p['tagline']}*")
            out.append("")

            meta_parts = []
            if p.get("category"):
                meta_parts.append(f"**Category:** {p['category']}")
            if p.get("impact"):
                meta_parts.append(f"**Impact:** {p['impact']}")
            if meta_parts:
                out.append(" · ".join(meta_parts))
                out.append("")

            if p.get("description"):
                out.append("**The product**  ")
                out.append(p["description"])
                out.append("")

            if p.get("flow"):
                out.append("**Pipeline:**")
                for n, step in enumerate(p["flow"], 1):
                    out.append(f"{n}. {step}")
                out.append("")

            if p.get("subject_line"):
                out.append("**Cold-email subject:**  ")
                out.append(f"> {p['subject_line']}")
                out.append("")

            if p.get("delivers"):
                out.append("**What the AI delivers:**")
                for d in p["delivers"]:
                    out.append(f"- {d}")
                out.append("")

            if p.get("wins"):
                out.append("**Why this wins:**")
                for w in p["wins"]:
                    out.append(f"- {w}")
                out.append("")

            if p.get("before_bullets") or p.get("after_bullets"):
                out.append("**Before vs After**")
                out.append("")
                if p.get("before_bullets"):
                    label = p.get("before_label") or "Before"
                    out.append(f"*{label}:*")
                    for b in p["before_bullets"]:
                        out.append(f"- {b}")
                    out.append("")
                if p.get("after_bullets"):
                    label = p.get("after_label") or f"The {p['title']} Platform"
                    out.append(f"*{label}:*")
                    for b in p["after_bullets"]:
                        out.append(f"- {b}")
                    out.append("")

            if p.get("why_works"):
                out.append("**Why it works**  ")
                out.append(p["why_works"])
                out.append("")

            out.append("")

    out.append("---")
    out.append("")
    out.append(f"*Generated from `tools/specs/*.json`. Total: "
               f"**{sum(len(s['products']) for s in specs)} ideas across "
               f"{len(specs)} teammates**.*")
    out.append("")

    return "\n".join(out)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT),
                        help="Output Markdown path (default: WEEKEND_CHALLENGE_IDEAS.md)")
    args = parser.parse_args()

    specs = load_specs()
    if not specs:
        print("No specs found.")
        return

    md = render(specs)
    out_path = Path(args.output).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(md, encoding="utf-8")

    chars = len(md)
    lines = md.count("\n") + 1
    print(f"Wrote {out_path.relative_to(ROOT)}")
    print(f"  {len(specs)} submitters · "
          f"{sum(len(s['products']) for s in specs)} ideas · "
          f"{lines} lines · {chars:,} chars")


if __name__ == "__main__":
    main()
