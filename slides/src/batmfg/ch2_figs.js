// Figures for 锂电池制造 Chapter 2: 电极制备 I——从粉末到浆料，再到涂层
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, electron, blob, rng } = L;

const figs = {};
const AM = COL.siDark;        // active material (oxide)
const GR = "#4A5866";         // graphite (text2 tone)
const CB = COL.ink;           // carbon black
const BIND = COL.teal;        // binder
const LIQ = COL.electrolyte;  // solvent / electrolyte
const AL = COL.alu;
const CU = COL.copper;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const path = (d, stroke, w = 3, fill = "none", o = {}) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;

// Active-material particle: filled circle with a light highlight.
const particle = (cx, cy, r, fill = AM) =>
  circ(cx, cy, r, fill) + circ(cx - r * 0.32, cy - r * 0.32, r * 0.22, "#FFFFFF", { opacity: 0.28 });

// Carbon-binder bridge between two circles (surface to surface).
function bridge(a, b, o = {}) {
  const [x1, y1, r1] = a, [x2, y2, r2] = b;
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  const ux = dx / d, uy = dy / d;
  const sx = x1 + ux * (r1 - 4), sy = y1 + uy * (r1 - 4);
  const ex = x2 - ux * (r2 - 4), ey = y2 - uy * (r2 - 4);
  let s = "";
  if (o.binder !== false) s += line(sx.toFixed(1), sy.toFixed(1), ex.toFixed(1), ey.toFixed(1), BIND, o.bw || 7);
  if (o.carbon !== false) {
    const n = o.n || 3;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      s += circ((sx + (ex - sx) * t).toFixed(1), (sy + (ey - sy) * t).toFixed(1), o.cr || 6, CB);
    }
  }
  return s;
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  // powders
  b += blob(85, 95, 46, 3, { fill: "#8D9AA6" }) + blob(205, 100, 38, 7, { fill: "#2B3D4F", stroke: "#9FB0C0", sw: 2 }) + blob(320, 98, 40, 11, { fill: COL.tealLight });
  b += text(85, 172, "活性物质", { size: 20, anchor: "middle", fill: "#CADCE8" });
  b += text(205, 172, "炭黑", { size: 20, anchor: "middle", fill: "#CADCE8" });
  b += text(320, 172, "粘结剂", { size: 20, anchor: "middle", fill: "#CADCE8" });
  b += arrow(205, 190, 205, 228, { color: "#F6C58E", width: 4, head: 14 });
  // beaker with slurry
  b += path("M130,240 L130,345 Q130,362 147,362 L263,362 Q280,362 280,345 L280,240", "#CADCE8", 4);
  b += `<path d="M133,280 L277,280 L277,345 Q277,359 263,359 L147,359 Q133,359 133,345 Z" fill="#56636F"/>`;
  const R = rng(5);
  for (let i = 0; i < 16; i++) b += circ((145 + R() * 120).toFixed(0), (292 + R() * 58).toFixed(0), 4 + R() * 5, i % 3 ? "#AEB8C2" : "#1D2B3A");
  b += line(205, 222, 205, 320, "#F6C58E", 4) + rect(180, 316, 50, 10, "#F6C58E", { rx: 3 });
  b += text(330, 320, "浆料", { size: 22, weight: "bold", fill: "#FFFFFF" });
  b += arrow(205, 378, 205, 414, { color: "#F6C58E", width: 4, head: 14 });
  // coated foil
  b += rect(40, 470, 350, 12, "#AEB8C2", { rx: 2 });
  b += `<path d="M40,470 L260,470 L260,446 Q270,446 276,452 L290,470" fill="#56636F"/>`;
  b += rect(250, 418, 40, 34, "#F6C58E", { rx: 4 });
  b += arrow(300, 432, 370, 432, { color: "#F6C58E", width: 3, head: 12 });
  b += text(215, 520, "涂层 / 集流体", { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  return svg(W, H, b);
};

// ---------- 1. History timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const A = COL.amber, T = COL.teal, P = COL.purple, Rd = COL.red;
  const ev = [
    { year: "1866", who: ["Leclanché"], what: ["MnO_{2} 掺碳粉", "复合电极雏形"], color: A },
    { year: "1881", who: ["Faure"], what: ["铅膏涂在板栅上", "“涂膏”电极"], color: A },
    { year: "1920", who: ["Bingham"], what: ["造出“流变学”", "rheology 一词"], color: P },
    { year: "1947", who: ["Howatt 等"], what: ["刮刀流延", "陶瓷薄片"], color: T },
    { year: "1950s", who: ["胶片、磁带业"], what: ["精密狭缝", "与挤压涂布"], color: T },
    { year: "1976", who: ["Whittingham"], what: ["TiS_{2} + 10%", "Teflon 压成电极"], color: A },
    { year: "1991", who: ["Sony"], what: ["PVDF/NMP 浆料", "卷对卷涂布"], color: A },
    { year: "2000s", who: ["电池厂"], what: ["石墨负极转向", "CMC/SBR 水系"], color: A },
    { year: "2018", who: ["欧盟 REACH"], what: ["限制 NMP", "2020 年生效"], color: Rd },
  ];
  let b = timeline(W, H, ev, { axisY: 200, left: 80, right: 1130, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(600, 392, 140, 30, A, "配方与材料", { size: 17 }) + pill(755, 392, 140, 30, T, "涂布工艺", { size: 17 });
  b += pill(910, 392, 140, 30, P, "流变理论", { size: 17 }) + pill(1065, 392, 140, 30, Rd, "法规", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Electrode cross-section (after Li 2022 Fig. 1) ----------
const CROSS_P = [
  [85, 380, 45], [190, 380, 50], [300, 382, 42], [400, 380, 48], [500, 384, 40],
  [130, 280, 44], [245, 280, 40], [350, 280, 47], [460, 280, 43],
  [80, 185, 40], [185, 185, 46], [300, 185, 42], [410, 185, 45], [515, 187, 38],
];
const CROSS_PAIRS = [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [9, 10], [10, 11], [11, 12], [12, 13],
  [0, 5], [1, 5], [1, 6], [2, 7], [3, 7], [3, 8], [4, 8], [9, 5], [10, 6], [11, 7], [12, 8], [13, 8]];
figs.electrode_cross = () => {
  const W = 820, H = 540;
  let b = "";
  b += rect(30, 130, 530, 302, LIQ, { rx: 6 });
  CROSS_PAIRS.forEach(([i, j], k) => { b += bridge(CROSS_P[i], CROSS_P[j], { carbon: k % 4 !== 3 }); });
  // bridges to foil
  [0, 1, 2, 3, 4].forEach((i) => {
    const [x, y, r] = CROSS_P[i];
    b += line(x, y + r - 4, x, 433, BIND, 7) + circ(x, y + r + 6, 5, CB);
  });
  CROSS_P.forEach(([x, y, r]) => { b += particle(x, y, r); });
  b += rect(30, 432, 530, 22, AL, { rx: 3 });
  // electron path: particle 7 -> 3 -> foil
  b += arrow(398, 374, 360, 334, { color: COL.amber, width: 4, head: 13, dash: "8 6" });
  b += arrow(420, 478, 420, 436, { color: COL.amber, width: 4, head: 13 });
  b += electron(445, 486, 13);
  // ion path through pore
  b += ion(298, 92, { r: 15, fill: COL.purple, label: "+" }) + text(320, 99, "Li^{+}", { size: 20, fill: COL.purple, weight: "bold" });
  b += path("M298,112 Q300,150 300,232 Q300,250 296,268 Q290,330 345,335", COL.purple, 4, "none", { dash: "8 6" });
  b += text(30, 112, "电解液一侧（隔膜方向）", { size: 19, fill: COL.text2 });
  // labels
  const lab = [
    [CROSS_P[13], 590, 175, "活性物质", "存放锂，占 90% 以上", AM],
    [[548, 236, 0], 590, 262, "导电炭黑", "铺出电子通路", CB],
    [[536, 330, 0], 590, 340, "粘结剂", "粘颗粒、粘箔", BIND],
    [[545, 410, 0], 590, 410, "孔隙", "灌电解液，走 Li^{+}", "#3D8FB8"],
    [[560, 443, 0], 590, 488, "集流体（铝箔）", "把电子引出去", COL.siDark],
  ];
  lab.forEach(([[px, py, pr], x, y, h, d, c]) => {
    b += line(px + (pr ? pr * 0.7 : 0), py, x - 8, y - 8, COL.muted, 1.5);
    b += text(x, y - 2, h, { size: 21, weight: "bold", fill: c });
    b += text(x, y + 25, d, { size: 19, fill: COL.text2 });
  });
  b += circ(548, 236, 6, CB) + line(536, 330, 552, 330, BIND, 7);
  b += text(30, 520, "放电时：电子从箔进来（橙），Li^{+} 从孔进来（紫）", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 3. Conduction paths (after Li 2022 Fig. 3) ----------
figs.conductive_paths = () => {
  const W = 820, H = 540;
  let b = "";
  const P = [[90, 110, 50], [210, 95, 46], [320, 120, 44], [100, 230, 46], [215, 225, 48], [320, 240, 42], [140, 345, 48], [265, 340, 46]];
  const panel = (ox, cnt) => {
    let s = rect(ox, 30, 380, 380, COL.light, { rx: 14 });
    // carbon black dots: scattered, short chains
    const R = rng(cnt ? 21 : 9);
    const pairs = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [3, 6], [6, 7], [4, 7], [2, 5], [1, 4]];
    pairs.forEach(([i, j], k) => {
      const [x1, y1] = P[i], [x2, y2] = P[j];
      const n = 3;
      for (let q = 1; q <= n; q++) {
        if (!cnt && k % 3 === 2 && q === 2) continue; // broken chain
        const t = q / (n + 1);
        s += circ((ox + x1 + (x2 - x1) * t + (R() - 0.5) * 8).toFixed(1), (y1 + 30 + (y2 - y1) * t + (R() - 0.5) * 8).toFixed(1), 6, CB);
      }
    });
    if (cnt) {
      const tubes = [
        `M${ox + 40},${70} Q${ox + 160},${150} ${ox + 300},${110} T${ox + 360},${200}`,
        `M${ox + 30},${300} Q${ox + 160},${250} ${ox + 250},${300} T${ox + 360},${330}`,
        `M${ox + 70},${380} Q${ox + 120},${230} ${ox + 230},${190} T${ox + 340},${70}`,
      ];
      tubes.forEach((d) => { s += path(d, CB, 3.5); });
    }
    P.forEach(([x, y, r]) => { s += particle(ox + x, y + 30, r); });
    return s;
  };
  b += panel(20, false) + panel(420, true);
  b += text(210, 448, "只用炭黑", { size: 22, anchor: "middle", weight: "bold" });
  b += text(210, 478, "点对点接触，链一断就不通", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(610, 448, "炭黑 + 碳纳米管 (CNT)", { size: 22, anchor: "middle", weight: "bold" });
  b += text(610, 478, "长“电线”跨过多个颗粒", { size: 19, anchor: "middle", fill: COL.text2 });
  b += cross(255, 252, 10, COL.red, 4);
  b += circ(40, 520, 7, CB) + text(55, 527, "炭黑颗粒 (~0.04 µm)", { size: 19, fill: COL.text2 });
  b += line(330, 520, 380, 520, CB, 3.5) + text(390, 527, "碳纳米管", { size: 19, fill: COL.text2 });
  b += circ(560, 520, 11, AM) + text(580, 527, "活性物质 (~10 µm)", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 4. Binder role: adhesion & cohesion + lineage ----------
figs.binder_role = () => {
  const W = 820, H = 540;
  let b = "";
  b += rect(40, 40, 740, 270, COL.light, { rx: 14 });
  const P = [[190, 184, 62], [360, 168, 58], [530, 190, 64]];
  b += bridge(P[0], P[1], { bw: 10, n: 2 }) + bridge(P[1], P[2], { bw: 10, n: 2 });
  b += line(190, 244, 190, 268, BIND, 10) + line(530, 252, 530, 268, BIND, 10);
  P.forEach(([x, y, r]) => { b += particle(x, y, r); });
  b += rect(80, 268, 660, 22, AL, { rx: 3 });
  b += text(275, 70, "内聚 cohesion", { size: 21, weight: "bold", fill: BIND, anchor: "middle" });
  b += text(275, 96, "颗粒 ↔ 颗粒", { size: 19, fill: COL.text2, anchor: "middle" });
  b += text(680, 70, "附着 adhesion", { size: 21, weight: "bold", fill: BIND, anchor: "middle" });
  b += text(680, 96, "涂层 ↔ 箔", { size: 19, fill: COL.text2, anchor: "middle" });
  b += line(660, 106, 560, 262, COL.muted, 1.5);
  b += text(410, 302, "集流体", { size: 19, fill: COL.text2, anchor: "middle" });
  // lineage of binders
  b += text(40, 362, "电池粘结剂的“家谱”", { size: 21, weight: "bold" });
  const steps = [
    ["PTFE", "1938 发现", "1976 TiS_{2} 电极", COL.muted],
    ["PVDF", "1991 Sony", "正极标准至今", COL.amber],
    ["CMC + SBR", "2000s 起", "石墨负极 · 水", COL.teal],
    ["PAA 等", "研究中", "硅负极、水系正极", COL.purple],
  ];
  steps.forEach(([h, a, c, col], i) => {
    const x = 40 + i * 190;
    b += rect(x, 380, 170, 130, "#FFFFFF", { rx: 12, stroke: col, sw: 3 });
    b += text(x + 85, 418, h, { size: 22, weight: "bold", anchor: "middle", fill: col });
    b += text(x + 85, 452, a, { size: 19, anchor: "middle", fill: COL.ink });
    b += text(x + 85, 482, c, { size: 19, anchor: "middle", fill: COL.text2 });
    if (i < 3) b += arrow(x + 172, 445, x + 188, 445, { color: COL.muted, width: 3, head: 10 });
  });
  return svg(W, H, b);
};

// ---------- 5. Two binder–solvent systems ----------
figs.binder_systems = () => {
  const W = 1240, H = 380;
  let b = "";
  const card = (x, col, tint, title, foil, foilCol, rows) => {
    let s = rect(x, 10, 420, 360, tint, { rx: 16 });
    s += rect(x, 10, 420, 56, col, { rx: 16 }) + rect(x, 48, 420, 18, col);
    s += text(x + 210, 48, title, { size: 24, weight: "bold", anchor: "middle", fill: "#FFFFFF" });
    rows.forEach(([k, v], i) => {
      const y = 100 + i * 58;
      s += text(x + 22, y, k, { size: 20, weight: "bold", fill: col });
      s += text(x + 22, y + 27, v, { size: 19, fill: COL.ink });
    });
    s += text(x + 210, 334, foil, { size: 18, anchor: "middle", fill: COL.text2 });
    s += rect(x + 22, 342, 376, 16, foilCol, { rx: 3 });
    return s;
  };
  b += card(10, COL.amber, "#FDF2E7", "正极：PVDF / NMP", "集流体：铝箔", AL, [
    ["粘结剂 PVDF", "0–5 V 都稳定，粘铝、粘铜都行"],
    ["溶剂 NMP", "溶得开 PVDF，但有毒、贵，要回收"],
    ["为什么还在用", "高镍正极怕水；水会腐蚀铝箔"],
    ["典型用户", "NMC、NCA、LCO 等氧化物正极"],
  ]);
  b += card(810, COL.teal, "#E8F4F3", "负极：CMC + SBR / 水", "集流体：铜箔", CU, [
    ["CMC（纤维素衍生物）", "增稠、帮颗粒分散、粘铜箔"],
    ["SBR（丁苯橡胶乳液）", "提供弹性，电极不脆"],
    ["为什么能用水", "石墨不怕水，铜箔不被腐蚀"],
    ["典型用户", "石墨负极（工业主流）"],
  ]);
  const x0 = 450;
  b += rect(x0, 10, 340, 360, COL.light, { rx: 16 });
  b += text(x0 + 170, 46, "两种溶剂比一比", { size: 22, weight: "bold", anchor: "middle" });
  b += text(x0 + 205, 82, "NMP", { size: 20, weight: "bold", anchor: "middle", fill: COL.amber });
  b += text(x0 + 290, 82, "水", { size: 20, weight: "bold", anchor: "middle", fill: COL.teal });
  const rows = [
    ["沸点 °C", "204", "100"],
    ["汽化热 kJ/kg", "510", "2260"],
    ["蒸气压 Pa", "133", "7373"],
    ["表面张力 mN/m", "40.8", "72.8"],
    ["相对价格", "50–150", "1"],
  ];
  rows.forEach(([k, a, w], i) => {
    const y = 122 + i * 48;
    b += line(x0 + 16, y - 29, x0 + 324, y - 29, COL.line, 1.5);
    b += text(x0 + 18, y, k, { size: 17, fill: COL.text2 });
    b += text(x0 + 205, y, a, { size: 20, weight: "bold", anchor: "middle", fill: COL.ink });
    b += text(x0 + 290, y, w, { size: 20, weight: "bold", anchor: "middle", fill: COL.ink });
  });
  b += text(x0 + 170, 356, "数据：Li 等 2022, p. 913、937、938", { size: 17, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 6. Agglomerates & sedimentation ----------
figs.agglomerate = () => {
  const W = 820, H = 540;
  let b = "";
  // left: agglomerate
  b += rect(20, 20, 360, 250, COL.light, { rx: 14 });
  const R = rng(17);
  b += circ(200, 140, 82, "#DDE3E8");
  for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI * 2, rr = R() * 70;
    b += circ((200 + rr * Math.cos(a)).toFixed(0), (140 + rr * Math.sin(a)).toFixed(0), 9, CB);
  }
  b += particle(165, 120, 26) + particle(232, 160, 24);
  b += circ(205, 105, 8, "#FFFFFF") + circ(178, 175, 6, "#FFFFFF");
  b += text(200, 255, "团聚体：炭黑抱团，裹着空气", { size: 19, anchor: "middle", fill: COL.text2 });
  b += arrow(390, 140, 440, 140, { color: COL.amber, width: 5, head: 16 });
  b += text(415, 120, "剪切", { size: 19, anchor: "middle", fill: COL.amber, weight: "bold" });
  // right: dispersed
  b += rect(450, 20, 350, 250, "#DDEFF8", { rx: 14 });
  const R2 = rng(4);
  for (let i = 0; i < 26; i++) b += circ((470 + R2() * 310).toFixed(0), (40 + R2() * 200).toFixed(0), 7, CB);
  b += particle(540, 110, 26) + particle(700, 170, 24) + particle(620, 200, 22);
  b += text(625, 255, "分散好：各自散开，被液体包住", { size: 19, anchor: "middle", fill: COL.text2 });
  // bottom: sedimentation tubes
  const tube = (x, lowVisc) => {
    let s = path(`M${x},300 L${x},470 Q${x},500 ${x + 30},500 L${x + 70},500 Q${x + 100},500 ${x + 100},470 L${x + 100},300`, COL.muted, 3);
    s += `<path d="M${x + 3},320 L${x + 97},320 L${x + 97},470 Q${x + 97},497 ${x + 70},497 L${x + 30},497 Q${x + 3},497 ${x + 3},470 Z" fill="${lowVisc ? "#DDEFF8" : "#C9D8E2"}"/>`;
    const RR = rng(lowVisc ? 2 : 8);
    for (let i = 0; i < 9; i++) {
      const px = x + 18 + RR() * 64;
      const py = lowVisc ? 462 + RR() * 22 : 340 + RR() * 130;
      s += circ(px.toFixed(0), py.toFixed(0), 9, AM);
    }
    return s;
  };
  b += tube(60, true) + tube(250, false);
  b += text(110, 530, "太稀：沉底", { size: 19, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(300, 530, "够稠：悬着", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += rect(400, 300, 400, 210, "#FDF2E7", { rx: 14 });
  b += text(600, 340, "Stokes 沉降速度", { size: 21, weight: "bold", anchor: "middle", fill: COL.amber });
  b += text(600, 390, "v = 2 r^{2} Δρ g ∕ 9η", { size: 26, weight: "bold", anchor: "middle" });
  b += lines(420, 432, ["r 颗粒半径：大一倍，沉快四倍", "Δρ 颗粒与液体的密度差", "η 液体粘度：越稠，沉得越慢"], { size: 19, lh: 28, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 7. Stein 2016 lab recipe as a flow ----------
figs.stein_flow = () => {
  const W = 1240, H = 330;
  let b = "";
  b += text(10, 30, "Stein 等 2016：NMC 正极，干粉共 1.25 g（NMC : 炭黑 : PVDF = 70 : 20 : 10）", { size: 21, weight: "bold" });
  const st = [
    ["① 洗铝箔", ["15 µm 铝箔", "丙酮擦洗", "水、IPA 冲洗"], COL.siDark],
    ["② 干混", ["NMC 0.875 g", "炭黑 0.25 g", "研钵 3–5 min"], COL.amber],
    ["③ 湿混 1", ["+ NMP 5.5 ml", "+ 16 颗玻璃珠", "混 15 min"], COL.amber],
    ["④ 湿混 2", ["+ 10% PVDF 溶液", "1.25 g", "再混 8 min"], COL.amber],
    ["⑤ 刮涂", ["刀口 200 µm", "20 mm/s", "放置 >5 min 要重混"], COL.teal],
    ["⑥ 干燥", ["室温 16 h", "→ 70 °C 约 3 h", "（第 3 章）"], COL.muted],
  ];
  const w = 180, gap = 22;
  st.forEach(([h, ls, c], i) => {
    const x = 10 + i * (w + gap);
    b += rect(x, 52, w, 200, i === 5 ? "#F5F7F9" : "#FFFFFF", { rx: 14, stroke: c, sw: 3, dash: i === 5 ? "8 6" : "" });
    b += rect(x, 52, w, 46, c, { rx: 14 }) + rect(x, 80, w, 18, c);
    b += text(x + w / 2, 84, h, { size: 21, weight: "bold", anchor: "middle", fill: "#FFFFFF" });
    b += lines(x + w / 2, 135, ls, { size: 18, lh: 36, anchor: "middle", fill: COL.ink });
    if (i < 5) b += arrow(x + w + 2, 152, x + w + gap - 2, 152, { color: COL.muted, width: 3, head: 10 });
  });
  // phase bracket
  const br = (x1, x2, label, c) =>
    path(`M${x1},270 L${x1},282 L${x2},282 L${x2},270`, c, 3) + text((x1 + x2) / 2, 312, label, { size: 19, anchor: "middle", fill: c, weight: "bold" });
  b += br(212, 392, "粉末", COL.amber) + br(414, 796, "浆料", COL.amber) + br(818, 998, "湿膜", COL.teal);
  return svg(W, H, b);
};

// ---------- 8. Mixers: planetary batch vs twin-screw continuous ----------
figs.mixers = () => {
  const W = 820, H = 540;
  let b = "";
  // planetary top view
  b += circ(140, 140, 110, COL.light, { stroke: COL.muted, sw: 4 });
  b += circ(140, 140, 62, "none", { stroke: COL.line, sw: 2 }) + `<circle cx="140" cy="140" r="62" fill="none" stroke="${COL.muted}" stroke-width="2" stroke-dasharray="6 6"/>`;
  [[0, COL.amber], [Math.PI, COL.teal]].forEach(([a, c]) => {
    const x = 140 + 62 * Math.cos(a), y = 140 + 62 * Math.sin(a);
    b += circ(x.toFixed(0), y.toFixed(0), 30, "#FFFFFF", { stroke: c, sw: 4 });
    b += path(`M${(x - 16).toFixed(0)},${(y - 6).toFixed(0)} A17,17 0 1 1 ${(x - 8).toFixed(0)},${(y + 15).toFixed(0)}`, c, 3);
  });
  b += path("M88,52 A110,110 0 0 1 200,40", COL.ink, 3) + L.head(200, 40, 0.25, COL.ink, 12);
  b += text(140, 285, "俯视：桨自转 + 公转", { size: 19, anchor: "middle", fill: COL.text2 });
  // cross section
  b += path("M320,40 L320,240 Q320,256 336,256 L524,256 Q540,256 540,240 L540,40", COL.muted, 4);
  b += `<path d="M323,110 L537,110 L537,240 Q537,253 524,253 L336,253 Q323,253 323,240 Z" fill="#C9D8E2"/>`;
  b += line(430, 20, 430, 200, COL.ink, 5) + rect(380, 196, 100, 10, COL.amber, { rx: 3 });
  for (let i = 0; i < 6; i++) b += poly(`${386 + i * 16},196 ${394 + i * 16},186 ${402 + i * 16},196`, COL.amber);
  b += line(334, 70, 334, 240, COL.teal, 6) + line(526, 70, 526, 240, COL.teal, 6);
  b += text(600, 120, "高速分散盘", { size: 19, fill: COL.amber, weight: "bold" });
  b += text(600, 148, "打散团聚", { size: 19, fill: COL.text2 });
  b += text(600, 200, "刮壁桨", { size: 19, fill: COL.teal, weight: "bold" });
  b += text(600, 228, "把壁上的粉刮回来", { size: 19, fill: COL.text2 });
  b += line(484, 198, 594, 140, COL.muted, 1.5) + line(530, 180, 594, 210, COL.muted, 1.5);
  b += text(430, 285, "剖面：行星搅拌机（批次式）", { size: 19, anchor: "middle", fill: COL.text2 });
  // twin screw
  b += rect(20, 300, 780, 1.5, COL.line);
  const feeds = [["粉末", 110, AM], ["溶剂", 270, "#3D8FB8"], ["粘结剂液", 430, BIND]];
  feeds.forEach(([t, x, c]) => {
    b += poly(`${x - 34},330 ${x + 34},330 ${x + 12},370 ${x - 12},370`, c);
    b += text(x, 322, t, { size: 19, anchor: "middle", fill: c, weight: "bold" });
    b += arrow(x, 372, x, 398, { color: c, width: 3, head: 10 });
  });
  b += rect(40, 400, 640, 80, COL.light, { rx: 10, stroke: COL.muted, sw: 3 });
  for (let k = 0; k < 2; k++) {
    let d = `M60,${425 + k * 30}`;
    for (let x = 60; x < 660; x += 30) d += ` L${x + 15},${415 + k * 30} L${x + 30},${435 + k * 30}`;
    b += path(d, k ? COL.siDark : COL.ink, 3);
  }
  b += rect(470, 404, 120, 72, COL.amber, { rx: 6, opacity: 0.25 });
  b += text(530, 500, "捏合段：高剪切", { size: 19, anchor: "middle", fill: COL.amber });
  b += arrow(684, 440, 740, 440, { color: COL.ink, width: 4, head: 14 });
  b += text(745, 432, "浆料", { size: 19, weight: "bold" });
  b += text(745, 458, "→ 涂布", { size: 19, fill: COL.text2 });
  b += text(40, 530, "双螺杆连续混合：按配比连续加料，边混边出", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 9. Viscosity: two plates ----------
figs.viscosity_plates = () => {
  const W = 820, H = 540;
  let b = "";
  b += rect(60, 60, 460, 24, COL.siDark, { rx: 4 });
  b += rect(60, 236, 460, 24, COL.muted, { rx: 4 });
  for (let x = 70; x < 520; x += 24) b += line(x, 262, x - 12, 280, COL.muted, 2);
  b += rect(60, 84, 460, 152, "#DDEFF8");
  for (let i = 0; i < 5; i++) {
    const y = 100 + i * 30, len = 30 + (4 - i) * 42;
    if (len > 8) b += arrow(120, y + 6, 120 + len, y + 6, { color: COL.teal, width: 3, head: 10 });
  }
  b += arrow(330, 52, 430, 52, { color: COL.amber, width: 5, head: 16 });
  b += text(440, 40, "上板速度 v，拉力 F", { size: 19, fill: COL.amber, weight: "bold" });
  b += line(545, 84, 545, 236, COL.ink, 2) + line(535, 84, 555, 84, COL.ink, 2) + line(535, 236, 555, 236, COL.ink, 2);
  b += text(565, 168, "间隙 h", { size: 21, weight: "bold" });
  b += text(290, 305, "下板不动；液体一层拖一层", { size: 19, anchor: "middle", fill: COL.text2 });
  // equations
  b += rect(20, 330, 780, 92, COL.light, { rx: 12 });
  b += text(40, 368, "剪切速率 γ̇ = v ∕ h（1/s）", { size: 22, weight: "bold", fill: COL.teal });
  b += text(430, 368, "剪切应力 τ = F ∕ A（Pa）", { size: 22, weight: "bold", fill: COL.amber });
  b += text(410, 408, "粘度 η = τ ∕ γ̇（单位 Pa·s）", { size: 24, weight: "bold", anchor: "middle" });
  // scale
  const x0 = 70, x1 = 770, y = 480;
  b += line(x0, y, x1, y, COL.line, 6);
  const pos = (v) => x0 + ((Math.log10(v) + 3) / 6) * (x1 - x0);
  ["0.001", "0.01", "0.1", "1", "10", "100", "1000"].forEach((t, i) => {
    const x = x0 + (i / 6) * (x1 - x0);
    b += line(x, y - 8, x, y + 8, COL.muted, 2) + text(x, y + 34, t, { size: 18, anchor: "middle", fill: COL.muted });
  });
  const mk = [[0.001, "水", COL.teal], [0.11, "Stein 浆料", COL.amber], [10, "蜂蜜（约）", COL.siDark], [100, "静置的浆料", COL.purple]];
  mk.forEach(([v, t, c], i) => {
    const x = pos(v);
    b += circ(x, y, 10, c) + text(x, y - 18, t, { size: 19, anchor: "middle", fill: c, weight: "bold" });
  });
  b += text(x0 - 10, y + 7, "Pa·s", { size: 18, fill: COL.muted, anchor: "end" });
  return svg(W, H, b);
};

// ---------- 10. Shear thinning (after Li 2022 Fig. 15) ----------
figs.shear_thinning = () => {
  const W = 820, H = 540;
  let b = "";
  const X0 = 120, X1 = 790, Y0 = 440, Y1 = 30;
  const xp = (v) => X0 + ((Math.log10(v) + 2) / 5) * (X1 - X0);
  const yp = (v) => Y0 - ((Math.log10(v) + 1) / 4) * (Y0 - Y1);
  b += rect(X0, Y1, X1 - X0, Y0 - Y1, "#FFFFFF", { stroke: COL.line, sw: 2 });
  ["0.01", "0.1", "1", "10", "100", "1000"].forEach((t) => {
    const x = xp(+t);
    b += line(x, Y0, x, Y0 + 8, COL.muted, 2) + text(x, Y0 + 32, t, { size: 19, anchor: "middle", fill: COL.text2 });
  });
  ["0.1", "1", "10", "100", "1000"].forEach((t) => {
    const y = yp(+t);
    b += line(X0 - 8, y, X0, y, COL.muted, 2) + text(X0 - 14, y + 7, t, { size: 19, anchor: "end", fill: COL.text2 });
    if (t !== "0.1" && t !== "1000") b += line(X0, y, X1, y, COL.light, 1.5);
  });
  b += text((X0 + X1) / 2, 510, "剪切速率（1/s）→ 搅得越快、涂得越快", { size: 20, anchor: "middle", weight: "bold" });
  b += `<text x="34" y="${(Y0 + Y1) / 2}" font-family="${L.FONT}" font-size="20" font-weight="bold" fill="${COL.ink}" text-anchor="middle" transform="rotate(-90 34 ${(Y0 + Y1) / 2})">粘度（Pa·s）</text>`;
  const xs = [0.01, 0.016, 0.025, 0.04, 0.063, 0.1, 0.16, 0.25, 0.4, 0.63, 1, 1.6, 2.5, 4, 6.3, 10, 16, 25, 40, 63, 100, 160, 250, 400, 630, 1000];
  const black = [null, null, 350, 240, 165, 115, 82, 60, 45, 34, 27, 21, 16, 12, 8.7, 5.8, 3.9, 2.7, 1.8, 1.3, 0.9, 0.65, 0.48, 0.37, 0.29, 0.23];
  const red = [150, 140, 112, 90, 68, 51, 37, 27, 19.5, 13.5, 10, 7.3, 5.5, 4.3, 3.5, 3.0, 2.6, 2.3, 2.1, 1.95, 1.8, 1.6, 1.45, 1.3, 1.15, 1.0];
  const blue = [29, 29, 26, 21, 17, 14, 11, 8.8, 7, 5.5, 4.5, 3.7, 3.1, 2.6, 2.3, 2.0, 1.8, 1.65, 1.5, 1.35, 1.25, 1.15, 1.1, 1.0, 0.92, 0.82];
  [[black, COL.ink], [red, COL.red], [blue, COL.teal]].forEach(([ys, c]) => {
    xs.forEach((x, i) => { if (ys[i] != null) b += circ(xp(x).toFixed(1), yp(ys[i]).toFixed(1), 7, c); });
  });
  // regions
  b += `<ellipse cx="${xp(0.022)}" cy="${yp(60)}" rx="44" ry="120" fill="none" stroke="${COL.amber}" stroke-width="3" stroke-dasharray="8 6"/>`;
  b += `<ellipse cx="${xp(400)}" cy="${yp(0.8)}" rx="58" ry="78" fill="none" stroke="${COL.purple}" stroke-width="3" stroke-dasharray="8 6"/>`;
  b += text(xp(0.06), yp(500), "静置：粘度要高", { size: 19, fill: COL.amber, weight: "bold" });
  b += text(xp(0.06), yp(500) + 26, "不沉降、边缘清楚", { size: 19, fill: COL.amber });
  b += text(xp(8), yp(0.22), "涂布：粘度要低", { size: 19, fill: COL.purple, weight: "bold", anchor: "middle" });
  b += text(xp(8), yp(0.22) + 26, "铺得开", { size: 19, fill: COL.purple, anchor: "middle" });
  b += circ(xp(30), yp(250), 7, COL.ink) + text(xp(30) + 14, yp(250) + 7, "A", { size: 19 });
  b += circ(xp(30), yp(250) + 30, 7, COL.red) + text(xp(30) + 14, yp(250) + 37, "B", { size: 19 });
  b += circ(xp(30), yp(250) + 60, 7, COL.teal) + text(xp(30) + 14, yp(250) + 67, "C", { size: 19 });
  return svg(W, H, b);
};

// ---------- 11. Slurry checks: Hegman gauge & wetting ----------
figs.slurry_checks = () => {
  const W = 820, H = 540;
  let b = "";
  // Hegman gauge top view
  b += text(190, 34, "细度板 (Hegman gauge)", { size: 21, weight: "bold", anchor: "middle" });
  b += rect(60, 56, 260, 400, COL.alu, { rx: 10 });
  b += poly("110,80 270,80 205,430 175,430", "#8D9AA6");
  b += `<path d="M112,82 L268,82 L240,230 L140,230 Z" fill="#56636F" opacity="0.85"/>`;
  const R = rng(12);
  for (let i = 0; i < 10; i++) b += circ((150 + R() * 80).toFixed(0), (240 + R() * 80).toFixed(0), 4, CB);
  b += text(330, 92, "深 100 µm", { size: 19, fill: COL.text2 });
  b += text(330, 430, "深 0", { size: 19, fill: COL.text2 });
  b += line(296, 236, 400, 236, COL.red, 2, "6 5");
  b += text(330, 268, "颗粒开始划出", { size: 19, fill: COL.red, weight: "bold" });
  b += text(330, 296, "印子 → 读数", { size: 19, fill: COL.red });
  b += text(190, 494, "槽越来越浅，大团聚体", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(190, 522, "在哪儿被“卡住”就读几 µm", { size: 19, anchor: "middle", fill: COL.text2 });
  // wetting
  const x0 = 500;
  b += text(x0 + 150, 34, "润湿：接触角 θ", { size: 21, weight: "bold", anchor: "middle" });
  const drop = (cx, by, r, deg, c) => {
    const t = (deg * Math.PI) / 180;
    const half = r * Math.sin(t), h = r - r * Math.cos(t);
    return `<path d="M${cx - half},${by} A${r},${r} 0 ${deg > 90 ? 1 : 0} 1 ${cx + half},${by} Z" fill="${c}"/>` + `<!-- h ${h} -->`;
  };
  b += rect(x0, 200, 300, 14, AL, { rx: 2 });
  b += drop(x0 + 150, 200, 72, 90, "#9FC9E3");
  b += line(x0 + 222, 200, x0 + 222, 130, COL.red, 3);
  b += text(x0 + 150, 246, "纯水 θ ≈ 90°", { size: 19, anchor: "middle", weight: "bold" });
  b += rect(x0, 400, 300, 14, AL, { rx: 2 });
  b += drop(x0 + 150, 400, 150, 40, "#9FC9E3");
  b += line(x0 + 246, 400, x0 + 296, 360, COL.teal, 3);
  b += text(x0 + 150, 446, "水 : IPA = 4 : 1，θ ≈ 40°", { size: 19, anchor: "middle", weight: "bold" });
  b += text(x0 + 150, 494, "θ 越小，铺得越开", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(x0 + 150, 522, "（铝箔上，据 Li 等 p. 938）", { size: 19, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 12. Doctor blade (lab film applicator) ----------
figs.doctor_blade = () => {
  const W = 820, H = 540;
  let b = "";
  b += rect(20, 300, 560, 40, COL.light, { stroke: COL.line, sw: 2 });
  b += text(300, 330, "平台（玻璃或真空吸板）", { size: 19, anchor: "middle", fill: COL.muted });
  b += rect(20, 290, 560, 10, AL);
  // wet film behind (left), pool in front (right)
  b += rect(20, 266, 280, 24, "#56636F");
  b += `<path d="M330,290 Q340,240 380,236 Q430,234 450,262 Q462,280 470,290 Z" fill="#56636F"/>`;
  // blade
  b += rect(300, 120, 32, 146, COL.amber, { rx: 4 });
  b += rect(260, 100, 112, 28, COL.amberLight, { rx: 6 });
  b += arrow(390, 70, 500, 70, { color: COL.ink, width: 4, head: 14 });
  b += text(390, 50, "刮刀前进", { size: 19, weight: "bold" });
  b += text(390, 104, "Stein：20 mm/s", { size: 19, fill: COL.text2 });
  b += text(470, 214, "浆料堆", { size: 19, fill: COL.text2 });
  b += text(90, 255, "湿膜", { size: 19, weight: "bold", fill: COL.siDark });
  // gap callout
  b += `<circle cx="316" cy="276" r="26" fill="none" stroke="${COL.red}" stroke-width="2.5"/>`;
  b += line(334, 296, 420, 380, COL.red, 2);
  b += rect(400, 370, 180, 110, "#FBEDEC", { rx: 10 });
  b += rect(430, 382, 60, 40, COL.amber) + rect(410, 460, 160, 8, AL) + rect(410, 444, 160, 16, "#56636F");
  b += line(500, 422, 500, 444, COL.red, 2) + text(510, 440, "间隙", { size: 19, fill: COL.red, weight: "bold" });
  // thickness bars (estimate)
  const bx = 640;
  b += text(bx + 70, 40, "厚度估算", { size: 21, weight: "bold", anchor: "middle" });
  b += rect(bx, 80, 60, 400, "#F5F7F9", { stroke: COL.muted, sw: 2, dash: "6 5" });
  b += rect(bx, 160, 60, 320, "#8D9AA6");
  b += rect(bx + 80, 430, 60, 50, "#56636F");
  b += text(bx + 30, 72, "间隙 200", { size: 19, anchor: "middle", fill: COL.muted });
  b += text(bx + 30, 192, "~160", { size: 19, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += text(bx + 110, 420, "~25", { size: 19, anchor: "middle", weight: "bold" });
  b += text(bx + 30, 510, "湿膜", { size: 19, anchor: "middle" });
  b += text(bx + 110, 510, "干膜", { size: 19, anchor: "middle" });
  b += text(bx + 70, 536, "单位 µm", { size: 18, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 13. Slot-die (after Li 2022 Fig. 8) ----------
figs.slot_die = () => {
  const W = 820, H = 540;
  let b = "";
  // pump
  b += rect(20, 60, 120, 70, COL.light, { rx: 10, stroke: COL.muted, sw: 3 });
  b += circ(80, 95, 22, "none", { stroke: COL.teal, sw: 4 }) + path("M70,95 L80,82 L90,95", COL.teal, 3);
  b += text(80, 160, "计量泵", { size: 19, anchor: "middle", weight: "bold" });
  b += text(80, 186, "定流量 Q", { size: 19, anchor: "middle", fill: COL.text2 });
  b += path("M140,95 L250,95 L250,150", "#56636F", 10);
  // die body (two halves)
  b += poly("210,150 330,150 330,330 300,360 286,360", "#8D9AA6");
  b += poly("340,150 460,150 384,360 370,360 340,330", COL.alu);
  b += rect(330, 150, 10, 180, "#56636F");
  b += `<path d="M330,186 A30,30 0 0 0 330,246 Z" fill="#56636F"/>` + rect(330, 330, 10, 32, "#56636F");
  b += text(160, 245, "腔体", { size: 19, fill: COL.text2 }) + line(205, 238, 318, 216, COL.muted, 1.5);
  b += text(470, 200, "垫片 shim：定缝宽", { size: 19, fill: COL.text2 }) + line(466, 194, 342, 200, COL.muted, 1.5);
  b += text(395, 130, "模头 slot-die", { size: 21, weight: "bold", anchor: "middle" });
  // backing roll and foil
  b += circ(380, 520, 140, COL.light, { stroke: COL.line, sw: 3 });
  b += path("M120,420 Q250,382 380,380 Q510,382 640,420", AL, 8);
  b += `<path d="M380,374 Q510,376 640,414 L642,406 Q512,368 380,366 Z" fill="#56636F"/>`;
  b += `<path d="M352,374 Q365,360 372,360 L384,360 Q392,362 396,370 L380,374 Z" fill="#56636F"/>`;
  b += text(240, 470, "背辊", { size: 19, fill: COL.muted });
  b += text(110, 400, "铝箔", { size: 19, fill: COL.text2 });
  b += arrow(560, 450, 680, 470, { color: COL.ink, width: 4, head: 14 });
  b += text(690, 480, "走带速度 U", { size: 19, weight: "bold" });
  b += text(600, 372, "湿膜 → 烘箱", { size: 19, weight: "bold", fill: COL.siDark });
  b += `<circle cx="378" cy="366" r="22" fill="none" stroke="${COL.red}" stroke-width="2.5"/>`;
  b += text(470, 300, "弯月面 meniscus", { size: 19, fill: COL.red }) + line(468, 296, 398, 356, COL.red, 1.5);
  // formula
  b += rect(500, 20, 300, 96, "#FDF2E7", { rx: 12 });
  b += text(650, 56, "湿膜厚度 ≈ Q ∕ (b × U)", { size: 21, weight: "bold", anchor: "middle" });
  b += text(650, 92, "b：涂布宽度", { size: 19, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 14. Three coating methods compared ----------
figs.coating_compare = () => {
  const W = 1240, H = 420;
  let b = "";
  const colX = [20, 430, 840], cw = 380;
  const heads = [["刮刀 doctor blade", COL.amber], ["逗号刮刀 comma bar", COL.purple], ["狭缝 slot-die", COL.teal]];
  heads.forEach(([h, c], i) => {
    const x = colX[i];
    b += rect(x, 10, cw, 400, i === 1 ? "#F1ECF8" : i === 0 ? "#FDF2E7" : "#E8F4F3", { rx: 16 });
    b += text(x + cw / 2, 48, h, { size: 22, weight: "bold", anchor: "middle", fill: c });
  });
  // doctor blade mini
  let x = colX[0];
  b += rect(x + 30, 200, 320, 8, AL) + rect(x + 30, 186, 150, 14, "#56636F");
  b += `<path d="M${x + 205},200 Q${x + 220},160 ${x + 260},160 Q${x + 290},170 ${x + 300},200 Z" fill="#56636F"/>`;
  b += rect(x + 180, 90, 24, 96, COL.amber, { rx: 3 });
  b += arrow(x + 225, 120, x + 310, 120, { color: COL.ink, width: 3, head: 11 });
  b += text(x + 190, 238, "刀向前走，浆料堆在刀前", { size: 18, anchor: "middle", fill: COL.text2 });
  // comma bar mini
  x = colX[1];
  b += circ(x + 190, 196, 46, COL.light, { stroke: COL.line, sw: 3 });
  b += circ(x + 190, 110, 38, "#C9B8E8", { stroke: COL.purple, sw: 3 });
  b += poly(`${x + 152},110 ${x + 186},150 ${x + 160},128`, COL.purple);
  b += `<path d="M${x + 60},150 Q${x + 110},96 ${x + 150},120 L${x + 160},146 L${x + 150},150 Z" fill="#56636F"/>`;
  b += rect(x + 30, 148, 8, 4, AL);
  b += path(`M${x + 30},150 L${x + 150},150 Q${x + 190},150 ${x + 236},158 L${x + 350},158`, AL, 6);
  b += rect(x + 236, 146, 114, 10, "#56636F");
  b += arrow(x + 260, 130, x + 340, 130, { color: COL.ink, width: 3, head: 11 });
  b += text(x + 190, 268, "开放液槽 + 逗号状刀辊", { size: 18, anchor: "middle", fill: COL.text2 });
  // slot die mini
  x = colX[2];
  b += circ(x + 190, 240, 50, COL.light, { stroke: COL.line, sw: 3 });
  b += poly(`${x + 140},80 ${x + 186},80 ${x + 186},170 ${x + 180},184 ${x + 170},184`, COL.siDark);
  b += poly(`${x + 194},80 ${x + 240},80 ${x + 210},184 ${x + 200},184 ${x + 194},170`, "#8D9AA6");
  b += rect(x + 186, 80, 8, 92, "#56636F");
  b += path(`M${x + 70},196 Q${x + 130},188 ${x + 190},188 Q${x + 250},188 ${x + 330},198`, AL, 6);
  b += `<path d="M${x + 190},181 Q${x + 250},181 ${x + 330},191 L${x + 330},184 Q${x + 250},174 ${x + 190},174 Z" fill="#56636F"/>`;
  b += lines(x + 262, 110, ["泵送进", "封闭模头"], { size: 18, fill: COL.text2, lh: 26 });
  // rows
  const rows = [
    ["用在哪", ["实验室、小试", "中试、部分产线", "大规模产线主流"]],
    ["厚度由谁定", ["刀口间隙 + 浆料", "刀辊间隙 + 浆料", "泵流量 ÷ 走带速度"]],
    ["浆料暴露", ["开放：堆在刀前", "开放液槽", "封闭：不怕环境"]],
  ];
  rows.forEach(([k, vals], r) => {
    const y = 306 + r * 44;
    vals.forEach((v, i) => {
      b += text(colX[i] + 24, y, k + "：", { size: 18, fill: COL.text2 });
      b += text(colX[i] + 140, y, v, { size: 19, weight: "bold", fill: COL.ink });
    });
  });
  return svg(W, H, b);
};

// ---------- 15. Areal loading worked example (Stein 2016) ----------
figs.loading_calc = () => {
  const W = 820, H = 540;
  let b = "";
  const box = (x, y, w, t1, t2, c, fill = "#FFFFFF") =>
    rect(x, y, w, 76, fill, { rx: 12, stroke: c, sw: 3 }) +
    text(x + w / 2, y + 34, t1, { size: 22, weight: "bold", anchor: "middle", fill: c }) +
    text(x + w / 2, y + 62, t2, { size: 18, anchor: "middle", fill: COL.text2 });
  const op = (x, y, s) => text(x, y + 48, s, { size: 30, weight: "bold", anchor: "middle", fill: COL.muted });
  // row 1
  b += box(20, 20, 200, "9.0 mg", "电极片（Ø 12.7 mm）", COL.siDark);
  b += op(250, 20, "−");
  b += box(280, 20, 200, "5.4 mg", "同尺寸铝箔片", COL.muted);
  b += op(510, 20, "=");
  b += box(540, 20, 260, "3.6 mg", "涂层（干）", COL.ink, COL.light);
  // row 2
  b += op(250, 140, "×");
  b += box(280, 140, 200, "70%", "NMC 的质量分数", COL.amber);
  b += op(510, 140, "=");
  b += box(540, 140, 260, "2.52 mg", "活性物质", COL.amber, "#FDF2E7");
  // row 3
  b += op(250, 260, "÷");
  b += box(280, 260, 200, "1.267 cm²", "π × (0.635 cm)²", COL.muted);
  b += op(510, 260, "=");
  b += box(540, 260, 260, "1.99 mg/cm²", "面密度（活性物质）", COL.teal, "#E8F4F3");
  // row 4
  b += op(250, 380, "×");
  b += box(280, 380, 200, "155 mAh/g", "NMC 额定比容量", COL.purple);
  b += op(510, 380, "=");
  b += box(540, 380, 260, "0.31 mAh/cm²", "面容量", COL.purple, "#F1ECF8");
  b += arrow(670, 100, 670, 136, { color: COL.muted, width: 3, head: 10 });
  b += arrow(670, 220, 670, 256, { color: COL.muted, width: 3, head: 10 });
  b += arrow(670, 340, 670, 376, { color: COL.muted, width: 3, head: 10 });
  b += lines(20, 160, ["从左往右、", "从上往下算"], { size: 19, fill: COL.text2, lh: 28 });
  b += text(20, 500, "原文算 1C 电流：3.6 mg × 0.70 × 155 mAh/g = 0.39 mAh → 1C = 0.39 mA", { size: 19, fill: COL.text2 });
  b += text(20, 530, "面密度、面容量是按原文数据补算的（电极片 ½ 英寸）", { size: 18, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 16. Coating defects (after Stein 2016 Fig. 3) ----------
figs.coating_defects = () => {
  const W = 1240, H = 360;
  let b = "";
  const pw = 290, gap = 20;
  const items = [
    ["NMP 太少", "掉片：露出铝箔", "多加 NMP；铝箔洗干净"],
    ["NMP 太多", "膜疏松、孔太多", "按粉末表面积定 NMP"],
    ["干燥不均", "流痕、积液", "放进通风橱或密闭箱"],
    ["颗粒/团聚太大", "划痕 (streak)", "过滤、细度板检查"],
  ];
  items.forEach(([h, d, fix], i) => {
    const x = 10 + i * (pw + gap);
    b += rect(x, 10, pw, 180, "#2B3D4F", { rx: 10 });
    const R = rng(30 + i);
    if (i === 0) {
      for (let k = 0; k < 14; k++) b += blob(x + 20 + R() * 250, 30 + R() * 140, 8 + R() * 16, 40 + k, { fill: "#C9D2DA" });
    } else if (i === 1) {
      for (let k = 0; k < 160; k++) b += circ((x + 8 + R() * 274).toFixed(0), (18 + R() * 164).toFixed(0), 1.6 + R() * 1.6, "#AEB8C2", { opacity: 0.55 });
    } else if (i === 2) {
      for (let k = 0; k < 6; k++) b += path(`M${x + 10},${40 + k * 26} Q${x + 80},${20 + k * 30} ${x + 150},${50 + k * 24} T${x + 280},${40 + k * 26}`, "#4A5866", 10, "none", { opacity: 0.8 });
    } else {
      for (let k = 0; k < 5; k++) { const yy = 30 + k * 34; b += line(x + 10, yy, x + 280, yy + 6, "#C9D2DA", 3); }
    }
    b += text(x + pw / 2, 228, h, { size: 21, weight: "bold", anchor: "middle", fill: i === 3 ? COL.purple : COL.red });
    b += text(x + pw / 2, 262, d, { size: 19, anchor: "middle", fill: COL.ink });
    b += check(x + 28, 300, 9, COL.teal, 4) + text(x + 46, 307, fix, { size: 18, fill: COL.teal });
  });
  b += text(10, 350, "前三种据 Stein 等 2016 Fig. 3 示意重绘；第四种据 Li 等 2022 p. 921（颗粒比湿膜还厚时出划痕）", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

module.exports = figs;
