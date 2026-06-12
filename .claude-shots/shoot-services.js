const { chromium } = require("playwright");

const PAGES = [
  ["ai", "/products/ai-intelligence"],
  ["pe", "/products/product-engineering"],
  ["di", "/products/digital-infrastructure"],
  ["as", "/products/automation-systems"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [name, path] of PAGES) {
    await page.goto("http://localhost:3001" + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const height = await page.evaluate(() => document.body.scrollHeight);
    const tiles = Math.min(Math.ceil(height / 900), 10);
    for (let i = 0; i < tiles; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * 900);
      await page.waitForTimeout(900);
      await page.screenshot({ path: `.claude-shots/${name}-${String(i).padStart(2, "0")}.png` });
    }
    console.log(`${name}: ${tiles} tiles (height ${height})`);
  }
  await browser.close();
})();
