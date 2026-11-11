// Export the step illustrations, the wiring / cross-section diagrams, the coin-cell figures and the after-test steps of
// ionic-conductivity-ref620.html as standalone SVG files with inlined colours.
// Run from the repository root:  node ionic-conductivity-svg/export_svgs.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGE = 'file://' + path.join(ROOT, 'ionic-conductivity-ref620.html');
const OUT = __dirname;
const NAMES = [
  'step-01-instrument-ready', 'step-02-measure-L-and-A', 'step-03-assemble-cell',
  'step-04-short-check', 'step-05-temperature', 'step-06-eis-setup',
  'step-07-running', 'step-08-read-Rb', 'step-09-calculate-sigma',
];
const PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap',
  'stroke-linejoin', 'opacity', 'font-family', 'font-size', 'font-weight'];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ colorScheme: 'light' });
  await page.goto(PAGE);
  await page.waitForTimeout(500);
  const svgs = await page.evaluate((PROPS) => {
    const bg = getComputedStyle(document.body).getPropertyValue('--surface').trim() || '#FFFFFF';
    const pick = [...document.querySelectorAll('#steps .stepfig svg'), document.querySelector('#wire svg'), document.querySelector('#cell svg'),
      ...document.querySelectorAll('#coin .figsvg svg'), ...document.querySelectorAll('#after .stepfig svg')];
    return pick.map(svg => {
      const clone = svg.cloneNode(true);
      const src = [svg, ...svg.querySelectorAll('*')];
      const dst = [clone, ...clone.querySelectorAll('*')];
      src.forEach((el, i) => {
        if (i === 0) return;
        const cs = getComputedStyle(el);
        const style = PROPS.map(p => `${p}:${cs.getPropertyValue(p)}`).join(';');
        dst[i].setAttribute('style', style);
        dst[i].removeAttribute('class');
      });
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const vb = svg.viewBox.baseVal;
      clone.setAttribute('width', vb.width);
      clone.setAttribute('height', vb.height);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%'); rect.setAttribute('height', '100%'); rect.setAttribute('fill', bg);
      clone.insertBefore(rect, clone.firstChild);
      return clone.outerHTML;
    });
  }, PROPS);
  const names = [...NAMES, 'wiring-two-electrode', 'cell-cross-section', 'coin-01-spectra-by-cell-type', 'coin-02-exploded-cr2032', 'coin-03-wiring',
    'after-01-unplug', 'after-02-record', 'after-03-inspect', 'after-04-route-by-type',
    'after-05-decrimp', 'after-06-check-membrane', 'after-07-sort-waste', 'after-08-clean-up'];
  svgs.forEach((s, i) => {
    const file = path.join(OUT, names[i] + '.svg');
    fs.writeFileSync(file, '<?xml version="1.0" encoding="UTF-8"?>\n' + s + '\n');
    console.log('wrote', path.relative(ROOT, file));
  });
  await browser.close();
})();
