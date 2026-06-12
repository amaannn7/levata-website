const { chromium } = require("playwright");

const PAGES = [
  ["ai", "/products/ai-intelligence"],
  ["digital", "/products/digital-infrastructure"],
  ["product", "/products/product-engineering"],
  ["automation", "/products/automation-systems"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [name, route] of PAGES) {
    await page.goto(`http://localhost:3001${route}`, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(7000);
    // First two-column grid after the hero = problem section
    const grid = page.locator("section .grid.md\\:grid-cols-2, section .grid[class*='md:grid-cols-2']").first();
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    const section = grid.locator("xpath=ancestor::section[1]");
    await section.screenshot({ path: `.claude-shots/problem-${name}.png` });
  }
  await browser.close();
  console.log("done");
})();
