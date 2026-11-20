// Figures for Manthiram, Yu & Wang 2017, Chapter 4 (All-solid-state lithium-ion batteries)
// Canvas scale: about 100 px per inch on the slide, so 16 px text ≈ 11.5 pt.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const SE_FILL = "#D5DBE0", SE_STROKE = "#9AA6B2";

// sphere with a small highlight, used for particles
const ball = (x, y, r, fill, stroke, sw = 2) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>` +
  `<circle cx="${(x - r * 0.35).toFixed(1)}" cy="${(y - r * 0.35).toFixed(1)}" r="${(r * 0.28).toFixed(1)}" fill="#FFFFFF" opacity="0.55"/>`;

// hex-packed points in a rectangle
function packed(x0, y0, w, h, r, seed) {
  const R = rng(seed);
  const pts = [];
  const dy = r * 1.75;
  let row = 0;
  for (let y = y0 + r; y <= y0 + h - r + 0.1; y += dy, row++) {
    for (let x = x0 + r + (row % 2 ? r : 0); x <= x0 + w - r + 0.1; x += r * 2) {
      pts.push([x + (R() - 0.5) * 3, y + (R() - 0.5) * 3]);
    }
  }
  return pts;
}

// ---------- Title motif: three stacked solid layers ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  b += `<rect x="40" y="40" width="350" height="480" rx="30" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.9"/>`;
  const bands = [
    { y: 70, h: 130, fill: COL.tealLight, stroke: COL.teal, act: 0.55 },
    { y: 215, h: 130, fill: SE_FILL, stroke: "#FFFFFF", act: 0 },
    { y: 360, h: 130, fill: COL.amberLight, stroke: COL.amber, act: 0.55 },
  ];
  bands.forEach((bd, k) => {
    const R = rng(40 + k);
    packed(70, bd.y, 290, bd.h, 19, 10 + k).forEach(([x, y]) => {
      const active = R() < bd.act;
      b += ball(x, y, 18, active ? bd.fill : SE_FILL, active ? bd.stroke : "#9AA6B2", 2.5);
    });
  });
  b += `<path d="M 215 100 L 230 160 L 200 230 L 236 300 L 205 380 L 225 460" fill="none" stroke="${COL.red}" stroke-width="6" stroke-dasharray="10 9" stroke-linecap="round"/>`;
  return svg(W, H, b);
};

// ---------- History timeline ----------
figs.ass_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1972", who: ["Greatbatch 等"], what: ["Li–I_{2} 起搏器电池", "LiI 固体电解质"], color: COL.text2 },
    { year: "1978", who: ["Armand"], what: ["提出 PEO 聚合物", "电解质用于电池"], color: COL.teal },
    { year: "1992", who: ["Bates, Dudney (ORNL)"], what: ["LiPON", "薄膜电解质"], color: COL.amber },
    { year: "2003", who: ["Takada 等"], what: ["硫化物全固态", "电池配石墨负极"], color: COL.purple },
    { year: "2006", who: ["Ohta, Takada 等"], what: ["正极表面", "加“缓冲层”"], color: COL.purple },
    { year: "2011", who: ["Kamaya 等"], what: ["LGPS：电导率", "媲美液态电解液"], color: COL.purple },
    { year: "2015", who: ["Li, Dudney 等"], what: ["LiPON 薄膜电池", "4.8 V、1 万圈"], color: COL.amber },
    { year: "2016", who: ["Kato 等"], what: ["硫化物全固态", "高功率电池"], color: COL.purple },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 90, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Inorganic all-solid-state cell (Fig. 3a redrawn) ----------
