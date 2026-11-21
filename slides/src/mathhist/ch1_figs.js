// Figures for 数学发展史 Chapter 1: 古代文明（埃及与美索不达米亚，约公元前 3000–600 年）
const L = require("../svglib");
const { COL, text, lines, arrow, head, cross, check, pill, svg, timeline } = L;

const figs = {};
const EG = COL.amber;      // Egypt colour
const MS = COL.teal;       // Mesopotamia colour
const CLAY = "#E9C9A0";    // clay tablet fill (tint of COL.copper)
const CLAY_D = COL.copper;

// ---------- glyph helpers ----------
// Cuneiform: vertical wedge (= 1) with its head at (x, y), height s.
function wedge1(x, y, s, c = COL.ink) {
  const hw = s * 0.32;
  return `<polygon points="${x - hw},${y} ${x + hw},${y} ${x},${y + s * 0.38}" fill="${c}"/>` +
    `<line x1="${x}" y1="${y + s * 0.3}" x2="${x}" y2="${y + s}" stroke="${c}" stroke-width="${(s * 0.09).toFixed(1)}" stroke-linecap="round"/>`;
}
// Cuneiform: corner wedge "Winkelhaken" (= 10), apex at (x, y+s/2), width ~0.62 s.
function wedge10(x, y, s, c = COL.ink) {
  const cy = y + s / 2;
  return `<polygon points="${x},${cy} ${x + s * 0.62},${cy - s * 0.42} ${x + s * 0.4},${cy} ${x + s * 0.62},${cy + s * 0.42}" fill="${c}"/>`;
}
// One sexagesimal digit (0–59) drawn in cuneiform. Returns {b, w}.
function cuneDigit(x, y, d, s, c = COL.ink) {
  const tens = Math.floor(d / 10), ones = d % 10;
  let b = "", cx = x;
  for (let i = 0; i < tens; i++) { b += wedge10(cx, y, s, c); cx += s * 0.5; }
  if (tens) cx += s * 0.32;
  const rows = ones <= 3 ? [ones] : ones <= 6 ? [Math.ceil(ones / 2), Math.floor(ones / 2)] : [3, 3, ones - 6];
  const rh = rows.length === 1 ? s : rows.length === 2 ? s * 0.55 : s * 0.38;
  rows.forEach((n, r) => {
    for (let k = 0; k < n; k++) b += wedge1(cx + s * 0.32 + k * s * 0.42, y + r * (s - rh) / Math.max(1, rows.length - 1), rh, c);
  });
  const maxRow = Math.max(0, ...rows);
  const w = (cx - x) + (maxRow ? s * 0.32 + (maxRow - 1) * s * 0.42 + s * 0.32 : 0);
  return { b, w };
}

// Egyptian hieroglyphic numerals, drawn simply. Box top at y, height s, centred on x.
function egy(kind, x, y, s, c = COL.ink) {
  const sw = (s * 0.1).toFixed(1);
  const st = `fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  switch (kind) {
    case 1:
      return `<line x1="${x}" y1="${y + s * 0.05}" x2="${x}" y2="${y + s}" ${st}/>`;
    case 10:
      return `<path d="M ${x - s * 0.28} ${y + s} V ${y + s * 0.42} A ${s * 0.28} ${s * 0.28} 0 0 1 ${x + s * 0.28} ${y + s * 0.42} V ${y + s}" ${st}/>`;
    case 100: {
      const cx = x, cy = y + s * 0.62;
      const pts = [];
      for (let t = 0; t <= Math.PI * 5; t += 0.2) {
        const r = s * 0.34 * (1 - t / (Math.PI * 6.2));
        pts.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy - r * Math.sin(t)).toFixed(1)}`);
      }
      return `<polyline points="${pts.join(" ")}" ${st}/><path d="M ${cx + s * 0.34} ${cy} C ${cx + s * 0.4} ${y + s * 0.2}, ${cx + s * 0.1} ${y + s * 0.15}, ${cx + s * 0.05} ${y}" ${st}/>`;
    }
    case 1000:
      return `<line x1="${x}" y1="${y + s}" x2="${x}" y2="${y + s * 0.38}" ${st}/>` +
        `<path d="M ${x} ${y + s * 0.4} C ${x - s * 0.32} ${y + s * 0.3}, ${x - s * 0.24} ${y + s * 0.05}, ${x - s * 0.1} ${y}" ${st}/>` +
        `<path d="M ${x} ${y + s * 0.4} C ${x + s * 0.32} ${y + s * 0.3}, ${x + s * 0.24} ${y + s * 0.05}, ${x + s * 0.1} ${y}" ${st}/>` +
        `<line x1="${x}" y1="${y + s * 0.4}" x2="${x}" y2="${y + s * 0.02}" ${st}/>` +
        `<path d="M ${x} ${y + s} C ${x - s * 0.1} ${y + s * 0.8}, ${x - s * 0.3} ${y + s * 0.78}, ${x - s * 0.36} ${y + s * 0.84}" ${st}/>`;
    case 10000:
      return `<path d="M ${x - s * 0.06} ${y + s} V ${y + s * 0.2} C ${x - s * 0.06} ${y}, ${x + s * 0.26} ${y}, ${x + s * 0.26} ${y + s * 0.22}" fill="none" stroke="${c}" stroke-width="${(s * 0.16).toFixed(1)}" stroke-linecap="round"/>`;
    case 100000:
      return `<ellipse cx="${x - s * 0.06}" cy="${y + s * 0.3}" rx="${s * 0.2}" ry="${s * 0.27}" fill="${c}"/>` +
        `<path d="M ${x - s * 0.06} ${y + s * 0.5} C ${x + s * 0.02} ${y + s * 0.72}, ${x + s * 0.3} ${y + s * 0.7}, ${x + s * 0.24} ${y + s}" ${st}/>`;
    case 1000000:
      return `<circle cx="${x}" cy="${y + s * 0.3}" r="${s * 0.1}" fill="${c}"/>` +
        `<path d="M ${x - s * 0.36} ${y + s * 0.05} L ${x - s * 0.3} ${y + s * 0.45} L ${x} ${y + s * 0.5} L ${x + s * 0.3} ${y + s * 0.45} L ${x + s * 0.36} ${y + s * 0.05}" ${st}/>` +
        `<path d="M ${x} ${y + s * 0.42} V ${y + s * 0.78} L ${x + s * 0.3} ${y + s * 0.8} L ${x + s * 0.3} ${y + s}" ${st}/>` +
        `<path d="M ${x} ${y + s * 0.78} L ${x - s * 0.22} ${y + s}" ${st}/>`;
  }
  return "";
}

