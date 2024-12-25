const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { setup } = require('./WebBrowserUtils'); // Ensure to import 'setup' instead of 'setupBrowser'
const { browserType, isHeadless, isRemote } = require('../../configDirectory/testConfig');

setDefaultTimeout(60 * 1000); 

Before(async function (scenario) {
  console.log(`Setting up the ${browserType} browser for scenario: ${scenario.pickle.name}`);
  const { browser, page, context } = await setup(isRemote, browserType, isHeadless); // Use the new setup function here
  this.browser = browser;
  this.page = page;
  this.context = context;
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    console.log(`Taking screenshot for failed scenario: ${scenario.pickle.name}`);
    const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
    this.attach(screenshotBase64, 'image/png');
  }
  
  console.log('Closing the browser...');
  if (this.browser) {
    await this.browser.close();
  }
});