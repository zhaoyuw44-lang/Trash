"""Generate the Reference 620 guide SVG figures and inline them into the HTML page.

Content follows the Reference 620 Operator's Manual (988-00086, Rev 1.5.0,
August 4, 2025). Panel drawings are simplified from the manual's photographs.

Each SVG is self-contained: colours use the page's CSS tokens with light-theme
fallbacks (style="fill:var(--token,#hex)"), so a figure follows the page theme
when inlined and still renders on its own as a standalone file.

Run from anywhere:  python3 gamry-ref620-svg/build_svgs.py
It rewrites the .svg files next to this script, writes English versions to en/
(text from strings_en.py), and replaces each <!--SVG:name-->...<!--/SVG-->
block in gamry-reference-620-guide.html with the Chinese version.
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
    'solution': 'var(--solution,#D4E6F2)', 'electrode': 'var(--electrode,#8C96A1)', 'cage': 'var(--cage,#7F8B97)',
    'led-off': 'var(--led-off,#4A535D)',
    'led-blue': '#3C8CFF', 'led-green': '#37C66B', 'led-yellow': '#F5C531', 'led-orange': '#F08A24',
    'led-red': '#E5484D', 'tc': '#E2B93B',
    'none': 'none',
}
FONT = "var(--f-body,'IBM Plex Sans','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif)"
MONO = "var(--f-mono,'JetBrains Mono',ui-monospace,Menlo,monospace)"

# Output language: 'zh' (default, inlined into the guide page) or 'en' (written to en/).
LANG = 'zh'
_CJK = re.compile(r'[\u3000-\u9fff\uff00-\uffef]')
_EN = None


def _en():
    global _EN
    if _EN is None:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import strings_en
        _EN = strings_en
    return _EN


def col(c):
    return C.get(c, c)


class Fig:
    def __init__(self, key, w, h, label):
        self.key, self.w, self.h, self.label = key, w, h, label
        self.parts, self.markers = [], {}
        self.lang = LANG

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

    def poly(self, pts, fill, stroke=None, sw=1.5):
        st = f'fill:{col(fill)}'
        if stroke:
            st += f';stroke:{col(stroke)};stroke-width:{sw};stroke-linejoin:round'
        self.add(f'<polygon points="{pts}" style="{st}"/>')

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
        if self.lang == 'en':
            v = _en().TEXT.get(t, t)
            t, size = v if isinstance(v, tuple) else (v, size)
            if _CJK.search(t):
                raise KeyError(f'no English text for {t!r} in {self.key}')
        body = t if raw else html.escape(t)
        fam = f';font-family:{MONO}' if mono else ''
        self.add(f'<text x="{x}" y="{y}" style="fill:{col(color)};font-size:{size}px;font-weight:{weight}{fam}" '
                 f'text-anchor="{anchor}">{body}</text>')

    def wire(self, d, lead, sw=3.5):
        self.path(d, stroke='wire', sw=sw + 2.5)
        self.path(d, stroke=lead, sw=sw)

    def swatch(self, x, y, lead):
        self.path(f'M{x} {y} H{x+22}', 'wire', 6)
        self.path(f'M{x} {y} H{x+22}', lead, 3.5)

    def badge(self, x, y, n, r=10, fill='accent'):
        self.circle(x, y, r, fill)
        self.text(x, y + r * 0.42, str(n), round(r * 1.15, 1), 'middle', 700, 'accent-ink')

    def legend(self, items, x, y, dy=0, r=8, size=12):
        for i, it in enumerate(items):
            n, t = it[0], it[1]
            fill = it[2] if len(it) > 2 else 'accent'
            bx = x[i] if isinstance(x, (list, tuple)) else x
            by = y + i * dy
            self.badge(bx + r, by - 4, n, r, fill)
            self.text(bx + 2 * r + 6, by, t, size, weight=700 if fill != 'accent' else 400)

    def icon(self, x, y, kind):
        fill = {'ok': 'ok', 'bad': 'danger', 'warn': 'warn'}[kind]
        self.circle(x, y, 9, fill)
        if kind == 'ok':
            self.path(f'M{x-4} {y} L{x-1} {y+3.5} L{x+4.5} {y-3.5}', stroke='bg', sw=2.2)
        elif kind == 'bad':
            self.path(f'M{x-3.5} {y-3.5} L{x+3.5} {y+3.5} M{x+3.5} {y-3.5} L{x-3.5} {y+3.5}', stroke='bg', sw=2.2)
        else:
            self.path(f'M{x} {y-4.5} V{y+1}', stroke='bg', sw=2.2)
            self.circle(x, y + 4.2, 1.3, 'bg')

    def ground(self, x, y, color='ink'):
        self.path(f'M{x-14} {y} H{x+14} M{x-9} {y+6} H{x+9} M{x-4} {y+12} H{x+4}', stroke=color, sw=2)

    def cap(self, x1, x2, y, color='ink'):
        """Horizontal capacitor between x1 and x2 at height y."""
        m = (x1 + x2) / 2
        self.path(f'M{x1} {y} H{m-3} M{m+3} {y} H{x2}', color, 2)
        self.path(f'M{m-3} {y-9} V{y+9} M{m+3} {y-9} V{y+9}', color, 2.4)

    def svg(self):
        defs = f'<defs>{"".join(self.markers.values())}</defs>' if self.markers else ''
        label = _en().LABELS[self.key] if self.lang == 'en' else self.label
        lab = html.escape(label, quote=True)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" '
                f'height="{self.h}" role="img" aria-label="{lab}" style="font-family:{FONT}">'
                f'<title>{html.escape(label)}</title>{defs}'
                f'<rect x="0" y="0" width="{self.w}" height="{self.h}" style="fill:{col("bg")}"/>'
                + ''.join(self.parts) + '</svg>\n')


# ================================================================== install
def install_00():
    f = Fig('install-00-box-contents', 600, 430,
            '开箱物品去向：电源适配器、USB 线和电解池电缆一直接在主机上；200 Ω 校准池和校准屏蔽盒只在校准时使用，黑色接地线校准时把机壳接大地；校准完成后电缆另一端改接电解池，校准池收好。')
    f.path('M20 30 H44', 'accent', 3)
    f.text(52, 34, '一直连接', 11)
    f.path('M150 30 H174', 'warn', 3, dash='6 4')
    f.text(182, 34, '校准时', 11)
    f.path('M290 30 H314', 'ok', 3)
    f.text(322, 34, '实验时', 11)
    f.text(225, 102, '后面板', 11, color='muted')
    f.text(375, 102, '前面板', 11, 'end', color='muted')
    f.rect(225, 110, 150, 170, 8, 'panel', 'panel-edge')
    f.text(300, 196, 'Reference 620', 13, 'middle', 700, 'panel-ink')
    f.text(300, 214, '主机', 11, 'middle', color='panel-ink')
    f.rect(217, 133, 12, 14, 2, 'sunk', 'ink', 1)
    f.text(235, 144, 'Power In', 9.5, color='panel-ink')
    f.rect(217, 174, 12, 12, 2, 'sunk', 'ink', 1)
    f.text(235, 184, 'USB', 9.5, color='panel-ink')
    f.circle(223, 222, 5, 'sunk', 'ink', 1.5)
    f.text(235, 226, 'Chassis Ground', 9.5, color='panel-ink')
    f.rect(217, 249, 12, 16, 2, 'ok', 'ink', 1)
    f.text(235, 261, 'Power 开关', 9.5, color='panel-ink')
    f.rect(372, 176, 12, 60, 3, 'ink')
    f.text(366, 160, 'Cell Cable', 9.5, 'end', color='panel-ink')
    # rear-panel items
    items = [(118, 46, '电源适配器 + 电源线', '电源线另一端接墙插', 'accent', 140),
             (174, 40, 'USB A/B 线', '另一端接电脑', 'accent', 180),
             (224, 44, '1.2 m 黑色接地线', '另一端接可靠大地', 'warn', 222)]
    for y, h, a, b, c, ty in items:
        f.rect(20, y, 150, h, 8, 'bg', c, 1.5, None if c == 'accent' else '6 4')
        f.text(30, y + 18, a, 12, weight=700)
        f.text(30, y + 35, b, 10, color='muted')
        f.arrow(f'M170 {ty} H{215 if ty != 222 else 216}', c, 2, dash=None if c == 'accent' else '6 4')
    # cell cable on the front
    f.rect(430, 180, 150, 50, 8, 'bg', 'accent', 1.5)
    f.text(440, 200, '60 cm 电解池电缆', 12, weight=700)
    f.text(440, 218, '拧紧两颗螺丝', 10, color='muted')
    f.arrow('M428 205 H388', 'accent', 2)
    # where the cable's free end goes
    f.arrow('M480 230 C 480 280, 375 280, 375 326', 'warn', 2, dash='6 4')
    f.arrow('M540 230 V326', 'ok', 2)
    f.rect(290, 330, 170, 84, 8, 'warn-soft', 'warn', 1.2)
    f.text(300, 350, '校准时', 11.5, weight=700, color='warn')
    f.text(300, 369, '200 Ω 校准池放进屏蔽盒', 10.5)
    f.text(300, 386, '黑线接盒上接地柱', 10.5)
    f.text(300, 403, '机壳接地线接大地', 10.5)
    f.rect(470, 330, 110, 84, 8, 'ok-soft', 'ok', 1.2)
    f.text(480, 350, '实验时', 11.5, weight=700, color='ok')
    f.text(480, 369, '接电解池', 10.5)
    f.text(480, 386, '校准池收好', 10.5)
    f.rect(20, 330, 258, 84, 8, 'sunk')
    f.text(30, 350, '其他随机物品', 11.5, weight=700)
    f.text(30, 369, '20 kΩ 校准池：只用于电缆电容校准', 10.5)
    f.text(30, 386, '配件包：参比电极针式插头转接头', 10.5)
    f.text(30, 403, '标签纸：插在前面板标签区（可选）', 10.5)
    return f


def install_01():
    f = Fig('install-01-inspect', 600, 330,
            '开箱检查：有运输损坏就不上电，通知 Gamry 和承运人并保留包装箱；没有损坏但从低温处运来的仪器，先在室温放置至少 1 小时。')
    f.rect(20, 40, 140, 110, 10, 'sunk', 'rule')
    f.path('M60 70 L90 58 L120 70 L120 108 L90 120 L60 108 Z', stroke='ink', fill='accent-soft')
    f.path('M60 70 L90 82 L120 70 M90 82 V120', stroke='ink')
    f.text(90, 138, '开箱检查外观', 13, 'middle', 600)
    f.text(20, 178, '随机配件（以装箱单为准）', 11.5, color='muted')
    for i, t in enumerate(['主机、电源适配器 + 电源线', 'USB A/B 线', '60 cm 屏蔽电解池电缆',
                           '200 Ω 与 20 kΩ 校准池', '1.2 m 黑色接地线', '配件包、标签纸']):
        f.text(28, 198 + i * 20, '· ' + t, 12)
    f.arrow('M160 95 H218')
    f.poly('222,95 300,45 378,95 300,145', 'accent-soft', 'accent')
    f.text(300, 91, '有运输损坏', 13, 'middle', 600)
    f.text(300, 110, '或其他异常？', 13, 'middle', 600)
    f.arrow('M378 95 H436')
    f.text(407, 86, '否', 12.5, 'middle', 700, 'ok')
    f.rect(440, 45, 140, 100, 10, 'sunk', 'rule')
    f.text(510, 74, '从低温处运来？', 12.5, 'middle', 600)
    f.text(510, 103, '回温 ≥ 1 小时', 17, 'middle', 700, 'accent')
    f.text(510, 128, '防止内部凝露', 11.5, 'middle', color='muted')
    f.arrow('M510 145 V192')
    f.text(518, 173, '回温后', 11.5, color='muted')
    f.rect(440, 196, 140, 64, 10, 'ok-soft', 'ok')
    f.text(510, 222, '可以开始安装', 13, 'middle', 700, 'ok')
    f.text(510, 243, '下一步：摆放', 11.5, 'middle', color='muted')
    f.arrow('M300 145 V192', 'danger')
    f.text(308, 174, '是', 12.5, weight=700, color='danger')
    f.rect(210, 196, 190, 122, 10, 'danger-soft', 'danger')
    f.text(305, 220, '不要上电', 15, 'middle', 700, 'danger')
    f.text(305, 242, '通知 Gamry 和承运人', 12, 'middle')
    f.text(305, 261, '保留包装箱供检查', 12, 'middle')
    f.text(305, 280, '贴上“安全隐患”标签', 12, 'middle')
    f.text(305, 304, '须经合格技术人员确认安全', 11, 'middle', color='muted')
    return f


def install_02():
    f = Fig('install-02-placement', 600, 300,
            '摆放：空气从机箱两侧靠近前面板的槽口进入，从后部两只风扇排出；背面要留出接线和出风空间；工作环境 0–45 °C、相对湿度不超过 90 % 且不凝露，仅限室内。')
    f.text(20, 30, '俯视示意（仪器通常直立放置）', 11.5, color='muted')
    f.text(140, 76, '进风：两侧靠近前面板的槽口', 12, weight=700, color='accent')
    for x in (92, 118):
        f.arrow(f'M{x} 62 V104', 'accent', 2)
        f.arrow(f'M{x} 238 V196', 'accent', 2)
    f.rect(70, 110, 180, 80, 6, 'panel', 'panel-edge')
    f.path('M82 110 H128 M82 190 H128', 'accent', 4, cap='butt')
    f.text(150, 154, 'Reference 620', 13, 'middle', 700, 'panel-ink')
    f.text(64, 154, '前面板', 11.5, 'end', 600, 'muted')
    for cy in (132, 168):
        f.circle(230, cy, 12, 'none', 'panel-ink', 1.5)
        f.circle(230, cy, 4, 'panel-ink')
        f.arrow(f'M252 {cy} H304', 'warn', 2)
    f.text(256, 118, '后面板', 11.5, weight=600, color='muted')
    f.text(256, 214, '出风：后部两只风扇', 12, weight=700, color='warn')
    f.text(256, 230, '背面还要留出接线空间', 11.5, color='muted')
    for x, w, t in [(20, 118, '0–45 °C'), (148, 150, 'RH ≤ 90 % 不凝露'), (308, 92, '仅限室内')]:
        f.rect(x, 252, w, 30, 15, 'sunk')
        f.text(x + w / 2, 272, t, 12, 'middle', 700)
    f.rect(420, 40, 160, 110, 10, 'danger-soft', 'danger')
    f.icon(438, 62, 'bad')
    f.text(454, 67, '风口被挡住', 13, weight=700, color='danger')
    f.text(434, 92, '外壳可能烫手，', 12)
    f.text(434, 110, '缩短电路寿命', 12)
    f.text(434, 134, '过热时电路会关断', 11, color='muted')
    f.rect(420, 166, 160, 116, 10, 'warn-soft', 'warn')
    f.icon(438, 188, 'warn')
    f.text(454, 193, '放进机柜时', 13, weight=700, color='warn')
    f.text(434, 218, '柜内也不能超过 45 °C；', 12)
    f.text(434, 236, '和电脑同柜要特别注意，', 12)
    f.text(434, 254, '必要时加通风孔', 12)
    f.text(434, 272, '或强制风冷', 12)
    return f


def install_03():
    f = Fig('install-03-software', 600, 286,
            '软件：先确认电脑为 64 位 Windows 10 或更高，从 Gamry Client Portal 下载安装 Gamry 软件并重启，等驱动加载后再接仪器。')
    f.icon(28, 30, 'ok')
    f.text(44, 35, '正确顺序', 13, weight=700, color='ok')
    xs = [20, 170, 320, 470]
    for i, x in enumerate(xs):
        last = i == 3
        f.rect(x, 52, 110, 108, 8, 'ok-soft' if last else 'sunk', 'ok' if last else 'rule')
        if i < 3:
            f.arrow(f'M{x+110} 106 H{x+146}')
    for i, x in enumerate(xs):
        f.badge(x + 4, 56, i + 1)
    f.text(75, 84, '检查电脑', 13, 'middle', 700)
    f.text(75, 106, 'Windows 10+', 11, 'middle', color='muted')
    f.text(75, 124, '仅 64 位 · x86', 11, 'middle', color='muted')
    f.text(75, 142, 'USB 2.0 / 1.1', 11, 'middle', color='muted')
    f.text(225, 84, '下载并安装', 13, 'middle', 700)
    f.text(225, 106, 'Client Portal', 11, 'middle', color='accent', mono=True)
    f.text(225, 124, '注册仪器后下载', 11, 'middle', color='muted')
    f.text(225, 142, '.exe 或 .iso', 11, 'middle', color='muted', mono=True)
    f.text(375, 84, '重启电脑', 13, 'middle', 700)
    f.text(375, 106, '桌面出现后', 11, 'middle', color='muted')
    f.text(375, 124, '驱动可能还要', 11, 'middle', color='muted')
    f.text(375, 142, '1 分钟以上', 11, 'middle', color='muted')
    f.text(525, 84, '再接仪器', 13, 'middle', 700, 'ok')
    f.text(525, 106, '即插即用', 11, 'middle', color='muted')
    f.text(525, 124, 'Framework', 11, 'middle', color='muted', mono=True)
    f.text(525, 142, '7.9 或更高', 11, 'middle', color='muted')
    f.icon(28, 200, 'bad')
    f.text(44, 205, '顺序反了', 13, weight=700, color='danger')
    f.rect(20, 220, 170, 50, 8, 'sunk', 'rule')
    f.text(105, 250, '先接仪器、后装软件', 12.5, 'middle', 600)
    f.arrow('M190 245 H226', 'danger')
    f.rect(230, 220, 350, 50, 8, 'danger-soft', 'danger')
    f.text(405, 242, 'Windows 可能无法正确识别仪器', 12.5, 'middle', 700, 'danger')
    f.text(405, 260, '手册：即插即用设备最好先装软件', 11.5, 'middle', color='muted')
    return f


def _bnc(f, x, y):
    f.circle(x, y, 12, 'panel-edge', 'panel-ink', 1.5)
    f.circle(x, y, 4, 'panel-ink')


def install_04():
    f = Fig('install-04-power', 600, 420,
            '接电源：电源适配器把 100–240 VAC 转成 24 V DC，接后面板 Power In 插孔，再打开插孔下方的电源开关；此时先不要接 USB 和电解池电缆。图中同时标出后面板的全部接口。')
    # rear panel, simplified from the manual photograph
    f.rect(20, 30, 200, 330, 12, 'panel-edge')
    f.rect(28, 38, 184, 314, 6, 'panel')
    f.rect(38, 48, 62, 36, 3, 'accent-soft')
    f.text(69, 70, '勿自行维修', 9.5, 'middle', 700)
    f.rect(112, 50, 16, 26, 2, 'tc', 'ink', 1)
    f.rect(170, 52, 20, 18, 2, 'sunk', 'ink', 1)
    for cx in (74, 166):
        f.circle(cx, 128, 36, 'panel-edge', 'panel-ink', 1.5)
        f.circle(cx, 128, 24, 'none', 'rule', 1)
        f.circle(cx, 128, 9, 'panel-ink')
    for x, y in [(52, 196), (52, 252), (110, 188), (110, 226), (110, 264)]:
        _bnc(f, x, y)
    f.poly('176,166 187,186 165,186', 'led-yellow', 'ink', 1)
    f.text(176, 183, '!', 11, 'middle', 700)
    f.circle(176, 212, 7, 'sunk', 'ink', 2)
    f.circle(176, 212, 2.5, 'ink')
    f.rect(166, 244, 20, 16, 3, 'panel-edge', 'panel-ink', 1.5)
    f.circle(176, 252, 3, 'panel-ink')
    f.rect(166, 292, 20, 30, 3, 'panel-edge', 'panel-ink', 1.5)
    f.rect(170, 296, 12, 12, 1, 'ok')
    f.path('M96 302 H124 L120 330 H100 Z', 'panel-ink', 1.5, fill='panel-edge')
    f.rect(36, 288, 48, 54, 3, 'accent-soft')
    f.poly('60,296 69,312 51,312', 'led-yellow', 'ink', 1)
    f.text(60, 332, '触电危险', 9, 'middle', 700)
    marks = [(1, 180, 86), (2, 140, 63), (3, 120, 128), (4, 78, 196), (5, 78, 252), (6, 138, 188),
             (7, 138, 226), (8, 138, 264), (9, 138, 316), (10, 198, 212)]
    for n, x, y in marks:
        f.badge(x, y, n, 8)
    f.badge(176, 232, 11, 8, 'ok')
    f.badge(200, 307, 12, 8, 'ok')
    # legend
    f.text(240, 44, '后面板（按手册照片简化绘制）', 12, weight=700, color='muted')
    items = [(1, 'USB 端口（B 型）'), (2, 'K 型热电偶输入'), (3, '出风风扇 ×2'), (4, 'I Monitor BNC'),
             (5, 'E Monitor BNC'), (6, 'Aux In BNC（±3 V）'), (7, 'Sig Gen Out BNC'), (8, 'Ext Sig In BNC'),
             (9, 'Misc I/O（15 针）'), (10, 'Chassis Ground 接地柱'), (11, 'Power In（22–26 V DC）', 'ok'),
             (12, 'Power 电源开关', 'ok')]
    f.legend(items[:6], 240, 72, 24, 8, 11.5)
    f.legend(items[6:], 420, 72, 24, 8, 11.5)
    f.text(240, 226, '4–8 号 BNC 的外壳都接仪器浮地，', 11, color='muted')
    f.text(240, 242, '接到示波器等接地设备会让仪器失去浮地。', 11, color='muted')
    # power path
    f.text(435, 284, '输入 100–240 VAC · 47–63 Hz', 11, 'middle', color='muted')
    f.rect(380, 296, 110, 60, 8, 'panel', 'panel-edge')
    f.text(435, 321, '电源适配器', 12, 'middle', 700, 'panel-ink')
    f.text(435, 340, '输出 24 V DC', 11, 'middle', color='panel-ink')
    f.rect(536, 298, 44, 52, 6, 'sunk', 'rule')
    f.rect(548, 314, 5, 14, 1, 'ink')
    f.rect(563, 314, 5, 14, 1, 'ink')
    f.text(558, 368, '墙插', 11, 'middle', color='muted')
    f.path('M536 324 H490', 'ink', 2.5)
    f.text(513, 316, '电源线', 10.5, 'middle', color='muted')
    f.text(513, 342, 'IEC C13', 10.5, 'middle', color='muted')
    f.path('M380 326 C 300 326, 250 252, 188 252', 'ink', 2.5)
    f.text(318, 336, '24 V DC', 11, 'middle', color='muted')
    f.text(20, 390, '上电顺序：适配器接 Power In → 电源线接墙插 → 打开电源开关。先不要接 USB 和电解池电缆。', 11.5)
    f.text(20, 410, '只用随机适配器；输入低于 20 V 或高于 32 V 会损坏仪器电源。', 11.5, weight=700, color='danger')
    return f


def install_05():
    f = Fig('install-05-selftest', 600, 322,
            '上电自检：打开电源开关后 Power 灯亮一两秒、闪 3 次、然后常亮为正常；亮后熄灭不再亮或出现两段闪码表示故障；运行中在 GIM 点 Blink 会让它闪 5 次。')
    f.path('M150 30 V262', 'muted', 1.2, dash='4 4')
    rows = [(48, '正常', 'ok'), (108, '未正常工作', 'danger'), (168, '故障闪码', 'danger'), (228, '运行中按 Blink', 'accent')]
    for y, sub, c in rows:
        f.text(20, y + 12, 'Power 灯', 13, weight=700)
        f.text(20, y + 29, sub, 11.5, weight=600, color=c)
        f.path(f'M150 {y+24} H570', 'rule', 1.5)
    for a, b in [(150, 230), (250, 270), (290, 310), (330, 350), (370, 570)]:
        f.rect(a, 48, b - a, 24, 2, 'led-blue')
    f.text(190, 41, '亮一两秒', 11, 'middle', color='muted')
    f.text(300, 41, '闪 3 次', 11, 'middle', color='muted')
    f.text(470, 41, '常亮 = 自检通过', 11.5, 'middle', 700, 'ok')
    f.rect(150, 108, 80, 24, 2, 'led-blue')
    f.text(400, 125, '亮后熄灭、不再亮 → 联系 Gamry', 12, 'middle', 700, 'danger')
    for a, b in [(150, 230), (246, 258), (270, 282), (306, 318), (330, 342), (354, 366)]:
        f.rect(a, 168, b - a, 24, 2, 'led-blue')
    f.text(264, 162, '2 次', 10, 'middle', color='muted')
    f.text(336, 162, '3 次', 10, 'middle', color='muted')
    f.text(478, 185, '两段闪码 = 模块故障，联系 Gamry', 11.5, 'middle', 700, 'danger')
    for a, b in [(150, 250), (262, 274), (286, 298), (310, 322), (334, 346), (358, 370), (382, 410)]:
        f.rect(a, 228, b - a, 24, 2, 'led-blue')
    f.text(316, 222, '闪 5 次', 10, 'middle', color='muted')
    f.text(495, 245, 'GIM 中点 Blink：闪 5 次', 11.5, 'middle', 600, 'accent')
    f.arrow('M150 272 H574')
    f.text(156, 290, '打开电源开关', 11.5, weight=600)
    f.text(574, 290, '时间', 11.5, 'end', color='muted')
    f.text(20, 312, '第 4 行发生在正常运行期间。时间比例为示意；完整闪码表见手册附录 E。', 11, color='muted')
    return f


def install_06():
    f = Fig('install-06-connect', 600, 416,
            '连接：USB A/B 线方口接后面板 USB 口，电解池电缆插前面板 Cell Cable 接口并拧紧两颗滚花螺丝；Framework 设备状态栏绿灯表示可用，USB 灯常红时是在更新固件，不能断电。')
    # front panel
    f.rect(20, 30, 150, 300, 10, 'panel-edge')
    f.rect(28, 38, 134, 284, 6, 'panel')
    f.text(95, 66, 'Reference 620', 12.5, 'middle', 700, 'panel-ink')
    f.text(95, 80, 'Potentiostat/Galvanostat/ZRA', 7.5, 'middle', color='panel-ink')
    f.text(122, 124, 'Cell On', 9.5, 'end', color='panel-ink')
    f.circle(134, 121, 4, 'led-off')
    f.text(122, 142, 'Overload', 9.5, 'end', color='panel-ink')
    f.circle(134, 139, 4, 'led-off')
    f.rect(127, 162, 14, 84, 4, 'panel-edge', 'panel-ink', 1.5)
    f.text(120, 208, 'Cell Cable', 9.5, 'end', color='panel-ink')
    f.circle(134, 155, 3.5, 'bg', 'accent', 1.8)
    f.circle(134, 253, 3.5, 'bg', 'accent', 1.8)
    f.rect(38, 264, 50, 16, 2, 'accent')
    f.text(63, 276, '序列号', 9, 'middle', 700, 'accent-ink')
    f.circle(44, 296, 4, 'led-blue')
    f.text(54, 299.5, 'Power', 9.5, color='panel-ink')
    f.circle(44, 312, 4, 'led-green')
    f.text(54, 315.5, 'USB', 9.5, color='panel-ink')
    f.text(95, 346, '前面板', 11.5, 'middle', 600, 'muted')
    f.path('M138 151 L176 130', 'accent', 1.2)
    f.text(178, 126, '拧紧两颗滚花螺丝', 12, weight=700, color='accent')
    f.path('M141 204 H206', 'wire', 8)
    for i, (k, lab) in enumerate([('we', 'WE 绿'), ('ws', 'WS 蓝'), ('re', 'RE 白'), ('ce', 'CE 红'), ('cs', 'CS 橙'), ('gnd', '地 黑')]):
        y = 156 + i * 18
        f.wire(f'M206 204 C 230 204, 236 {y}, 262 {y}', k, 2.6)
        f.rect(262, y - 4, 10, 8, 2, k, 'wire', 1)
        f.text(278, y + 4, lab, 11)
    f.badge(176, 204, 2)
    # rear panel top
    f.text(290, 34, '后面板顶部', 11, 'middle', color='muted')
    f.rect(220, 40, 140, 66, 6, 'panel', 'panel-edge')
    f.rect(228, 48, 40, 26, 2, 'accent-soft')
    f.rect(282, 50, 12, 20, 2, 'tc', 'ink', 1)
    f.text(288, 94, 'T/C', 9.5, 'middle', color='panel-ink')
    f.rect(326, 52, 20, 16, 2, 'sunk', 'ink', 1)
    f.text(336, 94, 'USB', 9.5, 'middle', color='panel-ink')
    # computer
    f.rect(400, 40, 180, 112, 8, 'sunk', 'rule')
    f.rect(408, 48, 164, 92, 4, 'bg')
    f.text(416, 66, '设备状态栏', 11, weight=700)
    f.text(566, 66, 'Framework', 9.5, 'end', color='muted', mono=True)
    f.circle(422, 86, 5, 'led-green', 'wire', 1)
    f.text(432, 90, '绿：可用', 11)
    f.circle(422, 106, 5, 'led-orange', 'wire', 1)
    f.text(432, 110, '橙：正在运行实验', 11)
    f.circle(422, 126, 5, 'bg', 'wire', 1.2)
    f.text(432, 130, '白：已连接但不可用', 11)
    f.rect(482, 152, 16, 10, 0, 'rule')
    f.rect(460, 162, 60, 5, 2, 'rule')
    f.path('M400 100 C 375 100, 362 60, 348 60', 'ink', 2.5)
    f.badge(370, 80, 1)
    f.badge(400, 40, 3)
    f.text(490, 186, 'USB A/B 线：方口端接仪器', 11, 'middle', color='muted')
    # USB LED states
    f.rect(380, 200, 200, 124, 8, 'sunk')
    f.text(392, 222, '前面板 USB 灯', 12, weight=700)
    for i, (c, t, w, tc) in enumerate([('led-green', '常绿：连接正常', 400, 'ink'),
                                       ('led-orange', '闪烁：正在收发数据', 400, 'ink'),
                                       ('led-red', '常红：固件更新，勿断电', 700, 'danger'),
                                       ('led-off', '不亮：未供电或未连接', 400, 'muted')]):
        y = 244 + i * 22
        f.circle(398, y - 4, 5, c, 'wire', 1)
        f.text(410, y, t, 11.5, weight=w, color=tc)
    f.legend([(1, 'USB 线接后面板 USB 口（可热插拔）'), (2, '电解池电缆插前面板，拧紧两颗滚花螺丝'),
              (3, '打开 Framework：GIM 自动弹出，状态灯为绿即可用')], 20, 368, 21)
    return f


def install_07():
    f = Fig('install-07-calibration', 600, 468,
            'Calibrate Instrument：尽可能把后面板 Chassis Ground 接可靠大地，电缆按颜色接 200 Ω 校准池上标注的插孔，放进校准屏蔽盒盖好，黑线接盒上接地柱，再从 Framework 的 Experiment › Utilities 启动；出现警告先复查接线并 Retry，仍失败就把摘要文件附在技术支持表单中。')
    f.rect(20, 92, 84, 72, 6, 'panel', 'panel-edge')
    f.text(62, 126, 'R620', 13, 'middle', 700, 'panel-ink')
    f.text(62, 146, '后面板', 10, 'middle', color='panel-ink')
    f.path('M36 164 V176', 'ink', 2)
    f.circle(36, 182, 6, 'sunk', 'ink', 2)
    f.wire('M36 188 V224', 'gnd', 2.5)
    f.ground(36, 228)
    f.text(56, 240, '可靠大地', 11, color='muted')
    f.badge(60, 196, 1)
    f.path('M104 128 H140', 'wire', 7)
    f.rect(182, 54, 186, 10, 3, 'ink')
    f.text(275, 44, '盖好屏蔽盒盖', 11.5, 'middle', color='muted')
    f.rect(188, 64, 174, 148, 4, 'sunk', 'ink', 2)
    # 200 ohm calibration cell, receptacles labelled as on the QSG photo
    f.rect(198, 94, 158, 100, 6, 'bg', 'accent', 2)
    f.text(277, 116, '200 Ω 校准池', 12.5, 'middle', 700, 'accent')
    jacks = [(212, 'we', 'WE'), (238, 'ws', 'WS'), (277, 're', 'RE'), (314, 'cs', 'CS'), (340, 'ce', 'CE')]
    for x, k, lab in jacks:
        f.wire(f'M140 128 C 175 128, {x} 100, {x} 144', k, 2.4)
    for x, k, lab in jacks:
        f.circle(x, 152, 8, 'wire')
        f.circle(x, 152, 5.5, k)
        f.text(x, 178, lab, 9.5, 'middle', 700)
    f.path('M182 196 H188', 'ink', 2)
    f.circle(176, 196, 6, 'sunk', 'ink', 2)
    f.wire('M140 128 C 150 176, 156 196, 170 196', 'gnd', 2.5)
    f.text(168, 224, '黑线接盒上接地柱', 11, 'end', color='muted')
    f.text(275, 234, '校准屏蔽盒', 12, 'middle', 700)
    f.text(275, 250, 'Calibration Shield', 10.5, 'middle', color='muted')
    f.badge(198, 94, 2)
    f.badge(372, 59, 3)
    f.text(400, 40, 'Framework：Experiment › Utilities', 11, color='muted')
    steps = ['Calibrate Instrument', 'Performance Tips → OK', 'Cell Required → OK', '自动运行，提示是否成功',
             'Save：Yes 新数据 / No 原数据']
    for i, t in enumerate(steps):
        y = 56 + i * 44
        f.rect(400, y, 190, 32, 6, 'accent-soft' if i == 0 else 'sunk', 'accent' if i == 0 else 'rule', 1.2)
        f.text(495, y + 21, t, 11.5, 'middle', 700 if i == 0 else 500, mono=(i == 0))
        if i < 4:
            f.arrow(f'M495 {y+32} V{y+42}')
    f.badge(400, 56, 4)
    f.badge(400, 100, 5)
    f.arrow('M495 264 V274')
    f.rect(400, 276, 190, 24, 5, 'sunk')
    f.text(408, 292, '.CalData 备份 → CalBackup', 10.5)
    f.rect(400, 304, 190, 24, 5, 'sunk')
    f.text(408, 320, '摘要 .txt → My Gamry Data', 10.5)
    f.text(400, 344, '成功或失败都会生成摘要文件', 10.5, color='muted')
    f.legend([(1, '尽可能把后面板 Chassis Ground 接可靠大地'), (2, '电缆按颜色接 200 Ω 校准池对应插孔'),
              (3, '放入屏蔽盒并盖好；黑线接盒上接地柱'), (4, 'Experiment › Utilities › Calibrate Instrument'),
              (5, '确认提示后自动运行；结果选 Save')], 20, 284, 20)
    f.text(20, 396, '出现警告或失败时（警告不一定是严重故障）', 12, weight=700, color='muted')
    for n, x, a, b in [(1, 20, '复查接线', '200 Ω 池、黑线、机壳接地'),
                       (2, 213, '点 Retry', '重跑剩余部分；其他警告 Ignore'),
                       (3, 406, '仍失败', '摘要文件附在技术支持表单中')]:
        f.rect(x, 406, 184, 52, 8, 'warn-soft', 'warn', 1)
        f.badge(x + 18, 424, n, 8, 'warn')
        f.text(x + 32, 428, a, 12, weight=700)
        f.text(x + 12, 448, b, 10.5, color='muted')
    return f


# ================================================================== use
def use_01():
    f = Fig('use-01-three-electrode', 600, 362,
            '三电极原理：电流经绿线、溶液和红线流过工作电极与对电极；蓝线和白线只感应电压，静电计测得的 E 反馈给控制放大器。橙线只在 ZRA 模式起作用，黑线是仪器浮地。')
    f.rect(20, 36, 200, 268, 8, 'none', 'muted', 1.5, '6 5')
    f.text(32, 56, 'Reference 620 内部（简化）', 11.5, color='muted')
    f.rect(36, 72, 160, 56, 6, 'accent-soft', 'accent')
    f.text(116, 95, '差分静电计', 12, 'middle', 700)
    f.text(116, 115, 'E = 蓝、白之间电压', 11.5, 'middle', 600, 'accent')
    f.arrow('M116 128 V146', 'accent')
    f.text(124, 142, '反馈', 10.5, weight=600, color='accent')
    f.rect(36, 148, 160, 56, 6, 'sunk', 'ink', 1.2)
    f.text(116, 171, '控制放大器', 12, 'middle', 700)
    f.text(116, 191, '输出经红线到对电极', 11, 'middle', color='muted')
    f.rect(36, 224, 160, 56, 6, 'sunk', 'ink', 1.2)
    f.text(116, 247, '电流测量 I/E', 12, 'middle', 700)
    f.text(116, 267, '测流过绿线的电流 i', 11, 'middle', color='muted')
    f.rect(332, 150, 246, 144, 0, 'solution')
    f.path('M330 96 V284 Q330 296 342 296 H568 Q580 296 580 284 V96', 'muted', 2)
    for x, a, b in [(390, '工作电极', 'WE'), (462, '参比电极', 'RE'), (538, '对电极', 'CE')]:
        f.rect(x - 5, 74, 10, 170, 2, 'electrode')
        f.text(x, 264, a, 11.5, 'middle', 700)
        f.text(x, 280, b, 10.5, 'middle', color='muted')
    f.wire('M196 92 C 290 92, 386 40, 386 74', 'ws', 3)
    f.wire('M196 110 C 310 110, 462 30, 462 74', 're', 3)
    f.wire('M196 176 C 330 176, 534 18, 534 74', 'ce', 3)
    f.wire('M196 196 C 340 196, 543 8, 543 74', 'cs', 2.4)
    f.wire('M196 252 C 300 252, 394 30, 394 74', 'we', 3)
    f.wire('M196 272 H258', 'gnd', 3)
    f.circle(263, 272, 4, 'bg', 'wire', 1.5)
    f.text(272, 276, '悬空', 10.5, color='muted')
    f.arrow('M398 168 H454', 'accent', 2, both=True)
    f.text(426, 162, 'E', 13, 'middle', 700, 'accent')
    f.arrow('M398 220 H530', 'warn', 2.5, both=True)
    f.text(500, 212, '电流 i', 12, 'middle', 700, 'warn')
    f.swatch(20, 326, 'we')
    f.swatch(48, 326, 'ce')
    f.text(78, 330, '绿 WE、红 CE：承载电流', 12)
    f.swatch(300, 326, 'ws')
    f.swatch(328, 326, 're')
    f.text(358, 330, '蓝 WS、白 RE：只感应电压', 12)
    f.swatch(20, 348, 'cs')
    f.text(50, 352, '橙 CS：仅 ZRA 需要，常规可接 CE', 12)
    f.swatch(300, 348, 'gnd')
    f.text(330, 352, '黑：浮地，悬空或接法拉第屏蔽', 12)
    return f


def use_02():
    f = Fig('use-02-cv-workflow', 600, 318,
            'CV 实验流程：准备、接线、选实验、设参数和测开路电位时 Cell On 黄灯熄灭；极化扫描时黄灯亮；结束灯灭后再拆线，最后用 Echem Analyst 2 分析。')
    f.circle(26, 20, 5, 'led-yellow', 'wire', 1)
    f.text(38, 24, '圆点 = 前面板 Cell On 黄灯状态', 11.5, color='muted')
    steps = [
        (20, 40, '准备电解池', '低电流用法拉第屏蔽', False, '灭'),
        (170, 40, '按配置接线', '参比靠近 WE', False, '灭 · 可接线'),
        (320, 40, '选择 CV 实验', '在 Framework 中', False, '灭'),
        (470, 40, '设置参数', 'Scan Rate 等', False, '灭'),
        (20, 170, '测开路电位', 'OCP 阶段', False, '灭'),
        (170, 170, '极化扫描', '留意 Overload 灯', True, '亮 · 勿触碰'),
        (320, 170, '结束后拆线', '等黄灯熄灭', False, '灭 · 可拆线'),
        (470, 170, '分析数据', 'Echem Analyst 2', False, '灭'),
    ]
    for i, (x, y, t, s, on, pill) in enumerate(steps):
        f.rect(x, y, 110, 64, 8, 'warn-soft' if on else 'sunk', 'warn' if on else 'rule')
        f.text(x + 55, y + 30, t, 13, 'middle', 700)
        f.text(x + 55, y + 50, s, 10.5, 'middle', color='muted')
        f.rect(x, y + 72, 110, 22, 11, 'warn-soft' if on else 'sunk')
        f.circle(x + 13, y + 83, 5, 'led-yellow' if on else 'rule', 'wire', 1)
        f.text(x + 62, y + 87, pill, 11, 'middle', 700 if on else 500, 'warn' if on else 'muted')
    for i, (x, y, *_r) in enumerate(steps):
        f.badge(x + 2, y + 2, i + 1)
    for x in (130, 280, 430):
        f.arrow(f'M{x} 72 H{x+36}')
        f.arrow(f'M{x} 202 H{x+36}')
    f.arrow('M525 134 V150 H75 V166')
    f.text(20, 290, '黄灯亮表示电解池正在被极化，不代表危险电压；触碰导线会影响数据。', 11.5, color='muted')
    f.text(20, 308, '改接线请在两次实验之间、黄灯熄灭时进行。', 11.5, weight=700)
    return f


def use_03():
    f = Fig('use-03-zra', 600, 340,
            'ZRA 电偶测量：仪器保持蓝线与橙线之间为 0 V，使两块金属同电位，并测量它们之间的电偶电流 Ig；白线接参比电极记录电位。')
    f.rect(20, 40, 200, 206, 8, 'none', 'muted', 1.5, '6 5')
    f.text(32, 60, 'Reference 620（ZRA 模式）', 11.5, color='muted')
    f.rect(36, 74, 168, 110, 6, 'accent-soft', 'accent')
    f.text(120, 100, '零阻电流计 ZRA', 13, 'middle', 700)
    f.text(120, 122, '反馈 Zsig = 橙 − 蓝', 11.5, 'middle')
    f.text(120, 144, '保持为 0 V', 13, 'middle', 700, 'accent')
    f.text(120, 168, '测量电偶电流 I<tspan dy="3" style="font-size:9px">g</tspan>', 11.5, 'middle', raw=True)
    f.rect(36, 198, 168, 34, 6, 'sunk', 'ink', 1.2)
    f.text(120, 220, '静电计：参比与蓝线之间', 11.5, 'middle')
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
    f.text(380, 258, '金属 1', 11.5, 'middle', 700)
    f.text(450, 258, '参比', 11.5, 'middle', 700)
    f.text(520, 258, '金属 2', 11.5, 'middle', 700)
    f.text(455, 302, 'I<tspan dy="3" style="font-size:9px">g</tspan><tspan dy="-3">：在仪器内被测量，在溶液中以离子电流流动</tspan>',
           11.5, 'middle', color='muted', raw=True)
    f.text(32, 270, '绿 + 蓝 → 金属 1', 11.5)
    f.text(32, 288, '红 + 橙 → 金属 2（橙线必须接）', 11.5)
    f.text(32, 306, '白 → 参比电极', 11.5)
    f.text(32, 330, '没有参比电极时：白线接金属 1，读数接近 0。', 11.5, weight=600, color='accent')
    return f


def use_04():
    f = Fig('use-04-low-current', 600, 364,
            '低电流测量：法拉第屏蔽是连续导体，完全包住电解池并接黑色浮地线；电解池与大地隔离时，屏蔽和浮地还可再接大地；电缆尽量短，导线分开且实验中不要移动。')
    f.rect(20, 128, 70, 70, 6, 'panel', 'panel-edge')
    f.text(55, 167, 'R620', 12.5, 'middle', 700, 'panel-ink')
    f.path('M90 163 H150', 'wire', 7)
    f.text(120, 150, '电缆 ≤ 1 m', 11, 'middle', color='muted')
    f.rect(150, 40, 250, 250, 6, 'none', 'cage', 3)
    f.rect(146, 150, 8, 26, 0, 'bg')
    f.text(162, 60, '法拉第屏蔽：连续导体，上下也包住', 11, color='muted')
    f.rect(222, 150, 126, 116, 0, 'solution')
    f.path('M220 120 V258 Q220 270 232 270 H338 Q350 270 350 258 V120', 'muted', 2)
    for x, lab in [(250, 'WE'), (290, 'RE'), (330, 'CE')]:
        f.rect(x - 4, 96, 8, 144, 2, 'electrode')
        f.text(x, 258, lab, 10.5, 'middle', 700)
    f.wire('M152 158 C 196 158, 246 112, 246 96', 'we', 2.6)
    f.wire('M152 162 C 200 162, 254 116, 254 96', 'ws', 2.6)
    f.wire('M152 166 C 210 166, 290 92, 290 96', 're', 2.6)
    f.wire('M152 170 C 230 170, 328 80, 328 96', 'ce', 2.6)
    f.wire('M152 174 C 160 230, 166 280, 176 280', 'gnd', 2.6)
    f.circle(180, 280, 5, 'sunk', 'ink', 2)
    f.text(190, 284, '黑线接屏蔽', 11, weight=600)
    f.path('M400 290 V312', 'warn', 2, dash='5 4')
    f.ground(400, 314, 'warn')
    f.text(390, 342, '可选：屏蔽和浮地再接大地', 11, 'end', 700, 'warn')
    f.text(390, 358, '仅当电解池与大地隔离（如玻璃池）', 11, 'end', color='muted')
    f.text(420, 58, '低电流要点', 13, weight=700)
    tips = ['· 屏蔽连续、完全包住', '· WE/WS 与 CE/RE 导线分开', '· 实验中不要移动导线',
            '· 远离日光灯、电机、', '无线电发射机、电脑显示器', '· 参比电极阻抗要低',
            '· 测前做 Low I DC 校准']
    for i, t in enumerate(tips):
        f.text(420 if t.startswith('·') else 430, 84 + i * 22, t, 11.5)
    f.text(420, 84 + 7 * 22, '· EIS：|Z|·f &lt; 10<tspan dy="-4" style="font-size:8px">9</tspan><tspan dy="4"> Ω·Hz</tspan>',
           11.5, raw=True)
    return f


def use_05():
    f = Fig('use-05-stability', 600, 330,
            '振荡对策：先在软件中降低控制放大器速度、提高 I/E 稳定性设置；仍振荡时，可加快速组合参比电极、在红白线之间加高频旁路电容，或在对电极线上串电阻。')
    f.text(20, 24, '先在软件中降低控制放大器速度、提高 I/E 稳定性；仍振荡再试以下接法（手册第 8 章）', 11.5, color='muted')
    titles = ['快速组合参比电极', '高频旁路电容', '对电极线串电阻']
    for i, t in enumerate(titles):
        ox = 10 + i * 197
        f.rect(ox, 38, 186, 252, 10, 'none', 'rule', 1.2)
        f.text(ox + 93, 60, t, 13, 'middle', 700)
        f.rect(ox + 22, 160, 142, 50, 4, 'solution')
    # A: SCE + Pt via capacitor
    ox = 10
    f.wire(f'M{ox+20} 86 H{ox+92}', 're', 2.6)
    f.path(f'M{ox+92} 86 H{ox+70} V120', 'ink', 2)
    f.rect(ox + 62, 120, 16, 80, 4, 'sunk', 'ink', 1.2)
    f.text(ox + 70, 222, 'SCE', 10.5, 'middle', 700)
    f.cap(ox + 92, ox + 136, 86)
    f.path(f'M{ox+136} 86 V120', 'ink', 2)
    f.path(f'M{ox+136} 120 V200', 'electrode', 3.5)
    f.text(ox + 136, 222, 'Pt 丝', 10.5, 'middle', 700)
    f.text(ox + 114, 72, '100 pF–10 nF', 10, 'middle', 700, 'accent')
    f.text(ox + 14, 246, '直流电位来自 SCE，', 11)
    f.text(ox + 14, 262, '交流反馈来自 Pt 丝', 11)
    # B: capacitor between red and white
    ox = 207
    for x, k, lab in [(ox + 50, 'we', 'WE'), (ox + 100, 're', 'RE'), (ox + 150, 'ce', 'CE')]:
        f.wire(f'M{x} 74 V150', k, 2.6)
        f.rect(x - 4, 150, 8, 50, 2, 'electrode')
        f.text(x, 222, lab, 10.5, 'middle', 700)
    f.cap(ox + 100, ox + 150, 104)
    f.text(ox + 125, 92, '1 nF 起试', 10, 'middle', 700, 'accent')
    f.text(ox + 14, 246, '电容跨接红线与白线，', 11)
    f.text(ox + 14, 262, '100 pF–10 nF', 11)
    # C: resistor in counter lead
    ox = 404
    for x, k, lab in [(ox + 50, 'we', 'WE'), (ox + 100, 're', 'RE')]:
        f.wire(f'M{x} 74 V150', k, 2.6)
        f.rect(x - 4, 150, 8, 50, 2, 'electrode')
        f.text(x, 222, lab, 10.5, 'middle', 700)
    x = ox + 150
    f.wire(f'M{x} 74 V90', 'ce', 2.6)
    f.rect(x - 7, 90, 14, 36, 2, 'bg', 'ink', 1.6)
    f.wire(f'M{x} 126 V150', 'ce', 2.6)
    f.rect(x - 4, 150, 8, 50, 2, 'electrode')
    f.text(x, 222, 'CE', 10.5, 'middle', 700)
    f.text(x + 14, 112, 'R', 12, weight=700, color='accent')
    f.text(ox + 14, 246, 'R ≈ 1 V ÷ 最大电流', 11)
    f.text(ox + 14, 262, '例：1 mA → 1 kΩ', 11)
    f.text(ox + 14, 278, '快速 CV、EIS 慎用', 11)
    f.text(20, 314, '参比电极阻抗超过 20 kΩ 更易振荡；避免细口或 Vycor 头鲁金毛细管、双盐桥参比。', 11.5, color='muted')
    return f


# ================================================================== hazard
def hazard_grounding():
    f = Fig('hazard-grounding', 600, 404,
            '接地对比：样品已接地时，仪器保持浮地就没有回路；机壳也接大地时，大地把回路闭合，电解池经仪器放电，电缆保险丝熔断。辅助设备也可能把仪器意外接地。')
    for ox, bad in [(10, False), (305, True)]:
        c = 'danger' if bad else 'ink'
        f.rect(ox, 18, 285, 302, 10, 'none', 'rule', 1.2)
        f.icon(ox + 24, 44, 'bad' if bad else 'ok')
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
            f.text(ox + 73, 200, 'Chassis Ground', 10, color='danger')
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
            f.text(ox + 142, 300, '浮地设计就是为这类电解池准备的', 11, 'middle')
    f.text(10, 342, '这些连接也会把仪器意外接地：', 12, weight=700)
    for x, w, t in [(10, 186, 'Monitor BNC 接示波器'), (206, 190, 'Misc I/O 用标准 15 针屏蔽线'),
                    (406, 184, '未绝缘热电偶浸入电解池')]:
        f.rect(x, 354, w, 34, 8, 'warn-soft', 'warn', 1)
        f.text(x + w / 2, 376, t, 11.5, 'middle', 600)
    return f


FIGS = [install_00, install_01, install_02, install_03, install_04, install_05, install_06, install_07,
        use_01, use_02, use_03, use_04, use_05, hazard_grounding]


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
    global LANG
    LANG = 'en'
    os.makedirs(os.path.join(OUT, 'en'), exist_ok=True)
    for fn in FIGS:
        fig = fn()
        with open(os.path.join(OUT, 'en', fig.key + '.svg'), 'w', encoding='utf-8') as fh:
            fh.write(fig.svg())
    LANG = 'zh'
    print(f'wrote {len(built)} svgs (+ {len(FIGS)} in en/), inlined {n}')


if __name__ == '__main__':
    main()
