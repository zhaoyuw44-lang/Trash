// Lopez et al. 2019 — Chapter 3: 锂离子传输：聚合物电解质
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
  const info = await renderAll(path.join(__dirname, "ch3_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 3, chapterTitle: "锂离子传输：聚合物电解质", figDir });
  d.registerFigs(info);
  const C = d.C;

  // formula card helper
  // "a_{T}" -> subscript run
  const rich = (str, opts) => {
    const out = [];
    const re = /_\{([^}]*)\}/g;
    let last = 0, m;
    while ((m = re.exec(str))) {
      if (m.index > last) out.push({ text: str.slice(last, m.index), options: { ...opts } });
      out.push({ text: m[1], options: { ...opts, subscript: true } });
      last = re.lastIndex;
    }
    if (last < str.length) out.push({ text: str.slice(last), options: { ...opts } });
    return out;
  };
  const formula = (s, { x, y, w, h, main, sub, color = "accent1", size = 28 }) => {
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    const runs = rich(main, { fontSize: size, bold: true, color: C[color] });
    if (sub) runs[runs.length - 1].options.breakLine = true;
    if (sub) runs.push({ text: sub, options: { fontSize: 14, color: C.text2 } });
    s.addText(runs, { x: x + 0.25, y: y + 0.05, w: w - 0.5, h: h - 0.1, margin: 0, valign: "middle", isTextBox: true });
  };
  // symbol list helper: rows [[sym, meaning]]
  const symbols = (s, rows, { x, y, w, size = 14 }) => {
    const runs = [];
    rows.forEach(([a, b], i) => {
      rich(a + "　", { bold: true, color: C.accent3 }).forEach((r) => runs.push(r));
      runs.push({ text: b, options: { color: C.text1, breakLine: i < rows.length - 1 } });
    });
    const h = rows.length * size * 1.45 / 72 + 0.1;
    s.addText(runs, { x, y, w, h, fontSize: size, margin: 0, valign: "top", paraSpaceAfter: 3, isTextBox: true });
    return y + h;
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 3 章\n锂离子怎样在高分子里“走路”？", { placeholder: "title" });
  s.addText("聚合物电解质：σ = μc · VTF / WLF · 迁移数 · 分子设计", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文 “Designing polymers for Li-ion transport” 一节（第 6–9 页，含 Fig. 4 和公式 1–3）。核心问题：固体高分子里没有液体溶剂，Li⁺ 靠什么移动？怎样让它移动得更快、更“专一”？");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "离子怎样移动", "溶剂化 + 跳跃 + 链段运动；σ = μc"],
    ["2", "温度的影响：VTF 与 WLF", "为什么是 T − T₀，T₀ 为什么约等于 Tg − 50 K"],
    ["3", "迁移数 t+", "只让 Li⁺ 导电，别让阴离子“抢戏”"],
    ["4", "分子设计", "Tg、结晶、介电常数、连通性、单离子导体"],
    ["5", "电化学稳定窗口", "HOMO / LUMO 只是粗略指导"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.35 + i * 0.93;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 0.82, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.8, y: y + 0.14, w: 0.54, h: 0.54, fill: { color: C.text1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.55, y: y + 0.06, w: 5.2, h: 0.38, fontSize: 18, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.55, y: y + 0.43, w: 5.2, h: 0.33, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.block(s, { x: 0.6, y: 6.05, w: 6.3, kind: "def", head: "与第 2 章的衔接", body: "第 2 章要电解质“硬”；本章要链段“软”、能动。这对矛盾贯穿整章。" });
  d.fig(s, "chapter_strip", { x: 7.6, y: 1.35, w: 5.0, h: 5.4 });
  s.addNotes("第 2 章看到：PS-b-PEO 等高模量电解质的室温电导率都不超过 10⁻⁵ S cm⁻¹。本章解释原因：离子运动与链段运动绑在一起，链越僵，离子越慢。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从玻璃黏度到聚合物电解质", { placeholder: "title" });
  d.fig(s, "ion_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 3.95 });
  d.block(s, { x: 0.6, y: 5.3, w: 5.9, kind: "why", tint: true, body: "描述聚合物电解质的两条“温度公式”（VTF、WLF）都不是为电池发明的：它们来自玻璃和高分子黏度研究，被电解质研究者“借”了过来。" });
  d.block(s, { x: 6.8, y: 5.3, w: 5.9, kind: "matters", tint: true, body: "PEO 自 1973 年起就是最常用的聚合物电解质，至今仍是比较一切新材料的“基准线”。" });
  s.addNotes("时间轴不按比例。灰色：黏度与弛豫理论；紫色：PEO 电解质的发现；青色：迁移数与单离子导体。Armand 等的电池电解质提案在 1978 年会议上提出，1979 年发表于会议文集（即原文参考文献 90）。");

  // ---------------- 4. Why SPE ----------------
  d.section("1 离子怎样移动");
  s = d.slide("CONTENT");
  s.addText("为什么要用固体聚合物电解质 SPE", { placeholder: "title" });
  d.fig(s, "spe_compare", { x: 0.5, y: 1.2, w: 6.6, h: 3.5 });
  d.caption(s, "✓ 好　△ 一般　✕ 差（定性比较）", { x: 0.6, y: 4.72, w: 6.5 }, { size: 12 });
  d.quote(s, { x: 0.6, y: 5.85, w: 6.5, en: "SPEs offer the advantage of being low cost, highly processable and easy to integrate into existing battery architectures when compared with ceramic solid electrolytes", zh: "与陶瓷固体电解质相比，SPE 的优势在于成本低、易加工，且易于集成到现有电池结构中。" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1978 年 Armand 等提出：溶有锂盐的 PEO 可以作“干”的固体电解质，同时充当隔膜，用于锂金属电池。法国 Bolloré 公司后来把这类 Li 金属聚合物电池用在电动车上。" },
    { kind: "why", body: "液体电解质易燃、会持续与电极反应；陶瓷电解质硬而脆、贵，与电极贴合差。高分子介于两者之间：柔、便宜、能卷对卷加工。" },
    { kind: "matters", body: "原文列举固态电池能缓解的问题：体积膨胀、枝晶、副反应、物质输运失控和热失控。最大短板是室温电导率低，这正是本章主题。" },
  ]);
  s.addNotes("“干”聚合物电解质（dry SPE）不含液体溶剂，盐直接溶在高分子里；加了液体增塑剂的叫凝胶电解质。Bolloré 的 LMP 电池需要在约 60–80 °C 下工作，正是因为 PEO 室温电导率太低。");

  // ---------------- 5. Mechanism ----------------
  s = d.slide("CONTENT");
  s.addText("Li⁺ 在 PEO 里怎样移动", { placeholder: "title" });
  d.fig(s, "peo_hopping", { x: 0.5, y: 1.25, w: 6.6, h: 4.55 });
  d.caption(s, "据原文 Fig. 4a 重绘（示意）", { x: 0.6, y: 5.9, w: 6.5 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1973 年 Fenton、Parker 与 Wright 发现 PEO 能溶解碱金属盐并导电。1983 年 Druger、Nitzan 与 Ratner 提出“动态键逾渗”模型：位点之间的通道随链运动不断开合。" },
    { kind: "why", body: "液体里离子带着溶剂分子一起游动；高分子链太长、不能整体移动，所以 Li⁺ 只能在链上的醚氧之间“换座位”：一边跳跃，一边被链段运动带着走。" },
    { kind: "matters", body: "两个过程决定电导：盐要解离（产生载流子），链段要能动（提供空位）。后面所有设计都在调这两件事。" },
  ]);
  s.addNotes("原文：离子传输机理包括高分子主链使盐解离，以及解离后的离子通过离子跳跃或链段运动迁移。图中亮红色的 O 正在与 Li⁺ 配位；浅色圆是 Li⁺ 可以跳进去的空位点。");

  // ---------------- 6. sigma = mu c ----------------
  s = d.slide("CONTENT");
  s.addText("公式 (1)：σ = μc", { placeholder: "title" });
  formula(s, { x: 0.6, y: 1.35, w: 6.2, h: 1.3, main: "σ = μ · c", sub: "σ：电导率　μ：迁移率　c：自由载流子浓度" });
  d.fig(s, "sigma_mu_c", { x: 0.5, y: 2.85, w: 6.4, h: 3.3 });
  d.caption(s, "严格写法：σ = Σ nᵢ qᵢ μᵢ，对所有离子求和（q 为电荷）。原文简写为 σ = μc。", { x: 0.6, y: 6.25, w: 6.3, h: 0.45 });
  d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "1870 年代 Kohlrausch 系统测量电解质溶液电导，提出离子独立迁移定律；1887 年 Arrhenius 提出盐只部分解离；1900 年 Drude 用“载流子数 × 电荷 × 迁移率”描述金属导电。" },
    { kind: "why", body: "把 σ 拆成两个因子，就知道该改什么：c 取决于盐能不能解离（介电常数）；μ 取决于离子被抓得多紧、链能不能动（Tg、配位强度）。" },
    { kind: "matters", body: "μ 和 c 常常此消彼长：溶剂化太强，c 高但 μ 低；太弱，μ 高但 c 低。这是后面“刚刚好”原则的根源。" },
  ]);
  s.addNotes("类比：车流量 = 车速 × 车辆密度。离子对（Li⁺ 和阴离子贴在一起）整体不带电，不贡献电导，所以 c 只算“自由”离子。原文的 c 指 free charge carriers 的浓度。");

  // ---------------- 7. Section VTF ----------------
  d.section("2 温度：VTF 与 WLF");
  s = d.slide("DARK_SECTION");
  s.addText("温度怎样影响电导：VTF 与 WLF", { placeholder: "title" });
  s.addText("公式 (2) 的来历：玻璃黏度 → 高分子弛豫 → 聚合物电解质", { placeholder: "body" });
  s.addNotes("这一节把原文第 6 页的公式 (2) 拆开讲：每个符号是什么、谁在什么时候提出、电解质研究者为什么采用它。");

  // ---------------- 8. VTF equation ----------------
  s = d.slide("CONTENT");
  s.addText("公式 (2)：Vogel–Tammann–Fulcher（VTF）方程", { placeholder: "title" });
  formula(s, { x: 0.6, y: 1.35, w: 6.2, h: 1.05, main: "σ = A · exp[ −Eₐ / R(T − T₀) ]", size: 26 });
  let yy = symbols(s, [
    ["σ", "离子电导率（S cm⁻¹）"],
    ["A", "指前因子：温度很高时 σ 趋近的值，与载流子数有关"],
    ["Eₐ", "赝活化能（J mol⁻¹），不是真正的跳跃能垒"],
    ["R", "气体常数 8.314 J mol⁻¹ K⁻¹"],
    ["T", "绝对温度（K）"],
    ["T₀", "参考温度：分子运动“冻住”的温度，常取 Tg − 50 K"],
  ], { x: 0.75, y: 2.55, w: 6.0 });
  d.block(s, { x: 0.6, y: yy + 0.15, w: 6.2, kind: "def", tint: true, head: "和 Arrhenius 式比一比", body: "Arrhenius：σ = A exp(−Eₐ / RT)，要到 0 K 运动才停止。VTF：到 T₀ 就停止了，所以温度一接近 T₀，σ 下降得比 Arrhenius 快得多。" });
  d.column(s, 7.1, 1.35, 5.65, [
    { kind: "hist", body: "1921 年 Vogel、1925 年 Fulcher、1926 年 Tammann 与 Hesse 各自发现：玻璃和过冷液体的黏度不符合 Arrhenius 式，而符合 η = η₀ exp[B / (T − T₀)]。它原本是玻璃工业里描述“黏度”的经验式。" },
    { kind: "why", body: "晶体和液体中的离子“跳过能垒”，用 Arrhenius 式。聚合物里离子靠链段运动搬运，而链段在 T₀ 附近就几乎冻住，所以把 T 换成 T − T₀。" },
    { kind: "matters", body: "lg σ 对 1/T 作图若明显弯曲，说明导电受链段运动控制；若是直线，说明离子与链段“解耦”（后面的超离子导体）。" },
  ]);
  s.addNotes("原文写法 σ = A exp[−Eₐ / R(T − T₀)]；文献中也常见 σ = A T^(−1/2) exp[−B / (T − T₀)]，多出的 T^(−1/2) 来自自由体积理论推导，对结论影响不大。原文把这个名字拼成 “Tamman”，正确拼法是 Tammann（见校注页）。");

  // ---------------- 9. VTF chart ----------------
  s = d.slide("CONTENT");
  s.addText("画出来看：VTF 为什么是一条弯曲线", { placeholder: "title" });
  const invT = [2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9];
  const vtf = invT.map((x) => { const T = 1000 / x; return +(1.0 * Math.exp(-1200 / (T - 173))).toPrecision(3); });
  const s0 = 1.0 * Math.exp(-1200 / (1000 / 3.0 - 173));
  const arr = invT.map((x) => +(s0 * Math.pow(10, -2.016 * (x - 3.0))).toPrecision(3));
  s.addChart(d.pres.charts.LINE, [
    { name: "VTF（T₀ = 173 K，示意）", labels: invT.map((x) => x.toFixed(1)), values: vtf },
    { name: "Arrhenius 直线（Eₐ = 0.4 eV，示意）", labels: invT.map((x) => x.toFixed(1)), values: arr },
  ], {
    x: 0.5, y: 1.25, w: 6.8, h: 3.95, ...AX,
    chartColors: [HEX.accent3, HEX.accent6], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 6,
    valAxisLogScaleBase: 10, valAxisMinVal: 0.0000001, valAxisMaxVal: 0.01, valAxisLabelFormatCode: "0E+0",
    showTitle: true, title: "电导率 σ（S cm⁻¹）vs 1000/T",
    showLegend: true, legendPos: "b",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "1000 / T（K⁻¹）　← 热　　冷 →",
  });
  d.caption(s, "示意曲线，参数为假设值：A = 1 S cm⁻¹，Eₐ/R = 1200 K，T₀ = Tg − 50 K = 173 K。横轴 2.6 ≈ 112 °C，3.9 ≈ −17 °C。", { x: 0.6, y: 5.25, w: 6.7, h: 0.45 });
  d.quote(s, { x: 0.6, y: 6.05, w: 12.15, en: "The Vogel–Tamman–Fulcher equation provides qualitatively accurate descriptions of ion transport in many studies; however, the precise meanings of the constants are not clear", zh: "VTF 方程在许多研究中能定性准确地描述离子传输，但其中常数的确切含义并不清楚。" });
  d.column(s, 7.6, 1.35, 5.15, [
    { kind: "hist", body: "1980 年代，Armand、Ratner、Shriver 等发现 PEO–盐体系的电导–温度曲线符合 VTF 形式；1988 年 Ratner 与 Shriver 的综述使它成为分析聚合物电解质的标准工具。" },
    { kind: "why", body: "电解质研究者采用 VTF，是因为它直接体现“离子跟着链段走”：温度越接近 T₀，链段越冻，σ 掉得越快。" },
    { kind: "matters", body: "2017 年 Diederichsen 等指出 Eₐ 与 A 相互“补偿”，拟合值彼此耦合，单比 Eₐ 要小心。" },
  ], 0.18);
  s.addNotes("两条曲线在 1000/T = 3.0（约 60 °C）处重合。降温时 VTF 曲线比直线掉得更快：这就是室温下 PEO 电导率急剧变差的原因之一（另一个原因是结晶）。");

  // ---------------- 10. WLF ----------------
  s = d.slide("CONTENT");
  s.addText("WLF 方程与“Tg − 50 K”的来历", { placeholder: "title" });
  formula(s, { x: 0.6, y: 1.35, w: 6.2, h: 1.3, main: "lg a_{T} = −C_{1}(T − T_{r}) / (C_{2} + T − T_{r})", sub: "aT：移位因子（弛豫时间或黏度之比）；Tr 取 Tg 时 C1 ≈ 17.4，C2 ≈ 51.6 K", size: 22 });
  d.block(s, { x: 0.6, y: 2.8, w: 6.2, kind: "def", tint: true, head: "两步推导：WLF 就是 VTF", body: "令 T₀ = Tg − C2 ≈ Tg − 51.6 K，代入整理得 ln aT = 常数 + 2.303 C1C2 / (T − T₀)，正是 VTF 的形式。“T₀ ≈ Tg − 50 K”就是这样来的。" });
  d.column(s, 0.6, 4.35, 6.2, [
    { kind: "hist", body: "1955 年 Williams、Landel 与 Ferry 提出 WLF 方程，把不同温度下的高分子弛豫数据“平移”叠成一条主曲线（时温叠加）。" },
    { kind: "why", body: "原文说 T₀ 在 WLF 中可任意取，离子传输中常取 Tg − 50 K。用普适常数一推，就知道这 50 K 不是凑出来的。" },
  ], 0.15);
  d.fig(s, "free_volume", { x: 7.05, y: 1.25, w: 5.7, h: 3.75 });
  d.block(s, { x: 7.05, y: 5.15, w: 5.7, kind: "matters", body: "T₀ 是自由体积（或构型熵）外推到零的温度（Cohen–Turnbull 1959，Adam–Gibbs 1965）。离子在 T₀ 以下“无处可去”。" });
  s.addNotes("推导：lg a_T = −C₁(T − Tg)/(C₂ + T − Tg)。令 T₀ = Tg − C₂，则 T − Tg = (T − T₀) − C₂，代入得 lg a_T = −C₁ + C₁C₂/(T − T₀)。黏度或弛豫时间正比于 a_T，电导率反比于它，所以 σ ∝ exp[−2.303 C₁C₂ / (T − T₀)]，与 VTF 一致；用普适常数算出 Eₐ/R ≈ 2.303 × 17.4 × 51.6 ≈ 2070 K。原文参考文献 97、98 分别是 Adam–Gibbs 与 Cohen–Turnbull。");

  // ---------------- 11. Transference number ----------------
  s = d.slide("CONTENT");
  s.addText("公式 (3)：迁移数 t+", { placeholder: "title" });
  formula(s, { x: 0.6, y: 1.35, w: 6.2, h: 1.25, main: "t+ = μ₊ / (μ₊ + μ₋)", sub: "μ₊：阳离子（Li⁺）迁移率　μ₋：阴离子迁移率　适用于只含一种盐的二元电解质", size: 26 });
  d.column(s, 0.6, 2.8, 6.2, [
    { kind: "hist", body: "1853 年起 Hittorf 根据电解后两极附近浓度的变化测出迁移数。1987 年 Evans、Vincent 与 Bruce 提出对称 Li|Li 电池的直流极化法，成为聚合物电解质的标准测法。" },
    { kind: "why", body: "只看 σ 会被误导：PEO–LiTFSI 的 t+ 约 0.2，意味着约 80% 的电流由阴离子承担，而阴离子不参加电极反应。" },
    { kind: "matters", body: "阴离子在一侧堆积造成浓差极化，过电位增大、倍率变差。理想值 t+ = 1。" },
  ], 0.18);
  d.fig(s, "transference", { x: 7.05, y: 1.25, w: 5.7, h: 3.75 });
  d.quote(s, { x: 7.05, y: 5.15, w: 5.7, en: "Ideally, the transference number will be unity, as transport of the redox-inactive anion results in concentration polarization across the cell", zh: "理想情况下迁移数应为 1，因为不参与氧化还原的阴离子的迁移会在电池内造成浓差极化。" });
  s.addNotes("原文：迁移数是二元电解质中阳离子迁移率与总迁移率之比，描述电场作用下的离子迁移。严格地说，聚合物电解质中有离子对和离子团簇，不同方法测得的“迁移数”含义略有不同，这里按原文的简化定义理解即可。");

  // ---------------- 12. Section design ----------------
  d.section("3 分子设计");
  s = d.slide("DARK_SECTION");
  s.addText("设计更好的聚合物电解质", { placeholder: "title" });
  s.addText("降低 Tg 与结晶 · 解耦 · 介电常数与给体数 · 连通性 · 单离子导体 · 稳定窗口", { placeholder: "body" });
  s.addNotes("对应原文 “Designing polymers for effective Li-ion transport” 和 “Electrochemical stability considerations” 两小节（第 8–9 页），以及 Fig. 4b–e。");

  // ---------------- 13. Crystallinity ----------------
  s = d.slide("CONTENT");
  s.addText("离子只在无定形区里走：降低结晶与 Tg", { placeholder: "title" });
  d.fig(s, "cryst_amorph", { x: 0.5, y: 1.25, w: 6.6, h: 4.35 });
  d.caption(s, "示意。PEO 是半结晶高分子：晶区（橙）与无定形区（灰色链）共存。", { x: 0.6, y: 5.7, w: 6.5 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1983 年 Berthier、Armand 等用 NMR 证明：PEO–盐体系的离子导电主要发生在无定形区。2001 年 Bruce 组发现特定晶态结构也能导电，是少数例外。" },
    { kind: "why", body: "PEO 熔点约 65 °C，室温下大部分结晶，电导率很低，所以 PEO 电池常在 60–80 °C 工作。对策：抑制结晶、降低 Tg，让更多链段动起来。" },
    { kind: "matters", body: "降低 Tg 是最好拧的“旋钮”。但正如第 2 章，链一软，模量也跟着降。" },
  ]);
  s.addNotes("原文：普遍认为聚合物中的离子传导发生在无定形区（除特定情形外），因此设计目标之一是减少结晶、增加无定形相。Tg（玻璃化转变温度）以下链段冻结；工作温度高于 Tg 越多，链段越活跃。");

  // ---------------- 14. Fig. 4c ----------------
  s = d.slide("CONTENT");
  s.addText("三种降低 Tg 的方法", { placeholder: "title" });
  d.fig(s, "tg_mods", { x: 0.5, y: 1.25, w: 5.8, h: 5.1 });
  d.caption(s, "据原文 Fig. 4c 重绘。第一行：聚乙烯亚胺主链上接 m 个环氧乙烷单元的侧链。", { x: 0.6, y: 6.4, w: 6.0, h: 0.45 });
  d.column(s, 6.75, 1.35, 6.0, [
    { kind: "hist", body: "1996 年 Hawker 等做出超支化 PEG 电解质；1999 年 Watanabe 组用超支化侧链网络；2012 年 Sun、Balsara、Zuckermann 用类肽（peptoid）精确控制侧链长度；2015 年 Grubbs 组做出瓶刷状高分子电解质。" },
    { kind: "why", body: "长侧链、多支化、少交联都让链段更“松”：Tg 降低，结晶被打乱，于是 σ 上升。" },
    { kind: "matters", body: "这是最常用的 SPE 设计手段。但原文强调：降低 Tg 并不改变 Li⁺ 在 PEO 中的核心传输机理，提升有上限。真正决定传输的是盐的解离程度和 Li⁺ 的配位环境。" },
  ]);
  s.addNotes("原文的例子（参考文献 103）：主链化学完全相同、只改变侧链长度的一组高分子，侧链从 1 个重复单元增加到 3 个时，离子电导提高了 10 倍。其他降低 Tg 的策略：增加支化、降低交联度、合成超支化或瓶刷状高分子。");

  // ---------------- 15. Fig. 4d data ----------------
  s = d.slide("CONTENT");
  s.addText("数据：Tg 降下去，σ 升上来", { placeholder: "title" });
  const cats = ["起点", "", "", "", "终点"];
  const chartBase = {
    ...AX, lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 8,
    chartColors: ["2E86C1", HEX.accent1, "3BAA5C"],
    showLegend: true, legendPos: "b",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "修饰程度 →（原图横轴未标刻度）",
  };
  s.addChart(d.pres.charts.LINE, [
    { name: "侧链", labels: cats, values: [2.9e-7, null, 1.6e-5, null, 3.1e-5] },
    { name: "支化", labels: cats, values: [6.6e-4, 9.3e-4, 1.23e-3, null, 1.38e-3] },
    { name: "交联", labels: cats, values: [1.33e-5, null, 4.9e-5, null, 1.02e-4] },
  ], { ...chartBase, x: 0.5, y: 1.25, w: 6.1, h: 3.7, valAxisLogScaleBase: 10, valAxisMinVal: 0.0000001, valAxisMaxVal: 0.01, valAxisLabelFormatCode: "0E+0", showTitle: true, title: "离子电导率 σ（S cm⁻¹）" });
  s.addChart(d.pres.charts.LINE, [
    { name: "侧链", labels: cats, values: [52, null, 10, null, -3] },
    { name: "支化", labels: cats, values: [-37, -47, -50, null, -55] },
    { name: "交联", labels: cats, values: [-43, null, -45, null, -46] },
  ], { ...chartBase, x: 6.7, y: 1.25, w: 6.1, h: 3.7, valAxisMinVal: -80, valAxisMaxVal: 60, showTitle: true, title: "玻璃化转变温度 Tg（°C）" });
  d.caption(s, "据原文 Fig. 4d 读数重绘（近似值）。原图 σ 与 Tg 画在同一张双轴图里，这里拆成两张。", { x: 0.6, y: 5.0, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.4, w: 5.9, kind: "matters", tint: true, size: 14, body: "三种修饰都让 Tg 下降、σ 上升，与 VTF 的预期一致：工作温度离 T₀ 越远，链段越活跃。" });
  d.block(s, { x: 6.8, y: 5.4, w: 5.95, kind: "note", tint: true, size: 13, body: "正文说侧链从 1 个单元加到 3 个时 σ 提高“10 倍”；但图中侧链的 σ 从约 3×10⁻⁷ 升到约 3×10⁻⁵，约 100 倍。原图横轴未标注，无法确定哪两点对应 1 和 3 个单元。" });
  s.addNotes("侧链系列（蓝）变化最大：Tg 从约 52 °C 降到约 −3 °C，σ 升了约两个数量级。支化系列（橙）本身 Tg 已经很低，σ 只是缓慢上升。交联系列（绿）Tg 几乎不变，σ 仍有提升，说明除了 Tg，网络结构本身也有影响。");

  // ---------------- 16. Decoupling ----------------
  s = d.slide("CONTENT");
  s.addText("“超离子”聚合物：让离子与链段解耦", { placeholder: "title" });
  d.fig(s, "decouple", { x: 0.5, y: 1.25, w: 6.6, h: 3.7 });
  d.block(s, { x: 0.6, y: 5.1, w: 6.5, kind: "def", head: "解耦 Decoupling", body: "离子运动比链段弛豫快得多，不再“链动离子才动”。刚性链堆不紧，留下多余的自由体积，离子可以在其中快速移动。" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "1980 年代 Angell 提出“解耦”概念，用来描述玻璃和熔盐中离子运动快于结构弛豫的现象。1998 年 Wei 与 Shriver 在含刚性高分子的电解质中观察到高电导；2012 年 Wang、Sokolov 等报道了解耦的聚合物电解质。" },
    { kind: "why", body: "常规思路是让链更软（降 Tg），可链一软模量就低。若离子能在刚性链之间的空隙里走，就有可能“又硬又导”。" },
    { kind: "matters", body: "这是打破第 2 章“力学–电导”矛盾的一条思路，目前仍在研究阶段。" },
  ]);
  s.addNotes("原文：大量工作致力于开发“超离子”聚合物导体，其中离子传输与链段弛豫解耦；刚性高分子的受挫堆积（frustrated packing）造成过量自由体积，使离子传输比按 Tg 预期的更快。");

  // ---------------- 17. Dielectric constant & donor number ----------------
  s = d.slide("CONTENT");
  s.addText("溶剂化要“刚刚好”：介电常数与给体数", { placeholder: "title" });
  d.fig(s, "solvation", { x: 0.5, y: 1.25, w: 7.0, h: 3.7 });
  d.quote(s, { x: 0.6, y: 5.1, w: 6.9, en: "ion solvation can either be too strong, in which case the ion is adhered to the polymer backbone and thus immobile, or too weak, in which case the salt does not dissociate.", zh: "离子溶剂化可能太强，离子被粘在主链上动不了；也可能太弱，盐根本不解离。" });
  d.column(s, 7.8, 1.35, 4.95, [
    { kind: "def", body: "介电常数 ε 越大，正负离子间的吸引越弱，盐越易解离。给体数 DN 越大（Lewis 碱性越强），对 Li⁺ 抓得越紧。" },
    { kind: "hist", body: "1926 年 Bjerrum 用介电常数估算离子何时成对；1966 年 Gutmann 用溶剂与 SbCl₅ 的反应焓定义“给体数”；2000 年 Kim 与 Oh 用它解释凝胶聚合物电解质。" },
    { kind: "why", body: "以前只追求“溶得越多越好”。现在知道要适中：PEO 对 Li⁺ 偏强，t+ 只有约 0.2。" },
    { kind: "matters", body: "原文坦言：系统研究还很缺乏，这是值得做的方向。" },
  ], 0.16);
  s.addNotes("原文：提高高分子的介电常数会提高盐的解离程度；而带 Lewis 碱性官能团（给体数更高）的高分子对 Li⁺ 的配位通常更强。PEO 与 LiTFSI 的迁移数为 0.2，说明 PEO 的配位环境太强。");

  // ---------------- 18. Fig. 4b ----------------
  s = d.slide("CONTENT");
  s.addText("换一种主链：松散配位与“抓阴离子”", { placeholder: "title" });
  d.fig(s, "fig4b", { x: 0.5, y: 1.25, w: 7.0, h: 3.5 });
  d.caption(s, "据原文 Fig. 4b 重绘", { x: 0.6, y: 4.8, w: 6.9 });
  d.block(s, { x: 0.6, y: 5.2, w: 6.9, kind: "matters", tint: true, body: "迁移数可从约 0.2 提到 0.5–0.9；但室温电导往往没有同步提高（下一页数据）。聚硼烷能否合成出来还未知。" });
  d.column(s, 7.8, 1.35, 4.95, [
    { kind: "hist", body: "1984 年 Blonsky、Shriver、Allcock 等报道聚磷腈电解质；2014 年 Tominaga 的聚碳酸亚乙酯（PEC）、Wong 等的全氟聚醚（PFPE）；2018 年 Mackanic 等的交联 PTHF；2017 年 Savoie、Webb、Miller 计算提出 Lewis 酸性的聚硼烷。" },
    { kind: "why", body: "PEO 抓 Li⁺ 太紧，就换配位较弱的主链（碳酸酯、四氢呋喃、酯、全氟醚）；更激进的做法是让高分子主链去“抓”阴离子 TFSI⁻，把 Li⁺ 放出来。" },
  ]);
  s.addNotes("箭头粗细表示迁移率。左：过强配位，Li⁺ 几乎不动，阴离子跑得快；中：松散配位，两者都能动；右：高分子选择性溶剂化阴离子，Li⁺ 跑得快。Mackanic 是本综述的第二作者。");

  // ---------------- 19. Fig. 4e ----------------
  s = d.slide("CONTENT");
  s.addText("数据：不同主链的室温电导率与迁移数", { placeholder: "title" });
  const polys = ["PEO", "PPO", "PTHF", "PEC", "PVCa", "PFPE", "PEI", "b-PEI", "P(STFSILi)"];
  const pcol = [HEX.accent3, HEX.accent3, HEX.accent3, "2E86C1", "2E86C1", "3BAA5C", HEX.accent5, HEX.accent5, HEX.accent1];
  s.addChart(d.pres.charts.BAR, [{ name: "室温 σ", labels: polys, values: [4.8e-5, 3.3e-6, 2.8e-6, 2.9e-5, 2.3e-5, 2.4e-5, 2.3e-7, 1.9e-6, 1.36e-5] }], {
    x: 0.5, y: 1.2, w: 7.3, h: 2.85, ...AX, barDir: "col", chartColors: pcol,
    valAxisLogScaleBase: 10, valAxisMinVal: 0.0000001, valAxisMaxVal: 0.001, valAxisLabelFormatCode: "0E+0",
    showTitle: true, title: "室温离子电导率 σ（S cm⁻¹）", showLegend: false,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
  });
  s.addChart(d.pres.charts.BAR, [{ name: "t+", labels: polys, values: [0.16, 0.54, 0.54, 0.54, 0.57, 0.9, null, null, 0.85] }], {
    x: 0.5, y: 4.1, w: 7.3, h: 2.5, ...AX, barDir: "col", chartColors: pcol,
    valAxisMinVal: 0, valAxisMaxVal: 1, valAxisMajorUnit: 0.5,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00",
    showTitle: true, title: "迁移数 t+（PEI、b-PEI 原图无数据）", showLegend: false,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
  });
  d.caption(s, "据原文 Fig. 4e 读数重绘（近似值）。紫：醚；蓝：碳酸酯；绿：含氟；黄：含氮；橙：单离子导体。", { x: 0.6, y: 6.62, w: 7.2, h: 0.3 });
  d.column(s, 8.1, 1.35, 4.65, [
    { kind: "hist", body: "数据来自不同课题组：2013 年 Bouchet（单离子）、2014 年 Tominaga（PEC）与 Wong（PFPE）、2018 年 Mackanic（PTHF）等。" },
    { kind: "why", body: "PEO 电导率最高，但 t+ 最低（≈ 0.2）。换成弱配位或单离子主链，t+ 升到 0.5–0.9，σ 却大多更低。" },
    { kind: "matters", body: "选电解质要看 σ × t+（真正由 Li⁺ 承担的那部分电导），而不是只看 σ。" },
    { kind: "note", size: 13, body: "P(STFSILi) 一栏标为“室温”，但据我们所知原文献（Bouchet 2013）报道的 1.3×10⁻⁵ S cm⁻¹ 是 60 °C 的值，请对照原文献核实。" },
  ], 0.18);
  s.addNotes("这张图把高分子按主链官能团分类。注意不同数据来自不同课题组，盐种类、浓度和测量方法并不完全一致，只能做定性比较。PEO 的 t+ 圆点在图中约 0.16，正文写作 0.2。");

  // ---------------- 20. Connectivity ----------------
  s = d.slide("CONTENT");
  s.addText("连通性 Connectivity：下一步有没有地方跳", { placeholder: "title" });
  d.fig(s, "connectivity", { x: 0.5, y: 1.25, w: 6.6, h: 3.7 });
  d.quote(s, { x: 0.6, y: 5.15, w: 6.5, en: "It is for this reason that relatively chemically simple polymer electrolytes such as PEO are so effective.", zh: "正因如此，像 PEO 这样化学结构相对简单的聚合物电解质才如此有效。" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2015 年 Webb、Miller 等在聚酯电解质的计算与实验研究中提出“溶剂化位点连通性”；2016 年 Pesko、Balsara 等发现多种醚类电解质的电导与连通性满足统一关系。" },
    { kind: "why", body: "只用 Tg 解释不了为什么有的高分子 Tg 很低、导电却很差。还要看 Li⁺ 周围有多少个“好位点”可以跳过去。" },
    { kind: "matters", body: "位点均匀、彼此靠近最有利。PEO 每隔两个碳就有一个醚氧，这种简单规整的结构恰好最好。" },
  ]);
  s.addNotes("原文：连通性描述的是 Li⁺ 从当前溶剂化位点出发，可以移动到的有利位点的数目。考虑连通性之后，电导率与 Tg 之间的偏差就能得到解释。");

  // ---------------- 21. Single-ion ----------------
  s = d.slide("CONTENT");
  s.addText("单离子导体：把阴离子“钉”在链上", { placeholder: "title" });
  d.fig(s, "single_ion", { x: 0.5, y: 1.25, w: 6.6, h: 3.9 });
  d.stat(s, { x: 0.7, y: 5.3, w: 3.0, value: "0.2", label: "普通 PEO–LiTFSI 的 t+", color: "accent4" });
  d.stat(s, { x: 3.9, y: 5.3, w: 3.2, value: "≈ 1", label: "单离子导体的 t+", color: "accent2" });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2013 年 Bouchet 等做出 P(STFSILi)-b-PEO-b-P(STFSILi) 三嵌段共聚物，t+ > 0.85（Nat. Mater.）。2016 年 Porcarelli 等把甲基丙烯酸酯锂盐交联进 PEO 网络；2017 年 Villaluenga 等混入含锂的纳米颗粒。" },
    { kind: "why", body: "与其想办法让阴离子慢下来，不如用共价键把它直接接到主链上：阴离子不动，电流只能由 Li⁺ 承担。" },
    { kind: "matters", body: "代价：Li⁺ 与聚阴离子强烈成对，阴离子也不再贡献电导。没有液体增塑剂时，电导率很低。实用中必须同时兼顾高 t+ 与高 σ。" },
  ]);
  s.addNotes("原文最典型的例子是 PEO 导离子嵌段与 P(STFSILi) 嵌段组成的嵌段共聚物：被拴住的阴离子不能移动，迁移数接近 1。原文把低电导归因于 Li⁺ 与聚阴离子主链之间的强离子配对，以及阴离子对总电导的贡献消失。");

  // ---------------- 22. Electrochemical stability window ----------------
  s = d.slide("CONTENT");
  s.addText("电化学稳定窗口：HOMO / LUMO 只是粗略指导", { placeholder: "title" });
  d.fig(s, "esw", { x: 0.5, y: 1.25, w: 6.1, h: 4.4 });
  d.caption(s, "示意（仿 Goodenough & Kim 2010 的能级图）。μA、μC：负极、正极的电子化学势。", { x: 0.6, y: 5.7, w: 6.0, h: 0.45 });
  d.column(s, 6.95, 1.35, 5.8, [
    { kind: "hist", body: "1948 年 Randles 与 Ševčík 建立线性扫描伏安的理论；2010 年 Goodenough 与 Kim 用能级图说明电解质窗口；2018 年 Peljo 与 Girault 撰文指出“HOMO–LUMO 误区”。" },
    { kind: "why", body: "以前：在两块不锈钢阻塞电极之间扫循环伏安（CV）。结果偏乐观，因为真实电极里的导电碳和活性物质会催化分解。改进：用真实电池构型测漏电流（leakage current）。" },
    { kind: "matters", body: "降低 HOMO、抬高 LUMO 可以拓宽窗口，但只能当粗略指导。需要能把高分子结构与氧化、还原电位直接联系起来的新描述符。" },
  ], 0.18);
  d.quote(s, { x: 6.95, y: 5.85, w: 5.8, en: "the energy levels of these orbitals do not equate to the redox potentials of the material", zh: "这些轨道的能级并不等于材料的氧化还原电位。" });
  s.addNotes("能量越低的电子越“稳”，对应的电极电位越正（能量轴与电位轴方向相反）。负极的 μ_A 若高于电解质的 LUMO，电子就会跑进电解质把它还原；正极的 μ_C 若低于 HOMO，电解质的电子就会被正极夺走而被氧化。实际情况还要考虑溶剂化和界面膜，所以只能作粗略指导。");

  // ---------------- 23. Reading notes ----------------
  d.section("阅读校注");
  s = d.slide("CONTENT");
  s.addText("阅读校注：本节的四处问题", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.35, w: 5.95, kind: "note", tint: true, size: 13, head: "① 第 6 页：“Vogel, Tamman and Fulcher”", body: "应为 Tammann（Gustav Tammann，德国物理化学家）。原文自己的参考文献 95（Tammann & Hesse 1926）和 99 的标题都拼作 Tammann。" });
  d.block(s, { x: 6.8, y: 1.35, w: 5.95, kind: "note", tint: true, size: 13, head: "② 第 6 页：“first discovered … in 1973 (refs 89,90)”", body: "1973 年本身没错（Fenton, Parker & Wright, Polymer 14, 589）。但所引的 89 是 Wright 1975 年的论文，90 是 Armand 等 1979 年的会议文集，都不是 1973 年的发现。" });
  d.block(s, { x: 0.6, y: 3.85, w: 5.95, kind: "note", tint: true, size: 13, head: "③ 第 6 页：WLF 与 VTF 的先后", body: "原文说 WLF “可以写成更具体的 VTF 关系”，容易让人以为 VTF 由 WLF 而来。实际上 VTF（1921–1926）早于 WLF（1955）约 30 年；两式在数学上等价（T₀ = Tg − C₂）。" });
  d.block(s, { x: 6.8, y: 3.85, w: 5.95, kind: "note", tint: true, size: 13, head: "④ 第 8 页 vs Fig. 4d：“increased tenfold”", body: "正文说侧链从 1 个单元增至 3 个时 σ 提高 10 倍；Fig. 4d 侧链系列 σ 约从 3×10⁻⁷ 升到 3×10⁻⁵ S cm⁻¹（约 100 倍）。原图横轴未标注，建议对照参考文献 103 核实。" });
  s.addNotes("另有一处小细节：Fig. 4e 图注把醚类写作 poly(ethylene glycol) (PEG)，而图中标签是 PEO，两者是同一种结构（分子量不同的叫法）。P(STFSILi) 的测量温度问题已在 Fig. 4e 那一页注明。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["σ = μc：载流子要多，还要跑得快", "Li⁺ 被醚氧溶剂化，靠跳跃和链段运动移动；只在无定形区里走"],
    ["VTF / WLF：离子跟着链段走", "σ 由 T − T₀ 决定；T₀ ≈ Tg − 50 K 来自 WLF 的普适常数 C₂ ≈ 51.6 K"],
    ["t+ 要高：别让阴离子“抢戏”", "PEO 的 t+ 只有约 0.2；弱配位主链、抓阴离子、单离子导体可提高 t+，但 σ 常下降"],
    ["设计清单", "低 Tg、无定形、溶剂化适中、位点连通；同时兼顾力学与电化学稳定窗口"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“To design an effective SPE, it is important to design an amorphous polymer system with domains that have high segmental motion while also balancing the solvation of Li+ and the connectivity of solvation sites.”", options: { italic: true, fontSize: 14, color: "FFFFFF", breakLine: true } },
    { text: "要设计有效的 SPE，需要一个链段运动活跃的无定形高分子体系，同时平衡 Li⁺ 的溶剂化与溶剂化位点的连通性。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章从离子转向电子：导电高分子如何让电子在电极里畅通无阻。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
