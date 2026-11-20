// Figures for Zhao et al. 2020, Chapter 6 (High-energy-density systems & outlook)
// Canvases are sized so that 15 px text stays >= 11 pt at the planned slide width.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const LI = "#B9C3CC";
const SSE = "#E6EEF3";
const PEO = "#C99BBF";
function chain(x1, y, x2, o = {}) {
  const amp = o.amp ?? 6, per = o.per ?? 22;
  let d = `M${x1},${y}`;
  let k = 0;
  for (let x = x1; x < x2 - 1; x += per / 2, k++) d += ` q ${per / 4} ${k % 2 ? amp : -amp} ${per / 2} 0`;
  return `<path d="${d}" fill="none" stroke="${o.color || PEO}" stroke-width="${o.w || 3}" stroke-linecap="round"/>`;
}
// S8 crown drawn as an 8-membered ring of atoms
function s8(cx, cy, r, col = COL.sulfur) {
  let s = "";
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a) * (i % 2 ? 0.8 : 1)]);
  }
  s += `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="3"/>`;
  pts.forEach(([x, y]) => (s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 0.28).toFixed(1)}" fill="${col}"/>`));
  return s;
}
function o2(cx, cy, r = 9, col = COL.teal) {
  return `<circle cx="${cx - r * 0.8}" cy="${cy}" r="${r}" fill="${col}"/><circle cx="${cx + r * 0.8}" cy="${cy}" r="${r}" fill="${col}"/>`;
}

// ---------- Title motif ----------
figs.title_motif = () => {
  const W = 480, H = 520;
  let b = "";
  b += `<rect x="60" y="60" width="90" height="400" rx="12" fill="${LI}"/>`;
  b += `<rect x="150" y="60" width="22" height="400" fill="#9FB0C0"/>`;
  // three cathode options stacked
  b += `<rect x="172" y="60" width="250" height="120" rx="0" fill="${COL.amberLight}"/>`;
  for (let k = 0; k < 5; k++) b += `<line x1="190" y1="${80 + k * 20}" x2="404" y2="${80 + k * 20}" stroke="${COL.amber}" stroke-width="5"/>`;
  b += `<rect x="172" y="190" width="250" height="130" fill="#3A4C5E"/>`;
  b += s8(240, 255, 34) + s8(350, 255, 30);
  b += `<rect x="172" y="330" width="250" height="130" fill="#3A4C5E"/>`;
  [[220, 370], [300, 400], [370, 365], [250, 430], [360, 430]].forEach(([x, y]) => (b += o2(x, y, 11, COL.tealLight)));
  return svg(W, H, b);
};

// ---------- Commercialisation / systems timeline ----------
figs.systems_timeline = () => {
  const W = 1110, H = 320;
  const ev = [
    { year: "1966", who: ["Kummer & Weber"], what: ["Ford：β-Al_{2}O_{3}", "高温 Na–S 电池"], color: COL.text2 },
    { year: "1992", who: ["Bates 等"], what: ["ORNL：LiPON", "薄膜电解质"], color: COL.text2 },
    { year: "1996", who: ["Abraham & Jiang"], what: ["聚合物电解质", "Li–O_{2} 电池"], color: COL.teal },
    { year: "2000s", who: ["NGK"], what: ["Na–S 储能站", "商业运行"], color: COL.text2 },
    { year: "2011", who: ["Bolloré"], what: ["Bluecar：PEO", "Li 金属聚合物电池"], color: COL.purple },
    { year: "2014", who: ["Zhu, Chen 等"], what: ["全固态", "有机正极电池"], color: COL.sulfur },
    { year: "2016", who: ["美国能源部"], what: ["Battery500", "目标 500 Wh kg^{−1}"], color: COL.amber },
    { year: "2017", who: ["Hu, Chen 等"], what: ["SPE 柔性", "Li–CO_{2} 软包电池"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 150, left: 80, right: 1010, whoSize: 17, whatSize: 16, yearSize: 24 }));
};

