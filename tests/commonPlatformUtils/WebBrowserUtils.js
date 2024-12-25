const { chromium, firefox, webkit, devices } = require('playwright');  // Import Playwright
const playwright = require('playwright');  // For LambdaTest remote connection

// Set whether you want to run tests locally or remotely on LambdaTest
const isRemote = false;  // Set to true for LambdaTest, false for local Playwright

// Define LambdaTest username and access key (replace with your own)
const LAMBDATEST_USERNAME = '<your_username>';  // Replace with your LambdaTest username
const LAMBDATEST_ACCESS_KEY = '<your_access_key>';  // Replace with your LambdaTest access key

// Local Playwright browser setup
async function setupBrowser(browserName, isHeadless) {
  let browser, context, page;

  // Launch the specified browser locally using Playwright
  if (browserName === 'chrome') {
    browser = await chromium.launch({ headless: isHeadless });
  } else if (browserName === 'firefox') {
    browser = await firefox.launch({ headless: isHeadless });
  } else if (browserName === 'webkit') {
    browser = await webkit.launch({ headless: isHeadless });
  } else {
    throw new Error('Unsupported browser: ' + browserName);
  }

  context = await browser.newContext();
  page = await context.newPage();
  return { browser, page, context };
}

// LambdaTest Playwright setup (remote execution)// LambdaTest Playwright setup (remote execution)
async function setupLambdaTest(browserName, isHeadless) {
  const capabilities = {
    platformName: 'Windows 10',  // Example platform, adjust as needed for LambdaTest
    browserName: browserName,
    browserVersion: 'latest',
    headless: isHeadless,  // Define headless or not
    name: 'Playwright Test',  // Test name
    build: '1.0',  // Build number
  };

  // Connect to LambdaTest Playwright server using the WebSocket URL with username and access key
  const browser = await playwright.chromium.connect({
    wsEndpoint: `wss://${LAMBDATEST_USERNAME}:${LAMBDATEST_ACCESS_KEY}@hub.lambdatest.com/playwright`,
    capabilities
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  page.viewportSize({width: 1280, height: 585});
  return { browser, page, context };
}

// Determine whether to run locally or remotely (LambdaTest) based on the `isRemote` variable
async function setup(isRemote, browserName, isHeadless) {
  if (isRemote) {
    console.log('Running tests on LambdaTest...');
    return await setupLambdaTest(browserName, isHeadless);
  } else {
    console.log('Running tests locally with Playwright...');
    return await setupBrowser(browserName, isHeadless);
  }
}
// Export the setup function for use in your step definitions or tests
module.exports = { setup };
