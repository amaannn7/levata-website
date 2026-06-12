const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(9000);
  const deck = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h2"));
    const h = headings.find((el) => el.textContent.includes("Why teams pick Levata") && el.closest(".lg\\:block"));
    const d = h ? h.closest(".lg\\:block") : null;
    if (!d) return null;
    return { top: d.getBoundingClientRect().top + window.scrollY, height: d.offsetHeight };
  });
  if (!deck) throw new Error("deck not found");
  const shots = [
    ["entry", deck.top - 500],
    ["pinned", deck.top + deck.height / 2],
    ["exit", deck.top + deck.height - 450],
  ];
  for (const [name, y] of shots) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `.claude-shots/why-levata-${name}.png` });
  }
  await browser.close();
  console.log("done");
})();
