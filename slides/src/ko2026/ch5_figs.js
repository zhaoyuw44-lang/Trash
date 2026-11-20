// Figures for Ko et al. 2026, Chapter 5 (Rational interphase design, challenges, conclusion). ~96 px per inch.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;
const { rect, line, circle, ellipse, path, solvated, potAxis, card, mol, flow } = require("./figlib");

const figs = {};

// ---------- Title motif: design dial ----------
figs.title_motif5 = () => {
  const W = 520, H = 620;
  let b = "";
  const cx = 260, cy = 300;
  const segs = [COL.purple, COL.sei, COL.teal, COL.red];
  segs.forEach((c, i) => {
    const a0 = (i * Math.PI) / 2 - Math.PI / 2 + 0.06, a1 = a0 + Math.PI / 2 - 0.12;
    const r = 190, r2 = 120;
    const p = (a, rr) => `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
    b += `<path d="M${p(a0, r)} A${r},${r} 0 0 1 ${p(a1, r)} L${p(a1, r2)} A${r2},${r2} 0 0 0 ${p(a0, r2)} Z" fill="${c}" opacity="0.9"/>`;
  });
  b += solvated(cx, cy, "AWAW", { r: 30, dist: 66, rx: 30, ry: 17 });
  return svg(W, H, b);
};

// ---------- Roadmap mini ----------
figs.roadmap5 = () => {
  const W = 520, H = 210;
  let b = "";
  b += flow(10, 50, 150, 80, 25, [
    { t: ["界面相", "设计"], c: COL.sei },
    { t: ["传输", "与安全"], c: COL.teal },
    { t: ["结论", "与回顾"], c: COL.amber },
  ], { size: 18 });
  return svg(W, H, b);
};

// ---------- Four requirements for an interphase ----------
figs.interphase_reqs = () => {
  const W = 660, H = 440;
  let b = "";
  b += rect(250, 60, 160, 300, "#F0D9C0", { rx: 10 });
  const R = rng(4);
  for (let i = 0; i < 45; i++) b += rect((255 + R() * 140).toFixed(1), (65 + R() * 280).toFixed(1), 9, 9, R() > 0.5 ? COL.sei : COL.teal, { rx: 2 });
  b += text(330, 395, "理想的界面相", { size: 19, anchor: "middle", weight: "bold", fill: COL.sei });
  const req = [
    { x: 20, y: 40, t: "力学", s: ["承受大体积变化", "不开裂、不剥离"], c: COL.purple },
    { x: 440, y: 40, t: "电化学", s: ["在苛刻电位下", "抑制还原/氧化"], c: COL.red },
    { x: 20, y: 230, t: "传输", s: ["Li⁺ 快速通过"], c: COL.teal },
    { x: 440, y: 230, t: "化学", s: ["致密、难透溶剂", "宽温度范围稳定"], c: COL.amber },
  ];
  req.forEach((r) => {
    b += card(r.x, r.y, 200, 150, r.t, r.s, r.c, { bs: 17 });
    b += line(r.x < 300 ? r.x + 200 : r.x, r.y + 75, r.x < 300 ? 250 : 410, r.y + 75, r.c, 2.5, { dash: "6 5" });
  });
  return svg(W, H, b);
};

// ---------- Fig. 5c: organic-rich vs inorganic-rich SEI ----------
figs.fig5c = () => {
  const W = 1180, H = 380;
  let b = "";
  const panel = (x, title, c, fill, electrodeFill, elabel, ligs, pros) => {
    let s = text(x + 280, 28, title, { size: 20, anchor: "middle", weight: "bold", fill: c });
    s += `<path d="M${x},60 A150,150 0 0 1 ${x + 150},210 L${x},210 Z" fill="${electrodeFill}"/>`;
    s += `<path d="M${x},44 A166,166 0 0 1 ${x + 166},210 L${x + 150},210 A150,150 0 0 0 ${x},60 Z" fill="${fill}"/>`;
    s += text(x + 50, 190, elabel, { size: 17, weight: "bold", fill: "#FFFFFF" });
    s += solvated(x + 340, 120, ligs, { r: 18, dist: 42, rx: 20, ry: 12 });
    s += rect(x, 240, 560, 130, fill, { rx: 12, opacity: 0.55 });
    pros.forEach(([ok, t], i) => {
      const yy = 268 + i * 28;
      s += ok ? check(x + 24, yy - 6, 8, COL.teal, 3) : cross(x + 24, yy - 6, 7, COL.red, 3);
      s += text(x + 44, yy, t, { size: 17, weight: "bold" });
    });
    return s;
  };
  b += panel(20, "溶剂衍生、富有机 SEI", COL.teal, "#9CC9E0", "#56636F", "石墨", "SSSA", [[1, "Li⁺ 传输快"], [1, "表面覆盖均匀"], [0, "怕体积变化"], [0, "容易被溶剂渗透"]]);
  b += panel(600, "阴离子衍生、富无机 SEI", COL.red, COL.redLight, "#7C8B99", "Li / Si", "AAWA", [[1, "化学与电化学稳定性高"], [1, "耐体积变化"], [1, "抑制枝晶和溶剂渗透"], [0, "较难均匀形成"]]);
  b += text(400, 110, "强配位溶剂", { size: 16, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(980, 110, "阴离子 + 弱配位溶剂", { size: 16, anchor: "middle", fill: COL.red, weight: "bold" });
  return svg(W, H, b);
};

// ---------- How to get an anion-derived LiF-rich SEI ----------
figs.anion_path = () => {
  const W = 1180, H = 300;
  let b = "";
  b += flow(10, 30, 210, 110, 34, [
    { t: ["减少配位 Li⁺ 的", "溶剂分子"], c: COL.teal },
    { t: ["阴离子进入", "溶剂化层"], c: COL.purple },
    { t: ["Li⁺–阴离子络合", "阴离子还原电位↑"], c: COL.amber },
    { t: ["阴离子在负极", "优先被还原"], c: COL.red },
    { t: ["富 LiF、", "阴离子衍生 SEI"], c: COL.sei, fill: "#F0D9C0" },
  ], { size: 17 });
  const tools = [
    ["高浓 / 局部高浓 / 弱溶剂化", COL.purple],
    ["耐还原的醚类溶剂", COL.teal],
    ["氟化弱溶剂化溶剂", COL.amber],
    ["“盐溶于预盐”：仿 FSI 结构的溶剂", COL.red],
    ["离子液体", COL.siDark],
  ];
  b += text(10, 190, "常用手段：", { size: 18, weight: "bold" });
  tools.forEach(([t, c], i) => {
    const x = 10 + (i % 3) * 390, y = 210 + Math.floor(i / 3) * 44;
    b += rect(x, y, 370, 36, "#FFFFFF", { rx: 18, stroke: c, sw: 2.5 });
    b += text(x + 185, y + 24, t, { size: 17, anchor: "middle", weight: "bold", fill: c });
  });
  return svg(W, H, b);
};

// ---------- Other inorganic components & bilayer ----------
figs.bilayer = () => {
  const W = 660, H = 430;
  let b = "";
  b += rect(30, 300, 600, 60, "#B9C3CC") + text(330, 338, "Li 金属 / Si 负极", { size: 18, anchor: "middle", weight: "bold" });
  b += rect(30, 230, 600, 70, COL.sei);
  const R = rng(6);
  const comps = [["LiF", COL.red], ["Li_{2}O", COL.amber], ["Li_{3}N", COL.purple], ["LiF_{x}H_{y}", COL.teal], ["Li_{3}P", COL.siDark]];
  for (let i = 0; i < 30; i++) b += rect((35 + R() * 585).toFixed(1), (235 + R() * 55).toFixed(1), 10, 10, comps[i % 5][1], { rx: 2 });
  b += rect(30, 150, 600, 80, "#F0D9C0");
  b += path("M40,190 C100,160 140,215 200,185 C260,160 300,215 360,185 C420,160 460,215 520,185 C560,170 590,200 620,188", COL.sei, 3);
  b += rect(30, 60, 600, 90, COL.electrolyte);
  b += text(330, 112, "电解液", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(640, 195, "外层：富有机", { size: 16, anchor: "end", weight: "bold", fill: COL.sei });
  b += text(640, 270, "内层：富无机", { size: 16, anchor: "end", weight: "bold", fill: "#FFFFFF" });
  comps.forEach(([t, c], i) => {
    const x = 50 + i * 120;
    b += rect(x, 385, 14, 14, c, { rx: 2 }) + text(x + 22, 398, t, { size: 16, weight: "bold" });
  });
  b += text(330, 40, "内层无机：稳定、调匀 Li⁺ 通量；外层有机：导离子、像“粘结剂”、抑制溶解", { size: 15, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Balancing both electrodes ----------
figs.both_ends = () => {
  const W = 1180, H = 360;
  let b = "";
  b += rect(20, 40, 300, 280, "#E8F4F3", { rx: 16, stroke: COL.teal, sw: 3 });
  b += text(170, 80, "负极优先", { size: 20, anchor: "middle", weight: "bold", fill: COL.teal });
  b += lines(170, 125, ["最大化电位上移", "+ 稳健的阴离子衍生 SEI", "", "离子对电解液：", "利于阴离子还原成膜"], { size: 17, anchor: "middle", weight: "bold", lh: 30 });
  b += arrow(330, 180, 400, 180, { color: COL.amber, width: 4, head: 15 });
  b += text(365, 160, "代价", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  b += rect(410, 40, 750, 280, "#FBEDEC", { rx: 16, stroke: COL.red, sw: 3 });
  b += text(785, 80, "正极侧的“补救工具箱”", { size: 20, anchor: "middle", weight: "bold", fill: COL.red });
  const tools = ["部分加入高度耐氧化的溶剂/稀释剂", "支持 CEI 的粘结剂和隔膜", "浓度梯度正极（表面贫镍）", "表面有机/无机包覆", "杂原子掺杂：抑制氧化、清除酸", "非电化学成膜：开环反应化学钝化"];
  tools.forEach((t, i) => {
    const x = 430 + (i % 2) * 365, y = 110 + Math.floor(i / 2) * 66;
    b += rect(x, y, 345, 52, "#FFFFFF", { rx: 12, stroke: COL.redLight, sw: 2 });
    b += text(x + 172, y + 33, t, { size: 16, anchor: "middle", weight: "bold" });
  });
  return svg(W, H, b);
};

// ---------- Measurement pitfalls ----------
figs.pitfalls = () => {
  const W = 660, H = 430;
  let b = "";
  const items = [
    { t: "残留电解液污染", c: COL.purple },
    { t: "清洗时溶解、重新分布", c: COL.teal },
    { t: "X 射线 / 电子束诱导转变", c: COL.red },
    { t: "厚度、生长速率难定义", c: COL.amber },
    { t: "模拟时间尺度太短", c: COL.siDark },
    { t: "去溶剂化等界面动力学", c: COL.sei },
  ];
  b += circle(330, 215, 85, "#F0D9C0", { stroke: COL.sei, sw: 3 });
  b += lines(330, 205, ["测到的", "SEI 成分"], { size: 19, anchor: "middle", weight: "bold", fill: COL.sei, lh: 26 });
  items.forEach((it, i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
    const x = 330 + 225 * Math.cos(a), y = 215 + 165 * Math.sin(a);
    b += line(330 + 88 * Math.cos(a), 215 + 88 * Math.sin(a), x - 70 * Math.cos(a), y - 26 * Math.sin(a), it.c, 2.5, { dash: "5 4" });
    b += rect(x - 110, y - 24, 220, 48, "#FFFFFF", { rx: 24, stroke: it.c, sw: 2.5 });
    b += text(x, y + 6, it.t, { size: 16, anchor: "middle", weight: "bold", fill: it.c });
  });
  return svg(W, H, b);
};

// ---------- Fig. 6a (top): three transport modes ----------
figs.transport_modes = () => {
  const W = 1180, H = 330;
  let b = "";
  const panel = (x, t, s, c) => rect(x, 20, 370, 220, "#FFFFFF", { rx: 14, stroke: c, sw: 3 }) + text(x + 185, 272, t, { size: 19, anchor: "middle", weight: "bold", fill: c }) + text(x + 185, 302, s, { size: 16, anchor: "middle", fill: COL.text2 });
  b += panel(20, "载体式 Vehicular", "Li⁺ 带着整个溶剂化壳一起走", COL.red);
  b += panel(405, "结构式 Structural（跳跃）", "Li⁺ 在配体之间交换、接力", "#3A7CA5");
  b += panel(790, "通道辅助 Channel-facilitated", "小分子配体排成“通道”快速交换", COL.amber);
  // vehicular
  b += solvated(110, 130, "SSSSAS", { r: 15, dist: 36, rx: 14, ry: 8 }) + solvated(300, 130, "SSSSSS", { r: 15, dist: 36, rx: 14, ry: 8 });
  b += circle(110, 130, 58, "none", { stroke: COL.red, sw: 2, dash: "5 4" });
  b += arrow(175, 130, 235, 130, { color: COL.red, width: 3.5, head: 13 });
  // structural
  const R = rng(3);
  for (let i = 0; i < 12; i++) b += ellipse((420 + R() * 340).toFixed(1), (45 + R() * 170).toFixed(1), 15, 8, i % 3 ? COL.tealLight : COL.redLight, { stroke: i % 3 ? COL.teal : COL.red });
  b += ion(470, 150, { r: 15 }) + ion(700, 120, { r: 15, fill: COL.purpleLight });
  b += path("M485,140 C540,80 600,170 640,120 C660,100 675,110 685,118", "#3A7CA5", 3, { dash: "7 5" });
  b += head(688, 120, 0.3, "#3A7CA5", 12);
  // channel
  for (let i = 0; i < 9; i++) {
    b += ellipse(820 + i * 38, 95, 12, 7, COL.amberLight, { stroke: COL.amber });
    b += ellipse(820 + i * 38, 175, 12, 7, COL.amberLight, { stroke: COL.amber });
  }
  b += ion(850, 135, { r: 15 }) + ion(1000, 135, { r: 15, fill: COL.purpleLight });
  b += arrow(870, 135, 1110, 135, { color: COL.amber, width: 3.5, head: 13 });
  return svg(W, H, b);
};

// ---------- Bruce–Vincent method ----------
figs.bv_method = () => {
  const W = 620, H = 390;
  let b = "";
  // cell
  b += rect(20, 40, 50, 150, COL.sulfurLight, { stroke: COL.sulfur }) + rect(70, 40, 120, 150, COL.electrolyte) + rect(190, 40, 50, 150, COL.sulfurLight, { stroke: COL.sulfur });
  b += text(45, 215, "Li", { size: 17, anchor: "middle", weight: "bold" }) + text(130, 215, "电解质", { size: 17, anchor: "middle", weight: "bold", fill: "#3A7CA5" }) + text(215, 215, "Li", { size: 17, anchor: "middle", weight: "bold" });
  b += text(130, 25, "小电压 ΔV 极化", { size: 16, anchor: "middle", weight: "bold", fill: COL.amber });
  b += ion(105, 90, { r: 13 }) + arrow(122, 90, 175, 90, { color: COL.purple, width: 3, head: 11 });
  b += ellipse(155, 145, 14, 8, COL.redLight, { stroke: COL.red }) + arrow(138, 145, 92, 145, { color: COL.red, width: 3, head: 11 });
  // current decay plot
  const X0 = 300, X1 = 600, Y0 = 200, Y1 = 30;
  b += line(X0, Y0, X1, Y0, COL.ink, 2.5) + line(X0, Y0, X0, Y1, COL.ink, 2.5);
  b += path(`M${X0 + 5},50 C${X0 + 50},140 ${X0 + 120},150 ${X1 - 10},152`, COL.purple, 4);
  b += text(X0 + 14, 46, "I_{0}", { size: 18, weight: "bold", fill: COL.purple });
  b += text(X1 - 10, 140, "I_{ss}", { size: 18, anchor: "end", weight: "bold", fill: COL.purple });
  b += text((X0 + X1) / 2, Y0 + 28, "时间", { size: 16, anchor: "middle", weight: "bold" });
  b += text(X0 - 8, Y1 + 10, "电流", { size: 16, anchor: "end", weight: "bold" });
  b += rect(20, 255, 580, 120, "#FDF2E7", { rx: 14 });
  b += text(310, 300, "t_{+} = I_{ss}(ΔV − I_{0}R_{0}) / [ I_{0}(ΔV − I_{ss}R_{ss}) ]", { size: 21, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(310, 345, "R_{0}、R_{ss}：极化前、后的界面电阻（交流阻抗测得）", { size: 16, anchor: "middle", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Fig. 6b: thermal runaway cascade (ARC) ----------
figs.runaway = () => {
  const W = 680, H = 450;
  let b = "";
  const X0 = 80, X1 = 650, Y0 = 380, Y1 = 30;
  const xT = (t) => X0 + ((t - 100) / 200) * (X1 - X0);
  const yR = (r) => Y0 - ((Math.log10(r) + 2) / 5.5) * (Y0 - Y1); // 0.01 .. ~3000
  b += line(X0, Y0, X1, Y0, COL.ink, 2.5) + line(X0, Y0, X0, Y1, COL.ink, 2.5);
  [100, 150, 200, 250, 300].forEach((t) => (b += text(xT(t), Y0 + 26, String(t), { size: 16, anchor: "middle", fill: COL.text2 })));
  [-1, 0, 1, 2, 3].forEach((k) => (b += line(X0 - 6, yR(10 ** k), X0, yR(10 ** k), COL.ink, 2) + text(X0 - 10, yR(10 ** k) + 6, k === 0 ? "1" : `10^{${k}}`, { size: 16, anchor: "end", fill: COL.text2 })));
  b += text((X0 + X1) / 2, Y0 + 56, "温度（°C）", { size: 17, anchor: "middle", weight: "bold" });
  b += `<g transform="translate(26 ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "升温速率（°C/min）", { size: 17, anchor: "middle", weight: "bold" }) + `</g>`;
  const pts = [[100, 0.04], [115, 0.05], [130, 0.1], [145, 0.22], [152, 0.32], [165, 0.6], [180, 1.2], [200, 3], [212, 6], [222, 12], [228, 35], [232, 150], [236, 500], [245, 900], [270, 1400], [300, 2000]];
  b += `<polyline points="${pts.map(([t, r]) => `${xT(t).toFixed(1)},${yR(r).toFixed(1)}`).join(" ")}" fill="none" stroke="${COL.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  const zone = (t0, t1, c, n, label) => rect(xT(t0), Y1, xT(t1) - xT(t0), Y0 - Y1, c, { opacity: 0.18 }) + pill(xT((t0 + t1) / 2) - 18, Y0 - 44, 36, 30, c, n, { size: 17 }) + lines(xT((t0 + t1) / 2), Y1 + 24, label, { size: 15, anchor: "middle", weight: "bold", fill: c, lh: 20 });
  b += zone(100, 150, COL.sei, "1", ["SEI", "分解"]);
  b += zone(150, 205, COL.purple, "2", ["负极与", "电解液反应"]);
  b += zone(205, 230, COL.red, "3", ["正极", "放氧", "串扰"]);
  b += arrow(xT(262), yR(30), xT(262), yR(800), { color: COL.red, width: 4, head: 14 });
  b += lines(xT(268), yR(100), ["热失控"], { size: 18, weight: "bold", fill: COL.red });
  return svg(W, H, b);
};

// ---------- ARC scale: large cells vs small pouch cells ----------
figs.arc_scale = () => {
  const W = 660, H = 400;
  let b = "";
  // ARC chamber
  b += rect(20, 40, 190, 300, COL.light, { rx: 14, stroke: COL.siDark, sw: 3 });
  for (let i = 0; i < 9; i++) b += circle(35, 60 + i * 32, 5, COL.siDark) + circle(195, 60 + i * 32, 5, COL.siDark);
  b += rect(85, 140, 60, 140, COL.ink, { rx: 10 }) + text(115, 215, "电池", { size: 16, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += line(150, 60, 150, 160, COL.red, 3) + text(160, 90, "热电偶", { size: 15, fill: COL.red, weight: "bold" });
  b += text(115, 370, "绝热条件 ARC", { size: 17, anchor: "middle", weight: "bold" });
  // comparison bars (log scale)
  const X0 = 270;
  b += text(X0, 40, "ARC 测试需要的电池容量（对数示意）", { size: 16, weight: "bold" });
  const bar = (y, w, c, t, s) => rect(X0, y, w, 46, c, { rx: 8 }) + text(X0 + 12, y + 30, t, { size: 17, weight: "bold", fill: "#FFFFFF" }) + text(X0, y + 72, s, { size: 15, fill: COL.text2 });
  b += bar(70, 360, COL.ink, "常规大电池 ~1–3 Ah", "正极材料 4–15 g，制造成本高");
  b += bar(190, 150, COL.red, "≥20 mAh", "圆柱软包小电池：正极 < 1 g");
  b += text(X0, 330, "Ah 级 → mAh 级：用量降一个数量级以上", { size: 17, weight: "bold", fill: COL.teal });
  return svg(W, H, b);
};

// ---------- Safety beyond nonflammability ----------
figs.safety_layers = () => {
  const W = 1180, H = 260;
  let b = "";
  const items = [
    { t: "挥发与可燃性", s: ["LiPF₆/环状碳酸酯", "易燃"], c: COL.amber },
    { t: "界面相热分解", s: ["SEI 在 ~100 °C 起", "开始分解放热"], c: COL.sei },
    { t: "反应性气体与酸", s: ["跨电极迁移", "引发对侧放热"], c: COL.purple },
    { t: "固态也不自动安全", s: ["接触失效、化学机械", "降解、气相串扰"], c: COL.red },
  ];
  items.forEach((it, i) => (b += card(20 + i * 290, 10, 270, 220, it.t, it.s, it.c, { bs: 18, th: 46, ts: 20 })));
  return svg(W, H, b);
};

// ---------- Big picture: the whole review in one flow ----------
figs.big_picture = () => {
  const W = 1180, H = 470;
  let b = "";
  const nodes = [
    { x: 20, y: 40, w: 210, t: ["溶剂化结构", "（谁包着 Li⁺）"], c: COL.teal },
    { x: 290, y: 40, w: 210, t: ["Li⁺ 化学势 μ", "第 2 章"], c: COL.purple },
    { x: 560, y: 40, w: 270, t: ["两极电位平行移动", "可测（Fc）· 可算（第 3 章）"], c: COL.amber },
    { x: 890, y: 40, w: 270, t: ["分解驱动力", "SEI 受益 / CEI 受累"], c: COL.red },
  ];
  nodes.forEach((n, i) => {
    b += rect(n.x, n.y, n.w, 100, "#FFFFFF", { rx: 16, stroke: n.c, sw: 3 });
    b += lines(n.x + n.w / 2, n.y + 42, n.t, { size: 18, anchor: "middle", weight: "bold", fill: n.c, lh: 28 });
    if (i < 3) b += arrow(n.x + n.w + 6, 90, nodes[i + 1].x - 6, 90, { color: COL.muted, width: 3.5, head: 14 });
  });
  b += arrow(1025, 146, 1025, 196, { color: COL.muted, width: 3.5, head: 14 });
  b += rect(560, 200, 600, 100, "#F0D9C0", { rx: 16, stroke: COL.sei, sw: 3 });
  b += lines(860, 242, ["界面相：形成、负担、动态演化（第 4 章）", "Butler–Volmer：电位 → 指数级的副反应电流"], { size: 18, anchor: "middle", weight: "bold", fill: COL.sei, lh: 28 });
  b += arrow(554, 250, 504, 250, { color: COL.muted, width: 3.5, head: 14 });
  b += rect(20, 200, 480, 100, "#E8F4F3", { rx: 16, stroke: COL.teal, sw: 3 });
  b += lines(260, 242, ["理性设计（第 5 章）", "富无机 SEI + 两极兼顾"], { size: 18, anchor: "middle", weight: "bold", fill: COL.teal, lh: 28 });
  b += arrow(260, 306, 260, 350, { color: COL.muted, width: 3.5, head: 14 });
  const tail = [["快速离子传输", COL.teal], ["安全优先", COL.red], ["CE > 99.99%", COL.amber]];
  tail.forEach(([t, c], i) => {
    b += rect(20 + i * 390, 360, 360, 60, c, { rx: 30 });
    b += text(200 + i * 390, 398, t, { size: 19, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  });
  b += text(590, 455, "全部要同时满足：从“经验优化”走向“物理化学框架”", { size: 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  return svg(W, H, b);
};

module.exports = figs;
