const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const config =  require('../../common-platform-utils/common-constants.js');
const { WebDashboard } = require('../../page-objects/web-pages/web-dashboard.js');
const log = require('../../../utils/logger');


let webDashboard, offerPage,homePage;
Given('I navigate to the Homepage', async function (){
    webDashboard = new WebDashboard(this.page);
    offerPage = webDashboard.getOfferPage();
    homePage = webDashboard.getHomePage();
    await homePage.goTo(config.PROD_WEB_URL);
    log('Successfully Navigated to the Homepage.');
});

Given(`I accept cookies and click on the {string} button`, async (buttonName) => {
    await homePage.handleCookies("accept");
    log(`Accepted Cookies and Cliecking on the [${buttonName}] to the Homepage.`);
    await homePage.clickOnOfferButton();
});

Given(`I navigate to the {string} and Clicked on {string} button`, async (newVehicle, filterBtn) => {
    await offerPage.clickOnNewVehicleButton();
    log(`Successfully Clicked on the [${newVehicle}[] and [${filterBtn}[] buttons.`);
    await offerPage.click_FilterButton();
});

When(`I click on the {string} filter and select the checkbox for {string}`, async (label, value) => {
    await offerPage.applyFilter(label, value);
    log(`Applying Filter :\n - [${label}] : [${value}]`);
});

When(`I click the {string} button`, async (buttonName) => {
    await offerPage.clickOnViewButton();
    log(`I clicked on [${buttonName}] button.`);
});


Then(`the results should match the filter criteria {string}`, async (expectedResult) => {
    const results = await offerPage.getResults(); 
    if (results.length === 0 || results.includes("No offers found.")) {
        expect(results[0]).toBe(expectedResult);
        log(`Validation passed: No offers found as expected ("${expectedResult}").`);
    } else {
        expect(results).not.toBeNull();
        expect(results.length).toBeGreaterThan(0, 'No results were found.');
        results.forEach((result, index) => {
            expect(result).toContain(expectedResult, `Mismatch at index [${index}]: [${result}] does not contain [${expectedResult}].`);
        });
        log(`Validation passed: All results contain [${expectedResult}].`);
    }
});
