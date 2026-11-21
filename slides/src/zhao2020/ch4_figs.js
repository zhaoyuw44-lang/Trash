// Figures for Zhao et al. 2020, Chapter 4 (Failure modes of SSEs)
// Canvas sizes are chosen at ~90-100 px per slide inch so that 14 px text stays >= 11 pt on the slide.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, electron, cross, check, pill, blob, svg, timeline, rng } = L;

const figs = {};

// ---------- local helpers (not exported) ----------
const LI = "#B9C3CC"; // lithium metal grey
const LI_DARK = "#8F9BA6";
const SSE = "#E6EEF3"; // ceramic electrolyte fill
const GB = "#9FB3C2"; // grain boundary lines

// Jittered grid of points -> irregular "grains" between x0..x1, y0..y1
function grains(x0, y0, x1, y1, nx, ny, seed, o = {}) {
  const R = rng(seed);
  const P = [];
  for (let j = 0; j <= ny; j++) {
    const row = [];
    for (let i = 0; i <= nx; i++) {
      const edgeX = i === 0 || i === nx, edgeY = j === 0 || j === ny;
      const x = x0 + (i * (x1 - x0)) / nx + (edgeX ? 0 : (R() - 0.5) * ((x1 - x0) / nx) * 0.55);
      const y = y0 + (j * (y1 - y0)) / ny + (edgeY ? 0 : (R() - 0.5) * ((y1 - y0) / ny) * 0.55);
      row.push([x, y]);
    }
    P.push(row);
  }
  let b = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${o.fill || SSE}"/>`;
  const c = o.line || GB, w = o.w || 2;
  for (let j = 1; j < ny; j++) b += `<polyline points="${P[j].map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
  for (let i = 1; i < nx; i++) b += `<polyline points="${P.map((r) => r[i].map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
  return { svg: b, P };
}

function num(x, y, n, c = COL.ink, r = 14) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>` + text(x, y + r * 0.42, String(n), { size: Math.round(r * 1.15), anchor: "middle", fill: "#FFFFFF", weight: "bold" });
}

const pathD = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L");

// ---------- Title motif: cracked ceramic with a dendrite (on dark background) ----------
figs.title_motif = () => {
  const W = 480, H = 520;
  let b = "";
  // cathode particles on top
  for (let i = 0; i < 5; i++) b += blob(80 + i * 80, 92, 34, 400 + i, { fill: COL.amberLight, stroke: COL.amber, sw: 4, jag: 0.08 });
  // SSE slab with grains
  const g = grains(40, 140, 440, 400, 5, 4, 77, { fill: "#2E4256", line: "#6F8AA3", w: 3 });
  b += g.svg;
  b += `<rect x="40" y="140" width="400" height="260" fill="none" stroke="#9FB0C0" stroke-width="3"/>`;
  // Li metal
  b += `<rect x="40" y="400" width="400" height="62" fill="${LI}"/>`;
  // dendrite climbing along grain boundaries
  const P = g.P;
  const pts = [[P[4][2][0], 400], P[3][2], P[3][3], P[2][3], P[1][3], [P[1][3][0] + 8, P[1][3][1] - 40]];
  b += `<path d="${pathD(pts)}" fill="none" stroke="${COL.purpleLight}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  b += `<circle cx="${P[2][1][0]}" cy="${P[2][1][1]}" r="11" fill="${COL.purpleLight}"/>`;
  b += `<circle cx="${P[3][4][0]}" cy="${P[3][4][1]}" r="8" fill="${COL.amber}"/>`;
  // crack
  b += `<path d="M300,140 L292,170 L310,196 L298,226" fill="none" stroke="${COL.red}" stroke-width="5" stroke-linejoin="round"/>`;
  return svg(W, H, b);
};

// ---------- Chapter timeline ----------
figs.fail_timeline = () => {
  const W = 1110, H = 320;
  const ev = [
    { year: "1981", who: ["De Jonghe 等"], what: ["Na–β-Al_{2}O_{3} 中", "金属 Na 渗透"], color: COL.text2 },
    { year: "2005", who: ["Monroe & Newman"], what: ["剪切模量判据", "G ≥ 2 G_{Li}"], color: COL.purple },
    { year: "2010", who: ["Goodenough & Kim"], what: ["用能级图讲", "电化学稳定窗口"], color: COL.text2 },
    { year: "2015", who: ["Wenzel & Janek 等"], what: ["三类界面：", "稳定 / MCI / SEI"], color: COL.teal },
    { year: "2015", who: ["Zhu, He & Mo"], what: ["计算窗口远窄", "于实验测得值"], color: COL.teal },
    { year: "2016", who: ["Sharafi 等"], what: ["LLZO 的", "临界电流密度"], color: COL.red },
    { year: "2017", who: ["Porz 等"], what: ["Li 渗透与", "剪切模量无关"], color: COL.red },
    { year: "2019", who: ["Han 等"], what: ["电子电导让", "Li 在体内析出"], color: COL.red },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 150, left: 80, right: 1010, whoSize: 17, whatSize: 16, yearSize: 24 }));
};

