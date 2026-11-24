// 第 1 章的史实、引文与校注。引文均与所列英译本逐字一致（核对来源见 REVIEW_NOTES.md）。
module.exports = {
  facts: {
    ishango: "伊尚戈骨（1950 年在刚果发现，约 2 万年前）刻有成组刻痕。Schmandt-Besserat 提出：约前 7500 年起西亚人用陶筹记账。",
    narmer: "约前 3100 年的那尔迈权标头 (Narmer Macehead) 上，已用这套符号记下战利品：12 万俘虏、40 万头牛、142.2 万只山羊。",
    rhind: "抄写员阿赫摩斯 (Ahmes) 约前 1550 年抄成，底本约前 1850 年。1858 年 Rhind 在卢克索买下，1865 年入藏大英博物馆。全长约 5 米，84 道题。",
    loaves: "Rhind 第 1–6 题：把 1、2、6、7、8、9 个面包分给 10 人，第 6 题就是 9 个面包。书开头的 2/n 表给出 2/3 到 2/101（n 为奇数）的拆法。",
    seked: "Rhind 第 56–60 题都在算 seked（第 60 题是圆锥）。长度单位：1 腕尺 (cubit) = 7 掌 (palm)，1 掌 = 4 指。",
    moscow: "内容约属前 1850 年（抄本可能晚到前 18 世纪）。1892–93 年俄国学者 Golenishchev 在底比斯购得，现藏莫斯科普希金博物馆，共 25 题。",
    placeValue: "约前 3200 年乌鲁克泥板上已有数字。约前 2100 年，乌尔第三王朝 (Ur III) 的书吏为管理国家账目，开始用六十进制位值制计算。",
    ybc: "耶鲁巴比伦藏品 YBC 7289，约前 1800–1600 年的圆形学生练习泥板。1945 年 Neugebauer 与 Sachs 在《楔形文字数学文献》中解读了它。",
    plimpton: "约前 1800 年（Robson：前 1822–1784 年），据说出土于拉尔萨 (Larsa)。约 1922 年 Plimpton 从古董商 Banks 处购得，1936 年遗赠哥伦比亚大学。",
    plimptonDebate: "1945 年 Neugebauer 与 Sachs 读作数论表；2001 年 Robson 认为是老师出题用的参数表；2017 年 Mansfield 与 Wildberger 称之为“三角函数表”，学界多有异议。",
    bm13901: "大英博物馆藏 BM 13901，约前 1800 年的二次问题汇编。1990 年起 Høyrup 提出“剪切拼补”解读，2002 年专著系统阐述。",
    susa: "巴比伦日常计算多取 π ≈ 3。1933 年苏萨出土的泥板 TMS 3（古巴比伦时期）给出 3;7,30 = 3.125。埃及 Rhind 第 50 题的规则相当于 3.1605。",
  },
  notes: {
    counting: "伊尚戈骨现藏布鲁塞尔的比利时皇家自然科学博物馆。有人认为它是月历，有人认为它反映质数或十二进制，都没有定论。陶筹理论是影响最大的文字起源理论，但也有争议。原始楔形文字（约前 3350–3000 年）里有十几种计数系统：数粮食、量土地、数牲畜各用一套。这说明“抽象的数”是一步步形成的。",
    rhind: "纸草书现分两段（EA 10057、EA 10058），另有碎片藏于布鲁克林博物馆。题目编号到 87，其中 85–87 不是数学题，所以通常说 84 道题。内容有分数表、算术、“堆”问题（一元一次方程）、面积、体积和斜率。MacTutor 等资料把抄写年代写作约前 1650 年，这里采用大英博物馆的约前 1550 年。英译引文据 Chace（1927–29），未能对照原书扫描件。",
    bm13901: "Høyrup 用的是“保形翻译” (conformal translation)：尽量逐词保留原文的用词和语序，让我们看到巴比伦人怎么“想”。“make hold”指用两条边围出一个长方形（相乘），“tear out”指从面积里剪掉一块（相减）。′ 表示 1/60，所以 45′ = 3/4，30′ = 1/2，15′ = 1/4。引文出自 Høyrup, Algebra in Cuneiform (2017)。",
  },
  rhindOpening: {
    en: "Accurate reckoning. The entrance into the knowledge of all existing things and all obscure secrets.",
    zh: "精确的计算：通往认识一切存在之物、一切隐秘奥妙的入口。",
    ref: "Rhind 纸草书开篇，Chace 英译",
  },
  herodotus: {
    en: "From this, in my opinion, the Greeks learned the art of measuring land; the sunclock and the sundial, and the twelve divisions of the day, came to Hellas from Babylonia and not from Egypt.",
    zh: "依我看，希腊人正是从这里学会了丈量土地的技艺；而日晷和把白天分成十二份的做法，则来自巴比伦，不是埃及。",
    ref: "希罗多德《历史》2.109，Godley 英译",
  },
  aristotle: {
    en: "This is why the mathematical arts were founded in Egypt; for there the priestly caste was allowed to be at leisure.",
    zh: "这就是数学技艺最早在埃及建立的原因：那里的祭司阶层有闲暇。",
    ref: "亚里士多德《形而上学》981b，Ross 英译",
  },
  bm13901: {
    rows: [
      ["The surface and my confrontation I have heaped: 45′ is it.", "正方形面积和边长加在一起，是 3/4", "x² + x = 3/4"],
      ["1, the projection, you posit.", "在边上“伸出”一条宽为 1 的长条", "x · 1"],
      ["The moiety of 1 you break, 30′ and 30′ you make hold.", "把 1 劈成两半，½ 和 ½ 围成小正方形", "(½)² = ¼"],
      ["15′ to 45′ you join: by 1, 1 is equal.", "¼ 加到 3/4 上得 1，即边长 1 的正方形", "(x + ½)² = 1"],
      ["30′ which you have made hold from the inside of 1 you tear out: 30′ the confrontation.", "从 1 里去掉刚才的 ½，边长就是 ½", "x = 1 − ½ = ½"],
    ],
  },
  corrections: [
    { head: "① 本仓库时间轴 SVG 的两处更正", body: "莱因德纸草书原写“c. 1650 BCE”，已改为大英博物馆给出的约前 1550 年（MacTutor 写约前 1650 年，两说并存）。巴比伦“六十进制 c. 1800 BCE”补充：位值制约前 2100 年已开始使用。" },
    { head: "② “荷鲁斯之眼分数”", body: "常见说法：1/2、1/4……1/64 的写法来自荷鲁斯之眼的各部分。Ritter（2002）考证发现，越早的文献字形与眼睛差别越大，这一说法已被否定。" },
    { head: "③ “埃及人用 3-4-5 绳结拉直角”", body: "这一说法流传很广，但在埃及文献中找不到直接证据，属于近代学者的推测。埃及数学纸草书里也没有一般形式的勾股定理。" },
    { head: "④ Plimpton 322 不是“三角函数表”定论", body: "2017 年媒体热炒“巴比伦三角学比希腊早千年”，学界多数并不接受。另外，泥板只写了短边和对角线，长边（如 120）是现代学者推算的。" },
  ],
};
