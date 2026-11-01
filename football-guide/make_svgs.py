#!/usr/bin/env python3
"""Generate the football / game-day cheat-sheet SVGs."""
import os
import sys
from xml.sax.saxutils import escape

OUT = sys.argv[1] if len(sys.argv) > 1 else "."

FONT = ("'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',"
        "'Source Han Sans SC','WenQuanYi Zen Hei',sans-serif")
W = 1080
BG = "#f6f3ec"
INK = "#1b2333"
MUTED = "#4a5363"
NAVY = "#0b2545"
ACCENT = "#f4a261"
BLUE = "#1d4ed8"
RED = "#d62839"
TEAL = "#2a9d8f"
ORANGE = "#e76f51"
PURPLE = "#6d28d9"
FIELD = "#2d6a4f"
FIELD2 = "#368059"
CARD = "#ffffff"
LINE = "#e2ddd0"
TOTAL = 8


def t(x, y, spans, size=24, fill=INK, weight=400, anchor="start", extra=""):
    if isinstance(spans, str):
        spans = [(spans, {})]
    inner = []
    for txt, st in spans:
        attrs = ""
        if "fill" in st:
            attrs += f' fill="{st["fill"]}"'
        if "weight" in st:
            attrs += f' font-weight="{st["weight"]}"'
        if "size" in st:
            attrs += f' font-size="{st["size"]}"'
        inner.append(f"<tspan{attrs}>{escape(txt)}</tspan>")
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" '
            f'font-weight="{weight}" text-anchor="{anchor}" {extra}>{"".join(inner)}</text>')


def rect(x, y, w, h, fill, rx=0, stroke=None, sw=1, extra=""):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{s} {extra}/>'


def line(x1, y1, x2, y2, stroke, sw=2, extra=""):
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linecap="round" {extra}/>')


def header(n, title, sub, sub_size=26):
    return "".join([
        rect(0, 0, W, 170, NAVY),
        rect(0, 166, W, 4, ACCENT),
        t(60, 82, [(f"{n} ", {"fill": ACCENT}), (title, {})], size=46, fill="#ffffff", weight=700),
        t(60, 134, sub, size=sub_size, fill="#cfd8e3"),
        t(1020, 82, f"{n}/{TOTAL}", size=22, fill="#8fa3bf", anchor="end"),
    ])


def footer(h):
    return t(W // 2, h - 22, "冬季观赛速查 · Football & Game-Day Cheat Sheets", size=16,
             fill="#9aa1ab", anchor="middle")


def doc(h, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{h}" '
            f'viewBox="0 0 {W} {h}" font-family="{FONT}">'
            f'<defs>{defs}</defs>'
            f'{rect(0, 0, W, h, BG)}{body}{footer(h)}</svg>')


def ball(cx, cy, rx=20, ry=12):
    return (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#8b4513" stroke="#ffffff" stroke-width="2"/>'
            + line(cx - rx * 0.45, cy, cx + rx * 0.45, cy, "#ffffff", 1.6))


ARROW_DEFS = ('<marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" '
              'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ffffff"/></marker>')


# ---------------------------------------------------------------- 1 field & scoring
def svg1():
    H = 1662
    b = [header(1, "球场与得分", "Field & Scoring — 先看懂场地，再看懂比分")]
    FY, FH = 240, 400
    b.append(rect(60, FY, 960, FH, FIELD))
    for i in range(10):
        b.append(rect(140 + 80 * i, FY, 80, FH, FIELD if i % 2 == 0 else FIELD2))
    b.append(rect(60, FY, 80, FH, "#14365f"))
    b.append(rect(940, FY, 80, FH, "#14365f"))
    b.append(t(100, FY + FH / 2 + 8, "END ZONE · 端区", size=24, fill="#ffffff", weight=700,
               anchor="middle", extra=f'transform="rotate(-90 100 {FY + FH / 2})" letter-spacing="2"'))
    b.append(t(980, FY + FH / 2 + 8, "END ZONE · 端区", size=24, fill="#ffffff", weight=700,
               anchor="middle", extra=f'transform="rotate(90 980 {FY + FH / 2})" letter-spacing="2"'))
    for k in range(21):
        x = 140 + 40 * k
        if k in (0, 20):
            b.append(line(x, FY, x, FY + FH, "#ffffff", 6))
        elif k == 10:
            b.append(line(x, FY, x, FY + FH, ACCENT, 4))
        else:
            b.append(line(x, FY, x, FY + FH, "#ffffff", 2.4 if k % 2 == 0 else 1.2,
                          'stroke-opacity="0.85"'))
    for j in range(1, 10):
        x = 140 + 80 * j
        num = 10 * j if j <= 5 else 10 * (10 - j)
        b.append(t(x, FY + 70, str(num), size=30, fill="#ffffff", weight=700, anchor="middle"))
        b.append(t(x, FY + FH - 42, str(num), size=30, fill="#ffffff", weight=700, anchor="middle"))
    # goal posts
    b.append(rect(44, FY + FH / 2 - 30, 10, 60, "#ffd60a", rx=3))
    b.append(rect(1026, FY + FH / 2 - 30, 10, 60, "#ffd60a", rx=3))
    b.append(ball(540, FY + FH / 2))
    # labels above field
    b.append(t(140, FY - 14, "球门线 Goal Line", size=20, fill=NAVY, weight=700, anchor="middle"))
    b.append(t(540, FY - 14, "中线 50-yard line", size=20, fill="#b5651d", weight=700, anchor="middle"))
    b.append(t(940, FY - 14, "球门线 Goal Line", size=20, fill=NAVY, weight=700, anchor="middle"))
    # brackets
    by = FY + FH + 14
    for x1, x2 in ((62, 138), (142, 938), (942, 1018)):
        b.append(f'<path d="M{x1},{by} v10 H{x2} v-10" fill="none" stroke="{MUTED}" stroke-width="2"/>')
    b.append(t(100, by + 40, "10 码", size=20, fill=MUTED, anchor="middle"))
    b.append(t(540, by + 40, "100 码 Yards（约 91 米），每 10 码一条数字线", size=20, fill=MUTED, anchor="middle"))
    b.append(t(980, by + 40, "10 码", size=20, fill=MUTED, anchor="middle"))
    ly = 732
    b.append(rect(60, ly - 18, 22, 22, "#ffd60a", rx=4))
    b.append(t(96, ly, [("黄色 = 球门柱 Goal Post", {"weight": 700}), ("：射门要从两根立柱中间、横梁上方穿过", {})], size=21))
    b.append(rect(60, ly + 20, 22, 22, "#14365f", rx=4))
    b.append(t(96, ly + 38, [("深蓝 = 端区 End Zone", {"weight": 700}), ("：带球进入，或在这里接住传球 = 达阵", {})], size=21))
    b.append(t(60, ly + 76, [("→ ", {"fill": RED, "weight": 700}), ("两队各守一边，都想把球推进", {}), ("对方的端区", {"weight": 700})], size=21))

    b.append(t(60, 870, [("怎么得分 ", {}), ("Scoring", {"fill": BLUE})], size=34, fill=NAVY, weight=700))
    rows = [
        ("6", RED, "Touchdown (TD)", "达阵", "带球冲进对方端区，或在端区里接住传球。最主要的得分方式。"),
        ("1", "#457b9d", "Extra Point (PAT)", "附加分", "达阵后可以加踢一个近距离射门，踢进 +1 分（几乎都能进）。"),
        ("2", TEAL, "Two-Point Conversion", "两分转换", "达阵后不踢，改为在球门线前再攻一次，冲进端区 +2 分。"),
        ("3", ACCENT, "Field Goal (FG)", "射门", "离端区不够近、但在射程内时，把球踢过横梁、从两根立柱之间穿过。"),
        ("2", "#6c757d", "Safety", "安防", "进攻方在自己的端区里被放倒，防守方得 2 分（很少见）。"),
    ]
    y = 895
    for pts, col, en, zh, desc in rows:
        b.append(rect(60, y, 960, 104, CARD, rx=18, stroke=LINE))
        b.append(f'<circle cx="124" cy="{y + 52}" r="38" fill="{col}"/>')
        b.append(t(124, y + 66, pts, size=40, fill="#ffffff", weight=700, anchor="middle"))
        b.append(t(186, y + 44, [(en, {"fill": BLUE}), ("  " + zh, {"fill": NAVY})], size=29, weight=700))
        b.append(t(186, y + 84, desc, size=22, fill=MUTED))
        y += 120
    b.append(rect(60, 1505, 960, 100, "#fff4d6", rx=18, stroke="#f0d58a"))
    b.append(t(88, 1545, [("小技巧：", {"weight": 700}), ("比分常是 7（6+1）和 3 的组合，例如 10、14、17、24。", {})], size=22))
    b.append(t(88, 1583, [("差距在 8 分以内叫 ", {}), ("one-score game", {"fill": BLUE, "weight": 700}), ("：一次达阵 + 两分转换就能追平。", {})], size=22))
    return doc(H, "".join(b))


