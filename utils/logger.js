const path = require("path");
const fs = require("fs");
const log4js = require("log4js");

const logsPath = path.join(__dirname, "..", "reports", "execution-logs", "test-logs.log");
// Open the file in write mode to overwrite it
fs.writeFileSync(logsPath, "", { flag: "w" });

// Custom function to format the date in `dd-MM-yy hh:mm:ss AM/PM`
function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2);
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Configure log4js
log4js.configure({
  appenders: {
    file: {
      type: "file",
      filename: logsPath,
      layout: {
        type: "pattern",
        pattern: "[%x{timestamp}] [ %p ] - %m", // Use the custom token for the timestamp
        tokens: {
          timestamp: getFormattedDate, // Map the custom function to the token
        },
      },
    },
    console: {
      type: "stdout",
      layout: {
        type: "pattern",
        pattern: "[%x{timestamp}] [ %p ] - %m", // Use the same custom token
        tokens: {
          timestamp: getFormattedDate,
        },
      },
    },
  },
  categories: {
    default: { appenders: ["file", "console"], level: "info" },
  },
});

const logger = log4js.getLogger();

function log(message) {
  logger.info(message);
}

// Gracefully shut down the logger when the process exits
process.on("exit", () => {
  log4js.shutdown(() => console.log("Logs flushed to file."));
});

module.exports = log;
