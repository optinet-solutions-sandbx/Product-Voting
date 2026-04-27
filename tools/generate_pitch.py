#!/usr/bin/env python3
"""
generate_pitch.py — Generate the 3 pitch infographics for a single submitter
in the same visual style as the reference image.

Usage:
    python tools/generate_pitch.py --spec tools/specs/maria.json
    python tools/generate_pitch.py --spec tools/specs/maria.json --provider openai
    python tools/generate_pitch.py --spec tools/specs/maria.json --only 2

Spec JSON format:
{
  "person": {
    "slug": "maria",
    "name": "Maria Lopez",
    "role": "Engineering"
  },
  "products": [
    {
      "n": 1,
      "title": "ProductX",
      "tagline": "One-line subtitle",
      "category": "SaaS",
      "color": "blue",
      "description": "Long paragraph explaining what the product does and how AI powers it.",
      "flow": ["Step 1", "Step 2", "Step 3", "Step 4"],
      "subject_line": "Email subject for outreach",
      "delivers": ["AI feature 1", "AI feature 2", "AI feature 3", "AI feature 4", "AI feature 5"],
      "wins":     ["Reason 1",   "Reason 2",   "Reason 3",   "Reason 4",   "Reason 5"],
      "before_label": "Old approach",
      "before_bullets": ["pain 1", "pain 2", "pain 3", "pain 4"],
      "after_label":  "The ProductX Platform",
      "after_bullets":  ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
      "why_works": "One-line summary of why the whole loop works."
    },
    { "...": "...repeat for product 2..." },
    { "...": "...repeat for product 3..." }
  ]
}

Output:
    Writes PNGs to: assets/img/<slug>/1.png, 2.png, 3.png
    Prints suggested data.js entry to stdout for copy-paste.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
DEFAULT_REFERENCE = ROOT / "tools" / "reference" / "style.png"


def die(msg: str, code: int = 1) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def lazy_load_dotenv() -> None:
    try:
        from dotenv import load_dotenv
    except ImportError:
        die("python-dotenv missing. Run: pip install -r tools/requirements.txt")
    load_dotenv(ROOT / ".env")


# ---------------------------------------------------------------------------
# Prompt construction
# ---------------------------------------------------------------------------
STYLE_INSTRUCTIONS = """\
Generate a horizontal product-pitch infographic at 1280x800 pixels in the EXACT
visual style of the attached reference image. Match these style rules precisely:

