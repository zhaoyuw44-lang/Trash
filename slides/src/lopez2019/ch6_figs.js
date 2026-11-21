// Figures for Lopez et al. 2019, Chapter 6 (Polymer design for stable interfaces)
// Canvas widths are ~100 px per inch of slide area; text ≥ 17 px.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const dash = (x1, y1, x2, y2, c = COL.ink, w = 2.5, da = "6 5") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-dasharray="${da}"/>`;
function zig(x1, x2, y, o = {}) {
  const step = o.step || 22, amp = o.amp || 8;
  let d = `M${x1},${y}`;
  let k = 0;
  for (let x = x1 + step; x <= x2 + 0.1; x += step) d += ` L${x},${y + (k++ % 2 ? amp : -amp)}`;
  return `<path d="${d}" fill="none" stroke="${o.color || COL.teal}" stroke-width="${o.w || 5}" stroke-linejoin="round" stroke-linecap="round"/>`;
}
function curved(x1, y1, cx, cy, x2, y2, c, w = 3.5) {
  const a = Math.atan2(y2 - cy, x2 - cx);
  return `<path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" fill="none" stroke="${c}" stroke-width="${w}"/>` + head(x2, y2, a, c, 14);
}
function sphere(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#B9C3CC" stroke="#7D8893" stroke-width="2"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="#E3E8EC"/>`;
}

// ---------- Title motif: layered interface with a polymer skin ----------
figs.title_motif = () => {
  const W = 520, H = 560;
  let b = "";
  // Li metal (bottom), polymer coating, electrolyte (top)
  b += `<rect x="40" y="380" width="440" height="120" rx="10" fill="#B9C3CC"/>`;
  for (let i = 0; i < 7; i++) b += sphere(90 + i * 57, 362, 26);
  for (let i = 0; i < 6; i++) b += sphere(118 + i * 57, 318, 26);
  b += `<path d="M40,300 C140,250 380,250 480,300 L480,330 C380,280 140,280 40,330 Z" fill="${COL.tealLight}" opacity="0.9"/>`;
  let d = "M40,290";
  for (let i = 1; i <= 22; i++) d += ` L${40 + i * 20},${290 - Math.sin((i / 22) * Math.PI) * 40 + (i % 2 ? -8 : 8)}`;
  b += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>`;
  // Li+ arriving
  [[150, 120], [260, 70], [370, 140], [210, 190], [320, 210]].forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="16" fill="${COL.purple}" stroke="#FFFFFF" stroke-width="3"/>`));
  [[150, 150], [260, 100], [370, 170]].forEach(([x, y]) => (b += arrow(x, y, x, y + 50, { color: "#FFFFFF", width: 3, head: 12 })));
  return svg(W, H, b);
};

