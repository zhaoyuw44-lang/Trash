// Zhao et al. 2020 — Chapter 3: 锂/钠与多价离子固态电解质
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Zhao et al., Nat. Rev. Mater. 2020",
  full: "Zhao, Stalin, Zhao & Archer. Designing solid-state electrolytes for safe, energy-dense batteries. Nature Reviews Materials (2020). doi:10.1038/s41578-019-0165-5",
};

// Shared bar-chart styling (same look as the reference chapter).
function bar(d, s, labels, values, o) {
  s.addChart(d.pres.charts.BAR, [{ name: o.name || "值", labels, values }], {
    x: o.x, y: o.y, w: o.w, h: o.h, barDir: o.dir || "bar",
    catAxisOrientation: o.dir === "col" ? "minMax" : "maxMin",
    chartColors: o.colors, barGapWidthPct: o.gap ?? 60,
    showValue: !o.log, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: o.fmt || "General",
    catAxisLabelFontSize: o.catSize || 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: !o.log, valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt",
    ...(o.log ? { valAxisLogScaleBase: 10, valAxisMinVal: o.min, valAxisMaxVal: o.max, valGridLine: { color: "E3E8EC", size: 1 } } : { valAxisMinVal: 0, valAxisMaxVal: o.max, valGridLine: { style: "none" } }),
    catGridLine: { style: "none" },
    showTitle: true, title: o.title, titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
}

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch3_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 3, chapterTitle: "锂/钠与多价离子固态电解质", figDir });
  d.registerFigs(info);
  const C = d.C;
  const P = HEX.accent3, R = HEX.accent4, T = HEX.accent2, A = HEX.accent1, G = HEX.accent6, Y = HEX.accent5;

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 3 章\n换一种离子，会怎样？", { placeholder: "title" });
  s.addText("Li⁺、Na⁺ 与 Mg²⁺、Zn²⁺、Ca²⁺、Al³⁺ 固态电解质：同一骨架，不同表现", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文 “Li-ion and Na-ion SSEs” 与 “SSEs for multivalent ion transport” 两节（第 7–9 页，含 Table 1）。目标：会读 Table 1，能用“离子半径、电荷密度、Lewis 酸性”解释同一骨架里不同离子为什么快慢不同。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "读懂 Table 1", "离子半径与电荷密度；同一晶格里比一比"],
    ["2", "Li⁺ vs Na⁺", "体相：小的快？界面：松的快？"],
    ["3", "二价、三价离子", "为什么难走；Mg、Zn、Ca、Al 各自的出路"],
    ["4", "阅读校注", "Table 1 与正文中的几处笔误"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.1, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 7.5, y: 1.45, w: 5.25, h: 3.0, rectRadius: 0.1, fill: { color: "F1ECF8" }, line: { color: "F1ECF8" } });
  s.addText([
    { text: "与上一章的衔接", options: { bold: true, fontSize: 18, color: C.accent3, breakLine: true } },
    { text: "第 2 章：σ 取决于载流子浓度和迁移率；迁移率由能垒决定；能垒很大程度上来自阳离子与阴离子之间的静电吸引（库仑力 ∝ q₁q₂/r²）。", options: { fontSize: 15, color: C.text1, breakLine: true } },
    { text: "这一章把“阳离子是谁”当作变量：q 和 r 一变，能垒和电导率跟着变。", options: { fontSize: 15, color: C.text1 } },
  ], { x: 7.75, y: 1.55, w: 4.8, h: 2.8, margin: 0, valign: "middle", isTextBox: true, paraSpaceAfter: 6 });
  s.addText("原文 Table 1 共七组：高温硫酸盐、β-Al₂O₃（300 °C）、硫化物（25 °C）、NASICON、氧化物、配位氢化物、聚合物。本章把它们拆成 7 张原生图表。", { x: 7.5, y: 4.7, w: 5.25, h: 1.2, fontSize: 14, color: C.text2, margin: 0, valign: "top", isTextBox: true });
  s.addNotes("Table 1 的标题是 “Comparison of Li SSEs, Na SSEs and other metal SSEs with similar structures”：思路是在相似结构里比较不同的离子，这样才能把“离子本身”的影响单独拎出来。");

  // ---------------- 3. Section ----------------
  d.section("1 读懂 Table 1");
  s = d.slide("DARK_SECTION");
  s.addText("读懂 Table 1：离子本身的两个参数", { placeholder: "title" });
  s.addText("离子半径 r 与电荷数 n → 电荷密度 = ne / (4/3 πr³)", { placeholder: "body" });

  // ---------------- 4. Size & charge density ----------------
  s = d.slide("CONTENT");
  s.addText("离子半径与电荷密度：谁“黏”得更紧", { placeholder: "title" });
  d.fig(s, "ion_sizes", { x: 0.5, y: 1.2, w: 6.6, h: 3.1 });
  bar(d, s, ["Li⁺", "Na⁺", "K⁺", "Mg²⁺", "Zn²⁺", "Ca²⁺", "Al³⁺"], [87, 36, 15, 205, 189, 76, 748], {
    x: 7.3, y: 1.2, w: 5.5, h: 3.3, dir: "col", max: 850, gap: 50,
    colors: [P, P, P, R, R, R, "7A1F1A"], title: "电荷密度（C mm⁻³）",
  });
  d.column(s, 0.6, 4.55, 6.5, [
    { kind: "hist", size: 13, body: "1927 年 Pauling 给出一套离子半径；1976 年 Shannon 系统修订，按配位数分别列出。Table 1 的半径即引自 Shannon（ref. 269）。" },
    { kind: "why", size: 13, body: "只看半径会误判：Mg²⁺（0.72 Å）比 Li⁺ 还小，却难走得多。把电荷也算进去的“电荷密度”才能反映它抓住周围阴离子的力度。" },
  ], 0.14);
  d.block(s, { x: 7.3, y: 4.65, w: 5.45, kind: "matters", tint: true, body: "电荷密度越高，离子与骨架（或溶剂分子）的静电作用越强，迁移和脱溶剂都越难。Al³⁺ 是 Li⁺ 的约 9 倍，Mg²⁺ 是约 2.4 倍。" });
  s.addNotes("电荷密度按原文脚注的公式计算：ne / (4/3 πr³)，e 为元电荷，n 为电荷数，r 为离子半径。例如 Li⁺：1.602×10⁻¹⁹ C ÷ (4/3 × π × (0.76×10⁻⁷ mm)³) ≈ 87 C mm⁻³。注意：原文脚注说半径对应“配位数 4”，但这些数值其实是 Shannon 表中配位数 6 的值（见本章校注）。");

  // ---------------- 5. Sulfates ----------------
  s = d.slide("CONTENT");
  s.addText("同一个晶格里比一比：高温 Li₂SO₄ 中的扩散", { placeholder: "title" });
  bar(d, s, ["Li⁺  1.59", "Na⁺  1.56", "K⁺  1.24", "Ca²⁺  0.14", "Mg²⁺  0.04", "Al³⁺  0.0017"], [1.59, 1.56, 1.24, 0.14, 0.04, 0.0017], {
    x: 0.5, y: 1.25, w: 7.0, h: 4.6, log: true, min: 0.001, max: 10, colors: [P, P, P, R, R, "7A1F1A"],
    title: "各离子在高温 Li₂SO₄ 中的扩散系数（10⁻⁵ cm² s⁻¹，对数坐标）",
  });
  d.caption(s, "数据：原文 Table 1 “Sulfates (high-temperature sulfate phases)”（ref. 254，Tärneberg 与 Lundén 1996）。", { x: 0.6, y: 5.95, w: 6.9, h: 0.5 });
  d.stat(s, { x: 7.85, y: 1.25, w: 2.3, value: "≈1000×", label: "Li⁺ 比 Al³⁺ 快", color: "accent4" });
  d.stat(s, { x: 10.3, y: 1.25, w: 2.45, value: "≈10–40×", label: "一价比二价快", color: "accent1" });
  d.column(s, 7.85, 2.85, 4.9, [
    { kind: "hist", size: 13, body: "1980–90 年代，瑞典 Lundén 组系统研究了 Li₂SO₄ 等高温“转子相”硫酸盐：硫酸根能自由转动，各种阳离子都能在其中快速扩散。" },
    { kind: "why", size: 13, body: "不同材料之间比较，会混进结构差异。把不同离子放进同一个晶格（这里是高温 Li₂SO₄）里，差别就只来自离子本身。" },
    { kind: "matters", size: 13, body: "结果一目了然：一价离子差不多快；二价慢一到两个数量级；三价 Al³⁺ 慢约三个数量级。电荷比半径更要紧。" },
  ], 0.14);
  s.addNotes("在另一宿主 LiNaSO₄ 中趋势相同：Li⁺ 1.16、Na⁺ 1.19、K⁺ 0.61、Mg²⁺ 0.19、Ca²⁺ 0.34；Zn²⁺ 在 Li₄Zn(SO₄)₃ 中为 0.13（单位均为 10⁻⁵ cm² s⁻¹）。这些是高温相（数百 °C）的数据，不能直接与室温值比较。");

  // ---------------- 6. Section Li vs Na ----------------
  d.section("2 Li⁺ 与 Na⁺");
  s = d.slide("DARK_SECTION");
  s.addText("Li⁺ 与 Na⁺：大小与“黏性”的较量", { placeholder: "title" });
  s.addText("体相里小的占便宜，界面上松的占便宜，最终谁快取决于骨架", { placeholder: "body" });

  // ---------------- 7. Why Na ----------------
  s = d.slide("CONTENT");
  s.addText("为什么要做钠的固态电解质", { placeholder: "title" });
  d.stat(s, { x: 0.6, y: 1.25, w: 3.0, value: "~20", unit: "ppm", label: "Li 在地壳中的丰度（原文）", color: "accent3" });
  d.stat(s, { x: 3.7, y: 1.25, w: 3.0, value: "~2.3", unit: "%", label: "Na 在地壳中的丰度（公认值）", color: "accent2" });
  d.fig(s, "tl_na", { x: 0.5, y: 2.7, w: 7.2, h: 3.4 });
  d.caption(s, "原文提到的代表性 Na⁺ SSE（年份为所引文献发表年）。", { x: 0.6, y: 6.2, w: 7.0 });
  d.column(s, 7.95, 1.3, 4.8, [
    { kind: "why", body: "Na 比 Li 更活泼：在液态电解液里更易长枝晶、SEI 更不稳定、库仑效率更低。换成固体电解质可以压住这些副反应。" },
    { kind: "matters", body: "Li 电池里用过的几大家族（β-Al₂O₃、NASICON、硫化物、配位氢化物、SPE）都已有 Na 版本，可以直接对比。" },
  ], 0.18);
  d.quote(s, { x: 7.95, w: 4.8, en: "Owing to the unevenly distributed (mainly in South America) and limited (~20 ppm in the Earth’s crust) supply of Li, there has been a revival of interest in Na-ion and Na-metal batteries in recent years.", zh: "由于锂资源分布不均（主要在南美洲）且有限（地壳中约 20 ppm），近年来钠离子和钠金属电池重新受到关注。" });
  s.addNotes("钠的固态电解质比锂的更早：1967 年的 β-Al₂O₃、1976 年的 NASICON 都是 Na⁺ 导体。Na 在地壳中的丰度约 2.3%（质量分数）是公认数据，原文没有给出；与 Li 的约 20 ppm 相比高出约 1000 倍。原文对 SEI 的定义：在固体电极与固体或液体电解质之间形成的中间相。");

  // ---------------- 8. Li vs Na tradeoff ----------------
  s = d.slide("CONTENT");
  s.addText("Li⁺ vs Na⁺：体相与界面的两套规则", { placeholder: "title" });
  d.fig(s, "li_na_solv", { x: 0.5, y: 1.25, w: 7.0, h: 4.18 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "1923 年 G. N. Lewis 把“接受电子对”的物种定义为酸。Li⁺ 电荷密度高，是比 Na⁺ 更强的 Lewis 酸，更爱和 O、S 上的孤对电子结合。" },
    { kind: "why", body: "以前常说“离子越小越快”。原文提醒：小也意味着“黏”。在体相里小有利；在需要脱掉溶剂壳的界面上，“松”的 Na⁺ 反而占优。" },
    { kind: "matters", body: "所以“Na 导体一定更慢”并不成立，要看哪一步是瓶颈。" },
  ]);
  d.quote(s, { y: 5.65, en: "The smaller radius of Li⁺ may enable faster transport through the bulk phase; however, the lower Lewis acidity of Na⁺ facilitates cation desolvation.", zh: "Li⁺ 半径更小，可能使它在体相中传输更快；但 Na⁺ 的 Lewis 酸性更弱，更容易脱去溶剂化层。" });
  s.addNotes("图中配位数为示意：Li⁺ 常见 4 配位，Na⁺ 常见 6 配位。原文：尽管 Li⁺ 半径比 Na⁺ 小，但由于电荷密度更高（Lewis 酸性更强），它通常对氧（或硫）有更高的亲和力。");

  // ---------------- 9. beta-alumina ----------------
  s = d.slide("CONTENT");
  s.addText("β-Al₂O₃（300 °C）：为 Na⁺ 量身定做的通道", { placeholder: "title" });
  d.fig(s, "beta_plane", { x: 0.5, y: 1.2, w: 6.4, h: 3.3 });
  bar(d, s, ["Li⁺", "Na⁺", "K⁺"], [0.069, 0.84, 0.070], { x: 7.1, y: 1.2, w: 2.85, h: 3.3, dir: "col", max: 1.0, colors: [P, T, A], title: "扩散系数（10⁻⁵ cm² s⁻¹）", gap: 40 });
  bar(d, s, ["Li⁺", "Na⁺", "K⁺"], [0.378, 0.165, 0.232], { x: 10.0, y: 1.2, w: 2.8, h: 3.3, dir: "col", max: 0.45, colors: [P, T, A], title: "活化能（eV）", gap: 40, fmt: "0.000" });
  d.block(s, { x: 0.6, y: 4.7, w: 3.9, kind: "hist", tint: true, size: 13, body: "1967 年 Yao 与 Kummer 用离子交换把 β-Al₂O₃ 里的 Na⁺ 换成 Li⁺、K⁺、Ag⁺ 等，测了各自的扩散；1972 年 Kummer 的综述（ref. 255）汇总了这些数据。" });
  d.block(s, { x: 4.7, y: 4.7, w: 3.9, kind: "why", tint: true, size: 13, body: "β-Al₂O₃ 本来就是含 Na 的化合物，传导面的大小正好适合 Na⁺。Li⁺ 太小，会偏到 O 旁边被“粘住”；K⁺ 太大，过瓶颈费力。" });
  d.block(s, { x: 8.8, y: 4.7, w: 3.95, kind: "matters", tint: true, size: 13, body: "“尺寸匹配”是骨架设计的通用原则：Na⁺ 比 Li⁺ 快 12 倍，活化能只有一半不到。" });
  s.addNotes("数据来自原文 Table 1 “β-Al₂O₃ (300 °C)”。左图是对“尺寸匹配”的示意解释，原文正文没有展开；这是固态离子学中对 β-Al₂O₃ 的常见解释。");

  // ---------------- 10. NASICON Li vs Na ----------------
  s = d.slide("CONTENT");
  s.addText("NASICON：把 Na⁺ 换成 Li⁺，电导率反而下降", { placeholder: "title" });
  d.fig(s, "nasicon_trap", { x: 0.5, y: 1.25, w: 6.7, h: 3.98 });
  d.stat(s, { x: 0.6, y: 5.35, w: 3.2, value: "200", unit: "mS cm⁻¹", label: "Na₃Zr₂PSi₂O₁₂，300 °C，Eₐ 0.29 eV", color: "accent2" });
  d.stat(s, { x: 3.95, y: 5.35, w: 3.2, value: "12", unit: "mS cm⁻¹", label: "LiZr₂(PO₄)₃，300 °C，Eₐ 0.43 eV", color: "accent3" });
  d.column(s, 7.5, 1.3, 5.25, [
    { kind: "hist", body: "1976 年 Goodenough、Hong 与 Kafalas 设计 NASICON 时，就是为 Na⁺ 优化的“骨架结构”。2014 年 Francisco 等发现：NASICON 中的 Li⁺ 会因局部结构畸变被“困住”（原文 ref. 240）。" },
    { kind: "why", body: "原文的解释：Li–O 键比 Na–O 键共价性更强，所以在 Na₁₊ₓZr₂SiₓP₃₋ₓO₁₂ 中用 Li⁺ 取代 Na⁺，电导率通常下降。" },
    { kind: "matters", body: "同一个骨架不能“一套用到底”。为 Li⁺ 设计的 NASICON（LATP、LAGP）都要换掉部分骨架离子来调整通道。" },
  ]);
  s.addNotes("左图为示意：Li⁺ 在笼中偏离中心、靠近一侧的氧，这与“Li⁺ 被局部畸变困住”的图像一致。原文 Table 1 的 NASICON 一栏温度较高（300 °C、800 °C），不能和室温值直接比较。");

  // ---------------- 11. A7P3X11 ----------------
  s = d.slide("CONTENT");
  s.addText("反例：A₇P₃X₁₁ 中 Li⁺ 反而更快", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [
    { name: "Li⁺", labels: ["X = O", "X = S", "X = Se"], values: [0.03, 45.66, 47.94] },
    { name: "Na⁺", labels: ["X = O", "X = S", "X = Se"], values: [0.003, 10.97, 12.56] },
  ], {
    x: 0.5, y: 1.25, w: 6.2, h: 4.3, barDir: "col", barGrouping: "clustered", barGapWidthPct: 60,
    chartColors: [P, T], valAxisLogScaleBase: 10, valAxisMinVal: 0.001, valAxisMaxVal: 100,
    showValue: false, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFormatCode: "General",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "25 °C 电导率（mS cm⁻¹，对数坐标，计算值）", titleFontSize: 14, titleColor: HEX.dk1,
    showLegend: true, legendPos: "b", legendFontSize: 12, legendColor: HEX.dk1,
  });
  s.addChart(d.pres.charts.BAR, [
    { name: "Li⁺", labels: ["O", "S", "Se"], values: [0.386, 0.191, 0.188] },
    { name: "Na⁺", labels: ["O", "S", "Se"], values: [0.535, 0.217, 0.213] },
  ], {
    x: 6.9, y: 1.25, w: 5.9, h: 2.6, barDir: "col", barGrouping: "clustered", barGapWidthPct: 60,
    chartColors: [P, T], valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 0.65,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFormatCode: "0.000",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "活化能（eV）", titleFontSize: 14, titleColor: HEX.dk1, showLegend: false,
  });
  d.caption(s, "Li / Na：O 0.03 / 0.003；S 45.66 / 10.97；Se 47.94 / 12.56 mS cm⁻¹。数据：原文 Table 1（ref. 52，均为计算值）。", { x: 0.6, y: 5.6, w: 6.1, h: 0.5 });
  d.column(s, 6.95, 3.88, 5.8, [
    { kind: "hist", size: 13, body: "2017 年 Ceder 组（Wang 等）用第一性原理计算预测了 Na₇P₃X₁₁，并与锂版本对比。" },
    { kind: "why", size: 13, body: "在 NASICON 里 Na⁺ 更快，在这里 Li⁺ 更快：电导率更高、活化能更低。骨架改变，结论就反过来。" },
    { kind: "matters", size: 13, body: "也印证了第 1 章的原则：O → S → Se，阴离子越大越软，电导率高三到四个数量级。" },
  ], 0.12);
  s.addNotes("原文措辞是 “the Li SSEs show higher conductivities and lower activation-energy densities than those of the Na SSEs”，其中 “activation-energy densities” 应理解为“活化能”。氧化物 Li₇P₃O₁₁ 只有 0.03 mS cm⁻¹，Na₇P₃O₁₁ 只有 0.003 mS cm⁻¹。");

  // ---------------- 12. Interfaces ----------------
  s = d.slide("CONTENT");
  s.addText("跨界面：Na⁺ 脱溶剂更容易", { placeholder: "title" });
  d.fig(s, "interface_desolv", { x: 0.5, y: 1.25, w: 7.0, h: 4.18 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "2005 年 Sagane、Abe、Iriyama 与 Ogumi 测量了 Li⁺、Na⁺ 穿过 SIE 与聚合物或液体电解质界面的过程；2013 年 Okoshi 等用计算比较了 Li⁺、Na⁺、Mg²⁺ 的脱溶剂能。" },
    { kind: "why", body: "离子从聚合物或液体进入陶瓷，必须先脱掉溶剂壳。Na⁺ 与 PEO、碳酸丙烯酯（PC）中氧的作用更弱，所以这一步的活化能更低。" },
    { kind: "matters", body: "杂化 SSE（SIE–SPE）里内部界面很多，界面脱溶剂可能成为瓶颈。Mg²⁺ 的脱溶剂能大得多，这是多价离子的又一道坎。" },
  ]);
  d.quote(s, { y: 5.65, en: "It is necessary to complement these theoretical evaluations with experimental studies to increase the understanding of ion-transport pathways in SSEs.", zh: "有必要用实验研究补充这些理论评估，以加深对 SSE 中离子传输路径的理解。" });
  s.addNotes("原文：在两类杂化电解质（SIE–SPE 或 SIE–液体）中，Na⁺ 穿过内部界面的活化能都更低（ref. 53）；进一步的理论研究显示，大多数溶剂中 Na⁺ 络合物的脱溶剂能小于 Li⁺，而 Mg²⁺ 络合物的脱溶剂能大得多（ref. 54）。左下的能垒条形为相对示意。");

  // ---------------- 13. Polymers ----------------
  s = d.slide("CONTENT");
  s.addText("聚合物电解质：PEO 里的 Li⁺ 与 Na⁺", { placeholder: "title" });
  bar(d, s, [
    "LiTFSI–PEO（EO:Li 20:1，70 °C）", "NaTFSI–PEO（EO:Na 20:1，70 °C）",
    "LiClO₄–PEO（10:1，90 °C）", "+ 5 wt% TiO₂ 棒（90 °C）",
    "NaClO₄–PEO（10:1，90 °C）", "NaClO₄–PEO（20:1）+ 5 wt% TiO₂（90 °C）",
  ], [0.8, 0.15, 0.2, 1, 0.14, 0.5], { x: 0.5, y: 1.25, w: 7.6, h: 4.5, max: 1.2, colors: [P, T, P, A, T, A], title: "电导率（mS cm⁻¹，约值）", catSize: 12 });
  d.caption(s, "数据：原文 Table 1 “Polymers”。最后一行原文写作 LiClO₄，据所引文献（ref. 268）应为 NaClO₄，见校注。", { x: 0.6, y: 5.85, w: 7.5, h: 0.5 });
  d.column(s, 8.4, 1.3, 4.35, [
    { kind: "hist", size: 13, body: "1973 年 Wright 组最早报道的 PEO 络合物里就包括 Na⁺、K⁺ 盐；Table 1 的 TiO₂ 填料数据来自 2015 和 2019 年的研究。" },
    { kind: "why", size: 13, body: "SPE 的数据都在 70–90 °C：PEO 熔点约 60 °C，室温下结晶，导电很差（第 2 章）。" },
    { kind: "matters", size: 13, body: "TFSI 盐体系中，Na 约为 Li 的 1/5；ClO₄ 盐体系中约为 0.7 倍。加入 5 wt% TiO₂，LiClO₄ 体系提高 5 倍，NaClO₄ 体系约 3.6 倍（两行浓度不同）。" },
  ], 0.14);
  s.addNotes("EO:Li 指每个 Li⁺ 对应的环氧乙烷（EO）重复单元数。“+ 5 wt% TiO₂ 棒”对应原文的 elliptical TiO₂ rods（椭圆棒状 TiO₂）。注意 NaClO₄ 一组的两行盐浓度不同（10:1 与 20:1），所以 0.14 → 0.5 不完全是填料的贡献。");

  // ---------------- 14. Section multivalent ----------------
  d.section("3 多价离子");
  s = d.slide("DARK_SECTION");
  s.addText("多价离子：Mg²⁺、Zn²⁺、Ca²⁺、Al³⁺", { placeholder: "title" });
  s.addText("一个离子带两三个电荷，容量诱人；但电荷越多，在固体里越走不动", { placeholder: "body" });

  // ---------------- 15. Why multivalent ----------------
  s = d.slide("CONTENT");
  s.addText("为什么要多价金属负极", { placeholder: "title" });
  const metals = [["Li", 1, 6.94, 0.534], ["Na", 1, 22.99, 0.968], ["K", 1, 39.1, 0.862], ["Mg", 2, 24.31, 1.738], ["Ca", 2, 40.08, 1.55], ["Zn", 2, 65.38, 7.14], ["Al", 3, 26.98, 2.7]];
  const vol = metals.map(([, n, M, rho]) => Math.round(((n * 96485) / (3.6 * M)) * rho));
  bar(d, s, metals.map((m) => m[0]), vol, { x: 0.5, y: 1.25, w: 7.0, h: 3.7, dir: "col", max: 9500, colors: [P, P, P, R, R, R, "7A1F1A"], title: "金属负极理论体积比容量（mAh cm⁻³）", gap: 45 });
  d.caption(s, "按 Q = nF/(3.6M) × 密度计算（第 1 章公式）；Al 的结果与原文给出的 8,040 mAh cm⁻³ 一致。", { x: 0.6, y: 4.98, w: 6.9, h: 0.5 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "2000 年 Aurbach 等做出第一个可长期循环的 Mg 电池原型（Mo₆S₈ 正极 + 有机镁盐的醚类电解液），多价电池研究由此升温。" },
    { kind: "why", body: "Mg、Zn、Al 在空气中比 Li、Na、K 稳定；每个原子交换 2–3 个电子，体积容量高。但可充 Mg 电池多用四氢呋喃（THF）基液体电解液，易挥发，高电压下易分解。" },
    { kind: "matters", body: "所以多价体系同样需要固态电解质：既为了安全，也为了更宽的电压窗口。" },
  ]);
  d.quote(s, { x: 0.6, w: 6.9, en: "Compared with highly reactive alkali metals (Li, Na, K), batteries using multivalent metals (Mg, Zn, Al) are usually more stable when exposed to air.", zh: "与高活性的碱金属（Li、Na、K）相比，采用多价金属（Mg、Zn、Al）的电池暴露在空气中时通常更稳定。" });
  s.addNotes("体积比容量 = 质量比容量 × 金属密度。Li 的质量比容量最高（3861 mAh g⁻¹），但密度只有 0.534 g cm⁻³；Al 每个原子给出 3 个电子、密度 2.70 g cm⁻³，所以体积比容量最高。原文第 9 页：“trivalent Al³⁺ ions offer the highest charge-storage capacities (8,040 mAh cm⁻³)”。");

  // ---------------- 16. Multivalent timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：多价离子 SSE 的四十年", { placeholder: "title" });
  d.fig(s, "tl_mv", { x: 0.5, y: 1.2, w: 12.3, h: 4.17 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "1980 年代的思路是“把 Li、Na 导体里的离子换成多价离子”（β″-Al₂O₃、NASICON、PEO）。近十年转向专门为多价离子设计的新骨架：软阴离子、短跳跃距离。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.95, kind: "matters", tint: true, body: "四十年过去，室温下最好的 Mg²⁺ 固体导体也只有约 0.01–0.1 mS cm⁻¹（尖晶石硒化物），仍比 Li⁺ 导体低两个数量级以上。" });
  s.addNotes("时间轴不按比例，年份均为原文所引文献的发表年份：ref. 67（1982）、64 与 70（1986）、56（1987）、68（1990）、55（2003）、57（2014）、63（2017）、69（2019）。注意原文说 Zn²⁺ 在 β-Al₂O₃ 和 ZnZr₄(PO₄)₆ 中的扩散“40 多年前”就有研究，但所引文献分别是 1982 和 1990 年（见校注）。");

  // ---------------- 17. NASICON across ions ----------------
  s = d.slide("CONTENT");
  s.addText("同一 NASICON 骨架：电荷翻倍，活化能翻倍", { placeholder: "title" });
  bar(d, s, ["Na⁺  Na₃Zr₂PSi₂O₁₂（200 mS cm⁻¹，300 °C）", "Li⁺  LiZr₂(PO₄)₃（12 mS cm⁻¹，300 °C）", "Mg²⁺  MgZr₄(PO₄)₆（6.1 mS cm⁻¹，800 °C）", "Zn²⁺  ZnZr₄(PO₄)₆（3.7 mS cm⁻¹，800 °C）"], [0.29, 0.43, 0.82, 0.93], {
    x: 0.5, y: 1.25, w: 7.4, h: 4.9, max: 1.1, colors: [T, P, R, R], title: "NASICON 型 SSE 的活化能（eV）", fmt: "0.00", catSize: 12,
  });
  d.caption(s, "数据：原文 Table 1 “NASICONs”。括号内为电导率及测量温度。", { x: 0.6, y: 6.25, w: 7.3 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", size: 13, body: "1987 年 Ikeda 等报道 Mg–Zr–PO₄ 体系（MgZr₄(PO₄)₆）中由 Mg²⁺ 导电；1992 年 Nomura 等测了 Mg、Zn 两种 NASICON 的电导率；1999–2000 年 Imanaka 等尝试用 Nb⁵⁺ 取代、引入 Zr₂O(PO₄)₂ 第二相来提升。" },
    { kind: "why", size: 13, body: "这类 Mg²⁺ 导体采用 β-Fe₂(SO₄)₃ 型 NASICON 骨架。骨架没变，换上二价离子后静电吸引更强，活化能就从约 0.3–0.4 eV 涨到 0.8–0.9 eV。" },
    { kind: "matters", size: 13, body: "Mg²⁺、Zn²⁺ 要到 800 °C 才有几 mS cm⁻¹，而一价离子在 300 °C 就有十几到几百 mS cm⁻¹。原文把原因归于 Mg²⁺ 的高电荷密度（205 vs Li⁺ 的 87 C mm⁻³）。" },
  ], 0.14);
  s.addNotes("原文：β-Fe₂(SO₄)₃ 型 NASICON 骨架的固态磷酸盐 Mg²⁺ 导体（如 MgZr₄(PO₄)₆）800 °C 下电导率为 6.1 × 10⁻³ S cm⁻¹，远低于同为 NASICON 结构的 Na⁺ 和 Li⁺ 导体。Zn²⁺ 在 NASICON 中同样慢：原文给出 500 °C 下 1.34 × 10⁻³ mS cm⁻¹。");

  // ---------------- 18. Mg design strategies ----------------
  s = d.slide("CONTENT");
  s.addText("让 Mg²⁺ 走得动：三条设计思路", { placeholder: "title" });
  d.fig(s, "mv_strategies", { x: 0.5, y: 1.2, w: 12.3, h: 3.55 });
  d.block(s, { x: 0.6, y: 4.9, w: 3.9, kind: "hist", tint: true, size: 13, body: "2014 年 Higashi 等报道 Mg(BH₄)(NH₂)：150 °C 下 10⁻³ mS cm⁻¹，窗口 > 3 V，可逆镀/脱 Mg。2017 年 Canepa 等预测并合成尖晶石 MgSc₂Se₄。" });
  d.block(s, { x: 4.7, y: 4.9, w: 3.9, kind: "why", tint: true, size: 13, body: "三招对应第 2 章的公式：软阴离子降低静电吸引（降能垒），短跳跃距离改变 a 和能垒，造空位提高载流子浓度 c。" });
  d.block(s, { x: 8.8, y: 4.9, w: 3.95, kind: "matters", tint: true, size: 13, body: "对比：Li₂(BH₄)(NH₂) 室温约 0.2 mS cm⁻¹；Mg(BH₄)(NH₂) 到 150 °C 才 10⁻³ mS cm⁻¹。MgSc₂Se₄ 室温约 0.01–0.1 mS cm⁻¹，是目前较好的结果。" });
  s.addNotes("原文写作 “MgSr₂Se₄”，所引文献（Canepa 等 2017，ref. 63）报道的是 MgSc₂Se₄（Sc 为钪），见校注。Mg(BH₄)(NH₂) 的结构：阴离子骨架形成隧道，Mg 原子呈锯齿链排列，Mg–Mg 距离 3.59 Å，比 Mg(BH₄)₂ 中更短，有利于 Mg 跳跃。");

  // ---------------- 19. Mg SPEs ----------------
  s = d.slide("CONTENT");
  s.addText("镁的聚合物电解质：从凝胶到纳米复合", { placeholder: "title" });
  d.fig(s, "mg_spe", { x: 0.5, y: 1.25, w: 6.7, h: 3.98 });
  d.stat(s, { x: 0.6, y: 5.4, w: 3.2, value: "98%", label: "PEO–Mg(BH₄)₂–MgO 在 100 °C 下 Mg 镀/脱的库仑效率", color: "accent3" });
  d.column(s, 7.5, 1.3, 5.25, [
    { kind: "hist", body: "1986 年 Yang、Farrington 等制备了含二价盐（如 MgCl₂）的 PEO 络合物。2003 年 Chusid 等用 Mg(AlCl₂EtBu)₂ + PVDF 或 PEO + 四甘醇二甲醚做成凝胶，配 Mo₆S₈ 正极实现可逆循环。2015 年 Shao 等做出不含液体的纳米复合 SPE。" },
    { kind: "why", body: "早期的 Mg-SPE 很少能“干净”地镀、脱 Mg。加入增塑剂（凝胶）或 MgO 纳米颗粒，帮助盐解离、打乱结晶。" },
    { kind: "matters", body: "原文的解释：长 PEO 链与 Mg²⁺ 强配位，促进了 Mg(BH₄)₂ 的解离。强配位是把双刃剑：解离容易了，迁移却更难。" },
  ]);
  s.addNotes("“neat Mg plating and stripping profiles”指电压曲线平整、没有明显的副反应平台。凝胶电解质含有液体增塑剂，严格说不算全固态；纳米复合 SPE 不含液体。");

  // ---------------- 20. Zn ----------------
  s = d.slide("CONTENT");
  s.addText("锌：水系的麻烦，与固体的三条路", { placeholder: "title" });
  d.fig(s, "zn_options", { x: 0.5, y: 1.2, w: 12.3, h: 3.55 });
  d.block(s, { x: 0.6, y: 4.9, w: 3.9, kind: "hist", tint: true, size: 13, body: "Zn²⁺ 在 β-Al₂O₃ 中的扩散（1982）、在 ZnZr₄(PO₄)₆ 中的扩散（1990）早有研究；(PEO)₄ZnCl₂ 等含锌 SPE 始于 1980 年代；2019 年报道 ZnPS₃。" });
  d.block(s, { x: 4.7, y: 4.9, w: 3.9, kind: "why", tint: true, size: 13, body: "Zn 与水相容，本身更安全；但水系里 Zn 长枝晶、变形，水的窗口又窄。固体 Zn²⁺ 导体很慢，于是另一条路是干脆让 OH⁻ 来导电。" });
  d.block(s, { x: 8.8, y: 4.9, w: 3.95, kind: "matters", tint: true, size: 13, body: "2018 年的两种膜：30 μm 厚的 PAN 基阳离子交换膜挡住 Zn 枝晶；季铵化 PVA 膜只让 OH⁻ 过，阻止 [Zn(NH₃)₆]²⁺ 串流。" });
  s.addNotes("ZnPS₃ 中 Zn²⁺ 位于扭曲的蜂窝网络，被 [P₂S₆]⁴⁻ 聚阴离子八面体配位；P–P 键有“弹性”，可拉伸以缓解 Zn²⁺ 扩散时的结构畸变，但电导率仍很低（60 °C 下 10⁻⁵–10⁻³ mS cm⁻¹）。碱性 Zn–Mn 和 Zn–空气电池中，主要的载流子是 OH⁻ 而不是 Zn²⁺，常用强碱性 KOH 电解液提高电导和氧溶解度。");

  // ---------------- 21. Ca & Al ----------------
  s = d.slide("CONTENT");
  s.addText("钙与铝：一个停滞，一个绕道", { placeholder: "title" });
  d.fig(s, "al_options", { x: 0.5, y: 1.25, w: 6.7, h: 3.98 });
  d.stat(s, { x: 0.6, y: 5.4, w: 3.2, value: "8,040", unit: "mAh cm⁻³", label: "Al 的理论体积比容量（原文）", color: "accent1" });
  d.column(s, 7.5, 1.3, 5.25, [
    { kind: "hist", body: "Ca²⁺ 在 β-Al₂O₃ 和 MZr₄(PO₄)₆ 中的传输研究集中在 1980 年代和 1990 年代初。Al 方面：2006 年 PVA–PAA 膜用于 Al–空气电池；2016、2019 年离子液体凝胶实现可逆镀铝和快充。" },
    { kind: "why", body: "Al³⁺ 电荷密度极高，几乎不可能在固体里快跑。所以 Al 体系“绕道”：用高分子锁住 KOH，或用 EMImCl–AlCl₃ 离子液体凝胶，让 AlCl₄⁻、Al₂Cl₇⁻ 这类络阴离子来搬运。" },
    { kind: "matters", body: "多价体系的固态电解质，往往不是“多价阳离子导体”，而是“能让多价金属可逆沉积的固体或准固体介质”。" },
  ], 0.18);
  d.quote(s, { x: 7.5, w: 5.25, en: "…no substantial progress in Ca²⁺ SSEs has been made since.", zh: "……此后 Ca²⁺ 固态电解质再无实质性进展。" });
  s.addNotes("原文：SSE 可以用来防止漏液、克服液体电解质对湿气的敏感；例如 PVA–聚丙烯酸（PAA）膜用于锁住 Al–空气电池的 KOH（ref. 75）；与 1-乙基-3-甲基咪唑氯盐–AlCl₃ 离子液体结合的 SPE 实现了可逆镀/脱 Al（ref. 76），并在以石墨为正极的全电池中实现小于 10 s 的快充（ref. 77）。Al 电池中搬运电荷的 AlCl₄⁻、Al₂Cl₇⁻ 是这类离子液体的常识，原文没有展开。");

  // ---------------- 22. Errata 1: Table 1 ----------------
  d.section("4 阅读校注");
  s = d.slide("CONTENT");
  s.addText("阅读校注①：Table 1 中的笔误", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.9, kind: "note", tint: true, head: "① 第 8 页 Polymers 一栏，Na⁺ 最后一行", body: "原文：“LiClO₄–PEO (Mw = 600,000) (EO:Na = 20:1) with 5 wt% TiO₂ nanoparticles”。\n这一行在 Na⁺ 组，比例写 EO:Na；所引 ref. 268 的标题是 “…TiO₂/PEO/NaClO₄ for sodium ion batteries”。应为 NaClO₄。" });
  d.block(s, { x: 6.85, y: 1.4, w: 5.9, kind: "note", tint: true, head: "② 脚注 a：配位数", body: "原文：半径为 “coordination number of four”。\n但 Li⁺ 0.76、Na⁺ 1.02、Mg²⁺ 0.72、Zn²⁺ 0.74、Al³⁺ 0.535 Å 都是 Shannon（1976）表中配位数 6 的值；配位数 4 时分别约为 0.59、0.99、0.57、0.60、0.39 Å。电荷密度按这些值算出，本身是自洽的。" });
  d.block(s, { x: 0.6, y: 3.95, w: 5.9, kind: "note", tint: true, head: "③ 第 7 页 Sulfides 一栏", body: "原文 Na⁺ 最后一行写作 “Na₇P₃Seᶜ”，漏了下标 11。按同一文献（ref. 52）和上面的 Li₇P₃Se₁₁，应为 Na₇P₃Se₁₁。" });
  d.block(s, { x: 6.85, y: 3.95, w: 5.9, kind: "def", tint: true, head: "补充：读 Table 1 时注意温度", body: "同一张表里温度从 25 °C 到 800 °C 不等，硫酸盐一栏还是高温相。比较时只在同一组内比，不要跨组比数值。" });
  s.addNotes("第 ② 条依据：Shannon, Acta Cryst. A32, 751 (1976) 的有效离子半径表。按配位数 4 的半径算，电荷密度会明显更大，但离子之间的相对次序不变。");

  // ---------------- 23. Errata 2: text ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注②：正文与表格不一致之处", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.9, kind: "note", tint: true, head: "① 第 9 页：MgSr₂Se₄", body: "原文：“the subsequently fabricated material, MgSr₂Se₄”。\n所引 ref. 63（Canepa 等 2017）报道的是尖晶石 MgSc₂Se₄（Sc，钪）。Sr 是 +2 价，放不进尖晶石 AB₂X₄ 中 +3 价的 B 位。应为 MgSc₂Se₄。" });
  d.block(s, { x: 6.85, y: 1.4, w: 5.9, kind: "note", tint: true, head: "② Mg(BH₄)(NH₂) 的电导率", body: "正文：“10⁻³ mS cm⁻¹ at 150 °C”（ref. 57）。\nTable 1：“0.003 (100 °C)” mS cm⁻¹（ref. 264）。\n活化能高达 1.0–1.3 eV 的材料，100 °C 时不可能比 150 °C 时还高 3 倍。两者来源不同，至少有一处温度或数值需要核对。" });
  d.block(s, { x: 0.6, y: 3.95, w: 5.9, kind: "note", tint: true, head: "③ 第 9 页：“40 多年前”", body: "原文：Zn²⁺ 在 β-Al₂O₃（ref. 67）和 ZnZr₄(PO₄)₆（ref. 68）中的扩散 “was studied more than 40 years ago”。\n两篇文献分别发表于 1982 和 1990 年，距 2019 年约 37 和 29 年。应为“30 多年前”。" });
  d.block(s, { x: 6.85, y: 3.95, w: 5.9, kind: "def", tint: true, head: "补充：Zn-NASICON 的两个数值", body: "正文：1.34 × 10⁻³ mS cm⁻¹（500 °C）；Table 1：3.7 mS cm⁻¹（800 °C），Eₐ 0.93 eV。\n按 0.93 eV 外推，从 500 °C 升到 800 °C 只能提高约 50 倍，到不了 3.7。两值可能来自不同样品，不宜放在一起比较。" });
  s.addNotes("第 ② 条的推理：σT ∝ exp(−Eₐ/kT)，Eₐ 为正时电导率随温度单调上升，所以“低温值大于高温值”说明两个数据不是同一样品、同一条件，或者有笔误。第 ③ 条若把“40 多年”理解为从 1970 年代算起，原文所引文献并不支持。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["电荷比半径更要紧", "电荷密度 = ne/(4/3 πr³)：Li⁺ 87、Mg²⁺ 205、Al³⁺ 748 C mm⁻³；同一晶格中二价慢 10–40 倍，三价慢约 1000 倍"],
    ["Li⁺ vs Na⁺ 没有统一答案", "β-Al₂O₃、NASICON 中 Na⁺ 更快；A₇P₃X₁₁ 中 Li⁺ 更快；界面脱溶剂 Na⁺ 更容易"],
    ["多价离子：几十年仍是难题", "NASICON 中 Eₐ 翻倍；出路是软阴离子（尖晶石硒化物）、短跳跃距离、造空位"],
    ["绕道也是办法", "Zn：传 OH⁻；Al：高分子锁 KOH、离子液体凝胶；Ca：自 1990 年代初停滞"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.5, fontSize: 15, color: "CADCE8", margin: 0, valign: "top", isTextBox: true });
  });
  s.addText([
    { text: "“The transport of metal ions is affected by many factors.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "金属离子的传输受许多因素影响。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.9, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("前三章讲完了“SSE 是什么、离子怎么走、换了离子会怎样”。从第 4 章开始讨论 SSE 在电池里会怎样失效：界面分解、体积变化和枝晶。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
