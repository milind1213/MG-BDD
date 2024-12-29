const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const path = require('path');

async function sendExecutionReportToSlack(reportDirectory, reportHeader,slack_Channel_ID, slackOAuthToken) {
  const client = new WebClient(slackOAuthToken);
  const filePath = path.join(reportDirectory);
  
  if (!fs.existsSync(filePath)) {
     console.error('Report file does not exist');
    return;
  }
  try {
    console.log('Sending report to Slack...');
    const fileStream = fs.createReadStream(filePath);
    
    const response = await client.files.uploadV2({
      channel_id: slack_Channel_ID, 
      initial_comment: reportHeader || 'Cucumber Test Execution Report',
      file: fileStream,
      filename: 'cucumber-report.html', 
    });

    // Check if the response contains file information
    if (response.files && response.files.length > 0 && response.files[0].id) {
        console.log('Report sent successfully:', response.files[0].id);
        const fileUrl = response.files[0].permalink_public;
        console.log('File URL:', fileUrl);
    } else {
        console.error('Failed to upload the report to Slack:', response);
    }
  } catch (error) {
        console.error('Error uploading file to Slack:', error.message);
  }
}
module.exports = { sendExecutionReportToSlack };
