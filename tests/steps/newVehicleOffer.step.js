const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { WebDashboard } = require('../pages/PoleWeb/WebDashboard');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const { url } = require('../../configDirectory/testConfig');

let browser, context, page, webDashboard, offerPage;
setDefaultTimeout(60 * 1000);
Given(`I navigate to the Homepage`, async () => {
    console.log('Launching browser and navigating to the homepage...');
    browser = await chromium.launch({ headless: false }); 
    context = await browser.newContext();
    page = await context.newPage();
    webDashboard = new WebDashboard(page);
    offerPage = webDashboard.offerPage;
    await offerPage.goTo(url);
    console.log('Successfully navigated to the Homepage.');
});

Given(`I accept cookies and click on the {string} button`, async (buttonName) => {
    console.log(`Accepting cookies and clicking on the "${buttonName}" button...`);
    await offerPage.handleCookies("accept");
    await offerPage.clickOnOfferButton();
    console.log(`Clicked "${buttonName}" button.`);
});

Given(`I navigate to the {string} and Clicked on {string} button`, async (newVehicle, filterBtn) => {
    console.log(`Navigating to the "${newVehicle}" section...`);
    await offerPage.clickOnNewVehicleButton();
    await offerPage.click_FilterButton();
    console.log(`Successfully clicked on "${filterBtn}".`);
});

When(`I click on the {string} filter and select the checkbox for {string}`, async (label, value) => {
    console.log(`Applying Filter : `);
    console.log(` - ${label} : ${value}`);
    await offerPage.applyFilter(label, value);
});

When(`I click the {string} button`, async (buttonName) => {
    console.log(`I clicked on "${buttonName}" button.`);
    await offerPage.clickOnViewButton();
});


Then(`the results should match the filter criteria {string}`, async (expectedResult) => {
    console.log(`Validating that the results match the filter criteria: "${expectedResult}"...`);
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
    console.log('Closing the browser...');
    await browser.close();
});