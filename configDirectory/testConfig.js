module.exports = {
// LambdaTest = true, LocalBrowser = false 
   isRemote: true,    

// Browser Configuration
   browserType: 'chrome',
   isHeadless: false, 

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
   sendSlackReport : true,
   slackChannelName : 'your-slack-channel',
   slackOAuthToken : 'your-slack-bot-oauth-token',
   reportHeader : 'Test Execution Report',
};
