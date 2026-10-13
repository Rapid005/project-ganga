const { chromium } = require('playwright');
(async () => {
  const jobs = JSON.parse(process.argv[2]);
  const b = await chromium.launch();
  // one pixel per painting unit: sharp enough at laptop sizes, and light to download and decode
  const p = await (await b.newContext({ viewport: { width: 2100, height: 800 }, deviceScaleFactor: +(process.env.DPR || 1) })).newPage();
  for (const [svg, png, width] of jobs) {
    await p.setViewportSize({ width, height: 800 });
    await p.goto('file://' + svg); await p.waitForTimeout(150);
    await p.screenshot({ path: png, omitBackground: true });
  }
  await b.close();
})();
