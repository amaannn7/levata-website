const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(3500);
  const sectionTop = await page.evaluate(() => {
    for (const s of document.querySelectorAll('section')) {
      if (s.textContent && s.textContent.includes('Why teams pick Levata'))
        return s.getBoundingClientRect().top + window.scrollY;
    }
    return 0;
  });
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/USER/Documents/levatahero/.claude-shots/why-static.png' });
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
