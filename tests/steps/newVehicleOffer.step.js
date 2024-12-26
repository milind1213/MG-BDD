const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { WebDashboard } = require('../pages/PoleWeb/WebDashboard');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const { url } = require('../../configDirectory/testConfig');

let webDashboard, offerPage;

Given('I navigate to the Homepage', async function () {
    webDashboard = new WebDashboard(this.page);
    offerPage = webDashboard.getOfferPage();
    await offerPage.goTo(url);
    console.log('Successfully Navigated to the Homepage.');
});

Given(`I accept cookies and click on the {string} button`, async (buttonName) => {
    await offerPage.handleCookies("accept");
    await offerPage.clickOnOfferButton();
});

Given(`I navigate to the {string} and Clicked on {string} button`, async (newVehicle, filterBtn) => {
    await offerPage.clickOnNewVehicleButton();
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

After(async function () {
    if (this.browser) {
        await this.browser.close();
    } else {
        console.warn("Browser instance was not initialized.");
    }
});