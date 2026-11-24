// Figures for 锂电池制造 第 5 章：让数据可信——扣式电池的可重复性与最佳实践
// Papers: Dai & Cai, Commun. Mater. 3, 64 (2022); Luc, Bauer & Kowal, Energies 15, 7949 (2022)
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline } = L;

const figs = {};
const CATH = COL.amber;        // cathode coating
const CATH_L = COL.amberLight;
const GRAPH = COL.siDark;      // graphite anode
const LIM = COL.alu;           // lithium metal
const SEP = "#F4F6F8";         // separator
const ELY = COL.electrolyte;   // electrolyte
const STEEL = COL.si;          // spacer / case

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const pline = (pts, c, w = 3, o = {}) =>
  `<polyline points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
// Double-headed vertical dimension arrow
const vdim = (x, y1, y2, c, w = 2.5) => arrow(x, (y1 + y2) / 2, x, y1, { color: c, width: w, head: 10 }) + arrow(x, (y1 + y2) / 2, x, y2, { color: c, width: w, head: 10 });
// Zig-zag spring between y1 (bottom) and y2 (top)
function spring(x1, x2, yb, yt, n, c = COL.ink) {
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([x1 + ((x2 - x1) * i) / n, i % 2 === 0 ? yb : yt]);
  return pline(pts, c, 3.5);
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 470, H = 560;
  let b = "";
  // five coin cells
  const xs = [60, 147, 235, 323, 410];
  xs.forEach((x, i) => {
    b += circ(x, 85, 38, "#56636F", { stroke: "#AEB8C2", sw: 4 });
    b += circ(x, 85, 27, "#7C8B99");
    b += text(x, 93, `#${i + 1}`, { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  });
  // dot plot
  const y0 = 330, sc = 120; // value axis: 4.0..5.0 -> y
  const vals = [4.3, 4.6, 4.1, 4.5, 4.8];
  const Y = (v) => y0 - (v - 4.0) * sc * 1.6;
  b += line(30, y0 + 20, 440, y0 + 20, "#4A5866", 3);
  b += rect(30, Y(4.45 + 0.27), 410, Y(4.45 - 0.27) - Y(4.45 + 0.27), "#1F8A84", { opacity: 0.35, rx: 6 });
  b += line(30, Y(4.45), 440, Y(4.45), COL.amber, 4, "12 8");
  vals.forEach((v, i) => (b += circ(xs[i], Y(v), 13, "#FFFFFF", { stroke: "#9FD3CF", sw: 4 })));
  b += text(235, 425, "均值 ± 标准差，n = 5", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(235, 462, "一颗电池不算数", { size: 21, anchor: "middle", fill: "#CADCE8" });
  b += pill(55, 500, 360, 42, COL.amber, "Dai & Cai 2022 · Luc et al. 2022", { size: 18 });
  return svg(W, H, b);
};

