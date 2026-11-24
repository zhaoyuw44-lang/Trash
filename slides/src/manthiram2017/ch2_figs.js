// Figures for Manthiram, Yu & Wang 2017, Chapter 2 (Inorganic solid electrolytes)
// Canvas widths ≈ 100 px per slide inch; body text in figures ≥ 17 px.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const circ = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, dash) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts.map(([x, y]) => `${(+x).toFixed(1)},${(+y).toFixed(1)}`).join(" ")}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}" stroke-linejoin="round"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const diamond = (x, y, r, fill, o) => poly([[x, y - r], [x + r, y], [x, y + r], [x - r, y]], fill, o);
const tri = (x, y, r, fill, o, up = true) => {
  const s = up ? 1 : -1;
  return poly([[x, y - r * s], [x + r * 0.87, y + r * 0.5 * s], [x - r * 0.87, y + r * 0.5 * s]], fill, o);
};
const tag = (x, y, t, c, w, size = 18) => rect(x - w / 2, y - size - 3, w, size + 12, "#FFFFFF", { rx: (size + 12) / 2, opacity: 0.92 }) + text(x, y, t, { size, anchor: "middle", fill: c, weight: "bold" });

// ---------- Title motif: corner-sharing polyhedral framework ----------
figs.title_motif = () => {
  const W = 520, H = 560;
  let b = "";
  b += rect(30, 60, 460, 440, "none", { rx: 26, stroke: "#FFFFFF", sw: 6, opacity: 0.85 });
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const x = 100 + c * 105, y = 130 + r * 100;
      b += diamond(x, y, 38, "#FFFFFF", { opacity: 0.16 });
      b += diamond(x, y, 38, "none", { stroke: "#9FB0C0", sw: 2.5 });
      if (c < 3) b += tri(x + 52, y + (r % 2 ? 22 : -22), 18, COL.amberLight, { opacity: 0.9 }, r % 2 === 0);
    }
  let d = "M40,178";
  [[100, 180], [152, 230], [205, 180], [257, 230], [310, 280], [362, 330], [415, 280], [480, 280]].forEach(([x, y]) => (d += ` L${x},${y}`));
  b += `<path d="${d}" fill="none" stroke="${COL.amber}" stroke-width="4" stroke-dasharray="10 8" stroke-linejoin="round"/>`;
  b += head(492, 280, 0, COL.amber, 20);
  [[152, 230], [257, 230], [362, 330]].forEach(([x, y]) => (b += ion(x, y, { r: 15 })));
  return svg(W, H, b);
};

// ---------- Required properties checklist ----------
figs.properties = () => {
  const W = 700, H = 500;
  let b = "";
  const G = [
    { t: "传输", col: COL.purple, f: "#F1ECF8", items: ["离子电导率高", "离子面电阻 (ASR) 低", "电子面电阻高", "离子选择性高"] },
    { t: "稳定", col: COL.teal, f: "#E8F4F3", items: ["电化学窗口宽", "与电极化学相容", "热稳定性好"] },
    { t: "力学", col: COL.siDark, f: "#F1F3F5", items: ["力学性能好", "（强度、韧性、弹性）"] },
    { t: "制造", col: COL.amber, f: "#FDF2E7", items: ["工艺简单、成本低", "易于器件集成", "环境友好"] },
  ];
  G.forEach((g, i) => {
    const x = 10 + (i % 2) * 345, y = 10 + Math.floor(i / 2) * 245;
    b += rect(x, y, 335, 232, g.f, { rx: 18 });
    b += pill(x + 18, y + 16, 96, 38, g.col, g.t, { size: 21 });
    g.items.forEach((it, k) => {
      const yy = y + 92 + k * 38;
      if (!it.startsWith("（")) b += check(x + 34, yy - 7, 9, g.col, 3.5);
      b += text(x + 58, yy, it, { size: 19, fill: COL.ink, weight: it.startsWith("（") ? undefined : "bold" });
    });
  });
  return svg(W, H, b);
};

