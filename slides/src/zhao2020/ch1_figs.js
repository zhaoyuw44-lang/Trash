// Figures for Zhao et al. 2020, Chapter 1 (引言与固态电解质发展史)
// Canvas widths are chosen as ≈ 96 px per inch of the box the figure is placed in,
// so 15 px text ends up ≥ 11 pt on the slide.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- local helpers ----------
const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 0}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
// Octahedron seen along an axis = diamond; tetrahedron = triangle.
const diamond = (x, y, r, fill, stroke) =>
  `<polygon points="${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
const tri = (x, y, r, fill, stroke, up = true) => {
  const s = up ? 1 : -1;
  return `<polygon points="${x},${y - s * r} ${x + r * 0.9},${y + s * r * 0.6} ${x - r * 0.9},${y + s * r * 0.6}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
};
const anionX = (x, y, r = 11) => circ(x, y, r, COL.teal) + text(x, y + r * 0.45, "−", { size: Math.round(r * 1.5), fill: "#FFFFFF", anchor: "middle", weight: "bold" });
const flame = (x, y, s = 1) =>
  `<path d="M${x},${y} C${x - 26 * s},${y - 10 * s} ${x - 30 * s},${y - 40 * s} ${x - 8 * s},${y - 70 * s} C${x - 6 * s},${y - 50 * s} ${x + 6 * s},${y - 48 * s} ${x + 4 * s},${y - 64 * s} C${x + 26 * s},${y - 44 * s} ${x + 30 * s},${y - 12 * s} ${x},${y} Z" fill="${COL.red}"/>` +
  `<path d="M${x},${y - 4 * s} C${x - 12 * s},${y - 10 * s} ${x - 12 * s},${y - 28 * s} ${x - 2 * s},${y - 40 * s} C${x + 2 * s},${y - 30 * s} ${x + 14 * s},${y - 22 * s} ${x},${y - 4 * s} Z" fill="${COL.amberLight}"/>`;
const wavy = (x1, x2, y, amp, per, c, w = 4) => {
  let d = `M${x1},${y}`;
  for (let x = x1; x < x2; x += per) d += ` q ${per / 4} ${-amp} ${per / 2} 0 q ${per / 4} ${amp} ${per / 2} 0`;
  return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
};

// ---------- Title motif: anion lattice with a hopping cation ----------
figs.title_motif = () => {
  const W = 420, H = 520;
  let b = "";
  b += `<rect x="40" y="60" width="340" height="420" rx="40" fill="none" stroke="#FFFFFF" stroke-width="9" opacity="0.9"/>`;
  b += `<rect x="160" y="28" width="100" height="36" rx="10" fill="#FFFFFF" opacity="0.9"/>`;
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 5; c++) {
      const x = 90 + c * 60, y = 110 + r * 66;
      b += circ(x, y, 22, "#2E4054", { stroke: "#5B7083", sw: 3 });
    }
  // interstitial sites
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) b += circ(120 + c * 60, 143 + r * 66, 6, "none", { stroke: "#5B7083", sw: 2 });
  // hopping path
  const path = [[120, 407], [180, 341], [180, 275], [240, 209], [300, 143]];
  for (let i = 0; i < path.length - 1; i++) {
    const [x1, y1] = path[i], [x2, y2] = path[i + 1];
    const mx = (x1 + x2) / 2 + 18, my = (y1 + y2) / 2;
    b += `<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" fill="none" stroke="${COL.amber}" stroke-width="4" stroke-dasharray="8 6"/>`;
  }
  b += head(300, 143, -Math.PI / 4, COL.amber, 16);
  path.slice(0, 4).forEach(([x, y], i) => (b += circ(x, y, 12, i === 0 ? COL.amber : COL.amberLight)));
  return svg(W, H, b);
};

