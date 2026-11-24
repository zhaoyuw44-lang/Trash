// 锂电池发展史 — 第 6 章：1997–今：LFP、三元与固态电池
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch6_quotes");

const PAPER = {
  short: "锂电池发展史",
  full: "本章原始文献：A. K. Padhi, K. S. Nanjundaswamy & J. B. Goodenough, Phospho-olivines as Positive-Electrode Materials for Rechargeable Lithium Batteries, J. Electrochem. Soc. 144, 1188–1194 (1997)。",
};

// Linear interpolation of digitized anchor points onto a common x grid.
function interp(anchors, xs) {
  return xs.map((x) => {
    if (x <= anchors[0][0]) return anchors[0][1];
    for (let i = 0; i < anchors.length - 1; i++) {
      const [x1, y1] = anchors[i], [x2, y2] = anchors[i + 1];
      if (x >= x1 && x <= x2) return +(y1 + ((y2 - y1) * (x - x1)) / (x2 - x1)).toFixed(3);
    }
    return anchors[anchors.length - 1][1];
  });
}

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch6_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 6, chapterTitle: "1997–今：LFP、三元与固态电池", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const axisText = { valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const axisTitles = (xt, yt) => ({
    showCatAxisTitle: true, catAxisTitle: xt, catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
    showValAxisTitle: true, valAxisTitle: yt, valAxisTitleFontSize: 12, valAxisTitleColor: HEX.dk2,
  });
  const legend = { showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1 };
  const grid = { valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" } };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 6 章\n便宜、安全、走进汽车", { placeholder: "title" });
  s.addText("1997–今：LFP、三元与固态电池", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.75, w: 7.6, h: 1.2, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("到 1991 年，锂离子电池已经上市（第 5 章）。这一章讲之后的 30 年：电池要从手机走进汽车和电网，最重要的指标从“每克存多少能量”变成了“每块钱存多少能量”。主角论文是 Goodenough 的第二个重要正极：1997 年的磷酸铁锂 (LiFePO₄)。最后我们会把 6 章串起来回顾。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "LFP：便宜、安全的铁正极", "诱导效应、橄榄石、两相平台、碳包覆"],
    ["2", "三元正极与电动车", "NCA 与 NMC、电池包降价、LFP 回归"],
    ["3", "下一代电池", "固态电解质、锂金属与硅、干法电极、回收"],
    ["4", "校注与全系列回顾", "原文数字核对，6 章串起来看"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  card(s, 7.4, 1.45, 5.35, 2.4, "F1ECF8");
  s.addText("上一章回顾", { x: 7.65, y: 1.6, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent3, margin: 0, isTextBox: true });
  s.addText("第 4 章：1980 年 Goodenough 提出 LiCoO₂，第一个 4 V 嵌入正极。\n第 5 章：1991 年 Sony 锂离子电池上市，手机、笔记本都用上了它。", { x: 7.65, y: 2.05, w: 4.9, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.05, 5.35, 2.55, "FDF2E7");
  s.addText("本章问题", { x: 7.65, y: 4.2, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent1, margin: 0, isTextBox: true });
  s.addText("电池要装进汽车、接入电网：\n① 能不能更便宜？（钴太贵）\n② 能不能更安全？（满电正极会放氧）\n③ 能不能存更多能量？（固态、锂金属）", { x: 7.65, y: 4.65, w: 4.9, h: 1.85, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 4, isTextBox: true });
  s.addNotes("前几章的阅读标签照旧：史（年份、人物、贡献）、变（以前怎么做 → 为什么改）、要（为什么重要）、引（原文金句）。这一章只有一篇主论文，即 Padhi、Nanjundaswamy 与 Goodenough 1997 年的 LiFePO₄ 论文；三元正极、电动车和固态电池部分是对后续历史的概述，没有引用其他论文的原句。");

  // ---------------- 3. Era timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：1987–2020，正极、汽车与固态三条线", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.3 });
  d.block(s, { x: 0.6, y: 5.55, w: 5.9, kind: "why", tint: true, size: 13, body: "1990 年代的问题是“钴贵、高电压不安全”。答案分两路：换便宜的铁（LFP），或少用钴（三元）。" });
  d.block(s, { x: 6.8, y: 5.55, w: 5.9, kind: "matters", tint: true, size: 13, body: "2010 年后电动车把需求放大了上千倍，价格和安全成了第一指标；固态电池则在为下一代做准备。" });
  s.addNotes("时间轴不按比例。紫色是正极材料，橙色是电动车与产业，青色是固态电解质。注意 LiPON（1992）比 LFP 还早：固体电解质的研究一直在进行，只是长期停留在薄膜电池等小众用途。");

  // ======== Section 1 ========
  d.section("1 LFP");
  s = d.slide("DARK_SECTION");
  s.addText("1  LFP：便宜、安全的铁正极", { placeholder: "title" });
  s.addText("钴太贵 · 诱导效应 · 橄榄石结构 · 两相平台 · 倍率问题与碳包覆", { placeholder: "body" });
  s.addNotes("这一节精读 Padhi、Nanjundaswamy 与 Goodenough 1997 年的论文。全文只有 7 页，却回答了三个问题：为什么铁能做 3.5 V 正极，为什么电压是平的，为什么电流一大容量就掉。");

  // ---------------- 5. Cost / iron problem ----------------
  s = d.slide("CONTENT");
  s.addText("1990 年代的难题：钴太贵，铁又“不好用”", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "地壳丰度", labels: ["铁 Fe", "锰 Mn", "镍 Ni", "钴 Co", "锂 Li"], values: [56300, 950, 84, 25, 20] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 3.9, barDir: "bar",
    chartColors: [HEX.accent1, HEX.accent6, HEX.accent2, HEX.accent3, HEX.accent6],
    showValue: true, dataLabelFormatCode: "#,##0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisLogScaleBase: 10, valAxisMinVal: 1, valAxisMaxVal: 1000000,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "地壳中的丰度（ppm，对数轴）", showLegend: false,
  });
  d.caption(s, "约值，据 CRC Handbook 的地壳元素丰度表。铁约是钴的 2,000 倍。", { x: 0.6, y: 5.25, w: 6.6, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.ironProblem },
    { kind: "why", size: 13, body: "手机电池小，贵一点没关系，看重 Wh/g（每克存多少能量）。电动车要几百公斤电池，作者认为更该看 Wh/$（每块钱存多少能量）。" },
    { kind: "matters", size: 13, body: "这句话写于 1997 年，二十多年后应验：今天最便宜的动力和储能电池，正是磷酸铁锂。" },
  ], 0.16);
  d.quote(s, Q.whPerDollar);
  s.addNotes("原文第 1189 页列出了当时三种商用正极 LiCoO₂、LiNiO₂、LiMn₂O₄ 的问题：4 V 以上会分解电解液、满电态不稳定、尖晶石有 Jahn–Teller 畸变导致容量衰减，最后一条就是价格。“load-leveling”指电网调峰储能。铁的问题在下一页：氧化物里铁的电压不合适。");

  // ---------------- 6. Inductive effect ----------------
  s = d.slide("CONTENT");
  s.addText("诱导效应：用磷酸根把铁的电压“拉高”", { placeholder: "title" });
  d.fig(s, "inductive", { x: 0.5, y: 1.25, w: 6.9, h: 4.4 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.nasicon },
    { kind: "why", size: 13, body: "以前只用 O²⁻ 做阴离子，铁的电压改不了。改用聚阴离子 PO₄³⁻、SO₄²⁻ 后，P–O、S–O 强共价键把 O 的电子拉走，Fe–O 键变弱，Fe³⁺/Fe²⁺ 能级下降，电压升高。" },
    { kind: "matters", size: 13, body: "正极设计多了一个旋钮：不换金属，只换阴离子或结构，就能调电压。后来的磷酸锰铁锂、氟磷酸盐都沿用这个思路。" },
  ], 0.16);
  d.quote(s, Q.inductive);
  s.addNotes("诱导效应 (inductive effect) 本来是有机化学的概念：一个强吸电子基团会影响旁边化学键的电子分布。原文用“能级”说话：Fe³⁺/Fe²⁺ 能级在锂的费米能级下方 3.5 eV，就对应相对锂 3.5 V。原文还区分了两件事：SO₄ 比 PO₄ 高 0.8 V 是诱导效应；同样是 PO₄，橄榄石比 NASICON 高 0.7 V，作者归因于 Madelung 静电势（结构不同）。");

  // ---------------- 7. Olivine ----------------
  s = d.slide("CONTENT");
  s.addText("橄榄石结构：锂排成链，PO₄ 把框架钉牢", { placeholder: "title" });
  d.fig(s, "olivine", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "据原文 Fig. 1(a) 理想 hcp 模型与 Fig. 6 简化重绘（示意，未按比例）。六边形 = 八面体，三角形 = 四面体。", { x: 0.6, y: 5.9, w: 6.8, h: 0.5 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：橄榄石 (olivine)", size: 13, body: "一类矿物结构，通式 M₂XO₄。LiFePO₄ 中 Li、Fe 各占一半八面体位置，P 占四面体位置。" },
    { kind: "hist", size: 13, body: Q.facts.olivine },
    { kind: "why", size: 13, body: "层状 LiCoO₂ 里锂在平面内走；橄榄石里锂只能沿一维的锂链走。PO₄ 把框架绑得很牢：结构稳，但锂走得慢。" },
    { kind: "matters", size: 13, body: "框架几乎不变，所以循环寿命长；一维通道也解释了后来为什么要把颗粒做小。" },
  ], 0.14);
  s.addNotes("原文第 1189 页：LiMPO₄（M = Mn、Fe、Co、Ni）都是有序橄榄石；锂占 M1 位，过渡金属占 M2 位。M1 八面体共棱连成长链，M2 八面体共顶点。原文还试了 Mn、Co、Ni：当时的电解液（LiClO₄/PC+DME）只能充到约 4.3 V，取不出锂；在 LiFe₁₋ₓMnₓPO₄ 中看到了 4.1 V 的 Mn³⁺/Mn²⁺ 平台，这就是今天磷酸锰铁锂 (LMFP) 的源头。");

  // ---------------- 8. Two-phase plateau (Fig. 2) ----------------
  s = d.slide("CONTENT");
  s.addText("两相反应：为什么 LFP 的电压是一条平线", { placeholder: "title" });
  const capX = [2]; for (let x = 4; x <= 128; x += 4) capX.push(x);
  const chg = [[1, 3.30], [4, 3.42], [20, 3.44], [50, 3.46], [80, 3.49], [90, 3.51], [97, 3.54], [102, 3.58], [106, 3.63], [110, 3.70], [114, 3.80], [118, 3.90], [122, 4.00], [126, 4.15], [130, 4.29]];
  const dis = [[3, 3.42], [20, 3.40], [50, 3.38], [70, 3.37], [85, 3.34], [92, 3.31], [98, 3.26], [104, 3.18], [108, 3.08], [112, 2.95], [116, 2.80], [120, 2.60], [124, 2.38], [127, 2.15], [128, 2.05]];
  s.addChart(d.pres.charts.SCATTER, [
    { name: "X", values: capX },
    { name: "充电（脱锂）", values: interp(chg, capX) },
    { name: "放电（嵌锂）", values: interp(dis, capX) },
  ], {
    x: 0.5, y: 1.25, w: 6.7, h: 4.1, chartColors: [HEX.accent1, HEX.accent3], lineSize: 3, lineDataSymbol: "none",
    valAxisMinVal: 2, valAxisMaxVal: 4.5, valAxisMajorUnit: 0.5, valAxisLabelFormatCode: "General", catAxisMinVal: 0, catAxisMaxVal: 160, catAxisMajorUnit: 20,
    showTitle: true, title: "LiFePO₄ 的充放电曲线（相对 Li）", ...axisText, ...legend, ...grid,
    ...axisTitles("容量（mAh/g）", "电压（V）"),
  });
  d.caption(s, "据原文 Fig. 2 近似读图重绘。电流 2 mA/g（约 C/85），室温。理论容量 170 mAh/g。", { x: 0.6, y: 5.4, w: 6.6, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "why", size: 13, body: "像冰水混合物：冰没化完，温度就停在 0 °C。颗粒里 LiFePO₄ 和 FePO₄ 两相共存，电压就停在约 3.4 V（Gibbs 相律）。以前的 LiCoO₂ 是固溶体，电压随含锂量一路变化。" },
    { kind: "hist", size: 13, body: Q.facts.twoPhase },
    { kind: "matters", size: 13, body: "平的电压对用电器友好；但也很难从电压判断“还剩多少电”，今天电动车估算 LFP 电量仍要特别处理。" },
  ], 0.16);
  d.quote(s, Q.gibbs);
  s.addNotes("两相反应 (two-phase reaction)：充电时颗粒里不是均匀地少一点锂，而是一部分完全变成 FePO₄，另一部分还是 LiFePO₄，中间隔着一个界面。原文的反应式：LiFePO₄ − xLi⁺ − xe⁻ → xFePO₄ + (1 − x)LiFePO₄。Gibbs 相律说：恒温恒压下两相平衡时自由度为零，所以电压固定。原文拼作 “Gibb's phase rule”，应为 Gibbs。");

  // ---------------- 9. Interface & rate limit ----------------
  s = d.slide("CONTENT");
  s.addText("原文的局限：电流一大，容量就掉", { placeholder: "title" });
  d.fig(s, "interface", { x: 0.5, y: 1.2, w: 6.9, h: 4.2 });
  d.caption(s, "左图据原文 Fig. 7 重绘，右图按正文 p. 1191 的解释补画（示意）。", { x: 0.6, y: 5.45, w: 6.8, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.rate },
    { kind: "why", size: 13, body: "作者认为是锂穿过两相界面太慢（扩散限制）。后来发现，电子电导率极低（约 10⁻⁹ S/cm 量级）也是主因：电子和锂离子都“进不去”。" },
    { kind: "matters", size: 13, body: "电流调小，容量就回来，说明材料没坏，只是动力学跟不上。这个判断直接指明了后来的改进方向。" },
  ], 0.16);
  d.quote(s, Q.smallCurrent);
  s.addNotes("C/85 的意思是：用 85 小时才能充满一次。今天的 LFP 电池能做到 1C（1 小时）甚至更快。原文的解释是“收缩核”模型：放电时 LiFePO₄ 从颗粒表面向内长，界面越来越小；当界面小到一定程度，单位时间能通过的锂不够提供电流，电池就提前到截止电压。");

  // ---------------- 10. Safety (Fig. 8) ----------------
  s = d.slide("CONTENT");
  s.addText("安全：充满电的 FePO₄ 加热也不放氧", { placeholder: "title" });
  const tT = [65, 84, 100, 158, 216, 281, 322, 364, 405, 447, 463, 480, 493, 500];
  const tW = [100.0, 99.95, 99.95, 99.9, 99.81, 99.73, 99.7, 99.6, 99.49, 99.42, 99.35, 99.12, 98.78, 98.44];
  s.addChart(d.pres.charts.SCATTER, [{ name: "X", values: tT }, { name: "FePO₄ 在氮气中", values: tW }], {
    x: 0.5, y: 1.25, w: 6.7, h: 4.0, chartColors: [HEX.accent2], lineSize: 3, lineDataSymbol: "none",
    valAxisMinVal: 98, valAxisMaxVal: 100.5, valAxisMajorUnit: 0.5, valAxisLabelFormatCode: "General", catAxisMinVal: 50, catAxisMaxVal: 550, catAxisMajorUnit: 50,
    showTitle: true, title: "充电态 FePO₄ 的热重曲线 (TGA)", ...axisText, showLegend: false, ...grid,
    ...axisTitles("温度（°C）", "剩余质量（%）"),
  });
  d.caption(s, "据原文 Fig. 8(a) 近似读图重绘（纵轴放大，只看 2.5% 的范围）。", { x: 0.6, y: 5.3, w: 6.6, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.tga },
    { kind: "why", size: 13, body: "层状氧化物满电后不稳定，放出的氧气遇到有机电解液就会燃烧。PO₄ 中的 P–O 键很强，把氧“锁”在四面体里。" },
    { kind: "matters", size: 13, body: "安全是汽车和储能电站的第一要求。LFP 后来成为公交车、储能电站的首选，靠的就是这一点。" },
  ], 0.16);
  d.quote(s, Q.oxides);
  s.addNotes("TGA（热重分析）测加热时样品质量的变化；如果晶格里的氧跑出来，质量会下降。原文的 180 °C 和 250 °C 引自 Dahn 等 1994 年的热稳定性研究。注意原文只测了正极粉末本身，整只电池的安全还要看电解液和负极（见校注页）。");

  // ---------------- 11. Remedies ----------------
  s = d.slide("CONTENT");
  s.addText("补短板：碳包覆、纳米化、掺杂", { placeholder: "title" });
  d.fig(s, "remedies", { x: 0.5, y: 1.25, w: 6.9, h: 4.4 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.carbon },
    { kind: "why", size: 13, body: "原文的瓶颈是“电子进不去、锂走不快”。包碳等于给电子修一条高速路；颗粒变小，锂要走的路就变短。" },
    { kind: "matters", size: 13, body: "LFP 从此能大电流充放电。2001 年 Chiang 等创办 A123 Systems，把 LFP 推向电动工具和汽车。" },
  ], 0.16);
  d.quote(s, Q.extrinsic);
  s.addNotes("掺杂之争：2002 年 Chiang 小组（Chung、Bloking、Chiang，Nature Materials）报道少量掺杂可使 LFP 电子电导率提高约 10⁸ 倍；2004 年 Nazar 小组认为提高主要来自高温下生成的导电磷化铁等杂相，而非真正的晶格掺杂。这个争论说明：同一个现象，解释可能不止一种。原文作者当年就猜到“只用了 0.6 个 Li”是外在问题，后来的改进证明他们是对的。");

  // ======== Section 2 ========
  d.section("2 三元与电动车");
  s = d.slide("DARK_SECTION");
  s.addText("2  三元正极与电动车时代", { placeholder: "title" });
  s.addText("LiNiO₂ 的麻烦 · NCA 与 NMC · 电池包降价 · LFP 回归 · 2019 诺贝尔奖", { placeholder: "body" });
  s.addNotes("LFP 走“便宜、安全”路线；另一条路线是继续改进第 4 章的层状氧化物，目标是“能量更高、钴更少”。两条路线在电动车上会合。");

  // ---------------- 13. Layered family ----------------
  s = d.slide("CONTENT");
  s.addText("层状正极家族：从 LiCoO₂ 到 NCA、NMC", { placeholder: "title" });
  d.fig(s, "layered_triangle", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "组成三角形示意：顶点为纯 Co、Ni、Mn 的层状氧化物，点的位置表示三种金属的比例。", { x: 0.6, y: 5.9, w: 6.8, h: 0.5 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.layered },
    { kind: "why", size: 13, body: "单一金属各有毛病：Co 贵，Ni 不稳，Mn 的层状结构容易变成尖晶石。把三种混在一起，取长补短。" },
    { kind: "matters", size: 13, body: "NMC 和 NCA 成了 2010 年代电动车的主力正极，能量密度明显高于 LFP，续航更长。" },
  ], 0.16);
  s.addNotes("NMC111 指 Ni : Mn : Co = 1 : 1 : 1，即 LiNi₁/₃Mn₁/₃Co₁/₃O₂；NMC811 指 8 : 1 : 1。NCA 是 LiNi₀.₈Co₀.₁₅Al₀.₀₅O₂ 一类，少量 Al 起稳定作用。LiNiO₂ 的麻烦：Ni²⁺ 和 Li⁺ 大小相近，合成时一部分 Ni 跑进锂层（阳离子混排, cation mixing），堵住锂的通道；满电时又容易放氧。Ohzuku 与 Makimura 2001 年发表于 Chem. Lett.，Lu 与 Dahn 等 2001 年发表于 Electrochem. Solid-State Lett.。");

  // ---------------- 14. Typical values chart ----------------
  s = d.slide("CONTENT");
  s.addText("常见正极：容量与电压（典型值）", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "实用比容量", labels: ["LiMn₂O₄ · 4.0 V", "LiCoO₂ · 3.9 V", "LiFePO₄ · 3.4 V", "NMC111 · 3.7 V", "NCA · 3.7 V", "NMC811 · 3.7 V"], values: [115, 145, 160, 160, 195, 200] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent3, HEX.accent1, HEX.accent2, HEX.accent2, HEX.accent2],
    showValue: true, dataLabelFormatCode: "0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 240, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "实用比容量（mAh/g）· 平均电压", showLegend: false,
  });
  d.caption(s, "典型值（约值），随充电截止电压和厂家而变，并非某一篇论文的数据。", { x: 0.6, y: 5.65, w: 6.6, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.highNi },
    { kind: "why", size: 13, body: "镍多 → 容量高；钴少 → 便宜、供应风险小。代价是热稳定性和寿命变差，要靠表面包覆、掺杂、单晶颗粒来弥补。" },
    { kind: "matters", size: 13, body: "钴价波动大（2017–2018 年曾大涨），产地高度集中在刚果（金）。降钴、去钴成了正极研发的主线之一。" },
  ], 0.16);
  s.addNotes("比能量 ≈ 容量 × 电压。例如 NCA 约 195 × 3.7 ≈ 720 Wh/kg（仅正极材料），LFP 约 160 × 3.4 ≈ 540 Wh/kg。LFP 的容量并不低，差在电压低、密度小。全球约七成的钴矿产量来自刚果（金）（美国地质调查局 USGS 历年数据，约值）。");

  // ---------------- 15. EV & pack cost ----------------
  s = d.slide("CONTENT");
  s.addText("电动车时代：电池包价格降了约九成", { placeholder: "title" });
  s.addChart(d.pres.charts.LINE, [{ name: "电池包价格", labels: ["2010", "2013", "2016", "2019", "2021", "2023", "2024"], values: [1100, 650, 300, 160, 140, 140, 115] }], {
    x: 0.5, y: 1.25, w: 6.7, h: 3.9, chartColors: [HEX.accent1], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 9,
    showValue: true, dataLabelFormatCode: "#,##0", dataLabelPosition: "t", dataLabelFontSize: 12, dataLabelColor: HEX.dk1,
    valAxisMinVal: 0, valAxisMaxVal: 1300, valAxisLabelFormatCode: "#,##0",
    showTitle: true, title: "锂离子电池包均价（美元/kWh，约值）", ...axisText, showLegend: false, ...grid,
  });
  d.caption(s, "约值，据 BloombergNEF 历年电池包价格调查；各年调查用的美元基准不同，只看趋势。", { x: 0.6, y: 5.2, w: 6.6, h: 0.3 });
  d.block(s, { x: 0.6, y: 5.6, w: 6.6, kind: "matters", size: 13, body: "降到约 100–150 美元/kWh，电动车才开始和燃油车比成本：这正是 1997 年原文说的 Wh/$。" });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.ev },
    { kind: "why", size: 13, body: "以前电动车电池是“借”消费电子的电芯。后来专门为汽车设计电芯、建大型工厂，规模一上去，价格就下来了。" },
    { kind: "def", head: "单位：kWh 与 $/kWh", size: 13, body: "1 kWh = 1 度电。一辆电动车电池约 50–100 kWh；$/kWh 是每度电容量的电池成本。" },
  ], 0.16);
  s.addNotes("Roadster 的电池包由约 6,800 节 18650 电芯（钴酸锂体系）组成，约 53 kWh。Nissan Leaf 的电芯由日产与 NEC 合资的 AESC 生产。价格数字只取趋势：BloombergNEF 每年用当年美元重新折算，所以不同年份报告里同一年的数值会略有不同。");

  // ---------------- 16. LFP comeback ----------------
  s = d.slide("CONTENT");
  s.addText("LFP 的回归：省掉模组，把电芯直接装进电池包", { placeholder: "title" });
  d.fig(s, "pack_ctp", { x: 0.6, y: 1.15, w: 12.1, h: 3.65 });
  d.block(s, { x: c3[0], y: 4.95, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.ctp + "2021 年前后，中国动力电池装机中 LFP 重新超过三元。" });
  d.block(s, { x: c3[1], y: 4.95, w: 3.95, kind: "why", tint: true, size: 13, body: "LFP 单体能量密度低。以前层层包装，空间浪费多；省掉模组，整包的能量密度就追上来了。" });
  d.block(s, { x: c3[2], y: 4.95, w: 3.85, kind: "matters", tint: true, size: 13, body: "便宜、安全、寿命长，又“够用”：今天中低价电动车和储能电站大量使用 LFP。" });
  s.addNotes("模组 (module) 是把十几到几十个电芯装进一个带外壳、支架和线束的小箱子；电池包 (pack) 再装若干模组。CTP 就是 cell-to-pack，跳过模组这一层。刀片电池把 LFP 电芯做成约 1 米长的薄片，直接排满电池包，电芯本身也承担结构作用。这里回到第 5 页的原文金句：Wh/$ 比 Wh/g 更重要。");

  // ---------------- 17. Nobel ----------------
  s = d.slide("CONTENT");
  s.addText("2019 年诺贝尔化学奖：三位锂电池先驱", { placeholder: "title" });
  d.fig(s, "nobel", { x: 0.6, y: 1.2, w: 12.1, h: 3.3 });
  d.block(s, { x: c3[0], y: 4.75, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.nobel });
  d.block(s, { x: c3[1], y: 4.75, w: 3.95, kind: "why", tint: true, size: 13, body: "诺贝尔奖最多给 3 人。很多关键贡献者没有获奖，例如第 3–5 章的 Armand、Yazami、Dahn。" });
  d.block(s, { x: c3[2], y: 4.75, w: 3.85, kind: "matters", tint: true, size: 13, body: "它标志着锂电池从“实验室化学”变成改变世界的技术：手机、电动车、电网储能都离不开它。" });
  s.addNotes("回顾获奖工作与本系列的对应：Whittingham 1976 年的 TiS₂ 锂电池（第 2 章）；Goodenough 1980 年的 LiCoO₂（第 4 章）；吉野彰 1985 年用碳负极 + LiCoO₂ 做出锂离子电池原型（第 4 章）。Goodenough 一生贡献了三类重要正极：层状 LiCoO₂、尖晶石 LiMn₂O₄（与 Thackeray 等，1983 年前后）和橄榄石 LiFePO₄。");

  // ======== Section 3 ========
  d.section("3 下一代");
  s = d.slide("DARK_SECTION");
  s.addText("3  下一代电池与全系列回顾", { placeholder: "title" });
  s.addText("固态电解质 · 锂金属与硅负极 · 干法电极与回收 · 6 章回顾", { placeholder: "body" });
  s.addNotes("下一代电池的很多想法其实很老：锂金属负极是第 2 章的主角，固体聚合物电解质是第 3 章的主角。新的是材料和制造方法。");

  // ---------------- 19. Solid-state electrolytes ----------------
  s = d.slide("CONTENT");
  s.addText("固态电解质：把易燃的液体换成固体", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "室温离子电导率", labels: ["PEO–锂盐（第 3 章）≈10⁻⁷", "LiPON（1992）≈2×10⁻⁶", "LLZO（2007）≈3×10⁻⁴", "LGPS（2011）≈1.2×10⁻²", "液态电解液 ≈10⁻²"], values: [1e-7, 2e-6, 3e-4, 1.2e-2, 1e-2] }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.2, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent1],
    showValue: false, ...chartText, ...axisText, catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1,
    catAxisOrientation: "maxMin", valAxisLogScaleBase: 10, valAxisMinVal: 1e-8, valAxisMaxVal: 1, valAxisLabelFormatCode: "0E+0",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "室温离子电导率（S/cm，对数轴）", showLegend: false,
  });
  d.caption(s, "数量级约值，据各原始报道；液态电解液取 1 M LiPF₆/碳酸酯的典型值。", { x: 0.6, y: 5.55, w: 6.6, h: 0.3 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.sse },
    { kind: "why", size: 13, body: "液态电解液易燃，又挡不住锂枝晶。以前的固体电解质比液体慢上千倍，只能做很薄的薄膜电池。LGPS 证明固体也能导得和液体一样快。" },
    { kind: "matters", size: 13, body: "固体电解质不燃，还可能让锂金属负极回归。难点变成了固–固界面接触和大规模制造。" },
  ], 0.16);
  s.addNotes("三类固体电解质各有长短：LiPON 稳定但电导率低，只能做成几微米厚的薄膜；石榴石 LLZO 对锂金属稳定，但是硬陶瓷，界面接触差；硫化物 LGPS 电导率最高、质地较软，但遇水会放出硫化氢，对空气敏感。PEO 一栏是室温值，60–80 °C 时可升到约 10⁻⁴ S/cm（第 3 章）。");

  // ---------------- 20. Anodes ----------------
  s = d.slide("CONTENT");
  s.addText("负极：锂金属卷土重来，硅掺进石墨", { placeholder: "title" });
  d.fig(s, "anodes", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.anodes },
    { kind: "why", size: 13, body: "石墨每 6 个碳只存 1 个锂（372 mAh/g）。锂金属和硅能存约 10 倍，但锂长枝晶、硅体积暴涨。新材料（固体电解质、纳米硅、弹性粘结剂）给老问题带来新解法。" },
    { kind: "matters", size: 13, body: "负极是提高能量密度空间最大的一环；不少高能量电池已在石墨里掺入少量硅。" },
  ], 0.16);
  s.addNotes("硅完全嵌锂形成 Li₁₅Si₄，体积约变为原来的 3.8 倍（膨胀约 280%）。颗粒反复胀缩会开裂，新暴露的表面又要重新长 SEI（第 3 章），不断消耗锂和电解液。锂金属的老问题是枝晶（第 2 章）和 1989 年 Moli 的安全事故（第 5 章）。固体电解质原本被寄望“用硬墙挡住枝晶”，但实验发现锂仍会沿晶界和缺陷钻进陶瓷。");

  // ---------------- 21. Manufacturing & recycling ----------------
  s = d.slide("CONTENT");
  s.addText("制造与回收：电池怎么做，用完怎么办", { placeholder: "title" });
  d.fig(s, "manufacturing", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.dry },
    { kind: "why", size: 13, body: "湿法要烘干溶剂，耗能多，NMP 有毒还得回收；干法靠 PTFE 拉成细丝把粉末“缠”成膜，不用溶剂。回收：以前只盯着钴、镍，电池量大了，锂也值得回收。" },
    { kind: "matters", size: 13, body: "2023 年欧盟《电池法规》对回收率和再生材料比例提出要求。LFP 不含钴、镍，回收更难赚钱，需要“直接再生”等新工艺。" },
  ], 0.16);
  s.addNotes("“黑粉” (black mass) 是电池破碎、分选后得到的正负极粉末混合物。火法 (pyrometallurgy) 把它高温熔炼，回收镍、钴、铜；湿法 (hydrometallurgy) 用酸溶解再分离沉淀；直接再生 (direct recycling) 尽量保留正极晶体，只补回失去的锂。原文第 1190 页的电极制法（活性物 : 乙炔黑 : PTFE = 70 : 25 : 5，擀成薄片）是实验室常用的做法，和今天的干法电极思路相近。");

  // ======== Section 4 ========
  d.section("4 校注与回顾");
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文数字与常见说法", { placeholder: "title" });
  Q.corrections.forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    d.block(s, { x: col ? 6.8 : 0.6, y: 1.3 + row * 1.85, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
  });
  s.addNotes("第 1 条是最常见的误读：1997 年论文的价值是找到了材料和机理，而不是做出了能快充的电池。第 2、3 条是对原文数字的复算：LiFePO₄ 摩尔质量 157.76 g/mol，理论容量 26 801 ÷ 157.76 ≈ 170 mAh/g，0.6 Li 约 102 mAh/g。第 5 条提醒：读老文献比较晶格常数时，先确认作者用的是哪种坐标轴取法。");

  // ---------------- 23. Series recap ----------------
  s = d.slide("CONTENT");
  s.addText("全系列回顾：两百年，六章", { placeholder: "title" });
  d.fig(s, "series_recap", { x: 0.5, y: 1.1, w: 12.3, h: 3.95 });
  d.block(s, { x: 0.6, y: 5.15, w: 5.9, kind: "why", tint: true, size: 13, head: "老想法，新材料", body: "锂金属负极：1970 年代 → 1989 年放弃 → 今天配固体电解质再试。聚合物电解质：1978 年 Armand → 2011 年 Bolloré 锂金属聚合物电池用于巴黎 Autolib' 共享汽车。" });
  d.block(s, { x: 6.8, y: 5.15, w: 5.9, kind: "matters", tint: true, size: 13, body: "很多“新”电池是老想法 + 新材料 + 新制造。读原始论文，能看清哪些问题当年就没解决、至今仍是难点：枝晶、界面、成本。" });
  s.addNotes("六章的主线：第 1 章准备好电池原理、锂和非水溶剂；第 2 章嵌入化学与锂金属电池；第 3 章聚合物电解质与 SEI；第 4 章 LiCoO₂ 与碳负极；第 5 章从事故到上市；第 6 章便宜、安全与下一代。Bolloré 的电池用 PEO 类聚合物电解质和锂金属负极，要加热到 60–80 °C 工作，几乎就是 Armand 1978 年设想的直接后代。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.5, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["聚阴离子 + 诱导效应：铁也能做 3.4 V 正极", "Padhi、Nanjundaswamy & Goodenough 1997：LiFePO₄，便宜、无毒，充电态不放氧"],
    ["两相反应 → 平电压；弱点是导电差", "碳包覆（1999–2001）与纳米化让 LFP 能大电流工作"],
    ["层状正极：LiCoO₂ → NCA / NMC → 高镍低钴", "Ohzuku & Makimura、Lu & Dahn 2001；钴贵是主要动力"],
    ["电动车让 Wh/$ 成为第一指标", "电池包价格 2010→2024 降约九成（BNEF，约值）；LFP 借 CTP、刀片电池回归"],
    ["下一代：老想法 + 新材料", "固态电解质（LiPON、LLZO、LGPS）、锂金属、硅、干法电极与回收"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.4 + i * 0.88;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.36, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.abstract.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.abstract.zh}  —— ${Q.abstract.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("1997 年作者谦虚地说它适合“低功率”电池；二十多年后，经过碳包覆、纳米化和电池包结构创新，LFP 成了产量最大的正极之一。全系列到此结束：锂电池的历史不是一条直线，而是许多老想法在新材料、新制造条件下的反复回归。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
