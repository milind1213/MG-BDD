const axios = require('axios');

async function createJiraTicket(testName, errorDetails) 
{
    const jiraUrl = `https://mgsmilind.atlassian.net/rest/api/3/issue`;
    
    const issueData = 
    {
        fields: {
            project: { key: 'MGS',},
            summary: `Test Failed: ${testName}`,
            description: { type: 'doc', version: 1,
            content: [ { type: 'paragraph', content: [{ type: 'text',text: `Test failed during execution on LambdaTest.`},]},
                       {type: 'paragraph', content: [ { type: 'text', text: `Error Details: ${errorDetails}`},]}]},
            issuetype: { name: "Bug",},
        },
    };

    try {
        // Make a request to create the Jira issue
        const response = await axios.post(jiraUrl, issueData, {
            auth: {
            
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const issueKey = response.data.key;
        console.log(`Jira ticket created: ${issueKey}`);
    } catch (error) {
        console.error('Failed to create Jira ticket:', error.response?.data || error.message);
    }
}

module.exports = { createJiraTicket };
