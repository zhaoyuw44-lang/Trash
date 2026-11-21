// Figures for Manthiram, Yu & Wang 2017, Chapter 1 (Introduction, history, ion-transport basics)
// Canvas widths are chosen ≈ 100 px per slide inch so that 16 px text ≈ 11.5 pt on the slide.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- local helpers ----------
const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const flame = (x, y, s = 1) =>
  `<path d="M${x},${y} C${x - 22 * s},${y - 8 * s} ${x - 20 * s},${y - 34 * s} ${x - 4 * s},${y - 52 * s} C${x - 6 * s},${y - 36 * s} ${x + 6 * s},${y - 34 * s} ${x + 4 * s},${y - 46 * s} C${x + 20 * s},${y - 32 * s} ${x + 24 * s},${y - 8 * s} ${x},${y} Z" fill="${COL.red}"/>` +
  `<path d="M${x},${y - 4 * s} C${x - 10 * s},${y - 8 * s} ${x - 9 * s},${y - 22 * s} ${x},${y - 30 * s} C${x + 9 * s},${y - 22 * s} ${x + 10 * s},${y - 8 * s} ${x},${y - 4 * s} Z" fill="${COL.amber}"/>`;
const curvedArrow = (d, tipX, tipY, ang, c, w = 3, dash) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} stroke-linecap="round"/>` + head(tipX, tipY, ang, c, 13);

// ---------- Title motif: Li+ hopping through a crystalline framework ----------
figs.title_motif = () => {
  const W = 520, H = 560;
  let b = "";
  // slab outline
  b += rect(40, 70, 440, 420, "none", { rx: 26, stroke: "#FFFFFF", sw: 6, opacity: 0.85 });
  // framework anions
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 6; c++) {
      const x = 95 + c * 66 + (r % 2 ? 33 : 0), y = 120 + r * 66;
      if (x > 450) continue;
      b += circ(x, y, 22, "#FFFFFF", { opacity: 0.18 });
      b += circ(x, y, 22, "none", { stroke: "#9FB0C0", sw: 2 });
    }
  // empty interstitial sites
  const path = [[62, 300], [128, 285], [161, 220], [227, 220], [260, 285], [326, 285], [359, 220], [425, 205], [470, 160]];
  path.slice(1, -1).forEach(([x, y]) => (b += circ(x, y, 10, "none", { stroke: COL.purpleLight, sw: 2.5, dash: "4 4" })));
  let d = `M${path[0][0]},${path[0][1]}`;
  path.slice(1).forEach(([x, y]) => (d += ` L${x},${y}`));
  b += `<path d="${d}" fill="none" stroke="${COL.amber}" stroke-width="4" stroke-dasharray="10 8" stroke-linejoin="round"/>`;
  b += head(482, 148, -0.75, COL.amber, 20);
  [[128, 285], [227, 220], [326, 285], [425, 205]].forEach(([x, y]) => (b += ion(x, y, { r: 15, fill: COL.purple })));
  return svg(W, H, b);
};

// ---------- 6-chapter map of the review ----------
figs.chapter_map = () => {
  const W = 1230, H = 500;
  let b = "";
  const cards = [
    { n: 1, t: "引言与固态电解质发展史", s: ["为什么要固态 · Fig. 1 时间线", "固体中的离子传输机理"], pg: "原文 p.1–3", col: COL.purple },
    { n: 2, t: "无机固态电解质", s: ["钙钛矿 · NASICON · 石榴石", "硫化物 · Table 1 · Fig. 2"], pg: "原文 p.3–4", col: COL.purple },
    { n: 3, t: "聚合物、复合与薄膜固态电解质", s: ["PEO 与锂盐 · 陶瓷填料", "LiPON · 原子层沉积"], pg: "原文 p.4–5", col: COL.purple },
    { n: 4, t: "全固态锂离子电池", s: ["无机 / 聚合物全固态电池", "固–固界面难题 · Fig. 3"], pg: "原文 p.5–6", col: COL.teal },
    { n: 5, t: "搭配液/气态电极的固态电解质", s: ["Li–空气 · Li–S · Li–Br_{2}", "固态电解质当“隔墙” · Fig. 4–6"], pg: "原文 p.6–10", col: COL.teal },
    { n: 6, t: "介体离子固态电解质与展望", s: ["水系“介体离子”电池 · Fig. 7", "挑战与前景 · Table 2"], pg: "原文 p.10–12", col: COL.amber },
  ];
  const cw = 336, ch = 190, gx = 30, x0 = 160;
  b += pill(6, 80, 130, 44, COL.purple, "材料篇", { size: 20 });
  b += text(71, 155, "电解质本身", { size: 16, anchor: "middle", fill: COL.text2 });
  b += pill(6, 320, 130, 44, COL.teal, "电池篇", { size: 20 });
  b += text(71, 395, "用它造电池", { size: 16, anchor: "middle", fill: COL.text2 });
  cards.forEach((c, i) => {
    const row = i < 3 ? 0 : 1, col = i % 3;
    const x = x0 + col * (cw + gx), y = 10 + row * 240;
    b += rect(x, y, cw, ch, i === 0 ? "#F1ECF8" : "#F5F7F9", { rx: 16, stroke: c.col, sw: i === 0 ? 4 : 2 });
    b += circ(x + 36, y + 36, 20, c.col);
    b += text(x + 36, y + 44, String(c.n), { size: 22, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    b += text(x + 66, y + 43, `第 ${c.n} 章`, { size: 17, fill: c.col, weight: "bold" });
    b += text(x + cw - 16, y + 43, c.pg, { size: 16, anchor: "end", fill: COL.muted });
    b += text(x + 18, y + 88, c.t, { size: 20, weight: "bold", fill: COL.ink });
    b += lines(x + 18, y + 128, c.s, { size: 17, fill: COL.text2, lh: 28 });
    if (col < 2) b += arrow(x + cw + 4, y + ch / 2, x + cw + gx - 4, y + ch / 2, { color: COL.line, width: 3, head: 10 });
  });
  const cx = x0 + 2 * (cw + gx) + cw / 2;
  b += arrow(cx, 10 + ch + 6, cx, 250 - 8, { color: COL.line, width: 3, head: 12 });
  b += text(cx + 14, 232, "材料 → 器件", { size: 16, fill: COL.muted });
  b += text(x0 + 4, 492, "粗紫框 = 本章。第 1–3 章讲“电解质是什么”，第 4–6 章讲“用它能造出什么电池”。", { size: 16, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Demand: applications vs current batteries ----------
figs.demand = () => {
  const W = 700, H = 470;
  let b = "";
  // phone
  const ax = [110, 350, 590];
  b += rect(ax[0] - 32, 40, 64, 112, "#FFFFFF", { rx: 10, stroke: COL.ink, sw: 4 });
  b += rect(ax[0] - 24, 54, 48, 80, COL.electrolyte);
  b += circ(ax[0], 142, 5, COL.ink);
  // car
  b += `<path d="M${ax[1] - 85},130 L${ax[1] - 85},104 Q${ax[1] - 80},92 ${ax[1] - 60},90 L${ax[1] - 40},64 Q${ax[1] - 34},58 ${ax[1] - 24},58 L${ax[1] + 30},58 Q${ax[1] + 40},58 ${ax[1] + 48},66 L${ax[1] + 70},90 Q${ax[1] + 85},92 ${ax[1] + 85},106 L${ax[1] + 85},130 Z" fill="${COL.teal}"/>`;
  b += circ(ax[1] - 48, 132, 17, COL.ink) + circ(ax[1] + 48, 132, 17, COL.ink) + circ(ax[1] - 48, 132, 7, "#FFFFFF") + circ(ax[1] + 48, 132, 7, "#FFFFFF");
  b += `<path d="M${ax[1] - 10},70 L${ax[1] - 20},92 L${ax[1] - 4},92 L${ax[1] - 12},112 L${ax[1] + 12},84 L${ax[1] - 2},84 L${ax[1] + 6},70 Z" fill="${COL.amberLight}"/>`;
  // grid: wind turbine + solar + battery box
  b += line(ax[2] - 40, 150, ax[2] - 40, 70, COL.ink, 5);
  [0, 2.09, 4.19].forEach((a) => (b += line(ax[2] - 40, 70, ax[2] - 40 + 38 * Math.cos(a - 1.57), 70 + 38 * Math.sin(a - 1.57), COL.ink, 5)));
  b += `<polygon points="${ax[2] - 8},150 ${ax[2] + 6},110 ${ax[2] + 52},110 ${ax[2] + 38},150" fill="#3A7CA5"/>`;
  b += rect(ax[2] + 52, 118, 42, 32, COL.amber, { rx: 4 });
  ["消费电子", "电动汽车", "电网储能"].forEach((t, i) => (b += text(ax[i], 186, t, { size: 21, anchor: "middle", weight: "bold" })));
  ["更轻、更小", "跑得更远、更安全", "风电光伏削峰填谷"].forEach((t, i) => (b += text(ax[i], 214, t, { size: 17, anchor: "middle", fill: COL.text2 })));
  // requirement bar
  b += rect(20, 238, 660, 54, "#FDF2E7", { rx: 27 });
  b += text(350, 273, "要：能量密度↑ 寿命↑ 安全↑ 成本↓", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  // current batteries
  b += text(20, 336, "现有商用电池：都满足不了“越来越严苛”的要求", { size: 18, weight: "bold", fill: COL.ink });
  ["铅酸", "镍氢", "锂离子", "液流"].forEach((t, i) => {
    const x = 20 + i * 168;
    b += rect(x, 356, 150, 52, "#F5F7F9", { rx: 12, stroke: COL.line });
    b += text(x + 62, 390, t, { size: 19, anchor: "middle", weight: "bold", fill: COL.text2 });
    b += cross(x + 126, 382, 9, COL.red, 4);
  });
  b += text(20, 450, "它们几乎都用液体电解质（过去 200 年的主流）", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Liquid vs solid electrolyte ----------
figs.liquid_vs_solid = () => {
  const W = 700, H = 500;
  let b = "";
  const tag = (x, y, t, c, w) => rect(x - w / 2, y - 21, w, 30, "#FFFFFF", { rx: 15, opacity: 0.92 }) + text(x, y, t, { size: 18, anchor: "middle", fill: c, weight: "bold" });
  const panel = (X, solid) => {
    let s = "";
    const w = 330;
    s += rect(X, 60, 40, 320, "#B9C3CC");
    s += text(X + 20, 410, "Li", { size: 19, anchor: "middle", weight: "bold" });
    s += rect(X + w - 40, 60, 40, 320, COL.amberLight, { stroke: COL.amber });
    s += text(X + w - 20, 410, "正极", { size: 19, anchor: "middle", weight: "bold" });
    if (!solid) {
      s += rect(X + 40, 60, w - 80, 320, COL.electrolyte);
      s += rect(X + 150, 60, 30, 320, "#F4F1FA", { stroke: COL.purpleLight });
      for (let y = 74; y < 375; y += 26) s += `<ellipse cx="${X + 165}" cy="${y}" rx="9" ry="5" fill="${COL.electrolyte}"/>`;
      s += arrow(X + 272, 118, X + 58, 118, { color: COL.red, width: 3.5, dash: "8 6", head: 13 });
      s += tag(X + 165, 100, "可溶物穿过", COL.red, 120);
      s += `<path d="M${X + 40},240 L${X + 85},232 L${X + 120},246 L${X + 160},236 L${X + 205},244" fill="none" stroke="#7D8893" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += line(X + 120, 246, X + 130, 268, "#7D8893", 6) + line(X + 85, 232, X + 93, 212, "#7D8893", 6);
      s += tag(X + 240, 216, "枝晶", COL.siDark, 64);
      s += flame(X + 230, 360, 0.9);
      s += tag(X + 120, 340, "易燃溶剂", COL.red, 96);
    } else {
      s += rect(X + 40, 60, w - 80, 320, "#EEF2F5");
      for (let r = 0; r < 7; r++)
        for (let c = 0; c < 5; c++) {
          const x = X + 64 + c * 50 + (r % 2 ? 25 : 0), y = 84 + r * 46;
          if (x > X + w - 58) continue;
          s += `<polygon points="${[0, 1, 2, 3, 4, 5].map((k) => `${(x + 23 * Math.cos(k * Math.PI / 3 + Math.PI / 6)).toFixed(1)},${(y + 23 * Math.sin(k * Math.PI / 3 + Math.PI / 6)).toFixed(1)}`).join(" ")}" fill="#D9DEE3" stroke="#FFFFFF" stroke-width="3"/>`;
        }
      s += arrow(X + 52, 140, X + w - 52, 140, { color: COL.purple, width: 4, head: 14 });
      s += ion(X + 120, 140, { r: 13 }) + ion(X + 210, 140, { r: 13 });
      s += tag(X + 165, 112, "只放 Li⁺ 通过", COL.purple, 136);
      s += `<path d="M${X + 40},250 L${X + 62},245 L${X + 76},252" fill="none" stroke="#7D8893" stroke-width="9" stroke-linecap="round"/>`;
      s += cross(X + 96, 250, 11, COL.red, 4.5);
      s += tag(X + 190, 258, "挡住枝晶", COL.teal, 100);
      s += tag(X + 165, 340, "不燃", COL.teal, 64);
    }
    return s;
  };
  b += text(185, 36, "液体电解质 + 隔膜", { size: 22, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += panel(20, false);
  b += text(535, 36, "固态电解质隔膜", { size: 22, anchor: "middle", weight: "bold", fill: COL.teal });
  b += panel(370, true);
  b += text(185, 452, "导电好、润湿好", { size: 18, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(185, 482, "但不稳、无选择性、不安全", { size: 18, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(535, 452, "安全、只让 Li⁺ 通过", { size: 18, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(535, 482, "两侧可以放不同的东西", { size: 18, anchor: "middle", fill: COL.purple, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Safety chain ----------
figs.safety_chain = () => {
  const W = 1230, H = 240;
  let b = "";
  const steps = [
    ["过充 / 短路", "电池被“用坏”", "#FBEDEC", COL.red],
    ["局部发热", "电流集中、温度上升", "#FBEDEC", COL.red],
    ["有机电解液", "易燃、受热分解产气", "#FBEDEC", COL.red],
    ["热失控", "越热反应越快", "#FBEDEC", COL.red],
    ["起火 / 爆炸", "", COL.red, "#FFFFFF"],
  ];
  steps.forEach(([h, s, f, c], i) => {
    const x = 10 + i * 246;
    b += rect(x, 14, 206, 104, f, { rx: 16 });
    b += text(x + 103, s ? 56 : 74, h, { size: 22, anchor: "middle", weight: "bold", fill: c });
    if (s) b += text(x + 103, 92, s, { size: 17, anchor: "middle", fill: COL.text2 });
    if (i < 4) b += arrow(x + 210, 66, x + 242, 66, { color: COL.red, width: 3, head: 11 });
  });
  const x3 = 10 + 2 * 246;
  b += rect(x3 - 8, 6, 222, 120, "none", { rx: 20, stroke: COL.teal, sw: 4, dash: "10 7" });
  b += line(x3 + 103, 126, x3 + 103, 156, COL.teal, 4);
  b += rect(x3 - 60, 156, 326, 70, "#E8F4F3", { rx: 16, stroke: COL.teal });
  b += text(x3 + 103, 186, "换成不燃的固态电解质", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(x3 + 103, 214, "→ 从源头拿掉“燃料”", { size: 18, anchor: "middle", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- Faraday: conduction grows on heating (qualitative) ----------
figs.faraday = () => {
  const W = 620, H = 440;
  let b = "";
  const X0 = 90, X1 = 580, Y0 = 360, Y1 = 40;
  b += line(X0, Y0, X1, Y0, COL.ink, 3) + head(X1 + 10, Y0, 0, COL.ink, 14);
  b += line(X0, Y0, X0, Y1, COL.ink, 3) + head(X0, Y1 - 10, -Math.PI / 2, COL.ink, 14);
  b += text((X0 + X1) / 2, Y0 + 40, "温度 → （加热）", { size: 18, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(46 ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "导电能力 →", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  // metal: decreasing gently
  b += `<path d="M${X0 + 10},110 C 250,130 400,155 ${X1 - 20},175" fill="none" stroke="${COL.alu}" stroke-width="6" stroke-linecap="round"/>`;
  b += text(X1 - 20, 205, "金属：越热越差", { size: 17, anchor: "end", fill: COL.siDark, weight: "bold" });
  // ionic solid: rises steeply
  b += `<path d="M${X0 + 10},340 C 260,336 330,320 370,250 C 400,190 430,120 ${X1 - 40},70" fill="none" stroke="${COL.purple}" stroke-width="6" stroke-linecap="round"/>`;
  b += lines(X0 + 30, 290, ["Ag_{2}S、PbF_{2}：", "越热越导电"], { size: 18, fill: COL.purple, weight: "bold", lh: 26 });
  b += pill(X1 - 200, 46, 150, 34, COL.purple, "离子在“跑”", { size: 16 });
  b += text(X1, 424, "定性示意，非实测数据", { size: 16, anchor: "end", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Solid-state ionics timeline (discoveries) ----------
figs.ionics_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1830s", who: ["Faraday"], what: ["加热的 Ag_{2}S、", "PbF_{2} 能导电"], color: COL.text2 },
    { year: "1899", who: ["Nernst"], what: ["掺 Y 的 ZrO_{2}", "（能斯特灯）"], color: COL.text2 },
    { year: "1914", who: ["Tubandt & Lorenz"], what: ["α-AgI：固体的", "电导堪比熔盐"], color: COL.text2 },
    { year: "1960", who: ["Reuter & Hardel"], what: ["Ag_{3}SI", "室温 Ag⁺ 导体"], color: COL.purple },
    { year: "1967", who: ["Yao & Kummer"], what: ["β-氧化铝", "二维 Na⁺ 快速传导"], color: COL.purple },
    { year: "1967", who: ["Owens & Argue 等"], what: ["RbAg_{4}I_{5}", "室温电导之最"], color: COL.purple },
    { year: "1973", who: ["Fenton, Parker", "& Wright"], what: ["PEO–盐络合物", "高分子也能导离子"], color: COL.teal },
    { year: "1980", who: ["期刊创刊"], what: ["Solid State Ionics", "“固态离子学”通行"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 85, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Fig. 1 redrawn: battery timeline ----------
figs.fig1_timeline = () => {
  const W = 1240, H = 430;
  const ev = [
    { year: "1960s", who: ["高温 Na–S 电池"], what: ["β-氧化铝隔膜", "（本章）"], color: COL.text2 },
    { year: "1980s", who: ["ZEBRA 电池", "聚合物锂电池"], what: ["PEO 电解质", "（第 3 章）"], color: COL.text2 },
    { year: "1990s", who: ["无机固态电解质", "锂离子电池"], what: ["LiPON 薄膜起步", "（第 2–4 章）"], color: COL.purple },
    { year: "2000s", who: ["固态电解质", "Li–空气 / Li–S / Li–Br_{2}"], what: ["液/气态正极", "（第 5 章）"], color: COL.teal },
    { year: "2010s", who: ["介体离子", "水系电池"], what: ["低成本、安全", "（第 6 章）"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 210, left: 120, right: 1100, whoSize: 20, whatSize: 18, yearSize: 30 }));
};

// ---------- beta-alumina: 2D conduction planes ----------
figs.beta_alumina = () => {
  const W = 640, H = 470;
  let b = "";
  const block = (y) => {
    let s = rect(20, y, 400, 92, "#DCE3E9", { rx: 8, stroke: "#9AA6B2" });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) s += circ(42 + c * 38 + (r % 2 ? 19 : 0), y + 18 + r * 28, 9, "#B5C0CA");
    return s;
  };
  b += block(20);
  b += block(198);
  b += block(376);
  [112, 290].forEach((y) => {
    b += rect(20, y, 400, 86, "#F1ECF8");
    [60, 160, 260, 360].forEach((x) => (b += circ(x, y + 43, 8, COL.red)));
    [[110, 43], [310, 43]].forEach(([x, dy]) => (b += ion(x, y + dy, { r: 17, fill: COL.purple, label: "Na" })));
  });
  b += arrow(130, 155, 200, 155, { color: COL.purple, width: 4, head: 14 });
  b += arrow(330, 333, 400, 333, { color: COL.purple, width: 4, head: 14 });
  b += arrow(290, 333, 225, 333, { color: COL.purple, width: 4, head: 14 });
  b += line(390, 270, 390, 220, COL.red, 3, "5 5");
  b += cross(390, 245, 11);
  b += text(436, 62, "尖晶石块", { size: 20, weight: "bold", fill: COL.siDark });
  b += text(436, 90, "Al–O 致密层", { size: 18, fill: COL.text2 });
  b += text(436, 150, "传导面", { size: 20, weight: "bold", fill: COL.purple });
  b += text(436, 178, "Na⁺ 在面内跑", { size: 18, fill: COL.text2 });
  b += text(436, 242, "穿层？过不去", { size: 19, weight: "bold", fill: COL.red });
  b += circ(446, 326, 8, COL.red);
  b += text(462, 332, "桥氧 O", { size: 18, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Na–S and ZEBRA cells ----------
figs.nas_zebra = () => {
  const W = 680, H = 500;
  let b = "";
  const cell = (X, title, inner, innerFill, outer, outerFill, rxn, v) => {
    let s = "";
    s += text(X + 150, 34, title, { size: 22, anchor: "middle", weight: "bold" });
    s += rect(X + 40, 56, 220, 300, outerFill, { rx: 30, stroke: COL.ink, sw: 4 });
    s += rect(X + 115, 76, 90, 260, "#FFFFFF", { rx: 45, stroke: COL.purple, sw: 8 });
    s += rect(X + 123, 84, 74, 244, innerFill, { rx: 37 });
    s += lines(X + 160, 196, inner, { size: 19, anchor: "middle", weight: "bold", fill: COL.ink, lh: 26 });
    s += lines(X + 78, 150, outer, { size: 18, anchor: "middle", weight: "bold", fill: COL.ink, lh: 26 });
    s += text(X + 150, 392, rxn, { size: 18, anchor: "middle", fill: COL.ink, weight: "bold" });
    s += text(X + 150, 420, v, { size: 18, anchor: "middle", fill: COL.text2 });
    return s;
  };
  b += cell(10, "钠硫 Na–S", ["熔融", "Na"], "#C9D2DA", ["熔融", "S"], COL.sulfurLight, "2Na + xS → Na_{2}S_{x}", "≈2.1 V");
  b += cell(360, "ZEBRA", ["熔融", "Na"], "#C9D2DA", ["NiCl_{2}", "+", "熔盐"], "#CFE6CF", "2Na + NiCl_{2} → 2NaCl + Ni", "≈2.6 V");
  b += rect(40, 452, 34, 18, "#FFFFFF", { stroke: COL.purple, sw: 5, rx: 9 });
  b += text(84, 467, "紫色管 = β″-氧化铝陶瓷", { size: 18, fill: COL.purple, weight: "bold" });
  b += pill(420, 444, 230, 34, COL.red, "工作温度约 300 °C", { size: 18 });
  return svg(W, H, b);
};

// ---------- Silver-ion solid-state cell ----------
figs.silver_cell = () => {
  const W = 620, H = 400;
  let b = "";
  b += rect(40, 60, 130, 220, "#D9DEE3", { stroke: "#9AA6B2" });
  b += text(105, 175, "Ag", { size: 26, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += rect(170, 60, 200, 220, "#F1ECF8", { stroke: COL.purpleLight });
  b += text(270, 100, "RbAg_{4}I_{5}", { size: 22, anchor: "middle", weight: "bold", fill: COL.purple });
  b += rect(370, 60, 130, 220, "#4F5B66");
  b += lines(435, 165, ["I_{2}", "+ 碳"], { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF", lh: 30 });
  b += arrow(120, 200, 420, 200, { color: COL.purple, width: 3.5, head: 14 });
  [190, 270, 350].forEach((x) => (b += ion(x, 200, { r: 14, fill: COL.purple, label: "Ag" })));
  b += text(270, 250, "Ag⁺ 穿过固体", { size: 17, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(270, 320, "放电：2Ag + I_{2} → 2AgI", { size: 19, anchor: "middle", weight: "bold" });
  b += cross(70, 362, 8) + text(88, 368, "电压只有约 0.7 V", { size: 17, fill: COL.red, weight: "bold" });
  b += cross(340, 362, 8) + text(358, 368, "Ag 又重又贵", { size: 17, fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Family tree of solid electrolytes ----------
figs.family_tree = () => {
  const W = 1230, H = 450;
  let b = "";
  b += rect(470, 10, 290, 56, COL.ink, { rx: 28 });
  b += text(615, 46, "锂离子固态电解质", { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += line(615, 66, 615, 96, COL.line, 4);
  b += line(300, 96, 960, 96, COL.line, 4);
  b += line(300, 96, 300, 120, COL.line, 4) + line(960, 96, 960, 120, COL.line, 4);
  b += rect(130, 120, 340, 54, COL.purple, { rx: 27 });
  b += text(300, 155, "无机陶瓷 / 玻璃（第 2 章）", { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += rect(790, 120, 340, 54, COL.teal, { rx: 27 });
  b += text(960, 155, "高分子（第 3 章）", { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  const leaves = (xs, y, items, col, fill) =>
    items.map(([t, s], i) => {
      const x = xs[i];
      return line(x, y - 20, x, y, col, 2.5) +
        rect(x - 75, y, 150, 74, fill, { rx: 12, stroke: col, sw: 2 }) +
        text(x, y + 32, t, { size: 18, anchor: "middle", weight: "bold", fill: COL.ink }) +
        text(x, y + 58, s, { size: 17, anchor: "middle", fill: COL.text2 });
    }).join("");
  const inorgX = [92, 264, 436, 608];
  b += line(92, 194, 608, 194, COL.purple, 2.5) + line(300, 174, 300, 194, COL.purple, 2.5);
  b += leaves(inorgX, 214, [["氧化物", "钙钛矿 · 石榴石"], ["硫化物", "Li_{2}S–P_{2}S_{5}"], ["氢化物", "LiBH_{4}"], ["卤化物", "LiI · Li_{3}OCl"]], COL.purple, "#F1ECF8");
  b += line(178, 314, 522, 314, COL.purple, 2.5) + line(350, 288, 350, 314, COL.purple, 2.5);
  b += leaves([178, 522], 334, [["硼酸 / 磷酸盐", "Li_{3}PO_{4} 等"], ["薄膜", "LiPON（第 3 章）"]], COL.purple, "#F1ECF8");
  const polX = [800, 960, 1120];
  b += line(800, 194, 1120, 194, COL.teal, 2.5) + line(960, 174, 960, 194, COL.teal, 2.5);
  b += leaves(polX, 214, [["干态", "PEO + 锂盐"], ["凝胶", "含液体，不讨论"], ["复合", "高分子 + 陶瓷"]], COL.teal, "#E8F4F3");
  b += text(960, 340, "1973 年起：PEO–盐", { size: 17, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(960, 366, "1980 年代起用于锂电池", { size: 17, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(960, 410, "1990 年代起：LiPON 带动无机 Li⁺ 导体", { size: 17, anchor: "middle", fill: COL.purple, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Devices built on solid-state ionics ----------
figs.devices = () => {
  const W = 600, H = 480;
  let b = "";
  const box = (x, y, t, s, col, icon) =>
    rect(x, y, 285, 225, "#F5F7F9", { rx: 16 }) + icon + text(x + 142, y + 170, t, { size: 22, anchor: "middle", weight: "bold", fill: col }) + text(x + 142, y + 200, s, { size: 18, anchor: "middle", fill: COL.text2 });
  let ic = `<path d="M100,130 L100,60 Q100,32 142,32 Q184,32 184,60 L184,130 Z" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="3"/>`;
  ic += text(142, 100, "O^{2−}", { size: 22, anchor: "middle", weight: "bold", fill: COL.amber });
  b += box(5, 5, "传感器", "氧传感器（ZrO_{2}）", COL.amber, ic);
  ic = rect(372, 34, 14, 100, COL.ink) + rect(502, 34, 14, 100, COL.ink) + ion(405, 62, { r: 12 }) + ion(405, 108, { r: 12 }) + ion(482, 85, { r: 12, fill: COL.teal, label: "−" });
  b += box(310, 5, "超级电容器", "离子在界面堆积", COL.teal, ic);
  ic = rect(72, 270, 46, 100, "#DDEFF8") + rect(118, 270, 60, 100, COL.amberLight, { stroke: COL.amber }) + rect(178, 270, 46, 100, "#DDEFF8");
  ic += text(95, 326, "H_{2}", { size: 20, anchor: "middle", weight: "bold" }) + text(201, 326, "O_{2}", { size: 20, anchor: "middle", weight: "bold" });
  b += box(5, 250, "燃料电池", "固体氧化物燃料电池", COL.red, ic);
  ic = rect(385, 280, 130, 84, "#FFFFFF", { rx: 8, stroke: COL.purple, sw: 4 }) + rect(515, 304, 12, 36, COL.purple) + rect(396, 291, 76, 62, COL.purpleLight, { rx: 4 });
  b += box(310, 250, "电池", "本综述的主角", COL.purple, ic);
  return svg(W, H, b);
};

// ---------- Point defects: Schottky vs Frenkel ----------
figs.defects = () => {
  const W = 760, H = 420;
  let b = "";
  const lattice = (X, kind) => {
    let s = rect(X, 34, 340, 290, "#F7F9FB", { rx: 14, stroke: COL.line });
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 6; c++) {
        const x = X + 40 + c * 52, y = 66 + r * 54;
        const cat = (r + c) % 2 === 0;
        const vac = kind === "S" ? (r === 1 && c === 2) || (r === 3 && c === 3) : r === 2 && c === 2;
        if (vac) s += circ(x, y, cat ? 13 : 19, "none", { stroke: COL.red, sw: 3, dash: "5 4" });
        else s += cat ? circ(x, y, 13, COL.purple) : circ(x, y, 19, "#C9D2DA", { stroke: "#9AA6B2", sw: 1.5 });
      }
    if (kind === "F") {
      s += circ(X + 40 + 2.5 * 52, 66 + 2.5 * 54, 12, COL.purple, { stroke: "#FFFFFF", sw: 2 });
      s += curvedArrow(`M${X + 144},${174} Q${X + 162},${176} ${X + 164},${190}`, X + 167, 194, 1.3, COL.amber, 3);
    } else {
      s += arrow(X + 196, 112, X + 300, 44, { color: COL.amber, width: 3, head: 12 });
      s += text(X + 300, 24, "移到表面", { size: 18, anchor: "end", fill: COL.amber, weight: "bold" });
    }
    return s;
  };
  b += lattice(20, "S");
  b += lattice(400, "F");
  b += text(190, 360, "肖特基缺陷 Schottky", { size: 20, anchor: "middle", weight: "bold" });
  b += text(190, 392, "正、负离子各缺一个", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(570, 360, "弗仑克尔缺陷 Frenkel", { size: 20, anchor: "middle", weight: "bold" });
  b += text(570, 392, "离子跳进间隙，留下空位", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Diffusion mechanisms ----------
figs.mechanisms = () => {
  const W = 1230, H = 330;
  let b = "";
  const P = [
    { t: "空位机制", s: "跳进隔壁空位", draw: "vac" },
    { t: "双空位机制", s: "借助一对空位", draw: "divac" },
    { t: "间隙机制", s: "在间隙之间穿行", draw: "int" },
    { t: "间隙–替位交换", s: "把格点离子“挤”走", draw: "xchg" },
    { t: "协同机制", s: "一串离子一起动", draw: "coll" },
  ];
  P.forEach((p, i) => {
    const X = 10 + i * 244;
    b += rect(X, 10, 226, 236, "#F7F9FB", { rx: 14, stroke: COL.line });
    const g = (c, r) => [X + 38 + c * 50, 50 + r * 50];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        const [x, y] = g(c, r);
        let empty = false;
        if (p.draw === "vac" && r === 1 && c === 2) empty = true;
        if (p.draw === "divac" && r === 1 && (c === 2 || c === 3)) empty = true;
        if (p.draw === "coll" && r === 2 && c === 3) empty = true;
        b += empty ? circ(x, y, 15, "none", { stroke: COL.red, sw: 2.5, dash: "4 4" }) : circ(x, y, 15, r === 1 || (p.draw === "coll" && r === 2) ? COL.purpleLight : "#C9D2DA");
      }
    const hop = (x1, y1, x2, y2) => arrow(x1, y1, x2, y2, { color: COL.amber, width: 3.5, head: 11 });
    if (p.draw === "vac") b += hop(g(1, 1)[0] + 14, g(1, 1)[1], g(2, 1)[0] - 16, g(2, 1)[1]);
    if (p.draw === "divac") b += hop(g(1, 1)[0] + 14, g(1, 1)[1], g(2, 1)[0] - 16, g(2, 1)[1]) + hop(g(1, 0)[0] + 10, g(1, 0)[1] + 10, g(3, 1)[0] - 14, g(3, 1)[1] - 8);
    if (p.draw === "int") {
      b += circ(g(0, 1)[0] + 25, g(0, 1)[1] + 25, 9, COL.purple);
      b += hop(g(0, 1)[0] + 35, g(0, 1)[1] + 25, g(1, 1)[0] + 15, g(1, 1)[1] + 25) + hop(g(1, 1)[0] + 30, g(1, 1)[1] + 25, g(2, 1)[0] + 15, g(2, 1)[1] + 25);
      b += circ(g(2, 1)[0] + 25, g(2, 1)[1] + 25, 9, COL.purple, { opacity: 0.45 });
    }
    if (p.draw === "xchg") {
      b += circ(g(0, 1)[0] + 25, g(0, 1)[1] + 25, 9, COL.purple);
      b += hop(g(0, 1)[0] + 30, g(0, 1)[1] + 18, g(1, 1)[0] - 6, g(1, 1)[1] + 10);
      b += circ(g(1, 1)[0], g(1, 1)[1], 15, COL.purple);
      b += hop(g(1, 1)[0] + 12, g(1, 1)[1] + 12, g(1, 1)[0] + 22, g(1, 1)[1] + 22);
      b += circ(g(1, 1)[0] + 25, g(1, 1)[1] + 25, 9, COL.purple, { opacity: 0.45 });
    }
    if (p.draw === "coll") [0, 1, 2].forEach((c) => (b += hop(g(c, 2)[0] + 14, g(c, 2)[1], g(c + 1, 2)[0] - 16, g(c + 1, 2)[1])));
    b += text(X + 113, 280, p.t, { size: 19, anchor: "middle", weight: "bold" });
    b += text(X + 113, 308, p.s, { size: 16, anchor: "middle", fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- Superionic: two sublattices + 3 criteria ----------
figs.superionic = () => {
  const W = 680, H = 540;
  let b = "";
  b += rect(10, 10, 660, 230, "#F7F9FB", { rx: 14, stroke: COL.line });
  for (let r = 0; r < 3; r++) {
    const n = r % 2 ? 6 : 7;
    for (let c = 0; c < n; c++) b += circ(60 + c * 93 + (r % 2 ? 46 : 0), 50 + r * 75, 24, "#C9D2DA", { stroke: "#9AA6B2", sw: 1.5 });
  }
  const sites = [];
  for (let c = 0; c < 13; c++) sites.push([60 + c * 46.5 + 23, 88]);
  for (let c = 0; c < 13; c++) sites.push([60 + c * 46.5 + 0, 163]);
  sites.forEach(([x, y]) => (b += circ(x.toFixed(1), y, 9, "none", { stroke: COL.purple, sw: 2, dash: "3 3" })));
  [1, 5, 10, 14, 19].forEach((k) => (b += ion(sites[k][0].toFixed(1), sites[k][1], { r: 12 })));
  b += arrow(sites[5][0] + 13, 88, sites[6][0] - 11, 88, { color: COL.amber, width: 3, head: 10 });
  b += arrow(sites[19][0] + 13, 163, sites[20][0] - 11, 163, { color: COL.amber, width: 3, head: 10 });
  b += text(20, 270, "灰：不动的骨架离子；虚线圈：Li⁺ 可停留的位置", { size: 19, fill: COL.text2 });
  const ey = 330;
  let d = `M20,${ey}`;
  for (let x = 20; x <= 660; x += 4) d += ` L${x},${(ey + 28 - 28 * Math.cos(((x - 20) / 64) * 2 * Math.PI)).toFixed(1)}`;
  b += `<path d="${d}" fill="none" stroke="${COL.purple}" stroke-width="4"/>`;
  b += line(372, ey + 56, 372, ey, COL.amber, 3, "4 4");
  b += rect(380, ey + 12, 72, 30, "#FFFFFF", { rx: 8 }) + text(386, ey + 34, "E_{a} 低", { size: 19, fill: COL.amber, weight: "bold" });
  b += text(20, ey + 92, "能量地形：一排浅浅的“坑”，离子很容易翻过去", { size: 19, fill: COL.text2 });
  const cy = 456;
  [["①", "位置 ≫ 离子数"], ["②", "相邻势垒低"], ["③", "位置连成通道"]].forEach(([n, t], i) => {
    const x = 10 + i * 224;
    b += rect(x, cy, 212, 64, "#FDF2E7", { rx: 32 });
    b += text(x + 34, cy + 41, n, { size: 24, anchor: "middle", weight: "bold", fill: COL.amber });
    b += text(x + 126, cy + 40, t, { size: 19, anchor: "middle", weight: "bold", fill: COL.ink });
  });
  return svg(W, H, b);
};

// ---------- Glass vs crystal ----------
figs.glass = () => {
  const W = 760, H = 420;
  let b = "";
  // crystal
  b += rect(20, 20, 340, 300, "#F7F9FB", { rx: 14, stroke: COL.line });
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
    const x = 60 + c * 52, y = 60 + r * 56;
    if (c < 5) b += line(x, y, x + 52, y, "#9AA6B2", 3);
    if (r < 4) b += line(x, y, x, y + 56, "#9AA6B2", 3);
    b += circ(x, y, 9, COL.siDark);
  }
  // glass: random network
  b += rect(400, 20, 340, 300, "#F7F9FB", { rx: 14, stroke: COL.line });
  const R = rng(17);
  const pts = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) pts.push([440 + c * 52 + (R() - 0.5) * 26, 60 + r * 56 + (R() - 0.5) * 26]);
  pts.forEach(([x, y], i) => {
    const c = i % 6, r = Math.floor(i / 6);
    if (c < 5 && R() > 0.15) b += line(x, y, pts[i + 1][0], pts[i + 1][1], "#9AA6B2", 3);
    if (r < 4 && R() > 0.2) b += line(x, y, pts[i + 6][0], pts[i + 6][1], "#9AA6B2", 3);
  });
  pts.forEach(([x, y]) => (b += circ(x.toFixed(1), y.toFixed(1), 9, COL.siDark)));
  // mobile ions in glass
  [[486, 112], [566, 196], [650, 140], [700, 250]].forEach(([x, y]) => (b += ion(x, y, { r: 11 })));
  b += arrow(500, 120, 552, 186, { color: COL.amber, width: 3, head: 11 });
  b += arrow(580, 190, 636, 148, { color: COL.amber, width: 3, head: 11 });
  b += text(190, 356, "晶体：长程有序", { size: 20, anchor: "middle", weight: "bold" });
  b += text(190, 386, "通道由晶格决定", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(570, 356, "玻璃：没有长程序", { size: 20, anchor: "middle", weight: "bold" });
  b += text(570, 386, "但短程、中程仍有序", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Polymer: Li+ hops with segmental motion ----------
figs.polymer_hop = () => {
  const W = 760, H = 440;
  let b = "";
  const chain = (y0, amp, phase, col, dash, op) => {
    let d = "";
    const pts = [];
    for (let i = 0; i <= 26; i++) {
      const x = 30 + i * 27;
      const y = y0 + amp * Math.sin(i * 0.55 + phase) + (i % 2 ? 9 : -9);
      pts.push([x, y]);
      d += (i ? " L" : "M") + x + "," + y.toFixed(1);
    }
    let s = `<path d="${d}" fill="none" stroke="${col}" stroke-width="4" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${op ? ` opacity="${op}"` : ""}/>`;
    return { s, pts };
  };
  const c1 = chain(110, 26, 0, COL.siDark);
  const c2 = chain(250, 26, 2.2, COL.siDark);
  const c2b = chain(232, 30, 3.1, COL.teal, "8 6", 0.9);
  b += c1.s + c2b.s + c2.s;
  // ether oxygens
  c1.pts.forEach(([x, y], i) => { if (i % 3 === 1) b += circ(x, y.toFixed(1), 7, COL.red); });
  c2.pts.forEach(([x, y], i) => { if (i % 3 === 1) b += circ(x, y.toFixed(1), 7, COL.red); });
  // Li between chains
  const l1 = [c1.pts[7][0] + 6, 180], l2 = [c1.pts[16][0] + 4, 180];
  b += ion(l1[0], l1[1], { r: 15 });
  b += ion(l2[0], l2[1], { r: 15, fill: COL.purple, label: "+" });
  b += `<circle cx="${l2[0]}" cy="${l2[1]}" r="15" fill="#FFFFFF" opacity="0.55"/>`;
  b += curvedArrow(`M${l1[0] + 18},${l1[1] - 10} Q${(l1[0] + l2[0]) / 2},${l1[1] - 60} ${l2[0] - 18},${l2[1] - 10}`, l2[0] - 18, l2[1] - 10, 0.6, COL.amber, 3.5);
  b += rect(l2[0] + 24, 166, 170, 30, "#FFFFFF", { rx: 15, opacity: 0.92 }) + text(l2[0] + 32, 188, "跳到下一个配位点", { size: 18, fill: COL.amber, weight: "bold" });
  // labels
  b += circ(40, 330, 7, COL.red) + text(56, 336, "醚氧 O（极性基团，抓住 Li⁺）", { size: 18, fill: COL.ink });
  b += line(34, 364, 70, 364, COL.teal, 4, "8 6") + text(80, 370, "链段运动后的位置（只在 T > T_{g} 时发生）", { size: 18, fill: COL.teal, weight: "bold" });
  b += text(40, 410, "链段一动，就腾出“自由体积”，Li⁺ 借机换个邻居", { size: 18, fill: COL.text2 });
  return svg(W, H, b);
};

module.exports = figs;
