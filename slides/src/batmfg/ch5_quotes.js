// 锂电池制造 第 5 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对：
//   F. Dai & M. Cai, Best practices in lithium battery cell preparation and evaluation, Commun. Mater. 3, 64 (2022)
//   P.-M. Luc, S. Bauer & J. Kowal, Reproducible Production of Lithium-Ion Coin Cells, Energies 15, 7949 (2022)
const DAI = "Dai & Cai 2022";
const LUC = "Luc et al. 2022";
module.exports = {
  alignment: {
    en: "The alignment of cathode and anode is very critical towards long cycling stability.",
    zh: "正极与负极的对齐，对长期循环稳定性非常关键。",
    ref: `${DAI}, p. 2`,
  },
  sameElectrolyte: {
    en: "To obtain better reproducibility of data from different experimental batches, exact same amount of electrolyte should be used in all cell preparations.",
    zh: "为了让不同批次的数据更可重复，所有电池都应加入完全相同量的电解液。",
    ref: `${DAI}, p. 2`,
  },
  assembler: {
    en: "…it is highly recommended that each assembler gains experience by assembling multiple cells (e.g., ~50 coin cells) before main experiments and compares the results to other assemblers in the staff.",
    zh: "……强烈建议每位组装者在正式实验前先装一批电池（例如约 50 颗）练手，并和组里其他人的结果比一比。",
    ref: `${LUC}, p. 7`,
  },
  valuable: {
    en: "The higher the reproducibility of an experiment, the more valuable the study findings become.",
    zh: "实验的可重复性越高，研究结论就越有价值。",
    ref: `${LUC}, p. 1`,
  },
  sampleSize: {
    en: "However, have enough sample set number for each batch (e.g., 3–10 cells per batch) should be encouraged in lab-scale research when using coin format cell.",
    zh: "不过，实验室用扣式电池做研究时，应当提倡每批有足够的样本数（例如每批 3–10 颗）。",
    ref: `${DAI}, p. 3`,
  },
  qualitative: {
    en: "Until then, the results from coin cell experiments, as set up in this study, are only qualitative.",
    zh: "在那之前，按本研究方式搭建的扣式电池实验，其结果只能算定性的。",
    ref: `${LUC}, p. 15`,
  },
  critical: {
    en: "…to achieve accurate and reliable data on new materials for batteries, repeatability, and quality of cell fabrication are critical to ensure reproducible findings.",
    zh: "……要在电池新材料上得到准确、可靠的数据，电池制作的可重复性和质量是保证结论可重现的关键。",
    ref: `${DAI}, p. 1 摘要`,
  },

  facts: {
    fishbone: "1960 年代，日本质量管理专家石川馨 (Kaoru Ishikawa) 推广“鱼骨图”（因果图）：把一个结果的原因按人、机、料、法分类列出。2022 年 Luc 等按同样思路，把扣式电池可重复性的影响因素分为材料、设备、生产、组装者四类（原文 Fig. 3）。",
    align: "2011 年 Dahn 组 Marks 等发表扣式电池电极制作指南；2019 年 Murray、Hall、Dahn 发表全电池扣式电池指南；2021 年 Hu 等 (Joule) 指出负极略大于正极更好对齐（Dai p. 2，refs. 14、15、18）。商品电池早就用负极“出边” (overhang) 设计。",
    burr: "冲裁 (blanking) 是金属加工的老工艺，冲出的圆片一面圆角 (roll-over)、一面毛刺 (burr)，工厂用刀口间隙和去毛刺工序控制。2022 年 Luc 等用激光扫描显微镜量了垫片和负极片的边缘高度（原文 Table 3）。",
    spring: "1678 年 Robert Hooke 发表弹簧定律：力与伸缩量成正比，F = k·x。扣式电池里的压力就来自被压缩的弹簧。Dai & Cai 2022 指出：当时还没有关于扣式电池内部压力的研究报道（p. 3）。",
    water: "1935 年德国化学家 Karl Fischer 发明测微量水的滴定法（卡尔·费休滴定，KF）；1959 年 Meyer 与 Boyd 发展了库仑法 KF（Dai ref. 26）。2016 年 Argonne 的 Long 等系统比较了 1.7–8.7 倍孔体积的电解液量（Luc Table 1）。",
    temp: "1889 年 Arrhenius 提出：反应速率随温度按指数变化。电池里的副反应也一样，“室温”差几度，老化速度就不同。Luc 等把电池放在 30 °C 恒温箱里测试（p. 4）。",
    survey: "2016 年 Nature 调查了 1500 多名科学家（Baker，Luc ref. 2）：七成以上重复不了别人的实验，一半以上重复不了自己的。2022 年 Luc 等装了 16 种组合 × 8 颗 = 128 颗扣式电池来研究这个问题。",
    stats: "1890 年代 Karl Pearson 提出变异系数 (coefficient of variation)；1908 年 William Gosset 以笔名“Student”发表 t 分布。他在 Guinness 啤酒厂工作，每次只有很少几个样本——和我们只有几颗电池的处境一样。",
    sample: "2016 年 Long 等（Argonne）每种条件做 30 颗扣式电池，并认为更小的样本也能给出合理的离散（Dai p. 3，ref. 20）。2022 年 Dai & Cai 建议每批 3–10 颗；Luc 等每种组合 8 颗。",
    doe: "1920 年代 R. A. Fisher 在英国 Rothamsted 农业试验站发展析因设计 (factorial design)，1935 年出版《The Design of Experiments》。1959 年 Cuthbert Daniel 提出半正态图，用来从不重复的析因实验里挑出显著效应（Luc ref. 17）。",
    metrics: "2011 年 Gogotsi 与 Simon 在 Science 发表 “True performance metrics in electrochemical energy storage”，呼吁同时报告面载量和整个器件的性能，而不只报“每克活性物质”的数字。",
    battery500: "2016 年美国能源部成立 Battery500 联盟（PNNL 牵头），目标是 500 Wh/kg 的电芯。2019 年联盟成员 Chen 等 (Joule) 和 Wu 等 (JES) 发表锂金属电池的关键参数与良好实践（Dai ref. 19；Luc ref. 26）。",
    coulometry: "2010 年前后，Dahn 组发展高精度库仑效率测量 (high-precision coulometry)，能分辨 99.9% 和 99.99% 这样的差别；2014 年 Fathi 等用它研究电池老化（Luc ref. 22）。",
  },

  corrections: [
    { head: "Luc p. 2、p. 9：把“面积比”叫成了 N/P", body: "原文的 “N/P ratio 1.0 / 1.3” 其实是负极与正极的面积比：(16 mm ÷ 14 mm)² ≈ 1.31。N/P 通常指负极与正极的容量比 (mAh/cm² 之比)。两极载量不同时，两者差别很大，报告时要写清是哪一个。" },
    { head: "Luc Table 5 与 Table 7 的数值对不上", body: "Table 5 表头写 ECV“中位数”，但放电容量和库仑效率两列的数值等于 Table 7 的“平均值”（如 H2：0.3451）。内阻一列（如 H2：0.5499）与 Table 7 的中位数 0.5312、均值 0.5705 都不同。引用时以 Table 7 为准。" },
    { head: "Luc Fig. 5 与式 (2)：统计细节有出入", body: "Fig. 5 标题是“半正态图”，但画的是带正负号的效应（正态概率图）。按文中列出的 6 个随机效应用式 (2) 计算，s ≈ 0.11，而非文中的 0.0943。结论不变：最大效应 0.188 仍小于 95% 界 2.45 × 0.11 ≈ 0.28。" },
    { head: "Dai p. 2–4：人名与小笔误", body: "“Mark et al” 应为 Marks 等 (ref. 18)；“Jiangtao et al.” 是 Hu, J. (ref. 15)；“Brandon et al.” 是 Long, B. R. (ref. 20)——原文用了名而不是姓，查文献时要按姓找。另：“Hook's law” 应为 Hooke's law；Luc p. 6 “the d” 应为 materials。" },
  ],
};
