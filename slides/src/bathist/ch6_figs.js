// Figures for 锂电池发展史 Chapter 6: 1997–今：LFP、三元与固态电池
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, electron, blob } = L;

const figs = {};
const LI = COL.purple;
const LIL = "#E4DAF3";
const FE = COL.amber;
const FEL = "#F9DDBF";
const P = COL.teal;
const PL = COL.tealLight;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}" stroke-linejoin="round"` : ""}/>`;

// Pointy-top hexagon = an octahedron seen along one axis (as in Padhi Fig. 1).
function hexPts(cx, cy, r) {
  return [-90, -30, 30, 90, 150, 210].map((a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]);
}
function octa(cx, cy, r, fill, stroke, label, o = {}) {
  const pts = hexPts(cx, cy, r);
  let b = poly(pts, fill, { stroke, sw: o.sw || 2 });
  // inner triangle (front face of the octahedron)
  const tri = [pts[0], pts[2], pts[4]];
  b += poly(tri, "none", { stroke, sw: 1.2 });
  if (label) b += text(cx, cy + (o.size || 18) * 0.36, label, { size: o.size || 18, anchor: "middle", weight: "bold", fill: o.ink || stroke });
  return b;
}
function tetra(cx, cy, r, fill, stroke, label, o = {}) {
  const pts = [[cx, cy - r], [cx + r * 0.87, cy + r * 0.5], [cx - r * 0.87, cy + r * 0.5]];
  let b = poly(pts, fill, { stroke, sw: 2 });
  if (label) b += text(cx, cy + r * 0.32, label, { size: o.size || 17, anchor: "middle", weight: "bold", fill: o.ink || "#FFFFFF" });
  return b;
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  const r = 34, hw = r * Math.sqrt(3);
  const x0 = 60, y0 = 70;
  // three rows: Li chain / Fe + P / Li chain
  for (let row = 0; row < 3; row++) {
    const y = y0 + row * r * 1.5;
    const off = row % 2 ? hw / 2 : 0;
    for (let i = 0; i < 4; i++) {
      const x = x0 + off + i * hw;
      if (row % 2 === 0) b += octa(x, y, r, "#3B2E5A", "#C9B8E8", "Li", { size: 17, ink: "#E4DAF3" });
      else if (i % 2 === 0) b += octa(x, y, r, "#5A3E22", "#F6C58E", "Fe", { size: 17, ink: "#F9DDBF" });
      else b += tetra(x, y + 4, 26, COL.teal, "#9FD3CF", "P", { size: 16 });
    }
  }
  b += text(215, 300, "LiFePO_{4}", { size: 44, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(215, 336, "橄榄石结构 · 1997", { size: 21, anchor: "middle", fill: "#CADCE8" });
  b += pill(30, 380, 370, 44, COL.purple, "1997 · 磷酸铁锂正极", { size: 19 });
  b += pill(30, 436, 370, 44, COL.amber, "2010 年代 · 三元与电动车", { size: 19 });
  b += pill(30, 492, 370, 44, COL.teal, "2020 年代 · 固态与回收", { size: 19 });
  return svg(W, H, b);
};

// ---------- 1. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 440;
  const Pu = COL.purple, A = COL.amber, T = COL.teal;
  const ev = [
    { year: "1987–89", who: ["Manthiram &", "Goodenough"], what: ["NASICON 型", "硫酸铁框架"], color: Pu },
    { year: "1992", who: ["Bates 等"], what: ["LiPON 薄膜", "固体电解质"], color: T },
    { year: "1997", who: ["Padhi &", "Goodenough"], what: ["LiFePO_{4}", "橄榄石正极"], color: Pu },
    { year: "1999–01", who: ["Ravet, Armand"], what: ["碳包覆 LFP"], color: Pu },
    { year: "2001", who: ["Ohzuku;", "Lu & Dahn"], what: ["NMC 三元正极"], color: Pu },
    { year: "2008–10", who: ["Roadster / Leaf"], what: ["锂电池", "进入汽车"], color: A },
    { year: "2011", who: ["Kamaya 等"], what: ["硫化物 LGPS", "赶上液体"], color: T },
    { year: "2019", who: ["诺贝尔化学奖"], what: ["Goodenough、", "Whittingham、吉野"], color: A },
    { year: "2020", who: ["BYD / CATL"], what: ["刀片电池、CTP", "LFP 回归"], color: A },
  ];
  let b = timeline(W, H, ev, { axisY: 210, left: 85, right: 1125, whoSize: 18, whatSize: 17, yearSize: 22 });
  b += pill(700, 402, 160, 30, Pu, "正极材料", { size: 17 }) + pill(875, 402, 160, 30, A, "电动车", { size: 17 }) + pill(1050, 402, 170, 30, T, "固态电解质", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Inductive effect ----------
figs.inductive = () => {
  const W = 820, H = 540;
  let b = "";
  // left: tug of war on oxygen's electrons
  b += rect(10, 10, 390, 520, COL.light, { rx: 16 });
  b += text(205, 50, "谁在“抢”氧的电子？", { size: 22, anchor: "middle", weight: "bold" });
  const y = 150;
  b += line(70, y, 200, y, FE, 4, "8 8");
  b += line(200, y - 6, 330, y - 6, P, 6) + line(200, y + 6, 330, y + 6, P, 6);
  b += circ(70, y, 38, FE) + text(70, y + 9, "Fe", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += circ(200, y, 30, COL.red) + text(200, y + 9, "O", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += circ(330, y, 34, P) + text(330, y + 9, "P", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += arrow(215, 96, 312, 96, { color: P, width: 3.5 });
  b += text(265, 84, "电子被拉向 P", { size: 18, anchor: "middle", fill: P, weight: "bold" });
  b += text(135, 214, "Fe–O 变弱", { size: 18, anchor: "middle", fill: FE, weight: "bold" });
  b += text(268, 214, "P–O 很强", { size: 18, anchor: "middle", fill: P, weight: "bold" });
  const steps = ["① P–O 共价键很强", "② O 分给 Fe 的电子变少", "③ Fe^{3+}/Fe^{2+} 能级下降", "④ 相对锂的电压升高"];
  b += lines(36, 272, steps, { size: 20, lh: 38 });
  b += rect(30, 430, 350, 84, "#FFFFFF", { rx: 12 });
  b += lines(46, 464, ["拔河：另一头（P 或 S）越有力，", "Fe 这头就越“松”，电压越高"], { size: 18, lh: 30, fill: COL.text2 });
  // right: voltage ladder
  const top = 110, bot = 440, vmax = 3.8, vmin = 2.5;
  const Y = (v) => top + ((vmax - v) / (vmax - vmin)) * (bot - top);
  const ax = 530;
  b += text(615, 50, "Fe^{3+}/Fe^{2+} 相对 Li 的电压", { size: 20, anchor: "middle", weight: "bold" });
  b += text(615, 80, "（原文 p. 1189–1190 的数值）", { size: 18, anchor: "middle", fill: COL.muted });
  b += line(ax, top - 10, ax, bot + 10, COL.ink, 3);
  b += arrow(ax, bot + 10, ax, top - 18, { color: COL.ink, width: 3 });
  const items = [
    [3.6, "3.6 V  LiFe_{2}(SO_{4})_{3}", COL.teal, -6],
    [3.5, "3.5 V  LiFePO_{4} 橄榄石", COL.purple, 16],
    [2.8, "2.8 V  Li_{3}Fe_{2}(PO_{4})_{3}", COL.text2, 6],
  ];
  items.forEach(([v, lab, c, dy]) => {
    b += circ(ax, Y(v), 9, c);
    b += line(ax, Y(v), ax + 22, Y(v) + dy, c, 2);
    b += text(ax + 28, Y(v) + dy + 7, lab, { size: 19, fill: c, weight: "bold" });
  });
  b += text(ax + 28, Y(2.8) + 36, "NASICON 型框架", { size: 18, fill: COL.muted });
  // arrows: +0.7 structure, +0.8 anion
  b += arrow(470, Y(2.8), 470, Y(3.5) + 4, { color: COL.purple, width: 4 });
  b += arrow(500, Y(2.8), 500, Y(3.6) + 4, { color: COL.teal, width: 4 });
  b += text(470, Y(2.8) + 30, "+0.7", { size: 18, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(505, Y(2.8) + 56, "+0.8", { size: 18, anchor: "middle", fill: COL.teal, weight: "bold" });
  // oxide region
  b += text(ax + 28, bot + 2, "含铁氧化物：太低或不稳", { size: 18, fill: COL.red });
  b += rect(425, 478, 385, 52, "#FFFFFF", { rx: 10, stroke: COL.line, sw: 1.5 });
  b += text(440, 500, "+0.8：PO_{4} 换成 SO_{4}（诱导效应）", { size: 17, fill: COL.teal });
  b += text(440, 522, "+0.7：NASICON 换成橄榄石（结构）", { size: 17, fill: COL.purple });
  return svg(W, H, b);
};

// ---------- 3. Olivine structure (after Padhi Fig. 1a / Fig. 6) ----------
figs.olivine = () => {
  const W = 820, H = 540;
  let b = "";
  const r = 40, hw = r * Math.sqrt(3);
  const x0 = 70, y0 = 70;
  b += rect(x0 - hw / 2 - 8, y0 + 3 * r - r - 4, 6 * hw + 16, 2 * r + 8, "#C9B8E8", { rx: 10, opacity: 0.55 });
  for (let row = 0; row < 5; row++) {
    const y = y0 + row * r * 1.5;
    const off = row % 2 ? hw / 2 : 0;
    for (let i = 0; i < 6; i++) {
      const x = x0 + off + i * hw;
      if (row % 2 === 0) b += octa(x, y, r, LIL, LI, "Li", { size: 18 });
      else if ((i + (row === 3 ? 1 : 0)) % 2 === 0) b += octa(x, y, r, FEL, FE, "Fe", { size: 18, ink: "#9A5A17" });
      else b += tetra(x, y + 6, 30, P, "#146B66", "P", { size: 17 });
    }
  }
  // Li chain arrow below the lattice (chains run left-right, like the highlighted middle row)
  const yb = y0 + 4 * r * 1.5 + r + 26;
  b += arrow(x0 - 30, yb, x0 + 5 * hw + 40, yb, { color: LI, width: 4, head: 14 });
  b += text(x0 + 2.6 * hw, yb + 32, "Li^{+} 沿锂链（左右方向）移动：一维“隧道”", { size: 19, anchor: "middle", fill: LI, weight: "bold" });
  // axes as in the paper
  b += arrow(40, 520, 40, 470, { color: COL.ink, width: 2.5 }) + text(52, 478, "b", { size: 19, weight: "bold" });
  b += arrow(40, 520, 92, 520, { color: COL.ink, width: 2.5 }) + text(98, 526, "c", { size: 19, weight: "bold" });
  b += text(200, 526, "（原文坐标轴取法）", { size: 17, anchor: "middle", fill: COL.muted });
  // legend
  const lx = 600;
  b += octa(lx + 20, 110, 24, LIL, LI, "");
  b += lines(lx + 54, 104, ["LiO_{6} 八面体", "M1 位，连成链"], { size: 18, lh: 26 });
  b += octa(lx + 20, 200, 24, FEL, FE, "");
  b += lines(lx + 54, 194, ["FeO_{6} 八面体", "M2 位，共用顶点"], { size: 18, lh: 26 });
  b += tetra(lx + 20, 294, 22, P, "#146B66", "");
  b += lines(lx + 54, 286, ["PO_{4} 四面体", "把框架“钉牢”"], { size: 18, lh: 26 });
  b += rect(lx - 10, 350, 215, 120, COL.light, { rx: 12 });
  b += lines(lx + 4, 382, ["脱锂后", "体积只缩小约 6.5%", "（据 Table I 计算）"], { size: 18, lh: 30 });
  return svg(W, H, b);
};

// ---------- 4. Two-phase interface (after Padhi Fig. 7) ----------
figs.interface = () => {
  const W = 820, H = 540;
  let b = "";
  const panel = (cx, title, sub, coreR, stopped) => {
    let p = "";
    p += text(cx, 44, title, { size: 21, anchor: "middle", weight: "bold", fill: stopped ? COL.red : COL.teal });
    p += text(cx, 76, sub, { size: 18, anchor: "middle", fill: COL.text2 });
    const cy = 255;
    p += blob(cx, cy, 150, 7, { fill: LIL, stroke: LI, sw: 3 });
    p += blob(cx, cy, coreR + 10, 7, { fill: "#7B5BB5" });
    p += blob(cx, cy, coreR, 7, { fill: FEL, stroke: FE, sw: 2 });
    p += text(cx, cy + 8, "FePO_{4}", { size: 20, anchor: "middle", weight: "bold", fill: "#9A5A17" });
    // incoming Li+
    [[-1, -0.2], [1, -0.3], [-0.6, 0.8], [0.7, 0.75], [0, -1]].forEach(([dx, dy]) => {
      const n = Math.hypot(dx, dy);
      const ux = dx / n, uy = dy / n;
      p += arrow(cx + ux * 190, cy + uy * 175, cx + ux * 158, cy + uy * 146, { color: LI, width: 3 });
    });
    return p;
  };
  b += panel(205, "电流小：界面能推进到深处", "大部分 FePO_{4} 变回 LiFePO_{4}", 48, false);
  b += panel(615, "电流大：界面面积太小，跟不上", "中心的 FePO_{4} 暂时用不上", 100, true);
  b += text(205, 370, "LiFePO_{4}", { size: 19, anchor: "middle", fill: LI, weight: "bold" });
  b += text(615, 395, "LiFePO_{4}", { size: 19, anchor: "middle", fill: LI, weight: "bold" });
  // interface label in left panel
  b += line(240, 230, 330, 140, COL.ink, 2) + text(332, 132, "两相界面", { size: 18, weight: "bold" });
  b += rect(40, 450, 740, 74, COL.light, { rx: 14 });
  b += text(410, 482, "放电时 Li^{+} 从表面进入，界面向内收缩；界面越小，每秒能通过的锂越少", { size: 18, anchor: "middle" });
  b += text(410, 512, "把电流调小，中心又能用上 → 容量损失是可逆的", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- 5. Remedies: carbon coating, nanosizing, doping ----------
figs.remedies = () => {
  const W = 820, H = 540;
  let b = "";
  const box = (x, y, title, sub, c) => rect(x, y, 395, 258, "#F5F7F9", { rx: 14 }) + text(x + 18, y + 34, title, { size: 20, weight: "bold", fill: c }) + text(x + 18, y + 62, sub, { size: 17, fill: COL.text2 });
  // 1. original
  b += box(5, 5, "1997 原样：大颗粒", "电子进不去，锂要走很远", COL.red);
  b += blob(200, 160, 72, 3, { fill: LIL, stroke: LI, sw: 3 });
  b += text(200, 168, "LFP", { size: 20, anchor: "middle", weight: "bold", fill: LI });
  b += electron(60, 160, 13) + arrow(78, 160, 118, 160, { color: FE, width: 3 }) + cross(138, 160, 10, COL.red, 4);
  b += line(200, 160, 200, 96, COL.muted, 2, "5 5") + text(250, 245, "路径长", { size: 17, anchor: "middle", fill: COL.muted });
  // 2. carbon coating
  b += box(420, 5, "碳包覆（1999–2001）", "电子沿碳壳“高速路”到达各处", COL.teal);
  b += blob(615, 165, 80, 3, { fill: COL.ink });
  b += blob(615, 165, 70, 3, { fill: LIL, stroke: LI, sw: 2 });
  b += text(615, 173, "LFP", { size: 20, anchor: "middle", weight: "bold", fill: LI });
  b += electron(470, 120, 12) + electron(760, 205, 12);
  b += arrow(486, 112, 548, 98, { color: FE, width: 3 }) + arrow(745, 214, 690, 236, { color: FE, width: 3 });
  b += text(708, 106, "碳层", { size: 17, fill: COL.ink, weight: "bold" });
  // 3. nanosizing
  b += box(5, 277, "纳米化（2000 年代）", "颗粒变小，锂走的路变短", COL.teal);
  const pts = [[80, 410], [140, 380], [200, 420], [260, 385], [320, 415], [110, 470], [175, 480], [240, 470], [305, 478], [360, 445]];
  pts.forEach(([x, y], i) => (b += blob(x, y, 22, 20 + i, { fill: LIL, stroke: LI, sw: 2 })));
  // 4. doping (debated)
  b += box(420, 277, "掺杂（2002，有争议）", "导电变好，原因仍有争论", COL.amber);
  b += blob(615, 440, 72, 5, { fill: LIL, stroke: LI, sw: 3 });
  [[585, 410], [640, 420], [600, 465], [655, 470], [620, 395], [570, 450]].forEach(([x, y]) => (b += circ(x, y, 7, FE)));
  b += text(745, 455, "?", { size: 48, anchor: "middle", weight: "bold", fill: FE });
  return svg(W, H, b);
};

// ---------- 6. Layered oxide family: composition triangle ----------
figs.layered_triangle = () => {
  const W = 820, H = 540;
  let b = "";
  const Ni = [80, 470], Co = [300, 80], Mn = [520, 470];
  const pt = (ni, co, mn) => [ni * Ni[0] + co * Co[0] + mn * Mn[0], ni * Ni[1] + co * Co[1] + mn * Mn[1]];
  b += poly([Ni, Co, Mn], "#F5F7F9", { stroke: COL.line, sw: 3 });
  // vertex labels
  b += circ(Co[0], Co[1], 12, COL.purple) + text(Co[0] + 22, Co[1] - 8, "LiCoO_{2}", { size: 20, weight: "bold", fill: COL.purple });
  b += text(Co[0] + 22, Co[1] + 20, "1980（第 4 章）", { size: 18, fill: COL.text2 });
  b += circ(Ni[0], Ni[1], 12, COL.teal) + text(Ni[0] - 40, Ni[1] + 40, "LiNiO_{2}：不稳定", { size: 19, weight: "bold", fill: COL.teal });
  b += circ(Mn[0], Mn[1], 12, COL.red) + text(Mn[0] - 30, Mn[1] + 40, "Mn 端", { size: 19, weight: "bold", fill: COL.red });
  // NMC111
  const c111 = pt(1 / 3, 1 / 3, 1 / 3);
  b += circ(c111[0], c111[1], 11, COL.ink) + text(c111[0] + 18, c111[1] - 6, "NMC111", { size: 19, weight: "bold" });
  b += text(c111[0] + 18, c111[1] + 20, "2001", { size: 18, fill: COL.text2 });
  // high-Ni path
  const path = [[1 / 3, 1 / 3, 1 / 3], [0.5, 0.2, 0.3], [0.6, 0.2, 0.2], [0.8, 0.1, 0.1]].map((a) => pt(...a));
  for (let i = 0; i < path.length - 1; i++) b += arrow(path[i][0], path[i][1], path[i + 1][0] + 6, path[i + 1][1] - 2, { color: COL.amber, width: 3.5 });
  [["532", 1], ["622", 2], ["811", 3]].forEach(([lab, i]) => {
    b += circ(path[i][0], path[i][1], 8, COL.amber);
    const dy = lab === "622" ? -16 : 30;
    b += text(path[i][0] - 4, path[i][1] + dy, lab, { size: 18, anchor: "middle", fill: COL.amber, weight: "bold" });
  });
  b += text(205, 452, "高镍化 · 2010 年代", { size: 18, weight: "bold", fill: COL.amber });
  // NCA (on Ni–Co edge; Al not shown)
  const nca = pt(0.8, 0.2, 0);
  b += poly([[nca[0], nca[1] - 11], [nca[0] + 11, nca[1]], [nca[0], nca[1] + 11], [nca[0] - 11, nca[1]]], COL.ink);
  b += text(nca[0] - 16, nca[1] - 10, "NCA", { size: 19, anchor: "end", weight: "bold" });
  b += text(nca[0] - 16, nca[1] + 16, "（含少量 Al）", { size: 17, anchor: "end", fill: COL.text2 });
  // Ni0.5Mn0.5
  const nm = pt(0.5, 0, 0.5);
  b += circ(nm[0], nm[1], 8, COL.text2) + text(nm[0] + 40, nm[1] + 32, "LiNi_{0.5}Mn_{0.5}O_{2}", { size: 17, anchor: "middle", fill: COL.text2 });
  // role cards
  const rx = 590;
  const card = (y, c, h1, sub) => rect(rx, y, 222, 118, "#FFFFFF", { rx: 12, stroke: c, sw: 2.5 }) + text(rx + 16, y + 36, h1, { size: 20, weight: "bold", fill: c }) + lines(rx + 16, y + 68, sub, { size: 18, lh: 27, fill: COL.ink });
  b += card(40, COL.teal, "Ni：给容量", ["多放电子，便宜", "但多了不稳定"]);
  b += card(180, COL.purple, "Co：稳结构", ["层状更规整", "但贵、产地集中"]);
  b += card(320, COL.red, "Mn：保稳定", ["Mn^{4+} 不参与反应", "当“骨架”，便宜"]);
  return svg(W, H, b);
};

// ---------- 7. Pack architecture: module vs CTP vs blade ----------
figs.pack_ctp = () => {
  const W = 1240, H = 370;
  let b = "";
  const px = [20, 430, 840], pw = 380;
  const head = (x, t, c, sub) => text(x + pw / 2, 34, t, { size: 21, anchor: "middle", weight: "bold", fill: c }) + text(x + pw / 2, 64, sub, { size: 18, anchor: "middle", fill: COL.text2 });
  // 1 traditional
  b += head(px[0], "传统：电芯 → 模组 → 电池包", COL.text2, "层层外壳和支架");
  b += rect(px[0] + 20, 85, 340, 220, "#F5F7F9", { rx: 12, stroke: COL.siDark, sw: 3 });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
    const mx = px[0] + 40 + c * 108, my = 105 + r * 100;
    b += rect(mx, my, 92, 82, "#E3E8EC", { rx: 6, stroke: COL.si, sw: 2.5 });
    for (let k = 0; k < 4; k++) b += rect(mx + 8 + k * 20, my + 10, 15, 62, COL.tealLight, { rx: 3 });
  }
  b += text(px[0] + pw / 2, 345, "大量空间给了结构件", { size: 18, anchor: "middle", fill: COL.red });
  // 2 CTP
  b += head(px[1], "CTP：省掉模组（CATL 2019）", COL.teal, "电芯直接装进电池包");
  b += rect(px[1] + 20, 85, 340, 220, "#F5F7F9", { rx: 12, stroke: COL.siDark, sw: 3 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 15; c++) b += rect(px[1] + 36 + c * 21.3, 100 + r * 66, 17, 58, COL.tealLight, { rx: 3, stroke: COL.teal, sw: 1 });
  b += text(px[1] + pw / 2, 345, "同样空间放更多电芯", { size: 18, anchor: "middle", fill: COL.teal });
  // 3 Blade
  b += head(px[2], "刀片电池（BYD 2020）", COL.amber, "长条电芯本身当“横梁”");
  b += rect(px[2] + 20, 85, 340, 220, "#F5F7F9", { rx: 12, stroke: COL.siDark, sw: 3 });
  for (let k = 0; k < 13; k++) b += rect(px[2] + 36, 98 + k * 15.5, 308, 11, FEL, { rx: 3, stroke: FE, sw: 1.2 });
  b += text(px[2] + pw / 2, 345, "LFP 单体弱，靠“排得满”补回来", { size: 18, anchor: "middle", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- 8. Nobel 2019 ----------
figs.nobel = () => {
  const W = 1240, H = 330;
  let b = "";
  const cards = [
    { x: 20, name: "M. Stanley Whittingham", yrs: "1941 年生", c: COL.text2, l: ["1976 · TiS_{2} 嵌入正极", "第一个可充锂电池", "第 2 章"] },
    { x: 430, name: "John B. Goodenough", yrs: "1922–2023", c: COL.purple, l: ["1980 · LiCoO_{2}（第 4 章）", "1997 · LiFePO_{4}（本章）", "获奖时 97 岁"] },
    { x: 840, name: "吉野彰 Akira Yoshino", yrs: "1948 年生", c: COL.teal, l: ["1985 · 碳负极 + LiCoO_{2}", "锂离子电池原型", "第 4 章"] },
  ];
  cards.forEach((k) => {
    b += rect(k.x, 10, 380, 310, "#F5F7F9", { rx: 16 });
    b += rect(k.x, 10, 380, 12, k.c, { rx: 6 });
    b += circ(k.x + 56, 92, 36, "#F7E3A1", { stroke: COL.sulfur, sw: 4 });
    b += text(k.x + 56, 101, "2019", { size: 18, anchor: "middle", weight: "bold", fill: "#8A6A00" });
    b += text(k.x + 108, 84, k.name, { size: 21, weight: "bold", fill: k.c });
    b += text(k.x + 108, 114, k.yrs, { size: 18, fill: COL.text2 });
    b += line(k.x + 24, 150, k.x + 356, 150, COL.line, 2);
    b += lines(k.x + 28, 194, k.l, { size: 20, lh: 42 });
  });
  return svg(W, H, b);
};

// ---------- 9. Anodes: Li metal again, silicon ----------
figs.anodes = () => {
  const W = 820, H = 540;
  let b = "";
  // left panel: lithium metal
  b += rect(5, 5, 400, 530, "#F5F7F9", { rx: 14 });
  b += text(205, 40, "锂金属：3860 mAh/g", { size: 21, anchor: "middle", weight: "bold", fill: LI });
  // liquid + dendrite
  b += text(30, 82, "液体电解液：枝晶刺穿隔膜", { size: 18, fill: COL.red, weight: "bold" });
  b += rect(30, 96, 60, 160, LI, { rx: 4 });
  b += rect(90, 96, 290, 160, COL.electrolyte);
  b += rect(260, 96, 12, 160, COL.line);
  const dend = (y, len) => `<polyline points="90,${y} ${90 + len * 0.3},${y - 8} ${90 + len * 0.55},${y + 6} ${90 + len * 0.8},${y - 6} ${90 + len},${y + 2}" fill="none" stroke="${LI}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
  b += dend(130, 120) + dend(175, 185) + dend(222, 90);
  b += cross(282, 175, 12, COL.red, 5);
  // solid electrolyte
  b += text(30, 300, "固体电解质：想用硬墙挡住", { size: 18, fill: COL.teal, weight: "bold" });
  b += rect(30, 314, 60, 140, LI, { rx: 4 });
  b += rect(90, 314, 290, 140, PL);
  for (let k = 0; k < 6; k++) b += line(140 + k * 42, 314, 125 + k * 42, 454, "#FFFFFF", 2);
  b += `<polyline points="90,390 120,384 150,394 182,386" fill="none" stroke="${LI}" stroke-width="5" stroke-linecap="round"/>`;
  b += text(205, 488, "但锂仍可能沿晶界钻进去", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(205, 516, "（界面接触也是难题）", { size: 17, anchor: "middle", fill: COL.muted });
  // right panel: silicon
  b += rect(415, 5, 400, 530, "#F5F7F9", { rx: 14 });
  b += text(615, 40, "硅：3579 mAh/g", { size: 21, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += circ(500, 190, 46, COL.si) + text(500, 198, "Si", { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += arrow(556, 190, 610, 190, { color: LI, width: 4 }) + text(583, 172, "+Li", { size: 18, anchor: "middle", fill: LI, weight: "bold" });
  b += circ(700, 190, 72, "#C5CDD5", { stroke: COL.siDark, sw: 3 });
  b += `<polyline points="660,140 690,175 676,205" fill="none" stroke="${COL.red}" stroke-width="4" stroke-linecap="round"/>`;
  b += `<polyline points="740,230 718,200 735,170" fill="none" stroke="${COL.red}" stroke-width="4" stroke-linecap="round"/>`;
  b += text(700, 290, "体积约 ×3.8 → 开裂、SEI 反复重长", { size: 18, anchor: "middle", fill: COL.red });
  b += rect(440, 325, 350, 190, "#FFFFFF", { rx: 12, stroke: COL.line, sw: 1.5 });
  b += text(615, 360, "比一比（理论比容量）", { size: 19, anchor: "middle", weight: "bold" });
  b += lines(462, 400, ["石墨 LiC_{6}：372 mAh/g", "硅 Li_{15}Si_{4}：3579 mAh/g", "锂金属：3860 mAh/g"], { size: 19, lh: 38 });
  return svg(W, H, b);
};

// ---------- 10. Manufacturing and recycling ----------
figs.manufacturing = () => {
  const W = 820, H = 540;
  let b = "";
  b += text(20, 34, "极片怎么做", { size: 21, weight: "bold" });
  const stepBox = (x, y, w, t, c, fill) => rect(x, y, w, 50, fill, { rx: 10, stroke: c, sw: 2 }) + text(x + w / 2, y + 32, t, { size: 18, anchor: "middle", fill: COL.ink });
  // wet
  b += text(20, 82, "湿法", { size: 19, weight: "bold", fill: COL.red });
  b += stepBox(80, 56, 170, "粉末 + NMP 溶剂", COL.red, "#FBEDEC");
  b += arrow(254, 81, 280, 81, { color: COL.ink, width: 2.5 });
  b += stepBox(284, 56, 110, "涂布", COL.red, "#FBEDEC");
  b += arrow(398, 81, 424, 81, { color: COL.ink, width: 2.5 });
  b += stepBox(428, 56, 220, "长烘箱 + 回收溶剂", COL.red, "#FBEDEC");
  b += arrow(652, 81, 678, 81, { color: COL.ink, width: 2.5 });
  b += stepBox(682, 56, 120, "极片", COL.ink, "#FFFFFF");
  // dry
  b += text(20, 152, "干法", { size: 19, weight: "bold", fill: COL.teal });
  b += stepBox(80, 126, 170, "粉末 + PTFE", COL.teal, "#E8F4F3");
  b += arrow(254, 151, 280, 151, { color: COL.ink, width: 2.5 });
  b += stepBox(284, 126, 210, "剪切：PTFE 拉成丝", COL.teal, "#E8F4F3");
  b += arrow(498, 151, 524, 151, { color: COL.ink, width: 2.5 });
  b += stepBox(528, 126, 124, "辊压成膜", COL.teal, "#E8F4F3");
  b += arrow(652, 151, 678, 151, { color: COL.ink, width: 2.5 });
  b += stepBox(682, 126, 120, "极片", COL.ink, "#FFFFFF");
  b += line(20, 205, 800, 205, COL.line, 2, "6 6");
  // recycling loop
  b += text(20, 245, "用完怎么办：回收闭环", { size: 21, weight: "bold" });
  const cx = 410, cy = 390, R = 112;
  const nodes = [
    [-90, "旧电池", COL.text2],
    [-18, "拆解破碎", COL.text2],
    [54, "“黑粉”", COL.ink],
    [126, "提取 Li、Ni、Co", COL.amber],
    [198, "新正极材料", COL.teal],
  ];
  const pos = nodes.map(([a]) => [cx + R * 1.55 * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)]);
  for (let i = 0; i < nodes.length; i++) {
    const [x1, y1] = pos[i], [x2, y2] = pos[(i + 1) % nodes.length];
    const f = 0.3;
    b += arrow(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, x1 + (x2 - x1) * (1 - f), y1 + (y2 - y1) * (1 - f), { color: COL.muted, width: 3 });
  }
  nodes.forEach(([, t, c], i) => {
    const [x, y] = pos[i];
    const w = t.length * 19 + 30;
    b += rect(x - w / 2, y - 22, w, 44, "#FFFFFF", { rx: 22, stroke: c, sw: 2.5 });
    b += text(x, y + 7, t, { size: 18, anchor: "middle", fill: c, weight: "bold" });
  });
  b += lines(cx, cy - 6, ["火法：熔炼", "湿法：酸浸"], { size: 18, anchor: "middle", fill: COL.text2, lh: 28 });
  b += text(cx, cy + 50, "直接再生", { size: 18, anchor: "middle", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- 11. Series recap ----------
figs.series_recap = () => {
  const W = 1240, H = 400;
  const C1 = COL.amber, C2 = COL.text2, C3 = COL.teal, C4 = COL.purple, C5 = COL.red, C6 = COL.sulfur;
  const ev = [
    { year: "1800", who: ["Volta"], what: ["电堆", "第 1 章"], color: C1 },
    { year: "1958", who: ["Harris"], what: ["PC 中电解出锂", "第 1 章"], color: C1 },
    { year: "1976", who: ["Whittingham"], what: ["TiS_{2} 嵌入正极", "第 2 章"], color: C2 },
    { year: "1978–79", who: ["Armand; Peled"], what: ["聚合物电解质; SEI", "第 3 章"], color: C3 },
    { year: "1980", who: ["Goodenough"], what: ["LiCoO_{2}", "第 4 章"], color: C4 },
    { year: "1985", who: ["吉野彰"], what: ["碳负极原型", "第 4 章"], color: C4 },
    { year: "1991", who: ["Sony"], what: ["锂离子电池上市", "第 5 章"], color: C5 },
    { year: "1997", who: ["Padhi 等"], what: ["LiFePO_{4}", "第 6 章"], color: C6 },
    { year: "2011", who: ["Kamaya 等"], what: ["LGPS 固态", "第 6 章"], color: C6 },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 200, left: 85, right: 1125, whoSize: 18, whatSize: 17, yearSize: 23 }));
};

module.exports = figs;
