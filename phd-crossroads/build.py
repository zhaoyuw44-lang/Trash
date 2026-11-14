#!/usr/bin/env python3
"""Build the 博士毕业去留地图 page.

- Draws every figure as SVG (coordinates computed here so charts stay to scale).
- Injects the figures into src/template.html  ->  index.html  (inline, styled by page CSS)
- Writes each figure as a standalone file   ->  svg/NN-name.svg (own <style>, light + dark)

Run:  python3 build.py
"""
import calendar
import datetime as dt
import html
import math
import pathlib
import re

import abroad

ROOT = pathlib.Path(__file__).resolve().parent
WARN = []


# ----------------------------------------------------------------- helpers
def esc(s):
    return html.escape(str(s), quote=True)


def tw(s, fs):
    """Rough rendered width of a string (CJK = 1em, Latin ~0.55em)."""
    w = 0.0
    for ch in s:
        o = ord(ch)
        if o >= 0x2E80 or ch in "，。、；：？！（）《》“”…—":
            w += fs
        elif ch == " ":
            w += fs * 0.28
        elif ch in "·":
            w += fs * 0.5
        elif ch in "iIl.,:;|!'()[]/-–":
            w += fs * 0.34
        elif ch.isupper() or ch in "mwMW@%&≈≤≥→▸":
            w += fs * 0.68
        else:
            w += fs * 0.56
    return w


def fsize(cls):
    if "t-h" in cls:
        return 15
    if "t-xs" in cls:
        return 10.5
    if "t-s" in cls:
        return 11.5
    return 13


def text(x, y, s, cls="t", anchor=None, maxw=None):
    if maxw is not None:
        w = tw(s, fsize(cls)) * (1.05 if "t-b" in cls or "t-h" in cls else 1)
        if w > maxw:
            WARN.append(f"text overflow {w:.0f}>{maxw:.0f}: {s}")
    a = f' text-anchor="{anchor}"' if anchor else ""
    return f'<text x="{x:g}" y="{y:g}" class="{cls}"{a}>{esc(s)}</text>'


def rect(x, y, w, h, cls, rx=8, extra=""):
    return f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx:g}" class="{cls}"{extra}/>'


def box(x, y, w, h, title, sub=(), cls="k-box", tcls="t t-b", scls="t-s", rx=8, align="middle"):
    if isinstance(sub, str):
        sub = (sub,)
    out = [rect(x, y, w, h, cls, rx)]
    tx = x + w / 2 if align == "middle" else x + 12
    anc = "middle" if align == "middle" else None
    total = 13 + len(sub) * 15
    ty = y + (h - total) / 2 + 11
    out.append(text(tx, round(ty, 1), title, tcls, anc, maxw=w - 12))
    for i, s in enumerate(sub):
        out.append(text(tx, round(ty + 15 * (i + 1) + 1, 1), s, scls, anc, maxw=w - 12))
    return "".join(out)


def link(href, inner, label):
    return f'<a href="{href}" class="hit" aria-label="{esc(label)}">{inner}</a>'


def stage(key, inner, label):
    return f'<g class="hit stage" data-stage="{key}" tabindex="0" role="button" aria-label="{esc(label)}">{inner}</g>'


LCLS = {"a": "l", "u": "l l-us", "c": "l l-cn"}


def pill(cx, cy, s, cls="k-pill", tcls="t-s"):
    w = tw(s, 11.5) + 16
    return rect(cx - w / 2, cy - 10, w, 20, cls, 10) + text(cx, cy + 4, s, tcls, "middle")


class Fig:
    def __init__(self, key, w, h, label):
        self.key, self.w, self.h, self.label = key, w, h, label
        self.pid = "g" + key[:2]
        self.p = []

    def add(self, *s):
        self.p.extend(s)

    def arr(self, d, kind="a", dash=False):
        cls = LCLS[kind] + (" l-dash" if dash else "")
        return f'<path d="{d}" class="{cls}" marker-end="url(#{self.pid}-{kind})"/>'

    def ln(self, d, kind="a", dash=False, cls=None):
        c = cls or (LCLS[kind] + (" l-dash" if dash else ""))
        return f'<path d="{d}" class="{c}"/>'

    def defs(self):
        out = ["<defs>"]
        for k, c in (("a", "m-ink2"), ("u", "m-us"), ("c", "m-cn")):
            out.append(
                f'<marker id="{self.pid}-{k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" '
                f'markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">'
                f'<path d="M0,1 L9,5 L0,9 z" class="{c}"/></marker>'
            )
        out.append("</defs>")
        return "".join(out)

    def inline(self):
        return (
            f'<svg class="fig-svg" viewBox="0 0 {self.w} {self.h}" role="img" '
            f'aria-label="{esc(self.label)}" data-fig="{self.key}">' + self.defs() + "".join(self.p) + "</svg>"
        )

    def standalone(self, css):
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" '
            f'height="{self.h}" role="img" aria-label="{esc(self.label)}">'
            f"<title>{esc(self.label)}</title><style>{css}</style>"
            f'<rect class="f-bg" x="0" y="0" width="{self.w}" height="{self.h}"/>'
            + self.defs() + "".join(self.p) + "</svg>\n"
        )


# ------------------------------------------------------- 01 decision map
def fig01():
    f = Fig("01-decision-map", 1080, 560,
            "决策地图：博士毕业后三条主路线——留美身份接力（工业界/学术界）、回国求职链、第三地（12 个目的地）")
    # root + trunk
    f.add(rect(16, 230, 144, 100, "k-ink", 12))
    f.add(text(88, 268, "PhD 毕业", "t-h t-inv", "middle"))
    f.add(text(88, 290, "Program End Date", "t-s t-m t-inv", "middle"))
    f.add(text(88, 310, "第 0 天", "t-s t-inv", "middle"))
    f.add(f.ln("M160,280 H176"), f.ln("M176,87 V513"))
    # bands
    f.add(rect(190, 16, 874, 232, "k-band-us", 14))
    f.add(rect(190, 262, 874, 206, "k-band-cn", 14))
    f.add(rect(190, 482, 874, 62, "k-band-x", 14))
    f.add(text(268, 44, "留在美国 · 身份接力", "t-h t-us"))
    f.add(text(268, 290, "回国发展 · 求职链", "t-h t-cn"))
    # branches from trunk
    f.add(f.arr("M176,87 H264", "u"), pill(219, 87, "工业界"))
    f.add(f.arr("M176,175 H264", "u"), pill(219, 175, "学术界"))
    f.add(f.arr("M176,356 H264", "c"), pill(219, 356, "回国"))
    f.add(f.arr("M176,513 H264"), pill(219, 513, "第三地"))
    # US industry row
    row1 = [(268, 140, "OPT 申请窗口", "毕业前 90 天起可递交", "#us-visa"),
            (430, 120, "OPT", "12 个月 · 失业≤90天", "#us-visa"),
            (572, 160, "STEM OPT", "+24 个月 · 累计失业≤150天", "#us-visa"),
            (754, 140, "H-1B 抽签", "每年 3 月 · 工资加权", "#us-visa"),
            (916, 130, "绿卡", "PERM · NIW · EB-1A", "#green-card")]
    for i, (x, w, t, s, h) in enumerate(row1):
        f.add(link(h, box(x, 62, w, 50, t, s, "k-us"), t))
        if i:
            px = row1[i - 1][0] + row1[i - 1][1]
            f.add(f.arr(f"M{px + 2},87 H{x - 2}", "u"))
    row2 = [(268, 150, "博士后 / 研究岗", "大学 · 国家实验室", "#us-visa"),
            (440, 170, "H-1B 免抽签", "cap-exempt 雇主，或 J-1", "#us-visa"),
            (632, 160, "Tenure-track 教职", "约 6 年后 tenure 评审", "#edu-us"),
            (814, 130, "绿卡", "EB-1B · NIW", "#green-card")]
    for i, (x, w, t, s, h) in enumerate(row2):
        f.add(link(h, box(x, 150, w, 50, t, s, "k-us"), t))
        if i:
            px = row2[i - 1][0] + row2[i - 1][1]
            f.add(f.arr(f"M{px + 2},175 H{x - 2}", "u"))
    f.add(text(440, 228, "博后也可以先用 OPT / STEM OPT；成果突出者可走 O-1A，不抽签、无名额。", "t-s"))
    # China chain
    f.add(link("#china", box(268, 331, 150, 50, "学历学位认证", "中国留学服务中心", "k-cn"), "学历学位认证"))
    sectors = ["高校 · 科研院所（预聘 / 编制）", "企业研发（秋招 / 社招）", "国企 · 央企 · 新型研发机构", "公务员 · 选调生（国考）"]
    for i, s in enumerate(sectors):
        y = 300 + i * 40
        cy = y + 16
        f.add(f.arr(f"M418,356 H432 V{cy} H448", "c"))
        f.add(link("#china", box(450, y, 210, 32, s, (), "k-cn", "t"), s))
        f.add(f.ln(f"M660,{cy} H680 V356", "c"))
    f.add(f.arr("M680,356 H698", "c"))
    f.add(link("#china", box(700, 331, 170, 50, "落户 · 人才待遇", "户口 · 补贴 · 子女入学", "k-cn"), "落户与人才待遇"))
    f.add(f.arr("M870,356 H890", "c"))
    f.add(link("#china", box(892, 331, 150, 50, "职业发展", "职称 · 人才项目 · 长聘", "k-cn"), "职业发展"))
    # dashed bridge: overseas postdoc -> talent programme -> university
    f.add(f.arr("M343,200 V255 H555 V298", "c", dash=True))
    f.add(text(563, 290, "海外博后 → 海外优青等人才项目 → 回国任教", "t-s t-cn"))
    # third country
    f.add(text(272, 517, "第三地 · 12 地对比", "t t-b t-x"))
    cx = 410
    for k_, lab in (("canada", "加拿大"), ("uk", "英国"), ("australia", "澳大利亚 · 新西兰"), ("hongkong", "中国香港"),
                    ("singapore", "新加坡"), ("germany", "欧盟 · 德荷法爱"), ("switzerland", "瑞士"), ("japan", "日本")):
        w = tw(lab, 11.5) + 20
        f.add(xlink(k_, box(cx, 500, w, 26, lab, (), "k-x", "t-s"), lab))
        cx += w + 8
    return f


