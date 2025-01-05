const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { launchBrowser, closeBrowserInstances} = require('./BrowserConfigManager');
const { sendExecutionReportToSlack } = require('./SlackReportingUtils');
const { createJiraTicket } = require('./JiraIssueReporter');
const path = require('path');
const config = require('./CommonConstant.js');



setDefaultTimeout(60 * 1000);

Before(async function (scenario) 
{
  const scenarioName = scenario.pickle.name.toLowerCase();
  const tags = scenario.pickle.tags.map(tag => tag.name.toLowerCase());
  const featureFilePath = scenario.gherkinDocument.uri.toLowerCase();
  const featureFileName = path.basename(featureFilePath);

  console.log(`Executing Scenarios from Feature Files: [${featureFileName}]`);
  console.log(`Setting up for Scenario : [${scenarioName}]`);
  
  if (!featureFileName.includes('api') && !scenarioName.includes('api') && !tags.includes('@api'))
  {
     const { browser, page, context } = await launchBrowser(config.IS_REMOTE, config.BROWSER_TYPE,config.IS_HEADLESS); 
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
     console.log(`Taking Screenshot for Failed Scenario: ${testName}`);
  
     const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
     this.attach(screenshotBase64, 'image/png');

   if (config.IS_REMOTE === 'true') {
        const errorDetails = `Test Failed in Feature: ${scenario.sourceLocation?.uri}\nError: ${scenario.result?.errorMessage || 'Unknown error'}`;
        await createJiraTicket(testName, errorDetails);  
     }
  }

  if (this.page || this.context || this.browser)
  {
      console.log('Cleaning Up Browser Session...');
      await closeBrowserInstances(this.page, this.context, this.browser);
  }

  if (config.SEND_SLACK_REPORT === 'true') 
  {
    const reportDirectory = process.cwd() + '/reports/cucumber-report/CucumberReport.html';
    console.log('Sending Execution Report to Slack:', reportDirectory);
    await sendExecutionReportToSlack(reportDirectory, process.env.REPORT_HEADER, process.env.SLACK_CHANEL_ID, process.env.SLACK_TOKEN);
  }

});

