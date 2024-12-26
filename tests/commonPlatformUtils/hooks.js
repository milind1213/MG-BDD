const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { setup } = require('./WebBrowserUtils'); // Ensure to import 'setup' instead of 'setupBrowser'
const { browserType, isHeadless, isRemote } = require('../../configDirectory/testConfig');
const axios = require('axios'); // Import axios for API requests (if needed)

setDefaultTimeout(60 * 1000);

let apiContext = null;
let uiContext = null;

function isApiTest(scenario) {
  const isFileApiTest = scenario.pickle.uri.toLowerCase().includes('api'); // Check if 'api' is part of the file name or path
  const isTagApiTest = scenario.pickle.tags.some(tag => tag.name.toLowerCase() === '@api'); // Check for @api tag
  return isFileApiTest || isTagApiTest; // Either condition can be true for it to be considered an API test
}

Before(async function (scenario) {
  if (isApiTest(scenario)) {
      console.log('Setting up for API test...');
      apiContext = {};
  } else {
    console.log(`Setting up the ${browserType} browser for scenario: ${scenario.pickle.name}`);
    const { browser, page, context } = await setup(isRemote, browserType, isHeadless);
    this.browser = browser;
    this.page = page;
    this.context = context;
    uiContext = { browser, page, context }; // Store UI-related context
  }
});


After(async function (scenario) {
  if (isApiTest(scenario)) {
    console.log('Cleaning up API test...');
    apiContext = null; 
  } else {
    if (scenario.result.status === Status.FAILED) {
      console.log(`Taking screenshot for failed scenario: ${scenario.pickle.name}`);
      const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
      this.attach(screenshotBase64, 'image/png'); // Attach screenshot for failed scenario
    }

    console.log('Closing the browser...');
    if (this.browser) {
      await this.browser.close();
    }
    uiContext = null; // Clear UI context after each UI test
  }
});


After(async function () {
  console.log('All tests completed!');
});
