// Manthiram, Yu & Wang 2017 — Chapter 5: 搭配液/气态电极的固态电解质
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Manthiram et al., Nat. Rev. Mater. 2017",
  full: "Manthiram, Yu & Wang. Lithium battery chemistries enabled by solid-state electrolytes. Nature Reviews Materials 2, 16103 (2017). doi:10.1038/natrevmats.2016.103",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch5_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 5, chapterTitle: "搭配液/气态电极的固态电解质", figDir });
  d.registerFigs(info);
  const C = d.C;
  const card = (s, x, y, w, h, fill) => s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt" };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 5 章\n让固态电解质当“守门员”", { placeholder: "title" });
  s.addText("搭配液/气态电极：锂–空气 · 锂–硫 · 锂–溴", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.8, y: 0.9, w: 3.9, h: 5.6 });
  s.addNotes("本章对应原文“Solid electrolytes with liquid or gaseous electrodes”（第 6–10 页，含 Fig. 4、5、6 和 Table 2 中的 Li–空气、Li–S、Li–Br 三行）。核心思路：电极保持液态或气态，固态电解质只做一张“只放 Li⁺ 通过”的膜。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "换个思路：双电解质", "液体留在电极里，固体只当隔膜"],
    ["2", "锂–空气 Li–air", "有机负极液 | SSE | 水系正极液（Fig. 4）"],
    ["3", "锂–硫 Li–S", "挡住多硫化物和枝晶（Fig. 5）"],
    ["4", "锂–溴 Li–Br₂", "介于锂离子和锂–空气之间的“中间平台”（Fig. 6）"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08, "F5F7F9");
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.column(s, 7.4, 1.45, 5.35, [
    { kind: "def", tint: true, head: "承上启下", body: "第 4 章：全固态电池卡在固–固界面，界面电阻大。\n本章：干脆让电极保持液态或气态，界面变成“固–液”，电荷转移电阻就小多了；固态电解质的任务只剩“隔开两边、放 Li⁺ 通过”。" },
    { kind: "def", tint: true, head: "记号", body: "SSE = 固态电解质 solid-state electrolyte；anolyte = 负极一侧的电解液；catholyte = 正极一侧的电解液。“A || SSE || B” 表示用 SSE 隔开的 A、B 两室。" },
  ], 0.35);
  s.addNotes("这一章的三个体系结构几乎一样：锂金属 + 有机电解液 | 锂离子固态电解质（多为 NASICON 型 LATP）| 液态或气态正极。区别只在正极活性物质：O₂、S/多硫化物、Br₂。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从“全固态”到“固态电解质 + 液体电极”", { placeholder: "title" });
  d.fig(s, "ch5_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.block(s, { x: 0.6, y: 5.35, w: 5.9, kind: "why", tint: true, body: "以前：Li–O₂、Li–S 都先用有机电解液，或者尝试全固态。前者有穿梭、分解、枝晶，后者界面太慢。2010 年前后出现折中方案：只在两种液体之间放一张固态电解质膜。" });
  d.block(s, { x: 6.8, y: 5.35, w: 5.95, kind: "matters", tint: true, body: "固态电解质让“锂金属 + 水溶液”“锂金属 + 液溴”这类原本不可能的组合成为现实。" });
  s.addNotes("时间轴不按比例。黄：锂硫；红：锂空气；紫：锂溴。1987 年 Semkow 与 Sammells 的 Li–O₂ 电池用的是高温氧化物电解质，原文说它“类似固体氧化物燃料电池”；1996 年 Abraham 与 Jiang 用聚合物（凝胶）电解质做出常温 Li–O₂，引发了后来的研究热潮。2010 年的工作分别来自日本三重大学 Imanishi 组和产业技术综合研究所 Zhou 组（本文 Refs 175、187）。");

  // ---------------- 4. Hybrid concept ----------------
  s = d.slide("CONTENT");
  s.addText("核心思路：双电解质，固态电解质只当“守门员”", { placeholder: "title" });
  d.fig(s, "hybrid_concept", { x: 0.45, y: 1.2, w: 7.55, h: 4.4 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "2009 年 Zhou 组报道“水系/非水系一体化”的 Li–Ni 电池（Ref. 50）；2011 年 Lu 与 Goodenough 提出用固态电解质隔开的正极液流电池（Ref. 51）。" },
    { kind: "why", body: "多孔隔膜只能挡住固体，挡不住溶解的物质。换成只导 Li⁺ 的致密陶瓷膜，两边就能放两种完全不同、甚至会互相反应的液体。" },
    { kind: "matters", body: "电极不必再是固体：任何容量大、电压高的液态或气态物质都可以拿来做正极。" },
  ], 0.18);
  d.quote(s, { x: 0.6, y: 5.75, w: 7.4, en: "Replacement of liquid electrolytes with a solid-electrolyte separator will not only overcome the persistent problems of liquid electrolytes, but also offer possibilities for developing new battery chemistries", zh: "用固态电解质隔膜取代液态电解质，不仅能克服液态电解质的老问题，还为开发新的电池化学体系提供了可能。" });
  s.addNotes("这句引文出自原文第 1 页引言。图中三个被挡住的东西对应本章三个体系：水和 O₂（锂–空气）、溶解的多硫化物（锂–硫）、溴（锂–溴）；锂枝晶则是三者共同的问题。");

  // ---------------- 5. Section Li–air ----------------
  d.section("1 锂–空气");
  s = d.slide("DARK_SECTION");
  s.addText("1  锂–空气电池 Lithium–air", { placeholder: "title" });
  s.addText("理论能量接近汽油；用固态电解质隔开有机负极液和水系正极液", { placeholder: "body" });
  s.addNotes("原文 Fig. 4 的三个分图：a 双电解质 Li–空气电池结构；b 碱性与酸性正极液的电位和开路电压；c ORR/OER 电极分开的“解耦”设计。");

  // ---------------- 6. Li–air energy ----------------
  s = d.slide("CONTENT");
  s.addText("锂–空气：为什么值得追？", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "能量密度", labels: ["Li–Br₂", "Li–S", "Li–空气", "汽油"], values: [1200, 2600, 11680, 13000] }], {
    x: 0.5, y: 1.25, w: 6.4, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent3, HEX.accent5, HEX.accent4, HEX.accent6],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "#,##0",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 15500,
    showTitle: true, title: "原文给出的能量密度（Wh kg⁻¹）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "Li–S、Li–空气、汽油取自正文（理论值，只算活性物质）；Li–Br₂ 取自 Table 2。汽油为燃烧热值。", { x: 0.6, y: 5.6, w: 6.3, h: 0.5 });
  d.column(s, 7.2, 1.3, 5.55, [
    { kind: "hist", body: "1987 年 Semkow 与 Sammells 报道首个可充 Li–O₂ 电池；1996 年 Abraham 与 Jiang 做出常温非水 Li–O₂；2006 年 Bruce 组证明 Li₂O₂ 能可逆分解。" },
    { kind: "why", body: "正极活性物质 O₂ 来自空气，不用装进电池，理论上只有锂的重量“算数”，能量密度高出一个数量级。" },
    { kind: "matters", body: "这是最诱人的目标，也是难题最多的体系：Table 2 中混合 Li–空气只循环约 100 圈。" },
  ], 0.16);
  d.quote(s, { x: 7.2, w: 5.55, en: "Lithium–air batteries … can yield an exceptionally high theoretical energy density of ~11,680 Wh kg⁻¹ (which almost rivals that of petrol (gasoline) at 13,000 Wh kg⁻¹).", zh: "锂–空气电池……理论能量密度高达约 11,680 Wh kg⁻¹，几乎可与汽油（13,000 Wh kg⁻¹）媲美。" });
  s.addNotes("11,680 Wh kg⁻¹ 是只按锂金属质量计算的理论值（不计 O₂）。实际电池要算上电解液、催化剂、集流体和外壳，Table 2 给出的混合 Li–空气电池为约 10,000 Wh kg⁻¹（仍只按活性物质）。");

  // ---------------- 7. Aprotic problems ----------------
  s = d.slide("CONTENT");
  s.addText("非水 Li–O₂ 的两个病根", { placeholder: "title" });
  d.fig(s, "aprotic_problems", { x: 0.45, y: 1.2, w: 7.55, h: 4.3 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "2010 年前后，Girishkumar、Luntz 等系统总结了非水 Li–空气电池的难题（本文 Ref. 169）：放电产物堵孔、电解液不稳定、空气杂质。" },
    { kind: "why", body: "把电池“打开”接触空气，空气里的水汽和 CO₂ 就会进来：分解有机电解液、腐蚀锂。放电产物 Li₂O₂ 不溶于有机溶剂，越积越多，把空气通道堵死。" },
    { kind: "matters", body: "这两个问题直接引出两条路线：全固态 Li–空气（Ref. 173），以及本章的“双电解质”混合 Li–空气。" },
  ], 0.18);
  d.block(s, { x: 0.6, y: 5.65, w: 7.4, kind: "def", tint: true, head: "非质子 aprotic", body: "溶剂分子里没有能电离出 H⁺ 的氢，如碳酸酯、醚类。它们能与锂共存，但怕水。" });
  s.addNotes("原文：非质子电解液的 Li–O₂ 电池存在两个问题：非水电解液在大气环境中降解；不溶的放电产物堵塞多孔正极中的空气扩散。“Li–air”和“Li–O₂”常混用，严格说前者用空气，后者用纯氧。");

  // ---------------- 8. Hybrid Li–air ----------------
  s = d.slide("CONTENT");
  s.addText("双电解质（混合）锂–空气电池", { placeholder: "title" });
  d.fig(s, "hybrid_liair", { x: 0.45, y: 1.2, w: 7.55, h: 4.55 });
  d.caption(s, "据原文 Fig. 4a 重绘", { x: 0.55, y: 5.5, w: 7.4 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "2008 年起，三重大学 Imanishi 组用“锂 | 聚合物 | LATP 玻璃陶瓷”复合负极做水系 Li–空气电池（Refs 174、175）；2010 年 Wang 与 Zhou 也报道了类似结构（Ref. 187）。" },
    { kind: "why", body: "放电产物在水里是可溶的 LiOH（或酸性下的 H₂O），不再堵塞孔道；锂躲在有机液里，水碰不到它。" },
    { kind: "matters", body: "固态电解质既可用 PEO 类聚合物，也可用氧化物 LATP；关键是它必须能长期耐水。" },
  ], 0.18);
  d.quote(s, { x: 0.6, y: 6.05, w: 12.15, en: "In the hybrid batteries, an organic electrolyte is used at the anode side (anolyte) and an aqueous electrolyte at the cathode side (catholyte) …", zh: "在混合电池中，负极一侧用有机电解液，正极一侧用水系电解液（两者由一张固态电解质膜隔开）。" });
  s.addNotes("原文举了 2010 年的两个早期例子：Li/有机电解液 || LATP || KOH(aq)/Mn₃O₄，以及 Li/PEO–LiTFSI || LATP || CH₃COOH–CH₃COOLi(aq)/Pt。注意原文把 LiTFSI 误写成了 LiTSFI（见校注页）。这里的 LATP 实为含 Si 的 Li₁₊ₓ₊ᵧAlₓTi₂₋ₓP₃₋ᵧSiᵧO₁₂。");

  // ---------------- 9. Energy levels ----------------
  s = d.slide("CONTENT");
  s.addText("碱性还是酸性？电压差 0.83 V", { placeholder: "title" });
  d.fig(s, "energy_levels", { x: 0.5, y: 1.2, w: 6.1, h: 5.4 });
  d.stat(s, { x: 6.95, y: 1.2, w: 2.7, value: "3.4", unit: "V", label: "碱性 catholyte 的开路电压", color: "accent6" });
  d.stat(s, { x: 9.85, y: 1.2, w: 2.9, value: "4.23", unit: "V", label: "酸性 catholyte 的开路电压", color: "accent2" });
  d.column(s, 6.95, 2.75, 5.8, [
    { kind: "hist", body: "1930–60 年代，Pourbaix 系统整理出各种元素的“电位–pH 图”，说明同一个电极反应的电位会随 pH 移动。" },
    { kind: "why", body: "氧还原的电位每升高 1 个 pH 单位约降低 0.059 V。从 pH 0 到 pH 14 共降低约 0.83 V，正好是 1.23 V 与 0.40 V 之差。锂负极不受 pH 影响，所以酸性正极液让电池电压直接多出 0.83 V。" },
    { kind: "matters", body: "OCV = 正极电位 − 负极电位：0.40 −（−3.0）= 3.4 V；1.23 −（−3.0）= 4.23 V。" },
  ], 0.18);
  s.addNotes("据原文 Fig. 4b 重绘。原文用 Li 的标准电位 −3.0 V（更精确为 −3.04 V）。开路电压 OCV（open-circuit voltage）是没有电流时的电压，实际放电电压会更低；Table 2 中混合 Li–空气电池的电压为 2.8–3.7 V，随电解液而变。");

  // ---------------- 10. Alkaline vs acidic ----------------
  s = d.slide("CONTENT");
  s.addText("酸性正极液的三个好处，和一个限制", { placeholder: "title" });
  d.fig(s, "alk_vs_acid", { x: 0.45, y: 1.2, w: 7.55, h: 3.3 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "2009 年 Hasegawa 等研究 NASICON 型玻璃陶瓷在水中的稳定性（Ref. 189）；2012–2014 年 Manthiram 组先后用磷酸盐缓冲液、多元酸、咪唑缓冲的酸性正极液（Refs 178、184、185）。" },
    { kind: "why", body: "碱性液里生成的 LiOH 溶解度有限，会析出堵孔；CO₂ 还会把碱液变成 Li₂CO₃。换成酸，产物是水，这些问题都消失了。" },
    { kind: "matters", body: "强酸会腐蚀 LATP 膜，所以只能用弱酸；放电中酸被消耗、变弱，反而对膜更友好。" },
  ], 0.18);
  d.block(s, { x: 0.6, y: 4.75, w: 7.4, kind: "def", tint: true, head: "缓冲液 Buffer", body: "弱酸与它的盐的混合液，加入少量酸或碱时 pH 变化很小。磷酸盐缓冲液让放电过程中正极液的酸度保持平稳。" });
  d.caption(s, "强酸 HCl、HNO₃、H₂SO₄ 会腐蚀 SSE；原文列出的可用弱酸：CH₃COOH、H₃PO₄、LiH₂PO₄。", { x: 0.6, y: 6.35, w: 7.4, h: 0.45 }, { size: 12 });
  s.addNotes("碱性：O₂ + 2H₂O + 4e⁻ → 4OH⁻，与 Li⁺ 结合成 LiOH；CO₂ + 2LiOH → Li₂CO₃ + H₂O。酸性：O₂ + 4H⁺ + 4e⁻ → 2H₂O。原文列出的弱酸：CH₃COOH、H₃PO₄、LiH₂PO₄；会腐蚀固态电解质的强酸：HCl、HNO₃、H₂SO₄。");

  // ---------------- 11. Decoupled ----------------
  s = d.slide("CONTENT");
  s.addText("解耦电极：放电和充电各用一个电极", { placeholder: "title" });
  d.fig(s, "decoupled", { x: 0.45, y: 1.2, w: 7.55, h: 4.55 });
  d.caption(s, "左图据原文 Fig. 4c 重绘", { x: 8.2, y: 5.55, w: 4.5 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "2014 年 Li 与 Manthiram 把 ORR、OER 电极分开用于混合 Li–空气电池（Ref. 182），循环寿命大幅延长；类似的“第三电极”思路此前已用于可充锌–空气电池。" },
    { kind: "why", body: "以前：一个“双功能”空气电极同时负责放电（ORR）和充电（OER）。充电电压高，电极里的碳被氧化腐蚀，寿命短。改为：充电时改接一张不含碳的金属网。" },
    { kind: "matters", body: "放电电极再也不经历高电压，碳腐蚀问题从根上避开。" },
  ], 0.18);
  d.block(s, { x: 0.6, y: 5.88, w: 12.15, kind: "def", tint: true, head: "ORR / OER", body: "ORR：氧还原反应（放电，O₂ 得电子）；OER：析氧反应（充电，放出 O₂）。OER 需要更高电压，所以更伤电极。" });
  s.addNotes("ORR = oxygen reduction reaction 氧还原反应（放电）；OER = oxygen evolution reaction 析氧反应（充电）。OER 电极是直接负载催化剂的金属网，原文举例镍、不锈钢或钛。");

  // ---------------- 12. Section Li–S ----------------
  d.section("2 锂–硫");
  s = d.slide("DARK_SECTION");
  s.addText("2  锂–硫电池 Lithium–sulfur", { placeholder: "title" });
  s.addText("用固态电解质膜把多硫化物“关”在正极里，同时挡住锂枝晶", { placeholder: "body" });
  s.addNotes("原文 Fig. 5：a 全固态 Li–S；b 混合 Li || Li-SSE || S 电池；c 带中间层的膜电极组件；d Li–S 放电曲线与 LATP 电化学窗口的比较。");

  // ---------------- 13. Li–S problems ----------------
  s = d.slide("CONTENT");
  s.addText("锂–硫的两大难题，一张膜同时解决", { placeholder: "title" });
  d.fig(s, "ls_separator", { x: 0.45, y: 1.2, w: 7.55, h: 4.1 });
  d.stat(s, { x: 8.2, y: 1.2, w: 2.4, value: "~2,600", unit: "Wh kg⁻¹", label: "理论能量密度（仅活性物质）", color: "accent5" });
  d.stat(s, { x: 10.75, y: 1.2, w: 2.0, value: "~2.0", unit: "V", label: "工作电压（正文）", color: "accent6" });
  d.column(s, 8.2, 2.75, 4.55, [
    { kind: "hist", body: "1962 年 Herbert 与 Ulam 申请以硫为正极的电池专利；2004 年 Mikhaylik 与 Akridge 定量描述了多硫化物“穿梭”。" },
    { kind: "why", body: "以前靠在正极里“包”住多硫化物（新结构、新宿主、化学吸附），原文说这些只能部分缓解。要彻底切断扩散，得换隔膜。" },
  ], 0.18);
  d.quote(s, { x: 0.6, y: 5.55, w: 7.4, en: "These two problems — the polysulfide shuttle and cell-shorting by lithium dendrites — are the most important challenges for lithium–sulfur battery technology.", zh: "多硫化物穿梭和锂枝晶造成的短路，是锂硫电池技术最重要的两大挑战。" });
  d.block(s, { x: 8.2, y: 5.55, w: 4.55, kind: "matters", tint: true, body: "致密 SSE 一张膜同时对付两个问题：多硫化物过不去，枝晶也顶不穿。" });
  s.addNotes("原文数据：负极容量约 3,800、正极约 1,675（原文单位误写为 mA g⁻¹，应为 mAh g⁻¹），理论能量密度约 2,600 Wh kg⁻¹，工作电压约 2.0 V。多硫化物穿梭的机理在第 1 章、以及 Lopez 2019 的读书幻灯片里讲过。");

  // ---------------- 14. Two phases ----------------
  s = d.slide("CONTENT");
  s.addText("固态电解质锂–硫的两个阶段", { placeholder: "title" });
  d.fig(s, "ls_phases", { x: 0.45, y: 1.2, w: 7.7, h: 4.35 });
  d.caption(s, "据原文 Fig. 5a、5b 重绘", { x: 0.55, y: 5.6, w: 7.5 });
  d.column(s, 8.35, 1.3, 4.4, [
    { kind: "hist", body: "阶段一：2008 年 Hayashi、Kobayashi 等做全固态 Li–S，2010 年 Hassoun 与 Scrosati 也主张固态；阶段二：2014–2015 年 Wang、Xia 与 Yu、Manthiram 等提出混合电解质。" },
    { kind: "why", body: "S 和多硫化物几乎不导电子和离子，全固态时反应太慢、S 用不完。于是正极里保留液体，让 S 的溶解–沉积反应照常进行，只在中间放 SSE。" },
    { kind: "matters", body: "既保留液体的快反应，又靠 SSE 切断穿梭。" },
  ], 0.16);
  d.block(s, { x: 0.6, y: 5.88, w: 12.15, kind: "def", tint: true, head: "thio-LISICON", body: "Kanno 等在 2000 年代初开发的硫化物锂离子导体家族（如 Li₄₋ₓGe₁₋ₓPₓS₄），LGPS 就是从这一家族发展出来的。" });
  s.addNotes("原文说混合 Li–S 中 SSE 同时扮演三个角色：隔开锂负极和硫正极的隔膜；维持两极反应的 Li⁺ 导体；阻止多硫化物迁移的屏障。正极里的液体则为硫–多硫化物–硫化物的氧化还原提供离子介质，并保证正极/SSE 界面的 Li⁺ 通道。");

  // ---------------- 15. Interlayer ----------------
  s = d.slide("CONTENT");
  s.addText("锂负极一侧：加一层“软垫”", { placeholder: "title" });
  d.fig(s, "interlayer", { x: 0.45, y: 1.2, w: 7.4, h: 4.2 });
  d.column(s, 8.1, 1.3, 4.65, [
    { kind: "hist", body: "2015–2016 年 Yu、Manthiram 等在锂和 SSE 膜之间插入浸了电解液的聚合物（聚丙烯）中间层，组成“膜电极组件”（Refs 53、216）。" },
    { kind: "why", body: "先试过的办法：在界面滴一点液态电解液作缓冲，或者把锂用力压在膜上，原文说都不令人满意。软中间层能填满起伏，让接触面积稳定。" },
    { kind: "matters", body: "这和第 4 章的结论一致：固–固界面最难，加一点液体或软材料往往最有效。" },
  ], 0.18);
  d.block(s, { x: 0.6, y: 5.75, w: 7.25, kind: "def", tint: true, head: "膜电极组件 MEA", body: "把电极、中间层和隔膜预先压成一体的组件，概念借自燃料电池。" });
  s.addNotes("原文 Fig. 5c 标的是“LISICON membrane”，而正文说用的是 NASICON 型 LATP。商用 LATP 玻璃陶瓷常被厂家称作“LISICON”，其实晶体结构属于 NASICON 型，这是一个常见的名称混用。");

  // ---------------- 16. LATP compatibility ----------------
  s = d.slide("CONTENT");
  s.addText("LATP 的软肋：放电电压低于它的还原电位", { placeholder: "title" });
  const cap = Array.from({ length: 24 }, (_, i) => i * 50);
  const vS = [2.40, 2.36, 2.34, 2.33, 2.30, 2.21, 2.13, 2.08, 2.09, 2.09, 2.09, 2.10, 2.10, 2.10, 2.10, 2.10, 2.10, 2.10, 2.09, 2.09, 2.08, 2.07, 2.05, 1.80];
  s.addChart(d.pres.charts.LINE, [
    { name: "Li–S 放电曲线", labels: cap.map(String), values: vS },
    { name: "LATP 窗口下限 ≈2.3 V（Fig. 5d）", labels: cap.map(String), values: cap.map(() => 2.3) },
  ], {
    x: 0.5, y: 1.25, w: 6.5, h: 4.3,
    chartColors: [HEX.dk1, HEX.accent4], lineSize: 3, lineDataSymbol: "none",
    showTitle: true, title: "电压（V）vs 比容量（mAh g⁻¹）", ...chartText,
    showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    valAxisMinVal: 1.5, valAxisMaxVal: 2.6, valAxisMajorUnit: 0.2, valAxisLabelFormatCode: "0.0", valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    catAxisLabelFrequency: 4,
  });
  d.caption(s, "据原文 Fig. 5d 近似读取重绘：曲线几乎全程在红线以下，Ti⁴⁺ 会被还原为 Ti³⁺。", { x: 0.6, y: 5.6, w: 6.4, h: 0.5 });
  d.fig(s, "nasicon_compare", { x: 7.3, y: 1.25, w: 5.45, h: 2.85 });
  d.column(s, 7.3, 4.3, 5.45, [
    { kind: "hist", body: "混合 Li–S 最初用商用 LATP（Refs 52、53）；2014 年 Wang 等换成 LAGP（Ref. 217）；2016 年 Yu、Manthiram 等改用 LYZP（Ref. 216）。" },
    { kind: "matters", body: "选电解质不能只看电导率：LYZP 电导率只有约 3 × 10⁻⁵ S cm⁻¹，比 LATP 低，却因为相容而循环更好。" },
  ], 0.16);
  s.addNotes("原文：Ti⁴⁺ 约在 2.4 V（vs Li⁺/Li）被还原，可被多硫化物化学还原，也会在放电时被电化学还原。Fig. 5d 标注的窗口下限却是约 2.3 V，二者略有出入（见校注页）。LAGP 用 Ge 替代 Ti 解决了相容性，但循环仍不理想，而且 Ge 很贵。");

  // ---------------- 17. Section Li–Br ----------------
  d.section("3 锂–溴");
  s = d.slide("DARK_SECTION");
  s.addText("3  锂–溴电池 Lithium–bromine", { placeholder: "title" });
  s.addText("液态溴正极：反应快、电压高，但必须和锂彻底隔开", { placeholder: "body" });
  s.addNotes("原文 Fig. 6：a 可充锂–溴电池结构；b 一个以 LATP 为固态电解质的锂–溴电池的电压和功率密度随电流密度的变化（数据来自 Ref. 219）。");

  // ---------------- 18. Li–Br cell ----------------
  s = d.slide("CONTENT");
  s.addText("锂–溴电池的结构与反应", { placeholder: "title" });
  d.fig(s, "libr_cell", { x: 0.45, y: 1.2, w: 7.55, h: 4.36 });
  d.caption(s, "据原文 Fig. 6a 重绘；正极半反应已按电荷配平（原图写作 Br₂ + e⁻ → 2Br⁻）。", { x: 0.55, y: 5.6, w: 7.4 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "1992 年 Lühder 等研究了锂–碘、锂–溴固体电解质电池（Ref. 218）；2014 年 Chang、Zhou 等做出 LATP 隔开的可充 Li//Br 电池（Ref. 219）；2015 年 Takemoto 与 Yamada 也做了类似工作。" },
    { kind: "why", body: "溴是液体、反应快，但腐蚀性和氧化性极强，一碰锂就剧烈反应。只有致密的固态电解质能把两者完全隔开。" },
    { kind: "matters", body: "放电时 Br₂ 得电子变成 Br⁻，Br⁻ 再和 Br₂ 结合成更稳定的 Br₃⁻；充电时反过来。" },
  ], 0.16);
  d.quote(s, { x: 0.6, y: 6.15, w: 12.15, en: "The lithium-ion-conductive solid electrolyte was instrumental in the development of lithium–bromine batteries …", zh: "锂离子导电的固态电解质对锂–溴电池的发展至关重要（因为液溴必须与高活性的锂金属负极完全隔开）。" });
  s.addNotes("锂–溴电池的典型结构：锂金属负极（常带保护层）+ 非水负极液 | LATP | 溴/溴化锂水溶液正极液。Br₂/Br⁻ 的标准电位约 +1.09 V vs SHE，换算成 vs Li⁺/Li 约 4.1 V，与 Table 2 的约 4.2 V 和 Fig. 6b 零电流处的约 4.2 V 一致。");

  // ---------------- 19. Fig 6b chart ----------------
  s = d.slide("CONTENT");
  s.addText("锂–溴的性能：电压与功率随电流的变化", { placeholder: "title" });
  const cur = ["0", "2", "4", "6", "8", "10", "12"];
  const volt = [4.21, 3.92, 3.65, 3.40, 3.19, 2.79, 2.48];
  const pow = volt.map((v, i) => Math.round(v * +cur[i] * 10) / 10);
  s.addChart([
    { type: d.pres.charts.LINE, data: [{ name: "电压（V，左轴）", labels: cur, values: volt }], options: { chartColors: [HEX.accent2], lineSize: 3, lineDataSymbol: "square", lineDataSymbolSize: 9 } },
    { type: d.pres.charts.LINE, data: [{ name: "功率密度 = V × I（mW cm⁻²，右轴）", labels: cur, values: pow }], options: { chartColors: [HEX.accent3], lineSize: 3, lineDataSymbol: "square", lineDataSymbolSize: 9, secondaryValAxis: true, secondaryCatAxis: true } },
  ], {
    x: 0.5, y: 1.25, w: 7.0, h: 4.4,
    showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    showTitle: true, title: "横轴：电流密度（mA cm⁻²）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    valAxes: [
      { showValAxisTitle: false, valAxisMinVal: 2.0, valAxisMaxVal: 4.5, valAxisMajorUnit: 0.5, valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFormatCode: "0.0", valGridLine: { color: "E3E8EC", size: 1 } },
      { showValAxisTitle: false, valAxisMinVal: 0, valAxisMaxVal: 35, valAxisMajorUnit: 5, valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valGridLine: { style: "none" } },
    ],
    catAxes: [{ catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2 }, { catAxisHidden: true }],
  });
  d.caption(s, "电压按原文 Fig. 6b 近似读取；功率由 V × I 计算（原图低电流处的功率点略高于 V × I，见校注页）。", { x: 0.6, y: 5.7, w: 6.9, h: 0.5 });
  d.column(s, 7.85, 1.3, 4.9, [
    { kind: "def", head: "怎么读这张图", body: "电流越大，电压越低（内阻造成的“压降”）；功率 = 电压 × 电流，先升后趋平，在 12 mA cm⁻² 附近约 30 mW cm⁻²。" },
    { kind: "why", body: "和锂–空气比：溴的氧化还原很快，不需要贵金属催化剂，所以电压掉得慢、功率高（~30 vs ~15 mW cm⁻²，Table 2）。" },
    { kind: "matters", body: "电压随电流近似直线下降，说明主要损失来自欧姆电阻，大头在 LATP 膜：膜越薄、电导率越高，功率就越大。" },
  ], 0.18);
  s.addNotes("从 0 到 12 mA cm⁻²，电压由约 4.2 V 降到约 2.5 V，斜率约 0.14 V/(mA cm⁻²)，相当于面积比电阻约 140 Ω cm²。这个数量级的电阻主要来自几十到几百微米厚的陶瓷膜。（据图估算，非原文数据。）");

  // ---------------- 20. Bromine vapour & flow ----------------
  s = d.slide("CONTENT");
  s.addText("溴的麻烦：蒸气压，以及液流电池的解法", { placeholder: "title" });
  d.fig(s, "br_flow", { x: 0.45, y: 1.2, w: 7.55, h: 4.1 });
  d.column(s, 8.2, 1.3, 4.55, [
    { kind: "hist", body: "1970 年代起，Exxon 等公司开发锌–溴液流电池，用泵让含溴电解液在外部循环。2015–2016 年 Bai、Bazant 等把液流思路用于锂–溴，使用高浓度溴正极液（Refs 220、222）。" },
    { kind: "why", body: "密闭的静态电池里，溴强烈挥发，蒸气压升高会把陶瓷膜撑破；为安全只能用稀溶液，能量又上不去。改成液流后，正极液在外部储罐循环，浓度和压力都好控制。" },
    { kind: "matters", body: "液流设计让高浓度溴正极液可用，锂–溴才有望更实用（原文观点）。" },
  ], 0.18);
  d.quote(s, { x: 0.6, y: 5.5, w: 12.15, en: "Lithium–bromine batteries can therefore be considered as an intermediate platform between lithium-ion batteries (that is, with a solid cathode and a relatively low energy density) and lithium–air batteries (with a gaseous cathode and a high energy density, but with many challenging problems).", zh: "因此，锂–溴电池可视为介于锂离子电池（固态正极、能量密度较低）与锂–空气电池（气态正极、能量密度高但难题很多）之间的中间平台。" });
  s.addNotes("原文：直到最近，锂–溴电池的主要挑战都是陶瓷固态电解质膜在运行中的劣化；溴发烟、强氧化，在密闭静态电池中积累的高蒸气压很容易使陶瓷隔膜破裂，也限制了正极液的浓度。近期研究（Ref. 222）表明在设计合适的液流电池中可以避免这些问题。");

  // ---------------- 21. Platform comparison ----------------
  d.section("4 对比与校注");
  s = d.slide("CONTENT");
  s.addText("三种体系放在一起看", { placeholder: "title" });
  d.fig(s, "platform", { x: 0.5, y: 1.15, w: 12.3, h: 4.45 });
  d.block(s, { x: 0.6, y: 5.68, w: 5.9, kind: "matters", tint: true, body: "同一类 LATP 膜隔开锂和液/气态正极，只换正极物质，就得到新的电池化学。" });
  d.block(s, { x: 6.8, y: 5.68, w: 5.95, kind: "note", tint: true, body: "数值取自 Table 2，能量密度只按活性物质计；锂离子一栏为定性描述。" });
  s.addNotes("Table 2：Li–空气 ~10,000 Wh kg⁻¹、~15 mW cm⁻²、~100 圈、2.8–3.7 V；Li–S ~1,500 Wh kg⁻¹、~5 mW cm⁻²、~300 圈、~2.30 V；Li–Br ~1,200 Wh kg⁻¹、~30 mW cm⁻²、~100 圈、~4.2 V。注意三者的循环寿命都只有几百圈，离实用还远。");

  // ---------------- 22. Errata 1 ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注①：单位、化学式与反应式", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① 第 7 页：容量单位", body: "原文：“anode capacity of ~3,800 mA g⁻¹ and a cathode capacity of ~1,675 mA g⁻¹”。\n比容量的单位应为 mAh g⁻¹（mA g⁻¹ 是电流密度的单位）。按 mAh g⁻¹，锂约 3,860、硫约 1,672，与正文数值相符。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 第 6 页：锂盐缩写", body: "原文：“Li/PEO–LiTFSI || LATP || … where LiTSFI is lithium bis(trifluoromethane)sulfonimide”。\n同一句里先写 LiTFSI，后写 LiTSFI；正确缩写为 LiTFSI。" });
  d.block(s, { x: 0.6, y: 3.95, w: 5.9, kind: "note", tint: true, head: "③ Fig. 6a：溴的半反应没有配平", body: "图中写作 Br₂ + e⁻ → 2Br⁻，两边电荷不等。\n应为 Br₂ + 2e⁻ → 2Br⁻（每个 Br₂ 得 2 个电子），与图中总反应 2Li + Br₂ ⇌ 2LiBr 一致。" });
  d.block(s, { x: 6.85, y: 3.95, w: 5.9, kind: "note", tint: true, head: "④ Fig. 6b：功率点与 V × I 不完全一致", body: "按图读数，2 mA cm⁻² 时电压约 3.9 V，功率应约 7.8 mW cm⁻²，图中却约 10–11；电流越大两者越接近（12 mA cm⁻² 时均约 30）。可能是重绘或取数误差，读图时以 V × I 为准。" });
  s.addNotes("①②③ 属于明确的笔误；④ 依据对原图的像素读数（误差约 ±0.5 mW cm⁻²），低电流处的差别明显超过读数误差。");

  // ---------------- 23. Errata 2 ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注②：数值与名称的不一致", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "⑤ Li–S 电压与 LATP 还原电位", body: "正文说 Li–S 工作电压约 2.0 V，Table 2 写约 2.30 V；正文说 Ti⁴⁺ 约 2.4 V 被还原，Fig. 5d 标的窗口下限是约 2.3 V。\n结论不变（放电平台约 2.1 V，低于 LATP 的还原电位），但具体数值宜以原始文献为准。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "⑥ Table 2：参考文献编号疑似错位", body: "Li–空气一行引 Refs 39、40，Li–S 一行引 Refs 41、42。但 39–42 是 PVDF 凝胶电解质、LiPON 薄膜和 LLTO 的文献，与这两种电池无关。\n正文对应位置引的是 Refs 50、51 和 52、53，表中编号很可能整体错了 11 位。" });
  d.block(s, { x: 0.6, y: 4.45, w: 12.15, kind: "def", tint: true, head: "⑦ 名称辨析：LISICON 还是 NASICON？LATP 指哪个成分？", body: "正文称混合 Li–S 用的 LATP 是 NASICON 型，Fig. 5c 却标“LISICON membrane”：商用玻璃陶瓷常被厂家叫作 LISICON，但结构属 NASICON 型。另外，原文在 Li–空气部分把含 Si 的 Li₁₊ₓ₊ᵧAlₓTi₂₋ₓP₃₋ᵧSiᵧO₁₂ 也叫 LATP，与 Li₁₊ₓAlₓTi₂₋ₓ(PO₄)₃ 共用一个缩写。" });
  s.addNotes("⑥ 的依据：原文第 2 页引言中“lithium–air batteries50,51, lithium–sulfur batteries52,53”，以及第 6、8 页正文的引用。⑦ 不是错误，但很容易让初学者混淆。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["双电解质思路", "电极保持液/气态，避开固–固界面；SSE 只放 Li⁺ 通过，挡住溶解物、水、O₂ 和枝晶"],
    ["锂–空气", "有机负极液 | LATP | 水系正极液；酸性正极液电压更高（4.23 vs 3.4 V），解耦 ORR/OER 电极延长寿命"],
    ["锂–硫", "从全固态走向混合电解质；软中间层改善锂/膜接触；LATP 会被还原，LYZP 更相容"],
    ["锂–溴", "反应快、功率高（~30 mW cm⁻²）；溴蒸气压是大敌，液流设计可用高浓度正极液"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“In contrast to the all-solid-state strategy, batteries based on a solid electrolyte and liquid electrodes can avoid the issue of high charge-transfer resistance.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "与全固态路线不同，基于固态电解质和液态电极的电池可以避开电荷转移电阻高的问题。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.9, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章把同样的“固态电解质隔开两种液体”思路推广到水系电池：两边都是水溶液，Li⁺ 或 Na⁺ 只当“介体离子”平衡电荷。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
