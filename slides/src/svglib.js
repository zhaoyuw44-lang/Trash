// Shared SVG helpers for the chapter decks.
// Only basic SVG features are used (no CSS, no markers, no filters), so PowerPoint's
// SVG renderer and browsers draw them the same way.

const FONT = "Microsoft YaHei, PingFang SC, Noto Sans CJK SC, WenQuanYi Zen Hei, Arial, sans-serif";

const COL = {
  ink: "#1D2B3A",
  text2: "#4A5866",
  muted: "#7A8794",
  line: "#C9D2DA",
  light: "#EEF2F5",
  amber: "#E8892B",
  amberLight: "#F6C58E",
  teal: "#1F8A84",
  tealLight: "#9FD3CF",
  purple: "#6C4BA6",
  purpleLight: "#C9B8E8",
  red: "#C8423B",
  redLight: "#F2B8B4",
  sulfur: "#D9A400",
  sulfurLight: "#F7E3A1",
  si: "#7C8B99",
  siDark: "#56636F",
  copper: "#B87333",
  alu: "#AEB8C2",
  electrolyte: "#DDEFF8",
  white: "#FFFFFF",
  sei: "#A0522D",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Mini markup: "Li_{2}S_{8}" -> subscript, "Li^{+}" -> superscript.
function rich(str, size) {
  const small = Math.round(size * 0.68);
  const dSub = Math.round(size * 0.28);
  const dSup = -Math.round(size * 0.38);
  let out = "";
  const re = /([_^])\{([^}]*)\}/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    out += esc(str.slice(last, m.index));
    const d = m[1] === "_" ? dSub : dSup;
    out += `<tspan dy="${d}" font-size="${small}">${esc(m[2])}</tspan><tspan dy="${-d}">​</tspan>`;
    last = re.lastIndex;
  }
  out += esc(str.slice(last));
  return out;
}

function text(x, y, str, o = {}) {
  const size = o.size || 16;
  const attrs = [
    `x="${x}"`, `y="${y}"`,
    `font-family="${FONT}"`,
    `font-size="${size}"`,
    `fill="${o.fill || COL.ink}"`,
    `text-anchor="${o.anchor || "start"}"`,
  ];
  if (o.weight) attrs.push(`font-weight="${o.weight}"`);
  if (o.italic) attrs.push(`font-style="italic"`);
  if (o.opacity) attrs.push(`opacity="${o.opacity}"`);
  return `<text ${attrs.join(" ")}>${rich(str, size)}</text>`;
}

// Multi-line text: lines is an array of strings.
function lines(x, y, arr, o = {}) {
  const lh = o.lh || (o.size || 16) * 1.35;
  return arr.map((s, i) => text(x, y + i * lh, s, o)).join("");
}

// Straight arrow drawn as a line plus a filled triangle head.
function arrow(x1, y1, x2, y2, o = {}) {
  const c = o.color || COL.ink;
  const w = o.width || 2.5;
  const hl = o.head || 11;
  const hw = o.headW || hl * 0.62;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const bx = x2 - hl * Math.cos(a);
  const by = y2 - hl * Math.sin(a);
  const px = -Math.sin(a) * hw;
  const py = Math.cos(a) * hw;
  const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : "";
  return (
    `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash}/>` +
    `<polygon points="${x2},${y2} ${(bx + px).toFixed(1)},${(by + py).toFixed(1)} ${(bx - px).toFixed(1)},${(by - py).toFixed(1)}" fill="${c}"/>`
  );
}

// Arrowhead only, pointing along angle a (radians) with tip at (x,y).
function head(x, y, a, c, hl = 11) {
  const hw = hl * 0.62;
  const bx = x - hl * Math.cos(a);
  const by = y - hl * Math.sin(a);
  const px = -Math.sin(a) * hw;
  const py = Math.cos(a) * hw;
  return `<polygon points="${x},${y} ${(bx + px).toFixed(1)},${(by + py).toFixed(1)} ${(bx - px).toFixed(1)},${(by - py).toFixed(1)}" fill="${c}"/>`;
}