# ------------------------------------------------ 02 F-1 -> OPT -> H-1B
def fig02():
    f = Fig("02-f1-opt-h1b-timeline", 1080, 340,
            "时间轴示例：2027 年 5 月毕业，OPT 12 个月 + STEM OPT 24 个月，期间最多约 4 次 H-1B 抽签")
    X = lambda m: 90 + (m + 4) * 20.5
    lanes = [(56, "学业"), (96, "OPT 递交"), (136, "工作许可"), (206, "H-1B")]
    for y, lab in lanes:
        f.add(text(12, y + 4, lab, "t-s t-b"))
    # month grid
    for m in range(-3, 43, 3):
        f.add(f.ln(f"M{X(m):g},40 V250", cls="l-grid"))
    # graduation line
    f.add(f.ln(f"M{X(0):g},30 V256", cls="l l-strong l-dash"))
    f.add(text(X(0) + 6, 26, "毕业（I-20 上的 Program End Date）", "t-s t-b"))
    # bars
    def bar(m0, m1, y, cls, label, tcls="t-s", h=24):
        x0, x1 = X(m0), X(m1)
        f.add(rect(x0, y - h / 2, x1 - x0, h, cls, 5))
        if label:
            f.add(text((x0 + x1) / 2, y + 4, label, tcls, "middle", maxw=x1 - x0 - 6))
    bar(-4, 0, 56, "k-mute", "博士在读 F-1")
    bar(-3, 2, 96, "k-us k-dash", "I-765 窗口")
    bar(1, 13, 136, "k-solid-us", "OPT 12 个月", "t-s t-inv t-b")
    bar(13, 37, 136, "k-us", "STEM OPT 延期 24 个月", "t-s t-b")
    bar(37, 41, 136, "k-mute k-dash", "cap-gap")
    f.add(text(X(7), 168, "失业 ≤90 天", "t-xs", "middle"))
    f.add(text(X(25), 168, "累计失业 ≤150 天（含 OPT 的 90 天）", "t-xs", "middle"))
    f.add(text(X(39), 168, "→10/1", "t-xs", "middle"))
    # lotteries
    lots = [(-2, 5, "2027-03"), (10, 17, "2028-03"), (22, 29, "2029-03"), (34, 41, "2030-03")]
    for i, (m, start, lab) in enumerate(lots):
        x, xs = X(m), X(start)
        f.add(f.ln(f"M{x:g},206 H{xs:g}", "u"))
        f.add(f'<circle cx="{xs:g}" cy="206" r="5" class="m-bg-us"/>')
        f.add(f'<path d="M{x:g},197 L{x + 9:g},206 L{x:g},215 L{x - 9:g},206 Z" class="m-us"/>')
        f.add(text(x, 188, f"第 {i + 1} 次" + ("*" if i == 0 else ""), "t-s t-b t-us", "middle"))
        f.add(text(x, 232, lab, "t-xs t-m", "middle"))
    f.add(text(X(5) + 8, 226, "○ = 10/1 生效", "t-xs"))
    # axis
    f.add(f.ln(f"M{X(-4):g},250 H{X(42):g}", cls="l-axis"))
    for m, lab in [(0, "2027-05"), (6, "2027-11"), (12, "2028-05"), (18, "2028-11"), (24, "2029-05"),
                   (30, "2029-11"), (36, "2030-05"), (42, "2030-11")]:
        f.add(f.ln(f"M{X(m):g},250 V256", cls="l-axis"))
        f.add(text(X(m), 270, lab, "t-xs t-m", "middle"))
    f.add(text(12, 300, "示例：2027 年 5 月完成学位，6 月开始 OPT。*毕业当年的 3 月也能注册，但需在递交 I-129（4/1–6/30）前拿到学位，且雇主愿意提前担保。", "t-s"))
    f.add(text(12, 320, "cap-gap：H-1B 已递交且 OPT/STEM OPT 未过期时，F-1 身份与工作许可自动延续到 10/1 生效日（2025 年新规下最长至次年 4/1）。", "t-s"))
    return f


# --------------------------------------------- 03 weighted H-1B lottery
def fig03():
    f = Fig("03-h1b-weighted-lottery", 1080, 370,
            "H-1B 按工资加权抽签：Level IV 获 4 次机会、Level I 获 1 次；先抽 65,000 常规名额，美国硕博未中再抽 20,000")
    f.add(text(24, 34, "工资级别 → 抽签机会", "t-h"))
    levels = [("Level IV", "OEWS ≈ 第 67 分位", 4), ("Level III", "≈ 第 50 分位", 3),
              ("Level II", "≈ 第 34 分位", 2), ("Level I", "≈ 第 17 分位", 1)]
    pool = (470, 170, 66)
    for i, (lv, sub, n) in enumerate(levels):
        y = 64 + i * 56
        cy = y + 22
        f.add(box(24, y, 150, 44, lv, sub, "k-box", "t t-b t-m", "t-xs", align="start"))
        for k in range(n):
            f.add(rect(188 + k * 28, y + 7, 20, 30, "m-us", 3))
        f.add(text(188 + n * 28 + 4, cy + 5, f"×{n}", "t t-b t-us t-m"))
        # line to pool
        sx = 336
        ang = math.atan2(cy - pool[1], sx - pool[0])
        ex, ey = pool[0] + (pool[2] + 4) * math.cos(ang), pool[1] + (pool[2] + 4) * math.sin(ang)
        f.add(f.arr(f"M{sx},{cy} L{ex:.1f},{ey:.1f}", "u"))
    f.add(f'<circle cx="{pool[0]}" cy="{pool[1]}" r="{pool[2]}" class="k-us"/>')
    f.add(text(pool[0], pool[1] - 4, "加权抽签池", "t t-b", "middle"))
    f.add(text(pool[0], pool[1] + 14, "每人只计一次", "t-s", "middle"))
    f.add(box(600, 86, 210, 56, "第一轮：常规 65,000", "所有注册者参加", "k-us"))
    f.add(box(600, 216, 210, 56, "第二轮：高学历 20,000", "美国硕士及以上学位", "k-us"))
    a = math.radians(-28)
    f.add(f.arr(f"M{pool[0] + pool[2] * math.cos(a):.1f},{pool[1] + pool[2] * math.sin(a):.1f} L598,118", "u"))
    f.add(f.arr("M705,142 V214", "u"), pill(705, 178, "未中签的美国硕博"))
    f.add(box(860, 132, 200, 84, "中签 Selected", ("4/1–6/30 递交 I-129", "10/1 起生效"), "k-solid-us", "t t-b t-inv", "t-s t-inv"))
    f.add(f.arr("M810,114 L858,154", "u"), f.arr("M810,244 L858,198", "u"))
    f.add(rect(24, 296, 1036, 60, "k-mute", 10))
    f.add(text(40, 320, "Cap-exempt 雇主（高校、其附属非营利机构、非营利或政府研究机构）不参加抽签，全年可递交。", "t-s t-b"))
    f.add(text(40, 342, "FY2027（2026 年 3 月）起实施。截至检索时 USCIS 未公布分级别中签率；DOL 2026-03 提案拟上调各级工资分位，定稿前沿用现行标准。", "t-s"))
    return f


