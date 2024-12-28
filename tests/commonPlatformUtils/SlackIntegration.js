const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to send test execution report to Slack
async function sendExecutionReportToSlack(directoryPath, reportHeader, channelName, botUserOAuthAccessToken) 
{
    const latestReport = getLatestFileFromDir(directoryPath, 'html');
    if (latestReport && fs.existsSync(latestReport)) {
        console.log("Sending report to Slack: " + latestReport);
        await sendFileToSlack(latestReport, channelName, botUserOAuthAccessToken, `${reportHeader} - HTML Report`);
    } else {
        console.error("No report found!");
    }
}

// Return Latest HTML file from the directory
function getLatestFileFromDir(dirPath, extension) 
{
    const files = fs.readdirSync(dirPath);
    const htmlFiles = files.filter(file => file.endsWith(`.${extension}`));
    if (htmlFiles.length === 0) return null;

    const latestFile = htmlFiles.sort((a, b) => fs.statSync(path.join(dirPath, b)).mtime - fs.statSync(path.join(dirPath, a)).mtime)[0];
    return path.join(dirPath, latestFile);
}

// Upload a file to Slack
async function sendFileToSlack(filePath, channelName, botUserOAuthAccessToken, message) 
{
    const uploadFileMethodURL = "https://slack.com/api/files.upload";
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('channels', channelName);
    formData.append('token', botUserOAuthAccessToken);
    formData.append('initial_comment', message);
    try {
        const response = await axios.post(uploadFileMethodURL, formData, {
            headers: formData.getHeaders()
        });
        console.log('File uploaded successfully:', response.data);
    } catch (error) {
        console.error('Error uploading file to Slack:', error.message);
    }
}

module.exports = { sendExecutionReportToSlack };
