// Ko et al. 2026 — Chapter 1: 引言：电解质不只是传导离子
const path = require("path");
const { HEX } = require("../decklib");
const { PAPER, NB, makeDeck, R, eqBox, titleSlide, stepCards, sectionSlide, summarySlide, CH, finish } = require("./common");

async function build(outFile, figDir) {
  const d = await makeDeck(1, "引言：电解质不只是传导离子", path.join(__dirname, "ch1_figs.js"), figDir);
  const C = d.C;
  let s;

  // ---------------- 1. Title ----------------
  titleSlide(d, {
    title: "第 1 章\n电解质只是离子的“公路”吗？",
    sub: "引言：未来电池的瓶颈，以及本综述的能量学视角",
    fig: "title_motif",
    notes: "本章对应原文摘要和引言（第 1–2 页，含 Fig. 1）。核心问题：为什么锂金属、硅负极和高电位正极迟迟用不起来？作者的回答是：问题多半出在电解质，而且不能只靠“试配方”解决，要从载流子（Li⁺）的化学势这一能量学视角去理解。",
  });

  // ---------------- 2. Roadmap + reading key ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  stepCards(d, s, [
    ["1", "电解质在电池里做什么", "结构、组成、简史"],
    ["2", "未来电池卡在哪里", "高容量负极 + 高电位正极的寄生反应"],
    ["3", "本综述换了什么视角", "从经验筛选到“载流子化学势”"],
    ["4", "全文地图", "9 个小节 → 本套 5 章"],
  ]);
  s.addText("每个概念页的阅读标签", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  [
    ["hist", "历史 History", "哪一年、谁、做了什么"],
    ["why", "以前 → 为什么", "之前怎么做，为什么改成现在这样"],
    ["matters", "为什么重要", "这个概念在后面会派上什么用场"],
    ["quote", "原文金句", "原文的精彩句子，附中文翻译"],
  ].forEach(([k, h, b], i) => {
    const y = 2.1 + i * 1.12;
    d.chip(s, 7.5, y + 0.05, k, 0.62);
    s.addText(h, { x: 8.35, y, w: 4.4, h: 0.4, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 8.35, y: y + 0.4, w: 4.4, h: 0.38, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addNotes("阅读标签与本系列其他论文相同：史 = 历史，变 = 以前怎么做、为什么改，要 = 为什么重要，引 = 原文金句。另有“义”（定义）和“注”（校注，记录原文笔误）。这篇综述公式较多，每个公式都会解释符号、交代来历。");

  // ---------------- 3. About the paper ----------------
  s = d.slide("CONTENT");
  s.addText("这篇综述：谁写的，讲什么", { placeholder: "title" });
  d.stat(s, { x: 0.6, y: 1.3, w: 2.8, value: "4", unit: "位作者", label: "东京大学 + 马里兰大学", color: "accent3" });
  d.stat(s, { x: 3.5, y: 1.3, w: 2.8, value: "6 + 2", unit: "", label: "6 幅图，2 个编号公式", color: "accent2" });
  d.stat(s, { x: 6.4, y: 1.3, w: 2.8, value: "224", unit: "篇", label: "参考文献", color: "accent1" });
  d.stat(s, { x: 9.5, y: 1.3, w: 3.2, value: "9", unit: "个小节", label: "引言 → 结论", color: "accent6" });
  d.column(s, 0.6, 3.05, 6.0, [
    { kind: "def", head: "作者背景", body: "山田淳夫（Atsuo Yamada，东京大学）组以超浓电解液、水合物熔盐电解液著称；王春生（Chunsheng Wang，马里兰大学）组以 water-in-salt 水系电解液和富氟界面著称。一作 Ko 与 Zhang 近年专门研究“电解液改变电极电位”。" },
    { kind: "matters", body: "这不是“材料大全”式综述，而是一篇观点型综述：用一个热力学量——载流子的化学势——把电位、界面、传输和安全串成一条线。" },
  ]);
  d.quote(s, { x: 6.85, y: 3.05, w: 5.9, bottom: 6.85, en: "Electrolytes do more than transport ions; they reshape the energetic landscape of battery systems.", zh: "电解质不只是传输离子；它们重塑了电池体系的能量格局。" });
  d.block(s, { x: 6.85, y: 4.75, w: 5.9, kind: "why", tint: true, body: "以前的电解液综述多按“盐、溶剂、添加剂”分类罗列。本文按“能量学”组织：先讲电位为何移动，再讲界面、传输与安全。" });
  s.addNotes("通讯作者是王春生和山田淳夫。文末“Published online: xx xx xxxx”说明我们读到的是正式出版前的排版稿。全文 15 页，参考文献 224 篇，其中不少是作者组自己的工作（如 ref. 20、54、224）。");

  // ---------------- 4. Section ----------------
  sectionSlide(d, "1 电解质做什么", "电解质在电池里做什么", "它是 Li⁺ 的通道，也是电极表面反应的“介质”和“原料”");

  // ---------------- 5. Cell & electrolyte role ----------------
  s = d.slide("CONTENT");
  s.addText("电池的“舞台”：电解质夹在两极之间", { placeholder: "title" });
  d.fig(s, "cell_role", { x: 0.45, y: 1.25, w: 7.1, h: 4.9 });
  d.column(s, 7.8, 1.35, 4.95, [
    { kind: "hist", body: "1834 年，Faraday（在 Whewell 的帮助下）创造了 electrolyte、electrode、anode、cathode、ion 这些术语，沿用至今。" },
    { kind: "why", body: "以前把电解质看成“被动的导线”，只要求导 Li⁺、不导电子。本文强调：电解质还决定 Li⁺ 的能量状态，并在两极表面分解出 SEI 和 CEI。" },
    { kind: "matters", body: "电池的能效、快充、寿命和安全，都要经过电解质这一关（原文第 2 页）。" },
  ]);
  d.caption(s, "SEI：负极表面的固体电解质界面相；CEI：正极表面的界面相（第 4 章详讲）", { x: 0.6, y: 6.25, w: 6.9, h: 0.5 }, { size: 12 });
  s.addNotes("放电时 Li⁺ 从负极穿过电解质到正极，电子走外电路。Li⁺ 在液体里并不是“裸奔”，而是被溶剂分子和阴离子包着（溶剂化）。包得紧不紧，决定了它的能量，这就是第 2 章的主角。");

  // ---------------- 6. Electrolyte anatomy ----------------
  s = d.slide("CONTENT");
  s.addText("液态电解液里有什么", { placeholder: "title" });
  d.fig(s, "electrolyte_anatomy", { x: 0.45, y: 1.25, w: 7.1, h: 4.95 });
  d.column(s, 7.8, 1.35, 4.95, [
    { kind: "hist", body: "1990 年代起，LiPF₆ 溶于 EC 与线性碳酸酯成为商用标准。1980–90 年代 Armand 等发展了 TFSI 等酰亚胺阴离子，FSI 类盐后来在高浓电解液中大量使用。" },
    { kind: "why", body: "选 EC：介电常数高，能把盐拆开，并在石墨上成膜。加线性碳酸酯：降低黏度。今天又加入氟化醚“稀释剂”，专门用来调节 Li⁺ 周围的结构。" },
    { kind: "matters", body: "后面各章的主角（PF₆⁻、FSI⁻、EC、醚、氟化稀释剂）都在这张图里，先认个脸。" },
  ]);
  s.addNotes("EC = 碳酸乙烯酯，DMC = 碳酸二甲酯，EMC = 碳酸甲乙酯，DME = 乙二醇二甲醚，BTFE = 双(2,2,2-三氟乙基)醚，FEC = 氟代碳酸乙烯酯，VC = 碳酸亚乙烯酯，TMP = 磷酸三甲酯。“M”表示 mol L⁻¹；后文的“m”表示 mol kg⁻¹（质量摩尔浓度）。");

  // ---------------- 7. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：锂电池电解液七十年", { placeholder: "title" });
  d.fig(s, "electrolyte_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.block(s, { x: 0.6, y: 5.35, w: 6.0, kind: "why", tint: true, body: "前四十年的主线是“找到能在石墨上成膜的配方”。2010 年代后，主线变成“调 Li⁺ 周围的溶剂化结构”。" });
  d.block(s, { x: 6.85, y: 5.35, w: 5.9, kind: "matters", tint: true, body: "本综述的作者正是后一条主线的推动者之一：高浓电解液 → 电位上移 → 液体 Madelung 势（第 2、3 章）。" });
  s.addNotes("时间轴不按比例。Harris（1958，Berkeley 博士论文）发现锂可以在碳酸丙烯酯 PC 中沉积，被视为有机电解液锂电池的起点。灰色：基础认识；橙色：商业化配方；紫色：浓电解液路线；青色：本综述的核心发现。");

  // ---------------- 8. Section ----------------
  sectionSlide(d, "2 未来电池卡在哪", "未来电池卡在哪里", "高容量负极 + 无钴高电位正极：容量和电压都上去了，电解质却扛不住");

  // ---------------- 9. From today's Li-ion to future chemistries ----------------
  s = d.slide("CONTENT");
  s.addText("从今天的锂电到“未来电池”", { placeholder: "title" });
  d.fig(s, "pot_ladder", { x: 0.4, y: 1.2, w: 6.3, h: 5.25 });
  s.addChart(d.pres.charts.BAR, [{ name: "理论比容量", labels: ["石墨", "硅 Si", "锂 Li"], values: [372, 3579, 3860] }], {
    x: 6.9, y: 1.25, w: 5.9, h: 2.45, barDir: "bar",
    chartColors: [HEX.dk1, HEX.accent6, HEX.accent3],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 4700,
    showTitle: true, title: "负极理论比容量（mAh g⁻¹）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", showLegend: false,
  });
  d.column(s, 6.9, 3.85, 5.85, [
    { kind: "hist", body: "1980 年 Goodenough 提出 LiCoO₂；1990 年代后期报道了约 4.7 V 的 LiNi₀.₅Mn₁.₅O₄；2001 年 Ohzuku 等报道 LiNi₁/₃Mn₁/₃Co₁/₃O₂，此后向高镍、无钴发展。" },
    { kind: "matters", body: "Li、Si 容量约是石墨的 10 倍，但电位都低于电解液的还原极限；高电位正极又高于氧化极限。两头都要靠界面相“兜底”。" },
  ], 0.18);
  d.caption(s, "左图电位为常见近似值；电解液稳定区随配方而变，第 4 章会说明它其实无法严格定义。", { x: 0.6, y: 6.5, w: 6.1, h: 0.4 });
  s.addNotes("原文举的未来体系：负极 Li 金属、Si；正极 LixMnyNizO2（无钴层状）和 LiNi0.5Mn1.5O4（高电位尖晶石）。无钴是为了可持续：钴贵、供应集中。比容量：石墨 LiC6 372、Si（Li15Si4）3579、Li 3860 mAh g⁻¹。");

  // ---------------- 10. Fig. 1 overview ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 1：电解质引发的退化全景", { placeholder: "title" });
  d.fig(s, "fig1_overview", { x: 0.5, y: 1.2, w: 12.3, h: 4.48 });
  d.caption(s, "据原文 Fig. 1 重绘（左：Li 金属负极；右：带导电碳的高电位正极）", { x: 0.6, y: 5.6, w: 8, h: 0.3 });
  d.quote(s, { y: 5.95, en: "These limitations largely originate from the electrolyte, which serves as the medium for charge-carrier transport and mediates interfacial electrochemical reactions", zh: "这些限制很大程度上源自电解质：它既是载流子传输的介质，又介导界面上的电化学反应。" });
  s.addNotes("这张图把后面所有章节的问题都摆了出来：负极侧有枝晶、死锂、产气产酸、高阻界面、电解液还原和 Li 腐蚀；正极侧有过渡金属溶出、Al 集流体腐蚀、阴离子嵌入导电碳、催化加速的电解液氧化；两极之间还有“串扰”。");

  // ---------------- 11. Anode side ----------------
  s = d.slide("CONTENT");
  s.addText("负极侧：电位太低，电解液被“喂”电子", { placeholder: "title" });
  d.fig(s, "anode_zoom", { x: 0.45, y: 1.25, w: 6.9, h: 4.5 });
  d.column(s, 7.6, 1.35, 5.15, [
    { kind: "hist", body: "1970 年代 Dey 等在锂表面检测到 Li₂CO₃ 等分解产物；1979 年 Peled 把这层膜命名为 SEI（第 4 章）。" },
    { kind: "why", body: "石墨负极体积只变约 10%，SEI 形成一次就基本稳定。Li 和 Si 体积变化大，SEI 反复破裂、反复长，问题就放大了。" },
    { kind: "matters", body: "这些副反应持续消耗 Li 和电解液，表现为容量衰减；枝晶和产气还直接威胁安全。" },
  ]);
  d.caption(s, "电位越低，电极中电子的能量越高，越容易把电子交给电解液", { x: 0.6, y: 5.85, w: 6.8, h: 0.4 }, { size: 12 });
  s.addNotes("一个常用的直观理解：电极电位越负，电极里电子的能量越高，越容易“跳”到电解液分子上，把它还原。所以 Li 金属（0 V vs Li⁺/Li）是最“凶”的负极。第 2 章会看到：换电解液可以把这个“0 V”本身往上挪。");

  // ---------------- 12. Cathode side & crosstalk ----------------
  s = d.slide("CONTENT");
  s.addText("正极侧与串扰：电位太高，电解液被“抢”电子", { placeholder: "title" });
  d.fig(s, "cathode_zoom", { x: 0.45, y: 1.25, w: 6.9, h: 4.5 });
  d.column(s, 7.6, 1.35, 5.15, [
    { kind: "hist", body: "1990 年代人们已发现 LiMn₂O₄ 中 Mn 会溶出并沉积到负极，以及 LiTFSI 电解液会腐蚀 Al 集流体。" },
    { kind: "why", body: "以前只盯着“氧化电位够不够高”。现在知道：过渡金属会催化氧化，阴离子还会嵌进导电碳，单看一个电位数字远远不够。" },
    { kind: "matters", body: "正极产生的气体、酸和金属离子会跑到负极（串扰），所以两极的问题必须一起考虑。" },
  ]);
  d.caption(s, "LiPF₆ 遇水：LiPF₆ → LiF + PF₅，PF₅ + H₂O → POF₃ + 2HF（酸的来源之一）", { x: 0.6, y: 5.85, w: 6.8, h: 0.4 }, { size: 12 });
  s.addNotes("“串扰”（crosstalk）在原文 Fig. 1 中有两条：过渡金属溶出后迁移到负极，以及产气产酸在两极之间往返。HF 会侵蚀正极表面、加速金属溶出，溶出的金属又会破坏负极的 SEI，形成恶性循环。");

  // ---------------- 13. Section ----------------
  sectionSlide(d, "3 本综述的视角", "本综述换了什么视角", "从“试配方”到“算能量”：载流子化学势、电位、界面、传输、安全一起考虑");

  // ---------------- 14. Empirical vs framework ----------------
  s = d.slide("CONTENT");
  s.addText("以前：经验筛选；现在：能量学框架", { placeholder: "title" });
  d.fig(s, "empirical_vs_framework", { x: 0.5, y: 1.15, w: 12.3, h: 4.17 });
  d.block(s, { x: 0.6, y: 5.3, w: 4.0, kind: "hist", size: 13, body: "1990 年代的 EC/DMC 等经典配方，很大程度上是“试”出来的，而且非常成功。" });
  d.quote(s, { x: 4.85, y: 5.3, w: 7.9, en: "Despite this pivotal role, electrolyte development has predominantly relied on empirical screening and incremental formulation optimization", zh: "尽管电解质如此关键，其研发主要依赖经验筛选和逐步的配方优化。" });
  s.addNotes("原文批评的是“窄目标”：只追求拓宽电位窗口、只调界面成分、只改善某个工况下的性能。作者主张以对电解质和全电池能量学（full-cell energetics）的系统理解为指导。左图的单一指标循环往往顾此失彼。");

  // ---------------- 15. Core concept preview ----------------
  s = d.slide("CONTENT");
  s.addText("核心视角：Li⁺ 的化学势 μ", { placeholder: "title" });
  d.fig(s, "mu_chain", { x: 0.45, y: 1.2, w: 7.1, h: 4.77 });
  d.column(s, 7.8, 1.35, 4.95, [
    { kind: "hist", body: "1875–1878 年，Gibbs 在《论非均相物质的平衡》中提出化学势；1889 年 Nernst 把电极电位与浓度联系起来（第 2 章）。" },
    { kind: "why", body: "以前常用“HOMO/LUMO 电位窗口”判断电解液稳不稳。本文改用 Li⁺ 的化学势：它直接决定两极的反应电位，可以测量也可以计算。" },
    { kind: "matters", body: "这个视角贯穿全文：第 2 章测电位移动，第 3 章算它，第 4、5 章看它怎样影响界面。" },
  ]);
  d.caption(s, "示意图：同一个 Li⁺，被包得越“不舒服”，化学势越高，Li⁺/Li 电位越高", { x: 0.6, y: 6.05, w: 6.9, h: 0.4 }, { size: 12 });
  s.addNotes("原文的表述：本综述“examines a thermodynamic concept that has recently gained renewed attention”，即电解质依赖的载流子化学势调控，以及由此导致的全电池电位图的重新定义。HOMO/LUMO 窗口的问题放在第 3 章讲。");

  // ---------------- 16. Four tasks ----------------
  s = d.slide("CONTENT");
  s.addText("电解质要同时完成的四件事", { placeholder: "title" });
  d.fig(s, "four_tasks", { x: 0.45, y: 1.2, w: 6.6, h: 4.66 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "早期配方只要“导得动、不分解”。2010 年代起，高浓、局部高浓、弱溶剂化电解液把界面稳定性做上去了，却常牺牲电导率（第 5 章）。" },
    { kind: "why", body: "单独优化一个指标，往往伤到另一个：抑制寄生反应的结构，恰恰会拖慢体相离子传输。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.7, w: 5.4, en: "underscoring the necessity of electrolyte design grounded in a multifunctional perspective while avoiding isolated optimization of individual properties", zh: "这凸显出：电解质设计必须立足多功能视角，避免孤立地优化单项性质。" });
  s.addNotes("摘要列出的四项要求：化学与电化学稳定性、稳健的界面相形成与耐久性、快速离子传输、运行安全。这四项会在第 2–5 章逐一展开，并且反复出现“此消彼长”（trade-off）。");

  // ---------------- 17. Safety first ----------------
  s = d.slide("CONTENT");
  s.addText("安全优先：不只是“不燃”", { placeholder: "title" });
  d.fig(s, "safety_timeline", { x: 0.45, y: 1.25, w: 7.0, h: 3.6 });
  d.block(s, { x: 0.6, y: 5.0, w: 6.85, kind: "hist", tint: true, body: "1989 年前后 Moli Energy 锂金属电池因起火召回；之后笔记本、飞机、手机电池事故不断，每一次都推动了对电解液安全的重视。" });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "why", body: "以前把安全等同于“电解液不燃”。本文把范围扩大：界面相分解、化学反应活性、反应性气体和酸的生成及其跨电极迁移，都算安全问题。" },
    { kind: "matters", body: "电池越大、能量越高，失控后果越严重。第 5 章讲热失控的连锁反应和新的小电池安全评价方法。" },
  ]);
  d.quote(s, { x: 7.75, y: 4.75, w: 5.0, en: "Battery safety, which must take precedence over any performance metric, is also considered", zh: "电池安全必须优先于任何性能指标，本文也将其纳入讨论。" });
  s.addNotes("时间轴为示意，只选了几起广为人知的事故。原文强调：安全问题在液态、凝胶、混合和固态电解质中都存在，固态电解质并不自动等于安全（第 5 章）。");

  // ---------------- 18. Chapter map ----------------
  d.section("4 本综述地图");
  s = d.slide("CONTENT");
  s.addText("本综述地图：原文小节 → 本套幻灯片", { placeholder: "title" });
  d.fig(s, "chapter_map", { x: 0.5, y: 1.2, w: 12.3, h: 4.69 });
  d.quote(s, { y: 6.0, en: "By integrating thermodynamic, kinetic and safety considerations into a unified framework, this Review outlines priorities for rational electrolyte design", zh: "通过把热力学、动力学和安全考量整合进统一框架，本综述勾勒出理性电解质设计的优先方向。" });
  s.addNotes("第 2、3 章偏热力学（电位与化学势），第 4 章是界面相的历史与动力学，第 5 章是设计策略、离子传输、安全和结论。原文第 12–15 页是参考文献。");

  // ---------------- 19. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：版本与参考文献的小问题", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① 版本：正式出版前的排版稿", body: "第 11 页写“Published online: xx xx xxxx”，日期是占位符。说明这是校样版本，页码、卷号以正式版为准。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 参考文献中的拼写错误", body: "ref. 18 “Trasa’tti” 应为 Trasatti；\nref. 21 “IUPC commission” 应为 IUPAC；\nref. 51 “Wildom, B.” 应为 Widom, B.（Widom 插入法的提出者）。" });
  d.block(s, { x: 0.6, y: 3.2, w: 12.15, kind: "def", tint: true, head: "读这篇综述时注意", body: "原文的“电位”多数用 V vs Fc⁺/Fc（二茂铁内标）表示，而电池界常用 V vs Li⁺/Li。两种标尺的差别正是第 2 章的主题：Li⁺/Li 本身会随电解液移动，所以不能当作“固定的零点”。" });
  s.addNotes("这些都是排版或拼写层面的问题，不影响论证。各章涉及的内容性校注（年份、引用对应关系等）放在各章自己的校注页。");

  // ---------------- 20. Summary ----------------
  summarySlide(d, {
    items: [
      ["电解质 = Li⁺ 的通道 + 界面反应的介质", "它决定能效、快充、寿命和安全"],
      ["未来电池 = 高容量负极（Li、Si）+ 无钴高电位正极", "两极都落在电解液稳定区之外，寄生反应和串扰严重"],
      ["本文视角：载流子化学势 μ_{Li⁺}", "μ_{Li⁺} 改变 → 两极反应电位一起移动 → 分解驱动力和界面相随之改变"],
      ["多目标 + 安全优先", "稳定性、界面相、离子传输、安全要一起优化，不能只盯一项"],
    ],
    quote: { en: "Electrochemical energy storage is no longer merely a supporting technology.", zh: "电化学储能已不再只是一项配套技术。" },
  });

  return finish(d, outFile, figDir);
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
