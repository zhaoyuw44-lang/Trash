// 锂电池发展史 第 4 章：引文、史实与校注。
// 引文均已对照 PDF 原页图像逐字核对：
//   K. Mizushima, P. C. Jones, P. J. Wiseman, J. B. Goodenough, Mater. Res. Bull. 15, 783–789 (1980)
//   R. Yazami & Ph. Touzain, J. Power Sources 9, 365–371 (1983)
//   A. Yoshino, K. Sanechika, T. Nakajima, US 4,668,595 (filed May 9, 1986; granted May 26, 1987)
//   专利的“col.”为专利正文栏号，“ll.”为栏边行号。
module.exports = {
  mizOxides: {
    en: "Therefore, for a higher cell voltage, lithium is preferable to sodium, and oxides are preferable to sulphides.",
    zh: "因此，要想电池电压更高：锂优于钠，氧化物优于硫化物。",
    ref: "Mizushima et al. 1980, p. 783",
  },
  mizRoute: {
    en: "The synthetic route chosen was to prepare the discharged-electrode material, a ternary lithium oxide, with high-temperature techniques and to obtain the charged material by low-temperature electrochemical extraction of the lithium.",
    zh: "我们选的路线是：先用高温方法制备“放电态”电极材料（一种含锂的三元氧化物），再在低温下用电化学方法把锂抽出来，得到充电态材料。",
    ref: "Mizushima et al. 1980, p. 784",
  },
  mizAlternate: {
    en: "The high voltages permit consideration of alternate negative electrodes, and two cell configurations become possible options.",
    zh: "电压这么高，就可以考虑换用别的负极了；有两种电池构型可以选择。",
    ref: "Mizushima et al. 1980, p. 788",
  },
  mizPracticality: {
    en: "The practicality of these options has yet to be explored.",
    zh: "这些方案是否实用，还有待探索。",
    ref: "Mizushima et al. 1980, p. 788",
  },
  yazamiSolvate: {
    en: "The electrochemical intercalation of lithium into graphite has been achieved by the use of a solid polymer electrolyte … which does not solvate the Li⁺ ions as is the case with the liquid propylene carbonate/graphite system.",
    zh: "我们用固体聚合物电解质实现了锂在石墨中的电化学嵌入：它不像液态碳酸丙烯酯那样“裹着”Li⁺ 一起进入石墨。",
    ref: "Yazami & Touzain 1983, p. 371",
  },
  yoshinoIrregular: {
    en: "Specifically they have found that for the incorporation of such cations as Li⊕ ion, the carbonaceous material acquires better properties when it possesses an irregular structure to some extent.",
    zh: "具体地说，发明人发现：要嵌入 Li⁺ 这样的阳离子，碳材料的结构有一定程度的“不规整”反而更好。",
    ref: "US 4,668,595, col. 6, ll. 52–56",
  },
  yoshinoCombination: {
    en: "The most desirable combination of electrodes is between a positive electrode made of the active material, AxMyNzO2, of this invention indicated as I and a negative electrode made of the active material of this invention indicated as II.",
    zh: "最理想的电极组合是：正极用本发明的活性物质 I（层状复合氧化物 AxMyNzO2），负极用本发明的活性物质 II（碳材料）。",
    ref: "US 4,668,595, col. 11, ll. 53–57",
  },

  facts: {
    tis2: "1976 年 Whittingham（Exxon）发表 Li/TiS₂ 可充电电池（第 2 章）。正极 TiS₂ 很好，问题在负极：金属锂反复沉积会长枝晶。到 1980 年，商品 Li/TiS₂ 电池只做到“纽扣”大小（Mizushima 原文 p. 783）。",
    bands: "Goodenough 在 MIT 林肯实验室（1952–1976）研究过渡金属氧化物的磁性和电子结构，熟悉“d 电子能级”和“氧的 2p 能带”。1980 年论文用化学语言写出了结论；能带图式的解释是他后来在综述里（如 2010 年与 Kim 合写的 Chem. Mater. 综述）系统讲清的。",
    oxford: "1976 年 Goodenough 到 Oxford 大学任无机化学实验室主任。1980 年 4 月投稿的 LiCoO₂ 论文，作者是访问学者水岛公一 (K. Mizushima)、本科生 P. C. Jones、P. J. Wiseman 和 Goodenough。经费来自美国空军和欧共体能源项目（原文致谢）。",
    licoo2Known: "LiCoO₂ 不是新化合物：1958 年 Johnston、Heikes 和 Sestrich 就研究过它的结构和导电性（原文 ref. 6）。Goodenough 团队的新意在于：把锂从里面抽出来，看结构还在不在。",
    route: "1970 年代的正极（TiS₂、V₂O₅、MoS₂……）都在“不含锂”的状态下合成，锂要靠金属锂负极提供。Mizushima 等 1980 年反过来：先在 900 °C 合成含锂的 LiCoO₂（放电态），再在室温下把锂电化学抽出。",
    ocvExp: "1980 年实验：约 20 mg LiCoO₂ 粉末压在不锈钢网上，电解液 1 M LiBF₄/PC，氩气手套箱。一开始用锂作对电极，但电压超过 4 V，怕电解液分解，改用 Li₀.₁V₂O₅ 作对电极和参比电极。",
    rocking: "1980 年前后 Armand 提出：负极也用嵌入化合物，锂离子在两个“宿主”之间来回，后来叫“摇椅电池” (rocking-chair battery)。同年 Lazzari 与 Scrosati 用 LixWO₂ 作负极做出了这样的电池（J. Electrochem. Soc. 127, 773）。",
    gic: "1840 年代人们就发现硫酸等能“钻进”石墨层间，形成石墨插层化合物 (GIC)。1950 年代起法国 Nancy 的 Hérold 学派系统研究碱金属–石墨化合物；1975 年 Guérard 与 Hérold 用化学方法制得 LiC₆（Yazami 原文 ref. 7）。",
    coint: "1970 年 Dey 与 Sullivan 发现：PC 在石墨电极上会持续分解、放出气体，石墨被破坏（这篇论文也被 Yoshino 专利引用）。1974 年起 Besenhard 等证明：Li⁺ 会带着溶剂分子一起挤进石墨，形成“三元”插层化合物。",
    yazami: "Yazami 与 Touzain 在法国 Grenoble 国立理工学院（INPG）工作，1982 年 6 月投稿，1983 年发表。他们借用了 Armand 1979 年提出的 PEO–锂盐固体电解质（第 3 章），HOPG 石墨由 Union Carbide 赠送。",
    yoshino: "吉野彰 (Akira Yoshino) 在旭化成 (Asahi Kasei) 工作。据他本人回忆：1981 年开始研究聚乙炔 (polyacetylene) 负极；1983 年把它和 Goodenough 的 LiCoO₂ 配在一起，做出原型电池；随后改用碳材料，1985 年 5 月在日本提出专利申请。",
    polyacetylene: "导电聚乙炔由白川英树、MacDiarmid 和 Heeger 在 1977 年报道（2000 年诺贝尔化学奖）。专利 col. 2 提到：导电高分子电极“循环性差、自放电大”，尚不实用。",
    patent: "日本优先权：1985 年 5 月 10 日起共 6 件；美国申请 1986 年 5 月 9 日；1987 年 5 月 26 日授权，20 项权利要求。专利首页引用了 Goodenough 的两件美国专利（4,302,518 与 4,357,215）。",
    nobel: "2019 年诺贝尔化学奖授予 Goodenough、Whittingham 和吉野彰，“表彰他们对锂离子电池发展的贡献”。Goodenough 时年 97 岁，是最年长的诺贝尔奖得主；他于 2023 年去世，享年 100 岁。",
    safety: "据吉野彰回忆，1986 年他们把原型电池送到测试场地，用重铁块砸电池：金属锂电池起火，碳负极的电池没有。这让人相信这种电池可以安全地商品化。",
  },

  corrections: [
    { head: "“Yoshino 1985 年用石油焦”不够准确", body: "专利 Example 1 用的是蒽油 1200 °C 碳化物，Example 11（第一个“碳 | LiCoO₂”例子）用气相生长碳纤维 (VGCF)。石油焦只是 claim 8 与 Examples 33–37 之一。准确说法：结晶度不高的多种碳。" },
    { head: "专利 Fig. 8、9 不是锂离子电池", body: "这两张常被引用的曲线来自 Example 42，负极是“a lithium piece”（col. 25, ll. 46–48），即金属锂。它们展示的是 Sn 掺杂 LiCoO₂ 正极本身的性能。" },
    { head: "专利里的数字前后不一", body: "Claim 1 写比表面积 0.2 < A < 100 m²/g，发明概要与 claims 19、20 写 0.1。Example 24 能量密度 121.6 Wh/kg 疑为 1216。Example 18 的 “alumina foil”“27 V” 应为铝箔、2.7 V。" },
    { head: "Mizushima 1980：x 的范围说多了", body: "标题与摘要写 0 < x ≤ 1，正文说锂可抽到 x = 0.067；但可逆性只测了 x = 0.99–0.5（p. 786），结论也只说“at least to x = 0.5”。后来证实实用上只能抽出约一半锂（约 140 mAh/g）。" },
    { head: "Yazami 1983：PEO 其实也“溶剂化”Li⁺", body: "PEO 正是靠醚氧配位 Li⁺ 才能溶解锂盐（第 3 章）。关键在于高分子链太大，进不了石墨层间。另：340 Ah/kg 按 LiC₆ 质量算；按碳质量算是 372 mAh/g。" },
    { head: "专利说“像石墨就不行”，真正原因是 PC", body: "专利把石墨失败归因于结晶度太高（col. 6），但它的电解液都是 PC 类，石墨在 PC 中会共嵌入、剥离。1990 年代改用 EC 电解液后，石墨成为主流负极（第 5 章）。" },
  ],
};
