// 锂电池制造 第 2 章：引文、史实与校注。
// 引文均已对照 PDF 原页逐字核对：
//   J. Li, J. Fleetwood, W. B. Hawley, W. Kays, Chem. Rev. 122, 903–956 (2022)
//   M. Stein IV, C.-F. Chen, D. J. Robles, C. Rhodes, P. P. Mukherjee, J. Vis. Exp. (108), e53490 (2016)
module.exports = {
  noSingle: {
    en: "No solid, bulk active material has sufficient ionic and electronic conductivity to be made into a single-component electrode.",
    zh: "没有哪一种块体活性物质同时足够导离子、导电子，能单独做成电极。",
    ref: "Li 等 2022, p. 904",
  },
  nmpToxic: {
    en: "The toxicity and cost of the NMP/PVDF system has led to the advent of aqueous processing",
    zh: "NMP/PVDF 体系的毒性和成本，催生了水系工艺。",
    ref: "Li 等 2022, p. 907",
  },
  mixingSeq: {
    en: "Mixing techniques, instrumentation, intensity, duration, and sequences are the most important factors in determining slurry quality.",
    zh: "混合方式、设备、强度、时长和加料顺序，是决定浆料质量的最重要因素。",
    ref: "Li 等 2022, p. 911",
  },
  cupcake: {
    en: "It is like making batter for one cupcake at a time to feed the same army; everyone will get a cupcake, and the last should be every bit as delicious as the first.",
    zh: "（连续混合）就像一次只调一个纸杯蛋糕的面糊去喂同一支军队：人人都有一个，最后一个和第一个一样好吃。",
    ref: "Li 等 2022, p. 935",
  },
  shearThin: {
    en: "Stated more succinctly, a high degree of shear thinning (i.e., viscosity decreases as shear rate increases) is desirable",
    zh: "简单说：浆料最好有很强的剪切变稀性（剪切速率越大，粘度越低）。",
    ref: "Li 等 2022, p. 920",
  },
  tightest: {
    en: "However, the slot-die coater is the most common commercially, by far, with the tightest tolerances.",
    zh: "不过在工业上，狭缝涂布机是用得最多的，遥遥领先，公差也最严。",
    ref: "Li 等 2022, p. 912",
  },
  steinFive: {
    en: "Electrode processing can be organized into five main steps: dry powder mixing, wet mixing, substrate preparation, film application, and drying — a step that is often given little attention.",
    zh: "电极制备可分为五步：干粉混合、湿混、基材准备、涂膜和干燥——最后这一步常被忽视。",
    ref: "Stein 等 2016, p. 1",
  },

  facts: {
    composite: "1866 年 Leclanché 把 MnO₂ 和碳粉混在一起做正极，碳粉负责导电。1881 年 Faure 把铅膏涂在铅板栅上，是最早的“涂膏电极”。1976 年 Whittingham 用 TiS₂ 粉加 10% Teflon 热压成电极。",
    recipe: "2016 年 Stein 等在 JoVE 上用文字加视频公开了 Texas A&M 的全套做法，配方是 NMC : 炭黑 : PVDF = 70 : 20 : 10。Li 等 2022 写到，工业电极的活性物质可做到 96 wt% 以上。",
    carbon: "乙炔黑在 20 世纪初开始工业生产，很早就用在干电池里。1991 年饭岛澄男 (Iijima) 报道碳纳米管，2004 年 Geim 与 Novoselov 剥离出石墨烯。2010 年代起，CNT 导电浆逐渐进入动力电池。",
    binder: "1938 年 DuPont 的 Plunkett 意外得到 PTFE（Teflon）。PVDF 在 1940 年代合成，1960 年代起以 Kynar 等牌号商品化。1991 年 Sony 的锂离子电池用 PVDF/NMP 浆料涂布电极，此后成为正极标准。",
    water: "CMC 在 1918 年首次制得，原本用于食品、造纸和洗涤剂。SBR 是 1929 年德国 IG Farben 开发的合成橡胶 (Buna S)。2000 年代起，石墨负极普遍改用 CMC/SBR 水系。2018 年欧盟 REACH 法规限制 NMP，2020 年生效。",
    stokes: "1851 年 Stokes 推导出小球在粘性液体中下沉的速度（Stokes 定律）。Li 等 2022 把“沉降要比生产节拍慢得多”列为混合的两大目标之一。",
    stein: "Stein 等 2016 来自 Texas A&M 的 ETSL 实验室和 Texas State University。他们特意写出常被省略的细节：怎么洗铝箔、加多少 NMP、浆料放久了要重混。",
    mixers: "行星式搅拌来自食品工业，1900 年代 Hobart 已推出电动立式搅拌机。双螺杆挤出机在食品、制药业连续生产已用了几十年；Li 等 2022 引用 Bühler 公司的电池浆料连续混合方案。",
    viscosity: "1687 年 Newton 在《原理》中假设：液体内摩擦力与层间速度差成正比，这就是“牛顿流体”。1920 年 Bingham 造出 rheology（流变学）一词；1929 年流变学会成立。",
    thinning: "1920 年代 de Waele 与 Ostwald 提出幂律模型，描述粘度随剪切速率下降的液体。油漆、番茄酱、电池浆料都属于这一类。",
    checks: "细度板 (Hegman gauge) 来自油漆工业，用来量颜料磨得多细。1805 年 Thomas Young 写出液滴接触角的平衡关系（Young 方程）。",
    blade: "“刮刀”(doctor blade) 一词来自印刷业：刮掉滚筒上多余油墨的刀片。1947 年 Howatt 等用刮刀把陶瓷浆料铺成薄片做电容器，称为流延成型 (tape casting)。",
    slot: "Li 等 2022：狭缝涂布可追溯到造纸业的宽幅涂布，已用了几十年。1950 年代起，照相胶片和磁带工业把它发展成精密涂布。Sony 1950 年起生产磁带，1991 年把涂布经验用到电极上（见第 1 章）。",
    comma: "逗号刮刀因刀辊截面像逗号“,”得名，在日本涂布设备业发展起来，早期锂电产线常用。Li 等 2022 把它与狭缝涂布、刮刀并列为三种主要方法。",
    loading: "涂布量 (coat weight, g/m²) 是造纸和胶片涂布业的老指标。Li 等 2022 举例：20 年前常见的干涂布量是 100 g/m²；今天的厚电极做到 400–500 g/m²。",
    uniformity: "Li 等 2022：15 年前涂布量波动 ±5% 或更大很常见，如今目标是 ±1–2%。原因很实际：大工厂一年要产几 GWh，偏差就是废品。",
  },

  corrections: [
    { head: "Li 2022, p. 905：Li₁₅S₄ 应为 Li₁₅Si₄", body: "原文写硅“lithiated to Li15S4”时容量 3579 mAh/g。这里少了 i：室温下硅的最终嵌锂相是 Li₁₅Si₄，按它算正好约 3579 mAh/g。" },
    { head: "Li 2022, p. 906：CNT、石墨烯不是“富勒烯化合物”", body: "原文把 CNT 和石墨烯称作 fullerene compounds。富勒烯指 C₆₀ 这类闭合笼状分子；石墨烯是平面单层。通称“纳米碳”或“sp² 碳材料”更准确。" },
    { head: "Stein 2016, p. 2：NMC 的名称漏了镍", body: "原文写“lithium-manganese-cobalt-oxide, LiNi1/3Mn1/3Co1/3O2”。化学式没错，名称应为 lithium nickel manganese cobalt oxide（NMC111）。另：全文 calendaring 应为 calendering（辊压）。" },
    { head: "Stein 2016：比容量 155 与 150 mAh/g 不一致", body: "p. 4 算 1C 电流用 155 mAh/g；Fig. 6 图注说 C 倍率按“约 150 mAh/g”定。两者差约 3%。复现时要写清自己用哪个值。" },
    { head: "常见误解：刮刀间隙 = 涂层厚度", body: "间隙只限定湿膜上限。Stein 浆料里固体约占 6 vol%（按配方估算），200 µm 间隙干后只剩约 25 µm。要靠称重算面密度，不能靠间隙。" },
    { head: "常见误解：低载量下好用 = 实用", body: "Stein 示例面容量只有约 0.31 mAh/cm²（补算），工业正极一般在 2–4 mAh/cm²。载量低时电子、离子路程都短，倍率性能会被高估（第 5 章详谈）。" },
  ],
};
