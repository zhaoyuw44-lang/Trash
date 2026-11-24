// 锂电池发展史 — 第 3 章：1973–1983 聚合物电解质与 SEI
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch3_quotes");

const PAPER = {
  short: "锂电池发展史",
  full: "本章原始文献：D. E. Fenton, J. M. Parker & P. V. Wright, Complexes of alkali metal ions with poly(ethylene oxide), Polymer 14, 589 (1973)；E. Peled, The Electrochemical Behavior of Alkali and Alkaline Earth Metals in Nonaqueous Battery Systems—The Solid Electrolyte Interphase Model, J. Electrochem. Soc. 126, 2047–2051 (1979)。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch3_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 3, chapterTitle: "聚合物电解质与 SEI", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const left = { x: 0.5, y: 1.25, w: 6.9, h: 4.6 };
  const leftQ = { x: 0.5, y: 1.2, w: 6.9, h: 4.3 };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 3 章\n离子怎样穿过固体？", { placeholder: "title" });
  s.addText("1973–1983：聚合物电解质与 SEI", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.6, w: 7.6, h: 1.4, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("这一章讲两个看起来不相干、其实问的是同一件事的想法：离子怎样穿过一块固体。一个是聚合物电解质——用一块“塑料”代替液体电解液；另一个是 SEI——锂表面那层看不见的薄膜。两篇原始论文都很短：Fenton 等 1973 年的只有一页，Peled 1979 年的只有五页。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "为什么想要固体电解质", "液体会漏、挡不住枝晶；陶瓷又硬又脆"],
    ["2", "PEO：会导离子的塑料", "冠醚 → Fenton 1973 → Armand 1978 → 链段运动"],
    ["3", "SEI：锂为什么没被吃掉", "Dey 1970 → Peled 1979：模型、公式、生长、死锂"],
    ["4", "摇椅电池、校注与小结", "Armand 的另一个想法；常见说法的更正"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  card(s, 7.3, 1.45, 5.4, 2.45, "F1F3F5");
  s.addText("上一章回顾（第 2 章）", { x: 7.55, y: 1.58, w: 5.0, h: 0.42, fontSize: 18, bold: true, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  s.addText([
    { text: "Whittingham 1976：TiS₂ 嵌入正极 + 锂金属负极", options: { bullet: true, breakLine: true } },
    { text: "锂金属一充电就长枝晶，循环效率低", options: { bullet: true, breakLine: true } },
    { text: "锂一次电池已经上市，能放好几年", options: { bullet: true } },
  ], { x: 7.55, y: 2.05, w: 5.0, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.3, 4.1, 5.4, 2.55, "FDF2E7");
  s.addText("本章问题：离子怎样穿过固体？", { x: 7.55, y: 4.23, w: 5.0, h: 0.42, fontSize: 18, bold: true, color: C.accent1, margin: 0, valign: "middle", isTextBox: true });
  s.addText([
    { text: "① 能不能用一块固体塑料代替液体电解液？", options: { breakLine: true } },
    { text: "② 锂泡在有机溶剂里，为什么没被“吃掉”？", options: { breakLine: true } },
    { text: "两个答案都是：一层只放行离子的固体。", options: { bold: true, color: C.accent1 } },
  ], { x: 7.55, y: 4.72, w: 5.0, h: 1.8, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 8, isTextBox: true });
  s.addNotes("上一章结尾留下两个问题：锂金属充电会长枝晶，液体电解液又会漏、会烧。本章第一条线是“换一种电解质”——固体聚合物；第二条线是“看清锂表面到底发生了什么”——SEI。阅读标签（史、变、要、引）与第 1 章相同。");

  // ---------------- 3. Era timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：1967–1983 的三条线", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "三条线的起点都不是电池：冠醚是合成化学的意外，PEO 络合物是高分子化学，锂表面膜是一次电池的工程问题。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "三条线最后都汇进锂离子电池：两极是“宿主”（摇椅），负极靠 SEI 保护，电解质后来出现了凝胶聚合物。" });
  s.addNotes("时间轴不按比例。紫色是聚合物电解质，棕色是 SEI，橙色是摇椅电池。注意 Peled 的 SEI 模型 1977 年就在会议上报告过，1979 年 12 月才正式发表。Armand 一个人出现在两条线上：聚合物电解质和摇椅电池。");

  // ======== Section 1 ========
  d.section("1 聚合物电解质");
  s = d.slide("DARK_SECTION");
  s.addText("1  聚合物电解质：会导离子的塑料", { placeholder: "title" });
  s.addText("固体电解质 · 冠醚 · Fenton, Parker & Wright 1973 · Armand 1978 · 链段运动与 Tg", { placeholder: "body" });
  s.addNotes("第一条线：用固体聚合物代替液体电解液。我们会按时间走一遍：先是 1967 年冠醚给出“醚氧抱住阳离子”的化学基础，再是 1973 年的一页短信，然后是 1978 年 Armand 把它带进电池，最后是 1983 年弄清它为什么能导电。");

  // ---------------- 5. Why solid ----------------
  s = d.slide("CONTENT");
  s.addText("为什么想要固体电解质？", { placeholder: "title" });
  d.fig(s, "electrolyte_types", left);
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：固体电解质 Solid electrolyte", body: "本身是固体，却能让离子在里面移动；电子不能通过。" },
    { kind: "hist", size: 13, body: Q.facts.solid },
    { kind: "why", size: 13, body: "液体电解液导电好，但会漏、会烧，也挡不住锂枝晶（第 2 章）。陶瓷是固体，却又硬又脆，电极一胀一缩就和它脱开。人们想要一种“软的固体”。" },
    { kind: "matters", size: 13, body: "“软的固体电解质”正是聚合物的长处：能做成薄膜，紧贴电极。" },
  ], 0.16);
  s.addNotes("β-氧化铝在 300 °C 左右导 Na⁺，钠硫电池也要在这个温度工作，因为硫和钠都要熔化。陶瓷电解质在室温下很难和固体电极保持良好接触，这个问题在今天的固态电池里依然存在（第 6 章）。");

  // ---------------- 6. Crown ether -> PEO ----------------
  s = d.slide("CONTENT");
  s.addText("从冠醚到 PEO：用氧原子“抱住”阳离子", { placeholder: "title" });
  d.fig(s, "crown_peo", left);
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.pedersen },
    { kind: "why", body: "以前认为 Na⁺、K⁺ 很难被中性有机分子“抓住”。冠醚证明：几个醚氧围成一圈就够了。PEO 相当于“剪开的冠醚”，链很长，能一圈圈缠住离子。" },
    { kind: "matters", body: "“醚氧配位阳离子”是 PEO 电解质的化学基础，也是今天醚类电解液的基础。" },
  ]);
  s.addNotes("18-冠-6 的意思是：环上共 18 个原子，其中 6 个是氧。PEO 是一种很普通的水溶性高分子，重复单元是 –CH₂–CH₂–O–，叫环氧乙烷单元 (ethylene oxide, EO)。1973 年的短信在讨论结构时，明确引用了 Pedersen 1967 年的冠醚论文。");

  // ---------------- 7. Fenton 1973 ----------------
  s = d.slide("CONTENT");
  s.addText("Fenton, Parker & Wright 1973：盐“溶”进了塑料", { placeholder: "title" });
  d.fig(s, "fenton_process", leftQ);
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.fenton },
    { kind: "why", size: 13, body: Q.facts.before73 + " 他们想知道：碱金属盐能不能也和 PEO 形成络合物？" },
    { kind: "matters", size: 13, body: "这是 PEO–盐络合物的起点。但短信里没有提电池（见校注页）。" },
  ], 0.16);
  d.quote(s, Q.fentonReport);
  s.addNotes("实验很简单：把 NaI 和 PEO 按 1 : 4（1 个盐对 4 个 EO 单元）溶在甲醇里，蒸干溶剂。得到的新材料熔点约 200 °C，远高于纯 PEO 的约 65 °C；X 射线和红外谱也和纯 PEO 完全不同，说明形成了新的晶体。拉成纤维后，链的重复周期从 19.25 Å 缩到 8.1 Å，说明链被盐“缠紧”了。");

  // ---------------- 8. Which salts ----------------
  s = d.slide("CONTENT");
  s.addText("哪些盐能和 PEO 结合？", { placeholder: "title" });
  d.fig(s, "salt_grid", leftQ);
  d.caption(s, "据 Fenton et al. 1973 p. 589 正文整理（原文无图表）。", { x: 0.6, y: 5.5, w: 6.8, h: 0.3 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: "1973 年的短信根据冠醚研究和红外谱推断：醚氧直接与阳离子结合，而不是像 Lundberg 等 1966 年所说与阴离子结合。" },
    { kind: "why", size: 13, body: "大阴离子（I⁻、SCN⁻）的盐“抱得松”，容易被醚氧拆开；F⁻、Cl⁻ 的盐“抱得紧”，PEO 拆不开。所以后来选锂盐，都选大阴离子。" },
    { kind: "matters", size: 13, body: "“大阴离子”原则沿用至今：LiClO₄、LiCF₃SO₃，以及 Armand 后来设计的 LiTFSI。" },
  ], 0.16);
  d.quote(s, Q.fentonSize);
  s.addNotes("盐要“溶”进 PEO，醚氧对阳离子的吸引必须赢过盐自身的晶格能。小阴离子的盐晶格能高，所以 KCl、KBr 都不行。原文还观察到：盐超过 20 mol% 时，多余的盐会以纯盐的形式重新结晶出来。锂盐在 1973 年几乎没研究清楚，这一点在校注页还会提到。");

  // ---------------- 9. Armand 1978 ----------------
  s = d.slide("CONTENT");
  s.addText("Armand 1978：把它变成锂电池", { placeholder: "title" });
  d.fig(s, "lmp_cell", left);
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.wright + " " + Q.facts.armand },
    { kind: "why", size: 13, body: "以前锂电池都用液体电解液。Armand 研究嵌入化合物，熟悉电池；他想到：PEO 薄膜既当电解质，又能当正极里的“胶水”，整个电池全是固体。" },
    { kind: "matters", size: 13, body: "1980 年前后，Hydro-Québec、法国 CNRS 与 Elf Aquitaine 合作开发聚合物锂电池。1983 年 Yazami 也是用 PEO 电解质证明锂能嵌入石墨（第 4 章）。" },
  ], 0.14);
  s.addNotes("这种电池后来叫锂金属聚合物电池 (lithium metal polymer, LMP)。2011 年起巴黎的 Autolib' 共享电动车 Bluecar 就用 Bolloré 公司的 LMP 电池，电池要保持在 60–80 °C 工作。Yazami 1983 年选 PEO 而不选液体，是因为聚合物不会像 PC 那样把石墨层撑开（第 4 章）。");

  // ---------------- 10. Segmental motion ----------------
  s = d.slide("CONTENT");
  s.addText("离子怎么在“塑料”里走？靠链段运动", { placeholder: "title" });
  d.fig(s, "hopping", { x: 0.6, y: 1.15, w: 12.1, h: 3.2 });
  d.caption(s, "链段运动 (segmental motion)：高分子链上一小段在热运动中自己扭动，整条链不必移动。", { x: 0.6, y: 4.38, w: 12.1, h: 0.3, size: 12 });
  d.block(s, { x: c3[0], y: 4.75, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.berthier });
  d.block(s, { x: c3[1], y: 4.75, w: 3.95, kind: "why", tint: true, size: 13, body: "1978 年时，人们借晶体导体的思路，以为离子沿结晶 PEO 的螺旋“隧道”走。NMR 结果说明：真正导电的是无定形区。" });
  d.block(s, { x: c3[2], y: 4.75, w: 3.85, kind: "matters", tint: true, size: 13, body: "机理清楚了，改进方向也清楚了：让链更容易动——减少结晶、降低 Tg。" });
  s.addNotes("液体里的离子是带着溶剂壳一起“游”；PEO 里的 Li⁺ 被 4–5 个醚氧配位，链段扭动时，旁边的醚氧接替原来的醚氧，Li⁺ 就像在接力中被传下去。所以离子跑多快，取决于链段动得多快。这也解释了为什么温度对 PEO 电解质影响这么大。");

  // ---------------- 11. Crystalline vs amorphous ----------------
  s = d.slide("CONTENT");
  s.addText("晶区与无定形区：为什么要加热到 60–80 °C", { placeholder: "title" });
  d.fig(s, "cryst_amorph", leftQ);
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：玻璃化转变温度 (Tg)", size: 13, body: "低于 Tg，链被“冻住”，像玻璃一样硬；高于 Tg，链段能扭动，像橡胶。PEO 的 Tg 约 −60 °C，熔点 Tm 约 65 °C。" },
    { kind: "hist", size: 13, body: "1966 年 Lundberg 等发现 KI 能破坏 PEO 结晶；1973 年 Fenton 等发现 KSCN 络合物结晶越少，导电越好。" },
    { kind: "why", size: 13, body: "室温下 PEO 大部分是晶区，只有少量无定形区能导电。加热到熔点以上，晶区全熔，导电率跳升好几个数量级。" },
  ], 0.14);
  d.quote(s, Q.fentonConductivity);
  s.addNotes("一个常见误解是“高于 Tg 就够了”。PEO 的 Tg 很低，室温下无定形区确实能动，但 PEO 太容易结晶，晶区占了大部分，离子只能在零星的无定形区里走，路走不通。所以 PEO 电解质的工作温度要越过 Tm，而不是 Tg。");

  // ---------------- 12. Conductivity chart ----------------
  s = d.slide("CONTENT");
  s.addText("代价：室温下导电太慢", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "离子电导率", labels: ["液体电解液 25 °C：约 10", "PEO–锂盐 80 °C：约 1", "PEO–锂盐 60 °C：约 0.1", "PEO–锂盐 25 °C：约 0.001"], values: [10, 1, 0.1, 0.001] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.5, barDir: "bar",
    chartColors: [HEX.accent2, HEX.accent1, HEX.accent1, HEX.accent6],
    showValue: false, ...chartText,
    catAxisOrientation: "maxMin", valAxisLogScaleBase: 10, valAxisMinVal: 0.0001, valAxisMaxVal: 100, valAxisLabelFormatCode: "General", valAxisHidden: false, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "离子电导率（mS/cm，对数坐标）", showLegend: false,
  });
  d.caption(s, "典型数量级（示意）：不同锂盐、浓度可差 10 倍。液体指 1 M LiPF₆ 碳酸酯溶液。", { x: 0.6, y: 5.9, w: 6.6, h: 0.4 });
  d.stat(s, { x: 7.75, y: 1.3, w: 5.0, value: "约 10 000", unit: "倍", label: "室温下，液体电解液比 PEO–锂盐导电快", color: "accent1" });
  d.column(s, 7.75, 3.0, 5.0, [
    { kind: "why", size: 13, body: "对数坐标每一格是 10 倍。PEO 在 60–80 °C 才接近液体，所以聚合物锂电池都要“保温”工作。" },
    { kind: "matters", size: 13, body: "这是聚合物电解质最大的短板。1990 年代起，人们往聚合物里加液体做成“凝胶”，室温也能用；纯固态 PEO 则用在能保温的场合，如 Bolloré 的电动车电池（第 6 章）。" },
  ], 0.18);
  s.addNotes("数据是文献中常见的数量级，不是某一篇论文的测量值。1 mS/cm = 10⁻³ S/cm。为什么 10 000 倍这么要紧？电池内阻 ∝ 电解质厚度 ÷ 电导率，电导低 10 000 倍，即使把膜做得很薄，内阻也大到电池放不出电。");

  // ======== Section 2 ========
  d.section("2 SEI");
  s = d.slide("DARK_SECTION");
  s.addText("2  SEI：锂为什么没被溶剂吃掉", { placeholder: "title" });
  s.addText("一个谜 · Peled 1979 的模型 · 三步走 · 公式 · 越长越厚 · 死锂", { placeholder: "body" });
  s.addNotes("第二条线回到液体电解液：锂泡在有机溶剂里，热力学上应该一直被腐蚀，实际上却很稳定。答案是锂表面那层膜。这一节主要读 Peled 1979 年的五页论文，把他的模型、公式和推论一步步拆开。");

  // ---------------- 14. The puzzle ----------------
  s = d.slide("CONTENT");
  s.addText("一个谜：锂本该被溶剂“吃掉”", { placeholder: "title" });
  d.fig(s, "li_puzzle", leftQ);
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: "1958 年 Harris 已从 PC 中电解出锂（第 1 章）。1970 年代，锂一次电池上市，锂泡在 PC、SOCl₂ 里能放好几年。" },
    { kind: "why", size: 13, body: "以前人们按 Butler–Volmer 方程分析锂电极，假设最慢的一步是“电子从金属交给溶液里的离子”。可实测的传递系数只有 0.13–0.45，对不上。" },
    { kind: "matters", size: 13, body: "这个谜和第 2 章的难题是同一个：锂金属循环效率低、长枝晶，都发生在这层看不见的表面上。" },
  ], 0.14);
  d.quote(s, Q.peledTable);
  s.addNotes("热力学上，锂的电位约 −3.04 V，几乎能还原所有有机溶剂。如果反应一直进行，锂会被慢慢“吃光”，电池放不了多久。可实际上锂一次电池的储存寿命能达到好几年。Peled 在论文开头用一张表（下一页）把这个矛盾摆得更清楚。");

  // ---------------- 15. Table I ----------------
  s = d.slide("CONTENT");
  s.addText("Peled 的线索：六种电解液，两种结果", { placeholder: "title" });
  d.fig(s, "table1", { x: 0.6, y: 1.15, w: 12.1, h: 3.3 });
  d.caption(s, "据 Peled 1979 Table I 重绘（p. 2047）。", { x: 0.6, y: 4.42, w: 12.1, h: 0.3 });
  d.block(s, { x: c3[0], y: 4.75, w: 3.95, kind: "hist", tint: true, size: 13, body: "1970 年 Dey、1977 年 Rauh 与 Brummer 已提出：锂表面盖着一层导 Li⁺ 的膜。1976–77 年 Peled 研究过 Mg 在 SOCl₂ 中的表面膜。" });
  d.block(s, { x: c3[1], y: 4.75, w: 3.95, kind: "why", tint: true, size: 13, body: "铝比锂容易还原，本该先析出铝。Peled 解释：电池溶剂里，电极表面盖着只放行 Li⁺ 的膜，Al³⁺ 过不去。" });
  d.block(s, { x: c3[2], y: 4.75, w: 3.85, kind: "matters", tint: true, size: 13, body: "一张“反常”的表，说明电池负极根本没和溶液直接接触。" });
  s.addNotes("前三种是铝电镀液，电极表面直接接触溶液，结果符合热力学。后三种是电池体系，SOCl₂、PC 会和锂反应生成一层膜，结果就“反常”了。Peled 原文说：在这类电池里，金属和溶液之间“永远没有直接、自由的接触”。");

  // ---------------- 16. SEI model ----------------
  s = d.slide("CONTENT");
  s.addText("Peled 1979：给这层膜起名 SEI", { placeholder: "title" });
  d.fig(s, "sei_model", leftQ);
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.peled },
    { kind: "why", size: 13, body: "以前叫它“钝化膜”(passivating film)，像一层不导电的锈。Peled 强调：它是固体电解质，导 Li⁺、不导电子；有厚度，是一个“相”，所以叫 interphase，不叫 interface。" },
    { kind: "matters", size: 13, body: "从此，研究负极就是研究 SEI：腐蚀、效率、电压都由它决定。" },
  ], 0.14);
  d.quote(s, Q.peledName);
  s.addNotes("interface（界面）是两相之间的一个几何面，没有厚度；interphase（中间相）是夹在两相之间、有自己厚度和组成的一层。新鲜膜只有 15–25 Å，相当于几层原子：一旦厚到电子“隧穿”不过去，溶剂就拿不到电子，膜就停止快速生长。中文通常译作“固体电解质界面膜”。");

  // ---------------- 17. Three steps ----------------
  s = d.slide("CONTENT");
  s.addText("离子怎样穿过 SEI：三步走", { placeholder: "title" });
  d.fig(s, "peled_fig1", left);
  d.caption(s, "据 Peled 1979 Fig. 1 重绘（原图三步上下排列）。", { x: 0.6, y: 5.88, w: 6.8, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：速率决定步骤 (rds)", size: 13, body: "几步串联时最慢的那一步，像流水线上最慢的工位，决定整体速度。" },
    { kind: "hist", size: 13, body: "1930 年 Wagner 与 Schottky 提出离子晶体中的空位缺陷；离子晶体靠离子跳进空位来导电。Peled 把 SEI 看作这样的离子晶体。" },
    { kind: "why", size: 13, body: "以前认为最慢的是“电子转移”。Peled：膜够厚时，最慢的是第 ② 步——离子在膜里迁移，因为室温下固体晶体导离子很慢。" },
    { kind: "matters", size: 13, body: "今天分析锂电池阻抗，仍把负极界面拆成这几步。" },
  ], 0.14);
  s.addNotes("充电（沉积）时：① 溶液里带着溶剂壳的 Li⁺ 在膜外表面脱掉溶剂，跳进膜里的空位；② 在膜里一格一格跳过去；③ 到达金属表面，拿到电子变成锂原子。放电时反过来。电压也分三段降在这三个地方：两个界面和膜本身。");

  // ---------------- 18. Equation ----------------
  s = d.slide("CONTENT");
  s.addText("Peled 的公式：把“翻山”写成电流", { placeholder: "title" });
  d.fig(s, "hop_equation", left);
  d.caption(s, "示意图：说明式 [3] 中 exp 与 sinh 两项的来历。", { x: 0.6, y: 5.88, w: 6.8, h: 0.3 });
  card(s, 7.75, 1.3, 5.0, 0.72, "F1ECF8");
  s.addText([
    { text: "i = 4ZFaνn", options: {} }, { text: "+", options: { subscript: true } },
    { text: " · exp(−W/RT) · sinh(aZFη / RTL)", options: {} },
  ], { x: 7.85, y: 1.3, w: 4.8, h: 0.72, fontSize: 17, bold: true, color: C.accent3, margin: 0, valign: "middle", align: "center", isTextBox: true });
  d.column(s, 7.75, 2.15, 5.0, [
    { kind: "def", head: "每个符号（原文式 [3]）", size: 13, body: "i 电流密度；a 半跳距离；ν 离子振动频率；n+ 阳离子空位浓度；Z 离子价数；W 跳一次要翻的能垒；η 过电位；L 膜厚；E = η/L 膜内电场；F、R、T 法拉第常数、气体常数、温度。" },
    { kind: "hist", size: 13, body: Q.facts.young },
    { kind: "why", size: 13, body: "exp(−W/RT)：山越高，跳得越少。sinh：电场让向前跳变容易、向后跳变难，两者相减。" },
  ], 0.14);
  s.addNotes("不必背公式，只要看懂两件事。第一，exp(−W/RT) 是“翻山”的概率，温度越高、山越低，离子跳得越勤。第二，膜内电场 E = η/L，同样的过电位加在越厚的膜上，电场越弱，推力越小。下一页的两个推论都从这里来。原文 Eq. [4] 假设全部过电位都降在 SEI 上：η = EL。");

  // ---------------- 19. Tafel chart ----------------
  s = d.slide("CONTENT");
  s.addText("两个推论：膜越厚，电阻越大、Tafel 斜率越大", { placeholder: "title" });
  const Ls = [5, 10, 20, 30, 40];
  s.addChart(d.pres.charts.BAR, [
    { name: "SEI 电极 b = 60L/a", labels: Ls.map((v) => `L = ${v} Å`), values: Ls.map((v) => Math.round((60 * v) / 3)) },
  ], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "col",
    chartColors: [HEX.accent3], showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 900, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "按原文式 [11] 算出的 Tafel 斜率 b（mV）", showLegend: false,
  });
  d.caption(s, "取 a = 3 Å、Z = 1。普通电极（只有电子转移）的 b 约 120 mV；原文：L = 20 Å 时 b ≈ 400 mV。", { x: 0.6, y: 5.7, w: 6.6, h: 0.4 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "why", size: 13, body: "电压小时 sinh x ≈ x，公式变成欧姆定律：反应电阻 R = ρL（ρ 为 SEI 电阻率）。电压大时变成 Tafel 式，斜率 b = 2.3RTL/(aZF)，也和 L 成正比。" },
    { kind: "hist", size: 13, body: "1970 年 Scarr 测得 Li/PC–LiClO₄ 的电容只有 2.4–5.2 µF/cm²（正常 10–30）。Peled 按介电常数 10 换算出膜厚约 20–40 Å，且膜越厚，表观传递系数越小，与模型一致。" },
    { kind: "matters", size: 13, body: "SEI 越厚，内阻越大。今天电池老化时“内阻上升”，SEI 变厚是主要原因之一。" },
  ], 0.16);
  s.addNotes("Tafel 斜率的意思：电流每增大 10 倍，需要多加多少电压。普通电极约 120 mV；SEI 电极的 b 随膜厚变化，所以 Peled 说“不能指望测到唯一的 Tafel 斜率”，这正好解释了文献里五花八门的测量值。电容估算：把 SEI 当平板电容器，C = ε/L，电容越小说明膜越厚。");

  // ---------------- 20. Growth law ----------------
  s = d.slide("CONTENT");
  s.addText("SEI 会慢慢变厚：抛物线规律", { placeholder: "title" });
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  s.addChart(d.pres.charts.LINE, [
    { name: "α = 0.5（抛物线）", labels: months.map((m) => `${m}`), values: months.map((m) => Math.round(20 * Math.pow(m, 0.5))) },
    { name: "α = 0.2", labels: months.map((m) => `${m}`), values: months.map((m) => Math.round(20 * Math.pow(m, 0.2))) },
  ], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.15, chartColors: [HEX.accent4, HEX.accent6], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 7, ...chartText,
    showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt",
    valAxisMinVal: 0, valAxisMaxVal: 80, valGridLine: { color: "E3E8ED", size: 0.5 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "储存时间（月）", catAxisTitleFontSize: 12, showValAxisTitle: true, valAxisTitle: "SEI 厚度 L（Å）", valAxisTitleFontSize: 12,
    showTitle: true, title: "L = const · t^α（原文式 [30]，示意）",
  });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "why", size: 13, body: "膜越厚，电子越难漏过去，溶剂被还原得越慢：dL/dt ∝ 1/L。积分得 L² ∝ t，厚度随 √t 增长——越到后面长得越慢。" },
    { kind: "hist", size: 13, body: "Peled 与 Yamin 1978 年测了 Li 在 LiAlCl₄–SOCl₂ 中的膜厚随时间的变化：指数 α 在 0.2–0.5 之间，不全是 0.5。" },
    { kind: "matters", size: 13, body: "这就是电池“放着不用也会老”（日历寿命）的原因之一。" },
  ], 0.14);
  d.quote(s, Q.peledShelf);
  s.addNotes("曲线是按原文式 [30] 示意画的，起点取 20 Å，不是实测数据。抛物线规律和金属在空气中氧化（如铝表面氧化膜）的规律很像：膜本身就是阻挡层。原文也提醒：膜里有裂缝、孔洞、晶界时，会偏离抛物线规律。");

  // ---------------- 21. Dead lithium ----------------
  s = d.slide("CONTENT");
  s.addText("坏的 SEI：漏电、锂球与“死锂”", { placeholder: "title" });
  d.fig(s, "peled_fig2", left);
  d.caption(s, "据 Peled 1979 Fig. 2 重绘（p. 2050）。⊖ 为充电（沉积），⊕ 为放电（溶出）。", { x: 0.6, y: 5.88, w: 6.8, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: "1970 年代已知：锂在有机电解液中沉积效率接近 100%，溶出效率却低得多，而且搁置越久、电流越大越差（原文引 Selim & Bro 1974、Rommer & Beck 1977）。" },
    { kind: "why", size: 13, body: "Peled 的解释：局部过热和强电场让一小块 SEI 变得能导电子，锂就在膜里面析出，长成被 SEI 包住的锂球，放电时再也溶不出来。" },
    { kind: "matters", size: 13, body: "这就是今天说的“死锂”。它和第 2 章的枝晶一起，让锂金属二次电池迟迟做不成。Peled 建议：给 SEI 掺杂、降低离子电阻。" },
  ], 0.14);
  s.addNotes("“死锂”(dead lithium) 指和负极失去电接触的锂：它还在电池里，却不能再参加反应，容量就这样一点点丢掉。Peled 认为，电流越大，SEI 上的电场越强、发热越多，短路越容易发生，所以快充更糟。");

  // ======== Section 3 ========
  d.section("3 摇椅、校注与小结");

  // ---------------- 22. Rocking chair ----------------
  s = d.slide("CONTENT");
  s.addText("Armand 的另一个想法：摇椅电池", { placeholder: "title" });
  d.fig(s, "rocking_chair", left);
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.rocking },
    { kind: "why", size: 13, body: "锂金属负极会长枝晶、会变成死锂。干脆不用锂金属：负极也换成能“收留”锂的嵌入材料，锂永远以离子形式存在。代价是电压低一些、容量小一些。" },
    { kind: "matters", size: 13, body: "这正是锂离子电池的工作方式。缺的是合适的两极：高电压正极 LiCoO₂ 与石墨负极（第 4、5 章）。" },
  ], 0.16);
  s.addNotes("“摇椅”(rocking chair) 的比喻：Li⁺ 在两个电极之间来回摇，像摇椅前后摆。注意摇椅电池并没有绕开 SEI：石墨负极的电位也很低，同样要靠 SEI 保护，这就把本章的两条线连到了一起（第 5 章 Dahn 1990）。");

  // ---------------- 23. Corrections ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文与常见说法的出入", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    d.block(s, { x: col ? 6.8 : 0.6, y: 1.3 + row * 1.85, w: 5.9, kind: "note", tint: true, size: 12, head: n.head, body: n.body });
  });
  s.addNotes("前两条更正一个流传很广的说法：1973 年的短信是一篇高分子化学论文，作者研究的是钠盐、钾盐的结构，并没有想到电池。第四、五条说明：SEI 的“发现”是一段渐进的历史，Peled 的贡献在于起名和建立定量模型。第六条是读老论文时常见的符号问题。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["固体也能导离子：PEO 的醚氧“接力”传递 Li⁺", "Pedersen 1967 冠醚 → Fenton 等 1973 络合物 → Wright 1975 电导 → Armand 1978 用于电池"],
    ["导电靠无定形区的链段运动", "PEO 室温多为晶区，导电太慢，要加热到 60–80 °C（Berthier 等 1983）"],
    ["锂没被溶剂吃掉，是因为表面有 SEI", "导 Li⁺、不导电子；Dey 1970 等先提出，Peled 1979 命名并建模"],
    ["SEI 的厚度决定一切", "R = ρL；厚度随 √t 增长；坏的 SEI 造成死锂。下一章：LiCoO₂ 与石墨"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.peledKey.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.peledKey.zh}  —— ${Q.peledKey.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("Peled 这句话里的 NAB 是“非水电池”(nonaqueous battery) 的缩写。四十多年后，这句话对锂离子电池依然成立：电解液添加剂、化成工艺，本质上都是在“设计一个好的 SEI”。下一章：1980 年的 LiCoO₂ 正极与 1983 年的石墨负极。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
