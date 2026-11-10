"""Generate the Reference 620 guide SVG figures and inline them into the HTML page.

Each SVG is self-contained: colours use the page's CSS tokens with light-theme
fallbacks (style="fill:var(--token,#hex)"), so a figure follows the page theme
when inlined and still renders on its own as a standalone file.

Run from anywhere:  python3 gamry-ref620-svg/build_svgs.py
It rewrites the .svg files next to this script and replaces each
<!--SVG:name-->...<!--/SVG--> block in gamry-reference-620-guide.html.
"""
import html
import os
import re
import sys

REPO = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, 'gamry-ref620-svg')
PAGE = os.path.join(REPO, 'gamry-reference-620-guide.html')

C = {
    'bg': 'var(--surface,#FFFFFF)', 'ink': 'var(--ink,#131C26)', 'muted': 'var(--muted,#56616E)',
    'rule': 'var(--rule,#C9D1DA)', 'sunk': 'var(--sunk,#E2E7EC)',
    'accent': 'var(--accent,#1E5BA8)', 'accent-soft': 'var(--accent-soft,#DCE7F5)', 'accent-ink': 'var(--accent-ink,#FFFFFF)',
    'danger': 'var(--danger,#B42318)', 'danger-soft': 'var(--danger-soft,#F8E1DE)',
    'warn': 'var(--warn,#965800)', 'warn-soft': 'var(--warn-soft,#F6EAD3)',
    'ok': 'var(--ok,#2B7346)', 'ok-soft': 'var(--ok-soft,#DDEFE3)',
    'we': 'var(--lead-we,#2E9A55)', 'ws': 'var(--lead-ws,#2F6FD6)', 're': 'var(--lead-re,#F4F4F0)',
    'ce': 'var(--lead-ce,#D3342C)', 'cs': 'var(--lead-cs,#EE7B1A)', 'gnd': 'var(--lead-gnd,#1D1F22)',
    'wire': 'var(--wire-outline,#3A4450)',
    'panel': 'var(--panel,#2A3139)', 'panel-edge': 'var(--panel-edge,#151A1F)', 'panel-ink': 'var(--panel-ink,#E7ECF1)',
    'solution': 'var(--solution,#D4E6F2)', 'electrode': 'var(--electrode,#8C96A1)',
    'led-blue': '#3C8CFF', 'led-green': '#37C66B', 'led-yellow': '#F5C531', 'led-orange': '#F08A24',
    'none': 'none',
}
FONT = "var(--f-body,'IBM Plex Sans','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif)"
MONO = "var(--f-mono,'JetBrains Mono',ui-monospace,Menlo,monospace)"


def col(c):
    return C.get(c, c)


