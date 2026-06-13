const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(9000);
  // Scroll to the solution section heading
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("h2")).find(h => h.textContent.includes("We don't sell services"));
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(2000);
  // Scroll up a bit to capture the boundary between problem and solution
  await page.evaluate(() => window.scrollBy(0, -350));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: ".claude-shots/problem-solution-boundary.png" });
  await browser.close();
  console.log("done");
})();
