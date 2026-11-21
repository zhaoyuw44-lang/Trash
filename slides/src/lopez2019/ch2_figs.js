// Figures for Lopez et al. 2019, Chapter 2 (Designing binder and separator mechanics)
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- local helpers ----------
// Smooth open path through points (Catmull-Rom -> cubic Bezier)
function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
// Wiggly chain between two points
function wig(x1, y1, x2, y2, o = {}) {
  const R = rng(o.seed || 1);
  const n = o.n || 8, amp = o.amp ?? 10;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = i === 0 || i === n ? 0 : (Math.sin(t * Math.PI * (o.waves || 2) + (o.phase || 0)) * amp + (R() - 0.5) * amp);
    pts.push([x1 + dx * t + px * a, y1 + dy * t + py * a]);
  }
  return `<path d="${smooth(pts)}" fill="none" stroke="${o.color || COL.teal}" stroke-width="${o.w || 4}" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
}
const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;

// Vertical chapter strip used on the roadmap slide
function chapterStrip(cur) {
  const W = 400, H = 470;
  const chs = ["引言与先进电池体系", "粘结剂与隔膜的力学", "锂离子传输", "电子传输", "化学相互作用", "稳定界面", "安全与展望"];
  let b = "";
  chs.forEach((c, i) => {
    const y = 10 + i * 66;
    const n = i + 1;
    const isCur = n === cur, past = n < cur;
    const fill = isCur ? COL.amber : past ? "#E3E7EB" : "#FFFFFF";
    b += rect(40, y, 350, 50, fill, { rx: 25, stroke: isCur ? COL.amber : COL.line, sw: 2 });
    b += circ(65, y + 25, 17, isCur ? "#FFFFFF" : past ? COL.muted : COL.ink);
    b += text(65, y + 32, String(n), { size: 18, anchor: "middle", weight: "bold", fill: isCur ? COL.amber : "#FFFFFF" });
    b += text(95, y + 32, c, { size: 19, weight: isCur ? "bold" : "normal", fill: isCur ? "#FFFFFF" : past ? COL.text2 : COL.ink });
    if (i < 6) b += line(65, y + 44, 65, y + 70, COL.line, 3);
  });
  b += head(28, 10 + (cur - 1) * 66 + 25, 0, COL.amber, 18);
  return svg(W, H, b);
}
figs.chapter_strip = () => chapterStrip(2);

// ---------- Title motif ----------
figs.title_motif = () => {
  const W = 520, H = 520;
  let b = "";
  // Si particle in the middle, held by a network
  b += blob(260, 270, 92, 4, { fill: COL.si, stroke: "#FFFFFF", sw: 4, jag: 0.12 });
  const nodes = [[90, 110], [260, 70], [430, 120], [460, 290], [410, 450], [250, 470], [90, 430], [55, 270]];
  nodes.forEach(([x, y], i) => {
    const [x2, y2] = nodes[(i + 1) % nodes.length];
    b += wig(x, y, x2, y2, { seed: 10 + i, amp: 16, color: COL.tealLight, w: 6 });
    // spoke to the particle (spring-like)
    const a = Math.atan2(y - 270, x - 260);
    const ex = 260 + 98 * Math.cos(a), ey = 270 + 98 * Math.sin(a);
    b += wig(x, y, ex, ey, { seed: 30 + i, amp: 9, n: 10, waves: 4, color: COL.amberLight, w: 5 });
  });
  nodes.forEach(([x, y]) => (b += circ(x, y, 13, COL.amber, { stroke: "#FFFFFF", sw: 3 })));
  return svg(W, H, b);
};

// ---------- Chapter timeline ----------
figs.mech_timeline = () => {
  const W = 1100, H = 400;
  const ev = [
    { year: "1839", who: ["Goodyear"], what: ["硫化橡胶", "第一种化学交联"], color: COL.text2 },
    { year: "1867", who: ["Maxwell"], what: ["弹簧 + 阻尼器", "黏弹性模型"], color: COL.text2 },
    { year: "1920", who: ["Staudinger"], what: ["提出“大分子”", "概念"], color: COL.text2 },
    { year: "2003", who: ["Chen & Dahn"], what: ["弹性粘结剂", "用于合金负极"], color: COL.teal },
    { year: "2005", who: ["Monroe & Newman"], what: ["高剪切模量", "压制枝晶判据"], color: COL.purple },
    { year: "2008", who: ["Leibler 等"], what: ["氢键", "自修复橡胶"], color: COL.text2 },
    { year: "2013", who: ["Wang, Bao, Cui 等"], what: ["自修复", "Si 粘结剂"], color: COL.teal },
    { year: "2017", who: ["Choi, Coskun 等"], what: ["聚轮烷", "弹性粘结剂"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 195, left: 75, right: 1010, whoSize: 18, whatSize: 17, yearSize: 26 }));
};

// ---------- Stress–strain curve (Fig. 3a) ----------
figs.stress_strain = () => {
  const W = 640, H = 470;
  let b = "";
  const O = [80, 370];
  // curve points: elastic to (200,170), yield (220,150), plateau rising to (540,122)
  const curve = [[80, 370], [140, 270], [200, 170], [222, 150], [250, 152], [330, 145], [430, 134], [540, 122]];
  const d = smooth(curve);
  // toughness area
  b += `<path d="${d} L540,370 L80,370 Z" fill="${COL.amberLight}" opacity="0.85"/>`;
  // resilience area (elastic part only)
  b += `<path d="${smooth(curve.slice(0, 4))} L222,370 Z" fill="${COL.purpleLight}"/>`;
  b += line(222, 60, 222, 370, COL.muted, 2, "6 5");
  b += `<path d="${d}" fill="none" stroke="${COL.ink}" stroke-width="5" stroke-linecap="round"/>`;
  // axes
  b += line(O[0], O[1], 610, O[1], COL.ink, 3) + head(616, O[1], 0, COL.ink, 14);
  b += line(O[0], O[1], O[0], 40, COL.ink, 3) + head(O[0], 34, -Math.PI / 2, COL.ink, 14);
  b += text(345, 458, "应变 Strain = 伸长 ÷ 原长", { size: 18, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(40 215) rotate(-90)">` + text(0, 0, "应力 Stress = 力 ÷ 截面积", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  // region labels
  b += text(150, 62, "弹性形变", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(380, 62, "塑性形变（不可恢复）", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  // slope triangle
  b += `<polyline points="122,300 172,300 172,217" fill="none" stroke="${COL.teal}" stroke-width="3"/>`;
  b += lines(92, 158, ["杨氏模量 E", "= 初始斜率"], { size: 16, fill: COL.teal, weight: "bold", lh: 21 });
  b += line(140, 186, 160, 240, COL.teal, 1.5);
  // yield
  b += circ(222, 150, 8, COL.ink);
  b += text(232, 182, "屈服点 Yield", { size: 17, weight: "bold" });
  // tensile strength
  b += line(O[0], 122, 532, 122, COL.red, 2, "5 5");
  b += text(300, 112, "拉伸强度 = 最大应力", { size: 16, fill: COL.red, weight: "bold" });
  b += cross(540, 122, 11, COL.red, 4);
  b += text(560, 104, "断裂", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += line(540, 132, 540, 370, COL.red, 2, "5 5");
  // area labels
  b += text(196, 352, "回弹能", { size: 16, anchor: "end", weight: "bold", fill: COL.purple });
  b += text(390, 260, "韧性 Toughness", { size: 19, anchor: "middle", weight: "bold", fill: "#A35A12" });
  b += text(390, 286, "= 曲线下总面积", { size: 16, anchor: "middle", fill: "#A35A12" });
  // elongation at break
  b += arrow(O[0] + 4, 395, 536, 395, { color: COL.text2, width: 2, head: 10 });
  b += text(310, 420, "断裂伸长率", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Hard-brittle vs soft-tough ----------
figs.hard_soft = () => {
  const W = 600, H = 390;
  let b = "";
  const O = [70, 320];
  const hard = [[70, 320], [110, 220], [150, 115], [168, 82]];
  const soft = [[70, 320], [130, 255], [200, 222], [320, 208], [450, 196], [550, 186]];
  b += `<path d="${smooth(soft)} L550,320 Z" fill="${COL.tealLight}" opacity="0.8"/>`;
  b += `<path d="${smooth(hard)} L168,320 Z" fill="${COL.redLight}" opacity="0.9"/>`;
  b += `<path d="${smooth(hard)}" fill="none" stroke="${COL.red}" stroke-width="5" stroke-linecap="round"/>`;
  b += `<path d="${smooth(soft)}" fill="none" stroke="${COL.teal}" stroke-width="5" stroke-linecap="round"/>`;
  b += cross(168, 82, 10, COL.red, 4) + cross(550, 186, 10, COL.teal, 4);
  b += line(O[0], O[1], 580, O[1], COL.ink, 3) + head(586, O[1], 0, COL.ink, 13);
  b += line(O[0], O[1], O[0], 40, COL.ink, 3) + head(O[0], 34, -Math.PI / 2, COL.ink, 13);
  b += text(330, 352, "应变", { size: 18, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(38 180) rotate(-90)">` + text(0, 0, "应力", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  b += lines(190, 70, ["硬而脆", "模量高、面积小"], { size: 17, fill: COL.red, weight: "bold", lh: 22 });
  b += lines(330, 150, ["软而韧", "模量低、面积大"], { size: 17, fill: COL.teal, weight: "bold", lh: 22 });
  b += text(310, 280, "面积 = 断裂所需能量（韧性）", { size: 17, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Molecular origins of mechanics ----------
figs.chain_origin = () => {
  const W = 1000, H = 330;
  let b = "";
  const panel = (x, title, col) => {
    let s = rect(x, 10, 310, 250, "#F7F9FB", { rx: 14, stroke: COL.line });
    s += text(x + 155, 300, title, { size: 19, anchor: "middle", weight: "bold", fill: col });
    return s;
  };
  // 1: short vs long chains
  b += panel(10, "分子量 ↑：缠结多 → 更强更韧", COL.teal);
  const R = rng(4);
  for (let i = 0; i < 7; i++) {
    const x = 30 + R() * 90, y = 40 + R() * 190;
    b += wig(x, y, x + 30 + R() * 20, y + (R() - 0.5) * 40, { seed: 50 + i, amp: 6, n: 4, color: COL.si, w: 4 });
  }
  b += arrow(140, 135, 180, 135, { color: COL.ink, width: 3, head: 12 });
  const longs = [[195, 40, 300, 240], [190, 230, 305, 50], [195, 140, 305, 120], [240, 30, 260, 245], [200, 80, 300, 200]];
  const longCols = [COL.teal, "#178078", COL.tealLight, "#2E9C95", "#5DB5AE"];
  longs.forEach(([x1, y1, x2, y2], i) => (b += wig(x1, y1, x2, y2, { seed: 70 + i, amp: 18, n: 10, waves: 3, color: longCols[i], w: 4 })));
  // 2: crystalline vs branched
  b += panel(345, "支化 → 结晶度 ↓ → 模量 ↓", COL.amber);
  // folded-chain lamella
  let fold = "M365,60";
  for (let k = 0; k < 7; k++) {
    const x = 370 + k * 14;
    fold += ` L${x},60 L${x},210 L${x + 7},210 L${x + 7},60`;
  }
  b += `<path d="${fold}" fill="none" stroke="${COL.amber}" stroke-width="3.5" stroke-linejoin="round"/>`;
  b += text(410, 240, "折叠链结晶", { size: 15, anchor: "middle", fill: COL.text2 });
  b += arrow(475, 135, 510, 135, { color: COL.ink, width: 3, head: 12 });
  // branched chain
  b += wig(525, 135, 640, 135, { seed: 91, amp: 10, n: 8, color: COL.amber, w: 4 });
  [[545, 1], [575, -1], [600, 1], [625, -1]].forEach(([x, s], i) => (b += wig(x, 135, x + 10, 135 + s * 70, { seed: 95 + i, amp: 6, n: 4, color: COL.amberLight, w: 4 })));
  b += text(585, 240, "支链挡住紧密堆积", { size: 15, anchor: "middle", fill: COL.text2 });
  // 3: crosslinking
  b += panel(680, "交联 → 形成网络 → 更稳定", COL.purple);
  const nodes = [[720, 60], [830, 55], [950, 70], [740, 150], [850, 145], [960, 160], [715, 235], [835, 240], [955, 235]];
  const edges = [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8]];
  edges.forEach(([i, j], k) => (b += wig(nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1], { seed: 120 + k, amp: 9, n: 6, color: COL.purpleLight, w: 4 })));
  nodes.forEach(([x, y]) => (b += circ(x, y, 9, COL.purple)));
  return svg(W, H, b);
};

// ---------- Crosslinked network (Fig. 3b) ----------
figs.crosslink = () => {
  const W = 640, H = 450;
  let b = "";
  const nodes = [[80, 70], [230, 50], [380, 80], [540, 60], [120, 180], [290, 170], [460, 190], [600, 170], [70, 270], [240, 280], [400, 265], [560, 285]];
  const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [4, 8], [5, 9], [6, 10], [7, 11], [8, 9], [9, 10], [10, 11]];
  edges.forEach(([i, j], k) => (b += wig(nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1], { seed: 200 + k, amp: 14, n: 7, waves: 2.5, color: COL.amber, w: 4.5 })));
  // dangling ends
  [[0, -30, -20], [3, 40, -30], [8, -40, 30], [11, 40, 30]].forEach(([i, dx, dy], k) => (b += wig(nodes[i][0], nodes[i][1], nodes[i][0] + dx, nodes[i][1] + dy, { seed: 260 + k, amp: 5, n: 3, color: COL.amber, w: 4.5 })));
  nodes.forEach(([x, y]) => (b += circ(x, y, 11, COL.ink, { stroke: "#FFFFFF", sw: 2.5 })));
  b += text(320, 330, "● 交联点 Crosslink：把链“钉”在一起", { size: 17, anchor: "middle", weight: "bold" });
  // two legend boxes
  b += rect(20, 350, 290, 90, "#FDF2E7", { rx: 12 });
  b += text(165, 378, "物理交联 Physical", { size: 17, anchor: "middle", weight: "bold", fill: "#A35A12" });
  b += text(165, 404, "相分离 · 缠结 · 氢键", { size: 16, anchor: "middle" });
  b += text(165, 428, "可逆，受热/受力会松开", { size: 16, anchor: "middle", fill: COL.text2 });
  b += rect(330, 350, 290, 90, "#F1ECF8", { rx: 12 });
  b += text(475, 378, "化学交联 Chemical", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(475, 404, "共价键 · 支化单体 · 动态共价键", { size: 16, anchor: "middle" });
  b += text(475, 428, "牢固，网络形状被“记住”", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Self-healing via dynamic bonds ----------
figs.self_heal = () => {
  const W = 720, H = 320;
  let b = "";
  const pair = (x, y, broken, side) => {
    // a dynamic bond: two small half-circles; when broken show stubs
    if (!broken) return line(x - 12, y, x + 12, y, COL.purple, 4, "4 4") + circ(x - 14, y, 6, COL.teal) + circ(x + 14, y, 6, COL.teal);
    return circ(x + (side < 0 ? -14 : 14), y, 7, COL.red);
  };
  const half = (x0, y0, w, h, seedBase) => {
    let s = rect(x0, y0, w, h, "#EAF5F4", { rx: 10 });
    for (let k = 0; k < 5; k++) s += wig(x0 + 6, y0 + 22 + k * 40, x0 + w - 2, y0 + 22 + k * 40, { seed: seedBase + k, amp: 8, n: 5, color: COL.tealLight, w: 4 });
    return s;
  };
  // panel 1 intact
  b += half(20, 30, 90, 210, 300) + half(110, 30, 90, 210, 320);
  for (let k = 0; k < 5; k++) b += pair(110, 52 + k * 40, false);
  // panel 2 cut
  b += half(255, 30, 85, 210, 300) + half(375, 30, 85, 210, 320);
  for (let k = 0; k < 5; k++) b += circ(340, 52 + k * 40, 7, COL.red) + circ(375, 52 + k * 40, 7, COL.red);
  // panel 3 healed
  b += half(510, 30, 90, 210, 300) + half(600, 30, 90, 210, 320);
  b += line(600, 34, 600, 236, COL.muted, 1.5, "3 6");
  for (let k = 0; k < 5; k++) b += pair(600, 52 + k * 40, false);
  b += arrow(212, 135, 245, 135, { color: COL.ink, width: 3, head: 12 });
  b += arrow(468, 135, 502, 135, { color: COL.ink, width: 3, head: 12 });
  b += lines(110, 272, ["完整", "动态键连接两侧"], { size: 17, anchor: "middle", weight: "bold", lh: 24 });
  b += lines(357, 272, ["断裂", "断开的是动态键"], { size: 17, anchor: "middle", weight: "bold", fill: COL.red, lh: 24 });
  b += lines(600, 272, ["重新接触", "键在界面重新形成"], { size: 17, anchor: "middle", weight: "bold", fill: COL.teal, lh: 24 });
  return svg(W, H, b);
};

// ---------- PVDF vs PAA on a Si surface ----------
figs.pvdf_paa = () => {
  const W = 640, H = 420;
  let b = "";
  const surface = (x0, w) => {
    let s = `<path d="M${x0},300 Q${x0 + w / 2},270 ${x0 + w},300 L${x0 + w},360 L${x0},360 Z" fill="${COL.si}"/>`;
    s += `<path d="M${x0},300 Q${x0 + w / 2},270 ${x0 + w},300" fill="none" stroke="#C9D2DA" stroke-width="8"/>`;
    for (let k = 0; k < 6; k++) {
      const x = x0 + 25 + k * (w - 50) / 5;
      const t = (x - x0) / w;
      const y = 300 - 4 * t * (1 - t) * 30 * 0.98;
      s += line(x, y - 4, x, y - 18, COL.red, 3) + text(x, y - 22, "OH", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
    }
    s += text(x0 + w / 2, 342, "Si 颗粒（表面 SiO_{x}–OH）", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    return s;
  };
  // Left: PVDF
  b += surface(20, 290);
  let zz = "M40,140";
  for (let k = 0; k < 12; k++) zz += ` L${52 + k * 22},${k % 2 ? 140 : 125}`;
  b += `<path d="${zz}" fill="none" stroke="${COL.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let k = 1; k < 12; k += 2) b += line(52 + k * 22, 140, 52 + k * 22, 160, COL.teal, 3) + circ(52 + k * 22, 165, 7, COL.teal);
  b += text(165, 105, "PVDF  –(CH_{2}–CF_{2})_{n}–", { size: 17, anchor: "middle", weight: "bold" });
  b += text(150, 205, "只有弱的范德华力", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  b += cross(232, 199, 9);
  // Right: PAA
  b += surface(330, 290);
  let zz2 = "M350,110";
  for (let k = 0; k < 12; k++) zz2 += ` L${362 + k * 22},${k % 2 ? 110 : 95}`;
  b += `<path d="${zz2}" fill="none" stroke="${COL.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  const cooh = [384, 450, 516, 582];
  cooh.forEach((x, i) => {
    b += line(x, 110, x, 150, COL.ink, 3);
    b += text(x, 170, "COOH", { size: 15, anchor: "middle", weight: "bold", fill: COL.purple });
    const t = (x - 330) / 290;
    const ys = 300 - 4 * t * (1 - t) * 30 * 0.98 - 40;
    if (i % 2 === 0) b += line(x, 178, x, ys, COL.purple, 3, "5 5");
    else b += line(x, 178, x, ys, COL.amber, 4);
  });
  b += text(475, 75, "PAA  –(CH_{2}–CH(COOH))_{n}–", { size: 17, anchor: "middle", weight: "bold" });
  b += line(360, 395, 390, 395, COL.purple, 3, "5 5") + text(396, 400, "氢键", { size: 15, fill: COL.purple, weight: "bold" });
  b += line(470, 395, 500, 395, COL.amber, 4) + text(506, 400, "酯键（共价）", { size: 15, fill: "#A35A12", weight: "bold" });
  b += check(605, 60, 11);
  return svg(W, H, b);
};

// ---------- Two binder strategies: elastic vs dynamic ----------
figs.binder_routes = () => {
  const W = 640, H = 430;
  let b = "";
  const stage = (cx, cy, r, mode, broken, gap) => {
    let s = "";
    const xa = cx - gap / 2, xb = cx + gap / 2;
    s += blob(xa, cy, r, 7, { fill: COL.si, stroke: COL.siDark, sw: 2, jag: 0.1 });
    s += blob(xb, cy, r, 8, { fill: COL.si, stroke: COL.siDark, sw: 2, jag: 0.1 });
    const x1 = xa + r - 3, x2 = xb - r + 3;
    const stretched = gap > 110;
    if (mode === "elastic") {
      for (const dy of [-12, 12]) s += wig(x1, cy + dy, x2, cy + dy, { seed: 400 + dy, amp: stretched ? 1.5 : 7, n: 10, waves: stretched ? 1 : 4, color: COL.teal, w: 4 });
    } else {
      for (const dy of [-12, 12]) {
        if (broken) {
          s += line(x1, cy + dy, x1 + 10, cy + dy, COL.purple, 4) + circ(x1 + 15, cy + dy, 5, COL.red);
          s += line(x2 - 10, cy + dy, x2, cy + dy, COL.purple, 4) + circ(x2 - 15, cy + dy, 5, COL.red);
        } else {
          const m = (x1 + x2) / 2;
          s += line(x1, cy + dy, m - 5, cy + dy, COL.purple, 4) + line(m + 5, cy + dy, x2, cy + dy, COL.purple, 4);
          s += circ(m - 5, cy + dy, 4.5, COL.teal) + circ(m + 5, cy + dy, 4.5, COL.teal);
        }
      }
    }
    return s;
  };
  const xs = [105, 320, 535];
  const rs = [24, 36, 24];
  const gaps = [100, 150, 100];
  // row 1 elastic
  b += text(20, 34, "路线 1　弹性网络：像弹簧一样拉长再回弹", { size: 18, weight: "bold", fill: COL.teal });
  xs.forEach((x, i) => (b += stage(x, 105, rs[i], "elastic", false, gaps[i])));
  // row 2 dynamic
  b += text(20, 224, "路线 2　动态键：断开后重新连上", { size: 18, weight: "bold", fill: COL.purple });
  xs.forEach((x, i) => (b += stage(x, 295, rs[i], "dynamic", i === 1, gaps[i])));
  [[189, 105], [436, 105], [189, 295], [436, 295]].forEach(([x, y]) => (b += arrow(x, y, x + 14, y, { color: COL.muted, width: 2.5, head: 10 })));
  ["初始", "嵌锂膨胀", "脱锂收缩"].forEach((t, i) => {
    b += text(xs[i], 172, t, { size: 17, anchor: "middle", fill: COL.text2, weight: "bold" });
    b += text(xs[i], 362, t, { size: 17, anchor: "middle", fill: COL.text2, weight: "bold" });
  });
  b += text(320, 410, "两条路线常常结合使用：网络提供回弹，动态键负责“愈合”", { size: 17, anchor: "middle", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- Elastomer: hard/soft segments ----------
figs.elastomer = () => {
  const W = 640, H = 360;
  let b = "";
  const hard = (x, y) => rect(x - 22, y - 14, 44, 28, COL.siDark, { rx: 6 });
  // relaxed
  const A = [[60, 70], [200, 60], [80, 200], [220, 210], [140, 290]];
  [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4], [0, 3]].forEach(([i, j], k) => (b += wig(A[i][0], A[i][1], A[j][0], A[j][1], { seed: 500 + k, amp: 16, n: 8, waves: 3, color: COL.teal, w: 4 })));
  A.forEach(([x, y]) => (b += hard(x, y)));
  // stretched
  const B = [[375, 110], [590, 100], [385, 190], [600, 200], [490, 270]];
  [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4], [0, 3]].forEach(([i, j], k) => (b += wig(B[i][0], B[i][1], B[j][0], B[j][1], { seed: 500 + k, amp: 3, n: 8, waves: 2, color: COL.teal, w: 4 })));
  B.forEach(([x, y]) => (b += hard(x, y)));
  b += arrow(275, 150, 335, 150, { color: COL.ink, width: 3.5, head: 13 });
  b += text(305, 135, "拉伸", { size: 16, anchor: "middle", weight: "bold" });
  b += arrow(335, 182, 275, 182, { color: COL.teal, width: 3.5, head: 13 });
  b += text(305, 208, "回弹", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(140, 340, "放松：软段卷曲", { size: 17, anchor: "middle", weight: "bold" });
  b += text(500, 340, "拉伸：软段被拉直", { size: 17, anchor: "middle", weight: "bold" });
  b += rect(395, 14, 22, 16, COL.siDark, { rx: 4 }) + text(424, 28, "硬段（苯乙烯 / MDI）", { size: 16, fill: COL.siDark, weight: "bold" });
  b += line(395, 52, 417, 52, COL.teal, 4) + text(424, 57, "软段（易拉伸）", { size: 16, fill: COL.teal, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Crosslinked PAA–CMC network bonded to Si ----------
figs.paa_network = () => {
  const W = 640, H = 430;
  let b = "";
  // Si surface
  b += rect(20, 350, 600, 60, COL.si, { rx: 6 });
  b += rect(20, 342, 600, 10, "#C9D2DA", { rx: 3 });
  b += text(320, 388, "Si 颗粒表面（SiO_{x}–OH）", { size: 16, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  // PAA chain (zigzag) top
  let z = "M40,70";
  for (let k = 0; k < 26; k++) z += ` L${50 + k * 22},${k % 2 ? 70 : 56}`;
  b += `<path d="${z}" fill="none" stroke="${COL.purple}" stroke-width="4" stroke-linejoin="round"/>`;
  b += text(40, 40, "PAA（羧基 –COOH）", { size: 17, weight: "bold", fill: COL.purple });
  // CMC chain as rings in the middle
  for (let k = 0; k < 7; k++) {
    const cx = 70 + k * 82, cy = 205;
    const pts = Array.from({ length: 6 }, (_, i) => `${(cx + 24 * Math.cos(Math.PI / 6 + (i * Math.PI) / 3)).toFixed(1)},${(cy + 18 * Math.sin(Math.PI / 6 + (i * Math.PI) / 3)).toFixed(1)}`).join(" ");
    b += `<polygon points="${pts}" fill="#FFFFFF" stroke="${COL.amber}" stroke-width="3.5"/>`;
    if (k < 6) b += line(cx + 24, cy, cx + 58, cy, COL.amber, 3.5);
  }
  b += text(162, 262, "CMC（羟基 –OH）", { size: 17, weight: "bold", fill: "#A35A12" });
  // ester crosslinks PAA -> CMC
  [110, 274, 438].forEach((x) => {
    b += line(x, 72, x, 186, COL.ink, 4);
    b += rect(x - 30, 115, 60, 24, "#FFFFFF", { rx: 12, stroke: COL.ink, sw: 2 });
    b += text(x, 132, "酯键", { size: 15, anchor: "middle", weight: "bold" });
  });
  // binder -> Si bonds
  b += line(316, 224, 316, 340, COL.teal, 3.5);
  b += line(480, 224, 480, 340, COL.teal, 3.5, "6 5");
  b += line(604, 72, 604, 340, COL.teal, 3.5, "6 5");
  b += line(150, 224, 150, 340, COL.teal, 3.5);
  b += line(345, 275, 375, 275, COL.teal, 3.5) + text(382, 280, "共价键", { size: 15, fill: COL.teal, weight: "bold" });
  b += line(345, 305, 375, 305, COL.teal, 3.5, "6 5") + text(382, 310, "氢键", { size: 15, fill: COL.teal, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Supramolecular interactions ----------
figs.supramolecular = () => {
  const W = 640, H = 470;
  let b = "";
  const card = (x, y, title, col) => rect(x, y, 305, 215, "#F7F9FB", { rx: 14, stroke: COL.line }) + text(x + 152, y + 200, title, { size: 17, anchor: "middle", weight: "bold", fill: col });
  b += card(10, 10, "① 氢键 Hydrogen bond", COL.purple);
  b += card(325, 10, "② 主客体 Host–guest", COL.teal);
  b += card(10, 245, "③ 金属离子配位", "#A35A12");
  b += card(325, 245, "④ 聚轮烷 Polyrotaxane", COL.siDark);
  // ① urea–urea
  const urea = (cx, cy, oUp) => {
    let s = "";
    const oy = oUp ? cy - 34 : cy + 34;
    s += line(cx - 3, cy, cx - 3, oy + (oUp ? 9 : -9), COL.ink, 2.5) + line(cx + 3, cy, cx + 3, oy + (oUp ? 9 : -9), COL.ink, 2.5);
    s += text(cx, oy + 6, "O", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
    s += line(cx, cy, cx - 34, cy + (oUp ? 14 : -14), COL.ink, 2.5) + line(cx, cy, cx + 34, cy + (oUp ? 14 : -14), COL.ink, 2.5);
    const ny = cy + (oUp ? 20 : -8);
    s += text(cx - 40, ny, "N", { size: 17, anchor: "middle", weight: "bold", fill: "#3A62B5" });
    s += text(cx + 40, ny, "N", { size: 17, anchor: "middle", weight: "bold", fill: "#3A62B5" });
    s += line(cx - 52, ny - 6, cx - 80, ny - 6, COL.ink, 2.5) + line(cx + 52, ny - 6, cx + 80, ny - 6, COL.ink, 2.5);
    return s;
  };
  // lower urea: O up, upper urea: N–H pointing down
  b += urea(160, 150, true);
  // upper urea drawn with N-H down
  b += line(157, 52, 157, 32, COL.ink, 2.5) + line(163, 52, 163, 32, COL.ink, 2.5) + text(160, 28, "O", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += line(160, 52, 126, 66, COL.ink, 2.5) + line(160, 52, 194, 66, COL.ink, 2.5);
  b += text(120, 74, "N", { size: 17, anchor: "middle", weight: "bold", fill: "#3A62B5" }) + text(200, 74, "N", { size: 17, anchor: "middle", weight: "bold", fill: "#3A62B5" });
  b += line(108, 68, 80, 68, COL.ink, 2.5) + line(212, 68, 240, 68, COL.ink, 2.5);
  b += line(120, 78, 120, 92, COL.ink, 2.5) + line(200, 78, 200, 92, COL.ink, 2.5);
  b += text(120, 108, "H", { size: 16, anchor: "middle", fill: COL.text2 }) + text(200, 108, "H", { size: 16, anchor: "middle", fill: COL.text2 });
  b += line(126, 110, 152, 120, COL.purple, 3, "3 4") + line(194, 110, 168, 120, COL.purple, 3, "3 4");
  b += text(255, 125, "脲–脲", { size: 16, anchor: "middle", fill: COL.text2 });
  // ② host–guest: cyclodextrin cone + adamantane
  const hx = 480, hy = 105;
  b += `<polygon points="${hx - 70},${hy - 40} ${hx + 70},${hy - 40} ${hx + 50},${hy + 40} ${hx - 50},${hy + 40}" fill="${COL.tealLight}" stroke="${COL.teal}" stroke-width="3"/>`;
  b += `<ellipse cx="${hx}" cy="${hy - 40}" rx="70" ry="14" fill="#DDF0EE" stroke="${COL.teal}" stroke-width="3"/>`;
  b += `<ellipse cx="${hx}" cy="${hy}" rx="26" ry="20" fill="#FFFFFF" stroke="${COL.teal}" stroke-width="2"/>`;
  b += `<polygon points="${hx - 14},${hy - 8} ${hx},${hy - 18} ${hx + 14},${hy - 8} ${hx + 14},${hy + 8} ${hx},${hy + 18} ${hx - 14},${hy + 8}" fill="${COL.amber}"/>`;
  b += wig(hx + 14, hy, hx + 150, hy + 10, { seed: 610, amp: 6, n: 6, color: COL.ink, w: 3 });
  b += text(hx - 6, hy + 72, "环糊精（主）+ 金刚烷（客）", { size: 16, anchor: "middle", fill: COL.text2 });
  // ③ metal ion coordination
  b += wig(30, 290, 300, 290, { seed: 620, amp: 6, n: 8, color: COL.ink, w: 3 });
  b += wig(30, 410, 300, 410, { seed: 621, amp: 6, n: 8, color: COL.ink, w: 3 });
  [100, 230].forEach((x) => {
    b += line(x, 292, x, 322, COL.ink, 2.5) + text(x, 340, "COO^{−}", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
    b += line(x, 408, x, 388, COL.ink, 2.5) + text(x, 384, "COO^{−}", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
    b += ion(x + 40, 360, { r: 16, fill: COL.amber, label: "Ca" });
  });
  // ④ polyrotaxane: rings on a thread
  b += line(345, 330, 625, 330, COL.ink, 4);
  b += circ(345, 330, 9, COL.siDark) + circ(625, 330, 9, COL.siDark);
  [400, 455, 560].forEach((x) => (b += `<ellipse cx="${x}" cy="330" rx="13" ry="30" fill="none" stroke="${COL.purple}" stroke-width="6"/>`));
  b += arrow(470, 385, 535, 385, { color: COL.purple, width: 3, head: 11 });
  b += text(502, 410, "环可以沿链滑动", { size: 16, anchor: "middle", fill: COL.text2 });
  b += wig(400, 300, 380, 268, { seed: 640, amp: 4, n: 3, color: COL.teal, w: 3 }) + wig(560, 300, 590, 268, { seed: 641, amp: 4, n: 3, color: COL.teal, w: 3 });
  return svg(W, H, b);
};

// ---------- Monroe–Newman idea ----------
figs.monroe_newman = () => {
  const W = 640, H = 420;
  let b = "";
  const panel = (x0, stiff) => {
    let s = "";
    // electrolyte
    s += rect(x0, 30, 280, 250, stiff ? "#E6E0F2" : COL.electrolyte, { rx: 0 });
    // Li metal with bump
    const bump = stiff ? 18 : 120;
    const d = `M${x0},280 L${x0 + 100},280 Q${x0 + 140},${280 - bump} ${x0 + 180},280 L${x0 + 280},280 L${x0 + 280},340 L${x0},340 Z`;
    s += `<path d="${d}" fill="#B9C3CC" stroke="#8F9BA6" stroke-width="2"/>`;
    s += text(x0 + 140, 326, "Li 金属", { size: 17, anchor: "middle", weight: "bold" });
    if (stiff) {
      // springs pressing down
      for (const dx of [70, 140, 210]) {
        let z = `M${x0 + dx},40`;
        for (let k = 0; k < 8; k++) z += ` L${x0 + dx + (k % 2 ? -12 : 12)},${50 + k * 22}`;
        z += ` L${x0 + dx},${dx === 140 ? 250 : 262}`;
        s += `<path d="${z}" fill="none" stroke="${COL.purple}" stroke-width="3.5" stroke-linejoin="round"/>`;
      }
      s += arrow(x0 + 140, 205, x0 + 140, 252, { color: COL.red, width: 4, head: 14 });
      s += lines(x0 + 140, 370, ["硬电解质：把凸起“压回去”", "剪切模量 ≳ 6 GPa"], { size: 17, anchor: "middle", weight: "bold", fill: COL.purple, lh: 24 });
    } else {
      // dendrite growing
      s += wig(x0 + 140, 228, x0 + 140, 70, { seed: 700, amp: 8, n: 6, color: "#8F9BA6", w: 9 });
      s += arrow(x0 + 175, 160, x0 + 175, 70, { color: COL.red, width: 3, head: 12 });
      s += text(x0 + 205, 120, "越长越尖", { size: 16, fill: COL.red, weight: "bold" });
      s += lines(x0 + 140, 370, ["软电解质：凸起越长越大", "PEO：剪切模量 ≤ 0.2 GPa"], { size: 17, anchor: "middle", weight: "bold", fill: "#3A7CA5", lh: 24 });
    }
    return s;
  };
  b += panel(20, false);
  b += panel(340, true);
  return svg(W, H, b);
};

// ---------- PS-b-PEO lamellae ----------
figs.bcp = () => {
  const W = 620, H = 420;
  let b = "";
  // cathode top, Li bottom
  b += rect(20, 20, 580, 34, COL.amberLight, { rx: 4, stroke: COL.amber });
  b += text(310, 43, "正极", { size: 16, anchor: "middle", weight: "bold" });
  b += rect(20, 300, 580, 40, "#B9C3CC", { rx: 4 });
  b += text(310, 327, "Li 金属负极", { size: 16, anchor: "middle", weight: "bold" });
  for (let k = 0; k < 8; k++) {
    const x = 20 + k * 72.5;
    b += rect(x, 54, 36, 246, COL.siDark, { rx: 0 });
    b += rect(x + 36, 54, 36.5, 246, "#E6E0F2", { rx: 0 });
  }
  // Li+ path in PEO lamella
  [93, 238, 455].forEach((x, i) => {
    b += arrow(x + 18, 280, x + 18, 74, { color: COL.purple, width: 3, head: 12 });
    b += ion(x + 18, 180 + i * 18, { r: 13 });
  });
  // dendrite stopped by PS
  b += `<path d="M370,300 L372,262 L364,238 L370,214" fill="none" stroke="#8F9BA6" stroke-width="8" stroke-linecap="round"/>`;
  b += cross(370, 196, 10);
  b += text(310, 372, "深色 = PS 硬段（撑起模量）　浅紫 = PEO 软段（导 Li^{+}）", { size: 16, anchor: "middle" });
  b += text(310, 400, "嵌段共聚物自组装成层状结构（示意，不按比例）", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Beyond modulus: extended theory ----------
figs.beyond_modulus = () => {
  const W = 640, H = 430;
  let b = "";
  const row = (y, n, title, sub, col) => {
    let s = rect(10, y, 620, 128, "#F7F9FB", { rx: 14 });
    s += pill(24, y + 14, 34, 34, col, String(n), { size: 17 });
    s += text(70, y + 38, title, { size: 18, weight: "bold", fill: col });
    s += text(70, y + 64, sub, { size: 16, fill: COL.text2 });
    return s;
  };
  b += row(8, 1, "表面张力 ↑", "短波长的小凸起被“抹平”", COL.purple);
  // wavy line flattening
  let w1 = "M360,105", w2 = "M500,105";
  for (let k = 0; k <= 24; k++) { w1 += ` L${360 + k * 4},${(105 - 14 * Math.abs(Math.sin(k * 0.8))).toFixed(1)}`; w2 += ` L${500 + k * 4},${(105 - 3 * Math.abs(Math.sin(k * 0.8))).toFixed(1)}`; }
  b += `<path d="${w1} L456,120 L360,120 Z" fill="#B9C3CC"/><path d="${w2} L596,120 L500,120 Z" fill="#B9C3CC"/>`;
  b += arrow(465, 100, 492, 100, { color: COL.purple, width: 3, head: 10 });
  b += row(148, 2, "固定一部分阴离子", "Li^{+} 被推离尖端，尖端“断粮”", COL.teal);
  b += `<path d="M450,262 L480,198 L510,262 Z" fill="#B9C3CC"/>`;
  b += arrow(470, 205, 418, 190, { color: COL.teal, width: 3, head: 11 });
  b += arrow(492, 205, 545, 190, { color: COL.teal, width: 3, head: 11 });
  [[600, 175], [600, 215], [390, 230]].forEach(([x, y]) => (b += ion(x, y, { r: 13, fill: COL.red, label: "−" })));
  b += row(288, 3, "凝胶孔更小", "沉积更致密（孔限制了枝晶尺寸）", "#A35A12");
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) b += `<circle cx="${380 + i * 22}" cy="${340 + j * 24}" r="8" fill="none" stroke="${COL.amber}" stroke-width="2.5"/>`;
  b += arrow(470, 352, 500, 352, { color: "#A35A12", width: 3, head: 10 });
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) b += `<circle cx="${515 + i * 11}" cy="${328 + j * 12}" r="4" fill="none" stroke="${COL.amber}" stroke-width="2"/>`;
  return svg(W, H, b);
};

module.exports = figs;
