// Figures for 锂电池制造 Chapter 4: 实验室扣式电池——组装与测试
// Papers: Kayyar 2012 JoVE; Stein 2016 JoVE (cell assembly); Luc 2022 Energies (production procedure)
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, head } = L;

const figs = {};
const STEEL = "#B7C1CB";
const STEEL_D = "#8794A1";
const CATH = COL.ink;          // cathode coating (dark)
const AL = COL.alu;
const CU = COL.copper;
const LI = COL.purple;
const SEP = "#F4F6F8";
const GASK = COL.amber;
const ELY = "#7FB8D8";

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const ell = (cx, cy, rx, ry, fill, o = {}) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const path = (d, fill, o = {}) =>
  `<path d="${d}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.join ? ` stroke-linejoin="round"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
// Double-headed dimension arrow.
const dim = (x1, y1, x2, y2, c = COL.ink, w = 2) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return arrow(mx, my, x1, y1, { color: c, width: w, head: 10 }) + arrow(mx, my, x2, y2, { color: c, width: w, head: 10 });
};
// A thin disc in perspective: top ellipse + side band.
function disc(cx, cy, rx, ry, t, top, side, o = {}) {
  let b = "";
  b += path(`M${cx - rx},${cy} L${cx - rx},${cy + t} A${rx},${ry} 0 0 0 ${cx + rx},${cy + t} L${cx + rx},${cy} Z`, side, o.stroke ? { stroke: o.stroke, sw: 1.5 } : {});
  b += ell(cx, cy, rx, ry, top, o.stroke ? { stroke: o.stroke, sw: 1.5 } : {});
  return b;
}
// Electrolyte drop.
const drop = (x, y, s = 1, c = ELY) =>
  path(`M${x},${y - 14 * s} C${x + 9 * s},${y - 2 * s} ${x + 9 * s},${y + 8 * s} ${x},${y + 8 * s} C${x - 9 * s},${y + 8 * s} ${x - 9 * s},${y - 2 * s} ${x},${y - 14 * s} Z`, c);
// Smooth open path through points.
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

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 470, H = 560;
  let b = "";
  const cx = 235, rx = 150, ry = 30;
  // exploded stack, top to bottom
  const parts = [
    { y: 70, rx: 150, t: 12, top: "#CADCE8", side: "#8794A1" },          // cap
    { y: 140, rx: 112, t: 6, top: "#9FD3CF", side: "#1F8A84", wave: 1 },  // spring
    { y: 195, rx: 118, t: 8, top: "#AEB8C2", side: "#7C8B99" },           // spacer
    { y: 250, rx: 112, t: 8, top: "#C9B8E8", side: "#6C4BA6" },           // Li
    { y: 305, rx: 142, t: 3, top: "#F4F6F8", side: "#C9D2DA" },           // separator
    { y: 355, rx: 100, t: 6, top: "#4A5866", side: "#2B3947" },           // cathode
  ];
  parts.forEach((p) => {
    b += disc(cx, p.y, p.rx, p.rx * 0.2, p.t, p.top, p.side);
    if (p.wave) {
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const a = Math.PI * (i / 40);
        pts.push([cx - p.rx * Math.cos(a) * 0.82, p.y + p.rx * 0.2 * 0.82 * Math.sin(a) - 8 * Math.sin(a * 6)]);
      }
      b += smooth(pts, "#1F8A84", 3);
    }
  });
  // case (cup)
  const y = 420;
  b += path(`M${cx - rx},${y} L${cx - rx},${y + 34} A${rx},${ry} 0 0 0 ${cx + rx},${y + 34} L${cx + rx},${y} Z`, "#8794A1");
  b += ell(cx, y, rx, ry, "#B7C1CB");
  b += ell(cx, y + 6, rx - 12, ry - 4, "#9AA6B2");
  b += line(cx, 30, cx, 468, "#4A5866", 2, "6 8");
  b += pill(85, 500, 300, 42, COL.amber, "CR2032 · 20 mm × 3.2 mm", { size: 19 });
  return svg(W, H, b);
};

// ---------- 1. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const P = COL.purple, T = COL.teal, A = COL.amber;
  const ev = [
    { year: "1940s", who: ["美国核计划"], what: ["密封手套箱"], color: P },
    { year: "1950s", who: ["汞纽扣电池"], what: ["助听器、手表"], color: A },
    { year: "1970s", who: ["锂硬币电池"], what: ["Li/MnO_{2}", "CR 系列"], color: A },
    { year: "1979", who: ["Peled"], what: ["SEI 模型", "解释首圈损失"], color: T },
    { year: "1991", who: ["Sony"], what: ["商品锂离子", "全电池"], color: T },
    { year: "2011", who: ["Marks…Dahn"], what: ["学术界扣电", "制片指南"], color: P },
    { year: "2012/16", who: ["Kayyar · Stein"], what: ["JoVE 视频", "组装教程"], color: P },
    { year: "2022", who: ["Luc 等"], what: ["用 DoE 检验", "可重复性"], color: P },
  ];
  const b = timeline(W, H, ev, { left: 85, right: W - 95, axisY: 205, yearSize: 26, whoSize: 18, whatSize: 17 });
  return svg(W, H, b);
};

