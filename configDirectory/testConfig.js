module.exports = {

// Browser configuration ( LambdaTest = true) 
   browserType: 'chrome',
   isHeadless: false, 
   isRemote: false,   

// URLs
   url: 'https://www.polestar.com/us',
   baseURL: 'https://reqres.in',
   BASE_URL: 'https://simple-grocery-store-api.glitch.me',
       
// Capabilties LambadaTest 
   LT_USER_NAME : "gmilind12",
   LT_ACCESS_KEY :"4e5iRSBwffrL12b7sksWidgzBjTKtV5NFJZeFaVcfrsuvXSxJk",
   TEST_FLATFORM :"Windows 11",
   BROWSER_VERSION :"latest",
   BUILD_NAME : "PlayWright Build 1",
   TEST_NAME : "UI Tests",

// Slack Reproting Utils 
   sendSlackReport : false,
   slackChannelName : 'C087E8F2PCY',
   slackOAuthToken : 'xoxb-8229382036755-8229435476899-MaIJev6w5cBjOeCTc21eDNj8',
   reportHeader : 'Test Execution Report',
};
