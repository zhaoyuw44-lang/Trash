// Zhao et al. 2020 — Chapter 2: 离子传输机理与路径
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Zhao et al., Nat. Rev. Mater. 2020",
  full: "Zhao, Stalin, Zhao & Archer. Designing solid-state electrolytes for safe, energy-dense batteries. Nature Reviews Materials (2020). doi:10.1038/s41578-019-0165-5",
};

// "D_{i} = γa^{2}" -> text runs with real sub/superscripts.
function runs(str, base = {}) {
  const out = [];
  const re = /([_^])\{([^}]*)\}/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ text: str.slice(last, m.index), options: { ...base } });
    out.push({ text: m[2], options: { ...base, [m[1] === "_" ? "subscript" : "superscript"]: true } });
    last = re.lastIndex;
  }
  if (last < str.length) out.push({ text: str.slice(last), options: { ...base } });
  return out;
}
const br = (arr) => { if (arr.length) arr[arr.length - 1].options.breakLine = true; return arr; };

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch2_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 2, chapterTitle: "离子传输机理与路径", figDir });
  d.registerFigs(info);
  const C = d.C;

  // Equation card: lines = [{eq, size, color}], tag = "(1)"
  const eqCard = (s, { x, y, w, h, lines, tag, fill = "F5F7F9" }) => {
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
    const r = [];
    lines.forEach((l, i) => {
      const a = runs(l.eq, { fontSize: l.size || 24, bold: l.bold ?? true, color: l.color || C.accent1, fontFace: "Cambria Math" });
      if (i < lines.length - 1) br(a);
      r.push(...a);
    });
    s.addText(r, { x: x + 0.25, y, w: w - (tag ? 1.2 : 0.4), h, margin: 0, valign: "middle", isTextBox: true, paraSpaceAfter: 4 });
    if (tag) s.addText(tag, { x: x + w - 1.25, y, w: 1.1, h, fontSize: 15, color: "7A8794", align: "right", valign: "middle", margin: 0, isTextBox: true });
  };
  // Symbol legend: [[sym, desc], ...]
  const symbols = (s, { x, y, w, h, items, size = 13 }) => {
    const r = [];
    items.forEach(([sym, desc], i) => {
      r.push(...runs(sym, { bold: true, color: C.accent3, fontSize: size, fontFace: "Cambria Math" }));
      const t = runs("  " + desc, { color: C.text1, fontSize: size });
      if (i < items.length - 1) br(t);
      r.push(...t);
    });
    s.addText(r, { x, y, w, h, margin: 0, valign: "top", isTextBox: true, paraSpaceAfter: 3 });
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 2 章\n离子在固体里怎么走？", { placeholder: "title" });
  s.addText("离子传输机理（Nernst–Planck、Arrhenius、VTF）与传输路径（体相、晶界、界面）", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文 “Ion transport in SSEs” 一节（第 5–7 页，含方程 1–8 和 Fig. 3）。目标：会读这几个公式里的每个符号，知道为什么晶体用 Arrhenius、聚合物用 VTF，以及离子在体相、晶界和界面上分别走什么路。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "驱动力：Nernst–Planck 方程", "电场、浓度差、对流三种推力"],
    ["2", "电导率 = 浓度 × 迁移率", "Nernst–Einstein 关系：μ = D/RT"],
    ["3", "跳跃与 Arrhenius；玻璃与 VTF", "活化能 Eₐ 从哪里来，怎么从图上读"],
    ["4", "体相路径", "缺陷、bcc 骨架、协同迁移、各向异性、链段运动"],
    ["5", "界面路径", "晶界与空间电荷层"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.35 + i * 1.08;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.5, h: 0.92, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.8, y: y + 0.18, w: 0.56, h: 0.56, fill: { color: C.text1 }, color: C.background1, fontSize: 19, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.6, y: y + 0.08, w: 5.4, h: 0.42, fontSize: 19, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.6, y: y + 0.5, w: 5.4, h: 0.34, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 7.5, y: 1.35, w: 5.25, h: 2.55, rectRadius: 0.1, fill: { color: "F1ECF8" }, line: { color: "F1ECF8" } });
  s.addText([
    { text: "与上一章的衔接", options: { bold: true, fontSize: 18, color: C.accent3, breakLine: true } },
    { text: "第 1 章只说了结论：SIE 导得快、SPE 室温慢；硫化物比氧化物快；bcc、PEO……", options: { fontSize: 15, color: C.text1, breakLine: true } },
    { text: "这一章回答“为什么”：从离子受到的推力，到它在晶格和高分子链上怎么一步步跳过去。", options: { fontSize: 15, color: C.text1 } },
  ], { x: 7.75, y: 1.45, w: 4.8, h: 2.35, margin: 0, valign: "middle", isTextBox: true, paraSpaceAfter: 6 });
  eqCard(s, { x: 7.5, y: 4.15, w: 5.25, h: 1.0, lines: [{ eq: "σ = F^{2} Σ μ_{i}c_{i}", size: 26 }] });
  s.addText("本章最重要的一个式子：电导率 = 载流子浓度 × 迁移率（再乘以常数）", { x: 7.5, y: 5.25, w: 5.25, h: 0.7, fontSize: 14, color: C.text2, margin: 0, valign: "top", isTextBox: true });
  s.addNotes("本章公式较多，但每个公式都只回答一个问题：①离子为什么会动（Nernst–Planck）；②电导率由什么决定（方程 2）；③为什么升温会快、快多少（Arrhenius / VTF）。方程编号沿用原文。");

  // ---------------- 3. Section ----------------
  d.section("1 传输机理");
  s = d.slide("DARK_SECTION");
  s.addText("传输机理：三个公式讲清楚", { placeholder: "title" });
  s.addText("Nernst–Planck（离子为什么动）→ Nernst–Einstein（电导率由什么决定）→ Arrhenius / VTF（温度怎么影响）", { placeholder: "body" });

  // ---------------- 4. Nernst–Planck ----------------
  s = d.slide("CONTENT");
  s.addText("驱动力：Nernst–Planck 方程", { placeholder: "title" });
  eqCard(s, { x: 0.6, y: 1.25, w: 12.15, h: 0.8, tag: "方程 1", lines: [{ eq: "j = −F^{2}∇φ Σ_{i} μ_{i}c_{i}  −  F Σ_{i} D_{i}∇c_{i}  +  F u Σ_{i} c_{i}", size: 24 }] });
  symbols(s, { x: 0.6, y: 2.15, w: 6.0, h: 0.95, items: [["j", "电流密度；F：法拉第常数 96485 C mol⁻¹"], ["φ、∇φ", "电势、电势梯度（即电场）"], ["μ_{i}、c_{i}", "离子 i 的迁移率、解离出的浓度"]] });
  symbols(s, { x: 6.75, y: 2.15, w: 6.0, h: 0.95, items: [["D_{i}、∇c_{i}", "扩散系数、浓度梯度"], ["u", "离子所在介质的整体流速（对流）"], ["∇", "“梯度”：沿空间方向变化有多快"]] });
  d.fig(s, "np_terms", { x: 0.5, y: 3.15, w: 5.6, h: 3.68 });
  d.column(s, 6.4, 3.2, 6.35, [
    { kind: "hist", body: "1888–1890 年，Nernst 与 Planck 研究稀溶液中电解质的扩散与液接电势，写出了“电场 + 浓度差”共同推动离子的通量方程。" },
    { kind: "why", body: "为什么要三项一起写：液体里三种推力同时存在。到了固体里，对流项可以忽略，中等电压下浓度差也小，只剩第一项。" },
    { kind: "matters", body: "这一步简化把复杂的传质问题变成“欧姆定律”：电流 ∝ 电场，比例系数就是电导率 σ（方程 2）。" },
  ], 0.16);
  s.addNotes("原文对每个符号的说明：F 法拉第常数；μᵢ 带电物种 i 的迁移率（为简单起见假设为一价）；cᵢ 解离出的离子对浓度；Dᵢ 扩散系数；u 介质的对流速度。原文还提到热电压 kBT/e = RT/F（25 °C 时约 25.7 mV）：即使电压远高于它，固体里对流项仍可忽略。");

  // ---------------- 5. Conductivity & Nernst–Einstein ----------------
  s = d.slide("CONTENT");
  s.addText("电导率 = 有多少离子 × 每个跑多快", { placeholder: "title" });
  eqCard(s, { x: 0.6, y: 1.25, w: 6.3, h: 1.25, tag: "方程 2", lines: [{ eq: "σ = −j / ∇φ = F^{2} Σ_{i} μ_{i}c_{i}", size: 24 }, { eq: "μ_{i} = D_{i} / RT", size: 20, color: C.accent3 }] });
  symbols(s, { x: 0.6, y: 2.6, w: 6.3, h: 0.7, items: [["σ", "离子电导率；R：气体常数；T：绝对温度"], ["μ_{i} = D_{i}/RT", "Nernst–Einstein 关系：迁移率由扩散系数换算"]] });
  d.fig(s, "sigma_cmu", { x: 0.5, y: 3.35, w: 6.5, h: 3.35 });
  d.column(s, 7.25, 1.3, 5.5, [
    { kind: "hist", body: "1888 年 Nernst、1905 年 Einstein（研究布朗运动）先后得到：迁移率 ∝ 扩散系数 / 温度。它把“随机扩散”和“电场下的漂移”连了起来。" },
    { kind: "why", body: "D 能用核磁共振（NMR）、示踪原子直接测，σ 用阻抗谱测；两者一比，就能看出离子之间是否相互关联。" },
    { kind: "matters", body: "提高 σ 只有两个旋钮：拆开离子对（c↑），让离子跳得更容易（μ↑）。" },
  ], 0.18);
  d.quote(s, { x: 7.25, w: 5.5, en: "A good ionic conductor must, therefore, be able to simultaneously facilitate ion-pair dissociation and exhibit minimal resistance to ion motion.", zh: "因此，好的离子导体必须既能促进离子对解离，又对离子运动的阻力最小。" });
  s.addNotes("原文紧接着讲迁移数：阴、阳离子都贡献电流，但电极反应只用阳离子，原话 “any potential used to drive anion migration is wasted energy（用来推动阴离子迁移的电势都是浪费的能量）”。注意原文的 μ 是“摩尔迁移率”（单位含 mol），所以 σ = F²μc 里是 F²；常见的电迁移率 u = zFD/RT 与它差一个 zF。");

  // ---------------- 6. Defects (Fig. 3a) ----------------
  s = d.slide("CONTENT");
  s.addText("晶体里的“路”：点缺陷与界面", { placeholder: "title" });
  d.fig(s, "fig3a", { x: 0.5, y: 1.25, w: 7.0, h: 4.53 });
  d.caption(s, "据原文 Fig. 3a 重绘。虚线圈 = 空位。", { x: 0.6, y: 5.85, w: 6.9 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "两种本征点缺陷", body: "Schottky 缺陷：一对阳离子和阴离子空位。\nFrenkel 缺陷：离子离开格点跑到间隙，留下一个空位。" },
    { kind: "hist", body: "1926 年 Frenkel 提出“离子跳进间隙”的缺陷模型；1930 年 Schottky 与 Wagner 提出成对空位模型。" },
    { kind: "why", body: "完美晶体里每个位置都被占满，离子无处可跳。正是缺陷（空位、间隙）提供了“落脚点”。" },
    { kind: "matters", body: "所以 SIE 的设计常常是“造缺陷”：掺杂异价离子制造空位，或塞入过量 Li⁺。" },
  ], 0.16);
  s.addNotes("原文：“In ceramics, defects within the framework, such as interstices and vacancies, provide the largest contribution to fast ion movement.”（陶瓷中，骨架内的间隙和空位等缺陷对快速离子运动贡献最大。）图中还有晶界、杂质、空间电荷层和界面层，后半章会逐一讲。界面层：两种化学势不同的材料接触或发生反应时形成，可能加速也可能阻碍离子跨界面传输。");

  // ---------------- 7. Hopping mechanisms ----------------
  s = d.slide("CONTENT");
  s.addText("三种跳跃方式：空位、间隙、推填", { placeholder: "title" });
  d.fig(s, "hop_mechs", { x: 0.5, y: 1.2, w: 12.3, h: 3.65 });
  d.block(s, { x: 0.6, y: 5.05, w: 3.9, kind: "hist", tint: true, size: 13, body: "1930 年代，Jost、Wagner 等用这几种机制定量解释离子晶体中的扩散和导电。原文参考文献 17 就是 Jost 1933 年的论文。" });
  d.block(s, { x: 4.7, y: 5.05, w: 3.9, kind: "why", tint: true, size: 13, body: "空位机制需要“有空座”；间隙机制需要“缝够大”。推填（knock-off，又称 interstitialcy）则让间隙离子和格点离子接力，常比直接挤过去更省力。" });
  d.block(s, { x: 8.8, y: 5.05, w: 3.95, kind: "matters", tint: true, size: 13, body: "推填已经是“两个离子一起动”，是后面“协同迁移”的雏形。原文提到 LiZr₂(PO₄)₃ 中的 Li⁺ 就是被邻近离子“推”着走。" });
  s.addNotes("这一页的三种机制是固态离子学教科书的标准分类，原文正文没有逐一展开，但 Fig. 3a 的 Schottky、Frenkel 缺陷分别对应“空位”和“间隙”两类载流子。原文：LiZr₂(PO₄)₃ 中 Li⁺ 受邻近离子排斥而迁移，由类 Frenkel 缺陷促成（ref. 24）。");

  // ---------------- 8. Eq 3 ----------------
  s = d.slide("CONTENT");
  s.addText("一次跳跃：扩散系数从哪里来", { placeholder: "title" });
  eqCard(s, { x: 0.6, y: 1.25, w: 6.6, h: 0.85, tag: "方程 3", lines: [{ eq: "D_{i} = γ a^{2} f_{o} exp(−ΔG_{mig} / RT)", size: 24 }] });
  d.fig(s, "energy_landscape", { x: 0.5, y: 2.25, w: 6.7, h: 4.0 });
  symbols(s, { x: 0.6, y: 6.25, w: 6.6, h: 0.6, size: 13, items: [["γ", "几何因子（往哪些方向能跳、跳几维）；ΔG_{mig}：迁移自由能，即能垒"]] });
  d.column(s, 7.5, 1.3, 5.25, [
    { kind: "def", head: "读法", body: "每秒试跳 f₀ 次（约 10¹²–10¹³ 次，即晶格振动频率）；每次成功的概率是 exp(−ΔG/RT)；每次跳 a 远。三者相乘就是扩散有多快。" },
    { kind: "hist", body: "1935 年 Eyring 提出过渡态理论；1957 年 Vineyard 把它用到固体中的原子跳跃，给出“试跳频率 × Boltzmann 因子”的形式。" },
    { kind: "why", body: "为什么是指数：能量够跨过能垒的离子占比服从 Boltzmann 分布，所以能垒稍降一点，D 就成倍变大。" },
    { kind: "matters", body: "a 和 f₀ 只是前因子；真正决定快慢的是指数里的能垒。这就是为什么大家都在“降能垒”。" },
  ], 0.16);
  s.addNotes("原文符号说明：γ 是考虑几何效应的因子，a 是跳跃距离，f₀ 是离子跳跃的尝试频率（ref. 18）。试跳频率的量级 10¹²–10¹³ Hz 是公认值（对应晶格声子频率），原文没有给出。");

  // ---------------- 9. Eqs 4–6 ----------------
  s = d.slide("CONTENT");
  s.addText("从一次跳跃到 Arrhenius 公式", { placeholder: "title" });
  eqCard(s, { x: 0.6, y: 1.25, w: 6.7, h: 2.3, lines: [
    { eq: "σ_{i} = (F^{2}/RT) c_{i} γa^{2}f_{o} exp(ΔS_{mig}/R) exp(−ΔH_{mig}/RT)   (4)", size: 17, color: C.text1, bold: false },
    { eq: "c_{i} = c_{o} exp(−ΔH_{f}/RT)   (5)", size: 17, color: C.text1, bold: false },
    { eq: "⇒  σ_{i} = (σ_{o}/T) exp(−E_{a}/RT)   (6)", size: 24 },
    { eq: "E_{a} = ΔH_{f} + ΔH_{mig}", size: 20, color: C.accent3 },
  ] });
  symbols(s, { x: 0.6, y: 3.65, w: 6.7, h: 1.2, items: [
    ["ΔG = ΔH − TΔS", "把能垒拆成焓 ΔH_{mig} 与熵 ΔS_{mig}"],
    ["ΔH_{f}、c_{o}", "生成可动离子（拆离子对 / 造缺陷）所需的焓、活化前的离子对浓度"],
    ["σ_{o}", "前因子（随温度变化很弱）；E_{a}：总活化能"],
  ] });
  d.fig(s, "arrhenius_plot", { x: 7.55, y: 1.25, w: 5.2, h: 3.9 });
  d.block(s, { x: 7.6, y: 5.3, w: 5.15, tint: true, ...{ kind: "hist", size: 13, body: "1889 年 Arrhenius 在 van ’t Hoff（1884）工作的基础上，提出反应速率 ∝ exp(−Eₐ/RT)，并用“活化能”解释它。" } });
  d.column(s, 0.6, 4.95, 6.7, [
    { kind: "why", size: 13, body: "前面多出的 1/T 来自 μ = D/RT，所以作图时用 ln(σT) 对 1/T，才是一条直线。" },
    { kind: "matters", size: 13, body: "Eₐ 由两部分组成：“造出”可动离子的难度 + 让它“跳过去”的难度。降 Eₐ 要两头一起抓。" },
  ], 0.12);
  s.addNotes("方程 4 是把方程 3 代入方程 2；方程 5 说明载流子浓度本身也是热激活的；两者合并、把前因子都收进 σ₀，就得到方程 6。原文：晶体材料和其他无机离子导体一般服从 Arrhenius 方程。注意活化能常用 eV 报告（每个离子），1 eV 相当于 96.5 kJ mol⁻¹。");

  // ---------------- 10. Ea chart ----------------
  s = d.slide("CONTENT");
  s.addText("活化能 Eₐ：同是硫化物，差别有多大", { placeholder: "title" });
  const ea = [
    ["Li₆PS₅Br", 0.10, "11"],
    ["Li₇P₃Se₁₁ *", 0.188, "47.94"],
    ["Li₇P₃S₁₁ *", 0.191, "45.66"],
    ["Li₃.₈₃₃Sn₀.₈₃₃As₀.₁₆₆S₄", 0.21, "1.39"],
    ["Li₉.₅₄Si₁.₇₄P₁.₄₄S₁₁.₇Cl₀.₃", 0.24, "25"],
    ["Li₃PS₄", 0.356, "0.16"],
    ["Li₃SbS₄（玻璃）", 0.518, "0.0015"],
  ];
  s.addChart(d.pres.charts.BAR, [{ name: "活化能 (eV)", labels: ea.map(([n, , sg]) => `${n}  σ = ${sg}`), values: ea.map(([, v]) => v) }], {
    x: 0.5, y: 1.3, w: 7.3, h: 4.7, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: [HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent1, HEX.accent5, HEX.accent4],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00#",
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMinVal: 0, valAxisMaxVal: 0.62,
    showTitle: true, title: "25 °C 下 Li⁺ 硫化物的活化能（eV）与电导率 σ（mS cm⁻¹）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "数据：原文 Table 1“Sulfides (25 °C)”；* 为计算值。", { x: 0.6, y: 6.08, w: 7.2 });
  d.stat(s, { x: 8.1, y: 1.3, w: 4.6, value: "≈ 0.06", unit: "eV", label: "室温下 Eₐ 每升高约 0.06 eV，电导率约降为 1/10", color: "accent4" });
  d.column(s, 8.1, 2.85, 4.65, [
    { kind: "hist", size: 13, body: "表中两个 *（Li₇P₃S₁₁、Li₇P₃Se₁₁）来自 2017 年 Ceder 组（Wang 等）的第一性原理计算，不是实测值。" },
    { kind: "why", size: 13, body: "Eₐ 低大体对应 σ 高，但不是一一对应：Li₆PS₅Br 的 Eₐ 最低，σ 却不是最高。前因子 σ₀ 里的载流子浓度、跳跃距离也起作用。" },
    { kind: "matters", size: 13, body: "Eₐ 越低，电导率对温度越不敏感，低温性能越好。玻璃态 Li₃SbS₄ 的 Eₐ 高，室温就几乎不导。" },
  ], 0.14);
  s.addNotes("0.06 eV 的来历：kT·ln10，在 25 °C 时 kT ≈ 0.0257 eV，乘以 ln10 ≈ 2.303 得 0.059 eV。也就是说，在前因子不变时，Eₐ 从 0.2 升到 0.5 eV，室温电导率要掉约 5 个数量级。");

  // ---------------- 11. VTF ----------------
  s = d.slide("CONTENT");
  s.addText("玻璃与聚合物：Vogel–Fulcher–Tammann（VTF）方程", { placeholder: "title" });
  eqCard(s, { x: 0.6, y: 1.25, w: 6.4, h: 0.9, tag: "方程 8", lines: [{ eq: "σ_{i} = (σ_{o}/T) exp[−E_{a} / R(T − T_{o})]", size: 24 }] });
  // computed illustration
  const temps = [373, 353, 333, 313, 298, 283, 268, 253];
  const R = 8.314, Tref = 333;
  const arr = temps.map((T) => -3 + Math.log10(Tref / T) - (28900 / (R * Math.LN10)) * (1 / T - 1 / Tref));
  const T0 = 163, B = 8000 / R;
  const vtf = temps.map((T) => -3 + Math.log10(Tref / T) - (B / Math.LN10) * (1 / (T - T0) - 1 / (Tref - T0)));
  const lab = temps.map((T) => (1000 / T).toFixed(2));
  const r2 = (v) => Math.round(v * 100) / 100;
  s.addChart(d.pres.charts.LINE, [
    { name: "Arrhenius（Eₐ = 0.3 eV）", labels: lab, values: arr.map(r2) },
    { name: "VTF（T₀ = 163 K，Eₐ = 8 kJ mol⁻¹）", labels: lab, values: vtf.map(r2) },
  ], {
    x: 0.5, y: 2.25, w: 6.6, h: 4.0,
    chartColors: [HEX.accent3, HEX.accent2], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 6,
    showTitle: true, title: "log σ（示意，60 °C 处对齐）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valAxisMinVal: -5, valAxisMaxVal: -2, valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "1000 / T（K⁻¹）：越往右越冷", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.caption(s, "参数为讲解自选：T₀ 取 PEO 的 Tg（约 213 K）减 50 K。VTF 在 Arrhenius 图上是一条向下弯的曲线。", { x: 0.6, y: 6.3, w: 6.5, h: 0.5 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "def", head: "符号", size: 13, body: "T₀：“理想玻璃化温度”，约比玻璃化温度 Tg 低 50 K；在 T₀ 处链段完全冻结。Eₐ：赝活化能；其余同方程 6。" },
    { kind: "hist", size: 13, body: "Vogel（1921）、Fulcher（1925）、Tammann 与 Hesse（1926）先后用这个形式拟合玻璃和过冷液体的粘度随温度的变化。" },
    { kind: "why", size: 13, body: "Tg 以上，离子的运动与链段（或玻璃中的结构单元）的松弛耦合在一起，而松弛快慢由粘度决定，所以用粘度的公式，把 T 换成 T − T₀。" },
    { kind: "matters", size: 13, body: "聚合物电解质服从 VTF。想让它室温导得快，就要把 Tg 压低、让链段更“软”（第 5 章）。" },
  ], 0.14);
  s.addNotes("原文的方程编号从 6 直接跳到 8，没有方程 7（见本章校注）。原文还提到：固态离子学的一个突破是发现 AgI–Ag₂SeO₄ 体系中存在高导电的玻璃相；玻璃在“理想玻璃转变温度”附近以下，离子迁移又回到 Arrhenius 形式，与晶体类似。");

  // ---------------- 12. Section: pathways ----------------
  d.section("2 体相路径");
  s = d.slide("DARK_SECTION");
  s.addText("传输路径①：体相", { placeholder: "title" });
  s.addText("晶体：阴离子骨架的拓扑、协同迁移、各向异性 · 聚合物：链段运动与结晶区之争", { placeholder: "body" });

  // ---------------- 13. bcc ----------------
  s = d.slide("CONTENT");
  s.addText("为什么 bcc 阴离子骨架导得快", { placeholder: "title" });
  d.fig(s, "bcc_fcc", { x: 0.5, y: 1.2, w: 7.0, h: 4.3 });
  d.caption(s, "二维示意。T：四面体间隙；O：八面体间隙。", { x: 0.6, y: 5.55, w: 6.9 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "2015 年，Ceder 组的 Wang 等用第一性原理计算比较了不同阴离子堆积中 Li⁺ 的迁移能垒（原文 ref. 23）。" },
    { kind: "why", body: "以前的经验是“通道越大越好、空位越多越好”。这项工作指出更本质的是骨架拓扑：bcc 中相邻四面体位共面相连，Li⁺ 可直接从 T 跳到 T。" },
    { kind: "matters", body: "LGPS、反钙钛矿 Li₃OCl，以及典型的 Ag⁺、Na⁺、Mg²⁺ 快离子导体都有 bcc 阴离子排列。回想第 1 章的 α-AgI。" },
  ]);
  d.quote(s, { y: 6.05, en: "…body-centred cubic packing of the anions renders a lower energy landscape than that of a face-centred cubic or a hexagonal close-packed sublattice.", zh: "阴离子的体心立方堆积，比面心立方或六方密堆积亚晶格给出更低的能量地形。" });
  s.addNotes("在 fcc 和 hcp 骨架中，相邻四面体位之间隔着八面体位，Li⁺ 要走 T → O → T，中途经过能量更高的位置，所以能垒更高。原句开头为 “Investigation of the Li⁺ migration barrier for various anion-host matrices revealed that…”。");

  // ---------------- 14. Concerted ----------------
  s = d.slide("CONTENT");
  s.addText("协同迁移 Concerted migration：一起走更省力", { placeholder: "title" });
  d.fig(s, "concerted", { x: 0.5, y: 1.25, w: 7.0, h: 4.32 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "2013 年 Jalem 等在 LLZO 的分子动力学中看到 Li⁺ 协同运动；2017 年 He、Zhu 与 Mo 用从头算分子动力学证明 LGPS、LLZO、LATP 中普遍存在协同迁移。" },
    { kind: "why", body: "以前的图像：每个离子独立地跳过一个能垒。在超离子导体里，过量 Li⁺ 被迫占据高能位点，离子间相互排斥，几个离子一起挪一步，有效能垒更低。" },
    { kind: "matters", body: "设计启示：往骨架里多塞一些 Li⁺（Li 过量）、让它们占据高能位，可以“激活”协同迁移。" },
  ]);
  d.quote(s, { y: 5.75, en: "…exhibit concerted migration, with multiple ions hopping to the nearest sites, rather than isolated ions hopping over energy barriers, as in typical ceramics.", zh: "……表现出协同迁移：多个离子一起跳到最近的位点，而不是像典型陶瓷那样，单个离子孤立地跳过能垒。" });
  s.addNotes("原文：从头算分子动力学揭示，超离子导体（硫化物 LGPS、石榴石 LLZO、NASICON 型 Li₁.₃Al₀.₃Ti₁.₇(PO₄)₃）中的 Li⁺ 都表现出协同迁移。第 1 章也提到：过量 Li⁺ 通常占据高能位点，因而很容易迁移，触发协同传输机制（ref. 9）。");

  // ---------------- 15. Anisotropy ----------------
  s = d.slide("CONTENT");
  s.addText("各向异性：LGPS 到底是一维还是三维导体？", { placeholder: "title" });
  d.fig(s, "tl_lgps", { x: 0.5, y: 1.2, w: 12.3, h: 3.44 });
  d.block(s, { x: 0.6, y: 4.85, w: 5.9, kind: "why", tint: true, body: "最初根据晶体结构，认为 LGPS 主要沿 c 轴一维导电。后来的中子衍射和单晶测量发现：ab 面内也有路径，各方向活化能几乎相同，只是弱各向异性。" });
  d.block(s, { x: 6.8, y: 4.85, w: 5.95, kind: "matters", tint: true, body: "一维导体容易被一个缺陷“堵死”，三维导体则有绕行的路。石榴石 LLZO 也一样：立方相（三维通道）比四方相导电高得多，还能让 Li⁺ 在负极表面分布更均匀。" });
  s.addNotes("这一页本身就是一段“认识如何演变”的历史：结构推断 → 高温实验 → 中子衍射 → 单晶测量。原文：LGPS 的晶格动力学在室温和中等温度下服从经典 Boltzmann 统计，高温下从一维主导转为三维主导，使分析变复杂；而单晶研究显示各晶向活化能几乎相等。立方 LLZO 的室温电导率一般比四方相高约两个数量级（公认量级）。");

  // ---------------- 16. SPE amorphous ----------------
  s = d.slide("CONTENT");
  s.addText("聚合物：Li⁺ 搭着链段“顺风车”", { placeholder: "title" });
  d.fig(s, "spe_amorph", { x: 0.5, y: 1.25, w: 7.0, h: 4.12 });
  s.addText([
    { text: "① 沿同一条链移动（亚扩散）  ", options: { color: C.accent3, bold: true } },
    { text: "② 链间跳跃  ", options: { color: C.accent1, bold: true } },
    { text: "③ 与整条链一起运动", options: { color: C.accent2, bold: true } },
  ], { x: 0.6, y: 5.45, w: 6.9, h: 0.35, fontSize: 14, margin: 0, isTextBox: true });
  d.caption(s, "据原文 Fig. 3b 与正文重绘。", { x: 0.6, y: 5.85, w: 6.9 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "1983 年 Berthier、Armand 等用 NMR 证明 PEO 电解质主要在非晶区导电。1980–90 年代 Ratner 与 Nitzan 提出“动态键渗流”模型；2006 年 Borodin 与 Smith 用分子动力学给出三种运动的图像。" },
    { kind: "why", body: "分子量决定主导方式：长链互相缠结，链间跳跃为主；短链和低聚物则像液体电解液那样，Li⁺ 带着溶剂化的链段一起扩散。" },
    { kind: "matters", body: "离子跑得多快取决于链段动得多快，所以要非晶、要 Tg 低、要有足够自由体积。" },
  ], 0.18);
  s.addNotes("原文：SPE 通过聚合物链的链段弛豫导离子；PEO 等聚醚靠主链上的氧原子与 Li⁺ 配位来导 Li⁺；离子电导通常归因于非晶相以及 Tg 以上存在的自由体积（ref. 29）。高分子量时缠结影响离子溶剂化和链扩散，链间跳跃为主导；低分子量和低聚物中，离子主要以溶剂化形式扩散，类似碳酸酯液体电解质（ref. 31）。");

  // ---------------- 17. SPE crystalline ----------------
  s = d.slide("CONTENT");
  s.addText("结晶区也能导电吗？一场十几年的争论", { placeholder: "title" });
  d.fig(s, "spe_cryst", { x: 0.5, y: 1.25, w: 6.6, h: 3.4 });
  d.caption(s, "据原文 Fig. 3c 重绘。", { x: 0.6, y: 4.7, w: 6.5 });
  d.block(s, { x: 0.6, y: 5.05, w: 6.5, kind: "why", tint: true, body: "以前的共识：结晶区是“死区”。2001 年的新结果让人怀疑这一点；但后续实验和理论又不支持“结晶区更快”。" });
  d.column(s, 7.4, 1.3, 5.35, [
    { kind: "hist", body: "2001 年 Gadjourova、Andreev、Tunstall 与 Bruce 在 Nature 上报道：结晶的 PEO₆:LiAsF₆ 能导电，甚至比非晶相更好；2005 年同组解析了 β-PEO₆:LiAsF₆ 的隧道结构。2003、2017 年的研究给出相反证据。" },
    { kind: "matters", body: "争论的结果反而让设计方向更清楚：降低结晶度是提高聚合物电解质电导率的关键（第 5 章的共聚、交联、增塑）。" },
  ]);
  d.quote(s, { y: 5.6, x: 7.4, w: 5.35, en: "…there is now a consensus that reducing crystallinity is key to increasing ionic conductivity in polymer electrolytes.", zh: "……如今的共识是：降低结晶度，是提高聚合物电解质离子电导率的关键。" });
  s.addNotes("结晶区的图像：聚合物链折叠成圆柱形隧道，Li⁺ 在隧道内跳跃，阴离子位于隧道外，与阳离子隔着链间空间（ref. 33）。相反证据见 ref. 34（Henderson 与 Passerini 2003）和 ref. 35（Xue 等 2017）。");

  // ---------------- 18. Section: interfaces ----------------
  d.section("3 界面路径");
  s = d.slide("DARK_SECTION");
  s.addText("传输路径②：跨越界面", { placeholder: "title" });
  s.addText("同质界面（晶界）与异质界面（电极 | 电解质）：纳米材料越多，界面越多", { placeholder: "body" });

  // ---------------- 19. Grain boundaries ----------------
  s = d.slide("CONTENT");
  s.addText("晶界 Grain boundary：多晶片里的“收费站”", { placeholder: "title" });
  d.fig(s, "grain_boundary", { x: 0.5, y: 1.25, w: 7.0, h: 4.15 });
  d.stat(s, { x: 0.6, y: 5.48, w: 6.9, value: "40–50%", label: "LLZO 压片中，晶界电阻占总电阻的比例（原文 ref. 40）", color: "accent1" });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "1969 年 Bauerle 用交流阻抗谱测氧化锆陶瓷，第一次把晶粒电阻和晶界电阻分开。此后阻抗谱成为 SSE 的标准表征手段。" },
    { kind: "why", body: "晶界是“扩展缺陷”，原子排列混乱。大规模分子动力学显示：反钙钛矿中离子穿过晶界的活化能高于晶粒内部。" },
    { kind: "matters", body: "烧结条件就能改晶界：在空气中烧结的 LLZO，晶界电阻比氩气中烧结的小，总电导率更高。" },
  ]);
  s.addNotes("原文还提到：阻抗结果表明钙钛矿 Li₃ₓLa₂/₃₋ₓTiO₃ 和 LISICON Li₂₊₂ₓZn₁₋ₓGeO₄ 的晶界都会影响总电导率；LLZO 的晶界电导率与工作温度有关；虽然 LLZO 中沿晶界与穿过晶粒的电荷转移活化能处于同一数量级，但晶界仍是不可忽视的瓶颈。");

  // ---------------- 20. Space-charge ----------------
  s = d.slide("CONTENT");
  s.addText("空间电荷层 Space-charge layer：异质界面上的 Li⁺ 重新分布", { placeholder: "title" });
  d.fig(s, "space_charge", { x: 0.5, y: 1.25, w: 7.0, h: 4.32 });
  d.caption(s, "据原文正文（ref. 48）绘制的示意。", { x: 0.6, y: 5.65, w: 6.9 });
  d.column(s, 7.75, 1.3, 5.0, [
    { kind: "hist", body: "1973 年 Liang 发现在 LiI 中掺 Al₂O₃ 颗粒反而导电更好；1980 年代 Maier 用空间电荷理论解释了这类界面效应。2007 年前后 Takada 组（Ohta 等）在正极表面包覆 LiNbO₃，大幅降低了界面电阻。" },
    { kind: "why", body: "两种化学势不同的材料一接触，Li⁺ 就会越过界面重新分布：一侧堆积、一侧贫化。贫化层就像一层高电阻膜。" },
    { kind: "matters", body: "正极多孔、界面不连续，问题比平整的负极复杂。界面电阻是全固态电池的头号难题之一（第 4、5 章）。" },
  ], 0.18);
  s.addNotes("原文：空间电荷层可以用第一性原理计算研究（ref. 45），也能用相移电子全息结合电子能量损失谱直接“看到”（2019，ref. 46）。在 LAGP（x = 0.5）等玻璃陶瓷中，空间电荷层可以加速离子传导，但沿电极–电解质界面也可能阻碍传导。LiCoO₂ 与 β-Li₃PS₄ 的界面结构无序、带有 Li 吸附位点；引入 LiNbO₃ 缓冲层能抑制空间电荷层并提供额外迁移路径（ref. 48）。");

  // ---------------- 21. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：方程部分的几处细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.9, kind: "note", tint: true, size: 13, head: "① 第 5 页：方程编号缺 7", body: "原文方程编号为 1、2、3、4、5、6、8，没有方程 7。VTF 方程应为方程 7（或中间漏排了一个式子）。本讲义沿用原文编号“方程 8”。" });
  d.block(s, { x: 6.85, y: 1.4, w: 5.9, kind: "note", tint: true, size: 13, head: "② 方程 1：对流项", body: "原文第三项写作 F u Σᵢ cᵢ。按通量定义应为 F u Σᵢ zᵢcᵢ（zᵢ 为电荷数，含正负号）；由电中性 Σ zᵢcᵢ = 0，这一项在本体中本来就为零。原文“假设一价”时省略了正负号。" });
  d.block(s, { x: 0.6, y: 3.15, w: 5.9, kind: "note", tint: true, size: 13, head: "③ 方程 6：Eₐ = ΔHf + ΔHmig", body: "若载流子来自本征 Schottky 或 Frenkel 缺陷对，教科书给出 c ∝ exp(−ΔHf / 2RT)，于是 Eₐ = ΔHf/2 + ΔHmig。原文的写法要求把 ΔHf 理解为“每个可动离子”的生成焓。" });
  d.block(s, { x: 6.85, y: 3.15, w: 5.9, kind: "note", tint: true, size: 13, head: "④ 参考文献 39 页码", body: "原文：J. Electrochem. Soc. 130, 662–6691 (1983)。应为 662–669。" });
  d.block(s, { x: 0.6, y: 4.95, w: 12.15, kind: "def", tint: true, size: 13, head: "补充：两种“迁移率”", body: "原文 μᵢ = Dᵢ/RT 是“摩尔迁移率”，所以电导率是 F²Σμᵢcᵢ。半导体和很多教材用电迁移率 u = zFD/RT（单位 cm² V⁻¹ s⁻¹），此时 σ = FΣ|zᵢ|uᵢcᵢ。两种写法等价，只是单位不同。" });
  s.addNotes("这些都不影响原文结论，但第一次推导时容易被绊住。第 ③ 条：例如 Schottky 缺陷对的生成焓为 ΔHₛ，则每种空位的浓度 ∝ exp(−ΔHₛ/2kT)。");

  // ---------------- 22. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["σ = F² Σ μᵢcᵢ：电导率 = 载流子浓度 × 迁移率", "固体中对流可忽略，Nernst–Planck 退化为欧姆定律；μ = D/RT 连接扩散与导电"],
    ["晶体：跳跃 + Arrhenius，σT ∝ exp(−Eₐ/RT)", "Eₐ = 生成可动离子 + 迁移；室温下 Eₐ 每升 0.06 eV，σ 约降为 1/10"],
    ["玻璃与聚合物：VTF，离子运动与链段松弛耦合", "T₀ ≈ Tg − 50 K；压低 Tg、降低结晶度是 SPE 的主线"],
    ["体相快的秘诀与界面的瓶颈", "bcc 阴离子骨架、Li 过量引发协同迁移、三维通道；晶界占 LLZO 电阻 40–50%，空间电荷层靠缓冲层缓解"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.5, fontSize: 15, color: "CADCE8", margin: 0, valign: "top", isTextBox: true });
  });
  s.addText([
    { text: "“Equation 2 shows that a high ionic conductivity requires both a high ion mobility and a high concentration of mobile ions (that is, dissociated ion pairs).”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "方程 2 表明，高离子电导率既需要高的离子迁移率，也需要高浓度的可动离子（即解离的离子对）。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.9, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章把这些原理用到具体材料上：同样的骨架里装 Li⁺、Na⁺ 还是 Mg²⁺、Zn²⁺、Al³⁺，结果为什么差那么多（原文 Table 1）。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
