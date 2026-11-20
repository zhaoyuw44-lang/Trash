// Figures for Manthiram, Yu & Wang 2017, Chapter 5 (Solid electrolytes with liquid or gaseous electrodes)
// Canvas scale: about 100 px per inch on the slide, so 16 px text ≈ 11.5 pt.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const LI = "#B9C3CC", LI_D = "#8F9BA6";
const ORG = "#EDE7F6"; // organic anolyte
const AQ = COL.electrolyte; // aqueous catholyte
const SSE = COL.amber, SSE_L = COL.amberLight;
const CAT = "#4F5B66";

// polysulfide chain (yellow beads)
const ps = (x, y, n = 4, r = 7) => {
  let s = "";
  for (let i = 0; i < n; i++) s += `<circle cx="${x + i * r * 1.6}" cy="${y + (i % 2 ? 3 : -3)}" r="${r}" fill="${COL.sulfur}" stroke="#A67C00" stroke-width="1.2"/>`;
  return s;
};
// bubble
const bub = (x, y, r, c = "#FFFFFF") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.7"/>`;
// O2 molecule
const o2 = (x, y) => `<circle cx="${x - 7}" cy="${y}" r="9" fill="${COL.red}"/><circle cx="${x + 7}" cy="${y}" r="9" fill="${COL.red}"/>`;

// external circuit with load on top
function circuit(x1, x2, yTop, yStart, label = "放电") {
  let b = `<path d="M ${x1} ${yStart} V ${yTop} H ${x2} V ${yStart}" fill="none" stroke="${COL.ink}" stroke-width="3.5" stroke-linejoin="round"/>`;
  const mx = (x1 + x2) / 2;
  b += `<rect x="${mx - 50}" y="${yTop - 20}" width="100" height="40" rx="10" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3"/>`;
  b += text(mx, yTop + 7, label, { size: 17, anchor: "middle", weight: "bold" });
  b += electron(x1 + (mx - 50 - x1) / 2, yTop, 12);
  b += head(mx - 58, yTop, 0, COL.amber, 14);
  return b;
}

// ---------- Title motif: membrane as gatekeeper ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  b += `<rect x="40" y="60" width="130" height="440" rx="14" fill="${LI}" opacity="0.9"/>`;
  b += `<rect x="190" y="60" width="34" height="440" fill="${SSE}"/>`;
  b += `<path d="M 244 60 H 400 V 500 H 244 Z" fill="${AQ}" opacity="0.9"/>`;
  const R = rng(3);
  for (let i = 0; i < 18; i++) b += bub(260 + R() * 130, 80 + R() * 400, 6 + R() * 10);
  [130, 250, 370].forEach((y) => {
    b += arrow(120, y, 290, y, { color: "#FFFFFF", width: 5, head: 18 });
    b += ion(207, y, { r: 16 });
  });
  [190, 310, 430].forEach((y) => (b += ps(290, y, 4, 9) + cross(250, y, 13, "#FFFFFF", 5)));
  return svg(W, H, b);
};

// ---------- History timeline ----------
figs.ch5_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1962", who: ["Herbert & Ulam"], what: ["以硫为正极的", "电池专利"], color: COL.sulfur },
    { year: "1987", who: ["Semkow & Sammells"], what: ["首个可充 Li–O_{2}", "（类似固体氧化物燃料电池）"], color: COL.red },
    { year: "1992", who: ["Lühder 等"], what: ["Li–Br_{2} / Li–I_{2}", "固体电解质电池"], color: COL.purple },
    { year: "1996", who: ["Abraham & Jiang"], what: ["非水（聚合物）", "电解质 Li–O_{2}"], color: COL.red },
    { year: "2008", who: ["Hayashi, Tatsumisago"], what: ["全固态 Li–S", "（Li_{2}S 正极）"], color: COL.sulfur },
    { year: "2010", who: ["Imanishi; Zhou 等"], what: ["LATP 隔开的", "双电解质 Li–空气"], color: COL.red },
    { year: "2014", who: ["Chang, Zhou 等"], what: ["LATP 隔开的", "可充 Li–Br_{2}"], color: COL.purple },
    { year: "2015", who: ["Yu, Manthiram 等"], what: ["固态电解质隔开的", "混合电解质 Li–S"], color: COL.sulfur },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 90, right: 1130, whoSize: 19, whatSize: 17, yearSize: 28 }));
};

