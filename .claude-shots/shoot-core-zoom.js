const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(4000);
  await page.locator("#problem").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const box = await page.locator("#problem").boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2 + 40;
  await page.screenshot({
    path: ".claude-shots/core-zoom.png",
    clip: { x: cx - 260, y: cy - 220, width: 520, height: 440 },
  });
  await browser.close();
  console.log("done");
})();