class Fig:
    def __init__(self, key, w, h, label):
        self.key, self.w, self.h, self.label = key, w, h, label
        self.parts, self.markers = [], {}

    def add(self, s):
        self.parts.append(s)

    def marker(self, color):
        mid = f'{self.key}-ah-{color}'
        self.markers[mid] = (
            f'<marker id="{mid}" viewBox="0 0 10 10" refX="8.5" refY="5" markerUnits="userSpaceOnUse" '
            f'markerWidth="9" markerHeight="9" orient="auto-start-reverse">'
            f'<path d="M0 0 L10 5 L0 10 Z" style="fill:{col(color)}"/></marker>')
        return f'url(#{mid})'

    def rect(self, x, y, w, h, rx=0, fill='none', stroke=None, sw=1.5, dash=None):
        st = f'fill:{col(fill)}'
        if stroke:
            st += f';stroke:{col(stroke)};stroke-width:{sw}'
        if dash:
            st += f';stroke-dasharray:{dash}'
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" style="{st}"/>')

    def circle(self, cx, cy, r, fill='none', stroke=None, sw=1.5):
        st = f'fill:{col(fill)}'
        if stroke:
            st += f';stroke:{col(stroke)};stroke-width:{sw}'
        self.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" style="{st}"/>')

    def path(self, d, stroke='ink', sw=1.5, fill='none', dash=None, end=None, start=None, cap='round'):
        st = f'fill:{col(fill)};stroke:{col(stroke)};stroke-width:{sw};stroke-linecap:{cap};stroke-linejoin:round'
        if dash:
            st += f';stroke-dasharray:{dash}'
        attrs = ''
        if end:
            attrs += f' marker-end="{self.marker(end)}"'
        if start:
            attrs += f' marker-start="{self.marker(start)}"'
        self.add(f'<path d="{d}" style="{st}"{attrs}/>')

    def arrow(self, d, color='ink', sw=1.6, both=False, dash=None):
        self.path(d, stroke=color, sw=sw, end=color, start=color if both else None, dash=dash)

    def text(self, x, y, t, size=12.5, anchor='start', weight=400, color='ink', mono=False, raw=False):
        body = t if raw else html.escape(t)
        fam = f';font-family:{MONO}' if mono else ''
        self.add(f'<text x="{x}" y="{y}" style="fill:{col(color)};font-size:{size}px;font-weight:{weight}{fam}" '
                 f'text-anchor="{anchor}">{body}</text>')

    def wire(self, d, lead, sw=3.5):
        self.path(d, stroke='wire', sw=sw + 2.5)
        self.path(d, stroke=lead, sw=sw)

    def badge(self, x, y, n, r=10):
        self.circle(x, y, r, 'accent')
        self.text(x, y + r * 0.42, str(n), r * 1.15, 'middle', 700, 'accent-ink')

    def legend(self, items, x, y, dx=None, dy=0, r=8):
        """Numbered legend: badges drawn the same way as in the figure."""
        for i, (n, t) in enumerate(items):
            bx = x[i] if isinstance(x, (list, tuple)) else x
            by = y + i * dy
            self.badge(bx + r, by - 4, n, r)
            self.text(bx + 2 * r + 6, by, t, 12)

    def icon(self, x, y, good):
        self.circle(x, y, 9, 'ok' if good else 'danger')
        if good:
            self.path(f'M{x-4} {y} L{x-1} {y+3.5} L{x+4.5} {y-3.5}', stroke='bg', sw=2.2)
        else:
            self.path(f'M{x-3.5} {y-3.5} L{x+3.5} {y+3.5} M{x+3.5} {y-3.5} L{x-3.5} {y+3.5}', stroke='bg', sw=2.2)

    def ground(self, x, y, color='ink'):
        self.path(f'M{x-14} {y} H{x+14} M{x-9} {y+6} H{x+9} M{x-4} {y+12} H{x+4}', stroke=color, sw=2)

    def svg(self):
        defs = f'<defs>{"".join(self.markers.values())}</defs>' if self.markers else ''
        lab = html.escape(self.label, quote=True)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" '
                f'height="{self.h}" role="img" aria-label="{lab}" style="font-family:{FONT}">'
                f'<title>{html.escape(self.label)}</title>{defs}'
                f'<rect x="0" y="0" width="{self.w}" height="{self.h}" style="fill:{col("bg")}"/>'
                + ''.join(self.parts) + '</svg>\n')


# ------------------------------------------------------------------ install 1
def install_01():
    f = Fig('install-01-inspect', 600, 320,
            '开箱检查流程：外观有损坏就不上电并联系 Gamry；没有损坏的冷机先回温至少 1 小时再安装。')
    f.rect(20, 40, 140, 110, 10, 'sunk', 'rule')
    f.path('M60 70 L90 58 L120 70 L120 108 L90 120 L60 108 Z', stroke='ink', fill='accent-soft')
    f.path('M60 70 L90 82 L120 70 M90 82 V120', stroke='ink')
    f.text(90, 138, '开箱核对配件', 13, 'middle', 600)
    f.text(20, 178, '装箱单（以实物为准）', 11.5, color='muted')
    for i, t in enumerate(['Reference 620 主机', '电源适配器 + 电源线', 'USB 线', '电解池电缆', '校准池 + 校准屏蔽盒']):
        f.text(28, 200 + i * 20, '· ' + t, 12.5)
    f.arrow('M160 95 H218')
    f.add('<polygon points="222,95 300,45 378,95 300,145" style="fill:{};stroke:{};stroke-width:1.5"/>'.format(
        col('accent-soft'), col('accent')))
    f.text(300, 91, '外观或接口', 13, 'middle', 600)
    f.text(300, 110, '有损坏？', 13, 'middle', 600)
    f.arrow('M378 95 H436')
    f.text(407, 86, '否', 12.5, 'middle', 700, 'ok')
    f.rect(440, 45, 140, 100, 10, 'sunk', 'rule')
    f.text(510, 74, '室温回温', 13, 'middle', 600)
    f.text(510, 103, '≥ 1 小时', 20, 'middle', 700, 'accent')
    f.text(510, 128, '防止内部凝露', 11.5, 'middle', color='muted')
    f.arrow('M510 145 V192')
    f.text(518, 173, '回温后', 11.5, color='muted')
    f.rect(440, 196, 140, 64, 10, 'ok-soft', 'ok')
    f.text(510, 222, '可以开始安装', 13, 'middle', 700, 'ok')
    f.text(510, 243, '下一步：摆放', 11.5, 'middle', color='muted')
    f.arrow('M300 145 V192', 'danger')
    f.text(308, 174, '是', 12.5, weight=700, color='danger')
    f.rect(210, 196, 180, 108, 10, 'danger-soft', 'danger')
    f.text(300, 222, '不要上电', 15, 'middle', 700, 'danger')
    f.text(300, 245, '贴上“安全隐患”标签', 12.5, 'middle')
    f.text(300, 265, '联系 Gamry', 12.5, 'middle')
    f.text(300, 289, '加强绝缘可能已失效', 11.5, 'middle', color='muted')
    return f


