const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const path = require('path');

async function sendExecutionReportToSlack(reportDirectory, reportHeader,slack_Channel_ID, slackOAuthToken) 
{
  const client = new WebClient(slackOAuthToken);
  const filePath = path.join(reportDirectory);
  
  async function checkFile() 
  {
    let retries = 3;
    while (retries > 0) {
    if (fs.existsSync(filePath)) 
    {
      return true; 
    }
      retries--;
      console.log('File Not found, Retrying In (5) seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
     console.error(`File Not Found After ${retries} Retries...`);
     return false; 
  }
 
  const fileExists = await checkFile();
  if (!fileExists) return;

  try {
    console.log('Sending Report to Slack...');
    const fileStream = fs.createReadStream(filePath);

    const response = await client.files.uploadV2({
      channel_id: slack_Channel_ID, 
      initial_comment: reportHeader,
      file: fileStream,
      filename: 'cucumber-report.html', 
    });
    
    if (response.files && response.files.length > 0 && response.files[0].id) 
    {
        console.log('Report Sent successfully:', response.files[0].id);
        const fileUrl = response.files[0].permalink_public;
        console.log('File URL:', fileUrl);
    } else {
        console.error('Failed to upload the report to Slack:', response);
    }
   } catch (error){
      console.error('Error uploading file to Slack:', error.message);
   }
}

module.exports = { sendExecutionReportToSlack };
