// 锂电池制造 第 4 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对：
//   A. Kayyar et al., Construction and Testing of Coin Cells of Lithium Ion Batteries, J. Vis. Exp. (66), e4104 (2012)
//   M. Stein IV et al., Non-aqueous Electrode Processing and Construction of Lithium-ion Coin Cells, J. Vis. Exp. (108), e53490 (2016)
//   P.-M. Luc, S. Bauer, J. Kowal, Reproducible Production of Lithium-Ion Coin Cells, Energies 15, 7949 (2022)
module.exports = {
  coinWidely: {
    en: "Coin cells are widely used in research laboratories to test new battery materials; even for the research and development that target large-scale and high-power applications, small coin cells are often used to test the capacities and rate capabilities of new materials in the initial stage.",
    zh: "扣式电池在研究实验室里被广泛用来测试新电池材料；即使目标是大型、高功率应用，研发初期也常先用小小的扣式电池测新材料的容量和倍率性能。",
    ref: "Kayyar 2012, p. 1 摘要",
  },
  glovebox3x: {
    en: "As a general rule, a task within the glovebox should take 3 times longer than the speed at which the task would be performed outside.",
    zh: "一条经验法则：同一件事，在手套箱里做应当花在箱外 3 倍的时间。",
    ref: "Stein 2016, p. 3",
  },
  burr: {
    en: "To ensure that the burr of an electrode does not pierce the separator … the punching burr must be either reduced, reworked or aligned outwards…",
    zh: "为保证电极的毛刺不刺穿隔膜……冲片毛刺必须减小、修整，或者朝外放置……",
    ref: "Luc 2022, p. 7",
  },
  alignment: {
    en: "When constructing the coin cell, care must be taken to ensure that the anode and cathode are carefully aligned within the cell. Here, a slightly larger diameter anode is utilized to allow for a margin of error in placement.",
    zh: "组装扣式电池时，必须小心让负极和正极在电池内对齐。这里用了直径稍大的负极，给摆放留出误差余量。",
    ref: "Stein 2016, p. 9",
  },
  crimp: {
    en: "It is critical that the cell is crimped well since both the lithium electrode and the electrolyte are sensitive to moisture.",
    zh: "电池一定要封好，因为锂电极和电解液都怕水汽。",
    ref: "Kayyar 2012, p. 5",
  },
  practice: {
    en: "…it is highly recommended that each assembler gains experience by assembling multiple cells (e.g., ~50 coin cells) before main experiments…",
    zh: "……强烈建议每位组装者在正式实验前先装许多颗电池（例如约 50 颗）来积累经验……",
    ref: "Luc 2022, p. 7",
  },
  qualitative: {
    en: "Until then, the results from coin cell experiments, as set up in this study, are only qualitative.",
    zh: "在此之前，按本研究方式搭建的扣式电池实验结果，只能算定性的。",
    ref: "Luc 2022, p. 15",
  },

  facts: {
    coin: "1940 年代 Samuel Ruben 与 P. R. Mallory 公司开发汞电池；1950 年代起做成纽扣形，用于助听器、手表。1970 年代锂一次电池出现硬币形，其中 Sanyo 的 Li/MnO₂ 属 “CR” 系列。",
    parts: "Kayyar 2012（Fig. 2）与 Stein 2016（Fig. 2）给出从壳到盖的摆放顺序，壳、垫片、弹片都买自 MTI 等供应商。Luc 2022 补充：壳、垫片、弹片用 316 或 304 不锈钢。",
    glovebox: "1940 年代：美国核计划为处理放射性物质发展了密封手套箱。1960 年代起：出现充惰性气体、循环净化的手套箱：铜催化剂吸 O₂，分子筛吸 H₂O。锂电池实验室沿用至今。",
    ppm: "Kayyar 2012：过渡舱抽气–充氩“冲洗” 5 次。Stein 2016：箱内 O₂、H₂O 都低于 0.5 ppm，进箱物品先 120 °C 真空烘一夜。Luc 2022：建议都低于 5 ppm。",
    punch: "冲裁 (blanking) 是金属冲压的老工艺，剪切必然留下毛刺 (burr)。Stein 2016 用 ½ 英寸空心冲手工冲片。Luc 2022 用激光显微镜比较空心冲和精密切片机 EL-Cut 的切边。",
    dry: "Kayyar 2012：涂布后 90–120 °C 干燥 2–8 h，按 W_AM = (W_ED − W_CC) × 0.8 算活性物质。Stein 2016：冲片后 120 °C 真空再烘 12 h，用 0.1 mg 天平称重。",
    separator: "1970 年代：Celanese 公司用干法拉伸做出微孔聚丙烯膜 Celgard。1990 年代：出现 PP/PE/PP 三层膜，PE 在约 130 °C 熔化堵孔（“热关断”）。实验室还常用约 260 µm 厚的玻璃纤维滤纸。",
    electrolyte: "1990 年代初，Bellcore 的 Tarascon 与 Guyomard 研究 LiPF₆ 溶于 EC/DMC 的配方，耐氧化到约 5 V。1 M LiPF₆ + EC/DMC 由此成为实验室最常用的电解液之一（Kayyar、Luc 都用这一类）。",
    assembly: "Kayyar 2012 从正极壳往上放，用两层隔膜、两片垫片；Stein 2016 也从正极壳开始，锂片先粘在垫片上；Luc 2022 从负极壳（−）开始。",
    crimp: "纽扣电池自汞电池时代起就用“金属壳 + 塑料密封圈 + 边缘压紧”的方式密封。今天实验室多用液压封口机：Stein 2016 约 6.2 MPa（900 psi），Luc 2022 950 psi，Kayyar 2012 压 3–4 次。",
    half: "用锂片作对电极，沿袭 1970 年代锂金属电池的研究。1991 年 Sony 的商品电池是全电池（LiCoO₂ 对碳）。Kayyar、Stein 用半电池，Luc 用 NMC/石墨全电池。",
    crate: "倍率记法来自铅酸电池行业：铅酸电池常按 20 小时率标容量（C₂₀），“C/20”就是 20 小时放完的电流。锂电池沿用了这套写法。",
    formation: "1979 年 Peled 提出固体电解质界面膜 (SEI) 模型：电极表面先长出一层导离子、不导电子的膜。首圈“消失”的容量大多花在成膜和副反应上。工厂把首次慢充叫化成 (formation)（第 6 章）。",
    rate: "Stein 2016：C/10 跑 4 圈 → C/5 到 10C 各 5 圈 → 1C 循环 100 圈。Luc 2022：静置 12 h → C/10 恒流恒压化成 → C/2 循环 30 圈。",
  },

  corrections: [
    { head: "Luc p. 2：“N/P 比”其实是面积比", body: "原文把负极与正极的面积比叫 N/P ratio（DoE 取 1.0 与 1.3 = (16/14)²）。N/P 通常指单位面积的负极容量 ÷ 正极容量。面积比原文 p. 6 另称 ACR。" },
    { head: "Kayyar p. 2：符号与“理论容量”", body: "先定义 W_EO，公式却写 W_ED。按“理论比容量”定电流也不妥：LiCoO₂ 理论约 274 mAh/g，实际只用约 150，1C 电流会大约 1.8 倍。应用实用（额定）比容量。" },
    { head: "Stein p. 2、p. 6：名称与基准", body: "p. 2 把 LiNi₁/₃Mn₁/₃Co₁/₃O₂ 叫 lithium-manganese-cobalt-oxide，漏了镍。p. 4 按 155 mAh/g 定电流，Fig. 6 图注却写约 150 mAh/g：C 倍率基准前后不一。" },
    { head: "Stein p. 1：纽扣电池的年代", body: "原文说扣式电池“1970 年代最初用于助听器”，引的是 1972 年专利。实际上汞纽扣电池 1950 年代已用于助听器和手表；1970 年代新出现的是锂硬币电池。" },
    { head: "常见说法：电解液“怕光”", body: "Kayyar、Stein 都说电解液 photosensitive，要避光。避光无害，但 LiPF₆ 电解液的头号敌人是水和热：遇水分解生成 HF。关键是密封、放在箱里、开封后尽快用完。" },
    { head: "常见说法：CR2032 是一种电池", body: "CR2032 是商品 Li/MnO₂ 硬币电池的型号，C 指化学体系。实验室买的是空壳，只借用 20 mm × 3.2 mm 的尺寸，所以 Luc 写成 R2032 更准确。" },
  ],
};