// ---------- Liquid vs solid electrolyte ----------
figs.liquid_vs_solid = () => {
  const W = 670, H = 420;
  let b = "";
  const panel = (x0, solid) => {
    let s = "";
    const top = 70, bot = 320;
    s += text(x0 + 155, 36, solid ? "固态电解质 SSE" : "液态电解液", { size: 21, anchor: "middle", weight: "bold", fill: solid ? COL.teal : COL.red });
    s += rect(x0, top, 46, bot - top, "#B9C3CC");
    s += text(x0 + 23, bot + 26, "Li 金属", { size: 15, anchor: "middle", weight: "bold" });
    s += rect(x0 + 264, top, 46, bot - top, COL.amberLight, { stroke: COL.amber });
    s += text(x0 + 287, bot + 26, "正极", { size: 15, anchor: "middle", weight: "bold" });
    if (!solid) {
      s += rect(x0 + 46, top, 218, bot - top, COL.electrolyte);
      const R = rng(4);
      for (let i = 0; i < 16; i++) s += `<ellipse cx="${(x0 + 70 + R() * 175).toFixed(1)}" cy="${(top + 20 + R() * 210).toFixed(1)}" rx="11" ry="6" fill="#9CC9E0"/>`;
      s += line(x0 + 160, top, x0 + 160, bot, COL.purple, 3, { dash: "10 7" });
      // dendrite
      s += `<path d="M${x0 + 46},230 L${x0 + 80},222 L${x0 + 104},236 L${x0 + 136},226 L${x0 + 168},232" fill="none" stroke="#8F9BA6" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += line(x0 + 104, 236, x0 + 116, 258, "#8F9BA6", 6) + line(x0 + 80, 222, x0 + 88, 202, "#8F9BA6", 6);
      s += cross(x0 + 168, 196, 11);
      s += flame(x0 + 214, 160, 0.9);
      s += text(x0 + 155, 372, "易燃 · 会漏 · 枝晶穿透隔膜", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
    } else {
      s += rect(x0 + 46, top, 218, bot - top, "#F3F0F9");
      for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) s += circ(x0 + 66 + c * 36, top + 22 + r * 42, 14, "#D7DEE5", { stroke: "#B5C0CA", sw: 1.5 });
      const hop = [[x0 + 84, top + 64], [x0 + 120, top + 106], [x0 + 156, top + 64], [x0 + 192, top + 106], [x0 + 228, top + 64]];
      for (let i = 0; i < hop.length - 1; i++) {
        const [a1, b1] = hop[i], [a2, b2] = hop[i + 1];
        s += `<path d="M${a1},${b1} Q${(a1 + a2) / 2},${Math.min(b1, b2) - 18} ${a2},${b2}" fill="none" stroke="${COL.purple}" stroke-width="3" stroke-dasharray="6 5"/>`;
      }
      s += head(x0 + 228, top + 64, -0.7, COL.purple, 13);
      s += ion(x0 + 84, top + 64, { r: 11 });
      s += check(x0 + 155, top + 190, 14);
      s += text(x0 + 155, 372, "不燃 · 不漏 · 模量高", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
    }
    return s;
  };
  b += panel(10, false);
  b += panel(350, true);
  b += line(335, 60, 335, 380, COL.line, 2);
  b += text(335, 408, "Li⁺ 在晶格位点之间“跳跃” vs 在液体中“游泳”", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Conventional vs bipolar stacking ----------
figs.bipolar = () => {
  const W = 630, H = 380;
  let b = "";
  const unit = (x, y, w, withBottomCC = true) => {
    let s = "";
    s += rect(x, y, w, 14, "#8F9BA6");
    s += rect(x, y + 14, w, 16, COL.tealLight);
    s += rect(x, y + 30, w, 16, COL.amberLight);
    if (withBottomCC) s += rect(x, y + 46, w, 6, COL.alu);
    return s;
  };
  // left: three separate cells
  b += text(130, 34, "传统：3 个电池 + 外部导线", { size: 18, anchor: "middle", weight: "bold" });
  [60, 150, 240].forEach((y, i) => {
    b += rect(30, y, 200, 76, "none", { stroke: COL.siDark, sw: 3, rx: 10 });
    b += rect(40, y + 9, 180, 6, COL.copper);
    b += unit(40, y + 15, 180);
    if (i < 2) b += `<path d="M230,${y + 64} H252 V${y + 102} H230" fill="none" stroke="${COL.ink}" stroke-width="3"/>`;
  });
  b += text(130, 350, "外壳与导线占去不少体积", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  // right: bipolar stack
  const X = 330, w = 160;
  b += text(450, 34, "双极：3 个单元共用 1 个外壳", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += rect(X - 10, 86, w + 20, 192, "none", { stroke: COL.teal, sw: 3, rx: 10 });
  b += rect(X, 96, w, 6, COL.copper);
  [102, 154, 206].forEach((y) => (b += unit(X, y, w)));
  b += rect(X, 154 - 6 + 0, w, 6, "#6C7A88") + rect(X, 206 - 6, w, 6, "#6C7A88");
  // labels
  const lab = (y, ty, t, c) => `<polyline points="${X + w + 2},${y} ${X + w + 14},${y} ${X + w + 26},${ty}" fill="none" stroke="${c}" stroke-width="2"/>` + text(X + w + 30, ty + 5, t, { size: 15, weight: "bold", fill: c });
  b += lab(161, 100, "负极", COL.siDark);
  b += lab(176, 135, "固态电解质", COL.teal);
  b += lab(192, 170, "正极", COL.amber);
  b += lab(203, 205, "双极集流体", COL.ink);
  b += text(450, 350, "体积更小 → 能量密度更高", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- Transference number: liquid vs SIE ----------
figs.transference = () => {
  const W = 660, H = 410;
  let b = "";
  // left: liquid
  b += text(160, 34, "液态电解液", { size: 20, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += rect(20, 56, 280, 230, COL.electrolyte, { rx: 16 });
  const solv = (x, y) => {
    let s = "";
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      s += `<ellipse cx="${(x + 26 * Math.cos(a)).toFixed(1)}" cy="${(y + 26 * Math.sin(a)).toFixed(1)}" rx="8" ry="5" fill="#7FB8DA" transform="rotate(${((a * 180) / Math.PI).toFixed(0)} ${(x + 26 * Math.cos(a)).toFixed(1)} ${(y + 26 * Math.sin(a)).toFixed(1)})"/>`;
    }
    return s + ion(x, y, { r: 12 });
  };
  b += solv(90, 120) + solv(110, 220);
  b += arrow(124, 120, 190, 120, { color: COL.purple, width: 3.5, head: 13 });
  b += arrow(144, 220, 200, 220, { color: COL.purple, width: 3.5, head: 13 });
  b += anionX(250, 160, 13) + anionX(232, 250, 13);
  b += arrow(234, 160, 180, 170, { color: COL.teal, width: 3.5, head: 13 });
  b += arrow(216, 250, 170, 262, { color: COL.teal, width: 3.5, head: 13 });
  b += text(160, 318, "阳离子、阴离子都在跑", { size: 17, anchor: "middle", weight: "bold" });
  b += text(160, 346, "t_{+} 通常小于 0.5", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(160, 376, "阴离子分走一半以上电流", { size: 15, anchor: "middle", fill: COL.text2 });
  // right: SIE
  b += text(500, 34, "无机固态电解质 SIE", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  b += rect(360, 56, 280, 230, "#F3F0F9", { rx: 16 });
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) b += circ(386 + c * 46, 80 + r * 46, 15, "#C9D2DA", { stroke: "#9AA6B2", sw: 1.5 });
  const hop = [[409, 103], [455, 149], [501, 103], [547, 149], [593, 103]];
  for (let i = 0; i < hop.length - 1; i++) {
    const [a1, b1] = hop[i], [a2, b2] = hop[i + 1];
    b += `<path d="M${a1},${b1} Q${(a1 + a2) / 2},${Math.min(b1, b2) - 16} ${a2},${b2}" fill="none" stroke="${COL.purple}" stroke-width="3" stroke-dasharray="6 5"/>`;
  }
  b += head(593, 103, -0.75, COL.purple, 13);
  b += ion(409, 103, { r: 11 }) + ion(501, 195, { r: 11 });
  b += `<rect x="372" y="236" width="256" height="34" rx="8" fill="#FFFFFF" opacity="0.9"/>`;
  b += text(500, 259, "灰色阴离子骨架：固定不动", { size: 15, anchor: "middle", fill: COL.siDark, weight: "bold" });
  b += text(500, 318, "只有阳离子在跑", { size: 17, anchor: "middle", weight: "bold" });
  b += text(500, 346, "t_{+} ≈ 1（单离子导体）", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(500, 376, "电流全部用在电极反应上", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Timelines ----------
const TL = { axisY: 200, left: 90, right: 1060, whoSize: 19, whatSize: 17, yearSize: 28 };
figs.tl_early = () => {
  const W = 1180, H = 400;
  const ev = [
    { year: "1830s", who: ["Faraday"], what: ["加热的 Ag_{2}S、PbF_{2}", "能导电"], color: COL.text2 },
    { year: "1880s", who: ["Warburg"], what: ["Na⁺ 能穿过", "固体玻璃"], color: COL.text2 },
    { year: "≈1900", who: ["Nernst"], what: ["掺 Y_{2}O_{3} 的 ZrO_{2}", "做成 Nernst 灯"], color: COL.text2 },
    { year: "1914", who: ["Tubandt & Lorenz"], what: ["α-AgI：固体", "导电堪比液体"], color: COL.purple },
    { year: "1926–30", who: ["Frenkel; Schottky", "& Wagner"], what: ["点缺陷理论"], color: COL.purple },
    { year: "1967", who: ["Yao & Kummer", "（Ford）"], what: ["β-Al_{2}O_{3} 快 Na⁺", "→ Na–S 电池"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, TL));
};
figs.tl_inorg = () => {
  const W = 1180, H = 400;
  const ev = [
    { year: "1976", who: ["Goodenough,", "Hong, Kafalas"], what: ["NASICON"], color: COL.purple },
    { year: "1978", who: ["Hong"], what: ["LISICON"], color: COL.purple },
    { year: "1992", who: ["Bates 等", "（ORNL）"], what: ["LiPON 薄膜"], color: COL.teal },
    { year: "1993", who: ["Inaguma 等"], what: ["钙钛矿 LLTO"], color: COL.purple },
    { year: "2001", who: ["Kanno &", "Murayama"], what: ["硫化物", "thio-LISICON"], color: COL.sulfur },
    { year: "2007", who: ["Murugan,", "Thangadurai,", "Weppner"], what: ["石榴石 LLZO"], color: COL.purple },
    { year: "2011", who: ["Kamaya, Kanno 等"], what: ["LGPS", "12 mS cm^{−1}"], color: COL.sulfur },
    { year: "2016", who: ["Kato 等"], what: ["Li_{9.54}Si_{1.74}P_{1.44}…", "25 mS cm^{−1}"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { ...TL, left: 100, right: 1050 }));
};
figs.tl_poly = () => {
  const W = 1180, H = 400;
  const ev = [
    { year: "1973", who: ["Fenton, Parker", "& Wright"], what: ["PEO 能络合", "碱金属盐"], color: COL.teal },
    { year: "1978", who: ["Armand 等"], what: ["提出用作", "电池电解质"], color: COL.teal },
    { year: "1981", who: ["Watanabe 等"], what: ["PAN + EC/PC", "增塑"], color: COL.text2 },
    { year: "1982", who: ["Weston & Steele"], what: ["加 Al_{2}O_{3} 填料", "复合电解质"], color: COL.text2 },
    { year: "1983", who: ["Hooper & North"], what: ["PEO 锂金属", "全固态电池"], color: COL.teal },
    { year: "1998", who: ["Croce, Scrosati 等"], what: ["纳米陶瓷填料"], color: COL.text2 },
    { year: "2011", who: ["Bolloré", "Bluecar"], what: ["Li 金属聚合物", "电池上路"], color: COL.amber },
    { year: "2013", who: ["Bouchet 等"], what: ["BAB 单离子", "三嵌段共聚物"], color: COL.teal },
  ];
  return svg(W, H, timeline(W, H, ev, { ...TL, left: 100, right: 1050 }));
};

// ---------- AgI superionic transition ----------
figs.agi = () => {
  const W = 630, H = 440;
  let b = "";
  const X0 = 70, X1 = 320, Y0 = 340, Y1 = 60;
  b += line(X0, Y0, X1 + 10, Y0, COL.ink, 3) + head(X1 + 22, Y0, 0, COL.ink, 14);
  b += line(X0, Y0, X0, Y1 - 10, COL.ink, 3) + head(X0, Y1 - 22, -Math.PI / 2, COL.ink, 14);
  b += text(X1 - 20, Y0 + 32, "温度 →", { size: 16, anchor: "middle", fill: COL.text2, weight: "bold" });
  b += `<g transform="translate(${X0 - 22} ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "电导率 log σ →", { size: 16, anchor: "middle", fill: COL.text2, weight: "bold" }) + `</g>`;
  const xt = 205;
  b += `<polyline points="${X0 + 10},${Y0 - 30} ${xt},${Y0 - 92} ${xt},${Y1 + 40} ${X1},${Y1 + 26}" fill="none" stroke="${COL.purple}" stroke-width="5" stroke-linejoin="round"/>`;
  b += line(xt, Y0, xt, Y1 + 40, COL.muted, 1.5, { dash: "5 5" });
  b += text(xt, Y0 + 32, "147 °C", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(xt - 70, Y0 - 104, "β-AgI", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += text(xt + 64, Y1 + 18, "α-AgI", { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
  b += lines(xt + 12, 200, ["突增", "上千倍"], { size: 16, weight: "bold", fill: COL.red, lh: 22 });
  b += text(195, 412, "AgI 的电导率随温度（示意）", { size: 15, anchor: "middle", fill: COL.muted });
  // right: alpha-AgI bcc
  const cx = 480, cy = 200, a = 110;
  b += rect(cx - a, cy - a, 2 * a, 2 * a, "none", { stroke: COL.line, sw: 2 });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => (b += circ(cx + i * a, cy + j * a, 30, "#9AA6B2", { stroke: COL.siDark, sw: 2 })));
  b += circ(cx, cy, 30, "#9AA6B2", { stroke: COL.siDark, sw: 2 });
  // many available Ag sites
  const sites = [[0, -1], [-1, 0], [1, 0], [0, 1], [-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [-0.5, -1], [0.5, 1], [-1, 0.5], [1, -0.5]];
  sites.forEach(([i, j], k) => {
    const x = cx + i * a * 0.95, y = cy + j * a * 0.95;
    b += k % 4 === 0 ? circ(x, y, 9, COL.purple) : circ(x, y, 7, "none", { stroke: COL.purple, sw: 2 });
  });
  b += text(cx, 352, "α-AgI：I^{−} 体心立方骨架", { size: 16, anchor: "middle", weight: "bold" });
  b += text(cx, 378, "Ag^{+} 可占的空位远多于 Ag^{+}", { size: 15, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(cx, 404, "→ “熔化”的亚晶格", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- β-alumina + Na–S cell ----------
figs.beta_nas = () => {
  const W = 690, H = 430;
  let b = "";
  // left: layered beta-alumina
  const x0 = 20, w = 330;
  const block = (y) => {
    let s = rect(x0, y, w, 92, "#DCE3E9", { stroke: "#9AA6B2", sw: 2, rx: 6 });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 7 - r; c++) s += diamond(x0 + 24 + c * 47 + (r % 2) * 23, y + 26 + r * 40, 17, COL.tealLight, COL.teal);
    return s;
  };
  b += block(40);
  b += block(196);
  // conduction plane
  b += rect(x0, 132, w, 64, "#F3F0F9");
  [60, 170, 280].forEach((x) => (b += line(x0 + x, 132, x0 + x, 196, COL.red, 3) + circ(x0 + x, 164, 7, COL.red)));
  [[x0 + 30, 164], [x0 + 115, 152], [x0 + 225, 176], [x0 + 310, 160]].forEach(([x, y]) => (b += ion(x, y, { r: 11 })));
  b += arrow(x0 + 120, 186, x0 + 205, 186, { color: COL.purple, width: 3, head: 12 });
  b += text(x0 + w / 2, 30, "尖晶石块 Al–O：致密，不让离子过", { size: 15, anchor: "middle", fill: COL.siDark, weight: "bold" });
  b += text(x0 + w / 2, 312, "传导面 Na–O：疏松，Na⁺ 在面内跑", { size: 15, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += pill(x0 + 10, 330, 22, 16, COL.red, "");
  b += text(x0 + 42, 344, "= O 桥（支撑两层）", { size: 15, fill: COL.red });
  b += text(x0 + w / 2, 400, "β-Al_{2}O_{3}（Na_{2}O·11Al_{2}O_{3}）层状结构示意", { size: 15, anchor: "middle", fill: COL.muted });
  // right: Na–S tube cell
  const X = 395;
  b += rect(X, 40, 170, 300, "#E3E7EB", { stroke: COL.siDark, sw: 4, rx: 18 });
  b += rect(X + 12, 52, 146, 276, COL.sulfurLight, { rx: 12 });
  b += `<path d="M${X + 50},60 V280 Q${X + 85},318 ${X + 120},280 V60" fill="#F3F0F9" stroke="${COL.purple}" stroke-width="6"/>`;
  b += `<path d="M${X + 56},100 V278 Q${X + 85},310 ${X + 114},278 V100 Z" fill="#B9C3CC"/>`;
  b += lines(X + 85, 210, ["熔融", "Na"], { size: 16, anchor: "middle", weight: "bold", lh: 21 });
  b += line(X + 150, 230, X + 186, 230, COL.sulfur, 2);
  b += lines(X + 192, 226, ["熔融 S /", "Na_{2}S_{x}"], { size: 15, weight: "bold", fill: "#8A6A00", lh: 20 });
  b += line(X + 120, 120, X + 186, 120, COL.purple, 2);
  b += lines(X + 192, 116, ["β-Al_{2}O_{3}", "陶瓷管"], { size: 15, weight: "bold", fill: COL.purple, lh: 20 });
  b += line(X + 100, 180, X + 186, 180, COL.siDark, 2);
  b += text(X + 192, 185, "负极", { size: 15, weight: "bold", fill: COL.siDark });
  b += text(X + 85, 372, "Na–S 电池", { size: 18, anchor: "middle", weight: "bold" });
  b += text(X + 85, 398, "约 300–350 °C 工作", { size: 15, anchor: "middle", fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- SIE vs SPE property comparison ----------
figs.sie_vs_spe = () => {
  const W = 670, H = 500;
  let b = "";
  const c0 = 10, c1 = 170, c2 = 420, cw = 240;
  b += rect(c1, 10, cw, 46, COL.purple, { rx: 23 }) + text(c1 + cw / 2, 40, "无机 SIE", { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += rect(c2, 10, cw, 46, COL.teal, { rx: 23 }) + text(c2 + cw / 2, 40, "聚合物 SPE", { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  const rows = [
    ["室温离子电导", [1, "> 0.1 mS cm^{−1}"], [0, "常偏低，需加热"]],
    ["模量", [1, "> 1 GPa（氧化物）"], [0, "软，但韧"]],
    ["电化学窗口", [1, "> 4.0 V"], [0, "氧化稳定性差"]],
    ["阳离子迁移数", [1, "≈ 1（单离子）"], [0, "低"]],
    ["与电极接触", [0, "刚性接触差"], [1, "柔软，贴合好"]],
    ["加工与成本", [0, "脆、难做大面积、贵"], [1, "易合成、轻、便宜"]],
  ];
  rows.forEach(([name, a, p], i) => {
    const y = 70 + i * 66;
    b += rect(c0, y, W - 20, 58, i % 2 ? "#FFFFFF" : "#F5F7F9", { rx: 10 });
    b += text(c0 + 14, y + 36, name, { size: 17, weight: "bold" });
    [[c1, a], [c2, p]].forEach(([x, [ok, t]]) => {
      b += ok ? check(x + 22, y + 29, 10) : cross(x + 22, y + 29, 8);
      b += text(x + 44, y + 36, t, { size: 16, fill: ok ? COL.ink : COL.red, weight: ok ? "normal" : "bold" });
    });
  });
  b += text(W / 2, H - 10, "数值据原文 “Properties of SIEs and SPEs” 一节", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Anion framework: Coulomb attraction ----------
figs.anion_so = () => {
  const W = 630, H = 420;
  let b = "";
  const pairs = [
    { x: 105, an: "O^{2−}", ar: 38, cat: "Li^{+}", cr: 14, cc: COL.purple, f: 0.55, t1: "Li–O", t2: "离得近、抓得牢" },
    { x: 315, an: "S^{2−}", ar: 56, cat: "Li^{+}", cr: 14, cc: COL.purple, f: 0.3, t1: "Li–S", t2: "离得远、好挣脱", good: true },
    { x: 525, an: "O^{2−}", ar: 38, cat: "Mg^{2+}", cr: 14, cc: COL.red, f: 1.0, t1: "Mg–O", t2: "电荷翻倍、更难跳" },
  ];
  pairs.forEach((p) => {
    const ax = p.x - 20, ay = 140;
    const cx = ax + p.ar + p.cr + 6;
    b += circ(ax, ay, p.ar, p.an.startsWith("S") ? COL.sulfurLight : COL.redLight, { stroke: p.an.startsWith("S") ? COL.sulfur : COL.red, sw: 2.5 });
    b += text(ax, ay + 7, p.an, { size: 20, anchor: "middle", weight: "bold" });
    b += circ(cx, ay, p.cr + 4, p.cc);
    b += text(cx, ay + 6, p.cat.replace(/\^\{.*\}/, ""), { size: 15, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += text(p.x, 40, p.t1, { size: 20, anchor: "middle", weight: "bold", fill: p.good ? COL.teal : COL.ink });
    // distance bracket
    b += line(ax, ay + p.ar + 18, cx, ay + p.ar + 18, COL.muted, 2);
    b += line(ax, ay + p.ar + 12, ax, ay + p.ar + 24, COL.muted, 2) + line(cx, ay + p.ar + 12, cx, ay + p.ar + 24, COL.muted, 2);
    b += text((ax + cx) / 2, ay + p.ar + 42, "r", { size: 17, anchor: "middle", fill: COL.muted, italic: true });
    // attraction bar
    const by = 290;
    b += rect(p.x - 80, by, 160, 22, COL.light, { rx: 11 });
    b += rect(p.x - 80, by, 160 * p.f, 22, p.good ? COL.teal : p.cc === COL.red ? COL.red : COL.purple, { rx: 11 });
    b += text(p.x, by + 50, p.t2, { size: 16, anchor: "middle", weight: "bold", fill: p.good ? COL.teal : COL.ink });
  });
  b += text(20, 280, "吸引力", { size: 15, fill: COL.muted });
  b += text(W / 2, 400, "条形长度为相对示意：F ∝ q_{1}q_{2} / r^{2}", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Ion-pair dissociation: PE vs PEO ----------
figs.dissociation = () => {
  const W = 670, H = 385;
  let b = "";
  // left PE
  b += text(160, 36, "聚乙烯 PE（ε < 5）", { size: 19, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += rect(10, 56, 300, 250, "#F5F7F9", { rx: 16 });
  let d = "M30,120";
  for (let i = 1; i <= 10; i++) d += ` L${30 + i * 26},${i % 2 ? 100 : 120}`;
  b += `<path d="${d}" fill="none" stroke="${COL.siDark}" stroke-width="5" stroke-linejoin="round"/>`;
  let d2 = "M40,260";
  for (let i = 1; i <= 10; i++) d2 += ` L${40 + i * 26},${i % 2 ? 240 : 260}`;
  b += `<path d="${d2}" fill="none" stroke="${COL.siDark}" stroke-width="5" stroke-linejoin="round"/>`;
  b += ion(145, 182, { r: 15 }) + anionX(176, 182, 15);
  b += ion(240, 190, { r: 15 }) + anionX(271, 190, 15);
  b += text(160, 340, "Li⁺ 与 X⁻ 粘成离子对", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(160, 368, "没有“自由”离子 → 几乎不导电", { size: 15, anchor: "middle", fill: COL.text2 });
  // right PEO
  const X = 360;
  b += text(X + 150, 36, "聚环氧乙烷 PEO", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  b += rect(X, 56, 300, 250, "#E8F4F3", { rx: 16 });
  const cx = X + 120, cy = 180;
  // helical chain around Li+
  const pts = [];
  for (let k = 0; k <= 12; k++) {
    const a = (150 + (k / 12) * 240) * Math.PI / 180;
    const rr = 62 + (k % 2 ? 8 : -2);
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  let pd = `M${X + 16},${cy + 62} L${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  pts.forEach(([x, y]) => (pd += ` L${x.toFixed(1)},${y.toFixed(1)}`));
  pd += ` L${X + 230},${cy + 64}`;
  b += `<path d="${pd}" fill="none" stroke="${COL.teal}" stroke-width="5" stroke-linejoin="round"/>`;
  pts.forEach(([x, y], k) => {
    if (k % 3 === 0) {
      b += line(x, y, cx + (x - cx) * 0.3, cy + (y - cy) * 0.3, COL.red, 2, { dash: "4 4" });
      b += circ(x, y, 11, COL.red) + text(x, y + 5, "O", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    }
  });
  b += ion(cx, cy, { r: 16 });
  b += anionX(X + 255, 110, 15);
  b += arrow(X + 240, 122, X + 268, 160, { color: COL.teal, width: 3, head: 11 });
  b += text(X + 255, 86, "X⁻ 自由", { size: 15, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X + 150, 340, "醚氧 O 像“钳子”夹住 Li⁺", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(X + 150, 368, "离子对被拆开 → 有了载流子", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- SPE architectures (Fig. 2a redrawn as cartoons) ----------
figs.spe_arch = () => {
  const W = 1180, H = 360;
  let b = "";
  const tw = 226, gap = 12;
  const tiles = [
    { t: "均聚物", e: "Homopolymer", s: ["PEO、PVDF-HFP", "结构最简单"] },
    { t: "梳状共聚物", e: "Comb", s: ["短 EO 侧链", "更难结晶"] },
    { t: "ABA 嵌段", e: "Block copolymer", s: ["硬段给强度", "软段导离子"] },
    { t: "交联网络", e: "Crosslinked", s: ["网络抑制结晶", "可压枝晶"] },
    { t: "单离子聚合物", e: "Single-ion", s: ["阴离子挂在链上", "t_{+} ≈ 1"] },
  ];
  tiles.forEach((tl, i) => {
    const x = 6 + i * (tw + gap), y = 10;
    b += rect(x, y, tw, 336, "#F5F7F9", { rx: 14 });
    b += text(x + tw / 2, y + 34, tl.t, { size: 20, anchor: "middle", weight: "bold" });
    b += text(x + tw / 2, y + 58, tl.e, { size: 15, anchor: "middle", fill: COL.muted });
    const gx = x + 20, gy = y + 80, gw = tw - 40;
    if (i === 0) {
      [0, 1, 2, 3].forEach((k) => (b += wavy(gx, gx + gw - 10, gy + 22 + k * 32, 12, 30, COL.teal, 4)));
    } else if (i === 1) {
      [0, 1].forEach((k) => {
        const yy = gy + 24 + k * 64;
        b += line(gx, yy, gx + gw, yy, COL.siDark, 5);
        for (let j = 0; j < 6; j++) b += wavy(gx + 10 + j * 32, gx + 10 + j * 32 + 1, yy, 0, 1, COL.teal) + `<path d="M${gx + 12 + j * 32},${yy} q 8 14 0 24 q -8 10 0 22" fill="none" stroke="${COL.teal}" stroke-width="4" stroke-linecap="round"/>`;
      });
    } else if (i === 2) {
      [0, 1, 2, 3].forEach((k) => {
        const yy = gy + 18 + k * 32;
        b += line(gx, yy, gx + 50, yy, COL.siDark, 7) + wavy(gx + 50, gx + gw - 50, yy, 9, 26, COL.teal, 4) + line(gx + gw - 50, yy, gx + gw, yy, COL.siDark, 7);
      });
    } else if (i === 3) {
      const R = rng(17);
      const nodes = [];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) nodes.push([gx + 18 + c * 52 + (R() - 0.5) * 14, gy + 16 + r * 48 + (R() - 0.5) * 12]);
      nodes.forEach((p, k) => {
        if (k % 4 < 3) b += line(p[0], p[1], nodes[k + 1][0], nodes[k + 1][1], COL.teal, 4);
        if (k < 8) b += line(p[0], p[1], nodes[k + 4][0], nodes[k + 4][1], COL.teal, 4);
      });
      nodes.forEach(([x2, y2]) => (b += circ(x2, y2, 7, COL.siDark)));
    } else {
      [0, 1].forEach((k) => {
        const yy = gy + 22 + k * 76;
        b += line(gx, yy, gx + gw, yy, COL.siDark, 5);
        for (let j = 0; j < 4; j++) {
          const xx = gx + 22 + j * 50;
          b += line(xx, yy, xx, yy + 20, COL.siDark, 3) + anionX(xx, yy + 30, 11);
        }
      });
      b += ion(gx + 44, gy + 82, { r: 11 }) + ion(gx + 140, gy + 150, { r: 11 });
    }
    b += lines(x + tw / 2, y + 268, tl.s, { size: 16, anchor: "middle", fill: COL.text2, lh: 26 });
  });
  return svg(W, H, b);
};

// ---------- SIE crystal structures (Fig. 2b redrawn as cartoons) ----------
const structTile = (x, y, tw, title, formula, feat, draw) => {
  let b = rect(x, y, tw, 366, "#F5F7F9", { rx: 14 });
  b += draw(x + tw / 2, y + 120);
  b += text(x + tw / 2, y + 268, title, { size: 20, anchor: "middle", weight: "bold" });
  b += text(x + tw / 2, y + 296, formula, { size: 16, anchor: "middle", fill: COL.text2 });
  b += lines(x + tw / 2, y + 326, feat, { size: 15, anchor: "middle", fill: COL.purple, weight: "bold", lh: 21 });
  return b;
};
figs.sie_struct_a = () => {
  const W = 1180, H = 380;
  let b = "";
  const tw = 284, gap = 12;
  const draws = [
    // beta-alumina
    (cx, cy) => {
      let s = "";
      [cy - 70, cy + 34].forEach((yy) => {
        s += rect(cx - 110, yy, 220, 46, "#DCE3E9", { rx: 4 });
        for (let c = 0; c < 5; c++) s += diamond(cx - 88 + c * 44, yy + 23, 15, COL.tealLight, COL.teal);
      });
      s += rect(cx - 110, cy - 24, 220, 58, "#F3F0F9");
      s += ion(cx - 70, cy + 5, { r: 10 }) + ion(cx + 10, cy - 4, { r: 10 }) + ion(cx + 80, cy + 10, { r: 10 });
      s += arrow(cx - 40, cy + 22, cx + 40, cy + 22, { color: COL.purple, width: 3, head: 11 });
      return s;
    },
    // NASICON
    (cx, cy) => {
      let s = "";
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++) {
          const x = cx - 80 + c * 80, y = cy - 76 + r * 76;
          s += diamond(x, y, 24, "#F6CFE0", "#C24E84");
          if (c < 2) s += tri(x + 40, y, 15, COL.tealLight, COL.teal, r % 2 === 0);
          if (r < 2) s += tri(x, y + 38, 15, COL.tealLight, COL.teal, c % 2 === 1);
        }
      [[-40, -38], [40, 38], [-40, 38], [40, -38]].forEach(([dx, dy]) => (s += ion(cx + dx, cy + dy, { r: 10 })));
      return s;
    },
    // perovskite
    (cx, cy) => {
      let s = rect(cx - 90, cy - 90, 180, 180, "none", { stroke: COL.line, sw: 2 });
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => (s += diamond(cx + i * 90, cy + j * 90, 26, COL.tealLight, COL.teal) + circ(cx + i * 90, cy + j * 90, 6, COL.siDark)));
      s += `<path d="M${cx},${cy - 30} A30,30 0 0 1 ${cx},${cy + 30} Z" fill="${COL.purple}"/>`;
      s += `<path d="M${cx},${cy - 30} A30,30 0 0 0 ${cx},${cy + 30} Z" fill="#C24E84"/>`;
      s += circ(cx, cy, 30, "none", { stroke: COL.ink, sw: 2 });
      s += text(cx - 46, cy + 54, "La", { size: 15, anchor: "middle", weight: "bold", fill: "#C24E84" });
      s += text(cx + 46, cy + 54, "Li", { size: 15, anchor: "middle", weight: "bold", fill: COL.purple });
      s += circ(cx + 60, cy - 50, 12, "none", { stroke: COL.purple, sw: 2.5 });
      s += text(cx + 60, cy - 70, "空位", { size: 15, anchor: "middle", fill: COL.purple, weight: "bold" });
      return s;
    },
    // garnet
    (cx, cy) => {
      let s = "";
      const R = rng(23);
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++) {
          const x = cx - 96 + c * 72 + (r % 2) * 14, y = cy - 76 + r * 76;
          s += diamond(x, y, 18, COL.tealLight, COL.teal);
          if (c < 2 || r % 2 === 0) s += `<polygon points="${x + 36},${y - 16} ${x + 50},${y - 5} ${x + 47},${y + 12} ${x + 28},${y + 16} ${x + 22},${y - 2}" fill="#F6CFE0" stroke="#C24E84" stroke-width="2"/>`;
        }
      // Li loop
      const loop = [];
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        loop.push([cx + 10 + 62 * Math.cos(a), cy + 46 * Math.sin(a) + (R() - 0.5) * 6]);
      }
      s += `<polygon points="${loop.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${COL.purple}" stroke-width="3" stroke-dasharray="6 5"/>`;
      loop.forEach(([x, y], k) => (s += k % 2 ? circ(x, y, 7, COL.purple) : circ(x, y, 6, "#FFFFFF", { stroke: COL.purple, sw: 2 })));
      return s;
    },
  ];
  const meta = [
    ["β-Al_{2}O_{3}", "Na_{2}O·11Al_{2}O_{3}", ["二维传导面"]],
    ["NASICON", "NaZr_{2}(PO_{4})_{3}", ["PO_{4} 四面体 + ZrO_{6} 八面体", "围成三维通道"]],
    ["钙钛矿 Perovskite", "Li_{3x}La_{2/3−x}TiO_{3}", ["A 位：La、Li 或空位"]],
    ["石榴石 Garnet", "Li_{7}La_{3}Zr_{2}O_{12}（LLZO）", ["Li 过量，立方相", "三维传导"]],
  ];
  draws.forEach((dr, i) => (b += structTile(6 + i * (tw + gap), 6, tw, meta[i][0], meta[i][1], meta[i][2], dr)));
  return svg(W, H, b);
};
figs.sie_struct_b = () => {
  const W = 1180, H = 380;
  let b = "";
  const tw = 284, gap = 12;
  const draws = [
    // LGPS: tetrahedra framework + 1D Li channel along c
    (cx, cy) => {
      let s = "";
      [-70, 70].forEach((dx) => {
        for (let k = 0; k < 3; k++) {
          s += diamond(cx + dx, cy - 70 + k * 70, 22, "#CFE8D5", "#3C9A5B");
          s += tri(cx + dx + (k % 2 ? 34 : -34), cy - 35 + k * 70, 14, COL.sulfurLight, COL.sulfur, k % 2 === 0);
        }
      });
      s += rect(cx - 22, cy - 100, 44, 200, "#F3F0F9", { rx: 22 });
      [-75, -25, 25, 75].forEach((dy) => (s += ion(cx, cy + dy, { r: 10 })));
      s += arrow(cx - 110, cy + 80, cx - 110, cy - 60, { color: COL.purple, width: 3, head: 12 });
      s += text(cx - 110, cy + 104, "c 轴", { size: 15, anchor: "middle", weight: "bold", fill: COL.purple });
      return s;
    },
    // antiperovskite Li3OCl
    (cx, cy) => {
      let s = rect(cx - 90, cy - 90, 180, 180, "none", { stroke: COL.line, sw: 2 });
      s += `<polygon points="${cx},${cy - 64} ${cx + 64},${cy} ${cx},${cy + 64} ${cx - 64},${cy}" fill="${COL.redLight}" stroke="${COL.red}" stroke-width="2.5"/>`;
      s += circ(cx, cy, 16, COL.red) + text(cx, cy + 6, "O", { size: 16, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
      [[0, -64], [64, 0], [0, 64], [-64, 0]].forEach(([dx, dy]) => (s += ion(cx + dx, cy + dy, { r: 11 })));
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => (s += circ(cx + i * 90, cy + j * 90, 22, "#B7E3A8", { stroke: "#4E9A3A", sw: 2 }) + text(cx + i * 90, cy + j * 90 + 6, "Cl", { size: 15, anchor: "middle", weight: "bold" })));
      return s;
    },
    // hydride Li2(BH4)(NH2)
    (cx, cy) => {
      let s = "";
      const grp = (x, y, center, col, n) => {
        let g = "";
        for (let k = 0; k < n; k++) {
          const a = (k / n) * Math.PI * 2 + 0.4;
          g += line(x, y, x + 24 * Math.cos(a), y + 24 * Math.sin(a), COL.muted, 2) + circ(x + 24 * Math.cos(a), y + 24 * Math.sin(a), 6, "#FFFFFF", { stroke: COL.siDark, sw: 1.5 });
        }
        return g + circ(x, y, 15, col) + text(x, y + 5, center, { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
      };
      const li = [cx, cy];
      const ligands = [[cx - 66, cy - 60, "B", "#8FB9DD", 4], [cx + 66, cy - 60, "N", "#3A7CA5", 2], [cx - 66, cy + 60, "N", "#3A7CA5", 2], [cx + 66, cy + 60, "B", "#8FB9DD", 4]];
      ligands.forEach(([x, y]) => (s += line(li[0], li[1], x, y, COL.purple, 2.5, { dash: "5 4" })));
      ligands.forEach(([x, y, c, col, n]) => (s += grp(x, y, c, col, n)));
      s += ion(cx, cy, { r: 14 });
      return s;
    },
    // LiPON thin film
    (cx, cy) => {
      let s = "";
      s += rect(cx - 110, cy + 50, 220, 24, COL.alu);
      s += rect(cx - 110, cy + 20, 220, 30, COL.amberLight);
      s += rect(cx - 110, cy - 20, 220, 40, "#E8F4F3", { stroke: COL.teal, sw: 2 });
      s += rect(cx - 110, cy - 50, 220, 30, "#B9C3CC");
      s += text(cx + 120, cy - 30, "Li", { size: 15, weight: "bold", anchor: "end" });
      s += text(cx + 100, cy + 6, "LiPON", { size: 15, weight: "bold", anchor: "end", fill: COL.teal });
      s += text(cx + 100, cy + 41, "正极", { size: 15, weight: "bold", anchor: "end" });
      const R = rng(31);
      let d = "";
      for (let k = 0; k < 9; k++) d += `${(cx - 100 + k * 18).toFixed(0)},${(cy - 2 + (R() - 0.5) * 22).toFixed(0)} `;
      s += `<polyline points="${d}" fill="none" stroke="${COL.teal}" stroke-width="2.5"/>`;
      s += text(cx, cy - 76, "≈ 1 μm 级薄膜", { size: 15, anchor: "middle", fill: COL.muted });
      return s;
    },
  ];
  const meta = [
    ["硫化物 Sulfide", "Li_{10}GeP_{2}S_{12}（LGPS）", ["沿 c 轴的一维 Li⁺ 通道"]],
    ["反钙钛矿", "Li_{3}OX（X = Cl、Br）", ["钙钛矿“正负反过来”"]],
    ["配位氢化物 Hydride", "Li_{2}(BH_{4})(NH_{2})", ["Li⁺ 被 [BH_{4}]⁻、[NH_{2}]⁻", "四面体配位"]],
    ["LiPON（非晶）", "溅射 Li_{3}PO_{4} + N_{2}", ["第一个薄膜电池电解质"]],
  ];
  draws.forEach((dr, i) => (b += structTile(6 + i * (tw + gap), 6, tw, meta[i][0], meta[i][1], meta[i][2], dr)));
  return svg(W, H, b);
};

// ---------- Composite / hybrid electrolytes ----------
figs.composite = () => {
  const W = 670, H = 420;
  let b = "";
  const pw = 206, gap = 16;
  const titles = [["① 惰性填料", "颗粒分散在聚合物里"], ["② 对齐纳米线", "陶瓷连成“高速路”"], ["③ 层状杂化", "SPE | SIE | SPE 夹心"]];
  titles.forEach(([t, s], i) => {
    const x = 6 + i * (pw + gap);
    b += rect(x, 70, pw, 250, "#E8F4F3", { rx: 14 });
    b += text(x + pw / 2, 30, t, { size: 18, anchor: "middle", weight: "bold" });
    b += text(x + pw / 2, 56, s, { size: 15, anchor: "middle", fill: COL.text2 });
  });
  // panel 1: chains + particles
  let x = 6;
  [0, 1, 2, 3, 4].forEach((k) => (b += wavy(x + 14, x + pw - 20, 100 + k * 46, 10, 34, COL.tealLight, 3)));
  [[60, 120], [140, 160], [80, 230], [160, 270], [110, 290], [40, 190]].forEach(([px, py], k) => (b += blob(x + px, py, 16, 60 + k, { fill: COL.alu, stroke: COL.siDark, sw: 2 })));
  b += lines(x + pw / 2, 350, ["抑制结晶", "增强力学"], { size: 15, anchor: "middle", weight: "bold", fill: COL.teal, lh: 22 });
  // panel 2: aligned wires
  x = 6 + pw + gap;
  [0, 1, 2, 3].forEach((k) => (b += wavy(x + 14, x + pw - 20, 104 + k * 60, 8, 30, COL.tealLight, 3)));
  [40, 90, 140, 180].forEach((wx) => (b += rect(x + wx - 7, 84, 14, 222, COL.purpleLight, { rx: 7 })));
  b += ion(x + 90, 150, { r: 10 }) + arrow(x + 90, 170, x + 90, 280, { color: COL.purple, width: 3, head: 12 });
  b += lines(x + pw / 2, 350, ["离子沿陶瓷连续通道", "快速通过"], { size: 15, anchor: "middle", weight: "bold", fill: COL.purple, lh: 22 });
  // panel 3: layered
  x = 6 + 2 * (pw + gap);
  b += rect(x + 16, 84, pw - 32, 30, "#B9C3CC") + text(x + pw / 2, 105, "Li 金属", { size: 15, anchor: "middle", weight: "bold" });
  b += rect(x + 16, 114, pw - 32, 44, COL.tealLight) + text(x + pw / 2, 142, "SPE", { size: 16, anchor: "middle", weight: "bold" });
  b += rect(x + 16, 158, pw - 32, 64, COL.purpleLight) + text(x + pw / 2, 196, "SIE", { size: 16, anchor: "middle", weight: "bold" });
  b += rect(x + 16, 222, pw - 32, 44, COL.tealLight) + text(x + pw / 2, 250, "SPE", { size: 16, anchor: "middle", weight: "bold" });
  b += rect(x + 16, 266, pw - 32, 40, COL.amberLight) + text(x + pw / 2, 292, "正极", { size: 15, anchor: "middle", weight: "bold" });
  b += lines(x + pw / 2, 350, ["软层贴合电极", "硬层挡住枝晶"], { size: 15, anchor: "middle", weight: "bold", fill: COL.amber, lh: 22 });
  b += text(W / 2, 410, "示意；②据原文 Fig. 1（2017，对齐陶瓷纳米线）", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Chapter map ----------
figs.chapter_map = () => {
  const W = 1180, H = 430;
  let b = "";
  const chs = [
    ["1", "引言与", "发展史", ["SSE 是什么", "从 Faraday 到 LGPS"], COL.purple],
    ["2", "离子传输", "机理与路径", ["Arrhenius / VTF", "体相与界面"], COL.purple],
    ["3", "Li/Na 与", "多价离子", ["Table 1", "Mg²⁺、Zn²⁺、Al³⁺"], COL.purple],
    ["4", "失效", "模式", ["界面分解", "枝晶与短路"], COL.red],
    ["5", "设计", "策略", ["化学、几何、力学", "界面工程"], COL.teal],
    ["6", "高能电池", "与展望", ["高压正极、S、O_{2}", "未来方向"], COL.teal],
  ];
  const bw = 176, gap = 18, x0 = 22, y0 = 110;
  const groups = [[0, 3, "基础：材料与传输", COL.purple], [3, 4, "问题：为什么会坏", COL.red], [4, 6, "方案：怎么设计、用在哪", COL.teal]];
  groups.forEach(([a, z, t, c]) => {
    const xa = x0 + a * (bw + gap), xz = x0 + z * (bw + gap) - gap;
    b += rect(xa, 20, xz - xa, 50, c, { rx: 25 });
    b += text((xa + xz) / 2, 52, t, { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  });
  chs.forEach(([n, t1, t2, sub, c], i) => {
    const x = x0 + i * (bw + gap);
    b += rect(x, y0, bw, 250, i === 0 ? "#F1ECF8" : "#F5F7F9", { rx: 16, stroke: i === 0 ? COL.purple : undefined, sw: 3 });
    b += circ(x + bw / 2, y0 + 44, 28, c) + text(x + bw / 2, y0 + 55, n, { size: 28, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += lines(x + bw / 2, y0 + 112, [t1, t2], { size: 20, anchor: "middle", weight: "bold", lh: 28 });
    b += lines(x + bw / 2, y0 + 190, sub, { size: 15, anchor: "middle", fill: COL.text2, lh: 24 });
    if (i < 5) b += head(x + bw + gap - 2, y0 + 125, 0, COL.line, 14);
  });
  b += text(x0 + bw / 2, y0 + 290, "▲ 你在这里", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  return svg(W, H, b);
};

module.exports = figs;