# ------------------------------------------------------------------ install 2
def install_02():
    f = Fig('install-02-placement', 600, 300,
            '摆放：仪器靠风扇强制风冷，进出风口都要留空；封闭空间内环境温度不超过 45 °C；只在室内使用，远离干扰源。')
    f.rect(20, 40, 370, 236, 8, 'none', 'muted', 1.5, '6 5')
    f.text(34, 62, '机柜或封闭空间（仅限室内）', 12, color='muted')
    for y in (148, 168, 188):
        f.arrow(f'M30 {y} H74', 'accent', 2)
    f.text(52, 226, '进风', 12, 'middle', 700, 'accent')
    f.rect(80, 130, 140, 76, 6, 'panel', 'panel-edge')
    f.text(150, 166, 'Reference 620', 13, 'middle', 700, 'panel-ink')
    f.text(150, 186, '风扇强制风冷', 11, 'middle', color='panel-ink')
    for y in (148, 168, 188):
        f.arrow(f'M226 {y} H270', 'warn', 2)
    f.text(248, 226, '出风', 12, 'middle', 700, 'warn')
    f.text(150, 254, '进出风口都要留出空间（位置以实物为准）', 11.5, 'middle', color='muted')
    f.rect(286, 124, 44, 86, 4, 'sunk', 'rule')
    f.text(308, 172, 'PC', 12, 'middle', 700, 'muted')
    f.arrow('M308 120 V94', 'warn', 2)
    f.text(308, 86, '也发热', 11.5, 'middle', 600, 'warn')
    f.rect(352, 70, 14, 124, 7, 'bg', 'ink')
    f.rect(356, 118, 6, 80, 3, 'danger')
    f.circle(359, 204, 12, 'danger', 'ink')
    f.text(359, 238, '≤ 45 °C', 13, 'middle', 700)
    f.text(359, 256, '环境温度', 11, 'middle', color='muted')
    f.rect(410, 40, 170, 110, 10, 'danger-soft', 'danger')
    f.icon(428, 62, False)
    f.text(444, 67, '风口被挡住', 13, weight=700, color='danger')
    f.text(424, 92, '贴墙，或被纸箱、线缆', 12)
    f.text(424, 110, '和其他设备遮挡', 12)
    f.text(424, 134, '→ 元件过热', 12, color='muted')
    f.rect(410, 166, 170, 110, 10, 'danger-soft', 'danger')
    f.icon(428, 188, False)
    f.text(444, 193, '户外或干扰源旁', 13, weight=700, color='danger')
    f.text(424, 218, '不是户外设备；', 12)
    f.text(424, 236, '远离电机、变频器和', 12)
    f.text(424, 254, '大功率电源线', 12)
    return f


# ------------------------------------------------------------------ install 3
def install_03():
    f = Fig('install-03-software', 600, 262,
            '安装顺序：先装 Gamry 软件（7.9 或更高）并重启电脑，再接电源和 USB；顺序反了 Windows 可能无法正确识别仪器。')
    f.icon(28, 30, True)
    f.text(44, 35, '正确顺序', 13, weight=700, color='ok')
    xs = [20, 170, 320, 470]
    fills = ['sunk', 'sunk', 'sunk', 'ok-soft']
    strokes = ['rule', 'rule', 'rule', 'ok']
    for i, x in enumerate(xs):
        f.rect(x, 52, 110, 96, 8, fills[i], strokes[i])
        if i < 3:
            f.arrow(f'M{x+110} 100 H{x+146}')
    for i, x in enumerate(xs):
        f.badge(x + 4, 56, i + 1)
    f.text(75, 86, '安装 Gamry 软件', 12.5, 'middle', 700)
    f.text(75, 106, 'Framework', 11, 'middle', color='muted', mono=True)
    f.text(75, 122, 'Echem Analyst', 11, 'middle', color='muted', mono=True)
    f.text(75, 140, '版本 ≥ 7.9', 11.5, 'middle', 700, 'accent')
    f.text(225, 96, '重启电脑', 13, 'middle', 700)
    f.text(225, 118, '让安装生效', 11.5, 'middle', color='muted')
    f.text(375, 90, '接电源与 USB', 13, 'middle', 700)
    f.text(375, 112, '打开后面板', 11.5, 'middle', color='muted')
    f.text(375, 128, '电源开关', 11.5, 'middle', color='muted')
    f.text(525, 90, '电脑识别仪器', 13, 'middle', 700, 'ok')
    f.text(525, 112, '在 GIM 中', 11.5, 'middle', color='muted')
    f.text(525, 128, '能看到它', 11.5, 'middle', color='muted')
    f.icon(28, 186, False)
    f.text(44, 191, '顺序反了', 13, weight=700, color='danger')
    f.rect(20, 206, 170, 48, 8, 'sunk', 'rule')
    f.text(105, 235, '先接仪器、后装软件', 12.5, 'middle', 600)
    f.arrow('M190 230 H226', 'danger')
    f.rect(230, 206, 350, 48, 8, 'danger-soft', 'danger')
    f.text(405, 227, 'Windows 可能无法正确识别仪器', 12.5, 'middle', 700, 'danger')
    f.text(405, 245, '手册要求先装软件、再接硬件', 11.5, 'middle', color='muted')
    return f


