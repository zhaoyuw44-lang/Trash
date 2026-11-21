// Figures for Ko et al. 2026, Chapter 2 (Large shifts in electrode potentials). ~96 px per slide inch.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;
const { rect, line, circle, ellipse, path, solvated, potAxis, card, mol, flow } = require("./figlib");

const figs = {};

// ---------- Title motif: anode & cathode levels shifting up together ----------
figs.title_motif2 = () => {
  const W = 520, H = 620;
  let b = "";
  b += line(60, 600, 60, 40, "#5D6E7E", 4) + head(60, 28, -Math.PI / 2, "#5D6E7E", 16);
  // anode pair
  b += rect(110, 470, 120, 16, "#5D6E7E", { rx: 8 }) + rect(290, 400, 120, 16, COL.purpleLight, { rx: 8 });
  b += arrow(235, 472, 285, 418, { color: COL.red, width: 4, head: 14 });
  // cathode pair
  b += rect(110, 230, 120, 16, "#5D6E7E", { rx: 8 }) + rect(290, 160, 120, 16, COL.amber, { rx: 8 });
  b += arrow(235, 232, 285, 178, { color: COL.red, width: 4, head: 14 });
  // equal voltage brackets
  b += line(450, 176, 450, 400, COL.amberLight, 3, { dash: "8 7" });
  b += line(250, 246, 250, 470, "#5D6E7E", 3, { dash: "8 7" });
  b += solvated(400, 560, "AWAW", { r: 18, dist: 40, rx: 18, ry: 11 });
  return svg(W, H, b);
};