// ---------- Three commercial successes ----------
figs.commercial = () => {
  const W = 990, H = 330;
  let b = "";
  const card = (ox, title, col) => `<rect x="${ox}" y="10" width="310" height="310" rx="16" fill="#F5F7F9"/>` + text(ox + 155, 44, title, { size: 19, anchor: "middle", weight: "bold", fill: col });
  // Na–S
  b += card(10, "高温 Na–S 储能", COL.sulfur);
  b += `<rect x="70" y="70" width="190" height="130" rx="10" fill="#FFFFFF" stroke="${COL.line}" stroke-width="2"/>`;
  for (let i = 0; i < 5; i++) b += `<rect x="${86 + i * 34}" y="84" width="24" height="102" rx="12" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="2"/>`;
  b += lines(165, 236, ["β-NaAl_{11}O_{17} 导 Na⁺", "300–350 °C 运行", "50 MW 级，>4500 圈"], { size: 16, anchor: "middle", lh: 25 });
  // Bluecar
  b += card(340, "Li 金属聚合物电动车", COL.purple);
  b += `<path d="M390,170 L410,120 Q420,104 440,104 L560,104 Q580,104 592,120 L612,170 Z" fill="${COL.purpleLight}"/>`;
  b += `<rect x="380" y="166" width="242" height="34" rx="10" fill="${COL.purple}"/>`;
  b += `<circle cx="430" cy="202" r="17" fill="${COL.ink}"/><circle cx="572" cy="202" r="17" fill="${COL.ink}"/>`;
  b += lines(495, 256, ["PEO 基 SPE + LiFePO_{4}", "30 kWh，续航约 250 km"], { size: 16, anchor: "middle", lh: 25 });
  // LiPON
  b += card(670, "LiPON 薄膜电池", COL.teal);
  b += `<rect x="740" y="90" width="170" height="108" rx="12" fill="#FFFFFF" stroke="${COL.line}" stroke-width="2"/>`;
  b += `<rect x="760" y="112" width="40" height="30" rx="4" fill="${COL.sulfur}"/>`;
  [0, 1, 2, 3].forEach((k) => (b += `<rect x="820" y="${112 + k * 18}" width="74" height="10" fill="${[COL.alu, COL.amberLight, COL.tealLight, LI][k]}"/>`));
  b += lines(825, 236, ["智能卡、植入式医疗器件", "容量 0.001–0.01 Ah"], { size: 16, anchor: "middle", lh: 25 });
  return svg(W, H, b);
};

