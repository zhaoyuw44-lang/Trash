// Figures for Zhao et al. 2020, Chapter 3 (锂/钠与多价离子固态电解质)
// Canvas widths ≈ 96 px per inch of the slide box, so 15–16 px text ≥ 11 pt.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 0}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const arc = (x1, y1, x2, y2, lift, c, w = 3, dash = "6 5") =>
  `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - lift} ${x2},${y2}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${dash}"/>`;
const anionX = (x, y, r = 11) => circ(x, y, r, COL.teal) + text(x, y + r * 0.45, "−", { size: Math.round(r * 1.5), fill: "#FFFFFF", anchor: "middle", weight: "bold" });
const wavy = (x1, x2, y, amp, per, c, w = 4) => {
  let d = `M${x1},${y}`;
  for (let x = x1; x < x2; x += per) d += ` q ${per / 4} ${-amp} ${per / 2} 0 q ${per / 4} ${amp} ${per / 2} 0`;
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
};
// Ion palette by charge
const IONC = { 1: COL.purple, 2: COL.red, 3: "#7A1F1A" };
const bigIon = (x, y, r, label, z) =>
  circ(x, y, r, IONC[z]) + text(x, y + Math.min(r, 26) * 0.38, label, { size: Math.max(15, Math.round(Math.min(r, 30) * 0.75)), anchor: "middle", fill: "#FFFFFF", weight: "bold" });

