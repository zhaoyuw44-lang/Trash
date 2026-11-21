// Shared helpers for the Ko et al. 2026 chapter decks (paper object, recurring slide patterns, QA hooks).
// Only builds on decklib/svglib; does not modify them.
const fs = require("fs");
const path = require("path");
const { Deck, HEX, THEME } = require("../decklib");
const { renderAll } = require("../render_svgs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const PAPER = {
  short: "Ko et al., Nat. Rev. Mater. 2026",
  full: "Ko, Zhang, Wang & Yamada. Electrolyte design for future batteries. Nature Reviews Materials (2026). doi:10.1038/s41578-026-00958-8",
};

const NB = " "; // keep numbers and units together

async function makeDeck(chapter, chapterTitle, figsFile, figDir) {
  const info = await renderAll(figsFile, figDir);
  const d = new Deck({ paper: PAPER, chapter, chapterTitle, figDir });
  d.registerFigs(info);
  d._qa = { figs: [], quotes: [] };
  const fig0 = d.fig.bind(d);
  d.fig = (slide, name, box, o) => {
    const r = fig0(slide, name, box, o);
    d._qa.figs.push({ name, slide: d.pres.slides.length, ...r });
    return r;
  };
  const quote0 = d.quote.bind(d);
  d.quote = (slide, q) => {
    d._qa.quotes.push({ en: q.en, slide: d.pres.slides.length });
    return quote0(slide, q);
  };
  return d;
}

// Mini markup -> pptxgenjs runs: "E_{Li+/Li}" subscript, "a^{2}" superscript, "\n" line break.
function R(str, opts = {}) {
  const runs = [];
  const linesArr = String(str).split("\n");
  linesArr.forEach((ln, li) => {
    const re = /([_^])\{([^}]*)\}/g;
    let last = 0, m;
    const parts = [];
    while ((m = re.exec(ln))) {
      if (m.index > last) parts.push({ text: ln.slice(last, m.index), options: { ...opts } });
      parts.push({ text: m[2], options: { ...opts, [m[1] === "_" ? "subscript" : "superscript"]: true } });
      last = re.lastIndex;
    }
    if (last < ln.length || parts.length === 0) parts.push({ text: ln.slice(last) || " ", options: { ...opts } });
    if (li < linesArr.length - 1) parts[parts.length - 1].options.breakLine = true;
    runs.push(...parts);
  });
  return runs;
}

// Formula card: big equation + explanation lines.
function eqBox(d, s, { x, y, w, h, eq, eqSize = 26, sub, subSize = 14, color = "accent1", fill = "F5F7F9" }) {
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
  const runs = R(eq, { fontSize: eqSize, bold: true, color: d.C[color] });
  if (sub) {
    runs[runs.length - 1].options.breakLine = true;
    runs.push(...R(sub, { fontSize: subSize, color: d.C.text2 }));
  }
  s.addText(runs, { x: x + 0.25, y: y + 0.08, w: w - 0.5, h: h - 0.16, margin: 0, valign: "middle", isTextBox: true, paraSpaceAfter: 3 });
}

function titleSlide(d, { title, sub, notes, fig }) {
  d.section("开篇");
  const s = d.slide("DARK_TITLE");
  s.addText(title, { placeholder: "title" });
  s.addText(sub, { placeholder: "body" });
  s.addText(PAPER.full, { x: 0.7, y: 6.3, w: 7.6, h: 0.6, fontSize: 11, color: "9FB0C0", margin: 0, valign: "top", isTextBox: true });
  if (fig) d.fig(s, fig, { x: 8.6, y: 1.0, w: 4.3, h: 5.6 });
  if (notes) s.addNotes(notes);
  return s;
}

function stepCards(d, s, steps, { x = 0.6, y0 = 1.45, w = 6.3, pitch = 1.3, h = 1.08 } = {}) {
  const C = d.C;
  steps.forEach(([n, hd, b], i) => {
    const y = y0 + i * pitch;
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: "F5F7F9" }, line: { color: "F5F7F9" } });
    s.addText(n, { shape: d.pres.shapes.OVAL, x: x + 0.22, y: y + (h - 0.6) / 2, w: 0.6, h: 0.6, fill: { color: C.text1 }, color: C.background1, fontSize: 20, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(hd, { x: x + 1.05, y: y + 0.12, w: w - 1.3, h: 0.42, fontSize: 19, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
    s.addText(b, { x: x + 1.05, y: y + 0.54, w: w - 1.3, h: 0.42, fontSize: 15, color: C.text2, margin: 0, valign: "middle", isTextBox: true });
  });
}

// Roadmap slide for chapters 2-5: numbered cards + link from previous chapter (+ optional figure).
function roadmap(d, { steps, prev, next, fig, notes }) {
  const C = d.C;
  const s = d.slide("CONTENT");
  s.addText("本章路线图", { placeholder: "title" });
  const pitch = steps.length > 4 ? 1.06 : 1.3;
  const h = steps.length > 4 ? 0.92 : 1.08;
  stepCards(d, s, steps, { pitch, h });
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 7.35, y: 1.45, w: 5.4, h: 1.95, rectRadius: 0.1, fill: { color: "EEF2F5" }, line: { color: "EEF2F5" } });
  s.addText("与上一章的衔接", { x: 7.6, y: 1.55, w: 5.0, h: 0.4, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
  s.addText(prev, { x: 7.6, y: 1.98, w: 5.0, h: 1.35, fontSize: 14, color: C.text2, margin: 0, valign: "top", isTextBox: true });
  if (fig) d.fig(s, fig, { x: 7.35, y: 3.6, w: 5.4, h: next ? 2.2 : 3.2 });
  if (next) {
    s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x: 7.35, y: 5.95, w: 5.4, h: 0.85, rectRadius: 0.1, fill: { color: "FDF2E7" }, line: { color: "FDF2E7" } });
    s.addText(next, { x: 7.6, y: 5.95, w: 5.0, h: 0.85, fontSize: 14, color: C.text1, margin: 0, valign: "middle", isTextBox: true });
  }
  if (notes) s.addNotes(notes);
  return s;
}

