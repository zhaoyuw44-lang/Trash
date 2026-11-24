// 锂电池发展史 — 第 2 章：1970 年代——嵌入化学与锂金属电池
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch2_quotes");

const PAPER = {
  short: "锂电池发展史",
  full: "本章原始文献：M. S. Whittingham, Electrical Energy Storage and Intercalation Chemistry, Science 192, 1126–1127 (1976)。作者单位：Exxon Research and Engineering Company, Linden, New Jersey；1976 年 3 月 10 日收稿，6 月 11 日刊出。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch2_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 2, chapterTitle: "嵌入化学与锂金属电池", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  // Column helper that warns when content runs into the quote ribbon / footer.
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
  s.addText("第 2 章\n让锂住进晶体的夹层", { placeholder: "title" });
  s.addText("1970 年代：嵌入化学与锂金属电池", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.75, w: 7.6, h: 1.2, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("上一章我们知道了：锂最轻、电位最负，而且可以在碳酸丙烯酯 (PC) 这类有机溶剂里电解出来。这一章的问题是：负极用锂，正极用什么？1976 年，Exxon 的 Whittingham 给出的答案是 TiS₂，一种能让锂“住进夹层”的层状晶体。这一想法叫嵌入化学，它是今天锂离子电池的基础。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "为什么是 1970 年代", "石油危机、Exxon、室温电池需要的正极"],
    ["2", "嵌入化学", "什么是嵌入、它的前史、用电压量能量"],
    ["3", "为什么是 TiS₂", "层状结构、单相反应、原文 Fig. 1 与 Fig. 2"],
    ["4", "锂金属电池", "一次电池先成功，可充电池卡在枝晶"],
    ["5", "校注与小结", "原文与常见说法的出入，本章要点"],
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
    { text: "锂最轻、电位最负（−3.04 V）", options: { bullet: true, breakLine: true } },
    { text: "锂碰不得水，必须用非水电解液", options: { bullet: true, breakLine: true } },
    { text: "Harris 1958：碳酸丙烯酯 (PC) 中电解出锂", options: { bullet: true } },
  ], { x: 7.65, y: 2.0, w: 4.9, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.05, 5.3, 2.65, "E8F4F3");
  s.addText("本章问题", { x: 7.65, y: 4.17, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText([
    { text: "负极用锂，正极用什么？", options: { bullet: true, breakLine: true } },
    { text: "怎样让锂“进得去、出得来”，反复上千次？", options: { bullet: true, breakLine: true } },
    { text: "锂负极能一次次平整地镀回去吗？", options: { bullet: true } },
  ], { x: 7.65, y: 4.65, w: 4.9, h: 1.9, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("本章五个部分。第 1 章结尾留下的问题是：锂能在有机溶剂里电解出来，但要做电池，还需要一个能和锂可逆反应的正极。这一章读 Whittingham 1976 年发表在 Science 上的两页短文，它第一次把“嵌入化学”和“储存电能”联系在一起。");

  // ---------------- 3. Era timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：1970 年代前后的锂电池", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "三条线交汇：化学家研究嵌入化合物（紫），工业界推出锂一次电池（橙），电解液沿用第 1 章的非水溶剂（青）。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "1970 年代留下两样东西：能放电一次的锂电池（已商品化），和能反复充电的嵌入正极（Whittingham）。" });
  s.addNotes("时间轴不按比例。1973 年这个节点很重要：同一年，Whittingham 申请了 TiS₂ 电池专利（原文 ref. 7 标为 1973 年的比利时专利），也爆发了第一次石油危机。注意 1980 年 LiCoO₂ 属于第 4 章，这里只是预告。");

  // ======== Section 1 ========
  d.section("1 为什么是 1970 年代");
  s = d.slide("DARK_SECTION");
  s.addText("1  为什么是 1970 年代", { placeholder: "title" });
  s.addText("石油危机 · 高温电池的困境 · 室温锂电池需要什么样的正极", { placeholder: "body" });
  s.addNotes("这一节回答：为什么一家石油公司会去研究电池？以及 Whittingham 在找正极之前，先列出了哪些条件。");

  // ---------------- 5. Motivation ----------------
  s = d.slide("CONTENT");
  s.addText("石油危机：石油公司为什么研究电池", { placeholder: "title" });
  d.fig(s, "motivation", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.oil },
    { kind: "why", size: 13, body: "以前大家押注高温电池，因为熔融的电极和电解质反应快。但高温带来腐蚀和保温问题。Whittingham 想绕开高温：用锂负极 + 有机电解液，在室温工作。" },
    { kind: "matters", size: 13, body: "“室温、可逆、碱金属”这三个关键词，定下了此后 50 年锂电池研究的方向。" },
  ], 0.16, 5.75, "motivation");
  d.quote(s, Q.ambient);
  s.addNotes("原文开头就交代了动机：电动汽车、储存低谷电和太阳能都需要高能量电池，而 Cairns 与 Shimotake 综述的那些电池大多在高温下工作，腐蚀问题还没解决。“For convenience”一句说明：选锂和有机电解液，在当时是“顺手”的选择——第 1 章的 Harris 已经证明锂能在 PC 中电解出来。");

  // ---------------- 6. Cathode wish list ----------------
  s = d.slide("CONTENT");
  s.addText("正极的“招聘条件”：原文列出的四条", { placeholder: "title" });
  d.fig(s, "cathode_wishlist", { x: 0.6, y: 1.15, w: 12.1, h: 3.25 });
  d.caption(s, "四条条件出自原文 p. 1126：“an electronically conductive, highly oxidizing solid that could react readily and reversibly with lithium … light in weight and inexpensive”。", { x: 0.6, y: 4.42, w: 12.1, h: 0.4 });
  row3(s, 4.9, [
    { kind: "hist", body: Q.facts.hightemp },
    { kind: "why", body: "以前室温锂电池的正极多是金属卤化物等，放电产物会溶解或结构崩塌，充不回去。Whittingham 先定条件“能和锂可逆反应的固体”，再找材料。" },
    { kind: "matters", body: "这四条至今仍是挑正极的标准：导电、电压高、可逆、轻而便宜。LiCoO₂、LiFePO₄ 都是按这张清单找到的。" },
  ], 13, 6.85, "wishlist");
  s.addNotes("“氧化性强”是什么意思？正极要能从外电路“抢”电子，抢得越凶，电池电压越高。“导电子”是因为电子必须走到正极内部每一个反应点；如果正极是绝缘体，就得掺大量碳粉。注意四条里没有“便宜的锂”——那时的锂一次电池已经证明锂负极可行。");

  // ======== Section 2 ========
  d.section("2 嵌入化学");
  s = d.slide("DARK_SECTION");
  s.addText("2  嵌入：让客人住进晶体的“夹层”", { placeholder: "title" });
  s.addText("什么是嵌入 · 从石墨到层状硫化物的前史 · 电化学嵌入 · 用电压量能量", { placeholder: "body" });
  s.addNotes("嵌入是本章最核心的概念，也是整个锂离子电池的基础。我们先讲它是什么，再讲它从哪里来。");

  // ---------------- 8. Intercalation concept ----------------
  s = d.slide("CONTENT");
  s.addText("什么是嵌入 (intercalation)", { placeholder: "title" });
  d.fig(s, "intercalation_concept", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：嵌入 Intercalation", size: 13, body: "客体（原子、离子或分子）可逆地钻进主体晶体的层间，主体骨架基本不变。英文来自拉丁语 intercalare：往日历里插进一天（闰日）。" },
    { kind: "hist", size: 13, body: Q.facts.graphite },
    { kind: "why", size: 13, body: "以前的电极反应要“拆房重建”：锌溶解再长回来，PbO₂ 变成 PbSO₄。嵌入只是房客进出，房子不拆，所以快、可逆。" },
    { kind: "matters", size: 13, body: "今天锂离子电池的正极和负极，几乎都是嵌入材料。" },
  ], 0.15, 6.85, "concept");
  s.addNotes("一个比喻：主体晶体像一个书架，层与层之间有空隙；锂离子像插进去的书，书架只是被撑开一点点。为什么锂进去还要带一个电子？因为晶体要保持电中性：锂以 Li⁺ 的形式进入层间，电子交给主体里的金属离子（TiS₂ 里是 Ti⁴⁺ 变成 Ti³⁺）。所以嵌入反应本质上也是一个氧化还原反应。");

  // ---------------- 9. Intercalation history ----------------
  s = d.slide("CONTENT");
  s.addText("嵌入的前史：从石墨到层状硫化物", { placeholder: "title" });
  d.fig(s, "intercal_history", { x: 0.6, y: 1.1, w: 12.1, h: 3.7 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.sulfides },
    { kind: "why", body: "化学家研究嵌入，起初是出于好奇和超导，并不是为了电池。1972–73 年前后，Armand、Steele 等人才提出：嵌入反应可以用作电池电极反应。" },
    { kind: "matters", body: "Whittingham 的贡献不是“发明嵌入”，而是第一次把它做成室温可充电的电池，并测出能量和可逆性。" },
  ], 13, 6.85, "history");
  s.addNotes("C₈K 中“8”表示每 8 个碳原子配 1 个钾原子。Rüdorff 与 Hofmann 1938 年提出“阶”(stage)：客体不是每层都填，而是隔一层、隔两层有规律地填。1970 年 Gamble 等在 Science 上报道：有机分子（如吡啶）插进 TaS₂ 层间后仍是超导体。Rouxel（法国南特）和 Schöllhorn（德国）在 1970 年代初系统研究了碱金属嵌入层状化合物的化学。");

  // ---------------- 10. Electrochemical intercalation ----------------
  s = d.slide("CONTENT");
  s.addText("从烧瓶到电池：电化学嵌入", { placeholder: "title" });
  d.fig(s, "electrochem_route", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.electrochem },
    { kind: "why", size: 13, body: "化学法靠加热和时间“硬塞”，200 °C 下要好几天。电化学法用电子“推”：外电路送进电子，客体跟着进来；电压控制推力，电流控制速度。" },
    { kind: "matters", size: 13, body: "嵌入可以在室温、几分钟内完成，而且受电压控制——这正是电池充放电需要的条件。" },
  ], 0.16, 5.75, "electrochem");
  d.quote(s, Q.nothingKnown);
  s.addNotes("原文的逻辑：层状硫化物能嵌入很多东西，这已经是 1970 年前后的“旧知识”；但是能不能在电池里做、反应能量有多大、能不能退回来，都没人知道。吡啶盐酸盐溶液里，吡啶以质子化形式存在，电解时它在 TaS₂ 表面得到电子、进入层间。这个实验证明：嵌入可以由电极电位驱动。");

  // ---------------- 11. Voltage = free energy (chart) ----------------
  s = d.slide("CONTENT");
  s.addText("嵌入有多“带劲”？用电压来量", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "电压", labels: ["石墨中的 K（C₈K）", "TaS₂ 中的 K（含水）", "TiS₂ 中的 Li（x≈0）"], values: [0.2, 2.0, 2.5] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "col",
    chartColors: [HEX.accent6, HEX.accent1, HEX.accent3],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 3.0, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "嵌入化合物相对对应碱金属的电压（V，原文数据）", showLegend: false,
  });
  d.caption(s, "数据：原文 p. 1126。K–TaS₂ 原文写“约 2 V 或更高”；C₈K 引自 Aronson 等 1968。前两项相对钾金属，第三项相对锂金属。", { x: 0.6, y: 5.7, w: 6.6, h: 0.6 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "公式：ΔG = −nFE", size: 13, body: "ΔG：反应自由能（能放出多少能），n：转移的电子数，F：法拉第常数 96 485 C/mol，E：电池电压。电压越高，存的能量越多。" },
    { kind: "hist", size: 13, body: Q.facts.gibbs },
    { kind: "why", size: 13, body: "以前要用量热法测反应热。Whittingham 改为“读电压”：KOH 与 TaS₂ 反应时钾嵌进去，水却没被还原，说明这个电压至少约 2 V。" },
    { kind: "matters", size: 13, body: "石墨嵌钾只有 0.2 V，做正极太低。但低电位恰好适合做负极——这是 1980 年代石墨负极的出发点（第 4 章）。" },
  ], 0.14, 6.85, "voltage");
  s.addNotes("“钾没把水还原”为什么能说明电压？如果嵌入后的钾还像金属钾一样活泼，它会立刻和水反应放出氢气。实际上水能安稳地和钾一起住在层间，加热到 100 °C 才被赶出来，说明钾在 TaS₂ 里被“稳住”了，能量下降了约 2 eV。电压直接就是每个电子的自由能变化，这是电化学测热力学的最简便办法。");

  // ======== Section 3 ========
  d.section("3 为什么是 TiS₂");
  s = d.slide("DARK_SECTION");
  s.addText("3  为什么是 TiS₂", { placeholder: "title" });
  s.addText("层状结构 · 最轻、导电、扩散快 · 单相反应 · 原文 Fig. 1 与 Fig. 2 · 性能", { placeholder: "body" });
  s.addNotes("这一节是原文的主体：作者为什么从一大类层状硫化物里挑中 TiS₂，以及做出来的电池表现如何。");

  // ---------------- 13. TiS2 structure ----------------
  s = d.slide("CONTENT");
  s.addText("TiS₂ 的结构：一叠“三明治”", { placeholder: "title" });
  d.fig(s, "tis2_structure", { x: 0.5, y: 1.3, w: 6.9, h: 4.1 });
  d.caption(s, "示意（侧视，未按比例）。层间距为公认文献值；原文只说“最大膨胀 0.5 Å，约 10%”。", { x: 0.6, y: 5.5, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.structure },
    { kind: "why", size: 13, body: "层内 Ti–S 是强化学键，层与层之间只有很弱的范德华力 (van der Waals)。锂进来只需把层稍稍撑开，不用拆任何键。" },
    { kind: "matters", size: 13, body: "层间距只变约 10%，反复充放电结构不会“累坏”。体积变化小，是长寿命电极的关键。" },
  ], 0.16, 5.75, "structure");
  d.quote(s, Q.noBonds);
  s.addNotes("每一层是“硫–钛–硫”三明治：钛夹在两层硫中间，每个钛被 6 个硫包围（八面体配位）。锂进入三明治之间的空隙，也占八面体位置。每进来一个 Li⁺，就有一个电子交给钛，Ti⁴⁺ 变成 Ti³⁺。原文 p. 1126 用 X 射线证实：放电时锂确实嵌入 TiS₂ 晶格，垂直于层的方向最多膨胀 0.5 Å。");

  // ---------------- 14. Why TiS2 (chart) ----------------
  s = d.slide("CONTENT");
  s.addText("为什么选 TiS₂：最轻、导电、锂跑得快", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "理论比容量", labels: ["TiS₂", "ZrS₂", "NbS₂", "TiSe₂", "TaS₂", "NbSe₂"], values: [239, 173, 171, 130, 109, 107] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent2, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6],
    showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 290, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "每个 MX₂ 嵌入 1 个锂时的理论比容量（mAh/g）", showLegend: false,
  });
  d.caption(s, "补充计算（非原文数据）：Q = F ÷ M ÷ 3.6，M 为 MX₂ 的摩尔质量。TiS₂ 的 M = 112 g/mol。", { x: 0.6, y: 5.7, w: 6.6, h: 0.4 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.nmr },
    { kind: "why", size: 13, body: "三条理由：钛最轻，同样重量存的锂最多；TiS₂ 像金属一样导电，不用掺碳粉；锂在层间扩散最快，充放电就快。" },
    { kind: "matters", size: 13, body: "一种材料同时满足“轻、导电、扩散快”很少见。TiS₂ 至今仍是讲解嵌入正极的标准例子。" },
  ], 0.16, 5.75, "whyTiS2");
  d.quote(s, Q.tis2Choice);
  s.addNotes("比容量算法和第 1 章一样：Q = nF/M。TiS₂ 摩尔质量 47.87 + 2 × 32.07 ≈ 112.0 g/mol，96 485 ÷ 112.0 ÷ 3.6 ≈ 239 mAh/g。同一族的锆、铌、钽都更重，硒也比硫重一倍多。ZrS₂ 是半导体，导电性差。“metallic conductivity”的来源当时还在争论（原文 refs. 13, 14），今天一般认为 TiS₂ 是半金属或高掺杂的半导体。");

  // ---------------- 15. Single phase ----------------
  s = d.slide("CONTENT");
  s.addText("单相反应：电压随锂的多少平滑下降", { placeholder: "title" });
  d.fig(s, "single_phase", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.phase },
    { kind: "why", size: 13, body: "以前的电极反应多是两相（如 Pb → PbSO₄），要不断生成新晶体，慢且易坏。单相反应不生成新晶体，锂只是慢慢填满空位。" },
    { kind: "matters", size: 13, body: "没有相界面要移动，所以反应快、可逆。代价是电压随放电逐渐下降：约 2.5 V → 1.9 V。" },
  ], 0.16, 5.75, "phase");
  d.quote(s, Q.structural);
  s.addNotes("相 (phase) 指成分和结构都均一的一块物质。单相时，LiₓTiS₂ 里的 x 可以是 0 到 1 之间的任何值，就像糖水的浓度可以连续变化，电压也随之连续变化。两相时，满锂相和空锂相同时存在，放电只是改变两者的比例，每一部分的成分不变，所以电压不变——这就是平台。第 6 章的 LiFePO₄ 就是平台型。");

  // ---------------- 16. Fig. 1 ----------------
  s = d.slide("CONTENT");
  s.addText("原文 Fig. 1：Li/TiS₂ 的电压曲线", { placeholder: "title" });
  d.fig(s, "fig1_redraw", { x: 0.5, y: 1.25, w: 6.9, h: 4.25 });
  d.caption(s, "据原文 Fig. 1 重绘（读图，近似）。原图纵轴在 0 与 1.5 V 之间折断，曲线末端约 1.2 V。", { x: 0.6, y: 5.5, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.fig1 },
    { kind: "why", size: 13, body: "以前常用“能用多少次”说明可逆。Whittingham 改看开路电压能否原路返回：放电 ● 与充电 ○ 落在同一条线上，说明锂进去多少就出来多少。" },
    { kind: "matters", size: 13, body: "1976 年就有 1100 多次循环，证明可充锂电池的正极问题可以用嵌入化学解决。" },
  ], 0.16, 5.75, "fig1");
  d.quote(s, Q.reversible);
  s.addNotes("三条曲线的差别主要来自电解液的电阻（原图注说电极间距较大）：电流越大，电压损失越多。曲线 b 在 x≈0.34 处有一个小台阶，是电流从 10 mA 降到 4 mA 时电压回升。原文的“ma”就是今天的 mA。浅循环每次只用 4% 容量，主要考验的是 TiS₂ 本身；它不能说明整个电池（尤其是锂负极）能深度循环 1100 次。");

  // ---------------- 17. Powder cell + Fig. 2 ----------------
  s = d.slide("CONTENT");
  s.addText("从单晶到粉末电极：更像真正的电池", { placeholder: "title" });
  d.fig(s, "powder_cell", { x: 0.6, y: 1.1, w: 12.1, h: 3.75 });
  d.caption(s, "左：据原文 p. 1126 文字描述绘制（示意）。右：据原文 Fig. 2 重绘（读图，近似），电解液为 LiAlCl₄ 溶于甲基氯甲酸酯。", { x: 0.6, y: 4.85, w: 12.1, h: 0.3 });
  row3(s, 5.2, [
    { kind: "hist", body: Q.facts.cell },
    { kind: "why", body: "单晶适合测本征性质，电池却要大面积电极：TiS₂ 粉末加 10% Teflon 粘结剂，热压到不锈钢网上。" },
    { kind: "matters", body: "“活性粉末 + 粘结剂 + 集流体”沿用至今，只是 Teflon 换成 PVDF，钢网换成铝箔。" },
  ], 13, 6.88, "powder");
  s.addNotes("和第 1 章的联系：单晶电池的电解液 LiPF₆ 溶于碳酸丙烯酯 (PC)——正是 Harris 1958 年研究的溶剂；LiPF₆ 后来也成了锂离子电池最常用的盐。粉末电池用的 DME（乙二醇二甲醚）和 THF（四氢呋喃）是醚类溶剂，对锂金属比较稳定。Fig. 2 两条曲线对应 10 和 20 mA 的电流，电极面积 2 cm²，即 5 和 10 mA/cm²。");

  // ---------------- 18. Rate & energy (charts) ----------------
  s = d.slide("CONTENT");
  s.addText("性能：室温电池追上了高温电池", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "电流密度", labels: ["Holleck 等 Li/TiS₂（室温）", "Exxon Li/TiS₂（室温）", "Li/NiS（400 °C+）", "Li/FeS₂（400 °C+）", "Li/CuS（400 °C+）"], values: [0.33, 10, 10, 40, 50] }], {
    x: 0.6, y: 1.2, w: 6.0, h: 3.35, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent2, HEX.accent1, HEX.accent1, HEX.accent1],
    showValue: true, dataLabelFormatCode: "0.##", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 62, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "电流密度（mA/cm²，原文 p. 1126–1127）", showLegend: false,
  });
  s.addChart(d.pres.charts.BAR, [{ name: "能量密度", labels: ["Li/TiS₂（室温）", "LiAl/FeS（高温）", "Na/S 单相区（高温）"], values: [480, 460, 330] }], {
    x: 6.8, y: 1.2, w: 5.9, h: 3.35, barDir: "bar",
    chartColors: [HEX.accent2, HEX.accent1, HEX.accent1],
    showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 580, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "能量密度（Wh/kg，仅活性物质，原文 p. 1127）", showLegend: false,
  });
  row3(s, 4.75, [
    { kind: "hist", body: Q.facts.rate },
    { kind: "why", body: "电流快慢取决于锂在固体里扩散多快（D ≈ 10⁻⁷ cm²/s）。多余的 Ti（Ti₁₊ᵧS₂）会钻进层间把层“钉”住、挡住锂，所以 TiS₂ 要配比准确。" },
    { kind: "matters", body: "室温电池达到高温电池的电流和能量水平，又省掉保温、防腐的“死重”。作者认为它能用于电动汽车。" },
  ], 13, 6.88, "perf");
  s.addNotes("扩散系数 D 的意思：锂离子每秒“随机走动”覆盖的面积。D = 10⁻⁷ cm²/s 时，锂走过 1 μm 只需约 0.1 秒，所以细颗粒的 TiS₂ 能很快充满。注意右图三个数都是只算活性物质的理论值；原文说实用电池预计在 100+ Wh/kg 量级。Na/S 的 330 Wh/kg 是原文所说“单相区”的数值，不是 Na/S 常引的最大理论值。");

  // ======== Section 4 ========
  d.section("4 锂金属电池");
  s = d.slide("DARK_SECTION");
  s.addText("4  锂金属电池：一次电池先成功", { placeholder: "title" });
  s.addText("锂一次电池上市 · 可充电池的难题：枝晶 · 通往锂离子电池的两条路", { placeholder: "body" });
  s.addNotes("“锂金属电池”指负极是金属锂的电池，和后来负极是碳、锂以离子形式存在的“锂离子电池”不同。1970 年代，前者里只放电一次的那一类先走进了市场。");

  // ---------------- 20. Primary cells ----------------
  s = d.slide("CONTENT");
  s.addText("锂一次电池：1970 年代率先商品化", { placeholder: "title" });
  d.fig(s, "primary_cells", { x: 0.6, y: 1.1, w: 12.1, h: 3.25 });
  d.caption(s, "电压为常见标称值（补充数据）；年份为大致的商品化时间。", { x: 0.6, y: 4.38, w: 12.1, h: 0.3 });
  row3(s, 4.75, [
    { kind: "hist", body: Q.facts.primary },
    { kind: "why", body: "一次电池只放电：锂只需溶解，不用镀回去，所以没有枝晶问题。约 3 V 的高电压和长储存寿命，让它们进入手表、相机和医疗设备。" },
    { kind: "matters", body: "它们证明锂负极 + 有机电解液可以量产。电解液多用 PC、γ-丁内酯等环状酯，正是第 1 章 Harris 研究过的那类溶剂。" },
  ], 13, 6.88, "primary");
  s.addNotes("Li/I₂ 电池用固体 LiI 作电解质，电流很小但非常可靠，适合起搏器。Li/(CF)ₓ 的正极是氟化石墨，也可以看作一种“嵌入”结构。Li/SOCl₂ 很特别：亚硫酰氯既是溶剂又是正极活性物质，盐是 LiAlCl₄。各电池所用电解液成分是根据通行资料补充的，不是本章原文内容。");

  // ---------------- 21. Dendrites ----------------
  s = d.slide("CONTENT");
  s.addText("可充锂电池的难题：枝晶 (dendrite)", { placeholder: "title" });
  d.fig(s, "dendrite", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：枝晶 Dendrite", size: 13, body: "金属在电极上沉积时长出的树枝状、针状晶体。dendrite 来自希腊语 dendron（树）。" },
    { kind: "hist", size: 13, body: Q.facts.dendrite },
    { kind: "why", size: 13, body: "一次电池不用把锂镀回去；可充电池每次充电都要重新镀锂，表面任何凸起都会吸引更多电流。" },
    { kind: "matters", size: 13, body: "枝晶会刺穿隔膜，造成内短路甚至起火。1980 年代末的锂金属电池事故（第 5 章）让业界最终放弃锂金属负极。" },
  ], 0.15, 6.85, "dendrite");
  s.addNotes("原文对锂负极几乎没有讨论，1100 次循环也只是浅循环。TiS₂ 正极很好，但锂金属负极成了整个电池的短板。为什么尖端电流大？电场在尖端最集中，就像避雷针；锂离子优先在尖端得到电子，于是尖端越长越快。第 3 章会讲另一条线索：锂表面的那层膜 (SEI) 也决定了锂怎样沉积。");

  // ---------------- 22. Next steps ----------------
  s = d.slide("CONTENT");
  s.addText("从 Li/TiS₂ 到锂离子电池：还差两步", { placeholder: "title" });
  d.fig(s, "next_steps", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.rocking },
    { kind: "why", size: 13, body: "TiS₂ 不含锂，只能配锂金属负极，枝晶躲不开。硫化物电压只有约 2 V；氧化物的电压更高，Goodenough 因此转向氧化物。" },
    { kind: "matters", size: 13, body: "嵌入化学把问题拆成两半：正极找高电压的含锂氧化物，负极找低电位的嵌入材料（碳）。合起来就是锂离子电池。" },
  ], 0.16, 6.85, "next");
  s.addNotes("这一页是后面三章的预告。为什么含锂的正极这么重要？如果正极出厂时就带着锂，负极就可以是“空房子”（比如石墨），电池组装时处于放电态，第一次充电才把锂从正极搬到负极。2019 年，Whittingham 与 Goodenough、Yoshino 因锂离子电池共同获得诺贝尔化学奖。");

  // ======== Section 5 ========
  d.section("5 校注与小结");
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文与常见说法的出入", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const c = i % 2, r = Math.floor(i / 2);
    d.block(s, { x: c ? 6.8 : 0.6, y: 1.4 + r * 2.7, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
  });
  s.addNotes("第一条最常见：很多教材写“Li/TiS₂ 电池 2.5 V”，其实那是刚开始放电时的电压。第二条是原文自身的不一致，读 Fig. 2 时要注意它和 Fig. 1 的电解液不同。第三条提醒：480 Wh/kg 是材料层面的理论值。另外，原文中的“ma”就是 mA；Fig. 1、Fig. 2 曲线旁的 4、10、20 ma 是电流，不是电流密度。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["嵌入 = 房客进出，房子不拆", "锂进入 TiS₂ 层间，不断键、结构几乎不变 → 快、可逆（Whittingham 1976）"],
    ["为什么是 TiS₂", "最轻最便宜、像金属一样导电、锂扩散快；0 < x < 1 全程单相，平均约 2.2 V"],
    ["锂一次电池先成功", "Li/(CF)ₓ、Li/SOCl₂、Li/MnO₂ 在 1970 年代上市：只放电，不用把锂镀回去"],
    ["可充锂金属电池卡在负极", "枝晶 → 短路。下一章：聚合物电解质与 SEI；第 4 章：两极都用嵌入材料"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.newGeneration.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.newGeneration.zh}  —— ${Q.newGeneration.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("“新一代固体正极材料”这句话后来应验了：LiCoO₂、LiMn₂O₄、LiFePO₄、三元材料，全都是嵌入型固体正极。下一章换一个角度：1973 年起，人们开始研究固体聚合物电解质，1979 年 Peled 提出 SEI 模型，解释锂金属表面那层膜。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