// ---------- Roadmap mini figure ----------
figs.roadmap_fig = () => {
  const W = 520, H = 210;
  let b = "";
  b += line(40, 150, 200, 150, COL.ink, 8) + text(120, 185, "传统电解液", { size: 17, anchor: "middle", weight: "bold" });
  b += line(300, 80, 460, 80, COL.purple, 8) + text(380, 115, "电位上移电解液", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += arrow(205, 145, 295, 88, { color: COL.red, width: 4, head: 15 });
  b += text(250, 50, "Li⁺/Li 电位 ↑ 0.6 V", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- Chemical potential as a "water level" ----------
figs.mu_hill = () => {
  const W = 680, H = 440;
  let b = "";
  // two tanks
  b += rect(40, 60, 220, 260, "#FFFFFF", { stroke: COL.ink, sw: 3 });
  b += rect(42, 110, 216, 208, COL.electrolyte);
  b += rect(420, 60, 220, 260, "#FFFFFF", { stroke: COL.ink, sw: 3 });
  b += rect(422, 230, 216, 88, COL.electrolyte);
  b += rect(260, 280, 160, 26, COL.electrolyte, { stroke: COL.ink, sw: 2 });
  b += arrow(285, 293, 400, 293, { color: "#1B5E86", width: 3.5, head: 13 });
  b += line(30, 110, 270, 110, COL.red, 3, { dash: "8 6" }) + text(150, 95, "μ 高", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += line(410, 230, 650, 230, COL.teal, 3, { dash: "8 6" }) + text(530, 215, "μ 低", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(340, 268, "自发流动", { size: 17, anchor: "middle", weight: "bold", fill: "#1B5E86" });
  b += text(340, 365, "化学势像“水位”：物质总是从 μ 高处流向 μ 低处", { size: 18, anchor: "middle", weight: "bold" });
  b += text(340, 400, "平衡时，同一物质在各处的 μ 相等（流动停止）", { size: 17, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Activity: effective concentration ----------
figs.activity_crowd = () => {
  const W = 680, H = 300;
  let b = "";
  b += rect(20, 10, 300, 210, COL.electrolyte, { rx: 14 });
  b += rect(360, 10, 300, 210, COL.electrolyte, { rx: 14 });
  [[80, 70], [250, 60], [120, 170], [260, 165]].forEach(([x, y]) => (b += solvated(x, y, "SSSS", { r: 13, dist: 28, rx: 12, ry: 7 })));
  [[180, 115]].forEach(([x, y]) => (b += ellipse(x, y, 14, 9, COL.redLight, { stroke: COL.red })));
  const agg = [[410, 55], [500, 50], [600, 60], [420, 125], [515, 120], [610, 130], [445, 185], [540, 180], [625, 190]];
  agg.forEach(([x, y]) => {
    b += ellipse(x + 18, y + 6, 14, 9, COL.redLight, { stroke: COL.red, rot: 30 });
    b += ellipse(x - 16, y - 8, 14, 9, COL.redLight, { stroke: COL.red, rot: -20 });
    b += ion(x, y, { r: 13 });
  });
  b += text(170, 252, "稀溶液：离子互不干扰", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(170, 282, "a ≈ c，γ ≈ 1", { size: 18, anchor: "middle", weight: "bold" });
  b += text(510, 252, "浓溶液：离子挤在一起、成团", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(510, 282, "a ≠ c，γ 可差几个数量级", { size: 18, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Eq. (1): Li+ energy level vs fixed Li metal ----------
figs.eq1_ladder = () => {
  const W = 600, H = 270;
  let b = "";
  b += line(30, 255, 30, 20, COL.ink, 3) + head(30, 10, -Math.PI / 2, COL.ink, 13);
  b += text(42, 24, "μ(Li⁺)", { size: 16, weight: "bold", fill: COL.text2 });
  b += line(60, 230, 180, 230, COL.siDark, 8) + text(120, 258, "Li 金属（固定）", { size: 16, anchor: "middle", weight: "bold" });
  b += line(250, 170, 370, 170, COL.teal, 8) + text(310, 198, "A：强配位", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += line(410, 80, 530, 80, COL.red, 8) + text(470, 108, "B：弱配位", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += solvated(310, 120, "SSSS", { r: 13, dist: 27, rx: 11, ry: 7 });
  b += solvated(470, 38, "AWAW", { r: 13, dist: 27, rx: 11, ry: 7 });
  b += line(215, 230, 215, 170, COL.teal, 3, { dash: "6 5" }) + line(215, 170, 250, 170, COL.teal, 2, { dash: "4 4" });
  b += text(208, 207, "F·E_{A}", { size: 17, anchor: "end", weight: "bold", fill: COL.teal });
  b += line(370, 170, 565, 170, COL.muted, 2, { dash: "4 4" });
  b += arrow(560, 168, 560, 88, { color: COL.amber, width: 4, head: 13 });
  b += text(575, 140, "Δμ", { size: 18, weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- Fig. 2a,b: quasi-reference Li vs internal Fc standard ----------
figs.ref_compare = () => {
  const W = 680, H = 430;
  let b = "";
  const beaker = (x0, lab) => {
    let s = rect(x0, 110, 270, 230, COL.electrolyte, { stroke: COL.line, sw: 2.5 });
    s += path(`M${x0 + 60},110 V60 H${x0 + 210} V110`, COL.ink, 2.5);
    s += circle(x0 + 135, 60, 18, "#FFFFFF", { stroke: COL.ink, sw: 2.5 }) + text(x0 + 135, 67, "V", { size: 18, anchor: "middle", weight: "bold" });
    s += text(x0 + 135, 30, lab, { size: 18, anchor: "middle", weight: "bold" });
    return s;
  };
  b += beaker(20, "电位 vs Li^{+}/Li");
  b += rect(70, 110, 24, 180, COL.siDark) + text(82, 312, "正极", { size: 16, anchor: "middle", weight: "bold" });
  b += rect(220, 110, 24, 180, COL.sulfur) + text(232, 312, "Li", { size: 16, anchor: "middle", weight: "bold" });
  b += arrow(100, 190, 212, 190, { color: COL.purple, width: 3, head: 11 }) + arrow(212, 215, 100, 215, { color: COL.purple, width: 3, head: 11 });
  b += text(155, 180, "Li⁺", { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
  b += beaker(390, "E_{Li⁺/Li} vs Fc^{+}/Fc");
  b += rect(440, 110, 24, 180, COL.alu) + text(452, 312, "Pt", { size: 16, anchor: "middle", weight: "bold" });
  b += rect(590, 110, 24, 180, COL.sulfur) + text(602, 312, "Li", { size: 16, anchor: "middle", weight: "bold" });
  b += pill(487, 165, 80, 30, COL.amber, "Fc", { size: 16 }) + pill(487, 225, 80, 30, COL.red, "Fc⁺", { size: 16 });
  b += arrow(510, 198, 510, 222, { color: COL.ink, width: 2.5, head: 9 }) + arrow(545, 222, 545, 198, { color: COL.ink, width: 2.5, head: 9 });
  b += lines(155, 380, ["a 准参比：Li 本身会随", "电解液移动 → 看不出"], { size: 16, anchor: "middle", weight: "bold", fill: COL.red, lh: 24 });
  b += lines(525, 380, ["b 内标：Fc⁺/Fc 几乎不随", "电解液变 → 可当“尺子”"], { size: 16, anchor: "middle", weight: "bold", fill: COL.teal, lh: 24 });
  return svg(W, H, b);
};

// ---------- Ferrocene sandwich ----------
figs.ferrocene = () => {
  const W = 440, H = 400;
  let b = "";
  const pent = (cx, cy, rx, ry) => {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      pts.push(`${(cx + rx * Math.cos(a)).toFixed(1)},${(cy + ry * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="${COL.light}" stroke="${COL.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  };
  b += pent(150, 90, 80, 30) + pent(150, 250, 80, 30);
  b += line(150, 112, 150, 148, COL.muted, 2.5, { dash: "5 4" }) + line(150, 192, 150, 228, COL.muted, 2.5, { dash: "5 4" });
  b += circle(150, 170, 26, COL.amber) + text(150, 178, "Fe", { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(150, 312, "二茂铁 Ferrocene（Fc）", { size: 18, anchor: "middle", weight: "bold" });
  b += lines(330, 120, ["两片环戊二烯", "环像“面包”", "把 Fe 夹住"], { size: 16, anchor: "middle", fill: COL.text2, lh: 24 });
  b += rect(20, 340, 400, 46, "#FDF2E7", { rx: 12 });
  b += text(220, 371, "Fc ⇌ Fc^{+} + e^{−}（单电子、可逆）", { size: 18, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- Fig. 2c: CVs of Fc+/Fc in two electrolytes ----------
const cvPath = (x, y, c) =>
  path(`M${x - 80},${y - 4} L${x - 32},${y - 7} C${x - 10},${y - 9} ${x - 6},${y - 46} ${x + 10},${y - 46} C${x + 26},${y - 46} ${x + 38},${y - 22} ${x + 80},${y - 18} L${x + 80},${y + 6} C${x + 40},${y + 10} ${x + 14},${y + 12} ${x - 2},${y + 42} C${x - 14},${y + 42} ${x - 28},${y + 12} ${x - 80},${y + 4} Z`, c, 3.5);
figs.cv_shift = () => {
  const W = 700, H = 460;
  let b = "";
  const _px = 62; // px per 0.5 V... use scale 124 px / V
  const s = 124;
  const xFc = 560;
  // top: traditional, Fc at 3.45 V vs Li; break axis: show 0 and 0.6 near left, 3.0/3.6 near Fc
  const top = 120, bot = 310;
  const axis = (y, ticks, fcV, col, lab) => {
    let o = line(40, y, 680, y, COL.ink, 2.5) + head(690, y, 0, COL.ink, 12);
    ticks.forEach(([v, x]) => (o += line(x, y, x, y + 8, COL.ink, 2) + text(x, y + 66, v, { size: 17, anchor: "middle", fill: COL.text2 })));
    o += `<line x1="340" y1="${y - 10}" x2="350" y2="${y + 10}" stroke="${COL.ink}" stroke-width="2"/><line x1="350" y1="${y - 10}" x2="360" y2="${y + 10}" stroke="${COL.ink}" stroke-width="2"/>`;
    o += cvPath(xFc, y, col);
    o += text(215, y - 62, lab, { size: 17, weight: "bold", fill: col });
    return o;
  };
  // positions: Fc at xFc; 3.0 V tick at xFc - 0.45*s etc.
  b += axis(top, [["0", 120], ["0.6", 120 + 0.6 * s], ["3.0", xFc - 0.45 * s], ["3.6", xFc + 0.15 * s]], 3.45, COL.teal, "传统电解液（强配位）");
  b += axis(bot, [["−0.6", 120], ["0", 120 + 0.6 * s], ["2.4", xFc - 0.45 * s], ["3.0", xFc + 0.15 * s]], 2.85, COL.red, "先进电解液（弱配位）");
  b += line(xFc, 50, xFc, 400, COL.muted, 2, { dash: "6 5" }) + text(xFc, 40, "Fc⁺/Fc（不动的尺子）", { size: 17, anchor: "middle", weight: "bold" });
  b += line(120, top - 30, 120, bot + 10, COL.muted, 2, { dash: "6 5" });
  b += line(120 + 0.6 * s, bot - 40, 120 + 0.6 * s, bot + 10, COL.muted, 2, { dash: "6 5" });
  b += arrow(124, bot - 55, 120 + 0.6 * s - 4, bot - 55, { color: COL.red, width: 4, head: 14 });
  b += text(120 + 0.3 * s, bot - 68, "↑ 0.6 V", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(120, top - 40, "Li⁺/Li 的“0 V”", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += text(360, 448, "横轴：各自电解液中的 V vs Li^{+}/Li；竖轴：归一化电流", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Strong vs weak ligands ----------
figs.solv_compare = () => {
  const W = 680, H = 440;
  let b = "";
  b += rect(20, 20, 300, 300, "#E8F4F3", { rx: 16 });
  b += rect(360, 20, 300, 300, "#FBEDEC", { rx: 16 });
  b += solvated(170, 150, "SSSS", { r: 26, dist: 52, rx: 26, ry: 15 });
  b += solvated(510, 150, "AWAW", { r: 26, dist: 66, rx: 30, ry: 17 });
  b += text(170, 270, "强相互作用配体", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(170, 298, "EC、glyme 等", { size: 17, anchor: "middle", fill: COL.text2 });
  b += text(510, 270, "弱相互作用配体", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(510, 298, "PF_{6}^{−}、FSI^{−}、氟化醚等", { size: 17, anchor: "middle", fill: COL.text2 });
  b += lines(170, 360, ["极性强、给电子数高或螯合", "配位距离短、配位数高"], { size: 16, anchor: "middle", lh: 26 });
  b += lines(510, 360, ["体积大、含氟、电子云分散", "配位距离长或配位数低"], { size: 16, anchor: "middle", lh: 26 });
  return svg(W, H, b);
};

// ---------- Electrostatic potential well: deep vs shallow ----------
figs.potential_well = () => {
  const W = 680, H = 440;
  let b = "";
  b += line(40, 70, 640, 70, COL.line, 2, { dash: "6 6" });
  b += text(645, 64, "远处", { size: 16, anchor: "end", fill: COL.muted });
  // deep well
  b += path("M50,70 C120,70 130,310 180,310 C230,310 240,70 310,70", COL.teal, 5);
  b += ion(180, 296, { r: 14 });
  b += text(180, 350, "阱深：Li⁺ 被稳稳抓住", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(180, 378, "μ_{Li⁺} 低", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  // shallow well
  b += path("M370,70 C440,70 450,190 500,190 C550,190 560,70 630,70", COL.red, 5);
  b += ion(500, 176, { r: 14 });
  b += text(500, 350, "阱浅：Li⁺ “坐不稳”", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(500, 378, "μ_{Li⁺} 高 → E_{Li⁺/Li} 上移", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += arrow(330, 296, 330, 192, { color: COL.amber, width: 3.5, head: 13 });
  b += line(196, 296, 330, 296, COL.muted, 1.5, { dash: "4 4" }) + line(330, 190, 484, 190, COL.muted, 1.5, { dash: "4 4" });
  b += text(340, 250, "去稳定", { size: 17, weight: "bold", fill: COL.amber });
  b += text(340, 425, "示意：Li⁺ 所在位置的静电势能（越低越稳定）", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Three potential-upshift electrolyte families ----------
figs.three_types = () => {
  const W = 1180, H = 360;
  let b = "";
  const panels = [
    { x: 20, t: "高浓电解液 HCE", s: "盐多、自由溶剂几乎没有", c: COL.purple },
    { x: 410, t: "局部高浓 LHCE", s: "高浓“团簇”分散在惰性稀释剂中", c: COL.teal },
    { x: 800, t: "弱溶剂化 WSE", s: "溶剂本身配位弱，阴离子进入溶剂化层", c: COL.amber },
  ];
  panels.forEach((p) => {
    b += rect(p.x, 20, 360, 250, COL.electrolyte, { rx: 16, stroke: p.c, sw: 3 });
    b += text(p.x + 180, 300, p.t, { size: 20, anchor: "middle", weight: "bold", fill: p.c });
    b += text(p.x + 180, 330, p.s, { size: 16, anchor: "middle", fill: COL.text2 });
  });
  // HCE: dense aggregates
  const R = rng(3);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) b += solvated(70 + i * 88, 70 + j * 75, "AASA".slice(0, 3 + ((i + j) % 2)), { r: 12, dist: 25, rx: 11, ry: 7, rot: (i * 40) % 90 });
  // LHCE: clusters + diluent
  for (let i = 0; i < 18; i++) b += ellipse(430 + R() * 320, 40 + R() * 210, 12, 7, COL.light, { stroke: COL.line });
  [[490, 90], [660, 120], [540, 210], [700, 220]].forEach(([x, y]) => (b += solvated(x, y, "AAS", { r: 12, dist: 25, rx: 11, ry: 7 })));
  // WSE: CIPs in weak solvent
  for (let i = 0; i < 10; i++) b += ellipse(820 + R() * 320, 40 + R() * 210, 12, 7, COL.tealLight, { stroke: COL.teal });
  [[880, 90], [1060, 100], [940, 200], [1110, 210]].forEach(([x, y]) => (b += solvated(x, y, "AWW", { r: 12, dist: 25, rx: 11, ry: 7 })));
  return svg(W, H, b);
};

// ---------- History of concentrated electrolytes ----------
figs.hce_timeline = () => {
  const W = 1240, H = 430;
  const ev = [
    { year: "1985", who: ["McKinnon & Dahn"], what: ["高盐浓度抑制", "溶剂共嵌入"], color: COL.text2 },
    { year: "2003", who: ["Jeong, Ogumi 等"], what: ["浓 PC 电解液", "让石墨可用"], color: COL.text2 },
    { year: "2013", who: ["Suo, Chen 等"], what: ["solvent-in-salt", "（Li–S）"], color: COL.purple },
    { year: "2014", who: ["Yamada 等"], what: ["超浓乙腈", "电解液快充"], color: COL.purple },
    { year: "2015", who: ["Suo, Wang, Xu 等"], what: ["water-in-salt", "水系 3 V"], color: COL.purple },
    { year: "2016", who: ["Wang, Yamada 等"], what: ["5.5 M LiFSI/DMC", "5 V 级电池"], color: COL.purple },
    { year: "2018", who: ["Chen, Zhang 等"], what: ["局部高浓", "LHCE"], color: COL.teal },
    { year: "2021", who: ["Yao, Zhang 等"], what: ["弱溶剂化", "WSE"], color: COL.teal },
    { year: "2022", who: ["Ko 等"], what: ["统一解释：", "电位上移"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 210, left: 90, right: 1130, whoSize: 18, whatSize: 17, yearSize: 26 }));
};

// ---------- Temperature coefficient: entropy caution ----------
figs.entropy_T = () => {
  const W = 560, H = 400;
  let b = "";
  const X0 = 80, X1 = 520, Y0 = 320, Y1 = 40;
  b += line(X0, Y0, X1, Y0, COL.ink, 2.5) + head(X1 + 10, Y0, 0, COL.ink, 12);
  b += line(X0, Y0, X0, Y1, COL.ink, 2.5) + head(X0, Y1 - 10, -Math.PI / 2, COL.ink, 12);
  b += text((X0 + X1) / 2, Y0 + 40, "温度 T", { size: 18, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(${X0 - 24} ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "电位 E", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  b += line(X0 + 20, 250, X1 - 20, 110, COL.teal, 4);
  b += text(X1 - 30, 98, "理想：斜率 = ΔS / F", { size: 17, anchor: "end", weight: "bold", fill: COL.teal });
  b += path(`M${X0 + 20},270 C200,262 300,240 360,190 C400,160 450,150 ${X1 - 20},150`, COL.red, 4, { dash: "9 6" });
  b += lines(X1 - 20, 245, ["实际：溶剂化结构", "也随 T 改变"], { size: 17, anchor: "end", weight: "bold", fill: COL.red, lh: 24 });
  b += solvated(150, 105, "SSSS", { r: 13, dist: 28, rx: 11, ry: 7 }) + solvated(265, 105, "SAWS", { r: 13, dist: 28, rx: 11, ry: 7 });
  b += arrow(188, 105, 225, 105, { color: COL.muted, width: 2.5, head: 9 });
  return svg(W, H, b);
};

// ---------- Fig. 2d: parallel shift of both electrode potentials ----------
figs.parallel_shift = () => {
  const W = 1180, H = 300;
  let b = "";
  const ax = potAxis(60, 1120, 230, -4, 2.5, [-3, -2, -1, 0, 1, 2], { fmt: (t) => t.toFixed(1).replace("-", "−"), label: "电位（V vs Fc^{+}/Fc）" });
  b += ax.b;
  const X = ax.X;
  const bar = (v, y, c) => rect(X(v) - 6, y, 12, 60, c, { rx: 3 });
  b += bar(-3.55, 70, COL.ink) + bar(-2.95, 140, COL.purple);
  b += bar(1.35, 70, COL.ink) + bar(1.95, 140, COL.purple);
  b += arrow(X(-3.55) + 10, 110, X(-2.95) - 10, 160, { color: COL.red, width: 3.5, head: 13 });
  b += arrow(X(1.35) + 10, 110, X(1.95) - 10, 160, { color: COL.red, width: 3.5, head: 13 });
  b += text(X(-3.55), 55, "负极 Li^{+}/Li", { size: 18, anchor: "middle", weight: "bold" });
  b += text(X(1.35), 55, "正极（嵌 Li^{+}）", { size: 18, anchor: "middle", weight: "bold" });
  b += text(X(-0.8), 95, "V_{battery} = E_{cathode} − E_{anode}", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(X(-0.8), 135, "所有涉及 Li⁺ 的反应移动同样多 → 电池电压不变", { size: 18, anchor: "middle", weight: "bold" });
  b += text(X(-2.3), 190, "深色：传统电解液", { size: 16, fill: COL.ink, anchor: "middle" });
  b += text(X(0.4), 190, "紫色：电位上移电解液", { size: 16, fill: COL.purple, anchor: "middle" });
  return svg(W, H, b);
};

// ---------- Fig. 2e: windows and interphase burdens ----------
figs.window_tradeoff = () => {
  const W = 1180, H = 410;
  let b = "";
  const X = (v) => 140 + (v + 3.4) * 175; // -3.4..2.4 V vs Fc
  const rows = [
    { y: 30, t: "传统电解液", an: -3.5, ca: 1.35, lo: -2.75, hi: 1.2, hs: true, hc: false, sei: "严重还原，SEI 负担大", cei: "", c: COL.ink },
    { y: 150, t: "大幅上移电解液", an: -2.9, ca: 1.95, lo: -2.4, hi: 1.2, hs: false, hc: true, sei: "", cei: "严重氧化，CEI 负担大", c: COL.purple },
    { y: 270, t: "未来电解液", an: -2.9, ca: 1.95, lo: -2.4, hi: 1.6, hs: false, hc: false, sei: "", cei: "", c: COL.teal },
  ];
  const win = { lo: -2.75, hi: 1.55 }; // illustrative electrolyte window
  rows.forEach((r, i) => {
    b += text(20, r.y + 52, r.t, { size: 18, weight: "bold", fill: r.c });
    const hi = r.hi, lo = r.lo;
    b += rect(X(lo), r.y + 20, X(hi) - X(lo), 50, COL.light, { rx: 6 });
    b += text((X(lo) + X(hi)) / 2, r.y + 52, i === 2 ? "电解液（更耐氧化）" : "电解液稳定区", { size: 16, anchor: "middle", fill: COL.text2, weight: "bold" });
    b += rect(X(r.an) - 6, r.y + 10, 12, 70, COL.ink, { rx: 3 });
    b += rect(X(r.ca) - 6, r.y + 10, 12, 70, COL.ink, { rx: 3 });
    // SEI arrow (gap anode->window low)
    if (r.an < lo) {
      const heavy = r.hs;
      b += arrow(X(lo) - 4, r.y + 45, X(r.an) + 10, r.y + 45, { color: heavy ? COL.red : COL.tealLight, width: heavy ? 6 : 4, head: 14 });
      b += text((X(lo) + X(r.an)) / 2, r.y + 100, "SEI", { size: 16, anchor: "middle", weight: "bold", fill: heavy ? COL.red : COL.teal });
    }
    if (r.ca > hi) {
      const heavy = r.hc;
      b += arrow(X(hi) + 4, r.y + 45, X(r.ca) - 10, r.y + 45, { color: heavy ? COL.red : COL.tealLight, width: heavy ? 6 : 4, head: 14 });
      b += text((X(hi) + X(r.ca)) / 2, r.y + 100, "CEI", { size: 16, anchor: "middle", weight: "bold", fill: heavy ? COL.red : COL.teal });
    }
    if (r.sei) b += text(X(r.an) + 20, r.y + 100, "", {}) + text(X(-1.3), r.y + 100, "← " + r.sei, { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
    if (r.cei) b += text(X(-0.3), r.y + 100, r.cei + " →", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
    if (i === 2) b += text(X(-0.3), r.y + 100, "上移 + 耐氧化溶剂/稀释剂 + 先进 SEI/CEI → 分解最少", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  });
  b += line(X(-3.5), 30, X(-3.5), 380, COL.muted, 1.5, { dash: "5 5" });
  return svg(W, H, b);
};

module.exports = figs;
