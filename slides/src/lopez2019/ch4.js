// Lopez et al. 2019 — Chapter 4: 电子传输：导电高分子
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Lopez et al., Nat. Rev. Mater. 2019",
  full: "Lopez, Mackanic, Cui & Bao. Designing polymers for advanced battery chemistries. Nature Reviews Materials (2019). doi:10.1038/s41578-019-0103-6",
};

const AX = {
  catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2,
  catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
  titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
  legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
  catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2, valAxisTitleFontSize: 12, valAxisTitleColor: HEX.dk2,
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch4_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 4, chapterTitle: "电子传输：导电高分子", figDir });
  d.registerFigs(info);
  const C = d.C;

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 4 章\n让“塑料”导电：导电高分子", { placeholder: "title" });
  s.addText("共轭与掺杂 · 硅负极的导电粘结剂 · 硫正极的导电包覆", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文 “Polymer design for electron transport” 一节（第 9–11 页，含 Fig. 5）。普通高分子是绝缘体；本章讲高分子为什么能导电，以及怎样把导电高分子用到 Si 负极和 S 正极里。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "高分子为什么能导电", "共轭 → 能带；掺杂 → 载流子"],
    ["2", "认识四种导电高分子", "聚芴、PEDOT、PANi、PPy 及其电导率"],
    ["3", "硅负极：导电粘结剂", "一材两用；侧链设计；能级不能“掉链子”"],
    ["4", "硫正极：导电包覆与粘结", "PEDOT > PPy > PANi；加工技巧"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.4 + i * 1.12;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 0.96, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.18, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.1, w: 5.1, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.52, w: 5.1, h: 0.36, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.block(s, { x: 0.6, y: 5.95, w: 6.3, kind: "def", head: "与第 3 章的衔接", body: "第 3 章让 Li⁺ 跑得快；电极反应还需要电子同时到场。本章讲电子的“路”。" });
  d.fig(s, "chapter_strip", { x: 7.6, y: 1.35, w: 5.0, h: 5.4 });
  s.addNotes("电极反应 Li⁺ + e⁻ + 宿主 → 嵌锂产物：离子和电子缺一不可。复合电极里，离子走电解液或聚合物电解质，电子走导电碳或导电高分子。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从“苯胺黑”到诺贝尔奖", { placeholder: "title" });
  d.fig(s, "cp_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 3.95 });
  d.block(s, { x: 0.6, y: 5.3, w: 5.9, kind: "why", tint: true, body: "以前：高分子被当作典型的绝缘体（电线外皮）。1977 年的掺杂聚乙炔证明“塑料”也能像金属一样导电，开辟了有机电子学。" });
  d.block(s, { x: 6.8, y: 5.3, w: 5.9, kind: "matters", tint: true, body: "导电高分子在电池里最早被当作电极活性物质；本综述关注的是另一种用法：作导电粘结剂和包覆层。" });
  s.addNotes("时间轴不按比例。紫色：导电高分子的诞生；橙色：诺贝尔奖；青色：本章引用的电池应用。PEDOT 的开发时间记为 1980 年代末（约 1988 年，Bayer 公司），具体年份把握不大。");

  // ---------------- 4. Section ----------------
  d.section("1 高分子怎样导电");
  s = d.slide("DARK_SECTION");
  s.addText("高分子怎样导电", { placeholder: "title" });
  s.addText("共轭让能级连成“带”，掺杂往带里放进载流子", { placeholder: "body" });
  s.addNotes("对应原文 “Molecular design of electronically conducting polymers” 小节（第 9 页）和 Fig. 5a。");

  // ---------------- 5. Conjugation ----------------
  s = d.slide("CONTENT");
  s.addText("共轭：能级越来越密，连成能带", { placeholder: "title" });
  d.fig(s, "conjugation", { x: 0.5, y: 1.25, w: 6.6, h: 4.55 });
  d.caption(s, "据原文 Fig. 5a 重绘（示意）", { x: 0.6, y: 5.85, w: 6.5 });
  d.quote(s, { x: 0.6, y: 6.15, w: 6.5, en: "Conventional polymer materials are electronically insulating.", zh: "常规高分子材料是电子绝缘体。" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1928 年 Bloch 的能带理论说明晶体中的能级会连成“带”；1931 年 Hückel 算出共轭分子的 π 能级。1955 年 Peierls 指出一维链会出现单双键交替，所以聚乙炔仍留有能隙。" },
    { kind: "why", body: "普通高分子（PE、PVDF）只有 σ 键，能隙约 8–9 eV，是绝缘体。单双键交替的 π 共轭让电子沿链“离域”，能隙缩小到几个 eV 甚至更小，接近无机半导体。" },
    { kind: "matters", body: "能隙和能级位置由主链决定，它们又决定高分子在哪个电位下能掺杂、导电。这是后面 Si 和 S 两部分的关键。" },
  ]);
  s.addNotes("类比“箱中粒子”：箱子越长，能级越密。乙烯只有一对 π 能级（HOMO 和 LUMO）；己三烯有三对，间距变小；聚合物的 π 能级多到连成价带和导带。原文：当 π 轨道沿大分子共轭时，能级密度增大，近似无机半导体的能带结构。");

  // ---------------- 6. Doping ----------------
  s = d.slide("CONTENT");
  s.addText("掺杂 Doping：往能带里放进载流子", { placeholder: "title" });
  d.fig(s, "doping", { x: 0.5, y: 1.25, w: 6.7, h: 3.95 });
  d.quote(s, { x: 0.6, y: 5.4, w: 6.6, en: "In batteries, electronically conducting polymers have been used to improve the kinetics of charge transport in composite electrodes.", zh: "在电池中，导电高分子被用来改善复合电极中电荷传输的动力学。" });
  d.column(s, 7.5, 1.35, 5.25, [
    { kind: "hist", body: "1977 年白川英树、MacDiarmid 与 Heeger 发现：聚乙炔薄膜暴露在碘或 AsF₅ 蒸气中后，电导率提高许多个数量级，接近金属。三人因此获得 2000 年诺贝尔化学奖。" },
    { kind: "why", body: "硅的掺杂是用极少量杂原子替换晶格原子；高分子的“掺杂”其实是氧化或还原，掺杂程度可达百分之几十，还要嵌入反离子来平衡电荷。" },
    { kind: "matters", body: "在电池里，掺杂就是电化学氧化 / 还原：电位一变，高分子可能被“去掺杂”而变回绝缘体。" },
  ]);
  s.addNotes("原文：掺杂剂可以向 HOMO 注入空穴（p 型掺杂），或向 LUMO 注入电子（n 型掺杂），产生沿主链移动、并在链间跳跃的自由载流子，使高分子呈现金属性和高电导。");

  // ---------------- 7. Four polymers ----------------
  s = d.slide("CONTENT");
  s.addText("认识四种常用导电高分子", { placeholder: "title" });
  d.fig(s, "cp_structures", { x: 0.5, y: 1.25, w: 6.6, h: 4.55 });
  d.caption(s, "据原文 Fig. 5e 重绘。R = 侧链；n = 重复单元数。", { x: 0.6, y: 5.9, w: 6.5 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "PANi：1862 年就被制得（苯胺黑），1980 年代 MacDiarmid 等阐明其导电形式；PPy：1963 年 Weiss 等报道碘掺杂导电，1979 年 Diaz 等电化学聚合成膜；PEDOT：1980 年代末由 Bayer 公司开发；聚芴：1990 年代作为蓝光发光材料兴起。" },
    { kind: "why", body: "聚乙炔在空气中很快被氧化失效。换成芳香杂环（噻吩、吡咯、苯胺）后稳定得多，还方便接侧链。" },
    { kind: "matters", body: "Si 负极电位低，原文用可 n 掺杂的聚芴类；S 正极电位高，常用 PEDOT、PPy、PANi。PEDOT 两边都能用。" },
  ]);
  s.addNotes("PEDOT 是聚(3,4-乙撑二氧噻吩)；它常与聚苯乙烯磺酸（PSS）配成水分散液 PEDOT:PSS，PSS 既是反离子又帮助分散。原文 Fig. 5e 还给出了各自的电导率范围，见下一页。");

  // ---------------- 8. Conductivity scale ----------------
  s = d.slide("CONTENT");
  s.addText("电导率尺子：导电高分子处在哪里", { placeholder: "title" });
  d.fig(s, "sigma_scale", { x: 0.6, y: 1.2, w: 12.1, h: 3.95 });
  d.caption(s, "四种导电高分子的范围据原文 Fig. 5e；PE、本征 Si、S、Cu 为公认数量级，仅作参照。", { x: 0.6, y: 5.12, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.5, w: 3.9, kind: "hist", tint: true, size: 13, body: "1977 年掺杂聚乙炔的电导率已达 10² S cm⁻¹ 量级；今天经过处理的 PEDOT:PSS 薄膜可达数千 S cm⁻¹。" });
  d.block(s, { x: 4.7, y: 5.5, w: 3.95, kind: "why", tint: true, size: 13, body: "以前电极导电全靠炭黑：它不储锂、不粘结，却占着质量。导电高分子想一材两用。" });
  d.block(s, { x: 8.85, y: 5.5, w: 3.9, kind: "matters", tint: true, size: 13, body: "同一种高分子的 σ 可跨好几个数量级，取决于掺杂、分子量和加工。原文给的是范围。" });
  s.addNotes("聚芴粘结剂只有 10⁻⁶–10⁻² S cm⁻¹，比 PEDOT 低好几个数量级，但对 Si 电极已经够用：它包着每个颗粒，电子需要走的距离很短。");

  // ---------------- 9. Section Si ----------------
  d.section("2 导电高分子 × 硅负极");
  s = d.slide("DARK_SECTION");
  s.addText("导电高分子 × 硅负极", { placeholder: "title" });
  s.addText("一材两用 · 主链与侧链 · 能级不能“掉链子”", { placeholder: "body" });
  s.addNotes("对应原文 “Conductive polymers for the Si anode” 小节（第 9–10 页）和 Fig. 5b–e。");

  // ---------------- 10. Fig. 5b ----------------
  s = d.slide("CONTENT");
  s.addText("导电粘结剂：粘结剂和导电剂合二为一", { placeholder: "title" });
  d.fig(s, "electrode_compare", { x: 0.5, y: 1.25, w: 6.6, h: 3.6 });
  d.caption(s, "据原文 Fig. 5b 重绘。左：惰性粘结剂（绿）+ 炭黑（黑点）；右：导电高分子粘结剂（紫）。红 = 电子，蓝 = Li⁺。", { x: 0.6, y: 4.9, w: 6.5, h: 0.45 });
  d.quote(s, { x: 0.6, y: 5.5, w: 6.5, en: "the benefit of using polymers for this application is that they can be rationally tailored to meet the design parameters.", zh: "在这一应用中使用高分子的好处是：可以理性地“量身定制”，满足各项设计参数。" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2011 年 Liu 等（劳伦斯伯克利国家实验室）做出能级定制的聚芴导电粘结剂；2013 年 Wu、Cui、Bao 等用原位聚合的导电 PANi 水凝胶包覆 Si 纳米颗粒；2016 年 Higgins 等直接用商品 PEDOT:PSS 同时充当粘结剂和导电剂。" },
    { kind: "why", body: "传统电极 = Si + 绝缘粘结剂 + 炭黑。后两者不储锂，拉低比容量；Si 一膨胀，Si 与炭黑之间的接触就容易断开。" },
    { kind: "matters", body: "一种材料干两件事，而且导电网络连续地包着 Si，颗粒移动时电子通路也不易断。" },
  ]);
  s.addNotes("原文：用一种导电高分子取代粘结剂和导电添加剂时，要考虑很多要求，包括整体电导率和带隙；高分子的好处在于可以按设计参数理性调整。");

  // ---------------- 11. Fig. 5c ----------------
  s = d.slide("CONTENT");
  s.addText("主链定能级，侧链调性能", { placeholder: "title" });
  d.fig(s, "backbone_side", { x: 0.5, y: 1.3, w: 6.6, h: 3.9 });
  d.caption(s, "据原文 Fig. 5c 重绘", { x: 0.6, y: 5.3, w: 6.5 });
  d.block(s, { x: 0.6, y: 5.7, w: 6.5, kind: "def", head: "一句话", body: "主链负责“导”，侧链负责“融”（溶解、相互作用、微调能级）。" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1980 年代中期，人们把烷基侧链接到聚噻吩上，得到可溶、可加工的聚(3-烷基噻吩)。2013 年 Mei 与 Bao（本文作者之一）系统总结了“侧链工程”。" },
    { kind: "why", body: "未取代的导电高分子大多不溶不熔，没法配成电极浆料。接上侧链后能溶解加工，还能顺便调能级、引入功能基团。" },
    { kind: "matters", body: "这是本章最核心的设计原则，原文在小结中再次强调（见本章最后）。" },
  ]);
  s.addNotes("原文：一种有效的方法是给线形主链接上侧链，以改变溶解性、堆积和能级。");

  // ---------------- 12. Fig. 5d ----------------
  s = d.slide("CONTENT");
  s.addText("侧链工具箱：溶解性、离子传输与能级", { placeholder: "title" });
  d.fig(s, "side_groups", { x: 0.5, y: 1.25, w: 6.6, h: 4.35 });
  d.caption(s, "据原文 Fig. 5d 重绘", { x: 0.6, y: 5.7, w: 6.5 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2013 年 Wu 等在聚芴粘结剂上加寡聚醚侧链，加快离子传输；2015 年 Park 等做出侧链导电、相分离的粘结剂；同年 Wu 等发现极性基团太多会过度溶胀；2015 年 Kim 等用带吸电子羰基的聚菲醌降低 LUMO。" },
    { kind: "why", body: "电极里电子和 Li⁺ 都要走。醚侧链吸收电解液、帮 Li⁺ 通过；但溶胀过度会把导电链撑开，反而妨碍电子传导。" },
    { kind: "matters", body: "侧链是“多功能旋钮”：溶解性、离子传输、能级、与 Si 的粘附，都靠它来平衡。" },
  ]);
  s.addNotes("原文：加入极性醚基侧链可以加快复合电极中的离子传输，从而改善循环；但极性基团过多会造成过度溶胀，干扰高分子中的电子传导。吸电子基团可以把 LUMO 降到所需的低能量。");

  // ---------------- 13. Level alignment ----------------
  s = d.slide("CONTENT");
  s.addText("能级不能“掉链子”：在 Si 的低电位下保持导电", { placeholder: "title" });
  d.fig(s, "level_align", { x: 0.5, y: 1.25, w: 6.1, h: 4.75 });
  d.caption(s, "示意。能量换算按 Li/Li⁺ ≈ −1.4 eV（相对真空）粗略估计。", { x: 0.6, y: 6.1, w: 6.0 });
  d.column(s, 6.95, 1.35, 5.8, [
    { kind: "hist", body: "2011 年 Liu 等在聚芴中引入吸电子基团，降低 LUMO，使它在 Si 嵌锂之前就被 n 掺杂并保持导电；2014 年 Song、Marks 等发现电解液会让共轭高分子能级移动；2018 年 Zhao 等加入仿贻贝侧链，增强与 Si 的粘附。" },
    { kind: "why", body: "Si 在 0.01–1 V（vs Li/Li⁺）工作。LUMO 不够低的高分子在这些电位下会去掺杂，电导下降。理想的 Si 用导电高分子要 LUMO 足够低，充电时一直保持 n 掺杂。" },
    { kind: "matters", body: "能级要针对电极的工作电位来设计：同一种高分子，用在 Si 和 S 上的结果可能完全不同。" },
  ], 0.18);
  s.addNotes("能量与电位方向相反：电子能量越低，对应电位越正。LUMO 越低，高分子越容易被还原（n 掺杂），开始 n 掺杂的电位也就越高。原文还指出，PEDOT 等商品高分子在电池工作中也能保持导电；而能级调控的实际效果取决于电化学环境。");

  // ---------------- 14. Section S ----------------
  d.section("3 导电高分子 × 硫正极");
  s = d.slide("DARK_SECTION");
  s.addText("导电高分子 × 硫正极", { placeholder: "title" });
  s.addText("包覆 S 颗粒 · PEDOT 为何最好 · 加工技巧与力学短板", { placeholder: "body" });
  s.addNotes("对应原文 “Conductive polymers for S cathodes” 小节（第 10–11 页）和 Fig. 5f。");

  // ---------------- 15. S needs ----------------
  s = d.slide("CONTENT");
  s.addText("硫正极为什么更需要导电高分子", { placeholder: "title" });
  d.fig(s, "s_coating", { x: 0.5, y: 1.25, w: 6.6, h: 4.15 });
  d.stat(s, { x: 0.7, y: 5.45, w: 3.2, value: "~10⁻³⁰", unit: "S cm⁻¹", label: "单质硫的电导率", color: "accent5" });
  d.stat(s, { x: 4.1, y: 5.45, w: 3.0, value: "2–3", unit: "V", label: "S 的工作电位（vs Li/Li⁺）", color: "accent3" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2011 年 Yang、Cui 等给 C–S 纳米复合物包一层 PEDOT:PSS，降低了颗粒间电荷转移电阻，循环和倍率都变好；2013 年 Zhou、Abruña 等做出 PANi 包覆的“蛋黄–蛋壳”S；2015 年 Liang 等做出 PPy@S@PPy 三层结构。" },
    { kind: "why", body: "S 和 Li₂S 比 Si 更绝缘，只能多加导电碳，拉低能量密度。用导电高分子包覆或粘结，可以少用碳。S 在 2–3 V 工作，所需能级与 Si 不同。" },
    { kind: "matters", body: "S 也有体积变化、颗粒孤立和容量衰减（虽然体积变化没 Si 严重）。导电包覆同时兼顾导电、缓冲和抑制溶解。" },
  ]);
  s.addNotes("单质硫室温电导率常被引作约 5×10⁻³⁰ S cm⁻¹，是极好的绝缘体。S 全部转化为 Li₂S 时体积膨胀约 80%，不如 Si 的约 300% 严重。");

  // ---------------- 16. Fig. 5f ----------------
  s = d.slide("CONTENT");
  s.addText("PEDOT、PPy、PANi 比一比：电导越高，容量越高", { placeholder: "title" });
  const rates = ["C/10", "C/5", "C/2", "1C", "2C", "4C"];
  s.addChart(d.pres.charts.LINE, [
    { name: "PEDOT", labels: rates, values: [1237, 1156, 1060, 965, 869, 626] },
    { name: "PPy", labels: rates, values: [1156, 1046, 960, 860, 788, 444] },
    { name: "PANi", labels: rates, values: [1041, 927, 841, 750, 669, 334] },
  ], {
    x: 0.5, y: 1.25, w: 6.8, h: 4.3, ...AX,
    chartColors: [HEX.dk1, HEX.accent1, "3BAA5C"], lineSize: 2, lineDataSymbol: "circle", lineDataSymbolSize: 10,
    valAxisMinVal: 100, valAxisMaxVal: 1500, valAxisMajorUnit: 200,
    showTitle: true, title: "S 比容量（mAh g⁻¹）vs 倍率",
    showLegend: true, legendPos: "b",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "倍率 C-rate（越往右电流越大）",
  });
  d.caption(s, "据原文 Fig. 5f 读数重绘（近似值），数据来自原文参考文献 144。", { x: 0.6, y: 5.6, w: 6.7 });
  d.quote(s, { x: 0.6, y: 5.95, w: 12.15, en: "PEDOT was also found to enable increased activation of the S-active material as it has a higher conductivity than PANi and PPy, leading to increased specific capacity and improved rate capability", zh: "研究还发现，PEDOT 的电导率高于 PANi 和 PPy，能“激活”更多的 S 活性物质，从而提高比容量并改善倍率性能。" });
  d.column(s, 7.6, 1.35, 5.15, [
    { kind: "def", head: "倍率 C-rate", body: "1C = 1 小时充 / 放完；C/10 = 10 小时；4C = 15 分钟。" },
    { kind: "hist", body: "2013 年 Li、Cui 等在同一种空心 S 纳米球上分别包覆三种导电高分子，做了这组对比。" },
    { kind: "why", body: "电导率越高，越多 S 能参与反应（容量高），大电流下容量也掉得越慢。顺序 PEDOT > PPy > PANi。" },
  ], 0.16);
  s.addNotes("4C 时 PEDOT 仍有约 630 mAh g⁻¹，PANi 只剩约 330 mAh g⁻¹。原图横轴各倍率的间距并不均匀，这里按等间距类别画出。");

  // ---------------- 17. Processing ----------------
  s = d.slide("CONTENT");
  s.addText("加工技巧与短板：导电高分子“粘不住”", { placeholder: "title" });
  d.fig(s, "processing", { x: 0.5, y: 1.25, w: 7.0, h: 3.4 });
  d.quote(s, { x: 0.6, y: 5.0, w: 6.9, bottom: 6.8, en: "conventionally, the mechanical properties of conducting polymers are not sufficient to hold the S electrodes together.", zh: "通常，导电高分子的力学性能不足以把 S 电极粘结在一起。" });
  d.column(s, 7.85, 1.32, 4.9, [
    { kind: "hist", body: "1990 年代 MacDiarmid 与 Epstein 提出“二次掺杂”：间甲酚使 PANi 链由卷曲变舒展，电导大增。2014 年 Wang、Liu 等用 PEDOT 作 S 微米颗粒的粘结剂；2017 年 Tsao 等（Bao 组）用含吡啶的异靛蓝导电高分子做出 S 含量 90 wt% 的电极。" },
    { kind: "why", body: "导电高分子刚而难溶，不易均匀分散。打断部分共轭（吡啶）或溶胀链段（间甲酚），能提高溶解性和分散性，用很少的高分子就形成连续网络，电荷转移电阻也更低。" },
    { kind: "matters", body: "所以很多研究在导电高分子之外仍加了 PVDF。但 PEDOT 直接作粘结剂时，对 S 微米颗粒效果好于 PVDF，因为它与 S 物种亲和力更强。" },
  ], 0.16);
  s.addNotes("原文：间甲酚溶胀 PANi 后再与电极活性物质混合，PANi 能与 C–S 混合物充分分散，电荷转移电阻更低，电池性能优于 PVDF、PTFE 等不导电粘结剂。异靛蓝高分子的高电导和高溶解性使电极中的高分子用量可以降到最低。");

  // ---------------- 18. Design map ----------------
  s = d.slide("CONTENT");
  s.addText("设计总结：三个要求，两种“零件”", { placeholder: "title" });
  d.fig(s, "design_map", { x: 0.5, y: 1.25, w: 6.6, h: 4.45 });
  d.quote(s, { x: 0.6, y: 5.8, w: 12.15, en: "The backbone of the conducting polymer mainly defines the energy levels and conductivity of the polymer, whereas the side chains help to tune the chemical interactions, molecular packing and energy levels for specific applications", zh: "导电高分子的主链主要决定其能级和电导率，而侧链则帮助针对具体应用调节化学相互作用、分子堆积和能级。" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2010 年 Heeger 把半导体高分子称为“第三代”高分子材料：既保留塑料的加工性，又具备半导体或金属的电学性质。" },
    { kind: "why", body: "Si 和 S 的要求不同（工作电位相差约 2 V），但设计原则相同：先选主链定能级和导电性，再用侧链调相互作用和加工性。" },
    { kind: "matters", body: "原文展望：找到能与便宜的微米级 Si 颗粒搭配的导电粘结剂。" },
  ]);
  s.addNotes("原文小结：成功使用导电高分子，需要高分子与电极材料的能级高度匹配、电子传输快，并且力学性能与电极相容。");

  // ---------------- 19. Reading notes ----------------
  d.section("阅读校注");
  s = d.slide("CONTENT");
  s.addText("阅读校注：本节的几处细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.35, w: 5.95, kind: "note", tint: true, size: 13, head: "① 第 9 页：“so that is remains n-doped”", body: "笔误，应为 “so that it remains n-doped”（使它保持 n 掺杂）。" });
  d.block(s, { x: 6.8, y: 1.35, w: 5.95, kind: "note", tint: true, size: 13, head: "② 第 9 页：“LUMOs above these potentials”", body: "这里把能级（eV）和电位（V）混在一起比较。能量越高对应电位越负，读的时候应理解为：LUMO 不够低、n 掺杂电位低于 Si 工作区的高分子，在 Si 工作时会去掺杂。" });
  d.block(s, { x: 0.6, y: 3.6, w: 5.95, kind: "note", tint: true, size: 13, head: "③ 第 9 页：“over the past 50 years”", body: "若从 1977 年掺杂聚乙炔算起，到 2019 年约 40 年；从 1963 年碘掺杂聚吡咯算起约 55 年。“50 年”是约数。" });
  d.block(s, { x: 6.8, y: 3.6, w: 5.95, kind: "note", tint: true, size: 13, head: "④ 第 10–11 页：Fig. 5f 的语境", body: "正文把 Fig. 5f 放在“PEDOT 直接作粘结剂”之后；但据我们所知，参考文献 144 中三种高分子是包覆在空心 S 纳米球上的涂层，而非粘结剂。另外原图横轴倍率间距不均匀。" });
  s.addNotes("这几处都不影响原文结论，主要是帮助准确理解。第④条建议对照参考文献 144（Li et al., Nano Lett. 2013）核实。");

  // ---------------- 20. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["共轭 + 掺杂 = 导电高分子", "共轭让能级连成能带；掺杂（氧化 / 还原）放进载流子。1977 年发现，2000 年获诺贝尔奖"],
    ["Si 负极：导电粘结剂一材两用", "侧链调溶解性、离子传输和粘附；LUMO 要足够低，在 0.01–1 V 下保持 n 掺杂"],
    ["S 正极：导电包覆与粘结", "电导越高越好（PEDOT > PPy > PANi）；但力学不足，常需 PVDF 帮忙"],
    ["设计原则", "主链定能级与导电性，侧链调相互作用、堆积和能级；三个要求：能级、传输、力学"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Successful implementation of conducting polymers requires excellent compatibility between the energy levels of the polymer and the electrode material, fast electron transport properties and mechanical properties that are compatible with the electrode.”", options: { italic: true, fontSize: 14, color: "FFFFFF", breakLine: true } },
    { text: "成功应用导电高分子，需要高分子与电极材料的能级高度匹配、快速的电子传输，以及与电极相容的力学性能。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章（第 5 章）讨论化学相互作用：高分子怎样用 N、O、S 等基团“抓住”多硫化物，以及怎样用氢键牢牢粘住 Si 表面。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
