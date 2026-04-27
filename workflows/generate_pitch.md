# Workflow — Generate Pitch Images for a Submitter

**Goal:** turn a person's 3 product ideas into 3 pitch infographics (matching the
reference style) and surface them in the voting app.

## Inputs

1. Person info: full name, role (optional), slug (lowercase, no spaces).
2. Three product ideas. For each: title, tagline, description, 4 flow steps,
   subject line, before/after bullets, "AI delivers" bullets, "why this wins"
   bullets, "why it works" summary.
3. `.env` populated with `GEMINI_API_KEY` (and/or `OPENAI_API_KEY`).

## Steps

1. Copy the user's product info into a spec file:
   `cp tools/specs/_template.json tools/specs/<slug>.json`
   then edit. (Or have the agent fill it from a free-form pasted brief.)

2. Generate the 3 images:
   ```
   python tools/generate_pitch.py --spec tools/specs/<slug>.json
   ```
   Override the provider with `--provider openai` if Gemini results are weak.
   Regenerate a single image with `--only 2`.

3. The script writes `assets/img/<slug>/1.png 2.png 3.png` and prints a JS
   snippet to paste into `assets/js/data.js` — replace the next `_pN`
   pending placeholder with the printed object.

4. Reload the app to verify. If an image looks off, regenerate just that one
   with `--only N`.

## Reference

- Style anchor: `tools/reference/style.png` (one of Jose's pitches). Update
  this if a cleaner reference becomes available.
- The lightbox in `vote.html` shows the full pitch image at readable size.
- The card unexpanded state does not show the dense image — it shows a
  designed CSS card built from the same spec data (title, tagline, bullets,
  subject line). This keeps the unexpanded view scannable.

## Known constraints

- Gemini's `gemini-2.5-flash-image-preview` model is good at "edit this image
  in the same style" but text legibility is imperfect. Expect to regenerate.
- OpenAI's `gpt-image-1` via the edits endpoint requires the reference image
  ≤ 4MB and PNG/WebP. The `tools/reference/style.png` already qualifies.
- Both providers may rotate or compress; verify each output before publishing.
- Cost: each image is one paid API call. Three images per person × N people.
