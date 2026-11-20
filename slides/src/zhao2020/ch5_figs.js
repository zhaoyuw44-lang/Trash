// Figures for Zhao et al. 2020, Chapter 5 (Design strategies)
// Canvases are sized so that 15 px text stays >= 11 pt at the planned slide width.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- local helpers ----------
const LI = "#B9C3CC";
const LI_DARK = "#8F9BA6";
const SSE = "#E6EEF3";
const PEO = "#C99BBF";
const pathD = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L");

// wavy polymer chain from (x1,y) to (x2,y)
function chain(x1, y, x2, o = {}) {
  const amp = o.amp ?? 7, per = o.per ?? 22;
  let d = `M${x1},${y}`;
  let k = 0;
  for (let x = x1; x < x2 - 1; x += per / 2, k++) d += ` q ${per / 4} ${k % 2 ? amp : -amp} ${per / 2} 0`;
  return `<path d="${d}" fill="none" stroke="${o.color || PEO}" stroke-width="${o.w || 3}" stroke-linecap="round"/>`;
}
function anion(x, y, r = 9, fill = COL.red) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>` + `<line x1="${x - r * 0.5}" y1="${y}" x2="${x + r * 0.5}" y2="${y}" stroke="#FFFFFF" stroke-width="2.4"/>`;
}

// ---------- Title motif ----------
figs.title_motif = () => {
  const W = 480, H = 520;
  let b = "";
  // three stacked "layers": cathode, polymer/ceramic composite, Li
  b += `<rect x="40" y="60" width="400" height="80" rx="14" fill="${COL.amberLight}"/>`;
  b += `<rect x="40" y="160" width="400" height="200" rx="14" fill="#2E4256" stroke="#6F8AA3" stroke-width="3"/>`;
  for (let k = 0; k < 6; k++) b += chain(60, 190 + k * 30, 420, { color: COL.tealLight, w: 4, amp: 8 });
  const R = rng(4);
  for (let i = 0; i < 9; i++) b += `<rect x="${(70 + R() * 330).toFixed(0)}" y="${(180 + R() * 160).toFixed(0)}" width="26" height="26" rx="5" fill="${COL.amber}" opacity="0.9"/>`;
  b += `<rect x="40" y="380" width="400" height="80" rx="14" fill="${LI}"/>`;
  [[120, 270], [240, 220], [330, 300]].forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="13" fill="${COL.purpleLight}"/>`));
  b += arrow(240, 440, 240, 300, { color: "#FFFFFF", width: 5, head: 18 });
  return svg(W, H, b);
};