// ---------- Generic dual-electrolyte concept ----------
figs.hybrid_concept = () => {
  const W = 780, H = 450;
  let b = "";
  const y0 = 50, h = 270;
  b += `<rect x="30" y="${y0}" width="90" height="${h}" fill="${LI}"/>`;
  b += `<rect x="120" y="${y0}" width="220" height="${h}" fill="${ORG}"/>`;
  b += `<rect x="340" y="${y0}" width="34" height="${h}" fill="${SSE}"/>`;
  b += `<rect x="374" y="${y0}" width="336" height="${h}" fill="${AQ}"/>`;
  b += `<rect x="710" y="${y0}" width="40" height="${h}" fill="${CAT}"/>`;
  const R = rng(4);
  for (let i = 0; i < 14; i++) b += bub(390 + R() * 300, y0 + 15 + R() * (h - 30), 5 + R() * 8);
  // Li+ passes
  b += arrow(100, 105, 450, 105, { color: COL.purple, width: 3.5, head: 15 });
  b += ion(230, 105, { r: 12 }) + ion(357, 105, { r: 12 });
  b += check(357, 145, 11);
  // dissolved cathode species blocked
  b += ps(470, 200) + arrow(460, 200, 395, 200, { color: COL.sulfur, width: 3, head: 12 });
  b += cross(357, 200, 12);
  b += o2(560, 250) + `<circle cx="640" cy="160" r="11" fill="${COL.red}"/><circle cx="630" cy="170" r="7" fill="#FFFFFF" stroke="${COL.red}" stroke-width="2"/>`;
  // water blocked
  b += `<circle cx="420" cy="275" r="10" fill="#3A7CA5"/>` + arrow(408, 275, 385, 275, { color: "#3A7CA5", width: 3, head: 10 }) + cross(357, 275, 12);
  // dendrite blocked
  b += `<path d="M 120 250 L 160 246 L 190 258 L 230 250 L 262 256" fill="none" stroke="${LI_D}" stroke-width="7" stroke-linecap="round"/>`;
  b += `<line x1="200" y1="252" x2="214" y2="236" stroke="${LI_D}" stroke-width="4" stroke-linecap="round"/>`;
  b += cross(300, 255, 11);
  // labels
  const lab = (x, t1, t2, c) => text(x, y0 + h + 32, t1, { size: 18, anchor: "middle", weight: "bold", fill: c }) + text(x, y0 + h + 56, t2, { size: 16, anchor: "middle", fill: COL.text2 });
  b += lab(75, "Li 金属", "负极", COL.siDark);
  b += lab(230, "有机电解液", "负极侧 anolyte", COL.purple);
  b += lab(357, "SSE", "只让 Li⁺ 过", COL.amber);
  b += lab(545, "液态 / 气态正极", "正极侧 catholyte", "#3A7CA5");
  b += text(390, 34, "溶解的正极物质、水、O_{2} 和枝晶都被挡在膜的两侧", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- Aprotic Li–O2 problems ----------
figs.aprotic_problems = () => {
  const W = 780, H = 440;
  let b = "";
  const y0 = 40, h = 280;
  b += `<rect x="30" y="${y0}" width="110" height="${h}" fill="${LI}"/>`;
  b += `<rect x="140" y="${y0}" width="210" height="${h}" fill="${ORG}"/>`;
  // porous carbon cathode
  b += `<rect x="350" y="${y0}" width="300" height="${h}" fill="#F2F4F6"/>`;
  const R = rng(12);
  for (let i = 0; i < 70; i++) {
    const x = 360 + R() * 280, y = y0 + 10 + R() * (h - 20);
    b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(8 + R() * 6).toFixed(1)}" fill="#2B2F33"/>`;
  }
  // Li2O2 deposits clogging
  for (let i = 0; i < 26; i++) {
    const x = 362 + R() * 180, y = y0 + 12 + R() * (h - 24);
    b += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(14 + R() * 10).toFixed(1)}" height="${(10 + R() * 8).toFixed(1)}" rx="3" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="1.5"/>`;
  }
  // air side
  b += `<rect x="650" y="${y0}" width="100" height="${h}" fill="#FFFFFF" stroke="${COL.line}" stroke-width="2" stroke-dasharray="6 5"/>`;
  b += o2(700, 90);
  b += text(700, 150, "H_{2}O", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(700, 190, "CO_{2}", { size: 18, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += arrow(680, 90, 600, 90, { color: COL.red, width: 3, head: 12 });
  b += cross(620, 90, 11);
  b += `<path d="M 670 160 Q 450 120 260 160" fill="none" stroke="#3A7CA5" stroke-width="3" stroke-dasharray="8 6"/>` + head(258, 160, Math.PI - 0.2, "#3A7CA5", 13);
  b += pill(180, 120, 140, 30, COL.red, "电解液分解", { size: 16 });
  b += `<path d="M 670 200 Q 400 260 140 230" fill="none" stroke="${COL.text2}" stroke-width="3" stroke-dasharray="8 6"/>` + head(140, 230, Math.PI + 0.05, COL.text2, 13);
  b += pill(36, 250, 98, 30, COL.red, "腐蚀 Li", { size: 16 });
  // labels
  b += text(85, y0 + h + 32, "Li 金属", { size: 18, anchor: "middle", weight: "bold" });
  b += text(245, y0 + h + 32, "有机电解液", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(500, y0 + h + 32, "多孔碳空气正极", { size: 18, anchor: "middle", weight: "bold" });
  b += text(700, y0 + h + 32, "空气", { size: 18, anchor: "middle", weight: "bold" });
  b += `<rect x="350" y="${y0 + h + 52}" width="22" height="16" fill="${COL.sulfurLight}" stroke="${COL.sulfur}"/>`;
  b += text(380, y0 + h + 66, "= 不溶的放电产物 Li_{2}O_{2}，堵住孔道", { size: 16, fill: COL.sei, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Hybrid Li–air cell (Fig. 4a) ----------
figs.hybrid_liair = () => {
  const W = 780, H = 470;
  let b = "";
  const y0 = 110, h = 260;
  b += circuit(55, 725, 50, y0, "放电");
  b += `<rect x="30" y="${y0}" width="50" height="${h}" fill="${LI}"/>`;
  b += `<rect x="80" y="${y0}" width="260" height="${h}" fill="${ORG}"/>`;
  b += `<rect x="340" y="${y0}" width="30" height="${h}" fill="${SSE}"/>`;
  b += `<rect x="370" y="${y0}" width="330" height="${h}" fill="${AQ}"/>`;
  b += `<rect x="700" y="${y0}" width="50" height="${h}" fill="${CAT}"/>`;
  const R = rng(9);
  for (let i = 0; i < 16; i++) b += bub(390 + R() * 290, y0 + 15 + R() * (h - 30), 5 + R() * 9);
  b += arrow(110, 200, 470, 200, { color: COL.purple, width: 3.5, head: 15 });
  b += ion(210, 200, { r: 13 }) + ion(355, 200, { r: 13 }) + ion(430, 200, { r: 13 });
  b += o2(725, 300);
  b += text(220, 300, "Li → Li⁺ + e⁻", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(535, 300, "O_{2} 在催化剂上被还原", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(55, y0 + h + 30, "Li", { size: 18, anchor: "middle", weight: "bold" });
  b += text(210, y0 + h + 30, "有机电解液 anolyte", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(355, y0 + h + 58, "Li-SSE（如 LATP）", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(535, y0 + h + 30, "水系电解液 catholyte", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(725, y0 + h + 30, "催化剂", { size: 17, anchor: "middle", weight: "bold" });
  b += text(725, y0 + h + 52, "+ 空气", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Energy level diagram (Fig. 4b) ----------
figs.energy_levels = () => {
  const W = 640, H = 560;
  let b = "";
  const yv = (v) => 60 + (1.4 - v) * 100; // 1.4 V at y=60 … −3.0 V at y=500
  const lvl = (v, c, t1, t2) => {
    const y = yv(v);
    let s = `<line x1="60" y1="${y}" x2="300" y2="${y}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
    s += text(60, y - 12, t1, { size: 18, weight: "bold", fill: c });
    s += text(300, y + 26, t2, { size: 17, anchor: "end", fill: COL.ink });
    return s;
  };
  b += lvl(1.23, COL.teal, "酸性：E⁰ = 1.23 V", "O_{2} + 4H⁺ + 4e⁻ → 2H_{2}O");
  b += lvl(0.40, "#3A7CA5", "碱性：E⁰ = 0.40 V", "O_{2} + 2H_{2}O + 4e⁻ → 4OH⁻");
  b += lvl(-3.0, COL.purple, "负极：E⁰ ≈ −3.0 V", "Li ⇌ Li⁺ + e⁻");
  // OCV brackets
  const br = (x, v1, v2, c, t) => {
    let s = arrow(x, yv(v2) - 4, x, yv(v1) + 14, { color: c, width: 3.5, head: 14 });
    s += arrow(x, yv(v1) + 4, x, yv(v2) - 14, { color: c, width: 3.5, head: 14 });
    s += lines(x + 14, (yv(v1) + yv(v2)) / 2, t, { size: 19, weight: "bold", fill: c, lh: 26 });
    return s;
  };
  b += br(400, 0.40, -3.0, "#3A7CA5", ["碱性", "OCV", "≈ 3.4 V"]);
  b += br(530, 1.23, -3.0, COL.teal, ["酸性", "OCV", "≈ 4.23 V"]);
  b += text(60, 548, "电位 vs 标准氢电极 SHE（按比例）", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Alkaline vs acidic catholyte ----------
figs.alk_vs_acid = () => {
  const W = 780, H = 340;
  let b = "";
  const panel = (x, acid) => {
    let s = "";
    s += `<rect x="${x}" y="40" width="26" height="250" fill="${SSE}"/>`;
    s += `<rect x="${x + 26}" y="40" width="250" height="250" fill="${acid ? "#E8F4F3" : AQ}"/>`;
    s += `<rect x="${x + 276}" y="40" width="64" height="250" fill="${CAT}"/>`;
    const R = rng(acid ? 5 : 6);
    if (!acid) {
      for (let i = 0; i < 16; i++) {
        const xx = x + 30 + R() * 50, yy = 50 + R() * 230;
        s += `<rect x="${xx.toFixed(1)}" y="${yy.toFixed(1)}" width="${(12 + R() * 10).toFixed(1)}" height="${(10 + R() * 8).toFixed(1)}" fill="#FFFFFF" stroke="${COL.siDark}" stroke-width="2"/>`;
      }
      for (let i = 0; i < 12; i++) {
        const xx = x + 230 + R() * 40, yy = 50 + R() * 230;
        s += `<rect x="${xx.toFixed(1)}" y="${yy.toFixed(1)}" width="${(12 + R() * 8).toFixed(1)}" height="${(10 + R() * 8).toFixed(1)}" fill="#FFFFFF" stroke="${COL.siDark}" stroke-width="2"/>`;
      }
      s += pill(x + 96, 120, 130, 32, COL.red, "LiOH 析出", { size: 17 });
      s += text(x + 160, 200, "CO_{2} + 2LiOH", { size: 17, anchor: "middle", weight: "bold", fill: COL.ink });
      s += text(x + 160, 226, "→ Li_{2}CO_{3} + H_{2}O", { size: 17, anchor: "middle", weight: "bold", fill: COL.ink });
    } else {
      [[60, 70], [120, 95], [200, 66], [240, 100], [70, 270], [150, 268], [230, 272]].forEach(([dx, yy]) => (s += ion(x + dx, yy, { r: 10, fill: COL.teal, label: "H" })));
      s += pill(x + 70, 130, 180, 32, COL.teal, "弱酸 H₃PO₄ 等", { size: 17 });
      s += text(x + 160, 210, "产物溶于水，", { size: 17, anchor: "middle", weight: "bold", fill: COL.ink });
      s += text(x + 160, 236, "不堵孔、不怕 CO_{2}", { size: 17, anchor: "middle", weight: "bold", fill: COL.ink });
    }
    s += text(x + 170, 322, acid ? "酸性 catholyte" : "中性 / 碱性 catholyte", { size: 20, anchor: "middle", weight: "bold", fill: acid ? COL.teal : "#3A7CA5" });
    return s;
  };
  b += panel(20, false) + panel(420, true);
  return svg(W, H, b);
};

// ---------- Decoupled ORR / OER electrodes (Fig. 4c) ----------
figs.decoupled = () => {
  const W = 780, H = 470;
  let b = "";
  const y0 = 130, h = 250;
  b += `<rect x="30" y="${y0}" width="50" height="${h}" fill="${LI}"/>`;
  b += `<rect x="80" y="${y0}" width="170" height="${h}" fill="${ORG}"/>`;
  b += `<rect x="250" y="${y0}" width="30" height="${h}" fill="${SSE}"/>`;
  b += `<rect x="280" y="${y0}" width="400" height="${h}" fill="${AQ}"/>`;
  // OER mesh
  for (let y = y0 + 6; y < y0 + h; y += 14) b += `<line x1="470" y1="${y}" x2="500" y2="${y}" stroke="${COL.teal}" stroke-width="3"/>`;
  b += `<line x1="470" y1="${y0}" x2="470" y2="${y0 + h}" stroke="${COL.teal}" stroke-width="3"/><line x1="500" y1="${y0}" x2="500" y2="${y0 + h}" stroke="${COL.teal}" stroke-width="3"/>`;
  // ORR porous electrode
  b += `<rect x="680" y="${y0}" width="70" height="${h}" fill="${CAT}"/>`;
  const R = rng(2);
  for (let i = 0; i < 18; i++) b += `<circle cx="${(688 + R() * 54).toFixed(1)}" cy="${(y0 + 8 + R() * (h - 16)).toFixed(1)}" r="5" fill="#2B2F33"/>`;
  // wiring: Li to switch, then to OER (charge) or ORR (discharge)
  b += `<path d="M 55 ${y0} V 50 H 330" fill="none" stroke="${COL.ink}" stroke-width="3.5"/>`;
  b += `<circle cx="330" cy="50" r="7" fill="${COL.ink}"/>`;
  b += `<line x1="330" y1="50" x2="400" y2="30" stroke="${COL.ink}" stroke-width="3.5"/>`;
  b += `<path d="M 410 30 H 715 V ${y0}" fill="none" stroke="${COL.red}" stroke-width="3.5"/>`;
  b += `<path d="M 410 80 H 485 V ${y0}" fill="none" stroke="${COL.teal}" stroke-width="3.5"/>`;
  b += `<circle cx="410" cy="30" r="6" fill="${COL.red}"/><circle cx="410" cy="80" r="6" fill="${COL.teal}"/>`;
  b += text(560, 22, "放电：接 ORR 电极", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(500, 104, "充电：接 OER 电极", { size: 17, weight: "bold", fill: COL.teal });
  b += o2(715, 250);
  b += text(55, y0 + h + 30, "Li", { size: 18, anchor: "middle", weight: "bold" });
  b += text(165, y0 + h + 30, "anolyte", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(265, y0 + h + 56, "Li-SSE", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(380, y0 + h + 30, "catholyte", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(485, y0 + h + 30, "OER 金属网", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(485, y0 + h + 52, "Ni / 不锈钢 / Ti", { size: 16, anchor: "middle", fill: COL.text2 });
  b += text(715, y0 + h + 30, "ORR 电极", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(715, y0 + h + 52, "含碳、怕高压", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Porous separator vs SSE in Li–S ----------
figs.ls_separator = () => {
  const W = 780, H = 420;
  let b = "";
  const panel = (x, solid) => {
    let s = "";
    s += `<rect x="${x}" y="40" width="70" height="250" fill="${LI}"/>`;
    s += `<rect x="${x + 70}" y="40" width="200" height="250" fill="${ORG}"/>`;
    s += `<rect x="${x + 270}" y="40" width="80" height="250" fill="${COL.sulfurLight}"/>`;
    if (solid) {
      s += `<rect x="${x + 150}" y="40" width="28" height="250" fill="${SSE}"/>`;
    } else {
      s += `<rect x="${x + 150}" y="40" width="28" height="250" fill="#F4F1FA" stroke="${COL.purpleLight}" stroke-width="2"/>`;
      for (let y = 56; y < 290; y += 30) s += `<rect x="${x + 150}" y="${y}" width="28" height="12" fill="${ORG}"/>`;
    }
    // polysulfide moving left
    s += ps(x + 200, 110) + arrow(x + 196, 110, solid ? x + 184 : x + 95, 110, { color: COL.sulfur, width: 3, head: 12 });
    if (solid) s += cross(x + 164, 110, 12);
    // dendrite
    const reach = solid ? x + 146 : x + 196;
    s += `<path d="M ${x + 70} 220 L ${x + 100} 214 L ${x + 120} 226 L ${reach} 218" fill="none" stroke="${LI_D}" stroke-width="7" stroke-linecap="round"/>`;
    if (solid) s += cross(x + 164, 218, 12);
    else s += `<circle cx="${reach}" cy="218" r="13" fill="none" stroke="${COL.red}" stroke-width="3"/>`;
    s += text(x + 175, 330, solid ? "固态电解质隔膜" : "多孔隔膜 + 液体", { size: 20, anchor: "middle", weight: "bold", fill: solid ? COL.amber : COL.purple });
    s += text(x + 175, 358, solid ? "多硫化物和枝晶都过不去" : "多硫化物穿梭、枝晶刺穿", { size: 17, anchor: "middle", fill: solid ? COL.teal : COL.red, weight: "bold" });
    return s;
  };
  b += panel(20, false) + panel(410, true);
  b += text(55, 30, "Li", { size: 16, anchor: "middle", weight: "bold" });
  b += text(330, 30, "S 正极", { size: 16, anchor: "middle", weight: "bold", fill: COL.sulfur });
  b += text(445, 30, "Li", { size: 16, anchor: "middle", weight: "bold" });
  b += text(720, 30, "S 正极", { size: 16, anchor: "middle", weight: "bold", fill: COL.sulfur });
  b += ps(250, 400, 3, 7) + text(300, 405, "= 溶解的多硫化物 Li_{2}S_{x}", { size: 16, fill: COL.sei, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Two phases of solid-electrolyte Li–S (Fig. 5a, 5b) ----------
figs.ls_phases = () => {
  const W = 800, H = 450;
  let b = "";
  // Phase 1: all-solid
  const x0 = 20;
  b += `<rect x="${x0}" y="40" width="340" height="260" fill="#F2F4F6"/>`;
  const R = rng(7);
  for (let y = 52; y < 300; y += 22) {
    for (let x = x0 + 12; x < x0 + 335; x += 22) {
      const xx = x + (Math.floor((y - 52) / 22) % 2 ? 11 : 0);
      if (xx > x0 + 330) continue;
      let c, st;
      if (xx < x0 + 80) { c = COL.tealLight; st = COL.teal; }
      else if (xx < x0 + 190) { c = COL.purpleLight; st = COL.purple; }
      else { const r = R(); c = r < 0.45 ? COL.sulfurLight : r < 0.75 ? COL.purpleLight : "#4F5B66"; st = r < 0.45 ? COL.sulfur : r < 0.75 ? COL.purple : "#2B2F33"; }
      b += `<circle cx="${xx}" cy="${y}" r="10" fill="${c}" stroke="${st}" stroke-width="1.5"/>`;
    }
  }
  b += text(x0 + 170, 330, "阶段一：全固态 Li–S", { size: 20, anchor: "middle", weight: "bold", fill: COL.ink });
  b += text(x0 + 170, 356, "S 与多硫化物几乎不导离子和电子", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(x0 + 170, 380, "→ 动力学慢，S 利用率低", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  // Phase 2: hybrid
  const X = 420;
  b += `<rect x="${X}" y="40" width="60" height="260" fill="${LI}"/>`;
  b += `<rect x="${X + 60}" y="40" width="40" height="260" fill="${ORG}"/>`;
  b += `<rect x="${X + 100}" y="40" width="28" height="260" fill="${SSE}"/>`;
  b += `<rect x="${X + 128}" y="40" width="190" height="260" fill="${COL.sulfurLight}" opacity="0.6"/>`;
  b += `<rect x="${X + 318}" y="40" width="42" height="260" fill="${CAT}"/>`;
  // circulating polysulfides
  b += `<ellipse cx="${X + 225}" cy="110" rx="68" ry="40" fill="none" stroke="${COL.ink}" stroke-width="2.5" stroke-dasharray="6 5"/>` + head(X + 157, 112, Math.PI / 2, COL.ink, 12);
  b += `<ellipse cx="${X + 225}" cy="230" rx="68" ry="40" fill="none" stroke="${COL.ink}" stroke-width="2.5" stroke-dasharray="6 5"/>` + head(X + 293, 228, -Math.PI / 2, COL.ink, 12);
  b += ps(X + 200, 110, 4, 7) + ps(X + 200, 230, 4, 7);
  b += ion(X + 114, 170, { r: 11, fill: COL.teal });
  b += text(X + 180, 330, "阶段二：混合电解质 Li–S", { size: 20, anchor: "middle", weight: "bold", fill: COL.ink });
  b += text(X + 180, 356, "正极里保留液体，多硫化物只在", { size: 16, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(X + 180, 380, "正极一侧打转，过不了 SSE", { size: 16, anchor: "middle", fill: COL.teal, weight: "bold" });
  // legend
  const lg = [[COL.tealLight, COL.teal, "Li"], [COL.purpleLight, COL.purple, "Li-SSE"], [COL.sulfurLight, COL.sulfur, "S"], ["#4F5B66", "#2B2F33", "C"]];
  lg.forEach(([c, st, t], i) => {
    b += `<circle cx="${x0 + 30 + i * 110}" cy="425" r="9" fill="${c}" stroke="${st}" stroke-width="1.5"/>`;
    b += text(x0 + 46 + i * 110, 431, t, { size: 16 });
  });
  return svg(W, H, b);
};

// ---------- Interlayer (Fig. 5c) ----------
figs.interlayer = () => {
  const W = 760, H = 430;
  let b = "";
  // left: direct contact with gaps
  const wav = (x, amp, seed) => {
    const R = rng(seed);
    let d = `M ${x} 40`;
    for (let y = 40; y <= 300; y += 20) d += ` L ${(x + (R() - 0.5) * amp).toFixed(1)} ${y}`;
    return d;
  };
  b += `<path d="${wav(150, 26, 3)} L 20 300 L 20 40 Z" fill="${LI}"/>`;
  b += `<rect x="160" y="40" width="160" height="260" fill="${SSE_L}" stroke="${SSE}" stroke-width="2"/>`;
  [[150, 80], [150, 160], [150, 240]].forEach(([x, y]) => (b += `<circle cx="${x + 6}" cy="${y}" r="9" fill="#FFFFFF" stroke="${COL.red}" stroke-width="2.5"/>`));
  b += text(170, 330, "直接接触：硬碰硬", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(170, 356, "只有少数点贴住，空隙处不通", { size: 16, anchor: "middle", fill: COL.text2 });
  // right: interlayer
  const X = 400;
  b += `<path d="${wav(X + 130, 26, 3)} L ${X} 300 L ${X} 40 Z" fill="${LI}"/>`;
  b += `<path d="${wav(X + 130, 26, 3)} L ${X + 190} 300 L ${X + 190} 40 Z" fill="${COL.electrolyte}" stroke="#7FB8DA" stroke-width="2"/>`;
  const R = rng(5);
  for (let i = 0; i < 10; i++) b += bub(X + 150 + R() * 32, 55 + R() * 230, 5 + R() * 5, "#9CC9E0");
  b += `<rect x="${X + 190}" y="40" width="150" height="260" fill="${SSE_L}" stroke="${SSE}" stroke-width="2"/>`;
  b += text(X + 170, 330, "加含液软中间层", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X + 170, 356, "浸了电解液的聚合物把缝隙填满", { size: 16, anchor: "middle", fill: COL.text2 });
  // labels
  b += text(60, 30, "Li 负极", { size: 16, anchor: "middle", weight: "bold" });
  b += text(240, 30, "LISICON / LATP 膜", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(X + 60, 30, "Li 负极", { size: 16, anchor: "middle", weight: "bold" });
  b += text(X + 180, 30, "中间层", { size: 16, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(X + 265, 30, "SSE 膜", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(380, 410, "据原文 Fig. 5c 思路重绘", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- NASICON options for Li–S ----------
figs.nasicon_compare = () => {
  const W = 640, H = 330;
  let b = "";
  const rows = [
    ["LATP", "Li_{1+x}Al_{x}Ti_{2−x}(PO_{4})_{3}", "Ti⁴⁺ 约 2.4 V 被还原", false, COL.red],
    ["LAGP", "Li_{1+x}Al_{x}Ge_{2−x}(PO_{4})_{3}", "相容了，但 Ge 贵、循环一般", null, COL.amber],
    ["LYZP", "Li_{1+x}Y_{x}Zr_{2−x}(PO_{4})_{3}", "化学/电化学都相容", true, COL.teal],
  ];
  rows.forEach(([n, f, t, ok, c], i) => {
    const y = 20 + i * 102;
    b += `<rect x="10" y="${y}" width="620" height="88" rx="14" fill="#F5F7F9" stroke="${c}" stroke-width="2.5"/>`;
    b += text(30, y + 38, n, { size: 24, weight: "bold", fill: c });
    b += text(30, y + 72, f, { size: 19, fill: COL.text2 });
    b += text(330, y + 54, t, { size: 18, weight: "bold", fill: COL.ink });
    if (ok === true) b += check(600, y + 46, 13);
    else if (ok === false) b += cross(600, y + 46, 12);
    else b += text(600, y + 56, "△", { size: 26, anchor: "middle", weight: "bold", fill: COL.amber });
  });
  return svg(W, H, b);
};

// ---------- Li–Br cell (Fig. 6a) ----------
figs.libr_cell = () => {
  const W = 780, H = 450;
  let b = "";
  // outer can: positive current collector
  b += `<path d="M 30 80 V 440 H 400 V 80 H 360 V 400 H 70 V 80 Z" fill="${CAT}"/>`;
  b += `<rect x="70" y="80" width="290" height="320" fill="#C9CED4"/>`; // bromine solution
  const R = rng(4);
  for (let i = 0; i < 12; i++) b += bub(80 + R() * 270, 300 + R() * 90, 4 + R() * 6, "#E0E4E8");
  // SSE cup
  b += `<path d="M 120 60 V 330 H 310 V 60 H 290 V 310 H 140 V 60 Z" fill="${SSE}"/>`;
  b += `<rect x="140" y="60" width="150" height="250" fill="${ORG}"/>`;
  b += `<rect x="185" y="40" width="60" height="250" fill="${LI}"/>`;
  b += `<rect x="200" y="10" width="30" height="40" fill="${COL.ink}"/>`;
  b += text(215, 160, "Li", { size: 20, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(162 250) rotate(-90)">` + text(0, 6, "有机电解液", { size: 16, anchor: "middle", weight: "bold", fill: COL.purple }) + `</g>`;
  b += text(215, 326, "Li-SSE", { size: 16, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += text(215, 380, "溴 / 溴化锂水溶液", { size: 17, anchor: "middle", weight: "bold" });
  b += text(215, 428, "正极集流体（外壳）", { size: 17, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  // zoom box
  b += `<rect x="255" y="150" width="50" height="60" fill="none" stroke="${COL.ink}" stroke-width="2" stroke-dasharray="5 4"/>`;
  b += `<line x1="305" y1="150" x2="470" y2="70" stroke="${COL.ink}" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="305" y1="210" x2="470" y2="430" stroke="${COL.ink}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  const Z = 470;
  b += `<rect x="${Z}" y="70" width="80" height="360" fill="${LI}"/>`;
  b += `<rect x="${Z + 80}" y="70" width="50" height="360" fill="${ORG}"/>`;
  b += `<rect x="${Z + 130}" y="70" width="34" height="360" fill="${SSE}"/>`;
  b += `<rect x="${Z + 164}" y="70" width="126" height="360" fill="#C9CED4"/>`;
  [120, 190, 260, 330, 400].forEach((y) => (b += ion(Z + 147, y, { r: 13 })));
  b += `<g transform="translate(${Z + 40} 250) rotate(-90)">` + text(0, 7, "Li → Li⁺ + e⁻", { size: 19, anchor: "middle", weight: "bold", fill: COL.purple }) + `</g>`;
  b += `<g transform="translate(${Z + 230} 250) rotate(-90)">` + text(0, 7, "Br_{2} + 2e⁻ → 2Br⁻", { size: 19, anchor: "middle", weight: "bold", fill: COL.ink }) + `</g>`;
  b += text(Z + 145, 56, "总反应 2Li + Br_{2} ⇌ 2LiBr", { size: 18, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Static cell vs flow cell for bromine ----------
figs.br_flow = () => {
  const W = 780, H = 420;
  let b = "";
  // static closed cell
  b += `<rect x="30" y="60" width="300" height="230" rx="10" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3"/>`;
  b += `<rect x="40" y="70" width="80" height="210" fill="${LI}"/>`;
  b += `<rect x="120" y="70" width="24" height="210" fill="${SSE}"/>`;
  b += `<path d="M 132 120 L 140 150 L 128 175 L 138 205" fill="none" stroke="${COL.red}" stroke-width="4"/>`;
  b += `<rect x="144" y="150" width="176" height="130" fill="#C9CED4"/>`;
  b += `<rect x="144" y="70" width="176" height="80" fill="${COL.redLight}" opacity="0.6"/>`;
  [[190, 100], [240, 120], [290, 95], [215, 135]].forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="9" fill="${COL.sei}"/><circle cx="${x + 10}" cy="${y}" r="9" fill="${COL.sei}"/>`));
  [[200, 50], [260, 50]].forEach(([x, y]) => (b += arrow(x, y + 20, x, y - 6, { color: COL.red, width: 3, head: 11 })));
  b += text(232, 112, "Br_{2} 蒸气", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(180, 322, "密闭静态电池", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(180, 348, "蒸气压升高 → 陶瓷膜破裂", { size: 16, anchor: "middle", fill: COL.text2 });
  b += text(180, 372, "只能用稀溶液，能量低", { size: 16, anchor: "middle", fill: COL.text2 });
  // flow cell
  const X = 420;
  b += `<rect x="${X}" y="80" width="70" height="200" fill="${LI}"/>`;
  b += `<rect x="${X + 70}" y="80" width="24" height="200" fill="${SSE}"/>`;
  b += `<rect x="${X + 94}" y="80" width="80" height="200" fill="#C9CED4"/>`;
  b += `<rect x="${X + 230}" y="110" width="100" height="150" rx="16" fill="#C9CED4" stroke="${COL.ink}" stroke-width="3"/>`;
  b += text(X + 280, 190, "储液罐", { size: 17, anchor: "middle", weight: "bold" });
  b += `<path d="M ${X + 174} 110 H ${X + 230}" stroke="${COL.teal}" stroke-width="5" fill="none"/>` + head(X + 230, 110 + 0, 0, COL.teal, 12);
  b += `<path d="M ${X + 230} 250 H ${X + 174}" stroke="${COL.teal}" stroke-width="5" fill="none"/>` + head(X + 176, 250, Math.PI, COL.teal, 12);
  b += `<circle cx="${X + 202}" cy="250" r="14" fill="${COL.teal}"/>`;
  b += text(X + 202, 290, "泵", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X + 170, 322, "液流电池 flow cell", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X + 170, 348, "溶液在外部循环，压力可控", { size: 16, anchor: "middle", fill: COL.text2 });
  b += text(X + 170, 372, "可用高浓度溴 / 溴化物", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Platform spectrum: Li-ion → Li–Br → Li–air ----------
figs.platform = () => {
  const W = 1200, H = 430;
  let b = "";
  b += `<rect x="40" y="70" width="1120" height="24" rx="12" fill="#EEF2F5"/>`;
  b += arrow(60, 82, 1150, 82, { color: COL.amber, width: 6, head: 22 });
  b += text(40, 50, "正极的状态：固体 → 液体 → 气体　　能量更高，难题也更多 →", { size: 20, weight: "bold", fill: COL.amber });
  const cols = [
    { x: 40, t: "锂离子电池", sub: "固态正极", c: COL.siDark, rows: ["技术成熟", "能量受限于嵌入型正极", "隔膜：多孔聚合物"] },
    { x: 320, t: "Li–S（混合）", sub: "S + 溶解的多硫化物", c: COL.sulfur, rows: ["~1,500 Wh kg^{−1}，~2.3 V", "~300 圈", "SSE：LATP / LAGP / LYZP"] },
    { x: 600, t: "Li–Br_{2}", sub: "液态溴正极", c: COL.purple, rows: ["~1,200 Wh kg^{−1}，~4.2 V", "~30 mW cm^{−2}，~100 圈", "SSE：LATP"] },
    { x: 880, t: "Li–空气（混合）", sub: "气态 O_{2} 正极", c: COL.red, rows: ["~10,000 Wh kg^{−1}，2.8–3.7 V", "~15 mW cm^{−2}，~100 圈", "SSE：LATP"] },
  ];
  cols.forEach((k) => {
    b += `<rect x="${k.x}" y="120" width="270" height="290" rx="16" fill="#F5F7F9" stroke="${k.c}" stroke-width="3"/>`;
    b += `<rect x="${k.x}" y="120" width="270" height="74" rx="16" fill="${k.c}"/>`;
    b += `<rect x="${k.x}" y="170" width="270" height="24" fill="${k.c}"/>`;
    b += text(k.x + 135, 152, k.t, { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += text(k.x + 135, 182, k.sub, { size: 17, anchor: "middle", fill: "#FFFFFF" });
    k.rows.forEach((r, i) => (b += text(k.x + 18, 236 + i * 56, r, { size: 18, fill: COL.ink })));
  });
  return svg(W, H, b);
};

module.exports = figs;
