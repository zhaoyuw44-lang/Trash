// 锂电池发展史 第 5 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对：
//   R. Fong, U. von Sacken & J. R. Dahn, Studies of Lithium Intercalation into Carbons Using
//   Nonaqueous Electrochemical Cells, J. Electrochem. Soc. 137 (7), 2009–2013 (1990)
//   1990_Fong_vonSacken_Dahn_Lithium_Intercalation_into_Carbons.pdf（期刊页码 2009–2013 = PDF 第 1–5 页）
module.exports = {
  film: {
    en: "These irreversible reactions are associated with electrolyte decomposition and cause the formation of a passivating film or solid electrolyte interphase on the surface of the carbon.",
    zh: "这些不可逆反应来自电解液分解，并在碳表面生成一层钝化膜，也就是固体电解质界面膜 (SEI)。",
    ref: "Fong et al. 1990, p. 2009（摘要）",
  },
  stop: {
    en: "When all the available surface area is coated with the film of decomposition products, further decomposition reactions stop. In subsequent cycles, these cells exhibit excellent reversibility…",
    zh: "当所有可用的表面都盖上了分解产物形成的膜，分解反应就停止了。在之后的循环中，这些电池表现出极好的可逆性……",
    ref: "Fong et al. 1990, p. 2009（摘要）",
  },
  carbon: {
    en: "Its capability of intercalating lithium to up to x = 1 in LixC6 is equivalent to a gravimetric specific capacity of 0.37 Ah/g. In addition, carbon is inexpensive, nontoxic, and abundant.",
    zh: "碳最多能嵌锂到 LixC6 中 x = 1，相当于 0.37 Ah/g 的质量比容量。此外，碳便宜、无毒、储量丰富。",
    ref: "Fong et al. 1990, p. 2009",
  },
  cosolvent: {
    en: "The present study will show that when a cosolvent, ethylene carbonate (EC), is introduced in the electrolyte, the reversibility of Li/graphite cells is much improved.",
    zh: "本研究将表明：在电解液中加入共溶剂碳酸乙烯酯 (EC) 后，Li/石墨电池的可逆性大大提高。",
    ref: "Fong et al. 1990, p. 2009",
  },
  sei: {
    en: "If the reaction products form an ionically conducting, mechanically robust, and electronically insulating layer on the carbon surface (i.e., SEI), then the irreversible reactions … will stop once the film thickness is great enough to prevent electron tunneling.",
    zh: "如果反应产物在碳表面形成一层导离子、结实、不导电子的膜（即 SEI），那么一旦膜厚到足以阻止电子隧穿，不可逆反应就会停止。",
    ref: "Fong et al. 1990, p. 2009",
  },
  area: {
    en: "That is, the amount of electrolyte decomposed on the initial carbon surface is proportional to the surface area of the carbon electrode.",
    zh: "也就是说，在碳的初始表面上分解掉的电解液量，与碳电极的表面积成正比。",
    ref: "Fong et al. 1990, p. 2011",
  },
  ecHelps: {
    en: "Apparently, the presence of EC in the cell electrolyte helps reduce the amount of exfoliation accompanied by electrolyte decomposition which occurs near 0.6V in Li/graphite cells.",
    zh: "看来，电解液中有 EC，有助于减少 Li/石墨电池中在约 0.6 V（见校注）伴随电解液分解发生的剥离。",
    ref: "Fong et al. 1990, p. 2012",
  },

  facts: {
    moli: "1977 年，Moli Energy 在温哥华附近的 Burnaby 成立，技术来自 UBC 物理学家 Rudi Haering 的研究组。1978 年 Haering 等申请 Li/MoS₂ 电池专利。1980 年代后期，可充电的 Molicel 上市，用在手机等设备里。",
    dendrite: "1970 年代，Exxon 的 Li/TiS₂ 电池就已暴露问题：金属锂反复镀上、剥下，会长出枝晶（第 2 章）。整个 1980 年代，人们希望靠改进电解液和隔膜把它压住。",
    recall: "1989 年，一部用 Moli 电池的手机起火。Moli 停售并召回电池，随即进入破产接管 (receivership)。1990 年前后，一个日本企业财团买下了 Moli。",
    paper: "三位作者都在 Moli Energy（见论文署名）。论文 1989 年 10 月 11 日投稿，正是召回那一年；1990 年 7 月发表。Dahn 1982 年在 UBC 获博士，导师是 Haering。",
    carbon: "1955 年 Hérold 用锂蒸气把锂嵌入石墨。1975 年 Guérard 与 Hérold 研究了锂嵌入石油焦（原文文献 5）。1983 年 Yazami 用聚合物电解质实现石墨可逆嵌锂（第 4 章）。",
    irrev: "1970 年 Dey 与 Sullivan 发现石墨在 PC 中放电时 PC 会分解（文献 15）。1987 年 Arakawa 与 Yamaki 报告：石墨在 PC 中第一次放电有 1.37 Ah/g 的平台，却充不回来（文献 17）。",
    sei: "1979 年 Peled 提出 SEI 模型：碱金属在非水电解液中总被一层膜覆盖，这层膜导离子、不导电子（第 3 章）。1990 年，本文把这个模型从金属锂搬到了碳电极上。",
    pcec: "1958 年 Harris 研究过 EC：极性大，但室温是固体（第 1 章），所以多年来大家主要用液态的 PC。1970 年代 Besenhard 等发现溶剂会随锂离子一起挤进石墨层间。本文用 PC:EC = 50:50。",
    cycle: "循环寿命是二次电池的“体检”。本文测了石油焦 100 圈、石墨 20 圈；原文说明：停测是因为测试通道不够，不是电池坏了。",
    staging: "1938 年 Rüdorff 与 Hofmann 在石墨插层化合物中提出“阶” (stage) 的概念。1980 年代人们细致研究了锂–石墨的分阶（原文文献 6–13）。Dahn 1991 年发表了 LixC6 的相图。",
    sony: "1991 年，Sony 开始量产销售锂离子电池，开发由西美绪 (Yoshio Nishi) 领导，最早装进 Sony 的 8 mm 摄像机 CCD-TR1。1992 年，旭化成与东芝合资成立 A&T Battery，也开始生产。",
    name: "1970 年代末到 1980 年前后，Armand 提出用两种嵌入化合物做两极，称为摇椅电池 (rocking-chair battery)。1980 年代 Scrosati 等做过多种摇椅电池。1990–1991 年，Sony 给商品起名“锂离子电池” (lithium-ion)。",
    energy: "镍镉 (NiCd) 电池 20 世纪中叶起广泛用于便携设备；镍氢 (NiMH) 电池约 1990 年商品化。Sony 首代锂离子电池常被引用的数字是约 80 Wh/kg、200 Wh/L。",
    after: "1990 年代初，Bellcore 的 Tarascon 与 Guyomard 等系统研究了 EC + DMC 混合溶剂电解液。1990 年代中后期，中间相碳微球 (MCMB) 等石墨负极逐渐成为主流。",
  },

  corrections: [
    { head: "常见说法“Sony 1991 年用的是石墨负极”不对", body: "首代用的是焦炭类无序碳（软碳），随后改用硬碳；石墨到 1990 年代中后期才成为主流。依据：PC 会让石墨剥离（本文 p. 2012），而无序碳在 PC 中照样能用（本文 Fig. 5）。" },
    { head: "原文 p. 2011 与 Fig. 4 图注：图号写错", body: "原文：“not included in Fig. 4b … labeled E in Fig. 3b”。应为 Fig. 3b 与 Fig. 2b：Fig. 4 没有 (b) 分图，E 标在 Fig. 2b 上；Table II 脚注也写的是 Fig. 3b。" },
    { head: "原文 p. 2012：剥离平台写成 0.6 V", body: "同一个平台，p. 2011、p. 2013 与 Fig. 4 都写“near 0.8V”，Fig. 2b 中也在 0.8 V 左右。p. 2012 的“near 0.6V”与其他处不一致，应以 0.8 V 为准。" },
    { head: "摘要“without capacity loss”说得过满", body: "Fig. 7a：石油焦电池 100 圈后约剩 0.94（读图）；石墨只测了 20 圈。p. 2013 的“相差 2% 以内”指充、放电容量相等，不等于不衰减。结论部分“without significant loss”更准确。" },
    { head: "术语：原文的 cathode 与 discharge", body: "原文用 Li/碳 半电池，碳是正极 (cathode)，“放电”是锂嵌入碳。在锂离子全电池里，碳是负极，锂嵌入碳叫“充电”。读原文时要换算。" },
    { head: "小笔误与提示", body: "Fig. 3 纵轴印成“IRREVEVERSIBLE”；p. 2009 “in a variety to forms”应为 of。Fig. 2–3 的电位是相对金属锂的电压，不是相对 SHE。" },
  ],
};
