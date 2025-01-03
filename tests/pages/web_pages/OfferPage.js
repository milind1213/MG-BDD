const utils  = require('../../commonPlatformUtils/CommonPlaywright.js');
class OfferPage {
  constructor(page) {
    this.page = page;
    this.acceptAllCookiesButton = page.locator("//*[@id='onetrust-accept-btn-handler' and text()='Accept All Cookies']");
    this.newVehicleButton = page.locator("span[title='New vehicle offers']");
    this.preOwnedVehicleButton = page.locator('button[aria-controls="tabpanel-Pre-owned offers"]');
    this.filterButton = page.locator('button:has-text("Filter")').nth(0);
    this.viewBtn = page.locator("//*[@class='css-1p2wkou' ]//parent::button[@class='css-i96fc']");
  }

  async clickOnPreOwnedVehicleButton() {
    try {
         await this.page.evaluate(() => {
             window.scrollBy(0, 400);
        });
      utils.Click(this.preOwnedVehicleButton);
      
      } catch (error) {
        console.error("Error clicking on Pre Owned Vehicle Button:", error);
        throw error;
      }
    }

    async click_FilterButton() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await utils.Click(this.filterButton);
    }

    async applyFilter(filterText, value) {
        const filterLocator = this.page.locator(`//label[contains(@class,'css-c4oe05') and normalize-space(text())='${filterText}']`);
        const checkboxLocator = this.page.locator(`//input[@type="checkbox" and @value='${value}']`);
        await utils.Click(filterLocator);
        await checkboxLocator.waitFor({ state: 'visible', timeout: 60000 });
        await checkboxLocator.scrollIntoViewIfNeeded();

        await utils.Click(checkboxLocator);
        await this.page.waitForTimeout(5000);
        let isChecked = await checkboxLocator.isChecked();
      
        if (!isChecked) {
          await utils.Click(checkboxLocator);
          await this.page.waitForTimeout(500);
          isChecked = await checkboxLocator.isChecked();
        }
        if (isChecked) {
             console.log(`Checked for value :[${value}]`);
        } else {
             console.error(`Failed to Click CheckBox for value: ${value}`);
             throw new Error(`Checkbox was not checked for value: ${value}`);
        }
    }
    
    
  async clickOnNewVehicleButton() {
    try {
         await this.page.evaluate(() => {
             window.scrollBy(0, 400);
        });
    
       utils.Click(this.newVehicleButton);
      
      } catch (error) {
        console.error("Error clicking on New Vehicle Button:", error);
        throw error;
      }
    }
      
  async clickOnViewButton() 
  {
    await utils.Click(this.viewBtn);
  }
  
  async getResults() {
    try {
     if (await this.page.locator(".css-4kqkq9").isVisible()) {
          const notFoundText = await this.page.locator(".css-4kqkq9").innerText();
          console.log(`No offers found [: ${notFoundText}]`);
          return [notFoundText]; 
       }
          const filterLocator = this.page.locator("//*[@class='css-7iasm6']//p");
          const isFilterVisible = await filterLocator.first().isVisible();
       if (isFilterVisible)
       {
          const texts = await filterLocator.allInnerTexts();
          if (!texts || texts.length === 0) {
              console.warn("No filter results found.");
              return [];
           }
          console.log("Found results :", texts);
          return texts;
       }
         console.warn("No offers or results found.");
         return [];
      } catch (error) {
         console.error("Error Occurred :", error);
         return []; 
     }
}
  
  async getOfferResults() 
  {
    const results = await this.page.locator(".offer-results").innerText();
    return results;
  }

}

module.exports = { OfferPage };