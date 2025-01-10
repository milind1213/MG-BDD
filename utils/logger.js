const path = require("path");
const fs = require("fs");
const log4js = require("log4js");

const logsPath = path.join(__dirname, "..", "reports","test-logs.log");
fs.writeFileSync(logsPath, "", { flag: "w" }); // Open the file in write mode to overwrite it

function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Configure log4js
log4js.configure({
  appenders: 
  {
    file: 
    {
      type: "file",
      filename: logsPath,
      layout:
      {
         type: "pattern",
         pattern: "[%x{timestamp}] [ %p ] - %m",
         tokens: 
         {
          timestamp: getFormattedDate,
         },
      },
    },

    console: 
    {
      type: "stdout",
      layout:
       {
        type: "pattern",
        pattern: "[%x{timestamp}] [ %p ] - %m",
        tokens: 
        {
          timestamp: getFormattedDate,
        },
      },
    },
  },

  categories: 
  {
    default: { 
      appenders: ["file", "console"], 
      level: "info" 
    },
  },
});

const logger = log4js.getLogger();
function log(message) 
{
  logger.info(message);
}


process.on("exit", () => 
{
  log4js.shutdown(() => console.log("Logs flushed to file."));
});

module.exports = log;
