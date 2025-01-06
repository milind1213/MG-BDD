const {Given,When,Then, After,setDefaultTimeout } = require("@cucumber/cucumber");
const { WebDashboard } = require("../pages/web_pages/WebDashboard");
const { expect } = require("@playwright/test");
const config = require("../commonPlatformUtils/CommonConstant.js");

let webDashboard, availableCarsPage, selectedRetailerName;
let modelYears, powertrains, prices;

Given("I launch the URL and land on the homepage", async function () {
  webDashboard = new WebDashboard(this.page);
  homePage = webDashboard.getHomePage();
  availableCarsPage = webDashboard.getAvailableCarsPage();
  await homePage.goTo(config.PROD_WEB_URL);
  console.log("Successfully Navigated to the Homepage.");
});

Given("I accept cookies from the homepage", async function () {
  await homePage.handleCookies("accept");
  console.log(`Accepted Cookies on Homepage.`);
});

Given("I click on {string} from the homepage", async function (shoppingTools) {
  console.log(`Clicking on the [${shoppingTools}] on Homepage.`);
  await homePage.clickHeader(shoppingTools);
});

Given("I select the {string} option.", async function (availableCars) {
  await homePage.clickShoppingToolOption(availableCars);
});

When("I enter zip code and select an address from the suggestions",async function () {
    await availableCarsPage.enterPinCodeAndSelectAddress("43213");
  }
);

Then("I should continue with the selected Retailer address", async function () {
  await availableCarsPage.clickContiunWithAddressButton();
});

Then("I verify the default {string} car model displayed in filter",async function (expectedCarModel) {
    const actualCarModel = await availableCarsPage.getDefaultFilterCarModel();
    console.log("Default Filter Model : ", actualCarModel);
    expect(actualCarModel).toBe(expectedCarModel);
    await this.page.reload();
    await this.page.waitForTimeout(5000);
  }
);

Then("I see car Modelyear, Powertrain and prices in dollars",async function () {
    modelYears = await availableCarsPage.availableCarsModelYears.all();
    powertrains = await availableCarsPage.availableCarsPowertrains.all();
    prices = await availableCarsPage.availableCarsPrices.all();

    const modelYearTexts = await Promise.all(modelYears.map(async (el) => await el.textContent()));
    const powertrainTexts = await Promise.all(powertrains.map(async (el) => await el.textContent()));
    const priceTexts = await Promise.all(prices.map(async (el) => await el.textContent()));

    console.log(`ModelYears:, [${modelYearTexts.length}], Powertrains: [${powertrainTexts.length}] , Prices: [${priceTexts.length}]`);
    expect(modelYears.length).toBe(powertrains.length);
    expect(modelYears.length).toBe(prices.length);
  }
);

Then("I click on the {string} button", async function (expectedCarModel) {
  await availableCarsPage.clickShowMore();
});

Then("I should see more car options with Modelyear, Powertrain and price details",async function () {
    modelYears = await availableCarsPage.availableCarsModelYears.all();
    powertrains = await availableCarsPage.availableCarsPowertrains.all();
    prices = await availableCarsPage.availableCarsPrices.all();

    const modelYearTexts = await Promise.all(modelYears.map(async (el) => await el.textContent()));
    const powertrainTexts = await Promise.all(powertrains.map(async (el) => await el.textContent()));
    const priceTexts = await Promise.all(prices.map(async (el) => await el.textContent()));

    console.log(`ModelYears:, [${modelYearTexts.length}], Powertrains: [${powertrainTexts.length}] , Prices: [${priceTexts.length}]`);
    expect(modelYearTexts.length).toBe(powertrainTexts.length);
    expect(modelYearTexts.length).toBe(priceTexts.length);
  }
);

Then("I verify the default sort {string} filter applied",async function (defaultFilter) {
    const actual = await availableCarsPage.getDefaultSortFilterText();
    expect(actual).toBe(defaultFilter);
  }
);

Then('I Apply Price {string} Filter the the Cars Dispaly should be {string} Sorted order', async function(priceFilter, expectedOrder) {
    await availableCarsPage.applySortFilter(priceFilter);
    prices = await availableCarsPage.availableCarsPrices.all();
    const priceTexts = await Promise.all(prices.map(async (el) => await el.textContent()));
    const priceNumbers = priceTexts.map((price) =>parseInt(price.replace(/[$,]/g, ""), 10));
    const actualorder = config.checkOrder(priceNumbers);
    expect(actualorder).toBe(expectedOrder);
  }
);

When(`I apply the following filters from car selection page :`,async (dataTable) => {
   await availableCarsPage.clickOnFilter();
   const filters = dataTable.hashes();
   for (const row of filters) {
    for (const [label, value] of Object.entries(row)) {
      if (value && value.trim()) {
         if (label === "Exterior"){
             await availableCarsPage.applyExteriorFilter(value);
         } else if (["Version", "Packs", "Options", "Interior", "Wheels"].includes(label)) {
             await availableCarsPage.applyFeatureFilter(label, value);
         } else {
             console.log(`Unknown filter type for ${label}`);
         }
        } else {
           console.log(`No value provided for filter: ${label}. Skipping.`);
        }
      }  
    }
});

Then("I Click on the results button", async function () {
  await availableCarsPage.clickResultButton();
});

Then('I should see cars that match the selected filters:', async function (dataTable) {
  const expectedFilters = dataTable.hashes()[0];
  const appliedFiltersElements = await availableCarsPage.appliedFilters.all();
  const appliedFiltersTexts = await Promise.all(appliedFiltersElements.map(async (el) => await el.textContent()) );

  console.log('Applied Filters:', appliedFiltersTexts);
  for (const [label, value] of Object.entries(expectedFilters)) 
  {
   if (value && value.trim()) 
   {
      const isFilterPresent = appliedFiltersTexts.some((filterText) => filterText.includes(value));
     if (!isFilterPresent) 
     {
        throw new Error(`Filter mismatch: Expected "${value}" for "${label}", but it was not found in the results.`);
     }
    }
  }
  console.log('All filters match successfully.');
});
