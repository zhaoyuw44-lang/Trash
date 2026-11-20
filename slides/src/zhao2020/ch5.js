// Zhao et al. 2020 — Chapter 5: 设计策略
const fs = require("fs");
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Zhao et al., Nat. Rev. Mater. 2020",
  full: "Zhao, Stalin, Zhao & Archer. Designing solid-state electrolytes for safe, energy-dense batteries. Nature Reviews Materials (2020). doi:10.1038/s41578-019-0165-5",
};

// Warn when SVG text would land below 11 pt on the slide (icons and sub/superscripts excluded).
function guardFigs(d) {
  const orig = d.fig.bind(d);
  d.fig = (s, name, box, o) => {
    const r = orig(s, name, box, o);
    const info = d.figInfo[name];
    const items = [...fs.readFileSync(info.svg, "utf8").matchAll(/<text [^>]*font-size="(\d+(?:\.\d+)?)"[^>]*>(.*?)<\/text>/g)]
      .map((m) => ({ size: +m[1], t: m[2].replace(/<[^>]+>/g, "").replace(/​/g, "") }))
      .filter((it) => !/^(\+|e−|\d)?$/.test(it.t));
    const small = items.filter((it) => (it.size * r.w * 72) / info.w < 10.95);
    if (small.length) console.warn(`  ! ${name}: ${small.length} text(s) < 11 pt, e.g. "${small[0].t}" ${((small[0].size * r.w * 72) / info.w).toFixed(1)} pt`);
    return r;
  };
}

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch5_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 5, chapterTitle: "设计策略", figDir });
  d.registerFigs(info);
  guardFigs(d);
  const C = d.C;
  const card = (s, x, y, w, h, fill) => s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 5 章\n怎样设计更好的固态电解质？", { placeholder: "title" });
  s.addText("五类策略：电导率 · 电压窗口 · 枝晶 · 选择性 · 界面", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文“Strategies to improve SSE properties”一节（第 12–17 页，含 Fig. 5、Fig. 6）。右侧图标：上面是正极，中间是“聚合物链 + 陶瓷颗粒”的复合电解质，下面是 Li 负极，白色箭头是 Li⁺ 的通路。原文的总体思路：对 SPE 主要是提高电导率、电压稳定性和抑制枝晶；对 SIE 还要额外解决界面问题。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "提高离子电导率", "SIE：载流子、骨架、计算筛选；SPE：解离、Tg、结晶度"],
    ["2", "拓宽电压窗口", "双层电解质、阴离子界面相、正极包覆"],
    ["3", "抑制枝晶", "交联、嵌段共聚物、多层、纳米限域"],
    ["4", "提高离子选择性", "单离子导体：让 Li⁺ 承担全部电流"],
    ["5", "降低界面电阻", "3D 骨架、聚合物缓冲层、润湿与原位聚合"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.4 + i * 1.07;
    card(s, 0.6, y, 6.4, 0.92, "F5F7F9");
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.18, w: 0.56, h: 0.56, fill: { color: C.text1 }, color: C.background1, fontSize: 19, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.6, y: y + 0.08, w: 5.3, h: 0.4, fontSize: 19, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.6, y: y + 0.48, w: 5.3, h: 0.36, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("与上一章的衔接：一种失效，一类对策", { x: 7.4, y: 1.4, w: 5.4, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  d.fig(s, "strategy_map", { x: 7.4, y: 1.95, w: 5.35, h: 4.85 });
  s.addNotes("第 4 章列出了失效清单，本章按原文顺序讲五类对策。右图把两章对应起来：电导率低 → 提高电导率；高/低电压下分解 → 拓宽窗口；枝晶 → 抑制枝晶；阴离子迁移造成极化 → 提高选择性；点接触与界面反应 → 降低界面电阻。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：SSE 设计策略的几个里程碑", { placeholder: "title" });
  d.fig(s, "design_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 3.6 });
  d.block(s, { x: 0.6, y: 5.0, w: 5.9, kind: "why", tint: true, body: "早期策略多是“单点突破”：只提电导率，或只加填料。近十年转向“多目标设计”：交联、复合、多层结构，同时照顾电导率、模量、窗口和界面。" });
  d.block(s, { x: 6.8, y: 5.0, w: 5.9, kind: "matters", tint: true, body: "几乎每个里程碑都是在解决上一代材料暴露的新问题：这正是本章“失效 → 对策”的逻辑。" });
  s.addNotes("时间轴不按比例，颜色对应五类策略：紫色提高电导率，青色选择性，橙色电压窗口，红色枝晶，灰色界面。所有条目都是原文引用的文献：Fenton/Parker/Wright 1973、Weston & Steele 1982、Bannister 1984、Croce 1998、Seki 2005、Kamaya 2011、Khurana 2014、Han 2017。");

  // ---------------- 4. SIE: carriers ----------------
  d.section("1 提高离子电导率");
  s = d.slide("CONTENT");
  s.addText("策略①  无机 SSE：载流子和空位要“刚刚好”", { placeholder: "title" });
  d.fig(s, "carrier_opt", { x: 0.45, y: 1.2, w: 6.6, h: 4.4 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "1993 年 Inaguma 等发现钙钛矿 LLTO 体相电导率达 10⁻³ S cm⁻¹ 量级；1994 年 Kawai 等研究了 La₀.₆₇₋ₓLi₃ₓTiO₃ 电导率随 x 的变化。2016 年 Richards、Ceder 等用计算设计了 Li₁₊₂ₓZn₁₋ₓPS₄。" },
    { kind: "why", body: "以前靠试错掺杂。现在明白：电导率取决于可动载流子和可跳的空位，两者此消彼长，所以存在最优组成。" },
    { kind: "matters", body: "掺杂不是越多越好。设计 SIE 时要同时数“载流子”和“空位”，再看迁移能垒和晶体结构。" },
  ]);
  d.block(s, { x: 0.6, y: 5.75, w: 6.45, kind: "def", tint: true, head: "原文给出的最优组成", size: 14, body: "Li₁₊₂ₓZn₁₋ₓPS₄：x = 0.5；Li₄₋₃ₓAlₓSiO₄：x ≈ 0.25；La₀.₆₇₋ₓLi₃ₓTiO₃：x ≈ 0.1" });
  s.addNotes("原文：SIE 的电导率受载流子浓度、迁移能垒和晶体结构影响；在“既有大量载流子、又有空的跳跃位点”的最优浓度下电导率最大。图中的抛物线只是示意：载流子比例为 c 时，可跳的空位比例约为 1 − c，二者乘积在中间最大。");

  // ---------------- 5. SIE: framework ----------------
  s = d.slide("CONTENT");
  s.addText("策略①  无机 SSE：换一个“更软”的阴离子骨架", { placeholder: "title" });
  d.fig(s, "framework", { x: 0.45, y: 1.2, w: 6.6, h: 4.4 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2001 年 Kanno 与 Murayama 把 LISICON 中的 O 换成 S，得到 thio-LISICON；2011 年 Kamaya 等报道 LGPS，室温 12 mS cm⁻¹，首次比肩液体电解质。" },
    { kind: "why", body: "以前在氧化物里找快离子导体。S²⁻ 更大、更易极化，与 Li⁺ 结合更弱、通道更宽，于是转向硫化物，再用 Cl⁻、Se²⁻、Sb⁵⁺ 替换继续微调。" },
    { kind: "matters", body: "代价是：晶格越“软”、畸变越大，热力学稳定性往往越差（第 4 章的窄窗口）。另两条路：减薄电解质、施加应变。" },
  ]);
  d.block(s, { x: 0.6, y: 5.75, w: 6.45, kind: "def", tint: true, head: "极化率 Polarizability", size: 14, body: "电子云在电场下变形的难易程度。阴离子越易极化，就越能“让开路”给经过的 Li⁺。" });
  s.addNotes("原文还提到：高度可畸变的晶格能扰乱离子排列、打破迁移能垒的简并，从而增强传输，但大畸变也意味着热力学稳定性下降。减薄电解质能缩短传输距离，例子是 LiPON 和无定形 LLTO 薄膜。机械应变在氧离子导体中能提高电导率，但在锂电中还没有被充分研究。");

  // ---------------- 6. Screening ----------------
  s = d.slide("CONTENT");
  s.addText("策略①  计算筛选：先在电脑里“排除”", { placeholder: "title" });
  d.fig(s, "screening", { x: 0.45, y: 1.15, w: 6.45, h: 4.18 });
  d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: "2017 年 Sendek 等对 12 000 多种含 Li 晶体做整体筛选；2018 年 Muy 等用晶格动力学描述符平衡稳定性与迁移率；2019 年 Xiong 等在计算指导下发现榍石型 LiTaSiO₅ 导体。" },
    { kind: "why", body: "以前一种一种地合成、测量，速度慢。高通量计算先排除大量“不可能”的化合物，把实验集中到少数候选上。" },
    { kind: "matters", body: "计算和实验仍会有出入（如第 4 章的稳定窗口），所以计算是“筛子”，不是“裁判”。" },
  ]);
  d.block(s, { x: 0.6, y: 5.48, w: 6.3, kind: "def", tint: true, head: "例：橄榄石结构", size: 14, body: "计算显示其 Li 能带中心低、阴离子能带中心高，有望摆脱“稳定性 vs 迁移率”的此消彼长。" });
  s.addNotes("原文的例子：橄榄石结构被算出具有低的 Li 能带中心和高的阴离子能带中心，有望克服稳定性与离子迁移率之间的权衡；计算指导设计的 Zr 掺杂 LiTaSiO5 开辟了“榍石型超离子导体”新家族，沿一个方向扩散快，还能跨通道迁移。");

  // ---------------- 7. SPE: Venn ----------------
  s = d.slide("CONTENT");
  s.addText("策略①  聚合物：解离、Tg、结晶度三管齐下", { placeholder: "title" });
  d.fig(s, "venn", { x: 0.45, y: 1.15, w: 6.8, h: 4.95 });
  d.caption(s, "据原文 Fig. 5a 重绘", { x: 0.6, y: 6.2, w: 6.5 });
  d.column(s, 7.5, 1.3, 5.25, [
    { kind: "hist", body: "1983 年 Berthier、Armand 等用核磁共振证明：PEO 中的离子主要在无定形区移动。从此“降结晶度、降 Tg”成为 SPE 设计主线。" },
    { kind: "why", body: "以前把 PEO 加热到熔点以上来“化掉”晶区。现在用分子设计在室温做到：高介电常数主链助解离，侧链降 Tg，交联和接枝颗粒抑制结晶。" },
    { kind: "matters", body: "三个方向常常互相牵制，所以原文推荐落在“重叠区”的结构：一种设计同时照顾两三个方面。" },
    { kind: "def", head: "玻璃化转变温度 Tg", body: "低于 Tg，链段被“冻住”；高于 Tg，链段能动，Li⁺ 跟着链段跳。" },
  ], 0.18);
  s.addNotes("原文的例子：聚醚电解质的电导率随主体高分子的介电常数升高而升高；接上烯丙基醚侧链，或加入 PC/EC、丁二腈等增塑剂，可以增大自由体积；系留的离子基团一举两得：既帮盐解离，又降低 Tg。另外要注意主链上溶剂化位点之间的连通性，它影响 Li⁺ 的迁移速率。");

  // ---------------- 8. SPE: trade-off ----------------
  s = d.slide("CONTENT");
  s.addText("策略①  聚合物：电导率与力学强度的“跷跷板”", { placeholder: "title" });
  d.fig(s, "tradeoff", { x: 0.45, y: 1.2, w: 6.45, h: 4.5 });
  d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: "1990 年 Abraham 与 Alamgir 用 EC/PC 增塑，得到“接近液体”的电导率；2004 年 Alarco、Armand 等提出用塑晶丁二腈作通用基体。" },
    { kind: "why", body: "增大自由体积几乎总让材料变软，因为晶区才是抗变形的主力。交联把链“锁住”：既抑制结晶，又提高剪切模量。" },
    { kind: "matters", body: "电导率和模量要一起报告。原文的例子：接上磺基甜菜碱两性离子基团，Tg 下降、解离增强，电导率提高两个数量级。" },
  ]);
  d.quote(s, { en: "Increasing the free volume is, however, almost always associated with a decrease in the mechanical stability of the system", zh: "然而，增大自由体积几乎总伴随着体系力学稳定性的下降" });
  s.addNotes("图中的虚线代表常见的权衡：越导越软、越硬越不导。交联网络和“高分子接枝纳米颗粒”（如 PEO 链共价接在二氧化硅颗粒上，颗粒充当高模量节点）能跳出这条线，同时提高电导率和模量。");

  // ---------------- 9. Fillers ----------------
  s = d.slide("CONTENT");
  s.addText("策略①  复合电解质：陶瓷填料的三面性", { placeholder: "title" });
  d.fig(s, "fillers", { x: 0.95, y: 1.15, w: 11.4, h: 4.15 });
  d.column(s, 0.6, 5.4, 3.85, [{ kind: "hist", body: "1982 年 Weston 与 Steele 往 PEO 里加惰性填料；1998 年 Croce 等加入纳米 TiO₂、Al₂O₃，50 °C 下达到 ~10⁻⁴ S cm⁻¹。" }]);
  d.column(s, 4.75, 5.4, 3.85, [{ kind: "why", body: "以前把填料当“稀释剂”压结晶度。后来发现表面 Lewis 酸位能拉住阴离子、提高 t⁺；彼此连通的填料还提供额外通道。" }]);
  d.column(s, 8.9, 5.4, 3.85, [{ kind: "matters", body: "填料也可能“钉住”链段、阻断通道。原文建议研究并利用陶瓷与聚合物之间的耗尽相互作用。" }]);
  s.addNotes("①：填料表面的 Lewis 酸位与阴离子相互作用，帮助盐解离，同时提高阳离子迁移数。②：Liu 等 2017 年用取向排列的陶瓷纳米线，让 Li⁺ 沿连续的陶瓷表面传输。③：Chen 等 2019 年发现醚氧的孤对电子与陶瓷表面的 Li⁺ 作用，链段运动变慢、链吸附在陶瓷上，界面传输电阻反而增大。");

  // ---------------- 10. Fig. 5b chart ----------------
  d.section("2 拓宽电压窗口");
  s = d.slide("CONTENT");
  s.addText("策略②  哪些设计能把聚合物的窗口抬高？", { placeholder: "title" });
  const cats = ["LiCF₃SO₃", "LiBETI", "LiBOB", "全氟聚醚", "苯乙烯嵌段", "聚丙烯腈", "酰胺嵌段", "聚碳酸酯", "SiO₂–SO₃Li", "硼酸根阴离子", "STFSILi", "PEO", "PPO", "PEGDA", "PE–PEO"];
  const vals = [4.3, 4.9, 5.0, 4.3, 4.5, 5.0, 5.0, 5.0, 5.5, 5.5, 6.5, 5.0, 5.0, 5.0, 7.0];
  const groups = [["换锂盐", 0, 3, HEX.dk2], ["换主链", 3, 8, HEX.accent2], ["单离子导体", 8, 11, HEX.accent3], ["交联结构", 11, 15, HEX.accent4]];
  s.addChart(d.pres.charts.BAR, groups.map(([n, a, b2]) => ({ name: n, labels: cats, values: vals.map((v, i) => (i >= a && i < b2 ? v : 0)) })), {
    x: 0.5, y: 1.2, w: 6.9, h: 5.15, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 35,
    chartColors: groups.map((g) => g[3]),
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisMinVal: 3, valAxisMaxVal: 7.5, valAxisMajorUnit: 1,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "阳极稳定上限（V vs Li⁺/Li，惰性工作电极）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "b", legendFontSize: 12, legendColor: HEX.dk1, legendFontFace: "+mn-lt",
  });
  d.caption(s, "据原文 Fig. 5b 柱高读出（约 ±0.1 V）。", { x: 0.6, y: 6.4, w: 6.8 });
  d.column(s, 7.7, 1.3, 5.05, [
    { kind: "hist", body: "2002 年 Xu、Angell 等报道 LiBOB 作锂盐。后来发现它能在正极表面形成只导 Li⁺ 的阴离子界面相，帮聚醚扛住高电压。" },
    { kind: "why", body: "图中数据都对惰性工作电极测得，所以 PEO 也显示 5 V。真实正极含炭黑，会催化分解，PEO 在 >4.2 V 已不稳定（第 4 章）。" },
    { kind: "matters", body: "四类手段都能抬高窗口：换盐、换主链、单离子化、交联；PE–PEO 交联最高（约 7 V）。窗口图可以指导多层电解质怎么“分工”。" },
  ]);
  s.addNotes("原文图注：图中比较了锂盐（LiCF3SO3、LiBETI、LiBOB）、主链化学、单离子导体和电解质结构对阳极稳定性的影响，都是相对惰性工作电极测得。注意原文图注把三氟甲磺酸锂写成 Li(CF3SO3)2，与图中标注不一致（见校注页）。");

  // ---------------- 11. Bilayer / anionic interphase ----------------
  s = d.slide("CONTENT");
  s.addText("策略②  聚合物的高压对策：分层与“去溶剂化层”", { placeholder: "title" });
  d.fig(s, "bilayer", { x: 0.45, y: 1.2, w: 6.6, h: 4.45 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2005 年 Seki 等在高压正极与聚醚之间加了一层 Li₃PO₄ 当人工 CEI，是最早的此类工作之一；2019 年 Zhou 等提出双层聚合物电解质：正极侧聚(N-甲基丙二酰胺)，负极侧 PEO。" },
    { kind: "why", body: "液体电解质靠碳酸亚乙烯酯等添加剂在正极成膜；固体中添加剂扩散不到电极表面，用不上。于是改用盐添加剂、人工钝化层和多层结构。" },
    { kind: "matters", body: "含 LiBOB 的交联电解质直接在正极上固化，1 C 下稳定循环 >1000 圈；硼酸根还能减轻 Al 集流体的腐蚀。" },
  ]);
  d.quote(s, { en: "Extending the voltage stability of polymer electrolytes has been a long-standing challenge", zh: "拓宽聚合物电解质的电压稳定性，一直是一个长期的难题" });
  s.addNotes("两种思路：①双层电解质，两层聚合物必须相容，而且界面上不能形成空间电荷层；②阴离子型或人工界面相，充当“去溶剂化层”，只让 Li⁺ 通过、把醚链挡在外面，从而推迟醚类电解质的电化学分解。原位聚合的聚碳酸亚乙烯酯（PVCA）也被证明对高压正极稳定。");

  // ---------------- 12. Coatings ----------------
  s = d.slide("CONTENT");
  s.addText("策略②  无机 SSE 的高压对策：给正极“穿外衣”", { placeholder: "title" });
  d.fig(s, "coating", { x: 0.45, y: 1.2, w: 6.3, h: 4.35 });
  d.column(s, 7.05, 1.3, 5.7, [
    { kind: "hist", body: "2006 年 Ohta、Takada 等在正极与硫化物 SSE 之间插入 Li₄Ti₅O₁₂ 缓冲层；随后又用 LiNbO₃ 包覆 LiCoO₂，大幅降低了界面电阻。" },
    { kind: "why", body: "硫化物在高电压下会被氧化，只是产物绝缘、钝化了表面。XPS 与 TEM 显示：界面会生成 P₂Sₓ、LiCl、S 和多硫化物，还有 S、P、Co 互扩散。包覆层把两者隔开。" },
    { kind: "matters", body: "包覆已是硫化物全固态电池的“标配”工序。包覆层要薄、导 Li⁺、不导电子，并且对两边都稳定。" },
  ]);
  d.block(s, { x: 0.6, y: 5.75, w: 6.15, kind: "def", tint: true, head: "为什么叫“缓冲层”", size: 14, body: "它让 Li⁺ 的化学势在界面上平缓过渡，抑制空间电荷层，同时阻挡元素互扩散。" });
  s.addNotes("原文：一些 SIE（如硫化物）计算上会在高电压下被热力学氧化，绝缘的氧化产物钝化表面，这解释了测得的窗口为什么更宽。Li6PS5Cl 与 LiCoO2 接触后生成 P2Sx、LiCl、单质 S 和多硫化物；LiCoO2 与 Li2S–P2S5 界面上 S、P、Co 互扩散。LiNbO3、Li4Ti5O12、Li3PO4 和 Al2O3 包覆层都能提高与正极的相容性。");

  // ---------------- 13. Dendrite: polymer architectures ----------------
  d.section("3 抑制枝晶");
  s = d.slide("CONTENT");
  s.addText("策略③  抑制枝晶：把“硬”和“导”分给不同链段", { placeholder: "title" });
  d.fig(s, "dendrite_poly", { x: 1.55, y: 1.15, w: 10.2, h: 4.15 });
  d.column(s, 0.6, 5.42, 4.6, [{ kind: "hist", body: "2007 年起 Balsara 组研究 PS-b-PEO；2014 年 Khurana、Archer 等的交联 PE–PEO 室温达 ~10⁻⁵ S cm⁻¹，寿命提高一个数量级。" }]);
  d.column(s, 5.45, 5.42, 3.55, [{ kind: "why", body: "PEO 要加热才导离子，一热就软。办法是让硬段 / 交联点给模量，PEO 段负责导离子。" }]);
  d.column(s, 9.2, 5.42, 3.55, [{ kind: "matters", body: "硬的 PS 段把枝晶尖端的电流“摊开”，尖端长不快；但嵌段共聚物电导率低，仍需高温工作。" }]);
  s.addNotes("原文图注：高模量电解质在沉积时施加压力抑制枝晶，可以作为负极侧的独立层，也可以以嵌段共聚物硬段或交联网络中高模量链段的形式存在于体相中；单离子导体中阴离子几乎不迁移，避免了阴离子在界面的极化和分解。互穿网络中，刚性网络抑制枝晶，柔软区域让 Li⁺ 移动。");

  // ---------------- 14. Confinement ----------------
  s = d.slide("CONTENT");
  s.addText("策略③  不靠“硬”，靠“限域”", { placeholder: "title" });
  d.fig(s, "confine", { x: 0.45, y: 1.2, w: 6.6, h: 4.1 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2014 年 Lu、Tu 与 Archer 发现纳米孔陶瓷膜能稳定 Li 沉积；2018 年 Choudhury 等用工况可视化证实：孔径低于临界值时，大电流下也不长枝晶。" },
    { kind: "why", body: "以前认为必须用很硬的隔膜。限域的思路是：把沉积限制在比“最不稳定核”还小的尺度上，枝晶长不起来。" },
    { kind: "matters", body: "软而有序的纳米结构也能挡枝晶，大大放宽了选材范围；负极上的高分子涂层也走类似思路。" },
  ]);
  d.quote(s, { en: "contrary to prior understanding that a high-modulus (>6 × 10⁹ Pa) separator is required to prevent dendrite growth in Li, nanostructured electrolytes with much lower shear-modulus values (~10⁵ Pa) were shown to be effective for the same purpose.", zh: "与以往认为必须使用高模量（>6 × 10⁹ Pa）隔膜才能防止 Li 枝晶的认识相反，剪切模量低得多（~10⁵ Pa）的纳米结构电解质也被证明同样有效。" });
  s.addNotes("负极涂层的例子（原文）：动态交联高分子能随枝晶产生的局部应力在“可流动液体”和“坚硬固体”之间切换；含氢键的交联涂层能适应体积变化，使沉积更致密均匀；总体上，低表面能、高介电常数的高分子涂层给出最稳定的 Li 沉积。复合电解质兼有聚合物的柔性和无机填料的机械屏障作用。");

  // ---------------- 15. Ion selectivity ----------------
  d.section("4 提高离子选择性");
  s = d.slide("CONTENT");
  s.addText("策略④  离子选择性：让 Li⁺ 承担全部电流", { placeholder: "title" });
  d.fig(s, "single_ion", { x: 0.45, y: 1.2, w: 6.6, h: 4.45 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "1984 年 Bannister 等把阴离子接到高分子上，提出单离子导体；2013 年 Bouchet、Armand 等的 BAB 三嵌段单离子聚合物 t⁺ > 0.85；2016 年 Ma 等的 LiPSsTFSI 达到 0.91。" },
    { kind: "why", body: "以前把盐溶进聚合物（双离子导体），电流常由阴离子主导。电极不“接收”阴离子，它们就在电极附近堆积，形成浓度梯度。" },
    { kind: "matters", body: "浓差过电位限制充放电速率和工作电压；阴离子在高 / 低电位分解还会造成 SEI 不均、局部析锂。" },
  ]);
  d.quote(s, { en: "Single-ion conductors provide a promising and practical solution to this issue.", zh: "单离子导体为这一问题提供了有前景且切实可行的解决方案。" });
  s.addNotes("无机 SSE 通常被认为阳离子迁移数接近 1，几乎全部电流由阳离子承担；而传统 SPE 中阴离子也能动，电流常被阴离子主导。Doyle、Fuller 与 Newman 在 1994 年用模型说明了迁移数对锂/聚合物电池的重要性：迁移数接近 1 时，浓差极化可以大大减小。");

  // ---------------- 16. Single-ion chart ----------------
  s = d.slide("CONTENT");
  s.addText("策略④  单离子导体的短板：电导率太低", { placeholder: "title" });
  const si = [["PMTFSI 均聚物：1.1×10⁻¹²", 1.1e-12], ["共聚 EO（25 °C）：2.3×10⁻⁶", 2.3e-6], ["LiPSsTFSI（90 °C）：1.4×10⁻⁴", 1.35e-4], ["参照 ~1 mS cm⁻¹：10⁻³", 1e-3]];
  s.addChart(d.pres.charts.BAR, [{ name: "电导率", labels: si.map((r) => r[0]), values: si.map((r) => r[1]) }], {
    x: 0.5, y: 1.2, w: 6.6, h: 4.6, barDir: "bar", barGapWidthPct: 50, catAxisOrientation: "maxMin",
    chartColors: [HEX.accent3, HEX.accent2, HEX.accent3, HEX.accent6], invertedColors: [HEX.accent3],
    valAxisLogScaleBase: 10, valAxisMinVal: 1e-13, valAxisMaxVal: 1e-2,
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelFontSize: 11, valAxisLabelColor: HEX.dk2, valAxisLabelFormatCode: "0E+0",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "离子电导率（S cm⁻¹，对数坐标）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "数据：原文第 16 页（原文以 mS cm⁻¹ 给出，此处换算为 S cm⁻¹）。最后一行是原文引言中液体电解质的量级，仅作参照。", { x: 0.6, y: 5.85, w: 6.5, h: 0.5 });
  d.column(s, 7.4, 1.3, 5.35, [
    { kind: "hist", body: "2017 年 Savoie、Webb 与 Miller 提出 Lewis 酸性聚合物：主链“拉住”阴离子；同年 Park、Dincă 等报道支持 Li⁺、Na⁺、Mg²⁺ 的阴离子型 MOF 单离子导体。" },
    { kind: "why", body: "单离子导体去掉了阴离子这部分载流子，链段运动也变慢，所以电导率低。最直接的办法是设计主链、提高链段运动：共聚环氧乙烷单元，或加增塑剂。" },
    { kind: "matters", body: "共聚 EO 让 Tg 降到室温以下，电导率提高了六个数量级，但离实用仍差两三个数量级。MOF、COF 等有机框架是新候选。" },
  ]);
  s.addNotes("“六个数量级”由原文两个数值推得：1.1 × 10⁻⁹ 与 2.3 × 10⁻³ mS cm⁻¹ 之比约 2 × 10⁶。注意第一个值原文没有注明温度，按上下文应为室温。LiPSsTFSI 是全电池中最早演示的单离子导体之一，迁移数 0.91，但 90 °C 下只有 0.135 mS cm⁻¹。");

  // ---------------- 17. Fig. 6 ----------------
  d.section("5 降低界面电阻");
  s = d.slide("CONTENT");
  s.addText("策略⑤  降低界面电阻：从“点接触”到“面接触”", { placeholder: "title" });
  d.fig(s, "fig6", { x: 1.55, y: 1.15, w: 10.2, h: 4.1 });
  d.column(s, 0.6, 5.4, 3.85, [{ kind: "hist", body: "2016–17 年 Hu、Wachsman 等用锂化 Si、ALD Al₂O₃、ZnO、Ge 等“亲锂层”改性石榴石表面。" }]);
  d.column(s, 4.75, 5.4, 3.85, [{ kind: "why", body: "液体会自动浸润所有孔隙；固体之间只有点接触。思路：增大接触、加软层、或让界面自己“长好”。" }]);
  d.column(s, 8.9, 5.4, 3.85, [{ kind: "matters", body: "界面电阻常远大于体相电阻：不解决界面，再高的体相电导率也用不上。" }]);
  s.addNotes("原文图注：策略包括构建多孔电解质骨架以增大接触面积、引入原位或非原位形成的聚合物缓冲层、使用润湿剂。为简便，电极都画成圆形颗粒，代表正极和负极，集流体省略。");

  // ---------------- 18. Anode interlayers ----------------
  s = d.slide("CONTENT");
  s.addText("策略⑤  负极侧：让 Li“喜欢”电解质表面", { placeholder: "title" });
  d.fig(s, "wetting", { x: 0.45, y: 1.2, w: 6.6, h: 3.75 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2016 年 Luo 等用锂化 Si 让石榴石从“超疏锂”变为“超亲锂”；2017 年 Han 等用原子层沉积 Al₂O₃，界面电阻从约 1710 降到 1 Ω cm²。" },
    { kind: "why", body: "以前靠加热加压把 Li“压”上去。其他路线：可变形电极（有机 PTO 负极、240 °C 熔融 Li）、BN–聚合物中间层、凝胶层，以及利用界面反应“自建”钝化层。" },
    { kind: "matters", body: "原文提醒：还要在整个寿命中保持贴合、承受体积变化，并经得起量产中的工艺与质量波动。" },
    { kind: "def", head: "亲锂 Lithiophilic", body: "熔融 Li 容易在表面铺展（接触角小）。亲锂层常与 Li 反应或形成合金，把点接触变成面接触。" },
  ], 0.18);
  d.quote(s, { w: 6.45, en: "However, low interfacial resistance alone cannot guarantee practically successful solid-state batteries.", zh: "然而，仅有低界面电阻并不能保证固态电池在实际中取得成功。" });
  s.addNotes("“1710 Ω cm²”是 Han 等原论文中未包覆时的数值，原文只给出了包覆后的 1 Ω cm²。“自建”钝化层的例子：Na3SbS4 在空气中暴露后形成钝化层，稳定了 Na 金属界面；在 Li 与 LGPS 之间引入 1 M LiTFSI 的 DOL–DME 电解液，或在 Li 箔上旋涂磷酸使其与 LGPS 和 Li 反应。");

  // ---------------- 19. Cathode: in situ polymerization ----------------
  s = d.slide("CONTENT");
  s.addText("策略⑤  正极侧：先灌液体，再原位固化", { placeholder: "title" });
  d.fig(s, "insitu_poly", { x: 1.85, y: 1.15, w: 9.6, h: 3.25 });
  d.column(s, 0.6, 4.6, 3.85, [{ kind: "hist", tint: true, body: "2016 年 Porcarelli 等用紫外光固化全环氧乙烷电解质；2019 年本文作者用 Al(OTf)₃ 引发 1,3-二氧戊环原位开环聚合，界面传输快，兼容 S、LiFePO₄ 和 NCM622。" }]);
  d.column(s, 4.75, 4.6, 3.85, [{ kind: "why", tint: true, body: "SPE 与平整的 Li 负极贴得好，与多孔厚正极却贴不好。实验室常用低负载正极（1–3 mg cm⁻²），实用需要高负载厚电极；靠升温提速又会加快副反应。" }]);
  d.column(s, 8.9, 4.6, 3.85, [{ kind: "matters", tint: true, body: "原文认为这是构建电极–电解质界面最有效的方法：制备电解质和构建界面一步完成，也适用于 Mg 电池。" }]);
  s.addNotes("其他办法（原文）：加入少量碳酸酯液体电解液、离子液体或原位聚合的软聚合物作润湿缓冲层；把聚合物基体当正极粘结剂；使用正极支撑的固体电解质框架。原文对最有效方法的原话是：先把电极浸泡在液体前驱体中，再用阳离子、紫外或热引发让液体聚合。");

  // ---------------- 20. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：第 13–17 页", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.35, w: 5.95, kind: "note", tint: true, head: "① Fig. 5 图注：锂盐写法", body: "图注写 “Li(CF₃SO₃)₂”，图中标注为 “Li(CF₃SO₃)”。三氟甲磺酸锂是 LiCF₃SO₃（一个 Li⁺ 配一个阴离子），图注中的下标 2 应为笔误。" });
  d.block(s, { x: 6.8, y: 1.35, w: 5.95, kind: "note", tint: true, head: "② 第 16 页：文献编号错位", body: "“dynamically crosslinked polymer … adaptive interfacial layer” 标为文献 151，但 151 是 Choudhury 等的限域工作；自适应界面层应为文献 152（Liu 等 2017）。" });
  d.block(s, { x: 0.6, y: 3.55, w: 5.95, kind: "note", tint: true, head: "③ 第 17 页：文献编号错位", body: "“polymerize the liquid using cationic⁸⁹” 中的文献 89 是 Monroe & Newman 的枝晶理论；阳离子引发原位聚合应为文献 88（Zhao 等 2019）。" });
  d.block(s, { x: 6.8, y: 3.55, w: 5.95, kind: "note", tint: true, head: "④ Fig. 5 图注：PPO 的全称（存疑）", body: "图注把 PPO 写作 poly(p-phenylene oxide)。所引文献 252 是交联的“毛发状”纳米颗粒电解质，其中 PPO 很可能指聚环氧丙烷 poly(propylene oxide)。" });
  d.block(s, { x: 0.6, y: 5.6, w: 12.15, kind: "def", tint: true, head: "读法提示：“substitution of A for B”", body: "第 14 页 “substitution of P⁵⁺ for Sb⁵⁺” 在这里的意思是用 Sb⁵⁺ 取代 P⁵⁺（如 Na₃PS₄ → Na₃SbS₄），与传统英文用法方向相反，阅读时按材料实例判断。" });
  s.addNotes("校注④把握较低：需要查原始文献 252 确认。其余三条可以直接对照原文的参考文献列表核实。另外，Fig. 5b 中 PEO 显示约 5 V，与正文“>4.2 V 不稳定”并不矛盾：前者是对惰性电极测得的。");

  // ---------------- 21. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.55, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["提高电导率", "SIE：最优载流子浓度、易极化的阴离子骨架、计算筛选；SPE：助解离、降 Tg、降结晶度，复合填料"],
    ["拓宽电压窗口", "双层电解质、LiBOB 等形成的阴离子界面相、正极包覆层（LiNbO₃ 等）"],
    ["抑制枝晶", "交联、嵌段共聚物、多层结构；纳米限域让 ~10⁵ Pa 的软材料也能挡枝晶"],
    ["提高选择性", "单离子导体让 t⁺ → 1、消除浓差极化，但电导率仍需大幅提高"],
    ["降低界面电阻", "亲锂层、聚合物缓冲层、润湿剂；正极侧“先灌液体、再原位固化”"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.5 + i * 0.88;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.52, h: 0.52, fill: { color: C.accent1 }, color: C.background1, fontSize: 17, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.45, y, w: 11.2, h: 0.4, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.45, y: y + 0.4, w: 11.2, h: 0.36, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Taking advantage of interfacial reactions is an emerging strategy to construct a ‘built-in’ passivating interface that can re-form if damaged.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "利用界面反应构建“内置”的钝化界面——即使受损也能重新形成——是一种新兴的策略。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("五类策略之间常有冲突：提高电导率往往牺牲模量，单离子化提高选择性却降低电导率。原文的总体倾向是复合 / 多相 / 多层设计。下一章看这些 SSE 被用在哪些高能量密度电池体系里，以及原文对未来的展望。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
