#!/usr/bin/env python3
"""Round 2 logos: crisp ocean-music, matched to the live course covers."""

from __future__ import annotations

import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/Users/jordanbuckingham/Desktop/cynthia-productions")
OUT = ROOT / "public/images/brand/logos/r2"
VF_ENV = Path("/Users/jordanbuckingham/Desktop/vibrationfit/.env.local")
COVERS = ROOT / "public/images/courses"

WORLD = (
    "Use the exact visual world of these Cynthia Music course covers: photoreal, "
    "high-key, sparkling turquoise Gulf of Mexico water, cream sand, a glossy white "
    "grand piano, peach-gold sunlight, airy luxury coastal piano school. "
    "Elegant muted-teal serif type like the covers. Cream #FFFDFB background, generous padding. "
    "Crisp, expensive, quiet. NOT cartoon, NOT retro travel poster, NOT geometric memphis, "
    "NOT dark night beach, NOT clipart, NOT busy, NOT vintage WordPress. "
    "Do not copy course titles. This is a logo only."
)


def load_fal_key() -> str:
    for line in VF_ENV.read_text().splitlines():
        if line.startswith("FAL_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("FAL_KEY not found")


def data_uri(path: Path) -> str:
    tmp = Path(f"/tmp/cm-ref-{path.stem}.jpg")
    subprocess.check_call(
        ["sips", "-Z", "900", "--setProperty", "format", "jpeg", str(path), "--out", str(tmp)],
        stdout=subprocess.DEVNULL,
    )
    b64 = base64.b64encode(tmp.read_bytes()).decode()
    return f"data:image/jpeg;base64,{b64}"


def fal_run(model: str, payload: dict, timeout: int = 180) -> dict:
    req = urllib.request.Request(
        f"https://fal.run/{model}",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Key {os.environ['FAL_KEY']}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            return json.loads(res.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise RuntimeError(f"{model} HTTP {e.code}: {body[:700]}") from e


def first_url(data: dict) -> str:
    if isinstance(data.get("images"), list) and data["images"]:
        item = data["images"][0]
        return item["url"] if isinstance(item, dict) else item
    image = data.get("image")
    if isinstance(image, dict) and image.get("url"):
        return image["url"]
    raise RuntimeError(f"No image url in {list(data)[:10]}")


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "cynthia-music-brand/2"})
    with urllib.request.urlopen(req, timeout=120) as res, dest.open("wb") as f:
        f.write(res.read())


def generate(job: dict) -> str:
    dest: Path = job["dest"]
    t0 = time.time()
    print(f"→ {job['name']} ({job['model']})", flush=True)
    data = fal_run(job["model"], job["payload"])
    download(first_url(data), dest)
    print(f"✓ {job['name']} ({time.time() - t0:.1f}s)", flush=True)
    return str(dest)


def jobs(refs: list[str]) -> list[dict]:
    edit = "fal-ai/nano-banana-pro/edit"
    t2i = "fal-ai/nano-banana-pro"
    gpt = "fal-ai/gpt-image-1.5"
    nb = dict(resolution="1K", output_format="png", num_images=1, limit_generations=True)

    return [
        {
            "name": "A-porthole",
            "dest": OUT / "A-porthole.png",
            "model": edit,
            "payload": {
                "prompt": (
                    f"{WORLD} Square logo. Center: a circular porthole window showing a tiny "
                    "photoreal scene of glossy white piano keys at a sparkling turquoise waterline "
                    "with a soft coral sun. Below the circle, exact text 'Cynthia Music' in elegant "
                    "muted-teal serif. Lots of cream margin. No other words."
                ),
                "image_urls": refs,
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "B-lockup",
            "dest": OUT / "B-lockup.png",
            "model": edit,
            "payload": {
                "prompt": (
                    f"{WORLD} Horizontal logo lockup, cream, generous padding. Left: circular "
                    "photoreal mark of a white piano on gulf water, coral sun. Right: 'Cynthia' in "
                    "elegant teal serif stacked over 'Music' in lighter aqua. Premium lifestyle brand. "
                    "No extra text."
                ),
                "image_urls": refs,
                "aspect_ratio": "16:9",
                **nb,
            },
        },
        {
            "name": "C-icon",
            "dest": OUT / "C-icon.png",
            "model": edit,
            "payload": {
                "prompt": (
                    f"{WORLD} App icon only, rounded square, no letters at all. Photoreal sparkling "
                    "turquoise water fills the square. A row of white piano keys forms the horizon. "
                    "A small coral sun sits on the water. Crisp, simple, works at 32 pixels."
                ),
                "image_urls": refs,
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "D-wordmark",
            "dest": OUT / "D-wordmark.png",
            "model": t2i,
            "payload": {
                "prompt": (
                    f"{WORLD} Ultra-clean wordmark on cream. Line 1: 'Cynthia' in the same elegant "
                    "high-contrast serif and muted teal as the course covers. Line 2: 'MUSIC' tiny, "
                    "widely spaced, soft coral. Underline is a photoreal hairline of sparkling gulf "
                    "water, not a cartoon wave. Centered, lots of empty cream. No icons besides the waterline."
                ),
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "E-piano-mark",
            "dest": OUT / "E-piano-mark.png",
            "model": t2i,
            "payload": {
                "prompt": (
                    f"{WORLD} Logo: a tiny photoreal glossy white grand piano sitting on a strip of "
                    "sparkling turquoise water, centered. Below: 'Cynthia Music' in elegant teal serif. "
                    "Cream background, lots of sky-like negative space. Quiet luxury. No extra words."
                ),
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "F-keys-sun",
            "dest": OUT / "F-keys-sun.png",
            "model": t2i,
            "payload": {
                "prompt": (
                    f"{WORLD} Minimal mark on cream: close-up photoreal white piano keys catching "
                    "sunlight, a coral-peach sun sitting on the keys like a horizon. Below, 'Cynthia Music' "
                    "in muted teal serif. Crisp product photography, not illustration. No extra text."
                ),
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "G-script-tide",
            "dest": OUT / "G-script-tide.png",
            "model": t2i,
            "payload": {
                "prompt": (
                    f"{WORLD} Wordmark: 'Cynthia' in a refined modern script, gulf teal, not wedding "
                    "calligraphy. A photoreal thin tide line of sparkling water runs under the letters. "
                    "'MUSIC' in tiny coral caps. Cream background, generous padding. No extra words."
                ),
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "H-stamp",
            "dest": OUT / "H-stamp.png",
            "model": edit,
            "payload": {
                "prompt": (
                    f"{WORLD} Circular cream badge / stamp. Inside: photoreal miniature of a white "
                    "piano on Sarasota sand with turquoise water. Arc type reads exactly 'CYNTHIA MUSIC' "
                    "in elegant serif. Simple, crisp, not a busy poster. Cream square around the badge."
                ),
                "image_urls": refs,
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "I-monogram",
            "dest": OUT / "I-monogram.png",
            "model": t2i,
            "payload": {
                "prompt": (
                    f"{WORLD} Soft monogram: a letter C made from a photoreal curve of white piano "
                    "keys at the waterline, coral sun in the opening of the C. Tiny 'Cynthia Music' "
                    "underneath in teal serif. Cream background. Not sharp triangles, not geometric art school."
                ),
                "aspect_ratio": "1:1",
                **nb,
            },
        },
        {
            "name": "J-transparent",
            "dest": OUT / "J-transparent.png",
            "model": gpt,
            "payload": {
                "prompt": (
                    f"{WORLD} Isolated logo on transparent background. Circular photoreal mark: "
                    "white piano keys as a gulf horizon, coral sun, turquoise water. To the right, "
                    "'Cynthia' in teal serif over 'Music' in aqua. No drop shadow, no scenery around it, "
                    "no extra text."
                ),
                "image_size": "1536x1024",
                "background": "transparent",
                "quality": "high",
            },
        },
    ]


def main() -> int:
    os.environ["FAL_KEY"] = load_fal_key()
    refs = [
        data_uri(COVERS / "one-hour-piano.jpg"),
        data_uri(COVERS / "play-thousands.jpg"),
        data_uri(COVERS / "music-is-numbers.jpg"),
    ]
    print(f"refs ready ({sum(len(r) for r in refs) // 1024} KB encoded)", flush=True)
    OUT.mkdir(parents=True, exist_ok=True)

    failed = []
    with ThreadPoolExecutor(max_workers=5) as pool:
        futs = {pool.submit(generate, job): job["name"] for job in jobs(refs)}
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
    print("Round 2 logos done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
