const os = require('os');
const path = require('path');
const reporter = require('cucumber-html-reporter');
const config = require('./tests/common-platform-utils/common-constants');
const fs = require('fs');

const getMetadata = () => {
  const browser = config.BROWSER_TYPE;
  const platform = os.platform();
  const platformVersion = os.release();
  return {
    "App Version": process.env.APP_VERSION || "1.1.0",
    "Test Environment": process.env.TEST_ENV || "QA-Envirment",
    "Browser": browser,
    "Platform": `${platform} ${platformVersion}`,
    "Executed": "Milind Ghongade",
  };
};

const options = {
  theme: 'bootstrap',
  jsonFile: path.resolve(__dirname, 'reports/cucumber-report.json'),
  output: path.resolve(__dirname, 'reports/cucumber-report.html'),
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: getMetadata(),
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: config.PROJECT_NAME },
      { label: 'Release', value: process.env.RELEASE },
      { label: 'Cycle', value: process.env.CYCLE },
      { label: 'Execution Start Time', value: new Date().toLocaleString() },
      { label: 'Executed By', value: os.userInfo().username },
    ],
  },
};

// Function to generate the report if the JSON file exists
const generateReport = () => {
  const jsonFile = path.resolve(__dirname, 'reports/cucumber-report.json');
  if (fs.existsSync(jsonFile)) {
    console.log('Generating Cucumber HTML Report...');
    reporter.generate(options);
    console.log('Report generated successfully at:', options.output);
  } else {
    console.error('Error: Cucumber JSON report not found. Please ensure the tests completed successfully.');
  }
};
generateReport();
