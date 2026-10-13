const { chromium } = require('playwright');
(async () => {
  const jobs = JSON.parse(process.argv[2]);
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: +(process.env.VW || 2100), height: 800 }, deviceScaleFactor: +(process.env.DPR || 1.25) })).newPage();
  for (const [svg, png] of jobs) {
    await p.goto('file://' + svg); await p.waitForTimeout(150);
    await p.screenshot({ path: png, omitBackground: true });
  }
  await b.close();
})();
