// Zhao et al. 2020 — Chapter 6: 高能量密度电池体系与展望
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
  const info = await renderAll(path.join(__dirname, "ch6_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 6, chapterTitle: "高能量密度电池体系与展望", figDir });
  d.registerFigs(info);
  guardFigs(d);
  const C = d.C;
  const card = (s, x, y, w, h, fill) => s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 6 章\n固态电解质能把电池带到哪里？", { placeholder: "title" });
  s.addText("高能量密度电池体系（原文 Table 2）与未来展望", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文“Building better solid-state batteries”和“Future perspectives”两节（第 17–20 页，含 Table 2）。右侧图标：左边是 Li 金属负极和一层薄 SSE，右边是三种高能正极——层状氧化物、硫（S8 环）和氧气。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "已经商业化的 SSE", "Na–S 储能、Bluecar 聚合物电池、LiPON 薄膜电池"],
    ["2", "500 Wh kg⁻¹ 的账本", "薄 Li 负极 + 轻而薄的 SSE"],
    ["3", "三类高能体系（Table 2）", "富镍 / 富锂正极 · 金属–S / 有机 · 金属–空气 / CO₂"],
    ["4", "原文展望", "SIE vs SPE、多相界面、安全与制造"],
    ["5", "全文回顾", "六章串成一条线"],
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
    { kind: "def", head: "第 5 章讲了什么", tint: true, body: "五类设计策略：提高电导率、拓宽窗口、抑制枝晶、提高选择性、降低界面电阻。" },
    { kind: "matters", head: "本章要回答", tint: true, body: "这些 SSE 用在哪里最划算？要做到多薄、多轻？原文对下一步研究有什么建议？" },
    { kind: "why", head: "本章的读法", tint: true, body: "前五章看材料，本章看整个电池：数据多来自原文 Table 2，最后用一页把六章串起来。" },
  ]);
  s.addNotes("前五章讲材料本身：发展史、传输机理、各类 SSE、失效模式和设计策略。本章把视角放大到整个电池：哪些体系最需要 SSE、SSE 要满足什么硬指标，最后是原文的展望和全文回顾。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：固态电解质走出实验室的足迹", { placeholder: "title" });
  d.fig(s, "systems_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 3.6 });
  d.block(s, { x: 0.6, y: 5.0, w: 5.9, kind: "why", tint: true, body: "最早成功的 SSE 都“避开了”室温难题：Na–S 在 300 °C 以上运行，Bluecar 的 PEO 电池也要加热，LiPON 只做微小的薄膜电池。" });
  d.block(s, { x: 6.8, y: 5.0, w: 5.9, kind: "matters", tint: true, body: "下一步的目标是室温、大容量、高能量：配合 Li 金属负极和富镍、S、O₂、CO₂ 等高能正极。" });
  s.addNotes("时间轴不按比例。Kummer & Weber（Ford）1960 年代中期提出 β-Al2O3 的 Na–S 电池；Bates 等 1992 年在橡树岭国家实验室报道 LiPON；Abraham & Jiang 1996 年报道以聚合物电解质为基础的 Li–O2 电池；NGK 的 Na–S 储能在 2000 年代商业运行；Bolloré Bluecar 2011 年随巴黎 Autolib 共享汽车上路。原文提到的商业例子见下一页。");

  // ---------------- 4. Commercial successes ----------------
  d.section("1 已商业化与能量账本");
  s = d.slide("CONTENT");
  s.addText("SSE 已经在哪些地方商业化？", { placeholder: "title" });
  d.fig(s, "commercial", { x: 0.6, y: 1.15, w: 12.1, h: 4.05 });
  d.column(s, 0.6, 5.35, 3.85, [{ kind: "hist", body: "1966 年前后，Ford 的 Kummer 与 Weber 用 β-Al₂O₃ 做出 Na–S 电池；NGK 后来把它做成 50 MW 级储能站。" }]);
  d.column(s, 4.75, 5.35, 3.85, [{ kind: "why", body: "三者各有“取巧”：高温（Na–S）、加热（PEO）或极小容量（LiPON）。室温大电池仍是空白。" }]);
  d.column(s, 8.9, 5.35, 3.85, [{ kind: "matters", body: "它们证明 SSE 能做到长寿命、高安全，也提醒我们室温电导和界面才是规模化的关键。" }]);
  s.addNotes("原文：SSE 目前在三类产品上获得商业成功：300–350 °C 的 Na–S 电池（β-NaAl11O17 导 Na⁺，NGK 的 50 MW 级储能，4500 圈以上）；Bolloré Bluecar 的 Li 金属聚合物电池（PEO 基 SPE + LiFePO4，至少 30 kWh，续航 250 km）；LiPON 薄膜电池（用于智能卡和植入式医疗器件，容量 0.001–0.01 Ah）。");

  // ---------------- 5. Thin Li & N/P ----------------
  s = d.slide("CONTENT");
  s.addText("为什么高能量电池需要 SSE：薄 Li 负极", { placeholder: "title" });
  d.fig(s, "np_ratio", { x: 0.45, y: 1.2, w: 6.6, h: 4.2 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2019 年 Liu 等（原文文献 199，Battery500 团队）分析了实现 500 Wh kg⁻¹ 的路线：薄 Li 箔替代石墨，并严格限制液体电解质的用量。" },
    { kind: "why", body: "液体电解质会和 Li 持续反应，Li 和电解液一起被耗光，电池很快失效，只好多放 Li。SSE 减少副反应，才敢用薄 Li。" },
    { kind: "matters", body: "负极/正极容量比降到 1 以下，负极几乎不占重量，能量密度大幅提升。但 SSE 本身也必须足够轻。" },
  ]);
  d.quote(s, { en: "SSEs may allow for the use of a thin Li anode, enabling a low anode to cathode capacity ratio (≤1) to be achieved.", zh: "SSE 有望让我们使用薄 Li 负极，从而实现很低的负极/正极容量比（≤1）。" });
  s.addNotes("负极/正极容量比常写作 N/P 比。石墨负极通常略大于 1，以免析锂；Li 金属负极在液体电解质中常要过量好几倍，补偿每圈的损耗。图中宽度只是示意。");

  // ---------------- 6. 500 Wh/kg budget (doughnut) ----------------
  s = d.slide("CONTENT");
  s.addText("500 Wh kg⁻¹ 的账本：SSE 只能分到 2 mg cm⁻²", { placeholder: "title" });
  const mass = [["正极涂层", 47.06], ["Al 箔", 4.0], ["SSE（两层）", 4.03], ["Li 箔（50 μm）", 2.67], ["包装等（5%）", 3.04]];
  s.addChart(d.pres.charts.DOUGHNUT, [{ name: "质量", labels: mass.map((m) => m[0]), values: mass.map((m) => m[1]) }], {
    x: 0.5, y: 1.2, w: 6.2, h: 4.75, holeSize: 52,
    chartColors: [HEX.accent1, HEX.accent6, HEX.accent2, HEX.accent3, HEX.dk2],
    showPercent: true, showValue: false, dataLabelColor: "FFFFFF", dataLabelFontSize: 12, dataLabelFontBold: true,
    showLegend: true, legendPos: "b", legendFontSize: 12, legendColor: HEX.dk1, legendFontFace: "+mn-lt",
    showTitle: true, title: "每 cm² 双面单元的质量构成（共 60.8 mg）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
  });
  card(s, 7.0, 1.3, 5.75, 2.0, "F5F7F9");
  s.addText([
    { text: "能量：2 面 × 4 mAh × 3.8 V = 30.4 mWh", options: { bold: true, color: C.text1, breakLine: true } },
    { text: "目标 500 Wh kg⁻¹ → 总质量 ≤ 60.8 mg", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: "正极 2 × (4 ÷ 200) ÷ 0.85 ≈ 47.1 mg；Al 4 mg；Li 2.7 mg；包装 5%", options: { color: C.text2, breakLine: true } },
    { text: "→ 两层 SSE 合计 ≤ 4 mg，每层 < 2 mg cm⁻²", options: { bold: true, color: C.accent2 } },
  ], { x: 7.2, y: 1.38, w: 5.4, h: 1.85, fontSize: 14, margin: 0, valign: "middle", paraSpaceAfter: 4, isTextBox: true });
  d.column(s, 7.0, 3.5, 5.75, [
    { kind: "hist", body: "2016 年美国能源部启动 Battery500 联盟，目标就是 500 Wh kg⁻¹ 的电芯；原文用它的参数算了这笔账。" },
    { kind: "why", body: "石墨负极 + 富余电解液到不了 500 Wh kg⁻¹；换成薄 Li 之后，“省下的重量”大部分要留给正极。" },
    { kind: "matters", body: "SSE 研究不能只报电导率，还要报厚度和面密度。" },
  ], 0.16);
  s.addNotes("原文的假设：独立的 50 μm Li 负极（每面 25 μm），配 3.8 V 的 NCM811 正极，每面 4 mAh cm⁻²、比容量 200 mAh g⁻¹、活性物质 85 wt%，涂在 Al 箔上（每面 2 mg cm⁻²），包装等其他部件最多占 5%。我们按这些参数复算，得到 SSE 每层约 2.0 mg cm⁻²，与原文“< 2 mg cm⁻²”一致。");

  // ---------------- 7. Thickness ----------------
  s = d.slide("CONTENT");
  s.addText("SSE 要多薄？聚合物 < 20 μm，陶瓷只有几微米", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "最大厚度", labels: ["SPE", "LGPS", "LAGP", "LLZO"], values: [20, 11, 7, 5] }], {
    x: 0.5, y: 1.2, w: 5.4, h: 3.9, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 45,
    chartColors: [HEX.accent3, HEX.accent5, HEX.accent2, HEX.dk2],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 14, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 24, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "达到 500 Wh kg⁻¹ 允许的最大厚度（μm）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "原文数值：面密度 < 2 mg cm⁻² ÷ 各材料密度。陶瓷越致密越重，所以要更薄。", { x: 0.6, y: 5.12, w: 5.3, h: 0.4 });
  d.fig(s, "rollpress", { x: 6.15, y: 1.2, w: 6.6, h: 3.9 });
  d.column(s, 0.6, 5.55, 3.85, [{ kind: "hist", body: "2019 年 Wan、Cui 等把 PEO–LiTFSI 填进 8.6 μm 纳米孔聚酰亚胺膜，配 LiFePO₄ 稳定 200 圈。" }]);
  d.column(s, 4.75, 5.55, 3.85, [{ kind: "why", body: "陶瓷越薄越易碎，已报道的无机 SSE 通常远厚于要求；厚正极里还要混入 SSE（常 >10 wt%）。" }]);
  d.column(s, 8.9, 5.55, 3.85, [{ kind: "matters", body: "Fujifilm、三星、丰田等已报道 >800 Wh L⁻¹ 的固态 Li 金属电池进展。" }]);
  s.addNotes("原文还提到：为改善厚正极中的离子扩散，SSE 要与正极混合，这会进一步降低能量密度；另一个办法是用少量液体电解质润湿正极。湿法涂布后辊压可直接在正负极表面做出约 20 μm 的 SSE；Ionic Materials 公司的 SPE 宣称 5 V 稳定、电导率 1.3 mS cm⁻¹。");

  // ---------------- 8. Table 2 overview ----------------
  d.section("2 高能体系（Table 2）");
  s = d.slide("CONTENT");
  s.addText("Table 2 一览：用 SSE 的高能量密度电池体系", { placeholder: "title" });
  const t2 = [
    ["NCM811", 800, 0], ["NCA", 760, 0], ["富锂 Li₂MnO₃·LiMO₂", 900, 0],
    ["Li–S", 2669, 1], ["Na–S", 1245, 1], ["K–S", 917, 1],
    ["Li–O₂ → Li₂O₂", 3458, 2], ["Na–O₂ → Na₂O₂", 1605, 2], ["Na–O₂ → NaO₂", 1108, 2], ["K–O₂ → KO₂", 935, 2],
    ["Li–O₂ 水系", 2172, 2], ["Na–O₂ 水系", 1281, 2], ["Zn–空气", 1218, 2], ["Al–空气 实验值", 3364, 2],
    ["Li–CO₂", 1876, 3], ["Na–CO₂", 1125, 3],
  ];
  const fam = [["嵌入式正极", HEX.dk2], ["金属–S", HEX.accent5], ["金属–O₂ / 空气", HEX.accent2], ["金属–CO₂", HEX.accent4]];
  s.addChart(d.pres.charts.BAR, fam.map(([n], k) => ({ name: n, labels: t2.map((r) => r[0]), values: t2.map((r) => (r[2] === k ? r[1] : 0)) })), {
    x: 0.5, y: 1.1, w: 7.2, h: 5.72, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 35, catAxisOrientation: "maxMin",
    chartColors: fam.map((f) => f[1]),
    catAxisLabelFontSize: 11, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    catAxisLabelFrequency: 1, valAxisLabelFontSize: 11, valAxisLabelColor: HEX.dk2, valAxisMinVal: 0, valAxisMaxVal: 3600, valAxisMajorUnit: 1000,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "理论能量密度（Wh kg⁻¹）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "b", legendFontSize: 12, legendColor: HEX.dk1, legendFontFace: "+mn-lt",
  });
  d.column(s, 8.0, 1.3, 4.75, [
    { kind: "hist", body: "1960 年代的高温 Na–S 电池已证明“固体电解质 + 液 / 固活性物质”可行；Table 2 把这一思路推广到 Li、Na、K、Zn、Al 与 S、O₂、CO₂、有机正极。" },
    { kind: "why", body: "与液体电解质相比，SSE 循环寿命更长、热稳定性更高，被视为高容量金属负极走向商用的关键。" },
    { kind: "matters", body: "理论值：金属–空气 > 金属–S > 嵌入式正极；但越往上，工程难度越大。除 Al–空气外均为理论值。" },
  ]);
  s.addNotes("数值全部来自原文 Table 2。“水系”指在混合（水系）电解质中工作的体系。嵌入式正极一栏是按 Li 金属负极计算的值。注意 Li–O2（水系）2172 和 Na–O2（水系）1281 两个数，按方程式中的无水 LiOH / NaOH 算不出来，按一水合物算才吻合（见校注页）。");

  // ---------------- 9. Ni-rich / Li-rich ----------------
  s = d.slide("CONTENT");
  s.addText("体系①  富镍 / 富锂正极 + Li 金属：双极堆叠的机会", { placeholder: "title" });
  d.fig(s, "bipolar", { x: 0.45, y: 1.2, w: 6.6, h: 4.35 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2001 年 Ohzuku 与 Makimura 报道 LiNi₁/₃Co₁/₃Mn₁/₃O₂，此后 Ni 含量一路升到 NCM811；富锂锰基正极由 Lu、Dahn 与 Thackeray 等在 2000 年代初提出。" },
    { kind: "why", body: "充到 4.3–4.6 V 时液体电解质会持续氧化。SSE 热稳定、不燃、无泄漏、t⁺ 高，还能双极堆叠，省掉单体之间的外壳与连接。" },
    { kind: "matters", body: "原文例子：NCM811 | PAN@LAGP 电池 175 圈后 184 mAh g⁻¹（保持 94.4%）；Li–In | LiNbO₃ 包覆 NCA | LGPS 400 圈保持 89.4%（60 °C）。" },
  ]);
  d.block(s, { x: 0.6, y: 5.75, w: 6.45, kind: "def", tint: true, head: "Table 2 数据", size: 14, body: "NCM811：3.8 V，800 Wh kg⁻¹；NCA：3.8 V，760；富锂 Li₂MnO₃·LiMO₂：3.6 V，900。" });
  s.addNotes("NCM811 = LiNi0.8Mn0.1Co0.1O2；NCA = LiNi0.80Co0.15Al0.05O2。第一个例子中，室温运行时用液体电解质润湿了正极表面，便于离子传输。双极设计是 Table 2 列出的 SSE 优势之一：固体电解质不流动，单元可以在一个外壳里直接串联叠放。");

  // ---------------- 10. Metal–S ----------------
  s = d.slide("CONTENT");
  s.addText("体系②  金属–硫：让 S 走“固 → 固”的路", { placeholder: "title" });
  d.fig(s, "sulfur_route", { x: 0.45, y: 1.2, w: 6.6, h: 4.15 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "1962 年 Herbert 与 Ulam 申请了硫正极电池专利；2009 年 Ji、Lee 与 Nazar 用介孔碳负载硫，Li–S 重新升温。" },
    { kind: "why", body: "在液体中 S₈ 要“固 → 液 → 固”，长链多硫化物溶解、穿梭。SSE 不溶解多硫化物，反应变成“固 → 固”；但 S 的体积变化约 80%，需要缓冲。" },
    { kind: "matters", body: "原文例子：Li₃PS₄ SSE 的 Li–S 电池电芯级 370.6 Wh kg⁻¹（室温）；K–S 用 β″-Al₂O₃ 在 150 °C 循环 1000 圈几乎不衰减。" },
  ]);
  d.quote(s, { en: "SSEs that act as a bridge for a solid–solid conversion can, in principle, cure this problem.", zh: "充当“固–固转化之桥”的 SSE，原则上可以根治这一问题。" });
  s.addNotes("S 正极理论容量 1.675 Ah g⁻¹，是现有嵌入式正极的 5–10 倍。无机 SSE（如 LGPS）可以把 S、SSE 和导电碳混合，为体积变化留缓冲，但比例要精心设计；弹性 SPE（如 LiTFSI–PEO）能缓冲体积变化，主要问题是室温电导低，而升温到熔点以上又会出现与液体电解质类似的容量衰减。");

  // ---------------- 11. Organic ----------------
  s = d.slide("CONTENT");
  s.addText("体系②  有机正极：来自生物质，同样怕溶解", { placeholder: "title" });
  d.fig(s, "quinone", { x: 0.45, y: 1.3, w: 6.3, h: 3.5 });
  d.stat(s, { x: 0.6, y: 4.95, w: 3.0, value: "496", unit: "mAh g⁻¹", label: "Table 2：醌类正极比容量", color: "accent5" });
  d.stat(s, { x: 3.8, y: 4.95, w: 3.0, value: "1.0–3.5", unit: "V", label: "工作电压范围", color: "accent5" });
  d.column(s, 7.1, 1.3, 5.65, [
    { kind: "hist", body: "2014 年 Zhu、Chen 等用 pillar[5]quinone 正极配复合聚合物电解质（PMA–PEG–LiClO₄ + 3 wt% SiO₂），做出全固态 Li–有机电池：418 mAh g⁻¹，约 2.6 V。" },
    { kind: "why", body: "小分子有机正极可从植物生物质中提取，资源可持续；但在液体电解质里易溶解，和多硫化物“同病”。SSE 不溶解它们。" },
    { kind: "matters", body: "S 和有机正极只工作在 1–3.5 V，大多数 SSE 的窗口都够用：难点转到界面和室温电导率上。" },
  ]);
  s.addNotes("醌类电极的反应：每个 C=O 接受 1 个电子和 1 个碱金属离子，变成 C–O–M。M 可以是 Li、Na、K。原文 Table 2 把有机正极与金属–S 归为一类，因为它们面临同样的溶解与寄生反应问题。");

  // ---------------- 12. Metal–air ----------------
  s = d.slide("CONTENT");
  s.addText("体系③  金属–空气：开放体系最需要“不漏、不挥发”", { placeholder: "title" });
  d.fig(s, "metal_air", { x: 0.45, y: 1.2, w: 6.6, h: 4.3 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "1996 年 Abraham 与 Jiang 报道了第一个非水系 Li–O₂ 电池，用的就是聚合物电解质；2018 年 Lei 等用原位形成的凝胶电解质，让柔性 Li–空气电池在环境空气中运行 1175 h。" },
    { kind: "why", body: "开放体系里液体会挥发、泄漏，Li 被 H₂O、CO₂ 腐蚀。氧化物 NASICON（LATP、LAGP）在空气中比硫化物稳定；SPE 能贴合 Li、隔绝空气。" },
    { kind: "matters", body: "Na(K)–O₂ 的过电位远低于 Li–O₂，但相应的 SSE 报道很少；Zn–空气需要导 OH⁻ 的 SSE。" },
  ]);
  d.quote(s, { en: "the dissolution of O₂ in an SSE is yet to be investigated in depth", zh: "O₂ 在 SSE 中的溶解还有待深入研究" });
  s.addNotes("原文：金属–空气电池的工作依赖 O2 在电解质中的溶解，而 O2 在 SSE 中的溶解几乎没人深入研究过，所以用 SSE 时的反应机理可能与液体电解质不同。有些聚合物电解质承受不了 Li–O2 充电时的高过电位，交联或耐高压的聚合物是可能的候选。表中例子还有：Ge 包覆的 LAGP 在空气中稳定循环 30 次；NASICON 膜隔开的混合 Na–空气电池电压差约 0.3 V、能量效率约 90%。");

  // ---------------- 13. Metal–CO2 ----------------
  s = d.slide("CONTENT");
  s.addText("体系③  金属–CO₂：储能，也是 CO₂ 转化", { placeholder: "title" });
  d.fig(s, "mars", { x: 0.45, y: 1.2, w: 6.6, h: 3.95 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2016 年 Al Sadat 与 Archer 提出 O₂ 辅助的 Al/CO₂ 电池，产物为草酸铝；2017 年 Hu、Chen 等做出用 SPE 的柔性 Li–CO₂ 软包电池（55 °C 下 521 Wh kg⁻¹）。" },
    { kind: "why", body: "CO₂ 既能当“燃料”，又是要处理的温室气体。开放体系的泄漏问题靠 SSE 解决，但 SSE 必须在 CO₂ / 空气中稳定。" },
    { kind: "matters", body: "火星大气约 96% 是 CO₂，金属–CO₂ 电池可能成为火星探测的储能或 CO₂ 转化手段。" },
  ]);
  d.block(s, { x: 0.6, y: 5.35, w: 6.45, kind: "def", tint: true, head: "放大的例子（原文 Table 2）", size: 14, body: "1.1 Ah、400 cm² 的 Na–CO₂ 软包电池，PVDF-HFP 凝胶 SPE，室温 232 Wh kg⁻¹。" });
  s.addNotes("Al–CO2 一栏的 14 000 mAh g⁻¹ 是按碳计算的实验比容量，不能与其他体系的 Wh kg⁻¹ 直接比较，所以没有放进上一页的柱状图。");

  // ---------------- 14. Section: outlook ----------------
  d.section("3 展望");
  s = d.slide("DARK_SECTION");
  s.addText("原文展望 Future perspectives", { placeholder: "title" });
  s.addText("高能金属负极让 SSE 成为下一代电池的候选：还差什么？", { placeholder: "body" });

  // ---------------- 15. SIE vs SPE ----------------
  s = d.slide("CONTENT");
  s.addText("展望①  SIE 与 SPE 各有短板：缓冲层是现实的答案", { placeholder: "title" });
  d.fig(s, "sie_spe", { x: 0.6, y: 1.15, w: 12.1, h: 4.05 });
  d.column(s, 0.6, 5.35, 3.85, [{ kind: "hist", body: "2016 年 Zhou、Goodenough 等提出“聚合物 / 陶瓷 / 聚合物”三明治电解质，是最早的多层电解质之一。" }]);
  d.column(s, 4.75, 5.35, 3.85, [{ kind: "why", body: "脆的 SIE 难以同时满足大电流、高面容量和高利用率；加缓冲层能贴合界面、容忍体积变化。" }]);
  d.column(s, 8.9, 5.35, 3.85, [{ kind: "matters", body: "一价离子 SSE 的电导率已达应用门槛；多价离子（Mg²⁺、Zn²⁺、Al³⁺）SSE 仍在起步。" }]);
  s.addNotes("原文：与 SPE 相比，SIE 电导率和模量都高，但它们脆，与正负极的界面都较差，很难实现在高电流密度、高面容量和高利用率下循环。因此，在 SIE 与电极之间使用液体、凝胶或聚合物缓冲层，是构建贴合界面、容忍大体积变化的有效办法。");

  // ---------------- 16. Multiphase interfaces ----------------
  s = d.slide("CONTENT");
  s.addText("展望②  多相界面上的离子传输：认识还很有限", { placeholder: "title" });
  d.fig(s, "multiphase", { x: 0.45, y: 1.2, w: 6.6, h: 4.3 });
  d.column(s, 7.3, 1.3, 5.45, [
    { kind: "hist", body: "2002 年 Knauth 与 Tuller 回顾了固态离子学的历程；2017 年 Gregori、Merkle 与 Maier 系统总结了氧化物晶界上的离子传导与再分布（原文文献 19、36）。" },
    { kind: "why", body: "单一体相材料的传输路径和能量地形已研究得很透；但纳米化带来大量界面，充放电时离子可能主要沿界面走，性质也随尺寸改变。" },
    { kind: "matters", body: "计算和高通量筛选能快速排除候选，但对界面和多相体系仍力不从心：这是下一阶段的基础科学难题。" },
  ]);
  d.quote(s, { en: "Our fundamental understanding of ionic transport through multiphase interfaces remains limited.", zh: "我们对离子穿过多相界面的传输，基础认识仍然有限。" });
  s.addNotes("原文列出的界面：晶界、复合电解质中的无机–有机界面、电解质–电极界面。原文对计算的评价：计算与实验仍偶有差异，但计算能快速排除性质不佳的化合物，缩小实验候选范围。");

  // ---------------- 17. SPE design priorities ----------------
  s = d.slide("CONTENT");
  s.addText("展望③  聚合物电解质的设计清单", { placeholder: "title" });
  const pri = [
    ["提高室温电导率", "最关键的三个参数仍是 Tg、结晶度和离子对解离", HEX.accent3, "F1ECF8"],
    ["稳定正极界面", "主链上的吸电子基团；交联减少链段迁移到界面；能形成稳定界面相的盐添加剂", HEX.accent1, "FDF2E7"],
    ["稳定负极沉积", "提高储能模量，并把电解质结构纳米化", HEX.accent4, "FBEDEC"],
  ];
  pri.forEach(([h, b, c, t], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.3, 3.9, 1.95, t);
    s.addText(h, { x: x + 0.2, y: 1.4, w: 3.5, h: 0.45, fontSize: 18, bold: true, color: c, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: x + 0.2, y: 1.9, w: 3.5, h: 1.25, fontSize: 14, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  });
  d.column(s, 0.6, 3.45, 3.85, [{ kind: "hist", body: "2019 年的双层聚合物电解质（Zhou 等）和原位聚合 SPE（Zhao 等）都体现了这一趋势：用多相、多层代替单一材料。" }]);
  d.column(s, 4.75, 3.45, 3.85, [{ kind: "why", body: "以前想找一种“全能”聚合物。原文判断：几乎总存在此消彼长，复合或多相体系更有希望。" }]);
  d.column(s, 8.9, 3.45, 3.85, [{ kind: "matters", body: "负极侧用薄膜稳定界面，体相用低聚物、聚合物或液体导离子，稳定性和总质量都更有利。" }]);
  d.quote(s, { en: "Trade-offs almost always exist when attempting to design a single polymeric material possessing all these properties and, hence, composite or multiphase systems seem to be a more promising route for achieving these requirements.", zh: "试图用单一高分子材料兼具所有这些性质时，几乎总会出现取舍；因此，复合或多相体系似乎是满足这些要求更有希望的途径。" });
  s.addNotes("这一页把原文对 SPE 的展望整理成三条：电导率、正极界面、负极沉积。它们正好对应第 5 章的策略①②③。原文还特别提到“储能模量”（storage modulus），即材料在动态测试中表现出的弹性部分。");

  // ---------------- 18. Large format, cost, safety, thickness ----------------
  s = d.slide("CONTENT");
  s.addText("展望④  从实验室走向大电芯：还要考虑什么", { placeholder: "title" });
  const four = [
    ["大型电芯", "电极与电解质的相容性；热、电子、离子乃至压力都会在“能量反应器”里重新分布", HEX.accent2, "E8F4F3"],
    ["环境与成本", "用丰产元素或生物质合成材料；用节能的路线回收旧电池", HEX.accent5, "FBF4DC"],
    ["安全", "预测热失控的模型和传感器是用户的“最后一道防线”；还要考虑空气、湿气稳定性与日历老化", HEX.accent4, "FBEDEC"],
    ["厚度", "理想的 SSE 薄而强：磁控溅射、湿法涂布 + 辊压都是可行的工艺", HEX.accent3, "F1ECF8"],
  ];
  four.forEach(([h, b, c, t], i) => {
    const x = 0.6 + (i % 2) * 6.1, y = 1.3 + Math.floor(i / 2) * 1.5;
    card(s, x, y, 5.95, 1.38, t);
    s.addText(h, { x: x + 0.2, y: y + 0.08, w: 5.5, h: 0.42, fontSize: 18, bold: true, color: c, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: x + 0.2, y: y + 0.52, w: 5.55, h: 0.8, fontSize: 14, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  });
  d.column(s, 0.6, 4.4, 3.85, [{ kind: "hist", body: "2014 年 Wu、Cui 等在隔膜中加入导电传感层，枝晶接近时电压变化能提前报警（原文 Box 1）。" }]);
  d.column(s, 4.75, 4.4, 3.85, [{ kind: "why", body: "以前的安全手段多是“被动”的（阻燃、熔断）；原文强调“预测”：建模和电池内的传感器。" }]);
  d.column(s, 8.9, 4.4, 3.85, [{ kind: "matters", body: "小扣式电池上的好结果不能直接外推：大量性质各异的材料要在大电芯里协同工作。" }]);
  d.quote(s, { en: "Safety is a prerequisite for battery applications.", zh: "安全是电池应用的前提。" });
  s.addNotes("原文：理解这些高能体系中的材料演变和背后的化学，有助于电池高效运行、延长循环寿命。考虑到环境与成本，用丰产元素或生物质合成能源材料、通过节能路线回收废旧电池都是值得的。");

  // ---------------- 19. Five features ----------------
  s = d.slide("CONTENT");
  s.addText("展望⑤  理想 SSE 的五个维度", { placeholder: "title" });
  d.fig(s, "pentagon", { x: 0.45, y: 1.15, w: 6.2, h: 5.0 });
  d.column(s, 7.0, 1.3, 5.75, [
    { kind: "hist", body: "2017 年 Manthiram 等在同一刊物综述了 SSE 支撑的各类电池（原文文献 3）；本文进一步把评价维度从“电导率”扩展到五类特征。" },
    { kind: "why", body: "早期评价 SSE 主要看室温电导率。原文结尾提出：化学、几何、力学、电化学和界面传输特征要综合考虑。" },
    { kind: "matters", body: "多价金属负极（Mg、Zn、Al）和 O₂、S₈、CO₂ 等正极对 SSE 的要求各不相同，要按体系“量体裁衣”。" },
    { kind: "def", head: "几何特征指什么", body: "厚度、孔结构、纳米结构等形状与尺寸因素，例如 500 Wh kg⁻¹ 要求的“薄”。" },
  ], 0.18);
  s.addNotes("这五个维度在前几章都出现过：化学（空气稳定性、界面反应）、几何（厚度、纳米限域）、力学（模量、脆性、体积变化）、电化学（稳定窗口、迁移数）、界面传输（界面电阻、多相界面）。");

  // ---------------- 20. Whole-paper wrap-up ----------------
  d.section("4 全文回顾");
  s = d.slide("CONTENT");
  s.addText("全文回顾：六章串成一条线", { placeholder: "title" });
  d.fig(s, "paper_map", { x: 0.85, y: 1.15, w: 11.6, h: 4.6 });
  d.block(s, { x: 0.6, y: 5.85, w: 5.9, kind: "why", body: "从“电导率够不够”到“界面稳不稳、电池轻不轻”：这是 SSE 研究重心的转移。" });
  d.block(s, { x: 6.8, y: 5.85, w: 5.9, kind: "matters", body: "读后续文献时，可以拿第 4 章的失效清单和第 5 章的策略表逐项对照。" });
  s.addNotes("一句话串起全文：SSE 因为安全和金属负极重新受到重视（第 1 章）；离子在固体里怎么走决定了材料设计（第 2、3 章）；真实电池里的失效大多在界面（第 4 章）；五类策略对症下药（第 5 章）；最终目标是配合 Li 金属和高能正极的安全、高能量电池（第 6 章）。");

  // ---------------- 21. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：第 17–19 页与 Table 2", { placeholder: "title" });
  const e1 = d.block(s, { x: 0.6, y: 1.35, w: 5.95, kind: "note", tint: true, head: "① Table 2：水系 Li–O₂ / Na–O₂ 的能量密度", body: "按方程式中的无水产物计算：4 LiOH（95.8 g）→ 1119 mAh g⁻¹ × 3.4 V ≈ 3800 Wh kg⁻¹；表中 2172 对应 LiOH·H₂O（167.8 g → 639 mAh g⁻¹）。NaOH 同理：1281 对应 NaOH·H₂O，无水约 1860。表中方程式未写出结晶水。" });
  const e2 = d.block(s, { x: 6.8, y: 1.35, w: 5.95, kind: "note", tint: true, head: "② Table 2：两处拼写", body: "“pillar[5] quinine”应为 pillar[5]quinone（醌；奎宁 quinine 是药物）；“PAN@Li₁.₄All₀.₄Ge₁.₆(PO₄)₃”中的 All 应为 Al。" });
  const e3 = d.block(s, { x: 6.8, y: e2 + 0.25, w: 5.95, kind: "note", tint: true, head: "③ 第 17 页与 Table 2：格式", body: "“30-KWh battery pack” 应为 kWh；“Li2MnO3LiNixMnyCozO2”应写作复合物 Li₂MnO₃·LiMO₂（中间缺“·”）。" });
  d.block(s, { x: 0.6, y: Math.max(e1, e3) + 0.35, w: 12.15, kind: "def", tint: true, head: "核算：其余数值", body: "我们按“理论容量 × 电压”复算了 Table 2 的 Li–S、Na–S、K–S、Li₂O₂、Na₂O₂、NaO₂、KO₂、Li–CO₂、Na–CO₂ 各值，均与原文一致；第 17 页 500 Wh kg⁻¹ 的 SSE 面密度（< 2 mg cm⁻²）也复算一致。Zn–空气的 1218 Wh kg⁻¹ 未能用常规算法（按 ZnO 约 1090，按 Zn 约 1360）复现，原文未说明计算基准。" });
  s.addNotes("校注①是理解数值的关键：金属–空气电池的能量密度很依赖“算不算产物里的水和氧”。以 LiOH·H2O 为基准，相当于把放电产物的全部质量计入。读其他文献的金属–空气数据时，也要先看清计算基准。");

  // ---------------- 22. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.55, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["已商业化：高温 Na–S、PEO 聚合物电池、LiPON 薄膜", "共同点：避开了室温大电池的难题"],
    ["500 Wh kg⁻¹：薄 Li + 每层 < 2 mg cm⁻² 的 SSE", "聚合物 < 20 μm，陶瓷只有 5–11 μm"],
    ["三类高能体系", "富镍 / 富锂（双极堆叠）；金属–S 与有机（固 → 固）；金属–空气 / CO₂（开放体系不漏液）"],
    ["展望：复合、多相、缓冲层", "多相界面传输待研究；安全靠预测；薄而强；化学·几何·力学·电化学·界面传输五维兼顾"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.55 + i * 1.0;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.52, h: 0.52, fill: { color: C.accent1 }, color: C.background1, fontSize: 17, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.45, y, w: 11.2, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.45, y: y + 0.42, w: 11.2, h: 0.4, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Through comprehensive considerations of chemical, geometric, mechanical, electrochemical and interfacial transport features, more advanced solid-state energy-storage or energy-conversion systems can be expected in the future.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "通过综合考虑化学、几何、力学、电化学和界面传输特征，未来可以期待更先进的固态储能或能量转换体系。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.7, w: 11.9, h: 1.15, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("这是原文的最后一句话，也是全书六章的落脚点。建议回看第 4 章的失效清单和第 5 章的策略：五个维度里的每一项，都能在前面找到对应的失效模式和设计手段。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