# ---------------------------------------------- 04 green card pathways
def fig04():
    f = Fig("04-green-card-pathways", 1080, 430,
            "职业移民三条路：雇主 PERM（EB-2/EB-3）、EB-1B（雇主、免 PERM）、EB-1A/NIW（自主申请），都汇入按出生地排队的排期")
    lanes = [(70, "雇主担保 PERM", "EB-2 / EB-3"), (160, "EB-1B 杰出研究员", "雇主 + 永久职位"), (250, "EB-1A / NIW", "自主申请 self-petition")]
    for y, t, s in lanes:
        f.add(box(16, y - 25, 176, 50, t, s, "k-box", "t t-b", "t-s", align="start"))
    # lane A
    a_steps = [(210, 120, "PWD 工资认定"), (350, 110, "招聘测试"), (480, 120, "ETA-9089")]
    for i, (x, w, t) in enumerate(a_steps):
        f.add(box(x, 54, w, 32, t, (), "k-box", "t"))
        f.add(f.arr(f"M{x + w + 2},70 H{(a_steps[i + 1][0] if i < 2 else 620) - 2}", "u"))
    f.add(text(410, 104, "劳工部 DOL 阶段，常见 1.5–2 年以上", "t-xs", "middle"))
    f.add(f.ln("M192,70 H208", "u"))
    # lane B
    f.add(box(210, 144, 150, 32, "永久职位 offer", (), "k-box", "t"))
    f.add(f.ln("M192,160 H208", "u"), f.arr("M362,160 H618", "u"))
    f.add(text(490, 152, "无需 PERM", "t-xs", "middle"))
    # lane C
    f.add(box(210, 234, 170, 32, "整理证据 · 推荐信", (), "k-box", "t"))
    f.add(f.ln("M192,250 H208", "u"), f.arr("M382,250 H618", "u"))
    f.add(text(500, 242, "无需雇主与 PERM", "t-xs", "middle"))
    i140 = [(70, "雇主递交"), (160, "雇主递交 · 可加急"), (250, "本人递交 · 可加急")]
    for y, s in i140:
        f.add(box(620, y - 25, 120, 50, "I-140", s, "k-us", "t t-b t-m"))
    f.add(f.arr("M740,70 H760 V150 H778", "u"), f.arr("M740,160 H778", "u"), f.arr("M740,250 H760 V170 H778", "u"))
    f.add(box(780, 135, 130, 50, "排期 Visa Bulletin", "按出生地排队", "k-solid-us", "t t-b t-inv", "t-s t-inv"))
    f.add(f.arr("M910,160 H928", "u"))
    f.add(box(930, 135, 130, 50, "I-485", "境内调整身份/领馆", "k-us", "t t-b t-m"))
    f.add(f.arr("M995,185 V303", "u"))
    f.add(box(930, 305, 130, 50, "绿卡", "永久居民 LPR", "k-us"))
    f.add(f.arr("M930,330 H906", "u"))
    f.add(box(760, 305, 144, 50, "入籍（约满 5 年）", "自动丧失中国国籍", "k-box"))
    notes = ["· I-140 获批后优先日（PD）可保留，换雇主也不丢。",
             "· 中国大陆出生（2026-11）：EB-1 排到 2023-08-01，EB-2 排到 2021-10-01。",
             "· I-485 待审期间可拿 EAD/AP；配偶 H-4 在 I-140 获批后可申请 EAD。",
             "· 排期按出生地而非国籍：配偶在其他国家出生，可交叉计算（cross-chargeability）。"]
    for i, s in enumerate(notes):
        f.add(text(16, 316 + i * 22, s, "t-s", maxw=720))
    return f


# --------------------------------------------- 05 visa bulletin backlog
VB_ASOF = dt.date(2026, 11, 1)
VB = {  # category: (china FAD, china DFF, row FAD, row DFF); None = Current
    "EB-1": (dt.date(2023, 8, 1), dt.date(2024, 7, 1), None, None),
    "EB-2": (dt.date(2021, 10, 1), dt.date(2023, 1, 1), dt.date(2025, 4, 1), dt.date(2026, 3, 15)),
    "EB-3": (dt.date(2022, 1, 22), dt.date(2024, 4, 1), dt.date(2024, 6, 15), dt.date(2024, 8, 1)),
}


def yrs(d):
    return 0.0 if d is None else (VB_ASOF - d).days / 365.25


def fig05():
    f = Fig("05-visa-bulletin-china-backlog", 1080, 330,
            "2026 年 11 月排期：中国大陆出生的 EB-1/EB-2/EB-3 截止日分别落后约 3.3、5.1、4.8 年；其他国家 EB-1 无排期")
    x0, k = 210, 128  # px per year
    X = lambda y: x0 + y * k
    # legend
    f.add(rect(210, 18, 14, 10, "m-ch-cn", 2), text(230, 28, "中国大陆出生", "t-s"))
    f.add(rect(340, 18, 14, 10, "m-ch-row", 2), text(360, 28, "其他国家 ROW", "t-s"))
    f.add(f.ln("M480,15 V31", cls="l-tick"), text(488, 28, "Dates for Filing（可先递 I-485 的截止日）", "t-s"))
    # grid
    for yv in range(0, 7):
        f.add(f.ln(f"M{X(yv):g},44 V262", cls="l-grid" if yv else "l-axis"))
        f.add(text(X(yv), 282, f"{yv} 年" if yv in (0, 6) else str(yv), "t-xs t-m", "middle"))
    f.add(text(X(3), 304, "Final Action Date 距 2026-11-01 的时长（≠ 你的实际等待时间）", "t-xs", "middle"))
    names = {"EB-1": "杰出人才/研究员", "EB-2": "高学历 · NIW", "EB-3": "专业/技术人员"}
    for i, (cat, (cf, cd, rf, rd)) in enumerate(VB.items()):
        cy = 86 + i * 72
        f.add(text(196, cy - 2, cat, "t t-b t-m", "end"))
        f.add(text(196, cy + 14, names[cat], "t-xs", "end"))
        for j, (fad, dff, cls, who) in enumerate(((cf, cd, "m-ch-cn", "中国大陆出生"), (rf, rd, "m-ch-row", "其他国家"))):
            y = cy - 17 + j * 19
            h = 15
            v = yrs(fad)
            x1 = X(v)
            tip = (f"{cat} {who}：Final Action Date " + (fad.isoformat() if fad else "Current")
                   + (f"（距 2026-11-01 约 {v:.1f} 年）" if fad else "") + "；Dates for Filing "
                   + (dff.isoformat() if dff else "Current"))
            if v > 0:
                r = 4
                d = (f"M{x0},{y} H{x1 - r:.1f} Q{x1:.1f},{y} {x1:.1f},{y + r} V{y + h - r} "
                     f"Q{x1:.1f},{y + h} {x1 - r:.1f},{y + h} H{x0} Z")
                f.add(f'<path d="{d}" class="{cls}"><title>{esc(tip)}</title></path>')
                lab = f"{v:.1f} 年 · {fad.isoformat()}"
                f.add(text(x1 + 8, y + 12, lab, "t-xs t-m"))
            else:
                f.add(f'<rect x="{x0}" y="{y}" width="3" height="{h}" class="{cls}"><title>{esc(tip)}</title></rect>')
                f.add(text(x0 + 10, y + 12, "Current（无排期）", "t-xs t-m"))
            if dff is not None:
                xd = X(yrs(dff))
                f.add(f'<path d="M{xd:.1f},{y - 3} V{y + h + 3}" class="l-tick"><title>{esc(tip)}</title></path>')
    return f


# ------------------------------------------------- 06 return to China
def fig06():
    f = Fig("06-return-to-china-flow", 1080, 320,
            "回国五步：毕业前准备材料 → 学历学位认证 → 求职与录用 → 落户与档案 → 安顿与待遇")
    steps = [
        ("毕业前准备", ["学位证 / 毕业证明信", "官方成绩单", "护照全部页 + 出入境记录", "美国 401(k) 与税务安排"], "毕业前 6–12 个月"),
        ("学历学位认证", ["中国留学服务中心在线申请", "授权学校核实学位", "提交留学期间出入境记录", "认证书为电子版"], "拿到学位后即可"),
        ("求职与录用", ["高校 / 院所：全年滚动", "企业：秋招 8–11 月", "国考：10 月报名", "择业期内可按应届生"], "毕业前 12 个月起"),
        ("落户与档案", ["单位或人才中心申报", "博士落户多数城市放宽", "档案存单位或人才中心", "配偶子女通常可随迁"], "入职后 1–3 个月"),
        ("安顿与待遇", ["社保 · 公积金起缴", "人才补贴 / 安家费", "子女入学看户籍 / 居住证", "个税：中国税务居民"], "入职后"),
    ]
    w, gap, x0 = 194, 22, 11
    for i, (title, items, when) in enumerate(steps):
        x = x0 + i * (w + gap)
        f.add(rect(x, 24, w, 230, "k-box", 10))
        f.add(f'<circle cx="{x + 24}" cy="50" r="13" class="m-cn"/>')
        f.add(text(x + 24, 55, str(i + 1), "t t-b t-inv", "middle"))
        f.add(text(x + 44, 55, title, "t t-b t-cn", maxw=w - 50))
        f.add(f.ln(f"M{x + 12},76 H{x + w - 12}", cls="l-grid"))
        for j, it in enumerate(items):
            f.add(text(x + 14, 102 + j * 26, "· " + it, "t-s", maxw=w - 20))
        f.add(rect(x + 10, 214, w - 20, 26, "k-cn", 6))
        f.add(text(x + w / 2, 231, when, "t-xs t-b", "middle", maxw=w - 26))
        if i < 4:
            f.add(f.arr(f"M{x + w + 2},139 H{x + w + gap - 2}", "c"))
    f.add(text(11, 284, "顺序为常见流程：认证和求职可以并行；高校岗位的招聘与谈判往往在毕业前一年就开始。", "t-s"))
    f.add(text(11, 306, "各城市落户与人才政策差异很大，且每年调整，以当地人社部门和用人单位的书面文件为准。", "t-s"))
    return f


