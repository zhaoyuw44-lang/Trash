// 锂电池发展史 第 1 章：引文、史实与校注。
// 引文均已对照 PDF 原页逐字核对：
//   Lewis & Keyes, J. Am. Chem. Soc. 35, 340–344 (1913)   battery_papers/1913_Lewis-Keyes_...pdf
//   W. S. Harris, Electrochemical Studies in Cyclic Esters, PhD thesis, UCRL-8381 (1958)
module.exports = {
  lewisMethod: {
    en: "The method used in measuring the electrode potentials of sodium and potassium has, with some modifications, proved applicable to the determination of the potential of the lithium electrode.",
    zh: "测钠、钾电极电位的方法，稍加改造，同样适用于测定锂电极的电位。",
    ref: "Lewis & Keyes 1913, p. 340",
  },
  lewisHighest: {
    en: "This is the highest electrode potential hitherto measured.",
    zh: "这是迄今测到的最高电极电位。",
    ref: "Lewis & Keyes 1913, p. 343",
  },
  lewisSupposed: {
    en: "It has been currently supposed that the electrode potential of lithium would prove to be smaller even than that of sodium…",
    zh: "人们一直以为，锂的电极电位会比钠还小……（实验结果正好相反）",
    ref: "Lewis & Keyes 1913, p. 344",
  },
  harrisWater: {
    en: "Certainly many metals such as the alkali and alkaline earth metals cannot be electrodeposited from aqueous solution because it is impossible to reach a high enough potential to discharge these metals before hydrogen preferentially evolves.",
    zh: "碱金属、碱土金属无法从水溶液中电沉积：电位还没到能析出这些金属的程度，氢气就先冒出来了。",
    ref: "Harris 1958, p. 51",
  },
  harrisFailed: {
    en: "Many of these attempts failed completely, and many of those that were reported as being successful produced only small amounts of deposit, largely contaminated with metal compounds and unidentified organic residues.",
    zh: "这些尝试很多彻底失败；号称成功的，也只得到少量沉积物，还混满了金属化合物和说不清的有机残渣。",
    ref: "Harris 1958, p. 51",
  },
  harrisLithium: {
    en: "Lithium was obtained by electrolysis from a saturated solution of lithium bromide. Metal was deposited with only slight evolution of gas at current densities as low as 1 ma/cm².",
    zh: "电解饱和溴化锂溶液得到了金属锂。电流密度低到 1 mA/cm² 时就能沉积出金属，只冒出少量气体。",
    ref: "Harris 1958, p. 56",
  },
  harrisDielectric: {
    en: "Contrary to predictions of many solubility theories, the solubility of ionic salts was not found to be a smooth function of the dielectric constant.",
    zh: "和许多溶解度理论的预测相反，离子盐的溶解度并不随介电常数平滑变化。",
    ref: "Harris 1958, p. 62",
  },
  harrisUnfortunate: {
    en: "It is unfortunate that although a great deal of work has been done in aqueous systems, so little has been done in nonaqueous solutions.",
    zh: "可惜的是：水溶液体系已经做了大量工作，非水溶液却几乎没人研究。",
    ref: "Harris 1958, p. 63",
  },

  facts: {
    volta: "1780 年代 Galvani 发现青蛙腿碰到两种金属会抽动，1791 年发表，认为是“动物电”。Volta 不同意，1800 年 3 月 20 日写信给英国皇家学会会长 Banks，公布了电堆。",
    daniell: "1834 年 Faraday 与 Whewell 创造了 electrode、anode、cathode、ion、electrolyte 等词。1836 年 Daniell 把锌、铜分别泡在两种溶液里，做出电压稳定的电池。",
    plante: "1859 年 Planté 把两片铅板卷起来泡在稀硫酸里，第一次做出可以反复充电的电池。1881 年 Faure 把铅膏涂在板栅上，容量大增，铅酸电池从此走向实用。",
    faraday: "1833–1834 年 Faraday 提出电解定律：通过的电量与反应物的“当量”成正比。每摩尔电子的电量后来叫法拉第常数 F ≈ 96 485 C/mol。",
    arfwedson: "1817 年，Arfwedson 在 Berzelius 的斯德哥尔摩实验室分析透锂长石 (petalite) 时发现新元素。1818 年 Gmelin 发现锂盐使火焰呈洋红色。1821 年 Brande 电解得到少量金属锂，1855 年 Bunsen 与 Matthiessen 电解熔融 LiCl 得到较多金属锂。",
    nernst: "1889 年 Nernst 提出电极电位与浓度的关系（Nernst 方程）。单个电极的电位测不出来，只能测两个电极之间的电压，所以要约定一个“零点”：后来统一用标准氢电极 (SHE)。1953 年 IUPAC 斯德哥尔摩会议统一了电位的正负号约定。",
    lewis: "1913 年 2 月，G. N. Lewis 与 F. G. Keyes 在 MIT 物理化学研究实验室发表《锂电极的电位》。此前 Lewis 已与 Kraus（1910，钠）、Keyes（1912，钾）测过另外两种碱金属。",
    water: "1800 年 5 月，Nicholson 与 Carlisle 用电堆把水电解成氢气和氧气。1807 年 Davy 只能电解熔融的苛性钾、苛性钠才得到金属钾、钠，在水里做不到。",
    nonaq: "1895–1909 年 Franklin 与 Kraus 系统研究液氨溶液。1922–1924 年 Müller 等在吡啶中严格除水，才成功电沉积出金属。Walden 1924 年出版《非水溶液电化学》专著。",
    harris: "1958 年 7 月，Harris 在加州大学辐射实验室（今劳伦斯伯克利国家实验室）完成博士论文，导师是电化学工程学家 Charles Tobias，经费来自美国原子能委员会 (AEC)。",
  },

  corrections: [
    { head: "Harris 1958 研究的主要不是“锂的界面行为”", body: "论文主体是盐在 4 种环状酯里的溶解度、电导率（约占全文 2/3）。锂沉积只是“定性电沉积”一节里的一段，没有研究循环、钝化膜或界面。“Harris 发现锂在 PC 中形成钝化膜”的说法在论文里找不到。" },
    { head: "“20 世纪初 Lewis 开始探索锂”应写具体", body: "Lewis & Keyes, J. Am. Chem. Soc. 35, 340 (1913)。他们测的是热力学电位，目的是补全碱金属电位表，并不是为了做电池。" },
    { head: "3.3044 V 不能直接和今天的 −3.04 V 比", body: "原文相对“当量甘汞电极”(N.E.)，且按当时习惯取氧化方向为正。换算到 SHE：−(3.3044 − 0.28) ≈ −3.02 V，与今天公认的 −3.04 V 只差约 0.02 V。" },
    { head: "原文锂的熔点 192 °C 偏高", body: "Lewis & Keyes p. 341 写“the melting point of lithium is high (192°)”。今天的公认值是 180.5 °C，当时金属锂纯度不高。" },
  ],
};
