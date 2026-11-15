"""Render the 高校工作 (academic jobs in the US and China) chapter from data/academic-jobs.json.

The JSON holds one edited section per topic. Each section was researched, adversarially
checked, reviewed by a critic, fact-checked again and then edited for readers.
"""
import json
import pathlib
import re

from abroad import esc, host, src_links

ROOT = pathlib.Path(__file__).resolve().parent
DATA = json.loads((ROOT / "data" / "academic-jobs.json").read_text(encoding="utf-8"))
SEC = {s["key"]: s for s in DATA["sections"]}

ORDER = [
    ("us-career", "美国 · 职位与薪资", "u"),
    ("us-cities", "美国 · 城市", "u"),
    ("us-benefits", "美国 · 福利", "u"),
    ("cn-career", "中国 · 职位与项目", "c"),
    ("cn-cities", "中国 · 城市政策", "c"),
    ("cn-benefits", "中国 · 福利与个税", "c"),
    ("hk-macau", "港澳高校", "c"),
    ("compare", "两边怎么算账", "b"),
    ("mobility", "跨境风险", "b"),
    ("family", "配偶与孩子", "b"),
]
ORDER = [o for o in ORDER if o[0] in SEC]

URL = re.compile(r"https?://[^\s，。；、）)\]」>]+")
ST = {"verified": ("ok", "已核实"), "secondary": ("mid", "二手"), "uncertain": ("no", "未核实")}
ST_ZH = {"已核实": "ok", "verified": "ok", "二手": "mid", "secondary": "mid", "未核实": "no", "uncertain": "no",
         "待核实": "no", "预计": "no", "已宣布": "mid", "拟议": "no", "部分核实": "mid"}


def cell(s):
    """Escape a table cell and turn bare URLs into short links."""
    s = str(s)
    out, last = [], 0
    for m in URL.finditer(s):
        out.append(esc(s[last:m.start()]))
        u = m.group(0).rstrip(".,")
        out.append(f'<a href="{esc(u)}" target="_blank" rel="noopener">{esc(host(u))}</a>')
        last = m.start() + len(u)
    out.append(esc(s[last:]))
    return "".join(out)


def status_badge(s):
    s = str(s).strip()
    for k, cls in ST_ZH.items():
        if s.startswith(k) or s.lower().startswith(k):
            return f'<span class="st {cls}">{esc(s)}</span>'
    hits = [cls for k, cls in ST_ZH.items() if k in s]
    if hits:
        cls = "ok" if set(hits) == {"ok"} else ("no" if "ok" not in hits and "no" in hits else "mid")
        return f'<span class="st {cls}">{esc(s)}</span>'
    return cell(s)


def table(b):
    cols = b.get("columns") or []
    rows = b.get("rows") or []
    if not cols or not rows:
        return []
    stcol = len(cols) - 1 if re.search(r"状态|核实", cols[-1]) else -1
    width = max(640, min(1500, 132 * len(cols)))
    head = "".join(f"<th>{esc(c)}</th>" for c in cols)
    body = []
    for r in rows:
        r = list(r) + [""] * (len(cols) - len(r))
        tds = []
        for i, c in enumerate(r[:len(cols)]):
            if i == 0:
                tds.append(f"<th>{cell(c)}</th>")
            elif i == stcol:
                tds.append(f"<td>{status_badge(c)}</td>")
            else:
                tds.append(f"<td>{cell(c)}</td>")
        body.append("<tr>" + "".join(tds) + "</tr>")
    out = [f"<h4>{esc(b['title_zh'])}</h4>",
           f'<div class="tbl atbl"><table style="min-width:{width}px"><thead><tr>{head}</tr></thead><tbody>{"".join(body)}</tbody></table></div>']
    if b.get("note_zh"):
        out.append(f'<p class="anote">{cell(b["note_zh"])}</p>')
    links = src_links(b.get("sources") or [])
    if links:
        out.append(f'<p class="xsrc">来源：{" · ".join(links)}</p>')
    return out


