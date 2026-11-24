// Ko et al. 2026 — Chapter 3: 计算预测
const path = require("path");
const { HEX } = require("../decklib");
const { PAPER, NB, makeDeck, R, eqBox, titleSlide, roadmap, sectionSlide, summarySlide, CH, finish } = require("./common");

async function build(outFile, figDir) {
  const d = await makeDeck(3, "计算预测", path.join(__dirname, "ch3_figs.js"), figDir);
  const C = d.C;
  let s;

  // ---------------- 1. Title ----------------
  titleSlide(d, {
    title: "第 3 章\n电位移动能“算”出来吗？",
    sub: "计算预测：从晶体的 Madelung 能到液体 Madelung 势",
    fig: "title_motif3",
    notes: "本章对应原文“Computational prediction”一节（第 4–6 页，含 Fig. 3）。原文主线：离子在液体中的静电势是化学势的主要贡献，但一百年来只有晶体能严格计算；作者组 2024 年提出的液体 Madelung 势首次定量复现了浓电解液的电位移动。开头补充一段“HOMO/LUMO 误区”，帮助理解为什么作者坚持用化学势。",
  });

  // ---------------- 2. Roadmap ----------------
  roadmap(d, {
    steps: [
      ["1", "先破误区：HOMO/LUMO ≠ 电位", "为什么作者用化学势而不用轨道能（补充）"],
      ["2", "晶体好算，液体难算", "Madelung 能（1918）与液体的困难"],
      ["3", "一百年的理论演进", "Debye–Hückel → Pitzer → MSA/RISM/PCM → MD"],
      ["4", "液体 Madelung 势", "定量复现 Fig. 3c,d，以及它的局限"],
    ],
    prev: "第 2 章：ΔE = Δμ_Li⁺/F，而 μ 的大变化来自 Li⁺ 周围的静电环境。本章问：这个静电环境能不能直接计算？".replace("μ_Li⁺", "μ(Li⁺)"),
    fig: "roadmap3",
    next: "下一章（第 4 章）：电位移动如何改变 SEI/CEI 的形成与寿命。",
    notes: "本章的公式有三个：Madelung 能、Debye–Hückel 的活度系数公式、液体 Madelung 势。每个都会解释符号和来历。第 1 部分 HOMO/LUMO 的内容原文没有专门成节，属于帮助理解的补充，会明确标注。",
  });

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：一百年的“离子静电能”理论", { placeholder: "title" });
  d.fig(s, "timeline3", { x: 0.5, y: 1.15, w: 12.3, h: 4.26 });
  d.block(s, { x: 0.6, y: 5.45, w: 6.0, kind: "why", tint: true, body: "灰：晶体；紫：宏观热力学（稀→浓，靠拟合）；橙：分子层面平均场；青：显式分子模拟；红：本文作者组把 Madelung 思路搬进液体。" });
  d.block(s, { x: 6.85, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "原文：自 Debye–Hückel 以来的百年里，溶液热力学从连续介质和半经验描述，走向能量化焓与熵贡献的分子模拟。" });
  s.addNotes("时间轴不按比例。年份按原文参考文献：Debye–Hückel 1923（ref. 43）、Scatchard 1936（ref. 45）、Pitzer 1973（ref. 47）、Blum 1975（ref. 48）、Hirata & Rossky 1981（ref. 49）、Miertuš/Scrocco/Tomasi 1981（ref. 50）、Widom 1963（ref. 51）、Takenaka 等 2024（ref. 54）。Madelung 原文写 1919，但 Phys. Z. 第 19 卷是 1918 年（见校注页）。Alder & Wainwright 1957 为补充。");

  // ---------------- 4. Section ----------------
  sectionSlide(d, "1 HOMO/LUMO 误区", "先破一个误区：HOMO/LUMO ≠ 氧化还原电位", "补充内容：理解作者为什么用“载流子化学势”而不是“轨道能级”");

  // ---------------- 5. HOMO/LUMO window ----------------
  s = d.slide("CONTENT");
  s.addText("流行的图景：用 HOMO/LUMO 画“电位窗口”", { placeholder: "title" });
  d.fig(s, "homo_lumo", { x: 0.45, y: 1.2, w: 6.6, h: 4.7 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "福井谦一于 1952 年提出前线轨道理论（HOMO/LUMO，1981 年诺贝尔化学奖）。2010 年 Goodenough 与 Kim 在综述中用 HOMO/LUMO 画出电池的“电解液窗口”图，此后广为流传。" },
    { kind: "why", body: "为什么大家爱用：算一个孤立分子的 HOMO/LUMO 只需一次 DFT 计算，便宜、可大规模筛选，图像也直观。" },
    { kind: "matters", body: "但这张图把“轨道能”和“电极电位”混为一谈，下一页说明问题出在哪里。" },
  ]);
  d.caption(s, "补充（原文未讨论）：据 Goodenough & Kim, Chem. Mater. 2010 的示意图思路绘制", { x: 0.6, y: 6.0, w: 6.5, h: 0.4 }, { size: 12 });
  s.addNotes("HOMO：最高占据分子轨道，粗略对应“最容易被拿走的电子”；LUMO：最低未占分子轨道，对应“最容易接受电子的位置”。图中 μ_A、μ_C 是电极中电子的电化学势（费米能级）。这张图作为定性直觉没问题，问题在于把孤立分子的轨道能当成定量的电位。");

  // ---------------- 6. Why not HOMO/LUMO ----------------
  s = d.slide("CONTENT");
  s.addText("为什么不能直接用轨道能？要算自由能", { placeholder: "title" });
  d.fig(s, "thermo_cycle", { x: 0.45, y: 1.2, w: 6.6, h: 4.37 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "2018 年 Peljo 与 Girault 撰文专门批评“HOMO–LUMO 误区”。1956 年 Marcus 指出电子转移还涉及溶剂重组能（1992 年诺贝尔化学奖）。" },
    { kind: "why", body: "电位对应反应前后的自由能差，必须计入溶剂化、重组、离子配对和产物的去向。孤立分子的 LUMO 只反映图中第一步，常常偏差很大。" },
    { kind: "matters", body: "所以作者用 Li⁺ 的化学势：它是热力学量，可测（Fc 内标）也可算（本章后半），并天然包含环境的影响。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.65, w: 6.45, en: "a rigorous definition of the electrolyte potential window is not possible in practical liquid electrolytes", zh: "在实际的液态电解质中，无法严格定义电解质的电位窗口。（原文第 7 页）" });
  s.addNotes("热力学循环（玻恩–哈伯循环思路）：气相还原能 + 两个溶剂化自由能 = 溶液中的还原自由能。常用 DFT 算气相部分，用 PCM 等连续溶剂模型算溶剂化部分。−1.40 V 来自：标准氢电极的绝对电位约 4.44 V（Trasatti 1986，IUPAC），Li⁺/Li 比它低 3.04 V，所以 Li⁺/Li 的绝对电位约 1.40 V。");

  // ---------------- 7. Toolbox by scale ----------------
  s = d.slide("CONTENT");
  s.addText("计算工具箱：DFT、MD、机器学习各管哪一段", { placeholder: "title" });
  d.fig(s, "methods_scale", { x: 0.45, y: 1.2, w: 6.6, h: 4.47 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1964–65 年 Hohenberg、Kohn、Sham 奠定密度泛函理论 DFT（Kohn 1998 年诺奖）；1957 年 Alder 与 Wainwright 做出第一次分子动力学模拟；1985 年 Car–Parrinello 从头算 MD；2007 年 Behler–Parrinello 神经网络势。" },
    { kind: "why", body: "DFT 准但慢，只能算几百个原子、几十皮秒；经典 MD 能算纳米、纳秒，但依赖力场参数。机器学习势想兼得两者。" },
    { kind: "matters", body: "原文提醒：模拟时间尺度与真实电池运行（小时）之间仍有巨大鸿沟。" },
  ]);
  d.caption(s, "补充：原文未专门讨论 DFT 与机器学习，此页用于定位各方法；尺度为数量级示意。", { x: 0.6, y: 5.75, w: 6.5, h: 0.4 }, { size: 12 });
  s.addNotes("原文第 9 页：Computational approaches also remain limited by the mismatch between accessible simulation timescales and practical battery operation。机器学习在电解液领域主要用于高通量筛选（预测性质）和机器学习力场（加速分子模拟），但都需要可靠的训练数据和正确的热力学量作为目标——这正是化学势比 HOMO/LUMO 更合适的地方。");

  // ---------------- 8. Section ----------------
  sectionSlide(d, "2 晶体与液体", "晶体好算，液体难算", "离子的位置固定不固定，决定了静电能能否“一加到底”");

  // ---------------- 9. Madelung ----------------
  s = d.slide("CONTENT");
  s.addText("Madelung 能：晶体中一个离子感受到的全部静电", { placeholder: "title" });
  d.fig(s, "madelung_lattice", { x: 0.45, y: 1.2, w: 6.4, h: 4.54 });
  d.column(s, 7.15, 1.35, 5.6, [
    { kind: "def", head: "式中符号", body: "M：Madelung 常数（只取决于晶体结构）；z：离子价；e：元电荷；ε₀：真空介电常数；r₀：最近邻离子间距。" },
    { kind: "hist", body: "1918 年 Madelung 计算了规则排列点电荷的电场（原文写 1919）；1921 年 Ewald 发明了让这种“无穷求和”快速收敛的方法（Ewald 求和），今天的分子模拟仍在使用。" },
    { kind: "why", body: "直接逐项加和收敛极慢、甚至依赖求和顺序；Ewald 把它拆成实空间和倒空间两部分分别求和，问题才解决。" },
  ], 0.18);
  d.quote(s, { x: 0.6, y: 5.85, w: 12.15, en: "Historically, however, rigorous calculations of electrostatic potentials have been well established only for crystalline solids", zh: "然而在历史上，只有晶体固体的静电势能被严格计算。" });
  s.addNotes("NaCl 的 Madelung 常数约 1.748。注意第一圈 6 个异号离子吸引，第二圈 12 个同号离子排斥……正负交替，所以必须小心求和。原文：晶体中离子位置固定，使能量计算精确而无歧义。");

  // ---------------- 10. Bridge Fig 3a ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 3a：真实电解液夹在两种“好算”的极限之间", { placeholder: "title" });
  d.fig(s, "bridge", { x: 0.5, y: 1.2, w: 12.3, h: 3.13 });
  d.column(s, 0.6, 4.45, 6.0, [
    { kind: "why", body: "极稀溶液：离子相距很远，可以当作“一个离子 + 均匀介质”（Debye–Hückel）。晶体：位置固定，可以严格加和（Madelung）。电池电解液两边都不是：又浓又乱又在动。" },
  ]);
  d.column(s, 6.85, 4.45, 5.9, [
    { kind: "matters", body: "原文：离子和溶剂分子不停热运动，并存在很强的空间与时间关联，这长期阻碍了对长程静电贡献的普遍评估。" },
  ]);
  d.caption(s, "据原文 Fig. 3a 重绘", { x: 0.6, y: 6.45, w: 6, h: 0.3 });
  s.addNotes("“关联”的意思是：一个离子的位置会影响附近离子的位置，而且这种影响随时间不断变化。所以不能简单地把每个离子当作独立的点电荷来处理，这正是浓电解液难算的根源。");

  // ---------------- 11. Section ----------------
  sectionSlide(d, "3 理论演进", "一百年的理论演进", "从“均匀介质中的点电荷”到“显式分子”，每一步都在补上一种被忽略的相互作用");

  // ---------------- 12. Debye–Hückel ----------------
  s = d.slide("CONTENT");
  s.addText("Debye–Hückel 理论（1923）：离子氛", { placeholder: "title" });
  d.fig(s, "dh_atmosphere", { x: 0.45, y: 1.2, w: 6.2, h: 4.2 });
  eqBox(d, s, { x: 0.6, y: 5.5, w: 6.05, h: 1.3, eq: "lg γ_{±} = −A |z_{+}z_{−}| √I", eqSize: 22, sub: "极限定律。γ_{±}：平均活度系数；A：与温度、溶剂介电常数有关的常数（25 °C 水中约 0.51）；I = ½ Σ c_{i}z_{i}^{2}：离子强度", subSize: 12 });
  d.column(s, 6.95, 1.35, 5.8, [
    { kind: "hist", body: "1887 年 Arrhenius 提出电离理论；1923 年 Debye 与 Hückel 提出离子氛理论（Debye 1936 年获诺贝尔化学奖）；1926 年 Bjerrum 引入离子缔合，1927 年 Onsager 把理论推广到电导。" },
    { kind: "why", body: "以前：强电解质的反常被解释为“没有完全电离”。DH 改为：完全电离，但离子之间有静电吸引，形成离子氛。做法是把 Poisson–Boltzmann 方程线性化后求解。" },
    { kind: "matters", body: "它只在极稀时（约 0.01 mol kg⁻¹ 以下）准确；电池电解液是 1–6 mol kg⁻¹，假设全部失效：忽略了离子配对、离子大小和特定的离子–溶剂作用。" },
  ]);
  s.addNotes("Debye 长度 κ⁻¹ 是离子氛的厚度：浓度越高越薄。25 °C 水中 1:1 盐 1 mol L⁻¹ 时只有约 0.3 nm，比离子本身还小，这时“均匀离子氛”的图像已经没有意义。lg 表示以 10 为底的对数。");

  // ---------------- 13. Extended DH / Pitzer ----------------
  s = d.slide("CONTENT");
  s.addText("扩展 DH 与 Pitzer：用拟合参数“打补丁”", { placeholder: "title" });
  eqBox(d, s, { x: 0.6, y: 1.3, w: 6.3, h: 1.85, eq: "lg γ = −A√I / (1 + Ba√I) + bI", eqSize: 26, sub: "原文 Fig. 3b 用的扩展 DH 式。分母 1 + Ba√I：考虑离子有大小（a 为最近距离参数，B 为常数）；bI：经验修正项，b 靠拟合实验数据得到", subSize: 13 });
  s.addChart(d.pres.charts.SCATTER, [
    { name: "X", values: [0.01, 0.1, 0.5, 1.0, 2.7, 3.3, 5.1, 6.5] },
    { name: "实验 Δγ（vs 1 m）", values: [0.14, 0.2, 0.47, 1.0, 90, 340, 17000, 67000] },
  ], {
    x: 0.6, y: 3.3, w: 6.3, h: 3.55, chartColors: [HEX.dk1], lineSize: 0, lineDataSymbol: "circle", lineDataSymbolSize: 9,
    valAxisLogScaleBase: 10, valAxisMinVal: 0.1, valAxisMaxVal: 100000, valAxisLabelFormatCode: "#,##0.#",
    showTitle: true, title: "LiFSI/PC 的活度系数比 Δγ（对数轴）", ...CH.font, ...CH.grid, showLegend: false,
    showCatAxisTitle: true, catAxisTitle: "盐浓度（mol kg⁻¹）", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "1936 年 Scatchard、1955 年 Guggenheim 与 Turgeon 提出离子相互作用模型；1973 年 Pitzer 模型问世，至今是地球化学、海水化学计算活度的标准工具。" },
    { kind: "why", body: "做法：在 DH 式后面加随浓度变化的修正项。能很好地拟合平均活度系数，但每换一种盐、一种溶剂就要重新拟合一套参数。" },
  ]);
  d.quote(s, { x: 7.2, y: 4.55, w: 5.55, en: "However, their reliance on multiple interaction parameters fitted to experimental data severely limits a priori predictive capability", zh: "然而，它们依赖多个由实验数据拟合的相互作用参数，这严重限制了事先预测的能力。" });
  s.addNotes("左下图据原文 Fig. 3b 读图（近似）：Δγ 是相对 1 m LiFSI/PC 的活度系数比，从约 0.1 一路升到约 7×10⁴，跨了约 6 个数量级。扩展 DH 只能拟合 0.5 mol kg⁻¹ 以下的稀区；原文说要外推到高浓区需要复杂的体系专属拟合，所以没画。");

  // ---------------- 14. Molecular theories ----------------
  s = d.slide("CONTENT");
  s.addText("分子层面的平均场理论：MSA、RISM、PCM", { placeholder: "title" });
  d.fig(s, "molecular_theories", { x: 0.5, y: 1.2, w: 12.3, h: 3.44 });
  d.block(s, { x: 0.6, y: 4.8, w: 3.95, kind: "hist", size: 14, body: "1920 年 Born 溶剂化模型；1970 年代 MSA（Blum 1975）；1972 年 Chandler 与 Andersen 提出 RISM，1981 年 Hirata 与 Rossky 扩展；1981 年 Tomasi 等提出 PCM。" });
  d.block(s, { x: 4.75, y: 4.8, w: 3.95, kind: "why", size: 14, body: "比 DH 进一步：考虑离子大小、溶剂在离子周围的排布，并能接上量子化学，计算又快。" });
  d.block(s, { x: 8.9, y: 4.8, w: 3.85, kind: "matters", size: 14, body: "但都是平均场或连续溶剂描述，抓不住真实电解液中的长程静电关联。" });
  s.addNotes("MSA：mean spherical approximation，平均球近似；RISM：reference interaction site model，参考相互作用位点模型；PCM：polarizable continuum model，极化连续介质模型。原文说这些框架在 1990 年代前后不断完善（refined through the 1990s）。");

  // ---------------- 15. MD ----------------
  s = d.slide("CONTENT");
  s.addText("分子动力学：显式模拟每个分子，却难得到单个离子的值", { placeholder: "title" });
  d.fig(s, "md_box", { x: 0.45, y: 1.2, w: 6.6, h: 4.43 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1957 年 Alder 与 Wainwright 首次做 MD；1964 年 Rahman 模拟液态氩；1963 年 Widom 提出插入法求化学势；2010 年 Luo 与 Roux 用渗透压法研究浓盐溶液（ref. 51、52）。" },
    { kind: "why", body: "平均场的局限推动了 MD 的广泛使用：离子和溶剂都显式存在，关联自然包含在内。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.75, w: 12.15, en: "they still struggle to yield direct, unambiguous single-ion electrostatic potentials owing to charge-neutrality constraints and ambiguities in the choice of reference in periodic simulation cells", zh: "由于电中性约束以及周期性模拟盒中参考点选择的歧义，它们仍难以直接、无歧义地给出单个离子的静电势。" });
  d.block(s, { x: 7.35, y: 4.15, w: 5.4, kind: "matters", body: "而电极电位恰恰需要“单个 Li⁺”的能量，这是关键缺口。" });
  s.addNotes("Widom 插入法：在模拟盒中随机位置“虚拟地”放入一个粒子，计算它与周围的相互作用能，按玻尔兹曼因子平均就得到化学势。对离子来说，插入一个带电粒子会破坏电中性，还要处理周期性边界下电势零点不确定的问题。");

  // ---------------- 16. Section ----------------
  sectionSlide(d, "4 液体 Madelung 势", "液体 Madelung 势：把晶体的办法搬进液体", "对 MD 轨迹中每个 Li⁺ 感受到的静电势做时间和空间平均");

  // ---------------- 17. Liquid Madelung concept ----------------
  s = d.slide("CONTENT");
  s.addText("液体 Madelung（Ewald）势：怎么算", { placeholder: "title" });
  d.fig(s, "liquid_madelung", { x: 0.45, y: 1.2, w: 6.4, h: 4.27 });
  eqBox(d, s, { x: 7.1, y: 1.3, w: 5.65, h: 2.05, eq: "ΔE_{Li⁺/Li} ≅ (Δ/F)·(1/N_{Li⁺})·\n[ ⟨Σ q_{Li⁺}q_{i}/(4πε_{0}r_{i})⟩ − ⟨Σ q_{Li⁺}(r_{i}·μ_{i})/(4πε_{0}r_{i}^{3})⟩ ]", eqSize: 16, sub: "q：电荷；r_{i}：第 i 个粒子到 Li⁺ 的距离（向量）；μ_{i}：溶剂偶极矩；N_{Li⁺}：Li⁺ 个数；⟨ ⟩：对 MD 各帧平均；Δ：两种电解液之差", subSize: 12 });
  d.column(s, 7.1, 3.55, 5.65, [
    { kind: "hist", body: "2024 年 Takenaka、Ko、Kitada 与 Yamada 在 Nat. Commun. 提出（ref. 54），2025 年又提出替代 Debye–Hückel 的热力学框架（预印本，ref. 55）。" },
    { kind: "why", body: "DH 只适合稀溶液，Pitzer 需要拟合；液体 Madelung 势直接从 MD 轨迹算 Li⁺ 位置的静电势，无需活度拟合。" },
  ], 0.16);
  d.quote(s, { x: 0.6, y: 5.6, w: 6.3, bottom: 6.88, en: "By extending the Madelung concept from crystalline solids to liquid electrolyte environments, this model captures the time-averaged and space-averaged electrostatic potential experienced by a given ion", zh: "把 Madelung 概念从晶体推广到液态电解质，该模型捕捉到某个离子所感受到的、经时间和空间平均的静电势。" });
  s.addNotes("公式据原文 Fig. 3c 中的框（原文把两项写成“+(−…)”的形式，这里合并成减号）。第一项：周围所有离子的电荷对 Li⁺ 的库仑势；第二项：周围溶剂分子偶极矩对 Li⁺ 的静电势。括号名称中的 Ewald 指用 Ewald 求和处理周期性盒子中的长程静电。详细公式见原文 Supplementary Note 2。");

  // ---------------- 18. Fig 3c,d charts ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 3c,d：计算与实验吻合，理想 Nernst 差得远", { placeholder: "title" });
  const chartOpts = (title, catTitle) => ({
    chartColors: [HEX.dk1, HEX.accent4, HEX.accent6], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 8,
    showTitle: true, title, ...CH.font, ...CH.legend, ...CH.grid, valAxisMinVal: 0, valAxisMaxVal: 0.35, valAxisLabelFormatCode: "0.0",
    showCatAxisTitle: true, catAxisTitle: catTitle, catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
    showValAxisTitle: true, valAxisTitle: "ΔE（V）", valAxisTitleFontSize: 12, valAxisTitleColor: HEX.dk2,
  });
  const mPC = ["1.2", "2.5", "3.4", "5.0", "6.4"];
  s.addChart(d.pres.charts.LINE, [
    { name: "实验", labels: mPC, values: [0, 0.095, 0.155, 0.245, 0.305] },
    { name: "液体 Madelung 计算", labels: mPC, values: [0, 0.11, 0.175, 0.235, 0.28] },
    { name: "理想 Nernst（γ = 1）", labels: mPC, values: [0, 0.019, 0.027, 0.037, 0.043] },
  ], { x: 0.5, y: 1.25, w: 6.1, h: 3.9, ...chartOpts("c  LiFSI/PC：改变盐浓度", "盐浓度（mol kg⁻¹）") });
  const xT = ["0", "0.1", "0.3", "0.5", "0.6"];
  s.addChart(d.pres.charts.LINE, [
    { name: "实验", labels: xT, values: [0, 0.03, 0.085, 0.175, 0.255] },
    { name: "液体 Madelung 计算", labels: xT, values: [0, 0.055, 0.145, 0.24, 0.315] },
    { name: "理想 Nernst（γ = 1）", labels: xT, values: [0, 0, 0, 0, 0] },
  ], { x: 6.75, y: 1.25, w: 6.1, h: 3.9, ...chartOpts("d  LiFSI/THF:甲苯：加入非极性甲苯", "甲苯占溶剂的摩尔分数") });
  d.block(s, { x: 0.6, y: 5.3, w: 5.9, kind: "why", tint: true, body: "图 d 尤其说明问题：盐浓度几乎不变，只是把部分 THF 换成不配位的甲苯，电位却升了约 0.25 V。浓度不变，Nernst 预测为零，变化全来自静电环境。" });
  d.block(s, { x: 6.85, y: 5.3, w: 5.9, kind: "matters", tint: true, body: "这是第一次用“无拟合参数”的分子模拟，定量复现浓电解液中数百毫伏的电位移动，为“先算后做”的电解液设计打下基础。" });
  s.addNotes("数值据原文 Fig. 3c,d 读图（近似），横轴为原图数据点位置。一致性检查：Fig. 3b 中 6.5 m 处 Δγ ≈ 6.7×10⁴，代入 ΔE = (RT/F) ln(γm 之比) ≈ 0.0257 × ln(6.7×10⁴ × 6.5) ≈ 0.33 V，与 Fig. 3c 实测约 0.3 V 基本吻合。");

  // ---------------- 19. Caveats ----------------
  s = d.slide("CONTENT");
  s.addText("使用液体 Madelung 势要小心什么", { placeholder: "title" });
  d.fig(s, "caveats", { x: 0.5, y: 1.25, w: 12.3, h: 1.9 });
  d.column(s, 0.6, 3.45, 6.0, [
    { kind: "hist", body: "1924 年 Lennard-Jones 提出描述分子间排斥与吸引的经验势，今天几乎所有经典力场都用它，加上每个原子的部分电荷。" },
  ]);
  d.column(s, 6.85, 3.45, 5.9, [
    { kind: "why", body: "液体 Madelung 势本质上是静电（焓）稳定化。配位方式改变、离子聚集或螯合带来的熵变化也会改变自由能，需要另外考虑。" },
  ]);
  d.quote(s, { y: 4.5, bottom: 5.75, en: "Moreover, because the liquid Madelung potential reflects electrostatic enthalpic stabilization, additional free-energy contributions, particularly entropic terms arising from changes in coordination, ion aggregation or chelation, should also be considered.", zh: "此外，由于液体 Madelung 势反映的是静电焓稳定化，还应考虑其他自由能贡献，尤其是配位变化、离子聚集或螯合带来的熵项。" });
  d.block(s, { x: 0.6, y: 5.9, w: 12.15, kind: "matters", tint: true, size: 14, body: "算出来的数值依赖模型细节。把它当作“理解和排序”的工具，比当作精确预测更稳妥；与 Fc 内标实验互相校验最好。" });
  s.addNotes("原文第 5 页：reliable application requires caution, as the computed potential can be affected by finite-size effects, sampling convergence in slowly relaxing ion-aggregated liquids, and force-field-dependent parameters。");

  // ---------------- 20. Method comparison ----------------
  s = d.slide("CONTENT");
  s.addText("方法对比：各自补上了什么，又缺了什么", { placeholder: "title" });
  d.fig(s, "methods_map", { x: 0.5, y: 1.2, w: 12.3, h: 4.38 });
  d.block(s, { x: 0.6, y: 5.7, w: 6.0, kind: "why", tint: true, size: 14, body: "趋势：从“拟合宏观数据”走向“从分子结构直接计算”。" });
  d.block(s, { x: 6.85, y: 5.7, w: 5.9, kind: "matters", tint: true, size: 14, body: "展望（原文）：需要覆盖更多盐、溶剂、稀释剂和浓度，建立预测性基础。" });
  s.addNotes("原文结尾：Continued advances across diverse salt, solvent, diluent and concentration spaces will help to establish a predictive foundation for understanding and designing electrochemical potential landscapes in future electrolytes。机器学习可望帮助扩展这个“空间”，但目标量应是化学势这类热力学量。");

  // ---------------- 21. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：年份、拼写与一个一致性检查", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① Madelung 能的年份", body: "原文正文和 Fig. 3a 写 “introduced in 1919”，ref. 42 也标 (1919)。Madelung 的论文发表在 Phys. Z. 第 19 卷，该卷为 1918 年，通常引作 1918 年。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 人名拼写", body: "ref. 51 “Wildom, B.” 应为 Widom, B.（Benjamin Widom，Widom 插入法的提出者）。" });
  d.block(s, { x: 0.6, y: 3.0, w: 5.9, kind: "note", tint: true, head: "③ DH 公式的适用范围", body: "Fig. 3b 中的 lg γ 式省略了价数项 |z₊z₋|，对 LiFSI 这类 1:1 盐成立；推广到多价盐时需要补上。" });
  d.block(s, { x: 6.85, y: 3.0, w: 5.9, kind: "def", tint: true, head: "核对通过：Fig. 3b 与 3c 一致", body: "由 Fig. 3b（6.5 m 处 Δγ ≈ 6.7×10⁴）按 ΔE = (RT/F) ln(γm 之比) 估算得约 0.33 V，与 Fig. 3c 实测约 0.3 V 相符（读图误差内）。" });
  s.addNotes("①的判断依据：Physikalische Zeitschrift 第 19 卷出版于 1918 年，Madelung 常数文献通常引作 Madelung, E. Phys. Z. 19, 524 (1918)。这一条我把握较大但未逐页核对原刊，列入报告“把握较低的条目”。");

  // ---------------- 22. Summary ----------------
  summarySlide(d, {
    items: [
      ["HOMO/LUMO ≠ 电位", "电位是自由能差，要计入溶剂化、重组和配对；所以用化学势"],
      ["晶体好算（Madelung 1918），液体难算", "离子和溶剂不停运动、强关联"],
      ["DH（1923）→ Pitzer（1973）→ MSA/RISM/PCM → MD", "稀溶液近似 → 拟合参数 → 平均场 → 显式分子，但单离子值仍难得"],
      ["液体 Madelung 势（2024）", "对 MD 中 Li⁺ 位置的静电势时空平均，定量复现 0.3 V 级电位移动"],
      ["局限", "有限尺寸、采样、力场参数，以及未计入的熵"],
    ],
    quote: { en: "In brief, predicting the chemical potential of a carrier ion in a liquid electrolyte is challenging because the surrounding ions and solvent molecules continuously fluctuate.", zh: "简言之，预测液态电解质中载流子的化学势很难，因为周围的离子和溶剂分子在不断涨落。" },
  });

  return finish(d, outFile, figDir);
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
