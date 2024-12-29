const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const config = require('../../configDirectory/testConfig.js');
const { setup } = require('./BrowserConfigManager.js');
const { sendExecutionReportToSlack } = require('./SlackIntegration'); 
const { createJiraTicket } = require('./JiraIntegration'); // Import Jira integration
setDefaultTimeout(60 * 1000);

Before(async function (scenario)
{
  const scenarioName = scenario.pickle.name.toLowerCase();
  const tags = scenario.pickle.tags.map(tag => tag.name.toLowerCase());
  const featureFileName = scenario.sourceLocation?.uri?.toLowerCase() || '';
  
  console.log(`Setting up for scenario : ${scenario.pickle.name}`);
  const isApiScenario = tags.includes('@api') || scenarioName.includes('api') || featureFileName.includes('api');
  
  if (!isApiScenario)
  {
    console.log('Initializing UI context...');
    const { browser, page, context } = await setup(config.isRemote, false, config.browserType, config.isHeadless);
    this.browser = browser;
    this.page = page;
    this.context = context;
  }

  if (isApiScenario)
  {
     console.log('Initializing API context...');
     const { context } = await setup(config.isRemote, true, config.browserType, config.isHeadless);
     this.apiContext = context;
  }

});

After(async function (scenario) 
 {
  if (this.page && scenario.result.status === Status.FAILED) 
  {
     const testName = scenario.pickle.name;
     console.log(`Taking screenshot for failed scenario :`, testName);
     const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
     this.attach(screenshotBase64, 'image/png');  

    // JIRA Ticket Creation  
    if (config.isRemote)  
    {
      const errorDetails = `Test failed in feature: ${scenario.sourceLocation?.uri}\nError: ${scenario.result?.errorMessage || 'Unknown error'}`;
      try {
             await createJiraTicket(testName, errorDetails);
          } catch (err) {
            console.error('Error while creating Jira ticket:', err.message);
         }
    }
  }

  // Closing Api Context
  if (this.apiContext) 
  {
      console.log('Cleaning up API context...');
      this.apiContext = null;
  }

  // Closing Browser
  if (this.browser) 
  {
      console.log('Closing the browser...');
      await this.browser.close();
  }

  //Send Execution Report on Slack
  if (config.sendSlackReport) {
    const reportDirectory = process.cwd() + '/reports/CucumberReport/cucumber-report.html';
    console.log('Sending execution report to Slack', reportDirectory);
    await sendExecutionReportToSlack(reportDirectory, config.reportHeader, config.slackChannelName, config.slackOAuthToken);
  }

});
