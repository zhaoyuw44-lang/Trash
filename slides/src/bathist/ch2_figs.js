// Figures for 锂电池发展史 Chapter 2: 1970 年代——嵌入化学与锂金属电池（Whittingham 1976）
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, electron, rng } = L;

const figs = {};
const LI = COL.purple;       // lithium
const TI = COL.teal;         // titanium
const S = COL.sulfur;        // sulfur
const SL = COL.sulfurLight;
const BRINE = COL.electrolyte;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const rot = (x, y, body) => `<g transform="rotate(-90 ${x} ${y})">${body}</g>`;

// Smooth open path through points (Catmull-Rom -> cubic Bezier).
function smooth(pts, c, w = 3.5, dash) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

// One S–Ti–S slab drawn in side view. Returns svg body.
// x0: first S x, n: number of S atoms per row, dx: spacing, y: top S row.
function slab(x0, y, n, dx, o = {}) {
  const r = o.r || 13, rt = o.rt || 10, h = o.h || 30;
  let b = "";
  // Ti–S bonds (zig-zag) inside the slab
  for (let i = 0; i < n - 1; i++) {
    const tx = x0 + dx / 2 + i * dx;
    b += line(tx, y + h, x0 + i * dx, y, o.bond || COL.line, 3) + line(tx, y + h, x0 + (i + 1) * dx, y, o.bond || COL.line, 3);
    b += line(tx, y + h, x0 + i * dx, y + 2 * h, o.bond || COL.line, 3) + line(tx, y + h, x0 + (i + 1) * dx, y + 2 * h, o.bond || COL.line, 3);
  }
  for (let i = 0; i < n; i++) b += circ(x0 + i * dx, y, r, o.s || S) + circ(x0 + i * dx, y + 2 * h, r, o.s || S);
  for (let i = 0; i < n - 1; i++) b += circ(x0 + dx / 2 + i * dx, y + h, rt, o.ti || TI);
  return b;
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 470, H = 560;
  let b = "";
  const x0 = 40, dx = 55, n = 7;
  const ys = [60, 190, 320];
  ys.forEach((y) => (b += slab(x0, y, n, dx, { bond: "#4A5866", s: "#D9A400", ti: "#9FD3CF", r: 12, rt: 9, h: 27 })));
  // lithium in the two gaps
  [[0, 1, 3, 5], [1, 2, 4]].forEach((idx, g) => {
    const y = ys[g] + 54 + 38;
    idx.forEach((i) => (b += ion(x0 + dx / 2 + i * dx, y, { r: 13, fill: "#8E6CC9", label: "+" })));
  });
  b += text(440, 125, "Li^{+}", { size: 22, anchor: "middle", fill: "#C9B8E8", weight: "bold" });
  b += arrow(440, 140, 440, 300, { color: "#C9B8E8", width: 3, head: 14 });
  b += text(225, 450, "Li_{x}TiS_{2}", { size: 40, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(225, 490, "锂进出层间，骨架不变", { size: 20, anchor: "middle", fill: "#CADCE8" });
  b += pill(65, 510, 320, 42, COL.amber, "1976 · Exxon · Whittingham", { size: 18 });
  return svg(W, H, b);
};

// ---------- 1. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const P = LI, T = COL.teal, A = COL.amber, G = COL.muted;
  const ev = [
    { year: "1938", who: ["Rüdorff &", "Hofmann"], what: ["石墨层间化合物"], color: P },
    { year: "1958", who: ["Harris"], what: ["PC 中电解出锂", "（第 1 章）"], color: T },
    { year: "1970", who: ["Gamble 等"], what: ["分子嵌入", "层状硫化物"], color: P },
    { year: "1972", who: ["Li/I_{2} 电池"], what: ["用于心脏起搏器"], color: A },
    { year: "1973", who: ["Whittingham"], what: ["TiS_{2} 电池专利", "同年石油危机"], color: P },
    { year: "1975", who: ["Sanyo"], what: ["Li/MnO_{2}", "一次电池"], color: A },
    { year: "1976", who: ["Whittingham"], what: ["Science 论文", "Li/TiS_{2}"], color: P },
    { year: "1980", who: ["Goodenough 等"], what: ["LiCoO_{2}", "（第 4 章）"], color: G },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 85, right: 1125, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(560, 395, 150, 30, P, "嵌入化学", { size: 17 }) + pill(725, 395, 150, 30, A, "锂一次电池", { size: 17 });
  b += pill(890, 395, 150, 30, T, "电解液", { size: 17 }) + pill(1055, 395, 150, 30, G, "后续章节", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Motivation: oil crisis -> ambient-temperature battery ----------
figs.motivation = () => {
  const W = 820, H = 540;
  let b = "";
  // oil barrel
  b += rect(30, 25, 360, 175, "#FBEDEC", { rx: 16 });
  const bx = 60, by = 55;
  b += rect(bx, by, 70, 100, COL.siDark, { rx: 10 });
  b += rect(bx, by + 25, 70, 8, COL.si) + rect(bx, by + 67, 70, 8, COL.si);
  b += text(bx + 35, by + 57, "OIL", { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(155, 75, "1973 石油危机", { size: 24, weight: "bold", fill: COL.red });
  b += lines(155, 112, ["产油国禁运", "油价约涨到 4 倍", "石油公司找新能源"], { size: 19, lh: 30 });
  b += arrow(390, 112, 425, 112, { color: COL.ink, width: 3 });
  // needs
  b += rect(430, 25, 360, 175, COL.light, { rx: 16 });
  b += text(450, 65, "需要高能量电池（原文）", { size: 21, weight: "bold" });
  b += lines(450, 105, ["· 电动汽车 (electric vehicle)", "· 储存夜间低谷电", "· 储存太阳能"], { size: 19, lh: 32 });
  // high-temp candidates
  b += arrow(410, 205, 410, 238, { color: COL.ink, width: 3 });
  b += rect(30, 242, 760, 120, "#FDF2E7", { rx: 16 });
  b += text(50, 280, "当时的主角：高温电池", { size: 21, weight: "bold", fill: COL.amber });
  b += pill(50, 300, 200, 40, COL.amber, "Na/S  约 300 °C", { size: 18 });
  b += pill(265, 300, 250, 40, COL.amber, "Li/金属硫化物 400 °C+", { size: 18 });
  b += cross(550, 318, 13, COL.red, 5);
  b += lines(575, 300, ["腐蚀问题没解决", "还要保温，增加死重"], { size: 18, lh: 28, fill: COL.red });
  // goal
  b += arrow(410, 365, 410, 398, { color: COL.ink, width: 3 });
  b += rect(30, 402, 760, 125, "#E8F4F3", { rx: 16 });
  b += text(50, 440, "Whittingham 的目标：室温下可逆工作的碱金属电池", { size: 21, weight: "bold", fill: COL.teal });
  b += text(50, 477, "负极：锂　　电解液：有机溶剂", { size: 19 });
  b += text(50, 510, "正极：？？ ← 本章要找的东西", { size: 19, weight: "bold", fill: LI });
  return svg(W, H, b);
};

// ---------- 3. Cathode wish list ----------
figs.cathode_wishlist = () => {
  const W = 1240, H = 330;
  let b = "";
  const cards = [
    ["导电子", "electronically", "conductive", COL.amber, "#FDF2E7"],
    ["氧化性强", "highly oxidizing", "→ 电压高", LI, "#F1ECF8"],
    ["与锂快速、可逆反应", "react readily and", "reversibly with Li", COL.teal, "#E8F4F3"],
    ["轻、便宜", "light in weight and", "inexpensive", COL.siDark, COL.light],
  ];
  const cw = 290, gap = 13;
  cards.forEach(([h, e1, e2, c, tint], i) => {
    const x = 10 + i * (cw + gap);
    b += rect(x, 10, cw, 310, tint, { rx: 16 });
    b += circ(x + 32, 42, 18, c) + text(x + 32, 49, String(i + 1), { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    const cx = x + cw / 2, cy = 135;
    if (i === 0) {
      b += rect(cx - 95, cy - 18, 190, 36, COL.alu, { rx: 8 });
      [-55, 0, 55].forEach((dx) => (b += electron(cx + dx, cy, 13)));
      b += arrow(cx - 80, cy - 36, cx + 80, cy - 36, { color: c, width: 3 });
    } else if (i === 1) {
      b += line(cx - 60, cy + 45, cx + 60, cy + 45, COL.ink, 3);
      b += rect(cx - 30, cy - 50, 60, 95, c, { rx: 6 });
      b += text(cx, cy + 8, "V", { size: 30, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
      b += arrow(cx + 55, cy + 30, cx + 55, cy - 50, { color: c, width: 3 });
    } else if (i === 2) {
      b += arrow(cx - 70, cy - 14, cx + 70, cy - 14, { color: c, width: 3.5 });
      b += arrow(cx + 70, cy + 18, cx - 70, cy + 18, { color: c, width: 3.5 });
      b += ion(cx, cy - 40, { r: 15, fill: LI, label: "+" });
      b += text(cx, cy + 62, "放电 ⇄ 充电", { size: 18, anchor: "middle", fill: COL.text2 });
    } else {
      // feather-like leaf + coin
      b += `<path d="M ${cx - 70} ${cy + 40} C ${cx - 60} ${cy - 30}, ${cx - 10} ${cy - 55}, ${cx + 10} ${cy - 50} C ${cx} ${cy - 10}, ${cx - 30} ${cy + 25}, ${cx - 70} ${cy + 40} Z" fill="${COL.si}"/>`;
      b += circ(cx + 55, cy + 5, 34, COL.sulfur) + text(cx + 55, cy + 16, "$", { size: 32, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    }
    b += text(cx, 245, h, { size: 22, anchor: "middle", weight: "bold", fill: c });
    b += text(cx, 276, e1, { size: 18, anchor: "middle", fill: COL.text2, italic: true });
    b += text(cx, 302, e2, { size: 18, anchor: "middle", fill: COL.text2, italic: true });
  });
  return svg(W, H, b);
};

// ---------- 4. Intercalation concept ----------
figs.intercalation_concept = () => {
  const W = 820, H = 540;
  let b = "";
  const host = (x, ys, wSlab) => ys.map((y) => rect(x, y, wSlab, 34, COL.si, { rx: 8 })).join("");
  // left: empty host
  b += text(165, 40, "主体 (host)：层状晶体", { size: 20, anchor: "middle", weight: "bold" });
  b += host(40, [70, 145, 220], 250);
  b += text(165, 300, "层间空着", { size: 19, anchor: "middle", fill: COL.text2 });
  // right: filled host, layers spread a little
  b += text(655, 40, "嵌入后：客体住进层间", { size: 20, anchor: "middle", weight: "bold", fill: LI });
  b += host(530, [60, 145, 230], 250);
  [116, 201].forEach((y) => [565, 620, 675, 730].forEach((x, i) => (b += ion(x + (y === 201 ? 27 : 0) - (i === 3 && y === 201 ? 55 : 0), y, { r: 12, fill: LI }))));
  // spacing marks
  b += line(795, 94, 795, 145, COL.amber, 3) + line(788, 94, 802, 94, COL.amber, 3) + line(788, 145, 802, 145, COL.amber, 3);
  b += text(655, 300, "层间距略微撑开", { size: 19, anchor: "middle", fill: COL.amber });
  // arrows
  b += arrow(310, 140, 505, 140, { color: LI, width: 4, head: 15 });
  b += text(408, 125, "+ Li^{+} + e^{−}", { size: 20, anchor: "middle", weight: "bold", fill: LI });
  b += arrow(505, 190, 310, 190, { color: COL.teal, width: 4, head: 15 });
  b += text(408, 225, "可以原路退出", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  // contrast box
  b += rect(30, 335, 760, 190, "#FBEDEC", { rx: 16 });
  b += text(50, 373, "对比：以前的电极反应要“拆房重建”", { size: 21, weight: "bold", fill: COL.red });
  b += lines(50, 415, ["锌电极：Zn → Zn^{2+}　金属溶解，下次再重新长出来", "铅酸正极：PbO_{2} → PbSO_{4}　变成另一种晶体",
    "嵌入：TiS_{2} → Li_{x}TiS_{2}　骨架不变，只多了“房客”"], { size: 19, lh: 38 });
  b += cross(745, 408, 10, COL.red, 4) + cross(745, 446, 10, COL.red, 4) + check(745, 482, 12, COL.teal, 5);
  return svg(W, H, b);
};

// ---------- 5. Pre-history of intercalation ----------
figs.intercal_history = () => {
  const W = 1240, H = 380;
  const g = COL.text2, P = LI;
  const ev = [
    { year: "1840 年代", who: ["Schafhäutl"], what: ["硫酸插进石墨"], color: g },
    { year: "1926", who: ["Fredenhagen &", "Cadenbach"], what: ["钾进入石墨", "得到 C_{8}K"], color: g },
    { year: "1938", who: ["Rüdorff &", "Hofmann"], what: ["石墨盐结构", "“阶”的概念"], color: g },
    { year: "1960 年代", who: ["Rüdorff"], what: ["碱金属插进", "TiS_{2} 等硫化物"], color: g },
    { year: "1970", who: ["Gamble 等"], what: ["有机分子嵌入", "TaS_{2}，超导"], color: g },
    { year: "1970 年代初", who: ["Rouxel、", "Schöllhorn 等"], what: ["碱金属嵌入", "层状化合物"], color: g },
    { year: "1972–73", who: ["Armand、Steele"], what: ["嵌入化合物", "可作电极"], color: COL.amber },
    { year: "1973–76", who: ["Whittingham"], what: ["Li/TiS_{2}", "可充电池"], color: P },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 190, left: 95, right: 1120, whoSize: 18, whatSize: 18, yearSize: 22 }));
};

// ---------- 6. Chemical vs electrochemical intercalation ----------
figs.electrochem_route = () => {
  const W = 820, H = 540;
  let b = "";
  // row 1: chemical
  b += rect(20, 20, 780, 215, COL.light, { rx: 16 });
  b += text(40, 58, "化学法（以前）", { size: 22, weight: "bold", fill: COL.text2 });
  // flask
  const fx = 120, fy = 72;
  b += `<path d="M ${fx - 14} ${fy} L ${fx - 14} ${fy + 40} L ${fx - 55} ${fy + 105} Q ${fx - 60} ${fy + 118} ${fx - 45} ${fy + 118} L ${fx + 45} ${fy + 118} Q ${fx + 60} ${fy + 118} ${fx + 55} ${fy + 105} L ${fx + 14} ${fy + 40} L ${fx + 14} ${fy} Z" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3"/>`;
  b += `<path d="M ${fx - 40} ${fy + 82} L ${fx + 40} ${fy + 82} L ${fx + 52} ${fy + 108} Q ${fx + 52} ${fy + 114} ${fx + 44} ${fy + 114} L ${fx - 44} ${fy + 114} Q ${fx - 52} ${fy + 114} ${fx - 52} ${fy + 108} Z" fill="${SL}"/>`;
  // flame
  b += `<path d="M ${fx} ${fy + 175} C ${fx - 25} ${fy + 160}, ${fx - 15} ${fy + 140}, ${fx} ${fy + 125} C ${fx + 5} ${fy + 140}, ${fx + 25} ${fy + 150}, ${fx} ${fy + 175} Z" fill="${COL.amber}"/>`;
  b += lines(230, 110, ["吡啶 + TaS_{2} 直接反应", "约 200 °C，加热好几天"], { size: 20, lh: 34 });
  b += text(230, 190, "像“硬塞”：只能靠温度和时间", { size: 19, fill: COL.text2 });
  b += circ(720, 135, 42, "#FFFFFF", { stroke: COL.text2, sw: 4 }) + line(720, 135, 720, 105, COL.text2, 4) + line(720, 135, 742, 148, COL.text2, 4);
  b += text(720, 205, "数天", { size: 20, anchor: "middle", weight: "bold", fill: COL.text2 });
  // row 2: electrochemical
  b += rect(20, 255, 780, 265, "#E8F4F3", { rx: 16 });
  b += text(40, 293, "电化学法（Whittingham 1974）", { size: 22, weight: "bold", fill: COL.teal });
  // beaker with electrode
  const bx = 60, by = 335;
  b += rect(bx, by, 130, 130, BRINE, { rx: 8, stroke: COL.ink, sw: 3 });
  b += rect(bx + 30, by - 20, 22, 140, COL.siDark, { rx: 3 });
  b += rect(bx + 82, by - 20, 12, 140, COL.alu, { rx: 3 });
  b += text(bx + 41, by + 158, "TaS_{2}", { size: 18, anchor: "middle", weight: "bold" });
  b += lines(230, 345, ["在 TaS_{2} 电极上电解", "吡啶盐酸盐溶液", "室温，几分钟就嵌进去"], { size: 20, lh: 34 });
  b += text(230, 460, "像“推”：外电路送电子，客体跟着进来", { size: 19, fill: COL.teal, weight: "bold" });
  b += text(230, 494, "电压 = 推力，电流 = 速度", { size: 19, fill: COL.text2 });
  b += circ(720, 390, 42, "#FFFFFF", { stroke: COL.teal, sw: 4 }) + line(720, 390, 720, 360, COL.teal, 4) + line(720, 390, 735, 372, COL.teal, 4);
  b += text(720, 460, "几分钟", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- 7. TiS2 crystal structure ----------
figs.tis2_structure = () => {
  const W = 820, H = 480;
  let b = "";
  const x0 = 45, dx = 62, n = 7;
  const ys = [30, 180, 330];
  ys.forEach((y) => (b += slab(x0, y, n, dx, { h: 32, r: 14, rt: 11 })));
  // vdW gaps shading labels and Li
  [[0, 2], [1, 3, 5]].forEach((idx, g) => {
    const y = ys[g] + 64 + 43;
    idx.forEach((i) => (b += ion(x0 + dx / 2 + i * dx, y, { r: 14, fill: LI })));
  });
  // c-axis bracket (Ti layer to Ti layer)
  const cx = 470;
  b += line(cx, ys[0] + 32, cx, ys[1] + 32, COL.amber, 3) + line(cx - 8, ys[0] + 32, cx + 8, ys[0] + 32, COL.amber, 3) + line(cx - 8, ys[1] + 32, cx + 8, ys[1] + 32, COL.amber, 3);
  b += text(cx + 12, (ys[0] + ys[1]) / 2 + 40, "c", { size: 24, weight: "bold", fill: COL.amber, italic: true });
  // labels
  b += text(460, ys[0] + 114, "范德华层间隙", { size: 18, anchor: "end", fill: COL.muted });
  // legend + numbers on right
  const lx = 530;
  b += circ(lx + 14, 45, 14, S) + text(lx + 38, 52, "S 硫", { size: 20 });
  b += circ(lx + 14, 85, 11, TI) + text(lx + 38, 92, "Ti 钛", { size: 20 });
  b += ion(lx + 14, 125, { r: 14, fill: LI }) + text(lx + 38, 132, "Li^{+}（嵌入的锂）", { size: 20, fill: LI });
  b += rect(lx - 10, 160, 290, 165, COL.light, { rx: 14 });
  b += text(lx + 5, 193, "层间距 c（补充数据）", { size: 19, weight: "bold" });
  b += text(lx + 5, 228, "TiS_{2}：　5.70 Å", { size: 20 });
  b += text(lx + 5, 262, "LiTiS_{2}：6.19 Å", { size: 20, fill: LI });
  b += text(lx + 5, 303, "+0.5 Å，约 9%", { size: 21, weight: "bold", fill: COL.amber });
  b += rect(lx - 10, 340, 290, 130, "#E8F4F3", { rx: 14 });
  b += text(lx + 5, 373, "电子去哪了？", { size: 19, weight: "bold", fill: COL.teal });
  b += text(lx + 5, 410, "Ti^{4+} + e^{−} → Ti^{3+}", { size: 21 });
  b += text(lx + 5, 448, "锂给出电子，钛接住", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 8. Single phase vs two phase ----------
figs.single_phase = () => {
  const W = 820, H = 540;
  let b = "";
  const panel = (x, title, c, tint, plateau) => {
    let p = rect(x, 15, 390, 510, tint, { rx: 16 });
    p += text(x + 195, 52, title, { size: 22, anchor: "middle", weight: "bold", fill: c });
    // mini plot
    const px = x + 60, py = 80, pw = 300, ph = 170;
    p += line(px, py, px, py + ph, COL.ink, 2.5) + line(px, py + ph, px + pw, py + ph, COL.ink, 2.5);
    p += text(px - 10, py + 20, "V", { size: 20, anchor: "end", weight: "bold" });
    p += text(px + pw, py + ph + 28, "x", { size: 20, anchor: "end", weight: "bold", italic: true });
    if (plateau) p += smooth([[px + 5, py + 20], [px + 25, py + 75], [px + 70, py + 85], [px + 230, py + 88], [px + 270, py + 100], [px + 290, py + 160]], c, 4);
    else p += smooth([[px + 5, py + 20], [px + 30, py + 45], [px + 150, py + 85], [px + 250, py + 115], [px + 290, py + 160]], c, 4);
    // crystal sketch: 3 rows of sites
    const cy = 320, sx = x + 45;
    for (let r = 0; r < 3; r++) {
      p += rect(sx, cy + r * 50, 300, 12, COL.si, { rx: 4 });
      for (let k = 0; k < 8; k++) {
        const filled = plateau ? k < 4 : (k * 3 + r * 5) % 7 < 3;
        const xx = sx + 20 + k * 37, yy = cy + r * 50 + 30;
        p += filled ? circ(xx, yy, 10, LI) : circ(xx, yy, 9, "none", { stroke: COL.muted, sw: 2 });
      }
    }
    p += rect(sx, cy + 150, 300, 12, COL.si, { rx: 4 });
    if (plateau) p += line(sx + 160, cy - 10, sx + 160, cy + 170, COL.red, 3, "8 6");
    return p;
  };
  b += panel(15, "单相（Li_{x}TiS_{2}）", COL.teal, "#E8F4F3", false);
  b += panel(415, "两相（如 LiFePO_{4}，第 6 章）", COL.amber, "#FDF2E7", true);
  b += text(210, 512, "锂均匀分散，电压一路下滑", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(610, 512, "满、空两相共存，电压平台", { size: 19, anchor: "middle", fill: COL.amber, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 9. Redrawn Fig. 1 ----------
figs.fig1_redraw = () => {
  const W = 820, H = 500;
  let b = "";
  const x0 = 100, x1 = 790, y0 = 25, y1 = 410, vmin = 1.0, vmax = 3.0;
  const X = (x) => x0 + x * (x1 - x0);
  const Y = (v) => y1 - ((v - vmin) / (vmax - vmin)) * (y1 - y0);
  b += rect(x0, y0, x1 - x0, y1 - y0, "none", { stroke: COL.ink, sw: 2 });
  [1.0, 1.5, 2.0, 2.5, 3.0].forEach((v) => {
    if (v > 1 && v < 3) b += line(x0, Y(v), x1, Y(v), COL.light, 1.5);
    b += line(x0 - 8, Y(v), x0, Y(v), COL.ink, 2) + text(x0 - 14, Y(v) + 7, v.toFixed(1), { size: 19, anchor: "end", fill: COL.text2 });
  });
  [0, 0.2, 0.4, 0.6, 0.8, 1.0].forEach((x) => (b += line(X(x), y1, X(x), y1 + 8, COL.ink, 2) + text(X(x), y1 + 33, x.toFixed(1), { size: 19, anchor: "middle", fill: COL.text2 })));
  b += text((x0 + x1) / 2, 490, "x（Li_{x}TiS_{2} 中每个 TiS_{2} 嵌入的锂）", { size: 19, anchor: "middle" });
  b += rot(30, (y0 + y1) / 2, text(30, (y0 + y1) / 2, "电压 (V)", { size: 20, anchor: "middle" }));
  const P = (arr) => arr.map(([x, v]) => [X(x), Y(v)]);
  // curve c (after 1100 cycles)
  b += smooth(P([[0, 2.57], [0.05, 2.4], [0.1, 2.28], [0.2, 2.05], [0.3, 1.9], [0.4, 1.8], [0.5, 1.72], [0.6, 1.64], [0.7, 1.5], [0.75, 1.38], [0.8, 1.17]]), COL.red, 4);
  // curve b (10 mA then 4 mA; small step at x≈0.34)
  b += smooth(P([[0, 2.57], [0.03, 2.5], [0.06, 2.42], [0.1, 2.36], [0.2, 2.26], [0.33, 2.13]]), COL.teal, 4);
  b += smooth(P([[0.34, 2.17], [0.45, 2.06], [0.6, 1.97], [0.7, 1.9], [0.8, 1.79], [0.88, 1.62], [0.92, 1.46], [0.955, 1.2]]), COL.teal, 4);
  b += line(X(0.33), Y(2.13), X(0.34), Y(2.17), COL.teal, 4);
  // curve a (open circuit) dashed with points
  b += smooth(P([[0, 2.57], [0.25, 2.4], [0.5, 2.24], [0.75, 2.06], [1.0, 1.88]]), LI, 3.5, "14 8");
  [[0.1, 2.5, 1], [0.24, 2.4, 1], [0.36, 2.32, 0], [0.6, 2.17, 1], [0.72, 2.08, 1], [0.76, 2.06, 0], [0.91, 1.95, 1], [1.0, 1.88, 0]].forEach(([x, v, f]) => {
    b += f ? circ(X(x), Y(v), 8, LI) : circ(X(x), Y(v), 7, "#FFFFFF", { stroke: LI, sw: 3 });
  });
  // labels
  b += text(X(0.42), Y(2.52), "(a) 开路电压：放电 ●、充电 ○", { size: 19, weight: "bold", fill: LI });
  b += text(X(0.04), Y(1.6), "(b) 放电：先 10 mA，后 4 mA", { size: 19, weight: "bold", fill: COL.teal });
  b += text(X(0.04), Y(1.35), "(c) 浅循环 1100 次后再放电", { size: 19, weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- 10. Powder cell + redrawn Fig. 2 ----------
figs.powder_cell = () => {
  const W = 1240, H = 380;
  let b = "";
  // left: cell schematic
  b += rect(10, 5, 600, 370, COL.light, { rx: 16 });
  b += text(310, 38, "粉末电极电池（据原文 p. 1126 文字描述）", { size: 20, anchor: "middle", weight: "bold" });
  b += rect(40, 82, 540, 190, BRINE, { rx: 12, stroke: COL.tealLight, sw: 2 });
  b += text(560, 104, "电解液", { size: 17, anchor: "end", fill: COL.teal });
  b += rect(110, 95, 40, 160, LI, { rx: 4 });
  b += rect(220, 90, 16, 170, "#FFFFFF", { stroke: COL.muted, sw: 2, dash: "6 4" });
  b += rect(310, 95, 70, 160, COL.siDark, { rx: 4 });
  for (let y = 105; y < 255; y += 16) b += line(310, y, 380, y, COL.si, 2);
  const R = rng(7);
  for (let k = 0; k < 24; k++) b += circ(318 + R() * 54, 103 + R() * 144, 5, S);
  b += line(130, 95, 130, 58, COL.ink, 3) + line(345, 95, 345, 58, COL.ink, 3) + line(130, 58, 200, 58, COL.ink, 3) + line(275, 58, 345, 58, COL.ink, 3);
  b += text(237, 65, "负载", { size: 17, anchor: "middle" });
  b += text(130, 300, "锂片", { size: 19, anchor: "middle", weight: "bold", fill: LI });
  b += text(130, 326, "负极", { size: 17, anchor: "middle", fill: COL.text2 });
  b += text(228, 300, "PP 隔膜", { size: 19, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += text(228, 326, "聚丙烯", { size: 17, anchor: "middle", fill: COL.text2 });
  b += text(345, 300, "TiS_{2} + Teflon", { size: 19, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += text(345, 326, "9 : 1，压在不锈钢网上", { size: 17, anchor: "middle", fill: COL.text2 });
  b += lines(420, 130, ["2 cm^{2}", "LiClO_{4}", "DME/THF", "(30 : 70)"], { size: 18, lh: 30, fill: COL.teal });
  b += text(310, 360, "单晶电池用的是 LiPF_{6} + PC（第 1 章的 PC！）", { size: 18, anchor: "middle", fill: COL.text2 });
  // right: Fig. 2 redraw
  const x0 = 720, x1 = 1210, y0 = 55, y1 = 295, vmin = 1.4, vmax = 2.6;
  const X = (x) => x0 + x * (x1 - x0);
  const Y = (v) => y1 - ((v - vmin) / (vmax - vmin)) * (y1 - y0);
  b += text(965, 38, "原文 Fig. 2：放电曲线", { size: 20, anchor: "middle", weight: "bold" });
  b += rect(x0, y0, x1 - x0, y1 - y0, "none", { stroke: COL.ink, sw: 2 });
  [1.5, 2.0, 2.5].forEach((v) => (b += line(x0, Y(v), x1, Y(v), COL.light, 1.5) + text(x0 - 10, Y(v) + 6, v.toFixed(1), { size: 17, anchor: "end", fill: COL.text2 })));
  [0, 0.2, 0.4, 0.6, 0.8, 1.0].forEach((x) => (b += line(X(x), y1, X(x), y1 + 6, COL.ink, 2) + text(X(x), y1 + 27, x.toFixed(1), { size: 17, anchor: "middle", fill: COL.text2 })));
  b += text(965, 360, "x in Li_{x}TiS_{2}；纵轴：电压 (V)", { size: 17, anchor: "middle" });
  const P = (arr) => arr.map(([x, v]) => [X(x), Y(v)]);
  b += smooth(P([[0, 2.5], [0.05, 2.4], [0.1, 2.34], [0.2, 2.26], [0.4, 2.14], [0.6, 2.03], [0.75, 1.94], [0.85, 1.82], [0.9, 1.7], [0.95, 1.48]]), COL.teal, 4);
  b += smooth(P([[0, 2.42], [0.05, 2.34], [0.1, 2.28], [0.2, 2.21], [0.4, 2.1], [0.6, 1.99], [0.75, 1.9], [0.83, 1.78], [0.87, 1.66], [0.905, 1.48]]), COL.amber, 4);
  b += text(X(0.3), Y(2.33), "10 mA", { size: 18, weight: "bold", fill: COL.teal });
  b += text(X(0.32), Y(1.95), "20 mA", { size: 18, weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- 11. Lithium primary cells ----------
figs.primary_cells = () => {
  const W = 1240, H = 320;
  let b = "";
  const cards = [
    ["1972", "Li/I_{2}", "约 2.8 V", ["固体 LiI 电解质", "心脏起搏器"], COL.siDark],
    ["1973 前后", "Li/(CF)_{x}", "约 3 V", ["Matsushita（松下）", "有机电解液"], COL.amber],
    ["1973 前后", "Li/SOCl_{2}", "约 3.6 V", ["SOCl_{2} 是溶剂", "也是正极"], COL.red],
    ["1975 前后", "Li/MnO_{2}", "约 3 V", ["Sanyo（三洋）", "PC 类有机电解液"], COL.teal],
  ];
  const cw = 290, gap = 13;
  cards.forEach(([yr, chem, v, info, c], i) => {
    const x = 10 + i * (cw + gap);
    b += rect(x, 10, cw, 300, COL.light, { rx: 16 });
    b += rect(x, 10, cw, 50, c, { rx: 16 }) + rect(x, 40, cw, 20, c);
    b += text(x + cw / 2, 44, yr, { size: 21, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    // coin cell icon
    b += `<ellipse cx="${x + 70}" cy="${125}" rx="40" ry="14" fill="${COL.alu}"/>`;
    b += rect(x + 30, 105, 80, 20, COL.alu) + `<ellipse cx="${x + 70}" cy="${105}" rx="40" ry="14" fill="#D5DCE2" stroke="${COL.si}" stroke-width="2"/>`;
    b += text(x + 70, 111, "Li", { size: 17, anchor: "middle", weight: "bold", fill: LI });
    b += text(x + 130, 120, v, { size: 22, weight: "bold", fill: c });
    b += text(x + cw / 2, 190, chem, { size: 30, anchor: "middle", weight: "bold" });
    b += lines(x + cw / 2, 240, info, { size: 19, anchor: "middle", fill: COL.text2, lh: 32 });
  });
  return svg(W, H, b);
};

// ---------- 12. Dendrites ----------
function tree(x, y, len, ang, depth, R, c) {
  if (depth === 0 || len < 6) return "";
  const x2 = x + len * Math.cos(ang), y2 = y + len * Math.sin(ang);
  let b = line(x.toFixed(1), y.toFixed(1), x2.toFixed(1), y2.toFixed(1), c, Math.max(2, depth * 1.3));
  b += tree(x2, y2, len * 0.62, ang - 0.35 - R() * 0.2, depth - 1, R, c);
  if (R() > 0.25) b += tree(x2, y2, len * 0.55, ang + 0.35 + R() * 0.2, depth - 1, R, c);
  return b;
}
figs.dendrite = () => {
  const W = 820, H = 540;
  let b = "";
  const panel = (x, title, c, tint) => rect(x, 15, 390, 345, tint, { rx: 16 }) + text(x + 195, 52, title, { size: 21, anchor: "middle", weight: "bold", fill: c });
  b += panel(15, "理想：锂平整地镀回去", COL.teal, "#E8F4F3");
  b += panel(415, "实际：长出枝晶", COL.red, "#FBEDEC");
  // left: substrate + flat Li layer + separator + cathode
  const cell = (x) => {
    let p = rect(x + 25, 80, 60, 260, COL.alu, { rx: 4 });                // Cu/Li substrate
    p += rect(x + 260, 80, 16, 260, "#FFFFFF", { stroke: COL.muted, sw: 2, dash: "6 4" }); // separator
    p += rect(x + 300, 80, 65, 260, COL.siDark, { rx: 4 });               // cathode
    p += text(x + 332, 330, "正极", { size: 18, anchor: "middle", fill: "#FFFFFF" });
    return p;
  };
  b += cell(15) + rect(100, 80, 40, 260, LI, { rx: 3 });
  b += text(120, 385, "均匀的一层", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += check(200, 210, 16, COL.teal, 5);
  // right: dendrites
  b += cell(415) + rect(500, 80, 12, 260, LI, { rx: 3 });
  const R = L.rng(11);
  [[512, 115, 45, 3], [512, 160, 60, 3], [512, 255, 50, 3], [512, 305, 55, 3]].forEach(([x, y, len, dep]) => (b += tree(x, y, len, (R() - 0.5) * 0.3, dep, R, LI)));
  // a long one piercing the separator
  b += line(512, 205, 600, 205, LI, 6) + line(600, 205, 700, 198, LI, 5) + tree(700, 198, 22, -0.1, 3, R, LI);
  // spark at contact
  b += `<polygon points="712,170 702,192 716,190 706,214 730,184 716,186 724,170" fill="${COL.amber}"/>`;
  b += text(620, 385, "刺穿隔膜 → 内短路", { size: 19, anchor: "middle", fill: COL.red, weight: "bold" });
  // bottom explanation
  b += rect(15, 405, 790, 125, COL.light, { rx: 16 });
  b += lines(35, 443, ["① 表面一点凸起 → 电流集中到尖端 → 越长越尖", "② 新露出的锂和电解液反应，锂被消耗（效率 < 100%）", "③ 枝晶断开变成“死锂”，或刺穿隔膜引发短路、发热"], { size: 19, lh: 36 });
  return svg(W, H, b);
};

// ---------- 13. From TiS2 to Li-ion ----------
figs.next_steps = () => {
  const W = 820, H = 540;
  let b = "";
  b += rect(200, 15, 420, 70, COL.ink, { rx: 14 });
  b += text(410, 60, "Li 金属 | TiS_{2}（1976）", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += arrow(330, 88, 210, 135, { color: COL.red, width: 3 }) + arrow(490, 88, 610, 135, { color: COL.red, width: 3 });
  // problems
  b += rect(20, 140, 375, 120, "#FBEDEC", { rx: 14 });
  b += text(40, 178, "问题 1：负极", { size: 21, weight: "bold", fill: COL.red });
  b += lines(40, 213, ["锂金属反复镀、溶 → 枝晶", "短路、起火风险"], { size: 19, lh: 30 });
  b += rect(425, 140, 375, 120, "#FBEDEC", { rx: 14 });
  b += text(445, 178, "问题 2：正极", { size: 21, weight: "bold", fill: COL.red });
  b += lines(445, 213, ["硫化物只有约 2 V", "TiS_{2} 本身不含锂"], { size: 19, lh: 30 });
  b += arrow(207, 265, 207, 300, { color: COL.teal, width: 3 }) + arrow(612, 265, 612, 300, { color: COL.teal, width: 3 });
  // solutions
  b += rect(20, 305, 375, 120, "#E8F4F3", { rx: 14 });
  b += text(40, 343, "负极也用嵌入材料", { size: 21, weight: "bold", fill: COL.teal });
  b += lines(40, 378, ["“摇椅”电池、碳负极", "（第 4、5 章）"], { size: 19, lh: 30 });
  b += rect(425, 305, 375, 120, "#E8F4F3", { rx: 14 });
  b += text(445, 343, "改用含锂的氧化物", { size: 21, weight: "bold", fill: COL.teal });
  b += lines(445, 378, ["LiCoO_{2}：约 4 V，自带锂", "（第 4 章）"], { size: 19, lh: 30 });
  b += arrow(207, 430, 330, 465, { color: LI, width: 3 }) + arrow(612, 430, 490, 465, { color: LI, width: 3 });
  b += pill(160, 468, 500, 54, LI, "两边都是“房子”= 锂离子电池", { size: 22 });
  return svg(W, H, b);
};

module.exports = figs;
