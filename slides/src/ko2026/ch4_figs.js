// Figures for Ko et al. 2026, Chapter 4 (Interphases: evolution, dynamics, potential dependence). ~96 px per inch.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;
const { rect, line, circle, ellipse, path, solvated, potAxis, card, mol, flow } = require("./figlib");

const figs = {};

// SEI mosaic strip helper
const mosaic = (x, y, w, h, seed, o = {}) => {
  const R = rng(seed);
  let b = rect(x, y, w, h, o.base || "#D9B38C");
  const n = Math.round((w * h) / (o.dens || 260));
  for (let i = 0; i < n; i++) {
    const px = x + R() * (w - 10), py = y + R() * (h - 10);
    const pw = 5 + R() * 10, ph = 5 + R() * 10;
    b += rect(px.toFixed(1), py.toFixed(1), Math.min(pw, x + w - px).toFixed(1), Math.min(ph, y + h - py).toFixed(1), R() > 0.5 ? COL.sei : "#F0D9C0", { rx: 2 });
  }
  return b;
};

// ---------- Title motif ----------
figs.title_motif4 = () => {
  const W = 520, H = 620;
  let b = "";
  b += rect(60, 80, 140, 470, "#5D6E7E", { rx: 8 });
  b += mosaic(200, 80, 60, 470, 4, { dens: 180 });
  b += rect(260, 80, 200, 470, "#2C4A63", { rx: 0 });
  b += solvated(370, 200, "AWAW", { r: 20, dist: 44, rx: 20, ry: 12 });
  b += arrow(330, 330, 270, 330, { color: COL.purpleLight, width: 5, head: 18 });
  b += ion(370, 330, { r: 20 });
  b += cross(240, 450, 16, COL.red, 6);
  b += electron(140, 450, 18);
  return svg(W, H, b);
};

