require('dotenv').config({ path: './configDirectory/.env' });
  module.exports = {
     getCapabilities: (browserName, isHeadless) =>
     {
      const capabilitiesList = [{
      browserName: browserName.charAt(0).toUpperCase() + browserName.slice(1),
      browserVersion: 'latest',
      'LT:Options': {
       platform:process.env.TEST_FLATFORM,
       build:process.env.BUILD_NAME,
       name: process.env.TEST_NAME,
       user: process.env.LT_USER_NAME,
       accessKey: process.env.LT_ACCESS_KEY,
       headless: isHeadless,
       network:true,
       video: true,
       console: true,
      },},  // Add More Required..
      ]; 
       return capabilitiesList;
    }};
  