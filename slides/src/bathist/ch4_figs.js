// Figures for 锂电池发展史 Chapter 4: 1980–1985：LiCoO₂、石墨与锂离子电池原型
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, electron } = L;

const figs = {};
const LI = COL.purple;      // lithium
const CO = COL.teal;        // cobalt
const OX = COL.red;         // oxygen
const CARB = COL.siDark;    // carbon / graphite
const CAT = COL.amber;      // cathode colour
const AN = COL.teal;        // anode / carbon colour

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const path = (d, stroke, w = 3, fill = "none", dash) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
// double-headed vertical arrow
const darrow = (x, y1, y2, c, w = 3) => arrow(x, (y1 + y2) / 2, x, y1, { color: c, width: w, head: 13 }) + arrow(x, (y1 + y2) / 2, x, y2, { color: c, width: w, head: 13 });

// A stack of graphene sheets drawn as thick lines. Returns svg.
function sheets(x, y, w, n, gap, c = CARB, sw = 5) {
  let b = "";
  for (let i = 0; i < n; i++) b += line(x, y + i * gap, x + w, y + i * gap, c, sw);
  return b;
}

// Layered oxide host: CoO2 slabs (teal bars) with Li sites (purple dots or empty rings) between.
// fill: array per gallery of fraction filled (0..1)
function oxideHost(x, y, w, nSlab, gap, fill, o = {}) {
  let b = "";
  for (let i = 0; i < nSlab; i++) b += rect(x, y + i * gap, w, 12, o.slab || CO, { rx: 4 });
  const nSite = Math.max(3, Math.floor(w / 34));
  for (let g = 0; g < nSlab - 1; g++) {
    const yy = y + g * gap + 12 + (gap - 12) / 2;
    const f = fill[g] ?? 0;
    for (let k = 0; k < nSite; k++) {
      const cx = x + (k + 0.5) * (w / nSite);
      const filled = (k + g) % nSite < Math.round(f * nSite);
      b += filled ? circ(cx, yy, o.r || 8, LI) : circ(cx, yy, o.r || 8, "none", { stroke: COL.purpleLight, sw: 2, dash: "3 3" });
    }
  }
  return b;
}

// Carbon host: graphene sheets with Li dots in galleries
function carbonHost(x, y, w, nSheet, gap, fill, o = {}) {
  let b = sheets(x, y, w, nSheet, gap, CARB, o.sw || 5);
  const nSite = Math.max(3, Math.floor(w / 34));
  for (let g = 0; g < nSheet - 1; g++) {
    const yy = y + g * gap + gap / 2;
    const f = fill[g] ?? 0;
    for (let k = 0; k < nSite; k++) {
      const cx = x + (k + 0.5) * (w / nSite);
      const filled = (k + g) % nSite < Math.round(f * nSite);
      if (filled) b += circ(cx, yy, o.r || 8, LI);
    }
  }
  return b;
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  // carbon (left) and LiCoO2 (right)
  b += carbonHost(30, 70, 140, 6, 38, [0.6, 0.6, 0.6, 0.6, 0.6], { sw: 6 }).split(CARB).join(COL.alu);
  b += oxideHost(260, 64, 140, 6, 38, [0.4, 0.4, 0.4, 0.4, 0.4], { slab: COL.tealLight });
  b += text(100, 300, "负极：碳", { size: 22, anchor: "middle", weight: "bold", fill: "#CADCE8" });
  b += text(330, 300, "正极：LiCoO_{2}", { size: 22, anchor: "middle", weight: "bold", fill: "#CADCE8" });
  b += ion(215, 130, { r: 16, fill: LI, label: "+" });
  b += arrow(195, 175, 235, 175, { color: "#F6C58E", width: 3.5, head: 13 });
  b += arrow(235, 205, 195, 205, { color: "#9FD3CF", width: 3.5, head: 13 });
  b += text(215, 250, "Li^{+}", { size: 24, anchor: "middle", weight: "bold", fill: "#C9B8E8" });
  b += pill(30, 345, 370, 50, CAT, "1980 · LiCoO_{2}：4 V 正极", { size: 20 });
  b += pill(30, 415, 370, 50, AN, "1983 · 石墨可逆嵌锂", { size: 20 });
  b += pill(30, 485, 370, 50, LI, "1985 · 碳 | LiCoO_{2} 原型", { size: 20 });
  return svg(W, H, b);
};

