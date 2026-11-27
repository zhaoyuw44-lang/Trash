const fs = require("fs"), sharp = require("sharp");
const { figs } = require("./svgs.js");
fs.mkdirSync("svg", { recursive: true }); fs.mkdirSync("png", { recursive: true });
(async () => {
  for (const k of Object.keys(figs)) {
    const { w, svg } = figs[k]();
    fs.writeFileSync(`svg/${k}.svg`, svg);
    const target = k.startsWith("ic_") ? 360 : 2400;
    await sharp(Buffer.from(svg), { density: (72 * target) / w }).png().toFile(`png/${k}.png`);
  }
  console.log("done");
})();
