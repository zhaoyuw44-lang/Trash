// Figures for 锂电池制造 Chapter 1: 总览——一块电池是怎么造出来的
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, blob, rng } = L;

const figs = {};
const CATH = "#3E6FA3";      // cathode coating (blue-grey)
const ANODE = COL.siDark;    // graphite anode coating
const AL = COL.alu;          // aluminium foil
const CU = COL.copper;       // copper foil
const SEP = "#F4F6F8";       // separator

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const ell = (cx, cy, rx, ry, fill, o = {}) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const path = (d, fill, o = {}) =>
  `<path d="${d}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linejoin="round" stroke-linecap="round"/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const pline = (pts, c, w = 2, o = {}) =>
  `<polyline points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;

// Archimedean spiral points around (cx, cy).
function spiral(cx, cy, r0, k, turns, phase = 0) {
  const pts = [];
  for (let t = 0; t <= turns * Math.PI * 2; t += 0.08) {
    const r = r0 + k * t;
    pts.push([cx + r * Math.cos(t + phase), cy + r * Math.sin(t + phase)]);
  }
  return pts;
}

// Small roll (side view of a coil of foil).
const roll = (cx, cy, r, fill = AL) => circ(cx, cy, r, fill, { stroke: COL.muted, sw: 2 }) + circ(cx, cy, r * 0.32, COL.white, { stroke: COL.muted, sw: 2 });

// Heat waves above a dryer.
function waves(x, y, n, c, gap = 22) {
  let b = "";
  for (let i = 0; i < n; i++) {
    const xx = x + i * gap;
    b += path(`M${xx},${y} c6,-8 -6,-14 0,-22 c6,-8 -6,-14 0,-22`, "none", { stroke: c, sw: 3 });
  }
  return b;
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  const webY = 140;
  b += roll(62, 98, 42) + roll(372, 98, 42);
  b += line(62, webY, 372, webY, AL, 7);
  b += line(132, webY - 6, 300, webY - 6, CATH, 6);
  // slot die
  b += poly([[112, 54], [152, 54], [152, 112], [136, 126], [128, 126], [112, 112]], COL.amber);
  // dryer
  b += rect(170, 84, 92, 84, "none", { rx: 10, stroke: "#CADCE8", sw: 3 });
  b += waves(190, 132, 3, "#F6C58E", 26);
  // calender rolls
  b += circ(300, webY - 30, 22, "#9FB0C0") + circ(300, webY + 30, 22, "#9FB0C0");
  b += text(132, 205, "涂布", { size: 20, anchor: "middle", fill: "#CADCE8" });
  b += text(216, 205, "干燥", { size: 20, anchor: "middle", fill: "#CADCE8" });
  b += text(300, 205, "辊压", { size: 20, anchor: "middle", fill: "#CADCE8" });
  // four cell formats
  const yb = 390;
  // coin
  b += rect(28, yb - 30, 84, 22, "#AEB8C2") + ell(70, yb - 8, 42, 12, "#AEB8C2") + ell(70, yb - 30, 42, 12, "#D5DCE2");
  // cylinder
  b += rect(140, yb - 132, 54, 132, "#7C8B99", { rx: 4 }) + ell(167, yb - 132, 27, 8, "#AEB8C2") + rect(140, yb - 92, 54, 30, COL.amber, { opacity: 0.85 });
  // pouch
  b += rect(222, yb - 120, 82, 120, "#C9B8E8", { rx: 6 }) + rect(232, yb - 110, 62, 100, "none", { stroke: "#FFFFFF", sw: 2, dash: "6 5" });
  b += rect(236, yb - 140, 16, 22, AL) + rect(274, yb - 140, 16, 22, CU);
  // prismatic
  b += rect(330, yb - 124, 78, 124, "#9FD3CF", { rx: 6 }) + rect(342, yb - 136, 16, 12, "#CADCE8") + rect(380, yb - 136, 16, 12, "#CADCE8");
  [["扣式", 70], ["圆柱", 167], ["软包", 263], ["方形", 369]].forEach(([t, x]) => (b += text(x, yb + 38, t, { size: 20, anchor: "middle", fill: "#CADCE8" })));
  b += pill(30, 478, 370, 54, COL.amber, "粉末 → 电极 → 电芯 → 电池包", { size: 22 });
  return svg(W, H, b);
};

// ---------- 1. Series map ----------
figs.series_map = () => {
  const W = 1240, H = 440;
  const g = COL.text2;
  const ev = [
    { year: "第 1 章", who: ["总览"], what: ["工艺链、形态", "成本与能耗"], color: COL.amber },
    { year: "第 2 章", who: ["电极制备 I"], what: ["从粉末到浆料", "再到涂层"], color: g },
    { year: "第 3 章", who: ["电极制备 II"], what: ["干燥、辊压", "与新工艺"], color: g },
    { year: "第 4 章", who: ["实验室扣式电池"], what: ["组装与测试"], color: g },
    { year: "第 5 章", who: ["让数据可信"], what: ["重复性与", "该报告什么"], color: g },
    { year: "第 6 章", who: ["从扣式到软包"], what: ["组装、配比", "与放大"], color: g },
  ];
  let b = timeline(W, H, ev, { axisY: 200, left: 110, right: 1110, whoSize: 20, whatSize: 19, yearSize: 26 });
  b += pill(230, 400, 360, 32, COL.teal, "电极：第 2–3 章", { size: 18 });
  b += pill(630, 400, 360, 32, COL.purple, "扣式电池：第 4–5 章", { size: 18 });
  b += pill(1010, 400, 200, 32, COL.amber, "放大：第 6 章", { size: 18 });
  return svg(W, H, b);
};

