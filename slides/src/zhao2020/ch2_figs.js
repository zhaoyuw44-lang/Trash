// Figures for Zhao et al. 2020, Chapter 2 (离子传输机理与路径)
// Canvas widths ≈ 96 px per inch of the slide box, so 15 px text ≥ 11 pt.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 0}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const anionX = (x, y, r = 11) => circ(x, y, r, COL.teal) + text(x, y + r * 0.45, "−", { size: Math.round(r * 1.5), fill: "#FFFFFF", anchor: "middle", weight: "bold" });
const arc = (x1, y1, x2, y2, lift, c, w = 3, dash = "6 5") =>
  `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - lift} ${x2},${y2}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${dash}"/>`;
const pathOf = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

// ---------- Title motif: energy landscape with a hopping ion ----------
figs.title_motif = () => {
  const W = 420, H = 520;
  let b = "";
  const y0 = 330, A = 70;
  const pts = [];
  for (let x = 20; x <= 400; x += 4) pts.push([x, y0 - A * (0.5 - 0.5 * Math.cos(((x - 20) / 95) * 2 * Math.PI))]);
  b += `<path d="${pathOf(pts)} L400,460 L20,460 Z" fill="#2E4054"/>`;
  b += `<path d="${pathOf(pts)}" fill="none" stroke="#9FB0C0" stroke-width="5" stroke-linejoin="round"/>`;
  [20, 115, 210, 305, 400].forEach((x) => (b += circ(x, y0 - 14, 9, "#5B7083")));
  b += `<path d="M115,${y0 - 22} Q162,${y0 - A - 70} 210,${y0 - 22}" fill="none" stroke="${COL.amber}" stroke-width="5" stroke-dasharray="10 7"/>`;
  b += head(210, y0 - 22, 1.1, COL.amber, 18);
  b += circ(115, y0 - 24, 18, COL.amber);
  b += line(300, y0 - A - 6, 340, y0 - A - 6, "#CADCE8", 2) + line(300, y0 - 4, 340, y0 - 4, "#CADCE8", 2);
  b += arrow(320, y0 - 8, 320, y0 - A + 2, { color: "#CADCE8", width: 3, head: 12 });
  // thermometer-ish bars
  [0, 1, 2, 3, 4].forEach((k) => (b += rect(60 + k * 68, 90 + (4 - k) * 18, 40, 90 - (4 - k) * 18, k === 4 ? COL.amber : "#5B7083", { rx: 6 })));
  return svg(W, H, b);
};

