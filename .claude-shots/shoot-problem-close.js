const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.locator("#problem").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await page.locator("#problem").screenshot({ path: ".claude-shots/problem-close.png" });
  await browser.close();
  console.log("done");
})();
