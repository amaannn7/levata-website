const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'C:/Users/USER/Documents/levatahero/.claude-shots/hero-full.png', fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