# ------------------------------------------- 07 academic career ladders
def fig07():
    f = Fig("07-academic-ladders-us-vs-cn", 1080, 456,
            "学术职业阶梯对照：美国 Postdoc → Assistant → Associate（tenure）→ Full；中国 博士后 → 讲师/预聘 → 副高 → 正高")
    f.add(text(240, 34, "美国 · Academic Track", "t-h t-us", "middle"))
    f.add(text(840, 34, "中国 · 高校与科研院所", "t-h t-cn", "middle"))
    us = [("PhD 博士", "STEM 中位数约 5–6 年"), ("Postdoc 博士后", "1–3 年起，合同制，可多段"),
          ("Assistant Professor（tenure-track）", "约 6 年考核期，第 3 年中期评估"),
          ("Associate Professor", "通常同时获得 tenure（终身教职）"), ("Full Professor", "Endowed Chair / Distinguished")]
    cn = [("博士", "学制 3–4 年，延期常见"), ("博士后 / 师资博士后", "2–3 年；出站可留校或转预聘"),
          ("讲师 · 助理研究员 / 预聘助理教授", "中级；预聘期常见 3+3 或 6 年"),
          ("副教授 · 副研究员", "副高级；部分高校预聘直接给副高"), ("教授 · 研究员", "正高级；博导资格另行评定")]
    mid = ["学位等价，回国需认证", "都是过渡岗位", "tenure 评审 ≈ 预聘期考核", "tenure ≈ 长聘 / 编制", "大致对应"]
    for i in range(5):
        y = 360 - i * 72
        f.add(box(40, y, 400, 52, us[i][0], us[i][1], "k-us"))
        f.add(box(640, y, 400, 52, cn[i][0], cn[i][1], "k-cn"))
        f.add(f.ln(f"M440,{y + 26} H640", dash=True))
        f.add(pill(540, y + 26, mid[i]))
    f.add(f.arr("M24,410 V74", "u"), f.arr("M1056,410 V74", "c"))
    f.add(text(540, 446, "层级大致对应，并非一一等同；中国高校“预聘-长聘”和传统“编制 + 职称评审”两套体系并存。", "t-s", "middle"))
    return f


# ---------------------------------------------- 08 / 09 education ladders
def age_axis(f, X, y=262):
    f.add(f.ln(f"M{X(3):g},{y} H{X(30):g}", cls="l-axis"))
    for a in range(3, 31):
        f.add(f.ln(f"M{X(a):g},{y} V{y + (6 if a % 3 == 0 else 3)}", cls="l-axis"))
        if a % 3 == 0:
            f.add(text(X(a), y + 20, f"{a} 岁" if a in (3, 30) else str(a), "t-xs t-m", "middle"))


def gate(f, X, a, label, key=None):
    x = X(a)
    g = (f'<path d="M{x:g},48 L{x + 8:g},56 L{x:g},64 L{x - 8:g},56 Z" class="m-ink2"/>'
         + text(x, 38, label, "t-xs t-b", "middle"))
    f.add(stage(key, g, label) if key else g)


def edu_bar(f, X, a0, a1, y, h, cls, label, key=None, tcls="t-s t-b"):
    x0, x1 = X(a0), X(a1)
    g = rect(x0 + 1, y, x1 - x0 - 2, h, cls, 6) + text((x0 + x1) / 2, y + h / 2 + 4, label, tcls, "middle", maxw=x1 - x0 - 6)
    f.add(stage(key, g, label) if key else g)


def fig08():
    f = Fig("08-china-education-system", 1080, 330,
            "中国教育体系（按年龄）：幼儿园 → 小学 6 年 → 初中 3 年 → 中考 → 高中/中职 → 高考 → 本科 → 硕士 → 博士")
    X = lambda a: 70 + (a - 3) * 36
    f.add(text(12, 96, "普通教育", "t-s t-b"), text(12, 160, "职业教育", "t-s t-b"), text(12, 214, "学位", "t-s t-b"))
    gate(f, X, 15, "中考", "cn-zhongkao")
    gate(f, X, 18, "高考", "cn-gaokao")
    gate(f, X, 22, "考研 / 推免", "cn-kaoyan")
    gate(f, X, 25, "申请-考核", "cn-phdadmit")
    edu_bar(f, X, 3, 6, 72, 40, "k-mute", "幼儿园", "cn-kg")
    edu_bar(f, X, 6, 12, 72, 40, "k-cn", "小学 6 年", "cn-pri")
    edu_bar(f, X, 12, 15, 72, 40, "k-cn", "初中 3 年", "cn-mid")
    edu_bar(f, X, 15, 18, 72, 40, "k-box", "普通高中", "cn-high")
    edu_bar(f, X, 18, 22, 72, 40, "k-box", "本科 4 年", "cn-ug")
    edu_bar(f, X, 22, 25, 72, 40, "k-box", "硕士 2–3 年", "cn-ms")
    edu_bar(f, X, 25, 29, 72, 40, "k-solid-cn", "博士 3–4 年", "cn-phd", "t-s t-b t-inv")
    f.add(rect(X(29) + 1, 72, X(30) - X(29) - 2, 40, "k-mute k-dash", 6))
    f.add(text(X(29.5), 128, "常延期", "t-xs", "middle"))
    # compulsory bracket
    f.add(f.ln(f"M{X(6):g},118 V126 H{X(15):g} V118", cls="l l-cn"))
    f.add(text(X(10.5), 142, "九年义务教育（约 6–15 岁）", "t-s t-cn", "middle"))
    edu_bar(f, X, 15, 18, 144, 32, "k-box", "中职", "cn-voc")
    edu_bar(f, X, 18, 21, 144, 32, "k-box", "高职（专科）", "cn-voc")
    edu_bar(f, X, 21, 23, 144, 32, "k-box", "专升本", "cn-voc")
    # degrees
    f.add(f.ln(f"M{X(18):g},210 H{X(30):g}", cls="l-grid"))
    for a, lab in [(22, "学士"), (25, "硕士"), (29, "博士")]:
        f.add(f'<circle cx="{X(a):g}" cy="210" r="6" class="m-cn"/>', text(X(a), 232, lab, "t-xs t-b", "middle"))
    f.add(text(X(18) - 8, 214, "《学位法》2025 施行：学术 / 专业学位", "t-xs", "end"))
    age_axis(f, X)
    f.add(text(12, 316, "点击阶段查看说明。年龄为典型值；部分地区小学五年制、初中四年制（五四制），个人路径会有差异。", "t-s"))
    return f


def fig09():
    f = Fig("10-us-education-system", 1080, 330,
            "美国教育体系（按年龄）：Pre-K → K–12（公立免费）→ 本科 4 年 → PhD（STEM 中位约 5–6 年）→ 博后；社区学院可转学")
    X = lambda a: 70 + (a - 3) * 36
    f.add(text(12, 96, "主线", "t-s t-b"), text(12, 160, "分支", "t-s t-b"), text(12, 214, "专业学位", "t-s t-b"))
    gate(f, X, 17.5, "SAT/ACT", "us-sat")
    gate(f, X, 22, "GRE（多可选）", "us-gre")
    gate(f, X, 24.5, "资格考试", "us-phd")
    gate(f, X, 27.5, "答辩", "us-phd")
    edu_bar(f, X, 3, 5, 72, 40, "k-mute", "Pre-K", "us-prek")
    edu_bar(f, X, 5, 6, 72, 40, "k-us", "K", "us-k12")
    edu_bar(f, X, 6, 11, 72, 40, "k-us", "小学 Elementary", "us-k12")
    edu_bar(f, X, 11, 14, 72, 40, "k-us", "初中 Middle", "us-k12")
    edu_bar(f, X, 14, 18, 72, 40, "k-us", "高中 High School", "us-k12")
    edu_bar(f, X, 18, 22, 72, 40, "k-box", "本科 College", "us-college")
    edu_bar(f, X, 22, 28, 72, 40, "k-solid-us", "PhD（STEM 中位约 5–6 年）", "us-phd", "t-s t-b t-inv")
    edu_bar(f, X, 28, 30, 72, 40, "k-mute k-dash", "博后", "us-postdoc")
    f.add(f.ln(f"M{X(5):g},118 V126 H{X(18):g} V118", cls="l l-us"))
    f.add(text(X(11.5), 142, "K–12：公立学校免费（不论移民身份）", "t-s t-us", "middle"))
    edu_bar(f, X, 18, 20, 144, 32, "k-box", "社区学院", "us-cc")
    f.add(f.arr(f"M{X(20) + 2:g},160 C{X(20) + 30:g},160 {X(20) + 20:g},116 {X(20.6):g},114"))
    f.add(text(X(20) + 26, 172, "转学", "t-xs"))
    edu_bar(f, X, 22, 24, 144, 32, "k-box", "硕士 1–2 年", "us-ms")
    f.add(text(X(24) + 8, 164, "多数 STEM 博士本科直博", "t-xs"))
    edu_bar(f, X, 22, 26, 196, 32, "k-box", "MD 医学 4 年", "us-md")
    edu_bar(f, X, 26, 30, 196, 32, "k-mute k-dash", "住院医 3–7 年", "us-md")
    age_axis(f, X)
    f.add(text(12, 316, "点击阶段查看说明。强制入学年龄各州不同（多为 6–18 岁，部分州到 16 岁）；法学 JD 为本科后 3 年。", "t-s"))
    return f


