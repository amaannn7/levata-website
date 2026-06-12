const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(6000);
  const height = await page.evaluate(() => document.body.scrollHeight);
  const tiles = Math.min(Math.ceil(height / 900), 14);
  for (let i = 0; i < tiles; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 900);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `.claude-shots/full-${String(i).padStart(2, "0")}.png` });
  }
  console.log(`${tiles} tiles, height ${height}`);
  await browser.close();
})();