// ---------- 1. Title motif ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  // clay tablet
  b += `<rect x="15" y="30" width="400" height="250" rx="34" fill="${CLAY}" stroke="${CLAY_D}" stroke-width="4"/>`;
  let cx = 42;
  [1, 24, 51, 10].forEach((d) => { const r = cuneDigit(cx, 75, d, 36, "#8A5A2B"); b += r.b; cx += r.w + 14; });
  b += `<line x1="40" y1="152" x2="390" y2="152" stroke="${CLAY_D}" stroke-width="2" opacity="0.6"/>`;
  cx = 42;
  [42, 25, 35].forEach((d) => { const r = cuneDigit(cx, 182, d, 34, "#8A5A2B"); b += r.b; cx += r.w + 10; });
  // papyrus strip
  b += `<rect x="20" y="320" width="390" height="190" rx="10" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="3"/>`;
  for (let y = 345; y < 500; y += 26) b += `<line x1="30" y1="${y}" x2="400" y2="${y}" stroke="${COL.sulfur}" stroke-width="1" opacity="0.35"/>`;
  [1000000, 100000, 10000, 1000, 100, 10, 1].forEach((k, i) => {
    b += egy(k, 55 + i * 53, 360, 62, i % 2 ? "#8A5A2B" : COL.red);
  });
  return svg(W, H, b);
};

// ---------- 2. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const g = COL.text2;
  const ev = [
    { year: "前 2 万年", who: ["伊尚戈骨"], what: ["骨头上的刻痕", "（含义有争议）"], color: g },
    { year: "前 8000", who: ["陶筹 Token"], what: ["一个小泥块", "代表一只羊"], color: g },
    { year: "前 3200", who: ["乌鲁克 Uruk"], what: ["泥板上出现", "数字符号"], color: MS },
    { year: "前 3100", who: ["那尔迈权标头"], what: ["埃及数字", "记到上百万"], color: EG },
    { year: "前 2100", who: ["乌尔第三王朝"], what: ["开始使用", "六十进制位值制"], color: MS },
    { year: "前 1850", who: ["莫斯科纸草书"], what: ["截头棱锥", "体积公式"], color: EG },
    { year: "前 1800", who: ["古巴比伦泥板"], what: ["√2、勾股数", "二次方程"], color: MS },
    { year: "前 1550", who: ["莱因德纸草书"], what: ["阿赫摩斯抄写", "84 道题"], color: EG },
  ];
  let b = timeline(W, H, ev, { axisY: 210, left: 85, right: 1125, whoSize: 19, whatSize: 18, yearSize: 23 });
  b += pill(860, 400, 150, 28, EG, "埃及", { size: 16 }) + pill(1030, 400, 170, 28, MS, "美索不达米亚", { size: 16 });
  b += pill(700, 400, 140, 28, g, "史前", { size: 16 });
  return svg(W, H, b);
};

