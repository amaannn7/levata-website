const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(9000);

  const info = await page.evaluate(() => {
    const sec = document.querySelector("#problem");
    const spider = sec?.querySelector(".lg\\:block > div"); // ProblemSpider outer div
    const cards = sec?.querySelectorAll(".lg\\:block .absolute[style*='top']");
    const secR = sec?.getBoundingClientRect();
    const spiderR = spider?.getBoundingClientRect();
    let lowestCardBottom = 0;
    cards?.forEach(c => {
      const r = c.getBoundingClientRect();
      if (r.bottom > lowestCardBottom) lowestCardBottom = r.bottom;
    });
    return {
      secTop: secR?.top + window.scrollY,
      secBottom: secR?.bottom + window.scrollY,
      spiderTop: spiderR?.top + window.scrollY,
      spiderBottom: spiderR?.bottom + window.scrollY,
      lowestCardBottom: lowestCardBottom + window.scrollY,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
