// SVG figures for the PEO–LiTFSI deck. Every figure is a pure function returning
// { w, h, svg } where w × h is the viewBox. Colours follow one semantic code:
//   Li+ = violet, ether O = red, PEO backbone = teal, TFSI- = amber.

const K = {
  ink: "#14213D", text: "#1F2937", muted: "#5B6472", line: "#C4CCD4", bg2: "#EEF2F4",
  teal: "#1F7A7A", tealL: "#D3EBE8", li: "#7B3FA0", liL: "#EADCF3",
  o: "#D1495B", oL: "#F7DADF", amber: "#D98E2B", amberL: "#FBE9CF",
  slate: "#3D5A80", slateL: "#DCE5EF", white: "#FFFFFF",
};
const FONT = "Calibri, Carlito, 'Segoe UI', Arial, sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function T(x, y, s, o = {}) {
  const a = [
    `x="${x}"`, `y="${y}"`, `font-family="${FONT}"`, `font-size="${o.size || 20}"`,
    `fill="${o.fill || K.text}"`, `text-anchor="${o.anchor || "start"}"`,
  ];
  if (o.weight) a.push(`font-weight="${o.weight}"`);
  if (o.italic) a.push(`font-style="italic"`);
  if (o.rotate) a.push(`transform="rotate(${o.rotate} ${x} ${y})"`);
  // multi-line support: s may be an array
  if (Array.isArray(s)) {
    const lh = o.lh || (o.size || 20) * 1.2;
    return `<text ${a.join(" ")}>${s.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(l)}</tspan>`).join("")}</text>`;
  }
  return `<text ${a.join(" ")}>${esc(s)}</text>`;
}

const defs = `
<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${K.text}"/></marker>
  <marker id="ahT" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${K.teal}"/></marker>
  <marker id="ahO" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${K.o}"/></marker>
  <marker id="ahL" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${K.li}"/></marker>
  <marker id="ahA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${K.amber}"/></marker>
  <marker id="ahW" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#FFFFFF"/></marker>
  <radialGradient id="liGlow"><stop offset="0" stop-color="${K.li}" stop-opacity="0.45"/><stop offset="1" stop-color="${K.li}" stop-opacity="0"/></radialGradient>
  <radialGradient id="anGlow"><stop offset="0" stop-color="${K.amber}" stop-opacity="0.35"/><stop offset="1" stop-color="${K.amber}" stop-opacity="0"/></radialGradient>
  <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke="${K.li}" stroke-width="2" stroke-opacity="0.35"/></pattern>
</defs>`;

const wrap = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs}${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>`;

// ---------- primitives ----------
const li = (x, y, r = 22, label = "Li⁺", glow = true) =>
  `${glow ? `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="url(#liGlow)"/>` : ""}<circle cx="${x}" cy="${y}" r="${r}" fill="${K.li}"/>` +
  (label ? T(x, y + r * 0.36, label, { size: r * 0.95, fill: K.white, anchor: "middle", weight: "bold" }) : "");
const oat = (x, y, r = 13, label = true) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${K.o}" stroke="${K.white}" stroke-width="2"/>` +
  (label ? T(x, y + r * 0.38, "O", { size: r * 1.05, fill: K.white, anchor: "middle", weight: "bold" }) : "");
const anion = (x, y, r = 26, label = "TFSI⁻") =>
  `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="url(#anGlow)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${K.amber}"/>` +
  (label ? T(x, y + r * 0.3, label, { size: r * 0.62, fill: K.white, anchor: "middle", weight: "bold" }) : "");
