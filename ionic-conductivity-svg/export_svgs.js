// Export the step illustrations, the wiring / cross-section diagrams, the coin-cell figures, the after-test steps, the PP-film, film-making, UV/plasticizer, calibration and electronic-conductivity figures of
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
      ...document.querySelectorAll('#coin .figsvg svg'), ...document.querySelectorAll('#after .stepfig svg'),
      ...document.querySelectorAll('#pp .figsvg svg'), ...document.querySelectorAll('#pp .stepfig svg'),
      ...document.querySelectorAll('#make .stepfig svg'),
      ...document.querySelectorAll('#calib .figsvg svg'), ...document.querySelectorAll('#calib .stepfig svg'),
      ...document.querySelectorAll('#econd .stepfig svg')];
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
  const names = [...NAMES, 'wiring-two-electrode', 'cell-cross-section', 'coin-01-spectra-by-cell-type', 'coin-02-exploded-cr2032', 'coin-03-wiring', 'coin-04-cable-accessories',
    'after-01-unplug', 'after-02-record', 'after-03-inspect', 'after-04-route-by-type',
    'after-05-decrimp', 'after-06-check-membrane', 'after-07-sort-waste', 'after-08-clean-up',
    'pp-01-identify', 'pp-02-dense-film-ring',
    'pp-step-01-punch-dry', 'pp-step-02-thickness', 'pp-step-03-assemble', 'pp-step-04-wetting',
    'pp-step-05-multilayer', 'pp-step-06-calculate',
    'make-01-target-size', 'make-02-choose-method', 'make-03-solution-cast', 'make-04-hot-press',
    'make-05-punch', 'make-06-weigh', 'make-07-transfer', 'make-08-in-situ-cure',
    'uv-01-formulate', 'uv-02-when-to-add-plasticizer', 'uv-03-degas', 'uv-04-fill-cover-cure',
    'uv-05-check-cure', 'uv-06-monitor-plasticizer',
    'cal-00-overview', 'cal-01-calibrate-instrument', 'cal-02-low-i-dc', 'cal-03-cable-capacitance', 'cal-04-temperature',
    'econd-01-calibration', 'econd-02-estimate-current', 'econd-03-blank-cell', 'econd-04-wiring-shield', 'econd-05-temperature', 'econd-06-eis-before', 'econd-07-choose-voltage', 'econd-08-ca-settings', 'econd-09-run-steady-state', 'econd-10-next-voltage', 'econd-11-eis-after', 'econd-12-calculate'];
  svgs.forEach((s, i) => {
    const file = path.join(OUT, names[i] + '.svg');
    fs.writeFileSync(file, '<?xml version="1.0" encoding="UTF-8"?>\n' + s + '\n');
    console.log('wrote', path.relative(ROOT, file));
  });
  await browser.close();
})();