// ---------- 1. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const A = CAT, T = AN, P = LI, G = COL.text2;
  const ev = [
    { year: "1970", who: ["Dey & Sullivan"], what: ["PC 在石墨上", "持续分解"], color: T },
    { year: "1974", who: ["Besenhard"], what: ["Li^{+} 带着溶剂", "挤进石墨"], color: T },
    { year: "1976", who: ["Whittingham"], what: ["Li | TiS_{2} 电池", "（第 2 章）"], color: G },
    { year: "1980", who: ["Mizushima & Goodenough"], what: ["LiCoO_{2}", "约 4 V 正极"], color: A },
    { year: "1980", who: ["Armand", "Lazzari & Scrosati"], what: ["“摇椅”：两极", "都用嵌入化合物"], color: P },
    { year: "1981", who: ["吉野彰"], what: ["聚乙炔负极", "（旭化成）"], color: P },
    { year: "1983", who: ["Yazami & Touzain"], what: ["PEO 中石墨", "可逆嵌锂"], color: T },
    { year: "1985", who: ["吉野彰"], what: ["碳 | LiCoO_{2}", "日本专利申请"], color: P },
  ];
  let b = timeline(W, H, ev, { axisY: 200, left: 85, right: 1125, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(700, 398, 160, 30, A, "正极", { size: 17 }) + pill(875, 398, 160, 30, T, "负极 / 碳", { size: 17 }) + pill(1050, 398, 170, 30, P, "整个电池", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Voltage budget ----------
figs.voltage_budget = () => {
  const W = 820, H = 540;
  let b = "";
  const y0 = 470, k = 88; // px per volt
  const Y = (v) => y0 - v * k;
  const ax = 95;
  b += line(ax, Y(4.7), ax, Y(0) + 10, COL.ink, 3);
  b += text(ax - 10, Y(4.7) - 16, "电位 V（相对 Li^{+}/Li）", { size: 19, fill: COL.text2 });
  [0, 1, 2, 3, 4].forEach((v) => {
    b += line(ax - 8, Y(v), ax, Y(v), COL.ink, 2);
    b += text(ax - 14, Y(v) + 7, String(v), { size: 19, anchor: "end", fill: COL.text2 });
  });
  // levels
  const R = ax + 520;
  const band = (v1, v2, fill, label, c, ly) => {
    b += rect(ax + 10, Y(v2), R - ax - 10, Y(v1) - Y(v2), fill, { opacity: 0.85 });
    b += text(R + 12, Y(ly ?? (v1 + v2) / 2) + 7, label, { size: 19, weight: "bold", fill: c });
  };
  band(3.9, 4.3, COL.amberLight, "LiCoO_{2} 3.9–4.3", CAT);
  band(2.0, 2.3, COL.line, "TiS_{2} ≈ 2.1", COL.siDark);
  band(0.1, 0.8, COL.tealLight, "碳 0.1–0.8", AN, 0.72);
  b += line(ax + 10, Y(0), R, Y(0), LI, 4);
  b += text(R + 12, Y(0) + 9, "金属锂 0", { size: 19, weight: "bold", fill: LI });
  b += line(ax + 10, Y(0.4), R, Y(0.4), COL.red, 3, "8 6");
  b += text(R + 12, Y(0.36) + 7, "LiAl ≈ 0.4", { size: 19, weight: "bold", fill: COL.red });
  // arrows: cells
  const cell = (x, v1, v2, c, lab, vtxt, top) => {
    b += darrow(x, Y(v1) - 2, Y(v2) + 2, c, 4);
    b += text(x + 12, (top > 3 ? Y(3.1) : (Y(v1) + Y(v2)) / 2) + 8, vtxt, { size: 22, weight: "bold", fill: c });
    b += text(x, Y(top) - 12, lab, { size: 19, anchor: "middle", weight: "bold", fill: c });
  };
  cell(170, 0, 2.1, COL.siDark, "Li | TiS_{2}", "2.1 V", 2.3);
  cell(340, 0.4, 2.1, COL.red, "LiAl | TiS_{2}", "1.7 V", 2.3);
  cell(500, 0.3, 4.0, CAT, "碳 | LiCoO_{2}", "≈3.7 V", 4.3);
  return svg(W, H, b);
};

// ---------- 3. Redox energies: sulfide vs oxide ----------
figs.redox_bands = () => {
  const W = 820, H = 540;
  let b = "";
  const yLi = 80, k = 78; // px per eV below the Li level
  const Y = (v) => yLi + v * k;
  // energy axis
  b += arrow(40, 500, 40, 40, { color: COL.ink, width: 3, head: 14 });
  b += lines(54, 60, ["电子", "能量"], { size: 19, fill: COL.text2, lh: 24 });
  // Li level across
  b += line(100, yLi, 790, yLi, LI, 5);
  b += text(110, yLi - 14, "Li^{+}/Li：负极里电子的能级（最高）", { size: 20, weight: "bold", fill: LI });
  // sulfide column
  const sx = 170, sw = 250;
  b += rect(sx, Y(2.4), sw, Y(5.4) - Y(2.4), COL.sulfurLight);
  b += text(sx + sw / 2, Y(3.9) + 8, "S 3p 能带（已填满）", { size: 19, anchor: "middle", weight: "bold", fill: COL.ink });
  b += line(sx, Y(2.15), sx + sw, Y(2.15), COL.siDark, 5);
  b += text(sx + sw / 2, Y(2.15) - 12, "Ti^{4+}/Ti^{3+}", { size: 20, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += line(sx + 20, Y(4.0) - 32, sx + sw - 20, Y(4.0) - 32, CO, 3, "8 6");
  b += cross(sx + sw - 34, Y(4.0) - 32, 9, COL.red, 4);
  b += text(sx + sw / 2, Y(4.0) - 44, "Co^{4+}/Co^{3+} 会落进能带里", { size: 19, anchor: "middle", fill: COL.red });
  b += text(sx + sw / 2, Y(5.4) + 30, "硫化物 TiS_{2}", { size: 22, anchor: "middle", weight: "bold" });
  // oxide column
  const ox = 520, ow = 250;
  b += rect(ox, Y(4.5), ow, Y(5.4) - Y(4.5), COL.redLight);
  b += text(ox + ow / 2, Y(4.95) + 8, "O 2p 能带（更低）", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
  b += line(ox, Y(4.0), ox + ow, Y(4.0), CO, 5);
  b += text(ox + ow / 2, Y(4.0) - 12, "Co^{4+}/Co^{3+}", { size: 20, anchor: "middle", weight: "bold", fill: CO });
  b += text(ox + ow / 2, Y(5.4) + 30, "氧化物 LiCoO_{2}", { size: 22, anchor: "middle", weight: "bold" });
  // drops
  b += darrow(sx + 40, yLi + 4, Y(2.15) - 4, COL.siDark, 3.5);
  b += text(sx + 52, (yLi + Y(2.15)) / 2 + 8, "≈ 2 V", { size: 24, weight: "bold", fill: COL.siDark });
  b += darrow(ox + 40, yLi + 4, Y(4.0) - 4, CO, 3.5);
  b += text(ox + 52, (yLi + Y(4.0)) / 2 + 8, "≈ 4 V", { size: 26, weight: "bold", fill: CO });
  return svg(W, H, b);
};

// ---------- 4. Goodenough life ----------
figs.goodenough_life = () => {
  const W = 1240, H = 370;
  const G = COL.text2, A = CAT, P = LI;
  const ev = [
    { year: "1952", who: ["MIT 林肯实验室"], what: ["磁性氧化物", "计算机磁芯存储"], color: G },
    { year: "1976", who: ["NASICON"], what: ["钠离子快导体", "（与 Hong 等）"], color: G },
    { year: "1976", who: ["到 Oxford"], what: ["无机化学", "实验室主任"], color: P },
    { year: "1980", who: ["LiCoO_{2}"], what: ["层状氧化物", "约 4 V 正极"], color: A },
    { year: "1983", who: ["LiMn_{2}O_{4}"], what: ["尖晶石正极", "（Thackeray 等）"], color: A },
    { year: "1986", who: ["到 UT Austin"], what: ["德州大学", "奥斯汀分校"], color: P },
    { year: "1997", who: ["LiFePO_{4}"], what: ["橄榄石正极", "（第 6 章）"], color: A },
    { year: "2019", who: ["诺贝尔化学奖"], what: ["97 岁，", "最年长得主"], color: P },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 175, left: 95, right: 1115, whoSize: 20, whatSize: 18, yearSize: 25 }));
};

// ---------- 5. Layered LiCoO2 structure ----------
figs.layered_structure = () => {
  const W = 820, H = 540;
  let b = "";
  const drawPanel = (x0, title, liFill, cLabel, cColor) => {
    const rows = ["O", "Co", "O", "Li", "O", "Co", "O", "Li", "O", "Co", "O"];
    const dy = 34, y0 = 78, nx = 5, dx = 50;
    const yCo = [];
    rows.forEach((r, i) => {
      const y = y0 + i * dy;
      const shift = ((Math.floor(i / 1) % 3) * dx) / 3;
      if (r === "Co") yCo.push(y);
      for (let k = 0; k < nx; k++) {
        const cx = x0 + 20 + shift + k * dx;
        if (r === "O") b += circ(cx, y, 12, COL.redLight, { stroke: OX, sw: 2 });
        else if (r === "Co") b += circ(cx, y, 9, CO);
        else {
          const on = liFill(i, k);
          b += on ? circ(cx, y, 10, LI) : circ(cx, y, 10, "none", { stroke: COL.purpleLight, sw: 2, dash: "3 3" });
        }
      }
    });
    b += text(x0 + 140, 42, title, { size: 22, anchor: "middle", weight: "bold" });
    // c/3 bracket between two Co layers
    const bx = x0 + 292;
    b += line(bx, yCo[0], bx, yCo[1], cColor, 3) + line(bx - 8, yCo[0], bx + 8, yCo[0], cColor, 3) + line(bx - 8, yCo[1], bx + 8, yCo[1], cColor, 3);
    b += lines(bx + 14, (yCo[0] + yCo[1]) / 2 - 4, ["c/3", cLabel], { size: 19, weight: "bold", fill: cColor, lh: 24 });
  };
  drawPanel(20, "LiCoO_{2}（放电态）", () => true, "4.69 Å", COL.ink);
  drawPanel(430, "Li_{0.49}CoO_{2}（充电一半）", (i, k) => (k + i) % 2 === 0, "4.81 Å", COL.red);
  // legend
  const ly = 505;
  b += circ(40, ly, 12, COL.redLight, { stroke: OX, sw: 2 }) + text(60, ly + 7, "O", { size: 19 });
  b += circ(120, ly, 9, CO) + text(138, ly + 7, "Co", { size: 19 });
  b += circ(205, ly, 10, LI) + text(223, ly + 7, "Li", { size: 19 });
  b += circ(280, ly, 10, "none", { stroke: COL.purpleLight, sw: 2, dash: "3 3" }) + text(298, ly + 7, "空位", { size: 19 });
  b += text(800, ly + 7, "锂抽走，CoO_{2} 层还在，层间略撑开", { size: 19, anchor: "end", fill: COL.red });
  return svg(W, H, b);
};

// ---------- 6. Synthesis route: charged vs discharged ----------
figs.synth_route = () => {
  const W = 820, H = 480;
  let b = "";
  const box = (x, y, w, h, fill, head, sub, hc) => {
    b += rect(x, y, w, h, fill, { rx: 14 });
    b += text(x + w / 2, y + 36, head, { size: 20, anchor: "middle", weight: "bold", fill: hc || COL.ink });
    b += lines(x + w / 2, y + 68, sub, { size: 19, anchor: "middle", fill: COL.text2, lh: 26 });
  };
  // row 1: old
  b += text(20, 38, "以前：先做“充电态”（不含锂）", { size: 21, weight: "bold", fill: COL.siDark });
  box(20, 55, 230, 120, COL.light, "高温合成", ["TiS_{2}、V_{2}O_{5}、MoS_{2}", "里面没有锂"]);
  b += arrow(258, 115, 300, 115, { color: COL.siDark, width: 3.5, head: 14 });
  box(305, 55, 230, 120, COL.light, "放电时嵌入锂", ["锂从哪来？", "只能来自负极"]);
  b += arrow(543, 115, 585, 115, { color: COL.red, width: 3.5, head: 14 });
  box(590, 55, 210, 120, "#FBEDEC", "负极必须是", ["金属锂", "→ 枝晶风险"], COL.red);
  // row 2: new
  b += text(20, 248, "1980：先做“放电态”（含锂）", { size: 21, weight: "bold", fill: CAT });
  box(20, 265, 230, 120, "#FDF2E7", "900 °C 合成", ["Li_{2}CO_{3} + CoCO_{3}", "→ LiCoO_{2}"], CAT);
  b += arrow(258, 325, 300, 325, { color: CAT, width: 3.5, head: 14 });
  box(305, 265, 230, 120, "#FDF2E7", "充电时抽出锂", ["LiCoO_{2} → Li_{1−x}CoO_{2}", "室温、电化学"], CAT);
  b += arrow(543, 325, 585, 325, { color: AN, width: 3.5, head: 14 });
  box(590, 265, 210, 120, "#E8F4F3", "负极可以", ["一开始不含锂", "（例如碳）"], AN);
  b += check(695, 425, 16, AN, 5) + cross(695, 205, 12, COL.red, 5);
  b += text(410, 465, "正极自带锂 = 电池里的“锂库存”放在正极", { size: 20, anchor: "middle", weight: "bold", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- 7. Rocking chair ----------
figs.rocking_chair = () => {
  const W = 1240, H = 290;
  let b = "";
  // left panel: Li metal battery
  b += rect(10, 10, 560, 270, COL.light, { rx: 16 });
  b += text(290, 46, "锂金属电池（第 2 章）", { size: 22, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += rect(50, 70, 70, 170, LI, { rx: 6 });
  b += text(85, 265, "金属锂", { size: 19, anchor: "middle", weight: "bold", fill: LI });
  // dendrites
  [100, 150, 200].forEach((y, i) => {
    b += path(`M120 ${y} L150 ${y - 8} L165 ${y + 4} L190 ${y - 6 + i * 3}`, LI, 4);
    b += path(`M150 ${y - 8} L160 ${y - 22}`, LI, 3);
  });
  b += cross(220, 150, 12, COL.red, 5);
  b += text(240, 135, "枝晶", { size: 20, weight: "bold", fill: COL.red });
  b += text(240, 162, "短路风险", { size: 19, fill: COL.red });
  b += oxideHost(380, 75, 150, 5, 40, [0.5, 0.5, 0.5, 0.5], { slab: COL.siDark });
  b += text(455, 265, "TiS_{2}（嵌入）", { size: 19, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += arrow(300, 220, 360, 220, { color: COL.text2, width: 3, head: 12 });
  b += text(330, 208, "Li^{+}", { size: 19, anchor: "middle", fill: COL.text2 });
  // right panel: rocking chair
  b += rect(590, 10, 640, 270, "#F1ECF8", { rx: 16 });
  b += text(910, 46, "摇椅电池：两极都是“宿主”", { size: 22, anchor: "middle", weight: "bold", fill: LI });
  b += carbonHost(630, 75, 160, 5, 40, [0.6, 0.4, 0.6, 0.4]);
  b += text(710, 265, "负极宿主", { size: 19, anchor: "middle", weight: "bold", fill: CARB });
  b += oxideHost(1030, 75, 160, 5, 40, [0.4, 0.6, 0.4, 0.6], { slab: CAT });
  b += text(1110, 265, "正极宿主", { size: 19, anchor: "middle", weight: "bold", fill: CAT });
  b += arrow(820, 125, 1000, 125, { color: CAT, width: 4, head: 15 });
  b += text(910, 112, "放电 Li^{+} →", { size: 19, anchor: "middle", weight: "bold", fill: CAT });
  b += arrow(1000, 190, 820, 190, { color: AN, width: 4, head: 15 });
  b += text(910, 222, "← Li^{+} 充电", { size: 19, anchor: "middle", weight: "bold", fill: AN });
  b += ion(910, 155, { r: 13, fill: LI, label: "+" });
  return svg(W, H, b);
};

// ---------- 8. Graphite staging ----------
figs.graphite_stage = () => {
  const W = 820, H = 540;
  let b = "";
  const col = (x, title, sub, gaps, filled, gapPx, c) => {
    b += text(x + 85, 40, title, { size: 21, anchor: "middle", weight: "bold", fill: c });
    b += text(x + 85, 68, sub, { size: 19, anchor: "middle", fill: COL.text2 });
    let y = 95;
    for (let i = 0; i < gaps + 1; i++) {
      b += line(x, y, x + 170, y, CARB, 6);
      if (i < gaps) {
        const g = gapPx[i];
        if (filled[i]) for (let k = 0; k < 5; k++) b += circ(x + 17 + k * 34, y + g / 2, 8, LI);
        y += g;
      }
    }
    return y;
  };
  col(20, "石墨", "层间距 3.35 Å", 5, [0, 0, 0, 0, 0], [34, 34, 34, 34, 34], CARB);
  col(305, "2 阶 LiC_{12}", "隔一层有锂（蓝色）", 5, [1, 0, 1, 0, 1], [38, 34, 38, 34, 38], COL.teal);
  col(590, "1 阶 LiC_{6}", "每层都有锂（金色）", 5, [1, 1, 1, 1, 1], [38, 38, 38, 38, 38], COL.sulfur);
  b += text(675, 312, "3.70 Å，约 +10%", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
  // honeycomb top view of LiC6
  const s = 16, hx0 = 60, hy0 = 365;
  const hexPts = (cx, cy) => {
    const p = [];
    for (let i = 0; i < 6; i++) {
      const a = ((60 * i - 30) * Math.PI) / 180;
      p.push(`${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`);
    }
    return p.join(" ");
  };
  const a1 = Math.sqrt(3) * s;
  let dots = "";
  for (let j = 0; j < 6; j++) {
    for (let i = 0; i < 8; i++) {
      const ii = i - Math.floor(j / 2);
      const cx = hx0 + i * a1 + (j % 2) * (a1 / 2);
      const cy = hy0 + j * 1.5 * s;
      b += `<polygon points="${hexPts(cx, cy)}" fill="none" stroke="${CARB}" stroke-width="2"/>`;
      if ((((ii - j) % 3) + 3) % 3 === 0) dots += circ(cx, cy, 7, LI);
    }
  }
  b += dots;
  b += text(170, 530, "俯视：每 6 个 C 配 1 个 Li", { size: 19, anchor: "middle", fill: COL.text2 });
  b += rect(345, 350, 455, 160, "#F1ECF8", { rx: 14 });
  b += text(365, 388, "理论容量（按碳的质量）", { size: 20, weight: "bold", fill: LI });
  b += text(365, 430, "Q = F ÷ (6 × 12.01) ÷ 3.6", { size: 21 });
  b += text(365, 478, "≈ 372 mAh/g", { size: 30, weight: "bold", fill: LI });
  return svg(W, H, b);
};

// ---------- 9. Co-intercalation vs polymer ----------
figs.cointercalation = () => {
  const W = 820, H = 540;
  let b = "";
  const pc = (cx, cy, a) => {
    const x = cx + 26 * Math.cos(a), y = cy + 26 * Math.sin(a);
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="12" ry="8" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="2"/>`;
  };
  // top: PC
  b += rect(10, 10, 800, 255, "#FBEDEC", { rx: 16 });
  b += text(30, 46, "液态 PC：Li^{+} 带着溶剂壳一起挤进去", { size: 21, weight: "bold", fill: COL.red });
  // graphite wedge opened
  const gx = 470;
  b += line(gx, 90, 790, 90, CARB, 6) + line(gx, 130, 790, 130, CARB, 6);
  b += path(`M${gx} 160 Q 560 175 790 200`, CARB, 6) + path(`M${gx} 235 Q 560 215 790 240`, CARB, 6);
  // solvated Li entering
  const sx = 400, sy = 198;
  for (let i = 0; i < 6; i++) b += pc(sx, sy, (i * Math.PI) / 3);
  b += ion(sx, sy, { r: 12, fill: LI, label: "+" });
  b += arrow(sx + 40, sy, gx + 30, sy, { color: COL.red, width: 3.5, head: 13 });
  // bubbles
  [[640, 200, 9], [690, 192, 6], [730, 210, 8]].forEach(([x, y, r]) => (b += circ(x, y, r, "#FFFFFF", { stroke: COL.red, sw: 2 })));
  b += lines(30, 95, ["溶剂分子太大，", "把石墨层撑开、", "还会分解放气：", "剥离 (exfoliation)"], { size: 19, lh: 28, fill: COL.ink });
  // bottom: PEO
  b += rect(10, 280, 800, 250, "#E8F4F3", { rx: 16 });
  b += text(30, 316, "固体 PEO：高分子链进不去，只有 Li^{+} 进去", { size: 21, weight: "bold", fill: AN });
  b += sheets(gx, 350, 320, 4, 44, CARB, 6);
  [372, 416, 460].forEach((y) => { for (let k = 0; k < 4; k++) b += circ(gx + 60 + k * 70, y, 8, LI); });
  b += path("M60 470 Q 90 420 130 450 T 200 450 T 270 440 T 340 470 T 400 440", AN, 5);
  b += ion(230, 420, { r: 12, fill: LI, label: "+" });
  b += arrow(255, 412, gx + 22, 416, { color: AN, width: 3.5, head: 13 });
  b += lines(30, 360, ["醚氧拉住 Li^{+}，", "但长链留在外面"], { size: 19, lh: 28, fill: COL.ink });
  b += text(630, 516, "层间距只到 3.70 Å", { size: 19, anchor: "middle", fill: AN, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 10. Yazami cell (redrawn Fig. 1) ----------
figs.yazami_cell = () => {
  const W = 820, H = 470;
  let b = "";
  const cx = 230;
  // pyrex vessel
  b += path(`M${cx - 150} 130 L${cx - 150} 390 L${cx + 150} 390 L${cx + 150} 130`, COL.muted, 4);
  b += path(`M${cx - 150} 130 L${cx - 120} 100 L${cx - 120} 58 M${cx + 150} 130 L${cx + 120} 100 L${cx + 120} 58`, COL.muted, 4);
  b += rect(cx - 140, 46, 280, 16, COL.line, { rx: 4 });
  // lead +
  b += rect(cx - 8, 22, 16, 228, COL.alu, { rx: 3 });
  b += text(cx + 22, 30, "+", { size: 26, weight: "bold" });
  // spring
  let sp = `M${cx} 250`;
  for (let i = 0; i < 6; i++) sp += ` L${cx + (i % 2 ? -14 : 14)} ${256 + i * 7}`;
  sp += ` L${cx} 296`;
  b += path(sp, COL.siDark, 3);
  // stack: polymer electrolyte with HOPG on top, Li disc, holder
  b += rect(cx - 110, 296, 220, 32, COL.electrolyte, { stroke: AN, sw: 2 });
  b += rect(cx - 50, 296, 100, 14, COL.ink, { rx: 2 });
  b += rect(cx - 110, 328, 220, 16, LI, { rx: 2 });
  b += rect(cx - 140, 344, 280, 30, COL.alu, { rx: 4, stroke: COL.siDark, sw: 2 });
  b += rect(cx - 8, 374, 16, 70, COL.alu, { rx: 3 });
  b += text(cx + 22, 448, "−", { size: 28, weight: "bold" });
  const lab = (x1, y1, x2, y2, t, c) => {
    b += line(x1, y1, x2, y2, COL.muted, 1.8);
    b += text(x2 + 8, y2 + 7, t, { size: 20, fill: c || COL.ink, weight: "bold" });
  };
  lab(cx + 150, 170, 410, 150, "Pyrex 玻璃容器（充氩）", COL.text2);
  lab(cx + 14, 262, 410, 222, "金属弹簧（压紧）", COL.siDark);
  lab(cx + 50, 302, 410, 270, "HOPG 石墨（工作电极）", COL.ink);
  lab(cx + 110, 320, 410, 312, "PEO–LiClO_{4} 固体电解质", AN);
  lab(cx + 110, 336, 410, 352, "金属锂片，直径 12 mm", LI);
  lab(cx + 140, 362, 410, 394, "不锈钢底座", COL.siDark);
  return svg(W, H, b);
};

// ---------- 11. Yazami OCV staging (redrawn Fig. 4) ----------
figs.yazami_ocv = () => {
  const W = 820, H = 540;
  let b = "";
  const x0 = 110, x1 = 760, y0 = 450, y1 = 60;
  const X = (q) => x0 + (q / 125) * (x1 - x0);
  const Y = (v) => y0 - v * (y0 - y1);
  b += line(x0, y1 - 10, x0, y0, COL.ink, 3) + line(x0, y0, x1 + 10, y0, COL.ink, 3);
  [0, 0.5, 1].forEach((v) => {
    b += line(x0 - 8, Y(v), x0, Y(v), COL.ink, 2) + text(x0 - 14, Y(v) + 7, String(v), { size: 19, anchor: "end", fill: COL.text2 });
  });
  [0, 50, 100].forEach((q) => {
    b += line(X(q), y0, X(q), y0 + 8, COL.ink, 2) + text(X(q), y0 + 34, String(q), { size: 19, anchor: "middle", fill: COL.text2 });
  });
  b += text(x1, y0 + 70, "嵌入的电量 Q（库仑）→ 锂越来越多", { size: 19, anchor: "end", fill: COL.text2 });
  b += lines(x0 - 95, y1 + 10, ["电位", "V vs Li"], { size: 19, fill: COL.text2, lh: 24 });
  const pts = [[1, 0.95], [4, 0.8], [10, 0.66], [25, 0.6], [38, 0.56], [48, 0.5], [58, 0.44], [72, 0.41], [84, 0.38], [92, 0.33], [100, 0.3], [112, 0.29], [122, 0.28]];
  let d = `M${X(pts[0][0])} ${Y(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) d += ` L${X(pts[i][0]).toFixed(1)} ${Y(pts[i][1]).toFixed(1)}`;
  b += path(d, COL.ink, 4);
  // stage markers
  b += line(X(42), Y(0.95), X(42), Y(0.6), COL.muted, 2, "6 5") + text(X(42), Y(0.95) - 10, "→ 4 阶", { size: 19, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += line(X(86), Y(0.95), X(86), Y(0.44), COL.muted, 2, "6 5") + text(X(86), Y(0.95) - 10, "→ 2 阶", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X(118), Y(0.95) - 10, "→ 1 阶", { size: 19, anchor: "middle", weight: "bold", fill: COL.sulfur });
  const tag = (q, v, t) => (b += circ(X(q), Y(v), 18, "#FFFFFF", { stroke: COL.ink, sw: 2.5 }) + text(X(q), Y(v) + 7, t, { size: 20, anchor: "middle", weight: "bold" }));
  tag(22, 0.45, "A");
  tag(66, 0.3, "B");
  tag(108, 0.17, "C");
  return svg(W, H, b);
};

// ---------- 12. Yoshino's path ----------
figs.yoshino_path = () => {
  const W = 1240, H = 300;
  let b = "";
  const steps = [
    ["1981", "聚乙炔负极", ["导电高分子", "能被 Li^{+} “n 掺杂”"], LI, "#F1ECF8"],
    ["1983", "配上 LiCoO_{2}", ["第一个原型：", "负极不含金属锂"], CAT, "#FDF2E7"],
    ["问题", "聚乙炔不行", ["密度低、体积大", "化学上不稳定"], COL.red, "#FBEDEC"],
    ["1985", "改用碳材料", ["VGCF、焦炭等", "日本专利申请"], AN, "#E8F4F3"],
    ["1986–87", "安全试验 · 美国专利", ["重物撞击不起火", "1987 年授权"], COL.siDark, COL.light],
  ];
  const bw = 216, gap = 34;
  steps.forEach(([yr, head, sub, c, fill], i) => {
    const x = 10 + i * (bw + gap);
    b += rect(x, 30, bw, 250, fill, { rx: 16 });
    b += text(x + bw / 2, 78, yr, { size: 28, anchor: "middle", weight: "bold", fill: c });
    b += text(x + bw / 2, 128, head, { size: 21, anchor: "middle", weight: "bold", fill: COL.ink });
    b += lines(x + bw / 2, 180, sub, { size: 19, anchor: "middle", fill: COL.text2, lh: 30 });
    if (i < steps.length - 1) b += arrow(x + bw + 3, 155, x + bw + gap - 3, 155, { color: COL.muted, width: 3.5, head: 12 });
  });
  return svg(W, H, b);
};

// ---------- 13. Patent claims map ----------
figs.patent_claims = () => {
  const W = 820, H = 480;
  let b = "";
  b += rect(20, 10, 780, 84, COL.light, { rx: 14 });
  b += text(410, 44, "Claim 1：正极 + 负极 + 隔膜 + 非水电解液", { size: 21, anchor: "middle", weight: "bold" });
  b += text(410, 78, "至少一个电极用下面的 I 或 II 作活性物质", { size: 19, anchor: "middle", fill: COL.text2 });
  b += arrow(250, 94, 215, 118, { color: CAT, width: 3 }) + arrow(570, 94, 605, 118, { color: AN, width: 3 });
  // I
  b += rect(20, 122, 380, 232, "#FDF2E7", { rx: 14 });
  b += text(38, 156, "I  层状复合氧化物", { size: 21, weight: "bold", fill: CAT });
  b += text(38, 192, "A_{x}M_{y}N_{z}O_{2}", { size: 24, weight: "bold" });
  b += lines(38, 228, ["A：碱金属，Li 最好 (cl. 2)", "M：Co 或 Ni (cl. 3)", "N：Al、In、Sn，Sn 最好 (cl. 4)", "0.05 ≤ x ≤ 1.10"], { size: 19, lh: 31 });
  // II
  b += rect(420, 122, 380, 232, "#E8F4F3", { rx: 14 });
  b += text(438, 156, "II  n 型掺杂的碳材料", { size: 21, weight: "bold", fill: AN });
  b += lines(438, 192, ["密度 1.70 < ρ < 2.18 g/cm³", "10 < Lc < 120ρ − 189 Å", "（石墨 2.25 g/cm³，被排除）", "VGCF (cl. 5)、沥青碳 (cl. 6)", "PAN 碳 (cl. 7)、针状焦 (cl. 8)"], { size: 19, lh: 31 });
  // bottom
  b += rect(20, 368, 780, 104, "#F1ECF8", { rx: 14 });
  b += text(38, 402, "Claim 20：正极用 I + 负极用 II（最佳组合）", { size: 21, weight: "bold", fill: LI });
  b += text(38, 436, "其余：粘结剂 (9–11)、聚烯烃微孔隔膜 (12)、", { size: 19, fill: COL.text2 });
  b += text(38, 463, "环状碳酸酯 PC / EC / VC (13–14)、导电碳 (15–17)", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 14. Li-ion: assembled discharged, then charge / discharge ----------
figs.liion_assembled = () => {
  const W = 1240, H = 320;
  let b = "";
  const panel = (x0, title, cFill, oFill, arrowDir, c, note) => {
    b += rect(x0, 10, 400, 300, COL.light, { rx: 16 });
    b += text(x0 + 200, 46, title, { size: 21, anchor: "middle", weight: "bold", fill: c });
    b += carbonHost(x0 + 25, 80, 125, 5, 36, cFill, { sw: 5, r: 7 });
    b += oxideHost(x0 + 250, 76, 125, 5, 36, oFill, { r: 7 });
    b += text(x0 + 87, 262, "碳", { size: 19, anchor: "middle", weight: "bold", fill: CARB });
    b += text(x0 + 312, 262, "LiCoO_{2}", { size: 19, anchor: "middle", weight: "bold", fill: CO });
    if (arrowDir === 1) b += arrow(x0 + 238, 150, x0 + 162, 150, { color: c, width: 4, head: 14 });
    if (arrowDir === -1) b += arrow(x0 + 162, 150, x0 + 238, 150, { color: c, width: 4, head: 14 });
    if (arrowDir) b += text(x0 + 200, 135, "Li^{+}", { size: 19, anchor: "middle", weight: "bold", fill: c });
    b += text(x0 + 200, 296, note, { size: 19, anchor: "middle", fill: COL.text2 });
  };
  panel(10, "① 组装时：放电态", [0, 0, 0, 0], [1, 1, 1, 1], 0, COL.ink, "锂全在正极，碳是空的");
  panel(420, "② 充电", [0.6, 0.6, 0.6, 0.6], [0.4, 0.4, 0.4, 0.4], 1, AN, "锂离子搬进碳层间");
  panel(830, "③ 放电", [0.2, 0.2, 0.2, 0.2], [0.8, 0.8, 0.8, 0.8], -1, CAT, "锂离子回到 LiCoO_{2}");
  return svg(W, H, b);
};

module.exports = figs;
