const { chromium, firefox, webkit } = require('playwright');
const playwright = require('playwright'); 
const log = require('../../utils/logger');

async function launchBrowser(browserName = 'chromium', isHeadless = true) {
  const mode = isHeadless ? 'Headless' : 'Headed';
  log(`Launching the [${browserName}] Browser in [${mode}] Mode.`);

  log('====== Test Execution Environment : Local ========');
  return await initializeBrowser(browserName, isHeadless);
}

async function initializeBrowser(browserName, isHeadless = true) 
{
   if (browserName.toLowerCase() === 'chrome') 
   {
      browserName = 'chromium';
   }
     const browserTypes = { chromium, firefox, webkit };
     const browserType = browserTypes[browserName.toLowerCase()];

   if (!browserType) 
   {
      throw new Error(`Unsupported browser: ${browserName}`);
   }
     const browser = await browserType.launch({ headless: isHeadless });
     const context = await browser.newContext({permissions:[],viewport: { width: 1280, height: 720 },});
  
     const page = await context.newPage();
     return { browser, context, page };
}

async function closeBrowserInstances(page, context, browser) 
{
  const resources = 
  [
    { resource: page,    name: 'Page'    },
    { resource: context, name: 'Context' },
    { resource: browser, name: 'Browser' }
  ];

  for (const {resource,name}  of resources) 
  {
    if (resource) 
    {
      log(`Closing the Browser [${name}] `);
      await resource.close();
    }
  }
}

module.exports = { launchBrowser,closeBrowserInstances };