// ---------- Anode excess (N/P) ----------
figs.np_ratio = () => {
  const W = 640, H = 400;
  let b = "";
  const row = (y, label, aw, acol, sseW, note, nc) => {
    let s = text(10, y + 34, label, { size: 16, weight: "bold" });
    let x = 170;
    s += `<rect x="${x}" y="${y}" width="${aw}" height="54" fill="${acol}"/>`;
    x += aw;
    s += `<rect x="${x}" y="${y}" width="${sseW}" height="54" fill="${sseW > 20 ? COL.electrolyte : "#9FB0C0"}"/>`;
    x += sseW;
    s += `<rect x="${x}" y="${y}" width="160" height="54" fill="${COL.amberLight}"/>`;
    s += text(x + 80, y + 33, "正极 4 mAh", { size: 15, anchor: "middle", weight: "bold" });
    s += text(170, y + 76, note, { size: 15, fill: nc, weight: "bold" });
    return s;
  };
  b += row(20, "石墨负极", 150, "#4F5B66", 30, "安全但容量低：负极厚、重", COL.text2);
  b += row(140, "厚 Li（过量）", 190, LI, 30, "液体电解质下 Li 不断被消耗，只能多放 Li", COL.red);
  b += row(260, "薄 Li + SSE", 70, LI, 12, "SSE 减少 Li 损耗 → 负极/正极容量比 ≤ 1", COL.teal);
  b += `<line x1="170" y1="386" x2="560" y2="386" stroke="${COL.line}" stroke-width="2"/>`;
  b += text(560, 380, "示意（宽度 ≈ 厚度）", { size: 15, anchor: "end", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Wet coating + roll press / thin composite ----------
figs.rollpress = () => {
  const W = 640, H = 370;
  let b = "";
  // left: coating + roll press
  b += text(150, 26, "① 湿法涂布 + 辊压", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += `<rect x="10" y="190" width="290" height="40" fill="${COL.amberLight}"/>`;
  b += text(60, 216, "电极", { size: 15, anchor: "middle", weight: "bold" });
  b += `<path d="M10,190 L120,190 L120,176 Q70,150 30,176 L10,176 Z" fill="${COL.tealLight}"/>`;
  b += `<rect x="120" y="182" width="180" height="8" fill="${COL.teal}"/>`;
  b += `<circle cx="160" cy="130" r="44" fill="#DCE3E9" stroke="${COL.siDark}" stroke-width="3"/>`;
  b += `<circle cx="160" cy="130" r="8" fill="${COL.siDark}"/>`;
  b += arrow(220, 120, 290, 120, { color: COL.ink, width: 3, head: 12 });
  b += lines(150, 268, ["直接在正极或负极上成膜", "可做到约 20 μm"], { size: 15, anchor: "middle", lh: 22 });
  // right: nanoporous host
  const X = 340;
  b += text(X + 145, 26, "② 纳米孔聚酰亚胺骨架", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  b += `<rect x="${X}" y="60" width="290" height="170" fill="#F7EEF5"/>`;
  for (let i = 0; i < 12; i++) b += `<rect x="${X + 6 + i * 24}" y="60" width="9" height="170" fill="${COL.amber}"/>`;
  b += `<line x1="${X + 300}" y1="60" x2="${X + 300}" y2="230" stroke="${COL.ink}" stroke-width="2"/>`;
  b += text(X + 145, 256, "8.6 μm 厚，孔里填 PEO–LiTFSI", { size: 15, anchor: "middle", weight: "bold" });
  b += text(X + 145, 280, "（Wan 等 2019，稳定 200 圈）", { size: 15, anchor: "middle", fill: COL.text2 });
  b += `<rect x="10" y="306" width="620" height="54" rx="10" fill="#FDF2E7"/>`;
  b += text(320, 340, "共同思路：聚合物负责粘结和柔韧，无机物负责导离子和强度", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- Bipolar stacking ----------
figs.bipolar = () => {
  const W = 640, H = 420;
  let b = "";
  // left: conventional
  b += text(150, 26, "液体电解质：每节单独封装", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
  for (let i = 0; i < 3; i++) {
    const x = 20 + i * 92;
    b += `<rect x="${x}" y="50" width="80" height="230" rx="10" fill="#FFFFFF" stroke="${COL.siDark}" stroke-width="3"/>`;
    b += `<rect x="${x + 10}" y="62" width="60" height="50" fill="${COL.amberLight}"/>`;
    b += `<rect x="${x + 10}" y="112" width="60" height="100" fill="${COL.electrolyte}"/>`;
    b += `<rect x="${x + 10}" y="212" width="60" height="56" fill="#4F5B66"/>`;
    if (i < 2) b += `<path d="M${x + 40},280 L${x + 40},300 L${x + 132},300 L${x + 132},50 L${x + 132},40" fill="none" stroke="${COL.ink}" stroke-width="2.5"/>`;
  }
  b += lines(150, 340, ["单体之间靠外部导线串联", "外壳、连接件都占重量和体积"], { size: 15, anchor: "middle", lh: 22 });
  // right: bipolar
  const X = 360;
  b += text(X + 130, 26, "SSE：双极堆叠在同一外壳内", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += `<rect x="${X}" y="50" width="260" height="230" rx="12" fill="#FFFFFF" stroke="${COL.teal}" stroke-width="3"/>`;
  for (let i = 0; i < 3; i++) {
    const y = 60 + i * 72;
    b += `<rect x="${X + 14}" y="${y}" width="232" height="22" fill="${COL.amberLight}"/>`;
    b += `<rect x="${X + 14}" y="${y + 22}" width="232" height="12" fill="#9FB0C0"/>`;
    b += `<rect x="${X + 14}" y="${y + 34}" width="232" height="22" fill="${LI}"/>`;
    b += `<rect x="${X + 14}" y="${y + 56}" width="232" height="8" fill="${COL.copper}"/>`;
  }
  b += lines(X + 130, 340, ["固体不流动，不会在单元间“串液”", "单元直接叠放，电压相加、省掉外壳"], { size: 15, anchor: "middle", lh: 22, fill: COL.teal });
  b += text(320, 405, "黄 = 正极；灰 = SSE / Li；铜色 = 双极集流体（示意）", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Sulfur conversion route ----------
figs.sulfur_route = () => {
  const W = 640, H = 400;
  let b = "";
  const step = (x, y, lab, sub, fill, tc = COL.ink) => `<rect x="${x - 70}" y="${y - 28}" width="140" height="56" rx="28" fill="${fill}"/>` + text(x, y - 2, lab, { size: 16, anchor: "middle", weight: "bold", fill: tc }) + text(x, y + 19, sub, { size: 15, anchor: "middle", fill: tc });
  b += text(10, 30, "液体电解质", { size: 17, weight: "bold", fill: COL.red });
  b += step(90, 90, "S_{8}", "固", COL.sulfurLight);
  b += step(320, 90, "S_{x}^{2−}（x=3–8）", "液：溶解", "#FBEDEC", COL.red);
  b += step(550, 90, "S_{2}^{2−} → S^{2−}", "固", COL.sulfurLight);
  b += arrow(162, 90, 246, 90, { color: COL.ink, width: 3, head: 12 });
  b += arrow(392, 90, 476, 90, { color: COL.ink, width: 3, head: 12 });
  b += `<path d="M320,122 Q320,170 260,170" fill="none" stroke="${COL.red}" stroke-width="3" stroke-dasharray="6 4"/>`;
  b += text(250, 176, "穿梭、腐蚀 Li", { size: 15, anchor: "end", fill: COL.red, weight: "bold" });
  b += `<line x1="10" y1="205" x2="630" y2="205" stroke="${COL.line}" stroke-width="2"/>`;
  b += text(10, 240, "固态电解质", { size: 17, weight: "bold", fill: COL.teal });
  b += step(90, 300, "S_{8}", "固", COL.sulfurLight);
  b += step(550, 300, "Li_{2}S", "固", COL.sulfurLight);
  b += arrow(162, 300, 476, 300, { color: COL.teal, width: 4, head: 14 });
  b += text(320, 288, "SSE 当“桥”：固 → 固", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(320, 360, "代价：S 充放电体积变化约 80%，界面电阻会升高", { size: 15, anchor: "middle", fill: COL.amber, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Quinone (organic carbonyl) cathode ----------
figs.quinone = () => {
  const W = 600, H = 330;
  let b = "";
  const ring = (cx, cy, r, dbl) => {
    let s = "";
    const P = [];
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 3;
      P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    s += `<polygon points="${P.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${COL.ink}" stroke-width="3.5"/>`;
    dbl.forEach(([i, j]) => {
      const mx = (P[i][0] + P[j][0]) / 2, my = (P[i][1] + P[j][1]) / 2;
      const kx = cx + (mx - cx) * 0.78, ky = cy + (my - cy) * 0.78;
      const dx = (P[j][0] - P[i][0]) * 0.3, dy = (P[j][1] - P[i][1]) * 0.3;
      s += `<line x1="${(kx - dx).toFixed(1)}" y1="${(ky - dy).toFixed(1)}" x2="${(kx + dx).toFixed(1)}" y2="${(ky + dy).toFixed(1)}" stroke="${COL.ink}" stroke-width="3"/>`;
    });
    return { s, P };
  };
  // benzoquinone
  const q = ring(110, 150, 52, [[1, 2], [4, 5]]);
  b += q.s;
  b += `<line x1="${q.P[0][0] - 4}" y1="${q.P[0][1]}" x2="${q.P[0][0] - 4}" y2="${q.P[0][1] - 36}" stroke="${COL.red}" stroke-width="3"/><line x1="${q.P[0][0] + 4}" y1="${q.P[0][1]}" x2="${q.P[0][0] + 4}" y2="${q.P[0][1] - 36}" stroke="${COL.red}" stroke-width="3"/>`;
  b += `<line x1="${q.P[3][0] - 4}" y1="${q.P[3][1]}" x2="${q.P[3][0] - 4}" y2="${q.P[3][1] + 36}" stroke="${COL.red}" stroke-width="3"/><line x1="${q.P[3][0] + 4}" y1="${q.P[3][1]}" x2="${q.P[3][0] + 4}" y2="${q.P[3][1] + 36}" stroke="${COL.red}" stroke-width="3"/>`;
  b += text(110, 52, "O", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(110, 264, "O", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(230, 158, "+ 2 M⁺ + 2 e⁻", { size: 18, anchor: "middle", weight: "bold" });
  b += arrow(300, 150, 360, 150, { color: COL.ink, width: 3.5, head: 14 });
  // hydroquinone salt
  const h = ring(470, 150, 52, [[0, 1], [2, 3], [4, 5]]);
  b += h.s;
  b += `<line x1="${h.P[0][0]}" y1="${h.P[0][1]}" x2="${h.P[0][0]}" y2="${h.P[0][1] - 36}" stroke="${COL.red}" stroke-width="3"/>`;
  b += `<line x1="${h.P[3][0]}" y1="${h.P[3][1]}" x2="${h.P[3][0]}" y2="${h.P[3][1] + 36}" stroke="${COL.red}" stroke-width="3"/>`;
  b += text(470, 52, "OM", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(470, 264, "OM", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(300, 312, "M = Li、Na、K；C=O 双键每个接 1 个电子和 1 个 M⁺", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Metal–air with SSE ----------
figs.metal_air = () => {
  const W = 640, H = 410;
  let b = "";
  b += `<rect x="20" y="60" width="130" height="260" fill="${LI}"/>`;
  b += text(85, 196, "Li 金属", { size: 17, anchor: "middle", weight: "bold" });
  b += `<rect x="150" y="60" width="70" height="260" fill="#9FB0C0"/>`;
  b += `<g transform="translate(190 190) rotate(-90)">` + text(0, 0, "SSE", { size: 20, anchor: "middle", weight: "bold", fill: "#FFFFFF" }) + `</g>`;
  b += `<rect x="220" y="60" width="200" height="260" fill="#F5F7F9"/>`;
  const R = rng(9);
  for (let i = 0; i < 26; i++) b += `<circle cx="${(232 + R() * 176).toFixed(1)}" cy="${(72 + R() * 236).toFixed(1)}" r="${(8 + R() * 6).toFixed(1)}" fill="#3A4C5E"/>`;
  [[260, 130], [330, 250], [380, 110]].forEach(([x, y]) => (b += `<rect x="${x}" y="${y}" width="26" height="18" rx="4" fill="#F2F2F2" stroke="${COL.muted}"/>`));
  b += text(330, 345, "多孔碳空气正极", { size: 16, anchor: "middle", weight: "bold" });
  b += text(330, 368, "放电产物 Li_{2}O_{2}（白块）", { size: 15, anchor: "middle", fill: COL.text2 });
  // gases from right
  b += o2(500, 120, 10) + o2(540, 170, 10) + o2(500, 230, 10);
  b += arrow(470, 170, 430, 170, { color: COL.teal, width: 3.5, head: 13 });
  b += text(560, 110, "O_{2}", { size: 18, weight: "bold", fill: COL.teal });
  b += pill(470, 270, 70, 30, COL.red, "H_{2}O", { size: 15 });
  b += pill(550, 270, 76, 30, COL.red, "CO_{2}", { size: 15 });
  b += `<line x1="470" y1="250" x2="230" y2="250" stroke="${COL.red}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  b += cross(185, 250, 12);
  b += text(185, 46, "SSE 挡住 H_{2}O、CO_{2}，保护 Li", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(185, 345, "LATP、LAGP 或 SPE", { size: 15, anchor: "middle", fill: COL.text2, weight: "bold" });
  b += text(20, 400, "Zn–空气电池则需要导 OH⁻ 的 SSE（如季铵功能化 PVA 膜）", { size: 15, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Metal–CO2 / Mars ----------
figs.mars = () => {
  const W = 640, H = 380;
  let b = "";
  b += `<circle cx="140" cy="170" r="120" fill="#C8623B"/>`;
  b += `<ellipse cx="100" cy="130" rx="30" ry="18" fill="#A84E2E"/><ellipse cx="180" cy="210" rx="40" ry="20" fill="#A84E2E"/><ellipse cx="160" cy="110" rx="18" ry="10" fill="#E08F75"/>`;
  b += text(140, 178, "火星", { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(140, 330, "大气约 96% 是 CO_{2}", { size: 17, anchor: "middle", weight: "bold", fill: "#A84E2E" });
  const X = 300;
  const rxn = [
    ["4Li + 3CO_{2} → 2Li_{2}CO_{3} + C", "2.81 V · 1876 Wh kg^{−1}"],
    ["4Na + 3CO_{2} → 2Na_{2}CO_{3} + C", "2.35 V · 1125 Wh kg^{−1}"],
    ["2Al + 6CO_{2} → Al_{2}(C_{2}O_{4})_{3}", "1.3 V · 产物草酸铝可利用"],
  ];
  rxn.forEach(([r, v], i) => {
    const y = 40 + i * 100;
    b += `<rect x="${X}" y="${y}" width="330" height="80" rx="12" fill="#F5F7F9"/>`;
    b += text(X + 165, y + 34, r, { size: 17, anchor: "middle", weight: "bold" });
    b += text(X + 165, y + 62, v, { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  });
  b += text(X + 165, 364, "数据：原文 Table 2（理论值）", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- SIE vs SPE -> composite ----------
figs.sie_spe = () => {
  const W = 990, H = 330;
  let b = "";
  const card = (ox, title, col, pros, cons) => {
    let s = `<rect x="${ox}" y="10" width="300" height="250" rx="16" fill="#F5F7F9"/>`;
    s += text(ox + 150, 46, title, { size: 20, anchor: "middle", weight: "bold", fill: col });
    pros.forEach((t, i) => (s += check(ox + 30, 82 + i * 34, 9) + text(ox + 50, 88 + i * 34, t, { size: 16 })));
    cons.forEach((t, i) => (s += cross(ox + 30, 82 + (pros.length + i) * 34, 8) + text(ox + 50, 88 + (pros.length + i) * 34, t, { size: 16 })));
    return s;
  };
  b += card(10, "无机 SIE", COL.siDark, ["室温电导率高", "模量高、t⁺ ≈ 1"], ["脆、易裂", "与正负极界面差", "部分对空气敏感"]);
  b += card(345, "聚合物 SPE", COL.purple, ["柔软、易加工", "与 Li 负极贴合"], ["室温电导率低", ">4.2 V 易氧化", "模量低、挡不住枝晶"]);
  b += text(327, 140, "+", { size: 40, anchor: "middle", weight: "bold", fill: COL.ink });
  b += arrow(655, 135, 700, 135, { color: COL.teal, width: 4, head: 15 });
  b += `<rect x="710" y="10" width="270" height="250" rx="16" fill="#E8F4F3"/>`;
  b += text(845, 46, "复合 / 多层", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += `<rect x="740" y="70" width="210" height="34" fill="${COL.amberLight}"/>`;
  b += text(845, 93, "正极", { size: 15, anchor: "middle", weight: "bold" });
  b += `<rect x="740" y="104" width="210" height="22" fill="#F2DDEA"/>`;
  b += `<rect x="740" y="126" width="210" height="34" fill="#9FB0C0"/>`;
  b += text(845, 149, "SIE", { size: 15, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += `<rect x="740" y="160" width="210" height="22" fill="#F2DDEA"/>`;
  b += `<rect x="740" y="182" width="210" height="34" fill="${LI}"/>`;
  b += text(845, 205, "Li", { size: 15, anchor: "middle", weight: "bold" });
  b += text(845, 244, "粉色 = 聚合物 / 凝胶缓冲层", { size: 15, anchor: "middle", fill: "#7A2E52" });
  b += text(495, 300, "原文结论：在 SIE 与电极之间加液体、凝胶或聚合物缓冲层，构建贴合的界面", { size: 16, anchor: "middle", weight: "bold", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- Multiphase interfaces at the nanoscale ----------
figs.multiphase = () => {
  const W = 640, H = 400;
  let b = "";
  b += `<rect x="20" y="20" width="600" height="300" rx="14" fill="#F7EEF5"/>`;
  for (let k = 0; k < 9; k++) b += chain(30, 46 + k * 32, 610, { amp: 5, w: 2.5 });
  // ceramic grains cluster
  const G = [[180, 120, 60], [270, 170, 52], [190, 225, 50], [440, 110, 46], [480, 220, 58]];
  G.forEach(([x, y, r], i) => (b += blob(x, y, r, 900 + i, { fill: "#D7DEE5", stroke: COL.siDark, sw: 2.5, jag: 0.1 })));
  // electrode on right
  b += `<rect x="560" y="20" width="60" height="300" fill="${COL.amberLight}"/>`;
  // highlighted interfaces
  b += `<circle cx="228" cy="150" r="16" fill="none" stroke="${COL.red}" stroke-width="3.5"/>`;
  b += `<circle cx="125" cy="128" r="16" fill="none" stroke="${COL.purple}" stroke-width="3.5"/>`;
  b += `<circle cx="560" cy="250" r="16" fill="none" stroke="${COL.amber}" stroke-width="3.5"/>`;
  const leg = [[COL.red, "晶界 Grain boundary"], [COL.purple, "无机–有机界面"], [COL.amber, "电解质–电极界面"]];
  leg.forEach(([c, t], i) => {
    const x = 30 + i * 205;
    b += `<circle cx="${x + 12}" cy="358" r="11" fill="none" stroke="${c}" stroke-width="3.5"/>`;
    b += text(x + 30, 364, t, { size: 15, weight: "bold", fill: c });
  });
  b += text(320, 394, "纳米化 → 界面数量剧增：离子可能主要沿界面走", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Five design features ----------
figs.pentagon = () => {
  const W = 620, H = 500;
  let b = "";
  const cx = 310, cy = 260, R = 165;
  const items = [
    ["化学", "Chemical", COL.purple],
    ["几何", "Geometric", COL.teal],
    ["力学", "Mechanical", COL.red],
    ["电化学", "Electrochemical", COL.amber],
    ["界面传输", "Interfacial transport", COL.siDark],
  ];
  const P = items.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
  b += `<polygon points="${P.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="#F5F7F9" stroke="${COL.line}" stroke-width="3"/>`;
  P.forEach(([x, y], i) => (b += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${items[i][2]}" stroke-width="3" stroke-dasharray="6 4"/>`));
  b += `<circle cx="${cx}" cy="${cy}" r="62" fill="${COL.ink}"/>`;
  b += text(cx, cy - 4, "理想的", { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += text(cx, cy + 20, "SSE", { size: 20, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  items.forEach(([zh, en, c], i) => {
    const [x, y] = P[i];
    b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="46" fill="${c}"/>`;
    b += text(x, y + 6, zh, { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    const ly = i === 0 ? y - 56 : y + 68;
    b += text(x, ly, en, { size: 17, anchor: "middle", fill: c, weight: "bold" });
  });
  return svg(W, H, b);
};

// ---------- Whole-paper map ----------
figs.paper_map = () => {
  const W = 1110, H = 440;
  let b = "";
  const ch = [
    ["1", "引言与发展史", ["安全 + 高能量", "推动 SSE 再兴起"], COL.text2],
    ["2", "离子传输机理", ["SIE：跳跃传导", "SPE：随链段运动"], COL.purple],
    ["3", "Li / Na / 多价 SSE", ["一价离子已达门槛", "多价仍在起步"], COL.teal],
    ["4", "失效模式", ["界面反应、接触", "枝晶、电子电导"], COL.red],
    ["5", "设计策略", ["电导率 · 窗口 · 枝晶", "选择性 · 界面"], COL.amber],
    ["6", "体系与展望", ["富镍、S、O_{2}、CO_{2}", "薄、强、多相、安全"], COL.siDark],
  ];
  const cw = 170, gap = 14;
  ch.forEach(([n, t, l, c], i) => {
    const x = 10 + i * (cw + gap);
    b += `<rect x="${x}" y="20" width="${cw}" height="250" rx="16" fill="#F5F7F9"/>`;
    b += `<rect x="${x}" y="20" width="${cw}" height="12" rx="6" fill="${c}"/>`;
    b += `<circle cx="${x + cw / 2}" cy="82" r="28" fill="${c}"/>`;
    b += text(x + cw / 2, 92, n, { size: 26, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += text(x + cw / 2, 144, t, { size: 17, anchor: "middle", weight: "bold", fill: c });
    b += lines(x + cw / 2, 190, l, { size: 15, anchor: "middle", lh: 26, fill: COL.ink });
    if (i < 5) b += head(x + cw + gap - 1, 145, 0, COL.line, 12);
  });
  // grouping brackets
  const br = (x1, x2, lab, c) => `<path d="M${x1},292 L${x1},304 L${x2},304 L${x2},292" fill="none" stroke="${c}" stroke-width="3"/>` + text((x1 + x2) / 2, 332, lab, { size: 16, anchor: "middle", weight: "bold", fill: c });
  b += br(10, 10 + 3 * (cw + gap) - gap, "认识材料：结构、机理、家族", COL.purple);
  b += br(10 + 3 * (cw + gap), 10 + 5 * (cw + gap) - gap, "认识问题与对策", COL.red);
  b += br(10 + 5 * (cw + gap), 10 + 6 * (cw + gap) - gap, "走向应用", COL.siDark);
  b += `<rect x="10" y="360" width="${6 * cw + 5 * gap}" height="62" rx="31" fill="${COL.ink}"/>`;
  b += text(10 + (6 * cw + 5 * gap) / 2, 399, "目标：金属负极 + 高能正极的安全、高能量密度、可逆固态电池", { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  return svg(W, H, b);
};

module.exports = figs;
