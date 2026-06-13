const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(9000);

  // Get the exact bottom boundary of the problem section
  const bounds = await page.evaluate(() => {
    const sec = document.querySelector("#problem");
    if (!sec) return null;
    const r = sec.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, height: r.height };
  });
  if (!bounds) throw new Error("problem section not found");

  // Screenshot a 500px window centred on the bottom edge of the section
  const clipY = Math.max(0, bounds.bottom - 350);
  await page.evaluate((y) => window.scrollTo(0, y - 200), clipY);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: ".claude-shots/problem-bottom.png" });
  await browser.close();
  console.log("done — problem section bottom:", bounds.bottom, "height:", bounds.height);
})();