- Off-white background (#F8F4EE)
- Clean illustrated infographic aesthetic
- Top-left: a colored rounded-square badge with the product number, sized large,
  followed by the product title in bold sans-serif and a smaller subtitle line
- Below the title block: 4-6 lines of dark-grey description text on the left half
- Right half of the top section: 4 circular icons connected by arrows showing the
  pipeline flow steps (one icon + label per step, simple flat illustration)
- Middle row: two side-by-side panels with rounded corners. Left panel labeled
  with the BEFORE state (red-tinted), right panel labeled "The {title} Platform"
  (green-tinted), each containing simple flat illustrations of people/screens
  plus a bulleted list (X marks for left, green checkmarks for right)
- Right of the panels: a "What the AI Delivers" callout block with 5 icon+label
  bullets, then a "Why This Wins" callout block with 5 icon+label bullets
- Bottom: a yellow callout strip with a lightbulb icon labeled "Why It Works"
  and a one-line summary
- Use the same illustration style, the same color blocks, the same fonts and
  spacing as the reference. The output must look like it came from the same
  series as the reference image.
"""


def build_prompt(product: dict) -> str:
    """Compose the user-facing prompt that fills the template with product data."""
    n = product.get("n", 1)
    color = product.get("color", "blue")
    title = product["title"]
    tagline = product.get("tagline", "")
    category = product.get("category", "")
    description = product.get("description", "")
    flow = product.get("flow", [])
    subject = product.get("subject_line", "")
    delivers = product.get("delivers", [])
    wins = product.get("wins", [])
    before_label = product.get("before_label", "Traditional approach")
    after_label = product.get("after_label", f"The {title} Platform")
    before_bullets = product.get("before_bullets", [])
    after_bullets = product.get("after_bullets", [])
    why_works = product.get("why_works", "")

    return f"""{STYLE_INSTRUCTIONS}

POPULATE WITH THIS PRODUCT:

- Number badge: {n}, color: {color}
- Title: {title}
- Subtitle next to title: {title} — {tagline}
- Category tag (small, near top): {category}

- Left description block (5–6 lines):
  {description}

- 4 flow icon labels (in order):
  {json.dumps(flow)}

- Subject Line callout text:
  "Subject Line: {subject}"

- Before panel header: "{before_label}"
- Before panel bullets (red X icons):
  {json.dumps(before_bullets)}

- After panel header: "{after_label}"
- After panel bullets (green checkmark icons):
  {json.dumps(after_bullets)}

- "What the AI Delivers" — 5 icon+label bullets:
  {json.dumps(delivers)}

- "Why This Wins" — 5 icon+label bullets:
  {json.dumps(wins)}

- Bottom yellow "Why It Works" line:
  {why_works}

CRITICAL: Render every text label clearly and legibly. Match the reference
image's color saturation, line weight, illustration style, and layout grid.
"""


# ---------------------------------------------------------------------------
# Provider: Gemini
# ---------------------------------------------------------------------------
def generate_with_gemini(prompt: str, reference_path: Path) -> bytes:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        die("GEMINI_API_KEY missing in .env")

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        die("google-genai missing. Run: pip install -r tools/requirements.txt")

    model = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image-preview").strip()
    print(f"  - Gemini provider - model: {model}", file=sys.stderr)

    client = genai.Client(api_key=api_key)
    ref_bytes = reference_path.read_bytes()
    ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")

    response = client.models.generate_content(
        model=model,
        contents=[ref_part, prompt],
    )

    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None) and part.inline_data.data:
            data = part.inline_data.data
            if isinstance(data, str):
                data = base64.b64decode(data)
            return data

    die("Gemini returned no image. Try again or switch provider.")


# ---------------------------------------------------------------------------
# Provider: OpenAI
# ---------------------------------------------------------------------------
def generate_with_openai(prompt: str, reference_path: Path) -> bytes:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        die("OPENAI_API_KEY missing in .env")

    try:
        from openai import OpenAI
    except ImportError:
        die("openai missing. Run: pip install -r tools/requirements.txt")

    model = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1").strip()
    print(f"  - OpenAI provider - model: {model}", file=sys.stderr)

    client = OpenAI(api_key=api_key)
    with reference_path.open("rb") as f:
        result = client.images.edit(
            model=model,
            image=f,
            prompt=prompt,
            size="1536x1024",
        )
    b64 = result.data[0].b64_json
    return base64.b64decode(b64)


# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------
def write_image(png_bytes: bytes, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(png_bytes)
    print(f"  [ok] wrote {out.relative_to(ROOT)}", file=sys.stderr)


def emit_data_js_snippet(spec: dict) -> None:
    """Print a ready-to-paste JS object for data.js."""
    p = spec["person"]
    products = spec["products"]
    slug = p["slug"]
    print("\n---- PASTE INTO assets/js/data.js (replace next pending slot) ----\n")
    ideas = []
    for prod in products:
        n = prod.get("n", 1)
        ideas.append(f"""      {{
        id: "{slug}-{n:02d}",
        title: {json.dumps(prod['title'])},
        tagline: {json.dumps(prod.get('tagline', ''))},
        category: {json.dumps(prod.get('category', ''))},
        teaser: {json.dumps(prod.get('description', ''))},
        bullets: {json.dumps(prod.get('wins', [])[:3])},
        subjectLine: {json.dumps(prod.get('subject_line', ''))},
        image: "assets/img/{slug}/{n}.png",
        impact: {json.dumps(prod.get('impact', 'High'))}
      }}""")
    print("  {")
    print(f'    id: {json.dumps(slug)},')
    print(f'    name: {json.dumps(p["name"])},')
    print(f'    role: {json.dumps(p.get("role", ""))},')
    print(f'    initials: {json.dumps("".join([w[0] for w in p["name"].split()][:2]).upper())},')
    print(f'    pending: false,')
    print(f'    ideas: [\n{",\\n".join(ideas)}\n    ]')
    print("  },")
    print("\n------------------------------------------------------------------\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", required=True, help="Path to product spec JSON.")
    parser.add_argument("--provider", default=None, choices=["gemini", "openai"])
    parser.add_argument("--reference", default=str(DEFAULT_REFERENCE),
                        help="Path to style reference image.")
    parser.add_argument("--only", type=int, default=None,
                        help="Generate only product N (1-3). Default: all 3.")
    args = parser.parse_args()

    lazy_load_dotenv()
    spec_path = Path(args.spec).resolve()
    if not spec_path.exists():
        die(f"Spec not found: {spec_path}")
    spec = json.loads(spec_path.read_text(encoding="utf-8"))

    reference_path = Path(args.reference).resolve()
    if not reference_path.exists():
        die(f"Reference image not found: {reference_path}")

    provider = args.provider or os.getenv("IMAGE_PROVIDER", "gemini").strip().lower()
    if provider not in ("gemini", "openai"):
        die(f"Invalid provider: {provider}")
    print(f"Provider: {provider}", file=sys.stderr)

    slug = spec["person"]["slug"]
    out_dir = ROOT / "assets" / "img" / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    products = spec["products"]
    if args.only:
        products = [p for p in products if p.get("n") == args.only]
        if not products:
            die(f"No product with n={args.only} in spec.")

    print(f"Generating {len(products)} pitch image(s) for {slug} -->", file=sys.stderr)

    for prod in products:
        n = prod.get("n", 1)
        print(f"\n[{n}/3] {prod['title']}", file=sys.stderr)
        prompt = build_prompt(prod)
        if provider == "gemini":
            png = generate_with_gemini(prompt, reference_path)
        else:
            png = generate_with_openai(prompt, reference_path)
        write_image(png, out_dir / f"{n}.png")

    emit_data_js_snippet(spec)
    print(f"\nDone. Images written to: assets/img/{slug}/", file=sys.stderr)


if __name__ == "__main__":
    main()
