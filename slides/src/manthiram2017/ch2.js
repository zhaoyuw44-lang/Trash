// Manthiram, Yu & Wang 2017 — Chapter 2: 无机固态电解质
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");
const { wrap } = require("./ch123_qa");

const PAPER = {
  short: "Manthiram et al., Nat. Rev. Mater. 2017",
  full: "Manthiram, Yu & Wang. Lithium battery chemistries enabled by solid-state electrolytes. Nature Reviews Materials 2, 16103 (2017). doi:10.1038/natrevmats.2016.103",
};

// Fig. 2 radar readings (0–3, outward = better), read off the original figure by eye.
const RADAR_AXES = ["离子选择性", "还原稳定性", "氧化稳定性", "化学稳定性", "热稳定性", "力学性能", "加工成本", "器件集成", "离子 ASR", "电子 ASR"];
const RADAR = {
  oxide: [3.0, 2.4, 2.9, 2.0, 3.0, 2.0, 1.5, 1.0, 2.0, 2.8],
  sulfide: [3.0, 2.0, 2.0, 1.0, 2.5, 2.0, 2.0, 2.0, 2.6, 2.7],
  hydride: [2.7, 2.9, 2.0, 1.0, 1.5, 2.7, 2.7, 2.7, 2.1, 2.8],
  halide: [3.0, 3.0, 1.4, 1.4, 2.5, 1.5, 1.5, 1.5, 1.0, 3.0],
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch2_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 2, chapterTitle: "无机固态电解质", figDir });
  d.registerFigs(info);
  const C = d.C;
  const { fig, chk, report } = wrap(d);
  const NB = " ";

  const radar = (s, box, series, colors, title) => {
    s.addChart(d.pres.charts.RADAR, series.map(([name, key]) => ({ name, labels: RADAR_AXES, values: RADAR[key] })), {
      ...box, radarStyle: "standard", chartColors: colors, lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 6,
      valAxisMaxVal: 3, valAxisMinVal: 0, valAxisMajorUnit: 1, valAxisHidden: true,
      catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
      valGridLine: { color: "D5DCE2", size: 1 },
      showTitle: true, title, titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
      showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    });
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 2 章\n陶瓷与玻璃：无机固态电解质", { placeholder: "title" });
  s.addText("钙钛矿 · NASICON · 石榴石 · LISICON 与硫化物 · 氢化物、卤化物、硼酸/磷酸盐", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 0.9, w: 4.3, h: 5.8 });
  s.addNotes("本章对应原文“State-of-the-art solid electrolytes”与“Inorganic solid electrolytes”两小节（第 3–4 页，含 Table 1 和 Fig. 2 a–d）。原文这部分只有两页，信息很密，我们把每类材料的来龙去脉补全。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "怎样评价一个固态电解质", "性能清单 · Fig. 2 雷达图 · Table 1"],
    ["2", "氧化物", "钙钛矿 LLTO · NASICON · 石榴石 LLZO"],
    ["3", "从 LISICON 到硫化物", "O 换成 S · 玻璃陶瓷 · LGPS"],
    ["4", "其他家族与电导率对比", "氢化物 · 卤化物 · 硼酸/磷酸盐"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.0, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  chk("rm link", d.column(s, 7.5, 1.45, 5.25, [
    { kind: "def", head: "上一章回顾", body: "超离子导体的三条判据：可用位置远多于离子；相邻位置势垒低；位置连成通道。离子在晶体、玻璃、高分子中的走法各不相同。" },
    { kind: "matters", head: "本章要回答", body: "真实的无机材料怎样满足这三条判据？各家族的“长板”和“短板”分别是什么？为什么至今没有一种材料全面胜出？" },
  ], 0.4));
  s.addNotes("原文把无机固态电解质分为氧化物、硫化物、氢化物、卤化物、硼酸/磷酸盐和薄膜（Table 1），正文重点讨论钙钛矿、NASICON、石榴石和硫化物四类。薄膜和聚合物放到第 3 章。");

  // ---------------- 3. Properties ----------------
  d.section("1 怎样评价固态电解质");
  s = d.slide("CONTENT");
  s.addText("好电解质的“体检表”：不止电导率", { placeholder: "title" });
  fig(s, "properties", { x: 0.5, y: 1.2, w: 6.3, h: 4.6 });
  chk("prop col", d.column(s, 7.15, 1.3, 5.6, [
    { kind: "def", head: "面电阻 ASR (area-specific resistance)", body: `ASR = 厚度 ÷ 电导率，单位 Ω${NB}cm²。离子 ASR 越小越好；电子 ASR 越大越好，否则电池会自放电。` },
    { kind: "hist", body: "2015–2016 年，Mo 组与 Ceder 组的第一性原理计算指出：多数固态电解质的热力学稳定窗口远比早期实验报告的窄，“稳定”常靠界面上的钝化层。" },
    { kind: "why", body: "以前比电解质主要比电导率。原文强调：要真正用进电池，稳定性、力学、成本和可集成性同样重要，一项不及格就可能“一票否决”。" },
  ], 0.18));
  d.quote(s, { y: 5.95, en: "Ionic conductivity is a key property for solid electrolytes. However, for practical application in electrochemical energy storage and conversion systems, other properties are also important.", zh: "离子电导率是固态电解质的关键性质；但要实际用于电化学储能与转换系统，其他性质同样重要。" });
  s.addNotes("原文列出的要求：高离子电导率、低离子面电阻、高电子面电阻、高离子选择性、宽电化学窗口、与其他组件化学相容、优异的热稳定性和力学性能、工艺简单、成本低、易于器件集成、环境友好。图中按传输、稳定、力学、制造四组归类。");

  // ---------------- 4. Radar ----------------
  s = d.slide("CONTENT");
  s.addText("原文 Fig. 2：四类无机电解质的雷达图", { placeholder: "title" });
  radar(s, { x: 0.45, y: 1.15, w: 6.15, h: 4.05 }, [["氧化物", "oxide"], ["硫化物", "sulfide"]], [HEX.accent2, HEX.accent1], "氧化物 vs 硫化物（Fig. 2a, b）");
  radar(s, { x: 6.7, y: 1.15, w: 6.15, h: 4.05 }, [["氢化物", "hydride"], ["卤化物", "halide"]], [HEX.accent3, HEX.accent4], "氢化物 vs 卤化物（Fig. 2c, d）");
  chk("radar def", d.block(s, { x: 0.6, y: 5.35, w: 5.9, kind: "def", tint: true, head: "怎么读", size: 13, body: "越靠外越好（“加工成本”靠外 = 便宜，“离子 ASR”靠外 = 离子电阻小）。原图没有刻度，本页数值按原图目测（0–3 级），仅示意。" }));
  chk("radar matters", d.block(s, { x: 6.8, y: 5.35, w: 5.95, kind: "matters", tint: true, size: 13, body: "没有一种材料面面俱到：氧化物稳定但难加工、难集成；硫化物离子 ASR 小，却化学稳定性差。选电解质就是做取舍。" }));
  s.addNotes("几个要点：四类材料的离子选择性和电子 ASR 都很好，这是“固体”的共同优点。差别在化学稳定性、氧化稳定性和加工集成上。卤化物离子 ASR 最差（电导低），氢化物和卤化物都对 Li 金属稳定（还原稳定性靠外），但耐氧化差。");

  // ---------------- 5. Table 1 ----------------
  s = d.slide("CONTENT");
  s.addText("原文 Table 1：无机锂离子固态电解质一览", { placeholder: "title" });
  const hdr = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: HEX.dk1 }, fontSize: 14, valign: "middle" } });
  const cell = (t, o = {}) => ({ text: t, options: { fontSize: 13, color: HEX.dk1, valign: "middle", ...o } });
  const rows = [
    ["氧化物", "钙钛矿 LLTO、NASICON LiTi₂(PO₄)₃、LISICON Li₁₄Zn(GeO₄)₄、石榴石 Li₇La₃Zr₂O₁₂", "10⁻⁵–10⁻³", "化学/电化学稳定；强度高；耐高电压", "不柔韧；大规模生产贵"],
    ["硫化物", "Li₂S–P₂S₅、Li₂S–P₂S₅–MSₓ", "10⁻⁷–10⁻³", "电导高；强度与柔韧兼顾；晶界电阻低", "氧化稳定性低；怕潮；与正极相容差"],
    ["氢化物", "LiBH₄、LiBH₄–LiX (X = Cl, Br, I)、LiNH₂、Li₃AlH₆、Li₂NH", "10⁻⁷–10⁻⁴", "晶界电阻低；对 Li 稳定；强度与柔韧兼顾", "怕潮；与正极相容差"],
    ["卤化物", "LiI、尖晶石 Li₂ZnI₄、反钙钛矿 Li₃OCl", "10⁻⁸–10⁻⁵", "对 Li 稳定；强度与柔韧兼顾", "怕潮；氧化电压低；电导低"],
    ["硼酸 / 磷酸盐", "Li₂B₄O₇、Li₃PO₄、Li₂O–B₂O₃–P₂O₅", "10⁻⁷–10⁻⁶", "易制造、重复性好、耐久", "电导偏低"],
  ];
  const tint = ["F1ECF8", "FBF4DC", "E8F4F3", "F7ECF4", "F1F3F5"];
  s.addTable([
    [hdr("类型"), hdr("代表材料"), hdr("电导率 (S cm⁻¹)"), hdr("优点"), hdr("缺点")],
    ...rows.map((r, i) => r.map((t, j) => cell(t, { fill: { color: j === 0 ? tint[i] : i % 2 ? "FFFFFF" : "F8FAFB" }, bold: j === 0 || j === 2 }))),
  ], { x: 0.6, y: 1.25, w: 12.15, colW: [1.45, 4.0, 1.6, 2.75, 2.35], rowH: [0.45, 0.82, 0.7, 0.82, 0.7, 0.7], border: { type: "solid", pt: 0.75, color: "D5DCE2" }, margin: 0.06, fontFace: "+mn-lt" });
  d.caption(s, "据原文 Table 1 整理并译成中文；“薄膜 LiPON”和“聚合物 PEO”两行见第 3 章。原表钙钛矿化学式有笔误，这里写作 LLTO（见本章校注）。", { x: 0.6, y: 5.55, w: 12.1, h: 0.45 });
  chk("tbl matters", d.block(s, { x: 0.6, y: 6.0, w: 12.15, kind: "matters", size: 14, body: "Table 1 的电导率是“数量级区间”，看清上下限：氧化物和硫化物上限最高，所以原文正文只重点讨论这两类。" }));
  s.addNotes("注意表中氧化物和硫化物的上限都写作 10⁻³ S/cm。硫化物的上限其实已被 2011 年的 LGPS 突破到 10⁻² 量级，见校注。氢化物、卤化物的共同优点是对锂金属稳定，共同缺点是怕潮。");

  // ---------------- 6. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：无机锂离子导体的四十年", { placeholder: "title" });
  fig(s, "timeline", { x: 0.5, y: 1.1, w: 12.3, h: 4.25 });
  chk("tl why", d.block(s, { x: 0.6, y: 5.35, w: 5.9, kind: "why", tint: true, body: "早期的 Li⁺ 导体多从 Na⁺ 导体“移植”：NASICON 换成 Li 就得到 LiTi₂(PO₄)₃，LISICON 也沿用了“刚性骨架 + 可动离子”的思路。" }));
  chk("tl matters", d.block(s, { x: 6.8, y: 5.35, w: 5.95, kind: "matters", tint: true, body: "紫色氧化物追求稳定，橙色硫化物追求电导。2011 年的 LGPS 让固体室温电导首次追平液体（原文未提，此处补充）。" }));
  s.addNotes("时间轴不按比例。年份均为首次报道年份：Goodenough、Hong 与 Kafalas 1976（NASICON）；Hong 1978（LISICON）；Mercier 等 1981（Li2S–P2S5–LiI 玻璃）；Aono 等 1990（LATP）；Inaguma 等 1993（LLTO）；Kanno 与 Murayama 2001（thio-LISICON）；Murugan、Thangadurai 与 Weppner 2007（LLZO）；Kamaya 等 2011（LGPS）。");

  // ---------------- 7. Divider ----------------
  d.section("2 氧化物");
  s = d.slide("DARK_SECTION");
  s.addText("氧化物：稳定的“硬骨头”", { placeholder: "title" });
  s.addText("钙钛矿 LLTO  ·  NASICON（LATP / LAGP）  ·  石榴石 LLZO", { placeholder: "body" });
  s.addNotes("三种氧化物的共同点：都是由不动的金属–氧多面体搭成刚性骨架，Li+ 在骨架的空隙里移动。它们的区别在于骨架的形状和 Li+ 通道的维度。");

  // ---------------- 8. Perovskite ----------------
  s = d.slide("CONTENT");
  s.addText("钙钛矿 LLTO：A 位空位里的 Li⁺", { placeholder: "title" });
  fig(s, "perovskite", { x: 0.5, y: 1.2, w: 6.0, h: 4.7 });
  chk("pv col", d.column(s, 6.9, 1.3, 5.85, [
    { kind: "hist", body: `1993 年，日本的 Inaguma、Itoh 等报道 Li₃ₓLa₂/₃₋ₓTiO₃（LLTO），晶粒内电导约 10⁻³${NB}S${NB}cm⁻¹，在当时的氧化物中遥遥领先。` },
    { kind: "why", body: "在 ABO₃ 钙钛矿的 A 位故意留空：La³⁺ 少一些、Li⁺ 补进来。A 位上空位多，Li⁺ 就能沿空位跳跃。" },
    { kind: "matters", body: "LLTO 一度备受关注，却栽在“怕锂”上：Ti⁴⁺ 碰到锂金属会被还原。这也是后来石榴石更受青睐的原因。" },
  ]));
  d.quote(s, { y: 5.95, en: "Although this material created much interest among researchers, it has been deemed unsuitable in lithium batteries because of the reduction of Ti⁴⁺ on contact with lithium metal.", zh: "尽管这种材料曾引起研究者极大兴趣，但由于 Ti⁴⁺ 与锂金属接触会被还原，它被认为不适合用于锂电池。" });
  s.addNotes("LLTO 中 Li+ 从一个 A 位跳到相邻 A 位，要穿过四个氧离子围成的方形“瓶颈”。瓶颈大小随 La/Li 比例和晶格参数变化，所以电导对组成很敏感。原文 Table 1 中的化学式 Li3.3La0.56TiO3 应为 Li0.33La0.56TiO3。");

  // ---------------- 9. LLTO weak points ----------------
  s = d.slide("CONTENT");
  s.addText("LLTO 的两个软肋：晶界与 Ti⁴⁺ 还原", { placeholder: "title" });
  fig(s, "llto_weak", { x: 0.5, y: 1.2, w: 7.2, h: 4.2 });
  d.caption(s, "示意图：左为多晶陶瓷截面，红线为晶界；右为 Li 金属 | LLTO 界面。", { x: 0.6, y: 5.5, w: 7.0 });
  chk("llto col", d.column(s, 8.0, 1.3, 4.75, [
    { kind: "hist", body: "Inaguma 等 1993 年报道的高电导是晶粒内部的数值；多晶 LLTO 的总电导要低约两个数量级，被晶界“卡住”。" },
    { kind: "why", body: "以前文献常只报 bulk 电导。做成真实的陶瓷片后，晶界电阻占主导，所以要分清 bulk 与 total。" },
    { kind: "matters", body: "电子一旦能进入电解质，就成了“混合导体”：既漏电，又让还原层越长越厚。第 4 章的界面问题由此而来。" },
  ]));
  s.addNotes("晶界处原子排列混乱、可能有杂相和空间电荷层，Li+ 在这里跳跃更难。Table 1 中氧化物电导的下限 10⁻⁵ S/cm 大致就是多晶总电导。Ti⁴⁺ 被还原为 Ti³⁺ 后材料变黑，电子电导急剧上升。");

  // ---------------- 10. NASICON structure ----------------
  s = d.slide("CONTENT");
  s.addText("NASICON：为离子“设计”的骨架", { placeholder: "title" });
  fig(s, "nasicon", { x: 0.5, y: 1.2, w: 6.3, h: 4.6 });
  chk("nas col", d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: "1968 年 Hagman 与 Kierkegaard 解析了 NaM₂(PO₄)₃ 的结构；1976 年 Hong 以及 Goodenough、Hong 与 Kafalas 报道 Na₁₊ₓZr₂SiₓP₃₋ₓO₁₂ 的快 Na⁺ 传导，命名 NASICON（钠超离子导体）。" },
    { kind: "why", body: "Goodenough 的思路是先设计骨架：让通道足够宽、三维互通，再把可动离子放进去——正是第 1 章的三条判据。" },
    { kind: "matters", body: "通式 AM₂(PO₄)₃：A 位放 Li、Na 或 K，M 位常放 Ge、Zr 或 Ti。把 Na 换成 Li，就得到锂离子 NASICON 家族。" },
  ]));
  s.addNotes("NASICON 骨架由 MO6 八面体和 PO4 四面体共顶点连接而成：两个八面体夹三个四面体，组成所谓“灯笼”单元。灯笼之间的空隙连成三维通道。Goodenough 当年论文的题目就是 “Fast Na+-ion transport in skeleton structures”（骨架结构中的快速 Na+ 传输）。");

  // ---------------- 11. NASICON doping ----------------
  s = d.slide("CONTENT");
  s.addText("NASICON 的两个“旋钮”：LATP 与 LAGP", { placeholder: "title" });
  fig(s, "nasicon_doping", { x: 0.5, y: 1.2, w: 6.6, h: 4.35 });
  chk("nd col", d.column(s, 7.4, 1.3, 5.35, [
    { kind: "hist", body: `1990 年，Aono、Adachi 等报道 LATP（Li₁.₃Al₀.₃Ti₁.₇(PO₄)₃），室温约 7×10⁻⁴${NB}S${NB}cm⁻¹；1997 年 Fu 用玻璃陶瓷法制得 LAGP。日本 Ohara 公司后将这类玻璃陶瓷片商品化。` },
    { kind: "why", body: "原文：LiZr₂(PO₄)₃ 电导很低，换 Hf、Sn 有所改善；LiTi₂(PO₄)₃ 用 Al、Cr、Ga 等三价离子取代，以 Al 最有效。LAGP 因稳定窗口较宽而受关注。" },
    { kind: "matters", body: "NASICON 耐氧化，适合高电压。但 LATP 的 Ti⁴⁺ 同样会被 Li 还原，窗口有限（第 5 章还会遇到）。" },
  ], 0.18));
  d.quote(s, { y: 5.95, en: "NASICON-type materials are considered as suitable solid electrolytes for high-voltage solid electrolyte batteries.", zh: "NASICON 型材料被认为是适用于高电压固态电解质电池的电解质。" });
  s.addNotes("图中离子半径为 Shannon 有效离子半径（六配位，单位 Å）。原文列出的三价取代元素：Al、Cr、Ga、Fe、Sc、In、Lu、Y、La。Al3+ 除了带进额外的 Li+，还能帮助烧结致密、降低晶界电阻，所以效果最好。");

  // ---------------- 12. Garnet structure ----------------
  s = d.slide("CONTENT");
  s.addText("石榴石 LLZO：对锂金属友好的氧化物", { placeholder: "title" });
  fig(s, "garnet", { x: 0.5, y: 1.2, w: 6.3, h: 4.6 });
  chk("gar col", d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: `1969 年 Kasper 合成 Li₃Ln₃M₂O₁₂（M = Te、W）；2003 年 Thangadurai、Kaack 与 Weppner 报道 Li₅La₃M₂O₁₂；2007 年 Murugan、Thangadurai 与 Weppner 报道 Li₇La₃Zr₂O₁₂（LLZO），室温约 10⁻⁴${NB}S${NB}cm⁻¹ 量级。` },
    { kind: "why", body: "天然石榴石 A₃B₂Si₃O₁₂ 中 A 位 8 配位、B 位 6 配位。让 Li 占据原来 Si 的四面体位，并不断往结构里多“塞”Li，可动离子越来越多。" },
    { kind: "matters", body: "LLZO 最大的卖点是对锂金属稳定，成为配锂金属负极的头号氧化物候选。" },
  ]));
  s.addNotes("原文列出的代表体系：Li5La3M2O12（M = Nb、Ta）、Li6ALa2M2O12（A = Ca、Sr、Ba）、Li5.5La3M1.75B0.25O12，以及立方相 Li7La3Zr2O12 等。注意原文没有引用 Murugan 等 2007 年首次报道 LLZO 的论文，只引用了该组 2011 和 2013 年的掺杂工作。");

  // ---------------- 13. Garnet doping ----------------
  s = d.slide("CONTENT");
  s.addText("石榴石：塞更多 Li，再用掺杂稳住立方相", { placeholder: "title" });
  fig(s, "garnet_stuff", { x: 0.5, y: 1.2, w: 6.2, h: 3.9 });
  d.stat(s, { x: 0.7, y: 5.1, w: 6.0, value: "1.02×10⁻³", unit: "S cm⁻¹", label: "Te 掺杂 Li₆.₅La₃Zr₁.₇₅Te₀.₂₅O₁₂ 的室温电导（原文）", color: "accent3" });
  chk("gd col", d.column(s, 7.05, 1.3, 5.7, [
    { kind: "hist", body: "2011 年 Geiger 等发现：在氧化铝坩埚里烧结时混入的 Al 能稳定高电导的立方相；此后 Ta、Ga、Nb、Te 等掺杂被广泛研究。" },
    { kind: "why", body: "未掺杂的 LLZO 室温下是四方相，Li⁺ 排得整整齐齐，电导约低两个数量级。掺入高价离子造出 Li 空位，Li⁺ 变得无序，才得到立方相。" },
    { kind: "matters", body: "石榴石在空气中会与水和 CO₂ 反应，表面生成 Li₂CO₃，增大界面电阻。保存和加工都要注意。" },
  ], 0.18));
  d.quote(s, { x: 7.05, y: 5.6, w: 5.7, en: "A high ionic conductivity of 1.02 × 10⁻³ S cm⁻¹ has been realized with Li₆.₅La₃Zr₁.₇₅Te₀.₂₅O₁₂ at room temperature", zh: "Li₆.₅La₃Zr₁.₇₅Te₀.₂₅O₁₂ 在室温下实现了 1.02×10⁻³ S cm⁻¹ 的高离子电导率。" });
  s.addNotes("“塞 Li”的逻辑与第 1 章的判据相反相成：可动离子要多，但不能把位置占满。Li7 时 Li 太多、互相排斥而有序化（四方相）；掺杂把 Li 降到约 6.4–6.6，留出空位，电导反而最高。Te6+ 取代 Zr4+ 就是这样一种掺杂。");

  // ---------------- 14. O vs S ----------------
  d.section("3 从 LISICON 到硫化物");
  s = d.slide("CONTENT");
  s.addText("从 LISICON 到 thio-LISICON：把 O 换成 S", { placeholder: "title" });
  fig(s, "o_vs_s", { x: 0.5, y: 1.25, w: 6.3, h: 4.15 });
  chk("os col", d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: `1978 年 Hong 报道 LISICON（Li₁₄Zn(GeO₄)₄），300 °C 时电导约 0.1${NB}S${NB}cm⁻¹，室温却只有约 10⁻⁷。2001 年 Kanno 与 Murayama 把 O 换成 S，得到 thio-LISICON，室温达约 2×10⁻³${NB}S${NB}cm⁻¹。` },
    { kind: "why", body: "O²⁻ 小而“硬”，把 Li⁺ 抓得很紧；S²⁻ 大而“软”（易极化），对 Li⁺ 束缚弱、通道更宽，迁移势垒更低。" },
    { kind: "matters", body: "“换成硫”是硫化物电导领先的根本原因，也是它怕潮、不耐氧化的根源：S 比 O 更容易被氧化。" },
  ]));
  s.addNotes("LISICON 是 lithium superionic conductor 的缩写。thio- 是“硫代”的意思。2001 年的代表组成是 Li3.25Ge0.25P0.75S4（Li2S–GeS2–P2S5 体系）。离子半径为 Shannon 六配位数值。");

  // ---------------- 15. Sulfide glass ----------------
  s = d.slide("CONTENT");
  s.addText("硫化物玻璃与玻璃陶瓷", { placeholder: "title" });
  fig(s, "sulfide_glass", { x: 0.5, y: 1.2, w: 7.4, h: 3.7 });
  chk("sg matters", d.block(s, { x: 0.6, y: 5.15, w: 7.3, kind: "matters", tint: true, body: "Table 1 的硫化物以 Li₂S–P₂S₅ 为代表。它的玻璃陶瓷至今仍是全固态电池（第 4 章）最常用的电解质之一。" }));
  chk("sg col", d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: `1981 年 Mercier 等报道 Li₂S–P₂S₅–LiI 玻璃；1986 年 Kennedy 等研究 Li₂S–SiS₂ 玻璃，掺 Li₃PO₄ 后达 6.9×10⁻⁴${NB}S${NB}cm⁻¹。2005 年 Tatsumisago 组从玻璃中析出 Li₇P₃S₁₁。` },
    { kind: "why", body: "玻璃组成可连续调节、没有晶界；再加热析晶成玻璃陶瓷，能得到普通熔融法做不出来的高电导亚稳相。" },
  ]));
  s.addNotes("Mizuno、Hayashi、Tadanaga 与 Tatsumisago（2005）把 70Li2S·30P2S5 玻璃加热，析出亚稳相 Li7P3S11，室温约 3×10⁻³ S/cm。原文说“硫化物研究始于 1986 年的 Li2S–SiS2”，其实更早已有 1981 年的 Li2S–P2S5–LiI 玻璃（见校注）。");

  // ---------------- 16. LGPS ----------------
  s = d.slide("CONTENT");
  s.addText("LGPS 与硫银锗矿：固体追平液体", { placeholder: "title" });
  fig(s, "lgps", { x: 0.5, y: 1.2, w: 5.4, h: 4.65 });
  d.stat(s, { x: 6.3, y: 1.2, w: 3.1, value: "1.2×10⁻²", unit: "S cm⁻¹", label: "LGPS，室温（2011）", color: "accent1" });
  d.stat(s, { x: 9.6, y: 1.2, w: 3.1, value: "≈10⁻²", unit: "S cm⁻¹", label: "常用液体电解质", color: "accent6" });
  chk("lgps col", d.column(s, 6.3, 2.75, 6.45, [
    { kind: "hist", body: "2011 年，Kanno 组与丰田公司的 Kamaya 等报道 Li₁₀GeP₂S₁₂（LGPS）。2008 年 Deiseroth 等报道硫银锗矿型 Li₆PS₅X（X = Cl、Br、I）。" },
    { kind: "why", body: "thio-LISICON 的电导受通道限制；LGPS 提供沿 c 轴贯通的一维通道。Ge 昂贵，后续改用 Si、Sn，硫银锗矿则完全不含 Ge。" },
    { kind: "matters", body: "原文写于 2016 年，没有点名 LGPS 和硫银锗矿；但第 4 章说部分无机电解质电导“可比肩甚至超过液体”，指的正是它们。" },
  ], 0.18));
  s.addNotes("LGPS 的数值来自 Kamaya 等（Nature Materials, 2011），27 °C 下 12 mS/cm。2016 年 Kato 等报道的 Li9.54Si1.74P1.44S11.7Cl0.3 约 25 mS/cm。注意：高电导的硫化物热力学稳定窗口很窄，靠界面钝化层维持工作。");

  // ---------------- 17. Sulfide pros & cons ----------------
  s = d.slide("CONTENT");
  s.addText("硫化物：软得好加工，却怕水怕氧化", { placeholder: "title" });
  fig(s, "sulfide_pc", { x: 0.5, y: 1.15, w: 12.3, h: 3.05 });
  const yS = 4.35;
  chk("sp hist", d.block(s, { x: 0.6, y: yS, w: 3.9, kind: "hist", body: "2013 年 Sakuda、Hayashi 等测得 Li₂S–P₂S₅ 玻璃杨氏模量约 20 GPa，远低于氧化物，室温冷压即可致密。" }));
  chk("sp why", d.block(s, { x: 4.72, y: yS, w: 3.9, kind: "why", body: "氧化物要上千度烧结，还会与电极互扩散。硫化物冷压就行，晶界电阻低，与电极颗粒贴得紧。" }));
  chk("sp matters", d.block(s, { x: 8.84, y: yS, w: 3.9, kind: "matters", body: "H₂S 有毒，硫化物要在干燥间生产；氧化稳定性低，与高电压正极之间需要涂层（第 4 章）。" }));
  d.quote(s, { y: 6.0, en: "the chemical stability of the Li₂S–P₂S₅ system is poor, and the material is sensitive to moisture (that is, it generates gaseous H₂S).", zh: "Li₂S–P₂S₅ 体系的化学稳定性差，并且对水分敏感（会产生 H₂S 气体）。" });
  s.addNotes("原文给出的改进办法：加入金属氧化物（如引文 98 的 P2O5、ZnO），以及在 Li2S–P2S5 中引入氧原子，既提高稳定性，又降低与氧化物正极之间的界面电阻。");

  // ---------------- 18. Others ----------------
  d.section("4 其他家族与对比");
  s = d.slide("CONTENT");
  s.addText("另外三类：氢化物、卤化物、硼酸/磷酸盐", { placeholder: "title" });
  fig(s, "others", { x: 0.5, y: 1.15, w: 12.3, h: 3.4 });
  const yO = 4.75;
  chk("ot hist", d.block(s, { x: 0.6, y: yO, w: 3.9, kind: "hist", body: "1973 年 Liang 报道 LiI–Al₂O₃；2007 年 Orimo 组发现 LiBH₄ 高温相（约 115 °C 以上）达 10⁻³ S cm⁻¹；2012 年 Zhao 与 Daemen 报道 Li₃OCl。" }));
  chk("ot why", d.block(s, { x: 4.72, y: yO, w: 3.9, kind: "why", body: "这几类的共同卖点是“对 Li 金属稳定”；但多数怕潮、氧化电压低，难以搭配高电压正极。" }));
  chk("ot matters", d.block(s, { x: 8.84, y: yO, w: 3.9, kind: "matters", body: "Li₃PO₄ 本身电导低，但在氮气中溅射就变成 LiPON——第 3 章薄膜电解质的主角。" }));
  s.addNotes("数值区间来自原文 Table 1。LiBH4 室温下为正交相，电导只有约 10⁻⁸ S/cm；升温到约 115 °C 转变为六方相，BH4⁻ 阴离子开始转动，Li+ 电导跃升三个数量级。反钙钛矿 Li3OCl 由美国洛斯阿拉莫斯国家实验室报道。");

  // ---------------- 19. Conductivity chart ----------------
  s = d.slide("CONTENT");
  s.addText("室温电导率对比：跨越五个数量级", { placeholder: "title" });
  const bars = [
    ["LISICON", 1e-7, HEX.accent3, "~10⁻⁷"],
    ["Li₂S–SiS₂–Li₃PO₄", 6.9e-4, HEX.accent1, "6.9×10⁻⁴"],
    ["LATP", 7e-4, HEX.accent3, "7×10⁻⁴"],
    ["LLTO（晶内）", 1e-3, HEX.accent3, "1×10⁻³"],
    ["Te 掺杂 LLZO", 1.02e-3, HEX.accent3, "1.0×10⁻³"],
    ["thio-LISICON", 2.2e-3, HEX.accent1, "2.2×10⁻³"],
    ["Li₇P₃S₁₁", 3.2e-3, HEX.accent1, "3.2×10⁻³"],
    ["液体（参照）", 1e-2, HEX.accent6, "~10⁻²"],
    ["LGPS", 1.2e-2, HEX.accent1, "1.2×10⁻²"],
  ];
  s.addChart(d.pres.charts.BAR, [{ name: "室温电导率", labels: bars.map((b) => `${b[0]}  ${b[3]}`), values: bars.map((b) => b[1]) }], {
    x: 0.5, y: 1.15, w: 7.4, h: 5.6, barDir: "bar",
    chartColors: bars.map((b) => b[2]),
    valAxisLogScaleBase: 10, valAxisMinVal: 1e-8, valAxisMaxVal: 1e-1, valAxisLabelFormatCode: "0E+0",
    showValue: false,
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelFontSize: 11, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "室温离子电导率（S cm⁻¹，对数坐标）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  chk("cc col", d.column(s, 8.2, 1.3, 4.55, [
    { kind: "def", head: "数据与颜色", body: "紫 = 氧化物，橙 = 硫化物，灰 = 液体参照。数值取自原文或各材料的首次报道（来源见讲稿）。" },
    { kind: "why", body: "室温电导跨越五个数量级以上，所以必须用对数坐标：每一格相差 10 倍。" },
    { kind: "matters", body: "电导高不等于好用：LGPS 电导最高却不耐氧化、Ge 贵；LLZO 电导中等却对 Li 稳定。所以要配合雷达图一起看。" },
  ], 0.18));
  s.addNotes("数值来源：Te 掺杂 LLZO 1.02×10⁻³ 与 Li2S–SiS2–Li3PO4 6.9×10⁻⁴ 来自原文；LISICON 约 10⁻⁷（Hong 1978）；LATP 7×10⁻⁴（Aono 等 1990）；LLTO 晶内 1×10⁻³（Inaguma 等 1993）；thio-LISICON 2.2×10⁻³（Kanno 与 Murayama 2001）；Li7P3S11 3.2×10⁻³（Mizuno 等 2005）；LGPS 1.2×10⁻²（Kamaya 等 2011）；液体电解质取约 10⁻²（1 M LiPF6 碳酸酯溶液的常见量级）。");

  // ---------------- 20. Errata 1 ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注①：化学式与数值", { placeholder: "title" });
  chk("e1", d.block(s, { x: 0.6, y: 1.35, w: 5.9, kind: "note", tint: true, head: "① 第 3 页 Table 1：钙钛矿化学式", body: "原文 “Li₃.₃La₀.₅₆TiO₃” 应为 Li₀.₃₃La₀.₅₆TiO₃（即 x ≈ 0.11）。电荷检验：3.3 + 3×0.56 + 4 = 8.98 ≠ 6；0.33 + 1.68 + 4 = 6.01 ✓。" }));
  chk("e2", d.block(s, { x: 6.85, y: 1.35, w: 5.9, kind: "note", tint: true, head: "② 第 3 页 Table 1：硫化物电导上限", body: "表中写 10⁻⁷–10⁻³ S cm⁻¹，偏保守：thio-LISICON（2001）已达 2×10⁻³，LGPS（2011）达 1.2×10⁻²。原文第 5 页又说部分无机电解质电导“可比肩甚至超过液体电解质”，前后不一致。" }));
  chk("e3", d.block(s, { x: 0.6, y: 4.05, w: 5.9, kind: "note", tint: true, head: "③ 第 4 页：“Li₇.₀₆M₃Y₀.₀₆Zr₁.₉₄O₁₂ (M = La, Nb or Ta)”", body: "M 占的是 La 位（8 配位大阳离子位），Nb⁵⁺、Ta⁵⁺ 一般取代 Zr 位而非 La 位。所引文献 86 的组成实为 Li₇.₀₆La₃Y₀.₀₆Zr₁.₉₄O₁₂。" }));
  chk("e4", d.block(s, { x: 6.85, y: 4.05, w: 5.9, kind: "note", tint: true, head: "④ 第 3 页：LLTO “超过 10⁻³ S cm⁻¹”", body: "这是晶粒内（bulk）电导。多晶 LLTO 的总电导受晶界限制，约 10⁻⁵ S cm⁻¹，对应 Table 1 氧化物区间的下限。读文献时要分清 bulk 与 total。" }));
  s.addNotes("①是明显的小数点笔误。②是表格与正文的不一致，可能因为表格汇总自较早的综述。③属于化学上不合理的写法，很可能是合并多个组成时出的错。④不算错误，但不加说明容易误导。");

  // ---------------- 21. Errata 2 ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注②：历史与引用", { placeholder: "title" });
  chk("e5", d.block(s, { x: 0.6, y: 1.35, w: 5.9, kind: "note", tint: true, head: "⑤ 第 4 页：thio-LISICON 的体系", body: "原文说它“在 Li₂S–P₂S₅ 体系中被发现”。所引文献 93 的题目就是 “thio-LISICON: the Li₂S–GeS₂–P₂S₅ system”，应为三元体系。引文作者 “Maruyama” 应为 Murayama。" }));
  chk("e6", d.block(s, { x: 6.85, y: 1.35, w: 5.9, kind: "note", tint: true, head: "⑥ 第 4 页：“硫化物研究始于 1986 年”", body: "1986 年是 Kennedy 等的 Li₂S–SiS₂ 玻璃。更早的 1981 年，Mercier 等已报道 Li₂S–P₂S₅–LiI 硫化物玻璃快离子导体。" }));
  chk("e7", d.block(s, { x: 0.6, y: 4.05, w: 5.9, kind: "note", tint: true, head: "⑦ 第 4 页：6.9×10⁻⁴ S cm⁻¹ 的出处", body: "原文标注为引文 90（Ahn & Huggins 1991，研究 Li₂SiS₃）。掺 Li₃PO₄ 的 Li₂S–SiS₂ 玻璃达到该值的工作，应是引文 91（Kondo、Takada & Yamamura 1992）。" }));
  chk("e8", d.block(s, { x: 6.85, y: 4.05, w: 5.9, kind: "def", tint: true, head: "补充：原文没有提到的里程碑", body: "LLZO 的首次报道（Murugan 等 2007）、硫银锗矿 Li₆PS₅X（Deiseroth 等 2008）、LGPS（Kamaya 等 2011）。它们是 2017 年前后全固态电池研究的主力材料。" }));
  s.addNotes("⑤⑥可以直接从原文自己的参考文献中核对。⑦的判断依据是两篇文献的题目与内容：引文 91 的题目为 “New lithium ion conductors based on Li2S–SiS2 system”，研究的正是掺 Li3PO4 的玻璃；这一条把握中等。");

  // ---------------- 22. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["评价要全面", "电导率之外，还要看 ASR、稳定窗口、化学相容、力学、成本与集成（Fig. 2、Table 1）"],
    ["氧化物：稳但硬", "LLTO 怕 Li（Ti⁴⁺ 还原）；NASICON 耐高压（LATP、LAGP）；石榴石 LLZO 对 Li 稳定，靠掺杂稳住立方相"],
    ["硫化物：快但娇气", "O → S 让通道变宽；玻璃陶瓷、LGPS 追平液体；但怕潮（H₂S）、不耐氧化"],
    ["其他家族", "氢化物、卤化物对 Li 稳定但电导或耐压不足；磷酸盐引出第 3 章的 LiPON"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“The main inorganic solid electrolytes that are being explored for solid-state batteries are perovskite-type, NASICON-type, garnet-type and sulfide-type materials.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "目前用于固态电池研究的主要无机固态电解质，是钙钛矿型、NASICON 型、石榴石型和硫化物型材料。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.9, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章转向“软”的一边：聚合物电解质（PEO 与锂盐）、加了陶瓷填料的复合电解质，以及用气相沉积做出来的薄膜电解质 LiPON。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  report();
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
