const { Before, After,BeforeAll ,AfterAll,setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { launchBrowser, closeBrowserInstances} = require('./browser-setup');
const SlackReportingUtils = require('../../utils/slack-reporting');
const log = require('../../utils/logger');
const config = require('./common-constants.js');
const path = require('path');

setDefaultTimeout(60 * 1000);

BeforeAll(async function () 
{
  log('=========== [ Starting the test execution ] =============');
  if (config.SEND_SLACK_REPORT === 'true') {
       await slack-reporting.initialize(config.SLACK_TOKEN,config.SLACK_CHANEL_ID);
     }
  log('Environment is Ready for Test execution..');
});


Before(async function (scenario) 
{
  const scenarioName = scenario.pickle.name.toLowerCase();
  const tags = scenario.pickle.tags.map(tag => tag.name.toLowerCase());
  const featureFilePath = scenario.gherkinDocument.uri.toLowerCase();
  const featureFileName = path.basename(featureFilePath);
 
  log(`====== Executing the Scenarios from Feature: [${featureFileName}] ======`);
  log(`Setting up for Scenario: [${scenarioName}]`);
  
  if (!featureFileName.includes('api') && !scenarioName.includes('api') && !tags.includes('@api'))
  {
     const { browser, page, context } = await launchBrowser(config.BROWSER_TYPE,config.IS_HEADLESS); 
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
     log(`Taking Screenshot for Failed Scenario: ${testName}`);
  
     const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
     this.attach(screenshotBase64, 'image/png');

  }

  if (this.page || this.context || this.browser)
  {
    log('Closing all Active Browser Sessions...!');
    await closeBrowserInstances(this.page, this.context, this.browser);
  }

});

AfterAll(async function () 
{
  log('============ Test execution completed ====================');
  if (config.SEND_SLACK_REPORT === 'true') 
    {
      const reportPath = process.cwd() + '/reports/cucumber-report/CucumberReport.html';
      log('Sending Execution Report to Slack:', reportPath);
      await sendExecutionReportToSlack.sendExecutionReportToSlack(reportPath,config.REPORT_HEADER, config.SLACK_CHANEL_ID,config.SLACK_TOKEN);
    }
});



