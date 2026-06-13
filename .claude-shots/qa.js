// QA screenshot script — desktop 1440x900 + mobile 390x844
// Run: node .claude-shots/qa.js

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.resolve(__dirname);
const URL = "http://localhost:3001";

async function captureScrollshots(page, prefix, stepHeight) {
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  let scrollY = 0;
  let idx = 1;

  while (scrollY < totalHeight) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    // Short pause for animations to settle
    await page.waitForTimeout(400);

    const file = path.join(OUT_DIR, `${prefix}-${idx}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`  Saved ${file} (scrollY=${scrollY})`);

    scrollY += stepHeight;
    idx++;

    // Safety: don't go past total height
    if (scrollY >= totalHeight && scrollY - stepHeight < totalHeight - stepHeight) {
      // Final screenshot at exact bottom
      await page.evaluate((y) => window.scrollTo(0, y), totalHeight - stepHeight);
      await page.waitForTimeout(400);
      const lastFile = path.join(OUT_DIR, `${prefix}-${idx}.png`);
      await page.screenshot({ path: lastFile, fullPage: false });
      console.log(`  Saved ${lastFile} (scrollY=${totalHeight - stepHeight}, final)`);
      break;
    }
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ── Desktop 1440x900 ──────────────────────────────────────────────────────
  console.log("\n=== Desktop 1440x900 ===");
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(URL, { waitUntil: "networkidle" });
  // Extra wait for fonts/animations
  await desktopPage.waitForTimeout(1500);
  await captureScrollshots(desktopPage, "qa-desktop", 900);
  await desktopCtx.close();

  // ── Mobile 390x844 ────────────────────────────────────────────────────────
  console.log("\n=== Mobile 390x844 ===");
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(URL, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1500);
  await captureScrollshots(mobilePage, "qa-mobile", 844);
  await mobileCtx.close();

  await browser.close();
  console.log("\nAll screenshots saved to", OUT_DIR);
})();
