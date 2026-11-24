// 锂电池发展史 — 第 1 章：起源——电池、锂与非水电解液（1780–1958）
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch1_quotes");

const PAPER = {
  short: "锂电池发展史",
  full: "本章原始文献：G. N. Lewis & F. G. Keyes, The Potential of the Lithium Electrode, J. Am. Chem. Soc. 35, 340–344 (1913)；W. S. Harris, Electrochemical Studies in Cyclic Esters, PhD Thesis, UC Berkeley, UCRL-8381 (1958)。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch1_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 1, chapterTitle: "起源：电池、锂与非水电解液", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 1 章\n为什么是锂？", { placeholder: "title" });
  s.addText("起源：电池、锂与非水电解液（1780–1958）", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.75, w: 7.6, h: 1.2, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("这一章回答一个问题：为什么今天的高能量电池几乎都用锂？要回答它，需要三块拼图：电池是怎么来的（1800 年），锂为什么特别（1817 年发现，1913 年测出电位），以及为什么锂电池不能用水、必须换成有机溶剂（1958 年 Harris 的论文）。");

  // ---------------- 2. Roadmap + reading key ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "电池是怎么来的", "伏打电堆、电池的结构、一次与二次电池"],
    ["2", "为什么是锂", "能量公式、锂的发现、电位阶梯、Lewis 1913"],
    ["3", "水不行，换溶剂", "水的稳定窗口、非水电解液、Harris 1958"],
    ["4", "校注与小结", "常见说法的更正，本章要点"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("每个概念页的阅读标签", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  const keys = [
    ["hist", "历史 History", "哪一年、谁、做了什么"],
    ["why", "以前 → 为什么", "之前怎么做，为什么改成这样"],
    ["matters", "为什么重要", "这个概念后来派上了什么用场"],
    ["quote", "原文金句", "原始论文的英文原句 + 中文翻译"],
  ];
  keys.forEach(([k, h, b], i) => {
    const y = 2.1 + i * 1.12;
    d.chip(s, 7.5, y + 0.05, k, 0.62);
    s.addText(h, { x: 8.35, y, w: 4.4, h: 0.4, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 8.35, y: y + 0.4, w: 4.4, h: 0.38, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.caption(s, "说明：这套幻灯片没有单一“原书”，“引”取自每章的原始论文，英文与 PDF 原文逐字一致。", { x: 7.5, y: 6.55, w: 5.25, h: 0.4 });
  s.addNotes("四个标签贯穿全系列：史（年份、人物、贡献）、变（以前怎么做 → 为什么改）、要（为什么重要）、引（原始论文金句）。另有“义”（定义）和“注”（校注）两种辅助标签。");

  // ---------------- 3. Series map ----------------
  s = d.slide("CONTENT");
  s.addText("全系列：按时间顺序读原始论文", { placeholder: "title" });
  d.fig(s, "series_map", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "教科书按“正极、负极、电解质”分类讲，容易忘了每个想法当年为什么出现。按时间读原始论文，能看到每一步要解决什么问题。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "读每篇论文时，尽量站在它发表那一年的知识背景下想：作者当时知道什么、不知道什么。" });
  s.addNotes("全系列 6 章。第 1 章是“前史”：没有一篇论文是在做锂电池，但电池原理、锂的电位、非水溶剂三块拼图都在这一时期准备好了。第 2 章起进入真正的锂电池研究。");

  // ---------------- 4. Era timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：锂电池之前的 170 年", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "三条线并行发展：做电池的人（橙）、研究锂和电位的人（紫）、找新溶剂的人（青）。直到 1958 年，三条线才第一次交汇。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "锂电池不是某一个人的发明，而是这三条线在 1960–70 年代合流的结果（第 2 章）。" });
  s.addNotes("时间轴不按比例。注意 Lewis & Keyes 1913 年测锂电位，纯粹是为了补全碱金属的电位表，和电池无关；Harris 1958 年研究碳酸丙烯酯，目的是找新的电镀溶剂，也不是为了电池。");

  // ======== Section 1 ========
  d.section("1 电池是怎么来的");
  s = d.slide("DARK_SECTION");
  s.addText("1  电池是怎么来的", { placeholder: "title" });
  s.addText("Galvani 的蛙腿 · 伏打电堆 · Daniell 电池 · 铅酸电池 · 能量 = 电压 × 电量", { placeholder: "body" });

  // ---------------- 6. Volta pile ----------------
  s = d.slide("CONTENT");
  s.addText("伏打电堆：第一个能持续供电的装置", { placeholder: "title" });
  d.fig(s, "volta_pile", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.volta },
    { kind: "why", body: "Galvani 以为电来自青蛙的肌肉。Volta 认为电来自两种不同的金属，于是去掉青蛙，只用金属和盐水，照样产生电流，证明了自己的看法。" },
    { kind: "matters", body: "以前的电只能靠摩擦起电、莱顿瓶，放一下就没了。电堆第一次给出持续电流，几周后就被用来电解水。" },
  ]);
  s.addNotes("当时还没有“电池”和“电压”这些概念。Volta 用舌头、眼睛去感觉电堆的“强度”，层数越多，刺激越强。原文是用法语写给 Banks 的信，1800 年发表在 Philosophical Transactions 上。");

  // ---------------- 7. Cell anatomy ----------------
  s = d.slide("CONTENT");
  s.addText("电池的结构：电子走外面，离子走里面", { placeholder: "title" });
  d.fig(s, "cell_anatomy", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.daniell },
    { kind: "why", body: "伏打电堆的铜表面会冒氢气泡，挡住反应，电压很快下降。Daniell 把锌、铜各泡在自己的溶液里，铜上沉积的是铜而不是氢气，电压就稳了。" },
    { kind: "matters", body: "所有电池都是这个结构：负极、正极、电解质、隔膜。锂离子电池只是把锌、铜换成了石墨和 LiCoO₂。" },
  ]);
  s.addNotes("关键概念：电池把一个氧化还原反应拆成两半，分别在两个电极上进行。电子只能走外电路（做功），离子只能走电解质。电解质必须导离子、不导电子，否则电池会自放电（内部短路）。");

  // ---------------- 8. Lead-acid ----------------
  s = d.slide("CONTENT");
  s.addText("铅酸电池：第一个能充电的电池", { placeholder: "title" });
  d.fig(s, "lead_acid", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.plante },
    { kind: "why", body: "一次电池用完就扔，反应物不能复原。Planté 选的铅–硫酸体系，放电产物 PbSO₄ 留在电极上，通电就能变回 Pb 和 PbO₂。" },
    { kind: "matters", body: "“可逆”成了二次电池的第一要求。150 多年后，铅酸电池仍在汽车里使用，但它太重：能量密度只有锂离子电池的几分之一。" },
  ]);
  s.addNotes("铅酸电池单体约 2.0 V。它的问题是铅太重（摩尔质量 207），每克能放出的电子很少。这正是下一页“能量公式”要讲的：想要轻的电池，就要找轻的电极材料。");

  // ---------------- 9. Energy formula ----------------
  s = d.slide("CONTENT");
  s.addText("电池能存多少能量？只看两件事", { placeholder: "title" });
  d.fig(s, "energy_formula", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：比容量 Specific capacity", body: "每克电极材料能放出多少电量，单位 mAh/g。乘上电压就是比能量 (Wh/kg)。" },
    { kind: "hist", body: Q.facts.faraday },
    { kind: "why", body: "以前比较电池只看“能用多久”。有了 Faraday 定律，就能从化学式直接算出理论容量，不用做出电池就知道上限。" },
    { kind: "matters", body: "公式告诉我们：电极要轻（M 小），电位差要大（V 大）。锂两条都占了第一。" },
  ], 0.18);
  s.addNotes("算一算铅：Pb → Pb²⁺，n = 2，M = 207.2，Q = 2 × 96485 ÷ 207.2 ÷ 3.6 ≈ 259 mAh/g。锂约 3860 mAh/g，是铅的 15 倍。注意这只是负极金属本身的理论值，真实电池还要算上正极、电解质和外壳。");

  // ======== Section 2 ========
  d.section("2 为什么是锂");
  s = d.slide("DARK_SECTION");
  s.addText("2  为什么是锂", { placeholder: "title" });
  s.addText("最轻的金属 · 最负的电位 · Lewis & Keyes 1913 年怎么测出来的", { placeholder: "body" });

  // ---------------- 11. Discovery ----------------
  s = d.slide("CONTENT");
  s.addText("锂的发现：一种藏在石头里的金属", { placeholder: "title" });
  d.fig(s, "li_discovery", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.arfwedson },
    { kind: "why", size: 13, body: "Arfwedson 发现矿石成分加起来总差 4% 左右，补不齐，才意识到里面有新元素。Davy 1807 年用电解得到了钾、钠，锂也只能靠电解才拿得到。" },
    { kind: "matters", size: 13, body: "锂太活泼，自然界里没有单质锂。从发现元素到能大量制备金属锂，用了将近 40 年。" },
  ], 0.18);
  s.addNotes("Berzelius 起的名字是 lithion / lithina，来自希腊语 lithos（石头），因为钠、钾最早是从植物灰（草木灰、苏打）里得到的，而锂是在矿石里发现的。透锂长石是 1800 年左右在瑞典 Utö 岛发现的矿物。");

  // ---------------- 12. Two superlatives (chart) ----------------
  s = d.slide("CONTENT");
  s.addText("锂的两个“第一”：最轻、电位最负", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "理论比容量", labels: ["铅 Pb", "锌 Zn", "钠 Na", "锂 Li"], values: [259, 820, 1166, 3861] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.5, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent6, HEX.accent1, HEX.accent3],
    showValue: true, dataLabelFormatCode: "#,##0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 4600, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "金属负极的理论比容量（mAh/g）", showLegend: false,
  });
  d.caption(s, "按 Q = nF/M 计算：Pb、Zn 每个原子放 2 个电子，Na、Li 放 1 个。", { x: 0.6, y: 5.9, w: 6.6, h: 0.4 });
  d.stat(s, { x: 7.75, y: 1.3, w: 2.4, value: "0.534", unit: "g/cm³", label: "密度，最轻的金属", color: "accent3" });
  d.stat(s, { x: 10.3, y: 1.3, w: 2.5, value: "−3.04", unit: "V", label: "相对 SHE，最负", color: "accent3" });
  d.column(s, 7.75, 3.0, 5.0, [
    { kind: "why", body: "钠更便宜，但重 3 倍、电位高约 0.3 V。锂“又轻又负”，同样重量能存最多的能量。" },
    { kind: "matters", body: "这两个数字决定了：只要锂能做成可充电的电极，它就是能量密度的“天花板”。整部锂电池史，都是在想办法驯服这块天花板。" },
  ]);
  s.addNotes("比容量计算：Li 96485 ÷ 6.94 ÷ 3.6 ≈ 3861；Na 96485 ÷ 22.99 ÷ 3.6 ≈ 1166；Zn 2 × 96485 ÷ 65.38 ÷ 3.6 ≈ 820；Pb ≈ 259 mAh/g。电位为标准电极电位（25 °C）。");

  // ---------------- 13. Potential ladder ----------------
  s = d.slide("CONTENT");
  s.addText("电极电位：给所有电极排一个“阶梯”", { placeholder: "title" });
  d.fig(s, "potential_ladder", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：标准电极电位", body: "某电极相对标准氢电极 (SHE) 的电压。越负，越容易失去电子（越适合做负极）。" },
    { kind: "hist", size: 13, body: Q.facts.nernst },
    { kind: "why", size: 13, body: "单个电极的电位测不出来，只能测两个电极之间的电压。就像量山高要定一个“海平面”：大家统一用 SHE 当零点，结果才能互相比较。" },
    { kind: "matters", size: 13, body: "有了这张表，不用做电池就能估算电压：两个台阶的高度差。" },
  ], 0.16);
  s.addNotes("例：Daniell 电池 = 0.34 − (−0.76) = 1.10 V，和实测一致。锂对铜理论上有 3.38 V。实际中常用的参比电极是甘汞电极 (calomel)，它相对 SHE 约 +0.28 V（1 M KCl），Lewis 1913 年就是用它作参比。");

  // ---------------- 14. Lewis method ----------------
  s = d.slide("CONTENT");
  s.addText("Lewis & Keyes 1913：锂碰不得水，怎么测它的电位？", { placeholder: "title" });
  d.fig(s, "lewis_detour", { x: 0.5, y: 1.25, w: 6.9, h: 4.38 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.lewis },
    { kind: "why", size: 13, body: "直接把锂放进水里会剧烈反应，测不准。他们“绕道”：先在无水的丙胺里测锂对锂汞齐，再在水里测汞齐对甘汞电极，两段相加。" },
    { kind: "matters", size: 13, body: "这是第一次准确测出锂的电位，也是第一次用非水溶剂做锂的电化学实验。" },
  ], 0.16);
  d.quote(s, Q.lewisMethod);
  s.addNotes("汞齐 (amalgam) 是金属溶在汞里形成的合金。稀汞齐里的锂“活性”被大大降低，和水反应很慢，所以第 2 步能在水溶液里做。第 1 步不能用水，作者选了丙胺 (propyl amine)：LiI 能溶，锂又不会被很快腐蚀。原文提到锂溶在纯丙胺里会变蓝（溶剂化电子，Kraus 1908），加了 LiI 后蓝色消失。");

  // ---------------- 15. Lewis result ----------------
  s = d.slide("CONTENT");
  s.addText("结果：锂的电位比钠、钾都高", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "电极电位", labels: ["钠 Na", "钾 K", "锂 Li"], values: [2.9981, 3.2084, 3.3044] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "col",
    chartColors: [HEX.accent1, HEX.accent4, HEX.accent3],
    showValue: true, dataLabelFormatCode: "0.0000", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMinVal: 2.8, valAxisMaxVal: 3.4, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "相对当量甘汞电极的电位（V，1913 年原文数据）", showLegend: false,
  });
  d.caption(s, "数据：Lewis & Keyes 1913, p. 343 表格。纵轴从 2.8 V 开始，以突出差别。", { x: 0.6, y: 5.7, w: 6.6, h: 0.4 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "why", body: "当时大家按“周期表往上，活泼性变弱”推测锂的电位比钠还小。实验结果正好相反：锂最高。" },
    { kind: "matters", body: "换算到今天的标度约 −3.02 V，与公认值 −3.04 V 只差 0.02 V。100 多年前的测量，今天仍然站得住。" },
  ]);
  d.quote(s, Q.lewisHighest);
  s.addNotes("为什么锂反而最“负”？锂离子半径最小，被水分子包围得最紧（水合能最大），这部分能量补偿了锂原子较难失去电子的劣势。原文的解释是：锂离子的生成热比钾离子高约 1000 卡，比钠离子更高。注意原文数值的正负号约定与今天相反（见校注页）。");

  // ======== Section 3 ========
  d.section("3 水不行，换溶剂");
  s = d.slide("DARK_SECTION");
  s.addText("3  水不行，换溶剂", { placeholder: "title" });
  s.addText("水的稳定窗口 · 非水电解液的早期探索 · Harris 1958：碳酸丙烯酯", { placeholder: "body" });

  // ---------------- 17. Water window ----------------
  s = d.slide("CONTENT");
  s.addText("水的稳定窗口只有 1.23 V", { placeholder: "title" });
  d.fig(s, "water_window", { x: 0.6, y: 1.15, w: 12.1, h: 2.45 });
  d.block(s, { x: c3[0], y: 3.75, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.water });
  d.block(s, { x: c3[1], y: 3.75, w: 3.95, kind: "why", tint: true, size: 13, body: "锂要到 −3.04 V 才能析出，水在 0 V 附近就开始分解成氢气。所以锂电极必须配不含水的电解液。" });
  d.block(s, { x: c3[2], y: 3.75, w: 3.85, kind: "matters", tint: true, size: 13, body: "电化学窗口 (electrochemical window) 决定了电池电压上限。水系电池一般只有 1–2 V，锂电池能到 3–4 V。" });
  s.addNotes("锌的电位是 −0.76 V，也比 0 V 低，为什么能从水里镀出来？因为氢气在锌表面析出很慢（析氢过电位高），这是动力学上的“延迟”。锂差了 3 V，任何过电位都挡不住。1.23 V 是热力学值，实际电池中靠动力学可以略超出。");
  d.quote(s, { ...Q.harrisWater, bottom: 6.85 });

  // ---------------- 18. Nonaqueous history ----------------
  s = d.slide("CONTENT");
  s.addText("非水电解液：Harris 之前人们试过什么", { placeholder: "title" });
  d.fig(s, "nonaq_history", { x: 0.6, y: 1.1, w: 12.1, h: 3.0 });
  d.block(s, { x: 0.6, y: 4.2, w: 5.9, kind: "hist", tint: true, size: 13, body: Q.facts.nonaq });
  d.block(s, { x: 6.8, y: 4.2, w: 5.9, kind: "why", tint: true, size: 13, body: "早期研究的目的大多是“电镀出水里镀不出的金属”（碱金属、铝、钛）。失败的主要原因是溶剂里的微量水和杂质。" });
  d.quote(s, Q.harrisFailed);
  s.addNotes("这一页的事实大多来自 Harris 论文第 9–11 页的文献综述。可见到 1950 年代，“非水电化学”已经研究了半个多世纪，但多数工作零散、不系统。Harris 的论文价值之一，就是第一次系统地刻画了一类新溶剂。");

  // ---------------- 19. Solvent requirements ----------------
  s = d.slide("CONTENT");
  s.addText("好的锂电解液溶剂要满足什么？", { placeholder: "title" });
  d.fig(s, "solvent_req", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：介电常数 ε", body: "溶剂削弱正负离子之间吸引力的能力。ε 越大，盐越容易拆成自由离子。水约 78，真空为 1。" },
    { kind: "why", size: 13, body: "水能溶盐但会和锂反应；乙醚不和锂反应但溶不了盐。Harris 选的环状碳酸酯两样都行：极性大、又没有活泼氢。" },
    { kind: "matters", size: 13, body: "这四条至今仍是筛选电解液溶剂的基本标准，后来又加上了“能在电极表面形成保护膜”（第 3 章 SEI）。" },
  ], 0.18);
  d.quote(s, Q.harrisDielectric);
  s.addNotes("“活泼氢”指 O–H、N–H 这类容易被还原成氢气的氢，水、醇、氨都有。没有活泼氢的极性溶剂叫非质子溶剂 (aprotic solvent)。19 世纪末 Thomson 与 Nernst 提出“介电常数越大，盐越易解离”的经验规则；Harris 发现溶解度并不随介电常数平滑变化，说明还要考虑溶剂分子大小、偶极分布等因素。");

  // ---------------- 20. Cyclic esters ----------------
  s = d.slide("CONTENT");
  s.addText("Harris 1958：四种环状酯", { placeholder: "title" });
  d.fig(s, "cyclic_esters", { x: 0.5, y: 1.15, w: 12.3, h: 3.95 });
  d.caption(s, "结构据 Harris 1958 Fig. 1 重绘；ε 与熔点取自原文 Table I（EC 的 ε 在 40 °C 测得）。", { x: 0.6, y: 5.1, w: 12.1, h: 0.3 });
  d.block(s, { x: c3[0], y: 5.45, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.harris });
  d.block(s, { x: c3[1], y: 5.45, w: 3.95, kind: "why", tint: true, size: 13, body: "Harris 的理由：沸点高（不挥发）、介电常数高、毒性低、化学稳定。五元环让 C=O 的偶极“朝外”，所以极性特别大。" });
  d.block(s, { x: c3[2], y: 5.45, w: 3.85, kind: "matters", tint: true, size: 13, body: "PC 成为 1970 年代锂一次电池的主力溶剂；EC 后来成为锂离子电池电解液的核心成分（第 5 章）。" });
  s.addNotes("EC 和 PC 只差一个甲基，性质却差很多：EC 室温是固体（熔点 36 °C），PC 室温是液体（熔点 −49 °C）。所以 1950–80 年代大家先用 PC；1990 年代发现 EC 能在石墨表面形成稳定的保护膜，再把 EC 和低黏度的链状碳酸酯混合使用。");

  // ---------------- 21. Harris experiment ----------------
  s = d.slide("CONTENT");
  s.addText("从碳酸丙烯酯中电解出金属锂", { placeholder: "title" });
  d.fig(s, "harris_hcell", { x: 0.5, y: 1.25, w: 6.9, h: 4.38 });
  d.caption(s, "据 Harris 1958 Fig. 6 与第 23 页实验描述重绘（示意，未按比例）。", { x: 0.6, y: 5.68, w: 6.8, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "why", size: 13, body: "Harris 把电解当作“检验新溶剂最简单的办法”：能镀出哪些金属，就说明溶剂在多负的电位下还不分解。PC 能镀出锂，说明它在 −3 V 附近仍然够稳。" },
    { kind: "matters", size: 13, body: "这是锂在碳酸酯中可以电沉积的较早明确记录。电池充电时负极发生的正是这个反应：Li⁺ + e⁻ → Li。" },
    { kind: "note", head: "注意", size: 13, body: "Harris 没有研究循环、效率或钝化膜，只是一次定性实验。" },
  ], 0.16);
  d.quote(s, Q.harrisLithium);
  s.addNotes("实验细节（原文 p. 23）：H 形电解池，两室用烧结玻璃隔开，各有磁力搅拌，总体积约 30 mL；电极是 0.06 mm 厚、3 cm² 的铂片；所有操作在充氩气的手套箱中完成。原文还提到，锂沉积使 0.06 mm 厚的铂片向沉积一侧弯曲，说明沉积量不小。为什么 Harris 的实验能成功、更早的很多实验失败？关键之一是严格除水：他们专门比较了未纯化 PC（含约 0.2% 水）和纯化 PC 的差别。");

  // ======== Section 4 ========
  d.section("4 校注与小结");
  s = d.slide("CONTENT");
  s.addText("阅读校注：常见说法与原文的出入", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    d.block(s, { x: col ? 6.8 : 0.6, y: 1.45 + row * 2.3, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
  });
  s.addNotes("第一、二条是对本系列开头那份时间线的更正。第三条提醒：读老论文时要注意当时的参比电极和正负号约定，1953 年之前，美国文献常把“氧化电位”记为正值。第四条说明老论文的物性数据可能因样品纯度而有偏差。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["电池 = 两个电极 + 电解质", "电子走外电路，离子走电解质；能反复充电要求反应可逆（Volta 1800 → Planté 1859）"],
    ["能量 = 电压 × 电量", "电极要轻、电位要负：锂 3860 mAh/g、−3.04 V，两项都是第一"],
    ["锂的电位是“绕道”测出来的", "Lewis & Keyes 1913 用丙胺和锂汞齐避开了水"],
    ["锂碰不得水，必须用非水电解液", "Harris 1958：环状碳酸酯 PC 中电解出锂。下一章：锂电池真正诞生"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.harrisUnfortunate.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.harrisUnfortunate.zh}  —— ${Q.harrisUnfortunate.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("Harris 这句话写于 1958 年。十几年后，非水电解液成了锂电池的核心，今天全世界每年生产的锂离子电池，电解液几乎都是碳酸酯类溶剂。下一章：1970 年代，Whittingham 的嵌入化学与第一批锂金属电池。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
