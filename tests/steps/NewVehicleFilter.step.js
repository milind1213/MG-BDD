const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { WebDashboard } = require('../pages/web_pages/WebDashboard');
const { expect } = require('@playwright/test');
const config = require('../commonPlatformUtils/CommonConstant.js');

let webDashboard, offerPage ,homePage;
Given('I navigate to the Homepage', async function (){
    webDashboard = new WebDashboard(this.page);
    offerPage = webDashboard.getOfferPage();
    homePage = webDashboard.getHomePage();
    await homePage.goTo(config.PROD_WEB_URL);
    console.log('Successfully Navigated to the Homepage.');
});

Given(`I accept cookies and click on the {string} button`, async (buttonName) => {
    await homePage.handleCookies("accept");
    console.log(`Accepted Cookies and Cliecking on the ${buttonName} to the Homepage.`);
    await homePage.clickOnOfferButton();
});

Given(`I navigate to the {string} and Clicked on {string} button`, async (newVehicle, filterBtn) => {
    await offerPage.clickOnNewVehicleButton();
    console.log(`Successfully Clicked on the ${newVehicle} and ${filterBtn} buttons.`);
    await offerPage.click_FilterButton();
});

When(`I click on the {string} filter and select the checkbox for {string}`, async (label, value) => {
    await offerPage.applyFilter(label, value);
    console.log(`Applying Filter :\n - ${label} : ${value}`);
});

When(`I click the {string} button`, async (buttonName) => {
    await offerPage.clickOnViewButton();
    console.log(`I clicked on "${buttonName}" button.`);
});


Then(`the results should match the filter criteria {string}`, async (expectedResult) => {
    const results = await offerPage.getResults(); 
    if (results.length === 0 || results.includes("No offers found.")) {
        expect(results[0]).toBe(expectedResult);
        console.log(`Validation passed: No offers found as expected ("${expectedResult}").`);
    } else {
        expect(results).not.toBeNull();
        expect(results.length).toBeGreaterThan(0, 'No results were found.');
        results.forEach((result, index) => {
            expect(result).toContain(expectedResult, `Mismatch at index ${index}: "${result}" does not contain "${expectedResult}".`);
        });
        console.log(`Validation passed: All results contain "${expectedResult}".`);
    }
});
