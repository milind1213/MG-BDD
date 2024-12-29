const { chromium, firefox, webkit } = require('playwright');
const playwright = require('playwright');
const { request } = require('@playwright/test');
const lambdatestCapabilities = require('../../configDirectory/testCapabilties.js');
require('dotenv').config({ path: './configDirectory/.env' });

async function setup(isRemote, isApi, browserName, isHeadless) {  
  if (isRemote) {
    console.log(`====== Test Execution Environment: LambdaTest Remote =======`);
    return await setupLambdaTest(isApi, browserName, isHeadless);
  } else {
    console.log(`====== Test Execution Environment: Local ========`);
    return await setBrowser(isApi, browserName, isHeadless);
  }
}

// Local Playwright browser setup
async function setBrowser(isApi, browserName, isHeadless = true) {
  if (!isApi) {
    if (browserName.toLowerCase() === 'chrome') {
      browserName = 'chromium';
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
    return { browser, context, page };

  } else {
    const apiContext = await request.newContext({ baseURL: process.env.BASE_URL_1 });
    return { context: apiContext };
  }
}

// LambdaTest browser setup
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
      const apiContext = await request.newContext({ baseURL: process.env.BASE_URL_1 });
      console.log('LambdaTest API context initialized successfully.');
      return { apiContext };
    }
  } catch (error) {
    console.error(`Error setting up LambdaTest: ${error.message}`);
    throw error;
  }
}

module.exports = { setup };