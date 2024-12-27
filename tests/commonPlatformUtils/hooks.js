const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { request } = require('@playwright/test');
const config = require('../../configDirectory/testConfig.js');
const { setup } = require('./WebBrowserUtils');

setDefaultTimeout(60 * 1000);

Before(async function (scenario) {
  
  const scenarioName = scenario.pickle.name.toLowerCase();
  const tags = scenario.pickle.tags.map(tag => tag.name.toLowerCase());
  const featureFileName = scenario.sourceLocation?.uri?.toLowerCase() || '';
  console.log(`Setting up for scenario: ${scenario.pickle.name}`);

  if (tags.includes('@api') || scenarioName.includes('api') || featureFileName.includes('api')) {
    console.log('Initializing API context...');
    this.apiContext = await request.newContext({ baseURL: config.baseURL });
 
  } else {
    console.log('Initializing UI context...');
    const { browser, page, context } = await setup(config.isRemote, config.browserType, config.isHeadless);
    this.browser = browser;
    this.page = page;
    this.context = context;
  }
});

After(async function (scenario) {
  if (this.apiContext) {
    console.log('Cleaning up API context...');
    this.apiContext = null;
  }

  if (this.page && scenario.result.status === Status.FAILED) {
    console.log(`Taking screenshot for failed scenario: ${scenario.pickle.name}`);
    const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
    this.attach(screenshotBase64, 'image/png');
  }

  if (this.browser) {
    console.log('Closing the browser...');
    await this.browser.close();
  }
});
