"""Build the /cursor page assets from kateko's delivered OKISO cursor pack.

Pixel art: every resize is nearest-neighbour at an integer scale.
Source: D:/FOLDERS/Commissions/Bought/OKISO/kateko@vgen/Cursor.zip (VGen COMM#D8PK9IMBHJEC).
Run: python scripts/prepare-cursor-assets.py
"""
import io
import json
import shutil
import struct
import zipfile
from pathlib import Path

from PIL import Image

SOURCE = Path("D:/FOLDERS/Commissions/Bought/OKISO/kateko@vgen/Cursor.zip")
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "cursor" / "okiso"
MANIFEST = ROOT / "src" / "data" / "okisoCursors.json"
PREVIEW = 128  # animated preview edge; the 256px pixel art halves cleanly
POINTER = 64   # static browser cursor edge (browsers cap custom cursors at 128px)
EMOTE_NATIVE, EMOTE = 32, 640  # the 1600px GIF is a 32px sprite at 50x; republish at 20x


def chunks(data: bytes, offset: int, end: int):
    while offset < end:
        cid = data[offset:offset + 4]
        size = struct.unpack("<I", data[offset + 4:offset + 8])[0]
        yield cid, offset + 8, size
        offset += 8 + size + (size & 1)


def read_ani(data: bytes):
    """Return (frames, frame_ms, hotspot) from a RIFF ACON animated cursor."""
    frames, jiffies, hotspot = [], 6, (0, 0)
    for cid, offset, size in chunks(data, 12, len(data)):
        if cid == b"anih":
            jiffies = struct.unpack("<9I", data[offset:offset + 36])[7] or 6
        elif cid == b"LIST" and data[offset:offset + 4] == b"fram":
            for inner, start, length in chunks(data, offset + 4, offset + size):
                if inner != b"icon":
                    continue
                cur = bytearray(data[start:start + length])
                if not frames:
                    hotspot = struct.unpack("<HH", cur[10:14])
                cur[2:4] = struct.pack("<H", 1)  # .cur -> .ico header so Pillow decodes it
                frames.append(Image.open(io.BytesIO(bytes(cur))).convert("RGBA"))
    return frames, round(jiffies * 1000 / 60), hotspot


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    (OUT / "preview").mkdir(parents=True)
    (OUT / "pointer").mkdir()
    shutil.copyfile(SOURCE, OUT / "okiso-cursors-by-katekoteko.zip")
    manifest = []
    with zipfile.ZipFile(SOURCE) as pack:
        for name in sorted(n for n in pack.namelist() if n.lower().endswith(".ani")):
            slug = Path(name).stem.lower()
            frames, frame_ms, (hx, hy) = read_ani(pack.read(name))
            size = frames[0].width
            previews = [frame.resize((PREVIEW, PREVIEW), Image.NEAREST) for frame in frames]
            previews[0].save(OUT / "preview" / f"{slug}.webp", save_all=True, append_images=previews[1:],
                             duration=frame_ms, loop=0, lossless=True, method=6)
            frames[0].resize((POINTER, POINTER), Image.NEAREST).save(OUT / "pointer" / f"{slug}.png", optimize=True)
            manifest.append({"slug": slug, "file": Path(name).name, "frames": len(frames), "frameMs": frame_ms,
                             "hotspot": [round(hx * POINTER / size), round(hy * POINTER / size)]})
        emote = Image.open(io.BytesIO(pack.read("Emotes/01.gif")))
        emote_frames, durations = [], []
        for index in range(emote.n_frames):
            emote.seek(index)
            emote_frames.append(emote.convert("RGBA").resize((EMOTE_NATIVE, EMOTE_NATIVE), Image.NEAREST).resize((EMOTE, EMOTE), Image.NEAREST))
            durations.append(emote.info.get("duration", 100))
        emote_frames[0].save(OUT / "animation.webp", save_all=True, append_images=emote_frames[1:],
                             duration=durations, loop=0, lossless=True, method=6)
    zip_bytes = (OUT / "okiso-cursors-by-katekoteko.zip").stat().st_size
    MANIFEST.write_text(json.dumps({"zipBytes": zip_bytes, "pointerSize": POINTER, "cursors": manifest}, indent=2) + "\n")
    print(f"{len(manifest)} cursors -> {OUT}")


if __name__ == "__main__":
    main()
