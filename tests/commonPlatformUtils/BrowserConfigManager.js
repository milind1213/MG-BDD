const { chromium, firefox, webkit } = require('playwright');
const playwright = require('playwright'); 
const lambdatestCapabilities = require('../../configDirectory/testCapabilties.js');
require('dotenv').config({ path: './configDirectory/.env' });

async function launchBrowser(isRemote, browserName, isHeadless) 
{  
  const mode = isHeadless ? 'Headless' : 'Headed';
  console.log(`Launching the [${browserName}] Browser in [${mode}] Mode.`);

  if (isRemote)  
  {
    console.log(`====== Test Execution Environment : LambdaTest Remote =======`);
    return await initializeLambdaTest(browserName, isHeadless);
  } else 
  {
    console.log(`====== Test Execution Environment : Local ========`);
    return await initializeBrowser(browserName, isHeadless);
  }
}

// Local Playwright browser setup
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
  const context = await browser.newContext();
  const page = await context.newPage();

  page.setViewportSize({ width: 1280, height: 800 });
  return { browser, context, page };
}

// LambdaTest browser setup
async function initializeLambdaTest(browserName, isHeadless) 
{
  try {
    const capabilitiesList = lambdatestCapabilities.getCapabilities(browserName, isHeadless);
    const capabilities = capabilitiesList[0];

    if (!capabilities) 
    {
      throw new Error(`No capabilities found for LambdaTest with browser: ${browserName}`);
    }
    const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;
    console.log("Connecting to LambdaTest for browser session...");

    const browser = await playwright.chromium.connect({ wsEndpoint });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`LambdaTest browser '${browserName}' initialized successfully.`);
    return { browser, context, page };
  } catch (error) 
  {
    console.error(`Error setting up LambdaTest: ${error.message}`);
    throw error;
  }
}

async function closeBrowserInstances(page, context, browser) 
{
  if (page)
  {
    console.log('Closing the Active Browser Page...');
    await page.close(); 
  }

  if (context) 
  {
    console.log('Closing the Browser Context...');
    await context.close(); 
  }

  if (browser) 
  {
    console.log('Shutting Down the Browser Instance...');
    await browser.close(); 
  }
}

module.exports = { launchBrowser,closeBrowserInstances };