# ------------------------------------------------------------------ install 4
def install_04():
    f = Fig('install-04-connections', 600, 322,
            '接线：电源经外置适配器给仪器提供 24 V DC，USB 连接电脑，电解池电缆插在前面板 25 针接口并拧紧两颗螺丝，最后打开电源开关。')
    f.text(148, 50, '输入 100–240 VAC · 47–63 Hz', 11, 'middle', color='muted')
    f.rect(20, 64, 44, 52, 6, 'sunk', 'rule')
    f.rect(32, 80, 5, 14, 1, 'ink')
    f.rect(47, 80, 5, 14, 1, 'ink')
    f.text(42, 134, '墙插', 11.5, 'middle', color='muted')
    f.path('M64 90 H100', 'ink', 2.5)
    f.text(82, 134, '电源线', 11.5, 'middle', color='muted')
    f.rect(100, 62, 96, 56, 8, 'panel', 'panel-edge')
    f.text(148, 86, '电源适配器', 12, 'middle', 700, 'panel-ink')
    f.text(148, 104, '输出 24 V DC', 11, 'middle', color='panel-ink')
    f.path('M148 118 V150 H222', 'ink', 2.5)
    f.text(196, 143, '24 V DC', 11, 'middle', color='muted')
    f.badge(160, 150, 1)
    f.rect(20, 196, 110, 72, 6, 'sunk', 'rule')
    f.rect(28, 204, 94, 54, 3, 'bg')
    f.text(75, 227, '电脑', 12.5, 'middle', 700)
    f.text(75, 245, 'Gamry 软件', 11, 'middle', color='muted')
    f.rect(66, 268, 18, 8, 0, 'rule')
    f.rect(52, 276, 46, 5, 2, 'rule')
    f.path('M130 232 C 170 232, 190 215, 222 215', 'ink', 2.5)
    f.badge(158, 228, 2)
    f.text(192, 207, 'USB', 11, 'middle', color='muted')
    f.text(230, 98, '后面板（示意）', 11, color='muted')
    f.text(400, 98, '前面板（示意）', 11, 'end', color='muted')
    f.rect(230, 110, 170, 150, 8, 'panel', 'panel-edge')
    f.text(318, 186, 'Reference 620', 14, 'middle', 700, 'panel-ink')
    f.rect(222, 143, 12, 14, 2, 'sunk', 'ink', 1)
    f.text(242, 154, 'DC 24 V', 10.5, color='panel-ink')
    f.rect(222, 209, 12, 12, 2, 'sunk', 'ink', 1)
    f.text(242, 219, 'USB', 10.5, color='panel-ink')
    f.rect(222, 234, 12, 18, 2, 'ok', 'ink', 1)
    f.text(242, 247, '电源开关', 10.5, color='panel-ink')
    f.badge(204, 243, 4)
    f.rect(398, 160, 14, 60, 3, 'ink')
    f.circle(405, 151, 4.5, 'bg', 'accent', 2)
    f.circle(405, 229, 4.5, 'bg', 'accent', 2)
    f.path('M409 147 L422 130', 'accent', 1.2)
    f.text(424, 124, '拧紧两颗固定螺丝', 12, weight=700, color='accent')
    f.path('M412 190 H470', 'wire', 8)
    f.badge(444, 190, 3)
    leads = [('we', 'WE 绿'), ('ws', 'WS 蓝'), ('re', 'RE 白'), ('ce', 'CE 红'), ('cs', 'CS 橙'), ('gnd', '地 黑')]
    for i, (k, lab) in enumerate(leads):
        y = 140 + i * 22
        f.wire(f'M470 190 C 495 190, 502 {y}, 528 {y}', k, 3)
        f.rect(528, y - 4, 10, 8, 2, k, 'wire', 1)
        f.text(544, y + 4, lab, 11.5)
    f.text(412, 282, '只用原装电缆（含保险丝）', 11.5, color='muted')
    f.legend([(1, '接电源'), (2, '接 USB'), (3, '接电解池电缆'), (4, '全部接好后打开电源开关')],
             [20, 112, 204, 330], 310)
    return f


