const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { launchBrowser } = require('./BrowserConfigManager');
const { setApiContext } = require('./ApiConfigUtil');
const { sendExecutionReportToSlack } = require('./SlackIntegrationUtil');
const { createJiraTicket } = require('./JiraIntegrationUtil');
require('dotenv').config({ path: './configDirectory/.env' });

setDefaultTimeout(60 * 1000);

Before(async function (scenario) 
{
  const scenarioName = scenario.pickle.name.toLowerCase();
  const featureFileName = scenario.sourceLocation?.uri?.toLowerCase() || '';
  const isRemote = process.env.IS_REMOTE === 'true'; 

  console.log(`Setting up for scenario: ${scenarioName}`);
  const isApiScenario = scenarioName.includes('api') || featureFileName.includes('api');

  const { browser, page, context } = await launchBrowser(isRemote, process.env.BROWSER_TYPE, process.env.IS_HEADLESS === 'true');
  const mode = process.env.IS_HEADLESS === 'true' ? 'Headless' : 'Headed';
  console.log(`Initializing UI Playwright Context on '${process.env.BROWSER_TYPE}' Browser initialized in ${mode} Mode.`);
 
  this.browser = browser;
  this.page = page;
  this.context = context;

  if (isApiScenario) 
  {
    const context = await setApiContext();
    this.apiContext = context;
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

    if (process.env.IS_REMOTE === 'true') 
    {
       const errorDetails = `Test failed in feature: ${scenario.sourceLocation?.uri}\nError: ${scenario.result?.errorMessage || 'Unknown error'}`;
      try {
        await createJiraTicket(testName, errorDetails);
      } catch(err)
      {
        console.error('Error while creating Jira ticket:', err.message);
      }
    }
  }

  if (this.apiContext) 
  {
    console.log('Cleaning up API context...');
    this.apiContext = null;
  }

  if (this.browser) 
  {
    console.log('Closing the browser...');
    await this.browser.close();
  }

  if (process.env.SEND_SLACK_REPORT === 'true') 
  {
    const reportDirectory = process.cwd() + '/reports/CucumberReport/cucumber-report.html';
    console.log('Sending execution report to Slack:', reportDirectory);
    await sendExecutionReportToSlack(reportDirectory, process.env.REPORT_HEADER, process.env.SLACK_CHANEL_ID, process.env.SLACK_TOKEN);
  }
});
