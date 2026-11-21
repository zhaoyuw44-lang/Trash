// Figures for Manthiram, Yu & Wang 2017, Chapter 3 (Polymer, composite and thin-film solid electrolytes)
// Canvas widths ≈ 100 px per slide inch; body text in figures ≥ 17 px.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${(+x).toFixed(1)}" cy="${(+y).toFixed(1)}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts.map(([x, y]) => `${(+x).toFixed(1)},${(+y).toFixed(1)}`).join(" ")}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}" stroke-linejoin="round"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const tri = (x, y, r, fill, o) => poly([[x, y - r], [x + r * 0.87, y + r * 0.5], [x - r * 0.87, y + r * 0.5]], fill, o);
const anion = (x, y, r = 11) => circ(x, y, r, COL.amber) + text(x, y + r * 0.42, "−", { size: Math.round(r * 1.4), anchor: "middle", fill: "#FFFFFF", weight: "bold" });

// Wavy polymer chain through points (x0..x1 at baseline y) with ether-O beads; returns {s, pts}
const chain = (x0, x1, y, amp, ph, o = {}) => {
  const pts = [];
  let d = "";
  const n = Math.round((x1 - x0) / 22);
  for (let i = 0; i <= n; i++) {
    const x = x0 + (i * (x1 - x0)) / n;
    const yy = y + amp * Math.sin(i * (o.freq || 0.6) + ph) + (i % 2 ? 7 : -7);
    pts.push([x, yy]);
    d += (i ? " L" : "M") + x.toFixed(1) + "," + yy.toFixed(1);
  }
  let s = `<path d="${d}" fill="none" stroke="${o.col || COL.siDark}" stroke-width="${o.w || 4}" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
  if (o.oxy !== false) pts.forEach(([x, yy], i) => { if (i % 3 === 1) s += circ(x, yy, o.or || 6, COL.red); });
  return { s, pts };
};

// ---------- Title motif: polymer chains with a ceramic particle and a thin film ----------
figs.title_motif = () => {
  const W = 520, H = 560;
  let b = "";
  b += rect(40, 420, 440, 34, COL.purpleLight, { rx: 6 });
  b += rect(40, 456, 440, 22, "#9FB0C0", { rx: 4 });
  b += chain(40, 480, 120, 30, 0, { col: "#FFFFFF", w: 5, or: 7 }).s;
  b += chain(40, 480, 220, 30, 2, { col: COL.tealLight, w: 5, or: 7 }).s;
  b += chain(40, 480, 320, 30, 4, { col: "#FFFFFF", w: 5, or: 7 }).s;
  b += blob(330, 268, 46, 9, { fill: "#C9D2DA", stroke: "#FFFFFF", sw: 3, jag: 0.12, n: 7 });
  [[150, 170], [260, 270], [400, 175]].forEach(([x, y]) => (b += ion(x, y, { r: 15 })));
  b += arrow(170, 172, 238, 262, { color: COL.amber, width: 4, head: 14 });
  return svg(W, H, b);
};

// ---------- Three classes of polymer electrolytes ----------
figs.polymer_classes = () => {
  const W = 1230, H = 360;
  let b = "";
  const P = [
    { t: "干态聚合物电解质", s: "高分子 + 锂盐，无液体", col: COL.teal, f: "#E8F4F3" },
    { t: "凝胶聚合物电解质", s: "含液体电解液（原文不讨论）", col: COL.muted, f: "#F1F3F5" },
    { t: "复合聚合物电解质", s: "高分子 + 锂盐 + 陶瓷填料", col: COL.purple, f: "#F1ECF8" },
  ];
  P.forEach((p, i) => {
    const X = 10 + i * 410;
    b += rect(X, 10, 390, 250, p.f, { rx: 18 });
    const c1 = chain(X + 20, X + 370, 80, 18, i, { col: COL.siDark });
    const c2 = chain(X + 20, X + 370, 180, 18, i + 2, { col: COL.siDark });
    if (i === 1) b += rect(X + 14, 24, 362, 222, COL.electrolyte, { rx: 12 });
    b += c1.s + c2.s;
    if (i === 1) for (let k = 0; k < 9; k++) b += `<ellipse cx="${X + 50 + (k % 5) * 70}" cy="${k < 5 ? 128 : 228}" rx="14" ry="8" fill="#7FB8DA"/>`;
    if (i === 2) [[X + 110, 130, 30], [X + 270, 128, 34]].forEach(([x, y, r], k) => (b += blob(x, y, r, 30 + k, { fill: "#C9D2DA", stroke: "#9AA6B2", sw: 2, jag: 0.12, n: 7 })));
    [[X + 70, 130], [X + 200, 125], [X + 330, 135]].forEach(([x, y]) => (b += ion(x, y, { r: 12 })));
    b += anion(X + 150, 215);
    b += anion(X + 300, 60);
    b += text(X + 195, 300, p.t, { size: 22, anchor: "middle", weight: "bold", fill: p.col });
    b += text(X + 195, 334, p.s, { size: 18, anchor: "middle", fill: COL.text2 });
  });
  b += cross(10 + 410 + 362, 36, 13, COL.red, 5);
  return svg(W, H, b);
};

// ---------- Timeline: polymer, composite and thin-film electrolytes ----------
figs.timeline = () => {
  const W = 1240, H = 430;
  const ev = [
    { year: "1973", who: ["Fenton, Parker", "& Wright"], what: ["PEO–碱金属盐", "络合物导离子"], color: COL.teal },
    { year: "1975", who: ["Feuillade & Perche"], what: ["凝胶聚合物", "电解质"], color: COL.text2 },
    { year: "1978", who: ["Armand 等"], what: ["提议 PEO–锂盐", "用于电池"], color: COL.teal },
    { year: "1982", who: ["Weston & Steele"], what: ["PEO 中加入", "惰性陶瓷填料"], color: COL.purple },
    { year: "1983", who: ["Berthier, Armand 等"], what: ["离子在无定形区", "传导"], color: COL.teal },
    { year: "1992", who: ["Bates, Dudney 等"], what: ["ORNL 溅射", "制得 LiPON"], color: COL.amber },
    { year: "1998", who: ["Croce, Scrosati 等"], what: ["纳米陶瓷", "复合电解质"], color: COL.purple },
    { year: "2015", who: ["Kozen 等"], what: ["原子层沉积", "LiPON"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 210, left: 115, right: 1125, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- PEO coordinates Li+ ----------
figs.peo_coord = () => {
  const W = 680, H = 470;
  let b = "";
  // repeat unit
  b += rect(10, 10, 660, 96, "#F5F7F9", { rx: 14 });
  b += text(30, 50, "PEO 重复单元：", { size: 19, weight: "bold" });
  b += text(30, 84, "—(CH_{2}–CH_{2}–O)_{n}—", { size: 24, weight: "bold", fill: COL.ink });
  b += circ(372, 62, 9, COL.red) + text(390, 69, "醚氧：带部分负电，", { size: 18, fill: COL.text2 });
  b += text(390, 95, "像“手”一样抓 Li⁺", { size: 18, fill: COL.text2 });
  // helix-like wrap around Li+
  const cx = 230, cy = 290;
  let d = "";
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const a = -Math.PI * 0.95 + t * Math.PI * 2.6;
    const r = 86 + 10 * Math.sin(i * 1.3);
    const x = cx + r * Math.cos(a) - 160 + t * 320;
    const y = cy + r * Math.sin(a) * 0.75;
    pts.push([x, y]);
  }
  // simpler: crown around Li
  const ring = [];
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * 2 * Math.PI - Math.PI / 2;
    ring.push([cx + 92 * Math.cos(a), cy + 92 * Math.sin(a)]);
  }
  d = ring.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1)).join(" ");
  b += `<path d="M${cx - 220},${cy + 70} Q${cx - 160},${cy + 110} ${ring[6][0].toFixed(1)},${ring[6][1].toFixed(1)}" fill="none" stroke="${COL.siDark}" stroke-width="5"/>`;
  b += `<path d="${d} Z" fill="none" stroke="${COL.siDark}" stroke-width="5" stroke-linejoin="round"/>`;
  b += `<path d="M${ring[4][0].toFixed(1)},${ring[4][1].toFixed(1)} Q${cx + 160},${cy + 110} ${cx + 230},${cy + 60}" fill="none" stroke="${COL.siDark}" stroke-width="5"/>`;
  ring.forEach(([x, y], k) => {
    if (k % 2 === 0) {
      b += circ(x, y, 12, COL.red);
      b += line(cx + (x - cx) * 0.25, cy + (y - cy) * 0.25, cx + (x - cx) * 0.86, cy + (y - cy) * 0.86, COL.red, 2.5, "5 4");
    }
  });
  b += ion(cx, cy, { r: 24 });
  b += anion(560, 230, 20);
  b += text(560, 286, "阴离子（如 TFSI⁻）", { size: 18, anchor: "middle", fill: COL.amber, weight: "bold" });
  b += text(560, 312, "留在链外", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(cx, 452, "一个 Li⁺ 通常被 4–6 个醚氧包围（示意）", { size: 18, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Crystalline vs amorphous PEO + conductivity knee ----------
figs.peo_phase = () => {
  const W = 700, H = 470;
  let b = "";
  // crystalline lamellae (left top)
  b += rect(10, 10, 330, 220, "#F1F3F5", { rx: 14 });
  for (let k = 0; k < 6; k++) b += `<path d="M30,${40 + k * 30} ${Array.from({ length: 14 }, (_, i) => `L${44 + i * 20},${40 + k * 30 + (i % 2 ? 10 : -10)}`).join(" ")}" fill="none" stroke="${COL.siDark}" stroke-width="4"/>`;
  b += ion(170, 100, { r: 12 }) + cross(200, 86, 9, COL.red, 3.5);
  b += text(175, 262, "晶区：链排得整齐", { size: 19, anchor: "middle", weight: "bold" });
  b += text(175, 290, "Li⁺ 被“冻住”", { size: 18, anchor: "middle", fill: COL.red });
  // amorphous (right top)
  b += rect(360, 10, 330, 220, "#E8F4F3", { rx: 14 });
  b += chain(370, 680, 70, 26, 0, { freq: 0.9 }).s + chain(370, 680, 130, 30, 2, { freq: 0.7 }).s + chain(370, 680, 190, 24, 4, { freq: 1.1 }).s;
  b += ion(470, 100, { r: 12 }) + ion(600, 160, { r: 12 });
  b += arrow(485, 104, 585, 152, { color: COL.amber, width: 3.5, head: 12 });
  b += text(525, 262, "无定形区：链段能扭动", { size: 19, anchor: "middle", weight: "bold" });
  b += text(525, 290, "Li⁺ 能跳（T > T_{g}）", { size: 18, anchor: "middle", fill: COL.teal });
  // conductivity vs T schematic
  const X0 = 90, X1 = 660, Y0 = 440, Y1 = 320;
  b += line(X0, Y0, X1, Y0, COL.ink, 2.5) + head(X1 + 8, Y0, 0, COL.ink, 12);
  b += line(X0, Y0, X0, Y1 - 6, COL.ink, 2.5) + head(X0, Y1 - 14, -Math.PI / 2, COL.ink, 12);
  b += text(X0 - 8, Y1 + 16, "σ", { size: 20, anchor: "end", weight: "bold", fill: COL.ink, italic: true });
  b += `<path d="M${X0 + 10},${Y0 - 12} L${X0 + 290},${Y0 - 50} L${X0 + 330},${Y0 - 95} L${X1 - 20},${Y1 + 6}" fill="none" stroke="${COL.teal}" stroke-width="5" stroke-linejoin="round"/>`;
  b += line(X0 + 310, Y0, X0 + 310, Y1 + 10, COL.red, 2, "5 5");
  b += text(X0 + 320, Y0 - 14, "T_{m} ≈ 65 °C：晶区熔化", { size: 17, fill: COL.red, weight: "bold" });
  b += text(X1, Y0 + 26, "温度 →（定性示意）", { size: 17, anchor: "end", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Salt dissociation ----------
figs.salt_dissoc = () => {
  const W = 680, H = 440;
  let b = "";
  const box = (x, t, s, col, f) => rect(x, 20, 210, 260, f, { rx: 14 }) + text(x + 105, 312, t, { size: 20, anchor: "middle", weight: "bold", fill: col }) + text(x + 105, 340, s, { size: 17, anchor: "middle", fill: COL.text2 });
  b += box(10, "自由离子", "能导电 ✓", COL.teal, "#E8F4F3");
  b += ion(70, 90, { r: 16 }) + anion(150, 200, 15) + ion(160, 110, { r: 16 }) + anion(60, 210, 15);
  b += box(235, "离子对", "电中性，不导电", COL.amber, "#FDF2E7");
  b += ion(310, 110, { r: 16 }) + anion(338, 110, 15) + ion(320, 210, { r: 16 }) + anion(348, 210, 15);
  b += box(460, "聚集体", "又大又慢", COL.red, "#FBEDEC");
  b += ion(530, 140, { r: 16 }) + anion(558, 140, 15) + ion(558, 168, { r: 16 }) + anion(530, 168, 15) + ion(600, 100, { r: 16 }) + anion(626, 100, 15);
  b += rect(10, 366, 660, 64, "#F5F7F9", { rx: 14 });
  b += text(30, 392, "阴离子越大、电荷越分散（ClO_{4}^{−} → CF_{3}SO_{3}^{−} → TFSI^{−}），", { size: 18, fill: COL.ink });
  b += text(30, 420, "锂盐越容易解离；但 PEO 中多数电流仍由阴离子携带。", { size: 18, fill: COL.ink });
  return svg(W, H, b);
};

// ---------- Other polymer hosts ----------
figs.hosts = () => {
  const W = 1230, H = 300;
  let b = "";
  const H4 = [
    { n: "PEO", u: "–CH_{2}–CH_{2}–O–", g: "醚氧 O", col: COL.teal },
    { n: "PAN", u: "–CH_{2}–CH(C≡N)–", g: "腈基 C≡N", col: COL.purple },
    { n: "PMMA", u: "–CH_{2}–C(CH_{3})(R)–", g: "酯基 C=O", col: COL.amber },
    { n: "PVC", u: "–CH_{2}–CHCl–", g: "C–Cl", col: COL.siDark },
    { n: "PVDF", u: "–CH_{2}–CF_{2}–", g: "C–F", col: COL.red },
  ];
  H4.forEach((h, i) => {
    const x = 10 + i * 244;
    b += rect(x, 10, 228, 280, "#F7F9FB", { rx: 16, stroke: h.col, sw: i === 0 ? 4 : 2 });
    b += text(x + 114, 64, h.n, { size: 30, anchor: "middle", weight: "bold", fill: h.col });
    b += text(x + 114, 124, h.u, { size: 18, anchor: "middle", fill: COL.ink });
    if (i === 2) b += text(x + 114, 152, "R = COOCH_{3}", { size: 17, anchor: "middle", fill: COL.text2 });
    b += text(x + 114, 186, "极性基团", { size: 17, anchor: "middle", fill: COL.text2 });
    b += pill(x + 34, 202, 160, 38, h.col, h.g, { size: 18 });
    if (i === 0) b += text(x + 114, 274, "最常用", { size: 18, anchor: "middle", fill: COL.teal, weight: "bold" });
  });
  return svg(W, H, b);
};

// ---------- Active vs passive fillers ----------
figs.fillers = () => {
  const W = 760, H = 460;
  let b = "";
  const panel = (X, active) => {
    let s = rect(X, 10, 360, 330, active ? "#F1ECF8" : "#F1F3F5", { rx: 16 });
    s += chain(X + 10, X + 350, 70, 16, 0).s + chain(X + 10, X + 350, 280, 16, 2).s;
    const pts = [[X + 90, 170], [X + 250, 180]];
    pts.forEach(([x, y], k) => (s += blob(x, y, 52, 60 + k, { fill: active ? COL.purpleLight : "#C9D2DA", stroke: active ? COL.purple : "#9AA6B2", sw: 2.5, jag: 0.1, n: 7 })));
    if (active) {
      s += ion(X + 60, 170, { r: 12 }) + ion(X + 118, 170, { r: 12 });
      s += arrow(X + 72, 170, X + 104, 170, { color: COL.amber, width: 3, head: 10 });
      s += arrow(X + 140, 175, X + 205, 178, { color: COL.amber, width: 3, head: 10 });
      s += ion(X + 240, 180, { r: 12 });
    } else {
      s += ion(X + 170, 120, { r: 12 }) + ion(X + 172, 236, { r: 12 });
      s += `<path d="M${X + 30},120 C${X + 90},96 ${X + 140},100 ${X + 170},120 C${X + 200},140 ${X + 260},110 ${X + 330},120" fill="none" stroke="${COL.amber}" stroke-width="3" stroke-dasharray="7 6"/>`;
      s += cross(X + 250, 182, 10, COL.red, 4);
    }
    return s;
  };
  b += panel(10, true);
  b += panel(390, false);
  b += text(190, 374, "活性填料 Active", { size: 21, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(190, 404, "自身导 Li⁺，参与传导", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(190, 432, "如 Li_{3}N、LLZO、LLTO", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(570, 374, "惰性填料 Passive", { size: 21, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += text(570, 404, "自身不导 Li⁺，只“帮忙”", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(570, 432, "如 Al_{2}O_{3}、SiO_{2}、MgO", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- How fillers help ----------
figs.filler_mech = () => {
  const W = 700, H = 450;
  let b = "";
  b += rect(10, 10, 680, 300, "#F7F9FB", { rx: 16, stroke: COL.line });
  // amorphous shell around particle
  b += circ(200, 160, 108, "#E8F4F3");
  b += circ(200, 160, 108, "none", { stroke: COL.teal, sw: 2.5, dash: "7 6" });
  b += blob(200, 160, 62, 5, { fill: "#C9D2DA", stroke: "#9AA6B2", sw: 2.5, jag: 0.08, n: 8 });
  [[0, "δ+"], [1.6, "δ+"], [3.2, "δ+"], [4.7, "δ+"]].forEach(([a, t]) => (b += text(200 + 44 * Math.cos(a), 166 + 44 * Math.sin(a), t, { size: 17, anchor: "middle", weight: "bold", fill: COL.siDark })));
  [[0.6, 1], [2.4, 1], [4.0, 1]].forEach(([a]) => (b += anion(200 + 78 * Math.cos(a), 160 + 78 * Math.sin(a), 12)));
  b += ion(340, 90, { r: 13 }) + ion(345, 230, { r: 13 });
  b += arrow(358, 92, 420, 80, { color: COL.amber, width: 3, head: 10 });
  b += arrow(362, 232, 424, 244, { color: COL.amber, width: 3, head: 10 });
  // labels
  b += text(450, 70, "① 表面路易斯酸位", { size: 18, weight: "bold", fill: COL.ink });
  b += text(470, 96, "抓住阴离子 → 放出 Li⁺", { size: 17, fill: COL.text2 });
  b += text(450, 150, "② 表面附近链不易结晶", { size: 18, weight: "bold", fill: COL.teal });
  b += text(470, 176, "形成无定形“壳层”", { size: 17, fill: COL.text2 });
  b += text(450, 230, "③ 力学增强", { size: 18, weight: "bold", fill: COL.purple });
  b += text(470, 256, "膜更硬、更耐热", { size: 17, fill: COL.text2 });
  // nanowire network
  b += text(20, 350, "活性填料做成纳米线 / 三维网络：给 Li⁺ 修一条连续的“高速路”", { size: 18, weight: "bold", fill: COL.purple });
  b += rect(20, 368, 660, 70, "#F1ECF8", { rx: 12 });
  [[40, 390, 300, 410], [200, 420, 520, 380], [420, 400, 660, 425]].forEach(([x1, y1, x2, y2]) => (b += line(x1, y1, x2, y2, COL.purple, 10)));
  [[120, 397], [360, 395], [560, 412]].forEach(([x, y]) => (b += ion(x, y - 0, { r: 10 })));
  return svg(W, H, b);
};

// ---------- Vapour deposition techniques ----------
figs.deposition = () => {
  const W = 1230, H = 330;
  let b = "";
  const C4 = [
    { t: "射频溅射", e: "RF sputtering", col: COL.purple },
    { t: "脉冲激光沉积", e: "PLD", col: COL.red },
    { t: "化学气相沉积", e: "CVD", col: COL.teal },
    { t: "原子层沉积", e: "ALD", col: COL.amber },
  ];
  C4.forEach((c, i) => {
    const x = 10 + i * 305;
    b += rect(x, 10, 290, 310, "#F7F9FB", { rx: 16, stroke: c.col, sw: 2 });
    b += rect(x + 30, 196, 230, 16, "#9FB0C0");
    b += rect(x + 30, 186, 230, 10, c.col, { opacity: 0.8 });
    if (i === 0) {
      b += rect(x + 70, 36, 150, 26, "#FFFFFF", { stroke: COL.ink, sw: 2 });
      b += text(x + 145, 56, "Li_{3}PO_{4} 靶", { size: 17, anchor: "middle", weight: "bold" });
      for (let k = 0; k < 7; k++) b += circ(x + 90 + k * 18, 110 + (k % 2) * 30, 6, COL.purpleLight);
      b += text(x + 145, 176, "N_{2} 等离子体", { size: 17, anchor: "middle", fill: COL.purple, weight: "bold" });
    }
    if (i === 1) {
      b += rect(x + 110, 36, 70, 26, "#FFFFFF", { stroke: COL.ink, sw: 2 });
      b += line(x + 30, 30, x + 112, 52, COL.red, 4);
      b += `<path d="M${x + 145},62 Q${x + 95},140 ${x + 110},182 L${x + 180},182 Q${x + 195},140 ${x + 145},62 Z" fill="${COL.redLight}" opacity="0.8"/>`;
      b += text(x + 230, 60, "激光", { size: 17, anchor: "middle", fill: COL.red, weight: "bold" });
    }
    if (i === 2) {
      for (let k = 0; k < 8; k++) b += arrow(x + 40 + k * 28, 70 + (k % 3) * 20, x + 52 + k * 28, 160, { color: COL.teal, width: 2.5, head: 9 });
      b += text(x + 145, 52, "气态前驱体反应", { size: 17, anchor: "middle", fill: COL.teal, weight: "bold" });
    }
    if (i === 3) {
      for (let k = 0; k < 11; k++) b += circ(x + 40 + k * 21, 176, 7, COL.amber);
      b += text(x + 145, 70, "一次只长", { size: 17, anchor: "middle", fill: COL.amber, weight: "bold" });
      b += text(x + 145, 96, "一层原子", { size: 17, anchor: "middle", fill: COL.amber, weight: "bold" });
    }
    b += text(x + 145, 256, c.t, { size: 21, anchor: "middle", weight: "bold", fill: c.col });
    b += text(x + 145, 288, c.e, { size: 18, anchor: "middle", fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- LiPON: N cross-links the phosphate network ----------
figs.lipon = () => {
  const W = 700, H = 460;
  let b = "";
  const P = (x, y) => circ(x, y, 15, COL.amber) + text(x, y + 6, "P", { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  const O = (x, y) => circ(x, y, 10, COL.red);
  const N = (x, y) => circ(x, y, 13, "#3A7CA5") + text(x, y + 6, "N", { size: 16, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  // left: Li3PO4 isolated tetrahedra
  b += rect(10, 10, 320, 300, "#F7F9FB", { rx: 14 });
  [[90, 90], [240, 100], [110, 230], [250, 230]].forEach(([x, y]) => {
    [[0, -34], [30, 18], [-30, 18], [0, 4]].forEach(([dx, dy], k) => k < 3 && (b += line(x, y, x + dx, y + dy, "#9AA6B2", 3)));
    b += P(x, y);
    [[0, -34], [30, 18], [-30, 18]].forEach(([dx, dy]) => (b += O(x + dx, y + dy)));
  });
  [[170, 160], [60, 160], [290, 165]].forEach(([x, y]) => (b += ion(x, y, { r: 11 })));
  b += text(170, 344, "Li_{3}PO_{4}：孤立的 PO_{4}", { size: 19, anchor: "middle", weight: "bold" });
  b += arrow(338, 160, 372, 160, { color: COL.ink, width: 4, head: 13 });
  b += text(355, 140, "+N", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  // right: N bridges
  b += rect(380, 10, 310, 300, "#EAF3F9", { rx: 14 });
  const ps = [[450, 90], [610, 90], [450, 230], [610, 230]];
  b += line(450, 90, 610, 90, "#9AA6B2", 3) + line(450, 90, 450, 230, "#9AA6B2", 3) + line(610, 90, 610, 230, "#9AA6B2", 3) + line(450, 230, 530, 170, "#9AA6B2", 3) + line(610, 230, 530, 170, "#9AA6B2", 3) + line(610, 90, 530, 170, "#9AA6B2", 3);
  ps.forEach(([x, y]) => (b += P(x, y)));
  b += N(530, 90) + N(450, 160) + N(530, 170);
  [[420, 60], [640, 60], [420, 260], [640, 260], [640, 160]].forEach(([x, y]) => (b += O(x, y)));
  [[560, 130], [490, 270]].forEach(([x, y]) => (b += ion(x, y, { r: 11 })));
  b += text(535, 344, "LiPON：N 把 PO_{4} 连成网", { size: 19, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += lines(20, 392, ["• N 有两种：两配位桥连 N 与三配位 N，使网络交联", "• 非晶、无晶界；电导由 ~10^{−7} 提高到 ~10^{−6} S cm^{−1} 量级"], { size: 18, fill: COL.ink, lh: 32 });
  return svg(W, H, b);
};

// ---------- Thin-film battery stack ----------
figs.tfb = () => {
  const W = 700, H = 420;
  let b = "";
  const layers = [
    [330, 40, "#D9DEE3", "基底（Si / 陶瓷 / 云母）"],
    [300, 30, "#C9A227", "正极集流体（Au / Pt）"],
    [240, 60, COL.amberLight, "正极 LiCoO_{2}（约 1–3 μm）"],
    [200, 40, COL.purpleLight, "LiPON（约 1–2 μm）"],
    [160, 40, "#B9C3CC", "Li 金属负极"],
    [120, 40, "#3E4C59", "保护封装层"],
  ];
  layers.forEach(([y, h, f, t], i) => {
    const inset = i < 2 ? 0 : (i - 1) * 18;
    b += rect(30 + inset, y, 300 - inset * 2, h, f, { rx: 3 });
    b += line(330 - inset + 4, y + h / 2, 380, y + h / 2, COL.line, 2);
    b += text(390, y + h / 2 + 7, t, { size: 18, fill: i === 3 ? COL.purple : COL.ink, weight: i === 3 ? "bold" : undefined });
  });
  b += text(180, 400, "总厚度通常只有十几微米（示意，未按比例）", { size: 17, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- ALD cycle ----------
figs.ald = () => {
  const W = 700, H = 440;
  let b = "";
  const steps = [
    ["① 通前驱体 A", "只吸附一层，自动停止", COL.amber],
    ["② 吹扫", "冲走多余的 A", COL.muted],
    ["③ 通前驱体 B", "与 A 反应成一层膜", COL.teal],
    ["④ 吹扫", "重复 ①–④ 若干次", COL.muted],
  ];
  const cx = 200, cy = 210, R = 140;
  steps.forEach(([t, s, c], i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    b += circ(x, y, 52, "#FFFFFF", { stroke: c, sw: 4 });
    b += text(x, y + 8, String(i + 1), { size: 30, anchor: "middle", weight: "bold", fill: c });
    const a2 = a + Math.PI / 4;
    b += head(cx + R * Math.cos(a2) * 0.98, cy + R * Math.sin(a2) * 0.98, a2 + Math.PI / 2, COL.line, 16);
  });
  b += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${COL.line}" stroke-width="4" stroke-dasharray="2 0"/>`;
  steps.forEach(([t, s, c], i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    b += circ(x, y, 50, "#FFFFFF");
    b += text(x, y + 10, String(i + 1), { size: 30, anchor: "middle", weight: "bold", fill: c });
  });
  steps.forEach(([t, s, c], i) => {
    b += text(400, 80 + i * 82, t, { size: 20, weight: "bold", fill: c === COL.muted ? COL.siDark : c });
    b += text(400, 108 + i * 82, s, { size: 18, fill: COL.text2 });
  });
  b += text(10, 420, "自限制：每个循环只长约一层原子，能均匀包覆三维结构", { size: 18, fill: COL.ink, weight: "bold" });
  return svg(W, H, b);
};

module.exports = figs;
