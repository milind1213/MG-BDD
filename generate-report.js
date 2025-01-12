const os = require('os');
const path = require('path');
const reporter = require('cucumber-html-reporter');

const getMetadata = () => {
  const browser = process.env.BROWSER || 'Chrome 112.0';
  const platform = os.platform();
  const platformVersion = os.release();
  return {
    "App Version": process.env.APP_VERSION || "1.0.0",
    "Test Environment": process.env.TEST_ENV || "QA",
    "Browser": browser,
    "Platform": `${platform} ${platformVersion}`,
    "Parallel": "Scenarios",
    "Executed": "Milind G",
  };
};

const options = {
  theme: 'bootstrap', // Options: 'bootstrap', 'hierarchy', 'foundation', 'simple'
  jsonFile: path.resolve(__dirname, 'reports/cucumber-report.json'), 
  output: path.resolve(__dirname, 'reports/cucumber-report.html'), 
  reportSuiteAsScenarios: true, 
  launchReport: true, 
  metadata: getMetadata(),
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: process.env.PROJECT_NAME || 'My Project' },
      { label: 'Release', value: process.env.RELEASE || '1.0' },
      { label: 'Cycle', value: process.env.CYCLE || 'Sprint 1' },
      { label: 'Execution Start Time', value: new Date().toLocaleString() },
      { label: 'Executed By', value: os.userInfo().username },
    ],
  },
};

try {
  console.log('Generating Cucumber HTML Report...');
  reporter.generate(options);
  console.log('Report generated successfully at:', options.output);
} catch (error) {
  console.error('Error generating report:', error.message);
  console.error('Stack trace:', error.stack);
}
