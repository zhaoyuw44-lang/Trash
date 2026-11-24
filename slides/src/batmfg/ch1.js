// 锂电池制造 — 第 1 章：总览——一块电池是怎么造出来的
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch1_quotes");

const PAPER = {
  short: "锂电池制造",
  full: "本章原始文献：A. Kwade, W. Haselrieder, R. Leithoff, A. Modlinger, F. Dietrich & K. Droeder, Current status and challenges for automotive battery production technologies, Nature Energy 3, 290–300 (2018)；Y. Liu, R. Zhang, J. Wang & Y. Wang, Current and future lithium-ion battery manufacturing, iScience 24, 102332 (2021)；J. Xiao, F. Shi, T. Glossmann, C. Burnett & Z. Liu, From laboratory innovations to materials manufacturing for lithium-based batteries, Nature Energy 8, 329–339 (2023)。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch1_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 1, chapterTitle: "总览：一块电池是怎么造出来的", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const axisText = { valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const noGrid = { valGridLine: { style: "none" }, catGridLine: { style: "none" } };
  const col = (s, x, y, w, blocks, gap = 0.18, limit = 6.85, tag = "") => {
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
  s.addText("第 1 章\n一块电池是怎么造出来的？", { placeholder: "title" });
  s.addText("总览：工艺链、电芯形态、成本与能耗、从实验室到工厂", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.45, w: 7.6, h: 1.5, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("这个系列面向刚进实验室、要亲手做电池的研究生。第 1 章先看全貌：一块锂离子电池从粉末到能用，要经过哪些步骤；钱和能量花在哪里；实验室里做的扣式电池和工厂里的电芯差在哪里。后面五章再逐段细讲。三篇文献：Kwade 2018 是生产工艺综述，Liu 2021 拆分了每道工序的成本和能耗，Xiao 2023 讲实验室成果走向制造的知识缺口。");

  // ---------------- 2. Roadmap + reading key ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "一块电芯里有什么，怎么造", "从颗粒到电池包；电极 → 组装 → 化成三段"],
    ["2", "电芯的四种形态", "扣式、圆柱、软包、方形；电芯为什么越做越大"],
    ["3", "钱和能量花在哪", "材料占四分之三；化成最贵，干燥最耗电"],
    ["4", "从实验室到工厂", "三个尺度；实验室数据为什么常常放大不了"],
    ["5", "校注与小结", "原文的笔误与读表注意，本章要点"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.4 + i * 1.08;
    card(s, 0.6, y, 6.3, 0.92);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.18, w: 0.56, h: 0.56, fill: { color: C.text1 }, color: C.background1, fontSize: 19, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.08, w: 5.0, h: 0.42, fontSize: 19, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.5, w: 5.15, h: 0.34, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("每个概念页的阅读标签", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  const keys = [
    ["hist", "历史 History", "哪一年、谁、做了什么"],
    ["why", "以前 → 为什么", "之前怎么做，为什么改成这样"],
    ["matters", "为什么重要", "这一步对电池和你的实验意味着什么"],
    ["quote", "原文金句", "原始论文的英文原句 + 中文翻译"],
  ];
  keys.forEach(([k, h, b], i) => {
    const y = 2.1 + i * 1.12;
    d.chip(s, 7.5, y + 0.05, k, 0.62);
    s.addText(h, { x: 8.35, y, w: 4.4, h: 0.4, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 8.35, y: y + 0.4, w: 4.4, h: 0.38, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.caption(s, "说明：“引”取自每章的原始论文，英文与 PDF 原文逐字一致；“…”表示省略。", { x: 7.5, y: 6.55, w: 5.25, h: 0.4 });
  s.addNotes("四个标签贯穿全系列：史（年份、人物、贡献）、变（以前怎么做 → 为什么改）、要（为什么重要）、引（原始论文金句）。另有“义”（定义）和“注”（校注）两种辅助标签。这一章是总览，很多工序只点到为止，并注明在第几章细讲。");

  // ---------------- 3. Series map ----------------
  s = d.slide("CONTENT");
  s.addText("全系列：从全貌，到电极，到扣式，再到软包", { placeholder: "title" });
  d.fig(s, "series_map", { x: 0.5, y: 1.15, w: 12.3, h: 4.3 });
  d.block(s, { x: 0.6, y: 5.5, w: 5.9, kind: "why", tint: true, body: "实验室里最先上手的是扣式电池，工厂里造的却是软包、圆柱、方形大电芯。所以先看全貌，再从电极做到扣式，最后放大到软包。" });
  d.block(s, { x: 6.8, y: 5.5, w: 5.9, kind: "matters", tint: true, body: "每章都对照“实验室怎么做 / 工厂怎么做”。读完能判断一篇论文的电池数据离实用还有多远。" });
  s.addNotes("全系列 6 章。第 2、3 章讲电极：浆料、涂布、干燥、辊压和干法等新工艺。第 4、5 章讲实验室扣式电池：怎么组装，怎样让数据可信。第 6 章讲怎样从扣式放大到多层软包，包括负正极容量比 (N/P ratio) 的确定和化成。");

  // ---------------- 4. History timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：锂离子电池制造的 40 年", { placeholder: "title" });
  d.fig(s, "history_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.3 });
  d.block(s, { x: 0.6, y: 5.5, w: 5.9, kind: "why", tint: true, body: "早期借用磁带、胶片工业的涂布技术（橙）；2000 年代韩国、中国加入扩产（紫）；电动车时代改用专门设计的大电芯和超级工厂（青）。" });
  d.block(s, { x: 6.8, y: 5.5, w: 5.9, kind: "matters", tint: true, body: "今天的工艺链大部分在 1990 年代就已定型，后来主要是“做大、做快、做便宜”。真正改动工序的新工艺（如干法电极）直到 2020 年前后才进入量产计划。" });
  s.addNotes("时间轴不按比例。1985 年吉野彰在旭化成做出 LiCoO₂ 正极加碳负极的原型；1991 年 Sony 率先量产，开发由西美绪领导。Tesla Roadster 的电池包约 6,800 节笔记本用 18650 电芯；2010 年的 Nissan Leaf 和 Chevrolet Volt 用的是专为汽车设计的软包电芯。2019 年 Tesla 收购做干法电极的 Maxwell（Liu 2021 也提到），2020 年发布 4680 电芯；同年比亚迪发布刀片电池。");

  // ======== Section 1 ========
  d.section("1 电芯里有什么，怎么造");
  s = d.slide("DARK_SECTION");
  s.addText("1  一块电芯：里面有什么，怎么造", { placeholder: "title" });
  s.addText("从颗粒到电池包 · 三段工艺链 · 电极制备 · 电芯组装 · 化成与老化", { placeholder: "body" });
  s.addText([
    { text: `“${Q.liuNotKnow.en}”`, options: { italic: true, fontSize: 14, color: "FFFFFF", breakLine: true } },
    { text: `${Q.liuNotKnow.zh}  —— ${Q.liuNotKnow.ref}`, options: { fontSize: 13, color: "CADCE8" } },
  ], { x: 0.7, y: 5.6, w: 11.9, h: 1.1, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("Liu 2021 的这句话正是本系列的出发点：很多做材料的研究者没见过电池是怎么造出来的。这一节先拆开一块电芯看它的结构，再把整个生产过程分成三段：电极制备、电芯组装、化成与老化。每段只讲“做什么、为什么”，细节留到后面各章。");

  // ---------------- 6. Anatomy ----------------
  s = d.slide("CONTENT");
  s.addText("从颗粒到电池包：一块电芯里有什么", { placeholder: "title" });
  d.fig(s, "anatomy", { x: 0.6, y: 1.12, w: 12.1, h: 3.25 });
  d.caption(s, "据 Kwade 2018 Fig. 1a 重绘、简化。", { x: 0.6, y: 4.38, w: 12.1, h: 0.3 });
  row3(s, 4.75, [
    { kind: "hist", body: Q.facts.sony1991 },
    { kind: "why", body: "为什么做成几十微米的薄涂层？离子在固体里走得很慢。把材料做成多孔涂层，再泡进电解液，离子就能“抄近路”。" },
    { kind: "matters", body: "每一层都影响性能：颗粒决定容量，涂层结构决定能不能快充，外壳和电池包的“死重”决定能量密度。" },
  ], 13, 6.85, "anatomy");
  s.addNotes("几个典型尺寸（Kwade 2018）：正极铝箔 12–20 μm，负极铜箔 6–10 μm，隔膜 6–20 μm，粘结剂 (binder) 只占电极的 1–4 wt%。正极常用 PVDF 粘结剂、以 NMP 为溶剂；石墨负极常用 CMC + SBR、以水为溶剂。导电碳 (conductive carbon) 的作用是给活性物质颗粒“接电线”。");

  // ---------------- 7. Process chain ----------------
  s = d.slide("CONTENT");
  s.addText("工艺链：三段、十几步，从粉末到能用的电芯", { placeholder: "title" });
  d.fig(s, "process_chain", { x: 0.6, y: 1.1, w: 12.1, h: 3.3 });
  d.caption(s, "据 Kwade 2018 Fig. 2 与 Liu 2021 Fig. 1 重绘、简化；模组与电池包组装未画出。", { x: 0.6, y: 4.38, w: 12.1, h: 0.3 });
  row3(s, 4.7, [
    { kind: "hist", body: Q.facts.chain },
    { kind: "why", body: "为什么分三段？每段怕的东西不同：电极段怕不均匀，组装段怕水和金属屑，化成段费时间。" },
    { kind: "matters", body: "实验室的新材料，要走完这三段十几步才算“能用”，每一步都可能出新问题。" },
  ], 13, 6.85, "chain");
  s.addNotes("三段的英文：电极制备 (electrode production)、电芯组装 (cell assembly)、化成与老化 (formation and aging，也叫电芯活化)。虚线框表示必须在干燥间 (dry room) 里做的工序。Liu 2021 列出的顺序是：混浆、涂布、干燥、辊压、分切、真空干燥、卷绕或叠片、焊接、封装、注液、化成、老化。");

  // ---------------- 8. Electrode line ----------------
  s = d.slide("CONTENT");
  s.addText("电极制备：像刷墙一样，把浆料刷到金属箔上", { placeholder: "title" });
  d.fig(s, "electrode_line", { x: 0.6, y: 1.1, w: 12.1, h: 3.15 });
  d.caption(s, "速度与时间：Kwade 2018 p. 293、Liu 2021 Table 1，均为典型范围。", { x: 0.6, y: 4.3, w: 12.1, h: 0.3 });
  row3(s, 4.7, [
    { kind: "hist", body: Q.facts.coating },
    { kind: "why", body: "实验室用刮刀 (doctor blade) 一次涂一小张；工厂要连续涂几千米，所以改用卷对卷 (roll-to-roll) 和狭缝挤压涂布 (slot-die coating)，两面都涂。" },
    { kind: "matters", body: "电极决定电池大部分的性能和成本。浆料 (slurry) 与涂布 (coating) 见第 2 章；干燥、辊压 (calendering) 与干法电极见第 3 章。" },
  ], 13, 6.85, "electrode");
  s.addNotes("几个比喻：混浆像和面，粉和液体要揉匀、不能有疙瘩；涂布像刷墙，要刷得一样厚；辊压像擀面，把蓬松的涂层压实，孔变少、密度变高。NMP 是 N-甲基吡咯烷酮，有毒、沸点约 202 °C，必须回收；回收后再用，损失约 20–30%（Liu 2021）。石墨负极用水做溶剂，水蒸气可以直接排掉。");

  // ---------------- 9. Assembly ----------------
  s = d.slide("CONTENT");
  s.addText("电芯组装：在“比沙漠还干”的房间里卷或叠", { placeholder: "title" });
  d.fig(s, "assembly", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "据 Kwade 2018 p. 294、Fig. 4d–f 重绘、简化。", { x: 0.6, y: 5.9, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：露点 Dew point", size: 13, body: "把空气降温，水汽开始结露的温度。露点 −60 °C，表示空气里的水少到要冷到 −60 °C 才会结霜。" },
    { kind: "hist", size: 13, body: Q.facts.winding },
    { kind: "why", size: 13, body: "卷绕快，但厚电极弯折时会开裂；叠片受力均匀、能用更厚的电极，但一片片放，速度慢（Kwade 2018）。" },
    { kind: "matters", size: 13, body: "水会和电解液里的 LiPF₆ 反应生成 HF，腐蚀材料。实验室的对应物是手套箱 (glovebox)，见第 4 章；软包组装见第 6 章。" },
  ], 0.15, 6.85, "assembly");
  s.addNotes("组装的几个关键数字（Kwade 2018）：干燥间露点一般 −40 至 −60 °C，注液时更严格，低于 −60 °C；电解液约占电芯质量的 15–20 wt%；极耳多用超声波或激光焊接。负极比正极大一圈，是为了防止正极边缘对面没有负极接锂，在那里析出金属锂。");

  // ---------------- 10. Formation ----------------
  s = d.slide("CONTENT");
  s.addText("化成与老化：第一次充电，给负极穿上“防护服”", { placeholder: "title" });
  d.fig(s, "formation", { x: 0.5, y: 1.2, w: 6.9, h: 4.3 });
  d.caption(s, "示意图；步骤据 Liu 2021 p. 3 与 Fig. 1，时间据 Kwade 2018 p. 294。", { x: 0.6, y: 5.52, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.formation },
    { kind: "why", size: 13, body: "第一次充电时，电解液在负极表面分解，长出 SEI 膜（固体电解质界面膜）。充太快，膜疏松不匀，还可能析锂；所以先用小电流（如 C/20），再逐步加大。" },
    { kind: "matters", size: 13, body: "化成老化要占几周时间和大量充放电柜，是最贵的一步（第 3 节）。细节见第 6 章。" },
  ], 0.16, 5.8, "formation");
  d.quote(s, Q.kwadeFormation);
  s.addNotes("C/20 表示 20 小时充满的电流。预充到约 1.5 V 是为了防止铜集流体在低电位下被腐蚀溶解（Liu 2021）。化成会产气，软包电芯要排气后再封口。老化 (aging) 是在一定温度下放置几周，让电解液充分浸润、SEI 稳定，同时测自放电，挑出有微短路的电芯。原文金句里的“Formatting”是原文用词，指化成 (formation)。");

  // ======== Section 2 ========
  d.section("2 电芯的四种形态");
  s = d.slide("DARK_SECTION");
  s.addText("2  电芯的四种形态", { placeholder: "title" });
  s.addText("扣式 · 圆柱 · 软包 · 方形 · 为什么电芯越做越大 · 电池包里的“死重”", { placeholder: "body" });
  s.addNotes("同样的电极，可以装进不同形状的外壳。实验室最常用扣式，工业界用圆柱、软包和方形。这一节比较它们的结构和用途。");

  // ---------------- 12. Formats ----------------
  s = d.slide("CONTENT");
  s.addText("四种电芯形态：同样的电极，不同的外壳", { placeholder: "title" });
  d.fig(s, "formats", { x: 0.6, y: 1.05, w: 12.1, h: 3.6 });
  d.caption(s, "容量为典型值。外壳分类据 Kwade 2018 p. 292：硬壳（圆柱、方形）与铝塑膜软包。", { x: 0.6, y: 4.67, w: 12.1, h: 0.3 });
  row3(s, 5.0, [
    { kind: "hist", body: Q.facts.coin },
    { kind: "why", body: "硬壳好密封、能承压，但重；铝塑膜最轻、形状自由，但怕鼓包，需要外加压力。" },
    { kind: "matters", body: "Kwade 2018 强调：研究工艺和成本要用接近商品的多层电芯；扣式只适合筛材料。" },
  ], 13, 6.85, "formats");
  s.addNotes("扣式电池的组装、零件和常见错误见第 4 章。圆柱电芯多用卷绕；软包可以卷绕也可以叠片，车用多为叠片；方形铝壳里多是压扁的卷芯或叠片。铝塑膜是“铝箔夹在两层塑料之间”的复合膜，能挡水，又能热封。");

  // ---------------- 13. Bigger cells ----------------
  s = d.slide("CONTENT");
  s.addText("电芯越做越大：从 18650 到 4680", { placeholder: "title" });
  d.fig(s, "cyl_sizes", { x: 0.5, y: 1.2, w: 6.9, h: 4.6 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.sizes },
    { kind: "why", size: 13, body: "电芯越大，外壳、极耳、焊点所占的比例越小；装一个电池包要焊、要测、要管理的电芯也越少。" },
    { kind: "matters", size: 13, body: "代价是散热更难，一颗出故障损失更大。车用大电芯的工艺正是从小电芯放大来的。" },
  ], 0.16, 5.6, "sizes");
  d.quote(s, Q.kwade1990s);
  s.addNotes("体积比按尺寸算：18650 约 16.5 cm³，21700 约 24.2 cm³，4680 约 133 cm³。所以 4680 的体积约是 21700 的 5.5 倍。电芯容量为典型值，随正负极材料变化很大。方形和软包也在变大：Liu 2021 提到 BMW 的 120 Ah 方形电芯。");

  // ---------------- 14. Pack mass ----------------
  s = d.slide("CONTENT");
  s.addText("电池包里的重量去哪了？", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "质量占比", labels: ["电池包结构", "正极（含铝箔）", "负极（含铜箔）", "电解液、隔膜等", "模组结构", "电芯外壳"], values: [34.4, 20.3, 17.4, 12.1, 10.0, 5.8] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent3, HEX.accent3, HEX.accent2, HEX.accent6, HEX.accent6],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 42, ...noGrid,
    showTitle: true, title: "电动车电池包的质量构成（%）", showLegend: false,
  });
  d.caption(s, "据 Kwade 2018 Fig. 1b（原图来自 Diekmann 2017）按层级合并，六项合计 100%。", { x: 0.6, y: 5.7, w: 6.6, h: 0.4 });
  d.stat(s, { x: 7.75, y: 1.25, w: 2.4, value: "≈ 38", unit: "%", label: "正负极（含集流体）", color: "accent3" });
  d.stat(s, { x: 10.3, y: 1.25, w: 2.5, value: "≈ 44", unit: "%", label: "模组与电池包结构", color: "accent6" });
  col(s, 7.75, 2.85, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.ctp },
    { kind: "why", size: 13, body: "以前电芯 → 模组 → 电池包，层层加外壳。结构件不储能，却占了四成多重量；所以要把电芯做大、减少模组。" },
    { kind: "matters", size: 13, body: "论文里的 mAh/g 只算活性物质；到电池包要打很大折扣。第 5 章讲怎样报数据才不误导。" },
  ], 0.16, 6.85, "mass");
  s.addNotes("这张图的“正极”一项包括铝箔约 5.5%，以及 O、Ni、Co、Mn、Li 等元素；“负极”包括铜箔和铜极耳约 9.2%、石墨约 8.2%。真正存锂、放电的活性物质只占总重的两成多。这里的数据是某一款电动车电池包的拆解结果，不同车型差别很大，只看量级。");

  // ======== Section 3 ========
  d.section("3 钱和能量花在哪");
  s = d.slide("DARK_SECTION");
  s.addText("3  钱和能量花在哪", { placeholder: "title" });
  s.addText("材料约占四分之三 · 按工序拆：化成最贵、干燥最耗电 · 良率连乘", { placeholder: "body" });
  s.addNotes("这一节用两篇文献的数据回答：做一块电芯，钱花在哪里，电花在哪里。这些数字决定了工业界最想改进哪些工序，也决定了实验室的哪些新工艺最有机会被采用。");

  // ---------------- 16. Cost: materials dominate ----------------
  s = d.slide("CONTENT");
  s.addText("成本：材料约占四分之三，正极又占材料的一半", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "制造成本", labels: ["材料", "折旧", "直接人工", "能源", "资本", "其他"], values: [74.9, 8.5, 8.2, 3.1, 2.8, 2.5] }], {
    x: 0.6, y: 1.2, w: 5.95, h: 3.3, barDir: "bar",
    chartColors: [HEX.accent1, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 92, ...noGrid,
    showTitle: true, title: "电芯制造成本构成（%）", showLegend: false,
  });
  s.addChart(d.pres.charts.BAR, [{ name: "材料成本", labels: ["正极", "隔膜", "负极", "外壳零件", "电解液"], values: [49.5, 17.5, 14.3, 13.9, 4.8] }], {
    x: 6.75, y: 1.2, w: 5.95, h: 3.3, barDir: "bar",
    chartColors: [HEX.accent3, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 62, ...noGrid,
    showTitle: true, title: "其中材料成本构成（%）", showLegend: false,
  });
  d.caption(s, "数据：Kwade 2018 Fig. 5a（37 Ah 石墨/NMC 插电混动电芯）。", { x: 0.6, y: 4.55, w: 12.1, h: 0.3 });
  row3(s, 4.95, [
    { kind: "hist", body: Q.facts.batpac },
    { kind: "why", body: "直觉上设备最贵，算下来是材料最贵：正极一项约占电芯成本的 37%（49.5% × 74.9%）。" },
    { kind: "matters", body: "所以报废一个电芯，扔掉的主要是材料。正负极合计约 48%，与 Xiao 2023 的“约 50%”一致。" },
  ], 13, 6.85, "cost");
  s.addNotes("两个百分数相乘就是占电芯总成本的比例：正极 0.495 × 0.749 ≈ 0.37，负极 0.143 × 0.749 ≈ 0.11。Xiao 2023 p. 329 说“正负极材料约占整个电芯价值的 50%”，与此相符。Liu 2021 说“制造约占电池成本的 25%”，指的就是材料以外的那四分之一。");

  // ---------------- 17. By step: cost vs energy ----------------
  s = d.slide("CONTENT");
  s.addText("按工序拆：化成最贵，干燥最耗电", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "成本", labels: ["化成与老化", "涂布与干燥", "封装", "叠片", "混浆", "焊接", "辊压", "溶剂回收", "真空干燥", "分切"], values: [32.61, 14.96, 12.45, 8.65, 7.91, 7.34, 5.19, 4.6, 3.2, 3.09] }], {
    x: 0.6, y: 1.15, w: 5.95, h: 3.75, barDir: "bar",
    chartColors: [HEX.accent1, HEX.accent2, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent2, HEX.accent6, HEX.accent6],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText, catAxisLabelFontSize: 12, dataLabelFontSize: 12,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 40, ...noGrid,
    showTitle: true, title: "制造成本（不含材料）占比（%）", showLegend: false,
  });
  s.addChart(d.pres.charts.BAR, [{ name: "能耗", labels: ["干燥与溶剂回收", "干燥间", "叠片", "分切", "封装", "辊压", "焊接", "涂布", "混浆", "化成与老化"], values: [46.84, 29.37, 5.8, 5.35, 5.2, 2.86, 1.88, 1.36, 0.83, 0.53] }], {
    x: 6.75, y: 1.15, w: 5.95, h: 3.75, barDir: "bar",
    chartColors: [HEX.accent2, HEX.accent3, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent1],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText, catAxisLabelFontSize: 12, dataLabelFontSize: 12,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 57, ...noGrid,
    showTitle: true, title: "生产能耗占比（%）", showLegend: false,
  });
  d.caption(s, "数据：Liu 2021 Table 1。两列来自不同电芯（见校注页），只比较各自的比例。", { x: 0.6, y: 4.93, w: 12.1, h: 0.3 });
  row3(s, 5.27, [
    { kind: "hist", size: 12, body: Q.facts.steps },
    { kind: "why", size: 12, body: "化成老化慢（1.5–3 周），占满充放电柜和厂房，所以贵，耗电却只有 0.5%。干燥要蒸干 NMP 再冷凝回收，干燥间要一直除湿，所以最耗电。" },
    { kind: "matters", size: 12, body: "省钱先看化成和涂布干燥（合计约 48%），节能先看溶剂和干燥间。干法电极（第 3 章）就是冲着后两项去的。" },
  ], 12, 6.85, "steps");
  s.addNotes("这里的“成本”是材料以外的制造成本：设备折旧、人工和厂房，不含材料。Liu 2021 p. 3：“涂布、干燥、化成和老化占整个制造成本的 48%”，即 14.96% + 32.61%。能耗一列加起来约 13.3 kWh/电芯，这是中试线的实测值，量产线会低得多。");

  // ---------------- 18. Yield ----------------
  s = d.slide("CONTENT");
  s.addText("良率连乘：每步 99.5%，25 步后只剩 88%", { placeholder: "title" });
  const nSteps = Array.from({ length: 26 }, (_, i) => i);
  s.addChart(d.pres.charts.LINE, [
    { name: "每步 99.5%", labels: nSteps.map(String), values: nSteps.map((n) => +(100 * Math.pow(0.995, n)).toFixed(1)) },
    { name: "每步 99%", labels: nSteps.map(String), values: nSteps.map((n) => +(100 * Math.pow(0.99, n)).toFixed(1)) },
  ], {
    x: 0.5, y: 1.2, w: 6.7, h: 4.0, chartColors: [HEX.accent2, HEX.accent4], lineSize: 3, lineDataSymbol: "none",
    valAxisMinVal: 70, valAxisMaxVal: 100, valAxisMajorUnit: 5, catAxisLabelFrequency: 5, ...axisText,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 12, legendColor: HEX.dk2,
    showTitle: true, title: "总良率（%）随工序数的变化",
    showCatAxisTitle: true, catAxisTitle: "工序数 n", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.caption(s, "总良率 = (每步良率)ⁿ。25 步时：99.5% → 88.2%，99% → 77.8%。", { x: 0.6, y: 5.25, w: 6.6, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：良率 Yield", size: 13, body: "合格品占投入的比例。工序串联时，各步良率相乘。" },
    { kind: "hist", size: 13, body: Q.facts.sixSigma },
    { kind: "why", size: 13, body: "以前各工序各管各的；现在看整条链。越靠后报废越亏：化成后才报废，前面的材料和工时全白花了（Kwade 2018 Fig. 5b）。" },
    { kind: "matters", size: 13, body: "做扣式电池也是多步串联：称量、涂布、裁片、组装、封口。所以要多做几颗、看统计（第 5 章）。" },
  ], 0.12, 5.75, "yield");
  d.quote(s, Q.kwadeYield);
  s.addNotes("为什么连乘？每一步都有 0.5% 的产品被挑出来报废，剩下的 99.5% 进入下一步，再被挑掉 0.5%……25 步后剩 0.995²⁵ ≈ 0.882。Kwade 2018 Fig. 5b 还显示：成本是沿着工艺链一路累加的，到化成时已累计约 97%，这时报废损失最大。");

  // ======== Section 4 ========
  d.section("4 从实验室到工厂");
  s = d.slide("DARK_SECTION");
  s.addText("4  从实验室到工厂", { placeholder: "title" });
  s.addText("实验室、中试、量产三个尺度 · 同叫“电池”，差在哪里 · 材料放大的盲区", { placeholder: "body" });
  s.addNotes("这一节回答一个让很多研究生困惑的问题：论文里性能很好的材料，为什么常常进不了工厂？答案的一半在电极和电芯的差别，另一半在材料放大本身。");

  // ---------------- 20. Three scales ----------------
  s = d.slide("CONTENT");
  s.addText("三个尺度：实验室、中试线、量产线", { placeholder: "title" });
  d.fig(s, "scales", { x: 0.6, y: 1.05, w: 12.1, h: 3.5 });
  d.caption(s, "据 Kwade 2018 Fig. 4 重绘：上排电极制备，下排电芯组装。", { x: 0.6, y: 4.57, w: 12.1, h: 0.3 });
  row3(s, 4.9, [
    { kind: "hist", body: Q.facts.tapeCasting },
    { kind: "why", body: "实验室能试很多材料，但量少、手工、不连续；量产线快而稳，却很难换材料。中试线 (pilot line) 夹在中间，用来找工艺参数。" },
    { kind: "matters", body: "Kwade 2018 p. 297：实验室实验既预测不了合适的工艺参数，也预测不了整车电芯的性能。" },
  ], 13, 6.85, "scales");
  s.addNotes("三个尺度各有任务（Kwade 2018 Fig. 4 下半部分）：实验室定材料、定配方；中试线研究工艺参数和电芯设计、建立“工艺–成本”关系；量产线追求产能、质量和稳健性，压低成本。放大时，混料机变大后剪切力会变，辊压机变快后电极的弹塑性响应会变，所以参数往往要重新调。");

  // ---------------- 21. Lab vs factory ----------------
  s = d.slide("CONTENT");
  s.addText("实验室 vs 工厂：同叫“电池”，差别有多大", { placeholder: "title" });
  d.fig(s, "lab_vs_fab", { x: 0.95, y: 1.05, w: 11.4, h: 3.1 });
  d.caption(s, "工厂一列据 Kwade 2018 与 Xiao 2023；实验室面载量据 Xiao 2023 p. 331；标“典型”的为常见值，非原文数据。", { x: 0.6, y: 4.17, w: 12.1, h: 0.3 });
  d.block(s, { x: 0.6, y: 4.5, w: 5.9, kind: "why", tint: true, size: 13, body: "实验室想测材料本身的极限，所以用薄电极、富液、大量锂；工厂要整块电芯的能量和寿命，样样都得省。" });
  d.block(s, { x: 6.8, y: 4.5, w: 5.9, kind: "matters", tint: true, size: 13, body: "薄电极、富液、锂过量会把问题藏起来。第 5 章讲怎样把扣式电池设计得更接近实用。" });
  d.quote(s, Q.xiaoDoctorBlade);
  s.addNotes("面载量 (areal loading) 指每平方厘米涂了多少毫克活性物质，乘以比容量就是面容量 (mAh/cm²)。实验室常见配方“活性物质 : 导电碳 : 粘结剂 = 80 : 10 : 10”，而工业正极导电碳和粘结剂各只有约 2%（Xiao 2023）。富液 (flooded) 指电解液远远多于需要；贫液 (lean) 指只加刚好够的电解液。");

  // ---------------- 22. Materials scale-up ----------------
  s = d.slide("CONTENT");
  s.addText("材料放大：从 10 克到 1 吨会遇到什么", { placeholder: "title" });
  d.fig(s, "scaleup", { x: 0.5, y: 1.2, w: 6.9, h: 4.3 });
  d.caption(s, "据 Xiao 2023 Fig. 1 与 pp. 330–336 重绘、简化。", { x: 0.6, y: 5.5, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.highNi },
    { kind: "why", size: 13, body: "实验室小批量容易混匀、不计成本；吨级生产要换便宜原料（如用 Li₂CO₃ 代替 LiOH），大窑炉温度要匀，还要防设备磨下来的金属屑。" },
    { kind: "matters", size: 13, body: "金属杂质会造成自放电甚至内短路。线速 60 m/min 时，传感器检查 1 mm 电极只有 1 ms。" },
  ], 0.16, 5.75, "scaleup");
  d.quote(s, Q.xiaoInsurmountable);
  s.addNotes("凝胶的原因（Xiao 2023 Fig. 2a）：高镍正极表面残留的锂盐吸水后生成 LiOH，浆料变碱性，PVDF 在碱性下脱去 HF、交联，浆料就凝成果冻状，没法涂布。实验室用很稀的浆料、小面积刮涂，这个问题不明显，放大后才暴露出来。60 m/min 等于 1 m/s，也就是 1 mm/ms。");

  // ======== Section 5 ========
  d.section("5 校注与小结");
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文的笔误与读表注意", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const colI = i % 2, row = Math.floor(i / 2);
    d.block(s, { x: colI ? 6.8 : 0.6, y: 1.25 + row * 1.85, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
  });
  s.addNotes("另有一处小问题：Kwade 2018 p. 294 写“Formatting and aging”，应为 formation。最后一条是实验室常见的误解，第 5 章会用数据详细讨论。读综述时，把正文数字和表格对一对，往往能发现这类问题。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["三段工艺链", "电极制备 → 电芯组装（干燥间）→ 化成老化；1990 年代定型，电动车时代放大"],
    ["四种形态", "扣式筛材料；圆柱、软包、方形上车；电芯越做越大，是为了减少“死重”"],
    ["钱和能量", "材料约占 75%；化成老化约占制造费用的 33%，干燥与溶剂回收约占能耗的 47%；良率连乘"],
    ["实验室 ≠ 工厂", "薄电极、富液、扣式半电池的数据要打折扣。下一章：从粉末到浆料，再到涂层"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.kwadeThreeScales.en}”`, options: { italic: true, fontSize: 14, color: "FFFFFF", breakLine: true } },
    { text: `${Q.kwadeThreeScales.zh}  —— ${Q.kwadeThreeScales.ref}`, options: { fontSize: 13, color: "CADCE8" } },
  ], { x: 0.7, y: 5.85, w: 11.9, h: 1.05, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("本章是地图：知道每一步在哪、为什么存在、花多少钱。下一章从第一步开始：电极由哪些成分组成，粉末怎样变成浆料，浆料怎样涂成均匀的涂层，以及实验室的刮刀和工厂的狭缝挤压有什么不同。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
