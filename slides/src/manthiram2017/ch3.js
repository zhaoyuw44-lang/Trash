// Manthiram, Yu & Wang 2017 — Chapter 3: 聚合物、复合与薄膜固态电解质
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");
const { wrap } = require("./ch123_qa");

const PAPER = {
  short: "Manthiram et al., Nat. Rev. Mater. 2017",
  full: "Manthiram, Yu & Wang. Lithium battery chemistries enabled by solid-state electrolytes. Nature Reviews Materials 2, 16103 (2017). doi:10.1038/natrevmats.2016.103",
};

// Fig. 2 radar readings (0–3, outward = better), read off the original figure by eye (same scheme as chapter 2).
const RADAR_AXES = ["离子选择性", "还原稳定性", "氧化稳定性", "化学稳定性", "热稳定性", "力学性能", "加工成本", "器件集成", "离子 ASR", "电子 ASR"];
const RADAR = {
  oxide: [3.0, 2.4, 2.9, 2.0, 3.0, 2.0, 1.5, 1.0, 2.0, 2.8],
  thin: [3.0, 3.0, 3.0, 2.0, 2.5, 1.5, 0.6, 1.0, 2.0, 2.8],
  polymer: [1.5, 2.0, 1.5, 2.0, 1.0, 2.0, 2.7, 2.7, 1.0, 2.7],
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch3_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 3, chapterTitle: "聚合物、复合与薄膜固态电解质", figDir });
  d.registerFigs(info);
  const C = d.C;
  const { fig, chk, report } = wrap(d);
  const NB = " ";

  const radar = (s, box, series, colors, title) => {
    s.addChart(d.pres.charts.RADAR, series.map(([name, key]) => ({ name, labels: RADAR_AXES, values: RADAR[key] })), {
      ...box, radarStyle: "standard", chartColors: colors, lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 6,
      valAxisMaxVal: 3, valAxisMinVal: 0, valAxisMajorUnit: 1, valAxisHidden: true,
      catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
      valGridLine: { color: "D5DCE2", size: 1 },
      showTitle: true, title, titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
      showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    });
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 3 章\n软材料与薄膜电解质", { placeholder: "title" });
  s.addText("聚合物、复合与薄膜固态电解质：PEO 与锂盐 · 陶瓷填料 · LiPON · 原子层沉积", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 0.9, w: 4.3, h: 5.8 });
  s.addNotes("本章对应原文“Polymer and composite solid electrolytes”和“Thin-film solid electrolytes”两小节（第 4–5 页），以及 Table 1、Fig. 2 中“薄膜”和“聚合物”两项（Fig. 2e、f）。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "聚合物电解质", "三类之分 · PEO 抓 Li⁺ · 晶区与无定形区 · 锂盐"],
    ["2", "复合聚合物电解质", "活性与惰性填料 · 填料为什么有用"],
    ["3", "薄膜电解质", "为什么要薄 · 沉积方法 · LiPON · 原子层沉积"],
    ["4", "两张雷达图", "聚合物 vs 薄膜（原文 Fig. 2e, f）"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.0, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  chk("rm col", d.column(s, 7.5, 1.45, 5.25, [
    { kind: "def", head: "上一章回顾", body: "无机陶瓷和玻璃：电导可以很高、热稳定好，但又硬又脆、难加工，与电极的固–固接触差。" },
    { kind: "matters", head: "本章要回答", body: "能不能用“软”的材料来做固态电解质？软材料的电导为什么低？加陶瓷、做薄膜分别解决了什么问题？" },
  ], 0.4));
  s.addNotes("第 1 章讲过：高分子中的离子靠链段运动传输（Berthier 等 1983）。本章把这个机理落到具体材料上，并介绍另一条完全不同的思路：电导低没关系，把电解质做得极薄。");

  // ---------------- 3. Classes ----------------
  d.section("1 聚合物电解质");
  s = d.slide("CONTENT");
  s.addText("聚合物电解质的三类：干态、凝胶、复合", { placeholder: "title" });
  fig(s, "polymer_classes", { x: 0.5, y: 1.15, w: 12.3, h: 3.6 });
  const y3 = 4.8;
  chk("cl hist", d.block(s, { x: 0.6, y: y3, w: 3.9, kind: "hist", body: "1973 年 Wright 等发现 PEO–盐络合物（干态）；1975 年 Feuillade 与 Perche 提出凝胶电解质；1982 年 Weston 与 Steele 在 PEO 中加入陶瓷填料（复合）。" }));
  chk("cl why", d.block(s, { x: 4.72, y: y3, w: 3.9, kind: "why", body: "凝胶电导高，但含液体，本质上不是固态，原文因此不讨论。干态最“纯粹”，却室温电导太低；复合是两者之间的折中。" }));
  d.quote(s, { x: 8.84, y: y3, w: 3.9, en: "the polymer host together with a lithium salt act as a solid solvent (without any liquid)", zh: "高分子基体与锂盐一起充当“固体溶剂”（不含任何液体）。" });
  s.addNotes("“固体溶剂”的说法很形象：在液体电解质里，溶剂分子包围 Li+；在干态聚合物电解质里，是高分子链上的极性基团包围 Li+。今天商用锂离子电池里的“聚合物电池”大多是凝胶体系，不属于本章的固态电解质。");

  // ---------------- 4. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从 PEO 到 LiPON 与原子层沉积", { placeholder: "title" });
  fig(s, "timeline", { x: 0.5, y: 1.1, w: 12.3, h: 4.25 });
  chk("tl why", d.block(s, { x: 0.6, y: 5.35, w: 5.9, kind: "why", tint: true, body: "两条路线并行：青色/紫色线让“软”材料导电更好（链段运动、填料）；橙色线干脆把电解质做薄，用厚度换电阻。" }));
  chk("tl matters", d.block(s, { x: 6.8, y: 5.35, w: 5.95, kind: "matters", tint: true, body: "1978 年 Armand 的提议让 PEO 成为锂电池的第一种固态电解质；1992 年的 LiPON 至今仍是薄膜电池的标准电解质。" }));
  s.addNotes("时间轴不按比例。Armand 的提议发表于 1978 年在苏格兰圣安德鲁斯召开的固体电解质国际会议（会议文集 1979 年出版）。Croce 等 1998 年在 Nature 上报道：加入纳米 TiO2、Al2O3 的 PEO–LiClO4 电解质，在较低温度下电导明显提高。");

  // ---------------- 5. PEO coordination ----------------
  s = d.slide("CONTENT");
  s.addText("PEO 为什么能“溶解”锂盐", { placeholder: "title" });
  fig(s, "peo_coord", { x: 0.5, y: 1.2, w: 6.6, h: 4.6 });
  chk("peo col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1967 年 Pedersen 发现冠醚能牢牢“抱住”碱金属离子（1987 年诺贝尔化学奖）。1973 年 Wright 发现长链 PEO 也能络合碱金属盐，1978 年 Armand 提议把它用作锂电池电解质。" },
    { kind: "why", body: "PEO 的醚氧给电子能力强、链又柔顺，能像冠醚一样包住 Li⁺，把锂盐“溶解”在固体里，不需要任何液体溶剂。" },
    { kind: "matters", body: "原文 Table 1：PEO 对锂金属稳定、柔韧、易做成大面积膜，至今仍是最常用的聚合物基体。" },
  ]));
  s.addNotes("PEO 每个重复单元 –CH2–CH2–O– 都有一个醚氧，相邻醚氧的间距正好适合从多个方向配位同一个 Li+。常用配比用 EO:Li 表示，例如 EO:Li = 20:1。阴离子不被醚氧配位，留在链外。");

  // ---------------- 6. Crystalline vs amorphous ----------------
  s = d.slide("CONTENT");
  s.addText("PEO 的软肋：室温下一半是“冰”", { placeholder: "title" });
  fig(s, "peo_phase", { x: 0.5, y: 1.2, w: 6.6, h: 4.45 });
  chk("ph col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1983 年 Berthier、Armand 等用核磁共振证明：Li⁺ 主要在无定形区传导，晶区几乎不贡献电导。" },
    { kind: "why", body: "PEO 是半结晶高分子，熔点约 65 °C。室温下晶区占很大比例，所以 PEO 电池常要加热到 60–80 °C 使用（Table 1：10⁻⁴ S cm⁻¹，65–78 °C）。" },
    { kind: "matters", body: "提高室温电导的思路几乎都是“破坏结晶”：共聚、交联、加增塑剂，或者加陶瓷填料（本章第 2 节）。" },
  ]));
  d.quote(s, { y: 5.95, en: "However, the ionic conductivity of dry polymer systems is very low at ambient temperatures.", zh: "然而，干态聚合物体系在室温下的离子电导率非常低。" });
  s.addNotes("曲线为定性示意：低于熔点时电导随温度缓慢上升；在熔点附近晶区熔化，电导跃升；之后按链段运动的规律（常用 VTF 方程描述）继续上升。PEO 的玻璃化转变温度约 −60 °C，所以无定形区在室温下是“活”的。");

  // ---------------- 7. Salt ----------------
  s = d.slide("CONTENT");
  s.addText("锂盐：自由离子越多越好", { placeholder: "title" });
  fig(s, "salt_dissoc", { x: 0.5, y: 1.2, w: 6.6, h: 4.3 });
  chk("salt col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "早期 PEO 电解质多用 LiClO₄、LiCF₃SO₃。1990 年代起，Armand 等推广了大而“软”的 TFSI⁻ 阴离子（LiTFSI），它易解离，还能抑制 PEO 结晶。" },
    { kind: "why", body: "高分子的介电常数比液体溶剂低得多，锂盐容易结成离子对。换用电荷更分散的大阴离子，自由离子就更多。" },
    { kind: "matters", body: "原文：自由离子的数量取决于锂盐在聚合物中的解离能力。注意 PEO–LiTFSI 中 Li⁺ 迁移数 (transference number) 通常只有约 0.2。" },
  ]));
  s.addNotes("迁移数 t+ 表示总电流中由 Li+ 携带的比例。Li+ 被醚氧紧紧抓住、走得慢；大阴离子反而跑得快。阴离子在电极附近堆积会形成浓差极化，这是聚合物电解质的另一个问题。");

  // ---------------- 8. Other hosts ----------------
  s = d.slide("CONTENT");
  s.addText("除了 PEO：PAN、PMMA、PVC、PVDF", { placeholder: "title" });
  fig(s, "hosts", { x: 0.5, y: 1.15, w: 12.3, h: 3.0 });
  const y8 = 4.4;
  chk("h hist", d.block(s, { x: 0.6, y: y8, w: 3.9, kind: "hist", body: "原文引用：PMMA（Iijima 等 1985）、PAN（Abraham 与 Alamgir 1990）、PVC（1993）、PVDF（1995）。1996 年 Bellcore 用 PVDF-HFP 做出“塑料锂离子电池”。" }));
  chk("h why", d.block(s, { x: 4.72, y: y8, w: 3.9, kind: "why", body: "这些高分子都含有能与 Li⁺ 作用的极性基团。它们单独与锂盐配对时电导很低，多用作凝胶或复合电解质的基体。" }));
  chk("h matters", d.block(s, { x: 8.84, y: y8, w: 3.9, kind: "matters", body: "原文：复合电解质的基体常用 PEO、PAN、PMMA、PVC 或 PVDF，其中 PEO 用得最多。" }));
  s.addNotes("几个缩写：PAN 聚丙烯腈，PMMA 聚甲基丙烯酸甲酯（有机玻璃），PVC 聚氯乙烯，PVDF 聚偏氟乙烯，HFP 指六氟丙烯共聚单元。原文第 2 页提到这些高分子在 PEO 之后被陆续用于“全固态聚合物锂离子电池”，但其中很多实际工作是凝胶体系。");

  // ---------------- 9. PEO radar ----------------
  s = d.slide("CONTENT");
  s.addText("原文 Fig. 2f：聚合物电解质的长板与短板", { placeholder: "title" });
  radar(s, { x: 0.45, y: 1.15, w: 6.6, h: 5.0 }, [["聚合物（Fig. 2f）", "polymer"], ["氧化物（Fig. 2a，参照）", "oxide"]], [HEX.accent2, HEX.accent6], "聚合物 vs 氧化物");
  d.caption(s, "数值按原图目测（0–3 级，越外越好），仅示意。", { x: 0.6, y: 6.25, w: 6.4 });
  chk("pr col", d.column(s, 7.35, 1.3, 5.4, [
    { kind: "def", head: "Table 1 · 聚合物 (PEO)", body: "优点：对 Li 稳定；柔韧；易做成大面积膜；剪切模量低（与电极贴合好）。\n缺点：热稳定性有限；氧化电压低（< 4 V）。" },
    { kind: "why", body: "雷达图上，聚合物在“加工成本”和“器件集成”上远胜氧化物，在“离子 ASR”“热稳定性”和“离子选择性”上明显落后。" },
    { kind: "matters", body: "氧化电压低于 4 V，意味着 PEO 难以搭配 LiCoO₂ 等高电压正极，只能配 LiFePO₄（第 4 章）。" },
  ], 0.2));
  s.addNotes("离子选择性差，是因为 PEO 中阴离子也能移动，甚至比 Li+ 跑得更快（迁移数约 0.2）。剪切模量低既是优点（贴合电极），也是缺点（挡不住锂枝晶）。");

  // ---------------- 10. Fillers ----------------
  d.section("2 复合聚合物电解质");
  s = d.slide("CONTENT");
  s.addText("复合电解质：往高分子里加陶瓷", { placeholder: "title" });
  fig(s, "fillers", { x: 0.5, y: 1.2, w: 6.6, h: 4.0 });
  chk("f col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1973 年 Liang 发现：在 LiI 中加入 Al₂O₃ 反而让电导提高（“复合效应”）。1982 年 Weston 与 Steele 把惰性填料加入 PEO，1998 年 Croce、Scrosati 等改用纳米颗粒，室温附近电导明显提高。" },
    { kind: "why", body: "原文的解释：填料降低了玻璃化转变温度，从而提高电导。基体常用 PEO、PAN、PMMA、PVC 或 PVDF。" },
    { kind: "matters", body: "复合让聚合物同时变得“更导电、更硬、更耐热”，是本章三条路线中最活跃的一条。" },
  ]));
  d.quote(s, { y: 5.6, en: "Active filler materials … are partially involved in ionic conduction, whereas inactive filler materials … do not participate in ionic transport.", zh: "活性填料部分参与离子传导，而惰性填料不参与离子传输。" });
  s.addNotes("原文举的例子：活性填料 Li2N（应为 Li3N，见校注）和 LiAlO2；惰性填料 Al2O3、SiO2、MgO。今天常用的活性填料还有 LLZO、LLTO 等快离子导体陶瓷颗粒或纳米线。");

  // ---------------- 11. Filler mechanisms ----------------
  s = d.slide("CONTENT");
  s.addText("填料为什么有用：三种作用 + 一条“高速路”", { placeholder: "title" });
  fig(s, "filler_mech", { x: 0.5, y: 1.2, w: 6.6, h: 4.25 });
  chk("fm col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "2015 年，Cui 组把 LLTO 纳米线加入 PAN–锂盐，室温电导提高约三个数量级；2016 年，Hu 组等用三维石榴石纳米纤维网络制成柔性复合膜。" },
    { kind: "why", body: "以前的填料是分散的颗粒，Li⁺ 只能在颗粒表面附近受益。纳米线和三维网络把快离子导体连成连续通道，Li⁺ 可以一路“跑”过去。" },
    { kind: "matters", body: "高分子提供柔韧和界面贴合，陶瓷提供电导和强度。第 4 章的“高分子/陶瓷/高分子”三明治电解质也是同一思路。" },
  ]));
  s.addNotes("图中三种作用：①填料表面的路易斯酸位与阴离子作用，促进锂盐解离；②填料表面附近高分子链不易排列结晶，形成无定形层；③力学增强。原文只提到降低玻璃化转变温度这一种解释，学界更常强调①②两点（见校注）。");

  // ---------------- 12. Thin films: why thin ----------------
  d.section("3 薄膜固态电解质");
  s = d.slide("CONTENT");
  s.addText("薄膜思路：电导低？那就做薄", { placeholder: "title" });
  const asr = [
    ["LiPON 薄膜 1 μm", 50, HEX.accent1],
    ["PEO 膜 50 μm，70 °C", 50, HEX.accent2],
    ["LLZO 陶瓷片 0.5 mm", 167, HEX.accent3],
    ["PEO 膜 50 μm，室温", 5e4, HEX.accent4],
    ["LiPON 若做成 1 mm 厚片", 5e4, HEX.accent6],
  ];
  s.addChart(d.pres.charts.BAR, [{ name: "ASR", labels: asr.map((a) => `${a[0]}  ${a[1] >= 1e4 ? "5×10⁴" : a[1]}`), values: asr.map((a) => a[1]) }], {
    x: 0.5, y: 1.2, w: 7.0, h: 4.6, barDir: "bar", chartColors: asr.map((a) => a[2]),
    valAxisLogScaleBase: 10, valAxisMinVal: 1, valAxisMaxVal: 1e6, valAxisLabelFormatCode: "0E+0",
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelFontSize: 11, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "示意计算：面电阻 ASR（Ω cm²，对数坐标）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", showLegend: false,
  });
  d.caption(s, "ASR = 厚度 ÷ 电导率。取 σ：LiPON 2×10⁻⁶，PEO 室温 10⁻⁷、70 °C 10⁻⁴，LLZO 3×10⁻⁴ S cm⁻¹（量级估计）。", { x: 0.6, y: 5.9, w: 6.9, h: 0.5 });
  chk("tf col", d.column(s, 7.85, 1.3, 4.9, [
    { kind: "hist", body: "原文：薄膜电解质始于 1980 年代，起始材料有 Li–Si–P–O 氧化物、Li₄P₂S₇ 和 Li₃PO₄–P₂S₅ 等。日本日立公司的 Kanehori 等在 1980 年代初做出了早期的薄膜锂电池。" },
    { kind: "why", body: "电阻正比于厚度。LiPON 电导比 LLZO 低两个数量级，但做成 1 μm 薄膜后，面电阻反而比 0.5 mm 的 LLZO 片还小。" },
    { kind: "matters", body: "薄膜让“电导低但很稳定”的材料也能用。代价是：只能做小容量的微型电池（第 4 章）。" },
  ], 0.18));
  s.addNotes("算一算：LiPON 1 μm = 10⁻⁴ cm，ASR = 10⁻⁴ ÷ (2×10⁻⁶) = 50 Ω cm²。同样的材料做成 1 mm 厚，ASR 变成 5×10⁴ Ω cm²，根本没法用。50 μm 的 PEO 膜在 70 °C 下 ASR 也约 50 Ω cm²，这就是 PEO 电池要加热的原因。");

  // ---------------- 13. Deposition ----------------
  s = d.slide("CONTENT");
  s.addText("怎样做出微米级的电解质：气相沉积", { placeholder: "title" });
  fig(s, "deposition", { x: 0.5, y: 1.15, w: 12.3, h: 3.3 });
  const y13 = 4.65;
  chk("dep hist", d.block(s, { x: 0.6, y: y13, w: 3.9, kind: "hist", body: "溅射现象在 19 世纪中叶就被观察到；脉冲激光沉积在 1987 年因制备高温超导薄膜而流行；原子层沉积由芬兰的 Suntola 于 1974 年发明。" }));
  chk("dep why", d.block(s, { x: 4.72, y: y13, w: 3.9, kind: "why", body: "陶瓷粉末压片最薄也要几十微米。气相沉积是原子或分子一层层“落”到基底上，可以做到微米甚至纳米厚，而且致密无孔。" }));
  chk("dep matters", d.block(s, { x: 8.84, y: y13, w: 3.9, kind: "matters", body: "原文列出的三种“特殊气相沉积技术”：脉冲激光沉积、射频溅射、化学气相沉积；原子层沉积则是最新的“首选工艺”。" }));
  s.addNotes("射频溅射：用等离子体中的离子轰击靶材，把靶材原子“打”下来沉积到基底上；做 LiPON 时靶材是 Li3PO4，气氛是氮气。脉冲激光沉积：用强激光把靶材瞬间蒸发成羽辉。化学气相沉积：气态前驱体在基底表面反应成膜。");

  // ---------------- 14. LiPON ----------------
  s = d.slide("CONTENT");
  s.addText("LiPON：薄膜电池的标准电解质", { placeholder: "title" });
  fig(s, "lipon", { x: 0.5, y: 1.2, w: 6.6, h: 4.35 });
  chk("lp col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: `1992 年，美国橡树岭国家实验室 (ORNL) 的 Bates、Dudney 等在氮气中射频溅射 Li₃PO₄ 靶，得到 LiPON，25 °C 电导约 2×10⁻⁶${NB}S${NB}cm⁻¹。` },
    { kind: "why", body: "纯 Li₃PO₄ 薄膜电导更低。N 取代部分 O，把孤立的 PO₄ 连成交联网络，Li⁺ 更好走，结构和化学稳定性也更好。" },
    { kind: "matters", body: "Table 1：LiPON 对锂金属和正极材料都稳定，电化学窗口可达约 5 V，缺点是大规模生产昂贵。" },
  ], 0.18));
  d.quote(s, { y: 5.85, en: "In the 1990s, Oak Ridge National Laboratory reported an important advance for a LiPON‑based thin-film solid electrolyte, which was then the standard electrolyte for thin-film batteries", zh: "1990 年代，橡树岭国家实验室报道了 LiPON 基薄膜固态电解质的重要进展，此后它成为薄膜电池的标准电解质。" });
  s.addNotes("LiPON 的名字来自 Li、P、O、N 四种元素，ORNL 后来报道的典型组成约为 Li2.9PO3.3N0.46。它是非晶态的，没有晶界，表面平整，又硬又致密。第 4 章会讲到：它的高弹性模量和硬度还能抵挡锂枝晶。");

  // ---------------- 15. Thin-film battery ----------------
  s = d.slide("CONTENT");
  s.addText("薄膜电池长什么样", { placeholder: "title" });
  fig(s, "tfb", { x: 0.5, y: 1.25, w: 6.6, h: 4.0 });
  chk("tfb col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1990 年代，ORNL 用 LiPON 做出 Li/LiPON/LiCoO₂ 等全薄膜电池，技术后来授权给多家公司生产微型电池。" },
    { kind: "why", body: "所有层都用气相沉积一层层“长”出来，不需要粘结剂、导电剂和液体，Li⁺ 只需穿过约 1 μm 的电解质。" },
    { kind: "matters", body: "第 4 章会看到：LiPON 薄膜电池可循环一万次以上，但容量只有 0.1 μAh 到 10 mAh，适合芯片、传感器、医疗植入物等微型器件。" },
  ]));
  d.block(s, { x: 0.6, y: 5.5, w: 6.5, kind: "def", tint: true, head: "原文要点", body: "锂硼酸盐、磷酸盐和硼磷酸盐玻璃薄膜被视为 LiPON 的潜在替代者，在工业制造上有优势。" });
  s.addNotes("示意图中各层厚度为典型量级，不同器件差别很大。硼磷酸盐玻璃薄膜（如引文 129，2013 年）的一个卖点是能经受电子工业中的回流焊高温，便于直接焊在电路板上。");

  // ---------------- 16. ALD ----------------
  s = d.slide("CONTENT");
  s.addText("原子层沉积：一层一层地“长”电解质", { placeholder: "title" });
  fig(s, "ald", { x: 0.5, y: 1.2, w: 6.6, h: 4.15 });
  chk("ald col", d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1974 年 Suntola 在芬兰发明原子层外延（后称原子层沉积，ALD），最早用于平板显示。2010 年代被用来沉积 Li–La–Ti–O、Li₃PO₄、Li–Al–O 等；2015 年 Kozen 等实现 ALD LiPON。" },
    { kind: "why", body: "溅射是“视线沉积”，凹凸表面的背面和深孔里镀不上。ALD 靠表面自限制反应，再复杂的三维表面也能均匀包覆。" },
    { kind: "matters", body: "三维微电池（把电极做成柱阵列或多孔结构）需要在弯弯曲曲的表面上镀一层无孔电解质，ALD 几乎是唯一选择。" },
  ], 0.18));
  d.quote(s, { y: 5.85, en: "Recently, atomic layer deposition has emerged as the premier deposition process for the fabrication of uniform, conformal, thin films.", zh: "近来，原子层沉积已成为制备均匀、保形薄膜的首选沉积工艺。" });
  s.addNotes("ALD 的代价是慢：每个循环只长约 0.1 nm，镀 100 nm 就要上千个循环。所以它更适合做超薄的电解质层或电极表面的保护涂层（第 4 章的界面修饰）。");

  // ---------------- 17. Radar thin film vs polymer ----------------
  d.section("4 两张雷达图");
  s = d.slide("CONTENT");
  s.addText("原文 Fig. 2e, f：薄膜与聚合物，几乎互补", { placeholder: "title" });
  radar(s, { x: 0.45, y: 1.15, w: 6.6, h: 5.1 }, [["薄膜（Fig. 2e）", "thin"], ["聚合物（Fig. 2f）", "polymer"]], [HEX.accent3, HEX.accent2], "薄膜 vs 聚合物");
  d.caption(s, "数值按原图目测（0–3 级，越外越好），仅示意。", { x: 0.6, y: 6.3, w: 6.4 });
  chk("rd col", d.column(s, 7.35, 1.3, 5.4, [
    { kind: "why", body: "薄膜：稳定性全面领先（还原、氧化、离子选择性），但加工成本最差、难以集成到大电池。聚合物正好相反：便宜好加工，稳定性和离子 ASR 差。" },
    { kind: "matters", body: "这张对比解释了为什么薄膜电解质用于微电池，聚合物用于大面积软包，而复合电解质试图兼得两者之长。" },
    { kind: "def", head: "顺带一提", body: "两者的“电子 ASR”都很好：薄膜和高分子都几乎不导电子，这是固态电解质的共同优点。" },
  ], 0.22));
  s.addNotes("注意“离子 ASR”一项：薄膜材料本身电导低，但因为极薄，面电阻并不差（雷达图上居中）；聚合物电导在室温下太低，所以靠内。与第 2 章的氧化物、硫化物雷达图对照着看，能更清楚地看到各家族的取舍。");

  // ---------------- 18. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：化学式、引用与机理", { placeholder: "title" });
  chk("e1", d.block(s, { x: 0.6, y: 1.35, w: 5.9, kind: "note", tint: true, head: "① 第 4 页：活性填料 “Li₂N”", body: "应为 Li₃N（氮化锂）。Li₃N 是经典的快 Li⁺ 导体（1970 年代报道，室温约 10⁻³ S cm⁻¹ 量级），“Li₂N”不是稳定化合物，且电荷不平衡。" }));
  chk("e2", d.block(s, { x: 6.85, y: 1.35, w: 5.9, kind: "note", tint: true, head: "② 第 5 页：薄膜起始材料 “Li₁₂Si₃P₂O₂₀”", body: "电荷不平衡：12 + 3×4 + 2×5 = 34 ≠ 2×20 = 40。很可能应为 Li₁₈Si₃P₂O₂₀，即 Li₃.₆Si₀.₆P₀.₄O₄（Li₄SiO₄–Li₃PO₄ 固溶体，日立早期薄膜电池所用）。" }));
  chk("e3", d.block(s, { x: 0.6, y: 3.6, w: 5.9, kind: "note", tint: true, head: "③ 第 4 页：引用与内容不符", body: "“干态聚合物电解质（不含任何液体）”引用 101–104，其中 102–104 讲的都是凝胶电解质；复合电解质机理引用的 106、107 是质子导体（含 Nafion/SiO₂ 燃料电池膜）。" }));
  chk("e4", d.block(s, { x: 6.85, y: 3.6, w: 5.9, kind: "note", tint: true, head: "④ 第 4 页：填料“降低玻璃化转变温度”", body: "说法偏窄。主流解释（如 Croce 等 1998）强调填料抑制 PEO 结晶、表面路易斯酸–碱作用促进锂盐解离；不少体系中 Tg 变化很小。" }));
  s.addNotes("①③可以从化学常识和原文参考文献直接核对。②依据电荷守恒推断，对应的正确组成把握中等。④不是错误，而是解释不完整，讲课时提醒学生即可。");

  // ---------------- 19. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["聚合物 = 固体溶剂", "PEO 的醚氧像冠醚一样抓住 Li⁺；Li⁺ 随链段运动在无定形区跳跃；自由离子数取决于锂盐解离"],
    ["PEO 的短板", "室温结晶、电导低（需 60–80 °C）；氧化电压 < 4 V；Li⁺ 迁移数低"],
    ["复合：加陶瓷", "活性填料参与导电、惰性填料只“帮忙”；纳米线与三维网络修出连续通道"],
    ["薄膜：用厚度换电阻", "气相沉积做出 1 μm 级的 LiPON，稳定、致密，成为微电池标准；ALD 可包覆三维结构"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Solid polymer electrolytes overcome some of the limitations of the inorganic solid-state electrolytes … but they have narrow electrochemical stability windows and low ionic conductivity (at room temperature)”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "固态聚合物电解质克服了无机固态电解质的一些局限……但其电化学稳定窗口窄、室温离子电导率低。（原文“结论”一节）", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章进入“电池篇”：用第 2、3 章的电解质组装全固态锂离子电池，看看固–固界面带来了哪些新问题。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  report();
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
