// Drawing helpers shared by the Ko et al. 2026 figure modules (not figures themselves).
// Canvas convention: 96 px per slide inch, so 15 px text ≈ 11 pt on the slide.
const L = require("../svglib");
const { COL, text, lines, arrow, head, ion, pill } = L;

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"${o.rx ? ` rx="${o.rx}"` : ""} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const line = (x1, y1, x2, y2, c, w = 2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`;
const circle = (x, y, r, fill, o = {}) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const ellipse = (x, y, rx, ry, fill, o = {}) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ""}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1.5}"` : ""}${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;
const path = (d, stroke, w = 2.5, o = {}) =>
  `<path d="${d}" fill="${o.fill || "none"}" stroke="${stroke}" stroke-width="${w}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round" stroke-linejoin="round"${o.opacity ? ` opacity="${o.opacity}"` : ""}/>`;

// Ligand kinds around a Li+ (colors from the shared palette)
const LIG = {
  S: { fill: COL.teal, stroke: COL.teal }, // strongly interacting solvent (EC, glyme)
  W: { fill: COL.tealLight, stroke: COL.teal }, // weakly interacting solvent / fluorinated ether
  A: { fill: COL.redLight, stroke: COL.red }, // anion (PF6-, FSI-)
  D: { fill: COL.light, stroke: COL.line }, // diluent
};

// Li+ with a solvation shell. ligs: string like "SSSS" or "AAWW"; dist: distance of ligand centre.
function solvated(x, y, ligs, o = {}) {
  const r = o.r || 13;
  const dist = o.dist || r + 18;
  const n = ligs.length;
  let b = "";
  [...ligs].forEach((k, i) => {
    const a = (o.rot || -90) + (360 * i) / n;
    const rad = (a * Math.PI) / 180;
    const cx = x + dist * Math.cos(rad), cy = y + dist * Math.sin(rad);
    const L2 = LIG[k];
    b += ellipse(cx.toFixed(1), cy.toFixed(1), o.rx || 15, o.ry || 9, L2.fill, { rot: a.toFixed(0), stroke: L2.stroke, sw: 1.5 });
  });
  b += ion(x, y, { r, fill: o.fill || COL.purple });
  return b;
}

// Horizontal potential axis. Returns {b, X}.
function potAxis(x0, x1, y, vmin, vmax, ticks, o = {}) {
  const X = (v) => x0 + ((v - vmin) / (vmax - vmin)) * (x1 - x0);
  let b = line(x0, y, x1, y, o.color || COL.ink, 2.5);
  b += head(x1 + 12, y, 0, o.color || COL.ink, 14);
  ticks.forEach((t) => {
    b += line(X(t), y, X(t), y + 8, o.color || COL.ink, 2);
    b += text(X(t), y + 28, o.fmt ? o.fmt(t) : String(t), { size: o.size || 16, anchor: "middle", fill: COL.text2 });
  });
  if (o.label) b += text((x0 + x1) / 2, y + 56, o.label, { size: o.labelSize || 17, anchor: "middle", weight: "bold", fill: COL.text2 });
  return { b, X };
}

// Rounded card with a coloured title bar and text lines.
function card(x, y, w, h, title, body, color, o = {}) {
  let b = rect(x, y, w, h, o.fill || "#FFFFFF", { rx: 14, stroke: color, sw: 2.5 });
  b += `<path d="M${x},${y + 14} a14,14 0 0 1 14,-14 h${w - 28} a14,14 0 0 1 14,14 v${(o.th || 40) - 14} h${-w} Z" fill="${color}"/>`;
  b += text(x + w / 2, y + (o.th || 40) / 2 + 7, title, { size: o.ts || 19, anchor: "middle", fill: "#FFFFFF", weight: "bold" });
  if (body && body.length) b += lines(o.ax === "start" ? x + 16 : x + w / 2, y + (o.th || 40) + (o.bs || 17) + 12, body, { size: o.bs || 17, anchor: o.ax || "middle", fill: o.bc || COL.ink, lh: (o.bs || 17) * 1.4 });
  return b;
}

// Small "molecule" icon: a coloured ellipse with a label under it
function mol(x, y, fill, stroke, label, o = {}) {
  return ellipse(x, y, o.rx || 22, o.ry || 13, fill, { stroke, sw: 2, rot: o.rot || 0 }) + (label ? text(x, y + (o.ly || 36), label, { size: o.size || 15, anchor: "middle", fill: o.lc || COL.ink, weight: o.w || "bold" }) : "");
}

// Flow of boxes connected by arrows (left to right). items: [{t:[lines], c:color}]
function flow(x, y, w, h, gap, items, o = {}) {
  let b = "";
  items.forEach((it, i) => {
    const xx = x + i * (w + gap);
    b += rect(xx, y, w, h, it.fill || "#FFFFFF", { rx: 14, stroke: it.c, sw: 2.5 });
    const n = it.t.length;
    const sz = it.size || o.size || 17;
    b += lines(xx + w / 2, y + h / 2 - ((n - 1) * sz * 1.3) / 2 + sz * 0.36, it.t, { size: sz, anchor: "middle", weight: "bold", fill: it.tc || COL.ink, lh: sz * 1.3 });
    if (i < items.length - 1) b += arrow(xx + w + 4, y + h / 2, xx + w + gap - 4, y + h / 2, { color: o.ac || COL.muted, width: 3, head: 12 });
  });
  return b;
}

module.exports = { rect, line, circle, ellipse, path, LIG, solvated, potAxis, card, mol, flow };
