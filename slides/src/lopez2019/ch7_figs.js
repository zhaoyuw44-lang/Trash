// Figures for Lopez et al. 2019, Chapter 7 (Designing polymers for safety + Conclusion and outlook)
// Canvas widths are ~100 px per inch of slide area; text ≥ 17 px.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const dash = (x1, y1, x2, y2, c = COL.ink, w = 2.5, da = "6 5") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-dasharray="${da}"/>`;
function flame(x, y, s, c1 = COL.red, c2 = COL.amber) {
  const p = (k) => (v) => (v * k).toFixed(1);
  const k = s / 100;
  return `<path d="M${x},${y} C${x - 45 * k},${y - 20 * k} ${x - 40 * k},${y - 70 * k} ${x - 5 * k},${y - 110 * k} C${x - 5 * k},${y - 80 * k} ${x + 15 * k},${y - 75 * k} ${x + 15 * k},${y - 95 * k} C${x + 45 * k},${y - 60 * k} ${x + 45 * k},${y - 20 * k} ${x},${y} Z" fill="${c1}"/>` +
    `<path d="M${x},${y} C${x - 22 * k},${y - 10 * k} ${x - 20 * k},${y - 40 * k} ${x},${y - 62 * k} C${x + 20 * k},${y - 40 * k} ${x + 22 * k},${y - 10 * k} ${x},${y} Z" fill="${c2}"/>`;
}