# ---------------------------------------------------------------- 2 downs
def svg2():
    H = 1540
    b = [header(2, "四次进攻：最核心的规则", "Downs & Distance — 4 次机会，推进 10 码")]
    b.append(t(60, 228, [("进攻方有 ", {}), ("4 次机会 (4 Downs)", {"weight": 700, "fill": NAVY}),
                          ("，要把球往前推进至少 ", {}), ("10 码 (Yards)", {"weight": 700, "fill": NAVY}), ("。", {})], size=25))
    b.append(t(60, 268, [("做到了 → 重新获得 4 次机会，叫 ", {}), ("First Down（首攻）", {"weight": 700, "fill": TEAL}),
                          ("；做不到 → 球权交给对方。", {})], size=25))

    def yd(v):
        return 60 + (v - 20) * 38.4
    SY, SH = 345, 225
    b.append(rect(60, SY, 960, SH, FIELD))
    for i in range(5):
        b.append(rect(yd(20 + 5 * i), SY, 192, SH, FIELD if i % 2 == 0 else FIELD2))
    for v in range(20, 46, 5):
        b.append(line(yd(v), SY, yd(v), SY + SH, "#ffffff", 2.4 if v % 10 == 0 else 1.2, 'stroke-opacity="0.85"'))
    b.append(t(72, SY + SH - 16, "20", size=28, fill="#ffffff", weight=700, extra='fill-opacity="0.9"'))
    b.append(t(yd(30), SY + SH - 16, "30", size=28, fill="#ffffff", weight=700, anchor="middle", extra='fill-opacity="0.9"'))
    b.append(t(yd(40), SY + SH - 16, "40", size=28, fill="#ffffff", weight=700, anchor="middle", extra='fill-opacity="0.9"'))
    b.append(line(yd(25), SY, yd(25), SY + SH, "#3a86ff", 7))
    b.append(line(yd(35), SY, yd(35), SY + SH, "#ffd60a", 7))
    b.append(t(yd(25), SY - 14, "争球线 Line of Scrimmage", size=21, fill=BLUE, weight=700, anchor="middle"))
    b.append(t(yd(35), SY - 14, "首攻线 First Down Line", size=21, fill="#a07800", weight=700, anchor="middle"))
    plays = [(25, 29, 400, "① 跑球 +4 码"), (29, 32, 455, "② 传球 +3 码"), (32, 37, 510, "③ 传球 +5 码，越过黄线！")]
    for a, c, yy, lab in plays:
        b.append(line(yd(a) + 4, yy, yd(c) - 24, yy, "#ffffff", 3, 'marker-end="url(#ah)"'))
        wlab = sum(19 if ord(ch) > 0x2000 else 10.5 for ch in lab) + 18
        b.append(rect((yd(a) + yd(c)) / 2 - wlab / 2, yy - 33, wlab, 28, "#173f2d", rx=8, extra='fill-opacity="0.92"'))
        b.append(t((yd(a) + yd(c)) / 2, yy - 13, lab, size=19, fill="#ffffff", weight=700, anchor="middle"))
        b.append(ball(yd(c), yy, 17, 10))
    b.append(t(60, 606, [("电视上的黄线是电脑画的；现场要看边线上的链子 ", {}),
                          ("The Chains / Sticks", {"fill": BLUE, "weight": 700}), (" 和橙色标杆。", {})], size=20, fill=MUTED))

    steps = [("1st & 10", NAVY, "第 1 攻，还差 10 码", "+4 码"),
             ("2nd & 6", NAVY, "第 2 攻，还差 6 码", "+3 码"),
             ("3rd & 3", RED, "第 3 攻，还差 3 码  ← 最关键！", "+5 码 ✓"),
             ("1st & 10", TEAL, "首攻成功 FIRST DOWN：重新拿到 4 次机会", "")]
    y = 632
    for lab, col, desc, res in steps:
        b.append(rect(60, y, 960, 64, CARD, rx=14, stroke=LINE))
        b.append(t(90, y + 43, lab, size=32, fill=col, weight=700))
        b.append(t(320, y + 41, desc, size=23, fill=INK))
        if res:
            b.append(t(996, y + 41, res, size=23, fill=TEAL, weight=700, anchor="end"))
        y += 76
    b.append(t(60, 968, [("怎么读：", {"weight": 700}), ("记分牌上的 “3rd & 3” 读作 ", {}), ("“third and three”", {"fill": BLUE, "weight": 700}),
                          ("（第 3 攻，还差 3 码）。", {})], size=21))
    b.append(t(60, 1004, [("“1st & Goal”", {"fill": BLUE, "weight": 700}), (" = 离端区已不到 10 码，这一轮的目标直接就是达阵。", {})], size=21))

    b.append(t(60, 1068, [("第 4 攻 ", {}), ("4th Down", {"fill": BLUE}), ("：三选一", {})], size=32, fill=NAVY, weight=700))
    cards = [("Punt", "弃踢", "#457b9d", ["把球远远踢给对方，", "让对方从很远的位置", "开始进攻。最常见。"]),
             ("Field Goal", "射门", ACCENT, ["离对方端区够近时，", "踢射门拿 3 分。", "离得越近越稳。"]),
             ("Go for it", "冒险进攻", RED, ["再进攻一次，成功就继续；", "失败 = Turnover on Downs，", "对方在原地接管球权。"])]
    x = 60
    for en, zh, col, lines_ in cards:
        b.append(rect(x, 1092, 300, 232, CARD, rx=18, stroke=LINE))
        b.append(rect(x, 1092, 300, 10, col, rx=4))
        b.append(t(x + 22, 1146, en, size=30, fill=col, weight=700))
        b.append(t(x + 22, 1184, zh, size=26, fill=NAVY, weight=700))
        for i, ln in enumerate(lines_):
            b.append(t(x + 22, 1228 + 30 * i, ln, size=20, fill=MUTED))
        x += 330
    b.append(rect(60, 1352, 960, 140, "#fff4d6", rx=18, stroke="#f0d58a"))
    b.append(t(88, 1392, "现场看点", size=23, fill=NAVY, weight=700))
    b.append(t(88, 1430, [("• 第 3 攻 (3rd Down) 最关键：", {"weight": 700}), ("主队防守时全场起立大喊，主队进攻时保持安静。", {})], size=21))
    b.append(t(88, 1466, [("• Drive（进攻回合）", {"weight": 700, "fill": BLUE}), ("= 从拿到球到失去球（得分、弃踢或失误）的整段进攻。", {})], size=21))
    return doc(H, "".join(b), ARROW_DEFS)


