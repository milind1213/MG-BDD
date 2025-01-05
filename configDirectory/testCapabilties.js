require("dotenv").config({ path: "./configDirectory/.env" });
module.exports = {
  getCapabilities: (browserName, isHeadless) => {
    const capabilitiesList = [
      {
        browserName: browserName.charAt(0).toUpperCase() + browserName.slice(1),
        browserVersion: "latest",
        "LT:Options": {
          platform: process.env.lambdatest_Testing_Platform,
          build: process.env.build_Name,
          name: process.env.test_Name,
          user: process.env.lambdatest_UserName,
          accessKey: process.env.lambdatest_AccesKey,
          headless: isHeadless,
          network: true,
          video: true,
          console: true,
        },
      }, // Add More Required..
    ];
    return capabilitiesList;
  },
};
