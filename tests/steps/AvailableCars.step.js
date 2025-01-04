
const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { WebDashboard } = require('../pages/web_pages/WebDashboard');
const { expect } = require('@playwright/test');
require('dotenv').config({ path: './configDirectory/.env' });

let webDashboard, availableCarsPage,selectedRetailerName;
let modelYears,powertrains,prices;

Given('I launch the URL and land on the homepage', async function () {
    webDashboard = new WebDashboard(this.page);
    homePage = webDashboard.getHomePage();
    availableCarsPage = webDashboard.getAvailableCarsPage();
    await homePage.goTo(process.env.PROD_WEB_URL);
    console.log('Successfully Navigated to the Homepage.');
});

Given('I accept cookies from the homepage', async function () {
    await homePage.handleCookies("accept");
    console.log(`Accepted Cookies on Homepage.`);
});


Given('I click on {string} from the homepage', async function (shoppingTools) {
    console.log(`Clicking on the [${shoppingTools}] on Homepage.`);
    await homePage.clickHeader(shoppingTools);
});

Given('I select the {string} option.', async function (availableCars) { 
  await homePage.clickShoppingToolOption(availableCars);
});

When('I enter zip code and select an address from the suggestions', async function () {
  await availableCarsPage.enterPinCodeAndSelectAddress("43213");
});

Then('I should continue with the selected Retailer address', async function () {
  await availableCarsPage.clickContiunWithAddressButton();
});

Then('I verify the default {string} car model displayed in filter', async function (expectedCarModel) {
  const actualCarModel = await availableCarsPage.getDefaultFilterCarModel();
  console.log("Default Filter Model : ", actualCarModel);
  expect(actualCarModel).toBe(expectedCarModel);
});

Then('I see car Modelyear, Powertrain and prices in dollars', async function () {
   await this.page.reload();
   await this.page.waitForTimeout(5000);
   modelYears = await availableCarsPage.availableCarsModelYears.all();
   powertrains = await availableCarsPage.availableCarsPowertrains.all();
   prices = await availableCarsPage.availableCarsPrices.all();

   const modelYearTexts = await Promise.all(modelYears.map(async el => await el.textContent()));
   const powertrainTexts = await Promise.all(powertrains.map(async el => await el.textContent()));
   const priceTexts = await Promise.all(prices.map(async el => await el.textContent()));

   console.log(`ModelYears:, [${modelYearTexts.length}[], Powertrains: [${powertrainTexts.length}] , Prices: [${priceTexts.length}]`);
   expect(modelYears.length).toBe(powertrains.length);
   expect(modelYears.length).toBe(prices.length);

});


Then('I click on the {string} button', async function (expectedCarModel) {
    await availableCarsPage.clickShowMore();
});

Then('I should see more car options with Modelyear, Powertrain and price details', async function () {
   modelYears = await availableCarsPage.availableCarsModelYears.all();
   powertrains = await availableCarsPage.availableCarsPowertrains.all();
   prices = await availableCarsPage.availableCarsPrices.all();

   const modelYearTexts = await Promise.all(modelYears.map(async el => await el.textContent()));
   const powertrainTexts = await Promise.all(powertrains.map(async el => await el.textContent()));
   const priceTexts = await Promise.all(prices.map(async el => await el.textContent()));
   
   console.log(`ModelYears:, [${modelYearTexts.length}[], Powertrains: [${powertrainTexts.length}] , Prices: [${priceTexts.length}]`);
   expect(modelYearTexts.length).toBe(powertrainTexts.length);
   expect(modelYearTexts.length).toBe(priceTexts.length);
});


When('I check the Sort by filter options', async function () {
  
});

Then('I verify the default sort {string} filter applied', async function (defaultFilter) {
  
});


Then('I Apply High Price Filter the the Cars Dispaly should be High to Low Sorted order', async function () {
  
});

Then('I Apply Low Price  Filter the the Cars Dispaly should be Low to Low Sorted order', async function () {
  
});

Then('I am on the car selection page', async function () {
  
});

Then('I select the following filters:', async function () {
  
});

Then('I Click on the results button', async function () {
  
});


Then('I should see cars that match the selected filters', async function () {
  
});


