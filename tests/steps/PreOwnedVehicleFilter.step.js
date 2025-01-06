const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { WebDashboard } = require('../pages/web_pages/WebDashboard');
const { expect } = require('@playwright/test');
const config = require('../commonPlatformUtils/CommonConstant.js');

let webDashboard, offerPage;

Given(`I Landed on the Polestar Homepage`, async function (){
    webDashboard = new WebDashboard(this.page);
    offerPage = webDashboard.getOfferPage();
    homePage = webDashboard.getHomePage();
    await homePage.goTo(config.PROD_WEB_URL);
    console.log('Successfully Navigated to the Homepage.');
});

Given(`I accepted cookies and click on the View Offers button`, async function(){
    await homePage.handleCookies("accept");
    console.log(`Accepted Cookies and Cliecking on the 'View Offers' Button.`);
    await homePage.clickOnOfferButton();
})

Given(`I navigate to the Pre-Owned Vehicle Offers section and Clicked on Filter button`, async () => {
    await offerPage.clickOnPreOwnedVehicleButton();
    await offerPage.click_FilterButton();
});

When(`I click on the {string} filter and select the checkbox option for {string}`,  async (label, value) => {
    await offerPage.applyFilter(label, value);
    console.log(`Applying Filter :\n - ${label} : ${value}`);
});


When(`I click the {string} button.`, async (buttonName) => {
    await offerPage.clickOnViewButton();
    console.log(`I clicked on "${buttonName}" button.`);
});


Then(`the results should match the filter criteria {string}.`, async(expectedResult) => {
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