def lst(b):
    items = b.get("items") or []
    if not items:
        return []
    lis = []
    for it in items:
        cls, lab = ST.get(it.get("status", "verified"), ST["verified"])
        badge = f'<span class="st {cls}">{lab}</span>' if cls != "ok" else ""
        src = ""
        if it.get("source", "").startswith("http"):
            src = " " + " · ".join(src_links([it["source"]]))
            src = f'<span class="asrc">{src}</span>'
        lis.append(f"<li>{badge}{cell(it['text_zh'])}{src}</li>")
    out = [f"<h4>{esc(b['title_zh'])}</h4>", f'<ul class="alist">{"".join(lis)}</ul>']
    if b.get("note_zh"):
        out.append(f'<p class="anote">{cell(b["note_zh"])}</p>')
    return out


def block(b, i):
    out = table(b) if b.get("kind") == "table" else lst(b)
    if not out:
        return ""
    head, body = out[0], "".join(out[1:])
    title = head[4:-5]  # strip <h4> </h4>
    n = len(b.get("rows") or b.get("items") or [])
    unit = "行" if b.get("kind") == "table" else "条"
    return (f'<details class="ablock"{" open" if i < 2 else ""}><summary>{title}<small>{n} {unit}</small></summary>'
            f'<div class="abody">{body}</div></details>')


WEST_FILE = ROOT / "data" / "west-academia.json"
WEST = json.loads(WEST_FILE.read_text(encoding="utf-8")) if WEST_FILE.exists() else {"sections": []}
WSEC = {s["key"]: s for s in WEST["sections"]}
WORDER = [
    ("bay-area", "旧金山湾区", "u"),
    ("socal", "洛杉矶与南加州", "u"),
    ("seattle-pnw", "西雅图与太平洋西北", "u"),
    ("chicago", "芝加哥", "u"),
    ("uc-system", "加州大学系统", "u"),
    ("west-policy", "四州政策", "u"),
]
WORDER = [o for o in WORDER if o[0] in WSEC]


def panel(s, label, side, group):
    key = s["key"]
    out = [f'<div class="apanel side-{side}" id="{group}-{key}" data-apanel="{key}" data-group="{group}" hidden>',
           f'<div class="xhead"><h3>{esc(s["title_zh"])}<small>{esc(label)}</small></h3></div>',
           f'<p class="xverdict">{cell(s["lede_zh"])}</p>']
    if s.get("takeaways"):
        out.append('<div class="xprc atake"><h4>要记住的几条</h4><ul>' +
                   "".join(f"<li>{cell(t)}</li>" for t in s["takeaways"]) + "</ul></div>")
    out.append('<div class="ablocks">' + "".join(block(b, i) for i, b in enumerate(s.get("blocks", []))) + "</div>")
    if s.get("misconceptions"):
        out.append('<details class="amyth"><summary>常见误解</summary><dl>' +
                   "".join(f"<dt>✗ {cell(m['myth_zh'])}</dt><dd>{cell(m['fact_zh'])}</dd>" for m in s["misconceptions"]) +
                   "</dl></details>")
    if s.get("uncertain"):
        out.append(f'<details class="xnote"><summary>尚未核实（{len(s["uncertain"])} 条）</summary><ul>' +
                   "".join(f"<li>{cell(u)}</li>" for u in s["uncertain"]) + "</ul></details>")
    out.append("</div>")
    return "".join(out)


def tabs(order, group, label):
    b = "".join(f'<button class="chip side-{side}" data-a="{k}" aria-pressed="false">{esc(lab)}</button>'
                for k, lab, side in order)
    return f'<div class="chips atabs" data-group="{group}" role="group" aria-label="{esc(label)}">{b}</div>'


def panels():
    return tabs(ORDER, "a", "选择主题") + "".join(panel(SEC[k], lab, side, "a") for k, lab, side in ORDER)


def west_panels():
    if not WORDER:
        return ""
    return tabs(WORDER, "w", "选择地区") + "".join(panel(WSEC[k], lab, side, "w") for k, lab, side in WORDER)


def sources_for(order, secs, prefix):
    out = []
    for k, label, _ in order:
        urls = []
        for b in secs[k].get("blocks", []):
            urls += b.get("sources") or []
            urls += [it.get("source", "") for it in b.get("items") or []]
        links = src_links(urls)
        if links:
            out.append(f"<li>{prefix} · {esc(label)}：{' · '.join(links[:14])}</li>")
    return "".join(out)


def all_sources():
    return sources_for(ORDER, SEC, "高校工作") + sources_for(WORDER, WSEC, "西海岸与芝加哥")


HTML = {
    "acad-panels": panels,
    "west-panels": west_panels,
    "acad-sources": all_sources,
}
