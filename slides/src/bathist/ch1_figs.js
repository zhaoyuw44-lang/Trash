// Figures for 锂电池发展史 Chapter 1: 起源——电池、锂与非水电解液（1780–1958）
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, electron } = L;

const figs = {};
const ZN = COL.si;          // zinc
const CU = COL.copper;      // copper
const LI = COL.purple;      // lithium
const PB = COL.siDark;      // lead
const BRINE = COL.electrolyte;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;

// Element tile like a periodic-table cell.
function tile(x, y, s, z, sym, mass, o = {}) {
  let b = rect(x, y, s, s, o.fill || COL.white, { rx: s * 0.08, stroke: o.stroke || COL.line, sw: o.sw || 2 });
  b += text(x + s * 0.1, y + s * 0.24, String(z), { size: Math.round(s * 0.17), fill: o.ink || COL.text2 });
  b += text(x + s / 2, y + s * 0.66, sym, { size: Math.round(s * 0.42), anchor: "middle", weight: "bold", fill: o.ink || COL.ink });
  if (mass) b += text(x + s / 2, y + s * 0.9, mass, { size: Math.round(s * 0.15), anchor: "middle", fill: o.ink || COL.text2 });
  return b;
}

// Five-membered ring solvent drawn as a skeletal formula.
// kind: "EC" | "PC" | "GBL" | "GVL". Returns svg body centred at (cx, cy).
function ring5(cx, cy, r, kind) {
  const ang = [-90, -18, 54, 126, 198].map((a) => (a * Math.PI) / 180);
  const P = ang.map((a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  // ring atoms: 0 = carbonyl C (top); carbonate: 1 = O, 4 = O; lactone: 1 = O, 4 = CH2
  const isO = kind === "EC" || kind === "PC" ? [false, true, false, false, true] : [false, true, false, false, false];
  let b = "";
  for (let i = 0; i < 5; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % 5];
    b += line(x1.toFixed(1), y1.toFixed(1), x2.toFixed(1), y2.toFixed(1), COL.ink, 3.5);
  }
  // C=O double bond upward
  const [tx, ty] = P[0];
  b += line(tx - 5, ty, tx - 5, ty - r * 0.85, COL.ink, 3.5) + line(tx + 5, ty, tx + 5, ty - r * 0.85, COL.ink, 3.5);
  b += circ(tx, ty - r * 0.85 - 12, 15, COL.white) + text(tx, ty - r * 0.85 - 3, "O", { size: 26, anchor: "middle", weight: "bold", fill: COL.red });
  P.forEach(([x, y], i) => {
    if (isO[i]) b += circ(x, y, 15, COL.white) + text(x, y + 9, "O", { size: 26, anchor: "middle", weight: "bold", fill: COL.red });
  });
  // methyl on the carbon next to the ring O (vertex 2, bottom right)
  if (kind === "PC" || kind === "GVL") {
    const [x, y] = P[2];
    b += line(x, y, x + r * 0.75, y + r * 0.45, COL.ink, 3.5);
    b += text(x + r * 0.75 + 6, y + r * 0.45 + 9, "CH_{3}", { size: 22, fill: COL.ink });
  }
  return b;
}

// ---------- 0. Title motif (on dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  // Volta pile on the left
  const px = 40, pw = 120;
  for (let i = 0; i < 6; i++) {
    const y = 60 + i * 52;
    b += rect(px, y, pw, 14, "#B7C2CC", { rx: 4 });
    b += rect(px, y + 16, pw, 14, BRINE, { rx: 4 });
    b += rect(px, y + 32, pw, 14, "#D99A63", { rx: 4 });
  }
  b += text(px + pw / 2, 395, "1800", { size: 30, anchor: "middle", weight: "bold", fill: "#F6C58E" });
  b += text(px + pw / 2, 428, "伏打电堆", { size: 22, anchor: "middle", fill: "#CADCE8" });
  // Lithium tile on the right
  b += tile(215, 70, 180, 3, "Li", "6.94", { fill: "#2B3D4F", stroke: "#C9B8E8", sw: 4, ink: "#FFFFFF" });
  b += text(305, 300, "1817", { size: 30, anchor: "middle", weight: "bold", fill: "#C9B8E8" });
  b += text(305, 333, "发现锂", { size: 22, anchor: "middle", fill: "#CADCE8" });
  b += text(305, 390, "−3.04 V", { size: 34, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(305, 422, "最负的电极电位", { size: 20, anchor: "middle", fill: "#CADCE8" });
  b += pill(40, 470, 355, 52, COL.teal, "1958 · 碳酸丙烯酯中电解出锂", { size: 20 });
  return svg(W, H, b);
};

// ---------- 1. Series map ----------
figs.series_map = () => {
  const W = 1240, H = 430;
  const ev = [
    { year: "第 1 章", who: ["1780–1958"], what: ["电池、锂与", "非水电解液"], color: COL.amber },
    { year: "第 2 章", who: ["1970 年代"], what: ["嵌入化学与", "锂金属电池"], color: COL.text2 },
    { year: "第 3 章", who: ["1973–1983"], what: ["聚合物电解质", "与 SEI"], color: COL.text2 },
    { year: "第 4 章", who: ["1980–1985"], what: ["LiCoO_{2}、石墨", "与锂离子原型"], color: COL.text2 },
    { year: "第 5 章", who: ["1989–1991"], what: ["从 Moli 召回", "到 Sony 上市"], color: COL.text2 },
    { year: "第 6 章", who: ["1997–今"], what: ["LFP、三元", "与固态电池"], color: COL.text2 },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 110, right: 1110, whoSize: 20, whatSize: 19, yearSize: 26 });
  return svg(W, H, b);
};

// ---------- 2. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const A = COL.amber, P = LI, T = COL.teal;
  const ev = [
    { year: "1791", who: ["Galvani"], what: ["蛙腿抽动", "“动物电”"], color: A },
    { year: "1800", who: ["Volta"], what: ["伏打电堆", "第一个电池"], color: A },
    { year: "1817", who: ["Arfwedson"], what: ["在矿石中", "发现锂"], color: P },
    { year: "1836", who: ["Daniell"], what: ["电压稳定的", "双液电池"], color: A },
    { year: "1859", who: ["Planté"], what: ["铅酸电池", "能反复充电"], color: A },
    { year: "1889", who: ["Nernst"], what: ["电极电位", "Nernst 方程"], color: P },
    { year: "1913", who: ["Lewis & Keyes"], what: ["测出锂的", "电极电位"], color: P },
    { year: "1958", who: ["Harris"], what: ["碳酸丙烯酯中", "电解出锂"], color: T },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 85, right: 1125, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(730, 395, 150, 30, A, "电池", { size: 17 }) + pill(900, 395, 150, 30, P, "锂与电位", { size: 17 }) + pill(1070, 395, 150, 30, T, "非水溶剂", { size: 17 });
  return svg(W, H, b);
};

// ---------- 3. Galvani -> Volta pile ----------
figs.volta_pile = () => {
  const W = 820, H = 540;
  let b = "";
  // left: Volta's pile
  const px = 70, pw = 170;
  const layers = 5;
  for (let i = 0; i < layers; i++) {
    const y = 70 + i * 62;
    b += rect(px, y, pw, 18, CU, { rx: 4 });
    b += rect(px, y + 20, pw, 18, BRINE, { rx: 4, stroke: COL.tealLight, sw: 1.5 });
    b += rect(px, y + 40, pw, 18, ZN, { rx: 4 });
  }
  // wires
  b += line(px + pw, 79, px + pw + 70, 79, COL.ink, 3) + line(px + pw + 70, 79, px + pw + 70, 200, COL.ink, 3);
  b += line(px + pw, 369, px + pw + 70, 369, COL.ink, 3) + line(px + pw + 70, 369, px + pw + 70, 250, COL.ink, 3);
  // spark
  b += `<polygon points="${px + pw + 70},200 ${px + pw + 58},225 ${px + pw + 76},222 ${px + pw + 64},250 ${px + pw + 92},215 ${px + pw + 74},218 ${px + pw + 84},200" fill="${COL.amber}"/>`;
  b += text(px + pw / 2, 420, "伏打电堆 (1800)", { size: 22, anchor: "middle", weight: "bold" });
  b += text(px + pw / 2, 450, "铜 / 盐水布 / 锌 反复叠放", { size: 19, anchor: "middle", fill: COL.text2 });
  // legend chips
  const lg = [[CU, "铜 Cu"], [BRINE, "浸盐水的布"], [ZN, "锌 Zn"]];
  lg.forEach(([c, t], i) => {
    b += rect(70 + i * 135, 478, 24, 24, c, { rx: 4, stroke: COL.line, sw: 1 });
    b += text(102 + i * 135, 497, t, { size: 18, fill: COL.text2 });
  });
  // right: one cell zoom + rule
  const zx = 450;
  b += rect(zx, 60, 330, 190, COL.light, { rx: 16 });
  b += text(zx + 165, 98, "一个“单元” = 一个电池", { size: 21, anchor: "middle", weight: "bold" });
  b += rect(zx + 40, 120, 250, 24, CU, { rx: 4 });
  b += rect(zx + 40, 148, 250, 24, BRINE, { rx: 4, stroke: COL.tealLight, sw: 1.5 });
  b += rect(zx + 40, 176, 250, 24, ZN, { rx: 4 });
  b += text(zx + 165, 237, "两种金属 + 中间的导电液体", { size: 19, anchor: "middle", fill: COL.text2 });
  b += rect(zx, 275, 330, 180, "#FDF2E7", { rx: 16 });
  b += text(zx + 165, 313, "叠得越多，电压越高", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  b += lines(zx + 25, 352, ["1 层 → V", "n 层串联 → n × V", "今天的电池组也是这么串联的"], { size: 19, lh: 32, fill: COL.ink });
  return svg(W, H, b);
};

// ---------- 4. Cell anatomy (Daniell cell) ----------
figs.cell_anatomy = () => {
  const W = 820, H = 540;
  let b = "";
  // two beakers joined by a porous barrier
  b += rect(90, 190, 640, 230, "none", { rx: 18, stroke: COL.muted, sw: 3 });
  b += rect(93, 230, 315, 187, "#E7EBEF", {});
  b += rect(412, 230, 315, 187, "#DCEAF7", {});
  b += rect(404, 200, 12, 217, COL.line, { dash: "" });
  for (let y = 210; y < 410; y += 14) b += circ(410, y, 2.5, COL.muted);
  // electrodes
  b += rect(190, 140, 34, 250, ZN, { rx: 4 });
  b += rect(596, 140, 34, 250, CU, { rx: 4 });
  b += text(207, 450, "锌 Zn：负极", { size: 20, anchor: "middle", weight: "bold" });
  b += text(613, 450, "铜 Cu：正极", { size: 20, anchor: "middle", weight: "bold", fill: CU });
  b += text(207, 480, "Zn → Zn^{2+} + 2e^{−}", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(613, 480, "Cu^{2+} + 2e^{−} → Cu", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(410, 520, "多孔隔板：离子能过，两种溶液不混", { size: 18, anchor: "middle", fill: COL.muted });
  // external circuit
  b += line(207, 140, 207, 60, COL.ink, 3) + line(207, 60, 613, 60, COL.ink, 3) + line(613, 60, 613, 140, COL.ink, 3);
  b += circ(410, 60, 26, "#FFF6D6", { stroke: COL.sulfur, sw: 3 });
  b += line(396, 60, 424, 60, COL.sulfur, 3);
  b += electron(290, 60, 13) + electron(530, 60, 13);
  b += arrow(310, 38, 370, 38, { color: COL.amber, width: 3 }) + arrow(450, 38, 510, 38, { color: COL.amber, width: 3 });
  b += text(410, 26, "电子走外电路", { size: 19, anchor: "middle", weight: "bold", fill: COL.amber });
  // ions inside
  b += ion(300, 300, { r: 15, fill: ZN, label: "+" }) + ion(330, 350, { r: 15, fill: ZN, label: "+" });
  b += ion(520, 300, { r: 15, fill: CU, label: "+" }) + ion(500, 360, { r: 15, fill: CU, label: "+" });
  b += arrow(345, 260, 475, 260, { color: COL.purple, width: 3 });
  b += text(410, 248, "离子走电解质", { size: 19, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(250, 405, "ZnSO_{4} 溶液", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(570, 405, "CuSO_{4} 溶液", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 5. Primary vs secondary (lead-acid) ----------
figs.lead_acid = () => {
  const W = 820, H = 540;
  let b = "";
  // reaction with two arrows
  b += rect(30, 30, 760, 200, COL.light, { rx: 16 });
  b += text(410, 72, "铅酸电池的总反应（Planté 1859）", { size: 22, anchor: "middle", weight: "bold" });
  b += text(165, 150, "Pb + PbO_{2} + 2H_{2}SO_{4}", { size: 24, anchor: "middle", weight: "bold", fill: PB });
  b += text(665, 150, "2PbSO_{4} + 2H_{2}O", { size: 24, anchor: "middle", weight: "bold", fill: PB });
  b += arrow(320, 125, 540, 125, { color: COL.amber, width: 4, head: 16 });
  b += arrow(540, 160, 320, 160, { color: COL.teal, width: 4, head: 16 });
  b += text(430, 112, "放电：放出电能", { size: 19, anchor: "middle", fill: COL.amber, weight: "bold" });
  b += text(430, 195, "充电：外加电能，反应倒回去", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  // two cards
  b += rect(30, 260, 370, 250, "#FDF2E7", { rx: 16 });
  b += text(215, 300, "一次电池 Primary", { size: 22, anchor: "middle", weight: "bold", fill: COL.amber });
  b += lines(60, 345, ["伏打电堆、Daniell 电池、", "Leclanché 锌锰电池……", "反应物用完就报废"], { size: 19, lh: 34 });
  b += cross(215, 470, 14, COL.red, 5);
  b += rect(420, 260, 370, 250, "#E8F4F3", { rx: 16 });
  b += text(605, 300, "二次电池 Secondary", { size: 22, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(450, 345, ["铅酸、镍镉、锂离子……", "反应可逆，", "充电后能再用"], { size: 19, lh: 34 });
  b += check(605, 470, 16, COL.teal, 5);
  return svg(W, H, b);
};

// ---------- 6. Energy = V x Q ----------
figs.energy_formula = () => {
  const W = 820, H = 540;
  let b = "";
  b += text(410, 60, "能量 = 电压 × 电量", { size: 36, anchor: "middle", weight: "bold" });
  b += text(410, 98, "E (Wh) = V (V) × Q (Ah)", { size: 21, anchor: "middle", fill: COL.text2 });
  // two branches
  b += arrow(330, 112, 200, 165, { color: COL.purple, width: 3 }) + arrow(490, 112, 620, 165, { color: COL.teal, width: 3 });
  b += rect(30, 170, 360, 230, "#F1ECF8", { rx: 16 });
  b += text(210, 210, "电压：看“两个电极差多少”", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  b += lines(55, 255, ["V = 正极电位 − 负极电位", "负极电位越负，电压越高", "（第 2 节“电位阶梯”）"], { size: 19, lh: 34 });
  b += rect(430, 170, 360, 230, "#E8F4F3", { rx: 16 });
  b += text(610, 210, "电量：看“每克放几个电子”", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(610, 262, "Q = n F / M", { size: 28, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(455, 305, ["n：每个原子放出的电子数", "F：96 485 C/mol", "M：摩尔质量 (g/mol)，越轻越好"], { size: 18, lh: 30 });
  // example
  b += rect(30, 425, 760, 95, COL.light, { rx: 16 });
  b += text(55, 465, "例：锂  n = 1，M = 6.94  →  Q = 96 485 ÷ 6.94 ≈ 13 900 C/g", { size: 20 });
  b += text(55, 500, "÷ 3.6 换算成 mAh/g  →  约 3 860 mAh/g", { size: 20, weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

// ---------- 7. Discovery of lithium ----------
figs.li_discovery = () => {
  const W = 820, H = 540;
  let b = "";
  // periodic table corner
  const s = 92, x0 = 40, y0 = 40;
  const cells = [
    [0, 0, 1, "H", "1.008"],
    [0, 1, 3, "Li", "6.94"], [1, 1, 4, "Be", "9.01"],
    [0, 2, 11, "Na", "22.99"], [1, 2, 12, "Mg", "24.31"],
    [0, 3, 19, "K", "39.10"], [1, 3, 20, "Ca", "40.08"],
  ];
  cells.forEach(([c, r, z, sym, m]) => {
    const hl = sym === "Li";
    b += tile(x0 + c * (s + 8), y0 + r * (s + 8), s, z, sym, m, hl ? { fill: "#F1ECF8", stroke: LI, sw: 5, ink: LI } : {});
  });
  b += text(x0 + s / 2, y0 + 4 * (s + 8) + 26, "第 1 族", { size: 18, anchor: "middle", fill: COL.muted });
  b += text(x0 + s * 1.5 + 8, y0 + 4 * (s + 8) + 26, "第 2 族", { size: 18, anchor: "middle", fill: COL.muted });
  b += arrow(250, y0 + s + 8 + s / 2, 330, y0 + s + 8 + s / 2, { color: LI, width: 3 });
  // facts on the right
  const fx = 345;
  b += rect(fx, 40, 440, 135, "#F1ECF8", { rx: 16 });
  b += text(fx + 22, 80, "最轻的金属", { size: 22, weight: "bold", fill: LI });
  b += lines(fx + 22, 116, ["密度 0.534 g/cm^{3}，能浮在油上", "摩尔质量 6.94 g/mol"], { size: 19, lh: 30 });
  b += rect(fx, 190, 440, 135, COL.light, { rx: 16 });
  b += text(fx + 22, 230, "名字来自“石头”", { size: 22, weight: "bold" });
  b += lines(fx + 22, 266, ["希腊语 lithos = 石头：在矿石里发现", "钠、钾最早都是从植物灰里得到的"], { size: 19, lh: 30 });
  // flame
  b += rect(fx, 340, 440, 135, "#FBEDEC", { rx: 16 });
  b += `<path d="M ${fx + 60} 455 C ${fx + 20} 425, ${fx + 40} 395, ${fx + 60} 360 C ${fx + 66} 390, ${fx + 92} 400, ${fx + 84} 430 C ${fx + 82} 445, ${fx + 74} 455, ${fx + 60} 455 Z" fill="#D7263D"/>`;
  b += `<path d="M ${fx + 60} 452 C ${fx + 46} 440, ${fx + 52} 420, ${fx + 62} 405 C ${fx + 66} 420, ${fx + 76} 430, ${fx + 70} 444 Z" fill="#F7A1AE"/>`;
  b += text(fx + 110, 385, "焰色反应：洋红色", { size: 22, weight: "bold", fill: COL.red });
  b += lines(fx + 110, 421, ["1818 年 Gmelin 发现，", "后来成为鉴定锂的方法"], { size: 19, lh: 30 });
  return svg(W, H, b);
};

// ---------- 8. Electrode potential ladder ----------
figs.potential_ladder = () => {
  const W = 820, H = 540;
  let b = "";
  const top = 50, bot = 480, vmax = 0.6, vmin = -3.2;
  const Y = (v) => top + ((vmax - v) / (vmax - vmin)) * (bot - top);
  const ax = 200;
  b += line(ax, top - 10, ax, bot + 10, COL.ink, 3);
  b += text(ax, top - 22, "相对 SHE 的电位 (V)", { size: 18, anchor: "middle", fill: COL.text2 });
  [0.5, 0, -0.5, -1, -1.5, -2, -2.5, -3].forEach((v) => {
    b += line(ax - 8, Y(v), ax, Y(v), COL.ink, 2);
    b += text(ax - 14, Y(v) + 6, v.toFixed(1), { size: 18, anchor: "end", fill: COL.text2 });
  });
  const items = [
    [0.34, "Cu^{2+}/Cu", "+0.34", CU],
    [0.28, "甘汞电极（Lewis 用）", "+0.28", COL.muted],
    [0, "标准氢电极 SHE（零点）", "0", COL.teal],
    [-0.13, "Pb^{2+}/Pb", "−0.13", PB],
    [-0.76, "Zn^{2+}/Zn", "−0.76", ZN],
    [-2.71, "Na^{+}/Na", "−2.71", COL.amber],
    [-2.93, "K^{+}/K", "−2.93", COL.red],
    [-3.04, "Li^{+}/Li", "−3.04", LI],
  ];
  // label positions spread to avoid overlap
  const ly = { "+0.34": 0.52, "+0.28": 0.25, "0": -0.02, "−0.13": -0.3, "−0.76": -0.76, "−2.71": -2.5, "−2.93": -2.82, "−3.04": -3.14 };
  items.forEach(([v, name, val, c]) => {
    const y = Y(v), yl = Y(ly[val]);
    b += line(ax, y, ax + 70, y, c, 4);
    b += line(ax + 70, y, ax + 100, yl, c, 2);
    b += text(ax + 108, yl + 7, `${val}  ${name}`, { size: 19, fill: c, weight: v === -3.04 || v === 0 ? "bold" : undefined });
  });
  // Daniell bracket
  const bx = 640;
  b += line(bx, Y(0.34), bx, Y(-0.76), COL.amber, 3) + line(bx - 10, Y(0.34), bx + 10, Y(0.34), COL.amber, 3) + line(bx - 10, Y(-0.76), bx + 10, Y(-0.76), COL.amber, 3);
  b += lines(bx - 16, Y(-0.05), ["Daniell", "电池", "1.10 V"], { size: 18, fill: COL.amber, weight: "bold", lh: 24, anchor: "end" });
  b += line(bx + 70, Y(0.34), bx + 70, Y(-3.04), LI, 3) + line(bx + 60, Y(0.34), bx + 80, Y(0.34), LI, 3) + line(bx + 60, Y(-3.04), bx + 80, Y(-3.04), LI, 3);
  b += lines(bx + 88, Y(-1.6), ["Li 对", "Cu", "3.38 V"], { size: 18, fill: LI, weight: "bold", lh: 24 });
  return svg(W, H, b);
};

// ---------- 9. Lewis & Keyes "detour" measurement ----------
figs.lewis_detour = () => {
  const W = 820, H = 540;
  let b = "";
  // three "levels" from left to right, rising: Li(s) -> Li(Hg) -> calomel
  const bw = 200, bh = 58;
  const P1 = [30, 330], P2 = [310, 205], P3 = [590, 80];
  const box = ([x, y], fill, label) => rect(x, y, bw, bh, fill, { rx: 10 }) + text(x + bw / 2, y + 38, label, { size: 21, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += box(P1, LI, "金属锂 Li(s)") + box(P2, COL.siDark, "锂汞齐 Li(Hg)") + box(P3, COL.muted, "甘汞电极");
  b += arrow(P1[0] + bw / 2, P1[1], P2[0] - 6, P2[1] + bh / 2, { color: COL.purple, width: 4, head: 15 });
  b += arrow(P2[0] + bw / 2, P2[1], P3[0] - 6, P3[1] + bh / 2, { color: COL.teal, width: 4, head: 15 });
  // step cards under each arrow
  b += rect(30, 405, 370, 120, "#F1ECF8", { rx: 14 });
  b += text(48, 440, "① 0.9502 V：不用水", { size: 20, weight: "bold", fill: COL.purple });
  b += lines(48, 472, ["电解液：LiI 溶在丙胺里", "全程在真空中操作"], { size: 18, lh: 28 });
  b += rect(420, 405, 370, 120, "#E8F4F3", { rx: 14 });
  b += text(438, 440, "② 2.3542 V：可以用水了", { size: 20, weight: "bold", fill: COL.teal });
  b += lines(438, 472, ["汞齐里锂只有 0.035%，与水反应慢", "电解液：LiOH 水溶液（已换算）"], { size: 18, lh: 28 });
  // total
  b += rect(30, 20, 520, 110, COL.light, { rx: 14 });
  b += text(48, 58, "两步相加 = 锂相对甘汞电极", { size: 20, weight: "bold" });
  b += text(48, 104, "0.9502 + 2.3542 = 3.3044 V", { size: 28, weight: "bold", fill: COL.purple });
  b += text(610, 300, "锂直接碰水会剧烈反应，", { size: 18, fill: COL.red });
  b += text(610, 328, "所以“绕道”汞齐", { size: 18, fill: COL.red });
  return svg(W, H, b);
};

// ---------- 10. Water stability window ----------
figs.water_window = () => {
  const W = 1240, H = 300;
  let b = "";
  const x0 = 60, x1 = 1180, vmin = -3.5, vmax = 2.0;
  const X = (v) => x0 + ((v - vmin) / (vmax - vmin)) * (x1 - x0);
  const ay = 110;
  b += rect(X(vmin), ay - 80, X(0) - X(vmin), 80, "#FBEDEC");
  b += rect(X(0), ay - 80, X(1.23) - X(0), 80, "#DDEFF8");
  b += rect(X(1.23), ay - 80, X(vmax) - X(1.23), 80, "#FBEDEC");
  b += text((X(vmin) + X(0)) / 2, ay - 32, "水被还原：2H^{+} + 2e^{−} → H_{2}↑", { size: 25, anchor: "middle", weight: "bold", fill: COL.red });
  b += text((X(0) + X(1.23)) / 2, ay - 46, "水稳定", { size: 24, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text((X(0) + X(1.23)) / 2, ay - 16, "1.23 V", { size: 22, anchor: "middle", fill: COL.teal });
  b += text((X(1.23) + X(vmax)) / 2, ay - 32, "→ O_{2}↑", { size: 23, anchor: "middle", weight: "bold", fill: COL.red });
  b += line(x0, ay, x1, ay, COL.ink, 3);
  [-3, -2, -1, 0, 1, 2].forEach((v) => {
    b += line(X(v), ay, X(v), ay + 10, COL.ink, 2);
    b += text(X(v) + (v === -3 ? 22 : 0), ay + 36, (v > 0 ? "+" : "") + v, { size: 21, anchor: "middle", fill: COL.text2 });
  });
  b += text(x1, ay + 70, "电位 V vs SHE（pH 0）", { size: 20, anchor: "end", fill: COL.muted });
  const mk = (v, label, c) => {
    b += line(X(v), ay, X(v), ay + 56, c, 3, "6 5");
    b += circ(X(v), ay, 10, c);
    b += text(X(v), ay + 82, label, { size: 22, anchor: "middle", weight: "bold", fill: c });
  };
  mk(-3.04, "Li 析出：−3.04", LI);
  mk(-0.76, "Zn −0.76", ZN);
  b += arrow(X(-3.04) + 10, ay + 130, X(0) - 10, ay + 130, { color: LI, width: 3.5, head: 15 });
  b += text((X(-3.04) + X(0)) / 2, ay + 170, "差了 3 V：还没到锂析出的电位，氢气早就大量冒出来了", { size: 23, anchor: "middle", fill: LI, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 11. Nonaqueous history ----------
figs.nonaq_history = () => {
  const W = 1240, H = 360;
  const g = COL.text2, T = COL.teal;
  const ev = [
    { year: "1807", who: ["Davy"], what: ["电解熔融碱", "得到 K、Na"], color: g },
    { year: "1895–1909", who: ["Franklin & Kraus"], what: ["液氨溶液", "电导与溶解度"], color: g },
    { year: "1922–24", who: ["Müller 等"], what: ["吡啶中严格除水", "成功镀出金属"], color: g },
    { year: "1924", who: ["Walden"], what: ["《非水溶液", "电化学》专著"], color: g },
    { year: "1930 年代", who: ["Plotnikow 等"], what: ["卤代烃 + 铝盐", "电解铝"], color: g },
    { year: "1958", who: ["Harris"], what: ["环状碳酸酯", "PC、EC"], color: T },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 180, left: 110, right: 1110, whoSize: 23, whatSize: 22, yearSize: 27 }));
};

// ---------- 12. Solvent requirements ----------
figs.solvent_req = () => {
  const W = 820, H = 540;
  let b = "";
  const cols = ["水", "液氨", "乙醚", "PC"];
  const rows = [
    ["能溶解盐", "介电常数高"],
    ["不和锂反应", "没有活泼 H"],
    ["室温是液体", "液态范围宽"],
    ["不易挥发", "沸点高"],
  ];
  // marks: 1 = check, 0 = cross, 2 = partial
  const M = [
    [1, 2, 0, 1],
    [0, 0, 1, 1],
    [1, 0, 2, 1],
    [1, 0, 0, 1],
  ];
  const cx0 = 330, cw = 120, ry0 = 110, rh = 92;
  cols.forEach((c, j) => {
    const x = cx0 + j * cw;
    if (c === "PC") b += rect(x - 50, 30, 100, ry0 + rows.length * rh - 30, "#E8F4F3", { rx: 14 });
    b += text(x, 80, c, { size: 24, anchor: "middle", weight: "bold", fill: c === "PC" ? COL.teal : COL.ink });
  });
  rows.forEach(([h, s], i) => {
    const y = ry0 + i * rh;
    if (i) b += line(30, y, 790, y, COL.line, 1.5);
    b += text(40, y + 42, h, { size: 21, weight: "bold" });
    b += text(40, y + 72, s, { size: 18, fill: COL.text2 });
    M[i].forEach((m, j) => {
      const x = cx0 + j * cw, yy = y + 48;
      if (m === 1) b += check(x, yy, 15, COL.teal, 5);
      else if (m === 0) b += cross(x, yy, 12, COL.red, 5);
      else b += text(x, yy + 10, "△", { size: 28, anchor: "middle", fill: COL.amber, weight: "bold" });
    });
  });
  b += text(30, 515, "△ = 勉强。液氨会把锂溶解成蓝色溶液，沸点只有 −33 °C。乙醚介电常数只有 4.3。", { size: 18, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 13. Cyclic esters ----------
figs.cyclic_esters = () => {
  const W = 1240, H = 400;
  let b = "";
  const mols = [
    ["EC", "碳酸乙烯酯", "ε = 89（40 °C）", "熔点 36 °C：室温是固体", COL.teal],
    ["PC", "碳酸丙烯酯", "ε = 64", "熔点 −49 °C，沸点 242 °C", COL.teal],
    ["GBL", "γ-丁内酯", "ε = 39", "熔点 −44 °C", COL.text2],
    ["GVL", "γ-戊内酯", "—", "熔点 −31 °C", COL.text2],
  ];
  mols.forEach(([k, zh, eps, mp, c], i) => {
    const cx = 160 + i * 305;
    b += rect(cx - 140, 20, 280, 360, i < 2 ? "#E8F4F3" : COL.light, { rx: 16 });
    b += ring5(cx - 15, 150, 52, k);
    b += text(cx, 270, `${k}  ${zh}`, { size: 21, anchor: "middle", weight: "bold", fill: c });
    b += text(cx, 305, eps, { size: 19, anchor: "middle", fill: COL.ink });
    b += text(cx, 338, mp, { size: 17, anchor: "middle", fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- 14. Harris H-cell ----------
figs.harris_hcell = () => {
  const W = 820, H = 540;
  let b = "";
  // glove box outline
  b += rect(15, 15, 790, 510, "none", { rx: 22, stroke: COL.muted, sw: 2, dash: "10 8" });
  b += text(40, 50, "充氩气的干燥手套箱（隔绝水和空气）", { size: 19, fill: COL.muted });
  // two tubes
  const L1 = 210, R1 = 560, tw = 120, ty = 150, th = 300;
  [L1, R1].forEach((x) => {
    b += rect(x, ty, tw, th, "none", { rx: 24, stroke: COL.ink, sw: 3 });
    b += rect(x + 3, ty + 70, tw - 6, th - 73, "#DDEFF8", { rx: 20 });
  });
  // bridge
  b += rect(L1 + tw, 330, R1 - L1 - tw, 50, "#DDEFF8", { stroke: COL.ink, sw: 3 });
  b += rect(L1 + tw - 3, 333, 6, 44, "#DDEFF8");
  b += rect(R1 - 3, 333, 6, 44, "#DDEFF8");
  // frit
  const fx = (L1 + tw + R1) / 2;
  b += rect(fx - 12, 330, 24, 50, COL.line, {});
  for (let y = 338; y < 378; y += 9) for (let x = fx - 8; x < fx + 10; x += 8) b += circ(x, y, 2, COL.muted);
  // electrodes
  b += rect(L1 + tw / 2 - 4, 120, 8, 280, COL.alu, {});
  b += rect(R1 + tw / 2 - 4, 120, 8, 280, COL.alu, {});
  // Li deposit on cathode (left)
  b += rect(L1 + tw / 2 - 10, 250, 6, 140, LI, { rx: 3 });
  // stirrers
  b += rect(L1 + 35, 425, 50, 12, COL.ink, { rx: 6 }) + rect(R1 + 35, 425, 50, 12, COL.ink, { rx: 6 });
  // power supply
  b += rect(345, 70, 130, 56, COL.ink, { rx: 10 });
  b += text(410, 106, "直流电源", { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += line(L1 + tw / 2, 120, L1 + tw / 2, 98, COL.ink, 3) + line(L1 + tw / 2, 98, 345, 98, COL.ink, 3);
  b += line(R1 + tw / 2, 120, R1 + tw / 2, 98, COL.ink, 3) + line(R1 + tw / 2, 98, 475, 98, COL.ink, 3);
  b += text(330, 92, "−", { size: 24, anchor: "end", weight: "bold" }) + text(490, 92, "+", { size: 24, weight: "bold" });
  // labels
  b += lines(40, 200, ["阴极 (−)", "Pt 片", "Li^{+} + e^{−} → Li"], { size: 19, lh: 28, fill: LI, weight: "bold" });
  b += lines(695, 200, ["阳极 (+)", "Pt 片", "2Br^{−} → Br_{2}"], { size: 19, lh: 28, fill: COL.text2, weight: "bold" });
  b += text(fx, 410, "烧结玻璃隔膜", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(410, 490, "溶液：LiBr 饱和的碳酸丙烯酯 (PC)，共约 30 mL", { size: 20, anchor: "middle", weight: "bold" });
  b += text(L1 - 12, 440, "磁力搅拌子", { size: 17, anchor: "end", fill: COL.muted });
  return svg(W, H, b);
};

module.exports = figs;
