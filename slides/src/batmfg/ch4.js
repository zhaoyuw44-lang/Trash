// 锂电池制造 — 第 4 章：实验室扣式电池——组装与测试
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch4_quotes");

const PAPER = {
  short: "锂电池制造",
  full: "本章原始文献：A. Kayyar, J. Huang, M. Samiee, J. Luo, Construction and Testing of Coin Cells of Lithium Ion Batteries, J. Vis. Exp. (66), e4104 (2012)；M. Stein IV, C.-F. Chen, D. J. Robles, C. Rhodes, P. P. Mukherjee, Non-aqueous Electrode Processing and Construction of Lithium-ion Coin Cells, J. Vis. Exp. (108), e53490 (2016)（电池组装部分）；P.-M. Luc, S. Bauer, J. Kowal, Reproducible Production of Lithium-Ion Coin Cells, Energies 15, 7949 (2022)（制作流程部分）。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch4_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 4, chapterTitle: "实验室扣式电池：组装与测试", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
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
  s.addText("第 4 章\n亲手做一颗扣式电池", { placeholder: "title" });
  s.addText("实验室扣式电池：组装与测试", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.45, w: 7.6, h: 1.5, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("前三章我们做出了极片：配浆料、涂布、干燥、辊压。这一章把极片装进一颗硬币大小的电池里，并做第一组电化学测试。三篇主要文献都是“手把手”的操作指南：Kayyar 2012 和 Stein 2016 是 JoVE 视频文章，Luc 2022 则从可重复生产的角度检查了组装细节。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "扣式电池的构造", "CR2032 的名字、每个零件的作用"],
    ["2", "手套箱", "为什么用氩气、H₂O/O₂ 要低到几 ppm"],
    ["3", "备料与组装", "冲片、称重、隔膜、电解液、对齐、封口"],
    ["4", "第一次测试", "半电池与全电池、C 倍率、首圈、倍率与循环"],
    ["5", "实操清单、校注与小结", "照着做的步骤，常见错误，原文出入"],
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
    { text: "干燥太快，粘结剂和炭黑会“浮”到表面", options: { bullet: true, breakLine: true } },
    { text: "辊压 (calendering) 调孔隙率和压实密度", options: { bullet: true, breakLine: true } },
    { text: "厚电极、干法电极等新工艺", options: { bullet: true } },
  ], { x: 7.65, y: 2.0, w: 4.9, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.05, 5.3, 2.65, "E8F4F3");
  s.addText("本章问题", { x: 7.65, y: 4.17, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText([
    { text: "一片极片怎样变成一颗能测的电池？", options: { bullet: true, breakLine: true } },
    { text: "为什么必须在手套箱里装？", options: { bullet: true, breakLine: true } },
    { text: "第一组数据（首圈、倍率、循环）怎么读？", options: { bullet: true } },
  ], { x: 7.65, y: 4.65, w: 4.9, h: 1.9, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("这一章是全系列最“动手”的一章。学完以后，你应该能照着清单在实验室装出第一批扣式电池。扣式电池结果的统计和该报告哪些参数，放到第 5 章讲；扣式电池和工厂软包电池的差别，放到第 6 章讲。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从纽扣电池到实验室扣式电池", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "三条线：做纽扣电池的工业（橙），搭手套箱等实验工具（紫），理解电池化学（青）。实验室扣式电池把它们拼在一起。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "扣式电池的“规矩”大多是经验，直到 2010 年代才有人系统写成教程、检验可重复性。" });
  s.addNotes("时间轴不按比例。注意：扣式电池外壳最早是为商品一次电池设计的，实验室只是借用。手套箱最初也不是为电池发明的，而是为了处理放射性物质。2011 年 Dahn 组的指南（Stein 文献 21）和本章三篇文章，都是想把“师傅带徒弟”的手艺写成可以照做的步骤。");

  // ======== Section 1 ========
  d.section("1 扣式电池的构造");
  s = d.slide("DARK_SECTION");
  s.addText("1  扣式电池：硬币里的一块“三明治”", { placeholder: "title" });
  s.addText("CR2032 的名字 · 纽扣电池的来历 · 爆炸图：每个零件干什么", { placeholder: "body" });
  s.addNotes("扣式电池 (coin cell) 里只有一层“正极–隔膜–负极”三明治。Stein 2016 的说法：手机、电动车里的电池是很大的三明治卷起来或叠起来，扣式电池只有一块。");

  // ---------------- 5. CR2032 ----------------
  s = d.slide("CONTENT");
  s.addText("CR2032：名字里的四个信息", { placeholder: "title" });
  d.fig(s, "cr2032_naming", { x: 0.5, y: 1.2, w: 6.9, h: 4.1 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.coin },
    { kind: "why", size: 13, body: "以前测新材料要自己做玻璃电池或大电池，费料又难密封。买现成的标准钢壳，几分钟就能手工装好一颗，材料只要几毫克。" },
    { kind: "matters", size: 13, body: "尺寸统一，各实验室的零件可以通用。但“同一种壳”不等于“同一种电池”，里面怎么装才是关键。" },
  ], 0.15, 5.38, "cr2032");
  d.quote(s, Q.coinWidely);
  s.addNotes("命名规则来自国际标准 IEC 60086：第一个字母是化学体系（C 为锂/二氧化锰，B 为锂/氟化碳），R 表示圆形，前两位数字是直径（mm），后两位是高度（0.1 mm）。所以 CR2032 = 直径 20 mm、高 3.2 mm。Luc 2022 也确认 R2032 是最常用的尺寸。");

  // ---------------- 6. Exploded view ----------------
  s = d.slide("CONTENT");
  s.addText("爆炸图：一颗扣式电池的 8 个零件", { placeholder: "title" });
  d.fig(s, "exploded", { x: 0.45, y: 1.15, w: 6.75, h: 5.6 });
  col(s, 7.55, 1.3, 5.2, [
    { kind: "def", head: "垫片 + 弹片：把叠层压紧", size: 13, body: "壳内空间比电极厚得多。垫片 (spacer) 填满空间，弹片 (spring) 像床垫弹簧，让叠层受到均匀、恒定的压力。" },
    { kind: "hist", size: 13, body: Q.facts.parts },
    { kind: "why", size: 13, body: "以前只靠壳压住电极，接触时好时坏。加了弹片，电极在充放电中胀缩时仍能保持接触。" },
    { kind: "matters", size: 13, body: "缺一个零件、放反一个零件，电池就可能短路或断路。" },
  ], 0.14, 6.85, "exploded");
  d.caption(s, "据 Kayyar 2012 Fig. 2、Stein 2016 Fig. 2、Luc 2022 Fig. 2a 综合重绘（示意，未按比例）。", { x: 0.6, y: 6.6, w: 6.6, h: 0.3 });
  s.addNotes("约定：大的杯子叫正极壳 (case)，是正端子；小的盖子叫负极盖 (cap)，和密封圈一起扣上。半电池里正极片放在正极壳里，锂片在盖子一侧。密封圈除了密封，还把正、负两极隔开，否则外壳本身就短路了。");

  // ======== Section 2 ========
  d.section("2 手套箱");
  s = d.slide("DARK_SECTION");
  s.addText("2  手套箱：给锂一个没有水和氧的家", { placeholder: "title" });
  s.addText("为什么用氩气 · 净化原理 · ppm 是多少 · 过渡舱怎么用", { placeholder: "body" });
  s.addNotes("锂金属和 LiPF₆ 电解液都怕水、怕氧，所以扣式电池必须在充氩气的手套箱 (glovebox) 里组装。");

  // ---------------- 8. Glovebox ----------------
  s = d.slide("CONTENT");
  s.addText("手套箱：为什么是氩气", { placeholder: "title" });
  d.fig(s, "glovebox", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.glovebox },
    { kind: "why", size: 13, body: "空气里的水和氧会和锂反应。氮气也不行：锂在室温就能和 N₂ 生成 Li₃N。氩气是惰性气体，又比空气重，是最稳妥的选择。" },
    { kind: "matters", size: 13, body: "LiPF₆ 遇水会分解出 HF，腐蚀正极、破坏 SEI。箱内的水和氧越少，测出的才是材料本身的性能。" },
  ], 0.16, 6.85, "glovebox");
  s.addNotes("净化原理：风机让箱内气体不停流过净化柱。柱里的铜催化剂把 O₂ 变成氧化铜“吃掉”，分子筛像海绵一样吸水。柱子吸饱后要“再生”：通入含少量氢气的氩气，把氧化铜还原回铜，同时加热赶走分子筛里的水。");

  // ---------------- 9. ppm ----------------
  s = d.slide("CONTENT");
  s.addText("ppm 有多少？手套箱比空气干净几万倍", { placeholder: "title" });
  d.fig(s, "ppm_ladder", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：ppm", size: 13, body: "parts per million，百万分之一。0.5 ppm 的水，就是 200 万个气体分子里只有 1 个水分子。" },
    { kind: "hist", size: 13, body: Q.facts.ppm },
    { kind: "why", size: 13, body: "过渡舱是“气闸”：东西进箱前反复抽真空、充氩，赶走空气和吸附的水。" },
    { kind: "matters", size: 13, body: "读数是手套箱的“体温计”：每次组装前先看一眼，偏高就先查原因，别急着装电池。" },
  ], 0.15, 5.95, "ppm");
  d.quote(s, Q.glovebox3x);
  s.addNotes("两篇文献的数字相差 10 倍：Stein 要求低于 0.5 ppm，Luc 建议低于 5 ppm。现代手套箱正常运行时多在 1 ppm 以下（典型值）。读数突然升高，常见原因是手套破了、过渡舱没抽好、或者带进了没烘干的纸巾和塑料。工厂的干燥间 (dry room) 露点约 −40 °C，相当于一百多 ppm 的水，第 6 章再讲。");

  // ======== Section 3 ========
  d.section("3 备料与组装");
  s = d.slide("DARK_SECTION");
  s.addText("3  备料与组装", { placeholder: "title" });
  s.addText("冲片与毛刺 · 干燥与称重 · 隔膜 · 电解液 · 对齐 · 封口", { placeholder: "body" });
  s.addNotes("这一节按操作顺序走一遍：先把极片冲成圆片、烘干、称重；再准备隔膜和电解液；最后在手套箱里组装、封口。");

  // ---------------- 11. Punching ----------------
  s = d.slide("CONTENT");
  s.addText("冲片：小心看不见的毛刺 (burr)", { placeholder: "title" });
  d.fig(s, "burr", { x: 0.5, y: 1.2, w: 6.9, h: 4.4 });
  d.caption(s, "据 Luc 2022 Fig. 4 重绘；高度数据见其 Table 3（激光扫描显微镜）。", { x: 0.6, y: 5.6, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.punch },
    { kind: "why", size: 13, body: "以前用剪刀剪，面积不准。冲片面积固定，但剪切会留下毛刺。所以要检查刀口，并让毛刺朝外。" },
    { kind: "matters", size: 13, body: "毛刺可能刺穿隔膜，造成微短路，测出来的“坏材料”其实是坏冲片。" },
  ], 0.15, 6.0, "punch");
  d.quote(s, Q.burr);
  s.addNotes("冲片的手法：Stein 把极片放在干净的铝板上，用手按住冲头，沿边缘“滚”一圈施压，冲出整齐的边。边缘区域涂层往往不均匀，要从片子中间冲。Luc 的结论：切电极用精密切片机最好；切很软的隔膜，空心冲反而更合适，可以把隔膜夹在两张纸之间冲。");

  // ---------------- 12. Drying and weighing ----------------
  s = d.slide("CONTENT");
  s.addText("干燥与称重：算出这颗电池的容量", { placeholder: "title" });
  d.fig(s, "mass_calc", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "计算步骤据 Kayyar 2012 p. 2 与 Stein 2016 p. 4 绘制，数值取自 Stein 的例子。", { x: 0.6, y: 5.9, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "公式：Q = (W_ED − W_CC) × f × c", size: 13, body: "W_ED：带涂层圆片的质量；W_CC：同尺寸空箔的质量；f：活性物质占比；c：额定比容量 (mAh/g)；Q：这片电极的容量。" },
    { kind: "hist", size: 13, body: Q.facts.dry },
    { kind: "why", size: 13, body: "冲片后表面会再吸水。进箱前再真空烘一次，然后马上称重，量到的才是干极片。" },
    { kind: "matters", size: 13, body: "容量算错，后面所有电流和“mAh/g”都跟着错。" },
  ], 0.14, 6.85, "mass");
  s.addNotes("为什么要称一片空箔？因为集流体的质量占了整片的大半（Stein 的例子里 5.4 mg 中只有 3.6 mg 是涂层）。只称涂层片、再估一个箔重，误差会很大。涂层越薄，这个问题越严重，第 5 章会讲称重误差怎样影响结果。干燥本身（为什么分两段、为什么不能太快）见第 3 章。");

  // ---------------- 13. Separator ----------------
  s = d.slide("CONTENT");
  s.addText("隔膜：隔开电子，放行离子", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "厚度", labels: ["Freudenberg FS3002（Luc）", "PP/PE/PP 三层膜（Long 2016）", "冲片毛刺（Luc 实测最大）", "正极涂层（Luc）", "玻璃纤维隔膜（Whatman）"], values: [23, 25, 85, 109, 260] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent2, HEX.accent2, HEX.accent4, HEX.accent6, HEX.accent3],
    showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 310, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "厚度对比（µm）", showLegend: false,
  });
  d.caption(s, "数据：Luc 2022 p. 2、p. 4 与 Table 1–3。Kayyar 用两层 Ø19 mm Celgard，Stein 用一层 ¾ 英寸 Celgard。", { x: 0.6, y: 5.7, w: 6.6, h: 0.6 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.separator },
    { kind: "why", size: 13, body: "厚隔膜、多层隔膜不容易被毛刺或错位刺穿，成功率高；但离子路程变长，电阻变大，还要更多电解液。" },
    { kind: "matters", size: 13, body: "隔膜要比两个电极都大一圈。Luc 结果最稳的一组只用了一层隔膜。" },
  ], 0.16, 6.85, "separator");
  s.addNotes("隔膜 (separator) 是多孔塑料薄膜：孔里充满电解液，离子能穿过；膜本身绝缘，电子过不去。商品电池里隔膜只有约 20 µm（Luc p. 2）。实验室常用很厚的玻璃纤维膜，好装但和真实电池差别大，这一点第 5 章还会讨论。冲隔膜时，Stein 把膜夹在折起的打印纸里冲。");

  // ---------------- 14. Electrolyte ----------------
  s = d.slide("CONTENT");
  s.addText("电解液：加多少才合适？", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "电解液量", labels: ["电极 + 隔膜的孔体积（Luc，计算）", "Murray 2019（约 40 mg，换算）", "Hu 2021", "Luc 2022 最佳组合", "Stein 2016（灌满）"], values: [25, 32, 70, 100, 700] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent2, HEX.accent2, HEX.accent1, HEX.accent4],
    showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 820, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "每颗扣式电池的电解液（µL）", showLegend: false,
  });
  d.caption(s, "Murray、Hu 的数据引自 Luc 2022 Table 1；mg 换 µL 按密度约 1.25 g/mL（典型值）。孔体积用 Luc 的电极参数（Table 2）计算。", { x: 0.6, y: 5.7, w: 6.6, h: 0.6 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "孔体积：V = A × t × ε", size: 13, body: "A：面积；t：厚度；ε：孔隙率。Luc 的 Ø14 正极：1.54 cm² × 0.0109 cm × 0.514 ≈ 8.6 µL。加上负极和隔膜共约 25 µL，3 倍约 75 µL。" },
    { kind: "hist", size: 13, body: Q.facts.electrolyte },
    { kind: "why", size: 13, body: "加太少，孔没填满，局部“干”掉；加太多，副反应和测量都被放大。Luc 用“至少 3 倍孔体积，最多 100 µL”。" },
    { kind: "matters", size: 13, body: "用移液枪定量，每颗电池才一样；电解液量本身也会改变寿命结论（第 5 章）。" },
  ], 0.15, 6.85, "electrolyte");
  s.addNotes("Luc 表 5 里的 74.5、82.4、91.2 µL 正好就是不同电极尺寸和隔膜层数时的“3 倍孔体积”，可以用左边的公式自己验算。Stein 把电池“灌满到凸起的弯月面”，约 0.7 mL，是孔体积的二十多倍，封口时多余的会被挤出来。Kayyar 用“滴”计量，没有给体积。用移液枪定量，才能让每颗电池一样。电解液量和电池容量的比值 (E/C) 怎样影响结论，见第 5 章。");

  // ---------------- 15. Assembly order ----------------
  s = d.slide("CONTENT");
  s.addText("组装顺序：三篇文献，三种装法", { placeholder: "title" });
  d.fig(s, "assembly_compare", { x: 0.6, y: 1.02, w: 12.1, h: 3.8 });
  d.caption(s, "据 Kayyar 2012 Fig. 2 与 p. 2、Stein 2016 Fig. 2 与 p. 4、Luc 2022 Fig. 2a 重绘；条长按直径（mm）缩放，箭头为放置顺序。", { x: 0.6, y: 4.86, w: 12.1, h: 0.3 });
  row3(s, 5.2, [
    { kind: "hist", body: Q.facts.assembly },
    { kind: "why", body: "没有统一标准，各组按经验装。Luc 建议：两个方向都试一下，选顺手的，然后整个实验不再改。" },
    { kind: "matters", body: "这些差别都会改变结果，写论文时要把顺序、尺寸、用量写清楚（第 5 章）。" },
  ], 13, 6.88, "assembly");
  s.addNotes("几个值得注意的细节：Kayyar 的正极只有 8 mm，锂片 12.7 mm，隔膜 19 mm，层层变大；Stein 在 Ø12.7 正极上放 Ø14.3 锂片；Luc 的石墨负极 16 mm，正极 14 或 16 mm。电解液滴在每一层之间，赶走气泡。Stein 的经验：放好隔膜后用镊子平的一面把气泡推出去，再轻敲壳边让正极回到正中。");

  // ---------------- 16. Crimping ----------------
  s = d.slide("CONTENT");
  s.addText("封口 (crimping)：一压定成败", { placeholder: "title" });
  d.fig(s, "crimp", { x: 0.5, y: 1.25, w: 6.9, h: 4.0 });
  d.caption(s, "示意：参考 Kayyar 2012 Fig. 5、Stein 2016 Fig. 4 中封好与没封好的电池照片。", { x: 0.6, y: 5.3, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.crimp },
    { kind: "why", size: 13, body: "壳边被模具向内卷，压扁密封圈，把电池封死。压力太小会漏气，太大会压坏电池，所以要固定一个压力。" },
    { kind: "matters", size: 13, body: "没封好的电池，几小时后锂吸水膨胀，电池会自己“弹开”。" },
  ], 0.16, 5.95, "crimp");
  d.quote(s, Q.crimp);
  s.addNotes("封口机上的“900 psi”“950 psi”一般是液压表的读数，不是电极实际受到的压力，换一台机器数字就不能直接照搬。封好后要做三件事：用纸巾擦掉挤出的电解液；用塑料镊子拿电池（金属镊子会把正负极连起来造成短路）；看一眼边缘有没有压歪、开裂。");

  // ======== Section 4 ========
  d.section("4 第一次测试");
  s = d.slide("DARK_SECTION");
  s.addText("4  第一次测试", { placeholder: "title" });
  s.addText("半电池与全电池 · C 倍率 · 开路电压与首圈 · 倍率测试与循环", { placeholder: "body" });
  s.addNotes("电池装好后，接到电池测试仪 (battery cycler) 上。先测开路电压，再按设定的电流充放电。");

  // ---------------- 18. Half vs full ----------------
  s = d.slide("CONTENT");
  s.addText("半电池与全电池：对面放的是什么", { placeholder: "title" });
  d.fig(s, "half_full", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：半电池 / 全电池", size: 13, body: "半电池 (half cell)：被测电极对一大片锂。全电池 (full cell)：正极对真正的负极（如石墨）。" },
    { kind: "hist", size: 13, body: Q.facts.half },
    { kind: "why", size: 13, body: "锂几乎用不完、电压稳，适合单独看一种材料。" },
    { kind: "matters", size: 13, body: "锂过量掩盖了锂的损耗：半电池寿命长，不等于全电池寿命长。" },
  ], 0.13, 5.75, "halffull");
  d.quote(s, Q.alignment);
  s.addNotes("左下的 248 mAh 是这样算的：Stein 的锂片直径 9/16 英寸（14.3 mm）、厚 0.75 mm，体积约 0.12 cm³，锂密度 0.534 g/cm³，约 64 mg，乘以锂的比容量 3860 mAh/g。正极只有 0.39 mAh，锂多了约 600 倍。全电池里负极要比正极稍大一点，面积和容量都留余量，否则锂会在负极边缘析出。负极与正极的容量比 (N/P ratio) 怎样定，见第 5、6 章。");

  // ---------------- 19. C-rate ----------------
  s = d.slide("CONTENT");
  s.addText("C 倍率：电流的“相对单位”", { placeholder: "title" });
  d.fig(s, "crate", { x: 0.5, y: 1.2, w: 6.9, h: 4.65 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "公式：I = n × Q", size: 13, body: "Q：电池容量 (mAh)；n：倍率；I：电流 (mA)。nC 表示约 1/n 小时充满或放完。1C 用 1 小时，C/10 用 10 小时，2C 用 30 分钟。" },
    { kind: "hist", size: 13, body: Q.facts.crate },
    { kind: "why", size: 13, body: "电极大小不同，mA 数没法比较。用 C 倍率，大电池和小扣电可以用同一把尺子比快慢。" },
    { kind: "matters", size: 13, body: "C 倍率由你选的“额定容量”决定。基准选错，所有倍率都错（见阅读校注）。" },
  ], 0.15, 6.85, "crate");
  s.addNotes("举例：Stein 的电极容量 0.39 mAh，所以 1C = 0.39 mA。一个比喻：容量是一桶水，C 倍率是水龙头开多大。开得越大（倍率越高），越快放完，但电池里的“管道”（离子扩散）跟不上，能放出的水就变少。很多论文也用 mA/g 或 mA/cm² 表示电流，换算时同样要知道容量。");

  // ---------------- 20. OCV and first cycle ----------------
  s = d.slide("CONTENT");
  s.addText("开路电压与首圈：电池的第一张“体检单”", { placeholder: "title" });
  d.fig(s, "first_cycle", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "据 Kayyar 2012 Fig. 3 重绘（读图，近似）：LiCoO₂/Li 半电池，C/5，3.0–4.3 V。", { x: 0.6, y: 5.8, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：开路电压 OCV", size: 13, body: "不通电流时两极之间的电压 (open circuit voltage)。刚装好时测一下：为正、数值合理，说明接线对、没短路。" },
    { kind: "hist", size: 13, body: Q.facts.formation },
    { kind: "why", size: 13, body: "Kayyar 装好只静置 1 h；Luc 在 30 °C 静置 12 h，让电解液渗满孔，再用 C/10 恒流恒压 (CCCV) 化成。" },
    { kind: "matters", size: 13, body: "首圈库仑效率 = 放电 ÷ 充电。Kayyar 的 LiCoO₂：140 ÷ 155 ≈ 90%，少掉的 10% 回不来。" },
  ], 0.15, 6.85, "first");
  s.addNotes("首圈库仑效率 (Coulombic efficiency, CE) = 放电容量 ÷ 充电容量。Kayyar 的 LiCoO₂ 首充 155、首放 140 mAh/g，首效约 90%。少掉的 10% 不会再回来，叫首圈不可逆容量。之后各圈的效率应接近 99.9% 以上。OCV 接近 0 V，往往是短路；OCV 读成负值，多半是接线接反了（Stein 的提醒）。");

  // ---------------- 21. Rate and cycling ----------------
  s = d.slide("CONTENT");
  s.addText("倍率测试与长循环：Stein 2016 的例子", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [
    { name: "正常两段干燥", labels: ["C/10", "C/5", "1C", "2C", "5C", "10C"], values: [150, 147, 135, 126, 107, 86] },
    { name: "干燥过快", labels: ["C/10", "C/5", "1C", "2C", "5C", "10C"], values: [136, 133, 116, 105, 83, 51] },
  ], {
    x: 0.6, y: 1.2, w: 6.0, h: 3.45, barDir: "col", barGrouping: "clustered",
    chartColors: [HEX.accent2, HEX.accent4], showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 175, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt",
    showTitle: true, title: "倍率测试：放电比容量（mAh/g）",
  });
  const cyc = ["0", "20", "40", "60", "80", "100"];
  s.addChart(d.pres.charts.LINE, [
    { name: "正常两段干燥", labels: cyc, values: [133, 132, 130, 128, 125, 121] },
    { name: "干燥过快", labels: cyc, values: [115, 113, 110, 106, 99, 91] },
  ], {
    x: 6.8, y: 1.2, w: 5.9, h: 3.45, chartColors: [HEX.accent2, HEX.accent4], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 7, ...chartText,
    showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt",
    valAxisMinVal: 80, valAxisMaxVal: 140, valAxisLabelFontSize: 12, valGridLine: { color: "E3E8ED", size: 0.5 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "1C 循环圈数", catAxisTitleFontSize: 12,
    showTitle: true, title: "1C 长循环：放电比容量（mAh/g）",
  });
  d.caption(s, "据 Stein 2016 Fig. 6 读图（近似）：NMC/Li 半电池，室温，2.8–4.2 V。两段干燥与干燥过快的区别见第 3 章。", { x: 0.6, y: 4.68, w: 12.1, h: 0.3 });
  row3(s, 5.08, [
    { kind: "hist", body: Q.facts.rate },
    { kind: "why", body: "倍率越高，离子来不及扩散，能放出的容量越少。倍率测试回答“能多快”，长循环回答“能用多久”。" },
    { kind: "matters", body: "容量保持率 = 最后 5 圈平均 ÷ 最初 5 圈平均。这里约 91% 对 79%：同样的材料，制片好坏差很多。" },
  ], 13, 6.88, "rate");
  s.addNotes("倍率测试的读法：每个台阶是同一倍率下的几圈，台阶越往右越低。好的材料在高倍率下掉得慢。Stein 的例子里，同一种 NMC，只是干燥方式不同，10C 时容量差了将近一倍。这提醒我们：扣式电池测的是“材料 + 制片 + 组装”的总和，不只是材料。保持率数字是读图估算的。");

  // ======== Section 5 ========
  d.section("5 实操、校注与小结");
  s = d.slide("CONTENT");
  s.addText("实操清单 / 常见错误", { placeholder: "title" });
  card(s, 0.6, 1.25, 6.0, 5.55, "E8F4F3");
  s.addText("实操清单（照顺序做）", { x: 0.85, y: 1.35, w: 5.6, h: 0.42, fontSize: 17, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  const todo = [
    "从涂层均匀的中间区冲片；同尺寸空箔也冲几片",
    "极片 120 °C 真空烘一夜；壳、垫片、纸巾也烘",
    "称重到 0.1 mg，算出 Q 和 1C 电流，记下编号",
    "过渡舱抽真空–充氩 3–5 次；看 H₂O/O₂ 读数",
    "外层再戴一副手套；每种材料用自己的镊子",
    "按固定顺序放零件；电解液用移液枪定量",
    "负极比正极大一圈，对中；隔膜盖住两边",
    "固定压力封口；擦净；塑料镊子取出",
    "量 OCV → 静置 6–12 h → 小电流化成 → 再测",
    "每个条件至少装几颗；记录所有参数（第 5 章）",
  ];
  s.addText(todo.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < todo.length - 1 } })),
    { x: 0.85, y: 1.85, w: 5.6, h: 4.85, fontSize: 14, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 5, isTextBox: true });
  card(s, 6.85, 1.25, 5.85, 5.55, "FBEDEC");
  s.addText("常见错误 → 后果", { x: 7.1, y: 1.35, w: 5.4, h: 0.42, fontSize: 17, bold: true, color: C.accent4, margin: 0, isTextBox: true });
  const errs = [
    ["毛刺朝向隔膜、电极没对中", "微短路：OCV 低、效率低"],
    ["正极片放反（铝箔朝上）", "几乎没有容量"],
    ["金属镊子碰到壳和盖", "封好的电池被短路"],
    ["电解液凭“滴”加、每颗不同", "结果分散，无法比较"],
    ["没烘干就进箱", "箱内水分升高，首效变低"],
    ["封口压力不稳、模具不对中", "漏液、几小时后电池弹开"],
    ["按理论容量定 1C", "实际电流偏大，倍率被低估"],
  ];
  errs.forEach(([e, r], i) => {
    const y = 1.88 + i * 0.68;
    s.addText(e, { x: 7.1, y, w: 5.4, h: 0.32, fontSize: 14, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText("→ " + r, { x: 7.1, y: y + 0.31, w: 5.4, h: 0.3, fontSize: 13, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addNotes("这张清单综合了三篇文献：烘干和称重来自 Stein，过渡舱和塑料镊子来自 Kayyar 与 Stein，固定顺序、定量电解液、毛刺朝外、外层手套来自 Luc。Luc 还建议：每位新手先装约 50 颗电池练手，同一个实验中途不要换人装。Stein 的经验是：在手套箱里做一件事，要预留箱外 3 倍的时间。");

  // ---------------- 23. Corrections ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文出入与常见说法", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const c = i % 3, r = Math.floor(i / 3);
    const bot = d.block(s, { x: c3[c], y: 1.3 + r * 2.6, w: c === 2 ? 3.85 : 3.95, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
    if (bot > (r === 0 ? 4.0 : 6.85)) console.warn(`WARN note ${i} bottom ${bot.toFixed(2)}`);
  });
  s.addNotes("第一条最容易误导人：同样叫 N/P，有人指面积比，有人指容量比，读文献时一定要看清定义。第二、三条都和 C 倍率的基准有关：先确定用哪个比容量，再定电流，并在论文里写出来。最后两条是实验室里流传的说法，不算原文错误，但值得知道背后的原因。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["CR2032 = 直径 20 mm、高 3.2 mm 的标准壳", "8 个零件：壳、正极、隔膜、密封圈、负极、垫片、弹片、盖；弹片和垫片负责压紧"],
    ["手套箱：氩气，H₂O、O₂ 低于约 0.5–5 ppm", "N₂ 也不行（生成 Li₃N）；东西进箱前要烘干、过渡舱要抽换气"],
    ["备料与组装：冲片、称重、定量、对齐、封口", "毛刺朝外；称到 0.1 mg；电解液约 3 倍孔体积；负极大一圈；固定封口压力"],
    ["测试：OCV → 化成 → 倍率 → 循环", "C 倍率以实用比容量为基准；半电池锂过量数百倍，全电池更接近真实（第 5、6 章）"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.qualitative.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.qualitative.zh}  —— ${Q.qualitative.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("Luc 这句话很诚实：他们检验的四个因素（弹片类型、电解液量、隔膜层数、面积比）都没有显著影响“能用的电池有几颗”，而 16 组共 128 颗电池里只有约 56% 合格（据其 Table 5 合计）。说明扣式电池还有没找到的“隐藏变量”。下一章就专门讲：怎样让扣式电池数据可信——要装几颗、怎么统计、论文里该报告什么。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