# --------------------------------------------- 10 Chinese university tiers
def fig10():
    f = Fig("09-china-university-tiers", 1080, 300,
            "中国高校标签的包含关系：双一流 147 所 ⊃ 211 约 112 所 ⊃ 985 共 39 所 ⊃ C9 共 9 所")
    f.add(rect(20, 16, 560, 270, "k-box", 16))
    f.add(text(40, 44, "双一流建设高校 147 所（2022 年第二轮）", "t t-b"))
    f.add(rect(44, 60, 512, 210, "k-cn-wash", 14))
    f.add(text(64, 86, "“211 工程” 约 112 所（历史标签）", "t t-b t-cn"))
    f.add(rect(68, 104, 300, 150, "k-cn", 12))
    f.add(text(88, 130, "“985 工程” 39 所", "t t-b t-cn"))
    f.add(rect(92, 150, 150, 84, "k-solid-cn", 10))
    f.add(text(167, 186, "C9 联盟", "t t-b t-inv", "middle"))
    f.add(text(167, 206, "9 所", "t-s t-inv", "middle"))
    f.add(text(256, 186, "← 最顶尖", "t-xs"))
    f.add(box(384, 116, 156, 86, "一流大学建设", ("高校 42 所", "= 985 的 39 所 + 3"), "k-box", "t-s t-b", "t-xs"))
    notes = [("985 / 211 已于 2016–2017 年并入“双一流”，", "但招聘、落户和人才项目中仍常被当作筛选条件。"),
             ("很多单位看“第一学历”（本科院校层次）。",),
             ("具体学科是否入选“双一流学科”，", "往往比学校标签更影响岗位层级和经费。"),
             ("上海留学回国落户按世界排名认定", "（QS、THE、U.S. News、软科）前 50 / 51–100。")]
    y = 50
    for lines in notes:
        f.add(f'<circle cx="624" cy="{y - 4}" r="2.5" class="m-ink2"/>')
        for s in lines:
            f.add(text(636, y, s, "t-s", maxw=430))
            y += 22
        y += 14
    return f


# --------------------------------------------------- 11 the year wheel
def wheel_ang(mo, d):
    frac = (mo - 1 + (d - 1) / calendar.monthrange(2026, mo)[1]) / 12
    return -90 + frac * 360


def ring(cx, cy, r0, r1, a0, a1):
    a0r, a1r = math.radians(a0), math.radians(a1)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    p = lambda r, a: (cx + r * math.cos(a), cy + r * math.sin(a))
    (x1, y1), (x2, y2) = p(r1, a0r), p(r1, a1r)
    (x3, y3), (x4, y4) = p(r0, a1r), p(r0, a0r)
    return (f"M{x1:.1f},{y1:.1f} A{r1},{r1} 0 {large} 1 {x2:.1f},{y2:.1f} "
            f"L{x3:.1f},{y3:.1f} A{r0},{r0} 0 {large} 0 {x4:.1f},{y4:.1f} Z")


def fig11():
    f = Fig("11-year-wheel", 1080, 600,
            "一年中的关键窗口：外两圈为美国（H-1B、教职求职），内两圈为中国（秋招春招、海外优青、国考）；指针为今天")
    cx, cy = 300, 300
    lanes = {"us1": (240, 260), "us2": (216, 236), "cn1": (186, 206), "cn2": (162, 182)}
    f.add(f'<circle cx="{cx}" cy="{cy}" r="266" class="k-box"/>')
    for m in range(12):
        a = math.radians(-90 + m * 30)
        f.add(f.ln(f"M{cx + 150 * math.cos(a):.1f},{cy + 150 * math.sin(a):.1f} L{cx + 266 * math.cos(a):.1f},{cy + 266 * math.sin(a):.1f}", cls="l-grid"))
        am = math.radians(-90 + m * 30 + 15)
        f.add(text(round(cx + 283 * math.cos(am), 1), round(cy + 283 * math.sin(am) + 4, 1), f"{m + 1}月", "t-s t-b", "middle"))
    for r in (150, 210, 266):
        f.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" class="l-grid" fill="none"/>')
    events = [
        ("us1", (3, 1), (3, 25), "m-us", "H-1B 注册"),
        ("us1", (4, 1), (6, 30), "m-us", "H-1B 递交 I-129"),
        ("us2", (9, 1), (12, 15), "k-us", "教职申请"),
        ("us2", (1, 10), (4, 30), "k-us", "教职面试 · offer"),
        ("cn1", (8, 1), (11, 30), "m-cn", "秋招"),
        ("cn1", (3, 1), (5, 31), "m-cn", "春招"),
        ("cn2", (2, 15), (4, 20), "k-cn", "海外优青申报"),
        ("cn2", (10, 14), (10, 24), "k-cn", "国考报名"),
    ]
    for lane, (m0, d0), (m1, d1, ), cls, lab in events:
        r0, r1 = lanes[lane]
        a0, a1 = wheel_ang(m0, d0), wheel_ang(m1, d1) + 360 / 365
        f.add(f'<path d="{ring(cx, cy, r0, r1, a0, a1)}" class="{cls}"><title>{esc(lab)}</title></path>')
    # point events
    for (mo, d), lane, cls, lab in [((10, 1), "us1", "m-us", "H-1B 生效 10/1"), ((11, 29), "cn2", "m-cn", "国考笔试")]:
        r0, r1 = lanes[lane]
        a = math.radians(wheel_ang(mo, d))
        rr = (r0 + r1) / 2
        f.add(f'<circle cx="{cx + rr * math.cos(a):.1f}" cy="{cy + rr * math.sin(a):.1f}" r="7" class="{cls} ring-dot"><title>{esc(lab)}</title></circle>')
    # needle (points to Jan 1; rotated to today by build + page script)
    today = dt.date(2026, 11, 12)
    deg = wheel_ang(today.month, today.day) + 90
    f.add(f'<g class="wheel-now" transform="rotate({deg:.2f} {cx} {cy})">'
          f'<path d="M{cx},{cy - 140} V{cy - 270}" class="l-now"/>'
          f'<circle cx="{cx}" cy="{cy - 272}" r="5" class="m-ink"/></g>')
    f.add(text(cx, cy - 6, "一年中的", "t-h", "middle"), text(cx, cy + 16, "关键窗口", "t-h", "middle"))
    f.add(text(cx, cy + 40, "指针 = 今天", "t-xs", "middle"))
    # legend
    lx = 640
    f.add(text(lx, 70, "美国（外两圈）", "t-h t-us"))
    us_items = [("m-us", "H-1B 注册：3 月（雇主提交，约 2–3 周）"),
                ("m-us", "H-1B 递交 I-129：4/1–6/30；● 10/1 生效"),
                ("k-us", "教职申请：9–12 月"),
                ("k-us", "教职面试与 offer：1–4 月"),
                (None, "报税截止 4/15；离境当年注意 dual-status")]
    y = 98
    for cls, s in us_items:
        if cls:
            f.add(rect(lx, y - 10, 14, 12, cls, 2))
        else:
            f.add(text(lx + 7, y, "·", "t t-b", "middle"))
        f.add(text(lx + 24, y, s, "t-s", maxw=420))
        y += 26
    y += 24
    f.add(text(lx, y, "中国（内两圈）", "t-h t-cn"))
    y += 28
    cn_items = [("m-cn", "秋招：8–11 月（提前批 7–8 月）"),
                ("m-cn", "春招：3–5 月"),
                ("k-cn", "海外优青：约 2–4 月申报（以基金委当年通知为准）"),
                ("k-cn", "国考：10 月中旬报名；● 11 月底至 12 月初笔试"),
                (None, "高校人才招聘全年滚动，海外青年学者论坛多在秋冬")]
    for cls, s in cn_items:
        if cls:
            f.add(rect(lx, y - 10, 14, 12, cls, 2))
        else:
            f.add(text(lx + 7, y, "·", "t t-b", "middle"))
        f.add(text(lx + 24, y, s, "t-s", maxw=420))
        y += 26
    f.add(text(lx, y + 26, "日期为典型窗口，每年以官方通知为准。", "t-xs"))
    return f


