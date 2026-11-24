// Figures for Ko et al. 2026, Chapter 3 (Computational prediction). ~96 px per slide inch.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;
const { rect, line, circle, ellipse, path, solvated, potAxis, card, mol, flow } = require("./figlib");

const figs = {};
const cat = (x, y, r = 13) => ion(x, y, { r, fill: COL.purple });
const an = (x, y, r = 13) => ion(x, y, { r, fill: COL.red, label: "−" });

// ---------- Title: ordered lattice dissolving into liquid ----------
figs.title_motif3 = () => {
  const W = 520, H = 620;
  let b = "";
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) b += (i + j) % 2 ? an(70 + i * 52, 70 + j * 52, 16) : cat(70 + i * 52, 70 + j * 52, 16);
  const R = rng(12);
  for (let k = 0; k < 16; k++) {
    const x = 230 + R() * 250, y = 330 + R() * 250;
    b += k % 2 ? an(x, y, 16) : cat(x, y, 16);
  }
  b += arrow(250, 230, 330, 320, { color: COL.amberLight, width: 5, head: 18 });
  b += `<circle cx="355" cy="455" r="150" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 10" opacity="0.5"/>`;
  return svg(W, H, b);
};

// ---------- Roadmap figure ----------
figs.roadmap3 = () => {
  const W = 520, H = 210;
  let b = "";
  b += rect(10, 30, 140, 70, COL.light, { rx: 12 }) + lines(80, 60, ["晶体", "好算"], { size: 18, anchor: "middle", weight: "bold", lh: 24 });
  b += rect(190, 30, 140, 70, "#FBEDEC", { rx: 12 }) + lines(260, 60, ["液体", "难算"], { size: 18, anchor: "middle", weight: "bold", fill: COL.red, lh: 24 });
  b += rect(370, 30, 140, 70, "#E8F4F3", { rx: 12 }) + lines(440, 60, ["液体 Madelung", "能算"], { size: 17, anchor: "middle", weight: "bold", fill: COL.teal, lh: 24 });
  b += arrow(152, 65, 186, 65, { color: COL.muted, width: 3, head: 11 }) + arrow(332, 65, 366, 65, { color: COL.muted, width: 3, head: 11 });
  b += text(260, 150, "目标：预测 Li⁺ 的静电势 → ΔE", { size: 18, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- 100 years of solution electrostatics ----------
figs.timeline3 = () => {
  const W = 1240, H = 430;
  const ev = [
    { year: "1918", who: ["Madelung"], what: ["晶体中离子的", "静电能"], color: COL.text2 },
    { year: "1923", who: ["Debye & Hückel"], what: ["稀溶液的", "离子氛理论"], color: COL.purple },
    { year: "1936", who: ["Scatchard"], what: ["离子相互作用", "模型"], color: COL.purple },
    { year: "1957", who: ["Alder & Wainwright"], what: ["第一次分子", "动力学模拟"], color: COL.teal },
    { year: "1963", who: ["Widom"], what: ["粒子插入法", "求化学势"], color: COL.teal },
    { year: "1973", who: ["Pitzer"], what: ["Pitzer 模型", "（多参数拟合）"], color: COL.purple },
    { year: "1975", who: ["Blum"], what: ["平均球近似", "MSA"], color: COL.amber },
    { year: "1981", who: ["Hirata & Rossky", "Tomasi 等"], what: ["RISM 扩展", "PCM 连续溶剂"], color: COL.amber },
    { year: "2024", who: ["Takenaka, Ko 等"], what: ["液体", "Madelung 势"], color: COL.red },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 210, left: 90, right: 1130, whoSize: 18, whatSize: 17, yearSize: 26 }));
};

// ---------- HOMO/LUMO window picture (Goodenough-Kim style) ----------
figs.homo_lumo = () => {
  const W = 660, H = 470;
  let b = "";
  b += line(50, 440, 50, 30, COL.ink, 3) + head(50, 18, -Math.PI / 2, COL.ink, 14);
  b += `<g transform="translate(30 240) rotate(-90)">` + text(0, 0, "电子能量（越往上越高）", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 }) + `</g>`;
  // anode
  b += rect(80, 60, 150, 330, "#B9C3CC");
  b += line(80, 130, 230, 130, COL.purple, 5) + text(155, 120, "μ_{A}（负极）", { size: 17, anchor: "middle", weight: "bold", fill: COL.purple });
  // cathode
  b += rect(430, 60, 150, 330, COL.amberLight);
  b += line(430, 330, 580, 330, COL.amber, 5) + text(505, 360, "μ_{C}（正极）", { size: 17, anchor: "middle", weight: "bold", fill: COL.ink });
  // electrolyte
  b += rect(230, 60, 200, 330, COL.electrolyte);
  b += line(240, 160, 420, 160, COL.teal, 4) + text(330, 150, "LUMO", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += line(240, 300, 420, 300, COL.teal, 4) + text(330, 325, "HOMO", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += arrow(330, 170, 330, 288, { color: COL.teal, width: 2.5, head: 10 }) + arrow(330, 288, 330, 172, { color: COL.teal, width: 2.5, head: 10 });
  b += text(342, 236, "E_{g}", { size: 18, weight: "bold", fill: COL.teal });
  b += lines(330, 420, ["“窗口”= LUMO 与 HOMO 之间", "μ_{A} 高于 LUMO → 电解液被还原；μ_{C} 低于 HOMO → 被氧化"], { size: 16, anchor: "middle", weight: "bold", lh: 24 });
  b += arrow(232, 128, 300, 160, { color: COL.red, width: 2.5, head: 10, dash: "5 4" });
  return svg(W, H, b);
};

// ---------- Thermodynamic cycle for a reduction potential ----------
figs.thermo_cycle = () => {
  const W = 680, H = 450;
  let b = "";
  const box = (x, y, t, c) => rect(x, y, 200, 56, "#FFFFFF", { rx: 12, stroke: c, sw: 2.5 }) + text(x + 100, y + 35, t, { size: 18, anchor: "middle", weight: "bold", fill: c });
  b += text(20, 40, "气相（孤立分子）", { size: 16, weight: "bold", fill: COL.muted });
  b += text(20, 300, "溶液中", { size: 16, weight: "bold", fill: COL.muted });
  b += box(40, 60, "A(g) + e^{−}", COL.ink) + box(440, 60, "A^{−}(g)", COL.ink);
  b += box(40, 320, "A(sol) + e^{−}", COL.teal) + box(440, 320, "A^{−}(sol)", COL.teal);
  b += arrow(244, 88, 436, 88, { color: COL.ink, width: 3, head: 13 });
  b += text(340, 145, "ΔG_{gas}：LUMO 只反映这一步", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += arrow(140, 120, 140, 316, { color: COL.purple, width: 3, head: 13 }) + text(152, 220, "ΔG_{solv}(A)", { size: 16, weight: "bold", fill: COL.purple });
  b += arrow(540, 120, 540, 316, { color: COL.purple, width: 3, head: 13 }) + text(528, 220, "ΔG_{solv}(A^{−})", { size: 16, anchor: "end", weight: "bold", fill: COL.purple });
  b += arrow(244, 348, 436, 348, { color: COL.teal, width: 4, head: 14 });
  b += text(340, 400, "ΔG_{red}(sol) = ΔG_{gas} + ΔG_{solv}(A^{−}) − ΔG_{solv}(A)", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(340, 432, "E_{red} = −ΔG_{red}/F − 1.40 V（换算到 vs Li^{+}/Li）", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- Methods by length/time scale ----------
figs.methods_scale = () => {
  const W = 680, H = 460;
  let b = "";
  const X0 = 90, X1 = 650, Y0 = 380, Y1 = 30;
  b += line(X0, Y0, X1, Y0, COL.ink, 2.5) + head(X1 + 10, Y0, 0, COL.ink, 12);
  b += line(X0, Y0, X0, Y1, COL.ink, 2.5) + head(X0, Y1 - 10, -Math.PI / 2, COL.ink, 12);
  ["0.1 nm", "1 nm", "10 nm", "1 μm"].forEach((t, i) => (b += text(X0 + 40 + i * 160, Y0 + 26, t, { size: 16, anchor: "middle", fill: COL.text2 })));
  ["fs", "ps", "ns", "μs", "h"].forEach((t, i) => (b += text(X0 - 10, Y0 - 30 - i * 78, t, { size: 16, anchor: "end", fill: COL.text2 })));
  b += text((X0 + X1) / 2, Y0 + 56, "空间尺度", { size: 16, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(${X0 - 52} ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "时间尺度", { size: 16, anchor: "middle", weight: "bold" }) + `</g>`;
  const B = (x, y, w, h, c, t) => rect(x, y, w, h, c, { rx: 12, opacity: 0.9 }) + lines(x + w / 2, y + h / 2 + 6 - (t.length - 1) * 10, t, { size: 16, anchor: "middle", weight: "bold", fill: "#FFFFFF", lh: 20 });
  b += B(105, 290, 120, 70, COL.purple, ["DFT", "量子化学"]);
  b += B(150, 215, 140, 60, COL.purple, ["从头算 MD"]);
  b += B(330, 110, 190, 70, COL.teal, ["经典 MD", "液体 Madelung"]);
  b += B(440, 220, 190, 60, COL.siDark, ["PCM / MSA / RISM"]);
  b += path("M228,330 C330,330 390,280 410,186", COL.amber, 3.5, { dash: "8 6" }) + head(411, 182, -1.4, COL.amber, 13);
  b += text(240, 352, "机器学习势：DFT 精度 + MD 尺度", { size: 16, weight: "bold", fill: COL.amber });
  b += B(500, 40, 140, 60, COL.red, ["真实电池", "μm · 小时"]);
  return svg(W, H, b);
};

// ---------- Madelung lattice ----------
figs.madelung_lattice = () => {
  const W = 620, H = 440;
  let b = "";
  const cx = 250, cy = 200, a = 62;
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 2; j++) {
    const x = cx + i * a, y = cy + j * a;
    if (Math.abs(i) <= 1 && Math.abs(j) <= 1 && !(i === 0 && j === 0)) b += line(cx, cy, x, y, COL.amber, 2, { dash: "4 4" });
  }
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 2; j++) {
    const x = cx + i * a, y = cy + j * a;
    b += (i + j) % 2 === 0 ? cat(x, y, 17) : an(x, y, 17);
  }
  b += circle(cx, cy, 25, "none", { stroke: COL.amber, sw: 4 });
  b += rect(20, 380, 580, 50, "#FDF2E7", { rx: 12 });
  b += text(310, 412, "E = −M · z^{2}e^{2} / (4πε_{0}r_{0})，NaCl：M ≈ 1.748", { size: 18, anchor: "middle", weight: "bold", fill: COL.amber });
  b += lines(470, 150, ["位置固定", "→ 逐个加和", "所有离子的", "库仑作用"], { size: 17, anchor: "start", weight: "bold", fill: COL.text2, lh: 26 });
  return svg(W, H, b);
};

// ---------- Fig. 3a: bridge between dilute solutions and crystals ----------
figs.bridge = () => {
  const W = 1180, H = 300;
  let b = "";
  const panel = (x, w, t, s, c, fill) => rect(x, 20, w, 200, fill, { rx: 14, stroke: c, sw: 3 }) + text(x + w / 2, 255, t, { size: 19, anchor: "middle", weight: "bold", fill: c }) + text(x + w / 2, 285, s, { size: 16, anchor: "middle", fill: COL.text2 });
  b += panel(20, 340, "极稀溶液", "Debye–Hückel 理论（1923）", "#3A7CA5", COL.electrolyte);
  b += panel(420, 340, "液态电解质（真实电池）", "液体 Madelung 能（2024）", COL.red, "#FBEDEC");
  b += panel(820, 340, "固体（晶体）", "Madelung 能（1918）", COL.siDark, COL.light);
  // dilute: few ions far apart
  [[80, 70], [270, 100], [150, 170], [310, 180]].forEach(([x, y], i) => (b += i % 2 ? an(x, y) : cat(x, y)));
  // liquid: crowded random
  const R = rng(5);
  for (let k = 0; k < 22; k++) {
    const x = 445 + R() * 290, y = 40 + R() * 165;
    b += k % 3 === 2 ? ellipse(x, y, 13, 8, COL.tealLight, { stroke: COL.teal }) : k % 3 ? an(x, y, 12) : cat(x, y, 12);
  }
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) b += (i + j) % 2 ? an(860 + i * 52, 60 + j * 60, 14) : cat(860 + i * 52, 60 + j * 60, 14);
  b += arrow(362, 120, 416, 120, { color: COL.muted, width: 3, head: 12 }) + arrow(818, 120, 764, 120, { color: COL.muted, width: 3, head: 12 });
  return svg(W, H, b);
};

// ---------- Debye–Hückel ionic atmosphere ----------
figs.dh_atmosphere = () => {
  const W = 620, H = 420;
  let b = "";
  const cx = 230, cy = 190;
  b += circle(cx, cy, 150, "#FBEDEC");
  b += circle(cx, cy, 95, "#F6D9D7");
  b += circle(cx, cy, 150, "none", { stroke: COL.red, sw: 2, dash: "7 6" });
  const R = rng(9);
  for (let k = 0; k < 14; k++) {
    const a = R() * Math.PI * 2, r = 50 + R() * 95;
    b += an(cx + r * Math.cos(a), cy + r * Math.sin(a), 13);
  }
  for (let k = 0; k < 5; k++) {
    const a = R() * Math.PI * 2, r = 90 + R() * 55;
    b += cat(cx + r * Math.cos(a), cy + r * Math.sin(a), 13);
  }
  b += cat(cx, cy, 20);
  b += arrow(cx, cy + 22, cx, cy + 148, { color: COL.ink, width: 3, head: 11 });
  b += text(cx + 10, cy + 172, "κ^{−1}（Debye 长度）", { size: 16, weight: "bold" });
  b += lines(410, 90, ["中心离子周围", "异号离子略多", "= “离子氛”"], { size: 17, weight: "bold", fill: COL.red, lh: 26 });
  b += lines(410, 220, ["假设：", "· 极稀、完全电离", "· 点电荷、不可极化", "· 溶剂 = 均匀介电体"], { size: 16, fill: COL.text2, lh: 26 });
  b += text(310, 400, "离子氛的电荷把中心离子的电场“屏蔽”掉一部分", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Molecular-level theories: MSA / RISM / PCM ----------
figs.molecular_theories = () => {
  const W = 1180, H = 330;
  let b = "";
  const panel = (x, t, s, c) => rect(x, 20, 360, 230, "#FFFFFF", { rx: 14, stroke: c, sw: 3 }) + text(x + 180, 282, t, { size: 19, anchor: "middle", weight: "bold", fill: c }) + text(x + 180, 312, s, { size: 16, anchor: "middle", fill: COL.text2 });
  b += panel(20, "平均球近似 MSA", "离子 = 有大小的硬球 + 连续溶剂", COL.purple);
  b += panel(410, "RISM", "溶剂分子按“位点”统计排布", COL.teal);
  b += panel(800, "连续溶剂模型 PCM", "溶质量子化学 + 周围介电连续体", COL.amber);
  // MSA: hard spheres in uniform background
  b += rect(40, 40, 320, 190, COL.electrolyte, { rx: 10 });
  [[90, 90, 28], [190, 150, 22], [290, 90, 26], [250, 190, 20], [120, 190, 24]].forEach(([x, y, r], i) => (b += circle(x, y, r, i % 2 ? COL.redLight : COL.purpleLight, { stroke: i % 2 ? COL.red : COL.purple, sw: 3 })));
  // RISM: central ion + radial distribution
  b += cat(560, 135, 16);
  [55, 95].forEach((r, k) => {
    for (let i = 0; i < (k ? 12 : 7); i++) {
      const a = (i / (k ? 12 : 7)) * Math.PI * 2;
      b += ellipse(560 + r * Math.cos(a), 135 + r * Math.sin(a), 12, 7, k ? COL.tealLight : COL.teal, { rot: ((a * 180) / Math.PI).toFixed(0) });
    }
  });
  b += circle(560, 135, 55, "none", { stroke: COL.teal, sw: 1.5, dash: "4 4" }) + circle(560, 135, 95, "none", { stroke: COL.teal, sw: 1.5, dash: "4 4" });
  // PCM: molecule in cavity inside dielectric
  b += rect(820, 40, 320, 190, "#FDF2E7", { rx: 10 });
  b += path("M930,90 C960,60 1020,60 1040,95 C1065,130 1040,180 990,185 C940,190 900,160 905,130 C908,110 915,100 930,90 Z", COL.amber, 3, { fill: "#FFFFFF" });
  b += ellipse(975, 125, 26, 16, COL.amber) + ellipse(1005, 145, 14, 10, COL.red);
  b += text(1000, 222, "ε（介电常数）", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  return svg(W, H, b);
};

// ---------- MD box with Widom insertion ----------
figs.md_box = () => {
  const W = 700, H = 430;
  let b = "";
  b += rect(40, 30, 300, 300, COL.electrolyte, { stroke: COL.ink, sw: 3 });
  // periodic images (faint)
  b += rect(340, 30, 140, 300, COL.electrolyte, { opacity: 0.4 }) + line(340, 30, 340, 330, COL.ink, 2, { dash: "6 5" });
  const R = rng(21);
  const pts = [];
  for (let k = 0; k < 20; k++) pts.push([60 + R() * 260, 50 + R() * 260, k % 4]);
  pts.forEach(([x, y, t]) => {
    b += t === 0 ? cat(x, y, 14) : t === 1 ? an(x, y, 14) : ellipse(x, y, 13, 8, COL.teal, { rot: Math.round(R() * 180) });
    if (x < 140) b += t === 0 ? cat(x + 300, y, 14).replace(/<circle/, '<circle opacity="0.4"') : "";
  });
  b += circle(250, 180, 18, "none", { stroke: COL.amber, sw: 3, dash: "5 4" });
  b += text(250, 186, "?", { size: 20, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(500, 70, "Widom 插入法", { size: 18, weight: "bold", fill: COL.amber });
  b += lines(500, 98, ["随机“试放”一个粒子，", "统计能量 → 化学势"], { size: 17, fill: COL.text2, lh: 22 });
  b += text(500, 170, "周期性边界", { size: 18, weight: "bold", fill: COL.ink });
  b += lines(500, 198, ["盒子在各方向无限复制，", "电势零点不唯一"], { size: 17, fill: COL.text2, lh: 22 });
  b += text(500, 270, "电中性约束", { size: 18, weight: "bold", fill: COL.red });
  b += lines(500, 298, ["只能整体加“中性盐”，", "单个离子的值难分离"], { size: 17, fill: COL.text2, lh: 22 });
  b += text(190, 370, "经典分子动力学（显式离子与溶剂）", { size: 17, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Liquid Madelung potential concept ----------
figs.liquid_madelung = () => {
  const W = 660, H = 440;
  let b = "";
  const cx = 250, cy = 210;
  b += circle(cx, cy, 190, COL.electrolyte);
  const R = rng(33);
  const sp = [];
  for (let k = 0; k < 26; k++) {
    const a = R() * Math.PI * 2, r = 55 + R() * 125;
    sp.push([cx + r * Math.cos(a), cy + r * Math.sin(a), k % 3]);
  }
  sp.forEach(([x, y, t], k) => {
    if (k < 9) b += line(cx, cy, x, y, COL.amber, 1.8, { dash: "4 4" });
  });
  sp.forEach(([x, y, t]) => {
    if (t === 0) b += an(x, y, 13);
    else if (t === 1) b += cat(x, y, 13);
    else {
      const a = Math.atan2(cy - y, cx - x);
      b += ellipse(x, y, 15, 8, COL.tealLight, { stroke: COL.teal, rot: ((a * 180) / Math.PI).toFixed(0) });
      b += arrow(x - 9 * Math.cos(a), y - 9 * Math.sin(a), x + 12 * Math.cos(a), y + 12 * Math.sin(a), { color: COL.teal, width: 2, head: 7 });
    }
  });
  b += cat(cx, cy, 20);
  b += circle(cx, cy, 28, "none", { stroke: COL.amber, sw: 3 });
  b += text(470, 70, "电荷项", { size: 18, weight: "bold", fill: COL.red });
  b += lines(470, 96, ["周围离子 q_{i}", "在距离 r_{i} 处"], { size: 17, fill: COL.text2, lh: 24 });
  b += text(470, 180, "偶极项", { size: 18, weight: "bold", fill: COL.teal });
  b += lines(470, 206, ["溶剂偶极矩 μ_{i}", "（箭头）"], { size: 16, fill: COL.text2, lh: 24 });
  b += text(470, 290, "⟨ ⟩ 平均", { size: 18, weight: "bold", fill: COL.amber });
  b += lines(470, 316, ["对很多 MD 帧（时间）", "和所有 Li⁺（空间）", "求平均"], { size: 16, fill: COL.text2, lh: 24 });
  return svg(W, H, b);
};

// ---------- Caveats ----------
figs.caveats = () => {
  const W = 1180, H = 180;
  let b = "";
  const items = [
    { t: "有限尺寸", s: ["模拟盒子只有几纳米，", "长程静电被“截断”"], c: COL.purple },
    { t: "采样收敛", s: ["离子聚集的液体弛豫慢，", "需要很长的模拟"], c: COL.teal },
    { t: "力场参数", s: ["部分电荷、Lennard–Jones", "参数选法影响结果"], c: COL.amber },
    { t: "熵的贡献", s: ["只算了静电（焓），", "配位/聚集/螯合的熵未计"], c: COL.red },
  ];
  items.forEach((it, i) => (b += card(20 + i * 290, 10, 270, 160, it.t, it.s, it.c, { bs: 18, th: 46, ts: 20 })));
  return svg(W, H, b);
};

// ---------- Method comparison matrix ----------
figs.methods_map = () => {
  const W = 1180, H = 420;
  let b = "";
  const cols = ["适用于浓溶液", "包含分子结构", "单离子静电势", "无需拟合参数"];
  const rows = [
    ["Debye–Hückel（1923）", [0, 0, 1, 1]],
    ["扩展 DH / Pitzer（1936–1973）", [1, 0, 0, 0]],
    ["MSA / RISM / PCM（1970s–90s）", [2, 1, 2, 1]],
    ["经典 MD + Widom 等", [1, 1, 0, 2]],
    ["液体 Madelung 势（2024）", [1, 1, 1, 2]],
  ];
  const x0 = 430, cw = 180;
  cols.forEach((c, j) => {
    b += rect(x0 + j * cw + 6, 10, cw - 12, 44, COL.ink, { rx: 22 });
    b += text(x0 + j * cw + cw / 2, 39, c, { size: 17, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  });
  rows.forEach(([n, v], i) => {
    const y = 70 + i * 66;
    b += rect(10, y, x0 + 4 * cw - 10, 58, i === 4 ? "#FBEDEC" : i % 2 ? "#FFFFFF" : "#F5F7F9", { rx: 12 });
    b += text(30, y + 36, n, { size: 18, weight: "bold", fill: i === 4 ? COL.red : COL.ink });
    v.forEach((k, j) => {
      const x = x0 + j * cw + cw / 2;
      if (k === 1) b += check(x, y + 29, 12);
      else if (k === 0) b += cross(x, y + 29, 10);
      else b += text(x, y + 37, "部分", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
    });
  });
  b += text(590, 410, "本表据原文正文整理，为定性比较；“部分”表示需要近似或依赖经验参数", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

module.exports = figs;
