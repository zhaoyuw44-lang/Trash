// Shared deck framework: theme, slide layouts and the recurring "史 / 变 / 要 / 引" blocks.
// Every chapter deck of every paper is built with this file so the style stays identical.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const THEME = {
  name: "Polymer Battery Reading",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  eaFontFace: "Microsoft YaHei",
  colors: {
    dk1: "1D2B3A", lt1: "FFFFFF", dk2: "4A5866", lt2: "EEF2F5",
    accent1: "E8892B", accent2: "1F8A84", accent3: "6C4BA6",
    accent4: "C8423B", accent5: "D9A400", accent6: "7C8B99",
    hlink: "1F8A84", folHlink: "6C4BA6",
  },
};

const HEX = THEME.colors;
const W = 13.333, H = 7.5;

// Block kinds: the visual motif repeated on every concept slide.
const KINDS = {
  hist: { ch: "史", label: "历史 History", color: "accent3", hex: HEX.accent3, tint: "F1ECF8" },
  why: { ch: "变", label: "以前怎么做 → 为什么这样做", color: "accent2", hex: HEX.accent2, tint: "E8F4F3" },
  matters: { ch: "要", label: "为什么重要 Why it matters", color: "accent1", hex: HEX.accent1, tint: "FDF2E7" },
  quote: { ch: "引", label: "原文金句 Quote", color: "text1", hex: HEX.dk1, tint: "EEF2F5" },
  def: { ch: "义", label: "定义 Definition", color: "accent6", hex: HEX.accent6, tint: "F1F3F5" },
  note: { ch: "注", label: "校注 Note", color: "accent4", hex: HEX.accent4, tint: "FBEDEC" },
};

// Rough text height estimate (inches) for a given width and point size.
function textLines(str, widthIn, pt) {
  const paras = String(str).split("\n");
  let total = 0;
  for (const p of paras) {
    let units = 0;
    for (const ch of p) units += /[⺀-￯]/.test(ch) ? 1 : 0.55;
    const perLine = (widthIn * 72) / pt;
    total += Math.max(1, Math.ceil(units / perLine));
  }
  return total;
}
const textH = (str, widthIn, pt, ls = 1.3) => (textLines(str, widthIn, pt) * pt * ls) / 72;

class Deck {
  constructor({ paper, chapter, chapterTitle, figDir }) {
    this.pres = new pptxgen();
    this.pres.layout = "LAYOUT_WIDE";
    this.pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
    this.pres.title = `${paper.short} · 第 ${chapter} 章 ${chapterTitle}`;
    this.pres.author = "Reading notes";
    this.C = this.pres.SchemeColor;
    this.paper = paper;
    this.chapter = chapter;
    this.chapterTitle = chapterTitle;
    this.figDir = figDir;
    this.figInfo = {};
    this._layouts();
  }