# ------------------------------------------------------------------ install 5
def install_05():
    f = Fig('install-05-selftest', 600, 282,
            '开机自检时序：Power 灯亮约 1 秒、闪 3 次、然后常亮为正常；亮后熄灭不再亮为故障。USB 灯常绿表示连接有效，闪橙表示正在收发数据。')
    f.path('M150 30 V232', 'muted', 1.2, dash='4 4')
    # row 1 normal
    f.text(20, 62, 'Power 灯', 13, weight=700)
    f.text(20, 79, '正常', 11.5, weight=600, color='ok')
    f.path('M150 74 H570', 'rule', 1.5)
    for a, b in [(150, 230), (250, 270), (290, 310), (330, 350), (370, 570)]:
        f.rect(a, 50, b - a, 24, 2, 'led-blue')
    f.text(190, 42, '约 1 秒', 11, 'middle', color='muted')
    f.text(300, 42, '闪 3 次', 11, 'middle', color='muted')
    f.text(470, 42, '常亮 = 自检通过', 11.5, 'middle', 700, 'ok')
    # row 2 fault
    f.text(20, 122, 'Power 灯', 13, weight=700)
    f.text(20, 139, '异常', 11.5, weight=600, color='danger')
    f.path('M150 134 H570', 'rule', 1.5)
    f.rect(150, 110, 80, 24, 2, 'led-blue')
    f.text(400, 127, '熄灭后不再亮 = 故障，联系 Gamry', 12, 'middle', 700, 'danger')
    # row 3 usb
    f.text(20, 186, 'USB 灯', 13, weight=700)
    f.text(20, 203, '已接 USB', 11.5, color='muted')
    f.path('M150 198 H570', 'rule', 1.5)
    f.rect(150, 174, 420, 24, 2, 'led-green')
    for a, b in [(420, 436), (446, 456), (468, 488), (500, 510)]:
        f.rect(a, 174, b - a, 24, 0, 'led-orange')
    f.text(260, 166, '常绿 = USB 连接有效', 11.5, 'middle', color='muted')
    f.text(466, 166, '闪橙 = 正在收发数据', 11.5, 'middle', 600, 'warn')
    f.arrow('M150 232 H574')
    f.text(156, 250, '打开电源开关', 11.5, weight=600)
    f.text(574, 250, '时间', 11.5, 'end', color='muted')
    f.text(20, 272, '时间比例为示意，非精确时长。', 11, color='muted')
    return f


# ------------------------------------------------------------------ install 6
def install_06():
    f = Fig('install-06-calibration', 600, 340,
            'DC 校准：电解池电缆接 200 Ω 校准池，放进校准屏蔽盒并盖好，黑色浮地线接屏蔽盒接地柱，然后在 Framework 的 Experiment › Utilities 中启动校准。')
    f.rect(20, 108, 84, 72, 6, 'panel', 'panel-edge')
    f.text(62, 149, 'R620', 13, 'middle', 700, 'panel-ink')
    f.path('M104 144 H140', 'wire', 7)
    f.rect(182, 62, 186, 10, 3, 'ink')
    f.text(275, 52, '盖好屏蔽盒盖', 11.5, 'middle', color='muted')
    f.rect(188, 72, 174, 148, 4, 'sunk', 'ink', 2)
    f.rect(245, 108, 92, 74, 6, 'bg', 'accent', 2)
    f.text(291, 138, '校准池', 13, 'middle', 700)
    f.text(291, 162, '200 Ω', 16, 'middle', 700, 'accent')
    for i, k in enumerate(['we', 'ws', 're', 'ce', 'cs']):
        y = 118 + i * 14
        f.wire(f'M140 144 C 190 144, 200 {y}, 245 {y}', k, 2.5)
    f.path('M182 204 H188', 'ink', 2)
    f.circle(176, 204, 6, 'sunk', 'ink', 2)
    f.wire('M140 144 C 150 190, 156 204, 170 204', 'gnd', 2.5)
    f.text(170, 232, '黑线接接地柱', 11.5, 'end', color='muted')
    f.text(275, 240, '校准屏蔽盒', 12, 'middle', 700)
    f.text(275, 256, 'Calibration Shield', 10.5, 'middle', color='muted')
    f.badge(245, 108, 1)
    f.badge(372, 67, 2)
    f.badge(176, 186, 3)
    f.rect(400, 60, 180, 134, 8, 'sunk', 'rule')
    f.rect(410, 70, 160, 104, 4, 'bg')
    f.text(418, 92, 'Gamry Framework', 12, weight=700)
    f.text(418, 116, 'Experiment ›', 11.5, mono=True)
    f.text(430, 136, 'Utilities ›', 11.5, mono=True)
    f.text(442, 156, 'Calibrate…', 11.5, weight=700, color='accent', mono=True)
    f.rect(482, 194, 16, 12, 0, 'rule')
    f.rect(460, 206, 60, 5, 2, 'rule')
    f.badge(400, 60, 4)
    f.rect(400, 226, 180, 36, 6, 'ok-soft', 'ok')
    f.text(490, 249, '自动运行 → 提示成功', 12, 'middle', 700, 'ok')
    f.rect(400, 270, 180, 36, 6, 'warn-soft', 'warn')
    f.text(490, 293, '失败 → 查 My Gamry Data', 11.5, 'middle', 700, 'warn')
    f.legend([(1, '电缆接校准池'), (2, '放入屏蔽盒并盖好'), (3, '黑线接接地柱'), (4, 'Framework 中启动校准')],
             20, 270, dy=20)
    return f