# --------------------------------------------------- 12 planning gantt
def fig12():
    f = Fig("12-plan-gantt", 1080, 404,
            "规划甘特图（以 5 月毕业为例）：四条路线从毕业前 18 个月到毕业后 36 个月的关键阶段")
    X = lambda m: 200 + (m + 18) * 15.5
    for m in range(-18, 37, 6):
        f.add(f.ln(f"M{X(m):g},44 V368", cls="l-grid"))
        lab = "毕业" if m == 0 else (f"{m:+d}")
        f.add(text(X(m), 36, lab, "t-xs t-m t-b" if m == 0 else "t-xs t-m", "middle"))
    f.add(text(X(36) + 4, 22, "个月", "t-xs", "end"))
    f.add(f.ln(f"M{X(0):g},44 V372", cls="l l-strong l-dash"))
    tracks = [("美国 · 工业界", "OPT → H-1B → 绿卡", "u"), ("美国 · 学术界", "博后 → 教职", "u"),
              ("回国 · 高校 / 院所", "认证 → 预聘 / 人才项目", "c"), ("回国 · 企业 / 公务员", "秋招 · 春招 · 国考", "c")]
    for k, (t, s, kind) in enumerate(tracks):
        y0 = 54 + k * 78
        f.add(text(12, y0 + 30, t, "t t-b " + ("t-us" if kind == "u" else "t-cn")))
        f.add(text(12, y0 + 48, s, "t-xs"))
        if k:
            f.add(f.ln(f"M12,{y0 - 4} H{X(36):g}", cls="l-grid"))

    def bar(k, row, m0, m1, cls, label, tcls="t-xs t-b", where="in"):
        y = 54 + k * 78 + (8 if row == 0 else 38)
        x0, x1 = X(m0), X(m1)
        f.add(rect(x0, y, x1 - x0, 24, cls, 5))
        if where == "in":
            f.add(text((x0 + x1) / 2, y + 16, label, tcls, "middle", maxw=x1 - x0 - 6))
        else:
            f.add(text(x1 + 5, y + 16, label, "t-xs"))

    def diamond(k, row, m):
        y = 54 + k * 78 + (8 if row == 0 else 38) + 12
        x = X(m)
        f.add(f'<path d="M{x:g},{y - 8} L{x + 8:g},{y} L{x:g},{y + 8} L{x - 8:g},{y} Z" class="m-us"/>')

    bar(0, 0, -9, -6, "k-us", "求职")
    bar(0, 0, 1, 13, "k-solid-us", "OPT 12 个月", "t-xs t-b t-inv")
    bar(0, 0, 13, 36, "k-us", "STEM OPT 24 个月")
    for m in (-2, 10, 22, 34):
        diamond(0, 1, m)
    f.add(text(X(-2) - 12, 54 + 38 + 16, "H-1B 抽签 ◆", "t-xs t-b t-us", "end"))
    bar(0, 1, 11.5, 20.5, "k-mute", "NIW / PERM 准备")
    bar(1, 0, -12, -4, "k-us", "联系博后")
    bar(1, 0, 0, 36, "k-solid-us", "博士后（OPT / cap-exempt H-1B / J-1）", "t-xs t-b t-inv")
    bar(1, 1, 16, 24, "k-us", "教职求职季")
    bar(1, 1, 28, 36, "k-us", "教职求职季")
    bar(2, 0, -12, 0, "k-cn", "投递 · 青年学者论坛")
    bar(2, 0, 0, 3, "k-solid-cn", "认证", "t-xs t-b t-inv")
    bar(2, 1, 1, 36, "k-mute", "海外博后：满 36 个月可申报海外优青 →")
    bar(3, 0, -10, -6, "k-cn", "秋招")
    bar(3, 0, -3, 0, "k-cn", "春招")
    bar(3, 1, -7, -6, "k-solid-cn", "国考 10 月", where="right")
    bar(3, 1, 0, 24, "k-mute k-dash", "两年择业期（可按应届生）")
    f.add(text(12, 394, "以 5 月毕业为例：“−9”≈ 前一年 8 月。秋招在毕业前一年；海外优青要求博士后在海外全职满 36 个月（业绩突出者可放宽）。", "t-s"))
    return f


# ------------------------------------------------ 13–16 third countries
SHORT = {"germany": "德国", "hongkong": "中国香港", "us": "美国（对照）"}


def xname(k):
    return SHORT.get(k, abroad.X[k]["name"])


def xlink(k, inner, label):
    return f'<a href="#abroad" data-x="{k}" class="hit" aria-label="{esc(label)}">{inner}</a>'


def diamond(cx, cy, r, cls):
    return f'<path d="M{cx:.1f},{cy - r:.1f} L{cx + r:.1f},{cy:.1f} L{cx:.1f},{cy + r:.1f} L{cx - r:.1f},{cy:.1f} Z" class="{cls}"/>'


def fig13():
    X = abroad.X
    keys = ["us"] + sorted(abroad.ORDER, key=lambda k: (X[k]["pr"][1], X[k]["pr"][0]))
    f = Fig("13-years-to-pr-and-citizenship", 1080, 700,
            "从抵达到永久身份与入籍要几年：13 个目的地对照（含常见审理时间，粗估）")
    x0, k = 352, 53
    Xp = lambda v: x0 + v * k
    top = 92
    rowh = 42
    # legend
    lx = 16
    f.add(rect(lx, 20, 26, 10, "m-ch-x", 3), text(lx + 32, 30, "永久身份（最快 → 常见）", "t-s"))
    lx += 32 + tw("永久身份（最快 → 常见）", 11.5) + 22
    f.add(rect(lx, 20, 26, 10, "k-x-soft", 3), text(lx + 32, 30, "先拿到、但不是无条件永居的身份", "t-s"))
    lx += 32 + tw("先拿到、但不是无条件永居的身份", 11.5) + 22
    f.add(rect(lx, 20, 26, 10, "k-x-dash", 3), text(lx + 32, 30, "酌情审批，可能拿不到", "t-s"))
    lx += 32 + tw("酌情审批，可能拿不到", 11.5) + 22
    f.add(diamond(lx + 6, 25, 6, "m-ink"), f.ln(f"M{lx + 6},25 H{lx + 22}", cls="l-strong"), diamond(lx + 22, 25, 6, "m-ink"),
          text(lx + 34, 30, "入籍", "t-s"))
    lx += 34 + tw("入籍", 11.5) + 22
    f.add(diamond(lx + 6, 25, 6, "k-reform"), text(lx + 18, 30, "改革落地后", "t-s"))
    # grid
    bottom = top + rowh * len(keys)
    for v in range(0, 14):
        f.add(f.ln(f"M{Xp(v)},{top - 10} V{bottom}", cls="l-grid" if v else "l-axis"))
        f.add(text(Xp(v), top - 16, f"{v}", "t-xs t-m", "middle"))
        f.add(text(Xp(v), bottom + 16, f"{v}", "t-xs t-m", "middle"))
    f.add(text(Xp(13), top - 30, "年", "t-xs", "middle"))
    f.add(text(Xp(6.5), bottom + 36, "从抵达（美国：从博士毕业）起算的年数，含常见审理时间；按 2026-11 规则粗估，个人情况差异很大", "t-s", "middle"))
    for i, key in enumerate(keys):
        o = X[key]
        cy = top + rowh * i + rowh / 2
        if i % 2 == 0:
            f.add(rect(8, cy - rowh / 2, 1064, rowh, "k-zebra", 0))
        if key == "us":
            f.add(f.ln(f"M8,{cy + rowh / 2} H1072", cls="l-axis"))
        inner = text(16, cy - 3, xname(key), "t t-b" + (" t-us" if key == "us" else ""), maxw=320)
        inner += text(16, cy + 13, o.get("note", ""), "t-xs", maxw=328)
        f.add(xlink(key, inner, xname(key)) if key != "us" else inner)
        y = cy - 6
        if o.get("soft"):
            a, b = o["soft"]
            if b - a < 0.05:
                f.add(f'<circle cx="{Xp(a)}" cy="{cy}" r="6" class="k-x-soft"/>')
                f.add(text(Xp(a) + 10, cy - 9, o["softname"], "t-xs t-x"))
            else:
                f.add(rect(Xp(a), y, (b - a) * k, 12, "k-x-soft", 3))
                f.add(text(Xp(a), cy - 9, o["softname"], "t-xs t-x"))
        a, b = o["pr"]
        cls = "k-x-dash" if o.get("pr_dash") else ("m-ch-x" if key != "us" else "m-us")
        f.add(rect(Xp(a), y, max(4, (b - a) * k), 12, cls, 3))
        end = Xp(b)
        if o.get("cit"):
            c0, c1 = o["cit"]
            f.add(f.ln(f"M{end + 4},{cy} H{Xp(c0) - 7}", cls="l-grid l-dash"))
            if c1 > c0:
                f.add(f.ln(f"M{Xp(c0)},{cy} H{Xp(c1)}", cls="l-strong"))
            f.add(diamond(Xp(c0), cy, 6, "m-ink"), diamond(Xp(c1), cy, 6, "m-ink"))
            end = Xp(c1)
        else:
            f.add(text(end + 10, cy + 4, "无入籍步骤（本来就是中国国籍）", "t-xs"))
        rf = o.get("reform")
        if rf:
            if rf[0]:
                f.add(rect(Xp(rf[0]) - 2, y - 2, 4, 16, "k-reform", 1))
            if rf[1]:
                f.add(f.ln(f"M{end + 7},{cy} H{Xp(rf[1]) - 7}", cls="l-w l-dash"))
                f.add(diamond(Xp(rf[1]), cy, 6, "k-reform"))
                f.add(text(Xp(rf[1]), cy - 11, "改革后", "t-xs t-w", "middle"))
    return f


