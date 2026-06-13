const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(9000);

  const bounds = await page.evaluate(() => {
    const sec = document.querySelector("#problem");
    if (!sec) return null;
    const r = sec.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
  });

  // Scroll so the bottom of the section is visible
  await page.evaluate((y) => window.scrollTo(0, y - 700), bounds.bottom);
  await page.waitForTimeout(1500);
  // Clip just the bottom-left quarter
  await page.screenshot({
    path: ".claude-shots/problem-bl.png",
    clip: { x: 0, y: 500, width: 720, height: 400 },
  });
  await browser.close();
  console.log("done");
})();
