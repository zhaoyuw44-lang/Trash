// Write every figure of a figure module to <outDir>/<name>.svg and a 3x PNG next to it.
// Usage: node render_svgs.js <figs-module.js> <outDir> [name ...]
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

async function renderAll(modPath, outDir, only = []) {
  const figs = require(path.resolve(modPath));
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  const out = {};
  for (const [name, fn] of Object.entries(figs)) {
    if (only.length && !only.includes(name)) continue;
    const svg = fn();
    const svgPath = path.join(outDir, `${name}.svg`);
    fs.writeFileSync(svgPath, svg);
    const m = svg.match(/width="(\d+)" height="(\d+)"/);
    const w = +m[1], h = +m[2];
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    const pngPath = path.join(outDir, `${name}.png`);
    await page.locator("svg").screenshot({ path: pngPath, omitBackground: true });
    out[name] = { svg: svgPath, png: pngPath, w, h };
  }
  await browser.close();
  return out;
}

module.exports = { renderAll };

if (require.main === module) {
  const [mod, outDir, ...only] = process.argv.slice(2);
  renderAll(mod, outDir, only).then((r) => console.log(Object.keys(r).join("\n")));
}
