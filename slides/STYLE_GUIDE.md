# 章节幻灯片制作规范（所有论文、所有章节通用）

参考样板：`src/lopez2019/ch1.js` + `src/lopez2019/ch1_figs.js`，成品 `decks/lopez2019/lopez2019_ch1.pptx`。新章节必须在视觉和结构上与它一致。

## 1. 语言
- 简体中文。重要术语首次出现时附英文原词，如 固体电解质界面膜 (SEI)、迁移数 (transference number)。
- 专有名词、软件名、化学式、代码保留英文。
- **简单易懂**：面向刚入门的研究生。一句话只讲一件事；能用比喻就用比喻；公式要解释每个符号。
- 正文 ≥ 14 pt，图注 10–12 pt，不要再小。文字放不下就删字或拆页，不要缩字号。

## 2. 每个概念页必须有
- **史 (hist)**：这个概念/方法的历史——年份、人物、贡献（谁在哪一年做了什么）。每个概念都要有。
- **变 (why)**：以前怎么做 → 为什么改成现在这样（为什么科学家用这个方法/这个表达式）。
- **要 (matters)**：为什么重要，写在该概念自己的页上，**不要**集中到一页。
- 用 `d.block()` / `d.column()` 生成这三种块（kind 分别为 `hist` / `why` / `matters`），另有 `def`（定义）、`note`（校注）。
- **引 (quote)**：每章 4–7 处原文金句，`d.quote({ en, zh })`。英文必须与 PDF 原文逐字一致（可用 `…` 省略中间部分），附中文翻译。不得编造或改写引文。

## 3. 插图
- 多用 SVG 插图，每章 10–18 幅，结构清晰、质量高。原文的示意图要用 SVG 重绘（不要截图），并在图注写“据原文 Fig. Xx 重绘”。
- 用 `src/svglib.js` 的工具（`text`、`lines`、`arrow`、`ion`、`electron`、`blob`、`timeline`、`pill`、`check`、`cross` 等）。化学式用 `Li_{2}S`、`Li^{+}` 写法。
- 只用基础 SVG：rect/circle/ellipse/line/polyline/polygon/path/text/tspan/g（含 transform）。**不要**用 marker、CSS/style、filter、foreignObject、外部字体或图片。
- 字号检查：SVG 中文字号 × (放到幻灯片上的宽度英寸 ÷ 画布宽度像素) × 72 ≥ 11 pt。图里少放字，解释文字放在幻灯片文本框里。
- 有数据的图（条形、折线、散点）优先用 pptxgenjs 原生图表 `s.addChart`，样式参照第 1 章的两张图。
- 每章开头的历史/发展时间线用 `timeline()`。
- 颜色只用 `svglib.COL` 与 `decklib.HEX` 中的调色板。

## 4. 每章结构（15–24 页）
1. `DARK_TITLE` 标题页：“第 N 章\n<问句或核心标题>”，副标题，底部完整引用，右侧主题 SVG。
2. 路线图页：本章 3–5 个要点（编号卡片）+ 与上一章的衔接。每篇论文的**第 1 章**还要有“阅读标签”图例（照抄 Lopez 第 1 章第 2 页）。
3. 若干小节：每节可用 `DARK_SECTION` 分隔页；概念页图文并茂，版式要有变化（左图右文、上图下文、大数字、原生图表、时间轴）。
4. 若发现原文笔误或数值不一致，加一页“阅读校注”（kind `note`），写清页码、原文、正确内容和依据。
5. `DARK_SECTION` 小结页：3–5 条要点 + 一句原文金句。
- 每张幻灯片用 `s.addNotes()` 写 2–4 句讲稿式补充说明。
- 页脚由版式自动生成，不要手动加。

## 5. 准确性
- 历史事实只写你有把握的。不确定具体年份时写年代（如“1970 年代”），并在最终报告里列出“把握较低的历史条目”。
- 数值以原文为准；自己补充的数值要可推导或公认，图注说明来源。
- 发现原文错误要指出，不要盲目照抄。

## 6. 文件与构建
- 每章两个文件：`src/<paper>/ch<N>_figs.js`（导出 `figs` 对象，每个值是返回 SVG 字符串的函数）和 `src/<paper>/ch<N>.js`（照第 1 章写法，`build(outFile, figDir)`）。
- 构建：在 `slides/` 下运行 `./build.sh <paper> <N>`，输出 `decks/<paper>/<paper>_ch<N>.pptx`，并自动通过 validate。
- **不要修改** `src/svglib.js`、`src/decklib.js`、`src/postprocess.py`、`src/render_svgs.js`、`build.sh`。需要新工具函数就写在自己的 `_figs.js` 里。
- **不要 git commit / push**，由主会话统一提交。

## 7. 视觉检查（必须）
```bash
python3 $PPTX_SKILL/scripts/office/soffice.py --headless --convert-to pdf --outdir <你的临时目录> decks/<paper>/<paper>_ch<N>.pptx
pdftoppm -jpeg -r 80 <临时目录>/<paper>_ch<N>.pdf <临时目录>/s
```
逐页查看：文字溢出/截断、元素重叠、离页脚太近（内容底边 ≤ 6.88"）、数字和单位被拆行（用 ` ` 连接）、SVG 内文字互相压住。修好后重新构建再看一遍。
（LibreOffice 预览用文泉驿字体代替微软雅黑，中英混排间距略宽属正常。）
