// Ko et al. 2026 — Chapter 5: 理性界面设计、挑战与结论
const path = require("path");
const { HEX } = require("../decklib");
const { PAPER, NB, makeDeck, R, eqBox, titleSlide, roadmap, sectionSlide, summarySlide, CH, finish } = require("./common");

async function build(outFile, figDir) {
  const d = await makeDeck(5, "理性界面设计、挑战与结论", path.join(__dirname, "ch5_figs.js"), figDir);
  const C = d.C;
  let s;

  // ---------------- 1. Title ----------------
  titleSlide(d, {
    title: "第 5 章\n怎样设计未来的电解质？",
    sub: "理性界面设计 · 传输与安全的挑战 · 结论与全文回顾",
    fig: "title_motif5",
    notes: "本章对应原文最后三节：Rational interphase design、Challenges and opportunities in electrolyte design for future batteries、Conclusion（第 8–11 页，Fig. 5c、Fig. 6）。最后两页是全文回顾和公式速查。",
  });

  // ---------------- 2. Roadmap ----------------
  roadmap(d, {
    steps: [
      ["1", "理性界面设计", "从富有机到富无机（LiF）SEI"],
      ["2", "两极兼顾与解读陷阱", "SEI 优先 + 正极补救；测量会“改变”样品"],
      ["3", "体相离子传输", "三种传输机理；迁移数怎么测才可信"],
      ["4", "安全优先", "热失控连锁反应；mAh 级 ARC 快速评价"],
      ["5", "结论与全文回顾", "一张图串起五章；公式速查"],
    ],
    prev: "第 4 章：界面相是动态的；电位上移让 SEI 受益、CEI 受累。本章讲作者给出的设计原则，以及传输和安全这两大挑战。",
    fig: "roadmap5",
    notes: "本章内容最“工程化”：会出现很多具体的电解液名字和策略。抓住主线即可：①用阴离子衍生的富无机界面相应对大体积变化；②兼顾两极；③离子对结构有利于稳定却拖慢传输；④安全要放在首位。",
  });

  // ---------------- 3. Section ----------------
  sectionSlide(d, "1 理性界面设计", "理性界面设计", "界面相要同时满足力学、电化学、传输和化学四类要求");

  // ---------------- 4. Requirements ----------------
  s = d.slide("CONTENT");
  s.addText("好的界面相要满足四类（常常冲突的）要求", { placeholder: "title" });
  d.fig(s, "interphase_reqs", { x: 0.45, y: 1.2, w: 6.6, h: 4.4 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1990 年 Fong、von Sacken 与 Dahn 发现 EC 在石墨上形成稳定的溶剂衍生 SEI；2000 年 Aurbach 综述了碳酸酯电解液在石墨上生成富有机界面相的规律（ref. 109）。" },
    { kind: "why", body: "石墨体积只变约 10%，柔软、粘附牢的富有机 SEI 足够用。Li 和 Si 容量高一个数量级，体积变化却大几十倍，富有机 SEI 反复破裂、重长。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.4, w: 5.4, bottom: 5.6, en: "Effective interphases should satisfy multiple, often competing, requirements", zh: "有效的界面相必须同时满足多项、而且常常相互冲突的要求。" });
  d.block(s, { x: 0.6, y: 5.75, w: 12.15, kind: "matters", tint: true, size: 14, body: "富有机 SEI 的“亲锂性”较高、与 Li 的界面能低，还会助长不均匀沉积和枝晶；富有机 CEI 则在高电位、高温下易被氧化。需要新的界面相成分。" });
  s.addNotes("原文列出的四项要求：承受大体积变化而不开裂或剥离；在苛刻电化学条件下抑制寄生还原和氧化；允许载流子快速传输；在宽温度范围内化学稳健、致密、难透溶剂。");

  // ---------------- 5. Fig 5c organic vs inorganic ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 5c：溶剂衍生的富有机 SEI vs 阴离子衍生的富无机 SEI", { placeholder: "title" });
  d.fig(s, "fig5c", { x: 0.5, y: 1.2, w: 12.3, h: 3.96 });
  d.block(s, { x: 0.6, y: 5.3, w: 3.95, kind: "hist", size: 14, body: "2018 年 Fan、王春生等用全氟化电解液在 Li 金属上得到富 LiF 界面；2020 年 Chen 等用富 LiF SEI 稳定微米级合金负极（ref. 115、91）。" });
  d.block(s, { x: 4.75, y: 5.3, w: 3.95, kind: "why", size: 14, body: "以前靠溶剂（EC）分解成膜；现在让阴离子（FSI⁻、PF₆⁻）优先分解，得到更稳的无机组分。" });
  d.block(s, { x: 8.9, y: 5.3, w: 3.85, kind: "matters", size: 14, body: "富无机 SEI 的短板是“难以均匀形成”，所以还要配合结构设计。" });
  s.addNotes("据原文 Fig. 5c 重绘。左：石墨 + 强配位溶剂，溶剂分解成膜；右：Li 或 Si + 阴离子和弱配位溶剂，阴离子分解成膜。原文 Supplementary Table 1 汇总了代表性的富无机 SEI 电解液。");

  // ---------------- 6. Why LiF ----------------
  s = d.slide("CONTENT");
  s.addText("为什么偏爱 LiF？", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "抗裂指数（相对值）", labels: ["LiF", "Li₂CO₃", "Li₂O", "LiCl", "Li₂S", "Li₃N", "Li₃PS₄"], values: [1, 0.74, 0.6, 0.23, 0.15, 0.09, -0.38] }], {
    x: 0.5, y: 1.25, w: 6.3, h: 4.1, barDir: "col", chartColors: [HEX.accent4, HEX.dk1, HEX.dk1, HEX.dk1, HEX.dk1, HEX.dk1, HEX.accent6],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: HEX.dk1, dataLabelFormatCode: "0.00",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisLabelPos: "low",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMinVal: -0.5, valAxisMaxVal: 1.15,
    showTitle: true, title: "SEI 组分的计算抗裂指数（LiF = 1，读图相对值）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", showLegend: false,
  });
  d.caption(s, "据原文 Fig. 5c 柱状图读图换算；原图单位 eV/Å²·MPa，未标刻度，仅示排序。", { x: 0.6, y: 5.4, w: 6.2, h: 0.4 });
  d.column(s, 7.1, 1.35, 5.65, [
    { kind: "hist", body: "1990 年代起，人们就在含 LiPF₆ 电解液的 SEI 中检测到 LiF（来自盐和 HF 的分解）；2018 年后，富 LiF 界面成为主动设计的目标。" },
    { kind: "why", body: "①Li–F 键高度离子化 → 化学、电化学都很稳，膜致密、难溶、挡溶剂；②亲锂、界面能高 → 让 Li⁺ 通量更均匀；③与电极粘附弱 → 能“界面滑移”，适应体积变化。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.85, w: 12.15, en: "The highly ionic Li–F bond endows LiF with exceptional chemical and electrochemical stability, enabling the formation of compact and robust interphases that limit solvent penetration and suppress dissolution", zh: "高度离子化的 Li–F 键赋予 LiF 优异的化学与电化学稳定性，可形成致密、稳健、限制溶剂渗透并抑制溶解的界面相。" });
  d.block(s, { x: 7.1, y: 4.7, w: 5.65, kind: "matters", body: "“粘得不牢”反而是优点：体积变化时界面相随之滑动，而不是被撕裂。" });
  s.addNotes("注意：Li3PS4 的抗裂指数为负，原文图中画在基线以下。原文引用的 LiF 相关文献很多（ref. 58、70、91、120–122），也有工作对 LiF 的作用提出不同看法（如 ref. 127“重新评估含 LiF 的 SEI”），说明这仍是活跃的研究课题。");

  // ---------------- 7. How to make LiF-rich SEI ----------------
  s = d.slide("CONTENT");
  s.addText("怎样得到阴离子衍生的富 LiF SEI", { placeholder: "title" });
  d.fig(s, "anion_path", { x: 0.5, y: 1.2, w: 12.3, h: 3.13 });
  d.block(s, { x: 0.6, y: 4.5, w: 3.95, kind: "hist", size: 14, body: "2014 年 Sodeyama、Yamada 等计算提出高浓电解液中“牺牲性阴离子还原”机理（ref. 78）；2025 年 Li、王春生等提出“盐溶于预盐”电解液（ref. 130）。" });
  d.block(s, { x: 4.75, y: 4.5, w: 3.95, kind: "why", size: 14, body: "阴离子一旦和 Li⁺ 络合，其还原产物被稳定，还原电位上移，于是抢在溶剂之前被还原。这与第 2 章的“电位上移”是同一套结构原因。" });
  d.block(s, { x: 8.9, y: 4.5, w: 3.85, kind: "matters", size: 14, body: "同一种思路（调溶剂化结构）同时带来电位上移和好 SEI，两种好处相互叠加。" });
  s.addNotes("“盐溶于预盐”（salt-in-presalt）：用与 N(SO2CxFy)2⁻ 酰亚胺阴离子结构相似的溶剂，如 (CH3)2NSO2F 和 (CH3)2NSO2CF3，使溶剂和阴离子都能被还原成富氟界面相。离子液体电解液中，不对称的有机阳离子提高盐溶解度和化学稳定性，也促进富 LiF SEI（ref. 124）。");

  // ---------------- 8. Other components & bilayer ----------------
  s = d.slide("CONTENT");
  s.addText("不只 LiF：其他无机组分与“双层”结构设计", { placeholder: "title" });
  d.fig(s, "bilayer", { x: 0.45, y: 1.2, w: 6.6, h: 4.3 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "2024 年 Hobold、Gallant 等用滴定法定量 SEI 成分，发现富 Li₂O 与高库仑效率相关（ref. 133）；2023 年 Zhang 等用三氧六环调控得到无机内层/有机外层双层 SEI（ref. 146）。" },
    { kind: "why", body: "只追成分不够：还要设计结构（内无机、外有机）和动态行为（如 LiF 晶粒可逆溶解–再析出，让富 LiF 层持续保持，ref. 147）。" },
    { kind: "matters", body: "Li₃N、LiFₓH_y、Li₃P 的机理还不完全清楚，一般认为它们减弱粘附、使 Li⁺ 通量更均匀、抑制枝晶。".replace("LiFₓH_y", "LiFₓHᵧ") },
  ]);
  s.addNotes("双层结构：先还原阴离子形成无机内层，再还原溶剂形成有机外层。有机外层像离子导电的“粘结剂”基体，抑制界面相溶解；内层保留无机相的化学和电化学优点。");

  // ---------------- 9. Both electrodes ----------------
  s = d.slide("CONTENT");
  s.addText("两极兼顾：先保负极，再给正极“补救”", { placeholder: "title" });
  d.fig(s, "both_ends", { x: 0.5, y: 1.2, w: 12.3, h: 3.75 });
  d.block(s, { x: 0.6, y: 5.1, w: 3.95, kind: "hist", size: 14, body: "2009 年 Sun 等提出浓度梯度正极：颗粒内部高镍、表面低镍，用表面化学稳定性换取容量（ref. 152）。" });
  d.block(s, { x: 4.75, y: 5.1, w: 3.95, kind: "why", size: 14, body: "离子对电解液利于阴离子还原形成 SEI，却抑制阴离子氧化，难以在正极形成阴离子衍生的 CEI。" });
  d.block(s, { x: 8.9, y: 5.1, w: 3.85, kind: "matters", size: 14, body: "Li、Si 负极的可逆性是最大瓶颈，所以“负极优先、正极补救”是现实的策略。" });
  s.addNotes("原文：大多数界面工程策略依赖单一电极（负极或正极）上的电化学成膜机理，很难同时满足两极的界面需求。正极侧的补救手段包括：部分加入高度耐氧化的溶剂/稀释剂、支持 CEI 功能的粘结剂和隔膜、浓度梯度正极、表面包覆、杂原子掺杂，以及通过电解液组分开环反应进行化学钝化等非电化学成膜路线。");

  // ---------------- 10. Pitfalls ----------------
  s = d.slide("CONTENT");
  s.addText("解读界面数据要小心：测量本身会改变样品", { placeholder: "title" });
  d.fig(s, "pitfalls", { x: 0.45, y: 1.2, w: 6.6, h: 4.3 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1960 年代 Siegbahn 发展了 X 射线光电子能谱（XPS，1981 年诺贝尔物理学奖），是 SEI 成分分析的主力；2017 年冷冻电镜被引入，以减轻电子束损伤（ref. 160）。" },
    { kind: "why", body: "以前把 XPS 看到的 LiF 当作 SEI 的“真成分”。近年发现 X 射线和电子束本身会让锂盐分解出 LiF（ref. 158、161、162），清洗也会溶掉部分组分。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.55, w: 5.4, en: "Recent studies have emphasized the need for caution in interpreting not only interphase chemistry but also quantitative descriptors of its evolution.", zh: "近期研究强调：不仅解读界面化学要谨慎，解读其演化的定量描述量也要谨慎。" });
  d.block(s, { x: 0.6, y: 5.65, w: 6.45, kind: "matters", tint: true, size: 14, body: "实用电池还要面对高面容量、低 N/P 比、贫电解液、宽倍率和宽温度（ref. 168）。" });
  s.addNotes("原文还指出：因为界面相不断重建，很难定义其有效厚度、分开生长与溶解速率、或测定液态电解质条件下的本征离子电导率；计算方法受限于可达到的时间尺度和难以复现持续电流；电池性能还可能受去溶剂化、溶剂重组等界面电荷转移动力学控制（ref. 164–167）。N/P 比：负极与正极的容量比。");

  // ---------------- 11. Section ----------------
  sectionSlide(d, "2 传输与安全", "挑战：体相离子传输与安全", "稳定的溶液结构往往拖慢离子；而安全必须优先于一切性能指标");

  // ---------------- 12. Transport modes ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 6a：三种离子传输机理", { placeholder: "title" });
  d.fig(s, "transport_modes", { x: 0.5, y: 1.15, w: 12.3, h: 3.44 });
  eqBox(d, s, { x: 0.6, y: 4.75, w: 4.3, h: 2.05, eq: "σ = Σ n_{i}|z_{i}|e·u_{i}\nu = |z|e / (6πηr)", eqSize: 18, sub: "σ：离子电导率；n：载流子浓度；z：价数；e：元电荷；u：迁移率；η：黏度；r：（溶剂化）离子半径。后式为 Stokes–Einstein 关系", subSize: 12 });
  d.block(s, { x: 5.1, y: 4.75, w: 3.75, kind: "hist", size: 14, body: "1806 年 Grotthuss 提出质子“接力”传导；1851 年 Stokes 黏滞阻力定律；1905 年 Einstein 把扩散与迁移率联系起来。" });
  d.block(s, { x: 9.0, y: 4.75, w: 3.75, kind: "why", size: 14, body: "离子对和聚集体让 η、r 变大，载体式传输变慢；结构式和通道式不靠“搬运”整个壳层，可以绕开。" });
  s.addNotes("原文：离子电导率正比于带电物种的数目和迁移率，反比于其特征尺寸和黏度。传统碳酸酯电解液中，高介电常数溶剂（如 EC）促进盐解离，介电屏蔽削弱阴阳离子之间的库仑作用，以载体式为主，电导率约 10 mS cm⁻¹。");

  // ---------------- 13. Conductivity chart ----------------
  s = d.slide("CONTENT");
  s.addText("离子对的代价：电导率常低 1–2 个数量级", { placeholder: "title" });
  const T = ["60", "30", "0", "−20"];
  s.addChart(d.pres.charts.LINE, [
    { name: "1.3 M LiFSI/FAN（通道辅助）", labels: T, values: [50, 44, 36, 28] },
    { name: "1.0 M LiPF₆/EC/EMC（传统）", labels: T, values: [13, 9.5, 6.0, 2.1] },
    { name: "5.5 M LiFSI/DMC（高浓）", labels: T, values: [1.6, 0.8, 0.155, 0.027] },
  ], {
    x: 0.5, y: 1.25, w: 6.5, h: 4.5, chartColors: [HEX.accent5, HEX.accent4, HEX.accent3], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 8,
    valAxisLogScaleBase: 10, valAxisMinVal: 0.01, valAxisMaxVal: 100, valAxisLabelFormatCode: "0.0#",
    showTitle: true, title: "离子电导率（mS cm⁻¹，对数轴）", ...CH.font, ...CH.legend, ...CH.grid,
    showCatAxisTitle: true, catAxisTitle: "温度（°C）", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.caption(s, "据原文 Fig. 6a 读图（近似），只选三条代表曲线；FAN：氟代乙腈。", { x: 0.6, y: 5.8, w: 6.4, h: 0.3 });
  d.column(s, 7.3, 1.35, 5.45, [
    { kind: "hist", body: "2024 年 Lu 等报道“配体通道”超快 Li⁺ 传导（ref. 95）：用弱溶剂化但很小的分子（如氟代乙腈），电导率甚至高于传统体系。" },
    { kind: "why", body: "加稀释剂能降黏度，但离子聚集体的尺寸基本不变，迁移率仍受限（ref. 181、182）；增强溶剂配位能拆散聚集体，却又丢掉离子对带来的电化学好处。" },
  ]);
  d.quote(s, { x: 7.3, y: 4.6, w: 5.45, en: "Despite these advances, reconciling fast ion transport with favourable thermodynamic stability and interfacial kinetics across wide temperature ranges remains a major challenge", zh: "尽管已有进展，在宽温度范围内同时兼顾快速离子传输、有利的热力学稳定性和界面动力学，仍是一大挑战。" });
  s.addNotes("离子对的好处（原文）：电极电位上移、优先形成阴离子衍生 SEI、提高氧化稳定性、抑制过渡金属溶出、Al 集流体阳极溶解和导电碳的降解。代价：阴阳离子相互作用增加黏度、形成大的离子聚集体，在相同盐浓度和温度下电导率常比传统碳酸酯低 1–2 个数量级。图中传统电解液在低温骤降与 EC 结晶有关。");

  // ---------------- 14. Transference number ----------------
  s = d.slide("CONTENT");
  s.addText("Li⁺ 迁移数：常用测法都有前提条件", { placeholder: "title" });
  d.fig(s, "bv_method", { x: 0.45, y: 1.2, w: 6.4, h: 4.03 });
  d.column(s, 7.15, 1.35, 5.6, [
    { kind: "hist", body: "1853 年 Hittorf 首次测定迁移数；1965 年 Stejskal 与 Tanner 发展了脉冲场梯度核磁（PFG-NMR）测扩散系数；1987 年 Bruce、Vincent 与 Evans 提出直流极化法（ref. 188）。" },
    { kind: "why", body: "PFG-NMR 给的是“表观迁移数”，依赖理想 Nernst–Einstein 关系（离子各自独立运动）；Bruce–Vincent 法假设只有两种独立离子、无副反应、界面电阻不变、无对流。离子对和聚集体会破坏这些假设。" },
    { kind: "matters", body: "迁移数决定浓差极化和电极界面的 Li⁺ 供应，是快充的关键。除非验证了前提，否则测值不应直接当作本征迁移数（ref. 190–192）。" },
  ], 0.16);
  d.caption(s, "示意：Li/电解质/Li 对称电池在小电压下极化，电流从初始 I₀ 衰减到稳态值", { x: 0.6, y: 5.3, w: 6.3, h: 0.4 }, { size: 12 });
  s.addNotes("迁移数（transference number）：总离子电流中由 Li⁺ 携带的比例（相对溶剂参考系）。原文还提出：体相中的电荷传输与跨越双电层、SEI 或 CEI 的传输可能很不同，需要把载流子热力学、体相传输和界面离子转移动力学结合起来的新描述量（ref. 193–195）。");

  // ---------------- 15. Thermal runaway ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 6b：热失控的连锁反应", { placeholder: "title" });
  d.fig(s, "runaway", { x: 0.45, y: 1.2, w: 6.6, h: 4.37 });
  d.caption(s, "据原文 Fig. 6b（20 mAh 石墨 | NCM811 圆柱软包电池的 ARC 曲线）读图重绘，近似", { x: 0.6, y: 5.6, w: 6.4, h: 0.4 }, { size: 11 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1999 年 Richard 与 Dahn 用加速量热（ARC）研究嵌锂石墨与电解液的热稳定性（ref. 196），此后 ARC 成为电池热失控研究的标准工具。" },
    { kind: "why", body: "①SEI 分解 → ②嵌锂负极与电解液直接反应 → ③正极放氧、可燃气体跨电极燃烧（串扰）→ 类铝热反应，升温速率陡增到每分钟上千度。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.35, w: 5.4, en: "Safety must take precedence over all other performance metrics in battery technology", zh: "在电池技术中，安全必须优先于所有其他性能指标。" });
  d.block(s, { x: 0.6, y: 6.05, w: 12.15, kind: "matters", tint: true, size: 14, body: "电解质直接参与引发和维持这一连锁放热，热失控还会释放大量有毒气体。" });
  s.addNotes("ARC（accelerating rate calorimetry，加速量热）：在绝热条件下逐步加热电池，一旦检测到自热就跟踪升温，记录升温速率随温度的变化。原文 ref. 205、206 讨论了类铝热（thermite-like）反应在热失控中的作用。");

  // ---------------- 16. ARC small cells ----------------
  s = d.slide("CONTENT");
  s.addText("安全评价也要“小型化”：mAh 级 ARC", { placeholder: "title" });
  d.fig(s, "arc_scale", { x: 0.45, y: 1.2, w: 6.6, h: 4.0 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "ARC 技术 1980 年前后由 Dow 化学的 Townsend 与 Tou 发展，用于化学品热危险评估；2025 年 Ko 等（本文作者）建立了用 ≥20 mAh 小电池做 ARC 的流程（ref. 224）。" },
    { kind: "why", body: "针刺、挤压、跌落、振动、热箱、热冲击等滥用测试通常需要 Ah 级大电池，制造昂贵、材料用量大，研发早期根本做不起。" },
    { kind: "matters", body: "很多安全现象只在全电池层面出现。小电池 ARC 能在材料研发早期就给出安全反馈，但还需要更多可及的评价工具。" },
  ]);
  s.addNotes("原文 Fig. 6b 右上图：常规大电池 ARC 需要约 10³–10⁴ mAh、4–15 g 正极材料；圆柱软包小电池只需几十到一百多 mAh、不到 1 g 正极。数值据原图读取。");

  // ---------------- 17. Beyond nonflammability ----------------
  s = d.slide("CONTENT");
  s.addText("安全 ≠ 不燃：四个层面的风险", { placeholder: "title" });
  d.fig(s, "safety_layers", { x: 0.5, y: 1.2, w: 12.3, h: 1.83 });
  d.column(s, 0.6, 3.3, 6.0, [
    { kind: "hist", body: "2018 年 Wang、Yamada 等用磷酸三甲酯做“灭火”电解液（ref. 25）；同年 Fan、王春生等报道不燃全氟电解液（ref. 115）；此后氯代溶剂、功能盐、添加剂等路线相继出现。" },
  ]);
  d.column(s, 6.85, 3.3, 5.9, [
    { kind: "why", body: "以前用不燃溶剂替换碳酸酯就算“安全电解液”。但不燃溶剂常牺牲电化学性能，而且界面分解、气体串扰照样会引发热失控；固态电解质也会带来接触失效等新的失效途径（ref. 210）。" },
  ]);
  d.block(s, { x: 0.6, y: 5.55, w: 12.15, kind: "matters", tint: true, body: "原文：未来电解液研发既要靠材料设计，也要同步发展易于获得、贴近实用的安全评价技术。安全问题在液态、凝胶、混合和固态电解质中都存在。" });
  s.addNotes("原文：要取代高度易燃、常形成热不稳定界面相的 LiPF6/环状碳酸酯电解液，人们引入了氟代、氯代或含磷溶剂、功能盐、添加剂和定制配方，以降低挥发性和可燃性，并促进热稳定和化学稳定的界面相。但安全与最佳电化学性能的同时提升仍需努力。");

  // ---------------- 18. Section ----------------
  sectionSlide(d, "3 结论与回顾", "结论与全文回顾", "从“经验优化”走向“物理化学框架”");

  // ---------------- 19. Conclusion: targets ----------------
  s = d.slide("CONTENT");
  s.addText("结论：未来电解质的三个硬指标", { placeholder: "title" });
  const cyc = Array.from({ length: 11 }, (_, i) => i * 100);
  const ser = (ce) => cyc.map((n) => Math.round(Math.pow(ce, n) * 1000) / 10);
  s.addChart(d.pres.charts.LINE, [
    { name: "CE 99.99%", labels: cyc.map(String), values: ser(0.9999) },
    { name: "CE 99.9%", labels: cyc.map(String), values: ser(0.999) },
    { name: "CE 99.5%", labels: cyc.map(String), values: ser(0.995) },
  ], {
    x: 0.5, y: 1.25, w: 6.4, h: 4.1, chartColors: [HEX.accent2, HEX.accent1, HEX.accent4], lineSize: 3, lineDataSymbol: "none",
    showTitle: true, title: "无多余 Li 时剩余容量（%）随循环圈数", ...CH.font, ...CH.legend, ...CH.grid, valAxisMaxVal: 100, valAxisMinVal: 0,
    showCatAxisTitle: true, catAxisTitle: "循环圈数", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.stat(s, { x: 7.2, y: 1.3, w: 2.7, value: ">99.99", unit: "%", label: "库仑效率目标（超长寿命）", color: "accent2" });
  d.stat(s, { x: 10.0, y: 1.3, w: 2.75, value: "≈90", unit: "%", label: "CE 99.99% 时 1000 圈后仍剩", color: "accent1" });
  d.column(s, 7.2, 2.95, 5.55, [
    { kind: "why", body: "第一代锂离子电池 1991 年商业化，三十多年来靠“试配方”进步。原文认为下一代的突破主要来自电解液创新，而且要同时满足：超长寿命、快充/高功率、从制造到使用的安全。" },
  ]);
  d.quote(s, { x: 7.2, y: 4.55, w: 5.55, bottom: 6.85, en: "At the core of this perspective is the recognition that variations in Coulombic interactions among electrolyte species reshape electrode potentials and full-cell energetics.", zh: "这一视角的核心在于认识到：电解液各物种之间库仑相互作用的变化，会重塑电极电位和全电池能量学。" });
  d.caption(s, "按 CE 的 N 次方计算：0.9999¹⁰⁰⁰ ≈ 0.905，0.999¹⁰⁰⁰ ≈ 0.368。", { x: 0.6, y: 5.4, w: 6.3, h: 0.3 });
  s.addNotes("原文结论第一句：从三十年前商业化的第一代锂离子电池走向下一代储能系统，很大程度上将由电解液创新驱动。未来电解液必须实现库仑效率超过 99.99% 的超长循环寿命、支持快充和高功率，并确保从制造到实际使用的稳健安全。");

  // ---------------- 20. Big picture ----------------
  s = d.slide("CONTENT");
  s.addText("全文回顾：一条线串起五章", { placeholder: "title" });
  d.fig(s, "big_picture", { x: 0.9, y: 1.15, w: 11.5, h: 4.58 });
  d.block(s, { x: 0.6, y: 5.85, w: 12.15, kind: "matters", tint: true, size: 14, body: "一句话：电解液改变 Li⁺ 周围的库仑相互作用 → 两极电位移动 → 界面相的命运；再加上传输与安全，就是理性设计的框架。" });
  s.addNotes("五章对应关系：第 1 章提出问题和视角；第 2 章 μ 与电位平移（Fig. 2）；第 3 章怎样计算（Fig. 3）；第 4 章界面相的演变、动力学和电位依赖（Fig. 4、5a,b）；第 5 章设计、传输、安全与结论（Fig. 5c、6）。");

  // ---------------- 21. Formula cheat sheet ----------------
  s = d.slide("CONTENT");
  s.addText("公式速查：读懂这篇综述需要的六个关系", { placeholder: "title" });
  const fm = [
    ["μ = μ° + RT ln a", "化学势与活度（Gibbs 1870s；Lewis 1907）", "第 2 章"],
    ["E_{Li⁺/Li} = μ_{Li⁺}/F，ΔE = Δμ/F", "式 (1)：电位由载流子化学势决定", "第 2 章"],
    ["E = E° + (RT/F) ln a", "Nernst 方程（1889）：每十倍 59 mV", "第 2 章"],
    ["lg γ = −A√I/(1 + Ba√I) + bI", "扩展 Debye–Hückel（1923 起）：只适合稀溶液", "第 3 章"],
    ["j = j_{0}·exp[αF(E_{eq} − E)/RT]", "式 (2) Butler–Volmer：0.6 V ↔ 10⁵ 倍", "第 4 章"],
    ["σ = Σ n|z|e·u；t_{+}（Bruce–Vincent）", "电导率与迁移数：都依赖理想化假设", "第 5 章"],
  ];
  fm.forEach(([eq, m, ch], i) => {
    const y = 1.35 + i * 0.9;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 12.15, h: 0.78, rectRadius: 0.08, fill: { color: i % 2 ? "FFFFFF" : "F5F7F9" }, line: { color: "E3E8EC" } });
    s.addText(R(eq, { fontSize: 18, bold: true, color: C.accent1 }), { x: 0.85, y, w: 5.6, h: 0.78, margin: 0, valign: "middle", isTextBox: true });
    s.addText(m, { x: 6.55, y, w: 4.9, h: 0.78, fontSize: 15, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(ch, { x: 11.5, y, w: 1.1, h: 0.78, fontSize: 14, bold: true, color: C.text2, margin: 0, valign: "middle", align: "right", isTextBox: true });
  });
  s.addNotes("液体 Madelung 势（第 3 章）的公式较长，这里没有列出；记住它的思想即可：对 MD 轨迹中每个 Li⁺ 感受到的周围电荷和偶极的静电势做时间、空间平均，两种电解液之差除以 F 就是电位移动。");

  // ---------------- 22. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本章的几处细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① “Bruce–Vincent–Evans” 的引用", body: "正文称 Bruce–Vincent–Evans 法，引用 ref. 188（Bruce & Vincent 1987）和 ref. 189（2023 年的 MD 模拟论文）。Evans、Vincent 与 Bruce 1987 年在 Polymer 上的原始方法论文没有被引用。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② “三十年前”与卷号年份", body: "结论说第一代锂电“三十年前”商业化，实际为 1991 年，到 2026 年约 35 年，属约数。参考文献中有几处在线年份与卷号年份不一致（如 ref. 2、11、25、147），不影响阅读。" });
  d.block(s, { x: 0.6, y: 3.6, w: 5.9, kind: "note", tint: true, head: "③ “体积变化大几十倍”的含义", body: "原文说 Li 和 Si 的体积变化比石墨“大几十倍”。石墨约 10%，Si 约 300%（约 30 倍）；Li 金属没有宿主，理论上体积变化是“从无到有”，比较时应理解为数量级说法。" });
  d.block(s, { x: 6.85, y: 3.6, w: 5.9, kind: "def", tint: true, head: "核对通过", body: "传统碳酸酯电导率约 10 mS cm⁻¹、离子对电解液低 1–2 个数量级，与 Fig. 6a 读图一致；Fig. 6b 中热失控约在 230 °C 起跳。" });
  s.addNotes("这些都是细节问题。全文最值得记住的“校注”在第 2 章：式 (1) 是相对关系，只有差值 ΔE = Δμ/F 才有确定意义。");

  // ---------------- 23. Summary ----------------
  summarySlide(d, {
    title: "本章小结 · 全文结语",
    items: [
      ["界面相：富无机（LiF）+ 结构设计", "阴离子进入溶剂化层 → 阴离子优先还原 → 致密、抗裂、可滑移的 SEI"],
      ["两极兼顾：负极优先，正极补救", "耐氧化稀释剂、梯度正极、包覆、掺杂、化学钝化；数据解读要防“测量假象”"],
      ["传输：离子对稳定却慢", "结构式/通道式传输是出路；迁移数测法有前提"],
      ["安全优先", "热失控是连锁反应；不燃 ≠ 安全；mAh 级 ARC 让早期评价成为可能"],
      ["全文主线", "库仑相互作用 → μ_{Li⁺} → 两极电位 → 界面相 → 寿命与安全"],
    ],
    quote: { en: "Moving beyond empirical optimization towards a physicochemical framework that accounts for electrolyte thermodynamics, kinetics and thermal/chemical stability will guide the rational design of fundamentally new classes of electrolytes and batteries.", zh: "超越经验优化，走向兼顾电解质热力学、动力学和热/化学稳定性的物理化学框架，将指引全新一类电解质与电池的理性设计。" },
  });

  return finish(d, outFile, figDir);
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
