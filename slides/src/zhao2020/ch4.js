// Zhao et al. 2020 — Chapter 4: 失效模式
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

// Warn when SVG text would land below 11 pt on the slide (sub/superscripts excluded).
function guardFigs(d) {
  const orig = d.fig.bind(d);
  d.fig = (s, name, box, o) => {
    const r = orig(s, name, box, o);
    const info = d.figInfo[name];
    const items = [...fs.readFileSync(info.svg, "utf8").matchAll(/<text [^>]*font-size="(\d+(?:\.\d+)?)"[^>]*>(.*?)<\/text>/g)]
      .map((m) => ({ size: +m[1], t: m[2].replace(/<[^>]+>/g, "").replace(/\u200b/g, "") }))
      .filter((it) => !/^(\+|e−|\d)$/.test(it.t)); // ion / electron icons and numbered dots
    const small = items.filter((it) => (it.size * r.w * 72) / info.w < 10.95);
    if (small.length) console.warn(`  ! ${name}: ${small.length} text(s) < 11 pt, e.g. "${small[0].t}" ${((small[0].size * r.w * 72) / info.w).toFixed(1)} pt`);
    return r;
  };
}

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch4_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 4, chapterTitle: "失效模式", figDir });
  d.registerFigs(info);
  guardFigs(d);
  const C = d.C;
  const card = (s, x, y, w, h, fill) => s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const dot = (s, x, y, n, color, dd = 0.34) =>
    s.addText(String(n), { shape: d.pres.shapes.OVAL, x, y, w: dd, h: dd, fill: { color }, color: "FFFFFF", fontSize: 13, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 4 章\n固态电解质为什么会失效？", { placeholder: "title" });
  s.addText("界面不稳定 · 化学-力学失效 · 金属枝晶 · 诊断技术", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文“Failure modes of SSEs”一节（第 10–12 页，含 Fig. 4 和 Box 1）。右侧图标：上方是正极颗粒，中间是有晶界的陶瓷电解质，浅紫色的锂枝晶沿晶界向上爬，红线是裂纹。本章的目标是弄清楚：固态电解质在电池里究竟有哪些坏法，以及怎么把它们“看”出来。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "失效全景图", "原文 Fig. 4：无机 SSE 与聚合物 SPE 各怎么坏"],
    ["2", "稳定窗口与界面相", "能承受多高、多低的电压？界面上长出什么？"],
    ["3", "力学与环境", "体积变化、接触失效、空气稳定性、PEO 氧化"],
    ["4", "枝晶", "“比锂硬两倍”的判据为什么在陶瓷里失灵"],
    ["5", "怎么诊断", "原文 Box 1：阻抗谱、XPS、ToF-SIMS、中子、冷冻电镜"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.4 + i * 1.07;
    card(s, 0.6, y, 6.5, 0.92, "F5F7F9");
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.18, w: 0.56, h: 0.56, fill: { color: C.text1 }, color: C.background1, fontSize: 19, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.6, y: y + 0.08, w: 5.4, h: 0.4, fontSize: 19, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.6, y: y + 0.48, w: 5.4, h: 0.36, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("与上一章的衔接", { x: 7.6, y: 1.4, w: 5.1, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  d.column(s, 7.6, 2.0, 5.15, [
    { kind: "def", head: "第 3 章讲了什么", tint: true, body: "比较了 Li⁺、Na⁺ 和多价离子 SSE 的结构与电导率：不少材料室温电导率已达到约 1 mS cm⁻¹，与液体电解质相当。" },
    { kind: "matters", head: "本章要回答", tint: true, body: "电导率够了，电池为什么还会衰减、短路？答案大多藏在界面上：反应、接触、枝晶。" },
    { kind: "why", head: "下一章", tint: true, body: "第 5 章按本章的“失效清单”逐条给出设计对策。" },
  ]);
  s.addNotes("本章分五步：先看原文 Fig. 4 的全景图，再分别讲电化学/界面不稳定、力学与环境问题、枝晶，最后介绍诊断技术。第 3 章关心“离子跑得快不快”，本章关心“跑得快的材料为什么还是会坏”。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：人们怎样一步步认识 SSE 的失效", { placeholder: "title" });
  d.fig(s, "fail_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 3.6 });
  d.block(s, { x: 0.6, y: 5.0, w: 5.9, kind: "why", tint: true, body: "以前以为：固体电解质够“硬”、不燃，就能一劳永逸地挡住枝晶。2015 年以后的实验表明：界面反应、晶界和电子电导同样会让电池失效。" });
  d.block(s, { x: 6.8, y: 5.0, w: 5.9, kind: "matters", tint: true, body: "本章的失效清单就是第 5 章设计策略的“需求单”：每一种失效，都对应一类对策。" });
  s.addNotes("时间轴不按比例。灰色：早期认识；紫色：力学判据；青色：界面热力学（窗口与界面相）；红色：陶瓷电解质中的枝晶。De Jonghe 1981、Monroe & Newman 2005、Wenzel 2015、Sharafi 2016、Porz 2017、Han 2019 都是原文引用的文献；Goodenough & Kim 2010 与 Zhu, He & Mo 2015 为补充。");

  // ---------------- 4. Fig. 4a ----------------
  d.section("1 失效全景");
  s = d.slide("CONTENT");
  s.addText("失效全景①：无机固态电解质（SIE）", { placeholder: "title" });
  d.fig(s, "fig4a", { x: 0.45, y: 1.2, w: 6.9, h: 4.7 });
  const leg = [
    [1, HEX.accent1, "高电压下分解，生成正极界面相 CEI"],
    [2, HEX.accent4, "体积变化 → 正极颗粒与 SSE 脱开"],
    [3, HEX.dk1, "陶瓷脆，SSE 本身开裂"],
    [4, HEX.accent4, "枝晶沿晶界和表面缺陷（flaw）生长"],
    [5, HEX.accent3, "体内得电子（电子电导 / 阴离子骨架）→ 析锂"],
    [6, "A0522D", "负极界面相 SEI（Li₂O、Li₂CO₃、Li₂S）"],
  ];
  leg.forEach(([n, c, t], i) => {
    const y = 1.3 + i * 0.36;
    dot(s, 7.6, y, n, c, 0.3);
    s.addText(t, { x: 8.02, y: y - 0.03, w: 4.75, h: 0.36, fontSize: 14, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
  });
  d.column(s, 7.6, 3.62, 5.15, [
    { kind: "hist", body: "1981 年 De Jonghe 等发现 Na 会沿 β-Al₂O₃ 的晶界渗透：陶瓷也会被金属“刺穿”。" },
    { kind: "why", body: "以前把 SSE 当成惰性“隔板”。现在知道：它两侧都会反应，体内还会析出金属。" },
    { kind: "matters", body: "这些失效几乎都发生在界面和晶界上：只提高体相电导率并不够。" },
  ], 0.16);
  s.addNotes("对照原文 Fig. 4a 的图注：红色是沿缺陷和晶界生长的枝晶；紫色是电解质自身的电子电导让 Li⁺ 在体内被还原；橙色是 Li⁺ 从阴离子骨架拿到电子。正极侧形成 CEI；晶界减小了与活性物质的接触面积，陶瓷又不耐体积变化，导致容量衰减。负极侧的 SEI 影响离子迁移。");

  // ---------------- 5. Fig. 4b ----------------
  s = d.slide("CONTENT");
  s.addText("失效全景②：固态聚合物电解质（SPE）", { placeholder: "title" });
  d.fig(s, "fig4b", { x: 0.45, y: 1.2, w: 6.7, h: 4.3 });
  d.column(s, 7.45, 1.3, 5.3, [
    { kind: "hist", body: "1973 年 Wright 等发现 PEO 能溶解碱金属盐并导离子；1978 年前后 Armand 提出把它用作电池电解质。PEO 从此成为 SPE 的“标准答案”。" },
    { kind: "why", body: "SPE 的毛病和无机 SSE 正好相反：对 Li 负极较稳定、柔软贴合；但剪切模量低、挡不住枝晶，醚氧在高电压下容易被氧化。" },
    { kind: "matters", body: "两类材料能互补，所以原文看好多层 / 复合电解质：负极一侧、正极一侧各用最合适的材料。" },
  ]);
  d.block(s, { x: 0.6, y: 5.7, w: 6.55, kind: "def", head: "缩写 SIE / SPE", tint: true, size: 14, body: "SIE：solid inorganic electrolyte 无机固态电解质；SPE：solid polymer electrolyte 固态聚合物电解质。" });
  s.addNotes("原文 Fig. 4b 图注：SPE 剪切模量低，枝晶能穿过体相；在高电压正极界面，醚氧基团本征的电化学不稳定导致界面不稳定和正极粉化，最终容量衰减。多层电解质的代价是多出来的界面会让离子迁移更复杂，甚至被阻断。");

  // ---------------- 6. Section ----------------
  d.section("2 电化学与界面不稳定");
  s = d.slide("DARK_SECTION");
  s.addText("电化学与界面不稳定", { placeholder: "title" });
  s.addText("SSE 能承受多高、多低的电压？它和电极之间会长出什么？", { placeholder: "body" });

  // ---------------- 7. Stability window ----------------
  s = d.slide("CONTENT");
  s.addText("电化学稳定窗口 Electrochemical stability window", { placeholder: "title" });
  d.fig(s, "window_energy", { x: 0.45, y: 1.2, w: 6.45, h: 4.6 });
  d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: "2010 年 Goodenough 与 Kim 用能级图系统说明：负极和正极的电化学势（μA、μC）应落在电解质窗口之内，否则就要靠钝化层来“保护”。" },
    { kind: "why", body: "以前常用循环伏安（CV）在惰性电极上扫一遍，就报“窗口 0–5 V”。但真实电极会和 SSE 反应，计算出的窗口往往窄得多（下一页）。" },
    { kind: "matters", body: "窗口决定能配多高电压的正极、能否直接用 Li 金属，也就决定了能量密度的上限。" },
  ]);
  d.quote(s, { en: "It is crucial to operate batteries within the electrochemical-stability window of the electrolyte to achieve high cycling efficiency and a high overall energy density.", zh: "要获得高循环效率和高总能量密度，电池必须在电解质的电化学稳定窗口内工作。" });
  s.addNotes("看图：纵轴是电子能量。负极的 μA 如果高于电解质的还原极限，电子会从负极“掉进”电解质，把它还原；正极的 μC 如果低于氧化极限，电解质的电子会掉进正极，自己被氧化。原文用的“cathodic limit / anodic limit”就是这两条线。");

  // ---------------- 8. Calculated windows (native chart) ----------------
  s = d.slide("CONTENT");
  s.addText("算出来的窗口，为什么比测出来的窄？", { placeholder: "title" });
  const win = [
    ["LATP  2.17–4.21", 2.17, 4.21], ["LLTO  1.75–3.71", 1.75, 3.71], ["LLZO  0.05–2.91", 0.05, 2.91],
    ["LiPON  0.68–2.63", 0.68, 2.63], ["Li₃PS₄  1.71–2.31", 1.71, 2.31], ["LGPS  1.71–2.14", 1.71, 2.14],
  ];
  s.addChart(d.pres.charts.BAR, [
    { name: "下限", labels: win.map((r) => r[0]), values: win.map((r) => r[1]) },
    { name: "稳定区间", labels: win.map((r) => r[0]), values: win.map((r) => Math.round((r[2] - r[1]) * 100) / 100) },
  ], {
    x: 0.5, y: 1.25, w: 6.6, h: 4.5, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 60,
    chartColors: ["FFFFFF", HEX.accent2],
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt", valAxisMinVal: 0, valAxisMaxVal: 5, valAxisMajorUnit: 1,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "第一性原理计算的热力学稳定窗口（V vs Li/Li⁺）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "数据：Zhu, He & Mo, ACS Appl. Mater. Interfaces 2015（补充资料，非原文数据）。对照：实验 CV 常报“0–5 V”。", { x: 0.6, y: 5.8, w: 6.5, h: 0.5 });
  d.column(s, 7.4, 1.3, 5.35, [
    { kind: "hist", body: "2015 年 Zhu、He、Mo 算出常见 SSE 的热力学窗口；2016 年 Han 等（原文文献 78）用实验对比 LGPS 和 LLZO，证实计算值更窄。" },
    { kind: "why", body: "原文的解释：第一性原理计算没有算进电极的化学惰性和钝化层。分解产物如果是绝缘的，就会把副反应“堵住”，所以实验看起来更宽。" },
    { kind: "matters", body: "硫化物的真实窗口很窄（约 1.7–2.3 V）。它们能在电池里工作，靠的是分解后形成的钝化层，而不是“本来就稳定”。" },
  ]);
  s.addNotes("图中青色条表示计算得到的稳定区间，左边空白是下限。LLZO 的下限几乎到 0 V，所以它对 Li 金属相对稳定；硫化物上下限都很窄。注意这些数值是补充的文献值，用来说明原文“计算窗口远窄于实验窗口”这句话。");

  // ---------------- 9. Three interface types ----------------
  s = d.slide("CONTENT");
  s.addText("界面上会长出什么？三类固-固界面", { placeholder: "title" });
  d.fig(s, "interphase_types", { x: 0.6, y: 1.15, w: 12.1, h: 4.0 });
  d.column(s, 0.6, 5.3, 3.85, [{ kind: "hist", body: "1930 年代 Wagner：既导离子又导电子的膜会一直增厚。2015 年 Wenzel、Janek 等把界面分成三类。" }]);
  d.column(s, 4.75, 5.3, 3.85, [{ kind: "why", body: "以前只问“反不反应”。现在更要问：产物导不导电子？导电子就会一直长下去。" }]);
  d.column(s, 8.9, 5.3, 3.85, [{ kind: "matters", body: "同是硫化物：LGPS 生成导电的 Li–Ge 合金（MCI），Li₃PS₄ 则形成 SEI 型界面。" }]);
  s.addNotes("这一分类出自原文引用的 Wenzel、Janek 等 2015 年的工作（原文文献 79），原文正文没有展开，这里补上，方便理解后面几页。MCI 的生长类似金属在高温下的氧化：Wagner 理论说，只要膜里离子和电子都能动，反应就不会自己停下。");

  // ---------------- 10. Anode side ----------------
  s = d.slide("CONTENT");
  s.addText("负极侧：SSE 遇到 Li 金属会怎样", { placeholder: "title" });
  d.fig(s, "anode_cases", { x: 0.45, y: 1.2, w: 6.6, h: 4.4 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2015–16 年 Janek 组用原位 XPS 边沉积 Li 边测界面：LLTO 中的 Ti⁴⁺ 被还原成低价 Ti 甚至金属 Ti；LGPS 生成 Li₃P、Li₂S 和 Li–Ge 合金。" },
    { kind: "why", body: "以前看循环后的“残骸”（事后分析）。原位 XPS、原位 TEM 能看到反应正在发生，分清是哪种产物在导电子。" },
    { kind: "matters", body: "含易还原阳离子（Ti⁴⁺、Ge⁴⁺）的 SSE 不宜直接接触 Li；LiPON 这类动力学惰性的材料可以当“缓冲层”。" },
  ]);
  d.quote(s, { en: "These reactions result in the formation of an interfacial layer, which continues to grow until ions or electrons are obstructed.", zh: "这些反应生成界面层，它会一直生长，直到离子或电子的通路被阻断。" });
  s.addNotes("原文举了四个例子：LLTO 被 Li 还原；LGPS 生成 Li3P、Li2S、Li–Ge 合金；LAGP 与 Li 反应后变成无定形、体积膨胀，最终把 SSE 挤裂；LiPON 由于 P–N–P 骨架，计算表明对 Li 动力学惰性。金句里的“直到离子或电子被阻断”正对应上一页的 SEI 与 MCI 之分。");

  // ---------------- 11. Cathode side ----------------
  s = d.slide("CONTENT");
  s.addText("正极侧：正极界面相 CEI 与空间电荷层", { placeholder: "title" });
  d.fig(s, "cathode_cei", { x: 0.45, y: 1.2, w: 6.6, h: 4.4 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2006 年 Ohta、Takada 等在氧化物正极与硫化物 SSE 之间加了一层 Li₄Ti₅O₁₂ 薄膜，倍率性能大幅提高，并用“空间电荷层”解释界面电阻。" },
    { kind: "why", body: "以前以为高电阻只是“接触不好”。现在知道还有化学原因：硫化物被氧化、元素互扩散；导电碳提供电子，反而加速了硫代磷酸盐分解。" },
    { kind: "matters", body: "这解释了为什么高压正极几乎都要“穿外衣”（LiNbO₃ 等包覆，第 5 章），也提醒我们正极里的碳要少而精。" },
  ]);
  d.block(s, { x: 0.6, y: 5.75, w: 6.45, kind: "def", head: "空间电荷层 Space-charge layer", tint: true, size: 14, body: "两种材料对 Li⁺ 的“吸引力”不同，Li⁺ 会从 SSE 一侧挪到正极一侧，界面附近的 SSE 缺 Li⁺，电阻变大。" });
  s.addNotes("原文还提到：LGPS 这类无机物在一定电压范围内本身就能充当活性物质，贡献部分可逆容量（Han 等 2015，“用一种材料做成的电池”）。这说明 SSE 在电池里并不“惰性”。");

  // ---------------- 12. Chemo-mechanics ----------------
  s = d.slide("CONTENT");
  s.addText("化学-力学失效：固体不会“流动”去补缝", { placeholder: "title" });
  d.fig(s, "chemomech", { x: 0.45, y: 1.2, w: 6.6, h: 4.2 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2017 年 Koerver、Janek 等用阻抗谱和 XPS 追踪富镍正极 | 硫代磷酸盐电池：衰减来自正极侧高阻界面相，加上颗粒脱锂收缩造成的接触损失。" },
    { kind: "why", body: "液体电解质会自己流进缝隙；固体不会。电极和电解质的热膨胀系数不同、还各向异性，界面在循环中承受很大应力。" },
    { kind: "matters", body: "界面要能“撑开”也能“收回”：这是聚合物缓冲层、可变形电极等策略的出发点（第 5 章）。" },
  ]);
  d.quote(s, { en: "it is necessary to design interfaces that can expand sufficiently and be flexible enough to maintain contact during shrinkage.", zh: "必须设计出能充分膨胀、又足够柔韧、在收缩时仍能保持接触的界面。" });
  s.addNotes("Koerver 等的工作出现在原文 Box 1：容量衰减归因于正极侧不可逆生成的高阻界面相，以及正极颗粒在脱锂时收缩，两者都让正极与 SSE 接触变差。图中的收缩幅度是夸大的，真实的富镍正极体积变化只有几个百分点，但对刚性的陶瓷已经足够致命。");

  // ---------------- 13. Air stability ----------------
  s = d.slide("CONTENT");
  s.addText("空气稳定性：硫化物怕水，氧化物怕 CO₂", { placeholder: "title" });
  d.fig(s, "air_stability", { x: 0.45, y: 1.2, w: 6.6, h: 4.3 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "1963 年 Pearson 提出软硬酸碱（HSAB）原理：“硬”的 P⁵⁺ 偏爱“硬”的 O²⁻。2014 年 Sahu 等用更“软”的 As 掺入 Li₄SnS₄，得到空气稳定的硫化物电解质。" },
    { kind: "why", body: "以前硫化物只能在手套箱、干燥房里操作。现在的思路：换用更“软”的阳离子，或掺入氧化物，部分抑制 H₂S 的释放。" },
    { kind: "matters", body: "大规模生产绕不开空气和水分；对 Li–空气这类半开放体系，SSE 的空气稳定性更是硬指标（第 6 章）。" },
  ]);
  d.block(s, { x: 0.6, y: 5.75, w: 6.45, kind: "note", tint: true, size: 14, body: "原文说“用 As 取代 P”，但所引文献是 As 取代 Li₄SnS₄ 中的 Sn（见校注页）。" });
  s.addNotes("原文：Li3PS4、LGPS 等硫化物暴露在氧气或水分中极不稳定，主要因为 P 对氧的亲和力高；用 As 取代可显著提高空气稳定性，但砷化物有毒，限制了大规模生产；在硫化物中引入氧化物可以部分抑制 H2S 释放。Box 1 还提到：LLZO 在空气中放 1 年后，Al 和 La 的分布不再均匀。");

  // ---------------- 14. SPE oxidation & leakage current ----------------
  s = d.slide("CONTENT");
  s.addText("聚合物的高压短板：PEO 被氧化，以及怎样测得更准", { placeholder: "title" });
  d.fig(s, "spe_leak", { x: 0.45, y: 1.2, w: 6.45, h: 4.5 });
  d.column(s, 7.15, 1.3, 5.6, [
    { kind: "hist", body: "2001 年 Xia 等发现：正极含炭黑时，PEO 的窗口比惰性电极上测的窄得多。2019 年本文作者 Zhao、Archer 等改用漏电流法评估。" },
    { kind: "why", body: "SPE 电导率低，CV 扫得快时反应被传质拖住，分解“来不及”显现，窗口被高估。分级恒压给足时间，在全电池里测，更接近真实。" },
    { kind: "matters", body: "PEO 在 >4.2 V 时热力学不稳定，而高能正极要充到 4.3–4.4 V：必须靠界面工程或多层电解质（第 5 章）。" },
  ]);
  d.quote(s, { en: "In predicting the stability of SPEs to a cathode over long timescales, measurements of the leakage current have proved to be more reliable than cyclic voltammetry measurements.", zh: "要预测 SPE 对正极的长期稳定性，测漏电流已被证明比循环伏安更可靠。" });
  s.addNotes("为什么 PEO 会被氧化：醚氧原子富电子，在高电位下容易失去电子；盐的存在会加剧这种不稳定。漏电流法：电压一级一级升高，每级保持一段时间；如果电流衰减不到零、而是停在一个“台阶”上，说明电解质在持续分解。");

  // ---------------- 15. Section: dendrites ----------------
  d.section("3 枝晶");
  s = d.slide("DARK_SECTION");
  s.addText("金属枝晶 Dendrite", { placeholder: "title" });
  s.addText("硬的固体，为什么还是挡不住软的锂？", { placeholder: "body" });

  // ---------------- 16. Monroe–Newman ----------------
  s = d.slide("CONTENT");
  s.addText("Monroe–Newman 判据：电解质要比锂“硬两倍”", { placeholder: "title" });
  d.fig(s, "modulus_ladder", { x: 0.45, y: 1.15, w: 5.85, h: 4.95 });
  d.column(s, 6.6, 1.3, 6.15, [
    { kind: "hist", body: "2005 年 Monroe 与 Newman 用线弹性理论分析 Li / 聚合物界面：电解质剪切模量约为 Li 的 2 倍以上时，界面起伏被压平，枝晶受到抑制。" },
    { kind: "why", body: "PEO 只在无定形区导离子，要加热到熔点（约 60 °C）以上工作，这时它几乎成了粘性液体，力学优势丢了；而满足判据的均聚物多是结晶的，又不导离子。" },
    { kind: "matters", body: "“既硬又导”是 SPE 设计的核心矛盾，催生了交联、嵌段共聚物和多功能高分子（第 5 章）。" },
  ]);
  d.quote(s, { x: 6.6, w: 6.15, en: "According to the theoretical model of Monroe and Newman, SSEs with a shear modulus twice that of Li metal can inhibit dendrite propagation.", zh: "按照 Monroe 与 Newman 的理论模型，剪切模量达到 Li 金属两倍的 SSE 可以抑制枝晶扩展。" });
  s.addNotes("剪切模量 G 衡量材料抵抗“错动”变形的能力。Monroe–Newman 的直觉：硬电解质压在 Li 表面，凸起处受到更大压力，沉积变慢，于是表面被“熨平”。原文后面给出的门槛是 >6 × 10^9 Pa。Li 金属的剪切模量文献值在几 GPa，LLZO 约 60 GPa，远超门槛。");

  // ---------------- 17. Dendrites in SIEs ----------------
  s = d.slide("CONTENT");
  s.addText("陶瓷更硬，为什么还长枝晶？", { placeholder: "title" });
  d.fig(s, "dendrite_paths", { x: 0.45, y: 1.2, w: 6.6, h: 4.42 });
  d.stat(s, { x: 7.3, y: 1.2, w: 2.65, value: "5.5×10⁻⁸", label: "Li₃PS₄ 的电子电导（S cm⁻¹）", color: "accent3" });
  d.stat(s, { x: 10.1, y: 1.2, w: 2.65, value: "2.2×10⁻⁹", label: "LLZO 的电子电导（S cm⁻¹）", color: "accent3" });
  d.column(s, 7.3, 2.75, 5.45, [
    { kind: "hist", body: "2017 年 Porz 等发现：无论硫化物还是氧化物、无定形、多晶还是单晶，Li 都会渗入，与剪切模量无关。2019 年 Han 等指出元凶之一是电子电导。" },
    { kind: "why", body: "Monroe–Newman 假设界面理想平整。真实 SSE 有预先存在的缺陷，Li⁺ 还能从阴离子骨架、杂质、掺杂元素、晶界“拿到”电子。" },
    { kind: "matters", body: "光“硬”不够：SSE 还要电子绝缘、少缺陷、与 Li 接触致密。" },
  ], 0.18);
  d.quote(s, { w: 6.55, en: "Unlike the idealized interfaces in theoretical analyses, there are many pre-existing defects in real interfaces.", zh: "与理论分析中的理想界面不同，真实界面存在许多预先存在的缺陷。" });
  s.addNotes("两个数值均为 30 °C 下的电子电导（原文引自 Han 等 2019）。原文：SIE 的剪切模量可达 Li 的数倍，但它们很脆，结构缺陷和裂纹让枝晶有机可乘。电子电导会随温度升高。形成的 Li 丝沿裂纹和晶界延伸，接触电极后造成短路，同时损失活性物质。");

  // ---------------- 18. Critical current density ----------------
  s = d.slide("CONTENT");
  s.addText("临界电流密度 CCD：电流太大就会短路", { placeholder: "title" });
  d.fig(s, "ccd", { x: 0.45, y: 1.2, w: 6.45, h: 4.2 });
  d.caption(s, "示意图（不是实测数据）：Li | SSE | Li 对称电池，电流逐级加大，每级先沉积、再剥离。", { x: 0.6, y: 5.5, w: 6.3, h: 0.5 });
  d.column(s, 7.15, 1.3, 5.6, [
    { kind: "def", head: "临界电流密度 Critical current density", body: "对称电池逐级加大电流，直到发生短路的那一级电流密度，单位 mA cm⁻²。" },
    { kind: "hist", body: "2016 年 Sharafi、Sakamoto 等测量了 Li | LLZO 界面随温度和电流密度的稳定性；2017 年 Raj 与 Wolfenstine 给出了枝晶形成的“电流极限图”。" },
    { kind: "why", body: "以前只比电导率。原文指出：CCD 取决于电解质的断裂强度和极限电流，所以还要比“能扛多大电流”。" },
    { kind: "matters", body: "快充需要大电流，CCD 太低的 SSE 用不到电动车上。Na/β-Al₂O₃ 中也观察到同样的金属丝贯穿。" },
  ], 0.18);
  s.addNotes("原文：超过临界电流密度会导致 Li 枝晶扩展，CCD 的大小取决于电解质的断裂强度和极限电流。在 Na 电池的 β-Al2O3 中，缺陷从 Na 负极出发、逼近 Na/β-Al2O3 界面，在晶界和三叉晶界处都能观察到。");

  // ---------------- 19. Box 1 table ----------------
  d.section("4 诊断技术");
  s = d.slide("CONTENT");
  s.addText("诊断工具箱（原文 Box 1）", { placeholder: "title" });
  const H1 = { bold: true, color: "FFFFFF", fill: { color: HEX.dk1 } };
  const rows = [
    ["技术", "能看到什么", "原文中的例子"],
    ["恒流曲线 + 阻抗谱 EIS / 介电谱", "体相电阻骤降 = 内部短路；界面电阻变化", "最常用的组合"],
    ["原位 XPS（光电子能谱）", "界面产物的化学态", "LGPS + Li → Li₃P、Li₂S、Li–Ge 合金"],
    ["原位阻抗 + XPS 监测荷电状态", "容量衰减的原因", "正极侧高阻界面相 + 颗粒收缩"],
    ["ToF-SIMS（飞行时间二次离子质谱）", "元素的 3D 分布", "NASICON 中的 Na 枝晶；LLZO 放 1 年后 Al、La 偏析"],
    ["TEM / 原位 STEM-EELS", "纳米尺度的相变与元素扩散", "四方相 LLZO 的生成使性能下降"],
    ["中子深度剖析 NDP", "Li 的深度分布", "液体、石榴石、硫化物电解质中的沉积与短路"],
    ["⁷Li 核磁成像 / X 射线显微断层", "微结构 Li 的位置和生长方向", "Li 金属电池"],
    ["冷冻电镜、原位拉曼", "敏感材料的结构与组分演变", "失效机理的新视角"],
    ["电解质中的传感薄层", "提前预警枝晶", "检测枝晶引起的电压变化"],
  ];
  s.addTable(rows.map((r, i) => r.map((c) => ({ text: c, options: i === 0 ? H1 : { color: HEX.dk1, fill: { color: i % 2 ? "F5F7F9" : "FFFFFF" } } }))), {
    x: 0.6, y: 1.25, w: 12.1, colW: [3.75, 3.6, 4.75], fontSize: 14, fontFace: "Calibri", rowH: 0.5, valign: "middle",
    border: { type: "solid", pt: 0.75, color: "E3E8EC" }, margin: [0.03, 0.08, 0.03, 0.08],
  });
  s.addNotes("Box 1 的要点：最常用的是充放电曲线加阻抗谱，再配合材料表征。内部短路表现为体相电阻突然下降。Li、Na 很轻，X 射线看不清，所以中子、7Li 核磁成像很有用；冷冻电镜、原位拉曼和原位 STEM-EELS 是较新的方法。");

  // ---------------- 20. Diagnostics timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从“拆开看”到“边工作边看”", { placeholder: "title" });
  d.fig(s, "diag_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 3.6 });
  d.block(s, { x: 0.6, y: 5.0, w: 5.9, kind: "why", tint: true, body: "以前多是事后拆电池（post-mortem）分析，样品在转移中还可能被空气破坏。现在的趋势是原位 / 工况（in situ / operando）表征：电池工作时直接看。" });
  d.block(s, { x: 6.8, y: 5.0, w: 5.9, kind: "matters", tint: true, body: "Li、Na 很轻，X 射线“看不清”，这正是中子、⁷Li 核磁和冷冻电镜受青睐的原因。各技术互补，常需组合使用。" });
  s.addNotes("时间轴不按比例。1969 年 Bauerle 把复阻抗方法用于氧化锆固体电解质，是阻抗谱分析固体电解质的经典起点；其余条目都是原文 Box 1 引用的文献（文献 206、208、212–215、217）。");

  // ---------------- 21. NDP ----------------
  s = d.slide("CONTENT");
  s.addText("中子深度剖析 NDP：给 Li“称重”又“测深”", { placeholder: "title" });
  d.fig(s, "ndp", { x: 0.45, y: 1.2, w: 6.0, h: 4.0 });
  d.column(s, 6.8, 1.3, 5.95, [
    { kind: "hist", body: "1970 年代初，Ziegler 等提出中子深度剖析，最早用来测硅中硼的分布。2017 年 Wang C. 等用它工况观察 Li | 石榴石界面的 Li 沉积与短路。" },
    { kind: "why", body: "X 射线对 Li 这种轻元素不敏感。中子却会被 ⁶Li 吸收，放出能量确定的 ⁴He 和 ³H，“哪里有 Li、有多少”一测便知，而且不破坏样品。" },
    { kind: "matters", body: "能在电池工作时看到 Li 是否在 SSE 内部沉积、何时形成短路通道，直接检验本章讲的枝晶机理。" },
  ]);
  d.block(s, { x: 0.6, y: 5.45, w: 5.85, kind: "def", tint: true, head: "核反应", size: 14, body: "⁶Li + n → ⁴He + ³H：出射粒子能量固定，测到的能量越低，说明 Li 埋得越深。" });
  s.addNotes("原文 Box 1：中子与 6Li 同位素反应生成能量确定的 4He 和 3H，从而揭示 Li 的位置和丰度。工况 NDP 已用于监测 Li 的沉积/剥离，并诊断使用有机液体电解质、石榴石电解质和硫化物电解质的 Li 金属电池中的短路。");

  // ---------------- 22. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：第 10–12 页", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.95, kind: "note", tint: true, head: "① 第 11 页：“high-power devices (>4.2 V)”", body: "原文把 >4.2 V 和“高功率”联系在一起。电压高主要提高的是能量（能量 = 容量 × 电压），功率取决于电流和倍率。这里应理解为“高电压（高能量）正极”。" });
  d.block(s, { x: 6.8, y: 1.4, w: 5.95, kind: "note", tint: true, head: "② 第 10 页：“用 As 取代 P”", body: "原文：“Substituting phosphorus with arsenic substantially enhances the air stability”。所引文献 85（Sahu 等 2014）研究的是 As 掺杂的 Li₄SnS₄，As 取代的是 Sn，材料中并没有 P。思路（换用更“软”的阳离子）相同，但表述与文献不符。" });
  d.block(s, { x: 0.6, y: 3.75, w: 5.95, kind: "note", tint: true, head: "③ Box 1：正极侧界面相的名称", body: "Box 1 写作 “solid electrolyte interphase at the cathode”，而 Fig. 4a 把正极侧界面相称为 CEI（cathode electrolyte interphase）。两者指同一类东西，阅读时注意别混淆。" });
  d.block(s, { x: 6.8, y: 3.75, w: 5.95, kind: "def", tint: true, head: "补充：本章引入的非原文内容", body: "第 8 页的计算窗口数据、第 9 页的三类界面示意（出自原文文献 79 的作者）、第 16 页的 LLZO 模量（≈60 GPa）都是补充资料，用来帮助理解原文的论述。" });
  s.addNotes("校注②：Sahu 等 2014 年的材料是 Li3.833Sn0.833As0.166S4，用 HSAB 原理解释其空气稳定性。原文的大意（引入 As 能提高空气稳定性、但砷有毒）没有问题，只是“取代 P”的说法不准确。");

  // ---------------- 23. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.55, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["失效大多发生在界面", "SIE 两侧都会反应（CEI / SEI），体积变化让固-固接触失效；SPE 则怕枝晶和高电压"],
    ["稳定窗口 ≠ CV 测出的窗口", "计算窗口很窄，实验靠钝化层“撑宽”；产物导电子 → 混合导电界面相持续生长"],
    ["PEO：对 Li 稳，>4.2 V 被氧化", "评估对正极的长期稳定性，分级恒压测漏电流比 CV 更可靠"],
    ["枝晶：光“硬”不够", "晶界、缺陷、电子电导让陶瓷也长枝晶；超过临界电流密度就会短路"],
    ["诊断要组合", "EIS + XPS + ToF-SIMS + NDP + 冷冻电镜：从“拆开看”走向“边工作边看”"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.5 + i * 0.88;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.52, h: 0.52, fill: { color: C.accent1 }, color: C.background1, fontSize: 17, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.45, y, w: 11.2, h: 0.4, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.45, y: y + 0.4, w: 11.2, h: 0.36, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Unregulated ion transport, mechanically weak electrolytes and irreversible surface reactions are some of the key factors in facilitating dendrite propagation in Li-metal batteries.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "不受调控的离子传输、力学上偏弱的电解质和不可逆的表面反应，是促使 Li 金属电池枝晶扩展的几个关键因素。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("一句话：固态电解质的“坏法”主要在界面——化学上的反应、力学上的脱开、电学上的漏电子。下一章看原文给出的五类设计策略怎样逐一对付这些问题。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
