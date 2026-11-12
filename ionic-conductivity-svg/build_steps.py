"""Generate all step and section illustrations for ionic-conductivity-ref620.html.

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



# ================================================================ after coin-cell tests
def warn(x, y, r=8):
    return (P(f'M{x} {y - r} L{x + r * .95:.1f} {y + r * .8:.1f} L{x - r * .95:.1f} {y + r * .8:.1f} Z', 'ic-warn') +
            T(x, round(y + r * .62, 1), '!', round(r * 1.2, 1), 'middle', 700, 't-onwarn'))


def coin(x, y, w=110, swollen=False):
    o = R(x, y + 12, w, 20, 'steel', 5) + R(x + 7, y + 6, w - 14, 10, 'gasket', 2)
    if swollen:
        o += P(f'M{x + 14} {y + 16} V{y + 6} Q{x + w / 2} {y - 16} {x + w - 14} {y + 6} V{y + 16} Z', 'steel')
    else:
        o += R(x + 14, y, w - 28, 16, 'steel', 4)
    return o + R(x, y + 6, 12, 10, 'steel', 2) + R(x + w - 12, y + 6, 12, 10, 'steel', 2)


def a1():
    o = [panel(12, 16),
         T(160, 30, '实验结束', 12, None, 700),
         coin(214, 104, 128),
         wire('M250 66 V60 Q250 56 246 56 H186', 'ce'), wire('M307 66 V54 Q307 48 301 48 H186', 're'),
         wire('M250 152 V160 Q250 164 246 164 H186', 'we'), wire('M307 152 V166 Q307 172 301 172 H186', 'ws'),
         R(244, 66, 12, 18, 'steel', 2), R(300, 66, 14, 18, 'steel', 2),
         R(244, 136, 12, 16, 'steel', 2), R(300, 136, 14, 16, 'steel', 2),
         f'<line x1="279" y1="100" x2="279" y2="78" class="dim"/>', P('M279 72 L274 81 L284 81 Z', 'arr'),
         T(330, 82, '松开', 10.5, None, 600),
         f'<line x1="348" y1="120" x2="382" y2="120" class="dim"/>', P('M390 120 L381 115 L381 125 Z', 'arr'),
         T(366, 112, '取出', 10.5, 'middle', 600),
         ok(172, 196), T(186, 200.5, '先等黄灯熄灭，再松开触点', 11, None, 700)]
    return svg('实验结束：Cell On 黄灯熄灭后，松开夹具触点，取出纽扣电池。', ''.join(o))


def a2():
    o = [C(70, 96, 48, 'steel'), C(70, 96, 40, 'steel'), T(70, 101.5, 'S3-1', 15, 'middle', 700),
         T(70, 166, '壳上写编号', 10.5, 'middle', None, 't-mut'),
         R(138, 14, 252, 192, 'sunk-r', 8), T(150, 36, '记录', 12, None, 700), T(380, 36, '示例', 10, 'end', 600, 't-warn')]
    rows = [('编号', 'S3-1'), ('样品', 'PEO-LiTFSI，批次 2'), ('L / A', '100 µm / 2.01 cm²'),
            ('温度', '60 °C，降温段'), ('文件', 'S3-1_60C_EIS.DTA'), ('开路电压', '2.9 mV')]
    for i, (k, v) in enumerate(rows):
        y = 60 + i * 21
        o += [T(150, y, k, 10.5, None, None, 't-mut'), T(214, y, v, 11, None, 700, 'tm' if k == '文件' else None)]
    o += [ok(156, 188), T(170, 192.5, '重复测两次，谱图基本重合', 10.5, None, 600)]
    return svg('记录：在电池壳上写编号；记下编号、样品批次、L 和 A、温度、数据文件名和开路电压；重复测两次，谱图应基本重合。', ''.join(o))


def a3():
    o = [T(200, 28, '拆之前先看外观', 12, 'middle', 700), T(200, 46, '摸起来发热也算异常', 10, 'middle', None, 't-mut'),
         coin(20, 72, 100), coin(150, 72, 100, swollen=True), coin(280, 72, 100),
         C(288, 79, 3.5, 'crystal'), C(295, 74, 3, 'crystal'), C(372, 80, 3.5, 'crystal'),
         P('M380 100 q5 9 0 13 q-5 -4 0 -13 Z', 'drip'),
         ok(44, 128), T(58, 132.5, '平整、干净', 11.5, None, 700),
         bad(176, 128), T(190, 132.5, '鼓胀', 11.5, None, 700, 't-bad'),
         bad(298, 128), T(312, 132.5, '漏液、结晶', 11.5, None, 700, 't-bad'),
         T(70, 150, '可以继续', 10, 'middle', None, 't-mut'),
         T(200, 150, '负极盖被顶起', 10, 'middle', None, 't-mut'),
         T(330, 150, '边缘有白色结晶', 10, 'middle', None, 't-mut'),
         R(14, 166, 372, 44, 'warnbox', 8),
         T(200, 185, '异常电池不要拆：放进防火容器隔离', 11.5, 'middle', 700),
         T(200, 201, '（例如装沙的金属罐），并报告负责人', 10, 'middle', None, 't-mut')]
    return svg('外观检查：平整干净的电池可以继续；鼓胀、漏液或边缘有白色结晶、发热的电池不要拆，放进防火容器隔离并报告负责人。', ''.join(o))


def a4():
    rows = [('SS | 电解质 | SS', '不带电', '无锂金属', ok, 'okbox', '可以直接拆', '怕水样品进手套箱'),
            ('Li | 电解质 | Li', '含锂金属', '', warn, 'warnbox', '手套箱里拆', '锂片按规程处理'),
            ('半电池 / 全电池', '带电', '3–4 V', warn, 'warnbox', '先放电', '两极贴绝缘胶带')]
    o = []
    for i, (t, p1, p2, ic, box, a1_, a2_) in enumerate(rows):
        y0 = 14 + i * 68
        o += [R(10, y0, 124, 56, 'sunk-r', 6), T(72, y0 + 32, t, 11, 'middle', 700),
              f'<line x1="138" y1="{y0 + 28}" x2="150" y2="{y0 + 28}" class="dim"/>', P(f'M157 {y0 + 28} L149 {y0 + 24} L149 {y0 + 32} Z', 'arr'),
              T(206, y0 + (25 if p2 else 32), p1, 11.5, 'middle', 700)]
        if p2:
            o.append(T(206, y0 + 42, p2, 10, 'middle', None, 't-mut'))
        o += [f'<line x1="256" y1="{y0 + 28}" x2="268" y2="{y0 + 28}" class="dim"/>', P(f'M275 {y0 + 28} L267 {y0 + 24} L267 {y0 + 32} Z', 'arr'),
              R(278, y0, 114, 56, box, 6), ic(292, y0 + 20), T(304, y0 + 24.5, a1_, 11.5, None, 700),
              T(290, y0 + 44, a2_, 9.5, None, None, 't-mut')]
    return svg('按电池类型处理：不锈钢阻塞电池不带电、无锂金属，可以直接拆；锂对称电池含锂金属，在手套箱里拆；半电池和全电池带电，先放电并用绝缘胶带包住两极。', ''.join(o))


def a5():
    o = [R(60, 132, 150, 24, 'steel', 5), R(68, 124, 134, 10, 'gasket', 2),
         P('M60 132 L48 116 L56 112 L68 126 Z', 'steel'), R(198, 124, 12, 10, 'steel', 2),
         R(80, 86, 110, 16, 'steel', 4),
         f'<line x1="135" y1="121" x2="135" y2="110" class="dim"/>', P('M135 104 L130 112 L140 112 Z', 'arr'),
         P('M14 98 L50 108 L48 114 L14 110 Z', 'clip'), P('M14 150 L54 132 L58 137 L14 162 Z', 'clip'),
         R(0, 96, 16, 16, 'grip', 3), R(0, 148, 16, 16, 'grip', 3),
         T(135, 186, '专用拆壳器或绝缘钳撬开翻边', 11, 'middle', 700),
         T(135, 204, '工具不要同时碰到盖和壳', 10, 'middle', 600, 't-warn'),
         R(244, 22, 144, 96, 'gbox', 6), R(252, 30, 128, 48, 'gwin', 4),
         T(316, 59, '手套箱', 12, 'middle', 700, 't-acc'),
         C(284, 98, 13, 'gport'), C(348, 98, 13, 'gport'),
         T(244, 140, sb('含锂金属或 LiPF', '6', 10.5, ' 电解液'), 10.5, None, 700),
         T(244, 157, '→ 在手套箱里拆', 10.5, None, 600),
         T(244, 177, sb('LiPF', '6', 10, ' 遇水会产生 HF'), 10, None, None, 't-mut'),
         T(244, 195, '戴护目镜和手套', 10, None, None, 't-mut')]
    return svg('拆壳：用专用拆壳器或绝缘钳撬开翻边，取下负极盖，工具不要同时碰到盖和壳；含锂金属或 LiPF6 电解液的电池在手套箱里拆，LiPF6 遇水会产生 HF，戴护目镜和手套。', ''.join(o))


def a6():
    o = [C(70, 72, 42, 'sample'), C(70, 72, 35, 'hidden-edge'),
         C(200, 72, 42, 'sample'), P('M232 92 C 262 96, 262 122, 232 116 C 220 114, 214 104, 222 96 Z', 'sample'), C(200, 72, 35, 'hidden-edge'),
         C(330, 72, 42, 'sample'), C(330, 72, 35, 'hidden-edge'), C(343, 63, 8, 'steel'), C(316, 86, 3.5, 'pt'),
         ok(40, 136), T(54, 140.5, '完整', 11.5, None, 700),
         bad(170, 136), T(184, 140.5, '挤出', 11.5, None, 700, 't-bad'),
         bad(300, 136), T(314, 140.5, '破孔', 11.5, None, 700, 't-bad'),
         T(70, 156, '和装池时一样', 10, 'middle', None, 't-mut'),
         T(200, 156, '流到垫片外面', 10, 'middle', None, 't-mut'),
         T(330, 156, '露出不锈钢', 10, 'middle', None, 't-mut'),
         R(14, 168, 372, 42, 'sunk-r', 8),
         T(26, 186, '复测 L：装池前 100 µm → 拆开后 82 µm', 11, None, 700),
         T(374, 186, '示例', 10, 'end', 600, 't-warn'),
         T(26, 202, '相差明显：测量中膜被压薄，这批数据要谨慎使用', 10, None, None, 't-mut')]
    return svg('检查电解质膜：完整的膜和装池时一样；挤出到垫片外面或有破孔都要记录；拆开后复测厚度，和装池前相差明显说明测量中膜被压薄。', ''.join(o))


def a7():
    bins = [('电池废物', '放电后', '两极贴胶带'), ('化学废物', '膜、隔膜', '沾液擦拭纸'),
            ('锂金属', '钝化后处理', '不进垃圾、不碰水'), ('可复用', 'SS 垫片', '清洗、烘干')]
    o = []
    for i, (t, l1, l2) in enumerate(bins):
        x0 = 10 + i * 98
        cx = x0 + 43
        o += [T(cx, 30, t, 11.5, 'middle', 700),
              P(f'M{x0 + 6} 48 H{x0 + 80} L{x0 + 74} 128 H{x0 + 12} Z', 'bin'), R(x0 + 2, 42, 82, 8, 'binlid', 2)]
        if i == 0:
            o += [C(cx, 88, 20, 'steel'), C(cx, 88, 15, 'steel'), R(cx - 25, 84, 50, 8, 'tape', 1), R(cx - 4, 63, 8, 50, 'tape', 1)]
        elif i == 1:
            o += [R(cx - 22, 72, 44, 28, 'sample', 3), P(f'M{cx - 18} 108 h36', 'lead'), P(f'M{cx - 18} 114 h30', 'lead')]
        elif i == 2:
            o += [R(cx - 22, 76, 44, 24, 'li', 2), T(cx, 93, 'Li', 12, 'middle', 700, 't-onlight')]
        else:
            o += [C(cx - 8, 92, 15, 'steel'), C(cx + 9, 84, 15, 'steel')]
        o += [T(cx, 148, l1, 10.5, 'middle', 700), T(cx, 164, l2, 9.5, 'middle', None, 't-mut')]
    o += [T(200, 198, '具体分类以单位 EHS 规定为准', 10.5, 'middle', 600, 't-warn')]
    return svg('分类处理：放电并贴胶带的电池进电池废物；电解质膜、隔膜和沾电解液的擦拭纸进化学废物；锂金属钝化后处理，不进普通垃圾、不碰水；不锈钢垫片清洗烘干后可复用；以单位 EHS 规定为准。', ''.join(o))


def a8():
    o = [T(70, 30, '夹具触点', 11.5, 'middle', 700),
         R(46, 52, 12, 32, 'steel', 2), R(78, 52, 12, 32, 'steel', 2),
         P('M30 94 H100 L94 112 H36 Z', 'cloth'),
         P('M40 124 l10 -6 l10 6 l10 -6 l10 6 l10 -6', 'turn'),
         R(108, 70, 18, 36, 'bottle', 4), R(112, 62, 10, 9, 'bottle', 2),
         T(117, 92, 'IPA', 7.5, 'middle', 700),
         T(70, 148, '无尘纸蘸异丙醇', 10.5, 'middle', 700), T(70, 164, '擦掉电解液残留', 9.5, 'middle', None, 't-mut'),
         T(200, 30, '电缆导线', 11.5, 'middle', 700),
         R(160, 46, 80, 6, 'steel', 2)]
    for x, k in [(170, 'we'), (182, 'ws'), (194, 're'), (206, 'ce'), (218, 'cs'), (230, 'gnd')]:
        o += [wire(f'M{x} 52 V108', k), R(x - 4, 108, 8, 12, 'clip', 1)]
    o += [T(200, 148, '分开挂好', 10.5, 'middle', 700), T(200, 164, '金属头不互碰', 9.5, 'middle', None, 't-mut'),
          T(330, 30, '仪器', 11.5, 'middle', 700),
          R(286, 46, 88, 84, 'panel', 6), T(330, 66, 'Reference 620', 9, 'middle', 700, 't-panel'),
          C(300, 114, 7.5, 'glow-b'), C(300, 114, 4.5, 'led-b'), T(311, 117.5, 'Power', 8.5, None, None, 't-panel'),
          T(330, 148, '当天不用：', 10.5, 'middle', 700), T(330, 164, '按使用 SOP 关机', 9.5, 'middle', None, 't-mut'),
          R(14, 180, 372, 30, 'okbox', 8), T(200, 199.5, '工位干净，电缆整理好，仪器状态写进记录本', 10.5, 'middle', 600)]
    return svg('清理：夹具触点用无尘纸蘸异丙醇擦掉电解液残留；电解池电缆导线分开挂好，金属头不互碰；当天不用仪器时按使用 SOP 关机。', ''.join(o))


AFTER = [
    (a1, '''<p>等实验结束、Cell On 黄灯熄灭，再松开夹具或鳄鱼夹，取下电池。<span class="src">手册 Ch 7</span></p>
          <ul><li>带电的半电池、全电池：取下的夹子分开放，不要互相碰到，也不要碰到电池的另一极。</li>
          <li>接着测下一个电池时，导线留在夹具上即可。</li></ul>'''),
    (a2, '''<p>确认 .DTA 文件已经保存，把电池信息和数据一一对应记下来。</p>
          <ul><li>记录电池编号、样品和批次、L 和 A、温度（升温段还是降温段）和文件名；全电池再记开路电压。</li>
          <li>同一温度重复测两次，谱图应基本重合；不重合说明体系还没稳定，或者几何形状在变。<span class="src gen">通用方法</span></li>
          <li>用记号笔在壳上写编号，拆开以后才对得上。</li></ul>'''),
    (a3, '''<p>拆之前先看外观：平整、干净、不发热才继续。<span class="src gen">通用方法</span></p>
          <ul><li>鼓胀、漏液、边缘有白色结晶或发热的电池不要拆，放进防火容器（例如装沙的金属罐）隔离，并报告实验室负责人。</li></ul>'''),
    (a4, '''<p>按电池类型决定怎么处理。<span class="src gen">通用方法</span></p>
          <ul><li><strong>SS | 电解质 | SS</strong>：不储能、没有锂金属，可以直接拆；样品含锂盐或怕水时，仍在手套箱里拆。</li>
          <li><strong>Li | 电解质 | Li</strong>：含锂金属，在手套箱里拆，锂片按课题组规程处理。</li>
          <li><strong>半电池、全电池</strong>：先放电，例如用恒电流放电到截止电压，或按单位规定的方法；不要用导线直接短路放电。放电后用绝缘胶带包住两极。</li></ul>'''),
    (a5, '''<p>拆壳：用专用拆壳器 (decrimper) 或绝缘钳撬开翻边，取出负极盖、弹片和垫片。<span class="src gen">通用方法</span></p>
          <ul><li>戴护目镜和手套。工具不要同时碰到负极盖和正极壳，否则电池会经工具短路。</li>
          <li>含锂金属或 LiPF<sub>6</sub> 类电解液的电池在手套箱里拆：LiPF<sub>6</sub> 遇水分解会产生 HF。</li></ul>'''),
    (a6, '''<p>检查电解质膜，并复测厚度 L。<span class="src gen">通用方法</span></p>
          <ul><li>看膜有没有流到垫片外面、有没有破孔；Li 对称电池还要看锂表面有没有枝晶 (dendrite) 或变色。拍照存档。</li>
          <li>拆开后的厚度和装池前相差明显，说明测量中膜被压薄，这批数据要谨慎使用；软的电解质改用 PTFE 环形垫片。</li></ul>'''),
    (a7, '''<p>拆下的部件分类处理。分类和交接方式以所在单位的 EHS（环境健康安全）规定为准。<span class="src gen">通用方法</span></p>
          <ul><li><strong>电池废物</strong>：放电后、两极贴了胶带的电池。</li>
          <li><strong>化学废物</strong>：电解质膜、隔膜、沾了电解液的擦拭纸。</li>
          <li><strong>锂金属</strong>：不要扔进普通垃圾，也不要碰水（锂遇水剧烈反应、放出氢气）。按规程钝化后再处理；常见做法之一是在通风橱里让少量锂和异丙醇缓慢反应，同样会放出氢气，要远离火源，并且只在规程允许、有人指导时做。</li>
          <li><strong>可复用</strong>：课题组允许时，不锈钢垫片用溶剂清洗、烘干后再用；壳、盖、弹片一般一次性使用。</li></ul>'''),
    (a8, '''<p>清理夹具和工位。<span class="src gen">通用方法</span></p>
          <ul><li>夹具触点用无尘纸蘸异丙醇擦干净：电解液残留会腐蚀触点，增大接触电阻。</li>
          <li>电解池电缆的导线分开挂好，金属头不要互相碰到。</li>
          <li>当天不再使用仪器时，按使用 SOP 的步骤关机。</li></ul>'''),
]


def build_after():
    items = []
    for fn, text in AFTER:
        items.append(f'''        <li><div class="step"><div class="step-text">{text}</div>
          <figure class="stepfig">{fn()}</figure></div></li>''')
    block = '<!--AFTER-->\n      <ol class="steps">\n' + '\n'.join(items) + '\n      </ol>\n      <!--/AFTER-->'
    s = PAGE.read_text(encoding='utf-8')
    s = re.sub(r'<!--AFTER-->.*?<!--/AFTER-->', lambda m: block, s, flags=re.S)
    PAGE.write_text(s, encoding='utf-8')
    print('after-test steps written:', len(items))



# ================================================================ PP film section
import math as _m


def ms(parts, size):
    """Text with several subscripts: parts = [(text, is_sub), ...]."""
    d = round(size * .28, 1)
    o, low = '', False
    for t, sub in parts:
        if sub and not low:
            o += f'<tspan dy="{d}" font-size="{round(size * .72, 1)}">{t}</tspan>'
            low = True
        elif not sub and low:
            o += f'<tspan dy="-{d}">{t}</tspan>'
            low = False
        else:
            o += t
    return o


def print_lines(x1, x2, y1, y2, step=10):
    return ''.join(f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" class="print"/>' for y in range(y1, y2 + 1, step))


def wet_disc(cx, cy, r, y1, y2, step=10, outline=True):
    """Wetted (translucent) area: background shows plus the print lines behind it."""
    o = C(cx, cy, r, 'sep-wet')
    for y in range(y1, y2 + 1, step):
        if abs(y - cy) < r:
            h = _m.sqrt(r * r - (y - cy) ** 2) - 1
            o += f'<line x1="{cx - h:.1f}" y1="{y}" x2="{cx + h:.1f}" y2="{y}" class="print"/>'
    if outline:
        o += C(cx, cy, r, 'sep-edge')
    return o


def pp_identify():
    o = [R(10, 10, 305, 240, 'sunk-r', 8), T(26, 34, '微孔 PP 隔膜', 13, None, 700),
         T(26, 52, '例如 Celgard 一类的电池隔膜', 10, None, None, 't-mut'),
         print_lines(44, 196, 80, 170), R(36, 70, 168, 112, 'sep', 3),
         wet_disc(120, 126, 30, 80, 170),
         T(120, 88, '滴一滴乙醇', 10, 'middle', 600),
         T(214, 90, '白色、不透明', 11.5, None, 700),
         T(214, 118, '滴乙醇：', 11), T(214, 134, '吸进去，', 11), T(214, 150, '变成半透明', 11, None, 700, 't-acc'),
         T(26, 210, '用途：浸液体电解液，测有效电导率', 11, None, 700),
         T(26, 228, '也是 Li 对称电池、全电池的隔膜', 10, None, None, 't-mut')]
    o += [R(325, 10, 305, 240, 'sunk-r', 8), T(341, 34, '致密 PP 薄膜', 13, None, 700),
          T(341, 52, '没有孔的透明薄膜', 10, None, None, 't-mut'),
          print_lines(354, 506, 80, 170), R(350, 70, 168, 112, 'film-clear', 3),
          P('M362 172 L404 78', 'gloss'), P('M376 172 L418 78', 'gloss2'),
          '<ellipse cx="452" cy="128" rx="26" ry="16" class="droplet"/>',
          T(528, 90, '透明、有光泽', 11.5, None, 700),
          T(528, 118, '滴乙醇：', 11), T(528, 134, '摊在表面，', 11), T(528, 150, '膜本身不变', 11, None, 700),
          T(341, 210, '用途：剪成环形垫片，限定 L 和 A', 11, None, 700),
          T(341, 228, '适合软的聚合物电解质', 10, None, None, 't-mut')]
    return svgw(640, 260, '分辨两种 PP 膜：微孔 PP 隔膜是白色不透明的，滴乙醇后被吸进去、变成半透明，用来浸液体电解液；致密 PP 薄膜是透明有光泽的，乙醇只摊在表面、膜不变，适合剪成环形垫片。', ''.join(o))


def pp_ring():
    cx, cy = 120, 112
    o = [C(cx, cy, 76, 'film-clear'), C(cx, cy, 64, 'hidden-edge'), C(cx, cy, 44, 'sample'),
         dim_h(cx - 44, cx + 44, cy), T(cx, cy - 8, 'd（孔径）', 11, 'middle', 700),
         f'<line x1="{cx + 58}" y1="{cy - 50}" x2="214" y2="34" class="lead"/>', T(218, 32, 'PP 环', 11, None, 700),
         f'<line x1="{cx + 20}" y1="{cy + 30}" x2="214" y2="196" class="lead"/>', T(218, 200, '电解质填满孔', 11, None, 700),
         T(cx, 222, 'A = π d² / 4', 12.5, 'middle', 700), T(cx, 240, '虚线：垫片边缘', 10, 'middle', None, 't-mut'),
         R(330, 60, 260, 14, 'steel', 2), R(330, 74, 90, 16, 'film-clear'), R(500, 74, 90, 16, 'film-clear'),
         R(420, 74, 80, 16, 'sample'), R(330, 90, 260, 14, 'steel', 2),
         T(375, 86, 'PP 环', 10, 'middle', 600), T(545, 86, 'PP 环', 10, 'middle', 600), T(460, 86, '电解质', 10, 'middle', 700),
         T(460, 52, '不锈钢垫片', 10, 'middle', None, 't-mut'), T(460, 118, '不锈钢垫片', 10, 'middle', None, 't-mut'),
         '<line x1="594" y1="74" x2="622" y2="74" class="dim"/>', '<line x1="594" y1="90" x2="622" y2="90" class="dim"/>',
         '<line x1="614" y1="56" x2="614" y2="74" class="dim"/>', P('M614 74 L610 66 L618 66 Z', 'arr'),
         '<line x1="614" y1="90" x2="614" y2="108" class="dim"/>', P('M614 90 L610 98 L618 98 Z', 'arr'),
         T(600, 134, 'L = PP 环的厚度', 11, 'end', 700),
         T(330, 166, '① 冲出外圆和内孔，量环的厚度', 11),
         T(330, 188, '② 电解质填满孔，刮平到和环齐平', 11),
         T(330, 210, '③ 盖上垫片：压力由 PP 环承担', 11),
         T(330, 234, 'PP 长时间高于约 100 °C 会软化、变形', 10, None, None, 't-warn')]
    return svgw(640, 252, '致密 PP 薄膜做环形垫片：俯视图中 PP 环外圆不小于垫片，中心孔填满电解质，孔径 d 决定面积 A；截面图中两片不锈钢垫片压在 PP 环上，L 等于 PP 环厚度。', ''.join(o))


def p1():
    o = [C(100, 98, 62, 'sep'), C(100, 98, 52, 'hidden-edge'),
         T(100, 94, '隔膜 Ø19 mm', 11.5, 'middle', 700), T(100, 112, '虚线：垫片 Ø16 mm', 10, 'middle', None, 't-mut'),
         T(100, 186, '隔膜比垫片大一圈', 11, 'middle', 700), T(100, 203, '垫片边缘才不会碰到', 10, 'middle', None, 't-mut'),
         R(226, 36, 146, 104, 'oven', 8), R(236, 48, 92, 80, 'chamber', 4),
         R(334, 54, 32, 16, 'panel', 3), T(350, 66, '60°C', 8.5, 'middle', 600, 't-panel tm'),
         C(350, 92, 7, 'knob-s'), C(350, 114, 7, 'knob-s'),
         R(246, 92, 72, 4, 'sep', 1), R(246, 100, 72, 4, 'sep', 1), R(246, 108, 72, 4, 'sep', 1),
         T(282, 72, '真空', 10, 'middle', 600, 't-mut'),
         T(299, 164, '干燥后进手套箱', 11, 'middle', 700),
         T(299, 182, '温度按课题组规程', 10, 'middle', None, 't-mut'),
         T(299, 198, '（PP 不耐高温，常用 60 °C 左右）', 9.5, 'middle', None, 't-mut')]
    return svg('冲片和干燥：PP 隔膜冲成直径 19 毫米、比 16 毫米垫片大一圈的圆片；真空干燥后放进手套箱，温度按课题组规程，常用 60 度左右。', ''.join(o))


def p2():
    o = [P('M59 104 V130 Q59 156 85 156 H165 Q191 156 191 130 V104', 'frame-out'),
         P('M59 104 V130 Q59 156 85 156 H165 Q191 156 191 130 V104', 'frame'),
         R(50, 78, 18, 26, 'steel', 2)]
    o += [R(68 + 3 * i, 70, 3, 42, 'sep') for i in range(4)]
    o += [R(80, 84, 90, 14, 'steel'), R(168, 78, 46, 26, 'steel'), R(212, 72, 36, 38, 'steel', 4), R(248, 80, 14, 22, 'steel', 3),
          '<line x1="74" y1="68" x2="74" y2="46" class="lead"/>', T(60, 40, '4 层隔膜叠在一起', 11.5, None, 700),
          T(125, 176, '千分尺：用棘轮轻轻接触', 10.5, 'middle', None, 't-mut'),
          T(330, 64, '读数 0.100 mm', 12, 'middle', 600),
          T(330, 90, '÷ 4 层', 12, 'middle', 600),
          T(330, 122, ms([('L', False), ('1', True), (' = 25 µm', False)], 16), 16, 'middle', 700, 't-acc'),
          T(330, 150, '单层太薄，直接量误差大', 10, 'middle', None, 't-mut'),
          T(16, 206, '也可以先用说明书上的厚度，但最好自己复核', 10.5, None, 600)]
    return svg('量厚度：把 4 层隔膜叠在一起用千分尺量，读数 0.100 毫米除以 4 层，单层厚度 L1 等于 25 微米。', ''.join(o))


def p3():
    o = [R(30, 166, 160, 32, 'steel', 5), R(37, 166, 146, 24, 'cavity', 3),
         R(46, 150, 128, 7, 'steel', 1.5), R(38, 138, 144, 4, 'sep', 1),
         R(102, 36, 16, 54, 'pipette', 3), P('M103 90 L117 90 L111 118 L109 118 Z', 'pipette'),
         P('M110 122 q4 6 0 9 q-4 -3 0 -9 Z', 'droplet'),
         T(128, 58, '滴加电解液', 11, None, 700), T(128, 74, '浸透整片隔膜', 10, None, None, 't-mut'),
         T(110, 214, '先放下面这几层', 10, 'middle', None, 't-mut'),
         T(232, 36, '组装顺序（从下往上）', 11.5, None, 700)]
    items = [('① 正极壳', False), ('② 不锈钢垫片', False), ('③ PP 隔膜，放平居中', True), ('④ 滴加电解液', True),
             ('⑤ 不锈钢垫片', False), ('⑥ 弹片、负极盖', False), ('⑦ 封口', False)]
    for i, (t, hi) in enumerate(items):
        o.append(T(232, 62 + i * 22, t, 11, None, 700 if hi else None, 't-acc' if hi else None))
    return svg('组装和加液：从下往上依次放正极壳、不锈钢垫片、PP 隔膜，滴加电解液浸透整片隔膜，再放不锈钢垫片、弹片和负极盖，最后封口。', ''.join(o))


def p4():
    o = [T(200, 24, '静置，让电解液浸透', 12, 'middle', 700)]
    for cx in (70, 200, 330):
        for y in range(66, 119, 10):
            h = _m.sqrt(max(0, 41 ** 2 - (y - 92) ** 2))
            o.append(f'<line x1="{cx - h:.1f}" y1="{y}" x2="{cx + h:.1f}" y2="{y}" class="print"/>')
    o += [C(70, 92, 42, 'sep'),
          C(200, 92, 42, 'sep'), wet_disc(200, 92, 24, 66, 118, outline=False), C(200, 92, 42, 'sep-edge'),
          wet_disc(330, 92, 42, 66, 118),
          '<line x1="118" y1="92" x2="144" y2="92" class="dim"/>', P('M152 92 L143 87 L143 97 Z', 'arr'),
          '<line x1="248" y1="92" x2="274" y2="92" class="dim"/>', P('M282 92 L273 87 L273 97 Z', 'arr'),
          T(70, 152, '刚加液', 11, 'middle', 700), T(200, 152, '浸润中', 11, 'middle', 700), T(330, 152, '浸透', 11, 'middle', 700, 't-acc'),
          T(70, 168, '白色、不透明', 9.5, 'middle', None, 't-mut'), T(200, 168, '中间先变透明', 9.5, 'middle', None, 't-mut'),
          T(330, 168, '整片半透明', 9.5, 'middle', None, 't-mut'),
          T(200, 196, 'PP 疏水，浸润慢：静置几小时再测', 11, 'middle', 700),
          T(200, 213, '或隔一段时间测一次，截距不再变化再取值', 9.5, 'middle', None, 't-mut')]
    return svg('静置浸润：刚加液时隔膜白色不透明，浸润中从中间开始变透明，浸透后整片半透明；PP 疏水，静置几小时再测，或截距不再变化再取值。', ''.join(o))


PP_PTS = [(1, 1.85), (2, 3.22), (3, 4.69), (4, 6.07)]


def p5():
    X = lambda n: 60 + n * 68
    Y = lambda r: 180 - r * 20
    n = len(PP_PTS)
    mx = sum(a for a, _ in PP_PTS) / n
    my = sum(b for _, b in PP_PTS) / n
    sl = sum((a - mx) * (b - my) for a, b in PP_PTS) / sum((a - mx) ** 2 for a, _ in PP_PTS)
    ic = my - sl * mx
    o = [T(60, 22, '1–4 层分别装电池，测高频截距 R', 11.5, None, 700)]
    for r in (0, 2, 4, 6):
        o += [f'<line x1="60" y1="{Y(r)}" x2="372" y2="{Y(r)}" class="grid"/>', T(52, Y(r) + 4, str(r), 10, 'end', None, 't-mut')]
    for k in range(5):
        o.append(T(X(k), 196, str(k), 10, 'middle', None, 't-mut'))
    o += [P('M60 36 V180 H372', 'axis'), T(56, 34, 'R (Ω)', 10, 'end', None, 't-mut'), T(372, 212, '隔膜层数 n', 10, 'end', None, 't-mut'),
          f'<line x1="{X(0)}" y1="{Y(ic):.1f}" x2="{X(4.4)}" y2="{Y(ic + sl * 4.4):.1f}" class="fit"/>']
    o += [C(X(a), round(Y(b), 1), 5, 'mark') for a, b in PP_PTS]
    o += [C(X(0), round(Y(ic), 1), 6, 'ring-warn'),
          T(78, 177, f'截距 ≈ {ic:.2f} Ω = 接触电阻', 10.5, None, 700, 't-warn'),
          P(f'M{X(2)} {Y(ic + sl * 2):.1f} H{X(3)} V{Y(ic + sl * 3):.1f}', 'slope'),
          T(X(3) + 8, Y(ic + sl * 2.5) + 4, f'斜率 ≈ {sl:.2f} Ω/层', 10.5, None, 700),
          T(X(3) + 8, Y(ic + sl * 2.5) + 20, '= 每层隔膜的电阻', 10, None, None, 't-mut'),
          T(372, 22, '示例', 10, 'end', 600, 't-warn')]
    return svg(f'多层法：1 到 4 层隔膜的高频截距对层数作直线，斜率约 {sl:.2f} 欧姆每层，是每层隔膜的电阻；截距约 {ic:.2f} 欧姆，是壳体和接触电阻。', ''.join(o))


def p6():
    o = [T(200, 34, ms([('σ', False), ('eff', True), (' = L', False), ('1', True), (' / (R', False), ('层', True), (' · A)', False)], 16), 16, 'middle', 700),
         T(200, 58, '= 0.0025 cm ÷ (1.41 Ω × 2.01 cm²)', 11, 'middle', None, 'tm'),
         T(200, 82, '= 8.8 × 10⁻⁴ S/cm = 0.88 mS/cm', 13.5, 'middle', 700, 't-acc'),
         '<line x1="40" y1="100" x2="360" y2="100" class="grid"/>',
         T(200, 128, ms([('N', False), ('M', True), (' = σ', False), ('0', True), (' / σ', False), ('eff', True)], 15), 15, 'middle', 700),
         T(200, 150, ms([('σ', False), ('0', True), ('：电解液本身的电导率（用电导率仪测）', False)], 10), 10, 'middle', None, 't-mut'),
         T(200, 176, ms([('例：σ', False), ('0', True), (' = 10 mS/cm → N', False), ('M', True), (' ≈ 11', False)], 12), 12, 'middle', 700),
         T(200, 196, '隔膜让电阻变大的倍数（孔隙率、曲折度）', 10, 'middle', None, 't-mut'),
         R(14, 198, 64, 18, 'tagbox', 9), T(46, 211, '示例数值', 10, 'middle', 700, 't-warn')]
    return svg('计算：有效电导率 σeff 等于单层厚度除以每层电阻乘面积，示例 0.0025 厘米除以 1.41 欧姆乘 2.01 平方厘米，约 0.88 毫西每厘米；MacMullin 数 NM 等于电解液本身电导率除以 σeff，示例约 11。', ''.join(o))


PP_STEPS = [
    (p1, """<p>把隔膜冲成比垫片大一圈的圆片（例如垫片 16 mm、隔膜 19 mm），干燥后放进手套箱。<span class="src gen">通用方法</span></p>
          <ul><li>隔膜比垫片大，两片垫片的边缘才不会碰到一起。</li>
          <li>PP 不耐高温，干燥温度按课题组规程，常用 60 °C 左右真空干燥。</li>
          <li>用镊子拿，不要用手直接碰，手上的油脂会影响浸润。薄膜容易带静电，可以用防静电镊子或离子风扇。</li></ul>"""),
    (p2, """<p>PP 隔膜很薄（常见 20–25 µm），把几层叠在一起量，再除以层数，得到单层厚度 L<sub>1</sub>。<span class="src gen">通用方法</span></p>
          <ul><li>说明书上的厚度可以先用，但最好自己复核。</li></ul>"""),
    (p3, """<p>组装：正极壳 → 不锈钢垫片 → PP 隔膜 → 滴加电解液 → 不锈钢垫片 → 弹片和负极盖 → 封口。<span class="src gen">通用方法</span></p>
          <ul><li>电解液要足够把整片隔膜浸透，常用几十 µL；同一批电池用同样的量。</li>
          <li>隔膜放平、居中，不要有褶皱或气泡。</li></ul>"""),
    (p4, """<p>封口后静置几小时（常见做法是过夜）再测。PP 是疏水的，电解液浸润需要时间。<span class="src gen">通用方法</span></p>
          <ul><li>浸透的隔膜由白色变成半透明，可以拆一个试做的电池看一下。</li>
          <li>也可以隔一段时间测一次 EIS，高频截距不再变化后再取值。</li>
          <li>离子液体、水系或高浓度电解液可能浸不透 PP，测到的电阻会偏大；这时改用玻璃纤维等容易浸润的隔膜。</li></ul>"""),
    (p5, """<p>多层法：分别组装 1、2、3、4 层隔膜的电池，测各自的高频截距 R，对层数 n 作直线。斜率是每层隔膜的电阻，截距是壳体和接触电阻。<span class="src gen">通用方法</span></p>
          <ul><li>这样不需要空白池，接触电阻自动扣除。</li>
          <li>每个层数最好装 2 个以上电池取平均。</li></ul>"""),
    (p6, """<p>用斜率算有效电导率 σ<sub>eff</sub>。知道电解液本身的电导率 σ<sub>0</sub> 时，还可以算 MacMullin 数 N<sub>M</sub> = σ<sub>0</sub> / σ<sub>eff</sub>，它表示隔膜（孔隙率、曲折度）让电阻变大了多少倍。<span class="src gen">通用方法</span></p>
          <ul><li>σ<sub>eff</sub> 是“隔膜 + 电解液”的有效值，不等于电解液本身的电导率。</li>
          <li>下面的计算器可以直接算。</li></ul>"""),
]


PP_FIGS = {'pp-identify': pp_identify, 'pp-ring': pp_ring}


def build_pp():
    s = PAGE.read_text(encoding='utf-8')
    items = [f"""        <li><div class="step"><div class="step-text">{text}</div>
          <figure class="stepfig">{fn()}</figure></div></li>""" for fn, text in PP_STEPS]
    block = '<!--PPSTEPS-->\n      <ol class="steps">\n' + '\n'.join(items) + '\n      </ol>\n      <!--/PPSTEPS-->'
    s = re.sub(r'<!--PPSTEPS-->.*?<!--/PPSTEPS-->', lambda m: block, s, flags=re.S)
    for k, fn in PP_FIGS.items():
        s = re.sub(rf'<!--FIG:{k}-->.*?<!--/FIG:{k}-->', lambda m: f'<!--FIG:{k}-->{fn()}<!--/FIG:{k}-->', s, flags=re.S)
    PAGE.write_text(s, encoding='utf-8')
    print('pp section written:', len(items), 'steps +', len(PP_FIGS), 'figures')



# ================================================================ making films that fit
def wavy(x1, x2, y, amp=4, step=8):
    d = f'M{x1} {y}'
    x, up = x1, True
    while x + step <= x2:
        d += f' q{step / 2} {-amp if up else amp} {step} 0'
        x += step
        up = not up
    return d


def m1():
    o = [T(70, 26, '夹层池', 12, 'middle', 700), T(200, 26, '纽扣电池', 12, 'middle', 700), T(330, 26, 'PP 环', 12, 'middle', 700),
         C(70, 90, 44, 'ptfe'), C(70, 90, 22, 'sample'),
         C(200, 90, 50, 'steel'), C(200, 90, 46, 'sample'), C(200, 90, 38, 'hidden-edge'),
         C(330, 90, 44, 'film-clear'), C(330, 90, 26, 'sample'),
         T(70, 156, '填满垫片的孔', 11, 'middle', 700), T(70, 172, '厚度 = 垫片厚度', 9.5, 'middle', None, 't-mut'),
         T(200, 156, '膜 Ø18–19 mm', 11, 'middle', 700), T(200, 172, '虚线：垫片 Ø16 mm', 9.5, 'middle', None, 't-mut'),
         T(330, 156, '填满环的孔', 11, 'middle', 700), T(330, 172, '刮平到和环齐平', 9.5, 'middle', None, 't-mut'),
         R(14, 186, 372, 28, 'sunk-r', 8), T(200, 204.5, '先按电池定尺寸，再决定怎么做膜', 11, 'middle', 700)]
    return svg('先定目标尺寸：夹层池填满 PTFE 垫片的孔，厚度等于垫片厚度；纽扣电池用 18 到 19 毫米的圆片，比 16 毫米垫片大一圈；PP 环填满孔并刮平。', ''.join(o))


def m2():
    rows = [('能溶于溶剂', '溶液浇铸', '最常用；要彻底干燥'),
            ('加热能熔融或软化', '热压（无溶剂）', '厚度由垫片决定'),
            ('液态前驱体，可固化', '在孔里原位固化', '尺寸和接触最好'),
            ('很软、很粘', '直接填孔或熔融填充', '不用冲片')]
    o = []
    for i, (a, b, c) in enumerate(rows):
        y0 = 8 + i * 52
        o += [R(10, y0, 170, 44, 'sunk-r', 6), T(95, y0 + 26.5, a, 11.5, 'middle', 700),
              f'<line x1="184" y1="{y0 + 22}" x2="198" y2="{y0 + 22}" class="dim"/>', P(f'M206 {y0 + 22} L197 {y0 + 17} L197 {y0 + 27} Z', 'arr'),
              R(212, y0, 180, 44, 'menu-hi', 6), T(222, y0 + 19, b, 11.5, None, 700, 't-acc'), T(222, y0 + 35, c, 9.5, None, None, 't-mut')]
    return svg('按材料状态选制膜方法：能溶于溶剂用溶液浇铸；加热能熔融或软化用无溶剂热压；液态前驱体在孔里原位固化；很软很粘的材料直接填孔或熔融填充。', ''.join(o))


def m3():
    o = [T(18, 40, '按目标厚度算好溶液用量', 11, None, 700), T(18, 58, '（见下面的计算器）', 9.5, None, None, 't-mut'),
         P('M18 100 H28 L34 128 H186 L192 100 H202 L196 140 H24 Z', 'dish'),
         P('M30.6 112 H189.4 L186 128 H34 Z', 'sol'),
         R(12, 90, 170, 5, 'glassc', 1),
         P('M190 94 q-5 -5 0 -10 q5 -5 0 -10 q-5 -5 0 -10', 'evap'), P('M190 62 l-3.5 7 h7 Z', 'arr'),
         P('M200 94 q-5 -5 0 -10 q5 -5 0 -10', 'evap'), P('M200 72 l-3.5 7 h7 Z', 'arr'),
         T(110, 160, 'PTFE 培养皿，放水平', 11, 'middle', 700),
         T(110, 178, '盖子留缝，让溶剂慢慢挥发', 10, 'middle', None, 't-mut'),
         T(110, 195, '挥发太快会起泡、厚薄不均', 10, 'middle', None, 't-mut'),
         R(226, 16, 166, 190, 'sunk-r', 8),
         T(309, 46, ms([('t = m / (ρ · A)', False)], 15), 15, 'middle', 700),
         T(238, 72, 'm：溶质（聚合物 + 盐）质量', 9.5, None, None, 't-mut'),
         T(238, 90, 'ρ：膜的密度', 9.5, None, None, 't-mut'),
         T(238, 108, 'A：培养皿的底面积', 9.5, None, None, 't-mut'),
         '<line x1="238" y1="122" x2="380" y2="122" class="grid"/>',
         T(309, 146, '真空干燥到恒重', 11.5, 'middle', 700, 't-warn'),
         T(309, 168, '残留溶剂和水分', 10, 'middle', None, 't-mut'),
         T(309, 184, '会让电导率虚高', 10, 'middle', None, 't-mut')]
    return svg('溶液浇铸：按目标厚度算好溶液用量，倒进放水平的 PTFE 培养皿，盖子留缝让溶剂慢慢挥发；厚度 t 等于溶质质量除以密度乘面积；真空干燥到恒重，残留溶剂和水分会让电导率虚高。', ''.join(o))


def m4():
    o = [f'<line x1="80" y1="6" x2="80" y2="26" class="dim"/>', P('M80 32 L75 23 L85 23 Z', 'arr'),
         f'<line x1="200" y1="6" x2="200" y2="26" class="dim"/>', P('M200 32 L195 23 L205 23 Z', 'arr'),
         R(30, 34, 220, 24, 'platen', 3), P(wavy(44, 236, 46), 'heat'),
         T(256, 50, '加热压板', 10, None, 600),
         R(50, 92, 180, 4, 'liner'), R(96, 96, 88, 16, 'sample'),
         R(54, 96, 30, 16, 'steel', 1), R(196, 96, 30, 16, 'steel', 1),
         R(50, 112, 180, 4, 'liner'),
         R(30, 118, 220, 24, 'platen', 3), P(wavy(44, 236, 130), 'heat'),
         T(69, 88, '垫片', 9.5, 'middle', 600), T(211, 88, '垫片', 9.5, 'middle', 600), T(140, 108, '电解质', 9.5, 'middle', 700),
         T(46, 104, '离型膜', 9, 'end', None, 't-mut'),
         R(266, 70, 124, 64, 'warnbox', 6),
         T(328, 92, '温度按材料定', 10.5, 'middle', 700), T(328, 110, '不超过分解温度', 9.5, 'middle', None, 't-mut'),
         T(328, 125, '小心烫伤', 9.5, 'middle', None, 't-mut'),
         T(140, 168, '两侧垫片的厚度 = 膜厚', 11.5, 'middle', 700),
         T(140, 186, '上下垫离型膜，防止粘住', 10, 'middle', None, 't-mut'),
         T(140, 202, '在压力下冷却后再取出', 10, 'middle', None, 't-mut')]
    return svg('无溶剂热压：电解质放在两张离型膜之间，两侧放已知厚度的垫片，用加热压板压平，垫片厚度就是膜厚；在压力下冷却后取出；温度按材料定，不超过分解温度，小心烫伤。', ''.join(o))


def m5():
    o = [R(156, 6, 24, 18, 'steel', 3), R(144, 24, 48, 44, 'steel', 4), P('M144 68 H192 L190 76 H146 Z', 'steel'),
         f'<line x1="146" y1="76" x2="146" y2="100" class="ext"/>', f'<line x1="190" y1="76" x2="190" y2="100" class="ext"/>',
         R(40, 92, 256, 3, 'liner'), R(40, 95, 256, 10, 'sample'), R(40, 105, 256, 3, 'liner'),
         R(146, 92, 44, 16, 'cutmark'),
         R(30, 108, 276, 34, 'coldblock', 4), T(168, 130, '预冷的金属块', 10.5, 'middle', 600, 't-onlight'),
         T(206, 36, '连同上下离型膜一起冲', 11, None, 700), T(206, 54, '先冷却变硬，边缘才整齐', 10, None, None, 't-mut'),
         T(168, 170, '用冲刀，不用剪刀：边缘不变形', 11, 'middle', 700),
         T(168, 188, '不要拉扯膜，会被拉薄', 10, 'middle', None, 't-mut'),
         T(168, 204, '冲完复测直径：软的膜会回缩', 10, 'middle', None, 't-mut')]
    return svg('冲片：膜连同上下离型膜放在预冷的金属块上，用冲刀冲出圆片；先冷却变硬边缘才整齐；用冲刀不用剪刀，不要拉扯膜，冲完复测直径。', ''.join(o))


def m6():
    o = [T(20, 30, '每片称重', 12, None, 700), T(20, 48, '用质量估算平均厚度', 10, None, None, 't-mut'),
         '<ellipse cx="115" cy="112" rx="34" ry="6" class="sample"/>',
         P('M52 120 H178', 'pan'), R(110, 122, 10, 18, 'steel'),
         R(20, 140, 190, 46, 'panel', 8), R(60, 150, 110, 24, 'lcd', 3), T(115, 167, '36.0 mg', 13, 'middle', 700, 'lcd-ink tm'),
         T(115, 206, '和千分尺读数对照', 10.5, 'middle', 600),
         R(222, 16, 170, 190, 'sunk-r', 8),
         T(307, 46, 't = m / (ρ · A)', 15, 'middle', 700),
         T(307, 72, '= 0.036 g ÷ (1.25 g/cm³', 9.5, 'middle', None, 'tm'),
         T(307, 88, '× 2.84 cm²)', 9.5, 'middle', None, 'tm'),
         T(307, 116, '≈ 102 µm', 16, 'middle', 700, 't-acc'),
         T(307, 142, '不用碰膜就知道平均厚度', 9.5, 'middle', None, 't-mut'),
         T(307, 158, '适合一压就变形的软膜', 9.5, 'middle', None, 't-mut'),
         T(307, 190, '示例：Ø19 mm，ρ = 1.25 g/cm³', 9, 'middle', 600, 't-warn')]
    return svg('称重估厚度：圆片称得 36.0 毫克，直径 19 毫米、密度 1.25 克每立方厘米时，平均厚度约 102 微米；不用碰膜就能知道平均厚度，和千分尺读数对照。', ''.join(o))


def m7():
    o = [T(20, 28, '带着离型膜一起转移', 12, None, 700), T(20, 46, '放平、居中后再揭膜', 10, None, None, 't-mut'),
         R(30, 150, 190, 12, 'steel', 2), R(46, 140, 158, 10, 'sample', 2),
         P('M46 139 H140 Q160 139 214 100', 'liner-out'), P('M46 139 H140 Q160 139 214 100', 'liner-line'),
         f'<line x1="212" y1="100" x2="300" y2="52" class="tweezer"/>', f'<line x1="219" y1="105" x2="306" y2="58" class="tweezer"/>',
         C(214, 102, 5, 'ptfe'),
         P('M150 120 Q168 100 192 94', 'turn'), P('M198 92 L189 90 L192 98 Z', 'arr'),
         T(262, 120, '低角度、慢慢揭', 11.5, None, 700),
         T(262, 140, '粘住揭不下来：', 10, None, None, 't-mut'),
         T(262, 156, '先冷却，或换离型膜', 10, None, None, 't-mut'),
         T(262, 180, '用 PTFE 头的镊子', 10, None, None, 't-mut'),
         T(125, 184, '不锈钢垫片', 10, 'middle', None, 't-mut'),
         T(125, 204, '在手套箱里操作', 10.5, 'middle', 600)]
    return svg('转移：带着离型膜把膜放到不锈钢垫片上，放平居中后，用 PTFE 头镊子以低角度慢慢揭掉离型膜；粘住时先冷却或换离型膜；在手套箱里操作。', ''.join(o))


def m8():
    o = [R(20, 150, 170, 10, 'steel', 2), R(20, 136, 55, 14, 'film-clear'), R(135, 136, 55, 14, 'film-clear'),
         R(75, 138, 60, 12, 'sol'),
         R(97, 36, 16, 52, 'pipette', 3), P('M98 88 L112 88 L106 116 L104 116 Z', 'pipette'),
         P('M105 120 q4 6 0 9 q-4 -3 0 -9 Z', 'droplet'),
         T(102, 186, '① 前驱体填满孔', 11, 'middle', 700), T(102, 203, '刮平，和环齐平', 10, 'middle', None, 't-mut'),
         R(215, 150, 170, 10, 'steel', 2), R(215, 136, 55, 14, 'film-clear'), R(330, 136, 55, 14, 'film-clear'),
         R(270, 136, 60, 14, 'sample'),
         R(250, 30, 100, 26, 'panel', 4), T(300, 47.5, 'UV / 加热', 10.5, 'middle', 700, 't-panel')]
    for x in (272, 286, 300, 314, 328):
        o.append(f'<line x1="{x}" y1="60" x2="{x}" y2="130" class="ray"/>')
    o += [T(300, 186, '② 固化', 11, 'middle', 700), T(300, 203, '再盖上垫片、封口', 10, 'middle', None, 't-mut'),
          f'<line x1="200" y1="20" x2="200" y2="210" class="grid"/>']
    return svg('原位固化：先把液态前驱体滴进放在不锈钢垫片上的环形垫片孔里，刮平到和环齐平；再用紫外光或加热固化，然后盖上垫片、封口。', ''.join(o))


MK_STEPS = [
    (m1, """<p>先按要用的电池定好膜的尺寸，再决定怎么做膜。<span class="src gen">通用方法</span></p>
          <ul><li>夹层池：填满 PTFE 垫片的孔，厚度等于垫片厚度。</li>
          <li>纽扣电池：圆片比不锈钢垫片大一圈（例如垫片 16 mm、膜 18–19 mm），但不能大到压住密封圈，否则封不严。</li>
          <li>PP 环：填满环的孔，刮平到和环齐平（第 10 节）。</li>
          <li>厚度：测电导率时厚一点（例如 100–300 µm），R<sub>b</sub> 更大、更好测。纽扣电池里膜太厚时，减少不锈钢垫片的厚度或数量，保证封口后弹片还有压缩量。</li></ul>"""),
    (m2, """<p>按材料的状态选制膜方法。<span class="src gen">通用方法</span></p>
          <ul><li>溶液浇铸最常用，但要把溶剂彻底除干净。</li>
          <li>热压不用溶剂，厚度由垫片决定，适合能熔融或软化的体系，例如 PEO 类。</li>
          <li>液态前驱体（例如可 UV 或热固化的凝胶）直接在孔里固化，尺寸和接触都最好。</li>
          <li>很软很粘、难以冲片的材料，直接填孔或熔融填充最省事。</li></ul>"""),
    (m3, """<p>溶液浇铸：按目标厚度算好溶液用量，倒进放水平的 PTFE 培养皿，盖子留缝让溶剂慢慢挥发，然后真空干燥到恒重。<span class="src gen">通用方法</span></p>
          <ul><li>厚度 ≈ 溶质质量 ÷ (密度 × 培养皿面积)，可以用下面的计算器估算。</li>
          <li>挥发太快会起泡、边缘厚中间薄；冲片时取中间均匀的部分。</li>
          <li>残留溶剂和水分会让电导率虚高。干燥条件按课题组规程，一直干到质量不再变化；需要时用热重分析 (TGA) 确认。</li>
          <li>溶剂（例如乙腈）在通风橱里操作。</li></ul>"""),
    (m4, """<p>热压：把材料放在两张离型膜之间，两侧放已知厚度的垫片，加热到软化或熔化温度以上压平，在压力下冷却后再取出。<span class="src gen">通用方法</span></p>
          <ul><li>垫片厚度决定膜厚，思路和第 10 节的 PP 环一样。</li>
          <li>温度按材料定，不要超过聚合物和锂盐的分解温度；小心烫伤。</li></ul>"""),
    (m5, """<p>冲片：连同上下离型膜一起冲；很粘的膜先在预冷的金属块上冷却变硬，边缘才整齐。<span class="src gen">通用方法</span></p>
          <ul><li>用冲刀，不用剪刀：剪刀会让边缘变形、局部变薄。</li>
          <li>冲的时候不要拉扯膜；刀口粘了电解质，用溶剂擦净再冲下一片。</li>
          <li>冲完复测直径，软的膜会回缩。</li></ul>"""),
    (m6, """<p>每片称重，用质量估算平均厚度，再和千分尺的读数对照。<span class="src gen">通用方法</span></p>
          <ul><li>t = m / (ρ · A)：不用碰膜就能知道平均厚度，适合一压就变形的软膜。</li>
          <li>密度 ρ 按配方估算，或者用一块已知尺寸、已知厚度的膜标定。</li></ul>"""),
    (m7, """<p>转移：带着离型膜一起拿，放到不锈钢垫片上，放平居中后再以低角度慢慢揭掉离型膜。<span class="src gen">通用方法</span></p>
          <ul><li>膜粘在离型膜上揭不下来时，先冷却；或者换一种离型膜，例如 PTFE 片或硅油处理过的 PET 膜。</li>
          <li>用 PTFE 头的镊子，避免金属镊子划伤或粘住膜。</li>
          <li>制好的膜存放在手套箱里，装电池也在手套箱里进行，避免吸水。</li></ul>"""),
    (m8, """<p>原位固化（适合液态前驱体）：把前驱体滴进放在不锈钢垫片上的 PP 或 PTFE 环形垫片孔里，刮平后用 UV 或加热固化，再盖上垫片、封口。<span class="src gen">通用方法</span></p>
          <ul><li>UV 透不过不锈钢，要在敞开状态下先固化，再盖上面的垫片；热固化可以封口后进行。</li>
          <li>固化要完全：残留的未反应单体会影响电导率和稳定性。</li>
          <li>这样得到的膜和孔的尺寸完全一致，和电极的接触也最好。</li>
          <li>使用 UV 灯时戴防护眼镜。</li>
          <li>含 UV 交联基团或要加增塑剂时，详细做法见下面的小节。</li></ul>"""),
]


def build_mk():
    s = PAGE.read_text(encoding='utf-8')
    items = [f"""        <li><div class="step"><div class="step-text">{text}</div>
          <figure class="stepfig">{fn()}</figure></div></li>""" for fn, text in MK_STEPS]
    block = '<!--MKSTEPS-->\n      <ol class="steps">\n' + '\n'.join(items) + '\n      </ol>\n      <!--/MKSTEPS-->'
    s = re.sub(r'<!--MKSTEPS-->.*?<!--/MKSTEPS-->', lambda m: block, s, flags=re.S)
    PAGE.write_text(s, encoding='utf-8')
    print('film-making steps written:', len(items))



# ================================================================ UV-crosslinkable electrolytes with plasticizers
def bottle(cx, y, fill, label1, label2):
    return (R(cx - 16, y + 10, 32, 34, 'bottle2', 4) + R(cx - 9, y, 18, 10, 'steel', 2) +
            R(cx - 13, y + 24, 26, 17, fill, 2) +
            T(cx, y + 60, label1, 10.5, 'middle', 700) + T(cx, y + 75, label2, 9.5, 'middle', None, 't-mut'))


def u1():
    o = [bottle(55, 12, 'sol', '可交联', '单体或低聚物'), bottle(145, 12, 'li', '锂盐', '先干燥'),
         bottle(235, 12, 'plast', '增塑剂', '先干燥'), bottle(325, 12, 'amber', '光引发剂', '避光')]
    for x in (55, 145, 235, 325):
        o += [f'<line x1="{x}" y1="94" x2="{200 + (x - 190) * .12:.0f}" y2="112" class="dim"/>']
    o += [R(180, 106, 40, 12, 'steel', 3), R(176, 118, 48, 56, 'amber', 6), R(190, 160, 20, 5, 'ptfe', 2),
          R(140, 176, 120, 24, 'panel', 5), T(200, 192, '搅拌', 10, 'middle', 600, 't-panel'),
          T(18, 136, '手套箱里配', 10.5, None, 700), T(18, 152, '避光：棕色瓶或包锡纸', 9.5, None, None, 't-mut'),
          T(18, 168, '搅拌到完全溶解', 9.5, None, None, 't-mut'),
          T(272, 136, '加热要温和', 10.5, None, 700), T(272, 152, '避免提前交联', 9.5, None, None, 't-mut'),
          T(272, 168, '每个组分都记下质量', 9.5, None, None, 't-mut'),
          T(200, 214, '光引发剂的吸收波长要和 UV 灯匹配', 10, 'middle', 600)]
    return svg('配前驱体：可交联单体或低聚物、干燥过的锂盐和增塑剂、光引发剂，在手套箱里装进避光的棕色瓶搅拌到完全溶解；加热要温和，避免提前交联；光引发剂的吸收波长要和 UV 灯匹配。', ''.join(o))


def u2():
    def box(x, y, a, b, cls):
        return R(x, y, 112, 44, cls, 6) + T(x + 56, y + 19, a, 10.5, 'middle', 700) + T(x + 56, y + 35, b, 9.5, 'middle', None, 't-mut')

    def arrow(x, y):
        return f'<line x1="{x}" y1="{y}" x2="{x + 12}" y2="{y}" class="dim"/>' + P(f'M{x + 19} {y} L{x + 11} {y - 4.5} L{x + 11} {y + 4.5} Z', 'arr')
    o = [T(12, 22, '溶剂浇铸路线', 11.5, None, 700),
         box(10, 30, '聚合物 + 盐', '+ 溶剂', 'sunk-r'), arrow(126, 52),
         box(148, 30, '浇铸', '真空干燥到恒重', 'sunk-r'), arrow(264, 52),
         box(286, 30, '再加增塑剂', '在手套箱里，称重', 'menu-hi'),
         T(12, 104, '无溶剂 UV 路线', 11.5, None, 700),
         box(10, 112, '全部液态组分', '混合均匀', 'sunk-r'), arrow(126, 134),
         box(148, 112, '直接 UV 固化', '填孔或夹层成膜', 'menu-hi'), arrow(264, 134),
         box(286, 112, '不用干燥', '增塑剂不会损失', 'okbox'),
         R(10, 172, 388, 40, 'warnbox', 6),
         T(204, 189, '加了增塑剂之后，不要再长时间真空干燥', 11, 'middle', 700),
         T(204, 205, 'DMC、DEC 等挥发太快，不适合做增塑剂', 9.5, 'middle', None, 't-mut')]
    return svg('增塑剂什么时候加：溶剂浇铸路线先浇铸并真空干燥到恒重，再在手套箱里加增塑剂并称重；无溶剂 UV 路线把全部液态组分混合后直接固化，不用干燥，增塑剂不会损失；加了增塑剂后不要再长时间真空干燥。', ''.join(o))


def u3():
    o = [R(40, 56, 60, 96, 'vial', 8), R(44, 86, 52, 62, 'sol', 4),
         C(58, 104, 4, 'bubble'), C(78, 118, 5, 'bubble'), C(66, 132, 3, 'bubble'), C(86, 98, 3, 'bubble'), C(54, 124, 2.5, 'bubble'),
         R(160, 56, 60, 96, 'vial', 8), R(164, 86, 52, 62, 'sol', 4),
         '<line x1="108" y1="110" x2="144" y2="110" class="dim"/>', P('M152 110 L143 105 L143 115 Z', 'arr'),
         T(130, 98, '除泡', 10, 'middle', 600),
         T(70, 172, '有气泡', 11, 'middle', 700, 't-bad'), T(190, 172, '无气泡', 11, 'middle', 700, 't-acc'),
         T(70, 190, '固化后变成孔洞', 9.5, 'middle', None, 't-mut'), T(190, 190, '再填孔、固化', 9.5, 'middle', None, 't-mut'),
         T(252, 52, '静置，或离心', 11, None, 700),
         T(252, 82, '抽真空要短、温和', 11, None, 700),
         T(252, 100, '挥发性增塑剂会被', 9.5, None, None, 't-mut'), T(252, 115, '一起抽走', 9.5, None, None, 't-mut'),
         T(252, 145, '抽前抽后称重', 11, None, 700),
         T(252, 163, '质量下降 = 有损失', 9.5, None, None, 't-mut')]
    return svg('除气泡：前驱体里的气泡固化后会变成孔洞；静置或离心除泡，抽真空要短而温和，因为挥发性增塑剂会被一起抽走，抽前抽后称重。', ''.join(o))


def u4():
    o = [T(14, 24, '在手套箱里固化', 11, None, 700),
         R(110, 22, 100, 26, 'panel', 4), T(160, 39.5, 'UV 365 nm', 10, 'middle', 700, 't-panel')]
    for x in (122, 138, 154, 170, 186, 198):
        o.append(f'<line x1="{x}" y1="52" x2="{x}" y2="132" class="ray"/>')
    o += ['<line x1="60" y1="106" x2="60" y2="124" class="dim"/>', P('M60 131 L55 122 L65 122 Z', 'arr'),
          '<line x1="260" y1="106" x2="260" y2="124" class="dim"/>', P('M260 131 L255 122 L265 122 Z', 'arr'),
          T(60, 100, '压平', 9.5, 'middle', 600), T(260, 100, '压平', 9.5, 'middle', 600),
          R(40, 160, 240, 12, 'steel', 2), R(40, 144, 70, 16, 'film-clear'), R(210, 144, 70, 16, 'film-clear'),
          R(110, 144, 100, 16, 'sol'),
          '<ellipse cx="34" cy="146" rx="7" ry="4" class="sol"/>', '<ellipse cx="286" cy="146" rx="7" ry="4" class="sol"/>',
          R(30, 136, 260, 8, 'glassc', 1),
          T(298, 132, '透 UV 的盖片', 10.5, None, 700), T(298, 148, '石英片或 PET 膜', 9.5, None, None, 't-mut'),
          T(298, 164, '隔绝氧气、压平', 9.5, None, None, 't-mut'),
          T(160, 194, '稍微多填，盖片压在环上，多余的挤出', 10.5, 'middle', 700),
          T(160, 211, '透过盖片固化，然后揭盖片、盖垫片', 9.5, 'middle', None, 't-mut')]
    return svg('填孔、加盖片、固化：前驱体稍微多填进环形垫片的孔，盖上透紫外的石英片或 PET 膜压在环上，多余的挤出；在手套箱里透过盖片用 365 纳米紫外固化，然后揭掉盖片、盖上垫片。', ''.join(o))


def u5():
    o = []
    panels = [('ok', '整片固化', '表面不粘', '可以测'), ('tacky', '表面发粘', '氧阻聚或剂量不够', '加盖片、延长照射'),
              ('shrink', '边缘有缝', '固化收缩', '补填一层再固化')]
    for i, (kind, a, b, c) in enumerate(panels):
        x0 = 14 + i * 128
        o += [R(x0, 64, 30, 14, 'film-clear'), R(x0 + 90, 64, 30, 14, 'film-clear'), R(x0, 78, 120, 8, 'steel', 1.5)]
        if kind == 'ok':
            o += [R(x0 + 30, 64, 60, 14, 'sample'), ok(x0 + 14, 112), T(x0 + 28, 116.5, a, 11, None, 700, None)]
        elif kind == 'tacky':
            o += [R(x0 + 30, 67, 60, 11, 'sample'), P(wavy(x0 + 30, x0 + 90, 67, 2.5, 6), 'tacky'),
                  C(x0 + 44, 60, 2.5, 'droplet'), C(x0 + 70, 58, 2, 'droplet'),
                  bad(x0 + 14, 112), T(x0 + 28, 116.5, a, 11, None, 700, 't-bad')]
        else:
            o += [R(x0 + 36, 68, 48, 10, 'sample'), bad(x0 + 14, 112), T(x0 + 28, 116.5, a, 11, None, 700, 't-bad')]
        o += [T(x0 + 60, 136, b, 9.5, 'middle', None, 't-mut'), T(x0 + 60, 152, c, 9.5, 'middle', 600)]
    o += [T(200, 32, '揭开盖片检查', 12, 'middle', 700),
          R(14, 170, 372, 42, 'sunk-r', 8),
          T(26, 187, '底部发粘：层太厚，或配方吸光太强', 10.5, None, 700),
          T(26, 203, '定量：FTIR 看 C=C 峰（约 1635 cm⁻¹）是否消失', 9.5, None, None, 't-mut')]
    return svg('检查固化：整片固化、表面不粘可以测；表面发粘是氧阻聚或剂量不够，加盖片或延长照射；边缘有缝是固化收缩，补填一层再固化；底部发粘说明层太厚或吸光太强；可用红外看 1635 波数的碳碳双键峰是否消失。', ''.join(o))


def u6():
    o = [P('M30 30 V150 H230', 'axis'), T(26, 30, 'σ', 11, 'end', 600, 't-mut'), T(230, 166, '时间', 10, 'end', None, 't-mut'),
         P('M36 72 C 80 66, 120 64, 220 64', 'curve'),
         P('M36 72 C 80 80, 140 104, 220 120', 'curve-warn'),
         T(220, 56, '稳定', 10.5, 'end', 700, 't-acc'), T(220, 140, '一直下降', 10.5, 'end', 700, 't-warn'),
         T(30, 180, '恒温下隔一段时间测一次 σ', 10.5, None, 700),
         T(30, 197, '一直下降：增塑剂在挥发或渗出', 9.5, None, None, 't-mut'),
         T(30, 212, '检查密封，或换挥发慢的增塑剂', 9.5, None, None, 't-mut'),
         R(250, 20, 140, 192, 'sunk-r', 8),
         T(262, 44, '测前测后称重', 11, None, 700), T(262, 62, '质量下降 → 有损失', 9.5, None, None, 't-mut'),
         T(262, 94, '拆开看表面', 11, None, 700), T(262, 112, '湿、油亮 → 渗出了', 9.5, None, None, 't-mut'),
         T(262, 144, '报告时写明', 11, None, 700), T(262, 162, '增塑剂种类和 wt%', 9.5, None, None, 't-mut'),
         T(262, 178, '测前测后的质量变化', 9.5, None, None, 't-mut')]
    return svg('测量时监控增塑剂：恒温下隔一段时间测一次电导率，稳定才可信，一直下降说明增塑剂在挥发或渗出；测前测后称重，拆开看表面是否湿、油亮；报告时写明增塑剂种类、含量和质量变化。', ''.join(o))


UV_STEPS = [
    (u1, """<p>配前驱体：可交联的单体或低聚物、锂盐、增塑剂、光引发剂，在手套箱里避光混合，搅拌到完全溶解。<span class="src gen">通用方法</span></p>
          <ul><li>锂盐和增塑剂先干燥。很多增塑剂容易吸水，可以用活化的分子筛除水。</li>
          <li>光引发剂的吸收波长要和 UV 灯匹配（例如 365 nm 灯）。用量常见约 0.5–2 wt%（相对可交联组分），以配方文献为准。</li>
          <li>需要加热帮助溶解时要温和，避免提前交联。配好后避光保存，尽快用完。</li>
          <li>每个组分称量后记下质量，可以用下面的配方计算器核对 wt%。</li></ul>"""),
    (u2, """<p>先想清楚增塑剂什么时候加：加了增塑剂之后，就不能再长时间真空干燥。<span class="src gen">通用方法</span></p>
          <ul><li><strong>溶剂浇铸路线</strong>：先把聚合物和锂盐浇铸、真空干燥到恒重，再在手套箱里加增塑剂（滴加或浸泡），称重确定实际含量。</li>
          <li><strong>无溶剂 UV 路线</strong>：所有组分本来就是液态混合物，直接填孔或成膜固化，不需要干燥，增塑剂含量就是配方值。这条路线最适合含增塑剂的体系。</li>
          <li>DMC、DEC 这类低沸点溶剂挥发很快，不适合当增塑剂来测电导率。EC、PC、丁二腈 (SN)、甘醇二甲醚类和离子液体挥发慢，但长时间真空加热也会损失。</li></ul>"""),
    (u3, """<p>除气泡：静置或离心；必须抽真空时，时间要短、温和。<span class="src gen">通用方法</span></p>
          <ul><li>气泡固化后会变成孔洞，A 和 L 都会不准。</li>
          <li>抽真空会把挥发性增塑剂一起抽走，所以抽前抽后都要称重。</li></ul>"""),
    (u4, """<p>填孔、加盖片、固化：前驱体稍微多填一点，盖上透 UV 的盖片压在环上，让多余的挤出来，再透过盖片照射固化。<span class="src gen">通用方法</span></p>
          <ul><li>丙烯酸酯类的自由基聚合会被氧气抑制，表面会发粘。在手套箱的惰性气氛里固化，盖片也能隔绝氧气。</li>
          <li>盖片用石英片，或者在灯的波长下透光的膜（例如 365 nm 下可用 PET 膜，用前确认透光）。PTFE 片透光差，不适合。</li>
          <li>固化后揭掉盖片，修掉环外多余的部分，再盖上面的垫片、封口。</li>
          <li>要做独立的膜时：把前驱体夹在两片盖片之间、两侧放垫片，固化后再冲片。</li>
          <li>记下灯的波长、功率、距离和照射时间，每批用同样的剂量。UV 灯会发热，照得太久增塑剂也会挥发。</li>
          <li>戴防 UV 护目镜和手套：丙烯酸酯单体容易引起皮肤过敏。</li></ul>"""),
    (u5, """<p>检查固化：揭开盖片后，表面应该不粘、整片固化，和环齐平。<span class="src gen">通用方法</span></p>
          <ul><li>表面发粘：氧阻聚或剂量不够。在惰性气氛中固化、加盖片，或延长照射。</li>
          <li>底部发粘：层太厚或配方吸光太强（锂盐、填料都会吸光）。减薄，或分层固化。</li>
          <li>边缘有缝：固化收缩。补填一层再固化，或改用收缩小的低聚物。</li>
          <li>需要定量时，用红外光谱 (FTIR) 看丙烯酸酯 C=C 峰（约 1635 cm⁻¹ 和 810 cm⁻¹）是否消失；或测凝胶含量，也就是溶剂浸泡后不溶部分的质量比例（增塑剂和锂盐也会被溶出，要扣除）。</li></ul>"""),
    (u6, """<p>测量时监控增塑剂：恒温下隔一段时间测一次，σ 应该稳定；测前测后都称重。<span class="src gen">通用方法</span></p>
          <ul><li>σ 一直下降：增塑剂在挥发或被挤出。检查密封，或换挥发更慢的增塑剂。</li>
          <li>拆开后表面湿、油亮：增塑剂渗出了，可能流到环和垫片之间，使 A 和 L 不准。</li>
          <li>报告电导率时写明增塑剂的种类和 wt%，以及测前测后的质量变化。</li></ul>"""),
]


def build_uv():
    s = PAGE.read_text(encoding='utf-8')
    items = [f"""        <li><div class="step"><div class="step-text">{text}</div>
          <figure class="stepfig">{fn()}</figure></div></li>""" for fn, text in UV_STEPS]
    block = '<!--UVSTEPS-->\n      <ol class="steps">\n' + '\n'.join(items) + '\n      </ol>\n      <!--/UVSTEPS-->'
    s = re.sub(r'<!--UVSTEPS-->.*?<!--/UVSTEPS-->', lambda m: block, s, flags=re.S)
    PAGE.write_text(s, encoding='utf-8')
    print('UV / plasticizer steps written:', len(items))


if __name__ == '__main__':
    build()
    fill_figs()
    build_after()
    build_pp()
    build_mk()
    build_uv()
