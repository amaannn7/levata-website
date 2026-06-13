const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(3500);

  // Hero
  await page.screenshot({ path: 'C:/Users/USER/Documents/levatahero/.claude-shots/mob-1-hero.png', fullPage: false });

  // Scroll to each section
  const sections = [
    { label: 'mob-2-techstack', text: 'Tech Stack' },
    { label: 'mob-3-clients', text: 'Trusted by' },
    { label: 'mob-4-problem', text: 'scaling chaos' },
    { label: 'mob-5-solution', text: 'Solution' },
    { label: 'mob-6-services', text: 'Services' },
    { label: 'mob-7-featured', text: 'Featured Product' },
    { label: 'mob-8-numbers', text: 'By the Numbers' },
    { label: 'mob-9-testimonials', text: 'Testimonials' },
    { label: 'mob-10-why', text: 'Why teams pick' },
    { label: 'mob-11-footer', text: 'hello@levatahq' },
  ];

  for (const s of sections) {
    const top = await page.evaluate((txt) => {
      for (const el of document.querySelectorAll('section, footer')) {
        if (el.textContent && el.textContent.includes(txt))
          return el.getBoundingClientRect().top + window.scrollY;
      }
      return null;
    }, s.text);
    if (top !== null) {
      await page.evaluate((y) => window.scrollTo(0, y), top);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `C:/Users/USER/Documents/levatahero/.claude-shots/${s.label}.png`, fullPage: false });
    }
  }

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
