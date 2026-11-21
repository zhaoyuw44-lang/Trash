// Figures for Manthiram, Yu & Wang 2017, Chapter 6 (Mediator-ion solid electrolytes, Table 2, outlook)
// Canvas scale: about 100 px per inch on the slide, so 16 px text ≈ 11.5 pt.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

const AN = "#DDEFF8"; // anolyte (aqueous, alkaline)
const CA = "#E8F4F3"; // catholyte
const SSE = COL.amber;
const ZN = "#9AA6B2";
const bub = (x, y, r, c = "#FFFFFF") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.75"/>`;
const tag = (x, y, t, c, o = {}) => {
  const w = o.w || 30 + [...t.replace(/[_^{}]/g, "")].reduce((a, ch) => a + (/[⺀-￯]/.test(ch) ? 18 : 10), 0);
  return `<rect x="${x - w / 2}" y="${y - 17}" width="${w}" height="34" rx="17" fill="#FFFFFF" stroke="${c}" stroke-width="2.5"/>` + text(x, y + 6, t, { size: o.size || 17, anchor: "middle", weight: "bold", fill: c });
};

// ---------- Title motif ----------
figs.title_motif = () => {
  const W = 430, H = 560;
  let b = "";
  b += `<rect x="30" y="70" width="170" height="420" rx="16" fill="${AN}" opacity="0.95"/>`;
  b += `<rect x="230" y="70" width="170" height="420" rx="16" fill="${COL.tealLight}" opacity="0.9"/>`;
  b += `<rect x="200" y="50" width="30" height="460" fill="${SSE}"/>`;
  const R = rng(6);
  for (let i = 0; i < 14; i++) b += bub(50 + R() * 130, 90 + R() * 380, 5 + R() * 9);
  for (let i = 0; i < 14; i++) b += bub(250 + R() * 130, 90 + R() * 380, 5 + R() * 9);
  [150, 280, 410].forEach((y, i) => {
    b += arrow(i % 2 ? 330 : 100, y, i % 2 ? 100 : 330, y, { color: "#FFFFFF", width: 5, head: 18 });
    b += ion(215, y, { r: 18, label: "M" });
  });
  return svg(W, H, b);
};

// ---------- Aqueous battery timeline ----------
figs.aq_timeline = () => {
  const W = 1240, H = 420;
  const ev = [
    { year: "1836", who: ["Daniell"], what: ["Zn | Cu 双液电池", "两种溶液分开放"], color: COL.text2 },
    { year: "1866", who: ["Leclanché"], what: ["锌–二氧化锰", "电池"], color: COL.text2 },
    { year: "1899", who: ["Jungner"], what: ["镍–镉", "电池"], color: COL.text2 },
    { year: "1901", who: ["Edison"], what: ["镍–铁", "电池"], color: COL.text2 },
    { year: "1999", who: ["Licht 等"], what: ["“超级铁”", "高铁酸盐电池"], color: COL.teal },
    { year: "2013", who: ["Chen, Xia, Wang"], what: ["酸–碱双电解液", "水系电池近 3 V"], color: COL.amber },
    { year: "2015", who: ["Zhang 等"], what: ["Li⁺ 当“信使”的", "水系 Zn–Cu 电池"], color: COL.amber },
    { year: "2016", who: ["Li & Manthiram"], what: ["介体离子", "酸性 Zn–空气"], color: COL.purple },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 205, left: 90, right: 1130, whoSize: 19, whatSize: 18, yearSize: 28 }));
};

