// 锂电池制造 第 6 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对：
//   A. Sommer, J. Wachter, S. Grabmann, R. Daub, Batteries & Supercaps 7, e202400127 (2024)
//   A. Kwade et al., Nature Energy 3, 290–300 (2018)
//   J. Xiao, F. Shi, T. Glossmann, C. Burnett, Z. Liu, Nature Energy 8, 329–339 (2023)
const SOM = "Sommer 2024";
const KWA = "Kwade 2018";
const XIA = "Xiao 2023";
module.exports = {
  wetting: {
    en: "Furthermore, the filling process is a time- and quality-critical process step because ESA pores must be wetted completely.",
    zh: "此外，注液是一个既耗时、又决定质量的工序，因为电极–隔膜组件 (ESA) 里的孔必须被完全浸润。",
    ref: `${KWA}, p. 297`,
  },
  formCost: {
    en: "Formatting and aging can represent up to 30% of investment costs, so reducing the time taken leads to significant cost savings.",
    zh: "化成和老化最多可占投资成本的 30%，所以缩短它们的时间能显著省钱。",
    ref: `${KWA}, p. 294`,
  },
  cover: {
    en: "In the ESA, the anode must cover the cathode completely to utilize the whole cathode area and to reduce the danger related to dendrite formation.",
    zh: "在电极–隔膜组件里，负极必须完全盖住正极：这样才能用上整个正极面积，并降低枝晶带来的危险。",
    ref: `${KWA}, p. 297`,
  },
  overbal: {
    en: "The overbalancing of the anodes results in a lower energy density; however, this reduces the risk of lithium plating.",
    zh: "负极容量“多配”会降低能量密度，但它能降低析锂的风险。",
    ref: `${SOM}, p. 6`,
  },
  single: {
    en: "By using a single electrode sheet that was outside the permissible tolerance regarding loading, the entire battery cell became qualitatively inferior as it exhibited a faster degradation behavior.",
    zh: "只用了一片载量超出允许公差的电极，整只电池的质量就变差了：它衰减得更快。",
    ref: `${SOM}, p. 11`,
  },
  insurmountable: {
    en: "It is not uncommon that practical considerations prove insurmountable after scientists make promising discoveries in the laboratory.",
    zh: "科学家在实验室里做出有希望的发现之后，实际问题却证明无法跨越——这种情况并不少见。",
    ref: `${XIA}, p. 329 摘要`,
  },
  realistic: {
    en: "Carrying out fundamental research at industry-relevant scales and cross-validating all new materials and battery technologies in realistic conditions will help researchers identify the right directions…",
    zh: "在与工业相关的尺度上做基础研究，并在真实条件下交叉验证所有新材料和新电池技术，能帮助研究者找到正确的方向……",
    ref: `${XIA}, p. 337`,
  },

  facts: {
    coinPouch: "1991 年 Sony 的首款锂离子电池就是多层卷绕的圆柱电池，不是扣式。2014 年 Argonne 的 Trask 等专门发文讨论“从扣式到 400 mAh 软包”要改什么（Kwade 文 ref. 55）。",
    winding: "卷绕 (jelly roll) 在锂离子之前已用于圆柱镍镉、镍氢电池，1991 年 Sony 沿用。叠片随扁平软包普及；Z 形叠片的连续化见 Aydemir 等 2017（Kwade 文 ref. 73）。",
    pouch: "1996 年 Bellcore 的 Tarascon 等推出扁平的“塑料锂离子电池” (PLiON)，用铝塑复合膜封装；1990 年代末起软包进入手机。铝塑膜借鉴了食品软包装。",
    filling: "2015–2016 年，慕尼黑工业大学 (TUM) iwb 的 Knoche 等用中子成像实时“看”电解液怎样渗进电芯（Kwade 文 refs. 28、53）。Sommer 的中试线就在同一研究所。",
    formation: "“化成”一词来自铅酸电池：1859 年后 Planté 的极板要反复充放电才能“形成”活性层。1979 年 Peled 提出 SEI 模型；1990 年 Fong、von Sacken 与 Dahn 证明石墨首圈的不可逆容量来自成膜。",
    aging: "Kwade 2018：化成约 1 天，老化 2–3 周。2017 年橡树岭国家实验室的 An、Wood 等提出快速化成流程（Kwade 文 ref. 30）。成本数据来自 Argonne 的 BatPaC 等模型。",
    np: "“负极多配”的思路早于锂电：1940 年代末 Neumann 的密封镍镉电池就故意让负极容量多于正极。锂离子电池中，Sommer 引用了 1995 年以来多篇研究 N/P 的论文（refs. 31、32、40、41、45）。",
    plating: "石墨析锂在低温、快充下最常见。2014 年 Petzl 与 Danzer 提出用电压曲线检测析锂；Waldmann 等 2014、2016 年用拆解分析 (post-mortem) 观察析锂形貌（Sommer refs. 55、57、58）。",
    trace: "Data Matrix 码由 ISO/IEC 16022 标准化（2000 年首版）。1981 年起汽车用 17 位车架号 (VIN) 追溯每辆车。Sommer 团队 2021 年起给单片电极打码（refs. 25、30）。",
    fig6: "2024 年 Sommer 等在 TUM iwb 中试线做了 6 只软包：3 只参考 (Ref)，3 只故意混入一片载量约 +20% 的正极 (Man)。",
    results: "循环条件：1 C 充放，2.9–4.2 V，25 °C，夹具压力 2 bar，每 50 圈做一次 0.1 C 体检 (checkup)，共 1002 圈。随后在手套箱中拆解，并用 SEM 看负极表面。",
    mechanism: "把一只电芯里的各层看成“并联的小电池”，来自电池模组的并联分析（Sommer ref. 48，Tagawa 与 Brodd 2009）。不同 SOC、不同电阻的并联支路分流不均，是模组设计的老问题。",
    scales: "Kwade 2018 把放大分成实验室、中试、量产三级（Fig. 4）。“死亡之谷” (valley of death) 是技术转化的常用说法，1990 年代末起在美国科技政策中流行。",
    xiao: "Xiao 等 2023（PNNL 等）：同一条合成路线，1 g、100 g、1 kg 一批遇到的问题都不一样（p. 330）；生产线速度超过 60 m/min 时，传感器分析 1 mm 电极只有不到 1 ms（p. 335）。",
  },

  corrections: [
    { head: "Sommer p. 5：负极夹紧力写成了 “172 kHz”", body: "原文：“a clamping force of 172 kHz”。kHz 是频率单位。正极同一句写的是 97 kPa，负极应为 172 kPa（压力）。超声焊的频率两者都是 20 kHz。" },
    { head: "Sommer p. 6：“slot die coating is preferred” 前后矛盾", body: "原文先说刮刀涂布偏差大、推荐狭缝涂布，接着说本中试线“however, slot die coating is preferred due to the lower material consumption”。他们实际用的是刮刀涂布，此处应为 doctor blade。" },
    { head: "Sommer 式 (2)：求和下标 “i = n” 应为 “i = 1”", body: "式 (2) 要把 10 个正极涂层的面容量 × 面积加起来，求和应从 i = 1 到 10。用 Fig. 6 的 Ref 1 数据验算：10 层之和 26.95 mAh/cm² × 73.73 cm² ≈ 1.99 Ah，与 Fig. 7 一致。" },
    { head: "Sommer p. 9、11：“overbalancing” 用反了", body: "p. 6 用 “overbalancing of the anodes” 指 N/P > 1（负极多配）。p. 9、11 却把 C3 对面 N/P < 1 的情况也叫 overbalancing。准确说法：正极超载、负极配量不足 (underbalanced)。" },
    { head: "Kwade p. 294：“Formatting” 即化成 (formation)", body: "原文 “Formatting and aging…” 中的 Formatting 就是同段前文的 “formation process”。英文通用词是 formation，中文叫“化成”，不是“格式化”。读文献时别被这个词带偏。" },
    { head: "常见误区：N/P 越大越安全", body: "N/P 大确实不易析锂（Sommer p. 6），但负极多出的面积和石墨会多长 SEI、多消耗锂，能量密度也下降。石墨体系常用约 1.1–1.2（典型值）。另注意：Sommer 的 N/P 用的是标称比容量算出的设计值。" },
  ],
};
