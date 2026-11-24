// Figures for 锂电池制造 Chapter 6: 从扣式到软包：电芯组装、配比与放大
const L = require("../svglib");
const { COL, text, lines, arrow, cross, check, pill, svg, timeline, blob, rng } = L;

const figs = {};
const AN = COL.ink;          // anode (graphite) coating
const CA = "#AEB8C2";        // cathode (NMC) coating
const CU = COL.copper;
const AL = COL.si;
const SEP = "#7FB8E0";       // separator (light blue)

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circ = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const poly = (pts, c, w = 2, fill = "none") =>
  `<polyline points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
const ell = (cx, cy, rx, ry, fill, o = {}) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;

// Small Data Matrix-like code (deterministic pattern).
function dmc(x, y, s, seed = 7) {
  const R = rng(seed);
  const n = 6, c = s / n;
  let b = rect(x, y, s, s, COL.white, { stroke: COL.ink, sw: 1 });
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const edge = i === 0 || j === n - 1;
    if (edge || R() > 0.55) b += rect((x + i * c).toFixed(1), (y + j * c).toFixed(1), c.toFixed(1), c.toFixed(1), COL.ink);
  }
  return b;
}

// Double-sided electrode drawn horizontally: coating / foil / coating.
function hElectrode(x, y, w, kind, t = 6) {
  const coat = kind === "A" ? AN : CA;
  const foil = kind === "A" ? CU : AL;
  return rect(x, y, w, t, coat) + rect(x, y + t, w, 2.5, foil) + rect(x, y + t + 2.5, w, t, coat);
}

// ---------- 0. Title motif (dark background) ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  // coin cell
  const cx = 110, cy = 70;
  b += rect(cx - 80, cy, 160, 32, "#56636F") + ell(cx, cy + 32, 80, 24, "#56636F");
  b += ell(cx, cy, 80, 24, "#AEB8C2") + ell(cx, cy, 54, 15, "#C9D2DA");
  b += text(cx, cy + 92, "扣式电池", { size: 24, anchor: "middle", weight: "bold", fill: "#F6C58E" });
  b += text(cx, cy + 122, "约 4 mAh", { size: 21, anchor: "middle", fill: "#CADCE8" });
  b += arrow(205, 118, 248, 170, { color: "#F6C58E", width: 4, head: 16 });
  // pouch cell
  const px = 215, py = 220;
  b += rect(px + 40, py - 46, 22, 56, "#C9D2DA") + rect(px + 128, py - 46, 22, 56, "#D99A63");
  b += rect(px + 34, py - 14, 34, 12, "#F7E3A1") + rect(px + 122, py - 14, 34, 12, "#F7E3A1");
  b += rect(px, py, 190, 135, "#AEB8C2", { rx: 10 });
  b += rect(px + 14, py + 14, 162, 107, "#7C8B99", { rx: 6 });
  for (let i = 0; i < 6; i++) b += line(px + 24, py + 28 + i * 16, px + 166, py + 28 + i * 16, i % 2 ? "#C9D2DA" : "#1D2B3A", 5);
  b += text(px + 95, py + 172, "多层软包", { size: 24, anchor: "middle", weight: "bold", fill: "#9FD3CF" });
  b += text(px + 95, py + 200, "约 2 Ah", { size: 21, anchor: "middle", fill: "#CADCE8" });
  b += arrow(232, 432, 160, 452, { color: "#9FD3CF", width: 4, head: 16 });
  // coil (factory)
  b += circ(95, 470, 48, "#56636F") + circ(95, 470, 32, "#7C8B99") + circ(95, 470, 11, "#1D2B3A");
  b += text(95, 548, "量产", { size: 24, anchor: "middle", weight: "bold", fill: "#C9B8E8" });
  b += pill(195, 492, 225, 46, COL.amber, "N/P · 追溯 · 放大", { size: 20 });
  return svg(W, H, b);
};

// ---------- 1. History timeline ----------
figs.era_timeline = () => {
  const W = 1240, H = 430;
  const A = COL.amber, P = COL.purple, T = COL.teal;
  const ev = [
    { year: "1859", who: ["Planté"], what: ["铅酸极板", "要反复化成"], color: A },
    { year: "1947", who: ["Neumann"], what: ["密封镍镉", "负极多配"], color: P },
    { year: "1979", who: ["Peled"], what: ["提出", "SEI 模型"], color: A },
    { year: "1990", who: ["Fong & Dahn"], what: ["石墨首圈", "成膜损失"], color: A },
    { year: "1991", who: ["Sony"], what: ["卷绕式锂离子", "电池上市"], color: T },
    { year: "1996", who: ["Bellcore"], what: ["扁平塑料", "锂离子电池"], color: T },
    { year: "2014", who: ["Trask 等"], what: ["从扣式到", "400 mAh 软包"], color: T },
    { year: "2024", who: ["Sommer 等"], what: ["逐片追溯", "算每层 N/P"], color: P },
  ];
  let b = timeline(W, H, ev, { axisY: 205, left: 85, right: 1125, whoSize: 19, whatSize: 18, yearSize: 24 });
  b += pill(700, 395, 160, 30, A, "化成与 SEI", { size: 17 }) + pill(875, 395, 160, 30, P, "配比 N/P", { size: 17 }) + pill(1050, 395, 160, 30, T, "电芯结构", { size: 17 });
  return svg(W, H, b);
};

// ---------- 2. Coin cell vs multilayer pouch ----------
figs.coin_vs_pouch = () => {
  const W = 820, H = 540;
  let b = "";
  // --- left: coin cell cross-section ---
  b += text(180, 40, "扣式 CR2032", { size: 24, anchor: "middle", weight: "bold" });
  const x0 = 40, cw = 200;
  b += rect(x0, 130, cw, 150, "#EEF2F5", { rx: 12, stroke: AL, sw: 4 });       // case
  b += rect(x0 + 8, 116, cw - 16, 16, "#56636F", { rx: 6 });                   // cap
  // spring
  const spr = [];
  for (let i = 0; i <= 12; i++) spr.push([x0 + 30 + i * 11.7, i % 2 ? 150 : 168]);
  b += poly(spr, "#56636F", 3);
  b += rect(x0 + 22, 172, cw - 44, 12, "#7C8B99", { rx: 3 });                   // spacer
  b += rect(x0 + 34, 186, cw - 68, 16, COL.purple, { rx: 3 });                 // anode / Li
  b += rect(x0 + 18, 204, cw - 36, 6, SEP);                                    // separator
  b += rect(x0 + 40, 212, cw - 80, 18, CA, { rx: 3 }) + rect(x0 + 40, 230, cw - 80, 4, AL); // cathode
  const lab = [["垫片 + 弹簧", 168, 120], ["负极片", 194, 160], ["隔膜", 207, 200], ["正极片", 222, 240]];
  lab.forEach(([t, yl, yt]) => { b += poly([[x0 + cw - 30, yl], [255, yl], [262, yt - 7]], COL.muted, 1.5) + text(268, yt, t, { size: 19, fill: COL.text2 }); });
  b += lines(150, 345, ["1 对电极", "面积约 1.5 cm²", "容量约 4 mAh"], { size: 21, anchor: "middle", lh: 32 });
  // --- middle: scale arrow ---
  b += text(395, 395, "× 约 500", { size: 24, anchor: "middle", weight: "bold", fill: COL.amber });
  b += arrow(330, 415, 465, 415, { color: COL.amber, width: 4, head: 16 });
  // --- right: multilayer pouch cross-section ---
  b += text(630, 40, "多层软包（Sommer 2024）", { size: 24, anchor: "middle", weight: "bold" });
  const sx = 520, sw = 220, top = 92, pitch = 21;
  b += rect(sx - 22, top - 18, sw + 44, 11 * pitch + 30, "none", { rx: 14, stroke: AL, sw: 4 });
  // Z-folded separator
  const zp = [];
  for (let k = 0; k <= 11; k++) {
    const y = top - 6 + k * pitch;
    if (k % 2 === 0) zp.push([sx - 8, y], [sx + sw + 8, y]);
    else zp.push([sx + sw + 8, y], [sx - 8, y]);
  }
  b += poly(zp, SEP, 2.5);
  for (let i = 0; i < 11; i++) {
    const kind = i % 2 === 0 ? "A" : "C";
    const y = top + i * pitch - 1;
    const w = kind === "A" ? sw - 6 : sw - 20;
    b += hElectrode(sx + (sw - w) / 2, y, w, kind, 5);
    // foils to tabs: cathode foils go left, anode foils go right
    if (kind === "C") b += line(sx + (sw - w) / 2, y + 6, 472, top + 105, AL, 1.5);
    else b += line(sx + (sw - w) / 2 + w, y + 6, 790, top + 105, CU, 1.5);
  }
  b += rect(450, top + 98, 22, 16, AL) + rect(790, top + 98, 22, 16, CU);
  b += lines(630, 370, ["6 负极 + 5 正极（双面）", "面积约 740 cm²", "容量约 2 Ah"], { size: 21, anchor: "middle", lh: 32 });
  // legend
  const lg = [[AN, "负极涂层"], [CA, "正极涂层"], [SEP, "隔膜"]];
  lg.forEach(([c, t], i) => { b += rect(150 + i * 190, 490, 26, 22, c, { rx: 3 }) + text(184 + i * 190, 508, t, { size: 19, fill: COL.text2 }); });
  return svg(W, H, b);
};

// ---------- 3. Winding vs stacking vs Z-folding ----------
figs.assembly_methods = () => {
  const W = 1240, H = 400;
  let b = "";
  const cx = [210, 620, 1030];
  ["卷绕 Winding", "叠片 Stacking", "Z 形叠片 Z-folding"].forEach((t, i) => { b += text(cx[i], 36, t, { size: 25, anchor: "middle", weight: "bold" }); });
  // (a) winding: interleaved spirals
  const spiral = (off, c, w) => {
    const pts = [];
    for (let th = 0; th <= 5.2 * 2 * Math.PI; th += 0.08) {
      const r = 14 + (13 * (th + off)) / (2 * Math.PI);
      pts.push([cx[0] + r * Math.cos(th), 170 + r * Math.sin(th)]);
    }
    return poly(pts, c, w);
  };
  b += spiral(0, AN, 4.5) + spiral(Math.PI / 2, SEP, 1.8) + spiral(Math.PI, "#7C8B99", 4.5) + spiral(1.5 * Math.PI, SEP, 1.8);
  b += text(cx[0], 292, "长条电极 + 隔膜一起卷", { size: 18, anchor: "middle", fill: COL.text2 });
  // (b) stacking: discrete sheets
  const st = 92;
  for (let i = 0; i < 9; i++) {
    const y = st + 40 + i * 14;
    const kind = i % 2 === 0 ? "A" : "C";
    const w = kind === "A" ? 210 : 190;
    b += rect(cx[1] - 117, y - 3, 234, 2.5, SEP);
    b += rect(cx[1] - w / 2, y, w, 7, kind === "A" ? AN : CA);
  }
  b += rect(cx[1] - 117, st + 40 + 9 * 14 - 3, 234, 2.5, SEP);
  // sheet being placed
  b += rect(cx[1] - 95, st - 20, 190, 7, CA) + rect(cx[1] - 30, st - 40, 60, 16, "#56636F", { rx: 3 });
  b += arrow(cx[1], st - 10, cx[1], st + 26, { color: COL.amber, width: 3, head: 12 });
  b += text(cx[1] + 112, st - 18, "逐片取放", { size: 18, fill: COL.amber, weight: "bold" });
  b += text(cx[1], 292, "单张电极、单张隔膜交替堆", { size: 18, anchor: "middle", fill: COL.text2 });
  // (c) Z-folding
  const zx0 = cx[2] - 115, zx1 = cx[2] + 115, zt = 92, zp = 20;
  const pts = [];
  for (let k = 0; k <= 9; k++) {
    const y = zt + k * zp;
    if (k % 2 === 0) pts.push([zx0, y], [zx1, y]); else pts.push([zx1, y], [zx0, y]);
  }
  b += poly(pts, SEP, 3);
  for (let k = 0; k < 9; k++) {
    const y = zt + k * zp + 6;
    const kind = k % 2 === 0 ? "A" : "C";
    // pocket opens on the side opposite to the fold
    const w = kind === "A" ? 196 : 180;
    const x = k % 2 === 0 ? zx0 + 4 : zx1 - 4 - w;
    b += rect(x, y, w, 8, kind === "A" ? AN : CA);
  }
  b += arrow(zx0 - 70, zt + 10, zx0 - 36, zt + 10, { color: COL.amber, width: 3, head: 11 });
  b += arrow(zx1 + 70, zt + 30, zx1 + 36, zt + 30, { color: COL.amber, width: 3, head: 11 });
  b += text(cx[2], 292, "隔膜连续折成“之”字，电极插进去", { size: 18, anchor: "middle", fill: COL.text2 });
  // pros / cons
  const pc = [
    ["连续、快、对齐好", "厚电极弯折易开裂"],
    ["受力均匀，可用厚电极", "逐片取放，速度慢"],
    ["隔膜连续，不易错位短路", "电极仍要逐片放"],
  ];
  pc.forEach(([p, c], i) => {
    const x = cx[i] - 130;
    b += check(x, 330, 9) + text(x + 20, 337, p, { size: 19 });
    b += cross(x, 370, 7, COL.red, 3.5) + text(x + 20, 377, c, { size: 19 });
  });
  return svg(W, H, b);
};

// ---------- 4. Pouch cell anatomy ----------
figs.pouch_exploded = () => {
  const W = 820, H = 540;
  let b = "";
  const ox = 40, oy = 130, ow = 330, oh = 300;
  // gas bag
  b += rect(ox + ow, oy, 130, oh, "#F5F7F9", { stroke: AL, sw: 3, dash: "10 6" });
  b += lines(ox + ow + 65, oy + 130, ["气袋", "化成后", "切掉"], { size: 19, anchor: "middle", fill: COL.text2, lh: 27 });
  // pouch body
  b += rect(ox, oy, ow, oh, COL.light, { stroke: AL, sw: 3 });
  // seals
  b += rect(ox, oy, ow, 30, COL.tealLight, { opacity: 0.8 }) + rect(ox, oy + oh - 26, ow, 26, COL.tealLight, { opacity: 0.8 }) + rect(ox, oy, 26, oh, COL.tealLight, { opacity: 0.8 });
  b += rect(ox + ow + 104, oy, 26, oh, COL.amberLight, { opacity: 0.9 });
  // stack: anode slightly larger than cathode
  b += rect(ox + 52, oy + 58, 250, 200, AN, { rx: 4 });
  b += rect(ox + 62, oy + 68, 230, 180, "#7C8B99", { rx: 3, stroke: CA, sw: 2, dash: "8 5" });
  b += text(ox + 177, oy + 165, "电芯叠片", { size: 20, anchor: "middle", fill: COL.white, weight: "bold" });
  // tabs
  const tabs = [[ox + 80, CA, "正极耳 Al"], [ox + 210, CU, "负极耳 Ni/Cu"]];
  tabs.forEach(([x, c, t]) => {
    b += rect(x, 62, 40, 140, c);
    b += rect(x - 12, oy - 8, 64, 30, COL.sulfur, { opacity: 0.85 });
    b += rect(x - 4, oy + 46, 48, 14, "#56636F", { opacity: 0.6 });
    b += text(x + 20, 54, t, { size: 19, anchor: "middle", weight: "bold" });
  });
  // leaders
  b += line(98, 108, 112, 124, COL.text2, 1.5) + text(96, 106, "极耳胶", { size: 19, anchor: "end", fill: COL.text2 });
  b += text(ox + 165, oy + oh + 36, "青色：先封三边 · 橙色：注液后封口", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(ox + 177, oy + oh + 66, "深灰：超声焊接区（多层箔并成 1 个极耳）", { size: 19, anchor: "middle", fill: COL.text2 });
  // film cross-section (right)
  const fx = 560;
  b += text(fx + 120, 160, "铝塑膜截面", { size: 22, anchor: "middle", weight: "bold" });
  const layers = [[COL.purpleLight, "尼龙 外层", 28], [CA, "铝箔 阻水", 34], [COL.amberLight, "PP 热封层", 30]];
  let yy = 180;
  layers.forEach(([c, t, h]) => {
    b += rect(fx, yy, 90, h, c, { stroke: COL.white, sw: 1 });
    b += text(fx + 100, yy + h / 2 + 7, t, { size: 19 });
    yy += h;
  });
  // heat sealing
  b += text(fx + 120, 320, "热封", { size: 22, anchor: "middle", weight: "bold" });
  b += rect(fx + 20, 336, 200, 20, COL.red, { rx: 4 });
  b += rect(fx + 20, 360, 200, 8, CA) + rect(fx + 20, 368, 200, 8, COL.amberLight);
  b += rect(fx + 20, 376, 200, 8, COL.amberLight) + rect(fx + 20, 384, 200, 8, CA);
  b += rect(fx + 20, 396, 200, 20, COL.red, { rx: 4 });
  b += arrow(fx + 120, 330, fx + 120, 340, { color: COL.ink, width: 2, head: 9 });
  b += lines(fx + 120, 450, ["两层 PP 熔在一起", "Sommer：220 °C · 6 s", "3.5 bar"], { size: 19, anchor: "middle", fill: COL.text2, lh: 27 });
  return svg(W, H, b);
};

// ---------- 5. Electrolyte filling & wetting ----------
figs.filling_wetting = () => {
  const W = 820, H = 540;
  let b = "";
  const steps = [["真空干燥", "60 °C 12 h", COL.teal], ["注液", "5.6 mL", COL.amber], ["抽真空", "200 mbar", COL.teal], ["静置浸润", "2 h", COL.teal], ["封口", "→ 化成", COL.teal]];
  steps.forEach(([t, v, c], i) => {
    const x = 20 + i * 160;
    b += pill(x, 20, 130, 46, c, t, { size: 20 });
    b += text(x + 65, 96, v, { size: 19, anchor: "middle", fill: COL.text2 });
    if (i < 4) b += arrow(x + 134, 43, x + 156, 43, { color: COL.muted, width: 2.5, head: 9 });
  });
  b += text(410, 132, "（数值为 Sommer 2024 的 2 Ah 软包）", { size: 19, anchor: "middle", fill: COL.muted });
  // zoom circles
  const zoom = (cx, cy, r, bubbles, seed) => {
    let z = circ(cx, cy, r, COL.electrolyte, { stroke: COL.text2, sw: 3 });
    const R = rng(seed);
    const parts = [];
    for (let i = 0; i < 60 && parts.length < 14; i++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * (r - 30);
      const px = cx + d * Math.cos(a), py = cy + d * Math.sin(a);
      if (parts.every(([qx, qy]) => Math.hypot(qx - px, qy - py) > 52)) parts.push([px, py]);
    }
    parts.forEach(([px, py], i) => { z += blob(px, py, 23, seed + i, { fill: "#7C8B99", jag: 0.18 }); });
    if (bubbles) {
      const R2 = rng(seed + 99);
      let n = 0;
      for (let i = 0; i < 200 && n < 11; i++) {
        const a = R2() * Math.PI * 2, d = Math.sqrt(R2()) * (r - 18);
        const px = cx + d * Math.cos(a), py = cy + d * Math.sin(a);
        if (parts.every(([qx, qy]) => Math.hypot(qx - px, qy - py) > 32)) { z += circ(px, py, 9 + R2() * 6, COL.white, { stroke: COL.muted, sw: 1.5 }); n++; }
      }
    }
    return z;
  };
  b += zoom(205, 310, 125, true, 11);
  b += zoom(615, 310, 125, false, 11);
  b += arrow(345, 310, 470, 310, { color: COL.teal, width: 4, head: 16 });
  b += lines(408, 258, ["真空 + 时间", "+ 温度"], { size: 19, anchor: "middle", fill: COL.teal, weight: "bold", lh: 26 });
  b += text(205, 470, "刚注液：孔里还有气泡", { size: 20, anchor: "middle" });
  b += text(615, 470, "浸润后：孔被液体填满", { size: 20, anchor: "middle" });
  const lg = [["#7C8B99", "活性颗粒"], [COL.electrolyte, "电解液"], [COL.white, "气泡"]];
  lg.forEach(([c, t], i) => { b += rect(200 + i * 160, 502, 24, 22, c, { rx: 4, stroke: COL.muted, sw: 1 }) + text(232 + i * 160, 520, t, { size: 19, fill: COL.text2 }); });
  return svg(W, H, b);
};

// ---------- 6. Formation profile + degassing ----------
figs.formation_profile = () => {
  const W = 820, H = 540;
  let b = "";
  const x0 = 90, x1 = 790, y0 = 275, y1 = 95; // y0 -> 2.9 V, y1 -> 4.2 V
  const T = 64;
  const X = (t) => x0 + ((x1 - x0) * t) / T;
  const Y = (v) => y0 - ((y0 - y1) * (v - 2.9)) / 1.3;
  b += line(x0, y0 + 10, x1, y0 + 10, COL.line, 2) + line(x0, y1 - 10, x0, y0 + 10, COL.line, 2);
  b += text(x0 - 10, Y(4.2) + 7, "4.2 V", { size: 19, anchor: "end", fill: COL.text2 });
  b += text(x0 - 10, Y(2.9) + 7, "2.9 V", { size: 19, anchor: "end", fill: COL.text2 });
  b += line(x0, Y(4.2), x1, Y(4.2), COL.line, 1, "6 6");
  const ch = [[0, 2.9], [0.4, 3.45], [2.5, 3.62], [5, 3.78], [8, 4.0], [10, 4.2]];
  const dis = [[0, 4.2], [0.8, 4.02], [3.5, 3.78], [6.5, 3.62], [9, 3.42], [10, 2.9]];
  let pts = [];
  let t0 = 0;
  for (let c = 0; c < 3; c++) {
    ch.forEach(([t, v]) => pts.push([X(t0 + t), Y(v)]));
    t0 += 10;
    if (c === 2) { pts.push([X(t0 + 3), Y(4.2)]); t0 += 3; }
    dis.forEach(([t, v]) => pts.push([X(t0 + t), Y(v)]));
    t0 += 10;
    // short rest
    t0 += 0.6;
  }
  b += poly(pts, COL.teal, 3.5);
  // annotations
  b += rect(X(0.2), Y(3.75), X(5) - X(0.2), Y(2.95) - Y(3.75), COL.amberLight, { opacity: 0.45, rx: 6 });
  b += text(x0, 32, "第 1 次充电：生成 SEI、产气、消耗锂", { size: 19, fill: COL.amber, weight: "bold" });
  b += line(X(2.6), 42, X(2.6), Y(3.75) - 2, COL.amber, 2);
  b += line(X(40.6) + 2, Y(4.2) - 6, X(43.6) - 2, Y(4.2) - 6, COL.purple, 5);
  b += text(X(42.1), 66, "第 3 圈恒压 (CV)", { size: 19, fill: COL.purple, weight: "bold", anchor: "middle" });
  b += text((x0 + x1) / 2, y0 + 38, "时间 →（3 圈 × C/10，约 60 h）", { size: 19, anchor: "middle", fill: COL.text2 });
  // degassing
  const mini = (cx, step) => {
    let m = "";
    const x = cx - 110, y = 352;
    m += rect(x, y, 120, 110, COL.light, { stroke: AL, sw: 3, rx: 4 });
    m += rect(x + 14, y + 14, 92, 82, "#7C8B99", { rx: 3 });
    if (step === 1) {
      m += `<path d="M${x + 120},${y} C${x + 230},${y - 20} ${x + 230},${y + 130} ${x + 120},${y + 110} Z" fill="#F5F7F9" stroke="${AL}" stroke-width="3"/>`;
      [[x + 150, y + 35, 9], [x + 175, y + 60, 12], [x + 148, y + 80, 7], [x + 185, y + 30, 6]].forEach(([a, c, r]) => { m += circ(a, c, r, COL.white, { stroke: COL.muted, sw: 1.5 }); });
    } else if (step === 2) {
      m += rect(x + 120, y, 90, 110, "#F5F7F9", { stroke: AL, sw: 3 });
      m += line(x + 165, y + 55, x + 230, y + 20, COL.ink, 3);
      m += arrow(x + 200, y + 36, x + 225, y + 8, { color: COL.teal, width: 3, head: 10 });
    } else {
      m += rect(x + 120, y, 90, 110, "none", { stroke: COL.line, sw: 2, dash: "6 5" });
      m += rect(x + 114, y, 12, 110, COL.amber);
    }
    return m;
  };
  const labs = ["① 化成产气，气袋鼓起", "② 刺破气袋，抽真空", "③ 再封口，切掉气袋"];
  [150, 425, 700].forEach((cx, i) => {
    b += mini(cx, i + 1);
    b += text(cx - 10, 512, labs[i], { size: 19, anchor: "middle" });
  });
  return svg(W, H, b);
};

// ---------- 7. N/P concept ----------
figs.np_concept = () => {
  const W = 820, H = 540;
  let b = "";
  const base = 420, k = 92;
  const bar = (x, v, c, top, sub) => {
    const h = v * k;
    return rect(x, base - h, 110, h, c, { rx: 6 }) +
      text(x + 55, base - h - 36, top, { size: 21, anchor: "middle", weight: "bold" }) +
      text(x + 55, base - h - 10, sub, { size: 21, anchor: "middle", fill: COL.text2 });
  };
  b += bar(60, 3.27, AN, "负极 N", "3.27");
  b += bar(220, 2.61, CA, "正极 P", "2.61");
  // surplus bracket
  const yN = base - 3.27 * k, yP = base - 2.61 * k;
  b += rect(60, yN, 110, yP - yN, COL.white, { opacity: 0.25 });
  b += line(60, yP, 170, yP, COL.white, 2, "6 5");
  b += line(36, yN, 36, yP, COL.amber, 3) + line(30, yN, 42, yN, COL.amber, 3) + line(30, yP, 42, yP, COL.amber, 3);
  // ion arrow
  b += arrow(268, base - 90, 160, base - 90, { color: COL.purple, width: 4, head: 14 });
  b += text(215, base - 104, "充电", { size: 19, anchor: "middle", fill: COL.purple, weight: "bold" });
  b += text(115, base + 32, "面容量 mAh/cm²（设计值）", { size: 19, fill: COL.text2 });
  b += text(190, base + 72, "N/P = 3.27 ÷ 2.61 ≈ 1.25", { size: 22, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(190, base + 106, ["多出的负极 = 给锂留的“空房”"], { size: 19, anchor: "middle", fill: COL.amber });
  // three cases (right)
  b += line(400, 30, 400, 510, COL.line, 2);
  const cases = [
    ["N/P < 1", 0.85, COL.red, ["锂没处住", "→ 镀成金属锂"]],
    ["N/P ≈ 1.1–1.2", 1.15, COL.teal, ["常用设计", "（石墨，典型值）"]],
    ["N/P ≫ 1", 1.8, COL.amber, ["安全但浪费：", "更重、多耗锂"]],
  ];
  cases.forEach(([t, r, c, d], i) => {
    const y = 60 + i * 160;
    b += text(430, y + 6, t, { size: 22, weight: "bold", fill: c });
    const pw = 60;
    b += rect(430, y + 24, pw, 24, CA, { rx: 3 });
    b += rect(430, y + 56, pw * r, 24, AN, { rx: 3 });
    b += text(430 + pw * 1.9 + 14, y + 42, "P", { size: 19, fill: COL.text2 });
    b += text(430 + pw * 1.9 + 14, y + 74, "N", { size: 19, fill: COL.text2 });
    b += lines(620, y + 40, d, { size: 19, lh: 26 });
  });
  return svg(W, H, b);
};

// ---------- 8. Lithium plating + overhang ----------
figs.li_plating = () => {
  const W = 820, H = 540;
  let b = "";
  // cathode at top
  b += rect(40, 30, 480, 46, "#C9D2DA", { rx: 4 });
  for (let i = 0; i < 9; i++) b += blob(70 + i * 52, 53, 19, 40 + i, { fill: CA });
  b += text(530, 62, "正极", { size: 19, fill: COL.text2 });
  b += rect(40, 84, 480, 12, SEP) + text(530, 97, "隔膜", { size: 19, fill: COL.text2 });
  // Li+ arrows
  [110, 230, 350, 450].forEach((x) => { b += arrow(x, 100, x, 136, { color: COL.purple, width: 3, head: 10 }); });
  // graphite particles on copper
  b += rect(40, 230, 480, 12, CU);
  for (let i = 0; i < 6; i++) {
    const x = 50 + i * 78;
    b += rect(x, 170, 66, 56, "#56636F", { rx: 10 });
    for (let j = 0; j < 5; j++) b += line(x + 8, 180 + j * 10, x + 58, 180 + j * 10, COL.purpleLight, 2);
  }
  // plated lithium (mossy) on top
  const R = rng(5);
  for (let i = 0; i < 26; i++) {
    const x = 55 + R() * 455, h = 12 + R() * 22;
    b += line(x, 168, x + (R() - 0.5) * 14, 168 - h, "#B9C3CC", 4);
    b += circ(x + (R() - 0.5) * 10, 168 - h, 4 + R() * 3, "#DDE3E8", { stroke: "#9AA6B2", sw: 1 });
  }
  b += text(530, 156, "金属锂", { size: 19, weight: "bold", fill: COL.red });
  b += text(530, 192, "石墨已满", { size: 19, fill: COL.text2 });
  b += text(530, 218, "(LiC_{6})", { size: 19, fill: COL.text2 });
  b += text(530, 254, "铜箔", { size: 19, fill: CU });
  // causes
  b += lines(650, 70, ["三种诱因", "① N/P < 1", "② 快充、低温", "③ 正极超出", "    负极边缘"], { size: 19, lh: 32 });
  b += rect(640, 46, 170, 170, "none", { rx: 10, stroke: COL.line, sw: 2 });
  // bottom: overhang plan views
  b += line(20, 288, 800, 288, COL.line, 2);
  const view = (x, shift, ok) => {
    let v = rect(x, 320, 220, 140, AN, { rx: 4 });
    v += rect(x + 12 + shift, 332, 196, 116, CA, { rx: 3, opacity: 0.95 });
    if (!ok) v += rect(x + 220, 332, shift - 12, 116, COL.red, { opacity: 0.85 });
    return v;
  };
  b += view(90, 0, true) + check(330, 390, 12);
  b += view(470, 40, false) + cross(760, 390, 11);
  b += text(200, 492, "负极四边都多出一圈", { size: 19, anchor: "middle" });
  b += text(200, 520, "Sommer：每边约 1.5 mm", { size: 19, anchor: "middle", fill: COL.text2 });
  b += text(600, 492, "正极错位、伸出负极", { size: 19, anchor: "middle" });
  b += text(600, 520, "红色边缘：易析锂", { size: 19, anchor: "middle", fill: COL.red });
  return svg(W, H, b);
};

// ---------- 9. Tracking & tracing chain (Sommer Figs. 1, 3, 4) ----------
figs.traceability_chain = () => {
  const W = 1240, H = 400;
  let b = "";
  const cx = [130, 375, 620, 865, 1110];
  // 1: coil + laser marking
  b += circ(75, 150, 50, "#56636F") + circ(75, 150, 30, "#7C8B99") + circ(75, 150, 10, COL.ink);
  b += rect(75, 196, 150, 10, CA);
  [120, 165].forEach((x, i) => { b += dmc(x, 177, 18, 3 + i); });
  b += `<polygon points="150,70 170,70 165,100 155,100" fill="${COL.red}"/>` + line(160, 100, 175, 176, COL.red, 3);
  b += text(160, 62, "激光", { size: 18, anchor: "middle", fill: COL.red, weight: "bold" });
  // 2: reader + ultrasound on web
  b += rect(275, 196, 200, 10, CA);
  [300, 350, 400, 450].forEach((x, i) => { b += dmc(x - 9, 177, 18, 9 + i); });
  b += rect(330, 80, 60, 40, COL.ink, { rx: 6 }) + `<polygon points="345,120 375,120 368,170 352,170" fill="#9FD3CF" opacity="0.7"/>`;
  b += text(360, 72, "读码器", { size: 18, anchor: "middle", weight: "bold" });
  b += rect(420, 220, 40, 28, COL.purple, { rx: 5 }) + text(440, 268, "超声测载量", { size: 17, anchor: "middle", fill: COL.purple });
  // 3: cut sheet with DMC on tab
  b += rect(560, 110, 110, 90, CA, { rx: 3 }) + rect(670, 120, 34, 30, AL);
  b += dmc(676, 126, 18, 21);
  b += rect(552, 102, 160, 106, "none", { stroke: COL.red, sw: 2.5, dash: "8 6", rx: 4 });
  b += text(615, 92, "激光切片", { size: 18, anchor: "middle", fill: COL.red, weight: "bold" });
  // 4: Z-folding with two readers
  const zp = [];
  for (let k = 0; k <= 6; k++) { const y = 110 + k * 15; if (k % 2 === 0) zp.push([815, y], [915, y]); else zp.push([915, y], [815, y]); }
  b += poly(zp, SEP, 2.5);
  for (let k = 0; k < 6; k++) b += rect(k % 2 ? 830 : 800, 114 + k * 15, 100, 6, k % 2 ? CA : AN);
  b += rect(768, 70, 40, 28, COL.ink, { rx: 5 }) + rect(922, 70, 40, 28, COL.ink, { rx: 5 });
  b += line(788, 98, 805, 120, "#9FD3CF", 4) + line(942, 98, 925, 120, "#9FD3CF", 4);
  // 5: database -> virtual cell
  b += ell(1060, 95, 45, 14, COL.teal) + rect(1015, 95, 90, 70, COL.teal) + ell(1060, 165, 45, 14, COL.teal) + ell(1060, 95, 45, 14, "#9FD3CF");
  b += line(1015, 120, 1105, 120, COL.white, 1.5) + line(1015, 142, 1105, 142, COL.white, 1.5);
  const vals = [["1.21", COL.teal], ["1.37", COL.teal], ["0.91", COL.red]];
  vals.forEach(([v, c], i) => { b += pill(1125, 82 + i * 38, 80, 30, c === COL.red ? COL.red : COL.tealLight, v, { size: 18, color: c === COL.red ? COL.white : COL.ink }); });
  // arrows
  [[230, 268], [480, 548], [722, 765], [970, 1008]].forEach(([a, c]) => { b += arrow(a, 150, c, 150, { color: COL.muted, width: 3, head: 12 }); });
  // labels
  const lab = [
    ["① 涂布后激光打码", "每 78 / 81 mm 一个码"],
    ["② 读码 + 测载量", "面密度按码记录"],
    ["③ 激光切片", "每片电极带着码"],
    ["④ Z 形叠片时读码", "记下顺序和朝向"],
    ["⑤ 虚拟电芯", "逐层算面容量与 N/P"],
  ];
  lab.forEach(([h, d], i) => {
    b += text(cx[i], 318, h, { size: 19, anchor: "middle", weight: "bold" });
    b += text(cx[i], 350, d, { size: 18, anchor: "middle", fill: COL.text2 });
  });
  b += text(620, 392, "DMC = Data Matrix 二维码（ISO/IEC 16022），16 × 16 模块", { size: 17, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- 10. Sommer Fig. 6 redraw: local N/P per layer ----------
figs.fig6_redraw = () => {
  const W = 1240, H = 400;
  let b = "";
  const names = ["A1", "C1", "A2", "C2", "A3", "C3", "A4", "C4", "A5", "C5", "A6"];
  const npRef = [1.209, 1.373, 1.262, 1.297, 1.188, 1.338, 1.249, 1.278, 1.167, 1.241];
  const npMan = [1.213, 1.353, 1.206, 1.315, 1.001, 0.910, 1.321, 1.278, 1.203, 1.343];
  const x0 = 215, step = 95;
  const strip = (y, title, sub, np, man) => {
    let s = text(20, y + 40, title, { size: 26, weight: "bold" }) + text(20, y + 70, sub, { size: 18, fill: COL.text2 });
    names.forEach((n, i) => {
      const x = x0 + i * step;
      const isA = n[0] === "A";
      const hot = man && n === "C3";
      const w = hot ? 30 : 24, h = hot ? 92 : 80;
      const yy = y + (80 - h) / 2;
      s += rect(x - w / 2, yy, w, h, isA ? AN : CA, { rx: 3, stroke: hot ? COL.amber : null, sw: 4 });
      s += rect(x - 2, yy, 4, h, isA ? CU : AL);
      s += text(x, y + 108, n, { size: 18, anchor: "middle", fill: hot ? COL.amber : COL.text2, weight: hot ? "bold" : null });
      if (hot) s += text(x, yy - 8, "载量 +20%", { size: 18, anchor: "middle", fill: COL.amber, weight: "bold" });
    });
    np.forEach((v, i) => {
      const x = x0 + i * step + step / 2;
      const bad = v < 1.05;
      s += line(x, y + 40, x, y + 116, bad ? COL.red : COL.line, 1.5, "4 4");
      s += pill(x - 39, y + 118, 78, 30, bad ? COL.red : COL.tealLight, v.toFixed(3), { size: 18, color: bad ? COL.white : COL.ink, weight: bad ? "bold" : "normal" });
    });
    return s;
  };
  b += strip(40, "Ref 1", "全部合格", npRef, false);
  b += strip(232, "Man 1", "混入 1 片超载", npMan, true);
  // legend
  const lg = [[AN, "负极（铜箔 + 石墨）"], [CA, "正极（铝箔 + NMC622）"], [COL.tealLight, "局部 N/P"], [COL.red, "N/P ≤ 1：易析锂"]];
  lg.forEach(([c, t], i) => { b += rect(215 + i * 260, 6, 24, 22, c, { rx: 3 }) + text(247 + i * 260, 24, t, { size: 18, fill: COL.text2 }); });
  return svg(W, H, b);
};

// ---------- 11. Parallel layers & current redistribution ----------
figs.parallel_layers = () => {
  const W = 820, H = 540;
  let b = "";
  b += rect(20, 120, 120, 110, COL.ink, { rx: 10 });
  b += lines(80, 165, ["测试仪", "总 1 C"], { size: 20, anchor: "middle", fill: COL.white, weight: "bold", lh: 30 });
  b += line(140, 140, 170, 140, COL.ink, 3) + line(170, 60, 170, 140, COL.ink, 3) + line(170, 60, 760, 60, COL.ink, 4);
  b += line(140, 210, 170, 210, COL.ink, 3) + line(170, 210, 170, 300, COL.ink, 3) + line(170, 300, 760, 300, COL.ink, 4);
  b += text(780, 68, "+", { size: 26, weight: "bold" }) + text(780, 308, "−", { size: 26, weight: "bold" });
  const xs = [250, 360, 470, 580, 690];
  xs.forEach((x, i) => {
    const hot = i === 2;
    b += line(x, 60, x, 300, COL.ink, 3);
    b += rect(x - 32, 140, 64, 80, hot ? COL.red : COL.light, { rx: 8, stroke: hot ? COL.red : COL.text2, sw: 2.5 });
    b += text(x, 188, `C${i + 1}`, { size: 22, anchor: "middle", weight: "bold", fill: hot ? COL.white : COL.ink });
    if (hot) b += arrow(x + 44, 90, x + 44, 116, { color: COL.red, width: 2, head: 8 });
    else b += arrow(x + 44, 80, x + 44, 128, { color: COL.amber, width: 6, head: 14 });
  });
  b += text(508, 250, "电阻 ↑", { size: 19, fill: COL.red, weight: "bold" });
  b += text(470, 340, "5 片双面正极 = 5 条并联支路；粗箭头 = 分到更多电流", { size: 19, anchor: "middle", fill: COL.text2 });
  // 4-step story
  const st = [
    ["C3 对面负极", "N/P < 1", "先析锂"],
    ["这一对", "老化、", "电阻变大"],
    ["电流转给", "其他各层", "（> 1 C）"],
    ["其他层也", "加速老化", "（再次骤降）"],
  ];
  st.forEach((t, i) => {
    const x = 20 + i * 200;
    b += rect(x, 375, 180, 130, i === 0 ? COL.redLight : COL.light, { rx: 12 });
    b += circ(x + 22, 397, 16, i === 0 ? COL.red : COL.teal) + text(x + 22, 404, String(i + 1), { size: 19, anchor: "middle", fill: COL.white, weight: "bold" });
    b += lines(x + 98, 420, t, { size: 19, anchor: "middle", lh: 28 });
    if (i < 3) b += arrow(x + 182, 440, x + 198, 440, { color: COL.muted, width: 2.5, head: 8 });
  });
  return svg(W, H, b);
};

// ---------- 12. Three scales (Kwade Fig. 4) ----------
figs.three_scales = () => {
  const W = 1240, H = 420;
  let b = "";
  const cx = [210, 620, 1030];
  const hdr = [["实验室 Lab", COL.purple], ["中试 Pilot", COL.teal], ["量产 Industrial", COL.amber]];
  hdr.forEach(([t, c], i) => { b += pill(cx[i] - 140, 14, 280, 46, c, t, { size: 22 }); });
  b += arrow(355, 37, 475, 37, { color: COL.red, width: 4, head: 14 });
  b += text(415, 86, "“死亡之谷”", { size: 19, anchor: "middle", fill: COL.red, weight: "bold" });
  b += arrow(765, 37, 885, 37, { color: COL.muted, width: 4, head: 14 });
  b += text(825, 86, "提速、求稳", { size: 19, anchor: "middle", fill: COL.text2, weight: "bold" });
  // row 1: electrode production
  // lab: doctor blade on a plate
  b += rect(90, 150, 240, 16, COL.line, { rx: 3 }) + rect(110, 140, 150, 10, CA, { rx: 2 });
  b += rect(250, 112, 36, 40, "#56636F", { rx: 4 }) + arrow(300, 130, 340, 130, { color: COL.ink, width: 2.5, head: 10 });
  b += text(cx[0], 196, "刮刀涂布，一张一张", { size: 18, anchor: "middle", fill: COL.text2 });
  // pilot: small roll-to-roll
  b += circ(520, 135, 26, "#7C8B99") + circ(720, 135, 26, "#7C8B99");
  b += rect(575, 110, 90, 50, COL.amberLight, { rx: 6 }) + text(620, 142, "烘箱", { size: 18, anchor: "middle" });
  b += line(520, 109, 720, 109, CA, 5);
  b += text(cx[1], 196, "卷对卷，小狭缝/逗号刮刀", { size: 18, anchor: "middle", fill: COL.text2 });
  // industrial: long double-sided line
  b += circ(860, 135, 30, "#7C8B99") + circ(1200, 135, 30, "#7C8B99");
  b += rect(900, 104, 260, 26, COL.amberLight, { rx: 6 }) + rect(900, 140, 260, 26, COL.amberLight, { rx: 6 });
  b += line(860, 133, 1200, 133, CA, 5);
  b += text(cx[2], 196, "宽幅双面狭缝，长烘箱", { size: 18, anchor: "middle", fill: COL.text2 });
  // row 2: cells
  // lab: coin + single layer pouch
  b += ell(150, 262, 40, 13, "#56636F") + rect(110, 250, 80, 12, "#56636F") + ell(150, 250, 40, 13, CA);
  b += rect(230, 225, 80, 64, COL.light, { stroke: AL, sw: 2, rx: 4 }) + rect(245, 238, 50, 38, AN);
  b += text(cx[0], 322, "扣式、单层软包", { size: 18, anchor: "middle", fill: COL.text2 });
  // pilot: Z-fold stack
  const zp = [];
  for (let k = 0; k <= 5; k++) { const y = 225 + k * 13; if (k % 2 === 0) zp.push([570, y], [670, y]); else zp.push([670, y], [570, y]); }
  b += poly(zp, SEP, 2.5);
  for (let k = 0; k < 5; k++) b += rect(k % 2 ? 585 : 560, 229 + k * 13, 95, 5, k % 2 ? CA : AN);
  b += text(cx[1], 322, "Z 形叠片，多层双面软包", { size: 18, anchor: "middle", fill: COL.text2 });
  // industrial: winding
  const sp = [];
  for (let th = 0; th <= 4.5 * 2 * Math.PI; th += 0.1) { const r = 6 + (7 * th) / (2 * Math.PI); sp.push([1030 + r * Math.cos(th), 258 + r * Math.sin(th)]); }
  b += poly(sp, AN, 3);
  b += rect(1100, 222, 80, 72, COL.light, { stroke: AL, sw: 3, rx: 6 });
  b += text(cx[2], 322, "高速卷绕 / 叠片，全尺寸", { size: 18, anchor: "middle", fill: COL.text2 });
  // targets
  const tg = ["目标：筛材料与配方", "目标：定工艺参数与电芯设计", "目标：产量、良率、低成本"];
  tg.forEach((t, i) => { b += rect(cx[i] - 185, 350, 370, 50, i === 0 ? "#F1ECF8" : i === 1 ? "#E8F4F3" : "#FDF2E7", { rx: 10 }) + text(cx[i], 382, t, { size: 19, anchor: "middle", weight: "bold" }); });
  return svg(W, H, b);
};

// ---------- 13. Xiao Fig. 1 redraw: research cycles ----------
figs.xiao_cycles = () => {
  const W = 820, H = 540;
  let b = "";
  // small loop
  b += circ(150, 260, 95, "none", { stroke: COL.purpleLight, sw: 5, dash: "10 8" });
  const sn = [[150, 165, "合成 < 10 g"], [235, 330, "扣式测试"], [65, 330, "表征"]];
  sn.forEach(([x, y, t]) => { b += pill(x - 62, y - 20, 124, 40, COL.purple, t, { size: 19 }); });
  b += lines(150, 430, ["实验室：小循环", "快，几乎不算成本"], { size: 19, anchor: "middle", fill: COL.text2, lh: 27 });
  // scale-up arrow
  b += arrow(300, 260, 362, 260, { color: COL.amber, width: 5, head: 18 });
  b += text(330, 240, "放大", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  // big loop
  const cx = 592, cy = 262, rx = 165, ry = 175;
  b += ell(cx, cy, rx, ry, "none", { stroke: COL.amberLight, sw: 5, dash: "10 8" });
  // pile of particles in the middle
  for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) b += circ(cx - r * 13 + i * 26, cy - 30 + r * 22, 12, COL.tealLight, { stroke: COL.teal, sw: 1.5 });
  b += text(cx, cy + 82, "> 1 kg 材料", { size: 20, anchor: "middle", weight: "bold" });
  const nodes = ["原料与路线", "设备选择", "杂质与质控", "大规模涂布", "电池原型", "小规模测试", "表征"];
  nodes.forEach((t, i) => {
    const a = (-90 + (i * 360) / 7) * (Math.PI / 180);
    const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    b += pill(x - 58, y - 20, 116, 40, i === 2 ? COL.red : COL.amber, t, { size: 19 });
  });
  b += text(cx + rx * Math.cos((-90 + 720 / 7) * Math.PI / 180), cy + ry * Math.sin((-90 + 720 / 7) * Math.PI / 180) + 46, "99.847%", { size: 19, anchor: "middle", fill: COL.red, weight: "bold" });
  b += text(cx, 530, "量产：大循环，每一步都算成本", { size: 19, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- 14. Series recap chain ----------
figs.series_recap = () => {
  const W = 1240, H = 250;
  let b = "";
  const xs = [110, 314, 518, 722, 926, 1130];
  const t = [["总览", "工艺链与格式"], ["浆料与涂布", "配方 · 流变"], ["干燥与辊压", "孔隙 · 干法"], ["扣式电池", "组装与测试"], ["可信数据", "统计 · 报告"], ["软包与放大", "N/P · 追溯"]];
  // group brackets
  const br = (a, c, label, col) => line(a, 40, c, 40, col, 4) + line(a, 40, a, 52, col, 4) + line(c, 40, c, 52, col, 4) + text((a + c) / 2, 28, label, { size: 18, anchor: "middle", fill: col, weight: "bold" });
  b += br(264, 568, "电极制备（第 2–3 章）", COL.teal) + br(672, 976, "实验室电池（第 4–5 章）", COL.purple);
  xs.forEach((x, i) => {
    if (i < 5) b += arrow(x + 46, 110, xs[i + 1] - 46, 110, { color: COL.line, width: 4, head: 14 });
    b += circ(x, 110, 40, i === 5 ? COL.amber : i === 0 ? COL.ink : i < 3 ? COL.teal : COL.purple);
    b += text(x, 121, String(i + 1), { size: 30, anchor: "middle", weight: "bold", fill: COL.white });
    b += text(x, 186, t[i][0], { size: 21, anchor: "middle", weight: "bold" });
    b += text(x, 218, t[i][1], { size: 18, anchor: "middle", fill: COL.text2 });
  });
  return svg(W, H, b);
};

module.exports = figs;