// ---------- 2. CR2032 naming ----------
figs.cr2032_naming = () => {
  const W = 820, H = 490;
  let b = "";
  const boxes = [
    { x: 70, w: 120, s: "C", c: COL.purple, l1: "化学体系", l2: "Li/MnO_{2}" },
    { x: 220, w: 120, s: "R", c: COL.teal, l1: "形状", l2: "圆形 round" },
    { x: 370, w: 160, s: "20", c: COL.amber, l1: "直径", l2: "20 mm" },
    { x: 560, w: 160, s: "32", c: COL.red, l1: "高度", l2: "3.2 mm" },
  ];
  boxes.forEach((o) => {
    b += rect(o.x, 25, o.w, 92, o.c, { rx: 14 });
    b += text(o.x + o.w / 2, 92, o.s, { size: 60, anchor: "middle", weight: "bold", fill: COL.white });
    b += text(o.x + o.w / 2, 152, o.l1, { size: 20, anchor: "middle", fill: COL.text2 });
    b += text(o.x + o.w / 2, 182, o.l2, { size: 21, anchor: "middle", weight: "bold", fill: o.c });
  });
  // side view, 20 px per mm horizontally; height exaggerated
  const x0 = 210, x1 = 610, yb = 320;
  b += rect(x0, yb - 52, x1 - x0, 52, STEEL, { rx: 6 });                 // case (+)
  b += rect(x0 + 14, yb - 76, x1 - x0 - 28, 30, "#D5DCE3", { rx: 5 });  // cap (−)
  b += rect(x0 + 6, yb - 58, 14, 12, GASK) + rect(x1 - 20, yb - 58, 14, 12, GASK);
  b += text(x0 + 200, yb - 20, "壳 case（+）", { size: 20, anchor: "middle", fill: COL.ink, weight: "bold" });
  b += text(x0 + 200, yb - 55, "盖 cap（−）", { size: 19, anchor: "middle", fill: COL.ink });
  b += line(x0, yb + 8, x0, yb + 50, COL.muted, 1.5) + line(x1, yb + 8, x1, yb + 50, COL.muted, 1.5);
  b += dim(x0 + 4, yb + 34, x1 - 4, yb + 34, COL.amber, 2.5);
  b += rect(370, yb + 18, 80, 30, COL.white) + text(410, yb + 41, "20 mm", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  b += line(x1 + 8, yb - 76, x1 + 50, yb - 76, COL.muted, 1.5) + line(x1 + 8, yb, x1 + 50, yb, COL.muted, 1.5);
  b += dim(x1 + 34, yb - 72, x1 + 34, yb - 4, COL.red, 2.5);
  b += text(x1 + 56, yb - 30, "3.2 mm", { size: 21, weight: "bold", fill: COL.red });
  b += text(x0 - 12, yb - 30, "侧视", { size: 19, anchor: "end", fill: COL.muted });
  b += text(410, 425, "同一套命名：CR2025 高 2.5 mm，CR2016 高 1.6 mm", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(410, 465, "实验室买的是空壳，只借用尺寸（Luc 写作 R2032）", { size: 19, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 3. Exploded view ----------
figs.exploded = () => {
  const W = 820, H = 650;
  let b = "";
  const cx = 215, k = 9.5; // px per mm
  const items = [
    // top to bottom (assembly order counts from the bottom)
    { n: "⑧", name: "负极盖 cap（−）", desc: "不锈钢，作负端子", d: 20, t: 10, top: "#D5DCE3", side: STEEL_D },
    { n: "⑦", name: "弹片 spring", desc: "波形或碟形，给叠层恒定压力", d: 15.4, t: 5, top: "#9FD3CF", side: COL.teal, wave: true },
    { n: "⑥", name: "垫片 spacer", desc: "0.2 / 0.5 / 1 mm，填满空间", d: 15.8, t: 8, top: "#C9D2DA", side: COL.si },
    { n: "⑤", name: "锂片 / 负极片", desc: "半电池用锂片，全电池用石墨片", d: 15, t: 7, top: COL.purpleLight, side: COL.purple },
    { n: "④", name: "密封圈 gasket", desc: "塑料环：绝缘 + 密封", d: 20, t: 6, ring: true, top: COL.amberLight, side: COL.amber },
    { n: "③", name: "隔膜 separator", desc: "多孔薄膜，比电极大一圈", d: 19, t: 2, top: SEP, side: "#C9D2DA", stroke: "#AEB8C2" },
    { n: "②", name: "正极片 cathode", desc: "涂层朝上，铝箔朝下", d: 13, t: 6, top: "#4A5866", side: "#2B3947" },
    { n: "①", name: "正极壳 case（+）", desc: "最大的杯子，先放", d: 20, t: 24, cup: true, top: STEEL, side: STEEL_D },
  ];
  const y0 = 52, step = 76;
  items.forEach((it, i) => {
    const y = y0 + i * step;
    const rx = (it.d / 2) * k, ry = rx * 0.17;
    if (it.cup) {
      b += path(`M${cx - rx},${y} L${cx - rx},${y + it.t} A${rx},${ry} 0 0 0 ${cx + rx},${y + it.t} L${cx + rx},${y} Z`, it.side);
      b += ell(cx, y, rx, ry, it.top) + ell(cx, y + 3, rx - 8, ry - 3, "#9AA6B2");
    } else if (it.ring) {
      b += disc(cx, y, rx, ry, it.t, it.top, it.side);
      b += ell(cx, y, rx - 13, ry - 3, COL.white);
    } else {
      b += disc(cx, y, rx, ry, it.t, it.top, it.side, it.stroke ? { stroke: it.stroke } : {});
    }
    if (it.wave) {
      const pts = [];
      for (let j = 0; j <= 40; j++) {
        const a = Math.PI * (j / 40);
        pts.push([cx - rx * 0.85 * Math.cos(a), y + ry * 0.85 * Math.sin(a) - 7 * Math.sin(a * 6)]);
      }
      b += smooth(pts, COL.teal, 3);
    }
    // electrolyte drops between separator and its neighbours
    if (it.name.startsWith("隔膜")) b += drop(cx, y - 30, 1) + drop(cx, y + 44, 1);
    // leader + label
    b += line(cx + rx + 6, y + 3, 445, y + 3, COL.line, 1.5);
    b += text(452, y - 4, `${it.n} ${it.name}`, { size: 20, weight: "bold", fill: COL.ink });
    b += text(452, y + 22, it.desc, { size: 19, fill: COL.text2 });
  });
  b += text(cx - 60, y0 + 5 * step - 30, "电解液", { size: 19, anchor: "end", fill: "#3C86B0", weight: "bold" });
  b += text(cx - 60, y0 + 5 * step + 50, "电解液", { size: 19, anchor: "end", fill: "#3C86B0", weight: "bold" });
  b += arrow(14, 620, 14, 40, { color: COL.muted, width: 2.5, head: 12 });
  b += `<g transform="rotate(-90 34 330)">` + text(34, 330, "装配顺序：从 ① 到 ⑧", { size: 19, anchor: "middle", fill: COL.muted }) + `</g>`;
  return svg(W, H, b);
};

// ---------- 4. Glovebox ----------
figs.glovebox = () => {
  const W = 820, H = 540;
  let b = "";
  // main box
  b += rect(190, 70, 430, 290, "#EEF2F5", { rx: 16, stroke: COL.siDark, sw: 3 });
  b += rect(215, 95, 380, 170, "#DDEFF8", { rx: 10, stroke: COL.line, sw: 2 }); // window
  b += text(405, 130, "Ar 气氛", { size: 24, anchor: "middle", weight: "bold", fill: COL.teal });
  // glove ports and gloves
  [320, 490].forEach((x) => {
    b += ell(x, 300, 42, 42, COL.ink) + ell(x, 300, 32, 32, "#4A5866");
    b += path(`M${x - 26},300 C${x - 30},250 ${x - 18},200 ${x - 6},185 L${x + 10},185 C${x + 22},200 ${x + 30},250 ${x + 26},300 Z`, "#2B3947", { opacity: 0.85 });
  });
  // sensor display
  b += rect(470, 30, 180, 56, COL.ink, { rx: 8 });
  b += text(560, 54, "H_{2}O 0.3 ppm", { size: 19, anchor: "middle", fill: "#9FD3CF", weight: "bold" });
  b += text(560, 78, "O_{2}  0.4 ppm", { size: 19, anchor: "middle", fill: "#9FD3CF", weight: "bold" });
  // antechamber
  b += rect(40, 190, 150, 110, "#D5DCE3", { rx: 50, stroke: COL.siDark, sw: 3 });
  b += line(60, 192, 60, 298, COL.siDark, 4) + line(170, 192, 170, 298, COL.siDark, 4);
  b += text(115, 250, "过渡舱", { size: 20, anchor: "middle", weight: "bold" });
  b += text(115, 330, "抽真空 ↔ 充 Ar", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(115, 356, "重复 3–5 次", { size: 19, anchor: "middle", fill: COL.text2 });
  // purifier
  b += rect(690, 110, 90, 250, "#F1ECF8", { rx: 12, stroke: COL.purple, sw: 3 });
  b += rect(700, 125, 70, 100, COL.copper, { rx: 8 });
  b += text(735, 170, "Cu", { size: 22, anchor: "middle", weight: "bold", fill: COL.white });
  b += text(735, 196, "吸 O_{2}", { size: 19, anchor: "middle", fill: COL.white });
  b += rect(700, 240, 70, 105, COL.sulfurLight, { rx: 8 });
  b += text(735, 280, "分子筛", { size: 19, anchor: "middle", weight: "bold" });
  b += text(735, 306, "吸 H_{2}O", { size: 19, anchor: "middle" });
  b += text(735, 98, "净化柱", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  // circulation loop
  b += arrow(620, 150, 688, 150, { color: COL.purple, width: 3 });
  b += arrow(688, 320, 622, 320, { color: COL.purple, width: 3 });
  b += text(655, 395, "风机循环", { size: 19, anchor: "middle", fill: COL.purple });
  // Ar cylinder
  b += rect(395, 385, 40, 90, COL.teal, { rx: 14 }) + rect(405, 372, 20, 16, COL.siDark, { rx: 3 });
  b += text(415, 440, "Ar", { size: 19, anchor: "middle", weight: "bold", fill: COL.white });
  b += line(415, 372, 415, 362, COL.siDark, 4);
  // bottom notes
  b += pill(30, 492, 240, 40, COL.teal, "Ar：不和锂反应", { size: 19 });
  b += pill(290, 492, 240, 40, COL.amber, "N_{2}：会生成 Li_{3}N", { size: 19 });
  b += pill(550, 492, 250, 40, COL.red, "空气：H_{2}O、O_{2} 都反应", { size: 19 });
  return svg(W, H, b);
};

// ---------- 5. ppm ladder (log scale) ----------
figs.ppm_ladder = () => {
  const W = 820, H = 540;
  let b = "";
  const x0 = 60, dec = 98; // 0.1 ppm at x0, px per decade
  const X = (v) => x0 + dec * (Math.log10(v) + 1);
  const ay = 280;
  // regions
  b += rect(X(0.1), ay - 18, X(10) - X(0.1), 36, "#E8F4F3", { rx: 6 });
  b += rect(X(1e4), ay - 18, X(1e6) - X(1e4), 36, "#FBEDEC", { rx: 6 });
  b += line(x0 - 10, ay, X(1e6) + 10, ay, COL.ink, 3);
  [0.1, 1, 10, 100, 1e3, 1e4, 1e5, 1e6].forEach((v, i) => {
    const x = X(v);
    b += line(x, ay - 8, x, ay + 8, COL.ink, 2.5);
    const lab = ["0.1", "1", "10", "100", "1 千", "1 万", "10 万", "100 万"][i];
    b += text(x, ay - 26, lab, { size: 19, anchor: "middle", fill: COL.muted });
  });
  b += text(X(1e6) + 10, ay + 34, "ppm", { size: 19, anchor: "end", fill: COL.muted });
  const marks = [
    { v: 0.5, up: true, tx: 110, c: COL.teal, l: ["0.5", "Stein 2016 箱内"] },
    { v: 5, up: true, tx: 290, c: COL.teal, l: ["5", "Luc 2022 上限"] },
    { v: 1.6e4, up: true, tx: 560, c: COL.red, l: ["≈ 1.6 万", "室内空气的 H_{2}O"] },
    { v: 1, up: false, tx: 130, c: COL.muted, l: ["1 ppm H_{2}O", "≈ 露点 −76 °C"] },
    { v: 130, up: false, tx: 380, c: COL.amber, l: ["≈ 130", "工厂干燥间（典型）"] },
    { v: 2.09e5, up: false, tx: 680, c: COL.red, l: ["≈ 21 万", "空气中的 O_{2}"] },
  ];
  marks.forEach((m) => {
    const x = X(m.v);
    b += circ(x, ay, 9, m.c, { stroke: COL.white, sw: 2 });
    if (m.up) {
      b += line(x, ay - 12, m.tx, 150, m.c, 2);
      b += text(m.tx, 108, m.l[0], { size: 24, anchor: "middle", weight: "bold", fill: m.c });
      b += text(m.tx, 138, m.l[1], { size: 19, anchor: "middle", fill: COL.ink });
    } else {
      b += line(x, ay + 12, m.tx, 395, m.c, 2);
      b += text(m.tx, 425, m.l[0], { size: 22, anchor: "middle", weight: "bold", fill: m.c });
      b += text(m.tx, 453, m.l[1], { size: 19, anchor: "middle", fill: COL.ink });
    }
  });
  b += text(X(1), 40, "手套箱的工作区", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X(1e5), 40, "普通空气", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(410, 515, "每往右一格 = 多 10 倍（对数刻度）", { size: 19, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 6. Punching burr (after Luc Fig. 4) ----------
figs.burr = () => {
  const W = 820, H = 540;
  let b = "";
  // (a) edge profile
  b += text(20, 36, "(a) 冲出的圆片边缘", { size: 20, weight: "bold" });
  b += path("M40,100 L190,100 C225,100 240,120 240,160 L240,215 L262,250 L240,240 L40,240 Z", COL.alu, { stroke: COL.siDark, sw: 2 });
  b += line(300, 60, 300, 270, COL.ink, 2, "8 6");
  b += arrow(185, 70, 222, 108, { color: COL.teal, width: 2.5 });
  b += text(40, 76, "塌角 roll-over", { size: 19, fill: COL.teal, weight: "bold" });
  b += arrow(200, 270, 252, 248, { color: COL.red, width: 2.5 });
  b += text(40, 282, "毛刺 burr", { size: 19, fill: COL.red, weight: "bold" });
  // numbers box
  b += rect(20, 320, 270, 200, "#FBEDEC", { rx: 12 });
  b += text(36, 354, "Luc 2022 实测最大高度", { size: 19, weight: "bold", fill: COL.red });
  b += lines(36, 388, ["垫片毛刺  65 µm", "负极毛刺  69–85 µm", "隔膜厚度  只有 23 µm"], { size: 19, lh: 32 });
  b += text(36, 500, "毛刺比隔膜还厚！", { size: 20, weight: "bold", fill: COL.red });
  // (b) stacks
  b += text(330, 36, "(b) 毛刺朝哪边？", { size: 20, weight: "bold" });
  const layers = [
    { n: "垫片", c: "#5B7FC7", w: 150, h: 22, burr: [-1, 1] },
    { n: "负极", c: COL.ink, w: 160, h: 14 },
    { n: "隔膜", c: "#B9C3CC", w: 172, h: 6, sep: true },
    { n: "正极", c: COL.ink, w: 140, h: 14 },
    { n: "垫片", c: "#5B7FC7", w: 150, h: 22 },
  ];
  const ys = [120, 185, 235, 280, 340];
  // burr direction: for each layer except separator, "bad" toward separator, "good" away
  const dirBad = [1, 1, 0, -1, -1];   // +1 = points down
  const dirGood = [-1, -1, 0, 1, 1];
  const drawStack = (cx, dirs) => {
    let s = "";
    layers.forEach((l, i) => {
      const y = ys[i], x = cx - l.w / 2;
      s += rect(x, y, l.w, l.h, l.c, { rx: l.sep ? 2 : 4 });
      if (!l.sep) {
        const d = dirs[i];
        [x + 2, x + l.w - 2].forEach((ex, j) => {
          const by = d > 0 ? y + l.h : y;
          const out = j === 0 ? -1 : 1;
          s += `<polygon points="${ex},${by} ${ex + out * 9},${by} ${ex + out * 9},${by + d * 13}" fill="${COL.red}"/>`;
        });
      }
    });
    return s;
  };
  layers.forEach((l, i) => (b += text(372, ys[i] + l.h / 2 + 7, l.n, { size: 19, anchor: "middle", fill: COL.text2 })));
  b += drawStack(510, dirBad) + drawStack(705, dirGood);
  b += cross(510, 80, 14, COL.red, 5) + text(510, 410, "不推荐：", { size: 19, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(510, 438, "毛刺朝向隔膜", { size: 19, anchor: "middle", fill: COL.red });
  b += check(705, 80, 14, COL.teal, 5) + text(705, 410, "推荐：", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(705, 438, "毛刺朝外", { size: 19, anchor: "middle", fill: COL.teal });
  b += text(610, 500, "红三角 = 毛刺（放大示意）", { size: 19, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 7. Weighing and capacity calculation ----------
figs.mass_calc = () => {
  const W = 820, H = 540;
  let b = "";
  // discs
  b += ell(110, 70, 70, 22, "#4A5866") + ell(110, 64, 70, 22, CATH);
  b += text(110, 125, "涂层圆片 W_{ED}", { size: 19, anchor: "middle", weight: "bold" });
  b += text(110, 152, "9.0 mg", { size: 22, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(225, 80, "−", { size: 44, anchor: "middle", weight: "bold" });
  b += ell(340, 70, 70, 22, "#8794A1") + ell(340, 66, 70, 22, AL);
  b += text(340, 125, "空铝箔圆片 W_{CC}", { size: 19, anchor: "middle", weight: "bold" });
  b += text(340, 152, "5.4 mg", { size: 22, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(455, 80, "=", { size: 44, anchor: "middle", weight: "bold" });
  b += rect(500, 35, 290, 80, "#F1ECF8", { rx: 12 });
  b += text(645, 70, "涂层质量 W_{EM}", { size: 20, anchor: "middle", weight: "bold" });
  b += text(645, 100, "3.6 mg", { size: 22, anchor: "middle", fill: COL.purple, weight: "bold" });
  // step rows
  const rows = [
    { top: 175, op: "× 活性物质占比 70%", res: "活性物质 W_{AM} = 2.52 mg", c: COL.teal, tint: "#E8F4F3" },
    { top: 290, op: "× 额定比容量 155 mAh/g", res: "电极容量 Q ≈ 0.39 mAh", c: COL.amber, tint: "#FDF2E7" },
    { top: 405, op: "÷ 1 小时", res: "1C 电流 ≈ 0.39 mA", c: COL.red, tint: "#FBEDEC" },
  ];
  rows.forEach((r, i) => {
    const prevBot = i === 0 ? 115 : rows[i - 1].top + 62;
    b += arrow(645, prevBot + 6, 645, r.top - 6, { color: COL.muted, width: 3 });
    b += text(630, (prevBot + r.top) / 2 + 7, r.op, { size: 20, anchor: "end", fill: r.c, weight: "bold" });
    b += rect(480, r.top, 330, 62, r.tint, { rx: 12 });
    b += text(645, r.top + 40, r.res, { size: 21, anchor: "middle", weight: "bold", fill: r.c });
  });
  b += text(30, 250, "例：Stein 2016 p. 4", { size: 19, fill: COL.muted });
  b += lines(30, 300, ["C/10 = 0.039 mA", "（10 h 充满）", "", "2C = 0.78 mA", "（30 min 充满）"], { size: 19, lh: 30, fill: COL.text2 });
  b += text(30, 515, "天平要到 0.1 mg：差 0.1 mg 就是约 3% 的误差", { size: 19, fill: COL.red });
  return svg(W, H, b);
};

// ---------- 8. Assembly order in three papers ----------
figs.assembly_compare = () => {
  const W = 1240, H = 400;
  let b = "";
  const k = 9; // px per mm
  const cols = [
    {
      x: 20, title: "Kayyar 2012 · 锂半电池", c: COL.purple,
      L: [["case", 20, "正极壳（+）"], ["e", 0, "电解液 2 滴"], ["cat", 8, "正极 Ø8"], ["e", 0, "电解液 3 滴"], ["sep", 19, "隔膜 Ø19"], ["e", 0, "电解液 2 滴"], ["sep", 19, "隔膜 Ø19"], ["e", 0, "电解液 2 滴"], ["li", 12.7, "锂片 Ø12.7"], ["sp", 15.5, "垫片 ×2"], ["spr", 15, "弹片"], ["cap", 20, "负极盖（−）"]],
    },
    {
      x: 430, title: "Stein 2016 · 锂半电池", c: COL.teal,
      L: [["case", 20, "正极壳（+）"], ["cat", 12.7, "正极 Ø12.7"], ["e", 0, "电解液 1–2 滴"], ["sep", 19, "隔膜 Ø19"], ["gas", 20, "密封圈"], ["e", 0, "电解液 2–3 滴"], ["li", 14.3, "锂片 Ø14.3"], ["sp", 15.5, "垫片 0.5 mm"], ["spr", 15, "波形弹片"], ["e", 0, "灌满 ≈ 0.7 mL"], ["cap", 20, "负极盖（−）"]],
    },
    {
      x: 840, title: "Luc 2022 · 石墨/NMC 全电池", c: COL.amber,
      L: [["cap", 20, "负极壳（−）+ 密封圈"], ["spr", 15, "弹片"], ["sp", 15.5, "垫片 1 mm"], ["an", 16, "石墨负极 Ø16"], ["e", 0, "电解液"], ["sep", 16.5, "隔膜 Ø16.5"], ["e", 0, "电解液（共 75–100 µL）"], ["cat", 14, "NMC 正极 Ø14/16"], ["case", 20, "正极壳（+）"]],
    },
  ];
  const fills = { case: STEEL, cap: "#D5DCE3", cat: CATH, sep: "#C9D2DA", li: LI, sp: COL.si, spr: COL.teal, gas: GASK, an: CU };
  cols.forEach((col) => {
    b += text(col.x + 190, 28, col.title, { size: 20, anchor: "middle", weight: "bold", fill: col.c });
    const cx = col.x + 100;
    const base = 385, rowH = 27;
    col.L.forEach(([kind, d, lab], i) => {
      const y = base - i * rowH;
      if (kind === "e") {
        b += drop(cx, y - 6, 0.75);
        b += text(col.x + 205, y, lab, { size: 17, fill: "#3C86B0" });
        return;
      }
      const w = d * k, h = kind === "sep" ? 6 : kind === "case" || kind === "cap" ? 16 : 11;
      if (kind === "spr") {
        const pts = [];
        for (let j = 0; j <= 24; j++) pts.push([cx - w / 2 + (w * j) / 24, y - 8 + 6 * Math.sin((j / 24) * Math.PI * 4)]);
        b += smooth(pts, COL.teal, 3);
      } else {
        b += rect(cx - w / 2, y - h / 2 - 6, w, h, fills[kind], { rx: 3 });
        if (kind === "cap" && col.x === 840) b += rect(cx - w / 2, y - h / 2 - 12, 12, 8, GASK) + rect(cx + w / 2 - 12, y - h / 2 - 12, 12, 8, GASK);
      }
      b += text(col.x + 205, y, lab, { size: 17, fill: COL.ink, weight: kind === "cat" || kind === "li" || kind === "an" ? "bold" : undefined });
    });
    b += arrow(col.x + 2, 385, col.x + 2, 385 - (col.L.length - 1) * 27, { color: COL.line, width: 2.5, head: 10 });
  });
  b += line(420, 45, 420, 392, COL.line, 1.5) + line(830, 45, 830, 392, COL.line, 1.5);
  return svg(W, H, b);
};

// ---------- 9. Crimping cross-section ----------
figs.crimp = () => {
  const W = 820, H = 470;
  let b = "";
  const panel = (ox, crimped) => {
    let s = "";
    const x0 = ox + 20, x1 = ox + 360, yb = 285, hCase = 120;
    const wall = 8;
    // case (+): U shape; when crimped, the top of the wall bends inward
    if (!crimped) {
      s += path(`M${x0},${yb - hCase} L${x0},${yb} L${x1},${yb} L${x1},${yb - hCase} L${x1 - wall},${yb - hCase} L${x1 - wall},${yb - wall} L${x0 + wall},${yb - wall} L${x0 + wall},${yb - hCase} Z`, STEEL_D);
    } else {
      s += path(`M${x0},${yb - hCase + 20} L${x0},${yb} L${x1},${yb} L${x1},${yb - hCase + 20} L${x1 - 26},${yb - hCase + 4} L${x1 - 32},${yb - hCase + 12} L${x1 - wall},${yb - hCase + 26} L${x1 - wall},${yb - wall} L${x0 + wall},${yb - wall} L${x0 + wall},${yb - hCase + 26} L${x0 + 32},${yb - hCase + 12} L${x0 + 26},${yb - hCase + 4} Z`, STEEL_D);
    }
    const capTop = crimped ? yb - 106 : yb - 152;
    // cap (−): inverted U
    const cx0 = x0 + 20, cx1 = x1 - 20;
    s += path(`M${cx0},${capTop + 70} L${cx0},${capTop} L${cx1},${capTop} L${cx1},${capTop + 70} L${cx1 - 7},${capTop + 70} L${cx1 - 7},${capTop + 7} L${cx0 + 7},${capTop + 7} L${cx0 + 7},${capTop + 70} Z`, "#AEB8C2");
    // gasket around cap skirt
    s += rect(cx0 - 10, capTop + 18, 10, 58, GASK) + rect(cx1, capTop + 18, 10, 58, GASK);
    s += rect(cx0 - 10, capTop + 70, 24, 8, GASK) + rect(cx1 - 14, capTop + 70, 24, 8, GASK);
    // internal stack
    const yC = yb - wall;
    s += rect(x0 + 90, yC - 12, 160, 12, CATH);                       // cathode
    s += rect(x0 + 40, yC - 18, 260, 5, "#C9D2DA");                   // separator
    s += rect(x0 + 75, yC - 32, 190, 14, LI);                         // Li
    s += rect(x0 + 70, yC - 50, 200, 16, COL.si);                     // spacer
    // spring
    const sTop = capTop + 7, sBot = yC - 50;
    const amp = (sBot - sTop) / 2 - 1;
    const pts = [];
    for (let j = 0; j <= 30; j++) pts.push([x0 + 80 + (180 * j) / 30, (sTop + sBot) / 2 + amp * Math.cos((j / 30) * Math.PI * 3)]);
    s += smooth(pts, COL.teal, 4);
    return s;
  };
  b += panel(0, false) + panel(410, true);
  b += text(190, 40, "封口前", { size: 24, anchor: "middle", weight: "bold" });
  b += text(600, 40, "封口后", { size: 24, anchor: "middle", weight: "bold", fill: COL.teal });
  b += arrow(600, 52, 600, 92, { color: COL.red, width: 4, head: 14 });
  b += text(615, 82, "压力", { size: 19, fill: COL.red, weight: "bold" });
  b += lines(190, 322, ["盖子浮在上面", "弹片还没被压"], { size: 19, anchor: "middle", fill: COL.text2, lh: 28 });
  b += lines(600, 322, ["壳边向内卷，压紧密封圈", "弹片把叠层压实"], { size: 19, anchor: "middle", fill: COL.text2, lh: 28 });
  // legend
  const lg = [[GASK, "密封圈"], [COL.teal, "弹片"], [COL.si, "垫片"], [LI, "锂片"], [CATH, "正极"]];
  lg.forEach(([c, n], i) => (b += rect(40 + i * 152, 390, 22, 22, c, { rx: 4 }) + text(70 + i * 152, 409, n, { size: 19 })));
  b += text(410, 455, "纵向放大，示意；密封圈也把正、负两极隔开（绝缘）", { size: 19, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 10. Half cell vs full cell ----------
figs.half_full = () => {
  const W = 820, H = 540;
  let b = "";
  const panel = (ox, full) => {
    let s = "";
    const y0 = 80;
    s += text(ox + 185, y0 - 30, full ? "全电池 full cell" : "半电池 half cell", { size: 22, anchor: "middle", weight: "bold", fill: full ? COL.amber : COL.purple });
    // cathode: Al + coating
    s += rect(ox + 20, y0, 14, 240, AL) + rect(ox + 34, y0, 50, 240, CATH);
    s += text(ox + 52, y0 + 270, "NMC", { size: 19, anchor: "middle", weight: "bold" });
    // separator
    s += rect(ox + 100, y0 - 10, 10, 260, "#C9D2DA");
    if (!full) {
      s += rect(ox + 126, y0, 230, 240, LI);
      s += text(ox + 241, y0 + 110, "锂片", { size: 24, anchor: "middle", weight: "bold", fill: COL.white });
      s += text(ox + 241, y0 + 140, "0.75 mm 厚", { size: 19, anchor: "middle", fill: COL.white });
      s += text(ox + 241, y0 + 270, "又当对电极，又当参比", { size: 19, anchor: "middle", fill: COL.purple });
    } else {
      s += rect(ox + 126, y0, 56, 240, "#3B4A59") + rect(ox + 182, y0, 12, 240, CU);
      s += text(ox + 155, y0 + 270, "石墨", { size: 19, anchor: "middle", weight: "bold" });
      s += text(ox + 285, y0 + 100, "负极稍多一点", { size: 19, anchor: "middle", fill: COL.amber, weight: "bold" });
      s += text(ox + 285, y0 + 128, "N/P ≈ 1.1–1.2", { size: 19, anchor: "middle", fill: COL.amber });
      s += text(ox + 285, y0 + 156, "（典型值）", { size: 19, anchor: "middle", fill: COL.muted });
    }
    return s;
  };
  b += panel(20, false) + panel(430, true);
  b += line(415, 40, 415, 380, COL.line, 2);
  // capacity bars
  b += text(30, 430, "容量对比（Stein 2016 的半电池，计算）", { size: 19, weight: "bold" });
  b += rect(30, 446, 3, 26, COL.ink) + text(42, 467, "正极 0.39 mAh", { size: 19 });
  b += rect(30, 484, 760, 26, LI, { rx: 4 }) + text(400, 504, "锂片 ≈ 248 mAh（约 600 倍）", { size: 19, anchor: "middle", fill: COL.white, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 11. C-rate: same area, different shapes ----------
figs.crate = () => {
  const W = 820, H = 550;
  let b = "";
  const ox = 90, oy = 440, px = 64, py = 15; // px per hour, px per 0.039 mA unit
  b += line(ox, oy, ox + 10.6 * px, oy, COL.ink, 2.5) + line(ox, oy, ox, oy - 22 * py, COL.ink, 2.5);
  b += head(ox + 10.6 * px + 12, oy, 0, COL.ink, 14) + head(ox, oy - 22 * py - 12, -Math.PI / 2, COL.ink, 14);
  b += text(ox + 10.6 * px, oy + 62, "时间（h）", { size: 19, anchor: "end", fill: COL.text2 });
  b += text(ox - 10, oy - 22 * py - 22, "电流（mA）", { size: 19, fill: COL.text2 });
  [0, 2, 4, 6, 8, 10].forEach((t) => (b += text(ox + t * px, oy + 28, String(t), { size: 19, anchor: "middle", fill: COL.muted })));
  // rectangles: C/10 (1 unit × 10 h), 1C (10 × 1), 2C (20 × 0.5)
  b += rect(ox, oy - 1 * py, 10 * px, 1 * py, COL.teal, { opacity: 0.85 });
  b += rect(ox, oy - 10 * py, 1 * px, 10 * py, COL.amber, { opacity: 0.8 });
  b += rect(ox, oy - 20 * py, 0.5 * px, 20 * py, COL.red, { opacity: 0.75 });
  b += text(ox + 5 * px, oy - 1 * py - 12, "C/10：0.039 mA × 10 h", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += line(ox + px + 4, oy - 8 * py, ox + 2.2 * px, oy - 8 * py, COL.amber, 2);
  b += text(ox + 2.3 * px, oy - 8 * py + 7, "1C：0.39 mA × 1 h", { size: 20, weight: "bold", fill: COL.amber });
  b += line(ox + 0.5 * px + 4, oy - 17 * py, ox + 2.2 * px, oy - 17 * py, COL.red, 2);
  b += text(ox + 2.3 * px, oy - 17 * py + 7, "2C：0.78 mA × 0.5 h", { size: 20, weight: "bold", fill: COL.red });
  b += rect(450, 70, 340, 110, "#F1F3F5", { rx: 12 });
  b += text(620, 110, "面积 = 电流 × 时间 = 容量", { size: 20, anchor: "middle", weight: "bold" });
  b += text(620, 145, "三块面积一样：都是 0.39 mAh", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(300, 530, "数值取 Stein 2016 的例子（Q = 0.39 mAh）", { size: 19, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 12. First cycle (after Kayyar Fig. 3) ----------
figs.first_cycle = () => {
  const W = 820, H = 540;
  let b = "";
  const ox = 100, oy = 440, wx = 660, hy = 380;
  const X = (q) => ox + (q / 160) * wx;
  const Y = (v) => oy - ((v - 3.0) / 1.4) * hy;
  b += rect(ox, Y(4.4), wx, hy, "#FFFFFF", { stroke: COL.line, sw: 1.5 });
  [3.2, 3.6, 4.0, 4.4].forEach((v) => {
    b += line(ox, Y(v), ox + wx, Y(v), "#EEF2F5", 1.5);
    b += text(ox - 10, Y(v) + 7, v.toFixed(1), { size: 19, anchor: "end", fill: COL.muted });
  });
  [0, 40, 80, 120, 160].forEach((q) => (b += text(X(q), oy + 28, String(q), { size: 19, anchor: "middle", fill: COL.muted })));
  b += text(ox + wx / 2, oy + 60, "比容量（mAh/g）", { size: 19, anchor: "middle", fill: COL.text2 });
  b += `<g transform="rotate(-90 32 ${oy - hy / 2})">` + text(32, oy - hy / 2, "电压（V vs Li）", { size: 19, anchor: "middle", fill: COL.text2 }) + `</g>`;
  const ch = [[0, 3.2], [1, 3.9], [3, 3.96], [10, 3.94], [40, 3.935], [60, 3.95], [80, 3.98], [100, 4.03], [115, 4.07], [125, 4.13], [132, 4.19], [140, 4.215], [148, 4.25], [155, 4.3]];
  const dc = [[0, 4.27], [10, 4.21], [18, 4.17], [25, 4.08], [40, 4.03], [60, 3.955], [80, 3.915], [100, 3.9], [120, 3.89], [130, 3.875], [135, 3.83], [138, 3.6], [139.5, 3.2], [140, 3.0]];
  b += smooth(ch.map(([q, v]) => [X(q), Y(v)]), COL.ink, 4);
  b += smooth(dc.map(([q, v]) => [X(q), Y(v)]), COL.red, 4);
  b += text(X(20), Y(3.78), "首次充电", { size: 20, weight: "bold" });
  b += text(X(40), Y(4.2), "首次放电", { size: 20, weight: "bold", fill: COL.red });
  // capacity markers
  b += line(X(155), Y(4.3), X(155), Y(3.0), COL.ink, 1.5, "5 5") + line(X(140), Y(3.6), X(140), Y(3.0), COL.red, 1.5, "5 5");
  b += text(X(155) + 6, Y(3.4), "155", { size: 19, weight: "bold" });
  b += text(X(140) - 14, Y(3.12), "140", { size: 19, anchor: "end", weight: "bold", fill: COL.red });
  b += rect(X(52), Y(3.58), 290, 74, "#FDF2E7", { rx: 10 });
  b += text(X(52) + 145, Y(3.58) + 30, "首圈库仑效率", { size: 19, anchor: "middle", fill: COL.amber, weight: "bold" });
  b += text(X(52) + 145, Y(3.58) + 58, "140 ÷ 155 ≈ 90%", { size: 20, anchor: "middle", weight: "bold" });
  b += text(X(1) + 10, Y(3.2) + 7, "← 起点 ≈ 开路电压", { size: 19, fill: COL.teal });
  return svg(W, H, b);
};

module.exports = figs;
