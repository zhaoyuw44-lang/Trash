// Figures for Lopez et al. 2019, Chapter 5 (Designing interactions in polymers)
// Canvas widths are ~100 px per inch of the slide area they occupy, so 16 px text ≈ 11.5 pt.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- local helpers ----------
// Zig-zag backbone from (x1,y) to (x2,y)
function zig(x1, x2, y, o = {}) {
  const step = o.step || 22, amp = o.amp || 8;
  let d = `M${x1},${y}`;
  let k = 0;
  for (let x = x1 + step; x <= x2 + 0.1; x += step) d += ` L${x},${y + (k++ % 2 ? amp : -amp)}`;
  return `<path d="${d}" fill="none" stroke="${o.color || COL.teal}" stroke-width="${o.w || 5}" stroke-linejoin="round" stroke-linecap="round"/>`;
}
// Atom bubble with a label
function atom(x, y, r, fill, label, o = {}) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="2"` : ""}/>` +
    (label ? text(x, y + r * 0.38, label, { size: o.size || Math.round(r * 1.05), anchor: "middle", weight: "bold", fill: o.color || "#FFFFFF" }) : "");
}
const S_ = (x, y, r = 11) => atom(x, y, r, COL.sulfur, "", {});
const LI = (x, y, r = 16) => atom(x, y, r, COL.purple, "Li", { size: 17 });
// Polysulfide chain: Li – S…S – Li, horizontal, returns {svg, ends}
function polysulfide(x, y, n, o = {}) {
  const r = o.r || 11, sp = o.sp || 22;
  let s = "";
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(x + i * sp);
  // bonds
  s += `<polyline points="${xs.map((xx, i) => `${xx},${y + (i % 2 ? 6 : -6)}`).join(" ")}" fill="none" stroke="#A67C00" stroke-width="3"/>`;
  xs.forEach((xx, i) => (s += S_(xx, y + (i % 2 ? 6 : -6), r)));
  if (o.li !== false) {
    s += `<line x1="${x - sp}" y1="${y}" x2="${x}" y2="${y}" stroke="#A67C00" stroke-width="3"/>`;
    s += `<line x1="${xs[n - 1]}" y1="${y}" x2="${xs[n - 1] + sp}" y2="${y}" stroke="#A67C00" stroke-width="3"/>`;
    s += LI(x - sp - 4, y) + LI(xs[n - 1] + sp + 4, y);
  }
  return s;
}
function hexagon(cx, cy, r, o = {}) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${o.fill || "none"}" stroke="${o.stroke || COL.ink}" stroke-width="${o.w || 3}" stroke-linejoin="round"/>`;
}
const dash = (x1, y1, x2, y2, c = COL.purple, w = 2.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-dasharray="5 4" stroke-linecap="round"/>`;

// ---------- Title motif ----------
figs.title_motif = () => {
  const W = 520, H = 560;
  let b = "";
  // Si particle with oxide shell
  b += blob(330, 410, 112, 4, { fill: "#56636F", stroke: "#C9D2DA", sw: 10, jag: 0.08 });
  // polymer chain
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    pts.push([40 + t * 440, 240 + Math.sin(t * Math.PI * 1.6) * 70 + (i % 2 ? 10 : -10)]);
  }
  b += `<polyline points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${COL.tealLight}" stroke-width="6" stroke-linejoin="round"/>`;
  // pendant groups: N / O / S on the upper side, H-bond to Si below
  const pend = [[2, COL.teal], [5, COL.red], [8, COL.sulfur], [11, COL.red], [14, COL.teal]];
  pend.forEach(([i, c], k) => {
    const [x, y] = pts[i];
    const up = k < 3;
    const py = up ? y - 34 : y + 34;
    b += `<line x1="${x}" y1="${y}" x2="${x}" y2="${py}" stroke="${COL.tealLight}" stroke-width="5"/>`;
    b += `<circle cx="${x}" cy="${py}" r="13" fill="${c}" stroke="#FFFFFF" stroke-width="2.5"/>`;
  });
  // polysulfide chain grabbed by the first three pendants
  const sy = 92;
  const sx = [pts[2][0], pts[5][0], pts[8][0]];
  for (let i = 0; i < 7; i++) {
    const x = sx[0] - 10 + i * ((sx[2] - sx[0] + 20) / 6);
    b += `<circle cx="${x.toFixed(1)}" cy="${sy + (i % 2 ? 10 : -10)}" r="15" fill="${COL.sulfur}" stroke="#FFFFFF" stroke-width="2"/>`;
  }
  b += `<circle cx="${sx[0] - 46}" cy="${sy}" r="14" fill="${COL.purple}" stroke="#FFFFFF" stroke-width="2.5"/>`;
  b += `<circle cx="${sx[2] + 46}" cy="${sy}" r="14" fill="${COL.purple}" stroke="#FFFFFF" stroke-width="2.5"/>`;
  sx.forEach((x, k) => {
    const py = pts[[2, 5, 8][k]][1] - 48;
    b += `<line x1="${x}" y1="${py}" x2="${x}" y2="${sy + 24}" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 5"/>`;
  });
  // H-bonds to Si
  [11, 14].forEach((i) => {
    const [x, y] = pts[i];
    b += `<line x1="${x}" y1="${y + 48}" x2="${x}" y2="${y + 96}" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 5"/>`;
  });
  return svg(W, H, b);
};

