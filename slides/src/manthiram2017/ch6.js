// Manthiram, Yu & Wang 2017 — Chapter 6: 介体离子固态电解质与展望
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Manthiram et al., Nat. Rev. Mater. 2017",
  full: "Manthiram, Yu & Wang. Lithium battery chemistries enabled by solid-state electrolytes. Nature Reviews Materials 2, 16103 (2017). doi:10.1038/natrevmats.2016.103",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch6_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 6, chapterTitle: "介体离子固态电解质与展望", figDir });
  d.registerFigs(info);
  const C = d.C;
  const card = (s, x, y, w, h, fill) => s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const axisStyle = { catAxisLabelFontSize: 12, valAxisLabelFontSize: 11, catAxisLabelColor: HEX.dk1, valAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 6 章\n用“中间人”离子造水系电池", { placeholder: "title" });
  s.addText("介体离子 · Table 2 · 结论与展望 · 全文回顾", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.8, y: 0.9, w: 3.9, h: 5.6 });
  s.addNotes("本章对应原文“Batteries with mediator-ion solid electrolytes”（第 10–11 页，Fig. 7）、Table 2（第 12 页）和“Conclusions and future perspectives”（第 11–13 页）。最后用两页回顾全文。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "水系电池的老规矩", "多孔隔膜 → 电极必须是不溶的固体"],
    ["2", "介体离子 mediator-ion", "Li⁺ / Na⁺ 穿膜“平账”，不参加电极反应（Fig. 7）"],
    ["3", "性能总表 Table 2", "所有固态电解质电池放在一起比"],
    ["4", "结论、展望与全文回顾", "两条路线、四条交织的研究路径"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08, "F5F7F9");
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.15, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.column(s, 7.4, 1.45, 5.35, [
    { kind: "def", tint: true, head: "承上启下", body: "第 5 章：固态电解质隔开“有机负极液 | 水系正极液”，锂金属负极。\n本章：两边都换成水溶液、负极换成便宜的锌或铁。Li⁺ 或 Na⁺ 不再是“主角”，只负责穿膜平衡电荷。" },
    { kind: "def", tint: true, head: "一句话理解“介体离子”", body: "电极反应在两边各自进行；膜只让 Li⁺（或 Na⁺）通过，它像“中间人”一样来回跑，让两边始终保持电中性。" },
  ], 0.35);
  s.addNotes("“mediator”在这里译作“介体”或“中间人”。注意它和锂硫电池里常说的“氧化还原介体 redox mediator”不是一回事：这里的介体离子不发生氧化还原，只负责平衡电荷。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：水系电池与“双液”思路", { placeholder: "title" });
  d.fig(s, "aq_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.block(s, { x: 0.6, y: 5.35, w: 5.9, kind: "why", tint: true, body: "Daniell 电池早就把两种溶液分开，靠隔膜里的离子平衡电荷。介体离子电池是它的“现代版”：隔膜换成只放 Li⁺/Na⁺ 的固态电解质，两边再也不会混。" });
  d.block(s, { x: 6.8, y: 5.35, w: 5.95, kind: "matters", tint: true, body: "灰色是“传统”水系电池，电极都是固体；后三项开始让溶解的、甚至气态的活性物质进入水系电池。" });
  s.addNotes("时间轴不按比例。Licht 1999 的“超级铁”电池和 Licht & Yu 2007 的高碘酸盐正极都在本文参考文献中（Refs 226、227），第二作者 Xingwen Yu 正是后者的作者之一。2013–2015 年 Wang、Xia 组的三篇工作（Refs 57–59）已经用锂离子导电膜隔开两种水溶液，与 2016 年 Manthiram 组的介体离子概念非常接近（见校注页）。");

  // ---------------- 4. Section ----------------
  d.section("1 水系电池的限制");
  s = d.slide("DARK_SECTION");
  s.addText("1  水系电池：便宜安全，但被隔膜“卡住”", { placeholder: "title" });
  s.addText("多孔隔膜挡不住溶解物和枝晶；能导 Zn²⁺、Fe²⁺ 的固态电解质又几乎不存在", { placeholder: "body" });
  s.addNotes("原文认为，从实用和经济角度，水系电池在维护、运行安全、部件成本和可靠性上总体优于非水电池。");

  // ---------------- 5. Porous separator ----------------
  s = d.slide("CONTENT");
  s.addText("老规矩：电极必须是不溶的固体", { placeholder: "title" });
  d.fig(s, "porous_aq", { x: 0.45, y: 1.2, w: 7.55, h: 4.1 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "已有：锌锰、镍氢、镍镉电池；在研：镍铁、锌–氧化银、锌–氧化镍、锌–高铁酸盐、锌–高碘酸盐。它们无一例外用多孔隔膜（原文）。" },
    { kind: "why", body: "多孔隔膜靠电解液在孔里流动导电，所以任何能溶进水的东西都能穿过去：中间产物会“串门”，金属枝晶也能钻过去。" },
    { kind: "matters", body: "许多便宜、储量大的液态或气态物质本可做电极，却因此用不上。" },
  ], 0.18);
  d.quote(s, { x: 0.6, y: 5.5, w: 7.4, en: "Under this cell operation principle, the electrodes (either the anode or cathode) of a cell must be in the solid phase and insoluble in the aqueous electrolyte to ensure that they do not migrate through the porous separator.", zh: "按这种工作原理，电池的电极（负极或正极）必须是固相、且不溶于水系电解液，以确保它们不会穿过多孔隔膜。" });
  s.addNotes("原文指出多孔隔膜电池的两个老问题：充放电时生成的可溶中间产物会在正负极之间发生化学串扰（crossover）；金属负极会长枝晶造成短路。");

  // ---------------- 6. Multivalent ----------------
  s = d.slide("CONTENT");
  s.addText("为什么不直接用导 Zn²⁺ 的固态电解质？", { placeholder: "title" });
  d.fig(s, "multivalent", { x: 0.45, y: 1.2, w: 7.4, h: 3.9 });
  d.column(s, 8.1, 1.3, 4.65, [
    { kind: "hist", body: "1990 年 Ikeda 等报道了 Zn–Zr–PO₄ 体系中的 Zn²⁺ 传导（Ref. 229）；1990 年代 Imanaka、Adachi 等系统研究多价阳离子导体（Ref. 228），但电导率远低于 Li⁺/Na⁺ 导体。" },
    { kind: "why", body: "离子电荷越高，和骨架阴离子的静电吸引越强，跳一步要越过的能垒越高；离子越重也越难动。所以室温好用的固态电解质只有 Li⁺ 和 Na⁺ 两类。" },
    { kind: "matters", body: "看起来“全水系 + 固态电解质”走不通，介体离子正是绕开这一点的办法。" },
  ], 0.16);
  d.quote(s, { x: 0.6, y: 5.35, w: 7.25, en: "…solid-state electrolytes capable of transporting divalent or trivalent ions are practically unavailable because of the higher charge and heavier mass of the ions", zh: "……由于离子电荷更高、质量更大，能传导二价或三价离子的固态电解质实际上并不存在。" });
  s.addNotes("原文的推理：Zn、Fe、Al 等多价金属负极适合水系电池，但没有能传导它们的固态电解质；现有 Li⁺/Na⁺ 固态电解质多用于非水电池；因此“看起来不可能”用现有碱金属离子导体做出两边都是水溶液的电池。下一节就是作者的解法。");

  // ---------------- 7. Section ----------------
  d.section("2 介体离子");
  s = d.slide("DARK_SECTION");
  s.addText("2  介体离子 Mediator-ion：让 Li⁺ 当“中间人”", { placeholder: "title" });
  s.addText("Zn–Br₂ · Fe–K₃Fe(CN)₆ · 酸性 Zn–空气（原文 Fig. 7）", { placeholder: "body" });
  s.addNotes("原文演示过的组合：两种低成本金属负极（锌、铁），两种液态正极（溴、铁氰化钾），一种气态正极（空气/氧气）；一种钠离子固态电解质 Na₃.₄Sc₂(PO₄)₂.₆(SiO₄)₀.₄ 和一种锂离子固态电解质 LATP。");

  // ---------------- 8. Principle ----------------
  s = d.slide("CONTENT");
  s.addText("介体离子电池的原理", { placeholder: "title" });
  d.fig(s, "mediator_principle", { x: 0.45, y: 1.2, w: 7.65, h: 4.5 });
  d.caption(s, "据原文 Fig. 7a 重绘；M⁺ = Li⁺ 或 Na⁺", { x: 0.55, y: 5.66, w: 7.5, h: 0.25 });
  d.column(s, 8.3, 1.3, 4.45, [
    { kind: "hist", body: "2014 年 Dong、Wang、Xia 用锂离子交换膜“重建 Daniell 电池”（Ref. 58）；2015 年 Zhang 等用 Li⁺ 当“电化学信使”做水系 Zn–Cu 电池（Ref. 59）；2016 年 Li 与 Manthiram 用这一策略做出长寿命酸性 Zn–空气电池（Ref. 230）。" },
    { kind: "why", body: "以前：传导离子必须参与电极反应（如锂电池里的 Li⁺）。现在：电极反应和穿膜离子“分工”，负极、正极可以各选最合适的溶液。" },
    { kind: "matters", body: "电极不再必须是固体，负极液、正极液也可以不同。" },
  ], 0.16);
  d.quote(s, { x: 0.6, y: 5.95, w: 12.15, en: "The lithium mediator ion balances the charge between the anode and the cathode rather than being directly involved in the electrode reactions during charge and discharge.", zh: "锂介体离子在正负极之间平衡电荷，而不直接参与充放电时的电极反应。" });
  s.addNotes("原文要求：负极液和正极液都要用含有该介体离子的可溶盐来配，例如 LiOH、LiBr、NaOH。这样膜两侧都有足够的 Li⁺ 或 Na⁺ 可以来回移动。");

  // ---------------- 9. Zn–Br2 ----------------
  s = d.slide("CONTENT");
  s.addText("例一：Zn(LiOH) || Li-SSE || Br₂(LiBr)", { placeholder: "title" });
  d.fig(s, "znbr_cell", { x: 0.45, y: 1.2, w: 7.65, h: 4.6 });
  d.column(s, 8.3, 1.3, 4.45, [
    { kind: "hist", body: "传统锌–溴液流电池在 1970 年代起开发，两极都在含 Zn²⁺ 的溴化锌溶液里，靠多孔膜分隔，溴会窜到锌极造成自放电。" },
    { kind: "why", body: "介体离子版：锌在碱性 LiOH 里反应，溴在 LiBr 里反应，中间只有 Li⁺ 能过。溴到不了锌，锌枝晶也穿不过陶瓷膜。" },
    { kind: "matters", body: "Table 2：约 500 Wh kg⁻¹（活性物质）、约 15 mW cm⁻²、约 100 圈、约 2.2 V。" },
  ], 0.16);
  d.block(s, { x: 0.6, y: 5.86, w: 12.15, kind: "def", tint: true, head: "电荷账本", body: "每转移 2 个电子：负极液少了 2 个 OH⁻，正极液多了 2 个 Br⁻，于是正好有 2 个 Li⁺ 从左穿到右。" });
  s.addNotes("原文的放电过程：Zn 先氧化为 Zn²⁺，再与 OH⁻ 结合成锌酸根 [Zn(OH)₄]²⁻，在碱液中进一步分解为不溶的 ZnO 和水；正极 Br₂ 还原为 Br⁻；Li⁺ 由负极液穿过固态电解质进入正极液。充电时，锌酸根还原为 Zn 沉积回集流体，OH⁻ 与 Li⁺ 结合为可溶的 LiOH，Br⁻ 再氧化为 Br₂，Li⁺ 反向穿膜。注意原文正文把这个固态电解质误写成“lithium–sulfur solid electrolyte”（见校注页）。");

  // ---------------- 10. Fe–ferricyanide ----------------
  s = d.slide("CONTENT");
  s.addText("例二：Fe(NaOH) || Na-SSE || K₃Fe(CN)₆(NaOH)", { placeholder: "title" });
  d.fig(s, "fe_ferri", { x: 0.45, y: 1.2, w: 7.65, h: 3.85 });
  d.caption(s, "据原文 Fig. 7c 重绘（放电）", { x: 0.55, y: 5.05, w: 7.5 });
  d.column(s, 8.3, 1.3, 4.45, [
    { kind: "hist", body: "1901 年 Edison 的镍铁电池就用铁作碱性负极，以耐用著称。本例的钠离子固态电解质是 NASICON 型的 Na₃.₄Sc₂(PO₄)₂.₆(SiO₄)₀.₄。" },
    { kind: "why", body: "铁和铁氰化钾都便宜，但铁氰根溶于水，用多孔隔膜会窜到铁极。换成 Na⁺ 导体后，Na⁺ 当介体，两边都用 NaOH 配溶液。" },
    { kind: "matters", body: "说明介体既可以是 Li⁺，也可以是 Na⁺：选哪种取决于手头有哪种好用的固态电解质。" },
  ], 0.16);
  d.stat(s, { x: 0.6, y: 5.45, w: 3.6, value: "~1.2", unit: "V", label: "Fe–K₃Fe(CN)₆（Table 2）", color: "accent6" });
  d.stat(s, { x: 4.35, y: 5.45, w: 3.7, value: "~1.7", unit: "V", label: "Zn–K₃Fe(CN)₆（Table 2）", color: "accent2" });
  s.addNotes("标准电位估算：Fe(OH)₂/Fe 约 −0.88 V，Fe(CN)₆³⁻/Fe(CN)₆⁴⁻ 约 +0.36 V，电池约 1.24 V；换成锌负极（ZnO/Zn 约 −1.26 V）约 1.62 V，与 Table 2 的约 1.2 V、1.7 V 相符。（估算为本页补充，非原文。）");

  // ---------------- 11. Acidic Zn–air ----------------
  s = d.slide("CONTENT");
  s.addText("例三：碱性锌负极 + 酸性空气正极", { placeholder: "title" });
  d.fig(s, "zn_air_acid", { x: 0.45, y: 1.2, w: 7.65, h: 3.85 });
  d.caption(s, "据原文 Fig. 7d 重绘：Zn(LiOH) || Li-SSE || 空气 (H₃PO₄/LiH₂PO₄)", { x: 0.55, y: 5.05, w: 7.5 });
  d.column(s, 8.3, 1.3, 4.45, [
    { kind: "hist", body: "锌–空气电池早在 19 世纪就已出现，1970 年代起作为助听器纽扣电池广泛使用（一次电池）。2016 年 Li 与 Manthiram 用介体离子做出长寿命、高电压的酸性 Zn–空气电池（Ref. 230）。" },
    { kind: "why", body: "锌在碱里可逆性好，氧在酸里电位高；以前两者只能“二选一”。用 Li-SSE 隔开后，两边各取所长，还免去了碱性空气极吸收 CO₂ 的问题。" },
    { kind: "matters", body: "Table 2：约 1,200 Wh kg⁻¹、约 2.0 V（酸性正极液）。" },
  ], 0.16);
  d.block(s, { x: 0.6, y: 5.5, w: 7.5, kind: "def", tint: true, head: "为什么锌要待在碱里", body: "碱性下锌以可溶的锌酸根溶解、再以 ZnO 析出，反应可逆；在酸里锌会和 H⁺ 反应放出氢气，自己被腐蚀掉。" });
  s.addNotes("这与第 5 章的酸性 Li–空气完全同一个思路：酸性 O₂ 还原的电位比碱性高约 0.83 V。传统碱性锌–空气的理论电压约 1.65 V。");

  // ---------------- 12. Voltage boost chart ----------------
  s = d.slide("CONTENT");
  s.addText("两边各选最佳溶液，电压就上去了", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "理论电压", labels: ["Zn–Br₂ 传统（Zn²⁺/Zn）", "Zn–Br₂ 介体（碱性 Zn）", "Zn–空气 传统（全碱性）", "Zn–空气 介体（酸性正极）"], values: [1.85, 2.35, 1.66, 2.49] }], {
    x: 0.5, y: 1.25, w: 7.2, h: 4.4, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent2, HEX.accent6, HEX.accent2],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00",
    ...axisStyle, valAxisMinVal: 0, valAxisMaxVal: 3, valAxisMajorUnit: 0.5, valAxisLabelFormatCode: "0.0", valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "由标准电位估算的理论电压（V）",
    showLegend: false,
  });
  d.caption(s, "估算用标准电位（vs SHE）：Zn²⁺/Zn −0.76，ZnO/Zn −1.26（碱性），Br₂/Br⁻ +1.09，O₂ 碱性 +0.40、酸性 +1.23 V。非原文数据。", { x: 0.6, y: 5.7, w: 7.1, h: 0.5 });
  d.column(s, 8.0, 1.3, 4.75, [
    { kind: "why", body: "传统电池两极共用一种电解液，只能“将就”同一个 pH。介体离子电池让负极待在碱里（锌电位更负），正极待在酸或中性里（溴、氧电位更正），电压自然拉开。" },
    { kind: "matters", body: "原文 Table 2 的实测工作电压（Zn–Br₂ 约 2.2 V、Zn–空气约 2.0 V）都明显高于传统锌基水系电池。" },
    { kind: "def", head: "代价", body: "多了一张陶瓷膜：它的电阻、成本、在强酸强碱中的寿命和密封，都是新问题（见后面的“展望”）。" },
  ], 0.18);
  s.addNotes("这一页是对原文的补充解释，帮助理解“为什么要让两边用不同溶液”。理论电压只考虑热力学，实际工作电压还要减去过电位和膜的欧姆压降。");

  // ---------------- 13. Redox menu ----------------
  s = d.slide("CONTENT");
  s.addText("一个“平台”：负极 × 正极 随意组合", { placeholder: "title" });
  d.fig(s, "redox_menu", { x: 0.5, y: 1.2, w: 12.3, h: 4.5 });
  d.quote(s, { y: 5.85, en: "The mediator-ion strategy with a solid-state electrolyte provides a battery-development platform that is applicable to a broad range of redox couples with various cathode and anode materials.", zh: "采用固态电解质的介体离子策略提供了一个电池开发平台，适用于由各种正负极材料组成的大量氧化还原电对。" });
  s.addNotes("深色标签是原文已经演示过的组合，浅色是原文列出的候选（未演示）。清单很长，但每一种都还需要验证：在强氧化性正极液（如高锰酸盐、重铬酸盐）中，固态电解质能否长期稳定，是首先要回答的问题。");

  // ---------------- 14. Section Table 2 ----------------
  d.section("3 性能总表");
  s = d.slide("DARK_SECTION");
  s.addText("3  Table 2：所有固态电解质电池放在一起", { placeholder: "title" });
  s.addText("能量密度 · 电压 · 循环寿命 · 功率密度（注意：能量密度只按活性物质计算）", { placeholder: "body" });
  s.addNotes("原文表注：由于各研究中固态电解质的厚度差异很大，电池整体的能量密度难以计算，因此表中能量密度只基于正负极活性物质。");

  // ---------------- 15. Energy & voltage ----------------
  s = d.slide("CONTENT");
  s.addText("Table 2 ①：能量密度与电压", { placeholder: "title" });
  const sys = ["全固态 Li 离子*", "Li–空气", "Li–S", "Li–Br₂", "Zn–Br₂", "Zn–K₃Fe(CN)₆", "Fe–K₃Fe(CN)₆", "Zn–空气"];
  const sysCol = [HEX.accent3, HEX.accent3, HEX.accent3, HEX.accent3, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent2];
  s.addChart(d.pres.charts.BAR, [{ name: "能量密度", labels: sys, values: [450, 10000, 1500, 1200, 500, 120, 90, 1200] }], {
    x: 0.5, y: 1.25, w: 6.2, h: 4.5, barDir: "bar",
    chartColors: sysCol,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "#,##0",
    ...axisStyle, valAxisLogScaleBase: 10, valAxisMinVal: 10, valAxisMaxVal: 100000, valAxisLabelFormatCode: "#,##0", valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "能量密度（Wh kg⁻¹，活性物质，对数坐标）", showLegend: false,
  });
  s.addChart(d.pres.charts.BAR, [{ name: "电压", labels: sys, values: [4.0, 3.25, 2.3, 4.2, 2.2, 1.7, 1.2, 2.0] }], {
    x: 6.85, y: 1.25, w: 5.95, h: 4.5, barDir: "bar",
    chartColors: sysCol,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.0",
    ...axisStyle, valAxisMinVal: 0, valAxisMaxVal: 5, valAxisMajorUnit: 1, valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "电池电压（V，代表值）", showLegend: false,
  });
  d.caption(s, "紫 = 非水 / 混合体系；青 = 水系介体离子体系。*全固态取 300–600 的中值 450、电压取 3.0–5.0 的中值 4.0；Li–空气电压取 2.8–3.7 的中值。", { x: 0.6, y: 5.8, w: 12.1, h: 0.4 });
  d.block(s, { x: 0.6, y: 6.12, w: 12.15, kind: "matters", body: "非水锂体系电压高、能量大；水系体系电压受水分解限制，但便宜安全，适合大规模储能。" });
  s.addNotes("表中能量密度的口径不统一：Li–空气的 10,000 与正文的理论值 11,680 接近，而全固态的 300–600 是按常见正负极材料估算。所以这张图只适合看数量级，不适合做精确比较。");

  // ---------------- 16. Cycle life & power ----------------
  s = d.slide("CONTENT");
  s.addText("Table 2 ②：循环寿命与功率密度", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "循环寿命", labels: ["氧化物全固态", "硫化物全固态", "LiPON 薄膜", "PEO 聚合物", "Li–空气", "Li–S", "Li–Br₂", "Zn–Br₂"], values: [300, 1000, 10000, 400, 100, 300, 100, 100] }], {
    x: 0.5, y: 1.25, w: 6.2, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent3, HEX.accent3, HEX.accent1, HEX.accent3, HEX.accent3, HEX.accent3, HEX.accent3, HEX.accent2],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "#,##0",
    ...axisStyle, valAxisLogScaleBase: 10, valAxisMinVal: 10, valAxisMaxVal: 100000, valAxisLabelFormatCode: "#,##0", valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "循环寿命（圈，对数坐标）", showLegend: false,
  });
  s.addChart(d.pres.charts.BAR, [{ name: "功率密度", labels: ["Li–空气", "Li–S", "Li–Br₂", "Zn–Br₂", "Zn–K₃Fe(CN)₆", "Fe–K₃Fe(CN)₆", "Zn–空气"], values: [15, 5, 30, 15, 15, 2, 5] }], {
    x: 6.85, y: 1.25, w: 5.95, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent3, HEX.accent3, HEX.accent3, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent2],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    ...axisStyle, valAxisMinVal: 0, valAxisMaxVal: 35, valAxisMajorUnit: 5, valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "功率密度（mW cm⁻²）", showLegend: false,
  });
  d.caption(s, "Table 2 中其余水系体系没有给出循环寿命；全固态电池的功率为 5–100 mW cm⁻² 的范围值（见第 4 章），未画入右图。", { x: 0.6, y: 5.6, w: 12.1, h: 0.35 });
  d.block(s, { x: 0.6, y: 5.93, w: 12.15, kind: "matters", tint: true, body: "除 LiPON 薄膜外，所有体系的寿命都只有 100–1,000 圈；液/气态电极体系的功率只有几到几十 mW cm⁻²，离实用还很远。" });
  s.addNotes("功率密度单位是每平方厘米膜面积的毫瓦数，反映的主要是固态电解质膜的电阻。Li–Br₂ 最高（约 30），因为溴的反应快；Fe–K₃Fe(CN)₆ 最低（约 2）。");

  // ---------------- 17. Section conclusions ----------------
  d.section("4 结论与展望");
  s = d.slide("DARK_SECTION");
  s.addText("4  结论与展望", { placeholder: "title" });
  s.addText("两条路线 · 四条交织的研究路径 · 界面与密封", { placeholder: "body" });
  s.addNotes("原文“Conclusions and future perspectives”一节，先总结两条路线的现状，再给出今后要做的事。");

  // ---------------- 18. Two routes ----------------
  s = d.slide("CONTENT");
  s.addText("两条路线：全固态 vs 固态电解质 + 液/气态电极", { placeholder: "title" });
  d.fig(s, "two_routes", { x: 0.5, y: 1.2, w: 12.3, h: 4.3 });
  d.block(s, { x: 0.6, y: 5.5, w: 5.9, kind: "hist", tint: true, body: "1960 年代 Ford 公司发现 β-氧化铝能快速传导 Na⁺，催生高温钠硫电池；它后来在日本实现商业化。" });
  d.quote(s, { x: 6.8, y: 5.5, w: 5.95, en: "At present, the high-temperature sodium–sulfur battery system is the only viable energy storage technology that uses a solid electrolyte.", zh: "目前，高温钠硫电池是唯一可行的、使用固态电解质的储能技术。" });
  s.addNotes("原文对全固态路线的总结：比液态有机电解液的商用锂离子电池更安全、能量密度更高、工作温度更宽，可靠性适合大规模应用；但无机路线有电极体积变化、界面电荷转移电阻、柔性和循环稳定性等问题，聚合物路线则受限于窄电化学窗口和室温电导率低。对第二条路线：避开高电荷转移电阻，可做大规模体系，也能实现以前因串扰而不可能的新化学。");

  // ---------------- 19. Avenues ----------------
  s = d.slide("CONTENT");
  s.addText("展望：四条交织的研究路径", { placeholder: "title" });
  d.fig(s, "avenues", { x: 0.5, y: 1.15, w: 12.3, h: 4.6 });
  d.quote(s, { y: 5.85, en: "Transferring these systems from research laboratories to commercialized products requires intensive, systematic and integrated research efforts into multiple interlocking avenues: electrodes, solid-state electrolytes, the electrode/electrolyte interface and the cell configuration design.", zh: "要把这些体系从实验室带到商品，需要在电极、固态电解质、电极/电解质界面和电池结构设计这几条相互交织的路径上，开展深入、系统、整体的研究。" });
  s.addNotes("对固态电解质材料：要同时做到高电导、好的电化学稳定性和可接受的力学性能，需要实验与计算模拟结合，加上先进表征来理解离子传输机理；还要降低大面积固态电解质膜的生产成本。");

  // ---------------- 20. Interface & liquid route requirements ----------------
  s = d.slide("CONTENT");
  s.addText("两项具体建议：软界面，以及耐受 + 密封", { placeholder: "title" });
  d.fig(s, "interface_ideas", { x: 0.45, y: 1.2, w: 7.65, h: 3.85 });
  d.column(s, 8.3, 1.3, 4.45, [
    { kind: "why", head: "全固态路线：把界面变“软”", body: "让电解质表面变软；在表面镀导离子或导电子的弹性薄层；插入弹性或含液中间层；弄清电极内部的应力应变。" },
    { kind: "why", head: "液/气态电极路线：两个前提", body: "① 电解质要同时耐受两侧（锂、钠、多硫化物、溴、强酸强碱）；② 陶瓷件要有稳固的结构和可靠密封。" },
    { kind: "matters", body: "原文反复强调：这些办法都必须保持低成本，才能和现有储能技术竞争。" },
  ], 0.3);
  d.block(s, { x: 0.6, y: 5.25, w: 7.5, kind: "def", tint: true, head: "电荷转移电阻 Charge-transfer resistance", body: "离子跨过电极/电解质界面、完成电化学反应时遇到的阻力；固–固界面上通常远大于固–液界面。" });
  s.addNotes("第 4、5 章已经见过这些建议的雏形：第 4 章的夹心电解质、缓冲层；第 5 章 Li–S 的含液软中间层。结论部分把它们总结成通用策略。");

  // ---------------- 21. Errata ----------------
  d.section("校注与回顾");
  s = d.slide("CONTENT");
  s.addText("阅读校注：本章涉及的几处问题", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.9, kind: "note", tint: true, head: "① 第 10 页：固态电解质名称写错", body: "原文：“Zn(LiOH) || lithium–sulfur solid electrolyte || Br₂(LiBr)”。\n这个电池里没有硫，Fig. 7 图注写的是 Li-SSE（锂离子固态电解质，即 LATP），正文应为 lithium(-ion) solid electrolyte。" });
  d.block(s, { x: 6.85, y: 1.4, w: 5.9, kind: "note", tint: true, head: "② Table 2：Zn–空气用哪种 SSE？", body: "表中 Zn–空气一行的“固态电解质”格与上方 Na₃.₄Sc₂(PO₄)₂.₆(SiO₄)₀.₄ 合并，读起来像是钠离子导体；而 Fig. 7d 与 Ref. 230 用的是 Li-SSE（LATP），表格排版易误导。" });
  d.block(s, { x: 0.6, y: 3.75, w: 5.9, kind: "note", tint: true, head: "③ “介体离子”的首创性", body: "正文说 Refs 57–59 是“非水负极液 + 水系正极液”的混合电池，但这三篇（2013–2015）其实两侧都是水溶液，并已用锂离子导电膜让 Li⁺ 平衡电荷，与作者 2016 年的“独特”介体离子策略高度相似。" });
  d.block(s, { x: 6.85, y: 3.75, w: 5.9, kind: "note", tint: true, head: "④ 小问题", body: "· 第 12 页 “liquixd” 应为 liquid。\n· Ref. 230 标为 Adv. Energy Mater. 6 (2015)，第 6 卷对应 2016 年。\n· “钠硫电池是唯一可行的固态电解质储能技术”偏绝对：ZEBRA（Na–NiCl₂）也用 β″-氧化铝，Li–I₂ 起搏器电池与 LiPON 薄膜电池也已商用。" });
  s.addNotes("①② 是明确的文字/排版错误；③ 是对文献描述的核对（依据 Refs 57–59 的标题：酸–碱双电解液水系电池、用锂离子交换膜重建 Daniell 电池、以 Li⁺ 为电化学信使的水系 Zn–Cu 电池）；④ 中 Ref. 230 的年份依据期刊卷号推断。");

  // ---------------- 22. Whole-paper map ----------------
  s = d.slide("CONTENT");
  s.addText("全文回顾：六章一张图", { placeholder: "title" });
  d.fig(s, "paper_map", { x: 0.5, y: 1.15, w: 12.3, h: 4.3 });
  d.block(s, { x: 0.6, y: 5.6, w: 5.9, kind: "matters", tint: true, body: "主线：先“材料过关”（电导率、窗口、力学），再“界面过关”；绕开固–固界面，就让电极保持液/气态。" });
  d.block(s, { x: 6.85, y: 5.6, w: 5.9, kind: "def", tint: true, head: "带走三个问题", body: "这个电解质导什么离子？它和两边稳定吗？界面接触靠什么维持？" });
  s.addNotes("第 1–3 章讲材料：为什么需要固态电解质、离子如何在固体中传输、无机/聚合物/复合/薄膜电解质各自的优缺点。第 4–6 章讲电池：全固态锂离子电池、固态电解质 + 液/气态电极（Li–空气、Li–S、Li–Br₂）、介体离子水系电池，以及 Table 2 和展望。");

  // ---------------- 23. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["介体离子", "Li⁺/Na⁺ 穿过固态电解质平衡电荷，不参加电极反应；两侧都可以是水溶液"],
    ["三个例子", "Zn–Br₂（~2.2 V）、Fe/Zn–K₃Fe(CN)₆（~1.2/1.7 V）、酸性 Zn–空气（~2.0 V）：无串扰、无枝晶"],
    ["Table 2", "能量密度只算活性物质；除 LiPON 薄膜外寿命均为 100–1,000 圈，功率仅几到几十 mW cm⁻²"],
    ["展望", "电极、固态电解质、界面、电池结构四路并进；软界面与可靠密封；始终控制成本"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Realization of solid electrolytes with the necessary parameters would enable new battery chemistries and affordable, advanced battery systems that would revolutionize the rechargeable battery field …”", options: { italic: true, fontSize: 14, color: "FFFFFF", breakLine: true } },
    { text: "具备所需性能的固态电解质一旦实现，将催生新的电池化学和价格可承受的先进电池系统，彻底改变可充电电池领域……（全文最后一句）", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.85, w: 11.9, h: 1.0, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("全文最后一句的后半部分：“……providing good levels of safety, high energy density, and long static and dynamic stabilities with no self-discharge and long cycle lives”——提供良好的安全性、高能量密度、长期静态与动态稳定性，没有自放电，循环寿命长。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
