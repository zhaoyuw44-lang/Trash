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
    title: "第 5 章\n理想电解质：能否兼得？",
    sub: "理性界面设计 · 体相离子传输 · 安全优先 · 全文结论",
    fig: "title_motif5",
    notes: "本章对应原文最后三节：Rational interphase design、Challenges and opportunities in electrolyte design for future batteries、Conclusion（第 7–11 页，含 Fig. 5c 与 Fig. 6）。主线：如何设计富无机界面相并兼顾正负极，如何破解“离子对稳界面却拖慢传输”的难题，以及把安全置于一切指标之上。",
  });

  // ---------------- 2. Roadmap ----------------
  roadmap(d, {
    steps: [
      ["1", "理性界面设计", "从富有机到富无机 LiF、多元组分与双层结构"],
      ["2", "两极兼顾与表征陷阱", "负极优先 + 正极补救；警惕测到的假象"],
      ["3", "离子传输与迁移数陷阱", "Fig. 6a 三种传输机制；迁移数测量的两道陷阱"],
      ["4", "安全高于一切", "Fig. 6b 热失控多米诺与 ≥20 mAh 小电池 ARC"],
      ["5", "全文回顾与结论", "五章串成统一框架：迈向 CE > 99.99%"],
    ],
    prev: "第 4 章指出：界面相是动态演化的功能层，且 SEI 负担对负极电位呈指数敏感，导致 SEI 与 CEI 存在跷跷板权衡。本章给出应对策略并讨论传输与安全。",
    fig: "roadmap5",
    next: "本章为本综述收官章：末尾用全景图串联第 1–5 章。",
    notes: "本章围绕“权衡（trade-off）”展开：力学与导离子权衡、SEI 与 CEI 权衡、高稳定性与高电导率权衡、安全与性能权衡。理解每对矛盾背后的物理化学原因，才能跳出纯经验试错。",
  });

  // ---------------- 3. Section 1 ----------------
  sectionSlide(d, "1 理性界面设计", "理性界面设计", "为什么从“富有机”走向“富无机”，又如何兼顾正极与负极？", "第 7–9 页核心问题：常规石墨电极上很好用的溶剂衍生有机 SEI，换到 Li 金属和 Si 负极上为什么会崩溃？答案是材料特性和成膜路径必须全面重构。");

  // ---------------- 4. Four requirements ----------------
  s = d.slide("CONTENT");
  s.addText("理想界面相要同时满足四项冲突的要求", { placeholder: "title" });
  d.fig(s, "interphase_reqs", { x: 0.45, y: 1.25, w: 6.6, h: 4.4 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1990 年代起，碳酸酯电解液在石墨上自发形成富有机 SEI，支撑了第一代商业锂电；但 2010 年代后转向 Li 金属与 Si 负极（容量高 1 个数量级、体积变化大数十倍，ref. 111），原有体系迅速失效。" },
    { kind: "why", body: "以前靠柔顺、强粘附的有机膜应对石墨的小幅膨胀；到了 Li/Si 负极，剧烈体积波动让有机膜反复破裂、渗液并生成死锂/断连硅，正极侧有机 CEI 也在高压高温下被过渡金属催化分解。" },
    { kind: "matters", body: "力学、电化学、传输、化学四项要求彼此牵制，单一材料几乎无法全部兼顾，这正是后续“富无机 + 分层”设计的出发点。" },
  ], 0.16);
  d.caption(s, "据原文第 7 页 Rational interphase design 整理", { x: 0.6, y: 5.8, w: 6.4, h: 0.3 });
  s.addNotes("原文首句列出的四项“often competing”要求：承受大体积变化不开裂不剥离；在苛刻电化学条件下抑制寄生氧化还原；允许快速载流子传输；在宽温区内化学稳健、致密、难透溶剂。正极侧还会受到晶格氧和过渡金属溶出的化学破坏（ref. 115–119）。");

  // ---------------- 5. Fig. 5c: Organic vs Inorganic SEI ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 5c：富有机 SEI vs 富无机 SEI", { placeholder: "title" });
  d.fig(s, "fig5c", { x: 0.5, y: 1.15, w: 12.3, h: 3.96 });
  d.block(s, { x: 0.6, y: 5.2, w: 5.9, kind: "hist", size: 13, body: "2000 年 Aurbach 系统总结了碳酸酯在石墨上的有机 SEI（ref. 109）；2014–2020 年间，高浓、局部高浓与氟化电解液推动了阴离子衍生富无机 SEI 的兴起。" });
  d.quote(s, { x: 6.75, y: 5.2, w: 6.0, bottom: 6.85, en: "To address these limitations, inorganic-rich domains have emerged as essential structural and functional components of advanced interphases", zh: "为克服这些局限，富无机微区已成为先进界面相不可或缺的结构与功能组分。" });
  d.caption(s, "据原文 Fig. 5c（左、中）重绘", { x: 0.6, y: 6.58, w: 4.5, h: 0.28 });
  s.addNotes("对比一目了然：溶剂衍生富有机 SEI 导离子快、覆盖匀，但怕体积变化、易渗液，且亲锂、与 Li 界面能低，反倒诱导不均匀沉积和枝晶（ref. 113、114）。阴离子衍生富无机 SEI 稳定、抗体积变化、抑枝晶，缺点是较难均匀成膜。");

  // ---------------- 6. Why LiF + crack resistance ----------------
  s = d.slide("CONTENT");
  s.addText("为什么都盯着 LiF？界面滑移与抗裂指数", { placeholder: "title" });
  d.fig(s, "lif_mech", { x: 0.45, y: 1.18, w: 6.3, h: 4.63 });
  d.column(s, 7.05, 1.3, 5.7, [
    { kind: "hist", body: "2018 年 Fan、Wang 等证明富氟电解液生成富 LiF 界面可大幅提升高压锂金属循环（ref. 115）；2021 年 Shadike 等（ref. 58）与 2025 年 Liu 等（ref. 120）借助先进表征揭示了纳米晶 LiF 的真实结构与异质性。" },
    { kind: "why", body: "以前追求 SEI “牢牢粘在电极上”，但在剧烈膨胀下强粘附反而把膜撕裂。LiF 具强离子性 Li–F 键（化学/电化学极稳），且对锂界面能高、粘附弱，能通过“界面滑移 (interfacial slip)”缓冲大变形并均化局部 Li⁺ 通量。" },
    { kind: "matters", body: "在 Fig. 5c 的计算抗裂指数中，LiF 位居各无机组分之首；但纯 LiF 体相导离子慢且难均匀成膜，需要与其他组分协同。" },
  ], 0.16);
  d.caption(s, "据原文 Fig. 5c（右）重绘；抗裂指数柱高为相对排序示意（原图单位 eV/Å²·MPa）", { x: 0.55, y: 5.95, w: 6.2, h: 0.45 });
  s.addNotes("注意原文第 7 页右栏在描述 LiF 时把“疏锂性 (lithiophobicity)”误排成了“lithiophilicity”（亲锂性），我们将在本章最后的阅读校注页专门指出。抗裂指数反映了界面相抵抗电极变形开裂的能力，LiF > Li2CO3 > Li2O > LiCl > Li2S > Li3N > Li3PS4。");

  // ---------------- 7. How to form anion-derived LiF-rich SEI ----------------
  s = d.slide("CONTENT");
  s.addText("怎样得到富 LiF 的 SEI？让阴离子先被还原", { placeholder: "title" });
  d.fig(s, "anion_path", { x: 0.5, y: 1.12, w: 12.3, h: 3.13 });
  d.block(s, { x: 0.6, y: 4.35, w: 3.9, kind: "hist", tint: true, size: 13, body: "2014 年 Yamada/Sodeyama 提出超浓电解液“牺牲阴离子还原”（ref. 77、78）；2018 年局部高浓 LHCE（ref. 28）；2020–2025 年发展出弱溶剂化、仿 FSI 溶剂与“盐溶于预盐”（ref. 29、130、131）。" });
  d.block(s, { x: 4.7, y: 4.35, w: 4.05, kind: "why", tint: true, size: 13, body: "以前稀溶液里阴离子带负电被负极排斥，总是溶剂先还原。减少配位溶剂后，含氟阴离子挤进 Li⁺ 溶剂化壳并被“挟带”到负极；同时 Li⁺–阴离子络合稳定了阴离子还原路径，使其还原电位明显上移，从而先于溶剂分解。" });
  d.block(s, { x: 8.95, y: 4.35, w: 3.8, kind: "matters", tint: true, size: 13, body: "无论是高浓、弱溶剂化、耐还原醚、离子液体还是“盐溶于预盐”，底层逻辑一致：改写第一溶剂化壳，让氟源（阴离子或仿 FSI 溶剂）成为成膜主角。" });
  s.addNotes("“盐溶于预盐”（salt-in-presalt，ref. 130、131）很有巧思：选用结构酷似 FSI⁻/TFSI⁻ 的溶剂，如 (CH3)2NSO2F 或 (CH3)2NSO2CF3，使溶剂和阴离子都能贡献氟化物，且适用于锂、钠等多种载流子体系。离子液体中的不对称有机阳离子也有助于提高盐溶解度和促进富 LiF 成膜（ref. 124）。");

  // ---------------- 8. Beyond LiF: other inorganics & bilayer ----------------
  s = d.slide("CONTENT");
  s.addText("不止 LiF：多元无机相与“内无机外有机”双层膜", { placeholder: "title" });
  d.fig(s, "bilayer", { x: 0.45, y: 1.25, w: 6.6, h: 4.3 });
  d.column(s, 7.35, 1.32, 5.4, [
    { kind: "hist", body: "1999 年 Aurbach 探讨锂表面 LiH（ref. 142）；2023 年 Zhang 等用三氧六环构筑双层 SEI（ref. 146），Kwon 等实现 LiF 可逆溶解再沉淀自维护（ref. 147）；2024 年 Hobold 与 Gallant 用定量滴定证实高库仑效率 SEI 富含 Li₂O（ref. 133）。" },
    { kind: "why", body: "以前只盯单一组分（如纯 LiF），容易发脆或覆盖不均。现在同时发掘 Li₂O、Li₃N、LiFₓHᵧ、Li₃P 来弱化粘附并均化 Li⁺ 通量，并通过“阴离子先还原、溶剂后还原”构筑内无机、外有机的双层结构。" },
    { kind: "matters", body: "外层有机相像“导离子粘结剂”把内层无机颗粒兜住并抑制溶解，把有机与无机的长处结合起来。" },
  ], 0.16);
  d.caption(s, "据原文第 9 页内容绘制：顺序还原形成双层结构，另有可逆溶解/再沉淀动态维持 LiF 的新策略", { x: 0.6, y: 5.7, w: 6.4, h: 0.45 });
  s.addNotes("注意原文对 Li3N、LiFxHy、Li3P 的谨慎措辞：“Although the precise mechanisms remain to be fully clarified”，它们被认为同样能降低界面粘附、改善 Li+ 通量均匀性。定量滴定法（titration）弥补了光谱技术难以给出绝对含量的短板。");

  // ---------------- 9. Balancing both electrodes ----------------
  s = d.slide("CONTENT");
  s.addText("两极都要稳：负极优先 + 正极“补救工具箱”", { placeholder: "title" });
  d.fig(s, "both_ends", { x: 0.5, y: 1.18, w: 12.3, h: 3.75 });
  d.block(s, { x: 0.6, y: 5.05, w: 4.0, kind: "hist", size: 13, body: "2009–2012 年 Sun 等提出浓度梯度正极（ref. 151、152）；2020–2025 年 Ko、Zheng、Zhang 等陆续发展高耐氧化稀释剂、功能粘结剂、杂原子掺杂与开环化学钝化（ref. 7、146、150、155、156）。" });
  d.block(s, { x: 4.8, y: 5.05, w: 4.2, kind: "why", size: 13, body: "离子对电解液利于阴离子还原成 SEI，却常抑制阴离子氧化、让正极难长阴离子衍生 CEI。而 Li/Si 负极体积剧变、可逆性最卡脖子，所以实践中常先保负极电位上移与稳健 SEI，再多管齐下给正极减负。" });
  d.block(s, { x: 9.2, y: 5.05, w: 3.55, kind: "matters", size: 13, body: "单一电极的电化学成膜很难两全；全电池必须打通电解液配方与正极材料、粘结剂、非电化学成膜的协同。" });
  s.addNotes("这一页直接呼应第 4 章的“SEI–CEI 跷跷板”。正极侧的六种补救办法包括：部分掺入高耐氧化溶剂/稀释剂、支持 CEI 的粘结剂和隔膜、表面贫镍的浓度梯度正极、有机/无机表面包覆、杂原子掺杂（如 Mg/Al 抑制氧化并清除酸）、以及靠开环反应实现的非电化学化学钝化。");

  // ---------------- 10. Measurement & modelling pitfalls ----------------
  s = d.slide("CONTENT");
  s.addText("表征与模拟陷阱：你测到的真是原始 SEI 吗？", { placeholder: "title" });
  d.fig(s, "pitfalls", { x: 0.45, y: 1.2, w: 6.4, h: 4.17 });
  d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: "2016 年 Fears 等发现非原位 XPS 与原位中子反射结果有明显偏差（ref. 159）；2017 年 Li、Cui 等引入冷冻电镜（ref. 160）；2020–2025 年 Steinrück、Yu、Gao、Shuchi 陆续证实 X 射线也会诱发 LiF 假象，并推动冷冻 XPS（ref. 158、161–163）。" },
    { kind: "why", body: "以前习惯拆电池、溶剂冲洗、真空干燥后做常规分析，结果受残留盐污染、清洗溶失和束流损伤扭曲。加之界面相持续溶解/重建，厚度与本征电导率本就难定义；模拟时间尺度又太短，且去溶剂化动力学有时比热力学更控速（ref. 164–167）。" },
  ], 0.16);
  d.quote(s, { x: 0.6, y: 5.5, w: 12.15, en: "interphase research must move beyond simple compositional chemistry towards a deeper understanding of electrolyte and full-cell energetics and their inherent trade-offs.", zh: "界面相研究必须超越单纯的组分化学，走向对电解质与全电池能量学及其内在权衡的更深理解。" });
  s.addNotes("非常中肯的科研警示：文献里很多“富 LiF”的 XPS 信号，有一部分可能来自残留锂盐在 X 射线照射下的分解（ref. 158、161、162）。实用化条件（高面容量、低 N/P 比、贫液、宽温高倍率，ref. 168）需要工况表征和多尺度模拟联手。");

  // ---------------- 11. Section 2 ----------------
  sectionSlide(d, "2 挑战与机遇：离子传输", "体相离子传输：快充与稳定性的拉锯", "为什么“离子对”稳住了界面却拖慢了电导率？为什么迁移数常常测不准？", "进入“Challenges and opportunities in electrolyte design for future batteries”前半部分（第 10–11 页，Fig. 6a）。高能量密度要求厚电极、高面载量，体相离子传输再次成为决定快充与安全的关键瓶颈。");

  // ---------------- 12. Fig. 6a (top): Three transport modes ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 6a：从“载体式”到“跳跃式”与“通道辅助”", { placeholder: "title" });
  d.fig(s, "transport_modes", { x: 0.5, y: 1.12, w: 12.3, h: 3.36 });
  d.block(s, { x: 0.6, y: 4.55, w: 3.9, kind: "hist", tint: true, size: 13, body: "传统高介电 EC 碳酸酯靠载体式达 ~10" + NB + "mS" + NB + "cm⁻¹（ref. 14）；2014–2023 年高浓与 LHCE 靠离子对稳界面却降电导率（ref. 181、182）；2024 年 Lu 等用氟代乙腈 FAN 实现通道超快传输（ref. 95）。" });
  d.block(s, { x: 4.7, y: 4.55, w: 4.15, kind: "why", tint: true, size: 13, body: "离子对与聚集体会抬高黏度、增大团簇尺寸，让电导率掉 1–2 个数量级。调强配位能拆团簇却丢掉电位优势；加稀释剂能降黏度却拆不小大团簇。于是科学家转向加速配体交换的跳跃式与小分子通道辅助机制。" });
  d.block(s, { x: 9.05, y: 4.55, w: 3.7, kind: "matters", tint: true, size: 13, body: "高面载量厚电极的离子路径长而曲折，体相传输一旦跟不上，不仅快充掉容量，还会引发反应不均与析锂风险。" });
  s.addNotes("三种机制的形象比喻：载体式（vehicular）= Li+ 坐着整辆“大巴”（溶剂化壳）挪动，团簇一大就堵车；结构式（structural/hopping）= 像接力棒一样在不同配体间快跳；通道辅助（channel-facilitated）= 小分子配体（如 FAN）排成顺畅的“快速通道”，边弱配位边高速交换。");

  // ---------------- 13. Fig. 6a (bottom): Conductivity chart ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 6a 数据：宽温区电导率差出好几个数量级", { placeholder: "title" });
  const temps = ["60°C", "30°C", "0°C", "−30°C", "−60°C"];
  s.addChart(
    d.pres.charts.LINE,
    [
      { name: "通道辅助 1.3M LiFSI/FAN", labels: temps, values: [45, 38, 30, 21, 14] },
      { name: "常规 1.0M LiPF₆/EC/EMC", labels: temps, values: [14, 11, 6.0, 1.4, 0.03] },
      { name: "弱溶剂化 1.0M LiFSI/DEE", labels: temps, values: [4.2, 3.0, 1.8, 0.8, 0.15] },
      { name: "高浓 5.5M LiFSI/DMC", labels: temps, values: [1.5, 0.8, 0.25, 0.03, null] },
    ],
    {
      x: 0.45, y: 1.25, w: 6.6, h: 4.45,
      chartColors: [HEX.accent5, HEX.accent4, HEX.accent2, HEX.dk1],
      lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 7,
      valAxisLogScaleBase: 10, valAxisMinVal: 0.01, valAxisMaxVal: 100, valAxisLabelFormatCode: "0.00",
      showTitle: true, title: "四类电解液离子电导率随温度变化（mS cm⁻¹，对数轴）",
      ...CH.font, ...CH.legend, ...CH.grid,
    }
  );
  d.stat(s, { x: 7.3, y: 1.28, w: 2.6, value: "~10", unit: "mS cm⁻¹", label: "常规碳酸酯室温电导率量级", color: "accent4" });
  d.stat(s, { x: 10.05, y: 1.28, w: 2.7, value: "1–2", unit: "数量级", label: "离子对电解液常见电导率折损", color: "accent3" });
  d.column(s, 7.3, 2.88, 5.45, [
    { kind: "why", body: "电导率 σ ∝ 载流子数 × 迁移率，反比于团簇尺寸与黏度（ref. 171）。高浓体系黏度大，低温骤降；常规 EC 在 −30°C 以下凝固拖垮电导率；小分子 FAN 通道体系在 −60°C 仍高于 10" + NB + "mS" + NB + "cm⁻¹。" },
  ]);
  d.quote(s, { x: 7.3, y: 4.78, w: 5.45, bottom: 6.85, en: "reconciling fast ion transport with favourable thermodynamic stability and interfacial kinetics across wide temperature ranges remains a major challenge in the design of future battery electrolytes.", zh: "在宽温度范围内兼顾快速离子传输、良好热力学稳定性与界面动力学，仍是未来电解质设计的重大挑战。" });
  d.caption(s, "据原文 Fig. 6a 对数曲线趋势读数重绘（示意值，精确数据见对应原文献及 Supplementary Table 1）", { x: 0.55, y: 5.8, w: 6.5, h: 0.4 });
  s.addNotes("原文图 6a 列出了 14 种代表性电解液，这里精选 4 条分别代表四类传输机制：通道辅助（黄）、常规载体式（红）、弱溶剂化/局部高浓（浅蓝）、超浓（深蓝）。其中 5.5M LiFSI/DMC 在极低温下凝固/超量程，原图在 −30°C 附近终止。");

  // ---------------- 14. PFG-NMR & Nernst-Einstein trap ----------------
  s = d.slide("CONTENT");
  s.addText("迁移数陷阱（一）：PFG-NMR 与 Nernst–Einstein 假设", { placeholder: "title" });
  eqBox(d, s, { x: 0.6, y: 1.25, w: 6.3, h: 1.38, eq: "t_{+,app} = D_{Li⁺} / (D_{Li⁺} + D_{anion})", eqSize: 22, sub: "表观传输数（apparent transport number）：仅由自扩散系数 D_{Li⁺}、D_{anion} 计算", subSize: 13 });
  d.fig(s, "pfg_trap", { x: 0.55, y: 2.75, w: 6.4, h: 3.7 });
  d.column(s, 7.25, 1.3, 5.5, [
    { kind: "hist", body: "1888 年 Nernst 与 1905 年 Einstein 建立扩散与电导的 Nernst–Einstein 关系；1965 年 Stejskal 与 Tanner 发明脉冲场梯度核磁（PFG-NMR）；2019 年 France-Lanord 与 Grossman 定量阐明离子对如何打破该关系（ref. 185）。" },
    { kind: "why", body: "以前只需测 Li⁺ 和阴离子的自扩散系数就能算 t₊,app，简单快捷。但 PFG-NMR 测的是无电场下的热运动自扩散，会把电中性的 Li⁺–阴离子对也算进“移动的 Li⁺”，而它们在电场下对电流毫无贡献。" },
    { kind: "matters", body: "高浓与弱溶剂化电解液富含离子对和聚集体，直接套用 PFG-NMR 往往严重错估真正的 Li⁺ 电荷传输比例。" },
  ], 0.16);
  d.caption(s, "概念示意：平衡态示踪扩散（tracer motion）≠ 电场驱动的集体电荷传输", { x: 0.6, y: 6.52, w: 6.3, h: 0.3 });
  s.addNotes("原文区分了两个容易混用的词：transport number（传输数，常按核磁扩散估算表观值）与 transference number（迁移数，相对溶剂参考系下真正由 Li+ 承载的电流占比）。关联运动（velocity correlation，ref. 186、187）甚至可能使真实迁移数为负值（阴离子聚集体把 Li+ 往反方向拖）。");

  // ---------------- 15. Bruce-Vincent-Evans method ----------------
  s = d.slide("CONTENT");
  s.addText("迁移数陷阱（二）：Bruce–Vincent–Evans 法为何易失真", { placeholder: "title" });
  d.fig(s, "bv_method", { x: 0.45, y: 1.25, w: 6.3, h: 3.96 });
  d.column(s, 7.05, 1.3, 5.7, [
    { kind: "hist", body: "1987 年 Bruce、Vincent 与 Evans 提出直流极化结合交流阻抗的 Li|电解质|Li 对称电池法（ref. 188），原用于固态聚合物电解质；1992 年 Bruce 等亦对比了 Hittorf 法（ref. 191）；2022–2023 年 Xu、Gao、Shao 等指出该方法在液态体系常被误用（ref. 189、190、192）。" },
    { kind: "why", body: "相比 PFG-NMR，它真正在施加直流电场测稳态电流。但公式成立需要六大苛刻前提：理想二元解离（无离子对/聚集体）、无副反应、SEI 电阻几乎不变、Li 表面形貌不变、且无液体对流——液态电池几乎条条违背。" },
    { kind: "matters", body: "未经前提验证就把测得数值当作本征迁移数，会误导电解液设计。更进一步，还需把体相传输与跨双电层/SEI/CEI 的界面传输整合成新描述符（ref. 193–195）。" },
  ], 0.16);
  d.block(s, { x: 0.6, y: 5.38, w: 6.1, kind: "def", tint: true, size: 13, head: "为什么会有电流衰减 I₀ → I_ss", body: "刚通小电压 ΔV 时，Li⁺ 和阴离子一起导电（电流 I₀）；随后阴离子在阻塞电极前堆积形成浓度梯度并停止净移动，稳态下只剩 Li⁺ 导电（电流 I_ss）。" });
  s.addNotes("注意 Bruce–Vincent 方法测得的值在非理想浓溶液中并不是严格意义上的 Newman 浓溶液迁移数，而是理想假设下的近似值。实测时若 SEI 随极化持续生长或发生副反应，I_ss 和 R_ss 都会严重偏离理论假设。");

  // ---------------- 16. Section 3 ----------------
  sectionSlide(d, "3 挑战与机遇：安全优先", "安全必须高于一切性能指标", "热失控是怎样一步步引爆的？如何让安全评估走进材料研发早期？", "对应原文第 10–11 页后半部分（Fig. 6b）。规模越大、能量密度越高，热失控带来的火灾、爆炸和剧毒气体危害就越致命。");

  // ---------------- 17. Fig. 6b (bottom): Thermal runaway cascade ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 6b：热失控不是单一着火，而是多级放热连锁", { placeholder: "title" });
  d.fig(s, "runaway", { x: 0.45, y: 1.2, w: 6.6, h: 4.37 });
  d.column(s, 7.35, 1.3, 5.4, [
    { kind: "hist", body: "1999 年 Richard 与 Dahn 用绝热加速量热仪（ARC）首次系统解析嵌锂石墨与电解液的热分解放热（ref. 196）；2018–2025 年 Larsson、Feng、Ouyang、Bertrand 等揭示气相串扰、有毒气体释放与铝热式点火机理（ref. 201、205–208）。" },
    { kind: "why", body: "以前把起火归咎于“溶剂烧起来了”。ARC 曲线表明热失控是连锁多米诺：① ~100" + NB + "°C 起 SEI 分解 → ② 裸露嵌锂负极与电解液直接放热 → ③ 反应性气体与酸跨极串扰、正极释氧并触发类铝热剧烈放热，同时释放大量有毒气体。" },
  ], 0.16);
  d.quote(s, { x: 7.35, y: 4.95, w: 5.4, bottom: 6.85, en: "Safety must take precedence over all other performance metrics in battery technology", zh: "在电池技术中，安全必须优先于其他所有性能指标。" });
  d.caption(s, "据原文 Fig. 6b（下）重绘：20 mAh 圆柱软包全电池（石墨 | NCM811）ARC 升温速率曲线", { x: 0.55, y: 5.7, w: 6.5, h: 0.45 });
  s.addNotes("热失控的可怕之处不仅在于火和爆炸，原文特别强调“release large quantities of toxic gases that rapidly disperse at elevated temperatures”（如 HF、CO、HCN 等），对人体的直接威胁往往早于明火。");

  // ---------------- 18. Safety beyond nonflammability ----------------
  s = d.slide("CONTENT");
  s.addText("超越“不燃”：多层次安全，固态也不自动安全", { placeholder: "title" });
  d.fig(s, "safety_layers", { x: 0.5, y: 1.18, w: 12.3, h: 2.35 });
  d.block(s, { x: 0.6, y: 3.85, w: 4.05, kind: "hist", tint: true, size: 13, body: "2017–2026 年 Wang、Fan 等开发含磷/氟/氯阻燃溶剂与功能盐（ref. 25、115、156 等）；2026 年 Ko、Ue、Yamada 剖析全固态电池新隐患（ref. 210）。" });
  d.block(s, { x: 4.85, y: 3.85, w: 4.05, kind: "why", tint: true, size: 13, body: "以前追求“点不着就安全”，用阻燃溶剂替换易燃的 LiPF₆/环状碳酸酯。但安全问题横跨液态、凝胶、混合与固态体系：固态虽降低挥发与可燃性，却仍可能长锂枝晶、失联、与荷电电极反应，甚至加速气相串扰。" });
  d.block(s, { x: 9.1, y: 3.85, w: 3.65, kind: "matters", tint: true, size: 13, body: "真正安全的电解质，必须同时压制挥发燃烧、抬高界面相热分解温度、阻断跨电极气体/酸串扰，且不牺牲电化学性能。" });
  s.addNotes("这一页打破了两个常见误区：误区一，“不燃溶剂 = 安全电池”（错，如果 SEI 在 100°C 就剧烈分解并放气串扰，照样热失控）；误区二，“全固态 = 绝对安全”（错，高荷电正极释氧遇锂金属也能引发剧烈铝热式反应，ref. 205、210）。");

  // ---------------- 19. Fig. 6b (top): mAh-scale ARC screening ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 6b：把全电池安全测试从 Ah 级缩到 ≥20 mAh", { placeholder: "title" });
  d.fig(s, "arc_scale", { x: 0.45, y: 1.22, w: 6.5, h: 3.94 });
  d.column(s, 7.25, 1.3, 5.5, [
    { kind: "hist", body: "1980 年 Townsend 与 Tou 在陶氏化学发明绝热加速量热仪（ARC）；长期以来针刺、挤压、热箱和 ARC 均依赖 1–3" + NB + "Ah 商业级大电池（ref. 216–223）；2025 年 Ko、Yamada 等提出 ≥20" + NB + "mAh 圆柱软包全电池 ARC 协议（ref. 224）。" },
    { kind: "why", body: "许多安全失效只在正负极与电解液共存的全电池里才会显现，但做大电池要消耗 4–15" + NB + "g 正极材料，实验室筛选新配方根本负担不起。把电池缩到 ≥20" + NB + "mAh（正极 < 1" + NB + "g），就能在研发早期快速获得全电池安全反馈。" },
  ], 0.16);
  d.quote(s, { x: 0.6, y: 5.38, w: 12.15, en: "Future electrolyte development will benefit not only from advances in material design but also from parallel progress in accessible and practical safety assessment techniques.", zh: "未来的电解质研发不仅得益于材料设计的进步，也将同样受益于易获取、实用的安全评估技术的同步发展。" });
  d.caption(s, "据原文 Fig. 6b（上）重绘（改编自 ref. 224, Ko et al., Nat. Energy 2025）", { x: 0.55, y: 5.12, w: 6.4, h: 0.28 });
  s.addNotes("ARC 的原理是“绝热追踪”：一旦电池自身放热升温，炉腔立刻同步升温消除散热，真实模拟大电池包内部散热不良时的最坏情况。从 Ah 级缩到 20 mAh 级的难点在于防止微小电池热量散失到夹具里，圆柱软包封装大幅降低了热容比。");

  // ---------------- 20. Section 4 ----------------
  sectionSlide(d, "4 全文总结与校注", "从“试配方”走向“物理化学框架”", "用一张全景图收束全篇五章，并核对本章的细节校注", "对应原文 Conclusion（第 11 页）。目标非常明确：面向实用化的下一代电池，要求 CE > 99.99%、快充高功率与全场景高安全同时达标。");

  // ---------------- 21. Big picture ----------------
  s = d.slide("CONTENT");
  s.addText("全文一图看懂：五章串成统一电解质设计框架", { placeholder: "title" });
  d.fig(s, "big_picture", { x: 0.5, y: 1.12, w: 12.3, h: 4.32 });
  d.quote(s, { y: 5.7, bottom: 6.88, en: "Moving beyond empirical optimization towards a physicochemical framework that accounts for electrolyte thermodynamics, kinetics and thermal/chemical stability will guide the rational design of fundamentally new classes of electrolytes and batteries.", zh: "超越经验优化，迈向统筹电解质热力学、动力学与热/化学稳定性的物理化学框架，将指引全新电解质与电池体系的理性设计。" });
  s.addNotes("回顾整套 5 章的逻辑链：第 1 章提出能量学视角 → 第 2 章用化学势 μ 和 Nernst 方程解释电极电位平行移动 → 第 3 章用液体 Madelung 势定量预测它 → 第 4 章用 Butler–Volmer 揭示电位移动对动态 SEI/CEI 负担的指数级影响 → 第 5 章统筹富无机界面、快速传输与本质安全。");

  // ---------------- 22. Errata & reading notes ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本章的术语笔误、引文与图示说明", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.9, kind: "note", tint: true, size: 13, head: "① 第 7 页 LiF 的“lithiophilicity”疑似笔误", body: "第 7 页左栏称富有机 SEI 具“高亲锂性（high lithiophilicity）与低界面能”；但同页右栏讲 LiF 时竟也写了“lithiophilicity and high interfacial energy ... weak adhesion”。LiF 实际为疏锂性（lithiophobicity），高界面能、弱粘附正源于疏锂，此处应为排版/写作笔误。" });
  d.block(s, { x: 6.85, y: 1.4, w: 5.9, kind: "note", tint: true, size: 13, head: "② Bruce–Vincent–Evans 法的引文缺漏", body: "第 10 页正文写“Bruce–Vincent–Evans method”，但对应文献 ref. 188 仅列了 Bruce & Vincent (1987, J. Electroanal. Chem. 225, 1)；正式加入界面电阻校正项 (R₀, R_ss) 的 Evans, Vincent & Bruce (1987, Polymer 28, 2324) 未列入参考文献表。" });
  d.block(s, { x: 0.6, y: 4.15, w: 5.9, kind: "def", tint: true, size: 13, head: "③ Fig. 6a 数据曲线说明", body: "本章第 13 页折线图按原文 Fig. 6a 对数坐标的趋势读数重绘，用于直观对比四类传输机制的温区与数量级差异；精确实验数值请查对应原始论文及原文 Supplementary Table 1。" });
  d.block(s, { x: 6.85, y: 4.15, w: 5.9, kind: "def", tint: true, size: 13, head: "④ 为什么结论强调 CE > 99.99%", body: "在无过量锂体系中，若每圈库仑效率为 99.9%，循环 1000 圈后只剩 0.999¹⁰⁰⁰ ≈ 36.8% 容量；达到 99.99% 时，1000 圈后仍可保留 0.9999¹⁰⁰⁰ ≈ 90.5% 容量，才具备实用寿命。" });
  s.addNotes("第 ① 条非常值得读原论文时留意：同一页上如果没把亲锂/疏锂辨清，初学者很容易被“高界面能却叫亲锂”绕晕。第 ④ 条简单算一下 0.9999 的 1000 次方，就能立刻明白为什么结论把 99.99% 定为门槛。");

  // ---------------- 23. Summary ----------------
  summarySlide(d, {
    title: "本章小结（暨全综述收官）",
    items: [
      ["理性界面相：富无机 + 分层 + 自维护", "LiF 等无机相高界面能、抗裂、弱粘附（界面滑移）；配外层有机相可抑制溶解"],
      ["全电池权衡：负极优先 + 正极补救", "先借离子对电解液保负极电位与 SEI，再用包覆、梯度、掺杂、耐氧化稀释剂等稳正极"],
      ["体相传输：警惕电导率折损与迁移数陷阱", "小分子配体通道可破除离子对黏度惩罚；PFG-NMR 与 Bruce–Vincent 在液态均需谨慎"],
      ["安全优先：截断多级放热链 + 前移测试", "超越“不燃”，关注 SEI 热分解、有毒气体与气相串扰；≥20 mAh 小电池 ARC 加速筛选"],
      ["统一框架：热力学 × 动力学 × 安全", "从孤立试错走向以载流子化学势为枢纽的系统电解质设计"],
    ],
    quote: { en: "Future electrolytes must enable ultralong cycle life with Coulombic efficiencies exceeding 99.99%, support fast-charging and high-power operation and ensure robust safety across manufacturing and real-world use.", zh: "未来的电解质必须实现库仑效率超过 99.99% 的超长循环寿命、支持快充与高功率运行，并在制造与实际使用中确保可靠安全。" },
    notes: "至此，Ko et al. (Nature Reviews Materials, 2026) 全部 5 章精读完成。建议结合第 1 章的“全文地图”和本章的“全文全景图”复习五章之间的因果脉络。",
  });

  return finish(d, outFile, figDir);
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
