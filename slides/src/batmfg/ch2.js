// 锂电池制造 — 第 2 章：电极制备 I——从粉末到浆料，再到涂层
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch2_quotes");

const PAPER = {
  short: "锂电池制造",
  full: "本章原始文献：J. Li, J. Fleetwood, W. B. Hawley, W. Kays, From Materials to Cell: State-of-the-Art and Prospective Technologies for Lithium-Ion Battery Electrode Processing, Chem. Rev. 122, 903–956 (2022)（第 2、3.1–3.3、4.1–4.2 节）；M. Stein IV, C.-F. Chen, D. J. Robles, C. Rhodes, P. P. Mukherjee, Non-aqueous Electrode Processing and Construction of Lithium-ion Coin Cells, J. Vis. Exp. (108), e53490 (2016)（电极制备部分）。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch2_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 2, chapterTitle: "电极制备 I：从粉末到浆料，再到涂层", figDir });
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
  s.addText("第 2 章\n从粉末到浆料，再到涂层", { placeholder: "title" });
  s.addText("电极制备 I：配方、混合、流变与涂布", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.45, w: 7.6, h: 1.5, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("这一章讲电极制造的前半段：把几种粉末调成浆料，再把浆料均匀地涂到金属箔上，直到得到一层湿膜为止。干燥、辊压和干法电极留到第 3 章。我们读两篇文献：Li 等 2022 年的 Chem. Rev. 综述讲工厂怎么做，Stein 等 2016 年的 JoVE 视频文章讲实验室怎么做。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "配方：电极里有什么", "活性物质、导电剂、粘结剂；PVDF/NMP 与 CMC/SBR/水"],
    ["2", "混合：把粉末变成浆料", "打散团聚、加料顺序、从研钵到双螺杆"],
    ["3", "流变：浆料要多稠", "粘度、剪切变稀、怎样检查浆料"],
    ["4", "涂布：刷出均匀的薄层", "刮刀、逗号刮刀、狭缝；面密度与缺陷"],
    ["5", "校注与小结", "原文笔误、实验室常见误解、本章要点"],
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
    { text: "电池制造三大段：电极 → 电芯组装 → 化成老化", options: { bullet: true, breakLine: true } },
    { text: "工厂卷对卷 (roll-to-roll) 连续生产，实验室手工小批量", options: { bullet: true, breakLine: true } },
    { text: "1991 年 Sony 借用了磁带涂布的经验", options: { bullet: true } },
  ], { x: 7.65, y: 2.0, w: 4.9, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.05, 5.3, 2.65, "E8F4F3");
  s.addText("本章问题", { x: 7.65, y: 4.17, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText([
    { text: "一张电极片由哪些成分组成？各管什么？", options: { bullet: true, breakLine: true } },
    { text: "为什么正极用 NMP，负极却能用水？", options: { bullet: true, breakLine: true } },
    { text: "浆料要多稠？怎样涂得又薄又匀？", options: { bullet: true } },
  ], { x: 7.65, y: 4.65, w: 4.9, h: 1.9, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("第 1 章给出了全景：电极制造是整条链的第一段，也是最像“化工”的一段。本章按工序顺序走：先定配方，再混合成浆料，再理解浆料的流动性，最后涂布。每一步都对比实验室和工厂的做法。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：调浆与涂布从哪里来", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "锂电池电极的做法大多是“借来的”：复合电极来自干电池和铅酸电池，涂布来自造纸、胶片和磁带，流变学来自油漆和塑料。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "知道来历，就知道该去哪个行业找答案：浆料问题可以查涂料文献，涂布缺陷可以查胶片涂布的书。" });
  s.addNotes("时间轴不按比例。1950 年代和 2000 年代两个节点只写到年代，因为它们是一个行业的逐步转变，没有单一的“发明日”。2018 年是欧盟通过 NMP 限制条例的年份，2020 年 5 月起执行。");

  // ======== Section 1 ========
  d.section("1 配方");
  s = d.slide("DARK_SECTION");
  s.addText("1  配方：电极里有什么", { placeholder: "title" });
  s.addText("三种固体成分 · 实验室与工厂的配方 · 导电剂 · 粘结剂 · PVDF/NMP 与 CMC/SBR/水", { placeholder: "body" });
  s.addNotes("做电极的第一步是称量。称什么、称多少，就是配方。这一节先讲每种成分的作用，再讲两套粘结剂和溶剂体系。");

  // ---------------- 5. Composition ----------------
  s = d.slide("CONTENT");
  s.addText("一张电极片：三种固体 + 孔隙 + 金属箔", { placeholder: "title" });
  d.fig(s, "electrode_cross", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.composite },
    { kind: "why", size: 13, body: "干电池、铅酸电池把粉末压成块或抹成膏。锂电池要薄、要匀、还要能卷，所以改成“调浆 + 涂布”，像刷墙一样刷一层薄漆。" },
    { kind: "matters", size: 13, body: "只有活性物质存锂，其余都是“死重”。但没有它们，电子和离子到不了每个颗粒。" },
  ], 0.14, 5.75, "composition");
  d.quote(s, Q.noSingle);
  s.addNotes("看这张剖面图：大球是活性物质，例如 NMC 正极或石墨负极，直径约 10 µm。颗粒之间是炭黑和粘结剂组成的“胶泥”，有人叫它碳–粘结剂相 (CBD)。剩下的空间是孔，组装后灌满电解液。放电时电子从铝箔经过炭黑链进入颗粒，Li⁺ 从孔里的电解液进入颗粒，两条路都要通。");

  // ---------------- 6. Recipe chart ----------------
  s = d.slide("CONTENT");
  s.addText("配方：实验室为什么和工厂差这么多", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [
    { name: "活性物质", labels: ["Stein 示例", "常见学术配方", "Stein 讨论例", "工业正极（典型）", "工业石墨负极（典型）"], values: [70, 80, 94, 96, 96] },
    { name: "导电炭黑", labels: ["Stein 示例", "常见学术配方", "Stein 讨论例", "工业正极（典型）", "工业石墨负极（典型）"], values: [20, 10, 3, 2, 1] },
    { name: "粘结剂", labels: ["Stein 示例", "常见学术配方", "Stein 讨论例", "工业正极（典型）", "工业石墨负极（典型）"], values: [10, 10, 3, 2, 3] },
  ], {
    x: 0.6, y: 1.25, w: 6.6, h: 4.4, barDir: "bar", barGrouping: "stacked",
    chartColors: [HEX.accent6, HEX.dk1, HEX.accent2],
    ...chartText, catAxisOrientation: "maxMin", valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20,
    valGridLine: { color: "E5E9ED", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 13, legendColor: HEX.dk1,
    showTitle: true, title: "电极干组分的质量分数（wt%）",
  });
  d.caption(s, "前三项来自 Stein 2016（p. 2、p. 8）；工业值为典型配方（补充数据，负极粘结剂为 CMC + SBR），Li 2022 写活性物质 >96 wt% 可达，炭黑 1–2 wt%。", { x: 0.6, y: 5.72, w: 6.6, h: 0.6 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：wt%（质量分数）", size: 13, body: "某成分占干电极总质量的百分比。只算固体，不算溶剂。" },
    { kind: "hist", size: 13, body: Q.facts.recipe },
    { kind: "why", size: 13, body: "实验室多放炭黑和粘结剂，是想先保证导通，让材料本身的性能显出来。工厂要的是能量：非活性物质每多 1%，能存锂的部分就少 1%。" },
    { kind: "matters", size: 13, body: "读论文先看配方。70 : 20 : 10 下测得的倍率性能，换到 96 : 2 : 2 的厚电极上常常不成立。" },
  ], 0.14, 6.85, "recipe");
  s.addNotes("Stein 的配方是 1.25 g 干粉：0.875 g NMC、0.25 g 炭黑、0.125 g PVDF（以 10% 的 NMP 溶液加入）。注意活性物质只有 70%。工业正极一般在 94% 到 97% 之间。配方变了，浆料的溶剂用量、粘度、涂布厚度都要重新调。");

  // ---------------- 7. Conductive additive ----------------
  s = d.slide("CONTENT");
  s.addText("导电剂：给电子铺路", { placeholder: "title" });
  d.fig(s, "conductive_paths", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "据原文 Fig. 3 重绘（示意，未按比例）。", { x: 0.6, y: 5.8, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：导电网络", size: 13, body: "炭黑颗粒要连成一条条“链”，电子才能从箔走到每个颗粒。链断了，那个颗粒就“掉线”，不再参与充放电。" },
    { kind: "hist", size: 13, body: Q.facts.carbon },
    { kind: "why", size: 13, body: "以前靠多加炭黑。CNT 像长电线，不到 1 wt% 就能连通；但比表面积大、容易抱团，要靠表面改性或分散剂。" },
    { kind: "matters", size: 13, body: "导电剂越少，能量越高，但对分散的要求越高（Li 等 2022, p. 906）。" },
  ], 0.14, 6.85, "carbon");
  s.addNotes("为什么需要导电剂？Li 等 2022 说得很直接：没有一种活性物质既导离子又导电子好到能单独成电极。NMC、LFP 本身导电差，所以要加炭黑。原文还提到一个有趣的取舍：实验室里常故意让炭黑“半分散”，让它自己连成链；但大规模生产时，完全分散的体系更可控。");

  // ---------------- 8. Binder ----------------
  s = d.slide("CONTENT");
  s.addText("粘结剂：把颗粒粘在一起，也粘在箔上", { placeholder: "title" });
  d.fig(s, "binder_role", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.binder },
    { kind: "why", size: 13, body: "PTFE 几乎不溶于任何溶剂，只能热压。PVDF 能溶在 NMP 里，可以调浆涂布；0–5 V 都稳定，正负极都能用。" },
    { kind: "matters", size: 13, body: "粘结剂只占几个百分点，却决定极片会不会掉粉、能不能卷绕，还决定浆料有多稠。" },
  ], 0.14, 5.75, "binder");
  d.quote(s, Q.nmpToxic);
  s.addNotes("附着力 (adhesion) 是涂层和箔之间的粘力；内聚力 (cohesion) 是涂层内部颗粒之间的粘力。两者都不够，极片在冲片、卷绕时会掉粉。Li 等 2022 还提到：高分子量 PVDF 能让浆料剪切变稀，这一点下一节会讲。PVDF 的缺点是含氟，回收时热解会放出 HF。");

  // ---------------- 9. Two systems ----------------
  s = d.slide("CONTENT");
  s.addText("两套体系：正极 PVDF/NMP，负极 CMC/SBR/水", { placeholder: "title" });
  d.fig(s, "binder_systems", { x: 0.6, y: 1.05, w: 12.1, h: 3.75 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.water },
    { kind: "why", body: "石墨不怕水，负极先换成水。正极难换：高镍材料遇水析锂、浆料 pH 超过 12 会腐蚀铝箔、水在铝箔上铺不开。" },
    { kind: "matters", body: "不用 NMP 就省掉回收设备（约 300–600 万美元），电极工序能耗少约 43%（Li 等 2022, p. 937）。" },
  ], 13, 6.88, "systems");
  s.addNotes("表里的数字都来自 Li 等 2022。注意一个反直觉的地方：水的汽化热是 NMP 的 4 倍多，但水的沸点低、蒸气压高，所以干燥时反而跑得快。CMC 是羧甲基纤维素，和食品里的增稠剂是同一类东西；SBR 是丁苯橡胶的乳液，像白乳胶。Li 等列出水系正极的六大难题，第 3 章讲干燥时还会提到残余水分。");

  // ======== Section 2 ========
  d.section("2 混合与流变");
  s = d.slide("DARK_SECTION");
  s.addText("2  混合与流变：把粉末变成好涂的浆料", { placeholder: "title" });
  s.addText("混合的目标 · Stein 的实验室步骤 · 搅拌设备 · 粘度 · 剪切变稀 · 浆料检查", { placeholder: "body" });
  s.addNotes("混合不是“搅匀就行”。这一节回答三个问题：要把什么打散？按什么顺序加？浆料稠到什么程度才好涂？");

  // ---------------- 11. Mixing goals ----------------
  s = d.slide("CONTENT");
  s.addText("混合的目标：打散团聚，又不让颗粒沉底", { placeholder: "title" });
  d.fig(s, "agglomerate", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.stokes },
    { kind: "why", size: 13, body: "以前把粉末和溶剂倒在一起搅就算。后来发现：炭黑抱成的团不打散，电子就走不通；浆料太稀，大颗粒几小时就沉底。" },
    { kind: "matters", size: 13, body: "浆料常要放 8 小时以上再涂（Li 等 2022）。只要沉降、结团，同一桶浆料涂出的电极就前后不一样。" },
  ], 0.14, 5.75, "mixgoal");
  d.quote(s, Q.mixingSeq);
  s.addNotes("团聚体 (agglomerate) 是许多小颗粒靠范德华力粘成的团，里面常裹着空气。分散 (dispersion) 就是用剪切力把团拆开，让每个颗粒被液体包住。Stokes 公式告诉我们三个“旋钮”：颗粒越小、密度差越小、液体越稠，沉得越慢。电池浆料主要靠提高粘度来防沉。");

  // ---------------- 12. Stein procedure ----------------
  s = d.slide("CONTENT");
  s.addText("实验室怎么做：Stein 2016 的配浆步骤", { placeholder: "title" });
  d.fig(s, "stein_flow", { x: 0.6, y: 1.05, w: 12.1, h: 3.25 });
  d.caption(s, "据原文 Fig. 1 与 Protocol 第 1 节重绘；参数均为原文数值。", { x: 0.6, y: 4.3, w: 12.1, h: 0.3 });
  row3(s, 4.65, [
    { kind: "hist", body: Q.facts.stein },
    { kind: "why", body: "先干混，让炭黑先包住 NMC；再加 NMP 打散；最后加 PVDF 溶液。Li 等 2022 指出：加料顺序会明显改变浆料粘度和电极性能。" },
    { kind: "matters", body: "顺序写进步骤里，别人才能复现。放置超过 5 分钟要再混 15 分钟，否则颗粒开始沉降。" },
  ], 13, 6.88, "stein");
  s.addNotes("这套做法用的是“管式混合 + 玻璃珠”：玻璃珠在管里来回撞击，提供高剪切。原文提醒两点：玻璃珠会磨损带入杂质，用过就扔；珠子太多会粘走浆料，倒不出来。铝箔要用丙酮擦洗去掉轧制时留下的油，否则涂层附着不好。");

  // ---------------- 13. Mixers ----------------
  s = d.slide("CONTENT");
  s.addText("搅拌设备：从研钵到行星搅拌机，再到双螺杆", { placeholder: "title" });
  d.fig(s, "mixers", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "上：据原文 Fig. 7 重绘；下：据原文 Fig. 24a 简化重绘。", { x: 0.6, y: 5.75, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.mixers },
    { kind: "why", size: 13, body: "批次式一锅混 2–6 h，再脱泡 1–2 h，每锅略有不同。35 GWh 工厂约需 24 台行星机，改连续混合只需 5 条线（Li p. 936）。" },
    { kind: "matters", size: 13, body: "连续混合占地约为 30%，出问题时浪费也少；代价是混合和涂布被“绑”在一起，一停全停。" },
  ], 0.14, 5.75, "mixers");
  d.quote(s, Q.cupcake);
  s.addNotes("行星搅拌机的“行星”指桨叶一边自转一边绕锅公转，像行星绕太阳。高速分散盘边缘是锯齿，负责打散团聚；刮壁桨把粘在锅壁上的粉刮回来。原文用蛋糕打比方：批次式像给一支军队做一个大蛋糕，连续式像一次只做一个纸杯蛋糕，但每个都一样。实验室常用的还有研钵、球磨、行星离心脱泡机等。");

  // ---------------- 14. Viscosity ----------------
  s = d.slide("CONTENT");
  s.addText("粘度：液体有多“黏”", { placeholder: "title" });
  d.fig(s, "viscosity_plates", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "示意。水、蜂蜜为常见量级（补充）；Stein 浆料 0.11 Pa·s 为原文 p. 8 的“理想粘度”；“静置的浆料”取自原文 Fig. 15 低剪切区。", { x: 0.6, y: 5.8, w: 6.8, h: 0.5 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：粘度 η (viscosity)", size: 13, body: "推动液体流动有多费力。η = τ ÷ γ̇：τ 是单位面积上的推力，γ̇ 是剪切速率（流得多快）。单位 Pa·s，水约 0.001。" },
    { kind: "hist", size: 13, body: Q.facts.viscosity },
    { kind: "why", size: 13, body: "以前用“稠”“稀”凭手感描述。流变仪能在不同剪切速率下测粘度，把手感变成曲线，才能在不同工厂之间对比。" },
    { kind: "matters", size: 13, body: "粘度决定浆料会不会沉、能不能泵、涂出来多厚。Li 等 2022 说它对涂布窗口影响最大。" },
  ], 0.14, 6.85, "visc");
  s.addNotes("比喻：把一副扑克牌放在桌上，用手掌平推最上面一张，下面的牌一张拖一张，越往下动得越少。这就是剪切。剪切速率等于上板速度除以间隙，单位是 1/s。粘度大，同样的速度需要更大的力。");

  // ---------------- 15. Shear thinning ----------------
  s = d.slide("CONTENT");
  s.addText("剪切变稀：静置时稠，涂布时稀", { placeholder: "title" });
  d.fig(s, "shear_thinning", { x: 0.5, y: 1.2, w: 6.9, h: 4.3 });
  d.caption(s, "据原文 Fig. 15 重绘（读图，近似）。原图为三种正负极浆料，未注明成分；颜色有改动。", { x: 0.6, y: 5.5, w: 6.8, h: 0.35 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.thinning },
    { kind: "why", size: 13, body: "静置时要像酸奶，颗粒不沉、边缘不塌；进模头时要像牛奶，才铺得开。狭缝里 γ̇ ≈ 6Q ÷ (b h²)：Q 流量，b 宽度，h 缝高。" },
    { kind: "matters", size: 13, body: "A 低剪切粘度最高，最适合厚电极；B、C 在高剪切下几乎重合，可用相近的涂布参数（p. 920）。" },
  ], 0.14, 5.75, "thinning");
  d.quote(s, Q.shearThin);
  s.addNotes("番茄酱是最好的例子：瓶子倒过来不流，一摇一拍就出来了。浆料里的高分子链和炭黑网络在静置时互相缠住，受剪切时被拉开、排顺，粘度就降下来。图的横轴、纵轴都是对数坐标：横轴跨 5 个数量级，A 浆料的粘度从约 350 Pa·s 降到约 0.2 Pa·s。高速狭缝涂布时剪切速率可达几百 1/s。");

  // ---------------- 16. Slurry checks ----------------
  s = d.slide("CONTENT");
  s.addText("检查浆料：溶剂用量、细度与润湿", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "NMP", labels: ["70 : 20 : 10", "80 : 10 : 10", "94 : 3 : 3"], values: [4.4, 2.0, 1.5] }], {
    x: 0.6, y: 1.2, w: 5.8, h: 3.15, barDir: "col",
    chartColors: [HEX.dk1, HEX.accent6, HEX.accent6],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 5.2, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "每克干粉所需 NMP（ml）；配方 = NMC : 炭黑 : PVDF", showLegend: false,
  });
  d.caption(s, "Stein 2016：70:20:10 为 5.5 ml ÷ 1.25 g（不含 PVDF 溶液中的 NMP）；另两项为原文 p. 8 给出的 1 g 干粉用量。", { x: 0.6, y: 4.38, w: 5.8, h: 0.45 });
  d.fig(s, "slurry_checks", { x: 6.7, y: 1.1, w: 6.0, h: 3.55 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.checks },
    { kind: "why", body: "以前凭手感加溶剂。Stein 发现 NMP 用量由粉末总表面积决定，而炭黑的比表面积最大：炭黑越多，要的 NMP 越多。" },
    { kind: "matters", body: "溶剂越多，干燥越费能，膜也越疏松。水在铝箔上接触角近 90°，加 IPA 可降到 40°（Li p. 938）。" },
  ], 13, 6.88, "checks");
  s.addNotes("工厂在混合结束后有几项常规检查：流变测试、细度板查最大团聚体、水系浆料测 pH、真空脱泡、必要时过滤（Li 等 2022 Table 3）。实验室至少可以做两件事：记录每次加了多少溶剂，涂之前看一眼浆料有没有颗粒感。Stein 给出的理想粘度是 0.11 Pa·s，只对他们这个配方有效。");

  // ======== Section 3 ========
  d.section("3 涂布与面密度");
  s = d.slide("DARK_SECTION");
  s.addText("3  涂布：把浆料刷成均匀的薄层", { placeholder: "title" });
  s.addText("刮刀涂布 · 狭缝涂布 · 三种方法对比 · 面密度怎么算 · 均匀性与常见缺陷", { placeholder: "body" });
  s.addNotes("涂布就像刷墙：刷子（刀或模头）、墙（金属箔）、漆（浆料）缺一不可。这一节停在湿膜，干燥是第 3 章的事。");

  // ---------------- 18. Doctor blade ----------------
  s = d.slide("CONTENT");
  s.addText("刮刀涂布 (doctor blade)：实验室的标准做法", { placeholder: "title" });
  d.fig(s, "doctor_blade", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "示意。右侧厚度为按 Stein 配方估算：浆料中固体约 6 vol%，干膜孔隙率按约 60% 计。", { x: 0.6, y: 5.8, w: 6.8, h: 0.5 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "Stein 的参数", size: 13, body: "铝箔用 IPA 吸平在涂布机台面上，浆料倒成一条，刀口间隙 200 µm，以 20 mm/s 推过去。" },
    { kind: "hist", size: 13, body: Q.facts.blade },
    { kind: "why", size: 13, body: "以前用玻璃棒或刀片手刮，厚度全凭手感。带千分尺的刮刀和电动推杆把间隙、速度固定下来，同一张箔上厚度才均匀。" },
    { kind: "matters", size: 13, body: "便宜、浆料用量少（几毫升），最适合筛选材料。但间隙不等于厚度：要靠称重算面密度。" },
  ], 0.14, 6.85, "blade");
  s.addNotes("比喻：刮刀涂布就像刮腻子，刮板离墙的距离决定腻子有多厚。湿膜通常比间隙薄一些，干燥时溶剂挥发后还要再薄很多。Stein 的浆料很稀，固体只占约 6% 体积，所以 200 µm 的间隙最后只剩约 25 µm 干膜。这是我按配方做的估算，不是原文数据。");

  // ---------------- 19. Slot-die ----------------
  s = d.slide("CONTENT");
  s.addText("狭缝涂布 (slot-die)：工厂的主力", { placeholder: "title" });
  d.fig(s, "slot_die", { x: 0.5, y: 1.2, w: 6.9, h: 4.3 });
  d.caption(s, "据原文 Fig. 8 重绘（改为剖面示意，未按比例）。", { x: 0.6, y: 5.5, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.slot },
    { kind: "why", size: 13, body: "刮刀靠“刮掉多余的”定厚度，浆料一变稠就变厚。狭缝靠泵“定量送出”：湿膜厚度 ≈ 流量 ÷ (宽度 × 走带速度)。" },
    { kind: "matters", size: 13, body: "典型线速 10–30 m/min，宽 200–800 mm；模头平面度要求 ±2 µm（Li p. 922–924）。" },
  ], 0.14, 5.75, "slot");
  d.quote(s, Q.tightest);
  s.addNotes("狭缝模头由两块不锈钢拼成，中间夹一片垫片 (shim)，垫片厚度就是缝宽。浆料从中间进入腔体，沿宽度方向铺开，再从狭缝挤出，在模唇和箔之间形成一个小液桥（弯月面）。原文说模头的压降最好在 10–30 psi，压降太大或太小都会让涂层不稳定。");

  // ---------------- 20. Compare ----------------
  s = d.slide("CONTENT");
  s.addText("三种涂布方法：谁定厚度？浆料暴露吗？", { placeholder: "title" });
  d.fig(s, "coating_compare", { x: 0.6, y: 1.05, w: 12.1, h: 4.1 });
  row3(s, 5.25, [
    { kind: "hist", body: Q.facts.comma },
    { kind: "why", body: "开放液槽里溶剂会挥发，浆料越涂越稠。产线越来越宽、越来越快，封闭、靠泵计量的狭缝就成了主流。" },
    { kind: "matters", body: "实验室刮涂与工厂狭缝的剪切和干燥条件不同，同一种浆料在两处可能表现不同。" },
  ], 13, 6.88, "compare");
  s.addNotes("逗号刮刀的结构：浆料存在刀辊前的槽里，箔从刀辊和背辊之间穿过，刀辊和箔的间隙决定厚度，有点像大号的刮刀。Li 等 2022 说狭缝涂布是封闭系统，比逗号刮刀这种开放液槽更不受环境影响。实验室也有小型狭缝涂布机，但浆料用量是几十到几百毫升，比刮涂多得多。");

  // ---------------- 21. Loading ----------------
  s = d.slide("CONTENT");
  s.addText("面密度 (mass loading)：每平方厘米有多少活性物质", { placeholder: "title" });
  d.fig(s, "loading_calc", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.stat(s, { x: 7.75, y: 1.2, w: 2.4, value: "1.99", unit: "mg/cm²", label: "Stein 示例（补算）", color: "accent2" });
  d.stat(s, { x: 10.3, y: 1.2, w: 2.5, value: "100→500", unit: "g/m²", label: "20 年前常见 → 今天的厚电极", color: "accent1" });
  col(s, 7.75, 2.75, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.loading },
    { kind: "why", size: 13, body: "以前论文只报 mAh/g。但 mAh/g 看不出电极有多厚；同一材料，厚电极的倍率差很多。所以现在要同时报 mg/cm² 和 mAh/cm²。" },
    { kind: "matters", size: 13, body: "面密度直接决定电池能量和正负极配比（N/P ratio，第 5、6 章）。1 mg/cm² = 10 g/m²。" },
  ], 0.14, 6.85, "loading");
  s.addNotes("面密度 = (电极片质量 − 同面积箔的质量) ÷ 面积，再乘以活性物质占比。Stein 的电极片直径 ½ 英寸（1.27 cm），面积 1.267 cm²。算出来活性物质约 2 mg/cm²、面容量约 0.31 mAh/cm²，比工业电极低一个数量级左右。称量要用 0.1 mg 精度的天平，并且每片都称，不能只称一片代表全部。");

  // ---------------- 22. Uniformity & defects ----------------
  s = d.slide("CONTENT");
  s.addText("实操清单：涂得匀不匀？常见缺陷怎么改", { placeholder: "title" });
  d.fig(s, "coating_defects", { x: 0.6, y: 1.05, w: 12.1, h: 3.52 });
  s.addChart(d.pres.charts.BAR, [{ name: "允许偏差", labels: ["100 g/m² 电极", "250 g/m² 电极"], values: [2, 5] }], {
    x: 0.6, y: 4.65, w: 4.3, h: 2.2, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent1],
    showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 6.5, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "同为 ±2% 时的绝对偏差（±g/m²，Li p. 922）", showLegend: false,
  });
  d.block(s, { x: 5.15, y: 4.68, w: 3.6, kind: "hist", tint: true, size: 13, body: "15 年前涂布量波动 ±5% 很常见，如今目标 ±1–2%（Li 等 2022）。" });
  d.block(s, { x: 8.95, y: 4.68, w: 3.75, kind: "matters", tint: true, head: "涂之前、涂之后", size: 13, body: "① 箔擦净再涂；② 浆料无颗粒感、无气泡；③ 放久了重混；④ 每片称重，算面密度；⑤ 剪掉边缘不匀处。" });
  s.addNotes("左下的图说明一个容易忽略的事：同样是 ±2%，厚电极的绝对偏差更大。Li 等列出影响涂布均匀性的四个因素：浆料流变、箔的厚度与质量、泵和走带速度的控制、模头本身的加工精度。实验室最常见的是上面四种缺陷，原因和改法写在每张小图下面。");

  // ======== Section 4 ========
  d.section("4 校注与小结");
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文笔误与实验室常见误解", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const c = i % 2, r = Math.floor(i / 2);
    const bot = d.block(s, { x: c ? 6.8 : 0.6, y: 1.25 + r * 1.85, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
    if (bot > 6.85) console.warn(`WARN note ${i} bottom ${bot.toFixed(2)}`);
  });
  s.addNotes("前四条是原文本身的问题：两条笔误、一条术语不准、一条数值前后不一。后两条是实验室里常见的误解。第一个误解尤其常见：有人在论文里写“涂布厚度 200 µm”，其实那是刮刀间隙，干膜只有它的零头。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["电极 = 活性物质 + 炭黑 + 粘结剂 + 孔", "实验室常用 70–90% 活性物质，工厂做到 96% 左右；非活性物质是“死重”"],
    ["正极 PVDF/NMP，负极 CMC/SBR/水", "NMP 有毒、贵、要回收；正极改水系卡在怕水、腐蚀铝箔、润湿差"],
    ["混合要打散团聚、防沉降；顺序很重要", "浆料最好剪切变稀：静置像酸奶，涂布像牛奶"],
    ["实验室刮刀，工厂狭缝；用面密度说话", "间隙 ≠ 厚度；每片称重，报 mg/cm² 与 mAh/cm²"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.steinFive.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.steinFive.zh}  —— ${Q.steinFive.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.85, w: 11.9, h: 1.05, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("Stein 说干燥“常被忽视”，这正是下一章的起点。第 3 章讲湿膜怎样变成干电极：干燥时粘结剂会往上跑，辊压决定孔隙率，还有不用溶剂的干法电极。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
