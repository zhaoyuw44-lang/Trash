// Fit English labels into the figures of ionic-conductivity-ref620-en.html.
// English runs wider than Chinese. For every <text> in every figure, compare the English width with the
// room the Chinese label had (up to the next label on the same line, its panel edge or the figure edge),
// and shrink the font only as much as needed (never below MIN_SCALE). Labels still too wide, outside the
// figure, or newly overlapping another label are listed so their wording can be shortened.
// Run from the repository root after `python3 ionic-conductivity-svg/build_steps.py --en`:
//   node ionic-conductivity-svg/en/fit_en.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ZH = path.join(ROOT, 'ionic-conductivity-ref620.html');
const EN = path.join(ROOT, 'ionic-conductivity-ref620-en.html');
const MIN_SCALE = 0.78;
const FIG = /<svg\b[^>]*\brole="img"[^>]*>[\s\S]*?<\/svg>/g;
const TEXT = /<text\b[^>]*>[\s\S]*?<\/text>/g;

const figsOf = s => s.match(FIG) || [];
const sizesOf = block => [...block.matchAll(/font-size="([\d.]+)"/g)].map(m => +m[1]);

async function measure(page, baseSizes) {
  return page.evaluate(({ baseSizes, MIN_SCALE }) => {
    const figs = [...document.querySelectorAll('svg[role="img"]')];
    return figs.map((svg, i) => {
      const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect();
      const k = vb.width / sr.width;
      const box = el => { const r = el.getBoundingClientRect();
        return { l: (r.left - sr.left) * k, r: (r.right - sr.left) * k, t: (r.top - sr.top) * k, b: (r.bottom - sr.top) * k }; };
      const texts = [...svg.querySelectorAll('text')];
      if (baseSizes && baseSizes[i]) texts.forEach((t, j) => {
        const sz = baseSizes[i][j]; if (!sz || !sz.length) return;
        const els = [t, ...t.querySelectorAll('tspan[font-size]')];
        if (!t.hasAttribute('font-size')) els.shift();
        els.forEach((e, n) => { if (sz[n] != null) e.setAttribute('font-size', sz[n]); });
      });
      return { w: vb.width, h: vb.height, label: (svg.getAttribute('aria-label') || '').slice(0, 50),
        texts: texts.map(t => ({ ...box(t), a: t.getAttribute('text-anchor') || 'start', s: t.textContent })),
        rects: [...svg.querySelectorAll('rect')].map(box) };
    });
  }, { baseSizes, MIN_SCALE });
}

(async () => {
  let zhSrc = fs.readFileSync(ZH, 'utf8'), enSrc = fs.readFileSync(EN, 'utf8');
  const zhFigs = figsOf(zhSrc), enFigs = figsOf(enSrc);
  if (zhFigs.length !== enFigs.length) throw new Error(`figure count differs: zh ${zhFigs.length}, en ${enFigs.length}`);
  // base font sizes per figure / text / [text, tspan…] from the Chinese source
  const base = zhFigs.map(f => (f.match(TEXT) || []).map(sizesOf));

  const browser = await chromium.launch();
  const open = async file => { const p = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await p.goto('file://' + file); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400); return p; };
  const zp = await open(ZH), ep = await open(EN);
  const Z = await measure(zp, null), E = await measure(ep, base);

  const issues = [], scales = [];
  E.forEach((fe, i) => {
    const fz = Z[i]; scales[i] = [];
    if (!fz || fz.texts.length !== fe.texts.length || (zhFigs[i].match(TEXT) || []).length !== fz.texts.length) { scales[i] = null; return; }
    fe.texts.forEach((te, j) => {
      const tz = fz.texts[j], wz = tz.r - tz.l, we = te.r - te.l;
      const cont = fz.rects.filter(r => r.l <= tz.l + 1 && r.r >= tz.r - 1 && r.t <= tz.t + 1 && r.b >= tz.b - 1)
        .sort((a, b) => (a.r - a.l) * (a.b - a.t) - (b.r - b.l) * (b.b - b.t))[0];
      let L = cont ? Math.max(cont.l + 4, 2) : 2, R = cont ? Math.min(cont.r - 4, fz.w - 2) : fz.w - 2;
      fz.texts.forEach((o, n) => {
        if (n === j || o.t >= tz.b - 1 || o.b <= tz.t + 1) return;
        if (o.l >= tz.r - 1) R = Math.min(R, o.l - 5);
        if (o.r <= tz.l + 1) L = Math.max(L, o.r + 5);
      });
      const cx = (tz.l + tz.r) / 2;
      let room = te.a === 'middle' ? 2 * Math.min(cx - L, R - cx) : te.a === 'end' ? tz.r - L : R - tz.l;
      room = Math.max(room, wz);
      let sc = we > room ? room / we : 1;
      if (sc < MIN_SCALE) { issues.push({ fig: i, label: fe.label, text: te.s, why: `needs ${(sc * 100).toFixed(0)} %` }); sc = MIN_SCALE; }
      scales[i][j] = Math.floor(sc * 100) / 100;
    });
  });

  // write scaled sizes into the English source
  let n = 0;
  const outFigs = enFigs.map((f, i) => {
    if (!scales[i]) return f;
    let j = -1;
    return f.replace(TEXT, block => {
      j++; const sc = scales[i][j], b = base[i][j];
      if (sc == null || !b || !b.length) return block;
      let m = -1;
      if (sc < 1) n++;
      return block.replace(/font-size="([\d.]+)"/g, (all) => { m++; return b[m] == null ? all : `font-size="${+(b[m] * sc).toFixed(1)}"`; });
    });
  });
  let idx = -1;
  enSrc = enSrc.replace(FIG, () => outFigs[++idx]);
  fs.writeFileSync(EN, enSrc);

  // re-measure and report what still collides
  await ep.reload(); await ep.evaluate(() => document.fonts.ready); await ep.waitForTimeout(400);
  const E2 = await measure(ep, null);
  E2.forEach((fe, i) => {
    const fz = Z[i]; if (!fz || fz.texts.length !== fe.texts.length) return;
    fe.texts.forEach((t, j) => {
      if (t.l < 0 || t.r > fe.w || t.t < 0 || t.b > fe.h) issues.push({ fig: i, label: fe.label, text: t.s, why: 'outside figure' });
      for (let n = j + 1; n < fe.texts.length; n++) {
        const o = fe.texts[n], zo = fz.texts[n], zt = fz.texts[j];
        const hit = (a, b) => a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1;
        if (hit(t, o) && !hit(zt, zo)) issues.push({ fig: i, label: fe.label, text: `${t.s} ✕ ${o.s}`, why: 'overlap' });
      }
    });
  });
  fs.writeFileSync(path.join(__dirname, 'fit_report.json'), JSON.stringify(issues, null, 1));
  console.log(`figures ${E.length}; labels shrunk ${n}; issues ${issues.length} (see en/fit_report.json)`);
  await browser.close();
})();
