// Ko et al. 2026 — Chapter 2: 电极电位的大幅移动
const path = require("path");
const { HEX } = require("../decklib");
const { PAPER, NB, makeDeck, R, eqBox, titleSlide, roadmap, sectionSlide, summarySlide, CH, finish } = require("./common");

async function build(outFile, figDir) {
  const d = await makeDeck(2, "电极电位的大幅移动", path.join(__dirname, "ch2_figs.js"), figDir);
  const C = d.C;
  let s;

  // ---------------- 1. Title ----------------
  titleSlide(d, {
    title: "第 2 章\n换个电解液，“0 V”会搬家？",
    sub: "电极电位的大幅移动：化学势、Nernst 方程与溶剂化结构",
    fig: "title_motif2",
    notes: "本章对应原文“Large shifts in electrode potentials”一节（第 2–4 页，含 Fig. 2 和式 (1)）。核心结论：电解液改变 Li⁺ 的化学势，从而让所有涉及 Li⁺ 的电极反应电位一起移动，最大可超过 0.6 V；电池电压不变，所以长期被忽视。",
  });

  // ---------------- 2. Roadmap ----------------
  roadmap(d, {
    steps: [
      ["1", "从化学势到电极电位", "μ = μ° + RT ln a，式 (1)，Nernst 方程"],
      ["2", "怎样测“真正的”电位移动", "Li 准参比的陷阱与二茂铁内标"],
      ["3", "为什么会上移", "弱配位溶剂化结构让 Li⁺ 的静电势阱变浅"],
      ["4", "平行移动与权衡", "电池电压不变，但 SEI 与 CEI 的命运改变"],
    ],
    prev: "第 1 章说：电解质会改变 Li⁺ 的能量状态，进而影响两极。本章把这句话变成公式（式 1）和实验（Fig. 2）。",
    fig: "roadmap_fig",
    next: "下一章（第 3 章）：这个电位移动能不能直接算出来？",
    notes: "本章公式最多。读法建议：先抓住一句话“电位 = Li⁺ 化学势 ÷ F”，再看活度、Nernst 方程为什么解释不了 0.6 V，最后看溶剂化结构如何造成这种大移动。",
  });

  // ---------------- 3. Section ----------------
  sectionSlide(d, "1 化学势与电位", "从化学势到电极电位", "三个公式：μ = μ° + RT ln a；E = μ/F；Nernst 方程");

  // ---------------- 4. Chemical potential ----------------
  s = d.slide("CONTENT");
  s.addText("化学势 μ：粒子的“水位”", { placeholder: "title" });
  d.fig(s, "mu_hill", { x: 0.45, y: 1.25, w: 6.6, h: 4.27 });
  eqBox(d, s, { x: 0.6, y: 5.65, w: 6.4, h: 1.15, eq: "μ_{i} = (∂G / ∂n_{i})_{T, p, n(j≠i)}", eqSize: 22, sub: "G：吉布斯自由能；n_{i}：组分 i 的物质的量；下标表示温度 T、压力 p 和其他组分的量保持不变", subSize: 13 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "def", head: "一句话定义", body: "化学势 = 多加 1 mol 某种粒子，体系吉布斯能增加多少。原文称之为 Li⁺ 的“偏摩尔吉布斯自由能”(partial molar Gibbs free energy)。" },
    { kind: "hist", body: "1875–1878 年，Gibbs（耶鲁大学）在《论非均相物质的平衡》中引入化学势，用来判断多相、多组分体系何时达到平衡。" },
    { kind: "why", body: "以前用浓度判断“想不想反应”，但浓度忽略了粒子之间的相互作用。化学势把浓度和相互作用都折算成能量，可以直接比较。" },
    { kind: "matters", body: "后面所有内容都建立在“Li⁺ 的 μ 被电解液改变”上。" },
  ], 0.16);
  s.addNotes("比喻：两个水箱用管子连起来，水总是从高水位流向低水位，直到水位相同。化学势就是粒子的“水位”。在电池里，Li⁺ 在电解液中的化学势越高，它越“不安分”，越想离开电解液去变成 Li 金属，对应的 Li⁺/Li 电位就越高。");

  // ---------------- 5. Activity ----------------
  s = d.slide("CONTENT");
  s.addText("μ = μ° + RT ln a：活度是“有效浓度”", { placeholder: "title" });
  eqBox(d, s, { x: 0.6, y: 1.3, w: 6.4, h: 1.95, eq: "μ = μ° + RT ln a，  a = γ · m / m°", eqSize: 24, sub: "μ°：标准态化学势；R = 8.314 J mol⁻¹ K⁻¹；T：温度（K）；a：活度（无量纲）；m：质量摩尔浓度；m° = 1 mol kg⁻¹；γ：活度系数，衡量偏离理想的程度", subSize: 13 });
  d.fig(s, "activity_crowd", { x: 0.45, y: 3.45, w: 6.6, h: 3.4 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1907 年前后，G. N. Lewis 提出“活度”与活度系数，把理想溶液的公式推广到真实溶液；1923 年他与 Randall 的教科书使之普及。" },
    { kind: "why", body: "理想溶液：粒子互不打扰，a = 浓度，γ = 1。真实溶液：离子互相吸引、排斥、成团，“有效浓度”不等于真实浓度，于是用 γ 修正，而不改公式形式。" },
    { kind: "matters", body: "电池电解液越来越浓（几 mol kg⁻¹），γ 可以偏离 1 好几个数量级（第 3 章 Fig. 3b）。电位的大移动就藏在 γ 里。" },
  ]);
  s.addNotes("RT ln a 这一项：a 变成 10 倍，μ 只增加 RT ln10 ≈ 5.7 kJ mol⁻¹（25 °C）。所以单靠“多放盐”增加浓度，化学势变化很有限；真正的大变化来自 γ，也就是离子周围环境（溶剂化、聚集）的改变。");

  // ---------------- 6. Eq. (1) ----------------
  s = d.slide("CONTENT");
  s.addText("式 (1)：Li⁺/Li 电位 = Li⁺ 化学势 ÷ F", { placeholder: "title" });
  eqBox(d, s, { x: 0.6, y: 1.3, w: 6.2, h: 1.55, eq: "E_{Li⁺/Li} = μ_{Li⁺} / F        (1)", eqSize: 26, sub: "E_{Li⁺/Li}：Li⁺/Li 氧化还原电位；μ_{Li⁺}：电解液中 Li⁺ 的化学势；F = 96485 C mol⁻¹（法拉第常数）" });
  s.addText(R("怎么来的：Li⁺ + e⁻ ⇌ Li 平衡时 μ_{Li⁺} + μ̄_{e⁻} = μ_{Li}。电子的电化学势 μ̄_{e⁻} = −F·E（相对某参比），Li 金属的 μ_{Li} 固定，于是 F·E = μ_{Li⁺} − μ_{Li} + 常数；比较两种电解液时常数相消：ΔE = Δμ_{Li⁺}/F。换算：1 kJ mol⁻¹ ↔ 10.4 mV；0.6 V ↔ 58 kJ mol⁻¹。", { fontSize: 14, color: C.text1 }), { x: 0.6, y: 2.95, w: 6.2, h: 1.3, margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "eq1_ladder", { x: 0.5, y: 4.25, w: 6.3, h: 2.62 });
  d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "1929 年 Guggenheim 提出“电化学势” μ̄ = μ + zFφ，把化学能和电能放进同一个量里。电极电位与吉布斯能的关系 ΔG = −nFE 则可追溯到 19 世纪末 Gibbs、Helmholtz 等。" },
    { kind: "why", body: "以前常把 Li⁺/Li 当作“0 V”参比，默认它不随电解液变。式 (1) 指出：参比本身就由 μ(Li⁺) 决定，换电解液就会移动。" },
    { kind: "matters", body: "电位是反应的“驱动力”。原文：电极电位直接决定电化学反应的驱动力和界面相的稳定性。" },
  ]);
  s.addNotes("原文式 (1) 写成 E = μ/F，严格说右边还差一个与参比和 Li 金属有关的常数（见校注页），但比较两种电解液时这个常数相消，所以真正有意义的是差值 ΔE = Δμ/F。换算：F = 96485 C mol⁻¹，所以 1 kJ mol⁻¹ ÷ F ≈ 10.4 mV。");

  // ---------------- 7. Nernst ----------------
  s = d.slide("CONTENT");
  s.addText("Nernst 方程：浓度每增 10 倍，电位只升 59 mV", { placeholder: "title" });
  eqBox(d, s, { x: 0.6, y: 1.3, w: 6.3, h: 1.75, eq: "E = E° + (RT/F) ln a_{Li⁺}", eqSize: 26, sub: "把 μ = μ° + RT ln a 代入式 (1) 即得。E°：标准电位；RT/F = 25.7 mV（25 °C）；乘以 ln10 得 59.2 mV，即“每十倍 59 mV”", subSize: 13 });
  const ratio = ["1", "2", "5", "10", "100", "1000"];
  s.addChart(d.pres.charts.BAR, [{ name: "理想 Nernst（γ = 1）", labels: ratio, values: [0, 17.8, 41.3, 59.2, 118.3, 177.5] }], {
    x: 0.6, y: 3.2, w: 6.3, h: 3.6, barDir: "col", chartColors: [HEX.accent2], dataLabelFormatCode: "0",
    showTitle: true, title: "理想 Nernst：电位升高（mV）vs 活度倍数", ...CH.font, ...CH.grid, showLegend: false,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1,
    showCatAxisTitle: true, catAxisTitle: "Li⁺ 活度变为原来的几倍", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2, valAxisMaxVal: 200,
  });
  d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "1889 年，Nernst 在莱比锡（Ostwald 实验室）用渗透压和“溶解压”的观点推导出这一关系，最初用来解释浓差电池的电动势。他 1920 年获诺贝尔化学奖（因热化学/热力学第三定律）。" },
    { kind: "why", body: "Nernst 方程本身没错，错在把 a 当成浓度（γ = 1）。稀溶液里这样近似可以；在浓电解液里，γ 的变化远远大于浓度的变化。" },
    { kind: "matters", body: "如果只看浓度，1 → 6 mol kg⁻¹ 只能让电位升约 46 mV。实测却大得多——下一页算给你看。" },
  ]);
  s.addNotes("计算：RT/F = 8.314 × 298.15 / 96485 = 0.02569 V；× ln10 (2.303) = 0.0592 V。所以浓度要变 10 倍才升 59 mV，变 1000 倍也只有 178 mV。原文 Fig. 3c,d 的虚线就是这种“理想 Nernst”预测。");

  // ---------------- 8. Calculation: why ideal Nernst fails ----------------
  s = d.slide("CONTENT");
  s.addText("算一算：0.6 V 意味着什么？", { placeholder: "title" });
  d.stat(s, { x: 0.6, y: 1.3, w: 3.0, value: ">0.6", unit: "V", label: "原文报道的 E(Li⁺/Li) 上移（Fig. 2c）", color: "accent4" });
  d.stat(s, { x: 3.75, y: 1.3, w: 2.9, value: "≈58", unit: "kJ mol⁻¹", label: "等价的 Li⁺ 化学势升高", color: "accent1" });
  d.stat(s, { x: 6.8, y: 1.3, w: 2.9, value: "10¹⁰", unit: "倍", label: "若按理想 Nernst 需要的浓度倍数", color: "accent3" });
  d.stat(s, { x: 9.85, y: 1.3, w: 2.9, value: "~10⁴", unit: "倍", label: "LiFSI/PC 中 γ 的变化量级（Fig. 3b）", color: "accent2" });
  s.addChart(d.pres.charts.BAR, [{ name: "ΔE", labels: ["理想 Nernst\n1→6 mol kg⁻¹", "实测 LiFSI/PC\n≈1→6.4 mol kg⁻¹", "实测最大值\n(不同电解液)"], values: [0.046, 0.30, 0.6] }], {
    x: 0.6, y: 3.05, w: 6.2, h: 3.45, barDir: "col", chartColors: [HEX.accent6, HEX.accent2, HEX.accent4],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFormatCode: "0.00",
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valAxisMaxVal: 0.72, valAxisMinVal: 0,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "电位上移 ΔE（V）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", showLegend: false,
  });
  d.column(s, 7.15, 3.1, 5.6, [
    { kind: "why", body: "0.6 V ÷ 59 mV ≈ 10 个“十倍”，即理想情况下需要把 Li⁺ 浓度提高约 10¹⁰ 倍——不可能。所以大移动只能来自 γ，即 Li⁺ 周围相互作用的改变。" },
    { kind: "matters", body: "结论：电位移动的根源不是“盐多了”，而是溶液结构变了。这就是原文所说的“源于溶液结构的根本改变”。" },
  ]);
  d.caption(s, "实测值据原文 Fig. 3c 读图（近似）；10⁴ 为 Fig. 3b 中高浓端 Δγ 的数量级。", { x: 0.6, y: 6.55, w: 6.2, h: 0.4 }, { size: 11 });
  s.addNotes("换算：0.6 V × 96485 C mol⁻¹ ≈ 57.9 kJ mol⁻¹。理想 Nernst：ΔE = 0.0592 × lg(倍数)，0.6 V 对应 lg(倍数) ≈ 10.1。LiFSI/PC 从约 1 到 6.4 mol kg⁻¹，理想预测只有约 0.04–0.05 V，实测约 0.3 V，差距全部来自活度系数 γ。");

  // ---------------- 9. Section ----------------
  sectionSlide(d, "2 怎样测", "怎样测“真正的”电位移动", "Li 金属当参比，会把移动“藏”起来；需要一把不随电解液变的尺子");

  // ---------------- 10. Quasi reference trap ----------------
  s = d.slide("CONTENT");
  s.addText("Li 准参比的陷阱：尺子自己在动", { placeholder: "title" });
  d.fig(s, "ref_compare", { x: 0.45, y: 1.25, w: 6.6, h: 4.17 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "20 世纪初电化学界约定标准氢电极 SHE 为 0 V；锂电研究为了方便，普遍直接用 Li 金属当参比（V vs Li⁺/Li）。1986 年 IUPAC 发表 Trasatti 的“绝对电极电位”说明（ref. 18）。" },
    { kind: "why", body: "用 Li 当参比，测到的是“正极相对 Li 的差”。换电解液时 Li 和正极一起移动，差值不变，于是电位移动被掩盖了。" },
    { kind: "matters", body: "这是电位移动被长期忽视的实际原因之一。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.55, w: 6.45, en: "Despite this direct thermodynamic linkage, electrolyte-induced shifts in electrode potentials have received surprisingly little attention as a central design parameter in battery research.", zh: "尽管存在这种直接的热力学联系，电解液引起的电极电位移动作为核心设计参数，在电池研究中受到的关注少得惊人。" });
  s.addNotes("准参比（quasi-reference）电极：它的电位并不是热力学上固定的，而是随溶液组成改变。Li 金属的电位正是由式 (1) 的 μ_Li+ 决定，所以它恰恰是最“随电解液而变”的电极。据原文 Fig. 2a,b 重绘。");

  // ---------------- 11. Ferrocene ----------------
  s = d.slide("CONTENT");
  s.addText("二茂铁内标 Fc⁺/Fc：一把不随电解液变的尺子", { placeholder: "title" });
  d.fig(s, "ferrocene", { x: 0.5, y: 1.3, w: 4.4, h: 4.0 });
  d.column(s, 5.2, 1.35, 7.55, [
    { kind: "hist", body: "1951 年二茂铁被意外合成，1952 年 Wilkinson、Woodward 和 Fischer 等确定其“夹心”结构（1973 年诺贝尔奖）。1960 年 Strehlow 等建议用它作与溶剂无关的参比；1980 年 Gagné 等推广为内标；1984 年 IUPAC 正式推荐（ref. 21、23）。" },
    { kind: "why", body: "Fe 的电荷被两片大环包在中间，外面的溶剂“看不太到”它，所以 Fc 与 Fc⁺ 的溶剂化能差别对溶剂不敏感。Li⁺ 又小又裸露，恰恰相反。" },
    { kind: "matters", body: "把 Fc 加进电解液做内标，就能横向比较不同电解液中 Li⁺/Li 的真实位置（原文 Supplementary Note 1）。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.45, w: 12.15, en: "Among these, the ferrocenium/ferrocene (Fc+/Fc) redox couple is particularly attractive owing to its compatibility with a broad range of organic solvents, commercial availability and negligible liquid-junction potentials", zh: "其中，二茂铁鎓/二茂铁（Fc⁺/Fc）电对尤其有吸引力：适用于多种有机溶剂、可商购，而且液接电位可以忽略。" });
  s.addNotes("内标（internal standard）：直接溶进被测电解液里，测 Li 电极与 Fc⁺/Fc 的电位差，不需要盐桥，所以没有液接电位的麻烦。注意：Fc⁺/Fc 也不是绝对不动，只是比 Li⁺/Li 稳定得多，所以适合做比较。");

  // ---------------- 12. CV shift ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 2c：Fc 不动，是 Li⁺/Li 动了 0.6 V", { placeholder: "title" });
  d.fig(s, "cv_shift", { x: 0.45, y: 1.2, w: 7.1, h: 4.67 });
  d.caption(s, "据原文 Fig. 2c 重绘（原图改编自 ref. 20）", { x: 0.6, y: 5.9, w: 6.9, h: 0.3 });
  d.column(s, 7.8, 1.35, 4.95, [
    { kind: "hist", body: "2021 年 Kim 等（Cui、Bao 组）用电位测量探测溶剂化能；2022 年 Ko 等（本文作者）用 Fc 内标系统比较了多种电解液，报道 E(Li⁺/Li) 上移可超过 0.6 V（ref. 20、24）。" },
    { kind: "why", body: "怎么读：两条 CV 中 Fc 峰对齐（竖虚线）。以各自的 Li 为 0 V，传统电解液里 Fc 在约 3.45 V，先进电解液里只有约 2.85 V——说明 Li 的“0 V”往上挪了 0.6 V。" },
    { kind: "matters", body: "0.6 V 是一个巨大的能量差，足以把副反应速率改变好几个数量级（第 4 章）。" },
  ]);
  s.addNotes("循环伏安（CV）：把电位来回扫描，记录电流。Fc 被氧化时出现一个正电流峰，回扫被还原时出现负电流峰，两峰中点就是 Fc⁺/Fc 的电位。读图数值为近似值。");

  // ---------------- 13. Section ----------------
  sectionSlide(d, "3 为什么上移", "为什么会上移？", "答案在 Li⁺ 的“邻居”：谁包着它、包得多紧、周围有多挤");

  // ---------------- 14. Solvation structure ----------------
  s = d.slide("CONTENT");
  s.addText("溶剂化结构：强配体 vs 弱配体", { placeholder: "title" });
  d.fig(s, "solv_compare", { x: 0.45, y: 1.25, w: 6.6, h: 4.27 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1966 年前后，Gutmann 提出“给体数”(donor number) 来衡量溶剂把电子“给”阳离子的能力，至今仍是挑选溶剂的常用指标。" },
    { kind: "why", body: "传统电解液靠高极性、高给体数的 EC 把 Li⁺ 包紧。电位上移电解液则让体积大、含氟、电子云分散的阴离子、溶剂和稀释剂占据 Li⁺ 周围，配位变弱。" },
    { kind: "matters", body: "“弱配位”是一大类新电解液（高浓、局部高浓、弱溶剂化）的共同点（原文 ref. 20）。" },
  ]);
  d.caption(s, "原文举例：弱配体 PF₆⁻、FSI⁻/TFSI⁻ 等磺酰亚胺阴离子、氟化醚；强配体 EC、glyme。", { x: 0.6, y: 5.65, w: 6.4, h: 0.5 }, { size: 12 });
  s.addNotes("配位变弱的证据：配位距离变长或配位数变低（原文 ref. 32–34）。电子云“离域”（delocalized）意思是负电荷摊在大分子上，不集中在一个原子上，所以对 Li⁺ 的静电吸引弱。");

  // ---------------- 15. Potential well ----------------
  s = d.slide("CONTENT");
  s.addText("静电势阱变浅：Li⁺ 被“去稳定”", { placeholder: "title" });
  d.fig(s, "potential_well", { x: 0.45, y: 1.25, w: 6.6, h: 4.27 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1785 年 Coulomb 定量给出点电荷间的静电力。此后从晶体（Madelung，第 3 章）到溶液，人们一直用“周围所有电荷产生的静电势”来理解离子的能量。" },
    { kind: "why", body: "两种效应叠加：①弱配体的静电吸引变弱；②离子密集聚集，相邻 Li⁺ 之间有强烈静电排斥。两者累积，改变了 Li⁺ 感受到的长程静电环境。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.6, w: 12.15, en: "rendering the electrostatic potential at the Li+ site progressively shallower (that is, thermodynamically destabilized). As a consequence, ELi+/Li undergoes a substantial upshift, in some cases exceeding 0.6 V", zh: "使 Li⁺ 所在位置的静电势逐渐变浅（即热力学上被去稳定）。其结果是 E(Li⁺/Li) 大幅上移，有时超过 0.6 V。" });
  d.block(s, { x: 7.35, y: 4.3, w: 5.4, kind: "matters", body: "“变浅”= μ(Li⁺) 升高 = E(Li⁺/Li) 升高，三种说法是一回事。" });
  s.addNotes("注意“长程”：不只是第一溶剂化层，几纳米外的离子和偶极分子也有贡献。这正是计算困难之处（第 3 章 Debye–Hückel 和液体 Madelung 势）。");

  // ---------------- 16. Three families ----------------
  s = d.slide("CONTENT");
  s.addText("三类“电位上移”电解液", { placeholder: "title" });
  d.fig(s, "three_types", { x: 0.5, y: 1.2, w: 12.3, h: 3.75 });
  d.block(s, { x: 0.6, y: 5.05, w: 3.9, kind: "def", head: "HCE 高浓", size: 14, body: "盐/溶剂摩尔比接近 1:1，几乎没有自由溶剂，阴离子大量进入溶剂化层。" });
  d.block(s, { x: 4.75, y: 5.05, w: 3.9, kind: "def", head: "LHCE 局部高浓", size: 14, body: "在 HCE 中加入不溶解盐的氟化醚“稀释剂”，降黏度、保留局部结构。" });
  d.block(s, { x: 8.9, y: 5.05, w: 3.85, kind: "def", head: "WSE 弱溶剂化", size: 14, body: "直接选配位能力弱的溶剂，常规浓度下就形成离子对。" });
  s.addNotes("原文：many electrolytes developed for high-energy-density batteries, including high-concentration, localized high-concentration and weakly solvating electrolytes, share a common feature: a pronounced upshift of the electrode potential。三者表面上不同，本质相同：Li⁺ 的配位环境变弱。");

  // ---------------- 17. HCE history ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从“高浓电解液”到“电位上移”的统一解释", { placeholder: "title" });
  d.fig(s, "hce_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.26 });
  d.block(s, { x: 0.6, y: 5.45, w: 6.0, kind: "why", tint: true, body: "以前把浓电解液的好处归因于“阴离子分解成好 SEI”“自由溶剂少”等。2022 年后，作者把它们统一到一个热力学量：电位上移。" });
  d.block(s, { x: 6.85, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "山田组（Yamada Y. 与 Yamada A.）和王春生组是浓电解液路线的主要推动者，本综述也是对这条路线的“理论总结”。" });
  s.addNotes("时间轴不按比例。2014 年 JACS（ref. 77）：超浓 LiFSI/乙腈电解液在石墨上快充；2015 年 Science：water-in-salt（Suo、王春生、许康等）；2016 年 Nat. Commun.：5.5 M LiFSI/DMC 用于 5 V 级 LiNi0.5Mn1.5O4/石墨电池；2018 年 Adv. Mater.（ref. 28）：PNNL 提出局部高浓；2021 年 Angew.（ref. 29）：弱溶剂化电解液。");

  // ---------------- 18. Enthalpy / entropy caution ----------------
  s = d.slide("CONTENT");
  s.addText("提醒：焓与熵不容易分开", { placeholder: "title" });
  d.fig(s, "entropy_T", { x: 0.5, y: 1.3, w: 5.6, h: 4.0 });
  eqBox(d, s, { x: 0.6, y: 5.4, w: 5.5, h: 1.4, eq: "ΔG = ΔH − TΔS，  (∂E/∂T)_{p} = ΔS / (nF)", eqSize: 18, sub: "ΔH：反应焓；ΔS：反应熵；n：转移电子数", subSize: 13 });
  d.column(s, 6.45, 1.35, 6.3, [
    { kind: "hist", body: "用电动势的温度系数求反应熵，源自 19 世纪 80 年代 Gibbs 与 Helmholtz 的工作（Gibbs–Helmholtz 关系），是测反应熵的经典电化学方法。" },
    { kind: "why", body: "这个方法假设：不同温度下，反应物、产物和溶剂化状态都“一样”。浓电解液的溶剂化结构会随温度改变，这个假设未必成立。" },
    { kind: "matters", body: "原文还提醒：反应熵 ≠ 电解液本身的熵，两者不要混淆。下一章的液体 Madelung 势也只算了焓（静电）部分。" },
  ]);
  d.quote(s, { x: 6.45, y: 5.4, w: 6.3, en: "Note that care should be taken when separating the enthalpic and entropic contributions to the electrode potential.", zh: "注意：把电极电位中的焓贡献与熵贡献分开时需要格外小心。" });
  s.addNotes("μ 是自由能，包含焓（能量，主要是静电相互作用）和熵（混乱度，如配位方式的多样性）两部分。电位上移通常解释为静电去稳定（焓），但熵也可能有贡献，分解时要谨慎。");

  // ---------------- 19. Section ----------------
  sectionSlide(d, "4 平行移动与权衡", "平行移动：看不见，却最要紧", "两极电位一起上移，电池电压不变——但负极和正极的“处境”完全不同了");

  // ---------------- 20. Parallel shift ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 2d：两极电位一起平移，电压不变", { placeholder: "title" });
  d.fig(s, "parallel_shift", { x: 0.5, y: 1.2, w: 12.3, h: 3.13 });
  d.column(s, 0.6, 4.45, 6.0, [
    { kind: "hist", body: "传统测试用两电极扣式电池或以 Li 为准参比的三电极电池，只能看到两极之差。双离子电池（两极载流子不同，如阴离子嵌入石墨）是例外，1990 年代起被研究（ref. 39、40）。" },
  ], 0.18);
  d.column(s, 6.85, 4.45, 5.9, [
    { kind: "why", body: "Li⁺ 化学势一变，所有涉及 Li⁺ 的反应（负极析锂、正极嵌锂）都移动同样多（ref. 37、38），所以 V = E正 − E负 不变。" },
  ], 0.18);
  d.quote(s, { y: 6.0, en: "Such parallel shifts leave the full-cell voltage unchanged and are therefore typically obscured under conventional battery-testing configurations", zh: "这种平行移动使全电池电压保持不变，因此在常规电池测试配置下通常被掩盖。" });
  s.addNotes("类比：一栋楼整体抬高 0.6 米，每层之间的高度差不变，但每一层离“地下水位”（电解液的分解极限）的距离都变了。据原文 Fig. 2d 重绘，横轴为 V vs Fc⁺/Fc。");

  // ---------------- 21. Window trade-off ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 2e：上移有利于 SEI，却加重 CEI", { placeholder: "title" });
  d.fig(s, "window_tradeoff", { x: 0.5, y: 1.15, w: 12.3, h: 4.27 });
  d.block(s, { x: 0.6, y: 5.45, w: 3.95, kind: "hist", size: 14, body: "2010 年 Goodenough 与 Kim 的“电解液窗口”图让“电极落在窗口外就需要钝化膜”的观念深入人心。" });
  d.block(s, { x: 4.75, y: 5.45, w: 3.95, kind: "why", size: 14, body: "以前只想“把窗口拓宽”。现在还要考虑：电极自己会随电解液整体平移。" });
  d.block(s, { x: 8.9, y: 5.45, w: 3.85, kind: "matters", size: 14, body: "未来电解液 = 最大上移 + 耐氧化溶剂/稀释剂 + 先进 SEI/CEI。" });
  s.addNotes("负极上移 → 离还原极限近了 → 还原驱动力变小 → SEI 负担轻、Li 和 Si 更可逆。正极同样上移 → 可能超出氧化极限 → 电解液在正极加速氧化，过渡金属还会催化（ref. 41）。所以需要耐氧化的溶剂/稀释剂和先进的 CEI。据原文 Fig. 2e 重绘，窗口位置为示意。");

  // ---------------- 22. Takeaway quote slide (design parameter) ----------------
  s = d.slide("CONTENT");
  s.addText("设计启示：优化整张“电位地形图”", { placeholder: "title" });
  eqBox(d, s, { x: 0.6, y: 1.35, w: 12.15, h: 1.3, eq: "电位地形 = 电极电位移动 + 电解液电位窗口 + SEI/CEI 的动力学阻挡", eqSize: 22, color: "accent2", fill: "E8F4F3" });
  d.column(s, 0.6, 2.95, 6.0, [
    { kind: "why", body: "以前：分别优化“窗口”“界面成分”“电导率”。现在：先问电解液把 Li⁺ 的化学势改成了多少，两极因此移到哪里，再看窗口和界面能否兜住。" },
    { kind: "matters", body: "第 3 章：怎么预测这个移动；第 4 章：移动如何改变 SEI 的形成和寿命；第 5 章：两极兼顾的设计。" },
  ]);
  d.quote(s, { x: 6.85, y: 2.95, w: 5.9, bottom: 5.0, en: "Although this shift may be hidden in the full-cell voltage, it strongly affects the thermodynamic driving forces for electrolyte decomposition at both electrode surfaces.", zh: "尽管这种移动可能隐藏在全电池电压之中，它却强烈影响两极表面电解液分解的热力学驱动力。" });
  d.block(s, { x: 6.85, y: 5.1, w: 5.9, kind: "def", tint: true, head: "电位地形图 potential landscape", body: "把负极、正极、电解液还原/氧化极限画在同一条电位轴上（如 Fig. 2e），一眼看出哪里需要界面相“兜底”。" });
  s.addNotes("本页是本章的“设计结论”。原文原话：This realization emphasizes the need for quantitative optimization of the overall battery potential landscape, encompassing electrode-potential shifts, electrolyte potential windows and kinetic hindrance by the SEI and CEI。");

  // ---------------- 23. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本节的三处细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① 式 (1) 是“相对”关系", body: "原文写 E(Li⁺/Li) = μ(Li⁺) / F。严格的平衡条件给出 F·E = μ(Li⁺) − μ_Li + 常数（与参比电极有关）。式 (1) 省略了常数，只在比较差值时成立：ΔE = Δμ(Li⁺) / F。原文 Fig. 3c 的公式正是用 Δ 写的。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 第 4 页一句措辞", body: "原文：“…assumes that the underlying redox and solvation states remain comparable to temperature”。意思应为“在不同温度下保持可比”（comparable across temperatures），“to temperature”是措辞笔误。" });
  d.block(s, { x: 0.6, y: 3.95, w: 12.15, kind: "note", tint: true, head: "③ Fig. 2 的标签", body: "Fig. 2c 横轴标签写作 “E(Li+Li)”，漏了斜杠，应为 E(Li⁺/Li)；Fig. 2d 中 “Li cathode” 指“锂电池的正极（嵌 Li⁺ 正极）”，不是锂金属正极。读图时不要误解。" });
  s.addNotes("这三处都不影响结论。第①条值得记住：电极电位永远是相对量，只有选定参比后才有数值，所以原文才那么强调 IUPAC 推荐的内标。");

  // ---------------- 24. Summary ----------------
  summarySlide(d, {
    items: [
      ["E_{Li⁺/Li} = μ_{Li⁺}/F：电位由 Li⁺ 的化学势决定", "μ = μ° + RT ln a；比较两种电解液时 ΔE = Δμ/F"],
      ["理想 Nernst 只给“每十倍 59 mV”", "0.6 V 的上移需要 γ 变化好几个数量级，根源是溶液结构"],
      ["用 Fc⁺/Fc 内标才看得见", "Li 准参比和两电极测试会把移动藏起来"],
      ["弱配位 + 离子聚集 → 静电势阱变浅 → 电位上移", "HCE、LHCE、WSE 的共同本质"],
      ["两极平行移动：电压不变，SEI 受益、CEI 受累", "要优化整张电位地形图"],
    ],
    quote: { en: "This realization emphasizes the need for quantitative optimization of the overall battery potential landscape", zh: "这一认识强调：需要对整个电池的电位地形进行定量优化。" },
  });

  return finish(d, outFile, figDir);
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
