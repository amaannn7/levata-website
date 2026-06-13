const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(9000);

  const bounds = await page.evaluate(() => {
    const sec = document.querySelector("#problem");
    const r = sec.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  });

  await page.evaluate((y) => window.scrollTo(0, y), bounds.top - 50);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: ".claude-shots/problem-full.png", clip: { x: 0, y: 0, width: 1440, height: Math.min(900, bounds.height + 60) } });
  // Also get height info
  console.log("section height:", bounds.height);
  await browser.close();
})();
