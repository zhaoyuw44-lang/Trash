// Builds LiTFSI_in_PEO.pptx. Figures are drawn as SVG (svgs.js), embedded as PNG
// placeholders here, and then swapped to true vector SVG by embed_svg.py.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const SKILL = "/root/.claude/skills/synced/aa9118d1-e698-4429-a4ef-0631f61817fb_828df25a-6c0b-4f77-a93c-2cd9d11b6de1/pptx";
const { applyTheme } = require(`${SKILL}/scripts/apply_theme.js`);
const { figs } = require("./svgs.js");

const THEME = {
  name: "PEO-LiTFSI",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1F2937", lt1: "FFFFFF", dk2: "14213D", lt2: "EEF2F4",
    accent1: "1F7A7A", accent2: "7B3FA0", accent3: "D98E2B", accent4: "D1495B",
    accent5: "3D5A80", accent6: "5B6472", hlink: "3D5A80", folHlink: "7B3FA0",
  },
};
const OUT = "LiTFSI_in_PEO.pptx";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.title = "Dissolving LiTFSI in PEO";
pres.subject = "LiTFSI dissolution in poly(ethylene oxide): thermodynamics, structure, transport and film casting";
pres.author = "PEO–LiTFSI study deck";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const HEX = { ink: "14213D", line: "C4CCD4", muted: "5B6472" };

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 2.0, w: 6.9, h: 1.9, fontFace: THEME.headFontFace, fontSize: 44, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 4.1, w: 6.6, h: 1.4, fontFace: THEME.bodyFontFace, fontSize: 18, color: "CADCE8", valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  margin: [0.5, 0.6, 0.5, 0.6],
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.52, w: 12.1, h: 0.78, fontFace: THEME.headFontFace, fontSize: 32, bold: true, color: C.text2, valign: "middle", margin: 0 }, text: "" } },
    { text: { text: "LiTFSI in PEO", options: { x: 0.6, y: 7.08, w: 4, h: 0.28, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: 12.2, y: 7.08, w: 0.5, h: 0.28, fontSize: 10, color: HEX.muted, align: "right" },
});
pres.defineSlideMaster({
  title: "DARK_CONTENT",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.52, w: 12.1, h: 0.78, fontFace: THEME.headFontFace, fontSize: 32, bold: true, color: C.background1, valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 12.2, y: 7.08, w: 0.5, h: 0.28, fontSize: 10, color: "CADCE8", align: "right" },
});

// ---------- helpers ----------
const svgMap = {}; // objectName -> svg file
let figCount = 0;
function fig(slide, name, x, y, w, h) {
  const f = figs[name]();
  const ratio = f.h / f.w;
  if (w && !h) h = w * ratio;
  if (h && !w) w = h / ratio;
  const objectName = `FIG_${++figCount}_${name}`;
  svgMap[objectName] = `svg/${name}.svg`;
  slide.addImage({ path: `png/${name}.png`, x, y, w, h, objectName, altText: ALT[name] || name });
  return { x, y, w, h };
}
const ALT = {
  hero: "Li+ ion coordinated by ether oxygens of two PEO strands, with TFSI- anions nearby",
  peo: "Repeat unit of poly(ethylene oxide) highlighting the ether oxygen donor",
  tfsi: "Structure of the TFSI anion with delocalised negative charge",
  timeline: "Timeline of key PEO electrolyte papers from 1973 to 2017",
  cycle: "Thermodynamic cycle for dissolving LiTFSI in PEO",
  anions: "Anions ordered by size and delocalisation; cisoid and transoid TFSI conformers",
  solvation: "Li+ coordinated by about five ether oxygens from two PEO strands",
  crystals: "Crystal structures of P(EO)6:LiX tunnels and P(EO)3:LiX helix",
  phase: "Schematic PEO-LiTFSI phase diagram",
  dsc: "Schematic DSC heating traces for PEO-LiTFSI at increasing salt content",
  solub: "Map of phase states versus Li/EO ratio including the solubility limit at r = 0.50",
  tg: "Glass transition rising with salt content; Li+ acting as transient crosslink",
  sigma: "Schematic of carrier number, mobility and conductivity versus salt content",
  modes: "Three Li+ transport modes in PEO",
  species: "Free ions, contact ion pairs and aggregates",
  band: "Schematic Raman band of TFSI with free and Li-bound components",
  transfer: "Li+ moves slowly and TFSI- quickly, causing concentration polarisation",
  workflow: "Seven-step solution-casting workflow",
  mould: "Cross-section of a levelled PTFE mould with lid ajar",
  gapmap: "Room-temperature conductivity ranges of improvement routes from solid to liquid-like",
  levers: "Thin scaffold-supported film and indicative gains from five levers",
  eiscell: "Coin cell with stainless-steel blocking electrodes and an insulating ring around the polymer film",
  nyquist: "Schematic Nyquist plot with bulk semicircle, blocking spike and equivalent circuit",
  thickscale: "Typical film thickness ranges for separators, competitive cells, lab cells and EIS samples",
  clean: "Eight-step PTFE mould cleaning routine: four steps after use and four before the next cast",
};
const tag = (slide, text) =>
  slide.addText(text, { x: 0.6, y: 0.2, w: 4.5, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 2, margin: 0, isTextBox: true, objectName: "section-tag" });
const src = (slide, text) =>
  slide.addText(text, { x: 0.6, y: 6.68, w: 12.1, h: 0.3, fontSize: 10, color: C.accent6, italic: true, margin: 0, isTextBox: true, objectName: "sources" });
function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill || C.background2 }, line: { type: "none" }, objectName: "card" });
}
function bullets(slide, items, x, y, w, h, o = {}) {
  const arr = items.map((it, i) => {
    const runs = Array.isArray(it) ? it : [{ text: it }];
    return runs.map((r, j) => ({
      text: r.text,
      options: { bullet: j === 0 ? { indent: 15 } : undefined, bold: r.bold, color: r.color, breakLine: j === runs.length - 1 && i < items.length - 1, paraSpaceAfter: 8 },
    }));
  }).flat();
  slide.addText(arr, { x, y, w, h, fontSize: o.size || 16, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: o.name || "bullets" });
}
function iconCard(slide, x, y, w, h, ic, title, body, o = {}) {
  card(slide, x, y, w, h, o.fill);
  fig(slide, ic, x + 0.22, y + 0.22, 0.75, 0.75);
  slide.addText(title, { x: x + 1.12, y: y + 0.22, w: w - 1.3, h: 0.75, fontSize: o.tsize || 17, bold: true, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: "card-title" });
  const runs = [];
  body.forEach((b, i) => {
    if (b.label) runs.push({ text: b.label + " ", options: { bold: true, color: b.color || C.accent1 } });
    runs.push({ text: b.text, options: { breakLine: i < body.length - 1, paraSpaceAfter: 6 } });
  });
  slide.addText(runs, { x: x + 0.22, y: y + 1.1, w: w - 0.44, h: h - 1.25, fontSize: o.size || 14, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "card-body" });
}
function stat(slide, x, y, w, big, label, color) {
  slide.addText(big, { x, y, w, h: 0.8, fontSize: 40, bold: true, color: color || C.accent2, fontFace: THEME.headFontFace, margin: 0, isTextBox: true, valign: "bottom", objectName: "stat" });
  slide.addText(label, { x, y: y + 0.82, w, h: 0.62, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "top", objectName: "stat-label" });
}
function newSlide(section, layout = "CONTENT") {
  return pres.addSlide({ masterName: layout, sectionTitle: section });
}

