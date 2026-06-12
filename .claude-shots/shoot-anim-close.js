const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/products/automation-systems", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(7000);
  const box = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("svg")).find((s) => s.textContent.includes("NO AUTOMATION"));
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    return true;
  });
  if (!box) throw new Error("visual not found");
  await page.waitForTimeout(3000);
  const rect = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("svg")).find((s) => s.textContent.includes("NO AUTOMATION"));
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.screenshot({ path: ".claude-shots/anim-close-a.png", clip: rect });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: ".claude-shots/anim-close-b.png", clip: rect });
  await browser.close();
  console.log("done");
})();
