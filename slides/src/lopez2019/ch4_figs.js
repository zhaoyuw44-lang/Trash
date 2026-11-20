// Figures for Lopez et al. 2019, Chapter 4 (Polymer design for electron transport)
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- local helpers ----------
// Smooth open path through points (Catmull-Rom -> cubic Bezier)
function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
// Wiggly chain between two points
function wig(x1, y1, x2, y2, o = {}) {
  const R = rng(o.seed || 1);
  const n = o.n || 8, amp = o.amp ?? 10;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = i === 0 || i === n ? 0 : (Math.sin(t * Math.PI * (o.waves || 2) + (o.phase || 0)) * amp + (R() - 0.5) * amp);
    pts.push([x1 + dx * t + px * a, y1 + dy * t + py * a]);
  }
  return `<path d="${smooth(pts)}" fill="none" stroke="${o.color || COL.teal}" stroke-width="${o.w || 4}" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
}
const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}/>`;

// Vertical chapter strip used on the roadmap slide
function chapterStrip(cur) {
  const W = 400, H = 470;
  const chs = ["引言与先进电池体系", "粘结剂与隔膜的力学", "锂离子传输", "电子传输", "化学相互作用", "稳定界面", "安全与展望"];
  let b = "";
  chs.forEach((c, i) => {
    const y = 10 + i * 66;
    const n = i + 1;
    const isCur = n === cur, past = n < cur;
    const fill = isCur ? COL.amber : past ? "#E3E7EB" : "#FFFFFF";
    b += rect(40, y, 350, 50, fill, { rx: 25, stroke: isCur ? COL.amber : COL.line, sw: 2 });
    b += circ(65, y + 25, 17, isCur ? "#FFFFFF" : past ? COL.muted : COL.ink);
    b += text(65, y + 32, String(n), { size: 18, anchor: "middle", weight: "bold", fill: isCur ? COL.amber : "#FFFFFF" });
    b += text(95, y + 32, c, { size: 19, weight: isCur ? "bold" : "normal", fill: isCur ? "#FFFFFF" : past ? COL.text2 : COL.ink });
    if (i < 6) b += line(65, y + 44, 65, y + 70, COL.line, 3);
  });
  b += head(28, 10 + (cur - 1) * 66 + 25, 0, COL.amber, 18);
  return svg(W, H, b);
}
figs.chapter_strip = () => chapterStrip(4);