// ---------- Timeline of inorganic Li+ conductors ----------
figs.timeline = () => {
  const W = 1240, H = 430;
  const ev = [
    { year: "1976", who: ["Goodenough, Hong"], what: ["NASICON", "钠离子骨架导体"], color: COL.purple },
    { year: "1978", who: ["Hong"], what: ["LISICON", "Li_{14}Zn(GeO_{4})_{4}"], color: COL.purple },
    { year: "1981", who: ["Mercier 等"], what: ["Li_{2}S–P_{2}S_{5}–LiI", "硫化物玻璃"], color: COL.amber },
    { year: "1990", who: ["Aono 等"], what: ["LATP", "Al 掺杂 NASICON"], color: COL.purple },
    { year: "1993", who: ["Inaguma 等"], what: ["LLTO 钙钛矿", "晶内 ~10^{−3} S cm^{−1}"], color: COL.purple },
    { year: "2001", who: ["Kanno & Murayama"], what: ["thio-LISICON", "Li_{2}S–GeS_{2}–P_{2}S_{5}"], color: COL.amber },
    { year: "2007", who: ["Murugan, Weppner 等"], what: ["石榴石 LLZO", "Li_{7}La_{3}Zr_{2}O_{12}"], color: COL.purple },
    { year: "2011", who: ["Kamaya, Kanno 等"], what: ["LGPS", "1.2×10^{−2} S cm^{−1}"], color: COL.amber },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 210, left: 115, right: 1125, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Perovskite LLTO ----------
figs.perovskite = () => {
  const W = 640, H = 500;
  let b = "";
  b += rect(10, 10, 450, 450, "#F7F9FB", { rx: 14, stroke: COL.line });
  const P = (i) => 60 + i * 110;
  // A sites (cube corners in projection) at the centres between octahedra
  const A = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) A.push([5 + P(c) , 5 + P(r)]);
  // TiO6 octahedra at body centres
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const x = P(c) + 60, y = P(r) + 60;
      b += diamond(x, y, 52, COL.tealLight, { stroke: COL.teal, sw: 2 });
      b += circ(x, y, 10, COL.teal);
      [[0, -52], [52, 0], [0, 52], [-52, 0]].forEach(([dx, dy]) => (b += circ(x + dx, y + dy, 8, COL.red)));
    }
  // A-site occupancy pattern: La / Li / vacancy
  const pat = ["La", "Li", "La", "v", "v", "La", "Li", "La", "La", "v", "La", "Li", "Li", "La", "v", "La"];
  A.forEach(([x, y], i) => {
    const k = pat[i];
    if (k === "La") b += circ(x, y, 20, COL.amber);
    else if (k === "Li") b += ion(x, y, { r: 14 });
    else b += circ(x, y, 15, "none", { stroke: COL.purple, sw: 2.5, dash: "4 4" });
  });
  b += arrow(A[1][0] + 16, A[1][1] + 14, A[5][0] - 10, A[5][1] - 70, { color: COL.amber, width: 3.5, head: 12 });
  b += arrow(A[6][0] - 16, A[6][1] + 2, A[4][0] + 18, A[4][1] - 2, { color: COL.amber, width: 3.5, head: 12 });
  // legend
  const lx = 480;
  b += diamond(lx + 18, 56, 18, COL.tealLight, { stroke: COL.teal, sw: 2 }) + text(lx + 46, 63, "TiO_{6}", { size: 19, weight: "bold", fill: COL.teal });
  b += circ(lx + 18, 112, 15, COL.amber) + text(lx + 46, 119, "La^{3+}", { size: 19, weight: "bold", fill: COL.amber });
  b += ion(lx + 18, 166, { r: 13 }) + text(lx + 46, 173, "Li^{+}", { size: 19, weight: "bold", fill: COL.purple });
  b += circ(lx + 18, 220, 13, "none", { stroke: COL.purple, sw: 2.5, dash: "4 4" }) + text(lx + 46, 227, "A 位空位", { size: 19, weight: "bold", fill: COL.purple });
  b += circ(lx + 18, 272, 8, COL.red) + text(lx + 46, 279, "O^{2−}", { size: 19, weight: "bold", fill: COL.red });
  b += lines(lx, 340, ["Li⁺ 借 A 位", "空位跳跃，", "要挤过 4 个 O", "围成的“瓶颈”"], { size: 18, fill: COL.text2, lh: 26 });
  b += text(10, 492, "ABO_{3} 钙钛矿投影示意：Ti 在八面体中心，La/Li/空位共占 A 位", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- LLTO's two weak points ----------
figs.llto_weak = () => {
  const W = 760, H = 440;
  let b = "";
  // panel 1: grain boundaries
  b += text(185, 32, "① 晶界电阻", { size: 21, anchor: "middle", weight: "bold", fill: COL.red });
  const R = rng(12);
  const cells = [[75, 112], [180, 100], [292, 116], [98, 216], [202, 208], [306, 222], [84, 318], [192, 314], [300, 322]];
  cells.forEach(([x, y], i) => (b += blob(x, y, 52, 70 + i, { fill: "#DCEFEC", stroke: COL.red, sw: 4, jag: 0.06, n: 6 })));
  b += arrow(40, 214, 168, 210, { color: COL.teal, width: 4, head: 12 });
  b += arrow(228, 208, 346, 222, { color: COL.teal, width: 4, head: 12 });
  b += cross(200, 208, 10, COL.red, 4);
  b += text(185, 404, "晶粒内快，跨晶界慢", { size: 18, anchor: "middle", weight: "bold", fill: COL.ink });
  b += text(185, 430, "晶内 ~10^{−3}，总电导 ~10^{−5} S cm^{−1}", { size: 17, anchor: "middle", fill: COL.text2 });
  // panel 2: Ti4+ reduction by Li metal
  const X = 410;
  b += text(X + 165, 32, "② 遇 Li 金属被还原", { size: 21, anchor: "middle", weight: "bold", fill: COL.red });
  b += rect(X, 60, 90, 300, "#B9C3CC");
  b += text(X + 45, 214, "Li", { size: 24, anchor: "middle", weight: "bold" });
  b += rect(X + 90, 60, 250, 300, "#DCEFEC");
  b += rect(X + 90, 60, 90, 300, "#3E4C59");
  b += text(X + 135, 120, "变黑", { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += lines(X + 135, 190, ["Ti^{4+}", "↓", "Ti^{3+}"], { size: 20, anchor: "middle", fill: "#FFFFFF", weight: "bold", lh: 30 });
  b += electron(X + 60, 300, 13);
  b += arrow(X + 76, 300, X + 168, 300, { color: COL.amber, width: 3.5, head: 12 });
  b += arrow(X + 186, 230, X + 250, 230, { color: COL.red, width: 3.5, head: 12, dash: "6 5" });
  b += lines(X + 262, 200, ["还原层", "向内", "扩展"], { size: 18, fill: COL.red, weight: "bold", lh: 24 });
  b += text(X + 165, 404, "电子能进入电解质", { size: 18, anchor: "middle", weight: "bold", fill: COL.ink });
  b += text(X + 165, 430, "→ 变成混合导体，失去隔离作用", { size: 17, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- NASICON framework ----------
figs.nasicon = () => {
  const W = 660, H = 480;
  let b = "";
  b += rect(10, 10, 440, 440, "#F7F9FB", { rx: 14, stroke: COL.line });
  const lantern = (x, y) =>
    diamond(x, y - 62, 30, COL.tealLight, { stroke: COL.teal, sw: 2 }) +
    tri(x - 36, y, 17, COL.amberLight, { stroke: COL.amber, sw: 2 }) +
    tri(x, y, 17, COL.amberLight, { stroke: COL.amber, sw: 2 }) +
    tri(x + 36, y, 17, COL.amberLight, { stroke: COL.amber, sw: 2 }) +
    diamond(x, y + 62, 30, COL.tealLight, { stroke: COL.teal, sw: 2 });
  [90, 230, 370].forEach((x) => [125, 335].forEach((y) => (b += lantern(x, y))));
  const Ls = [[160, 125], [160, 230], [300, 230], [300, 335], [160, 335]];
  Ls.forEach(([x, y]) => (b += ion(x, y, { r: 14 })));
  b += arrow(160, 143, 160, 212, { color: COL.purple, width: 3.5, head: 12 });
  b += arrow(178, 230, 282, 230, { color: COL.purple, width: 3.5, head: 12 });
  b += arrow(300, 248, 300, 317, { color: COL.purple, width: 3.5, head: 12 });
  b += arrow(282, 335, 178, 335, { color: COL.purple, width: 3.5, head: 12 });
  const lx = 470;
  b += diamond(lx + 18, 50, 18, COL.tealLight, { stroke: COL.teal, sw: 2 }) + text(lx + 46, 57, "MO_{6} 八面体", { size: 18, weight: "bold", fill: COL.teal });
  b += text(lx + 46, 84, "M = Ti、Ge、Zr", { size: 17, fill: COL.text2 });
  b += tri(lx + 18, 130, 16, COL.amberLight, { stroke: COL.amber, sw: 2 }) + text(lx + 46, 137, "PO_{4} 四面体", { size: 18, weight: "bold", fill: COL.amber });
  b += ion(lx + 18, 186, { r: 13 }) + text(lx + 46, 193, "Li^{+}", { size: 18, weight: "bold", fill: COL.purple });
  b += lines(lx, 258, ["2 个八面体夹", "3 个四面体，", "组成“灯笼”；", "灯笼之间的空隙", "连成三维通道"], { size: 18, fill: COL.text2, lh: 26 });
  b += text(10, 476, "AM_{2}(PO_{4})_{3} 骨架示意（未按真实晶体学比例）", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- NASICON tuning knobs ----------
figs.nasicon_doping = () => {
  const W = 700, H = 460;
  let b = "";
  // knob 1: M-site size ladder
  b += text(10, 30, "旋钮 ①：换 M 位离子 → 调节通道大小", { size: 20, weight: "bold", fill: COL.teal });
  const ions = [["Ge^{4+}", 0.53], ["Ti^{4+}", 0.605], ["Sn^{4+}", 0.69], ["Hf^{4+}", 0.71], ["Zr^{4+}", 0.72]];
  ions.forEach(([n, r], i) => {
    const x = 70 + i * 135;
    b += circ(x, 100, r * 52, COL.tealLight, { stroke: COL.teal, sw: 2 });
    b += text(x, 107, n, { size: 18, anchor: "middle", weight: "bold", fill: COL.ink });
    b += text(x, 160, `${r} Å`, { size: 17, anchor: "middle", fill: COL.text2 });
  });
  b += arrow(40, 186, 660, 186, { color: COL.muted, width: 3, head: 12 });
  b += text(40, 214, "离子越大，骨架越“松”，但 LiZr_{2}(PO_{4})_{3} 本身电导很低", { size: 17, fill: COL.text2 });
  // knob 2: aliovalent substitution
  b += text(10, 262, "旋钮 ②：Al^{3+} 换 Ti^{4+} → 多塞进 Li^{+}", { size: 20, weight: "bold", fill: COL.purple });
  b += rect(10, 282, 300, 76, "#F1ECF8", { rx: 14 });
  b += text(160, 330, "LiTi_{2}(PO_{4})_{3}", { size: 21, anchor: "middle", weight: "bold" });
  b += arrow(320, 320, 380, 320, { color: COL.purple, width: 4, head: 14 });
  b += rect(390, 282, 300, 76, COL.purple, { rx: 14 });
  b += text(540, 330, "Li_{1+x}Al_{x}Ti_{2−x}(PO_{4})_{3}", { size: 21, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += lines(20, 396, ["• 电荷补偿：每个 Al^{3+} 带进一个额外 Li^{+}", "• 致密度提高、晶界电阻降低 → 室温 ~10^{−4}–10^{−3} S cm^{−1}"], { size: 18, fill: COL.ink, lh: 30 });
  return svg(W, H, b);
};

// ---------- O vs S ----------
figs.o_vs_s = () => {
  const W = 640, H = 420;
  let b = "";
  const panel = (x, name, r, col, fill, bond, txt) => {
    let s = circ(x, 170, r, fill, { stroke: col, sw: 3 });
    s += text(x, 178, name, { size: 26, anchor: "middle", weight: "bold", fill: col });
    s += ion(x + r + bond, 170, { r: 16 });
    s += line(x + r, 170, x + r + bond - 16, 170, col, 4, "6 5");
    s += lines(x + 20, 330, txt, { size: 18, anchor: "middle", fill: COL.ink, lh: 28 });
    return s;
  };
  b += panel(120, "O^{2−}", 70, COL.red, "#FBEDEC", 18, ["半径 1.40 Å", "电负性大、难极化", "把 Li⁺ 抓得紧"]);
  b += panel(420, "S^{2−}", 92, COL.sulfur, COL.sulfurLight, 36, ["半径 1.84 Å", "更“软”、易极化", "Li⁺ 束缚弱、通道宽"]);
  b += text(320, 40, "O → S：LISICON 变成 thio-LISICON", { size: 21, anchor: "middle", weight: "bold", fill: COL.ink });
  b += arrow(250, 170, 310, 170, { color: COL.muted, width: 4, head: 14 });
  return svg(W, H, b);
};

// ---------- Sulfide glass → glass-ceramic ----------
figs.sulfide_glass = () => {
  const W = 760, H = 380;
  let b = "";
  const R = rng(5);
  const glassBox = (X) => {
    let s = rect(X, 30, 220, 240, "#FBF4DC", { rx: 14, stroke: COL.sulfur });
    for (let i = 0; i < 26; i++) {
      const x = X + 20 + R() * 180, y = 50 + R() * 200;
      s += line(x, y, x + (R() - 0.5) * 40, y + (R() - 0.5) * 40, "#C9A84A", 3);
    }
    return s;
  };
  b += glassBox(10);
  for (let i = 0; i < 7; i++) b += ion(40 + R() * 160, 60 + R() * 180, { r: 9 });
  b += text(120, 304, "玻璃 Glass", { size: 20, anchor: "middle", weight: "bold" });
  b += text(120, 332, "球磨或熔融淬冷制得", { size: 17, anchor: "middle", fill: COL.text2 });
  b += arrow(245, 150, 300, 150, { color: COL.red, width: 4, head: 14 });
  b += text(272, 128, "加热", { size: 18, anchor: "middle", fill: COL.red, weight: "bold" });
  b += glassBox(310);
  [[370, 100], [470, 180], [390, 220], [480, 80]].forEach(([x, y], i) => {
    b += poly([[x - 32, y - 18], [x + 28, y - 26], [x + 34, y + 18], [x - 26, y + 26]], COL.amberLight, { stroke: COL.amber, sw: 2.5 });
    b += ion(x, y, { r: 9 });
  });
  b += text(420, 304, "玻璃陶瓷 Glass-ceramic", { size: 20, anchor: "middle", weight: "bold" });
  b += text(420, 332, "析出高电导晶相（如 Li_{7}P_{3}S_{11}）", { size: 17, anchor: "middle", fill: COL.text2 });
  b += rect(560, 40, 190, 230, "#F5F7F9", { rx: 14 });
  b += lines(655, 90, ["为什么", "不直接用晶体？"], { size: 18, anchor: "middle", weight: "bold", lh: 26 });
  b += lines(655, 160, ["有些高电导相", "只能从玻璃中", "“长”出来（亚稳相）"], { size: 17, anchor: "middle", fill: COL.text2, lh: 26 });
  return svg(W, H, b);
};

// ---------- LGPS 1D channels ----------
figs.lgps = () => {
  const W = 560, H = 480;
  let b = "";
  b += rect(10, 10, 360, 440, "#F7F9FB", { rx: 14, stroke: COL.line });
  // columns of (Ge/P)S4 tetrahedra
  [70, 310].forEach((x) => {
    for (let k = 0; k < 5; k++) b += tri(x, 60 + k * 84, 34, COL.sulfurLight, { stroke: COL.sulfur, sw: 2.5 }, k % 2 === 0);
  });
  // LiS6 octahedra-ish backbone
  [140, 240].forEach((x) => {
    for (let k = 0; k < 5; k++) b += diamond(x, 60 + k * 84 + 42, 26, "#E6EAEE", { stroke: "#9AA6B2", sw: 2 });
  });
  // channel
  b += rect(168, 20, 46, 420, "#F1ECF8", { rx: 23 });
  for (let k = 0; k < 7; k++) b += ion(191, 48 + k * 60, { r: 13 });
  b += arrow(230, 360, 230, 80, { color: COL.amber, width: 4, head: 14 });
  b += text(244, 230, "c", { size: 22, weight: "bold", fill: COL.amber, italic: true });
  b += tri(400, 60, 18, COL.sulfurLight, { stroke: COL.sulfur, sw: 2.5 }) + text(426, 67, "(Ge/P)S_{4}", { size: 18, weight: "bold", fill: "#A67C00" });
  b += diamond(400, 112, 16, "#E6EAEE", { stroke: "#9AA6B2", sw: 2 }) + text(426, 119, "骨架", { size: 18, weight: "bold", fill: COL.siDark });
  b += ion(400, 164, { r: 13 }) + text(426, 171, "Li^{+}", { size: 18, weight: "bold", fill: COL.purple });
  b += lines(390, 240, ["沿 c 轴的", "一维 Li⁺ 通道", "（实际还有较弱", "的 ab 面传导）"], { size: 17, fill: COL.text2, lh: 26 });
  b += text(10, 474, "Li_{10}GeP_{2}S_{12} 结构示意（简化）", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Sulfide: soft (cold press) but moisture-sensitive ----------
figs.sulfide_pc = () => {
  const W = 1230, H = 330;
  let b = "";
  // oxide route
  b += text(10, 30, "氧化物", { size: 20, weight: "bold", fill: COL.purple });
  for (let i = 0; i < 9; i++) b += circ(30 + (i % 3) * 34, 70 + Math.floor(i / 3) * 34, 15, "#C9D2DA", { stroke: "#9AA6B2" });
  b += arrow(140, 104, 220, 104, { color: COL.red, width: 4, head: 14 });
  b += text(180, 86, ">1000 °C", { size: 17, anchor: "middle", fill: COL.red, weight: "bold" });
  b += rect(230, 66, 120, 76, "#C9D2DA", { rx: 6, stroke: "#9AA6B2" });
  b += text(290, 172, "高温烧结才能致密", { size: 18, anchor: "middle", fill: COL.ink, weight: "bold" });
  // sulfide route
  b += text(10, 222, "硫化物", { size: 20, weight: "bold", fill: COL.sulfur });
  for (let i = 0; i < 9; i++) b += circ(30 + (i % 3) * 34, 256 + Math.floor(i / 3) * 24, 13, COL.sulfurLight, { stroke: COL.sulfur });
  b += arrow(140, 280, 220, 280, { color: COL.teal, width: 4, head: 14 });
  b += text(180, 262, "室温冷压", { size: 17, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += rect(230, 246, 120, 66, COL.sulfurLight, { rx: 6, stroke: COL.sulfur });
  b += text(500, 290, "软、易变形 → 晶界电阻低", { size: 18, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += line(620, 10, 620, 320, COL.line, 2);
  // moisture
  b += text(650, 30, "怕水：遇潮放出 H_{2}S", { size: 20, weight: "bold", fill: COL.red });
  b += rect(660, 70, 170, 110, COL.sulfurLight, { rx: 10, stroke: COL.sulfur });
  b += text(745, 132, "Li_{2}S–P_{2}S_{5}", { size: 19, anchor: "middle", weight: "bold" });
  [[875, 86], [905, 132], [870, 176]].forEach(([x, y]) => (b += `<ellipse cx="${x}" cy="${y}" rx="28" ry="17" fill="#9CC9E0"/>` + text(x, y + 6, "H_{2}O", { size: 17, anchor: "middle", fill: COL.ink, weight: "bold" })));
  b += arrow(930, 125, 1010, 125, { color: COL.ink, width: 4, head: 14 });
  b += `<path d="M1040,170 C1020,140 1060,120 1040,90 C1025,70 1050,55 1045,40" fill="none" stroke="${COL.sulfur}" stroke-width="5" stroke-linecap="round"/>`;
  b += `<path d="M1090,170 C1070,140 1110,120 1090,90 C1075,70 1100,55 1095,40" fill="none" stroke="${COL.sulfur}" stroke-width="5" stroke-linecap="round"/>`;
  b += text(1150, 120, "H_{2}S↑", { size: 24, weight: "bold", fill: COL.red });
  b += text(1150, 150, "有毒", { size: 18, fill: COL.red, weight: "bold" });
  b += text(650, 236, "对策（原文）：加入金属氧化物；引入 O 原子", { size: 18, fill: COL.ink, weight: "bold" });
  b += text(650, 266, "→ 更耐潮，与氧化物正极的界面电阻也更低", { size: 18, fill: COL.text2 });
  b += text(650, 300, "代价：氧化稳定性仍低，需在干燥间加工", { size: 18, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Garnet framework ----------
figs.garnet = () => {
  const W = 660, H = 480;
  let b = "";
  b += rect(10, 10, 440, 440, "#F7F9FB", { rx: 14, stroke: COL.line });
  // ring of Li sites: tetrahedral (squares) and octahedral (circles) alternating around a loop
  const loops = [[130, 130], [330, 130], [130, 330], [330, 330]];
  loops.forEach(([cx, cy]) => {
    const n = 8;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * 2 * Math.PI;
      const x = cx + 62 * Math.cos(a), y = cy + 62 * Math.sin(a);
      if (k % 2 === 0) b += rect(x - 11, y - 11, 22, 22, "#FFFFFF", { stroke: COL.purple, sw: 2.5 });
      else b += circ(x, y, 11, "#FFFFFF", { stroke: COL.purple, sw: 2.5, dash: "4 3" });
    }
    b += circ(cx, cy, 22, COL.amber);
  });
  // Zr octahedra between loops
  [[230, 130], [230, 330], [130, 230], [330, 230]].forEach(([x, y]) => (b += diamond(x, y, 26, COL.tealLight, { stroke: COL.teal, sw: 2 })));
  b += circ(230, 230, 22, COL.amber);
  // some occupied Li
  [[192, 130], [130, 68], [374, 174], [286, 286], [130, 392], [268, 330]].forEach(([x, y]) => (b += ion(x, y, { r: 11 })));
  b += arrow(192, 145, 176, 172, { color: COL.amber, width: 3, head: 10 });
  const lx = 470;
  b += circ(lx + 18, 50, 16, COL.amber) + text(lx + 44, 57, "La（8 配位）", { size: 18, weight: "bold", fill: COL.amber });
  b += diamond(lx + 18, 100, 18, COL.tealLight, { stroke: COL.teal, sw: 2 }) + text(lx + 44, 107, "ZrO_{6}（6 配位）", { size: 18, weight: "bold", fill: COL.teal });
  b += rect(lx + 7, 139, 22, 22, "#FFFFFF", { stroke: COL.purple, sw: 2.5 }) + text(lx + 44, 157, "Li 四面体位", { size: 18, weight: "bold", fill: COL.purple });
  b += circ(lx + 18, 200, 11, "#FFFFFF", { stroke: COL.purple, sw: 2.5, dash: "4 3" }) + text(lx + 44, 207, "Li 八面体位", { size: 18, weight: "bold", fill: COL.purple });
  b += lines(lx, 270, ["两类 Li 位置", "交替相连，", "组成三维互通", "的环形网络"], { size: 18, fill: COL.text2, lh: 26 });
  b += text(10, 476, "石榴石 Li_{7}La_{3}Zr_{2}O_{12} 结构示意（大幅简化）", { size: 17, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Garnet Li stuffing ----------
figs.garnet_stuff = () => {
  const W = 640, H = 400;
  let b = "";
  const cols = [
    { n: 3, f: "Li_{3}Ln_{3}M_{2}O_{12}", y: "1969 Kasper", c: COL.siDark },
    { n: 5, f: "Li_{5}La_{3}M_{2}O_{12}", y: "2003 Thangadurai", c: COL.teal },
    { n: 7, f: "Li_{7}La_{3}Zr_{2}O_{12}", y: "2007 Murugan", c: COL.purple },
  ];
  cols.forEach((c, i) => {
    const x = 110 + i * 210;
    b += rect(x - 70, 40, 140, 250, "#F7F9FB", { rx: 12, stroke: COL.line });
    for (let k = 0; k < 7; k++) {
      const y = 268 - k * 32;
      if (k < c.n) b += ion(x, y, { r: 13, fill: c.c });
      else b += circ(x, y, 13, "none", { stroke: COL.line, sw: 2, dash: "4 4" });
    }
    b += text(x, 322, c.f, { size: 19, anchor: "middle", weight: "bold", fill: c.c });
    b += text(x, 352, c.y, { size: 17, anchor: "middle", fill: COL.text2 });
  });
  b += arrow(40, 384, 600, 384, { color: COL.amber, width: 3, head: 12 });
  b += text(320, 30, "每个化学式里的 Li 越“塞”越多 → 可动 Li⁺ 越多", { size: 19, anchor: "middle", weight: "bold", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- Other inorganic classes ----------
figs.others = () => {
  const W = 1230, H = 340;
  let b = "";
  const cards = [
    { t: "氢化物 Hydride", m: "LiBH_{4}、LiBH_{4}–LiX", s: "10^{−7}–10^{−4}", p: "与 Li 金属稳定", n: "怕潮、难配正极", col: COL.teal, f: "#E8F4F3" },
    { t: "卤化物 Halide", m: "LiI、Li_{2}ZnI_{4}、Li_{3}OCl", s: "10^{−8}–10^{−5}", p: "与 Li 金属稳定", n: "氧化电压低、电导低", col: "#A64B8F", f: "#F7ECF4" },
    { t: "硼酸 / 磷酸盐", m: "Li_{2}B_{4}O_{7}、Li_{3}PO_{4}", s: "10^{−7}–10^{−6}", p: "易制造、重复性好", n: "电导偏低", col: COL.siDark, f: "#F1F3F5" },
  ];
  cards.forEach((c, i) => {
    const x = 10 + i * 410;
    b += rect(x, 10, 390, 320, c.f, { rx: 18 });
    b += text(x + 24, 52, c.t, { size: 23, weight: "bold", fill: c.col });
    b += text(x + 24, 92, c.m, { size: 19, fill: COL.ink, weight: "bold" });
    b += text(x + 24, 140, "电导率（S cm^{−1}）", { size: 17, fill: COL.text2 });
    b += text(x + 24, 178, c.s, { size: 28, weight: "bold", fill: c.col });
    b += check(x + 34, 234, 9, COL.teal, 3.5) + text(x + 56, 242, c.p, { size: 19, fill: COL.ink });
    b += cross(x + 34, 284, 8, COL.red, 3.5) + text(x + 56, 292, c.n, { size: 19, fill: COL.ink });
  });
  return svg(W, H, b);
};

module.exports = figs;
