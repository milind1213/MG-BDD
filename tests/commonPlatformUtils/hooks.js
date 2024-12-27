const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { setup } = require('./WebBrowserUtils');
const { browserType, isHeadless, isRemote } = require('../../configDirectory/testConfig');

setDefaultTimeout(60 * 1000);

let apiContext = null;
let uiContext = null;

function isApiTest(scenario) {
  const isFileApiTest = scenario.pickle.uri.toLowerCase().includes('api');
  const isTagApiTest = scenario.pickle.tags.some(tag => tag.name.toLowerCase() === '@api');
  return isFileApiTest || isTagApiTest; 
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
    uiContext = { browser, page, context }; 
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
      this.attach(screenshotBase64, 'image/png'); 
    }

    console.log('Closing the browser...');
    if (this.browser) {
      await this.browser.close();
    }
    uiContext = null; 
  }
});

After(async function () {
  console.log('All tests completed!');
});