// ====================================================================
// SECTION 1 — Overview
pres.addSection({ title: "Overview" });
{
  const s = newSlide("Overview", "TITLE_DARK");
  s.addText("Dissolving LiTFSI in PEO", { placeholder: "title" });
  s.addText("Thermodynamics, structure, phase behaviour, DSC, solubility limit, ion transport — and a practical guide to casting good films in PTFE moulds", { placeholder: "body" });
  fig(s, "hero", 7.75, 0.95, 5.4);
  s.addNotes("Title slide. The picture shows the core idea of the whole talk: a Li+ cation is pulled out of the LiTFSI crystal and wrapped by ether oxygens from PEO chains, while the large TFSI- anion stays outside.");
}
{
  const s = newSlide("Overview");
  tag(s, "THE SHORT ANSWER");
  s.addText("Why LiTFSI dissolves — and why that is half the story", { placeholder: "title" });
  card(s, 0.6, 1.55, 5.6, 4.85, C.text2);
  s.addText([
    { text: "Ether oxygens chelate Li⁺ more strongly than the soft, charge-delocalised TFSI⁻ lattice holds it.", options: { breakLine: true, paraSpaceAfter: 14 } },
    { text: "But the same Li⁺–O bonds stiffen the chains, slow Li⁺ down and compete with PEO crystallisation.", options: { color: "F2C38B" } },
  ], { x: 0.95, y: 1.95, w: 4.9, h: 4.2, fontSize: 22, color: C.background1, fontFace: THEME.headFontFace, valign: "top", margin: 0, isTextBox: true, objectName: "key-message" });
  const rows = [
    ["ic_salt", "Components & history", "PEO, LiTFSI and 50 years of polymer electrolytes"],
    ["ic_md", "Dissolution & structure", "Thermodynamic cycle, Li⁺ solvation, crystal complexes"],
    ["ic_dsc", "Phase behaviour", "Phase diagram, DSC vs salt content, solubility limit"],
    ["ic_eis", "Transport, limits & fixes", "Why PEO falls short and how to close the gap to liquids"],
    ["ic_mould", "Casting good films", "PTFE-mould workflow, mould cleaning, sticky films"],
    ["ic_ruler", "Measuring films", "EIS conductivity and the ideal film thickness"],
  ];
  rows.forEach(([ic, t, d], i) => {
    const y = 1.55 + i * 0.83;
    fig(s, ic, 6.7, y, 0.7, 0.7);
    s.addText(t, { x: 7.6, y: y - 0.04, w: 5.1, h: 0.38, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(d, { x: 7.6, y: y + 0.33, w: 5.1, h: 0.36, fontSize: 14, color: C.accent6, margin: 0, isTextBox: true });
  });
  s.addNotes("One-sentence answer first, then the roadmap. Keep returning to the trade-off: what helps dissolution (strong Li–O binding) also hurts mobility.");
}

// ====================================================================
// SECTION 2 — Components
pres.addSection({ title: "Components" });
{
  const s = newSlide("Components");
  tag(s, "01 · COMPONENTS");
  s.addText("Two partners: a donor polymer and a soft anion", { placeholder: "title" });
  card(s, 0.6, 1.55, 5.95, 4.95);
  card(s, 6.78, 1.55, 5.95, 4.95);
  s.addText("PEO — the solvent", { x: 0.9, y: 1.7, w: 5.3, h: 0.4, fontSize: 20, bold: true, color: C.accent1, margin: 0, isTextBox: true });
  fig(s, "peo", 1.0, 2.15, 5.15);
  bullets(s, [
    "Ether O lone pairs chelate Li⁺, much like a crown ether",
    "Flexible backbone: Tg ≈ −60 °C",
    "Semicrystalline: Tm ≈ 65 °C — the crystalline part does not conduct [3]",
  ], 0.9, 4.6, 5.4, 1.8, { size: 15 });
  s.addText("LiTFSI — the salt", { x: 7.08, y: 1.7, w: 5.3, h: 0.4, fontSize: 20, bold: true, color: C.accent3, margin: 0, isTextBox: true });
  fig(s, "tfsi", 7.3, 2.1, 4.95);
  bullets(s, [
    "Li⁺ N(SO₂CF₃)₂⁻: large, charge-delocalised imide anion [5]",
    "Low lattice energy and weak ion pairing",
    "Plasticises PEO and frustrates crystallisation [6, 7]",
  ], 7.08, 4.6, 5.4, 1.8, { size: 15 });
  src(s, "Sources: [3] Berthier 1983 · [5] Armand 1990 · [6] Vallée 1992 · [7] Lascaud 1994 · [23] Xue 2015");
  s.addNotes("PEO acts as the solvent: its ether oxygens are hard Lewis bases that coordinate Li+. LiTFSI is chosen because the anion is huge and its charge is spread over N, two S and four O atoms, so it holds Li+ weakly.");
}
{
  const s = newSlide("Components");
  tag(s, "01 · COMPONENTS");
  s.addText("Fifty years of PEO–salt electrolytes", { placeholder: "title" });
  fig(s, "timeline", 0.6, 1.7, 12.1);
  card(s, 0.6, 5.25, 12.1, 1.15, C.background2);
  s.addText([
    { text: "The questions moved from ", options: {} },
    { text: "“does the salt dissolve?”", options: { bold: true, color: C.accent1 } },
    { text: " to ", options: {} },
    { text: "“where does Li⁺ sit, how does it move, and how much current does it carry?”", options: { bold: true, color: C.accent2 } },
  ], { x: 0.9, y: 5.3, w: 11.5, h: 1.05, fontSize: 18, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
  src(s, "Sources: [1] Fenton 1973 · [2] Armand 1979 · [3] Berthier 1983 · [5] Armand 1990 · [7] Lascaud 1994 · [12] MacGlashan 1999 · [18] Borodin 2006 · [22] Pesko 2017");
  s.addNotes("Milestones: Wright's group found alkali salts complex PEO (1973); Armand proposed PEO electrolytes for batteries (1979); Berthier et al. showed conduction happens in the amorphous phase (1983); imide salts appeared around 1990; the PEO–LiTFSI phase diagram followed (1994).");
}

// ====================================================================
// SECTION 3 — Dissolution & structure
pres.addSection({ title: "Dissolution and structure" });
{
  const s = newSlide("Dissolution and structure");
  tag(s, "02 · DISSOLUTION");
  s.addText("Dissolving is a contest: lattice cost vs Li⁺–O gain", { placeholder: "title" });
  fig(s, "cycle", 0.6, 1.6, 6.9);
  const pts = [
    ["Small lattice cost", "TFSI⁻ is large and delocalised, so LiTFSI's lattice is easy to break up [5]."],
    ["Enthalpy drives it", "Several Li⁺–O(ether) bonds per Li⁺ release more than the lattice costs [4]."],
    ["Entropy pushes back", "Chains lose conformational freedom around Li⁺, so −TΔS grows on heating; for some salts this causes precipitation at high T [4]."],
  ];
  pts.forEach(([h, b], i) => {
    const y = 1.65 + i * 1.62;
    s.addShape(pres.shapes.OVAL, { x: 7.85, y: y + 0.05, w: 0.5, h: 0.5, fill: { color: [C.accent3, C.accent1, C.accent2][i] }, line: { type: "none" } });
    s.addText(String(i + 1), { x: 7.85, y: y + 0.05, w: 0.5, h: 0.5, fontSize: 18, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 8.55, y, w: 4.2, h: 0.45, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(b, { x: 8.55, y: y + 0.45, w: 4.2, h: 1.05, fontSize: 15, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  });
  src(s, "Sources: [4] Ratner & Shriver 1988 · [5] Armand 1990 · [23] Xue 2015");
  s.addNotes("Born–Haber style reasoning. ΔG of dissolution = ΔH − TΔS. ΔH is negative because Li–O coordination outweighs the low lattice energy of LiTFSI; ΔS is negative because the polymer chains become ordered around Li+. That negative entropy is why dissolution in polyethers can get worse at high temperature.");
}
{
  const s = newSlide("Dissolution and structure");
  tag(s, "02 · DISSOLUTION");
  s.addText("Why TFSI⁻ is the anion of choice", { placeholder: "title" });
  fig(s, "anions", 0.6, 1.55, 6.3);
  bullets(s, [
    [{ text: "Charge delocalisation: ", bold: true }, { text: "−1 spread over N, S and O → weak Li⁺···anion binding, more free Li⁺" }],
    [{ text: "Conformational flexibility: ", bold: true }, { text: "two near-degenerate conformers (C₂ transoid, C₁ cisoid) disorder packing [25]" }],
    [{ text: "Plasticising effect: ", bold: true }, { text: "compared with LiCF₃SO₃ and LiClO₄, LiTFSI gives lower Tg and a wider amorphous range in PEO [6, 7]" }],
    [{ text: "Trade-off: ", bold: true }, { text: "the same anion is mobile (low t₊) and corrodes Al at high potentials [30]" }],
  ], 7.3, 1.7, 5.4, 4.8, { size: 16 });
  src(s, "Sources: [6] Vallée 1992 · [7] Lascaud 1994 · [25] Johansson 1998 · [30] Krause 1997");
  s.addNotes("Anion size ordering here is qualitative. The key point: delocalised, flexible TFSI- lowers the lattice energy and suppresses crystallisation, which is why PEO–LiTFSI stays amorphous over a wide composition range.");
}
{
  const s = newSlide("Dissolution and structure");
  tag(s, "02 · STRUCTURE");
  s.addText("How PEO wraps a lithium ion", { placeholder: "title" });
  fig(s, "solvation", 0.7, 1.5, 5.55);
  stat(s, 6.9, 1.6, 2.7, "≈ 5", "ether O around each Li⁺ (neutron diffraction, P(EO)₇.₅LiTFSI) [14]");
  stat(s, 9.9, 1.6, 2.8, "2", "PEO strands typically share one Li⁺ [14]", C.accent1);
  bullets(s, [
    "Li⁺ acts as a transient crosslink between segments, slowing polymer relaxation [15]",
    "MD: Li⁺ is coordinated mainly by ether O; ion pairing with TFSI⁻ grows with salt content [18]",
    "Each Li⁺ ties up ~4–6 EO units — this sets the scale of the EO:Li ratios used everywhere",
  ], 6.9, 3.4, 5.8, 3.1, { size: 16 });
  src(s, "Sources: [14] Mao et al., PRL 2000 · [15] Mao et al., Nature 2000 · [18] Borodin & Smith 2006");
  s.addNotes("Neutron diffraction with isotopic substitution on P(EO)7.5LiTFSI found Li bonded on average to five ether oxygens belonging to pairs of PEO coils. Li–O distance shown is a typical value, about 2 Å.");
}
{
  const s = newSlide("Dissolution and structure");
  tag(s, "02 · STRUCTURE");
  s.addText("Crystalline complexes: tunnels and helices", { placeholder: "title" });
  fig(s, "crystals", 1.77, 1.5, 9.8);
  s.addText([
    { text: "Ordered complexes are the stable state at RT; ", options: { bold: true } },
    { text: "conduction normally happens in the amorphous phase [3], although P(EO)₆:LiXF₆ was shown to conduct in the crystal [13]." },
  ], { x: 1.77, y: 6.02, w: 9.8, h: 0.6, fontSize: 15, color: C.text1, margin: 0, isTextBox: true, align: "left" });
  src(s, "Sources: [3] Berthier 1983 · [10] Andreev 1996 · [11] Lightfoot 1993 · [12] MacGlashan 1999 · [13] Gadjourova 2001");
  s.addNotes("P(EO)6: two non-helical chains fold together to form cylinders with Li+ inside; anions sit outside. P(EO)3: a single helix with Li+ inside, coordinated by ether oxygens and directly by anion oxygens. The P(EO)3:LiTFSI structure was solved from powder data by Andreev, Lightfoot and Bruce.");
}

// ====================================================================
// SECTION 4 — Phase behaviour
pres.addSection({ title: "Phase behaviour" });
{
  const s = newSlide("Phase behaviour");
  tag(s, "03 · PHASE BEHAVIOUR");
  s.addText("The PEO–LiTFSI phase diagram", { placeholder: "title" });
  fig(s, "phase", 0.5, 1.45, 6.6);
  bullets(s, [
    [{ text: "Pure PEO ", bold: true }, { text: "melts at ≈ 65 °C" }],
    [{ text: "Three stoichiometric complexes: ", bold: true }, { text: "EO:Li = 6:1, 3:1 and 2:1 [26]" }],
    [{ text: "Eutectic ", bold: true }, { text: "between PEO and P(EO)₆, reported near EO:Li ≈ 9–11 depending on study and Mw [16, 26]" }],
    [{ text: "Crystallinity gap: ", bold: true }, { text: "EO:Li ≈ 6–12 crystallises so slowly that films are often amorphous at RT [7, 17]" }],
    [{ text: "Practical rule: ", bold: true, color: C.accent2 }, { text: "composition AND thermal history decide what your film is" }],
  ], 7.4, 1.6, 5.3, 4.9, { size: 16 });
  src(s, "Schematic redrawn qualitatively after [7] Lascaud 1994, [16] Edman 2000, [17] Edman 2000, [26] Marzantowicz 2006 — not to scale.");
  s.addNotes("Schematic only: temperatures are not to scale. The important features are the PEO melting point, the eutectic, the 6:1, 3:1 and 2:1 complexes, and the crystallinity gap where TFSI suppresses nucleation.");
}
{
  const s = newSlide("Phase behaviour");
  tag(s, "03 · PHASE BEHAVIOUR");
  s.addText("DSC: how salt content changes PEO crystallisation", { placeholder: "title" });
  fig(s, "dsc", 0.5, 1.4, 6.3);
  s.addText("What the traces show", { x: 7.2, y: 1.5, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true });
  bullets(s, [
    "Tg step moves up steadily with salt [6, 7]",
    "PEO melting peak shrinks and shifts down as EO:Li falls from ∞ to ~16–20",
    "EO:Li ≈ 6–12: after heating no melting peak — amorphous; aged samples can show one again [17]",
    "High salt (EO:Li ≤ 3): melting of crystalline complexes at higher T [7, 26]",
  ], 7.2, 1.95, 5.5, 2.75, { size: 15 });
  card(s, 7.2, 4.75, 5.5, 1.8, C.background2);
  s.addText([
    { text: "Crystallinity of PEO", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: "Xc = ΔHm / (w_PEO · ΔH°m)", options: { bold: true, fontFace: THEME.headFontFace, breakLine: true } },
    { text: "w_PEO = PEO weight fraction; ΔH°m ≈ 196–213 J g⁻¹ (literature values vary). Seal pans in the glovebox; report 1st heat (as-cast) and 2nd heat (after melt) separately." },
  ], { x: 7.4, y: 4.85, w: 5.1, h: 1.6, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  src(s, "Schematic traces summarising trends reported in [6] Vallée 1992, [7] Lascaud 1994, [17] Edman 2000, [26] Marzantowicz 2006 — not measured data.");
  s.addNotes("Read the DSC in three places: the Tg step, the PEO melting endotherm, and any complex melting at high temperature. Because recrystallisation in salt-rich PEO–LiTFSI is very slow, the first heating of an aged film and the second heating after melting can look completely different. Normalise the melting enthalpy to the PEO mass only.");
}
{
  const s = newSlide("Phase behaviour");
  tag(s, "03 · PHASE BEHAVIOUR");
  s.addText("How much LiTFSI can PEO dissolve?", { placeholder: "title" });
  fig(s, "solub", 0.6, 1.45, 12.1);
  stat(s, 0.6, 5.25, 3.8, "r = 0.28", "EO:Li ≈ 3.6 — upper end of one homogeneous amorphous phase [27]", C.accent1);
  stat(s, 4.75, 5.25, 3.8, "r = 0.50", "EO:Li = 2 — solubility limit; a crystalline 2:1 phase appears [26, 27]", C.accent4);
  stat(s, 8.9, 5.25, 3.8, "≈ 77 wt%", "LiTFSI at the limit (≈ 3.3 g per g PEO)", C.accent3);
  src(s, "Sources: [7] Lascaud 1994 · [26] Marzantowicz 2006 · [27] Grundy et al. 2022. wt% computed from M(LiTFSI) = 287.1, M(EO) = 44.05 g mol⁻¹.");
  s.addNotes("Grundy et al. (Balsara group, Macromolecules 2022) found that above r ≈ 0.28 an amorphous phase with r = 0.28 coexists with a crystalline phase at r = 0.50, and they took r = 0.50 as the solubility limit. Practical electrolytes sit far below this, at EO:Li 8–20, because mechanics and conductivity, not solubility, set the useful range.");
}

// ====================================================================
// SECTION 5 — Transport
pres.addSection({ title: "Transport" });
{
  const s = newSlide("Transport");
  tag(s, "04 · TRANSPORT");
  s.addText("Salt stiffens the chains: Tg rises", { placeholder: "title" });
  fig(s, "tg", 0.5, 1.5, 6.9);
  bullets(s, [
    "Each Li⁺ binds O from one or two chains → transient crosslinks [14, 15]",
    "Tg increases steadily with salt content [6, 7]",
    "Ion motion is coupled to segmental motion, so higher Tg means slower ions [18]",
  ], 7.7, 1.6, 5.0, 2.9, { size: 16 });
  card(s, 7.7, 4.55, 5.0, 1.95, C.background2);
  s.addText([
    { text: "VTF behaviour of amorphous PEO electrolytes", options: { bold: true, color: C.accent2, breakLine: true } },
    { text: "σ(T) = A·T^(−1/2)·exp[−B / (T − T₀)]", options: { bold: true, fontFace: THEME.headFontFace, breakLine: true } },
    { text: "T₀ is typically ~30–50 K below Tg, so every degree of Tg costs conductivity." },
  ], { x: 7.9, y: 4.65, w: 4.6, h: 1.75, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  src(s, "Sources: [6] Vallée 1992 · [7] Lascaud 1994 · [14, 15] Mao 2000 · [18] Borodin & Smith 2006");
  s.addNotes("Curved, VTF-type conductivity plots are the fingerprint of transport coupled to polymer segmental motion.");
}
{
  const s = newSlide("Transport");
  tag(s, "04 · TRANSPORT");
  s.addText("Conductivity peaks at an intermediate salt content", { placeholder: "title" });
  fig(s, "sigma", 0.5, 1.5, 6.6);
  bullets(s, [
    [{ text: "More salt → more carriers ", bold: true, color: C.accent3 }, { text: "(n grows)" }],
    [{ text: "More salt → slower carriers ", bold: true, color: C.accent1 }, { text: "(Tg ↑, ion pairing ↑)" }],
    [{ text: "Optimum ", bold: true, color: C.accent2 }, { text: "typically around EO:Li ≈ 8–20, shifting with T, Mw and thermal history [7, 16]" }],
    [{ text: "Typical magnitude: ", bold: true }, { text: "~10⁻⁴–10⁻³ S cm⁻¹ at 60–90 °C, but orders of magnitude lower near room temperature in semicrystalline films [23]" }],
  ], 7.5, 1.6, 5.2, 4.9, { size: 16 });
  src(s, "Sources: [7] Lascaud 1994 · [16] Edman 2000 · [23] Xue 2015. Curves are schematic.");
  s.addNotes("This trade-off is general for salt-in-polymer electrolytes. With LiTFSI the optimum is broad because the anion keeps the matrix amorphous.");
}
{
  const s = newSlide("Transport");
  tag(s, "04 · TRANSPORT");
  s.addText("How Li⁺ actually moves", { placeholder: "title" });
  fig(s, "modes", 0.6, 1.5, 12.1);
  card(s, 0.6, 5.65, 12.1, 0.9, C.background2);
  s.addText([
    { text: "MD of PEO/LiTFSI: ", options: { bold: true, color: C.accent2 } },
    { text: "motion along the chain ① and motion with PEO segments ② contribute roughly equally; both ions' diffusion is strongly coupled to PEO dynamics [18, 19]." },
  ], { x: 0.85, y: 5.7, w: 11.6, h: 0.8, fontSize: 16, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
  src(s, "Sources: [3] Berthier 1983 · [4] Ratner & Shriver 1988 · [18] Borodin & Smith 2006 · [19] Diddens et al. 2010");
  s.addNotes("Borodin and Smith: Li+ transport combines subdiffusive motion along PEO chains, motion together with PEO segments, and intersegmental hops. Diddens, Heuer and Borodin built a Rouse-based model for this.");
}
{
  const s = newSlide("Transport");
  tag(s, "04 · TRANSPORT");
  s.addText("Not every dissolved ion is a free ion", { placeholder: "title" });
  fig(s, "species", 0.6, 1.45, 12.1);
  fig(s, "band", 0.6, 4.4, 3.5);
  bullets(s, [
    "Vibrational bands of TFSI⁻ (FTIR; Raman mode near 740 cm⁻¹) shift when the anion binds Li⁺ → free vs paired fractions [9]",
    "Ion pairs diffuse but carry no net current: NMR diffusion overestimates conductivity",
    "Pairing and aggregation grow with salt content [18]",
  ], 4.2, 4.7, 8.5, 1.9, { size: 15 });
  src(s, "Sources: [9] Wen et al. 1996 · [18] Borodin & Smith 2006. Band shape is schematic.");
  s.addNotes("Speciation matters because conductivity counts only net charge transport. Contact ion pairs and neutral aggregates move without carrying current.");
}
{
  const s = newSlide("Transport");
  tag(s, "04 · TRANSPORT");
  s.addText("The anion carries most of the current", { placeholder: "title" });
  fig(s, "transfer", 0.5, 1.5, 6.6);
  stat(s, 7.5, 1.55, 2.5, "≈ 0.1–0.3", "typical t₊ (Bruce–Vincent, PFG-NMR) [20, 21]", C.accent2);
  stat(s, 10.3, 1.55, 2.4, "< 0", "rigorous t₊⁰ at some concentrations [22]", C.accent4);
  bullets(s, [
    "Li⁺ is held by the chains; TFSI⁻ is weakly bound and moves faster",
    "Salt gradients build up during cycling → polarisation and a limiting current",
    "Concentrated-solution theory gives negative t₊⁰ over a range of salt contents [22]",
  ], 7.5, 3.4, 5.2, 3.1, { size: 16 });
  src(s, "Sources: [20] Evans, Vincent & Bruce 1987 · [21] Timachova 2015 · [22] Pesko 2017");
  s.addNotes("Bruce–Vincent potentiostatic polarisation gives a current fraction; PFG-NMR gives D(7Li)/(D(7Li)+D(19F)). Both are approximations; the Newman approach with all transport parameters can give negative values in PEO–LiTFSI.");
}

// ====================================================================
// SECTION 6 — Limitations
pres.addSection({ title: "Limitations" });
{
  const s = newSlide("Limitations");
  tag(s, "05 · LIMITATIONS");
  s.addText("Why PEO–LiTFSI is not good enough on its own", { placeholder: "title" });
  const items = [
    ["ic_thermo", "Too slow at room temperature", [{ text: "PEO crystallises below ≈ 65 °C; practical cells run hot, around 60–80 °C [23]." }]],
    ["ic_tplus", "Low Li⁺ transference", [{ text: "t₊ ≈ 0.1–0.3 → concentration polarisation and a low rate capability [20–22]." }]],
    ["ic_dendrite", "Soft above its melting point", [{ text: "A melt-like electrolyte cannot mechanically block Li protrusions (modulus criterion) [28]." }]],
    ["ic_volt", "Limited oxidative window", [{ text: "Ether backbone oxidises near ~4 V vs Li/Li⁺; fast failure with high-voltage cathodes is debated [23, 29]." }]],
    ["ic_al", "Al corrosion by TFSI⁻", [{ text: "LiTFSI corrodes Al current collectors at high cathode potentials [30]." }]],
    ["ic_water", "Hygroscopic, processing-sensitive", [{ text: "Water and residual solvent shift Tg and σ and react with Li metal." }]],
  ];
  items.forEach(([ic, t, b], i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.55 + Math.floor(i / 3) * 2.55;
    iconCard(s, x, y, 3.9, 2.35, ic, t, b, { size: 14, tsize: 16 });
  });
  src(s, "Sources: [20] Evans 1987 · [21] Timachova 2015 · [22] Pesko 2017 · [23] Xue 2015 · [28] Monroe & Newman 2005 · [29] Homann 2020 · [30] Krause 1997");
  s.addNotes("Main deficits: room-temperature conductivity, low transference number, poor mechanical strength at operating temperature, limited oxidative stability (and the debate in Homann et al. 2020 that rapid failure with NMC may come from cell setup rather than oxidation), Al corrosion from TFSI, and sensitivity to moisture.");
}
// ====================================================================
// SECTION 6b — Closing the gap to liquid electrolytes
pres.addSection({ title: "Closing the gap" });
const chartBase = () => ({
  catAxisLabelColor: HEX.muted, valAxisLabelColor: HEX.muted, catAxisLabelFontSize: 13, valAxisLabelFontSize: 12,
  catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", dataLabelFontFace: "+mn-lt", titleFontFace: "+mn-lt",
  valGridLine: { color: "E3E8EC", size: 0.75 }, catGridLine: { style: "none" }, showLegend: false,
  catAxisLineShow: false, titleColor: HEX.ink, titleFontSize: 14, showTitle: true,
});
{
  const s = newSlide("Closing the gap");
  tag(s, "06 · CLOSING THE GAP");
  s.addText("The gap: three to four decades at room temperature", { placeholder: "title" });
  s.addChart(pres.charts.BAR, [{
    name: "σ (S/cm)",
    labels: ["PEO–LiTFSI, 25 °C · ~10⁻⁶", "SPE target, 25 °C · 10⁻⁴", "PEO–LiTFSI, 70 °C · 10⁻³", "Liquid, 25 °C · 10⁻²"],
    values: [3e-6, 1e-4, 1e-3, 1e-2],
  }], Object.assign(chartBase(), {
    x: 0.6, y: 1.5, w: 7.3, h: 4.95, barDir: "bar", chartColors: ["1F7A7A"],
    valAxisLogScaleBase: 10, valAxisMinVal: 1e-7, valAxisMaxVal: 1e-1, valAxisLabelFormatCode: "0E+0",
    showValue: false,
    title: "Ionic conductivity, S cm⁻¹ (log scale, typical values)", barGapWidthPct: 60, objectName: "chart-gap",
  }));
  stat(s, 8.3, 1.55, 4.4, "×1000–10000", "lower σ for semicrystalline PEO–LiTFSI than a liquid electrolyte at 25 °C", C.accent4);
  stat(s, 8.3, 3.05, 4.4, "≈ 10⁻⁴ S cm⁻¹", "room-temperature σ usually quoted as the practical solid-state target", C.accent1);
  card(s, 8.3, 4.6, 4.4, 1.9, C.background2);
  s.addText([
    { text: "Count only the Li⁺ part: σ·t₊", options: { bold: true, color: C.accent2, breakLine: true } },
    { text: "liquid ≈ 10 × 0.35 ≈ 3.5 mS cm⁻¹; PEO at 70 °C ≈ 1 × 0.2 = 0.2 mS cm⁻¹. t₊ matters as much as σ." },
  ], { x: 8.5, y: 4.7, w: 4.0, h: 1.7, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  src(s, "Typical magnitudes: liquid ≈ 10 mS cm⁻¹ for 1 M LiPF₆ in EC/DMC (vendor data); PEO values from [7, 16, 23]; t₊ from [20–22]. Bars are representative, not one data set.");
  s.addNotes("Commercial liquid electrolytes reach about 10 mS/cm at room temperature. Semicrystalline PEO–LiTFSI is around 10^-6 to 10^-5 S/cm at 25 °C and about 10^-3 S/cm at 70 °C. The field generally treats 10^-4 S/cm at room temperature as the practical bar for solid polymer electrolytes. Also compare the Li+ conductivity, sigma times t+.");
}
{
  const s = newSlide("Closing the gap");
  tag(s, "06 · CLOSING THE GAP");
  s.addText("What the cell feels is resistance, not conductivity", { placeholder: "title" });
  s.addChart(pres.charts.BAR, [{
    name: "ASR",
    labels: ["Liquid in 20 µm separator, 25 °C", "PEO 20 µm, 70 °C (10⁻³)", "Target: 10 µm, 25 °C (10⁻⁴)", "PEO 20 µm, 25 °C (10⁻⁴)"],
    values: [1.6, 2.0, 10, 20],
  }], Object.assign(chartBase(), {
    x: 0.6, y: 1.5, w: 7.3, h: 4.95, barDir: "bar", chartColors: ["3D5A80"],
    valAxisMinVal: 0, valAxisMaxVal: 25, valAxisLabelFormatCode: "0",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0", dataLabelColor: HEX.ink, dataLabelFontSize: 13,
    title: "Electrolyte area-specific resistance, Ω cm² (lower is better)", barGapWidthPct: 60, objectName: "chart-asr",
  }));
  card(s, 8.3, 1.55, 4.4, 2.15, C.background2);
  s.addText([
    { text: "ASR = L / σ_eff", options: { bold: true, fontFace: THEME.headFontFace, fontSize: 22, color: C.text2, breakLine: true, paraSpaceAfter: 6 } },
    { text: "A liquid must sit in a porous separator, which cuts its effective σ several-fold (MacMullin number, typically ~5–10). Here σ_eff ≈ 10/8 ≈ 1.25 mS cm⁻¹." },
  ], { x: 8.5, y: 1.65, w: 4.0, h: 1.95, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  bullets(s, [
    [{ text: "At 60–70 °C ", bold: true, color: C.accent4 }, { text: "a 20 µm PEO film already matches a liquid cell" }],
    [{ text: "At 25 °C ", bold: true, color: C.accent1 }, { text: "you need ≥ 10⁻⁴ S cm⁻¹ AND ≤ 10–20 µm" }],
    [{ text: "A 50 µm film at 10⁻⁵ S cm⁻¹ ", bold: true }, { text: "gives ≈ 500 Ω cm² — off this chart" }],
  ], 8.3, 3.95, 4.4, 2.6, { size: 15 });
  src(s, "ASR = L/σ, calculated for the stated thickness and σ; liquid case assumes σ = 10 mS cm⁻¹ and a MacMullin number of 8 (assumption). Interfacial resistances not included.");
  s.addNotes("Area-specific resistance is thickness divided by effective conductivity. 20 µm at 1e-3 S/cm is 2 ohm cm2; 20 µm at 1e-4 is 20; 10 µm at 1e-4 is 10. A liquid electrolyte of 10 mS/cm inside a separator with MacMullin number 8 gives about 1.6. This is why thin, supported films plus a modest temperature are the realistic way to compete.");
}
{
  const s = newSlide("Closing the gap");
  tag(s, "06 · CLOSING THE GAP");
  s.addText("Every route trades solidity for speed", { placeholder: "title" });
  fig(s, "gapmap", 0.6, 1.45, 12.1);
  src(s, "Ranges are indicative room-temperature values from [23, 24, 33–38]; ● = specific reported value. *Part of the poly-DOL conductivity comes from unpolymerised DOL [38].");
  s.addNotes("Read left to right: the further right, the more liquid-like the electrolyte and the higher the conductivity, but the less of the solid-state benefit remains. The sweet spot for most groups is in the middle: amorphous PEO, ceramic composites and plasticised systems around the 1e-4 S/cm line.");
}
{
  const s = newSlide("Closing the gap");
  tag(s, "06 · CLOSING THE GAP");
  s.addText("Routes ①–③: stay fully solid", { placeholder: "title" });
  const C3 = [
    ["ic_net", "① Suppress crystallinity", [
      { label: "How", text: "Comb/branched or crosslinked PEO, random copolymers, EO:Li inside the crystallinity gap." },
      { label: "Gain", text: "RT σ from ~10⁻⁶ towards ~10⁻⁵–10⁻⁴ S cm⁻¹ [24]." },
      { label: "Limit", text: "Still coupled to Tg; crosslinks slow segments.", color: C.accent4 },
    ]],
    ["ic_filler", "② Ceramic fillers & networks", [
      { label: "How", text: "Nano TiO₂/Al₂O₃ act as solid plasticisers [33]; a continuous LLZO nanofibre network adds fast pathways [36]." },
      { label: "Reported", text: "~10⁻⁴ S cm⁻¹ at 50 °C [33]; 2.5×10⁻⁴ S cm⁻¹ at RT [36]." },
      { label: "Limit", text: "Dispersion, interfaces, processing.", color: C.accent4 },
    ]],
    ["ic_single", "③ Decouple or fix the carrier", [
      { label: "How", text: "Polymer-in-salt [34]; single-ion block copolymers with the anion tethered [37]." },
      { label: "Reported", text: "≈1.3×10⁻⁵ S cm⁻¹ at 60 °C with t₊ > 0.85 [37]." },
      { label: "Limit", text: "σ usually lower; salt-rich PEO crystallises.", color: C.accent4 },
    ]],
  ];
  C3.forEach(([ic, t, b], i) => iconCard(s, 0.6 + i * 4.1, 1.6, 3.9, 4.15, ic, t, b, { size: 15, tsize: 17 }));
  card(s, 0.6, 5.9, 12.1, 0.65, C.text2);
  s.addText("Solid routes keep the safety case, but rarely pass ~3×10⁻⁴ S cm⁻¹ at room temperature.", { x: 0.9, y: 5.92, w: 11.5, h: 0.6, fontSize: 16, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true });
  src(s, "Sources: [24] Mindemark 2018 · [33] Croce 1998 · [34] Angell 1993 · [36] Fu 2016 · [37] Bouchet 2013");
  s.addNotes("Croce et al. used PEO–LiClO4 with nanoscale TiO2 and Al2O3. Fu et al. used a 3D garnet LLZO nanofibre network in PEO. Bouchet et al. made BAB triblock copolymers with a PEO middle block and polyanionic TFSI-type outer blocks.");
}
{
  const s = newSlide("Closing the gap");
  tag(s, "06 · CLOSING THE GAP");
  s.addText("Routes ④–⑥: add liquid-like mobility", { placeholder: "title" });
  const C3 = [
    ["ic_plast", "④ Plasticise", [
      { label: "How", text: "Add an ionic liquid (e.g. Pyr₁₄TFSI) or a glyme to PEO–LiTFSI [35]." },
      { label: "Reported", text: "Amorphous films with high conductivity even at RT, in the ~10⁻⁴ S cm⁻¹ range [35]." },
      { label: "Limit", text: "Softer film; Li-metal and high-voltage stability.", color: C.accent4 },
    ]],
    ["ic_gel", "⑤ Gel it", [
      { label: "How", text: "Swell the polymer with a carbonate liquid electrolyte." },
      { label: "Reported", text: "~10⁻³ S cm⁻¹ at RT — close to liquid." },
      { label: "Limit", text: "Liquid and flammability are back in the cell.", color: C.accent4 },
    ]],
    ["ic_dol", "⑥ New host, made in situ", [
      { label: "How", text: "Ring-open DOL inside the cell with Al(OTf)₃ [38]; polycarbonate or polyester hosts [24]." },
      { label: "Reported", text: "Up to ~10⁻³ S cm⁻¹ at RT, partly from residual unpolymerised DOL [38]." },
      { label: "Limit", text: "Conversion control; long-term stability.", color: C.accent4 },
    ]],
  ];
  C3.forEach(([ic, t, b], i) => iconCard(s, 0.6 + i * 4.1, 1.6, 3.9, 4.15, ic, t, b, { size: 15, tsize: 17 }));
  card(s, 0.6, 5.9, 12.1, 0.65, C.text2);
  s.addText("The closer σ gets to a liquid, the more of the solid-state advantage you give up.", { x: 0.9, y: 5.92, w: 11.5, h: 0.6, fontSize: 16, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true });
  src(s, "Sources: [24] Mindemark 2018 · [35] Shin, Henderson & Passerini 2003 · [38] Zhao et al. 2019");
  s.addNotes("In Zhao et al. (Nature Energy 2019) the conductivity depends strongly on the Al(OTf)3 level, and the higher values come with more unpolymerised DOL. Treat those numbers as a quasi-solid system.");
}
{
  const s = newSlide("Closing the gap");
  tag(s, "06 · CLOSING THE GAP");
  s.addText("A realistic plan: stack several modest levers", { placeholder: "title" });
  fig(s, "levers", 0.6, 1.45, 12.1);
  card(s, 0.6, 5.75, 12.1, 0.8, C.background2);
  s.addText([
    { text: "Proof of concept: ", options: { bold: true, color: C.accent1 } },
    { text: "an 8.6 µm nanoporous polyimide film filled with PEO/LiTFSI reached 2.3×10⁻⁴ S cm⁻¹ at 30 °C and survived bending, cutting and nail tests [39]." },
  ], { x: 0.85, y: 5.8, w: 11.6, h: 0.7, fontSize: 15, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
  src(s, "Sources: [39] Wan et al. 2019; lever factors are illustrative orders of magnitude derived from the preceding slides.");
  s.addNotes("No single trick closes the gap. Combine an amorphous host, a ceramic network or small amount of plasticiser, a thin supported film, a modest operating temperature, and a higher transference number. Together these can bring the electrolyte resistance close to a liquid cell while keeping most of the solid-state benefits.");
}

// ====================================================================
// SECTION 7 — Casting
pres.addSection({ title: "Casting films" });
{
  const s = newSlide("Casting films");
  tag(s, "07 · CASTING IN PTFE MOULDS");
  s.addText("Solution casting a free-standing film, step by step", { placeholder: "title" });
  fig(s, "workflow", 0.6, 1.55, 12.1);
  const rules = [
    ["Dry everything", "Solvent ≤ ~20 ppm H₂O; dry salt and polymer before weighing."],
    ["Slow beats fast", "Slow evaporation gives a uniform, bubble-free film."],
    ["Freshly dried ≠ final", "PEO and complexes recrystallise slowly; judge the film after ageing [17]."],
  ];
  rules.forEach(([h, b], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 5.05, 3.9, 1.5, C.background2);
    s.addText(h, { x: x + 0.25, y: 5.15, w: 3.4, h: 0.4, fontSize: 17, bold: true, color: C.accent1, margin: 0, isTextBox: true });
    s.addText(b, { x: x + 0.25, y: 5.55, w: 3.4, h: 0.9, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  });
  src(s, "Typical laboratory practice; adjust times and temperatures to your PEO grade and film thickness. [17] Edman, Ferry & Doeff 2000.");
  s.addNotes("Workflow: dry PEO at about 50 °C under vacuum (below its melting point) and LiTFSI at 100 °C or more under vacuum; weigh in the glovebox; dissolve in dry acetonitrile at 3–8 wt% solids with gentle stirring; cast in a levelled PTFE mould; evaporate slowly with the lid ajar; vacuum-dry at 50–60 °C for 24–48 h; let it age at room temperature before peeling.");
}
{
  const s = newSlide("Casting films");
  tag(s, "07 · CASTING IN PTFE MOULDS");
  s.addText("Mould set-up and how much to weigh", { placeholder: "title" });
  fig(s, "mould", 0.4, 1.6, 5.7);
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 14, align: "center", valign: "middle" } });
  const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 14, color: C.text1, align: "center", valign: "middle" }, o) });
  const rows = [
    [hdr("EO:Li"), hdr("LiTFSI per 1.000 g PEO"), hdr("wt% LiTFSI"), hdr("typical film at RT")],
    [cell("20"), cell("0.326 g"), cell("25"), cell("free-standing", { align: "left" })],
    [cell("16"), cell("0.407 g"), cell("29"), cell("free-standing (common)", { align: "left" })],
    [cell("12"), cell("0.543 g"), cell("35"), cell("soft, slow to crystallise", { align: "left" })],
    [cell("10"), cell("0.652 g"), cell("39"), cell("tacky, often amorphous", { align: "left" })],
    [cell("8"), cell("0.815 g"), cell("45"), cell("very tacky, needs support", { align: "left" })],
  ];
  s.addTable(rows, { x: 6.3, y: 1.55, w: 6.4, colW: [0.8, 1.55, 1.05, 3.0], rowH: [0.62, 0.4, 0.4, 0.4, 0.4, 0.4], border: { type: "solid", pt: 0.75, color: HEX.line }, fill: { color: "FFFFFF" }, margin: [0.03, 0.08, 0.03, 0.08], objectName: "recipe-table" });
  card(s, 6.3, 4.35, 6.4, 2.2, C.background2);
  s.addText([
    { text: "Mass from target ratio", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: "m(LiTFSI) / m(PEO) = (287.1 / 44.05) ÷ n = 6.517 ÷ n", options: { bold: true, fontFace: THEME.headFontFace, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Thickness from mass", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: "m(solids) ≈ ρ·A·t, ρ ≈ 1.2–1.3 g cm⁻³. Ø 6 cm mould (28.3 cm²), 100 µm → ≈ 0.35 g solids ≈ 7 g of a 5 wt% MeCN solution." },
  ], { x: 6.5, y: 4.45, w: 6.0, h: 2.0, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  src(s, "Ratios computed from molar masses; film character follows the phase behaviour in [7] Lascaud 1994 and [17] Edman 2000. Density is approximate.");
  s.addNotes("n is EO:Li. A PTFE surface wets poorly, so the solution sits with rounded edges and the rim dries thicker — plan to trim it. Scratched PTFE moulds trap the film; keep a dedicated, undamaged mould.");
}
{
  const s = newSlide("Casting films");
  tag(s, "07 · CASTING IN PTFE MOULDS");
  s.addText("Cleaning the PTFE mould before and after each cast", { placeholder: "title" });
  fig(s, "clean", 0.6, 1.4, 12.1);
  const tips = [
    ["No metal tools or scouring pads", "scratches trap film and residue"],
    ["Bake ≤ 250 °C", "PTFE service limit ~260 °C; overheating gives toxic fumes"],
    ["Keep the casting face clean", "skin oil or silicone grease makes the solution dewet"],
    ["Washings contain LiTFSI", "collect as fluorinated chemical waste"],
  ];
  tips.forEach(([h, d], i) => {
    const x = 0.6 + i * 3.075;
    card(s, x, 5.72, 2.9, 0.88, C.background2);
    s.addText([
      { text: h, options: { bold: true, color: C.accent4, breakLine: true } },
      { text: d, options: { fontSize: 12, color: C.text1 } },
    ], { x: x + 0.15, y: 5.75, w: 2.65, h: 0.82, fontSize: 14, valign: "middle", margin: 0, isTextBox: true });
  });
  src(s, "Common laboratory practice; follow your institution's waste rules. PTFE is resistant to these solvents and has a maximum service temperature of about 260 °C.");
  s.addNotes("After use: remove the film, then soak the mould in warm DI water — both PEO and LiTFSI dissolve — wash with a mild detergent and a soft sponge, rinse three times with DI water, rinse with IPA or ethanol and let it dry covered. Before the next cast: inspect for scratches or haze, rinse with acetone or IPA, wipe with a lint-free tissue while touching only the edges, bake at 100–120 °C for at least two hours (vacuum oven ideal), and move it into the glovebox antechamber while still warm. Keep a dedicated mould for electrolytes. Never heat PTFE above about 250 °C.");
}
{
  const s = newSlide("Casting films");
  tag(s, "07 · TROUBLESHOOTING");
  s.addText("Sticky film? Check composition and chemistry first", { placeholder: "title" });
  const C3 = [
    ["ic_salt", "Too much salt", [
      { label: "Why", text: "EO:Li ≲ 12 stays amorphous at RT — a tacky rubber by nature, not a failed cast [7, 17]." },
      { label: "Check", text: "DSC shows only a Tg step, no PEO melting peak." },
      { label: "Fix", text: "Use EO:Li 16–20 for free-standing films, or reinforce/support high-salt films." },
    ]],
    ["ic_scission", "Molecular weight too low or degraded", [
      { label: "Why", text: "Few entanglements → film flows; heat in air, UV or ultrasound cut chains." },
      { label: "Check", text: "Film creeps or tears like wax; solution viscosity drops over time." },
      { label: "Fix", text: "Use high-Mw PEO (≥ 6×10⁵, often ~10⁶+); dissolve ≤ 50 °C, under Ar, no sonication." },
    ]],
    ["ic_solvent", "Residual acetonitrile", [
      { label: "Why", text: "MeCN binds Li⁺ strongly and plasticises the film." },
      { label: "Check", text: "TGA mass loss below ~150 °C; FTIR C≡N band near 2250–2280 cm⁻¹." },
      { label: "Fix", text: "Vacuum-dry 50–60 °C for 24–48 h or longer; thinner films dry faster." },
    ]],
  ];
  C3.forEach(([ic, t, b], i) => iconCard(s, 0.6 + i * 4.1, 1.6, 3.9, 3.95, ic, t, b, { size: 15, tsize: 17 }));
  card(s, 0.6, 5.75, 12.1, 0.75, C.text2);
  s.addText("Rule of thumb: if only films with EO:Li ≲ 12 are tacky, the composition — not your technique — is the cause.", { x: 0.9, y: 5.78, w: 11.5, h: 0.7, fontSize: 16, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true });
  src(s, "Sources: [7] Lascaud 1994 · [17] Edman, Ferry & Doeff 2000; checks and fixes are common laboratory practice.");
  s.addNotes("Stickiness at high salt is intrinsic: the composition lies in the crystallinity gap, so there is no PEO crystal network to make the film stiff. If you need EO:Li around 8–10, change the architecture or add a support instead of fighting the casting.");
}
{
  const s = newSlide("Casting films");
  tag(s, "07 · TROUBLESHOOTING");
  s.addText("Sticky film? Then check water, time and technique", { placeholder: "title" });
  const C3 = [
    ["ic_water", "Water uptake", [
      { label: "Why", text: "LiTFSI and PEO are hygroscopic; water plasticises the film and attacks Li." },
      { label: "Check", text: "Film gets tackier in air; Karl Fischer on solvent and film." },
      { label: "Fix", text: "Dry salt (≥ 100 °C, vacuum) and polymer; cast, dry and store under Ar or in a dry room." },
    ]],
    ["ic_clock", "Not enough time to crystallise", [
      { label: "Why", text: "After 50–60 °C drying the film is largely molten; it recrystallises slowly, sometimes over days [17]." },
      { label: "Check", text: "Tackiness falls with time; the DSC melting peak grows with ageing." },
      { label: "Fix", text: "Cool slowly and age 2–7 days at RT in the glovebox before peeling." },
    ]],
    ["ic_mould", "Casting and peeling technique", [
      { label: "Why", text: "Fast evaporation skins the surface; a tilted mould leaves thin, weak zones." },
      { label: "Check", text: "Bubbles, wrinkles, thickness gradient, tears at the edge." },
      { label: "Fix", text: "Level, degas, lid ajar; chill the sealed mould briefly, then peel from a corner with a PTFE spatula." },
    ]],
  ];
  C3.forEach(([ic, t, b], i) => iconCard(s, 0.6 + i * 4.1, 1.6, 3.9, 3.95, ic, t, b, { size: 15, tsize: 17 }));
  card(s, 0.6, 5.75, 12.1, 0.75, C.text2);
  s.addText("Quick test: a well-dried, high-Mw film at EO:Li 16–20 should peel cleanly after a few days of ageing at RT.", { x: 0.9, y: 5.78, w: 11.5, h: 0.7, fontSize: 16, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true });
  src(s, "Sources: [17] Edman, Ferry & Doeff 2000; other checks and fixes are common laboratory practice. Keep the mould sealed when chilling to avoid condensation.");
  s.addNotes("Chilling stiffens the film and makes peeling easier, but outside the glovebox water condenses on cold surfaces — keep the mould sealed until it is back at room temperature, or chill inside the glovebox.");
}
{
  const s = newSlide("Casting films");
  tag(s, "07 · PLAN B");
  s.addText("If casting keeps failing: other ways to a usable film", { placeholder: "title" });
  const items = [
    ["ic_press", "Solvent-free hot pressing", [{ text: "Mix dry PEO and LiTFSI, press above Tm between PTFE or release sheets. No residual solvent." }]],
    ["ic_net", "Reinforce the polymer", [{ text: "Crosslinking, block copolymers or fillers give modulus at high salt [24, 31]." }]],
    ["ic_scaffold", "Use a support", [{ text: "Impregnate a glass-fibre or non-woven scaffold so a tacky electrolyte still handles well." }]],
    ["ic_liner", "Cast on a release liner", [{ text: "Doctor-blade onto a PTFE sheet or siliconised film for even thickness and easy release." }]],
  ];
  items.forEach(([ic, t, b], i) => {
    const x = 0.6 + (i % 2) * 6.15, y = 1.55 + Math.floor(i / 2) * 2.5;
    iconCard(s, x, y, 5.95, 2.3, ic, t, b, { size: 15, tsize: 18 });
  });
  src(s, "Sources: [24] Mindemark 2018 · [31] Singh et al. 2007; other routes are common laboratory practice.");
  s.addNotes("If your target composition is salt-rich, a supported or reinforced film is usually the realistic route.");
}

// ====================================================================
// SECTION 7b — Measuring films
pres.addSection({ title: "Measuring films" });
{
  const s = newSlide("Measuring films");
  tag(s, "08 · MEASURING FILMS");
  s.addText("Toolkit for checking your own PEO–LiTFSI films", { placeholder: "title" });
  const items = [
    ["ic_dsc", "DSC", "Tg, Tm, crystallinity, thermal history [16, 17, 26]"],
    ["ic_eis", "Impedance (EIS)", "σ(T) with blocking electrodes; VTF fits [7]"],
    ["ic_nmr", "PFG-NMR", "D(⁷Li), D(¹⁹F) → NMR transference number [8, 21]"],
    ["ic_raman", "FTIR / Raman", "free vs paired TFSI⁻; Li⁺–O coordination [9]"],
    ["ic_scatter", "Diffraction", "crystal and liquid structure [10, 12, 14]"],
    ["ic_md", "MD simulation", "coordination and transport mechanisms [18, 19]"],
  ];
  items.forEach(([ic, t, d], i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.7 + Math.floor(i / 3) * 2.35;
    card(s, x, y, 3.9, 2.05);
    fig(s, ic, x + 0.25, y + 0.3, 1.0, 1.0);
    s.addText(t, { x: x + 1.45, y: y + 0.3, w: 2.3, h: 0.5, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(d, { x: x + 1.45, y: y + 0.82, w: 2.3, h: 1.2, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  });
  src(s, "Sources: [7] Lascaud 1994 · [8] Gorecki 1995 · [9] Wen 1996 · [10] Andreev 1996 · [12] MacGlashan 1999 · [14] Mao 2000 · [16, 17] Edman 2000 · [18] Borodin 2006 · [19] Diddens 2010 · [21] Timachova 2015 · [26] Marzantowicz 2006");
  s.addNotes("Minimum set for a new film: DSC (state of the film), EIS (conductivity vs temperature), and either Bruce–Vincent or PFG-NMR for transference.");
}

{
  const s = newSlide("Measuring films");
  tag(s, "08 · MEASURING FILMS");
  s.addText("Measuring conductivity by EIS: cell and protocol", { placeholder: "title" });
  fig(s, "eiscell", 0.5, 1.5, 6.3);
  const steps = [
    ["Measure L", "micrometer at ≥ 5 points (± 1–2 µm), or set L with a spacer ring"],
    ["Assemble in Ar", "SS | film in insulating ring | SS in a CR2032 cell; record contact area A"],
    ["Condition", "hold ~1 h at 80 °C (above Tm) so the film wets the steel, then cool"],
    ["Scan", "10 mV AC at open circuit, 1 MHz → 1 Hz; 30–60 min at each temperature"],
    ["Sweep T", "e.g. 20 → 90 °C and back in 10 °C steps; keep heating and cooling apart"],
    ["Fit & compute", "Rb from the equivalent-circuit fit → σ = L / (Rb · A)"],
  ];
  steps.forEach(([h, d], i) => {
    const y = 1.5 + i * 0.83;
    s.addShape(pres.shapes.OVAL, { x: 7.15, y: y + 0.04, w: 0.46, h: 0.46, fill: { color: C.accent1 }, line: { type: "none" } });
    s.addText(String(i + 1), { x: 7.15, y: y + 0.04, w: 0.46, h: 0.46, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText([
      { text: h, options: { bold: true, color: C.text2, breakLine: true } },
      { text: d, options: { fontSize: 14, color: C.text1 } },
    ], { x: 7.8, y, w: 4.9, h: 0.78, fontSize: 16, valign: "top", margin: 0, isTextBox: true });
  });
  src(s, "Common practice for blocking-electrode measurements; Li | SPE | Li cells measure interfacial resistance, not bulk σ. Arrhenius/VTF analysis as in [7, 16].");
  s.addNotes("Blocking electrodes such as stainless steel stop Li+ from crossing the interface, so the impedance shows a clean bulk semicircle followed by a capacitive spike. The insulating ring fixes both the area and the thickness, which are the two numbers that convert resistance into conductivity. Condition the cell above the PEO melting point first so the film makes good contact.");
}
{
  const s = newSlide("Measuring films");
  tag(s, "08 · MEASURING FILMS");
  s.addText("Reading the Nyquist plot", { placeholder: "title" });
  fig(s, "nyquist", 0.5, 1.45, 6.6);
  card(s, 7.4, 1.5, 5.3, 1.95, C.background2);
  s.addText([
    { text: "σ = L / (Rb · A)", options: { bold: true, fontFace: THEME.headFontFace, fontSize: 24, color: C.text2, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Example: L = 150 µm, A = 2.01 cm² (Ø 16 mm), Rb = 75 Ω → σ = 0.015 / (75 × 2.01) ≈ 1.0 × 10⁻⁴ S cm⁻¹" },
  ], { x: 7.6, y: 1.6, w: 4.9, h: 1.75, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  bullets(s, [
    [{ text: "Rb ", bold: true, color: C.accent2 }, { text: "= low-frequency end of the arc, i.e. where the spike starts" }],
    [{ text: "Hot or thin films: ", bold: true, color: C.accent1 }, { text: "the arc moves above 1 MHz; take the real-axis intercept of the spike" }],
    [{ text: "Sanity check: ", bold: true, color: C.accent3 }, { text: "bulk capacitance ≈ ε₀εᵣA/L ≈ 10⁻¹¹–10⁻¹⁰ F; ~10⁻⁶ F means double layer, not bulk [40]" }],
    [{ text: "A second arc ", bold: true, color: C.accent4 }, { text: "usually means poor contact or a resistive surface layer" }],
  ], 7.4, 3.7, 5.3, 2.9, { size: 15 });
  src(s, "Sources: [40] Irvine, Sinclair & West 1990 (capacitance ranges). Plot is schematic.");
  s.addNotes("With blocking electrodes the equivalent circuit is a bulk resistance in parallel with a constant-phase element for the geometric capacitance, in series with a second constant-phase element for the electrode double layer. The bulk resistance is read where the semicircle meets the spike, or obtained from a fit. Check the fitted capacitance: for a 150 µm film of 2 cm², with relative permittivity about 8, it should be around 1e-10 F.");
}
{
  const s = newSlide("Measuring films");
  tag(s, "08 · MEASURING FILMS");
  s.addText("Getting EIS conductivity right", { placeholder: "title" });
  const items = [
    ["ic_ruler", "Thickness is the biggest error", [{ text: "σ ∝ L: ±5 µm on a 20 µm film is ±25%. Use a spacer and re-measure after heating — PEO creeps above Tm." }]],
    ["ic_press", "Contact and conditioning", [{ text: "Anneal ~1 h at 80 °C before the first scan; a second arc often means poor contact." }]],
    ["ic_clock", "Thermal history", [{ text: "Hold 30–60 min per step; heating and cooling curves differ because PEO recrystallises slowly [17]." }]],
    ["ic_cable", "Leads and instrument", [{ text: "Run short/open calibration; keep Rb well above lead resistance and away from MHz inductive artefacts." }]],
    ["ic_water", "Moisture", [{ text: "Assemble and seal in Ar; absorbed water raises σ artificially." }]],
    ["ic_eis", "Report it fully", [{ text: "≥ 3 cells; σ(T) as Arrhenius/VTF; state L, A, frequency range, amplitude and thermal protocol." }]],
  ];
  items.forEach(([ic, t, b], i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.55 + Math.floor(i / 3) * 2.55;
    iconCard(s, x, y, 3.9, 2.35, ic, t, b, { size: 14, tsize: 16 });
  });
  src(s, "Common practice for blocking-electrode EIS of polymer electrolytes; [17] Edman, Ferry & Doeff 2000.");
  s.addNotes("Most published conductivity scatter comes from thickness, contact and thermal history. For thin films, the bulk resistance can fall to around one ohm, which is comparable to lead and contact resistance — another reason to use thicker samples for conductivity.");
}
{
  const s = newSlide("Measuring films");
  tag(s, "08 · MEASURING FILMS");
  s.addText("What is an ideal film thickness?", { placeholder: "title" });
  fig(s, "thickscale", 0.6, 1.4, 12.1);
  s.addText("Thickness that gives a target electrolyte ASR (L = ASR × σ)", { x: 0.6, y: 4.6, w: 6.4, h: 0.35, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true });
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 14, align: "center", valign: "middle" } });
  const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 14, color: C.text1, align: "center", valign: "middle" }, o) });
  s.addTable([
    [hdr("σ / S cm⁻¹"), hdr("ASR 2 Ω cm²"), hdr("ASR 10 Ω cm²"), hdr("ASR 50 Ω cm²")],
    [cell("10⁻⁵"), cell("0.2 µm"), cell("1 µm"), cell("5 µm")],
    [cell("10⁻⁴"), cell("2 µm"), cell("10 µm", { bold: true, color: C.accent1 }), cell("50 µm")],
    [cell("10⁻³"), cell("20 µm", { bold: true, color: C.accent1 }), cell("100 µm"), cell("500 µm")],
  ], { x: 0.6, y: 5.0, w: 6.4, colW: [1.6, 1.6, 1.6, 1.6], rowH: 0.38, border: { type: "solid", pt: 0.75, color: HEX.line }, fill: { color: "FFFFFF" }, margin: [0.02, 0.06, 0.02, 0.06], objectName: "thickness-table" });
  bullets(s, [
    [{ text: "No single answer: ", bold: true, color: C.accent2 }, { text: "choose by purpose" }],
    [{ text: "Battery: ", bold: true, color: C.accent1 }, { text: "aim for 10–20 µm; free-standing PEO that thin usually needs a scaffold [39]" }],
    [{ text: "Thinner is riskier: ", bold: true, color: C.accent4 }, { text: "pinholes, shorts and soft-film creep; membrane thickness affects rapid cell failure [29]" }],
    [{ text: "For σ by EIS: ", bold: true, color: C.accent3 }, { text: "100–300 µm keeps thickness error ~1% and Rb well above lead resistance" }],
  ], 7.4, 4.6, 5.3, 2.0, { size: 14 });
  src(s, "Ranges are typical working values; ASR table computed from L = ASR·σ. Sources: [29] Homann 2020 · [39] Wan 2019.");
  s.addNotes("A liquid cell with a separator has an electrolyte ASR of roughly 1–2 ohm cm2. To match that at room temperature with 1e-4 S/cm you would need about 2 µm, which is unrealistic, so practical solid cells either run warm (1e-3 S/cm, 20 µm gives 2 ohm cm2) or accept around 10 ohm cm2 with a 10 µm supported film. For conductivity measurements, use thick films so that thickness errors and lead resistance are small.");
}

// ====================================================================
// SECTION 8 — Wrap-up
pres.addSection({ title: "Wrap-up" });
{
  const s = newSlide("Wrap-up", "DARK_CONTENT");
  s.addText("Takeaways", { placeholder: "title" });
  const pts = [
    ["Why it dissolves", "~5 ether O per Li⁺ outweigh the small lattice energy of LiTFSI; entropy pushes back."],
    ["What forms", "6:1, 3:1 and 2:1 complexes; EO:Li ≈ 6–12 is often amorphous because crystallisation is slow."],
    ["How much", "One amorphous phase up to r ≈ 0.28; solubility limit r = 0.50 (EO:Li = 2)."],
    ["Why it falls short", "Low RT σ, t₊ ≈ 0.1–0.3, soft above 65 °C, ~4 V oxidation, Al corrosion."],
    ["Closing the gap", "Target ≥ 10⁻⁴ S cm⁻¹ at RT in a 10–20 µm film with higher t₊ — judge by ASR, not σ alone."],
    ["Good films", "High-Mw PEO, EO:Li 16–20, clean baked mould, dry everything, slow evaporation, age before peeling."],
    ["Measure right", "SS | SPE | SS, σ = L/(Rb·A) with 100–300 µm samples; battery films 10–20 µm, supported."],
  ];
  pts.forEach(([h, b], i) => {
    const y = 1.45 + i * 0.75;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.05, w: 0.6, h: 0.6, fill: { color: [C.accent1, C.accent2, C.accent3, C.accent4, C.accent1, C.accent5, C.accent3][i] }, line: { type: "none" } });
    s.addText(String(i + 1), { x: 0.6, y: y + 0.05, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(h, { x: 1.45, y: y + 0.05, w: 3.3, h: 0.6, fontSize: 19, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true });
    s.addText(b, { x: 4.8, y: y + 0.05, w: 7.9, h: 0.6, fontSize: 16, color: "DCE5EF", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addNotes("Summary of the deck in five lines.");
}

const REFS = [
  "Fenton, D. E.; Parker, J. M.; Wright, P. V. Complexes of alkali metal ions with poly(ethylene oxide). Polymer 1973, 14, 589.",
  "Armand, M. B.; Chabagno, J. M.; Duclot, M. J. Poly-ethers as solid electrolytes. In Fast Ion Transport in Solids; Vashishta, P. et al., Eds.; North-Holland, 1979, 131–136.",
  "Berthier, C.; Gorecki, W.; Minier, M.; Armand, M. B.; Chabagno, J. M.; Rigaud, P. Microscopic investigation of ionic conductivity in alkali metal salts–poly(ethylene oxide) adducts. Solid State Ionics 1983, 11, 91–95.",
  "Ratner, M. A.; Shriver, D. F. Ion transport in solvent-free polymers. Chem. Rev. 1988, 88, 109–124.",
  "Armand, M.; Gorecki, W.; Andréani, R. In Second International Symposium on Polymer Electrolytes; Scrosati, B., Ed.; Elsevier Applied Science, 1990, p 91.",
  "Vallée, A.; Besner, S.; Prud'homme, J. Comparative study of PEO electrolytes made with LiN(CF₃SO₂)₂, LiCF₃SO₃ and LiClO₄. Electrochim. Acta 1992, 37, 1579–1583.",
  "Lascaud, S.; Perrier, M.; Vallée, A.; Besner, S.; Prud'homme, J.; Armand, M. Phase diagrams and conductivity behavior of poly(ethylene oxide)–molten salt rubbery electrolytes. Macromolecules 1994, 27, 7469–7477.",
  "Gorecki, W.; Jeannin, M.; Belorizky, E.; Roux, C.; Armand, M. Physical properties of solid polymer electrolyte PEO(LiTFSI) complexes. J. Phys.: Condens. Matter 1995, 7, 6823–6832.",
  "Wen, S. J.; Richardson, T. J.; Ghantous, D. I.; Striebel, K. A.; Ross, P. N.; Cairns, E. J. FTIR characterization of PEO + LiN(CF₃SO₂)₂ electrolytes. J. Electroanal. Chem. 1996, 408, 113–118.",
  "Andreev, Y. G.; Lightfoot, P.; Bruce, P. G. Structure of the polymer electrolyte poly(ethylene oxide)₃:LiN(SO₂CF₃)₂ determined by powder diffraction. Chem. Commun. 1996, 2169–2170.",
  "Lightfoot, P.; Mehta, M. A.; Bruce, P. G. Crystal structure of the polymer electrolyte poly(ethylene oxide)₃:LiCF₃SO₃. Science 1993, 262, 883–885.",
  "MacGlashan, G. S.; Andreev, Y. G.; Bruce, P. G. Structure of the polymer electrolyte poly(ethylene oxide)₆:LiAsF₆. Nature 1999, 398, 792–794.",
  "Gadjourova, Z.; Andreev, Y. G.; Tunstall, D. P.; Bruce, P. G. Ionic conductivity in crystalline polymer electrolytes. Nature 2001, 412, 520–523.",
  "Mao, G.; Saboungi, M.-L.; Price, D. L.; Armand, M. B.; Howells, W. S. Structure of liquid PEO–LiTFSI electrolyte. Phys. Rev. Lett. 2000, 84, 5536–5539.",
  "Mao, G.; Perea, R. F.; Howells, W. S.; Price, D. L.; Saboungi, M.-L. Relaxation in polymer electrolytes on the nanosecond timescale. Nature 2000, 405, 163–165.",
  "Edman, L.; Doeff, M. M.; Ferry, A.; Kerr, J.; De Jonghe, L. C. Transport properties of the solid polymer electrolyte system P(EO)ₙLiTFSI. J. Phys. Chem. B 2000, 104, 3476–3480.",
  "Edman, L.; Ferry, A.; Doeff, M. M. Slow recrystallization in the polymer electrolyte system poly(ethylene oxide)ₙ–LiN(CF₃SO₂)₂. J. Mater. Res. 2000, 15, 1950–1954.",
  "Borodin, O.; Smith, G. D. Mechanism of ion transport in amorphous poly(ethylene oxide)/LiTFSI from molecular dynamics simulations. Macromolecules 2006, 39, 1620–1629.",
  "Diddens, D.; Heuer, A.; Borodin, O. Understanding the lithium transport within a Rouse-based model for a PEO/LiTFSI polymer electrolyte. Macromolecules 2010, 43, 2028–2036.",
  "Evans, J.; Vincent, C. A.; Bruce, P. G. Electrochemical measurement of transference numbers in polymer electrolytes. Polymer 1987, 28, 2324–2328.",
  "Timachova, K.; Watanabe, H.; Balsara, N. P. Effect of molecular weight and salt concentration on ion transport and the transference number in polymer electrolytes. Macromolecules 2015, 48, 7882–7888.",
  "Pesko, D. M.; Timachova, K.; Bhattacharya, R.; Smith, M. C.; Villaluenga, I.; Newman, J.; Balsara, N. P. Negative transference numbers in poly(ethylene oxide)-based electrolytes. J. Electrochem. Soc. 2017, 164, E3569–E3575.",
  "Xue, Z.; He, D.; Xie, X. Poly(ethylene oxide)-based electrolytes for lithium-ion batteries. J. Mater. Chem. A 2015, 3, 19218–19253.",
  "Mindemark, J.; Lacey, M. J.; Bowden, T.; Brandell, D. Beyond PEO—Alternative host materials for Li⁺-conducting solid polymer electrolytes. Prog. Polym. Sci. 2018, 81, 114–143.",
  "Johansson, P.; Gejji, S. P.; Tegenfeldt, J.; Lindgren, J. The imide ion: potential energy surface and geometries. Electrochim. Acta 1998, 43, 1375–1379.",
  "Marzantowicz, M.; Dygas, J. R.; Krok, F.; Nowiński, J. L.; Tomaszewska, A.; Florjańczyk, Z.; Zygadło-Monikowska, E. Crystalline phases, morphology and conductivity of PEO:LiTFSI electrolytes in the eutectic region. J. Power Sources 2006, 159, 420–430.",
  "Grundy, L. S. et al.; Balsara, N. P. Electrochemical characterization of PEO/LiTFSI electrolytes near the solubility limit. Macromolecules 2022, 55, 9030–9038.",
  "Monroe, C.; Newman, J. The impact of elastic deformation on deposition kinetics at lithium/polymer interfaces. J. Electrochem. Soc. 2005, 152, A396–A404.",
  "Homann, G.; Stolz, L.; Nair, J.; Laskovic, I. C.; Winter, M.; Kasnatscheew, J. Poly(ethylene oxide)-based electrolyte for solid-state lithium batteries with high-voltage positive electrodes: evaluating the role of electrolyte oxidation in rapid cell failure. Sci. Rep. 2020, 10, 4390.",
  "Krause, L. J.; Lamanna, W.; Summerfield, J.; Engle, M.; Korba, G.; Loch, R.; Atanasoski, R. Corrosion of aluminum at high voltages in non-aqueous electrolytes containing perfluoroalkylsulfonyl imides. J. Power Sources 1997, 68, 320–325.",
  "Singh, M.; Odusanya, O.; Wilmes, G. M.; et al.; Balsara, N. P. Effect of molecular weight on the mechanical and electrical properties of block copolymer electrolytes. Macromolecules 2007, 40, 4578–4585.",
  "Zhang, H.; Li, C.; Piszcz, M.; Coya, E.; Rojo, T.; Rodriguez-Martinez, L. M.; Armand, M.; Zhou, Z. Single lithium-ion conducting solid polymer electrolytes: advances and perspectives. Chem. Soc. Rev. 2017, 46, 797–815.",
  "Croce, F.; Appetecchi, G. B.; Persi, L.; Scrosati, B. Nanocomposite polymer electrolytes for lithium batteries. Nature 1998, 394, 456–458.",
  "Angell, C. A.; Liu, C.; Sanchez, E. Rubbery solid electrolytes with dominant cationic transport and high ambient conductivity. Nature 1993, 362, 137–139.",
  "Shin, J.-H.; Henderson, W. A.; Passerini, S. Ionic liquids to the rescue? Overcoming the ionic conductivity limitations of polymer electrolytes. Electrochem. Commun. 2003, 5, 1016–1020.",
  "Fu, K. K.; Gong, Y.; Dai, J.; et al.; Hu, L. Flexible, solid-state, ion-conducting membrane with 3D garnet nanofiber networks for lithium batteries. Proc. Natl. Acad. Sci. USA 2016, 113, 7094–7099.",
  "Bouchet, R.; Maria, S.; Meziane, R.; et al.; Armand, M. Single-ion BAB triblock copolymers as highly efficient electrolytes for lithium-metal batteries. Nat. Mater. 2013, 12, 452–457.",
  "Zhao, Q.; Liu, X.; Stalin, S.; Khan, K.; Archer, L. A. Solid-state polymer electrolytes with in-built fast interfacial transport for secondary lithium batteries. Nat. Energy 2019, 4, 365–373.",
  "Wan, J.; Xie, J.; Kong, X.; et al.; Cui, Y. Ultrathin, flexible, solid polymer composite electrolyte enabled with aligned nanoporous host for lithium batteries. Nat. Nanotechnol. 2019, 14, 705–711.",
  "Irvine, J. T. S.; Sinclair, D. C.; West, A. R. Electroceramics: characterization by impedance spectroscopy. Adv. Mater. 1990, 2, 132–138.",
];
const per = Math.ceil(REFS.length / 3);
[[0, per], [per, 2 * per], [2 * per, REFS.length]].forEach(([a, b], k) => {
  const s = newSlide("Wrap-up");
  tag(s, "REFERENCES");
  s.addText(`References (${k + 1}/3)`, { placeholder: "title" });
  const runs = REFS.slice(a, b).map((r, i) => ({ text: `[${a + i + 1}]  ${r}`, options: { breakLine: i < b - a - 1, paraSpaceAfter: 4 } }));
  s.addText(runs, { x: 0.6, y: 1.45, w: 12.1, h: 5.45, fontSize: 12, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "reference-list" });
  s.addNotes("Full citation list. Schematic figures in this deck are redrawn qualitatively from the cited papers and are not to scale.");
});

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  fs.writeFileSync("svg_map.json", JSON.stringify(svgMap, null, 1));
  console.log("wrote", OUT, Object.keys(svgMap).length, "figures");
})();
