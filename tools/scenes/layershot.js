const { chromium } = require('playwright');
(async () => {
  const jobs = JSON.parse(process.argv[2]);
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1.5 })).newPage();
  for (const [svg, png] of jobs) {
    await p.goto('file://' + svg); await p.waitForTimeout(150);
    await p.screenshot({ path: png, omitBackground: true });
  }
  await b.close();
})();