// ---------- Fig. 4a: inorganic SSE failure map (numbered) ----------
figs.fig4a = () => {
  const W = 700, H = 470;
  let b = `<g transform="translate(0 26)">`;
  const x0 = 30, x1 = 600;
  // Al current collector + cathode layer
  b += `<rect x="${x0}" y="20" width="${x1 - x0}" height="14" fill="${COL.alu}"/>`;
  b += `<rect x="${x0}" y="34" width="${x1 - x0}" height="78" fill="#FFF6EC"/>`;
  const cps = [[70, 74], [140, 70], [212, 76], [282, 70], [352, 74], [422, 70], [492, 76], [560, 72]];
  // CEI blob (orange interphase) on the right half
  b += `<path d="M300,108 Q340,138 400,120 Q450,140 520,112 L520,100 L300,100 Z" fill="${COL.amber}" opacity="0.75"/>`;
  cps.forEach(([x, y], i) => (b += blob(x, y, 30, 500 + i, { fill: "#56636F", stroke: COL.teal, sw: 4, jag: 0.08 })));
  // gap from volume change at left particle
  b += `<path d="M110,104 Q140,118 172,104" fill="none" stroke="${COL.red}" stroke-width="3" stroke-dasharray="6 4"/>`;
  // SSE grains
  const g = grains(x0, 112, x1, 330, 7, 3, 21);
  b += g.svg;
  const P = g.P;
  // dendrite along grain boundary from anode (red)
  const den = [[P[3][2][0], 330], P[2][2], P[2][3], P[1][3], [P[1][3][0] + 4, P[1][3][1] - 30]];
  b += `<path d="${pathD(den)}" fill="none" stroke="${COL.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  // flaw at the anode surface
  b += `<polygon points="${P[3][5][0] - 16},330 ${P[3][5][0]},292 ${P[3][5][0] + 14},330" fill="${COL.red}"/>`;
  // isolated Li from electronic conductivity (purple) and from anion framework (orange)
  b += `<circle cx="${(P[1][5][0] + 10).toFixed(1)}" cy="${(P[1][5][1] + 30).toFixed(1)}" r="10" fill="${COL.purple}"/>`;
  b += `<circle cx="${(P[2][6][0] + 26).toFixed(1)}" cy="${(P[2][6][1] - 18).toFixed(1)}" r="10" fill="${COL.amber}"/>`;
  b += electron((P[1][5][0] - 22), (P[1][5][1] + 48), 11);
  // crack
  b += `<path d="M232,112 L226,140 L240,162 L230,190" fill="none" stroke="${COL.ink}" stroke-width="3.5" stroke-linejoin="round"/>`;
  // SEI + Li anode
  b += `<path d="M${x0},330 Q100,322 160,332 T290,330 T420,328 T${x1},330 L${x1},346 L${x0},346 Z" fill="${COL.sei}"/>`;
  b += `<rect x="${x0}" y="346" width="${x1 - x0}" height="56" fill="${LI}"/>`;
  b += text(x0 + 14, 381, "金属负极 Li", { size: 17, weight: "bold" });
  b += text(x0 + 30, 300, "无机 SSE", { size: 17, weight: "bold", fill: COL.text2 });
  // numbers
  b += num(632, 112, 1, COL.amber); b += `<line x1="619" y1="112" x2="522" y2="110" stroke="${COL.amber}" stroke-width="2"/>`;
  b += num(150, 140, 2, COL.red);
  b += num(205, 176, 3, COL.ink);
  b += num(P[1][3][0] + 34, P[1][3][1] - 22, 4, COL.red);
  b += num(P[1][5][0] + 38, P[1][5][1] + 30, 5, COL.purple);
  b += num(P[2][6][0] + 54, P[2][6][1] - 18, 5, COL.amber);
  b += num(632, 338, 6, COL.sei); b += `<line x1="619" y1="338" x2="${x1}" y2="338" stroke="${COL.sei}" stroke-width="2"/>`;
  b += num(P[3][5][0] + 36, 300, 4, COL.red);
  b += `</g>`;
  b += text(x0, 18, "高电压正极（Al 集流体在最上方）", { size: 16, weight: "bold", fill: COL.ink });
  b += text(W / 2 - 20, 460, "据原文 Fig. 4a 重绘（数字说明见右侧）", { size: 16, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Fig. 4b: polymer SSE failure ----------
figs.fig4b = () => {
  const W = 640, H = 400;
  let b = "";
  const x0 = 20, x1 = 620;
  const panel = (ox, after) => {
    let s = "";
    const w = 290;
    s += `<rect x="${ox}" y="30" width="${w}" height="40" fill="${LI}"/>`;
    s += text(ox + w / 2, 57, "Li 金属负极", { size: 15, anchor: "middle", weight: "bold" });
    s += `<rect x="${ox}" y="70" width="${w}" height="110" fill="#F7EEF5"/>`;
    // polymer chains
    const R = rng(after ? 9 : 3);
    for (let k = 0; k < 7; k++) {
      const yy = 86 + k * 14;
      let d = `M${ox + 6},${yy}`;
      for (let xx = ox + 6; xx < ox + w - 10; xx += 24) d += ` q 12 ${R() > 0.5 ? -9 : 9} 24 0`;
      s += `<path d="${d}" fill="none" stroke="#C99BBF" stroke-width="2"/>`;
    }
    // cathode particles
    s += `<rect x="${ox}" y="180" width="${w}" height="120" fill="#FFF6EC"/>`;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
      const cx = ox + 24 + c * 40 + (r % 2) * 14, cy = 202 + r * 38;
      if (after && (r * 7 + c) % 3 === 0) {
        s += blob(cx - 7, cy - 4, 9, 70 + r * 7 + c, { fill: "#56636F", jag: 0.3, n: 6 }) + blob(cx + 8, cy + 6, 8, 90 + r * 7 + c, { fill: "#56636F", jag: 0.3, n: 6 });
      } else s += blob(cx, cy, 16, 30 + r * 7 + c, { fill: "#56636F", stroke: COL.teal, sw: 2.5, jag: 0.08 });
    }
    s += `<rect x="${ox}" y="300" width="${w}" height="16" fill="${COL.alu}"/>`;
    if (after) {
      s += `<rect x="${ox}" y="172" width="${w}" height="14" fill="#7A2E52" opacity="0.85"/>`;
      // dendrites from anode
      [[ox + 70, 120], [ox + 200, 150]].forEach(([x, len], i) => {
        const R2 = rng(40 + i);
        let pts = [[x, 70]];
        for (let k = 1; k <= 5; k++) pts.push([x + (R2() - 0.5) * 22, 70 + (len - 70) * (k / 5) + 0]);
        s += `<path d="${pathD(pts)}" fill="none" stroke="${LI_DARK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
      });
    }
    return s;
  };
  b += panel(x0, false);
  b += panel(x0 + 310, true);
  b += text(x0 + 145, 22, "循环前", { size: 16, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += text(x0 + 455, 22, "循环后", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(x0 + 145, 130, "SPE（如 PEO）", { size: 16, anchor: "middle", weight: "bold", fill: "#7A2E52" });
  // labels below
  b += num(x0 + 340, 345, 1, COL.ink); b += text(x0 + 360, 351, "枝晶穿过软的聚合物", { size: 15, weight: "bold" });
  b += num(x0 + 340, 378, 2, "#7A2E52"); b += text(x0 + 360, 384, "高压下醚氧被氧化→界面不稳", { size: 15, weight: "bold" });
  b += num(x0 + 20, 345, 3, COL.siDark); b += text(x0 + 40, 351, "正极颗粒粉化", { size: 15, weight: "bold" });
  b += text(x0 + 20, 384, "据原文 Fig. 4b 重绘", { size: 15, fill: COL.muted });
  b += num(x0 + 590, 100, 1, COL.ink, 12);
  b += num(x0 + 590, 179, 2, "#7A2E52", 12);
  b += num(x0 + 590, 240, 3, COL.siDark, 12);
  return svg(W, H, b);
};

// ---------- Electrochemical stability window (energy diagram) ----------
figs.window_energy = () => {
  const W = 620, H = 440;
  let b = "";
  // axis
  b += arrow(40, 410, 40, 30, { color: COL.ink, width: 3, head: 14 });
  b += `<g transform="translate(26 230) rotate(-90)">` + text(0, 0, "电子能量 →（电位越负越高）", { size: 15, anchor: "middle", fill: COL.text2 }) + `</g>`;
  // anode
  b += `<rect x="70" y="120" width="120" height="270" fill="${LI}"/>`;
  b += `<line x1="70" y1="120" x2="190" y2="120" stroke="${COL.purple}" stroke-width="4"/>`;
  b += text(130, 110, "μ_{A}", { size: 20, anchor: "middle", weight: "bold", fill: COL.purple });
  b += text(130, 420, "负极", { size: 17, anchor: "middle", weight: "bold" });
  // cathode
  b += `<rect x="430" y="300" width="120" height="90" fill="${COL.amberLight}"/>`;
  b += `<line x1="430" y1="300" x2="550" y2="300" stroke="${COL.amber}" stroke-width="4"/>`;
  b += text(490, 290, "μ_{C}", { size: 20, anchor: "middle", weight: "bold", fill: COL.amber });
  b += text(490, 420, "正极", { size: 17, anchor: "middle", weight: "bold" });
  // electrolyte window
  b += `<rect x="215" y="150" width="190" height="140" fill="${COL.electrolyte}"/>`;
  b += `<line x1="215" y1="150" x2="405" y2="150" stroke="${COL.teal}" stroke-width="4"/>`;
  b += `<line x1="215" y1="290" x2="405" y2="290" stroke="${COL.teal}" stroke-width="4"/>`;
  b += text(310, 174, "还原极限（LUMO）", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(310, 280, "氧化极限（HOMO）", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  b += text(310, 216, "电解质的", { size: 17, anchor: "middle", weight: "bold" });
  b += text(310, 240, "稳定窗口 E_{g}", { size: 17, anchor: "middle", weight: "bold" });
  b += text(310, 420, "固态电解质", { size: 17, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  // reduction arrow: anode electrons go into electrolyte
  b += arrow(195, 122, 232, 147, { color: COL.purple, width: 3, head: 12 });
  b += electron(178, 98, 11);
  b += text(205, 70, "μ_{A} 高于还原极限：", { size: 15, fill: COL.purple, weight: "bold" });
  b += text(205, 90, "电子跑进电解质 → 被还原（SEI）", { size: 15, fill: COL.purple, weight: "bold" });
  // oxidation: electrolyte electrons drop into cathode
  b += arrow(390, 292, 440, 304, { color: COL.amber, width: 3, head: 12 });
  b += text(420, 352, "μ_{C} 低于氧化极限：", { size: 15, anchor: "end", fill: COL.amber, weight: "bold" });
  b += text(420, 372, "电解质被氧化（CEI）", { size: 15, anchor: "end", fill: COL.amber, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Three interface types (Wenzel, Janek et al.) ----------
figs.interphase_types = () => {
  const W = 990, H = 370;
  let b = "";
  const pan = (ox, kind) => {
    let s = "";
    const t = kind === "mci" ? 92 : kind === "sei" ? 26 : 0;
    s += `<rect x="${ox}" y="40" width="110" height="210" fill="${LI}"/>`;
    s += text(ox + 55, 155, "Li", { size: 22, anchor: "middle", weight: "bold" });
    if (t) s += `<rect x="${ox + 110}" y="40" width="${t}" height="210" fill="${kind === "mci" ? "#7E6A8F" : COL.sei}"/>`;
    s += `<rect x="${ox + 110 + t}" y="40" width="${200 - t}" height="210" fill="${SSE}"/>`;
    s += text(ox + 110 + t + (200 - t) / 2, 155, "SSE", { size: 20, anchor: "middle", weight: "bold", fill: COL.text2 });
    // ion arrow always passes
    s += arrow(ox + 40, 80, ox + 290, 80, { color: COL.purple, width: 3, head: 12 });
    s += ion(ox + 70, 80, { r: 11 });
    if (kind === "mci") {
      s += arrow(ox + 40, 215, ox + 180, 215, { color: COL.amber, width: 3, head: 12 });
      s += electron(ox + 70, 215, 11);
      s += arrow(ox + 205, 130, ox + 250, 130, { color: COL.red, width: 4, head: 14 });
      s += arrow(ox + 205, 185, ox + 250, 185, { color: COL.red, width: 4, head: 14 });
    }
    if (kind === "sei") {
      s += arrow(ox + 40, 215, ox + 100, 215, { color: COL.amber, width: 3, head: 12 });
      s += electron(ox + 62, 215, 11);
      s += cross(ox + 123, 215, 10);
    }
    if (kind === "stable") s += check(ox + 110, 215, 14);
    return s;
  };
  const cols = [
    { k: "stable", t: "① 热力学稳定", sub: ["不反应，界面保持清晰", "（理想情况，很少见）"], c: COL.teal },
    { k: "mci", t: "② 混合导电界面相 MCI", sub: ["反应产物既导离子又导电子", "→ 越长越厚，最终失效"], c: COL.red },
    { k: "sei", t: "③ 亚稳 SEI", sub: ["产物只导离子、不导电子", "→ 长到一定厚度自己停下"], c: COL.sei },
  ];
  cols.forEach((c, i) => {
    const ox = 15 + i * 330;
    b += text(ox + 155, 26, c.t, { size: 18, anchor: "middle", weight: "bold", fill: c.c });
    b += pan(ox, c.k);
    b += lines(ox + 155, 285, c.sub, { size: 15, anchor: "middle", fill: COL.ink, lh: 22 });
  });
  b += text(495, 355, "紫色 = Li⁺ 通过；橙色 = 电子 e⁻；红色箭头 = 界面相继续向 SSE 内生长", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Anode-side case studies ----------
figs.anode_cases = () => {
  const W = 640, H = 420;
  let b = "";
  // Panel A: LGPS + Li
  b += text(150, 26, "LGPS + Li：生成混合导电层", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += `<rect x="20" y="40" width="70" height="230" fill="${LI}"/>`;
  b += text(55, 160, "Li", { size: 20, anchor: "middle", weight: "bold" });
  b += `<rect x="90" y="40" width="90" height="230" fill="#E9E2EF"/>`;
  const R = rng(5);
  for (let i = 0; i < 26; i++) {
    const x = 96 + R() * 72, y = 48 + R() * 210, k = i % 3;
    const col = k === 0 ? "#7E6A8F" : k === 1 ? COL.sulfurLight : "#B5A6C4";
    b += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(10 + R() * 8).toFixed(1)}" height="${(9 + R() * 8).toFixed(1)}" rx="2" fill="${col}"/>`;
  }
  b += `<rect x="180" y="40" width="100" height="230" fill="${SSE}"/>`;
  b += text(230, 160, "LGPS", { size: 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += arrow(30, 225, 176, 225, { color: COL.amber, width: 3, head: 12 });
  b += electron(48, 225, 10);
  b += arrow(185, 120, 222, 120, { color: COL.red, width: 4, head: 13 });
  b += lines(20, 300, ["产物：Li_{3}P、Li_{2}S、Li–Ge 合金", "Li–Ge 合金导电子 → 反应不停"], { size: 15, lh: 22 });
  b += text(20, 352, "（原位 XPS，Wenzel 等 2016）", { size: 15, fill: COL.muted });
  // Panel B: LAGP + Li
  const X = 340;
  b += text(X + 140, 26, "LAGP + Li：变无定形、膨胀开裂", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += `<rect x="${X}" y="40" width="70" height="230" fill="${LI}"/>`;
  b += text(X + 35, 160, "Li", { size: 20, anchor: "middle", weight: "bold" });
  b += `<path d="M${X + 70},40 Q${X + 120},70 ${X + 110},155 Q${X + 125},230 ${X + 70},270 Z" fill="#C9BEB2"/>`;
  b += `<rect x="${X + 110}" y="40" width="170" height="230" fill="${SSE}"/>`;
  b += `<path d="M${X + 70},40 Q${X + 120},70 ${X + 110},155 Q${X + 125},230 ${X + 70},270" fill="#C9BEB2"/>`;
  b += text(X + 200, 160, "LAGP", { size: 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  b += `<path d="M${X + 120},100 L${X + 160},92 L${X + 190},110 L${X + 240},100" fill="none" stroke="${COL.ink}" stroke-width="3"/>`;
  b += `<path d="M${X + 122},205 L${X + 170},215 L${X + 205},200 L${X + 262},212" fill="none" stroke="${COL.ink}" stroke-width="3"/>`;
  b += arrow(X + 92, 155, X + 135, 155, { color: COL.red, width: 4, head: 13 });
  b += lines(X, 300, ["界面相体积膨胀 → 挤裂 SSE", "（原位 TEM，Lewis 等 2019）"], { size: 15, lh: 22 });
  b += `<rect x="20" y="372" width="600" height="40" rx="10" fill="#E8F4F3"/>`;
  b += text(320, 398, "对照：LiPON（P–N–P 骨架）计算表明对 Li 动力学惰性", { size: 15, anchor: "middle", fill: COL.teal, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Cathode side ----------
figs.cathode_cei = () => {
  const W = 640, H = 420;
  let b = "";
  b += `<rect x="20" y="20" width="600" height="320" fill="${SSE}"/>`;
  b += text(560, 46, "硫化物 SSE", { size: 16, anchor: "end", weight: "bold", fill: COL.text2 });
  // LCO particle
  b += `<circle cx="200" cy="170" r="104" fill="${COL.amberLight}" stroke="${COL.amber}" stroke-width="4"/>`;
  b += text(200, 178, "LiCoO_{2}", { size: 22, anchor: "middle", weight: "bold" });
  // interphase ring
  b += `<circle cx="200" cy="170" r="119" fill="none" stroke="#B88A5A" stroke-width="18" opacity="0.6"/>`;
  // interdiffusion arrows
  b += arrow(300, 140, 360, 110, { color: COL.amber, width: 3, head: 12 });
  b += text(366, 112, "Co 向外扩散", { size: 15, fill: COL.amber, weight: "bold" });
  b += arrow(400, 175, 340, 182, { color: COL.sulfur, width: 3, head: 12 });
  b += text(406, 182, "S、P 向内扩散", { size: 15, fill: "#A67C00", weight: "bold" });
  // carbon black hotspot
  [[360, 270], [376, 286], [392, 268], [372, 254]].forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="10" fill="#2B2F33"/>`));
  b += `<circle cx="376" cy="270" r="40" fill="none" stroke="${COL.red}" stroke-width="3" stroke-dasharray="6 4"/>`;
  b += lines(426, 262, ["导电碳：电子多", "→ 硫化物在此分解"], { size: 15, fill: COL.red, weight: "bold", lh: 21 });
  // space charge
  b += text(40, 330, "空间电荷层 Space-charge layer：界面 Li⁺ 被“抽空”", { size: 15, fill: COL.ink, weight: "bold" });
  b += lines(20, 372, ["XPS：Li_{6}PS_{5}Cl 遇 LiCoO_{2} 生成 P_{2}S_{x}、LiCl、S 和多硫化物", "TEM：LiCoO_{2} / Li_{2}S–P_{2}S_{5} 界面 S、P、Co 互扩散"], { size: 15, lh: 22, fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Chemo-mechanical failure ----------
figs.chemomech = () => {
  const W = 640, H = 380;
  let b = "";
  const panel = (ox, shrunk) => {
    let s = `<rect x="${ox}" y="40" width="280" height="230" fill="${SSE}"/>`;
    [[ox + 75, 105], [ox + 200, 100], [ox + 90, 215], [ox + 210, 210]].forEach(([x, y], i) => {
      const r = shrunk ? 40 : 50;
      s += blob(x, y, r, 600 + i, { fill: COL.amberLight, stroke: COL.amber, sw: 3, jag: 0.06 });
      if (shrunk) s += `<circle cx="${x}" cy="${y}" r="52" fill="none" stroke="${COL.red}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
    });
    return s;
  };
  b += panel(20, false);
  b += panel(340, true);
  b += text(160, 28, "放电态：颗粒与 SSE 贴紧", { size: 16, anchor: "middle", weight: "bold", fill: COL.teal });
  b += text(480, 28, "充电（脱锂）：颗粒收缩", { size: 16, anchor: "middle", weight: "bold", fill: COL.red });
  b += arrow(302, 155, 336, 155, { color: COL.ink, width: 3, head: 12 });
  b += lines(340, 300, ["红虚线 = 原来的接触边界", "缝隙 → Li⁺ 过不去 → 容量衰减"], { size: 15, fill: COL.red, weight: "bold", lh: 22 });
  b += lines(20, 300, ["固体不会“流动”去填缝：", "液体电解质则会自动浸润"], { size: 15, fill: COL.text2, lh: 22 });
  b += text(20, 362, "夸大示意：以富镍层状正极 + 硫代磷酸盐 SSE 为例（Koerver 等 2017）", { size: 15, fill: COL.muted });
  return svg(W, H, b);
};

// ---------- Air stability ----------
figs.air_stability = () => {
  const W = 640, H = 400;
  let b = "";
  // sulfide
  b += `<rect x="20" y="30" width="290" height="270" rx="16" fill="#FBF4DC"/>`;
  b += text(165, 60, "硫化物（Li_{3}PS_{4}、LGPS）", { size: 16, anchor: "middle", weight: "bold", fill: "#8A6A00" });
  // PS4 tetrahedron
  b += `<polygon points="110,110 70,190 150,190" fill="${COL.sulfurLight}" stroke="${COL.sulfur}" stroke-width="3"/>`;
  b += `<circle cx="110" cy="160" r="13" fill="${COL.purple}"/>` + text(110, 165, "P", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  [[110, 110], [70, 190], [150, 190]].forEach(([x, y]) => (b += `<circle cx="${x}" cy="${y}" r="14" fill="${COL.sulfur}"/>` + text(x, y + 5, "S", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" })));
  b += arrow(170, 150, 225, 150, { color: COL.ink, width: 3, head: 12 });
  b += text(198, 136, "+ H_{2}O", { size: 15, anchor: "middle", weight: "bold", fill: "#3A7CA5" });
  b += pill(232, 132, 66, 34, COL.red, "H_{2}S", { size: 16 });
  b += lines(40, 236, ["P 更“亲氧”：O 抢走 S 的位置", "放出有毒的 H_{2}S，结构被破坏"], { size: 15, lh: 22 });
  // oxide
  b += `<rect x="330" y="30" width="290" height="270" rx="16" fill="#EEF2F5"/>`;
  b += text(475, 60, "氧化物（LLZO）", { size: 16, anchor: "middle", weight: "bold", fill: COL.siDark });
  b += `<rect x="360" y="110" width="230" height="80" fill="#D7DEE5"/>`;
  b += `<rect x="360" y="96" width="230" height="14" fill="#F2F2F2" stroke="${COL.muted}" stroke-width="1.5"/>`;
  b += text(475, 156, "LLZO", { size: 17, anchor: "middle", weight: "bold" });
  b += text(475, 88, "Li_{2}CO_{3} 表层（绝缘、疏锂）", { size: 15, anchor: "middle", fill: COL.text2, weight: "bold" });
  b += lines(350, 236, ["H_{2}O / CO_{2} 慢慢反应", "放 1 年后 Al、La 分布不再均匀"], { size: 15, lh: 22 });
  b += text(320, 330, "共同后果：离子电导下降、界面电阻升高、制造需干燥房", { size: 15, anchor: "middle", weight: "bold", fill: COL.red });
  b += text(320, 360, "（ToF-SIMS 观测 LLZO 老化，见原文 Box 1）", { size: 15, anchor: "middle", fill: COL.muted });
  return svg(W, H, b);
};

// ---------- SPE oxidation: CV vs stepwise hold (leakage current) ----------
figs.spe_leak = () => {
  const W = 620, H = 430;
  let b = "";
  // top: voltage staircase
  const X0 = 70, X1 = 590;
  b += text(20, 30, "电压", { size: 15, weight: "bold", fill: COL.text2 });
  b += `<line x1="${X0}" y1="170" x2="${X1}" y2="170" stroke="${COL.line}" stroke-width="2"/>`;
  b += `<line x1="${X0}" y1="40" x2="${X0}" y2="170" stroke="${COL.line}" stroke-width="2"/>`;
  let d = `M${X0},150`;
  const steps = 6, sw = (X1 - X0) / steps;
  for (let i = 0; i < steps; i++) d += ` L${X0 + i * sw},${150 - i * 20} L${X0 + (i + 1) * sw},${150 - i * 20}`;
  b += `<path d="${d}" fill="none" stroke="${COL.teal}" stroke-width="4"/>`;
  b += `<path d="M${X0},150 L${X1},40" fill="none" stroke="${COL.muted}" stroke-width="3" stroke-dasharray="8 6"/>`;
  b += text(X1 - 4, 150, "虚线 = CV：线性扫过去", { size: 15, anchor: "end", fill: COL.muted, weight: "bold" });
  b += text(X0 + 10, 70, "阶梯：每一级恒压保持一段时间", { size: 15, fill: COL.teal, weight: "bold" });
  // bottom: current
  b += text(20, 222, "电流", { size: 15, weight: "bold", fill: COL.text2 });
  b += `<line x1="${X0}" y1="370" x2="${X1}" y2="370" stroke="${COL.line}" stroke-width="2"/>`;
  b += `<line x1="${X0}" y1="230" x2="${X0}" y2="370" stroke="${COL.line}" stroke-width="2"/>`;
  const floor = [0, 2, 4, 8, 30, 70];
  for (let i = 0; i < steps; i++) {
    const x = X0 + i * sw;
    const base = 365 - floor[i];
    b += `<path d="M${x},${base - 60} C${x + 12},${base - 4} ${x + 40},${base} ${x + sw},${base}" fill="none" stroke="${COL.amber}" stroke-width="3.5"/>`;
  }
  b += `<line x1="${X0 + 4 * sw}" y1="${365 - 30}" x2="${X1}" y2="${365 - 30}" stroke="${COL.red}" stroke-width="2" stroke-dasharray="5 4"/>`;
  b += lines(X0 + 3.6 * sw, 262, ["电流不再衰减到零", "= 漏电流：电解质在持续分解"], { size: 15, fill: COL.red, weight: "bold", lh: 20, anchor: "end" });
  b += text(X0 + 8, 395, "每级开始的尖峰是充电电流，随后衰减", { size: 15, fill: COL.text2 });
  b += text(X1, 420, "时间 →", { size: 15, anchor: "end", fill: COL.text2 });
  return svg(W, H, b);
};

// ---------- Modulus ladder (Monroe–Newman) ----------
figs.modulus_ladder = () => {
  const W = 560, H = 470;
  let b = "";
  const ax = 150, yTop = 40, yBot = 420;
  const ly = (e) => yBot - ((e - 4) / 7) * (yBot - yTop); // 10^4 .. 10^11 Pa
  b += `<line x1="${ax}" y1="${yBot}" x2="${ax}" y2="${yTop - 10}" stroke="${COL.ink}" stroke-width="3"/>`;
  b += head(ax, yTop - 22, -Math.PI / 2, COL.ink, 14);
  for (let e = 4; e <= 11; e++) {
    b += `<line x1="${ax - 8}" y1="${ly(e)}" x2="${ax}" y2="${ly(e)}" stroke="${COL.ink}" stroke-width="2"/>`;
    b += text(ax - 14, ly(e) + 6, `10^{${e}}`, { size: 16, anchor: "end", fill: COL.text2 });
  }
  b += text(20, yTop - 16, "剪切模量 G（Pa）", { size: 15, anchor: "start", fill: COL.text2, weight: "bold" });
  // MN threshold band
  b += `<rect x="${ax + 2}" y="${ly(11)}" width="380" height="${ly(Math.log10(6e9)) - ly(11)}" fill="#E8F4F3"/>`;
  b += `<line x1="${ax}" y1="${ly(Math.log10(6e9))}" x2="${ax + 382}" y2="${ly(Math.log10(6e9))}" stroke="${COL.teal}" stroke-width="3" stroke-dasharray="8 5"/>`;
  b += text(ax + 372, ly(Math.log10(6e9)) - 10, "Monroe–Newman 门槛 > 6 × 10^{9} Pa", { size: 15, anchor: "end", fill: COL.teal, weight: "bold" });
  const items = [
    { e: Math.log10(6e10), lab: "LLZO 等氧化物陶瓷（≈ 60 GPa）", col: COL.siDark },
    { e: Math.log10(3.4e9), lab: "Li 金属（数 GPa）", col: COL.purple },
    { e: 5, lab: "纳米结构交联电解质 ~10^{5} Pa", col: COL.amber },
  ];
  items.forEach((it) => {
    const y = ly(it.e);
    b += `<line x1="${ax}" y1="${y}" x2="${ax + 60}" y2="${y}" stroke="${it.col}" stroke-width="5" stroke-linecap="round"/>`;
    b += text(ax + 72, y + 6, it.lab, { size: 16, fill: it.col, weight: "bold" });
  });
  b += lines(ax + 72, ly(5) + 30, ["也能压住枝晶（第 5 章）：", "靠“限域”而不是靠硬"], { size: 15, fill: COL.amber, lh: 20 });
  b += lines(ax + 72, ly(7.6), ["高于熔点的 PEO：", "接近粘性液体，几乎不抗剪切"], { size: 15, fill: "#7A2E52", weight: "bold", lh: 21 });
  return svg(W, H, b);
};

// ---------- Dendrite pathways in inorganic SSEs ----------
figs.dendrite_paths = () => {
  const W = 640, H = 430;
  let b = "";
  const x0 = 20, x1 = 620;
  b += `<rect x="${x0}" y="20" width="${x1 - x0}" height="30" fill="${COL.amberLight}"/>`;
  b += text(x0 + 10, 42, "正极", { size: 15, weight: "bold" });
  const g = grains(x0, 50, x1, 320, 6, 4, 5);
  b += g.svg;
  const P = g.P;
  b += `<rect x="${x0}" y="320" width="${x1 - x0}" height="50" fill="${LI}"/>`;
  b += text(x0 + 10, 352, "Li 负极", { size: 16, weight: "bold" });
  // path 1: from anode along grain boundaries + void
  const p1 = [[P[4][1][0], 320], P[3][1], P[3][2], P[2][2], P[1][2], P[0][2]];
  b += `<path d="${pathD(p1)}" fill="none" stroke="${COL.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  b += num(P[2][2][0] - 26, P[2][2][1] + 2, 1, COL.red);
  // void at surface
  b += `<ellipse cx="${P[4][4][0]}" cy="318" rx="26" ry="12" fill="#FFFFFF" stroke="${COL.red}" stroke-width="2.5"/>`;
  b += `<path d="M${P[4][4][0]},310 L${P[3][4][0]},${P[3][4][1]}" stroke="${COL.red}" stroke-width="6" stroke-linecap="round"/>`;
  b += num(P[4][4][0] + 40, 300, 2, COL.red);
  // path 3: isolated Li inside from electronic conductivity
  [[P[1][4][0] + 22, P[1][4][1] + 24], [P[2][5][0] - 26, P[2][5][1] - 14], [P[1][3][0] + 30, P[1][3][1] + 6]].forEach(([x, y]) => (b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${COL.purple}"/>`));
  b += electron(P[1][4][0] - 10, P[1][4][1] + 50, 10);
  b += num(P[1][4][0] + 52, P[1][4][1] + 34, 3, COL.purple);
  b += `<rect x="${x0}" y="380" width="${x1 - x0}" height="44" rx="10" fill="#F5F7F9"/>`;
  b += num(44, 402, 1, COL.red, 11); b += text(60, 408, "沿晶界/裂纹长", { size: 15, weight: "bold" });
  b += num(220, 402, 2, COL.red, 11); b += text(236, 408, "表面孔洞处电流集中", { size: 15, weight: "bold" });
  b += num(432, 402, 3, COL.purple, 11); b += text(448, 408, "体内得电子直接析锂", { size: 15, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Critical current density test ----------
figs.ccd = () => {
  const W = 620, H = 400;
  let b = "";
  const X0 = 80, X1 = 590, Y0 = 330, Y1 = 40;
  b += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += `<line x1="${X0}" y1="${Y0 + 60}" x2="${X0}" y2="${Y1}" stroke="${COL.ink}" stroke-width="2.5"/>`;
  b += text(X1, Y0 + 30, "时间 →（电流逐级加大）", { size: 15, anchor: "end", fill: COL.text2 });
  b += `<g transform="translate(30 ${(Y0 + Y1) / 2}) rotate(-90)">` + text(0, 0, "Li | SSE | Li 对称电池电压", { size: 15, anchor: "middle", fill: COL.text2 }) + `</g>`;
  // square-wave polarization growing with current
  let d = `M${X0},${Y0}`;
  const n = 6, sw = 62;
  for (let i = 0; i < n; i++) {
    const a = 25 + i * 32;
    const x = X0 + i * sw;
    if (i < n - 1) {
      d += ` L${x},${Y0 - a * 0.9} L${x + sw / 2},${Y0 - a * 0.9} L${x + sw / 2},${Y0 + Math.min(a * 0.3, 48)} L${x + sw},${Y0 + Math.min(a * 0.3, 48)} L${x + sw},${Y0}`;
    } else {
      d += ` L${x},${Y0 - a * 0.9} L${x + 18},${Y0 - a * 0.95} L${x + 24},${Y0 - 8} L${x + 120},${Y0 - 6}`;
    }
  }
  b += `<path d="${d}" fill="none" stroke="${COL.purple}" stroke-width="3.5" stroke-linejoin="round"/>`;
  const xs = X0 + (n - 1) * sw + 20;
  b += `<line x1="${xs}" y1="${Y1 + 10}" x2="${xs}" y2="${Y0}" stroke="${COL.red}" stroke-width="2" stroke-dasharray="6 4"/>`;
  b += lines(xs + 10, Y1 + 30, ["电压突然掉到≈0", "= 枝晶贯穿、短路"], { size: 15, fill: COL.red, weight: "bold", lh: 21 });
  b += lines(X0 + 10, Y1 + 20, ["电流越大，极化越大", "（每级先沉积、再剥离）"], { size: 15, fill: COL.purple, weight: "bold", lh: 21 });
  b += pill(xs + 8, Y1 + 66, 150, 30, COL.red, "临界电流密度 CCD", { size: 15 });
  return svg(W, H, b);
};

// ---------- Neutron depth profiling ----------
figs.ndp = () => {
  const W = 560, H = 360;
  let b = "";
  b += `<rect x="60" y="150" width="440" height="150" fill="${SSE}"/>`;
  b += `<rect x="60" y="300" width="440" height="30" fill="${LI}"/>`;
  b += text(480, 322, "Li 负极", { size: 15, anchor: "end", weight: "bold" });
  b += text(480, 172, "样品（如石榴石 SSE）", { size: 15, anchor: "end", fill: COL.text2, weight: "bold" });
  // neutron beam
  b += arrow(10, 246, 184, 241, { color: COL.muted, width: 4, head: 14 });
  b += text(10, 228, "冷中子束 n", { size: 15, weight: "bold", fill: COL.text2 });
  // reaction site
  b += `<circle cx="200" cy="240" r="19" fill="${COL.purple}"/>`;
  b += text(200, 246, "⁶Li", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += arrow(214, 230, 330, 70, { color: COL.amber, width: 3.5, head: 13 });
  b += arrow(192, 228, 120, 110, { color: COL.teal, width: 3.5, head: 13 });
  b += text(340, 64, "³H（≈2.7 MeV）", { size: 15, weight: "bold", fill: COL.amber });
  b += text(20, 96, "⁴He（≈2.05 MeV）", { size: 15, weight: "bold", fill: COL.teal });
  // detector
  b += `<rect x="360" y="80" width="150" height="34" rx="8" fill="${COL.ink}"/>`;
  b += text(435, 103, "能量探测器", { size: 15, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  b += lines(60, 350 - 2, ["埋得越深 → 出射粒子损失能量越多 → 由能谱反推 Li 的深度分布"], { size: 15, fill: COL.ink, weight: "bold" });
  return svg(W, H, b);
};

// ---------- Diagnostics timeline ----------
figs.diag_timeline = () => {
  const W = 1110, H = 320;
  const ev = [
    { year: "1969", who: ["Bauerle"], what: ["阻抗谱用于", "固体电解质"], color: COL.text2 },
    { year: "2012", who: ["Chandrashekar 等"], what: ["^{7}Li 核磁成像", "看微结构 Li"], color: COL.teal },
    { year: "2014", who: ["Harry 等"], what: ["X 射线断层", "看枝晶根部"], color: COL.teal },
    { year: "2014", who: ["Wu, Cui 等"], what: ["双功能隔膜", "提前预警短路"], color: COL.amber },
    { year: "2016", who: ["Wang Z. 等"], what: ["原位 STEM-EELS", "看界面元素"], color: COL.purple },
    { year: "2017", who: ["Li Y., Cui 等"], what: ["冷冻电镜", "看清 Li 与 SEI"], color: COL.purple },
    { year: "2017", who: ["Wang C. 等"], what: ["中子深度剖析", "Li | 石榴石界面"], color: COL.purple },
    { year: "2018", who: ["Wang S. 等"], what: ["ToF-SIMS 等", "看见 Na 枝晶"], color: COL.purple },
  ];
  return svg(W, H, timeline(W, H, ev, { axisY: 150, left: 80, right: 1010, whoSize: 17, whatSize: 16, yearSize: 24 }));
};

module.exports = figs;
