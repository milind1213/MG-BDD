const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { launchBrowser, closeBrowserInstances} = require('./BrowserConfigManager');
const { sendExecutionReportToSlack } = require('./SlackIntegrationUtil');
const { createJiraTicket } = require('./JiraIntegrationUtil');
require('dotenv').config({ path: './configDirectory/.env' });

setDefaultTimeout(60 * 1000);

Before(async function (scenario) 
{
  const scenarioName = scenario.pickle.name.toLowerCase();
  const tags = scenario.pickle.tags.map(tag => tag.name.toLowerCase());
  console.log(`Setting up for Scenario : ${scenarioName}`);

  if (!scenarioName.includes('api') || tags.includes('@api'))
  {
     const { browser, page, context } = await launchBrowser(process.env.IS_REMOTE === 'true', process.env.BROWSER_TYPE, process.env.IS_HEADLESS === 'true'); 
     this.browser = browser;
     this.page = page;
     this.context = context;
  }
}); 

After(async function (scenario) 
{
  if (this.page && scenario.result.status === Status.FAILED) 
  {
     const testName = scenario.pickle.name;
     console.log(`Taking screenshot for failed scenario: ${testName}`);
  
     const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
     this.attach(screenshotBase64, 'image/png');

   if (process.env.IS_REMOTE === 'true') {
        const errorDetails = `Test failed in feature: ${scenario.sourceLocation?.uri}\nError: ${scenario.result?.errorMessage || 'Unknown error'}`;
        await createJiraTicket(testName, errorDetails);  
     }
  }

  if (this.page || this.context || this.browser)
  {
      console.log('Cleaning up browser session...');
      await closeBrowserInstances(this.page, this.context, this.browser);
  }

  if (process.env.SEND_SLACK_REPORT === 'true') 
  {
    const reportDirectory = process.cwd() + '/reports/CucumberReport/cucumber-report.html';
    console.log('Sending execution report to Slack:', reportDirectory);
    await sendExecutionReportToSlack(reportDirectory, process.env.REPORT_HEADER, process.env.SLACK_CHANEL_ID, process.env.SLACK_TOKEN);
  }

});

