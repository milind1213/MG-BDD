// Lambdatest Capabilities for multiple browsers and OS
const config = require('./testConfig');
module.exports = {
    getCapabilities: (browserName, isHeadless) => {
      const capabilitiesList = [
        {
          browserName: browserName.charAt(0).toUpperCase() + browserName.slice(1),
          browserVersion: 'latest',
          'LT:Options': {
            platform: config.TEST_FLATFORM,
            build: config.BUILD_NAME,
            name: config.TEST_NAME,
            user: config.LT_USER_NAME,
            accessKey: config.LT_ACCESS_KEY,
            headless: config.isHeadless,
            network:true,
            video: true,
            console: true,
          },
        },
        {
          browserName: 'firefox',
          browserVersion: 'latest',
          'LT:Options': {
            platform: 'macOS Monterey',
            build: 'Playwright Build 2',
            name: 'Playwright UI Test 2',
            user: 'your-lambdatest-username',
            accessKey: 'your-lambdatest-accesskey',
            headless: isHeadless,
          },
        },
        // Add other configurations for more browsers and OS
      ];
      return capabilitiesList;
    }
  };
  