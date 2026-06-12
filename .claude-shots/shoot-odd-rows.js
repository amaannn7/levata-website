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
    // First service row with the visual on the left (className contains order-2)
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll("div")).find(
        (d) => typeof d.className === "string" && d.className.includes("order-2") && d.className.includes("grid-cols-1")
      );
      if (el) el.scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `.claude-shots/oddrow-${name}.png` });
  }
  // Animation check: two frames of the automation problem visual
  await page.goto("http://localhost:3001/products/automation-systems", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(7000);
  await page.evaluate(() => {
    const el = document.querySelector("section .grid");
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: ".claude-shots/anim-frame-a.png" });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: ".claude-shots/anim-frame-b.png" });
  await browser.close();
  console.log("done");
})();
