# 综述精读幻灯片

把仓库根目录下的 4 篇综述逐章做成中文幻灯片 (.pptx)。制作规范见 `STYLE_GUIDE.md`。所有章节共用同一套主题、版式和插图库，保证风格一致。

## 已完成（4 篇 · 24 章 · 534 页）

| 论文 | 章节（页数） | 目录 |
|---|---|---|
| Lopez et al. 2019, *Designing polymers for advanced battery chemistries* | 1 引言与先进电池体系 (22) · 2 粘结剂与隔膜的力学设计 (24) · 3 锂离子传输：聚合物电解质 (24) · 4 电子传输：导电高分子 (20) · 5 化学相互作用设计 (21) · 6 稳定界面设计 (19) · 7 安全设计与结语 (24) | `decks/lopez2019/` |
| Manthiram et al. 2017, *Lithium battery chemistries enabled by solid-state electrolytes* | 1 引言与固态电解质发展史 (23) · 2 无机固态电解质 (22) · 3 聚合物、复合与薄膜固态电解质 (19) · 4 全固态锂离子电池 (23) · 5 搭配液/气态电极的固态电解质 (24) · 6 介体离子固态电解质与展望 (23) | `decks/manthiram2017/` |
| Zhao et al. 2020, *Designing solid-state electrolytes for safe, energy-dense batteries* | 1 引言与固态电解质发展史 (23) · 2 离子传输机理与路径 (22) · 3 锂/钠与多价离子固态电解质 (24) · 4 失效模式 (23) · 5 设计策略 (21) · 6 高能量密度电池体系与展望 (22) | `decks/zhao2020/` |
| Ko et al. 2026, *Electrolyte design for future batteries* | 1 引言：电解质不只是传导离子 (20) · 2 电极电位的大幅移动 (24) · 3 计算预测 (22) · 4 界面相：概念演变与动力学 (22) · 5 理性界面设计、挑战与结论 (23) | `decks/ko2026/` |

原文笔误、存疑之处和把握较低的历史条目见 `REVIEW_NOTES.md`。

## 每页的四种阅读标签

- **史** 历史 History：年份、人物、贡献
- **变** 以前怎么做 → 为什么这样做
- **要** 为什么重要 Why it matters（放在各自的概念页上）
- **引** 原文金句（英文原句 + 中文翻译）

另有 **义**（定义）和 **注**（校注，记录原文笔误）两种辅助标签。

## 构建

```bash
export PPTX_SKILL=<pptx skill 目录>      # 需要其中的 apply_theme.js 和 validate.py
./build.sh lopez2019 1
```

- `src/svglib.js`：SVG 绘图工具（箭头、离子、时间轴等），只用 PowerPoint 能渲染的基础 SVG 特性
- `src/decklib.js`：主题、版式和“史/变/要/引”组件
- `src/<paper>/chN_figs.js`：该章的 SVG 插图；`src/<paper>/chN.js`：该章幻灯片内容
- `src/postprocess.py`：pptxgenjs 在 Node 里无法为 SVG 生成 PNG 备用图，这一步用 Chromium 渲染的 PNG 替换，并把中文主题字体设为微软雅黑

插图以 SVG 嵌入：PowerPoint 2016 及以上 / Microsoft 365 显示矢量图，旧版本显示高分辨率 PNG。