# ---------------------------------------------------------------- 3 positions
def svg3():
    H = 1692
    b = [header(3, "场上 22 人：位置", "Positions — 每队 11 人上场：进攻组 / 防守组 / 特勤组")]
    FY, FH, LOS = 205, 600, 520
    b.append(rect(60, FY, 960, FH, FIELD, rx=12))
    for i in range(10):
        if i % 2:
            b.append(rect(60, FY + 60 * i, 960, 60, FIELD2))
    b.append(line(70, LOS, 1010, LOS, "#ffffff", 3, 'stroke-dasharray="14 10"'))
    b.append(t(78, 614, "↑ 争球线 Line of Scrimmage（虚线）", size=18, fill="#ffffff", weight=700))
    b.append(f'<circle cx="86" cy="{FY + 34}" r="10" fill="{RED}"/>')
    b.append(t(104, FY + 42, "防守 Defense", size=24, fill="#ffffff", weight=700))
    b.append(f'<circle cx="86" cy="{FY + FH - 28}" r="10" fill="#3a86ff"/>')
    b.append(t(104, FY + FH - 20, "进攻 Offense", size=24, fill="#ffffff", weight=700))
    b.append(t(1008, FY + FH - 20, "进攻方向 ↑", size=22, fill="#ffffff", weight=700, anchor="end"))
    b.append(ball(540, LOS, 14, 8))
    D = [("S", 420, 285), ("S", 660, 285), ("LB", 470, 400), ("LB", 610, 400),
         ("CB", 140, 470), ("CB", 940, 470), ("CB", 805, 440),
         ("DE", 385, 485), ("DT", 492, 485), ("DT", 588, 485), ("DE", 695, 485)]
    O = [("LT", 420, 556), ("LG", 480, 556), ("C", 540, 556), ("RG", 600, 556), ("RT", 660, 556),
         ("TE", 724, 562), ("QB", 540, 655), ("RB", 612, 660),
         ("WR", 140, 556), ("WR", 940, 556), ("WR", 812, 590)]
    for lab, x, y in D:
        b.append(f'<circle cx="{x}" cy="{y}" r="27" fill="{RED}" stroke="#ffffff" stroke-width="3"/>')
        b.append(t(x, y + 6, lab, size=17, fill="#ffffff", weight=700, anchor="middle"))
    for lab, x, y in O:
        b.append(f'<circle cx="{x}" cy="{y}" r="27" fill="{BLUE}" stroke="#ffffff" stroke-width="3"/>')
        b.append(t(x, y + 6, lab, size=17, fill="#ffffff", weight=700, anchor="middle"))

    b.append(t(60, 858, "进攻组 Offense", size=28, fill=BLUE, weight=700))
    b.append(t(560, 858, "防守组 Defense", size=28, fill=RED, weight=700))
    off = [("QB", "Quarterback", "四分卫", "进攻指挥官：接球后传球，或交给跑卫"),
           ("RB", "Running Back", "跑卫", "持球往前冲，有时也接短传"),
           ("WR", "Wide Receiver", "外接手", "跑出路线去接 QB 的传球，速度最快"),
           ("TE", "Tight End", "近端锋", "站在锋线边上，能阻挡也能接球"),
           ("OL", "Offensive Line", "进攻锋线", "C 中锋 · G 护锋 · T 截锋：保护 QB、开路")]
    de = [("DL", "Defensive Line", "防守锋线", "DE 端锋 · DT 截锋：冲击 QB、堵住跑球"),
          ("LB", "Linebacker", "线卫", "防守中坚：既防跑，也防传"),
          ("CB", "Cornerback", "角卫", "贴身盯防外接手"),
          ("S", "Safety", "安全卫", "站在最后面，最后一道防线"),
          ("目标", "Goal", "", "擒杀 QB (Sack)、抄截 (INT)、逼对方掉球 (Fumble)")]
    for col, items, x0 in ((BLUE, off, 60), (RED, de, 560)):
        y = 884
        for ab, en, zh, desc in items:
            b.append(rect(x0, y, 460, 78, CARD, rx=14, stroke=LINE))
            b.append(t(x0 + 18, y + 32, [(ab + "  ", {"fill": col, "size": 25}), (en, {"fill": INK}), ("  " + zh, {"fill": NAVY})], size=22, weight=700))
            b.append(t(x0 + 18, y + 62, desc, size=19, fill=MUTED))
            y += 88
    b.append(t(60, 1372, [("特勤组 Special Teams", {}), ("：踢球时才上场", {"fill": NAVY})], size=28, fill=ORANGE, weight=700))
    chips = [("K", "Kicker", "踢球手：射门、开球"), ("P", "Punter", "弃踢手：第 4 攻踢远"),
             ("LS", "Long Snapper", "长开球员：踢球时发球"), ("KR / PR", "Returner", "回攻手：接球往回跑")]
    x = 60
    for ab, en, zh in chips:
        b.append(rect(x, 1394, 225, 128, CARD, rx=16, stroke=LINE))
        b.append(t(x + 18, 1434, ab, size=28, fill=ORANGE, weight=700))
        b.append(t(x + 18, 1468, en, size=20, fill=INK, weight=700))
        b.append(t(x + 18, 1500, zh, size=19, fill=MUTED))
        x += 245
    b.append(rect(60, 1550, 960, 100, "#fff4d6", rx=18, stroke="#f0d58a"))
    b.append(t(88, 1590, [("看球小技巧：", {"weight": 700}), ("先盯住 QB。开球后看他把球传给谁 (WR / TE)，", {})], size=22))
    b.append(t(88, 1626, "或者交给谁 (RB)，就能跟上每一次进攻。", size=22))
    return doc(H, "".join(b))