# ------------------------------------------------------------------ use 1
def use_01():
    f = Fig('use-01-three-electrode', 600, 340,
            '三电极原理：电流经绿线、溶液和红线流过工作电极与对电极；蓝线和白线只感应电压，静电计测得的 E 反馈给控制放大器。')
    f.rect(20, 36, 200, 262, 8, 'none', 'muted', 1.5, '6 5')
    f.text(32, 56, 'Reference 620 内部（示意）', 11.5, color='muted')
    f.rect(36, 72, 160, 56, 6, 'accent-soft', 'accent')
    f.text(116, 95, '静电计 Electrometer', 12, 'middle', 700)
    f.text(116, 115, '测 E = 蓝 − 白', 11.5, 'middle', 600, 'accent')
    f.arrow('M116 128 V146', 'accent')
    f.text(124, 142, '反馈', 10.5, weight=600, color='accent')
    f.rect(36, 148, 160, 56, 6, 'sunk', 'ink', 1.2)
    f.text(116, 171, '控制放大器', 12, 'middle', 700)
    f.text(116, 191, '调节输出使 E = 设定值', 11, 'middle', color='muted')
    f.rect(36, 224, 160, 56, 6, 'sunk', 'ink', 1.2)
    f.text(116, 247, '电流测量 I/E', 12, 'middle', 700)
    f.text(116, 267, '测量流过 WE 的电流 i', 11, 'middle', color='muted')
    f.rect(332, 150, 246, 144, 0, 'solution')
    f.path('M330 96 V284 Q330 296 342 296 H568 Q580 296 580 284 V96', 'muted', 2)
    for x, a, b in [(390, '工作电极', 'WE'), (462, '参比电极', 'RE'), (538, '对电极', 'CE')]:
        f.rect(x - 5, 74, 10, 170, 2, 'electrode')
        f.text(x, 264, a, 11.5, 'middle', 700)
        f.text(x, 280, b, 10.5, 'middle', color='muted')
    f.wire('M196 92 C 290 92, 386 40, 386 74', 'ws', 3)
    f.wire('M196 110 C 310 110, 462 30, 462 74', 're', 3)
    f.wire('M196 176 C 330 176, 538 18, 538 74', 'ce', 3)
    f.wire('M196 252 C 300 252, 394 30, 394 74', 'we', 3)
    f.arrow('M398 168 H454', 'accent', 2, both=True)
    f.text(426, 162, 'E', 13, 'middle', 700, 'accent')
    f.arrow('M398 220 H530', 'warn', 2.5, both=True)
    f.text(500, 212, '电流 i', 12, 'middle', 700, 'warn')
    f.path('M20 316 H42', 'wire', 6)
    f.path('M20 316 H42', 'we', 3.5)
    f.path('M48 316 H70', 'wire', 6)
    f.path('M48 316 H70', 'ce', 3.5)
    f.text(78, 320, '绿 WE、红 CE：承载电流', 12)
    f.path('M300 316 H322', 'wire', 6)
    f.path('M300 316 H322', 'ws', 3.5)
    f.path('M328 316 H350', 'wire', 6)
    f.path('M328 316 H350', 're', 3.5)
    f.text(358, 320, '蓝 WS、白 RE：只感应电压', 12)
    return f


