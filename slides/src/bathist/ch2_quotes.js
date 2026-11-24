// 锂电池发展史 第 2 章：引文、史实与校注。
// 引文均已对照 PDF 原页（400 dpi 图像）逐字核对：
//   M. S. Whittingham, Electrical Energy Storage and Intercalation Chemistry, Science 192, 1126–1127 (1976)
const REF = "Whittingham 1976";
module.exports = {
  ambient: {
    en: "We therefore set out to determine whether an alkali metal–based battery couple could be found that would operate reversibly at ambient temperatures.",
    zh: "因此我们着手寻找：能不能找到一种以碱金属为基础、在室温下可逆工作的电池组合。",
    ref: `${REF}, p. 1126`,
  },
  nothingKnown: {
    en: "However, nothing was known concerning the possibility of forming them in an electrochemical cell, or of the energy or reversibility of the reaction.",
    zh: "然而，能否在电化学电池里生成这些嵌入化合物、反应能量多大、是否可逆，当时都一无所知。",
    ref: `${REF}, p. 1126`,
  },
  tis2Choice: {
    en: "For cell testing we chose to use TiS₂, not only because it had the lowest weight and cost of all the layered dichalcogenides, but also because of its metallic conductivity…",
    zh: "我们选 TiS₂ 做电池测试，不仅因为它在所有层状二硫属化物中最轻、最便宜，还因为它有金属般的导电性……",
    ref: `${REF}, p. 1126`,
  },
  structural: {
    en: "This reaction occurs very rapidly and in a highly reversible manner at ambient temperatures as a result of structural retention.",
    zh: "由于结构得以保持，这个反应在室温下进行得很快，而且高度可逆。",
    ref: `${REF}, p. 1126 摘要`,
  },
  noBonds: {
    en: "…the crystal structure, which remains essentially unchanged during reaction; no chemical bonds are broken in the host TiS₂ matrix during the insertion or removal of lithium.",
    zh: "……晶体结构在反应中基本不变；锂嵌入或脱出时，主体 TiS₂ 骨架里没有任何化学键断开。",
    ref: `${REF}, p. 1127`,
  },
  reversible: {
    en: "…curve a in Fig. 1 could be retraced exactly, indicating the complete reversibility of the system and the 100 percent coulombic efficiency of the TiS₂ electrode.",
    zh: "……Fig. 1 的曲线 a 可以被准确地原路走回，说明体系完全可逆，TiS₂ 电极的库仑效率为 100%。",
    ref: `${REF}, p. 1126`,
  },
  newGeneration: {
    en: "Titanium disulfide is one of a new generation of solid cathode materials.",
    zh: "二硫化钛是新一代固体正极材料中的一员。",
    ref: `${REF}, p. 1126 摘要`,
  },

  facts: {
    oil: "1973 年 10 月石油危机：阿拉伯产油国禁运，几个月内油价涨到约 4 倍。Exxon 等石油公司开始投资新能源。Whittingham 1972 年从 Stanford 博士后转入 Exxon 研究与工程公司（新泽西州 Linden）。",
    hightemp: "1960 年代，Ford 的 Kummer 与 Weber 发明钠硫 (Na/S) 电池（约 300 °C）；Argonne 等研究 400 °C 以上的 LiAl/FeS 电池（原文 ref. 8）。",
    graphite: "嵌入最早在石墨里发现：1840 年代 Schafhäutl 把硫酸“插”进石墨；1926 年 Fredenhagen 与 Cadenbach 让钾进入石墨，得到 C₈K。",
    sulfides: "1960 年代 Rüdorff 用液氨把碱金属插进 TiS₂ 等硫化物；1970 年 Gamble 等把有机分子插进 TaS₂，并发现它们能超导（原文 ref. 9）。",
    electrochem: "1974 年 Whittingham 在 Chem. Commun. 报道：在 TaS₂ 电极上电解吡啶盐酸盐溶液，几分钟就把吡啶嵌进去（原文 ref. 10）。同年 Subba Rao 与 Tsang 也有类似报道（ref. 11）。",
    gibbs: "电池电压与反应自由能的关系 ΔG = −nFE，来自 1870–80 年代 Gibbs 与 Helmholtz 的热力学。石墨嵌钾 C₈K 只有约 0.2 V 的数据，原文引自 Aronson 等 1968（ref. 12）。",
    structure: "TiS₂ 是 CdI₂ 型层状结构。1970 年代初，Gamble、Thompson 等在 Exxon 研究层状硫化物的导电与超导（原文 refs. 9, 13, 14）。Whittingham 在致谢里感谢 Gamble 把他“引进层状硫化物”。",
    nmr: "1975 年 Silbernagel 用核磁共振 (NMR) 比较锂在各种层状硫化物中的扩散，发现 TiS₂ 最快（原文 ref. 4）。1976 年 Whittingham 据此选定 TiS₂。",
    phase: "1870 年代 Gibbs 提出相律：两相共存时，电压被“锁定”成平台；只有一相时，电压随成分连续变化。1976 年 Whittingham 由 Fig. 1 的斜线判断：LiₓTiS₂ 是单相反应。",
    fig1: "1976 年原文：单晶 TiS₂ 证明了可逆（曲线 a 来回重合）；粉末电极以 10、4 mA 放电（曲线 b）；每次只用 4% 容量浅循环 1100 多次后，仍保有 70% 以上理论容量（曲线 c）。",
    cell: "原文先用单晶 TiS₂ + LiPF₆/PC，测出 2.5 V、10 mA/cm²；再做成 2 cm² 粉末电极，改用 LiClO₄ + DME/THF。",
    rate: "400 °C 以上的 Li/金属硫化物电池可达 10–50 mA/cm²（refs. 16, 17）；Holleck 等 1975 年的室温 Li/TiS₂ 只有 0.33 mA/cm²（ref. 18）。",
    primary: "1972 年 Li/I₂ 电池用于起搏器；1973 年前后 Matsushita 推出 Li/(CF)ₓ，GTE 等研制 Li/SOCl₂；1975 年前后 Sanyo 推出 Li/MnO₂。",
    dendrite: "锌电池里的枝晶早为人知。1970 年代研究可充锂电池时发现：锂在 PC 等电解液中反复镀、溶，会长成苔藓状、枝晶状，效率明显低于 100%。Exxon 后来改用锂铝合金 (LiAl) 负极来缓解。",
    rocking: "1970 年代末到 1980 年，Armand 等提出两极都用嵌入材料、让锂离子来回“摇”的设想（摇椅电池）。1980 年 Mizushima 与 Goodenough 报道 LiCoO₂ 正极（第 4 章）。",
  },

  corrections: [
    { head: "“2.5 V” 是起点电压，不是平均电压", body: "p. 1126 写单晶电池 emf 为 2.5 V。按 Fig. 1 曲线 a，开路电压从 x≈0 的约 2.5 V 降到 x=1 的约 1.9 V，平均约 2.2 V。“Li/TiS₂ 是 2.5 V 电池”应改为“平均约 2.2 V”。" },
    { head: "Fig. 2 的电解液与“上文所述”不一致", body: "p. 1126 说电流密度在“上文所述的粉末电池”中得到证实，数据见 Fig. 2。但上文电池用 LiClO₄/DME–THF，Fig. 2 图注却是 LiAlCl₄/甲基氯甲酸酯；注 21 还说这种电解液过放电会分解，不能商用。" },
    { head: "480 Wh/kg 只算了 Li 和 TiS₂", body: "按 Li + TiS₂ → LiTiS₂：225 mAh/g（以 LiTiS₂ 质量计）× 平均约 2.1 V ≈ 480 Wh/kg，与原文 p. 1127 一致。不含电解液、隔膜和外壳；原文也预计实用电池只有 100+ Wh/kg 级。" },
    { head: "嵌入不是 Whittingham 发明的", body: "石墨嵌入化合物 1840 年代就有，1926、1938 年已有系统研究；层状硫化物的嵌入在 1960 年代到 1970 年代初已有 Rüdorff、Gamble 等研究，原文也引用了前人（refs. 9, 11, 12）。他的贡献是首次做成室温可充电池，并测出能量与可逆性。" },
  ],
};
