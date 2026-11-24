// 锂电池制造 第 3 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对：
//   J. Li, J. Fleetwood, W. B. Hawley, W. Kays, From Materials to Cell: State-of-the-Art and Prospective
//   Technologies for Lithium-Ion Battery Electrode Processing, Chem. Rev. 122, 903–956 (2022)
//   Y. Liu, R. Zhang, J. Wang, Y. Wang, Current and future lithium-ion battery manufacturing, iScience 24, 102332 (2021)
const LI = "Li 2022 Chem. Rev.";
const LIU = "Liu 2021 iScience";
module.exports = {
  nmpRecycle: {
    en: "Because of safety and environmental reasons, the vaporized NMP must be captured and recycled.",
    zh: "出于安全和环保的原因，蒸发出来的 NMP 必须收集并回收利用。",
    ref: `${LI}, p. 913`,
  },
  energy46: {
    en: "The drying and solvent recovery accounts for >46% energy consumption in LIB manufacturing, which can also create a substantial amount of greenhouse gases.",
    zh: "干燥和溶剂回收占锂离子电池制造能耗的 46% 以上，还会带来大量温室气体。",
    ref: `${LI}, p. 939`,
  },
  optimalPorosity: {
    en: "There is an optimal porosity where the diffusion length of lithium ions in liquid electrolyte and the electrode conductivity are balanced for a given electrode.",
    zh: "对一个给定的电极，存在一个最佳孔隙率：在这里，锂离子在电解液中的扩散路程与电极的导电性达到平衡。",
    ref: `${LI}, p. 913`,
  },
  edges: {
    en: "…edges naturally concentrate electric field strength and rough edges or remnant filaments of the current collector can initiate shorting or dendrite growth over time.",
    zh: "……边缘天然会让电场集中；粗糙的切边或残留的集流体细丝，时间一长就可能引发短路或枝晶生长。",
    ref: `${LI}, p. 915`,
  },
  thickLimit: {
    en: "…every system has a fundamental upper limit in thickness due to these mechanics.",
    zh: "……由于这些力学原因，每个体系都有一个根本性的厚度上限。",
    ref: `${LI}, p. 941`,
  },
  ultimate: {
    en: "…eliminating the toxic organic solvent can be an ultimate solution for electrode production.",
    zh: "……彻底去掉有毒的有机溶剂，可能是电极生产的终极方案。",
    ref: `${LIU}, p. 6`,
  },
  confidence: {
    en: "This acquisition proved the confidence in the solvent-free coating technologies from the industrial community.",
    zh: "这次收购证明了工业界对无溶剂涂布技术的信心。",
    ref: `${LIU}, p. 7`,
  },

  facts: {
    drying: "1929 年 Sherwood 发表经典的固体干燥研究，把干燥分成“恒速段”和“降速段”。工业干燥炉沿袭造纸、胶片涂布的传统（原文 p. 925）。2017 年 KIT 的 Jaiser 等提出电极的三段式干燥。",
    migration: "粘结剂迁移最早是造纸涂料和胶乳涂层里的老问题。2010 年代，德国 KIT 的 Jaiser、Scharfer、Schabel 等用截面分析和模型系统研究了电池电极里的迁移（原文 refs. 199–212）。",
    dryer: "原文 Fig. 10 引自 2018 年的工业干燥资料（ref. 198）：三段各 8 m，风温 90、110、140 °C，水系负极与 NMP 正极走同一台干燥炉。",
    nmp: "NMP 能溶解 PVDF，1991 年索尼量产锂离子电池以来一直是正极浆料的标准溶剂（第 2 章）。回收靠冷凝、沸石转轮和活性炭吸附——都借自化工的 VOC（挥发性有机物）治理。",
    energy: "能耗数据：2017 年 Yuan 等在 Johnson Controls 的中试线上，实测一颗 32 Ah LMO/石墨电芯的制造能耗（Liu 表 1）。干燥与溶剂回收 46.8%，干燥间 29.4%。",
    vacuum: "工厂做法：60–150 °C 真空烘 12 h 以上（Liu p. 8）。2019 年 Huttner 等发现：120 °C 长时间烘干水分最低，性能却最差；室温氩气吹扫 20 min 反而最好。",
    calender: "压延机 (calender) 来自造纸“压光”和金属轧制。1836 年美国人 Chaffee 用压延机把橡胶压成片。锂离子电池从 1991 年量产起就用对辊把电极压到目标厚度。",
    porosity: "1921 年 Washburn 推出毛细渗入方程；1945 年 Ritter 与 Drake 据此做出压汞孔隙率仪 (mercury porosimetry)。电池界更常用的是下面这个“称重 + 测厚”的简便算法。",
    tortuosity: "1935 年 Bruggeman 提出多孔介质的有效介质公式，由此得到 τ ≈ ε^−0.5；1937 年 Carman 用“曲折度”描述流体在颗粒床里绕路。1993 年 Doyle、Fuller、Newman 的电池模型仍沿用这一关系。",
    damage: "2019 年 Park 等用两步辊压把石墨负极 25 次循环后的膨胀率从 5% 降到 4.47%；同年 Meyer 等证明热辊能提高附着力；Sangrós Giménez 等的 DEM 模拟显示卸压后回弹可达 17%（Liu p. 7）。",
    slitting: "分切来自造纸和薄膜加工的圆刀分条；模切来自冲压。1960 年代激光开始用于工业切割。Liu 引 Demir 2014：红外光纤激光 54 W 即可 30 m/min 切正负极。",
    thick: "原文 p. 921：约 20 年前，100 g/m²（10 mg/cm²）就算常规负载。2013 年 MIT Chiang 组用定向孔降低曲折度；2015 年 Singh 等算出电极从 70 μm 加厚到 320 μm，体积能量密度 337 → 412 Wh/L（Liu p. 7）。",
    ptfe: "1938 年 DuPont 的 Plunkett 意外发现 PTFE（Teflon）。1969 年 Gore 发现快速拉伸 PTFE 会形成微纤维网络（Gore-Tex）。1976 年 Whittingham 的 TiS₂ 电极就用 10% Teflon 粘结（发展史系列第 2 章）。",
    maxwell: "2000 年代 Maxwell Technologies（美国圣迭戈）用干法 PTFE 工艺量产超级电容电极。2019 年 Tesla 收购 Maxwell（Li p. 940；Liu p. 7）；2020 年 9 月 Tesla “电池日”把干法电极列为 4680 电池的降本手段。",
    esd: "静电粉末喷涂 1960 年代起用于金属涂装。2016 年起 WPI 的 Ludwig、Wang 等把它用于电池电极；ORNL 的 Du、Wood 等 2017–2020 年研究电子束 (EB) 固化电极（原文 refs. 416–424）。",
    emerging: "红外干燥早已用于涂装、印刷，近年进入电池厂（原文 p. 942）；Pfleging 2018 年用激光辅助干燥。多层涂布源于胶片工业的高精度多层涂布，早期电池厂为求简单放弃了它（原文 p. 942）。",
  },

  corrections: [
    { head: "Li p. 939：脉冲激光沉积 (PLD) 写反了", body: "原文：“a laser containing the electrode components is focused on the current collector”。激光本身不“含”材料。正确：激光打在由电极材料做成的靶上，烧蚀出的等离子体羽辉沉积到基底（集流体）上。" },
    { head: "Li p. 940 与表 9（p. 941）：ESD 线速度不一致", body: "正文说静电喷涂最高约 0.4 m/min（ref. 416），表 9 写 1.2 m/min（ref. 423）。两者出处不同；无论哪个，都比湿法的 10–30 m/min 慢一个数量级以上。" },
    { head: "“三段干燥”两篇说的不是一回事", body: "Li p. 912–913 的三段是干燥的物理阶段（快速段、恒速段、低速段），并建议温度由低到高。Liu p. 7 引 Jaiser 2017 的“三段”是工艺设定：快 – 慢 – 快，慢段专门压住粘结剂迁移。经典干燥理论只分“恒速段”和“降速段”。" },
    { head: "Liu 成本数据前后不一致", body: "表 1（p. 3）化成/老化占 32.61%（30 482 750 ÷ 93 474 750 美元，可复算），结论（p. 11）写成 32.16%，应为 32.61%。另：NMP 沸点 Li 写 204.3 °C，Liu 写 202 °C，手册多取约 202 °C，差别不影响结论。" },
    { head: "常见误区：实验室电极“不压也行”", body: "Li p. 939 把未辊压电极列为“不真实的测试条件”之一。p. 940 的 ESD 对比也承认：对照组没辊压（孔隙率 50%），优势可能部分来自这里。发表数据时要写明孔隙率或压实密度。" },
    { head: "Li p. 914：“高于粘结剂 Tg”对 PVDF 不成立", body: "原文说辊压通常在高于粘结剂玻璃化温度 (Tg) 的温度下进行。但 PVDF 的 Tg 约 −35 °C，室温早已高于它。热辊的作用是让半结晶的 PVDF 变软、模量下降（Liu p. 7），而不是“越过 Tg”。" },
  ],
};
