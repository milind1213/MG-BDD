const { chromium, firefox, webkit } = require('playwright'); 
const playwright = require('playwright'); //For LambdaTest


const LAMBDATEST_USERNAME = '<your_username>';  
const LAMBDATEST_ACCESS_KEY = '<your_access_key>';

// Local Playwright browser setup
async function setupBrowser(browserName, isHeadless) {
  let browser, context, page;

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

// LambdaTest Playwright setup (remote execution)
async function setupLambdaTest(browserName, isHeadless) {
  const capabilities = {
    platformName: 'Windows 10',
    browserName: browserName,
    browserVersion: 'latest',
    headless: isHeadless,
    name: 'Playwright Test',
    build: '1.0',
  };

  const browser = await playwright.chromium.connect({
    wsEndpoint: `wss://${LAMBDATEST_USERNAME}:${LAMBDATEST_ACCESS_KEY}@hub.lambdatest.com/playwright`,
    capabilities
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  page.viewportSize({width: 1280, height: 585});
  return { browser, page, context };
}

async function setup(isRemote, browserName, isHeadless) {
  if (isRemote) {
    console.log('Running tests on LambdaTest...');
    return await setupLambdaTest(browserName, isHeadless);
  } else {
    console.log('Running tests locally with Playwright...');
    return await setupBrowser(browserName, isHeadless);
  }
}

module.exports = { setup };