// ---------- History timeline ----------
figs.sei_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1979", who: ["Peled"], what: ["提出 SEI 模型", "（碱金属负极）"], color: COL.purple },
    { year: "1990", who: ["Fong, von Sacken", "& Dahn"], what: ["EC 在石墨上", "形成稳定 SEI"], color: COL.purple },
    { year: "2000", who: ["Aurbach"], what: ["醚类电解液形成", "聚合物性 SEI"], color: COL.purple },
    { year: "2002", who: ["Aurbach 等"], what: ["VC 成膜", "添加剂"], color: COL.teal },
    { year: "2010", who: ["Goodenough & Kim"], what: ["能级图：", "电解液稳定窗口"], color: COL.text2 },
    { year: "2016", who: ["Michan, Grey 等"], what: ["FEC/VC 还原", "生成 poly(VC)"], color: COL.teal },
    { year: "2017", who: ["Li, Cui 等"], what: ["冷冻电镜", "看清 SEI 结构"], color: COL.text2 },
    { year: "2018", who: ["Lopez, Bao 等"], what: ["高分子涂层的", "设计规律"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 90, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Fig. 7a energy-level diagram ----------
figs.energy_diagram = () => {
  const W = 760, H = 470;
  let b = "";
  // axis
  b += `<line x1="40" y1="450" x2="40" y2="40" stroke="${COL.ink}" stroke-width="3"/>` + head(40, 28, -Math.PI / 2, COL.ink, 14);
  b += `<g transform="translate(26 250) rotate(-90)">` + text(0, 0, "电子能量 ↑", { size: 18, anchor: "middle", weight: "bold" }) + `</g>`;
  // anode band
  const yLi = 105, yLUMO = 150, yHOMO = 345, yCat = 400;
  b += `<rect x="70" y="${yLi - 30}" width="170" height="54" fill="${COL.redLight}" opacity="0.7"/>`;
  b += `<line x1="70" y1="${yLi}" x2="240" y2="${yLi}" stroke="${COL.ink}" stroke-width="4"/>`;
  b += text(155, yLi - 8, "负极 E_{Li} = 0 V", { size: 18, anchor: "middle", weight: "bold" });
  // cathode band
  b += `<rect x="70" y="${yCat - 24}" width="170" height="54" fill="#CFE3F1"/>`;
  b += `<line x1="70" y1="${yCat}" x2="240" y2="${yCat}" stroke="${COL.ink}" stroke-width="4"/>`;
  b += text(155, yCat + 24, "正极 E_{cathode}", { size: 18, anchor: "middle", weight: "bold" });
  // cell potential
  b += arrow(100, yLi + 6, 100, yCat - 6, { color: COL.text2, width: 2.5, head: 11 }) + arrow(100, yCat - 6, 100, yLi + 6, { color: COL.text2, width: 2.5, head: 11 });
  b += lines(110, 250, ["电池", "电压"], { size: 17, fill: COL.text2, weight: "bold", lh: 22 });
  // electrolyte window
  b += `<rect x="400" y="${yLUMO}" width="170" height="${yHOMO - yLUMO}" fill="#DDF0E6"/>`;
  b += `<line x1="400" y1="${yLUMO}" x2="570" y2="${yLUMO}" stroke="${COL.ink}" stroke-width="4"/>`;
  b += `<line x1="400" y1="${yHOMO}" x2="570" y2="${yHOMO}" stroke="${COL.ink}" stroke-width="4"/>`;
  b += lines(485, 230, ["电解液", "稳定窗口"], { size: 19, anchor: "middle", weight: "bold", fill: COL.teal, lh: 26 });
  b += text(580, yLUMO + 6, "LUMO", { size: 17, weight: "bold" });
  b += text(580, yHOMO + 6, "HOMO", { size: 17, weight: "bold" });
  b += dash(400, yHOMO - 22, 570, yHOMO - 22, COL.teal, 2.5);
  b += text(580, yHOMO - 16, "醚 ≈ 4.0 V", { size: 17, fill: COL.teal, weight: "bold" });
  b += text(580, yHOMO + 30, "碳酸酯 ≈ 4.3 V", { size: 17, fill: COL.teal, weight: "bold" });
  // SEI layers
  b += `<rect x="400" y="${yLUMO - 26}" width="170" height="22" fill="${COL.sei}" opacity="0.85"/>`;
  b += text(485, yLUMO - 10, "SEI", { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += `<rect x="400" y="${yHOMO + 46}" width="170" height="22" fill="${COL.sei}" opacity="0.85"/>`;
  b += text(485, yHOMO + 62, "正极界面膜", { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  // driving forces
  b += curved(245, yLi + 4, 360, yLi, 395, yLUMO + 8, COL.red);
  b += lines(255, 190, ["E_{Li} 高于 LUMO：", "电子流进电解液", "→ 电解液被还原"], { size: 17, fill: COL.red, weight: "bold", lh: 21 });
  b += curved(395, yHOMO + 4, 330, yCat, 245, yCat - 4, COL.red);
  b += lines(255, 290, ["E_{cathode} 低于 HOMO：", "→ 电解液被氧化"], { size: 17, fill: COL.red, weight: "bold", lh: 21 });
  b += text(W / 2, 462, "", { size: 17 });
  return svg(W, H, b);
};

// ---------- Where interphases form + ideal SEI ----------
figs.sei_where = () => {
  const W = 720, H = 490;
  let b = "";
  const y = (v) => 450 - v * 80; // 0..5 V
  const ax = 120;
  b += `<rect x="${ax}" y="${y(1)}" width="250" height="${y(0) - y(1)}" fill="${COL.redLight}" opacity="0.6"/>`;
  b += `<rect x="${ax}" y="${y(5)}" width="250" height="${y(4) - y(5)}" fill="#CFE3F1"/>`;
  b += `<line x1="${ax}" y1="${y(0) + 8}" x2="${ax}" y2="${y(5) - 8}" stroke="${COL.ink}" stroke-width="3"/>` + head(ax, y(5) - 20, -Math.PI / 2, COL.ink, 13);
  for (let v = 0; v <= 5; v++) {
    b += `<line x1="${ax - 8}" y1="${y(v)}" x2="${ax}" y2="${y(v)}" stroke="${COL.ink}" stroke-width="2"/>`;
    b += text(ax - 14, y(v) + 6, `${v} V`, { size: 17, anchor: "end", fill: COL.text2 });
  }
  b += text(ax - 50, y(5) - 26, "电位 vs Li/Li⁺", { size: 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  const mk = (v, lab, c, dy = 0) => `<line x1="${ax}" y1="${y(v)}" x2="${ax + 60}" y2="${y(v)}" stroke="${c}" stroke-width="5"/>` + text(ax + 68, y(v) + 6 + dy, lab, { size: 17, weight: "bold", fill: c });
  b += mk(0, "Li 金属 0 V", COL.purple, 14);
  b += mk(0.12, "石墨 ≈ 0.1 V", COL.ink, -4);
  b += mk(0.4, "Si ≈ 0.4 V", COL.siDark, -14);
  b += mk(3.9, "LiCoO_{2} ≈ 3.9 V", COL.amber, 8);
  b += mk(4.7, "LiNi_{0.5}Mn_{1.5}O_{4} ≈ 4.7 V", "#3A7CA5", 0);
  b += text(ax + 245, y(0.75), "< 1 V：负极 SEI", { size: 17, anchor: "end", weight: "bold", fill: COL.red });
  b += text(ax + 245, y(4.25) + 6, "> 4 V：正极界面膜", { size: 17, anchor: "end", weight: "bold", fill: "#3A7CA5" });
  // ideal SEI checklist
  const X = 420;
  b += `<rect x="${X}" y="50" width="290" height="400" rx="16" fill="#F5F7F9"/>`;
  b += text(X + 145, 80, "理想的 SEI", { size: 21, anchor: "middle", weight: "bold" });
  const req = [["很薄", "少消耗 Li 和电解液"], ["电子绝缘", "反应能自己停下"], ["离子导通", "Li⁺ 照常通过"], ["力学稳定", "充放电不开裂"]];
  req.forEach(([h, s], i) => {
    const yy = 135 + i * 76;
    b += check(X + 36, yy - 6, 12);
    b += text(X + 64, yy, h, { size: 19, weight: "bold" });
    b += text(X + 64, yy + 26, s, { size: 17, fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- VC / FEC -> poly(VC) ----------
function ring5(cx, cy, r, o = {}) {
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}
function carbonateRing(cx, cy, o = {}) {
  // five-membered ring: top C(=O), two O, two C at bottom
  const p = ring5(cx, cy, 40);
  let s = `<polygon points="${p.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3.5" stroke-linejoin="round"/>`;
  // C=O on top
  s += `<line x1="${p[0][0] - 4}" y1="${p[0][1]}" x2="${p[0][0] - 4}" y2="${p[0][1] - 30}" stroke="${COL.ink}" stroke-width="3.5"/><line x1="${p[0][0] + 4}" y1="${p[0][1]}" x2="${p[0][0] + 4}" y2="${p[0][1] - 30}" stroke="${COL.ink}" stroke-width="3.5"/>`;
  s += text(p[0][0], p[0][1] - 36, "O", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  s += `<circle cx="${p[1][0]}" cy="${p[1][1]}" r="11" fill="#FFFFFF"/>` + text(p[1][0], p[1][1] + 6, "O", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  s += `<circle cx="${p[4][0]}" cy="${p[4][1]}" r="11" fill="#FFFFFF"/>` + text(p[4][0], p[4][1] + 6, "O", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  if (o.double) s += `<line x1="${p[2][0] - 6}" y1="${p[2][1] - 8}" x2="${p[3][0] + 6}" y2="${p[3][1] - 8}" stroke="${COL.amber}" stroke-width="4"/>`;
  if (o.F) {
    s += `<line x1="${p[2][0]}" y1="${p[2][1]}" x2="${p[2][0] + 16}" y2="${p[2][1] + 24}" stroke="${COL.ink}" stroke-width="3"/>`;
    s += text(p[2][0] + 22, p[2][1] + 44, "F", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  }
  return s;
}
figs.additive_mech = () => {
  const W = 720, H = 480;
  let b = "";
  // FEC
  b += carbonateRing(90, 130, { F: true });
  b += text(90, 225, "FEC", { size: 19, anchor: "middle", weight: "bold" });
  b += text(90, 248, "氟代碳酸乙烯酯", { size: 17, anchor: "middle", fill: COL.text2 });
  b += arrow(150, 130, 230, 130, { color: COL.ink, width: 3, head: 13 });
  b += lines(190, 108, ["失去 F"], { size: 17, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += lines(190, 162, ["→ LiF"], { size: 17, anchor: "middle", fill: COL.teal, weight: "bold" });
  // VC
  b += carbonateRing(300, 130, { double: true });
  b += text(300, 225, "VC", { size: 19, anchor: "middle", weight: "bold" });
  b += text(300, 248, "碳酸亚乙烯酯（含 C=C）", { size: 17, anchor: "middle", fill: COL.text2 });
  b += arrow(365, 130, 455, 130, { color: COL.ink, width: 3, head: 13 });
  b += electron(410, 96, 16);
  b += text(410, 165, "负极上被还原", { size: 17, anchor: "middle", weight: "bold" });
  // poly(VC)
  const x0 = 480;
  for (let i = 0; i < 3; i++) {
    const cx = x0 + 25 + i * 72, cy = 140;
    b += `<polygon points="${cx - 22},${cy} ${cx + 22},${cy} ${cx + 30},${cy + 34} ${cx},${cy + 54} ${cx - 30},${cy + 34}" fill="#FFFFFF" stroke="${COL.amber}" stroke-width="3"/>`;
    b += `<line x1="${cx - 22}" y1="${cy}" x2="${cx - 50}" y2="${cy}" stroke="${COL.amber}" stroke-width="5"/>`;
    b += `<line x1="${cx - 3}" y1="${cy + 54}" x2="${cx - 3}" y2="${cy + 70}" stroke="${COL.amber}" stroke-width="3"/><line x1="${cx + 3}" y1="${cy + 54}" x2="${cx + 3}" y2="${cy + 70}" stroke="${COL.amber}" stroke-width="3"/>`;
  }
  b += `<line x1="${x0 + 25 + 2 * 72 + 22}" y1="140" x2="${x0 + 25 + 2 * 72 + 50}" y2="140" stroke="${COL.amber}" stroke-width="5"/>`;
  b += text(x0 + 100, 240, "poly(VC)", { size: 19, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(x0 + 100, 264, "高分子：SEI 的“骨架”", { size: 17, anchor: "middle", fill: COL.text2 });
  // bottom: SEI picture
  const sy = 375;
  b += `<rect x="20" y="${sy}" width="680" height="34" fill="#4F5B66"/>`;
  b += text(360, sy + 24, "负极（Si 或 Li）", { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += `<rect x="20" y="${sy - 40}" width="680" height="40" fill="#E9D7C8"/>`;
  b += zig(30, 690, sy - 24, { color: COL.amber, w: 4, step: 26, amp: 7 });
  b += zig(30, 690, sy - 10, { color: COL.amber, w: 4, step: 26, amp: 7 });
  const R = rng(4);
  for (let i = 0; i < 18; i++) b += `<rect x="${(40 + R() * 640).toFixed(1)}" y="${(sy - 36 + R() * 26).toFixed(1)}" width="9" height="9" fill="${COL.teal}"/>`;
  b += text(30, sy - 52, "SEI = 高分子 poly(VC) + 无机 LiF 颗粒", { size: 18, weight: "bold", fill: COL.sei });
  b += `<rect x="600" y="${sy - 68}" width="14" height="14" fill="${COL.teal}"/>` + text(622, sy - 56, "= LiF", { size: 17, fill: COL.text2 });
  b += lines(360, 440, ["添加剂比溶剂先被还原，先铺好一层更柔韧、更稳定的膜"], { size: 17, anchor: "middle", fill: COL.ink, weight: "bold" });
  b += text(360, 470, "（示意；FEC 的具体还原路径仍有讨论）", { size: 17, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Binder takes part in the SEI ----------
figs.binder_sei = () => {
  const W = 720, H = 430;
  let b = "";
  const PH = 330;
  const dome = (X, cx, cy, R, fill) => {
    const pts = [];
    for (let x = X; x <= X + 340; x += 4) {
      const dx = x - cx;
      const yy = Math.abs(dx) < R ? Math.min(PH, cy - Math.sqrt(R * R - dx * dx)) : PH;
      pts.push(`${x},${yy.toFixed(1)}`);
    }
    pts.push(`${X + 340},${PH}`, `${X},${PH}`);
    return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
  };
  const panel = (X, title, lithiated) => {
    let s = `<rect x="${X}" y="0" width="340" height="${PH}" fill="${COL.electrolyte}"/>`;
    s += text(X + 170, 34, title, { size: 19, anchor: "middle", weight: "bold" });
    const cx = X + 170, cy = 480;
    s += dome(X, cx, cy, 262, lithiated ? "#C9A27F" : "#DCE3E9");
    s += dome(X, cx, cy, 240, COL.si);
    s += text(cx, 300, "Si", { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k - 2) * 0.27;
      const px = cx + 276 * Math.cos(a), py = cy + 276 * Math.sin(a);
      s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="16" fill="${lithiated ? COL.purple : COL.red}"/>`;
      s += text(px, py + 6, lithiated ? "Li" : "H", { size: 17, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
    }
    return s;
  };
  b += panel(0, "涂布后：PAA 的 –COOH", false);
  b += panel(380, "首次充电后：–COOLi 保护层", true);
  b += arrow(345, 200, 377, 200, { color: COL.ink, width: 3, head: 12 });
  [[60, 90], [130, 72], [270, 84]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="22" ry="11" fill="#7FB8DA"/>`));
  [[440, 84], [640, 88]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="22" ry="11" fill="#7FB8DA"/>`));
  b += arrow(550, 66, 550, 150, { color: "#3A7CA5", width: 3, head: 11 }) + cross(550, 170, 9);
  b += text(170, 372, "R–COOH + Li⁺ + e^{−} → R–COOLi", { size: 18, anchor: "middle", weight: "bold", fill: COL.ink });
  b += text(170, 404, "羧酸被还原成羧酸锂", { size: 17, anchor: "middle", fill: COL.text2 });
  b += text(550, 372, "碳酸酯溶剂难以靠近", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(550, 404, "→ 溶剂分解被抑制", { size: 17, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Polymer electrolyte interfaces ----------
figs.spe_interface = () => {
  const W = 720, H = 490;
  let b = "";
  const top = 70, bot = 330;
  b += `<rect x="20" y="${top}" width="110" height="${bot - top}" fill="#B9C3CC"/>`;
  b += text(75, top + 130, "Li", { size: 22, anchor: "middle", weight: "bold" });
  b += `<rect x="130" y="${top}" width="30" height="${bot - top}" fill="${COL.sei}"/>`;
  b += `<rect x="160" y="${top}" width="380" height="${bot - top}" fill="#F4F1FA"/>`;
  // polymer chains
  for (let k = 0; k < 5; k++) b += zig(175, 525, top + 35 + k * 52, { color: COL.purple, w: 3.5, step: 24, amp: 8 });
  [[260, 125], [410, 230], [330, 290]].forEach(([x, y]) => (b += ion(x, y, { r: 14 })));
  b += `<rect x="540" y="${top}" width="30" height="${bot - top}" fill="#7FB8DA"/>`;
  b += `<rect x="570" y="${top}" width="130" height="${bot - top}" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="2"/>`;
  b += lines(635, top + 120, ["高电压", "正极"], { size: 19, anchor: "middle", weight: "bold", lh: 26 });
  b += text(350, top - 16, "固态聚合物电解质（如 PEO）", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(145, top - 16, "SEI", { size: 18, anchor: "middle", weight: "bold", fill: COL.sei });
  b += cross(555, top + 200, 12);
  b += lines(555, bot + 30, ["醚类聚合物", "在 > 4 V 被氧化"], { size: 18, anchor: "middle", weight: "bold", fill: COL.red, lh: 22 });
  // products
  b += `<rect x="20" y="${bot + 82}" width="340" height="72" rx="12" fill="#F5F7F9"/>`;
  b += lines(34, bot + 110, ["醚类（PEO） → 烷氧基锂 ROLi", "碳酸酯类 → 烷基碳酸锂 ROCO_{2}Li"], { size: 18, weight: "bold", fill: COL.sei, lh: 26 });
  b += lines(160, bot + 30, ["分解比液体慢，", "但仍会形成 SEI"], { size: 18, weight: "bold", fill: COL.sei, lh: 22 });
  return svg(W, H, b);
};

// ---------- Fig. 7c polymer coating gallery ----------
figs.coatings = () => {
  const W = 720, H = 450;
  let b = "";
  const cards = [
    ["PVDF", "–(CH_{2}–CF_{2})_{n}–", "强极性 C–F：介电常数高", COL.teal],
    ["PDMS", "–(Si(CH_{3})_{2}–O)_{n}–", "硅氧烷：表面能很低", COL.purple],
    ["PVDF–HFP", "–(CH_{2}–CF_{2})_{x}–(CF_{2}–CF(CF_{3}))_{y}–", "PVDF 共聚物：更柔、更好溶", COL.teal],
    ["离聚物（锂化 Nafion）", "全氟主链 + 侧链 –SO_{3}^{−} Li^{+}", "阴离子固定：只让 Li⁺ 移动", COL.amber],
  ];
  cards.forEach(([n, f, t, c], i) => {
    const x = (i % 2) * 365, y = Math.floor(i / 2) * 225;
    b += `<rect x="${x}" y="${y}" width="355" height="210" rx="16" fill="#F5F7F9"/>`;
    b += `<rect x="${x}" y="${y}" width="10" height="210" rx="5" fill="${c}"/>`;
    b += text(x + 30, y + 44, n, { size: 22, weight: "bold", fill: c });
    const fs = f.length > 30 ? 17 : 21;
    b += text(x + 30, y + 110, f, { size: fs, weight: "bold", fill: COL.ink });
    b += text(x + 30, y + 172, t, { size: 17, fill: COL.text2 });
  });
  return svg(W, H, b);
};

// ---------- Fig. 7b deposits ----------
figs.deposits = () => {
  const W = 760, H = 450;
  let b = "";
  const panel = (X, big) => {
    let s = `<rect x="${X}" y="20" width="360" height="300" fill="${COL.electrolyte}"/>`;
    s += `<rect x="${X}" y="250" width="360" height="70" fill="${COL.copper}"/>`;
    s += text(X + 14, 306, "Cu", { size: 18, weight: "bold", fill: "#FFFFFF" });
    s += text(X + 14, 48, "高分子涂层", { size: 18, weight: "bold", fill: "#3A7CA5" });
    if (!big) {
      // small deposits: many small spheres in a tall pile
      const r = 14;
      [[6, 0], [5, 1], [4, 2], [3, 3], [2, 4]].forEach(([n, row]) => {
        for (let i = 0; i < n; i++) s += sphere(X + 180 - (n - 1) * r + i * 2 * r, 250 - r - row * r * 1.75, r);
      });
      s += text(X + 180, 75, "小而疏松", { size: 19, anchor: "middle", weight: "bold", fill: COL.red });
    } else {
      const r = 22;
      [[7, 0], [6, 1], [4, 2]].forEach(([n, row]) => {
        for (let i = 0; i < n; i++) s += sphere(X + 180 - (n - 1) * r + i * 2 * r, 250 - r - row * r * 1.75, r);
      });
      s += text(X + 180, 75, "大而致密（CE 高）", { size: 19, anchor: "middle", weight: "bold", fill: COL.teal });
    }
    return s;
  };
  b += panel(0, false) + panel(400, true);
  const ar = (y, l, m, r) => {
    let s = text(380, y, m, { size: 18, anchor: "middle", weight: "bold" });
    s += arrow(300, y - 6, 140, y - 6, { color: COL.text2, width: 2.5, head: 11 }) + arrow(460, y - 6, 620, y - 6, { color: COL.text2, width: 2.5, head: 11 });
    s += text(130, y, l, { size: 18, anchor: "end", fill: COL.red, weight: "bold" });
    s += text(630, y, r, { size: 18, fill: COL.teal, weight: "bold" });
    return s;
  };
  b += ar(370, "表面能高", "界面能", "表面能低");
  b += ar(415, "介电常数低", "过电位", "介电常数高");
  return svg(W, H, b);
};

// ---------- Mechanism flow ----------
figs.mech_flow = () => {
  const W = 720, H = 450;
  let b = "";
  const box = (x, y, w, t, c, fill) => `<rect x="${x}" y="${y}" width="${w}" height="60" rx="14" fill="${fill}" stroke="${c}" stroke-width="2.5"/>` + text(x + w / 2, y + 38, t, { size: 18, anchor: "middle", weight: "bold", fill: c });
  // chain 1: dielectric
  b += box(10, 30, 210, "介电常数 ε 高", COL.teal, "#E8F4F3");
  b += box(250, 30, 210, "Li⁺ 穿过涂层容易", COL.teal, "#FFFFFF");
  b += box(490, 30, 220, "交换电流 i_{0} 大", COL.teal, "#FFFFFF");
  b += arrow(222, 60, 246, 60, { color: COL.teal, width: 3, head: 10 }) + arrow(462, 60, 486, 60, { color: COL.teal, width: 3, head: 10 });
  b += box(490, 130, 220, "过电位 η 小", COL.teal, "#FFFFFF");
  b += arrow(600, 92, 600, 126, { color: COL.teal, width: 3, head: 10 });
  b += box(250, 130, 210, "核少，每个长得大", COL.ink, "#FFFFFF");
  b += arrow(488, 160, 464, 160, { color: COL.teal, width: 3, head: 10 });
  // chain 2: surface energy
  b += box(10, 250, 210, "表面能 γ 低", COL.purple, "#F1ECF8");
  b += box(250, 250, 210, "原文：成核能量分析", COL.purple, "#FFFFFF");
  b += arrow(222, 280, 246, 280, { color: COL.purple, width: 3, head: 10 });
  b += arrow(355, 246, 355, 194, { color: COL.purple, width: 3, head: 10 });
  // result
  b += `<rect x="490" y="235" width="220" height="90" rx="14" fill="${COL.amber}"/>`;
  b += lines(600, 272, ["大而致密的 Li", "比表面积小 → CE 高"], { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF", lh: 26 });
  b += curved(462, 175, 560, 190, 590, 232, COL.amber, 3.5);
  // nucleation reminder
  b += `<rect x="10" y="355" width="700" height="85" rx="14" fill="#F5F7F9"/>`;
  b += lines(28, 388, ["成核规律：过电位越大，临界核越小、核越密（Li 长成细小枝状）", "过电位越小，核越少、越大（Li 长成大颗粒）"], { size: 17, fill: COL.ink, lh: 30 });
  return svg(W, H, b);
};

// ---------- Quadrant: dielectric constant vs surface energy ----------
figs.quadrant = () => {
  const W = 620, H = 470;
  let b = "";
  const x0 = 80, y0 = 400, x1 = 600, y1 = 30;
  b += `<rect x="${(x0 + x1) / 2}" y="${y1}" width="${(x1 - x0) / 2}" height="${(y0 - y1) / 2}" fill="#FDF2E7"/>`;
  b += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="${COL.ink}" stroke-width="3"/>` + head(x1 + 10, y0, 0, COL.ink, 14);
  b += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="${COL.ink}" stroke-width="3"/>` + head(x0, y1 - 10, -Math.PI / 2, COL.ink, 14);
  b += dash((x0 + x1) / 2, y1, (x0 + x1) / 2, y0, COL.line, 2);
  b += dash(x0, (y0 + y1) / 2, x1, (y0 + y1) / 2, COL.line, 2);
  b += text((x0 + x1) / 2, y0 + 36, "介电常数 ε →（高）", { size: 19, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(${x0 - 30} ${(y0 + y1) / 2}) rotate(-90)">` + text(0, 0, "表面能 γ →（低）", { size: 19, anchor: "middle", weight: "bold" }) + `</g>`;
  b += lines(x1 - 14, y1 + 34, ["理想区", "高 ε + 低 γ"], { size: 19, anchor: "end", weight: "bold", fill: COL.amber, lh: 24 });
  const pt = (x, y, lab, c, o = {}) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/>` + text(x + (o.dx ?? 20), y + 6 + (o.dy || 0), lab, { size: 19, weight: "bold", fill: c, anchor: o.anchor || "start" });
  b += pt(150, 110, "PDMS（硅氧烷类）", COL.purple);
  b += pt(440, 300, "PVDF", COL.teal);
  b += pt(390, 330, "PVDF–HFP", COL.teal, { dx: -20, anchor: "end" });
  b += pt(500, 360, "离聚物", COL.amber, { dy: 0 });
  b += pt(300, 260, "PEO", COL.siDark);
  b += arrow(185, 128, 330, 150, { color: COL.purple, width: 2.5, head: 11, dash: "6 5" });
  b += arrow(450, 286, 480, 190, { color: COL.teal, width: 2.5, head: 11, dash: "6 5" });
  b += text(x0 + 10, y0 - 12, "定性示意，位置不按实测值", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

module.exports = figs;