// ---------- 3. Tally -> token -> numeral ----------
figs.counting_origin = () => {
  const W = 1240, H = 420;
  let b = "";
  // panel 1: bone with tallies
  b += `<path d="M 60 150 C 60 120, 110 118, 130 132 L 290 132 C 310 118, 360 120, 360 150 C 360 180, 310 182, 290 168 L 130 168 C 110 182, 60 180, 60 150 Z" fill="${COL.light}" stroke="${COL.muted}" stroke-width="3"/>`;
  [[140, 5], [210, 7], [272, 3]].forEach(([x0, n]) => {
    for (let i = 0; i < n; i++) b += `<line x1="${x0 + i * 8}" y1="138" x2="${x0 + i * 8}" y2="162" stroke="${COL.ink}" stroke-width="3"/>`;
  });
  b += text(210, 240, "① 刻痕 Tally", { size: 24, anchor: "middle", weight: "bold" });
  b += lines(210, 276, ["一道刻痕 = 一个东西", "一一对应，但数大了就刻不动"], { size: 19, anchor: "middle", fill: COL.text2 });
  // panel 2: tokens + bulla
  const tx = 620;
  b += `<circle cx="${tx}" cy="140" r="78" fill="${CLAY}" stroke="${CLAY_D}" stroke-width="4"/>`;
  b += `<polygon points="${tx - 40},${165} ${tx - 20},${105} ${tx},${165}" fill="${CLAY_D}"/>`;
  b += `<circle cx="${tx + 28}" cy="122" r="17" fill="${CLAY_D}"/>`;
  b += `<rect x="${tx + 8}" y="150" width="44" height="20" rx="8" fill="${CLAY_D}"/>`;
  b += text(tx, 240, "② 陶筹 Token + 封球 Bulla", { size: 24, anchor: "middle", weight: "bold" });
  b += lines(tx, 276, ["不同形状代表不同物品", "装进泥球封好，当“货单”"], { size: 19, anchor: "middle", fill: COL.text2 });
  // panel 3: tablet with number + sign
  const px = 1030;
  b += `<rect x="${px - 120}" y="70" width="240" height="140" rx="22" fill="${CLAY}" stroke="${CLAY_D}" stroke-width="4"/>`;
  for (let i = 0; i < 5; i++) b += `<ellipse cx="${px - 92 + i * 30}" cy="140" rx="11" ry="16" fill="${CLAY_D}"/>`;
  b += `<circle cx="${px + 70}" cy="140" r="30" fill="none" stroke="${COL.ink}" stroke-width="4"/>`;
  b += `<line x1="${px + 49}" y1="119" x2="${px + 91}" y2="161" stroke="${COL.ink}" stroke-width="4"/><line x1="${px + 91}" y1="119" x2="${px + 49}" y2="161" stroke="${COL.ink}" stroke-width="4"/>`;
  b += text(px - 32, 196, "5", { size: 20, anchor: "middle", fill: COL.text2 });
  b += text(px + 70, 196, "羊", { size: 20, anchor: "middle", fill: COL.text2 });
  b += text(px, 240, "③ 数字 + 物品符号", { size: 24, anchor: "middle", weight: "bold" });
  b += lines(px, 276, ["“5”和“羊”分开写", "数第一次脱离了具体东西"], { size: 19, anchor: "middle", fill: COL.text2 });
  b += arrow(380, 150, 520, 150, { color: COL.muted, width: 4, head: 18 });
  b += arrow(722, 150, 885, 150, { color: COL.muted, width: 4, head: 18 });
  b += text(450, 125, "要记的东西变多", { size: 17, anchor: "middle", fill: COL.muted });
  b += text(803, 125, "约前 3300–3100", { size: 17, anchor: "middle", fill: COL.muted });
  b += text(620, 380, "从“一一对应”到“抽象的数”：同一个“5”既能数羊，也能数油罐", { size: 21, anchor: "middle", fill: COL.purple, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 4. Egyptian numerals ----------
figs.egypt_numerals = () => {
  const W = 820, H = 540;
  let b = "";
  const items = [[1, "1", "竖划"], [10, "10", "脚绊"], [100, "100", "绳圈"], [1000, "1000", "莲花"], [10000, "1 万", "手指"], [100000, "10 万", "蝌蚪"], [1000000, "100 万", "海赫神"]];
  items.forEach(([k, v, n], i) => {
    const x = 60 + i * 117;
    b += `<rect x="${x - 52}" y="20" width="104" height="200" rx="14" fill="${COL.sulfurLight}" opacity="0.6"/>`;
    b += egy(k, x, 42, 74, COL.ink);
    b += text(x, 160, v, { size: 24, anchor: "middle", weight: "bold", fill: EG });
    b += text(x, 196, n, { size: 19, anchor: "middle", fill: COL.text2 });
  });
  // example 2 345
  b += text(30, 290, "例：2 345 怎么写？", { size: 22, weight: "bold" });
  let x = 60;
  const seq = [[1000, 2], [100, 3], [10, 4], [1, 5]];
  seq.forEach(([k, n]) => {
    for (let i = 0; i < n; i++) { b += egy(k, x, 318, 62, COL.ink); x += k === 1 ? 22 : 48; }
    x += 26;
  });
  b += text(520, 290, "= 2000 + 300 + 40 + 5", { size: 22, fill: COL.text2 });
  b += `<rect x="30" y="420" width="760" height="96" rx="14" fill="${COL.light}"/>`;
  b += lines(50, 458, ["十进制，但不是位值制：每个 10 的幂有自己的符号，", "重复画最多 9 次再相加，位置可以随意调换。"], { size: 21, fill: COL.ink });
  return svg(W, H, b);
};

// ---------- 5. Egyptian doubling multiplication ----------
figs.egypt_multiply = () => {
  const W = 820, H = 540;
  let b = "";
  b += text(40, 46, "例：13 × 12（只用“翻倍”和“相加”）", { size: 24, weight: "bold" });
  const rows = [[1, 12, true], [2, 24, false], [4, 48, true], [8, 96, true]];
  b += `<rect x="60" y="76" width="360" height="56" rx="10" fill="${EG}"/>`;
  b += text(160, 113, "倍数", { size: 22, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += text(330, 113, "12 的倍数", { size: 22, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  rows.forEach(([a, v, on], i) => {
    const y = 140 + i * 64;
    b += `<rect x="60" y="${y}" width="360" height="56" rx="10" fill="${on ? COL.sulfurLight : COL.light}"/>`;
    b += text(160, y + 37, String(a), { size: 26, anchor: "middle", weight: "bold" });
    b += text(330, y + 37, String(v), { size: 26, anchor: "middle", weight: "bold" });
    if (on) b += check(30, y + 28, 12, COL.teal, 5);
    if (i < 3) b += text(450, y + 62, "× 2 ↓", { size: 18, fill: COL.muted });
  });
  b += `<rect x="500" y="140" width="290" height="248" rx="14" fill="${COL.light}"/>`;
  b += lines(520, 182, ["打勾的行：", "1 + 4 + 8 = 13", "", "把右边加起来：", "12 + 48 + 96"], { size: 21, lh: 32 });
  b += text(520, 372, "= 156", { size: 30, weight: "bold", fill: EG });
  b += `<rect x="40" y="420" width="750" height="96" rx="14" fill="#F1ECF8"/>`;
  b += lines(60, 458, ["本质是把 13 拆成 2 的幂：13 = 8 + 4 + 1（二进制 1101）。", "不用背乘法表——今天的计算机做乘法也用这个思路。"], { size: 21, fill: COL.ink });
  return svg(W, H, b);
};

// ---------- 6. Unit fractions ----------
figs.unit_fractions = () => {
  const W = 820, H = 540;
  let b = "";
  b += text(40, 46, "9 个面包分给 10 个人，每人多少？", { size: 24, weight: "bold" });
  const x0 = 60, L1 = 640;
  // reference: one loaf
  b += `<rect x="${x0}" y="80" width="${L1}" height="40" rx="8" fill="none" stroke="${COL.muted}" stroke-width="2" stroke-dasharray="8 6"/>`;
  b += text(x0 + L1 + 14, 108, "1 个", { size: 20, fill: COL.muted });
  const parts = [[2 / 3, "2/3", EG], [1 / 5, "1/5", COL.purple], [1 / 30, "", COL.teal]];
  let cx = x0;
  parts.forEach(([f, lab, c]) => {
    const w = f * L1;
    b += `<rect x="${cx}" y="140" width="${w}" height="56" fill="${c}" stroke="#FFFFFF" stroke-width="2"/>`;
    if (lab) b += text(cx + w / 2, 177, lab, { size: 24, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    cx += w;
  });
  b += text(cx + 10, 250, "1/30", { size: 20, fill: COL.teal, weight: "bold" });
  b += `<line x1="${cx - 10}" y1="200" x2="${cx + 20}" y2="230" stroke="${COL.teal}" stroke-width="2"/>`;
  b += text(x0, 250, "埃及答案：2/3 + 1/5 + 1/30（= 9/10）", { size: 22, weight: "bold" });
  // r-sign notation
  b += text(40, 318, "写法：在数字上加一个“嘴”形符号 ⊂⊃ 表示“几分之一”", { size: 21, fill: COL.text2 });
  [[3, "1/3"], [5, "1/5"], [30, "1/30"]].forEach(([n, lab], i) => {
    const x = 120 + i * 220;
    b += `<ellipse cx="${x}" cy="356" rx="34" ry="11" fill="none" stroke="${COL.ink}" stroke-width="4"/>`;
    b += text(x, 404, String(n), { size: 30, anchor: "middle", weight: "bold" });
    b += text(x + 70, 392, "= " + lab, { size: 22, fill: EG, weight: "bold" });
  });
  b += `<rect x="40" y="430" width="750" height="90" rx="14" fill="${COL.light}"/>`;
  b += lines(60, 466, ["Rhind 开头有一张“2/n 表”，例如 2/5 = 1/3 + 1/15，", "2/7 = 1/4 + 1/28。查表就能把任何分数拆成单位分数。"], { size: 21 });
  return svg(W, H, b);
};

// ---------- 7. Circle area (Rhind 48 / 50) ----------
figs.circle_area = () => {
  const W = 820, H = 520;
  let b = "";
  const u = 30, x0 = 60, y0 = 60;
  for (let i = 0; i <= 9; i++) {
    b += `<line x1="${x0 + i * u}" y1="${y0}" x2="${x0 + i * u}" y2="${y0 + 9 * u}" stroke="${COL.line}" stroke-width="1.5"/>`;
    b += `<line x1="${x0}" y1="${y0 + i * u}" x2="${x0 + 9 * u}" y2="${y0 + i * u}" stroke="${COL.line}" stroke-width="1.5"/>`;
  }
  const o = (a, c) => `${x0 + a * u},${y0 + c * u}`;
  b += `<polygon points="${o(3, 0)} ${o(6, 0)} ${o(9, 3)} ${o(9, 6)} ${o(6, 9)} ${o(3, 9)} ${o(0, 6)} ${o(0, 3)}" fill="${COL.amberLight}" fill-opacity="0.55" stroke="${EG}" stroke-width="3"/>`;
  b += `<circle cx="${x0 + 4.5 * u}" cy="${y0 + 4.5 * u}" r="${4.5 * u}" fill="none" stroke="${COL.purple}" stroke-width="3.5"/>`;
  b += `<rect x="${x0}" y="${y0}" width="${9 * u}" height="${9 * u}" fill="none" stroke="${COL.ink}" stroke-width="3"/>`;
  b += text(x0 + 4.5 * u, y0 + 9 * u + 36, "直径 9 的圆 ≈ 八边形", { size: 21, anchor: "middle", weight: "bold" });
  b += text(x0 + 4.5 * u, y0 + 9 * u + 66, "81 − 4 × 4.5 = 63 ≈ 64", { size: 20, anchor: "middle", fill: COL.text2 });
  // square of side 8
  const sx = 470, s8 = 8 * u;
  b += `<rect x="${sx}" y="${y0 + 15}" width="${s8}" height="${s8}" fill="${COL.amberLight}" fill-opacity="0.55" stroke="${EG}" stroke-width="3"/>`;
  b += text(sx + s8 / 2, y0 + 15 + s8 / 2 + 10, "8 × 8 = 64", { size: 26, anchor: "middle", weight: "bold", fill: EG });
  b += text(sx + s8 / 2, y0 + 9 * u + 36, "规则：去掉直径的 1/9，再平方", { size: 21, anchor: "middle", weight: "bold" });
  b += text(sx + s8 / 2, y0 + 9 * u + 66, "A = (8d/9)²", { size: 20, anchor: "middle", fill: COL.text2 });
  b += text(400, 175, "≈", { size: 50, anchor: "middle", fill: COL.muted });
  b += `<rect x="60" y="436" width="700" height="62" rx="14" fill="#F1ECF8"/>`;
  b += text(410, 476, "相当于 π ≈ 256/81 ≈ 3.1605（误差约 0.6%）", { size: 23, anchor: "middle", weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

// ---------- 8. Frustum (Moscow problem 14) ----------
figs.frustum = () => {
  const W = 820, H = 520;
  let b = "";
  // bottom square side 4 -> 220px, top side 2 -> 110px, oblique projection
  const bx = 130, by = 400, s = 210, dx = 66, dy = -48;
  const t = 105, tx = bx + (s - t) / 2 + dx * 0.25, ty = 150;
  const P = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;
  const B = [[bx, by], [bx + s, by], [bx + s + dx, by + dy], [bx + dx, by + dy]];
  const T = [[tx, ty], [tx + t, ty], [tx + t + dx / 2, ty + dy / 2], [tx + dx / 2, ty + dy / 2]];
  b += `<polygon points="${B.map((p) => P(...p)).join(" ")}" fill="${COL.sulfurLight}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += `<polygon points="${P(...B[0])} ${P(...B[1])} ${P(...T[1])} ${P(...T[0])}" fill="${COL.amberLight}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += `<polygon points="${P(...B[1])} ${P(...B[2])} ${P(...T[2])} ${P(...T[1])}" fill="${COL.amber}" fill-opacity="0.75" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += `<polygon points="${T.map((p) => P(...p)).join(" ")}" fill="${COL.sulfurLight}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  // labels
  b += text(bx + s / 2, by + 34, "底边 a = 4", { size: 22, anchor: "middle", weight: "bold" });
  b += text(tx + t / 2 + 10, ty - 40, "顶边 b = 2", { size: 22, anchor: "middle", weight: "bold" });
  b += `<line x1="${bx - 24}" y1="${ty + dy / 4}" x2="${bx - 24}" y2="${by}" stroke="${COL.purple}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  b += text(bx - 34, (ty + by) / 2 + 8, "h = 6", { size: 22, anchor: "end", weight: "bold", fill: COL.purple });
  // steps
  const sx = 450;
  b += `<rect x="${sx - 20}" y="40" width="380" height="380" rx="14" fill="${COL.light}"/>`;
  b += text(sx, 82, "纸草书上的算法：", { size: 22, weight: "bold" });
  b += lines(sx, 124, ["4 × 4 = 16", "4 × 2 = 8", "2 × 2 = 4", "16 + 8 + 4 = 28", "6 ÷ 3 = 2", "28 × 2 = 56"], { size: 23, lh: 40 });
  b += text(sx, 386, "答：体积 56", { size: 26, weight: "bold", fill: EG });
  b += `<rect x="40" y="446" width="750" height="56" rx="14" fill="#F1ECF8"/>`;
  b += text(415, 482, "今天写作 V = h(a² + ab + b²) / 3 —— 与现代公式完全一致", { size: 22, anchor: "middle", weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

// ---------- 9. Seked ----------
figs.seked = () => {
  const W = 820, H = 520;
  let b = "";
  // pyramid silhouette
  b += `<polygon points="60,400 260,145 460,400" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="3"/>`;
  b += `<line x1="260" y1="145" x2="260" y2="400" stroke="${COL.ink}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
  b += `<polygon points="260,400 460,400 260,145" fill="${COL.amberLight}" fill-opacity="0.6"/>`;
  b += `<rect x="260" y="380" width="20" height="20" fill="none" stroke="${COL.ink}" stroke-width="2"/>`;
  b += text(250, 280, "高 1 腕尺", { size: 21, anchor: "end", weight: "bold", fill: COL.purple });
  b += text(250, 308, "= 7 掌", { size: 21, anchor: "end", weight: "bold", fill: COL.purple });
  b += text(360, 436, "水平退 5½ 掌", { size: 21, anchor: "middle", weight: "bold", fill: EG });
  b += `<path d="M 420 400 A 40 40 0 0 0 435 368" fill="none" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += text(410, 360, "≈ 51.8°", { size: 20, anchor: "end" });
  const sx = 510;
  b += `<rect x="${sx - 10}" y="120" width="300" height="250" rx="14" fill="${COL.light}"/>`;
  b += lines(sx + 10, 160, ["seked（斜率）", "= 每升高 1 腕尺，", "   水平退几掌"], { size: 21, lh: 32 });
  b += lines(sx + 10, 280, ["大金字塔：5½ 掌", "tan θ = 7 ÷ 5.5"], { size: 21, lh: 32, fill: COL.text2 });
  b += `<rect x="40" y="456" width="750" height="50" rx="12" fill="#F1ECF8"/>`;
  b += text(415, 489, "seked 相当于今天的 cot θ：用“比值”而不是“角度”来描述倾斜", { size: 21, anchor: "middle", weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

// ---------- 10. Cuneiform numerals & place value ----------
figs.cuneiform = () => {
  const W = 820, H = 540;
  let b = "";
  b += `<rect x="30" y="20" width="370" height="130" rx="18" fill="${CLAY}"/>`;
  b += wedge1(90, 45, 70, "#6E4522") + text(140, 100, "= 1", { size: 28, weight: "bold" });
  b += wedge10(240, 45, 70, "#6E4522") + text(300, 100, "= 10", { size: 28, weight: "bold" });
  b += lines(430, 64, ["只有两个符号，", "1–59 用它们堆出来。", "例：24 = 2 个〈 + 4 个 ▼"], { size: 20, fill: COL.text2, lh: 30 });
  // example 1;24,51,10
  b += text(30, 200, "YBC 7289 上的 √2：", { size: 22, weight: "bold" });
  b += `<rect x="30" y="215" width="760" height="120" rx="18" fill="${CLAY}"/>`;
  const digits = [1, 24, 51, 10];
  const pw = ["× 1", "× 1/60", "× 1/60²", "× 1/60³"];
  const ws = digits.map((d) => cuneDigit(0, 0, d, 64).w);
  const gap = (720 - ws.reduce((a, c) => a + c, 0)) / 3;
  let cx = 50;
  digits.forEach((d, i) => {
    b += cuneDigit(cx, 243, d, 64, "#6E4522").b;
    const mid = cx + ws[i] / 2;
    b += text(mid, 370, String(d), { size: 26, anchor: "middle", weight: "bold", fill: MS });
    b += text(mid, 402, pw[i], { size: 20, anchor: "middle", fill: COL.text2 });
    cx += ws[i] + gap;
  });
  b += `<rect x="30" y="428" width="760" height="92" rx="14" fill="${COL.light}"/>`;
  b += text(410, 464, "1 + 24/60 + 51/3600 + 10/216000 ≈ 1.414213", { size: 23, anchor: "middle", weight: "bold" });
  b += text(410, 500, "同一个符号放在不同位置，代表不同大小 → 位值制", { size: 20, anchor: "middle", fill: COL.purple, weight: "bold" });
  return svg(W, H, b);
};

// ---------- 11. Why 60: divisors ----------
figs.divisors = () => {
  const W = 820, H = 460;
  let b = "";
  const row = (y, label, ds, c) => {
    b += text(30, y + 30, label, { size: 22, weight: "bold" });
    ds.forEach((d, i) => { b += pill(150 + i * 54, y + 6, 48, 36, c, String(d), { size: 18 }); });
  };
  row(30, "10 的因数", [1, 2, 5, 10], COL.muted);
  row(100, "60 的因数", [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60], MS);
  b += text(150, 182, "4 个 vs 12 个：60 能被 2、3、4、5、6 整除", { size: 20, fill: COL.text2 });
  // 1/3 comparison
  b += `<rect x="30" y="220" width="370" height="200" rx="14" fill="${COL.light}"/>`;
  b += text(215, 262, "十进制", { size: 22, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += lines(215, 310, ["1/3 = 0.3333…", "写不完"], { size: 24, anchor: "middle", lh: 44 });
  b += `<rect x="420" y="220" width="370" height="200" rx="14" fill="#E8F4F3"/>`;
  b += text(605, 262, "六十进制", { size: 22, anchor: "middle", weight: "bold", fill: MS });
  b += lines(605, 310, ["1/3 = 0;20", "正好 = 20/60"], { size: 24, anchor: "middle", lh: 44 });
  b += check(520, 392, 12, MS, 5);
  b += cross(120, 392, 10, COL.red, 5);
  return svg(W, H, b);
};

// ---------- 12. Reciprocal table ----------
figs.reciprocals = () => {
  const W = 520, H = 560;
  let b = "";
  b += `<rect x="20" y="20" width="480" height="520" rx="30" fill="${CLAY}" stroke="${CLAY_D}" stroke-width="4"/>`;
  b += text(150, 70, "n", { size: 24, anchor: "middle", weight: "bold", fill: "#6E4522" });
  b += text(370, 70, "1/n（igi）", { size: 24, anchor: "middle", weight: "bold", fill: "#6E4522" });
  const rows = [["2", "30"], ["3", "20"], ["4", "15"], ["5", "12"], ["6", "10"], ["7", "—"], ["8", "7;30"], ["9", "6;40"], ["10", "6"], ["12", "5"]];
  rows.forEach(([n, r], i) => {
    const y = 112 + i * 41;
    const bad = r === "—";
    b += `<line x1="50" y1="${y + 12}" x2="470" y2="${y + 12}" stroke="${CLAY_D}" stroke-width="1" opacity="0.5"/>`;
    b += text(150, y, n, { size: 24, anchor: "middle", weight: "bold", fill: bad ? COL.red : COL.ink });
    if (bad) b += text(370, y, "除不尽，不列", { size: 20, anchor: "middle", fill: COL.red, weight: "bold" });
    else b += text(370, y, r, { size: 24, anchor: "middle", fill: COL.ink });
  });
  return svg(W, H, b);
};

// ---------- 13. YBC 7289 diagram ----------
figs.ybc7289 = () => {
  const W = 600, H = 600;
  let b = "";
  b += `<circle cx="300" cy="250" r="230" fill="${CLAY}" stroke="${CLAY_D}" stroke-width="4"/>`;
  const x0 = 180, y0 = 130, s = 240;
  b += `<rect x="${x0}" y="${y0}" width="${s}" height="${s}" fill="none" stroke="#6E4522" stroke-width="4"/>`;
  b += `<line x1="${x0}" y1="${y0}" x2="${x0 + s}" y2="${y0 + s}" stroke="#6E4522" stroke-width="4"/>`;
  b += `<line x1="${x0 + s}" y1="${y0}" x2="${x0}" y2="${y0 + s}" stroke="#6E4522" stroke-width="4"/>`;
  b += text(x0 + 54, y0 - 16, "30（边长）", { size: 24, anchor: "middle", weight: "bold", fill: COL.ink });
  b += `<g transform="rotate(45 300 250)">`;
  b += `<rect x="215" y="211" width="170" height="34" rx="8" fill="${CLAY}"/>` + text(300, 238, "1;24,51,10", { size: 26, anchor: "middle", weight: "bold", fill: MS });
  b += `<rect x="232" y="258" width="136" height="34" rx="8" fill="${CLAY}"/>` + text(300, 285, "42;25,35", { size: 26, anchor: "middle", weight: "bold", fill: COL.purple });
  b += `</g>`;
  b += text(300, 528, "√2 ≈ 1.41421296（真值 1.41421356…）", { size: 22, anchor: "middle", weight: "bold" });
  b += text(300, 566, "30 × 1;24,51,10 = 42;25,35 ≈ 42.4264 = 对角线", { size: 20, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 14. Plimpton 322 triangle ----------
figs.plimpton = () => {
  const W = 820, H = 520;
  let b = "";
  const x0 = 70, y0 = 400, sc = 2.3;
  const A = [x0, y0], B = [x0 + 120 * sc, y0], C = [x0 + 120 * sc, y0 - 119 * sc];
  b += `<polygon points="${A.join(",")} ${B.join(",")} ${C.join(",")}" fill="${COL.tealLight}" fill-opacity="0.5" stroke="${MS}" stroke-width="3.5"/>`;
  b += `<rect x="${B[0] - 18}" y="${B[1] - 18}" width="18" height="18" fill="none" stroke="${COL.ink}" stroke-width="2"/>`;
  b += text((A[0] + B[0]) / 2, y0 + 36, "120（长边，泥板上没写）", { size: 22, anchor: "middle", weight: "bold" });
  b += text(B[0] + 14, (B[1] + C[1]) / 2 + 8, "119", { size: 22, weight: "bold" });
  b += text(B[0] + 14, (B[1] + C[1]) / 2 + 36, "（短边）", { size: 19, fill: COL.text2 });
  b += `<g transform="rotate(-44.8 ${(A[0] + C[0]) / 2} ${(A[1] + C[1]) / 2})">` + text((A[0] + C[0]) / 2, (A[1] + C[1]) / 2 - 12, "169（对角线）", { size: 22, anchor: "middle", weight: "bold", fill: COL.purple }) + `</g>`;
  const sx = 480;
  b += `<rect x="${sx - 16}" y="40" width="350" height="380" rx="14" fill="${COL.light}"/>`;
  b += text(sx, 80, "第 1 行（泥板上写 119 与 169）", { size: 19, weight: "bold" });
  b += lines(sx, 124, ["119² + 120²", "= 14161 + 14400", "= 28561 = 169² ✓"], { size: 22, lh: 34 });
  b += text(sx, 252, "可能的造法：取 p = 12, q = 5", { size: 19, weight: "bold" });
  b += lines(sx, 290, ["p² − q² = 119", "2pq = 120", "p² + q² = 169"], { size: 22, lh: 34, fill: MS });
  b += `<rect x="40" y="452" width="750" height="52" rx="12" fill="#F1ECF8"/>`;
  b += text(415, 486, "15 行全是勾股数组，最大的一组数字上万 —— 显然不是“碰巧试出来”的", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

// ---------- 15. Completing the square (BM 13901 #1) ----------
figs.complete_square = () => {
  const W = 1240, H = 430;
  let b = "";
  const u = 170; // x = 1/2 -> 85 px ... we draw x as 170 px (x unknown)
  const y0 = 70;
  // panel 1
  let x0 = 60;
  b += `<rect x="${x0}" y="${y0}" width="${u}" height="${u}" fill="${COL.tealLight}" stroke="${MS}" stroke-width="3"/>`;
  b += `<rect x="${x0 + u}" y="${y0}" width="${u * 0.6}" height="${u}" fill="${COL.amberLight}" stroke="${EG}" stroke-width="3"/>`;
  b += text(x0 + u / 2, y0 + u / 2 + 10, "x²", { size: 30, anchor: "middle", weight: "bold" });
  b += text(x0 + u * 1.3, y0 + u / 2 + 10, "x·1", { size: 26, anchor: "middle", weight: "bold" });
  b += text(x0 + u / 2, y0 - 14, "x", { size: 22, anchor: "middle", fill: COL.text2 });
  b += text(x0 + u * 1.3, y0 - 14, "1", { size: 22, anchor: "middle", fill: COL.text2 });
  b += text(x0 + u * 0.8, y0 + u + 50, "① 面积 + 边 = 3/4", { size: 23, anchor: "middle", weight: "bold" });
  b += text(x0 + u * 0.8, y0 + u + 82, "（原文：45′）", { size: 20, anchor: "middle", fill: COL.text2 });
  b += arrow(355, y0 + u / 2, 425, y0 + u / 2, { color: COL.muted, width: 4, head: 16 });
  // panel 2: split the 1-strip in halves, move one under
  x0 = 460;
  b += `<rect x="${x0}" y="${y0}" width="${u}" height="${u}" fill="${COL.tealLight}" stroke="${MS}" stroke-width="3"/>`;
  b += `<rect x="${x0 + u}" y="${y0}" width="${u * 0.3}" height="${u}" fill="${COL.amberLight}" stroke="${EG}" stroke-width="3"/>`;
  b += `<rect x="${x0}" y="${y0 + u}" width="${u}" height="${u * 0.3}" fill="${COL.amberLight}" stroke="${EG}" stroke-width="3"/>`;
  b += `<rect x="${x0 + u}" y="${y0 + u}" width="${u * 0.3}" height="${u * 0.3}" fill="none" stroke="${COL.red}" stroke-width="3" stroke-dasharray="6 5"/>`;
  b += text(x0 + u * 1.15, y0 - 14, "½", { size: 22, anchor: "middle", fill: COL.text2 });
  b += text(x0 + u * 0.65, y0 + u + 104, "② 把 1 劈成两半，挪一半到下面", { size: 23, anchor: "middle", weight: "bold" });
  b += arrow(735, y0 + u / 2, 805, y0 + u / 2, { color: COL.muted, width: 4, head: 16 });
  // panel 3
  x0 = 860;
  const S = u * 1.3;
  b += `<rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="${COL.tealLight}" fill-opacity="0.5" stroke="${MS}" stroke-width="3"/>`;
  b += `<rect x="${x0 + u}" y="${y0 + u}" width="${u * 0.3}" height="${u * 0.3}" fill="${COL.redLight}" stroke="${COL.red}" stroke-width="3"/>`;
  b += text(x0 + u * 1.15, y0 + u * 1.15 + 9, "¼", { size: 24, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(x0 + S / 2, y0 + S / 2 - 10, "3/4 + 1/4", { size: 24, anchor: "middle", weight: "bold" });
  b += text(x0 + S / 2, y0 + S / 2 + 22, "= 1", { size: 24, anchor: "middle", weight: "bold" });
  b += text(x0 + S / 2, y0 + u + 104, "③ 补上角落 ¼ → 大正方形边长 1", { size: 23, anchor: "middle", weight: "bold" });
  b += text(620, 410, "所以 x + ½ = 1，x = ½（原文：30′）—— 这就是“配方法”", { size: 23, anchor: "middle", weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

// ---------- 16. Egypt vs Mesopotamia ----------
figs.compare = () => {
  const W = 1240, H = 470;
  let b = "";
  const cols = [250, 650, 1030];
  b += `<rect x="440" y="20" width="400" height="56" rx="12" fill="${EG}"/>`;
  b += `<rect x="840" y="20" width="380" height="56" rx="12" fill="${MS}"/>`;
  b += text(cols[1] - 10, 58, "古埃及", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(cols[2], 58, "美索不达米亚（巴比伦）", { size: 24, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  const rows = [
    ["书写材料", "纸草 Papyrus：易腐烂", "泥板 Clay tablet：经火反而更硬"],
    ["进制", "十进制", "六十进制"],
    ["位值制", "没有，靠符号叠加", "有，但没有零和“小数点”"],
    ["分数", "单位分数 1/n", "六十进制小数"],
    ["代表成就", "面积、体积、斜率", "√2、勾股数、二次方程"],
    ["存世文献", "几卷数学纸草", "数以百计的数学泥板"],
  ];
  rows.forEach((r, i) => {
    const y = 84 + i * 62;
    b += `<rect x="20" y="${y}" width="1200" height="56" rx="10" fill="${i % 2 ? "#FFFFFF" : COL.light}"/>`;
    b += text(140, y + 36, r[0], { size: 22, anchor: "middle", weight: "bold" });
    b += text(cols[1] - 10, y + 36, r[1], { size: 21, anchor: "middle" });
    b += text(cols[2], y + 36, r[2], { size: 21, anchor: "middle" });
  });
  return svg(W, H, b);
};

module.exports = figs;