  _layouts() {
    const C = this.C;
    const footer = `${this.paper.short}  ·  第 ${this.chapter} 章  ${this.chapterTitle}`;
    this.pres.defineSlideMaster({
      title: "DARK_TITLE",
      background: { color: HEX.dk1 },
      objects: [
        { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.9, w: 7.4, h: 1.9, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
        { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 4.0, w: 7.4, h: 1.2, fontSize: 20, color: "CADCE8", valign: "top", align: "left", margin: 0 }, text: "" } },
      ],
    });
    this.pres.defineSlideMaster({
      title: "DARK_SECTION",
      background: { color: HEX.dk1 },
      objects: [
        { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 2.7, w: 11.9, h: 1.2, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
        { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 4.1, w: 11.9, h: 1.0, fontSize: 20, color: "CADCE8", valign: "top", align: "left", margin: 0 }, text: "" } },
      ],
    });
    this.pres.defineSlideMaster({
      title: "CONTENT",
      background: { color: HEX.lt1 },
      margin: [0.5, 0.6, 0.6, 0.6],
      slideNumber: { x: 12.25, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: HEX.dk2, align: "right" },
      objects: [
        { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.32, w: 12.1, h: 0.8, fontSize: 30, bold: true, color: C.text1, valign: "middle", align: "left", margin: 0 }, text: "" } },
        { text: { text: footer, options: { x: 0.6, y: 7.0, w: 9, h: 0.3, fontSize: 10, color: "7A8794", margin: 0 } } },
      ],
    });
  }

  section(title) {
    this.pres.addSection({ title });
    this._section = title;
  }

  slide(masterName) {
    const s = this.pres.addSlide({ masterName, sectionTitle: this._section });
    return s;
  }

  // ---------- figures ----------
  registerFigs(info) {
    Object.assign(this.figInfo, info);
  }

  // Place an SVG figure inside a box, preserving aspect ratio. align: "center" | "left" | "top"
  fig(slide, name, box, o = {}) {
    const info = this.figInfo[name];
    if (!info) throw new Error(`figure ${name} not rendered`);
    const ar = info.w / info.h;
    let w = box.w, h = box.w / ar;
    if (h > box.h) { h = box.h; w = h * ar; }
    let x = box.x + (box.w - w) / 2;
    let y = box.y + (box.h - h) / 2;
    if (o.align === "left") x = box.x;
    if (o.valign === "top") y = box.y;
    const svg = fs.readFileSync(info.svg);
    slide.addImage({ data: "image/svg+xml;base64," + svg.toString("base64"), x, y, w, h, altText: o.alt || name, objectName: `fig-${name}` });
    return { x, y, w, h };
  }

  // ---------- recurring blocks ----------
  chip(slide, x, y, kind, d = 0.42) {
    const k = KINDS[kind];
    slide.addText(k.ch, {
      shape: this.pres.shapes.OVAL, x, y, w: d, h: d, fill: { color: this.C[k.color] },
      color: this.C.background1, fontSize: Math.round(d * 38), bold: true, align: "center", valign: "middle", margin: 0, isTextBox: true,
      fontFace: THEME.eaFontFace, objectName: `chip-${kind}`,
    });
  }

  // Labelled block: chip + heading + body. Returns the bottom y.
  block(slide, { x, y, w, kind, head, body, size = 14, tint = false }) {
    const k = KINDS[kind];
    const pad = tint ? 0.14 : 0;
    const bodyW = w - 0.58 - pad * 2;
    const hb = textH(body, bodyW, size, 1.25) + 0.08;
    const total = 0.36 + hb + pad * 2;
    if (tint) slide.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: total, rectRadius: 0.08, fill: { color: k.tint }, line: { color: k.tint }, objectName: `card-${kind}` });
    this.chip(slide, x + pad, y + pad, kind, 0.4);
    slide.addText(head || k.label, { x: x + pad + 0.55, y: y + pad, w: bodyW, h: 0.4, fontSize: 15, bold: true, color: this.C[k.color], valign: "middle", margin: 0, isTextBox: true });
    slide.addText(body, { x: x + pad + 0.55, y: y + pad + 0.4, w: bodyW, h: hb, fontSize: size, color: this.C.text1, valign: "top", margin: 0, paraSpaceAfter: 2, lineSpacingMultiple: 1.05, isTextBox: true });
    return y + total;
  }

  // Stack several blocks in a column with a fixed gap. Returns bottom y.
  column(slide, x, y, w, blocks, gap = 0.22) {
    let yy = y;
    for (const b of blocks) yy = this.block(slide, { x, y: yy, w, ...b }) + gap;
    return yy - gap;
  }

  // Quote ribbon: English original (italic) + Chinese translation.
  quote(slide, { x = 0.6, y, w = 12.1, en, zh, ref, bottom = 6.85 }) {
    const textW = w - 0.85;
    const hEn = textH(`“${en}”`, textW, 14, 1.2);
    const hZh = textH(zh, textW, 13, 1.2);
    const h = Math.max(0.75, hEn + hZh + 0.28);
    if (y === undefined || y + h > bottom) y = bottom - h;
    slide.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: KINDS.quote.tint }, line: { color: KINDS.quote.tint }, objectName: "quote-card" });
    this.chip(slide, x + 0.16, y + 0.14, "quote", 0.4);
    slide.addText(
      [
        { text: `“${en}”`, options: { italic: true, fontSize: 14, color: this.C.text1, breakLine: true } },
        { text: zh + (ref ? `  —— ${ref}` : ""), options: { fontSize: 13, color: this.C.text2 } },
      ],
      { x: x + 0.7, y: y + 0.1, w: textW, h: h - 0.2, valign: "middle", margin: 0, isTextBox: true, objectName: "quote-text" }
    );
    return y + h;
  }

  caption(slide, str, box, o = {}) {
    slide.addText(str, { x: box.x, y: box.y, w: box.w, h: box.h || 0.3, fontSize: o.size || 11, color: "7A8794", align: o.align || "left", valign: "top", margin: 0, isTextBox: true });
  }

  // Big number callout
  stat(slide, { x, y, w, value, unit, label, color = "accent1" }) {
    slide.addText(
      [
        { text: value, options: { fontSize: 40, bold: true, color: this.C[color] } },
        { text: unit ? ` ${unit}` : "", options: { fontSize: 16, bold: true, color: this.C[color] } },
      ],
      { x, y, w, h: 0.75, margin: 0, valign: "bottom", isTextBox: true }
    );
    slide.addText(label, { x, y: y + 0.78, w, h: 0.55, fontSize: 14, color: this.C.text2, margin: 0, valign: "top", isTextBox: true });
  }

  async write(outFile) {
    await this.pres.writeFile({ fileName: outFile });
    return outFile;
  }
}

module.exports = { Deck, THEME, KINDS, HEX, W, H, textH };