// ---------- History timeline (S and Si) ----------
figs.hist_timeline = () => {
  const W = 1240, H = 420;
  const S = COL.sulfur, T = COL.teal;
  const ev = [
    { year: "2007", who: ["Li, Lewis & Dahn"], what: ["CMC 用作", "Si 粘结剂"], color: T },
    { year: "2007", who: ["Lestriez 等"], what: ["CMC 与 Si 表面", "的结合机理"], color: T },
    { year: "2010", who: ["Magasinski 等"], what: ["PAA 粘结剂"], color: T },
    { year: "2011", who: ["Kovalenko 等"], what: ["海藻酸钠", "（来自褐藻）"], color: T },
    { year: "2013", who: ["Seh, Cui 等"], what: ["含 N/O 粘结剂", "吸附 Li_{2}S_{x}"], color: S },
    { year: "2014", who: ["Huang 等"], what: ["Nafion 涂层隔膜", "“离子屏障”"], color: S },
    { year: "2016", who: ["Je 等"], what: ["苯并噁嗪", "原位硫化"], color: S },
    { year: "2017", who: ["Tsao, Bao 等"], what: ["吡啶高分子", "高载量 S 正极"], color: S },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 90, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Fig. 6a: three polysulfide-trapping strategies ----------
figs.ps_strategies = () => {
  const W = 1230, H = 360;
  let b = "";
  const pw = 390, gap = 30;
  const titles = ["① 配位 Li–N / Li–O / Li–S", "② 离子结合 Ionic binding", "③ 硫化交联 Vulcanization"];
  const foot = ["次级作用，强度 ~1–2 eV", "带正电的高分子吸住 S_{x}^{2−}", "S 与高分子共价连接"];
  const cols = [COL.teal, COL.amber, COL.sulfur];
  for (let k = 0; k < 3; k++) {
    const x0 = k * (pw + gap);
    b += `<rect x="${x0}" y="0" width="${pw}" height="${H}" rx="16" fill="#F5F7F9"/>`;
    b += pill(x0 + 20, 16, pw - 40, 38, k === 2 ? "#A67C00" : cols[k], titles[k], { size: 18 });
    b += text(x0 + pw / 2, H - 18, foot[k], { size: 17, anchor: "middle", fill: COL.text2, weight: "bold" });
  }
  // panel 1: coordination
  {
    const x0 = 0, by = 250;
    b += zig(x0 + 30, x0 + 360, by);
    const P = [[x0 + 74, COL.teal, "N"], [x0 + 184, COL.red, "O"], [x0 + 294, "#A67C00", "S"]];
    P.forEach(([x, c, l]) => {
      b += `<line x1="${x}" y1="${by - 8}" x2="${x}" y2="${by - 44}" stroke="${COL.teal}" stroke-width="4"/>`;
      b += atom(x, by - 56, 15, c, l, { size: 16 });
    });
    b += polysulfide(x0 + 120, 128, 6, { sp: 24 });
    // coordination dashes Li -> N/O ; S...S
    b += dash(x0 + 92, 140, x0 + 77, by - 72, COL.purple, 3);
    b += dash(x0 + 1 + 120 + 5 * 24 + 28, 140, x0 + 192, by - 72, COL.purple, 3);
    b += dash(x0 + 288, 140, x0 + 294, by - 72, "#A67C00", 3);
  }
  // panel 2: ionic
  {
    const x0 = pw + gap, by = 250;
    b += zig(x0 + 30, x0 + 360, by, { color: COL.teal });
    [80, 150, 220, 290].forEach((dx) => {
      b += `<line x1="${x0 + dx}" y1="${by - 8}" x2="${x0 + dx}" y2="${by - 34}" stroke="${COL.teal}" stroke-width="4"/>`;
      b += atom(x0 + dx, by - 48, 15, COL.amber, "+", { size: 22 });
    });
    b += polysulfide(x0 + 120, 130, 6, { sp: 24, li: false });
    b += atom(x0 + 108, 100, 16, COL.red, "−", { size: 22 });
    b += atom(x0 + 120 + 5 * 24 + 12, 100, 16, COL.red, "−", { size: 22 });
    [150, 220].forEach((dx) => (b += arrow(x0 + dx, by - 68, x0 + dx, 150, { color: COL.amber, width: 2.5, head: 10, dash: "5 4" })));
  }
  // panel 3: vulcanization
  {
    const x0 = 2 * (pw + gap);
    b += zig(x0 + 30, x0 + 360, 112);
    b += zig(x0 + 30, x0 + 360, 262);
    [100, 200, 300].forEach((dx, j) => {
      const n = 4 + (j % 2);
      const y1 = 124, y2 = 250;
      const step = (y2 - y1) / (n + 1);
      b += `<line x1="${x0 + dx}" y1="${y1}" x2="${x0 + dx}" y2="${y2}" stroke="#A67C00" stroke-width="3"/>`;
      for (let i = 1; i <= n; i++) b += S_(x0 + dx + (i % 2 ? 6 : -6), y1 + i * step, 11);
    });
  }
  return svg(W, H, b);
};

// ---------- Lewis acid-base picture of Li–X binding ----------
figs.lewis = () => {
  const W = 700, H = 440;
  let b = "";
  // pyridine-like ring, N on the right vertex
  const cx = 120, cy = 220, r = 52;
  b += hexagon(cx, cy, r, { stroke: COL.ink, w: 4 });
  const nx = cx + r * Math.cos(0), ny = cy; // not a vertex with this orientation; use dedicated N
  const vN = [cx + r * Math.cos(-Math.PI / 6), cy + r * Math.sin(-Math.PI / 6)];
  b += atom(vN[0], vN[1], 17, COL.teal, "N", { size: 18 });
  // lone pair
  b += `<circle cx="${vN[0] + 25}" cy="${vN[1] - 12}" r="4" fill="${COL.ink}"/><circle cx="${vN[0] + 29}" cy="${vN[1] - 1}" r="4" fill="${COL.ink}"/>`;
  b += `<line x1="${cx - r * Math.cos(Math.PI / 6)}" y1="${cy + r / 2}" x2="${cx - r * Math.cos(Math.PI / 6) - 30}" y2="${cy + r / 2 + 30}" stroke="${COL.teal}" stroke-width="5"/>`;
  // Li-S chain
  const y = 150;
  b += polysulfide(260, y, 6, { sp: 34, r: 14 });
  // Li at 260-34-4 = 222 ; right Li at 260+5*34+34+4 = 468
  b += dash(vN[0] + 12, vN[1] - 14, 214, y + 12, COL.purple, 3.5);
  // carbonyl acceptor on the right
  const ox = 520, oy = 255;
  b += atom(ox, oy, 17, COL.red, "O", { size: 18 });
  b += `<line x1="${ox + 8}" y1="${oy + 16}" x2="${ox + 26}" y2="${oy + 60}" stroke="${COL.ink}" stroke-width="4"/><line x1="${ox - 3}" y1="${oy + 19}" x2="${ox + 15}" y2="${oy + 63}" stroke="${COL.ink}" stroke-width="4"/>`;
  b += atom(ox + 26, oy + 76, 15, COL.siDark, "C", { size: 17 });
  b += `<line x1="${ox + 40}" y1="${oy + 76}" x2="${ox + 110}" y2="${oy + 76}" stroke="${COL.teal}" stroke-width="5"/>`;
  b += `<circle cx="${ox - 22}" cy="${oy - 14}" r="4" fill="${COL.ink}"/><circle cx="${ox - 12}" cy="${oy - 25}" r="4" fill="${COL.ink}"/>`;
  b += dash(478, y + 12, ox - 6, oy - 20, COL.purple, 3.5);
  // labels
  b += lines(340, 72, ["多硫化锂 Li_{2}S_{x}"], { size: 20, anchor: "middle", weight: "bold", fill: "#A67C00" });
  b += lines(340, 100, ["两端的 Li⁺ 缺电子 = Lewis 酸"], { size: 18, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += lines(120, 320, ["吡啶型 N", "（孤对电子）"], { size: 18, anchor: "middle", weight: "bold", fill: COL.teal, lh: 24 });
  b += lines(600, 380, ["羰基 O", "（孤对电子）"], { size: 18, anchor: "middle", weight: "bold", fill: COL.red, lh: 24 });
  b += text(330, 300, "虚线：Li–N / Li–O 配位", { size: 18, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(330, 326, "≈ 1–2 eV / 个", { size: 18, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(W / 2, 425, "给电子的 N、O、S = Lewis 碱，从两头“抓住”Li_{2}S_{x}", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Ionic binding (binder) and ionic repulsion (separator) ----------
figs.ionic = () => {
  const W = 720, H = 450;
  let b = "";
  // left: cathode with polycation binder
  b += `<rect x="10" y="40" width="330" height="320" rx="14" fill="${COL.sulfurLight}"/>`;
  b += text(175, 28, "正极：带正电的粘结剂", { size: 18, anchor: "middle", weight: "bold" });
  b += blob(90, 290, 50, 3, { fill: "#4F5B66", jag: 0.12 });
  b += blob(260, 120, 46, 8, { fill: "#4F5B66", jag: 0.12 });
  b += `<path d="M40,190 C120,140 200,250 320,210" fill="none" stroke="${COL.teal}" stroke-width="6" stroke-linecap="round"/>`;
  [[80, 172], [150, 190], [220, 214], [290, 214]].forEach(([x, y]) => (b += atom(x, y, 14, COL.amber, "+", { size: 20 })));
  b += polysulfide(130, 255, 4, { sp: 22, li: false });
  b += atom(108, 255, 13, COL.red, "−", { size: 18 }) + atom(130 + 3 * 22 + 22, 255, 13, COL.red, "−", { size: 18 });
  b += text(175, 390, "S_{x}^{2−} 被静电吸住", { size: 18, anchor: "middle", weight: "bold", fill: COL.amber });
  // right: electrolyte + anionic coated separator + Li anode
  b += `<rect x="360" y="40" width="190" height="320" fill="${COL.electrolyte}"/>`;
  b += `<rect x="550" y="40" width="44" height="320" fill="#F4F1FA" stroke="${COL.purpleLight}" stroke-width="2"/>`;
  b += `<rect x="540" y="40" width="10" height="320" fill="${COL.redLight}"/>`;
  for (let yy = 62; yy < 360; yy += 46) b += atom(545, yy, 11, COL.red, "−", { size: 16 });
  b += `<rect x="594" y="40" width="40" height="320" fill="${COL.electrolyte}"/>`;
  b += `<rect x="634" y="40" width="76" height="320" fill="#B9C3CC"/>`;
  b += text(672, 205, "Li", { size: 20, anchor: "middle", weight: "bold" });
  b += text(572, 28, "负电涂层隔膜", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  // repelled polysulfide
  b += polysulfide(400, 130, 4, { sp: 20, li: false, r: 10 });
  b += atom(380, 130, 12, COL.red, "−", { size: 16 }) + atom(400 + 3 * 20 + 20, 130, 12, COL.red, "−", { size: 16 });
  b += `<path d="M500,150 Q530,190 470,212" fill="none" stroke="${COL.red}" stroke-width="3"/>` + head(468, 213, Math.PI * 0.92, COL.red, 12);
  b += cross(525, 105, 9);
  b += text(455, 245, "同性相斥", { size: 17, anchor: "middle", fill: COL.red, weight: "bold" });
  // Li+ passes
  b += arrow(390, 305, 652, 305, { color: COL.purple, width: 3, head: 13 });
  b += ion(430, 305, { r: 13 });
  b += text(455, 345, "Li⁺ 照常通过", { size: 17, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(535, 390, "S_{x}^{2−} 被挡在正极一侧", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- Vulcanization ----------
figs.vulcanize = () => {
  const W = 720, H = 450;
  let b = "";
  // S8 ring
  const cx = 110, cy = 115;
  const ring = [];
  for (let i = 0; i < 8; i++) ring.push([cx + 46 * Math.cos((i * Math.PI) / 4), cy + 46 * Math.sin((i * Math.PI) / 4)]);
  b += `<polygon points="${ring.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="#A67C00" stroke-width="3"/>`;
  ring.forEach(([x, y]) => (b += S_(x, y, 13)));
  b += text(cx, cy + 6, "S_{8}", { size: 20, anchor: "middle", weight: "bold", fill: "#A67C00" });
  b += text(cx, 200, "硫单质：八元环", { size: 17, anchor: "middle", fill: COL.text2 });
  b += text(cx, 248, "+", { size: 30, anchor: "middle", weight: "bold" });
  // polymer with C=C
  b += zig(20, 200, 330);
  [64, 152].forEach((x) => {
    b += `<line x1="${x}" y1="${322}" x2="${x}" y2="${292}" stroke="${COL.teal}" stroke-width="4"/>`;
    b += `<line x1="${x - 2}" y1="${292}" x2="${x + 26}" y2="${272}" stroke="${COL.ink}" stroke-width="4"/><line x1="${x + 4}" y1="${299}" x2="${x + 32}" y2="${279}" stroke="${COL.ink}" stroke-width="4"/>`;
  });
  b += text(110, 375, "含 C=C 的高分子", { size: 17, anchor: "middle", fill: COL.text2 });
  // arrow
  b += arrow(225, 220, 330, 220, { color: COL.ink, width: 4, head: 16 });
  b += lines(278, 190, ["加热 / 原位聚合"], { size: 17, anchor: "middle", weight: "bold" });
  b += lines(278, 258, ["S_{8} 开环", "（约 159 °C 起）"], { size: 16, anchor: "middle", fill: COL.text2, lh: 22 });
  // network
  const ys = [80, 200, 320];
  ys.forEach((y) => (b += zig(360, 700, y)));
  const bridges = [[410, 0], [540, 0], [650, 0], [460, 1], [600, 1]];
  bridges.forEach(([x, k]) => {
    const y1 = ys[k] + 12, y2 = ys[k + 1] - 12;
    const n = 4;
    b += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#A67C00" stroke-width="3"/>`;
    for (let i = 1; i <= n; i++) b += S_(x + (i % 2 ? 6 : -6), y1 + (i * (y2 - y1)) / (n + 1), 11);
  });
  b += text(530, 375, "S 链变成高分子网络的一部分", { size: 18, anchor: "middle", weight: "bold", fill: "#A67C00" });
  b += text(530, 402, "化学键连着，溶不进电解液", { size: 17, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Three requirements (Venn) ----------
figs.triad = () => {
  const W = 620, H = 500;
  let b = "";
  const C = [
    [220, 190, COL.sulfur, COL.sulfurLight, ["抓住 Li_{2}S_{x}", "N、O、S 给电子基团"], -60, -50],
    [400, 190, COL.amber, COL.amberLight, ["导电子 e^{−}", "共轭主链 或 少用粘结剂"], 60, -50],
    [310, 340, COL.purple, COL.purpleLight, ["导 Li⁺", "离子通路"], 0, 70],
  ];
  C.forEach(([x, y, c, cl]) => (b += `<circle cx="${x}" cy="${y}" r="150" fill="${cl}" opacity="0.55" stroke="${c}" stroke-width="3"/>`));
  C.forEach(([x, y, c, cl, t, dx, dy]) => {
    b += text(x + dx, y + dy, t[0], { size: 21, anchor: "middle", weight: "bold", fill: c === COL.sulfur ? "#A67C00" : c });
    b += text(x + dx, y + dy + 27, t[1], { size: 18, anchor: "middle", fill: COL.ink });
  });
  b += `<circle cx="310" cy="240" r="44" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3"/>`;
  b += lines(310, 236, ["理想", "粘结剂"], { size: 17, anchor: "middle", weight: "bold", lh: 21 });
  return svg(W, H, b);
};

// ---------- Fig. 6b left: H-bonding with Si surface ----------
figs.si_hbond = () => {
  const W = 700, H = 450;
  let b = "";
  const cx = 350, cy = 1215, R = 900, shell = 22;
  b += `<circle cx="${cx}" cy="${cy}" r="${R + shell}" fill="#DCE3E9"/>`;
  b += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${COL.si}"/>`;
  const ys = (x, rr) => cy - Math.sqrt(rr * rr - (x - cx) * (x - cx));
  const by = 62;
  b += zig(30, 670, by, { step: 26, amp: 9, w: 6 });
  const P = [100, 240, 380, 520, 640];
  P.forEach((x, i) => {
    const sy = ys(x, R + shell);
    // surface Si–OH
    b += `<line x1="${x}" y1="${sy}" x2="${x}" y2="${sy - 20}" stroke="${COL.red}" stroke-width="4"/>`;
    b += atom(x, sy - 33, 14, COL.red, "O", { size: 16 });
    b += `<line x1="${x}" y1="${sy - 47}" x2="${x}" y2="${sy - 54}" stroke="${COL.muted}" stroke-width="3"/>`;
    b += atom(x, sy - 66, 12, COL.muted, "H", { size: 16 });
    // binder pendant –C(=O)–OH
    const px = x + 20;
    b += `<line x1="${px}" y1="${by + 8}" x2="${px}" y2="${by + 32}" stroke="${COL.teal}" stroke-width="4"/>`;
    b += atom(px, by + 44, 14, COL.siDark, "C", { size: 16 });
    b += `<line x1="${px - 9}" y1="${by + 54}" x2="${px - 21}" y2="${by + 76}" stroke="${COL.ink}" stroke-width="3"/><line x1="${px - 2}" y1="${by + 58}" x2="${px - 14}" y2="${by + 80}" stroke="${COL.ink}" stroke-width="3"/>`;
    b += atom(px - 22, by + 92, 14, COL.red, "O", { size: 16 });
    b += `<line x1="${px + 9}" y1="${by + 54}" x2="${px + 23}" y2="${by + 78}" stroke="${COL.ink}" stroke-width="3"/>`;
    b += atom(px + 26, by + 92, 14, COL.red, "O", { size: 16 });
    b += `<line x1="${px + 27}" y1="${by + 106}" x2="${px + 29}" y2="${by + 113}" stroke="${COL.muted}" stroke-width="3"/>`;
    b += atom(px + 30, by + 125, 12, COL.muted, "H", { size: 16 });
    // H-bonds: surface H ··· O=C ; binder O–H ··· surface O
    b += dash(x - 4, sy - 78, px - 22, by + 107, COL.teal, 3.5);
    if (i % 2 === 0) b += dash(px + 30, by + 138, x + 10, sy - 44, COL.teal, 3.5);
  });
  b += text(350, 350, "Si 颗粒", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(350, 384, "表面有一层天然氧化层 SiO_{x}，布满 Si–OH", { size: 18, anchor: "middle", fill: "#FFFFFF" });
  b += text(350, 428, "虚线 = 氢键：受力时断开，松开后重新形成", { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += text(680, 26, "粘结剂主链 + –COOH 侧基（如 PAA）", { size: 18, anchor: "end", weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- CMC / alginate / PAA ----------
function sugarChain(x0, y, n, pend, col) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const cx = x0 + i * 92;
    s += hexagon(cx, y, 26, { stroke: col, w: 3.5, fill: "#FFFFFF" });
    if (i < n - 1) s += `<line x1="${cx + 23}" y1="${y + 8}" x2="${cx + 69}" y2="${y + 8}" stroke="${col}" stroke-width="3.5"/>` + atom(cx + 46, y + 8, 8, COL.red, "", {});
    if (pend[i]) {
      s += `<line x1="${cx}" y1="${y - 26}" x2="${cx}" y2="${y - 48}" stroke="${col}" stroke-width="3.5"/>`;
      s += pill(cx - 38, y - 76, 76, 28, COL.red, "COO⁻", { size: 16 });
    }
  }
  return s;
}
figs.binder_family = () => {
  const W = 1230, H = 330;
  let b = "";
  const cw = 390, gap = 30;
  const cards = [
    { name: "羧甲基纤维素 CMC", sub: "纤维素改性；浆料 pH ≈ 7", col: COL.teal, note: "部分糖环带羧基" },
    { name: "海藻酸钠 Alginate", sub: "来自褐藻；天然多糖", col: COL.purple, note: "每个糖环 1 个羧基" },
    { name: "聚丙烯酸 PAA", sub: "合成高分子；浆料 pH ≈ 3", col: COL.amber, note: "每个单元 1 个羧基，最密" },
  ];
  cards.forEach((c, k) => {
    const x0 = k * (cw + gap);
    b += `<rect x="${x0}" y="0" width="${cw}" height="${H}" rx="16" fill="#F5F7F9"/>`;
    b += pill(x0 + 20, 16, cw - 40, 38, c.col, c.name, { size: 19 });
    if (k < 2) b += sugarChain(x0 + 56, 175, 4, k === 0 ? [1, 0, 1, 0] : [1, 1, 1, 1], c.col);
    else {
      b += zig(x0 + 30, x0 + 360, 185, { step: 30, amp: 12, color: c.col, w: 5 });
      for (let i = 0; i < 5; i++) {
        const x = x0 + 60 + i * 60;
        b += `<line x1="${x}" y1="${173}" x2="${x}" y2="${150}" stroke="${c.col}" stroke-width="3.5"/>`;
        b += pill(x - 27, 120, 54, 28, COL.red, "COOH", { size: 16 });
      }
    }
    b += text(x0 + cw / 2, 262, c.note, { size: 18, anchor: "middle", weight: "bold", fill: COL.ink });
    b += text(x0 + cw / 2, 296, c.sub, { size: 16, anchor: "middle", fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- slurry pH and oxide thickness ----------
figs.ph_oxide = () => {
  const W = 640, H = 450;
  let b = "";
  const cs = [COL.red, COL.red, COL.redLight, COL.amber, COL.amberLight, COL.sulfurLight, COL.sulfurLight, COL.tealLight, COL.tealLight, COL.teal, COL.purpleLight, COL.purpleLight, COL.purple, COL.purple];
  const x0 = 40, w = 40;
  cs.forEach((c, i) => (b += `<rect x="${x0 + i * w}" y="80" width="${w}" height="34" fill="${c}"/>`));
  [0, 7, 14].forEach((v) => (b += text(x0 + v * w, 140, String(v), { size: 16, anchor: "middle", fill: COL.text2 })));
  b += text(x0, 66, "酸性", { size: 16, fill: COL.red, weight: "bold" });
  b += text(x0 + 14 * w, 66, "碱性", { size: 16, anchor: "end", fill: COL.purple, weight: "bold" });
  b += text(x0 + 7 * w, 30, "浆料 pH", { size: 19, anchor: "middle", weight: "bold" });
  const mk = (v, lab, c) => `<polygon points="${x0 + v * w},120 ${x0 + v * w - 10},${100} ${x0 + v * w + 10},${100}" fill="${COL.ink}"/>` + pill(x0 + v * w - 52, 150, 104, 30, c, lab, { size: 16 });
  b += mk(3, "PAA ≈ 3", COL.amber) + mk(7, "CMC ≈ 7", COL.teal);
  // two particles
  const P = [[170, 320, 8, "氧化层薄", COL.teal], [470, 320, 26, "氧化层厚", COL.red]];
  P.forEach(([x, y, t, lab, c]) => {
    b += `<circle cx="${x}" cy="${y}" r="${78 + t}" fill="#DCE3E9"/>`;
    b += `<circle cx="${x}" cy="${y}" r="78" fill="${COL.si}"/>`;
    b += text(x, y + 7, "Si", { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += text(x, 440, lab, { size: 18, anchor: "middle", weight: "bold", fill: c });
  });
  b += arrow(40, 270, 98, 296, { color: COL.purple, width: 3, head: 12 }) + ion(40, 266, { r: 13 });
  b += arrow(330, 262, 362, 280, { color: COL.purple, width: 3, head: 12 }) + ion(320, 256, { r: 13 }) + cross(382, 268, 9);
  b += text(320, 228, "Li⁺ 难进、要多耗 Li", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- conformal coating & dual network ----------
figs.dual_network = () => {
  const W = 760, H = 450;
  let b = "";
  // panel a
  b += `<rect x="0" y="0" width="250" height="${H}" rx="16" fill="#F5F7F9"/>`;
  b += text(125, 34, "① 共形包覆", { size: 19, anchor: "middle", weight: "bold" });
  [70, 160].forEach((x, i) => {
    b += `<rect x="${x - 26}" y="70" width="52" height="300" rx="26" fill="${COL.purpleLight}"/>`;
    b += `<rect x="${x - 16}" y="80" width="32" height="280" rx="16" fill="${COL.si}"/>`;
  });
  b += lines(125, 400, ["Si 纳米线外", "电聚合一层 PEDOT"], { size: 17, anchor: "middle", fill: COL.text2, lh: 22 });
  // panel b
  const X = 270;
  b += `<rect x="${X}" y="0" width="${W - X}" height="${H}" rx="16" fill="#F5F7F9"/>`;
  b += text(X + (W - X) / 2, 34, "② 双网络 Dual network", { size: 19, anchor: "middle", weight: "bold" });
  const R = rng(17);
  const nodes = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) nodes.push([X + 50 + i * 95 + (R() - 0.5) * 30, 80 + j * 80 + (R() - 0.5) * 24]);
  // PANi mesh (thin purple)
  nodes.forEach((p, i) => nodes.forEach((q, j) => {
    if (j <= i) return;
    const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (d < 108) b += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${COL.purple}" stroke-width="2.5"/>`;
  }));
  // PAA strands (thick teal curves)
  [[X + 20, 120, W - 20, 150], [X + 20, 250, W - 20, 230], [X + 20, 330, W - 20, 350]].forEach(([x1, y1, x2, y2], k) => {
    b += `<path d="M${x1},${y1} C${x1 + 150},${y1 - 70} ${x2 - 160},${y2 + 70} ${x2},${y2}" fill="none" stroke="${COL.teal}" stroke-width="7" stroke-linecap="round"/>`;
  });
  // Si nanoparticles at some nodes
  nodes.forEach((p, i) => { if (i % 2 === 0) b += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="20" fill="${COL.si}" stroke="${COL.siDark}" stroke-width="2"/>`; });
  // legend
  const ly = 405;
  b += `<line x1="${X + 24}" y1="${ly}" x2="${X + 64}" y2="${ly}" stroke="${COL.teal}" stroke-width="7" stroke-linecap="round"/>`;
  b += text(X + 74, ly + 6, "PAA：力学骨架 + 氢键", { size: 17, weight: "bold", fill: COL.teal });
  b += `<line x1="${X + 24}" y1="${ly + 30}" x2="${X + 64}" y2="${ly + 30}" stroke="${COL.purple}" stroke-width="3"/>`;
  b += text(X + 74, ly + 36, "PANi：电子通路", { size: 17, weight: "bold", fill: COL.purple });
  b += `<circle cx="${X + 330}" cy="${ly + 14}" r="14" fill="${COL.si}" stroke="${COL.siDark}" stroke-width="2"/>`;
  b += text(X + 352, ly + 20, "Si 纳米颗粒", { size: 17, weight: "bold", fill: COL.siDark });
  return svg(W, H, b);
};

// ---------- PEO side chains for electrolyte swelling ----------
figs.peo_swell = () => {
  const W = 760, H = 430;
  let b = "";
  const pw = 360;
  // left: no PEO
  b += `<rect x="0" y="0" width="${pw}" height="${H}" rx="16" fill="#F5F7F9"/>`;
  b += text(pw / 2, 34, "非极性粘结剂", { size: 19, anchor: "middle", weight: "bold" });
  for (let k = 0; k < 6; k++) b += zig(30, 330, 100 + k * 34, { color: COL.siDark, w: 4, step: 20, amp: 6 });
  [[70, 70], [190, 64], [300, 72]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="26" ry="12" fill="#9CC9E0"/>`));
  b += ion(120, 330, { r: 14 }) + arrow(140, 330, 200, 330, { color: COL.purple, width: 3, head: 11 }) + cross(222, 330, 10);
  b += lines(pw / 2, 380, ["电解液浸润不进去", "Li⁺ 通路少"], { size: 17, anchor: "middle", fill: COL.red, weight: "bold", lh: 24 });
  // right: PEO side chains
  const X = 400;
  b += `<rect x="${X}" y="0" width="${pw}" height="${H}" rx="16" fill="${COL.electrolyte}"/>`;
  b += text(X + pw / 2, 34, "接上 PEO 侧链", { size: 19, anchor: "middle", weight: "bold", fill: COL.purple });
  [90, 250].forEach((y) => {
    b += zig(X + 20, X + 340, y, { color: COL.siDark, w: 5 });
    for (let i = 0; i < 4; i++) {
      const x = X + 50 + i * 80;
      let d = `M${x},${y + 8}`;
      for (let k = 1; k <= 5; k++) d += ` L${x + (k % 2 ? 12 : -12)},${y + 8 + k * 18}`;
      b += `<path d="${d}" fill="none" stroke="${COL.purple}" stroke-width="3"/>`;
      [2, 4].forEach((k) => (b += `<circle cx="${x + (k % 2 ? 12 : -12)}" cy="${y + 8 + k * 18}" r="5" fill="${COL.red}"/>`));
    }
  });
  [[X + 95, 150], [X + 255, 145], [X + 175, 310]].forEach(([x, y]) => (b += ion(x, y, { r: 14 })));
  [[X + 140, 190], [X + 300, 190], [X + 60, 320]].forEach(([x, y]) => (b += atom(x, y, 11, COL.amber, "−", { size: 17 })));
  b += arrow(X + 110, 205, X + 240, 205, { color: COL.purple, width: 3, head: 11 });
  b += lines(X + pw / 2, 380, ["电解液把粘结剂“泡胀”", "Li⁺ 沿 PEO 快速通过"], { size: 17, anchor: "middle", fill: COL.purple, weight: "bold", lh: 24 });
  b += `<circle cx="${X + 26}" cy="${H - 18}" r="5" fill="${COL.red}"/>` + text(X + 38, H - 12, "= 醚氧 O", { size: 17, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Common features of good Si binders ----------
figs.good_binder = () => {
  const W = 720, H = 470;
  let b = "";
  const cx = 360, cy = 240, rr = 150;
  const P = (deg, r = rr) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  b += blob(cx, cy, 100, 5, { fill: COL.si, stroke: "#DCE3E9", sw: 12, jag: 0.06 });
  b += text(cx, cy - 4, "微米 Si", { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(cx, cy + 24, "便宜，但体积变化大", { size: 18, anchor: "middle", fill: "#FFFFFF" });
  // binder ring (open arc)
  const a0 = P(150), a1 = P(120);
  b += `<path d="M${a0[0].toFixed(1)},${a0[1].toFixed(1)} A${rr},${rr} 0 1 1 ${a1[0].toFixed(1)},${a1[1].toFixed(1)}" fill="none" stroke="${COL.teal}" stroke-width="7" stroke-linecap="round"/>`;
  // 1: H bonds upper-left (ring -> Si surface)
  [205, 225, 245].forEach((d) => {
    const p = P(d, rr - 8), q = P(d, 118);
    b += dash(p[0].toFixed(1), p[1].toFixed(1), q[0].toFixed(1), q[1].toFixed(1), COL.teal, 3.5);
  });
  // 2: dynamic crosslinks on the right
  [-30, 0, 30].forEach((d, i) => {
    const p = P(d), q = P(d, rr + 46);
    b += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="10" fill="${COL.amber}"/>`;
    b += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${COL.amber}" stroke-width="5"${i === 1 ? ' stroke-dasharray="5 6"' : ""}/>`;
  });
  // 3: PEO side chain + Li+ lower-left
  const s0 = P(160);
  let d = `M${s0[0].toFixed(1)},${s0[1].toFixed(1)}`;
  for (let k = 1; k <= 5; k++) d += ` l${-14},${k % 2 ? 14 : -2}`;
  b += `<path d="${d}" fill="none" stroke="${COL.purple}" stroke-width="3.5"/>`;
  b += ion(s0[0] - 50, s0[1] + 44, { r: 14 });
  // callouts
  b += pill(20, 20, 220, 40, COL.teal, "① 氢键基团", { size: 19 });
  b += text(130, 84, "可逆地粘在 Si 表面", { size: 18, anchor: "middle", fill: COL.text2 });
  b += pill(W - 240, 20, 220, 40, COL.amber, "② 动态网络", { size: 19 });
  b += text(W - 130, 84, "能断能连，分散应力", { size: 18, anchor: "middle", fill: COL.text2 });
  b += pill(20, H - 74, 260, 40, COL.purple, "③ 亲电解液、亲 Li⁺", { size: 19 });
  b += text(150, H - 14, "溶胀，Li⁺ 快速通过", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Interaction strength spectrum ----------
figs.spectrum = () => {
  const W = 1230, H = 300;
  let b = "";
  const y = 150;
  const segs = [COL.tealLight, COL.teal, COL.purple, COL.amber, "#A67C00"];
  const x0 = 40, x1 = 1170, sw = (x1 - x0) / 5;
  segs.forEach((c, i) => (b += `<rect x="${x0 + i * sw}" y="${y - 9}" width="${sw}" height="18" fill="${c}"/>`));
  b += head(x1 + 34, y, 0, "#A67C00", 34);
  const st = [
    ["范德华力", "≲ 0.1 eV", "PVDF 贴在 Si 上"],
    ["氢键", "~0.1–0.3 eV", "CMC / PAA ↔ Si–OH"],
    ["Li–X 配位", "~1–2 eV（原文）", "N/O/S ↔ Li_{2}S_{x}"],
    ["离子结合", "静电，随电荷而变", "聚阳离子 ↔ S_{x}^{2−}"],
    ["共价键", "~3 eV", "硫化交联"],
  ];
  st.forEach(([n, e, ex], i) => {
    const x = x0 + (i + 0.5) * sw;
    b += `<circle cx="${x}" cy="${y}" r="16" fill="#FFFFFF" stroke="${segs[i]}" stroke-width="6"/>`;
    b += text(x, y - 66, n, { size: 21, anchor: "middle", weight: "bold", fill: i === 0 ? COL.teal : segs[i] });
    b += text(x, y - 38, e, { size: 18, anchor: "middle", fill: COL.ink });
    b += text(x, y + 52, ex, { size: 18, anchor: "middle", fill: COL.text2 });
  });
  b += text(x0, H - 28, "← 弱：可逆，能自修复，但容易“松手”", { size: 18, fill: COL.teal, weight: "bold" });
  b += text(x1 + 30, H - 28, "强：抓得牢，但断了就不能自己连回 →", { size: 18, anchor: "end", fill: "#A67C00", weight: "bold" });
  return svg(W, H, b);
};

module.exports = figs;
