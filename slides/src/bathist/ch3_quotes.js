// 锂电池发展史 第 3 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对：
//   D. E. Fenton, J. M. Parker, P. V. Wright, Polymer 14, 589 (1973)   1973_Fenton_Parker_Wright_...pdf
//   E. Peled, J. Electrochem. Soc. 126, 2047–2051 (1979)                1979_Peled_The_Solid_Electrolyte_Interphase_Model.pdf（扫描件，按页面图像核对）
module.exports = {
  fentonReport: {
    en: "We wish to report the preparation of crystalline complexes of sodium and potassium salts with poly(ethylene oxide).",
    zh: "我们报道：钠盐、钾盐能与聚环氧乙烷形成晶态络合物。",
    ref: "Fenton et al. 1973, p. 589",
  },
  fentonSize: {
    en: "The size of the cation may be a critical factor in the formation of complexes with poly(ethylene oxide).",
    zh: "阳离子的大小，可能是能否与聚环氧乙烷形成络合物的关键。",
    ref: "Fenton et al. 1973, p. 589",
  },
  fentonConductivity: {
    en: "The electrical conductivity of the potassium thiocyanate complex is very sensitive to temperature and increases markedly as the degree of crystallinity is reduced.",
    zh: "硫氰酸钾络合物的电导率对温度非常敏感；结晶度越低，电导率越高。",
    ref: "Fenton et al. 1973, p. 589",
  },
  peledTable: {
    en: "…the first three yield aluminum as expected from thermodynamic considerations, while the other three yield lithium or magnesium in apparent contradiction to thermodynamics.",
    zh: "前三个体系按热力学预期析出铝；后三个却析出锂或镁，看上去违反热力学。",
    ref: "Peled 1979, p. 2047",
  },
  peledName: {
    en: "It acts as an interphase between the metal and the solution and has the properties of solid electrolyte, through which electrons are not allowed to pass. Therefore, it is called “Solid Electrolyte Interphase (SEI).”",
    zh: "它是金属和溶液之间的一个“中间相”，具有固体电解质的性质：电子不许通过。所以叫它“固体电解质界面膜 (SEI)”。",
    ref: "Peled 1979, p. 2047",
  },
  peledShelf: {
    en: "A slow corrosion rate, and therefore, a long shelf life is expected for systems in which, at least, one of the corrosion products is very insoluble and immediately precipitates on the anode surface to form a dense and hole-free SEI…",
    zh: "只要至少有一种腐蚀产物极难溶、并立刻沉积在负极表面，形成致密无孔的 SEI，腐蚀就会很慢，电池就能存放很久。",
    ref: "Peled 1979, p. 2050",
  },
  peledKey: {
    en: "It is concluded that a proper anodic SEI is the key for the operation of NAB.",
    zh: "结论：合适的负极 SEI，是非水电池能够工作的关键。",
    ref: "Peled 1979, p. 2051",
  },

  facts: {
    solid: "1967 年，Ford 公司的 Yao 与 Kummer 发现 β-氧化铝能快速传导 Na⁺，Ford 据此研发钠硫电池。同一时期还发现了 RbAg₄I₅ 等银离子导体。“快离子导体”成为 1970 年代的热门领域。",
    pedersen: "1967 年，DuPont 公司的 Charles Pedersen 偶然合成出冠醚 (crown ether)：环上的氧原子能把 K⁺、Na⁺ 抱在环中间。他因此与 Cram、Lehn 分享 1987 年诺贝尔化学奖。",
    before73: "1964 年 Blumberg 等做出 PEO–HgCl₂ 络合物，1968 年 Tadokoro 组解出其结构；1966 年 Lundberg 等发现 KI 能破坏 PEO 的结晶，室温下得到一种弹性体。",
    fenton: "1973 年 8 月，Sheffield 大学化学系的 Fenton 与玻璃工艺系的 Parker、Wright 投出一封一页的短信 (Polymer 14, 589)：Na、K 盐能与 PEO 形成晶态络合物。",
    wright: "1975 年，Wright 在 British Polymer Journal 发表这些络合物的电导率测量 (Br. Polym. J. 7, 319)。1973 年的短信里只有一句话提到电导。",
    armand: "1978 年 9 月，Grenoble 的 Michel Armand 与 Chabagno、Duclot 在苏格兰 St Andrews 的第二届固体电解质国际会议上提出：PEO–锂盐可作锂电池的固体电解质。1979 年以“Poly-ethers as solid electrolytes”为题正式发表。",
    berthier: "1983 年，Berthier、Armand 等用核磁共振 (NMR) 证明：离子主要在无定形区运动，而且和高分子链的运动耦合在一起，不是在晶格位置之间跳 (Solid State Ionics 11, 91)。",
    peled: "以色列 Tel Aviv 大学的 Emanuel Peled，1977 年 10 月在 ECS Atlanta 会议上报告 SEI 模型，1979 年 12 月发表于 J. Electrochem. Soc. 126, 2047。",
    young: "Peled 用的离子迁移公式不是新发明：它来自研究金属阳极氧化膜（如铝、钽氧化膜）的“高场离子导电”理论，原文引 L. Young 1961 年专著《Anodic Oxide Films》。",
    rocking: "1970 年代末，Armand 提出：两极都用嵌入材料，Li⁺ 在两极之间来回“摇”，不再需要锂金属（发表于 1980 年 Plenum 出版的会议文集）。1980 年，罗马大学的 Lazzari 与 Scrosati 用两个嵌入电极做出第一个可循环的实验电池 (J. Electrochem. Soc. 127, 773)。",
  },

  corrections: [
    { head: "“1973 年 Fenton 等提出聚合物电解质用于电池”不对", body: "1973 年的短信全文没有出现“电池”，电导只有一句定性描述，没有数值。电导数据要到 Wright 1975；提出用于锂电池的是 Armand 等（1978 年报告，1979 年发表）。" },
    { head: "1973 年研究的是 Na、K，不是 Li", body: "原文的晶态络合物是 NaI、NaSCN、KSCN。锂只说 LiI 出现球晶、“its nature is yet to be ascertained”（性质待查），LiBr 只在溶液里有相互作用。" },
    { head: "Fenton 1973 参考文献 6：“Pederson” 应为 Pedersen", body: "冠醚的发现者是 C. J. Pedersen, J. Am. Chem. Soc. 89, 7017 (1967)。原文拼错了姓。" },
    { head: "SEI 不是 Peled 第一个发现的，也不是为石墨提出的", body: "Peled p. 2047 自己引用了 Dey (1970)、Rauh & Brummer (1977) 的 Li⁺ 导电膜。他的贡献是命名并建立动力学模型。对象是 Li、Ca、Mg 金属负极（多为 SOCl₂ 一次电池）；石墨上的 SEI 见第 5 章。" },
    { head: "“SEI 1979 年提出”应写成 1977 年报告、1979 年发表", body: "原文 p. 2051 注明：这是 1977 年 10 月 ECS Atlanta 会议的第 4 号报告，1978 年 12 月 27 日投稿，1979 年 12 月发表。" },
    { head: "Peled 原文同一符号两种含义", body: "p. 2047、2049 的 αa 是“阳极传递系数”，p. 2051 式 [30] 的 α 却是厚度随时间增长的指数；式 [11] 的 z 即前文的 Z（离子价数）。读公式时要分清。" },
  ],
};