function ion(x, y, o = {}) {
  const r = o.r || 10;
  const fill = o.fill || COL.purple;
  const label = o.label || "+";
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>` +
    text(x, y + r * 0.42, label, { size: Math.round(r * 1.25), fill: "#FFFFFF", anchor: "middle", weight: "bold" })
  );
}

function electron(x, y, r = 10) {
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${COL.amber}"/>` +
    text(x, y + r * 0.4, "e^{−}", { size: Math.round(r * 1.05), fill: "#FFFFFF", anchor: "middle", weight: "bold" })
  );
}

function cross(x, y, s = 10, c = COL.red, w = 4) {
  return (
    `<line x1="${x - s}" y1="${y - s}" x2="${x + s}" y2="${y + s}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<line x1="${x - s}" y1="${y + s}" x2="${x + s}" y2="${y - s}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`
  );
}

function check(x, y, s = 10, c = COL.teal, w = 4) {
  return `<polyline points="${x - s},${y} ${x - s * 0.3},${y + s * 0.7} ${x + s},${y - s * 0.8}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function pill(x, y, w, h, fill, label, o = {}) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="1.5"` : ""}/>` +
    text(x + w / 2, y + h / 2 + (o.size || 14) * 0.36, label, { size: o.size || 14, fill: o.color || "#FFFFFF", anchor: "middle", weight: o.weight || "bold" })
  );
}

// Deterministic pseudo-random generator so the figures are stable between builds.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Irregular "particle" outline around (cx,cy).
function blob(cx, cy, r, seed, o = {}) {
  const R = rng(seed);
  const n = o.n || 11;
  const jag = o.jag ?? 0.16;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 - jag + R() * jag * 2);
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  // Smooth closed path through the points (Catmull-Rom -> Bezier)
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `<path d="${d} Z" fill="${o.fill || COL.si}" stroke="${o.stroke || "none"}" stroke-width="${o.sw || 0}"/>`;
}

function svg(w, h, body, bg) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : "") +
    body +
    `</svg>`
  );
}

// Horizontal history timeline. events: [{year, who:[...], what:[...], color}]
function timeline(W, H, events, o = {}) {
  const left = o.left ?? 60;
  const right = o.right ?? W - 60;
  const axisY = o.axisY ?? H / 2;
  const n = events.length;
  const step = (right - left) / (n - 1);
  let b = `<line x1="${left - 30}" y1="${axisY}" x2="${right + 30}" y2="${axisY}" stroke="${COL.line}" stroke-width="5" stroke-linecap="round"/>`;
  b += head(right + 46, axisY, 0, COL.line, 18);
  events.forEach((e, i) => {
    const x = left + i * step;
    const up = i % 2 === 0;
    const c = e.color || COL.purple;
    b += `<line x1="${x}" y1="${axisY}" x2="${x}" y2="${up ? axisY - 34 : axisY + 34}" stroke="${c}" stroke-width="2.5"/>`;
    b += `<circle cx="${x}" cy="${axisY}" r="11" fill="#FFFFFF" stroke="${c}" stroke-width="5"/>`;
    const ys = up ? axisY - 46 : axisY + 62;
    const yr = text(x, ys, e.year, { size: o.yearSize || 26, fill: c, anchor: "middle", weight: "bold" });
    const whoSize = o.whoSize || 16;
    const whatSize = o.whatSize || 15;
    const who = e.who || [];
    const what = e.what || [];
    if (up) {
      // stack upward: year closest to axis, then who, then what above
      const total = who.length * whoSize * 1.3 + what.length * whatSize * 1.3;
      let y = ys - 30 - total + whoSize;
      b += lines(x, y, who, { size: whoSize, anchor: "middle", weight: "bold", lh: whoSize * 1.3 });
      y += who.length * whoSize * 1.3;
      b += lines(x, y, what, { size: whatSize, anchor: "middle", fill: COL.text2, lh: whatSize * 1.3 });
      b += yr;
    } else {
      b += yr;
      let y = ys + 30;
      b += lines(x, y, who, { size: whoSize, anchor: "middle", weight: "bold", lh: whoSize * 1.3 });
      y += who.length * whoSize * 1.3;
      b += lines(x, y, what, { size: whatSize, anchor: "middle", fill: COL.text2, lh: whatSize * 1.3 });
    }
  });
  return b;
}

module.exports = { FONT, COL, esc, rich, text, lines, arrow, head, ion, electron, cross, check, pill, rng, blob, svg, timeline };