// ---------- Title motif: thermometer + tri-layer separator ----------
figs.title_motif = () => {
  const W = 520, H = 560;
  let b = "";
  // thermometer
  b += `<rect x="70" y="70" width="44" height="330" rx="22" fill="none" stroke="#FFFFFF" stroke-width="7"/>`;
  b += `<circle cx="92" cy="430" r="44" fill="${COL.red}" stroke="#FFFFFF" stroke-width="7"/>`;
  b += `<rect x="83" y="190" width="18" height="230" fill="${COL.red}"/>`;
  [130, 180, 230, 280, 330].forEach((y) => (b += `<line x1="118" y1="${y}" x2="138" y2="${y}" stroke="#FFFFFF" stroke-width="4"/>`));
  // tri-layer separator
  const layers = [[180, COL.purpleLight], [240, "#FFFFFF"], [300, COL.purpleLight]];
  layers.forEach(([y, c]) => (b += `<rect x="190" y="${y}" width="280" height="50" rx="10" fill="${c}" opacity="0.92"/>`));
  for (let i = 0; i < 6; i++) b += `<rect x="${210 + i * 44}" y="252" width="22" height="26" rx="6" fill="${COL.dk || "#1D2B3A"}" opacity="0.35"/>`;
  // shield
  b += `<path d="M330,380 C390,395 430,420 430,460 C430,510 380,540 330,555 C280,540 230,510 230,460 C230,420 270,395 330,380 Z" fill="none" stroke="${COL.tealLight}" stroke-width="8"/>`;
  b += `<polyline points="295,465 322,495 370,440" fill="none" stroke="${COL.tealLight}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  b += flame(400, 150, 70);
  b += `<line x1="350" y1="60" x2="450" y2="160" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>`;
  return svg(W, H, b);
};

// ---------- Safety timeline ----------
figs.safety_timeline = () => {
  const W = 1240, H = 420;
  const R = COL.red, T = COL.teal, A = COL.amber;
  const ev = [
    { year: "1989", who: ["Moli Energy"], what: ["Li 金属电池", "起火召回"], color: R },
    { year: "1990s", who: ["Celgard 等"], what: ["PP/PE/PP", "三层闭孔隔膜"], color: T },
    { year: "2006", who: ["Sony"], what: ["笔记本电池", "大规模召回"], color: R },
    { year: "2013", who: ["Boeing 787"], what: ["电池起火", "机队停飞"], color: R },
    { year: "2014", who: ["Wong 等"], what: ["PFPE", "不燃电解液"], color: A },
    { year: "2016", who: ["Chen, Bao 等"], what: ["可逆热响应", "高分子开关"], color: T },
    { year: "2016", who: ["Samsung"], what: ["Galaxy Note 7", "起火召回"], color: R },
    { year: "2017", who: ["Liu, Cui 等"], what: ["核壳纤维", "阻燃隔膜"], color: A },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 90, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Thermal runaway ladder ----------
figs.runaway = () => {
  const W = 720, H = 480;
  let b = "";
  const y = (T) => 440 - (T - 20) * 1.38; // 20..300 °C
  // thermometer bar
  const steps = [[20, 60, COL.tealLight], [60, 120, COL.sulfurLight], [120, 160, COL.amberLight], [160, 200, COL.redLight], [200, 300, COL.red]];
  steps.forEach(([a, c, col]) => (b += `<rect x="60" y="${y(c)}" width="44" height="${y(a) - y(c)}" fill="${col}"/>`));
  b += `<rect x="60" y="${y(300)}" width="44" height="${y(20) - y(300)}" fill="none" stroke="${COL.ink}" stroke-width="3" rx="6"/>`;
  [50, 100, 150, 200, 250, 300].forEach((T) => {
    b += `<line x1="104" y1="${y(T)}" x2="114" y2="${y(T)}" stroke="${COL.ink}" stroke-width="2"/>`;
    b += text(52, y(T) + 6, `${T}`, { size: 17, anchor: "end", fill: COL.text2 });
  });
  b += text(30, y(300) - 16, "温度 °C", { size: 17, weight: "bold", fill: COL.text2 });
  const ev = [
    [40, "正常工作", "", COL.teal],
    [100, "SEI 分解放热（约 80–120 °C）", "", "#A67C00"],
    [130, "PE 熔化 → 闭孔（安全阀）", "", COL.teal],
    [165, "PP 也熔化 → 内部短路", "", COL.red],
    [220, "正极分解放出 O_{2}（约 200 °C 起）", "", COL.red],
    [280, "电解液燃烧、起火", "", COL.red],
  ];
  ev.forEach(([T, a, s, c]) => {
    b += `<line x1="114" y1="${y(T)}" x2="160" y2="${y(T)}" stroke="${c}" stroke-width="3"/>`;
    b += `<circle cx="114" cy="${y(T)}" r="6" fill="${c}"/>`;
    b += text(170, y(T) + 2, a, { size: 18, weight: "bold", fill: c });
    if (s) b += text(170, y(T) + 26, s, { size: 17, fill: COL.text2 });
  });
  // feedback loop
  const cx = 630, cy = 150, r = 58;
  b += `<path d="M${cx + r},${cy} A${r},${r} 0 1 1 ${cx},${cy - r}" fill="none" stroke="${COL.red}" stroke-width="5"/>` + head(cx + 2, cy - r, 0, COL.red, 16);
  b += lines(cx, cy - 6, ["放热 ↑", "温度 ↑"], { size: 18, anchor: "middle", weight: "bold", fill: COL.red, lh: 26 });
  b += lines(cx, cy + r + 34, ["正反馈：", "越热反应越快"], { size: 17, anchor: "middle", fill: COL.red, weight: "bold", lh: 22 });
  b += flame(630, 420, 80);
  return svg(W, H, b);
};

// ---------- Chain packing & melting point ----------
figs.chain_packing = () => {
  const W = 720, H = 450;
  let b = "";
  const R = rng(12);
  b += `<rect x="0" y="0" width="350" height="380" rx="16" fill="#F5F7F9"/>`;
  b += `<rect x="370" y="0" width="350" height="380" rx="16" fill="#F5F7F9"/>`;
  b += text(175, 36, "支化多：链堆不紧", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(545, 36, "线形、规整：易结晶", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
  // branched random chains
  const starts = [[50, 90], [180, 80], [60, 210], [200, 200], [90, 320], [230, 310]];
  for (let k = 0; k < 6; k++) {
    let [x, yy] = starts[k];
    let d = `M${x.toFixed(1)},${yy.toFixed(1)}`;
    const pts = [];
    for (let i = 0; i < 9; i++) {
      x += 10 + R() * 8; yy += (R() - 0.5) * 50;
      x = Math.max(25, Math.min(325, x)); yy = Math.max(65, Math.min(355, yy));
      d += ` L${x.toFixed(1)},${yy.toFixed(1)}`;
      pts.push([x, yy]);
    }
    b += `<path d="${d}" fill="none" stroke="${COL.siDark}" stroke-width="4" stroke-linejoin="round"/>`;
    pts.filter((_, i) => i % 3 === 1).forEach(([px, py]) => (b += `<line x1="${px.toFixed(1)}" y1="${py.toFixed(1)}" x2="${(px + 18).toFixed(1)}" y2="${(py - 16).toFixed(1)}" stroke="${COL.red}" stroke-width="4" stroke-linecap="round"/>`));
  }
  // lamella: folded parallel chains
  for (let k = 0; k < 9; k++) {
    const x = 415 + k * 30;
    let d = `M${x},80`;
    for (let i = 1; i <= 12; i++) d += ` L${x + (i % 2 ? 8 : 0)},${80 + i * 22}`;
    b += `<path d="${d}" fill="none" stroke="${COL.teal}" stroke-width="4" stroke-linejoin="round"/>`;
    if (k < 8) b += `<path d="M${x},${80} Q${x + 15},${62} ${x + 30},80" fill="none" stroke="${COL.teal}" stroke-width="4"/>`;
  }
  b += text(175, 420, "如 LDPE：熔点 ≈ 110 °C", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(545, 420, "如 HDPE ≈ 135 °C；等规 PP ≈ 165 °C", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- Fig. 8a tri-layer shutdown separator ----------
figs.trilayer = () => {
  const W = 760, H = 470;
  let b = "";
  const x0 = 20, cw = 205, top = 60;
  const st = [
    ["< 130 °C", "正常工作", COL.teal],
    ["> 130 °C", "闭孔关断", COL.amber],
    ["> 165 °C", "短路", COL.red],
  ];
  st.forEach(([T, name, c], k) => {
    const x = x0 + k * (cw + 10);
    b += text(x + cw / 2, 34, T, { size: 20, anchor: "middle", weight: "bold", fill: c });
    b += `<rect x="${x}" y="${top}" width="${cw}" height="110" fill="${COL.amberLight}"/>`;
    b += text(x + cw / 2, top + 30, "正极", { size: 17, anchor: "middle", weight: "bold" });
    // separator layers
    const sy = top + 110;
    const ppMelt = k === 2, peMelt = k >= 1;
    b += `<rect x="${x}" y="${sy}" width="${cw}" height="22" fill="${ppMelt ? COL.redLight : COL.purpleLight}"/>`;
    b += `<rect x="${x}" y="${sy + 22}" width="${cw}" height="22" fill="${peMelt ? COL.amber : "#FFFFFF"}"/>`;
    b += `<rect x="${x}" y="${sy + 44}" width="${cw}" height="22" fill="${ppMelt ? COL.redLight : COL.purpleLight}"/>`;
    if (!peMelt) for (let i = 0; i < 6; i++) b += `<rect x="${x + 12 + i * 33}" y="${sy + 3}" width="12" height="60" fill="${COL.electrolyte}"/>`;
    if (k === 1) for (let i = 0; i < 6; i++) { b += `<rect x="${x + 12 + i * 33}" y="${sy + 3}" width="12" height="16" fill="${COL.electrolyte}"/>`; b += `<rect x="${x + 12 + i * 33}" y="${sy + 47}" width="12" height="16" fill="${COL.electrolyte}"/>`; }
    b += `<rect x="${x}" y="${sy + 66}" width="${cw}" height="110" fill="#7D8893"/>`;
    b += text(x + cw / 2, sy + 150, "负极", { size: 17, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    // arrows: Li+ (left) and e- (right)
    const lx = x + 60, ex = x + 145;
    const ok = (xx, pass, col) => (pass ? arrow(xx, sy + 100, xx, sy - 50, { color: col, width: 3.5, head: 13 }) : arrow(xx, sy + 100, xx, sy + 40, { color: col, width: 3.5, head: 13 }) + cross(xx, sy + 28, 10));
    b += ok(lx, k !== 1, COL.purple) + ok(ex, k === 2, COL.amber);
    b += ion(lx, sy + 120, { r: 15 });
    b += electron(ex, sy + 120, 17);
    b += text(x + cw / 2, top + 330, name, { size: 19, anchor: "middle", weight: "bold", fill: c });
  });
  b += text(x0, H - 50, "紫 / 白 / 紫 = PP / PE / PP；橙 = 熔化的 PE（堵孔）；粉 = 熔化的 PP", { size: 17, fill: COL.text2 });
  b += text(x0, H - 20, "PE 熔点 ≈ 130 °C，PP 熔点 ≈ 165 °C", { size: 17, fill: COL.text2, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Fig. 8b high-thermal-stability separator polymers ----------
figs.sep_polymers = () => {
  const W = 1230, H = 240;
  let b = "";
  const cards = [
    ["聚对苯二甲酸丁二醇酯 PBT", "芳香聚酯：苯环让链变硬", "熔点约 225 °C", COL.amber],
    ["纤维素 Cellulose", "葡萄糖环 + 大量 –OH，强氢键", "不熔化，约 300 °C 才分解", COL.teal],
    ["聚酰亚胺 Polyimide", "芳香酰亚胺环，刚性主链", "不熔化，可耐 400 °C 左右", COL.purple],
  ];
  cards.forEach(([n, a, t, c], i) => {
    const x = i * 415;
    b += `<rect x="${x}" y="0" width="400" height="${H}" rx="16" fill="#F5F7F9"/>`;
    b += `<rect x="${x}" y="0" width="12" height="${H}" rx="6" fill="${c}"/>`;
    b += text(x + 32, 50, n, { size: 21, weight: "bold", fill: c });
    b += text(x + 32, 120, a, { size: 18, fill: COL.ink });
    b += text(x + 32, 180, t, { size: 19, weight: "bold", fill: COL.ink });
  });
  return svg(W, H, b);
};

// ---------- Fig. 8c thermoresponsive PTC composite ----------
figs.ptc_switch = () => {
  const W = 760, H = 515;
  let b = "";
  const panel = (X, expanded) => {
    let s = `<rect x="${X}" y="40" width="300" height="34" fill="${COL.purpleLight}"/>`;
    s += `<rect x="${X}" y="${expanded ? 74 : 74}" width="300" height="${expanded ? 150 : 120}" fill="#E3E8EC"/>`;
    s += `<rect x="${X}" y="${expanded ? 224 : 194}" width="300" height="30" fill="${COL.copper}"/>`;
    const R = rng(expanded ? 9 : 9);
    const pts = [];
    for (let i = 0; i < 22; i++) {
      const u = R(), v = R();
      pts.push([X + 15 + u * 270, 84 + v * (expanded ? 130 : 100)]);
    }
    pts.forEach(([x, y]) => (s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${expanded ? 8 : 11}" fill="${COL.siDark}" stroke="#2B2F33" stroke-width="2"/>`));
    if (!expanded) {
      [[40, 194, 60, 74], [130, 194, 120, 74], [210, 194, 235, 74]].forEach(([x1, y1, x2, y2]) => (s += `<path d="M${X + x1},${y1} C${X + x1 + 30},${y1 - 50} ${X + x2 - 30},${y2 + 50} ${X + x2},${y2}" fill="none" stroke="${COL.red}" stroke-width="4"/>` + head(X + x2, y2, -Math.PI / 2, COL.red, 12)));
    } else {
      [[50, 224], [150, 224], [240, 224]].forEach(([x1, y1]) => {
        s += `<path d="M${X + x1},${y1} C${X + x1 + 10},${y1 - 30} ${X + x1 + 20},${y1 - 40} ${X + x1 + 30},${y1 - 60}" fill="none" stroke="${COL.red}" stroke-width="4"/>`;
        s += cross(X + x1 + 34, y1 - 68, 9);
      });
    }
    return s;
  };
  b += text(160, 26, "正常工作：Ni 颗粒连成通路", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(600, 26, "受热膨胀：颗粒被拉开", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += panel(10, false) + panel(450, true);
  b += arrow(325, 120, 430, 120, { color: COL.ink, width: 3, head: 12 }) + arrow(430, 160, 325, 160, { color: COL.ink, width: 3, head: 12 });
  b += text(378, 106, "加热", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(378, 190, "冷却恢复", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  // R-T curve
  const gx = 90, gy = 470, gw = 600, gh = 170;
  b += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" stroke="${COL.ink}" stroke-width="3"/>` + head(gx + gw + 10, gy, 0, COL.ink, 12);
  b += `<line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" stroke="${COL.ink}" stroke-width="3"/>` + head(gx, gy - gh - 10, -Math.PI / 2, COL.ink, 12);
  b += `<g transform="translate(${gx - 18} ${gy - gh / 2}) rotate(-90)">` + text(0, 0, "电阻", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  b += text(gx + gw, gy + 26, "温度", { size: 18, anchor: "end", weight: "bold" });
  const curve = (T, c, da) => `<polyline points="${gx + 10},${gy - 20} ${T - 6},${gy - 20} ${T + 6},${gy - gh + 20} ${gx + gw - 10},${gy - gh + 20}" fill="none" stroke="${c}" stroke-width="4"${da ? ` stroke-dasharray="${da}"` : ""}/>`;
  b += curve(gx + 180, COL.amber, "8 6") + curve(gx + 300, COL.red) + curve(gx + 420, COL.purple, "8 6");
  b += text(gx + 170, gy - gh + 10, "Ni 少：关断早", { size: 18, anchor: "end", fill: COL.amber, weight: "bold" });
  b += text(gx + 430, gy - 34, "Ni 多：关断晚", { size: 18, fill: COL.purple, weight: "bold" });
  b += text(gx + 300, gy + 26, "T_{shutdown}", { size: 18, anchor: "middle", fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Percolation curve ----------
figs.percolation = () => {
  const W = 620, H = 430;
  let b = "";
  const x0 = 80, y0 = 360, w = 500, h = 300;
  b += `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" stroke="${COL.ink}" stroke-width="3"/>` + head(x0 + w + 10, y0, 0, COL.ink, 12);
  b += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h}" stroke="${COL.ink}" stroke-width="3"/>` + head(x0, y0 - h - 10, -Math.PI / 2, COL.ink, 12);
  b += text(x0 + w / 2, y0 + 40, "导电颗粒的体积分数 φ", { size: 18, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(${x0 - 30} ${y0 - h / 2}) rotate(-90)">` + text(0, 0, "电导率（对数）", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  const xc = x0 + 230;
  let d = "";
  for (let i = 0; i <= 100; i++) {
    const x = x0 + (i / 100) * w;
    const yy = y0 - 30 - (h - 60) / (1 + Math.exp(-(x - xc) / 18));
    d += (i ? " L" : "M") + `${x.toFixed(1)},${yy.toFixed(1)}`;
  }
  b += `<path d="${d}" fill="none" stroke="${COL.ink}" stroke-width="4"/>`;
  b += dash(xc, y0, xc, y0 - h + 10, COL.muted, 2.5);
  b += text(xc, y0 + 18, "φ_{c}", { size: 18, anchor: "middle", fill: COL.text2, weight: "bold" });
  b += text(xc + 10, y0 - h + 8, "渗流阈值", { size: 17, fill: COL.text2, weight: "bold" });
  const ax = xc + 70, bx = xc - 70;
  const yA = y0 - 30 - (h - 60) / (1 + Math.exp(-(ax - xc) / 18));
  const yB = y0 - 30 - (h - 60) / (1 + Math.exp(-(bx - xc) / 18));
  b += `<circle cx="${ax}" cy="${yA}" r="11" fill="${COL.teal}"/>` + text(ax + 16, yA + 34, "正常：导通", { size: 17, weight: "bold", fill: COL.teal });
  b += `<circle cx="${bx}" cy="${yB}" r="11" fill="${COL.red}"/>` + text(bx - 14, yB - 18, "受热：断开", { size: 17, anchor: "end", weight: "bold", fill: COL.red });
  b += `<path d="M${ax - 8},${yA - 14} Q${xc},${yA - 40} ${bx + 12},${yB - 18}" fill="none" stroke="${COL.red}" stroke-width="3" stroke-dasharray="7 5"/>` + head(bx + 12, yB - 18, Math.PI * 0.62, COL.red, 13);
  b += lines(xc + 60, 250, ["高分子膨胀", "→ 有效 φ 变小"], { size: 17, fill: COL.red, weight: "bold", lh: 22 });
  return svg(W, H, b);
};

// ---------- LCST phase diagram ----------
figs.lcst = () => {
  const W = 700, H = 450;
  let b = "";
  const x0 = 80, y0 = 380, w = 360, h = 320;
  b += `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" stroke="${COL.ink}" stroke-width="3"/>` + head(x0 + w + 10, y0, 0, COL.ink, 12);
  b += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h}" stroke="${COL.ink}" stroke-width="3"/>` + head(x0, y0 - h - 10, -Math.PI / 2, COL.ink, 12);
  b += text(x0 + w / 2, y0 + 36, "高分子含量 →", { size: 18, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(${x0 - 30} ${y0 - h / 2}) rotate(-90)">` + text(0, 0, "温度 →", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  const top = y0 - h + 10;
  let d = "";
  // simpler: draw explicit parabola-like U
  const U = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const x = x0 + 20 + t * (w - 40);
    const yy = y0 - 120 - 190 * Math.pow((t - 0.4) / 0.6, 2) * (t < 0.4 ? 2.7 : 1);
    U.push([x, Math.max(top, yy)]);
  }
  d = U.map(([x, yy], i) => `${i ? "L" : "M"}${x.toFixed(1)},${yy.toFixed(1)}`).join(" ");
  b += `<path d="${d} L${U[U.length - 1][0]},${top} L${U[0][0]},${top} Z" fill="${COL.redLight}" opacity="0.6"/>`;
  b += `<path d="${d}" fill="none" stroke="${COL.red}" stroke-width="4"/>`;
  const mx = x0 + 20 + 0.4 * (w - 40), my = y0 - 120;
  b += `<circle cx="${mx}" cy="${my}" r="8" fill="${COL.red}"/>`;
  b += text(mx - 14, my + 32, "LCST", { size: 18, anchor: "end", weight: "bold", fill: COL.red });
  b += text(x0 + w / 2 + 40, top + 40, "分相（两相）", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(x0 + 110, y0 - 30, "互溶（一相）", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  // heating path
  b += arrow(mx + 70, y0 - 50, mx + 70, top + 70, { color: COL.amber, width: 4, head: 14 });
  b += text(mx + 82, y0 - 70, "电池升温", { size: 17, weight: "bold", fill: COL.amber });
  // insets
  const ix = 480;
  b += `<rect x="${ix}" y="40" width="200" height="150" rx="14" fill="#FBEDEC"/>`;
  const R = rng(3);
  [[540, 100], [620, 140], [560, 160]].forEach(([x, yy]) => (b += `<circle cx="${x}" cy="${yy}" r="${26 + R() * 8}" fill="${COL.purpleLight}"/>`));
  b += text(ix + 100, 30, "高温：析出 / 凝胶", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += `<rect x="${ix}" y="240" width="200" height="150" rx="14" fill="#E8F4F3"/>`;
  for (let k = 0; k < 5; k++) {
    let p = `M${ix + 20 + R() * 40},${260 + k * 26}`;
    for (let i = 1; i < 8; i++) p += ` L${ix + 20 + i * 22},${260 + k * 26 + (R() - 0.5) * 18}`;
    b += `<path d="${p}" fill="none" stroke="${COL.purple}" stroke-width="3"/>`;
  }
  b += text(ix + 100, 418, "常温：溶解，导离子", { size: 17, anchor: "middle", weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- Comparison table of thermal mechanisms ----------
figs.compare = () => {
  const W = 1230, H = 400;
  let b = "";
  const cols = [["机制", 260], ["触发温度", 220], ["可逆？", 140], ["能完全关断？", 190], ["主要局限", 420]];
  const rows = [
    ["熔化闭孔隔膜", "≈ 130 °C（PE 熔点）", "否", "是", "> 165 °C PP 也熔化 → 短路"],
    ["高热稳定隔膜", "—", "—", "不关断", "只防短路，本身不切断电流"],
    ["外置 PTC 元件", "依器件而定", "是", "是", "离热源远，热失控太快时来不及"],
    ["内置 PTC 复合物", "50–100 °C 可调", "是", "是", "需在集流体上多加一层"],
    ["LCST 电解质", "由溶液体系决定", "是", "否", "只降低电导，电池仍在工作"],
  ];
  let x = 0;
  const xs = cols.map(([, w]) => { const r = x; x += w; return r; });
  b += `<rect x="0" y="0" width="${W}" height="56" rx="10" fill="${COL.ink}"/>`;
  cols.forEach(([n, w], j) => (b += text(xs[j] + 18, 37, n, { size: 19, weight: "bold", fill: "#FFFFFF" })));
  rows.forEach((r, i) => {
    const y = 56 + i * 68;
    if (i % 2 === 0) b += `<rect x="0" y="${y}" width="${W}" height="68" fill="#F5F7F9"/>`;
    r.forEach((c, j) => {
      let col = COL.ink;
      if ((j === 2 || j === 3) && (c === "是")) col = COL.teal;
      if ((j === 2 || j === 3) && (c === "否" || c === "不关断")) col = COL.red;
      b += text(xs[j] + 18, y + 42, c, { size: 18, weight: j === 0 ? "bold" : "normal", fill: col });
    });
  });
  return svg(W, H, b);
};

// ---------- Flame-retardant principles ----------
figs.fr_principles = () => {
  const W = 720, H = 460;
  let b = "";
  const A = [200, 60], B = [40, 340], C = [360, 340];
  b += `<polygon points="${A.join(",")} ${B.join(",")} ${C.join(",")}" fill="#FBEDEC" stroke="${COL.red}" stroke-width="5" stroke-linejoin="round"/>`;
  b += flame(200, 290, 110);
  b += text(200, 44, "热量", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(40, 376, "可燃物", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(360, 376, "氧气", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(200, 420, "燃烧三要素：拿掉任何一个，火就灭", { size: 17, anchor: "middle", fill: COL.text2 });
  // strategies
  const S = [
    ["① 成炭隔热", "稠环、芳香结构、磷系", "受热成炭，挡住热和可燃气体", COL.teal],
    ["② 气相灭自由基", "卤素、磷系基团", "捕捉火焰中的 H·、OH·", COL.purple],
    ["③ 本身不燃", "高度氟化（如 PFPE）", "C–F 键很稳，难以燃烧", COL.amber],
  ];
  S.forEach(([h, a, c, col], i) => {
    const y = 40 + i * 132;
    b += `<rect x="420" y="${y}" width="300" height="118" rx="14" fill="#F5F7F9"/>`;
    b += `<rect x="420" y="${y}" width="10" height="118" rx="5" fill="${col}"/>`;
    b += text(442, y + 34, h, { size: 19, weight: "bold", fill: col });
    b += text(442, y + 66, a, { size: 17, fill: COL.ink, weight: "bold" });
    b += text(442, y + 96, c, { size: 17, fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- Flame-retardant examples (Fig. 8d) ----------
figs.fr_examples = () => {
  const W = 720, H = 470;
  let b = "";
  const cards = [
    ["全氟聚醚 PFPE 电解液", "2014", "低聚物液体，不燃", "难点：锂盐不好溶", COL.amber],
    ["磷酸酯交联凝胶", "2018", "阻燃基团接在主链上", "吸满可燃电解液仍阻燃", COL.teal],
    ["核壳纤维隔膜", "2017", "TPP 包在 PVDF–HFP 里", "到熔点才释放阻燃剂", COL.purple],
    ["聚磷酸铵 APP 粘结剂", "2018", "用于 Li–S 正极", "降低整个电池的可燃性", COL.red],
  ];
  cards.forEach(([n, y, a, c, col], i) => {
    const x = (i % 2) * 365, yy = Math.floor(i / 2) * 240;
    b += `<rect x="${x}" y="${yy}" width="355" height="225" rx="16" fill="#F5F7F9"/>`;
    b += `<rect x="${x}" y="${yy}" width="355" height="54" rx="16" fill="${col}"/>`;
    b += `<rect x="${x}" y="${yy + 30}" width="355" height="24" fill="${col}"/>`;
    b += text(x + 20, yy + 36, n, { size: 19, weight: "bold", fill: "#FFFFFF" });
    b += text(x + 335, yy + 36, y, { size: 18, anchor: "end", weight: "bold", fill: "#FFFFFF" });
    b += text(x + 20, yy + 104, a, { size: 19, weight: "bold" });
    b += text(x + 20, yy + 146, c, { size: 18, fill: COL.text2 });
  });
  // core-shell icon on card 3
  const cx = 290, cy = 420;
  b += `<circle cx="${cx}" cy="${cy}" r="30" fill="${COL.purpleLight}"/><circle cx="${cx}" cy="${cy}" r="15" fill="${COL.amber}"/>`;
  b += text(cx - 42, cy + 6, "壳", { size: 18, anchor: "end", fill: COL.purple, weight: "bold" });
  // flame + phosphorus icon on card 4
  b += flame(660, 445, 50);
  b += cross(660, 418, 18, COL.ink, 5);
  return svg(W, H, b);
};

// ---------- Integration wheel ----------
figs.integration = () => {
  const W = 720, H = 480;
  let b = "";
  const cx = 360, cy = 240;
  const nodes = [
    ["2 力学", "模量、韧性、自修复", COL.purple],
    ["3 离子传输", "低 Tg、溶剂化、t_{+}", COL.teal],
    ["4 电子传输", "共轭主链、能级", COL.amber],
    ["5 化学作用", "N/O/S、氢键", "#A67C00"],
    ["6 稳定界面", "介电常数、表面能", COL.siDark],
    ["7 安全", "熔点、膨胀、阻燃", COL.red],
  ];
  nodes.forEach(([n, s, c], i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    const x = cx + 230 * Math.cos(a), y = cy + 175 * Math.sin(a);
    b += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c}" stroke-width="4"/>`;
    b += `<rect x="${(x - 110).toFixed(1)}" y="${(y - 36).toFixed(1)}" width="220" height="72" rx="14" fill="#FFFFFF" stroke="${c}" stroke-width="3"/>`;
    b += text(x, y - 6, n, { size: 19, anchor: "middle", weight: "bold", fill: c });
    b += text(x, y + 22, s, { size: 17, anchor: "middle", fill: COL.text2 });
  });
  b += `<circle cx="${cx}" cy="${cy}" r="70" fill="${COL.ink}"/>`;
  b += lines(cx, cy - 6, ["一个高分子", "同时调好"], { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF", lh: 26 });
  return svg(W, H, b);
};

// ---------- Three systems: final verdict ----------
figs.systems = () => {
  const W = 1230, H = 330;
  let b = "";
  const cols = [
    ["Si 负极", COL.siDark, "已有成功路线", COL.teal, ["多糖类高分子：弹性 +", "与 Si 表面的动态氢键", "→ 稳定便宜的微米 Si"]],
    ["Li 金属负极", COL.purple, "理想材料仍未弄清", COL.red, ["要同时设计力学、", "表面化学和离子传输", "（第 2、3、6 章）"]],
    ["S 正极", "#A67C00", "工具已有，待集成", COL.amber, ["导电高分子提高倍率；", "强结合高分子", "抓住多硫化物"]],
  ];
  cols.forEach(([n, c, tag, tc, ls], i) => {
    const x = i * 415;
    b += `<rect x="${x}" y="0" width="400" height="${H}" rx="16" fill="#F5F7F9"/>`;
    b += `<rect x="${x}" y="0" width="400" height="62" rx="16" fill="${c}"/>`;
    b += `<rect x="${x}" y="40" width="400" height="22" fill="${c}"/>`;
    b += text(x + 24, 42, n, { size: 23, weight: "bold", fill: "#FFFFFF" });
    b += pill(x + 24, 84, 220, 36, tc, tag, { size: 17 });
    b += lines(x + 24, 168, ls, { size: 19, fill: COL.ink, lh: 34 });
  });
  return svg(W, H, b);
};

// ---------- Outlook: challenges -> inspirations ----------
figs.outlook = () => {
  const W = 1230, H = 420;
  let b = "";
  b += text(190, 30, "三大挑战", { size: 22, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(900, 30, "可以借鉴的高分子新趋势", { size: 22, anchor: "middle", weight: "bold", fill: COL.teal });
  const ch = ["室温下快速传导 Li⁺", "进一步稳定高容量电极", "耐高电压正极的电化学稳定性"];
  ch.forEach((t, i) => {
    const y = 60 + i * 118;
    b += `<rect x="0" y="${y}" width="380" height="96" rx="14" fill="#FBEDEC"/>`;
    b += pill(18, y + 30, 36, 36, COL.red, String(i + 1), { size: 18 });
    b += text(70, y + 56, t, { size: 19, weight: "bold" });
  });
  const ins = [
    ["精确的序列控制", "得到结构明确的高分子（2018 精确磺化 PE）"],
    ["利用次级相互作用", "氢键、金属配位调控性能（2017–2018）"],
    ["可回收的化学", "可降解、可再生的热固性材料（2014）"],
    ["仿生结构", "贻贝、多肽等自然界的设计（2017）"],
  ];
  ins.forEach(([h, s], i) => {
    const y = 60 + i * 89;
    b += `<rect x="570" y="${y}" width="660" height="78" rx="14" fill="#E8F4F3"/>`;
    b += text(592, y + 32, h, { size: 19, weight: "bold", fill: COL.teal });
    b += text(592, y + 62, s, { size: 18, fill: COL.text2 });
  });
  b += arrow(400, 210, 550, 210, { color: COL.ink, width: 5, head: 20 });
  b += text(475, 190, "启发", { size: 18, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Design cheat-sheet ----------
figs.cheatsheet = () => {
  const W = 1230, H = 520;
  let b = "";
  const cols = [["章", 160], ["要解决的问题", 300], ["高分子设计旋钮", 400], ["代表例子", 370]];
  const rows = [
    ["2 力学", "Si 膨胀开裂；Li 枝晶", "弹性、交联、动态键（自修复）；模量", "自修复粘结剂、聚轮烷-PAA"],
    ["3 离子传输", "固态电解质导电慢", "低 Tg、无定形、溶剂化适中、t_{+} 高", "PEO 及其改性、单离子导体"],
    ["4 电子传输", "S、Si 导电差", "共轭主链定能级，侧链调溶解", "PEDOT、PANi、聚芴类粘结剂"],
    ["5 化学作用", "多硫化物溶出；粘不住 Si", "N/O/S 给电子基团；氢键", "吡啶高分子、PAA、海藻酸钠"],
    ["6 稳定界面", "SEI 不稳、Li 沉积差", "高介电常数 + 低表面能", "PDMS、PVDF、离聚物涂层"],
    ["7 安全", "热失控、起火", "熔点、热膨胀、LCST、阻燃基团", "三层隔膜、PTC 复合物、PFPE"],
  ];
  let x = 0;
  const xs = cols.map(([, w]) => { const r = x; x += w; return r; });
  b += `<rect x="0" y="0" width="${W}" height="56" rx="10" fill="${COL.ink}"/>`;
  cols.forEach(([n], j) => (b += text(xs[j] + 16, 37, n, { size: 19, weight: "bold", fill: "#FFFFFF" })));
  const cc = [COL.purple, COL.teal, COL.amber, "#A67C00", COL.siDark, COL.red];
  rows.forEach((r, i) => {
    const y = 56 + i * 76;
    if (i % 2 === 0) b += `<rect x="0" y="${y}" width="${W}" height="76" fill="#F5F7F9"/>`;
    r.forEach((c, j) => (b += text(xs[j] + 16, y + 46, c, { size: 18, weight: j === 0 ? "bold" : "normal", fill: j === 0 ? cc[i] : COL.ink })));
  });
  return svg(W, H, b);
};

module.exports = figs;