// ---------- Nernst–Planck: three driving forces ----------
figs.np_terms = () => {
  const W = 640, H = 420;
  let b = "";
  const rows = [
    { y: 10, t: "① 迁移 Migration", s: ["电场 ∇φ 推着离子走"], c: COL.purple },
    { y: 145, t: "② 扩散 Diffusion", s: ["浓度差 ∇c 让离子", "从多处流向少处"], c: COL.teal },
    { y: 280, t: "③ 对流 Convection", s: ["整个介质在流动", "固体里可以忽略"], c: COL.muted },
  ];
  rows.forEach((r, i) => {
    b += rect(10, r.y, 330, 125, "#F5F7F9", { rx: 14 });
    b += text(362, r.y + 42, r.t, { size: 22, weight: "bold", fill: r.c });
    b += lines(362, r.y + 78, r.s, { size: 18, fill: COL.text2, lh: 26 });
  });
  // row 1: plates + field
  b += rect(26, 22, 16, 101, COL.red) + text(34, 80, "+", { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += rect(308, 22, 16, 101, "#3A7CA5") + text(316, 79, "−", { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  [45, 75, 105].forEach((y) => (b += arrow(56, y, 116, y, { color: COL.line, width: 2.5, head: 10 })));
  b += ion(170, 60, { r: 14 }) + arrow(190, 60, 260, 60, { color: COL.purple, width: 3.5, head: 13 });
  b += anionX(240, 100, 12) + arrow(222, 100, 160, 100, { color: COL.teal, width: 3, head: 12 });
  // row 2: gradient
  const R = rng(5);
  for (let i = 0; i < 40; i++) {
    const u = Math.pow(R(), 1.8);
    b += circ(30 + u * 290, 160 + R() * 95, 6, COL.purple, { opacity: 0.85 });
  }
  b += arrow(120, 262, 300, 262, { color: COL.teal, width: 3.5, head: 13 });
  // row 3: flow + cross
  [305, 335, 365].forEach((y, k) => (b += arrow(40 + k * 20, y + 5, 260 + k * 20, y + 5, { color: "#9CC9E0", width: 4, head: 13 })));
  b += cross(300, 345, 16, COL.red, 5);
  return svg(W, H, b);
};

// ---------- sigma = c x mu ----------
figs.sigma_cmu = () => {
  const W = 640, H = 330;
  let b = "";
  // c box
  b += rect(10, 40, 220, 210, "#F1ECF8", { rx: 16 });
  b += text(120, 26, "c：能动的离子有多少", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  [[50, 90], [110, 80], [170, 100], [70, 160], [140, 150], [190, 200]].forEach(([x, y], k) => {
    if (k % 3 === 2) b += ion(x - 12, y, { r: 11 }) + anionX(x + 12, y, 11);
    else b += ion(x, y, { r: 11 }) + anionX(x + 28, y + 30, 11);
  });
  b += text(120, 280, "离子对拆得越开，c 越大", { size: 16, anchor: "middle", fill: COL.text2 });
  b += text(258, 160, "×", { size: 40, anchor: "middle", weight: "bold", fill: COL.muted });
  // mu box
  b += rect(286, 40, 220, 210, "#E8F4F3", { rx: 16 });
  b += text(396, 26, "μ：每个离子跑得多快", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  [[0, 80, 150], [1, 140, 90], [2, 200, 40]].forEach(([k, y, len]) => {
    b += ion(316, y, { r: 11 }) + arrow(334, y, 334 + len, y, { color: COL.teal, width: 3.5, head: 12 });
  });
  b += text(396, 280, "能垒越低、跳得越勤，μ 越大", { size: 16, anchor: "middle", fill: COL.text2 });
  b += text(534, 160, "=", { size: 40, anchor: "middle", weight: "bold", fill: COL.muted });
  b += circ(590, 148, 42, COL.amber) + text(590, 162, "σ", { size: 40, anchor: "middle", weight: "bold", fill: "#FFFFFF", italic: true });
  b += text(590, 222, "电导率", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- Fig. 3a redrawn: defects and interfaces in an SIE ----------
figs.fig3a = () => {
  const W = 680, H = 440;
  let b = "";
  const x0 = 70, y0 = 80, nx = 11, ny = 6, dx = 46, dy = 46;
  b += rect(20, 60, 40, 300, COL.redLight, { rx: 8 });
  b += `<g transform="translate(46 210) rotate(-90)">` + text(0, 0, "正极", { size: 16, anchor: "middle", weight: "bold", fill: COL.red }) + `</g>`;
  b += rect(620, 60, 40, 300, "#CFE3F2", { rx: 8 });
  b += `<g transform="translate(646 210) rotate(-90)">` + text(0, 0, "负极", { size: 16, anchor: "middle", weight: "bold", fill: "#3A7CA5" }) + `</g>`;
  const gbx = (j) => 330 + (j - 2.5) * 18; // tilted grain boundary
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      let x = x0 + i * dx + 10, y = y0 + j * dy;
      if (x > gbx(j)) x += 8;
      const k = `${i},${j}`;
      if (k === "6,1" || k === "7,1") continue; // Schottky pair
      if (k === "8,4") continue; // Frenkel vacancy
      const cat = (i + j) % 2 === 0;
      if (k === "4,3") { b += circ(x, y, 19, COL.amberLight, { stroke: COL.amber, sw: 2 }); continue; } // impurity
      b += cat ? circ(x, y, 10, COL.purple) : circ(x, y, 17, "#9AA6B2", { stroke: COL.siDark, sw: 1.5 });
    }
  // Schottky vacancies
  const sx = x0 + 6 * dx + 18, sy = y0 + dy;
  b += circ(sx, sy, 10, "none", { stroke: COL.purple, sw: 2.5, dash: "4 3" }) + circ(sx + dx, sy, 17, "none", { stroke: COL.siDark, sw: 2.5, dash: "4 3" });
  // Frenkel: vacancy + interstitial
  const fx = x0 + 8 * dx + 18, fy = y0 + 4 * dy;
  b += circ(fx, fy, 10, "none", { stroke: COL.purple, sw: 2.5, dash: "4 3" });
  b += circ(fx - dx / 2, fy - dy / 2, 10, COL.purple, { stroke: "#FFFFFF", sw: 2 });
  b += arrow(fx - 6, fy - 6, fx - dx / 2 + 9, fy - dy / 2 + 9, { color: COL.red, width: 2.5, head: 9 });
  // grain boundary line
  b += line(gbx(-0.6), y0 - 26, gbx(ny - 0.4), y0 + (ny - 1) * dy + 26, "#3A9BD5", 4);
  // space-charge & interfacial layers
  b += rect(62, 60, 26, 300, COL.red, { opacity: 0.12 });
  b += rect(592, 60, 26, 300, "#3A7CA5", { opacity: 0.15 });
  // labels
  const lab = (x, y, tx, ty, t, c) => line(x, y, tx, ty, c, 1.8) + text(tx, ty + (ty < y ? -6 : 18), t, { size: 16, anchor: "middle", weight: "bold", fill: c });
  b += lab(sx + dx / 2, sy - 22, sx + dx / 2, 30, "Schottky 缺陷", COL.ink);
  b += lab(gbx(-0.6), y0 - 26, 300, 30, "晶界", "#3A9BD5");
  b += lab(fx - 10, fy + 20, fx + 20, 382, "Frenkel 缺陷", COL.ink);
  b += lab(x0 + 4 * dx + 10, y0 + 3 * dy + 20, 250, 382, "杂质", COL.amber);
  b += lab(75, 360, 100, 405, "空间电荷层", COL.red);
  b += lab(605, 360, 580, 405, "界面层", "#3A7CA5");
  b += circ(150, 30, 9, COL.purple) + text(165, 36, "阳离子", { size: 15, fill: COL.purple, weight: "bold" });
  b += circ(560, 30, 13, "#9AA6B2", { stroke: COL.siDark, sw: 1.5 }) + text(580, 36, "阴离子", { size: 15, fill: COL.siDark, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Three hopping mechanisms ----------
figs.hop_mechs = () => {
  const W = 1180, H = 350;
  let b = "";
  const pw = 373, gap = 10;
  const panel = (k, title, sub) => {
    const x0 = 10 + k * (pw + gap);
    let s = rect(x0, 10, pw, 330, "#F5F7F9", { rx: 14 });
    s += text(x0 + pw / 2, 46, title, { size: 20, anchor: "middle", weight: "bold" });
    s += lines(x0 + pw / 2, 290, sub, { size: 16, anchor: "middle", fill: COL.text2, lh: 24 });
    // lattice 3x5
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
      const x = x0 + 70 + c * 60, y = 100 + r * 56;
      s += `<!--site-->`;
      s += circ(x, y, 15, "#C9D2DA", { stroke: "#9AA6B2", sw: 1.5 });
    }
    return { s, x0 };
  };
  // vacancy
  let p = panel(0, "空位机制 Vacancy", ["离子跳进旁边的空位", "空位朝反方向“移动”"]);
  b += p.s;
  {
    const x1 = p.x0 + 70 + 1 * 60, x2 = p.x0 + 70 + 2 * 60, y = 156;
    b += circ(x2, y, 15, "#F5F7F9") + circ(x2, y, 15, "none", { stroke: COL.purple, sw: 2.5, dash: "4 3" });
    b += circ(x1, y, 15, COL.purple);
    b += arc(x1 + 4, y - 16, x2 - 4, y - 16, 34, COL.purple);
    b += head(x2 - 4, y - 16, 0.9, COL.purple, 12);
  }
  // interstitial
  p = panel(1, "间隙机制 Interstitial", ["离子在晶格“缝隙”之间", "直接跳来跳去"]);
  b += p.s;
  {
    const xa = p.x0 + 100, xb = p.x0 + 160, xc = p.x0 + 220, y = 128;
    b += circ(xa, y, 10, COL.purple);
    b += arc(xa + 4, y - 10, xb - 4, y - 10, 22, COL.purple) + head(xb - 4, y - 10, 0.9, COL.purple, 11);
    b += circ(xb, y, 9, "none", { stroke: COL.purple, sw: 2, dash: "3 3" }) + circ(xc, y, 9, "none", { stroke: COL.purple, sw: 2, dash: "3 3" });
    b += arc(xb + 4, y - 10, xc - 4, y - 10, 22, COL.purple) + head(xc - 4, y - 10, 0.9, COL.purple, 11);
  }
  // knock-off (interstitialcy)
  p = panel(2, "推填机制 Knock-off", ["间隙离子把格点离子“推”进", "下一个间隙，自己占格点"]);
  b += p.s;
  {
    const y = 156, xs = p.x0 + 160, xl = p.x0 + 190, xi2 = p.x0 + 280;
    b += circ(xl, y, 15, COL.amber);
    b += circ(xs, y - 28, 10, COL.purple);
    b += arrow(xs + 8, y - 22, xl - 14, y - 6, { color: COL.purple, width: 3, head: 11 });
    b += arrow(xl + 14, y - 6, xi2 - 10, y - 26, { color: COL.amber, width: 3, head: 11 });
    b += circ(xi2, y - 28, 10, "none", { stroke: COL.amber, sw: 2.5, dash: "3 3" });
    b += text(xl, y + 40, "格点离子", { size: 15, anchor: "middle", fill: COL.amber, weight: "bold" });
  }
  return svg(W, H, b);
};

// ---------- Energy landscape for Eq. 3 ----------
figs.energy_landscape = () => {
  const W = 670, H = 400;
  let b = "";
  const y0 = 290, A = 120, per = 200, x0 = 40;
  const pts = [];
  for (let x = x0; x <= 640; x += 3) pts.push([x, y0 - A * (0.5 - 0.5 * Math.cos(((x - x0) / per) * 2 * Math.PI))]);
  b += `<path d="${pathOf(pts)} L640,330 L40,330 Z" fill="#EEF2F5"/>`;
  b += `<path d="${pathOf(pts)}" fill="none" stroke="${COL.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  b += ion(x0 + per, y0 - 16, { r: 15 });
  b += circ(x0 + 2 * per, y0 - 16, 15, "none", { stroke: COL.purple, sw: 2.5, dash: "4 3" });
  b += circ(x0, y0 - 16, 15, "none", { stroke: COL.purple, sw: 2.5, dash: "4 3" });
  // attempts
  [[-1, 0.9], [1, 0.6]].forEach(([s, f]) => (b += arrow(x0 + per + s * 18, y0 - 34, x0 + per + s * 48, y0 - 34 - 40 * f, { color: COL.amber, width: 2.5, head: 10 })));
  b += text(x0 + per, y0 + 28, "f_{0}：每秒“试跳”次数", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  // successful hop
  b += `<path d="M${x0 + per + 20},${y0 - 30} Q${x0 + 1.5 * per},${y0 - A - 110} ${x0 + 2 * per - 20},${y0 - 30}" fill="none" stroke="${COL.purple}" stroke-width="3.5" stroke-dasharray="8 6"/>`;
  b += head(x0 + 2 * per - 20, y0 - 30, 1.0, COL.purple, 14);
  b += text(x0 + 1.5 * per, 112, "偶尔一次跳过去", { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
  // barrier
  const bx = x0 + 2.5 * per + 30;
  b += line(x0 + 2.5 * per - 20, y0 - A, bx + 10, y0 - A, COL.red, 2, { dash: "5 4" });
  b += line(x0 + 2 * per + 20, y0, bx + 10, y0, COL.red, 2, { dash: "5 4" });
  b += arrow(bx, y0 - 4, bx, y0 - A + 4, { color: COL.red, width: 3, head: 12 });
  b += arrow(bx, y0 - A + 4, bx, y0 - 4, { color: COL.red, width: 3, head: 12 });
  b += text(bx - 12, y0 - A / 2 + 6, "ΔG_{mig}", { size: 18, anchor: "end", weight: "bold", fill: COL.red });
  // hop distance
  b += line(x0 + per, 352, x0 + 2 * per, 352, COL.ink, 2.5);
  b += line(x0 + per, 342, x0 + per, 362, COL.ink, 2.5) + line(x0 + 2 * per, 342, x0 + 2 * per, 362, COL.ink, 2.5);
  b += text(x0 + 1.5 * per, 386, "a：跳跃距离（相邻位点间距）", { size: 16, anchor: "middle", weight: "bold" });
  b += text(x0 + 2, 322, "位点", { size: 16, fill: COL.muted }) + text(x0 + 2 * per, 322, "位点", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Arrhenius plot ----------
figs.arrhenius_plot = () => {
  const W = 560, H = 420;
  let b = "";
  const X0 = 80, X1 = 520, Y0 = 340, Y1 = 30;
  b += line(X0, Y0, X1, Y0, COL.ink, 3) + head(X1 + 12, Y0, 0, COL.ink, 14);
  b += line(X0, Y0, X0, Y1, COL.ink, 3) + head(X0, Y1 - 12, -Math.PI / 2, COL.ink, 14);
  b += text((X0 + X1) / 2, Y0 + 38, "1/T（越往右温度越低）", { size: 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += `<g transform="translate(${X0 - 30} ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "ln(σT)", { size: 18, anchor: "middle", weight: "bold", fill: COL.text2 }) + `</g>`;
  b += line(X0 + 30, Y1 + 40, X1 - 20, Y0 - 50, COL.purple, 5);
  // slope triangle
  const ax = 240, ay = Y1 + 40 + (240 - X0 - 30) * ((Y0 - 50 - Y1 - 40) / (X1 - 20 - X0 - 30));
  const bx2 = 380, by2 = Y1 + 40 + (380 - X0 - 30) * ((Y0 - 50 - Y1 - 40) / (X1 - 20 - X0 - 30));
  b += `<polyline points="${ax},${ay} ${bx2},${ay} ${bx2},${by2}" fill="none" stroke="${COL.amber}" stroke-width="3" stroke-dasharray="6 4"/>`;
  b += text(bx2 + 14, (ay + by2) / 2 + 6, "斜率 = −E_{a}/R", { size: 18, weight: "bold", fill: COL.amber });
  [[X0 + 70, "高温"], [X1 - 60, "低温"]].forEach(([x, t]) => (b += text(x, Y0 - 12, t, { size: 17, anchor: "middle", fill: COL.muted })));
  b += text(X0 + 40, Y1 + 20, "晶体：一条直线", { size: 17, weight: "bold", fill: COL.purple });
  b += text(W / 2, 412, "示意：Arrhenius 图", { size: 17, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- bcc vs fcc anion sublattice ----------
figs.bcc_fcc = () => {
  const W = 680, H = 440;
  let b = "";
  const cell = (cx, cy, bcc) => {
    let s = "";
    const a = 120;
    s += rect(cx - a, cy - a, 2 * a, 2 * a, "none", { stroke: COL.line, sw: 2 });
    const an = bcc
      ? [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]]
      : [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]];
    an.forEach(([i, j]) => (s += circ(cx + i * a, cy + j * a, 30, COL.sulfurLight, { stroke: COL.sulfur, sw: 2 })));
    return s;
  };
  // bcc: tetrahedral sites on faces, direct T-T
  const c1 = 170, cy = 180;
  b += cell(c1, cy, true);
  const tsites = [[-0.5, -1], [0, -1 + 0.5], [0.5, -1], [-1, -0.5], [-1, 0.5]];
  const T = [[c1 - 60, cy - 120], [c1 - 60, cy - 60], [c1 - 120, cy - 60]];
  [[c1 - 60, cy - 60], [c1 + 60, cy - 60], [c1 - 60, cy + 60], [c1 + 60, cy + 60]].forEach(([x, y]) => (b += circ(x, y, 9, "#FFFFFF", { stroke: COL.purple, sw: 2.5 })));
  b += circ(c1 - 60, cy - 60, 11, COL.purple);
  b += arc(c1 - 50, cy - 66, c1 + 50, cy - 66, 18, COL.purple, 3.5) + head(c1 + 50, cy - 66, 0.6, COL.purple, 12);
  b += text(c1, 30, "体心立方 bcc", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  // fcc: T -> O -> T
  const c2 = 510;
  b += cell(c2, cy, false);
  b += circ(c2, cy, 13, "#FFFFFF", { stroke: COL.red, sw: 2.5 });
  b += circ(c2 - 60, cy - 60, 9, "#FFFFFF", { stroke: COL.purple, sw: 2.5 }) + circ(c2 + 60, cy + 60, 9, "#FFFFFF", { stroke: COL.purple, sw: 2.5 });
  b += circ(c2 - 60, cy - 60, 11, COL.purple);
  b += arrow(c2 - 50, cy - 50, c2 - 14, cy - 14, { color: COL.purple, width: 3.5, head: 12 });
  b += arrow(c2 + 14, cy + 14, c2 + 50, cy + 50, { color: COL.purple, width: 3.5, head: 12 });
  b += text(c2 + 22, cy - 18, "O", { size: 16, weight: "bold", fill: COL.red });
  b += text(c2, 30, "面心立方 fcc / 六方 hcp", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  // mini energy profiles
  const prof = (x0, w, hs, c) => {
    const pts = [];
    for (let k = 0; k <= 60; k++) {
      const t = k / 60;
      let e = 0;
      hs.forEach(([pos, h, wd]) => (e += h * Math.exp(-((t - pos) ** 2) / (2 * wd * wd))));
      pts.push([x0 + t * w, 400 - e]);
    }
    return `<path d="${pathOf(pts)}" fill="none" stroke="${c}" stroke-width="4"/>` + line(x0, 400, x0 + w, 400, COL.line, 2);
  };
  b += prof(60, 220, [[0.5, 22, 0.12]], COL.teal);
  b += prof(400, 220, [[0.3, 62, 0.07], [0.7, 62, 0.07], [0.5, 30, 0.12]], COL.red);
  b += text(170, 430, "T → T 直接相连：能垒低、平", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(510, 430, "T → O → T 绕路：能垒高", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += circ(300, 352, 9, "#FFFFFF", { stroke: COL.purple, sw: 2.5 }) + text(316, 358, "四面体位 T", { size: 16, fill: COL.purple, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Isolated vs concerted migration ----------
figs.concerted = () => {
  const W = 680, H = 420;
  let b = "";
  const land = (y0, A, per, x0, x1, c) => {
    const pts = [];
    for (let x = x0; x <= x1; x += 3) pts.push([x, y0 - A * (0.5 - 0.5 * Math.cos(((x - x0) / per) * 2 * Math.PI))]);
    return `<path d="${pathOf(pts)}" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`;
  };
  // isolated
  b += text(20, 34, "单个离子跳跃（普通陶瓷）", { size: 18, weight: "bold" });
  b += land(170, 100, 120, 60, 600, COL.ink);
  b += ion(180, 156, { r: 13 }) + circ(300, 156, 13, "none", { stroke: COL.purple, sw: 2.5, dash: "4 3" });
  b += arc(192, 140, 288, 140, 110, COL.purple, 3) + head(288, 140, 1.0, COL.purple, 12);
  [420, 540].forEach((x) => (b += ion(x, 156, { r: 13 })));
  b += line(560, 70, 660, 70, COL.red, 2, { dash: "4 3" }) + line(600, 170, 660, 170, COL.red, 2, { dash: "4 3" });
  b += arrow(645, 166, 645, 74, { color: COL.red, width: 3, head: 11 });
  b += text(652, 126, "高", { size: 16, weight: "bold", fill: COL.red });
  // concerted
  b += text(20, 236, "协同迁移（超离子导体）", { size: 18, weight: "bold", fill: COL.teal });
  b += land(380, 40, 80, 60, 620, COL.teal);
  // ions sit partly on high energy sites
  [[140, 360], [180, 345], [220, 360]].forEach(([x, y]) => (b += ion(x, y, { r: 13 })));
  [[140, 360], [180, 345], [220, 360]].forEach(([x, y]) => (b += arrow(x + 4, y - 22, x + 36, y - 22, { color: COL.purple, width: 2.5, head: 10 })));
  b += text(180, 306, "几个离子一起挪一步", { size: 15, anchor: "middle", weight: "bold", fill: COL.purple });
  b += line(600, 340, 670, 340, COL.teal, 2, { dash: "4 3" }) + line(620, 380, 670, 380, COL.teal, 2, { dash: "4 3" });
  b += arrow(650, 376, 650, 344, { color: COL.teal, width: 3, head: 10 });
  b += text(658, 366, "低", { size: 16, weight: "bold", fill: COL.teal });
  b += text(400, 306, "离子间互相排斥，彼此“推”着走", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- LGPS anisotropy timeline ----------
figs.tl_lgps = () => {
  const W = 1180, H = 330;
  const ev = [
    { year: "2011", who: ["Kamaya 等"], what: ["LGPS 结构：", "沿 c 轴一维通道"], color: COL.sulfur },
    { year: "2015", who: ["Kwon 等"], what: ["高温下从一维", "转向三维主导"], color: COL.purple },
    { year: "2016", who: ["Weber 等"], what: ["中子衍射：准各向", "同性三维路径"], color: COL.purple },
    { year: "2019", who: ["Iwasaki 等"], what: ["单晶：各方向 E_{a}", "几乎相等，弱各向异性"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 165, left: 160, right: 1000, whoSize: 19, whatSize: 17, yearSize: 28 }));
};

// ---------- SPE amorphous transport (Fig. 3b) ----------
figs.spe_amorph = () => {
  const W = 680, H = 400;
  let b = "";
  const chain = (pts, c = COL.teal) => {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      d += ` Q${(x0 + x1) / 2 + (i % 2 ? 22 : -22)},${(y0 + y1) / 2 + (i % 2 ? -22 : 22)} ${x1},${y1}`;
    }
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  };
  const A = [[30, 120], [110, 80], [190, 120], [270, 80], [350, 120], [430, 90]];
  const B2 = [[200, 300], [280, 250], [360, 290], [440, 240], [520, 280], [640, 250]];
  b += chain(A) + chain(B2);
  [[110, 80], [190, 120], [270, 80], [280, 250], [360, 290], [440, 240]].forEach(([x, y]) => (b += circ(x, y, 9, COL.red)));
  // Li on chain A
  b += ion(150, 108, { r: 13 });
  b += arc(160, 92, 236, 92, 34, COL.purple, 3) + head(236, 92, 0.9, COL.purple, 11);
  b += pill(240, 32, 34, 30, COL.purple, "①", { size: 17 });
  // intersegmental hop
  b += ion(320, 112, { r: 13 });
  b += `<path d="M330,128 Q380,190 352,262" fill="none" stroke="${COL.amber}" stroke-width="3.5" stroke-dasharray="7 5"/>` + head(352, 262, 1.75, COL.amber, 12);
  b += pill(386, 170, 34, 30, COL.amber, "②", { size: 17 });
  // whole chain moves
  b += ion(480, 262, { r: 13 });
  [[430, 322], [530, 312]].forEach(([x, y]) => (b += arrow(x, y, x + 60, y - 12, { color: COL.teal, width: 3, head: 11 })));
  b += pill(606, 300, 34, 30, COL.teal, "③", { size: 17 });
  // legend
  b += circ(30, 360, 9, COL.red) + text(46, 366, "醚氧 O", { size: 15, fill: COL.red, weight: "bold" });
  b += text(20, 30, "非晶 PEO（T > T_{g}）", { size: 18, weight: "bold" });
  return svg(W, H, b);
};

// ---------- SPE crystalline tunnels (Fig. 3c) ----------
figs.spe_cryst = () => {
  const W = 640, H = 330;
  let b = "";
  const tunnel = (y, arr) => {
    let s = "";
    const sin = (ph) => {
      const pts = [];
      for (let x = 20; x <= 620; x += 4) pts.push([x, y + 34 * Math.sin((x / 120) * 2 * Math.PI + ph)]);
      return `<path d="${pathOf(pts)}" fill="none" stroke="${COL.teal}" stroke-width="5"/>`;
    };
    s += sin(0) + sin(Math.PI);
    for (let k = 0; k < 10; k++) {
      const x = 20 + k * 60 + 15;
      s += circ(x, y + 34 * Math.sin((x / 120) * 2 * Math.PI), 7, COL.red);
    }
    [80, 200, 320, 440, 560].forEach((x) => (s += ion(x, y, { r: 11 })));
    if (arr) s += arrow(470, y + 60, 590, y + 60, { color: COL.purple, width: 3, head: 11 });
    return s;
  };
  b += tunnel(90, false);
  b += tunnel(240, true);
  [[110, 165], [260, 165], [410, 165], [560, 165]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="26" ry="15" fill="${COL.siDark}"/>` + text(x, y + 6, "X⁻", { size: 16, anchor: "middle", fill: "#FFFFFF", weight: "bold" })));
  b += text(20, 30, "结晶 PEO：链折叠成“隧道”，Li⁺ 在里面跳；阴离子 X⁻ 在隧道外", { size: 16, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Grain boundary + impedance ----------
figs.grain_boundary = () => {
  const W = 680, H = 420;
  let b = "";
  // grains (Voronoi-like polygons by hand)
  const polys = [
    "20,40 140,30 160,130 70,170 20,140",
    "140,30 270,40 260,140 160,130",
    "20,140 70,170 90,280 20,300",
    "70,170 160,130 200,250 90,280",
    "160,130 260,140 300,240 200,250",
    "20,300 90,280 140,370 20,380",
    "90,280 200,250 230,370 140,370",
    "200,250 300,240 300,370 230,370",
  ];
  const fills = ["#E8F4F3", "#DDEFF0", "#E3F1EF", "#D4EBE8", "#E8F4F3", "#DDEFF0", "#E3F1EF", "#D4EBE8"];
  polys.forEach((p, i) => (b += `<polygon points="${p}" fill="${fills[i]}" stroke="${COL.amber}" stroke-width="5" stroke-linejoin="round"/>`));
  b += `<polyline points="40,80 120,110 170,190 250,200 270,320" fill="none" stroke="${COL.purple}" stroke-width="3.5" stroke-dasharray="8 6"/>`;
  b += head(270, 320, 1.4, COL.purple, 13);
  b += ion(40, 80, { r: 11 });
  b += text(160, 405, "多晶片：晶粒（绿）+ 晶界（橙）", { size: 16, anchor: "middle", fill: COL.muted });
  // Nyquist plot
  const X0 = 360, Y0 = 330, X1 = 660;
  b += line(X0, Y0, X1, Y0, COL.ink, 2.5) + line(X0, Y0, X0, 120, COL.ink, 2.5);
  b += text((X0 + X1) / 2, Y0 + 28, "Z′（实部）", { size: 16, anchor: "middle", fill: COL.text2 });
  b += `<g transform="translate(${X0 - 14} 220) rotate(-90)">` + text(0, 0, "−Z″", { size: 16, anchor: "middle", fill: COL.text2 }) + `</g>`;
  b += `<path d="M${X0 + 10},${Y0} A60,60 0 0 1 ${X0 + 130},${Y0}" fill="none" stroke="${COL.teal}" stroke-width="5"/>`;
  b += `<path d="M${X0 + 130},${Y0} A60,60 0 0 1 ${X0 + 250},${Y0}" fill="none" stroke="${COL.amber}" stroke-width="5"/>`;
  b += text(X0 + 70, Y0 - 72, "晶粒", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X0 + 190, Y0 - 72, "晶界", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(X0 + 130, 60, "阻抗谱（Nyquist 图）示意", { size: 16, anchor: "middle", weight: "bold" });
  b += text(X0 + 130, 88, "两个半圆 = 两种电阻", { size: 16, anchor: "middle", fill: COL.text2 });
  b += text(X0 + 130, 395, "← 高频          低频 →", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Space-charge layer ----------
figs.space_charge = () => {
  const W = 680, H = 420;
  let b = "";
  const panel = (x0, buffer) => {
    let s = "";
    const w = 300, top = 70, bot = 320, mid = x0 + 130;
    s += rect(x0, top, 130, bot - top, COL.amberLight);
    s += rect(mid, top, w - 130, bot - top, COL.sulfurLight, { opacity: 0.6 });
    if (buffer) s += rect(mid - 8, top, 24, bot - top, COL.tealLight);
    s += text(x0 + 65, top - 12, "LiCoO_{2}", { size: 16, anchor: "middle", weight: "bold" });
    s += text(mid + 85, top - 12, "β-Li_{3}PS_{4}", { size: 16, anchor: "middle", weight: "bold" });
    // Li concentration profile
    let pts;
    if (!buffer) pts = [[x0, 190], [mid - 40, 190], [mid - 6, 120], [mid, 120], [mid + 6, 280], [mid + 60, 210], [x0 + w, 190]];
    else pts = [[x0, 190], [mid - 8, 190], [mid + 16, 190], [x0 + w, 190]];
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
    s += `<path d="${d}" fill="none" stroke="${COL.purple}" stroke-width="4.5" stroke-linejoin="round"/>`;
    if (!buffer) {
      s += text(mid - 20, 110, "Li⁺ 堆积", { size: 15, anchor: "end", weight: "bold", fill: COL.purple });
      s += text(mid + 26, 300, "Li⁺ 贫化 → 高电阻", { size: 15, weight: "bold", fill: COL.red });
    } else {
      s += text(mid + 4, 110, "LiNbO_{3}", { size: 15, anchor: "middle", weight: "bold", fill: COL.teal });
      s += text(x0 + w / 2, 300, "浓度平稳，通道顺畅", { size: 15, anchor: "middle", weight: "bold", fill: COL.teal });
    }
    s += text(x0 + 6, 178, "c_{Li}", { size: 15, fill: COL.purple, weight: "bold" });
    return s;
  };
  b += text(170, 24, "直接接触", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
  b += panel(20, false);
  b += text(510, 24, "加 LiNbO_{3} 缓冲层", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  b += panel(360, true);
  b += text(W / 2, 370, "紫线：Li⁺ 浓度随位置变化（示意）", { size: 15, anchor: "middle", fill: COL.muted });
  b += text(W / 2, 400, "氧化物正极 | 硫化物电解质：化学势不同 → Li⁺ 重新分布", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

module.exports = figs;
