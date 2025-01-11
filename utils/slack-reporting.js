const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const path = require('path');
const log = require('../utils/logger');

let slackClient;
// Initialize Slack WebClient
async function initialize(slackToken, channelId) {
  if (!slackToken || !channelId) {
    throw new Error('Slack token or channel ID is missing. Please check environment variables.');
  }
  try {
    slackClient = new WebClient(slackToken);
    const response = await slackClient.conversations.info({ channel: channelId });
    if (!response.ok) {
      throw new Error(`Failed to verify Slack channel: ${response.error}`);
    }
    console.log('Slack client initialized successfully.');
  } catch (error) {
    console.error(`Error initializing Slack client: ${error.message}`);
    throw error;
  }
}

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
      log('File Not found, Retrying In (5) seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
     console.error(`File Not Found After ${retries} Retries...`);
     return false; 
  }
 
  const fileExists = await checkFile();
  if (!fileExists) return;

  try {
    log('Sending Report to Slack...');
    const fileStream = fs.createReadStream(filePath);

    const response = await client.files.uploadV2({
      channel_id: slack_Channel_ID, 
      initial_comment: reportHeader,
      file: fileStream,
      filename: 'cucumber-report.html', 
    });
    
    if (response.files && response.files.length > 0 && response.files[0].id) 
    {
        log('Report Sent successfully:', response.files[0].id);
        const fileUrl = response.files[0].permalink_public;
        log('File URL:', fileUrl);
    } else {
        console.error('Failed to upload the report to Slack:', response);
    }
   } catch (error){
      console.error('Error uploading file to Slack:', error.message);
   }
}

module.exports = {initialize,sendExecutionReportToSlack };
