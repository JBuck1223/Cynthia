#!/usr/bin/env python3
"""Generate Cynthia Music logo options and course covers via fal.ai."""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/Users/jordanbuckingham/Desktop/cynthia-productions")
OUT_LOGOS = ROOT / "public/images/brand/logos"
OUT_COVERS = ROOT / "public/images/brand/covers"
VF_ENV = Path("/Users/jordanbuckingham/Desktop/vibrationfit/.env.local")

BRAND = (
    "Brand: Cynthia Music, a modern Sarasota Florida piano school for families. "
    "Bright beach colors only: foam white, sand cream #FFF8F1, gulf aqua #2BBCD0, "
    "deep gulf #0E8A9C, horizon teal #1A4652, sunset coral #FF7A5C, peach #FFE6D4. "
    "Feel: light, airy, contemporary, coastal — not vintage, not WordPress, not clipart, not gothic."
)


def load_fal_key() -> str:
    for line in VF_ENV.read_text().splitlines():
        if line.startswith("FAL_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("FAL_KEY not found in vibrationfit .env.local")


def fal_run(model: str, payload: dict, timeout: int = 180) -> dict:
    key = os.environ["FAL_KEY"]
    req = urllib.request.Request(
        f"https://fal.run/{model}",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Key {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            return json.loads(res.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise RuntimeError(f"{model} HTTP {e.code}: {body[:800]}") from e


def first_image_url(data: dict) -> str:
    if isinstance(data.get("images"), list) and data["images"]:
        item = data["images"][0]
        return item["url"] if isinstance(item, dict) else item
    image = data.get("image")
    if isinstance(image, dict) and image.get("url"):
        return image["url"]
    raise RuntimeError(f"No image url in response keys={list(data)[:12]}")


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "cynthia-music-brand/1"})
    with urllib.request.urlopen(req, timeout=120) as res, dest.open("wb") as f:
        f.write(res.read())


def generate(job: dict) -> str:
    dest: Path = job["dest"]
    if dest.exists() and dest.stat().st_size > 1000:
        print(f"skip {job['name']} (exists)", flush=True)
        return str(dest)
    t0 = time.time()
    print(f"→ {job['name']} ({job['model']})", flush=True)
    data = fal_run(job["model"], job["payload"])
    url = first_image_url(data)
    dest: Path = job["dest"]
    download(url, dest)
    print(f"✓ {job['name']} → {dest.relative_to(ROOT)} ({time.time() - t0:.1f}s)", flush=True)
    return str(dest)


LOGOS = [
    {
        "name": "logo-wordmark-wave",
        "dest": OUT_LOGOS / "01-wordmark-wave.png",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Professional wordmark logo, centered, plenty of cream white margin. "
                'The word "Cynthia" in an elegant high-contrast serif, gulf-deep teal #0E8A9C. '
                'Under it, the word "MUSIC" in small widely-tracked sans-serif, sunset coral #FF7A5C. '
                "A single thin aqua wave line underlines the type. Clean vector logo, flat, no shadows, "
                "no photography, no people, no extra words, no tagline, no icons besides the wave. "
                "Looks like a premium lifestyle brand, not a church flyer."
            ),
            "image_size": "square_hd",
            "style": "AUTO",
            "style_preset": "GEO_MINIMALIST",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "logo-piano-wave-lockup",
        "dest": OUT_LOGOS / "02-piano-wave-lockup.png",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Horizontal logo lockup on cream white. Left: a simple circular mark — "
                "three white piano keys forming a gentle gulf wave inside a teal circle #2BBCD0. "
                'Right: "Cynthia" in elegant serif #1A4652 stacked over "Music" in aqua #2BBCD0. '
                "Modern music-school identity, vector, flat, generous padding. No extra text, no photos."
            ),
            "image_size": "square_hd",
            "style": "AUTO",
            "style_preset": "FLAT_VECTOR",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "logo-sunrise-badge",
        "dest": OUT_LOGOS / "03-sunrise-badge.png",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Circular emblem badge on cream white background. Coral sun rising over a "
                "teal gulf horizon. Tiny piano keys sit along the waterline like a dock. "
                'Arc type around the top reads "CYNTHIA MUSIC" in clean sans-serif. '
                "Modern travel-poster badge, simple shapes, no busy detail, no extra words."
            ),
            "image_size": "square_hd",
            "style": "AUTO",
            "style_preset": "TRAVEL_POSTER",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "logo-dove-wave",
        "dest": OUT_LOGOS / "04-dove-wave.png",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Minimal line-art logo on cream white. A dove in flight whose wings become "
                "a single gulf wave, drawn in teal #0E8A9C with a tiny coral accent on the beak. "
                'Centered underneath: "Cynthia Music" in elegant serif. Healing, music, beach. '
                "Vector, airy, not religious clipart, no extra text, no halo, no people."
            ),
            "image_size": "square_hd",
            "style": "AUTO",
            "style_preset": "MINIMAL_ILLUSTRATION",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "logo-cm-monogram",
        "dest": OUT_LOGOS / "05-cm-monogram.png",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Distinctive geometric monogram on cream white. A large letter C made of "
                "a curved piano keyboard wrapping a smaller letter M. Teal #2BBCD0 and coral #FF7A5C. "
                'Tiny wordmark under the monogram: "Cynthia Music". Square app-icon friendly, '
                "bold, modern, high contrast, vector. No extra text."
            ),
            "image_size": "square_hd",
            "style": "AUTO",
            "style_preset": "ICONIC",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "logo-horizon-script",
        "dest": OUT_LOGOS / "06-horizon-script.png",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Refined wordmark on cream white. The name \"Cynthia\" in a modern "
                "high-end script (not bubbly, not wedding calligraphy), gulf-deep #0E8A9C. "
                "A thin horizon line runs through the letters like a shoreline. "
                'Below, "MUSIC" in tiny widely spaced caps, coral. Sophisticated coastal brand. '
                "No extra words, no flourishes, no photos."
            ),
            "image_size": "square_hd",
            "style": "AUTO",
            "style_preset": "EDITORIAL",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "logo-icon-only",
        "dest": OUT_LOGOS / "07-icon-piano-sun.png",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} App icon / favicon, centered, cream rounded-square background. "
                "Simple mark only: a coral sun over three white piano keys that form a gulf wave. "
                "No letters, no words, no Cynthia, no Music. Ultra-simple, 2-3 shapes, "
                "works at 32px. Flat vector, generous padding."
            ),
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        },
    },
]