def fig14():
    X = abroad.X
    rows = abroad.ORDER
    f = Fig("14-third-country-route-atlas", 1080, 668,
            "12 个第三地的路线图谱：入境身份 → 过渡条件 → 永久身份 → 入籍")
    cols = [(120, 262, "入境 / 工作身份", "k-box"), (404, 250, "过渡条件", "k-mute"),
            (676, 204, "永久身份", "k-x"), (902, 162, "入籍", "k-box")]
    for x, w, t, _ in cols:
        f.add(text(x + w / 2, 30, t, "t t-b", "middle"))
    rowh, top = 48, 46
    for i, key in enumerate(rows):
        o = X[key]
        y = top + i * rowh
        f.add(text(16, y + 26, xname(key), "t t-b", maxw=100))
        inner = []
        for j, ((x, w, _, cls), (t, s)) in enumerate(zip(cols, o["route4"])):
            c = cls
            if key == "hongkong" and j == 3:
                c = "k-mute k-dash"
            inner.append(box(x, y + 4, w, 38, t, s, c, "t-s t-b", "t-xs"))
            if j < 3:
                inner.append(f.arr(f"M{x + w + 2},{y + 23} H{cols[j + 1][0] - 2}"))
        f.add(xlink(key, "".join(inner), xname(key) + "：查看详情"))
    f.add(text(16, top + 12 * rowh + 22, "点击任一行，跳到下方该地区的详细面板。年限和门槛见图 13、图 16；“永久身份”在新西兰、爱尔兰、瑞士有不同层级，详见各地区说明。", "t-s"))
    return f


def fig15():
    f = Fig("15-academic-ranks-world", 1080, 540,
            "全球学术职级对照：博士后 → 起步教职 → 中级 / 终身 → 正教授，10 个体系")
    levels = ["博士后 / 研究人员", "起步教职", "中级 · 常与终身挂钩", "正教授"]
    data = [
        ("美国 · 加拿大", "us", ["Postdoc", "Assistant Prof（tenure-track）", "Associate Prof（通常获 tenure）", "Full Professor"]),
        ("英国 · 爱尔兰 · 新西兰", "x", ["Research Associate / Fellow", "Lecturer（爱尔兰称 Asst Prof）", "Senior Lecturer · Reader", "Professor"]),
        ("澳大利亚", "x", ["Level A 博士后", "Level B Lecturer", "Level C Sr Lecturer · D Assoc", "Level E Professor"]),
        ("中国香港 · 新加坡", "x", ["Postdoc · Research Fellow", "Assistant Prof（tenure track）", "Associate Prof", "Professor · Chair Prof"]),
        ("瑞士", "x", ["Postdoc · Senior Scientist", "Assistant Prof（有或无 TT）", "Associate Prof", "Full Professor"]),
        ("德国", "x", ["wiss. Mitarbeiter（E13 定期）", "Juniorprof. W1 · 研究组组长", "Habilitation · W2", "W3 Professor"]),
        ("荷兰", "x", ["Postdoc（定期合同）", "Universitair docent（UD）", "Universitair hoofddocent", "Hoogleraar"]),
        ("法国", "x", ["Postdoc · ATER", "Maître de conférences", "取得 HDR 指导研究资格", "Professeur des universités"]),
        ("日本", "x", ["博士研究员 PD · 特任", "助教 · 講師", "准教授", "教授"]),
        ("中国（对照）", "cn", ["博士后 / 师资博后", "讲师 · 预聘助理教授", "副教授 · 副研究员", "教授 · 研究员"]),
    ]
    x0, cw, gap = 176, 210, 14
    for j, lv in enumerate(levels):
        f.add(text(x0 + j * (cw + gap) + cw / 2, 30, lv, "t t-b", "middle"))
    rowh, top = 44, 46
    for i, (name, side, cells) in enumerate(data):
        y = top + i * rowh
        tcls = "t t-b" + (" t-us" if side == "us" else " t-cn" if side == "cn" else "")
        f.add(text(16, y + 25, name, tcls, maxw=156))
        cls = {"us": "k-us", "cn": "k-cn", "x": "k-x"}[side]
        for j, c in enumerate(cells):
            x = x0 + j * (cw + gap)
            f.add(box(x, y + 5, cw, 32, c, (), cls, "t-s t-b"))
            if j < 3:
                f.add(f.arr(f"M{x + cw + 1},{y + 21} H{x + cw + gap - 1}"))
    yb = top + len(data) * rowh + 18
    f.add(text(16, yb, "层级只是大致对应。法国 MCF 和荷兰 UD 一入职就是长期岗位；德国 W1 一般最长 6 年，传统路线要先拿 Habilitation；", "t-s"))
    f.add(text(16, yb + 20, "日本“特任”多为定期合同；英联邦的 Lecturer 起薪和职责与美国 Assistant Professor 接近，但没有统一的 tenure 评审。", "t-s"))
    return f


def fig16():
    fx = abroad.FX
    f = Fig("16-work-visa-salary-floors", 1080, 560,
            "主要工作签证的最低工资门槛（折合美元/年，示意汇率）")
    rows = [
        ("英国 · Skilled Worker", [("STEM 博士底线", 33400, "GBP"), ("一般门槛", 41700, "GBP")]),
        ("爱尔兰 · CSEP", [("应届", 36848, "EUR"), ("清单职位", 40904, "EUR"), ("非清单", 68911, "EUR")]),
        ("新西兰 · SMC", [("时薪 35 × 2,080", 72800, "NZD")]),
        ("荷兰 · 高技术移民", [("应届", 3122 * 12, "EUR"), ("30 岁以下", 4357 * 12, "EUR"), ("30 岁以上", 5942 * 12, "EUR")]),
        ("法国 · Talent", [("合格雇员", 39582, "EUR"), ("蓝卡", 59373, "EUR")]),
        ("德国 · 欧盟蓝卡", [("应届 / 短缺", 45934, "EUR"), ("标准", 50700, "EUR")]),
        ("澳大利亚 · 482", [("Core", 79423, "AUD"), ("Specialist", 146576, "AUD")]),
        ("新加坡 · EP（2026）", [("23 岁", 5600 * 12, "SGD"), ("30 岁", 7223 * 12, "SGD"), ("45 岁+", 10700 * 12, "SGD")]),
        ("日本 · 高度专门职ロ", [("硬门槛", 3000000, "JPY")]),
    ]
    x0, k = 236, 7.4  # px per USD 1k
    Xp = lambda usd_k: x0 + usd_k * k
    top, rowh = 60, 44
    bottom = top + rowh * len(rows)
    for v in range(0, 111, 10):
        f.add(f.ln(f"M{Xp(v):.1f},{top - 8} V{bottom}", cls="l-grid" if v else "l-axis"))
        f.add(text(Xp(v), bottom + 16, f"{v}k" if v else "0", "t-xs t-m", "middle"))
    f.add(text(Xp(55), bottom + 36, "美元 / 年（千）", "t-xs", "middle"))
    f.add(text(16, 30, "每个点是一档门槛（标签为当地货币）。门槛只是“最低能签”，不等于市场工资；荷兰为月薪 × 12，不含 8% 假期津贴。", "t-s"))
    sym = {"GBP": "£", "EUR": "€", "NZD": "NZ$", "AUD": "A$", "SGD": "S$", "JPY": "¥"}
    for i, (name, pts) in enumerate(rows):
        cy = top + i * rowh + rowh / 2
        if i % 2 == 0:
            f.add(rect(8, cy - rowh / 2, 1064, rowh, "k-zebra", 0))
        f.add(text(16, cy + 4, name, "t t-b", maxw=214))
        xs = [Xp(v * fx[c] / 1000) for _, v, c in pts]
        if len(xs) > 1:
            f.add(f.ln(f"M{min(xs):.1f},{cy} H{max(xs):.1f}", cls="l-x"))
        for j, ((lab, v, c), x) in enumerate(zip(pts, xs)):
            usd = v * fx[c] / 1000
            f.add(f'<circle cx="{x:.1f}" cy="{cy}" r="5.5" class="m-ch-x"><title>{esc(name)} {esc(lab)}：'
                  f'{sym[c]}{v:,.0f} ≈ ${usd:.0f}k</title></circle>')
            local = f"{sym[c]}{v / 1e6:g}M" if c == "JPY" else f"{sym[c]}{v / 1000:.1f}k"
            up = j % 2 == 0
            f.add(text(x, cy - 10 if up else cy + 19, f"{lab} {local}", "t-xs", "middle"))
    yb = bottom + 58
    f.add(text(16, yb, "没有统一数额的：加拿大（GTS 按现行工资）、中国香港（按市场水平）、瑞士（按当地行业惯例工资）、美国 H-1B（按 LCA 现行工资）。", "t-s"))
    rates = " · ".join(f"1 {c} = {v:.4g} USD" for c, v in fx.items() if c in sym)
    f.add(text(16, yb + 20, "示意汇率（只用于比较量级，非实时）：" + rates, "t-xs"))
    return f


