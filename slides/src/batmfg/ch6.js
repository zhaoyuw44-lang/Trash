// 锂电池制造 — 第 6 章：从扣式到软包：电芯组装、配比与放大
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch6_quotes");

const PAPER = {
  short: "锂电池制造",
  full: "本章原始文献：A. Sommer, J. Wachter, S. Grabmann & R. Daub, Determination of Electrode Balancing in Multilayer Pouch Cells Through Tracking and Tracing in Lithium-Ion Battery Production, Batteries & Supercaps 7, e202400127 (2024)；A. Kwade et al., Current status and challenges for automotive battery production technologies, Nature Energy 3, 290–300 (2018)；J. Xiao et al., From laboratory innovations to materials manufacturing for lithium-based batteries, Nature Energy 8, 329–339 (2023)。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch6_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 6, chapterTitle: "从扣式到软包：电芯组装、配比与放大", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const col = (s, x, y, w, blocks, gap, limit = 6.85, tag = "") => {
    const bot = d.column(s, x, y, w, blocks, gap);
    if (bot > limit) console.warn(`WARN column bottom ${bot.toFixed(2)} > ${limit} ${tag}`);
    return bot;
  };
  const row3 = (s, y, blocks, size = 13, limit = 6.85, tag = "") => {
    blocks.forEach((b, i) => {
      const bot = d.block(s, { x: c3[i], y, w: i === 2 ? 3.85 : 3.95, tint: true, size, ...b });
      if (bot > limit) console.warn(`WARN row3 bottom ${bot.toFixed(2)} > ${limit} ${tag}`);
    });
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 6 章\n从扣式到软包", { placeholder: "title" });
  s.addText("电芯组装、配比与放大", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.45, w: 7.6, h: 1.5, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("这是本系列的最后一章。前五章我们把电极做出来，并在扣式电池里把数据测可信。这一章往前走一步：把电极装成一只 2 Ah 的多层软包，经过化成和老化，再看实验室的成果怎样走到工厂。主线论文是 Sommer 等 2024 年的工作：他们给每一片电极“发身份证”，算出了软包里每一层的 N/P 比。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "组装：从扣式到软包", "叠片与卷绕、极耳焊接、热封、注液浸润"],
    ["2", "化成与老化", "SEI、除气；为什么要几周、为什么贵"],
    ["3", "N/P 配比与追溯", "N/P 与析锂；Sommer 逐片追溯算每层 N/P"],
    ["4", "放大：实验室到工厂", "三级放大、“死亡之谷”、良率与在线检测"],
    ["5", "清单、校注与系列回顾", "实操清单、常见错误、6 章回顾"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.4 + i * 1.08;
    card(s, 0.6, y, 6.3, 0.92);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.18, w: 0.56, h: 0.56, fill: { color: C.text1 }, color: C.background1, fontSize: 19, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.08, w: 5.0, h: 0.42, fontSize: 19, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.5, w: 5.1, h: 0.34, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  card(s, 7.4, 1.4, 5.3, 2.45, "F1ECF8");
  s.addText("上一章回顾", { x: 7.65, y: 1.52, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent3, margin: 0, isTextBox: true });
  s.addText([
    { text: "扣式数据的波动来自载量、对齐、电解液量、压力", options: { bullet: true, breakLine: true } },
    { text: "要报告：载量 mg/cm²、N/P、E/C (g/Ah)", options: { bullet: true, breakLine: true } },
    { text: "过量锂片 + 泛滥电解液会“美化”寿命", options: { bullet: true } },
  ], { x: 7.65, y: 2.0, w: 4.9, h: 1.75, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.05, 5.3, 2.75, "E8F4F3");
  s.addText("本章问题", { x: 7.65, y: 4.17, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText([
    { text: "4 mAh 的扣式怎样变成 2 Ah 的软包？", options: { bullet: true, breakLine: true } },
    { text: "化成和老化为什么要几周、那么贵？", options: { bullet: true, breakLine: true } },
    { text: "多层电芯里，每一层的 N/P 都一样吗？", options: { bullet: true, breakLine: true } },
    { text: "实验室的好材料，为什么常常到不了工厂？", options: { bullet: true } },
  ], { x: 7.65, y: 4.65, w: 4.9, h: 2.05, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("本章分五部分。第 5 章的结论是：扣式电池里过量的锂和泛滥的电解液会让数据好看，要报告 N/P 和 E/C。这一章把这些参数放到真实的多层软包里：N/P 不再是一个数，而是每一层一个数；电解液不再是“几滴”，而要按容量定量。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：组装、化成与配比是怎么来的", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "三条线：化成（橙）来自铅酸电池和 SEI 研究；配比（紫）从镍镉的“负极多配”到逐层算 N/P；电芯结构（青）从卷绕圆柱到扁平软包。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "工厂里的规矩大多是几十年试错的结果。知道它从哪里来，才知道哪些步骤在实验室里不能省。" });
  s.addNotes("时间轴不按比例。1859 年 Planté 的铅酸电池要反复充放电才能“形成”极板，这就是“化成 (formation)”一词的来源。1947 年 Neumann 的密封镍镉电池故意让负极多配，这是“负极容量要多于正极”思路的早期例子。1990 年 Fong、von Sacken 与 Dahn 证明石墨首圈的不可逆容量来自 SEI 成膜。2014 年 Argonne 的 Trask 等专门讨论了从扣式到 400 mAh 软包的变化。");

  // ======== Section 1 ========
  d.section("1 组装与化成");
  s = d.slide("DARK_SECTION");
  s.addText("1  组装与化成：扣式之后的工序", { placeholder: "title" });
  s.addText("从扣式到软包 · 卷绕、叠片与 Z 形叠片 · 极耳与热封 · 注液浸润 · 化成除气 · 老化", { placeholder: "body" });
  s.addNotes("这一节按工厂的顺序走一遍：电极片进入干燥间以后，怎样变成一只能出厂的电芯。每一步都对照 Sommer 的中试线参数和 Kwade 综述里的工业做法。");

  // ---------------- 5. Coin vs pouch ----------------
  s = d.slide("CONTENT");
  s.addText("从扣式到软包：多了什么", { placeholder: "title" });
  d.fig(s, "coin_vs_pouch", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "示意，未按比例。右侧参数据 Sommer 2024：正极 73 × 101 mm、负极 76 × 104 mm，Z 形叠片，额定约 1.95 Ah。扣式面积与容量为典型值。", { x: 0.6, y: 5.85, w: 6.8, h: 0.6 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：软包电芯 Pouch cell", size: 13, body: "用铝塑复合膜热封的电芯，里面是多层双面电极。实验室常做单层或几层；Sommer 的是 11 片电极。" },
    { kind: "hist", size: 13, body: Q.facts.coinPouch },
    { kind: "why", size: 13, body: "扣式只有一对单面电极，锂和电解液都“管够”。软包要双面涂布、多层对齐、按容量配电解液，每个误差都会叠加。" },
    { kind: "matters", size: 13, body: "软包数据才接近真实电池：能量密度、产气、析锂、层间不均，在扣式里都看不到。" },
  ], 0.15, 6.85, "coinpouch");
  s.addNotes("面积放大约 500 倍：扣式正极片约 1.5 cm²（直径 14 mm 左右），Sommer 的软包有 10 个正极涂层面，每面约 73.7 cm²，合计约 740 cm²。容量也从约 4 mAh 放大到约 2 Ah。扣式里我们常用锂片做对电极，锂远远过量；软包是石墨对 NMC622 的全电池，锂只来自正极。");

  // ---------------- 6. Winding / stacking / Z-folding ----------------
  s = d.slide("CONTENT");
  s.addText("卷绕、叠片与 Z 形叠片", { placeholder: "title" });
  d.fig(s, "assembly_methods", { x: 0.6, y: 1.05, w: 12.1, h: 3.55 });
  d.caption(s, "据 Kwade 2018 Fig. 4d–f、Fig. 6e 与 p. 294 文字重绘（示意）。", { x: 0.6, y: 4.62, w: 12.1, h: 0.3 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.winding },
    { kind: "why", body: "卷绕连续、快，但小半径处弯折会让厚电极开裂。叠片受力均匀，可用 >100 μm 的厚电极，但逐片取放慢。Z 形叠片让隔膜连续，减少错位短路。" },
    { kind: "matters", body: "叠片时每片的位置都已知。Sommer 正是靠 Z 形叠片机上的读码器，记下每片电极在第几层。" },
  ], 13, 6.88, "assembly");
  s.addNotes("Kwade 文中三种工艺的比较：卷绕是小型电池的标准做法，也用于电动车方形电池；叠片能做更厚的电极，提高活性物质占比；Z 形叠片把隔膜连续折成“之”字，电极逐片插入，兼顾安全和能量密度。电极层压在隔膜上的变体，每秒可以处理接近一片。实验室手工叠片对应原文 Fig. 4d，最常见的问题是对不齐。");

  // ---------------- 7. Pouch anatomy ----------------
  s = d.slide("CONTENT");
  s.addText("软包结构：极耳焊接与热封", { placeholder: "title" });
  d.fig(s, "pouch_exploded", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "示意。铝塑膜层次为常见结构（典型值）；热封参数据 Sommer 2024 p. 5。", { x: 0.6, y: 5.85, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.pouch },
    { kind: "why", size: 13, body: "扣式靠钢壳和密封圈压紧；软包靠热封：铝箔挡水，内层 PP 熔在一起。极耳要穿过封边，所以要加极耳胶，让金属和 PP 粘牢。" },
    { kind: "matters", size: 13, body: "漏液、进水多出在极耳封边。几十层箔要超声焊成一个极耳，焊不好电阻就大、会发热（Xiao p. 333：R = ρL/A，Q = I²Rt）。" },
  ], 0.18, 6.85, "pouch");
  s.addNotes("Sommer 的焊接参数：超声焊频率 20 kHz；正极振幅 13 μm、能量 90 J，负极振幅 25 μm、能量 450 J；焊缝 68 mm × 3 mm。封装时先封三边，留一边注液。超声焊接靠高频振动把金属表面的氧化膜擦掉，让两层金属在不熔化的情况下结合，所以适合薄的铝箔和铜箔。Xiao 提醒：箔越薄，极耳截面越小，电阻和发热越大。");

  // ---------------- 8. Filling & wetting ----------------
  s = d.slide("CONTENT");
  s.addText("注液与浸润 (wetting)：最容易被低估的一步", { placeholder: "title" });
  d.fig(s, "filling_wetting", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.filling },
    { kind: "why", size: 13, body: "扣式里滴几滴，电解液泛滥。软包要按容量定量（Sommer 5.6 mL，约 2.9 mL/Ah），先抽真空再静置，让液体靠毛细作用钻进孔里。" },
    { kind: "matters", size: 13, body: "没浸润的地方等于没装电极：容量低、功率差，局部还会析锂。" },
  ], 0.14, 5.75, "filling");
  d.quote(s, Q.wetting);
  s.addNotes("工业上注液在露点低于 −60 °C 的干燥环境里进行，在弱真空下注入，然后在控温条件下存放，促进浸润和气体扩散（Kwade p. 294）。Sommer 的做法更接近实验室：电芯先在 60 °C 真空下放 12 h，在氮气手套箱里用移液器手工注液，再在 200 mbar 下封口、静置 2 h 后开始化成。注液量的单位要用 mL/Ah 或 g/Ah，第 5 章讲过的 E/C 比就是这个意思。");

  // ---------------- 9. Formation ----------------
  s = d.slide("CONTENT");
  s.addText("化成 (formation) 与除气 (degassing)", { placeholder: "title" });
  d.fig(s, "formation_profile", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "电压曲线为示意；化成流程据 Sommer 2024 p. 5（3 圈 C/10，2.9–4.2 V，25 °C）。除气为软包常见做法。", { x: 0.6, y: 5.85, w: 6.8, h: 0.45 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：化成 Formation", size: 13, body: "电芯的第一次充放电。目的：在负极表面长出稳定的 SEI 膜，并筛出有问题的电芯。" },
    { kind: "hist", size: 13, body: Q.facts.formation },
    { kind: "why", size: 13, body: "铅酸的化成是“做出”活性物质；锂电的化成是长好 SEI。小电流慢充，膜更薄、更均匀。成膜会产气，所以软包留气袋，化成后除气、再封口。" },
    { kind: "matters", size: 13, body: "首圈消耗的锂回不来，SEI 的好坏决定寿命。Sommer 把第 3 圈放电容量定为额定容量。" },
  ], 0.14, 6.85, "formation");
  s.addNotes("C/10 的意思是 10 小时充满的电流。对 2 Ah 电池，C/10 就是 0.2 A。Sommer 前两圈恒流充电，第 3 圈恒流后再恒压，直到电流降到 C/20。第 4 章讲过扣式电池的化成圈；软包多了一个问题：气体。扣式电池里少量气体影响不大，软包里的气泡会把电极和隔膜隔开，所以要除气。");

  // ---------------- 10. Aging & cost ----------------
  s = d.slide("CONTENT");
  s.addText("老化 (aging)：为什么慢、为什么贵", { placeholder: "title" });
  const costLabels = ["混合", "涂布 + 干燥", "最终干燥", "叠片封装", "装壳", "注液", "化成", "老化", "质检分选", "出厂"];
  s.addChart(d.pres.charts.BAR, [
    { name: "累计材料成本", labels: costLabels, values: [38.0, 46.1, 46.1, 58.8, 68.9, 72.4, 72.4, 72.4, 72.4, 72.4] },
    { name: "累计工序增值", labels: costLabels, values: [0.8, 6.8, 13.5, 18.8, 19.3, 21.4, 24.0, 24.8, 26.1, 27.6] },
  ], {
    x: 0.6, y: 1.25, w: 6.6, h: 4.3, barDir: "bar", barGrouping: "stacked",
    chartColors: [HEX.accent6, HEX.accent1], ...chartText,
    catAxisOrientation: "maxMin", valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20, valGridLine: { color: "E3E8ED", size: 0.75 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt",
    showTitle: true, title: "走到这一步，已花掉总制造成本的百分之几", showValue: false,
  });
  d.caption(s, "据 Kwade 2018 Fig. 5b 读图（近似，选取部分工序）；原数据为 37 Ah 石墨/NMC 车用电芯的成本模型。", { x: 0.6, y: 5.6, w: 6.6, h: 0.45 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.aging },
    { kind: "why", size: 13, body: "老化就是“等”：在设定温度下放置，看电压掉多少（自放电），挑出微短路的电芯。慢充要时间，等也要时间，都占设备和厂房。" },
    { kind: "matters", size: 13, body: "到化成时，电芯已花掉约 94% 的成本。这时报废损失最大，所以前面每道工序都要严控。" },
  ], 0.14, 5.75, "aging");
  d.quote(s, Q.formCost);
  s.addNotes("注意两个数字说的不是一回事：左图是每只电芯的制造成本，化成和老化只增加几个百分点；30% 指的是工厂的设备投资，因为成千上万只电芯要同时占着充放电通道和恒温库房好几周。Kwade 还指出，材料占电芯成本 70% 以上，所以越到后面报废越心疼。");

  // ======== Section 2 ========
  d.section("2 N/P 配比与追溯");
  s = d.slide("DARK_SECTION");
  s.addText("2  N/P 配比与追溯", { placeholder: "title" });
  s.addText("N/P 是什么 · 太低会析锂 · Sommer：给每片电极发“身份证” · 逐层算 N/P · 一片超载拖垮一只电池", { placeholder: "body" });
  s.addNotes("这一节是本章的核心，也是 Sommer 论文的主体。我们先讲 N/P 的定义和它为什么重要，再看他们怎样用追溯系统，把每一片电极的载量对应到电芯里的每一层。");

  // ---------------- 12. N/P definition ----------------
  s = d.slide("CONTENT");
  s.addText("负正极容量比 (N/P ratio) 是什么", { placeholder: "title" });
  d.fig(s, "np_concept", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "左图数值按 Sommer 2024 的目标载量计算：负极 9.79 mg/cm² × 94% × 355 mAh/g；正极 16.76 mg/cm² × 95.5% × 163 mAh/g。", { x: 0.6, y: 5.85, w: 6.8, h: 0.45 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：C = g × P × c，N/P = C负 ÷ C正", size: 13, body: "C：面容量 (mAh/cm²)；g：单面载量 (mg/cm²)；P：活性物质占比；c：比容量 (mAh/g)。N/P 比的是正对着的那两个面。" },
    { kind: "hist", size: 13, body: Q.facts.np },
    { kind: "why", size: 13, body: "半电池里对面是过量锂，不用配比。全电池里锂只来自正极，负极要留出“空房”。以前只看整只电池；Sommer 逐层看。" },
    { kind: "matters", size: 13, body: "N/P 是安全和能量的跷跷板：太低会析锂，太高浪费重量和锂。" },
  ], 0.14, 6.85, "np");
  s.addNotes("举个例子：正极每平方厘米能放出 2.61 mAh 的锂，负极每平方厘米能装 3.27 mAh，N/P ≈ 1.25，负极多出四分之一的“房间”。为什么不配成 1.0 正好？因为载量有波动、边缘有误差、快充时负极表面来不及接收锂，留余量才安全。注意这是用标称比容量算出的设计值，真实可用容量还受首圈损失和截止电压影响。");

  // ---------------- 13. Lithium plating ----------------
  s = d.slide("CONTENT");
  s.addText("N/P 太低或没对齐：析锂 (lithium plating)", { placeholder: "title" });
  d.fig(s, "li_plating", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.plating },
    { kind: "why", size: 13, body: "扣式半电池对面是过量锂片，看不出析锂。全电池里负极一满、或局部没盖住正极，锂只能镀在表面。Kwade (p. 297)：负极必须完全盖住正极。" },
    { kind: "matters", size: 13, body: "析锂消耗可用锂，长出枝晶，严重时刺穿隔膜造成内短路。" },
  ], 0.14, 5.75, "plating");
  d.quote(s, Q.overbal);
  s.addNotes("析锂的三个常见诱因：配比不够、充得太快或太冷、几何没对齐。Sommer 的负极比正极每边大约 1.5 mm，就是为了让对齐误差也落在负极里面。实验室手工叠片最容易出的错，是正极片冲得比负极大，或者叠歪了。拆开电池时，析锂通常表现为负极表面银白色、发亮的斑块。");

  // ---------------- 14. Tracking & tracing ----------------
  s = d.slide("CONTENT");
  s.addText("Sommer：给每片电极发“身份证” (tracking & tracing)", { placeholder: "title" });
  d.fig(s, "traceability_chain", { x: 0.6, y: 1.05, w: 12.1, h: 3.55 });
  d.caption(s, "据 Sommer 2024 Figs. 1、3、4 与 pp. 2–4 文字重绘（示意）。追溯单元：浆料 → 电极 → 电芯。", { x: 0.6, y: 4.62, w: 12.1, h: 0.3 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.trace },
    { kind: "why", body: "以前按“卷”记数据：一卷切出几十片，坏片混在好片里分不出。给每片打码，数据就跟着电极走进电芯。" },
    { kind: "matters", body: "出了问题能倒查到哪一片、哪段涂布；叠片前就能把超差片挑出去（Sommer p. 11）。" },
  ], 13, 6.88, "trace");
  s.addNotes("具体做法：涂布干燥机末端装了一台镱光纤激光器，按电极宽度加 5 mm 的间距打 Data Matrix 码，负极 81 mm、正极 78 mm 一个。因为双面涂布要过两次机器，第二个读码器读背面的码，把第二面的载量也对上。叠片机里再装两个读码器，记下每片电极的顺序和朝向。拆开电池后，这些码依然能读出来。");

  // ---------------- 15. Fig. 6 redraw ----------------
  s = d.slide("CONTENT");
  s.addText("虚拟电芯：逐层算出的 N/P", { placeholder: "title" });
  d.fig(s, "fig6_redraw", { x: 0.6, y: 1.05, w: 12.1, h: 3.55 });
  d.caption(s, "据 Sommer 2024 Fig. 6 重绘：原图竖排（位置 1 在底），此处横排。圆角框中的数字为相邻两面的局部 N/P，数值照录原图。", { x: 0.6, y: 4.62, w: 12.1, h: 0.3 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.fig6 },
    { kind: "why", body: "Ref 1 各层 N/P 在 1.167–1.373 之间，全部 > 1。Man 1 的 C3 载量约 +20%，它两侧的 N/P 降到 1.001 和 0.910。" },
    { kind: "matters", body: "整只电池的平均 N/P 看着正常，局部一层 < 1 就可能析锂。只看平均值会漏掉。" },
  ], 13, 6.88, "fig6");
  s.addNotes("怎么算的：每片电极每一面都有自己的载量，乘以活性物质占比和比容量得到面容量；再按叠片顺序，用负极那一面除以正对着的正极那一面。例如 Ref 1 最上面一对：负极 A6 下表面 3.370 mAh/cm²，正极 C5 上表面 2.716 mAh/cm²，N/P = 1.241。注意参考电芯的 N/P 也有约 ±0.1 的波动，原因之一是中试线用刮刀涂布，作者承认狭缝涂布会更准。");

  // ---------------- 16. Results ----------------
  s = d.slide("CONTENT");
  s.addText("一片超载的正极，拖垮整只电池", { placeholder: "title" });
  const cyc = Array.from({ length: 21 }, (_, i) => String(i * 50));
  const ref = [100, 91, 89, 88, 87.5, 87, 86.5, 86, 85.5, 85, 84.6, 84.2, 83.8, 83.4, 83, 82.6, 82.3, 82, 81.6, 81.3, 81];
  const m1 = [100, 85, 82, 81, 80, 80, 79, 78, 77, 76, 74, 65, 58, 56, 54, 53, 51, 48, 46, 44, 42];
  const m2 = [100, 80, 76, 75, 74, 72, 70, 64, 59, 56, 55, 53, 52, 50, 47, 45, 43, 42, 40, 38, 36];
  const m3 = [100, 76, 72, 69, 66, 58, 55, 52, 51, 49, 47, 45, 43, 41, 38, 36, 35, 33, 32, 30, 28];
  s.addChart(d.pres.charts.LINE, [
    { name: "Ref（3 只平均）", labels: cyc, values: ref },
    { name: "Man 1", labels: cyc, values: m1 },
    { name: "Man 2", labels: cyc, values: m2 },
    { name: "Man 3", labels: cyc, values: m3 },
  ], {
    x: 0.6, y: 1.25, w: 6.6, h: 4.3, chartColors: [HEX.accent2, HEX.accent5, HEX.accent1, HEX.accent4], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 5, ...chartText,
    valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20, valGridLine: { color: "E3E8ED", size: 0.75 }, catGridLine: { style: "none" },
    catAxisLabelFrequency: 4, showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt",
    showCatAxisTitle: true, catAxisTitle: "循环圈数", catAxisTitleFontSize: 12, showValAxisTitle: true, valAxisTitle: "健康度 SOH（%）", valAxisTitleFontSize: 12,
    showTitle: true, title: "每 50 圈 0.1 C 体检时的容量（1 C 循环）",
  });
  d.caption(s, "据 Sommer 2024 Fig. 8a 读图（近似，体检点）。原文：1002 圈后 Ref 约 81%，Man 平均约 35%。", { x: 0.6, y: 5.6, w: 6.6, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.results },
    { kind: "why", size: 13, body: "算出的容量与实测吻合（Ref 1.953 vs 1.955 Ah）。Man 算出多 4%，实测只多 2.6%：超载正极多出的锂，对面负极“接不住”。" },
    { kind: "matters", size: 13, body: "前 50 圈 Ref 降到约 90%，Man 已降到约 80%，衰减快近一倍。" },
  ], 0.14, 5.75, "results");
  d.quote(s, Q.single);
  s.addNotes("为什么 Man 电芯算出来多 4%？5 片正极里有 1 片多了 20% 的载量，平均下来整只电池多 4%。但实测只多 2.6%，说明 C3 那一层多出的容量用不上，因为对面负极 N/P 已经小于 1。Man 3 衰减最快，200 圈左右就开始骤降；Man 1 撑到约 500 圈。三只之间差别很大，这本身也说明局部缺陷让电池变得不可预测。");

  // ---------------- 17. Mechanism ----------------
  s = d.slide("CONTENT");
  s.addText("为什么会这样：层与层是“并联”的", { placeholder: "title" });
  d.fig(s, "parallel_layers", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "示意，据 Sommer 2024 p. 9 文字绘制。", { x: 0.6, y: 5.85, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.mechanism },
    { kind: "why", size: 13, body: "各层通过极耳并联。超载那层的 SOC 和电阻与别层不同，电流分配不均，局部倍率高于标称的 1 C。" },
    { kind: "matters", size: 13, body: "拆解：Man 的所有负极都有银白色析锂，隔膜粘在负极上；Ref 只有少量痕迹。一层的问题会传给整只电池。" },
    { kind: "note", head: "注意：这是推断", size: 13, body: "每组只有 3 只电池，层间电流没有直接测。作者也说机理“需要更深入的研究”（p. 9）。" },
  ], 0.14, 6.85, "mechanism");
  s.addNotes("这和电池模组里电芯并联是同一个道理：内阻小的支路分到更多电流。第一次骤降发生在前 50 圈，对应 C3 对面的负极先析锂、先老化；这一对电阻变大以后，电流转到其他层，其他层也被“加班”，于是出现第二次骤降。SEM 照片里，Man 电芯负极表面覆盖着苔藓状的锂。拆解用的手套箱里水和氧都低于 0.1 ppm。");

  // ======== Section 3 ========
  d.section("3 放大");
  s = d.slide("DARK_SECTION");
  s.addText("3  放大：从实验室到工厂", { placeholder: "title" });
  s.addText("实验室、中试、量产 · “死亡之谷” · 1 g 和 1 kg 不是一回事 · 良率与在线检测", { placeholder: "body" });
  s.addNotes("最后一节回到全系列的主题：实验室里的发现，怎样才能变成工厂里的产品？Kwade 给出三级放大的框架，Xiao 讲材料放大时会冒出哪些新问题。");

  // ---------------- 19. Three scales ----------------
  s = d.slide("CONTENT");
  s.addText("三级放大：实验室、中试、量产", { placeholder: "title" });
  d.fig(s, "three_scales", { x: 0.6, y: 1.05, w: 12.1, h: 3.55 });
  d.caption(s, "据 Kwade 2018 Fig. 4 重绘（示意）。", { x: 0.6, y: 4.62, w: 12.1, h: 0.3 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.scales },
    { kind: "why", body: "实验室材料少、要筛的参数多，只能用扣式和单层电池；它既预测不了工艺参数，也预测不了全尺寸电芯的性能（Kwade p. 297）。" },
    { kind: "matters", body: "中试线是桥：多层、双面、接近真实尺寸。Sommer 的研究就在中试线上完成，这类问题扣式里根本测不出。" },
  ], 13, 6.88, "scales");
  s.addNotes("Kwade 说：从中试到量产也有坑。比如分散机变大以后，浆料受到的剪切条件变了，要重新调参数才能得到同样的电极结构；工业辊压机速度快得多，涂层的弹塑性行为也不一样。三级各有各的目标：实验室选材料和配方，中试定工艺和电芯设计，量产求产量、良率和稳健。");

  // ---------------- 20. Xiao scale-up ----------------
  s = d.slide("CONTENT");
  s.addText("1 g 和 1 kg 不是一回事", { placeholder: "title" });
  d.fig(s, "xiao_cycles", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.xiao },
    { kind: "why", size: 13, body: "放大不是等比例放大：混料均匀性、炉温分布、杂质、湿度都变了。实验室稀浆料、低载量 (1–10 mg/cm²) 的电极，暴露不出真问题。" },
    { kind: "matters", size: 13, body: "Kwade：25 道工序各 99.5% 良率，总良率只有 88.2%。所以要在线检测、及早剔除。" },
  ], 0.14, 5.75, "xiao");
  d.caption(s, "左图据 Xiao 2023 Fig. 1 重绘（示意）。", { x: 0.6, y: 5.75, w: 6.8, h: 0.3 });
  d.quote(s, Q.insurmountable);
  s.addNotes("Xiao 举的例子：NMC811 表面残锂会让 PVDF 浆料凝胶，小批量刮刀涂布时问题不明显，大规模涂布时就卡住了。良率的算法很简单：0.995 的 25 次方约等于 0.882。线速度超过 60 m/min 时，1 毫米电极只在传感器下停留不到 1 毫秒，所以在线检测本身就是放大的瓶颈之一。");

  // ======== Section 4 ========
  d.section("4 清单、校注与回顾");
  // ---------------- 21. Checklist ----------------
  s = d.slide("CONTENT");
  s.addText("实操清单 / 常见错误：第一次做软包", { placeholder: "title" });
  card(s, 0.6, 1.3, 6.15, 5.5, "E8F4F3");
  s.addText("实操清单（按顺序）", { x: 0.85, y: 1.42, w: 5.7, h: 0.42, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  const todo = [
    "先算 N/P（石墨常用 1.1–1.2，典型值）；负极每边比正极大 1–2 mm",
    "每片电极称重、编号，记下载量和在叠片中的位置",
    "切片后查毛刺、掉粉；电极和隔膜真空干燥后再进干燥间或手套箱",
    "叠片对齐，隔膜盖过负极；叠完用胶带固定",
    "极耳超声焊后测电阻；极耳胶要落在封边里",
    "先封三边；按容量定量注液，抽真空、静置浸润",
    "化成用小电流（C/10–C/20）并加压；化成后除气、再封口",
    "记录一切：批次、载量、注液量、封装和化成参数",
  ];
  s.addText(todo.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < todo.length - 1 } })),
    { x: 0.85, y: 1.92, w: 5.75, h: 4.8, fontSize: 14, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 7, isTextBox: true });
  card(s, 6.95, 1.3, 5.75, 5.5, "FBEDEC");
  s.addText("常见错误 → 后果", { x: 7.2, y: 1.42, w: 5.3, h: 0.42, fontSize: 18, bold: true, color: C.accent4, margin: 0, isTextBox: true });
  const errs = [
    ["电解液照搬扣式的“几滴”", "浸润不足或泛滥，数据失真"],
    ["正极比负极大，或叠歪", "边缘析锂、短路"],
    ["只看平均 N/P，不看单片载量", "局部 N/P < 1，加速衰减"],
    ["化成不加压、不除气", "气泡隔开电极，容量低"],
    ["极耳胶没落在封边里", "漏液、进水"],
    ["电极没干透就组装", "产气、容量衰减"],
  ];
  errs.forEach(([e, r], i) => {
    const y = 1.95 + i * 0.78;
    s.addText("✕", { x: 7.2, y, w: 0.35, h: 0.36, fontSize: 16, bold: true, color: C.accent4, margin: 0, valign: "middle", isTextBox: true });
    s.addText(e, { x: 7.55, y, w: 5.0, h: 0.36, fontSize: 15, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(`→ ${r}`, { x: 7.55, y: y + 0.34, w: 5.0, h: 0.34, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addNotes("这页可以打印出来贴在手套箱旁边。数值都是典型值：负极比正极大多少、化成电流多大，要看你的体系和设备。最重要的一条是最后一条：记录一切。Sommer 的论文说明，只要数据能对应到每一片电极，事后就能找出问题出在哪里。");

  // ---------------- 22. Reading notes ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文笔误与常见误区", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const c = i % 2, r = Math.floor(i / 2);
    const bot = d.block(s, { x: c ? 6.8 : 0.6, y: 1.3 + r * 1.85, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
    if (bot > 6.88) console.warn(`WARN note ${i} bottom ${bot.toFixed(2)}`);
  });
  s.addNotes("前四条是 Sommer 论文里的笔误或前后不一致，都不影响主要结论，但读的时候要心里有数，尤其是 overbalancing 这个词，同一篇文章里用在了两个相反的情况。第五条是 Kwade 的用词。最后一条是实验室里常见的想法：N/P 配得越大越保险。其实负极多出来的部分也要长 SEI、消耗锂，而且白白增加重量。");

  // ---------------- 23. Series recap ----------------
  s = d.slide("CONTENT");
  s.addText("系列回顾：六章连成一条线", { placeholder: "title" });
  d.fig(s, "series_recap", { x: 0.6, y: 1.1, w: 12.1, h: 2.45 });
  const recap = [
    ["第 1 章 总览", "电极 → 电芯 → 化成；材料占成本七成以上，工序越长良率越难。"],
    ["第 2 章 浆料与涂布", "配方、分散、流变决定涂层；实验室刮刀，工厂狭缝。"],
    ["第 3 章 干燥与辊压", "干太快粘结剂会上浮；辊压调孔隙；干法电极省溶剂。"],
    ["第 4 章 扣式电池", "CR2032 零件、手套箱、半电池与全电池各有用途。"],
    ["第 5 章 可信数据", "多做几只，报告载量、N/P、E/C；别被过量锂骗了。"],
    ["第 6 章 软包与放大", "叠片、注液、化成；N/P 逐层看；放大要过中试这座桥。"],
  ];
  recap.forEach(([h, t], i) => {
    const x = c3[i % 3], y = 3.75 + Math.floor(i / 3) * 1.55, w = i % 3 === 2 ? 3.85 : 3.95;
    card(s, x, y, w, 1.4, i === 5 ? "FDF2E7" : "F5F7F9");
    s.addText(h, { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.4, fontSize: 16, bold: true, color: i === 5 ? C.accent1 : C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(t, { x: x + 0.2, y: y + 0.52, w: w - 0.4, h: 0.8, fontSize: 14, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  });
  s.addNotes("回头看整个系列：第 1 章给出全景，第 2、3 章把粉末变成电极，第 4、5 章在扣式电池里把电极测准，第 6 章把电极装成真正的电池，并讨论怎样走向工厂。作为在实验室做电池的研究生，最实用的一条是：从第一天起就按“以后要放大”的标准记录数据。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["软包不是放大的扣式", "多层双面、对齐、按容量注液、浸润、热封；每个误差都会叠加"],
    ["化成与老化慢，是为了长好 SEI、筛掉坏电芯", "化成约 1 天、老化 2–3 周，最多占投资 30%；化成后报废最贵（Kwade）"],
    ["N/P 要逐层看", "一片 +20% 载量的正极，让局部 N/P 降到 0.91；1002 圈后 35% vs 81%（Sommer）"],
    ["放大要过中试这座桥", "实验室筛材料，中试定工艺，量产求稳健；追溯和在线检测越早越好（Kwade、Xiao）"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.realistic.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.realistic.zh}  —— ${Q.realistic.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.85, w: 11.9, h: 1.1, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("一句话带走：真实电池的问题，往往藏在扣式电池看不到的地方——层与层之间、边缘、气体、时间。Xiao 的建议是，在与工业相关的尺度和真实条件下做研究。对我们来说，就是尽早做多层软包，尽早用全电池和真实的 N/P、E/C，并把每一片电极的数据记下来。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
