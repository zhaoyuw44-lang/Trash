// Lopez et al. 2019 — Chapter 7: 安全设计与结语 (Designing polymers for safety + Conclusion and outlook)
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
  const info = await renderAll(path.join(__dirname, "ch7_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 7, chapterTitle: "安全设计与结语", figDir });
  d.registerFigs(info);
  const C = d.C;

  const concept = (title, fig, figBox, colX, colW, blocks, o = {}) => {
    const s = d.slide("CONTENT");
    s.addText(title, { placeholder: "title" });
    const r = d.fig(s, fig, figBox);
    if (o.caption) d.caption(s, o.caption, { x: figBox.x + 0.1, y: r.y + r.h + 0.05, w: figBox.w - 0.1 });
    if (blocks) d.column(s, colX, o.colY || 1.35, colW, blocks, o.gap);
    if (o.quote) d.quote(s, o.quote);
    if (o.extra) o.extra(s);
    if (o.notes) s.addNotes(o.notes);
    return s;
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 7 章\n高分子怎样让电池更安全？", { placeholder: "title" });
  s.addText("安全设计：熔断隔膜 · 温度开关 · 阻燃高分子；以及全文结语与展望", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 0.9, w: 4.3, h: 5.8 });
  s.addNotes("本章对应原文 “Designing polymers for safety”（第 14–16 页，含 Fig. 8）和 “Conclusion and outlook”（第 16 页）。前半讲高分子怎样通过热响应和不燃来提高安全性；后半把全文七章串起来，并看原文提出的挑战和方向。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "热失控与熔断隔膜", "正反馈的连锁反应；PP/PE/PP 三层闭孔"],
    ["2", "温度开关", "内置 PTC 复合物、渗流、LCST 电解质"],
    ["3", "阻燃高分子", "成炭、灭自由基、不燃；四个例子"],
    ["4", "全文结语与展望", "七章怎么连起来；三大挑战与新方向"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.5, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.3, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.3, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("与前几章的衔接", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  d.block(s, { x: 7.5, y: 2.05, w: 5.25, kind: "def", head: "第 1 章", body: "PE/PP 隔膜受热会熔化闭孔；Li 枝晶刺穿隔膜会引发短路和热失控。" });
  d.block(s, { x: 7.5, y: 3.35, w: 5.25, kind: "def", head: "第 6 章", body: "界面不稳定会不断放热、消耗电解液；SEI 分解正是热失控的第一步。" });
  d.block(s, { x: 7.5, y: 4.65, w: 5.25, kind: "def", head: "这一章", body: "不再追求“更好用”，而是“出事时能刹车”，最后回顾全文。" });
  s.addNotes("原文的观点：高分子提高安全性主要靠两条路——热响应性质（熔化、热膨胀、相分离）和本身不燃。这两条路都能用前几章的高分子设计原理来实现。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：事故推动的安全材料", { placeholder: "title" });
  d.fig(s, "safety_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.caption(s, "红：安全事故；青：热响应方案；橙：阻燃方案。时间轴不按比例；“1990s”为年代估计。", { x: 0.6, y: 5.1, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前的安全靠“外挂”：保护电路、外置 PTC 元件。后来把安全做进材料：会熔化的隔膜、内置温度开关、不燃电解质。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.95, kind: "matters", tint: true, body: "电池存的能量越多，失控时的后果越严重：既危及使用者，也造成巨大经济损失。" });
  s.addNotes("这些事故原文没有逐一列举，原文只引用了一篇安全综述（Liu 等，Sci. Adv. 2018）并指出“即使用今天的技术，灾难性失效仍然常见”。2014、2016、2017 年的三项材料工作都是原文引用的文献。");

  // ---------------- 4. Section ----------------
  d.section("1 热失控与隔膜");
  s = d.slide("DARK_SECTION");
  s.addText("热失控与熔断隔膜", { placeholder: "title" });
  s.addText("越热反应越快、越快越热：高分子要在这条正反馈链上“踩刹车”", { placeholder: "body" });

  // ---------------- 5. Thermal runaway ----------------
  concept("热失控：一条越烧越旺的正反馈链", "runaway", { x: 0.5, y: 1.2, w: 6.8, h: 4.35 }, 7.6, 5.15, [
    { kind: "hist", body: "2006 年 Sony 笔记本电池召回、2013 年波音 787 电池起火停飞、2016 年三星 Galaxy Note 7 召回，一再提醒：能量越高，失控后果越严重。" },
    { kind: "why", body: "以前主要靠外部保护电路和外置 PTC 元件。但热失控发展很快，外部器件常来不及反应，所以要让高分子在电池内部承担安全功能。" },
    { kind: "matters", body: "Si、Li 金属、S 电池能量更高；Li 金属还会长枝晶刺穿隔膜（第 1 章）。安全是所有体系的共同要求。" },
  ], {
    caption: "温度为典型值，随体系不同（非原文数据）；PE、PP 熔点据原文",
    quote: { en: "Unacceptable, catastrophic failure of batteries is common even with today’s technology.", zh: "即使用今天的技术，令人无法接受的灾难性电池失效仍然常见。" },
    notes: "热失控（thermal runaway）：放热反应让温度升高，温度升高又让反应更快、放热更多，形成正反馈。原文提到两种最主要的热响应性质：熔化和热膨胀，后面逐一讲。",
  });

  // ---------------- 6. Chain packing ----------------
  concept("熔点从哪里来？链越规整，越难熔", "chain_packing", { x: 0.5, y: 1.2, w: 6.9, h: 4.3 }, 7.75, 5.0, [
    { kind: "hist", body: "1933 年 ICI 的 Fawcett 与 Gibson 在高压下意外得到聚乙烯；1953 年 Ziegler 用催化剂在低压下得到线形 HDPE；1954 年 Natta 合成等规聚丙烯，二人获 1963 年诺贝尔化学奖。" },
    { kind: "why", body: "原文：熔点可以靠增强主链间相互作用，或让链更容易结晶来提高，比如降低链柔性、提高对称性、减少支化。" },
    { kind: "matters", body: "隔膜在哪个温度“熔断”，由分子结构决定。这是分子设计直接变成安全功能的例子。" },
  ], {
    caption: "LDPE、HDPE 熔点为常见近似值（非原文数据）",
    notes: "原文说热响应性质可以通过改变单体化学或高分子结构来控制。支链像“毛刺”，让链没法整齐地排成晶体，所以低密度聚乙烯熔点低；线形链能折叠成片晶，熔点高。等规 PP 的甲基都排在同一侧，规整度高，熔点更高。",
  });

  // ---------------- 7. Tri-layer separator ----------------
  concept("PP/PE/PP 三层隔膜：先关断，再撑住", "trilayer", { x: 0.5, y: 1.2, w: 6.9, h: 4.3 }, 7.75, 5.0, [
    { kind: "hist", body: "1970 年代起 Celgard 的单向拉伸 PP 微孔膜用于电池（第 1 章）；后来出现 PP/PE/PP 三层复合的闭孔隔膜，成为常用结构。" },
    { kind: "why", body: "三层分工：中间 PE（≈ 130 °C）先熔化堵孔，切断 Li⁺ 通路，电流停止；外层 PP（≈ 165 °C）仍然撑住，正负极不接触。" },
    { kind: "matters", body: "局限：闭孔不可逆，电池报废；若温度继续超过 165 °C，PP 也熔化，反而短路。" },
  ], {
    caption: "据原文 Fig. 8a 重绘",
    extra: (s) => d.block(s, { x: 0.6, y: 6.0, w: 12.15, kind: "def", tint: true, head: "闭孔 Shutdown", body: "隔膜的微孔被熔化的高分子堵死，离子过不去，电池内部“断路”。" }),
    notes: "注意正常工作时隔膜本来就挡电子、只放行 Li⁺；闭孔后连 Li⁺ 也过不去；PP 熔化后隔膜失去完整性，正负极直接接触，电子和离子都能通过，即内部短路。",
  });

  // ---------------- 8. High-thermal-stability separators ----------------
  s = d.slide("CONTENT");
  s.addText("高热稳定隔膜：高温下也不让正负极碰到", { placeholder: "title" });
  const r8 = d.fig(s, "sep_polymers", { x: 0.5, y: 1.15, w: 12.3, h: 2.4 });
  d.caption(s, "据原文 Fig. 8b 改绘（以文字描述结构特征）", { x: 0.6, y: r8.y + r8.h + 0.04, w: 12.1 });
  s.addChart(d.pres.charts.BAR, [{ name: "耐受温度", labels: ["PE", "PP", "PBT", "纤维素", "聚酰亚胺"], values: [130, 165, 225, 300, 400] }], {
    x: 0.5, y: 3.85, w: 6.3, h: 3.0, barDir: "col",
    chartColors: [HEX.accent6, HEX.accent6, HEX.accent1, HEX.accent2, HEX.accent3],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 470,
    showTitle: true, title: "失效温度量级（°C）：PE/PP/PBT 为熔点，后两者为分解", titleFontSize: 12, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.column(s, 7.1, 3.9, 5.65, [
    { kind: "hist", body: "2012–2013 年 Orendorff 等做出聚酯隔膜；2014 年 Zhang 等用纤维素复合隔膜；2016 年 Lin、Cui 等合成聚酰亚胺隔膜。" },
    { kind: "why", body: "芳环、刚性主链、强氢键 → 熔点高，甚至不熔。" },
    { kind: "matters", body: "把“关断”和“防短路”分开，弥补 PP 在 165 °C 熔化的弱点。" },
  ], 0.12);
  s.addNotes("柱状图数值为量级参考，非原文数据：PBT 熔点约 225 °C；纤维素和聚酰亚胺加热不熔化，而是在约 300 °C 和 400 °C 以上才明显分解。这类隔膜自己不会闭孔，所以常和其他关断机制配合使用。聚酰亚胺薄膜（如 DuPont 的 Kapton）1960 年代就已商品化。");

  // ---------------- 9. Section ----------------
  d.section("2 温度开关");
  s = d.slide("DARK_SECTION");
  s.addText("温度开关", { placeholder: "title" });
  s.addText("热膨胀与相分离：让电池热了自动“断电”，冷了自动恢复", { placeholder: "body" });

  // ---------------- 10. PTC composite ----------------
  concept("内置 PTC 复合物：可逆的“保险丝”", "ptc_switch", { x: 0.5, y: 1.2, w: 6.9, h: 4.6 }, 7.75, 5.0, [
    { kind: "hist", body: "商用电池早已外接 PTC 电阻（原文）。2016 年 Chen、Bao 等把 PE 与石墨烯包覆的 Ni 微粒复合，直接涂在集流体上。" },
    { kind: "why", body: "外置元件离热源远、反应慢。内置开关紧贴电极：受热时 PE 膨胀，Ni 颗粒被拉开，电子通路断开。" },
    { kind: "matters", body: "关断温度 50–100 °C 可调；冷却后电池恢复工作。" },
  ], {
    caption: "据原文 Fig. 8c 重绘（原图改编自 Chen 等，2016）",
    notes: "PTC：电阻的正温度系数，温度升高电阻急剧增大（见本章校注）。石墨烯包覆让 Ni 颗粒既导电又不易被氧化。开关放在集流体和负极之间，切断的是电子通路，所以电池整体停止工作。",
  });

  // ---------------- 11. Percolation ----------------
  concept("渗流：为什么一膨胀就“断电”？", "percolation", { x: 0.5, y: 1.2, w: 6.3, h: 4.4 }, 7.2, 5.55, [
    { kind: "hist", body: "1957 年 Broadbent 与 Hammersley 提出渗流理论。1962 年 Simha 与 Boyer 发现高分子热膨胀系数与 Tg 的普适关系（原文引用）。" },
    { kind: "why", body: "两个旋钮：Ni 颗粒越少，越接近阈值，稍一膨胀就断开（关断早）；基体热膨胀系数越大，越敏感。原文：热膨胀系数随无定形比例增大、随 Tg 升高而减小。" },
    { kind: "matters", body: "阈值附近电导率会变化好几个数量级，所以开关又快又干脆。" },
  ], {
    caption: "示意图（非原文插图）",
    extra: (s) => d.block(s, { x: 0.6, y: 6.0, w: 12.15, kind: "def", tint: true, head: "渗流阈值 Percolation threshold", body: "导电颗粒刚好能连成一条贯穿通路时的含量。低于它不导电，高于它导电。" }),
    notes: "可以把导电颗粒想成河里的踏脚石：石头足够密，人就能一步步走过去（导电）；河面一变宽（高分子膨胀），石头间距变大，路就断了（绝缘）。这就是原文 Fig. 8c 中“颗粒少 → 关断早”的原因。",
  });

  // ---------------- 12. LCST ----------------
  concept("LCST 电解质：热了就“分家”", "lcst", { x: 0.5, y: 1.2, w: 6.9, h: 4.3 }, 7.75, 5.0, [
    { kind: "hist", body: "1968 年 Heskins 与 Guillet 报道聚 N-异丙基丙烯酰胺水溶液约 32 °C 的 LCST。2015 年 Kelly、Roberts 等、2018 年 Shi 等把 LCST 用到电解液中。" },
    { kind: "why", body: "ΔG = ΔH − TΔS。混合熵 ΔS < 0 时，温度越高，−TΔS 越大，混合越不利，于是分相：高分子析出成绝缘相，或让电解液凝胶化，电导率下降。" },
    { kind: "matters", body: "但电池不会完全停下。所以原文认为目前熔化和热膨胀方案更好。" },
  ], {
    caption: "示意相图：LCST 是两相区的最低点",
    quote: { en: "Despite these efforts, taking advantage of the phase separation of thermoresponsive polymers does not result in complete cessation of battery operation.", zh: "尽管做了这些努力，利用热响应高分子的相分离并不能让电池完全停止工作。" },
    notes: "LCST（lower critical solution temperature，最低临界溶解温度）：高于它就会分相。两个例子：离子液体中的聚甲基丙烯酸苄酯，以及水溶液中的甲基纤维素。与之相对的 UCST 体系是升温才互溶。",
  });

  // ---------------- 13. Comparison ----------------
  s = d.slide("CONTENT");
  s.addText("几种热响应方案对比", { placeholder: "title" });
  const r13 = d.fig(s, "compare", { x: 0.5, y: 1.2, w: 12.3, h: 4.0 });
  d.caption(s, "据原文第 14–16 页内容整理", { x: 0.6, y: r13.y + r13.h + 0.05, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.6, w: 3.9, kind: "hist", tint: true, size: 14, body: "外置 PTC、闭孔隔膜早已商用；内置 PTC 复合物（2016）较新。" });
  d.block(s, { x: 4.72, y: 5.6, w: 3.9, kind: "why", tint: true, size: 14, body: "从一道“熔断”保险，变成几道分温度段的防线。" });
  d.block(s, { x: 8.84, y: 5.6, w: 3.9, kind: "matters", tint: true, size: 14, body: "可逆的内置开关 + 不熔的隔膜 + 不燃的电解质。" });
  s.addNotes("原文对 LCST 电解质的评价：不能完全停止电池，因此目前更倾向热膨胀或熔化方案。可逆性很重要：熔化闭孔是一次性的，电池随即报废；PTC 复合物冷却后能恢复工作。");

  // ---------------- 14. Section ----------------
  d.section("3 阻燃高分子");
  s = d.slide("DARK_SECTION");
  s.addText("阻燃高分子", { placeholder: "title" });
  s.addText("本综述讨论的大多数高分子都是可燃的：让材料本身不爱烧", { placeholder: "body" });

  // ---------------- 15. FR principles ----------------
  concept("阻燃的三条思路", "fr_principles", { x: 0.5, y: 1.2, w: 6.9, h: 4.4 }, 7.75, 5.0, [
    { kind: "hist", body: "1980 年代初，美国国家标准局（今 NIST）开发出锥形量热仪，成为比较材料燃烧性的标准工具。原文引用了 1991 年用它测试多种塑料的综述。" },
    { kind: "why", body: "原文：耐火高分子一般刚性强、含稠环或高度卤化；芳香性越高越难燃。可惜本综述讨论的大多数高分子都可燃。" },
    { kind: "matters", body: "常用电解液溶剂本身就易燃。高分子既要阻燃，又不能牺牲离子传输和电化学性能。" },
  ], {
    caption: "示意图；三条机理为阻燃化学的通用认识（原文给出结构规律）",
    notes: "成炭：受热时在表面形成一层炭，把下面的材料与热和氧隔开。气相灭自由基：燃烧是自由基链反应，卤素或含磷碎片能捕捉 H·、OH· 等关键自由基，让链反应断掉。高度氟化：C–F 键很强，材料本身难以燃烧，但也带来盐溶解度等问题。",
  });

  // ---------------- 16. FR examples ----------------
  concept("四个阻燃例子（原文 Fig. 8d）", "fr_examples", { x: 0.5, y: 1.2, w: 6.6, h: 4.05 }, 7.45, 5.3, [
    { kind: "hist", body: "2014 年 Wong 等：PFPE 电解液；2017 年 Liu、Cui 等：核壳纤维隔膜；2018 年 Stalin、Archer 等：含磷交联凝胶；2018 年 Zhou 等：APP 粘结剂。" },
    { kind: "why", body: "以前把阻燃剂直接加进电解液，会损害电化学性能。现在：把阻燃基团接到高分子主链上，或包在壳里、受热才释放。" },
    { kind: "matters", body: "原文：目前还难以兼顾阻燃与性能，但没有原理上的障碍。" },
  ], {
    caption: "TPP：磷酸三苯酯；APP：聚磷酸铵",
    quote: { en: "At present, it is difficult to incorporate flame-retardant moieties into electrolyte or binder materials without sacrificing performance, but there is no fundamental limitation preventing the development of flame-retardant polymers based on the principles described in earlier sections.", zh: "目前还很难在不牺牲性能的前提下把阻燃基团引入电解质或粘结剂，但按照前文的原理开发阻燃高分子并没有根本性的限制。" },
    notes: "交联凝胶的妙处：阻燃的磷酸酯基团被“拴”在高分子骨架上，不会跑到电极表面去干扰反应；即使凝胶吸满了易燃的液体电解液，整体仍完全阻燃。核壳纤维：PVDF–HFP 外壳熔化时才把里面的 TPP 放出来，平时不影响电池。",
  });

  // ---------------- 17. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本节的三处细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 12.15, kind: "note", tint: true, head: "① 第 15 页正文与 Fig. 8 图注：PTC 的含义", body: "原文把 PTC 写成 “positive thermal expansion coefficient”（正热膨胀系数）。在电池和电路中，PTC 的通行含义是 positive temperature coefficient（电阻的正温度系数）：温度升高，电阻急剧增大。热膨胀是实现 PTC 效应的机理；Fig. 8c 中的 “Higher / Lower PTC” 实际指高分子基体的热膨胀系数。" });
  d.block(s, { x: 0.6, y: 3.45, w: 5.9, kind: "note", tint: true, head: "② 第 15 页：LCST 的热力学", body: "原文：LCST “owing to a negative entropy of mixing”。完整的说法是混合焓和混合熵都为负（如高分子与溶剂形成氢键）：低温时 ΔH 占优而互溶，升温后 −TΔS 占优才分相。" });
  d.block(s, { x: 6.85, y: 3.45, w: 5.9, kind: "note", tint: true, head: "③ 第 15 页：Celgard 隔膜", body: "原文：“The widely used Celgard separator contains a tri-layer structure”。Celgard 也生产单层 PP、单层 PE 隔膜，三层 PP/PE/PP 只是其中一类。" });
  s.addNotes("第 ① 条最容易造成误解：如果只记住“正热膨胀系数”，会以为 PTC 指的是材料性质而不是器件的电阻特性。读其他文献时看到 PTC，一般都指电阻随温度上升。");

  // ---------------- 18. Section: Conclusion ----------------
  d.section("4 全文结语与展望");
  s = d.slide("DARK_SECTION");
  s.addText("全文结语与展望", { placeholder: "title" });
  s.addText("七章分开讲，真实的材料却必须一次把所有性质调好", { placeholder: "body" });

  // ---------------- 19. Integration ----------------
  concept("把七章连起来：一个高分子，多项性质", "integration", { x: 0.5, y: 1.2, w: 6.6, h: 4.4 }, 7.45, 5.3, [
    { kind: "hist", body: "本综述 2019 年 4 月发表，作者来自 Stanford 的鲍哲南（Bao，化工与高分子）和崔屹（Cui，材料与电化学）课题组，本身就是“高分子 × 电化学”交叉的例子。" },
    { kind: "why", body: "分章是为了讲清楚，真实材料却要同时满足多项要求。例：好的 Si 粘结剂 = 力学（第 2 章）+ 离子传输（第 3 章）+ 氢键（第 5 章）。" },
    { kind: "matters", body: "设计新高分子时，先列出全部要求，再找出彼此冲突的地方（如导离子与力学强度）。" },
  ], {
    quote: { en: "These concepts were discussed separately, but in reality, advanced polymer materials used in high-performance devices require fine control of all these properties.", zh: "这些概念是分开讨论的，但实际上，高性能器件中的先进高分子材料需要对所有这些性质进行精细调控。" },
    notes: "原文结语对聚合物电解质的总结：要获得高离子电导，需要同时考虑结晶度、Tg、高分子对 Li⁺ 的配位，以及溶剂化位点之间的连通性（第 3 章）。",
  });

  // ---------------- 20. Three systems ----------------
  s = d.slide("CONTENT");
  s.addText("三种体系的“期末成绩单”", { placeholder: "title" });
  const r20 = d.fig(s, "systems", { x: 0.5, y: 1.2, w: 12.3, h: 3.3 });
  d.caption(s, "据原文 “Conclusion and outlook” 第一段整理", { x: 0.6, y: r20.y + r20.h + 0.05, w: 12.1 });
  d.block(s, { x: 0.6, y: 4.95, w: 5.9, kind: "why", tint: true, body: "Si 走在最前：从纳米化到“便宜的微米 Si + 好粘结剂”。Li 金属最难：力学、界面、离子传输缺一不可。" });
  d.block(s, { x: 6.85, y: 4.95, w: 5.9, kind: "matters", tint: true, body: "对所有体系，安全都是大问题（本章前半）。聚合物电解质则贯穿 Li 金属和 S 两条线。" });
  s.addNotes("原文对 Li 金属的评价最保守：理想材料应具备的性质“还没有被完全理解”。对 S 正极，原文的结论是导电高分子提高倍率性能，强结合高分子捕获可溶的多硫化物；但两者如何在一个材料里兼得仍是挑战（第 5 章的“三件事”）。");

  // ---------------- 21. Outlook ----------------
  s = d.slide("CONTENT");
  s.addText("展望：三大挑战与四个灵感来源", { placeholder: "title" });
  d.fig(s, "outlook", { x: 1.3, y: 1.15, w: 10.7, h: 3.65 });
  d.block(s, { x: 0.6, y: 4.95, w: 6.0, kind: "hist", tint: true, body: "原文引用的灵感文献：2014 年可回收热固性树脂；2017 年贻贝仿生的铁–儿茶酚弹性体、序列编码的多肽色素；2018 年精确磺化聚乙烯、靠非共价交联的易修复高分子。" });
  d.column(s, 6.9, 4.95, 5.85, [
    { kind: "why", body: "以前多是借用现成的商品高分子；将来要像设计药物一样精确设计序列和次级作用。" },
    { kind: "matters", body: "可回收与仿生也关系到电池的大规模、可持续使用。" },
  ], 0.12);
  s.addNotes("三大挑战原文原话：室温下快速的 Li⁺ 传输、进一步稳定高容量电极、提高面向高电压正极材料的电化学稳定性。序列控制：像蛋白质那样精确规定每个单体的位置。次级相互作用：氢键、金属–配体配位等非共价作用（第 2、5 章已多次出现）。");

  // ---------------- 22. Whole-paper recap ----------------
  d.section("5 全文回顾");
  s = d.slide("CONTENT");
  s.addText("全文回顾：七章一页看完", { placeholder: "title" });
  const chaps = [
    ["1", "引言与先进电池体系", "Si、Li、S 容量高但各有病根；高分子无处不在", C.text2],
    ["2", "力学", "弹性 + 动态键 + 粘住表面；Li 金属不只看模量", C.accent3],
    ["3", "离子传输", "离子跟着链段走：低 Tg、无定形、迁移数 t+ 要高", C.accent2],
    ["4", "电子传输", "共轭主链定能级，侧链调作用；导电粘结剂", C.accent1],
    ["5", "化学相互作用", "N/O/S 抓多硫化物；氢键粘住 Si", "A67C00"],
    ["6", "稳定界面", "SEI 常是高分子；涂层要高介电 + 低表面能", C.accent6],
    ["7", "安全", "熔化、膨胀、相分离、阻燃；以及展望", C.accent4],
  ];
  chaps.forEach(([n, h, b, col], i) => {
    const row = i < 4 ? 0 : 1;
    const x = row === 0 ? 0.6 + i * 3.06 : 0.6 + (i - 4) * 3.06;
    const y = 1.35 + row * 2.05;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.9, h: 1.85, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: x + 0.18, y: y + 0.18, w: 0.5, h: 0.5, fill: { color: col }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: x + 0.8, y: y + 0.16, w: 2.0, h: 0.55, fontSize: 16, bold: true, color: col, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: x + 0.18, y: y + 0.82, w: 2.6, h: 0.95, fontSize: 14, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6 + 3 * 3.06, y: 3.4, w: 2.9, h: 1.85, rectRadius: 0.1, fill: { color: C.text1 }, line: { color: HEX.dk1 } });
  s.addText([
    { text: "一句话", options: { fontSize: 16, bold: true, color: "F6C58E", breakLine: true } },
    { text: "把力学、传输、化学、界面和安全一次设计进同一个高分子。", options: { fontSize: 14, color: "FFFFFF" } },
  ], { x: 0.6 + 3 * 3.06 + 0.18, y: 3.5, w: 2.6, h: 1.65, margin: 0, valign: "middle", isTextBox: true });
  d.quote(s, { y: 5.65, en: "Although new polymer materials will not single-handedly solve the challenges of next-generation energy technologies, they will certainly continue to have a key role moving forward.", zh: "新的高分子材料虽不能单枪匹马解决下一代能源技术的难题，但必将继续发挥关键作用。" });
  s.addNotes("这一页可以当作整门课的复习提纲：每章一句话。建议回到各章的小结页对照，确认每句话背后的例子和数据。");

  // ---------------- 23. Cheat sheet ----------------
  s = d.slide("CONTENT");
  s.addText("设计速查表：问题 → 旋钮 → 例子", { placeholder: "title" });
  const r23 = d.fig(s, "cheatsheet", { x: 0.5, y: 1.15, w: 12.3, h: 5.2 });
  d.caption(s, "据原文各节与 Table 1 整理", { x: 0.6, y: r23.y + r23.h + 0.05, w: 12.1 });
  s.addNotes("用法：遇到一个新的电池问题，先找它属于哪一行，再看可以调哪些分子“旋钮”。很多问题会跨好几行，比如 Li 金属同时涉及力学、离子传输和界面三行，这正是它最难的原因。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章与全文小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["热失控是正反馈：要在电池内部“刹车”", "PP/PE/PP 隔膜：PE ≈ 130 °C 闭孔，PP ≈ 165 °C 后短路；高热稳定隔膜防短路"],
    ["温度开关：膨胀比相分离更可靠", "PE/Ni 复合物 50–100 °C 可逆关断（渗流）；LCST 电解质只能“减速”，不能完全关停"],
    ["阻燃：刚性、稠环、芳香、卤化、含磷", "把阻燃基团接到主链上，或包起来按需释放；兼顾性能仍是难题"],
    ["全文：一个高分子要同时调好七章的性质", "挑战：室温快离子传输、稳定高容量电极、耐高电压；灵感：序列控制、次级作用、可回收、仿生"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“In order to continue to develop innovative solutions to present and future energy storage problems, research at the interface of polymer science and electrochemistry is crucial.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "要为现在和未来的储能问题不断找到创新方案，高分子科学与电化学的交叉研究至关重要。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