# ------------------------------------------------------------------ use 2
def use_02():
    f = Fig('use-02-cv-workflow', 600, 282,
            'CV 实验流程：准备、接线、选择实验、设参数时 Cell On 黄灯熄灭；运行时黄灯亮，不要触碰；结束灯灭后再拆线，然后用 Echem Analyst 分析。')
    f.circle(26, 20, 5, 'led-yellow', 'wire', 1)
    f.text(38, 24, '圆点 = 前面板 Cell On 黄灯状态', 11.5, color='muted')
    steps = [
        (20, 40, '准备电解池', '低电流放法拉第笼', 'off', '灭'),
        (170, 40, '按配置接线', '参比靠近 WE', 'off', '灭 · 可接线'),
        (320, 40, '选择 CV 实验', '在 Framework 中', 'off', '灭'),
        (470, 40, '设置参数', 'Scan Rate 等', 'off', '灭'),
        (20, 170, '运行 Run', '留意 Overload 灯', 'on', '亮 · 勿触碰'),
        (170, 170, '结束后拆线', '等黄灯熄灭', 'off', '灭 · 可拆线'),
        (320, 170, '分析数据', 'Echem Analyst', 'off', '灭'),
    ]
    for i, (x, y, t, s, st, pill) in enumerate(steps):
        on = st == 'on'
        f.rect(x, y, 110, 64, 8, 'warn-soft' if on else 'sunk', 'warn' if on else 'rule')
        f.text(x + 55, y + 30, t, 13, 'middle', 700)
        f.text(x + 55, y + 50, s, 10.5, 'middle', color='muted', mono=(s == 'Echem Analyst'))
        f.rect(x, y + 72, 110, 22, 11, 'warn-soft' if on else 'sunk')
        f.circle(x + 13, y + 83, 5, 'led-yellow' if on else 'rule', 'wire', 1)
        f.text(x + 62, y + 87, pill, 11, 'middle', 700 if on else 500, 'warn' if on else 'muted')
    for i, (x, y, *_r) in enumerate(steps):
        f.badge(x + 2, y + 2, i + 1)
    for x in (130, 280, 430):
        f.arrow(f'M{x} 72 H{x+36}')
    for x in (130, 280):
        f.arrow(f'M{x} 202 H{x+36}')
    f.arrow('M525 134 V150 H75 V166')
    f.rect(470, 170, 110, 94, 8, 'ok-soft', 'ok')
    f.text(525, 194, '安全规则', 12.5, 'middle', 700, 'ok')
    f.text(525, 216, '只在黄灯熄灭时', 11.5, 'middle')
    f.text(525, 234, '接线、拆线', 11.5, 'middle')
    f.text(525, 252, '和换样品', 11.5, 'middle')
    return f


# ------------------------------------------------------------------ use 3
def use_03():
    f = Fig('use-03-zra', 600, 312,
            'ZRA 电偶测量：仪器保持金属 A 与金属 B 之间电压为 0 V，测量两者之间的电偶电流 Ig；参比电极记录耦合电位。')
    f.rect(20, 40, 200, 206, 8, 'none', 'muted', 1.5, '6 5')
    f.text(32, 60, 'Reference 620（ZRA 模式）', 11.5, color='muted')
    f.rect(36, 74, 168, 110, 6, 'accent-soft', 'accent')
    f.text(120, 100, '零阻电流计 ZRA', 13, 'middle', 700)
    f.text(120, 122, '保持蓝线与橙线之间', 11.5, 'middle')
    f.text(120, 144, '电压 = 0 V', 13, 'middle', 700, 'accent')
    f.text(120, 168, '测量电偶电流 I<tspan dy="3" style="font-size:9px">g</tspan>', 11.5, 'middle', raw=True)
    f.rect(36, 198, 168, 34, 6, 'sunk', 'ink', 1.2)
    f.text(120, 220, '静电计：测耦合电位', 11.5, 'middle')
    f.rect(332, 150, 246, 128, 0, 'solution')
    f.path('M330 104 V268 Q330 280 342 280 H568 Q580 280 580 268 V104', 'muted', 2)
    f.rect(372, 84, 16, 150, 2, 'electrode')
    f.rect(445, 84, 10, 140, 2, 'electrode')
    f.rect(512, 84, 16, 150, 2, 'electrode')
    f.wire('M204 92 C 290 92, 376 44, 376 84', 'we', 3)
    f.wire('M204 110 C 300 110, 384 50, 384 84', 'ws', 3)
    f.wire('M204 215 C 320 215, 450 36, 450 84', 're', 3)
    f.wire('M204 140 C 320 140, 516 24, 516 84', 'ce', 3)
    f.wire('M204 160 C 330 160, 524 14, 524 84', 'cs', 3)
    f.arrow('M392 200 H508', 'warn', 2.5, both=True)
    f.text(380, 258, '金属 A', 11.5, 'middle', 700)
    f.text(450, 258, '参比', 11.5, 'middle', 700)
    f.text(520, 258, '金属 B', 11.5, 'middle', 700)
    f.text(455, 302, 'I<tspan dy="3" style="font-size:9px">g</tspan><tspan dy="-3">：在仪器内被测量，在溶液中以离子电流流动</tspan>',
           11.5, 'middle', color='muted', raw=True)
    f.text(32, 270, '绿 + 蓝 → 金属 A', 11.5)
    f.text(32, 288, '红 + 橙 → 金属 B', 11.5)
    f.text(32, 306, '白 → 参比电极', 11.5)
    return f


