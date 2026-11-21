// Lopez et al. 2019 — Chapter 1: 引言与先进电池体系
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Lopez et al., Nat. Rev. Mater. 2019",
  full: "Lopez, Mackanic, Cui & Bao. Designing polymers for advanced battery chemistries. Nature Reviews Materials (2019). doi:10.1038/s41578-019-0103-6",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch1_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 1, chapterTitle: "引言与先进电池体系", figDir });
  d.registerFigs(info);
  const C = d.C;

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 1 章\n为什么电池需要高分子？", { placeholder: "title" });
  s.addText("引言与三种先进电池体系：硅负极 · 锂金属负极 · 硫正极", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文开头到“Designing binder and separator mechanics”之前（第 1–3 页，含 Fig. 1、Fig. 2、Table 1）。目标：搞清电池的基本结构、高分子在电池里的位置、如何比较电池，以及 Si、Li 金属、S 三种新体系各自的难题。");

  // ---------------- 2. Roadmap + reading key ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "电池长什么样", "正极、负极、隔膜、电解质"],
    ["2", "高分子藏在哪里", "隔膜、粘结剂、电解质、包装"],
    ["3", "怎么比较电池", "比容量 × 电压 = 能量"],
    ["4", "三种“下一代”电池", "Si、Li 金属、S 的优点和病根"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.0, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("每个概念页的阅读标签", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  const keys = [
    ["hist", "历史 History", "哪一年、谁、做了什么"],
    ["why", "以前 → 为什么", "之前怎么做，为什么改成现在这样"],
    ["matters", "为什么重要", "这个概念在后面会派上什么用场"],
    ["quote", "原文金句", "原文的精彩句子，附中文翻译"],
  ];
  keys.forEach(([k, h, b], i) => {
    const y = 2.1 + i * 1.12;
    d.chip(s, 7.5, y + 0.05, k, 0.62);
    s.addText(h, { x: 8.35, y, w: 4.4, h: 0.4, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 8.35, y: y + 0.4, w: 4.4, h: 0.38, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });

  // ---------------- 3. Cell anatomy ----------------
  d.section("1 电池与高分子");
  s = d.slide("CONTENT");
  s.addText("电池的四个基本部件", { placeholder: "title" });
  d.fig(s, "cell_anatomy", { x: 0.5, y: 1.3, w: 6.9, h: 5.55 });
  d.column(s, 7.75, 1.4, 5.0, [
    { kind: "hist", body: "1800 年，Volta 把锌片、铜片和浸了盐水的布片一层层叠成“电堆”：两个电极，中间用电解质隔开。这个三明治结构一直用到今天。" },
    { kind: "why", body: "以前：一次电池用完就扔。现在：锂离子电池让 Li⁺ 在两极之间来回移动（“摇椅电池” rocking-chair），所以能反复充电。" },
    { kind: "matters", body: "记住分工：Li⁺ 在内部穿过电解质，电子走外电路。后面每一种高分子方案，都是在改进这四个部件中的某一个。" },
  ]);
  s.addNotes("放电时：负极里的 Li 失去电子变成 Li⁺，Li⁺ 穿过电解质和隔膜到正极；电子从外电路经过用电器到正极。充电时方向相反。隔膜只让离子过、不让电子过，否则电子会在电池内部直接“抄近路”，即短路。");

  // ---------------- 4. Battery timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从伏打电堆到锂离子电池", { placeholder: "title" });
  d.fig(s, "battery_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 4.15 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前：Whittingham 用锂金属作负极 → 枝晶短路、起火。后来吉野彰换成碳负极，Li 以离子形式嵌进碳层，安全得多，但也牺牲了容量。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "本综述关注的 Si、Li 金属和 S，本质上都是想把当年“牺牲”掉的容量找回来。" });
  d.caption(s, "注：2019 年诺贝尔化学奖在本文发表（2019 年 4 月）之后颁发，原文未提及。", { x: 6.8, y: 6.62, w: 5.9 });
  s.addNotes("时间轴不按比例。Whittingham（1976，Exxon）：Li/TiS2 可充电池；Goodenough（1980）：LiCoO2 正极，把电压提到约 4 V；吉野彰（1985）：用碳负极配 LiCoO2，做出现代锂离子电池原型；Sony（1991）首次商业化。");

  // ---------------- 5. Polymer roles ----------------
  s = d.slide("CONTENT");
  s.addText("高分子在电池里的四种角色", { placeholder: "title" });
  d.fig(s, "polymer_roles", { x: 0.5, y: 1.25, w: 7.0, h: 4.5 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: "从 1991 年锂离子电池商业化开始，PVDF 粘结剂和聚烯烃（PE/PP）隔膜就是标准配置。" },
    { kind: "why", body: "以前：高分子是“配角”，只要求便宜、稳定、不碍事。现在：Si、Li、S 的问题更难，高分子开始被专门设计来主动解决问题。" },
    { kind: "matters", body: "电池产量增长很快，成本和加工性很关键：新高分子最好原料便宜、容易合成、能用环保无毒的溶剂加工。" },
  ]);
  d.quote(s, { y: 5.95, en: "Polymer materials are ubiquitous in these energy storage devices and are commonly used as binders, electrolytes, separators and package coatings.", zh: "高分子材料在储能器件中无处不在，常被用作粘结剂、电解质、隔膜和封装涂层。" });

  // ---------------- 6. Separator ----------------
  s = d.slide("CONTENT");
  s.addText("隔膜 Separator：通离子、绝电子", { placeholder: "title" });
  d.fig(s, "separator", { x: 0.5, y: 1.25, w: 7.1, h: 4.55 });
  d.column(s, 7.85, 1.35, 4.9, [
    { kind: "hist", body: "上世纪 60–70 年代，Celanese 公司用“干法拉伸”做出微孔聚丙烯膜（Celgard），后来成为锂电隔膜的主流路线之一。" },
    { kind: "why", body: "以前：铅酸电池用木片、橡胶、纸做隔板。改用 PE/PP 的原因：耐有机电解液，能做到几十微米薄，能连续拉伸成孔，受热还会熔化闭孔（第 7 章）。" },
    { kind: "matters", body: "隔膜一破，正负极直接接触就会短路。它是电池安全的第一道防线。" },
  ]);
  d.quote(s, { y: 6.0, en: "Separators with pore sizes of ~30–100 nm are commonly made from uniaxially stretched polyethylene or polypropylene.", zh: "孔径约 30–100 nm 的隔膜，通常由单向拉伸的聚乙烯或聚丙烯制成。" });

  // ---------------- 7. Binder & composite electrode ----------------
  s = d.slide("CONTENT");
  s.addText("粘结剂 Binder 与复合电极", { placeholder: "title" });
  d.fig(s, "composite_electrode", { x: 0.5, y: 1.25, w: 7.1, h: 4.55 });
  d.column(s, 7.85, 1.35, 4.9, [
    { kind: "hist", body: "1938 年 Plunkett 意外发现 PTFE（特氟龙），早期电极常用它当粘结剂。PVDF 在 1960 年代商品化，后来成了锂电电极的标准粘结剂。" },
    { kind: "why", body: "以前用 PTFE：它几乎不溶于任何溶剂，很难配成浆料。改用 PVDF：能溶于 NMP，配成浆料一刮就是均匀薄层。NMP 有毒，所以负极多已改用水性的 CMC/SBR。" },
    { kind: "matters", body: "粘结剂只占电极的几个百分点，却决定电极会不会“散架”。对体积变化巨大的 Si 尤其关键（第 2、5 章）。" },
  ]);
  d.quote(s, { y: 6.08, en: "New polymer materials should ideally be easy to synthesize from inexpensive reagents and processable in environmentally friendly and non-toxic solvents.", zh: "理想的新高分子应能用廉价原料轻松合成，并能在环保、无毒的溶剂中加工。" });

  // ---------------- 8. Specific capacity ----------------
  d.section("2 怎么比较电池");
  s = d.slide("CONTENT");
  s.addText("比较电极材料①：比容量 Specific capacity", { placeholder: "title" });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.35, w: 6.2, h: 2.0, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
  s.addText([
    { text: "Q = n · F / (3.6 · M)", options: { fontSize: 30, bold: true, color: C.accent1, breakLine: true } },
    { text: "单位 mAh g⁻¹。n：每个单元转移的电子（Li）数；F = 96485 C mol⁻¹；M：摩尔质量；3.6：1 mAh = 3.6 C", options: { fontSize: 14, color: C.text2 } },
  ], { x: 0.85, y: 1.45, w: 5.8, h: 1.8, margin: 0, valign: "middle", isTextBox: true });
  s.addText([
    { text: "算一算：石墨 LiC₆  ", options: { bold: true, color: C.text1 } },
    { text: "n = 1，M = 6 × 12.01 = 72.06 → Q = 96485 ÷ (3.6 × 72.06) ≈ 372 mAh g⁻¹", options: { color: C.text1 } },
  ], { x: 0.6, y: 3.5, w: 6.2, h: 0.65, fontSize: 14, margin: 0, valign: "top", isTextBox: true });
  d.column(s, 0.6, 4.3, 6.2, [
    { kind: "hist", body: "1833–34 年，Faraday 提出电解定律：通过的电量与反应物的量成正比。常数 F 以他的名字命名。" },
    { kind: "why", body: "用 mAh 而不用库仑：电池按“电流 × 时间”来用和标称。按质量来比：手机和电动车最在乎重量。" },
  ], 0.18);
  s.addChart(d.pres.charts.BAR, [{ name: "理论比容量", labels: ["LiCoO₂", "石墨", "硫 S", "硅 Si", "锂 Li"], values: [274, 372, 1672, 3579, 3861] }], {
    x: 7.2, y: 1.3, w: 5.6, h: 3.75, barDir: "bar",
    chartColors: [HEX.accent6, HEX.dk1, HEX.accent5, HEX.accent6, HEX.accent3],
    invertedColors: [HEX.accent6],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 4600,
    showTitle: true, title: "理论比容量（mAh g⁻¹）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.block(s, { x: 7.2, y: 5.2, w: 5.6, kind: "matters", body: "比容量是新材料的“入场券”：Si 约为石墨的 10 倍，所以大家愿意忍受它的种种缺点。" });
  s.addNotes("LiCoO2 的理论值 274 按每个 LiCoO2 脱出 1 个 Li 计算；实际只能可逆脱出约一半。S 按 S → Li2S 每个 S 接 2 个电子计算（1672）。原文给的是约 1700 和约 250（金属氧化物实际值）。");

  // ---------------- 9. Voltage & energy ----------------
  s = d.slide("CONTENT");
  s.addText("比较电极材料②：电压与能量", { placeholder: "title" });
  const vf = d.fig(s, "voltage_ladder", { x: 0.5, y: 1.25, w: 5.6, h: 5.25 });
  d.caption(s, "原文 “−3.04 V versus the standard hydrogen electron” 中 electron 应为 electrode（笔误）。", { x: 0.6, y: 6.55, w: 5.6 });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 6.5, y: 1.35, w: 6.25, h: 1.0, rectRadius: 0.1, fill: { color: "FDF2E7" }, line: { color: "FDF2E7" } });
  s.addText([
    { text: "能量 = 容量 × 电压", options: { fontSize: 24, bold: true, color: C.accent1 } },
    { text: "    Wh = Ah × V", options: { fontSize: 16, color: C.text2 } },
  ], { x: 6.75, y: 1.35, w: 5.9, h: 1.0, margin: 0, valign: "middle", isTextBox: true });
  d.column(s, 6.5, 2.6, 6.25, [
    { kind: "hist", body: "1889 年，Nernst 写出了电极电势与浓度的关系（Nernst 方程）。电化学约定把标准氢电极（SHE）定为 0 V。" },
    { kind: "why", body: "以前电位都相对 SHE 来报。锂电研究改用 “vs Li/Li⁺”：电池里实际的参比就是锂，读数能直接对应电池电压。两种标尺相差 3.04 V。" },
    { kind: "matters", body: "Li 的电位最低（−3.04 V vs SHE），所以用它作负极时电压最高、能量最大。这是 Li 金属被叫作“终极负极”的原因。" },
  ]);

  // ---------------- 10. Section divider ----------------
  d.section("3 三种先进电池体系");
  s = d.slide("DARK_SECTION");
  s.addText("三种先进电池化学", { placeholder: "title" });
  s.addText("硅负极 Si  ·  锂金属负极 Li metal  ·  硫正极 S：容量更高，但各有各的“病根”", { placeholder: "body" });

  // ---------------- 11. Si anode ----------------
  s = d.slide("CONTENT");
  s.addText("硅负极：容量大，但会“膨胀开裂”", { placeholder: "title" });
  d.fig(s, "si_failure", { x: 0.5, y: 1.25, w: 7.7, h: 4.05 });
  d.stat(s, { x: 8.6, y: 1.25, w: 2.2, value: "≈10×", label: "比容量是石墨的约 10 倍（3579 vs 372）", color: "accent3" });
  d.stat(s, { x: 10.85, y: 1.25, w: 1.9, value: "≈4×", label: "嵌锂后体积约变为原来的 4 倍", color: "accent4" });
  d.fig(s, "si_size", { x: 8.6, y: 2.75, w: 4.15, h: 2.05 });
  d.caption(s, "颗粒小于约 150 nm 时不再开裂（Liu 等，2012）", { x: 8.6, y: 4.85, w: 4.15 });
  d.block(s, { x: 0.6, y: 5.45, w: 7.6, kind: "matters", tint: true, body: "Si 的毛病本质上是力学问题：膨胀、开裂、失去接触。所以高分子粘结剂能帮上忙（第 2、4、5 章）。" });
  d.block(s, { x: 8.6, y: 5.45, w: 4.15, kind: "note", tint: true, size: 12, body: "3579 mAh g⁻¹ 对应 Li₁₅Si₄（Li₃.₇₅Si）。原文写 Li₃.₆Si，应为笔误（Li₃.₆Si 约 3435）。" });
  s.addNotes("两种失效机理（原文）：一是裂纹暴露新鲜表面，电解液在上面分解、SEI 不断生长；二是部分 Si 与电极其余部分失去电接触，无法再参与循环。Panasonic 已在石墨负极中掺入少量 Si，但 Si 还不能成为活性物质的主体。");

  // ---------------- 12. Si history & strategies ----------------
  s = d.slide("CONTENT");
  s.addText("历史：硅负极是怎么一步步被“驯服”的", { placeholder: "title" });
  d.fig(s, "si_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.block(s, { x: 0.6, y: 5.3, w: 6.6, kind: "why", tint: true, body: "以前：把 Si 做到纳米级（小于约 150 nm 就不裂）。问题：纳米 Si 太贵。于是转向：给 Si 包碳壳，或者改进高分子粘结剂，目标是直接用便宜的微米 Si。" });
  d.quote(s, { x: 7.45, y: 5.3, w: 5.3, en: "Nanosized Si can be 1–2 orders of magnitude more expensive than larger micrometre-sized particles.", zh: "纳米硅可能比微米硅贵 1–2 个数量级。" });
  s.addNotes("时间轴不按比例。灰色：基础认识；紫色：纳米化与包覆；青色：高分子粘结剂（本综述作者 Bao、Cui 组的工作占了不少）。");

  // ---------------- 13. SEI ----------------
  s = d.slide("CONTENT");
  s.addText("固体电解质界面膜 SEI", { placeholder: "title" });
  d.fig(s, "sei", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "理想的 SEI：薄 · 电子绝缘 · 离子导通 · 机械上不易开裂", { x: 0.6, y: 5.95, w: 6.8, h: 0.35 }, { size: 13 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: "1979 年 Peled 提出 SEI 模型并命名。1990 年 Fong、von Sacken 与 Dahn 发现 EC 溶剂能在石墨上生成稳定的 SEI，石墨负极从此真正可用。" },
    { kind: "why", body: "以前认为电解液必须和电极“完全不反应”。后来的认识：低电位下电解液必然分解，只要分解产物形成一层只通 Li⁺、不通电子的薄膜，反应就会自己停下来。" },
    { kind: "matters", body: "Si（开裂后不断长新 SEI）和 Li 金属（SEI 破裂引发枝晶）的失效都绕不开 SEI。第 6 章讲用高分子做“人工 SEI”。" },
  ]);

  // ---------------- 14. Li metal ----------------
  s = d.slide("CONTENT");
  s.addText("锂金属负极：“终极负极”，却难了四十年", { placeholder: "title" });
  d.stat(s, { x: 0.6, y: 1.3, w: 3.9, value: "3860", unit: "mAh g⁻¹", label: "所有负极中比容量最高", color: "accent3" });
  d.stat(s, { x: 4.7, y: 1.3, w: 3.9, value: "−3.04", unit: "V vs SHE", label: "电位最低，电池电压最高", color: "accent3" });
  d.stat(s, { x: 8.8, y: 1.3, w: 3.9, value: "40+", unit: "年", label: "可充电锂金属电池至今仍未真正普及", color: "accent4" });
  d.column(s, 0.6, 3.0, 6.0, [
    { kind: "hist", body: "1970 年代 Whittingham（Exxon）做出 Li/TiS₂ 可充电池。1980 年代末 Moli Energy 推出 Li/MoS₂ 商品电池，1989 年前后因起火事故召回，产业随后转向碳负极。" },
  ]);
  d.column(s, 6.85, 3.0, 5.9, [
    { kind: "why", body: "以前（1970–80 年代）直接用 Li 金属，因为枝晶和低效率导致起火而放弃。现在又回来：电动车需要更高能量，而且有了新的电解质和高分子工具。" },
  ]);
  d.fig(s, "graphite_host", { x: 0.6, y: 4.35, w: 2.3, h: 1.45 });
  s.addText([
    { text: "石墨：Li⁺ 嵌进碳层之间", options: { bold: true, fontSize: 15, color: C.text1, breakLine: true } },
    { text: "有“宿主” host，体积只变约 10%", options: { fontSize: 14, color: C.text2, breakLine: true } },
    { text: "代价：容量只有 372\u00A0mAh\u00A0g⁻¹", options: { fontSize: 14, color: C.text2 } },
  ], { x: 3.1, y: 4.35, w: 3.0, h: 1.45, margin: 0, valign: "middle", isTextBox: true });
  s.addText("vs", { x: 6.15, y: 4.75, w: 0.5, h: 0.6, fontSize: 22, bold: true, color: "7A8794", align: "center", margin: 0, isTextBox: true });
  d.fig(s, "li_hostless", { x: 6.75, y: 4.35, w: 2.05, h: 1.45 });
  s.addText([
    { text: "锂金属：Li 直接长在表面", options: { bold: true, fontSize: 15, color: C.accent3, breakLine: true } },
    { text: "没有宿主，体积变化很大，SEI 一撑就裂", options: { fontSize: 14, color: C.text2, breakLine: true } },
    { text: "回报：3860\u00A0mAh\u00A0g⁻¹", options: { fontSize: 14, color: C.text2 } },
  ], { x: 9.0, y: 4.35, w: 3.75, h: 1.45, margin: 0, valign: "middle", isTextBox: true });
  d.quote(s, { en: "Li metal offers the highest theoretical energy density … but successful application has eluded researchers for more than four decades owing to poor Coulombic efficiency and safety issues.", zh: "Li 金属的理论能量密度最高……但由于库仑效率低和安全问题，四十多年来研究者一直未能把它成功用起来。" });

  // ---------------- 15. Dendrites ----------------
  s = d.slide("CONTENT");
  s.addText("枝晶 Dendrite 与死锂 Dead Li", { placeholder: "title" });
  d.fig(s, "dendrite", { x: 0.5, y: 1.25, w: 7.4, h: 4.6 });
  d.column(s, 8.1, 1.35, 4.65, [
    { kind: "hist", body: "1997 年，Aurbach 等用原位原子力显微镜（in situ AFM）实时观察 Li 的沉积形貌，把枝晶生长和表面膜（SEI）的破裂联系了起来。" },
    { kind: "why", body: "以前的对策是调电解液：提高盐浓度、增加含氟成分、加添加剂。本综述的思路：用高分子电解质或涂层，从力学和界面两方面压住枝晶（第 2、3、6 章）。" },
    { kind: "matters", body: "枝晶同时损害容量（变成死锂）和安全（短路、热失控）。" },
  ]);
  d.caption(s, "示意据原文 Fig. 2b 重绘", { x: 0.6, y: 5.95, w: 7.0 });

  // ---------------- 16. Coulombic efficiency ----------------
  s = d.slide("CONTENT");
  s.addText("库仑效率 Coulombic efficiency：99% 为什么还不够", { placeholder: "title" });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.35, w: 5.6, h: 1.25, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
  s.addText([
    { text: "CE = 放出的电量 ÷ 充入的电量", options: { fontSize: 20, bold: true, color: C.accent3, breakLine: true } },
    { text: "每圈都有 (1 − CE) 的 Li 变成死锂或被 SEI 消耗，而且会逐圈累积", options: { fontSize: 14, color: C.text2 } },
  ], { x: 0.85, y: 1.4, w: 5.2, h: 1.15, margin: 0, valign: "middle", isTextBox: true });
  d.column(s, 0.6, 2.85, 5.6, [
    { kind: "hist", body: "CE 的概念来自法拉第定律：理想情况下进出的电量相等。2018 年 Adams、Zhang 等提出了测量 Li 金属 CE 的标准方法，因为不同测法得到的结果差别很大。" },
    { kind: "why", body: "石墨负极的 CE 通常高于 99.9%。Li 金属每圈都在重新沉积、重新长 SEI，损失会像复利一样累积，所以必须单独严格衡量。" },
  ]);
  const cyc = Array.from({ length: 11 }, (_, i) => i * 20);
  const ser = (ce) => cyc.map((n) => Math.round(Math.pow(ce, n) * 1000) / 10);
  s.addChart(d.pres.charts.LINE, [
    { name: "CE 99.9%", labels: cyc.map(String), values: ser(0.999) },
    { name: "CE 99.5%", labels: cyc.map(String), values: ser(0.995) },
    { name: "CE 99%", labels: cyc.map(String), values: ser(0.99) },
    { name: "CE 98%", labels: cyc.map(String), values: ser(0.98) },
  ], {
    x: 6.5, y: 1.3, w: 6.3, h: 4.05,
    chartColors: [HEX.accent2, HEX.accent1, HEX.accent3, HEX.accent4], lineSize: 3, lineDataSymbol: "none",
    showTitle: true, title: "没有多余 Li 时，剩余容量（%）随循环圈数", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valAxisMaxVal: 100, valAxisMinVal: 0, valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "循环圈数", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.block(s, { x: 6.5, y: 5.45, w: 6.25, kind: "matters", tint: true, body: "CE = 99% 时，100 圈后只剩约 37%；99.9% 时还剩约 90%。CE 是评价 Li 金属方案（包括第 6 章的高分子涂层）最直接的指标。" });

  // ---------------- 17. Sulfur cathode ----------------
  s = d.slide("CONTENT");
  s.addText("硫正极：便宜、容量高，但会“溶解”", { placeholder: "title" });
  d.stat(s, { x: 0.6, y: 1.3, w: 2.9, value: "~1700", unit: "mAh g⁻¹", label: "S → Li₂S 的理论比容量", color: "accent5" });
  d.stat(s, { x: 3.6, y: 1.3, w: 2.6, value: "~250", unit: "mAh g⁻¹", label: "现有金属氧化物正极", color: "accent6" });
  d.stat(s, { x: 0.6, y: 2.85, w: 2.9, value: "≈7×", label: "约为金属氧化物的 7 倍", color: "accent1" });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 3.6, y: 2.95, w: 2.6, h: 1.05, rectRadius: 0.1, fill: { color: "FBF4DC" }, line: { color: "FBF4DC" } });
  s.addText("S₈ + 16 Li ⇄ 8 Li₂S", { x: 3.6, y: 2.95, w: 2.6, h: 1.05, fontSize: 17, bold: true, color: C.text1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  d.block(s, { x: 0.6, y: 4.4, w: 5.6, kind: "matters", tint: true, body: "S 的两大毛病正好对应后面两章：导电性差 → 第 4 章导电高分子；中间产物会溶解 → 第 5 章用高分子“抓住”多硫化物。" });
  d.column(s, 6.6, 1.35, 6.15, [
    { kind: "hist", body: "1962 年，Herbert 与 Ulam 获得了以硫为正极的电池专利。2009 年，Ji、Lee 与 Nazar 把硫灌进有序介孔碳 CMK-3，锂硫电池研究再次升温。" },
    { kind: "why", body: "以前的正极（1980 年的 LiCoO₂、1997 年的 LiFePO₄）是“嵌入型”：一个很重的过渡金属单元只能放约 1 个 Li。S 走的是“转化反应”：每个很轻的 S 原子能接 2 个 Li，所以容量高得多。" },
    { kind: "def", head: "顺带一提", body: "S 储量大、价格低，是石油精炼的副产品。" },
  ]);

  // ---------------- 18. Polysulfide shuttle ----------------
  s = d.slide("CONTENT");
  s.addText("多硫化物穿梭 Polysulfide shuttle", { placeholder: "title" });
  d.fig(s, "polysulfide", { x: 0.5, y: 1.25, w: 7.4, h: 3.95 });
  d.block(s, { x: 0.6, y: 5.35, w: 3.55, kind: "def", head: "自放电 Self-discharge", size: 13, body: "Li₂Sₓ 扩散到 Li 负极并被还原，电池放着不用容量也会变少。" });
  d.block(s, { x: 4.35, y: 5.35, w: 3.55, kind: "def", head: "穿梭 Charge shuttling", size: 13, body: "充电时 Li₂Sₓ 在负极被还原，回到正极再被氧化，循环往复，CE 变低。" });
  d.column(s, 8.15, 1.35, 4.6, [
    { kind: "hist", body: "2004 年，Mikhaylik 与 Akridge 定量研究了多硫化物“穿梭”，并给出了描述它的模型。" },
    { kind: "why", body: "以前：只用导电碳负载硫，靠孔道把多硫化物“物理困住”。后来加上化学“抓手”：N 掺杂碳，以及含 N、O、S 基团的高分子，能化学吸住 Li₂Sₓ。" },
    { kind: "matters", body: "S 太绝缘，需要大量导电碳，结果拖低了能量密度。所以高分子既要导电，又要能抓住多硫化物。" },
  ]);

  // ---------------- 19. Energy map ----------------
  s = d.slide("CONTENT");
  s.addText("一张图看潜力：质量能量密度 vs 体积能量密度", { placeholder: "title" });
  d.fig(s, "energy_map", { x: 0.5, y: 1.2, w: 6.4, h: 5.25 });
  d.caption(s, "据原文 Fig. 2d 重绘，位置为数量级示意。汽油为燃烧热值，没有计入发动机效率。", { x: 0.6, y: 6.5, w: 6.3, h: 0.4 });
  d.column(s, 7.25, 1.35, 5.5, [
    { kind: "hist", body: "1968 年，Ragone 在比较电动车电池时，用双对数坐标同时画出比能量和比功率，这就是“Ragone 图”。" },
    { kind: "why", body: "这张图不是标准的 Ragone 图：它比的是“每千克”和“每升”各能存多少能量。用两个指标，是因为电动车怕重（Wh kg⁻¹），手机怕占地方（Wh L⁻¹）。" },
    { kind: "matters", body: "Si、Li 金属、S 都落在锂离子电池的右上方。这片空间正是本综述想用高分子去“解锁”的。" },
  ]);

  // ---------------- 20. Chapter map ----------------
  d.section("4 本综述地图");
  s = d.slide("CONTENT");
  s.addText("本综述地图：问题 → 高分子方案 → 章节", { placeholder: "title" });
  d.fig(s, "chapter_map", { x: 0.5, y: 1.2, w: 12.3, h: 4.75 });
  d.quote(s, { y: 6.0, en: "This Review serves as an introduction to the fundamental materials requirements for advanced battery chemistries and the central concepts related to polymer design for these applications.", zh: "本综述介绍先进电池化学对材料的基本要求，以及相关的高分子设计核心概念。", ref: "据原文 Table 1 整理" });

  // ---------------- 21. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文的两处小笔误", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.45, w: 5.9, kind: "note", tint: true, head: "① 第 1 页：Si 的化学式", body: "原文：“3,579 mAh g⁻¹ for Li₃.₆Si”。\n3579 对应的是 Li₁₅Si₄（即 Li₃.₇₅Si）：3.75 × 96485 ÷ (3.6 × 28.09) ≈ 3579。\n按 Li₃.₆Si 计算只有约 3435。" });
  d.block(s, { x: 6.85, y: 1.45, w: 5.9, kind: "note", tint: true, head: "② 第 2 页：参比电极", body: "原文：“−3.04 V versus the standard hydrogen electron”。\n应为 standard hydrogen electrode（标准氢电极，SHE）。" });
  d.block(s, { x: 0.6, y: 4.4, w: 12.15, kind: "def", tint: true, head: "补充：读 Fig. 2d 时注意", body: "汽油的点用的是燃烧热值。内燃机只能把约 30% 的热变成机械功，而电池到车轮的效率高得多，所以“电池离汽油差多远”实际没有图上看起来那么远。" });

  // ---------------- 22. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["电池 = 正极 + 负极 + 隔膜 + 电解质", "高分子出现在活性物质以外的几乎所有地方：隔膜、粘结剂、电解质、包装"],
    ["比容量 Q = nF / 3.6M；能量 = 容量 × 电压", "Si ≈ 10× 石墨；Li 金属容量最高、电位最低；S ≈ 7× 氧化物正极"],
    ["三种病根", "Si：膨胀开裂、SEI 反复生长；Li：枝晶、死锂、低 CE；S：多硫化物溶解与穿梭"],
    ["接下来 6 章", "力学 → 离子传输 → 电子传输 → 化学相互作用 → 稳定界面 → 安全"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“There is a significant opportunity for innovation in polymer science and engineering to help solve longstanding problems.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "高分子科学与工程大有可为，可以帮助解决这些长期悬而未决的难题。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.05, w: 11.9, h: 0.85, margin: 0, valign: "middle", isTextBox: true });

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
