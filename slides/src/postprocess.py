"""Finish a pptxgenjs deck:
1. pptxgenjs cannot rasterise SVGs in Node, so each SVG's PNG fallback is a "broken image"
   placeholder. Replace every fallback with the real PNG rendered from the same SVG
   (PowerPoint 2016+/365 draws the vector SVG; older viewers and LibreOffice use the PNG).
2. Set the East Asian theme font so Chinese text uses Microsoft YaHei everywhere.

Usage: python3 postprocess.py deck.pptx figdir [figdir ...]
"""
import hashlib
import os
import re
import shutil
import sys
import tempfile
import zipfile

EA_FONT = "Microsoft YaHei"


def main(deck, figdirs):
    by_hash = {}
    for d in figdirs:
        for f in os.listdir(d):
            if f.endswith(".svg"):
                h = hashlib.sha1(open(os.path.join(d, f), "rb").read()).hexdigest()
                by_hash[h] = os.path.join(d, f[:-4] + ".png")

    tmp = tempfile.mkdtemp()
    with zipfile.ZipFile(deck) as z:
        z.extractall(tmp)
        names = z.namelist()

    media = os.path.join(tmp, "ppt", "media")
    fixed = 0
    for rels in os.listdir(os.path.join(tmp, "ppt", "slides", "_rels")):
        rp = os.path.join(tmp, "ppt", "slides", "_rels", rels)
        xml = open(rp, encoding="utf-8").read()
        targets = re.findall(r'Id="rId(\d+)"[^>]*Target="\.\./media/([^"]+)"', xml)
        rid2t = {int(r): t for r, t in targets}
        for rid, t in rid2t.items():
            if t.endswith(".svg") and (rid - 1) in rid2t and rid2t[rid - 1].endswith(".png"):
                svg_bytes = open(os.path.join(media, t), "rb").read()
                h = hashlib.sha1(svg_bytes).hexdigest()
                if h not in by_hash:
                    raise SystemExit(f"no rendered PNG for {t}")
                shutil.copyfile(by_hash[h], os.path.join(media, rid2t[rid - 1]))
                fixed += 1

    theme_dir = os.path.join(tmp, "ppt", "theme")
    for f in os.listdir(theme_dir):
        p = os.path.join(theme_dir, f)
        xml = open(p, encoding="utf-8").read()
        xml = re.sub(r'<a:ea typeface="[^"]*"\s*/>', f'<a:ea typeface="{EA_FONT}"/>', xml)
        open(p, "w", encoding="utf-8").write(xml)

    out = deck + ".tmp"
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        # keep [Content_Types].xml first, original order otherwise
        for n in names:
            z.write(os.path.join(tmp, n), n)
    os.replace(out, deck)
    shutil.rmtree(tmp)
    print(f"{deck}: {fixed} SVG fallbacks replaced, EA font set to {EA_FONT}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
