// Ko et al. 2026 — Chapter 4: 界面相：概念演变与动力学（含电位依赖）
const path = require("path");
const { HEX } = require("../decklib");
const { PAPER, NB, makeDeck, R, eqBox, titleSlide, roadmap, sectionSlide, summarySlide, CH, finish } = require("./common");

async function build(outFile, figDir) {
  const d = await makeDeck(4, "界面相：概念演变与动力学", path.join(__dirname, "ch4_figs.js"), figDir);
  const C = d.C;
  let s;

  // ---------------- 1. Title ----------------
  titleSlide(d, {
    title: "第 4 章\n界面相：从“副产物”到“功能层”",
    sub: "概念演变 · 界面相动力学 · 界面稳定性对电极电位的依赖",
    fig: "title_motif4",
    notes: "本章对应原文三个小节：Conceptual evolution of interphases、Interphase dynamics、Dependence of interphase stability on electrode potential（第 6–8 页，Fig. 4、Fig. 5a,b 和式 (2)）。主线：界面相是动态的；电极电位通过指数关系决定界面相的“负担”。",
  });

  // ---------------- 2. Roadmap ----------------
  roadmap(d, {
    steps: [
      ["1", "为什么需要界面相", "电极电位落在电解液稳定区之外"],
      ["2", "概念演变（1970–2022）", "Li₂CO₃ 膜 → SEI → 多层/马赛克 → CEI"],
      ["3", "界面相是“活的”", "溶解、开裂、溶胀、持续还原"],
      ["4", "电位决定界面负担", "Butler–Volmer：0.6 V ↔ 10⁵ 倍电流"],
      ["5", "SEI 与 CEI 的权衡", "上移电位：负极受益、正极受累"],
    ],
    prev: "第 2、3 章：电解液改变 Li⁺ 的化学势，使两极电位一起移动（可测、可算）。本章看这一移动如何影响 SEI/CEI 的形成、负担与寿命。",
    fig: "roadmap4",
    next: "下一章（第 5 章）：怎样理性设计界面相，以及传输与安全的挑战。",
    notes: "SEI：solid electrolyte interphase，负极表面的固体电解质界面相；CEI：cathode electrolyte interphase，正极表面的界面相。interphase（界面相）强调它是一层有厚度的“相”，而不是两相之间的几何界面（interface）。",
  });

  // ---------------- 3. Fig. 4 timeline ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 4：五十年的 SEI / CEI 研究", { placeholder: "title" });
  d.fig(s, "fig4_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 5.35 });
  d.caption(s, "据原文 Fig. 4 重绘。棕：SEI 概念；灰：成分与结构；紫：CEI；青：定量模型；橙：现代界面工程。人名据原文正文与参考文献补充。", { x: 0.6, y: 6.6, w: 12.1, h: 0.3 }, { size: 11 });
  s.addNotes("2004 年的“数学模型”通常指 Ploehn、Ramadass 与 White 的溶剂扩散控制生长模型；2012 年的“两层/两机制”指 Qi 等对 SEI 中 Li⁺ 输运的计算（这两条的人名为我补充，原文 Fig. 4 未写）。图注原文：界面相使用低电位负极和高电位正极成为可能，它们的氧化还原电位都在电解液的热力学电位窗口之外。");

  // ---------------- 4. Section ----------------
  sectionSlide(d, "1 为什么需要界面相", "为什么需要界面相", "热力学上“不稳定”，靠动力学“稳住”");

  // ---------------- 5. Window & interphase ----------------
  s = d.slide("CONTENT");
  s.addText("电极电位落在稳定区之外，只能靠界面相“挡住”", { placeholder: "title" });
  d.fig(s, "window_interphase", { x: 0.45, y: 1.2, w: 6.6, h: 4.7 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1979 年 Peled 指出：碱金属在非水电解液中能“活下来”，是因为表面有一层像固体电解质的膜。1990 年 Dahn 组发现 EC 能在石墨上形成这样的膜，石墨负极才真正可用。" },
    { kind: "why", body: "以前追求“电解液与电极完全不反应”（热力学稳定），这对 Li 和高电位正极不可能。改为接受少量分解，让产物形成一层只通 Li⁺、不通电子的膜（动力学稳定）。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.6, w: 5.4, en: "These interphases kinetically suppress electrolyte decomposition and related side reactions while permitting efficient charge-carrier transport.", zh: "这些界面相从动力学上抑制电解液分解及相关副反应，同时允许载流子高效传输。" });
  s.addNotes("关键区别：热力学稳定 = 根本不想反应；动力学稳定 = 想反应但被挡住、反应得极慢。SEI/CEI 属于后者，所以一旦被破坏（开裂、溶解），反应会立刻恢复。这就是下一节“界面相动力学”的出发点。电位数值为示意。");

  // ---------------- 6. Section ----------------
  sectionSlide(d, "2 概念演变", "概念演变：界面相是怎样被认识的", "从“看到一层碳酸锂”到“可以设计的功能层”");

  // ---------------- 7. Dey & Peled ----------------
  s = d.slide("CONTENT");
  s.addText("Dey 的观察与 Peled 的 SEI 模型（1970–1979）", { placeholder: "title" });
  d.fig(s, "sei_peled", { x: 0.45, y: 1.2, w: 6.6, h: 4.3 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1970–1977 年，Arabinda N. Dey 研究了 PC 在电极上的分解，并在锂表面检测到 Li₂CO₃ 等无机分解产物（ref. 60、61）。1979 年 Emanuel Peled 正式提出 SEI 的概念（ref. 62）。" },
    { kind: "why", body: "以前把表面膜当作类似金属氧化物的“钝化膜”。Peled 强调它是电子绝缘、Li⁺ 导通的“固体电解质”，所以负极能在热力学稳定窗口之外继续工作。" },
    { kind: "matters", body: "“只通离子、不通电子”至今仍是评价一切界面相的首要标准。" },
  ]);
  d.block(s, { x: 0.6, y: 5.6, w: 6.45, kind: "def", tint: true, size: 14, head: "interphase 与 interface", body: "interface（界面）是两相之间的几何分界面；interphase（界面相）是夹在中间、有厚度的一层新相。" });
  s.addNotes("Peled 模型的另一个要点：SEI 在电子隧穿能穿透的厚度内生长很快，超过这个厚度后电子很难再到达电解液（下一节会讲约 3 nm 的隧穿极限）。interphase 一词本身就带着这种“有厚度的相”的含义。");

  // ---------------- 8. Multi-layer & mosaic ----------------
  s = d.slide("CONTENT");
  s.addText("SEI 不是均匀的：双层模型与马赛克模型", { placeholder: "title" });
  d.fig(s, "sei_models", { x: 0.45, y: 1.2, w: 6.6, h: 4.37 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1982 年 Geronov 等、1985 年 Nazri 与 Muller、1987 年 Aurbach 等相继揭示 SEI 由无机物（Li₂CO₃、Li₂O、LiF）和有机物（烷基碳酸锂 ROCO₂Li 等）组成；1997 年 Peled 等提出马赛克模型。" },
    { kind: "why", body: "以前认为 SEI 是一层成分单一的膜。光谱分析表明它是多相、多组分的“复合物”，成分主要由电解液怎样被还原决定。" },
    { kind: "matters", body: "马赛克模型指出：晶界可能是 Li⁺ 的优先通道。所以 SEI 的结构（不只是成分）也决定性能。" },
  ]);
  d.block(s, { x: 0.6, y: 5.7, w: 6.45, kind: "def", tint: true, size: 14, head: "怎么知道“不均匀”", body: "1980–90 年代起，红外光谱（FTIR）、X 射线光电子能谱（XPS）深度剖析等表面分析被大量用于 SEI 研究。" });
  s.addNotes("原文对马赛克模型的描述：随机分布的无机晶区嵌在无定形有机基体中，形成“多相异质微相结构”（polyheterogeneous microphase structure），其晶界可作为优先的离子传输通道。原文在这里引用的是 2010 年 Verma 等的综述（ref. 68），原始模型见 Peled 1997（ref. 67）。");

  // ---------------- 9. CEI & conceptual shift ----------------
  s = d.slide("CONTENT");
  s.addText("CEI 的发现：界面相从“副产物”变成“功能层”", { placeholder: "title" });
  d.fig(s, "cei_shift", { x: 0.45, y: 1.2, w: 6.6, h: 3.88 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "据原文 Fig. 4：1996 年在 LiCoO₂ 上观察到 ROCO₂Li 类 CEI；2000 年提出亲核/交换反应机理；2017 年提出脱氢反应机理；2022 年结合双电层（EDL）设计 CEI。" },
    { kind: "why", body: "既然两极都会长界面相，与其被动接受，不如通过电解液成分主动决定它长成什么样。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.25, w: 12.15, en: "interphases are no longer regarded as inevitable by-products of electrolyte decomposition but rather as functional entities whose properties can be deliberately tuned through electrolyte design", zh: "界面相不再被视为电解液分解不可避免的副产物，而是可以通过电解液设计有意调控其性质的功能实体。" });
  d.block(s, { x: 7.35, y: 4.15, w: 5.4, kind: "matters", body: "这一观念转变是第 5 章“理性界面设计”的前提。" });
  s.addNotes("CEI 的形成机理与 SEI 不同：正极电位高，电解液是被氧化；溶剂可能被正极表面的晶格氧亲核进攻，或发生脱氢，生成的产物沉积在正极表面。过渡金属还会催化这些反应（第 1、5 章）。");

  // ---------------- 10. Section ----------------
  sectionSlide(d, "3 界面相动力学", "界面相是“活的”", "亚稳、不断演化、没有清晰边界");

  // ---------------- 11. Dynamic nature ----------------
  s = d.slide("CONTENT");
  s.addText("反复破坏与重建：界面相怎样拖垮电池", { placeholder: "title" });
  d.fig(s, "dyn_chain", { x: 0.45, y: 1.2, w: 6.6, h: 4.37 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "2017 年 Li、Cui 等用冷冻电镜（cryo-EM）首次看清 SEI 的原子结构；此后核磁、微分电化学质谱（DEMS）、色谱等原位/工况方法被用来追踪界面相的演化（ref. 83–86、160）。" },
    { kind: "why", body: "以前把 SEI 当作一次形成、长期不变的“保护膜”。新的表征显示它不断受到化学、电化学和力学应力，反复受损、重建，即使在低荷电状态下也一样。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.55, w: 5.4, en: "Battery interphases are not static protective films but inherently metastable, dynamically evolving regions with no clear boundaries", zh: "电池界面相不是静态的保护膜，而是本质上亚稳、动态演化、没有清晰边界的区域。" });
  s.addNotes("原文列出的五种后果：电解液耗尽、形成电子孤立的活性物质（死锂、断连的硅）、界面电阻增大、空间上不均匀的载流子传输、局部力学应力集中（ref. 72–75）。");

  // ---------------- 12. Fig. 5a ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 5a：界面相失稳的六种方式", { placeholder: "title" });
  d.fig(s, "fig5a", { x: 0.5, y: 1.15, w: 12.3, h: 4.17 });
  d.block(s, { x: 0.6, y: 5.65, w: 6.0, kind: "why", tint: true, body: "①溶解 ②开裂 ③渗透与溶胀 ④产气剥离 ⑤局部过度生长 ⑥形成失控：每一种都让新鲜电极表面重新暴露给电解液。" });
  d.block(s, { x: 6.85, y: 5.65, w: 5.9, kind: "matters", tint: true, body: "Li 和 Si 负极体积变化巨大，①–④ 几乎不可避免，所以它们比石墨更依赖“能自我修复”的界面相。" });
  d.caption(s, "据原文 Fig. 5a 重绘", { x: 0.6, y: 5.33, w: 4, h: 0.28 });
  s.addNotes("原文图注：界面相失稳包括溶解、体积变化引起的断裂、溶剂驱动的溶胀和力学弱化、产气引发的剥离、局部过度生长，以及不受控的形成路径。");

  // ---------------- 13. SEI growth ----------------
  s = d.slide("CONTENT");
  s.addText("SEI 怎样长厚：隧穿、扩散，以及“停不下来”的还原", { placeholder: "title" });
  d.fig(s, "sei_growth", { x: 0.45, y: 1.2, w: 6.6, h: 4.3 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1979 年 Peled 用电子隧穿解释 SEI 的极限厚度；2004 年 Ploehn 等提出溶剂扩散控制、厚度随 √t 增长的模型；2020 年 von Kolzenberg 等系统总结了不同的生长区间（ref. 87）。" },
    { kind: "why", body: "以前以为膜超过隧穿极限（约 3 nm）就“钝化”了。实际上溶解、裂纹和溶剂渗透让多电子还原持续进行。" },
    { kind: "matters", body: "每多长一点 SEI，就多消耗一点 Li 和电解液，这正是库仑效率损失的主要来源。" },
  ]);
  s.addNotes("原文第 6 页：Li 金属上 SEI 的生长先通过电子隧穿穿过新生膜，直到厚度超过隧穿极限（约 3 nm），之后由中性 Li 原子扩散和自由基传输控制。尽管表面上已钝化，持续的多电子还原仍在进行（Fig. 5a），原因是界面相组分部分溶入电解液，以及大体积变化造成的纳米/微米裂纹。");

  // ---------------- 14. Swelling, dissolution, composition drift ----------------
  s = d.slide("CONTENT");
  s.addText("看不见的损伤：溶胀、溶解与电解液“变质”", { placeholder: "title" });
  d.fig(s, "swell", { x: 0.45, y: 1.2, w: 6.6, h: 4.0 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "2022 年 Zhang 等（Cui 组）用冷冻电镜直接观察到 SEI 在电解液中溶胀（ref. 89）；2023 年 Sayavong 等定量研究了 SEI 溶解对 Li 负极循环的影响（ref. 75）。" },
    { kind: "why", body: "以前只在干燥、清洗后的样品上看 SEI，看到的是“致密膜”。在电解液中它其实吸溶剂、变软、变得不均匀。" },
    { kind: "matters", body: "盐和溶剂被不平衡地消耗，电解液成分和溶剂化结构会逐渐漂移，改变后续的还原/氧化路径（ref. 90）。" },
  ]);
  s.addNotes("原文：即使没有宏观损伤，界面相也容易被电解液浸润而溶胀、截留溶剂，从而降低其弹性模量、增加空间不均匀性，进而降低电极的可逆性。这里的“电解液变质”是原文的“imbalanced salt and solvent consumption”。");

  // ---------------- 15. Section ----------------
  sectionSlide(d, "4 电位与界面稳定性", "界面稳定性取决于电极电位", "一个常被忽视的因素：同样的 SEI，在不同电位下负担天差地别");

  // ---------------- 16. No single window ----------------
  s = d.slide("CONTENT");
  s.addText("电位窗口无法严格定义：电极面对的是一群物种", { placeholder: "title" });
  d.fig(s, "species", { x: 0.45, y: 1.2, w: 6.6, h: 4.37 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1853 年 Helmholtz 提出双电层模型，1910–1913 年 Gouy 与 Chapman 引入扩散层，1924 年 Stern 合二为一。电极表面附近的离子分布与体相不同，早已是电化学常识。" },
    { kind: "why", body: "理想体系假设离子完全解离，于是电解液只有一个还原极限和一个氧化极限。真实 LiPF₆ 电解液里有 SSIP、CIP、混合配合物、聚集体，各有各的有效电位，而且不断交换配位伙伴。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.85, w: 5.4, en: "In other words, electrode surfaces are exposed to a dynamically evolving ensemble of electrochemically distinct species.", zh: "换言之，电极表面面对的是一个动态演化的、电化学性质各异的物种集合。" });
  s.addNotes("原文举例：LiPF6 电解液中同时存在溶剂分隔离子对 Li⁺(solvent)n 与 PF6⁻(solvent)m、接触离子对 Li⁺–PF6⁻、混合配合物和高阶聚集体 (Li⁺)x(PF6⁻)y(solvent)z。带负电或正电的电极表面附近，各物种的局部浓度又与体相不同，添加剂和电极表面化学还会改变它们对成膜的贡献。");

  // ---------------- 17. Butler–Volmer ----------------
  s = d.slide("CONTENT");
  s.addText("式 (2)：Butler–Volmer 方程的阴极项", { placeholder: "title" });
  eqBox(d, s, { x: 0.6, y: 1.3, w: 6.4, h: 2.25, eq: "j_{SEI} = j_{0,SEI} · exp[ αF (E_{eq,SEI} − E_{Anode}) / RT ]    (2)", eqSize: 18, sub: "j_{SEI}：形成 SEI 的电解液还原电流密度；j_{0,SEI}：交换电流密度；α：传递系数（常取 0.5）；F：法拉第常数；R：气体常数；T：温度；E_{eq,SEI}：成膜还原反应的平衡电位；E_{Anode}：负极电位", subSize: 13 });
  d.fig(s, "bv_barrier", { x: 0.5, y: 3.7, w: 6.5, h: 3.15 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "1905 年 Tafel 发现过电位与电流对数成直线（Tafel 式）；1924 年 Butler、1930 年 Erdey-Grúz 与 Volmer 从能垒角度推导出现在的 Butler–Volmer 方程。" },
    { kind: "why", body: "热力学只说“会不会反应”，动力学才说“反应多快”。负极电位每降低 ΔE，反应能垒降低 αFΔE，速率按指数增大。作者用最简单的“单一物种被还原”来说明这一点。" },
    { kind: "matters", body: "指数关系意味着：几百毫伏的电位移动，会让副反应速率相差好几个数量级。" },
  ]);
  s.addNotes("完整的 Butler–Volmer 方程有阳极和阴极两项；负极上电解液被还原时，阴极项占主导，所以原文只保留这一项。E_eq − E_Anode 越大（负极电位越低于成膜反应的平衡电位），还原电流越大。α 表示外加电能中有多大比例用来降低能垒。");

  // ---------------- 18. Fig 5b calculation ----------------
  s = d.slide("CONTENT");
  s.addText("Fig. 5b：0.6 V 的电位差 = 约 10⁵ 倍的还原电流", { placeholder: "title" });
  const dE = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  s.addChart(d.pres.charts.LINE, [{ name: "Δj", labels: dE.map((v) => v.toFixed(1)), values: dE.map((v) => Math.exp(-0.5 * 38.92 * v)) }], {
    x: 0.5, y: 1.25, w: 6.4, h: 4.3, chartColors: [HEX.accent4], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 8,
    valAxisLogScaleBase: 10, valAxisMinVal: 0.000001, valAxisMaxVal: 1, valAxisLabelFormatCode: "0.E+0",
    showTitle: true, title: "相对还原电流 Δj = exp(−αFΔE/RT)（对数轴）", ...CH.font, ...CH.grid, showLegend: false,
    showCatAxisTitle: true, catAxisTitle: "两种电解液中负极电位之差 ΔE = E_B − E_A（V）", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.stat(s, { x: 7.3, y: 1.3, w: 2.6, value: "38.9", unit: "V⁻¹", label: "F/RT（298 K）", color: "accent6" });
  d.stat(s, { x: 10.0, y: 1.3, w: 2.75, value: "≈118", unit: "mV", label: "α = 0.5 时，每 118 mV 电流变 10 倍", color: "accent1" });
  d.column(s, 7.3, 2.95, 5.45, [
    { kind: "why", body: "代入 α = 0.5、T = 298 K：ΔE = 0.6 V 时 Δj = exp(−11.7) ≈ 8.5 × 10⁻⁶，约 5 个数量级。这与原文“five-order-of-magnitude difference”一致。" },
    { kind: "matters", body: "电位较低的电解液在成膜初期驱动大得多的还原电流，造成快速、空间不均匀的 SEI 生长。" },
  ]);
  d.caption(s, "按原文 Fig. 5b 的假设（T = 298 K，α = 0.5）重新计算绘制", { x: 0.6, y: 5.65, w: 6.3, h: 0.3 });
  s.addNotes("计算：F/RT = 96485 / (8.314 × 298) = 38.94 V⁻¹；αF/RT = 19.47 V⁻¹；ln10 / 19.47 = 0.118 V，所以每 118 mV 电流相差 10 倍；0.6 V 对应 0.6/0.118 ≈ 5.1 个数量级。原文实验依据为 ref. 20 中观测到的 0.6 V 负极电位差。");

  // ---------------- 19. Low vs high potential SEI ----------------
  s = d.slide("CONTENT");
  s.addText("同样的 SEI，不同的命运", { placeholder: "title" });
  d.fig(s, "sei_low_high", { x: 0.45, y: 1.2, w: 6.6, h: 4.08 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "近年多项“电解液交换”实验发现：把同一块预先形成的 SEI 放进不同电解液，稳定性差别很大（ref. 101–104）。本文用电位差给出了统一解释。" },
    { kind: "why", body: "以前只用成分解释 SEI 好坏。现在加上电位：电位越低，膜下残余还原电流越大，越多原本不活泼的物种也开始被还原，重建时局部产物堆积产生应力，甚至产气导致开裂和剥离。" },
  ]);
  d.quote(s, { x: 0.6, y: 5.45, w: 12.15, en: "Even when the SEIs are identical in thickness, composition, defect density and electronic structure, the electrochemical burden imposed on the SEI remains exponentially sensitive to the anode potential.", zh: "即使 SEI 的厚度、成分、缺陷密度和电子结构完全相同，施加在 SEI 上的电化学负担仍对负极电位呈指数敏感。" });
  s.addNotes("原文总结：低负极电位电解液倾向于驱动大的还原电流，常生成不稳定的厚 SEI；高负极电位电解液促进更均匀的初始成膜，并使 SEI 的重建更温和、空间上更均匀。");

  // ---------------- 20. SEI–CEI trade-off ----------------
  s = d.slide("CONTENT");
  s.addText("SEI 与 CEI 的跷跷板", { placeholder: "title" });
  d.fig(s, "seesaw", { x: 0.45, y: 1.2, w: 6.6, h: 3.88 });
  d.column(s, 7.35, 1.35, 5.4, [
    { kind: "hist", body: "同一载流子体系（锂离子、锂金属电池）中两极同移，这一点在第 2 章 Fig. 2d 已经看到；把它与界面稳定性联系起来，是作者组 2022 年以来工作的核心（ref. 20、27）。" },
    { kind: "why", body: "以前分别设计负极电解液和正极电解液。现在必须同时权衡：让 Li⁺ 去稳定、电位上移，有利于 SEI，却可能把正极推出氧化极限。" },
  ]);
  d.quote(s, { x: 7.35, y: 4.5, w: 5.4, en: "creating electrochemical conditions that favour the SEI but can be detrimental to the CEI", zh: "由此形成的电化学条件有利于 SEI，却可能损害 CEI。" });
  d.block(s, { x: 0.6, y: 5.25, w: 6.45, kind: "matters", tint: true, body: "全电池优化必须正视这一内在权衡。第 5 章给出两极兼顾的设计思路。" });
  s.addNotes("原文：Importantly, full-cell optimization must carefully account for the intrinsic trade-offs between SEI and CEI。双离子电池等两极载流子不同的体系不受这一约束（第 2 章）。");

  // ---------------- 21. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本章的引用与年份", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① Dey 的两篇文献", body: "第 6 页说 Dey 在 Li 金属表面发现 Li₂CO₃（ref. 60、61）。但 ref. 60（Dey & Sullivan 1970）研究的是 PC 在石墨上的分解；锂表面膜的工作是 ref. 61（1977）。Fig. 4 的“1970–1977”把两者合在一起。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 双层 SEI 的年份", body: "Fig. 4 标“1981：双层 SEI”，而正文对应引用的 Geronov 等论文（ref. 64）是 1982 年。可能指同组更早的报告，原文没有给出 1981 年的出处。" });
  d.block(s, { x: 0.6, y: 3.4, w: 5.9, kind: "note", tint: true, head: "③ 马赛克模型的引用", body: "正文描述马赛克模型时引用的是 2010 年综述（ref. 68），原始模型是 Peled 等 1997 年（ref. 67，即 Fig. 4 的 1997）。想读原始论文请找 ref. 67。" });
  d.block(s, { x: 6.85, y: 3.4, w: 5.9, kind: "def", tint: true, head: "核对通过：“五个数量级”", body: "α = 0.5、T = 298 K、ΔE = 0.6 V：exp(−0.5 × 38.94 × 0.6) ≈ 8.5 × 10⁻⁶ ≈ 10⁻⁵·¹，与正文和 Fig. 5b 一致。" });
  s.addNotes("①、③ 是引用对应关系的问题，不影响结论；② 无法从原文判断，列为存疑。");

  // ---------------- 22. Summary ----------------
  summarySlide(d, {
    items: [
      ["界面相 = 动力学稳定", "电极电位在电解液稳定区之外，靠只通 Li⁺ 不通电子的 SEI/CEI 挡住分解"],
      ["概念演变：Li₂CO₃ 膜 → SEI（1979）→ 双层/马赛克 → CEI → 功能层", "从“副产物”变成“可设计的功能实体”"],
      ["界面相是“活的”", "溶解、开裂、溶胀、持续多电子还原；电解液成分也随之漂移"],
      ["Butler–Volmer：j ∝ exp(αFΔE/RT)", "0.6 V 电位差 ≈ 10⁵ 倍还原电流；相同的 SEI 负担也不同"],
      ["SEI–CEI 跷跷板", "电位上移利于负极、不利于正极，全电池必须权衡"],
    ],
    quote: { en: "electrode-potential shifts constitute a key electrolyte design parameter for interphase functionality and durability", zh: "电极电位移动是决定界面相功能与耐久性的关键电解液设计参数。" },
  });

  return finish(d, outFile, figDir);
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
