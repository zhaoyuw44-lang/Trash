// Figures for Lopez et al. 2019, Chapter 3 (Designing polymers for Li-ion transport)
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
figs.chapter_strip = () => chapterStrip(3);

const anion = (x, y, r = 13) => ion(x, y, { r, fill: COL.red, label: "−" });
const li = (x, y, r = 13, o = {}) => ion(x, y, { r, fill: o.fill || COL.purple, label: "+" });

// ---------- Title motif: ions hopping along a chain ----------
figs.title_motif = () => {
  const W = 520, H = 520;
  let b = "";
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push([40 + t * 440, 260 + Math.sin(t * Math.PI * 3) * 140 + Math.cos(t * Math.PI * 7) * 20]);
  }
  b += `<path d="${smooth(pts)}" fill="none" stroke="${COL.tealLight}" stroke-width="7" stroke-linecap="round"/>`;
  pts.forEach(([x, y], i) => { if (i % 4 === 2) b += circ(x, y, 10, COL.redLight); });
  [[6, -1], [18, 1], [30, -1]].forEach(([i, s]) => {
    const [x, y] = pts[i];
    b += circ(x, y + s * 40, 22, COL.purple, { stroke: "#FFFFFF", sw: 3 });
    b += text(x, y + s * 40 + 8, "Li^{+}", { size: 20, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  });
  b += `<path d="M ${pts[6][0] + 26} ${pts[6][1] - 50} Q ${pts[12][0]} ${pts[12][1] - 150} ${pts[18][0] - 30} ${pts[18][1] + 20}" fill="none" stroke="${COL.amber}" stroke-width="4" stroke-dasharray="9 7"/>`;
  b += head(pts[18][0] - 30, pts[18][1] + 20, 1.2, COL.amber, 18);
  return svg(W, H, b);
};

// ---------- Timeline ----------
figs.ion_timeline = () => {
  const W = 1100, H = 400;
  const ev = [
    { year: "1921", who: ["Vogel"], what: ["黏度–温度", "经验式"], color: COL.text2 },
    { year: "1925", who: ["Fulcher"], what: ["玻璃黏度", "同一形式"], color: COL.text2 },
    { year: "1955", who: ["Williams, Landel", "& Ferry"], what: ["WLF 方程"], color: COL.text2 },
    { year: "1973", who: ["Fenton, Parker", "& Wright"], what: ["PEO 溶解碱金属盐"], color: COL.purple },
    { year: "1978", who: ["Armand 等"], what: ["提出用作", "电池电解质"], color: COL.purple },
    { year: "1983", who: ["Berthier 等"], what: ["导电主要在", "无定形区"], color: COL.purple },
    { year: "1987", who: ["Evans, Vincent", "& Bruce"], what: ["测迁移数", "的极化法"], color: COL.teal },
    { year: "2013", who: ["Bouchet 等"], what: ["单离子导体", "t_{+} > 0.85"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 200, left: 75, right: 1010, whoSize: 17, whatSize: 16, yearSize: 26 }));
};

// ---------- Liquid vs ceramic vs polymer ----------
figs.spe_compare = () => {
  const W = 640, H = 400;
  let b = "";
  const cols = [[["液体", "电解质"], COL.electrolyte, "#3A7CA5"], [["陶瓷", "固体电解质"], "#E3E7EB", COL.siDark], [["聚合物", "电解质 SPE"], "#F1ECF8", COL.purple]];
  const rows = ["不易燃、少副反应", "能挡住枝晶", "便宜、好加工", "与电极贴合", "室温离子电导高"];
  const marks = [[0, 0, 1, 1, 1], [1, 1, 0, 0, 2], [1, 2, 1, 1, 0]]; // 1 good, 0 bad, 2 so-so
  cols.forEach(([n, fill, c], j) => {
    const x = 220 + j * 140;
    b += rect(x - 64, 10, 128, 380, fill, { rx: 14 });
    b += lines(x, 40, n, { size: 18, anchor: "middle", weight: "bold", fill: c, lh: 21 });
  });
  rows.forEach((r, i) => {
    const y = 110 + i * 60;
    b += text(10, y + 6, r, { size: 18, weight: "bold" });
    cols.forEach((_, j) => {
      const x = 220 + j * 140, m = marks[j][i];
      b += m === 1 ? check(x, y, 12) : m === 0 ? cross(x, y, 10) : text(x, y + 7, "△", { size: 22, anchor: "middle", fill: COL.amber, weight: "bold" });
    });
  });
  return svg(W, H, b);
};

// ---------- Li+ hopping in PEO (Fig. 4a) ----------
figs.peo_hopping = () => {
  const W = 640, H = 440;
  let b = "";
  const site = (cx, cy, R, a0, active, seed) => {
    // chain wrapping around a site: O atoms on a ring, carbons between
    const pts = [];
    const n = 5;
    for (let k = 0; k <= n; k++) {
      const a = a0 + (k * 2 * Math.PI * 0.86) / n;
      pts.push({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), o: k < n });
      if (k < n) {
        const a2 = a + (2 * Math.PI * 0.86) / n / 2;
        pts.push({ x: cx + (R + 22) * Math.cos(a2), y: cy + (R + 22) * Math.sin(a2), o: false });
      }
    }
    let s = `<polyline points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="none" stroke="${COL.siDark}" stroke-width="3.5" stroke-linejoin="round"/>`;
    pts.forEach((p) => {
      if (!p.o) return;
      if (active) s += line(cx, cy, p.x, p.y, COL.red, 2, "4 4");
      s += circ(p.x, p.y, 11, active ? COL.red : COL.redLight);
    });
    return { s, start: pts[0], end: pts[pts.length - 1] };
  };
  const A = site(190, 210, 62, 0.4, true);
  b += A.s;
  b += wig(A.start.x, A.start.y, A.start.x + 120, A.start.y + 140, { seed: 3, amp: 12, n: 5, color: COL.siDark, w: 3.5 });
  b += wig(A.end.x, A.end.y, 40, 60, { seed: 4, amp: 12, n: 5, color: COL.siDark, w: 3.5 });
  b += li(190, 210, 18);
  const B = site(450, 150, 58, 2.2, false);
  b += B.s;
  b += wig(B.start.x, B.start.y, 600, 330, { seed: 5, amp: 12, n: 5, color: COL.siDark, w: 3.5 });
  b += wig(B.end.x, B.end.y, 380, 30, { seed: 6, amp: 10, n: 4, color: COL.siDark, w: 3.5 });
  b += `<circle cx="450" cy="150" r="18" fill="${COL.purpleLight}" opacity="0.7" stroke="${COL.purple}" stroke-width="2" stroke-dasharray="4 4"/>`;
  b += `<path d="M 215 185 Q 320 90 428 140" fill="none" stroke="${COL.amber}" stroke-width="4" stroke-dasharray="9 6"/>`;
  b += head(428, 140, 0.45, COL.amber, 15);
  b += text(320, 100, "跳跃 Hopping", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  // segmental motion
  b += `<path d="M 470 290 q 40 -30 80 0" fill="none" stroke="${COL.teal}" stroke-width="3.5"/>` + head(550, 290, 0.6, COL.teal, 13);
  b += `<path d="M 550 320 q -40 30 -80 0" fill="none" stroke="${COL.teal}" stroke-width="3.5"/>` + head(470, 320, 3.75, COL.teal, 13);
  b += lines(510, 365, ["链段运动", "把空位“送”过来"], { size: 16, anchor: "middle", fill: COL.teal, weight: "bold", lh: 21 });
  b += lines(190, 320, ["Li^{+} 被 4–5 个醚氧“抱住”"], { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
  b += lines(450, 60, ["空的溶剂化位点"], { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
  b += circ(30, 415, 9, COL.red) + text(46, 421, "参与配位的 O", { size: 15 });
  b += circ(190, 415, 9, COL.redLight) + text(206, 421, "空闲的 O", { size: 15 });
  b += line(310, 415, 340, 415, COL.siDark, 3.5) + text(348, 421, "PEO 链 –(CH_{2}CH_{2}O)_{n}–", { size: 15 });
  return svg(W, H, b);
};

// ---------- sigma = mu * c ----------
figs.sigma_mu_c = () => {
  const W = 640, H = 330;
  let b = "";
  b += rect(10, 10, 300, 270, "#F1ECF8", { rx: 14 });
  b += rect(330, 10, 300, 270, "#E8F4F3", { rx: 14 });
  b += text(160, 42, "c：有多少“自由”的离子", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(480, 42, "μ：每个离子跑得多快", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  // free ions and ion pairs
  [[60, 100], [140, 140], [230, 95], [90, 200], [250, 190]].forEach(([x, y]) => (b += li(x, y, 14)));
  [[180, 220], [60, 150], [200, 140]].forEach(([x, y]) => (b += anion(x, y, 14)));
  b += li(250, 245, 14) + anion(276, 245, 14);
  b += `<ellipse cx="263" cy="245" rx="36" ry="22" fill="none" stroke="${COL.muted}" stroke-width="2" stroke-dasharray="4 4"/>`;
  b += text(215, 270, "离子对：不算数", { size: 16, anchor: "end", fill: COL.muted, weight: "bold" });
  // mobility
  b += li(380, 110, 14) + arrow(400, 110, 590, 110, { color: COL.teal, width: 4, head: 14 });
  b += text(480, 145, "链软、黏度低：跑得远", { size: 16, anchor: "middle", fill: COL.teal });
  b += li(380, 200, 14) + arrow(400, 200, 440, 200, { color: COL.muted, width: 4, head: 14 });
  b += text(480, 240, "被“抓”太紧：几乎不动", { size: 16, anchor: "middle", fill: COL.muted });
  b += text(320, 318, "σ = μ × c　就像车流量 = 车速 × 车辆密度", { size: 18, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Free volume and T0 ----------
figs.free_volume = () => {
  const W = 640, H = 420;
  let b = "";
  const X0 = 80, X1 = 600, Y0 = 350, Y1 = 40;
  b += line(X0, Y0, X1 + 10, Y0, COL.ink, 3) + head(X1 + 16, Y0, 0, COL.ink, 13);
  b += line(X0, Y0, X0, Y1 - 6, COL.ink, 3) + head(X0, Y1 - 12, -Math.PI / 2, COL.ink, 13);
  b += text(340, 405, "温度 T", { size: 18, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(40 200) rotate(-90)">` + text(0, 0, "比体积（每克占多大地方）", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  // occupied volume line
  const occ = (x) => 300 - (x - X0) * 0.18;
  b += line(X0 + 10, occ(X0 + 10), X1, occ(X1), COL.siDark, 4);
  b += text(X1 - 4, occ(X1) + 28, "分子自身占的体积", { size: 18, anchor: "end", fill: COL.siDark, weight: "bold" });
  // liquid line from T0 upward
  const xT0 = 190, xTg = 300;
  const liq = (x) => occ(xT0) - (x - xT0) * 0.62;
  b += line(xTg, liq(xTg), X1, liq(X1), COL.purple, 5);
  b += line(xT0, liq(xT0), xTg, liq(xTg), COL.purple, 3, "7 6");
  // glass line below Tg
  b += line(X0 + 10, liq(xTg) + (xTg - X0 - 10) * 0.25, xTg, liq(xTg), COL.amber, 5);
  b += text(225, 200, "玻璃态", { size: 18, fill: COL.amber, weight: "bold" });
  b += text(440, liq(440) - 50, "橡胶态 / 熔体", { anchor: "end", size: 18, fill: COL.purple, weight: "bold" }) + text(0, 0, "", { size: 18, fill: COL.purple, weight: "bold" });
  // free volume gap
  b += `<polygon points="${xTg},${liq(xTg)} ${X1},${liq(X1)} ${X1},${occ(X1)} ${xTg},${occ(xTg)}" fill="${COL.purpleLight}" opacity="0.45"/>`;
  b += text(480, (liq(480) + occ(480)) / 2 + 6, "自由体积", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  // markers
  b += line(xTg, Y0, xTg, liq(xTg), COL.amber, 2, "4 4") + text(xTg, Y0 + 26, "T_{g}", { size: 18, anchor: "middle", weight: "bold", fill: COL.amber });
  b += line(xT0, Y0, xT0, occ(xT0), COL.red, 2, "4 4") + text(xT0, Y0 + 26, "T_{0}", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += circ(xT0, occ(xT0), 7, COL.red);
  b += lines(96, 120, ["外推：自由体积 = 0", "T_{0} ≈ T_{g} − 50 K"], { size: 18, fill: COL.red, weight: "bold", lh: 22 });
  b += line(140, 142, xT0 - 4, occ(xT0) - 10, COL.red, 1.5);
  b += arrow(xT0 + 4, Y0 + 40, xTg - 4, Y0 + 40, { color: COL.muted, width: 2, head: 9 });
  b += arrow(xTg - 4, Y0 + 40, xT0 + 4, Y0 + 40, { color: COL.muted, width: 2, head: 9 });
  b += text((xT0 + xTg) / 2, Y0 + 62, "≈ 50 K", { size: 18, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Transference number & concentration polarization ----------
figs.transference = () => {
  const W = 640, H = 430;
  let b = "";
  const panel = (y0, tp, title, col) => {
    let s = "";
    s += rect(20, y0, 34, 150, "#B9C3CC", { rx: 3 }) + rect(586, y0, 34, 150, COL.amberLight, { rx: 3, stroke: COL.amber });
    for (let k = 0; k < 12; k++) {
      const frac = tp > 0.5 ? 0.5 : 1 - k / 11;
      const g = Math.round(235 - frac * 60);
      s += `<rect x="${54 + k * 44}" y="${y0}" width="44.5" height="150" fill="rgb(${g + 10},${g + 5},${Math.min(255, g + 25)})"/>`;
    }
    [[150, 45], [330, 105], [470, 40], [250, 125], [420, 80]].forEach(([x, y]) => (s += li(x, y0 + y, 15) + arrow(x + 18, y0 + y, x + 52, y0 + y, { color: COL.purple, width: 3, head: 11 })));
    const an = tp > 0.5 ? [[110, 95], [210, 40], [300, 60], [380, 125], [520, 110], [540, 50]] : [[80, 40], [90, 110], [140, 80], [200, 120], [240, 60], [370, 40]];
    an.forEach(([x, y]) => {
      if (tp > 0.5) s += line(x, y0 + y - 30, x, y0 + y - 16, COL.siDark, 3) + anion(x, y0 + y, 15);
      else s += anion(x, y0 + y, 15) + arrow(x - 18, y0 + y, x - 44, y0 + y, { color: COL.red, width: 3, head: 11 });
    });
    s += text(320, y0 - 12, title, { size: 18, anchor: "middle", weight: "bold", fill: col });
    return s;
  };
  b += panel(36, 0.2, "t_{+} ≈ 0.2：阴离子堆在负极一侧 → 浓差极化", COL.red);
  b += panel(246, 1, "t_{+} ≈ 1：阴离子被固定，浓度处处均匀", COL.teal);
  b += text(37, 422, "负极", { size: 18, anchor: "middle", weight: "bold" }) + text(603, 422, "正极", { size: 18, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Crystalline vs amorphous ----------
figs.cryst_amorph = () => {
  const W = 640, H = 420;
  let b = "";
  b += rect(10, 10, 620, 340, "#F7F9FB", { rx: 14, stroke: COL.line });
  // amorphous chains background
  for (let k = 0; k < 9; k++) b += wig(20, 30 + k * 38, 620, 50 + k * 34, { seed: 30 + k, amp: 16, n: 14, waves: 6, color: "#C9D2DA", w: 3 });
  // crystalline lamellae stacks
  const lam = (cx, cy, ang) => {
    let s = `<g transform="rotate(${ang} ${cx} ${cy})">`;
    s += rect(cx - 70, cy - 42, 140, 84, "#FDF2E7", { rx: 6, stroke: COL.amber, sw: 2.5 });
    for (let k = 0; k < 9; k++) s += line(cx - 60 + k * 15, cy - 34, cx - 60 + k * 15, cy + 34, COL.amber, 3);
    return s + "</g>";
  };
  b += lam(130, 110, 15) + lam(480, 90, -20) + lam(320, 250, 5) + lam(560, 270, 30);
  // Li+ path through amorphous zones
  const path = [[40, 300], [150, 260], [210, 180], [330, 140], [400, 175], [450, 215], [520, 190], [600, 160]];
  b += `<path d="${smooth(path)}" fill="none" stroke="${COL.purple}" stroke-width="4" stroke-dasharray="9 6"/>`;
  b += head(600, 160, -0.4, COL.purple, 15);
  [[150, 260], [330, 140], [520, 190]].forEach(([x, y]) => (b += li(x, y, 13)));
  b += cross(300, 250, 11);
  b += line(20, 385, 50, 385, "#C9D2DA", 4) + text(58, 391, "无定形区：链在动，Li^{+} 跟着走", { size: 16, weight: "bold" });
  b += rect(360, 375, 30, 20, "#FDF2E7", { rx: 3, stroke: COL.amber }) + text(398, 391, "晶区：排列整齐，几乎不导", { size: 16, weight: "bold", fill: "#A35A12" });
  return svg(W, H, b);
};

// ---------- Fig. 4c: modifications that lower Tg ----------
figs.tg_mods = () => {
  const W = 640, H = 560;
  let b = "";
  const pei = (x0, y0, m) => {
    // backbone zigzag with N, side chain of m EO units going up
    let s = `<polyline points="${x0},${y0} ${x0 + 25},${y0 - 14} ${x0 + 50},${y0} ${x0 + 75},${y0 - 14} ${x0 + 100},${y0}" fill="none" stroke="${COL.ink}" stroke-width="3"/>`;
    s += circ(x0 + 50, y0, 11, "#FFFFFF") + text(x0 + 50, y0 + 6, "N", { size: 17, anchor: "middle", weight: "bold", fill: "#3A62B5" });
    let x = x0 + 50, y = y0 - 12;
    for (let k = 0; k < m; k++) {
      s += line(x, y, x + 12, y - 16, COL.purple, 3) + line(x + 12, y - 16, x, y - 32, COL.purple, 3);
      s += circ(x, y - 40, 8, COL.red);
      y -= 48;
    }
    s += line(x, y + 8, x + 14, y - 6, COL.purple, 3);
    return s;
  };
  const ROW = [125, 320, 455];
  // row 1 side chain
  b += pei(20, ROW[0] + 60, 1) + pei(450, ROW[0] + 60, 3);
  b += text(70, ROW[0] + 92, "m = 1", { size: 17, anchor: "middle", fill: COL.text2 }) + text(500, ROW[0] + 92, "m = 3", { size: 17, anchor: "middle", fill: COL.text2 });
  // row 2 branching
  const net = (cx, cy, br) => {
    let s = "";
    const n = [[-50, -40], [50, -40], [-50, 40], [50, 40]];
    [[0, 1], [0, 2], [1, 3], [2, 3]].forEach(([i, j], k) => (s += wig(cx + n[i][0], cy + n[i][1], cx + n[j][0], cy + n[j][1], { seed: 70 + k, amp: 6, n: 5, color: COL.amber, w: 3 })));
    if (br) [[-50, 0, -70, -12], [50, 0, 70, 12], [0, -40, 8, -62], [0, 40, -8, 62], [-25, -40, -32, -60], [25, 40, 32, 60]].forEach(([x1, y1, x2, y2], k) => (s += wig(cx + x1, cy + y1, cx + x2, cy + y2, { seed: 90 + k, amp: 3, n: 3, color: COL.amber, w: 3 })));
    return s;
  };
  b += net(80, ROW[1], false) + net(510, ROW[1], true);
  // row 3 crosslinking
  const grid = (cx, cy, diag) => {
    let s = "";
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const x = cx - 54 + i * 36, y = cy - 54 + j * 36;
      if (i < 3) s += line(x, y, x + 36, y, COL.siDark, 2.5);
      if (j < 3) s += line(x, y, x, y + 36, COL.siDark, 2.5);
      if (diag && i < 3 && j < 3) s += line(x, y, x + 36, y + 36, COL.siDark, 2.5) + line(x + 36, y, x, y + 36, COL.siDark, 2.5);
    }
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += circ(cx - 54 + i * 36, cy - 54 + j * 36, 6, "#C9D2DA", { stroke: COL.siDark, sw: 1.5 });
    return s;
  };
  b += grid(80, ROW[2], true) + grid(510, ROW[2], false);
  [["侧链变长", ROW[0] + 30], ["支化增加", ROW[1]], ["交联减少", ROW[2]]].forEach(([t, y]) => {
    b += arrow(220, y + 10, 400, y + 10, { color: COL.ink, width: 3, head: 13 });
    b += text(310, y - 6, t, { size: 18, anchor: "middle", weight: "bold" });
  });
  b += pill(230, 524, 180, 30, COL.purple, "T_{g} ↓　σ ↑", { size: 17 });
  return svg(W, H, b);
};

// ---------- Decoupled (superionic) transport ----------
figs.decouple = () => {
  const W = 640, H = 360;
  let b = "";
  b += rect(10, 10, 300, 270, "#F7F9FB", { rx: 14 }) + rect(330, 10, 300, 270, "#F7F9FB", { rx: 14 });
  for (let k = 0; k < 6; k++) b += wig(20, 40 + k * 42, 300, 50 + k * 40, { seed: 200 + k, amp: 14, n: 10, waves: 5, color: COL.tealLight, w: 4 });
  b += li(160, 150, 14);
  b += `<path d="M 140 130 q 20 -24 40 0" fill="none" stroke="${COL.purple}" stroke-width="3"/>`;
  b += text(160, 270, "柔性链：离子随链段一起动", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  // rigid rods with frustrated packing
  const R = rng(17);
  const rods = [];
  for (let k = 0; k < 13; k++) {
    const x = 350 + R() * 250, y = 30 + R() * 200, a = (R() - 0.5) * 1.6;
    rods.push([x, y, a]);
  }
  rods.forEach(([x, y, a]) => (b += line(x - 45 * Math.cos(a), y - 45 * Math.sin(a), x + 45 * Math.cos(a), y + 45 * Math.sin(a), COL.siDark, 7)));
  b += `<path d="M 345 225 L 420 160 L 500 140 L 610 80" fill="none" stroke="${COL.purple}" stroke-width="4" stroke-dasharray="8 6"/>` + head(610, 80, -0.5, COL.purple, 14);
  b += li(470, 148, 14);
  b += text(480, 270, "刚性链堆不紧：留出“快车道”", { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(320, 330, "超离子导体：离子传输与链段弛豫“解耦”", { size: 18, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Goldilocks solvation ----------
figs.solvation = () => {
  const W = 720, H = 380;
  let b = "";
  const panel = (x0, title, sub, col) => rect(x0, 10, 220, 240, "#F7F9FB", { rx: 14 }) + text(x0 + 110, 280, title, { size: 17, anchor: "middle", weight: "bold", fill: col }) + text(x0 + 110, 304, sub, { size: 16, anchor: "middle", fill: COL.text2 });
  b += panel(10, "太弱", "盐不解离（离子对）：c 小", COL.red);
  b += panel(250, "刚刚好", "解离 + 能移动", COL.teal);
  b += panel(490, "太强", "Li^{+} 被“粘”在链上：μ 小", COL.red);
  // weak: ion pairs
  [[70, 80], [150, 150], [90, 200]].forEach(([x, y]) => (b += li(x, y, 15) + anion(x + 28, y, 15)));
  // just right
  [[300, 80], [370, 90], [300, 160]].forEach(([x, y]) => (b += line(x, y, 330, 120, COL.red, 1.5, "3 4") + circ(x, y, 8, COL.redLight)));
  b += li(330, 120, 16) + anion(410, 190, 16);
  b += arrow(352, 120, 420, 90, { color: COL.purple, width: 3.5, head: 12 });
  // strong
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * 2 * Math.PI;
    const x = 600 + 50 * Math.cos(a), y = 130 + 50 * Math.sin(a);
    b += line(600, 130, x, y, COL.red, 2.5) + circ(x, y, 10, COL.red);
  }
  b += li(600, 130, 16);
  b += anion(560, 215, 14) + arrow(575, 215, 640, 215, { color: COL.red, width: 3.5, head: 12 });
  b += arrow(30, 366, 690, 366, { color: COL.muted, width: 2.5, head: 12 });
  b += text(360, 350, "高分子对 Li^{+} 的溶剂化强度（介电常数、给体数 ↑）", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Fig. 4b: three coordination cases ----------
figs.fig4b = () => {
  const W = 720, H = 360;
  let b = "";
  const chan = (cx) => {
    let s = `<path d="M ${cx - 70} 10 C ${cx - 20} 90, ${cx - 20} 170, ${cx - 70} 250" fill="none" stroke="${COL.siDark}" stroke-width="6"/>`;
    s += `<path d="M ${cx + 70} 10 C ${cx + 20} 90, ${cx + 20} 170, ${cx + 70} 250" fill="none" stroke="${COL.siDark}" stroke-width="6"/>`;
    return s;
  };
  const ell = (x, y, rot = 0) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="30" transform="rotate(${rot} ${x} ${y})" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="2"/>` + text(x, y + 6, "−", { size: 20, anchor: "middle", weight: "bold", fill: "#A35A12" });
  // left: excessive Li coordination
  b += chan(120);
  b += li(120, 180, 16);
  [[80, 150], [160, 150], [80, 215], [160, 215]].forEach(([x, y]) => (b += line(120, 180, x, y, COL.ink, 1.5, "4 4")));
  b += arrow(132, 180, 150, 180, { color: COL.purple, width: 2, head: 8 });
  b += ell(120, 80) + arrow(106, 80, 50, 80, { color: COL.amber, width: 6, head: 16 });
  // centre: loose
  b += chan(360);
  b += li(360, 170, 16);
  [[325, 140], [395, 200]].forEach(([x, y]) => (b += line(360, 170, x, y, COL.ink, 1.5, "4 4")));
  b += arrow(378, 170, 420, 170, { color: COL.purple, width: 4, head: 12 });
  b += ell(360, 225, 90) + arrow(340, 228, 300, 236, { color: COL.amber, width: 4, head: 12 });
  // right: anion solvation
  b += chan(600);
  b += li(600, 70, 16) + arrow(618, 70, 680, 70, { color: COL.purple, width: 6, head: 16 });
  b += ell(600, 175);
  [[565, 150], [635, 150], [565, 200], [635, 200]].forEach(([x, y]) => (b += line(600, 175, x, y, COL.ink, 1.5, "4 4")));
  b += arrow(600, 210, 600, 226, { color: COL.amber, width: 2, head: 8 });
  [["配位过强", "如 PEO：t_{+} ≈ 0.2", 120], ["松散配位", "PEC、PTHF、PFPE…", 360], ["选择性溶剂化阴离子", "如聚硼烷（计算预测）", 600]].forEach(([t, u, x]) => {
    b += text(x, 290, t, { size: 17, anchor: "middle", weight: "bold" });
    b += text(x, 316, u, { size: 16, anchor: "middle", fill: COL.text2 });
  });
  b += text(360, 350, "箭头粗细 = 迁移率大小", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Solvation-site connectivity ----------
figs.connectivity = () => {
  const W = 640, H = 360;
  let b = "";
  b += rect(10, 10, 300, 270, "#F7F9FB", { rx: 14 }) + rect(330, 10, 300, 270, "#F7F9FB", { rx: 14 });
  // dense, homogeneous sites
  const R = rng(11);
  const sites = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) sites.push([40 + i * 48 + (R() - 0.5) * 10, 45 + j * 50 + (R() - 0.5) * 10]);
  sites.forEach(([x, y]) => (b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="${COL.purpleLight}" opacity="0.8"/>`));
  const p1 = [sites[10], sites[11], sites[16], sites[17], sites[22], sites[23], sites[28]];
  b += `<polyline points="${p1.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${COL.purple}" stroke-width="3.5" stroke-dasharray="7 5"/>`;
  b += li(p1[0][0], p1[0][1], 13);
  b += text(160, 270, "位点多、近、均匀：一路跳过去", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  // sparse, clustered
  const cl = [[380, 70], [400, 95], [372, 108], [560, 210], [585, 190], [575, 232], [480, 60], [450, 220]];
  cl.forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="12" fill="${COL.purpleLight}" opacity="0.8"/>`));
  b += li(400, 95, 13);
  b += arrow(415, 105, 470, 150, { color: COL.purple, width: 3, head: 11, dash: "6 5" }) + cross(490, 160, 10);
  b += text(480, 270, "位点少、远、成团：跳不出去", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(320, 330, "浅紫圆 = 能“接住”Li^{+} 的溶剂化位点", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Single-ion conductor ----------
figs.single_ion = () => {
  const W = 640, H = 380;
  let b = "";
  b += rect(10, 10, 300, 290, "#F7F9FB", { rx: 14 }) + rect(330, 10, 300, 290, "#F7F9FB", { rx: 14 });
  // left: dissolved salt
  b += wig(20, 150, 300, 150, { seed: 300, amp: 14, n: 10, waves: 4, color: COL.tealLight, w: 4 });
  [[70, 80], [200, 90], [120, 220], [250, 210]].forEach(([x, y]) => (b += li(x, y, 13) + arrow(x + 16, y, x + 50, y, { color: COL.purple, width: 3, head: 10 })));
  [[150, 60], [60, 190], [200, 250], [270, 120]].forEach(([x, y]) => (b += anion(x, y, 13) + arrow(x - 16, y, x - 44, y, { color: COL.red, width: 3, head: 10 })));
  b += text(160, 330, "普通盐：阴、阳离子都动", { size: 16, anchor: "middle", weight: "bold" });
  b += text(160, 356, "t_{+} ≈ 0.2", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  // right: tethered anions
  b += wig(340, 150, 620, 150, { seed: 301, amp: 10, n: 10, waves: 3, color: COL.tealLight, w: 4 });
  [380, 450, 520, 590].forEach((x, i) => {
    const y = i % 2 ? 190 : 110;
    b += line(x, 150, x, y, COL.siDark, 3) + anion(x, y, 13);
  });
  [[420, 70], [560, 240], [470, 250], [545, 60]].forEach(([x, y]) => (b += li(x, y, 13) + arrow(x + 16, y, x + 50, y, { color: COL.purple, width: 3, head: 10 })));
  b += text(480, 330, "单离子导体：阴离子挂在链上", { size: 16, anchor: "middle", weight: "bold" });
  b += text(480, 356, "t_{+} ≈ 1", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- Electrochemical stability window ----------
figs.esw = () => {
  const W = 620, H = 450;
  let b = "";
  b += line(60, 410, 60, 30, COL.ink, 3) + head(60, 22, -Math.PI / 2, COL.ink, 13);
  b += `<g transform="translate(30 220) rotate(-90)">` + text(0, 0, "电子能量 E", { size: 17, anchor: "middle", weight: "bold" }) + `</g>`;
  // electrolyte window
  b += rect(230, 90, 170, 260, COL.electrolyte, { rx: 0 });
  b += line(220, 90, 410, 90, "#3A7CA5", 4) + text(410, 82, "LUMO", { size: 16, anchor: "end", weight: "bold", fill: "#3A7CA5" });
  b += line(220, 350, 410, 350, "#3A7CA5", 4) + text(410, 374, "HOMO", { size: 16, anchor: "end", weight: "bold", fill: "#3A7CA5" });
  b += arrow(315, 120, 315, 320, { color: "#3A7CA5", width: 2.5, head: 11 }) + arrow(315, 320, 315, 120, { color: "#3A7CA5", width: 2.5, head: 11 });
  b += lines(326, 214, ["稳定窗口 E_{g}"], { size: 16, weight: "bold", fill: "#3A7CA5" });
  b += text(315, 400, "电解质", { size: 17, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  // anode
  b += rect(80, 40, 120, 360, "#B9C3CC", { rx: 0 });
  b += rect(80, 125, 120, 275, "#8F9BA6", { rx: 0 });
  b += line(80, 125, 210, 125, COL.purple, 4) + text(140, 118, "μ_{A}", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(140, 425, "负极", { size: 17, anchor: "middle", weight: "bold" });
  // cathode
  b += rect(430, 40, 120, 360, COL.amberLight, { rx: 0 });
  b += rect(430, 310, 120, 90, COL.amber, { rx: 0 });
  b += line(420, 310, 550, 310, "#A35A12", 4) + text(490, 302, "μ_{C}", { size: 18, anchor: "middle", weight: "bold", fill: "#A35A12" });
  b += text(490, 425, "正极", { size: 17, anchor: "middle", weight: "bold" });
  b += lines(140, 60, ["μ_{A} 高于 LUMO", "→ 电解质被还原"], { size: 16, anchor: "middle", fill: COL.red, weight: "bold", lh: 20 });
  b += lines(490, 345, ["μ_{C} 低于 HOMO", "→ 电解质被氧化"], { size: 16, anchor: "middle", fill: "#FFFFFF", weight: "bold", lh: 20 });
  b += text(580, 210, "能量越低 = 电位越正", { size: 16, anchor: "middle", fill: COL.muted, weight: "bold" }).replace("<text ", `<text transform="rotate(90 580 210)" `);
  return svg(W, H, b);
};

module.exports = figs;