# ---------------------------------------------------------------- 4 key plays
def svg4():
    H = 1350
    b = [header(4, "关键动作 & 名场面", "Key Plays — 听懂解说，跟上全场欢呼的节奏")]
    cards = [
        (BLUE, "Snap", "开球（发球）", ["中锋把球从胯下递给四分卫，", "每一次进攻都从这一下开始。"]),
        (BLUE, "Pass · Completion", "传球 · 传成", ["传球被接住 = Completion；", "没接住落地 = Incomplete，时钟暂停。"]),
        (BLUE, "Run / Rush", "跑球", ["持球人直接往前冲。", "领先的一方爱跑球来消耗时间。"]),
        (BLUE, "Red Zone", "红区", ["距离对方端区 20 码以内，", "最容易得分的区域。"]),
        (RED, "Tackle", "擒抱", ["把持球人放倒，", "这一攻就结束了。"]),
        (RED, "Sack", "擒杀", ["四分卫还没传出球就被放倒在", "争球线后 → 全场最爆的欢呼！"]),
        (RED, "Interception (INT)", "抄截", ["防守方把传球接走，", "球权立刻交换。又叫 Pick。"]),
        (RED, "Fumble", "掉球", ["持球人被打掉球，双方抢，", "抢到 = Recovered，球归那一方。"]),
        (RED, "Turnover", "失误 / 球权转换", ["抄截和掉球被抢的统称，", "最能改变比赛走向的瞬间。"]),
        (ORANGE, "Kickoff", "开球", ["每个半场开始和每次得分后，", "把球踢给对方开始进攻。"]),
        (ORANGE, "Punt", "弃踢", ["第 4 攻打不下去时，", "把球远远踢给对方。"]),
        (ORANGE, "Touchback", "回场", ["球踢进端区、没有往回跑，", "直接从规定码线开始进攻。"]),
        (PURPLE, "Timeout", "暂停", ["每队每个半场 3 次，", "用来停表或商量战术。"]),
        (PURPLE, "Two-Minute Warning", "两分钟警告", ["第 2、4 节剩 2 分钟时自动停表，", "接着常有 Two-Minute Drill 抢时间进攻。"]),
        (PURPLE, "Challenge / Review", "挑战 / 回放", ["对判罚有疑问就看录像；", "NFL 教练扔红旗发起挑战。"]),
        (PURPLE, "Hail Mary", "绝望长传", ["比赛最后几秒的超远距离长传，", "成功了就是名场面。"]),
    ]
    for i, (col, en, zh, desc) in enumerate(cards):
        x = 60 if i % 2 == 0 else 550
        y = 205 + 132 * (i // 2)
        b.append(rect(x, y, 470, 118, CARD, rx=16, stroke=LINE))
        b.append(rect(x, y, 10, 118, col, rx=5))
        b.append(t(x + 30, y + 42, [(en, {"fill": col}), ("  " + zh, {"fill": NAVY, "size": 23})], size=25, weight=700))
        b.append(t(x + 30, y + 76, desc[0], size=20, fill=MUTED))
        b.append(t(x + 30, y + 104, desc[1], size=20, fill=MUTED))
    x = 60
    for col, lab in ((BLUE, "进攻 Offense"), (RED, "防守 Defense"), (ORANGE, "踢球 Kicking"), (PURPLE, "比赛流程 Game Flow")):
        b.append(rect(x, 1272, 22, 22, col, rx=5))
        b.append(t(x + 32, 1290, lab, size=20, fill=INK, weight=700))
        x += 240
    return doc(H, "".join(b))


# ---------------------------------------------------------------- 5 penalties
def ref_figure(cx, kind):
    o = []
    head_y = 1075
    o.append(f'<circle cx="{cx}" cy="{head_y}" r="17" fill="#ffe8d1" stroke="{INK}" stroke-width="3"/>')
    o.append(f'<rect x="{cx - 15}" y="1094" width="30" height="72" rx="6" fill="url(#stripes)" stroke="{INK}" stroke-width="3"/>')
    o.append(line(cx - 6, 1166, cx - 22, 1230, INK, 6))
    o.append(line(cx + 6, 1166, cx + 22, 1230, INK, 6))
    k = INK
    if kind == "td":
        o.append(line(cx - 13, 1100, cx - 26, 1020, k, 6))
        o.append(line(cx + 13, 1100, cx + 26, 1020, k, 6))
    elif kind == "fd":
        o.append(line(cx + 13, 1102, cx + 80, 1102, k, 6))
        o.append(f'<path d="M{cx + 84},1102 l-12,-8 v16 z" fill="{RED}"/>')
        o.append(line(cx - 13, 1100, cx - 24, 1160, k, 6))
    elif kind == "inc":
        o.append(line(cx - 13, 1104, cx - 80, 1104, k, 6))
        o.append(line(cx + 13, 1104, cx + 80, 1104, k, 6))
        o.append(f'<path d="M{cx - 66},1084 q-14,20 0,40" fill="none" stroke="{RED}" stroke-width="3"/>')
        o.append(f'<path d="M{cx + 66},1084 q14,20 0,40" fill="none" stroke="{RED}" stroke-width="3"/>')
    elif kind == "to":
        o.append(line(cx - 13, 1100, cx - 40, 1050, k, 6))
        o.append(line(cx + 13, 1100, cx + 40, 1050, k, 6))
        o.append(line(cx - 40, 1050, cx + 18, 1002, k, 6))
        o.append(line(cx + 40, 1050, cx - 18, 1002, k, 6))
    elif kind == "hold":
        o.append(f'<path d="M{cx - 13},1100 L{cx - 36},1132 L{cx - 4},1128" fill="none" stroke="{k}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>')
        o.append(f'<path d="M{cx + 13},1100 L{cx + 36},1132 L{cx + 4},1128" fill="none" stroke="{k}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>')
        o.append(f'<circle cx="{cx}" cy="1128" r="8" fill="{RED}"/>')
    return "".join(o)


def svg5():
    H = 1594
    defs = ('<pattern id="stripes" width="10" height="10" patternUnits="userSpaceOnUse">'
            '<rect width="10" height="10" fill="#ffffff"/><rect width="5" height="10" fill="#1b2333"/></pattern>')
    b = [header(5, "黄旗与裁判手势", "Penalties & Signals — 看懂犯规和裁判在比划什么")]
    b.append(rect(60, 200, 960, 190, CARD, rx=18, stroke=LINE))
    b.append(line(104, 226, 104, 360, INK, 5))
    b.append(f'<path d="M106,228 h58 l-10,18 l10,18 h-58 z" fill="#ffd60a" stroke="#c9a400" stroke-width="2"/>')
    b.append(t(190, 242, [("裁判扔出黄色小旗 ", {}), ("(Flag)", {"fill": BLUE, "weight": 700}), (" = 有人犯规。", {"weight": 700})], size=23))
    b.append(t(190, 280, "罚则通常是退后 5 / 10 / 15 码 (Yards)；", size=22, fill=MUTED))
    b.append(t(190, 318, [("有些还会直接给对方首攻 ", {}), ("(Automatic First Down)", {"fill": BLUE}), ("。", {})], size=22, fill=MUTED))
    b.append(t(190, 356, "主队被罚时，全场会嘘 (Boo)。", size=22, fill=MUTED))

    b.append(t(60, 432, "进攻方常见 Offense", size=26, fill=BLUE, weight=700))
    b.append(t(550, 432, "防守方常见 Defense", size=26, fill=RED, weight=700))
    off = [("False Start", "−5", "抢跑", "开球前，进攻锋线先动了"),
           ("Holding", "−10", "拉人", "抓住、拉住对方球员（防守方犯则 +5）"),
           ("Delay of Game", "−5", "延误比赛", "进攻计时走完还没开球"),
           ("Offensive Pass Interference", "−10", "进攻干扰", "接球手推开防守球员抢球"),
           ("Illegal Block in the Back", "−10", "背后阻挡", "从背后推人，多见于回攻")]
    de = [("Offside", "+5", "越位", "开球前，防守球员越过了争球线"),
          ("Pass Interference (DPI)", "犯规点", "防守干扰", "球到前碰撞接球手（大学最多罚 15 码）"),
          ("Roughing the Passer", "+15", "粗暴对待四分卫", "QB 传出球后还去撞他"),
          ("Personal Foul", "+15", "个人犯规", "多余的粗暴动作，如抓面罩"),
          ("Targeting", "+15", "头盔撞击（大学）", "用头盔顶人，直接罚出场")]
    for col, items, x0 in ((BLUE, off, 60), (RED, de, 550)):
        y = 452
        for en, badge, zh, desc in items:
            b.append(rect(x0, y, 470, 88, CARD, rx=14, stroke=LINE))
            b.append(t(x0 + 20, y + 35, en, size=21, fill=col, weight=700))
            b.append(rect(x0 + 470 - 100, y + 12, 86, 32, col, rx=16))
            b.append(t(x0 + 470 - 57, y + 34, badge, size=18, fill="#ffffff", weight=700, anchor="middle"))
            b.append(t(x0 + 20, y + 70, [(zh + "：", {"fill": NAVY, "weight": 700}), (desc, {})], size=18, fill=MUTED))
            y += 98
    b.append(t(60, 985, [("看懂裁判手势 ", {}), ("Referee Signals", {"fill": BLUE})], size=28, fill=NAVY, weight=700))
    b.append(rect(60, 1002, 960, 369, CARD, rx=18, stroke=LINE))
    figs = [("td", "Touchdown", "达阵 / 射门成功", "双手举过头顶"),
            ("fd", "First Down", "首攻", "手臂指向进攻方向"),
            ("inc", "Incomplete", "传球没接到", "双臂左右来回挥"),
            ("to", "Timeout", "暂停", "双手在头顶交叉"),
            ("hold", "Holding", "拉人", "一手握住另一手腕")]
    for i, (kind, en, zh, note) in enumerate(figs):
        cx = 156 + 192 * i
        b.append(f'<g transform="translate(0 24)">{ref_figure(cx, kind)}</g>')
        b.append(t(cx, 1296, en, size=23, fill=NAVY, weight=700, anchor="middle"))
        b.append(t(cx, 1326, zh, size=21, fill=INK, weight=700, anchor="middle"))
        b.append(t(cx, 1354, note, size=17, fill=MUTED, anchor="middle"))
    b.append(rect(60, 1399, 960, 152, "#fff4d6", rx=18, stroke="#f0d58a"))
    b.append(t(88, 1436, "听懂现场广播", size=23, fill=NAVY, weight=700))
    b.append(t(88, 1470, "“Holding, offense, number 72. Ten-yard penalty. Repeat third down.”", size=20, fill=BLUE, weight=700))
    b.append(t(88, 1502, "= 进攻方 72 号拉人，罚退 10 码，重打第 3 攻。", size=20))
    b.append(t(88, 1534, [("如果罚则对受害方反而不利，可以拒绝 ", {}), ("(Declined)", {"fill": BLUE, "weight": 700}), ("。", {})], size=20))
    return doc(H, "".join(b), defs)


# ---------------------------------------------------------------- 6 flow + NFL vs college
def svg6():
    H = 1620
    b = [header(6, "比赛流程 & NFL vs 大学", "Game Flow — 你看的两场（NFL 与大学碗赛）有什么不同")]
    b.append(t(60, 228, "一场比赛怎么走", size=28, fill=NAVY, weight=700))
    BY, BH = 278, 72
    segs = [(60, 250, NAVY, "Q1 第 1 节", "15 分钟"), (250, 440, "#1d4e89", "Q2 第 2 节", "15 分钟"),
            (440, 540, ACCENT, "中场", "Halftime"), (540, 730, NAVY, "Q3 第 3 节", "15 分钟"),
            (730, 920, "#1d4e89", "Q4 第 4 节", "15 分钟")]
    for x1, x2, col, a, c in segs:
        b.append(rect(x1, BY, x2 - x1, BH, col))
        fc = NAVY if col == ACCENT else "#ffffff"
        b.append(t((x1 + x2) / 2, BY + 32, a, size=21, fill=fc, weight=700, anchor="middle"))
        b.append(t((x1 + x2) / 2, BY + 58, c, size=17, fill=fc, anchor="middle"))
    b.append(rect(922, BY + 2, 96, BH - 4, "none", rx=6, stroke=MUTED, sw=2, extra='stroke-dasharray="6 5"'))
    b.append(t(970, BY + 32, "加时", size=20, fill=MUTED, weight=700, anchor="middle"))
    b.append(t(970, BY + 58, "OT", size=17, fill=MUTED, anchor="middle"))
    for x in (250, 440, 540, 730, 920):
        b.append(line(x, BY, x, BY + BH, "#ffffff", 3))
    for x in (415, 895):
        b.append(t(x, BY - 12, "▼ 2:00 两分钟警告", size=17, fill=RED, weight=700, anchor="middle"))
    b.append(t(60, BY + BH + 30, "▲ Kickoff 开球", size=18, fill=ORANGE, weight=700))
    b.append(t(540, BY + BH + 30, "▲ Kickoff 开球", size=18, fill=ORANGE, weight=700, anchor="middle"))
    b.append(t(250, BY + BH + 62, "上半场 1st Half", size=18, fill=MUTED, anchor="middle"))
    b.append(t(730, BY + BH + 62, "下半场 2nd Half", size=18, fill=MUTED, anchor="middle"))
    notes = [[("• 开赛前掷硬币 ", {}), ("(Coin Toss)", {"fill": BLUE}), (" 决定谁先开球；比赛时钟 ", {}), ("(Game Clock)", {"fill": BLUE}), (" 共 60 分钟。", {})],
             [("• 每次进攻之间有 40 秒进攻计时 ", {}), ("(Play Clock)", {"fill": BLUE}), ("，实际用时：NFL 约 3 小时，大学约 3.5 小时。", {})],
             [("• 每队每个半场 3 次暂停 ", {}), ("(Timeouts)", {"fill": BLUE}), ("；第 2、4 节剩 2:00 时自动停表。", {})]]
    for i, sp in enumerate(notes):
        b.append(t(60, 462 + 34 * i, sp, size=20))

    b.append(t(60, 590, [("NFL vs 大学 ", {}), ("College (NCAA)", {"fill": BLUE})], size=28, fill=NAVY, weight=700))
    TY = 610
    c = [60, 290, 655, 1020]
    b.append(rect(60, TY, 960, 62, NAVY, rx=12))
    b.append(t(80, TY + 40, "项目", size=21, fill="#ffffff", weight=700))
    b.append(t(c[1] + 20, TY + 40, "NFL · 12/27 Dolphins", size=21, fill="#ffffff", weight=700))
    b.append(t(c[2] + 20, TY + 40, "大学 · 12/30 Music City Bowl", size=21, fill=ACCENT, weight=700))
    rows = [
        ("接球有效", "Catch", ["两只脚都要落在界内"], ["一只脚落在界内就算"], 70),
        ("加时", "Overtime", ["10 分钟，双方都至少拿一次球", "（2025 年起常规赛也如此）", "还平就算平局 (Tie)"],
         ["双方轮流从对方 25 码线进攻", "没有比赛时钟", "一定要分出胜负"], 118),
        ("防守干扰传球", "DPI", ["在犯规地点给球", "（一次可能罚 40+ 码）"], ["最多罚 15 码"], 88),
        ("首攻后停表", "Clock", ["不停表"], ["不停表，但每半场最后", "2 分钟内会短暂停表"], 88),
        ("两分钟警告", "2-Min Warning", ["有"], ["有（2024 年起）"], 70),
        ("中场休息", "Halftime", ["约 13 分钟"], ["约 20 分钟", "★ 双方乐队 Marching Band 表演"], 88),
        ("现场气氛", "Atmosphere", ["主场球迷为主"], ["两校乐队、啦啦队、学生", "得分就奏战歌 Fight Song"], 88),
    ]
    y = TY + 62
    for i, (a1, a2, l2, l3, h) in enumerate(rows):
        b.append(rect(60, y, 960, h, CARD if i % 2 == 0 else "#faf7f0"))
        b.append(line(60, y + h, 1020, y + h, LINE, 1))
        b.append(t(80, y + h / 2 - 4, a1, size=21, fill=NAVY, weight=700))
        b.append(t(80, y + h / 2 + 22, a2, size=17, fill=MUTED))
        for col_x, lines_ in ((c[1] + 20, l2), (c[2] + 20, l3)):
            n = len(lines_)
            first = y + (h - (n - 1) * 28) / 2 + 7
            for k, ln in enumerate(lines_):
                b.append(t(col_x, first + 28 * k, ln, size=20, fill=INK))
        y += h
    for x in (c[1], c[2]):
        b.append(line(x, TY + 62, x, y, LINE, 1.5))
    b.append(rect(60, TY, 960, y - TY, "none", rx=12, stroke=LINE, sw=1.5))
    EY = y + 34
    b.append(rect(60, EY, 960, 262, "#fff4d6", rx=18, stroke="#f0d58a"))
    b.append(t(88, EY + 42, [("看台礼仪 ", {}), ("Fan Etiquette", {"fill": BLUE})], size=25, fill=NAVY, weight=700))
    bul = [[("• 开赛前唱国歌 ", {}), ("(National Anthem)", {"fill": BLUE}), ("：起立、脱帽、面向国旗", {})],
           [("• 主队防守 → 大声喊", {"weight": 700}), ("，干扰对方听口令；", {}), ("主队进攻 → 保持安静", {"weight": 700})],
           [("• 第 3 攻 ", {}), ("(3rd Down)", {"fill": BLUE}), (" 主队防守时：全场起立，最吵的时刻", {})],
           [("• 人浪 ", {}), ("(The Wave)", {"fill": BLUE}), ("：轮到你所在的区域时，站起来举手", {})],
           [("• 碗赛两队球迷通常各坐一边：穿你支持那队的颜色", {})]]
    for i, sp in enumerate(bul):
        b.append(t(88, EY + 82 + 38 * i, sp, size=20))
    return doc(EY + 262 + 60, "".join(b))


# ---------------------------------------------------------------- 7 pro chants
def team_card(y, color, title, sub, items):
    o = []
    h = 84 + 14 + 74 * len(items) + 10
    o.append(rect(60, y, 960, h, CARD, rx=20, stroke=LINE))
    o.append(rect(60, y, 960, 84, color, rx=20))
    o.append(rect(60, y + 60, 960, 24, color))
    o.append(t(88, y + 40, title, size=30, fill="#ffffff", weight=700))
    o.append(t(88, y + 72, sub, size=19, fill="#ffffff", extra='fill-opacity="0.92"'))
    yy = y + 84 + 14
    for i, (chant, desc) in enumerate(items):
        if i:
            o.append(line(88, yy - 4, 992, yy - 4, LINE, 1))
        o.append(t(88, yy + 30, chant, size=25, fill=color, weight=700))
        o.append(t(88, yy + 60, desc, size=19, fill=MUTED))
        yy += 74
    return "".join(o), h


def svg7():
    b = [header(7, "现场口号 & 传统：职业比赛", "Chants & Traditions — Celtics · Dolphins · Panthers")]
    cards = [
        ("#007a33", "Boston Celtics 凯尔特人 · NBA", "TD Garden · 12/23 vs Trail Blazers · 12/25 圣诞大战 vs Heat", [
            ("Let's go Cel-tics!（啪啪 · 啪啪啪）", "最常用的助威：喊完跟着节奏拍 5 下手"),
            ("DE-FENSE!  DE-FENSE!", "对方进攻时全场齐喊；有人会举起 “D” 和小栅栏 (fence) 的牌子"),
            ("M-V-P!  M-V-P!", "主队头号球星站上罚球线时，全场一起喊"),
            ("Gino Time", "大比分领先、胜负已定时，大屏幕放 1970 年代舞者 Gino 跳舞的录像 = “赢定了”"),
            ("Banner 18", "凯尔特人有 18 个总冠军，NBA 最多；吉祥物是小矮妖 Lucky the Leprechaun"),
            ("圣诞大战 vs Heat", "两队是东部宿敌 (Rivalry)；对方罚球时，篮筐后的球迷会挥手干扰"),
        ]),
        ("#008e97", "Miami Dolphins 海豚 · NFL", "Hard Rock Stadium · 12/27 13:00 vs Los Angeles Chargers", [
            ("Fins Up!", "双手放在头顶比成鱼的背鳍；达阵或庆祝时大家一起做"),
            ("“Miami Dolphins Number One!”", "达阵后全场播放队歌《Miami Dolphins No. 1》，跟着合唱这一句"),
            ("DE-FENSE! + 起立制造噪音", "Chargers 进攻、尤其是第 3 攻时，站起来尽量吵，让对方听不清口令"),
            ("First Down! + 手指前方", "主队拿到首攻时，很多球迷会一起朝进攻方向一指"),
            ("1972 Perfect Season", "Dolphins 是 NFL 史上唯一一支全胜夺冠的球队 (17–0)"),
            ("对手口号：Bolt Up!", "这是 Chargers（闪电队）球迷的口号，听到知道是谁就行"),
        ]),
        ("#c8102e", "Florida Panthers 美洲豹 · NHL", "Amerant Bank Arena · 12/28 19:00 vs Nashville Predators", [
            ("Let's go Pan-thers!", "最常用的助威口号"),
            ("Goal! 进球", "号角 (Goal Horn) 一响，全场起立欢呼"),
            ("Rat Toss 扔塑料老鼠", "只在主队赢球、终场后往冰上扔；比赛中别扔，会害主队被罚"),
            ("老鼠的由来", "1995 年球员 Scott Mellanby 在更衣室用球杆打死一只老鼠，当晚进了 2 球"),
            ("Hat Trick 帽子戏法", "一名球员单场进 3 球，球迷会往冰上扔帽子庆祝"),
            ("两连冠 & 对手", "Panthers 是 2024、2025 两届 Stanley Cup 冠军；对手 Predators 来自 “Smashville”"),
        ]),
    ]
    y = 205
    for col, title, sub, items in cards:
        s, h = team_card(y, col, title, sub, items)
        b.append(s)
        y += h + 26
    return doc(y + 40, "".join(b))


# ---------------------------------------------------------------- 8 college chants
def svg8():
    b = [header(8, "Music City Bowl 口号速查",
                "SEC vs Big Ten · 12/30 · Nissan Stadium — 对阵 12 月初公布，找到两队就看这张", sub_size=22)]
    b.append(rect(60, 198, 960, 172, CARD, rx=18, stroke=LINE))
    b.append(t(88, 236, "大学比赛通用传统", size=24, fill=NAVY, weight=700))
    uni = [[("• 乐队 ", {}), ("(Marching Band)", {"fill": BLUE}), (" 与战歌 ", {}), ("(Fight Song)", {"fill": BLUE}), ("：每次得分都会奏战歌，跟着拍手", {})],
           [("• 校歌 ", {}), ("(Alma Mater)", {"fill": BLUE}), ("：很多球队赛后会走到自家球迷看台前一起唱", {})],
           [("• 两队球迷通常各坐一边：穿支持那队的颜色，跟着那一边喊", {})]]
    for i, sp in enumerate(uni):
        b.append(t(88, 274 + 34 * i, sp, size=20))
    sec = [("Alabama", "阿拉巴马", "Roll Tide!", False),
           ("Arkansas", "阿肯色", "Woo Pig Sooie!（双手举起“呼猪”）", False),
           ("Auburn", "奥本", "War Eagle!", False),
           ("Florida", "佛罗里达", "Go Gators! + 鳄鱼咬手势 (Gator Chomp)", False),
           ("Georgia", "佐治亚", "Go Dawgs! Sic 'em!", False),
           ("Kentucky", "肯塔基", "C-A-T-S, Cats! Cats! Cats!", False),
           ("LSU", "路易斯安那州立", "Geaux Tigers!（Geaux 读作 Go）", False),
           ("Mississippi State", "密西西比州立", "Hail State! + 摇牛铃 (Cowbells)", False),
           ("Missouri (Mizzou)", "密苏里", "M-I-Z! — Z-O-U!（一边喊，另一边接）", True),
           ("Oklahoma", "俄克拉荷马", "Boomer! — Sooner!", False),
           ("Ole Miss", "密西西比大学", "Hotty Toddy!", False),
           ("South Carolina", "南卡罗来纳", "Go Gamecocks! + 《Sandstorm》挥毛巾", False),
           ("Tennessee", "田纳西", "《Rocky Top》全场合唱 + Go Vols!", True),
           ("Texas", "德克萨斯", "Hook 'em Horns! + 牛角手势", False),
           ("Texas A&M", "德州农工", "Gig 'em! 竖大拇指；学生全场站着", False),
           ("Vanderbilt", "范德堡", "Anchor Down!（Nashville 本地学校）", True)]
    b10 = [("Illinois", "伊利诺伊", "I-L-L! — I-N-I!", False),
           ("Indiana", "印第安纳", "Go Hoosiers!", False),
           ("Iowa", "爱荷华", "Go Hawks!", False),
           ("Maryland", "马里兰", "Fear the Turtle!", False),
           ("Michigan", "密歇根", "Go Blue! + 战歌《The Victors》", False),
           ("Michigan State", "密歇根州立", "Go Green! — Go White!（一问一答）", False),
           ("Minnesota", "明尼苏达", "Ski-U-Mah!", False),
           ("Nebraska", "内布拉斯加", "Go Big Red!", False),
           ("Northwestern", "西北大学", "Go 'Cats!", False),
           ("Ohio State", "俄亥俄州立", "O-H! — I-O!（一问一答，手比字母）", False),
           ("Oregon", "俄勒冈", "Go Ducks! + 双手比 “O”", False),
           ("Penn State", "宾州州立", "We Are! — Penn State!（一问一答）", False),
           ("Purdue", "普渡", "Boiler Up!", False),
           ("Rutgers", "罗格斯", "R-U! Rah Rah!", False),
           ("UCLA", "加州大学洛杉矶分校", "8-Clap：拍 8 下 + “U-C-L-A, Fight Fight Fight!”", False),
           ("USC", "南加州大学", "Fight On! + 比 V 字手势", False),
           ("Washington", "华盛顿大学", "Go Dawgs! / Bow Down to Washington", False),
           ("Wisconsin", "威斯康星", "On, Wisconsin! +《Jump Around》全场跳", False)]
    CY = 398
    for x0, title, fill, tfill, items, col in ((60, "SEC（东南联盟）· 16 校", "#002d72", "#ffcd00", sec, "#002d72"),
                                             (550, "Big Ten（十大联盟）· 18 校", "#0088ce", "#ffffff", b10, "#006aa3")):
        b.append(rect(x0, CY, 470, 56, fill, rx=14))
        b.append(t(x0 + 20, CY + 37, title, size=22, fill=tfill, weight=700))
        y = CY + 64
        for i, (en, zh, chant, star) in enumerate(items):
            bg = "#fff4d6" if star else (CARD if i % 2 == 0 else "#faf7f0")
            b.append(rect(x0, y, 470, 62, bg, rx=10, stroke="#f0d58a" if star else LINE))
            b.append(t(x0 + 16, y + 25, [(("★ " if star else "") + en, {"fill": INK}), ("  " + zh, {"fill": MUTED, "weight": 400})], size=19, weight=700))
            b.append(t(x0 + 16, y + 52, chant, size=18, fill=col, weight=700))
            y += 66
    FY = CY + 64 + 66 * 18 + 14
    b.append(rect(60, FY, 960, 104, "#fff4d6", rx=18, stroke="#f0d58a"))
    b.append(t(88, FY + 40, [("★ 跟你的行程特别相关：", {"weight": 700}), ("Missouri（离 STL 最近）· Vanderbilt（Nashville 本地）", {})], size=20))
    b.append(t(88, FY + 76, "· Tennessee（田纳西州的“主队”，球迷最多）。口号喊错没关系，跟着周围的人喊就对了！", size=20))
    return doc(FY + 104 + 60, "".join(b))


FILES = [("01-field-scoring.svg", svg1), ("02-downs.svg", svg2), ("03-positions.svg", svg3),
         ("04-key-plays.svg", svg4), ("05-penalties-signals.svg", svg5), ("06-game-flow-nfl-vs-college.svg", svg6),
         ("07-chants-pro-games.svg", svg7), ("08-chants-music-city-bowl.svg", svg8)]

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in FILES:
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(fn())
        print("wrote", name)
