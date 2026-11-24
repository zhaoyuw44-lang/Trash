// 锂电池制造 第 1 章：引文、史实与校注。
// 引文均已对照 PDF 原页逐字核对（上标文献号已省去）：
//   Kwade et al., Nature Energy 3, 290–300 (2018)        2018_NatureEnergy_Kwade_...pdf
//   Liu, Zhang, Wang & Wang, iScience 24, 102332 (2021)  2021_iScience_Liu_...pdf
//   Xiao et al., Nature Energy 8, 329–339 (2023)          2023_NatureEnergy_Xiao_...pdf
module.exports = {
  liuNotKnow: {
    en: "Many battery researchers may not know exactly how LIBs are being manufactured and how different steps impact the cost, energy consumption, and throughput, which prevents innovations in battery manufacturing.",
    zh: "很多电池研究者并不确切知道锂离子电池是怎么造的，也不清楚各步骤怎样影响成本、能耗和产能，这妨碍了制造创新。",
    ref: "Liu 2021, p. 1",
  },
  kwade1990s: {
    en: "Originating in the 1990s, high-throughput production processes for small LIBs (typical for consumer electronics) have become well established and process know-how has now been transferred to the production of larger cells (>20 Ah) for EV applications.",
    zh: "小型锂离子电池（消费电子常用）的高产能工艺起源于 1990 年代，如今已很成熟；这些工艺经验已经转移到电动车用的大电芯（>20 Ah）上。",
    ref: "Kwade 2018, pp. 290–291",
  },
  kwadeFormation: {
    en: "Formatting and aging can represent up to 30% of investment costs, so reducing the time taken leads to significant cost savings.",
    zh: "化成和老化最多可占投资成本的 30%，所以缩短它们的时间能省下一大笔钱。",
    ref: "Kwade 2018, p. 294",
  },
  kwadeYield: {
    en: "For example, a process chain with 25 steps, each having a yield of 99.5%, would result in an overall yield of only 88.2%.",
    zh: "例如，一条 25 步的工艺链，每步良率 99.5%，总良率只剩 88.2%。",
    ref: "Kwade 2018, p. 297",
  },
  xiaoDoctorBlade: {
    en: "…the doctor-blade coating method with very diluted slurry, resulting in electrodes with low mass loadings (for example, 1–10 mg cm⁻²), which, however, will not be practically usable or uncover real challenges in cathode processing.",
    zh: "……用刮刀涂很稀的浆料，得到面载量很低的电极（如 1–10 mg/cm²）；这种电极既不实用，也暴露不出正极加工中真正的难题。",
    ref: "Xiao 2023, p. 331",
  },
  xiaoInsurmountable: {
    en: "It is not uncommon that practical considerations prove insurmountable after scientists make promising discoveries in the laboratory.",
    zh: "科学家在实验室里做出很有前景的发现后，才发现实际问题根本跨不过去——这种情况并不少见。",
    ref: "Xiao 2023, p. 329",
  },
  kwadeThreeScales: {
    en: "To cope with the complexity, research must be conducted at lab scale to screen new chemical recipes, at pilot scale to develop more productive manufacturing processes and at industrial scale to establish the processes that are sufficiently robust.",
    zh: "要应对这种复杂性，研究必须分三个尺度做：实验室筛选新配方，中试线开发更高效的工艺，工业规模建立足够稳健的工艺。",
    ref: "Kwade 2018, p. 298",
  },

  facts: {
    sony1991: "1991 年 Sony 的第一代锂离子电池已经是这个结构：LiCoO₂ 涂在铝箔上，碳涂在铜箔上，中间夹多孔隔膜，卷起来装进金属圆柱壳。30 多年来材料一直在换，结构基本没变。",
    chain: "1990 年代为手机、笔记本小电池建立的高产能工艺，后来被直接搬到电动车大电芯上（Kwade 2018）。所以圆柱、软包、方形电芯的工序几乎一样（Liu 2021）。",
    coating: "精密涂布来自照相胶片和磁带工业：1950 年代，胶片厂发展出狭缝涂布。Sony 从 1950 年代起自己生产录音磁带，1991 年把磁带涂布的经验用在了电极上。",
    winding: "卷绕早就用在圆柱形镍镉电池和电容器上；Sony 1991 年的锂离子电池也是卷绕圆柱。电动车时代要做厚电极、大软包，叠片和 Z 形折叠才多起来。",
    formation: "“化成” (formation) 一词来自铅酸电池：19 世纪 Planté 要反复充放电，把铅板“化成”活性物质。1979 年 Peled 提出 SEI 概念，解释了第一圈为什么必须慢慢充。",
    coin: "CR2032 按 IEC 命名：C 锂/二氧化锰体系，R 圆形，直径 20 mm，厚 3.2 mm。它本是手表、主板用的一次电池，实验室借它的壳测材料。",
    sizes: "18650 = 直径 18 mm、高 65 mm（末位 0 表示圆柱），1990 年代成为笔记本电池的标准尺寸。2017 年 Tesla 与 Panasonic 在内华达超级工厂量产 21700；2020 年 Tesla 发布 4680。",
    ctp: "2019 年宁德时代 (CATL) 推出不用模组的 CTP (cell-to-pack)；2020 年比亚迪 (BYD) 发布“刀片电池”。两者都是把电芯直接装进电池包，省掉一层结构件（Liu 2021 也提到）。",
    batpac: "这种账靠成本模型来算，例如美国 Argonne 国家实验室公开的 BatPaC 模型（2010 年代初起）。本图来自 37 Ah 石墨/NMC 插电混动电芯（Kwade 引 Schünemann 2015 的博士论文）。",
    steps: "成本：Argonne BatPaC 模型（Nelson 2019，67 Ah NMC622 电芯）。能耗：Yuan 2017 在 Johnson Controls 中试线上实测（32 Ah LMO 电芯）。",
    sixSigma: "“把缺陷率压到极低”的管理方法叫 Six Sigma（六西格玛），1986 年由 Motorola 提出，目标是每百万次机会少于 3.4 个缺陷。Kwade 2018 建议用它管电池质量。",
    tapeCasting: "刮刀涂膜（流延法，tape casting）：1947 年 Howatt 等人为做陶瓷电容器薄片，用刮刀把浆料刮成均匀薄层。实验室涂电极至今沿用这个办法（第 2 章）。",
    highNi: "2010 年代后期，高镍正极（如 NMC811）进入量产。工厂很快发现：它在空气里吸水、表面长出 LiOH、Li₂CO₃，做浆料时会让 PVDF 凝成“果冻”（Xiao 2023 Fig. 2）。",
  },

  corrections: [
    { head: "Kwade 2018 p. 298：“maximum tortuosity” 应为最小", body: "原文说用磁场把石墨片竖起来，“achieves maximum tortuosity”，结果离子电导“excellent”。竖排石墨是为了缩短离子路径，即降低曲折度 (tortuosity)；同文 p. 293 也把“low tortuosity”列为质量目标。" },
    { head: "Kwade 2018 p. 298：ED 铜箔不是“电泳沉积”", body: "原文写 “electrophoretic deposit (ED) copper foils”。ED 指电解铜箔 (electrodeposited)，靠电镀长成；电泳沉积 (electrophoretic deposition) 是沉积颗粒的另一种工艺。Xiao 2023 p. 333 写的是“rolling or electrodeposition”。" },
    { head: "Liu 2021 p. 11：32.16% 应为 32.61%", body: "结论部分写化成与老化占制造成本 “32.16%”，同文 Table 1 是 32.61%，p. 9 写约 32%。应是两位数字颠倒。全表十项相加正好 100.00%，可作验证。" },
    { head: "Liu 2021 p. 3：SEI 的 I 是 interphase", body: "原文写 “solid-electrolyte interface (SEI)”。Peled 1979 提出的原词是 solid electrolyte interphase（界面相），强调它是一层有厚度、有结构的膜，而不只是一个“界面”。Kwade 2018 p. 292 用的是 interphase。" },
    { head: "常见误解：扣式循环 1000 圈 = 实用电池也行", body: "扣式半电池的锂片和电解液都大量过量，副反应消耗的锂和电解液随时有补充，衰减被掩盖了。Xiao 2023 p. 331 也指出低载量电极暴露不出真正的难题。详见第 5 章。" },
    { head: "Liu 2021 Table 1：两列数据不是同一个电芯", body: "成本列是模型算的 67 Ah NMC622 电芯（年产 10 万个电池包的工厂）；能耗列是中试线实测的 32 Ah LMO 电芯。两列各自看比例可以，不要把同一行的成本和能耗当成同一条线上的数据。" },
  ],
};