const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.color || K.text}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.marker ? ` marker-end="url(#${o.marker})"` : ""}${o.cap ? ` stroke-linecap="round"` : ""}/>`;
const path = (d, o = {}) =>
  `<path d="${d}" fill="${o.fill || "none"}" stroke="${o.color || K.teal}" stroke-width="${o.w || 6}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.marker ? ` marker-end="url(#${o.marker})"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const rect = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${o.fill || K.bg2}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;

// Smooth chain through points (Catmull-Rom → cubic Bézier)
function smooth(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// A PEO strand around a Li+ centre: arc from a0..a1 (deg) with radius r, tails curving away.
function strand(cx, cy, r, a0, a1, nO, tail = 90) {
  const rad = (a) => (a * Math.PI) / 180;
  const pts = [];
  const at = (a, rr) => [+(cx + rr * Math.cos(rad(a))).toFixed(1), +(cy + rr * Math.sin(rad(a))).toFixed(1)];
  pts.push(at(a0 + 10, r + tail));
  pts.push(at(a0 - 3, r + tail * 0.4));
  for (let k = 0; k <= 8; k++) pts.push(at(a0 + ((a1 - a0) * k) / 8, r));
  pts.push(at(a1 + 3, r + tail * 0.4));
  pts.push(at(a1 - 10, r + tail));
  const os = [];
  for (let k = 0; k < nO; k++) os.push(at(a0 + ((a1 - a0) * (k + 0.5)) / nO, r));
  return { d: smooth(pts), os };
}

// ---------- figures ----------
const figs = {};

// 1. Title hero: Li+ wrapped by two PEO strands, TFSI- outside (dark background, transparent svg)
figs.hero = () => {
  const cx = 300, cy = 300;
  const s1 = strand(cx, cy, 120, 200, 340, 3, 110);
  const s2 = strand(cx, cy, 120, 30, 150, 2, 110);
  let b = "";
  b += `<circle cx="${cx}" cy="${cy}" r="190" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="4 8"/>`;
  b += path(s1.d, { color: "#4FB3AE", w: 10 }) + path(s2.d, { color: "#4FB3AE", w: 10 });
  [...s1.os, ...s2.os].forEach(([x, y]) => (b += line(x, y, cx, cy, { color: "#E9D5F5", w: 2.5, dash: "6 6" })));
  [...s1.os, ...s2.os].forEach(([x, y]) => (b += oat(x, y, 17)));
  b += li(cx, cy, 40);
  b += anion(505, 505, 40);
  b += anion(90, 470, 30, "");
  b += anion(500, 90, 24, "");
  return { w: 600, h: 600, svg: wrap(600, 600, b) };
};

// 2. PEO repeat unit
figs.peo = () => {
  const W = 560, H = 250;
  let b = "";
  const P = [[40, 150], [130, 95], [220, 150], [310, 95], [400, 150], [490, 95]];
  // bonds
  for (let i = 0; i < P.length - 1; i++) b += line(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], { color: K.text, w: 5, cap: true });
  // brackets
  b += path(`M110,55 L95,55 L95,195 L110,195`, { color: K.text, w: 4 });
  b += path(`M405,55 L420,55 L420,195 L405,195`, { color: K.text, w: 4 });
  b += T(432, 205, "n", { size: 34, italic: true });
  b += T(130, 78, "CH₂", { size: 26, anchor: "middle", fill: K.teal, weight: "bold" });
  b += T(220, 188, "CH₂", { size: 26, anchor: "middle", fill: K.teal, weight: "bold" });
  b += `<circle cx="310" cy="95" r="26" fill="${K.o}"/>` + T(310, 105, "O", { size: 30, anchor: "middle", fill: K.white, weight: "bold" });
  b += `<circle cx="310" cy="95" r="40" fill="none" stroke="${K.o}" stroke-width="2.5" stroke-dasharray="5 5"/>`;
  b += T(310, 36, "ether O: Lewis-base donor", { size: 22, fill: K.o, weight: "bold", anchor: "middle" });
  b += T(258, 238, "–(CH₂–CH₂–O)ₙ–   flexible C–O / C–C torsions", { size: 22, anchor: "middle", fill: K.muted });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 3. TFSI anion with delocalised charge
figs.tfsi = () => {
  const W = 560, H = 290;
  let b = "";
  b += `<ellipse cx="280" cy="140" rx="230" ry="105" fill="${K.amberL}" opacity="0.85"/>`;
  b += `<ellipse cx="280" cy="140" rx="230" ry="105" fill="none" stroke="${K.amber}" stroke-width="2" stroke-dasharray="6 6"/>`;
  const N = [280, 170], S1 = [185, 120], S2 = [375, 120];
  const dbl = (a, c) => {
    const dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy), nx = (-dy / L) * 4.5, ny = (dx / L) * 4.5;
    return line(a[0] + nx, a[1] + ny, c[0] + nx, c[1] + ny, { w: 3.5 }) + line(a[0] - nx, a[1] - ny, c[0] - nx, c[1] - ny, { w: 3.5 });
  };
  const O1 = [150, 50], O2 = [105, 150], O3 = [410, 50], O4 = [455, 150], C1 = [185, 215], C2 = [375, 215];
  b += line(...N, ...S1, { w: 4 }) + line(...N, ...S2, { w: 4 });
  b += dbl(S1, O1) + dbl(S1, O2) + dbl(S2, O3) + dbl(S2, O4);
  b += line(...S1, ...C1, { w: 4 }) + line(...S2, ...C2, { w: 4 });
  const atomL = (p, lab, fill, r = 22, fs = 24) =>
    `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fill}"/>` + T(p[0], p[1] + fs * 0.35, lab, { size: fs, anchor: "middle", fill: K.white, weight: "bold" });
  b += atomL(N, "N", K.slate, 24, 26);
  b += atomL(S1, "S", "#B8860B", 24, 26) + atomL(S2, "S", "#B8860B", 24, 26);
  [O1, O2, O3, O4].forEach((p) => (b += atomL(p, "O", K.o, 18, 20)));
  b += atomL(C1, "CF₃", "#4A7C59", 30, 20) + atomL(C2, "CF₃", "#4A7C59", 30, 20);
  b += T(280, 212, "δ⁻", { size: 22, anchor: "middle", fill: K.slate, weight: "bold" });
  b += T(118, 30, "δ⁻", { size: 20, fill: K.o, weight: "bold" });
  b += T(432, 30, "δ⁻", { size: 20, fill: K.o, weight: "bold" });
  b += T(280, 280, "−1 charge spread over N, 2 S and 4 O", { size: 22, anchor: "middle", fill: K.muted });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 4. Timeline
figs.timeline = () => {
  const W = 1200, H = 330, y0 = 165;
  const ev = [
    ["1973", "Fenton, Parker, Wright", "alkali salts complex PEO", 1],
    ["1979", "Armand et al.", "PEO as battery electrolyte", 2],
    ["1983", "Berthier et al.", "ions move in the amorphous phase", 3],
    ["1990", "Armand et al.", "imide (TFSI) salts for polymers", 5],
    ["1994", "Lascaud et al.", "PEO–LiTFSI phase diagram", 7],
    ["1999", "MacGlashan, Bruce", "P(EO)₆:LiX crystal structure", 12],
    ["2006", "Borodin & Smith", "MD: Li⁺ transport mechanism", 18],
    ["2017", "Pesko, Balsara et al.", "negative transference numbers", 22],
  ];
  let b = line(40, y0, 1160, y0, { color: K.line, w: 4 });
  ev.forEach(([yr, who, what, ref], i) => {
    const x = 135 + i * 133, up = i % 2 === 0;
    const ty = up ? y0 - 40 : y0 + 40;
    b += line(x, y0, x, up ? y0 - 28 : y0 + 28, { color: K.line, w: 2 });
    b += `<circle cx="${x}" cy="${y0}" r="13" fill="${i === 3 || i === 4 ? K.amber : K.teal}" stroke="#fff" stroke-width="3"/>`;
    if (up) {
      b += T(x, ty - 66, yr, { size: 30, anchor: "middle", weight: "bold", fill: K.ink });
      b += T(x, ty - 40, who, { size: 18, anchor: "middle", weight: "bold", fill: K.teal });
      b += T(x, ty - 16, what + ` [${ref}]`, { size: 17, anchor: "middle", fill: K.muted });
    } else {
      b += T(x, ty + 26, yr, { size: 30, anchor: "middle", weight: "bold", fill: K.ink });
      b += T(x, ty + 50, who, { size: 18, anchor: "middle", weight: "bold", fill: K.teal });
      b += T(x, ty + 74, what + ` [${ref}]`, { size: 17, anchor: "middle", fill: K.muted });
    }
  });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 5. Dissolution thermodynamic cycle
figs.cycle = () => {
  const W = 760, H = 470;
  let b = "";
  const box = (x, y, w, h, title, sub, fill, stroke) =>
    rect(x, y, w, h, { fill, stroke, rx: 14 }) +
    T(x + w / 2, y + 38, title, { size: 24, anchor: "middle", weight: "bold", fill: K.ink }) +
    T(x + w / 2, y + 68, sub, { size: 19, anchor: "middle", fill: K.muted });
  b += box(20, 20, 270, 90, "LiTFSI (crystal) + PEO", "ordered lattice, free chains", K.bg2, K.line);
  b += box(470, 20, 270, 90, "Li⁺(g) + TFSI⁻(g)", "isolated gas-phase ions", K.amberL, K.amber);
  b += box(220, 350, 320, 100, "Li⁺(EO)ₓ + TFSI⁻ in PEO", "solvated ions in the melt", K.tealL, K.teal);
  // arrows
  b += line(295, 65, 462, 65, { color: K.o, w: 4, marker: "ahO" });
  b += T(378, 52, "+U(lattice)", { size: 22, anchor: "middle", fill: K.o, weight: "bold" });
  b += T(378, 95, "cost (endothermic)", { size: 18, anchor: "middle", fill: K.o });
  b += path(`M610,115 C620,230 590,330 548,380`, { color: K.teal, w: 4, marker: "ahT" });
  b += T(628, 215, "ΔH(solv) < 0", { size: 22, fill: K.teal, weight: "bold" });
  b += T(628, 242, "Li⁺···O gain", { size: 18, fill: K.teal });
  b += T(628, 265, "(dominant term)", { size: 18, fill: K.teal });
  b += path(`M175,115 C170,230 185,330 220,380`, { color: K.li, w: 5, marker: "ahL" });
  b += T(20, 200, "ΔG(dis) =", { size: 22, fill: K.li, weight: "bold" });
  b += T(20, 228, "ΔH − TΔS", { size: 22, fill: K.li, weight: "bold" });
  b += T(20, 262, "must be < 0", { size: 18, fill: K.li });
  // entropy note
  b += rect(250, 175, 300, 120, { fill: K.white, stroke: K.line, rx: 12, dash: "6 5" });
  b += T(400, 208, "Entropy penalty", { size: 21, anchor: "middle", weight: "bold", fill: K.ink });
  b += T(400, 236, "chains lose freedom wrapping Li⁺", { size: 18, anchor: "middle", fill: K.muted });
  b += T(400, 262, "→ TΔS < 0 grows with T;", { size: 18, anchor: "middle", fill: K.muted });
  b += T(400, 284, "some salts precipitate on heating", { size: 18, anchor: "middle", fill: K.muted });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 6. Anion size / delocalisation and TFSI conformers
figs.anions = () => {
  const W = 700, H = 510;
  let b = "";
  const list = [["Cl⁻", 16], ["ClO₄⁻", 24], ["BF₄⁻", 24], ["PF₆⁻", 28], ["CF₃SO₃⁻", 33], ["TFSI⁻", 44]];
  let x = 40;
  list.forEach(([lab, r], i) => {
    const cx = x + r, cy = 110;
    const op = 0.35 + i * 0.13;
    b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K.amber}" fill-opacity="${op.toFixed(2)}" stroke="${K.amber}" stroke-width="2"/>`;
    b += T(cx, cy + r + 30, lab, { size: 20, anchor: "middle", weight: i === 5 ? "bold" : undefined, fill: i === 5 ? K.amber : K.text });
    x += 2 * r + 30;
  });
  b += line(40, 210, 660, 210, { color: K.text, w: 3, marker: "ah" });
  b += T(40, 245, "larger, more delocalised anion →", { size: 20, fill: K.text });
  b += T(40, 272, "lower lattice energy, weaker Li⁺ pairing, easier dissolution", { size: 20, fill: K.text });
  // conformers
  const conf = (ox, title, cis) => {
    let s = rect(ox, 300, 300, 200, { fill: K.bg2, rx: 14 });
    const N = [ox + 150, 440], S1 = [ox + 85, 405], S2 = [ox + 215, 405];
    s += line(...N, ...S1, { w: 4 }) + line(...N, ...S2, { w: 4 });
    const c1 = [ox + 60, 362], c2 = cis ? [ox + 240, 362] : [ox + 240, 474];
    s += line(...S1, ...c1, { w: 4 }) + line(...S2, ...c2, { w: 4 });
    s += `<circle cx="${N[0]}" cy="${N[1]}" r="15" fill="${K.slate}"/>`;
    s += `<circle cx="${S1[0]}" cy="${S1[1]}" r="15" fill="#B8860B"/><circle cx="${S2[0]}" cy="${S2[1]}" r="15" fill="#B8860B"/>`;
    s += `<circle cx="${c1[0]}" cy="${c1[1]}" r="17" fill="#4A7C59"/><circle cx="${c2[0]}" cy="${c2[1]}" r="17" fill="#4A7C59"/>`;
    s += T(ox + 150, 334, title, { size: 20, anchor: "middle", weight: "bold", fill: K.ink });
    return s;
  };
  b += conf(40, "cisoid (C₁)", true);
  b += conf(370, "transoid (C₂)", false);
  b += T(355, 296, "", { size: 4 });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 7. Li+ solvation by two PEO strands
figs.solvation = () => {
  const W = 640, H = 540, cx = 300, cy = 270;
  let b = "";
  const s1 = strand(cx, cy, 118, 195, 345, 3, 120);
  const s2 = strand(cx, cy, 118, 35, 145, 2, 120);
  b += path(s1.d, { color: K.teal, w: 9 }) + path(s2.d, { color: K.teal, w: 9 });
  [...s1.os, ...s2.os].forEach(([x, y]) => (b += line(x, y, cx, cy, { color: K.li, w: 2.5, dash: "6 5" })));
  [...s1.os, ...s2.os].forEach(([x, y]) => (b += oat(x, y, 17)));
  b += li(cx, cy, 34);
  b += T(70, 60, "strand 1", { size: 22, fill: K.teal, weight: "bold" });
  b += T(70, 500, "strand 2", { size: 22, fill: K.teal, weight: "bold" });
  // distance annotation
  b += T(cx - 60, cy + 12, "Li–O ≈ 2 Å", { size: 20, fill: K.li, weight: "bold", anchor: "end" });
  b += anion(560, 440, 36);
  b += path(`M520,405 C500,380 470,360 430,345`, { color: K.amber, w: 3, dash: "6 6", marker: "ahA" });
  b += T(470, 515, "enters shell as salt ↑", { size: 19, fill: K.amber, anchor: "middle" });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 8. Crystalline complexes: P(EO)6 tunnels vs P(EO)3 helix
figs.crystals = () => {
  const W = 1040, H = 470;
  let b = "";
  b += rect(10, 10, 500, 450, { fill: K.bg2, rx: 18 }) + rect(530, 10, 500, 450, { fill: K.bg2, rx: 18 });
  b += T(260, 52, "P(EO)₆:LiX  —  tunnel", { size: 26, anchor: "middle", weight: "bold", fill: K.ink });
  b += T(780, 52, "P(EO)₃:LiX  —  helix", { size: 26, anchor: "middle", weight: "bold", fill: K.ink });
  // left: two strands forming cylinder, Li in row
  const yc = 230;
  const wave = (y0, amp, ph) => {
    const pts = [];
    for (let x = 40; x <= 480; x += 20) pts.push([x, +(y0 + amp * Math.sin((x / 440) * 4 * Math.PI + ph)).toFixed(1)]);
    return pts;
  };
  const up = wave(yc - 55, 16, 0), dn = wave(yc + 55, 16, Math.PI);
  b += path(smooth(up), { color: K.teal, w: 8 }) + path(smooth(dn), { color: K.teal, w: 8 });
  [100, 210, 320, 430].forEach((x) => {
    b += li(x, yc, 18, "", false);
    const pu = up.reduce((a, p) => (Math.abs(p[0] - x) < Math.abs(a[0] - x) ? p : a));
    const pd = dn.reduce((a, p) => (Math.abs(p[0] - x) < Math.abs(a[0] - x) ? p : a));
    b += line(x, yc - 18, pu[0], pu[1] + 10, { color: K.li, w: 2, dash: "4 4" }) + line(x, yc + 18, pd[0], pd[1] - 10, { color: K.li, w: 2, dash: "4 4" });
  });
  [80, 200, 320, 440].forEach((x, i) => (b += anion(x + (i % 2) * 20, 105, 20, "")));
  [140, 260, 380].forEach((x) => (b += anion(x, 360, 20, "")));
  b += T(260, 410, "2 non-helical strands wrap Li⁺; anions sit", { size: 20, anchor: "middle", fill: K.muted });
  b += T(260, 436, "outside, between tunnels [12, 13]", { size: 20, anchor: "middle", fill: K.muted });
  // right: helix
  const hx0 = 570, hx1 = 990, hy = 230, A = 70;
  const back = [], front = [];
  for (let x = hx0; x <= hx1; x += 6) {
    const ph = ((x - hx0) / 105) * 2 * Math.PI;
    const p = [x, +(hy + A * Math.sin(ph)).toFixed(1)];
    (Math.cos(ph) < 0 ? back : front).push([p, Math.cos(ph) < 0]);
  }
  // draw as segments coloured by depth
  for (let x = hx0; x < hx1; x += 6) {
    const ph1 = ((x - hx0) / 105) * 2 * Math.PI, ph2 = ((x + 6 - hx0) / 105) * 2 * Math.PI;
    if (Math.cos(ph1) < 0) b += line(x, hy + A * Math.sin(ph1), x + 6, hy + A * Math.sin(ph2), { color: "#8FC3BF", w: 8, cap: true });
  }
  for (let k = 0; k < 4; k++) b += li(hx0 + 52 + k * 105, hy, 17, "", false);
  for (let x = hx0; x < hx1; x += 6) {
    const ph1 = ((x - hx0) / 105) * 2 * Math.PI, ph2 = ((x + 6 - hx0) / 105) * 2 * Math.PI;
    if (Math.cos(ph1) >= 0) b += line(x, hy + A * Math.sin(ph1), x + 6, hy + A * Math.sin(ph2), { color: K.teal, w: 8, cap: true });
  }
  for (let k = 0; k < 4; k++) {
    const x = hx0 + 52 + k * 105, ay = k % 2 ? hy + 125 : hy - 125;
    b += line(x, hy + (k % 2 ? 17 : -17), x, ay + (k % 2 ? -20 : 20), { color: K.amber, w: 3, dash: "5 4" });
    b += anion(x, ay, 20, "");
  }
  b += T(780, 410, "1 helix per Li⁺ row; anions coordinate Li⁺", { size: 20, anchor: "middle", fill: K.muted });
  b += T(780, 436, "directly (X = CF₃SO₃⁻, TFSI⁻) [10, 11]", { size: 20, anchor: "middle", fill: K.muted });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 9. Schematic phase diagram
figs.phase = () => {
  const W = 780, H = 520;
  const x0 = 90, x1 = 740, y0 = 440, y1 = 40; // plot box
  const X = (f) => x0 + (f / 0.36) * (x1 - x0); // f = Li/(EO+Li)
  const Y = (t) => y0 - (t / 185) * (y0 - y1); // schematic temperature 0..220
  let b = "";
  // amorphous-at-RT band (n ≈ 6–12)
  b += `<rect x="${X(1 / 13)}" y="${Y(39)}" width="${X(1 / 7) - X(1 / 13)}" height="${y0 - Y(39)}" fill="url(#hatch)"/>`;
  // liquidus
  const liq = [[0, 65], [0.03, 58], [0.07, 44], [0.09, 40], [0.115, 55], [0.143, 62], [0.17, 57], [0.2, 80], [0.25, 125], [0.29, 115], [0.333, 155], [0.36, 175]];
  b += path(smooth(liq.map(([f, t]) => [+X(f).toFixed(1), +Y(t).toFixed(1)])), { color: K.ink, w: 4 });
  // solidus / eutectic lines
  b += line(X(0), Y(40), X(0.143), Y(40), { color: K.ink, w: 2.5, dash: "8 6" });
  b += line(X(0.143), Y(57), X(0.25), Y(57), { color: K.ink, w: 2.5, dash: "8 6" });
  // compound verticals
  [[1 / 7, "P(EO)₆"], [0.25, "P(EO)₃"], [1 / 3, "P(EO)₂"]].forEach(([f, l]) => {
    b += line(X(f), Y(f === 0.25 ? 125 : f > 0.3 ? 155 : 62), X(f), y0, { color: K.li, w: 3 });
    b += T(X(f), y0 + 62, l, { size: 19, anchor: "middle", fill: K.li, weight: "bold" });
  });
  // RT line
  b += line(x0, Y(22), x1, Y(22), { color: K.o, w: 2, dash: "3 5" });
  b += T(X(0.196), Y(22) - 8, "room temp.", { size: 18, anchor: "middle", fill: K.o });
  // axes
  b += line(x0, y0, x1, y0, { w: 3 }) + line(x0, y0, x0, y1, { w: 3 });
  b += T(30, (y0 + y1) / 2, "Temperature →", { size: 22, anchor: "middle", rotate: -90, fill: K.text });
  [["∞", 0], ["20", 1 / 21], ["12", 1 / 13], ["8", 1 / 9], ["6", 1 / 7], ["3", 0.25], ["2", 1 / 3]].forEach(([l, f]) => {
    b += line(X(f), y0, X(f), y0 + 8, { w: 2 });
    b += T(X(f), y0 + 32, l, { size: 19, anchor: "middle", fill: K.muted });
  });
  b += T(x0 - 6, y0 + 32, "EO:Li", { size: 19, anchor: "end", fill: K.muted, weight: "bold" });
  // labels
  b += T(X(0.2), Y(185), "amorphous melt (L)", { size: 24, anchor: "middle", weight: "bold", fill: K.teal });
  b += T(x0 + 8, Y(74), "Tm(PEO) ≈ 65 °C", { size: 18, fill: K.text });
  b += T(x0 + 6, Y(46), "PEO(c)+L", { size: 17, fill: K.muted });
  b += T(x0 + 6, Y(7), "PEO(c)+P(EO)₆", { size: 17, fill: K.muted });
  b += T(X(0.12), Y(120), "slow to crystallise:", { size: 18, anchor: "middle", fill: K.li, weight: "bold" });
  b += T(X(0.12), Y(120) + 22, "often amorphous at RT", { size: 18, anchor: "middle", fill: K.li, weight: "bold" });
  b += line(X(0.115), Y(120) + 30, X(0.11), Y(30), { color: K.li, w: 2, marker: "ahL" });
  b += T(X(0.06), Y(27), "eutectic", { size: 17, anchor: "middle", fill: K.ink });
  b += T(X(0.196), Y(6), "P(EO)₆ + P(EO)₃", { size: 17, anchor: "middle", fill: K.muted });
  b += T(x1, 28, "SCHEMATIC – not to scale", { size: 17, anchor: "end", fill: K.o, weight: "bold" });
  b += T((x0 + x1) / 2, y0 + 82, "salt content →", { size: 19, anchor: "middle", fill: K.text });
  return { w: W, h: H + 50, svg: wrap(W, H + 50, b) };
};

// 10. Tg rises with salt: transient crosslinks
figs.tg = () => {
  const W = 760, H = 420;
  let b = "";
  const x0 = 70, x1 = 350, y0 = 340, y1 = 40;
  b += line(x0, y0, x1, y0, { w: 3 }) + line(x0, y0, x0, y1, { w: 3 });
  const pts = [];
  for (let i = 0; i <= 20; i++) { const f = i / 20; pts.push([+(x0 + f * (x1 - x0 - 10)).toFixed(1), +(y0 - 30 - 250 * (f + 1.4 * f * f) / 2.4).toFixed(1)]); }
  b += path(smooth(pts), { color: K.li, w: 5 });
  b += T(x0 - 10, y0 - 30 + 6, "−60 °C", { size: 18, anchor: "end", fill: K.muted });
  b += T(35, (y0 + y1) / 2, "Tg →", { size: 22, anchor: "middle", rotate: -90 });
  b += T((x0 + x1) / 2, y0 + 36, "salt content →", { size: 20, anchor: "middle" });
  b += T(x0 + 14, y1 + 20, "schematic trend", { size: 17, fill: K.o, weight: "bold" });
  // crosslink cartoon
  const cx = 560;
  const a = smooth([[400, 90], [470, 140], [540, 120], [610, 150], [690, 110], [740, 140]]);
  const c = smooth([[400, 330], [470, 280], [540, 300], [610, 270], [690, 310], [740, 290]]);
  b += path(a, { color: K.teal, w: 8 }) + path(c, { color: K.teal, w: 8 });
  [[505, 135, 505, 290], [650, 135, 650, 285]].forEach(([xa, ya, xb, yb]) => {
    const ym = (ya + yb) / 2;
    b += line(xa - 14, ya + 6, xa, ym, { color: K.li, w: 2.5, dash: "5 4" }) + line(xa + 14, ya + 6, xa, ym, { color: K.li, w: 2.5, dash: "5 4" });
    b += line(xb - 14, yb - 6, xb, ym, { color: K.li, w: 2.5, dash: "5 4" }) + line(xb + 14, yb - 6, xb, ym, { color: K.li, w: 2.5, dash: "5 4" });
    b += oat(xa - 14, ya + 6, 11, false) + oat(xa + 14, ya + 6, 11, false) + oat(xb - 14, yb - 6, 11, false) + oat(xb + 14, yb - 6, 11, false);
    b += li(xa, ym, 22);
  });
  b += T(cx + 10, 390, "Li⁺ = transient crosslink", { size: 21, anchor: "middle", fill: K.li, weight: "bold" });
  b += T(cx + 10, 414, "slows segmental motion", { size: 19, anchor: "middle", fill: K.muted });
  return { w: W, h: H + 10, svg: wrap(W, H + 10, b) };
};

// 11. Conductivity optimum: carriers vs mobility
figs.sigma = () => {
  const W = 700, H = 440;
  const x0 = 70, x1 = 660, y0 = 370, y1 = 30;
  let b = line(x0, y0, x1, y0, { w: 3 }) + line(x0, y0, x0, y1, { w: 3 });
  const N = 40, n = [], mu = [], s = [];
  for (let i = 0; i <= N; i++) {
    const f = i / N, x = x0 + f * (x1 - x0 - 20);
    const nn = f, mm = Math.exp(-3.2 * f), ss = nn * mm;
    n.push([+x.toFixed(1), +(y0 - 300 * nn).toFixed(1)]);
    mu.push([+x.toFixed(1), +(y0 - 300 * mm).toFixed(1)]);
    s.push([+x.toFixed(1), +(y0 - 300 * ss / 0.115).toFixed(1)]);
  }
  b += path(smooth(n), { color: K.amber, w: 4, dash: "10 8" });
  b += path(smooth(mu), { color: K.teal, w: 4, dash: "10 8" });
  b += path(smooth(s), { color: K.li, w: 6 });
  const im = Math.round(N / 3.2);
  b += line(s[im][0], s[im][1], s[im][0], y0, { color: K.li, w: 2, dash: "4 5" });
  b += T(s[im][0], y0 + 34, "σ max", { size: 20, anchor: "middle", fill: K.li, weight: "bold" });
  b += T(n[N][0] - 10, n[N][1] - 14, "carrier number n", { size: 20, anchor: "end", fill: K.amber, weight: "bold" });
  b += T(mu[24][0] - 10, mu[24][1] - 26, "mobility μ (Tg ↑)", { size: 20, fill: K.teal, weight: "bold" });
  b += T(s[im][0] + 14, s[im][1] - 14, "σ = Σ nqμ", { size: 22, fill: K.li, weight: "bold" });
  b += T(35, (y0 + y1) / 2, "relative value →", { size: 20, anchor: "middle", rotate: -90 });
  b += T((x0 + x1) / 2 + 120, y0 + 34, "salt content →", { size: 20, anchor: "middle" });
  b += T(x1, 28, "schematic", { size: 17, anchor: "end", fill: K.o, weight: "bold" });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 12. Three Li+ transport modes
figs.modes = () => {
  const W = 1140, H = 380;
  let b = "";
  const panel = (ox, title, sub) =>
    rect(ox, 10, 360, 360, { fill: K.bg2, rx: 18 }) +
    T(ox + 180, 50, title, { size: 24, anchor: "middle", weight: "bold", fill: K.ink }) +
    T(ox + 180, 352, sub, { size: 19, anchor: "middle", fill: K.muted });
  // (i) along chain
  b += panel(10, "① along the chain", "Li⁺ slides between O cages");
  const c1 = [[30, 220], [90, 180], [150, 220], [210, 180], [270, 220], [350, 185]];
  b += path(smooth(c1), { color: K.teal, w: 8 });
  [[90, 180], [210, 180]].forEach(([x, y]) => (b += oat(x, y, 11, false)));
  b += li(120, 140, 20) + `<circle cx="250" cy="140" r="20" fill="none" stroke="${K.li}" stroke-width="3" stroke-dasharray="5 4"/>`;
  b += path(`M145,125 C180,100 210,100 232,122`, { color: K.li, w: 3.5, marker: "ahL" });
  // (ii) with the segment
  b += panel(390, "② with the segment", "Li⁺ rides segmental motion");
  const c2a = [[410, 240], [470, 210], [530, 240], [590, 210], [650, 240], [730, 215]];
  const c2b = c2a.map(([x, y]) => [x, y - 55 + (x > 500 && x < 660 ? -15 : 0)]);
  b += path(smooth(c2a), { color: K.teal, w: 8, opacity: 0.35 });
  b += path(smooth(c2b), { color: K.teal, w: 8 });
  b += li(560, 270, 18, "", false) + `<circle cx="560" cy="270" r="18" fill="${K.li}" opacity="0.35"/>`;
  b += li(560, 145, 20);
  b += path(`M600,262 C640,230 640,190 600,160`, { color: K.li, w: 3.5, marker: "ahL" });
  b += T(660, 300, "t₀", { size: 18, fill: K.muted }) + T(660, 140, "t₁", { size: 18, fill: K.muted });
  // (iii) inter-chain hop
  b += panel(770, "③ inter-chain hop", "Li⁺ swaps to another chain");
  b += path(smooth([[790, 130], [850, 100], [910, 130], [970, 100], [1030, 130], [1110, 105]]), { color: K.teal, w: 8 });
  b += path(smooth([[790, 290], [850, 260], [910, 290], [970, 260], [1030, 290], [1110, 265]]), { color: "#2F9C8F", w: 8 });
  b += li(880, 160, 20) + `<circle cx="1000" cy="232" r="20" fill="none" stroke="${K.li}" stroke-width="3" stroke-dasharray="5 4"/>`;
  b += path(`M902,170 C950,180 960,210 980,222`, { color: K.li, w: 3.5, marker: "ahL" });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 13. Ion speciation
figs.species = () => {
  const W = 1100, H = 300;
  let b = "";
  const cage = (x, y) => {
    let s = `<circle cx="${x}" cy="${y}" r="44" fill="none" stroke="${K.teal}" stroke-width="7"/>`;
    for (let k = 0; k < 5; k++) { const a = (k / 5) * 2 * Math.PI - Math.PI / 2; s += oat(x + 44 * Math.cos(a), y + 44 * Math.sin(a), 9, false); }
    return s;
  };
  const col = (ox, title, sub) => T(ox, 240, title, { size: 23, anchor: "middle", weight: "bold", fill: K.ink }) + T(ox, 268, sub, { size: 18, anchor: "middle", fill: K.muted });
  // free ions
  b += cage(120, 120) + li(120, 120, 20) + anion(215, 70, 24, "");
  b += col(150, "free ions", "Li⁺ fully wrapped by EO");
  // contact ion pair
  b += cage(420, 125) + li(420, 125, 20) + anion(470, 82, 24, "") + line(432, 110, 456, 92, { color: K.amber, w: 4 });
  b += col(430, "contact ion pair", "TFSI⁻ O enters Li⁺ shell");
  // aggregate
  b += li(700, 110, 18) + li(780, 150, 18) + anion(740, 70, 22, "") + anion(700, 175, 22, "") + anion(810, 85, 20, "");
  b += line(712, 96, 725, 82, { color: K.amber, w: 4 }) + line(768, 136, 753, 84, { color: K.amber, w: 4 }) + line(700, 128, 700, 155, { color: K.amber, w: 4 }) + line(788, 133, 800, 103, { color: K.amber, w: 4 });
  b += col(750, "aggregates", "neutral / charged clusters");
  // arrow
  b += line(900, 125, 1080, 125, { color: K.text, w: 4, marker: "ah" });
  b += T(990, 105, "salt ↑, T ↑", { size: 22, anchor: "middle", weight: "bold" });
  b += T(990, 160, "less free ions", { size: 18, anchor: "middle", fill: K.muted });
  b += line(300, 30, 300, 210, { color: K.line, w: 2 }) + line(600, 30, 600, 210, { color: K.line, w: 2 });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 14. Vibrational band schematic (TFSI ~740 cm-1)
figs.band = () => {
  const W = 520, H = 345;
  const x0 = 40, x1 = 490, y0 = 270, y1 = 30;
  const X = (nu) => x0 + ((nu - 730) / 25) * (x1 - x0); // 730–755 cm-1
  const g = (nu, c, s, a) => a * Math.exp(-((nu - c) ** 2) / (2 * s * s));
  const mk = (fn) => { const p = []; for (let nu = 730; nu <= 755; nu += 0.5) p.push([+X(nu).toFixed(1), +(y0 - 210 * fn(nu)).toFixed(1)]); return smooth(p); };
  let b = line(x0, y0, x1, y0, { w: 3 });
  b += path(mk((n) => g(n, 740.5, 2.2, 0.75)), { color: K.amber, w: 3, dash: "7 6" });
  b += path(mk((n) => g(n, 746, 2.6, 0.5)), { color: K.li, w: 3, dash: "7 6" });
  b += path(mk((n) => g(n, 740.5, 2.2, 0.75) + g(n, 746, 2.6, 0.5)), { color: K.ink, w: 5 });
  b += T(X(737), y0 - 175, "free", { size: 30, anchor: "end", fill: K.amber, weight: "bold" });
  b += T(X(748.5), y0 - 120, "Li⁺-bound", { size: 30, fill: K.li, weight: "bold" });
  [735, 740, 745, 750].forEach((nu) => (b += line(X(nu), y0, X(nu), y0 + 8, { w: 2 }) + T(X(nu), y0 + 32, String(nu), { size: 24, anchor: "middle", fill: K.muted })));
  b += T((x0 + x1) / 2, y0 + 62, "Raman shift / cm⁻¹ (schematic)", { size: 24, anchor: "middle" });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 15. Transference: slow Li+, fast TFSI-
figs.transfer = () => {
  const W = 680, H = 380;
  let b = "";
  b += rect(20, 40, 70, 280, { fill: "#B9C2CC", rx: 6 }) + rect(590, 40, 70, 280, { fill: "#B9C2CC", rx: 6 });
  b += T(55, 30, "Li", { size: 22, anchor: "middle", weight: "bold" }) + T(625, 30, "Li", { size: 22, anchor: "middle", weight: "bold" });
  b += T(55, 348, "(+)", { size: 20, anchor: "middle", fill: K.muted }) + T(625, 348, "(−)", { size: 20, anchor: "middle", fill: K.muted });
  b += `<defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="${K.amber}" stop-opacity="0.45"/><stop offset="1" stop-color="${K.amber}" stop-opacity="0.05"/></linearGradient></defs>`;
  b += rect(90, 40, 500, 280, { fill: "url(#cg)", rx: 0 });
  // chains
  [100, 170, 240].forEach((y, i) => (b += path(smooth([[95, y], [180, y + 25], [270, y - 5], [360, y + 25], [450, y - 5], [585, y + 20]]), { color: K.teal, w: 5, opacity: 0.55 })));
  // Li slow arrows to right
  [[180, 140], [330, 205], [430, 120]].forEach(([x, y]) => (b += li(x, y, 16, "", false) + line(x + 20, y, x + 55, y, { color: K.li, w: 4, marker: "ahL" })));
  // TFSI fast arrows to left
  [[250, 270], [470, 255], [380, 90]].forEach(([x, y]) => (b += anion(x, y, 18, "") + line(x - 24, y, x - 120, y, { color: K.amber, w: 5, marker: "ahA" })));
  b += T(340, 370, "salt piles up at (+), depletes at (−) → polarisation", { size: 20, anchor: "middle", fill: K.muted });
  return { w: W, h: H + 10, svg: wrap(W, H + 10, b) };
};

// ---------- small icons (120×120, in a tinted circle) ----------
const icon = (body, tint = K.tealL) => {
  const s = `<circle cx="60" cy="60" r="58" fill="${tint}"/>${body}`;
  return { w: 120, h: 120, svg: wrap(120, 120, s) };
};
figs.ic_dsc = () => icon(path(smooth([[22, 70], [40, 70], [48, 58], [64, 56], [72, 56], [78, 30], [84, 56], [100, 56]]), { color: K.teal, w: 5 }));
figs.ic_eis = () => icon(line(20, 88, 100, 88, { color: K.muted, w: 3 }) + path(`M28,88 A26,26 0 0 1 80,88 L100,50`, { color: K.teal, w: 5 }));
figs.ic_nmr = () => icon(line(18, 90, 102, 90, { color: K.muted, w: 3 }) + path(smooth([[18, 88], [36, 88], [42, 40], [48, 88], [66, 88], [72, 25], [78, 88], [102, 88]]), { color: K.li, w: 4 }), K.liL);
figs.ic_raman = () => icon(line(18, 90, 102, 90, { color: K.muted, w: 3 }) + path(smooth([[18, 88], [44, 87], [54, 34], [64, 70], [74, 88], [102, 88]]), { color: K.amber, w: 5 }), K.amberL);
figs.ic_scatter = () => icon([18, 30, 42].map((r) => `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${K.slate}" stroke-width="3.5" stroke-dasharray="${r === 42 ? "7 5" : "none"}"/>`).join("") + `<circle cx="60" cy="60" r="6" fill="${K.slate}"/>`, K.slateL);
figs.ic_md = () => icon(path(smooth([[20, 70], [40, 50], [60, 64], [80, 44], [100, 58]]), { color: K.teal, w: 5 }) + li(60, 86, 11, "", false) + oat(40, 50, 7, false) + oat(80, 44, 7, false) + line(60, 86, 40, 50, { color: K.li, w: 2, dash: "3 3" }) + line(60, 86, 80, 44, { color: K.li, w: 2, dash: "3 3" }), K.tealL);

// casting / troubleshooting icons
figs.ic_salt = () => icon(`<rect x="38" y="44" width="44" height="48" rx="6" fill="${K.amber}"/>` + [0, 1, 2].map((i) => `<rect x="${44 + i * 13}" y="${24 + (i % 2) * 6}" width="9" height="9" fill="${K.amber}" opacity="0.7"/>`).join("") + T(60, 76, "+Li", { size: 18, anchor: "middle", fill: "#fff", weight: "bold" }), K.amberL);
figs.ic_scission = () => icon(path(`M18,64 C30,50 40,78 52,62`, { color: K.teal, w: 6 }) + path(`M68,58 C80,42 90,70 102,56`, { color: K.teal, w: 6 }) + path(`M56,40 L64,56 L54,62 L64,80`, { color: K.o, w: 4 }), K.tealL);
figs.ic_solvent = () => icon(path(`M60,22 C76,46 86,60 86,74 A26,26 0 0 1 34,74 C34,60 44,46 60,22 Z`, { color: K.slate, w: 4, fill: K.slateL }) + T(60, 84, "MeCN", { size: 15, anchor: "middle", fill: K.slate, weight: "bold" }), K.white);
figs.ic_water = () => icon(path(`M60,22 C76,46 86,60 86,74 A26,26 0 0 1 34,74 C34,60 44,46 60,22 Z`, { color: K.teal, w: 4, fill: "#BFE3F0" }) + T(60, 84, "H₂O", { size: 18, anchor: "middle", fill: K.teal, weight: "bold" }), K.white);
figs.ic_clock = () => icon(`<circle cx="60" cy="60" r="34" fill="#fff" stroke="${K.li}" stroke-width="5"/>` + line(60, 60, 60, 36, { color: K.li, w: 5, cap: true }) + line(60, 60, 78, 68, { color: K.li, w: 5, cap: true }), K.liL);
figs.ic_mould = () => icon(path(`M22,52 L28,84 L92,84 L98,52`, { color: K.muted, w: 5, fill: "#fff" }) + `<rect x="31" y="66" width="58" height="12" fill="${K.teal}" opacity="0.6"/>` + line(16, 98, 104, 98, { color: K.o, w: 3, dash: "6 4" }), K.bg2);
figs.ic_press = () => icon(`<rect x="26" y="24" width="68" height="14" rx="3" fill="${K.slate}"/><rect x="26" y="82" width="68" height="14" rx="3" fill="${K.slate}"/><rect x="34" y="56" width="52" height="10" rx="2" fill="${K.teal}"/>` + line(60, 40, 60, 52, { color: K.o, w: 4, marker: "ahO" }) + line(60, 80, 60, 70, { color: K.o, w: 4, marker: "ahO" }), K.slateL);
figs.ic_net = () => icon(path(smooth([[20, 40], [50, 54], [80, 36], [100, 48]]), { color: K.teal, w: 5 }) + path(smooth([[20, 84], [50, 70], [80, 88], [100, 76]]), { color: K.teal, w: 5 }) + line(50, 54, 50, 70, { color: K.li, w: 5 }) + line(80, 36, 80, 88, { color: K.li, w: 5 }) + `<circle cx="50" cy="62" r="5" fill="${K.li}"/><circle cx="80" cy="62" r="5" fill="${K.li}"/>`, K.liL);
figs.ic_scaffold = () => icon([30, 50, 70, 90].map((x) => line(x, 24, x, 96, { color: K.slate, w: 3 })).join("") + [36, 60, 84].map((y) => line(22, y, 98, y, { color: K.slate, w: 3 })).join("") + `<rect x="22" y="48" width="76" height="24" fill="${K.teal}" opacity="0.35"/>`, K.slateL);
figs.ic_liner = () => icon(`<rect x="20" y="70" width="80" height="12" rx="3" fill="${K.muted}" opacity="0.5"/>` + path(`M26,66 L94,66`, { color: K.teal, w: 6 }) + path(`M94,66 C100,52 92,40 78,36`, { color: K.teal, w: 6 }) + line(84, 30, 98, 22, { color: K.o, w: 3, marker: "ahO" }), K.bg2);

// 16. Casting workflow
figs.workflow = () => {
  const W = 1220, H = 330;
  let b = "";
  const steps = [
    ["Dry", "PEO 50 °C, LiTFSI", "≥100 °C, vacuum"],
    ["Weigh", "target EO:Li", "in Ar glovebox"],
    ["Dissolve", "dry MeCN, 3–8 wt%", "stir gently 12–24 h"],
    ["Cast", "levelled PTFE", "mould, no bubbles"],
    ["Evaporate", "lid ajar, slow", "~24 h, dry gas"],
    ["Vacuum-dry", "50–60 °C", "24–48 h"],
    ["Age & peel", "rest at RT days,", "chill, then peel"],
  ];
  const ic = [
    // dry: oven
    (x, y) => rect(x - 32, y - 28, 64, 56, { fill: "#fff", stroke: K.slate, sw: 4, rx: 6 }) + `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${K.o}" stroke-width="4"/>`,
    // weigh: balance
    (x, y) => rect(x - 32, y + 10, 64, 18, { fill: K.slate, rx: 4 }) + rect(x - 22, y - 6, 44, 10, { fill: K.slate, rx: 3 }) + `<rect x="${x - 10}" y="${y - 26}" width="20" height="18" fill="${K.amber}"/>`,
    // dissolve: beaker
    (x, y) => path(`M${x - 26},${y - 30} L${x - 22},${y + 28} L${x + 22},${y + 28} L${x + 26},${y - 30}`, { color: K.slate, w: 4, fill: "#fff" }) + `<rect x="${x - 21}" y="${y - 4}" width="42" height="30" fill="${K.teal}" opacity="0.45"/><rect x="${x - 10}" y="${y + 16}" width="20" height="6" rx="3" fill="${K.text}"/>`,
    // cast: pour into dish
    (x, y) => path(`M${x - 34},${y + 6} L${x - 30},${y + 28} L${x + 30},${y + 28} L${x + 34},${y + 6}`, { color: K.muted, w: 4, fill: "#fff" }) + `<rect x="${x - 29}" y="${y + 16}" width="58" height="10" fill="${K.teal}" opacity="0.55"/>` + path(`M${x + 6},${y - 30} C${x + 2},${y - 10} ${x + 4},${y} ${x + 2},${y + 14}`, { color: K.teal, w: 4 }),
    // evaporate: dish + lid ajar + vapour
    (x, y) => path(`M${x - 34},${y + 6} L${x - 30},${y + 28} L${x + 30},${y + 28} L${x + 34},${y + 6}`, { color: K.muted, w: 4, fill: "#fff" }) + `<rect x="${x - 29}" y="${y + 18}" width="58" height="8" fill="${K.teal}" opacity="0.55"/>` + line(x - 38, y - 2, x + 30, y - 12, { color: K.slate, w: 5, cap: true }) + path(`M${x + 34},${y - 6} c6,-8 -6,-14 0,-22`, { color: K.slate, w: 2.5 }),
    // vacuum oven
    (x, y) => rect(x - 32, y - 28, 64, 56, { fill: "#fff", stroke: K.slate, sw: 4, rx: 6 }) + T(x, y + 8, "vac", { size: 20, anchor: "middle", fill: K.slate, weight: "bold" }),
    // peel film
    (x, y) => rect(x - 34, y + 12, 68, 12, { fill: K.muted, rx: 3 }) + path(`M${x - 30},${y + 8} L${x + 14},${y + 8} C${x + 30},${y + 6} ${x + 30},${y - 14} ${x + 18},${y - 26}`, { color: K.teal, w: 6 }),
  ];
  const gap = 172;
  steps.forEach(([t, a, c], i) => {
    const x = 92 + i * gap, y = 100;
    b += `<circle cx="${x}" cy="${y}" r="64" fill="${i === 3 || i === 6 ? K.tealL : K.bg2}"/>`;
    b += ic[i](x, y);
    b += `<circle cx="${x - 48}" cy="${y - 50}" r="18" fill="${K.ink}"/>` + T(x - 48, y - 43, String(i + 1), { size: 20, anchor: "middle", fill: "#fff", weight: "bold" });
    if (i < steps.length - 1) b += line(x + 70, y, x + gap - 72, y, { color: K.line, w: 4, marker: "ah" });
    b += T(x, 205, t, { size: 26, anchor: "middle", weight: "bold", fill: K.ink });
    b += T(x, 240, a, { size: 20, anchor: "middle", fill: K.muted });
    b += T(x, 266, c, { size: 20, anchor: "middle", fill: K.muted });
  });
  b += T(610, 318, "everything from step 2 onward under Ar or in a dry room (LiTFSI and PEO are hygroscopic)", { size: 20, anchor: "middle", fill: K.o, weight: "bold" });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 17. PTFE mould cross-section
figs.mould = () => {
  const W = 680, H = 450;
  let b = "";
  // bench + level
  b += line(30, 330, 650, 330, { color: K.muted, w: 4 });
  b += rect(250, 345, 180, 34, { fill: "#E6F2D9", stroke: "#6B8F3A", rx: 17 }) + `<ellipse cx="340" cy="362" rx="20" ry="10" fill="#fff" stroke="#6B8F3A" stroke-width="2"/>` + line(316, 350, 316, 374, { color: "#6B8F3A", w: 2 }) + line(364, 350, 364, 374, { color: "#6B8F3A", w: 2 });
  b += T(340, 405, "level it first", { size: 20, anchor: "middle", fill: "#4E6B26", weight: "bold" });
  // dish walls (PTFE, white with grey outline)
  b += path(`M110,170 L110,330 L570,330 L570,170 L545,170 L545,305 L135,305 L135,170 Z`, { color: K.muted, w: 3, fill: "#F7F8FA" });
  b += T(80, 250, "PTFE", { size: 20, anchor: "middle", fill: K.muted, weight: "bold", rotate: -90 });
  // solution with meniscus (PTFE: low wetting → convex edges)
  b += path(`M135,305 L135,262 C150,250 165,248 185,248 L495,248 C515,248 530,250 545,262 L545,305 Z`, { color: K.teal, w: 2, fill: "rgba(31,122,122,0.28)" });
  b += T(340, 285, "PEO + LiTFSI in MeCN", { size: 22, anchor: "middle", fill: K.teal, weight: "bold" });
  // lid ajar
  b += line(95, 150, 585, 128, { color: K.slate, w: 7, cap: true });
  b += T(600, 120, "lid ajar", { size: 20, fill: K.slate, weight: "bold" });
  // vapour arrows out of the gap
  b += path(`M560,165 C585,150 600,140 630,150`, { color: K.slate, w: 3, marker: "ah", dash: "6 5" });
  b += T(470, 112, "slow MeCN escape (~24 h)", { size: 19, anchor: "end", fill: K.slate });
  // callouts
  b += line(160, 250, 200, 205, { color: K.o, w: 2 }) + T(205, 200, "rim stays thicker → trim edges", { size: 19, fill: K.o });
  b += T(30, 440, "scratches in PTFE trap film → use smooth, undamaged mould", { size: 19, fill: K.muted });
  return { w: W, h: H + 10, svg: wrap(W, H + 10, b) };
};


// 18. Schematic DSC heating traces vs salt content (endo down)
figs.dsc = () => {
  const W = 780, H = 600;
  const x0 = 120, x1 = 760, yTop = 40;
  const X = (t) => x0 + ((t + 90) / 270) * (x1 - x0); // -90..180 °C
  const traces = [
    { lab: "PEO", sub: "no salt", tg: -60, peaks: [[65, -70, 5]], col: "#1F7A7A" },
    { lab: "EO:Li 20", sub: "", tg: -45, peaks: [[58, -42, 6], [42, -8, 4]], col: "#2F8F86" },
    { lab: "EO:Li 12", sub: "2nd heat", tg: -32, peaks: [], col: "#5B4A9E" },
    { lab: "EO:Li 8", sub: "2nd heat", tg: -22, peaks: [], col: "#7B3FA0" },
    { lab: "EO:Li 8", sub: "aged, 1st heat", tg: -22, peaks: [[45, -14, 7]], col: "#9A5BB8" },
    { lab: "EO:Li 3", sub: "", tg: -5, peaks: [[140, -40, 7]], col: "#D98E2B" },
  ];
  const gap = 88;
  let b = "";
  traces.forEach((tr, i) => {
    const yb = yTop + 40 + i * gap;
    const pts = [];
    for (let t = -90; t <= 180; t += 1.5) {
      let y = yb + (t > tr.tg ? 10 : 0) * (1 / (1 + Math.exp(-(t - tr.tg) / 2))) + (t <= tr.tg ? 10 / (1 + Math.exp(-(t - tr.tg) / 2)) : 0);
      y = yb + 10 / (1 + Math.exp(-(t - tr.tg) / 2.2));
      tr.peaks.forEach(([c, a, s]) => (y -= a * Math.exp(-((t - c) ** 2) / (2 * s * s))));
      pts.push([+X(t).toFixed(1), +y.toFixed(1)]);
    }
    b += path(smooth(pts), { color: tr.col, w: 4 });
    b += T(x0 - 10, yb + 6, tr.lab, { size: 19, anchor: "end", weight: "bold", fill: tr.col });
    if (tr.sub) b += T(x0 - 10, yb + 28, tr.sub, { size: 16, anchor: "end", fill: K.muted });
    b += line(X(tr.tg), yb - 12, X(tr.tg), yb - 2, { color: K.text, w: 2 });
  });
  // annotations
  b += T(X(-60) - 4, yTop + 22, "Tg", { size: 18, anchor: "middle", fill: K.text, weight: "bold" });
  b += path(`M${X(-58)},${yTop + 30} C${X(-48)},${yTop + 200} ${X(-30)},${yTop + 330} ${X(-6)},${yTop + 470}`, { color: K.text, w: 2, dash: "5 5", marker: "ah" });
  b += T(X(72), yTop + 118, "Tm(PEO) ↓, peak area ↓", { size: 18, fill: K.teal, weight: "bold" });
  b += T(X(40), yTop + 218, "no melting: amorphous", { size: 18, fill: K.li, weight: "bold" });
  b += T(X(62), yTop + 382, "aged: small melting peak returns [17]", { size: 17, fill: "#9A5BB8" });
  b += T(X(110), yTop + 468, "complex melts high", { size: 17, fill: K.amber, weight: "bold" });
  // axis
  const ya = yTop + 40 + 6 * gap - 20;
  b += line(x0, ya, x1, ya, { w: 3 });
  [-50, 0, 50, 100, 150].forEach((t) => (b += line(X(t), ya, X(t), ya + 8, { w: 2 }) + T(X(t), ya + 30, String(t), { size: 18, anchor: "middle", fill: K.muted })));
  b += T((x0 + x1) / 2, ya + 58, "Temperature / °C", { size: 20, anchor: "middle" });
  b += T(x1, 22, "SCHEMATIC · endo ↓", { size: 17, anchor: "end", fill: K.o, weight: "bold" });
  return { w: W, h: H + 30, svg: wrap(W, H + 30, b) };
};

// 19. Solubility-limit map along r = Li/EO
figs.solub = () => {
  const W = 1200, H = 380;
  const x0 = 210, x1 = 1170;
  const X = (r) => x0 + (r / 0.6) * (x1 - x0);
  let b = "";
  const band = (r0, r1, y, h, fill, lab, lab2, fc, hatch) =>
    `<rect x="${X(r0)}" y="${y}" width="${X(r1) - X(r0)}" height="${h}" fill="${fill}"/>` + (hatch ? `<rect x="${X(r0)}" y="${y}" width="${X(r1) - X(r0)}" height="${h}" fill="url(#hatch)"/>` : "") +
    T((X(r0) + X(r1)) / 2, y + h / 2 - (lab2 ? 4 : -6), lab, { size: 18, anchor: "middle", weight: "bold", fill: fc || K.ink }) +
    (lab2 ? T((X(r0) + X(r1)) / 2, y + h / 2 + 20, lab2, { size: 16, anchor: "middle", fill: K.muted }) : "");
  // row 1: room temperature
  b += T(x0 - 14, 78, "Room temp.", { size: 20, anchor: "end", weight: "bold" }) + T(x0 - 14, 100, "(slow kinetics)", { size: 16, anchor: "end", fill: K.muted });
  b += band(0, 1 / 12, 40, 80, K.tealL, "semi-", "crystalline", K.teal);
  b += band(1 / 12, 1 / 6, 40, 80, K.liL, "often", "amorphous", K.li, true);
  b += band(1 / 6, 0.5, 40, 80, K.bg2, "crystalline complexes P(EO)₆ / P(EO)₃ / P(EO)₂", "+ amorphous phase [7, 26]", K.ink);
  b += band(0.5, 0.6, 40, 80, K.oL, "excess", "salt", K.o);
  // row 2: melt
  b += T(x0 - 14, 178, "Melt / heated", { size: 20, anchor: "end", weight: "bold" }) + T(x0 - 14, 200, "(Grundy 2022)", { size: 16, anchor: "end", fill: K.muted });
  b += band(0, 0.28, 140, 80, K.tealL, "one homogeneous amorphous phase", "salt fully dissolved", K.teal);
  b += band(0.28, 0.5, 140, 80, K.amberL, "two phases", "amorphous r≈0.28 + crystal r=0.50", "#A86A12");
  b += band(0.5, 0.6, 140, 80, K.oL, "beyond", "limit", K.o);
  // markers
  b += line(X(0.28), 126, X(0.28), 232, { color: K.o, w: 3, dash: "6 5" }) + T(X(0.28) + 6, 136, "r = 0.28", { size: 15, fill: K.o, weight: "bold" });
  b += line(X(0.5), 30, X(0.5), 232, { color: K.o, w: 3 }) + T(X(0.5) + 6, 26, "r = 0.50  solubility limit", { size: 17, fill: K.o, weight: "bold" });
  // axis
  b += line(x0, 250, x1, 250, { w: 3 });
  const lab = [[0, "0", "∞", "0"], [0.05, "0.05", "20", "25"], [0.083, "", "12", "35"], [0.125, "0.125", "8", "45"], [1 / 6, "", "6", "52"], [0.28, "0.28", "3.6", "65"], [1 / 3, "", "3", "69"], [0.5, "0.50", "2", "77"], [0.6, "0.60", "1.7", "80"]];
  lab.forEach(([r, a, n, w]) => {
    b += line(X(r), 250, X(r), 258, { w: 2 });
    if (a) b += T(X(r), 282, a, { size: 17, anchor: "middle", fill: K.text });
    b += T(X(r), 312, n, { size: 17, anchor: "middle", fill: K.li });
    b += T(X(r), 342, w, { size: 17, anchor: "middle", fill: K.amber });
  });
  b += T(x0 - 14, 282, "r = Li/EO", { size: 17, anchor: "end", weight: "bold" });
  b += T(x0 - 14, 312, "EO:Li", { size: 17, anchor: "end", weight: "bold", fill: K.li });
  b += T(x0 - 14, 342, "wt% LiTFSI", { size: 17, anchor: "end", weight: "bold", fill: K.amber });
  b += `<rect x="${X(0.05)}" y="358" width="${X(0.125) - X(0.05)}" height="10" rx="5" fill="${K.teal}"/>`;
  b += T(X(0.125) + 10, 370, "← where practical electrolytes sit (EO:Li 8–20)", { size: 16, fill: K.teal, weight: "bold" });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// limitation / strategy icons
figs.ic_thermo = () => icon(`<rect x="52" y="20" width="16" height="58" rx="8" fill="#fff" stroke="${K.o}" stroke-width="4"/><circle cx="60" cy="86" r="14" fill="${K.o}"/><rect x="57" y="50" width="6" height="34" fill="${K.o}"/>` + T(88, 46, "RT", { size: 18, anchor: "middle", fill: K.o, weight: "bold" }), K.oL);
figs.ic_tplus = () => icon(li(36, 46, 11, "", false) + line(50, 46, 66, 46, { color: K.li, w: 4, marker: "ahL" }) + anion(80, 80, 12, "") + line(64, 80, 22, 80, { color: K.amber, w: 5, marker: "ahA" }), K.liL);
figs.ic_dendrite = () => icon(`<rect x="18" y="82" width="84" height="14" fill="#9AA5B1"/>` + path(`M60,82 L60,58 M60,64 L48,50 M60,58 L72,40 M72,40 L68,28 M72,40 L84,36`, { color: K.slate, w: 4 }) + `<rect x="18" y="44" width="84" height="38" fill="${K.teal}" opacity="0.18"/>`, K.slateL);
figs.ic_volt = () => icon(path(`M66,16 L38,64 L58,64 L50,104 L84,52 L62,52 Z`, { color: K.amber, w: 3, fill: K.amber }), K.amberL);
figs.ic_al = () => icon(`<rect x="28" y="30" width="64" height="60" rx="6" fill="#C9D1D9"/>` + T(60, 70, "Al", { size: 30, anchor: "middle", fill: K.slate, weight: "bold" }) + [[34, 36], [80, 44], [44, 82], [84, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${K.o}" opacity="0.8"/>`).join(""), K.oL);
figs.ic_block = () => icon(path(`M18,60 C30,46 40,74 56,60`, { color: K.slate, w: 8 }) + path(`M56,60 C70,46 84,74 102,60`, { color: K.teal, w: 8 }) + `<circle cx="56" cy="60" r="5" fill="${K.ink}"/>`, K.slateL);
figs.ic_single = () => icon(path(`M18,74 C38,60 58,86 102,70`, { color: K.teal, w: 7 }) + line(46, 72, 46, 50, { color: K.amber, w: 4 }) + line(78, 74, 78, 52, { color: K.amber, w: 4 }) + anion(46, 42, 10, "") + anion(78, 44, 10, "") + li(64, 30, 9, "", false), K.amberL);
figs.ic_filler = () => icon(`<rect x="20" y="28" width="80" height="64" rx="8" fill="${K.teal}" opacity="0.25"/>` + [[38, 46], [70, 40], [52, 70], [84, 74], [32, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${K.slate}"/>`).join(""), K.tealL);

// 20. Conductivity vs "solid character" map of improvement routes (log σ, RT)
figs.gapmap = () => {
  const W = 1100, H = 470;
  const x0 = 120, x1 = 1080, y0 = 330, y1 = 30;
  const Y = (sig) => y0 - ((Math.log10(sig) + 7) / 6) * (y0 - y1); // 1e-7 .. 1e-1
  let b = "";
  // grid + axis
  for (let e = -7; e <= -1; e++) {
    const y = Y(10 ** e);
    b += line(x0, y, x1, y, { color: "#E3E8EC", w: 1.5 });
    b += T(x0 - 12, y + 7, `10${["⁻⁷","⁻⁶","⁻⁵","⁻⁴","⁻³","⁻²","⁻¹"][e + 7]}`, { size: 20, anchor: "end", fill: K.muted });
  }
  b += line(x0, y1, x0, y0, { w: 3 }) + line(x0, y0, x1, y0, { w: 3 });
  b += T(30, (y0 + y1) / 2, "σ at ~25 °C / S cm⁻¹", { size: 20, anchor: "middle", rotate: -90 });
  // reference lines
  b += line(x0, Y(1e-4), x1, Y(1e-4), { color: K.teal, w: 2.5, dash: "8 6" }) + T(x0 + 8, Y(1e-4) - 8, "practical solid-state target ≈ 10⁻⁴", { size: 18, fill: K.teal, weight: "bold" });
  b += line(x0, Y(1e-2), x1, Y(1e-2), { color: K.o, w: 2.5, dash: "8 6" }) + T(x0 + 8, Y(1e-2) - 8, "liquid 1 M LiPF₆ / EC–DMC ≈ 10⁻²", { size: 18, fill: K.o, weight: "bold" });
  const routes = [
    ["Plain", "PEO–LiTFSI", 1e-6, 1e-5, "#8FA3B0"],
    ["Single-ion", "conductors", 1e-7, 1e-5, K.li],
    ["Amorphous", "PEO", 1e-5, 1e-4, K.teal],
    ["Ceramic", "composite", 1e-5, 3e-4, K.slate],
    ["IL / glyme", "plasticised", 3e-5, 3e-4, K.amber],
    ["In situ", "poly-DOL", 2e-5, 2e-3, "#B8651B"],
    ["Gel", "(carbonate)", 1e-3, 6e-3, "#C2413F"],
    ["Liquid", "electrolyte", 8e-3, 1.2e-2, K.o],
  ];
  const step = (x1 - x0 - 40) / routes.length;
  routes.forEach(([a, c, lo, hi, col], i) => {
    const x = x0 + 40 + step * (i + 0.5) - 10, yt = Y(hi), yb = Y(lo);
    b += `<rect x="${x - 17}" y="${yt}" width="34" height="${Math.max(yb - yt, 14)}" rx="17" fill="${col}" opacity="0.9"/>`;
    b += T(x, y0 + 34, a, { size: 18, anchor: "middle", weight: "bold", fill: K.ink });
    b += T(x, y0 + 56, c, { size: 18, anchor: "middle", fill: K.muted });
  });
  // markers for specific reported values
  const mark = (i, sig, lab) => {
    const x = x0 + 40 + step * (i + 0.5) - 10, y = Y(sig);
    return `<circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="${K.ink}" stroke-width="3"/>` + T(x + 14, y + 6, lab, { size: 17, fill: K.ink, weight: "bold" });
  };
  b += mark(3, 2.5e-4, "[36]");
  b += mark(5, 1.1e-3, "[38]*");
  // arrow along x
  b += line(x0 + 40, y0 + 86, x1 - 10, y0 + 86, { w: 3, marker: "ah" });
  b += T(x0 + 40, y0 + 116, "more solid, safer, stiffer", { size: 18, fill: K.teal, weight: "bold" });
  b += T(x1 - 10, y0 + 116, "more liquid-like, faster", { size: 18, anchor: "end", fill: K.o, weight: "bold" });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 21. Levers to cut electrolyte resistance + scaffold film
figs.levers = () => {
  const W = 1180, H = 400;
  let b = "";
  // scaffold film (left)
  b += T(170, 32, "thin film in a porous scaffold", { size: 20, anchor: "middle", weight: "bold", fill: K.ink });
  b += rect(40, 70, 260, 40, { fill: "#B9C2CC", rx: 4 }) + T(170, 97, "cathode", { size: 18, anchor: "middle", fill: K.text });
  b += rect(40, 250, 260, 40, { fill: "#9AA5B1", rx: 4 }) + T(170, 277, "Li metal", { size: 18, anchor: "middle", fill: "#fff", weight: "bold" });
  b += rect(40, 115, 260, 130, { fill: K.tealL, rx: 0 });
  for (let x = 52; x < 300; x += 30) b += `<rect x="${x}" y="115" width="10" height="130" fill="${K.slate}" opacity="0.75"/>`;
  b += line(320, 115, 320, 245, { color: K.o, w: 3, marker: "ahO" }) + line(320, 245, 320, 115, { color: K.o, w: 3, marker: "ahO" });
  b += T(332, 175, "10–20", { size: 18, fill: K.o, weight: "bold" }) + T(332, 197, "µm", { size: 18, fill: K.o, weight: "bold" });
  b += T(170, 325, "vertical channels: PEO–LiTFSI", { size: 18, anchor: "middle", fill: K.teal });
  b += T(170, 349, "scaffold: polyimide / ceramic", { size: 18, anchor: "middle", fill: K.slate });
  // lever bars (right), length ∝ log10(factor)
  const lv = [
    ["Suppress crystallinity", "RT σ ~10⁻⁵ → ~10⁻⁴", 10, K.teal],
    ["Thinner film", "50 → 10 µm", 5, K.slate],
    ["Run warm", "25 → 50–60 °C", 10, K.o],
    ["Ceramic network / IL plasticiser", "further ×2–3 in σ", 2.5, K.amber],
    ["Raise t₊", "0.2 → 0.5: Li⁺ share of current", 2.5, K.li],
  ];
  const bx = 470, bw = 260; // width per decade
  b += T(bx, 32, "lever", { size: 18, fill: K.muted, weight: "bold" }) + T(bx + 360, 32, "indicative gain (log scale)", { size: 18, fill: K.muted, weight: "bold" });
  lv.forEach(([t, d, f, col], i) => {
    const y = 60 + i * 64;
    b += T(bx, y + 22, t, { size: 20, fill: K.ink, weight: "bold" });
    b += T(bx, y + 46, d, { size: 17, fill: K.muted });
    const L = Math.log10(f) * bw;
    b += rect(bx + 360, y + 8, L, 32, { fill: col, rx: 6 });
    b += T(bx + 368 + L, y + 32, `×${f}`, { size: 20, fill: col, weight: "bold" });
  });
  b += T(bx, 392, "Factors are order-of-magnitude illustrations, not additive guarantees.", { size: 17, fill: K.o, italic: true });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

figs.ic_plast = () => icon(path(smooth([[18, 76], [40, 56], [62, 78], [84, 58], [104, 74]]), { color: K.teal, w: 6 }) + path(`M62,18 C72,32 78,40 78,48 A16,16 0 0 1 46,48 C46,40 52,32 62,18 Z`, { color: K.amber, w: 3, fill: K.amberL }), K.amberL);
figs.ic_gel = () => icon(path(`M34,26 L34,90 A8,8 0 0 0 42,98 L78,98 A8,8 0 0 0 86,90 L86,26`, { color: K.slate, w: 4, fill: "#fff" }) + `<rect x="38" y="52" width="44" height="42" fill="${K.o}" opacity="0.35"/>` + path(smooth([[40, 64], [52, 56], [64, 70], [80, 60]]), { color: K.teal, w: 4 }) + path(smooth([[40, 82], [54, 74], [66, 88], [80, 78]]), { color: K.teal, w: 4 }), K.oL);
figs.ic_dol = () => icon(`<polygon points="40,40 60,28 76,44 68,66 46,64" fill="none" stroke="${K.slate}" stroke-width="4"/>` + oat(60, 28, 7, false) + oat(46, 64, 7, false) + line(74, 76, 96, 92, { color: K.text, w: 3, marker: "ah" }) + path(smooth([[20, 96], [36, 86], [52, 98], [70, 88]]), { color: K.teal, w: 5 }), K.slateL);

// 22. PTFE mould cleaning: after use and before next use
figs.clean = () => {
  const W = 1220, H = 430;
  let b = "";
  const ic = {
    scrape: (x, y) => path(`M${x - 30},${y + 22} L${x + 10},${y - 18}`, { color: K.slate, w: 7 }) + `<rect x="${x + 4}" y="${y - 30}" width="26" height="16" rx="3" transform="rotate(-45 ${x + 17} ${y - 22})" fill="${K.slate}"/>` + `<rect x="${x - 34}" y="${y + 24}" width="60" height="8" rx="3" fill="${K.teal}" opacity="0.6"/>`,
    soak: (x, y) => path(`M${x - 26},${y - 28} L${x - 22},${y + 28} L${x + 22},${y + 28} L${x + 26},${y - 28}`, { color: K.slate, w: 4, fill: "#fff" }) + `<rect x="${x - 21}" y="${y - 6}" width="42" height="32" fill="#9CCFE0"/>` + path(`M${x - 12},${y - 12} c4,-8 -4,-12 0,-20 M${x + 2},${y - 12} c4,-8 -4,-12 0,-20 M${x + 16},${y - 12} c4,-8 -4,-12 0,-20`, { color: K.o, w: 2.5 }),
    wash: (x, y) => `<rect x="${x - 30}" y="${y - 4}" width="60" height="30" rx="8" fill="${K.amber}"/><rect x="${x - 30}" y="${y - 4}" width="60" height="10" rx="5" fill="#6B8F3A"/>` + [[-18, -20, 7], [2, -26, 9], [20, -16, 6]].map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="#fff" stroke="#9CCFE0" stroke-width="3"/>`).join(""),
    bottle: (x, y, lab) => `<rect x="${x - 18}" y="${y - 14}" width="36" height="44" rx="8" fill="#fff" stroke="${K.slate}" stroke-width="4"/>` + path(`M${x},${y - 14} L${x},${y - 26} L${x + 22},${y - 34}`, { color: K.slate, w: 4 }) + T(x, y + 14, lab, { size: 13, anchor: "middle", fill: K.slate, weight: "bold" }),
    inspect: (x, y) => `<circle cx="${x - 6}" cy="${y - 6}" r="20" fill="#fff" stroke="${K.slate}" stroke-width="5"/>` + line(x + 9, y + 9, x + 28, y + 28, { color: K.slate, w: 7, cap: true }) + line(x - 16, y - 2, x + 2, y - 12, { color: K.o, w: 2.5 }),
    wipe: (x, y) => path(`M${x - 28},${y - 18} L${x + 22},${y - 26} L${x + 28},${y + 18} L${x - 22},${y + 26} Z`, { color: K.line, w: 3, fill: "#fff" }) + path(`M${x - 16},${y - 4} C${x - 6},${y - 12} ${x + 6},${y + 4} ${x + 16},${y - 4}`, { color: K.slate, w: 3 }),
    bake: (x, y) => rect(x - 32, y - 28, 64, 56, { fill: "#fff", stroke: K.slate, sw: 4, rx: 6 }) + T(x, y + 7, "120°", { size: 18, anchor: "middle", fill: K.o, weight: "bold" }),
    box: (x, y) => rect(x - 34, y - 24, 68, 48, { fill: "#fff", stroke: K.slate, sw: 4, rx: 6 }) + `<circle cx="${x - 14}" cy="${y + 2}" r="10" fill="${K.slateL}" stroke="${K.slate}" stroke-width="3"/><circle cx="${x + 14}" cy="${y + 2}" r="10" fill="${K.slateL}" stroke="${K.slate}" stroke-width="3"/>` + T(x, y - 30, "Ar", { size: 15, anchor: "middle", fill: K.teal, weight: "bold" }),
  };
  const rows = [
    ["AFTER USE", "right after peeling", K.o, K.oL, [
      ["scrape", "Scrape gently", "PTFE or plastic spatula;", "no metal, no scouring"],
      ["soak", "Soak in warm water", "DI water, 40–60 °C, ~1 h:", "PEO and LiTFSI dissolve"],
      ["wash", "Wash & rinse", "mild lab detergent, soft", "sponge; DI rinse ×3"],
      ["bottle:IPA", "Solvent rinse", "IPA or ethanol; air-dry,", "store covered"],
    ]],
    ["BEFORE NEXT USE", "on casting day", K.teal, K.tealL, [
      ["inspect", "Inspect", "scratches, stains, haze →", "replace if damaged"],
      ["wipe", "Rinse & wipe", "acetone or IPA, lint-free", "wipe; touch edges only"],
      ["bake", "Dry / bake", "100–120 °C, ≥ 2 h (vacuum", "ideal); never > 250 °C"],
      ["box", "Transfer warm", "into antechamber, evacuate;", "cast inside the glovebox"],
    ]],
  ];
  rows.forEach(([lab, sub, col, tint, steps], r) => {
    const y = 70 + r * 210;
    b += rect(10, y - 50, 170, 100, { fill: tint, rx: 14 });
    b += T(95, y - 8, lab, { size: 20, anchor: "middle", weight: "bold", fill: col });
    b += T(95, y + 20, sub, { size: 17, anchor: "middle", fill: K.muted });
    steps.forEach(([ik, t, l1, l2], i) => {
      const x = 300 + i * 260;
      b += `<circle cx="${x}" cy="${y}" r="50" fill="${tint}"/>`;
      const [name, arg] = ik.split(":");
      b += ic[name](x, y, arg);
      b += `<circle cx="${x - 40}" cy="${y - 40}" r="16" fill="${col}"/>` + T(x - 40, y - 34, String(r * 4 + i + 1), { size: 18, anchor: "middle", fill: "#fff", weight: "bold" });
      if (i < 3) b += line(x + 62, y, x + 196, y, { color: K.line, w: 4, marker: "ah" });
      b += T(x, y + 82, t, { size: 22, anchor: "middle", weight: "bold", fill: K.ink });
      b += T(x, y + 108, l1, { size: 18, anchor: "middle", fill: K.muted });
      b += T(x, y + 130, l2, { size: 18, anchor: "middle", fill: K.muted });
    });
  });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 23. EIS blocking-electrode cell (coin cell cross-section)
figs.eiscell = () => {
  const W = 720, H = 430;
  let b = "";
  const cx = 230;
  // case
  b += path(`M60,300 L60,330 L400,330 L400,300`, { color: K.muted, w: 6 });
  b += path(`M75,140 L75,120 L385,120 L385,140`, { color: K.muted, w: 6 });
  // bottom SS
  b += rect(90, 280, 280, 22, { fill: "#AEB8C2", rx: 3 });
  // ring + film
  b += rect(90, 262, 60, 18, { fill: "#F3F4F6", stroke: K.muted, sw: 2, rx: 2 }) + rect(310, 262, 60, 18, { fill: "#F3F4F6", stroke: K.muted, sw: 2, rx: 2 });
  b += rect(150, 262, 160, 18, { fill: K.teal, rx: 0 });
  // top SS
  b += rect(90, 240, 280, 22, { fill: "#AEB8C2", rx: 3 });
  // spring
  let d = "M100,232"; for (let x = 100; x <= 360; x += 26) d += ` Q${x + 13},${(x / 26) % 2 ? 200 : 222} ${x + 26},232`;
  b += path(d, { color: K.slate, w: 4 });
  b += rect(90, 150, 280, 14, { fill: "#AEB8C2", rx: 3 });
  // leader labels
  const lab = (x1, y1, x2, y2, t, col) => line(x1, y1, x2, y2, { color: col || K.text, w: 1.8 }) + T(x2 + 6, y2 + 6, t, { size: 19, fill: col || K.text, weight: col ? "bold" : undefined });
  b += lab(370, 250, 430, 250, "stainless-steel (blocking)");
  b += lab(300, 271, 430, 290, "SPE film, thickness L", K.teal);
  b += lab(340, 268, 430, 330, "insulating ring fixes A and L");
  b += lab(360, 210, 430, 205, "spring / spacer");
  b += lab(385, 128, 430, 150, "coin-cell case (CR2032)");
  // dimensions
  b += line(150, 360, 310, 360, { color: K.o, w: 2.5, marker: "ahO" }) + line(310, 360, 150, 360, { color: K.o, w: 2.5, marker: "ahO" });
  b += T(230, 388, "contact area A", { size: 19, anchor: "middle", fill: K.o, weight: "bold" });
  // analyser
  b += rect(20, 20, 210, 70, { fill: K.slateL, stroke: K.slate, sw: 2, rx: 10 });
  b += T(125, 50, "potentiostat + FRA", { size: 19, anchor: "middle", fill: K.slate, weight: "bold" });
  b += T(125, 74, "10 mV AC, 1 MHz → 1 Hz", { size: 16, anchor: "middle", fill: K.slate });
  b += path(`M60,90 L60,118`, { color: K.slate, w: 3 }) + path(`M200,90 L200,104 L40,104 L40,320 L60,320`, { color: K.slate, w: 3, dash: "6 4" });
  b += T(20, 420, "assemble in Ar · temperature chamber 20–90 °C", { size: 18, fill: K.muted });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

// 24. Nyquist plot of a blocking-electrode SPE cell + equivalent circuit
figs.nyquist = () => {
  const W = 760, H = 470;
  const x0 = 80, y0 = 380, sc = 1.0;
  let b = "";
  b += line(x0, y0, 730, y0, { w: 3, marker: "ah" }) + line(x0, y0, x0, 40, { w: 3, marker: "ah" });
  b += T(720, y0 + 34, "Z′ / Ω", { size: 20, anchor: "end" });
  b += T(40, 60, "−Z″ / Ω", { size: 20, anchor: "middle", rotate: -90 });
  // depressed semicircle from x0+10 to Rb
  const Rb = 420, r0 = x0 + 10, R = (Rb - r0) / 2, c = r0 + R;
  const pts = [];
  for (let k = 0; k <= 40; k++) { const a = Math.PI - (Math.PI * k) / 40; pts.push([+(c + R * Math.cos(a)).toFixed(1), +(y0 - 0.85 * R * Math.sin(a)).toFixed(1)]); }
  b += path(smooth(pts), { color: K.li, w: 5 });
  b += path(`M${Rb},${y0} L${Rb + 95},${y0 - 280}`, { color: K.amber, w: 5 });
  // high-T dataset
  b += path(`M${x0 + 40},${y0} L${x0 + 125},${y0 - 250}`, { color: K.teal, w: 4, dash: "9 7" });
  b += T(x0 + 132, y0 - 252, "high T: arc above the", { size: 17, fill: K.teal }) + T(x0 + 132, y0 - 230, "window → use spike intercept", { size: 17, fill: K.teal });
  // Rb marker
  b += `<circle cx="${Rb}" cy="${y0}" r="9" fill="#fff" stroke="${K.ink}" stroke-width="3"/>`;
  b += T(Rb + 2, y0 + 34, "Rb", { size: 22, anchor: "middle", weight: "bold", fill: K.ink });
  b += T(c, y0 - 0.85 * R - 14, "bulk: Rb ‖ Cg", { size: 19, anchor: "middle", fill: K.li, weight: "bold" });
  b += T(Rb + 105, y0 - 260, "blocking spike", { size: 19, fill: K.amber, weight: "bold" }) + T(Rb + 105, y0 - 238, "(double layer)", { size: 17, fill: K.amber });
  // frequency arrow
  b += path(`M${c + R * 0.35},${y0 - 0.85 * R - 24} C${c + R * 0.8},${y0 - 0.85 * R - 20} ${c + R + 2},${y0 - 0.85 * R * 0.6} ${c + R - 8},${y0 - 50}`, { color: K.muted, w: 2.5, marker: "ah" });
  b += T(c + R * 0.55, y0 - 0.85 * R - 38, "f decreasing", { size: 17, fill: K.muted });
  // equivalent circuit
  const ey = 440;
  b += line(110, ey, 160, ey, { w: 2.5 });
  b += path(`M160,${ey} l8,-12 l12,24 l12,-24 l12,24 l12,-24 l8,12`, { color: K.text, w: 2.5 }) + line(224, ey, 300, ey, { w: 2.5 });
  b += line(150, ey, 150, ey - 30, { w: 2.5 }) + line(150, ey - 30, 175, ey - 30, { w: 2.5 }) + line(175, ey - 42, 175, ey - 18, { w: 3 }) + line(186, ey - 42, 186, ey - 18, { w: 3 }) + line(186, ey - 30, 234, ey - 30, { w: 2.5 }) + line(234, ey - 30, 234, ey, { w: 2.5 });
  b += line(300, ey - 12, 300, ey + 12, { w: 3 }) + line(311, ey - 12, 311, ey + 12, { w: 3 }) + line(311, ey, 360, ey, { w: 2.5 });
  b += T(192, ey + 26, "Rb ‖ CPE(g)", { size: 16, anchor: "middle", fill: K.li }) + T(306, ey + 26, "CPE(dl)", { size: 16, anchor: "middle", fill: K.amber });
  return { w: W, h: H + 20, svg: wrap(W, H + 20, b) };
};

// 25. Thickness scale: what each range is for
figs.thickscale = () => {
  const W = 1180, H = 300;
  const x0 = 260, x1 = 1150;
  const X = (um) => x0 + ((Math.log10(um) - Math.log10(3)) / (Math.log10(500) - Math.log10(3))) * (x1 - x0);
  let b = "";
  const rows = [
    ["Commercial separator", "(for reference)", 10, 25, "#AEB8C2"],
    ["Competitive SPE cell", "needs a scaffold / support", 10, 20, K.teal],
    ["Lab free-standing film", "Li | SPE | cathode coin cells", 30, 100, K.slate],
    ["Conductivity (EIS) sample", "SS | SPE | SS", 100, 300, K.amber],
  ];
  rows.forEach(([t, sub, a, z, col], i) => {
    const y = 20 + i * 58;
    b += T(x0 - 20, y + 24, t, { size: 20, anchor: "end", weight: "bold", fill: K.ink });
    b += T(x0 - 20, y + 46, sub, { size: 16, anchor: "end", fill: K.muted });
    b += rect(X(a), y + 6, X(z) - X(a), 36, { fill: col, rx: 18 });
    b += T(X(z) + 12, y + 31, `${a}–${z} µm`, { size: 19, fill: col === "#AEB8C2" ? K.muted : col, weight: "bold" });
  });
  const ya = 262;
  b += line(x0, ya, x1, ya, { w: 3 });
  [5, 10, 20, 50, 100, 200, 500].forEach((u) => (b += line(X(u), ya, X(u), ya + 8, { w: 2 }) + T(X(u), ya + 32, String(u), { size: 18, anchor: "middle", fill: K.muted })));
  b += T(x0 - 20, ya + 32, "thickness / µm (log)", { size: 17, anchor: "end", fill: K.text });
  return { w: W, h: H, svg: wrap(W, H, b) };
};

figs.ic_ruler = () => icon(`<rect x="18" y="46" width="84" height="28" rx="4" fill="#fff" stroke="${K.amber}" stroke-width="4"/>` + [28, 40, 52, 64, 76, 88].map((x, i) => line(x, 46, x, i % 2 ? 58 : 64, { color: K.amber, w: 3 })).join(""), K.amberL);
figs.ic_cable = () => icon(path(`M18,80 C40,80 40,40 62,40 C84,40 84,80 102,80`, { color: K.slate, w: 5 }) + `<rect x="10" y="72" width="16" height="16" rx="3" fill="${K.slate}"/><rect x="94" y="72" width="16" height="16" rx="3" fill="${K.slate}"/>`, K.slateL);

module.exports = { figs, K };
