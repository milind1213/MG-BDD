Overview :
This is a test automation framework developed using the Playwright with Cucumber using the 
javaCcript programming language.This framework combines Playwright for browser automation and Cucumber.js for Behavior-Driven Development (BDD), 
enabling seamless web and API testing. It fosters collaboration among technical and non-technical teams with human-readable Gherkin syntax. 
The modular design ensures flexibility and scalability, offering robust testing for web applications and APIs.


Key Features:
1. Web Testing: Automates browser interactions using Playwright for end-to-end testing.
2. API Testing: Validates REST API responses with reusable utilities.
3. BDD with Cucumber.js: Write human-readable test scenarios in Gherkin for better collaboration.
4. Reporting: Generates detailed HTML reports for test results and insights.
5. Cross-Browser Support: Test across Chromium, Firefox, and WebKit for browser compatibility.
6. Parallel & Sequential Execution: Run tests in parallel for faster feedback or sequentially
   for order-dependent tests.
7. Modular & Scalable: Easily add new features without disrupting the existing test suite.
8. CI/CD Integration: Integrates with Jenkins, GitLab, and GitHub Actions for automated test
   execution.

Software Requirements :
1. Node.js (16.x or higher)
2. npm (Comes with Node.js)
3. Visual Studio Code (Preferred) or any code editor of your choice
4. Git (for version control)

Setting up the Environment :
Step 1: Install Node.js and npm
To see if Node is installed, type in Terminal: node -v
To see if NPM is installed, type in Terminal: npm -v
In order to update Node and NPM, type in Terminal :

Step 2: Clone the Repository and Install Dependencies
To Clone Clone the repository,type in termianl : git clone https://github.com/milind1213/MG-BDD.git
To Install neccesary Dependencies type in termianl : npm install

Step 3: Install Playwright and Browsers
To Install Playwright and its browsers, type in termianl : npx playwright install
To Initialize Playwright project, type in termianl : npm init playwright@latest
To Install Cucumber.js, type in termianl: npm i @cucumber/cucumber

Step 4: Install K6 for Load Testing :
To install in macOS, type in termianl : brew install k6 # macOS
To install in Windows, type in termianl : winget install k6 --source winget

Configuration Settings :
The following environment variables are used to configure the testing environment:

Testing URLs :
For Demo purpose web UI test cases are created on https://www.polestar.com/se site and 
API test cases are created on https://reqres.in/, https://simple-grocery-store-api.glitch.me,https://gorest.co.in/public/v2

Browser Configuration:
browser_Name : Specify the browser for testing (e.g., chrome, firefox, webkit).
isHeadless : Set to true to run tests in headless mode, or false to in visible browser.

Slack Reporting: send_Slack_Report : Set to true to enable Slack notifications for test reports.
slack_Token : Slack API token for sending messages.
slack_Chanel_ID : Slack channel ID to send reports to.
report_Header : The header text for the Slack report message.

How To Run The Test Suites :
To Run Web Tests Only : npm run test:web
To Run API Tests Only : npm run test:api
To Execute all tests (web and API) : npn run test:all
To Execute Performance (K6) Tests Only : npm run test:k6
How to Run Tests in Parallel
To enable parallel execution:
Open the cucumber.json configuration file.
Update the file to specify the required number of parallel instances.

Note: API tests are preferred to run sequentially to avoid state conflicts.

Where to View Reports, Logs, and Fauilure Screenshots:
1. Test Execution Report : The generated test execution report is available in the project directory under
   the "reports" folder.This HTML report provides detailed insights into the test results, including the steps executed, success/failure status, and any errors encountered during the run.
   Path: reports/cucumber-report/cucumberReport.html

2. Test Execution Logs : The execution logs, which provide detailed information on the entire test run
   (including time stamps, test steps, and errors), which is useful for troubleshooting and provides detailed logs that can help identify where tests failed or encountered issues.File are located in the "reports" folder.
   Path: reports/test-logs.log

3. View Failure Screenshots in the Report: After running tests, navigate to the reports/  
   cucumberReport.html file.The failed test scenarios will have a screenshot icon or a clickable link that opens the corresponding image for debugging.
   Path: reports/cucumber-report.html


GitHubAction Workflows :
This GitHub Actions workflow automates the execution of Cucumber tests for API scenarios. It is triggered on pushes to the main branch, sets up the Node.js environment, installs dependencies, and runs the tests using npx cucumber-js.
The --tags @api or @web flag ensures that only API/WEB-related test scenarios are executed. To run web or api tests, update the flag according to your requrmet
Optionally, tests can be run in parallel using the --parallel <number> flag, e.g., --parallel 4 for faster execution.

# Temporary line for testing PR

# Temporary line for testing PR