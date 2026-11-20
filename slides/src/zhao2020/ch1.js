// Zhao et al. 2020 — Chapter 1: 引言与固态电解质发展史
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Zhao et al., Nat. Rev. Mater. 2020",
  full: "Zhao, Stalin, Zhao & Archer. Designing solid-state electrolytes for safe, energy-dense batteries. Nature Reviews Materials (2020). doi:10.1038/s41578-019-0165-5",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch1_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 1, chapterTitle: "引言与固态电解质发展史", figDir });
  d.registerFigs(info);
  const C = d.C;

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 1 章\n为什么要把电解质做成固体？", { placeholder: "title" });
  s.addText("引言与固态电解质（SSE）发展史：从 Faraday 的 Ag₂S 到 LGPS 与 PEO", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文开头到“Ion transport in SSEs”之前（第 1–5 页，含 Fig. 1 发展时间线和 Fig. 2 常见 SSE 结构）。目标：知道固态电解质为什么重新变热、它的两大家族（无机 SIE 与聚合物 SPE）从哪里来、各自长什么样。");

  // ---------------- 2. Roadmap + reading key ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "为什么是固态、为什么是现在", "电导率追上液体 · 安全 · 新形态电池"],
    ["2", "两百年发展史", "Faraday → β-Al₂O₃ → NASICON → LGPS；PEO → 单离子"],
    ["3", "两大家族：SIE 与 SPE", "各自的长处、短板和设计原则"],
    ["4", "常见结构一览", "Fig. 2 的 5 种高分子架构与 7 种晶体结构"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.1, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("每个概念页的阅读标签", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  const keys = [
    ["hist", "历史 History", "哪一年、谁、做了什么"],
    ["why", "以前 → 为什么", "之前怎么做，为什么改成现在这样"],
    ["matters", "为什么重要", "这个概念在后面会派上什么用场"],
    ["quote", "原文金句", "原文的精彩句子，附中文翻译"],
  ];
  keys.forEach(([k, h, b], i) => {
    const y = 2.1 + i * 1.12;
    d.chip(s, 7.5, y + 0.05, k, 0.62);
    s.addText(h, { x: 8.35, y, w: 4.4, h: 0.4, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 8.35, y: y + 0.4, w: 4.4, h: 0.38, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("另有“义”（定义）和“注”（校注，记录原文笔误）两种辅助标签。", { x: 7.5, y: 6.45, w: 5.25, h: 0.35, fontSize: 13, color: "7A8794", margin: 0, isTextBox: true });
  s.addNotes("这是本系列 Zhao 2020 综述的第 1 章，共 6 章。第 1 章打基础：概念、历史和结构；第 2、3 章讲离子怎样在固体里走；第 4–6 章讲失效、设计和应用。");

  // ---------------- 3. What is an SSE ----------------
  d.section("1 为什么是固态");
  s = d.slide("CONTENT");
  s.addText("固态电解质 Solid-state electrolyte (SSE) 是什么", { placeholder: "title" });
  d.fig(s, "liquid_vs_solid", { x: 0.5, y: 1.25, w: 7.0, h: 4.4 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义", body: "电解质只导离子、不导电子。SSE 把它做成固体：陶瓷、玻璃或高分子。" },
    { kind: "hist", body: "1991 年 Sony 的锂离子电池用碳酸酯类有机电解液，至今仍是主流。这种液体易挥发、可燃。" },
    { kind: "why", body: "以前：液体导离子快、和电极贴得好。现在想换成固体：不燃、不漏，而且够硬。" },
    { kind: "matters", body: "固体模量高，被认为是让锂金属负极可充电、做出高能量电池的最直接路线。" },
  ], 0.16);
  d.quote(s, { y: 5.85, en: "Over the past 10 years, solid-state electrolytes (SSEs) have re-emerged as materials of notable scientific and commercial interest for electrical energy storage (EES) in batteries.", zh: "过去十年里，固态电解质（SSE）作为电化学储能（EES）材料再次引起科学界和产业界的极大兴趣。" });
  s.addNotes("“re-emerged（再次兴起）”这个词很关键：SSE 不是新东西，1960–80 年代就热过一轮（β-Al₂O₃ 的 Na–S 电池、PEO 聚合物电解质）。这一轮再兴起的最初动力是：固体模量高，被认为是把锂金属负极做成可充电池的最直接途径。");

  // ---------------- 4. Why now ①: conductivity ----------------
  s = d.slide("CONTENT");
  s.addText("为什么是现在①：固体的电导率追上了液体", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{
    name: "室温离子电导率",
    labels: ["Li₃PS₄  0.16", "Na₃PS₄（立方）  0.46", "典型液态电解液  ≈10", "Li₆PS₅Br  11", "LGPS（2011）  12", "Li₉.₅₄Si₁.₇₄P₁.₄₄S₁₁.₇Cl₀.₃  25"],
    values: [0.16, 0.46, 10, 11, 12, 25],
  }], {
    x: 0.5, y: 1.3, w: 7.0, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent5, HEX.accent5, HEX.accent6, HEX.accent5, HEX.accent5, HEX.accent1],
    invertedColors: [HEX.accent5],
    valAxisLogScaleBase: 10, valAxisMinVal: 0.1, valAxisMaxVal: 100,
    showValue: false,
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "25 °C 离子电导率（mS cm⁻¹，对数坐标）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "硫化物数据取自原文 Table 1；LGPS 取 Kamaya 等 2011 年报道值；液态电解液（1 M LiPF₆ 碳酸酯）约 10 mS cm⁻¹ 为公认量级。", { x: 0.6, y: 5.65, w: 6.9, h: 0.5 });
  d.stat(s, { x: 7.85, y: 1.3, w: 2.4, value: "~1", unit: "mS cm⁻¹", label: "多类 SSE 已达到的室温电导率", color: "accent2" });
  d.stat(s, { x: 10.4, y: 1.3, w: 2.4, value: "25", unit: "mS cm⁻¹", label: "最好的硫化物，超过液体", color: "accent1" });
  d.column(s, 7.85, 2.95, 4.9, [
    { kind: "hist", body: "2011 年 Kamaya、Kanno 等报道 LGPS（Li₁₀GeP₂S₁₂），室温约 12 mS cm⁻¹，第一次让固体追平液体。2016 年 Kato 等把纪录推到 25 mS cm⁻¹。" },
    { kind: "why", body: "以前：氧化物（如 LLZO）室温电导率多在 1 mS cm⁻¹ 以下。把骨架换成更大、更“软”的 S²⁻ 后，又高了一到两个数量级。" },
    { kind: "matters", body: "电导率这道门槛被跨过后，研究重心转向界面、稳定性和成本（第 4、5 章）。" },
  ]);
  s.addNotes("注意横轴是对数坐标：Li₃PS₄ 与最好的硫化物差了两个多数量级。原文说的“comparable to liquid electrolytes（与液体相当）”指的是约 1 mS cm⁻¹ 的量级；常用液态电解液其实在 10 mS cm⁻¹ 左右，所以只有少数最好的硫化物真正“超过”液体。");

  // ---------------- 5. Why now ②: safety & form factor ----------------
  s = d.slide("CONTENT");
  s.addText("为什么是现在②：大规模储能的安全，与新的电池形态", { placeholder: "title" });
  d.fig(s, "bipolar", { x: 0.5, y: 1.25, w: 6.6, h: 3.98 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2010 年代起，电动车、电网储能和家庭备用电源快速增长；电池从“手机里的一小块”变成“成千上万块挤在一起”。" },
    { kind: "why", body: "以前：小器件只需自身安全。现在：大系统靠近人群，监管更严。液体会在相邻单元之间串流，很难做“双极堆叠”；固体可以，一个外壳装下多个串联单元。" },
    { kind: "matters", body: "原文还举了可穿戴设备：电池要贴合衣物，对封装和安全的要求高于液体电解液目前能做到的水平。" },
  ]);
  d.quote(s, { y: 5.4, en: "…we foresee that growing safety-related concerns will become a major threat to present market-dominant EES technologies, including Li-ion batteries employing flammable liquid electrolytes.", zh: "我们预见，日益增长的安全顾虑将成为当前主流储能技术的重大威胁，包括使用可燃液态电解液的锂离子电池。" });
  s.addNotes("引文前半句是 “This increase in scale places stricter regulatory requirements on EES components and devices, as well as system-scale safety”。双极（bipolar）集流体一面接上一单元的正极、另一面接下一单元的负极，省掉了单体之间的外壳和导线。原文还提到：把电极和电解质尺寸缩小、消除传输不均，实验室固态锂金属电池可循环超过 10,000 次。");

  // ---------------- 6. Transference number ----------------
  s = d.slide("CONTENT");
  s.addText("单离子导体：迁移数 Transference number 接近 1", { placeholder: "title" });
  d.fig(s, "transference", { x: 0.5, y: 1.25, w: 6.9, h: 4.28 });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.65, w: 6.8, h: 1.1, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
  s.addText([
    { text: "t₊ = I₊ / (I₊ + I₋)", options: { fontSize: 22, bold: true, color: C.accent3, breakLine: true } },
    { text: "I₊、I₋：阳离子、阴离子各自携带的电流。t₊ = 1 表示电流全由阳离子携带。", options: { fontSize: 14, color: C.text2 } },
  ], { x: 0.85, y: 5.7, w: 6.4, h: 1.0, margin: 0, valign: "middle", isTextBox: true });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: "1853 年起，Hittorf 通过测量电解后两极附近浓度的变化，发现正、负离子跑得不一样快，提出了“迁移数”。" },
    { kind: "why", body: "液体里盐的阴、阳离子都能动，阴离子常常跑得更快。无机 SIE 的阴离子是晶格骨架、固定不动，所以天然是“单离子导体”。" },
    { kind: "matters", body: "电极反应只用得上阳离子。推动阴离子迁移的电压是浪费的能量，阴离子堆积还会形成浓差极化（第 2 章）。" },
  ]);
  s.addNotes("液态电解液 t₊ 通常小于 0.5 是公认的量级（LiPF₆/碳酸酯体系约 0.2–0.4）。原文原话：SIE “are often intrinsically single-ion cationic conductors, which leads to a higher charge-transport efficiency compared with liquid electrolytes”。聚合物电解质的 t₊ 也偏低，所以才有第 1 章 Fig. 2a 里的“单离子聚合物”。");

  // ---------------- 7. Section: history ----------------
  d.section("2 两百年发展史");
  s = d.slide("DARK_SECTION");
  s.addText("两百年发展史", { placeholder: "title" });
  s.addText("据原文 Fig. 1：无机 SIE 与聚合物 SPE 两条线，在 1960–70 年代分叉，2010 年代重新汇合", { placeholder: "body" });
  s.addNotes("原文 Fig. 1 是一张左右两栏的竖向时间轴：左边无机，右边聚合物，中间蓝框是“里程碑应用”（Na–S 电池、Na–NiCl₂ 电池、LiPON 薄膜电池、Bolloré 电动车）。下面三页把它拆成三条横向时间轴。");

  // ---------------- 8. Early timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史①：从 Faraday 到 β-Al₂O₃（1830s–1967）", { placeholder: "title" });
  d.fig(s, "tl_early", { x: 0.5, y: 1.2, w: 12.3, h: 4.17 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前人们以为固体里的原子是“钉死”的，只有液体能导离子。Faraday 的观察和 1914 年的 α-AgI 说明：某些固体里离子也能跑得很快。" });
  d.quote(s, { x: 6.8, y: 5.45, w: 5.95, en: "Interest in electrochemical cells based on SSEs dates back about 200 years to the work of Michael Faraday on the fast solid-state ion transport in PbF₂ and Ag₂S.", zh: "对基于 SSE 的电化学电池的兴趣，可追溯到约 200 年前 Faraday 对 PbF₂ 和 Ag₂S 中快速固态离子传输的研究。" });
  s.addNotes("时间轴不按比例。Faraday 的观察常被记为 1833–1834 年，原文 Fig. 1 标为 1838 年（见校注页）。Warburg 在 1880 年代用电解把 Na⁺ 赶过玻璃（原文记 1888 年）。Nernst 灯约 1900 年面世（原文记 1900 年）：加热后的 Y₂O₃–ZrO₂ 靠氧离子导电并发出白光，就是今天氧传感器和固体氧化物燃料电池电解质 YSZ 的前身。");

  // ---------------- 9. AgI ----------------
  s = d.slide("CONTENT");
  s.addText("AgI：第一个“超离子导体”", { placeholder: "title" });
  d.fig(s, "agi", { x: 0.5, y: 1.25, w: 6.6, h: 4.61 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1914 年，Tubandt 与 Lorenz 发现 AgI 加热到约 147 °C 时转变为 α 相，电导率陡增，达到约 1 S cm⁻¹，和熔盐相当。" },
    { kind: "why", body: "以前认为离子要靠“缺陷”才能动，所以固体导电很差。α-AgI 不一样：I⁻ 搭成体心立方骨架，Ag⁺ 可以待的位置远多于 Ag⁺ 的个数，像在骨架里“熔化”了一样。" },
    { kind: "matters", body: "“稳定的阴离子骨架 + 大量空位”成了后来设计 SSE 的核心思路。第 2 章会看到：体心立方（bcc）阴离子骨架也是 LGPS 导电快的原因。" },
  ]);
  d.caption(s, "左图为示意，未按真实数值绘制。", { x: 0.6, y: 5.95, w: 6.4 });
  s.addNotes("“超离子导体（superionic conductor）”指电导率接近液体电解质、但整体仍是固体的材料。原文 Fig. 1 把 AgI 列在 1914 年；原文正文还提到，后来在 AgI–Ag₂SeO₄ 体系里发现高导电玻璃，是固态离子学的一个突破（第 2 章）。");

  // ---------------- 10. beta-alumina ----------------
  s = d.slide("CONTENT");
  s.addText("β-Al₂O₃ 与 Na–S 电池：第一个真正用起来的 SSE", { placeholder: "title" });
  d.fig(s, "beta_nas", { x: 0.5, y: 1.25, w: 7.2, h: 4.49 });
  d.column(s, 7.95, 1.35, 4.8, [
    { kind: "hist", body: "1967 年，Ford 公司的 Yao 与 Kummer 发现 Na⁺ 在 β-Al₂O₃ 中扩散极快。Ford 随即用它做隔膜，提出 Na–S 电池。1980 年代又出现了 Na–NiCl₂（ZEBRA）电池。" },
    { kind: "why", body: "以前的电池都靠液体电解质。Na–S 电池反过来：电极是液体（熔融 Na 和 S），电解质是固体陶瓷管。" },
    { kind: "matters", body: "它证明了 SSE 可以做成商品电池；但 300 °C 以上的工作温度也说明，室温高电导才是真正的难题。" },
  ]);
  d.caption(s, "左：据原文 Fig. 2b 的 β-Al₂O₃ 结构简化重绘；右：管式 Na–S 电池示意。", { x: 0.6, y: 5.85, w: 7.0 });
  s.addNotes("β-Al₂O₃ 的结构像“千层饼”：致密的尖晶石块（Al 和 O）之间夹着疏松的 Na–O 传导面，Na⁺ 只能在二维平面里跑，所以是各向异性的导体。原文 Fig. 2b 图注：β、β′、β″-Al₂O₃ 的区别在于 R₂O（R = Na、K）含量依次增加。1967 年的论文里还测了 Li⁺、K⁺、Ag⁺、Rb⁺ 等离子在 β-Al₂O₃ 里的交换和扩散。");

  // ---------------- 11. Inorganic timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史②：无机固态电解质 SIE（1976–2016）", { placeholder: "title" });
  d.fig(s, "tl_inorg", { x: 0.5, y: 1.2, w: 12.3, h: 4.17 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前：Na⁺ 导体先行（β-Al₂O₃、NASICON）。1990 年代以后 Li 电池成为主角，Li⁺ 导体接连出现：从氧化物（LLTO、LLZO）到硫化物（LGPS），电导率一路提高。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.95, kind: "matters", tint: true, body: "这几类结构都会在第 3 章 Table 1 里再见到：同一种骨架装 Li⁺、Na⁺ 还是 Mg²⁺，表现差别很大。" });
  s.addNotes("时间轴不按比例。NASICON = Na super ionic conductor，1976 年由 Goodenough、Hong 与 Kafalas 报道（Na₁₊ₓZr₂SiₓP₃₋ₓO₁₂）。LISICON = Li super ionic conductor（Hong，1978）。原文 Fig. 1 另列：氢化物（1979 Li₂(NH)，2009 Li₂(BH₄)(NH₂)）、反钙钛矿 Li₃OCl（2012，Zhao & Daemen）、Na₁₁Sn₂PS₁₂（2018）、ZnPS₃（2019）。");

  // ---------------- 12. Polymer timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史③：聚合物电解质 SPE（1973–2013）", { placeholder: "title" });
  d.fig(s, "tl_poly", { x: 0.5, y: 1.2, w: 12.3, h: 4.17 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前 PEO 只能在约 60 °C 以上工作（室温会结晶）。后来的思路都是“打乱结晶”：加增塑剂、加陶瓷填料、做共聚和交联；再进一步，把阴离子挂到链上，提高迁移数。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.95, kind: "matters", tint: true, body: "2011 年起，Bolloré 的 Bluecar 用 Li 金属–聚合物电池在巴黎做共享电动车，这是 SPE 少见的大规模实际应用。" });
  s.addNotes("时间轴不按比例。Wright 组 1973 年发现 PEO 能溶解碱金属盐并导电；Armand 等 1978 年提出把这类材料用作电池电解质，聚合物电解质研究由此开始。PEO 熔点约 60 °C，室温下大部分结晶，所以 Bluecar 的电池需要加热保温工作。");

  // ---------------- 13. Section: two families ----------------
  d.section("3 两大家族");
  s = d.slide("DARK_SECTION");
  s.addText("两大家族：无机 SIE 与聚合物 SPE", { placeholder: "title" });
  s.addText("Solid inorganic electrolytes vs Solid polymer electrolytes：一个硬而快，一个软而好加工", { placeholder: "body" });

  // ---------------- 14. SIE vs SPE ----------------
  s = d.slide("CONTENT");
  s.addText("SIE vs SPE：各有长短", { placeholder: "title" });
  d.fig(s, "sie_vs_spe", { x: 0.5, y: 1.2, w: 7.0, h: 5.22 });
  d.column(s, 7.8, 1.35, 4.95, [
    { kind: "hist", body: "1960–70 年代，SSE 研究分成了两支：做陶瓷和玻璃的固体化学家，做高分子的聚合物科学家。两支文献至今“基本分家”。" },
    { kind: "why", body: "单靠一种材料，很难同时做到“导得快、够硬、贴得紧、好加工”。所以原文认为，取两者之长的复合与杂化是最快的路。" },
    { kind: "matters", body: "这张表是第 4 章（失效模式）和第 5 章（设计策略）的提纲：每个“✗”都对应一类失效和一组对策。" },
  ]);
  s.addNotes("SIE 的数值均出自原文 “Properties of SIEs and SPEs” 一节：室温电导率 >0.1 mS cm⁻¹，模量 >1 GPa（氧化物），线性扫描伏安测得窗口 >4.0 V，100 °C 以上仍稳定。SIE 的问题：大面积易碎、与电极接触差导致界面传输差、低电流密度下枝晶就可能沿晶界生长、价格高、对环境（如潮湿空气）不稳定。");

  // ---------------- 15. SIE design: electrostatics ----------------
  s = d.slide("CONTENT");
  s.addText("SIE 的设计原则：减弱静电吸引", { placeholder: "title" });
  d.fig(s, "anion_so", { x: 0.5, y: 1.25, w: 6.6, h: 4.4 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1785 年，Coulomb 用扭秤测出电荷间作用力 F ∝ q₁q₂ / r²。1963 年 Pearson 提出“软硬酸碱”：S²⁻ 大而“软”，O²⁻ 小而“硬”。" },
    { kind: "why", body: "早期做法：多留空位、做层状结构、多塞些 Li⁺。更根本的办法：拉开阳离子与阴离子的距离 r，比如用 S²⁻ 代替 O²⁻（Li–S 键比 Li–O 弱），这就是硫化物电导率高的原因。" },
    { kind: "matters", body: "Mg²⁺、Zn²⁺、Al³⁺ 电荷大，吸引力强得多，电导率通常低于 10⁻³ mS cm⁻¹（第 3 章）。" },
  ]);
  d.quote(s, { y: 5.85, en: "A more fundamental design principle is based on decreasing the electrostatic forces within the material.", zh: "一条更根本的设计原则，是减弱材料内部的静电作用力。" });
  s.addNotes("原文的逻辑：静电力可以通过增大可动阳离子与周围阴离子（O²⁻、S²⁻）的距离来减弱，具体做法是通过离子取代来设计阴离子骨架。另一个技巧：过量的 Li⁺ 往往占据高能位点，很容易迁移，会触发“协同迁移”（concerted migration，第 2 章）。");

  // ---------------- 16. SPE: why PEO ----------------
  s = d.slide("CONTENT");
  s.addText("SPE：为什么是 PEO，而不是聚乙烯？", { placeholder: "title" });
  d.fig(s, "dissociation", { x: 0.5, y: 1.25, w: 7.0, h: 4.05 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: "1926 年，Bjerrum 提出“离子对”概念：介电常数低的介质里，正负离子会成对粘在一起。1973 年 Wright 组发现 PEO 能溶解碱金属盐。" },
    { kind: "why", body: "PE、PP 便宜、稳定、强韧，但介电常数 ε < 5，拆不开离子对。PEO、PAN、PMMA、PVA 的主链上带有吸电子基团（醚氧、腈基、酯基、羟基），能把离子对拆开。" },
    { kind: "matters", body: "代价是 Li⁺ 和链“粘”在一起：链结晶时 Li⁺ 也被冻住。所以 SPE 设计的主线是抑制结晶（第 2、5 章）。" },
  ]);
  d.block(s, { x: 0.6, y: 5.5, w: 6.9, kind: "def", tint: true, head: "介电常数 ε（相对介电常数）", size: 13, body: "介质把两电荷间的库仑力削弱到真空时的 1/ε。水约 80，碳酸乙烯酯 EC 约 90，聚乙烯约 2.3。ε 越大，离子对越容易拆开。" });
  s.addNotes("SPE 的优点（原文）：容易合成、密度低、化学稳定、便宜、能用大规模工艺加工，在玻璃化转变温度以上有高分子特有的韧性。抑制结晶的物理手段：增塑剂、无机填料、共混、低聚物接枝纳米颗粒；化学手段：共聚、交联、引入离子侧基。");

  // ---------------- 17. SPE architectures ----------------
  s = d.slide("CONTENT");
  s.addText("常见 SPE 的五种分子架构", { placeholder: "title" });
  d.fig(s, "spe_arch", { x: 0.5, y: 1.2, w: 12.3, h: 3.75 });
  d.caption(s, "据原文 Fig. 2a 重绘（原图为化学结构式，这里改画成示意）。", { x: 0.6, y: 4.98, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.35, w: 3.9, kind: "hist", tint: true, size: 13, body: "1984 年出现交联 PEO 和梳状共聚物；1987 年出现 ABA 嵌段；2013 年 Bouchet 等做出 BAB 单离子三嵌段。" });
  d.block(s, { x: 4.7, y: 5.35, w: 3.9, kind: "why", tint: true, size: 13, body: "均聚物 PEO 室温结晶。梳状、嵌段、交联都是在不同尺度上“打乱”结晶，同时保住力学强度。" });
  d.block(s, { x: 8.8, y: 5.35, w: 3.95, kind: "matters", tint: true, size: 13, body: "单离子聚合物把阴离子共价连在主链上，t₊ 接近 1，直击 SPE 迁移数低的短板。" });
  s.addNotes("PVDF-HFP 是偏氟乙烯与六氟丙烯的共聚物，常做凝胶电解质的骨架。ABA 嵌段：A 是硬段（如聚苯乙烯类），提供机械强度；B 是 PEO 软段，负责导离子。原文 Fig. 2a 的 ABA 嵌段与单离子聚合物都带有磺酰亚胺锂（–SO₂–N⁻–SO₂CF₃ Li⁺）侧基。");

  // ---------------- 18. SIE structures A ----------------
  s = d.slide("CONTENT");
  s.addText("常见 SIE 的晶体结构①：氧化物", { placeholder: "title" });
  d.fig(s, "sie_struct_a", { x: 0.5, y: 1.2, w: 12.3, h: 3.96 });
  d.caption(s, "据原文 Fig. 2b 重绘（简化示意，非真实晶胞比例）。紫色 + 为可动阳离子。", { x: 0.6, y: 5.17, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.47, w: 5.9, kind: "hist", tint: true, size: 13, body: "β-Al₂O₃（1967）→ NASICON（1976）→ 钙钛矿 LLTO（1993）→ 石榴石 Li₅La₃M₂O₁₂（2003）与 LLZO（2007，Murugan 等）。" });
  d.block(s, { x: 6.8, y: 5.47, w: 5.95, kind: "matters", tint: true, size: 13, body: "LLZO 对 Li 金属较稳定，是氧化物路线的代表；含 Ti⁴⁺ 的 LLTO 会被 Li 金属还原（第 4 章）。" });
  s.addNotes("NASICON 的骨架由 PO₄ 四面体与 ZrO₆ 八面体共顶点连接，形成三维 Na⁺ 通道；Li₁₊ₓAlₓTi₂₋ₓ(PO₄)₃（LATP）和 Li₁₊ₓAlₓGe₂₋ₓ(PO₄)₃（LAGP）也是这种结构。钙钛矿 ABO₃：Li⁺ 被引入 A 位，A 位由 La³⁺、Li⁺ 或空位占据，TiO₆ 八面体在 B 位。石榴石通式 A₃B₂(XO₄)₃；LLZO 中 La、Zr 分别与 8 个、6 个 O 配位；立方相电导率远高于四方相。");

  // ---------------- 19. SIE structures B ----------------
  s = d.slide("CONTENT");
  s.addText("常见 SIE 的晶体结构②：硫化物、反钙钛矿、氢化物与薄膜", { placeholder: "title" });
  d.fig(s, "sie_struct_b", { x: 0.5, y: 1.2, w: 12.3, h: 3.96 });
  d.caption(s, "前三种据原文 Fig. 2b 重绘；LiPON 据原文 Fig. 1（1992，溅射 Li₃PO₄ 于 N₂ 中）补充，为薄膜电池示意。", { x: 0.6, y: 5.17, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.47, w: 5.9, kind: "hist", tint: true, size: 13, body: "硫化物：2001 年 thio-LISICON，2011 年 LGPS（均出自 Kanno 组）。氢化物：2009 年 Matsuo 等。反钙钛矿：2012 年 Zhao 与 Daemen。" });
  d.block(s, { x: 6.8, y: 5.47, w: 5.95, kind: "why", tint: true, size: 13, body: "从 O²⁻ 换成 S²⁻、BH₄⁻ 这类更大、更“软”的阴离子，正是上一节“减弱静电吸引”原则的直接体现。" });
  s.addNotes("反钙钛矿把钙钛矿 ABX₃ 的阴、阳离子位置对调：OLi₆ 八面体在中心，Cl⁻ 在角上，通式 Li₃OX（X = Cl、Br 或混合）。LGPS 是三维骨架，但原文 Fig. 2 图注说它沿 c 轴有一维 Li⁺ 通道；第 2 章会讲到后来的单晶实验发现它其实只是弱各向异性。LiPON 是 1992 年 Bates 等在美国橡树岭国家实验室做出的非晶薄膜电解质，开启了薄膜电池。");

  // ---------------- 20. Composite ----------------
  s = d.slide("CONTENT");
  s.addText("复合与杂化：取 SIE 与 SPE 之长", { placeholder: "title" });
  d.fig(s, "composite", { x: 0.5, y: 1.25, w: 7.0, h: 4.39 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: "1982 年 Weston 与 Steele 在 PEO 里加入 α-Al₂O₃ 惰性填料；1998 年 Croce、Scrosati 等改用纳米陶瓷颗粒；2017 年出现对齐的陶瓷纳米线。" },
    { kind: "why", body: "最初加填料只为增强力学、提高热稳定。后来发现它还能抑制结晶、促进盐解离；若陶瓷连成通道，离子还能走“高速路”。" },
    { kind: "matters", body: "层状 SPE–SIE 杂化让每一层各司其职：软层改善与正极的接触，硬层提高对碱金属负极的稳定性（第 5 章）。" },
  ]);
  d.quote(s, { y: 5.85, en: "Although the literature on SIEs and SPEs remains largely bifurcated, studies that cross these boundaries in pursuit of hybrid SSEs that combine the strengths of SIEs and SPEs provide the fastest path for progress.", zh: "尽管 SIE 与 SPE 的文献在很大程度上仍是分开的，跨越这条界线、追求兼具两者优点的杂化 SSE 的研究，才是进步最快的路径。" });
  s.addNotes("原文对复合电解质起源的描述：在 PEO 等离子导电高分子中加入惰性无机颗粒，提高力学强度和热稳定性、抑制结晶、促进盐解离。原文 Fig. 1 的复合聚合物一栏：1982 LiClO₄–PEO + α-Al₂O₃；1986 NaSCN–PEO + γ-Al₂O₃；1998 LiClO₄–PEO + Al₂O₃ 或 TiO₂；2017 LiClO₄–PAN + 对齐的 LLZO 纳米线。");

  // ---------------- 21. Chapter map ----------------
  d.section("4 本综述地图");
  s = d.slide("CONTENT");
  s.addText("本综述地图：6 章怎么串起来", { placeholder: "title" });
  d.fig(s, "chapter_map", { x: 0.5, y: 1.2, w: 12.3, h: 4.48 });
  d.quote(s, { y: 5.8, en: "In this Review, we begin by discussing the properties of SIEs and SPEs, comparing their structures and ion-transport mechanisms, including at interfaces.", zh: "本综述首先讨论 SIE 和 SPE 的性质，比较它们的结构和离子传输机理（包括界面处的传输）。" });
  s.addNotes("原文的顺序：性质与结构 → 离子传输（体相与界面）→ Li/Na/多价离子 → 失效模式（借助先进表征）→ 设计策略 → 在高电压、高容量正极（包括 S、O₂）电池中的应用与展望。本系列 6 章按这个顺序展开。");

  // ---------------- 22. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：第 1 章涉及的原文细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① Fig. 1：Faraday 的年份", body: "原文 Fig. 1 写 “(1838) PbF₂, Ag₂S”。\n多数固态离子学史料把 Faraday 对加热 Ag₂S、PbF₂ 导电的观察记在 1833–1834 年。1838 年可能是按文集出版时间计。\n本讲义按“1830 年代”处理。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 第 1 页：“与液体相当”", body: "原文说多类 SSE 室温电导率 “on the order of 1 mS cm⁻¹”，“comparable to” 液态电解液。\n常用碳酸酯电解液约 10 mS cm⁻¹，比 1 mS cm⁻¹ 高一个数量级；真正与液体持平或超过的只有 LGPS、Li₉.₅₄Si₁.₇₄P₁.₄₄S₁₁.₇Cl₀.₃ 等少数硫化物。" });
  d.block(s, { x: 0.6, y: 4.25, w: 12.15, kind: "def", tint: true, head: "补充：读 Fig. 1 时注意", body: "Fig. 1 中年份写的是代表性论文的发表年份，不一定是最早的发现年份。例如 NASICON 写 1976（Goodenough、Hong、Kafalas 的论文），β-Al₂O₃ 写 1967（Yao 与 Kummer 的论文）。原文正文说 SSE 研究可追溯到“约 200 年前”，从 1830 年代算起实际约 185 年。" });
  s.addNotes("这一章原文本身没有明显的数值错误。第 2 章（方程编号）和第 3 章（Table 1）有更具体的笔误，会在各自的校注页列出。");

  // ---------------- 23. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["SSE 重新变热的三个原因", "电导率追上液体（~1 至 25 mS cm⁻¹）· 大规模储能的安全 · 双极堆叠、可穿戴等新形态"],
    ["两百年历史，两条线", "无机：Faraday → AgI → β-Al₂O₃ → NASICON → LLZO → LGPS；聚合物：PEO（1973/1978）→ 复合、交联 → 单离子"],
    ["SIE：快、硬、t₊ ≈ 1，但脆、界面差", "设计原则：减弱静电吸引（拉开距离、换成大而软的 S²⁻）"],
    ["SPE：好加工、贴合好，但室温电导和 t₊ 低", "主线：拆开离子对（醚氧）+ 抑制结晶；出路：SIE–SPE 复合与杂化"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.5, fontSize: 15, color: "CADCE8", margin: 0, valign: "top", isTextBox: true });
  });
  s.addText([
    { text: "“…many of the materials design concepts of contemporary interest emerged in the 1960s, when the SSE field went through a period of rapid development…”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "今天关注的许多材料设计思路，都诞生于 1960 年代：那时 SSE 领域经历了一段快速发展期。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.9, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章进入“离子到底怎么在固体里走”：Nernst–Planck、Arrhenius、VTF 三个公式，以及空位、间隙、协同迁移和聚合物链段运动。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
