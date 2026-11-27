"""Swap the PNG placeholders written by build.js for true vector SVG.

PowerPoint (2016+/365) reads <asvg:svgBlip> and renders the SVG; older viewers and
LibreOffice fall back to the PNG that stays in <a:blip r:embed>.
"""
import json
import re
import shutil
import sys
import zipfile

SVG_NS = "http://schemas.microsoft.com/office/drawing/2016/SVG/main"
REL_IMG = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"

src = sys.argv[1]
mapping = json.load(open(sys.argv[2]))
tmp = src + ".tmp"

zin = zipfile.ZipFile(src)
files = {n: zin.read(n) for n in zin.namelist()}
zin.close()

added_media = {}
count = 0
for name in [n for n in files if re.match(r"ppt/slides/slide\d+\.xml$", n)]:
    xml = files[name].decode("utf-8")
    rels_name = name.replace("slides/", "slides/_rels/") + ".rels"
    rels = files[rels_name].decode("utf-8")
    ids = [int(i) for i in re.findall(r'Id="rId(\d+)"', rels)]
    next_id = max(ids) + 1 if ids else 1

    def repl(m):
        global count
        nonlocal_state = repl.state
        obj = m.group("name")
        if obj not in mapping:
            return m.group(0)
        svg_path = mapping[obj]
        media = "ppt/media/" + svg_path.split("/")[-1]
        if media not in added_media:
            added_media[media] = open(svg_path, "rb").read()
        rid = f"rId{nonlocal_state['next']}"
        nonlocal_state["next"] += 1
        nonlocal_state["rels"].append(
            f'<Relationship Id="{rid}" Type="{REL_IMG}" Target="../media/{media.split("/")[-1]}"/>'
        )
        block = m.group(0)
        # replace the first <a:blip r:embed="..."/> (self-closing) inside this picture
        def blip(bm):
            return (f'<a:blip r:embed="{bm.group(1)}"><a:extLst><a:ext uri="{{96DAC541-7B7A-43D3-8B79-37D633B846F1}}">'
                    f'<asvg:svgBlip xmlns:asvg="{SVG_NS}" r:embed="{rid}"/></a:ext></a:extLst></a:blip>')
        new, n = re.subn(r'<a:blip r:embed="(rId\d+)"\s*/>', blip, block, count=1)
        if n == 0:
            new, n = re.subn(r'<a:blip r:embed="(rId\d+)"\s*>\s*</a:blip>', blip, block, count=1)
        if n:
            count += 1
        return new

    repl.state = {"next": next_id, "rels": []}
    xml2 = re.sub(r'<p:pic>(?:(?!</p:pic>).)*?name="(?P<name>FIG_[^"]+)".*?</p:pic>', repl, xml, flags=re.S)
    if repl.state["rels"]:
        rels = rels.replace("</Relationships>", "".join(repl.state["rels"]) + "</Relationships>")
        files[rels_name] = rels.encode("utf-8")
        files[name] = xml2.encode("utf-8")

files.update(added_media)
ct = files["[Content_Types].xml"].decode("utf-8")
if 'Extension="svg"' not in ct:
    ct = ct.replace("<Default ", '<Default Extension="svg" ContentType="image/svg+xml"/><Default ', 1)
    files["[Content_Types].xml"] = ct.encode("utf-8")

with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
    # [Content_Types].xml first
    z.writestr("[Content_Types].xml", files.pop("[Content_Types].xml"))
    for n, d in files.items():
        z.writestr(n, d)
shutil.move(tmp, src)
print(f"embedded {count} SVG figures ({len(added_media)} unique files)")
