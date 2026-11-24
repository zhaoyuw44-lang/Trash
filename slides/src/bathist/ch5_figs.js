// Figures for 锂电池发展史 Chapter 5: 1989–1991 从 Moli 召回到 Sony 上市
// Curves redrawn from Fong, von Sacken & Dahn, J. Electrochem. Soc. 137, 2009 (1990) are
// approximate hand digitizations of the printed figures (shape and key values only).
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, electron, blob } = L;

const figs = {};
const LI = COL.purple;
const CARBON = "#3D4752";
const COAL = COL.siDark;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const poly = (pts, c, w = 3, dash) =>
  `<polyline points="${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

// Monotone-ish smooth interpolation of digitized points (linear in between, dense sampling).
function plotFrame(X, Y, W, H, xr, yr, o = {}) {
  const sx = (v) => X + ((v - xr[0]) / (xr[1] - xr[0])) * W;
  const sy = (v) => Y + H - ((v - yr[0]) / (yr[1] - yr[0])) * H;
  let b = rect(X, Y, W, H, "none", { stroke: COL.muted, sw: 2 });
  const fs = o.tick || 18;
  (o.xt || []).forEach((v) => {
    b += line(sx(v), Y + H, sx(v), Y + H - 7, COL.muted, 2);
    b += text(sx(v), Y + H + fs + 6, String(v), { size: fs, anchor: "middle", fill: COL.text2 });
  });
  (o.yt || []).forEach((v) => {
    b += line(X, sy(v), X + 7, sy(v), COL.muted, 2);
    b += text(X - 9, sy(v) + fs * 0.35, String(v), { size: fs, anchor: "end", fill: COL.text2 });
  });
  if (o.xl) b += text(X + W / 2, Y + H + fs * 2 + 16, o.xl, { size: o.lsize || fs, anchor: "middle", fill: COL.text2 });
  if (o.yl) b += `<g transform="translate(${X - (o.ylOff || 58)},${Y + H / 2}) rotate(-90)">${text(0, 0, o.yl, { size: o.lsize || fs, anchor: "middle", fill: COL.text2 })}</g>`;
  return { b, sx, sy };
}
const curve = (pts, f, c, w = 3.5, dash) => poly(pts.map(([x, y]) => [f.sx(x), f.sy(y)]), c, w, dash);

// Graphite sheet drawn as a row of small hexagon edges (zig-zag line).
function sheet(x, y, w, c = CARBON, sw = 3, amp = 5) {
  const pts = [];
  for (let xx = 0, i = 0; xx <= w; xx += 12, i++) pts.push([x + xx, y + (i % 2 ? amp : 0)]);
  return poly(pts, c, sw);
}

// Text label with a solid background so it stays readable over lines.
function tag(x, y, str, o = {}) {
  const size = o.size || 19;
  let units = 0;
  for (const ch of str.replace(/[_^]\{([^}]*)\}/g, "$1")) units += /[\u2e80-\uffef]/.test(ch) ? 1 : 0.58;
  const w = units * size + 14;
  const x0 = o.anchor === "start" ? x - 7 : x - w / 2;
  return rect(x0.toFixed(1), y - size * 1.0, w.toFixed(1), size * 1.35, o.bg || COL.electrolyte, { rx: 5 }) + text(x, y, str, { size, anchor: o.anchor || "middle", weight: o.weight || "bold", fill: o.fill || COL.ink });
}

// Flame shape
function flame(cx, by, s = 1, c1 = COL.red, c2 = COL.amber) {
  const p = (pts) => pts.map(([x, y]) => `${(cx + x * s).toFixed(1)},${(by + y * s).toFixed(1)}`).join(" ");
  return (
    `<path d="M${p([[0, 0]])} C${p([[-34, -4]])} ${p([[-40, -40]])} ${p([[-14, -70]])} C${p([[-14, -50]])} ${p([[-2, -46]])} ${p([[0, -56]])} C${p([[4, -76]])} ${p([[18, -84]])} ${p([[16, -104]])} C${p([[44, -76]])} ${p([[40, -18]])} ${p([[0, 0]])} Z" fill="${c1}"/>` +
    `<path d="M${p([[0, 0]])} C${p([[-18, -2]])} ${p([[-20, -24]])} ${p([[-6, -40]])} C${p([[-4, -28]])} ${p([[6, -26]])} ${p([[8, -44]])} C${p([[22, -28]])} ${p([[18, -4]])} ${p([[0, 0]])} Z" fill="${c2}"/>`
  );
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  // Li-metal cell with flame
  b += rect(40, 70, 150, 220, "#2B3D4F", { rx: 18, stroke: "#F2B8B4", sw: 4 });
  b += rect(85, 52, 60, 20, "#F2B8B4", { rx: 5 });
  b += text(115, 175, "Li", { size: 52, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(115, 220, "金属", { size: 24, anchor: "middle", fill: "#F2B8B4" });
  b += flame(178, 105, 0.75);
  b += text(115, 335, "1989", { size: 30, anchor: "middle", weight: "bold", fill: "#F2B8B4" });
  b += text(115, 367, "Moli 召回", { size: 22, anchor: "middle", fill: "#CADCE8" });
  // carbon host with Li+
  for (let i = 0; i < 5; i++) b += sheet(240, 95 + i * 42, 150, "#9FD3CF", 3.5, 6);
  for (let i = 0; i < 4; i++) b += ion(262 + (i % 2) * 52 + i * 14, 118 + i * 42, { r: 12, fill: COL.purple, label: "+" });
  b += text(315, 335, "1990", { size: 30, anchor: "middle", weight: "bold", fill: "#9FD3CF" });
  b += text(315, 367, "碳与 SEI", { size: 22, anchor: "middle", fill: "#CADCE8" });
  b += arrow(198, 170, 232, 170, { color: "#CADCE8", width: 3 });
  b += pill(40, 440, 355, 56, COL.amber, "1991 · Sony 锂离子电池上市", { size: 22 });
  return svg(W, H, b);
};

// ---------- 1. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 440;
  const P = COL.purple, T = COL.teal, R = COL.red, A = COL.amber;
  const ev = [
    { year: "1955", who: ["Hérold"], what: ["锂蒸气", "嵌入石墨"], color: P },
    { year: "1970", who: ["Dey & Sullivan"], what: ["PC 在石墨上", "分解"], color: T },
    { year: "1979", who: ["Peled"], what: ["SEI 模型", "（第 3 章）"], color: T },
    { year: "1985", who: ["Yoshino"], what: ["LiCoO_{2} + 碳", "（第 4 章）"], color: A },
    { year: "80 年代末", who: ["Moli"], what: ["Li/MoS_{2}", "可充电池上市"], color: R },
    { year: "1989", who: ["Moli"], what: ["手机电池起火", "召回、破产"], color: R },
    { year: "1990", who: ["Fong 等"], what: ["碳负极的", "第一圈与 SEI"], color: T },
    { year: "1991", who: ["Sony"], what: ["锂离子电池", "上市"], color: A },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 85, right: 1125, whoSize: 19, whatSize: 18, yearSize: 24 });
  const lg = [[P, "碳材料"], [T, "界面与电解液"], [R, "锂金属电池"], [A, "锂离子电池"]];
  lg.forEach(([c, t], i) => (b += pill(530 + i * 175, 402, 160, 30, c, t, { size: 17 })));
  return svg(W, H, b);
};

// ---------- 2. Molicel: Li / MoS2 ----------
figs.molicel = () => {
  const W = 820, H = 540;
  let b = "";
  // left: sandwich
  b += text(205, 40, "Molicel：Li / MoS_{2} 可充电池", { size: 22, anchor: "middle", weight: "bold" });
  b += rect(40, 70, 330, 300, COL.electrolyte, { rx: 14 });
  b += rect(60, 90, 70, 260, "#B9A6DE", { rx: 6 });
  b += text(95, 228, "Li", { size: 30, anchor: "middle", weight: "bold", fill: COL.purple });
  b += rect(196, 90, 10, 260, COL.white, { stroke: COL.muted, sw: 1.5, dash: "6 5" });
  b += rect(270, 90, 80, 260, COL.sulfurLight, { rx: 6 });
  for (let i = 0; i < 7; i++) b += line(278, 110 + i * 36, 342, 110 + i * 36, COL.sulfur, 4);
  b += ion(160, 160, { r: 14 }) + ion(235, 230, { r: 14 });
  b += arrow(138, 290, 258, 290, { color: COL.amber, width: 3.5 });
  b += tag(201, 276, "放电", { fill: COL.amber });
  b += arrow(258, 330, 138, 330, { color: COL.red, width: 3.5 });
  b += tag(201, 316, "充电", { fill: COL.red });
  b += text(95, 400, "负极：金属锂", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(310, 400, "正极：MoS_{2}", { size: 20, anchor: "middle", weight: "bold", fill: "#9A7400" });
  b += text(201, 400, "隔膜", { size: 19, anchor: "middle", fill: COL.text2 });
  // right: what happens
  b += rect(420, 70, 370, 150, "#FDF2E7", { rx: 14 });
  b += text(605, 106, "放电：锂离开金属", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  b += lines(445, 146, ["Li → Li^{+} + e^{−}", "Li^{+} 钻进 MoS_{2} 层间（嵌入）"], { size: 19, lh: 32, fill: COL.ink });
  b += rect(420, 238, 370, 150, "#FBEDEC", { rx: 14 });
  b += text(605, 274, "充电：锂要重新“镀”回去", { size: 21, anchor: "middle", weight: "bold", fill: COL.red });
  b += lines(445, 314, ["Li^{+} + e^{−} → Li（金属）", "每充一次，负极表面重长一遍"], { size: 19, lh: 32, fill: COL.ink });
  b += rect(40, 430, 750, 80, COL.light, { rx: 14 });
  b += text(415, 466, "正极是嵌入材料（好），负极是金属锂（隐患）", { size: 21, anchor: "middle", weight: "bold" });
  b += text(415, 496, "问题全出在“充电时把锂镀回去”这一步", { size: 19, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 3. Dendrites: why cycled Li gets worse ----------
figs.dendrite = () => {
  const W = 820, H = 540;
  let b = "";
  const panel = (x, title, sub, color, sepX = 120) => {
    b += rect(x, 60, 240, 340, COL.electrolyte, { rx: 12 });
    b += rect(x + 12, 300, 216, 30, "#B9A6DE", { rx: 4 }); // lithium base
    b += rect(x + 12, 330, 216, 16, COL.copper, { rx: 3 }); // current collector
    b += line(x + 12, 110, x + 228, 110, COL.muted, 4, "10 6"); // separator
    b += text(x + sepX, 98, "隔膜", { size: 18, anchor: "middle", fill: COL.muted });
    b += text(x + 120, 440, title, { size: 21, anchor: "middle", weight: "bold", fill: color });
    b += text(x + 120, 472, sub, { size: 19, anchor: "middle", fill: COL.text2 });
  };
  panel(20, "第 1 次充电", "镀层较平整", COL.teal);
  panel(290, "循环几十次后", "苔藓状锂，表面积大", COL.amber);
  panel(560, "枝晶刺穿隔膜", "正负极接通 = 内部短路", COL.red, 50);
  // panel 1: smooth layer
  b += rect(32, 284, 216, 18, "#9F88CF", { rx: 6 });
  b += ion(90, 220, { r: 13 }) + ion(170, 190, { r: 13 });
  b += arrow(90, 238, 90, 278, { color: COL.purple, width: 3 }) + arrow(170, 208, 170, 278, { color: COL.purple, width: 3 });
  // panel 2: mossy
  for (let i = 0; i < 9; i++) b += blob(318 + i * 23, 280 - (i % 3) * 10, 18 + (i % 2) * 6, 11 + i, { fill: "#9F88CF", jag: 0.35, n: 9 });
  for (let i = 0; i < 6; i++) b += blob(325 + i * 33, 250 - (i % 2) * 14, 12, 40 + i, { fill: "#B9A6DE", jag: 0.4, n: 8 });
  b += text(410, 175, "新鲜锂表面", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(410, 200, "不断吃掉电解液", { size: 18, anchor: "middle", fill: COL.text2 });
  // panel 3: dendrite through separator
  const dx = 680;
  b += poly([[dx, 300], [dx - 6, 250], [dx + 8, 205], [dx - 4, 160], [dx + 6, 112], [dx, 72]], "#7E62B8", 9);
  b += poly([[dx - 4, 240], [dx - 32, 215]], "#7E62B8", 6) + poly([[dx + 6, 180], [dx + 34, 160]], "#7E62B8", 6);
  b += rect(572, 62, 216, 14, COL.sulfur, { rx: 3 });
  b += text(752, 100, "正极", { size: 18, anchor: "middle", fill: "#9A7400" });
  b += `<polygon points="${dx},50 ${dx - 18},78 ${dx - 2},74 ${dx - 14},104 ${dx + 20},66 ${dx + 4},70 ${dx + 14},50" fill="${COL.amber}"/>`;
  b += arrow(272, 230, 288, 230, { color: COL.muted, width: 3 }) + arrow(542, 230, 558, 230, { color: COL.muted, width: 3 });
  b += text(410, 520, "示意图，未按比例", { size: 18, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 4. Thermal runaway loop ----------
figs.runaway = () => {
  const W = 820, H = 540;
  let b = "";
  const cx = 410, cy = 265, R = 175;
  const nodes = [
    { a: -90, t: ["内部短路"], c: COL.red },
    { a: 0, t: ["电流集中", "局部发热"], c: COL.amber },
    { a: 90, t: ["锂与电解液", "放热反应加快"], c: COL.red },
    { a: 180, t: ["温度更高", "隔膜熔化"], c: COL.amber },
  ];
  // circular arrows between nodes
  for (let i = 0; i < 4; i++) {
    const a1 = ((nodes[i].a + 28) * Math.PI) / 180, a2 = ((nodes[i].a + 62) * Math.PI) / 180;
    const p1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)], p2 = [cx + R * Math.cos(a2), cy + R * Math.sin(a2)];
    b += `<path d="M${p1[0].toFixed(1)},${p1[1].toFixed(1)} A${R},${R} 0 0 1 ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="none" stroke="${COL.muted}" stroke-width="4"/>`;
    b += L.head(p2[0], p2[1], a2 + Math.PI / 2, COL.muted, 16);
  }
  nodes.forEach((n) => {
    const a = (n.a * Math.PI) / 180;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    const w = 200, h = n.t.length > 1 ? 80 : 56;
    b += rect(x - w / 2, y - h / 2, w, h, COL.white, { rx: 12, stroke: n.c, sw: 3 });
    b += lines(x, y - (n.t.length - 1) * 14 + 7, n.t, { size: 20, anchor: "middle", weight: "bold", fill: n.c, lh: 28 });
  });
  b += flame(cx, cy + 40, 0.9);
  b += text(cx, cy + 82, "越热 → 越快 → 越热", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(cx, 525, "锂的熔点只有约 180 °C：电池一旦过热，金属锂会熔化，反应更猛", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 5. Half cell used in the paper ----------
figs.halfcell = () => {
  const W = 820, H = 540;
  let b = "";
  b += text(410, 36, "Li/碳 半电池：只研究碳这一个电极", { size: 22, anchor: "middle", weight: "bold" });
  b += rect(60, 70, 700, 250, COL.electrolyte, { rx: 14 });
  b += rect(85, 92, 90, 206, "#B9A6DE", { rx: 6 });
  b += text(130, 200, "Li 箔", { size: 22, anchor: "middle", weight: "bold", fill: COL.purple });
  b += rect(400, 92, 12, 206, COL.white, { stroke: COL.muted, sw: 1.5, dash: "6 5" });
  b += rect(600, 92, 135, 206, "#5B6672", { rx: 6 });
  for (let i = 0; i < 6; i++) b += sheet(612, 112 + i * 32, 110, "#C9D2DA", 3, 5);
  b += ion(260, 150, { r: 14 }) + ion(330, 220, { r: 14 }) + ion(500, 180, { r: 14 });
  b += arrow(190, 270, 580, 270, { color: COL.purple, width: 3.5 });
  b += tag(406, 258, "Li^{+} 嵌入碳", { fill: COL.purple });
  b += text(130, 350, "对电极 + 参比", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(668, 350, "被研究的碳电极", { size: 19, anchor: "middle", weight: "bold", fill: CARBON });
  b += text(406, 350, "隔膜", { size: 18, anchor: "middle", fill: COL.muted });
  // vocabulary table
  b += rect(60, 380, 340, 140, "#FBEDEC", { rx: 14 });
  b += text(230, 414, "原文（半电池）", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += lines(85, 452, ["碳 = cathode（正极）", "discharge = 锂嵌入碳"], { size: 19, lh: 34 });
  b += rect(420, 380, 340, 140, "#E8F4F3", { rx: 14 });
  b += text(590, 414, "真正的锂离子电池", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(445, 452, ["碳 = 负极 (anode)", "锂嵌入碳 = 充电"], { size: 19, lh: 34 });
  return svg(W, H, b);
};

// ---------- 6. Two carbons ----------
figs.carbons = () => {
  const W = 820, H = 500;
  let b = "";
  // graphite
  b += rect(30, 40, 365, 330, COL.light, { rx: 14 });
  b += text(212, 78, "石墨 graphite", { size: 22, anchor: "middle", weight: "bold" });
  for (let i = 0; i < 6; i++) b += sheet(60, 110 + i * 40, 300, CARBON, 3.5, 6);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) b += circ(85 + j * 80 + (i % 2) * 20, 133 + i * 40, 8, COL.purple);
  b += text(212, 360, "层很整齐", { size: 19, anchor: "middle", fill: COL.text2 });
  // coke
  b += rect(425, 40, 365, 330, COL.light, { rx: 14 });
  b += text(607, 78, "石油焦 petroleum coke", { size: 22, anchor: "middle", weight: "bold" });
  const R = L.rng(7);
  for (let k = 0; k < 9; k++) {
    const x0 = 450 + (k % 3) * 108, y0 = 120 + Math.floor(k / 3) * 78;
    const ang = (R() - 0.5) * 50;
    let g = "";
    for (let i = 0; i < 3; i++) g += sheet(0, i * 16, 80, CARBON, 3, 4);
    b += `<g transform="translate(${x0 + 10},${y0}) rotate(${ang.toFixed(1)} 40 16)">${g}</g>`;
  }
  b += text(607, 360, "小片乱叠，缺陷多", { size: 19, anchor: "middle", fill: COL.text2 });
  // numbers
  b += rect(30, 392, 365, 128, "#F1ECF8", { rx: 14 });
  b += lines(212, 432, ["最多嵌到 LiC_{6}（x = 1）", "约 372 mAh/g，电压约 0.1 V", "怕溶剂“挤进”层间"], { size: 19, anchor: "middle", lh: 32 });
  b += rect(425, 392, 365, 128, "#F1ECF8", { rx: 14 });
  b += lines(607, 432, ["可逆约 x = 0.5（原文）", "约 186 mAh/g，电压斜坡约 1 V", "缺陷把层“钉”住，不怕 PC"], { size: 19, anchor: "middle", lh: 32 });
  return svg(W, H, `<g transform="translate(0,-30)">${b}</g>`);
};

// ---------- 7. Fig. 2 redraw: first 1.5 cycles ----------
const F2A = {
  d1: [[0, 1.2], [0.4, 1.0], [0.9, 0.84], [2, 0.75], [4, 0.6], [6, 0.47], [8, 0.37], [10, 0.28], [12, 0.19], [14, 0.11], [16, 0.05], [17.3, 0.02]],
  c1: [[17.3, 0.02], [17.5, 0.09], [19, 0.15], [21, 0.27], [23, 0.4], [25, 0.55], [27, 0.75], [28.8, 0.98], [29.8, 1.2], [30.2, 1.32]],
  d2: [[30.2, 1.32], [30.6, 1.0], [31.2, 0.82], [32.5, 0.62], [34, 0.45], [36, 0.3], [38, 0.18], [40, 0.09], [42.5, 0.02]],
};
const F2B = {
  d1: [[0, 1.4], [2, 1.3], [4, 1.18], [6, 1.02], [8, 0.85], [10, 0.77], [14, 0.72], [18, 0.66], [21, 0.58], [24, 0.47], [27, 0.42], [30, 0.32], [33, 0.22], [36, 0.17], [40, 0.15], [48, 0.13], [56, 0.11], [64, 0.09], [72, 0.07], [77, 0.04], [79, 0.01]],
  c1: [[79, 0.01], [80, 0.09], [86, 0.11], [96, 0.13], [104, 0.16], [111, 0.21], [115, 0.28], [117, 0.5], [118, 1.0], [118.6, 1.5]],
  d2: [[118.6, 1.5], [119.2, 0.9], [120, 0.28], [123, 0.22], [128, 0.16], [136, 0.12], [146, 0.09], [154, 0.06], [158, 0.03]],
};
figs.fig2_redraw = () => {
  const W = 1240, H = 430;
  let b = "";
  const pa = plotFrame(105, 50, 440, 270, [0, 45], [0, 1.6], { xt: [0, 10, 20, 30, 40], yt: [0, 0.4, 0.8, 1.2, 1.6], xl: "时间（小时）", yl: "电压 (V，相对 Li)", tick: 18, ylOff: 62 });
  b += pa.b;
  b += text(325, 36, "(a) 石油焦，5.8 m²/g", { size: 20, anchor: "middle", weight: "bold" });
  b += curve(F2A.d1, pa, COL.red, 4) + curve(F2A.c1, pa, COL.teal, 4) + curve(F2A.d2, pa, COL.purple, 3.5, "9 6");
  // label F
  b += text(pa.sx(2.6) , pa.sy(1.12), "F", { size: 24, weight: "bold", fill: COL.red });
  b += arrow(pa.sx(2.4), pa.sy(1.08), pa.sx(0.6), pa.sy(0.98), { color: COL.red, width: 2.5, head: 9 });
  b += text(pa.sx(9), pa.sy(0.16), "I", { size: 24, weight: "bold", fill: COL.ink });
  b += text(pa.sx(23.5), pa.sy(1.28), "Δx = 0.5", { size: 18, anchor: "middle", fill: COL.text2 });
  b += line(pa.sx(17.3), pa.sy(1.17), pa.sx(30.2), pa.sy(1.17), COL.text2, 2);

  const pb = plotFrame(735, 50, 460, 270, [0, 160], [0, 1.6], { xt: [0, 40, 80, 120, 160], yt: [0, 0.4, 0.8, 1.2, 1.6], xl: "时间（小时）", yl: "电压 (V)", tick: 18, ylOff: 62 });
  b += pb.b;
  b += text(965, 36, "(b) 石墨，22.5 m²/g", { size: 20, anchor: "middle", weight: "bold" });
  b += curve(F2B.d1, pb, COL.red, 4) + curve(F2B.c1, pb, COL.teal, 4) + curve(F2B.d2, pb, COL.purple, 3.5, "9 6");
  b += text(pb.sx(10), pb.sy(1.36), "F", { size: 24, weight: "bold", fill: COL.red });
  b += arrow(pb.sx(9), pb.sy(1.33), pb.sx(4.6), pb.sy(1.18), { color: COL.red, width: 2.5, head: 9 });
  b += text(pb.sx(30), pb.sy(0.9), "E", { size: 24, weight: "bold", fill: COL.amber });
  b += arrow(pb.sx(28), pb.sy(0.86), pb.sx(18), pb.sy(0.69), { color: COL.amber, width: 2.5, head: 9 });
  b += text(pb.sx(58), pb.sy(0.32), "I", { size: 24, weight: "bold", fill: COL.ink });
  b += text(pb.sx(99), pb.sy(1.28), "Δx = 1", { size: 18, anchor: "middle", fill: COL.text2 });
  b += line(pb.sx(79), pb.sy(1.17), pb.sx(118.6), pb.sy(1.17), COL.text2, 2);
  // legend
  const lg = [[COL.red, "第 1 次放电（锂进入碳）", null], [COL.teal, "第 1 次充电（锂出来）", null], [COL.purple, "第 2 次放电", "9 6"]];
  lg.forEach(([c, t, dsh], i) => {
    const x = 120 + i * 360;
    b += line(x, 412, x + 46, 412, c, 4, dsh);
    b += text(x + 58, 419, t, { size: 18, fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- 8. Irreversible capacity bookkeeping ----------
figs.irrev_bucket = () => {
  const W = 820, H = 510;
  let b = "";
  b += text(410, 40, "第 1 圈的“账本”（示意数字）", { size: 22, anchor: "middle", weight: "bold" });
  const X = 190, U = 5.2; // px per unit
  b += text(170, 118, "第 1 次放电", { size: 20, anchor: "end", weight: "bold" });
  b += text(170, 142, "送进 100 份锂", { size: 18, anchor: "end", fill: COL.text2 });
  b += rect(X, 90, 20 * U, 60, COL.red, { rx: 6 });
  b += rect(X + 20 * U, 90, 80 * U, 60, COL.teal, { rx: 6 });
  b += text(X + 10 * U, 128, "20", { size: 22, anchor: "middle", weight: "bold", fill: COL.white });
  b += text(X + 60 * U, 128, "80：嵌进碳层", { size: 21, anchor: "middle", weight: "bold", fill: COL.white });
  b += text(170, 218, "第 1 次充电", { size: 20, anchor: "end", weight: "bold" });
  b += text(170, 242, "只拿回 80 份", { size: 18, anchor: "end", fill: COL.text2 });
  b += rect(X + 20 * U, 190, 80 * U, 60, COL.teal, { rx: 6 });
  b += rect(X, 190, 20 * U, 60, COL.white, { rx: 6, stroke: COL.red, sw: 2.5, dash: "7 5" });
  b += text(X + 60 * U, 228, "80：可逆容量", { size: 21, anchor: "middle", weight: "bold", fill: COL.white });
  b += arrow(X + 10 * U, 262, X + 10 * U, 318, { color: COL.red, width: 3 });
  b += rect(60, 325, 700, 70, "#FBEDEC", { rx: 12 });
  b += text(410, 356, "20 份锂变成了表面膜里的 Li 化合物，再也回不来", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(410, 384, "= 不可逆容量 (irreversible capacity)", { size: 19, anchor: "middle", fill: COL.ink });
  b += rect(60, 415, 700, 105, COL.light, { rx: 12 });
  b += text(410, 450, "首次库仑效率 = 第 1 次充电电量 ÷ 第 1 次放电电量", { size: 20, anchor: "middle", weight: "bold" });
  b += text(410, 486, "这里 = 80 ÷ 100 = 80%；从第 2 圈起接近 100%", { size: 19, anchor: "middle", fill: COL.text2 });
  return svg(W, H, `<g transform="translate(0,-15)">${b}</g>`);
};

// ---------- 9. Film thickness estimate + SEI picture ----------
figs.film_calc = () => {
  const W = 820, H = 492;
  let b = "";
  b += rect(20, 14, 780, 66, COL.light, { rx: 12 });
  b += text(410, 57, "2Li^{+} + 2e^{−} + EC → C_{2}H_{4}↑ + Li_{2}CO_{3}", { size: 24, anchor: "middle", weight: "bold" });
  const steps = [
    ["0.003 Ah/m²", "每 m² 碳表面", "消耗的电量"],
    ["1.1×10^{−4} mol", "电子", "÷ F"],
    ["5.6×10^{−5} mol", "Li_{2}CO_{3}", "2 个电子 1 个"],
    ["≈ 2 nm", "≈ 20 Å 厚", "× 35 cm³/mol"],
  ];
  steps.forEach(([v, a, c], i) => {
    const x = 20 + i * 200;
    b += rect(x, 104, 180, 116, i === 3 ? "#FDF2E7" : COL.white, { rx: 12, stroke: i === 3 ? COL.amber : COL.line, sw: 2.5 });
    b += text(x + 90, 142, v, { size: 20, anchor: "middle", weight: "bold", fill: i === 3 ? COL.amber : COL.ink });
    b += text(x + 90, 172, a, { size: 18, anchor: "middle", fill: COL.ink });
    b += text(x + 90, 202, c, { size: 18, anchor: "middle", fill: COL.muted });
    if (i < 3) b += arrow(x + 182, 162, x + 198, 162, { color: COL.muted, width: 3, head: 9 });
  });
  // SEI picture
  let g = "";
  g += rect(20, 250, 780, 252, COL.electrolyte, { rx: 12 });
  g += rect(20, 430, 780, 72, "#5B6672", { rx: 0 });
  for (let i = 0; i < 2; i++) g += sheet(40, 452 + i * 28, 740, "#C9D2DA", 3, 5);
  g += rect(20, 400, 780, 30, COL.sei, { opacity: 0.85 });
  g += text(410, 421, "SEI 膜：约 2–5 nm", { size: 18, anchor: "middle", weight: "bold", fill: COL.white });
  // electron blocked
  g += electron(170, 470, 16);
  g += arrow(170, 450, 170, 382, { color: COL.amber, width: 3.5 });
  g += cross(170, 370, 14, COL.red, 5);
  g += text(220, 300, "电子过不去", { size: 20, weight: "bold", fill: COL.red });
  g += text(220, 328, "→ 电解液不再分解", { size: 19, fill: COL.ink });
  // ion passes
  g += ion(600, 300, { r: 15 });
  g += arrow(600, 318, 600, 456, { color: COL.purple, width: 3.5 });
  g += check(640, 360, 14, COL.teal, 5);
  g += text(660, 300, "Li^{+} 能过", { size: 20, weight: "bold", fill: COL.teal });
  g += text(660, 328, "→ 照常嵌入", { size: 19, fill: COL.ink });
  b += `<g transform="translate(0,-12)">${g}</g>`;
  return svg(W, H, b);
};

// ---------- 10. PC vs EC on graphite ----------
figs.pc_ec = () => {
  const W = 820, H = 500;
  let b = "";
  const solv = (x, y, c) => {
    let g = ion(x, y, { r: 13 });
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      g += circ(x + 26 * Math.cos(a), y + 26 * Math.sin(a), 9, c);
    }
    return g;
  };
  // left: PC only
  b += rect(20, 20, 380, 400, "#FBEDEC", { rx: 14 });
  b += text(210, 58, "只用 PC：石墨被“撑开”", { size: 21, anchor: "middle", weight: "bold", fill: COL.red });
  // splayed sheets
  const ox = 250, oy = 250;
  [-28, -16, -5, 5, 16, 28].forEach((a, i) => {
    b += `<g transform="rotate(${a} ${ox} ${oy})">${sheet(ox - 190, oy, 190, CARBON, 3.5, 5)}</g>`;
  });
  b += rect(ox, oy - 75, 110, 150, "#5B6672", { rx: 6 });
  b += solv(110, 175, COL.redLight) + solv(120, 330, COL.redLight);
  for (let i = 0; i < 4; i++) b += circ(70 + i * 22, 110 - (i % 2) * 14, 7 + (i % 2) * 3, COL.white, { stroke: COL.muted, sw: 2 });
  b += text(210, 395, "溶剂跟着 Li^{+} 一起挤进层间", { size: 19, anchor: "middle", fill: COL.ink });
  // right: with EC
  b += rect(420, 20, 380, 400, "#E8F4F3", { rx: 14 });
  b += text(610, 58, "加入 EC：先长好膜", { size: 21, anchor: "middle", weight: "bold", fill: COL.teal });
  for (let i = 0; i < 6; i++) b += sheet(560, 130 + i * 40, 200, CARBON, 3.5, 5);
  b += rect(538, 112, 14, 226, COL.sei, { rx: 3 });
  b += text(500, 108, "SEI", { size: 19, anchor: "middle", weight: "bold", fill: COL.sei });
  b += solv(470, 230, COL.tealLight);
  b += ion(610, 190, { r: 13 }) + ion(680, 270, { r: 13 });
  b += arrow(500, 230, 590, 230, { color: COL.purple, width: 3 });
  b += text(610, 395, "溶剂留在外面，只放 Li^{+} 进去", { size: 19, anchor: "middle", fill: COL.ink });
  b += text(410, 456, "PC 与 EC 只差一个甲基（–CH_{3}），在石墨上的表现却完全不同", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(410, 488, "原文推测：差别在于溶剂化的 Li^{+} 能否共嵌入，而不在膜的化学成分", { size: 18, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 11. Staging: Fig. 8 redraw ----------
const F8B_D = [[0, 0.5], [0.5, 0.4], [1, 0.25], [1.5, 0.2], [2.5, 0.19], [3.5, 0.17], [5, 0.13], [6, 0.115], [8, 0.11], [9.5, 0.105], [10.5, 0.09], [12, 0.083], [15, 0.082], [18, 0.078], [21, 0.07], [23, 0.06], [24.5, 0.045], [25, 0.025]];
const F8B_C = [[25, 0.025], [25.3, 0.06], [27, 0.085], [30, 0.1], [32, 0.11], [34, 0.115], [36, 0.14], [38, 0.15], [41, 0.17], [43, 0.2], [45, 0.25], [46, 0.35], [46.6, 0.48]];
figs.staging = () => {
  const W = 820, H = 540;
  let b = "";
  const pb = plotFrame(110, 50, 670, 280, [0, 50], [0, 0.5], { xt: [0, 10, 20, 30, 40, 50], yt: [0, 0.1, 0.2, 0.3, 0.4, 0.5], xl: "时间（小时），恒流：25 小时 ≈ Δx = 1", yl: "电压 (V，相对 Li)", tick: 19, ylOff: 74 });
  b += pb.b;
  b += text(445, 34, "石墨第 2 圈：电压曲线上的“台阶”", { size: 21, anchor: "middle", weight: "bold" });
  b += curve(F8B_D, pb, CARBON, 4) + curve(F8B_C, pb, COL.teal, 4);
  b += text(pb.sx(3.2), pb.sy(0.225), "≈0.2 V", { size: 19, fill: COL.text2 });
  b += text(pb.sx(6), pb.sy(0.145), "≈0.12 V", { size: 19, fill: COL.text2 });
  b += text(pb.sx(2), pb.sy(0.028), "≈0.085 V（→ LiC_{6}）", { size: 19, fill: COL.purple, weight: "bold" });
  b += text(pb.sx(31), pb.sy(0.3), "充电（锂出来）", { size: 19, fill: COL.teal, weight: "bold" });
  b += text(pb.sx(8), pb.sy(0.42), "放电（锂进去）", { size: 19, fill: CARBON, weight: "bold" });
  // stage cartoons
  const st = [["高阶", "隔几层夹一层锂", 3], ["2 阶 LiC_{12}", "隔一层夹一层", 2], ["1 阶 LiC_{6}", "每层都夹满", 1]];
  st.forEach(([t, d, n], k) => {
    const x0 = 30 + k * 265;
    b += rect(x0, 400, 250, 132, COL.light, { rx: 12 });
    for (let i = 0; i < 4; i++) b += sheet(x0 + 14, 418 + i * 26, 100, CARBON, 3, 4);
    for (let g = 0; g < 3; g++) if ((g + 1) % n === 0) for (let j = 0; j < 4; j++) b += circ(x0 + 26 + j * 26, 433 + g * 26, 6, COL.purple);
    b += text(x0 + 184, 452, t, { size: 19, anchor: "middle", weight: "bold", fill: COL.purple });
    b += text(x0 + 184, 484, d, { size: 18, anchor: "middle", fill: COL.text2 });
    if (k < 2) b += arrow(x0 + 238, 466, x0 + 276, 466, { color: COL.muted, width: 3, head: 9 });
  });
  return svg(W, H, b);
};

// ---------- Fig. 3 redraw: irreversible capacity vs surface area ----------
// Surface areas from Table II; capacities read off the printed Fig. 3 (approximate).
const F3A = { coke: [[1.4, 0.017], [2.6, 0.006], [2.9, 0.004], [5.8, 0.017], [9.0, 0.025], [12.0, 0.051], [13.7, 0.034], [20.9, 0.051]], graphite: [[15.1, 0.065], [18.3, 0.036], [22.5, 0.077]] };
const F3B = [[1.4, 0.029], [2.6, 0.029], [2.9, 0.030], [5.8, 0.046], [9.0, 0.047], [12.0, 0.098], [13.7, 0.075], [20.9, 0.108]];
figs.fig3_redraw = () => {
  const W = 820, H = 540;
  let b = "";
  const mk = (pts, f, kind) => pts.map(([x, y]) => kind === "g"
    ? rect((f.sx(x) - 8).toFixed(1), (f.sy(y) - 8).toFixed(1), 16, 16, CARBON)
    : circ(f.sx(x).toFixed(1), f.sy(y).toFixed(1), 8.5, COL.amber, { stroke: COL.white, sw: 1.5 })).join("");
  const pa = plotFrame(110, 60, 300, 330, [0, 24], [0, 0.16], { xt: [0, 8, 16, 24], yt: [0, 0.04, 0.08, 0.12, 0.16], tick: 19, yl: "不可逆容量 (Ah/g)", ylOff: 80 });
  b += pa.b + text(260, 44, "(a) 放电到 0.8 V", { size: 20, anchor: "middle", weight: "bold" });
  b += line(pa.sx(0), pa.sy(0), pa.sx(24), pa.sy(0.072), COL.muted, 2.5, "8 6");
  b += mk(F3A.coke, pa) + mk(F3A.graphite, pa, "g");
  b += text(pa.sx(1), pa.sy(0.145), "斜率 0.003 Ah/m²", { size: 19, weight: "bold", fill: COL.text2 });
  b += text(pa.sx(1), pa.sy(0.123), "≈ 21 Å 厚的膜", { size: 19, fill: COL.text2 });
  const pb = plotFrame(490, 60, 300, 330, [0, 24], [0, 0.16], { xt: [0, 8, 16, 24], yt: [], tick: 19 });
  b += pb.b + text(640, 44, "(b) 放电到 0.02 V", { size: 20, anchor: "middle", weight: "bold" });
  [0, 0.04, 0.08, 0.12, 0.16].forEach((v) => (b += line(pb.sx(0), pb.sy(v), pb.sx(0) + 7, pb.sy(v), COL.muted, 2)));
  b += line(pb.sx(0), pb.sy(0), pb.sx(21.7), pb.sy(0.152), COL.muted, 2.5, "8 6");
  b += mk(F3B, pb);
  b += text(pb.sx(1), pb.sy(0.145), "斜率 0.007 Ah/m²", { size: 19, weight: "bold", fill: COL.text2 });
  b += text(pb.sx(1), pb.sy(0.123), "≈ 45 Å（仅石油焦）", { size: 19, fill: COL.text2 });
  b += text(450, 448, "比表面积 (m²/g)", { size: 19, anchor: "middle", fill: COL.text2 });
  b += circ(250, 500, 8.5, COL.amber) + text(266, 507, "石油焦", { size: 19, fill: COL.text2 });
  b += rect(412, 492, 16, 16, CARBON) + text(438, 507, "石墨", { size: 19, fill: COL.text2 });
  b += line(520, 500, 566, 500, COL.muted, 2.5, "8 6") + text(576, 507, "原文的参考线", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 12. Sony 1991 cell ----------
figs.sony_cell = () => {
  const W = 820, H = 540;
  let b = "";
  b += text(410, 36, "锂离子电池：两边都是“宿舍”，没有金属锂", { size: 22, anchor: "middle", weight: "bold" });
  b += rect(40, 60, 740, 300, COL.electrolyte, { rx: 14 });
  // cathode LiCoO2 left
  b += rect(60, 80, 24, 260, COL.alu, { rx: 4 });
  b += rect(84, 80, 160, 260, "#3E6FA3", { rx: 6, opacity: 0.85 });
  for (let i = 0; i < 6; i++) b += line(94, 100 + i * 42, 234, 100 + i * 42, "#9DBBDA", 5);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) b += circ(115 + j * 50, 121 + i * 42, 8, COL.purple);
  // separator
  b += rect(404, 80, 12, 260, COL.white, { stroke: COL.muted, sw: 1.5, dash: "6 5" });
  // anode disordered carbon right
  b += rect(576, 80, 160, 260, "#5B6672", { rx: 6 });
  const R = L.rng(3);
  for (let k = 0; k < 8; k++) {
    const x0 = 586 + (k % 2) * 72, y0 = 100 + Math.floor(k / 2) * 62;
    b += `<g transform="rotate(${((R() - 0.5) * 40).toFixed(1)} ${x0 + 30} ${y0 + 10})">${sheet(x0, y0, 60, "#C9D2DA", 3, 4)}${sheet(x0, y0 + 14, 60, "#C9D2DA", 3, 4)}</g>`;
  }
  b += rect(736, 80, 24, 260, COL.copper, { rx: 4 });
  b += ion(320, 160, { r: 14 }) + ion(500, 220, { r: 14 });
  b += arrow(262, 300, 560, 300, { color: COL.amber, width: 3.5 });
  b += tag(410, 286, "充电：Li^{+} 从左搬到右", { fill: COL.amber });
  b += text(164, 392, "正极 LiCoO_{2}", { size: 21, anchor: "middle", weight: "bold", fill: "#3E6FA3" });
  b += text(164, 420, "铝箔集流体", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(656, 392, "负极：无序碳", { size: 21, anchor: "middle", weight: "bold", fill: CARBON });
  b += text(656, 420, "（焦炭类，不是石墨）", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(410, 392, "LiPF_{6} / 碳酸酯", { size: 19, anchor: "middle", fill: COL.text2 });
  b += rect(40, 450, 740, 74, "#FDF2E7", { rx: 12 });
  b += text(410, 482, "出厂时锂全部在 LiCoO_{2} 里：电池先充电才能用", { size: 20, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(410, 510, "平均电压约 3.6 V，一节顶三节镍镉 (1.2 V)", { size: 19, anchor: "middle", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- 13. Rocking chair ----------
figs.rocking = () => {
  const W = 820, H = 540;
  let b = "";
  // rocker base
  b += `<path d="M110,330 Q410,430 710,330" fill="none" stroke="${COL.copper}" stroke-width="10" stroke-linecap="round"/>`;
  b += line(250, 362, 250, 300, COL.copper, 7) + line(570, 362, 570, 300, COL.copper, 7);
  // two hosts
  b += rect(120, 150, 230, 150, "#3E6FA3", { rx: 10, opacity: 0.85 });
  for (let i = 0; i < 4; i++) b += line(135, 172 + i * 36, 335, 172 + i * 36, "#9DBBDA", 5);
  b += text(235, 135, "LiCoO_{2}", { size: 22, anchor: "middle", weight: "bold", fill: "#3E6FA3" });
  b += rect(470, 150, 230, 150, "#5B6672", { rx: 10 });
  for (let i = 0; i < 4; i++) b += sheet(485, 172 + i * 36, 200, "#C9D2DA", 3, 5);
  b += text(585, 135, "碳", { size: 22, anchor: "middle", weight: "bold", fill: CARBON });
  b += ion(230, 190, { r: 13 }) + ion(280, 226, { r: 13 }) + ion(560, 190, { r: 13 }) + ion(620, 262, { r: 13 });
  b += arrow(330, 60, 490, 60, { color: COL.amber, width: 4 });
  b += text(410, 48, "充电", { size: 20, anchor: "middle", weight: "bold", fill: COL.amber });
  b += arrow(490, 98, 330, 98, { color: COL.teal, width: 4 });
  b += text(410, 128, "放电", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += rect(40, 420, 360, 100, "#E8F4F3", { rx: 12 });
  b += check(80, 460, 14, COL.teal, 5);
  b += lines(110, 460, ["锂始终是离子 Li^{+}", "只在两个“宿舍”间来回"], { size: 19, lh: 32 });
  b += rect(420, 420, 360, 100, "#FBEDEC", { rx: 12 });
  b += cross(460, 466, 12, COL.red, 5);
  b += lines(490, 460, ["不再有金属锂负极", "（Moli 的隐患）"], { size: 19, lh: 32 });
  return svg(W, H, b);
};

// ---------- 14. What came after 1991 ----------
figs.after1991 = () => {
  const W = 1240, H = 380;
  let b = "";
  b += text(40, 60, "负极", { size: 22, weight: "bold", fill: CARBON });
  b += text(40, 200, "电解液", { size: 22, weight: "bold", fill: COL.teal });
  const lane = (y, items, c) => {
    items.forEach(([t1, t2, yr], i) => {
      const x = 170 + i * 360;
      b += rect(x, y, 300, 96, i === 0 ? COL.light : COL.white, { rx: 14, stroke: c, sw: 3 });
      b += text(x + 150, y + 38, t1, { size: 21, anchor: "middle", weight: "bold", fill: c });
      b += text(x + 150, y + 72, t2, { size: 18, anchor: "middle", fill: COL.text2 });
      b += text(x + 150, y - 10, yr, { size: 18, anchor: "middle", weight: "bold", fill: COL.muted });
      if (i < items.length - 1) b += arrow(x + 306, y + 48, x + 354, y + 48, { color: c, width: 3.5 });
    });
  };
  lane(30, [["焦炭类软碳", "Sony 1991 首代", "1991"], ["硬碳", "容量更高，不怕 PC", "1990 年代前中期"], ["石墨（MCMB 等）", "电压低而平，成为主流", "1990 年代后期起"]], CARBON);
  lane(170, [["PC 为主", "与无序碳相容", "1991 前后"], ["EC + 链状碳酸酯", "如 EC + DMC", "1990 年代初起"], ["加成膜添加剂", "专门帮助形成好的 SEI", "1990 年代末起"]], COL.teal);
  b += text(620, 340, "两条线互相成全：有了 EC 基电解液，石墨才用得上；SEI 是两条线的交点", { size: 19, anchor: "middle", fill: COL.ink, weight: "bold" });
  return svg(W, H, b);
};

module.exports = figs;
