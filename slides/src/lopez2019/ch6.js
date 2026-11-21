// Lopez et al. 2019 — Chapter 6: 稳定界面设计 (Polymer design for stable interfaces)
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
  const info = await renderAll(path.join(__dirname, "ch6_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 6, chapterTitle: "稳定界面设计", figDir });
  d.registerFigs(info);
  const C = d.C;

  const concept = (title, fig, figBox, colX, colW, blocks, o = {}) => {
    const s = d.slide("CONTENT");
    s.addText(title, { placeholder: "title" });
    const r = d.fig(s, fig, figBox);
    if (o.caption) d.caption(s, o.caption, { x: figBox.x + 0.1, y: r.y + r.h + 0.05, w: figBox.w - 0.1 });
    d.column(s, colX, o.colY || 1.35, colW, blocks, o.gap);
    if (o.quote) d.quote(s, o.quote);
    if (o.extra) o.extra(s);
    if (o.notes) s.addNotes(o.notes);
    return s;
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 6 章\n怎样让电极–电解质界面“稳”下来？", { placeholder: "title" });
  s.addText("稳定界面设计：SEI、粘结剂参与成膜、锂金属上的高分子涂层", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 0.9, w: 4.3, h: 5.8 });
  s.addNotes("本章对应原文 “Polymer design for stable interfaces” 一节（第 13–14 页，含 Fig. 7）。第 1 章已经介绍了 SEI 是什么；这一章回答：为什么电解液一定会在电极上分解，SEI 怎么被添加剂和粘结剂改变，以及怎样用高分子涂层给锂金属做一层“人工 SEI”。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "界面为什么一定会反应", "能级图与电解液稳定窗口"],
    ["2", "SEI 与成膜添加剂", "碳酸酯 vs 醚；FEC、VC → poly(VC)"],
    ["3", "高分子就在界面上", "粘结剂参与成膜；聚合物电解质的界面"],
    ["4", "锂金属的人工 SEI", "介电常数、表面能与库仑效率"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.5, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.3, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.3, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("与前几章的衔接", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  d.block(s, { x: 7.5, y: 2.05, w: 5.25, kind: "def", head: "第 5 章", body: "设计官能团，与多硫化物、Si 表面发生作用。" });
  d.block(s, { x: 7.5, y: 3.15, w: 5.25, kind: "def", head: "第 1 章", body: "SEI 是电解液分解产物形成的薄膜：理想的 SEI 只通 Li⁺、不通电子。" });
  d.block(s, { x: 7.5, y: 4.5, w: 5.25, kind: "def", head: "这一章", body: "作用对象换成电解液和它的分解产物：用高分子把 SEI “设计”得更好。" });
  s.addNotes("本章几乎所有内容都可以用一句话串起来：界面必然反应 → 反应产物（SEI）的质量决定寿命 → 高分子可以参与甚至取代这层 SEI。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从“被动长出来”到“主动设计”的 SEI", { placeholder: "title" });
  d.fig(s, "sei_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.caption(s, "紫色：SEI 的基本认识；青色：成膜添加剂；灰色：理论与表征；橙色：高分子涂层。时间轴不按比例。", { x: 0.6, y: 5.1, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前把 SEI 当作不可控的副产物；后来用添加剂调控它；现在进一步用高分子直接“预制”界面。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.95, kind: "matters", tint: true, body: "Si 的反复开裂、Li 的枝晶和低库仑效率，归根结底都和 SEI 有关（第 1 章）。" });
  s.addNotes("2017 年冷冻电镜（cryo-EM）第一次在原子尺度看清 Li 金属和它的 SEI，因为常规电镜的电子束会把这些对电子束敏感的材料打坏。原文引用了 2017–2018 年的几篇冷冻电镜工作，说明 SEI 的组成和结构仍是研究热点。");

  // ---------------- 4. Section ----------------
  d.section("1 界面为什么会反应");
  s = d.slide("DARK_SECTION");
  s.addText("界面为什么一定会反应？", { placeholder: "title" });
  s.addText("电极的电子能量常常超出电解液能承受的范围：热力学上不稳定，只能靠 SEI 实现动力学稳定", { placeholder: "body" });

  // ---------------- 5. Energy diagram ----------------
  concept("能级图：电解液的“稳定窗口”", "energy_diagram", { x: 0.5, y: 1.2, w: 7.0, h: 4.3 }, 7.85, 4.9, [
    { kind: "hist", body: "2010 年 Goodenough 与 Kim 用能级图系统讨论了可充锂电池的电解液稳定性。更早的 1979 年，Peled 就指出 Li 表面会自发长出钝化膜。" },
    { kind: "why", body: "以前想找对两极都“完全稳定”的电解液，但做不到。于是接受分解，让分解产物形成钝化膜：热力学不稳定，动力学稳定。" },
    { kind: "matters", body: "电压越高、能量越大，越容易超出窗口。所以界面问题是高能电池绕不开的。" },
  ], {
    caption: "据原文 Fig. 7a 重绘。LUMO / HOMO：电解液的最低未占 / 最高已占分子轨道",
    quote: { en: "Owing to the harsh electrochemical environment of a battery, the electrolyte is generally thermodynamically unstable against one or both of the electrodes.", zh: "由于电池内部严苛的电化学环境，电解液通常对一个或两个电极在热力学上都不稳定。" },
    notes: "读图方法：纵轴是电子能量。负极的电子能量（E_Li）比电解液的 LUMO 还高，电子会“掉”进电解液，把它还原；正极的能量比 HOMO 还低，会把电解液的电子“吸”走，把它氧化。分解产物如果能挡住电子，反应就会自己停下来。原文图中醚类电解液的氧化极限约 4.0 V，碳酸酯约 4.3 V。",
  });

  // ---------------- 6. Where + ideal SEI ----------------
  concept("SEI 长在哪里？理想的 SEI 什么样？", "sei_where", { x: 0.5, y: 1.2, w: 6.6, h: 4.45 }, 7.45, 5.3, [
    { kind: "hist", body: "原文：历史上界面研究几乎都在负极，先是石墨，再到 Si，最近是 Li 金属。高电压正极出现后，正极界面才受到重视。" },
    { kind: "why", body: "以前把 SEI 看作负极专属。现在知道低于约 1 V 和高于约 4 V 都会形成分解膜，正极上的常称 CEI。" },
    { kind: "matters", body: "不同材料、不同电解液得到的 SEI 各不相同，但“让 SEI 更好”的标准是通用的。" },
  ], {
    caption: "电位为常见近似值（非原文数据）",
    quote: { en: "The ideal SEI should be very thin, electronically insulating and ionically conductive.", zh: "理想的 SEI 应当很薄、电子绝缘、离子导通。" },
    notes: "原文另外强调了第四条：SEI 要有足够的力学稳定性，充放电时不开裂。LiNi₀.₅Mn₁.₅O₄ 是典型的 4.7 V 高电压正极，原文后面讲到的丝蛋白粘结剂就用在它上面。CEI（cathode electrolyte interphase）是正极界面膜的常用叫法，原文没有使用这个缩写。",
  });

  // ---------------- 7. Carbonate vs ether ----------------
  d.section("2 SEI 与成膜添加剂");
  s = d.slide("CONTENT");
  s.addText("碳酸酯 vs 醚：溶剂的两难", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "介电常数", labels: ["EC（碳酸乙烯酯）", "PC（碳酸丙烯酯）", "DMC（碳酸二甲酯）", "DEC（碳酸二乙酯）", "DME（乙二醇二甲醚）", "DOL（1,3-二氧戊环）"], values: [89.8, 64.9, 3.1, 2.8, 7.2, 7.1] }], {
    x: 0.5, y: 1.25, w: 6.6, h: 4.3, barDir: "bar",
    chartColors: [HEX.accent1, HEX.accent1, HEX.accent5, HEX.accent5, HEX.accent2, HEX.accent2],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.0",
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 105,
    showTitle: true, title: "常见溶剂的介电常数 ε", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "橙：环状碳酸酯；黄：链状碳酸酯；青：醚。25 °C 文献常用值（EC 室温为固体，取 40 °C 值），非原文数据。", { x: 0.6, y: 5.6, w: 6.5, h: 0.45 });
  d.column(s, 7.45, 1.35, 5.3, [
    { kind: "hist", body: "1990 年 Dahn 组发现 EC 能在石墨上成膜，EC 基碳酸酯从此成为锂离子电池的标准电解液。醚类（DOL/DME）则常用于 Li 金属和 Li–S 电池。" },
    { kind: "why", body: "碳酸酯介电常数高，盐解离得好；但原文指出，常规碳酸酯在 Si、Li 上形不成稳定 SEI。醚在 Li 上天然形成聚合物性的 SEI，但抗氧化只到约 4.0 V。" },
    { kind: "matters", body: "没有十全十美的溶剂，所以需要添加剂或高分子来“补”界面。" },
  ]);
  d.block(s, { x: 0.6, y: 6.1, w: 12.15, kind: "def", head: "介电常数 Dielectric constant", body: "衡量介质削弱正负电荷间吸引力的能力。ε 越大，锂盐越容易解离成自由离子。" });
  s.addNotes("实际电解液通常把高介电的环状碳酸酯（EC）和低黏度的链状碳酸酯（DMC、DEC）混合使用，取长补短。醚类介电常数不高，但对 Li 金属更稳定。原文 Fig. 7d 中的两个液体对照组正是 EC:DEC 和 DOL:DME。");

  // ---------------- 8. Additives ----------------
  concept("FEC 与 VC：先一步“铺”出高分子 SEI", "additive_mech", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 }, 7.75, 5.0, [
    { kind: "hist", body: "2002 年 Aurbach 等系统研究了 VC 添加剂；FEC 随后在 Si 负极上广泛使用。2016–2017 年 Grey 组等用核磁共振证实：二者还原后都生成 poly(VC)。" },
    { kind: "why", body: "以前只靠溶剂分解自然成膜。改为加少量更容易被还原的添加剂：它先在电极上反应，铺出一层以高分子为骨架的 SEI。" },
    { kind: "matters", body: "SEI 本身就是“原位生成的高分子”。这启发了后面直接用高分子设计界面。" },
  ], {
    quote: { en: "Instead, fluoroethylene carbonate and vinylene carbonate are used as additives to help stabilize the SEI through the reductive formation of poly(vinyl carbonate).", zh: "因此，人们加入氟代碳酸乙烯酯和碳酸亚乙烯酯作为添加剂，它们被还原生成聚碳酸亚乙烯酯，从而帮助稳定 SEI。" },
    notes: "VC 分子里有一个 C=C 双键，被还原后可以像普通烯烃一样聚合，得到 poly(VC)。FEC 多了一个 F，还原时先失去 F（生成 LiF），再转化为类似 VC 的物种并聚合。高分子让 SEI 更柔韧，Si 膨胀时不容易开裂。原文还指出：醚类电解液不加添加剂，生成的 SEI 就是聚合物性的。",
  });

  // ---------------- 9. Section ----------------
  d.section("3 高分子在界面上");
  s = d.slide("DARK_SECTION");
  s.addText("高分子就在界面上", { placeholder: "title" });
  s.addText("粘结剂和聚合物电解质都直接接触电极：它们本身就会参与 SEI 的形成", { placeholder: "body" });

  // ---------------- 10. Binder in SEI ----------------
  concept("粘结剂也参与成膜", "binder_sei", { x: 0.5, y: 1.25, w: 6.9, h: 4.15 }, 7.75, 5.0, [
    { kind: "hist", body: "2016 年 Nguyen、Lucht 等系统比较 Si 粘结剂，发现含羧酸的粘结剂会被还原成羧酸锂。2017 年 Tang 等在 LiNi₀.₅Mn₁.₅O₄ 高电压正极里用蚕丝胶蛋白（sericin）参与成膜。" },
    { kind: "why", body: "以前认为粘结剂只是“胶水”，不参与反应。其实它就包在颗粒表面，第一次充电就参与 SEI 的形成。" },
    { kind: "matters", body: "选粘结剂也是在选 SEI：羧酸锂层抑制碳酸酯被还原；丝蛋白进入 SEI 后，自放电减少，Li⁺ 穿过 SEI 更快。" },
  ], {
    caption: "示意图；Si 表面的氧化层与 PAA 的氢键见第 5 章",
    extra: (s) => d.block(s, { x: 0.6, y: 5.95, w: 12.15, kind: "def", tint: true, head: "联系第 5 章", body: "PAA 的羧基先用氢键“粘住” Si；首次充电后又变成羧酸锂“护住” Si。同一个官能团，先后承担两份工作。" }),
    notes: "反应式是示意：羧酸的 H 被还原掉（放出 H₂），留下羧酸锂。原文说这层保护膜能抑制碳酸酯溶剂的还原。丝蛋白（sericin）是蚕丝里包在丝心外面的那层水溶性蛋白，便宜、环保、能水性加工。",
  });

  // ---------------- 11. Polymer electrolyte interface ----------------
  concept("聚合物电解质的界面", "spe_interface", { x: 0.5, y: 1.2, w: 6.9, h: 4.35 }, 7.75, 5.0, [
    { kind: "hist", body: "1978 年 Armand 提出用 PEO 类聚合物做电池电解质（第 3 章）。2014–2015 年起，XPS 等研究表明聚合物电解质与 Li 之间同样会形成 SEI。" },
    { kind: "why", body: "固态体系反应动力学慢，分解比液体慢，但 SEI 照样形成：醚类生成烷氧基锂，碳酸酯类生成烷基碳酸锂，与液体电解液的产物相似。" },
    { kind: "matters", body: "界面埋在两层固体之间，难以原位观察。醚类聚合物抗氧化不到 4 V，配高电压正极需要新材料。" },
  ], {
    caption: "示意图",
    quote: { en: "Unfortunately, the oxidative stability of ether-based polymer electrolytes is limited to <4 V …, and new polymer electrolytes are needed that form a stable interface with high-voltage cathodes.", zh: "遗憾的是，醚类聚合物电解质的氧化稳定性不到 4 V，需要能与高电压正极形成稳定界面的新型聚合物电解质。" },
    notes: "埋藏界面（buried interface）：电极和固态电解质紧贴在一起，探针和光束都很难伸进去，这限制了原位技术的使用。原文在第 3 章讨论过醚类以外的聚合物骨架（如碳酸酯类），它们的氧化稳定性可能更好。",
  });

  // ---------------- 12. Section ----------------
  d.section("4 锂金属的人工 SEI");
  s = d.slide("DARK_SECTION");
  s.addText("锂金属上的高分子涂层", { placeholder: "title" });
  s.addText("人工 SEI：在 Li 表面预先涂一层设计好的高分子", { placeholder: "body" });

  // ---------------- 13. Coatings ----------------
  concept("人工 SEI：哪些高分子被试过？", "coatings", { x: 0.5, y: 1.2, w: 6.9, h: 4.35 }, 7.75, 5.0, [
    { kind: "hist", body: "2015–2017 年间，离聚物、PDMS、弹性体复合物、超分子自修复高分子、PVDF、带醚基的聚降冰片烯等涂层陆续被用在 Li 金属上。" },
    { kind: "why", body: "碳酸酯和醚类电解液生成的 SEI 本来就有聚合物成分。与其等它自己长，不如预先涂一层设计好的高分子，即人工 SEI（artificial SEI）。" },
    { kind: "matters", body: "涂层决定 Li 在哪里、怎样沉积。" },
  ], {
    caption: "据原文 Fig. 7c 改绘（以重复单元化学式表示）",
    quote: { en: "These initial works yielded exciting results, but there were no clear design rules for synthesizing new coatings.", zh: "这些早期工作结果令人振奋，但还没有指导合成新涂层的明确设计规则。" },
    notes: "Nafion 是全氟磺酸离聚物（第 5 章用它做 Li–S 隔膜涂层），把其中的 H⁺ 换成 Li⁺ 就是锂化 Nafion：阴离子 –SO₃⁻ 固定在高分子上，能动的只有 Li⁺，所以是单离子导体。PDMS 就是常见的硅橡胶、硅油的主要成分。",
  });

  // ---------------- 14. Deposits ----------------
  concept("设计规律：大而致密的 Li 沉积", "deposits", { x: 0.5, y: 1.25, w: 6.9, h: 4.1 }, 7.75, 5.0, [
    { kind: "hist", body: "1926 年 Volmer 与 Weber 建立经典成核理论；2017 年 Pei、Cui 等用它解释 Li 的成核。2018 年 Lopez、Bao 等（本综述作者）系统比较了多种涂层。" },
    { kind: "why", body: "以前凭直觉挑涂层，结果难以比较。系统研究找到两个可测量的参数：介电常数可以预测 Li 的交换电流；表面能影响成核能量。" },
    { kind: "matters", body: "Li 颗粒越大越致密，比表面积越小，与电解液的副反应越少，库仑效率越高。" },
  ], {
    caption: "据原文 Fig. 7b 重绘",
    extra: (s) => d.block(s, { x: 0.6, y: 5.95, w: 12.15, kind: "def", tint: true, head: "原文结论", body: "涂层介电常数高（交换电流大）、表面能低，Li 颗粒就长得大；这样的涂层，器件库仑效率也更高。" }),
    notes: "原文说法：在高分子涂层存在时，Li 的交换电流可以由涂层的介电常数预测；通过对成核能量的标度分析，发现 Li 颗粒尺寸随交换电流增大、随表面能降低而增大。这两条规律都来自作者 2018 年在 JACS 上的系统研究（原文参考文献 193）。",
  });

  // ---------------- 15. Mechanism ----------------
  concept("为什么介电常数和表面能管用？", "mech_flow", { x: 0.5, y: 1.25, w: 6.9, h: 4.3 }, 7.75, 5.0, [
    { kind: "hist", body: "1924 年 Butler、1930 年 Erdey-Grúz 与 Volmer 建立了 Butler–Volmer 方程，交换电流 i₀ 是其中描述界面反应快慢的核心参数。" },
    { kind: "why", body: "以前只问涂层“能不能挡住枝晶”。现在从电化学动力学（i₀、过电位 η）和成核能量去理解，可以提前筛选材料。" },
    { kind: "matters", body: "交换电流大，同样电流下需要的过电位就小；过电位小，核少而大。这条链把分子性质和宏观效率连了起来。" },
  ], {
    caption: "流程中的“Li⁺ 穿过涂层容易”是直观解释；表面能一支只给原文结论",
    extra: (s) => {
      d.block(s, { x: 0.6, y: 5.95, w: 5.9, kind: "def", tint: true, head: "交换电流 i₀", body: "平衡时正、逆反应各自的速率。越大，界面反应越“顺”。" });
      d.block(s, { x: 6.85, y: 5.95, w: 5.9, kind: "def", tint: true, head: "过电位 η", body: "为了按一定速率沉积，必须额外多加的电压。" });
    },
    notes: "直观理解：介电常数高的涂层能更好地屏蔽电荷、稳定 Li⁺，Li⁺ 在涂层与 Li 之间转移的能垒更低，所以交换电流大。成核理论告诉我们，过电位越大，临界核越小、核密度越高，Li 就长成细小、比表面积大的形貌。表面能的作用机理原文只给了结论，这里不展开。",
  });

  // ---------------- 16. CE chart ----------------
  s = d.slide("CONTENT");
  s.addText("库仑效率对比：涂层 vs 液体电解液", { placeholder: "title" });
  const ceLab = ["EC:DEC（C）", "DOL:DME（E）", "自修复高分子（E）", "SBR 复合物（C）", "聚降冰片烯（C）", "聚氨酯（E）", "PEO（E）", "PVDF–HFP（E）", "PVDF（E）", "PDMS（E）"];
  const ceVal = [95.0, 98.8, 96.9, 97.4, 98.3, 97.8, 98.1, 98.5, 98.7, 99.2];
  s.addChart(d.pres.charts.BAR, [{ name: "库仑效率", labels: ceLab, values: ceVal }], {
    x: 0.5, y: 1.25, w: 7.4, h: 4.75, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent6, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent2, HEX.accent3],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.0",
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisMinVal: 94, valAxisMaxVal: 100, valAxisMajorUnit: 1, valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showTitle: true, title: "Li 沉积/剥离的库仑效率（%）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.caption(s, "据原文 Fig. 7d 读图（误差约 ±0.1%）。灰：无涂层的液体电解液；青：高分子涂层；紫：PDMS。E = 醚类、C = 碳酸酯类电解液。横轴从 94% 起。", { x: 0.6, y: 6.05, w: 7.3, h: 0.5 });
  d.stat(s, { x: 8.3, y: 1.2, w: 4.4, value: "≈99.2", unit: "%", label: "PDMS 涂层，图中最高", color: "accent3" });
  d.column(s, 8.3, 2.7, 4.45, [
    { kind: "hist", body: "数据汇总自 2016–2018 年多个课题组；PEO、PVDF–HFP、PVDF、PDMS 四点来自作者组 2018 年的工作。" },
    { kind: "why", body: "低表面能（PDMS）和高介电（PVDF 类）的涂层排在最右，印证了前两页的规律。" },
    { kind: "note", head: "对照要看清", body: "同用醚类电解液的无涂层对照已达约 98.8%，多数醚类涂层并未超过它。" },
  ], 0.3);
  s.addNotes("第 1 章算过：CE 从 99% 提到 99.9%，100 圈后的容量保持率从约 37% 提到约 90%。所以图中零点几个百分点的差别非常重要。碳酸酯对照组（EC:DEC，含 5 vol% FEC）只有约 95%，这也说明为什么 Li 金属研究大多改用醚类电解液。");

  // ---------------- 17. Quadrant ----------------
  concept("两类成功的涂层，以及理想涂层", "quadrant", { x: 0.5, y: 1.2, w: 6.2, h: 4.4 }, 7.05, 5.7, [
    { kind: "hist", body: "1943 年 Dow Corning 成立，开始大规模生产有机硅（PDMS 是其中最常见的一种）。PVDF 在 1960 年代商品化（第 1 章）。" },
    { kind: "why", body: "两类成功涂层各占一个优点：硅氧烷类表面能低，促进大而致密的 Li；强极性高分子和离聚物介电常数高，改善离子传输、降低过电位。理想是二者兼得。" },
    { kind: "matters", body: "工程上还要两点：厚度必须优化；最好能用非极性、与 Li 兼容的溶剂溶液涂布，才能工业化。" },
  ], {
    caption: "定性示意：箭头表示两类涂层各自需要补齐的方向",
    extra: (s) => d.block(s, { x: 0.6, y: 6.0, w: 12.15, kind: "def", tint: true, head: "表面能 Surface energy", body: "产生单位面积新表面所需的能量。表面能低的材料“不爱沾东西”，比如硅橡胶和不粘锅涂层。" }),
    notes: "为什么溶剂必须是非极性的？Li 金属非常活泼，水、醇甚至很多极性溶剂都会和它反应。厚度为什么要优化？太薄挡不住副反应，太厚则离子传输阻抗大、过电位升高。理想区（高介电常数又低表面能）目前还缺少成熟的材料，这正是高分子化学可以发力的地方。",
  });

  // ---------------- 18. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本节的四处细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.9, kind: "note", tint: true, head: "① 第 13 页：SEI 研究的历史顺序", body: "原文：界面研究“beginning with graphite, moving to Si and, more recently, focusing on Li”。\n但 SEI 概念（Peled，1979）最早正是为碱金属（Li）负极提出的。这句话应理解为锂离子电池时代的研究重心：石墨 → Si → Li 金属的复兴。" });
  d.block(s, { x: 6.85, y: 1.4, w: 5.9, kind: "note", tint: true, head: "② 第 13 页：碳酸酯不成膜？", body: "原文：“standard carbonate mixtures do not form stable SEIs”。\n应限定在 Si 和 Li 金属上。在石墨上，EC 基碳酸酯恰恰能形成稳定 SEI（第 1 章，1990 年 Dahn 组）。" });
  d.block(s, { x: 0.6, y: 4.3, w: 5.9, kind: "note", tint: true, head: "③ Fig. 7d 图注漏项", body: "图中有 “Polyurethane (E)” 一点（约 97.8%），但图注列出的材料里没有聚氨酯，也没有给出它的文献来源。" });
  d.block(s, { x: 6.85, y: 4.3, w: 5.9, kind: "note", tint: true, head: "④ Fig. 7d 的比较口径", body: "同为醚类电解液时，无涂层的 DOL:DME 约 98.8%，只有 PDMS（约 99.2%）更高。各点来自不同实验室和测试条件，宜看作趋势，不宜当作排名。" });
  s.addNotes("这几条不影响原文“高介电常数 + 低表面能”的结论，但读综述时要注意：一句概括性的历史描述或一张汇总图，背后可能省略了限定条件。");

  // ---------------- 19. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["界面必然反应：热力学不稳定，靠 SEI 动力学稳定", "电极能级超出电解液窗口（< 1 V、> 4 V）；理想 SEI：薄、电子绝缘、离子导通、不开裂"],
    ["SEI 本质上常是高分子", "FEC、VC 还原成 poly(VC)；醚类电解液自带聚合物性 SEI；碳酸酯介电高但在 Si/Li 上成膜差"],
    ["高分子本来就在界面上", "PAA 还原成羧酸锂保护层；聚合物电解质也长 SEI，醚类抗氧化 < 4 V"],
    ["人工 SEI 的设计规则", "高介电常数 + 低表面能 → 大而致密的 Li → 高 CE；厚度要优化，溶液加工要与 Li 兼容"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Taken together, these results suggest that the ideal polymer for an artificial SEI on a Li-metal electrode should have both a high dielectric constant and low surface energy.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "综合来看，Li 金属电极上理想的人工 SEI 高分子应同时具有高介电常数和低表面能。", options: { fontSize: 14, color: "CADCE8" } },
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
