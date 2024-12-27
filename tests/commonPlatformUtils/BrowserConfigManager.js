const { chromium, firefox, webkit } = require('playwright');
const playwright = require('playwright'); // For LambdaTest
const { lambdatest } = require('../../configDirectory/testConfig');

const LAMBDATEST_USERNAME = 'gmilind12';  
const LAMBDATEST_ACCESS_KEY = '4e5iRSBwffrL12b7sksWidgzBjTKtV5NFJZeFaVcfrsuvXSxJk';


async function setup(isRemote, browserName, isHeadless) {
  if (isRemote) {
    console.log('Running tests on LambdaTest...');
    return await setupLambdaTest(browserName, isHeadless);
  } else {
    console.log('Running tests locally with Playwright...');
    return await setupBrowser(browserName, isHeadless);
  }
}


// Local Playwright browser setup
async function setupBrowser(browserName = 'chromium', isHeadless = true) {
  const browserTypes = { chromium, firefox, webkit };
  const browserType = browserTypes[browserName.toLowerCase()];

  if (!browserType) {
    throw new Error(`Unsupported browser: ${browserName}`);
  }

  const browser = await browserType.launch({ headless: isHeadless });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Local browser '${browserName}' initialized successfully.`);
  return { browser, context, page };
}


async function setupLambdaTest(browserName, isHeadless) {
  const capabilities = {
    browserName: browserName.charAt(0).toUpperCase() + browserName.slice(1), // Capitalize browser name
    browserVersion: 'latest',
    'LT:Options': {
      platform: 'Windows 10',
      build: 'Playwright Build', // Customize build name
      name: 'Playwright Test',  // Customize test name
      user: LAMBDATEST_USERNAME,
      accessKey: LAMBDATEST_ACCESS_KEY,
      headless: isHeadless,
    },
  };

  const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;
  const browser = await playwright.chromium.connect({ wsEndpoint });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setViewportSize({ width: 1280, height: 720 });
  console.log(`LambdaTest browser '${browserName}' initialized successfully.`);
  return { browser, context, page };

}

module.exports = { setup };