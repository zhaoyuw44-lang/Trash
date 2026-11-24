// 锂电池制造 — 第 3 章：电极制备 II——干燥、辊压与新工艺
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch3_quotes");

const PAPER = {
  short: "锂电池制造",
  full: "本章原始文献：J. Li, J. Fleetwood, W. B. Hawley, W. Kays, From Materials to Cell: State-of-the-Art and Prospective Technologies for Lithium-Ion Battery Electrode Processing, Chem. Rev. 122, 903–956 (2022)；Y. Liu, R. Zhang, J. Wang, Y. Wang, Current and future lithium-ion battery manufacturing, iScience 24, 102332 (2021)。",
};

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch3_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 3, chapterTitle: "电极制备 II：干燥、辊压与新工艺", figDir });
  d.registerFigs(info);
  const C = d.C;
  const c3 = [0.6, 4.75, 8.9];
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const chartText = { catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontSize: 12, valAxisLabelColor: HEX.dk2, dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt" };
  const col = (s, x, y, w, blocks, gap, limit = 6.85, tag = "") => {
    const bot = d.column(s, x, y, w, blocks, gap);
    if (bot > limit) console.warn(`WARN column bottom ${bot.toFixed(2)} > ${limit} ${tag}`);
    return bot;
  };
  const row3 = (s, y, blocks, size = 13, limit = 6.85, tag = "") => {
    blocks.forEach((b, i) => {
      const bot = d.block(s, { x: c3[i], y, w: i === 2 ? 3.85 : 3.95, tint: true, size, ...b });
      if (bot > limit) console.warn(`WARN row3 bottom ${bot.toFixed(2)} > ${limit} ${tag}`);
    });
  };

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 3 章\n湿涂层怎样变成好电极", { placeholder: "title" });
  s.addText("电极制备 II：干燥、辊压与新工艺", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.55, w: 7.6, h: 1.4, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("第 2 章结束时，浆料已经涂在箔上，但它还是一层湿漆。这一章讲它怎样变成能装进电池的电极：先干燥，把溶剂赶走；再辊压，把它压实；最后分切成需要的形状。章末讲一条正在改变工厂的新路：干法电极，干脆不用溶剂。主要读 Li 等 2022 年 Chem. Rev. 综述的相关小节，以及 Liu 等 2021 年 iScience 的展望文章。");

  // ---------------- 2. Roadmap ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "干燥", "溶剂怎样离开、粘结剂迁移、NMP 回收与能耗"],
    ["2", "辊压与分切", "孔隙率、曲折度、压过头、切边质量"],
    ["3", "厚电极与新工艺", "厚电极的代价、PTFE 干法、静电喷涂等"],
    ["4", "校注与小结", "原文的出入、实验室误区、本章要点"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.4 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.1);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.27, w: 0.56, h: 0.56, fill: { color: C.text1 }, color: C.background1, fontSize: 19, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.12, w: 5.0, h: 0.45, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.6, w: 5.1, h: 0.36, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  card(s, 7.4, 1.4, 5.3, 2.45, "F1ECF8");
  s.addText("上一章回顾", { x: 7.65, y: 1.52, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent3, margin: 0, isTextBox: true });
  s.addText([
    { text: "浆料 = 活性物质 + 炭黑 + 粘结剂 + 溶剂", options: { bullet: true, breakLine: true } },
    { text: "正极用 PVDF/NMP，石墨负极用 CMC/SBR/水", options: { bullet: true, breakLine: true } },
    { text: "工厂用狭缝涂布 (slot-die)，实验室用刮刀", options: { bullet: true } },
  ], { x: 7.65, y: 2.0, w: 4.9, h: 1.7, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  card(s, 7.4, 4.05, 5.3, 2.65, "E8F4F3");
  s.addText("本章问题", { x: 7.65, y: 4.17, w: 4.9, h: 0.42, fontSize: 18, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText([
    { text: "怎样赶走溶剂，又不把粘结剂“带跑”？", options: { bullet: true, breakLine: true } },
    { text: "涂完为什么还要压？压到多少合适？", options: { bullet: true, breakLine: true } },
    { text: "能不能干脆不用溶剂？", options: { bullet: true } },
  ], { x: 7.65, y: 4.65, w: 4.9, h: 1.9, fontSize: 15, color: C.text1, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addNotes("本章四个部分。第 2 章讲到涂布为止：把浆料均匀地铺在箔上。接下来每一步都在改变电极的微观结构：干燥决定粘结剂和孔在哪里，辊压决定孔有多少、路有多绕。这些步骤在实验室常被一笔带过，但它们直接影响你测到的倍率和寿命。");

  // ---------------- 3. Timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：干燥、辊压与干法电极从哪里来", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "这些工序大多借自别的行业：压延来自橡胶和造纸，干燥理论来自化工，PTFE 来自化学材料。电池厂把它们拼成了一条卷对卷产线。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "知道工艺的“出身”，就知道它的边界：干法电极其实是超级电容工艺的“移植”，所以它先在正极上成功。" });
  s.addNotes("时间轴不按比例。1991 年 Sony 的锂离子电池产线借用了磁带涂布的经验，这一段在第 1 章讲过。Maxwell 的干法超级电容电极大约在 2000 年代量产，具体年份因产品而异，这里只写年代。2019 年 Tesla 收购 Maxwell 时，外界普遍认为它看中的是干法电极技术。");

  // ======== Section 1 ========
  d.section("1 干燥");
  s = d.slide("DARK_SECTION");
  s.addText("1  干燥：把溶剂赶走", { placeholder: "title" });
  s.addText("干燥的三个阶段 · 粘结剂迁移 · 分区干燥炉 · NMP 回收 · 能耗 · 二次真空干燥", { placeholder: "body" });
  s.addNotes("干燥看起来只是“把水分蒸掉”，其实是整个电极制备里最耗能、也最容易改变电极结构的一步。这一节先讲干燥时涂层里发生了什么，再讲工厂怎样处理蒸出来的 NMP。");

  // ---------------- 5. Drying phases ----------------
  s = d.slide("CONTENT");
  s.addText("干燥时涂层里发生了什么：三个阶段", { placeholder: "title" });
  d.fig(s, "drying_stages", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "据原文 Fig. 9 重绘（示意）。原文 p. 912–913 把干燥分为快速段、恒速段、低速段。", { x: 0.6, y: 5.85, w: 6.8, h: 0.5 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：干燥 Drying", size: 13, body: "把湿涂层里的溶剂蒸发掉，留下多孔的固体膜。像刷墙：漆先表干，里面的溶剂慢慢跑出来。" },
    { kind: "hist", size: 13, body: Q.facts.drying },
    { kind: "why", size: 13, body: "实验室涂完放进烘箱慢慢干就行。工厂涂布和干燥共用一条卷带，线速 10–30 m/min，只留 1–2 min 干燥，所以要分段控温。" },
    { kind: "matters", size: 13, body: "干燥定下了粘结剂在哪、孔怎么留、有没有裂纹。这些后面辊压改不回来。" },
  ], 0.14, 6.85, "phases");
  s.addNotes("第一阶段，表面的溶剂直接蒸发，湿膜很快变薄。第二阶段，颗粒已经互相靠拢，下面的溶剂沿着颗粒间的细缝（毛细作用）往上补，蒸发速度基本不变。第三阶段，只剩卡在颗粒接触处的溶剂，离表面远、路又窄，最难赶出来。原文的建议是：一开始温度低，后面逐步升高，这样粘结剂迁移最少。");

  // ---------------- 6. Binder migration & defects ----------------
  s = d.slide("CONTENT");
  s.addText("粘结剂迁移与干燥缺陷", { placeholder: "title" });
  d.fig(s, "drying_defects", { x: 0.6, y: 1.1, w: 12.1, h: 3.4 });
  d.caption(s, "示意，据原文 p. 912 与 p. 926 的文字描述绘制。", { x: 0.6, y: 4.45, w: 12.1, h: 0.3 });
  row3(s, 4.8, [
    { kind: "hist", body: Q.facts.migration },
    { kind: "why", body: "溶剂从表面蒸发，下面的溶剂顺着孔往上补，把粘结剂和炭黑一起带上来。干得越快，带得越多（原文 p. 912）。" },
    { kind: "matters", body: "底部粘结剂少，附着差、近箔处电阻大。循环时颗粒胀缩，涂层会脱落，容量快速衰减。" },
  ], 13, 6.88, "migration");
  s.addNotes("迁移 (migration) 就是“被溶剂流冲走”。热风太猛时还会出现结皮 (skinning)：表面先干成一层硬皮，把溶剂封在下面；后面溶剂冲破硬皮，就形成龟裂 (mud-cracking)。单面涂布时涂层收缩还会让箔卷边，过辊时被压平，又会裂开。实验室刮刀涂厚电极时最常见的就是龟裂：把烘箱温度降一点、先在室温放一会儿再烘，常常就好了。");

  // ---------------- 7. Dryer zones (chart) ----------------
  s = d.slide("CONTENT");
  s.addText("工业干燥炉：分三段，逐级升温", { placeholder: "title" });
  const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  const air = xs.map((x, i) => (i < 9 ? 90 : i < 18 ? 110 : 140));
  const nmp = [22, 50, 65, 74, 78, 80, 81, 82, 82, 82, 90, 92, 93, 93, 93, 93, 94, 94, 94, 104, 110, 125, 135, 139, 140, 140, 140];
  const wat = [20, 30, 33, 34, 35, 35, 35, 35, 35, 35, 37, 38, 38, 38, 39, 39, 39, 39, 39, 41, 44, 80, 125, 138, 140, 140, 140];
  s.addChart(d.pres.charts.SCATTER, [
    { name: "X", values: xs },
    { name: "热风温度", values: air },
    { name: "NMP 正极膜温", values: nmp },
    { name: "水系负极膜温", values: wat },
  ], {
    x: 0.5, y: 1.25, w: 6.7, h: 4.35, chartColors: [HEX.dk1, HEX.accent4, HEX.accent2], lineSize: 3, lineDataSymbol: "none",
    showTitle: true, title: "干燥炉内温度（°C）随位置（m）", ...chartText, showLegend: true, legendPos: "b", legendFontSize: 13,
    valAxisMinVal: 0, valAxisMaxVal: 150, valAxisMajorUnit: 30, valGridLine: { color: "E5E9ED", size: 0.75 },
    showCatAxisTitle: true, catAxisTitle: "离干燥炉入口的距离（m）", catAxisTitleFontSize: 12, catAxisTitleColor: HEX.dk2,
  });
  d.caption(s, "据原文 Fig. 10 重绘（读图，近似）。三段各 8 m，风温 90、110、140 °C。原图还画了残余溶剂：水约在 18 m、NMP 约在 21 m 处降到零。", { x: 0.6, y: 5.65, w: 6.6, h: 0.6 });
  col(s, 7.6, 1.3, 5.15, [
    { kind: "def", head: "水与 NMP（原文 p. 913）", size: 13, body: "沸点：水 100 °C，NMP 204.3 °C。蒸气压：水 7373 Pa，NMP 133 Pa。汽化热：水 2260 kJ/kg，NMP 510 kJ/kg。" },
    { kind: "hist", size: 13, body: Q.facts.dryer },
    { kind: "why", size: 13, body: "若整条 24 m 都吹 140 °C，前段涂层还很湿就被猛烤，容易结皮、龟裂。分段后，前段温和，最后一段才把膜温升到风温（原文 p. 925）。" },
    { kind: "matters", size: 13, body: "读图要点：溶剂没干完时，蒸发吸热把膜温“压住”；溶剂一干完，膜温立刻冲向风温。" },
  ], 0.13, 6.85, "dryer");
  s.addNotes("这张图最值得看的是两条膜温曲线。水系负极在前 18 m 膜温只有 35–40 °C，因为水的汽化热大，蒸发把热量都吃掉了；水一干，膜温在两三米内从 40 多度冲到 140 度。NMP 正极膜温升得更早，因为 NMP 汽化热小、但沸点高、挥发慢。实验室里也一样：烘箱读数不等于极片的真实温度。");

  // ---------------- 8. NMP recovery ----------------
  s = d.slide("CONTENT");
  s.addText("NMP 回收：蒸出来的溶剂去哪了", { placeholder: "title" });
  d.fig(s, "nmp_recovery", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "据原文 Fig. 20 简化重绘；回用损失 20–30% 引自 Liu p. 2。", { x: 0.6, y: 5.72, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.nmp },
    { kind: "why", size: 13, body: "水系负极的水汽可以直接排到大气。NMP 有毒、又贵，各国对排放有严格限值，不能直排（原文 p. 926–927）。" },
    { kind: "matters", size: 13, body: "一台干燥炉每小时排出几千立方米含溶剂的热风。回收设备配小了，会卡住整条涂布线。" },
  ], 0.15, 5.75, "nmp");
  d.quote(s, Q.nmpRecycle);
  s.addNotes("流程分两路。液体路：冷凝器把大部分 NMP 冷凝成液体，收进储罐；小厂把它卖掉或送出去蒸馏，大厂自己精馏，提纯到电池级再拿去配浆。气体路：冷凝后的废气里还有 NMP，先用沸石转轮吸附浓缩，再过活性炭床，最后才能排放。换热器用热废气预热新风，省一部分加热能耗。");

  // ---------------- 9. Energy (chart) ----------------
  s = d.slide("CONTENT");
  s.addText("干燥是工厂里最大的“电老虎”", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "能耗占比", labels: ["干燥与溶剂回收", "干燥间 (dry room)", "叠片", "分切", "封装", "辊压", "焊接", "涂布", "搅拌", "化成/老化"], values: [46.84, 29.37, 5.8, 5.35, 5.2, 2.86, 1.88, 1.36, 0.83, 0.53] }], {
    x: 0.5, y: 1.25, w: 6.6, h: 4.5, barDir: "bar",
    chartColors: [HEX.accent1, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6, HEX.accent6],
    showValue: true, dataLabelFormatCode: "0.0", dataLabelPosition: "outEnd", ...chartText,
    catAxisOrientation: "maxMin", valAxisHidden: true, valAxisMaxVal: 58, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "各工序能耗占比（%，Liu 表 1）", showLegend: false,
  });
  d.caption(s, "数据：Liu p. 3 表 1，32 Ah LMO/石墨电芯的中试线实测（Yuan 等 2017）。", { x: 0.6, y: 5.75, w: 6.5, h: 0.3 });
  d.stat(s, { x: 7.5, y: 1.25, w: 2.5, value: "46.8", unit: "%", label: "干燥与溶剂回收", color: "accent1" });
  d.stat(s, { x: 10.2, y: 1.25, w: 2.5, value: "29.4", unit: "%", label: "干燥间（第 4、6 章）", color: "accent6" });
  col(s, 7.5, 2.75, 5.25, [
    { kind: "hist", size: 13, body: "Liu 表 1 的能耗来自 2017 年 Yuan 等在 Johnson Controls 中试线上的实测；成本项来自 Argonne 的 BatPaC 模型。" },
    { kind: "why", size: 13, body: "NMP 沸点高，要长时间加热；排出的热废气又要冷却回收，等于“先加热、再制冷”。" },
    { kind: "matters", size: 13, body: "降能耗最直接的办法是少用或不用 NMP——这正是第 3 节干法电极的动机。" },
  ], 0.13, 5.75, "energy");
  d.quote(s, Q.energy46);
  s.addNotes("两篇文章的数字一致：Li 综述说干燥与溶剂回收占制造能耗 46% 以上，Liu 表 1 给出 46.84%。成本上，Liu 表 1 中涂布/干燥占 14.96%，溶剂回收另占 4.60%，合计约 20%；Li 综述引用的另一模型给出“涂布、干燥与溶剂回收”占 11.5%。不同模型的数字不同，但结论相同：干燥是降本降耗的首要目标。");

  // ---------------- 10. Vacuum drying ----------------
  s = d.slide("CONTENT");
  s.addText("二次干燥：装电池前再烘一次", { placeholder: "title" });
  d.fig(s, "vacuum_drying", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "示意。反应式为 LiPF₆ 水解的常见总式（补充，非原文）。", { x: 0.6, y: 5.85, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.vacuum },
    { kind: "why", size: 13, body: "第一次干燥只赶走大部分溶剂；极片在空气里还会吸水，水系石墨负极更多。所以装电池前要在真空里再烘，把水降到几百 ppm 以下。" },
    { kind: "matters", size: 13, body: "Li p. 942：100 °C 真空 2 h，NMP 正极水分约 90 ppm、水系正极约 160 ppm；红外二次干燥只需 2 min。" },
    { kind: "matters", head: "实验室提示", size: 13, body: "常见做法：冲片后 80–120 °C 真空烘过夜，趁热转进手套箱（第 4 章）。烘完再暴露空气，就白烘了。" },
  ], 0.14, 6.85, "vacuum");
  s.addNotes("水为什么可怕？LiPF₆ 遇水分解，生成 HF。HF 会溶解正极里的过渡金属、腐蚀铝箔、破坏 SEI。Huttner 2019 年的结果提醒我们：烘得越狠不一定越好，PVDF 和 CMC/SBR 长时间高温会变脆、粘结变差。实验室温度可以参考粘结剂：PVDF 正极常用 110–120 °C，含 CMC/SBR 的负极常用较低温度，这些是常见经验值，不是原文数据。");

  // ======== Section 2 ========
  d.section("2 辊压与分切");
  s = d.slide("DARK_SECTION");
  s.addText("2  辊压与分切：压实、切好", { placeholder: "title" });
  s.addText("辊压像擀面 · 孔隙率怎么算 · 曲折度 · 压过头 · 分切与切边", { placeholder: "body" });
  s.addNotes("干燥后的电极很“蓬松”，孔隙率约一半。辊压把它压薄、压实。这一节教你自己算孔隙率，并解释为什么压得越密，离子越难走。");

  // ---------------- 12. Calendering ----------------
  s = d.slide("CONTENT");
  s.addText("辊压 (calendering)：像擀面一样把电极压实", { placeholder: "title" });
  d.fig(s, "calender_rolls", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "示意。厚度与孔隙率为下一页的示例计算，不是原文数据。", { x: 0.6, y: 5.85, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "def", head: "定义：辊压 Calendering", size: 13, body: "让极片从两只对压的钢辊之间穿过，压到目标厚度。压延机英文是 calender，不要写成 calendar（日历）。" },
    { kind: "hist", size: 13, body: Q.facts.calender },
    { kind: "why", size: 13, body: "刚干燥的电极孔隙约一半，颗粒之间接触松散。压实后颗粒接触更好、导电更好，体积也更小（原文 p. 913）。" },
    { kind: "matters", size: 13, body: "同样的材料，压不压、压多少，电池的体积能量密度和倍率可以差很多。" },
  ], 0.14, 6.85, "calender");
  s.addNotes("比喻：擀面让面团变薄、变实；擀过头，面皮就破了——电极也一样，压过头颗粒会碎（后面讲）。工业辊压机的辊子通常加热，并且要非常圆、非常硬，否则整卷电极厚度不均。实验室常用的小型对辊机原理相同，只是辊子小、速度慢。原文 Fig. 11 的图注和 p. 919 都把 calender 误拼成 calendar 或 calendaring，查文献时两种拼法都要搜。");

  // ---------------- 13. Porosity ----------------
  s = d.slide("CONTENT");
  s.addText("孔隙率 (porosity)：自己算一算", { placeholder: "title" });
  d.fig(s, "porosity_scale", { x: 0.6, y: 1.05, w: 12.1, h: 2.55 });
  col(s, 0.6, 3.75, 6.0, [
    { kind: "def", head: "公式：ε = 1 − ρ涂层 ÷ ρ真", size: 13, body: "ε：孔隙率。ρ涂层 = 涂层面密度 ÷ 涂层厚度（扣掉箔）。ρ真：组分的平均真密度，1/ρ真 = Σ wᵢ/ρᵢ（wᵢ 质量分数，ρᵢ 真密度）。" },
    { kind: "def", head: "例题（补充计算）", size: 13, body: "NMC811:炭黑:PVDF = 95:2.5:2.5，真密度取 4.75/1.9/1.78 g/cm³ → ρ真 ≈ 4.40。涂层 20 mg/cm²：厚 95 μm → ε ≈ 52%；压到 70 μm → 35%；60 μm → 24%。" },
  ], 0.12, 6.85, "porosity-L");
  col(s, 6.85, 3.75, 5.85, [
    { kind: "hist", size: 13, body: Q.facts.porosity },
    { kind: "why", size: 13, body: "以前实验室常不压。现在按目标孔隙率反推辊缝：厚度只差 10 μm，孔隙率就差约 10 个百分点。" },
    { kind: "matters", size: 13, body: "孔隙率决定装多少电解液、离子走多顺、体积能量多高。发表时要写清楚（第 5 章）。" },
  ], 0.12, 6.85, "porosity-R");
  s.addNotes("算一遍例题：20 mg/cm² 就是 0.020 g/cm²，95 μm 是 0.0095 cm，相除得涂层密度 2.11 g/cm³；除以真密度 4.40，得 0.48，所以孔隙率约 52%。真密度是常见文献值，换材料时要换成你自己的数。压实密度 (compaction density) 就是这里的 ρ涂层，工厂常用它代替孔隙率来下指标。原文 p. 913：研究级电极常在 30–35%，商用负极约 20%、正极约 25%。");

  // ---------------- 14. Tortuosity ----------------
  s = d.slide("CONTENT");
  s.addText("曲折度 (tortuosity)：离子要绕多远的路", { placeholder: "title" });
  d.fig(s, "calender_micro", { x: 0.5, y: 1.2, w: 6.9, h: 4.6 });
  d.caption(s, "据原文 Fig. 11a 重绘并加上离子路径（示意）。", { x: 0.6, y: 5.75, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "def", head: "定义：曲折度 τ", size: 13, body: "离子实际走的路 ÷ 电极厚度。像在人群里穿行：人越挤，绕得越远。" },
    { kind: "hist", size: 13, body: Q.facts.tortuosity },
    { kind: "why", size: 13, body: "按 τ ≈ ε^−0.5 估算：ε 从 50% 降到 25%，有效离子通道 ε/τ 从约 0.35 降到 0.13，只剩三分之一多。" },
  ], 0.13, 5.75, "tortuosity");
  d.quote(s, Q.optimalPorosity);
  s.addNotes("为什么有“最佳孔隙率”？压得越密，电子路越通（颗粒接触好），离子路越堵（孔少、路绕）。薄电极里，慢的是锂在固体颗粒里的扩散；电极一厚，电解液里的离子传输就成了瓶颈（原文 p. 913）。注意 Bruggeman 关系是理想球形颗粒的近似，片状石墨这样的真实电极往往更“绕”。这就是“要”：同一份材料，孔隙率选错，倍率性能可以差一大截。");

  // ---------------- 15. Over-calendering ----------------
  s = d.slide("CONTENT");
  s.addText("压过头：颗粒破碎、附着力变差", { placeholder: "title" });
  d.fig(s, "particle_damage", { x: 0.5, y: 1.25, w: 6.9, h: 4.55 });
  d.caption(s, "示意。附着力曲线据原文 p. 914 文字描述绘制，非实测数据。", { x: 0.6, y: 5.85, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.damage },
    { kind: "why", size: 13, body: "以前冷压、一次压到底。现在多用热辊软化粘结剂、减少残余应力，或分两步压。应力不均会让卷材中间鼓起，叫“自行车胎”缺陷（原文 p. 914）。" },
    { kind: "matters", size: 13, body: "二次颗粒一碎，新表面直接接触电解液，副反应增多。附着力在 30–35% 最弱，卷绕时易掉粉。" },
  ], 0.15, 6.85, "damage");
  s.addNotes("为什么附着力先降后升？涂层的弹性模量比铝箔小约两个数量级，辊压时涂层被拉伸得多，箔被拉伸得少，粘结剂与箔的接触被扯断；压到 30% 以下，颗粒被压进箔面，形成机械咬合，附着力又略回升（原文 p. 914）。石墨比多数正极二次颗粒“耐压”，所以负极能压到更低孔隙率。颗粒越小越好压，越不容易碎。卸压后电极还会回弹，DEM 模拟显示最高约 17%，所以辊缝要比目标厚度设得更小。");

  // ---------------- 16. Slitting ----------------
  s = d.slide("CONTENT");
  s.addText("分切 (slitting) 与模切：切出需要的形状", { placeholder: "title" });
  d.fig(s, "slitting", { x: 0.6, y: 1.05, w: 12.1, h: 3.3 });
  row3(s, 4.4, [
    { kind: "hist", body: Q.facts.slitting },
    { kind: "why", body: "卷绕电池只需切成长条；叠片软包要一片片切出极耳。刀具便宜但会磨出毛刺；激光切口干净，但设备贵，还可能溅出熔融金属（Liu p. 8）。" },
    { kind: "matters", body: "负极要比正极大一圈（尺寸差约 2 mm）。这圈“悬空”负极会暂存锂，让库仑效率测出 >100%（原文 p. 915）。" },
  ], 13, 5.85, "slitting");
  d.quote(s, Q.edges);
  s.addNotes("分切成本低（Liu 表 1 约占 3%）、速度快（80–150 m/min），但切边质量关系到安全：边缘电场集中，一根毛刺就可能刺穿隔膜造成内短路。极耳位置最好在涂布时就留出空箔（间歇涂布，第 2 章），实在不行才用激光把涂层清掉。实验室冲片时也要注意：冲头钝了会产生毛刺，冲好的极片要检查边缘。");

  // ======== Section 3 ========
  d.section("3 厚电极与新工艺");
  s = d.slide("DARK_SECTION");
  s.addText("3  厚电极与新工艺", { placeholder: "title" });
  s.addText("厚电极的诱惑与代价 · PTFE 干法电极 · Maxwell 与 Tesla · 静电喷涂、电子束固化 · 辐射干燥、多层涂布", { placeholder: "body" });
  s.addNotes("前两节讲的是今天工厂的标准做法。这一节看两个趋势：一是把电极做厚，二是少用或不用溶剂。两者其实相互推动：湿法很难做厚，干法正好擅长做厚。");

  // ---------------- 18. Thick electrodes ----------------
  s = d.slide("CONTENT");
  s.addText("厚电极：多装活性物质的诱惑与代价", { placeholder: "title" });
  d.fig(s, "thick_electrode", { x: 0.5, y: 1.2, w: 6.9, h: 4.6 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.thick },
    { kind: "why", size: 13, body: "厚电极的箔和隔膜少，能量密度高、成本低。但湿膜越厚，干燥时迁移越重、越易开裂（原文 p. 941），离子路也越长。" },
    { kind: "matters", size: 13, body: "出路：多层涂布、定向孔、干法电极（后面几页）。" },
  ], 0.15, 5.75, "thick");
  d.quote(s, Q.thickLimit);
  s.addNotes("“厚”没有统一定义。原文举例：20 年前 100 g/m² 算常规；现在说厚电极，往往指 400–500 g/m²，湿膜厚 700 μm 以上。湿膜太厚时，狭缝涂布头和辊之间的间隙太大，托不住浆料（原文 p. 921）。干燥时，贴着箔的那层被箔“钉住”不能动，表面那层却在收缩，厚度越大应力越大——这就是金句里说的力学上限。双面同时涂布、同时干燥能让两边应力平衡，稍微抬高这个上限。");

  // ---------------- 19. Dry vs wet ----------------
  s = d.slide("CONTENT");
  s.addText("干法电极：不用溶剂，靠 PTFE “拉丝”成膜", { placeholder: "title" });
  d.fig(s, "wet_vs_dry", { x: 0.6, y: 1.05, w: 12.1, h: 3.45 });
  d.caption(s, "据原文 p. 940 与 Liu p. 6 的工艺描述绘制（示意）。", { x: 0.6, y: 4.45, w: 12.1, h: 0.3 });
  row3(s, 4.8, [
    { kind: "hist", body: Q.facts.ptfe },
    { kind: "why", body: "湿法离不开溶剂：先溶、后蒸、再回收。PTFE 不用溶解：干粉一受剪切就拉成纤维，把颗粒“网”成膜，溶剂这一步整个省掉。" },
    { kind: "matters", body: "原文：干法有望省 10–20% 电池成本（p. 941），没有粘结剂迁移，也更容易做厚。" },
  ], 13, 6.88, "dry");
  s.addNotes("为什么偏偏是 PTFE？PTFE 分子链很规整、很滑，细粉在剪切力下会被拉成极细的纤维，像拉丝一样。原文列出干法三个关键：粉末混得匀、PTFE 纤维化充分、粉末铺得匀。纤维化不够，膜就撑不住；纤维化太多，又要更多粘结剂，挤占活性物质的位置。");

  // ---------------- 20. Maxwell & Tesla ----------------
  s = d.slide("CONTENT");
  s.addText("从超级电容到动力电池：Maxwell 与 Tesla", { placeholder: "title" });
  d.fig(s, "dry_film", { x: 0.5, y: 1.2, w: 6.9, h: 4.55 });
  d.caption(s, "据 Liu Fig. 3B-I 与原文 p. 940 文字重绘（示意）。", { x: 0.6, y: 5.72, w: 6.8, h: 0.3 });
  col(s, 7.75, 1.3, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.maxwell },
    { kind: "why", size: 13, body: "PTFE 在负极低电位下会被锂还原，造成容量损失和低效率，所以干法目前主要用在正极（原文 p. 941）。" },
    { kind: "matters", size: 13, body: "Liu p. 6：Maxwell 干法 NMC111/石墨电池 4 mAh/cm²，1500 次后保持 90%；负载最高 36 mg/cm²。" },
  ], 0.14, 5.75, "maxwell");
  d.quote(s, Q.ultimate);
  s.addNotes("Maxwell 原本做超级电容，超级电容的活性炭电极很早就用干法 PTFE 工艺，因为活性炭比表面积大、吸溶剂，湿法很难干透。Tesla 收购后，在 2020 年“电池日”上把干法电极列为 4680 电池降本的手段之一。据公开报道，干法正极的量产难度比负极更大，进展慢于当初的预期；Tesla 也在 2021 年前后把 Maxwell 的超级电容业务出售。这两条是公开报道，非本章原文内容。");

  // ---------------- 21. ESD & EB ----------------
  s = d.slide("CONTENT");
  s.addText("其他无溶剂路线：静电喷涂与电子束固化", { placeholder: "title" });
  d.fig(s, "esd", { x: 0.5, y: 1.1, w: 6.0, h: 3.35 });
  s.addChart(d.pres.charts.BAR, [
    { name: "下限", labels: ["湿法涂布", "静电喷涂 ESD", "电子束 EB 固化"], values: [10, 0.4, 150] },
    { name: "上限", labels: ["湿法涂布", "静电喷涂 ESD", "电子束 EB 固化"], values: [30, 1.2, 300] },
  ], {
    x: 6.75, y: 1.1, w: 6.0, h: 3.35, barDir: "col", barGapWidthPct: 60,
    chartColors: [HEX.accent6, HEX.accent2], showValue: true, dataLabelFormatCode: "0.#", dataLabelPosition: "outEnd", ...chartText,
    valAxisHidden: true, valAxisMaxVal: 340, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "线速度（m/min，原文 p. 940 与表 9）", showLegend: true, legendPos: "t", legendFontSize: 12,
  });
  d.caption(s, "左：据原文 Fig. 27 重绘（示意）。右：ESD 的 0.4 来自正文、1.2 来自表 9，见阅读校注。", { x: 0.6, y: 4.45, w: 12.1, h: 0.3 });
  row3(s, 4.8, [
    { kind: "hist", body: Q.facts.esd },
    { kind: "why", body: "ESD：干粉带电，吸到接地箔上，再用热辊压实；比湿法省人工 16–22%、设备 14–19%。EB：少量溶剂的低聚物浆料，电子束不到 1 s 就交联成网。" },
    { kind: "matters", body: "ESD 太慢；EB 能到 150 m/min，但要低氧气氛（< 200 ppm）、设备贵。两者离量产都还差一步。" },
  ], 13, 6.88, "esd");
  s.addNotes("静电喷涂就像给汽车喷粉末涂料：粉末带负电，被接地的金属吸住。它没有溶剂，但卷速很慢，原文认为提高速度是下一代电极制造的首要任务之一。电子束固化走的是另一条路：不是完全不用溶剂，而是把溶剂降到 10–15%，再用电子束把小分子瞬间连成大分子粘结剂。紫外 (UV) 固化更便宜，但穿透浅，厚电极要多次涂。");

  // ---------------- 22. Radiative drying, multilayer, aligned pores ----------------
  s = d.slide("CONTENT");
  s.addText("改良现有产线：辐射干燥、多层涂布、定向孔", { placeholder: "title" });
  d.fig(s, "emerging", { x: 0.6, y: 1.05, w: 12.1, h: 3.55 });
  d.caption(s, "示意，据原文 4.5、4.6 节与第 5 节的描述绘制。", { x: 0.6, y: 4.55, w: 12.1, h: 0.3 });
  row3(s, 4.85, [
    { kind: "hist", body: Q.facts.emerging },
    { kind: "why", body: "热风要先加热空气再传给涂层；红外直接把能量送进涂层，微波从内部加热。多层涂布让粘结剂多的一层贴着箔，正好“反转”迁移。" },
    { kind: "matters", body: "这些都能“插进”现有产线，比干法更快落地。Liu p. 7：三段干燥可省约 40% 干燥时间；激光辅助干燥能耗可减半。" },
  ], 13, 6.88, "emerging");
  s.addNotes("原文 p. 942 的研究发现：在快速段和恒速段，红外比热风去除 NMP 更快；但到最后的低速段，热风反而更有效，所以最好两者结合。多层涂布的理想结构是：靠箔一侧粘结剂多、颗粒小、孔少；靠隔膜一侧颗粒大、孔多，方便离子进出。定向孔道（激光打孔、冰模板、共挤出）能直接降低曲折度，但目前多在实验室，规模化、速度和成本还没解决（原文 p. 943）。");

  // ======== Section 4 ========
  d.section("4 校注与小结");
  s = d.slide("CONTENT");
  s.addText("阅读校注：原文的出入与实验室误区", { placeholder: "title" });
  let yL = 1.3, yR = 1.3;
  Q.corrections.forEach((n, i) => {
    const left = i % 2 === 0;
    const bot = d.block(s, { x: left ? 0.6 : 6.8, y: left ? yL : yR, w: 5.9, kind: "note", tint: true, size: 12, head: n.head, body: n.body });
    if (left) yL = bot + 0.15; else yR = bot + 0.15;
  });
  if (Math.max(yL, yR) > 7.0) console.warn("WARN corrections overflow", yL, yR);
  s.addNotes("前两条是原文自身的笔误或不一致。第三条最容易让初学者糊涂：同样叫“三段干燥”，一个说的是物理阶段，一个说的是工艺设定。第五条是实验室最常见的问题：拿未辊压、孔隙率 50% 的电极和别人压实的电极比倍率，结论没有意义。");

  // ---------------- Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["干燥决定粘结剂在哪", "表面蒸发 → 溶剂上行 → 粘结剂迁移；工厂分段升温，实验室别猛烤厚电极"],
    ["NMP 是能耗大户", "干燥与溶剂回收约占制造能耗 47%；NMP 必须冷凝、吸附、回收"],
    ["辊压是在选孔隙率", "ε = 1 − ρ涂层/ρ真；压得越密，能量越高，离子路越绕；研究级 30–35%，商用 20–25%"],
    ["干法电极：去掉溶剂", "PTFE 剪切成纤维、压成膜；Maxwell → Tesla 2019；负极上 PTFE 不稳定仍待解决"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.05;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.confidence.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.confidence.zh}  —— ${Q.confidence.ref}`, options: { fontSize: 14, color: "CADCE8" } },
  ], { x: 0.7, y: 5.95, w: 11.9, h: 0.95, margin: 0, valign: "middle", isTextBox: true });
  s.addNotes("电极做好了，下一章进入实验室：把电极冲成小圆片，在手套箱里组装成 CR2032 扣式电池并做第一次测试。记住本章的两个数字：你的电极孔隙率是多少，装电池前水分有没有烘干——它们会直接出现在你的测试曲线里。");

  await d.write(outFile);
  await applyTheme(outFile, THEME);
  return { outFile, figDir };
}

module.exports = { build };

if (require.main === module) {
  const [out, figDir] = process.argv.slice(2);
  build(out, figDir).then((r) => console.log("wrote", r.outFile));
}
