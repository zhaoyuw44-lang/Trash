// 锂电池发展史 — 第 4 章：1980–1985：LiCoO₂、石墨与锂离子电池原型
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch4_quotes");

const PAPER = {
  short: "锂电池发展史",
  full: "本章原始文献：K. Mizushima, P. C. Jones, P. J. Wiseman & J. B. Goodenough, LixCoO₂ (0<x≤1): A New Cathode Material for Batteries of High Energy Density, Mater. Res. Bull. 15, 783–789 (1980)；R. Yazami & Ph. Touzain, A Reversible Graphite–Lithium Negative Electrode for Electrochemical Generators, J. Power Sources 9, 365–371 (1983)；A. Yoshino, K. Sanechika & T. Nakajima, Secondary Battery, US Patent 4,668,595 (1987，日本优先权 1985)。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch4_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 4, chapterTitle: "LiCoO₂、石墨与锂离子电池原型", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontSize: 13, valAxisLabelColor: HEX.dk1, valAxisLabelFontFace: "+mn-lt", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", catAxisTitleFontSize: 13, catAxisTitleColor: HEX.dk2, valAxisTitleFontSize: 13, valAxisTitleColor: HEX.dk2, legendFontSize: 13, legendColor: HEX.dk1, legendFontFace: "+mn-lt" };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 4 章\n不用金属锂的锂电池", { placeholder: "title" });
  s.addText("1980–1985：LiCoO₂、石墨与锂离子电池原型", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.6, w: 7.6, h: 1.4, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("这一章回答一个问题：锂金属负极会长枝晶（第 2 章），能不能干脆不用金属锂？答案由三块拼图组成：1980 年 Goodenough 团队的 LiCoO₂ 正极，1983 年 Yazami 与 Touzain 证明石墨能可逆嵌锂，1985 年吉野彰把碳负极和 LiCoO₂ 配成电池。三份原始文献分别是一篇材料论文、一篇电化学论文和一件专利。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "更高电压的正极", "为什么氧化物给出 4 V，LiCoO₂ 自带锂"],
    ["2", "负极也用“嵌入”", "摇椅电池、石墨的阶、溶剂共嵌入、Yazami 1983"],
    ["3", "吉野彰拼出锂离子电池", "从聚乙炔到碳，专利保护了什么"],
    ["4", "校注与小结", "常见说法的更正，本章要点"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  card(s, 7.35, 1.45, 5.4, 5.2, "EEF2F5");
  s.addText("上一章回顾", { x: 7.65, y: 1.62, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent3, margin: 0, valign: "middle", isTextBox: true });
  s.addText("第 2 章：TiS₂ 正极很好，但必须配金属锂负极，充电时长枝晶、会短路。\n第 3 章：Armand 的 PEO 聚合物电解质；Peled 的 SEI 保护膜。", { x: 7.65, y: 2.08, w: 4.9, h: 1.55, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addText("本章问题", { x: 7.65, y: 3.75, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent1, margin: 0, valign: "middle", isTextBox: true });
  s.addText("能不能做一块完全没有金属锂的锂电池？需要三样东西：\n① 电压够高、而且自带锂的正极\n② 能让锂可逆进出的负极\n③ 把两者配成一个能用的电池", { x: 7.65, y: 4.2, w: 4.9, h: 2.3, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("先回顾两条线索：第 2 章的锂金属电池卡在负极（枝晶），第 3 章的聚合物电解质会在本章被 Yazami 借去做石墨实验。本章三节正好对应右边的三样东西，最后一节是校注和小结。");

  // ---------------- 3. Era timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：1970–1985 年的三条线", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "1970 年代的可充锂电池都用金属锂作负极。这一时期的三条线（正极、负极、整个电池）其实在回答同一个问题：怎样把金属锂拿掉？" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "1985 年三条线在吉野彰手里合流，得到今天锂离子电池的基本形态。2019 年诺贝尔化学奖表彰的就是这段历史。" });
  s.addNotes("时间轴不按比例。注意负极这条线（青色）从 1970 年就开始了：人们早就知道石墨能嵌入碱金属，但在 PC 电解液里总是失败。正极线（橙色）的关键年份是 1980 年。紫色是把正负极配成整电池的工作，摇椅电池的想法也在 1980 年前后出现。");

  // ---------------- 4. Voltage budget ----------------
  s = d.slide("CONTENT");
  s.addText("1980 年的难题：拿掉金属锂，电压就不够了", { placeholder: "title" });
  d.fig(s, "voltage_budget", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "电位为常见近似值（非原文数据）。碳负极的电位随含锂量在 0.1–0.8 V 间变化。", { x: 0.6, y: 5.9, w: 6.8, h: 0.4 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.tis2 },
    { kind: "why", size: 13, body: "电池电压 = 正极电位 − 负极电位。负极从金属锂换成合金或嵌入化合物，负极电位抬高，电压就被“扣掉”一截。TiS₂ 本来只有约 2 V，扣不起。" },
    { kind: "matters", size: 13, body: "所以第一步不是改负极，而是先找一个电压高得多的正极，留出“电压余量”。这正是 Goodenough 1980 年论文的出发点。" },
  ], 0.18);
  s.addNotes("Mizushima 等在引言里说得很直接：为了解决锂负极的问题而换掉纯锂，电池电压就会下降，所以需要一个比 TiS₂ 电压更高的正极。可以把电压想成“预算”：正极给的总额越高，负极换成更安全但电位更高的材料后，剩下的电压才够用。LiAl 合金在 1970 年代末被认真考虑过（Yazami 原文 ref. 4、5），它的电位约 0.4 V。");

  // ======== Section 1 ========
  d.section("1 更高电压的正极");
  s = d.slide("DARK_SECTION");
  s.addText("1  更高电压的正极：LiCoO₂（1980）", { placeholder: "title" });
  s.addText("为什么氧化物电压高 · Goodenough 在牛津 · 层状结构 · 先做“放电态” · 开路电压", { placeholder: "body" });
  s.addNotes("这一节读 Mizushima、Jones、Wiseman 和 Goodenough 1980 年发表在 Materials Research Bulletin 上的论文，正文只有 7 页。");

  // ---------------- 6. Redox bands ----------------
  s = d.slide("CONTENT");
  s.addText("为什么氧化物能给出 4 V？", { placeholder: "title" });
  d.fig(s, "redox_bands", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: "Goodenough 在 MIT 林肯实验室（1952–1976）研究过渡金属氧化物的电子结构。1980 年论文用化学语言给出结论；右图这种能级解释，是他后来在综述里系统讲清的。" },
    { kind: "why", size: 13, body: "电压 = 电子从锂“掉”进正极空位的落差。TiS₂ 约 2 V；想换更高价的 Co⁴⁺ 也没用，它的能级会落进 S 3p 能带，电子改从硫上拿走。氧更“抓电子”，O 2p 能带更低，Co⁴⁺/Co³⁺ 能露出来。" },
    { kind: "matters", size: 13, body: "正极电压从约 2 V 提到约 4 V。能量 = 电压 × 电量，电压翻倍，能量也接近翻倍。" },
  ], 0.16);
  d.quote(s, Q.mizOxides);
  s.addNotes("原文的论证是热力学的：反应 xA + MXn = AxMXn 的自由能变化越负，电压越高；A 要小而电正性强（锂好过钠），X 要小而电负性强（氧好过硫），M 要处在高氧化态。还有一句：高氧化态的 M 在氧化物里比在硫化物里更稳定。能带图只是把这段话画出来。图中能级位置是示意，不是计算值。");

  // ---------------- 7. Goodenough life ----------------
  s = d.slide("CONTENT");
  s.addText("Goodenough：从磁性氧化物到电池", { placeholder: "title" });
  d.fig(s, "goodenough_life", { x: 0.5, y: 1.12, w: 12.3, h: 3.65 });
  d.block(s, { x: c3[0], y: 4.9, w: 3.95, kind: "hist", tint: true, size: 13, body: "1976 年到 Oxford 任无机化学实验室主任。LiCoO₂ 论文 1980 年 4 月投稿，第一作者是访问学者水岛公一 (Mizushima)。" });
  d.block(s, { x: c3[1], y: 4.9, w: 3.95, kind: "why", tint: true, size: 13, body: "1970 年代石油危机让储能成为热点。他在 MIT 做过钠离子快导体 NASICON，熟悉“离子怎样在晶体里跑”。" });
  d.block(s, { x: c3[2], y: 4.9, w: 3.85, kind: "matters", tint: true, size: 13, body: "他用“能级 + 晶体结构”挑材料。三大正极 LiCoO₂、LiMn₂O₄、LiFePO₄ 都出自他的团队。" });
  s.addNotes("Goodenough 1922 年生于德国耶拿的美国家庭，在芝加哥大学读物理博士。在林肯实验室他研究计算机磁芯存储用的铁氧体，提出了关于磁性交换作用的 Goodenough–Kanamori 规则。1983 年的 LiMn₂O₄ 尖晶石正极由他在牛津的博士后 Thackeray 等完成，第 6 章会讲 1997 年的 LiFePO₄。他 2023 年去世，享年 100 岁。论文的经费来自美国空军和欧共体能源项目（原文致谢）。");

  // ---------------- 8. Layered structure ----------------
  s = d.slide("CONTENT");
  s.addText("LiCoO₂ 的层状结构：抽掉锂，层还在", { placeholder: "title" });
  d.fig(s, "layered_structure", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "据原文 Fig. 1 重绘（改为侧视球模型）；c/3 由原文 p. 785 与 Table I 的 c 值算出（14.08 → 14.42 Å）。", { x: 0.6, y: 5.9, w: 6.8, h: 0.45 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：层状氧化物 (layered oxide)", size: 13, body: "氧离子密堆积成层，Co 和 Li 一层隔一层地夹在中间，像“夹心饼干”。也叫 α-NaFeO₂ 型或“有序岩盐”结构。" },
    { kind: "hist", size: 13, body: Q.facts.licoo2Known },
    { kind: "why", size: 13, body: "团队从已知的锂离子固体电解质推断：Li⁺ 在氧的密堆积骨架里能跑得快。LiMO₂ 正好有一整层锂，抽走后 CoO₂ 层也许还撑得住。" },
    { kind: "matters", size: 13, body: "抽掉一半锂后，X 射线峰仍按原来的六方晶胞指标化，骨架没塌。结构不塌，锂才能反复进出。" },
  ], 0.14);
  s.addNotes("x = 0.74 和 0.49 的样品在手套箱里压在胶带上做 X 射线衍射。锂越少，c 轴略微变长：锂离子原本在两层氧之间起“胶水”作用，抽走后氧层之间的排斥让层间撑开。原文 Fig. 1 还画了 LiTiS₂ 作比较：两者都是层状，差别在于阴离子的堆积方式（立方 vs 六方）。");

  // ---------------- 9. Synthesis route ----------------
  s = d.slide("CONTENT");
  s.addText("关键一步：正极在“放电态”下合成", { placeholder: "title" });
  d.fig(s, "synth_route", { x: 0.5, y: 1.2, w: 6.9, h: 4.05 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: "1970 年代的正极（TiS₂、V₂O₅、MoS₂）都在不含锂的状态下合成。1980 年 Mizushima 等反过来：先在 900 °C 合成含锂的 LiCoO₂，再在室温下把锂抽出。" },
    { kind: "why", size: 13, body: "TiS₂ 这类材料本来就不含锂，负极反正是金属锂，锂从负极来很自然。LiCoO₂ 天然含锂，只能先合成、再抽锂。" },
    { kind: "matters", size: 13, body: "锂的来源从负极搬到了正极。负极不必再是金属锂，可以是一个“空”的宿主，比如碳。这是锂离子电池成立的前提。" },
  ], 0.16);
  d.quote(s, Q.mizRoute);
  s.addNotes("原文还提醒：用这种路线得到的充电态材料 Li(1−x)CoO₂ 不一定是热力学稳定相，它只是在室温下“动力学上”保持层状。这句话后来很重要：抽锂太多时结构会变，所以实际电池只用一半左右的锂。");

  // ---------------- 10. OCV chart ----------------
  s = d.slide("CONTENT");
  s.addText("开路电压：约 4 V，是 TiS₂ 的两倍", { placeholder: "title" });
  const ocvX = [0.080, 0.154, 0.242, 0.296, 0.352, 0.460, 0.619, 0.756, 0.920, 0.992];
  const ocvV = [4.71, 4.65, 4.57, 4.51, 4.44, 4.30, 4.06, 3.94, 3.90, 3.87];
  s.addChart(d.pres.charts.SCATTER, [{ name: "x", values: ocvX }, { name: "开路电压", values: ocvV }], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.4,
    chartColors: [HEX.accent1], lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 9,
    valAxisMinVal: 3.5, valAxisMaxVal: 5.0, valAxisMajorUnit: 0.5, catAxisMinVal: 0, catAxisMaxVal: 1, catAxisMajorUnit: 0.2, valAxisLabelFormatCode: "0.0",
    showValAxisTitle: true, valAxisTitle: "开路电压（V，相对金属锂）", showCatAxisTitle: true, catAxisTitle: "x（LixCoO₂ 中的锂含量）",
    showTitle: true, title: "LixCoO₂ 的开路电压随锂含量变化", showLegend: false, ...chartText,
  });
  d.caption(s, "据原文 Fig. 3 读图（近似）。x = 1 是放电态；向左 x 变小，表示抽出的锂越多。", { x: 0.6, y: 5.8, w: 6.6, h: 0.4 });
  d.stat(s, { x: 7.75, y: 1.3, w: 2.4, value: "1.11", unit: "kWh/kg", label: "理论能量密度（按正极）", color: "accent1" });
  d.stat(s, { x: 10.3, y: 1.3, w: 2.5, value: "0.067", unit: "", label: "锂最多抽到 x = 0.067", color: "accent1" });
  d.column(s, 7.75, 2.85, 5.0, [
    { kind: "hist", size: 13, body: "约 20 mg LiCoO₂ 粉末，1 M LiBF₄/PC 电解液，氩气手套箱。电压超过 4 V，怕电解液分解，对电极改用 Li₀.₁V₂O₅。" },
    { kind: "why", size: 13, body: "电压随 x 连续变化，说明锂是“固溶”式地进出。TiS₂ 也是这样，所以可以直接比：同样的 x，电压约高一倍。" },
    { kind: "matters", size: 13, body: "在 0.2–4 mA/cm² 下，锂在 x = 0.5–1 之间反复进出，过电位小（原文 Fig. 4）：电压高，同时可逆。" },
  ], 0.16);
  s.addNotes("1.11 kWh/kg 是按反应 0.923 Li + Li₀.₀₆₇Co₁.₀₁O₂ = Li₀.₉₉Co₁.₀₁O₂ 算的，只计正极和锂的质量，不是整个电池。按 x 从 1 到 0 算，LiCoO₂ 的理论容量约 274 mAh/g；实际只能用一半左右，约 140 mAh/g。原文测得的化学扩散系数约 5 × 10⁻⁹ cm²/s（x = 0.2–0.8）。");

  // ======== Section 2 ========
  d.section("2 负极也用“嵌入”");
  s = d.slide("DARK_SECTION");
  s.addText("2  负极也用“嵌入”：摇椅与石墨", { placeholder: "title" });
  s.addText("摇椅电池的想法 · 石墨的“阶” · 为什么石墨在 PC 里不行 · Yazami & Touzain 1983", { placeholder: "body" });
  s.addNotes("正极有了 4 V 的 LiCoO₂，下一步是给负极找一个能“装”锂的宿主。这一节读 Yazami 与 Touzain 1983 年在 Journal of Power Sources 上的论文。");

  // ---------------- 12. Rocking chair ----------------
  s = d.slide("CONTENT");
  s.addText("摇椅电池：让锂离子在两个“宿主”之间来回", { placeholder: "title" });
  d.fig(s, "rocking_chair", { x: 0.6, y: 1.15, w: 12.1, h: 2.85 });
  d.block(s, { x: c3[0], y: 4.12, w: 3.95, kind: "hist", tint: true, size: 13, body: "1980 年前后 Armand 提出负极也用嵌入化合物；同年 Lazzari 与 Scrosati 用 LixWO₂ 负极做出这种电池，后来叫“摇椅电池”。" });
  d.block(s, { x: c3[1], y: 4.12, w: 3.95, kind: "why", tint: true, size: 13, body: "金属锂负极每次充电都要“重新长出来”，容易长成枝晶。嵌入负极只让锂进出层间，电极形状不变。" });
  d.block(s, { x: c3[2], y: 4.12, w: 3.85, kind: "matters", tint: true, size: 13, body: "代价是电压：负极电位比金属锂高。4 V 的 LiCoO₂ 让这笔“电压税”付得起，摇椅才变得实用。" });
  d.quote(s, Q.mizAlternate);
  s.addNotes("“摇椅”的比喻：锂离子像坐在摇椅上，在两个电极之间前后摇，哪一边都不会变成金属锂。Goodenough 1980 年论文的结论第 2 条已经预言了这一点：电压这么高，可以考虑用嵌入化合物作负极、配液态电解液，代价是电压更低。他没有做这个实验，原文最后一句是“是否实用还有待探索”。");

  // ---------------- 13. Graphite staging ----------------
  s = d.slide("CONTENT");
  s.addText("石墨插层化合物：锂按“阶”住进层间", { placeholder: "title" });
  d.fig(s, "graphite_stage", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "示意图。层间距 3.70 Å 取自 Yazami & Touzain Table 1；金色、蓝色见原文 p. 366。", { x: 0.6, y: 5.9, w: 6.8, h: 0.4 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：阶 (stage)", size: 13, body: "两层锂之间隔着几层石墨，就叫几“阶”。1 阶 LiC₆ 每个层间都有锂，含锂最多。" },
    { kind: "hist", size: 13, body: "1840 年代人们就发现一些分子能“钻进”石墨层间，形成插层化合物 (GIC)。法国 Hérold 学派长期研究碱金属–石墨化合物，1975 年用化学方法制得 LiC₆。" },
    { kind: "why", size: 13, body: "石墨层与层之间只靠很弱的范德华力相连，层间能被“撑开”放进锂，而每一层本身很结实。锂进去后，层间距只增加约 10%。" },
    { kind: "matters", size: 13, body: "LiC₆ 的理论容量 372 mAh/g，电位离金属锂只差约 0.1–0.2 V：几乎不损失电压，又不会长枝晶。" },
  ], 0.14);
  s.addNotes("算一下：1 个 Li 对应 6 个 C，6 × 12.01 = 72.06 g/mol，96 485 ÷ 72.06 ÷ 3.6 ≈ 372 mAh/g。这是石墨负极的理论上限，今天的石墨负极实际能做到 350 mAh/g 以上。注意 372 是按碳的质量算的；如果按 LiC₆ 的质量（79.0 g/mol）算是约 340 mAh/g，正是 Yazami 原文给出的 340 A h/kg。");

  // ---------------- 14. Co-intercalation ----------------
  s = d.slide("CONTENT");
  s.addText("为什么石墨一直用不起来：溶剂共嵌入", { placeholder: "title" });
  d.fig(s, "cointercalation", { x: 5.95, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "示意图（非原文图）。", { x: 6.0, y: 5.9, w: 6.8, h: 0.35 });
  d.column(s, 0.6, 1.3, 5.0, [
    { kind: "def", head: "定义：共嵌入 (co-intercalation)", size: 13, body: "离子带着包裹它的溶剂分子，一起插进宿主的层间。" },
    { kind: "hist", size: 13, body: "1970 年 Dey 与 Sullivan 发现 PC 在石墨上持续分解、放出气体（Yoshino 专利也引用了这篇）。1974 年起 Besenhard 等证明 Li⁺ 会带着溶剂一起挤进石墨。" },
    { kind: "why", size: 13, body: "当时的锂电池电解液几乎都用 PC（第 1 章 Harris 1958）。PC 溶盐好，但把 Li⁺ 裹得很紧，进石墨时溶剂也跟着进去。" },
    { kind: "matters", size: 13, body: "问题不在石墨，而在电解液。出路有二：换掉液态溶剂（下一页），或找能在石墨表面成膜的溶剂（第 5 章 EC）。" },
  ], 0.14);
  s.addNotes("“剥离”(exfoliation) 的意思是石墨层被一片片撑开、剥落，电极粉化，同时溶剂在新暴露的表面上不断分解，放出丙烯等气体。PC 与 EC 只差一个甲基，但 EC 能在石墨表面形成稳定的 SEI（第 3 章的概念），挡住溶剂共嵌入，这是 1990 年前后才弄清楚的。");

  // ---------------- 15. Yazami cell ----------------
  s = d.slide("CONTENT");
  s.addText("Yazami & Touzain 1983：换成固体电解质，石墨就能嵌锂", { placeholder: "title" });
  d.fig(s, "yazami_cell", { x: 0.5, y: 1.2, w: 6.9, h: 3.98 });
  d.caption(s, "据原文 Fig. 1 重绘。原文在这个测试电池里把石墨叫“正极”（相对锂）；放进锂离子电池后它是负极。", { x: 0.6, y: 5.12, w: 6.8, h: 0.45 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.yazami },
    { kind: "why", size: 13, body: "PEO 是高分子长链，只能“握住”Li⁺，自己挤不进石墨。到达石墨的是“裸”的 Li⁺，层不会被撑破。" },
    { kind: "matters", size: 13, body: "第一次证明锂能在石墨里电化学地、可逆地进出，并能到 1 阶 LiC₆。石墨负极从此有了实验依据。" },
  ], 0.16);
  d.quote(s, Q.yazamiSolvate);
  s.addNotes("实验装置很简单：直径 12 mm 的锂片、一层 PEO–LiClO₄ 薄膜、一块 HOPG（高定向热解石墨），用弹簧压紧，放在充氩的玻璃容器里。PEO 电解质在室温下导电很差，要加热（原文的热力学数据是在 60 °C 下得到的）。这也是为什么这项工作没有直接变成产品：固体电解质在当时太慢。");

  // ---------------- 16. Yazami OCV ----------------
  s = d.slide("CONTENT");
  s.addText("石墨里的“台阶”：4 阶 → 2 阶 → 1 阶", { placeholder: "title" });
  d.fig(s, "yazami_ocv", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "据原文 Fig. 4 重绘（示意）。A、B、C 三段分别对应：石墨 → 4 阶、4 阶 → 2 阶、2 阶 → 1 阶。", { x: 0.6, y: 5.9, w: 6.8, h: 0.45 });
  d.stat(s, { x: 7.75, y: 1.3, w: 2.4, value: "340", unit: "Ah/kg", label: "按 LiC₆ 质量计的容量", color: "accent2" });
  d.stat(s, { x: 10.3, y: 1.3, w: 2.5, value: "10", unit: "%", label: "c 轴最大膨胀", color: "accent2" });
  d.column(s, 7.75, 2.85, 5.0, [
    { kind: "hist", size: 13, body: "Yazami 用 Weppner 与 Huggins 1977 年提出的间歇滴定法 (GITT/PITT)，测得锂在石墨中的扩散系数约 6 × 10⁻⁸ cm²/s。" },
    { kind: "why", size: 13, body: "为什么电位一段一段地降？每完成一次“换阶”，锂的环境就变一次；同一段内两种阶共存，电位基本不变。" },
    { kind: "matters", size: 13, body: "这些台阶都在 1 V 以下，离金属锂很近，所以石墨负极几乎不损失电池电压。" },
  ], 0.16);
  s.addNotes("原文由三个台阶的电位算出自由能：−16.6、−11.5、−7.7 kcal/Li，相当于约 0.72、0.50、0.33 V；合起来得到 6C + Li → LiC₆ 的 ΔG ≈ −9 kcal/Li。这些值比今天在液态电解液、室温下测得的 0.1–0.2 V 高，见校注页。另外，化学分析给出最终平均组成 LiC₁₅，说明电化学嵌锂没有百分之百走到 LiC₆。");

  // ======== Section 3 ========
  d.section("3 吉野彰拼出锂离子电池");
  s = d.slide("DARK_SECTION");
  s.addText("3  吉野彰：把两半拼成锂离子电池", { placeholder: "title" });
  s.addText("从聚乙炔到碳 · “不规整”的碳更好 · 专利保护了什么 · 第一批碳 | LiCoO₂ 电池", { placeholder: "body" });
  s.addNotes("这一节的原始文献是一件专利：US 4,668,595，1986 年 5 月在美国申请，日本优先权最早是 1985 年 5 月 10 日。专利不是论文，读法也不同：先看权利要求 (claims)，再看实施例 (examples)。");

  // ---------------- 18. Yoshino path ----------------
  s = d.slide("CONTENT");
  s.addText("吉野彰的路线：1981–1987", { placeholder: "title" });
  d.fig(s, "yoshino_path", { x: 0.6, y: 1.15, w: 12.1, h: 2.85 });
  d.block(s, { x: c3[0], y: 4.2, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.yoshino });
  d.block(s, { x: c3[1], y: 4.2, w: 3.95, kind: "why", tint: true, size: 13, body: "为什么先选聚乙炔？1977 年白川英树等发现掺杂聚乙炔能导电，它能像嵌入化合物一样接收 Li⁺ 和电子。但它密度低、电池做不小，也不稳定。" });
  d.block(s, { x: c3[2], y: 4.2, w: 3.85, kind: "matters", tint: true, size: 13, body: "吉野彰没有发明新的正极或负极原理。他的贡献是选对组合（碳 + LiCoO₂），并把它做成一个能工作、够安全的电池。" });
  s.addNotes("年份 1981、1983 和 1986 的安全试验来自吉野彰本人的回忆和旭化成的介绍，不在专利原文里。专利原文（col. 2）对导电高分子电极的评价是：循环性差、自放电大，还没到实用水平，这和他放弃聚乙炔的经历一致。聚乙炔的发现者白川英树、MacDiarmid、Heeger 获得 2000 年诺贝尔化学奖。");

  // ---------------- 19. HTT chart ----------------
  s = d.slide("CONTENT");
  s.addText("反直觉的发现：结晶不完美的碳反而更好", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [
    { name: "气相生长碳纤维 VGCF", labels: ["1100", "1400", "1600", "1800", "2400", "2700"], values: [0.151, 0.141, 0.098, 0.091, 0.063, 0] },
    { name: "聚丙烯腈 (PAN) 碳", labels: ["1100", "1400", "1600", "1800", "2400", "2700"], values: [0.159, 0.161, 0.093, 0.081, 0.051, 0.013] },
  ], {
    x: 0.6, y: 1.25, w: 6.6, h: 3.95, barDir: "col", barGapWidthPct: 60,
    chartColors: [HEX.accent2, HEX.accent3],
    valAxisMinVal: 0, valAxisMaxVal: 0.2, valAxisMajorUnit: 0.05, valAxisLabelFormatCode: "0.00", valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showValAxisTitle: true, valAxisTitle: "每个碳原子可逆嵌入的 Li", showCatAxisTitle: true, catAxisTitle: "热处理温度（°C）",
    showLegend: true, legendPos: "t", showTitle: false, ...chartText,
  });
  d.caption(s, "数据：专利 Table 4（Examples 12–15、Comparative 7–8）与 Table 5（Examples 19–22、Comparative 11–12）。LiC₆ 相当于 0.167。", { x: 0.6, y: 5.25, w: 6.6, h: 0.45 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：利用系数 (utilization coefficient)", size: 13, body: "专利里的量：每个碳原子可逆接收几个 Li⁺。0.15 约合 335 mAh/g 碳。" },
    { kind: "why", size: 13, body: "当时的常识是：碳越像石墨，越容易形成插层化合物。专利发现加热到 2400 °C 以上反而变差；商品石墨粉（Comparative 9）充电 1 小时，却一点也放不出来。" },
    { kind: "matters", size: 13, body: "吉野彰因此选了 1000–1400 °C 处理的碳（VGCF、焦炭等）。在 PC 电解液里这是对的选择（见校注）。" },
  ], 0.14);
  d.quote(s, Q.yoshinoIrregular);
  s.addNotes("利用系数的换算：1 个 Li 对 1 个 C 相当于 96 485 ÷ 12.01 ÷ 3.6 ≈ 2 231 mAh/g，乘以 0.15 约 335 mAh/g，乘以 0.167 就是 372 mAh/g。专利用真密度 ρ 和晶粒厚度 Lc 来界定“不太像石墨”的碳：1.70 < ρ < 2.18 g/cm³，而完美石墨是 2.25 g/cm³。");

  // ---------------- 20. Patent claims ----------------
  s = d.slide("CONTENT");
  s.addText("US 4,668,595：专利到底保护了什么？", { placeholder: "title" });
  d.fig(s, "patent_claims", { x: 0.5, y: 1.2, w: 6.9, h: 4.05 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: "日本优先权 1985 年 5 月 10 日起共 6 件；美国申请 1986 年 5 月 9 日；1987 年 5 月 26 日授权，20 项权利要求。首页引用了 Goodenough 的两件美国专利。" },
    { kind: "why", size: 13, body: "权利要求写得很宽：正极是任何“层状复合氧化物”，负极是一大类碳。换一种碳或掺杂元素也绕不开。正极里加了少量 Sn，专利称能改善深度充放电。" },
    { kind: "matters", size: 13, body: "层状氧化物正极 + 碳负极 + 环状碳酸酯 + 聚烯烃隔膜：今天的锂离子电池仍是这套构型。" },
  ], 0.16);
  d.quote(s, { ...Q.yoshinoCombination, en: "The most desirable combination of electrodes is between a positive electrode made of the active material, AxMyNzO2, … and a negative electrode made of the active material of this invention indicated as II." });
  s.addNotes("读专利先读 claim 1：它把电池拆成正极、负极、隔膜、非水电解液四部分，然后说“至少一个电极”用 I 或 II。所以 claim 1 本身甚至涵盖了“Sn 掺杂 LiCoO₂ 配金属锂”的电池。真正对应锂离子电池的是 claim 20：正极用 I、负极用 II。专利还写了用有机高分子溶液作粘结剂、涂在铝箔或铜箔上的方法，这是今天涂布工艺的雏形。");

  // ---------------- 21. Example cell ----------------
  s = d.slide("CONTENT");
  s.addText("第一批“碳 | LiCoO₂”电池：3.9 V", { placeholder: "title" });
  s.addChart(d.pres.charts.LINE, [
    { name: "充电", labels: ["0", "0.02", "0.04", "0.06", "0.08", "0.10", "0.12"], values: [2.77, 3.18, 3.45, 3.63, 3.76, 3.85, 3.91] },
    { name: "放电", labels: ["0", "0.02", "0.04", "0.06", "0.08", "0.10", "0.12"], values: [2.70, 3.13, 3.41, 3.60, 3.72, 3.81, 3.88] },
  ], {
    x: 0.6, y: 1.3, w: 6.6, h: 4.35,
    chartColors: [HEX.accent2, HEX.accent1], lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 8,
    valAxisMinVal: 2.5, valAxisMaxVal: 4.0, valAxisMajorUnit: 0.5, valAxisLabelFormatCode: "0.0", valGridLine: { color: "E3E8EC", size: 1 },
    showValAxisTitle: true, valAxisTitle: "电池电压（V）", showCatAxisTitle: true, catAxisTitle: "每个碳原子嵌入的 Li（利用系数）",
    showLegend: true, legendPos: "t", showTitle: false, ...chartText,
  });
  d.caption(s, "据专利 Fig. 2 读图（近似）。Example 1：负极为蒽油 1200 °C 碳化物，正极为 Sn 掺杂 LiCoO₂，电解液 0.6 M LiClO₄/PC。", { x: 0.6, y: 5.72, w: 6.6, h: 0.45 });
  d.stat(s, { x: 7.75, y: 1.3, w: 2.4, value: "3.9", unit: "V", label: "充电后开路电压", color: "accent3" });
  d.stat(s, { x: 10.3, y: 1.3, w: 2.5, value: "0.15", unit: "Li/C", label: "≈ 335 mAh/g 碳（Ex. 11）", color: "accent3" });
  d.column(s, 7.75, 2.85, 5.0, [
    { kind: "hist", size: 13, body: "Example 11（col. 16）：5 mg VGCF 负极 + LiCoO₂ 正极，0.6 M LiClO₄/PC，聚丙烯无纺布隔膜；2 mA 恒流，3.95 V 充电、2.70 V 放电截止。" },
    { kind: "why", size: 13, body: "为什么组装后要先充电？两极都处在放电态：锂全在 LiCoO₂ 里。第一次充电把锂搬进碳，电池才有电。" },
    { kind: "matters", size: 13, body: "专利报的 911–1292 Wh/kg 只按负极碳的质量算，不是整个电池；但说明碳能存下足够多的锂。" },
  ], 0.16);
  s.addNotes("Example 1 和 Example 11 是专利里最早的两个“碳负极 + 钴酸锂正极”实施例：前者用蒽油碳化物，后者用气相生长碳纤维。两者都在 PC 电解液中工作，电压在 2.7–3.95 V 之间。Example 1 循环 500 次利用系数基本不变（专利 Fig. 3-A），放置 720 小时自放电 15%；Example 11 自放电 7%。");

  // ---------------- 22. Three pieces ----------------
  s = d.slide("CONTENT");
  s.addText("为什么这就是锂离子电池：全程没有金属锂", { placeholder: "title" });
  d.fig(s, "liion_assembled", { x: 0.6, y: 1.15, w: 12.1, h: 3.15 });
  d.block(s, { x: c3[0], y: 4.45, w: 3.95, kind: "hist", tint: true, size: 13, body: "2019 年诺贝尔化学奖：Goodenough、Whittingham、吉野彰。吉野彰回忆：1986 年用铁块砸电池，锂金属电池起火，碳负极电池没有。" });
  d.block(s, { x: c3[1], y: 4.45, w: 3.95, kind: "why", tint: true, size: 13, body: "三块拼图缺一不可：LiCoO₂ 提供锂和 4 V（1980）；嵌入式碳负极取代金属锂（1983、1985）；吉野彰把它们配好，在放电态组装。" });
  d.block(s, { x: c3[2], y: 4.45, w: 3.85, kind: "matters", tint: true, size: 13, body: "负极里的锂一直是离子，不再反复“长出”金属锂，枝晶和起火风险大大降低。“锂离子”说的就是这一点。" });
  s.addNotes("这一页把全章串起来。如果只有 LiCoO₂ 没有碳负极，那就是一个更高电压的锂金属电池；如果只有碳负极，配 TiS₂ 这种不含锂的正极，电池里根本没有可以搬运的锂。只有“含锂的高电压正极 + 空的嵌入负极”组合，才能在没有金属锂的情况下工作。下一章：Moli Energy 锂金属电池的召回、Dahn 的碳与 EC 电解液，以及 Sony 1991 年的商品化。");

  // ======== Section 4 ========
  d.section("4 校注与小结");
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文与常见说法的出入", { placeholder: "title" });
  const ys = [1.3, 1.3];
  Q.corrections.forEach((n, i) => {
    const col = i % 2;
    ys[col] = d.block(s, { x: col ? 6.8 : 0.6, y: ys[col], w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body }) + 0.14;
  });
  s.addNotes("左列是关于“谁用了什么材料”的更正，右列是原文本身的不一致。第一条最常见：很多科普把吉野彰的负极说成“石油焦”，但专利里最先、最详细的是蒽油碳化物和气相生长碳纤维。最后一条提醒：专利对“为什么石墨不行”的解释只在 PC 电解液里成立，第 5 章会看到 EC 电解液如何让石墨翻身。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["高电压正极：LiCoO₂（1980）", "氧化物的 Co⁴⁺/Co³⁺ 能级更低，电压约 4 V，是 TiS₂ 的两倍；在放电态合成，自带锂"],
    ["嵌入式负极：石墨与碳（1983）", "Yazami & Touzain 用 PEO 避开溶剂共嵌入，石墨可逆嵌锂到 LiC₆（372 mAh/g）"],
    ["拼成电池：碳 | LiCoO₂（1985）", "吉野彰：结晶度不高的碳 + LiCoO₂ + PC 电解液 + 聚烯烃隔膜，在放电态组装"],
    ["结果：没有金属锂的锂电池", "锂只以离子形式在两极间“摇摆”。下一章：Moli 召回、Dahn 的碳与 EC、Sony 1991"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.mizPracticality.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.mizPracticality.zh}  —— ${Q.mizPracticality.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("Goodenough 等在 1980 年论文结论里写下这句话：高电压正极让换负极成为可能，但是否实用“还有待探索”。五年后，吉野彰用碳负极给出了答案；又过了六年，Sony 把它做成了商品（第 5 章）。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
