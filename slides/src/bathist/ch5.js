// 锂电池发展史 — 第 5 章：1989–1991 从 Moli 召回到 Sony 上市
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch5_quotes");

const PAPER = {
  short: "锂电池发展史",
  full: "本章原始文献：R. Fong, U. von Sacken & J. R. Dahn, Studies of Lithium Intercalation into Carbons Using Nonaqueous Electrochemical Cells, J. Electrochem. Soc. 137 (7), 2009–2013 (1990)。作者单位：Moli Energy Limited, Burnaby, B.C., Canada。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch5_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 5, chapterTitle: "1989–1991：从 Moli 召回到 Sony 上市", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  // left figure + right column (standard concept layout)
  const figCol = (s, fig, blocks, o = {}) => {
    d.fig(s, fig, { x: 0.5, y: 1.25, w: 6.9, h: o.figH || 4.6 });
    return d.column(s, 7.75, o.y || 1.35, 5.0, blocks, o.gap ?? 0.18);
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 5 章\n为什么等到 1991 年？", { placeholder: "title" });
  s.addText("1989–1991：从 Moli 召回到 Sony 上市", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.6, w: 7.6, h: 1.3, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("第 4 章结束时，LiCoO₂ 正极加碳负极的“锂离子原型”在 1985 年前后已经有了专利。可是直到 1991 年，第一颗商品锂离子电池才上市。这一章讲中间这几年发生了什么：一场召回让行业放弃了金属锂；一篇 1990 年的论文讲清了碳负极第一圈到底发生了什么；然后 Sony 把它做成了商品。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "锂金属为什么被放弃", "Moli 的 Li/MoS₂ 电池、枝晶、热失控、1989 年召回"],
    ["2", "碳负极的第一圈", "Fong、von Sacken、Dahn 1990：不可逆容量与 SEI"],
    ["3", "Sony 1991 上市", "第一颗锂离子电池、名字的由来、能量密度"],
    ["4", "校注与小结", "常见说法的更正，原文的笔误，本章要点"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  card(s, 7.4, 1.45, 5.3, 2.45, "F1ECF8");
  s.addText("上一章回顾（第 4 章）", { x: 7.65, y: 1.58, w: 4.9, h: 0.42, fontSize: 17, bold: true, color: C.accent3, margin: 0, valign: "middle", isTextBox: true });
  s.addText("1980 年 Goodenough：LiCoO₂ 正极，自带锂。\n1983 年 Yazami：锂能可逆地嵌进石墨。\n1985 年前后 Yoshino：LiCoO₂ + 碳，锂离子原型。", { x: 7.65, y: 2.05, w: 4.9, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.1, 5.3, 2.5, "FDF2E7");
  s.addText("本章问题", { x: 7.65, y: 4.23, w: 4.9, h: 0.42, fontSize: 17, bold: true, color: C.accent1, margin: 0, valign: "middle", isTextBox: true });
  s.addText("原型 1985 年就有了，为什么 1991 年才上市？\n碳负极第一次充电为什么总会“丢”一部分锂？\n这部分损失是坏事还是好事？", { x: 7.65, y: 4.7, w: 4.9, h: 1.8, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("左边是本章四部分，右边是和上一章的衔接。第 4 章的原型解决了“用什么材料”，但没有回答“为什么非要放弃金属锂”和“碳负极的第一圈损失从哪来”。这两个问题正是本章的主线。阅读标签（史、变、要、引）与第 1 章相同。");

  // ---------------- 3. Era timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从石墨嵌锂到第一颗锂离子电池", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "四条线并行：碳材料（紫）、界面与电解液（青）、锂金属电池（红）、锂离子电池（橙）。1989–1991 年，红线断了，其他三条线汇合。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "Fong 等的论文正好写在 Moli 召回的那一年。它解释了碳负极为什么可行，成为锂离子电池的科学基础之一。" });
  s.addNotes("时间轴不按比例。Hérold 1955 年的工作是纯化学合成，和电池无关；Dey 与 Sullivan 1970 年发现 PC 在石墨上分解，这个“坏消息”让石墨负极搁置了很多年。Molicel 上市的具体年份各处说法不一，这里只写 1980 年代末。");

  // ======== Section 1 ========
  d.section("1 锂金属为什么被放弃");
  s = d.slide("DARK_SECTION");
  s.addText("1  锂金属为什么被放弃", { placeholder: "title" });
  s.addText("Moli 的 Li/MoS₂ 电池 · 枝晶 · 热失控 · 1989 年召回", { placeholder: "body" });
  s.addNotes("第一部分讲一个商业故事，但背后是一个材料问题：金属锂做负极，每充一次电都要重新“长”一遍。");

  // ---------------- 5. Moli ----------------
  s = d.slide("CONTENT");
  s.addText("Moli Energy：把可充电锂金属电池卖给消费者", { placeholder: "title" });
  figCol(s, "molicel", [
    { kind: "hist", size: 13, body: Q.facts.moli },
    { kind: "why", size: 13, body: "1970 年代的锂一次电池用完就扔。Moli 想要能充电的锂电池：正极换成能反复嵌锂的 MoS₂，负极仍用能量最高的金属锂。" },
    { kind: "matters", size: 13, body: "这是最早大批卖给消费者的可充电锂金属电池之一。它的失败，让整个行业转了方向。" },
  ]);
  s.addNotes("MoS₂（二硫化钼）和第 2 章的 TiS₂ 一样是层状硫化物，锂离子可以钻进层间。Moli 的创始团队来自 UBC 物理系，研究的正是这类层状材料的嵌锂。本章论文的第三作者 Dahn，博士导师就是 Moli 的创始人 Haering。");

  // ---------------- 6. Dendrites ----------------
  s = d.slide("CONTENT");
  s.addText("枝晶：金属锂为什么越用越危险", { placeholder: "title" });
  figCol(s, "dendrite", [
    { kind: "def", head: "定义：枝晶 (dendrite)", size: 13, body: "锂在负极上镀得不均匀，长成树枝状或苔藓状的细丝。" },
    { kind: "hist", size: 13, body: Q.facts.dendrite },
    { kind: "why", size: 13, body: "每次充电都要重新镀一层锂。凸起处电场更强，长得更快，像“富者愈富”。苔藓锂表面积大，每圈都要重新长膜，吃掉锂和电解液。" },
    { kind: "matters", size: 13, body: "电池越旧越危险：新电池测试合格，不代表用了几十次之后还安全。" },
  ], { gap: 0.14 });
  s.addNotes("枝晶在第 2 章已经出现过，这里强调一个新角度：危险是“累积”出来的。为了抵消每圈损失的锂，可充电锂金属电池通常要多放好几倍的锂，这些多余的锂又成了燃料。");

  // ---------------- 7. Thermal runaway + recall ----------------
  s = d.slide("CONTENT");
  s.addText("热失控与 1989 年召回", { placeholder: "title" });
  figCol(s, "runaway", [
    { kind: "def", head: "定义：热失控 (thermal runaway)", size: 13, body: "电池内部的放热反应自我加速，温度失去控制。" },
    { kind: "hist", size: 13, body: Q.facts.recall },
    { kind: "why", size: 13, body: "比喻：像山火。一个火星（短路）点着枯草（锂 + 电解液），火越大烧得越快。以前以为“不短路就安全”；事故说明金属锂负极本身就是燃料。" },
    { kind: "matters", size: 13, body: "此后，业界基本放弃了消费级可充电锂金属电池，转向“没有金属锂”的设计。" },
  ], { gap: 0.14 });
  s.addNotes("关于这次事故，公开资料里的细节（具体机型、数量）说法不一，这里只写有把握的部分：1989 年、手机电池起火、召回、公司破产接管。后来 Moli 的研究人员用量热实验比较过：循环过的锂金属比嵌了锂的碳更容易引发热失控。");

  // ======== Section 2 ========
  d.section("2 碳负极的第一圈");
  s = d.slide("DARK_SECTION");
  s.addText("2  碳负极的第一圈", { placeholder: "title" });
  s.addText("Fong, von Sacken & Dahn 1990 · 不可逆容量 · 比表面积 · SEI · PC 与 EC · 循环与分阶", { placeholder: "body" });
  s.addNotes("第二部分精读本章的原始论文。它只有 5 页，但把碳负极“第一圈”这件事讲得非常清楚。");

  // ---------------- 9. Half cell ----------------
  s = d.slide("CONTENT");
  s.addText("实验：用 Li/碳 半电池单独研究碳", { placeholder: "title" });
  figCol(s, "halfcell", [
    { kind: "hist", size: 13, body: Q.facts.paper },
    { kind: "why", size: 13, body: "整颗电池里两个电极都在变，分不清是谁的问题。用锂箔做对电极，它的电位几乎不变，测到的电压变化就全来自碳。" },
    { kind: "def", head: "符号：LixC6 中的 x", size: 13, body: "每 6 个碳原子里嵌进 x 个锂。x = 1 即 LiC₆，相当于 372 mAh/g。" },
    { kind: "matters", size: 13, body: "半电池至今仍是研究新电极材料的标准做法。" },
  ], { gap: 0.14 });
  s.addNotes("实验细节（原文 p. 2010）：电解液 1 M LiAsF₆ 溶于 PC:EC = 50:50（体积比）；电极 1.2 × 1.2 cm，活性物质 14 mg；隔膜是多孔聚丙烯 Celgard 2500；21 °C 恒流充放电。注意 LiAsF₆ 含砷，今天已不用，商品电池用 LiPF₆。");

  // ---------------- 10. Two carbons ----------------
  s = d.slide("CONTENT");
  s.addText("为什么是碳？石油焦与石墨", { placeholder: "title" });
  figCol(s, "carbons", [
    { kind: "hist", size: 13, body: Q.facts.carbon },
    { kind: "why", size: 13, body: "金属锂每次都要重新长。碳是“宿舍”：锂住进层间，碳的骨架不变，就不长枝晶。石油焦便宜、结构乱；石墨整齐、容量大，但更“娇气”。" },
    { kind: "matters", size: 13, body: "LiC₆ 的电位只比金属锂高约 0.1 V：电压几乎不损失，安全性却高得多。" },
  ], { figH: 4.3 });
  d.quote(s, Q.carbon);
  s.addNotes("石油焦 (petroleum coke) 是炼油的副产品，原文用的样品在约 1300 °C 煅烧过。它的碳层很小、乱叠（原文称 turbostratic，乱层结构），所以每 6 个碳只能可逆地放约 0.5 个锂，电压也从 1 V 左右一路斜着往下走。石墨能放满 1 个锂，电压低而平。");

  // ---------------- 11. Fig. 2 ----------------
  s = d.slide("CONTENT");
  s.addText("第一圈的电压曲线：多出来的一段", { placeholder: "title" });
  d.fig(s, "fig2_redraw", { x: 0.6, y: 1.1, w: 12.1, h: 3.85 });
  d.caption(s, "据原文 Fig. 2 重绘（近似数字化）。F = 成膜 (film)，E = 石墨剥离 (exfoliation)，I = 可逆嵌锂 (intercalation)。恒流，所以时间 ∝ 电量。", { x: 0.6, y: 4.97, w: 12.1, h: 0.3 });
  d.block(s, { x: c3[0], y: 5.35, w: 3.95, kind: "hist", tint: true, size: 13, body: "恒流充放电、记录电压随时间的变化，是电池研究最基本的测量。本文用它把第 1 圈拆成 F、E、I 三段。" });
  d.block(s, { x: c3[1], y: 5.35, w: 3.95, kind: "why", tint: true, size: 13, body: "以前只看第 1 次放电有多长。作者拿它和第 1 次充电比：多出来的部分没有存进碳里。" });
  d.block(s, { x: c3[2], y: 5.35, w: 3.85, kind: "matters", tint: true, size: 13, body: "第 1 圈之后，充电和放电曲线一样长：问题只出在第 1 圈。" });
  s.addNotes("看图 (a)：石油焦第 1 次放电约 17 小时，充电只有约 13 小时，差的 4 小时就是不可逆容量，其中 1.2 V 附近的小台阶 F 是成膜。图 (b) 石墨更夸张：除了 F，还有 0.8 V 附近一段很长的 E，原文认为是石墨层被撑开（剥离）后，新表面又分解了电解液。本图的曲线是读图近似，只保留形状和关键数值。");

  // ---------------- 12. Irreversible capacity ----------------
  s = d.slide("CONTENT");
  s.addText("不可逆容量：第一圈丢掉的锂去哪了？", { placeholder: "title" });
  figCol(s, "irrev_bucket", [
    { kind: "hist", size: 13, body: Q.facts.irrev },
    { kind: "why", size: 13, body: "Arakawa 与 Yamaki 认为锂和 PC 生成了中间化合物。本文换个问法：丢掉的锂去哪了？答案是变成了表面膜。" },
    { kind: "matters", size: 13, body: "全电池里的锂只来自正极 LiCoO₂。第 1 圈丢多少，电池就永远少多少容量。" },
  ], { figH: 4.3 });
  d.quote(s, Q.film);
  s.addNotes("不可逆容量 (irreversible capacity) = 第 1 次放电容量 − 第 1 次充电容量。首次库仑效率 (first-cycle coulombic efficiency) = 第 1 次充电 ÷ 第 1 次放电。原文作者明确说不同意 Arakawa 与 Yamaki 提出的反应机理，并认为问题出在“只用 PC 一种溶剂”。");

  // ---------------- 13. Fig. 3 surface area ----------------
  s = d.slide("CONTENT");
  s.addText("损失与比表面积成正比", { placeholder: "title" });
  d.fig(s, "fig3_redraw", { x: 0.5, y: 1.2, w: 6.9, h: 4.35 });
  d.caption(s, "据原文 Fig. 3 重绘：横坐标取原文 Table II 的比表面积，纵坐标为读图近似值。", { x: 0.6, y: 5.6, w: 6.8, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: "1938 年 Brunauer、Emmett、Teller 提出 BET 法，用气体吸附测比表面积。本文用研磨得到不同表面积的同种碳，再逐一测首圈损失。" },
    { kind: "why", size: 13, body: "如果损失来自“表面反应”，它就该和表面积成正比。画一张图就能检验：结果是一条直线。" },
    { kind: "matters", size: 13, body: "设计规则：负极颗粒的比表面积要小。22.5 m²/g 的石墨，光成膜就要吃掉约 18% 的容量（0.003 × 22.5 ÷ 0.372）。" },
  ], 0.16);
  d.quote(s, Q.area);
  s.addNotes("比表面积 (specific surface area) 是每克材料的总表面积，单位 m²/g。斜率 0.003 Ah/m² 的意思是：每平方米碳表面，第一圈要消耗 0.003 Ah 的电量去成膜。图 (b) 放电到底（0.02 V）时，石油焦的斜率变成 0.007 Ah/m²，说明膜在更低电位下还会继续长厚一些。今天商品石墨负极的比表面积一般只有几 m²/g。");

  // ---------------- 14. Film thickness & SEI ----------------
  s = d.slide("CONTENT");
  s.addText("膜有多厚？刚好挡住电子", { placeholder: "title" });
  figCol(s, "film_calc", [
    { kind: "hist", size: 13, body: Q.facts.sei },
    { kind: "why", size: 13, body: "F = 96 485 C/mol，是每摩尔电子的电量；35 cm³/mol 是 Li₂CO₃ 的摩尔体积。算出约 2 nm，放电到底约 4.5 nm，正是 Peled 估计的量级。" },
    { kind: "matters", size: 13, body: "首圈损失不是缺陷，而是“入场费”：交一次，换来一层保护膜。今天电池出厂前的化成 (formation) 就是在交这笔费。" },
  ], { figH: 4.15 });
  d.quote(s, Q.sei);
  s.addNotes("计算过程：0.003 Ah × 3600 = 10.8 C；10.8 ÷ 96485 ≈ 1.1 × 10⁻⁴ mol 电子；按反应 [1]，2 个电子生成 1 个 Li₂CO₃，即 5.6 × 10⁻⁵ mol；乘摩尔体积 35 cm³/mol 得 1.96 × 10⁻³ cm³，摊在 1 m² 上就是约 2 nm，与原文 21 ± 5 Å 一致。作者很诚实：他们说并不确定反应和膜的成分，红外光谱 (FTIR) 显示膜并不就是 Li₂CO₃，加热后才变成 Li₂CO₃。");

  // ---------------- 15. PC vs EC ----------------
  s = d.slide("CONTENT");
  s.addText("PC 与 EC：只差一个甲基，结局完全不同", { placeholder: "title" });
  figCol(s, "pc_ec", [
    { kind: "hist", size: 13, body: Q.facts.pcec },
    { kind: "why", size: 13, body: "PC 包着的 Li⁺ 连溶剂一起挤进石墨层间，把层撑开（剥离 exfoliation），新表面又分解更多电解液。EC 先长好膜，把溶剂挡在外面。" },
    { kind: "matters", size: 13, body: "石墨负极必须配 EC 基电解液。乱层的石油焦层被“钉”住，在纯 PC 里也能用（原文 Fig. 5）。" },
  ], { figH: 4.3 });
  d.quote(s, Q.ecHelps);
  s.addNotes("原文 p. 2012 的解释：PC 和 EC 形成的膜在化学上未必不同，差别在于被 PC 或 EC 包着的锂离子能不能“共嵌入” (cointercalation) 石墨。原文也承认没有剥离的直接证据，原位 X 射线衍射没看到额外的峰。今天的看法大体支持这个解释。");

  // ---------------- 16. Fig. 7 cycling ----------------
  s = d.slide("CONTENT");
  s.addText("第一圈之后：几乎不再损失", { placeholder: "title" });
  const cyc = (n, f) => Array.from({ length: n }, (_, i) => i + 1).map(f);
  const sparse = (step) => (i) => (i === 1 || i % step === 0 ? String(i) : "");
  const lineOpts = (title, max) => ({
    lineSize: 3, lineDataSymbol: "none", showLegend: false, showTitle: true, title, ...chartText,
    valAxisMinVal: 0.2, valAxisMaxVal: 1.2, valAxisMajorUnit: 0.2, valAxisLabelFormatCode: "0.0",
    catAxisLabelRotate: 0, catAxisLabelFrequency: 1, valGridLine: { color: "E3E8ED", size: 0.75 }, catGridLine: { style: "none" },
    showValAxisTitle: false, showCatAxisTitle: true, catAxisTitle: "循环圈数", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  s.addChart(d.pres.charts.LINE, [{ name: "石油焦", labels: cyc(100, sparse(20)), values: cyc(100, (i) => +(1.01 - (0.07 * (i - 1)) / 99).toFixed(3)) }], {
    x: 0.6, y: 1.25, w: 3.45, h: 3.9, chartColors: [HEX.accent1], ...lineOpts("(a) 石油焦：容量相对值", 100),
  });
  s.addChart(d.pres.charts.LINE, [{ name: "石墨", labels: cyc(20, sparse(5)), values: cyc(20, () => 1.0) }], {
    x: 4.1, y: 1.25, w: 3.3, h: 3.9, chartColors: [HEX.dk1], ...lineOpts("(b) 石墨：容量相对值", 20),
  });
  d.caption(s, "据原文 Fig. 7 重绘（读图近似）：(a) 100 圈后约 0.94；(b) 20 圈保持约 1.0。纵轴为相对第 1 次充电的容量。", { x: 0.6, y: 5.2, w: 6.8, h: 0.45 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.cycle },
    { kind: "why", size: 13, body: "锂金属负极每圈都要重新长膜，每圈都丢锂。碳负极第 1 圈之后，充、放电容量相差不到 2%，说明膜不再长。" },
    { kind: "matters", size: 13, body: "锂离子电池能循环几百上千次，靠的就是“SEI 长一次就基本停下”。" },
  ], 0.16);
  d.quote(s, Q.stop);
  s.addNotes("注意区分两件事：充、放电容量相等（库仑效率高），和容量随圈数不衰减。原文 p. 2013 的“相差 2% 以内”说的是前者；图 (a) 其实 100 圈下降了约 6%。所以摘要里“没有容量损失”说得过满（见校注）。不过和当时的锂金属电池相比，这已经是巨大的进步。");

  // ---------------- 17. Staging ----------------
  s = d.slide("CONTENT");
  s.addText("石墨的“台阶”：分阶嵌锂", { placeholder: "title" });
  figCol(s, "staging", [
    { kind: "def", head: "定义：阶 (stage)", size: 13, body: "n 阶 = 每隔 n 层碳夹一层锂。1 阶 LiC₆ 是每层都夹满。" },
    { kind: "hist", size: 13, body: Q.facts.staging },
    { kind: "why", size: 13, body: "锂不是均匀地慢慢填，而是一层层“整层”地填。两种阶共存时电压不变，于是出现平台。" },
    { kind: "matters", size: 13, body: "石墨电压低而平，全电池电压就高而稳。1991 年的无序碳是斜坡，后来石墨成为主流。" },
  ], { gap: 0.14 });
  d.caption(s, "据原文 Fig. 8b 重绘（近似数字化）；平台电压为近似值。", { x: 0.6, y: 5.9, w: 6.8, h: 0.3 });
  s.addNotes("原文 Fig. 8 比较了第 2 圈和第 19 圈（石墨）、第 99 圈（石油焦）的曲线，几乎完全重合，说明碳的结构在循环中没有被破坏。平台和分阶的对应：约 0.085 V 是 2 阶 LiC₁₂ 变成 1 阶 LiC₆，约 0.12 V 和 0.2 V 对应更高的阶之间的转变。原文只说“平台来自不同阶之间的相变”，具体对应关系来自后来的工作。");

  // ======== Section 3 ========
  d.section("3 Sony 1991 上市");
  s = d.slide("DARK_SECTION");
  s.addText("3  Sony 1991：第一颗锂离子电池", { placeholder: "title" });
  s.addText("LiCoO₂ + 无序碳 · “锂离子”与“摇椅” · 能量密度 · 之后还剩什么问题", { placeholder: "body" });
  s.addNotes("第三部分回到商业史。Sony 的产品和本章论文之间没有直接的引用关系，但两者面对的是同一组问题：用什么碳、配什么电解液、怎样对待第一圈的损失。");

  // ---------------- 19. Sony cell ----------------
  s = d.slide("CONTENT");
  s.addText("Sony 1991：LiCoO₂ + 无序碳", { placeholder: "title" });
  figCol(s, "sony_cell", [
    { kind: "hist", size: 13, body: Q.facts.sony },
    { kind: "why", size: 13, body: "为什么不用石墨？当时石墨还配不好电解液，会剥离；焦炭类无序碳在 PC 里也稳定。为什么用 LiCoO₂？电压高，而且自带锂，负极就不需要金属锂。" },
    { kind: "matters", size: 13, body: "锂离子电池第一次进入消费品。到 1990 年代末，它已成为手机、笔记本电脑的标准电池。" },
  ]);
  s.addNotes("“出厂时是空的”很关键：电池组装时锂全部在 LiCoO₂ 里，负极碳里没有锂，也就没有金属锂。第一次充电时，锂离子搬到碳里，同时在碳表面长出 SEI。这正是本章论文研究的过程。首代电池的负极常被误写成石墨，见校注。");

  // ---------------- 20. Name ----------------
  s = d.slide("CONTENT");
  s.addText("“锂离子”与“摇椅”：名字里的设计思想", { placeholder: "title" });
  figCol(s, "rocking", [
    { kind: "hist", size: 13, body: Q.facts.name },
    { kind: "why", size: 13, body: "1989 年后，“可充电锂电池”和起火联系在了一起。新名字强调：电池里只有锂离子，没有金属锂。" },
    { kind: "matters", size: 13, body: "“锂离子电池”成了通用名词；“摇椅”一词还留在教科书里，用来讲它的工作原理。" },
  ]);
  s.addNotes("摇椅的比喻：锂离子像坐在摇椅上，充电时摇到负极一侧，放电时摇回正极一侧，来回摇，却从不离开椅子（不变成金属锂）。英文文献里也叫 shuttlecock（羽毛球）电池。几种叫法的出处和年份各家说法略有出入，这里只写到年代。");

  // ---------------- 21. Energy density ----------------
  s = d.slide("CONTENT");
  s.addText("能量密度：一节顶三节", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "比能量", labels: ["镍镉 NiCd", "镍氢 NiMH（约 1990）", "锂离子 Sony 1991", "锂离子 今天（高能量型）"], values: [45, 60, 80, 250] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent6, HEX.accent1, HEX.accent3],
    showValue: true, dataLabelFormatCode: "#,##0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 300, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "单体比能量（Wh/kg，典型近似值）", showLegend: false,
  });
  d.caption(s, "典型近似值，不同厂家、型号差别很大；只用于比较量级。", { x: 0.6, y: 5.7, w: 6.6, h: 0.3 });
  d.stat(s, { x: 7.75, y: 1.3, w: 2.4, value: "3.6", unit: "V", label: "锂离子单体平均电压", color: "accent1" });
  d.stat(s, { x: 10.3, y: 1.3, w: 2.5, value: "1.2", unit: "V", label: "镍镉、镍氢单体电压", color: "accent6" });
  d.column(s, 7.75, 3.0, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.energy },
    { kind: "why", size: 13, body: "能量 = 电压 × 电量（第 1 章）。同样的电量，3.6 V 存的能量是 1.2 V 的 3 倍，一节锂离子顶三节镍镉。" },
    { kind: "matters", size: 13, body: "更轻的电池让摄像机、手机、笔记本电脑真正“便携”。" },
  ], 0.16);
  s.addNotes("首代锂离子电池的比能量只比镍氢高三成左右，体积能量密度差得更少；它真正的优势是电压高、没有记忆效应、自放电小。此后 30 年，锂离子电池的比能量又提高了约 3 倍，这是第 6 章的内容。");

  // ---------------- 22. After 1991 ----------------
  s = d.slide("CONTENT");
  s.addText("1991 年之后还剩什么问题？", { placeholder: "title" });
  d.fig(s, "after1991", { x: 0.6, y: 1.2, w: 12.1, h: 3.65 });
  d.block(s, { x: c3[0], y: 4.95, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.after });
  d.block(s, { x: c3[1], y: 4.95, w: 3.95, kind: "why", tint: true, size: 13, body: "EC 能在石墨上长好膜，但室温是固体、很黏。加入低黏度、低熔点的链状碳酸酯（如 DMC），就配成了液体。" });
  d.block(s, { x: c3[2], y: 4.95, w: 3.85, kind: "matters", tint: true, size: 13, body: "今天的主流组合“石墨 + EC 基电解液”，道理在 1990 年这篇论文里已经埋下。" });
  s.addNotes("DMC 是碳酸二甲酯 (dimethyl carbonate)，一种链状碳酸酯，熔点约 4 °C，黏度很低。EC 负责成膜和溶解锂盐，DMC 负责让电解液流动。各条路线具体从哪一年开始，不同公司差别很大，所以这里只写到年代。下一章（第 6 章）讲正极的新材料：LFP、三元和电动车。");

  // ======== Section 4 ========
  d.section("4 校注与小结");
  s = d.slide("CONTENT");
  s.addText("阅读校注：常见说法与原文的出入", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    d.block(s, { x: col ? 6.8 : 0.6, y: 1.3 + row * 1.85, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
  });
  s.addNotes("第一条是对一个流传很广的说法的更正。第二、三条是原文自己的不一致，读图时要小心。第四条提醒：摘要往往比正文说得更满，要回到图里核对。第五条是读老的半电池论文时最容易混淆的地方。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.5, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["金属锂负极被放弃", "每次充电都要重新镀锂 → 枝晶 → 短路 → 热失控；1989 年 Moli 召回"],
    ["碳做锂的“宿舍”", "锂嵌入碳层（LiC₆，约 0.1 V），电池里不再有金属锂"],
    ["第一圈的损失是 SEI 的“入场费”", "与比表面积成正比，膜厚约 2–5 nm，之后几乎不再损失（Fong 等 1990）"],
    ["电解液决定能用哪种碳", "PC 让石墨剥离，EC 能长好膜；无序碳在 PC 里也能用"],
    ["1991 年 Sony 上市", "LiCoO₂ + 无序碳，约 3.6 V，起名“锂离子”。下一章：LFP、三元与电动车"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.45 + i * 0.9;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.5, h: 0.5, fill: { color: C.accent1 }, color: C.background1, fontSize: 17, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.45, y, w: 11.2, h: 0.4, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.45, y: y + 0.4, w: 11.2, h: 0.36, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.cosolvent.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.cosolvent.zh}  —— ${Q.cosolvent.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("一句话总结：锂离子电池不是“发明了一种新材料”就成功了，而是在 1989 年的事故之后，人们弄懂了碳负极第一圈的 SEI，才敢把没有金属锂的设计推向市场。下一章（1997 年至今）：磷酸铁锂、三元正极、电动车与固态电池。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
