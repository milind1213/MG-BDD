const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { request } = require('@playwright/test');
const config = require('../../configDirectory/testConfig.js');
setDefaultTimeout(60 * 1000); 

Before(async function (scenario) {
  console.log(`Setting up for scenario: ${scenario.pickle.name}`);
  if (scenario.pickle.tags.some(tag => tag.name.toLowerCase() === '@api')) {
    console.log('Initializing API context...');
    this.apiContext = await request.newContext({baseURL: config.baseURL});
  }

  if (scenario.pickle.tags.some(tag => tag.name.toLowerCase() === '@ui')) {
    this.browser = await browserType.launch();
    this.page = await this.browser.newPage();
  }
});

After(async function (scenario) {
  if (this.apiContext) {
    console.log('Cleaning up API test...');
    this.apiContext = null; 
  }

  if (this.page && scenario.result.status === Status.FAILED) {
    console.log(`Taking screenshot for failed scenario: ${scenario.pickle.name}`);
    const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
    this.attach(screenshotBase64, 'image/png');
  }

  if (this.browser) {
    console.log('Closing the browser...');
    await this.browser.close(); // Close the browser after the test
  }
});
