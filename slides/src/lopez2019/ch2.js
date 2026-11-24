// Lopez et al. 2019 — Chapter 2: 粘结剂与隔膜的力学设计
const path = require("path");
const { Deck, HEX } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME } = require("../decklib");

const PAPER = {
  short: "Lopez et al., Nat. Rev. Mater. 2019",
  full: "Lopez, Mackanic, Cui & Bao. Designing polymers for advanced battery chemistries. Nature Reviews Materials (2019). doi:10.1038/s41578-019-0103-6",
};

// shared native-chart styling (same as chapter 1)
const AX = {
  catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2,
  catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
  titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
  legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
  catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2, valAxisTitleFontSize: 12, valAxisTitleColor: HEX.dk2,
};

// scatter helper: groups = [{name, pts:[[x,y],...]}] -> pptxgenjs scatter data
function scatterData(groups) {
  const xs = [];
  groups.forEach((g) => g.pts.forEach((p) => xs.push(p[0])));
  const data = [{ name: "X", values: xs }];
  let k = 0;
  groups.forEach((g) => {
    const vals = xs.map(() => null);
    g.pts.forEach((p) => (vals[k++] = p[1]));
    data.push({ name: g.name, values: vals });
  });
  return data;
}

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch2_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 2, chapterTitle: "粘结剂与隔膜的力学设计", figDir });
  d.registerFigs(info);
  const C = d.C;

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 2 章\n高分子要多“硬”、多“韧”？", { placeholder: "title" });
  s.addText("粘结剂与隔膜的力学设计：硅负极的弹性 / 自修复粘结剂 · 锂金属的高模量电解质", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  s.addNotes("本章对应原文 “Designing binder and separator mechanics” 一节（第 2–6 页，含 Fig. 3）。先学会用应力–应变曲线描述高分子的力学性能，再看两类应用：Si 负极的粘结剂要能伸缩、会愈合；Li 金属负极的电解质要能压住枝晶。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "读懂应力–应变曲线", "模量、强度、韧性、回弹"],
    ["2", "分子结构决定力学", "分子量、结晶、交联、自修复、黏弹性"],
    ["3", "硅负极的粘结剂", "弹性网络 + 动态键，抓住会膨胀的 Si"],
    ["4", "锂金属：用模量压住枝晶？", "Monroe–Newman 判据及其修正"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.4 + i * 1.12;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.3, h: 0.96, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.18, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.1, w: 5.1, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.52, w: 5.1, h: 0.36, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.block(s, { x: 0.6, y: 5.95, w: 6.3, kind: "def", head: "与第 1 章的衔接", body: "Si 胀缩开裂、Li 枝晶刺穿隔膜，本质上都是力学问题。本章先学力学的“语言”，再看高分子怎么应对。" });
  d.fig(s, "chapter_strip", { x: 7.6, y: 1.35, w: 5.0, h: 5.4 });
  s.addNotes("右侧是整篇综述的 7 章结构，本章是第 2 章。第 3 章会看到：力学和离子电导常常互相矛盾，越硬的高分子离子越难移动。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从硫化橡胶到自修复粘结剂", { placeholder: "title" });
  d.fig(s, "mech_timeline", { x: 0.5, y: 1.2, w: 12.3, h: 3.95 });
  d.block(s, { x: 0.6, y: 5.4, w: 5.9, kind: "why", tint: true, body: "以前：电池里的高分子只求“粘得住、隔得开”。Si 要胀缩约 300%、Li 枝晶会顶破隔膜，人们才把橡胶、凝胶、自修复材料的力学思路搬进电池。" });
  d.block(s, { x: 6.8, y: 5.4, w: 5.9, kind: "matters", tint: true, body: "本章两条主线：Si 粘结剂要能伸缩、会愈合；Li 金属电解质要么足够硬，要么用别的机理压住枝晶。两者都建立在高分子力学概念上。" });
  s.addNotes("时间轴不按比例。灰色：高分子力学的基础；青色：Si 粘结剂；紫色：Li 金属电解质。Goodyear 1839 年发现硫化；Maxwell 1867 年提出黏弹性模型；Staudinger 1920 年提出大分子概念（1953 年获诺贝尔奖）；Leibler 组 2008 年在 Nature 报道氢键自修复橡胶。");

  // ---------------- 4. Section: polymer mechanics ----------------
  d.section("1 高分子力学基础");
  s = d.slide("DARK_SECTION");
  s.addText("高分子力学基础", { placeholder: "title" });
  s.addText("应力–应变曲线 · 分子量与结晶 · 交联 · 自修复 · 黏弹性", { placeholder: "body" });
  s.addNotes("这一节对应原文 “Polymer mechanics” 小节（第 2–3 页）和 Fig. 3a–c。");

  // ---------------- 5. Stress–strain curve ----------------
  s = d.slide("CONTENT");
  s.addText("应力–应变曲线：力学性能的“体检报告”", { placeholder: "title" });
  d.fig(s, "stress_strain", { x: 0.5, y: 1.25, w: 6.6, h: 4.95 });
  d.caption(s, "据原文 Fig. 3a 重绘。紫色 = 回弹能（屈服前）；紫 + 橙 = 韧性（到断裂为止的总面积）。", { x: 0.6, y: 6.3, w: 6.5, h: 0.45 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "def", body: "应力 σ = 力 ÷ 截面积（单位 Pa）；应变 ε = 伸长 ÷ 原长（无单位）。把样条匀速拉长，记录二者的关系，就得到这条曲线。" },
    { kind: "hist", body: "1678 年 Hooke 发表“力与伸长成正比”（ut tensio, sic vis）。1807 年 Thomas Young 用一个常数描述材料的刚度，后人称为杨氏模量 E = σ / ε。" },
    { kind: "why", body: "金属、陶瓷主要看模量和强度。高分子能被拉长好几倍，屈服后还有很长的塑性区，所以还要看“曲线下的面积”。" },
    { kind: "matters", body: "后面比较粘结剂和电解质时说的模量、强度、韧性、回弹，全部从这条曲线上读出来。" },
  ]);
  s.addNotes("曲线先是直线（弹性区，卸载后能完全恢复），过了屈服点斜率变小，材料发生不可逆的塑性形变：分子链之间滑移或转动。最后在断裂点断开。原文用这张图定义了五个指标：模量、拉伸强度、断裂伸长率、韧性和回弹。");

  // ---------------- 6. Metrics: hard vs soft ----------------
  s = d.slide("CONTENT");
  s.addText("模量、强度、韧性、回弹：各说明什么", { placeholder: "title" });
  d.fig(s, "hard_soft", { x: 0.5, y: 1.25, w: 6.3, h: 3.55 });
  d.quote(s, { x: 0.6, y: 4.95, w: 6.2, en: "Soft materials with a longer elongation to break can have a much greater toughness than hard materials with a high modulus.", zh: "断裂伸长率更大的软材料，其韧性可以远高于高模量的硬材料。" });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 7.1, y: 1.3, w: 5.65, h: 1.75, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
  s.addText([
    { text: "杨氏模量 ", options: { bold: true, color: C.accent2 } }, { text: "初始斜率：受力后多“硬”", options: { breakLine: true } },
    { text: "强度 ", options: { bold: true, color: C.accent4 } }, { text: "拉断 / 开始屈服所需的应力", options: { breakLine: true } },
    { text: "韧性 ", options: { bold: true, color: C.accent1 } }, { text: "断裂前吸收的总能量（总面积）", options: { breakLine: true } },
    { text: "回弹 ", options: { bold: true, color: C.accent3 } }, { text: "屈服前储存、能全部还回来的能量", options: {} },
  ], { x: 7.3, y: 1.38, w: 5.35, h: 1.6, fontSize: 15, color: C.text1, margin: 0, valign: "middle", paraSpaceAfter: 3, isTextBox: true });
  d.column(s, 7.1, 3.25, 5.65, [
    { kind: "hist", body: "1921 年 Griffith 指出：断裂本质是能量问题，裂纹扩展要消耗能量。所以衡量“耐不耐坏”要看吸收的能量（韧性），而不只看力。" },
    { kind: "why", body: "以前挑材料常默认“越硬越好”。Si 每圈胀缩约 300%，硬而脆的粘结剂会碎；需要能吸收能量的韧性和能恢复原状的回弹。" },
    { kind: "matters", body: "后面会看到：模量 > 1 GPa 的硬粘结剂反而撑不过 20 圈。" },
  ], 0.18);
  s.addNotes("原文总结：模量描述材料对应变的初始响应；强度是让材料变形或断裂所需的应力；韧性或回弹是让材料断裂或变形所需的能量。回弹（modulus of resilience）与韧性类似，但只算屈服点之前的面积，不含塑性形变。");

  // ---------------- 7. Molecular origins ----------------
  s = d.slide("CONTENT");
  s.addText("宏观力学来自分子：分子量、结晶与交联", { placeholder: "title" });
  d.fig(s, "chain_origin", { x: 0.6, y: 1.2, w: 12.1, h: 3.75 });
  d.block(s, { x: 0.6, y: 5.1, w: 3.9, kind: "hist", tint: true, size: 14, body: "1920 年 Staudinger 提出高分子是共价键连成的长链“大分子”，当时备受质疑；1953 年他因此获诺贝尔化学奖。" });
  d.block(s, { x: 4.7, y: 5.1, w: 3.95, kind: "why", tint: true, size: 14, body: "以前把高分子看成小分子的“胶体团”。明白是长链后，才知道分子量、缠结、结晶和交联决定力学。" });
  d.block(s, { x: 8.85, y: 5.1, w: 3.9, kind: "matters", tint: true, size: 14, body: "这些就是设计的“旋钮”。注意：降低结晶会让力学变差，却有利于离子传输（第 3 章）。" });
  s.addNotes("原文：模量、拉伸强度和断裂伸长率一般随分子量增加而增加；支化或降低结晶度的单体结构会降低这些性能；把链交联成网络可以提高力学稳定性。长链之间相互缠结，像一盘意大利面，越长越难拉开。");

  // ---------------- 8. Crosslinking ----------------
  s = d.slide("CONTENT");
  s.addText("交联 Crosslinking：把链“钉”成一张网", { placeholder: "title" });
  d.fig(s, "crosslink", { x: 0.5, y: 1.25, w: 6.5, h: 4.6 });
  d.caption(s, "据原文 Fig. 3b 重绘", { x: 0.6, y: 5.95, w: 6.3 });
  d.column(s, 7.3, 1.35, 5.45, [
    { kind: "hist", body: "1839 年 Goodyear 把硫加进天然橡胶加热（硫化），橡胶从此遇热不黏、遇冷不脆，这是最早的化学交联。1960 年代出现用苯乙烯硬段作物理交联的热塑性弹性体（如 SBS）。" },
    { kind: "why", body: "化学交联牢固，但成型后不能再加工，坏了也修不好。物理交联（相分离、缠结、氢键）是可逆的：能重新加工，甚至能自己愈合。" },
    { kind: "matters", body: "交联点让网络“记住”原来的形状，这是弹性粘结剂和凝胶电解质的基础。如果交联键是动态的，材料就能自修复（下一页）。" },
  ]);
  s.addNotes("原文 Fig. 3b 把交联分为两类。物理交联：相分离、缠结、氢键；化学交联：共价键、支化单体、动态键。动态共价键介于两者之间：是共价键，但在一定条件下可以断开再连上。");

  // ---------------- 9. Self-healing ----------------
  s = d.slide("CONTENT");
  s.addText("自修复 Self-healing：断了还能“长”回去", { placeholder: "title" });
  d.fig(s, "self_heal", { x: 0.5, y: 1.3, w: 7.1, h: 3.2 });
  d.block(s, { x: 0.6, y: 4.65, w: 7.0, kind: "def", head: "常见的动态交联", body: "氢键 · 金属–配体作用 · 可逆共价键（如动态脲键）。它们比普通共价键弱，受力时先断，从而保护主链。" });
  d.quote(s, { x: 0.6, y: 5.85, w: 7.0, en: "If the bonding used to crosslink this network structure is dynamic, polymer systems can assume self-healing properties.", zh: "如果用来交联网络的键是动态的，高分子体系就能具有自修复性能。" });
  d.column(s, 7.95, 1.35, 4.8, [
    { kind: "hist", body: "2001 年 White 等用埋在材料里的“微胶囊”修复剂做出第一种自修复高分子；2008 年 Leibler 组用氢键做出自修复橡胶；2012 年 Bao 组做出自修复电子皮肤，2013 年用于 Si 粘结剂。" },
    { kind: "why", body: "以前材料一开裂就只能报废。改用可逆键交联后，断面重新接触，键就能跨界面重新形成。" },
    { kind: "matters", body: "Si 每圈都在胀缩，粘结剂里的微裂纹难以避免。会愈合的粘结剂可以一圈圈修复损伤。" },
  ]);
  s.addNotes("原文的描述：自修复高分子断裂时，断裂处的动态交联（氢键、金属–配体作用或可逆共价键）先断开；把断面重新接触，断开的键跨过界面重新形成，材料就愈合了。");

  // ---------------- 10. Viscoelasticity ----------------
  s = d.slide("CONTENT");
  s.addText("黏弹性：慢拉像液体，快拉像固体", { placeholder: "title" });
  const freqs = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];
  const tau = 0.2, G0 = 3e6;
  const Gp = freqs.map((k) => { const wt = Math.pow(10, k) * tau; return Math.round((G0 * wt * wt) / (1 + wt * wt)); });
  const Gpp = freqs.map((k) => { const wt = Math.pow(10, k) * tau; return Math.round((G0 * wt) / (1 + wt * wt)); });
  const flabels = ["0.03", "0.1", "0.3", "1", "3", "10", "30", "100", "300"];
  s.addChart(d.pres.charts.LINE, [
    { name: "G′ 储能模量", labels: flabels, values: Gp },
    { name: "G″ 损耗模量", labels: flabels, values: Gpp },
  ], {
    x: 0.5, y: 1.25, w: 6.7, h: 3.65, ...AX,
    chartColors: [HEX.accent1, HEX.dk2], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 7,
    valAxisLogScaleBase: 10, valAxisMinVal: 10, valAxisMaxVal: 10000000, valAxisLabelFormatCode: "0E+0",
    showTitle: true, title: "频率扫描示意（单一 Maxwell 模型，τ = 0.2 s）",
    showLegend: true, legendPos: "b",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "角频率 ω（rad s⁻¹）", showValAxisTitle: true, valAxisTitle: "模量（Pa）",
  });
  d.caption(s, "仿原文 Fig. 3c：低频 G″ > G′（像液体），高频 G′ > G″（像固体），交点 ω ≈ 1/τ。", { x: 0.6, y: 4.95, w: 6.6, h: 0.4 });
  d.quote(s, { x: 0.6, y: 5.45, w: 6.6, en: "over long timescales (low frequencies), some polymer materials can flow like liquids, whereas at short timescales, they behave like solids.", zh: "在长时间尺度（低频）下，有些高分子会像液体一样流动；而在短时间尺度下，它们表现得像固体。" });
  d.column(s, 7.5, 1.35, 5.25, [
    { kind: "def", body: "G′（储能模量）：像弹簧，储存后能还回来的部分。G″（损耗模量）：像阻尼器，变成热耗掉的部分。" },
    { kind: "hist", body: "1867 年 Maxwell 用“弹簧串联阻尼器”描述既弹又黏的材料。1950–60 年代 Ferry 等系统建立了高分子黏弹性理论（1955 年 WLF 方程，第 3 章还会用到）。" },
    { kind: "why", body: "一个模量不够用：高分子松弛时间分布很宽，同一材料慢拉会流动、快拉会回弹，所以要按频率（或时间、温度）扫描。" },
    { kind: "matters", body: "电池一次充放电要几小时，属于“慢”过程。快速测试中看着很硬的材料，长期受力可能慢慢蠕变、流动。" },
  ], 0.18);
  s.addNotes("左图是用最简单的 Maxwell 模型算出来的示意曲线：G′ = G₀(ωτ)²/[1+(ωτ)²]，G″ = G₀ωτ/[1+(ωτ)²]。真实高分子有很多个松弛时间，曲线更平缓。原文说这种黏弹行为只简单提及，但设计高分子时必须考虑。");

  // ---------------- 11. Section: Si binders ----------------
  d.section("2 硅负极粘结剂");
  s = d.slide("DARK_SECTION");
  s.addText("硅负极：弹性与自修复粘结剂", { placeholder: "title" });
  s.addText("PVDF 为什么不行 → 弹性网络 → 超分子动态键 → 与“石墨烯笼”比一比", { placeholder: "body" });
  s.addNotes("对应原文 “Elastic and self-healing binders to prolong Si cycle life” 小节（第 3–5 页）和 Fig. 3d、3e。");

  // ---------------- 12. PVDF vs PAA ----------------
  s = d.slide("CONTENT");
  s.addText("PVDF 为什么“抓不住”硅", { placeholder: "title" });
  d.fig(s, "pvdf_paa", { x: 0.5, y: 1.25, w: 6.7, h: 4.45 });
  d.caption(s, "示意。Si 表面通常有一层带 –OH 的氧化层 SiOₓ；虚线 = 氢键，实线 = 加热后形成的酯键。", { x: 0.6, y: 5.8, w: 6.6, h: 0.45 });
  d.column(s, 7.5, 1.35, 5.25, [
    { kind: "hist", body: "PVDF 自锂电商业化起就是标准粘结剂。2007 年 Li、Lewis 与 Dahn 报道 CMC，2010 年 Magasinski 等报道 PAA，2011 年 Kovalenko 等报道海藻酸钠（Science），都明显优于 PVDF。" },
    { kind: "why", body: "PVDF 脆，而且只靠弱的范德华力“搭”在 Si 上，Si 一胀就脱开。PAA、CMC、海藻酸钠带大量 –COOH / –OH，能和 Si 表面的 –OH 形成氢键，加热后还能成酯键。" },
    { kind: "matters", body: "粘结剂首先要“抓得住”Si：力学再好，界面一脱开就白搭。化学相互作用详见第 5 章。" },
  ]);
  s.addNotes("原文：PVDF 传统上用作复合电极粘结剂，但它脆、对 Si 粘附差，促使人们寻找替代材料。碳水化合物（多糖）和其他含羟基的高分子被证明是更好的粘结剂，随后又对它们进行交联以进一步提高循环稳定性。");

  // ---------------- 13. High modulus is not enough ----------------
  s = d.slide("CONTENT");
  s.addText("理想粘结剂：光“硬”还不够", { placeholder: "title" });
  d.stat(s, { x: 0.6, y: 1.25, w: 2.8, value: "> 1", unit: "GPa", label: "聚酰亚胺粘结剂的模量", color: "accent6" });
  d.stat(s, { x: 3.5, y: 1.25, w: 3.0, value: "20", unit: "圈", label: "容量就只剩 80%", color: "accent4" });
  d.column(s, 0.6, 2.75, 5.9, [
    { kind: "hist", body: "2013 年 Kim 等用模量超过 1 GPa 的聚酰亚胺作 Si 电极粘结剂，结果只循环 20 圈容量就降到初始的 80%。" },
    { kind: "why", body: "以前以为粘结剂越硬越能“箍住”Si。现在有两条路：弹性网络可逆地吸收应变；动态键不断适应变化、修复裂纹。" },
    { kind: "matters", body: "理想粘结剂要同时做到：粘住 Si、导电碳和集流体；电化学稳定；离子电导高；在巨大体积变化下保持电极完整。" },
  ], 0.18);
  d.fig(s, "binder_routes", { x: 6.85, y: 1.25, w: 5.9, h: 3.95 });
  d.quote(s, { x: 6.85, y: 5.3, w: 5.9, en: "a binder with a high modulus is not enough to prevent capacity fade.", zh: "仅有高模量的粘结剂不足以阻止容量衰减。" });
  s.addNotes("原文强调：合适的力学性能对稳定循环至关重要，但只有高模量是不够的。理想粘结剂应与活性物质、导电碳和集流体都有强粘附，同时具备良好的电化学稳定性和较高的离子电导，并在大体积变化中保持复合电极完整。右图的两条路线正对应原文所说的两种思路。");

  // ---------------- 14. Elastomers ----------------
  s = d.slide("CONTENT");
  s.addText("弹性网络：硬段当“结点”，软段负责伸缩", { placeholder: "title" });
  d.fig(s, "elastomer", { x: 0.5, y: 1.25, w: 6.5, h: 3.65 });
  d.block(s, { x: 0.6, y: 5.05, w: 6.4, kind: "def", head: "两种做法", body: "① 物理交联：硬段（SBR 中的苯乙烯、聚氨酯中的 MDI 二苯基）相分离聚成小区；② 化学交联：用支化单体或带活性侧链的高分子，聚合后以共价键固定网络。" });
  d.column(s, 7.3, 1.35, 5.45, [
    { kind: "hist", body: "1937 年 Otto Bayer 发明聚氨酯；1930 年代德国开发出丁苯橡胶 SBR。2003 年 Dahn 组试过交联 PVDF，2005 年 Liu 等在多糖粘结剂里加入 SBR。" },
    { kind: "why", body: "早期弹性粘结剂（交联 PVDF、SBR）效果不好：它们与 Si 没有相互作用。于是转向带 –OH 的多糖等含羟基高分子，再把它们交联起来。" },
    { kind: "matters", body: "弹性体设计的要点只有一条：交联点要“记住”自己的位置，链被拉长后才能回到原来状态。" },
  ]);
  s.addNotes("原文说弹性体的设计概念上很直接：网络的结点必须“记住”自己的位置，这样应变释放后变形的链才能松弛回原状。SBR 里的苯乙烯、聚氨酯里的二苯基（如 MDI）作为硬段，与容易拉伸的软段发生相分离，形成物理交联。");

  // ---------------- 15. Crosslinked PAA network ----------------
  s = d.slide("CONTENT");
  s.addText("化学交联：PAA–CMC 网络同时“钩住”硅", { placeholder: "title" });
  d.fig(s, "paa_network", { x: 0.5, y: 1.25, w: 6.6, h: 4.45 });
  d.caption(s, "示意，结构据原文 Fig. 3d。PAA = 聚丙烯酸；PVA = 聚乙烯醇；Na-CMC = 羧甲基纤维素钠。", { x: 0.6, y: 5.8, w: 6.5, h: 0.45 });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: "2012 年 Koo 等把 PAA 与 CMC 加热，原位脱水成酯交联（Angew. Chem.）；2014 年 Song 等做出 PAA–PVA 互穿凝胶；之后又有自由基聚合的 CMC–PAA 和聚丙烯酰胺网络。" },
    { kind: "why", body: "线形的 PAA、CMC 会被反复胀缩慢慢“拉开”。原位交联把粘结剂连成一张网，这张网同时与 Si 表面的 –OH 成键。" },
    { kind: "matters", body: "“网络结构 + 与 Si 表面成键”是后面所有高性能粘结剂的共同点。" },
  ]);
  s.addNotes("原文：PAA 基粘结剂与 CMC 或 PVA 的醇羟基进行原位热交联，在复合电极内形成网络结构，其中也包括与羟基封端的 Si 表面成键。原文 Fig. 3d 下排给出了 PAA、PVA 和 Na-CMC 的化学结构。");

  // ---------------- 16. Supramolecular ----------------
  s = d.slide("CONTENT");
  s.addText("超分子作用：可逆的“魔术贴”", { placeholder: "title" });
  d.fig(s, "supramolecular", { x: 0.5, y: 1.25, w: 6.4, h: 4.7 });
  d.caption(s, "①② 据原文 Fig. 3d 重绘；③ Ca²⁺ 桥连两条链上的羧基；④ 环能沿链滑动，分散应力。", { x: 0.6, y: 6.05, w: 6.3, h: 0.45 });
  d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "2013 年 Wang 等（Bao、Cui 组）首次用氢键自修复高分子作 Si 粘结剂；2014 年出现 Ca²⁺ 交联的海藻酸钠；2015 年 Kwon 等用环糊精–金刚烷主客体作用；2017 年 Choi 等用聚轮烷“滑轮”粘结剂（Science）。" },
    { kind: "why", body: "共价交联一旦断开就不会再连。超分子作用较弱但可逆，能在电极里重排、修补裂纹；系统比较发现它们优于共价交联的对照组。" },
    { kind: "matters", body: "2015 年，基于氢键的自修复粘结剂首次让大颗粒 Si 在商业级面载量下实现长循环（Chen 等）。" },
  ]);
  s.addNotes("原文：除共价交联外，非共价的金属离子交联、氢键和主客体作用也被用来延长 Si 电极寿命。这些超分子作用提供了与弹性体不同的可逆性：它们能重排，能修复电极中出现的裂纹。原文引用的系统研究是 Kwon 等 2014 年（Meldrum 酸）的工作。");

  // ---------------- 17. Fig. 3e chart ----------------
  s = d.slide("CONTENT");
  s.addText("比一比：高分子粘结剂 vs 石墨烯笼包覆", { placeholder: "title" });
  s.addChart(d.pres.charts.SCATTER, scatterData([
    { name: "PAA–聚轮烷", pts: [[169, 1.74], [224, 2.67]] },
    { name: "交联 PAA", pts: [[215, 4.24], [255, 2.54]] },
    { name: "石墨烯笼", pts: [[13, 4.44], [74, 2.52], [287, 2.27]] },
    { name: "自修复高分子", pts: [[21, 3.87], [22, 2.94], [240, 1.97]] },
  ]), {
    x: 0.5, y: 1.25, w: 6.9, h: 4.6, ...AX,
    chartColors: [HEX.dk1, HEX.accent1, "7CC08A", "2E86C1"], lineSize: 0, lineDataSymbol: "circle", lineDataSymbolSize: 12,
    showTitle: true, title: "微米级 Si 电极：面容量 vs 循环寿命",
    showLegend: true, legendPos: "b",
    catAxisMinVal: 0, catAxisMaxVal: 300, valAxisMinVal: 1, valAxisMaxVal: 5,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "容量降到 85% 时的循环圈数", showValAxisTitle: true, valAxisTitle: "Si 面容量（mAh cm⁻²）",
  });
  d.caption(s, "据原文 Fig. 3e 读数重绘（近似值）。PAA–聚轮烷 224 圈那一点是外推值（原文献报道 150 圈保持 90%）。", { x: 0.6, y: 5.9, w: 6.8, h: 0.45 });
  d.column(s, 7.7, 1.35, 5.05, [
    { kind: "def", head: "怎么读这张图", body: "越往右越耐用，越往上越接近实用（商业电极约 3 mAh cm⁻² 以上）。右上角最好。" },
    { kind: "hist", body: "数据来自 Chen 2015（自修复）、Choi 2017（聚轮烷）、Xu 2018（交联 PAA）和 Li 2016（石墨烯笼）。2016 年 Lopez 等的流变研究还发现：调交联密度有用，但比不上官能团本身。" },
    { kind: "why", body: "石墨烯笼要靠化学气相沉积在 Si 上“长”碳壳，工艺复杂；粘结剂只是在浆料里换一种高分子。" },
  ], 0.18);
  d.quote(s, { x: 7.7, y: 5.2, w: 5.05, en: "These three state-of-the-art polymer binders all contain network structures and dynamic bonding groups", zh: "这三种最先进的高分子粘结剂都含有网络结构和动态成键基团。" });
  s.addNotes("这张图是本节的“要”：三种高分子粘结剂（自修复、交联 PAA、PAA–聚轮烷）在大颗粒 Si 上的表现与石墨烯笼包覆 Si 相当，而粘结剂路线便宜、容易放大。原文认为网络结构加上既能链间作用、又能与 Si 表面结合的动态基团，可能是稳定高容量 Si 负极的关键。");

  // ---------------- 18. Section: Li metal ----------------
  d.section("3 锂金属与高模量电解质");
  s = d.slide("DARK_SECTION");
  s.addText("锂金属：用模量压住枝晶？", { placeholder: "title" });
  s.addText("Monroe–Newman 判据 → 嵌段共聚物 → 争论与修正：力学不是唯一因素", { placeholder: "body" });
  s.addNotes("对应原文 “High-modulus polymers to control Li-metal dendrites” 小节（第 5–6 页）和 Fig. 3f。");

  // ---------------- 19. Monroe–Newman ----------------
  s = d.slide("CONTENT");
  s.addText("Monroe–Newman 判据：电解质要多硬？", { placeholder: "title" });
  d.fig(s, "monroe_newman", { x: 0.5, y: 1.25, w: 6.4, h: 4.2 });
  d.stat(s, { x: 0.7, y: 5.5, w: 2.9, value: "6", unit: "GPa", label: "预测所需剪切模量", color: "accent3" });
  d.stat(s, { x: 3.8, y: 5.5, w: 3.1, value: "≤ 0.2", unit: "GPa", label: "PEO 的剪切模量", color: "accent2" });
  d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "2003 年 Monroe 与 Newman 先模拟了 Li/聚合物电池中枝晶的生长；2005 年他们分析界面弹性形变对沉积的影响，得出电解质剪切模量约为 Li 的两倍（常引作 6 GPa）时，表面凸起不会被放大。" },
    { kind: "why", body: "液体电解质 + 多孔隔膜挡不住枝晶。这个判据让大家转向“够硬”的固体电解质，想用力学把 Li 表面压平。" },
    { kind: "matters", body: "刚性、取向好的高分子模量够高，但链太僵，离子走不动：力学与离子电导成了一对矛盾（第 3 章）。" },
  ]);
  s.addNotes("原文：PEO 是聚合物电解质最主要的基体材料，但它的剪切模量最多约 200 MPa，与 6 GPa 差了约 30 倍。刚性、取向良好的高分子模量远高于所需值，但链刚性阻碍了离子传导。");

  // ---------------- 20. Block copolymers ----------------
  s = d.slide("CONTENT");
  s.addText("嵌段共聚物 PS-b-PEO：一个“撑”，一个“导”", { placeholder: "title" });
  d.fig(s, "bcp", { x: 0.5, y: 1.25, w: 6.4, h: 4.3 });
  d.stat(s, { x: 0.7, y: 5.55, w: 6.0, value: "< 10⁻⁵", unit: "S cm⁻¹", label: "这些高模量方案的室温离子电导率都没超过这个值", color: "accent4" });
  d.column(s, 7.2, 1.35, 5.55, [
    { kind: "hist", body: "2007 年前后 Balsara 组开始系统研究 PS-b-PEO（SEO）嵌段共聚物电解质；2012 年 Stone 等讨论了它在“模量与粘附”之间的两难；2013 年 Gurevitch 等又加入 TiO₂ 纳米颗粒。" },
    { kind: "why", body: "单一高分子很难既硬又导。嵌段共聚物把两种功能分给两个微相：PS 硬段撑起模量，PEO 段导 Li⁺。也可以把硬高分子与 PEO 共混。" },
    { kind: "matters", body: "室温电导率太低，这类电解质通常要在 60–90 °C 下工作。这正是第 3 章要解决的离子传输问题。" },
  ]);
  s.addNotes("嵌段共聚物（block copolymer）是两种不同的链段首尾相连的高分子。因为两段互不相容，它们会自组装成几十纳米尺度的层状或柱状微相。原文：这些方法都未能使室温离子电导率超过 10⁻⁵ S cm⁻¹。");

  // ---------------- 21. Fig. 3f chart ----------------
  s = d.slide("CONTENT");
  s.addText("数据怎么说：模量越高，就越不容易短路吗？", { placeholder: "title" });
  const lg = (v) => Math.round(Math.log10(v) * 100) / 100;
  s.addChart(d.pres.charts.SCATTER, scatterData([
    { name: "POSS–PEG", pts: [[lg(6.3), 2066], [lg(10), 2380], [lg(32), 2803], [lg(38), 1997]] },
    { name: "交联 PEO", pts: [[lg(0.11), 1839]] },
    { name: "PS-b-PEO", pts: [[lg(1.9), 187], [lg(35), 216], [lg(52), 256]] },
    { name: "PS-b-PEO + TiO₂", pts: [[lg(43), 1800], [lg(43), 1102], [lg(24), 364], [lg(26), 266], [lg(44), 285]] },
    { name: "PEO", pts: [[lg(0.041), 30], [lg(0.39), 10]] },
  ]), {
    x: 0.5, y: 1.25, w: 6.9, h: 4.55, ...AX,
    chartColors: [HEX.dk1, HEX.accent1, "7CC08A", "2E86C1", "A9C8E8"], lineSize: 0, lineDataSymbol: "circle", lineDataSymbolSize: 12,
    showTitle: true, title: "对称 Li|Li 电池：短路前通过的总电量",
    showLegend: true, legendPos: "b",
    catAxisMinVal: -1.5, catAxisMaxVal: 2, valAxisMinVal: 0, valAxisMaxVal: 3000, catAxisCrossesAt: -1.5,
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "log₁₀（储能模量 / MPa）", showValAxisTitle: true, valAxisTitle: "短路前电量（C cm⁻²）",
  });
  d.caption(s, "据原文 Fig. 3f 读数重绘（近似值）。横轴取对数：−1 = 0.1 MPa，0 = 1 MPa，1 = 10 MPa。90 °C，0.17–0.30 mA cm⁻²。", { x: 0.6, y: 5.85, w: 6.8, h: 0.45 });
  d.column(s, 7.7, 1.35, 5.05, [
    { kind: "hist", body: "近几年出现争论：2014 年 Khurana 等的交联 PE/PEO、2015 年 Choudhury 等的交联“毛发状”纳米颗粒，模量都不高，却比商业隔膜更能抑制枝晶。" },
    { kind: "why", body: "注意横轴最大约 50 MPa，离 6 GPa（= 6000 MPa）还差两个数量级；而模量只有约 0.1 MPa 的交联 PEO，表现远好于 30–50 MPa 的 PS-b-PEO。" },
    { kind: "matters", body: "“越硬越好”并不成立。交联结构、界面化学、离子迁移数同样决定枝晶会不会长出来。" },
  ]);
  s.addNotes("纵轴是对称电池（两边都是 Li）反复沉积/剥离时，到短路为止累计通过的电量，越高说明越能抵抗枝晶。图注说“模量更高的电解质能通过更多电量”，但从数据看趋势并不清楚，这一点在校注页还会讨论。");

  // ---------------- 22. Beyond modulus ----------------
  s = d.slide("CONTENT");
  s.addText("修正后的理论：力学不是唯一因素", { placeholder: "title" });
  d.fig(s, "beyond_modulus", { x: 0.5, y: 1.25, w: 6.3, h: 4.25 });
  d.column(s, 7.1, 1.35, 5.65, [
    { kind: "hist", body: "2016 年 Tikekar、Archer 与 Koch 扩展了 Monroe–Newman 分析：提高界面张力 + 中等模量 + 固定少量阴离子，就能稳定沉积。2018 年 Choudhury 等在交联聚环氧丙烷凝胶中发现：孔越小，Li 沉积越致密。" },
    { kind: "why", body: "以前只想用“硬”去顶住枝晶。现在转向从源头控制界面和 Li 的成核，甚至用极软、可流动的高分子涂层（第 6 章）。" },
    { kind: "matters", body: "高迁移数电解质（第 3 章）或高界面张力材料，可以用非力学的机理抑制枝晶。" },
  ], 0.18);
  d.quote(s, { y: 5.75, en: "Overall, it is becoming clear that mechanical properties are not the only factor to be taken into consideration when designing polymer electrolytes for Li-metal batteries.", zh: "总之，越来越清楚的是：设计锂金属电池的聚合物电解质时，力学性能并不是唯一需要考虑的因素。" });
  s.addNotes("扩展理论还指出：Li 沉积中的微小起伏会产生压力，这个压力会驱使离子流离开正在生长的枝晶尖端。原文用线性稳定性分析把典型枝晶尺寸（最不稳定的扰动波长）与凝胶孔径联系起来：在小尺度上，表面张力的作用足以抑制枝晶。");

  // ---------------- 23. Reading notes ----------------
  d.section("阅读校注");
  s = d.slide("CONTENT");
  s.addText("阅读校注：Monroe–Newman 判据与 Fig. 3f", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.95, kind: "note", tint: true, head: "① 第 5 页：“Newman and Monroe predicted…”", body: "参考文献 69 的作者顺序是 Monroe & Newman，通称 Monroe–Newman 判据。该文是界面线性稳定性分析，讨论的是 Li 表面的小凸起会不会被放大（枝晶萌生）；原文说成“阻止枝晶形成后的穿透”，说法偏宽。6 GPa 是常见引述值，约为 Li 剪切模量的两倍。" });
  d.block(s, { x: 6.8, y: 1.4, w: 5.95, kind: "note", tint: true, head: "② 第 5 页 Fig. 3f 图注", body: "图注写 “Electrolytes with a higher modulus enable more total charge to pass”。但横轴是 90 °C 下的储能模量，最大约 50 MPa；约 0.1 MPa 的交联 PEO（≈1840 C cm⁻²）远好于 30–50 MPa 的 PS-b-PEO（< 300 C cm⁻²）。数据里的趋势很弱，反而支持正文后面“力学不是唯一因素”的结论。" });
  d.block(s, { x: 0.6, y: 4.4, w: 12.15, kind: "def", tint: true, head: "补充：两种“模量”别混用", body: "Monroe–Newman 用的是室温下弹性固体的剪切模量 G；Fig. 3f 横轴是流变仪测得的储能模量 G′，在 90 °C 下测量，数值与频率有关。1 GPa = 1000 MPa = 10⁹ Pa。" });
  s.addNotes("这一页不是说原文结论错了，而是提醒读图时注意：判据的数值、测量温度和测量方法都不一样，不能直接把 Fig. 3f 的横轴和 6 GPa 对比来下结论。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["应力–应变曲线读出四个数", "模量（多硬）、强度（多结实）、韧性（断裂前吸收多少能量）、回弹（能还回来多少能量）"],
    ["分子结构决定力学", "分子量、结晶、交联；动态键带来自修复；黏弹性让结果取决于时间和温度"],
    ["Si 粘结剂：网络 + 动态键 + 抓住 Si 表面", "光硬不够；交联 PAA、自修复高分子、聚轮烷已能稳定循环微米级 Si"],
    ["Li 金属：模量不是唯一答案", "Monroe–Newman 要求约 6 GPa；PEO 远达不到；界面张力、固定阴离子和界面化学同样关键"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“ideal mechanics must be combined with the appropriate polymer chemistry for optimal performance.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "理想的力学性能必须与合适的高分子化学结合，才能获得最佳性能。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.85, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("下一章转向离子传输：为了让 Li⁺ 在固体高分子里跑得快，链要柔、要无定形，而这恰好和本章追求的“高模量”相矛盾。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
