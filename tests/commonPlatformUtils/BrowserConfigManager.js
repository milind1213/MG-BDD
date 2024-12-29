const { chromium, firefox, webkit } = require('playwright');
const playwright = require('playwright'); 
const { request } = require('@playwright/test');
const config = require('../../configDirectory/testConfig.js'); 
const lambdatestCapabilities = require('../../configDirectory/testCapabilties.js'); 
async function setup(isRemote, isApi, browserName, isHeadless) 
{
  if(isRemote) {
     console.log('Running tests on LambdaTest...');
     return await setupLambdaTest(isApi, browserName, isHeadless);
  }  else {
     console.log('Running tests locally with Playwright...');
     return await setBrowser(isApi, browserName, isHeadless);
  }
}

// Local Playwright browser setup
async function setBrowser(isApi, browserName, isHeadless = true) 
{
  if (!isApi) {
    if (browserName.toLowerCase() === 'chrome') {
        browserName = 'chromium';
        console.log("Using 'chromium' for 'chrome'.");
    }
    const browserTypes = { chromium, firefox, webkit };
    const browserType = browserTypes[browserName.toLowerCase()];

    if (!browserType) {
      throw new Error(`Unsupported browser: ${browserName}`);
    }

    const browser = await browserType.launch({ headless: isHeadless });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.setViewportSize({ width: 1280, height: 720 });
    console.log(`Local browser '${browserName}' initialized successfully.`);
    return { browser, context, page };
  } 
   else 
  {
    console.log('Initializing API context...');
    this.apiContext = await request.newContext({ baseURL: config.baseURL });
    return { context: this.apiContext };
  }
}

async function setupLambdaTest(isApi, browserName, isHeadless) {
  try {
    if (!isApi) {
      const capabilitiesList = lambdatestCapabilities.getCapabilities(browserName, isHeadless);
      const capabilities = capabilitiesList[0];

      if (!capabilities) {
        throw new Error(`No capabilities found for LambdaTest with browser: ${browserName}`);
      }
      const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;
      console.log("Connecting to LambdaTest for browser session...");

      const browser = await playwright.chromium.connect({ wsEndpoint });
      const context = await browser.newContext();
      const page = await context.newPage();

      console.log(`LambdaTest browser '${browserName}' initialized successfully.`);
      return { browser, context, page };

    } else {
      const apiContext = await request.newContext({ baseURL: config.baseURL });
      console.log('LambdaTest API context initialized successfully.');
      return { apiContext };
    }
  } catch (error) {
    console.error(`Error setting up LambdaTest: ${error.message}`);
    throw error;
  }
}


module.exports = { setup };