figs.inorganic_cell = () => {
  const W = 720, H = 500;
  let b = "";
  const top = 50, h = 330;
  b += `<rect x="28" y="${top}" width="22" height="${h}" fill="${COL.copper}"/>`;
  b += `<rect x="670" y="${top}" width="22" height="${h}" fill="${COL.alu}"/>`;
  b += text(39, top - 12, "−", { size: 30, anchor: "middle", weight: "bold" });
  b += text(681, top - 12, "+", { size: 30, anchor: "middle", weight: "bold" });
  b += `<rect x="50" y="${top}" width="620" height="${h}" fill="#F2F4F6"/>`;
  const R = rng(5);
  const regions = [
    { x: 52, w: 206, act: 0.45, fill: COL.tealLight, stroke: COL.teal },
    { x: 260, w: 200, act: 0, fill: SE_FILL, stroke: SE_STROKE },
    { x: 462, w: 206, act: 0.45, fill: COL.amberLight, stroke: COL.amber },
  ];
  const keep = [];
  regions.forEach((rg, k) => {
    packed(rg.x, top + 2, rg.w, h - 4, 16, 3 + k).forEach(([x, y]) => {
      const a = R() < rg.act;
      keep.push({ x, y, a, k });
      b += ball(x, y, a ? 16 : 15, a ? rg.fill : SE_FILL, a ? rg.stroke : SE_STROKE, a ? 2.5 : 1.5);
    });
  });
  // Li+ pathways (dotted, red) hopping across particle centres
  const path = (y0, seed) => {
    const Rr = rng(seed);
    let d = `M 70 ${y0}`;
    let y = y0;
    for (let x = 100; x <= 650; x += 32) {
      y += (Rr() - 0.5) * 40;
      y = Math.max(top + 20, Math.min(top + h - 20, y));
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    return `<path d="${d}" fill="none" stroke="${COL.red}" stroke-width="3.5" stroke-dasharray="6 6" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  b += path(120, 2) + path(215, 9) + path(310, 4);
  // brackets + labels
  const lab = (x1, x2, t1, t2, c) => {
    let s = `<path d="M ${x1} ${top + h + 10} V ${top + h + 20} H ${x2} V ${top + h + 10}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    s += text((x1 + x2) / 2, top + h + 46, t1, { size: 19, anchor: "middle", weight: "bold", fill: c });
    s += text((x1 + x2) / 2, top + h + 70, t2, { size: 16, anchor: "middle", fill: COL.text2 });
    return s;
  };
  b += lab(54, 256, "负极复合层", "活性物质 + 电解质颗粒", COL.teal);
  b += lab(262, 458, "固态电解质层", "同时充当隔膜", COL.siDark);
  b += lab(464, 666, "正极复合层", "活性物质 + 电解质颗粒", COL.amber);
  b += `<line x1="200" y1="${H - 14}" x2="240" y2="${H - 14}" stroke="${COL.red}" stroke-width="3.5" stroke-dasharray="6 6"/>`;
  b += text(250, H - 8, "红色虚线 = Li⁺ 在颗粒之间“接力”传输的路径", { size: 16, fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Composite cathode zoom + mass fractions ----------
figs.composite_cathode = () => {
  const W = 760, H = 470;
  let b = "";
  // zoom box
  const x0 = 20, y0 = 20, w = 380, h = 360;
  b += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="16" fill="#FFFFFF" stroke="${COL.line}" stroke-width="2"/>`;
  b += `<rect x="${x0 + 10}" y="${y0 + h - 34}" width="${w - 20}" height="24" fill="${COL.alu}"/>`;
  const big = [[110, 110, 56], [280, 95, 50], [200, 245, 60], [340, 250, 42], [80, 270, 40]];
  const R = rng(17);
  // electrolyte particles fill around (packed, a few left out as voids)
  packed(x0 + 8, y0 + 8, w - 16, h - 52, 12, 31).forEach(([x, y]) => {
    if (big.some(([bx, by, br]) => Math.hypot(x - bx - x0 + 20, y - by - y0 + 20) < br + 8)) return;
    if (Math.hypot(x - x0 - 255, y - y0 - 178) < 22) return; // the highlighted void
    if (R() < 0.08) return;
    b += ball(x, y, 11.5, SE_FILL, SE_STROKE, 1.2);
  });
  // carbon chains
  for (let i = 0; i < 14; i++) {
    const x = x0 + 30 + R() * (w - 60), y = y0 + 30 + R() * (h - 90);
    b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#2B2F33"/><circle cx="${(x + 8).toFixed(1)}" cy="${(y + 3).toFixed(1)}" r="5" fill="#2B2F33"/>`;
  }
  big.forEach(([x, y, r], i) => (b += blob(x0 + x - 20, y0 + y - 20, r, 60 + i, { fill: COL.amberLight, stroke: COL.amber, sw: 3, jag: 0.08 })));
  // void highlight
  b += `<circle cx="${x0 + 255}" cy="${y0 + 178}" r="20" fill="none" stroke="${COL.red}" stroke-width="3" stroke-dasharray="5 4"/>`;
  b += text(x0 + 255, y0 + 152, "空隙", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(x0 + w / 2, y0 + h + 30, "全固态复合正极（截面示意）", { size: 17, anchor: "middle", weight: "bold" });
  // legend
  const lx = 430;
  b += blob(lx + 16, 46, 15, 3, { fill: COL.amberLight, stroke: COL.amber, sw: 2, jag: 0.08 });
  b += text(lx + 42, 53, "正极活性物质：储存 Li", { size: 17 });
  b += ball(lx + 16, 88, 11, SE_FILL, SE_STROKE, 1.2);
  b += text(lx + 42, 95, "固态电解质颗粒：运 Li⁺", { size: 17 });
  b += `<circle cx="${lx + 10}" cy="130" r="5" fill="#2B2F33"/><circle cx="${lx + 20}" cy="133" r="5" fill="#2B2F33"/>`;
  b += text(lx + 42, 137, "导电碳：运电子", { size: 17 });
  // mass fraction bars
  const by = 215, bw = 300;
  b += text(lx, by - 22, "正极层里各组分的质量占比（典型值）", { size: 17, weight: "bold" });
  const bar = (y, parts, label) => {
    let s = text(lx, y - 8, label, { size: 16, fill: COL.text2 });
    let x = lx;
    parts.forEach(([f, c, t]) => {
      s += `<rect x="${x}" y="${y}" width="${bw * f}" height="40" fill="${c}"/>`;
      if (t) s += text(x + (bw * f) / 2, y + 27, t, { size: 16, anchor: "middle", weight: "bold", fill: COL.ink });
      x += bw * f;
    });
    return s;
  };
  b += bar(by + 20, [[0.95, COL.amberLight, "活性物质 ≈ 95%"], [0.05, "#2B2F33", ""]], "液态锂离子电池");
  b += bar(by + 110, [[0.7, COL.amberLight, "≈ 70%"], [0.25, SE_FILL, "电解质"], [0.05, "#2B2F33", ""]], "全固态电池（实验室常见）");
  b += text(lx, by + 190, "固态电解质也要占质量，", { size: 16, fill: COL.red, weight: "bold" });
  b += text(lx, by + 214, "活性物质比例被“挤”低了", { size: 16, fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Liquid wetting vs solid point contact ----------
figs.contact = () => {
  const W = 760, H = 440;
  let b = "";
  // left: liquid
  b += `<rect x="20" y="30" width="330" height="250" rx="14" fill="${COL.electrolyte}"/>`;
  b += blob(185, 150, 82, 7, { fill: COL.amberLight, stroke: COL.amber, sw: 3, jag: 0.1 });
  for (let a = 0; a < 16; a++) {
    const t = (a / 16) * Math.PI * 2;
    b += ion(185 + Math.cos(t) * 104, 150 + Math.sin(t) * 98, { r: 9 });
  }
  b += text(185, 315, "液体：自动浸润", { size: 20, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(185, 342, "整个表面都能进出 Li⁺", { size: 17, anchor: "middle", fill: COL.text2 });
  // right: solid
  const X = 410;
  b += `<rect x="${X}" y="30" width="330" height="250" rx="14" fill="#F2F4F6"/>`;
  const R = rng(3);
  const ring = [];
  for (let a = 0; a < 11; a++) {
    const t = (a / 11) * Math.PI * 2 + 0.2;
    const rr = 118 + R() * 16;
    ring.push([X + 165 + Math.cos(t) * rr, 150 + Math.sin(t) * rr * 0.86, 30 + R() * 6]);
  }
  ring.forEach(([x, y, r]) => (b += ball(x, y, r, SE_FILL, SE_STROKE, 2)));
  b += blob(X + 165, 150, 82, 7, { fill: COL.amberLight, stroke: COL.amber, sw: 3, jag: 0.1 });
  // contact points: where ring particles nearly touch the blob
  [[X + 247, 168], [X + 104, 88], [X + 140, 228], [X + 222, 82]].forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="7" fill="${COL.red}"/>`));
  b += text(X + 165, 315, "固体：点接触", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(X + 165, 342, "只有红点处能过 Li⁺，其余是空隙", { size: 17, anchor: "middle", fill: COL.text2 });
  // three aspects
  const asp = ["① 浸润 / 接触面积", "② 固–固界面稳定性", "③ 离子跨界面的速度"];
  asp.forEach((t, i) => (b += pill(20 + i * 245, 380, 230, 44, i === 0 ? COL.amber : COL.ink, t, { size: 17 })));
  return svg(W, H, b);
};

// ---------- Volume change → contact loss and cracks ----------
figs.volume_change = () => {
  const W = 760, H = 400;
  let b = "";
  const panel = (cx, scale, cracks, label, sub, col) => {
    let s = "";
    const R = rng(11);
    for (let a = 0; a < 12; a++) {
      const t = (a / 12) * Math.PI * 2;
      s += ball(cx + Math.cos(t) * 92, 150 + Math.sin(t) * 92, 26, SE_FILL, SE_STROKE, 1.8);
    }
    s += blob(cx, 150, 64 * scale, 21, { fill: COL.amberLight, stroke: COL.amber, sw: 3, jag: 0.07 });
    if (cracks) {
      s += `<path d="M ${cx - 20} ${150 - 60 * scale} L ${cx - 6} ${150 - 18} L ${cx - 24} ${150 + 12} L ${cx - 8} ${150 + 56 * scale}" fill="none" stroke="${COL.red}" stroke-width="4" stroke-linejoin="round"/>`;
      s += `<path d="M ${cx + 54 * scale} ${150 - 20} L ${cx + 14} ${150 + 4} L ${cx + 30} ${150 + 34}" fill="none" stroke="${COL.red}" stroke-width="3.5" stroke-linejoin="round"/>`;
    }
    s += text(cx, 300, label, { size: 19, anchor: "middle", weight: "bold", fill: col });
    s += text(cx, 326, sub, { size: 16, anchor: "middle", fill: COL.text2 });
    return s;
  };
  b += panel(120, 1.0, false, "① 刚组装", "颗粒与电解质贴紧", COL.teal);
  b += arrow(228, 150, 278, 150, { color: COL.ink, width: 3.5, head: 14 });
  b += text(253, 132, "充电", { size: 16, anchor: "middle", weight: "bold" });
  b += panel(380, 0.84, false, "② 颗粒收缩", "出现缝隙，接触变少", COL.amber);
  b += arrow(488, 150, 538, 150, { color: COL.ink, width: 3.5, head: 14 });
  b += text(513, 132, "反复", { size: 16, anchor: "middle", weight: "bold" });
  b += panel(640, 0.92, true, "③ 颗粒开裂", "碎片失去 Li⁺/e⁻ 通路", COL.red);
  b += text(W / 2, 380, "液体能流进缝隙“补位”，固体不会 → 接触越来越差，容量衰减", { size: 17, anchor: "middle", weight: "bold", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- Modulus dilemma (soft for cathode, hard for Li) ----------
figs.modulus_dilemma = () => {
  const W = 760, H = 430;
  let b = "";
  // beam
  b += `<polygon points="380,250 350,310 410,310" fill="${COL.ink}"/>`;
  b += `<rect x="90" y="236" width="580" height="14" rx="7" fill="${COL.ink}" transform="rotate(-0 380 243)"/>`;
  // left pan: soft
  b += `<rect x="70" y="80" width="250" height="150" rx="16" fill="${COL.tealLight}" opacity="0.5"/>`;
  for (let a = 0; a < 8; a++) {
    const t = (a / 8) * Math.PI * 2;
    b += `<ellipse cx="${195 + Math.cos(t) * 58}" cy="${155 + Math.sin(t) * 44}" rx="20" ry="16" fill="${SE_FILL}" stroke="${SE_STROKE}" stroke-width="1.5"/>`;
  }
  b += blob(195, 155, 34, 4, { fill: COL.amberLight, stroke: COL.amber, sw: 2.5, jag: 0.08 });
  b += `<path d="M 150 155 Q 195 110 240 155 Q 195 200 150 155" fill="none" stroke="${COL.teal}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  b += text(195, 60, "正极一侧：要“软”", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(195, 352, ["低弹性模量", "跟着颗粒胀缩，不压碎电极"], { size: 17, anchor: "middle", fill: COL.ink, lh: 26 });
  // right pan: hard
  b += `<rect x="440" y="80" width="250" height="150" rx="16" fill="${COL.purpleLight}" opacity="0.5"/>`;
  b += `<rect x="460" y="190" width="210" height="28" fill="#B9C3CC"/>`;
  b += text(565, 210, "Li 金属", { size: 16, anchor: "middle", weight: "bold" });
  b += `<path d="M 545 190 L 540 168 L 552 150 L 548 132" fill="none" stroke="#8F9BA6" stroke-width="7" stroke-linecap="round"/>`;
  b += `<rect x="460" y="104" width="210" height="22" fill="${SE_FILL}" stroke="${SE_STROKE}" stroke-width="2"/>`;
  b += cross(548, 116, 11);
  b += text(565, 60, "锂负极一侧：要“硬”", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  b += lines(565, 352, ["高模量、高硬度", "顶住锂枝晶，不让它刺穿"], { size: 17, anchor: "middle", fill: COL.ink, lh: 26 });
  return svg(W, H, b);
};

// ---------- Space-charge layer at oxide | sulfide interface ----------
figs.space_charge = () => {
  const W = 780, H = 520;
  let b = "";
  // top: interface sketch
  const ix = 300;
  b += `<rect x="40" y="30" width="${ix - 40}" height="170" fill="${COL.amberLight}"/>`;
  b += `<rect x="${ix}" y="30" width="${740 - ix}" height="170" fill="${SE_FILL}"/>`;
  b += `<rect x="${ix}" y="30" width="110" height="170" fill="${COL.redLight}" opacity="0.55"/>`;
  b += text(170, 60, "氧化物正极（如 LiCoO_{2}）", { size: 17, anchor: "middle", weight: "bold" });
  b += text(600, 60, "硫化物电解质", { size: 17, anchor: "middle", weight: "bold" });
  b += lines(ix + 55, 182, ["Li⁺ 耗尽层"], { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  const R = rng(8);
  for (let i = 0; i < 26; i++) {
    const x = 60 + R() * 220, y = 80 + R() * 90;
    b += ion(x, y, { r: 9 });
  }
  for (let i = 0; i < 20; i++) {
    const x = ix + 130 + R() * 290, y = 80 + R() * 90;
    b += ion(x, y, { r: 9 });
  }
  b += ion(ix + 70, 110, { r: 9 });
  b += arrow(ix + 50, 135, ix - 30, 135, { color: COL.red, width: 3.5, head: 13 });
  b += `<line x1="${ix}" y1="24" x2="${ix}" y2="206" stroke="${COL.ink}" stroke-width="3"/>`;
  // bottom: concentration profile
  const py0 = 270, py1 = 470; // y top/bottom of plot
  b += `<line x1="40" y1="${py1}" x2="745" y2="${py1}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += `<line x1="40" y1="${py0 - 10}" x2="40" y2="${py1}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += text(52, py0 + 4, "Li⁺ 浓度", { size: 16, weight: "bold", fill: COL.text2 });
  b += text(745, py1 + 26, "位置 →", { size: 16, anchor: "end", fill: COL.text2 });
  b += `<line x1="${ix}" y1="${py0 - 10}" x2="${ix}" y2="${py1}" stroke="${COL.muted}" stroke-width="2" stroke-dasharray="5 5"/>`;
  b += text(ix, py1 + 26, "界面", { size: 16, anchor: "middle", fill: COL.muted });
  // red profile: no buffer
  const yS = 330; // bulk sulfide level
  b += `<path d="M 40 300 L ${ix - 50} 300 Q ${ix - 10} 296 ${ix} 270 L ${ix} 440 Q ${ix + 60} 438 ${ix + 110} ${yS} L 740 ${yS}" fill="none" stroke="${COL.red}" stroke-width="4"/>`;
  b += text(ix + 120, 430, "无缓冲层：界面附近 Li⁺ 变少 → 电阻大", { size: 16, weight: "bold", fill: COL.red });
  // teal: with buffer
  b += `<path d="M 40 306 L ${ix - 20} 306 L ${ix + 40} 318 L 740 ${yS + 6}" fill="none" stroke="${COL.teal}" stroke-width="4" stroke-dasharray="10 6"/>`;
  b += text(ix + 120, 368, "加 LiNbO_{3} 缓冲层：浓度平缓过渡", { size: 16, weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- Interphase: stable / reacting / coated ----------
figs.interphase = () => {
  const W = 780, H = 440;
  let b = "";
  const panel = (x, kind) => {
    let s = "";
    s += `<rect x="${x}" y="30" width="110" height="230" fill="${COL.amberLight}"/>`;
    s += `<rect x="${x + 110}" y="30" width="110" height="230" fill="${SE_FILL}"/>`;
    if (kind === "react") {
      const R = rng(9);
      s += `<rect x="${x + 92}" y="30" width="40" height="230" fill="#C98B5E"/>`;
      for (let i = 0; i < 26; i++) {
        s += `<rect x="${(x + 94 + R() * 30).toFixed(1)}" y="${(34 + R() * 215).toFixed(1)}" width="${(5 + R() * 7).toFixed(1)}" height="${(6 + R() * 10).toFixed(1)}" rx="2" fill="${R() > 0.5 ? COL.sei : "#E2B48C"}"/>`;
      }
      s += arrow(x + 76, 280, x + 26, 280, { color: COL.sei, width: 3, head: 11 });
      s += arrow(x + 148, 280, x + 198, 280, { color: COL.sei, width: 3, head: 11 });
      s += text(x + 112, 287, "增厚", { size: 16, anchor: "middle", weight: "bold", fill: COL.sei });
    } else if (kind === "coat") {
      s += `<rect x="${x + 104}" y="30" width="12" height="230" fill="${COL.purple}"/>`;
      s += text(x + 112, 287, "几 nm 包覆层", { size: 16, anchor: "middle", weight: "bold", fill: COL.purple });
    } else {
      s += `<line x1="${x + 110}" y1="30" x2="${x + 110}" y2="260" stroke="${COL.ink}" stroke-width="2.5"/>`;
    }
    for (let k = 0; k < 3; k++) s += ion(x + 60 + (kind === "react" ? 0 : 0), 80 + k * 70, { r: 10 });
    const blocked = kind === "react";
    for (let k = 0; k < 3; k++) {
      const y = 80 + k * 70;
      if (blocked && k !== 1) s += arrow(x + 74, y, x + 90, y, { color: COL.purple, width: 3, head: 10 });
      else s += arrow(x + 74, y, x + 168, y, { color: COL.purple, width: 3, head: 11 });
    }
    return s;
  };
  b += panel(20, "stable") + panel(280, "react") + panel(540, "coat");
  const labs = [
    [130, "① 理想：界面稳定", "Li⁺ 直接穿过", COL.teal],
    [390, "② 两边互相反应", "长出高电阻“钝化层”", COL.red],
    [650, "③ 加缓冲包覆层", "隔开反应，Li⁺ 照样过", COL.purple],
  ];
  labs.forEach(([x, t1, t2, c]) => {
    b += text(x, 340, t1, { size: 19, anchor: "middle", weight: "bold", fill: c });
    b += text(x, 368, t2, { size: 16, anchor: "middle", fill: COL.text2 });
  });
  b += text(20, 420, "橙 = 正极　灰 = 固态电解质　棕 = 反应产物（界面相）", { size: 16, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Thin-film battery cross-section ----------
figs.thin_film = () => {
  const W = 780, H = 425;
  let b = "";
  // substrate
  b += `<rect x="30" y="360" width="520" height="50" fill="#9AA6B2"/>`;
  b += text(290, 392, "基底（硅片、玻璃、云母等）", { size: 17, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  // cathode current collector
  b += `<rect x="50" y="344" width="260" height="16" fill="#E2C044"/>`;
  // anode current collector
  b += `<rect x="380" y="344" width="150" height="16" fill="${COL.copper}"/>`;
  // cathode
  b += `<rect x="70" y="282" width="220" height="62" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="2"/>`;
  // LiPON covering cathode
  b += `<path d="M 56 344 L 56 268 L 304 268 L 304 282 L 330 282 L 330 344 Z" fill="${COL.tealLight}" stroke="${COL.teal}" stroke-width="2"/>`;
  b += `<rect x="56" y="268" width="248" height="14" fill="${COL.tealLight}"/>`;
  // Li anode over LiPON onto anode CC
  b += `<path d="M 90 268 L 90 236 L 350 236 L 350 304 L 470 304 L 470 344 L 400 344 L 400 330 L 330 330 L 330 282 L 304 282 L 304 268 Z" fill="#B9C3CC" stroke="#8F9BA6" stroke-width="2"/>`;
  // protective coating
  b += `<path d="M 40 344 L 40 216 L 500 216 L 500 344" fill="none" stroke="${COL.purple}" stroke-width="4" stroke-dasharray="10 6"/>`;
  // labels with leaders
  const lab = (x, y, tx, ty, t, sub, c) => {
    let s = `<line x1="${x}" y1="${y}" x2="${tx - 8}" y2="${ty - 6}" stroke="${c}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4.5" fill="${c}"/>`;
    s += text(tx, ty, t, { size: 18, weight: "bold", fill: c });
    if (sub) s += text(tx, ty + 22, sub, { size: 16, fill: COL.text2 });
    return s;
  };
  b += lab(470, 216, 540, 60, "封装保护层", "挡住空气和水汽", COL.purple);
  b += lab(300, 248, 540, 126, "Li 金属负极", "约几 μm，蒸镀", COL.siDark);
  b += lab(318, 300, 540, 192, "LiPON 电解质", "约 1–2 μm，溅射", COL.teal);
  b += lab(200, 316, 540, 258, "正极", "LiCoO_{2} 或 LiNi_{0.5}Mn_{1.5}O_{4}", COL.amber);
  b += lab(180, 352, 540, 322, "集流体", "Pt / Au（正）、Cu（负）", "#A07D10");
  return svg(W, H, b);
};

// ---------- Flexible polymer cell (Fig. 3b redrawn) ----------
figs.polymer_roll = () => {
  const W = 680, H = 360;
  let b = "";
  // three ribbons: anode (bottom), polymer (middle), cathode (top), waving left→right then rolling
  const band = (off, fill, stroke) => {
    let top = "", bot = "";
    const pts = [];
    for (let x = 150; x <= 470; x += 10) {
      const y = 250 + off + Math.sin((x - 150) / 55) * 18 - (x - 150) * 0.28;
      pts.push([x, y]);
    }
    top = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y.toFixed(1)}`).join(" ");
    bot = pts.slice().reverse().map(([x, y]) => `L ${x} ${(y + 22).toFixed(1)}`).join(" ");
    return `<path d="${top} ${bot} Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  };
  b += band(52, COL.amberLight, COL.amber); // anode? colour mapping in labels
  b += band(26, COL.tealLight, COL.teal);
  b += band(0, "#B9C3CC", "#7D8893");
  // roll
  const cx = 540, cy = 150;
  for (let r = 110; r > 20; r -= 22) {
    b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${r % 44 === 22 ? COL.teal : COL.amber}" stroke-width="10"/>`;
  }
  b += `<circle cx="${cx}" cy="${cy}" r="18" fill="${COL.ink}"/>`;
  // labels
  b += text(140, 262, "正极 Cathode", { size: 18, anchor: "end", weight: "bold", fill: COL.siDark });
  b += text(140, 290, "聚合物电解质", { size: 18, anchor: "end", weight: "bold", fill: COL.teal });
  b += text(140, 318, "负极 Anode", { size: 18, anchor: "end", weight: "bold", fill: COL.amber });
  b += text(540, 300, "可以卷绕、弯折", { size: 18, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- PEO oxidation window vs cathodes ----------
figs.peo_window = () => {
  const W = 620, H = 540;
  let b = "";
  const yv = (v) => 480 - v * 80;
  const ax = 120;
  b += `<rect x="${ax}" y="${yv(3.9)}" width="430" height="${yv(0) - yv(3.9)}" fill="${COL.tealLight}" opacity="0.35"/>`;
  b += `<rect x="${ax}" y="${yv(5.5)}" width="430" height="${yv(3.9) - yv(5.5)}" fill="${COL.redLight}" opacity="0.45"/>`;
  b += text(540, yv(5.15), "PEO 会被氧化分解（约 > 4 V）", { size: 17, anchor: "end", weight: "bold", fill: COL.red });
  b += text(540, yv(0.5), "PEO 稳定（约 < 4 V）", { size: 17, anchor: "end", weight: "bold", fill: COL.teal });
  b += `<line x1="${ax}" y1="${yv(0) + 6}" x2="${ax}" y2="${yv(5.5)}" stroke="${COL.ink}" stroke-width="3"/>`;
  for (let v = 0; v <= 5; v++) {
    b += `<line x1="${ax - 8}" y1="${yv(v)}" x2="${ax}" y2="${yv(v)}" stroke="${COL.ink}" stroke-width="2"/>`;
    b += text(ax - 14, yv(v) + 6, `${v} V`, { size: 16, anchor: "end", fill: COL.text2 });
  }
  b += text(ax - 10, yv(5.5) - 12, "电位 vs Li/Li⁺", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
  const items = [
    { v: 4.7, t: "LiNi_{0.5}Mn_{1.5}O_{4}（≈4.7 V）", ok: false, c: COL.amber },
    { v: 4.2, t: "LiCoO_{2}（充到 ≈4.2 V）", ok: false, c: COL.amber },
    { v: 3.45, t: "LiFePO_{4}（≈3.4 V）", ok: true, c: COL.teal },
    { v: 0, t: "Li 金属（0 V）", ok: true, c: COL.purple },
  ];
  items.forEach((it) => {
    const y = yv(it.v);
    b += `<line x1="${ax}" y1="${y}" x2="${ax + 120}" y2="${y}" stroke="${it.c}" stroke-width="6" stroke-linecap="round"/>`;
    b += (it.ok ? check(ax + 145, y, 10) : cross(ax + 145, y, 9));
    b += text(ax + 170, y + 6 + (it.v === 0 ? -14 : 0), it.t, { size: 17, weight: "bold", fill: it.c });
  });
  return svg(W, H, b);
};

// ---------- Polymer / ceramic / polymer sandwich ----------
figs.sandwich = () => {
  const W = 780, H = 440;
  let b = "";
  const y0 = 40, h = 250;
  const cols = [
    { x: 30, w: 110, fill: "#B9C3CC", t: "Li 金属" },
    { x: 140, w: 120, fill: COL.tealLight, t: "聚合物" },
    { x: 260, w: 200, fill: SE_FILL, t: "陶瓷电解质" },
    { x: 460, w: 120, fill: COL.tealLight, t: "聚合物" },
    { x: 580, w: 170, fill: COL.amberLight, t: "正极" },
  ];
  cols.forEach((c) => {
    b += `<rect x="${c.x}" y="${y0}" width="${c.w}" height="${h}" fill="${c.fill}"/>`;
    b += text(c.x + c.w / 2, y0 + h + 30, c.t, { size: 18, anchor: "middle", weight: "bold" });
  });
  // Li+ passes all the way
  b += arrow(70, 100, 640, 100, { color: COL.purple, width: 3.5, head: 14 });
  [110, 200, 360, 520].forEach((x) => (b += ion(x, 100, { r: 11 })));
  b += check(360, 140, 11);
  // anions blocked at ceramic
  const an = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="${COL.red}"/>` + text(x, y + 6, "−", { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  [[180, 200], [215, 235], [240, 180], [500, 210], [490, 250]].forEach(([x, y]) => (b += an(x, y)));
  b += cross(268, 210, 11) + cross(452, 225, 11);
  b += text(360, 222, "阴离子过不去", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  // annotations
  b += lines(30, 375, ["聚合物：柔软，贴紧电极", "→ 界面电阻小"], { size: 17, fill: COL.teal, weight: "bold", lh: 24 });
  b += lines(400, 375, ["陶瓷：只让 Li⁺ 通过，挡住阴离子", "→ 电极表面的双电层电场更弱"], { size: 17, fill: COL.ink, weight: "bold", lh: 24 });
  return svg(W, H, b);
};

// ---------- Problem → strategy map ----------
figs.strategy_map = () => {
  const W = 1200, H = 480;
  let b = "";
  const rows = [
    ["点接触、界面电阻大", "软的电解质；冷压 / 加压；弹性或含液中间层", COL.amber],
    ["空间电荷层", "LiNbO_{3}、Li_{4}Ti_{5}O_{12} 等缓冲包覆层", COL.purple],
    ["界面化学 / 电化学反应", "选电化学窗口匹配的电解质 + 表面包覆", COL.red],
    ["体积变化与应力", "低模量电解质；研究电极内部的应变", COL.teal],
    ["锂枝晶", "高模量电解质；给锂负极加保护层", COL.siDark],
  ];
  b += text(200, 32, "问题", { size: 22, anchor: "middle", weight: "bold" });
  b += text(780, 32, "对策（原文 + 引文中的做法）", { size: 22, anchor: "middle", weight: "bold" });
  rows.forEach(([p, s, c], i) => {
    const y = 56 + i * 82;
    b += `<rect x="20" y="${y}" width="360" height="62" rx="31" fill="${c}"/>`;
    b += text(200, y + 39, p, { size: 21, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += arrow(392, y + 31, 452, y + 31, { color: c, width: 4, head: 15 });
    b += `<rect x="466" y="${y}" width="714" height="62" rx="14" fill="#F5F7F9" stroke="${c}" stroke-width="2.5"/>`;
    b += text(490, y + 39, s, { size: 20, fill: COL.ink });
  });
  return svg(W, H, b);
};

module.exports = figs;
