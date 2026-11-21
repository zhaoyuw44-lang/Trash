// Small QA helpers shared by the manthiram2017 chapter scripts (layout + SVG font-size checks).
const fs = require("fs");

function wrap(d) {
  const log = [];
  const fig = (s, name, box, o) => {
    const r = d.fig(s, name, box, o);
    const svg = fs.readFileSync(d.figInfo[name].svg, "utf8");
    const W = d.figInfo[name].w;
    const sizes = [...svg.matchAll(/<text [^>]*font-size="([\d.]+)"[^>]*>(.*?)<\/text>/g)]
      .filter((m) => m[2].replace(/<[^>]+>/g, "").replace(/\u200b/g, "").trim().length > 2)
      .map((m) => +m[1]);
    const minPx = Math.min(...sizes);
    const pt = (minPx * r.w) / W * 72;
    if (pt < 10.95) log.push(`[font] ${name}: min ${minPx}px -> ${pt.toFixed(1)} pt (placed w ${r.w.toFixed(2)}")`);
    if (r.y + r.h > 6.9) log.push(`[bottom] fig ${name}: ${(r.y + r.h).toFixed(2)}"`);
    return r;
  };
  const chk = (label, y) => {
    if (y > 6.88) log.push(`[bottom] ${label}: ${y.toFixed(2)}"`);
    return y;
  };
  const report = () => {
    if (log.length) console.log(log.join("\n"));
    else console.log("QA: no layout/font warnings");
  };
  return { fig, chk, report };
}

module.exports = { wrap };