const { electron } = L;
// atom label with white knockout
const atom = (x, y, t, col = COL.ink, size = 17) => circ(x, y, size * 0.62, "#FFFFFF") + text(x, y + size * 0.36, t, { size, anchor: "middle", weight: "bold", fill: col });
// regular polygon points; rot in degrees, pointing up when rot = -90
const poly = (cx, cy, r, n, rot = -90) => Array.from({ length: n }, (_, k) => { const a = ((rot + (k * 360) / n) * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const ringPath = (pts, col = COL.ink, w = 3) => `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/>`;
// inner double-bond line for edge i of polygon around centre
const dbl = (pts, i, cx, cy, col = COL.ink) => {
  const a = pts[i], b = pts[(i + 1) % pts.length];
  const s = 0.22, t = 0.18;
  const p = (q) => [q[0] + (cx - q[0]) * s, q[1] + (cy - q[1]) * s];
  const A = p(a), B = p(b);
  const ax = A[0] + (B[0] - A[0]) * t, ay = A[1] + (B[1] - A[1]) * t, bx = B[0] - (B[0] - A[0]) * t, by = B[1] - (B[1] - A[1]) * t;
  return line(ax.toFixed(1), ay.toFixed(1), bx.toFixed(1), by.toFixed(1), col, 3);
};
const bracket = (x, y1, y2, left) => `<polyline points="${x + (left ? 8 : -8)},${y1} ${x},${y1} ${x},${y2} ${x + (left ? 8 : -8)},${y2}" fill="none" stroke="${COL.ink}" stroke-width="2.5"/>`;

// zigzag conjugated chain with alternating double bonds
function conj(x0, y0, n, step = 26, amp = 14, col = COL.ink) {
  let s = "";
  const pts = [];
  for (let k = 0; k <= n; k++) pts.push([x0 + k * step, y0 + (k % 2 ? -amp : 0)]);
  for (let k = 0; k < n; k++) {
    const [x1, y1] = pts[k], [x2, y2] = pts[k + 1];
    s += line(x1, y1, x2, y2, col, 3);
    if (k % 2 === 0) {
      const dx = x2 - x1, dy = y2 - y1, L0 = Math.hypot(dx, dy);
      const ox = (-dy / L0) * 6 * (k % 4 === 0 ? 1 : 1), oy = (dx / L0) * 6;
      s += line((x1 + dx * 0.2 + ox).toFixed(1), (y1 + dy * 0.2 + oy).toFixed(1), (x2 - dx * 0.2 + ox).toFixed(1), (y2 - dy * 0.2 + oy).toFixed(1), col, 3);
    }
  }
  return s;
}

// ---------- Title motif ----------
figs.title_motif = () => {
  const W = 520, H = 520;
  let b = "";
  for (let r = 0; r < 3; r++) b += conj(40, 160 + r * 120, 16, 27, 22, r === 1 ? COL.amberLight : COL.tealLight);
  [[120, 268], [250, 262], [380, 268]].forEach(([x, y]) => (b += electron(x, y - 16, 16)));
  b += arrow(150, 236, 220, 236, { color: COL.amber, width: 4, head: 14 }) + arrow(280, 236, 350, 236, { color: COL.amber, width: 4, head: 14 });
  return svg(W, H, b);
};

// ---------- Timeline ----------
figs.cp_timeline = () => {
  const W = 1100, H = 400;
  const ev = [
    { year: "1862", who: ["Letheby"], what: ["电化学氧化", "苯胺得到“苯胺黑”"], color: COL.text2 },
    { year: "1963", who: ["Weiss 等"], what: ["碘掺杂", "聚吡咯导电"], color: COL.text2 },
    { year: "1977", who: ["白川英树、MacDiarmid", "Heeger"], what: ["掺杂聚乙炔"], color: COL.purple },
    { year: "1981", who: ["MacDiarmid 等"], what: ["聚乙炔用作", "电池电极"], color: COL.purple },
    { year: "~1988", who: ["Bayer 公司"], what: ["开发 PEDOT"], color: COL.text2 },
    { year: "2000", who: ["诺贝尔化学奖"], what: ["授予白川英树、", "MacDiarmid、Heeger"], color: COL.amber },
    { year: "2011", who: ["Liu 等"], what: ["定制能级的", "聚芴粘结剂（Si）"], color: COL.teal },
    { year: "2013", who: ["Li, Cui 等"], what: ["比较 PEDOT、PPy、", "PANi 包覆 S"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 200, left: 80, right: 1005, whoSize: 17, whatSize: 16, yearSize: 26 }));
};

// ---------- Conjugation & bands (Fig. 5a) ----------
figs.conjugation = () => {
  const W = 640, H = 440;
  let b = "";
  b += line(40, 330, 40, 30, COL.ink, 3) + head(40, 22, -Math.PI / 2, COL.ink, 13);
  b += `<g transform="translate(22 180) rotate(-90)">` + text(0, 0, "电子能量", { size: 17, anchor: "middle", weight: "bold" }) + `</g>`;
  const cx = [130, 310, 500];
  // ethylene
  b += line(cx[0] - 40, 70, cx[0] + 40, 70, COL.teal, 4) + line(cx[0] - 40, 270, cx[0] + 40, 270, COL.purple, 4);
  // hexatriene: three levels each
  [100, 122, 144].forEach((y) => (b += line(cx[1] - 40, y, cx[1] + 40, y, COL.teal, 4)));
  [196, 218, 240].forEach((y) => (b += line(cx[1] - 40, y, cx[1] + 40, y, COL.purple, 4)));
  // polymer bands
  b += rect(cx[2] - 50, 100, 100, 56, COL.tealLight, { rx: 4 }) + rect(cx[2] - 50, 184, 100, 56, COL.purpleLight, { rx: 4 });
  b += text(cx[2] + 60, 134, "导带", { size: 16, weight: "bold", fill: COL.teal });
  b += text(cx[2] + 60, 218, "价带", { size: 16, weight: "bold", fill: COL.purple });
  b += text(cx[0] - 46, 76, "LUMO", { size: 15, anchor: "end", fill: COL.teal, weight: "bold" });
  b += text(cx[0] - 46, 276, "HOMO", { size: 15, anchor: "end", fill: COL.purple, weight: "bold" });
  // gaps
  [[cx[0] + 56, 74, 266], [cx[1] + 56, 104, 236], [cx[2] - 66, 160, 180]].forEach(([x, y1, y2]) => {
    b += arrow(x, y1, x, y2, { color: COL.red, width: 2, head: 8 }) + arrow(x, y2, x, y1, { color: COL.red, width: 2, head: 8 });
  });
  b += text(cx[0] + 64, 175, "大", { size: 15, fill: COL.red, weight: "bold" });
  b += text(cx[1] + 64, 175, "变小", { size: 15, fill: COL.red, weight: "bold" });
  b += text(cx[2], 176, "最小", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  // structures
  b += conj(cx[0] - 13, 320, 1, 26, 14);
  b += conj(cx[1] - 65, 320, 5, 26, 14);
  b += bracket(cx[2] - 66, 296, 330, true) + conj(cx[2] - 52, 320, 4, 26, 14) + bracket(cx[2] + 66, 296, 330, false) + text(cx[2] + 74, 336, "n", { size: 15, fill: COL.ink, italic: true });
  b += text(cx[0], 372, "乙烯", { size: 17, anchor: "middle", weight: "bold" });
  b += text(cx[1], 372, "己三烯（3 个 C=C）", { size: 17, anchor: "middle", weight: "bold" });
  b += text(cx[2], 372, "聚乙炔（n 很大）", { size: 17, anchor: "middle", weight: "bold" });
  b += text(320, 420, "共轭越长，能级越密，最后连成“能带”，能隙变小", { size: 17, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Doping ----------
figs.doping = () => {
  const W = 680, H = 400;
  let b = "";
  const col = (x0, title, sub, mode) => {
    let s = rect(x0, 10, 210, 300, "#F7F9FB", { rx: 14 });
    s += rect(x0 + 50, 50, 110, 46, COL.tealLight, { rx: 4 }) + rect(x0 + 50, 190, 110, 46, COL.purpleLight, { rx: 4 });
    s += text(x0 + 105, 80, "LUMO / 导带", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
    s += text(x0 + 105, 262, "HOMO / 价带", { size: 15, anchor: "middle", fill: COL.purple, weight: "bold" });
    // electrons in HOMO
    const nh = mode === "p" ? 3 : 4;
    for (let k = 0; k < 4; k++) {
      const x = x0 + 66 + k * 26;
      if (k < nh) s += circ(x, 213, 8, COL.amber);
      else s += `<circle cx="${x}" cy="213" r="8" fill="#FFFFFF" stroke="${COL.red}" stroke-width="2.5"/>` + text(x, 219, "+", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
    }
    if (mode === "n") s += circ(x0 + 80, 64, 8, COL.amber);
    if (mode === "p") s += arrow(x0 + 144, 200, x0 + 185, 150, { color: COL.red, width: 3, head: 11 }) + ion(x0 + 182, 128, { r: 15, fill: COL.red, label: "−" });
    if (mode === "n") s += arrow(x0 + 185, 30, x0 + 98, 58, { color: COL.amber, width: 3, head: 11 }) + ion(x0 + 182, 140, { r: 15, fill: COL.purple, label: "+" });
    s += text(x0 + 105, 340, title, { size: 18, anchor: "middle", weight: "bold" });
    s += text(x0 + 105, 366, sub, { size: 15, anchor: "middle", fill: COL.text2 });
    return s;
  };
  b += col(10, "中性", "能隙中没有载流子", "0");
  b += col(235, "p 型掺杂 = 氧化", "取走电子，留下空穴", "p");
  b += col(460, "n 型掺杂 = 还原", "塞进电子", "n");
  b += text(340, 394, "红色 − = 平衡电荷的阴离子；紫色 + = Li^{+} 等阳离子", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Four conductive polymers (Fig. 5e) ----------
figs.cp_structures = () => {
  const W = 680, H = 470;
  let b = "";
  const card = (x, y, name, use, col) => rect(x, y, 330, 225, "#F7F9FB", { rx: 14 }) + text(x + 165, y + 190, name, { size: 18, anchor: "middle", weight: "bold", fill: col }) + text(x + 165, y + 213, use, { size: 15, anchor: "middle", fill: COL.text2 });
  b += card(5, 5, "聚芴 Polyfluorene", "用于 Si", COL.teal);
  b += card(345, 5, "PEDOT", "用于 Si 或 S", COL.purple);
  b += card(5, 240, "聚苯胺 PANi", "用于 S", "#A35A12");
  b += card(345, 240, "聚吡咯 PPy", "用于 S", COL.siDark);
  // polyfluorene
  {
    const r = 26, cy = 110, cx = 170, a = 1.366 * r;
    const Lh = poly(cx - a, cy, r, 6, -90), Rh = poly(cx + a, cy, r, 6, -90);
    b += ringPath(Lh) + ringPath(Rh);
    b += dbl(Lh, 3, cx - a, cy) + dbl(Lh, 5, cx - a, cy) + dbl(Rh, 1, cx + a, cy) + dbl(Rh, 3, cx + a, cy);
    // five ring: Lh[0]?? vertices: index0 top, 1 upper-right, 2 lower-right, 3 bottom, 4 lower-left, 5 upper-left
    const c9 = [cx, cy - 0.5 * r - 0.866 * r];
    b += line(Lh[1][0], Lh[1][1], c9[0], c9[1], COL.ink, 3) + line(Rh[5][0], Rh[5][1], c9[0], c9[1], COL.ink, 3) + line(Lh[2][0], Lh[2][1], Rh[4][0], Rh[4][1], COL.ink, 3);
    b += line(c9[0], c9[1], c9[0] - 18, c9[1] - 20, COL.ink, 2.5) + line(c9[0], c9[1], c9[0] + 18, c9[1] - 20, COL.ink, 2.5);
    b += text(c9[0] - 24, c9[1] - 24, "R", { size: 15, anchor: "end", weight: "bold", fill: COL.teal }) + text(c9[0] + 24, c9[1] - 24, "R", { size: 15, weight: "bold", fill: COL.teal });
    b += line(Lh[4][0], Lh[4][1], Lh[4][0] - 30, Lh[4][1] + 12, COL.ink, 3) + line(Rh[2][0], Rh[2][1], Rh[2][0] + 30, Rh[2][1] + 12, COL.ink, 3);
    b += bracket(Lh[4][0] - 22, 70, 160, true) + bracket(Rh[2][0] + 22, 70, 160, false) + text(Rh[2][0] + 30, 166, "n", { size: 15, italic: true });
  }
  // PEDOT
  {
    const cx = 510, cy = 120, r = 28;
    const P = poly(cx, cy, r, 5, 90); // vertex 0 at bottom (S)
    b += ringPath(P) + dbl(P, 1, cx, cy) + dbl(P, 3, cx, cy);
    // P indices: 0 bottom(S), 1 lower-left, 2 upper-left, 3 upper-right, 4 lower-right
    const O1 = [P[2][0] - 10, P[2][1] - 30], O2 = [P[3][0] + 10, P[3][1] - 30];
    b += line(P[2][0], P[2][1], O1[0], O1[1], COL.ink, 3) + line(P[3][0], P[3][1], O2[0], O2[1], COL.ink, 3);
    b += line(O1[0], O1[1], O1[0] + 10, O1[1] - 30, COL.ink, 3) + line(O2[0], O2[1], O2[0] - 10, O2[1] - 30, COL.ink, 3) + line(O1[0] + 10, O1[1] - 30, O2[0] - 10, O2[1] - 30, COL.ink, 3);
    b += atom(O1[0], O1[1], "O", COL.red) + atom(O2[0], O2[1], "O", COL.red) + atom(P[0][0], P[0][1], "S", COL.sulfur);
    b += line(P[1][0], P[1][1], P[1][0] - 34, P[1][1] + 6, COL.ink, 3) + line(P[4][0], P[4][1], P[4][0] + 34, P[4][1] + 6, COL.ink, 3);
    b += bracket(P[1][0] - 26, 50, 165, true) + bracket(P[4][0] + 26, 50, 165, false) + text(P[4][0] + 34, 171, "n", { size: 15, italic: true });
  }
  // PANi
  {
    const cx = 140, cy = 350, r = 28;
    const Hx = poly(cx, cy, r, 6, 0); // flat orientation: vertex 0 at right
    b += ringPath(Hx) + dbl(Hx, 0, cx, cy) + dbl(Hx, 2, cx, cy) + dbl(Hx, 4, cx, cy);
    b += line(Hx[3][0], Hx[3][1], Hx[3][0] - 34, cy, COL.ink, 3);
    b += line(Hx[0][0], Hx[0][1], Hx[0][0] + 34, cy, COL.ink, 3);
    b += atom(Hx[0][0] + 46, cy, "N", "#3A62B5") + text(Hx[0][0] + 46, cy - 18, "H", { size: 15, anchor: "middle", fill: COL.text2 });
    b += line(Hx[0][0] + 58, cy, Hx[0][0] + 84, cy, COL.ink, 3);
    b += bracket(Hx[3][0] - 26, 300, 400, true) + bracket(Hx[0][0] + 78, 300, 400, false) + text(Hx[0][0] + 86, 406, "n", { size: 15, italic: true });
  }
  // PPy
  {
    const cx = 510, cy = 340, r = 28;
    const P = poly(cx, cy, r, 5, 90);
    b += ringPath(P) + dbl(P, 1, cx, cy) + dbl(P, 3, cx, cy);
    b += atom(P[0][0], P[0][1], "N", "#3A62B5") + text(P[0][0], P[0][1] + 30, "H", { size: 15, anchor: "middle", fill: COL.text2 });
    b += line(P[1][0], P[1][1], P[1][0] - 40, P[1][1] + 6, COL.ink, 3) + line(P[4][0], P[4][1], P[4][0] + 40, P[4][1] + 6, COL.ink, 3);
    b += bracket(P[1][0] - 32, 290, 400, true) + bracket(P[4][0] + 32, 290, 400, false) + text(P[4][0] + 40, 406, "n", { size: 15, italic: true });
  }
  return svg(W, H, b);
};

// ---------- Conductivity scale ----------
figs.sigma_scale = () => {
  const W = 1000, H = 360;
  let b = "";
  const X = (lg) => 70 + (lg + 16) * 39;
  const y0 = 300;
  b += line(X(-16), y0, X(6.3), y0, COL.ink, 3) + head(X(6.3) + 8, y0, 0, COL.ink, 13);
  for (let k = -16; k <= 6; k += 2) {
    b += line(X(k), y0, X(k), y0 + 8, COL.ink, 2);
    b += text(X(k), y0 + 30, `10^{${k}}`, { size: 16, anchor: "middle", fill: COL.text2 });
  }
  b += text(X(6.3), y0 + 56, "电导率 σ（S cm^{−1}）", { size: 16, anchor: "end", weight: "bold" });
  const row = (y, lo, hi, label, col, note) => {
    let s = "";
    if (lo === hi) s += circ(X(lo), y, 10, col);
    else s += rect(X(lo), y - 11, X(hi) - X(lo), 22, col, { rx: 11 });
    s += text(hi > 0 ? X(lo) - 12 : X(hi) + 14, y + 6, label, { size: 17, weight: "bold", fill: col, anchor: hi > 0 ? "end" : "start" });
    return s;
  };
  // insulator zone / semiconductor / metal shading
  b += rect(X(-16), 20, X(-8) - X(-16), 262, "#F1F3F5", { rx: 0 }) + rect(X(2.5), 20, X(6.3) - X(2.5), 262, "#FDF2E7", { rx: 0 });
  b += text(X(-12), 44, "绝缘体", { size: 16, anchor: "middle", fill: COL.muted, weight: "bold" });
  b += text(X(4.4), 44, "金属", { size: 16, anchor: "middle", fill: "#A35A12", weight: "bold" });
  b += row(80, -16, -16, "PE、PVDF 等普通高分子（≤ 10^{−14}）", COL.siDark);
  b += row(120, -5.4, -5.4, "本征 Si（≈ 4×10^{−6}）", COL.si);
  b += row(160, -6, -2, "聚芴粘结剂", COL.teal);
  b += row(200, 0, 2, "PANi", "#A35A12");
  b += row(230, Math.log10(4), Math.log10(200), "PPy", COL.siDark);
  b += row(262, 0, Math.log10(4000), "PEDOT", COL.purple);
  b += row(120, 5.78, 5.78, "Cu（≈ 6×10^{5}）", COL.copper);
  b += lines(X(-15.8), 165, ["← 硫 S ≈ 5×10^{−30}", "（远在图外）"], { size: 16, fill: COL.sulfur, weight: "bold", lh: 21 });
  return svg(W, H, b);
};

// ---------- Electrode architectures (Fig. 5b) ----------
figs.electrode_compare = () => {
  const W = 680, H = 370;
  let b = "";
  const panel = (x0, conductive) => {
    let s = "";
    s += blob(x0 + 160, 160, 140, conductive ? 41 : 40, { fill: conductive ? COL.purpleLight : "#BFE3C8", jag: 0.08, n: 14 });
    const parts = [[-70, -60, 42], [20, -75, 38], [90, -10, 36], [-80, 30, 40], [10, 40, 44], [75, 85, 30], [-30, 100, 30]];
    parts.forEach(([dx, dy, r], i) => (s += blob(x0 + 160 + dx, 160 + dy, r, 60 + i, { fill: "#5E6B78", stroke: "#3E4A55", sw: 2, jag: 0.12 })));
    if (!conductive) {
      const R = rng(7);
      for (let k = 0; k < 22; k++) s += circ((x0 + 90 + R() * 150).toFixed(1), (90 + R() * 150).toFixed(1), 9, "#2B2F33");
    }
    // electron path (red) and Li+ path (blue)
    const ep = conductive ? [[x0 + 30, 330], [x0 + 110, 270], [x0 + 150, 200], [x0 + 185, 120]] : [[x0 + 30, 330], [x0 + 95, 275], [x0 + 80, 225], [x0 + 130, 200], [x0 + 110, 150], [x0 + 160, 120]];
    s += `<path d="${smooth(ep)}" fill="none" stroke="${COL.red}" stroke-width="4"/>` + head(ep[ep.length - 1][0], ep[ep.length - 1][1], -1.0, COL.red, 13);
    s += text(x0 + 30, 355, "e^{−}", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
    s += `<path d="M ${x0 + 300} 20 Q ${x0 + 230} 30 ${x0 + 185} 105" fill="none" stroke="#2E86C1" stroke-width="4"/>` + head(x0 + 185, 105, 2.0, "#2E86C1", 13);
    s += text(x0 + 300, 20, "Li^{+}", { size: 17, weight: "bold", fill: "#2E86C1" });
    return s;
  };
  b += panel(10, false) + panel(350, true);
  return svg(W, H, b);
};

// ---------- Backbone vs side chain (Fig. 5c) ----------
figs.backbone_side = () => {
  const W = 640, H = 380;
  let b = "";
  const ys = 190;
  [30, 150, 270].forEach((x, i) => {
    b += rect(x, ys - 28, 100, 56, COL.si, { rx: 14 });
    if (i < 2) b += line(x + 100, ys, x + 120, ys, COL.ink, 4);
    b += rect(x + 15, ys - 150, 24, 122, COL.amberLight, { rx: 12, stroke: COL.amber, sw: 1.5 });
    b += rect(x + 62, ys + 28, 24, 122, COL.amberLight, { rx: 12, stroke: COL.amber, sw: 1.5 });
  });
  b += text(200, ys + 7, "主链", { size: 17, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += lines(410, 60, ["侧链 Side chain", "· 调节能级", "· 提高溶解性", "· 提供功能相互作用"], { size: 17, fill: "#A35A12", weight: "bold", lh: 26 });
  b += lines(410, 250, ["主链", "· 决定能级", "· 提供导电通路"], { size: 17, fill: COL.siDark, weight: "bold", lh: 26 });
  return svg(W, H, b);
};

// ---------- Side groups (Fig. 5d) ----------
figs.side_groups = () => {
  const W = 640, H = 420;
  let b = "";
  const card = (x, y, title, sub, col) => rect(x, y, 305, 195, "#F7F9FB", { rx: 14 }) + text(x + 16, y + 32, title, { size: 18, weight: "bold", fill: col }) + text(x + 16, y + 58, sub, { size: 15, fill: COL.text2 });
  b += card(5, 5, "烷基侧链", "在弱极性溶剂中溶解更好", COL.siDark);
  b += card(330, 5, "吸电子基团", "降低能级（LUMO 下移）", COL.red);
  b += card(5, 215, "寡聚醚侧链", "在强极性溶剂中溶解更好", COL.purple);
  b += card(330, 215, "给电子基团", "抬高能级", COL.teal);
  // alkyl zigzag
  let z = "M40,150";
  for (let k = 1; k <= 9; k++) z += ` L${40 + k * 26},${k % 2 ? 132 : 150}`;
  b += `<path d="${z}" fill="none" stroke="${COL.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  // oligoether zigzag with O
  let z2 = "M40,360";
  const os = [];
  for (let k = 1; k <= 9; k++) { const x = 40 + k * 26, y = k % 2 ? 342 : 360; z2 += ` L${x},${y}`; if (k % 3 === 0) os.push([x, y]); }
  b += `<path d="${z2}" fill="none" stroke="${COL.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  os.forEach(([x, y]) => (b += atom(x, y, "O", COL.red, 16)));
  // EWG: ketone and amide
  const carbonyl = (x, y, tail, tailCol) => {
    let s = line(x - 40, y, x, y, COL.ink, 3) + line(x, y, x, y - 34, COL.ink, 3) + line(x + 6, y, x + 6, y - 34, COL.ink, 3) + atom(x + 3, y - 44, "O", COL.red, 16);
    s += line(x, y, x + 30, y + 18, COL.ink, 3) + text(x + 36, y + 30, tail, { size: 16, weight: "bold", fill: tailCol });
    return s;
  };
  b += carbonyl(410, 150, "R", COL.ink) + carbonyl(530, 150, "NHR", "#3A62B5");
  // EDG: ether OR and ester O-C(=O)R
  b += line(370, 360, 410, 360, COL.ink, 3) + text(416, 366, "–OR", { size: 18, weight: "bold", fill: COL.red });
  b += line(490, 360, 515, 360, COL.ink, 3) + atom(527, 360, "O", COL.red, 16) + line(539, 360, 565, 360, COL.ink, 3) + line(565, 360, 565, 326, COL.ink, 3) + line(571, 360, 571, 326, COL.ink, 3) + atom(568, 316, "O", COL.red, 16) + line(565, 360, 590, 378, COL.ink, 3) + text(596, 390, "R", { size: 16, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Energy-level alignment ----------
figs.level_align = () => {
  const W = 640, H = 500;
  let b = "";
  const Y = (v) => 440 - v * 85; // potential vs Li, 0..4 V upward
  b += line(150, Y(0) + 10, 150, Y(4.3), COL.ink, 3) + head(150, Y(4.3) - 8, -Math.PI / 2, COL.ink, 13);
  for (let v = 0; v <= 4; v++) {
    b += line(142, Y(v), 150, Y(v), COL.ink, 2) + text(136, Y(v) + 6, `${v} V`, { size: 16, anchor: "end", fill: COL.text2 });
    b += text(70, Y(v) + 6, `${(-1.4 - v).toFixed(1)}`, { size: 16, anchor: "end", fill: COL.muted });
  }
  b += text(150, 34, "电位 vs Li/Li^{+}", { size: 16, anchor: "middle", weight: "bold" });
  b += text(48, 34, "能量 / eV", { size: 15, anchor: "middle", fill: COL.muted, weight: "bold" });
  // zones
  b += rect(170, Y(1), 200, Y(0.01) - Y(1), "#DCE3E9", { rx: 6 });
  b += text(270, Y(0.5) + 6, "Si 工作区 0.01–1 V", { size: 17, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += rect(170, Y(3), 200, Y(2) - Y(3), COL.sulfurLight, { rx: 6 });
  b += text(270, Y(2.5) + 6, "S 工作区 2–3 V", { size: 17, anchor: "middle", weight: "bold", fill: "#8A6A00" });
  // polymer requirement
  b += line(390, Y(1.15), 600, Y(1.15), COL.purple, 4, "8 6");
  b += lines(395, Y(1.15) - 36, ["理想 Si 粘结剂：在约 1 V 以上", "就被 n 掺杂（LUMO 足够低）"], { size: 16, fill: COL.purple, weight: "bold", lh: 21 });
  b += arrow(495, Y(1.15) + 8, 495, Y(0.15), { color: COL.purple, width: 3, head: 12 });
  b += lines(505, Y(0.6), ["整个 Si 工作区", "保持导电"], { size: 15, fill: COL.purple, lh: 19 });
  b += lines(395, Y(3.55), ["S 正极：电位高，", "对能级的要求不同"], { size: 16, fill: "#8A6A00", weight: "bold", lh: 21 });
  b += text(320, 488, "左列能量以真空为 0：电位越高 ↔ 电子能量越低", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Sulfur particle coated by conductive polymer ----------
figs.s_coating = () => {
  const W = 620, H = 390;
  let b = "";
  b += `<circle cx="230" cy="190" r="150" fill="${COL.purpleLight}"/>`;
  b += `<circle cx="230" cy="190" r="122" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="3"/>`;
  b += text(230, 182, "S / Li_{2}S", { size: 22, anchor: "middle", weight: "bold", fill: "#8A6A00" });
  b += text(230, 210, "几乎不导电", { size: 16, anchor: "middle", fill: "#8A6A00" });
  // electrons running in the shell
  const R = 136;
  [200, 240, 280, 320].forEach((deg, i) => {
    const a = (deg * Math.PI) / 180;
    b += electron(230 + R * Math.cos(a), 190 + R * Math.sin(a), 12);
  });
  b += `<path d="M ${230 + R * Math.cos(3.3)} ${190 + R * Math.sin(3.3)} A ${R} ${R} 0 0 1 ${230 + R * Math.cos(5.8)} ${190 + R * Math.sin(5.8)}" fill="none" stroke="${COL.amber}" stroke-width="3" stroke-dasharray="6 6"/>`;
  // polysulfide trying to escape
  b += `<circle cx="300" cy="260" r="12" fill="${COL.sulfur}"/><circle cx="318" cy="272" r="12" fill="${COL.sulfur}"/><circle cx="336" cy="284" r="12" fill="${COL.sulfur}"/>`;
  b += arrow(345, 292, 372, 310, { color: COL.red, width: 3, head: 11 }) + cross(392, 322, 11);
  b += lines(410, 95, ["导电高分子壳", "· 给电子铺路", "· 挡住多硫化物（部分）", "· 缓冲体积变化"], { size: 17, fill: COL.purple, weight: "bold", lh: 26 });
  b += lines(410, 300, ["Li_{2}S_{x} 想溶出来"], { size: 16, fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Processing tricks ----------
figs.processing = () => {
  const W = 760, H = 340;
  let b = "";
  b += rect(5, 5, 370, 280, "#F7F9FB", { rx: 14 }) + rect(385, 5, 370, 280, "#F7F9FB", { rx: 14 });
  b += text(190, 36, "① 吡啶“拐点”打断共轭", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  // straight rigid chain of rings
  for (let k = 0; k < 5; k++) b += ringPath(poly(55 + k * 62, 90, 22, 6, 0), COL.siDark, 3) + (k < 4 ? line(77 + k * 62, 90, 95 + k * 62, 90, COL.siDark, 3) : "");
  b += text(190, 135, "全共轭：刚、难溶", { size: 16, anchor: "middle", fill: COL.text2 });
  // kinked chain
  const pts = [[60, 215], [118, 200], [176, 223], [234, 175], [292, 200]];
  pts.forEach(([x, y], k) => {
    b += ringPath(poly(x, y, 22, 6, 0), k === 2 ? COL.teal : COL.siDark, 3);
    if (k === 2) b += atom(x + 11, y + 19, "N", "#3A62B5", 15);
    if (k < 4) b += line(x + 20, y + (pts[k + 1][1] - y) * 0.2, pts[k + 1][0] - 20, pts[k + 1][1] - (pts[k + 1][1] - y) * 0.2, COL.siDark, 3);
  });
  b += text(190, 274, "加入吡啶：更柔、更易溶", { size: 16, anchor: "middle", fill: COL.teal, weight: "bold" });
  // m-cresol swelling
  b += text(570, 36, "② 间甲酚溶胀 PANi", { size: 18, anchor: "middle", weight: "bold", fill: "#A35A12" });
  b += `<path d="${smooth([[420, 150], [450, 100], [490, 140], [455, 175], [430, 130], [470, 110], [500, 160], [470, 190]])}" fill="none" stroke="#A35A12" stroke-width="4"/>`;
  b += text(460, 230, "卷曲的链", { size: 16, anchor: "middle", fill: COL.text2 });
  b += arrow(530, 145, 590, 145, { color: COL.ink, width: 3, head: 12 }) + text(560, 128, "m-cresol", { size: 15, anchor: "middle", fill: COL.text2 });
  b += wig(605, 120, 735, 175, { seed: 5, amp: 6, n: 8, waves: 3, color: "#A35A12", w: 4 });
  b += lines(670, 220, ["舒展的链", "与 C–S 混合更均匀"], { size: 16, anchor: "middle", fill: "#A35A12", weight: "bold", lh: 21 });
  b += text(380, 325, "目的相同：让导电高分子用得更少、分散得更好", { size: 17, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Design map ----------
figs.design_map = () => {
  const W = 640, H = 430;
  let b = "";
  // central chain
  [200, 290, 380].forEach((x, i) => {
    b += rect(x, 195, 80, 44, COL.si, { rx: 12 });
    if (i < 2) b += line(x + 80, 217, x + 90, 217, COL.ink, 4);
    b += rect(x + 30, i % 2 ? 239 : 117, 20, 78, COL.amberLight, { rx: 10, stroke: COL.amber, sw: 1.5 });
  });
  b += text(320, 224, "主链", { size: 17, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(262, 150, "侧链", { size: 16, weight: "bold", fill: "#A35A12" });
  const box = (x, y, w, t, sub, col) => rect(x, y, w, 70, "#FFFFFF", { rx: 14, stroke: col, sw: 3 }) + text(x + w / 2, y + 30, t, { size: 18, anchor: "middle", weight: "bold", fill: col }) + text(x + w / 2, y + 56, sub, { size: 15, anchor: "middle", fill: COL.text2 });
  b += box(10, 20, 230, "能级匹配", "与 Si / S 的工作电位相容", COL.purple);
  b += box(400, 20, 230, "电子传输快", "共轭、掺杂、连续通路", COL.red);
  b += box(205, 340, 230, "力学相容", "粘得住、跟得上体积变化", COL.teal);
  b += arrow(230, 195, 170, 92, { color: COL.purple, width: 3, head: 12 });
  b += arrow(410, 195, 470, 92, { color: COL.red, width: 3, head: 12 });
  b += arrow(320, 320, 320, 336, { color: COL.teal, width: 3, head: 12 });
  return svg(W, H, b);
};

module.exports = figs;