FIGS = [fig01, fig02, fig03, fig04, fig05, fig06, fig07, fig08, fig09, fig10, fig11, fig12,
        fig13, fig14, fig15, fig16]

# standalone stylesheet (literal tokens; light + dark)
TOK_LIGHT = dict(paper="#F3F5F4", paper2="#E8ECEB", card="#FFFFFF", ink="#16202A", ink2="#4E5A66", line="#CDD5D6",
                 us="#2B4C9B", ustint="#E4EBF8", uswash="#EEF2FA", cn="#B03A2E", cntint="#F8E4E0", cnwash="#FBF0EE",
                 mute="#9AA4AE", chcn="#B03A2E", chrow="#6B5FB5",
                 x="#0E6B63", xtint="#DDF0EC", xwash="#ECF6F4", chx="#008A7A", chw="#B87A12")
TOK_DARK = dict(paper="#11161C", paper2="#1A2129", card="#171E26", ink="#E4E9EE", ink2="#A2ADB8", line="#2F3A46",
                us="#8EADF2", ustint="#1C2A47", uswash="#16203A", cn="#F08C7A", cntint="#3B211E", cnwash="#2A1A19",
                mute="#5D6873", chcn="#D9644F", chrow="#8A80D0",
                x="#6CCFC4", xtint="#123230", xwash="#0F2422", chx="#1FA39C", chw="#BD822A")

SVG_RULES = """
.f-bg{fill:var(--paper)}
.k-box{fill:var(--card);stroke:var(--line);stroke-width:1}
.k-us{fill:var(--us-tint);stroke:var(--us);stroke-width:1.2}
.k-cn{fill:var(--cn-tint);stroke:var(--cn);stroke-width:1.2}
.k-mute{fill:var(--paper-2);stroke:var(--line);stroke-width:1}
.k-solid-us{fill:var(--us);stroke:var(--us)}
.k-solid-cn{fill:var(--cn);stroke:var(--cn)}
.k-ink{fill:var(--ink)}
.k-pill{fill:var(--card);stroke:var(--line)}
.k-dash{stroke-dasharray:4 3}
.k-band-us{fill:var(--us-wash)}
.k-band-cn{fill:var(--cn-wash)}
.k-band-mute{fill:var(--paper-2)}
.k-cn-wash{fill:var(--cn-wash);stroke:var(--cn);stroke-width:1;stroke-dasharray:5 4}
.m-us{fill:var(--us)} .m-cn{fill:var(--cn)} .m-ink{fill:var(--ink)} .m-ink2{fill:var(--ink-2)} .m-mute{fill:var(--mute)}
.m-ch-cn{fill:var(--ch-cn)} .m-ch-row{fill:var(--ch-row)}
.m-bg-us{fill:var(--card);stroke:var(--us);stroke-width:2}
.ring-dot{stroke:var(--card);stroke-width:2}
.l{fill:none;stroke:var(--ink-2);stroke-width:1.5}
.l-us{stroke:var(--us)} .l-cn{stroke:var(--cn)}
.l-dash{stroke-dasharray:5 4}
.l-strong{stroke:var(--ink);stroke-width:1.5}
.l-grid{fill:none;stroke:var(--line);stroke-width:1}
.l-axis{fill:none;stroke:var(--ink-2);stroke-width:1}
.l-tick{fill:none;stroke:var(--ink);stroke-width:2.5}
.l-now{fill:none;stroke:var(--ink);stroke-width:2.5;stroke-linecap:round}
text{font-family:var(--sans)}
.t{fill:var(--ink);font-size:13px;font-weight:500}
.t-s{fill:var(--ink-2);font-size:11.5px;font-weight:400}
.t-xs{fill:var(--ink-2);font-size:10.5px;font-weight:400}
.t-h{fill:var(--ink);font-family:var(--serif);font-size:15px;font-weight:700}
.t-b{font-weight:700}
.t-m{font-family:var(--mono)}
.t-us{fill:var(--us)} .t-cn{fill:var(--cn)} .t-inv{fill:var(--paper)}
.k-x{fill:var(--x-tint);stroke:var(--x);stroke-width:1.2}
.k-band-x{fill:var(--x-wash)}
.k-x-soft{fill:var(--x-tint);stroke:var(--ch-x);stroke-width:1.2}
.k-x-dash{fill:var(--x-tint);stroke:var(--ch-x);stroke-width:1.6;stroke-dasharray:4 3}
.k-reform{fill:var(--card);stroke:var(--ch-w);stroke-width:2}
.k-zebra{fill:var(--paper-2);opacity:.45}
.m-ch-x{fill:var(--ch-x)}
.l-x{fill:none;stroke:var(--ch-x);stroke-width:2}
.l-w{fill:none;stroke:var(--ch-w);stroke-width:1.5}
.t-x{fill:var(--x)} .t-w{fill:var(--ch-w)}
"""


def tokens_css(t):
    return (f"--paper:{t['paper']};--paper-2:{t['paper2']};--card:{t['card']};--ink:{t['ink']};--ink-2:{t['ink2']};"
            f"--line:{t['line']};--us:{t['us']};--us-tint:{t['ustint']};--us-wash:{t['uswash']};--cn:{t['cn']};"
            f"--cn-tint:{t['cntint']};--cn-wash:{t['cnwash']};--mute:{t['mute']};--ch-cn:{t['chcn']};--ch-row:{t['chrow']};"
            f"--x:{t['x']};--x-tint:{t['xtint']};--x-wash:{t['xwash']};--ch-x:{t['chx']};--ch-w:{t['chw']}")


STANDALONE_CSS = (
    ":root{" + tokens_css(TOK_LIGHT)
    + ";--sans:'Noto Sans SC','PingFang SC','Microsoft YaHei','Source Han Sans SC',sans-serif;"
    "--serif:'Noto Serif SC','Songti SC','STSong',serif;--mono:'IBM Plex Mono',Menlo,Consolas,monospace}"
    "@media (prefers-color-scheme: dark){:root{" + tokens_css(TOK_DARK) + "}}"
    + re.sub(r"\s+", " ", SVG_RULES)
)


def scope_css(rules, prefix):
    out = []
    for sel, body in re.findall(r"([^{}]+)\{([^{}]*)\}", rules):
        sels = ",".join(f"{prefix} {x.strip()}" for x in sel.split(",") if x.strip())
        out.append(f"{sels}{{{body}}}")
    return "\n".join(out)


def main():
    tpl = (ROOT / "src" / "template.html").read_text(encoding="utf-8")
    svgdir = ROOT / "svg"
    svgdir.mkdir(exist_ok=True)
    for fn in FIGS:
        f = fn()
        marker = f"<!--@fig:{f.key}-->"
        if marker not in tpl:
            WARN.append(f"template has no slot for {f.key}")
        tpl = tpl.replace(marker, f.inline())
        (svgdir / f"{f.key}.svg").write_text(f.standalone(STANDALONE_CSS), encoding="utf-8")
    for name, fn in abroad.HTML.items():
        marker = f"<!--@html:{name}-->"
        if marker not in tpl:
            WARN.append(f"template has no slot for {name}")
        tpl = tpl.replace(marker, fn())
    tpl = tpl.replace("/*@svg-rules*/", scope_css(SVG_RULES, ".fig-svg"))
    left = re.findall(r"<!--@(?:fig|html):[^>]+-->", tpl)
    if left:
        WARN.append(f"unfilled slots: {left}")
    (ROOT / "index.html").write_text(tpl, encoding="utf-8")
    print(f"built index.html ({len(tpl) // 1024} KB) and {len(FIGS)} SVG files")
    for w in WARN:
        print("WARN", w)


if __name__ == "__main__":
    main()
