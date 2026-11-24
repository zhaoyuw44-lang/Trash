// 锂电池制造 — 第 5 章：让数据可信——扣式电池的可重复性与最佳实践
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch5_quotes");

const PAPER = {
  short: "锂电池制造",
  full: "本章原始文献：F. Dai & M. Cai, Best practices in lithium battery cell preparation and evaluation, Commun. Mater. 3, 64 (2022)（General Motors R&D）；P.-M. Luc, S. Bauer & J. Kowal, Reproducible Production of Lithium-Ion Coin Cells, Energies 15, 7949 (2022)（TU Berlin）。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch5_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 5, chapterTitle: "让数据可信：可重复性与最佳实践", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const axisTitles = (xt, yt) => ({
    showCatAxisTitle: !!xt, catAxisTitle: xt, catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
    showValAxisTitle: !!yt, valAxisTitle: yt, valAxisTitleFontSize: 12, valAxisTitleColor: HEX.dk2,
  });
  const legend = { showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1 };
  const grid = { valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" } };
  const noGrid = { valGridLine: { style: "none" }, catGridLine: { style: "none" } };
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
  s.addText("第 5 章\n让数据可信", { placeholder: "title" });
  s.addText("扣式电池的可重复性与最佳实践", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.6, w: 7.6, h: 1.3, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("第 4 章学会了怎样装一颗扣式电池。这一章问下一个问题：同样的材料、同样的步骤，为什么 8 颗电池测出 8 个不同的数？我们读两篇 2022 年的论文：通用汽车研发中心 Dai 和 Cai 的“最佳实践”观点文章，以及柏林工业大学 Luc 等人用 128 颗电池做的统计实验。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "差异从哪里来", "四类来源、对齐与称重、毛刺、压力、电解液、人"],
    ["2", "测几颗、怎么报离散", "可用率、均值与标准差、CV、样本数、实验设计"],
    ["3", "报告哪些参数", "面载量、N/P、E/C、锂过量；半电池为何高估寿命"],
    ["4", "清单、校注与小结", "实验室实操清单、论文报告清单、原文校注"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  card(s, 7.4, 1.45, 5.3, 2.45, "F1ECF8");
  s.addText("上一章回顾（第 4 章）", { x: 7.65, y: 1.57, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent3, margin: 0, isTextBox: true });
  s.addText([
    { text: "CR2032：正负极壳、垫片、弹簧、密封圈", options: { bullet: true, breakLine: true } },
    { text: "在手套箱里叠片、加电解液、封口", options: { bullet: true, breakLine: true } },
    { text: "半电池（对锂）与全电池；先化成再测试", options: { bullet: true } },
  ], { x: 7.65, y: 2.05, w: 4.9, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.1, 5.3, 2.65, "E8F4F3");
  s.addText("本章问题", { x: 7.65, y: 4.22, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText([
    { text: "同一批材料，为什么 8 颗电池结果不一样？", options: { bullet: true, breakLine: true } },
    { text: "要测几颗？误差棒该怎么画？", options: { bullet: true, breakLine: true } },
    { text: "论文里写哪些数，别人才能重复、才能和实用电池比？", options: { bullet: true } },
  ], { x: 7.65, y: 4.7, w: 4.9, h: 1.9, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("组装步骤本身在第 4 章讲过，这里不再重复，只讲“怎样让每一颗都一样”和“怎样把结果说清楚”。软包电池的制作和多层电极的 N/P 配比留到第 6 章。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从啤酒厂统计到电池测试指南", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "小样本统计（紫）一百年前就有了。电池界到 2010 年代才系统地讨论“扣式电池怎么做才可重复”（青）。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "2022 年的两篇论文（橙）把这些经验整理成清单：哪些因素要固定、每批做几颗、论文里报什么。" });
  s.addNotes("时间轴不按比例。1935 年有两件事：统计学家 Fisher 出版《实验设计》，德国化学家 Karl Fischer 发明测微量水的滴定法——名字相近，是两个人。2011–2021 年的几篇指南，Dai 和 Luc 两篇论文都引用了，是我们做扣式电池时值得找来读的原始参考。");

  // ======== Section 1 ========
  d.section("1 差异从哪里来");
  s = d.slide("DARK_SECTION");
  s.addText("1  差异从哪里来", { placeholder: "title" });
  s.addText("四类来源 · 对齐与称重 · 冲片毛刺 · 内部压力 · 电解液与水 · 人与环境", { placeholder: "body" });
  s.addNotes("先找原因。一颗电池的结果 = 材料本身的性能 + 制作带来的偏差。这一节讲第二项：手工制作会在哪些地方引入偏差。");

  // ---------------- 5. Fishbone ----------------
  s = d.slide("CONTENT");
  s.addText("四类来源：材料、设备、生产、组装者", { placeholder: "title" });
  d.fig(s, "fishbone", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "据 Luc 等 2022 原文 Fig. 3 重绘为鱼骨图。", { x: 0.6, y: 5.85, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.fishbone },
    { kind: "why", size: 13, body: "以前大家各自摸索，论文只报结果、不报做法。Luc 等先把所有可能的原因列出来、分好类，再挑几个用实验去验证。" },
    { kind: "matters", size: 13, body: "排查问题时有了一张清单。后面几页按这张清单逐项讲：电极、毛刺、压力、电解液、人。" },
  ], 0.16, 6.85, "fishbone");
  s.addNotes("鱼骨图的用法：鱼头写“结果”，每根大骨是一类原因，小刺是具体原因。Luc 等的四类和质量管理里常说的“人、机、料、法”几乎一一对应：组装者是人，设备是机，材料是料，生产（环境、顺序、时间）是法。看到电池数据离散时，可以对着这张图一项项问：这一项我固定了吗？");

  // ---------------- 6. Alignment & weighing ----------------
  s = d.slide("CONTENT");
  s.addText("电极：对齐与称重", { placeholder: "title" });
  d.fig(s, "alignment", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.align },
    { kind: "why", size: 13, body: "以前常把正、负极冲成一样大，以为正对最好。可手工放片总会偏一点，正极边一露出来，锂就镀在负极外面。所以改成负极大一圈。" },
    { kind: "matters", size: 13, body: "对齐和称重决定“比容量”可不可信。Luc 用 16 mm 负极配 14 mm 正极；Dai 提到软包里负极每边大 1–2 mm。" },
  ], 0.14, 5.95, "align");
  d.quote(s, Q.alignment);
  s.addNotes("全电池里，负极必须在正极的每一处“对面”都有位置接收锂。如果正极边缘超出负极，那一圈的锂离子找不到石墨，只能变成金属锂沉积，这就是析锂。称重也很关键：手工涂布的面载量常有几个百分点的波动（Dai p. 2），所以要用每一片自己的质量算比容量，而不是用一个平均值。半电池里锂片本身就比正极大，但对齐和称重同样要做。");

  // ---------------- 7. Burr ----------------
  s = d.slide("CONTENT");
  s.addText("冲片的毛刺：比隔膜还“高”", { placeholder: "title" });
  d.fig(s, "burr", { x: 0.5, y: 1.15, w: 6.0, h: 3.95 });
  s.addChart(d.pres.charts.BAR, [{ name: "高度", labels: ["隔膜厚度（对照）", "垫片 · 圆角面", "垫片 · 毛刺面", "负极 EL-Cut · 圆角面", "负极 EL-Cut · 毛刺面", "负极空心冲 · 圆角面", "负极空心冲 · 毛刺面"], values: [23, 23.2, 65.4, 37.4, 85.4, 37.0, 68.7] }], {
    x: 6.75, y: 1.15, w: 6.0, h: 3.75, barDir: "bar",
    chartColors: [HEX.accent2, HEX.accent6, HEX.accent4, HEX.accent6, HEX.accent4, HEX.accent6, HEX.accent4],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 105, ...noGrid,
    showTitle: true, title: "激光扫描测得的边缘最大高度（µm）", showLegend: false,
  });
  d.caption(s, "左：据 Luc 原文 Fig. 4 重绘。右：数据来自原文 Table 3（扫描区域的最大高度）；隔膜 FS3002 厚 0.023 mm（原文 p. 4）。", { x: 0.6, y: 5.13, w: 12.1, h: 0.3 });
  row3(s, 5.45, [
    { kind: "hist", body: "冲裁 (blanking) 是金属加工老工艺，冲出的圆片一面圆角、一面毛刺。2022 年 Luc 等用激光扫描量了它。" },
    { kind: "why", body: "以前冲片后直接装，很少看边缘。负极毛刺高约 70–85 µm，隔膜只有 23 µm，朝向隔膜就可能扎穿。" },
    { kind: "matters", body: "冲刀要锋利、定期检查；毛刺面一律朝外（远离隔膜）。偶发的短路、自放电常来自这里。" },
  ], 13, 6.85, "burr");
  s.addNotes("“毛刺朝外”是什么意思？负极在隔膜上方，它的毛刺应该朝上，指向垫片；正极在隔膜下方，毛刺应该朝下，指向壳底。垫片的毛刺同样会让压力分布不均。注意 Table 3 的数是扫描区域内的最大高度，包含了圆片本身的厚度起伏，只用来比较两个面，不等于毛刺的净高度。原文还建议冲隔膜时垫一块 POM 塑料板、两面夹普通纸，边缘更整齐。");

  // ---------------- 8. Pressure ----------------
  s = d.slide("CONTENT");
  s.addText("内部压力：垫片厚一点，压力就大一点", { placeholder: "title" });
  d.fig(s, "pressure", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "据 Dai & Cai 原文 Fig. 2 重绘（示意，未按比例）。", { x: 0.6, y: 5.85, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.spring },
    { kind: "why", size: 13, body: "以前弹簧、垫片随手拿。但 2032 壳内高度固定（约 3 mm），叠层越厚，弹簧压得越多。换了电极或锂片厚度，就要换垫片，让压力保持相近。" },
    { kind: "matters", size: 13, body: "压力影响接触电阻；锂金属更敏感，压力会改变锂沉积的形貌。封口压力也要固定：Luc 手动封口用 950 psi。" },
  ], 0.16, 6.85, "pressure");
  s.addNotes("弹簧就像一个被压住的床垫：留给它的空间越小，它顶得越用力。所以“用同一种弹簧”还不够，叠层总厚度也要一样。Dai 指出封口机的压力从几百到上千 psi 不等，压力太大可能把隔膜压变形、造成内短路；但不同封口机的读数不能互相比较，所以要点是在自己的设备上固定一个值和保压时间。950 psi 约等于 6.5 MPa。");

  // ---------------- 9. Electrolyte & dryness ----------------
  s = d.slide("CONTENT");
  s.addText("电解液：先算孔体积，再定量加", { placeholder: "title" });
  d.fig(s, "pore_budget", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.water },
    { kind: "why", size: 13, body: "以前常“多滴一点保险”。但过量的电解液封口时会被挤出来，每颗剩下的量不一样。所以先算孔体积，再用移液枪定量。" },
    { kind: "matters", size: 13, body: "电解液、锂盐、隔膜都要干：KF 定期测水；隔膜低于 60 °C 真空干燥；LiPF₆ 在实验室没有简便的再干燥办法。" },
  ], 0.14, 5.95, "electrolyte");
  d.quote(s, Q.sameElectrolyte);
  s.addNotes("这一页的计算用的是 Luc 原文 Table 2 的电极数据：未辊压的石墨负极 110 µm、孔隙率 60.1%，NMC111 正极 109 µm、孔隙率 51.4%，隔膜 23 µm、孔隙率 56%。算出来 3 倍孔体积约 74 µL，和原文 Table 5 里的 74.5 µL 吻合，说明原文就是这样算的。孔隙率 = 孔的体积 ÷ 涂层总体积。Dai 还提醒：4A 分子筛可以给溶剂除水，但不能放进已配好的电解液，因为会发生离子交换。");

  // ---------------- 10. Assembler & environment ----------------
  s = d.slide("CONTENT");
  s.addText("人与环境：同一个人、同样节奏、同一温度", { placeholder: "title" });
  d.fig(s, "assembler", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.temp },
    { kind: "why", size: 13, body: "以前认为组装是“体力活”，谁装都一样。Luc 指出：每个人的手法、封口力度、对齐精度都不同，电解液也在边装边挥发。" },
    { kind: "matters", size: 13, body: "固定组装者、节奏和温度，几乎不花钱，却能减掉一大块离散。" },
  ], 0.14, 5.75, "assembler");
  d.quote(s, Q.assembler);
  s.addNotes("Dai 也强调：早期很多研究在“室温”下测，可实验室昼夜和季节温差可达几度，而扣式电池又小、和环境换热很快，所以要放进恒温箱。手套箱手套上常沾着各种电池化学品，Luc 建议在手套箱手套外再戴一层干净手套；也因此镊子等工具不宜太小，否则戴两层手套不好操作。");

  // ======== Section 2 ========
  d.section("2 测几颗、怎么报离散");
  s = d.slide("DARK_SECTION");
  s.addText("2  测几颗、怎么报离散", { placeholder: "title" });
  s.addText("可用率 · 均值、标准差与变异系数 · 好组合也有离散 · 样本数 · 析因实验设计", { placeholder: "body" });
  s.addNotes("这一节用 Luc 等的 128 颗电池当例子，讲最基本的统计：不用高深的数学，只要会算平均值和标准差。");

  // ---------------- 12. Functional cells ----------------
  s = d.slide("CONTENT");
  s.addText("一颗不算数：128 颗里只有 72 颗“能用”", { placeholder: "title" });
  const fc = [5, 6, 1, 2, 3, 6, 7, 2, 5, 4, 5, 5, 6, 5, 4, 6];
  s.addChart(d.pres.charts.BAR, [{ name: "可用电池数", labels: fc.map((_, i) => `H${i + 1}`), values: fc }], {
    x: 0.5, y: 1.2, w: 6.8, h: 4.3, barDir: "col",
    chartColors: fc.map((v) => (v >= 6 ? HEX.accent2 : HEX.accent6)),
    showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 8.8, ...noGrid,
    showTitle: true, title: "每种组合 8 颗中“可用”的颗数（青色：≥ 6 颗）", showLegend: false,
  });
  d.caption(s, "数据：Luc 原文 Table 5。可用 = 化成成功并完成 30 次循环。合计 72 / 128 ≈ 56%。", { x: 0.6, y: 5.55, w: 6.7, h: 0.3 });
  d.stat(s, { x: 7.75, y: 1.2, w: 2.4, value: "56", unit: "%", label: "128 颗的平均可用率", color: "accent4" });
  d.stat(s, { x: 10.3, y: 1.2, w: 2.5, value: "5", unit: "/ 16", label: "组合达到 ≥ 6/8 可用", color: "accent2" });
  col(s, 7.75, 2.75, 5.0, [
    { kind: "hist", size: 13, body: "2016 年 Nature 调查 1500 多名科学家：七成以上重复不了别人的实验，一半以上重复不了自己的（Luc ref. 2）。" },
    { kind: "why", size: 13, body: "以前论文常只画“最好的一颗”。Luc 规定：8 颗里至少 6 颗可用，这个组合才算好。" },
    { kind: "matters", size: 13, body: "先报告“装了几颗、几颗能用”，再谈性能。可用率本身就是组装质量的指标。" },
  ], 0.14, 6.85, "functional");
  s.addNotes("H1 到 H16 是四个因素（弹簧、面积比、电解液量、隔膜层数）的 16 种组合，每种装 8 颗。即使是作者这样有经验的团队，也有 44% 的电池没能通过化成或没跑完 30 圈。最差的 H3 只有 1 颗可用。这提醒我们：如果你只装了 2 颗、其中 1 颗坏了，你根本分不清是材料问题还是组装问题。");

  // ---------------- 13. Mean, s, CV ----------------
  s = d.slide("CONTENT");
  s.addText("怎样报离散：均值、标准差、变异系数", { placeholder: "title" });
  d.fig(s, "cv_dots", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "示例数据（非原文），6 颗电池的放电容量。", { x: 0.6, y: 5.8, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：s、CV、SE", size: 13, body: "标准差 s：各颗离均值的典型距离。变异系数 CV = s ÷ 均值。标准误 SE = s ÷ √n：均值本身的误差。" },
    { kind: "hist", size: 13, body: "1890 年代 Karl Pearson 提出变异系数；1908 年 Gosset 以笔名“Student”发表 t 分布——他在 Guinness 啤酒厂，每次只有几个样本。" },
    { kind: "why", size: 13, body: "以前只画一条曲线。现在画均值 ± 误差棒，并写明 n 和误差棒是 s、SE 还是 CI。" },
    { kind: "matters", size: 13, body: "CV 没有单位，容量、内阻、效率的离散能放在一起比（下一页）。" },
  ], 0.12, 5.95, "cv");
  d.quote(s, Q.valuable);
  s.addNotes("计算 s 时分母用 n − 1 而不是 n，这叫贝塞尔校正：样本少时，用样本自己的均值会低估离散，除以 n − 1 正好补回来。s 描述“电池和电池之间差多少”，不随 n 变小；SE 描述“均值估得准不准”，n 越大越小。三种误差棒画出来差别很大，所以图注里必须写清楚是哪一种。Luc 用的 ECV（empirical coefficient of variation）就是这里的 CV。");

  // ---------------- 14. ECV results ----------------
  s = d.slide("CONTENT");
  s.addText("好组合也有离散：容量差 8–33%", { placeholder: "title" });
  const cfg = ["H2 碟/1.0/82 µL/1", "H6 碟/1.0/100 µL/1", "H7 波/1.3/100 µL/1", "H13 波/1.0/100 µL/2", "H16 碟/1.3/100 µL/2"];
  const barOpts = (title, max) => ({
    barDir: "bar", chartColors: [HEX.accent6, HEX.accent2, HEX.accent3, HEX.accent1, HEX.accent4],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: max, ...noGrid,
    showTitle: true, title, showLegend: false,
  });
  s.addChart(d.pres.charts.BAR, [{ name: "容量", labels: cfg, values: [33.1, 7.8, 14.1, 12.0, 18.7] }], { x: 0.5, y: 1.15, w: 6.1, h: 3.55, ...barOpts("放电容量的 CV（%，30 圈的中位数）", 42) });
  s.addChart(d.pres.charts.BAR, [{ name: "内阻", labels: cfg, values: [53.1, 26.1, 7.8, 13.8, 44.8] }], { x: 6.7, y: 1.15, w: 6.1, h: 3.55, ...barOpts("内阻的 CV（%，30 圈的中位数）", 66) });
  d.caption(s, "数据：Luc 原文 Table 7（中位数）。标签依次为：弹簧（碟形/波形）/ 面积比 / 电解液量 / 隔膜层数。", { x: 0.6, y: 4.75, w: 12.1, h: 0.3 });
  row3(s, 5.15, [
    { kind: "hist", body: "Luc 等每一圈算一次 CV，再取 30 圈的中位数比较 5 个达标组合（原文 Fig. 7、Table 7）。" },
    { kind: "why", body: "以前只比平均容量谁高。这里比“散不散”：同一组合里，各颗之间差多少。" },
    { kind: "matters", body: "没有一个组合样样最好：H6 容量最稳，H7 内阻和库仑效率最稳。最稳的容量也差约 8%。" },
  ], 13, 6.85, "ecv");
  s.addNotes("CV 约 8% 是什么概念？如果均值是 4 mAh，标准差约 0.3 mAh：两颗电池相差 0.5 mAh 很正常。所以别人报的容量比你高 5%，不一定是材料更好。原文 Fig. 7b 还显示：CV 随循环圈数逐渐变大，电池之间的差距会越跑越大。注意这里的 H2 是 8 颗里 6 颗可用的组合，但容量离散高达 33%。");

  // ---------------- 15. How many cells ----------------
  s = d.slide("CONTENT");
  s.addText("测几颗才够？3–10 颗，收益递减", { placeholder: "title" });
  const ns = [3, 4, 5, 6, 8, 10, 15, 20, 30];
  const tq = { 3: 4.303, 4: 3.182, 5: 2.776, 6: 2.571, 8: 2.365, 10: 2.262, 15: 2.145, 20: 2.093, 30: 2.045 };
  s.addChart(d.pres.charts.LINE, [{ name: "系数", labels: ns.map(String), values: ns.map((n) => +(tq[n] / Math.sqrt(n)).toFixed(2)) }], {
    x: 0.5, y: 1.2, w: 6.8, h: 4.1, chartColors: [HEX.accent3], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 9,
    showValue: true, dataLabelFormatCode: "0.00", dataLabelPosition: "t", ...chartText,
    valAxisMinVal: 0, valAxisMaxVal: 2.8, valAxisLabelFormatCode: "0.0", ...grid,
    ...axisTitles("电池颗数 n", "区间半宽 ÷ s"),
    showTitle: true, title: "95% 置信区间的半宽 = 系数 × s（系数 = t ÷ √n）", showLegend: false,
  });
  d.caption(s, "补充计算（非原文数据）：t 为 Student t 分布的 95% 双侧临界值，自由度 n − 1。", { x: 0.6, y: 5.35, w: 6.7, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.sample },
    { kind: "why", size: 13, body: "以前常 n = 1 或 2。从 3 颗加到 8 颗，区间缩小约 2/3；再加到 30 颗，只再缩小一半多——收益递减。" },
    { kind: "matters", size: 13, body: "写清 n、误差棒的种类；剔除了哪几颗、按什么标准剔除，也要写。" },
  ], 0.14, 5.85, "sample");
  d.quote(s, Q.sampleSize);
  s.addNotes("怎么读这张图：n = 3 时系数约 2.5，意思是均值的 95% 区间是“均值 ± 2.5 倍标准差”，非常宽；n = 8 时降到约 0.84。为什么 n 小的时候这么差？一是 √n 小，二是 t 值大——样本太少，连标准差本身都估不准。Dai 也说更深入的统计超出了他们文章的范围，但每批 3–10 颗应该成为常规。");

  // ---------------- 16. DoE ----------------
  s = d.slide("CONTENT");
  s.addText("析因实验：一次改四个因素", { placeholder: "title" });
  d.fig(s, "doe_cube", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "据 Luc 原文第 3.3 节与 Table 5 绘制。每个圆点是一种组合，各装 8 颗。", { x: 0.6, y: 5.8, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.doe },
    { kind: "why", size: 13, body: "以前一次只改一个因素。析因设计同时改四个，16 种组合就能估出每个因素和它们之间交互作用的大小。" },
    { kind: "matters", size: 13, body: "结果出人意料：四个因素的效应都在 95% 置信界（约 ±0.23）以内，都不显著。真正的干扰来自没研究的变量。" },
  ], 0.14, 5.95, "doe");
  d.quote(s, Q.qualitative);
  s.addNotes("“效应”怎么算：把某个因素取高水平的 8 种组合的可用率平均，减去取低水平的 8 种组合的平均。例如隔膜层数 D：两层的平均可用率 0.63，一层 0.50，效应 +0.125（原文 Table 6）。最大的是交互作用 ABD，0.188。这些都没超过约 0.23 的 95% 界，所以作者认为文献里常说的“关键参数”并不是这批实验里决定成败的因素。这不是说它们不重要，而是说还有更大的、没被控制的因素，比如组装手法、毛刺和压力。");

  // ======== Section 3 ========
  d.section("3 报告哪些参数");
  s = d.slide("DARK_SECTION");
  s.addText("3  报告哪些参数", { placeholder: "title" });
  s.addText("面载量与面容量 · N/P · E/C · 锂过量 · 压力与温度 · 为什么锂半电池会高估寿命", { placeholder: "body" });
  s.addNotes("可重复的另一半是“说清楚”。这一节讲论文的实验部分必须写哪些数，以及为什么不写这些数，结果可能会误导人。");

  // ---------------- 18. Parameters ----------------
  s = d.slide("CONTENT");
  s.addText("五个必须写的参数", { placeholder: "title" });
  d.fig(s, "params_cell", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "示意（未按比例）。锂的换算：3860 mAh/g × 0.534 g/cm³ ≈ 2060 mAh/cm³，即每 µm 约 0.206 mAh/cm²。", { x: 0.6, y: 5.8, w: 6.8, h: 0.45 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：N/P 与 E/C", size: 13, body: "负正极容量比 (N/P ratio)：负极面容量 ÷ 正极面容量。电解液/容量比 (E/C ratio)：每 Ah 容量用多少克电解液，单位 g/Ah。" },
    { kind: "hist", size: 13, body: Q.facts.metrics },
    { kind: "why", size: 13, body: "以前常只报 mAh/g。可 1 mg/cm² 的薄电极几乎什么数都好看。报面载量和面容量，读者才知道电极多厚、离实用多远。" },
    { kind: "matters", size: 13, body: "N/P、E/C 决定电池能“透支”多久（下两页）；压力、温度写清楚，别人才能重复。" },
  ], 0.12, 6.85, "params");
  s.addNotes("面载量 (areal loading, mg/cm²) 是每平方厘米涂了多少毫克电极材料；乘以活性物质占比和比容量，就是面容量 (areal capacity, mAh/cm²)。比方说：同样是 180 mAh/g 的正极，薄涂一层像在杯底铺一层水，厚涂像倒满一杯，后者对离子传输的要求高得多。商品电池的正极面容量一般在 3–4 mAh/cm² 左右（典型值），很多论文只有 1 mAh/cm² 上下。");

  // ---------------- 19. Lab half cell vs practical ----------------
  s = d.slide("CONTENT");
  s.addText("实验室半电池与实用电池：差多少？", { placeholder: "title" });
  d.fig(s, "half_vs_practical", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "补充计算（典型值，非原文数据）：正极 Ø12 mm、10 mg/cm²、96% 活性物、180 mAh/g；锂片 450 µm；电解液 75 µL × 约 1.25 g/mL。实用目标为 Battery500 文献中常用的值。", { x: 0.6, y: 5.8, w: 6.8, h: 0.7 });
  s.addChart(d.pres.charts.BAR, [{ name: "倍数", labels: ["N/P", "E/C", "面容量"], values: [27, 16, 0.43] }], {
    x: 7.6, y: 1.15, w: 5.2, h: 2.25, barDir: "bar", chartColors: [HEX.accent4, HEX.accent1, HEX.accent2],
    showValue: true, dataLabelFormatCode: "0.0#\"×\"", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 33, ...noGrid,
    showTitle: true, title: "实验室半电池 ÷ 实用目标", showLegend: false,
  });
  col(s, 7.75, 3.5, 5.0, [
    { kind: "hist", size: 13, body: "2016 年美国能源部成立 Battery500 联盟（PNNL 牵头）；2019 年其成员 Chen 等提出锂金属电池的测试参数（Dai ref. 19）。" },
    { kind: "why", size: 13, body: "半电池原本只为看正极，锂和电解液“管够”。但这样会掩盖锂和电解液的消耗。" },
    { kind: "matters", size: 13, body: "半电池的寿命只说明正极，不能直接当成电池的寿命。" },
  ], 0.12, 6.85, "practical");
  s.addNotes("算一下这颗“典型半电池”：正极面积 1.13 cm²，面容量 1.7 mAh/cm²，容量约 2 mAh；450 µm 的锂片约 93 mAh/cm²，N/P 约 54，按整片 15.6 mm 锂片算，锂的总量更是正极的 90 倍左右。75 µL 电解液约 94 mg，E/C 约 47 g/Ah。实用的锂金属电池目标是 N/P 约 2 以下、E/C 约 3 g/Ah 以下；商品锂离子电池的 E/C 大约在 1.3 g/Ah 左右（典型值）。电解液的质量比正极活性物质（约 11 mg）还重八倍。");

  // ---------------- 20. Li reservoir model ----------------
  s = d.slide("CONTENT");
  s.addText("为什么富锂、富液会让寿命“看起来”很长", { placeholder: "title" });
  const cyc = Array.from({ length: 51 }, (_, i) => i * 10);
  const ret = (np) => cyc.map((n) => { const r = (np - 1) / 0.01; return +(100 * (n <= r ? 1 : Math.pow(0.99, n - r))).toFixed(1); });
  s.addChart(d.pres.charts.LINE, [
    { name: "N/P ≈ 50（典型半电池）", labels: cyc.map((n) => (n % 100 === 0 ? String(n) : "")), values: ret(50) },
    { name: "N/P = 5", labels: cyc.map((n) => (n % 100 === 0 ? String(n) : "")), values: ret(5) },
    { name: "N/P = 2", labels: cyc.map((n) => (n % 100 === 0 ? String(n) : "")), values: ret(2) },
    { name: "N/P = 1", labels: cyc.map((n) => (n % 100 === 0 ? String(n) : "")), values: ret(1) },
  ], {
    x: 0.5, y: 1.2, w: 6.8, h: 4.3, chartColors: [HEX.accent2, HEX.accent3, HEX.accent1, HEX.accent4], lineSize: 3, lineDataSymbol: "none",
    valAxisMinVal: 0, valAxisMaxVal: 110, valAxisMajorUnit: 20, valAxisLabelFormatCode: "0", ...chartText, ...grid,
    catAxisLabelFrequency: 1, ...axisTitles("循环圈数", "容量保持率（%）"), ...legend, showTitle: false,
  });
  d.caption(s, "简化模型（补充计算，非原文数据）：锂的库仑效率 99%，每圈损失 1% 正极容量的锂；先消耗多余的锂（N/P − 1），用完后容量每圈乘以 0.99。", { x: 0.6, y: 5.55, w: 6.7, h: 0.6 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.coulometry },
    { kind: "why", size: 13, body: "以前看库仑效率“都 99% 以上”。可锂多到 50 倍时，每圈丢 1% 的锂完全看不出来；N/P = 1 时，同样的效率，100 圈后只剩约 37%。" },
    { kind: "matters", size: 13, body: "比较锂负极或电解液时：用薄锂（N/P 约 2–3）、少电解液，或直接测库仑效率，并报告 N/P 和 E/C。电解液的消耗同理。" },
  ], 0.14, 6.85, "reservoir");
  s.addNotes("比喻：多余的锂像一个水库。每圈“漏”掉 1% 的水，水库大时下游照样有水，看不出漏；水库小，很快就见底。所以富锂半电池跑了 500 圈容量不掉，并不能说明锂负极很好，只说明锂足够多。电解液也一样：锂每次沉积都会消耗一点电解液，富液时也看不出来。Dai 引用的 Chen 等 2019 年 Joule 论文，正是讨论这些关键参数。");

  // ======== Section 4 ========
  d.section("4 清单、校注与小结");
  // ---------------- 21. Lab checklist ----------------
  s = d.slide("CONTENT");
  s.addText("实操清单：组装前、组装中、测试中", { placeholder: "title" });
  const lists = [
    ["组装前", "E8F4F3", C.accent2, ["极片逐片称重，记下面载量", "负极比正极大一圈（如 16 / 14 mm）", "检查冲刀；毛刺面朝外", "极片、隔膜真空干燥（隔膜 < 60 °C）", "电解液定期用 KF 测水", "壳、垫片、弹簧清洗后烘干"]],
    ["组装中（步骤见第 4 章）", "F1ECF8", C.accent3, ["同一人、同一批材料一次装完", "按孔体积定量加液，每颗相同", "垫片按叠层厚度选定，全批一致", "封口压力和保压时间固定", "陶瓷/塑料镊子，正负极工具分开", "手套箱 H₂O、O₂ < 5 ppm"]],
    ["测试中", "FDF2E7", C.accent1, ["每组至少 3 颗（建议 3–10 颗）", "静置润湿时间相同（Luc：12 h）", "放恒温箱（如 25 或 30 °C）", "先化成，再测倍率和循环", "记下可用与失效的颗数", "失效电池拆开，看对齐和毛刺"]],
  ];
  lists.forEach(([h, fill, color, items], i) => {
    const w = i === 2 ? 3.85 : 3.95;
    card(s, c3[i], 1.25, w, 3.75, fill);
    s.addText(h, { x: c3[i] + 0.2, y: 1.35, w: w - 0.4, h: 0.45, fontSize: 17, bold: true, color, margin: 0, valign: "middle", isTextBox: true });
    s.addText(items.map((t, k) => ({ text: t, options: { bullet: { code: "2610" }, breakLine: k < items.length - 1 } })), { x: c3[i] + 0.2, y: 1.85, w: w - 0.35, h: 3.05, fontSize: 14, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 5, isTextBox: true });
  });
  card(s, 0.6, 5.15, 12.1, 1.7, "FBEDEC");
  s.addText("常见错误", { x: 0.8, y: 5.22, w: 4, h: 0.42, fontSize: 17, bold: true, color: C.accent4, margin: 0, valign: "middle", isTextBox: true });
  const errs = [["只挑最好的一颗画图", "不写面载量，只报 mAh/g", "换了锂片厚度却不换垫片"], ["多加电解液“保险”", "放在“室温”下测，昼夜温差几度", "实验做到一半换人组装"]];
  errs.forEach((g, i) => s.addText(g.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < g.length - 1 } })), { x: 0.8 + i * 6.0, y: 5.68, w: 5.7, h: 1.1, fontSize: 14, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 3, isTextBox: true }));
  s.addNotes("这张清单可以打印出来贴在手套箱旁。大部分条目来自 Dai & Cai 与 Luc 等两篇论文：称重和对齐（Dai p. 2）、毛刺朝外（Luc Fig. 4）、固定垫片和封口压力（Dai p. 3；Luc 950 psi）、定量加液（Dai p. 2）、手套箱 < 5 ppm 与 25–40 °C 恒温（Luc p. 14）、每批 3–10 颗（Dai p. 3）。具体的组装顺序请回看第 4 章。");

  // ---------------- 22. Reporting checklist ----------------
  s = d.slide("CONTENT");
  s.addText("报告清单：论文实验部分要写的数", { placeholder: "title" });
  const hdr = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: HEX.dk1 } } });
  const rows = [
    ["正极组成与面载量", "mg/cm²", "96:2:2；10 mg/cm²", "看出电极有多厚"],
    ["面容量", "mAh/cm²", "1.7 mAh/cm²", "和实用电池（3–4）比"],
    ["电极直径 / 面积比", "mm", "正 14 / 负 16 mm", "对齐与边缘效应"],
    ["N/P（容量比）", "—", "全电池 1.1；锂半电池 ≈ 54", "锂储备有多少"],
    ["锂片厚度", "µm", "450 µm", "锂过量多少倍"],
    ["电解液量与 E/C", "µL；g/Ah", "75 µL；≈ 47 g/Ah", "电解液储备有多少"],
    ["隔膜型号与层数", "—", "1 层 PE，23 µm", "电阻与短路风险"],
    ["弹簧、垫片、封口压力", "mm；psi", "波形弹簧 + 1 mm 垫片；950 psi", "内部压力"],
    ["温度与静置时间", "°C；h", "30 °C；静置 12 h", "反应速率与润湿"],
    ["电池数与误差棒", "n", "n = 6，均值 ± s", "结论可信度"],
  ];
  s.addTable([[hdr("参数"), hdr("单位"), hdr("例子（本章示例）"), hdr("为什么要写")], ...rows.map((r, i) => r.map((t, j) => ({ text: t, options: { bold: j === 0, fill: { color: i % 2 ? "F5F7F9" : "FFFFFF" } } })))], {
    x: 0.6, y: 1.2, w: 12.1, colW: [3.0, 1.6, 4.3, 3.2], fontSize: 13, color: HEX.dk1, fontFace: "+mn-lt",
    border: { type: "solid", pt: 0.75, color: "D5DCE2" }, fill: { color: "FFFFFF" }, rowH: 0.38, valign: "middle", margin: [0.02, 0.08, 0.02, 0.08],
  });
  d.block(s, { x: 0.6, y: 5.6, w: 12.1, kind: "matters", tint: true, size: 13, body: "Dai 还建议附上浆料粘度、粒径分布、电解液含水量等表征数据（p. 5）：它们是“电极均匀不均匀、材料干不干”的可测量证据，方便别人重复。" });
  s.addNotes("这张表的原则是：别人只读你的实验部分，就能装出一颗和你一样的电池。N/P 一定要写明是“容量比”，并说明负极容量是怎么得到的（实测还是按理论值算）。如果是锂半电池，直接写锂片厚度和直径即可，读者可以自己换算。最后一行最容易漏：画了误差棒，却不写 n 和误差棒的种类。");

  // ---------------- 23. Corrections ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文中的笔误与不一致", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const c = i % 2, r = Math.floor(i / 2);
    const bot = d.block(s, { x: c ? 6.8 : 0.6, y: 1.3 + r * 2.75, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
    if (bot > 6.85) console.warn(`WARN note ${i} bottom ${bot.toFixed(2)}`);
  });
  s.addNotes("第一条最值得注意：“N/P”这个词在扣式电池文献里有时被误用成面积比。读文献时看到 N/P，先确认它是容量比还是面积比。第二、三条不影响原文的主要结论，但如果你要引用 Table 5 的数，请用 Table 7 的数。第四条是查文献的实用提示：Dai 的正文用名字称呼作者，按姓去数据库里搜才找得到。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["差异有四类来源", "材料、设备、生产、组装者；对齐、毛刺、压力、电解液量都要固定（Luc Fig. 3；Dai）"],
    ["一颗不算数", "Luc 的 128 颗只有 56% 可用；每批 3–10 颗，报“装了几颗、几颗能用”"],
    ["用均值 ± s 和 CV 报离散", "好组合的容量 CV 也有 8–33%；写清 n 和误差棒是 s、SE 还是 CI"],
    ["报面载量、N/P、E/C、压力、温度", "锂过量约 50 倍、电解液约 15 倍的半电池，会让寿命看起来很长"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.55 + i * 1.0;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.critical.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.critical.zh}  —— ${Q.critical.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.75, w: 11.9, h: 1.15, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("一句话总结：好数据 = 固定能固定的 + 多测几颗 + 说清楚。下一章（第 6 章）从扣式电池走向软包电池：叠片、注液、化成，以及多层电极里 N/P 怎样确定——那里的可重复性问题更多，Dai 也提醒，手工软包的步骤比扣式电池多，误差来源也更多。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
