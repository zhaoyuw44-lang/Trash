// Figures for Ko et al. 2026, Chapter 1 (Introduction). Canvas: ~96 px per slide inch.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;
const { rect, line, circle, ellipse, path, solvated, potAxis, card, mol, flow } = require("./figlib");

const figs = {};

// ---------- Title motif: solvated Li+ above a rising potential ladder ----------
figs.title_motif = () => {
  const W = 520, H = 620;
  let b = "";
  // ladder of levels (white), shifted up (amber)
  [0, 1, 2, 3].forEach((i) => {
    const y = 580 - i * 70;
    b += line(70, y, 250, y, "#5D6E7E", 6);
    b += line(290, y - 40, 470, y - 40, COL.amber, 6);
    b += arrow(255, y - 4, 285, y - 34, { color: COL.amberLight, width: 3, head: 11 });
  });
  b += solvated(260, 150, "AWAW", { r: 34, dist: 74, rx: 34, ry: 19 });
  b += `<circle cx="260" cy="150" r="118" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 10" opacity="0.6"/>`;
  return svg(W, H, b);
};

// ---------- Cell anatomy with the electrolyte as the stage ----------
figs.cell_role = () => {
  const W = 680, H = 470;
  let b = "";
  const top = 70, bot = 350;
  b += rect(40, top, 30, bot - top, COL.copper);
  b += rect(70, top, 110, bot - top, "#B9C3CC");
  b += rect(180, top, 14, bot - top, COL.sei);
  b += rect(194, top, 292, bot - top, COL.electrolyte);
  b += rect(486, top, 14, bot - top, COL.purpleLight);
  b += rect(500, top, 120, bot - top, COL.amberLight);
  b += rect(620, top, 30, bot - top, COL.alu);
  const R = rng(4);
  for (let i = 0; i < 6; i++) b += blob(560, top + 30 + i * 46, 22, 10 + i, { fill: COL.amber, jag: 0.12 });
  // solvated ions + anions
  b += solvated(270, 140, "SSSS", { r: 13, dist: 30, rx: 13, ry: 8 });
  b += solvated(410, 270, "SSAS", { r: 13, dist: 30, rx: 13, ry: 8 });
  b += solvated(300, 290, "AWAW", { r: 13, dist: 30, rx: 13, ry: 8 });
  b += ellipse(420, 140, 16, 10, COL.redLight, { stroke: COL.red });
  b += arrow(240, 205, 455, 205, { color: COL.purple, width: 3.5, head: 15, dash: "8 6" });
  b += arrow(455, 222, 240, 222, { color: COL.purple, width: 3.5, head: 15, dash: "8 6" });
  // labels
  b += text(125, 50, "负极 Anode", { size: 18, anchor: "middle", weight: "bold" });
  b += text(340, 50, "电解质 Electrolyte", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(560, 50, "正极 Cathode", { size: 18, anchor: "middle", weight: "bold" });
  b += text(187, 378, "SEI", { size: 17, anchor: "middle", weight: "bold", fill: COL.sei });
  b += text(493, 378, "CEI", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(125, 215, "Li / Si", { size: 17, anchor: "middle", weight: "bold" });
  b += text(125, 238, "石墨", { size: 16, anchor: "middle", fill: COL.text2 });
  // legend
  b += ion(60, 425, { r: 13 }) + text(80, 431, "Li⁺", { size: 16, weight: "bold" });
  b += ellipse(140, 425, 13, 8, COL.teal) + text(160, 431, "溶剂", { size: 16 });
  b += ellipse(225, 425, 13, 8, COL.redLight, { stroke: COL.red }) + text(245, 431, "阴离子", { size: 16 });
  b += text(330, 431, "双向虚线箭头 = 充放电时 Li⁺ 往返", { size: 16, fill: COL.purple });
  return svg(W, H, b);
};

// ---------- What is inside a liquid electrolyte ----------
figs.electrolyte_anatomy = () => {
  const W = 680, H = 470;
  let b = "";
  const cols = [
    { x: 20, t: "锂盐 Salt", c: COL.red, items: [["LiPF_{6}", "最常用"], ["LiFSI / LiTFSI", "酰亚胺盐"], ["LiBF_{4}", ""]] },
    { x: 240, t: "溶剂 Solvent", c: COL.teal, items: [["EC", "环状碳酸酯"], ["DMC / EMC", "线性碳酸酯"], ["DME 等醚", "醚类"]] },
    { x: 460, t: "稀释剂 / 添加剂", c: COL.purple, items: [["BTFE 等", "氟化醚稀释剂"], ["FEC / VC", "成膜添加剂"], ["TMP", "阻燃溶剂"]] },
  ];
  cols.forEach((c) => {
    b += rect(c.x, 20, 200, 330, "#FFFFFF", { rx: 14, stroke: c.c, sw: 2.5 });
    b += `<path d="M${c.x},34 a14,14 0 0 1 14,-14 h172 a14,14 0 0 1 14,14 v30 h-200 Z" fill="${c.c}"/>`;
    b += text(c.x + 100, 50, c.t, { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    c.items.forEach(([n, s], i) => {
      const y = 110 + i * 84;
      b += text(c.x + 100, y, n, { size: 19, anchor: "middle", weight: "bold" });
      if (s) b += text(c.x + 100, y + 26, s, { size: 16, anchor: "middle", fill: COL.text2 });
    });
  });
  b += rect(20, 372, 640, 82, COL.light, { rx: 14 });
  b += text(340, 405, "典型商用配方：1 M LiPF_{6} 溶于 EC/DMC（或 EC/EMC）", { size: 18, anchor: "middle", weight: "bold" });
  b += text(340, 436, "盐提供 Li⁺；溶剂把盐“拆开”并包住 Li⁺；添加剂负责成膜或阻燃", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Electrolyte history timeline ----------
figs.electrolyte_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1958", who: ["Harris"], what: ["Li 在 PC 中", "可以沉积"], color: COL.text2 },
    { year: "1979", who: ["Peled"], what: ["提出 SEI", "概念"], color: COL.text2 },
    { year: "1990", who: ["Fong, Dahn 等"], what: ["EC 在石墨", "上成膜"], color: COL.text2 },
    { year: "1991", who: ["Sony"], what: ["LiPF_{6}/碳酸酯", "锂电商业化"], color: COL.amber },
    { year: "1994", who: ["Tarascon 等"], what: ["EC/DMC", "经典配方"], color: COL.amber },
    { year: "2014", who: ["Yamada 等"], what: ["超浓", "电解液"], color: COL.purple },
    { year: "2018", who: ["Chen, Zhang 等"], what: ["局部高浓", "LHCE"], color: COL.purple },
    { year: "2022", who: ["Ko 等"], what: ["电极电位", "上移 >0.6 V"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 80, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Potential ladder: anodes and cathodes vs the electrolyte window ----------
figs.pot_ladder = () => {
  const W = 660, H = 520;
  let b = "";
  const yv = (v) => 470 - v * 88; // 0..4.8 V vs Li
  const ax = 100;
  // approximate carbonate stability band
  b += rect(ax, yv(4.3), 290, yv(1.0) - yv(4.3), COL.electrolyte);
  b += text(ax + 145, yv(2.75), "碳酸酯电解液", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(ax + 145, yv(2.75) + 26, "大致稳定区（≈1–4.3 V）", { size: 16, anchor: "middle", fill: "#3A7CA5" });
  b += line(ax, yv(0) + 10, ax, yv(4.9), COL.ink, 3);
  b += head(ax, yv(4.9) - 12, -Math.PI / 2, COL.ink, 14);
  for (let v = 0; v <= 4; v++) {
    b += line(ax - 8, yv(v), ax, yv(v), COL.ink, 2);
    b += text(ax - 14, yv(v) + 6, `${v} V`, { size: 16, anchor: "end", fill: COL.text2 });
  }
  b += text(ax - 40, yv(4.9) - 16, "电位 vs Li^{+}/Li", { size: 16, anchor: "start", weight: "bold", fill: COL.text2 });
  const it = [
    { v: 0.0, t: "Li 金属 0 V", c: COL.purple, dy: 18 },
    { v: 0.1, t: "石墨 ≈0.1 V", c: COL.ink, dy: 0 },
    { v: 0.4, t: "Si ≈0.4 V", c: COL.siDark, dy: -12 },
    { v: 3.9, t: "LiCoO_{2} ≈3.9 V", c: COL.amber, dy: 16 },
    { v: 4.0, t: "高镍层状 ≈4.0 V", c: COL.red, dy: -8 },
    { v: 4.7, t: "LiNi_{0.5}Mn_{1.5}O_{4} ≈4.7 V", c: COL.teal, dy: 0 },
  ];
  it.forEach((e) => {
    b += line(ax, yv(e.v), ax + 290, yv(e.v), e.c, 4.5);
    b += text(ax + 300, yv(e.v) + 6 + e.dy, e.t, { size: 17, fill: e.c, weight: "bold" });
  });
  b += text(ax + 145, yv(0.75) + 4, "↓ 负极低于窗口：电解液被还原", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(ax + 145, yv(4.45) + 4, "↑ 正极高于窗口：电解液被氧化", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Fig. 1 redrawn: degradation landscape ----------
figs.fig1_overview = () => {
  const W = 1180, H = 430;
  let b = "";
  const top = 30, bot = 380;
  // anode side
  b += rect(20, top, 40, bot - top, COL.redLight);
  b += text(40, bot + 30, "Cu", { size: 17, anchor: "middle", weight: "bold" });
  b += rect(60, top, 70, bot - top, COL.sulfurLight);
  b += text(95, bot + 30, "Li", { size: 17, anchor: "middle", weight: "bold" });
  // dendrite
  b += path("M130,140 C170,135 190,150 230,140 C250,135 262,128 280,132", COL.sulfur, 12);
  b += path("M200,146 C210,120 225,112 240,110", COL.sulfur, 9);
  b += text(250, 168, "枝晶", { size: 17, weight: "bold" });
  // SEI bumps (resistive interphase)
  for (let y = 50; y < 110; y += 14) b += circle(134, y, 6, COL.red, { opacity: 0.85 });
  b += line(150, 70, 230, 70, COL.purple, 2.5) + cross(190, 70, 9);
  b += text(240, 64, "高阻界面挡住 Li⁺", { size: 16, weight: "bold", fill: COL.red });
  // dead Li
  b += blob(175, 205, 20, 3, { fill: COL.sulfurLight, stroke: COL.sulfur, sw: 2.5 });
  b += text(205, 212, "死锂", { size: 17, weight: "bold" });
  // gas
  [[160, 285], [178, 300], [150, 310], [190, 280]].forEach(([x, y]) => (b += circle(x, y, 7, "#9CC9E0", { stroke: "#3A7CA5", sw: 1.5 })));
  b += text(205, 300, "产气、产酸", { size: 16, weight: "bold" });
  b += text(140, 355, "电解液还原、Li 腐蚀", { size: 16, weight: "bold", fill: COL.red });
  b += rect(150, 236, 150, 34, "#D6ECF8", { rx: 8 });
  b += text(225, 259, "负极/电解质界面", { size: 15, anchor: "middle", weight: "bold", fill: "#1B5E86" });
  // cathode side
  b += rect(1120, top, 40, bot - top, COL.alu);
  b += text(1140, bot + 30, "Al", { size: 17, anchor: "middle", weight: "bold" });
  for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) b += blob(1080 - j * 46, 55 + i * 47 + j * 20, 22, 30 + i * 2 + j, { fill: COL.alu, stroke: COL.siDark, sw: 2, jag: 0.1 });
  for (let i = 0; i < 18; i++) b += circle(1010 + (i % 3) * 30, 50 + i * 18, 4.5, COL.ink);
  b += rect(830, 160, 160, 34, COL.redLight, { rx: 8 });
  b += text(910, 183, "正极/电解质界面", { size: 15, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(990, 70, "产气、产酸 · 电解液氧化", { size: 16, anchor: "end", weight: "bold" });
  b += text(990, 250, "阴离子嵌入导电碳", { size: 16, anchor: "end", weight: "bold" });
  b += text(990, 300, "催化加速氧化", { size: 16, anchor: "end", weight: "bold" });
  b += text(1105, 410, "Al 集流体腐蚀 →", { size: 16, anchor: "end", weight: "bold", fill: COL.red });
  // electrolyte species in the middle
  b += solvated(470, 300, "SSSS", { r: 14, dist: 32, rx: 14, ry: 9 });
  b += solvated(640, 230, "SSAS", { r: 14, dist: 32, rx: 14, ry: 9 });
  b += ion(560, 110, { r: 18, fill: COL.red, label: "M" });
  b += text(560, 75, "过渡金属离子 TM^{n+} 溶出", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  // crosstalk arrows
  b += arrow(830, 110, 590, 110, { color: COL.ink, width: 3, head: 13 });
  b += arrow(530, 110, 300, 110, { color: COL.ink, width: 3, head: 13, dash: "8 6" });
  b += path("M820,215 C700,260 520,170 330,290", COL.ink, 3, { dash: "8 6" });
  b += head(330, 290, Math.PI * 0.82, COL.ink, 13);
  b += text(700, 330, "串扰 Crosstalk：一极的产物跑到另一极继续反应", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

// ---------- Anode zoom ----------
figs.anode_zoom = () => {
  const W = 660, H = 430;
  let b = "";
  b += rect(20, 40, 160, 330, "#B9C3CC");
  b += text(100, 400, "Li 金属 / Si", { size: 17, anchor: "middle", weight: "bold" });
  b += rect(180, 40, 22, 330, COL.sei);
  b += rect(202, 40, 440, 330, COL.electrolyte);
  // electrons pushed into electrolyte
  b += electron(150, 110, 15);
  b += arrow(165, 110, 300, 110, { color: COL.amber, width: 3, head: 13 });
  b += ellipse(330, 110, 22, 13, COL.teal);
  b += text(360, 116, "溶剂/阴离子得到电子 → 被还原", { size: 16, weight: "bold" });
  // dendrite
  b += path("M202,215 L260,205 L300,215 L340,200", "#8F9BA6", 10);
  b += path("M270,207 L285,180", "#8F9BA6", 7);
  b += text(360, 212, "不均匀沉积 → 枝晶、死锂", { size: 16, weight: "bold" });
  // gas
  [[250, 300], [272, 320], [240, 330]].forEach(([x, y]) => (b += circle(x, y, 9, "#FFFFFF", { stroke: "#3A7CA5", sw: 2 })));
  b += text(300, 318, "产气（H_{2}、C_{2}H_{4} 等）与酸", { size: 16, weight: "bold" });
  b += text(330, 30, "负极电位很低 = 电子能量很高", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- Cathode zoom ----------
figs.cathode_zoom = () => {
  const W = 660, H = 430;
  let b = "";
  b += rect(20, 40, 440, 330, COL.electrolyte);
  b += rect(460, 40, 22, 330, COL.purpleLight);
  b += rect(482, 40, 120, 330, COL.amberLight);
  b += rect(602, 40, 38, 330, COL.alu);
  b += text(541, 400, "高电位正极", { size: 17, anchor: "middle", weight: "bold" });
  b += text(621, 400, "Al", { size: 17, anchor: "middle", weight: "bold" });
  // electron pulled out of electrolyte
  b += ellipse(150, 100, 22, 13, COL.teal);
  b += arrow(180, 100, 470, 100, { color: COL.amber, width: 3, head: 13 });
  b += electron(320, 100, 15);
  b += text(40, 145, "电解液被夺走电子 → 被氧化", { size: 16, weight: "bold" });
  // TM dissolution
  b += ion(390, 220, { r: 16, fill: COL.red, label: "M" });
  b += arrow(470, 220, 415, 220, { color: COL.red, width: 3, head: 12 });
  b += text(40, 226, "过渡金属溶出 → 游向负极", { size: 16, weight: "bold", fill: COL.red });
  // anion into carbon
  b += ellipse(390, 315, 16, 10, COL.redLight, { stroke: COL.red });
  b += arrow(410, 315, 470, 315, { color: COL.red, width: 3, head: 12 });
  b += text(40, 321, "阴离子嵌入导电碳、腐蚀 Al", { size: 16, weight: "bold" });
  b += text(330, 30, "正极电位很高 = 能“吸走”电子", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- Empirical screening vs energetics framework ----------
figs.empirical_vs_framework = () => {
  const W = 1180, H = 400;
  let b = "";
  // left: trial-and-error loop
  b += text(260, 30, "以前：经验筛选", { size: 21, anchor: "middle", weight: "bold", fill: COL.muted });
  const cx = 260, cy = 210, r = 120;
  b += circle(cx, cy, r, "none", { stroke: COL.line, sw: 3 });
  const st = ["换配方", "装电池测试", "看循环寿命", "再改一点"];
  st.forEach((s, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    b += rect(x - 78, y - 24, 156, 48, "#F5F7F9", { rx: 24, stroke: COL.line });
    b += text(x, y + 6, s, { size: 18, anchor: "middle", weight: "bold", fill: COL.text2 });
    const a2 = a + Math.PI / 4;
    b += head(cx + (r - 6) * Math.cos(a2), cy + (r - 6) * Math.sin(a2), a2 + Math.PI / 2, COL.muted, 14);
  });
  b += text(cx, cy + 6, "单一指标", { size: 17, anchor: "middle", fill: COL.red, weight: "bold" });
  b += arrow(470, 210, 560, 210, { color: COL.ink, width: 4, head: 18 });
  // right: framework
  b += text(870, 30, "本综述：能量学框架", { size: 21, anchor: "middle", weight: "bold", fill: COL.teal });
  const items = [
    ["溶剂化结构", COL.teal], ["Li⁺ 化学势 μ", COL.purple], ["电极电位 E", COL.amber], ["分解驱动力", COL.red], ["界面相 SEI/CEI", COL.sei],
  ];
  items.forEach(([t, c], i) => {
    const y = 60 + i * 64;
    b += rect(620, y, 270, 48, "#FFFFFF", { rx: 12, stroke: c, sw: 3 });
    b += text(755, y + 31, t, { size: 18, anchor: "middle", weight: "bold", fill: c });
    if (i < 4) b += arrow(755, y + 50, 755, y + 62, { color: COL.muted, width: 2.5, head: 9 });
  });
  b += lines(1030, 160, ["+ 离子传输", "+ 安全", "一起考虑"], { size: 18, anchor: "middle", weight: "bold", fill: COL.text2, lh: 30 });
  b += path("M900,84 C960,90 980,140 990,150", COL.muted, 2.5, { dash: "6 5" });
  b += path("M900,340 C960,330 980,250 990,240", COL.muted, 2.5, { dash: "6 5" });
  return svg(W, H, b);
};

// ---------- The review's causal chain (mu -> potentials -> interphases) ----------
figs.mu_chain = () => {
  const W = 700, H = 470;
  let b = "";
  // left: two solvation shells
  b += solvated(110, 120, "SSSS", { r: 18, dist: 42, rx: 18, ry: 11 });
  b += text(110, 205, "强配位：Li⁺ 舒服", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += solvated(110, 330, "AWAW", { r: 18, dist: 42, rx: 18, ry: 11 });
  b += text(110, 415, "弱配位：Li⁺ 不舒服", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  // middle: mu levels
  b += line(270, 300, 380, 300, COL.teal, 6) + text(325, 330, "μ_{Li⁺} 低", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += line(270, 170, 380, 170, COL.red, 6) + text(325, 155, "μ_{Li⁺} 高", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += arrow(325, 290, 325, 182, { color: COL.amber, width: 4, head: 15 });
  b += arrow(190, 120, 262, 290, { color: COL.muted, width: 2, head: 10, dash: "5 5" });
  b += arrow(190, 330, 262, 175, { color: COL.muted, width: 2, head: 10, dash: "5 5" });
  // right: E = mu / F and consequences
  b += rect(420, 120, 250, 64, "#FDF2E7", { rx: 12 });
  b += text(545, 162, "E_{Li⁺/Li} = μ_{Li⁺} / F", { size: 22, anchor: "middle", weight: "bold", fill: COL.amber });
  b += arrow(545, 190, 545, 230, { color: COL.muted, width: 3, head: 12 });
  b += lines(545, 260, ["正、负极电位一起上移", "→ 负极：还原变弱，SEI 更稳", "→ 正极：氧化变强，CEI 更难"], { size: 16, anchor: "middle", weight: "bold", lh: 30 });
  b += text(545, 385, "电池电压不变，所以常被忽视", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Four requirements of an electrolyte ----------
figs.four_tasks = () => {
  const W = 680, H = 480;
  let b = "";
  const cx = 340, cy = 240;
  const q = [
    { x: 20, y: 20, t: "稳定性", s: ["化学 + 电化学", "不在电极上乱分解"], c: COL.purple },
    { x: 400, y: 20, t: "界面相", s: ["SEI/CEI 好形成", "而且长期耐用"], c: COL.sei },
    { x: 20, y: 280, t: "离子传输", s: ["Li⁺ 跑得快", "能快充、高功率"], c: COL.teal },
    { x: 400, y: 280, t: "安全", s: ["不燃、少产气", "不引发热失控"], c: COL.red },
  ];
  b += path(`M${cx - 150},${cy - 70} L${cx + 150},${cy + 70}`, COL.muted, 2.5, { dash: "7 6" });
  b += path(`M${cx + 150},${cy - 70} L${cx - 150},${cy + 70}`, COL.muted, 2.5, { dash: "7 6" });
  q.forEach((k) => (b += card(k.x, k.y + (k.y > 100 ? 20 : 20), 260, 130, k.t, k.s, k.c, { bs: 18 })));
  b += circle(cx, cy, 62, COL.electrolyte, { stroke: "#3A7CA5", sw: 3 });
  b += lines(cx, cy - 4, ["电解质", "设计"], { size: 19, anchor: "middle", weight: "bold", fill: "#1B5E86", lh: 26 });
  b += text(cx, 470, "虚线：这些目标常常互相“打架”", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Safety incidents timeline ----------
figs.safety_timeline = () => {
  const W = 700, H = 360;
  const ev = [
    { year: "1989", who: ["Moli Energy"], what: ["锂金属电池", "起火召回"], color: COL.red },
    { year: "2006", who: ["笔记本电池"], what: ["大规模", "召回"], color: COL.red },
    { year: "2013", who: ["波音 787"], what: ["电池起火", "全球停飞"], color: COL.red },
    { year: "2016", who: ["Galaxy Note 7"], what: ["起火", "全面召回"], color: COL.red },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 175, left: 90, right: 590, whoSize: 18, whatSize: 17, yearSize: 26 }));
};

// ---------- Chapter map: paper sections -> our 5 chapters ----------
figs.chapter_map = () => {
  const W = 1180, H = 450;
  let b = "";
  const secs = [
    ["Introduction", 1], ["Large shifts in electrode potentials", 2], ["Computational prediction", 3],
    ["Conceptual evolution of interphases", 4], ["Interphase dynamics", 4], ["Dependence of interphase stability on E", 4],
    ["Rational interphase design", 5], ["Challenges and opportunities", 5], ["Conclusion", 5],
  ];
  const chs = [
    [1, "引言：电解质不只是传导离子", COL.text2, "Fig. 1"],
    [2, "电极电位的大幅移动", COL.purple, "Fig. 2 · 式 (1)"],
    [3, "计算预测", COL.purple, "Fig. 3"],
    [4, "界面相：概念演变与动力学", COL.sei, "Fig. 4–5b · 式 (2)"],
    [5, "理性界面设计、挑战与结论", COL.teal, "Fig. 5c–6"],
  ];
  const chY = (n) => 30 + (n - 1) * 84;
  secs.forEach(([t, n], i) => {
    const y = 18 + i * 46;
    b += rect(20, y, 410, 38, "#F5F7F9", { rx: 10 });
    b += text(36, y + 25, t, { size: 16, fill: COL.ink });
    const c = chs[n - 1][2];
    b += path(`M432,${y + 19} C520,${y + 19} 540,${chY(n) + 34} 610,${chY(n) + 34}`, c, 2.5);
    b += head(616, chY(n) + 34, 0, c, 11);
  });
  chs.forEach(([n, t, c, f]) => {
    const y = chY(n);
    b += rect(620, y, 540, 68, "#FFFFFF", { rx: 14, stroke: c, sw: 3 });
    b += circle(655, y + 34, 20, c);
    b += text(655, y + 41, String(n), { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += text(690, y + 30, t, { size: 19, weight: "bold", fill: COL.ink });
    b += text(690, y + 56, f, { size: 15, fill: COL.text2 });
  });
  b += text(225, 445, "原文小节（左）→ 本套幻灯片章节（右）", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

module.exports = figs;
