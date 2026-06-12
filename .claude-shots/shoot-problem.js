const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.locator("#problem").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: ".claude-shots/problem-new.png" });

  // Mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  await page.locator("#problem").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: ".claude-shots/problem-new-mobile.png" });

  await browser.close();
  console.log("done");
})();