// ---------- Roadmap mini ----------
figs.roadmap4 = () => {
  const W = 520, H = 210;
  let b = "";
  b += rect(20, 40, 90, 120, "#B9C3CC") + mosaic(110, 40, 30, 120, 7);
  b += rect(140, 40, 220, 120, COL.electrolyte);
  b += mosaic(360, 40, 30, 120, 8, { base: COL.purpleLight }) + rect(390, 40, 110, 120, COL.amberLight);
  b += text(125, 190, "SEI", { size: 18, anchor: "middle", weight: "bold", fill: COL.sei });
  b += text(375, 190, "CEI", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(250, 108, "电位 → 负担", { size: 19, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- Fig. 4 redrawn as two-row timeline ----------
figs.fig4_timeline = () => {
  const W = 1240, H = 560;
  const row1 = [
    { year: "1970–77", who: ["Dey"], what: ["Li 表面发现", "Li_{2}CO_{3} 膜"], color: COL.text2 },
    { year: "1979", who: ["Peled"], what: ["提出", "SEI 概念"], color: COL.sei },
    { year: "1981", who: [], what: ["双层 SEI：", "致密无机+多孔有机"], color: COL.text2 },
    { year: "1985", who: ["Nazri & Muller"], what: ["无机/有机", "复合结构"], color: COL.text2 },
    { year: "1987", who: ["Aurbach 等"], what: ["烷基碳酸锂", "ROCO_{2}Li"], color: COL.text2 },
    { year: "1996", who: [], what: ["LiCoO_{2} 上", "观察到 CEI"], color: COL.purple },
    { year: "1997", who: ["Peled 等"], what: ["马赛克", "Mosaic 模型"], color: COL.sei },
  ];
  const row2 = [
    { year: "2000", who: [], what: ["亲核/交换反应", "形成 CEI"], color: COL.purple },
    { year: "2004", who: [], what: ["SEI 生长的", "数学模型"], color: COL.teal },
    { year: "2012", who: [], what: ["两层/两机制", "（扩散）SEI"], color: COL.teal },
    { year: "2014", who: [], what: ["富 LiF SEI", "SEI 三维建模"], color: COL.amber },
    { year: "2017", who: [], what: ["脱氢反应", "形成 CEI"], color: COL.purple },
    { year: "2022", who: [], what: ["结合双电层", "设计 CEI"], color: COL.amber },
  ];
  const o = { whoSize: 17, whatSize: 16, yearSize: 22 };
  let b = timeline(W, H, row1, { ...o, axisY: 140, left: 90, right: 1130 });
  b += timeline(W, H, row2, { ...o, axisY: 420, left: 130, right: 1090 });
  return svg(W, H, b);
};

// ---------- Electrode potentials outside the electrolyte window ----------
figs.window_interphase = () => {
  const W = 660, H = 470;
  let b = "";
  const yv = (v) => 430 - v * 85;
  b += rect(150, yv(4.3), 330, yv(1.0) - yv(4.3), COL.electrolyte);
  b += lines(315, yv(2.7), ["电解液热力学", "稳定区"], { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5", lh: 26 });
  b += line(110, yv(0) + 12, 110, yv(4.8), COL.ink, 3) + head(110, yv(4.8) - 12, -Math.PI / 2, COL.ink, 13);
  [0, 1, 2, 3, 4].forEach((v) => (b += text(100, yv(v) + 6, `${v} V`, { size: 16, anchor: "end", fill: COL.text2 })));
  b += text(20, 22, "vs Li^{+}/Li", { size: 16, weight: "bold", fill: COL.text2 });
  // anode
  b += line(150, yv(0.05), 480, yv(0.05), COL.purple, 6) + text(490, yv(0.05) + 6, "负极 Li / 石墨", { size: 17, weight: "bold", fill: COL.purple });
  b += mosaic(150, yv(1.0), 330, yv(0.05) - yv(1.0) - 4, 3, { dens: 300 });
  b += pill(215, yv(0.55) - 17, 200, 34, COL.sei, "SEI：动力学“挡板”", { size: 17 });
  // cathode
  b += line(150, yv(4.75), 480, yv(4.75), COL.amber, 6) + text(490, yv(4.75) + 6, "高电位正极", { size: 17, weight: "bold", fill: COL.amber });
  b += mosaic(150, yv(4.72) + 4, 330, yv(4.3) - yv(4.72) - 4, 9, { base: COL.purpleLight, dens: 300 });
  b += pill(275, yv(4.51) - 14, 80, 28, COL.purple, "CEI", { size: 16 });
  return svg(W, H, b);
};

// ---------- Peled's SEI model ----------
figs.sei_peled = () => {
  const W = 660, H = 430;
  let b = "";
  b += rect(30, 40, 170, 300, "#B9C3CC");
  b += text(115, 370, "Li 金属", { size: 18, anchor: "middle", weight: "bold" });
  b += mosaic(200, 40, 70, 300, 11, { dens: 200 });
  b += text(235, 370, "SEI", { size: 18, anchor: "middle", weight: "bold", fill: COL.sei });
  b += text(235, 396, "几 nm", { size: 16, anchor: "middle", fill: COL.text2 });
  b += rect(270, 40, 370, 300, COL.electrolyte);
  b += text(455, 370, "电解液", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += ion(560, 110, { r: 15 });
  b += arrow(540, 110, 150, 110, { color: COL.purple, width: 3.5, head: 14 });
  b += check(330, 80, 12) + text(355, 86, "Li⁺ 能通过（像固体电解质）", { size: 17, weight: "bold", fill: COL.purple });
  b += electron(130, 240, 15);
  b += arrow(150, 240, 228, 240, { color: COL.amber, width: 3.5, head: 13 });
  b += cross(250, 240, 12);
  b += text(290, 230, "电子过不去", { size: 17, weight: "bold", fill: COL.red });
  b += text(290, 256, "→ 电解液不再被还原", { size: 17, weight: "bold", fill: COL.red });
  b += ellipse(500, 200, 22, 13, COL.teal);
  b += text(500, 300, "solid electrolyte interphase", { size: 17, anchor: "middle", fill: COL.sei, italic: true });
  return svg(W, H, b);
};

// ---------- Double-layer vs mosaic models ----------
figs.sei_models = () => {
  const W = 680, H = 450;
  let b = "";
  // double layer
  b += text(165, 30, "双层模型（1980 年代）", { size: 18, anchor: "middle", weight: "bold" });
  b += rect(20, 50, 70, 300, "#B9C3CC");
  b += rect(90, 50, 60, 300, COL.sei);
  const R = rng(2);
  b += rect(150, 50, 140, 300, "#F0D9C0");
  for (let i = 0; i < 40; i++) b += circle((158 + R() * 125).toFixed(1), (58 + R() * 285).toFixed(1), (4 + R() * 6).toFixed(1), COL.electrolyte);
  b += lines(120, 385, ["致密无机", "Li_{2}CO_{3}、Li_{2}O"], { size: 16, anchor: "middle", weight: "bold", fill: COL.sei, lh: 22 });
  b += lines(220, 385, ["多孔有机", "聚合物"], { size: 16, anchor: "middle", weight: "bold", fill: "#8A6A4A", lh: 22 });
  // mosaic
  b += text(510, 30, "马赛克模型（Peled 1997）", { size: 18, anchor: "middle", weight: "bold" });
  b += rect(360, 50, 70, 300, "#B9C3CC");
  b += rect(430, 50, 230, 300, "#F0D9C0");
  const R2 = rng(5);
  for (let i = 0; i < 26; i++) {
    const x = 435 + R2() * 200, y = 55 + R2() * 270;
    const cols = [COL.sei, COL.teal, COL.purple, COL.amber];
    const c = cols[i % 4];
    b += `<polygon points="${x},${y} ${x + 18 + R2() * 10},${y + 3} ${x + 22},${y + 18 + R2() * 8} ${x + 4},${y + 22}" fill="${c}" opacity="0.85"/>`;
  }
  b += path("M445,330 L470,300 L500,310 L530,270 L560,280 L590,240 L640,230", COL.purple, 3, { dash: "6 5" });
  b += lines(545, 385, ["无机小晶粒嵌在无定形有机基体中", "晶界 = Li⁺ 的快速通道（虚线）"], { size: 16, anchor: "middle", weight: "bold", lh: 22 });
  b += lines(545, 438, ["色块：LiF、Li_{2}O、Li_{2}CO_{3} 等"], { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- CEI: from by-product to functional layer ----------
figs.cei_shift = () => {
  const W = 680, H = 400;
  let b = "";
  b += rect(20, 30, 290, 260, "#F5F7F9", { rx: 16 });
  b += rect(370, 30, 290, 260, "#E8F4F3", { rx: 16 });
  b += text(165, 70, "以前：副产物", { size: 20, anchor: "middle", weight: "bold", fill: COL.muted });
  b += text(515, 70, "现在：可设计的功能层", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(165, 120, ["电解液分解“不得不”", "留下的残渣", "只能尽量减少"], { size: 17, anchor: "middle", fill: COL.text2, lh: 30 });
  b += lines(515, 120, ["通过电解液设计", "主动调控成分与结构", "SEI 和 CEI 都一样"], { size: 17, anchor: "middle", fill: COL.ink, lh: 30, weight: "bold" });
  b += arrow(315, 160, 365, 160, { color: COL.teal, width: 4, head: 15 });
  b += rect(20, 310, 640, 70, COL.light, { rx: 14 });
  b += text(340, 340, "转折点：在正极表面也发现了类似的界面相（CEI）", { size: 17, anchor: "middle", weight: "bold" });
  b += text(340, 366, "→ 界面相是普遍现象，而不是负极的“特例”", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Consequences of repeated damage ----------
figs.dyn_chain = () => {
  const W = 680, H = 450;
  let b = "";
  b += rect(220, 20, 240, 70, COL.sei, { rx: 16 });
  b += lines(340, 50, ["界面相反复", "破坏与重建"], { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF", lh: 24 });
  const items = ["电解液耗尽", "活性物质被电隔离", "界面电阻增大", "Li⁺ 传输不均匀", "局部应力集中"];
  const pos = items.map((t, i) => {
    const x = 20 + (i % 3) * 225, y = i < 3 ? 170 : 270;
    return [i < 3 ? x : x + 112, y];
  });
  pos.forEach(([xx, y]) => (b += line(340, 92, xx + 100, y - 2, COL.muted, 2, { dash: "5 5" })));
  items.forEach((t, i) => {
    const [xx, y] = pos[i];
    b += rect(xx, y, 200, 56, "#FBEDEC", { rx: 14, stroke: COL.red, sw: 2 });
    b += text(xx + 100, y + 35, t, { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  });
  b += rect(160, 370, 360, 56, COL.ink, { rx: 14 });
  b += text(340, 405, "性能衰减 → 电池失效", { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += arrow(340, 330, 340, 366, { color: COL.ink, width: 3, head: 12 });
  return svg(W, H, b);
};

// ---------- Fig. 5a: six instability modes ----------
figs.fig5a = () => {
  const W = 1180, H = 400;
  let b = "";
  const cell = (x, y, title, body) => {
    let s = rect(x, y, 370, 170, COL.electrolyte, { rx: 12 });
    s += rect(x, y + 120, 370, 50, COL.sulfurLight) + text(x + 185, y + 152, "负极", { size: 16, anchor: "middle", weight: "bold", fill: "#8A6A00" });
    s += body;
    s += text(x + 185, y + 30, title, { size: 18, anchor: "middle", weight: "bold" });
    return s;
  };
  const sei = (x, y, w, seed) => mosaic(x, y, w, 16, seed, { dens: 120 });
  // 1 dissolution
  let p = sei(20, 125, 370, 1);
  [[120, 85], [160, 70], [210, 90], [250, 60]].forEach(([x, y], i) => (p += rect(x, y, 14, 9, COL.sei, { rx: 2 })));
  p += arrow(180, 118, 200, 75, { color: COL.ink, width: 2.5, head: 10 });
  b += cell(20, 20, "① 溶解", p);
  // 2 volume change + crack
  p = `<path d="M405,140 Q480,100 560,135 L600,140 Q680,95 775,140 L775,190 L405,190 Z" fill="${COL.sulfurLight}"/>`;
  p += path("M405,138 Q480,98 520,118", COL.sei, 9) + path("M545,130 L600,138", COL.sei, 9) + path("M620,125 Q690,95 775,138", COL.sei, 9);
  p += path("M530,120 L540,160 L535,185", COL.red, 3) + path("M610,130 L605,170", COL.red, 3);
  b += cell(405, 20, "② 体积变化 → 开裂", p);
  // 3 solvent penetration + dendrite
  p = sei(790, 125, 370, 3);
  [[850, 100], [880, 112], [910, 98], [940, 116]].forEach(([x, y]) => (p += ellipse(x, y, 12, 7, COL.teal)));
  p += path("M1080,125 L1085,85 L1078,60", "#8F9BA6", 8) + path("M1084,90 L1100,75", "#8F9BA6", 6);
  p += text(895, 80, "溶剂渗入、溶胀", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  p += text(1125, 92, "枝晶", { size: 15, anchor: "middle", fill: COL.text2, weight: "bold" });
  b += cell(790, 20, "③ 溶剂渗透 / 枝晶", p);
  // 4 gas + delamination + dead Li
  p = sei(20, 335, 140, 4) + sei(240, 335, 150, 5);
  p += rect(165, 312, 70, 14, COL.sei, { rx: 3 });
  [[70, 300], [95, 285], [300, 300], [320, 280]].forEach(([x, y]) => (p += circle(x, y, 9, "#FFFFFF", { stroke: COL.red, sw: 2 })));
  p += blob(200, 290, 12, 4, { fill: COL.sulfurLight, stroke: COL.sulfur, sw: 2 });
  p += text(240, 296, "死锂", { size: 15, weight: "bold" });
  b += cell(20, 230, "④ 产气 → 剥离", p);
  // 5 overgrowth
  p = `<path d="M440,335 Q500,250 580,300 Q640,270 700,335 Z" fill="${COL.ink}" opacity="0.85"/>` + sei(405, 335, 370, 6);
  p += ion(440, 270, { r: 12 }) + cross(470, 290, 9);
  b += cell(405, 230, "⑤ 局部过度生长（阻挡 Li⁺）", p);
  // 6 uncontrolled formation
  p = sei(790, 335, 370, 7);
  p += `<path d="M900,335 Q960,265 1040,335 Z" fill="${COL.ink}" opacity="0.85"/>`;
  p += ellipse(860, 322, 22, 9, COL.red) + ellipse(1110, 322, 22, 9, COL.teal);
  p += text(860, 300, "阴离子来源", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  p += text(1110, 300, "溶剂来源", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += cell(790, 230, "⑥ 形成过程失控、成分不均", p);
  return svg(W, H, b);
};

// ---------- SEI growth regimes ----------
figs.sei_growth = () => {
  const W = 660, H = 430;
  let b = "";
  const X0 = 80, X1 = 620, Y0 = 350, Y1 = 40;
  b += line(X0, Y0, X1, Y0, COL.ink, 2.5) + head(X1 + 10, Y0, 0, COL.ink, 12);
  b += line(X0, Y0, X0, Y1, COL.ink, 2.5) + head(X0, Y1 - 10, -Math.PI / 2, COL.ink, 12);
  b += text((X0 + X1) / 2, Y0 + 40, "时间（循环）", { size: 17, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(${X0 - 40} ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "SEI 厚度", { size: 17, anchor: "middle", weight: "bold" }) + `</g>`;
  const y3 = 270;
  b += line(X0, y3, X1, y3, COL.muted, 2, { dash: "6 5" }) + text(X1 - 5, y3 - 10, "≈3 nm 隧穿极限", { size: 16, anchor: "end", fill: COL.muted, weight: "bold" });
  b += path(`M${X0},${Y0} C${X0 + 20},300 ${X0 + 50},${y3 + 4} 190,${y3}`, COL.purple, 5);
  b += path(`M190,${y3} C300,215 420,185 ${X1 - 20},160`, COL.teal, 5);
  b += path(`M300,226 L340,170 L380,205 L430,150 L470,180 L530,120 L${X1 - 20},95`, COL.red, 4, { dash: "9 6" });
  b += lines(225, 312, ["① 电子隧穿", "快速生长"], { size: 16, anchor: "middle", weight: "bold", fill: COL.purple, lh: 22 });
  b += lines(410, 300, ["② 中性 Li 原子扩散、", "自由基传输：变慢"], { size: 16, anchor: "middle", weight: "bold", fill: COL.teal, lh: 22 });
  b += lines(390, 75, ["③ 实际：溶解、开裂、渗透", "→ 多电子还原持续发生"], { size: 16, anchor: "middle", weight: "bold", fill: COL.red, lh: 22 });
  return svg(W, H, b);
};

// ---------- Swelling and dissolution ----------
figs.swell = () => {
  const W = 660, H = 400;
  let b = "";
  b += text(160, 30, "理想：致密、干燥", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += rect(30, 260, 260, 60, "#B9C3CC") + mosaic(30, 200, 260, 60, 3, { dens: 120 });
  b += rect(30, 50, 260, 150, COL.electrolyte);
  [[90, 110], [170, 90], [230, 140]].forEach(([x, y]) => (b += ellipse(x, y, 16, 9, COL.teal)));
  b += text(500, 30, "实际：被浸润、溶胀", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += rect(370, 260, 260, 60, "#B9C3CC") + mosaic(370, 140, 260, 120, 4, { dens: 400 });
  b += rect(370, 50, 260, 90, COL.electrolyte);
  const R = rng(8);
  for (let i = 0; i < 12; i++) b += ellipse((385 + R() * 230).toFixed(1), (150 + R() * 100).toFixed(1), 13, 7, COL.teal, { opacity: 0.9 });
  b += lines(160, 355, ["模量高、均匀"], { size: 17, anchor: "middle", weight: "bold", lh: 24 });
  b += lines(500, 355, ["截留溶剂 → 模量降低、更不均匀", "→ 电极可逆性下降"], { size: 16, anchor: "middle", weight: "bold", fill: COL.red, lh: 24 });
  return svg(W, H, b);
};

// ---------- Ensemble of species near the electrode ----------
figs.species = () => {
  const W = 680, H = 450;
  let b = "";
  const sp = [
    { x: 100, t: "溶剂分隔离子对", s: "SSIP", lig: "SSSS", c: COL.teal, v: 0.3 },
    { x: 270, t: "接触离子对", s: "CIP", lig: "ASSS", c: COL.purple, v: 0.6 },
    { x: 440, t: "混合配合物", s: "", lig: "AASS", c: COL.amber, v: 0.9 },
    { x: 600, t: "高阶聚集体", s: "AGG", lig: "AAAA", c: COL.red, v: 1.3 },
  ];
  sp.forEach((p) => {
    b += solvated(p.x, 90, p.lig, { r: 15, dist: 33, rx: 14, ry: 8 });
    b += text(p.x, 165, p.t, { size: 16, anchor: "middle", weight: "bold", fill: p.c });
    if (p.s) b += text(p.x, 188, p.s, { size: 16, anchor: "middle", fill: COL.text2 });
    const y = 400 - p.v * 140;
    b += line(p.x - 55, y, p.x + 55, y, p.c, 6);
  });
  b += line(30, 410, 30, 210, COL.ink, 2.5) + head(30, 200, -Math.PI / 2, COL.ink, 12);
  b += lines(42, 222, ["各自的", "有效还原电位"], { size: 16, weight: "bold", fill: COL.text2, lh: 22 });
  b += text(340, 440, "示意：同一电解液里，不同物种在不同电位被还原 → 没有单一的“窗口”", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Butler–Volmer: barrier picture ----------
figs.bv_barrier = () => {
  const W = 620, H = 330;
  let b = "";
  const X0 = 50, X1 = 590;
  b += line(X0, 290, X1, 290, COL.ink, 2.5) + head(X1 + 10, 290, 0, COL.ink, 12);
  b += line(X0, 290, X0, 20, COL.ink, 2.5) + head(X0, 10, -Math.PI / 2, COL.ink, 12);
  b += text((X0 + X1) / 2, 318, "反应坐标：电解液分子 + e^{−} → 还原产物", { size: 17, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(${X0 - 22} 150) rotate(-90)">` + text(0, 0, "自由能", { size: 17, anchor: "middle", weight: "bold" }) + `</g>`;
  // grey: higher anode potential; red: anode potential lowered by dE (reactant raised by F dE, TS by (1-a) F dE)
  b += path("M70,220 C150,220 200,100 290,100 C380,100 420,265 570,265", COL.muted, 4, { dash: "8 6" });
  b += path("M70,160 C150,160 200,70 290,70 C380,70 420,265 570,265", COL.red, 5);
  b += line(430, 105, 470, 105, COL.red, 5) + text(480, 111, "负极电位降低 ΔE", { size: 16, weight: "bold", fill: COL.red });
  b += line(430, 140, 470, 140, COL.muted, 4, { dash: "8 6" }) + text(480, 146, "负极电位较高", { size: 16, weight: "bold", fill: COL.muted });
  b += arrow(250, 218, 250, 166, { color: COL.amber, width: 3, head: 11 });
  b += line(70, 220, 250, 220, COL.muted, 1.5, { dash: "4 4" });
  b += text(80, 262, "反应物能量升高 FΔE（橙色箭头）", { size: 16, weight: "bold", fill: COL.amber });
  b += text(150, 45, "过渡态只升 (1−α)FΔE → 能垒净降低 αFΔE", { size: 16, weight: "bold", fill: COL.red });
  b += text(560, 255, "产物", { size: 16, anchor: "end", weight: "bold", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Low vs high anode potential SEI (Fig. 5b insets) ----------
figs.sei_low_high = () => {
  const W = 680, H = 420;
  let b = "";
  b += rect(10, 10, 320, 300, "#FBEDEC", { rx: 14, stroke: COL.red, sw: 3 });
  b += rect(350, 10, 320, 300, "#E8F4F3", { rx: 14, stroke: COL.teal, sw: 3 });
  b += text(170, 44, "低负极电位", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(510, 44, "高负极电位", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  // low: thick heterogeneous
  b += rect(30, 230, 280, 60, COL.sulfurLight);
  b += `<path d="M30,230 Q70,150 120,210 Q170,110 230,200 Q270,160 310,230 Z" fill="${COL.ink}" opacity="0.85"/>`;
  b += mosaic(40, 175, 60, 20, 3, { dens: 60 });
  [[80, 250], [170, 250], [260, 250]].forEach(([x, y]) => (b += electron(x, y, 15) + arrow(x, y - 18, x, y - 52, { color: COL.amber, width: 2.5, head: 9 })));
  b += lines(170, 85, ["不均匀、局部过度生长", "开裂、剥离"], { size: 16, anchor: "middle", weight: "bold", fill: COL.red, lh: 22 });
  // high: thin uniform
  b += rect(370, 230, 280, 60, COL.sulfurLight);
  b += mosaic(370, 200, 280, 30, 5, { dens: 120 });
  b += lines(510, 85, ["均匀形成、负担小", "长期耐用"], { size: 16, anchor: "middle", weight: "bold", fill: COL.teal, lh: 22 });
  b += text(170, 350, "不稳定、厚的 SEI", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(510, 350, "稳定、薄的 SEI", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(340, 400, "据原文 Fig. 5b 中的两个示意框重绘", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- SEI–CEI seesaw ----------
figs.seesaw = () => {
  const W = 680, H = 400;
  let b = "";
  b += `<polygon points="340,300 300,370 380,370" fill="${COL.ink}"/>`;
  b += `<g transform="rotate(12 340 300)">` + rect(70, 288, 540, 18, COL.siDark, { rx: 9 }) + `</g>`;
  // left (SEI) up
  b += rect(80, 160, 170, 70, "#E8F4F3", { rx: 14, stroke: COL.teal, sw: 3 });
  b += lines(165, 188, ["SEI 受益", "还原驱动力 ↓"], { size: 17, anchor: "middle", weight: "bold", fill: COL.teal, lh: 24 });
  b += rect(440, 240, 170, 70, "#FBEDEC", { rx: 14, stroke: COL.red, sw: 3 });
  b += lines(525, 268, ["CEI 受累", "氧化驱动力 ↑"], { size: 17, anchor: "middle", weight: "bold", fill: COL.red, lh: 24 });
  b += rect(190, 20, 300, 70, COL.light, { rx: 14 });
  b += lines(340, 48, ["Li⁺ 去稳定（μ 升高）", "→ 两极电位一起上移"], { size: 17, anchor: "middle", weight: "bold", lh: 24 });
  b += arrow(340, 92, 340, 150, { color: COL.amber, width: 4, head: 14 });
  return svg(W, H, b);
};

module.exports = figs;
