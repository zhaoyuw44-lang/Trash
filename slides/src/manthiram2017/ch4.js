// Manthiram, Yu & Wang 2017 — Chapter 4: 全固态锂离子电池
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Manthiram et al., Nat. Rev. Mater. 2017",
  full: "Manthiram, Yu & Wang. Lithium battery chemistries enabled by solid-state electrolytes. Nature Reviews Materials 2, 16103 (2017). doi:10.1038/natrevmats.2016.103",
};

const NB = " ";

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch4_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 4, chapterTitle: "全固态锂离子电池", figDir });
  d.registerFigs(info);
  const C = d.C;
  const card = (s, x, y, w, h, fill) => s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 4 章\n把电池“全部做成固体”会怎样？", { placeholder: "title" });
  s.addText("全固态锂离子电池：电池结构 · 固–固界面 · 聚合物电池与薄膜电池", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.8, y: 0.9, w: 3.9, h: 5.6 });
  s.addNotes("本章对应原文“Batteries with solid electrolytes”下的第一部分“All-solid-state lithium-ion batteries”（第 5–6 页，含 Fig. 3 和 Table 2 前四行）。前三章讲的是固态电解质“材料”本身；从这一章起，我们看这些材料装进电池以后会遇到什么问题。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "两种全固态电池", "无机陶瓷型 vs 聚合物型（Fig. 3）"],
    ["2", "固–固界面：头号难题", "接触、力学、空间电荷层、界面反应"],
    ["3", "已经“能用”的两条路线", "PEO + LiFePO₄ 电池、LiPON 薄膜电池"],
    ["4", "现状与出路", "Table 2 的数据与一张“对策地图”"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08, "F5F7F9");
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.0, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.column(s, 7.4, 1.45, 5.35, [
    { kind: "def", tint: true, head: "承上启下", body: "第 2、3 章：无机、聚合物、复合与薄膜电解质各自的电导率和稳定性（材料层面）。\n本章：把它们装进电池以后，真正卡脖子的是“电极 | 电解质”这个界面（器件层面）。" },
    { kind: "def", tint: true, head: "本章对应原文", body: "第 5–6 页 “All-solid-state lithium-ion batteries”；Fig. 3；Table 2 中全固态电池的四行。另补充原文引用但没有展开的“空间电荷层”和“缓冲包覆层”。" },
  ], 0.35);
  s.addNotes("读这一章时，请一直带着一个问题：液体电解质会自己流进每一个缝隙，固体不会，那 Li⁺ 怎么从电极进到电解质里？几乎所有难题都从这里来。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：全固态锂电池走过的路", { placeholder: "title" });
  d.fig(s, "ass_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.block(s, { x: 0.6, y: 5.35, w: 5.9, kind: "why", tint: true, body: "以前：固态锂电池只出现在“小电流”场合，如心脏起搏器、薄膜微电池。后来硫化物电解质的电导率追上了液体，大家才开始认真考虑把它做成电动车用的大电池。" });
  d.block(s, { x: 6.8, y: 5.35, w: 5.95, kind: "matters", tint: true, body: "电导率问题基本解决之后，剩下的主要矛盾就变成了界面，也就是本章的主角。" });
  s.addNotes("时间轴不按比例。灰色：早期应用；青色：聚合物路线；橙色：LiPON 薄膜路线；紫色：无机（硫化物/氧化物）块体路线。Li–I₂ 起搏器电池中的 LiI 是电池放电时在锂和碘之间原位生成的固体电解质，电流极小但非常可靠。Takada 2003、Ohta 2006、Li & Dudney 2015、Kato 2016 都在本文参考文献里（Refs 146、149、159、5）。");

  // ---------------- 4. Section ----------------
  d.section("1 两种全固态电池");
  s = d.slide("DARK_SECTION");
  s.addText("1  两种全固态电池", { placeholder: "title" });
  s.addText("无机陶瓷电解质：颗粒堆出来的电池  ·  聚合物电解质：像胶带一样能卷起来的电池", { placeholder: "body" });
  s.addNotes("原文按电解质种类把全固态锂离子电池分成两类：无机固态电解质电池和聚合物电池（Fig. 3a 和 3b）。");

  // ---------------- 5. Inorganic cell ----------------
  s = d.slide("CONTENT");
  s.addText("无机全固态电池：电解质既导离子，又当隔膜", { placeholder: "title" });
  d.fig(s, "inorganic_cell", { x: 0.45, y: 1.2, w: 6.95, h: 4.85 });
  d.caption(s, "据原文 Fig. 3a 重绘。原图绿/蓝/灰球分别为负极活性物质、正极活性物质和固态电解质，这里改用青/橙/灰。", { x: 0.55, y: 6.1, w: 6.8, h: 0.5 });
  d.column(s, 7.65, 1.3, 5.1, [
    { kind: "hist", body: "2000 年代起，大阪府立大学 Tatsumisago、Hayashi 组和日本 NIMS 的 Takada 组用硫化物玻璃电解质做出“块体型” bulk-type 全固态电池：把粉末混合、冷压成片。" },
    { kind: "why", body: "液体电池：电解液自己渗进多孔电极。固体做不到，只能把电解质磨成粉，和活性物质混在一起压实，在电极内部铺出 Li⁺ 的“接力”通道。" },
    { kind: "matters", body: "正极材料和液态电池差不多（层状氧化物、硫化物）；负极可用锂金属、锂合金或石墨。换的只是电解质，难点也就集中在电解质与电极的接触上。" },
  ], 0.18);
  d.quote(s, { x: 7.65, w: 5.1, en: "The solid electrolyte not only sustains lithium-ion conduction but also acts as the battery separator.", zh: "固态电解质不仅承担锂离子传导，还充当电池的隔膜。" });
  s.addNotes("Li⁺ 必须在电解质颗粒之间一个接一个地“跳”过去，所以颗粒之间、颗粒与活性物质之间的每一个接触点都很重要。原文说无机电解质一般稳定、不可燃，被视为解决锂离子电池安全问题的“终极方案”；但 LATP 是例外，它的电化学窗口偏窄，第 5 章锂硫电池会再遇到它。");

  // ---------------- 6. Composite cathode ----------------
  s = d.slide("CONTENT");
  s.addText("复合正极：活性物质的比例被“挤”低了", { placeholder: "title" });
  d.fig(s, "composite_cathode", { x: 0.45, y: 1.2, w: 7.35, h: 4.6 });
  d.column(s, 8.0, 1.3, 4.75, [
    { kind: "hist", body: "2004 年 Takahara 等在氧硫化物玻璃全固态电池的正极中添加碳、并给颗粒包碳，改善电子通路（本文 Ref. 144）。从那以后，“活性物质 + 电解质 + 导电碳”三相复合成了标准做法。" },
    { kind: "why", body: "液态电池正极里约 95% 是活性物质。全固态电池必须额外混入大量电解质颗粒来运 Li⁺，否则颗粒内部的锂“出不来”。" },
    { kind: "matters", body: "原文列出的四大难题之一就是“电极活性物质的质量占比低”：电解质占了重量却不储能，电池整体的能量密度被拉低。" },
  ], 0.18);
  d.quote(s, { y: 6.15, en: "Several key challenges remain to be addressed: for example, volume change in the electrode materials, large interfacial (electrode/electrolyte) resistance, low mass ratio of the electrode-active materials and poor cycling stability.", zh: "仍有几个关键难题有待解决：电极材料的体积变化、电极/电解质界面电阻大、电极活性物质质量占比低，以及循环稳定性差。" });
  s.addNotes("复合正极里有三张网：活性物质储锂，固态电解质颗粒连成的离子网，导电碳连成的电子网。任何一个活性颗粒如果没同时接上两张网，就成了“死”材料。图中红圈标出的空隙就是断路点。图中质量占比是文献中常见的典型值，只用来说明趋势，不是原文数据。");

  // ---------------- 7. Polymer cell ----------------
  s = d.slide("CONTENT");
  s.addText("聚合物全固态电池：柔软、好加工", { placeholder: "title" });
  d.fig(s, "polymer_roll", { x: 0.45, y: 1.3, w: 6.75, h: 3.6 });
  d.caption(s, "据原文 Fig. 3b 重绘：薄膜状的聚合物电解质同时充当隔膜，整卷电池像胶带一样柔软。", { x: 0.55, y: 4.95, w: 6.6, h: 0.5 });
  d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1973 年 Wright 等发现 PEO 与碱金属盐的配合物能导离子；1978 年前后 Armand 提出把它用作电池电解质。2011 年起，法国 Bolloré 的 Bluecar 共享电动车使用 PEO 基锂金属聚合物电池，工作温度约 60–80 °C。" },
    { kind: "why", body: "以前：陶瓷硬而脆，难做大面积、难贴合电极。聚合物像塑料膜一样能涂布、卷绕，和电极接触好，所以成了最早走向商用的全固态路线。" },
    { kind: "matters", body: "缺点同样明显：界面不稳定、工作温度范围窄、机械强度弱（原文）。PEO 的室温电导率太低，所以要加热运行。" },
  ], 0.18);
  d.quote(s, { y: 5.85, x: 0.6, w: 6.6, en: "A PEO electrolyte is still the best option owing to its high ionic conductivity and good stability in the presence of lithium metal.", zh: "PEO 电解质仍是最佳选择，因为它离子电导率较高，且与锂金属接触时稳定。" });
  s.addNotes("原文对聚合物电池的评价：易制造、安全性高、形状灵活；缺点是电极/电解质界面不稳定、工作温度窄、机械稳定性弱。Table 1 给出的 PEO 电导率是 10⁻⁴ S cm⁻¹（65–78 °C），所以实际电池要在加热条件下运行。");

  // ---------------- 8. PEO window ----------------
  s = d.slide("CONTENT");
  s.addText("为什么 PEO 电池几乎都配 LiFePO₄？", { placeholder: "title" });
  d.fig(s, "peo_window", { x: 0.5, y: 1.2, w: 6.0, h: 5.25 });
  d.caption(s, "电位为常见近似值；PEO 氧化电压“< 4 V”取自原文 Table 1。", { x: 0.6, y: 6.5, w: 5.9 });
  d.column(s, 6.9, 1.3, 5.85, [
    { kind: "def", head: "电化学窗口 Electrochemical window", body: "电解质在这个电压范围内既不被氧化、也不被还原。正极充电时的电位必须落在窗口上限以内。" },
    { kind: "hist", body: "1997 年 Padhi、Goodenough 等报道 LiFePO₄ 正极，电位约 3.4 V，结构非常稳定。它后来成了 PEO 聚合物电池的“标准搭档”。" },
    { kind: "why", body: "LiCoO₂ 要充到约 4.2 V，LiNi₀.₅Mn₁.₅O₄ 要到约 4.7 V，都超出了 PEO 的耐氧化能力，PEO 会在正极表面分解。只好退而求其次，用电压较低的 LiFePO₄。" },
    { kind: "matters", body: "电压低 = 能量低。这正是聚合物路线的天花板，也是后面“聚合物 + 陶瓷”复合方案的动机。" },
  ], 0.16);
  s.addNotes("原文原话：高能量密度正极（如 LiCoO₂ 和 LiNi₀.₅Mn₁.₅O₄）不能用于 PEO 基电池，因为 PEO 电解质的电化学稳定性低，所以一般配 LiFePO₄。负极一侧 PEO 对锂金属稳定，所以 PEO 电池通常是“锂金属 | PEO | LiFePO₄”。");

  // ---------------- 9. Section ----------------
  d.section("2 固–固界面");
  s = d.slide("DARK_SECTION");
  s.addText("2  固–固界面：全固态电池的头号难题", { placeholder: "title" });
  s.addText("接触面积  ·  体积变化与力学  ·  空间电荷层  ·  界面反应与缓冲层", { placeholder: "body" });
  s.addNotes("原文强调：虽然一些无机电解质的电导率已与液体相当，但全固态电池的性能仍不如商用锂离子电池，症结在电极/电解质界面。");

  // ---------------- 10. Contact ----------------
  s = d.slide("CONTENT");
  s.addText("问题一：固体之间只有“点接触”", { placeholder: "title" });
  d.fig(s, "contact", { x: 0.45, y: 1.2, w: 7.35, h: 4.3 });
  d.column(s, 8.05, 1.3, 4.7, [
    { kind: "hist", body: "2010 年 Sakuda 等用透射电镜看到 LiCoO₂ 与 Li₂S–P₂S₅ 之间元素互相扩散形成的界面层（Ref. 137）。" },
    { kind: "why", body: "液体电池里“接触”从来不是问题。换成固体以后，接触面积直接决定界面电阻：接触点越少，Li⁺ 能走的“门”越少。" },
    { kind: "matters", body: "原文把好界面拆成三件事（图下方三个标签），下面几页逐一展开。" },
  ], 0.18);
  d.quote(s, { y: 5.7, x: 0.6, w: 12.15, en: "To overcome the key problem of how to fabricate a favourable solid/solid interface between the solid electrode and the solid electrolyte, three aspects need to be considered: the wetting properties of the solid materials, the solid/solid interfacial stability and the transport speed of ions across the interface.", zh: "要在固体电极与固体电解质之间做出理想的固/固界面，需要考虑三个方面：固体材料的浸润性、固/固界面的稳定性，以及离子跨界面的传输速度。" });
  s.addNotes("原文还提到：电极与电解质的延展性、可塑性（malleability、ductility）会显著影响界面接触。硫化物比氧化物软，室温冷压就能压得很致密（Sakuda 等 2013，本文 Ref. 10），这是硫化物路线受欢迎的重要原因之一。");

  // ---------------- 11. Volume change ----------------
  s = d.slide("CONTENT");
  s.addText("问题二：电极会“呼吸”，固体跟不上", { placeholder: "title" });
  d.fig(s, "volume_change", { x: 0.45, y: 1.2, w: 7.4, h: 3.9 });
  d.column(s, 8.05, 1.3, 4.7, [
    { kind: "hist", body: "2013 年 Ebner、Wood 等用同步辐射 X 射线断层扫描，实时看到电极颗粒在循环中开裂、碎片化（本文 Ref. 152）。" },
    { kind: "why", body: "以前只关心电解质的电导率。现在认识到电解质的力学性质同样关键：模量低一点，电极颗粒胀缩时就不容易被压碎。" },
    { kind: "matters", body: "原文还提到 LiFePO₄ 中的晶格应变会影响倍率性能（Refs 160–162）：理解电极内部的应力和应变，是管理界面的前提。" },
  ], 0.18);
  d.quote(s, { y: 5.3, x: 0.6, w: 7.25, en: "A solid electrolyte with a low elastic modulus is always preferred, because this reduces the extent of fragmentation of the electrode materials.", zh: "弹性模量低的固态电解质总是更受青睐，因为它能减轻电极材料的碎裂。" });
  s.addNotes("几乎所有电极材料在嵌锂/脱锂时都会胀缩。液体会流进缝隙补位，固体不会：颗粒一缩就和电解质脱开，界面电阻上升；反复胀缩还会让颗粒开裂。原文要求界面能够承受“高应变和应力”。");

  // ---------------- 12. Modulus dilemma ----------------
  s = d.slide("CONTENT");
  s.addText("软还是硬？电解质的两难", { placeholder: "title" });
  d.fig(s, "modulus_dilemma", { x: 0.45, y: 1.2, w: 7.35, h: 4.15 });
  d.column(s, 8.05, 1.3, 4.7, [
    { kind: "hist", body: "2005 年 Monroe 与 Newman 计算指出：电解质的剪切模量约达到锂的 2 倍以上，才能从力学上压住枝晶。2011 年 Dudney 等用纳米压痕测了 LiPON 的模量和硬度（本文 Ref. 153）。" },
    { kind: "why", body: "正极一侧希望电解质软，能跟着颗粒变形；锂负极一侧希望它硬，能顶住枝晶。同一种材料很难两头都满足。" },
    { kind: "matters", body: "实际上锂表面还会生成复杂的界面相（SEI），影响离子传导，所以原文认为锂负极还需要专门的保护措施。" },
  ], 0.18);
  d.block(s, { x: 0.6, y: 5.55, w: 7.25, kind: "def", tint: true, head: "剪切模量 Shear modulus", body: "材料抵抗“错动”变形的能力。Monroe–Newman 判据比较的就是电解质与锂的剪切模量。" });
  s.addNotes("原文以 LiPON 为例：它的高弹性模量和硬度能挡住锂枝晶，但锂离子跨界面的传输常常受阻。这一页把“软”与“硬”两个要求并排放，是为了说明：正负极两侧的界面要分别设计，后面的夹心电解质就是一种思路。");

  // ---------------- 13. Space charge ----------------
  s = d.slide("CONTENT");
  s.addText("问题三：空间电荷层 Space-charge layer", { placeholder: "title" });
  d.fig(s, "space_charge", { x: 0.45, y: 1.2, w: 7.5, h: 5.0 });
  d.caption(s, "示意图，浓度曲线只表示趋势。", { x: 0.55, y: 6.25, w: 7.3 });
  d.column(s, 8.15, 1.3, 4.6, [
    { kind: "hist", body: "1980–90 年代，Maier 系统发展了离子导体中的空间电荷理论。2014 年 Haruyama、Takada、Tateyama 等用第一性原理计算显示：LiCoO₂ | 硫化物界面上，硫化物一侧的 Li⁺ 会被“吸走”（本文 Ref. 136）。" },
    { kind: "why", body: "两种材料对 Li⁺ 的“亲和力”不同，Li⁺ 会从硫化物流向氧化物，在界面附近留下一层贫锂、带电的区域，Li⁺ 在这里很难通过。" },
    { kind: "matters", body: "这解释了为什么硫化物电解质配氧化物正极时，界面电阻会大得出奇。" },
    { kind: "def", head: "空间电荷层 Space-charge layer", body: "界面附近正、负电荷不再抵消的一薄层（纳米量级），里面可移动离子的浓度偏离体相。" },
  ], 0.16);
  s.addNotes("原文正文只用一句话提到界面电场：“界面处的电场可能加速化学扩散”，并要求界面能承受强电场；空间电荷层的机理来自它引用的 Ref. 136。可以把空间电荷层理解成半导体 p–n 结里的耗尽层：载流子（这里是 Li⁺）被一侧“抢走”，另一侧留下一层缺载流子的高阻区。");

  // ---------------- 14. Interphase & buffer coatings ----------------
  s = d.slide("CONTENT");
  s.addText("问题四：界面反应，以及“缓冲包覆层”", { placeholder: "title" });
  d.fig(s, "interphase", { x: 0.45, y: 1.2, w: 7.5, h: 4.25 });
  d.column(s, 8.15, 1.3, 4.6, [
    { kind: "hist", body: "2006 年 Ohta、Takada 等在 LiCoO₂ 表面包一层几纳米的 Li₄Ti₅O₁₂，全固态电池的倍率性能大幅提升（本文 Ref. 149）；2007 年他们改用 LiNbO₃，效果更好，后来成了最常用的包覆材料。" },
    { kind: "why", body: "以前直接让电极和电解质接触。改为“隔一层”：缓冲层本身导 Li⁺、不导电子、和两边都不反应，既消除空间电荷层，又阻止副反应。" },
    { kind: "matters", body: "原文提醒：化学相容性差会在循环中生成高电阻的钝化层。包覆是目前最实用的对策之一。" },
  ], 0.16);
  d.block(s, { x: 0.6, y: 5.75, w: 7.35, kind: "def", tint: true, head: "界面相 Interphase", body: "反应后在两种材料中间新长出的一层；导 Li⁺ 差时就是“钝化层”。" });
  s.addNotes("原文 Refs 138、139 也属于同一思路：Sakuda 2012 让 LiFePO₄ 颗粒带一层非晶表面层，Kitaura 2011 对 LiMn₂O₄ 正极做表面修饰。三种界面情况：①热力学稳定，Li⁺ 直接通过；②两边反应，长出越来越厚的高阻界面相；③加一层惰性、导 Li⁺ 的缓冲层。");

  // ---------------- 15. Section ----------------
  d.section("3 已经能用的路线");
  s = d.slide("DARK_SECTION");
  s.addText("3  两条已经“能用”的路线", { placeholder: "title" });
  s.addText("聚合物 / 陶瓷夹心电解质  ·  LiPON 薄膜电池：寿命惊人，容量很小", { placeholder: "body" });
  s.addNotes("这一节看两个“已经证明可行”的例子，以及它们各自的局限。");

  // ---------------- 16. Sandwich ----------------
  s = d.slide("CONTENT");
  s.addText("聚合物 / 陶瓷 / 聚合物“三明治”电解质", { placeholder: "title" });
  d.fig(s, "sandwich", { x: 0.45, y: 1.2, w: 7.4, h: 4.2 });
  d.column(s, 8.1, 1.3, 4.65, [
    { kind: "hist", body: "2016 年 Zhou、Goodenough 等提出聚合物/陶瓷/聚合物夹心电解质，在锂负极上实现了无枝晶的锂沉积（本文 Ref. 158）。" },
    { kind: "why", body: "单用聚合物：阴离子也会移动，在电极表面堆积，形成强的双电层电场。单用陶瓷：太硬、接触差。夹心结构各取所长。" },
    { kind: "matters", body: "原文说这种结构能改变电极/聚合物界面的双电层电场、阻挡阴离子迁移，从而提高库仑效率。这是“复合电解质”思路在电池层面的体现。" },
  ], 0.16);
  d.block(s, { x: 0.6, y: 5.6, w: 7.25, kind: "def", tint: true, head: "双电层 Double layer", body: "电极表面一层带电粒子和溶液中一层反号离子组成的“电容器”。阴离子堆得越多，这层电场越强，越容易引发副反应和不均匀沉积。" });
  s.addNotes("陶瓷电解质只传导 Li⁺（迁移数接近 1），阴离子过不去。两侧薄薄的聚合物层负责“贴”住电极，降低界面电阻。这种思路在第 3 章的复合电解质部分也出现过。");

  // ---------------- 17. Thin film ----------------
  s = d.slide("CONTENT");
  s.addText("LiPON 薄膜电池：一万圈的寿命", { placeholder: "title" });
  d.fig(s, "thin_film", { x: 0.45, y: 1.15, w: 7.55, h: 4.12 });
  d.stat(s, { x: 8.25, y: 1.2, w: 2.3, value: "10,000+", label: "循环圈数", color: "accent2" });
  d.stat(s, { x: 10.65, y: 1.2, w: 2.1, value: "4.8", unit: "V", label: "LiNi₀.₅Mn₁.₅O₄ 正极", color: "accent1" });
  d.block(s, { x: 8.25, y: 2.75, w: 4.5, kind: "hist", body: "1992 年 Bates、Dudney 等（美国橡树岭国家实验室 ORNL）在氮气中溅射 Li₃PO₄ 得到 LiPON；2015 年 Li、Dudney 等用它做出循环超过一万圈的 4.8 V 薄膜电池（Ref. 159）。" });
  d.quote(s, { x: 8.25, w: 4.5, en: "Thin-film batteries based on the LiPON solid electrolyte have achieved over 10,000 cycles with a lithium-metal anode and a 4.8 V LiNi₀.₅Mn₁.₅O₄ cathode …", zh: "基于 LiPON 的薄膜电池，以锂金属为负极、4.8 V 的 LiNi₀.₅Mn₁.₅O₄ 为正极，实现了一万次以上循环。" });
  d.caption(s, "示意图，未按比例：整颗电池用真空镀膜一层层“长”出来，总厚度通常只有十几 μm。", { x: 0.6, y: 5.3, w: 7.4 });
  d.block(s, { x: 0.6, y: 5.62, w: 7.4, kind: "why", tint: true, body: "LiPON 电导率只有约 10⁻⁶ S cm⁻¹，但薄到 1–2 μm 后电阻不大；它致密、无晶界，对锂和高压正极都稳定。" });
  s.addNotes("液态电解液在 4.8 V 下会持续氧化分解，所以同样的正极在液态电池里很难长寿命。LiPON 薄膜电池证明：只要界面足够干净、稳定，固态电解质确实能让高压正极和锂金属负极长期共存。各层厚度为常见数量级，用于示意。");

  // ---------------- 18. Thin film capacity chart ----------------
  s = d.slide("CONTENT");
  s.addText("薄膜电池的短板：容量太小", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "容量", labels: ["薄膜电池下限 0.1 μAh", "薄膜电池上限 10 mAh", "手机电池 ~3 Ah", "电动车单体 ~50 Ah"], values: [0.0001, 10, 3000, 50000] }], {
    x: 0.5, y: 1.25, w: 7.0, h: 4.6, barDir: "bar",
    chartColors: [HEX.accent1, HEX.accent1, HEX.accent6, HEX.accent6],
    showValue: false,
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisLogScaleBase: 10, valAxisMinVal: 0.00001, valAxisMaxVal: 1000000, valAxisLabelFontSize: 11, valAxisLabelColor: HEX.dk2, valAxisLabelFormatCode: "General",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "电池容量（mAh，对数坐标）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "薄膜电池数值取自原文（0.1 μAh–10 mAh）；手机电池与电动车单体为 2017 年前后的典型量级，仅作对比。", { x: 0.6, y: 5.95, w: 6.9, h: 0.5 });
  d.column(s, 7.85, 1.35, 4.9, [
    { kind: "why", body: "薄膜电池的每一层都要真空镀膜，正极只有几微米厚，储存的锂自然很少。想加厚，LiPON 的低电导率和镀膜成本立刻成了问题。" },
    { kind: "hist", body: "2000 年代，ORNL 的薄膜电池技术授权给多家公司，用于智能卡、RFID 标签、传感器等微型电源。" },
    { kind: "matters", body: "薄膜电池是“原理验证”：证明了固态界面可以非常稳定。要做大电池，还得回到块体型复合电极，回到界面难题。" },
  ], 0.18);
  s.addNotes("从 0.1 μAh 到 50 Ah 跨了近 9 个数量级，所以用对数坐标。原文原话：薄膜电池容量很低（0.1 μAh 到 10 mAh），无法满足大多数应用的需求。");

  // ---------------- 19. Section ----------------
  d.section("4 现状与出路");
  s = d.slide("DARK_SECTION");
  s.addText("4  现状与出路", { placeholder: "title" });
  s.addText("Table 2 里的全固态电池数据  ·  一张“问题 → 对策”地图", { placeholder: "body" });
  s.addNotes("原文给全固态锂离子电池定的目标：以可承受的成本，在循环寿命和安全性上超过传统锂离子电池，同时保持相近或更高的功率和能量密度。");

  // ---------------- 20. Table 2 data ----------------
  s = d.slide("CONTENT");
  s.addText("现状：四类全固态电池的循环寿命与功率", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "循环寿命", labels: ["氧化物", "硫化物", "LiPON 薄膜", "聚合物 PEO"], values: [300, 1000, 10000, 400] }], {
    x: 0.5, y: 1.25, w: 6.0, h: 3.6, barDir: "bar",
    chartColors: [HEX.accent3, HEX.accent3, HEX.accent1, HEX.accent2],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "#,##0",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisLogScaleBase: 10, valAxisMinVal: 10, valAxisMaxVal: 100000, valAxisLabelFontSize: 11, valAxisLabelColor: HEX.dk2, valAxisLabelFormatCode: "#,##0",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "循环寿命（圈，约值，对数坐标）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  s.addChart(d.pres.charts.BAR, [
    { name: "下限", labels: ["氧化物", "硫化物", "LiPON 薄膜", "聚合物 PEO"], values: [10, 10, 5, 10] },
    { name: "范围", labels: ["氧化物", "硫化物", "LiPON 薄膜", "聚合物 PEO"], values: [40, 50, 45, 90] },
  ], {
    x: 6.75, y: 1.25, w: 6.0, h: 3.6, barDir: "bar", barGrouping: "stacked",
    chartColors: ["FFFFFF", HEX.accent2],
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20, valAxisLabelFontSize: 11, valAxisLabelColor: HEX.dk2,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "功率密度范围（mW cm⁻²）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "数据：原文 Table 2（约值）。功率随温度或正极而变。", { x: 6.85, y: 4.9, w: 5.9 });
  d.block(s, { x: 0.6, y: 5.3, w: 5.95, kind: "matters", tint: true, body: "LiPON 薄膜电池寿命最长，说明“稳定界面”是长寿命的关键；块体型电池只有几百到一千圈，界面还远没解决。" });
  d.block(s, { x: 6.8, y: 5.3, w: 5.95, kind: "note", tint: true, body: "Table 2 的能量密度 300–600 Wh kg⁻¹ 只按正负极活性物质计算（表注），不含电解质、集流体和外壳，不能直接和商用电池比较。" });
  s.addNotes("Table 2 中四类全固态电池的电压范围：氧化物 3.0–5.0 V，硫化物 4.5–5.0 V，LiPON 薄膜 3.0–4.0 V，PEO 3.3–3.7 V。其中硫化物一行的电压值和 Table 1 说硫化物“氧化稳定性低、与正极相容性差”不太一致，见本章校注页。");

  // ---------------- 21. Strategy map ----------------
  s = d.slide("CONTENT");
  s.addText("出路：问题 → 对策 一张图", { placeholder: "title" });
  d.fig(s, "strategy_map", { x: 0.5, y: 1.2, w: 12.3, h: 4.4 });
  d.block(s, { x: 0.6, y: 5.85, w: 12.15, kind: "def", head: "原文定下的目标", body: "以可承受的成本，在循环寿命和安全性上超过传统锂离子电池，同时保持相近或更高的功率与能量密度。原文自己也承认这是“艰巨的挑战”（daunting challenge）。" });
  s.addNotes("原文对界面给出的总体要求：理解并管理界面行为，缓解应变与应力，避免化学不相容生成高阻钝化层，并能承受强电场。第 6 章的“结论与展望”还会提出弹性导电中间层、含液中间层等方案。");

  // ---------------- 22. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本章涉及的两处疑点", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① Table 2：硫化物电池电压 4.5–5.0 V", body: "Table 1 说硫化物电解质“氧化稳定性低、与正极材料相容性差”。同一篇文章里，Table 2 却给硫化物全固态电池列出 4.5–5.0 V 的电池电压，比氧化物一行（3.0–5.0 V）的下限还高。\n常见硫化物全固态电池多用约 4 V 级正极并加包覆层，这一行数值存疑，读时宜谨慎。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 能量密度的口径", body: "原文开头说全固态电池“能量密度更高”，而 Table 2 的 300–600 Wh kg⁻¹ 按表注只计入正负极活性物质。\n全固态电池的复合电极里还有大量电解质（本章第 6 页），所以电池整体能量密度会明显低于这个数，二者不能直接比较。" });
  d.block(s, { x: 0.6, y: 4.3, w: 12.15, kind: "def", tint: true, head: "补充：本章引入的两个概念不在原文正文中", body: "“空间电荷层”和“缓冲包覆层”在原文中只体现为参考文献（Refs 136、138、139、149）和“界面电场”的一句话。本章展开讲，是因为它们是理解氧化物正极 | 硫化物电解质界面的关键。" });
  s.addNotes("校注①属于原文内部的数值不一致，不一定是笔误，可能是不同文献口径混用。校注②是读表时最容易犯的错：把“活性物质能量密度”当成“电池能量密度”。");

  // ---------------- 23. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["两种全固态电池", "无机型：电解质颗粒混进电极、兼作隔膜；聚合物型：柔软易加工，但 PEO 只能配 LiFePO₄"],
    ["界面是头号难题", "点接触、体积变化、空间电荷层、界面反应：电导率再高也被界面电阻拖累"],
    ["对策", "软电解质与加压、缓冲包覆层（LiNbO₃）、夹心电解质、锂负极保护"],
    ["已证明可行的例子", "LiPON 薄膜电池 4.8 V、一万圈：界面稳定就能长寿命，但容量只有 μAh–mAh"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Although some inorganic solid electrolytes that exhibit the same level of conductivity as organic liquid electrolytes have been discovered, the performance of all-solid batteries based on these electrolytes is still inferior to that of commercially available lithium-ion batteries.”", options: { italic: true, fontSize: 14, color: "FFFFFF", breakLine: true } },
    { text: "虽然已发现电导率与有机液态电解质相当的无机固态电解质，但基于它们的全固态电池，性能仍不及商用锂离子电池。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章换一个思路：既然固–固界面这么难，那就让电极保持液态或气态，只让固态电解质当“隔板”。这就是 Li–空气、Li–S、Li–Br 混合电解质电池。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