function sectionSlide(d, secName, title, body, notes) {
  d.section(secName);
  const s = d.slide("DARK_SECTION");
  s.addText(title, { placeholder: "title" });
  s.addText(body, { placeholder: "body" });
  if (notes) s.addNotes(notes);
  return s;
}

function summarySlide(d, { title = "本章小结", items, quote, notes }) {
  const C = d.C;
  d.section("小结");
  const s = d.slide("DARK_SECTION");
  s.addText(title, { x: 0.7, y: 0.5, w: 11.9, h: 0.8, fontSize: 34, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const pitch = items.length > 4 ? 0.88 : 1.08;
  items.forEach(([h, b], i) => {
    const y = 1.5 + i * pitch;
    s.addText(String(i + 1), { shape: d.pres.shapes.OVAL, x: 0.7, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: C.accent1 }, color: C.background1, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(R(h, { fontSize: 19, bold: true, color: "FFFFFF" }), { x: 1.5, y, w: 11.1, h: 0.42, margin: 0, valign: "middle", isTextBox: true });
    s.addText(R(b, { fontSize: 15, color: "CADCE8" }), { x: 1.5, y: y + 0.42, w: 11.1, h: 0.38, margin: 0, valign: "middle", isTextBox: true });
  });
  if (quote) {
    d._qa.quotes.push({ en: quote.en, slide: d.pres.slides.length });
    s.addText([
      { text: `“${quote.en}”`, options: { italic: true, fontSize: 15, color: "FFFFFF", breakLine: true } },
      { text: quote.zh, options: { fontSize: 14, color: "CADCE8" } },
    ], { x: 0.7, y: 6.0, w: 11.9, h: 0.9, margin: 0, valign: "middle", isTextBox: true });
  }
  if (notes) s.addNotes(notes);
  return s;
}

// Shared chart styling (matches the reference chapter)
const CH = {
  font: { titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelColor: HEX.dk2, valAxisLabelColor: HEX.dk2, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt" },
  legend: { showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.dk1 },
  grid: { valGridLine: { color: "E3E8EC", size: 1 }, catGridLine: { style: "none" } },
};

// QA: SVG font size on the slide (pt) and figure bottoms
function figQA(d) {
  const warn = [];
  for (const f of d._qa.figs) {
    const info = d.figInfo[f.name];
    const svg = fs.readFileSync(info.svg, "utf8");
    const sizes = [...svg.matchAll(/<text [^>]*font-size="([\d.]+)"/g)].map((m) => +m[1]);
    const min = sizes.length ? Math.min(...sizes) : 99;
    const pt = (min * f.w * 72) / info.w;
    if (sizes.length && pt < 10.95) warn.push(`slide ${f.slide} ${f.name}: min SVG font ${min}px -> ${pt.toFixed(1)} pt`);
    if (f.y + f.h > 6.9 && d.pres.slides[f.slide - 1] && f.y + f.h < 7.5) warn.push(`slide ${f.slide} ${f.name}: bottom ${(f.y + f.h).toFixed(2)}"`);
  }
  return warn;
}

async function finish(d, outFile, figDir) {
  await d.write(outFile);
  await applyTheme(outFile, THEME);
  const warn = figQA(d);
  fs.writeFileSync(path.join(figDir, "qa.json"), JSON.stringify({ quotes: d._qa.quotes, figs: d._qa.figs, warn }, null, 1));
  if (warn.length) console.log("QA warnings:\n  " + warn.join("\n  "));
  console.log(`slides: ${d.pres.slides.length}, figures placed: ${d._qa.figs.length} (${new Set(d._qa.figs.map((f) => f.name)).size} unique), quotes: ${d._qa.quotes.length}`);
  return { outFile, figDir };
}

module.exports = { PAPER, NB, makeDeck, R, eqBox, titleSlide, stepCards, roadmap, sectionSlide, summarySlide, CH, finish, HEX };