// ---------- Porous separator in aqueous cells ----------
figs.porous_aq = () => {
  const W = 780, H = 420;
  let b = "";
  b += `<rect x="30" y="40" width="80" height="260" fill="${ZN}"/>`;
  b += `<rect x="110" y="40" width="560" height="260" fill="${AN}"/>`;
  b += `<rect x="670" y="40" width="80" height="260" fill="#4F5B66"/>`;
  // porous separator
  b += `<rect x="375" y="40" width="30" height="260" fill="#F4F1FA" stroke="${COL.purpleLight}" stroke-width="2"/>`;
  for (let y = 54; y < 300; y += 30) b += `<rect x="375" y="${y}" width="30" height="13" fill="${AN}"/>`;
  // solvated ions pass both ways (fine)
  b += arrow(150, 80, 630, 80, { color: COL.teal, width: 3, head: 12 }) + check(390, 110, 10);
  b += text(260, 72, "OH⁻、K⁺ 等电解液离子：自由通过", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  // soluble cathode species crossing
  b += `<circle cx="560" cy="170" r="20" fill="${COL.red}"/>` + text(560, 176, "Br_{2}", { size: 16, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += arrow(545, 170, 170, 170, { color: COL.red, width: 3.5, head: 14 });
  b += text(420, 210, "正极物质窜到负极 → 自放电", { size: 16, weight: "bold", fill: COL.red });
  // dendrite
  b += `<path d="M 110 262 L 160 256 L 200 268 L 250 254 L 300 262 L 360 252 L 392 258" fill="none" stroke="#7D8893" stroke-width="7" stroke-linecap="round"/>`;
  b += `<line x1="200" y1="262" x2="214" y2="242" stroke="#7D8893" stroke-width="4" stroke-linecap="round"/>`;
  b += `<circle cx="392" cy="258" r="14" fill="none" stroke="${COL.red}" stroke-width="3"/>`;
  b += text(240, 238, "金属枝晶穿过孔 → 短路", { size: 17, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(70, 330, "金属负极", { size: 18, anchor: "middle", weight: "bold" });
  b += text(240, 330, "水系电解液", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(390, 330, "多孔隔膜", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(710, 330, "正极", { size: 18, anchor: "middle", weight: "bold" });
  b += text(390, 390, "规则：电极必须是不溶于水的固体，否则就会穿过隔膜“串门”", { size: 18, anchor: "middle", weight: "bold", fill: COL.ink });
  return svg(W, H, b);
};

// ---------- Monovalent vs multivalent conduction ----------
figs.multivalent = () => {
  const W = 760, H = 400;
  let b = "";
  const lattice = (x0, seed) => {
    let s = "";
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      s += `<circle cx="${x0 + 30 + c * 54}" cy="${60 + r * 60}" r="18" fill="#C9D2DA" stroke="#9AA6B2" stroke-width="2"/>`;
      s += text(x0 + 30 + c * 54, 66 + r * 60, "−", { size: 18, anchor: "middle", fill: COL.text2, weight: "bold" });
    }
    return s;
  };
  b += lattice(20, 1) + lattice(400, 2);
  // Li+ hopping
  const hops = [[77, 90], [131, 90], [185, 90], [239, 90]];
  b += `<path d="M 77 90 Q 104 64 131 90 Q 158 64 185 90 Q 212 64 239 90 Q 266 64 293 90" fill="none" stroke="${COL.purple}" stroke-width="3" stroke-dasharray="6 5"/>`;
  b += head(293, 90, 0.75, COL.purple, 13);
  b += ion(77, 90, { r: 12 });
  b += text(185, 300, "Li⁺、Na⁺：+1 价、个头小", { size: 18, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(185, 326, "和骨架吸引弱，跳得动", { size: 17, anchor: "middle", fill: COL.text2 });
  // Zn2+ stuck
  [[484, 120], [538, 120], [484, 180], [538, 180]].forEach(([x, y]) => (b += `<line x1="511" y1="150" x2="${x}" y2="${y}" stroke="${COL.red}" stroke-width="3"/>`));
  b += `<circle cx="511" cy="150" r="17" fill="${COL.red}"/>` + text(511, 156, "2+", { size: 16, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  b += cross(600, 150, 12);
  b += text(565, 300, "Zn²⁺、Fe²⁺、Al³⁺：电荷高", { size: 18, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(565, 326, "被骨架牢牢“拽住”，几乎不动", { size: 17, anchor: "middle", fill: COL.text2 });
  b += text(380, 380, "示意：灰球为固体骨架中的阴离子", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Mediator-ion principle (Fig. 7a) ----------
figs.mediator_principle = () => {
  const W = 800, H = 470;
  let b = "";
  const y0 = 120, h = 280;
  // circuit
  b += `<path d="M 50 ${y0} V 50 H 750 V ${y0}" fill="none" stroke="${COL.ink}" stroke-width="3.5"/>`;
  b += `<rect x="350" y="30" width="100" height="40" rx="10" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3"/>`;
  b += text(400, 57, "放电", { size: 17, anchor: "middle", weight: "bold" });
  b += electron(200, 50, 12) + head(340, 50, 0, COL.amber, 14);
  b += `<rect x="30" y="${y0}" width="40" height="${h}" fill="#4F5B66"/>`;
  b += `<rect x="70" y="${y0}" width="310" height="${h}" fill="${AN}"/>`;
  b += `<rect x="380" y="${y0}" width="40" height="${h}" fill="${SSE}"/>`;
  b += `<rect x="420" y="${y0}" width="310" height="${h}" fill="${COL.tealLight}" opacity="0.6"/>`;
  b += `<rect x="730" y="${y0}" width="40" height="${h}" fill="#4F5B66"/>`;
  // redox cycles
  const cyc = (cx, t1, t2, c) => {
    let s = `<ellipse cx="${cx}" cy="260" rx="95" ry="70" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="7 6"/>`;
    s += head(cx + 95, 262, Math.PI / 2, c, 13) + head(cx - 95, 258, -Math.PI / 2, c, 13);
    s += tag(cx, 192, t1, c) + tag(cx, 330, t2, c);
    return s;
  };
  b += cyc(220, "负极物质", "氧化产物", "#3A7CA5");
  b += cyc(580, "正极物质", "还原产物", COL.teal);
  [180, 260, 340].forEach((y) => {
    b += arrow(345, y, 455, y, { color: COL.purple, width: 3, head: 12 });
    b += ion(400, y, { r: 15, label: "M⁺" });
  });
  b += text(225, y0 + h + 32, "负极液 anolyte", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(400, y0 + h + 58, "介体离子 SSE", { size: 18, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(575, y0 + h + 32, "正极液 catholyte", { size: 18, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(50, y0 - 10, "−", { size: 26, anchor: "middle", weight: "bold" });
  b += text(750, y0 - 10, "+", { size: 26, anchor: "middle", weight: "bold" });
  return svg(W, H, b);
};

// ---------- Zn–Br2 mediator cell, discharge (Fig. 7b) ----------
figs.znbr_cell = () => {
  const W = 800, H = 480;
  let b = "";
  const y0 = 40, h = 330;
  b += `<rect x="20" y="${y0}" width="60" height="${h}" fill="${ZN}"/>`;
  b += text(50, y0 + h / 2 + 7, "Zn", { size: 20, anchor: "middle", weight: "bold" });
  b += `<rect x="80" y="${y0}" width="300" height="${h}" fill="${AN}"/>`;
  b += `<rect x="380" y="${y0}" width="40" height="${h}" fill="${SSE}"/>`;
  b += `<rect x="420" y="${y0}" width="300" height="${h}" fill="#F2E9D8"/>`;
  b += `<rect x="720" y="${y0}" width="60" height="${h}" fill="#4F5B66"/>`;
  // anode steps
  const st = (x, y, t, c) => text(x, y, t, { size: 18, anchor: "middle", weight: "bold", fill: c });
  b += st(230, 90, "① Zn → Zn²⁺ + 2e⁻", COL.ink);
  b += arrow(230, 102, 230, 128, { color: COL.muted, width: 2.5, head: 10 });
  b += st(230, 152, "② Zn²⁺ + 4OH⁻ → Zn(OH)_{4}^{2−}", "#3A7CA5");
  b += arrow(230, 164, 230, 190, { color: COL.muted, width: 2.5, head: 10 });
  b += st(230, 214, "③ Zn(OH)_{4}^{2−} → ZnO↓", "#3A7CA5");
  b += st(230, 240, "+ H_{2}O + 2OH⁻", "#3A7CA5");
  b += lines(215, 290, ["负极液净失去 2 个 OH⁻", "→ 送走 2 个 Li⁺ 保持电中性"], { size: 16, anchor: "middle", fill: COL.red, weight: "bold", lh: 24 });
  // cathode
  b += st(570, 120, "Br_{2} + 2e⁻ → 2Br⁻", COL.sei);
  b += `<circle cx="540" cy="180" r="14" fill="${COL.sei}"/><circle cx="560" cy="180" r="14" fill="${COL.sei}"/>`;
  b += `<circle cx="600" cy="200" r="13" fill="#C98B5E"/>` + text(600, 206, "−", { size: 18, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += lines(585, 290, ["正极液多出 2 个 Br⁻", "→ 接收 2 个 Li⁺"], { size: 16, anchor: "middle", fill: COL.red, weight: "bold", lh: 24 });
  // Li+ crossing
  [120, 190].forEach((y) => {
    b += arrow(360, y, 465, y, { color: COL.purple, width: 3, head: 12 });
    b += ion(400, y, { r: 13 });
  });
  b += text(50, y0 + h + 30, "Zn 负极", { size: 17, anchor: "middle", weight: "bold" });
  b += text(230, y0 + h + 30, "LiOH 水溶液", { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(400, y0 + h + 56, "Li-SSE（LATP）", { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(570, y0 + h + 30, "Br_{2} / LiBr 水溶液", { size: 18, anchor: "middle", weight: "bold", fill: COL.sei });
  b += text(750, y0 + h + 30, "集流体", { size: 17, anchor: "middle", weight: "bold" });
  b += text(400, 470, "据原文 Fig. 7b 与正文重绘（放电）；充电时所有过程反向", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Fe–ferricyanide (Fig. 7c) and acidic Zn–air (Fig. 7d) ----------
const twoChamber = (o) => {
  let b = "";
  const y0 = 40, h = 280;
  b += `<rect x="20" y="${y0}" width="60" height="${h}" fill="${o.anodeFill}"/>`;
  b += text(50, y0 + h / 2 + 7, o.anode, { size: 20, anchor: "middle", weight: "bold" });
  b += `<rect x="80" y="${y0}" width="300" height="${h}" fill="${AN}"/>`;
  b += `<rect x="380" y="${y0}" width="40" height="${h}" fill="${SSE}"/>`;
  b += `<rect x="420" y="${y0}" width="300" height="${h}" fill="${o.catFill}"/>`;
  b += `<rect x="720" y="${y0}" width="60" height="${h}" fill="#4F5B66"/>`;
  b += text(230, 110, o.aRxn, { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(230, 150, o.aNote, { size: 16, anchor: "middle", fill: COL.text2 });
  b += text(570, 110, o.cRxn, { size: 18, anchor: "middle", weight: "bold", fill: o.cCol });
  b += text(570, 150, o.cNote, { size: 16, anchor: "middle", fill: COL.text2 });
  [210, 270].forEach((y) => {
    b += arrow(350, y, 470, y, { color: COL.purple, width: 3, head: 12 });
    b += ion(400, y, { r: 15, label: o.ion });
  });
  b += text(230, y0 + h + 30, o.anolyte, { size: 18, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += text(400, y0 + h + 56, o.sse, { size: 17, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(570, y0 + h + 30, o.catholyte, { size: 18, anchor: "middle", weight: "bold", fill: o.cCol });
  return b;
};
figs.fe_ferri = () => {
  const W = 800, H = 400;
  let b = twoChamber({
    anode: "Fe", anodeFill: "#C9CED4", catFill: "#FBF4DC",
    aRxn: "Fe + 2OH⁻ → Fe(OH)_{2} + 2e⁻", aNote: "Fe(OH)_{2} 是不溶的固体", cRxn: "Fe(CN)_{6}^{3−} + e⁻ → Fe(CN)_{6}^{4−}", cNote: "铁氰根 → 亚铁氰根，都溶于水", cCol: "#A07D10",
    ion: "Na⁺", anolyte: "NaOH 水溶液", sse: "Na-SSE", catholyte: "K_{3}Fe(CN)_{6} + NaOH",
  });
  return svg(W, H, b);
};
figs.zn_air_acid = () => {
  const W = 800, H = 400;
  let b = twoChamber({
    anode: "Zn", anodeFill: ZN, catFill: CA,
    aRxn: "Zn + 4OH⁻ → Zn(OH)_{4}^{2−} + 2e⁻", aNote: "碱性：锌溶解–沉积可逆", cRxn: "O_{2} + 4H⁺ + 4e⁻ → 2H_{2}O", cNote: "酸性：氧还原电位高", cCol: COL.teal,
    ion: "Li⁺", anolyte: "LiOH 水溶液", sse: "Li-SSE", catholyte: "H_{3}PO_{4} / LiH_{2}PO_{4}",
  });
  b += `<circle cx="743" cy="190" r="9" fill="${COL.red}"/><circle cx="757" cy="190" r="9" fill="${COL.red}"/>`;
  b += text(750, 225, "空气", { size: 16, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
  return svg(W, H, b);
};

// ---------- Redox-couple menu ----------
figs.redox_menu = () => {
  const W = 1200, H = 440;
  let b = "";
  b += `<rect x="20" y="20" width="330" height="400" rx="18" fill="#EEF4FA"/>`;
  b += text(185, 62, "负极候选", { size: 24, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  ["锌 Zn（已演示）", "铁 Fe（已演示）", "铝 Al", "无机 / 有机化合物"].forEach((t, i) => (b += pill(45, 90 + i * 76, 280, 52, i < 2 ? "#3A7CA5" : "#FFFFFF", t, { size: 19, color: i < 2 ? "#FFFFFF" : "#3A7CA5", stroke: "#3A7CA5" })));
  b += `<rect x="380" y="150" width="70" height="150" rx="10" fill="${SSE}"/>`;
  b += lines(415, 205, ["Li⁺", "或", "Na⁺"], { size: 18, anchor: "middle", weight: "bold", fill: "#FFFFFF", lh: 26 });
  b += `<rect x="480" y="20" width="700" height="400" rx="18" fill="#EEF7F6"/>`;
  b += text(830, 62, "正极候选（原文列出的清单）", { size: 24, anchor: "middle", weight: "bold", fill: COL.teal });
  const cats = ["Br_{2}（已演示）", "K_{3}Fe(CN)_{6}（已演示）", "空气 / O_{2}（已演示）", "过氧化氢", "溴酸盐", "高锰酸盐", "氧化镍", "重铬酸盐", "碘酸盐", "多硫化物", "硫", "氧化锰", "次氯酸盐", "高氯酸盐", "氯酸盐", "硝酸盐", "铋酸盐", "铬酸盐"];
  cats.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 500 + col * 225, y = 84 + row * 54;
    const demo = i < 3;
    b += pill(x, y, 210, 42, demo ? COL.teal : "#FFFFFF", t, { size: 17, color: demo ? "#FFFFFF" : COL.teal, stroke: COL.teal });
  });
  return svg(W, H, b);
};

// ---------- Two routes ----------
figs.two_routes = () => {
  const W = 1200, H = 420;
  let b = "";
  const col = (x, title, c, cell, pros, cons) => {
    let s = `<rect x="${x}" y="10" width="570" height="400" rx="18" fill="#F5F7F9" stroke="${c}" stroke-width="3"/>`;
    s += text(x + 285, 52, title, { size: 24, anchor: "middle", weight: "bold", fill: c });
    s += cell;
    pros.forEach((t, i) => (s += check(x + 40, 228 + i * 36, 10) + text(x + 62, 234 + i * 36, t, { size: 19 })));
    cons.forEach((t, i) => (s += cross(x + 40, 228 + (pros.length + i) * 36, 9) + text(x + 62, 234 + (pros.length + i) * 36, t, { size: 19, fill: COL.red })));
    return s;
  };
  const strip = (x, parts) => {
    let s = "", xx = x;
    parts.forEach(([w, c, t, tc]) => {
      s += `<rect x="${xx}" y="80" width="${w}" height="100" fill="${c}"/>`;
      s += text(xx + w / 2, 138, t, { size: 18, anchor: "middle", weight: "bold", fill: tc || COL.ink });
      xx += w;
    });
    return s;
  };
  b += col(15, "路线 A：全固态", COL.purple,
    strip(85, [[140, COL.tealLight, "负极"], [150, "#D5DBE0", "固态电解质"], [140, COL.amberLight, "正极"]]),
    ["更安全、能量密度潜力高", "工作温度范围宽、可靠"], ["固–固界面电荷转移电阻大", "体积变化、柔性、循环差", "聚合物：窗口窄、室温电导低"]);
  b += col(615, "路线 B：固态电解质 + 液/气态电极", COL.teal,
    strip(685, [[130, "#B9C3CC", "Li / Zn"], [70, AN, "液"], [40, SSE, ""], [190, COL.tealLight, "液 / 气态正极"]]),
    ["固–液界面，电荷转移电阻小", "可做大规模储能、新化学", "挡住串门与枝晶"], ["SSE 要同时耐受两侧环境", "陶瓷件要可靠密封"]);
  return svg(W, H, b);
};

// ---------- Four interlocking avenues ----------
figs.avenues = () => {
  const W = 1200, H = 460;
  let b = "";
  const cx = 600, cy = 230;
  const items = [
    { dx: -150, dy: -95, c: COL.purple, k: "电解质", t: "固态电解质", s: ["高电导 + 稳定 + 力学", "实验 × 计算 × 表征"], tx: 40, anchor: "start" },
    { dx: 150, dy: -95, c: COL.amber, k: "界面", t: "电极 / 电解质界面", s: ["软表面、弹性中间层", "含液中间层、管理应力"], tx: 1160, anchor: "end" },
    { dx: -150, dy: 95, c: COL.teal, k: "电极", t: "电极", s: ["固 / 液 / 气态活性物质", "与 SSE 化学相容"], tx: 40, anchor: "start" },
    { dx: 150, dy: 95, c: COL.red, k: "结构", t: "电池结构设计", s: ["稳固结构、可靠密封", "大面积膜、低成本"], tx: 1160, anchor: "end" },
  ];
  items.forEach((it) => (b += `<circle cx="${cx + it.dx * 0.7}" cy="${cy + it.dy * 0.7}" r="120" fill="${it.c}" opacity="0.18" stroke="${it.c}" stroke-width="3"/>`));
  items.forEach((it) => {
    const x = cx + it.dx * 0.95, y = cy + it.dy * 0.95;
    b += text(x, y + 8, it.k, { size: 22, anchor: "middle", weight: "bold", fill: it.c });
    b += lines(it.tx, cy + (it.dy < 0 ? -150 : 90), it.s, { size: 19, anchor: it.anchor, fill: COL.ink, lh: 30 });
    b += text(it.tx, cy + (it.dy < 0 ? -186 : 54), it.t, { size: 21, anchor: it.anchor, weight: "bold", fill: it.c });
  });
  b += `<circle cx="${cx}" cy="${cy}" r="46" fill="#FFFFFF" stroke="${COL.ink}" stroke-width="3"/>`;
  b += lines(cx, cy - 4, ["低成本", "实用化"], { size: 18, anchor: "middle", weight: "bold", lh: 24 });
  return svg(W, H, b);
};

// ---------- Interface ideas from the outlook ----------
figs.interface_ideas = () => {
  const W = 800, H = 400;
  let b = "";
  const panel = (x, mid, label, sub, c) => {
    let s = `<rect x="${x}" y="40" width="90" height="220" fill="${COL.amberLight}"/>`;
    s += `<rect x="${x + 90 + (mid ? 26 : 0)}" y="40" width="${110 - (mid ? 26 : 0)}" height="220" fill="#D5DBE0"/>`;
    if (mid === "elastic") s += `<path d="M ${x + 90} 40 ${Array.from({ length: 12 }, (_, i) => `Q ${x + (i % 2 ? 90 : 116)} ${50 + i * 18} ${x + 103} ${58 + i * 18}`).join(" ")}" fill="none" stroke="${COL.purple}" stroke-width="5"/>` + `<rect x="${x + 90}" y="40" width="26" height="220" fill="${COL.purpleLight}" opacity="0.6"/>`;
    if (mid === "liquid") {
      s += `<rect x="${x + 90}" y="40" width="26" height="220" fill="${COL.electrolyte}" stroke="#7FB8DA" stroke-width="2"/>`;
      for (let i = 0; i < 6; i++) s += bub(x + 103, 62 + i * 36, 6, "#9CC9E0");
    }
    if (!mid) {
      s += `<path d="M ${x + 90} 40 L ${x + 98} 70 L ${x + 90} 100 L ${x + 100} 140 L ${x + 90} 180 L ${x + 99} 220 L ${x + 90} 260" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="2"/>`;
      s += `<rect x="${x + 90}" y="40" width="4" height="220" fill="${COL.amberLight}"/>`;
    }
    s += ion(x + 45, 150, { r: 12 }) + arrow(x + 60, 150, x + 175, 150, { color: COL.purple, width: 3, head: 12 });
    if (!mid) s += cross(x + 140, 150, 11);
    s += text(x + 100, 296, label, { size: 19, anchor: "middle", weight: "bold", fill: c });
    s += text(x + 100, 322, sub, { size: 16, anchor: "middle", fill: COL.text2 });
    return s;
  };
  b += panel(20, null, "硬碰硬", "接触差、电阻大", COL.red);
  b += panel(300, "elastic", "弹性中间层", "导离子或导电子的弹性薄层", COL.purple);
  b += panel(580, "liquid", "含液中间层", "少量液体电解质“润滑”界面", "#3A7CA5");
  b += text(400, 380, "橙 = 电极　灰 = 固态电解质（据原文“结论与展望”中的建议绘制）", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Whole-paper map ----------
figs.paper_map = () => {
  const W = 1200, H = 470;
  let b = "";
  const chs = [
    { n: "1", t: "引言与固态电解质发展史", s: ["为什么要固态？", "Faraday → β-氧化铝 → PEO"], c: COL.text2, x: 20, y: 20 },
    { n: "2", t: "无机固态电解质", s: ["传输机理、钙钛矿、NASICON、", "石榴石、硫化物"], c: COL.purple, x: 410, y: 20 },
    { n: "3", t: "聚合物、复合与薄膜固态电解质", s: ["PEO、凝胶、复合、", "LiPON 薄膜"], c: COL.teal, x: 800, y: 20 },
    { n: "4", t: "全固态锂离子电池", s: ["固–固界面是头号难题", "（材料 → 器件）"], c: COL.purple, x: 20, y: 250 },
    { n: "5", t: "搭配液/气态电极的固态电解质", s: ["Li–空气、Li–S、Li–Br_{2}", "SSE 当“守门员”"], c: COL.amber, x: 410, y: 250 },
    { n: "6", t: "介体离子固态电解质与展望", s: ["水系电池、Table 2、", "四条交织的研究路径"], c: COL.red, x: 800, y: 250 },
  ];
  chs.forEach((k) => {
    b += `<rect x="${k.x}" y="${k.y}" width="380" height="200" rx="18" fill="#F5F7F9" stroke="${k.c}" stroke-width="3"/>`;
    b += `<circle cx="${k.x + 40}" cy="${k.y + 42}" r="22" fill="${k.c}"/>`;
    b += text(k.x + 40, k.y + 50, k.n, { size: 22, anchor: "middle", weight: "bold", fill: "#FFFFFF" });
    b += text(k.x + 74, k.y + 50, k.t, { size: k.t.length > 12 ? 19 : 21, weight: "bold", fill: k.c });
    b += lines(k.x + 30, k.y + 110, k.s, { size: 19, fill: COL.ink, lh: 32 });
  });
  b += arrow(402, 120, 408, 120, { color: COL.muted, width: 3, head: 12 }) + arrow(792, 120, 798, 120, { color: COL.muted, width: 3, head: 12 });
  b += arrow(402, 350, 408, 350, { color: COL.muted, width: 3, head: 12 }) + arrow(792, 350, 798, 350, { color: COL.muted, width: 3, head: 12 });
  b += text(600, 240, "材料（第 1–3 章） ↓  电池（第 4–6 章）", { size: 18, anchor: "middle", weight: "bold", fill: COL.muted });
  return svg(W, H, b);
};

module.exports = figs;