// ---------- Failure -> strategy map (roadmap) ----------
figs.strategy_map = () => {
  const W = 520, H = 470;
  let b = "";
  const rows = [
    ["离子跑得慢", "① 提高离子电导率", COL.purple],
    ["高 / 低电压下分解", "② 拓宽电压窗口", COL.amber],
    ["枝晶穿透", "③ 抑制枝晶", COL.red],
    ["阴离子迁移、极化", "④ 提高离子选择性", COL.teal],
    ["点接触、界面反应", "⑤ 降低界面电阻", COL.siDark],
  ];
  b += text(105, 26, "第 4 章：失效", { size: 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += text(390, 26, "第 5 章：对策", { size: 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  rows.forEach(([a, s, c], i) => {
    const y = 48 + i * 84;
    b += `<rect x="0" y="${y}" width="210" height="60" rx="30" fill="#F5F7F9" stroke="${COL.line}" stroke-width="2"/>`;
    b += text(105, y + 37, a, { size: 17, anchor: "middle", fill: COL.ink });
    b += arrow(218, y + 30, 268, y + 30, { color: c, width: 3.5, head: 13 });
    b += `<rect x="272" y="${y}" width="240" height="60" rx="30" fill="${c}"/>`;
    b += text(392, y + 37, s, { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  });
  return svg(W, H, b);
};

// ---------- Design milestones timeline ----------
figs.design_timeline = () => {
  const W = 1110, H = 320;
  const ev = [
    { year: "1973", who: ["Wright 等"], what: ["PEO–碱金属盐", "络合物导离子"], color: COL.purple },
    { year: "1982", who: ["Weston & Steele"], what: ["往 PEO 里", "加惰性填料"], color: COL.purple },
    { year: "1984", who: ["Bannister 等"], what: ["单离子导体", "阴离子挂上主链"], color: COL.teal },
    { year: "1998", who: ["Croce 等"], what: ["纳米陶瓷填料", "~10^{−4} S cm^{−1}"], color: COL.purple },
    { year: "2005", who: ["Seki 等"], what: ["Li_{3}PO_{4} 薄层", "当人工 CEI"], color: COL.amber },
    { year: "2011", who: ["Kamaya 等"], what: ["LGPS", "12 mS cm^{−1}"], color: COL.purple },
    { year: "2014", who: ["Khurana 等"], what: ["PE–PEO 交联", "抑制枝晶"], color: COL.red },
    { year: "2017", who: ["Han 等"], what: ["ALD Al_{2}O_{3}", "界面电阻 1 Ω cm^{2}"], color: COL.siDark },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 150, left: 80, right: 1010, whoSize: 17, whatSize: 16, yearSize: 24 }));
};

// ---------- Optimal carrier concentration (SIE) ----------
figs.carrier_opt = () => {
  const W = 640, H = 420;
  let b = "";
  // three lattice strips
  const strip = (ox, nIon, label, col) => {
    let s = `<rect x="${ox}" y="20" width="190" height="78" rx="10" fill="#F5F7F9"/>`;
    for (let i = 0; i < 6; i++) {
      const x = ox + 22 + i * 29;
      s += `<circle cx="${x}" cy="58" r="11" fill="#FFFFFF" stroke="${COL.line}" stroke-width="2" stroke-dasharray="4 3"/>`;
      if ((nIon === 1 && i === 2) || (nIon === 3 && i % 2 === 0) || (nIon === 6)) s += ion(x, 58, { r: 11 });
    }
    s += text(ox + 95, 124, label, { size: 15, anchor: "middle", weight: "bold", fill: col });
    return s;
  };
  b += strip(10, 1, "载流子太少", COL.text2);
  b += strip(225, 3, "载流子 + 空位都多", COL.teal);
  b += strip(440, 6, "没有空位可跳", COL.text2);
  // curve
  const X0 = 60, X1 = 600, Y0 = 370, Y1 = 170;
  b += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 10}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  let d = "";
  for (let i = 0; i <= 60; i++) {
    const c = i / 60;
    const x = X0 + c * (X1 - X0), y = Y0 - 4 * c * (1 - c) * (Y0 - Y1 - 10);
    d += (i ? " L" : "M") + `${x.toFixed(1)},${y.toFixed(1)}`;
  }
  b += `<path d="${d}" fill="none" stroke="${COL.purple}" stroke-width="4"/>`;
  b += `<circle cx="${(X0 + X1) / 2}" cy="${Y1 + 10}" r="8" fill="${COL.teal}"/>`;
  b += text((X0 + X1) / 2, Y1 - 6, "最优浓度", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(X1, Y0 + 28, "载流子浓度 →", { size: 15, anchor: "end", fill: COL.text2 });
  b += `<g transform="translate(${X0 - 18} ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "电导率 σ", { size: 15, anchor: "middle", fill: COL.text2 }) + `</g>`;
  b += text(X0 + 8, Y0 + 28, "示意：σ ∝ 载流子数 × 空位数", { size: 15, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Anion framework: O vs S ----------
figs.framework = () => {
  const W = 640, H = 420;
  let b = "";
  const panel = (ox, r, col, lab, sub, y1, y2) => {
    let s = `<rect x="${ox}" y="20" width="290" height="250" rx="14" fill="#F5F7F9"/>`;
    for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) {
      const cx = ox + 50 + i * ((290 - 100) / 3), cy = j ? y2 : y1;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" opacity="0.85"/>`;
    }
    s += ion(ox + 145, 145, { r: 13 });
    s += arrow(ox + 60, 145, ox + 128, 145, { color: COL.purple, width: 3, head: 12, dash: "6 4" });
    s += arrow(ox + 162, 145, ox + 240, 145, { color: COL.purple, width: 3, head: 12, dash: "6 4" });
    s += text(ox + 145, 302, lab, { size: 17, anchor: "middle", weight: "bold" });
    s += text(ox + 145, 328, sub, { size: 15, anchor: "middle", fill: COL.text2 });
    return s;
  };
  b += panel(10, 34, "#9AA7B4", "氧化物骨架 O^{2−}", "离子小、难极化：通道窄", 98, 192);
  b += panel(340, 44, COL.sulfur, "硫化物骨架 S^{2−}", "离子大、易极化：通道宽", 68, 222);
  b += `<rect x="10" y="352" width="620" height="58" rx="10" fill="#E8F4F3"/>`;
  b += text(320, 378, "同样思路的替换：S^{2−} → Cl^{−} 或 Se^{2−}；P^{5+} → Sb^{5+}", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(320, 401, "目的：削弱载流子与骨架之间的相互作用", { size: 15, anchor: "middle", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- High-throughput screening funnel ----------
figs.screening = () => {
  const W = 620, H = 430;
  let b = "";
  const lv = [
    ["> 12 000 种含 Li 晶体", 560, COL.line, COL.ink],
    ["结构稳定、电子绝缘", 450, "#C9D9E3", COL.ink],
    ["对 Li / 正极足够稳定", 340, COL.tealLight, COL.ink],
    ["离子迁移能垒低", 230, COL.teal, "#FFFFFF"],
  ];
  lv.forEach(([t, w, c, tc], i) => {
    const y = 20 + i * 78, x = (W - w) / 2, w2 = w - 110;
    b += `<polygon points="${x},${y} ${x + w},${y} ${x + w - 55},${y + 66} ${x + 55},${y + 66}" fill="${c}"/>`;
    b += text(W / 2, y + 41, t, { size: 17, anchor: "middle", weight: "bold", fill: tc });
  });
  b += `<rect x="${W / 2 - 90}" y="338" width="180" height="46" rx="23" fill="${COL.amber}"/>`;
  b += text(W / 2, 368, "少数候选 → 实验", { size: 17, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(W / 2, 418, "计算的价值：快速“排除”，缩小实验范围", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Fig. 5a: three routes to conductive SPEs (Venn) ----------
figs.venn = () => {
  const W = 660, H = 480;
  let b = "";
  const C1 = [330, 150], C2 = [220, 300], C3 = [440, 300], r = 140;
  b += `<circle cx="${C1[0]}" cy="${C1[1]}" r="${r}" fill="${COL.teal}" opacity="0.18"/>`;
  b += `<circle cx="${C2[0]}" cy="${C2[1]}" r="${r}" fill="#3A7CA5" opacity="0.18"/>`;
  b += `<circle cx="${C3[0]}" cy="${C3[1]}" r="${r}" fill="${COL.red}" opacity="0.14"/>`;
  b += text(330, 26, "增加离子对解离", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(110, 468, "降低 T_{g}", { size: 18, anchor: "middle", weight: "bold", fill: "#2F6690" });
  b += text(560, 468, "降低结晶度", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  const item = (x, y, t, o = {}) => `<rect x="${x - o.w / 2}" y="${y - 17}" width="${o.w}" height="30" rx="15" fill="#FFFFFF" stroke="${o.c || COL.line}" stroke-width="2"/>` + text(x, y + 4, t, { size: 15, anchor: "middle", weight: "bold", fill: COL.ink });
  b += item(330, 82, "高介电常数主链", { w: 150, c: COL.teal });
  b += item(250, 200, "系留离子基团", { w: 132, c: COL.teal });
  b += item(420, 200, "活性纳米填料", { w: 132, c: COL.red });
  b += item(150, 320, "支化 / 侧链", { w: 116, c: "#3A7CA5" });
  b += item(330, 285, "增加自由体积", { w: 134, c: COL.ink });
  b += item(330, 318, "加增塑剂", { w: 98, c: COL.ink });
  b += item(500, 330, "交联", { w: 70, c: COL.red });
  b += item(470, 385, "高分子接枝纳米颗粒", { w: 176, c: COL.red });
  return svg(W, H, b);
};

// ---------- Conductivity vs modulus trade-off ----------
figs.tradeoff = () => {
  const W = 620, H = 430;
  let b = "";
  const X0 = 80, X1 = 590, Y0 = 360, Y1 = 30;
  b += arrow(X0, Y0, X1, Y0, { color: COL.ink, width: 2.5, head: 12 });
  b += arrow(X0, Y0, X0, Y1, { color: COL.ink, width: 2.5, head: 12 });
  b += text(X1, Y0 + 30, "剪切模量（力学强度）→", { size: 15, anchor: "end", fill: COL.text2, weight: "bold" });
  b += `<g transform="translate(${X0 - 24} ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "离子电导率 →", { size: 15, anchor: "middle", fill: COL.text2, weight: "bold" }) + `</g>`;
  b += `<path d="M${X0 + 40},${Y1 + 60} Q${X0 + 150},${Y0 - 70} ${X1 - 50},${Y0 - 82}" fill="none" stroke="${COL.muted}" stroke-width="4" stroke-dasharray="10 6"/>`;
  b += text(X0 + 40, Y0 - 30, "常见的“跷跷板”", { size: 15, fill: COL.muted, weight: "bold" });
  b += `<circle cx="${X0 + 46}" cy="${Y1 + 72}" r="10" fill="${COL.purple}"/>` + text(X0 + 62, Y1 + 77, "加增塑剂 / 侧链：导但软", { size: 15, weight: "bold", fill: COL.purple });
  b += `<circle cx="${X1 - 60}" cy="${Y0 - 82}" r="10" fill="${COL.siDark}"/>` + text(X1 - 50, Y0 - 44, "高结晶均聚物：硬但不导", { size: 15, weight: "bold", fill: COL.siDark, anchor: "end" });
  b += arrow(X0 + 200, Y0 - 118, 466, 182, { color: COL.teal, width: 4, head: 15 });
  b += `<circle cx="480" cy="170" r="11" fill="${COL.teal}"/>`;
  b += text(480, 140, "交联 / 接枝纳米颗粒", { size: 15, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(520, 206, "两头兼顾", { size: 15, anchor: "start", weight: "bold", fill: COL.teal });
  b += text(X0 + 4, Y0 + 54, "示意图，非实测数据", { size: 15, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Composite fillers ----------
figs.fillers = () => {
  const W = 990, H = 360;
  let b = "";
  const box = (ox, title, col) => `<rect x="${ox}" y="40" width="310" height="230" rx="12" fill="#F7EEF5"/>` + text(ox + 155, 26, title, { size: 18, anchor: "middle", weight: "bold", fill: col });
  // (a) random fillers with Lewis-acid surface
  b += box(10, "① 随机填料：表面 Lewis 酸", COL.purple);
  for (let k = 0; k < 7; k++) b += chain(20, 64 + k * 30, 310, { amp: 6 });
  [[70, 110], [190, 90], [260, 190], [120, 220], [210, 160]].forEach(([x, y]) => {
    b += `<circle cx="${10 + x}" cy="${y}" r="20" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="3"/>`;
  });
  b += anion(10 + 70 + 30, 112) + anion(10 + 210 + 28, 172);
  b += lines(165, 296, ["抓住阴离子 → 盐解离更好", "并压低结晶度"], { size: 15, anchor: "middle", lh: 21 });
  // (b) aligned nanowires
  const X = 340;
  b += box(X, "② 取向纳米线：连续通道", COL.teal);
  for (let k = 0; k < 7; k++) b += chain(X + 10, 64 + k * 30, X + 300, { amp: 6 });
  for (let k = 0; k < 4; k++) b += `<rect x="${X + 40 + k * 70}" y="52" width="16" height="206" rx="8" fill="${COL.amber}"/>`;
  b += arrow(X + 48, 250, X + 48, 64, { color: COL.purple, width: 3, head: 12 });
  b += lines(X + 155, 296, ["Li⁺ 沿陶瓷表面一路走通", "（Liu 等 2017）"], { size: 15, anchor: "middle", lh: 21 });
  // (c) polymer adsorption
  const Y = 670;
  b += box(Y, "③ 链吸附在陶瓷表面", COL.red);
  b += `<circle cx="${Y + 155}" cy="155" r="62" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="3"/>`;
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2, x = Y + 155 + 72 * Math.cos(a), y = 155 + 72 * Math.sin(a);
    b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${PEO}"/>`;
  }
  b += cross(Y + 270, 80, 12);
  b += lines(Y + 155, 296, ["链段被“钉住”、运动变慢", "→ 界面电阻反而上升"], { size: 15, anchor: "middle", lh: 21 });
  return svg(W, H, b);
};

// ---------- Fig. 5b (top): multilayer / anionic interphase ----------
figs.bilayer = () => {
  const W = 640, H = 430;
  let b = "";
  // left: bilayer polymer
  b += text(150, 24, "① 双层聚合物电解质", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += `<rect x="10" y="40" width="280" height="44" fill="${LI}"/>`;
  b += text(150, 68, "Li 负极", { size: 15, anchor: "middle", weight: "bold" });
  b += `<rect x="10" y="84" width="280" height="90" fill="#F7EEF5"/>`;
  for (let k = 0; k < 3; k++) b += chain(20, 104 + k * 26, 280, { amp: 6 });
  b += text(150, 194, "", { size: 15 });
  b += `<rect x="10" y="174" width="280" height="90" fill="#E8F4F3"/>`;
  for (let k = 0; k < 3; k++) b += chain(20, 194 + k * 26, 280, { amp: 6, color: COL.teal });
  b += `<rect x="10" y="264" width="280" height="56" fill="${COL.amberLight}"/>`;
  b += text(150, 298, "高压正极", { size: 15, anchor: "middle", weight: "bold" });
  b += lines(20, 352, ["靠负极：PEO（耐还原）", "靠正极：耐氧化的高分子", "两层要相容、无空间电荷层"], { size: 15, lh: 22 });
  // right: anionic / artificial interphase
  const X = 340;
  b += text(X + 150, 24, "② 阴离子型 / 人工界面相", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  b += `<rect x="${X}" y="40" width="290" height="190" fill="#F7EEF5"/>`;
  for (let k = 0; k < 6; k++) b += chain(X + 10, 58 + k * 28, X + 280, { amp: 6 });
  b += `<rect x="${X}" y="230" width="290" height="26" fill="${COL.amber}"/>`;
  for (let i = 0; i < 7; i++) b += anion(X + 24 + i * 40, 243, 8, "#A0522D");
  b += `<rect x="${X}" y="256" width="290" height="64" fill="${COL.amberLight}"/>`;
  b += text(X + 145, 296, "正极", { size: 15, anchor: "middle", weight: "bold" });
  b += ion(X + 210, 200, { r: 11 });
  b += arrow(X + 210, 214, X + 210, 270, { color: COL.purple, width: 3, head: 11 });
  b += `<path d="M${X + 90},170 L${X + 90},220" stroke="${COL.ink}" stroke-width="3"/>` + cross(X + 90, 225, 9);
  b += text(X + 112, 190, "醚链", { size: 15, weight: "bold" });
  b += lines(X + 10, 352, ["只放 Li⁺ 通过的“去溶剂化层”", "例：LiBOB 原位生成、Li_{3}PO_{4} 薄层", "→ 推迟醚类电解质的氧化"], { size: 15, lh: 22 });
  return svg(W, H, b);
};

// ---------- Cathode coatings in sulfide SSE ----------
figs.coating = () => {
  const W = 600, H = 410;
  let b = "";
  b += `<rect x="10" y="10" width="580" height="300" rx="14" fill="${COL.sulfurLight}" opacity="0.6"/>`;
  b += text(570, 40, "硫化物 SSE", { size: 16, anchor: "end", weight: "bold", fill: "#8A6A00" });
  const P = (cx, cy, r, coat) => {
    let s = "";
    if (coat) s += `<circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="${COL.teal}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="3"/>`;
    return s;
  };
  b += P(150, 160, 90, false);
  b += text(150, 166, "未包覆", { size: 17, anchor: "middle", weight: "bold" });
  b += cross(255, 100, 11);
  b += text(150, 290, "互扩散 + 空间电荷层", { size: 15, anchor: "middle", weight: "bold", fill: COL.red });
  b += P(420, 160, 80, true);
  b += text(420, 166, "包覆后", { size: 17, anchor: "middle", weight: "bold" });
  b += check(520, 82, 12);
  b += text(420, 290, "几 nm 的 Li⁺ 导体“外衣”", { size: 15, anchor: "middle", weight: "bold", fill: COL.teal });
  const tags = ["LiNbO_{3}", "Li_{4}Ti_{5}O_{12}", "Li_{3}PO_{4}", "Al_{2}O_{3}"];
  tags.forEach((t, i) => (b += pill(20 + i * 145, 336, 130, 40, COL.teal, t, { size: 16 })));
  b += text(300, 402, "原文列举的四种正极包覆层", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Fig. 5c: polymer architectures against dendrites ----------
figs.dendrite_poly = () => {
  const W = 990, H = 400;
  let b = "";
  const pw = 230;
  const base = (ox, title, col) => text(ox + pw / 2, 24, title, { size: 17, anchor: "middle", weight: "bold", fill: col }) + `<rect x="${ox}" y="260" width="${pw}" height="40" fill="${LI}"/>` + text(ox + pw / 2, 287, "Li", { size: 16, anchor: "middle", weight: "bold" });
  // (a) crosslinked PE-PEO
  let X = 10;
  b += base(X, "① 交联 PE–PEO", COL.teal);
  b += `<rect x="${X}" y="40" width="${pw}" height="220" fill="#F7EEF5"/>`;
  for (let k = 0; k < 6; k++) b += chain(X + 8, 62 + k * 34, X + pw - 8, { amp: 6 });
  for (let i = 0; i < 4; i++) b += `<line x1="${X + 30 + i * 56}" y1="56" x2="${X + 30 + i * 56}" y2="252" stroke="${COL.siDark}" stroke-width="5"/>`;
  for (let i = 0; i < 4; i++) for (let k = 0; k < 6; k++) b += `<circle cx="${X + 30 + i * 56}" cy="${62 + k * 34}" r="4.5" fill="${COL.amber}"/>`;
  b += lines(X + pw / 2, 330, ["PEO 导离子", "PE 段 + 交联点提供模量"], { size: 15, anchor: "middle", lh: 21 });
  // (b) block copolymer
  X = 255;
  b += base(X, "② 嵌段共聚物 PS-b-PEO", COL.purple);
  b += `<rect x="${X}" y="40" width="${pw}" height="220" fill="#F7EEF5"/>`;
  for (let k = 0; k < 3; k++) b += `<rect x="${X}" y="${52 + k * 70}" width="${pw}" height="30" rx="8" fill="${COL.siDark}"/>`;
  for (let k = 0; k < 3; k++) b += chain(X + 8, 98 + k * 70, X + pw - 8, { amp: 6 });
  b += lines(X + pw / 2, 330, ["PS 硬段：“摊平”尖端电流", "PEO 软段：导离子"], { size: 15, anchor: "middle", lh: 21 });
  // (c) multilayer
  X = 500;
  b += base(X, "③ 多层：硬陶瓷层", COL.amber);
  b += `<rect x="${X}" y="40" width="${pw}" height="120" fill="#F7EEF5"/>`;
  for (let k = 0; k < 3; k++) b += chain(X + 8, 64 + k * 32, X + pw - 8, { amp: 6 });
  b += `<rect x="${X}" y="160" width="${pw}" height="50" fill="${COL.amber}"/>`;
  b += text(X + pw / 2, 192, "高模量无机层", { size: 15, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += `<rect x="${X}" y="210" width="${pw}" height="50" fill="#F2DDEA"/>`;
  b += text(X + pw / 2, 241, "软聚合物层", { size: 15, anchor: "middle", weight: "bold", fill: "#7A2E52" });
  b += lines(X + pw / 2, 330, ["硬层挡枝晶", "软层贴住 Li、缓冲体积变化"], { size: 15, anchor: "middle", lh: 21 });
  // (d) single-ion
  X = 745;
  b += base(X, "④ 单离子导体", COL.red);
  b += `<rect x="${X}" y="40" width="${pw}" height="220" fill="#F7EEF5"/>`;
  for (let k = 0; k < 4; k++) {
    const y = 70 + k * 50;
    b += chain(X + 8, y, X + pw - 8, { amp: 5 });
    for (let i = 0; i < 4; i++) b += anion(X + 30 + i * 56 + (k % 2) * 20, y, 8);
  }
  b += `<rect x="${X}" y="248" width="${pw}" height="12" fill="${COL.sei}"/>`;
  b += lines(X + pw / 2, 330, ["阴离子固定不动", "→ 不极化、SEI 稳定"], { size: 15, anchor: "middle", lh: 21 });
  b += text(W / 2, 390, "据原文 Fig. 5c 重绘", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Confinement in nanostructured electrolytes ----------
figs.confine = () => {
  const W = 640, H = 400;
  let b = "";
  const panel = (ox, small) => {
    let s = `<rect x="${ox}" y="40" width="290" height="200" fill="#F7EEF5"/>`;
    const pore = small ? 18 : 64, wall = small ? 10 : 18;
    for (let x = ox; x < ox + 290; x += pore + wall) s += `<rect x="${x}" y="40" width="${Math.min(wall, ox + 290 - x)}" height="200" fill="${COL.siDark}" opacity="0.75"/>`;
    s += `<rect x="${ox}" y="240" width="290" height="44" fill="${LI}"/>`;
    if (small) {
      s += `<rect x="${ox}" y="222" width="290" height="18" fill="${LI_DARK}"/>`;
    } else {
      const R = rng(3);
      [ox + 48, ox + 130, ox + 212].forEach((x, i) => {
        let pts = [[x, 240]];
        for (let k = 1; k <= 5; k++) pts.push([x + (R() - 0.5) * 30, 240 - k * (i === 1 ? 38 : 26)]);
        s += `<path d="${pathD(pts)}" fill="none" stroke="${LI_DARK}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
      });
    }
    return s;
  };
  b += panel(10, false);
  b += panel(340, true);
  b += text(155, 26, "孔大于临界尺寸", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(485, 26, "孔小于临界尺寸", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(155, 312, "枝晶在大孔里自由长大", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(485, 312, "沉积被“关”在小孔里 → 平整", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += `<rect x="10" y="334" width="620" height="56" rx="10" fill="#FDF2E7"/>`;
  b += text(320, 359, "门槛对比：Monroe–Newman 要 > 6 × 10^{9} Pa", { size: 16, anchor: "middle", weight: "bold", fill: COL.ink });
  b += text(320, 382, "纳米结构电解质只需 ~10^{5} Pa（低了近 5 个数量级）", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- Concentration polarization vs single-ion ----------
figs.single_ion = () => {
  const W = 640, H = 430;
  let b = "";
  const panel = (ox, single) => {
    let s = `<rect x="${ox}" y="40" width="40" height="230" fill="${LI}"/>`;
    s += `<rect x="${ox + 250}" y="40" width="40" height="230" fill="${COL.amberLight}"/>`;
    s += `<rect x="${ox + 40}" y="40" width="210" height="230" fill="#F7EEF5"/>`;
    const R = rng(single ? 12 : 7);
    if (single) {
      for (let k = 0; k < 4; k++) {
        const y = 70 + k * 56;
        s += chain(ox + 46, y, ox + 244, { amp: 5 });
        for (let i = 0; i < 4; i++) s += anion(ox + 70 + i * 48, y, 8);
      }
      for (let i = 0; i < 9; i++) s += ion(ox + 60 + R() * 170, 92 + R() * 150, { r: 8 });
    } else {
      // anions piling up near the positive side (left on discharge? use: anions drift to anode side)
      for (let i = 0; i < 22; i++) {
        const t = Math.pow(R(), 1.8);
        s += anion(ox + 52 + t * 185, 52 + R() * 206, 8);
      }
      for (let i = 0; i < 8; i++) s += ion(ox + 60 + R() * 170, 60 + R() * 200, { r: 8 });
    }
    return s;
  };
  b += panel(10, false);
  b += panel(340, true);
  b += text(155, 26, "普通 SPE：t⁺ ≈ 0.2–0.5", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(485, 26, "单离子导体：t⁺ → 1", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(155, 300, ["阴离子在一侧堆积", "→ 浓度梯度、浓差过电位", "→ 阴离子分解、SEI 不均"], { size: 15, anchor: "middle", lh: 22, fill: COL.red });
  b += lines(485, 300, ["阴离子挂在主链上", "电流几乎全由 Li⁺ 承担", "→ 不极化，沉积均匀"], { size: 15, anchor: "middle", lh: 22, fill: COL.teal });
  b += text(320, 410, "t⁺ = Li⁺ 承担的电流 ÷ 总电流（迁移数 transference number）", { size: 15, anchor: "middle", fill: COL.text2, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Fig. 6: interfacial strategies ----------
figs.fig6 = () => {
  const W = 990, H = 390;
  let b = "";
  // left: point contacts
  b += `<rect x="10" y="80" width="280" height="230" rx="12" fill="none" stroke="${COL.line}" stroke-width="2" stroke-dasharray="7 5"/>`;
  b += text(150, 70, "电极", { size: 16, anchor: "middle", weight: "bold" });
  [[80, 160], [150, 150], [220, 160], [115, 120], [185, 118]].forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="30" fill="#E6A9C7" stroke="#B5487E" stroke-width="2.5"/>`));
  for (let i = 0; i < 6; i++) b += `<rect x="${30 + i * 40}" y="196" width="40" height="40" fill="#F7D5C9" stroke="#E08F75" stroke-width="2"/>`;
  for (let i = 0; i < 6; i++) b += `<rect x="${30 + i * 40}" y="236" width="40" height="40" fill="#F7D5C9" stroke="#E08F75" stroke-width="2"/>`;
  b += text(150, 300, "电解质", { size: 16, anchor: "middle", weight: "bold" });
  b += cross(150, 196, 8);
  b += text(150, 340, "固-固只有“点接触”", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  // arrows to 3 strategies
  const tgt = [[560, 70, "纳米 3D 骨架"], [560, 195, "聚合物缓冲层"], [560, 320, "界面润湿 / 原位反应"]];
  tgt.forEach(([x, y, t]) => {
    b += arrow(300, 195, x - 10, y, { color: COL.ink, width: 3, head: 13 });
  });
  b += text(400, 98, "纳米 3D 骨架", { size: 16, weight: "bold", fill: COL.ink, anchor: "middle" });
  b += text(410, 182, "聚合物缓冲层", { size: 16, weight: "bold", fill: COL.ink, anchor: "middle" });
  b += text(400, 300, "润湿剂 / 原位反应", { size: 16, weight: "bold", fill: COL.ink, anchor: "middle" });
  // panel 1: scaffold
  const box = (y) => `<rect x="560" y="${y - 55}" width="250" height="110" rx="10" fill="#FFFFFF" stroke="${COL.line}" stroke-width="2" stroke-dasharray="6 4"/>`;
  b += box(70);
  for (let i = 0; i < 4; i++) b += `<circle cx="${600 + i * 56}" cy="62" r="24" fill="#E6A9C7" stroke="#B5487E" stroke-width="2"/>`;
  for (let i = 0; i < 9; i++) b += `<line x1="${575 + i * 26}" y1="30" x2="${595 + i * 26}" y2="115" stroke="#E08F75" stroke-width="7" opacity="0.85"/>`;
  // panel 2: buffer
  b += box(195);
  b += `<rect x="562" y="190" width="246" height="58" fill="#F7EEF5"/>`;
  for (let k = 0; k < 2; k++) b += chain(566, 212 + k * 22, 804, { amp: 5 });
  for (let i = 0; i < 4; i++) b += `<circle cx="${600 + i * 56}" cy="180" r="24" fill="#E6A9C7" stroke="#B5487E" stroke-width="2"/>`;
  // panel 3: wetting
  b += box(320);
  b += `<path d="M562,330 Q600,300 640,330 Q680,300 720,330 Q760,300 808,330 L808,374 L562,374 Z" fill="#9FD3CF"/>`;
  for (let i = 0; i < 4; i++) b += `<circle cx="${600 + i * 56}" cy="312" r="24" fill="#E6A9C7" stroke="#B5487E" stroke-width="2"/>`;
  b += lines(830, 62, ["增大接触面积"], { size: 15, fill: COL.text2 });
  b += lines(830, 186, ["软层贴合、", "缓冲体积变化"], { size: 15, fill: COL.text2, lh: 21 });
  b += lines(830, 312, ["少量液体 / 离子", "液体浸润孔隙"], { size: 15, fill: COL.text2, lh: 21 });
  b += text(150, 380, "据原文 Fig. 6 重绘", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Lithiophobic vs lithiophilic garnet ----------
figs.wetting = () => {
  const W = 640, H = 360;
  let b = "";
  const panel = (ox, philic) => {
    let s = `<rect x="${ox}" y="190" width="290" height="70" fill="${SSE}" stroke="${COL.line}" stroke-width="2"/>`;
    s += text(ox + 145, 236, "石榴石 LLZO", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
    if (philic) {
      s += `<rect x="${ox}" y="182" width="290" height="8" fill="${COL.teal}"/>`;
      s += `<path d="M${ox + 20},182 Q${ox + 40},132 ${ox + 145},128 Q${ox + 250},132 ${ox + 270},182 Z" fill="${LI}"/>`;
    } else {
      s += `<rect x="${ox}" y="184" width="290" height="6" fill="#F2F2F2" stroke="${COL.muted}" stroke-width="1"/>`;
      s += `<circle cx="${ox + 145}" cy="128" r="58" fill="${LI}"/>`;
      s += `<line x1="${ox + 120}" y1="184" x2="${ox + 170}" y2="184" stroke="${COL.red}" stroke-width="5"/>`;
    }
    s += text(ox + 145, 128 + (philic ? 30 : 6), "熔融 Li", { size: 16, anchor: "middle", weight: "bold" });
    return s;
  };
  b += panel(10, false);
  b += panel(340, true);
  b += text(155, 30, "疏锂：Li 成球，只点接触", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(485, 30, "亲锂层：Li 铺开、贴合", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(155, 290, "表面 Li_{2}CO_{3} 等杂质层", { size: 15, anchor: "middle", fill: COL.text2 });
  b += text(485, 290, "ALD Al_{2}O_{3}、ZnO、Ge、锂化 Si", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(320, 340, "示意：接触角越小，接触面积越大，界面电阻越低", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- In situ polymerization of a liquid precursor ----------
figs.insitu_poly = () => {
  const W = 990, H = 330;
  let b = "";
  const cathode = (ox, fill) => {
    let s = `<rect x="${ox}" y="40" width="260" height="200" rx="10" fill="${fill}"/>`;
    [[50, 80], [130, 70], [210, 85], [80, 150], [170, 150], [50, 215], [130, 210], [215, 205]].forEach(([x, y], i) => (s += blob(ox + x, y, 30, 700 + i, { fill: COL.amberLight, stroke: COL.amber, sw: 2.5, jag: 0.08 })));
    s += `<rect x="${ox}" y="240" width="260" height="16" fill="${COL.alu}"/>`;
    return s;
  };
  b += cathode(10, "#FFFFFF");
  b += `<rect x="10" y="40" width="260" height="200" rx="10" fill="none" stroke="${COL.line}" stroke-width="2"/>`;
  b += text(140, 26, "① 多孔厚正极：孔里是空的", { size: 16, anchor: "middle", weight: "bold" });
  b += arrow(282, 140, 352, 140, { color: COL.ink, width: 3.5, head: 14 });
  b += text(317, 124, "灌入", { size: 16, anchor: "middle", weight: "bold" });
  b += cathode(365, COL.electrolyte);
  b += text(495, 26, "② 液体单体 + 盐 + 引发剂", { size: 16, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += arrow(637, 140, 707, 140, { color: COL.ink, width: 3.5, head: 14 });
  b += text(672, 124, "聚合", { size: 16, anchor: "middle", weight: "bold" });
  b += cathode(720, "#EBD9E6");
  for (let k = 0; k < 6; k++) b += chain(726, 60 + k * 34, 974, { amp: 5, w: 2 });
  b += text(850, 26, "③ 原位固化：贴合每个颗粒", { size: 16, anchor: "middle", weight: "bold", fill: "#7A2E52" });
  b += text(495, 300, "触发方式：阳离子（如 Al^{3+} 物种引发醚类开环）、紫外光、加热", { size: 16, anchor: "middle", fill: COL.ink, weight: "bold" });
  return svg(W, H, b);
};

module.exports = figs;