// ---------- 1. History timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const P = COL.purple, T = COL.teal, A = COL.amber;
  const ev = [
    { year: "1908", who: ["Gosset"], what: ["“Student” t 分布", "小样本统计"], color: P },
    { year: "1935", who: ["Fisher；K. Fischer"], what: ["实验设计一书", "微量水滴定"], color: P },
    { year: "1959", who: ["C. Daniel"], what: ["半正态图", "找显著效应"], color: P },
    { year: "2011", who: ["Marks 等 (Dahn)"], what: ["扣式电池", "电极制作指南"], color: T },
    { year: "2016", who: ["Long 等 (Argonne)"], what: ["每组 30 颗", "组装标准化"], color: T },
    { year: "2019", who: ["Chen 等；Murray 等"], what: ["锂金属关键参数", "全电池扣式指南"], color: T },
    { year: "2021", who: ["Hu 等 (Joule)"], what: ["石墨全电池", "高度可重复"], color: T },
    { year: "2022", who: ["Dai & Cai；Luc 等"], what: ["最佳实践", "128 颗 DoE"], color: A },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 95, right: 1115, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(560, 392, 190, 32, P, "统计与测量方法", { size: 17 }) + pill(765, 392, 210, 32, T, "电池组装指南", { size: 17 }) + pill(990, 392, 210, 32, A, "本章两篇论文", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Fishbone (redraw of Luc Fig. 3) ----------
figs.fishbone = () => {
  const W = 820, H = 540;
  let b = "";
  const sy = 270;
  b += line(30, sy, 600, sy, COL.ink, 6);
  b += poly([[600, sy - 18], [628, sy], [600, sy + 18]], COL.ink);
  b += rect(630, sy - 62, 180, 124, COL.ink, { rx: 14 });
  b += text(720, sy - 10, "可重复性", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(720, sy + 24, "Reproducibility", { size: 19, anchor: "middle", fill: "#CADCE8" });
  const bones = [
    { x: 160, top: true, title: "材料", en: "Materials", c: COL.amber, items: ["储存条件", "含水、杂质", "成分与批次", "尺寸"] },
    { x: 440, top: true, title: "设备", en: "Equipment", c: COL.teal, items: ["清洁", "工具质量", "工具是否合适"] },
    { x: 160, top: false, title: "生产", en: "Production", c: COL.purple, items: ["工作环境", "组装顺序", "每步用时"] },
    { x: 440, top: false, title: "组装者", en: "Assembler", c: COL.red, items: ["知识", "经验", "手法与精度"] },
  ];
  bones.forEach((g) => {
    const y0 = g.top ? 78 : 462;
    const x1 = g.x + 120;
    b += line(g.x, y0, x1, sy, g.c, 5);
    b += pill(g.x - 95, g.top ? 20 : 470, 190, 46, g.c, `${g.title} ${g.en}`, { size: 19 });
    const n = g.items.length;
    g.items.forEach((it, i) => {
      const t = (i + 1) / (n + 1);
      const yy = y0 + (sy - y0) * t;
      const xx = g.x + 120 * t;
      b += line(xx - 14, yy, xx, yy, g.c, 3);
      b += text(xx - 20, yy + 7, it, { size: 19, anchor: "end", fill: COL.ink });
    });
  });
  return svg(W, H, b);
};

// ---------- 3. Alignment & electrode mass ----------
figs.alignment = () => {
  const W = 820, H = 540;
  let b = "";
  // panel a: equal discs, misaligned
  b += text(200, 32, "两片一样大（16 / 16 mm）", { size: 21, anchor: "middle", weight: "bold" });
  b += circ(190, 150, 95, GRAPH);
  b += circ(214, 150, 95, CATH, { opacity: 0.85 });
  b += `<path d="M 202.6 57.4 A 95 95 0 0 1 202.6 242.6" fill="none" stroke="${COL.red}" stroke-width="7"/>`;
  b += circ(214, 150, 95, "none", { stroke: COL.red, sw: 0 });
  b += text(200, 280, "偏 1 mm，正极边就露在外面", { size: 19, anchor: "middle", fill: COL.red });
  b += text(200, 306, "→ 边缘直接析锂", { size: 19, anchor: "middle", fill: COL.red, weight: "bold" });
  b += cross(330, 70, 12, COL.red, 5);
  // panel b: anode larger
  b += text(610, 32, "负极大一圈（16 / 14 mm）", { size: 21, anchor: "middle", weight: "bold" });
  b += circ(610, 150, 95, GRAPH);
  b += circ(620, 150, 83, CATH, { opacity: 0.9 });
  b += text(610, 280, "偏一点也能盖住正极", { size: 19, anchor: "middle", fill: COL.teal });
  b += text(610, 306, "面积比 (16 ÷ 14)² ≈ 1.31", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += check(742, 70, 14, COL.teal, 6);
  // legend
  b += rect(352, 118, 22, 22, GRAPH, { rx: 4 }) + text(380, 136, "负极", { size: 19 });
  b += rect(352, 160, 22, 22, CATH, { rx: 4 }) + text(380, 178, "正极", { size: 19 });
  // weighing panel
  b += rect(20, 335, 780, 190, COL.light, { rx: 16 });
  b += text(40, 372, "每一片都称重，再算面载量", { size: 21, weight: "bold" });
  // scale icon
  b += rect(60, 470, 130, 22, COL.siDark, { rx: 6 }) + rect(110, 430, 30, 42, COL.si) + rect(55, 420, 140, 12, COL.siDark, { rx: 4 });
  b += `<ellipse cx="125" cy="413" rx="45" ry="9" fill="${CATH}"/>`;
  b += text(125, 515, "0.01 mg 天平", { size: 19, anchor: "middle", fill: COL.text2 });
  b += lines(230, 415, ["涂层质量 = 极片质量 − 同面积空箔质量", "面载量 (mg/cm²) = 涂层质量 ÷ 面积", "用每片自己的质量算比容量，不用“平均值”"], { size: 19, lh: 36 });
  return svg(W, H, b);
};

// ---------- 4. Punching burr (redraw of Luc Fig. 4) ----------
figs.burr = () => {
  const W = 820, H = 540;
  let b = "";
  // (a) profile of a punched disc edge
  b += text(20, 34, "(a) 冲出来的圆片边缘（剖面）", { size: 24, weight: "bold" });
  b += `<path d="M 40 70 L 300 70 C 345 70 360 90 360 125 L 360 175 L 372 205 L 352 185 L 40 185 Z" fill="${COL.purple}" opacity="0.85"/>`;
  b += line(380, 70, 500, 70, COL.muted, 2, "6 5") + line(380, 125, 500, 125, COL.muted, 2, "6 5");
  b += text(505, 104, "圆角 roll-over（无害）", { size: 23, fill: COL.text2 });
  b += line(380, 185, 500, 185, COL.muted, 2, "6 5") + line(380, 207, 500, 207, COL.muted, 2, "6 5");
  b += text(505, 204, "毛刺 burr（尖、会扎）", { size: 23, fill: COL.red, weight: "bold" });
  // (b) stacks
  b += text(20, 262, "(b) 毛刺朝哪边？", { size: 24, weight: "bold" });
  const layers = [
    ["垫片", STEEL, 24], ["负极", GRAPH, 20], ["隔膜", "#C9D2DA", 10], ["正极", CATH, 20], ["垫片", STEEL, 24],
  ];
  const stack = (x0, good) => {
    let s = "";
    let y = 284;
    const widths = [280, 270, 300, 240, 280];
    layers.forEach(([nm, c, h], i) => {
      const w = widths[i];
      const x = x0 + (300 - w) / 2;
      s += rect(x, y, w, h, c, { rx: 3 });
      // burr triangles: towards separator (bad) or outward (good)
      if (i !== 2) {
        const towardSep = i < 2 ? 1 : -1; // layers above separator: burr pointing down = towards separator
        const dir = good ? -towardSep : towardSep;
        const ex = x + w; // right edge
        const yEdge = dir > 0 ? y + h : y;
        s += poly([[ex - 12, yEdge], [ex, yEdge], [ex, yEdge + dir * 13]], COL.red);
      }
      y += h + 26;
    });
    return s;
  };
  b += stack(20, false);
  b += stack(500, true);
  let y = 284;
  layers.forEach(([nm, , h]) => {
    b += text(410, y + h / 2 + 7, nm, { size: 23, anchor: "middle", fill: COL.text2 });
    y += h + 26;
  });
  b += cross(170, 518, 13, COL.red, 5) + text(195, 526, "朝向隔膜：可能扎穿", { size: 23, fill: COL.red });
  b += check(640, 518, 14, COL.teal, 6) + text(665, 526, "朝外", { size: 23, fill: COL.teal, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 5. Internal pressure (redraw of Dai Fig. 2) ----------
figs.pressure = () => {
  const W = 820, H = 540;
  let b = "";
  const cell = (y, spacerH, title, tc, note) => {
    let s = "";
    s += text(30, y - 14, title, { size: 21, weight: "bold", fill: tc });
    s += rect(30, y, 540, 170, "#FFFFFF", { rx: 16, stroke: COL.ink, sw: 4 });
    const yb = y + 164;
    const cathT = yb - 12, sepT = cathT - 8, liT = sepT - 24, spT = liT - spacerH;
    s += rect(110, cathT, 380, 12, CATH, { rx: 2 });
    s += rect(85, sepT, 430, 8, "#C9D2DA", { rx: 2 });
    s += rect(100, liT, 400, 24, LIM, { rx: 3, stroke: COL.siDark, sw: 1.5 });
    s += rect(80, spT, 440, spacerH, STEEL, { rx: 3 });
    s += spring(110, 490, spT - 2, y + 8, 12);
    s += vdim(545, y + 6, spT, tc);
    s += text(600, y + 62, note[0], { size: 19, weight: "bold", fill: tc });
    s += text(600, y + 92, note[1], { size: 19, fill: COL.text2 });
    s += text(600, y + 122, note[2], { size: 19, fill: tc, weight: "bold" });
    // labels inside
    s += text(300, spT + spacerH / 2 + 7, spacerH > 20 ? "厚垫片" : "", { size: 19, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    return s;
  };
  b += cell(40, 34, "(a) 压力较高", COL.red, ["弹簧间隙小", "弹簧压得多", "→ 压力大"]);
  b += cell(320, 12, "(b) 压力较低", COL.teal, ["弹簧间隙大", "弹簧压得少", "→ 压力小"]);
  b += text(300, 316, "", { size: 19 });
  // legend
  const lg = [["正极", CATH], ["隔膜", "#C9D2DA"], ["锂片", LIM], ["垫片", STEEL]];
  lg.forEach(([n, c], i) => (b += rect(40 + i * 140, 510, 22, 22, c, { rx: 4 }) + text(70 + i * 140, 528, n, { size: 19 })));
  return svg(W, H, b);
};

// ---------- 6. Electrolyte budget: pore volume ----------
figs.pore_budget = () => {
  const W = 820, H = 540;
  let b = "";
  b += text(20, 32, "电解液要填满三层材料的孔", { size: 21, weight: "bold" });
  const slab = (y, h, fill, label, pores, seed) => {
    let s = rect(190, y, 600, h, fill, { rx: 4 });
    const R = L.rng(seed);
    for (let i = 0; i < pores; i++) s += circ(200 + R() * 580, y + 6 + R() * (h - 12), 5 + R() * 4, ELY, { stroke: "#7FB8D6", sw: 1.5 });
    s += text(175, y + h / 2 + 7, label, { size: 19, anchor: "end" });
    return s;
  };
  b += slab(55, 66, GRAPH, "负极 110 µm", 60, 3);
  b += slab(131, 18, "#E3E8EC", "隔膜 23 µm", 18, 7);
  b += slab(159, 64, CATH, "正极 109 µm", 45, 11);
  b += text(190, 258, "蓝点 = 孔（要被电解液填满）", { size: 19, fill: COL.text2 });
  // calculation
  b += rect(20, 282, 780, 248, COL.light, { rx: 16 });
  b += text(40, 318, "孔体积 = 面积 × 厚度 × 孔隙率", { size: 21, weight: "bold", fill: COL.teal });
  b += lines(40, 356, [
    "负极 Ø16 mm：2.01 cm² × 0.0110 cm × 60.1% ≈ 13.3 µL",
    "正极 Ø14 mm：1.54 cm² × 0.0109 cm × 51.4% ≈ 8.6 µL",
    "隔膜 Ø16.5 mm：2.14 cm² × 0.0023 cm × 56% ≈ 2.8 µL",
  ], { size: 19, lh: 34 });
  b += line(40, 452, 780, 452, COL.line, 2);
  b += text(40, 485, "合计孔体积 PV ≈ 24.7 µL", { size: 20, weight: "bold" });
  b += text(40, 516, "3 × PV ≈ 74 µL（原文 74.5 µL）；另一组用 100 µL", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 7. Same person, same rhythm, same temperature ----------
figs.assembler = () => {
  const W = 820, H = 540;
  let b = "";
  const cols = [
    { x: 140, c: COL.purple, t: "同一个人", lines: ["正式实验前", "先练约 50 颗", "一个实验中途", "不换人"] },
    { x: 410, c: COL.teal, t: "同样节奏", lines: ["每一步用时", "相同且尽量短", "（电解液会挥发）", "工具放在手边"] },
    { x: 680, c: COL.amber, t: "同一环境", lines: ["恒温箱测试", "（Luc：30 °C）", "手套箱 H₂O、O₂", "< 5 ppm"] },
  ];
  cols.forEach((k, i) => {
    b += rect(k.x - 125, 20, 250, 440, i === 0 ? "#F1ECF8" : i === 1 ? "#E8F4F3" : "#FDF2E7", { rx: 18 });
    const cy = 120;
    if (i === 0) {
      b += circ(k.x, cy - 30, 30, k.c) + `<path d="M ${k.x - 55} ${cy + 55} C ${k.x - 50} ${cy + 5}, ${k.x + 50} ${cy + 5}, ${k.x + 55} ${cy + 55} Z" fill="${k.c}"/>`;
    } else if (i === 1) {
      b += circ(k.x, cy, 58, "#FFFFFF", { stroke: k.c, sw: 7 });
      b += line(k.x, cy, k.x, cy - 38, k.c, 6) + line(k.x, cy, k.x + 28, cy + 12, k.c, 6);
      for (let a = 0; a < 12; a++) {
        const r1 = 46, r2 = 52, an = (a * Math.PI) / 6;
        b += line(k.x + r1 * Math.sin(an), cy - r1 * Math.cos(an), k.x + r2 * Math.sin(an), cy - r2 * Math.cos(an), k.c, 3);
      }
    } else {
      b += rect(k.x - 14, cy - 62, 28, 100, "#FFFFFF", { rx: 14, stroke: k.c, sw: 5 });
      b += circ(k.x, cy + 50, 24, k.c) + rect(k.x - 6, cy - 20, 12, 60, k.c);
      b += text(k.x + 40, cy - 20, "30 °C", { size: 20, weight: "bold", fill: k.c });
    }
    b += text(k.x, 240, k.t, { size: 24, anchor: "middle", weight: "bold", fill: k.c });
    b += lines(k.x, 290, k.lines, { size: 19, anchor: "middle", lh: 34 });
  });
  b += text(410, 510, "据 Luc 等 2022 第 3.1.3–3.1.4、3.4 节整理", { size: 19, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 8. Dot plot, mean, s, SE, CI ----------
figs.cv_dots = () => {
  const W = 820, H = 540;
  let b = "";
  const vals = [4.1, 4.3, 4.4, 4.5, 4.6, 4.8];
  const mean = 4.45, s = 0.243, se = 0.099, ci = 0.255;
  const Y = (v) => 400 - (v - 3.9) * 300; // 3.9 -> 400, 5.0 -> 70
  // axis
  b += line(80, 70, 80, 410, COL.ink, 2.5);
  [4.0, 4.2, 4.4, 4.6, 4.8, 5.0].forEach((v) => {
    b += line(74, Y(v), 80, Y(v), COL.ink, 2) + text(68, Y(v) + 7, v.toFixed(1), { size: 19, anchor: "end", fill: COL.text2 });
    b += line(80, Y(v), 470, Y(v), "#EEF2F5", 1.5);
  });
  b += text(28, 50, "容量 (mAh)", { size: 19, fill: COL.text2 });
  b += rect(80, Y(mean + s), 390, Y(mean - s) - Y(mean + s), COL.teal, { opacity: 0.15 });
  b += line(80, Y(mean), 470, Y(mean), COL.amber, 3.5, "10 7");
  const xs = [120, 180, 240, 300, 360, 420];
  [4.4, 4.1, 4.6, 4.3, 4.8, 4.5].forEach((v, i) => {
    b += circ(xs[i], Y(v), 12, COL.purple);
    b += text(xs[i], 438, `#${i + 1}`, { size: 19, anchor: "middle", fill: COL.text2 });
  });
  b += text(200, Y(mean) - 10, "均值", { size: 19, fill: COL.amber, weight: "bold" });
  // error bars on the right
  const bars = [["±s", s, COL.teal, "单颗离散"], ["±SE", se, COL.purple, "均值的误差"], ["95% CI", ci, COL.amber, "置信区间"]];
  bars.forEach(([lab, e, c, sub], i) => {
    const x = 560 + i * 95;
    b += line(x, Y(mean + e), x, Y(mean - e), c, 4) + line(x - 16, Y(mean + e), x + 16, Y(mean + e), c, 4) + line(x - 16, Y(mean - e), x + 16, Y(mean - e), c, 4);
    b += circ(x, Y(mean), 9, c);
    b += text(x, 438, lab, { size: 19, anchor: "middle", weight: "bold", fill: c });
  });
  b += text(655, 470, "同一组数据，三种误差棒", { size: 19, anchor: "middle", fill: COL.text2 });
  // formulas
  b += rect(20, 485, 780, 50, COL.light, { rx: 12 });
  b += text(410, 518, "x̄ = 4.45 mAh   s = 0.24 mAh   CV = s ÷ x̄ ≈ 5.5%   n = 6", { size: 20, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- 9. 2^4 full factorial design (Luc DoE) ----------
figs.doe_cube = () => {
  const W = 820, H = 540;
  let b = "";
  const cube = (ox, oy, title, c) => {
    let s = "";
    const a = 170, dx = 70, dy = -55;
    const F = [[ox, oy], [ox + a, oy], [ox + a, oy + a], [ox, oy + a]];
    const B = F.map(([x, y]) => [x + dx, y + dy]);
    const edges = [[F[0], F[1]], [F[1], F[2]], [F[2], F[3]], [F[3], F[0]], [B[0], B[1]], [B[1], B[2]], [B[2], B[3]], [B[3], B[0]], [F[0], B[0]], [F[1], B[1]], [F[2], B[2]], [F[3], B[3]]];
    edges.forEach(([p, q]) => (s += line(p[0], p[1], q[0], q[1], COL.line, 3)));
    [...F, ...B].forEach(([x, y]) => (s += circ(x, y, 17, c) + text(x, y + 7, "8", { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" })));
    s += text(ox + (a + dx) / 2, oy + a + 55, title, { size: 21, anchor: "middle", weight: "bold", fill: c });
    return s;
  };
  b += cube(70, 200, "D：1 层隔膜", COL.teal);
  b += cube(470, 200, "D：2 层隔膜", COL.purple);
  // axis labels for the left cube
  b += text(155, 135 - 50, "", { size: 19 });
  b += text(40, 30, "四个因素，各取两个水平：", { size: 21, weight: "bold" });
  b += text(40, 66, "A 弹簧：碟形 / 波形", { size: 19 }) + text(430, 66, "B 面积比：1.0 / 1.3", { size: 19 });
  b += text(40, 98, "C 电解液：3 PV / 100 µL", { size: 19 }) + text(430, 98, "D 隔膜：1 / 2 层", { size: 19 });
  b += rect(20, 455, 780, 70, COL.light, { rx: 14 });
  b += text(410, 500, "2⁴ = 16 种组合 × 每种 8 颗 = 128 颗电池", { size: 22, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- 10. What to report: parameters on a half cell ----------
figs.params_cell = () => {
  const W = 820, H = 540;
  let b = "";
  // stack (bottom to top): Al foil, cathode, separator+electrolyte, Li, spacer, spring
  const x0 = 40, w = 330;
  b += rect(x0 - 15, 25, w + 30, 265, ELY, { rx: 14, opacity: 0.8 });
  b += spring(x0 + 20, x0 + w - 20, 75, 40, 10);
  b += rect(x0, 78, w, 26, STEEL, { rx: 3 });
  b += rect(x0 + 10, 110, w - 20, 54, LIM, { rx: 3, stroke: COL.siDark, sw: 1.5 });
  b += rect(x0 - 5, 170, w + 10, 10, "#C9D2DA", { rx: 2 });
  b += rect(x0 + 30, 186, w - 60, 34, CATH, { rx: 2 });
  b += rect(x0 + 30, 222, w - 60, 8, COL.alu);
  b += text(x0 + w / 2, 144, "锂片", { size: 19, anchor: "middle", weight: "bold", fill: COL.ink });
  b += text(x0 + w / 2, 210, "正极涂层", { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(x0 + w / 2, 272, "电解液", { size: 19, anchor: "middle", fill: "#2F6F8F" });
  // callouts
  const call = (y1, y2, n, t, c) => line(x0 + w + 20, y1, 440, y2, c, 2.5) + circ(452, y2 - 6, 15, c) + text(452, y2, String(n), { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF" }) + text(478, y2, t, { size: 19, fill: c, weight: "bold" });
  b += call(203, 210, 1, "面载量 → 面容量", COL.amber);
  b += call(137, 150, 2, "锂片厚度 → N/P", COL.siDark);
  b += call(272, 268, 3, "电解液量 → E/C", "#2F6F8F");
  b += call(60, 92, 4, "弹簧+垫片 → 压力", COL.purple);
  b += text(478, 34, "⑤ 温度：恒温箱 °C", { size: 19, fill: COL.red, weight: "bold" });
  // formulas
  b += rect(20, 315, 780, 215, COL.light, { rx: 16 });
  b += lines(40, 352, [
    "面容量 (mAh/cm²) = 面载量 × 活性物占比 × 比容量",
    "N/P = 负极面容量 ÷ 正极面容量",
    "E/C (g/Ah) = 电解液质量 ÷ 电池容量",
    "锂金属：1 µm ≈ 0.206 mAh/cm²",
    "例：10 mg/cm² × 96% × 180 mAh/g ≈ 1.7 mAh/cm²",
  ], { size: 19, lh: 38 });
  return svg(W, H, b);
};

// ---------- 11. Lab half cell vs practical cell ----------
figs.half_vs_practical = () => {
  const W = 820, H = 540;
  let b = "";
  const k = 0.42; // px per µm
  const col = (x0, title, tc, cathUm, liUm, elyPad, notes) => {
    let s = text(x0 + 180, 32, title, { size: 22, anchor: "middle", weight: "bold", fill: tc });
    const base = 300;
    const hC = cathUm * k, hS = 25 * k, hL = liUm * k;
    const yC = base - hC, yS = yC - hS, yL = yS - hL;
    s += rect(x0 + 40 - elyPad, yL - elyPad, 280 + 2 * elyPad, base - yL + elyPad + 8, ELY, { rx: 16 });
    s += rect(x0 + 40, base, 280, 6, COL.alu);
    s += rect(x0 + 40, yC, 280, hC, CATH);
    s += rect(x0 + 40, yS, 280, hS, "#C9D2DA");
    s += rect(x0 + 40, yL, 280, hL, LIM, { stroke: COL.siDark, sw: 1.5 });
    s += text(x0 + 180, yL + hL / 2 + 7, `锂 ${liUm} µm`, { size: 19, anchor: "middle", weight: "bold" });
    s += text(x0 + 180, yC + hC / 2 + 7, `正极 ~${cathUm} µm`, { size: 19, anchor: "middle", weight: "bold", fill: cathUm > 60 ? "#FFFFFF" : COL.ink });
    s += lines(x0 + 180, 350, notes, { size: 19, anchor: "middle", lh: 34 });
    return s;
  };
  b += col(20, "典型实验室半电池", COL.red, 50, 450, 22, ["面容量 ≈ 1.7 mAh/cm²", "锂 ≈ 93 mAh/cm²", "N/P ≈ 54", "E/C ≈ 47 g/Ah（75 µL）"]);
  b += col(440, "实用电池（目标）", COL.teal, 100, 40, 6, ["面容量 ≈ 4 mAh/cm²", "锂 ≈ 8 mAh/cm²", "N/P ≈ 2", "E/C ≤ 3 g/Ah"]);
  b += line(420, 50, 420, 500, COL.line, 2, "8 6");
  b += text(410, 528, "厚度大致按比例（0.42 px/µm）；浅蓝 = 电解液", { size: 19, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

module.exports = figs;
