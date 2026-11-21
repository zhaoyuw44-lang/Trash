// Lopez et al. 2019 — Chapter 5: 化学相互作用设计 (Designing interactions in polymers)
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
  const info = await renderAll(path.join(__dirname, "ch5_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 5, chapterTitle: "化学相互作用设计", figDir });
  d.registerFigs(info);
  const C = d.C;
  const NB = " ";

  // Standard "figure left, 史/变/要 right" concept slide
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
  s.addText("第 5 章\n高分子怎样“抓住”电极里的物种？", { placeholder: "title" });
  s.addText("化学相互作用设计：捕获多硫化物 · 粘住硅表面", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.6, y: 0.9, w: 4.3, h: 5.8 });
  s.addNotes("本章对应原文 “Designing interactions in polymers” 一节（第 11–13 页，含 Fig. 6）。前几章讲的是高分子的力学和传输性质；这一章讲高分子上的官能团怎样和电极里的物种发生化学作用：在 S 正极里抓住多硫化物，在 Si 负极里粘住颗粒表面。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "为什么要讲“化学作用”", "力学、传输之外，还要看高分子和电极物种怎么相互作用"],
    ["2", "抓住多硫化物", "配位、离子结合、硫化交联，以及“理想粘结剂”"],
    ["3", "粘住硅表面", "氢键；CMC → 海藻酸 → PAA；浆料 pH"],
    ["4", "粘得住，也要传得快", "导电网络、PEO 侧链、好粘结剂的共同特征"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.5, h: 1.08, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.3, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.3, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("与第 4 章的衔接", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  d.block(s, { x: 7.5, y: 2.05, w: 5.25, kind: "def", head: "上一章讲到", body: "导电高分子的主链决定能级和导电性；侧链则用来调节化学作用、分子堆积和能级。" });
  d.block(s, { x: 7.5, y: 3.35, w: 5.25, kind: "def", head: "这一章接着讲", body: "侧基和官能团到底和什么发生作用、作用该有多强。对象换成两种“麻烦物种”：S 正极溶出的 Li₂Sₓ，以及 Si 颗粒的表面。" });
  d.block(s, { x: 7.5, y: 4.85, w: 5.25, kind: "def", head: "一句话", body: "第 2–4 章问“高分子本身性能如何”，本章问“高分子和别人怎么相处”。" });
  s.addNotes("这一章两条主线互相独立，但设计思路相同：先弄清要“抓”的对象是什么、需要多强的作用、靠什么机理，再去选官能团。最后一页的“强度光谱”会把本章出现的所有作用放在一根尺子上比较。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从“试出来好用”到“按机理设计”", { placeholder: "title" });
  d.fig(s, "hist_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.15 });
  d.caption(s, "青色：Si 负极粘结剂；黄色：S 正极。均为原文所引文献，时间轴不按比例。", { x: 0.6, y: 5.1, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前：粘结剂只要“粘得住、不碍事”（PVDF），抓多硫化物靠碳的孔道。后来发现化学作用决定寿命，于是有目的地设计官能团。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.95, kind: "matters", tint: true, body: "两条主线几乎同时在 2010 年代成熟，而且都离不开同一套工具：给电子基团、氢键、动态网络。" });
  s.addNotes("Si 这条线：2007 年 Dahn 组发现 CMC 好用，但原因不明；之后几年才弄清是 CMC 与 Si 表面的作用。S 这条线：2013 年前后开始用含 N、O 的高分子吸附多硫化物，后来又出现带电高分子、原位硫化和吡啶高分子。");

  // ---------------- 4. Section: polysulfide ----------------
  d.section("1 抓住多硫化物");
  s = d.slide("DARK_SECTION");
  s.addText("抓住多硫化物", { placeholder: "title" });
  s.addText("S 正极的中间产物 Li₂Sₓ 会溶进电解液（第 1 章）：用高分子把它“抓”在正极里", { placeholder: "body" });

  // ---------------- 5. Three strategies ----------------
  s = d.slide("CONTENT");
  s.addText("三种“抓法”：配位、离子结合、硫化交联", { placeholder: "title" });
  const r5 = d.fig(s, "ps_strategies", { x: 0.5, y: 1.2, w: 12.3, h: 3.6 });
  d.caption(s, "据原文 Fig. 6a 重绘。黄 = S，紫 = Li，青 = N，红 = O。", { x: 0.6, y: r5.y + r5.h + 0.05, w: 12.1 });
  d.block(s, { x: 0.6, y: 5.2, w: 3.9, kind: "hist", tint: true, body: "2009 年 Nazar 组用介孔碳“物理关住”硫；2013 年前后转向化学“抓手”。" });
  d.block(s, { x: 4.72, y: 5.2, w: 3.9, kind: "why", tint: true, body: "孔道只能拖慢扩散，Li₂Sₓ 迟早会跑出去；化学作用能把它“钉”在正极里。" });
  d.block(s, { x: 8.84, y: 5.2, w: 3.9, kind: "matters", tint: true, body: "三种作用强弱、可逆性不同，可以单用，也可以组合。" });
  s.addNotes("溶解的多硫化物会造成自放电、库仑效率低和循环衰减。配位：Li₂Sₓ 两端的 Li 被 N、O、S 抓住；离子结合：带正电的高分子吸住带负电的 Sₓ²⁻；硫化：S 直接和高分子形成共价键。");

  // ---------------- 6. Li–X coordination ----------------
  concept("配位作用：N、O、S 用孤对电子抓住 Li", "lewis", { x: 0.5, y: 1.2, w: 7.0, h: 4.05 }, 7.75, 5.0, [
    { kind: "hist", body: "1923 年 G. N. Lewis 提出：给出电子对的是碱，接受电子对的是酸。2014–2015 年 Song 等发现 N 掺杂碳中的 N 能强烈吸附 Li₂Sₓ。" },
    { kind: "why", body: "以前用的碳几乎不带极性，抓不住极性的 Li₂Sₓ。换成含 N、O、S 的材料：孤对电子与缺电子的 Li⁺ 配位，高分子粘结剂里的极性基团也一样。" },
    { kind: "matters", body: "~1–2 eV 远大于室温热运动能（kT ≈ 0.026 eV），所以抓得住。原文：Li–X 结合越强，容量保持越好。" },
  ], {
    caption: "示意据原文 Fig. 6a（左）重绘",
    quote: { en: "Similar interactions were observed for polar functional groups containing N, O or S in polymer binders, leading to interaction strengths of ~1–2 eV with Li₂Sₓ, with stronger Li–X (X = N, O, S or other species) binding providing improved capacity retention.", zh: "在含 N、O、S 极性基团的高分子粘结剂中也观察到类似作用，与 Li₂Sₓ 的作用强度约 1–2 eV，Li–X 结合越强，容量保持越好。" },
    notes: "Li₂Sₓ 是一条两端各带一个 Li 的硫链。Li⁺ 缺电子，是 Lewis 酸；吡啶型 N、羰基 O、硫醚 S 上有孤对电子，是 Lewis 碱。原文还提到碳材料里 S 原子能与 Sₓ²⁻ 结合。1 eV 每个分子约等于 96 kJ mol⁻¹，已经接近弱化学键的量级。",
  });

  // ---------------- 7. Ionic binding ----------------
  concept("离子结合：正电荷吸住，负电荷挡回去", "ionic", { x: 0.5, y: 1.25, w: 6.9, h: 4.4 }, 7.75, 5.0, [
    { kind: "hist", body: "1960 年代末 DuPont 开发出带磺酸根的全氟离聚物 Nafion。2014 年 Huang 等把它涂在 Li–S 电池隔膜上，当作挡多硫化物的“离子屏障”。" },
    { kind: "why", body: "多硫化物本身是阴离子 Sₓ²⁻，可以直接用静电：带正电的粘结剂把它吸住；带负电的隔膜涂层同性相斥，把它挡回正极，而 Li⁺ 照样能过。" },
    { kind: "matters", body: "原文：长链多硫化物与 Li⁺ 结合不如短链紧，所以靠电荷的策略对较大的多硫化物更有效，正好补配位作用的短板。" },
  ], {
    caption: "示意据原文 Fig. 6a（中）重绘；右侧隔膜涂层为补充示意",
    extra: (s) => d.block(s, { x: 0.6, y: 5.95, w: 12.15, kind: "def", tint: true, head: "聚电解质 Polyelectrolyte", body: "重复单元上带可电离基团的高分子；只含少量带电单元的叫离聚物（ionomer），Nafion 就是一种。" }),
    notes: "两种用法：正极里用带正电的聚电解质粘结剂（如 2017 年 Li 等的工作）；隔膜上涂带负电的高分子（如 Nafion）。注意隔膜涂层必须同时让 Li⁺ 通过，带负电的磺酸根恰好对 Li⁺ 友好、对阴离子排斥。",
  });

  // ---------------- 8. Vulcanization ----------------
  concept("硫化交联：让 S 成为高分子的一部分", "vulcanize", { x: 0.5, y: 1.25, w: 6.9, h: 4.4 }, 7.75, 5.0, [
    { kind: "hist", body: "1839 年 Goodyear 发现天然橡胶和硫一起加热会变得结实耐用，这就是硫化（vulcanization）。2013 年 Pyun 组提出“反向硫化”，直接用硫做出富硫高分子。" },
    { kind: "why", body: "配位和静电都是“吸附”，仍可能脱附。硫化让 S 与高分子形成 C–S、S–S 共价键。原文举例：共轭高分子原位硫化；苯并噁嗪高分子原位聚合并硫化（2016），载量高、循环长。" },
    { kind: "matters", body: "共价键最牢，但也最“死”：断了不能自己连回去（见本章最后的强度光谱）。" },
  ], {
    caption: "S₈ 约 159 °C 开始开环聚合（硫的公认性质，非原文数据）",
    extra: (s) => d.block(s, { x: 0.6, y: 5.95, w: 12.15, kind: "def", tint: true, head: "原位 In situ", body: "不是先做好高分子再和 S 混合，而是在电极里、在 S 旁边直接聚合和硫化，所以 S 能均匀地“长”进网络里，载量也更容易做高。" }),
    notes: "S 很容易和有机物形成化合物，这一点被用来把多余的 S 直接“缝”进高分子网络里。例子：聚苯胺纳米管封装硫并部分硫化（2012）、聚噻吩与硫共聚（2015）、苯并噁嗪高分子（2016）。",
  });

  // ---------------- 9. Ideal binder: triad ----------------
  concept("理想的 S 正极粘结剂：三件事一起做", "triad", { x: 0.4, y: 1.2, w: 6.0, h: 4.9 }, 6.6, 6.15, [
    { kind: "hist", body: "2017 年 Tsao、Bao 等把吡啶基团放进高分子主链或侧链：N 抓多硫化物；吡啶打断共轭、主链更柔、更好溶，于是粘结剂用量少、面容量高。" },
    { kind: "why", body: "以前一种材料只管一件事（导电或吸附）。现在要求一个高分子同时满足三项。难点：给电子基团也会和 Li⁺ 配位，可能拖慢离子传输；办法之一是做“专一”的结合位点（如分子印迹高分子，2017）。" },
    { kind: "matters", body: "这三项就是原文给出的设计标准：强结合多硫化物、能导电子、能导 Li⁺。" },
  ], {
    notes: "原文原话：理想的粘结剂或隔膜涂层应该用 N、O、S 等给电子基团强烈结合多硫化物，通过共轭结构或较低的粘结剂用量保证电子传输，并能传导 Li⁺。吡啶的例子说明：打断共轭虽然牺牲一点导电性，却换来了溶解性和可加工性。",
  });

  // ---------------- 10. Future directions ----------------
  s = d.slide("CONTENT");
  s.addText("下一步可以试什么？原文给的三条线索", { placeholder: "title" });
  const ideas = [
    ["①", "现成的氢键受体", "S 结合基团和氢键受体很像：都富电子、带孤对电子。还没试过的氢键受体就是候选库。", C.accent2, "E8F4F3"],
    ["②", "专一的结合位点", "给电子基团越多，越可能拖慢 Li⁺。只在需要的地方放“专一”位点，可以两头兼顾。", C.accent3, "F1ECF8"],
    ["③", "金属离子配位高分子", "金属离子与多硫化物结合很强，在金属有机框架（MOF）里已很有效。把金属离子接到高分子上做粘结剂。", C.accent1, "FDF2E7"],
  ];
  ideas.forEach(([n, h, b, col, tint], i) => {
    const x = 0.6 + i * 4.1;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.35, w: 3.85, h: 2.3, rectRadius: 0.1, fill: { color: tint }, line: { color: tint } });
    s.addText(n, { x: x + 0.2, y: 1.45, w: 0.6, h: 0.6, fontSize: 28, bold: true, color: col, margin: 0, valign: "middle", isTextBox: true });
    s.addText(h, { x: x + 0.8, y: 1.45, w: 2.95, h: 0.6, fontSize: 18, bold: true, color: col, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: x + 0.2, y: 2.12, w: 3.45, h: 1.45, fontSize: 14, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  });
  d.block(s, { x: 0.6, y: 3.9, w: 5.9, kind: "hist", body: "1999 年 Yaghi 组报道 MOF-5：金属离子与有机配体搭成的多孔晶体。之后 MOF 被用来吸附多硫化物。" });
  d.block(s, { x: 6.85, y: 3.9, w: 5.9, kind: "matters", body: "三条都是“借用”别处的成熟化学。高分子的优势是能把这些基团精确地放到主链或侧链上。" });
  d.quote(s, { y: 5.75, en: "Existing hydrogen-bond acceptors that have not yet been explored for polysulfide trapping could be low-hanging fruit for future study.", zh: "现有但尚未用于捕获多硫化物的氢键受体，可能是未来研究中“唾手可得的果实”。" });
  s.addNotes("“低垂的果实”是英文习语，意思是容易摘到的成果。这里的“变”：以前是逐个发明新基团，现在提倡系统地从氢键化学、配位化学里找现成的候选。");

  // ---------------- 11. Section: Si ----------------
  d.section("2 粘住硅表面");
  s = d.slide("DARK_SECTION");
  s.addText("粘住硅表面", { placeholder: "title" });
  s.addText("力学性能好还不够：粘结剂还要和 Si 颗粒表面形成化学作用", { placeholder: "body" });

  // ---------------- 12. H-bonding ----------------
  concept("氢键：粘结剂“抓住”Si 的关键", "si_hbond", { x: 0.5, y: 1.25, w: 6.9, h: 4.35 }, 7.75, 5.0, [
    { kind: "hist", body: "1920 年 Latimer 与 Rodebush 用“氢键”解释水的反常性质；1939 年 Pauling 在《化学键的本质》中系统阐述。2013 年 Erk 等比较多种粘结剂，发现与 Si 表面形成氢键能大幅提高循环稳定性。" },
    { kind: "why", body: "以前用 PVDF：只靠很弱的范德华力贴在 Si 上，Si 一膨胀就脱开。改用带 –OH、–COOH 的粘结剂：与 Si 表面氧化层的 Si–OH 形成氢键。" },
    { kind: "matters", body: "氢键是动态的：受力时断开，之后又能重新形成，相当于电极会“自修复”，能分散应力。" },
  ], {
    caption: "据原文 Fig. 6b（左）重绘",
    quote: { en: "Good mechanical properties alone are not enough for a polymer binder to stabilize the Si electrode, and the chemical interactions between the binder and active material must also be considered.", zh: "仅有良好的力学性能不足以让高分子粘结剂稳定 Si 电极，还必须考虑粘结剂与活性物质之间的化学作用。" },
    notes: "Si 在空气和水里会在表面长出一层很薄的氧化层，表面布满 Si–OH（硅醇基）。粘结剂的羧基和羟基可以与之形成很多个氢键。单个氢键很弱，但数量多、能反复断开重连，这正是“动态”的意义。",
  });

  // ---------------- 13. CMC -> alginate -> PAA ----------------
  s = d.slide("CONTENT");
  s.addText("CMC → 海藻酸钠 → PAA：都靠羧基", { placeholder: "title" });
  const r13 = d.fig(s, "binder_family", { x: 0.5, y: 1.15, w: 12.3, h: 3.3 });
  d.caption(s, "重复单元为简化示意。CMC、海藻酸钠在水中以羧酸根 COO⁻ 形式存在，PAA 浆料偏酸，多为 COOH。", { x: 0.6, y: r13.y + r13.h + 0.05, w: 12.1 });
  d.block(s, { x: 0.6, y: 4.75, w: 6.0, kind: "hist", body: "2007 年 Li、Lewis 与 Dahn 把 CMC 用于 Si 负极，效果好但原因不明。Lestriez 等（2007）、Bridel 等（2010）发现关键在 CMC 与 Si 表面的作用。2010 年 Magasinski 等用 PAA，2011 年 Kovalenko 等用海藻酸钠。" });
  d.column(s, 6.9, 4.75, 5.85, [
    { kind: "why", body: "从“先试出来，再找原因”变成“按机理改造”：接儿茶酚（仿贻贝，2013）、超支化环糊精（2014）、支化刷（2015）。" },
    { kind: "matters", body: "三者都是便宜的水溶性多糖或合成高分子，适合大规模生产。" },
  ], 0.15);
  s.addNotes("羧基密度：PAA 每个重复单元都有一个羧基；海藻酸钠每个糖环一个；CMC 只有部分羟基被羧甲基取代。原文说这些粘结剂与 Si 表面的作用相似。海藻酸钠来自褐藻，Kovalenko 等 2011 年的论文发表在 Science 上。");

  // ---------------- 14. Slurry pH ----------------
  concept("浆料 pH：看不见的变量", "ph_oxide", { x: 0.5, y: 1.25, w: 6.4, h: 4.35 }, 7.2, 5.55, [
    { kind: "hist", body: "2012 年 Han 等用部分中和的 PAA 调节浆料；2016 年 Nguyen、Lucht 等系统比较多种粘结剂，发现粘结剂会影响 Si 表面化学和 SEI。" },
    { kind: "why", body: "水性浆料便宜环保，但水会和 Si 表面反应：碱性越强，Si 越容易被氧化、腐蚀，氧化层越厚。所以还要看粘结剂把浆料变成酸性还是碱性。" },
    { kind: "matters", body: "这能解释常见现象：CMC（pH ≈ 7）一般不如 PAA（pH ≈ 3）。工艺条件同样是化学设计的一部分。" },
  ], {
    quote: { en: "Thicker oxide layers on the Si particles result from slurries with a higher pH and likely lead to poorer cell performance.", zh: "pH 较高的浆料会使 Si 颗粒表面氧化层更厚，很可能导致电池性能变差。" },
    notes: "pH 同时影响两件事：颗粒在浆料里分散得好不好，以及 Si 表面的化学状态。氧化层是电子和离子的“额外关卡”，也会在首圈不可逆地消耗 Li。Si 在碱性溶液中被腐蚀是半导体工艺中熟知的现象（KOH 刻蚀）。",
  });

  // ---------------- 15. Conductive coating & dual network ----------------
  concept("导电高分子：共形包覆与双网络", "dual_network", { x: 0.5, y: 1.25, w: 6.9, h: 4.1 }, 7.75, 5.0, [
    { kind: "hist", body: "2012 年 Yao、Cui 等在 Si 纳米线表面电聚合 PEDOT；2013 年 Wu 等让 PANi 在 Si 纳米颗粒周围原位聚合成三维网络；2015 年 Yu 等把 PAA 与 PANi 组成双网络。" },
    { kind: "why", body: "单一导电高分子很难同时导电、牢牢粘住 Si、力学合适。于是分工：PAA 负责力学和氢键，PANi 负责导电。" },
    { kind: "matters", body: "原文：理想情况下 Si 颗粒应被导电高分子共形包覆。双网络带来高倍率和更长寿命。导电高分子的原理见第 4 章。" },
  ], {
    caption: "示意图，非原文插图",
    extra: (s) => d.block(s, { x: 0.6, y: 5.95, w: 12.15, kind: "def", tint: true, head: "共形包覆 Conformal coating", body: "涂层顺着颗粒的表面起伏均匀地包一层，不留空白。这样每个 Si 颗粒都直接接在导电网络上，膨胀时也不容易“掉线”。" }),
    notes: "共形包覆（conformal coating）：涂层顺着颗粒表面均匀地包一层，没有漏的地方。原文强调非传统的导电高分子粘结剂同样要调好它和 Si 表面的相互作用。PEDOT 是通过电聚合直接长在 Si 纳米线上的，属于共价锚定。",
  });

  // ---------------- 16. PEO side chains ----------------
  concept("PEO 侧链：让电解液把粘结剂“泡胀”", "peo_swell", { x: 0.5, y: 1.25, w: 6.9, h: 3.95 }, 7.75, 5.0, [
    { kind: "hist", body: "1973 年 Wright 发现 PEO 与碱金属盐的复合物能导电；1978 年 Armand 提出用它做电池电解质（第 3 章）。2013–2018 年，多个组把 PEO 链段接进 Si 粘结剂。" },
    { kind: "why", body: "非极性的自修复或导电高分子与电解液“不亲”，电极内部浸润差。接上极性的 PEO 侧链，粘结剂被电解液溶胀，Li⁺ 通路变多。" },
    { kind: "matters", body: "离子走得快就能快充。连本来就极性的 PAA，加入 PEO 后也受益（2017 年聚轮烷-PAA 粘结剂）。" },
  ], {
    caption: "据原文 Fig. 6b（右）重绘",
    quote: { en: "In addition to strong interaction with the Si surface, the binder should have good interaction with the electrolyte to wet the composite electrode, which is necessary to enable fast ion transport and thereby fast charging kinetics.", zh: "除了与 Si 表面强相互作用，粘结剂还应与电解液作用良好以浸润复合电极，这是快速离子传输、进而快速充电的前提。" },
    notes: "溶胀（swelling）：高分子吸收溶剂后体积变大但不溶解。PEO 的醚氧能与 Li⁺ 配位，所以 PEO 链段既亲电解液又能帮 Li⁺ 移动。聚轮烷-PAA 粘结剂里的“轴”就是 PEG 链。",
  });

  // ---------------- 17. Fig. 6c chart ----------------
  s = d.slide("CONTENT");
  s.addText("PEO 加多少？约 15 wt% 附近效果最好", { placeholder: "title" });
  const xs = [0, 12, 15, 16, 21, 42, 70];
  s.addChart(d.pres.charts.SCATTER, [
    { name: "PEO 含量", values: xs },
    { name: "PPyE", values: [1690, null, 2000, null, null, null, null] },
    { name: "PEFM", values: [2090, 2250, null, 2960, 1840, null, null] },
    { name: "SHP-PEG", values: [700, null, null, null, null, 1400, 1120] },
  ], {
    x: 0.5, y: 1.25, w: 7.3, h: 4.75,
    chartColors: [HEX.accent2, HEX.accent3, HEX.accent1], lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 10,
    showTitle: true, title: "1C 倍率下 Si 的比容量（mAh g⁻¹）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "b", legendFontSize: 13, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    valAxisMinVal: 0, valAxisMaxVal: 3500, valAxisMajorUnit: 500, catAxisMinVal: 0, catAxisMaxVal: 70, catAxisMajorUnit: 10,
    catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" },
    showCatAxisTitle: true, catAxisTitle: "粘结剂中 PEO 含量（wt%）", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.caption(s, "据原文 Fig. 6c 读图（1C 数据，读图误差约 ±50 mAh g⁻¹）；连线只为引导视线。", { x: 0.6, y: 6.05, w: 7.2 });
  d.stat(s, { x: 8.2, y: 1.2, w: 4.5, value: "~15", unit: "wt% PEO", label: "原文：PEO 加到约 15 wt% 时性能提升最明显", color: "accent3" });
  d.column(s, 8.2, 2.7, 4.55, [
    { kind: "hist", body: "数据来自三种粘结剂：PPyE、PEFM（均 2015 年）和 SHP-PEG（2018 年）。" },
    { kind: "why", body: "为什么加多了反而变差？PEO 稀释了粘结剂的其他“本领”，比如粘附力和导电性。" },
    { kind: "note", head: "细看数据", body: "“~15 wt%”主要来自 PEFM；SHP-PEG 只测了 0、~42、~70 wt%，最好的是 ~42 wt%。" },
  ], 0.35);
  s.addNotes("PEFM 是含四种嵌段的导电共聚物，在约 16 wt% PEO 时 1C 容量最高（约 2960 mAh g⁻¹），PEO 到约 21 wt% 时反而下降。SHP-PEG 是自修复高分子，0 wt% 时 1C 只有约 700 mAh g⁻¹，加 PEO 后提高到约 1400。教训：最优值和体系有关，读综述的“经验值”时要回到原图看清楚。");

  // ---------------- 18. Good binder common features ----------------
  concept("好的 Si 粘结剂有什么共同点？", "good_binder", { x: 0.5, y: 1.2, w: 6.5, h: 4.15 }, 7.55, 5.2, [
    { kind: "hist", body: "2013 年 Wang、Bao 等的自修复粘结剂；2015 年 Chen 等用自修复高分子做高面容量微米 Si 电极；2017 年 Choi 等的聚轮烷-PAA；2018 年 Xu 等的多重网络 PAA 粘结剂。" },
    { kind: "why", body: "以前只追求单一性质（很硬或很粘）。现在明白要同时具备：粘得住、能自修复、导离子。" },
    { kind: "matters", body: "这是第 2、3 章和本章结论的交汇点。三者兼备，便宜的微米 Si 在高载量下也能长期循环。" },
  ], {
    quote: { en: "…hydrogen-bonding groups to reversibly bind with the surface of the Si particles, a dynamic networked structure for mechanical stability of the electrode and strong interactions with the electrolyte and Li⁺ for fast ion transport.", zh: "（有效粘结剂的共同特征）与 Si 表面可逆结合的氢键基团、保证力学稳定的动态网络，以及与电解液和 Li⁺ 的强作用。" },
    notes: "原文说这种组合已在两种 PAA 基粘结剂和一种脂肪酸基自修复高分子中实现，并让大尺寸微米 Si 颗粒在高载量下稳定长循环。微米 Si 比纳米 Si 便宜 1–2 个数量级（第 1 章），所以这条路线对产业很有吸引力。",
  });

  // ---------------- 19. Interaction spectrum ----------------
  d.section("3 设计原则");
  s = d.slide("CONTENT");
  s.addText("设计原则：先定“多强、靠什么”，再定结构", { placeholder: "title" });
  d.fig(s, "spectrum", { x: 1.0, y: 1.15, w: 11.3, h: 2.6 });
  s.addChart(d.pres.charts.BAR, [{ name: "作用能", labels: ["热运动 kT（25 °C）", "典型氢键", "Li–X 配位（原文 1–2）", "C–S 共价键", "C–C 共价键"], values: [0.026, 0.2, 1.5, 2.8, 3.6] }], {
    x: 0.5, y: 3.9, w: 6.3, h: 2.95, barDir: "bar",
    chartColors: [HEX.accent6, HEX.accent2, HEX.accent3, HEX.accent5, HEX.accent5],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.0##",
    catAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 4.3,
    showTitle: true, title: "每个键的能量（eV，量级参考）", titleFontSize: 13, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.column(s, 7.1, 3.95, 5.65, [
    { kind: "hist", body: "1873 年 van der Waals 引入分子间引力；1916 年 G. N. Lewis 用共用电子对描述共价键。" },
    { kind: "why", body: "以前凭经验挑粘结剂；现在先定强度和可逆性，再选基团。" },
    { kind: "matters", body: "Si：动态可逆 → 氢键。多硫化物：抓牢 → N/O/S 配位。" },
  ], 0.12);
  s.addNotes("kT、氢键和共价键的数值是教科书量级（氢键约 5–30 kJ mol⁻¹；C–S 键约 270 kJ mol⁻¹，C–C 键约 350 kJ mol⁻¹；1 eV ≈ 96.5 kJ mol⁻¹），1–2 eV 来自原文。原文结论：多硫化物用给电子的 N、O、S 基团最有效；Si 电极用弹性粘结剂通过氢键粘住氧化层最有效。");

  // ---------------- 20. Errata ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：本节的四处细节", { placeholder: "title" });
  d.block(s, { x: 0.6, y: 1.4, w: 5.9, kind: "note", tint: true, head: "① 第 12 页正文 vs Fig. 6c", body: "正文：“peak … at ~15 wt% PEO”。\n图中只有 PEFM 在约 16 wt% 出现峰值；PPyE 只有 0 和 15 wt% 两点；SHP-PEG 最好的是约 42 wt%。“~15 wt%”应理解为个例，不是普适规律。" });
  d.block(s, { x: 6.85, y: 1.4, w: 5.9, kind: "note", tint: true, head: "② Fig. 6c 的最高点", body: "PEFM 在 C/10 下约 3650 mAh g⁻¹，略高于 Li₁₅Si₄ 的理论值 3579（第 1 章）。可能是按 Si 质量归一时，计入了导电高分子等组分的容量。原文未讨论，读图时注意。" });
  d.block(s, { x: 0.6, y: 4.15, w: 5.9, kind: "note", tint: true, head: "③ 第 11 页：可溶的 Li₂Sₓ", body: "原文写 Li₂Sₓ (2 < x < 8)。严格按不等式会把最长、最易溶的 Li₂S₈ 排除。常见写法是 4 ≤ x ≤ 8（Li₂S₈、Li₂S₆、Li₂S₄ 可溶，见第 1 章）。" });
  d.block(s, { x: 6.85, y: 4.15, w: 5.9, kind: "note", tint: true, head: "④ 参考文献 174", body: "原文：“Adv. Energy Mater. 414, 1703138 (2018)”。2018 年该刊为第 8 卷，“414”应为排版错误。这篇是 Fig. 6c 中 SHP-PEG 的数据来源。" });
  s.addNotes("这些都不影响原文的主要结论，但提醒我们：综述里的“经验数字”要回到原图和原始文献核对。第 ② 条只是可能的解释，需要查原始论文的归一化方法才能确定。");

  // ---------------- 21. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["先问“抓什么、抓多紧、靠什么机理”", "强度从弱到强：范德华力 < 氢键 < Li–X 配位 < 共价键；越强越牢，越弱越能自修复"],
    ["多硫化物：配位、离子结合、硫化交联", "N/O/S 给电子基团（~1–2 eV）最有效；理想粘结剂还要导电子、导 Li⁺"],
    ["硅表面：氢键粘住氧化层", "CMC → 海藻酸钠 → PAA；浆料 pH 越高氧化层越厚，PAA（pH ≈ 3）优于 CMC（pH ≈ 7）"],
    ["粘得住也要传得快", "导电网络 + PEO 侧链；好粘结剂 = 氢键基团 + 动态网络 + 亲电解液。下一章：稳定界面"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "“Overall, a clear understanding of the relevant chemistry in the battery electrode is needed before design of the functionalized polymer materials can proceed.”", options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: "总之，必须先弄清电池电极中的相关化学，才能着手设计功能化高分子材料。", options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 6.0, w: 11.9, h: 0.9, margin: 0, valign: "middle", isTextBox: true });

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
