// 锂电池发展史 第 6 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对（只改了上下标的排版，如 LiFePO4 → LiFePO₄、Voc 的下标）：
//   A. K. Padhi, K. S. Nanjundaswamy & J. B. Goodenough, Phospho-olivines as Positive-Electrode
//   Materials for Rechargeable Lithium Batteries, J. Electrochem. Soc. 144, 1188–1194 (1997)
//   本地文件：1997_Padhi_Nanjundaswamy_Goodenough_Phospho_olivines_LFP.pdf（期刊页码 1188–1194）
module.exports = {
  whPerDollar: {
    en: "…the availability and cost of the transition metals used in these compounds are unfavorable as the Wh/$ is a more important figure of merit than Wh/g in the case of large batteries to be used in an electric vehicle or a load-leveling system.",
    zh: "过渡金属的供应和价格不理想：对电动车或电网调峰用的大电池，Wh/$ 比 Wh/g 更重要。",
    ref: "Padhi et al. 1997, p. 1189",
  },
  inductive: {
    en: "The stronger the covalent bonding within the polyanion, the lower is the Fe³⁺/Fe²⁺ redox energy and the higher the Voc vs. lithium for that couple.",
    zh: "聚阴离子内部的共价键越强，Fe³⁺/Fe²⁺ 的氧化还原能级就越低，这对电对相对锂的开路电压就越高。",
    ref: "Padhi et al. 1997, p. 1189",
  },
  gibbs: {
    en: "The V(x) curves for Li₁₋ₓFePO₄ in Fig. 2 show a voltage that is independent of x over a large range of x, which indicates, by Gibb's phase rule, that the extraction/insertion reactions proceed by the motion of a two-phase interface.",
    zh: "电压在很大的 x 范围内不随 x 变；按 Gibbs 相律，反应是靠两相界面的移动进行的。",
    ref: "Padhi et al. 1997, p. 1190",
  },
  smallCurrent: {
    en: "…a nearly close-packed hexagonal oxide-ion array that is bonded strongly in three dimensions provides a relatively small free volume for Li⁺-ion motion, so the electrode supports only relatively small current densities at room temperature.",
    zh: "氧离子近乎密堆、三维结合牢固，留给 Li⁺ 移动的空间小，所以室温下只能承受较小的电流密度。",
    ref: "Padhi et al. 1997, p. 1191",
  },
  oxides: {
    en: "…the fully charged compounds are metastable: … fully charged phases of Li₁₋ₓCoO₂ and Li₁₋ₓNiO₂ lose O₂ above 180 and 250°C, respectively.",
    zh: "充满电的化合物是亚稳的：……满充的 Li₁₋ₓCoO₂ 和 Li₁₋ₓNiO₂ 分别在 180 °C 和 250 °C 以上放出氧气。",
    ref: "Padhi et al. 1997, p. 1189",
  },
  extrinsic: {
    en: "The intercalation of only 0.6 Li atom/formula unit of LiFePO₄ may be an extrinsic problem since the same V(x) curves are obtained starting with FePO₄ and essentially all the lithium can be extracted chemically from LiFePO₄.",
    zh: "只用到 0.6 个 Li 可能是外在问题：从 FePO₄ 出发曲线相同，化学法几乎能取出全部锂。",
    ref: "Padhi et al. 1997, p. 1193",
  },
  abstract: {
    en: "…shows this material to be an excellent candidate for the cathode of a low-power, rechargeable lithium battery that is inexpensive, nontoxic, and environmentally benign.",
    zh: "……表明这种材料非常适合做低功率可充电锂电池的正极：便宜、无毒、对环境友好。",
    ref: "Padhi et al. 1997, p. 1188（摘要）",
  },

  facts: {
    ironProblem: "1980 年代起 Goodenough 小组一直想用铁做正极：最便宜、无毒。但简单的含铁氧化物电压不合适，层状 LiFeO₂ 不稳定、性能平平（原文 p. 1189）。",
    nasicon: "1987–1989 年，Manthiram 与 Goodenough 研究 Fe₂(SO₄)₃ 等 NASICON 型框架，发现聚阴离子 (polyanion) 能把铁的电压提到约 3.6 V。1997 年 Padhi 等用“诱导效应”解释这个规律。",
    olivine: "LiFePO₄ 在自然界早就存在，矿物名磷铁锂矿 (triphylite)。1997 年 Padhi 等第一次把它当锂电池正极测试；脱锂后的 FePO₄ 与矿物 heterosite 结构相同。",
    twoPhase: "原文用化学试剂 NO₂PF₆ 脱锂，得到不同锂含量的样品。XRD 显示：FePO₄ 的峰逐渐长出，LiFePO₄ 的峰逐渐变弱（Fig. 3、4）。",
    rate: "1997 年原文只用 0.05 mA/cm²（约 C/85）的小电流，作者自己说它适合“低功率”电池。正极里已加了 25% 的乙炔黑，导电仍然不够。",
    tga: "原文 Fig. 8：充电态 FePO₄ 在氮气中加热到 350 °C，重量几乎不变；到 500 °C 失重约 1.6%，作者认为可能来自残留的 LiBr。氧气中结果相近。",
    carbon: "1999 年会议报告、2001 年论文：Ravet、Armand 等（Hydro-Québec）在颗粒外包一层导电碳。2001 年 Yamada 等把颗粒做小、做均匀。",
    layered: "1990 年代初 Dahn 等研究 LiNiO₂：便宜、容量高，但难合成（部分 Ni 跑进锂层）、热稳定差。用 Co、Al 部分取代 Ni 得到 NCA。2001 年 Ohzuku 与 Makimura、Lu 与 Dahn 分别报道 Ni–Co–Mn 层状氧化物 (NMC)。",
    highNi: "2010 年代中期起，NMC111 → 532 → 622 → 811：镍越来越多，钴越来越少。",
    ev: "2008 年 Tesla Roadster 用约 6,800 节笔记本用 18650 电芯。2010 年 Nissan Leaf 用锰酸锂 (LMO) 为主的软包电芯，24 kWh。2012 年 Model S 用 Panasonic 的 NCA 电芯。",
    ctp: "2019 年宁德时代 (CATL) 推出无模组的 CTP (cell-to-pack)。2020 年比亚迪 (BYD) 发布“刀片电池”。两者都用 LFP。",
    nobel: "2019 年 10 月 9 日宣布，表彰“锂离子电池的发展”。Goodenough 获奖时 97 岁，是最年长的诺贝尔奖得主；2023 年去世，享年 100 岁。",
    sse: "1992 年 Bates 等（橡树岭国家实验室）做出 LiPON 薄膜。2007 年 Murugan、Thangadurai、Weppner 报道石榴石型 LLZO。2011 年 Kamaya、Kanno 等报道硫化物 LGPS，电导率赶上液态电解液。",
    anodes: "锂金属负极 1970 年代就用过（第 2 章），1989 年 Moli 召回后被石墨取代（第 5 章）。硅：2008 年 Cui 小组用硅纳米线缓解膨胀；2010 年代起，少量 SiOₓ、硅碳掺进石墨商用。",
    dry: "干法电极源自超级电容器（Maxwell 公司）。2019 年 Tesla 收购 Maxwell，2020 年宣布用于 4680 电芯。其实 Padhi 1997 年的正极也是把活性物、乙炔黑、PTFE 混合后擀成薄片。",
  },

  corrections: [
    { head: "原文没有展示“高倍率的实用正极”", body: "常见说法把快充归功于 1997 年论文。原文只用 0.05 mA/cm²（2 mA/g ≈ C/85），只用到约 0.6 个 Li，作者自称适合“低功率”。高倍率来自后来的碳包覆和纳米化。" },
    { head: "p. 1191：体积变化 6.81% 与 Table I 对不上", body: "按 Table I 的晶胞体积 291.392 → 272.357 Å³，脱锂后缩小 6.53%，密度增加约 2.3%，而不是正文的 6.81% 和 2.59%。教科书常引的“6.8%”出自这句。" },
    { head: "“约 0.6 Li”指平台，不是整条曲线", body: "Fig. 2 的放电曲线延伸到 y ≈ 0.75（约 127 mAh/g，截止 2.0 V）；0.6 Li（约 102 mAh/g）大致是平台结束处。图内标 2.1 mA/g，图注写 2.0 mA/g（Fig. 5 图内为 1.85）。" },
    { head: "“3.5 V”是带电流的闭路电压", body: "Fig. 2 中充电平台约 3.45 V、放电约 3.4 V。今天公认 LFP 的平衡电位约 3.43 V，产品手册常写 3.2 V（整只电芯，负极为石墨）。" },
    { head: "Table I 的坐标轴取法前后不一", body: "表中标 Pbnm，正文说锂链平行于 c 轴；但按 Pbnm，链方向应是约 6.0 Å 的轴，表中 6.008 Å 却记为 a。今天通用 Pnma：a = 10.33、b = 6.01、c = 4.69 Å，锂沿 b 轴移动。" },
    { head: "“不放氧”不等于电池不会起火", body: "原文只测了 FePO₄ 粉末的 TGA/DSC。整只电池的安全还取决于电解液、负极和设计：LFP 电池热失控温度更高、放热更少，但电解液照样可燃。" },
  ],
};
