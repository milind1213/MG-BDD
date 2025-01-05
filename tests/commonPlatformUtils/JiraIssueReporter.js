const axios = require('axios');
const config = require('./CommonConstant.js');

async function createJiraTicket(testName, errorDetails) 
{
    const jiraUrl = config.JIRA_API_URL;
    const issueData = 
    {
      fields: {
         project: { key: config.JIRA_PROJECT_KEY,},
         summary: `Test Failed: ${testName}`,
         description: { type: 'doc', version: 1,
         content: [{ type: 'paragraph', content: [{ type: 'text',text: `Test failed during execution on LambdaTest.`},]},
            {type: 'paragraph', content: [ { type: 'text', text: `Error Details: ${errorDetails}`},]}]},
         issuetype: { name: "Bug",},
      },
    };
   
 try{
       const response = await axios.post(jiraUrl, issueData, {
         auth: {
            username: config.JIRA_EMAIL,
            password: config.JIRA_API_TOKEN,
         },
            headers: { 'Content-Type': 'application/json',},
        });
        const issueKey = response.data.key;
        console.log(`Jira ticket created: ${issueKey}`);
        
       } catch (error) {
        console.error('Failed to create Jira ticket:', error.response?.data || error.message);
     }
}

module.exports = { createJiraTicket };
