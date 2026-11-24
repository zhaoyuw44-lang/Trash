// Figures for 锂电池发展史 Chapter 3: 1973–1983 聚合物电解质与 SEI
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, ion, electron, rng, blob } = L;

const figs = {};
const LI = COL.purple;
const SEI = COL.sei;
const SOL = COL.electrolyte;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${(+cx).toFixed(1)}" cy="${(+cy).toFixed(1)}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const poly = (pts, c, w = 3, fill = "none") =>
  `<polyline points="${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
const path = (d, c, w = 3, fill = "none", dash) =>
  `<path d="${d}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

// Ether oxygen atom
const oAtom = (x, y, r = 13, fill = COL.red) =>
  circ(x, y, r, fill) + text(x, y + r * 0.45, "O", { size: Math.round(r * 1.25), anchor: "middle", weight: "bold", fill: "#FFFFFF" });
const liIon = (x, y, r = 19, fill = LI) => ion(x, y, { r, fill, label: "Li^{+}" });

// Polymer chain wrapped as an arc around (cx,cy): backbone zig-zag, every 3rd node an oxygen on the inner side.
function wrapChain(cx, cy, a0, a1, rIn, rOut, step, o = {}) {
  const pts = [], oxy = [];
  let k = 0;
  for (let a = a0; a <= a1 + 0.01; a += step, k++) {
    const isO = k % 3 === 0;
    const r = isO ? rIn : (k % 3 === 1 ? rOut : rOut - 6);
    const t = (a * Math.PI) / 180;
    const p = [cx + r * Math.cos(t), cy + r * Math.sin(t)];
    pts.push(p);
    if (isO) oxy.push(p);
  }
  let b = poly(pts, o.color || COL.ink, o.w || 3.5);
  oxy.forEach(([x, y]) => (b += oAtom(x, y, o.or || 12)));
  return { svg: b, oxy, pts };
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  // top: PEO wrapping Li+
  const c = wrapChain(215, 150, 150, 420, 62, 86, 22.5, { color: "#CADCE8", or: 13 });
  b += c.svg;
  c.oxy.forEach(([x, y]) => (b += line(215, 150, x, y, "#C9B8E8", 2, "4 4")));
  b += liIon(215, 150, 24);
  b += text(215, 290, "1973 · 聚环氧乙烷“抱住”离子", { size: 22, anchor: "middle", fill: "#C9B8E8", weight: "bold" });
  // bottom: SEI
  const y0 = 330, h = 150;
  b += rect(20, y0, 120, h, "#8E7CC3", { rx: 6 });
  b += text(80, y0 + h / 2 + 9, "Li", { size: 28, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += rect(140, y0, 36, h, SEI);
  for (let i = 0; i < 9; i++) b += circ(150 + (i % 2) * 14, y0 + 12 + i * 16, 4, "#D9A07A");
  b += rect(176, y0, 234, h, "#2B3D4F", { rx: 6 });
  b += arrow(330, y0 + 45, 120, y0 + 45, { color: "#C9B8E8", width: 4, head: 15 });
  b += ion(350, y0 + 45, { r: 17, fill: LI, label: "Li^{+}" });
  b += electron(100, y0 + 108, 15);
  b += arrow(118, y0 + 108, 150, y0 + 108, { color: COL.amber, width: 4, head: 12 });
  b += cross(195, y0 + 108, 11, "#F2B8B4", 5);
  b += text(215, y0 + h + 40, "1979 · SEI：只放行 Li^{+}", { size: 22, anchor: "middle", fill: "#F6C58E", weight: "bold" });
  return svg(W, H, b);
};

// ---------- 1. Era timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const P = LI, T = SEI, A = COL.amber;
  const ev = [
    { year: "1967", who: ["Pedersen"], what: ["冠醚“抱住”", "金属离子"], color: P },
    { year: "1970", who: ["Dey"], what: ["锂表面有一层", "导 Li^{+} 的膜"], color: T },
    { year: "1973", who: ["Fenton, Parker", "& Wright"], what: ["PEO–碱金属盐", "晶态络合物"], color: P },
    { year: "1975", who: ["Wright"], what: ["测出络合物", "的电导率"], color: P },
    { year: "1978", who: ["Armand 等"], what: ["提出用作锂电池", "固体电解质"], color: P },
    { year: "1979", who: ["Peled"], what: ["SEI 模型", "（1977 年报告）"], color: T },
    { year: "1980", who: ["Lazzari & Scrosati"], what: ["“摇椅”电池", "实验演示"], color: A },
    { year: "1983", who: ["Berthier 等"], what: ["NMR：离子在", "无定形区运动"], color: P },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 85, right: 1125, whoSize: 18, whatSize: 18, yearSize: 24 });
  b += pill(700, 395, 170, 30, P, "聚合物电解质", { size: 17 }) + pill(885, 395, 150, 30, T, "SEI", { size: 17 }) + pill(1050, 395, 150, 30, A, "摇椅电池", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Three kinds of electrolyte ----------
figs.electrolyte_types = () => {
  const W = 820, H = 540;
  let b = "";
  const cards = [
    { x: 12, title: "液体电解液", sub: "PC + 锂盐（第 1、2 章）", fill: "#E8F4F3", c: COL.teal,
      pros: [[1, "导离子快"]], cons: [[0, "会漏、易燃"], [0, "挡不住锂枝晶"]] },
    { x: 280, title: "无机陶瓷", sub: "β-氧化铝 (1967)", fill: COL.light, c: COL.siDark,
      pros: [[1, "固体、不燃"]], cons: [[0, "硬而脆"], [0, "和电极接触差"]] },
    { x: 548, title: "聚合物", sub: "PEO + 锂盐 (1978)", fill: "#F1ECF8", c: LI,
      pros: [[1, "软，能做薄膜"], [1, "贴紧电极"]], cons: [[0, "室温导电差"]] },
  ];
  const cw = 260;
  cards.forEach((k, i) => {
    b += rect(k.x, 10, cw, 520, k.fill, { rx: 16 });
    b += text(k.x + cw / 2, 52, k.title, { size: 26, anchor: "middle", weight: "bold", fill: k.c });
    b += text(k.x + cw / 2, 84, k.sub, { size: 18, anchor: "middle", fill: COL.text2 });
    // icon area 105..285
    const cx = k.x + cw / 2, cy = 200;
    if (i === 0) {
      b += path(`M ${cx - 70} 120 L ${cx - 70} 270 Q ${cx - 70} 285 ${cx - 55} 285 L ${cx + 55} 285 Q ${cx + 70} 285 ${cx + 70} 270 L ${cx + 70} 120`, COL.ink, 3);
      b += rect(cx - 67, 160, 134, 122, SOL, { rx: 8 });
      b += path(`M ${cx - 67} 160 Q ${cx - 35} 150 ${cx} 160 T ${cx + 67} 160`, COL.teal, 2.5);
      [[-35, 195], [20, 215], [-10, 250], [40, 255]].forEach(([dx, y], j) => (b += j % 2 ? circ(cx + dx, y, 9, COL.muted) : liIon(cx + dx, y, 15)));
    } else if (i === 1) {
      for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) {
        const x = cx - 80 + q * 40 + (r % 2) * 20, y = 135 + r * 40;
        b += circ(x, y, 15, r % 2 ? "#AEB8C2" : "#7C8B99");
      }
      b += path(`M ${cx + 30} 118 L ${cx + 8} 175 L ${cx + 28} 200 L ${cx + 2} 268`, COL.red, 3.5);
      b += text(cx + 50, 285, "裂纹", { size: 18, fill: COL.red });
    } else {
      const R = rng(7);
      for (let j = 0; j < 4; j++) {
        let d = `M ${cx - 95} ${130 + j * 40}`;
        for (let s = 1; s <= 6; s++) d += ` Q ${cx - 95 + s * 32 - 16} ${130 + j * 40 + (R() - 0.5) * 60} ${cx - 95 + s * 32} ${130 + j * 40 + (R() - 0.5) * 20}`;
        b += path(d, j % 2 ? "#9C86C9" : LI, 3.5);
      }
      b += liIon(cx - 30, 175, 15) + liIon(cx + 40, 230, 15);
    }
    let y = 335;
    k.pros.forEach(([, t]) => { b += check(k.x + 32, y - 7, 10, COL.teal, 4) + text(k.x + 56, y, t, { size: 20 }); y += 44; });
    k.cons.forEach(([, t]) => { b += cross(k.x + 32, y - 7, 9, COL.red, 4) + text(k.x + 56, y, t, { size: 20 }); y += 44; });
  });
  return svg(W, H, b);
};

// ---------- 3. Crown ether -> PEO ----------
figs.crown_peo = () => {
  const W = 820, H = 540;
  let b = "";
  // 18-crown-6
  const cx = 190, cy = 215, R = 105;
  const pts = [];
  for (let i = 0; i < 18; i++) {
    const t = ((i * 20 - 90) * Math.PI) / 180;
    const r = i % 3 === 0 ? R - 12 : R + 4;
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  b += poly([...pts, pts[0]], COL.ink, 3.5);
  pts.forEach(([x, y], i) => { if (i % 3 === 0) b += line(cx, cy, x, y, COL.amberLight, 2, "4 4"); });
  pts.forEach(([x, y], i) => { if (i % 3 === 0) b += oAtom(x, y, 14); });
  b += ion(cx, cy, { r: 24, fill: COL.amber, label: "K^{+}" });
  b += text(cx, 365, "18-冠-6 抱住 K^{+}", { size: 22, anchor: "middle", weight: "bold" });
  b += text(cx, 395, "Pedersen 1967：6 个氧围成一圈", { size: 18, anchor: "middle", fill: COL.text2 });
  // arrow
  b += arrow(330, 215, 420, 215, { color: COL.purple, width: 4, head: 16 });
  b += text(375, 190, "把环剪开", { size: 18, anchor: "middle", fill: LI, weight: "bold" });
  b += text(375, 250, "拉成长链", { size: 18, anchor: "middle", fill: LI, weight: "bold" });
  // PEO wrapping Li+
  const c = wrapChain(610, 215, 120, 400, 68, 94, 20);
  b += c.svg;
  const p0 = c.pts[0], p1 = c.pts[c.pts.length - 1];
  b += poly([p0, [p0[0] - 30, p0[1] + 30], [p0[0] - 50, p0[1] + 20], [p0[0] - 80, p0[1] + 52]], COL.ink, 3.5);
  b += poly([p1, [p1[0] + 34, p1[1] - 18], [p1[0] + 54, p1[1] + 6], [p1[0] + 86, p1[1] - 12]], COL.ink, 3.5);
  c.oxy.forEach(([x, y]) => (b += line(610, 215, x, y, COL.purpleLight, 2, "4 4")));
  c.oxy.forEach(([x, y]) => (b += oAtom(x, y, 12)));
  b += liIon(610, 215, 24);
  b += text(610, 365, "PEO 链绕住 Li^{+}", { size: 22, anchor: "middle", weight: "bold", fill: LI });
  b += text(610, 395, "链很长，可以一圈圈缠", { size: 18, anchor: "middle", fill: COL.text2 });
  // formula strip
  b += rect(30, 430, 760, 95, COL.light, { rx: 14 });
  b += text(60, 475, "聚环氧乙烷 PEO：", { size: 22, weight: "bold" });
  b += text(250, 475, "—(CH_{2}—CH_{2}—O)_{n}—", { size: 26, weight: "bold", fill: COL.ink });
  b += text(60, 510, "每 3 个链原子就有 1 个醚氧 (ether oxygen)，正好能“抓”阳离子", { size: 19, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 4. Fenton 1973 experiment ----------
figs.fenton_process = () => {
  const W = 820, H = 540;
  let b = "";
  // step 1 beaker
  const bx = 40;
  b += rect(bx - 10, 15, 230, 300, COL.light, { rx: 14 });
  b += text(bx + 105, 50, "① 溶在甲醇里", { size: 21, anchor: "middle", weight: "bold" });
  b += path(`M ${bx + 40} 80 L ${bx + 40} 215 Q ${bx + 40} 230 ${bx + 55} 230 L ${bx + 155} 230 Q ${bx + 170} 230 ${bx + 170} 215 L ${bx + 170} 80`, COL.ink, 3);
  b += rect(bx + 43, 120, 124, 107, SOL, { rx: 6 });
  [[70, 150], [130, 165], [95, 200], [145, 205]].forEach(([dx, y], i) => (b += i % 2 ? circ(bx + dx, y, 8, COL.muted) : ion(bx + dx, y, { r: 11, fill: COL.amber, label: "+" })));
  b += path(`M ${bx + 55} 140 Q ${bx + 80} 125 ${bx + 100} 145 T ${bx + 150} 140`, LI, 3);
  b += lines(bx + 105, 262, ["NaI : EO 单元", "= 1 : 4"], { size: 19, anchor: "middle", lh: 26, weight: "bold", fill: LI });
  // arrow
  b += arrow(270, 165, 320, 165, { color: COL.ink, width: 3.5, head: 14 });
  // step 2 microscope
  const mx = 330;
  b += rect(mx, 15, 230, 300, COL.light, { rx: 14 });
  b += text(mx + 115, 50, "② 蒸干：长出球晶", { size: 21, anchor: "middle", weight: "bold" });
  const sx = mx + 115, sy = 165;
  b += circ(sx, sy, 80, "#2B3D4F");
  for (let a = 0; a < 360; a += 12) {
    const t = (a * Math.PI) / 180;
    b += line(sx + 8 * Math.cos(t), sy + 8 * Math.sin(t), sx + 70 * Math.cos(t), sy + 70 * Math.sin(t), "#CADCE8", 1.6);
  }
  b += `<polygon points="${sx - 70},${sy - 8} ${sx + 70},${sy - 8} ${sx + 70},${sy + 8} ${sx - 70},${sy + 8}" fill="#2B3D4F" opacity="0.85"/>`;
  b += `<polygon points="${sx - 8},${sy - 70} ${sx + 8},${sy - 70} ${sx + 8},${sy + 70} ${sx - 8},${sy + 70}" fill="#2B3D4F" opacity="0.85"/>`;
  b += lines(sx, 275, ["偏光显微镜下", "出现“十字”消光"], { size: 18, anchor: "middle", lh: 24, fill: COL.text2 });
  // step 3: melting points
  b += arrow(565, 165, 600, 165, { color: COL.ink, width: 3.5, head: 14 });
  const tx = 605;
  b += rect(tx, 15, 205, 300, "#FDF2E7", { rx: 14 });
  b += text(tx + 102, 50, "③ 熔点大升", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  const base = 265, sc = 0.72;
  [["纯 PEO", 65, COL.muted], ["+ NaI", 200, COL.amber]].forEach(([n, v, c], i) => {
    const x = tx + 35 + i * 85;
    b += rect(x, base - v * sc, 50, v * sc, c, { rx: 4 });
    b += text(x + 25, base - v * sc - 10, `~${v} °C`, { size: 18, anchor: "middle", weight: "bold", fill: c });
    b += text(x + 25, base + 28, n, { size: 18, anchor: "middle" });
  });
  // bottom: fibre repeat
  b += rect(30, 340, 780, 185, COL.light, { rx: 14 });
  b += text(55, 378, "④ 拉成纤维，用 X 射线量链的重复周期 c", { size: 21, weight: "bold" });
  const spring = (x0, len, turns, y, c) => {
    let d = `M ${x0} ${y}`;
    for (let i = 0; i < turns * 2; i++) d += ` Q ${x0 + (i + 0.5) * (len / (turns * 2))} ${y + (i % 2 ? 24 : -24)} ${x0 + (i + 1) * (len / (turns * 2))} ${y}`;
    return path(d, c, 4);
  };
  b += text(55, 433, "纯 PEO", { size: 19, fill: COL.text2 });
  b += spring(170, 400, 4, 427, COL.ink);
  b += text(590, 433, "c = 19.25 Å", { size: 20, weight: "bold" });
  b += text(55, 493, "+ KSCN", { size: 19, fill: COL.text2 });
  b += spring(170, 168, 4, 487, LI);
  b += text(360, 493, "c = 8.1 Å：链被盐“缠紧”", { size: 20, weight: "bold", fill: LI });
  return svg(W, H, b);
};

// ---------- 5. Which salts form complexes ----------
figs.salt_grid = () => {
  const W = 820, H = 540;
  let b = "";
  const an = ["F^{−}", "Cl^{−}", "Br^{−}", "I^{−}", "SCN^{−}"];
  const cat = [["Li^{+}", "0.76 Å", 22], ["Na^{+}", "1.02 Å", 29], ["K^{+}", "1.38 Å", 39]];
  // 0 none reported, 1 crystalline complex, 2 no solid complex, 3 interacts in solution, 4 spherulites unknown
  const M = [
    [[0], [0], [3], [4], [0]],
    [[0], [2], [2], [1, "~200 °C"], [1, "~170 °C"]],
    [[2], [2], [2], [3, "弹性体*"], [1, "~170 °C"]],
  ];
  const gx = 215, cw = 118, gy = 70, rh = 100;
  an.forEach((a, j) => (b += text(gx + j * cw + cw / 2, gy - 18, a, { size: 24, anchor: "middle", weight: "bold", fill: COL.text2 })));
  cat.forEach(([c, r, rr], i) => {
    const y = gy + i * rh;
    b += rect(25, y + 4, 780, rh - 8, i % 2 ? "#FFFFFF" : COL.light, { rx: 10 });
    b += circ(70, y + rh / 2, rr, i === 0 ? LI : COL.amber);
    b += text(70, y + rh / 2 + 7, c, { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += text(150, y + rh / 2 + 7, r, { size: 18, anchor: "middle", fill: COL.text2 });
    M[i].forEach(([m, lab], j) => {
      const x = gx + j * cw + cw / 2, yy = y + rh / 2 - (lab ? 10 : 0);
      if (m === 0) b += text(x, yy + 7, "—", { size: 20, anchor: "middle", fill: COL.line });
      if (m === 1) b += circ(x, yy, 22, "#E8F4F3") + check(x, yy, 12, COL.teal, 5);
      if (m === 2) b += cross(x, yy, 11, COL.red, 5);
      if (m === 3) b += text(x, yy + 10, "△", { size: 28, anchor: "middle", weight: "bold", fill: COL.amber });
      if (m === 4) b += text(x, yy + 10, "◎", { size: 30, anchor: "middle", weight: "bold", fill: LI });
      if (lab) b += text(x, yy + 40, lab, { size: 18, anchor: "middle", fill: COL.text2, weight: "bold" });
    });
  });
  b += text(70, gy - 18, "阳离子", { size: 18, anchor: "middle", fill: COL.muted });
  b += text(150, gy - 18, "半径", { size: 18, anchor: "middle", fill: COL.muted });
  // legend
  const ly = 395;
  b += circ(45, ly, 16, "#E8F4F3") + check(45, ly, 9, COL.teal, 4) + text(70, ly + 7, "晶态络合物（熔点）", { size: 18 });
  b += cross(305, ly, 9, COL.red, 4) + text(325, ly + 7, "不形成固体络合物", { size: 18 });
  b += text(555, ly + 9, "△", { size: 24, anchor: "middle", weight: "bold", fill: COL.amber }) + text(575, ly + 7, "只在溶液中有作用", { size: 18 });
  b += text(45, ly + 52, "◎", { size: 24, anchor: "middle", weight: "bold", fill: LI }) + text(70, ly + 50, "LiI：出现球晶，“性质待查”", { size: 18 });
  b += text(380, ly + 50, "— 原文未提；Rb^{+}、Cs^{+} 盐：溶液中有作用", { size: 18, fill: COL.text2 });
  b += text(30, ly + 100, "* KI 一格来自 Lundberg 等 1966：KI 破坏 PEO 结晶，得到弹性体。半径为 Shannon 六配位值。", { size: 18, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 6. Li-metal-polymer cell (Armand 1978 proposal) ----------
figs.lmp_cell = () => {
  const W = 820, H = 540;
  let b = "";
  const top = 130, h = 250;
  // current collector right, Li foil left
  b += rect(40, top, 100, h, "#8E7CC3", { rx: 6 });
  b += text(90, top + h / 2 + 10, "Li", { size: 30, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  // polymer film
  b += rect(140, top, 170, h, "#F1ECF8");
  const R = rng(11);
  for (let j = 0; j < 6; j++) {
    let d = `M 145 ${top + 22 + j * 40}`;
    for (let s = 1; s <= 5; s++) d += ` Q ${145 + s * 32 - 16} ${top + 22 + j * 40 + (R() - 0.5) * 40} ${145 + s * 32} ${top + 22 + j * 40 + (R() - 0.5) * 12}`;
    b += path(d, "#B9A6DE", 3);
  }
  // composite cathode
  b += rect(310, top, 250, h, "#F7F4EC");
  for (let j = 0; j < 7; j++) b += blob(345 + (j % 3) * 85 + (Math.floor(j / 3) % 2) * 40, top + 45 + Math.floor(j / 3) * 80, 30, 40 + j, { fill: COL.si });
  const R2 = rng(5);
  for (let j = 0; j < 26; j++) b += circ(318 + R2() * 235, top + 8 + R2() * (h - 16), 4, COL.ink);
  b += rect(560, top, 22, h, COL.alu);
  // Li+ arrows through polymer
  [top + 60, top + 130, top + 200].forEach((y, i) => {
    b += arrow(120, y, 330, y, { color: LI, width: 3.5, head: 14 });
    b += ion(170 + i * 45, y, { r: 15, fill: LI, label: "+" });
  });
  // external circuit
  b += line(90, top, 90, 60, COL.ink, 3) + line(90, 60, 571, 60, COL.ink, 3) + line(571, 60, 571, top, COL.ink, 3);
  b += circ(330, 60, 24, "#FFF6D6", { stroke: COL.sulfur, sw: 3 });
  b += electron(200, 60, 13) + electron(450, 60, 13);
  b += arrow(215, 36, 285, 36, { color: COL.amber, width: 3 }) + arrow(375, 36, 445, 36, { color: COL.amber, width: 3 });
  b += text(330, 26, "放电：电子走外电路", { size: 18, anchor: "middle", fill: COL.amber, weight: "bold" });
  // labels
  b += lines(90, top + h + 35, ["锂金属", "负极"], { size: 19, anchor: "middle", weight: "bold", lh: 25, fill: LI });
  b += lines(225, top + h + 35, ["PEO–锂盐", "薄膜（固体）"], { size: 19, anchor: "middle", weight: "bold", lh: 25, fill: LI });
  b += lines(440, top + h + 35, ["复合正极：嵌入材料", "+ PEO + 炭黑"], { size: 19, anchor: "middle", weight: "bold", lh: 25 });
  b += text(571, top + h + 35, "Al", { size: 19, anchor: "middle", fill: COL.text2 });
  // side notes
  const nx = 610;
  b += rect(nx, top, 200, h, COL.light, { rx: 14 });
  b += lines(nx + 18, top + 45, ["没有液体：", "不漏、不挥发", "", "薄膜能卷绕", "", "60–80 °C 工作"], { size: 19, lh: 30 });
  b += text(410, 520, "正极颗粒之间也要填 PEO，否则 Li^{+} 走不到颗粒里", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 7. Hopping with segmental motion ----------
figs.hopping = () => {
  const W = 1240, H = 330;
  let b = "";
  const panel = (ox, stage) => {
    let s = rect(ox, 10, 380, 250, stage === 1 ? "#F1ECF8" : COL.light, { rx: 14 });
    const ay = 135, ax = ox + 110;
    const bx = ox + (stage === 1 ? 215 : 280);
    const A = wrapChain(ax, ay, 60, 300, 55, 76, 20);
    const B = wrapChain(bx, ay, -120, 120, 55, 76, 20);
    // tails: the cages are parts of long chains
    [A, B].forEach((C) => {
      [C.pts[0], C.pts[C.pts.length - 1]].forEach((p) => {
        const g = p[1] > ay ? 1 : -1;
        s += poly([p, [p[0] + 12, p[1] + 22 * g], [p[0] - 4, p[1] + 40 * g], [p[0] + 8, p[1] + 58 * g]], COL.ink, 3.5);
      });
    });
    s += A.svg + B.svg;
    const liPos = stage === 0 ? [ax, ay] : stage === 1 ? [(ax + bx) / 2, ay] : [bx, ay];
    const near = [...A.oxy, ...B.oxy].filter(([x, y]) => Math.hypot(x - liPos[0], y - liPos[1]) < 70);
    near.forEach(([x, y]) => (s += line(liPos[0], liPos[1], x, y, COL.purple, 2, "4 4")));
    s += liIon(liPos[0], liPos[1], 18);
    if (stage === 1) {
      s += arrow(ox + 330, 135, ox + 300, 135, { color: COL.amber, width: 3.5, head: 12 });
      s += text(ox + 340, 70, "链段", { size: 18, fill: COL.amber, weight: "bold", anchor: "middle" });
      s += text(ox + 340, 95, "靠过来", { size: 18, fill: COL.amber, weight: "bold", anchor: "middle" });
    }
    return s;
  };
  [0, 1, 2].forEach((k) => (b += panel(20 + k * 410, k)));
  b += arrow(402, 135, 428, 135, { color: COL.ink, width: 3, head: 12 }) + arrow(812, 135, 838, 135, { color: COL.ink, width: 3, head: 12 });
  const cap = ["① Li^{+} 被几个醚氧包围", "② 链段扭动，别的氧靠过来", "③ Li^{+} 换到新“笼子”里"];
  cap.forEach((c, k) => (b += text(210 + k * 410, 300, c, { size: 21, anchor: "middle", weight: "bold", fill: k === 1 ? LI : COL.ink })));
  return svg(W, H, b);
};

// ---------- 8. Crystalline vs amorphous + temperature scale ----------
figs.cryst_amorph = () => {
  const W = 820, H = 540;
  let b = "";
  // crystalline panel
  b += rect(15, 10, 385, 270, COL.light, { rx: 14 });
  b += text(207, 45, "晶区：排得整整齐齐", { size: 21, anchor: "middle", weight: "bold" });
  for (let r = 0; r < 4; r++) {
    let d = `M 45 ${85 + r * 50}`;
    for (let i = 0; i < 12; i++) d += ` Q ${45 + i * 27 + 13} ${85 + r * 50 + (i % 2 ? 12 : -12)} ${45 + (i + 1) * 27} ${85 + r * 50}`;
    b += path(d, COL.siDark, 3);
  }
  [[110, 110], [245, 160], [180, 210]].forEach(([x, y]) => (b += liIon(x, y, 15) + `<rect x="${x - 20}" y="${y - 20}" width="40" height="40" fill="none" stroke="${COL.red}" stroke-width="2.5" rx="6"/>`));
  b += text(207, 265, "离子被“卡”在固定位置", { size: 18, anchor: "middle", fill: COL.red });
  // amorphous panel
  b += rect(420, 10, 385, 270, "#F1ECF8", { rx: 14 });
  b += text(612, 45, "无定形区：乱而能动", { size: 21, anchor: "middle", weight: "bold", fill: LI });
  const R = rng(21);
  for (let j = 0; j < 5; j++) {
    let x = 440, y = 80 + j * 36;
    let d = `M ${x} ${y}`;
    for (let s = 0; s < 7; s++) {
      const nx = x + 48, ny = 70 + R() * 170;
      d += ` Q ${x + 24} ${(y + ny) / 2 + (R() - 0.5) * 60} ${nx} ${ny}`;
      x = nx; y = ny;
    }
    b += path(d, j % 2 ? "#9C86C9" : LI, 2.6);
  }
  [[510, 120], [650, 200], [730, 110]].forEach(([x, y]) => (b += liIon(x, y, 15)));
  b += arrow(525, 120, 600, 150, { color: COL.amber, width: 3, head: 12 }) + arrow(665, 200, 720, 230, { color: COL.amber, width: 3, head: 12 });
  b += text(612, 265, "链在扭动，离子跟着走", { size: 18, anchor: "middle", fill: LI });
  // temperature scale
  const x0 = 50, x1 = 780, tmin = -90, tmax = 110;
  const X = (t) => x0 + ((t - tmin) / (tmax - tmin)) * (x1 - x0);
  const ay = 400;
  b += rect(X(tmin), ay - 40, X(-60) - X(tmin), 40, "#DDE3E8");
  b += rect(X(-60), ay - 40, X(65) - X(-60), 40, "#EDE6F6");
  b += rect(X(65), ay - 40, X(tmax) - X(65), 40, "#F6C58E");
  b += text((X(tmin) + X(-60)) / 2, ay - 13, "全冻住", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(X(-18), ay - 13, "无定形能动，但大部分是晶区", { size: 18, anchor: "middle", fill: LI });
  b += text((X(65) + X(tmax)) / 2, ay - 13, "晶区全熔", { size: 18, anchor: "middle", fill: "#8A4B0F", weight: "bold" });
  b += line(x0, ay, x1, ay, COL.ink, 3);
  [-80, -40, 0, 40, 80].forEach((t) => (b += line(X(t), ay, X(t), ay + 8, COL.ink, 2) + text(X(t), ay + 30, `${t}`, { size: 18, anchor: "middle", fill: COL.text2 })));
  b += text(x1, ay + 30, "°C", { size: 18, anchor: "end", fill: COL.text2 });
  const mk = (t, lab, c) => (b += line(X(t), ay - 48, X(t), ay + 45, c, 3, "6 5") + text(X(t), ay + 68, lab, { size: 19, anchor: "middle", weight: "bold", fill: c }));
  mk(-60, "Tg ≈ −60 °C", COL.siDark);
  mk(25, "室温", COL.ink);
  mk(65, "Tm ≈ 65 °C", COL.amber);
  b += text(X(70), ay + 100, "电池工作温度 60–80 °C", { size: 19, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- 9. The puzzle: why does Li survive? ----------
figs.li_puzzle = () => {
  const W = 820, H = 540;
  let b = "";
  // left: expectation
  b += rect(15, 10, 385, 400, "#FBEDEC", { rx: 14 });
  b += text(207, 48, "热力学预言", { size: 23, anchor: "middle", weight: "bold", fill: COL.red });
  b += rect(85, 150, 120, 170, "none", { rx: 6, stroke: LI, sw: 2.5, dash: "8 6" });
  b += rect(105, 190, 80, 130, "#8E7CC3", { rx: 6 });
  b += text(145, 262, "Li", { size: 26, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  [[240, 140], [270, 200], [235, 260], [290, 300], [250, 95]].forEach(([x, y], i) => (b += circ(x, y, 9 + (i % 3) * 3, "#FFFFFF", { stroke: COL.red, sw: 2 })));
  b += arrow(300, 230, 205, 230, { color: COL.red, width: 3.5, head: 13 });
  b += lines(207, 360, ["溶剂不断被锂还原，", "锂越来越少"], { size: 19, anchor: "middle", lh: 26 });
  // right: reality
  b += rect(420, 10, 385, 400, "#E8F4F3", { rx: 14 });
  b += text(612, 48, "实际情况", { size: 23, anchor: "middle", weight: "bold", fill: COL.teal });
  b += rect(490, 150, 120, 170, "#8E7CC3", { rx: 6 });
  b += text(550, 242, "Li", { size: 26, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += rect(610, 150, 14, 170, SEI);
  for (let i = 0; i < 8; i++) b += circ(617, 160 + i * 21, 3.5, "#D9A07A");
  [[690, 160], [720, 225], [680, 290]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="22" ry="12" fill="${COL.tealLight}"/>`));
  b += arrow(665, 225, 632, 225, { color: COL.teal, width: 3, head: 11 });
  b += cross(645, 195, 9, COL.red, 4);
  b += lines(612, 360, ["表面一层薄膜挡住溶剂，", "锂能放好几年"], { size: 19, anchor: "middle", lh: 26 });
  // bottom: the question
  b += rect(15, 425, 790, 105, COL.light, { rx: 14 });
  b += text(410, 465, "锂电位 −3.04 V，几乎能还原所有有机溶剂", { size: 21, anchor: "middle", weight: "bold" });
  b += text(410, 505, "那么：这层膜是什么？离子又是怎么穿过它的？", { size: 21, anchor: "middle", weight: "bold", fill: SEI });
  return svg(W, H, b);
};

// ---------- 10. Peled Table I ----------
figs.table1 = () => {
  const W = 1240, H = 345;
  let b = "";
  const cols = [[20, "No."], [100, "电解质（盐）"], [470, "溶剂"], [800, "析出金属"]];
  const rows = [
    ["1", "AlBr_{3} + LiBr", "甲苯 Toluene", "Al"],
    ["2", "AlCl_{3} + LiCl + LiAlH_{4}", "乙醚 Diethyl ether", "Al"],
    ["3", "AlCl_{3} + LiCl + LiAlH_{4}", "四氢呋喃 THF", "Al"],
    ["4", "AlCl_{3} + LiCl", "亚硫酰氯 SOCl_{2}", "Li"],
    ["5", "AlCl_{3} + LiCl", "碳酸丙烯酯 PC", "Li"],
    ["6", "FeCl_{3} + MgCl_{2}", "亚硫酰氯 SOCl_{2}", "Mg"],
  ];
  const y0 = 50, rh = 47;
  b += rect(10, y0 + 3, 940, 3 * rh, "#E8F4F3");
  b += rect(10, y0 + 3 + 3 * rh, 940, 3 * rh, "#FBEDEC");
  cols.forEach(([x, t]) => (b += text(x + (x === 800 ? 60 : 0), 36, t, { size: 21, weight: "bold", fill: COL.text2, anchor: x === 800 ? "middle" : "start" })));
  b += line(10, y0, 950, y0, COL.ink, 2);
  rows.forEach((r, i) => {
    const y = y0 + i * rh + 33;
    b += text(40, y, r[0], { size: 21, anchor: "middle" });
    b += text(100, y, r[1], { size: 21 });
    b += text(470, y, r[2], { size: 21 });
    const c = r[3] === "Al" ? COL.teal : COL.red;
    b += text(860, y, r[3], { size: 24, weight: "bold", anchor: "middle", fill: c });
    if (i) b += line(10, y0 + i * rh + 3, 950, y0 + i * rh + 3, COL.line, 1);
  });
  b += line(10, y0 + 6 * rh + 5, 950, y0 + 6 * rh + 5, COL.ink, 2);
  // brackets
  const bx = 975;
  const br = (ya, yb, c, l1, l2) => {
    b += line(bx, ya + 6, bx, yb - 6, c, 3) + line(bx - 10, ya + 6, bx, ya + 6, c, 3) + line(bx - 10, yb - 6, bx, yb - 6, c, 3);
    b += text(bx + 18, (ya + yb) / 2 - 4, l1, { size: 21, weight: "bold", fill: c });
    b += text(bx + 18, (ya + yb) / 2 + 26, l2, { size: 19, fill: c });
  };
  br(y0 + 3, y0 + 3 + 3 * rh, COL.teal, "铝电镀液", "析出 Al：符合预期");
  br(y0 + 3 + 3 * rh, y0 + 3 + 6 * rh, COL.red, "电池体系", "析出 Li、Mg：反常");
  return svg(W, H, b);
};

// ---------- 11. The SEI model ----------
figs.sei_model = () => {
  const W = 820, H = 540;
  let b = "";
  const top = 80, h = 310;
  b += rect(30, top, 230, h, "#8E7CC3", { rx: 8 });
  b += text(145, top + 40, "锂金属 M", { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += rect(260, top, 80, h, SEI);
  const R = rng(3);
  for (let i = 0; i < 40; i++) b += circ(266 + R() * 68, top + 6 + R() * (h - 12), 3 + R() * 3, i % 2 ? "#C98B63" : "#7E3F1E");
  b += rect(340, top, 450, h, SOL, { rx: 8 });
  b += text(600, top + 40, "电解液 sol", { size: 22, anchor: "middle", weight: "bold", fill: COL.text2 });
  // labels for interfaces
  b += text(260, top - 18, "M/SE", { size: 18, anchor: "middle", fill: COL.text2, weight: "bold" });
  b += text(340, top - 18, "SE/sol", { size: 18, anchor: "middle", fill: COL.text2, weight: "bold" });
  b += text(300, 30, "SEI", { size: 26, anchor: "middle", weight: "bold", fill: SEI });
  // Li+ passes
  const y1 = top + 95;
  b += ion(520, y1, { r: 18, fill: LI, label: "Li^{+}" });
  [[490, y1 - 25], [550, y1 - 22], [548, y1 + 26], [492, y1 + 24]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="15" ry="8" fill="${COL.tealLight}"/>`));
  b += arrow(495, y1, 215, y1, { color: LI, width: 4, head: 15 });
  b += check(640, y1, 14, COL.teal, 5);
  b += text(665, y1 + 8, "Li^{+} 能过", { size: 20, weight: "bold", fill: COL.teal });
  // electron blocked
  const y2 = top + 185;
  b += electron(185, y2, 16);
  b += arrow(205, y2, 262, y2, { color: COL.amber, width: 4, head: 14 });
  b += cross(300, y2, 13, COL.red, 5);
  b += text(400, y2 + 8, "电子过不去", { size: 20, weight: "bold", fill: COL.red });
  // solvent blocked
  const y3 = top + 260;
  b += `<ellipse cx="420" cy="${y3}" rx="26" ry="14" fill="${COL.teal}"/>`;
  b += arrow(390, y3, 350, y3, { color: COL.teal, width: 3.5, head: 12 });
  b += cross(375, y3 - 28, 9, COL.red, 4);
  b += text(460, y3 + 8, "溶剂碰不到金属", { size: 20, weight: "bold", fill: COL.teal });
  // thickness bracket
  const by = top + h + 22;
  b += line(260, by, 340, by, COL.ink, 2.5) + line(260, by - 9, 260, by + 9, COL.ink, 2.5) + line(340, by - 9, 340, by + 9, COL.ink, 2.5);
  b += text(300, by + 32, "L ≈ 15–25 Å", { size: 21, anchor: "middle", weight: "bold", fill: SEI });
  b += text(410, 520, "新鲜膜的厚度 ≈ 电子能“隧穿”的距离（膜画得夸张了）", { size: 18, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 12. Peled Fig. 1: three steps ----------
figs.peled_fig1 = () => {
  const W = 820, H = 540;
  let b = "";
  const top = 95, h = 300;
  b += rect(20, top, 150, h, "#8E7CC3", { rx: 8 });
  b += text(95, top + 50, "M", { size: 30, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += rect(170, top, 330, h, "#F3E4DA");
  b += rect(500, top, 300, h, SOL, { rx: 8 });
  // lattice + - with vacancies
  const vac = new Set(["5,2", "4,1", "3,2", "2,1", "1,2"]);
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
    const x = 200 + c * 54, y = top + 30 + r * 48;
    const plus = (r + c) % 2 === 1;
    if (plus && vac.has(`${c},${r}`)) b += rect(x - 14, y - 14, 28, 28, "none", { stroke: SEI, sw: 2.5, dash: "4 3", rx: 4 });
    else b += text(x, y + 9, plus ? "+" : "−", { size: 26, anchor: "middle", weight: "bold", fill: plus ? SEI : COL.text2 });
  }
  // step 3: solvated ion at SE/sol
  const sy = top + 125;
  b += ion(640, sy, { r: 19, fill: LI, label: "M^{+}" });
  [[610, sy - 28], [672, sy - 26], [670, sy + 30], [608, sy + 28]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="17" ry="9" fill="${COL.tealLight}"/>`));
  b += arrow(612, sy, 520, sy, { color: LI, width: 4, head: 14 });
  // step 2 migration zigzag through vacancies
  b += poly([[470, sy], [416, top + 78], [362, sy + 1], [308, top + 78], [254, sy], [190, sy]], LI, 3.5);
  b += arrow(200, sy, 160, sy, { color: LI, width: 3.5, head: 13 });
  // step 1 electron
  b += electron(95, sy + 95, 15);
  b += arrow(110, sy + 82, 150, sy + 12, { color: COL.amber, width: 3, head: 11 });
  // numbered labels
  const num = (x, y, n) => circ(x, y, 18, COL.ink) + text(x, y + 7, n, { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += num(560, top - 30, "1") + text(585, top - 23, "脱掉溶剂，进入空位", { size: 19, weight: "bold" });
  b += num(240, top - 30, "2") + text(265, top - 23, "靠空位一格格跳", { size: 19, weight: "bold" });
  b += num(40, top - 30, "3") + text(65, top - 23, "得电子", { size: 19, weight: "bold" });
  // potential drops
  const py = top + h + 40;
  b += text(170, py, "Δφ_{M/SE}", { size: 21, anchor: "middle", fill: SEI, weight: "bold" });
  b += text(335, py, "Δφ_{SE}", { size: 21, anchor: "middle", fill: SEI, weight: "bold" });
  b += text(500, py, "Δφ_{SE/sol}", { size: 21, anchor: "middle", fill: SEI, weight: "bold" });
  b += text(410, py + 45, "□ = 阳离子空位（Schottky 缺陷）；箭头为沉积（充电）方向", { size: 18, anchor: "middle", fill: COL.text2 });
  b += text(410, py + 78, "电压分三段降落：Δφ_{M/sol} = Δφ_{M/SE} + Δφ_{SE} + Δφ_{SE/sol}", { size: 19, anchor: "middle", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- 13. Hopping over barriers: where the sinh comes from ----------
figs.hop_equation = () => {
  const W = 820, H = 540;
  let b = "";
  const land = (y0, tilt) => {
    let d = "";
    for (let x = 40; x <= 780; x += 5) {
      const y = y0 - 45 * Math.cos(((x - 40) / 160) * 2 * Math.PI) * -1 + tilt * (x - 410);
      d += (x === 40 ? "M " : " L ") + x + " " + y.toFixed(1);
    }
    return path(d, COL.ink, 3);
  };
  // top: no field
  b += text(40, 35, "没有电场：向左、向右一样难", { size: 21, weight: "bold" });
  b += land(150, 0);
  const vy = (x, y0, tilt) => y0 + 45 * Math.cos(((x - 40) / 160) * 2 * Math.PI) + tilt * (x - 410);
  b += ion(360, vy(360, 150, 0) - 20, { r: 17, fill: LI, label: "+" });
  b += path(`M 345 ${vy(360, 150, 0) - 40} Q 300 70 260 ${vy(200, 150, 0) - 30}`, COL.text2, 2.5, "none", "6 5");
  b += path(`M 375 ${vy(360, 150, 0) - 40} Q 420 70 460 ${vy(520, 150, 0) - 30}`, COL.text2, 2.5, "none", "6 5");
  // W label
  b += line(600, vy(680, 150, 0), 600, vy(600, 150, 0), COL.red, 2.5) + text(612, 158, "W：要翻的“山”", { size: 19, fill: COL.red, weight: "bold" });
  // jump distance
  b += line(200, 225, 360, 225, COL.teal, 2.5) + line(200, 215, 200, 235, COL.teal, 2.5) + line(360, 215, 360, 235, COL.teal, 2.5);
  b += text(280, 255, "一跳 = 2a", { size: 19, anchor: "middle", fill: COL.teal, weight: "bold" });
  // bottom: with field
  const y0 = 400, tilt = -0.15;
  b += text(40, 300, "加上电场 E = η/L：山坡倾斜，向左更容易", { size: 21, weight: "bold", fill: LI });
  b += land(y0, tilt);
  b += ion(360, vy(360, y0, tilt) - 20, { r: 17, fill: LI, label: "+" });
  b += path(`M 345 ${vy(360, y0, tilt) - 38} Q 280 ${vy(280, y0, tilt) - 75} 222 ${vy(200, y0, tilt) - 28}`, LI, 4);
  b += L.head(218, vy(200, y0, tilt) - 24, Math.atan2(30, -40), LI, 15);
  b += arrow(378, vy(360, y0, tilt) - 40, 450, vy(520, y0, tilt) - 50, { color: COL.muted, width: 2, head: 10, dash: "5 5" });
  b += text(410, 525, "净电流 ∝ 向左概率 − 向右概率 → 出现 sinh", { size: 20, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- 14. Peled Fig. 2: shorts during deposition -> dead lithium ----------
figs.peled_fig2 = () => {
  const W = 820, H = 540;
  let b = "";
  const panel = (ox, oy, k) => {
    let s = rect(ox, oy, 395, 255, COL.light, { rx: 12 });
    const mx = ox + 15, sx = ox + 105;
    s += rect(mx, oy + 15, 90, 225, "#8E7CC3", { rx: 6 });
    s += text(mx + 45, oy + 60, k === 3 ? "⊕" : "⊖", { size: 32, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    // SEI wavy band
    const yA = oy + 15, yB = oy + 240;
    s += path(`M ${sx} ${yA} Q ${sx + 25} ${yA + 55} ${sx} ${yA + 110} T ${sx} ${yB}`, SEI, 3);
    s += path(`M ${sx + 45} ${yA} Q ${sx + 70} ${yA + 55} ${sx + 45} ${yA + 110} T ${sx + 45} ${yB}`, SEI, 3);
    const cy = oy + 128;
    if (k === 0) {
      s += electron(mx + 60, cy, 13);
      s += arrow(mx + 75, cy, sx + 30, cy, { color: COL.amber, width: 3, head: 11 });
      s += circ(sx + 30, cy, 10, COL.red, { opacity: 0.6 });
      s += arrow(sx + 140, cy - 60, sx + 40, cy - 8, { color: LI, width: 3, head: 11 }) + arrow(sx + 140, cy + 60, sx + 40, cy + 8, { color: LI, width: 3, head: 11 });
      s += text(sx + 150, cy - 70, "Li^{+}", { size: 19, fill: LI, weight: "bold" });
    }
    if (k === 1) {
      s += circ(sx + 28, cy, 20, "#8E7CC3") + text(sx + 28, cy + 7, "Li", { size: 19, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
      s += electron(mx + 55, cy, 12) + arrow(mx + 68, cy, sx + 6, cy, { color: COL.amber, width: 3, head: 10 });
      s += arrow(sx + 140, cy - 50, sx + 48, cy - 10, { color: LI, width: 3, head: 11 });
    }
    if (k === 2 || k === 3) {
      s += circ(sx + 75, cy, 38, "none", { stroke: SEI, sw: 5 });
      s += circ(sx + 75, cy, 30, "#8E7CC3") + text(sx + 75, cy + 8, "Li", { size: 20, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    }
    if (k === 3) {
      s += arrow(mx + 70, oy + 45, sx + 150, oy + 45, { color: LI, width: 3, head: 11 });
      s += text(sx + 155, oy + 52, "Li^{+}", { size: 19, fill: LI, weight: "bold" });
    }
    const lab = [["(a) 局部过热：", "SEI 漏电子"], ["(b) 锂在 SEI", "内部析出"], ["(c) 长成锂球，", "被 SEI 包住"], ["(d) 放电时它", "溶不掉：“死锂”"]][k];
    s += lines(sx + 140, oy + 115 + (k === 0 ? 30 : 0) - (k === 3 ? -10 : 0), lab, { size: 19, lh: 26, weight: "bold", fill: k === 3 ? COL.red : COL.ink });
    return s;
  };
  b += panel(10, 10, 0) + panel(415, 10, 1) + panel(10, 280, 2) + panel(415, 280, 3);
  return svg(W, H, b);
};

// ---------- 15. Rocking chair ----------
figs.rocking_chair = () => {
  const W = 820, H = 540;
  let b = "";
  // two layered hosts
  const host = (x, c, lab) => {
    let s = "";
    for (let i = 0; i < 6; i++) s += rect(x, 70 + i * 38, 170, 16, c, { rx: 4 });
    s += text(x + 85, 55, lab, { size: 20, anchor: "middle", weight: "bold" });
    return s;
  };
  b += host(60, COL.siDark, "负极：嵌入宿主");
  b += host(590, COL.si, "正极：嵌入宿主");
  [[100, 95], [170, 171], [130, 247]].forEach(([x, y]) => (b += ion(x, y, { r: 11, fill: LI, label: "+" })));
  [[640, 133], [700, 209]].forEach(([x, y]) => (b += ion(x, y, { r: 11, fill: LI, label: "+" })));
  b += rect(250, 70, 320, 220, SOL, { rx: 10 });
  b += text(410, 110, "电解质", { size: 19, anchor: "middle", fill: COL.text2 });
  b += arrow(270, 165, 550, 165, { color: COL.amber, width: 4, head: 15 });
  b += text(410, 155, "放电 →", { size: 19, anchor: "middle", weight: "bold", fill: COL.amber });
  b += arrow(550, 225, 270, 225, { color: COL.teal, width: 4, head: 15 });
  b += text(410, 255, "← 充电", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  // rocker base
  b += path(`M 60 330 Q 410 400 760 330`, COL.copper, 7);
  b += line(145, 296, 160, 338, COL.copper, 5) + line(675, 296, 660, 338, COL.copper, 5);
  b += text(410, 405, "Li^{+} 在两边之间来回“摇”", { size: 21, anchor: "middle", weight: "bold", fill: COL.copper });
  // comparison
  b += rect(20, 425, 380, 105, "#FBEDEC", { rx: 14 });
  b += text(40, 462, "锂金属电池（第 2 章）", { size: 20, weight: "bold", fill: COL.red });
  b += text(40, 498, "充电时锂重新长出来 → 枝晶", { size: 19 });
  b += rect(420, 425, 380, 105, "#E8F4F3", { rx: 14 });
  b += text(440, 462, "摇椅电池", { size: 20, weight: "bold", fill: COL.teal });
  b += text(440, 498, "锂始终是离子，住在“宿主”里", { size: 19 });
  return svg(W, H, b);
};

module.exports = figs;