# ------------------------------------------------------------------ hazard
def hazard_grounding():
    f = Fig('hazard-grounding', 600, 330,
            '接地对比：样品已接地时，仪器保持浮地没有回路；机壳也接大地时，大地把回路闭合，电解池经仪器放电，电缆保险丝熔断。')
    for ox, bad in [(10, False), (305, True)]:
        c = 'danger' if bad else 'ink'
        f.rect(ox, 18, 285, 302, 10, 'none', 'rule', 1.2)
        f.icon(ox + 24, 44, not bad)
        f.text(ox + 40, 49, '机壳也接了大地' if bad else '仪器保持浮地', 14, weight=700, color='danger' if bad else 'ok')
        f.rect(ox + 20, 96, 90, 64, 6, 'panel', 'panel-edge')
        f.text(ox + 65, 133, 'R620', 13, 'middle', 700, 'panel-ink')
        f.rect(ox + 160, 80, 104, 112, 10, 'sunk', 'ink', 1.5)
        f.text(ox + 212, 118, '高压釜', 13, 'middle', 700)
        f.text(ox + 212, 138, '金属釜体', 11, 'middle', color='muted')
        f.text(ox + 212, 156, '样品与釜体相连', 11, 'middle', color='muted')
        if bad:
            f.arrow(f'M{ox+110} 128 H{ox+158}', 'danger', 2.5)
        else:
            f.path(f'M{ox+110} 128 H{ox+160}', 'ink', 2.5)
        f.text(ox + 135, 120, '电极线', 10.5, 'middle', color='muted')
        f.path(f'M{ox+212} 192 V230', c, 2)
        f.ground(ox + 212, 230, c)
        f.text(ox + 232, 242, '大地', 11, color='muted')
        if bad:
            f.path(f'M{ox+65} 160 V230', 'danger', 2)
            f.ground(ox + 65, 230, 'danger')
            f.path(f'M{ox+65} 252 H{ox+212}', 'danger', 2, dash='6 4')
            f.text(ox + 138, 247, '经大地连通', 11, 'middle', 700, 'danger')
            f.rect(ox + 14, 262, 257, 46, 8, 'danger-soft', 'danger')
            f.text(ox + 142, 282, '形成低阻抗回路', 12.5, 'middle', 700, 'danger')
            f.text(ox + 142, 300, '电解池经仪器放电，电缆保险丝熔断', 11, 'middle')
        else:
            f.path(f'M{ox+65} 160 V204', 'muted', 1.5, dash='4 4')
            f.text(ox + 65, 222, '机壳不接大地', 11.5, 'middle', 700, 'ok')
            f.rect(ox + 14, 262, 257, 46, 8, 'ok-soft', 'ok')
            f.text(ox + 142, 282, '没有闭合回路', 12.5, 'middle', 700, 'ok')
            f.text(ox + 142, 300, '浮地设计就是为这类样品准备的', 11, 'middle')
    return f


FIGS = [install_01, install_02, install_03, install_04, install_05, install_06,
        use_01, use_02, use_03, hazard_grounding]


def main():
    os.makedirs(OUT, exist_ok=True)
    built = {}
    for fn in FIGS:
        fig = fn()
        svg = fig.svg()
        with open(os.path.join(OUT, fig.key + '.svg'), 'w', encoding='utf-8') as fh:
            fh.write(svg)
        built[fig.key] = svg.strip()
    page = open(PAGE, encoding='utf-8').read()
    n = 0
    for key, svg in built.items():
        pat = re.compile(r'<!--SVG:' + re.escape(key) + r'-->.*?<!--/SVG-->', re.S)
        page, k = pat.subn(lambda m: f'<!--SVG:{key}-->{svg}<!--/SVG-->', page)
        n += k
    open(PAGE, 'w', encoding='utf-8').write(page)
    print(f'wrote {len(built)} svgs, inlined {n}')


if __name__ == '__main__':
    main()