COVERS = [
    {
        "name": "cover-one-hour-piano",
        "dest": OUT_COVERS / "one-hour-piano.jpg",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Online course cover, landscape 4:3, bright and modern. "
                "A black grand piano sitting on white Sarasota sand at the water's edge, lid open, "
                "keys catching late-afternoon light. Soft aqua gulf and peach sky. "
                'Large elegant title at the top: "One Hour Piano". '
                'Subtitle: "Sit down today. Play tonight." '
                'Small brand at the bottom: "Cynthia Music". '
                "Plenty of empty sky, graphic poster, no people, no photo collage, no stock smiling family."
            ),
            "image_size": "landscape_4_3",
            "style": "AUTO",
            "style_preset": "TRAVEL_POSTER",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "cover-music-is-numbers",
        "dest": OUT_COVERS / "music-is-numbers.jpg",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Online course cover, landscape 4:3, bright modern poster. "
                "A piano keyboard becomes a shoreline. Large elegant numbers 1 4 5 1 float "
                "above the water like notes, painted in gulf teal and coral. Peach-aqua sky. "
                'Title in large serif: "Music is Numbers". '
                'Subtitle: "Compose with the Nashville number system." '
                'Footer: "Cynthia Music". Clean, airy, no people, no sheet-music clutter.'
            ),
            "image_size": "landscape_4_3",
            "style": "AUTO",
            "style_preset": "BRIGHT_ART",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "cover-play-thousands",
        "dest": OUT_COVERS / "play-thousands.jpg",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Online course cover, landscape 4:3, energetic but light. "
                "A piano keyboard stretching to a vanishing point over gulf water at coral sunset. "
                "Tiny staff lines become birds or waves on the horizon. "
                'Large title: "Play Thousands of Songs". '
                'Subtitle: "Find any scale. Build any chord. Play the song." '
                'Footer: "Cynthia Music". Modern poster, no people, no dark overlays.'
            ),
            "image_size": "landscape_4_3",
            "style": "AUTO",
            "style_preset": "TRAVEL_POSTER",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "cover-piano-bundle",
        "dest": OUT_COVERS / "piano-bundle.jpg",
        "model": "fal-ai/ideogram/v3",
        "payload": {
            "prompt": (
                f"{BRAND} Online course bundle cover, landscape 4:3. Three small scenes in one "
                "bright coastal composition: a piano on sand, floating numbers 1-5, a keyboard "
                "horizon at sunset. Unified cream-aqua-coral palette. "
                'Large title: "The Piano Family Bundle". '
                'Subtitle: "All three courses. One bench." '
                'Footer: "Cynthia Music". Modern, generous sky, no people, no cluttered collage.'
            ),
            "image_size": "landscape_4_3",
            "style": "AUTO",
            "style_preset": "EDITORIAL",
            "rendering_speed": "QUALITY",
            "expand_prompt": False,
            "num_images": 1,
        },
    },
    {
        "name": "cover-one-hour-alt",
        "dest": OUT_COVERS / "one-hour-piano-alt.jpg",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Cinematic but bright course thumbnail, 4:3. Close-up of piano keys in "
                "sunlight with soft gulf water bokeh behind them. Cream and aqua. "
                "Typography overlay, perfectly spelled: title 'One Hour Piano' in elegant serif "
                "at the top, subtitle 'Sit down today. Play tonight.' near the bottom, "
                "tiny 'Cynthia Music' in the corner. No people. Photoreal coastal, airy, modern."
            ),
            "aspect_ratio": "4:3",
            "resolution": "2K",
            "output_format": "jpeg",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "cover-music-is-numbers-alt",
        "dest": OUT_COVERS / "music-is-numbers-alt.jpg",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Bright 4:3 course cover. A piano keyboard at the waterline of a "
                "turquoise gulf, with large elegant numbers 1 4 5 1 hovering above the keys "
                "like they are made of glass and sunlight. Peach sky. "
                "Perfect typography: title 'Music is Numbers' in large teal serif at the top. "
                "Subtitle 'Compose with the Nashville number system.' near the bottom. "
                "Small 'Cynthia Music' in a corner. No people, no extra words, airy, modern."
            ),
            "aspect_ratio": "4:3",
            "resolution": "2K",
            "output_format": "jpeg",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "cover-play-thousands-alt",
        "dest": OUT_COVERS / "play-thousands-alt.jpg",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Bright 4:3 course cover. A piano keyboard stretching toward a coral "
                "sunset over the gulf, keys becoming a boardwalk into the horizon. "
                "Perfect typography: title 'Play Thousands of Songs' in large teal serif. "
                "Subtitle 'Find any scale. Build any chord. Play the song.' "
                "Small 'Cynthia Music'. Energetic but light, no people, no extra text."
            ),
            "aspect_ratio": "4:3",
            "resolution": "2K",
            "output_format": "jpeg",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "cover-piano-bundle-alt",
        "dest": OUT_COVERS / "piano-bundle-alt.jpg",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Bright 4:3 bundle cover. A white grand piano on Sarasota sand, "
                "open lid reflecting aqua water, three small numbered circles 1 2 3 floating "
                "like notes. Perfect typography: title 'The Piano Family Bundle' in large "
                "teal serif. Subtitle 'All three courses. One bench.' Small 'Cynthia Music'. "
                "No people, generous sky, coastal and modern."
            ),
            "aspect_ratio": "4:3",
            "resolution": "2K",
            "output_format": "jpeg",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "logo-wordmark-nb",
        "dest": OUT_LOGOS / "08-wordmark-nb.png",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Clean wordmark logo on a plain cream #FFF8F1 background, lots of "
                "padding. Exactly two lines of text, nothing else except a thin aqua wave "
                "under the type: line 1 'Cynthia' in elegant serif, gulf teal #0E8A9C. "
                "Line 2 'MUSIC' in small widely spaced sans-serif, coral #FF7A5C. "
                "Vector-like, centered, no people, no photography, no extra words."
            ),
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "logo-lockup-nb",
        "dest": OUT_LOGOS / "09-lockup-nb.png",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Horizontal logo lockup, cream background, generous padding. "
                "Left: circular icon of three white piano keys forming a wave under a coral sun, "
                "teal circle. Right: 'Cynthia' in serif #1A4652 over 'Music' in aqua. "
                "Flat vector identity, no extra text, no photos."
            ),
            "aspect_ratio": "16:9",
            "resolution": "1K",
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "logo-dove-nb",
        "dest": OUT_LOGOS / "10-dove-wave-nb.png",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Minimal logo on cream background. A simple line-art dove in flight "
                "whose wings become a gulf wave, drawn in teal #0E8A9C with a small coral accent. "
                "Centered underneath the exact words 'Cynthia Music' in elegant serif. "
                "Not religious, no halo, no cross, no extra text, lots of padding."
            ),
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "logo-monogram-nb",
        "dest": OUT_LOGOS / "11-cm-monogram-nb.png",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Bold geometric monogram on cream background. A large letter C made "
                "from a curved piano keyboard wrapping a smaller letter M. Colors: gulf teal "
                "#2BBCD0 and coral #FF7A5C. Tiny 'Cynthia Music' under the mark. "
                "App-icon friendly, high contrast, flat vector, no extra words."
            ),
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "logo-badge-nb",
        "dest": OUT_LOGOS / "12-sunrise-badge-nb.png",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Circular emblem on cream background. Coral sun rising over teal gulf "
                "water, tiny piano keys along the horizon. Arc text on the badge reads exactly "
                "'CYNTHIA MUSIC'. Simple travel-poster badge, 3-4 shapes, no extra words."
            ),
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "logo-script-nb",
        "dest": OUT_LOGOS / "13-horizon-script-nb.png",
        "model": "fal-ai/nano-banana-pro",
        "payload": {
            "prompt": (
                f"{BRAND} Refined wordmark on cream. The name 'Cynthia' in a modern high-end "
                "script, gulf-deep #0E8A9C, not bubbly, not wedding calligraphy. A thin horizon "
                "line through the letters. Below, 'MUSIC' in tiny widely spaced caps, coral. "
                "No extra words, lots of padding."
            ),
            "aspect_ratio": "1:1",
            "resolution": "1K",
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        },
    },
    {
        "name": "logo-transparent-lockup",
        "dest": OUT_LOGOS / "14-lockup-transparent.png",
        "model": "fal-ai/gpt-image-1.5",
        "payload": {
            "prompt": (
                f"{BRAND} Transparent-background logo lockup. Left: circular teal mark with "
                "coral sun and white piano-key wave. Right: 'Cynthia' in serif dark teal stacked "
                "over 'Music' in aqua. Isolated logo, no drop shadow, no scenery, no extra text."
            ),
            "image_size": "1536x1024",
            "background": "transparent",
            "quality": "high",
        },
    },
]


def main() -> int:
    os.environ["FAL_KEY"] = load_fal_key()
    jobs = LOGOS + COVERS
    if sys.argv[1:] == ["logos"]:
        jobs = LOGOS
    elif sys.argv[1:] == ["covers"]:
        jobs = COVERS

    OUT_LOGOS.mkdir(parents=True, exist_ok=True)
    OUT_COVERS.mkdir(parents=True, exist_ok=True)

    failed = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(generate, job): job["name"] for job in jobs}
        for fut in as_completed(futs):
            name = futs[fut]
            try:
                fut.result()
            except Exception as exc:  # noqa: BLE001
                failed.append(name)
                print(f"✗ {name}: {exc}", flush=True)

    if failed:
        print("FAILED:", ", ".join(failed))
        return 1
    print("All brand images generated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
