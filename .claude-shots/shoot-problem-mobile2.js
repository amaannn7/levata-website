const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const box = await page.locator("#problem").evaluate((el) => ({ top: el.offsetTop, h: el.offsetHeight }));
  // Scroll in steps so whileInView fires, ending with section bottom at viewport bottom
  const target = box.top + box.h - 844;
  for (let s = box.top; s < target; s += 400) {
    await page.evaluate((p) => window.scrollTo(0, p), s);
    await page.waitForTimeout(500);
  }
  await page.evaluate((p) => window.scrollTo(0, p), target);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: ".claude-shots/problem-mobile-bottom.png" });
  await browser.close();
  console.log("done");
})();
