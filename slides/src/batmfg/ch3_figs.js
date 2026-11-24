// Figures for 锂电池制造 Chapter 3: 电极制备 II——干燥、辊压与新工艺
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, head, rng } = L;

const figs = {};
const AM = COL.si;            // active-material particle
const CB = COL.ink;           // carbon black
const BIND = COL.purple;      // binder
const SOLV = COL.electrolyte; // solvent
const SOLV_D = COL.teal;      // solvent flow arrows
const AL = COL.alu;
const CU = COL.copper;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const ell = (cx, cy, rx, ry, fill, o = {}) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;
const pline = (pts, c, w = 3, dash) =>
  `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

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
// Active particle with a light rim.
const part = (cx, cy, r, fill = AM) => circ(cx, cy, r, fill, { stroke: COL.white, sw: 2 });
// Wavy heat line going up from (x, y).
function wave(x, y, h, c, w = 3) {
  const n = 4, seg = h / n;
  let d = `M${x},${y}`;
  for (let i = 0; i < n; i++) d += ` q${i % 2 ? -9 : 9},${-seg / 2} 0,${-seg}`;
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
}
// Box with centred 1–2 line label.
function box(x, y, w, h, fill, label, o = {}) {
  const size = o.size || 20;
  const arr = Array.isArray(label) ? label : [label];
  const lh = size * 1.3;
  const y0 = y + h / 2 - ((arr.length - 1) * lh) / 2 + size * 0.36;
  return rect(x, y, w, h, fill, { rx: o.rx ?? 12, stroke: o.stroke, sw: o.sw, dash: o.dash }) +
    arr.map((s, i) => text(x + w / 2, y0 + i * lh, s, { size: i === 0 ? size : (o.sub || size - 1), anchor: "middle", weight: i === 0 && o.bold !== false ? "bold" : undefined, fill: i === 0 ? (o.color || COL.ink) : (o.subColor || COL.text2) })).join("");
}
// Curved rotation arrow around (cx, cy) of radius r from angle a1 to a2 (degrees, clockwise positive).
function arc(cx, cy, r, a1, a2, c, w = 4) {
  const rad = (a) => (a * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
  const x2 = cx + r * Math.cos(rad(a2)), y2 = cy + r * Math.sin(rad(a2));
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  const tang = rad(a2) + (sweep ? Math.PI / 2 : -Math.PI / 2);
  return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} ${sweep} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
    head(+(x2 + 6 * Math.cos(tang)).toFixed(1), +(y2 + 6 * Math.sin(tang)).toFixed(1), tang, c, 14);
}
// Pair of calender rolls (top & bottom) centred at x, nip at y, radius r, gap g.
function rolls(x, y, r, g, o = {}) {
  const c1 = o.dark ? "#56636F" : COL.siDark, c2 = o.dark ? "#7C8B99" : COL.si;
  let b = "";
  [[y - g / 2 - r, 1], [y + g / 2 + r, -1]].forEach(([cy]) => {
    b += circ(x, cy, r, c1) + circ(x, cy, r * 0.78, c2) + circ(x, cy, r * 0.16, c1);
  });
  return b;
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 470, H = 560;
  let b = "";
  // dryer box
  b += rect(30, 30, 410, 130, "#2B3D4F", { rx: 14, stroke: "#4A5866", sw: 3 });
  [90, 160, 230, 300, 370].forEach((x) => (b += wave(x, 125, 60, "#F6C58E", 4)));
  b += text(235, 62, "干燥炉", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  // web through the dryer
  b += rect(10, 133, 450, 8, "#AEB8C2") + rect(10, 125, 450, 8, "#7C8B99");
  b += line(455, 137, 455, 300, "#AEB8C2", 8);
  // calender rolls
  b += rolls(180, 300, 55, 14, { dark: true });
  b += rect(10, 296, 450, 8, "#AEB8C2");
  b += text(270, 270, "辊压", { size: 26, weight: "bold", fill: "#FFFFFF" });
  // PTFE fibril motif
  const R = rng(7);
  const ps = [[70, 470], [140, 450], [210, 478], [280, 455], [350, 472], [410, 452]];
  for (let i = 0; i < ps.length - 1; i++) {
    const [x1, y1] = ps[i], [x2, y2] = ps[i + 1];
    b += line(x1, y1, x2, y2, "#C9B8E8", 3) + line(x1, y1 - 10, x2, y2 + 8, "#C9B8E8", 2) + line(x1, y1 + 10, x2, y2 - 8, "#C9B8E8", 2);
  }
  ps.forEach(([x, y]) => (b += circ(x, y, 16 + R() * 5, "#7C8B99", { stroke: "#1D2B3A", sw: 2 })));
  b += text(235, 535, "干燥 · 辊压 · 干法电极", { size: 24, anchor: "middle", weight: "bold", fill: "#CADCE8" });
  return svg(W, H, b);
};

// ---------- 1. History timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const T = COL.teal, A = COL.amber, P = COL.purple, G = COL.siDark;
  const ev = [
    { year: "1836", who: ["Chaffee"], what: ["压延机", "压橡胶片"], color: A },
    { year: "1929", who: ["Sherwood"], what: ["干燥分为", "恒速段与降速段"], color: T },
    { year: "1935", who: ["Bruggeman"], what: ["有效介质公式", "→ 曲折度"], color: A },
    { year: "1938", who: ["Plunkett"], what: ["DuPont", "发现 PTFE"], color: P },
    { year: "1991", who: ["Sony"], what: ["卷对卷涂布、", "干燥、辊压量产"], color: G },
    { year: "2000s", who: ["Maxwell"], what: ["干法 PTFE", "超级电容电极"], color: P },
    { year: "2017", who: ["Jaiser 等"], what: ["电极三段式", "干燥"], color: T },
    { year: "2019", who: ["Tesla"], what: ["收购 Maxwell", "（干法电极）"], color: P },
  ];
  let b = timeline(W, H, ev, { axisY: 200, left: 85, right: 1125, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(395, 392, 130, 30, T, "干燥", { size: 17 }) + pill(540, 392, 170, 30, A, "辊压与孔结构", { size: 17 });
  b += pill(725, 392, 170, 30, P, "PTFE 与干法", { size: 17 }) + pill(910, 392, 130, 30, G, "电池产业", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Three drying phases (after Li Fig. 9) ----------
figs.drying_stages = () => {
  const W = 820, H = 540;
  let b = "";
  const px = [15, 288, 561], pw = 245, foilY = 330;
  const loose = [[40, 292, 25], [112, 300, 24], [188, 290, 26], [72, 228, 24], [152, 238, 24], [214, 222, 21]];
  const tight = [[33, 300, 26], [91, 303, 26], [149, 300, 26], [207, 303, 26], [62, 252, 26], [120, 254, 26], [178, 252, 26], [228, 256, 16]];
  const titles = [["① 快速段", "high-rate"], ["② 恒速段", "constant-rate"], ["③ 低速段", "low-rate"]];
  const caps = [["表面溶剂先蒸发", "湿膜很快变薄"], ["溶剂从下往上补", "蒸发速度基本不变"], ["颗粒缝里的溶剂", "最难赶出来"]];
  px.forEach((x0, k) => {
    // solvent
    if (k === 0) b += rect(x0, 150, pw, foilY - 150, SOLV);
    if (k === 1) b += rect(x0, 228, pw, foilY - 228, SOLV);
    // wet-thickness reference line
    b += line(x0, 150, x0 + pw, 150, k === 0 ? SOLV_D : COL.muted, 2.5, k === 0 ? "" : "8 6");
    const ps = k === 0 ? loose : tight;
    if (k === 2) {
      // solvent trapped in necks
      [[62, 290], [120, 293], [178, 290], [91, 330 - 10], [149, 320], [207, 320]].forEach(([dx, dy]) => (b += ell(x0 + dx, dy, 9, 7, SOLV, { stroke: SOLV_D, sw: 1.5 })));
    }
    ps.forEach(([dx, dy, r]) => (b += part(x0 + dx, dy, r)));
    // carbon + binder dots
    const R = rng(11 + k);
    for (let i = 0; i < 16; i++) {
      const xx = x0 + 10 + R() * (pw - 20), yy = (k === 0 ? 165 : 235) + R() * (k === 0 ? 150 : 85);
      b += circ(xx.toFixed(1), yy.toFixed(1), 4, i % 2 ? CB : BIND);
    }
    b += rect(x0, foilY, pw, 14, AL);
    // evaporation arrows
    const top = k === 0 ? 150 : 228;
    const n = k === 2 ? 1 : 3;
    for (let i = 0; i < n; i++) {
      const ax = x0 + (n === 1 ? pw / 2 : 50 + i * 72);
      b += arrow(ax, top - 8, ax, top - 58, { color: SOLV_D, width: k === 2 ? 2.5 : 4, head: 13 });
    }
    if (k === 1) [70, 178].forEach((dx) => (b += arrow(x0 + dx + 20, foilY - 6, x0 + dx + 20, 240, { color: SOLV_D, width: 3, head: 11, dash: "6 5" })));
    b += text(x0 + pw / 2, 44, titles[k][0], { size: 23, anchor: "middle", weight: "bold", fill: COL.teal });
    b += text(x0 + pw / 2, 72, titles[k][1], { size: 19, anchor: "middle", fill: COL.text2, italic: true });
    b += lines(x0 + pw / 2, 382, caps[k], { size: 20, anchor: "middle", lh: 28 });
    if (k < 2) b += arrow(x0 + pw + 4, 240, x0 + pw + 24, 240, { color: COL.ink, width: 3, head: 10 });
  });
  b += text(15 + pw - 6, 182, "湿膜", { size: 19, anchor: "end", fill: SOLV_D });
  // legend
  const lg = [[AM, "活性颗粒", 14], [CB, "炭黑", 6], [BIND, "粘结剂", 6]];
  lg.forEach(([c, s, r], i) => {
    const x = 40 + i * 200;
    b += circ(x, 470, r, c) + text(x + 22, 477, s, { size: 19 });
  });
  b += rect(620, 458, 26, 24, SOLV, { stroke: SOLV_D, sw: 1.5 }) + text(656, 477, "溶剂", { size: 19 });
  b += text(410, 525, "铝箔（灰条）在下方；虚线 = 刚涂好时的湿膜高度", { size: 19, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 3. Binder migration & drying defects ----------
figs.drying_defects = () => {
  const W = 1240, H = 370;
  let b = "";
  const px = [20, 430, 840], pw = 380, top = 110, foilY = 228;
  const titles = ["慢慢干：分布均匀", "干太快：粘结剂上浮", "太猛：结皮 → 龟裂"];
  const caps = [["粘结剂和炭黑", "上下都有"], ["底部粘结剂变少", "→ 附着差、电阻大"], ["表面先结“皮”", "→ 开裂、卷边"]];
  px.forEach((x0, k) => {
    b += rect(x0, top, pw, foilY - top, "#F5F7F9");
    const R = rng(21);
    for (let row = 0; row < 3; row++)
      for (let i = 0; i < 9; i++) {
        const cx = x0 + 24 + i * 42 + (row % 2) * 18 + (R() - 0.5) * 6;
        const cy = top + 22 + row * 37 + (R() - 0.5) * 6;
        if (cx < x0 + pw - 14) b += part(cx.toFixed(1), cy.toFixed(1), 17);
      }
    const R2 = rng(5 + k);
    for (let i = 0; i < 36; i++) {
      const xx = x0 + 8 + R2() * (pw - 16);
      let yy;
      if (k === 1) yy = i < 28 ? top + 4 + R2() * 26 : top + 40 + R2() * 70;
      else yy = top + 6 + R2() * (foilY - top - 12);
      b += circ(xx.toFixed(1), yy.toFixed(1), 4.5, BIND);
    }
    if (k === 1) {
      b += arrow(x0 + 360, foilY - 10, x0 + 360, top + 14, { color: SOLV_D, width: 3.5, head: 12 });
      b += line(x0 + 30, foilY - 1, x0 + 140, foilY - 1, COL.red, 3, "7 5");
    }
    if (k === 2) {
      b += rect(x0, top, pw, 12, "#8E6CC9", { opacity: 0.55 });
      b += poly([[x0 + 170, top], [x0 + 205, top], [x0 + 192, foilY - 22], [x0 + 186, foilY - 22]], COL.white, { stroke: COL.red, sw: 2.5 });
      b += poly([[x0 + 290, top], [x0 + 312, top], [x0 + 303, top + 70], [x0 + 299, top + 70]], COL.white, { stroke: COL.red, sw: 2.5 });
    }
    // foil (curled ends for k = 2)
    if (k === 2) b += `<path d="M${x0 - 4},${foilY - 18} Q${x0 + 20},${foilY + 6} ${x0 + 60},${foilY + 6} L${x0 + pw - 60},${foilY + 6} Q${x0 + pw - 20},${foilY + 6} ${x0 + pw + 4},${foilY - 18}" fill="none" stroke="${AL}" stroke-width="12"/>`;
    else b += rect(x0, foilY, pw, 12, AL);
    b += text(x0 + pw / 2, 62, titles[k], { size: 22, anchor: "middle", weight: "bold", fill: [COL.teal, COL.amber, COL.red][k] });
    b += lines(x0 + pw / 2, 285, caps[k], { size: 20, anchor: "middle", lh: 28 });
  });
  b += text(1220, 352, "紫点 = 粘结剂；灰球 = 活性颗粒；灰条 = 集流体", { size: 18, anchor: "end", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 4. NMP recovery (simplified from Li Fig. 20) ----------
figs.nmp_recovery = () => {
  const W = 820, H = 540;
  let b = "";
  const xs = [15, 220, 425, 630], bw = 175, y1 = 80, bh = 86, y2 = 290;
  const LQ = COL.amber, GS = COL.teal;
  b += box(xs[0], y1, bw, bh, "#FDF2E7", ["电极干燥炉", "热风吹走 NMP"], { size: 21, sub: 19 });
  b += box(xs[1], y1, bw, bh, COL.light, ["换热器", "废气预热新风"], { size: 21, sub: 19 });
  b += box(xs[2], y1, bw, bh, "#E8F4F3", ["冷凝器", "冷冻水降温"], { size: 21, sub: 19 });
  b += box(xs[3], y1, bw, bh, "#E8F4F3", ["沸石转轮", "吸附再浓缩"], { size: 21, sub: 19 });
  for (let i = 0; i < 3; i++) b += arrow(xs[i] + bw + 3, y1 + bh / 2, xs[i + 1] - 4, y1 + bh / 2, { color: COL.ink, width: 3.5, head: 12 });
  b += text(220, 50, "废气约 140 °C，含 NMP 约 1150 ppm", { size: 19, fill: COL.text2 });
  // fresh-air return
  b += `<path d="M${xs[1] + 60},${y1 + bh + 4} L${xs[1] + 60},${y1 + bh + 34} L${xs[0] + 90},${y1 + bh + 34}" fill="none" stroke="${GS}" stroke-width="3" stroke-dasharray="7 6"/>`;
  b += head(xs[0] + 90, y1 + bh + 6, -Math.PI / 2, GS, 12) + line(xs[0] + 90, y1 + bh + 34, xs[0] + 90, y1 + bh + 16, GS, 3, "7 6");
  b += text(xs[0] + 105, y1 + bh + 62, "预热后的新风回到干燥炉", { size: 19, fill: GS });
  // liquid path
  b += box(xs[2], y2, bw, bh, "#FDF2E7", ["NMP 储罐", "含水和杂质"], { size: 21, sub: 19 });
  b += box(xs[1], y2, bw, bh, "#FDF2E7", ["精馏提纯", "回用损失 20–30%"], { size: 21, sub: 18 });
  b += box(xs[0], y2, bw, bh, "#FDF2E7", ["回到配浆", "（第 2 章）"], { size: 21, sub: 19 });
  b += arrow(xs[2] + bw / 2, y1 + bh + 4, xs[2] + bw / 2, y2 - 4, { color: LQ, width: 5, head: 15 });
  b += text(xs[2] + bw / 2 + 12, y1 + bh + 70, "冷凝液", { size: 19, fill: LQ, weight: "bold" });
  b += arrow(xs[2] - 3, y2 + bh / 2, xs[1] + bw + 4, y2 + bh / 2, { color: LQ, width: 5, head: 15 });
  b += arrow(xs[1] - 3, y2 + bh / 2, xs[0] + bw + 4, y2 + bh / 2, { color: LQ, width: 5, head: 15 });
  // gas path
  b += box(xs[3], y2, bw, bh, "#E8F4F3", ["活性炭床", "最后一道吸附"], { size: 21, sub: 19 });
  b += arrow(xs[3] + bw / 2, y1 + bh + 4, xs[3] + bw / 2, y2 - 4, { color: GS, width: 4, head: 14 });
  b += pill(xs[3] + 7, y2 + bh + 40, bw - 14, 40, GS, "达标排放", { size: 19 });
  b += arrow(xs[3] + bw / 2, y2 + bh + 4, xs[3] + bw / 2, y2 + bh + 36, { color: GS, width: 4, head: 12 });
  // legend
  b += line(30, 470, 80, 470, LQ, 6) + text(92, 477, "液体：冷凝下来的大部分 NMP", { size: 19 });
  b += line(30, 512, 80, 512, GS, 5) + text(92, 519, "气体：残余 NMP 被吸附后排放", { size: 19 });
  return svg(W, H, b);
};

// ---------- 5. Secondary (vacuum) drying ----------
figs.vacuum_drying = () => {
  const W = 820, H = 540;
  let b = "";
  // oven
  b += rect(30, 70, 330, 290, COL.light, { rx: 18, stroke: COL.siDark, sw: 4 });
  b += rect(55, 95, 280, 240, COL.white, { rx: 10, stroke: COL.line, sw: 2 });
  [140, 200, 260].forEach((y) => {
    b += rect(70, y + 22, 250, 6, COL.line);
    for (let i = 0; i < 4; i++) b += rect(82 + i * 60, y, 48, 20, COL.siDark, { rx: 3 }) + rect(82 + i * 60, y + 17, 48, 4, AL);
  });
  // gauge
  b += circ(318, 50, 28, COL.white, { stroke: COL.siDark, sw: 4 }) + line(318, 50, 302, 36, COL.red, 4);
  b += text(195, 50, "真空烘箱", { size: 22, anchor: "middle", weight: "bold" });
  // water leaving
  b += line(360, 300, 400, 300, COL.siDark, 10);
  [[395, 250], [420, 200], [392, 160]].forEach(([x, y]) => {
    b += circ(x, y, 17, SOLV, { stroke: SOLV_D, sw: 2 }) + text(x, y + 6, "H_{2}O", { size: 13, anchor: "middle", fill: SOLV_D, weight: "bold" });
  });
  b += arrow(398, 285, 398, 275, { color: SOLV_D, width: 3, head: 10 });
  b += text(195, 395, "工厂：60–150 °C，12 h 以上", { size: 20, anchor: "middle", weight: "bold" });
  b += text(195, 425, "（Liu p. 8）", { size: 19, anchor: "middle", fill: COL.muted });
  // reaction
  b += rect(455, 70, 345, 205, "#FBEDEC", { rx: 16 });
  b += text(475, 108, "残留水分的后果", { size: 22, weight: "bold", fill: COL.red });
  b += text(475, 152, "LiPF_{6} + H_{2}O →", { size: 23 });
  b += text(500, 192, "LiF + POF_{3} + 2 HF", { size: 23, weight: "bold" });
  b += lines(475, 232, ["HF 腐蚀正极、破坏 SEI，", "还会产气"], { size: 19, lh: 26, fill: COL.text2 });
  // Huttner comparison
  b += rect(455, 300, 345, 225, COL.light, { rx: 16 });
  b += text(475, 336, "烘得越狠越好？不一定", { size: 21, weight: "bold" });
  b += cross(490, 378, 10, COL.red, 4) + lines(512, 386, ["120 °C 长时间烘：", "水最少，性能最差"], { size: 19, lh: 26 });
  b += check(490, 455, 11, COL.teal, 4) + lines(512, 460, ["室温氩气吹 20 min：", "326 ppm，性能最好"], { size: 19, lh: 26 });
  b += text(30, 470, "Huttner 等 2019：长时间高温", { size: 19, fill: COL.text2 });
  b += text(30, 498, "烘烤会损伤 PVDF、CMC/SBR", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 6. Calender rolls ----------
figs.calender_rolls = () => {
  const W = 820, H = 540;
  let b = "";
  const cx = 420, nip = 255, r = 92;
  // incoming (thick) and outgoing (thin) electrode
  const inT = 30, outT = 17, foil = 6;
  b += rect(10, nip - foil / 2 - inT, cx - 10, inT, "#9AA6B1") + rect(10, nip + foil / 2, cx - 10, inT, "#9AA6B1");
  b += rect(cx, nip - foil / 2 - outT, W - cx - 10, outT, COL.siDark) + rect(cx, nip + foil / 2, W - cx - 10, outT, COL.siDark);
  b += rect(10, nip - foil / 2, W - 20, foil, AL);
  // particle dots: sparse left, dense right
  for (let x = 22; x < cx - 10; x += 26) [nip - foil / 2 - inT / 2, nip + foil / 2 + inT / 2].forEach((y, j) => (b += circ(x + j * 12, y, 6, COL.white, { opacity: 0.8 })));
  for (let x = cx + 8; x < W - 16; x += 13) [nip - foil / 2 - outT / 2, nip + foil / 2 + outT / 2].forEach((y) => (b += circ(x, y, 5, "#C9D2DA")));
  b += rolls(cx, nip, r, 2 * outT + foil);
  b += arc(cx, nip - outT - foil / 2 - r, r + 18, 300, 345, COL.amber, 5);
  b += arc(cx, nip + outT + foil / 2 + r, r + 18, 60, 15, COL.amber, 5);
  b += arrow(40, 210, 120, 210, { color: COL.ink, width: 3.5, head: 12 }) + text(130, 217, "走带方向", { size: 19, fill: COL.text2 });
  // labels
  b += lines(20, 340, ["进：厚约 95 μm", "孔隙率约 52%"], { size: 20, lh: 28, weight: "bold" });
  b += lines(560, 340, ["出：厚约 70 μm", "孔隙率约 35%"], { size: 20, lh: 28, weight: "bold" });
  b += text(560, 400, "（示例，算法见下页）", { size: 19, fill: COL.muted });
  b += line(cx + 30, nip, 600, 170, COL.text2, 2) + text(560, 160, "辊缝 (gap) 定出口厚度", { size: 19, fill: COL.text2 });
  b += text(20, 40, "两只钢辊对压，常加热", { size: 20, weight: "bold", fill: COL.amber });
  // rolling-pin analogy
  b += rect(20, 470, 150, 26, COL.amberLight, { rx: 13 }) + rect(0, 476, 24, 14, COL.copper, { rx: 5 }) + rect(166, 476, 24, 14, COL.copper, { rx: 5 });
  b += `<path d="M10,516 Q95,498 180,516 L180,522 L10,522 Z" fill="${COL.sulfurLight}"/>`;
  b += text(205, 495, "像擀面：面团变薄、变实，", { size: 20 });
  b += text(205, 525, "但擀过头，面皮就破了。", { size: 20 });
  return svg(W, H, b);
};

// ---------- 7. Porosity scale ----------
figs.porosity_scale = () => {
  const W = 1240, H = 300;
  let b = "";
  const X = (p) => 90 + ((60 - p) / 45) * 1060;
  const axisY = 140;
  b += line(X(60), axisY, X(15), axisY, COL.line, 6);
  b += head(X(15) + 22, axisY, 0, COL.line, 18);
  [60, 50, 40, 30, 20].forEach((p) => {
    b += line(X(p), axisY - 10, X(p), axisY + 10, COL.text2, 2.5);
    b += text(X(p), axisY + 38, `${p}%`, { size: 22, anchor: "middle", fill: COL.text2 });
  });
  const bands = [
    [55, 45, COL.amber, ["涂布后、未辊压", "约 50%（典型）"]],
    [35, 30, COL.purple, ["研究级电极", "30–35%（原文）"]],
    [25, 20, COL.teal, ["商用电极（原文）", "负极 ~20%，正极 ~25%"]],
  ];
  bands.forEach(([a, z, c, lab]) => {
    b += rect(X(a), axisY - 16, X(z) - X(a), 32, c, { rx: 8, opacity: 0.85 });
    const mx = (X(a) + X(z)) / 2;
    b += lines(mx, 34, lab, { size: 22, anchor: "middle", lh: 30, weight: "bold", fill: c });
    b += line(mx, 76, mx, axisY - 20, c, 2, "4 4");
  });
  const icon = (cx, n, seed) => {
    const R = rng(seed);
    let s = rect(cx - 75, 195, 150, 96, COL.light, { rx: 8 });
    const pos = [];
    let tries = 0;
    while (pos.length < n && tries < 4000) {
      tries++;
      const x = cx - 63 + R() * 126, y = 207 + R() * 72;
      if (pos.every(([px, py]) => (px - x) ** 2 + (py - y) ** 2 > 18 * 18)) pos.push([x, y]);
    }
    pos.forEach(([x, y]) => (s += circ(x.toFixed(1), y.toFixed(1), 10, AM)));
    return s;
  };
  b += icon((X(55) + X(45)) / 2, 13, 3) + icon((X(35) + X(30)) / 2, 21, 4) + icon((X(25) + X(20)) / 2, 26, 5);
  b += text(20, 250, "孔多", { size: 22, fill: COL.text2 });
  b += text(1225, 250, "越压越密 →", { size: 22, anchor: "end", fill: COL.ink, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 8. Calendering microstructure & tortuosity (after Li Fig. 11a) ----------
figs.calender_micro = () => {
  const W = 820, H = 520;
  let b = "";
  const panel = (x0, parts, path, title, cap, ry) => {
    let s = rect(x0, 95, 370, 335, SOLV);
    s += line(x0, 95, x0 + 370, 95, COL.siDark, 3, "10 7");
    parts.forEach(([x, y]) => (s += ell(x0 + x, y, 34, ry, AM, { stroke: COL.white, sw: 2 })));
    s += rect(x0, 430, 370, 14, AL);
    s += smooth(path.map(([x, y]) => [x0 + x, y]), COL.white, 9);
    s += smooth(path.map(([x, y]) => [x0 + x, y]), COL.purple, 4.5, "10 6");
    s += ion(x0 + path[0][0], 78, { r: 14, fill: COL.purple });
    s += text(x0 + path[0][0] + 22, 84, "Li^{+}", { size: 20, fill: COL.purple, weight: "bold" });
    s += text(x0 + 185, 40, title, { size: 23, anchor: "middle", weight: "bold" });
    s += lines(x0 + 185, 478, cap, { size: 20, anchor: "middle", lh: 28 });
    return s;
  };
  const loose = [[50, 150], [150, 150], [300, 150], [100, 240], [230, 240], [325, 240], [40, 330], [170, 330], [290, 330], [110, 397], [240, 397], [332, 397]];
  const lp = [[225, 96], [225, 150], [195, 197], [165, 240], [197, 288], [230, 330], [205, 366], [175, 400], [175, 428]];
  const dense = [];
  [125, 190, 255, 320, 385].forEach((y, r) => (r % 2 ? [0, 1, 2, 3] : [0, 1, 2, 3, 4]).forEach((i) => dense.push([(r % 2 ? 65 : 38) + i * 70, y])));
  const dp = [[205, 96], [205, 125], [240, 158], [240, 190], [275, 222], [275, 255], [240, 288], [240, 320], [205, 352], [205, 385], [205, 428]];
  b += panel(20, loose, lp, "辊压前", ["孔多、路较直", "曲折度 τ 小"], 32);
  b += panel(430, dense, dp, "辊压后", ["孔少、路绕弯", "曲折度 τ 大"], 29);
  b += arrow(393, 262, 425, 262, { color: COL.ink, width: 4, head: 12 });
  return svg(W, H, b);
};

// ---------- 9. Over-calendering: particle damage & adhesion ----------
figs.particle_damage = () => {
  const W = 820, H = 540;
  let b = "";
  // secondary particle: cluster of primaries
  const cluster = (cx, cy, R0, broken) => {
    let s = "";
    const R = rng(9);
    for (let i = 0; i < 70; i++) {
      const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * (R0 - 10);
      let x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
      if (broken) x += x > cx + (y - cy) * 0.3 ? 9 : -9;
      s += circ(x.toFixed(1), y.toFixed(1), 10, i % 3 ? "#8E9BA8" : COL.siDark, { stroke: COL.white, sw: 1 });
    }
    if (broken) s += pline([[cx - 20, cy - R0], [cx - 4, cy - 20], [cx + 8, cy + 10], [cx + 22, cy + R0]], COL.red, 4) + pline([[cx + 4, cy - 12], [cx + 40, cy - 30]], COL.red, 3);
    return s;
  };
  b += text(20, 34, "正极二次颗粒", { size: 21, weight: "bold" });
  b += cluster(95, 130, 68, false) + arrow(180, 130, 225, 130, { color: COL.amber, width: 4, head: 12 }) + cluster(305, 130, 68, true);
  b += text(205, 238, "压过头：一次颗粒散开、开裂", { size: 19, anchor: "middle", fill: COL.red });
  // graphite
  b += text(470, 34, "石墨颗粒", { size: 21, weight: "bold" });
  b += `<g transform="rotate(-20 540 130)">${ell(540, 130, 62, 38, COL.siDark)}</g>`;
  b += arrow(615, 130, 655, 130, { color: COL.amber, width: 4, head: 12 });
  b += ell(735, 130, 72, 24, COL.siDark);
  b += text(630, 238, "较“软”：压扁、取向，但不碎", { size: 19, anchor: "middle", fill: COL.teal });
  // adhesion curve (qualitative, after Li p. 914 text)
  const x0 = 90, x1 = 770, yb = 495, yt = 300;
  b += line(x0, yb, x1, yb, COL.ink, 2.5) + line(x0, yb, x0, yt, COL.ink, 2.5);
  b += head(x1 + 12, yb, 0, COL.ink, 13) + head(x0, yt - 12, -Math.PI / 2, COL.ink, 13);
  b += text(x0 - 12, yt + 6, "附着力", { size: 19, anchor: "end", fill: COL.text2 });
  const X = (p) => x0 + ((52 - p) / 34) * (x1 - x0);
  [50, 40, 30, 20].forEach((p) => (b += text(X(p), yb + 28, `${p}%`, { size: 19, anchor: "middle", fill: COL.text2 })));
  b += text(x1 + 4, yb - 12, "孔隙率", { size: 19, anchor: "end", fill: COL.text2 });
  b += rect(X(35), yt + 10, X(30) - X(35), yb - yt - 12, "#FBEDEC");
  b += smooth([[X(51), 330], [X(45), 375], [X(38), 430], [X(33), 452], [X(29), 445], [X(24), 430], [X(20), 422]], COL.amber, 5);
  b += text(X(50) + 4, 322, "未压：粘得最牢", { size: 19, fill: COL.amber });
  b += text(X(32.5), 330, "30–35%", { size: 19, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(X(32.5), 356, "最弱", { size: 19, anchor: "middle", fill: COL.red });
  b += lines(X(22), 375, ["< 30%：机械咬合，", "略有回升"], { size: 19, anchor: "middle", lh: 25, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 10. Slitting, notching, edges ----------
figs.slitting = () => {
  const W = 1240, H = 390;
  let b = "";
  // P1: slitting a wide roll
  b += text(20, 36, "① 分切：宽卷 → 窄条", { size: 21, weight: "bold" });
  b += rect(20, 70, 280, 230, AL);
  [[82, 50], [168, 50], [254, 50]].forEach(([yc]) => b);
  [80, 157, 234].forEach((y) => (b += rect(20, y, 280, 56, COL.siDark)));
  [150, 227].forEach((y) => (b += line(300, y, 330, y, COL.red, 2.5, "5 4")));
  [150, 227].forEach((y) => (b += circ(320, y, 15, COL.white, { stroke: COL.red, sw: 3 })));
  // strips separating
  [[80, -10], [157, 0], [234, 10]].forEach(([y, dy]) => {
    b += poly([[340, y - 8], [430, y - 8 + dy * 1.6], [430, y + 64 + dy * 1.6], [340, y + 64]], AL);
    b += poly([[340, y], [430, y + dy * 1.6], [430, y + 56 + dy * 1.6], [340, y + 56]], COL.siDark);
  });
  b += arrow(110, 320, 250, 320, { color: COL.ink, width: 3, head: 11 });
  b += lines(20, 355, ["卷宽可达约 1 m，多把圆刀同时切"], { size: 18, fill: COL.text2 });
  // P2: punching / laser notching with tab
  b += text(470, 36, "② 模切 / 激光切（叠片）", { size: 21, weight: "bold" });
  b += rect(500, 120, 220, 170, COL.siDark, { rx: 4 });
  b += rect(530, 72, 46, 50, AL);
  b += rect(488, 60, 246, 242, "none", { stroke: COL.amber, sw: 3, dash: "9 6" });
  b += poly([[760, 70], [774, 70], [767, 112]], COL.red) + line(767, 40, 767, 70, COL.red, 4);
  b += text(790, 112, "激光", { size: 18, fill: COL.red });
  b += text(553, 102, "极耳", { size: 18, anchor: "middle", weight: "bold" });
  b += lines(470, 335, ["极耳处留空箔：间歇涂布", "或激光清掉涂层"], { size: 18, lh: 24, fill: COL.text2 });
  // P3: edge quality + overhang
  b += text(860, 36, "③ 切边与“负极大一圈”", { size: 21, weight: "bold" });
  b += rect(860, 80, 180, 40, COL.siDark) + rect(860, 120, 180, 6, AL);
  b += poly([[1040, 120], [1040, 126], [1068, 150]], AL, { stroke: COL.red, sw: 2 });
  b += line(1050, 140, 1150, 140, COL.teal, 4, "8 5") + text(1158, 147, "隔膜", { size: 18, fill: COL.teal });
  b += cross(1068, 152, 9, COL.red, 4);
  b += text(860, 180, "毛刺 (burr) 刺穿隔膜 → 短路", { size: 18, fill: COL.red });
  // overhang
  b += rect(900, 225, 230, 22, COL.siDark) + text(1015, 242, "正极", { size: 17, anchor: "middle", fill: COL.white });
  b += rect(880, 255, 270, 22, CU) + text(1015, 272, "负极（铜箔）", { size: 17, anchor: "middle", fill: COL.white });
  b += line(880, 290, 880, 300, COL.ink, 2) + line(900, 290, 900, 300, COL.ink, 2) + line(880, 296, 900, 296, COL.ink, 2);
  b += text(890, 324, "≈2 mm", { size: 18, anchor: "middle", weight: "bold" });
  b += lines(960, 320, ["负极必须盖住正极，", "防止边缘析锂"], { size: 18, lh: 24, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 11. Thick electrodes ----------
figs.thick_electrode = () => {
  const W = 820, H = 565;
  let b = "";
  const layer = (x, y, w, units, tc) => {
    let s = "", yy = y;
    units.forEach(([h, c, lab]) => {
      s += rect(x, yy, w, h, c);
      if (lab) s += text(x + w / 2, yy + h / 2 + 7, lab, { size: 19, anchor: "middle", fill: tc || COL.white });
      yy += h;
    });
    return [s, yy];
  };
  const unitThin = [[6, AL], [40, COL.siDark, "正极"], [10, COL.teal], [40, "#5B6670", "负极"], [6, CU]];
  const unitThick = [[6, AL], [80, COL.siDark, "正极"], [10, COL.teal], [80, "#5B6670", "负极"], [6, CU]];
  let [s1, yEnd] = layer(60, 60, 250, [...unitThin, ...unitThin]);
  b += s1;
  let [s2] = layer(480, 60, 250, unitThick);
  b += s2;
  b += text(185, 40, "薄电极 × 2", { size: 22, anchor: "middle", weight: "bold" });
  b += text(605, 40, "厚电极 × 1", { size: 22, anchor: "middle", weight: "bold" });
  b += text(185, yEnd + 32, "箔 4 层、隔膜 2 层", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(605, yEnd + 32, "箔 2 层、隔膜 1 层", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(395, 150, "活性层总厚相同", { size: 19, anchor: "middle", fill: COL.text2 });
  b += arrow(335, 165, 455, 165, { color: COL.ink, width: 3, head: 11 });
  // utilisation gradient
  b += text(20, 345, "高倍率放电时，离子从隔膜侧往里走：", { size: 20, weight: "bold" });
  const grad = (x, y, w, h, n) => {
    let s = "";
    for (let i = 0; i < n; i++) s += rect(x, y + (i * h) / n, w, h / n + 0.5, COL.purple, { opacity: (0.85 - (i / n) * 0.75).toFixed(2) });
    return s + rect(x, y + h, w, 8, AL) + line(x, y - 4, x + w, y - 4, COL.teal, 5, "9 6");
  };
  b += grad(80, 385, 230, 60, 3) + grad(470, 385, 230, 120, 8);
  [140, 250].forEach((x) => (b += arrow(x, 372, x, 425, { color: COL.ink, width: 3, head: 10 })));
  [530, 640].forEach((x) => (b += arrow(x, 372, x, 455, { color: COL.ink, width: 3, head: 10 })));
  b += text(195, 485, "薄：整层都用得上", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(410, 550, "深色 = 反应充分；浅色 = 来不及反应（示意）", { size: 19, anchor: "middle", fill: COL.muted });
  b += text(712, 470, "厚：深处", { size: 19, fill: COL.red });
  b += text(712, 496, "用不上", { size: 19, fill: COL.red });
  return svg(W, H, b);
};

// ---------- 12. Wet vs dry process ----------
figs.wet_vs_dry = () => {
  const W = 1240, H = 350;
  let b = "";
  const xs = Array.from({ length: 7 }, (_, i) => 130 + i * 158), bw = 132, bh = 74;
  const wet = [["粉末", "+ NMP"], ["搅拌", "成浆"], ["涂布"], ["干燥炉", "数十米长"], ["NMP", "回收"], ["辊压"], ["电极"]];
  const dry = [["粉末", "+ PTFE"], ["干混"], ["剪切", "PTFE 拉丝"], null, null, ["辊压成", "自支撑膜"], ["热压到", "铝箔上"]];
  b += text(20, 100, "湿法", { size: 24, weight: "bold", fill: COL.teal });
  b += text(20, 245, "干法", { size: 24, weight: "bold", fill: COL.purple });
  wet.forEach((lab, i) => {
    b += box(xs[i], 60, bw, bh, i === 3 || i === 4 ? "#FDF2E7" : "#E8F4F3", lab, { size: 20, sub: 18 });
    if (i < 6) b += arrow(xs[i] + bw + 3, 97, xs[i + 1] - 4, 97, { color: COL.ink, width: 3, head: 10 });
  });
  dry.forEach((lab, i) => {
    if (lab) b += box(xs[i], 205, bw, bh, "#F1ECF8", lab, { size: 20, sub: 18 });
    else {
      b += box(xs[i], 205, bw, bh, "#FFFFFF", i === 3 ? ["不用干燥"] : ["不用回收"], { size: 19, stroke: COL.line, sw: 2, dash: "7 5", color: COL.muted });
      b += cross(xs[i] + bw - 14, 218, 9, COL.red, 3.5);
    }
    if (i < 6) b += arrow(xs[i] + bw + 3, 242, xs[i + 1] - 4, 242, { color: i === 2 || i === 3 || i === 4 ? COL.line : COL.ink, width: 3, head: 10, dash: i === 2 || i === 3 || i === 4 ? "6 5" : "" });
  });
  b += `<path d="M${xs[2] + bw / 2},${205 + bh + 4} L${xs[2] + bw / 2},${205 + bh + 26} L${xs[5] + bw / 2},${205 + bh + 26} L${xs[5] + bw / 2},${205 + bh + 8}" fill="none" stroke="${COL.purple}" stroke-width="3.5"/>`;
  b += head(xs[5] + bw / 2, 205 + bh + 4, -Math.PI / 2, COL.purple, 12);
  b += text((xs[3] + xs[4] + bw) / 2, 205 + bh + 48, "直接跳过两个最耗能的步骤", { size: 19, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(xs[3] + bw, 30, "能耗大户（第 1 节）", { size: 19, anchor: "middle", fill: COL.amber, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 13. Maxwell-type dry film process (after Liu Fig. 3B-I) ----------
figs.dry_film = () => {
  const W = 820, H = 540;
  let b = "";
  // hopper
  b += poly([[90, 40], [250, 40], [195, 120], [145, 120]], COL.light, { stroke: COL.siDark, sw: 3 });
  const R = rng(3);
  for (let i = 0; i < 26; i++) b += circ((115 + R() * 110).toFixed(1), (52 + R() * 40).toFixed(1), 6, i % 4 ? AM : BIND);
  b += text(270, 70, "① 干粉喂料", { size: 20, weight: "bold" });
  // roll pair 1 (side by side)
  const r1 = 56;
  b += circ(170 - r1 - 6, 190, r1, COL.siDark) + circ(170 - r1 - 6, 190, r1 * 0.75, COL.si);
  b += circ(170 + r1 + 6, 190, r1, COL.siDark) + circ(170 + r1 + 6, 190, r1 * 0.75, COL.si);
  for (let i = 0; i < 6; i++) b += circ(163 + (i % 2) * 14, 128 + i * 9, 5, AM);
  b += text(300, 196, "② 对辊压成", { size: 20, weight: "bold" });
  b += text(300, 224, "自支撑膜", { size: 20, weight: "bold" });
  // film going down then right
  b += `<path d="M170,196 L170,312 Q170,324 182,324 L520,324" fill="none" stroke="${COL.siDark}" stroke-width="12"/>`;
  // foil coming in
  b += `<path d="M380,470 Q470,470 505,346 L520,334" fill="none" stroke="${AL}" stroke-width="6"/>`;
  b += text(380, 500, "铝箔", { size: 19, fill: COL.text2 });
  // roll pair 2 (laminating)
  b += rolls(580, 330, 56, 18);
  b += text(580, 190, "③ 热压覆合", { size: 20, anchor: "middle", weight: "bold" });
  b += rect(636, 322, 174, 10, COL.siDark) + rect(636, 332, 174, 5, AL);
  b += text(720, 370, "电极", { size: 21, anchor: "middle", weight: "bold" });
  // zoom: PTFE fibrils
  const zx = 120, zy = 440, zr = 88;
  b += circ(zx, zy, zr, COL.white, { stroke: COL.purple, sw: 3 });
  const ps = [[zx - 45, zy - 35], [zx + 30, zy - 45], [zx + 50, zy + 20], [zx - 10, zy + 45], [zx - 55, zy + 25], [zx + 5, zy - 5]];
  for (let i = 0; i < ps.length; i++)
    for (let j = i + 1; j < ps.length; j++) {
      const [x1, y1] = ps[i], [x2, y2] = ps[j];
      if ((x1 - x2) ** 2 + (y1 - y2) ** 2 < 95 * 95) b += line(x1, y1, x2, y2, BIND, 2.2);
    }
  ps.forEach(([x, y]) => (b += circ(x, y, 19, AM, { stroke: COL.white, sw: 2 })));
  b += line(zx + 60, zy - 66, 166, 330, COL.purple, 2, "5 4");
  b += lines(225, 430, ["PTFE 被剪切拉成细丝，", "像蜘蛛网把颗粒兜住"], { size: 20, lh: 29, fill: COL.purple, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 14. Electrostatic spray deposition (after Li Fig. 27) ----------
figs.esd = () => {
  const W = 720, H = 400;
  let b = "";
  const fy = 290;
  // foil + ground
  b += rect(10, fy, 700, 8, AL);
  b += line(40, fy + 8, 40, fy + 40, COL.ink, 3) + line(22, fy + 40, 58, fy + 40, COL.ink, 3) + line(28, fy + 48, 52, fy + 48, COL.ink, 3) + line(34, fy + 56, 46, fy + 56, COL.ink, 3);
  b += text(66, fy + 52, "接地的集流体", { size: 20, fill: COL.text2 });
  // guns
  [120, 210, 300].forEach((x) => {
    b += rect(x - 18, 20, 36, 70, COL.siDark, { rx: 6 }) + poly([[x - 10, 90], [x + 10, 90], [x + 4, 104], [x - 4, 104]], COL.ink);
    b += poly([[x - 4, 104], [x + 4, 104], [x + 40, fy - 22], [x - 40, fy - 22]], "#F1ECF8");
    const R = rng(x);
    for (let i = 0; i < 9; i++) {
      const yy = 120 + R() * 140, spread = ((yy - 104) / (fy - 126)) * 36;
      const xx = x + (R() - 0.5) * 2 * spread;
      b += circ(xx.toFixed(1), yy.toFixed(1), 6.5, i % 3 ? AM : COL.ink) + text(xx.toFixed(1), (yy + 4.5).toFixed(1), "−", { size: 13, anchor: "middle", fill: COL.white, weight: "bold" });
    }
  });
  b += text(345, 48, "带电干粉喷枪", { size: 21, weight: "bold" });
  b += text(345, 76, "（无溶剂）", { size: 20, fill: COL.text2 });
  // deposited loose layer
  b += rect(70, fy - 22, 420, 22, "#9AA6B1");
  // hot rolls
  b += rolls(500, fy - 2.5, 46, 21);
  b += text(500, 100, "热辊", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(500, 126, "熔化 PVDF、压实", { size: 20, anchor: "middle", fill: COL.amber });
  b += rect(546, fy - 13, 164, 13, COL.siDark);
  b += arrow(600, 360, 700, 360, { color: COL.ink, width: 3, head: 11 }) + text(590, 367, "走带", { size: 19, anchor: "end", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 15. Other emerging routes ----------
figs.emerging = () => {
  const W = 1240, H = 380;
  let b = "";
  const titles = ["① 辐射干燥", "② 多层涂布", "③ 定向孔道"];
  [20, 435, 850].forEach((x0, k) => (b += text(x0, 36, titles[k], { size: 22, weight: "bold", fill: [COL.amber, COL.purple, COL.teal][k] })));
  // P1: convection vs IR vs microwave
  const coat = (x, y, w, h) => rect(x, y, w, h, "#9AA6B1") + rect(x, y + h, w, 8, AL);
  b += coat(20, 200, 110, 70) + coat(150, 200, 110, 70) + coat(280, 200, 110, 70);
  [45, 75, 105].forEach((x) => (b += arrow(x, 120, x, 192, { color: COL.amber, width: 3, head: 10 })));
  [175, 205, 235].forEach((x) => (b += wave(x, 192, 72, COL.red, 3)));
  b += rect(282, 202, 106, 66, COL.red, { opacity: 0.35 });
  [[305, 225], [335, 245], [362, 222]].forEach(([x, y]) => (b += circ(x, y, 7, COL.red)));
  b += text(75, 104, "热风", { size: 18, anchor: "middle" }) + text(205, 104, "红外", { size: 18, anchor: "middle" }) + text(335, 104, "微波", { size: 18, anchor: "middle" });
  b += lines(75, 305, ["靠空气", "传热"], { size: 18, anchor: "middle", lh: 24, fill: COL.text2 });
  b += lines(205, 305, ["不靠空气，", "更省能"], { size: 18, anchor: "middle", lh: 24, fill: COL.text2 });
  b += lines(335, 305, ["从内部", "加热"], { size: 18, anchor: "middle", lh: 24, fill: COL.text2 });
  // P2: two-layer slot die
  b += rect(500, 60, 200, 80, COL.siDark, { rx: 6 });
  b += rect(560, 140, 12, 50, COL.ink) + rect(628, 140, 12, 50, COL.ink);
  b += rect(538, 76, 56, 34, "#F1ECF8", { rx: 4 }) + text(566, 100, "浆 A", { size: 17, anchor: "middle" });
  b += rect(606, 76, 56, 34, "#E8F4F3", { rx: 4 }) + text(634, 100, "浆 B", { size: 17, anchor: "middle" });
  b += rect(450, 250, 360, 8, AL);
  b += rect(450, 222, 360, 28, "#E3DAF2");
  b += rect(450, 192, 360, 30, "#C9D2DA");
  const R = rng(4);
  for (let i = 0; i < 30; i++) b += circ((455 + R() * 350).toFixed(1), (227 + R() * 18).toFixed(1), 4, BIND);
  for (let i = 0; i < 10; i++) b += circ(470 + i * 34, 207, 11, AM, { stroke: COL.white, sw: 1.5 });
  b += lines(450, 290, ["下层（浆 A）：粘结剂多，粘得牢", "上层（浆 B）：活性物质多、孔大"], { size: 18, lh: 25, fill: COL.text2 });
  // P3: vertical channels
  b += rect(880, 110, 300, 160, "#9AA6B1") + rect(880, 270, 300, 8, AL);
  [925, 985, 1045, 1105, 1160].forEach((x) => (b += rect(x - 9, 110, 18, 145, SOLV)));
  [925, 1045, 1160].forEach((x) => (b += arrow(x, 80, x, 240, { color: COL.purple, width: 3, head: 11 })));
  b += text(1030, 70, "Li^{+} 走“直通道”", { size: 18, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += lines(880, 305, ["做法：激光打孔、冰模板", "(freeze casting)、共挤出"], { size: 18, lh: 25, fill: COL.text2 });
  return svg(W, H, b);
};

module.exports = figs;
