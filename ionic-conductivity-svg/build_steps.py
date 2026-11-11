"""Generate the per-step and coin-cell illustrations for ionic-conductivity-ref620.html.

Rewrites the <ol class="steps"> block between the STEPS markers. Each step gets
its own inline SVG drawn with the page's CSS classes, so light/dark themes work.
Run: python3 ionic-conductivity-svg/build_steps.py
Then: node ionic-conductivity-svg/export_svgs.js  (writes standalone .svg files)
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / 'ionic-conductivity-ref620.html'
W, H = 400, 220


def f(v):
    return f'{v:g}' if isinstance(v, (int, float)) else str(v)


def T(x, y, s, size=12, anchor=None, weight=None, cls=None):
    a = f'<text x="{f(x)}" y="{f(y)}" font-size="{f(size)}"'
    if anchor:
        a += f' text-anchor="{anchor}"'
    if weight:
        a += f' font-weight="{weight}"'
    if cls:
        a += f' class="{cls}"'
    return a + f'>{s}</text>'


def sb(main, sub, size, rest=''):
    """main + subscript; `rest` continues on the baseline."""
    d = round(size * .28, 1)
    o = f'{main}<tspan dy="{d}" font-size="{round(size * .72, 1)}">{sub}</tspan>'
    if rest:
        o += f'<tspan dy="-{d}">{rest}</tspan>'
    return o


def R(x, y, w, h, cls, rx=0, extra=''):
    r = f' rx="{f(rx)}"' if rx else ''
    return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}"{r} class="{cls}"{extra}/>'


def C(x, y, r, cls):
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" class="{cls}"/>'


def P(d, cls):
    return f'<path d="{d}" class="{cls}"/>'


def wire(d, kind):
    return P(d, 'w-out') + P(d, f'w {kind}')


def ok(x, y, r=8):
    return (C(x, y, r, 'ic-ok') +
            P(f'M{x - r * .45:.1f} {y + r * .02:.1f} l{r * .3:.1f} {r * .32:.1f} l{r * .58:.1f} -{r * .62:.1f}', 'ic-mark'))


def bad(x, y, r=8):
    k = r * .38
    return (C(x, y, r, 'ic-bad') +
            P(f'M{x - k:.1f} {y - k:.1f} L{x + k:.1f} {y + k:.1f} M{x + k:.1f} {y - k:.1f} L{x - k:.1f} {y + k:.1f}', 'ic-mark'))


def opt(x, y, r=8):
    return C(x, y, r, 'ic-opt')


def arrow_down(x, y1, y2):
    return (f'<line x1="{x}" y1="{y1}" x2="{x}" y2="{y2 - 6}" class="dim"/>' +
            P(f'M{x} {y2} L{x - 5} {y2 - 8} L{x + 5} {y2 - 8} Z', 'arr'))


def dim_h(x1, x2, y):
    return (f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" class="dim"/>' +
            P(f'M{x1} {y} L{x1 + 7} {y - 4} L{x1 + 7} {y + 4} Z M{x2} {y} L{x2 - 7} {y - 4} L{x2 - 7} {y + 4} Z', 'arr'))


def panel(px, py, cell_on=False):
    w, h = 124, 188
    o = [R(px, py, w, h, 'panel', 8),
         T(px + w / 2, py + 24, 'Reference 620', 12, 'middle', 700, 't-panel'),
         T(px + w / 2, py + 37, 'Potentiostat', 8.5, 'middle', None, 't-panel2'),
         T(px + w - 22, py + 68, 'Cell On', 9.5, 'end', None, 't-panel')]
    if cell_on:
        o += [C(px + w - 12, py + 65, 9, 'glow-y'), C(px + w - 12, py + 65, 4.5, 'led-y')]
    else:
        o += [C(px + w - 12, py + 65, 4.5, 'led-off')]
    o += [T(px + w - 22, py + 86, 'Overload', 9.5, 'end', None, 't-panel'),
          C(px + w - 12, py + 83, 4.5, 'led-off'),
          R(px + w - 18, py + 100, 12, 46, 'conn', 3),
          T(px + w - 24, py + 127, 'Cell Cable', 9.5, 'end', None, 't-panel'),
          C(px + 16, py + 156, 8.5, 'glow-b'), C(px + 16, py + 156, 5, 'led-b'),
          T(px + 28, py + 159.5, 'Power', 9.5, None, None, 't-panel'),
          C(px + 16, py + 174, 8.5, 'glow-g'), C(px + 16, py + 174, 5, 'led-g'),
          T(px + 28, py + 177.5, 'USB', 9.5, None, None, 't-panel')]
    return ''.join(o)


def cell_side(x, y, w=150, t=18, tab=28, labels=True):
    """Side view: upper plate with tab to the left, lower plate with tab to the right."""
    o = [R(x - tab + 2, y + 4, tab, 10, 'steel', 2),
         R(x, y, w, t, 'steel', 3),
         R(x - 4, y + t, w + 8, 6, 'ptfe'),
         R(x + w - 2, y + t + 10, tab, 10, 'steel', 2),
         R(x, y + t + 6, w, t, 'steel', 3)]
    if labels:
        o += [T(x + w / 2, y + t / 2 + 4.5, '上板', 11, 'middle', 600),
              T(x + w / 2, y + t + 6 + t / 2 + 4.5, '下板', 11, 'middle', 600)]
    return ''.join(o)


def svg(label, body):
    return (f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="{label}">' + body + '</svg>')


# ---------------------------------------------------------------- step 1
def s1():
    rows = [
        (ok, '自检通过', 'Power 灯亮 → 闪 3 次 → 常亮蓝色'),
        (ok, 'Calibrate Instrument', '200 Ω 校准池放在屏蔽盒里'),
        (opt, 'Low I DC 校准', '样品阻抗高时先做'),
        (opt, '电缆电容校准', '20 kΩ 校准池；相位有毛刺时做'),
    ]
    o = [panel(12, 16),
         T(160, 28, '菜单：Experiment › Utilities', 10.5, None, None, 't-mut')]
    for i, (ic, a, b) in enumerate(rows):
        y = 58 + i * 42
        o += [ic(172, y), T(188, y + 4.5, a, 12.5, None, 700), T(188, y + 21, b, 10.5, None, None, 't-mut')]
    return svg('仪器就绪：Power 蓝灯常亮、USB 绿灯常亮；自检通过、Calibrate Instrument 已完成；高阻样品另做 Low I DC 校准和电缆电容校准。', ''.join(o))


# ---------------------------------------------------------------- step 2
def s2():
    o = [P('M59 104 V130 Q59 156 85 156 H165 Q191 156 191 130 V104', 'frame-out'),
         P('M59 104 V130 Q59 156 85 156 H165 Q191 156 191 130 V104', 'frame'),
         R(50, 78, 18, 26, 'steel', 2),
         R(68, 70, 7, 42, 'sample'),
         R(75, 84, 95, 14, 'steel'),
         R(168, 78, 46, 26, 'steel'),
         f'<line x1="170" y1="91" x2="212" y2="91" class="tick"/>']
    o += [f'<line x1="{x}" y1="86" x2="{x}" y2="91" class="tick"/>' for x in range(173, 212, 5)]
    o += [R(212, 72, 36, 38, 'steel', 4)]
    o += [f'<line x1="212" y1="{y}" x2="220" y2="{y}" class="tick"/>' for y in range(78, 107, 5)]
    o += [R(248, 80, 14, 22, 'steel', 3),
          f'<line x1="71.5" y1="68" x2="71.5" y2="44" class="lead"/>',
          T(60, 38, '样品（侧视）', 11.5, None, 700),
          T(125, 176, '千分尺', 11, 'middle', None, 't-mut'),
          T(16, 204, '读数 0.100 mm → L = 100 µm = 0.0100 cm', 12, None, 700)]
    # top view of the disc
    o += [C(330, 84, 44, 'sample'), dim_h(286, 374, 84), T(330, 78, 'd', 13, 'middle', 700)]
    for x, y in [(312, 62), (350, 64), (330, 108), (306, 100), (354, 104)]:
        o.append(C(x, y, 2.6, 'pt'))
    o += [T(330, 26, '样品（俯视）', 11.5, 'middle', 700),
          T(330, 150, 'A = π d² / 4', 13, 'middle', 700),
          T(330, 168, 'd = 10 mm → A = 0.785 cm²', 10.5, 'middle', None, 't-mut'),
          T(330, 186, '黑点：测厚位置，取平均', 10.5, 'middle', None, 't-mut')]
    return svg('用千分尺量样品厚度 L，多点测量取平均；俯视图中量直径 d，A 等于 π d 平方除以 4。', ''.join(o))


# ---------------------------------------------------------------- step 3
def s3():
    o = [R(41, 24, 8, 158, 'nylon', 2), R(191, 24, 8, 158, 'nylon', 2),
         R(35, 18, 20, 7, 'nylon', 2), R(185, 18, 20, 7, 'nylon', 2),
         # plate 1 (top) with tab left
         R(8, 40, 26, 10, 'steel', 2), R(30, 34, 180, 20, 'steel', 3),
         T(120, 48.5, '③ 上板', 11.5, 'middle', 700),
         arrow_down(120, 60, 78),
         # spacer + sample
         R(30, 84, 60, 12, 'ptfe'), R(150, 84, 60, 12, 'ptfe'), R(90, 84, 60, 12, 'sample'),
         T(120, 112, '② 样品放进垫片孔', 10.5, 'middle', 600),
         arrow_down(120, 118, 134),
         # plate 2 (bottom) with tab right
         R(30, 140, 180, 20, 'steel', 3), R(206, 145, 26, 10, 'steel', 2),
         T(120, 154.5, '① 下板', 11.5, 'middle', 700),
         R(185, 162, 20, 9, 'nut', 2), R(35, 162, 20, 9, 'nut', 2),
         T(120, 204, '从下往上叠：① → ② → ③', 11.5, 'middle', 700)]
    # top view: alternate tightening
    o += [T(324, 24, '俯视：交替拧紧', 11.5, 'middle', 700),
          R(264, 38, 120, 96, 'steel', 4),
          C(324, 86, 25, 'hidden-edge'),
          C(280, 54, 9, 'nylon'), C(368, 118, 9, 'nylon'),
          T(280, 58, '1', 10.5, 'middle', 700, 't-onlight'), T(368, 122, '2', 10.5, 'middle', 700, 't-onlight'),
          P('M266.5 47 A15 15 0 0 1 289 41', 'turn'), P('M289 41 l-1 -7 l5 6 Z', 'arr'),
          P('M381.5 111 A15 15 0 0 1 359 131', 'turn'), P('M359 131 l1 7 l-5 -6 Z', 'arr'),
          T(324, 156, '1 → 2 → 1 → 2', 12, 'middle', 700),
          T(324, 174, '每次少量，均匀压紧', 10.5, 'middle', None, 't-mut'),
          T(324, 202, '不要拧过紧', 11.5, 'middle', 700, 't-warn')]
    return svg('装池：从下往上依次放下板、带样品的垫片、上板；俯视图中两根尼龙螺栓按 1、2、1、2 交替少量拧紧，不要拧过紧。', ''.join(o))


# ---------------------------------------------------------------- step 4
def s4():
    o = [T(16, 24, '两块板之间不能短路', 12, None, 700),
         T(16, 41, '表笔分别接两个接线片', 10.5, None, None, 't-mut'),
         cell_side(44, 144, 150, 16, 28)]
    # meter
    o += [R(270, 20, 112, 166, 'panel', 12),
          R(282, 34, 88, 40, 'lcd', 4),
          T(326, 63, 'OL', 22, 'middle', 700, 'lcd-ink tm'),
          T(364, 70, 'MΩ', 8.5, 'end', None, 'lcd-ink'),
          C(326, 116, 22, 'knob'),
          P('M326 116 L311 101', 'knob-ptr'),
          T(300, 97, 'Ω', 11, 'end', 700, 't-panel'),
          C(304, 162, 6, 'jack-r'), C(350, 162, 6, 'jack-k'),
          T(304, 151, 'VΩ', 8.5, 'middle', None, 't-panel'), T(350, 151, 'COM', 8.5, 'middle', None, 't-panel')]
    o += [wire('M304 164 C 304 204, 206 214, 206 190', 'ce'),
          wire('M350 164 C 350 234, 30 234, 30 190 V168', 'gnd'),
          R(200, 180, 12, 9, 'tip', 1), R(24, 158, 12, 9, 'tip', 1)]
    o += [ok(26, 68), T(40, 72.5, 'OL 或 MΩ 并缓慢上升', 11.5, None, 700),
          T(40, 88, '正常：直流下离子过不去', 10, None, None, 't-mut'),
          bad(26, 108), T(40, 112.5, '接近 0 Ω', 11.5, None, 700, 't-bad'),
          T(40, 128, '两板短路：拆开重装', 10, None, None, 't-mut')]
    return svg('用万用表电阻挡量两个接线片：显示 OL 或兆欧级并缓慢上升为正常；接近 0 欧姆说明两板短路，要拆开重装。', ''.join(o))


# ---------------------------------------------------------------- step 5
def s5():
    o = [T(14, 16, '恒温箱或加热台', 11, None, 700),
         R(12, 24, 190, 150, 'oven', 8),
         R(22, 36, 128, 128, 'chamber', 4),
         R(158, 48, 38, 20, 'panel', 3),
         T(177, 62, '60 °C', 10, 'middle', 600, 't-panel tm'),
         C(177, 96, 9, 'knob-s'), C(177, 124, 9, 'knob-s'),
         cell_side(50, 94, 84, 10, 14, labels=False)]
    # leads out of the oven bottom
    o += [P('M38 101 Q28 101 28 120 V146 Q28 154 38 154 H86', 'lead-thin'),
          P('M146 115 Q154 115 154 128 V146 Q154 154 144 154 H86', 'lead-thin'),
          P('M86 154 V198', 'cable'),
          T(94, 200, '电缆接前面板', 10, None, None, 't-mut')]
    # thermocouple to the rear panel
    o += [wire('M112 93 V34 Q112 10 136 10 H262 Q276 10 276 24 V40', 'tc'),
          R(232, 30, 160, 42, 'panel', 6),
          R(265, 40, 22, 14, 'tc-jack', 2),
          T(296, 52, 'T/C Type K', 10, None, 600, 't-panel'),
          T(388, 24, '仪器后面板', 10, 'end', None, 't-mut'),
          T(120, 52, '热电偶', 10, None, None, 't-mut')]
    # temperature vs time
    o += [P('M250 92 V190 H390', 'axis'),
          T(244, 100, 'T', 11, 'end', 600, 't-mut'), T(390, 205, '时间', 10, 'end', None, 't-mut'),
          f'<line x1="250" y1="116" x2="390" y2="116" class="setline"/>',
          T(254, 110, '设定温度', 9.5, None, None, 't-mut'),
          P('M250 182 C 282 182, 292 117, 330 116 H388', 'curve'),
          f'<line x1="362" y1="190" x2="362" y2="104" class="mark-line"/>',
          T(362, 100, '开始测量', 10, 'middle', 700),
          T(334, 136, '稳定后再等', 9.5, 'middle', None, 't-mut')]
    return svg('控温：电解池放进恒温箱，自备的 K 型热电偶接到 Reference 620 后面板的 T/C Type K 插孔；温度曲线到达设定值并稳定一段时间后再开始测量。', ''.join(o))


# ---------------------------------------------------------------- step 6
def s6():
    o = [R(10, 10, 380, 200, 'card', 8),
         P('M10 18 Q10 10 18 10 H382 Q390 10 390 18 V32 H10 Z', 'titlebar'),
         T(22, 25.5, 'Gamry Framework', 10.5, None, 700),
         T(22, 47, 'File', 10.5), R(50, 36, 72, 16, 'menu-hi', 3), T(86, 47.5, 'Experiment', 10.5, 'middle', 700, 't-acc'),
         T(132, 47, '…', 10.5, None, None, 't-mut'),
         R(50, 54, 164, 66, 'menu', 4),
         T(60, 70, 'Physical Electrochemistry', 10), T(206, 70, '›', 10, 'end'),
         R(52, 77, 160, 18, 'menu-hi', 2),
         T(60, 90, 'Electrochemical Impedance', 10, None, 700, 't-acc'), T(206, 90, '›', 10, 'end', 700, 't-acc'),
         T(60, 110, 'Utilities', 10), T(206, 110, '›', 10, 'end'),
         R(214, 77, 130, 44, 'menu', 4),
         R(216, 80, 126, 18, 'menu-hi', 2),
         T(224, 93, 'Potentiostatic EIS', 10, None, 700, 't-acc'),
         T(224, 114, 'Galvanostatic EIS', 10, None, None, 't-mut'),
         R(22, 132, 356, 68, 'sunk-r', 6)]
    fields = [('Initial Freq.', '1 MHz'), ('Final Freq.', '0.1 Hz'), ('Points/decade', '10'),
              ('AC Voltage', '10 mV rms'), ('DC Voltage', sb('0 V vs E', 'oc', 10.5)), ('Area', '1 cm²')]
    for i, (k, v) in enumerate(fields):
        cx = 32 if i < 3 else 206
        y = 152 + (i % 3) * 18
        o += [T(cx, y, k, 10, None, None, 't-mut tm'), T(cx + 92, y, v, 10.5, None, 700)]
    return svg('软件界面示意：Gamry Framework 菜单 Experiment、Electrochemical Impedance、Potentiostatic EIS；参数框填起始频率 1 MHz、结束频率 0.1 Hz、每十倍频程 10 点、交流 10 mV rms、直流 0 V vs Eoc、面积 1 cm²。', ''.join(o))


# ---------------------------------------------------------------- step 7
def s7():
    o = [panel(12, 16, cell_on=True),
         R(150, 22, 92, 24, 'seg', 4), T(196, 38.5, sb('① 测 E', 'oc', 10.5), 10.5, 'middle', 600),
         R(244, 22, 146, 24, 'seg-hi', 4), T(317, 38.5, '② 扫频：高频 → 低频', 10.5, 'middle', 700, 't-acc'),
         T(196, 62, 'Cell On 不亮', 9.5, 'middle', None, 't-mut'),
         T(317, 62, 'Cell On 亮黄灯', 9.5, 'middle', None, 't-mut')]
    # live Nyquist being drawn
    o += [P('M156 82 V190 H276', 'axis'),
          T(160, 88, '−Z″', 9.5, None, None, 't-mut'), T(276, 204, 'Z′', 9.5, 'end', None, 't-mut'),
          P('M166 190 A38 38 0 0 1 242 190 L268 104', 'curve-todo'),
          P('M166 190 A38 38 0 0 1 228 164', 'curve')]
    import math
    for a in range(180, 40, -18):
        x = 204 + 38 * math.cos(math.radians(a))
        y = 190 - 38 * math.sin(math.radians(a))
        o.append(C(round(x, 1), round(y, 1), 2.8, 'pt-acc'))
    o += [T(214, 136, '数据点逐个出现', 9.5, 'middle', None, 't-mut')]
    # don't touch
    o += [P('M322 130 C 332 112, 346 148, 362 124', 'w-out'), P('M322 130 C 332 112, 346 148, 362 124', 'w ce'),
          C(342, 128, 25, 'no'), P('M324 110 L360 146', 'no-bar'),
          T(342, 176, '测量中不要碰导线', 10.5, 'middle', 700),
          T(342, 194, 'Overload 常亮：查夹子', 9.5, 'middle', None, 't-mut')]
    return svg('运行中：先测开路电位，Cell On 不亮；开始扫频后 Cell On 亮黄灯，Nyquist 数据点从高频到低频逐个出现；测量中不要碰导线，Overload 常亮时检查夹子。', ''.join(o))


# ---------------------------------------------------------------- step 8
def s8():
    import math
    o = [P('M30 22 V160 H218', 'axis'),
         T(34, 20, '−Z″', 9.5, None, None, 't-mut'), T(218, 174, 'Z′', 9.5, 'end', None, 't-mut'),
         P('M42 160 A48 48 0 0 1 138 160 L176 42', 'curve')]
    for a in range(170, 10, -20):
        o.append(C(round(90 + 48 * math.cos(math.radians(a)), 1), round(160 - 48 * math.sin(math.radians(a)), 1), 2.6, 'pt-acc'))
    for k in (0.25, 0.5, 0.75):
        o.append(C(round(138 + 38 * k, 1), round(160 - 118 * k, 1), 2.6, 'pt-acc'))
    o += [C(138, 160, 5.5, 'mark'),
          f'<line x1="42" y1="168" x2="42" y2="190" class="lead"/>', f'<line x1="138" y1="166" x2="138" y2="190" class="lead"/>',
          dim_h(42, 138, 184), T(90, 178, sb('R', 'b', 12), 12, 'middle', 700),
          T(36, 202, sb('R', 's', 9.5), 9.5, 'middle', None, 't-mut'),
          T(150, 152, '读这个交点', 9.5, None, 600)]
    # equivalent circuit
    y = 66
    o += [T(314, 24, '等效电路拟合', 11.5, 'middle', 700),
          P(f'M232 {y} H244 M270 {y} H284 V46 H298 M324 46 H338 V{y} H352 M284 {y} V88 H304 M318 88 H338 V{y} M364 {y} H374', 'circ'),
          R(244, y - 6, 26, 12, 'res', 1), R(298, 40, 26, 12, 'res', 1),
          P('M306 80 L302 88 L306 96 M316 80 L312 88 L316 96', 'circ'),
          P(f'M356 {y - 8} L352 {y} L356 {y + 8} M366 {y - 8} L362 {y} L366 {y + 8}', 'circ'),
          P(f'M352 {y} H356 M362 {y} H364', 'circ'),
          T(257, y - 11, sb('R', 's', 10), 10, 'middle', 600), T(311, 35, sb('R', 'b', 10), 10, 'middle', 700),
          T(310, 112, 'CPE', 9.5, 'middle', None, 't-mut'),
          T(360, 88, 'CPE', 9.5, 'middle', None, 't-mut'),
          T(314, 140, 'Echem Analyst 2', 11, 'middle', 700),
          T(314, 158, sb('拟合后取 R', 'b', 10.5), 10.5, 'middle'),
          T(314, 178, '快速读法：半圆右端', 9.5, 'middle', None, 't-mut'),
          T(314, 193, '与实轴的交点', 9.5, 'middle', None, 't-mut')]
    return svg('读谱：Nyquist 图中半圆右端与实轴的交点给出 R_s 加 R_b；更准的做法是在 Echem Analyst 2 中用 R_s 串联 R_b 与 CPE 并联、再串联 CPE 的等效电路拟合，取 R_b。', ''.join(o))


# ---------------------------------------------------------------- step 9
def s9():
    o = [T(200, 32, sb('σ = L / (R', 'b', 16, ' · A)'), 16, 'middle', 700),
         T(200, 56, '= 0.0100 cm ÷ (1273 Ω × 0.785 cm²)', 11.5, 'middle', None, 'tm'),
         T(200, 80, '= 1.00 × 10⁻⁵ S/cm', 14, 'middle', 700, 't-acc')]
    vals = ['1.00', '0.94', '1.07']
    for i, v in enumerate(vals):
        x = 52 + i * 78
        o += [R(x - 26, 112, 52, 7, 'steel', 1.5), R(x - 26, 119, 52, 3, 'ptfe'), R(x - 26, 122, 52, 7, 'steel', 1.5),
              T(x, 146, f'池 {i + 1}', 10.5, 'middle', 600),
              T(x, 164, v, 12, 'middle', 700)]
    o += [T(130, 182, '× 10⁻⁵ S/cm', 10, 'middle', None, 't-mut'),
          R(268, 106, 120, 84, 'sunk-r', 8),
          T(328, 128, '平均 ± 标准差', 10, 'middle', None, 't-mut'),
          T(328, 152, '1.00 ± 0.07', 15, 'middle', 700),
          T(328, 172, '× 10⁻⁵ S/cm', 10, 'middle', None, 't-mut'),
          R(14, 196, 64, 18, 'tagbox', 9), T(46, 209, '示例数值', 10, 'middle', 700, 't-warn')]
    return svg('计算：σ 等于 L 除以 R_b 乘 A，示例 0.0100 cm 除以 1273 欧姆乘 0.785 平方厘米，等于 1.00 乘 10 的负 5 次方 S/cm；装三个池重复测量，报告平均值和标准差。', ''.join(o))


STEPS = [
    (s1, '''<p>确认仪器已上电自检，并完成 Calibrate Instrument（菜单 <code>Experiment › Utilities</code>，见安装 SOP）。<span class="src">手册 Ch 5</span></p>
          <ul><li>样品阻抗很高（膜厚、电导率低）时，先做 Low I DC 校准；手册指出高阻样品的 EIS 对它敏感。<span class="src">手册 Ch 5</span></li>
          <li>高阻样品的谱图出现相位毛刺时，做电缆电容校准（20 kΩ 校准池）。<span class="src">手册 Ch 5</span></li></ul>'''),
    (s2, '''<p>量样品厚度 L：用千分尺在几个位置测量，取平均。再确定接触面积 A（第 03 节）。<span class="src gen">通用方法</span></p>
          <ul><li>样品是软的聚合物膜时，千分尺不要拧太紧，用棘轮轻轻接触即可，否则会把膜压薄。</li>
          <li>用开孔垫片时，L 取垫片厚度，A 取孔的面积。</li></ul>'''),
    (s3, '''<p>装池：从下往上叠放下板、带样品的垫片、上板，再把两根尼龙螺栓交替、分几次拧紧。<span class="src gen">通用方法</span></p>
          <ul><li>不要拧得过紧：尼龙螺纹容易滑丝，样品也会被压薄、甚至被压穿。</li>
          <li>怕水的样品（例如含锂盐）在手套箱里装池，并保证测量时密封。</li></ul>'''),
    (s4, '''<p>用万用表电阻挡量两个接线片，确认两块板没有短路，然后按第 02 节接线。<span class="src gen">通用方法</span></p>
          <ul><li>正常读数是 OL 或兆欧级、并缓慢上升：离子在直流下到不锈钢表面就被挡住，万用表测到的主要是这个充电过程。</li>
          <li>读数接近 0 Ω：两块板直接接触，拆开检查样品和垫片后重装。</li></ul>'''),
    (s5, '''<p>控温：把电解池放进恒温箱或加热台，温度到达设定值并稳定后再等一段时间（常用 30–60 min）再测。<span class="src gen">通用方法</span></p>
          <ul><li>需要记录温度时，可以用 Reference 620 后面板的 K 型热电偶插孔。仪器不附带热电偶，要自备黄色迷你插头的 K 型热电偶。<span class="src">手册 Ch 7</span></li>
          <li>手册给出的热电偶测温精度约 ±4 °C（校准后），所以算活化能用的温度最好以恒温箱或独立温度计为准。<span class="src">手册 Ch 7</span></li></ul>'''),
    (s6, '''<p>在 Gamry Framework 中打开恒电位 EIS（Potentiostatic EIS），按第 05 节填参数。</p>
          <ul><li>菜单路径按常见的 Framework 版本画出，不同版本的名称可能略有差异。</li>
          <li>先把 Area 填 1 cm²，读出的就是未归一化的 R<sub>b</sub>，计算 σ 时再用实际面积。</li></ul>'''),
    (s7, '''<p>运行。软件先测开路电位，这时 Cell On 黄灯不亮；开始施加信号后黄灯亮起。<span class="src">手册 Ch 7</span></p>
          <ul><li>黄灯亮时不要碰导线，否则数据质量会受影响；要改接线，等这次实验结束、黄灯熄灭后再改。<span class="src">手册 Ch 7</span></li>
          <li>对称不锈钢池的开路电位接近 0 V。Overload 红灯持续常亮时，检查夹子是否松脱。<span class="src">手册 Ch 7</span></li></ul>'''),
    (s8, '''<p>在 Echem Analyst 2 中打开 .DTA 文件，看 Nyquist 图，读出 R<sub>b</sub>，或用等效电路拟合（第 06 节）。</p>
          <ul><li>快速读法：取半圆右端（尖峰起点）与实轴的交点，减去 R<sub>s</sub>。</li>
          <li>更准的做法：用 R<sub>s</sub> + (R<sub>b</sub> ∥ CPE) + CPE 拟合，取拟合出的 R<sub>b</sub>。</li></ul>'''),
    (s9, '''<p>用第 07 节计算 σ。同一样品最好装 2–3 个池重复测量，报告平均值和标准差。<span class="src gen">通用方法</span></p>
          <ul><li>图中的数值是示例，不是实测数据。</li></ul>'''),
]


def build():
    items = []
    for fn, text in STEPS:
        items.append(f'''        <li><div class="step"><div class="step-text">{text}</div>
          <figure class="stepfig">{fn()}</figure></div></li>''')
    block = '<!--STEPS-->\n      <ol class="steps">\n' + '\n'.join(items) + '\n      </ol>\n      <!--/STEPS-->'
    s = PAGE.read_text(encoding='utf-8')
    if '<!--STEPS-->' in s:
        s = re.sub(r'<!--STEPS-->.*?<!--/STEPS-->', lambda m: block, s, flags=re.S)
    else:
        s = re.sub(r'<ol class="steps">.*?</ol>', lambda m: block, s, count=1, flags=re.S)
    PAGE.write_text(s, encoding='utf-8')
    print('steps written:', len(items))


# ================================================================ coin-cell section figures
def svgw(w, h, label, body):
    return f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{label}">' + body + '</svg>'


def coin_exploded():
    cx = 200
    o = [R(cx - 98, 26, 196, 22, 'steel', 5),
         R(cx - 104, 60, 16, 12, 'gasket', 2), R(cx + 88, 60, 16, 12, 'gasket', 2),
         P(f'M{cx - 88} 61 H{cx + 88} M{cx - 88} 71 H{cx + 88}', 'gasket-line')]
    z = f'M{cx - 80} 91'
    for i in range(16):
        z += f' l10 {-7 if i % 2 == 0 else 7}' if i == 0 else f' l10 {14 if i % 2 else -14}'
    o += [P(z, 'spring'),
          R(cx - 88, 110, 176, 8, 'steel', 1.5),
          R(cx - 104.5, 129, 209, 6, 'sample'),
          R(cx - 88, 146, 176, 8, 'steel', 1.5),
          R(cx - 110, 166, 220, 40, 'steel', 6),
          R(cx - 103, 166, 206, 32, 'cavity', 3)]
    labels = [(37, cx + 98, '负极盖 (−)'), (66, cx + 104, '密封圈：绝缘，隔开正负极'),
              (91, cx + 80, '弹片：提供压力'), (114, cx + 88, '不锈钢垫片：上电极'),
              (132, cx + 104.5, '电解质膜或浸液隔膜（厚度 L）'), (150, cx + 88, '不锈钢垫片：下电极'),
              (186, cx + 110, '正极壳 (+)')]
    for y, x1, t in labels:
        o += [f'<line x1="{x1 + 4}" y1="{y}" x2="322" y2="{y}" class="lead"/>', T(328, y + 4.5, t, 12, None, 600)]
    o += [f'<line x1="40" y1="206" x2="40" y2="40" class="dim"/>', P('M40 32 L35 42 L45 42 Z', 'arr'),
          T(40, 226, '从下往上组装', 11, 'middle', 600),
          f'<line x1="{cx - 88}" y1="156" x2="{cx - 88}" y2="232" class="ext"/>',
          f'<line x1="{cx + 88}" y1="156" x2="{cx + 88}" y2="232" class="ext"/>',
          dim_h(cx - 88, cx + 88, 226),
          T(cx, 248, 'd（垫片直径）→ A = π d² / 4', 12.5, 'middle', 700),
          T(cx, 266, '膜比垫片大时，A 按垫片算', 10.5, 'middle', None, 't-mut')]
    return svgw(540, 276, 'CR2032 纽扣电池分层图，从下往上：正极壳、不锈钢垫片（下电极）、电解质膜或浸液隔膜（厚度 L）、不锈钢垫片（上电极）、弹片、密封圈、负极盖；面积 A 按垫片直径 d 计算。', ''.join(o))


def coin_wiring():
    o = [P('M16 150 H96', 'cable-thick'), T(16, 132, '电解池电缆', 11, None, None, 't-mut'),
         R(150, 128, 180, 36, 'steel', 6), R(160, 118, 160, 12, 'gasket', 2),
         R(170, 110, 140, 18, 'steel', 4),
         R(150, 118, 16, 12, 'steel', 3), R(314, 118, 16, 12, 'steel', 3),
         T(240, 123.5, '负极盖 (−)', 11, 'middle', 700), T(240, 151, '正极壳 (+)', 11, 'middle', 700),
         R(198, 92, 12, 18, 'steel', 2), R(262, 92, 18, 18, 'steel', 2),
         R(198, 164, 12, 18, 'steel', 2), R(262, 164, 18, 18, 'steel', 2)]
    o += [wire('M96 134 C 124 134, 136 40, 176 40 H263 Q275 40 275 52 V92', 're'),
          wire('M96 138 C 128 138, 142 52, 182 52 H256 Q268 52 268 64 V92', 'cs'),
          wire('M96 142 C 132 142, 150 66, 188 66 H194 Q204 66 204 76 V92', 'ce'),
          wire('M96 156 C 130 156, 150 212, 190 212 H194 Q204 212 204 202 V182', 'we'),
          wire('M96 162 C 126 162, 140 228, 180 228 H259 Q271 228 271 216 V182', 'ws'),
          wire('M96 168 C 112 192, 104 252, 132 262', 'gnd'),
          '<circle cx="138" cy="263" r="5" style="fill:var(--surface);stroke:var(--wire-outline);stroke-width:1.5"/>',
          T(150, 267, '黑（浮地）：悬空', 10.5, None, None, 't-mut'),
          T(192, 104, '电流', 9.5, 'end', None, 't-mut'), T(286, 104, '感应', 9.5, None, None, 't-mut'),
          T(192, 178, '电流', 9.5, 'end', None, 't-mut'), T(286, 178, '感应', 9.5, None, None, 't-mut'),
          T(300, 46, '白 + 红 + 橙', 12, None, 700), T(300, 62, '→ 负极盖 (−)', 12, None, 700),
          T(300, 214, '绿 + 蓝', 12, None, 700), T(300, 230, '→ 正极壳 (+)', 12, None, 700)]

    def small_cell(y):
        return (R(470, y + 10, 110, 22, 'steel', 4) + R(476, y + 4, 98, 8, 'gasket', 2) +
                R(482, y, 86, 12, 'steel', 3) + R(470, y + 4, 10, 8, 'steel', 2) + R(570, y + 4, 10, 8, 'steel', 2))
    o += [R(420, 14, 212, 126, 'sunk-r', 8), ok(437, 34), T(451, 38.5, '夹在两个平面的中心', 11.5, None, 700),
          small_cell(70), P('M517 44 H533 L531 70 H519 Z', 'clip'), P('M519 102 H531 L533 128 H517 Z', 'clip'),
          T(622, 126, '或用夹具', 10, 'end', None, 't-mut')]
    o += [R(420, 150, 212, 126, 'sunk-r', 8), bad(437, 170), T(451, 174.5, '夹子咬住边缘：短路', 11.5, None, 700, 't-bad'),
          small_cell(206),
          P('M432 194 L488 203 L488 208 L446 220 L446 224 L488 236 L488 241 L432 250 Z', 'clip'),
          P('M498 212 l7 6 l-5 2 l8 8', 'spark'),
          T(436, 266, '正负极接通，带电电池会大电流放电、发热', 9.5, None, None, 't-mut')]
    return svgw(640, 280, '纽扣电池接线：绿、蓝接正极壳，白、红、橙接负极盖；四线夹具每面一个电流触点、一个感应触点；用鳄鱼夹时只夹两个平面中心，夹子咬住边缘会把正负极短路。', ''.join(o))


def coin_types():
    def sub2(a, b):
        return f'R<tspan dy="2.8" font-size="7.5">{a}</tspan><tspan dy="-2.8"> + R</tspan><tspan dy="2.8" font-size="7.5">{b}</tspan>'
    o = []
    panels = [
        ('SS | 电解质 | SS', '阻塞电极', '→ 离子电导率 σ'),
        ('Li | 电解质 | Li', '对称锂电池', '→ 界面阻抗、迁移数'),
        ('正极 | 电解液 | 负极', '半电池 / 全电池', '→ 内阻、界面、扩散'),
    ]
    for i, (t, st, use) in enumerate(panels):
        x0 = 8 + i * 210
        ox, oy = x0 + 18, 190
        o += [R(x0, 8, 204, 256, 'sunk-r', 8), T(x0 + 12, 28, t, 12, None, 700), T(x0 + 12, 45, st, 10, None, None, 't-mut'),
              P(f'M{ox} 60 V{oy} H{x0 + 194}', 'axis'),
              T(ox + 4, 70, '−Z″', 9, None, None, 't-mut'), T(x0 + 194, oy + 14, 'Z′', 9, 'end', None, 't-mut'),
              T(x0 + 102, 254, use, 11, 'middle', 700, 't-acc')]
        if i == 0:
            o += [P(f'M{x0 + 26} {oy} A42 42 0 0 1 {x0 + 110} {oy} L{x0 + 128} 66', 'curve'),
                  dim_h(x0 + 26, x0 + 110, 216), T(x0 + 68, 232, sb('R', 'b', 11), 11, 'middle', 700)]
        elif i == 1:
            o += [P(f'M{x0 + 26} {oy} A8 8 0 0 1 {x0 + 42} {oy} A48 48 0 0 1 {x0 + 138} {oy} L{x0 + 158} 172', 'curve'),
                  T(x0 + 34, 206, sb('R', 'b', 10), 10, 'middle', 600),
                  dim_h(x0 + 42, x0 + 138, 216), T(x0 + 90, 232, sb('R', '界面', 11), 11, 'middle', 700)]
        else:
            o += [P(f'M{x0 + 30} {oy} A16 12 0 0 1 {x0 + 62} {oy} A34 26 0 0 1 {x0 + 130} {oy} L{x0 + 186} 134', 'curve'),
                  T(x0 + 30, 206, sb('R', 'Ω', 10), 10, 'middle', 600),
                  dim_h(x0 + 30, x0 + 130, 216), T(x0 + 80, 232, sub2('SEI', 'ct'), 10.5, 'middle', 700),
                  T(x0 + 194, 124, '45° 扩散尾', 9.5, 'end', None, 't-mut')]
    return svgw(640, 272, '三种纽扣电池的 Nyquist 图示意：不锈钢阻塞电池是半圆加低频尖峰，用来测离子电导率；锂对称电池是本体截距加界面半圆；半电池或全电池是欧姆截距、SEI 和电荷转移半圆，再接 45 度扩散尾。', ''.join(o))


FIGS = {'coin-types': coin_types, 'coin-exploded': coin_exploded, 'coin-wiring': coin_wiring}


def fill_figs():
    s = PAGE.read_text(encoding='utf-8')
    for k, fn in FIGS.items():
        pat = re.compile(rf'<!--FIG:{k}-->.*?<!--/FIG:{k}-->', re.S)
        if pat.search(s):
            s = pat.sub(lambda m: f'<!--FIG:{k}-->{fn()}<!--/FIG:{k}-->', s)
    PAGE.write_text(s, encoding='utf-8')
    print('figures filled:', ', '.join(FIGS))


if __name__ == '__main__':
    build()
    fill_figs()