// ---------- Title motif: ions of different size/charge ----------
figs.title_motif = () => {
  const W = 420, H = 520;
  let b = "";
  const list = [[110, 140, 0.76, "+", 1], [270, 120, 1.02, "+", 1], [140, 300, 0.72, "2+", 2], [300, 300, 0.74, "2+", 2], [210, 430, 0.535, "3+", 3]];
  list.forEach(([x, y, r, l, z]) => {
    const R = r * 70;
    // field rings: stronger for higher charge density
    for (let k = 1; k <= z + 1; k++) b += circ(x, y, R + k * 14, "none", { stroke: z === 1 ? "#5B7083" : COL.amber, sw: 2, opacity: 0.9 - k * 0.18 });
    b += circ(x, y, R, z === 1 ? COL.purple : z === 2 ? COL.red : COL.amber) + text(x, y + 9, l, { size: 24, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  });
  return svg(W, H, b);
};

// ---------- Ion sizes (Shannon radii, CN 6) ----------
figs.ion_sizes = () => {
  const W = 640, H = 300;
  let b = "";
  const ions = [["Li⁺", 0.76, 1], ["Na⁺", 1.02, 1], ["K⁺", 1.38, 1], ["Mg²⁺", 0.72, 2], ["Zn²⁺", 0.74, 2], ["Ca²⁺", 1.0, 2], ["Al³⁺", 0.535, 3]];
  let x = 24;
  ions.forEach(([n, r, z]) => {
    const R = r * 36;
    x += R;
    b += circ(x, 130, R, IONC[z]);
    b += text(x, 230, n, { size: 18, anchor: "middle", weight: "bold", fill: IONC[z] });
    b += text(x, 256, `${r.toFixed(r < 0.6 ? 3 : 2)} Å`, { size: 16, anchor: "middle", fill: COL.text2 });
    x += R + 22;
  });
  b += text(W / 2, 30, "离子半径（按比例画）", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += text(W / 2, 290, "紫：一价  红：二价  深红：三价", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Li vs Na: size vs Lewis acidity ----------
figs.li_na_solv = () => {
  const W = 670, H = 400;
  let b = "";
  const shell = (cx, cy, r, R, n, tight) => {
    let s = "";
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      s += line(cx + r * Math.cos(a), cy + r * Math.sin(a), x - 12 * Math.cos(a), y - 12 * Math.sin(a), tight ? COL.red : COL.redLight, tight ? 4 : 2.5, tight ? {} : { dash: "5 4" });
      s += circ(x, y, 12, COL.red) + text(x, y + 5, "O", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    }
    return s;
  };
  // Li
  b += text(170, 34, "Li⁺：小，但“黏”", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  b += shell(170, 170, 22, 72, 4, true);
  b += bigIon(170, 170, 22, "Li⁺", 1);
  b += lines(170, 296, ["体相：个子小，钻得过窄通道", "界面：抓 O 抓得紧，脱溶剂难"], { size: 16, anchor: "middle", fill: COL.text2, lh: 26 });
  b += text(170, 360, "电荷密度 87 C mm^{−3}", { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
  // Na
  b += text(500, 34, "Na⁺：大，但“松”", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += shell(500, 170, 30, 96, 6, false);
  b += bigIon(500, 170, 30, "Na⁺", 1);
  b += lines(500, 296, ["体相：个子大，窄通道里挤", "界面：抓 O 抓得松，脱溶剂易"], { size: 16, anchor: "middle", fill: COL.text2, lh: 26 });
  b += text(500, 360, "电荷密度 36 C mm^{−3}", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += line(335, 60, 335, 380, COL.line, 2);
  return svg(W, H, b);
};

// ---------- Na SSE timeline ----------
figs.tl_na = () => {
  const W = 1180, H = 330;
  const ev = [
    { year: "1967", who: ["Yao & Kummer"], what: ["β-Al_{2}O_{3}"], color: COL.purple },
    { year: "1976", who: ["Goodenough 等"], what: ["NASICON"], color: COL.purple },
    { year: "1986", who: ["He, Chen 等"], what: ["NaSCN–PEO", "+ γ-Al_{2}O_{3}"], color: COL.teal },
    { year: "1992", who: ["Jansen &", "Henseler"], what: ["Na_{3}PS_{4}"], color: COL.sulfur },
    { year: "2013", who: ["Matsuo 等"], what: ["Na_{2}(BH_{4})(NH_{2})"], color: COL.text2 },
    { year: "2018", who: ["Zhang 等"], what: ["Na_{11}Sn_{2}PS_{12}"], color: COL.sulfur },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 165, left: 110, right: 1050, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- beta-alumina conduction plane: Li / Na / K fit ----------
figs.beta_plane = () => {
  const W = 640, H = 330;
  let b = "";
  const pan = (x0, label, r, dx, verdict, c) => {
    let s = "";
    s += rect(x0, 40, 190, 34, "#DCE3E9", { rx: 4 }) + rect(x0, 166, 190, 34, "#DCE3E9", { rx: 4 });
    s += rect(x0, 74, 190, 92, "#F3F0F9");
    s += line(x0 + 20, 74, x0 + 20, 166, COL.red, 3) + line(x0 + 170, 74, x0 + 170, 166, COL.red, 3);
    s += circ(x0 + 20, 120, 8, COL.red) + circ(x0 + 170, 120, 8, COL.red);
    s += bigIon(x0 + 95 + dx, 120 + (dx ? 22 : 0), r, label, 1);
    s += text(x0 + 95, 236, verdict[0], { size: 17, anchor: "middle", weight: "bold", fill: c });
    s += lines(x0 + 95, 264, verdict.slice(1), { size: 15, anchor: "middle", fill: COL.text2, lh: 22 });
    return s;
  };
  b += pan(10, "Li⁺", 0.76 * 28, -42, ["偏离中心", "贴着 O 不走"], COL.red);
  b += pan(225, "Na⁺", 1.02 * 28, 0, ["刚好合适", "空间为它而生"], COL.teal);
  b += pan(440, "K⁺", 1.38 * 28, 0, ["太挤", "通过瓶颈费力"], COL.amber);
  b += text(W / 2, 22, "β-Al_{2}O_{3} 的传导面（示意）", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- NASICON: Na fits, Li trapped off-centre ----------
figs.nasicon_trap = () => {
  const W = 640, H = 380;
  let b = "";
  const cage = (cx, cy, lab, r, off, c, t1, t2) => {
    let s = "";
    const pts = [];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
      pts.push([cx + 100 * Math.cos(a), cy + 100 * Math.sin(a)]);
    }
    s += `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="#F7F9FB" stroke="${COL.line}" stroke-width="3"/>`;
    pts.forEach(([x, y]) => (s += circ(x, y, 15, COL.redLight, { stroke: COL.red, sw: 2 })));
    // bottleneck
    s += line(cx - 30, cy - 100, cx + 30, cy - 100, COL.amber, 5);
    const ix = cx + off[0], iy = cy + off[1];
    if (off[0] !== 0) s += line(ix, iy, pts[3][0], pts[3][1], COL.red, 3) + line(ix, iy, pts[2][0], pts[2][1], COL.red, 3);
    s += bigIon(ix, iy, r, lab, 1);
    s += text(cx, cy + 150, t1, { size: 18, anchor: "middle", weight: "bold", fill: c });
    s += text(cx, cy + 178, t2, { size: 16, anchor: "middle", fill: COL.text2 });
    return s;
  };
  b += cage(160, 150, "Na⁺", 30, [0, 0], COL.teal, "Na⁺ 居中，容易出瓶颈", "Na–O 键偏离子性");
  b += cage(480, 150, "Li⁺", 22, [-38, 30], COL.red, "Li⁺ 偏到一角被“困住”", "Li–O 键共价性更强");
  b += text(160, 30, "橙线 = 通往下一个笼子的瓶颈", { size: 15, anchor: "middle", fill: COL.amber, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Desolvation at internal interfaces ----------
figs.interface_desolv = () => {
  const W = 670, H = 400;
  let b = "";
  b += rect(20, 60, 300, 230, "#E8F4F3");
  b += rect(320, 60, 330, 230, "#F3F0F9");
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) b += circ(350 + c * 52, 88 + r * 56, 17, "#C9D2DA", { stroke: "#9AA6B2", sw: 1.5 });
  [0, 1, 2, 3].forEach((k) => (b += wavy(30, 300, 90 + k * 56, 10, 40, COL.tealLight, 4)));
  b += text(170, 48, "聚合物或液体电解质", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(485, 48, "无机 SIE", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  // solvated ion approaching
  const sx = 200, sy = 175;
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    b += circ(sx + 32 * Math.cos(a), sy + 32 * Math.sin(a), 11, COL.red) + text(sx + 32 * Math.cos(a), sy + 32 * Math.sin(a) + 5, "O", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  }
  b += ion(sx, sy, { r: 14 });
  b += arrow(246, sy, 300, sy, { color: COL.amber, width: 4, head: 14 });
  b += text(273, sy - 50, "脱溶剂", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  b += ion(352 + 26, 175 - 28 + 28, { r: 12 });
  b += line(320, 52, 320, 298, COL.ink, 3, { dash: "8 6" });
  // barrier bars
  const bars = [["Na⁺", 0.45, COL.teal], ["Li⁺", 0.6, COL.purple], ["Mg²⁺", 1.0, COL.red]];
  b += text(20, 326, "界面能垒（相对示意）：", { size: 16, weight: "bold", fill: COL.text2 });
  bars.forEach(([n, f, c], i) => {
    const y = 340 + i * 0;
    const x = 200 + i * 150;
    b += text(x, 330, n, { size: 16, weight: "bold", fill: c });
    b += rect(x, 342, 120, 18, COL.light, { rx: 9 }) + rect(x, 342, 120 * f, 18, c, { rx: 9 });
  });
  b += text(W / 2, 392, "Na⁺ 抓溶剂最松，跨界面最容易；Mg²⁺ 最难", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Multivalent SSE timeline ----------
figs.tl_mv = () => {
  const W = 1180, H = 400;
  const ev = [
    { year: "1982", who: ["Farrington", "& Dunn"], what: ["二价 β″-Al_{2}O_{3}", "（Zn²⁺、Ca²⁺）"], color: COL.red },
    { year: "1986", who: ["Yang 等;", "Abrantes 等"], what: ["MgCl_{2}–PEO、", "含 Zn²⁺ 聚合物"], color: COL.teal },
    { year: "1987", who: ["Ikeda 等"], what: ["MgZr_{4}(PO_{4})_{6}"], color: COL.red },
    { year: "1990", who: ["Ikeda"], what: ["ZnZr_{4}(PO_{4})_{6}"], color: COL.red },
    { year: "2003", who: ["Chusid 等"], what: ["凝胶 Mg SPE", "+ Mo_{6}S_{8} 正极"], color: COL.teal },
    { year: "2014", who: ["Higashi 等"], what: ["Mg(BH_{4})(NH_{2})"], color: COL.text2 },
    { year: "2017", who: ["Canepa 等"], what: ["尖晶石硒化物", "Mg²⁺ 高迁移"], color: COL.amber },
    { year: "2019", who: ["Martinolich 等"], what: ["ZnPS_{3}"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 200, left: 100, right: 1050, whoSize: 19, whatSize: 17, yearSize: 28 }));
};

// ---------- Multivalent design strategies ----------
figs.mv_strategies = () => {
  const W = 1180, H = 360;
  let b = "";
  const tw = 380, gap = 10;
  const tiles = [
    ["① 换成大而软的阴离子", ["Se^{2−} 代替 O^{2−}：", "尖晶石 MgSc_{2}Se_{4}"]],
    ["② 缩短跳跃距离", ["Mg(BH_{4})(NH_{2})：", "Mg–Mg 仅 3.59 Å"]],
    ["③ 异价取代造空位", ["Nb^{5+} 取代 Zr^{4+}：", "Mg 位出现空位"]],
  ];
  tiles.forEach(([t, s], i) => {
    const x = 5 + i * (tw + gap);
    b += rect(x, 5, tw, 350, "#F5F7F9", { rx: 14 });
    b += text(x + tw / 2, 42, t, { size: 20, anchor: "middle", weight: "bold" });
    b += lines(x + tw / 2, 298, s, { size: 17, anchor: "middle", fill: COL.text2, lh: 26 });
  });
  // tile 1: small O vs big Se around Mg
  {
    const cx = 5 + tw / 2;
    b += circ(cx - 90, 160, 26, COL.redLight, { stroke: COL.red, sw: 2 }) + text(cx - 90, 167, "O", { size: 18, anchor: "middle", weight: "bold" });
    b += bigIon(cx - 46, 160, 15, "Mg", 2);
    b += text(cx - 68, 222, "抓得牢", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
    b += circ(cx + 60, 160, 46, COL.sulfurLight, { stroke: COL.sulfur, sw: 2 }) + text(cx + 60, 167, "Se", { size: 18, anchor: "middle", weight: "bold" });
    b += bigIon(cx + 122, 160, 15, "Mg", 2);
    b += text(cx + 80, 240, "离得远、可极化", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  }
  // tile 2: zigzag Mg chain in tunnel
  {
    const x0 = 5 + tw + gap;
    b += rect(x0 + 30, 90, tw - 60, 150, "#F3F0F9", { rx: 20 });
    const pts = [[x0 + 70, 190], [x0 + 130, 140], [x0 + 190, 190], [x0 + 250, 140], [x0 + 310, 190]];
    b += `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${COL.red}" stroke-width="3" stroke-dasharray="6 5"/>`;
    pts.forEach(([x, y]) => (b += bigIon(x, y, 15, "Mg", 2)));
    b += line(x0 + 130, 112, x0 + 190, 112, COL.ink, 2) + line(x0 + 130, 104, x0 + 130, 120, COL.ink, 2) + line(x0 + 190, 104, x0 + 190, 120, COL.ink, 2);
    b += text(x0 + 160, 102, "3.59 Å", { size: 16, anchor: "middle", weight: "bold" });
    b += text(x0 + tw / 2, 262, "阴离子骨架围成的隧道", { size: 15, anchor: "middle", fill: COL.muted });
  }
  // tile 3: substitution creates vacancy
  {
    const x0 = 5 + 2 * (tw + gap);
    for (let c = 0; c < 4; c++) {
      const x = x0 + 75 + c * 76;
      const nb = c === 1;
      b += rect(x - 26, 100, 52, 52, nb ? COL.amberLight : COL.tealLight, { stroke: nb ? COL.amber : COL.teal, sw: 2.5, rx: 6 });
      b += text(x, 133, nb ? "Nb" : "Zr", { size: 17, anchor: "middle", weight: "bold" });
      if (c === 2) b += circ(x, 205, 16, "none", { stroke: COL.red, sw: 3, dash: "5 4" });
      else b += bigIon(x, 205, 16, "Mg", 2);
    }
    b += arrow(x0 + 151 + 30, 180, x0 + 151 + 60, 200, { color: COL.red, width: 2.5, head: 10 });
    b += text(x0 + 227, 252, "空位", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  }
  return svg(W, H, b);
};

// ---------- Mg polymer electrolytes ----------
figs.mg_spe = () => {
  const W = 640, H = 380;
  let b = "";
  // left: gel
  b += rect(10, 50, 300, 250, "#E8F4F3", { rx: 16 });
  b += text(160, 34, "凝胶 SPE（2003）", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  [0, 1, 2, 3].forEach((k) => (b += wavy(26, 290, 90 + k * 52, 10, 40, COL.teal, 4)));
  const R = rng(9);
  for (let i = 0; i < 18; i++) b += `<ellipse cx="${(30 + R() * 260).toFixed(0)}" cy="${(70 + R() * 210).toFixed(0)}" rx="10" ry="6" fill="#9CC9E0"/>`;
  [[90, 120], [210, 200], [150, 250]].forEach(([x, y]) => (b += bigIon(x, y, 13, "Mg", 2)));
  b += lines(160, 330, ["PVDF 或 PEO + 四甘醇二甲醚", "（蓝点 = 增塑剂）"], { size: 15, anchor: "middle", fill: COL.text2, lh: 22 });
  // right: nanocomposite
  b += rect(330, 50, 300, 250, "#F1ECF8", { rx: 16 });
  b += text(480, 34, "纳米复合 SPE（2015）", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  [0, 1, 2, 3].forEach((k) => (b += wavy(346, 610, 90 + k * 52, 10, 40, COL.teal, 4)));
  [[400, 130], [540, 110], [470, 220], [580, 250]].forEach(([x, y], k) => (b += blob(x, y, 18, 40 + k, { fill: COL.alu, stroke: COL.siDark, sw: 2 })));
  [[440, 175], [560, 180]].forEach(([x, y]) => (b += bigIon(x, y, 13, "Mg", 2)));
  b += lines(480, 330, ["PEO + Mg(BH_{4})_{2} + MgO 颗粒", "100 °C 下 CE 达 98%"], { size: 15, anchor: "middle", fill: COL.text2, lh: 22 });
  return svg(W, H, b);
};

// ---------- Zn options ----------
figs.zn_options = () => {
  const W = 1180, H = 360;
  let b = "";
  const tw = 380, gap = 10;
  const tiles = [
    ["水系 Zn：问题", ["枝晶、形状变化", "水的电化学窗口窄"], COL.red],
    ["ZnPS_{3}：可伸缩的 P–P 键", ["Zn²⁺ 八面体配位于 [P_{2}S_{6}]^{4−}", "60 °C 下仍仅 10^{−5}–10^{−3} mS cm^{−1}"], COL.amber],
    ["绕开 Zn²⁺：传 OH⁻", ["碱性 Zn–空气 / Zn–Mn 电池", "季铵化 PVA 膜只让 OH⁻ 过"], COL.teal],
  ];
  tiles.forEach(([t, s, c], i) => {
    const x = 5 + i * (tw + gap);
    b += rect(x, 5, tw, 350, "#F5F7F9", { rx: 14 });
    b += text(x + tw / 2, 42, t, { size: 20, anchor: "middle", weight: "bold", fill: c });
    b += lines(x + tw / 2, 298, s, { size: 16, anchor: "middle", fill: COL.text2, lh: 26 });
  });
  // tile 1: Zn electrode with dendrites in water
  {
    const x0 = 5;
    b += rect(x0 + 40, 80, 300, 170, COL.electrolyte, { rx: 8 });
    b += rect(x0 + 40, 210, 300, 40, "#9AA6B2");
    b += text(x0 + 190, 237, "Zn", { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    [[110, 60], [200, 90], [280, 50]].forEach(([x, h]) => (b += `<path d="M${x0 + x},210 L${x0 + x - 6},${210 - h * 0.5} L${x0 + x + 4},${210 - h * 0.7} L${x0 + x - 2},${210 - h}" fill="none" stroke="#9AA6B2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`));
    b += text(x0 + 300, 110, "H_{2}O", { size: 16, anchor: "middle", fill: "#3A7CA5", weight: "bold" });
    b += cross(x0 + 200, 105, 12);
  }
  // tile 2: honeycomb with P–P dumbbells
  {
    const x0 = 5 + tw + gap, cx = x0 + tw / 2, cy = 160;
    const hex = (hx, hy, r) => {
      const p = [];
      for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; p.push([hx + r * Math.cos(a), hy + r * Math.sin(a)]); }
      return p;
    };
    const hpts = hex(cx, cy, 80);
    b += `<polygon points="${hpts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${COL.line}" stroke-width="3"/>`;
    hpts.forEach(([x, y], k) => (b += k % 2 ? bigIon(x, y, 16, "Zn", 2) : circ(x, y, 13, COL.sulfurLight, { stroke: COL.sulfur, sw: 2 })));
    b += circ(cx, cy - 18, 13, "#F6CFE0", { stroke: "#C24E84", sw: 2 }) + circ(cx, cy + 18, 13, "#F6CFE0", { stroke: "#C24E84", sw: 2 });
    b += `<path d="M${cx},${cy - 5} l -6,4 l 12,4 l -12,4 l 6,4" fill="none" stroke="#C24E84" stroke-width="2.5"/>`;
    b += text(cx + 22, cy + 6, "P–P", { size: 16, weight: "bold", fill: "#C24E84" });
  }
  // tile 3: OH- membrane
  {
    const x0 = 5 + 2 * (tw + gap);
    b += rect(x0 + 175, 70, 30, 180, COL.tealLight);
    [100, 150, 200].forEach((y) => (b += text(x0 + 190, y + 6, "+", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal })));
    b += anionX(x0 + 110, 120, 15) + text(x0 + 110, 100, "OH⁻", { size: 15, anchor: "middle", weight: "bold", fill: COL.teal });
    b += arrow(x0 + 128, 120, x0 + 270, 120, { color: COL.teal, width: 3.5, head: 13 });
    b += check(x0 + 300, 120, 12);
    b += circ(x0 + 270, 210, 18, COL.red) + text(x0 + 270, 216, "Zn", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    b += arrow(x0 + 248, 210, x0 + 214, 210, { color: COL.red, width: 3, head: 12 });
    b += cross(x0 + 150, 210, 12);
    b += text(x0 + 300, 250, "[Zn(NH_{3})_{6}]^{2+}", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  }
  return svg(W, H, b);
};

// ---------- Al options ----------
figs.al_options = () => {
  const W = 640, H = 380;
  let b = "";
  // left: Al–air with PVA–PAA membrane
  b += text(160, 30, "Al–空气：高分子“锁住”KOH", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += rect(20, 60, 50, 230, "#AEB8C2") + text(45, 180, "Al", { size: 18, anchor: "middle", weight: "bold" });
  b += rect(70, 60, 150, 230, "#E8F4F3");
  [0, 1, 2, 3].forEach((k) => (b += wavy(80, 210, 95 + k * 52, 8, 32, COL.teal, 3.5)));
  [[115, 128], [170, 180], [125, 232]].forEach(([x, y]) => (b += text(x, y, "KOH", { size: 15, anchor: "middle", weight: "bold", fill: COL.siDark })));
  b += rect(220, 60, 60, 230, "#D7DEE5", { stroke: COL.siDark, sw: 2 });
  b += lines(250, 160, ["空气", "正极"], { size: 15, anchor: "middle", weight: "bold", lh: 22 });
  b += lines(160, 322, ["PVA–PAA 膜：防漏液、", "防吸潮（2006）"], { size: 15, anchor: "middle", fill: COL.text2, lh: 22 });
  // right: ionic liquid gel + graphite
  b += text(480, 30, "Al 离子电池：离子液体凝胶", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += rect(340, 60, 50, 230, "#AEB8C2") + text(365, 180, "Al", { size: 18, anchor: "middle", weight: "bold" });
  b += rect(390, 60, 150, 230, "#F1ECF8");
  [0, 1, 2, 3].forEach((k) => (b += wavy(400, 530, 95 + k * 52, 8, 32, COL.purpleLight, 3.5)));
  b += text(465, 128, "AlCl_{4}^{−}", { size: 15, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(465, 232, "Al_{2}Cl_{7}^{−}", { size: 15, anchor: "middle", weight: "bold", fill: COL.purple });
  b += rect(540, 60, 80, 230, "#4F5B66");
  for (let y = 75; y < 290; y += 18) b += line(548, y, 612, y, "#8C99A5", 2);
  b += lines(480, 322, ["EMImCl–AlCl_{3} + 聚合物", "石墨正极，充电 < 10 s"], { size: 15, anchor: "middle", fill: COL.text2, lh: 22 });
  return svg(W, H, b);
};

module.exports = figs;
