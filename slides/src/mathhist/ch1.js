// 数学发展史 — 第 1 章：古代文明（埃及与美索不达米亚，约公元前 3000–600 年）
const fs = require("fs");
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const Q = require("./ch1_quotes");

const PAPER = {
  short: "数学发展史",
  full: "数学发展史 · 从计数到证明的五千年（按时代分 7 章）。本章主要参考：E. Robson, Mathematics in Ancient Iraq (2008)；A. Imhausen, Mathematics in Ancient Egypt (2016)；J. Høyrup, Lengths, Widths, Surfaces (2002)；MacTutor 数学史档案；大英博物馆、耶鲁巴比伦藏品馆藏资料。",
};

const IMG = path.join(__dirname, "img");
const META = JSON.parse(fs.readFileSync(path.join(IMG, "meta.json"), "utf8"));

async function build(outFile, figDir) {
  const info = await renderAll(path.join(__dirname, "ch1_figs.js"), figDir);
  const d = new Deck({ paper: PAPER, chapter: 1, chapterTitle: "古代文明：埃及与美索不达米亚", figDir });
  d.registerFigs(info);
  const C = d.C;

  // Real photograph, fitted into a box, with a credit line underneath.
  const photo = (s, key, box, o = {}) => {
    const m = META[key];
    const ar = m.w / m.h;
    let w = box.w, h = box.w / ar;
    if (h > box.h) { h = box.h; w = h * ar; }
    const x = box.x + (box.w - w) / 2;
    const y = o.top ? box.y : box.y + (box.h - h) / 2;
    s.addImage({ path: path.join(IMG, m.file), x, y, w, h, altText: m.alt, objectName: `photo-${key}` });
    d.caption(s, m.credit, { x: box.x, y: y + h + 0.05, w: box.w, h: 0.45 }, { size: 10 });
    return { x, y, w, h };
  };
  const card = (s, x, y, w, h, fill = "F5F7F9") =>
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });

  // ---------------- 1. Title ----------------
  d.section("开篇");
  let s = d.slide("DARK_TITLE");
  s.addText("第 1 章\n人类为什么开始做数学？", { placeholder: "title" });
  s.addText("古代文明：埃及与美索不达米亚（约公元前 3000–600 年）", { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 5.95, w: 7.6, h: 1.0, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  d.fig(s, "title_motif", { x: 8.7, y: 1.0, w: 4.1, h: 5.5 });
  s.addNotes("本章讲数学最早的两大源头：尼罗河边的古埃及和两河流域的美索不达米亚（巴比伦）。核心问题：数学一开始是为了解决什么问题？答案很实际——记账、分粮、丈量土地、建造工程。右图上方是巴比伦泥板上的六十进制数字（YBC 7289 的 √2），下方是埃及象形数字。");

  // ---------------- 2. Roadmap + reading key ----------------
  s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const steps = [
    ["1", "计数的起源", "刻痕、陶筹，到“抽象的数”"],
    ["2", "古埃及", "象形数字、倍增乘法、单位分数、面积与体积"],
    ["3", "美索不达米亚", "六十进制位值制、√2、勾股数、配方法"],
    ["4", "对比与小结", "两种数学传统各给我们留下了什么"],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.3;
    card(s, 0.6, y, 6.3, 1.08);
    s.addText(n, { shape: d.pres.shapes.OVAL, x: 0.82, y: y + 0.24, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.65, y: y + 0.14, w: 5.0, h: 0.42, fontSize: 20, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.65, y: y + 0.56, w: 5.1, h: 0.38, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText("每个概念页的阅读标签", { x: 7.5, y: 1.45, w: 5.2, h: 0.45, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  const keys = [
    ["hist", "历史 History", "哪一年、谁、做了什么"],
    ["why", "以前 → 为什么", "之前怎么做，为什么改成这样"],
    ["matters", "为什么重要", "这个概念后来派上了什么用场"],
    ["quote", "原始文献金句", "古代文献或经典译本的原句 + 中文"],
  ];
  keys.forEach(([k, h, b], i) => {
    const y = 2.1 + i * 1.12;
    d.chip(s, 7.5, y + 0.05, k, 0.62);
    s.addText(h, { x: 8.35, y, w: 4.4, h: 0.4, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 8.35, y: y + 0.4, w: 4.4, h: 0.38, fontSize: 14, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
  d.caption(s, "说明：数学史没有一本统一的“原书”，“引”取自原始文献的权威英译本，每句后注明出处。", { x: 7.5, y: 6.55, w: 5.25, h: 0.4 });
  s.addNotes("这套幻灯片按时代分 7 章：古代文明 → 古希腊 → 中国与印度 → 伊斯兰黄金时代 → 文艺复兴与科学革命 → 18–19 世纪 → 现代。每个概念页都用同样的四个标签：史、变、要、引。");

  // ---------------- 3. Era timeline ----------------
  s = d.slide("CONTENT");
  s.addText("历史：从刻痕到泥板上的方程", { placeholder: "title" });
  d.fig(s, "era_timeline", { x: 0.5, y: 1.15, w: 12.3, h: 4.25 });
  d.block(s, { x: 0.6, y: 5.45, w: 5.9, kind: "why", tint: true, body: "以前人们以为数学始于古希腊。19–20 世纪破译了纸草书和楔形文字泥板后才发现：早在希腊之前一千多年，埃及和巴比伦就有了相当成熟的数学。" });
  d.block(s, { x: 6.8, y: 5.45, w: 5.9, kind: "matters", tint: true, body: "本章的两项发明今天每天都在用：十进制（埃及等多地），以及位值制和 60 分钟、360°（巴比伦）。" });
  s.addNotes("时间轴不按比例，“前”指公元前，年份多为约数。灰色是史前，橙色是埃及，青色是美索不达米亚。注意两地并行发展：埃及的数学纸草书和巴比伦的数学泥板大致都集中在公元前 1900–1550 年前后。");

  // ---------------- 4. Counting origin ----------------
  d.section("1 计数的起源");
  s = d.slide("CONTENT");
  s.addText("从刻痕到数字：“数”是怎么被发明的", { placeholder: "title" });
  d.fig(s, "counting_origin", { x: 0.5, y: 1.15, w: 12.3, h: 3.8 });
  const c3 = [0.6, 4.75, 8.9];
  d.block(s, { x: c3[0], y: 5.0, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.ishango });
  d.block(s, { x: c3[1], y: 5.0, w: 3.95, kind: "why", tint: true, size: 13, body: "以前：一个陶筹对应一样东西，数量大了就得捏一大堆。后来在泥板上写“数字 + 物品符号”，省事，还能记任意大的数。" });
  d.block(s, { x: c3[2], y: 5.0, w: 3.85, kind: "matters", tint: true, size: 13, body: "同一个“5”可以数羊，也可以数油罐。把数从具体东西中抽出来，是一切数学的起点。" });
  s.addNotes(Q.notes.counting);

  // ---------------- 5. Egypt divider ----------------
  d.section("2 古埃及");
  s = d.slide("DARK_SECTION");
  s.addText("古埃及：尼罗河边的实用数学", { placeholder: "title" });
  s.addText("象形数字 · 倍增乘法 · 单位分数 · 圆面积 · 斜率 · 截头棱锥体积", { placeholder: "body" });

  // ---------------- 6. Egyptian numerals ----------------
  s = d.slide("CONTENT");
  s.addText("埃及象形数字：每个 10 的幂一个符号", { placeholder: "title" });
  d.fig(s, "egypt_numerals", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "符号为简化示意画法。埃及人多从右往左书写，这里为方便阅读改为从左往右。", { x: 0.6, y: 5.95, w: 6.8, h: 0.5 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.narmer },
    { kind: "why", body: "以前用刻痕一一对应，数大了根本刻不完。改成“满十换一个新符号”，几百万也只要几个符号。" },
    { kind: "matters", body: "十进制从此成了最常见的计数方式（人有 10 根手指）。但没有位值制，每次计算都要数一大堆符号。" },
  ]);
  s.addNotes("这是“加法记数制”：数值等于所有符号代表值之和，符号顺序不影响数值。对比后面的巴比伦位值制：同一个符号放在不同位置代表不同的值。");

  // ---------------- 7. Rhind papyrus ----------------
  s = d.slide("CONTENT");
  s.addText("莱因德纸草书：一本 3500 年前的“习题集”", { placeholder: "title" });
  photo(s, "rhind", { x: 0.5, y: 1.25, w: 6.9, h: 3.95 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", size: 13, body: Q.facts.rhind },
    { kind: "why", size: 13, body: "以前数学靠师傅口传。写成“题目 + 解法 + 验算”的格式，抄写员就能照着练——这是现存最早的数学教科书之一。" },
    { kind: "matters", size: 13, body: "我们今天对埃及数学的了解，大部分来自这一卷和莫斯科纸草书。" },
  ], 0.16);
  d.quote(s, Q.rhindOpening);
  s.addNotes(Q.notes.rhind);

  // ---------------- 8. Doubling multiplication ----------------
  s = d.slide("CONTENT");
  s.addText("埃及乘法：只会“翻倍”就能做乘法", { placeholder: "title" });
  d.fig(s, "egypt_multiply", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: "Rhind 纸草书（约前 1550 年）里的乘除法全部用倍增法 (doubling) 完成，除法就是把乘法倒过来做。" },
    { kind: "why", body: "我们靠背九九乘法表。埃及抄写员只需要会“翻倍”和“相加”两种操作，不用背表，学起来简单，也不容易出错。" },
    { kind: "matters", body: "这其实就是二进制。计算机做乘法、密码学里的快速幂 (fast exponentiation) 算法，用的都是“翻倍 + 相加”。" },
  ]);
  s.addNotes("为什么一定能凑出来？因为任何正整数都能唯一地写成若干个不同的 2 的幂之和（即二进制表示）。13 = 8 + 4 + 1，所以 13 × 12 = 8×12 + 4×12 + 1×12。这个方法后来被称为“俄罗斯农夫乘法”。");

  // ---------------- 9. Unit fractions ----------------
  s = d.slide("CONTENT");
  s.addText("单位分数：埃及人只用“几分之一”", { placeholder: "title" });
  d.fig(s, "unit_fractions", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.loaves },
    { kind: "why", body: "埃及人只承认 1/n 这种分数（外加 2/3）。看起来别扭，但分实物很方便：每人先拿 2/3 个，再拿 1/5 个，再拿 1/30 个，人人一样多。" },
    { kind: "matters", body: "单位分数问题今天仍有人研究，例如 1948 年提出、至今未解决的 Erdős–Straus 猜想：4/n 总能写成三个单位分数之和吗？" },
  ]);
  s.addNotes("验算：2/3 + 1/5 + 1/30 = 20/30 + 6/30 + 1/30 = 27/30 = 9/10。为什么不直接写 9/10？埃及记数法里没有“分子”的写法，只能在数字上方加一个“嘴”形符号（读作 r）表示“几分之一”。同一个分母不能重复用，所以 2/5 不能写成 1/5 + 1/5，要查 2/n 表得到 1/3 + 1/15。");

  // ---------------- 10. Circle area ----------------
  s = d.slide("CONTENT");
  s.addText("圆的面积：直径去掉 1/9 再平方", { placeholder: "title" });
  d.fig(s, "circle_area", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "八边形示意据 Rhind 第 48 题的配图思路重绘（该图的解读学界仍有讨论）。", { x: 0.6, y: 5.95, w: 6.8, h: 0.5 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: "Rhind 第 50 题：直径 9 的圆形田地，面积等于边长 8 的正方形，即 64。第 48 题画的像是正方形里的八边形。" },
    { kind: "why", body: "当时没有 π 这个概念，也没有“πr²”这种公式。埃及人给的是一条操作规则：直径减掉 1/9，再平方。好记，好算。" },
    { kind: "matters", body: "这是现存最早的圆面积近似之一，误差约 0.6%。约 1300 年后，阿基米德才证明 π 在 3.1408 与 3.1429 之间（第 2 章）。" },
  ]);
  s.addNotes("推导：A = (8d/9)² = (64/81)d²。和 A = πd²/4 比较，得 π = 4 × 64/81 = 256/81 ≈ 3.1605。八边形思路：9×9 的正方形切掉四个角（每个角是 3×3 的一半，面积 4.5），剩下 81 − 18 = 63，接近 64 = 8²。");

  // ---------------- 11. Seked ----------------
  s = d.slide("CONTENT");
  s.addText("seked：古埃及人怎么描述金字塔的坡度", { placeholder: "title" });
  d.fig(s, "seked", { x: 0.5, y: 1.25, w: 6.9, h: 4.38 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.seked },
    { kind: "why", body: "当时还没有“度数”的概念（360° 来自巴比伦，后经希腊传开）。用“每升高 1 腕尺水平退几掌”这种比值，工匠拿尺子就能直接施工。" },
    { kind: "matters", body: "用两条边的比值描述倾斜，正是三角学 (Trigonometry) 里正切、余切的思想。" },
  ]);
  d.quote(s, Q.herodotus);
  s.addNotes("算一算：tan θ = 7 ÷ 5.5 ≈ 1.273，θ ≈ 51.8°，与胡夫大金字塔实测的约 51.8° 一致。希罗多德的说法反映了希腊人自己的看法：几何起源于埃及的土地丈量。现代学者认为这个说法有道理但过于简化。");

  // ---------------- 12. Moscow frustum ----------------
  s = d.slide("CONTENT");
  s.addText("莫斯科纸草书：截头棱锥的体积", { placeholder: "title" });
  d.fig(s, "frustum", { x: 0.5, y: 1.25, w: 6.9, h: 4.38 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.moscow },
    { kind: "why", body: "埃及：只给计算步骤，不给理由。后来的希腊人（第 2 章）要求从公理一步步推出结论——这就是“证明”的诞生。" },
    { kind: "matters", body: "这个公式完全正确。在微积分出现之前，算这类立体的体积需要非常巧妙的切割和拼补。" },
  ]);
  s.addNotes("截头棱锥 (frustum) 就是把金字塔顶部水平切掉后剩下的部分。题目给出：高 6，底面边长 4，顶面边长 2。埃及人怎么得到这个公式，至今没有定论；一种推测是把立体切成小块再重新拼合。");

  // ---------------- 13. Mesopotamia divider ----------------
  d.section("3 美索不达米亚");
  s = d.slide("DARK_SECTION");
  s.addText("美索不达米亚：泥板上的算法", { placeholder: "title" });
  s.addText("六十进制位值制 · 倒数表 · √2 · 勾股数 · 二次方程", { placeholder: "body" });

  // ---------------- 14. Cuneiform & place value ----------------
  s = d.slide("CONTENT");
  s.addText("六十进制位值制：两个符号写出所有数", { placeholder: "title" });
  d.fig(s, "cuneiform", { x: 0.5, y: 1.25, w: 6.9, h: 4.6 });
  d.caption(s, "现代转写习惯：逗号分隔各位，分号相当于“小数点”。泥板上其实没有这两个记号。", { x: 0.6, y: 5.95, w: 6.8, h: 0.5 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.placeValue },
    { kind: "why", body: "埃及式记数每个量级一个符号，数越大符号越多。位值制只要两个符号：同一个记号放在不同位置，就代表 1、60、3600……" },
    { kind: "matters", body: "位值制是巴比伦最大的发明，后来经印度传入（第 3 章），演变成今天的十进制。缺点：没有零和小数点，同一个符号可能是 1、60 或 1/60。" },
  ]);
  s.addNotes("类比：今天的“浮点数”只记有效数字，数量级另外判断；巴比伦的数也只记有效数字，数量级要靠上下文。约前 700 年（基什泥板）才出现表示“空位”的占位符号，塞琉古时期（约前 300 年）普及，但它从不放在数的末尾，所以还不是真正的零。");

  // ---------------- 15. Why 60 + reciprocals ----------------
  s = d.slide("CONTENT");
  s.addText("为什么是 60？倒数表把除法变成乘法", { placeholder: "title" });
  d.fig(s, "divisors", { x: 0.5, y: 1.2, w: 6.6, h: 3.7 });
  d.fig(s, "reciprocals", { x: 7.6, y: 1.2, w: 5.1, h: 3.7 });
  d.block(s, { x: c3[0], y: 5.05, w: 3.95, kind: "hist", tint: true, size: 13, body: "古巴比伦学生的必修课是抄写标准倒数表 (reciprocal table)。为什么选 60 作底数，至今没有定论。" });
  d.block(s, { x: c3[1], y: 5.05, w: 3.95, kind: "why", tint: true, size: 13, body: "除法很难，巴比伦人就把 a ÷ b 变成 a × (1/b)：先查表找 1/b，再做乘法。60 的因数多，表里的“好数”就多。" });
  d.block(s, { x: c3[2], y: 5.05, w: 3.85, kind: "matters", tint: true, size: 13, body: "1 小时 = 60 分、1 分 = 60 秒、圆周 = 360°，都是巴比伦六十进制留到今天的痕迹。" });
  s.addNotes("倒数表的读法：8 的倒数是 7;30，即 7/60 + 30/3600 = 0.125 = 1/8。只含因子 2、3、5 的数（如 8、9、12、16、18）倒数都能写成有限位的六十进制小数，叫“正则数” (regular number)。7 的倒数是无限循环小数，所以标准表里干脆不列。");

  // ---------------- 16. YBC 7289 ----------------
  s = d.slide("CONTENT");
  s.addText("YBC 7289：精确到百万分之一的 √2", { placeholder: "title" });
  photo(s, "ybc", { x: 0.5, y: 1.25, w: 3.9, h: 4.6 });
  d.fig(s, "ybc7289", { x: 4.5, y: 1.25, w: 3.9, h: 4.6 });
  d.column(s, 8.65, 1.35, 4.1, [
    { kind: "hist", size: 13, body: Q.facts.ybc },
    { kind: "why", size: 13, body: "泥板没写算法。常见推测是“取平均”迭代：猜 x，再取 x 与 2/x 的平均，越算越准（后称 Heron 法）。但这只是推测。" },
    { kind: "matters", size: 13, body: "1;24,51,10 ≈ 1.41421296，误差不到百万分之一。说明巴比伦人已经掌握了相当精确的近似计算。" },
  ]);
  s.addNotes("“取平均”迭代：x₁ = 1.5，x₂ = (1.5 + 2/1.5)/2 ≈ 1.41667，x₃ ≈ 1.414216，两步就接近泥板上的值。这个方法就是牛顿法 (Newton's method) 用于 x² = 2 的特例。另一种观点（Fowler & Robson 1998）认为巴比伦人是用几何“剪切拼补”的方法逐步逼近的。");

  // ---------------- 17. Plimpton 322 photo ----------------
  s = d.slide("CONTENT");
  s.addText("Plimpton 322：一块写满勾股数的泥板", { placeholder: "title" });
  photo(s, "plimpton", { x: 0.5, y: 1.25, w: 6.9, h: 4.85 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.plimpton },
    { kind: "why", body: "以前人们以为“勾股定理”是毕达哥拉斯（约前 570 年）的发现。这块泥板说明：早一千多年，巴比伦人已经会成批地造出勾股数。" },
    { kind: "matters", body: "它是现存最早的“数论表”之一，也是数学史上被讨论最多的泥板。" },
  ]);
  s.addNotes("泥板左边断了一块，原来可能还有更多列。现存 4 列：第 1 列与比值有关，第 2、3 列是直角三角形的短边和对角线（斜边），第 4 列是行号 1–15。表中有几处抄写错误，学者正是通过这些错误推测它的计算过程。");

  // ---------------- 18. Plimpton 322 reading ----------------
  s = d.slide("CONTENT");
  s.addText("怎么读 Plimpton 322：119、120、169", { placeholder: "title" });
  d.fig(s, "plimpton", { x: 0.5, y: 1.25, w: 6.9, h: 4.38 });
  d.column(s, 7.75, 1.35, 5.0, [
    { kind: "hist", body: Q.facts.plimptonDebate },
    { kind: "why", body: "直接试数很难找到 119–120–169。用 p、q 两个“好数”来造，再求倒数，正好发挥巴比伦人最擅长的倒数表。" },
    { kind: "matters", body: "勾股数 a² + b² = c² 后来引出了丢番图方程、费马大定理（1995 年才被证明，第 7 章）。" },
  ]);
  s.addNotes("现代通式：a = p² − q²，b = 2pq，c = p² + q²（p > q > 0）。第 1 行对应 p = 12、q = 5。p、q 只含因子 2、3、5，所以相关比值都能写成有限的六十进制小数——这和倒数表的“正则数”是同一件事。");

  // ---------------- 19. Completing the square ----------------
  s = d.slide("CONTENT");
  s.addText("巴比伦代数：用“剪切拼补”解二次方程", { placeholder: "title" });
  d.fig(s, "complete_square", { x: 1.15, y: 1.15, w: 11.0, h: 3.82 });
  d.block(s, { x: c3[0], y: 5.1, w: 3.95, kind: "hist", tint: true, size: 13, body: Q.facts.bm13901 },);
  d.block(s, { x: c3[1], y: 5.1, w: 3.95, kind: "why", tint: true, size: 13, body: "没有字母和符号，题目全用文字写。Høyrup 提出：这些步骤其实是在“剪切、拼补”正方形和长方形。" });
  d.block(s, { x: c3[2], y: 5.1, w: 3.85, kind: "matters", tint: true, size: 13, body: "这就是配方法。约 2600 年后，花拉子米（第 4 章）用同样的几何图解释二次方程。" });
  s.addNotes("题目：一个正方形的面积加上边长等于 3/4（原文写作 45′，即 45/60），求边长。现代写法 x² + x = 3/4。步骤：把“边长 × 1”的长条劈成两半，挪一半到下面，补上 ½ × ½ 的小角，得到边长 x + ½ 的大正方形，面积 3/4 + 1/4 = 1，所以 x + ½ = 1，x = ½。");

  // ---------------- 20. Rhetorical algebra ----------------
  s = d.slide("CONTENT");
  s.addText("没有符号的代数：BM 13901 原文怎么写", { placeholder: "title" });
  const rows = Q.bm13901.rows.map(([en, zh, mod], i) => [
    { text: en, options: { italic: true, color: HEX.dk1, fill: { color: i % 2 ? "FFFFFF" : "F5F7F9" } } },
    { text: zh, options: { color: HEX.dk1, fill: { color: i % 2 ? "FFFFFF" : "F5F7F9" } } },
    { text: mod, options: { color: HEX.accent2, bold: true, fill: { color: i % 2 ? "FFFFFF" : "F5F7F9" } } },
  ]);
  s.addTable(
    [[
      { text: "泥板原文（Høyrup 英译）", options: { bold: true, color: "FFFFFF", fill: { color: HEX.accent2 } } },
      { text: "意思", options: { bold: true, color: "FFFFFF", fill: { color: HEX.accent2 } } },
      { text: "现代写法", options: { bold: true, color: "FFFFFF", fill: { color: HEX.accent2 } } },
    ], ...rows],
    { x: 0.6, y: 1.3, w: 12.1, colW: [5.2, 4.3, 2.6], fontSize: 14, fontFace: "Calibri", valign: "middle", border: { type: "solid", pt: 0.5, color: "D5DCE2" }, rowH: 0.5 }
  );
  d.block(s, { x: 0.6, y: 4.75, w: 5.9, kind: "why", tint: true, body: "以前（巴比伦、埃及）：代数全用文字叙述，叫“修辞代数” (rhetorical algebra)。丢番图（约 250 年）开始用缩写，16–17 世纪韦达、笛卡尔才有今天的字母符号（第 5 章）。" });
  d.block(s, { x: 6.8, y: 4.75, w: 5.9, kind: "matters", tint: true, body: "巴比伦人每次都用具体数字讲一道题。有了符号，才能写出一条公式解决一整类方程，推理也短得多。" });
  s.addNotes(Q.notes.bm13901);

  // ---------------- 21. π comparison ----------------
  d.section("4 对比与小结");
  s = d.slide("CONTENT");
  s.addText("两大文明的 π：都不是“一个数”，而是一条规则", { placeholder: "title" });
  s.addChart(d.pres.charts.BAR, [{ name: "相对误差", labels: ["巴比伦常用 3", "巴比伦苏萨泥板 3.125", "埃及 Rhind 3.1605"], values: [4.51, 0.53, 0.60] }], {
    x: 0.6, y: 1.3, w: 6.4, h: 4.6, barDir: "bar",
    chartColors: [HEX.accent2, HEX.accent2, HEX.accent1],
    showValue: true, dataLabelFormatCode: "0.00\"%\"", dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 13, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 5.5,
    showTitle: true, title: "与真值 π = 3.14159… 的相对误差（%）", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showLegend: false,
  });
  d.column(s, 7.4, 1.35, 5.35, [
    { kind: "hist", body: Q.facts.susa },
    { kind: "why", body: "两地都没把 π 当作一个需要研究的“数”，只给出算圆面积、周长的实用规则。把 π 当成必须精确求出的常数，要等到阿基米德（第 2 章）。" },
    { kind: "matters", body: "工程上 1% 的误差够用。但“这条规则到底准不准”的追问，后来推动了证明和极限思想。" },
  ]);
  s.addNotes("计算：|3 − π|/π ≈ 4.51%；|3.125 − π|/π ≈ 0.53%；|3.1605 − π|/π ≈ 0.60%。巴比伦的 3;7,30 稍小于 π，埃及的 256/81 稍大于 π，两者精度相当。");

  // ---------------- 22. Compare ----------------
  s = d.slide("CONTENT");
  s.addText("对比：埃及与巴比伦，两种数学传统", { placeholder: "title" });
  d.fig(s, "compare", { x: 0.5, y: 1.15, w: 12.3, h: 4.45 });
  d.block(s, { x: 0.6, y: 5.7, w: 12.1, kind: "matters", tint: true, body: "我们看到的历史有“幸存者偏差”：泥板耐火耐埋，纸草容易腐烂。巴比伦数学显得更先进，部分原因是它留下的文献多得多。" });
  s.addNotes("两者的共同点：都以解决实际问题为主（记账、分配、测量、建筑），都只给算法、不给一般性证明，都用具体数字讲题而没有一般公式。这些特点在第 2 章古希腊那里发生了根本变化。");

  // ---------------- 23. Reading notes ----------------
  s = d.slide("CONTENT");
  s.addText("阅读校注：常见说法与需要更正的地方", { placeholder: "title" });
  const notes = Q.corrections;
  notes.forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    d.block(s, { x: col ? 6.8 : 0.6, y: 1.35 + row * 1.85, w: 5.9, kind: "note", tint: true, size: 13, head: n.head, body: n.body });
  });
  s.addNotes("这一页记录本章制作时核对过的几处容易出错的说法。第一条是对本仓库 math-history-timeline.svg（数学发展史时间轴）的更正，SVG 已同步修改。");

  // ---------------- 24. Summary ----------------
  d.section("小结");
  s = d.slide("DARK_SECTION");
  s.addText("本章小结", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const sum = [
    ["数学起源于记账和测量", "刻痕 → 陶筹 → 数字：数从具体东西中被抽象出来"],
    ["埃及：十进制 + 加法记数 + 单位分数", "倍增法做乘法；圆面积 (8d/9)²；seked 描述坡度；截头棱锥体积公式"],
    ["巴比伦：六十进制位值制", "倒数表把除法变乘法；√2 ≈ 1;24,51,10；Plimpton 322 勾股数；配方法"],
    ["共同点：只讲“怎么算”，不讲“为什么对”", "下一章：古希腊人把数学变成需要证明的学问"],
  ];
  sum.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.08;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.5, y, w: 11.1, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, fontSize: 15, color: "CADCE8", margin: 0, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: `“${Q.aristotle.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
    { text: `${Q.aristotle.zh}  —— ${Q.aristotle.ref}`, options: { fontSize: 14, color: "CADCE8" } },
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