// ---------- 2. History timeline ----------
figs.history_timeline = () => {
  const W = 1240, H = 440;
  const A = COL.amber, P = COL.purple, T = COL.teal;
  const ev = [
    { year: "1985", who: ["旭化成 吉野彰"], what: ["LiCoO_{2} + 碳", "原型电池"], color: A },
    { year: "1991", who: ["Sony"], what: ["首次量产", "借用磁带涂布"], color: A },
    { year: "1990 年代", who: ["日本厂商"], what: ["Sony、三洋、松下", "18650 成标准"], color: A },
    { year: "2000 年代", who: ["韩国、中国"], what: ["LG 化学、三星 SDI", "比亚迪、ATL"], color: P },
    { year: "2008", who: ["Tesla Roadster"], what: ["约 6,800 节", "笔记本 18650"], color: T },
    { year: "2010", who: ["Leaf、Volt"], what: ["专为汽车", "设计的电芯"], color: T },
    { year: "2014–17", who: ["超级工厂"], what: ["Tesla + Panasonic", "量产 21700"], color: T },
    { year: "2019–20", who: ["新工艺"], what: ["干法电极、4680", "刀片、CTP"], color: T },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 90, right: 1120, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(700, 402, 160, 30, A, "消费电子", { size: 17 }) + pill(875, 402, 160, 30, P, "亚洲扩产", { size: 17 }) + pill(1050, 402, 160, 30, T, "电动车", { size: 17 });
  return svg(W, H, b);
};

// ---------- 3. Anatomy: particle -> electrode -> cell -> pack ----------
figs.anatomy = () => {
  const W = 1240, H = 330;
  let b = "";
  const titles = [["① 电极涂层", 150], ["② 电化学单元", 460], ["③ 电芯", 770], ["④ 电池包", 1085]];
  titles.forEach(([t, x]) => (b += text(x, 30, t, { size: 21, anchor: "middle", weight: "bold" })));
  // panel 1: composite coating
  b += rect(25, 50, 250, 200, "#DDEFF8", { rx: 12 });
  const R = rng(7);
  const parts = [[70, 95, 30], [150, 85, 34], [230, 100, 28], [95, 175, 34], [180, 170, 30], [245, 200, 22], [60, 225, 18], [135, 230, 16]];
  parts.forEach(([x, y, r], i) => (b += blob(x, y, r, 11 + i, { fill: CATH })));
  for (let i = 0; i < 60; i++) {
    const x = 35 + R() * 230, y = 60 + R() * 180;
    b += circ(x.toFixed(1), y.toFixed(1), 3.2, COL.ink);
  }
  b += path("M100,95 Q125,120 150,120 M180,140 Q200,130 225,128 M110,150 Q130,140 150,130", "none", { stroke: COL.amber, sw: 3 });
  b += text(150, 282, "活性物质 + 导电碳", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(150, 308, "+ 粘结剂 + 孔", { size: 18, anchor: "middle", fill: COL.text2 });
  b += arrow(285, 150, 320, 150, { color: COL.muted, width: 3 });
  // panel 2: electrochemical compartment
  const x2 = 335;
  const layers = [[12, AL], [70, CATH], [26, SEP], [62, ANODE], [10, CU]];
  let xx = x2;
  layers.forEach(([w, c]) => {
    b += rect(xx, 50, w, 200, c, c === SEP ? { stroke: COL.line, sw: 2, dash: "6 5" } : {});
    xx += w;
  });
  b += arrow(x2 + 160, 150, x2 + 60, 150, { color: COL.white, width: 4, head: 14 });
  b += rect(x2 + 66, 96, 52, 28, COL.white, { rx: 8 }) + text(x2 + 92, 117, "Li^{+}", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  const lab2 = [["Al", x2 + 6, COL.text2], ["正极", x2 + 44, CATH], ["隔膜", x2 + 95, COL.text2], ["负极", x2 + 146, ANODE], ["Cu", x2 + 186, CU]];
  lab2.forEach(([t, x, c]) => (b += text(x, 282, t, { size: 18, anchor: "middle", weight: "bold", fill: c })));
  b += text(x2 + 92, 308, "放电时 Li^{+} 从负极游向正极", { size: 17, anchor: "middle", fill: COL.text2 });
  b += arrow(560, 150, 610, 150, { color: COL.muted, width: 3 });
  // panel 3: multi-layer cell in a pouch
  b += rect(650, 70, 240, 180, "#C9B8E8", { rx: 10 });
  b += rect(668, 88, 204, 144, COL.white, { rx: 4 });
  for (let i = 0; i < 9; i++) {
    const y = 96 + i * 15;
    b += rect(676, y, 188, 9, i % 2 ? ANODE : CATH, { rx: 2 });
  }
  b += rect(700, 44, 30, 32, AL) + rect(810, 44, 30, 32, CU);
  b += text(770, 282, "多层叠起 + 外壳", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(770, 308, "+ 正负极耳", { size: 18, anchor: "middle", fill: COL.text2 });
  b += arrow(900, 150, 950, 150, { color: COL.muted, width: 3 });
  // panel 4: pack
  b += rect(960, 50, 255, 200, "#E7EBEF", { rx: 12, stroke: COL.muted, sw: 2 });
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 3; c++) {
      const x = 975 + c * 72, y = 66 + r * 70;
      b += rect(x, y, 62, 58, COL.purpleLight, { rx: 6 });
      for (let k = 1; k < 5; k++) b += line(x + k * 12.4, y + 8, x + k * 12.4, y + 50, COL.white, 2);
    }
  b += rect(975, 210, 100, 30, COL.ink, { rx: 6 }) + text(1025, 232, "BMS", { size: 17, anchor: "middle", weight: "bold", fill: COL.white });
  b += rect(1085, 210, 116, 30, COL.tealLight, { rx: 6 }) + text(1143, 232, "冷却", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(1085, 282, "电芯 → 模组 → 电池包", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(1085, 308, "+ 管理系统 + 冷却", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 4. Process chain ----------
figs.process_chain = () => {
  const W = 1240, H = 400;
  let b = "";
  const rows = [
    { y: 20, name: "电极制备", ch: "第 2–3 章", c: COL.teal, tint: "#E8F4F3", steps: [["混浆", "Mixing"], ["涂布", "Coating"], ["干燥", "Drying"], ["辊压", "Calendering"], ["分切", "Slitting"], ["真空干燥", "Vac. drying"]] },
    { y: 160, name: "电芯组装", ch: "第 4、6 章", c: COL.purple, tint: "#F1ECF8", steps: [["模切", "Cutting"], ["卷绕/叠片", "Wind / stack"], ["焊极耳", "Welding"], ["入壳封装", "Housing"], ["注液", "Filling"], ["封口", "Sealing"]] },
    { y: 300, name: "化成老化", ch: "第 6 章", c: COL.amber, tint: "#FDF2E7", steps: [["预充", "Pre-charge"], ["化成", "Formation"], ["排气", "Degassing"], ["老化", "Aging"], ["分容检测", "Grading"], ["分选出货", "Sorting"]] },
  ];
  // dry room box around row 2
  b += rect(172, 146, 1000, 108, "none", { rx: 14, stroke: COL.purple, sw: 2.5, dash: "10 7" });
  b += text(1168, 136, "干燥间：露点 −40 至 −60 °C", { size: 18, anchor: "end", weight: "bold", fill: COL.purple });
  rows.forEach((r) => {
    b += rect(10, r.y, 150, 80, r.c, { rx: 12 });
    b += text(85, r.y + 35, r.name, { size: 21, anchor: "middle", weight: "bold", fill: COL.white });
    b += text(85, r.y + 64, r.ch, { size: 17, anchor: "middle", fill: COL.white });
    r.steps.forEach(([zh, en], i) => {
      const x = 182 + i * 166;
      b += rect(x, r.y, 140, 80, r.tint, { rx: 10, stroke: r.c, sw: 2 });
      b += text(x + 70, r.y + 35, zh, { size: 20, anchor: "middle", weight: "bold", fill: COL.ink });
      b += text(x + 70, r.y + 63, en, { size: 17, anchor: "middle", fill: COL.text2 });
      if (i < 5) b += arrow(x + 142, r.y + 40, x + 164, r.y + 40, { color: r.c, width: 3, head: 10 });
    });
  });
  b += arrow(85, 104, 85, 156, { color: COL.muted, width: 3.5, head: 13 });
  b += arrow(85, 244, 85, 296, { color: COL.muted, width: 3.5, head: 13 });
  return svg(W, H, b);
};

// ---------- 5. Electrode production line ----------
figs.electrode_line = () => {
  const W = 1240, H = 320;
  let b = "";
  const cx = (i) => 105 + i * 206;
  const st = [
    ["混浆", "像和面", ["30 min–5 h", "一批一批做"]],
    ["涂布", "像刷墙", ["25–50 m/min", "两面各涂一次"]],
    ["干燥", "像晾衣服", ["停留 1–2 min", "NMP 要回收"]],
    ["辊压", "像擀面", ["30–100 m/min", "厚度 ±2 μm"]],
    ["分切", "像裁布", ["80–150 m/min", "边缘不能有毛刺"]],
    ["真空干燥", "像烘干", ["12–30 h", "去掉最后的水"]],
  ];
  // icons, all centred on y ≈ 85
  // 1 mixer
  let x = cx(0);
  b += path(`M${x - 50},40 L${x - 50},120 Q${x - 50},140 ${x - 30},140 L${x + 30},140 Q${x + 50},140 ${x + 50},120 L${x + 50},40`, "#E7EBEF", { stroke: COL.muted, sw: 3 });
  b += path(`M${x - 48},80 Q${x - 25},70 ${x},80 Q${x + 25},90 ${x + 48},80 L${x + 48},120 Q${x + 48},138 ${x + 30},138 L${x - 30},138 Q${x - 48},138 ${x - 48},120 Z`, "#56636F");
  b += line(x, 22, x, 120, COL.ink, 4) + path(`M${x - 26},112 L${x + 26},128 M${x - 26},128 L${x + 26},112`, "none", { stroke: COL.ink, sw: 4 });
  // 2 slot die coating
  x = cx(1);
  b += roll(x - 40, 110, 30) + line(x - 40, 140, x + 90, 140, AL, 6);
  b += line(x + 8, 134, x + 90, 134, CATH, 6);
  b += poly([[x - 6, 40], [x + 26, 40], [x + 26, 104], [x + 14, 124], [x + 6, 124], [x - 6, 104]], COL.amber);
  b += text(x + 50, 70, "狭缝", { size: 17, fill: COL.amber, weight: "bold" });
  // 3 dryer
  x = cx(2);
  b += line(x - 80, 140, x + 80, 140, AL, 6) + line(x - 80, 134, x + 80, 134, CATH, 6);
  b += rect(x - 70, 52, 140, 70, "none", { rx: 10, stroke: COL.red, sw: 3 });
  b += waves(x - 40, 112, 4, COL.red, 26);
  b += arrow(x + 40, 50, x + 62, 22, { color: COL.purple, width: 3 });
  b += text(x + 66, 28, "NMP", { size: 17, fill: COL.purple, weight: "bold" });
  // 4 calender
  x = cx(3);
  b += circ(x, 72, 34, "#AEB8C2", { stroke: COL.muted, sw: 2 }) + circ(x, 72, 7, COL.white);
  b += circ(x, 148, 34, "#AEB8C2", { stroke: COL.muted, sw: 2 }) + circ(x, 148, 7, COL.white);
  b += line(x - 90, 110, x - 30, 110, CATH, 12) + line(x + 30, 110, x + 90, 110, CATH, 5);
  b += arrow(x, 14, x, 34, { color: COL.ink, width: 3 });
  // 5 slitting
  x = cx(4);
  b += rect(x - 80, 110, 160, 34, CATH, { rx: 3 });
  b += line(x - 26, 110, x - 26, 144, COL.white, 3) + line(x + 26, 110, x + 26, 144, COL.white, 3);
  b += circ(x - 26, 78, 28, "none", { stroke: COL.ink, sw: 4 }) + circ(x + 26, 78, 28, "none", { stroke: COL.ink, sw: 4 });
  b += circ(x - 26, 78, 5, COL.ink) + circ(x + 26, 78, 5, COL.ink);
  // 6 vacuum oven
  x = cx(5);
  b += rect(x - 62, 34, 124, 112, "#E7EBEF", { rx: 10, stroke: COL.muted, sw: 3 });
  b += circ(x - 18, 96, 30, CATH, { stroke: COL.white, sw: 3 }) + circ(x - 18, 96, 10, COL.white);
  b += circ(x + 36, 62, 16, COL.white, { stroke: COL.ink, sw: 2.5 }) + line(x + 36, 62, x + 46, 52, COL.red, 3);
  // arrows and labels
  st.forEach(([name, ana, nums], i) => {
    const x0 = cx(i);
    b += text(x0, 210, name, { size: 21, anchor: "middle", weight: "bold" });
    b += text(x0, 240, ana, { size: 19, anchor: "middle", weight: "bold", fill: COL.amber });
    b += lines(x0, 270, nums, { size: 17, anchor: "middle", fill: COL.text2, lh: 24 });
    if (i < 5) b += arrow(x0 + 88, 200, x0 + 118, 200, { color: COL.muted, width: 3, head: 10 });
  });
  return svg(W, H, b);
};

// ---------- 6. Cell assembly: winding / stacking / Z-folding ----------
figs.assembly = () => {
  const W = 820, H = 540;
  let b = "";
  b += rect(10, 10, 800, 52, "#F1ECF8", { rx: 12 });
  b += text(410, 44, "全部在干燥间里做：露点 −40 至 −60 °C", { size: 21, anchor: "middle", weight: "bold", fill: COL.purple });
  // winding
  const c1 = 140;
  b += pline(spiral(c1, 190, 8, 4.2, 3.4, 0), CATH, 6) + pline(spiral(c1, 190, 8, 4.2, 3.4, Math.PI), ANODE, 6);
  b += text(c1, 320, "卷绕 Winding", { size: 21, anchor: "middle", weight: "bold" });
  b += lines(c1, 352, ["快、成熟", "厚电极弯折易裂"], { size: 19, anchor: "middle", fill: COL.text2, lh: 28 });
  // stacking
  const c2 = 410;
  for (let i = 0; i < 9; i++) {
    const y = 110 + i * 18;
    const kind = i % 2;
    b += rect(c2 - 85 + (kind ? 0 : 6), y, kind ? 170 : 158, 10, kind ? ANODE : CATH, { rx: 2 });
  }
  b += arrow(c2 + 120, 80, c2 + 120, 100, { color: COL.ink, width: 3 });
  b += text(c2, 320, "叠片 Stacking", { size: 21, anchor: "middle", weight: "bold" });
  b += lines(c2, 352, ["受力均匀，能用厚电极", "一片一片放，较慢"], { size: 19, anchor: "middle", fill: COL.text2, lh: 28 });
  // Z-folding
  const c3 = 680;
  const zz = [];
  for (let i = 0; i < 8; i++) zz.push([i % 2 ? c3 + 80 : c3 - 80, 100 + i * 24]);
  b += pline(zz, COL.muted, 3);
  for (let i = 0; i < 7; i++) {
    const y = 112 + i * 24;
    b += rect(c3 - 62, y - 4, 124, 9, i % 2 ? ANODE : CATH, { rx: 2 });
  }
  b += text(c3, 320, "Z 形折叠 Z-folding", { size: 21, anchor: "middle", weight: "bold" });
  b += lines(c3, 352, ["隔膜连续折成 Z 形", "电极逐片插入"], { size: 19, anchor: "middle", fill: COL.text2, lh: 28 });
  // overhang rule
  b += rect(20, 438, 780, 96, COL.light, { rx: 14 });
  b += rect(44, 452, 150, 68, ANODE, { rx: 4 }) + rect(58, 464, 122, 44, CATH, { rx: 3 });
  b += text(216, 478, "负极要比正极大一圈，把正极完全盖住", { size: 20, weight: "bold" });
  b += text(216, 510, "否则正极边缘的锂没处去，会析出金属锂", { size: 19, fill: COL.text2 });
  b += pill(250, 396, 150, 32, CATH, "正极", { size: 19 }) + pill(420, 396, 150, 32, ANODE, "负极", { size: 19 });
  return svg(W, H, b);
};

// ---------- 7. Formation & aging ----------
figs.formation = () => {
  const W = 820, H = 540;
  let b = "";
  const x0 = 80, x1 = 790, y0 = 280, yTop = 40;
  const V = (v) => y0 - (v / 4.4) * (y0 - yTop);
  b += line(x0, y0, x1, y0, COL.ink, 3) + line(x0, y0, x0, yTop - 10, COL.ink, 3);
  b += text(x0, yTop - 18, "电压 V", { size: 19, anchor: "middle", weight: "bold" });
  b += text(x1, y0 + 30, "时间 →", { size: 19, anchor: "end", fill: COL.text2 });
  [[1.5, "1.5"], [4.2, "4.2"]].forEach(([v, t]) => {
    b += line(x0 - 6, V(v), x0, V(v), COL.ink, 2);
    b += text(x0 - 12, V(v) + 7, t, { size: 19, anchor: "end", fill: COL.text2 });
  });
  const pts = [[x0, V(0)], [110, V(1.5)], [190, V(1.5)], [330, V(4.2)], [370, V(3.0)], [400, V(4.2)], [430, V(3.0)], [460, V(4.2)], [490, V(3.0)], [520, V(3.8)], [x1, V(3.8)]];
  b += pline(pts, COL.amber, 4);
  // breaks for aging
  b += line(600, V(3.8) - 14, 590, V(3.8) + 14, COL.white, 8) + line(612, V(3.8) - 14, 602, V(3.8) + 14, COL.white, 8);
  b += line(598, V(3.8) - 14, 588, V(3.8) + 14, COL.ink, 2) + line(614, V(3.8) - 14, 604, V(3.8) + 14, COL.ink, 2);
  const lab = (n, x, y, t, c = COL.ink) => circ(x, y, 15, c) + text(x, y + 7, n, { size: 19, anchor: "middle", weight: "bold", fill: COL.white }) + text(x + 22, y + 7, t, { size: 19, fill: c, weight: "bold" });
  b += lab("1", 128, 244, "预充约 1.5 V", COL.teal);
  b += lab("2", 102, 160, "静置浸润", COL.teal);
  b += lab("3", 262, 168, "小电流 C/20，长 SEI", COL.amber);
  b += lab("4", 530, 128, "排气", COL.purple);
  b += lab("5", 680, 42, "老化", COL.red);
  // bubbles for degassing
  [[505, V(3.8) - 22, 6], [515, V(3.8) - 40, 8], [500, V(3.8) - 58, 5]].forEach(([x, y, r]) => (b += circ(x, y, r, "none", { stroke: COL.purple, sw: 2.5 })));
  // bottom: SEI on graphite + time bars
  b += rect(20, 330, 330, 196, COL.light, { rx: 14 });
  b += circ(110, 425, 62, COL.sei) + circ(110, 425, 52, COL.siDark);
  for (let i = 0; i < 5; i++) b += line(72, 400 + i * 12, 148, 400 + i * 12, "#8A96A3", 3);
  b += lines(190, 400, ["石墨颗粒", "外面一层 SEI：", "让 Li^{+} 过，", "挡住电解液"], { size: 19, lh: 28, fill: COL.ink });
  b += rect(370, 330, 430, 196, COL.light, { rx: 14 });
  b += text(390, 368, "花多少时间（Kwade 2018）", { size: 20, weight: "bold" });
  b += rect(390, 388, 28, 34, COL.amber, { rx: 4 });
  b += text(430, 414, "化成约 1 天", { size: 19, weight: "bold", fill: COL.amber });
  b += rect(390, 440, 392, 34, COL.red, { rx: 4, opacity: 0.85 });
  b += text(586, 464, "老化 2–3 周", { size: 19, anchor: "middle", weight: "bold", fill: COL.white });
  b += text(390, 508, "两条按比例画：1 天 vs 2 周", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 8. Four cell formats ----------
figs.formats = () => {
  const W = 1240, H = 390;
  let b = "";
  const cards = [
    ["扣式 Coin", COL.text2, ["CR2032 不锈钢壳", "单层电极", "约 1–5 mAh：实验室"]],
    ["圆柱 Cylindrical", COL.amber, ["钢壳", "卷绕", "2.5–5 Ah（18650/21700）"]],
    ["软包 Pouch", COL.purple, ["铝塑膜", "叠片为主", "几十 mAh 到上百 Ah"]],
    ["方形 Prismatic", COL.teal, ["铝壳", "扁卷绕或叠片", "车用约 50–300 Ah"]],
  ];
  cards.forEach(([t, c, ls], i) => {
    const x = 10 + i * 308;
    b += rect(x, 0, 292, 390, COL.light, { rx: 16 });
    b += text(x + 146, 252, t, { size: 21, anchor: "middle", weight: "bold", fill: c });
    b += lines(x + 146, 288, ls, { size: 18, anchor: "middle", fill: COL.ink, lh: 30 });
  });
  // coin: exploded stack
  let cx = 156;
  const parts = [["#AEB8C2", 70, 10, "负极壳"], ["#C9D2DA", 50, 6, "弹片"], ["#AEB8C2", 54, 5, "垫片"], [COL.purple, 46, 4, "锂片"], [SEP, 54, 3, "隔膜"], [CATH, 44, 4, "电极"], ["#AEB8C2", 74, 12, "正极壳"]];
  parts.forEach(([c, rx, th, lab], i) => {
    const y = 36 + i * 26;
    b += rect(cx - rx, y, rx * 2, th, c, { stroke: COL.muted, sw: 1 }) + ell(cx, y, rx, 6, c, { stroke: COL.muted, sw: 1 });
    if (i % 2 === 0) b += text(cx + 82, y + 8, lab, { size: 17, fill: COL.text2 });
    else b += text(cx - 82, y + 8, lab, { size: 17, anchor: "end", fill: COL.text2 });
  });
  // cylinder with cut-away and top spiral
  cx = 10 + 308 + 146;
  b += rect(cx - 95, 40, 70, 170, "#7C8B99", { rx: 6 }) + ell(cx - 60, 40, 35, 9, "#AEB8C2");
  for (let i = 0; i < 9; i++) b += rect(cx - 88 + i * 6.5, 70, 4, 120, i % 2 ? ANODE : CATH);
  b += rect(cx - 72, 30, 24, 10, "#AEB8C2", { rx: 2 });
  b += pline(spiral(cx + 60, 120, 5, 4.6, 2.6, 0), CATH, 5) + pline(spiral(cx + 60, 120, 5, 4.6, 2.6, Math.PI), ANODE, 5);
  b += circ(cx + 60, 120, 82, "none", { stroke: COL.muted, sw: 4 });
  b += text(cx + 60, 224, "俯视：卷芯", { size: 17, anchor: "middle", fill: COL.text2 });
  // pouch
  cx = 10 + 2 * 308 + 146;
  b += rect(cx - 100, 50, 200, 160, "#C9B8E8", { rx: 10 });
  b += rect(cx - 82, 68, 164, 124, COL.white, { rx: 4 });
  for (let i = 0; i < 7; i++) b += rect(cx - 74, 76 + i * 16, 148, 9, i % 2 ? ANODE : CATH, { rx: 2 });
  b += rect(cx - 60, 18, 30, 36, AL) + rect(cx + 30, 18, 30, 36, CU);
  // prismatic
  cx = 10 + 3 * 308 + 146;
  b += poly([[cx - 90, 60], [cx + 70, 60], [cx + 100, 36], [cx - 60, 36]], "#BFE3E0");
  b += poly([[cx + 70, 60], [cx + 100, 36], [cx + 100, 186], [cx + 70, 210]], "#6FB8B2");
  b += rect(cx - 90, 60, 160, 150, COL.tealLight);
  b += rect(cx - 74, 76, 128, 118, "none", { rx: 40, stroke: COL.white, sw: 3, dash: "8 6" });
  b += rect(cx - 70, 26, 26, 18, "#AEB8C2", { rx: 3 }) + rect(cx + 30, 26, 26, 18, CU, { rx: 3 });
  return svg(W, H, b);
};

// ---------- 9. Cylindrical sizes to scale ----------
figs.cyl_sizes = () => {
  const W = 820, H = 540;
  let b = "";
  const s = 4; // px per mm
  const base = 380;
  const cells = [
    ["CR2032", 85, 20, 3.2, "20 × 3.2", "约 0.2 Ah*", COL.text2],
    ["18650", 222, 18, 65, "18 × 65", "约 3 Ah", COL.amber],
    ["21700", 345, 21, 70, "21 × 70", "约 5 Ah", COL.amber],
    ["4680", 530, 46, 80, "46 × 80", "20 Ah 以上", COL.red],
  ];
  b += line(20, base, 800, base, COL.line, 2);
  cells.forEach(([n, cx, d, h, dim, cap, c]) => {
    const w = d * s, hh = h * s;
    b += rect(cx - w / 2, base - hh, w, hh, n === "CR2032" ? "#AEB8C2" : "#7C8B99", { rx: 4 });
    b += ell(cx, base - hh, w / 2, Math.max(3, w * 0.12), "#C9D2DA");
    if (n !== "CR2032") b += rect(cx - w / 2, base - hh * 0.62, w, hh * 0.22, c, { opacity: 0.9 });
    b += text(cx, base + 34, n, { size: 22, anchor: "middle", weight: "bold", fill: c });
    b += text(cx, base + 62, dim, { size: 19, anchor: "middle", fill: COL.text2 });
    b += text(cx, base - hh - 22, cap, { size: 19, anchor: "middle", weight: "bold", fill: COL.ink });
  });
  b += text(20, 40, "按同一比例画；尺寸为 直径 × 高 (mm)", { size: 19, fill: COL.text2 });
  b += rect(660, 90, 150, 200, COL.light, { rx: 12 });
  b += lines(735, 128, ["体积比", "18650 : 21700", ": 4680", "≈ 1 : 1.5 : 8"], { size: 19, anchor: "middle", lh: 30, fill: COL.ink });
  b += text(735, 262, "按尺寸计算", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(20, 520, "* CR2032 是一次电池的典型容量；容量均为典型值，随化学体系变化", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 10. Three scales (Kwade Fig. 4) ----------
figs.scales = () => {
  const W = 1240, H = 380;
  let b = "";
  const colX = [110, 485, 860];
  const cw = 365;
  const heads = [["实验室 Lab", COL.purple], ["中试线 Pilot", COL.teal], ["量产线 Industrial", COL.amber]];
  heads.forEach(([t, c], i) => {
    b += rect(colX[i], 0, cw, 40, c, { rx: 10 });
    b += text(colX[i] + cw / 2, 28, t, { size: 21, anchor: "middle", weight: "bold", fill: COL.white });
  });
  b += rect(0, 52, 100, 150, COL.light, { rx: 10 }) + text(50, 136, "电极", { size: 21, anchor: "middle", weight: "bold" });
  b += rect(0, 214, 100, 150, COL.light, { rx: 10 }) + text(50, 298, "电芯", { size: 21, anchor: "middle", weight: "bold" });
  colX.forEach((x) => {
    b += rect(x, 52, cw, 150, "#F7F9FA", { rx: 10, stroke: COL.line, sw: 1.5 });
    b += rect(x, 214, cw, 150, "#F7F9FA", { rx: 10, stroke: COL.line, sw: 1.5 });
  });
  // lab electrode: doctor blade on a plate
  let x = colX[0];
  b += rect(x + 40, 128, 280, 14, "#C9D2DA");
  b += rect(x + 40, 120, 150, 8, CATH);
  b += rect(x + 190, 80, 46, 46, COL.amber, { rx: 4 });
  b += path(`M${x + 238},126 q20,-14 40,0 z`, CATH);
  b += arrow(x + 190, 68, x + 250, 68, { color: COL.ink, width: 3 });
  b += text(x + cw / 2, 182, "刮刀涂膜：手工、一张张", { size: 18, anchor: "middle", fill: COL.text2 });
  // pilot electrode: small roll-to-roll
  x = colX[1];
  b += roll(x + 50, 110, 26) + roll(x + 315, 110, 26);
  b += line(x + 50, 136, x + 315, 136, AL, 5) + line(x + 120, 131, x + 315, 131, CATH, 5);
  b += poly([[x + 100, 76], [x + 124, 76], [x + 124, 118], [x + 112, 128], [x + 100, 118]], COL.amber);
  b += rect(x + 150, 92, 110, 30, "none", { rx: 6, stroke: COL.red, sw: 2.5 });
  b += text(x + cw / 2, 182, "小卷对卷，半自动", { size: 18, anchor: "middle", fill: COL.text2 });
  // industrial electrode: wide double side
  x = colX[2];
  b += roll(x + 40, 115, 28);
  b += line(x + 40, 143, x + 340, 143, AL, 6) + line(x + 96, 138, x + 340, 138, CATH, 5) + line(x + 96, 148, x + 340, 148, CATH, 5);
  b += poly([[x + 72, 92], [x + 94, 92], [x + 94, 128], [x + 83, 136], [x + 72, 128]], COL.amber);
  b += rect(x + 118, 74, 220, 54, "none", { rx: 8, stroke: COL.red, sw: 2.5 });
  b += waves(x + 150, 120, 6, COL.red, 30);
  b += text(x + cw / 2, 182, "宽幅、双面、长烘箱，全自动", { size: 18, anchor: "middle", fill: COL.text2 });
  // lab cell: single sheets by hand
  x = colX[0];
  b += rect(x + 90, 262, 130, 70, ANODE, { rx: 4 }) + rect(x + 120, 248, 120, 66, SEP, { rx: 4, stroke: COL.line, sw: 2 }) + rect(x + 150, 236, 106, 60, CATH, { rx: 4 });
  b += arrow(x + 300, 236, x + 262, 256, { color: COL.ink, width: 3 });
  b += text(x + cw / 2, 352, "手工放单片", { size: 18, anchor: "middle", fill: COL.text2 });
  // pilot cell: Z fold
  x = colX[1];
  const zz = [];
  for (let i = 0; i < 6; i++) zz.push([i % 2 ? x + 250 : x + 110, 236 + i * 18]);
  b += pline(zz, COL.muted, 3);
  for (let i = 0; i < 5; i++) b += rect(x + 124, 242 + i * 18, 112, 7, i % 2 ? ANODE : CATH, { rx: 2 });
  b += text(x + cw / 2, 352, "Z 形折叠，半连续", { size: 18, anchor: "middle", fill: COL.text2 });
  // industrial cell: winding
  x = colX[2];
  b += pline(spiral(x + 120, 280, 4, 3.6, 2.6, 0), CATH, 4) + pline(spiral(x + 120, 280, 4, 3.6, 2.6, Math.PI), ANODE, 4);
  b += line(x + 180, 250, x + 330, 250, CATH, 6) + line(x + 180, 300, x + 330, 300, ANODE, 6);
  b += text(x + cw / 2, 352, "高速卷绕，连续", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 11. Lab vs factory table ----------
figs.lab_vs_fab = () => {
  const W = 1240, H = 340;
  let b = "";
  const rows = [
    ["材料用量", "几克（< 10 g）", "千克到吨"],
    ["涂布", "刮刀，单面，一小张", "狭缝挤压，双面，25–50 m/min"],
    ["面载量", "常见 1–10 mg/cm²", "约 3–4 mAh/cm²（典型）"],
    ["配方", "常见 80 : 10 : 10（典型）", "导电碳、粘结剂各约 2%"],
    ["孔隙率", "常不辊压，孔很多", "辊压到 25–35%"],
    ["电芯", "扣式半电池，锂片大量过量", "多层、双面涂布的全电池"],
    ["电解液", "富液，多加不心疼", "贫液，约占电芯 15–20 wt%"],
    ["环境", "手套箱（氩气）", "干燥间，露点 −40 至 −60 °C"],
  ];
  const c0 = 0, c1 = 190, c2 = 710, rh = 36, top = 44;
  b += rect(c1, 0, 510, 40, COL.purple, { rx: 8 }) + rect(c2, 0, 530, 40, COL.amber, { rx: 8 });
  b += text(c1 + 255, 28, "实验室", { size: 21, anchor: "middle", weight: "bold", fill: COL.white });
  b += text(c2 + 265, 28, "工厂", { size: 21, anchor: "middle", weight: "bold", fill: COL.white });
  rows.forEach(([k, l, f], i) => {
    const y = top + i * rh;
    if (i % 2 === 0) b += rect(0, y, W, rh, COL.light);
    b += text(c0 + 16, y + 25, k, { size: 19, weight: "bold" });
    b += text(c1 + 16, y + 25, l, { size: 19, fill: COL.ink });
    b += text(c2 + 16, y + 25, f, { size: 19, fill: COL.ink });
  });
  return svg(W, H, b);
};

// ---------- 12. Materials scale-up (Xiao Fig. 1) ----------
figs.scaleup = () => {
  const W = 820, H = 540;
  let b = "";
  // left: lab loop
  b += rect(10, 20, 300, 500, "#F1ECF8", { rx: 16 });
  b += text(160, 60, "实验室循环", { size: 22, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(160, 90, "几乎不考虑成本", { size: 19, anchor: "middle", fill: COL.text2 });
  const nodes = [[160, 175, ["合成", "< 10 g"]], [82, 330, ["扣式", "测试"]], [238, 330, ["表征"]]];
  nodes.forEach(([x, y, t]) => {
    b += circ(x, y, 52, COL.white, { stroke: COL.purple, sw: 3 });
    b += lines(x, y + (t.length > 1 ? -4 : 7), t, { size: 19, anchor: "middle", weight: "bold", lh: 26 });
  });
  b += arrow(195, 218, 222, 272, { color: COL.purple, width: 3 });
  b += arrow(182, 338, 138, 338, { color: COL.purple, width: 3 });
  b += arrow(96, 276, 122, 222, { color: COL.purple, width: 3 });
  b += lines(160, 430, ["小批量容易混匀，", "颗粒均匀，", "容量好看"], { size: 19, anchor: "middle", fill: COL.ink, lh: 28 });
  // arrow scale up
  b += arrow(318, 270, 372, 270, { color: COL.amber, width: 6, head: 18 });
  b += text(345, 250, "放大", { size: 19, anchor: "middle", weight: "bold", fill: COL.amber });
  // right: pyramid of material
  const px = 594, py = 350;
  for (let r = 0; r < 6; r++) for (let k = 0; k <= r; k++) b += circ(px - r * 13 + k * 26, py - 120 + r * 24, 12, "#3E6FA3", { stroke: COL.white, sw: 1.5 });
  b += text(px, py + 26, "> 1 kg / 批", { size: 20, anchor: "middle", weight: "bold", fill: CATH });
  const boxes = [
    [380, 20, "① 原料与路线", ["LiOH 贵，", "Li_{2}CO_{3} 难烧透"]],
    [600, 20, "② 设备", ["窑炉各处温度要匀", "混料罐会磨出金属"]],
    [380, 404, "③ 杂质与质控", ["Fe、Cr、Ni、Cu、Zn", "颗粒 10–50 μm"]],
    [600, 404, "④ 大规模涂布", ["高镍正极吸潮，", "浆料凝成“果冻”"]],
  ];
  boxes.forEach(([x, y, t, ls]) => {
    b += rect(x, y, 212, 116, "#FDF2E7", { rx: 12 });
    b += text(x + 14, y + 32, t, { size: 19, weight: "bold", fill: COL.amber });
    b += lines(x + 14, y + 64, ls, { size: 19, fill: COL.ink, lh: 28 });
  });
  return svg(W, H, b);
};

module.exports = figs;
