const { chromium } = require('playwright');
 
(async ()=>{
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com');
  console.log('Page title:', await page.title());
  console.log('Page URL:', page.url());
})

();


