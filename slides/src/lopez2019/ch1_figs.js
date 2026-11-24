// Figures for Lopez et al. 2019, Chapter 1 (Introduction & advanced battery chemistries)
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- Cell anatomy (discharge) ----------
figs.cell_anatomy = () => {
  const W = 820, H = 540;
  let b = "";
  const top = 120, bot = 390;
  // external circuit
  b += `<path d="M 90 ${top + 30} V 52 H 730 V ${top + 30}" fill="none" stroke="${COL.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  b += `<rect x="352" y="30" width="116" height="44" rx="10" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3"/>`;
  b += text(410, 59, "用电器", { size: 18, anchor: "middle", weight: "bold" });
  b += electron(200, 52, 13) + electron(270, 52, 13) + electron(560, 52, 13) + electron(630, 52, 13);
  b += head(325, 52, 0, COL.amber, 16) + head(700, 52, 0, COL.amber, 16);
  b += text(300, 112, "电子 e^{−} 走外电路 →", { size: 17, anchor: "middle", fill: COL.amber, weight: "bold" });
  b += `<g transform="translate(0 30)">`;
  // collectors
  b += `<rect x="78" y="${top}" width="22" height="${bot - top}" fill="${COL.copper}"/>`;
  b += `<rect x="720" y="${top}" width="22" height="${bot - top}" fill="${COL.alu}"/>`;
  // electrolyte background
  b += `<rect x="100" y="${top}" width="620" height="${bot - top}" fill="${COL.electrolyte}"/>`;
  // anode: graphite flakes
  const R = rng(7);
  const flakes = [[150, 160], [230, 165], [300, 175], [140, 245], [215, 250], [295, 255], [160, 330], [240, 335], [305, 340]];
  flakes.forEach(([x, y]) => {
    const w = 62 + R() * 10, h = 46 + R() * 8;
    b += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="6" fill="#4F5B66"/>`;
    for (let k = 1; k < 5; k++) b += `<line x1="${x - w / 2 + 6}" y1="${y - h / 2 + (k * h) / 5}" x2="${x + w / 2 - 6}" y2="${y - h / 2 + (k * h) / 5}" stroke="#8C99A5" stroke-width="1.6"/>`;
  });
  // separator
  b += `<rect x="345" y="${top}" width="46" height="${bot - top}" fill="#F4F1FA" stroke="${COL.purpleLight}" stroke-width="2"/>`;
  for (let y = top + 14; y < bot - 6; y += 22) b += `<ellipse cx="${368 + (Math.round(y) % 3 - 1) * 6}" cy="${y}" rx="11" ry="5" fill="${COL.electrolyte}"/>`;
  // cathode particles
  const cps = [[450, 165], [540, 160], [640, 170], [470, 255], [565, 250], [665, 260], [450, 340], [545, 345], [645, 340]];
  cps.forEach(([x, y], i) => {
    b += blob(x, y, 36, 30 + i, { fill: COL.amberLight, stroke: COL.amber, sw: 2.5, jag: 0.08 });
  });
  // Li+ path arrows (discharge: anode -> cathode)
  [[205, 205, 470, 205], [190, 295, 505, 295]].forEach(([x1, y1, x2, y2]) => {
    b += arrow(x1 + 30, y1, x2 - 20, y2, { color: COL.purple, width: 3, dash: "7 6", head: 14 });
  });
  b += ion(262, 205, { r: 12 }) + ion(368, 205, { r: 12 }) + ion(430, 205, { r: 12 });
  b += ion(262, 295, { r: 12 }) + ion(368, 295, { r: 12 }) + ion(455, 295, { r: 12 });
  // labels
  b += text(205, 424, "负极 Anode", { size: 19, anchor: "middle", weight: "bold" });
  b += text(205, 448, "（如石墨）", { size: 15, anchor: "middle", fill: COL.text2 });
  b += text(368, 424, "隔膜", { size: 19, anchor: "middle", weight: "bold" });
  b += text(368, 448, "Separator", { size: 15, anchor: "middle", fill: COL.text2 });
  b += text(560, 424, "正极 Cathode", { size: 19, anchor: "middle", weight: "bold" });
  b += text(560, 448, "（如 LiCoO_{2}）", { size: 15, anchor: "middle", fill: COL.text2 });
  b += text(89, 474, "Cu 集流体", { size: 13, anchor: "middle", fill: COL.copper, weight: "bold" });
  b += text(731, 474, "Al 集流体", { size: 13, anchor: "middle", fill: COL.siDark, weight: "bold" });
  b += `</g>`;
  b += pill(470, 92, 210, 30, COL.purple, "Li⁺ 走电池内部 →", { size: 15 });
  b += `<rect x="300" y="514" width="22" height="16" fill="${COL.electrolyte}" stroke="#9CC9E0"/>`;
  b += text(330, 528, "浅蓝 = 电解质 Electrolyte（充满所有孔隙）", { size: 14, fill: "#3A7CA5" });
  return svg(W, H, b);
};

// ---------- Battery history timeline ----------
figs.battery_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1800", who: ["Volta"], what: ["伏打电堆", "第一块电池"], color: COL.text2 },
    { year: "1859", who: ["Planté"], what: ["铅酸电池", "第一种可充电池"], color: COL.text2 },
    { year: "1899", who: ["Jungner"], what: ["镍镉电池", "NiCd"], color: COL.text2 },
    { year: "1976", who: ["Whittingham"], what: ["Li / TiS_{2}", "锂金属负极"], color: COL.purple },
    { year: "1980", who: ["Goodenough"], what: ["LiCoO_{2} 正极", "电压 ≈ 4 V"], color: COL.purple },
    { year: "1985", who: ["吉野彰 Yoshino"], what: ["碳负极 + LiCoO_{2}", "现代锂电原型"], color: COL.purple },
    { year: "1991", who: ["Sony"], what: ["锂离子电池", "首次商业化"], color: COL.amber },
    { year: "2019", who: ["诺贝尔化学奖"], what: ["授予上述三位", "锂电先驱"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 80, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Polymer roles (exploded pouch cell) ----------
figs.polymer_roles = () => {
  const W = 860, H = 512;
  let b = "";
  const x0 = 60, w = 330, dx = 120, dy = 62;
  const layers = [
    { y: 110, fill: "#E3E7EB", stroke: "#9AA6B2", name: "外包装 Package", poly: "PP / 尼龙 层压铝塑膜", col: COL.siDark },
    { y: 190, fill: COL.amberLight, stroke: COL.amber, name: "正极 + 粘结剂 Binder", poly: "PVDF", col: COL.amber },
    { y: 270, fill: "#F4F1FA", stroke: COL.purple, name: "隔膜 Separator", poly: "PE / PP 微孔膜", col: COL.purple },
    { y: 350, fill: "#7D8893", stroke: "#4F5B66", name: "负极 + 粘结剂 Binder", poly: "CMC / SBR、PVDF", col: COL.ink },
    { y: 430, fill: "#E3E7EB", stroke: "#9AA6B2", name: "外包装 Package", poly: "", col: COL.siDark },
  ];
  layers.slice().reverse().forEach((l) => {
    const p = `${x0},${l.y} ${x0 + w},${l.y} ${x0 + w + dx},${l.y - dy} ${x0 + dx},${l.y - dy}`;
    b += `<polygon points="${p}" fill="${l.fill}" stroke="${l.stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
    b += `<polygon points="${x0},${l.y} ${x0 + w},${l.y} ${x0 + w},${l.y + 10} ${x0},${l.y + 10}" fill="${l.stroke}" opacity="0.55"/>`;
    b += `<polygon points="${x0 + w},${l.y} ${x0 + w + dx},${l.y - dy} ${x0 + w + dx},${l.y - dy + 10} ${x0 + w},${l.y + 10}" fill="${l.stroke}" opacity="0.4"/>`;
  });
  // pores on separator
  const R = rng(3);
  for (let i = 0; i < 26; i++) {
    const u = R(), v = R();
    const px = x0 + 20 + u * (w - 40) + v * dx * 0.9;
    const py = 270 - 8 - v * (dy - 16);
    b += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="7" ry="2.6" fill="${COL.electrolyte}" stroke="#9CC9E0" stroke-width="1"/>`;
  }
  // electrolyte droplets
  // callouts
  layers.slice(0, 4).forEach((l) => {
    const ax = x0 + w + dx / 2 + 6, ay = l.y - dy / 2 + 2;
    b += `<line x1="${ax}" y1="${ay}" x2="575" y2="${ay}" stroke="${l.col}" stroke-width="2"/>`;
    b += `<circle cx="${ax}" cy="${ay}" r="5" fill="${l.col}"/>`;
    b += text(585, ay - 4, l.name, { size: 18, weight: "bold", fill: l.col });
    b += text(585, ay + 20, l.poly, { size: 15, fill: COL.text2 });
  });
  b += text(60, 474, "电解质 Electrolyte：浸润在各层孔隙里（液体，或 PEO 等聚合物）", { size: 16, fill: "#3A7CA5", weight: "bold" });
  b += text(60, 500, "软包电池分层示意（各层实际只有几十微米厚）", { size: 14, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Separator ----------
figs.separator = () => {
  const W = 840, H = 470;
  let b = "";
  // Left: SEM-like top view of dry-stretched membrane
  const x0 = 30, y0 = 40, w = 380, h = 340;
  b += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="14" fill="#2E3A46"/>`;
  const R = rng(11);
  for (let row = 0; row < 9; row++) {
    const y = y0 + 22 + row * 38;
    // lamella
    b += `<rect x="${x0 + 10}" y="${y}" width="${w - 20}" height="13" rx="6" fill="#C9D2DA"/>`;
    if (row < 8) {
      // fibrils bridging to next lamella
      for (let x = x0 + 18; x < x0 + w - 14; x += 9 + R() * 9) {
        b += `<line x1="${x.toFixed(1)}" y1="${y + 13}" x2="${(x + (R() - 0.5) * 4).toFixed(1)}" y2="${y + 38}" stroke="#AEB8C2" stroke-width="${(1 + R() * 1.2).toFixed(1)}"/>`;
      }
    }
  }
  b += arrow(x0 + 70, y0 + h + 30, x0 + 10, y0 + h + 30, { color: COL.teal, width: 3, head: 13 });
  b += arrow(x0 + w - 70, y0 + h + 30, x0 + w - 10, y0 + h + 30, { color: COL.teal, width: 3, head: 13 });
  b += text(x0 + w / 2, y0 + h + 36, "单向拉伸 → 拉出狭缝孔", { size: 17, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(x0 + w / 2, y0 + h + 64, "PE / PP 微孔膜俯视示意（孔径 ~30–100 nm）", { size: 14, anchor: "middle", fill: COL.muted });
  b += `<rect x="${x0 + w - 112}" y="${y0 + h - 62}" width="104" height="54" rx="8" fill="#2E3A46"/>`;
  b += `<rect x="${x0 + w - 98}" y="${y0 + h - 24}" width="80" height="6" fill="#FFFFFF"/>`;
  b += text(x0 + w - 58, y0 + h - 34, "~1 μm", { size: 13, anchor: "middle", fill: "#FFFFFF" });

  // Right: function diagram
  const X = 470;
  b += `<rect x="${X}" y="70" width="70" height="290" fill="#4F5B66"/>`;
  b += `<rect x="${X + 270}" y="70" width="70" height="290" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="2"/>`;
  b += `<rect x="${X + 70}" y="70" width="200" height="290" fill="${COL.electrolyte}"/>`;
  b += `<rect x="${X + 125}" y="70" width="90" height="290" fill="#F4F1FA" stroke="${COL.purpleLight}" stroke-width="2"/>`;
  // pores in separator
  [130, 215, 300].forEach((y) => (b += `<rect x="${X + 125}" y="${y - 14}" width="90" height="28" fill="${COL.electrolyte}"/>`));
  b += text(X + 35, 395, "负极", { size: 17, anchor: "middle", weight: "bold" });
  b += text(X + 170, 395, "隔膜", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(X + 305, 395, "正极", { size: 17, anchor: "middle", weight: "bold" });
  // Li+ passes through pore
  b += arrow(X + 85, 130, X + 258, 130, { color: COL.purple, width: 3, head: 13 });
  b += ion(X + 170, 130, { r: 12 });
  b += check(X + 170, 168, 11);
  b += text(X + 170, 196, "Li⁺ 穿过孔", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  // electron blocked
  b += arrow(X + 85, 262, X + 118, 262, { color: COL.amber, width: 3, head: 12 });
  b += electron(X + 98, 240, 11);
  b += cross(X + 140, 262, 11);
  b += text(X + 170, 316, "电子被挡住", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(X + 170, 336, "→ 不短路", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(X + 170, 438, "隔膜：通离子、绝电子", { size: 19, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Composite electrode + slurry coating ----------
figs.composite_electrode = () => {
  const W = 860, H = 470;
  let b = "";
  const x0 = 30, y0 = 40, w = 500, h = 330;
  b += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="16" fill="#F7F9FB" stroke="${COL.line}" stroke-width="2"/>`;
  // collector
  b += `<rect x="${x0 + 10}" y="${y0 + h - 40}" width="${w - 20}" height="26" rx="4" fill="${COL.alu}"/>`;
  b += text(x0 + w / 2, y0 + h - 22, "金属集流体 Current collector", { size: 14, anchor: "middle", fill: COL.ink, weight: "bold" });
  const parts = [[110, 120, 46], [235, 105, 50], [370, 125, 44], [470, 110, 34], [90, 230, 40], [200, 225, 44], [320, 230, 48], [450, 225, 42]];
  // binder strands (teal), drawn below particles
  const R = rng(21);
  const link = (a, c) => {
    const mx = (a[0] + c[0]) / 2 + (R() - 0.5) * 30, my = (a[1] + c[1]) / 2 + (R() - 0.5) * 30;
    return `<path d="M${a[0]},${a[1]} Q${mx.toFixed(1)},${my.toFixed(1)} ${c[0]},${c[1]}" fill="none" stroke="${COL.teal}" stroke-width="4" stroke-linecap="round"/>`;
  };
  const P = parts.map(([x, y]) => [x0 + x - 30, y0 + y]);
  [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [1, 4], [2, 5]].forEach(([i, j]) => (b += link(P[i], P[j])));
  P.slice(4).forEach((p) => (b += link(p, [p[0] + (R() - 0.5) * 30, y0 + h - 40])));
  // carbon black clusters
  for (let i = 0; i < 70; i++) {
    const a = P[Math.floor(R() * 8)], c = P[Math.floor(R() * 8)];
    const t = R();
    const x = a[0] + (c[0] - a[0]) * t + (R() - 0.5) * 16, y = a[1] + (c[1] - a[1]) * t + (R() - 0.5) * 16;
    b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4 + R() * 3).toFixed(1)}" fill="#2B2F33"/>`;
  }
  P.forEach((p, i) => (b += blob(p[0], p[1], parts[i][2], 50 + i, { fill: COL.amberLight, stroke: COL.amber, sw: 2.5, jag: 0.1 })));
  // legend
  const lg = 548;
  b += blob(lg + 18, 92, 16, 3, { fill: COL.amberLight, stroke: COL.amber, sw: 2, jag: 0.1 });
  b += text(lg + 46, 88, "活性物质 Active material", { size: 17, weight: "bold" });
  b += text(lg + 46, 110, "真正储存 Li 的颗粒", { size: 14, fill: COL.text2 });
  [0, 9, 18].forEach((d) => (b += `<circle cx="${lg + 9 + d}" cy="172" r="5.5" fill="#2B2F33"/>`));
  b += text(lg + 46, 168, "导电炭黑 Conductive carbon", { size: 17, weight: "bold" });
  b += text(lg + 46, 190, "给电子铺“路”", { size: 14, fill: COL.text2 });
  b += `<path d="M${lg},258 q 18 -20 36 0" fill="none" stroke="${COL.teal}" stroke-width="5" stroke-linecap="round"/>`;
  b += text(lg + 46, 248, "高分子粘结剂 Binder", { size: 17, weight: "bold", fill: COL.teal });
  b += text(lg + 46, 270, "把大家粘在一起、粘在箔上", { size: 14, fill: COL.text2 });
  // slurry coating mini-scheme
  const sy = 330;
  b += `<rect x="${lg}" y="${sy + 60}" width="280" height="10" fill="${COL.alu}"/>`;
  b += `<path d="M${lg + 40},${sy + 60} L${lg + 150},${sy + 60} L${lg + 150},${sy + 47} Q ${lg + 95},${sy + 15} ${lg + 40},${sy + 60} Z" fill="#6B5A4A"/>`;
  b += `<rect x="${lg + 150}" y="${sy + 49}" width="130" height="11" fill="#6B5A4A"/>`;
  b += `<rect x="${lg + 140}" y="${sy + 5}" width="14" height="42" fill="${COL.siDark}"/>`;
  b += arrow(lg + 190, sy + 30, lg + 255, sy + 30, { color: COL.ink, width: 2.5, head: 11 });
  b += text(lg, sy - 8, "浆料涂布 Slurry coating", { size: 16, weight: "bold" });
  b += text(lg + 4, sy + 92, "刮刀把浆料刮成均匀薄层", { size: 14, fill: COL.text2 });
  b += text(x0 + w / 2, y0 + h + 40, "复合电极 Composite electrode（截面示意）", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Voltage ladder ----------
figs.voltage_ladder = () => {
  const W = 620, H = 530;
  let b = "";
  const yv = (v) => 450 - v * 92; // 0..4.4 V vs Li
  const ax = 150;
  b += `<line x1="${ax}" y1="${yv(0) + 10}" x2="${ax}" y2="${yv(4.4)}" stroke="${COL.ink}" stroke-width="3"/>`;
  b += head(ax, yv(4.4) - 12, -Math.PI / 2, COL.ink, 14);
  for (let v = 0; v <= 4; v++) {
    b += `<line x1="${ax - 8}" y1="${yv(v)}" x2="${ax}" y2="${yv(v)}" stroke="${COL.ink}" stroke-width="2"/>`;
    b += text(ax - 14, yv(v) + 6, `${v} V`, { size: 16, anchor: "end", fill: COL.text2 });
  }
  b += text(ax - 60, yv(4.4) - 6, "电位 vs Li/Li⁺", { size: 15, anchor: "middle", fill: COL.text2, weight: "bold" });
  const items = [
    { v: 0.0, label: "Li 金属（0 V）", col: COL.purple, dy: 20 },
    { v: 0.12, label: "石墨 Graphite（≈0.1 V）", col: COL.ink, dy: 5 },
    { v: 0.4, label: "硅 Si（≈0.4 V）", col: COL.siDark, dy: -14 },
    { v: 2.15, label: "硫 S（≈2.1–2.3 V）", col: COL.sulfur },
    { v: 3.4, label: "LiFePO_{4}（≈3.4 V）", col: COL.teal },
    { v: 3.9, label: "LiCoO_{2}（≈3.9 V）", col: COL.amber },
  ];
  items.forEach((it) => {
    const y = yv(it.v);
    b += `<line x1="${ax}" y1="${y}" x2="${ax + 150}" y2="${y}" stroke="${it.col}" stroke-width="5" stroke-linecap="round"/>`;
    b += text(ax + 162, y + 6 + (it.dy || 0), it.label, { size: 17, fill: it.col, weight: "bold" });
  });
  // battery voltage bracket graphite -> LiCoO2
  const bx = 530;
  b += arrow(bx, yv(0.12), bx, yv(3.9) + 2, { color: COL.amber, width: 3, head: 13 });
  b += arrow(bx, yv(3.9), bx, yv(0.12) - 2, { color: COL.amber, width: 3, head: 13 });
  b += lines(bx - 14, yv(3.0), ["石墨 | LiCoO_{2}", "电池电压", "≈ 3.8 V"], { size: 16, anchor: "end", fill: COL.amber, weight: "bold", lh: 24 });
  b += text(ax + 10, yv(0) + 62, "Li/Li⁺ 的 0 V = 标准氢电极 SHE 的 −3.04 V", { size: 14, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Si failure (Fig. 2a style) ----------
figs.si_failure = () => {
  const W = 900, H = 470;
  let b = "";
  // stage 1: pristine cluster
  const c1 = [[70, 140, 26], [120, 125, 22], [95, 185, 24], [148, 172, 20], [60, 200, 18]];
  c1.forEach(([x, y, r], i) => (b += blob(x, y, r, 70 + i, { fill: COL.si, stroke: COL.siDark, sw: 2 })));
  b += text(105, 255, "硅颗粒 Si", { size: 17, anchor: "middle", weight: "bold" });
  b += arrow(185, 165, 265, 165, { color: COL.purple, width: 3.5, head: 15 });
  b += text(225, 150, "嵌锂", { size: 15, anchor: "middle", fill: COL.purple, weight: "bold" });
  // stage 2: swollen (radius x1.59 ≈ volume x4)
  const c2 = [[340, 130, 41], [420, 118, 35], [372, 205, 38], [455, 192, 32]];
  c2.forEach(([x, y, r], i) => (b += blob(x, y, r, 80 + i, { fill: "#9AA7B4", stroke: COL.siDark, sw: 2 })));
  b += text(395, 268, "嵌锂后的硅 Li_{x}Si", { size: 17, anchor: "middle", weight: "bold" });
  b += text(395, 292, "体积 ≈ 原来的 4 倍（+300%）", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  b += arrow(505, 165, 590, 165, { color: COL.ink, width: 3.5, head: 15 });
  b += text(547, 150, "反复循环", { size: 15, anchor: "middle", weight: "bold" });
  // stage 3: fractured fragments with SEI
  const R = rng(5);
  const frags = [];
  for (let i = 0; i < 14; i++) frags.push([620 + R() * 170, 95 + R() * 140, 14 + R() * 12]);
  frags.forEach(([x, y, r], i) => {
    b += blob(x, y, r + 5, 200 + i, { fill: COL.sei, jag: 0.25, n: 7 });
    b += blob(x, y, r, 200 + i, { fill: COL.si, stroke: COL.siDark, sw: 1.5, jag: 0.25, n: 7 });
  });
  // isolated fragment
  b += blob(845, 70, 16, 999, { fill: COL.sei, jag: 0.25, n: 7 }) + blob(845, 70, 11, 999, { fill: COL.si, jag: 0.25, n: 7 });
  b += text(705, 268, "颗粒开裂 Fracture", { size: 17, anchor: "middle", weight: "bold" });
  b += pill(615, 285, 26, 18, COL.sei, "");
  b += text(648, 300, "= 不断新长的 SEI 膜", { size: 14, fill: COL.sei, weight: "bold" });
  b += text(845, 42, "掉队的碎片", { size: 13, anchor: "middle", fill: COL.red, weight: "bold" });
  // mechanisms box
  const my = 340;
  b += `<rect x="30" y="${my}" width="410" height="110" rx="14" fill="#FBEDEC"/>`;
  b += pill(48, my + 16, 30, 30, COL.red, "1", { size: 16 });
  b += lines(92, my + 38, ["裂纹露出新表面 → 电解液在上面分解", "→ SEI 越长越厚，消耗 Li 和电解液"], { size: 16, lh: 26 });
  b += `<rect x="460" y="${my}" width="410" height="110" rx="14" fill="#FBEDEC"/>`;
  b += pill(478, my + 16, 30, 30, COL.red, "2", { size: 16 });
  b += lines(522, my + 38, ["碎片和导电网络断开（电绝缘）", "→ 这部分硅再也用不上，容量下降"], { size: 16, lh: 26 });
  return svg(W, H, b);
};

// ---------- Critical size ----------
figs.si_size = () => {
  const W = 440, H = 220;
  let b = "";
  b += blob(90, 95, 26, 11, { fill: COL.si, stroke: COL.siDark, sw: 2 });
  b += check(90, 160, 12);
  b += text(90, 205, "< 150 nm：不裂", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += blob(330, 95, 74, 12, { fill: COL.si, stroke: COL.siDark, sw: 2 });
  b += `<path d="M300,30 L320,70 L305,100 L330,140 L318,168" fill="none" stroke="${COL.red}" stroke-width="4" stroke-linejoin="round"/>`;
  b += `<path d="M360,40 L350,85 L380,110" fill="none" stroke="${COL.red}" stroke-width="3.5" stroke-linejoin="round"/>`;
  b += text(330, 205, "微米级：会裂", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- SEI ----------
figs.sei = () => {
  const W = 840, H = 460;
  let b = "";
  // electrode
  b += `<rect x="30" y="40" width="200" height="360" fill="#4F5B66"/>`;
  for (let y = 60; y < 400; y += 22) b += `<line x1="42" y1="${y}" x2="218" y2="${y}" stroke="#7D8893" stroke-width="2"/>`;
  b += text(130, 430, "负极 Electrode", { size: 18, anchor: "middle", weight: "bold" });
  // SEI layer (mosaic)
  const R = rng(9);
  b += `<rect x="230" y="40" width="46" height="360" fill="#C98B5E"/>`;
  for (let i = 0; i < 40; i++) {
    const x = 232 + R() * 40, y = 44 + R() * 350;
    b += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(6 + R() * 10).toFixed(1)}" height="${(6 + R() * 12).toFixed(1)}" rx="2" fill="${R() > 0.5 ? COL.sei : "#E2B48C"}"/>`;
  }
  b += text(253, 430, "SEI 膜", { size: 18, anchor: "middle", weight: "bold", fill: COL.sei });
  b += text(253, 452, "几–几十 nm", { size: 13, anchor: "middle", fill: COL.muted });
  // electrolyte
  b += `<rect x="276" y="40" width="530" height="360" fill="${COL.electrolyte}"/>`;
  b += text(560, 430, "电解液 Electrolyte", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  // solvent molecules
  for (let i = 0; i < 16; i++) {
    const x = 600 + R() * 190, y = 150 + R() * 140;
    b += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="14" ry="8" fill="#9CC9E0"/>`;
  }
  // Li+ passes
  b += arrow(560, 120, 160, 120, { color: COL.purple, width: 3.5, head: 15 });
  b += ion(400, 120, { r: 13 });
  b += check(320, 85, 11);
  b += text(470, 92, "Li⁺ 可以通过", { size: 17, fill: COL.purple, weight: "bold" });
  // electron blocked
  b += arrow(140, 240, 222, 240, { color: COL.amber, width: 3.5, head: 14 });
  b += electron(120, 240, 13);
  b += cross(300, 240, 12);
  b += text(330, 247, "电子过不去", { size: 17, fill: COL.red, weight: "bold" });
  // solvent bounces off
  b += `<ellipse cx="380" cy="340" rx="18" ry="10" fill="#7FB8DA"/>`;
  b += `<path d="M 470 360 Q 300 360 296 335 Q 300 310 470 300" fill="none" stroke="#3A7CA5" stroke-width="3" stroke-dasharray="7 5"/>`;
  b += head(472, 300, -0.1, "#3A7CA5", 13);
  b += `<rect x="480" y="302" width="200" height="62" rx="10" fill="#FFFFFF" opacity="0.85"/>`;
  b += lines(490, 325, ["溶剂分子碰不到电极", "→ 不再继续分解"], { size: 16, fill: "#3A7CA5", weight: "bold", lh: 24 });
  return svg(W, H, b);
};

// ---------- Li dendrites (Fig. 2b style) ----------
figs.dendrite = () => {
  const W = 900, H = 440;
  let b = "";
  // panel 1
  b += `<rect x="30" y="250" width="290" height="34" fill="${COL.copper}"/>`;
  b += text(175, 273, "Cu 集流体", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += `<rect x="30" y="190" width="290" height="60" fill="#B9C3CC"/>`;
  b += text(175, 228, "Li 金属", { size: 18, anchor: "middle", weight: "bold" });
  b += `<rect x="30" y="170" width="290" height="20" fill="#C98B5E"/>`;
  b += text(175, 185, "SEI", { size: 14, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += text(175, 330, "刚开始：SEI 均匀", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += arrow(345, 215, 440, 215, { color: COL.ink, width: 3.5, head: 15 });
  b += text(392, 200, "循环", { size: 16, anchor: "middle", weight: "bold" });
  // panel 2
  const X = 465;
  b += `<rect x="${X}" y="250" width="400" height="34" fill="${COL.copper}"/>`;
  b += `<path d="M${X},250 L${X},200 Q${X + 40},190 ${X + 70},200 L${X + 110},205 Q${X + 150},195 ${X + 190},205 L${X + 260},200 Q${X + 320},192 ${X + 400},205 L${X + 400},250 Z" fill="#B9C3CC"/>`;
  // SEI segments with cracks
  b += `<path d="M${X},200 Q${X + 40},190 ${X + 70},200" fill="none" stroke="#C98B5E" stroke-width="9"/>`;
  b += `<path d="M${X + 150},197 Q${X + 175},199 ${X + 190},205 L${X + 250},201" fill="none" stroke="#C98B5E" stroke-width="9"/>`;
  b += `<path d="M${X + 310},196 Q${X + 360},194 ${X + 400},205" fill="none" stroke="#C98B5E" stroke-width="9"/>`;
  // dendrites
  const den = (x, y, h, s) => {
    const R = rng(s);
    let d = `M${x},${y}`;
    let cx = x, cy = y;
    let out = "";
    for (let i = 0; i < 6; i++) {
      cx += (R() - 0.5) * 18;
      cy -= h / 6;
      d += ` L${cx.toFixed(1)},${cy.toFixed(1)}`;
      if (i > 1 && i < 5) out += `<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + (R() > 0.5 ? 1 : -1) * (14 + R() * 10)).toFixed(1)}" y2="${(cy - 10 - R() * 8).toFixed(1)}" stroke="#8F9BA6" stroke-width="5" stroke-linecap="round"/>`;
    }
    return `<path d="${d}" fill="none" stroke="#8F9BA6" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>` + out;
  };
  b += den(X + 105, 203, 120, 4);
  b += den(X + 285, 200, 165, 8);
  // separator line
  b += `<line x1="${X - 10}" y1="62" x2="${X + 410}" y2="62" stroke="${COL.purple}" stroke-width="4" stroke-dasharray="12 7"/>`;
  b += text(X + 410, 50, "隔膜", { size: 15, anchor: "end", fill: COL.purple, weight: "bold" });
  b += cross(X + 290, 62, 12);
  // dead Li
  [[X + 175, 130], [X + 205, 105], [X + 365, 140]].forEach(([x, y], i) => {
    b += blob(x, y, 15, 300 + i, { fill: "#C98B5E", jag: 0.2, n: 8 }) + blob(x, y, 9, 300 + i, { fill: "#8F9BA6", jag: 0.2, n: 8 });
  });
  b += lines(X + 40, 140, ["枝晶", "Dendrite"], { size: 16, anchor: "middle", weight: "bold", lh: 20 });
  b += text(X + 380, 175, "死锂", { size: 16, anchor: "middle", weight: "bold", fill: COL.sei });
  b += text(X + 380, 194, "Dead Li", { size: 13, anchor: "middle", fill: COL.sei });
  b += text(X + 50, 235, "SEI 破裂处", { size: 13, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(X + 200, 330, "SEI 破裂 → 局部沉积不均 → 枝晶与死锂", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  // consequence chain
  const cy = 380;
  const steps = ["枝晶刺穿隔膜", "内部短路", "热失控 / 起火"];
  steps.forEach((s, i) => {
    const x = 120 + i * 270;
    b += `<rect x="${x - 95}" y="${cy}" width="190" height="42" rx="21" fill="${i === 2 ? COL.red : "#FBEDEC"}"/>`;
    b += text(x, cy + 28, s, { size: 17, anchor: "middle", weight: "bold", fill: i === 2 ? "#FFFFFF" : COL.red });
    if (i < 2) b += arrow(x + 100, cy + 21, x + 168, cy + 21, { color: COL.red, width: 3, head: 12 });
  });
  return svg(W, H, b);
};

// ---------- Polysulfide shuttle (Fig. 2c style) ----------
const chain = (x, y, n, r, col = COL.sulfur) => {
  let s = "";
  for (let i = 0; i < n; i++) s += `<circle cx="${x + i * r * 1.7}" cy="${y + (i % 2 ? 3 : -3)}" r="${r}" fill="${col}" stroke="#A67C00" stroke-width="1.2"/>`;
  // Li end caps
  s += `<circle cx="${x - r * 1.6}" cy="${y}" r="${r * 0.8}" fill="${COL.purple}"/>`;
  s += `<circle cx="${x + (n - 1) * r * 1.7 + r * 1.6}" cy="${y}" r="${r * 0.8}" fill="${COL.purple}"/>`;
  return s;
};
figs.polysulfide = () => {
  const W = 900, H = 470;
  let b = "";
  b += `<rect x="30" y="40" width="230" height="300" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="2"/>`;
  b += `<rect x="260" y="40" width="470" height="300" fill="${COL.electrolyte}"/>`;
  b += `<rect x="730" y="40" width="140" height="300" fill="#B9C3CC"/>`;
  b += text(145, 30, "S–C 复合正极", { size: 16, anchor: "middle", weight: "bold" });
  b += text(495, 30, "液体电解质", { size: 16, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(800, 30, "Li 金属负极", { size: 16, anchor: "middle", weight: "bold" });
  b += lines(145, 110, ["充电态 S_{8}", "⇅", "放电态 Li_{2}S"], { size: 18, anchor: "middle", weight: "bold", lh: 30 });
  b += lines(145, 245, ["中间产物 Li_{2}S_{x}", "溶解出来"], { size: 16, anchor: "middle", fill: COL.red, weight: "bold", lh: 24 });
  b += arrow(205, 285, 300, 285, { color: COL.red, width: 3, head: 12 });
  // dissolved chains
  b += chain(330, 90, 8, 8);
  b += chain(330, 285, 6, 8);
  // self-discharge: chain travels to anode and gets reduced
  b += arrow(470, 90, 700, 90, { color: COL.ink, width: 3, head: 13 });
  b += text(585, 75, "自放电：跑到负极被还原", { size: 15, anchor: "middle", weight: "bold" });
  b += chain(745, 125, 2, 8, "#E8C766");
  b += text(800, 165, "Li_{2}S 沉积", { size: 14, anchor: "middle", weight: "bold" });
  b += text(800, 184, "（绝缘层）", { size: 13, anchor: "middle", fill: COL.text2 });
  // shuttle loop
  b += `<path d="M 560 200 C 680 200, 700 260, 600 268" fill="none" stroke="${COL.purple}" stroke-width="3.5"/>`;
  b += head(598, 268, Math.PI * 0.97, COL.purple, 14);
  b += `<path d="M 450 268 C 330 268, 320 205, 430 200" fill="none" stroke="${COL.purple}" stroke-width="3.5"/>`;
  b += head(432, 200, -0.02, COL.purple, 14);
  b += text(495, 238, "穿梭 Shuttle", { size: 18, anchor: "middle", fill: COL.purple, weight: "bold" });
  // ladder
  const ly = 400;
  const sp = ["S_{8}", "Li_{2}S_{8}", "Li_{2}S_{6}", "Li_{2}S_{4}", "Li_{2}S_{2}", "Li_{2}S"];
  sp.forEach((s, i) => {
    const x = 80 + i * 150;
    const sol = i >= 1 && i <= 3;
    b += `<rect x="${x - 55}" y="${ly}" width="110" height="40" rx="20" fill="${sol ? "#FBEDEC" : "#FFFFFF"}" stroke="${sol ? COL.red : COL.line}" stroke-width="2"/>`;
    b += text(x, ly + 27, s, { size: 18, anchor: "middle", weight: "bold", fill: sol ? COL.red : COL.ink });
    if (i < 5) b += arrow(x + 58, ly + 20, x + 92, ly + 20, { color: COL.muted, width: 2.5, head: 10 });
  });
  b += text(380, ly - 12, "↑ 中间这三种能溶进电解液", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(80, ly - 12, "固体", { size: 14, anchor: "middle", fill: COL.muted });
  b += text(755, ly - 12, "固体（放电终点）", { size: 14, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Energy density map (Fig. 2d redrawn) ----------
figs.energy_map = () => {
  const W = 760, H = 540;
  let b = "";
  const X0 = 110, X1 = 720, Y0 = 470, Y1 = 30; // plot box
  const lx = (v) => X0 + ((Math.log10(v) - 1) / 3.5) * (X1 - X0); // 10 .. 10^4.5
  const ly = (v) => Y0 - ((Math.log10(v) - 1) / 3.5) * (Y0 - Y1);
  b += `<rect x="${X0}" y="${Y1}" width="${X1 - X0}" height="${Y0 - Y1}" fill="#FFFFFF" stroke="${COL.line}" stroke-width="2"/>`;
  [10, 100, 1000, 10000].forEach((v) => {
    b += `<line x1="${lx(v)}" y1="${Y1}" x2="${lx(v)}" y2="${Y0}" stroke="#EEF2F5" stroke-width="1.5"/>`;
    b += `<line x1="${X0}" y1="${ly(v)}" x2="${X1}" y2="${ly(v)}" stroke="#EEF2F5" stroke-width="1.5"/>`;
    b += text(lx(v), Y0 + 24, v.toLocaleString("en-US"), { size: 15, anchor: "middle", fill: COL.text2 });
    b += text(X0 - 10, ly(v) + 5, v.toLocaleString("en-US"), { size: 15, anchor: "end", fill: COL.text2 });
  });
  b += text((X0 + X1) / 2, Y0 + 56, "质量能量密度 Specific energy（Wh kg^{−1}）", { size: 17, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(34 ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "体积能量密度 Energy density（Wh L^{−1}）", { size: 17, anchor: "middle", weight: "bold" }) + `</g>`;
  const E = (x, y, rx, ry, fill, lab, o = {}) => {
    const cx = lx(x), cy = ly(y);
    let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(-38 ${cx} ${cy})" fill="${fill}" stroke="${o.stroke || "#FFFFFF"}" stroke-width="2"/>`;
    s += text(cx + (o.tx || 0), cy + (o.ty || 0), lab, { size: o.size || 16, anchor: o.anchor || "start", weight: "bold", fill: o.col || COL.ink });
    return s;
  };
  b += E(14, 18, 18, 12, COL.sulfurLight, "液流电池 Redox flow", { tx: 26, ty: 6, stroke: COL.sulfur });
  b += E(38, 90, 12, 10, COL.tealLight, "铅酸", { tx: 10, ty: 32, stroke: COL.teal });
  b += E(48, 125, 12, 10, "#7FC4BE", "镍镉", { tx: -16, ty: -16, anchor: "end", stroke: COL.teal });
  b += E(70, 160, 14, 11, COL.teal, "镍氢", { tx: 18, ty: 22, stroke: COL.teal });
  b += E(200, 450, 38, 20, "#8FB9DD", "锂离子 Li-ion", { tx: 28, ty: 30, stroke: "#3A7CA5" });
  b += E(700, 1400, 46, 22, "#2F5D8A", "Si 或 Li 金属负极", { tx: 40, ty: 34 });
  b += E(2400, 2800, 10, 10, COL.purple, "Li–S", { tx: 16, ty: 6, col: COL.purple });
  b += E(3500, 6300, 11, 11, "#4B2E83", "Li–空气", { tx: -18, ty: 6, anchor: "end", col: "#4B2E83" });
  b += E(12000, 9500, 11, 11, COL.ink, "汽油", { tx: -16, ty: -14, anchor: "end" });
  b += text(X0 + 14, Y1 + 26, "越往右上越好", { size: 15, fill: COL.amber, weight: "bold" });
  b += arrow(X0 + 130, Y1 + 60, X0 + 200, Y1 + 20, { color: COL.amber, width: 3, head: 12 });
  return svg(W, H, b);
};

// ---------- Chapter map (Table 1 -> chapters) ----------
figs.chapter_map = () => {
  const W = 1200, H = 470;
  let b = "";
  const cols = ["2 力学", "3 离子传输", "4 电子传输", "5 化学相互作用", "6 稳定界面", "7 安全"];
  const rows = [
    { name: "Si 负极", sub: "粉化、失去电接触", col: COL.siDark, cells: ["弹性 / 自修复|粘结剂", "", "导电高分子|粘结剂", "氢键|粘住 Si 表面", "粘结剂|参与 SEI", "●"] },
    { name: "Li 金属负极", sub: "枝晶、死锂、高反应性", col: COL.purple, cells: ["高模量电解质|压住枝晶", "固态|聚合物电解质", "", "", "人工 SEI|涂层", "●"] },
    { name: "S 正极", sub: "多硫化物溶解、穿梭", col: COL.sulfur, cells: ["", "", "导电高分子", "N/O/S 基团|捕获 Li_{2}S_{x}", "", "●"] },
  ];
  const x0 = 220, cw = 160, y0 = 70, rh = 112;
  cols.forEach((c, j) => {
    const x = x0 + j * cw;
    b += `<rect x="${x + 4}" y="12" width="${cw - 8}" height="44" rx="22" fill="${j === 5 ? COL.red : COL.ink}"/>`;
    b += text(x + cw / 2, 41, c, { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  });
  rows.forEach((r, i) => {
    const y = y0 + i * rh;
    b += `<rect x="10" y="${y + 6}" width="${x0 + 5 * cw - 10}" height="${rh - 12}" rx="14" fill="${i % 2 ? "#FFFFFF" : "#F5F7F9"}"/>`;
    b += `<circle cx="34" cy="${y + rh / 2 - 12}" r="9" fill="${r.col}"/>`;
    b += text(52, y + rh / 2 - 6, r.name, { size: 20, weight: "bold", fill: r.col });
    b += text(28, y + rh / 2 + 22, r.sub, { size: 14, fill: COL.text2 });
    r.cells.forEach((c, j) => {
      if (!c) return;
      const x = x0 + j * cw + cw / 2;
      if (c === "●") return;
      b += `<rect x="${x - cw / 2 + 8}" y="${y + 22}" width="${cw - 16}" height="${rh - 44}" rx="12" fill="#FFFFFF" stroke="${r.col}" stroke-width="2.5"/>`;
      const parts = c.split("|");
      b += lines(x, y + rh / 2 + (parts.length === 1 ? 6 : -6), parts, { size: 15, anchor: "middle", weight: "bold", lh: 22, fill: COL.ink });
    });
  });
  // safety column spanning
  const sx = x0 + 5 * cw;
  b += `<rect x="${sx + 8}" y="${y0 + 22}" width="${cw - 16}" height="${rows.length * rh - 44}" rx="12" fill="#FBEDEC" stroke="${COL.red}" stroke-width="2.5"/>`;
  b += lines(sx + cw / 2, y0 + rows.length * rh / 2 - 30, ["所有体系", "熔断隔膜", "PTC 开关", "阻燃高分子"], { size: 15, anchor: "middle", weight: "bold", fill: COL.red, lh: 24 });
  b += text(x0 + 1 * cw + cw / 2, y0 + 3 * rh + 30, "第 3 章的聚合物电解质也适用于其他体系", { size: 14, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Title motif: polymer chain wrapping cell ----------
figs.title_motif = () => {
  const W = 520, H = 520;
  let b = "";
  b += `<rect x="150" y="90" width="220" height="360" rx="34" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="0.9"/>`;
  b += `<rect x="215" y="56" width="90" height="38" rx="10" fill="#FFFFFF" opacity="0.9"/>`;
  b += `<rect x="178" y="300" width="164" height="124" rx="16" fill="${COL.amber}"/>`;
  b += `<rect x="178" y="180" width="164" height="108" rx="16" fill="${COL.amberLight}"/>`;
  // polymer chain (zig-zag beads) wrapping
  let d = "M 60 470";
  const pts = [];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18;
    const x = 40 + t * 440;
    const y = 300 + Math.sin(t * Math.PI * 2.2) * 120 + (i % 2 ? 14 : -14);
    pts.push([x, y]);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  b += `<path d="${d}" fill="none" stroke="${COL.tealLight}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
  pts.forEach(([x, y], i) => (b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 3 === 0 ? 11 : 7}" fill="${i % 3 === 0 ? COL.teal : "#FFFFFF"}" stroke="${COL.teal}" stroke-width="3"/>`));
  return svg(W, H, b);
};

module.exports = figs;

// ---------- Si history timeline ----------
figs.si_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1976", who: ["Sharma & Seefurth"], what: ["高温下研究", "Li–Si 合金"], color: COL.text2 },
    { year: "2001", who: ["Beaulieu & Dahn"], what: ["室温下的", "“巨大”体积变化"], color: COL.text2 },
    { year: "2004", who: ["Obrovac & Christensen"], what: ["发现最终相", "Li_{15}Si_{4}"], color: COL.text2 },
    { year: "2008", who: ["Chan, Cui 等"], what: ["Si 纳米线", "给膨胀留空间"], color: COL.purple },
    { year: "2012", who: ["Liu 等"], what: ["临界尺寸", "≈150 nm"], color: COL.purple },
    { year: "2013", who: ["Wang, Bao 等"], what: ["自修复", "高分子粘结剂"], color: COL.teal },
    { year: "2016", who: ["Li, Cui 等"], what: ["石墨烯笼", "包覆微米 Si"], color: COL.purple },
    { year: "2017", who: ["Choi, Coskun 等"], what: ["聚轮烷", "弹性粘结剂"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 90, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Graphite host vs Li metal (drawings only; text lives on the slide) ----------
figs.graphite_host = () => {
  const W = 340, H = 220;
  let b = "";
  for (let k = 0; k < 6; k++) b += `<rect x="20" y="${20 + k * 34}" width="300" height="11" rx="5.5" fill="#4F5B66"/>`;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) b += `<circle cx="${(r % 2 ? 60 : 40) + c * 60}" cy="${48 + r * 34}" r="9" fill="${COL.purple}"/>`;
  return svg(W, H, b);
};
figs.li_hostless = () => {
  const W = 300, H = 220;
  let b = "";
  b += `<rect x="20" y="170" width="260" height="30" fill="${COL.copper}"/>`;
  b += `<path d="M20,170 L20,92 Q55,62 90,88 Q125,44 160,84 Q195,56 230,86 Q255,70 280,84 L280,170 Z" fill="#B9C3CC"/>`;
  b += `<rect x="20" y="146" width="260" height="24" fill="#DCE3E9"/>`;
  b += `<line x1="20" y1="146" x2="280" y2="146" stroke="#8F9BA6" stroke-width="2" stroke-dasharray="6 5"/>`;
  b += arrow(150, 140, 150, 66, { color: COL.purple, width: 4, head: 16 });
  return svg(W, H, b);
};
