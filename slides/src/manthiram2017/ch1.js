// Manthiram, Yu & Wang 2017 — Chapter 1: 引言与固态电解质发展史
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

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch1_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 1, chapterTitle: "引言与固态电解质发展史", figDir });
  d.registerFigs(info);
  const C = d.C;
  const { fig, chk, report } = wrap(d);
  const NB = " ";

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 1 章\n固体也能让离子“流动”吗？", { placeholder: "title" });
  s.addText("引言与固态电解质发展史：为什么要固态 · 从 Faraday 到“介体离子” · 离子怎样在固体中迁移", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 0.9, w: 4.3, h: 5.8 });
  s.addNotes("本章对应原文开头到“State-of-the-art solid electrolytes”之前（第 1–3 页，含 Fig. 1）。目标：知道为什么要用固态电解质、固态离子学两百年的来龙去脉，以及离子在晶体、玻璃和高分子中各自是怎么移动的。");

  // ---------------- 2. Roadmap + reading key ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "为什么要固态电解质", "液体电解质的老问题与安全隐患"],
    ["2", "固态离子学简史", "1830s Faraday → 1960s 转折 → Fig. 1"],
    ["3", "两大家族", "无机陶瓷 / 玻璃 vs 高分子"],
    ["4", "离子怎样在固体中走", "晶体缺陷 · 超离子导体 · 玻璃 · 高分子"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.0, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
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
  s.addNotes("这篇综述由 Texas 大学奥斯汀分校 Manthiram 组撰写，2017 年 2 月在线发表。全文 16 页，前半部分讲固态电解质材料，后半部分讲用它们“造”出来的新电池。本章是全系列的基础：后面每一章都会用到这里的概念。");

  // ---------------- 3. Six-chapter map ----------------
  s = d.slide("CONTENT");
  s.addText("这篇综述讲什么：六章地图", { placeholder: "title" });
  fig(s, "chapter_map", { x: 0.5, y: 1.15, w: 12.3, h: 4.95 });
  d.block(s, { x: 0.6, y: 6.05, w: 12.15, kind: "def", head: "一句话概括全文", tint: true, size: 14, body: "先讲固态电解质（材料、机理、性能），再讲它们“使能”(enable) 的新电池：全固态锂离子、Li–空气 / Li–S / Li–Br₂、介体离子水系电池。" });
  s.addNotes("标题里的 enabled by 是关键：作者的主张不是“用固态电解质替换液体”这么简单，而是固态电解质让一些原本做不成的电池化学成为可能。第 5、6 章就是这个主张的证据。");

  // ---------------- 4. Demand ----------------
  d.section("1 为什么要固态");
  s = d.slide("CONTENT");
  s.addText("电池的需求越来越“苛刻”", { placeholder: "title" });
  fig(s, "demand", { x: 0.5, y: 1.3, w: 6.6, h: 5.4 });
  chk("demand col", d.column(s, 7.45, 1.35, 5.3, [
    { kind: "hist", body: "1800 年 Volta 电堆用浸盐水的布片，1859 年 Planté 的铅酸电池用硫酸，1991 年 Sony 的锂离子电池用有机溶剂。原文：过去 200 年，大多数电池研究都围绕液体电解质。" },
    { kind: "why", body: "以前：电池主要拼价格和容量。现在：手机、电动车、电网储能要求能量密度、寿命、安全和成本同时提高，现有铅酸、镍氢、锂离子和液流电池都难以满足。" },
    { kind: "matters", body: "需求一变，电池里最“不起眼”的部件——电解质——就成了瓶颈和突破口。" },
  ]));
  s.addNotes("原文第一段列出了三类应用：消费电子、汽车动力、为风能和太阳能等间歇性可再生能源做负载平衡 (load-levelling)。电网储能对成本和寿命最敏感，电动车对能量密度和安全最敏感。");

  // ---------------- 5. Liquid vs solid ----------------
  s = d.slide("CONTENT");
  s.addText("液体电解质 vs 固态电解质隔膜", { placeholder: "title" });
  fig(s, "liquid_vs_solid", { x: 0.5, y: 1.2, w: 6.7, h: 4.5 });
  chk("lvs col", d.column(s, 7.5, 1.3, 5.25, [
    { kind: "hist", body: "固态隔膜的思路比锂离子电池还早：1960 年代 Ford 公司的 Na–S 电池，就用一根致密的 β-氧化铝陶瓷管隔开熔融 Na 和熔融 S（本章第 2 节）。" },
    { kind: "why", body: "液体电解质：电导率高、能充分润湿电极；但电化学和热稳定性不足、离子选择性低、安全性差。固态电解质把“隔膜”和“电解质”合二为一。" },
    { kind: "matters", body: "固态隔膜能把两极彻底隔开：一边是 Li 金属，另一边可以是水溶液、空气或液态硫——这就是第 5、6 章的新电池。" },
  ]));
  d.quote(s, { y: 5.85, en: "Replacement of liquid electrolytes with a solid-electrolyte separator will not only overcome the persistent problems of liquid electrolytes, but also offer possibilities for developing new battery chemistries.", zh: "用固态电解质隔膜取代液体电解质，不仅能克服液体电解质长期存在的问题，还为开发新的电池化学体系提供了可能。" });
  s.addNotes("“离子选择性低”(low ion selectivity) 是理解后文的钥匙：普通多孔隔膜浸满电解液，什么溶解的东西都能穿过去，比如 Li–S 电池里的多硫化物。致密的固态电解质只让 Li⁺ 通过。");

  // ---------------- 6. Safety ----------------
  s = d.slide("CONTENT");
  s.addText("最初的动机：锂离子电池的安全", { placeholder: "title" });
  fig(s, "safety_chain", { x: 0.5, y: 1.2, w: 12.3, h: 2.35 });
  const ySafe = 3.75;
  chk("safety hist", d.block(s, { x: 0.6, y: ySafe, w: 3.9, kind: "hist", body: "2006 年 Sony 笔记本电池大规模召回；2013 年波音 787 因电池起火停飞；2016 年三星 Galaxy Note 7 召回。原文：世界各地都有锂离子电池爆炸的报道。" }));
  chk("safety why", d.block(s, { x: 4.72, y: ySafe, w: 3.9, kind: "why", body: "以前靠“外部加保护”：熔断隔膜、PTC 开关、阻燃添加剂、电池管理系统。固态思路更彻底：把易燃的有机溶剂直接拿掉。" }));
  chk("safety matters", d.block(s, { x: 8.84, y: ySafe, w: 3.9, kind: "matters", body: "易燃的有机电解液遇上过充或短路，就可能起火甚至爆炸。安全是固态电解质进入室温电池的第一推动力。" }));
  d.quote(s, { y: 5.95, en: "Incorporation of solid-state electrolytes into ambient-temperature batteries was originally motivated by concerns over the safety of lithium-ion batteries.", zh: "把固态电解质引入室温电池，最初的动机是对锂离子电池安全性的担忧。" });
  s.addNotes("热失控是一个正反馈：温度升高 → 副反应加快 → 放出更多热。有机碳酸酯溶剂闪点低，是“燃料”。固态电解质本身不燃，相当于把燃烧三角形中的燃料拿掉。注意：固态并不自动等于绝对安全，正极分解放氧、锂金属本身仍需考虑。");

  // ---------------- 7. Faraday ----------------
  d.section("2 固态离子学简史");
  s = d.slide("CONTENT");
  s.addText("源头：Faraday 加热的固体", { placeholder: "title" });
  fig(s, "faraday", { x: 0.5, y: 1.25, w: 6.3, h: 4.45 });
  chk("faraday col", d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "1830 年代，Faraday 发现 Ag₂S 和 PbF₂ 加热后导电性大增，与金属“越热越难导电”正好相反。后来才明白：这是固体里的离子在移动。" },
    { kind: "why", body: "当时普遍认为只有液体（电解液、熔盐）才能导离子，固体中的原子是“钉死”的。Faraday 的观察第一次说明：固体也可以是电解质。" },
    { kind: "matters", body: "今天找固态电解质，本质上就是找“不用加热、在室温下就能像加热的 PbF₂ 那样导离子”的固体。" },
  ]));
  d.quote(s, { y: 5.9, en: "The history of solid-state ionic conductors dates back to as early as the 1830s, when Faraday discovered the remarkable property of conduction in heated solid Ag₂S and PbF₂", zh: "固态离子导体的历史可以追溯到 1830 年代：Faraday 发现加热的固体 Ag₂S 和 PbF₂ 具有显著的导电性。" });
  s.addNotes("金属靠电子导电，温度升高晶格振动加剧，电子被散射得更厉害，所以电阻增大。离子导体相反：离子跳跃是热激活过程，温度越高跳得越勤，电导率随温度指数上升（本章第 4 节的 Arrhenius 关系）。图为定性示意。");

  // ---------------- 8. Ionics timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：固态离子导体的发现", { placeholder: "title" });
  fig(s, "ionics_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  chk("tl why", d.block(s, { x: 0.6, y: 5.3, w: 5.9, kind: "why", tint: true, body: "1960 年代以前，固体快离子导电多见于高温或 Ag⁺ 导体，像实验室奇观；1960 年代起被做成储能器件，开始走向应用。" }));
  chk("tl matters", d.block(s, { x: 6.8, y: 5.3, w: 5.95, kind: "matters", tint: true, body: "原文：1973 年发现 PEO 能传导离子后，固态离子学“不再局限于无机材料”。1980 年同名期刊创刊，学科正式成形。" }));
  s.addNotes("时间轴不按比例。Nernst 1899 年用掺杂氧化锆做“能斯特灯”（氧离子导体）；Tubandt 与 Lorenz 1914 年发现 α-AgI（约 147 °C 以上）的电导率与熔盐相当。RbAg4I5 由 Owens & Argue 与 Bradley & Greene 在 1967 年分别报道。紫色：原文点名的三次储能演示。");

  // ---------------- 9. Fig. 1 redrawn ----------------
  s = d.slide("CONTENT");
  s.addText("原文 Fig. 1：固态电解质电池的五个十年", { placeholder: "title" });
  fig(s, "fig1_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.caption(s, "据原文 Fig. 1 重绘；括号内为本系列对应章节。", { x: 0.6, y: 5.32, w: 12.0 });
  chk("fig1 why", d.block(s, { x: 0.6, y: 5.62, w: 5.9, kind: "why", body: "每个十年的新电池，都是“同一种思路 + 新的电极组合”：用一层只放特定离子通过的固体，把原本不能放在一起的两个电极隔开。" }));
  d.quote(s, { x: 6.8, y: 5.62, w: 5.95, en: "the 1960s are generally considered the turning point for high-conductivity solid-state electrolytes and the starting point for the term ‘solid-state ionics’", zh: "1960 年代通常被视为高电导固态电解质的转折点，也是“固态离子学”一词的起点。" });
  s.addNotes("这张时间线也是全文的目录：1960s 的 Na–S 和 1980s 的 ZEBRA 是背景；1980s 的聚合物电池和 1990s 的无机固态锂电池对应第 2–4 章；2000s 的液/气态正极电池对应第 5 章；2010s 的介体离子水系电池对应第 6 章。");

  // ---------------- 10. beta-alumina ----------------
  s = d.slide("CONTENT");
  s.addText("β-氧化铝：Na⁺ 的二维“高速公路”", { placeholder: "title" });
  fig(s, "beta_alumina", { x: 0.5, y: 1.25, w: 6.5, h: 4.75 });
  d.caption(s, "结构示意：致密的尖晶石块与疏松的传导面交替堆叠（未按比例）。", { x: 0.6, y: 6.15, w: 6.3 });
  chk("ba col", d.column(s, 7.25, 1.35, 5.5, [
    { kind: "hist", body: "1967 年，Ford 公司的 Yao 与 Kummer 报道 β-氧化铝（名义组成 Na₂O·11Al₂O₃）中 Na⁺ 的快速二维扩散；Ford 随即用它开发出高温 Na–S 电池。" },
    { kind: "why", body: "多孔隔膜挡不住熔融 Na 与熔融 S 直接反应。β-氧化铝是致密陶瓷：Na⁺ 只能沿传导面穿过，别的东西都过不去。" },
    { kind: "matters", body: "“致密陶瓷只放一种离子通过”——这正是后面 Li–空气、Li–S、介体离子电池（第 5、6 章）的核心思路。" },
  ]));
  s.addNotes("β-氧化铝里，厚厚的 Al–O 尖晶石块之间夹着一层很稀疏的“传导面”，只有少量桥氧和 Na⁺。Na⁺ 在面内有很多空位可跳，所以面内电导很高；垂直方向被尖晶石块挡住，所以是二维导体。实际电池多用 Na⁺ 含量更高、电导更好的 β″-氧化铝。");

  // ---------------- 11. Na–S and ZEBRA ----------------
  s = d.slide("CONTENT");
  s.addText("高温钠电池：Na–S 与 ZEBRA", { placeholder: "title" });
  fig(s, "nas_zebra", { x: 0.5, y: 1.2, w: 6.6, h: 4.5 });
  chk("nas col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1980 年代，南非 Coetzer 等开发 ZEBRA 电池（Na/NiCl₂）。原文：Na–S 电池已在日本商业化，ZEBRA 电池由美国通用电气 (GE) 继续开发。" },
    { kind: "why", body: "ZEBRA 把 Na–S 中腐蚀性强的熔融硫正极换成 NiCl₂ 加熔盐，电压更高、更耐过充，但仍需约 300 °C 才能让 β″-氧化铝和电极足够导电。" },
    { kind: "matters", body: "高温意味着保温、能耗和安全设计。能否在室温下用固态电解质，就成了下一步的核心问题。" },
  ]));
  d.quote(s, { y: 5.85, en: "At present, the high-temperature sodium–sulfur battery system is the only viable energy storage technology that uses a solid electrolyte.", zh: "目前，高温钠硫电池是唯一真正可行的、使用固态电解质的储能技术。", ref: "原文“结论”一节" });
  s.addNotes("ZEBRA 是 Zeolite Battery Research Africa 项目的缩写。两种电池的负极都是熔融钠，装在 β″-氧化铝陶瓷管内（或外）。图中电压为常用的开路电压近似值：Na–S 约 2.1 V，Na/NiCl2 约 2.6 V。");

  // ---------------- 12. Silver conductors ----------------
  s = d.slide("CONTENT");
  s.addText("Ag⁺ 导体：导电最好，却没能流行", { placeholder: "title" });
  fig(s, "silver_cell", { x: 0.5, y: 1.25, w: 5.7, h: 3.7 });
  d.stat(s, { x: 0.7, y: 5.1, w: 2.7, value: "≈0.25", unit: "S cm⁻¹", label: "RbAg₄I₅ 的室温电导率", color: "accent3" });
  d.stat(s, { x: 3.5, y: 5.1, w: 2.7, value: "<1", unit: "V", label: "Ag/I₂ 电池电压", color: "accent4" });
  chk("ag col", d.column(s, 6.6, 1.35, 6.15, [
    { kind: "hist", body: "1960 年 Reuter 与 Hardel 报道 Ag₃SI；1967 年 Owens & Argue 与 Bradley & Greene 分别报道 RbAg₄I₅。原文把 Ag₃SI、β-氧化铝、RbAg₄I₅ 列为 1960–70 年代初三次成功的储能演示。" },
    { kind: "why", body: "Ag⁺ 导体电导极高，但 Ag 又重又贵，Ag/I₂ 电池电压不到 1 V，只能用在小众场合。于是研究者转向更轻、电压更高的 Na⁺ 和 Li⁺。" },
    { kind: "matters", body: "它们证明了“超离子导体”确实存在，也给出了结构线索：骨架不动，Ag⁺ 在远多于其数目的位置之间流动（见本章第 4 节）。" },
  ]));
  s.addNotes("RbAg4I5 的室温电导率约 0.2–0.3 S/cm，比今天最好的锂离子固态电解质还高一个数量级，这个纪录保持了几十年。电压估算：AgI 的标准生成自由能约 −66 kJ/mol，对应电动势约 0.69 V。");

  // ---------------- 13. Family tree ----------------
  s = d.slide("CONTENT");
  s.addText("锂离子固态电解质的两大家族", { placeholder: "title" });
  fig(s, "family_tree", { x: 0.5, y: 1.1, w: 12.3, h: 4.05 });
  chk("tree hist", d.block(s, { x: 0.6, y: 5.3, w: 5.9, kind: "hist", tint: true, body: "1973 年 Wright 等发现 PEO–盐络合物；1978 年 Armand 提议用作电池电解质。1990 年代初，橡树岭国家实验室 (ORNL) 的 Bates 等做出 LiPON 薄膜。" }));
  chk("tree why", d.block(s, { x: 6.8, y: 5.3, w: 5.95, kind: "why", tint: true, body: "陶瓷：电导高、稳定，但又硬又脆、难加工。高分子：柔软、易成大面积膜，但室温电导低。第 3 章的“复合”就是想取两者之长。" }));
  s.addNotes("原文把锂离子电池用的固态电解质分成两类：锂离子导电高分子与无机锂离子导电陶瓷。受 LiPON 启发，人们又开发了钙钛矿、NASICON、石榴石和硫化物等无机材料（第 2 章）。凝胶聚合物含液体，原文明确不讨论。");

  // ---------------- 14. Devices ----------------
  s = d.slide("CONTENT");
  s.addText("固态离子学的用武之地", { placeholder: "title" });
  fig(s, "devices", { x: 0.5, y: 1.25, w: 6.3, h: 5.5 });
  chk("dev col", d.column(s, 7.1, 1.35, 5.65, [
    { kind: "hist", body: "1976 年前后，ZrO₂ 基汽车尾气氧传感器开始量产；固体氧化物燃料电池、电致变色“智能窗”也都依赖固态离子导体。原文：固态电解质已成为传感器、超级电容器、燃料电池和电池的关键部件。" },
    { kind: "why", body: "原文总结的 21 世纪研究重点：用先进表征弄清传输机理、寻找新的超离子导体、提升器件性能、开拓新应用。" },
    { kind: "matters", body: "氧传感器能在汽车里可靠工作十几年，说明固体电解质本身可以非常耐用。电池的难点在于：室温下 Li⁺ 要跑得足够快。" },
  ]));
  s.addNotes("这些器件大多在高温工作（氧传感器、固体氧化物燃料电池都在几百摄氏度），因为氧离子在室温下太慢。锂电池需要的是室温快离子导体，这就是后面几章的主题。");

  // ---------------- 15. Section divider ----------------
  d.section("3 离子怎样在固体中走");
  s = d.slide("DARK_SECTION");
  s.addText("离子怎样在固体中“走路”", { placeholder: "title" });
  s.addText("晶体：缺陷与超离子导体  ·  玻璃：短程有序  ·  高分子：链段运动", { placeholder: "body" });
  s.addNotes("原文“Mechanism of ionic transport in solids”一节只有三段，但它是理解第 2、3 章所有材料的钥匙。我们按晶体、玻璃、高分子三种情况展开。");

  // ---------------- 16. Defects ----------------
  s = d.slide("CONTENT");
  s.addText("晶体里的点缺陷：Schottky 与 Frenkel", { placeholder: "title" });
  fig(s, "defects", { x: 0.5, y: 1.25, w: 6.7, h: 3.7 });
  d.block(s, { x: 0.6, y: 5.2, w: 6.5, kind: "def", tint: true, head: "原文要点", body: "晶体中的离子传输一般取决于缺陷的浓度和分布。图中灰色大球为阴离子，紫色小球为阳离子，红色虚线圈为空位。" });
  chk("def col", d.column(s, 7.55, 1.35, 5.2, [
    { kind: "hist", body: "1926 年 Frenkel 提出“空位–间隙离子对”；1930 年 Wagner 与 Schottky 提出成对空位的缺陷模型。点缺陷理论由此建立。" },
    { kind: "why", body: "完美晶体中每个格点都被占满，离子无处可挪。缺陷（空位、间隙离子）给了离子“腾挪的空间”。" },
    { kind: "matters", body: "电导率 ≈ 可动离子浓度 × 迁移率。用异价掺杂“制造”空位或间隙离子，是提高电导最常用的手段（第 2 章 NASICON、石榴石都在用）。" },
  ]));
  s.addNotes("Schottky 缺陷：正、负离子按化学计量比各缺一个，晶体保持电中性。Frenkel 缺陷：一个离子离开格点钻进间隙，留下一个空位。在 AgCl、AgBr 这类卤化银里，Ag+ 的 Frenkel 缺陷主导离子电导。");

  // ---------------- 17. Mechanisms ----------------
  s = d.slide("CONTENT");
  s.addText("五种扩散机理：离子怎么“挪一步”", { placeholder: "title" });
  fig(s, "mechanisms", { x: 0.5, y: 1.2, w: 12.3, h: 3.3 });
  const yM = 4.75;
  chk("mech hist", d.block(s, { x: 0.6, y: yM, w: 3.9, kind: "hist", body: "1947 年，Smigelskas 与 Kirkendall 用“标记物漂移”实验证明：原子在晶体中扩散靠的是空位（Kirkendall 效应），空位机制从此被普遍接受。" }));
  chk("mech why", d.block(s, { x: 4.72, y: yM, w: 3.9, kind: "why", body: "简单空位机制只需一个空位。快离子导体里可动离子多、彼此排斥，于是常出现“推一个走一个”（间隙–替位交换）甚至一串离子一起动（协同机制）。" }));
  chk("mech matters", d.block(s, { x: 8.84, y: yM, w: 3.9, kind: "matters", body: "协同运动时，一串离子的总势垒可以比“单个离子跳一步”还低。这是理解第 2 章快离子导体（如石榴石、硫化物）的重要思路。" }));
  s.addNotes("原文列举：基于 Schottky 和 Frenkel 点缺陷的简单空位机制，以及较复杂的双空位、间隙、间隙–替位交换和协同机制。图中橙色箭头表示离子的一次跳跃；淡紫色为参与跳跃的那一行离子。");

  // ---------------- 18. Superionic ----------------
  s = d.slide("CONTENT");
  s.addText("超离子导体：不靠缺陷也能快", { placeholder: "title" });
  fig(s, "superionic", { x: 0.5, y: 1.2, w: 6.3, h: 4.55 });
  chk("sup col", d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: "1930 年代，Strock 测定 α-AgI 结构：I⁻ 排成体心立方骨架，Ag⁺ 无序地分布在远多于其数目的位置上，好像一个“熔化的亚晶格”。" },
    { kind: "why", body: "以前认为高电导需要高缺陷浓度。超离子导体换了思路：骨架本身就留好了大量相连的空位置，不需要额外“制造”缺陷。" },
    { kind: "matters", body: "原文给出的三条判据是筛选新固态电解质的“体检表”：可用位置远多于可动离子；相邻位置间势垒低；这些位置连成连续通道。" },
  ]));
  d.quote(s, { y: 5.95, en: "some materials with special structures can achieve high ionic conductivities without a high concentration of defects.", zh: "某些具有特殊结构的材料，无需高浓度缺陷也能实现高离子电导。" });
  s.addNotes("这类结构通常由两套亚晶格组成：不动离子构成的晶体骨架，以及可动离子构成的亚晶格。三条判据缺一不可：位置不够多，离子会互相堵；势垒太高，离子跳不动；位置不连通，离子只能原地打转。");

  // ---------------- 19. Arrhenius ----------------
  s = d.slide("CONTENT");
  s.addText("电导率与活化能：为什么固态电解质怕冷", { placeholder: "title" });
  const kB = 8.617e-5, A = 1e-3 * 298 / Math.exp(-0.25 / (kB * 298));
  const Ts = [-20, 0, 20, 40, 60, 80, 100];
  const sig = (Ea) => Ts.map((t) => { const T = t + 273; return +(A / T * Math.exp(-Ea / (kB * T))).toPrecision(2); });
  s.addChart(d.pres.charts.LINE, [
    { name: "Eₐ = 0.25 eV", labels: Ts.map((t) => `${t}`), values: sig(0.25) },
    { name: "Eₐ = 0.50 eV", labels: Ts.map((t) => `${t}`), values: sig(0.5) },
  ], {
    x: 0.5, y: 1.25, w: 6.4, h: 4.6,
    chartColors: [HEX.accent2, HEX.accent4], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 7,
    valAxisLogScaleBase: 10, valAxisMinVal: 1e-9, valAxisMaxVal: 1e-1, valAxisLabelFormatCode: "0E+0",
    showTitle: true, title: "示意计算：电导率 σ（S cm⁻¹，对数坐标）随温度", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "温度（°C）", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.caption(s, "两条曲线取相同前置因子 A，使 Eₐ = 0.25 eV 时 25 °C 下 σ = 10⁻³ S cm⁻¹。", { x: 0.6, y: 5.95, w: 6.3, h: 0.45 });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 7.2, y: 1.3, w: 5.55, h: 1.25, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
  s.addText([
    { text: "σT = A · exp(−E", options: { fontSize: 22, bold: true, color: C.accent1 } },
    { text: "a", options: { fontSize: 22, bold: true, color: C.accent1, subscript: true } },
    { text: " / k", options: { fontSize: 22, bold: true, color: C.accent1 } },
    { text: "B", options: { fontSize: 22, bold: true, color: C.accent1, subscript: true } },
    { text: "T)", options: { fontSize: 22, bold: true, color: C.accent1, breakLine: true } },
    { text: "Eₐ：活化能（跳一步要翻过的“坎”）；k_B：玻尔兹曼常数；T：绝对温度；A：与载流子浓度、跳跃频率有关".replace("k_B", "kB"), options: { fontSize: 13, color: C.text2 } },
  ], { x: 7.4, y: 1.33, w: 5.2, h: 1.2, margin: 0, valign: "middle", isTextBox: true });
  chk("arr col", d.column(s, 7.2, 2.75, 5.55, [
    { kind: "hist", body: "1889 年 Arrhenius 提出反应速率随温度指数变化的公式。离子跳跃同样是“热激活”过程，所以固体离子电导也遵循这一规律。" },
    { kind: "why", body: "只报室温电导率不够：Eₐ 大的材料降温时掉得更快。所以文献常画 log σ 对 1000/T 的“Arrhenius 图”，斜率就给出 Eₐ。" },
    { kind: "matters", body: `参照：常用液体电解质约 10⁻²${NB}S${NB}cm⁻¹；固态电解质通常希望室温达到 10⁻⁴–10⁻³${NB}S${NB}cm⁻¹ 以上（第 2 章 Table 1）。` },
  ], 0.18));
  s.addNotes("算一算：25 °C 时 kBT ≈ 0.0257 eV。活化能从 0.25 eV 增加到 0.50 eV，室温电导率下降约 exp(0.25/0.0257) ≈ 1.7 万倍。这就是为什么“降低迁移势垒”是固态电解质设计的头号目标。");

  // ---------------- 20. Glass ----------------
  s = d.slide("CONTENT");
  s.addText("玻璃态电解质：没有长程序，也能导离子", { placeholder: "title" });
  fig(s, "glass", { x: 0.5, y: 1.25, w: 6.7, h: 3.7 });
  d.block(s, { x: 0.6, y: 5.2, w: 6.5, kind: "def", tint: true, head: "原文要点", body: "玻璃中的离子先被激发到相邻位置，再集体扩散到宏观尺度；载流子与结构骨架的相互作用不能忽略。" });
  chk("glass col", d.column(s, 7.55, 1.35, 5.2, [
    { kind: "hist", body: "1932 年 Zachariasen 提出玻璃的“无规网络”模型：玻璃和晶体由相同的结构单元（如 SiO₄ 四面体）组成，只是连接方式没有长程序。" },
    { kind: "why", body: "玻璃没有固定的晶格通道，但组成可以连续调节、没有晶界，所以常比同组成的晶体导电更好（如第 2 章的硫化物玻璃）。" },
    { kind: "matters", body: "第 2 章的 Li₂S–P₂S₅ 玻璃、玻璃陶瓷，第 3 章的 LiPON 薄膜，都是非晶或部分非晶材料。" },
  ]));
  s.addNotes("原文说：大多数玻璃在无定形结构中仍保留短程和中程有序。所以玻璃里的离子传输不是完全“随机”的，局部结构（例如 S 还是 O 包围 Li+）对电导影响很大。");

  // ---------------- 21. Polymer ----------------
  s = d.slide("CONTENT");
  s.addText("高分子电解质：Li⁺ 搭着链段运动“换邻居”", { placeholder: "title" });
  fig(s, "polymer_hop", { x: 0.5, y: 1.25, w: 6.7, h: 3.9 });
  d.block(s, { x: 0.6, y: 5.35, w: 6.5, kind: "def", tint: true, head: "玻璃化转变温度 Tg (glass transition temperature)", body: "低于 Tg，链段被“冻住”；高于 Tg，链段可以局部扭动。PEO 的 Tg 约 −60 °C。" });
  chk("poly col", d.column(s, 7.55, 1.35, 5.2, [
    { kind: "hist", body: "1983 年，Berthier、Armand 等用核磁共振证明：PEO–锂盐中的离子主要在无定形区传导，从而把离子电导和链段运动联系起来。" },
    { kind: "why", body: "无机晶体靠“固定通道”，高分子靠“流动的笼子”：Li⁺ 与醚氧配位，随链段运动从一个配位点跳到另一个。" },
    { kind: "matters", body: "原文：自由离子的数量取决于锂盐在聚合物中的解离能力。电导 ≈ 自由离子数 × 链段运动快慢，这是第 3 章各种改性的两个抓手。" },
  ]));
  s.addNotes("在电场作用下，Li+ 一次次连续跳跃，实现长距离传输。链段运动产生的“自由体积”给 Li+ 提供了跳跃空间。温度一低，链段运动变慢，电导率就迅速下降，所以 PEO 电解质常在 60–80 °C 工作（第 3 章）。");

  // ---------------- 22. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：两处容易误读的说法", { placeholder: "title" });
  chk("err1", d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① 第 2 页 Fig. 1：1980s “Polymer Li-ion batteries”", body: "1980 年代的聚合物电池以锂金属为负极，应称“锂聚合物电池”。“锂离子电池”一词在 1991 年 Sony 商业化前后才通行。属用词不严谨。" }));
  chk("err2", d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 第 2 页：无机固态电解质“自 1990 年代起”", body: "原文说的是“用于锂离子电池研究”，不算错。但无机 Li⁺ 固体电解质用于锂电池要早得多：1970 年代起，以 LiI 为电解质的 Li/I₂ 电池就用在心脏起搏器里；1973 年 Liang 报道了 LiI–Al₂O₃ 复合电解质。" }));
  chk("err3", d.block(s, { x: 0.6, y: 4.0, w: 12.15, kind: "def", tint: true, head: "补充：“solid-state ionics” 这个词何时出现？", body: "原文第 1 页说 1960 年代是该词的“起点”，第 2 页又说“1980 年以来”才被广泛使用（同年创办同名期刊 Solid State Ionics）。两处并不矛盾：前者指诞生，后者指普及。" }));
  s.addNotes("校注只针对本章范围（原文第 1–3 页）。第 2、3 章还有几处化学式与引用的笔误，会在各自章节的校注页给出。");

  // ---------------- 23. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["为什么要固态", "液体电解质不稳、无选择性、易燃；固态隔膜更安全，还能“使能”新电池化学"],
    ["两百年简史", "1830s Faraday → 1960s β-氧化铝、Ag⁺ 导体 → 1973 PEO → 1990s LiPON → Fig. 1 五个十年"],
    ["两大家族", "无机陶瓷 / 玻璃（第 2 章）与高分子、复合、薄膜（第 3 章）"],
    ["离子怎么走", "晶体靠缺陷或超离子骨架（三条判据）；玻璃靠局部激发 + 集体扩散；高分子靠链段运动"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“However, great effort will be needed to implement solid-electrolyte batteries as viable energy storage systems.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "然而，要让固态电解质电池成为可行的储能系统，还需要付出巨大的努力。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.05, w: 11.9, h: 0.85, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章进入无机固态电解质：先看评价一个固态电解质要考察哪些性能（Table 1 与 Fig. 2 的雷达图），再逐一认识钙钛矿、NASICON、石榴石和硫化物。");

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
